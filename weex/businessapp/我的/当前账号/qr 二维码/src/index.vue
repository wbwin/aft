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
                <text :style="GLOBAL.headerCenter"  slot="middle">二维码</text>
            </wxc-minibar>
        </div>

        <div class="list">
            <div style="align-items: center ">
                <text class="title" :style="{color:GLOBAL.dColor}">小程序二维码</text>
            </div>
            <div style="align-items: center;margin-top: 80px;">
                <image class="qr" @load="resize(event)" :src="'https://image.aftdc.com/'+src"></image>
            </div>

            <div class=" enterButton">

                <wxc-button class="okButton" text="下载二维码" :textStyle="GLOBAL.buttonText" :btnStyle="GLOBAL.defaultButton"
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
                src:"",
                token:'',
                imei:''
            }
        },
        created: function () {
            this.token = weex.config.token;
            this.imei = weex.config.imei;
            var that = this;

            //获取token和sign
            var param = this.GLOBAL.sign(this.token,this.imei);

            /*获取上传的图片对象*/
            post.fetch({
                method: 'POST',
                type: 'json',
                body: param,
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                url: 'https://www.aftdc.com/businessapp/Store/getCode',
            }, function (e) {
                //跳到登陆页面
                if (e.data.res === -2)
                {
                    navigator.push({
                        url: "https://image.aftdc.com/images/shop/",
                        animated: 'true'
                    })
                }
                else {
                    if(e.data.res===1) {
                        that.src = e.data.wxAppCode
                    }
                    else
                    {
                        if(!e.data.res) {
                            modal.toast({
                                message: '出错了'
                            })
                        }
                    }
                }
            })
        },
        methods: {
            toEnterMessage(){},

            //重置图片大小
            resize (event) {
                if (event.success) {
                    console.log(JSON.stringify(event))
                }
            },

            //返回上一页
            minibarLeftButtonClick:function () {
                navigator.pop({ animated: 'true' });
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
        margin-top: 80px;
        padding-left: 30px;
        padding-right: 30px;
    }

    .okButton:active {
        background-color: #57aba5;
    }
    .minibar {
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: #f1f1f1;
    }
    .wrapper {
        background-color: #f8f8f8;
    }

    .title {
        font-size: 50px;
        padding-top: 40px;
        padding-bottom: 40px;
        /*border-bottom-color: #53beb7;*/
        /*border-bottom-width: 5px;*/
        /*border-bottom-style: solid;*/
    }

    /*****************/
    .list {
        top: 89px;
        left: 0;
        right: 0;
        bottom: 0;
    }


    /***********************/
    .qr {
        width: 350px;
        height: 350px;
        background-color: #64d6ff;
    }
</style>
