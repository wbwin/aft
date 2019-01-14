
<template>
    <div class="colection">
        <div>
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    @wxcMinibarRightButtonClicked="minibarRightButtonClick"

            >
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">消息中心</text>
                <text :style="{fontSize:'32px',color:isEdit?'#f85c5e':'#fff'}"  slot="right">{{isEdit?'取消':'编辑'}}</text>

            </wxc-minibar>
        </div>

        <!--消息通知列表-->
        <list class="scroller" show-scrollbar="false">

            <refresh class="refresh" @refresh="onrefresh" :display="refreshing? 'show' : 'hide'">
                <image class="indicator" src="https://image.aftdc.com/appBimg/ic_loading_gif.gif"></image>
            </refresh>

            <cell class="cell" ref="shopDel">
                <div class="newAllDiv" v-for="(item,index) in messageInfo" :key="index">

                    <image class="selectIcon" :src="messageLength[index].select?'https://image.aftdc.com/appBimg/ic_check_box_checked.png':'https://image.aftdc.com/appBimg/ic_check_box_normal.png'"></image>

                    <div class="row newAll" @click="classification(index,item.action)">
                        <image class="useImg" :src="item.img" @click.stop="personeHomePage(index)"></image>
                        <div>
                            <div class="row name">
                                <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}" @click.stop="personeHomePage(index)">{{item.name}}</text>
                                <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}" >{{item.msg}}</text>
                            </div>
                            <text :style="{fontSize:GLOBAL.defaultFS,color:'#999'}" >{{item.timestamp}}</text>
                        </div>
                    </div>

                    <!--选择删除点击白板-->
                    <div class="balnk" v-if="isEdit" @click="delSelect(index)"></div>

                </div>
            </cell>

            <loading class="loading" @loading="onloading" :display="loadinging ? 'show' : 'hide'">
                <image class="indicator" src="https://image.aftdc.com/appBimg/ic_loading_gif.gif" v-if="!noMore"></image>
                <div class="moreRecentlyOrder" v-else>
                    <text class="moreRecentlyOrderText">没有更多了~</text>
                </div>
            </loading>

        </list>


        <div :style="{height:'100px'}" v-if="isEdit"></div>

        <!--店铺删除全选-->
        <div class="row allSelectDiv" ref="allSelect" v-if="messageInfo.length>0">
            <div class="row allSelect" @click="allSelectClick">
                <image class="allSelectIcon" :src="isAllSelect?'https://image.aftdc.com/appBimg/ic_check_box_checked.png':'https://image.aftdc.com/appBimg/ic_check_box_normal.png'"></image>
                <text class="allSelectText">{{isAllSelect?'全不选':'全选'}}</text>
            </div>
            <text class="delText" @click="allDel">删除</text>
        </div>

        <toast ref="toast"></toast>

    </div>

    <!--</div>-->
</template>

