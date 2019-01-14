<template>
    <div class="wrapper">

        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    v-once
            >
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">我的反馈</text>
            </wxc-minibar>
        </div>

        <div class="unFeedBack" v-if="myFeedback.length<=0">
            <image class="imgDefault unFeedBackImg" src="https://image.aftdc.com/appBimg/icon_no_order.png"></image>
            <text class="unFeedBackText" :style="{fontSize:GLOBAL.bigFS}">暂无反馈</text>
        </div>
        <list class="scroller" v-if="myFeedback.length>0">
            <cell class="cell" v-for="(item,index) in myFeedback">
                <div class="listCell">
                    <div class="cellContent">
                        <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">时间：</text>
                        <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.createTime }}</text>
                    </div>
                    <div class="cellContent">
                        <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">问题：</text>
                        <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.question}}</text>
                    </div>
                    <div class="cellContent">
                        <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">内容：</text>
                        <text class="contentWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.content}}</text>
                    </div>
                    <div class="cellContent" >
                        <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">阿凡提点餐回复：</text>

                        <text class="contentWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.replay}}</text>
                    </div>
                    <div class="cellContentTp" @click="openLightBox(index)">
                        <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">我上传的图片：</text>
                        <div class="row pictureDiv">
                            <image class="picture" :src="'https://image.aftdc.com/'+itemI" v-for="(itemI,indexI) in item.feedimg" :key="indexI"></image>
                        </div>
                    </div>
                </div>
            </cell>

            <loading class="loading" @loading="onloading" :display="loadinging? 'show' : 'hide'">
                <image class="donkey" src="https://image.aftdc.com/appBimg/ic_loading_gif.gif" v-if="!noMore"></image>
                <div class="moreRecentlyOrder" v-else>
                    <text class="moreRecentlyOrderText">没有更多了~</text>
                </div>
            </loading>

        </list>

        <wxc-lightbox
                ref="wxc-lightbox"
                height="800"
                width="600"
                :show="show"
                :image-list="imageList"
                @wxcLightboxOverlayClicked="wxcLightboxOverlayClicked">
        </wxc-lightbox>

        <Toast ref="toast"></Toast>

    </div>
</template>

<script>
    import {WxcMinibar, WxcPopup,WxcButton,WxcLightbox } from 'weex-ui';
    const navigator = weex.requireModule('navigator');
    const post = weex.requireModule('stream');
    const modal = weex.requireModule('modal');
    import Toast from './Toast.vue';

    export default {
        name: 'App',
        components: {WxcMinibar,WxcPopup,WxcButton,WxcLightbox,Toast},
        data () {
            return {
                show:false,
                loadinging:false,
                noMore:false,
                myFeedback:[],
                imageList:[],
                token:'',
                imei:'',
            }
        },
        created:function () {
            var that=this;
            //获取token和sign
            var param = that.GLOBAL.sign(that.token,that.imei);
            param+='&page=0'
            post.fetch({
                method: 'POST',
                type: 'json',
                body: param,
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                url: 'https://www.aftdc.com/userapp/Mine/getMyFeedback',
            }, function (res) {
                if (res.data.res === -2){
                    //跳到登陆页面
                    navigator.push({
                        url: "https://image.aftdc.com/images/shop/",
                        animated: 'true'
                    })
                } else if (res.data.res === 1) {
                    var myFeedback = res.data.data.myFeedback;
                    that.myFeedback = myFeedback;
                }else {
                    const toast =that.$refs.toast;
                    toast.editContent(res.data.info);
                }
            })

        },
        methods:{
            openLightBox (index) {
                var that=this;

                if(that.myFeedback[index].feedimg.length>0){
                    that.show = true;
                    that.imageList=[];
                    for(var i in that.myFeedback[index].feedimg){
                        that.imageList.push({src:'https://image.aftdc.com/'+that.myFeedback[index].feedimg[i]})
                    }
                }

            },
            wxcLightboxOverlayClicked () {// 无状态组件，需要在此次关闭
                var that=this;
                that.show = false;
            },

            minibarLeftButtonClick(){
                navigator.pop({ animated: 'true' });
            },

            onloading () {
                var that = this;
                var page = that.myFeedback.length;
                that.loadinging = true;
                var param = that.GLOBAL.sign(that.token,that.imei);
                param+='&page='+page;
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: 'https://www.aftdc.com/userapp/Mine/getMyFeedback',
                }, function (res) {
                    if (res.data.res === 1) {
                        var myFeedback = res.data.data.myFeedback;
                        that.myFeedback = that.myFeedback.concat(myFeedback);
                    }else {
                        const toast =that.$refs.toast;
                        toast.editContent(res.data.info);
                        that.noMore=true;
                    }
                    that.loadinging = false
                })
            },
        },
    }
</script>

<style scoped>
    .row{
        flex-direction: row;
        align-items: center;
    }
    .cell{
        position: relative;
    }
    .wrapper {
        flex-direction: column;
        background-color: #f1f1f1;
    }

    .minibar {
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #f1f1f1;
    }
    .backImg{
        width: 40px;
        height: 40px;
    }
    .listCell{
        margin-top: 20px;
        margin-left: 20px;
        margin-right: 20px;
        padding-bottom: 20px;
        padding-left: 15px;
        padding-right: 15px;
        border-width: 4px;
        border-style: solid;
        border-color: #a1a1a1;
        border-radius: 10px;
        background-color: #fff;
        flex-direction: column;
    }
    .cellContent{
        flex-direction: row;
        padding-top: 30px;
        padding-left: 15px;
        padding-bottom: 15px;
        padding-right: 15px;
        /*align-items: center;*/
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: #666;
    }
    .cellContentTp{
        padding-top: 30px;
        padding-left: 15px;
        padding-bottom: 15px;
        padding-right: 15px;
        /*align-items: center;*/
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: #666;
    }
    .pictureDiv{
        margin-top: 15px;
    }
    .picture{
        width: 150px;
        height: 150px;
        margin-right: 20px;
        border-radius: 5px;
        border-style: solid;
        border-width: 1px;
        border-color: skyblue;
    }
    .contentWidth{
        width: 550px;
    }
    .unFeedBack{
        position: absolute;
        top: 91px;
        left: 0;
        right: 0;
        bottom: 0;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-color: #fff;
    }
    .unFeedBackImg{
        width: 200px;
        height: 200px;
        margin-bottom: 15px;
    }
    .unFeedBackText{
        color: #a1a1a1;
        margin-top: 15px;
    }




    /*上拉加载*/
    .donkey {
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
        height: 60px;
    }

    .moreRecentlyOrderText{
        font-size: 28px;
        color:#999;
    }


</style>
