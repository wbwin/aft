<template>
    <div class="verificationCode">
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
                <text :style="GLOBAL.headerCenter"  slot="middle"></text>
                <text :style="GLOBAL.headerRight"  slot="right">帮助</text>
            </wxc-minibar>
        </div>
        <div class="verificationCodeDiv">
            <text class="Title">输入验证码</text>
            <div class="TitleContent row">
                <text class="TitleText">验证码已发送至</text>
                <text class="titleNumber">+86 {{phone}}</text>
            </div>
            <input type="number" class="inputClass" maxlength="6" ref="input" @input="yzmInput" v-model="number">

            <text class="problem" v-if="problem==false">{{intNumber}}秒后可重新获取验证码</text>
            <!--<text class="noNumber"v-if="problem" @click="noNumberClick">收不到验证码点这里</text>-->
            <text class="noNumber"v-if="problem" @click="getYzm()">重新发送验证码</text>
        </div>

        <!--弹出层-->
        <!--<wxc-popup popup-color="rgba(0,0,0,0)"-->
                   <!--:show="isBottomShow"-->
                   <!--@wxcPopupOverlayClicked="popupOverlayBottomClick"-->
                   <!--pos="bottom"-->
                   <!--ref="wxcPopup"-->
                   <!--height="355"-->
                   <!--:overlay-cfg="{opacity:0.4}"-->
        <!--&gt;-->
            <!--<div class="demoProblemTop ">-->
                <!--<text class="demoProblemTopTextOne commonStyle" @click="againSendClick">重新发送验证码</text>-->
                <!--<text class="demoProblemTopTextTwo commonStyle">接听语音验证码</text>-->
            <!--</div>-->
            <!--<text class="demoProblemCancel cancleStyle" @click="cancleClick">取消</text>-->
        <!--</wxc-popup>-->
        <toast ref="toast"></toast>
    </div>
</template>

<script>
    import Toast from './Toast.vue';
    import {WxcMask, WxcMinibar, WxcPopup} from 'weex-ui';
    const modal = weex.requireModule('modal')
    const dom = weex.requireModule('dom')
    const event=weex.requireModule('event')
    const post = weex.requireModule('stream');

    export default {
        components: {WxcMask, WxcMinibar, WxcPopup,Toast},
        name: 'App',
        data() {
            return{
                isBottomShow:false,
                problem:false,
                number:'',
                intNumber:60,//定时器isBottomShow
                phone:'',
                imei:'',
            }
        },
        created() {
            console.log(JSON.stringify(weex.config))
            var that=this;
            // setTimeout(function () {
            //     that.$refs.input.focus();
            // },100)
            event.init()
            that.imei = weex.config.imei;
            that.phone=weex.config.param
            that.getYzm();




        },
        methods:{
            getYzm(){
                var that=this

                var param='phone='+that.phone
                post.fetch({
                        method: 'POST',
                        type: 'json',
                        body: param,
                        url: 'https://www.aftdc.com/userapp/Login/getYzm',
                        headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    }, function (res) {
                    const toast=that.$refs.toast
                    toast.editContent(res.data.info)
                    var timer =setInterval(function () {
                        that.intNumber-=1;
                        if(that.intNumber<=0){
                            clearInterval(timer);
                            that.problem=true;
                        }
                    },1000)

                })
            },
            yzmInput(e){
                var that=this
                if(e.value.length==6){

                    var param='phone='+that.phone+'&code='+that.number+'&imei='+that.imei
                    post.fetch({
                        method: 'POST',
                        type: 'json',
                        body: param,
                        url: 'https://www.aftdc.com/userapp/Login/yzmLogin',
                        headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    }, function (res) {
                        if(res.data.res==1){

                            event.registerPush();
                            event.save('userToken', res.data.data.Token);
                            event.save('userId', res.data.data.userId);
                            event.save('userName', res.data.data.userName);
                            event.save('userPhoto', res.data.data.userPhoto);
                            event.save('acticleAccount', res.data.data.acticleAccount);
                            event.save('isLogin','1');
                            event.backToIndex(2)
                        }else{
                            that.number==''
                        }
                        const toast=that.$refs.toast
                        toast.editContent(res.data.info)
                    })
                }
            },
            againSendClick(){
                var that=this;
                this.isBottomShow=false;
                this.problem=false;
                this.intNumber=60;
                var timer=setInterval(function () {
                    that.intNumber-=1;
                    if (that.intNumber<=0){
                        clearInterval(timer)
                        that.problem=true;
                    }
                },1000)
            },
            cancleClick(){
                this.$refs.wxcPopup.hide()
            },
            popupOverlayBottomClick(){
                this.isBottomShow=false;
            },
            noNumberClick(){
                this.$refs.input.blur();
                this.isBottomShow=true;
            },
            minibarLeftButtonClick(){

            },
            minibarRightButtonClick(){
                var param='';
                var url='http://assets/contactCustomerService.js'
                event.toUrl({"url":url,"param":param})
            },
        },

    }
</script>

<style scoped>
    .minibar {
        /*border-bottom-width: 2px;*/
        /*border-bottom-style: solid;*/
        /*border-bottom-color: #a1a1a1;*/
    }
    .backImg{
        width: 38px;
        height: 38px;
    }
    /*编辑*/
    .commonStyle{
        background-color: rgba(255,255,255,0.9);
        padding-top: 30px;
        padding-bottom: 30px;
        text-align: center;
        font-size: 38px;
        color: #53beb7;

    }

    .cancleStyle{
        background-color: #fff;
        padding-top: 30px;
        padding-bottom: 30px;
        text-align: center;
        font-size: 38px;
        color: #53beb7;
    }
    .demoProblemCancel{
        margin-top: 20px;
        margin-left: 20px;
        margin-right: 20px;
        margin-bottom: 20px;
        border-radius: 20px;
    }
    .demoProblemTopTextTwo{
        margin-top: 2px;
        border-bottom-left-radius: 20px;
        border-bottom-right-radius: 20px;
    }
    .demoProblemTopTextOne{
        border-top-left-radius: 20px;
        border-top-right-radius: 20px;
    }
    .demoProblemTop{
        padding-left: 20px;
        padding-right: 20px;
    }
    .noNumber{
        font-size: 28px;
        color: #53beb7;
        margin-top: 80px;
    }
    .inputClass{
        margin-top: 40px;
        border-bottom-style: solid;
        border-bottom-width: 2px;
        border-bottom-color: #53beb7;
        padding-top: 10px;
        padding-bottom: 10px;
        text-align: center;
        font-size: 100px;
        color: #666;
    }
    .problem{
        font-size: 28px;
        color: #666;
        margin-top: 80px;
    }
    .blank{
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
    }
    .inputTwo{
        border-bottom-color: #53beb7;
    }
    .input{
        width: 85px;
        height: 80px;
        border-bottom-style: solid;
        border-bottom-width: 2px;
        border-bottom-color: #53beb7;
        text-align: center;
        justify-content: center;
    }
    .inputDiv{
        justify-content: space-between;
        margin-top: 40px;
        position: relative;
    }
    .titleNumber{
        font-size: 35px;
        color: #666;
        margin-left: 10px;
    }
    .TitleText{
        font-size: 28px;
        color: #666;
    }
    .TitleContent{
        margin-top: 40px;
    }
    .Title{
        font-size: 60px;
        color: #666;
        font-weight: 500;
    }
    .verificationCodeDiv{
        padding-top: 80px;
        padding-left: 80px;
        padding-right: 80px;
    }

    /*默认*/
    .row{
        flex-direction: row;
        align-items: center;
    }
    .radius15{
        border-radius: 15px;
    }
</style>
