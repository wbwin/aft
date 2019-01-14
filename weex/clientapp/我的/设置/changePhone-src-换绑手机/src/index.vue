<template>
    <div class="changePhone">
        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    v-once
            >
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">绑定手机号</text>
                <text :style="GLOBAL.headerRight"  slot="right"></text>
            </wxc-minibar>
        </div>
        <scroller class="scroller">
            <!--个人信息-->
            <div class="changePhoneDiv">

                <text class="title" :style="{fontSize:GLOBAL.biggestFS,color:GLOBAL.dColor}">输入您的手机号</text>

                <div class="placeDiv">
                    <text class="placeText" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">手机号归属地</text>
                    <text class="country" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">中国</text>
                </div>

                <div class="numberDiv">
                    <text class="numberLeft" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">+86</text>
                    <input type="number" class="numberRight" placeholder="请输入手机号" maxlength="11" @input="input(phone)"  ref="firInput" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}"  v-model="phone">
                </div>

                <div class="numberDiv">
                    <text class="numberLeft" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">验证码</text>
                    <input type="number" class="numberRight" placeholder="请输入验证码" maxlength="6" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}"  v-model="code">
                    <text class="getYzm" :class="[isPhone?'isYzm':'']" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor,opacity:isPhone?1:0.5}" @click="toEnterMessage">{{djsNum>0?djsNum+'s':'获取验证码'}}</text>

                </div>

                <div class=" enterButton" :class="[code.length==6 && phone.length==11?'':'getCodeTwo']">
                    <wxc-button class="okButton" text="确认更换" :textStyle="GLOBAL.buttonText" :btnStyle="GLOBAL.defaultButton"
                                @wxcButtonClicked="isConfirm"></wxc-button>
                </div>

            </div>
        </scroller>

        <!--该号码已被其他账号绑定弹出框-->
        <wxc-mask height="270"
                  width="600"
                  border-radius="10"
                  duration="200"
                  mask-bg-color="#FFFFFF"
                  :has-animation="true"
                  :has-overlay="true"
                  :overlay-can-close="false"
                  :show-close="false"
                  :show="show"
                  @wxcMaskSetHidden="wxcMaskSetHidden">
            <div class="content">
                <text class="demoTitle" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">提示</text>
                <text class="demoDetail" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">该手机已被其他账号。如果继续，原账号将自动解绑。是否继续?</text>
                <div class="row demoBottom">
                    <text class="demoCancel" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}" @click="demoCancel">取消</text>
                    <text class="demoConfirm" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}" @click="demoConfirm">继续</text>
                </div>
            </div>
        </wxc-mask>

        <Toast ref="toast"></Toast>
    </div>

</template>

<script>
    import { WxcMask,WxcButton} from 'weex-ui';
    const animation = weex.requireModule('animation')
    const modal = weex.requireModule('modal')
    import {WxcMinibar, WxcPopup} from 'weex-ui';
    const event = weex.requireModule('event');
    const dom = weex.requireModule('dom');
    const navigator = weex.requireModule('navigator');
    const post = weex.requireModule('stream');
    import Toast from './Toast.vue';
    export default {

        components: {WxcMinibar, WxcPopup,WxcMask,WxcButton,Toast},
        data() {
            return{
                show:false,
                phone:'',
                code:'',
                blurPrevent:true,//阻止多次失去焦点的定时器
                isPhone:false,//手机号码是否正确

                djsNum:0,
                djs:false,

                token:'',
                imei:'',
            }
        },
        created(){
            var that=this;
            setTimeout(function () {
                that.$refs.firInput.focus()
            },100)
        },
        methods:{
            wxcMaskSetHidden(){
                var that=this;
                that.show=false;
            },

            isConfirm(){//确认更换
                var that=this;
                if(that.code.length==6 && that.phone.length==11){
                    var param = this.GLOBAL.sign(this.token,this.imei);
                    param+='&phone='+that.phone+'&code='+that.code;
                    post.fetch({
                        method: 'POST',
                        type: 'json',
                        body: param,
                        headers: { "Content-Type": "application/x-www-form-urlencoded" },
                        url: 'https://www.aftdc.com/userapp/Mine/swapThePhone',
                    }, function (res) {
                        if(res.data.res==1){
                            setTimeout(function () {
                                navigator.pop({animated:'false'});
                            },1000)
                            const toast =that.$refs.toast;
                            toast.editContent(res.data.info);
                        }
                        else{
                            const toast =that.$refs.toast;
                            toast.editContent(res.data.info);
                        }
                    })
                }
            },

            demoCancel(){//弹层取消
                var that=this;
                that.show=false;
            },//弹层取消

            demoConfirm(){//弹层继续
                var that=this;
                that.show=false;
                that.getYzm();
            },//弹层继续

            input(str){//输入手机号时
                var that=this;
                var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
                if (!myreg.test(str)) {
                    that.isPhone=false;
                } else {
                    that.isPhone=true;
                }
            },//输入手机号时

            getYzm(){
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
            },

            toEnterMessage(){//获取验证码
                var that=this;
                if(that.isPhone && that.djsNum<=0){


                    var param = this.GLOBAL.sign(this.token,this.imei);
                    param+='&phone='+that.phone;
                    post.fetch({
                        method: 'POST',
                        type: 'json',
                        body: param,
                        headers: { "Content-Type": "application/x-www-form-urlencoded" },
                        url: 'https://www.aftdc.com/userapp/Mine/checkPhone',
                    }, function (res) {
                        if(res.data.res==0 || res.data.res==-1){
                            const toast =that.$refs.toast;
                            toast.editContent(res.data.info);
                        }
                        if(res.data.res==1 || res.data.res==2){
                            that.getYzm();
                        }
                        if(res.data.res==-3){
                            that.show=true;
                        }
                    })
                }
            },//获取验证码

            minibarLeftButtonClick(){
                navigator.pop({animated:'false'});
            },
        },
    }
