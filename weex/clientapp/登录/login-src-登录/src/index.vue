<template>
    <div class="wrapper" @viewappear="viewappear" @viewdisappear="viewdisappear">
        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    @wxcMinibarRightButtonClicked="minibarRightButtonClick"

            >
                <image class="backImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text style="font-size: 40px;color: #fff" slot="middle"></text>
                <text style="font-size: 35px;color: #fff" slot="right">帮助</text>
            </wxc-minibar>
        </div>
        <div class="loginContent">
            <div>
                <text class="welcome">欢迎登陆阿凡提</text>
                <div class="phoneContent">
                    <div class="areaCodeDiv">
                        <text class="areaCode">+86</text>
                        <image class="arrowRightImg" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                    </div>

                    <input class="input" :style="{fontSize:'45px',color:'#666'}" ref="phone" v-model="phoneNumber" type="number" max-length="13" placeholder="请输入手机号码" @input="phoneInput"/>
                    <image v-if="closeX" @click="deleteInput()" class="iconCloseImg" src="https://image.aftdc.com/appBimg/icon_close.png"></image>
                </div>
                <div class="phoneContent" v-if="yzmOrPaslogin">

                    <input class="input" :style="{fontSize:'40px',color:'#666'}" ref="password" v-model="password" :type="passwordOrText"  placeholder="请输入密码" @input="passwordInput"/>
                    <image  @click="onPasswordOrTextClick()" :class="[passwordOrText=='password'?'ic_psdCloseImg':'ic_psdImg']" :src="passwordOrText=='password'?'https://image.aftdc.com/appBimg/ic_psd_hidden.png':'https://image.aftdc.com/appBimg/ic_psd_show.png'"></image>
                </div>
                <text class="registeTips" v-if="!yzmOrPaslogin">未注册的手机号验证后自动创建阿凡提账户</text>
                <text class="hasBotton" @click="yzmOrPaslogin?pwdLoginClick():toVerificationCode()">{{yzmOrPaslogin?'登录':'获取短信验证码'}}</text>
                <div class="login_choice">
                    <text :style="{fontSize:GLOBAL.defaultFS,color:'#999'}" @click="onYzmOrPasloginClick()">{{yzmOrPaslogin?'验证码登录':'密码登录'}}</text>
                    <text :style="{fontSize:GLOBAL.defaultFS,color:'#999'}" @click="toForgetPasswordClick()" v-if="yzmOrPaslogin">忘记密码</text>
                </div>
            </div>
            <div class="buttomContent">
                <div class="wxAndqq">
                    <div class="imgBorder" @click="wxlogin">
                        <image class="wxImg" src="https://image.aftdc.com/appBimg/logo_weixin.png"></image>
                    </div>
                    <!--<div class="imgBorder">-->
                    <!--<image class="qqImg" src="https://image.aftdc.com/appBimg/logo_QQ.png"></image>-->
                    <!--</div>-->
                </div>
                <text class="loginTips">登陆代表你已同意《阿凡提用户协议》</text>
            </div>
        </div>
    </div>
</template>