<script>
    import { WxcMask,WxcPopup,WxcPopover,WxcMinibar } from 'weex-ui';
    import  Toast from './Toast.vue';
    import noOrder from './noOrder.vue';
    const event=weex.requireModule('event');
    const post = weex.requireModule('stream');
    const navigator = weex.requireModule('navigator');
    const animation = weex.requireModule('animation');
    const modal = weex.requireModule('modal');
    export default {
        components: { WxcMask,WxcPopup,WxcPopover,Toast,WxcMinibar,noOrder },
        name: 'App',
        data() {
            return {
                refreshing:false,
                loadinging:false,
                isEdit:false,
                isAllSelect:false,
                noMore:false,
                messageLength:[],

                messageInfo:[],

                token:'',
                imei:'',
            }
        },
        created(){
            var that=this;
            event.init();
            that.token = weex.config.token;
            that.imei = weex.config.imei;
            // that.token = 'WAODKBHUTJUKH1WLAXFY1542613545';
            // that.imei = 'd4f4af29892c41b0be9555f85e1252c6';
            that.getNews(0);
        },
        methods: {
            delSelect(index){
                var that=this;
                if(that.messageLength[index].select){

                    that.messageLength[index].select=false;

                    let num=0
                    for(var i in that.messageLength){
                        if(!that.messageLength[i].select){
                            num+=1;
                        }
                    }
                    if(num==that.messageLength.length){
                        that.isAllSelect=false;
                    }
                }
                else{
                    that.messageLength[index].select=true;
                    let num=0
                    for(var i in that.messageLength){
                        if(that.messageLength[i].select){
                            num+=1;
                        }
                    }
                    if(num==that.messageLength.length){
                        that.isAllSelect=true;
                    }
                }

            },

            allSelectClick(){//全选/全不选
                var that=this;
                if(that.isAllSelect){
                    that.isAllSelect=false;
                    for(var i in that.messageLength){
                        that.messageLength[i].select=false;
                    }
                }
                else{
                    that.isAllSelect=true;
                    for(var i in that.messageLength){
                        that.messageLength[i].select=true;
                    }
                }
            },

            allDel() {//执行删除
                var that=this;
                let num=0;
                var delArr= [];
                for(var i in that.messageLength){
                    if(that.messageLength[i].select){
                        delArr.push(that.messageInfo[i].id)
                        num+=1;
                    }
                }
                if(num==0){
                    const toast =that.$refs.toast;
                    toast.editContent('未选择删除项');
                    return false;
                }

                // modal.toast({
                //     message:JSON.stringify(delArr)
                // })

                var param = this.GLOBAL.sign(that.token,that.imei);
                param+='&delArr='+JSON.stringify(delArr);
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/businessapp/Store/delMessage',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                }, function (res) {
                    if (res.data.res == 1) {

                        const toast =that.$refs.toast;
                        toast.editContent(res.data.info);

                        // 删除dynamicLngth被删除的数据
                        for(var i=that.messageLength.length-1;i>-1;i--){
                            if(that.messageLength[i].select){
                                that.messageInfo.splice(i,1)
                            }
                        }

                        //定时器,防止删除dynamic数据时,dynamicLngth已经被清空
                        setTimeout(function () {
                            //清空dynamicLngth中保存dynamicLngth删除选择的数据
                            that.messageLength=[];
                            //从新给dynamicLngth赋值
                            for(var i in that.messageInfo){
                                that.messageLength.push({select:false})
                            }
                        },20)

                        //收起删除按钮
                        that.minibarRightButtonClick();
                    }
                    else{
                        const toast =that.$refs.toast;
                        toast.editContent(res.data.info);
                    }
                })
            },

            getNews(index){//获取店铺数据
                var that=this;
                var param= that.GLOBAL.sign(that.token,that.imei);
                param+= '&page=0';

                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: 'https://www.aftdc.com/businessapp/Store/getMessageDetails',
                }, function (res) {
                    if(res.data.res==1){
                        var messageInfo=res.data.data.messageInfo;
                        that.messageInfo=messageInfo;

                        that.messageLength=[];
                        //获取数据时,向shopInfoLngth添加数据
                        for(var i in that.messageInfo){
                            that.messageLength.push({select:false})
                        }
                        if(messageInfo.length<20){
                            that.noMore=true;
                        }
                    }
                    else{
                        that.noMore=true;
                        if(index==1){
                            const toast =that.$refs.toast;
                            toast.editContent(res.data.info);
                        }
                    }
                    that.refreshing=false;
                });
            },

            onrefresh() {//店铺下拉刷新
                var that=this;
                that.refreshing=true;
                that.getNews(1);
                if(that.isEdit){
                    that.minibarRightButtonClick();
                }
            },

            onloading() {//店铺上拉加载
                var that=this;
                that.loadinging=true;
                var page=that.messageInfo.length;
                var param= that.GLOBAL.sign(that.token,that.imei);
                param+= '&page='+page;

                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: 'https://www.aftdc.com/businessapp/Store/getMessageDetails',
                }, function (res) {
                    if(res.data.res==1){
                        var messageInfo=res.data.data.messageInfo;
                        that.messageInfo=that.messageInfo.concat(messageInfo);

                        //更新用于删除选择功能的shopInfoLngth
                        for(var i in messageInfo){
                            that.messageLength.push({select:false})
                        }

                        // 重置全选状态
                        that.isAllSelect=false;
                    }
                    else{
                        const toast =that.$refs.toast;
                        toast.editContent(res.data.info);
                        that.noMore=true;
                    }
                    that.loadinging=false;
                });
            },

            minibarLeftButtonClick() {
                navigator.pop({animated: 'false'});
            },

            minibarRightButtonClick() {
                var that = this;
                var testEl = that.$refs.shopDel;
                var testE2 = that.$refs.allSelect;
                if (!that.isEdit) {
                    that.isEdit=true;
                    animation.transition(testEl, {
                        styles: {
                            transform: 'translate(60px, 0px)',
                        },
                        duration: 200, //ms
                        timingFunction: 'ease',
                        delay: 0 //ms
                    })
                    animation.transition(testE2, {
                        styles: {
                            transform: 'translate(0px, -100px)',
                        },
                        duration: 200, //ms
                        timingFunction: 'ease',
                        delay: 0 //ms
                    })
                }
                else {
                    that.isEdit=false;
                    animation.transition(testEl, {
                        styles: {
                            transform: 'translate(0px, 0px)',
                        },
                        duration: 200, //ms
                        timingFunction: 'ease',
                        delay: 0 //ms
                    })
                    animation.transition(testE2, {
                        styles: {
                            transform: 'translate(0px, 0px)',
                        },
                        duration: 200, //ms
                        timingFunction: 'ease',
                        delay: 0 //ms
                    })

                    // 点击关闭编辑时,把选择的项去除,和恢复全选按钮的原状态
                    for (var i in that.messageLength) {
                        that.messageLength[i].select = false;
                    }
                    that.isAllSelect = false;
                }
            },

            personeHomePage(index) {//跳转至个人主页
                var that = this;
                var userId = that.messageInfo[index].userId;
                var param = {userId: userId};
                var url = 'http://assets/userArticle.js';
                event.toUrl({url: url, param: JSON.stringify(param)});
            },

            classification(index,action) {//评论详情页、留言详情页、评价详情页
                var that=this;
                var typeId=that.messageInfo[index].typeId;
                if(action==5){//评价详情页
                    var url='http://assets/rating.js';
                    var param='';
                    event.toUrl({url:url,param:param});
                }
                else if(action==2){//评论详情页
                    var url='http://assets/detailsOfNotification.js';
                    var param=JSON.stringify({typeId:typeId,action:2});
                    event.toUrl({url:url,param:param});
                }
                else if(action==3){//留言详情页
                    var url='http://assets/detailsOfNotification.js';
                    var param=JSON.stringify({typeId:typeId,action:3});
                    event.toUrl({url:url,param:param});
                }
            },
        }
    }

