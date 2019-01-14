<template>
    <div>
        <div class="minibar" :style="{visibility: visibility}">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    v-once
            >
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">商家入驻</text>
                <!--<text :style="GLOBAL.headerRight"  slot="right">帮助</text>-->
            </wxc-minibar>
        </div>
        <list class="list">
            <refresh class="refresh" @refresh="onRefresh()" :display="refreshing ? 'show' : 'hide'">
                <!--<text class="indicator-text">Refreshing ...</text>-->
                <!--<loading-indicator class="indicator"></loading-indicator>-->
                <image class="loadingImg" src="https://image.aftdc.com/appBimg/ic_loading_gif.gif"></image>
            </refresh>
            <cell>
                <div class="tips">
                    <!--0待审核 -3已退款 -2退款中 -1审核失败 2未付款，初审通过 3 已付款，请设置登录密码 1 开店成功-->
                    <text :style="{fontSize:GLOBAL.bigFS,color:'#fe9f31'}" v-if="enterInfo.shopStatus==0">待提交开店申请</text>
                    <text :style="{fontSize:GLOBAL.bigFS,color:'#fe9f31'}" v-else-if="enterInfo.shopStatus==4">资质信息已提交，请耐心等待审核</text>
                    <text :style="{fontSize:GLOBAL.bigFS,color:'#fe9f31'}" v-else-if="enterInfo.shopStatus==1">开店成功</text>
                    <text :style="{fontSize:GLOBAL.bigFS,color:'#fe9f31'}" v-else-if="enterInfo.shopStatus==2">审核通过,待付款</text>
                    <text :style="{fontSize:GLOBAL.bigFS,color:'#fe9f31'}" v-else-if="enterInfo.shopStatus==3">已付款，请设置登录密码</text>
                    <text :style="{fontSize:GLOBAL.bigFS,color:'#fe9f31'}" v-else-if="enterInfo.shopStatus==-1" @click="closeMsg">审核失败，点击查看原因</text>
                    <text :style="{fontSize:GLOBAL.bigFS,color:'#fe9f31'}" v-else-if="enterInfo.shopStatus==-2">退款中</text>
                    <text :style="{fontSize:GLOBAL.bigFS,color:'#fe9f31'}" v-else-if="enterInfo.shopStatus==-3">已退款</text>
                    <text :style="{fontSize:GLOBAL.bigFS,color:'#fe9f31'}" v-if="enterInfo.shopStatus==0">请完善资质信息，提交开店申请</text>
                </div>
                <div style="flex-direction: row;padding: 20px;align-items: center">
                    <div style="margin-right: 20px;">
                        <image class="picture" :src="'https://image.aftdc.com/'+enterInfo.shopImg"></image>
                    </div>
                    <div>
                        <text  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{enterInfo.shopName}}</text>
                        <text  :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">门店联系人: {{enterInfo.userName}}</text>
                        <div style="flex-direction: row">
                            <text :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">( </text>
                            <text :style="{fontSize:GLOBAL.defaultFS,color:'#53beb7'}">{{enterInfo.phone}}</text>
                            <text :style="{fontSize:GLOBAL.defaultFS,color:'#999'}"> )</text>
                        </div>
                        <text :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">创建时间: {{enterInfo.createTime}}</text>
                    </div>
                </div>
                <!--progress 0未填写 1第一步 2第二部 3第三部 -->
                <div :class="[enterInfo.progress>0?'messages':'message']">
                    <div>
                        <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">店铺信息</text>
                    </div>
                    <div style="flex-direction: row;align-items: center">
                        <text v-if="enterInfo.progress>0" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">已填写 </text>
                        <text v-else :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}" @click="toJump(0)">未填写 </text>
                        <image class="right" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                    </div>
                </div>
                <div :class="[enterInfo.progress>1?'messages':'message']">
                    <div>
                        <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">资质信息</text>
                    </div>
                    <div style="flex-direction: row;align-items: center">
                        <text v-if="enterInfo.shopStatus == -1" :style="{fontSize:GLOBAL.defaultFS,color:'#f00'}" @click="toJump(1)">请修改 </text>
                        <text v-else-if="enterInfo.progress>1" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">已填写 </text>
                        <text v-else :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}" @click="toJump(1)">未填写 </text>
                        <image class="right" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                    </div>
                </div>
                <div :class="[enterInfo.progress>2?'messages':'message']">
                    <div>
                        <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">合作信息</text>
                    </div>
                    <div style="flex-direction: row;align-items: center">
                        <text v-if="enterInfo.progress>2" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">已填写 </text>
                        <text v-else :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}" @click="toJump(2)">未填写 </text>
                        <image class="right" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                    </div>
                </div>

                <div class="btn" v-if="enterInfo.shopStatus==1">
                    <text class="out" :style="{fontSize:GLOBAL.bigFS,color:'#fff'}"  @click="deleteShop">注销店铺</text>
                </div>
                <div class="btn" v-else-if="enterInfo.shopStatus==2" >
                    <text class="setMima" :style="{fontSize:GLOBAL.bigFS,color:'#fff'}" @click="setMima">审核通过,待付款</text>
                </div>
                <div class="btn"  v-else-if="enterInfo.shopStatus==3">
                    <text class="setMima" :style="{fontSize:GLOBAL.bigFS,color:'#fff'}" @click="setMima">设置登录密码</text>
                </div>
            </cell>
        </list>

        <div class="loading" @click="setPw=false" v-if="setPw"></div>
        <div class="loadingBack"  v-if="setPw">
            <div class="pwBox" @click.stop="">
                <text class="pwBoxTitle">设置密码</text>
                <input class="input" :style="GLOBAL.inputText" type="password" v-model="pw" placeholder="输入密码">
                <input class="input" :style="GLOBAL.inputText" type="password" v-model="pws" placeholder="确认密码">
                <div class="btn">
                    <text class="setMima" :style="{fontSize:GLOBAL.bigFS,color:'#fff'}"  @click="setPassword">确定</text>
                </div>
            </div>
        </div>

        <div class="loading" @click="msg=false" v-if="msg"></div>
        <div class="loadingBack"  v-if="msg">
            <div class="msgBox" @click.stop="">
                <text class="pwBoxTitle">审核失败原因</text>
                <text class="msgText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}" v-for="(i,index) in enterInfo.error_msg">{{index+1}}. {{i}}</text>
                <div class="btn">
                    <text class="setMima" :style="{fontSize:GLOBAL.bigFS,color:'#fff'}"  @click="closeMsg">确定</text>
                </div>
            </div>
        </div>

        <toast ref="toast"></toast>
    </div>
