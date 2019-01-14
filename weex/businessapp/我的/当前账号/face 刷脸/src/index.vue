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
                <text :style="GLOBAL.headerCenter"  slot="middle">刷脸</text>
            </wxc-minibar>
        </div>

        <div class="list">
            <div style="align-items: center;margin-bottom: 30px;">
                <image src="https://image.aftdc.com/appBimg/ic_check_face.jpg" class="picture"></image>
                <div style="align-items: center">
                    <text style="margin-top: 30px;" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">尚未开通刷脸验证</text>
                    <text style="margin-top: 20px;" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">使用刷脸登录无需密码，线下会员刷脸消费</text>
                </div>
            </div>


            <div class=" enterButton">

                <wxc-button class="okButton" text="上传人脸照进行验证" :textStyle="GLOBAL.buttonText" :btnStyle="GLOBAL.defaultButton"
                            @wxcButtonClicked="toEnterMessage"></wxc-button>
            </div>


            <div class=" enterButton">

                <wxc-button class="okButtonRed" text="取消" :textStyle="GLOBAL.buttonText" :btnStyle="GLOBAL.delButton"
                            @wxcButtonClicked="toEnterMessageCancel"></wxc-button>
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
            }
        },
        created:function() {

        },
        methods: {
            //返回上一页
            minibarLeftButtonClick:function() {
                navigator.pop({ animated: 'true' });
            },
            toEnterMessage(){},
            toEnterMessageCancel(){
                navigator.pop({ animated: 'true' });
            },
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
        padding-top: 20px;
        padding-bottom: 20px;
        padding-left: 30px;
        padding-right: 30px;
    }

    .okButton:active {
        background-color: #57aba5;
    }
    .okButtonRed:active {
        background-color: #dd4500;
    }
    .minibar {
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: #f1f1f1;
    }
    .wrapper {
        background-color: #f3fdff;
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
    .picture{
        width: 470px;
        height: 300px;
        margin-top: 40px;
    }
</style>