</script>

<style scoped>
    .demoConfirm{
        padding-left: 30px;
        padding-right: 30px;
        line-height: 65px;
    }
    .demoCancel{
        padding-left: 30px;
        padding-right: 30px;
        line-height: 65px;
    }
    .demoBottom{
        margin-top: 20px;
        justify-content: flex-end;
        height: 65px;
    }
    .row{
        flex-direction: row;
        align-items: center;
    }
    .demoDetail{
        margin-left: 40px;
        margin-top: 20px;
        width: 520px;
    }
    .demoTitle{
        margin-left: 40px;
        margin-top: 40px;
        font-weight: bold;
    }
    .scroller{
        width: 750px;
        flex: 1;
    }
    .enterButton {
        flex-direction: row;
        justify-content: space-around;
        /*position: fixed;*/
        /*left: 0;            存在时固定在底部*/
        /*bottom: 0;*/
        /*right: 0;*/
        margin-top: 50px;
        padding-left: 30px;
        padding-right: 30px;
        opacity: 1;
    }

    .okButton:active {
        background-color: #57aba5;
    }
    .getCodeTwo{
        opacity: 0.5;
    }
    .getCode{
        font-size: 28px;
        color: #fff;
        background-color: #53beb7;
        padding-top: 30px;
        padding-bottom: 30px;
        text-align: center;
        margin-top: 40px;
        opacity: 1;
    }
    .numberRight{
        padding-top: 5px;
        padding-bottom: 5px;
        flex: 1;
    }
    .getYzm{
        width: 170px;
        text-align: center;
        line-height: 60px;
        height: 60px;
        border-style: solid;
        border-width: 2px;
        border-color: #dedede;
        border-radius: 10px;
    }
    .isYzm{
        background-color: #fff;
    }
    .isYzm:active{
        background-color: #f8f8f8;
    }
    .numberLeft{
        width: 140px;
    }
    .numberDiv{
        flex-direction: row;
        align-items: center;
        margin-top: 40px;
        padding-top: 20px;
        padding-bottom: 20px;
        border-bottom-style: solid;
        border-bottom-color: #f1f1f1;
        border-bottom-width: 2px;
    }
    .placeText{
        flex: 1;
    }
    .placeDiv{
        flex-direction: row;
        align-items: center;
        padding-top: 20px;
        padding-bottom: 20px;
        border-bottom-style: solid;
        border-bottom-color: #f1f1f1;
        border-bottom-width: 2px;
        margin-top: 140px;
    }
    .changePhoneDiv{
        padding-left: 70px;
        padding-right: 70px;
        padding-top: 110px;
        flex: 1;
    }
    .title{
        font-weight: 500;
    }
    .changePhone{
    }
</style>