<script>
    import {WxcSlideNav, WxcMinibar} from 'weex-ui';
    const GLOBAL = require('@/Global.vue');
    const navigator = weex.requireModule('navigator');
    const post = weex.requireModule('stream');
    const event=weex.requireModule('event');
    export default {
        components: {WxcSlideNav, WxcMinibar},
        data() {
            return {
                closeX:false,
                phoneNumber:'',
                password:'',
                passwordOrText:'password',
                yzmOrPaslogin:0,//0表示验证码登录，1表示密码登录
                pageBack:true
            }
        },
        created() {
            event.init()
        },
        mounted(){
            var that=this
            // setTimeout(function () {
            //    that.$refs.phone.setTextFormatter({
            //        formatRule: "/(\\d{3}(?!$))(\\d{4}(?!$))/",
            //        formatReplace: "$1 $2 ",
            //        recoverRule: "/\\s+/g",
            //        recoverReplace: ""
            //    })
            // },0)
        },
        methods: {
            phoneInput(event){
                var that=this
                if(event.value==''){
                    that.closeX=false
                }else{
                    that.closeX=true
                }
            },
            passwordInput(){

            },
            onPasswordOrTextClick(){
                var that=this
                that.passwordOrText=that.passwordOrText==password?'text':'password'
            },
            onYzmOrPasloginClick(){
                var that=this
                that.yzmOrPaslogin=that.yzmOrPaslogin?0:1
            },
            deleteInput(){
                var that=this
                that.phoneNumber='';
                that.closeX=false
            },
            minibarLeftButtonClick(){

            },
            minibarRightButtonClick(){
                var param='';
                var url='http://assets/contactCustomerService.js'
                event.toUrl({"url":url,"param":param})
            },
            pwdLoginClick:GLOBAL.throttle(function() {

                var that = this;
                const toast= that.$refs.toast;
                that.$refs.phone.blur();
                that.$refs.password.blur();
                var phone = that.phoneNumber;
                var password = that.password;
                if (!phone || !password) {
                    toast.editContent('请填写完整')
                    return false
                }
                if(!(/^1[34578]\d{9}$/.test(phone))){
                    toast.editContent('请正确填写手机号')
                    return false;
                }

                var param = 'name=' + phone + '&&' + 'password=' + password + '&&' + 'imei=' + event.find('imei');
                post.fetch({
                    method: 'post',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/businessapp/Login/login_number',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                }, function (res) {
                    if(res.data.res==1){
                        var r = res.data.data
                        event.registerPush();
                        event.save('userToken',r.token);
                        event.save('userId',r.userId);
                        event.save('userName',r.userName);
                        event.save('userPhoto',r.userPhoto);
                        event.save('acticleAccount', r.acticleAccount);
                        event.save('isLogin','1');
                        navigator.pop({ animated: 'true' });
                    }else{
                        const toast=that.$refs.toast
                        toast.editContent(res.data.info)
                    }

                })

            }),
            toVerificationCode:GLOBAL.throttle(function() {
                var that=this
                const toast=that.$refs.toast
                var phone=that.phoneNumber
                if(!(/^1[34578]\d{9}$/.test(phone))){
                    toast.editContent('请正确填写手机号')
                    return false;
                }
                if(that.yzmOrPaslogin){
                    var param='name='+that.name+'&password='+that.password+'&imei='+event.find('imei')
                    post.fetch({
                        method: 'POST',
                        type: 'json',
                        body: param,
                        url: 'https://www.aftdc.com/userapp/Login/pwdLogin',
                        headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    }, function (res) {

                        if(res.data.res==1){
                            event.registerPush();
                            event.save('userToken',r.token);
                            event.save('userId',r.userId);
                            event.save('userName',r.nickname);
                            event.save('userPhoto',r.userPhoto);
                            event.save('acticleAccount', r.acticleAccount);
                            event.save('isLogin','1');
                            navigator.pop({ animated: 'true' });
                        }else{
                            const toast=that.$refs.toast
                            toast.editContent(res.data.info)
                        }
                    })
                }else{
                    var param=phone;
                    var url='http://assets/verificationCode.js'
                    event.toUrl({"url":url,"param":param})
                }
            }),
            toForgetPasswordClick:GLOBAL.throttle(function() {
                var param='';
                var url='http://assets/forgetPassword.js'
                event.toUrl({"url":url,"param":param})
            }),
            wxlogin(){
                event.wxlogin()
            },
            viewappear(){
                if (!this.pageBack) { return; }
                this.pageBack = false;
                var code = event.find('wxloginCode');
                if (code){
                    var that = this
                    var imei = event.find('imei');
                    var param = 'code='+code+'&imei='+imei;
                    post.fetch({
                        method: 'POST',
                        type: 'json',
                        body: param,
                        headers: { "Content-Type": "application/x-www-form-urlencoded" },
                        url: 'https://www.aftdc.com/userapp/Wxdecode/getUserInfo',
                    }, function (res) {
                        if(res.data.res === 1) {
                            event.delete('wxloginCode');
                            var r = res.data.data
                            event.registerPush();
                            event.save('userToken',r.token);
                            event.save('userId',r.userId);
                            event.save('userName',r.nickname);
                            event.save('userPhoto',r.userPhoto);
                            event.save('acticleAccount', r.acticleAccount);
                            event.save('isLogin','1');
                            navigator.pop({ animated: 'true' });
                        }
                    });
                }
            },
            viewdisappear() {
                this.pageBack = true;
            },
        }
    }
