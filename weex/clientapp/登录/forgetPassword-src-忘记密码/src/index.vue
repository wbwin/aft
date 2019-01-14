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
                <text style="font-size: 40px;color: #fff" slot="middle">忘记密码</text>
                <text style="font-size: 35px;color: #fff" slot="right"></text>
            </wxc-minibar>
        </div>
        <div class="loginContent">
            <div>
                <text class="welcome">请输入手机号填写验证码，以便修改密码</text>
                <div class="phoneContent" >
                    <text :style="{fontSize:'35px',color:'#666',flex:1}">手机号码归属地</text>
                    <text :style="{fontSize:'32px',color:'#666',marginRight:'10px'}">中国</text>
                </div>
                <div class="phoneContent">
                    <div class="areaCodeDiv">
                        <text class="areaCode">+86</text>
                        <image class="arrowRightImg" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                    </div>

                    <input class="input" :style="{fontSize:'40px',color:'#666'}" ref="phone" v-model="phoneNumber" type="number" max-length="13" placeholder="请输入手机号码" @input="phoneInput"/>
                    <image v-if="closeX" @click="deleteInput()" class="iconCloseImg" src="https://image.aftdc.com/appBimg/icon_close.png"></image>
                </div>
                <div class="phoneContent">
                    <text :style="{fontSize:'35px',color:'#666'}">验证码</text>

                    <input class="input" :style="{fontSize:'40px',color:'#666'}" ref="ref_yzm" v-model="yzm" type="number" max-length="6" placeholder="请输入验证码" />
                    <text class="getYzm" :style="{fontSize:GLOBAL.bigFS,color:'#666'}" v-if="count==60" @click="getYzm">获取验证码</text>
                    <text class="getYzmCount" :style="{fontSize:GLOBAL.biggerFS,color:'#666'}" v-else>{{count}} s</text>
                </div>
                <div class="phoneContent" v-if="countDone">

                    <input class="input" :style="{fontSize:'35px',color:'#666'}" ref="password" v-model="password" :type="passwordOrText"  placeholder="请输入新密码" />
                    <image  @click="onPasswordOrTextClick()" :class="[passwordOrText=='password'?'ic_psdCloseImg':'ic_psdImg']" :src="passwordOrText=='password'?'https://image.aftdc.com/appBimg/ic_psd_hidden.png':'https://image.aftdc.com/appBimg/ic_psd_show.png'"></image>
                </div>
                <div class="phoneContent" v-if="countDone">

                    <input class="input" :style="{fontSize:'35px',color:'#666'}" ref="password" v-model="rePassword" :type="passwordOrText"  placeholder="请输入确认密码" />
                    <text   class="ic_psdCloseImg"></text>
                </div>
                <text class="details" v-if="countDone" :style="{fontSize:GLOBAL.defaultFS,color:'#fb5147'}">*密码长度8~32位,必须包含数字、字母、符号至少2中或以上元素</text>
                <text class="hasBotton" @click="setNewPwdClick()">保存新密码</text>

            </div>

        </div>
        <toast ref="toast"></toast>
    </div>
</template>

