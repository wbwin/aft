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
                <text :style="GLOBAL.headerCenter"  slot="middle">商家入驻</text>
                <text :style="GLOBAL.headerRight"  slot="right"></text>
            </wxc-minibar>
        </div>
        <div class="mercgantEntryTop">
            <image class="mercgantEntryImg" src="https://image.aftdc.com/images/packageA/ruzhu.jpg"></image>
        </div>
        <div class="panel">
            <div class="from">
                <input class="input" :style="GLOBAL.inputText" type="number" max-length=11 placeholder="手机号" @input="phone">
                <div class="yzmBox">
                    <input class="yzmInput" :style="GLOBAL.inputText" type="number" placeholder="验证码" @input="yzm">
                    <button class="yzmBut" v-if="count==60" @click="getYzm">
                        <text class="getYzm" :style="GLOBAL.buttonText">获取验证码</text>
                    </button>
                    <button class="countdown" v-else>
                        <text class="countdownYzm" :style="{fontSize:GLOBAL.bigFS,color:'#999'}">{{count}} s</text>
                    </button>
                </div>
                <div class="shopProtocol">
                    <image class="protocolRadio" @click="protocolRadio=!protocolRadio"
                           :src="protocolRadio?'https://image.aftdc.com/appBimg/ic_check_box_checked.png':'https://image.aftdc.com/appBimg/ic_check_box_normal.png'"></image>
                    <text @click="protocolRadio=!protocolRadio" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">我同意并遵守</text>
                    <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}" @click="toProtocol">《阿凡提点餐服务协议》</text>
                </div>

                    <wxc-button class="loginBut" text="确定" :textStyle="GLOBAL.buttonText" :btnStyle="sureBtnStyle"
                                @wxcButtonClicked="enter"></wxc-button>

            </div>
        </div>
        <div class="loading" v-if="!loginOnce"></div>
        <div class="loadingBack" v-if="!loginOnce">
            <image class="loadingImg" src="https://image.aftdc.com/appBimg/ic_loading_gif.gif"></image>
        </div>
        <toast ref="toast"></toast>
    </div>
</template>

<script>
    import {WxcMinibar,WxcButton} from 'weex-ui';
    import Toast from './Toast.vue'
    const modal = weex.requireModule('modal');
    const post = weex.requireModule('stream');
    const navigator = weex.requireModule('navigator');
    const event = weex.requireModule('event');
    export default {
        components: {WxcMinibar,WxcButton,Toast},
        data() {
            return {
                count: 60,
                getOnce: true,
                loginOnce: true,
                Phone: '',
                Yzm: '',
                protocolRadio: false,
                sureBtnStyle:{
                    width:'650',
                    backgroundColor:'#53beb7',
                }
            }
        },
        methods: {

            minibarLeftButtonClick() {

            },
            phone(event) {
                var that = this;
                that.Phone = event.value;
            },
            yzm(event) {
                var that = this;
                that.Yzm = event.value;
            },
            getYzm() {
                if (this.getOnce) {
                    //防止多少次点击
                    this.getOnce = false;

                    var that = this;
                    var phone = that.Phone;
                    var parttern = /^1[3|4|5|7|8][0-9]\d{8}$/;
                    if (!parttern.test(phone)) {
                        const toast = that.$refs.toast;
                        toast.editContent('手机号码错误');
                        this.getOnce = true;
                        return false
                    }
                    this.cd = setInterval(() => that.countdown(), 1000);
                    var formData = 'phone=' + phone;
                    post.fetch({
                        method: 'post',
                        type: 'json',
                        body: formData,
                        url: 'https://www.aftdc.com/businessapp/Login/yzm',
                        headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    }, function (res) {
                        if (res.data.res != 1) {
                            const toast = that.$refs.toast;
                            toast.editContent(res.data.info);
                        }
                    })
                }
            },
            //倒计时
            countdown() {
                if (this.count > 0) {
                    this.count--;
                } else {
                    clearInterval(this.cd);
                    this.count = 60;
                    this.getOnce = true;
                }
            },
            enter(){
                var that = this
                var phone = that.Phone;
                var code = that.Yzm;
                var parttern = /^1[3|4|5|7|8][0-9]\d{8}$/;
                if (!parttern.test(phone)) {
                    const toast= that.$refs.toast;
                    toast.editContent('手机号码错误')
                    that.getOnce = true;
                    return false
                }
                if (!phone || !code) {
                    const toast = that.$refs.toast;
                    toast.editContent('请填写完整');
                    return false
                }

                if (!that.protocolRadio) {
                    const toast = that.$refs.toast;
                    toast.editContent('请查看阿凡提点餐服务协议');
                    return false
                }

                if (that.loginOnce) {
                    that.loginOnce = false
                } else {
                    return false
                }
                //判断有没有填写资料
                var param = 'phone=' + phone + '&' + 'code=' + code;
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    url: 'https://www.aftdc.com/businessapp/Enter/isEnter',
                }, function (e) {
                    that.loginOnce = true
                    if (e.data.res == 1){
                        var param = {
                            phone:e.data.phone,
                            token:e.data.token
                        };
                        var url = 'http://assets/readyEnter.js';
                        event.toUrl({"url": url, "param": JSON.stringify(param)});
                    }else if (e.data.res == 2){
                        var param = {
                            phone:e.data.phone,
                            token:e.data.token
                        };
                        var url='http://assets/applicationInformation.js';
                        event.toUrl({"url":url,"param":JSON.stringify(param)});
                    } else{
                        const toast = that.$refs.toast;
                        toast.editContent(res.data.info);
                    }
                })
            },
            toProtocol() {
                var param = '';
                var url = 'http://assets/protocol.js'
                event.toUrl({"url": url, "param": param})
            },
        },
    }
</script>

<style scoped>

    .wrapper {
        flex-direction: column;
        background-color: #fff;
    }

    .minibar {
    }

    .backImg {
        width: 40px;
        height: 40px;
    }

    .mercgantEntryTop {
        flex-direction: row;
    }

    .mercgantEntryImg {
        width: 750px;
        height: 250px;
    }

    .panel {
        background-color: #f8f8f8;
        width: 750px;
        align-items: center;
    }

    .input {
        width: 650px;
        margin-top: 40px;
        height: 80px;
        line-height: 80px;
    }

    .yzmBox {
        width: 650px;
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .yzmInput {
        flex: 3;
        margin-top: 40px;
        height: 80px;
        line-height: 80px;
    }

    .yzmBut {
        margin-left: 15px;
        flex: 2;
        background-color: #53beb7;
        margin-top: 40px;
        font-size: 40px;
        border-radius: 12px;
        height: 80px;
        line-height: 80px;
    }

    .countdown {
        margin-left: 15px;
        flex: 2;
        background-color: #dedede;
        margin-top: 40px;
        font-size: 40px;
        border-radius: 12px;
        height: 80px;
    }

    .countdownYzm {
        text-align: center;
        line-height: 80px;
    }

    .getYzm {
        text-align: center;
        line-height: 80px;
    }

    .loginBut {

        margin-top: 50px;

        border-radius: 12px;
    }

    .loginBut:active {
        background-color: #57aba5;
    }

    .loginBut:enabled {
        background-color: #53BEB7;
    }

    .login {
        width: 650px;
        text-align: center;
        font-size: 40px;
        color: #fff;
    }

    .shopProtocol {
        margin-top: 30px;
        flex-direction: row;
        align-items: center;
    }

    .protocolRadio {
        width: 34px;
        height: 34px;
        margin-right: 20px;
    }



    .protocolText {
        color: #53beb7;
    }
</style>