</template>

<script>
    import {WxcIcon,WxcMinibar} from 'weex-ui';
    import Toast from './Toast.vue';
    const event = weex.requireModule('event');
    const post = weex.requireModule('stream');
    const navigator = weex.requireModule('navigator');
    const modal = weex.requireModule('modal');
    export default {
        components: {WxcIcon,WxcMinibar,Toast},
        data() {
            return {
                visibility:'hidden',
                backImgToggle: 0,//头部返回图片判断
                enterInfo:[],
                setPw:false,
                msg:false,
                pw:'',
                pws:'',
                token:'',
                phone:'',
                refreshing:false,
                // imei:'b7ba4687f3bde1224bc3b944d7ac5d0b6c8a4dc1',
            }
        },
        created: function () {
            var that=this
            that.visibility='hidden';
            this.phone = JSON.parse(weex.config.param).phone;
            this.token = JSON.parse(weex.config.param).token;
            that.createdMethods();

        },
        mounted() {
            var that = this;
            that.visibility='visible';
        },
        methods:{
            createdMethods(){
                var that = this;
                var param = 'phone='+this.phone+'&token='+this.token;
                post.fetch({
                    method: 'post',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/businessapp/Enter/enterInfo',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                },function(res){
                    if (res.data.res == -1){
                        const toast = that.$refs.toast;
                        toast.editContent(res.data.info);
                    }else{
                        that.enterInfo = res.data.data;
                        if (res.data.data.shopStatus == -1) {
                            that.msg = true
                        }
                    }
                })
            },
            onRefresh:function() {
                var that=this
                that.refreshing = true
                setTimeout(() => {
                    that.refreshing = false
                }, 2000)
                that.createdMethods();


            },
            minibarLeftButtonClick(){

            },
            toJump(index){
                const toast = this.$refs.toast;
                var param = JSON.stringify({
                    phone:this.phone,
                    token:this.token,
                });
                if(index==0){
                    let url='http://assets/enterMessage.js'
                    event.toUrl({"url":url,"param":param})
                }else if(index==1){
                    if (this.enterInfo.progress==1||this.enterInfo.shopStatus == -1) {
                        let url='http://assets/credentialsMessage.js'
                        var param = JSON.stringify({
                            phone:this.phone,
                            token:this.token,
                            shopType:this.enterInfo.shopType
                        });
                        event.toUrl({"url":url,"param":param})
                    }else {
                        toast.editContent('请完善上一步资质信息');
                    }
                }else if(index==2){
                    if (this.enterInfo.progress==2) {
                        let url='http://assets/agreeEnter.js'
                        event.toUrl({"url":url,"param":param})
                    }else {
                        toast.editContent('请完善上一步资质信息');
                    }
                }
            },
            setMima(){
                this.setPw = true
            },
            closeMsg(){
                this.msg = !this.msg
            },
            setPassword(){
                const toast = this.$refs.toast;

                if (this.pw ==''||this.pws =='') {
                    toast.editContent('请输入');
                    return false
                }

                if (this.pw !== this.pws) {
                    toast.editContent('两次输入的密码不一致');
                    return false
                }
                if (this.pw.length<8){
                    toast.editContent('密码至少8位数');
                    return false
                }
                var pattern = /^.*(?=.{8,30})(?=.*\d)(?=.*[A-z])(?=.*[!@#$%^&*?.,_+\(\)]).*$/;
                var a = pattern.test(this.pw);
                if (!a){
                    toast.editContent('密码需要包含字母，数字，符号');
                    return false;
                }

                var that = this;
                var param = 'phone='+this.phone+'&token='+this.token+'&passWord='+this.pw;
                post.fetch({
                    method: 'post',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/businessapp/Enter/setPassword',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                },function(r){
                    if (r.data.res == 0){
                        toast.editContent('设置失败,请稍后再试');
                    }else{
                        that.setPw = false
                        that.enterInfo.shopStatus = 1
                        toast.editContent('设置成功,前往登录');
                        setTimeout(function(){
                            var url='http://assets/login.js';
                            var param='';
                            event.toUrl({url:url,param:param});
                            event.backToIndex(2);
                        },1000);
                    }
                })
            },
            deleteShop(){
                var that = this
                modal.confirm({
                    message: "注销店铺将删除您在阿凡提点餐的全部信息，点击'取消'关闭窗口",
                    okTitle: '确定',
                    cancelTitle: '取消'
                }, result => {
                    this.res = result
                    if(this.res=='确定'){
                        var that = this;
                        var param = 'phone='+this.phone+'&token='+this.token;
                        post.fetch({
                            method: 'post',
                            type: 'json',
                            body: param,
                            url: 'https://www.aftdc.com/businessapp/Enter/deleteShop',
                            headers: {"Content-Type": "application/x-www-form-urlencoded"},
                        },function(r){
                            if (r.data.res == 0){
                                const toast = that.$refs.toast;
                                toast.editContent('注销失败');
                            }else{
                                const toast = that.$refs.toast;
                                toast.editContent('注销成功');
                                setTimeout(()=>navigator.pop({ animated: 'true' }),2000);
                            }
                        })
                    }else {
                        return false;
                    }
                })
            }
        },
    }

</script>


<style scoped>
    .list {
        position: absolute;
        top: 89px;
        bottom: 0;
        left: 0;
        right: 0;
    }



    .backImg {
        width: 40px;
        height: 40px;
    }


    .tips {
        padding: 20px;
        padding-left: 40px;
        background-color: #fef6ef;
    }

    .picture {
        width: 160px;
        height: 160px;

    }

    .messages {
        flex-direction: row;
        justify-content: space-between;
        margin-left: 20px;
        margin-right: 20px;
        padding-top: 40px;
        padding-bottom: 40px;
        border-bottom-color: #999;
        border-bottom-style: solid;
        border-bottom-width: 1px;
        align-items: center;
        justify-items: center;
    }

    .message {
        flex-direction: row;
        justify-content: space-between;
        margin-left: 20px;
        margin-right: 20px;
        padding-top: 40px;
        padding-bottom: 40px;
        border-bottom-color: #999;
        border-bottom-style: solid;
        border-bottom-width: 1px;
        align-items: center;
        justify-items: center;
    }

    .message:active {
        background-color: rgba(153, 153, 153, 0.1);
    }

    .out:active {
        background-color: #e64500;
    }

    .out {
        width: 600px;
        padding-top: 25px;
        padding-bottom: 25px;
        padding-left: 30px;
        padding-right: 30px;
        background-color: #ff4500;
        border-radius: 10px;
        text-align: center;
        border-color: #880000;
        border-width: 1px;
        border-style: solid;
    }

    .setMima {
        width: 600px;
        padding-top: 25px;
        padding-bottom: 25px;
        padding-left: 30px;
        padding-right: 30px;
        background-color: #53beb7;
        border-radius: 10px;
        text-align: center;
    }
    .setMima:active{
        background-color: #57aba5;
    }

    .btn {
        height: 120px;
        line-height: 120px;
        align-items: center;
        justify-items: center;
        margin-top: 40px;
    }

    .right {
        width: 25px;
        height: 25px;
    }

    .loading {
        width: 750px;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: #999;
        opacity: 0.5;
    }

    .loadingBack {
        width: 750px;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .pwBox{
        width: 700px;
        height: 500px;
        background-color: #f8f8f8;
        border-width: 1px;
        border-color: #999;
        border-style: solid;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    .pwBoxTitle{
        height: 100px;
        line-height: 100px;
        font-size: 40px;
        color: #333;
        text-align: center;
    }
    .input {
        width: 600px;
        margin-top: 40px;
        height: 80px;
        line-height: 80px;
    }
    .msgBox{
        width: 700px;
        height: auto;
        background-color: #f8f8f8;
        border-width: 1px;
        border-color: #999;
        border-style: solid;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    .msgText{
        width: 640px;
        text-align: left;
        margin-top: 30px;
    }
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
    }
    .loadingImg{
        width: 90px;
        height: 66px;
    }
</style>