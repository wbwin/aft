<template>
    <div class="socialBinding">
        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    v-once
            >
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">更换手机号验证</text>
                <text :style="GLOBAL.headerRight"  slot="right"></text>
            </wxc-minibar>
        </div>

        <div class="all">
            <div class="row place">
                <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">手机号码归属地</text>
                <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor}">中国大陆></text>
            </div>
            <div class="row phone">
                <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">+86</text>
                <input type="number" placeholder="请输入手机号" class="phoneInput" @input="phoneInput(phone)" ref="phone" maxlength="11" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}" v-model="phone">
            </div>
            <!--<div class="row phone">-->
            <!--<text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">+86</text>-->
            <!--<input type="number" placeholder="请输入手机号" class="phoneInput" :style="GLOBAL.inputText">-->
            <!--</div>-->

        </div>

        <div class="all">
            <div class="row phone">
                <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">验证码</text>
                <input type="number" placeholder="请输入验证码" class="code" v-model="code" ref="code" maxlength="6" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">
                <text class="codeBtn" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor,opacity:isPhone?1:0.5}" @click="getCode">{{djsNum>0?djsNum+'s':'获取验证码'}}</text>
            </div>

        </div>

        <div class=" enterButton" :style="{opacity:code.length==6 && phone.length==11?1:'0.5'}">
            <wxc-button class="okButton" text="下一步" :textStyle="GLOBAL.buttonText" :btnStyle="GLOBAL.defaultButton"
                        @wxcButtonClicked="next"></wxc-button>
        </div>

        <Toast ref="toast"></Toast>

    </div>
</template>

<script>
    import { WxcMask,WxcButton} from 'weex-ui';
    import {WxcMinibar, WxcPopup} from 'weex-ui';
    import Toast from './Toast.vue'
    const event = weex.requireModule('event');
    const navigator = weex.requireModule('navigator');
    const post = weex.requireModule('stream');
    export default {

        components: {WxcMinibar, Toast, WxcPopup,WxcMask,WxcButton},
        data() {
            return{
                isPhone:false,
                phone:'',
                code:'',
                djsNum:0,

                token:'',
                imei:'',
            }
        },
        methods:{

            phoneInput(str){//输入手机号时
                var that=this;
                var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
                if (!myreg.test(str)) {
                    that.isPhone=false;
                } else {
                    that.isPhone=true;
                }
            },//输入手机号时

            next(){//下一步
                var that=this;
                that.$refs.phone.blur();
                that.$refs.code.blur();
                if(that.code.length==6 && that.phone.length==11){
                    var param = this.GLOBAL.sign(this.token,this.imei);
                    param+='&phone='+that.phone+'&code='+that.code;
                    post.fetch({
                        method: 'POST',
                        type: 'json',
                        body: param,
                        headers: { "Content-Type": "application/x-www-form-urlencoded" },
                        url: 'https://www.aftdc.com/userapp/Login/checkYzm',
                    }, function (res) {
                        if(res.data.res==1){

                            var url = 'http://assets/changePhone.js';
                            var param='';
                            event.toUrl({url:url,param:param});
                        }
                        else{
                            const toast =that.$refs.toast;
                            toast.editContent(res.data.info);
                        }
                    })
                }
            },//下一步

            getCode(){//获取验证码
                var that=this;
                that.$refs.phone.blur();
                that.$refs.code.blur();
                if(that.isPhone && that.djsNum<=0){

                    var that=this;
                    var param = this.GLOBAL.sign(this.token,this.imei);
                    param+='&phone='+that.phone
                    post.fetch({
                        method: 'POST',
                        type: 'json',
                        body: param,
                        headers: { "Content-Type": "application/x-www-form-urlencoded" },
                        url: 'https://www.aftdc.com/userapp/Login/getYzm',
                    }, function (res) {
                        const toast =that.$refs.toast;
                        toast.editContent(res.data.info);
                    })

                    that.djsNum=60;
                    var timer=setInterval(function () {
                        that.djsNum-=1;
                        if(that.djsNum<=0){
                            clearInterval(timer)
                        }
                    },1000)
                }
            },//获取验证码

            minibarLeftButtonClick(){
                navigator.pop({animated:'false'});
            },
        },
    }
</script>

<style scoped>

    .enterButton {
        width: 750px;
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
        margin-top: 40px;
    }

    .okButton:active {
        background-color: #57aba5;
    }
    .codeBtn{
        width: 170px;
        text-align: center;
        line-height: 60px;
        height: 60px;
        border-style: solid;
        border-width: 2px;
        border-color: #dedede;
        border-radius: 10px;
    }
    .code{
        flex: 1;
        margin-left: 20px;
        padding-left: 20px;
        padding-top: 10px;
        padding-bottom: 10px;
    }
    .phoneInput{
        margin-left: 60px;
        padding-top: 10px;
        padding-bottom: 10px;
        flex: 1;
        padding-left: 20px;
    }
    .phone{
        padding-left: 20px;
        padding-right: 20px;
        height: 120px;
        align-items: center;
        border-top-style: solid;
        border-top-width: 2px;
        border-top-color: #f1f1f1;
        border-bottom-style: solid;
        border-bottom-width: 2px;
        border-bottom-color: #f1f1f1;
    }
    .place{
        padding-left: 20px;
        padding-right: 20px;
        height: 120px;
        align-items: center;
        justify-content: space-between;
        border-top-style: solid;
        border-top-width: 2px;
        border-top-color: #f1f1f1;
        border-bottom-style: solid;
        border-bottom-width: 2px;
        border-bottom-color: #f1f1f1;
    }
    .all{
        margin-top: 20px;
        background-color: #fff;
    }
    .socialBinding{
        background-color: #f8f8f8;
    }

    /*默认样式*/
    .row{
        flex-direction: row;
        align-items: center;
    }
</style>