</script>

<style scoped>




    /*下拉刷新*/
    .refresh {
        width: 750px;
        display: -ms-flex;
        display: -webkit-flex;
        display: flex;
        -ms-flex-align: center;
        -webkit-align-items: center;
        -webkit-box-align: center;
        align-items: center;
        background-color: #fff;
    }
    .indicator {
        margin-top: 16px;
        height: 100px;
        width: 100px;
        color: #53beb7;
        margin-bottom: 16px;
    }
    .loading {
        width: 750px;
        display: -ms-flex;
        display: -webkit-flex;
        display: flex;
        -ms-flex-align: center;
        -webkit-align-items: center;
        -webkit-box-align: center;
        align-items: center;
        background-color: #fff;
    }
    .moreRecentlyOrder{
        align-items: center;
        justify-content: center;
        height: 80px;
    }
    .moreRecentlyOrderText{
        font-size: 28px;
        color:#999;
    }





    /*白板*/
    .balnk{
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
    }





    /*删除全选*/
    .allSelect{
        flex: 1;
        position: relative;
        border-right-style: solid;
        border-right-width: 4px;
        border-right-color: #dedede;
    }
    .allSelectIcon{
        position: absolute;
        width: 40px;
        height: 40px;
        top: 22px;
        left: 40px;

    }
    .allSelectText{
        text-align: center;
        line-height: 80px;
        flex: 1;
    }
    .allSelectDiv{
        height: 100px;
        padding-top: 10px;
        padding-bottom: 10px;
        margin-bottom: -100px;
        background-color: #fff;
        border-top-style: solid;
        border-top-width: 1px;
        border-top-color: #dedede;
    }
    .delText{
        text-align: center;
        line-height: 80px;
        flex: 1;
    }






    .name{
        justify-content: space-between;
        width: 590px;
        margin-bottom: 20px;
    }
    .useImg{
        width: 100px;
        height: 100px;
        border-radius: 50px;
        margin-right: 20px;
    }
    .selectIcon{
        width: 40px;
        height: 40px;
        margin-left: 20px;
        margin-right: 20px;
        margin-top: 25px;
    }
    .newAllDiv{
        flex-direction: row;
        padding-top: 20px;
        padding-bottom: 20px;
        padding-right: 20px;
        border-bottom-style: solid;
        border-bottom-width: 1px;
        border-bottom-color: #f1f1f1;
        position: relative;
    }
    .newAll{
    }
    .cell{
        width: 810px;
        margin-left: -60px;
    }
    .scroller{
        flex: 1;
        width: 750px;
        background-color: #fff;
    }
    .colection{
        background-color: #f8f8f8;
    }
    .row{
        flex-direction: row;
        align-items: center;
    }
</style>
