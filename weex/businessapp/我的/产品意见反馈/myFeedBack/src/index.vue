<template>
    <div class="wrapper">

        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    @wxcMinibarRightButtonClicked="minibarRightButtonClick"
                    v-once
            >
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">我的反馈</text>
            </wxc-minibar>
        </div>

        <div class="unFeedBack" v-if="feedBack.length<=0">
            <image class="imgDefault unFeedBackImg" src="https://image.aftdc.com/appBimg/icon_no_order.png"></image>
            <text class="unFeedBackText" :style="{fontSize:GLOBAL.bigFS}">暂无反馈</text>
        </div>
        <list class="scroller" v-if="feedBack.length>0">
            <cell v-for="(item,index) in feedBack">
                <div class="listCell">
                    <div class="cellContent">
                        <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">时间：</text>
                        <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.createTime}}</text>
                    </div>
                    <div class="cellContent">
                        <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">问题：</text>
                        <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.feedbackType}}</text>
                    </div>
                    <div class="cellContent">
                        <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">内容：</text>
                        <text class="contentWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.content}}</text>
                    </div>
                    <div class="cellContent" >
                        <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">阿凡提点餐回复：</text>

                        <text class="contentWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.adminReply}}</text>

                    </div>
                </div>
            </cell>
        </list>
    </div>
</template>

<script>
    import {WxcMinibar, WxcPopup,WxcButton} from 'weex-ui';
    const navigator = weex.requireModule('navigator');
    const post = weex.requireModule('stream');
    const modal = weex.requireModule('modal');

    export default {
        name: 'App',
        components: {WxcMinibar,  WxcPopup,WxcButton},
        data () {
            return {
                feedBackTest:[{createTime:'2019-11-30',question:'其他问题',content:'哈哈哈哈哈哈',reply:'呵呵呵呵呵呵呵呵呵呵'}],
                feedBack:[]
            }
        },
        created:function () {
            this.token = weex.config.token;
            this.imei = weex.config.imei;
            //获取token和sign
            var param = this.GLOBAL.sign(this.token,this.imei);
            var that = this;
            post.fetch({
                method: 'POST',
                type: 'json',
                body: param,
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                url: 'https://www.aftdc.com/businessapp/Feedback/me_list',
            }, function (e) {
                if (e.data.res === -2){
                    //跳到登陆页面
                    navigator.push({
                        url: "https://image.aftdc.com/images/shop/",
                        animated: 'true'
                    })
                } else if (e.data.res === 1) {
                    that.feedBack = e.data.data;
                }else {
                    modal.toast({
                        message: '网络出错了。。。'
                    })
                }
            })

        },
        methods:{
            minibarRightButtonClick(){

            },
            minibarLeftButtonClick(){
                navigator.pop({ animated: 'true' });
            },
        },
    }
</script>

<style scoped>
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
</style>