</script>

<style scoped>
    .wrapper {

    }
    .minibar {
        /*border-bottom-width: 2px;*/
        /*border-bottom-style: solid;*/
        /*border-bottom-color: #a1a1a1;*/
    }
    .backImg{
        width: 38px;
        height: 38px;
    }
    .loginContent{
        padding-left: 70px;
        padding-right: 70px;
        flex-direction: column;
        flex: 1;
        flex-direction: column;
        justify-content: space-between;
    }
    .welcome{
        font-size: 60px;
        color: #333;
        font-weight: 500;
        margin-top: 80px;
        margin-bottom: 80px;
    }
    .phoneContent{
        flex-direction: row;
        align-items: center;
        padding-top: 20px;
        padding-bottom: 20px;
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: #333;
    }
    .areaCodeDiv{
        flex-direction: row;
        align-items: center;
    }
    .areaCode{
        font-size: 25px;
        color: #666;
        margin-right: 10px;
    }
    .arrowRightImg{
        width: 20px;
        height: 20px;
    }
    .phoneInput{
        flex-direction: row;
        align-items: center;
        flex: 1;
    }
    .input{
        flex: 1;
        height: 70px;
        line-height: 70px;
        margin-left: 15px;
        margin-right: 15px;
        placeholder-color:#c1c1c1;
        padding-bottom: 5px;
    }
    .iconCloseImg{
        width: 30px;
        height: 30px;
        margin-right: 15px;
    }
    .ic_psdCloseImg{
        width: 50px;
        height: 25px;
        margin-right: 15px;
        margin-top: 5px;
    }
    .ic_psdImg{
        width: 50px;
        height: 30px;
        margin-right: 15px;
    }
    .registeTips{
        font-size: 25px;
        color: #999;
        margin-top: 20px;
        margin-bottom: 20px;
    }
    .login_choice{
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        margin-top: 40px;
    }
    .hasBotton{
        font-size: 35px;
        color: #fff;
        flex-direction: row;
        flex: 1;
        text-align: center;
        align-items: center;
        border-radius: 50px;
        padding-top: 25px;
        padding-bottom: 25px;
        margin-top: 20px;
        background-image:linear-gradient(to right, #00d2c5, #01bfb3);
        box-shadow: 0px 4px 4px #666;
    }
    .buttomContent{
        flex-direction: column;
        align-items: center;

    }
    .wxAndqq{
        width: 610px;
        flex-direction: row;
        justify-content: center;
        padding-left: 100px;
        padding-right: 100px;
        margin-top: 20px;
        margin-bottom: 20px;

    }
    .imgBorder{
        width: 120px;
        height: 120px;
        border-radius: 60px;
        align-items: center;
        justify-content: center;
        border-width: 1px;
        border-style: solid;
        border-color: #dedede;

    }
    .wxImg{
        width: 66px;
        height: 50px;
    }
    .qqImg{
        width: 50px;
        height: 64px;
    }
    .loginTips{
        font-size: 27px;
        color: #999;
        margin-top: 30px;
        margin-bottom: 30px;
    }
</style>
