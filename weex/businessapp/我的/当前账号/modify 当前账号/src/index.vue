<template>
    <div class="wrapper">

        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    v-once>
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">当前账号</text>
            </wxc-minibar>
        </div>

        <div class="list">
            <div class="normal" style="flex-direction: row;justify-content: space-between">
                <text :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">账号名</text>
                <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{businessData.login_name}}</text>
            </div>
            <div class="normal" style="flex-direction: row;justify-content: space-between" @click="goToPwd">
                <text :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">修改密码</text>
                <image src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"
                       style="width: 20px;height: 20px;"></image>
            </div>
            <div class="normal" style="flex-direction: row;justify-content: space-between">
                <text :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">已绑定手机号码</text>
                <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{businessData.phone}}</text>
            </div>
            <!--<div class="normal" style="flex-direction: row;justify-content: space-between" @click="goToFace">-->
                <!--<text :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">开启刷脸验证</text>-->
                <!--<image src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"-->
                       <!--style="width: 20px;height: 20px;"></image>-->
            <!--</div>-->

            <div class=" enterButton">

                <wxc-button class="okButton" text="退出登录" :textStyle="GLOBAL.buttonText" :btnStyle="GLOBAL.delButton"
                            @wxcButtonClicked="toEnterMessage"></wxc-button>
            </div>
        </div>
    </div>
</template>

<script>
    import {WxcMinibar, WxcButton} from 'weex-ui';
    const navigator = weex.requireModule('navigator');
    const event = weex.requireModule('event');
    const post = weex.requireModule('stream');
    const modal = weex.requireModule('modal');

    export default {
        components: {WxcMinibar, WxcButton},
        name: 'App',
        data() {
            return {
                backImgToggle: 0,//头部返回图片判断
                businessData:[],
                token:'',
                imei:''
            }
        },
        created: function () {
            this.token = weex.config.token;
            this.imei = weex.config.imei;

            var param = this.GLOBAL.sign(this.token,this.imei);
            /*待处理*/
            var that = this
            post.fetch({
                method: 'POST',
                type: 'json',
                body: param,
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                url: 'https://www.aftdc.com/businessapp/Store/account_message',
            }, function (e) {
                if (e.data.res === -2)
                    that.toLogin();
                else if (e.data.res === 1){
                    that.businessData = e.data.data;
                } else {
                    modal.toast({
                        message:"网络出错了。。。"
                    })
                }
            });
        },
        methods: {
            //返回上一页
            minibarLeftButtonClick:function () {
                navigator.pop({ animated: 'true' });
            },
            //登录页面
            toEnterMessage(){
                var that = this;
                var param = 'imei='+this.imei;
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: 'https://www.aftdc.com/businessapp/Login/logout',
                }, function (res) {
                    if (res.data.res == 1){
                        event.unregisterPush();
                        event.delete("businessToken");
                        event.delete("shopId");
                        event.delete("shopName");
                        const toast = that.$refs.toast;
                        toast.editContent('退出成功');

                        var url='http://assets/login.js';
                        var param='';
                        event.toUrl({url:url,param:param});
                        navigator.pop({ animated: 'false' });
                    }
                })
            },
            //跳转到修改密码页面
            goToPwd:function () {
                var param = '';
                var url='http://assets/password.js';
                event.toUrl({ "url": url, "param": param });
            },
            //跳转到刷脸页面
            goToFace:function () {
                var param = '';
                var url='http://assets/face.js';
                event.toUrl({ "url": url, "param": param });
            }
        }
    }
</script>

<style scoped>
    .enterButton {
        flex-direction: row;
        justify-content: space-around;
        /*position: fixed;*/
        /*left: 0;            存在时固定在底部*/
        /*bottom: 0;*/
        /*right: 0;*/
        margin-top: 20px;
        padding-top: 20px;
        padding-bottom: 20px;
        padding-left: 30px;
        padding-right: 30px;
    }

    .okButton:active {
        background-color: #dd4500;
    }
    .minibar {
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: #f1f1f1;
    }
    .wrapper {
        background-color: #f8f8f8;
    }

    /*****************/
    .header {
        flex-direction: row;
        height: 90px;
        background-color: #53beb7;
        align-items: center;
        justify-content: space-between;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
    }

    .list {
        position: absolute;
        top: 89px;
        right: 0;
        left: 0;
        bottom: 0;
    }

    .back {
        margin-left: 40px;
        flex: 1;
    }

    .backImg {
        width: 40px;
        height: 40px;
    }

    .appName {
        flex: 1;
    }

    .appNameCss {
        font-size: 40px;
        color: #fff;
    }

    .allSave {
        flex: 1;
        margin-right: 40px;

    }

    .allSaveCss {
        font-size: 35px;
        color: #fff;
        text-align: right;
    }

    .allSaveCss:active {
        color: #666;
    }

    /***********************/

    .normal {
        padding-top: 20px;
        padding-bottom: 20px;
        padding-left: 20px;
        padding-right: 20px;
        background-color: #ffffff;
    }
    .sign {
        padding-top: 25px;
        padding-bottom: 25px;
        align-items: center;
        margin-top: 80px;
    }
</style>