<script>
    import {WxcSlideNav, WxcMinibar} from 'weex-ui';
    import Toast from './Toast.vue'
    const GLOBAL = require('@/Global.vue');
    const navigator = weex.requireModule('navigator');
    const post = weex.requireModule('stream');
    const event=weex.requireModule('event');
    export default {
        components: {WxcSlideNav, WxcMinibar,Toast},
        data() {
            return {
                count:60,
                closeX:false,
                countDone:false,
                yzm:'',
                phoneNumber:'',
                password:'',
                rePassword:'',
                passwordOrText:'password',
                yzmOrPaslogin:0,//0表示验证码登录，1表示密码登录
                cd:'',
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
            getYzm:GLOBAL.throttle(function() {

                var that = this;
                const toast = that.$refs.toast;
                var phone = that.phoneNumber;
                if(!(/^1[34578]\d{9}$/.test(phone))){
                    toast.editContent('请填写正确的手机号')
                    return false;
                }
                this.cd = setInterval(() => that.countdown(), 1000);
                that.countDone = true;
                var param = 'phone=' + phone;
                post.fetch({
                    method: 'post',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/userapp/Login/getYzm',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                }, function (res) {
                    if (res.data.res != 1) {
                        const toast = that.$refs.toast;
                        toast.editContent(res.data.info);

                    }
                })

            }),
            //倒计时
            countdown() {
                if (this.count > 0) {
                    this.count--;
                } else {
                    clearInterval(this.cd);
                    this.count = 60;
                }
            },
            onPasswordOrTextClick(){
                var that=this
                that.passwordOrText=that.passwordOrText=='password'?'text':'password'
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
                    toast.editContent('请填写正确的手机号')
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
                            event.save('userToken', res.data.data.token);
                            event.save('userId', res.data.data.userId);
                            event.save('userName', res.data.data.userName);
                            event.save('userPhoto', res.data.data.userPhoto);
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
            setNewPwdClick:GLOBAL.throttle(function() {
                var that=this
                const toast = that.$refs.toast
                var phone = that.phoneNumber;
                var password = that.password;
                var yzm = that.yzm;
                var rePassword = that.rePassword;
                if(!that.countDone){
                    toast.editContent('请先获取验证码！');
                    return false;
                }
                if(!phone||!password||!yzm||!rePassword){
                    toast.editContent('请填写完整');
                    return false;
                }
                //6-18位 ，由数字、大写字母、小写字母、特殊字符
                var r = /^[0-9a-zA-Z`~!@#$^&*()=|{}':;',.<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]{8,32}$/;//特殊字符可以补充，与后续校验同步即可
                if(r.test(password)){
                    var a = /[0-9]/.exec(that.newPwd)!=null ? 1:0;
                    var b = /[a-z]/.exec(that.newPwd)!=null ? 1:0;
                    var c = /[A-Z]/.exec(that.newPwd)!=null ? 1:0;
                    var d = /[`~!@#$^&*()=|{}':;',.<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]/.exec(that.newPwd)!=null ? 1:0;
                    if(a + b + c + d < 2){
                        toast.editContent('密码必须包含数字、字母、符号至少2中或以上元素！');
                        return false;
                    }//至少2种//
                }
                if(password!==rePassword){
                    toast.editContent('新密码和确认密码不一致');
                    return false;
                }
                var param='phone='+phone+'&password='+password+'&code='+yzm
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/userapp/Login/setNewPwd',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                }, function (res) {
                    const toast=that.$refs.toast
                    toast.editContent(res.data.info)
                    if(res.data.res==1){
                        setTimeout(()=>navigator.pop({ animated: 'true' }),1000);
                    }


                })

            }),
            wxlogin(){
                event.wxlogin()
            },
            viewappear(){
                if (!this.pageBack) { return; }
                this.pageBack = false;
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
        font-size: 45px;
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
        margin-right: 25px;
    }
    .areaCode{
        font-size: 28px;
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
    .getYzm{
        padding-top: 15px;
        padding-bottom: 15px;
        padding-left: 10px;
        padding-right: 10px;
        min-width: 200px;
        border-width: 1px;
        border-style: solid;
        border-color: #999;
        border-radius: 5px;
        text-align: center;
        background-color: #fff;
    }
    .getYzm:active{
        background-color: #f1f1f1;
    }
    .getYzmCount{
        padding-top: 15px;
        padding-bottom: 15px;
        padding-left: 10px;
        padding-right: 10px;
        min-width: 200px;
        border-width: 1px;
        border-style: solid;
        border-color: #999;
        border-radius: 5px;
        text-align: center;
        background-color: #f1f1f1;
    }
    .getYzmCount:active{
        background-color: #f1f1f1;
    }
    .getYzmCount:enabled{
        background-color: #f1f1f1;
    }
</style>
