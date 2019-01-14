<template>
    <div class="set" @viewappear="viewappear">
        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    v-once
            >
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">设置</text>
                <text :style="GLOBAL.headerRight"  slot="right"></text>
            </wxc-minibar>
        </div>
        <scroller class="scroller">

            <!--个人信息-->
            <div class="personalInfo" v-if="isLand">
                <div class="setDiv" @click="toPersonalInfo">
                    <text class="setDivText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">个人信息</text>
                    <image class="setDivIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                </div>
                <div class="setDiv" @click='toChangePhone'>
                    <text class="setDivText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">换绑手机</text>
                    <text class="phone" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{userPhone}}</text>
                    <image class="setDivIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                </div>
                <!--<div class="setDiv" @click='toSocialBinding'>-->
                <!--<text class="setDivText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">社交账号绑定</text>-->
                <!--<text class="phone" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">绑定/解绑</text>-->
                <!--<image class="setDivIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>-->
                <!--</div>-->
                <div class="setDiv" @click="toChangePassword">
                    <div class="row">
                        <text class="setPassword" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">登陆密码</text>
                        <text class="passwordStrength" :style="{fontSize:GLOBAL.biggerFS}" v-if="setPwd">{{pwStrength?pwStrength:'弱'}}</text>
                    </div>
                    <!--<text class="noPassword" v-if="setPwd==0">未设置</text>-->
                    <div class="row">
                        <text class="changePassword" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{setPwd?'修改':'未设置'}}</text>
                        <image class="setDivIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                    </div>
                </div>
            </div>

            <!--换肤-->
            <div class="personalInfo">
                <div class="setDiv" @click="toSkin">
                    <text class="setDivText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">换肤</text>
                    <image class="setDivIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                </div>
            </div>

            <!--饮食偏好-->
            <!--<div class="personalInfo">-->
            <!--<div class="setDiv" @click="toFoodPreference">-->
            <!--<text class="setDivText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">饮食偏好</text>-->
            <!--<image class="setDivIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>-->
            <!--</div>-->
            <!--</div>-->

            <!--安全中心-->
            <div class="securityCenter">
                <div class="setDiv" @click="toSecurityCenter">
                    <text class="setDivText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">安全中心</text>
                    <image class="setDivIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                </div>
            </div>

            <!--推送消息设置-->
            <div class="securityCenter">
                <div class="setDiv" @click="toPushSet">
                    <text class="setDivText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">推送消息设置</text>
                    <image class="setDivIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                </div>
            </div>

            <!--关于阿凡提-->
            <div class="about">
                <div class="setDiv" @click="toAboutAft">
                    <text class="setDivText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">关于阿凡提</text>
                    <image class="setDivIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                </div>
            </div>

            <!--退出账户按钮-->
            <div class=" enterButton" v-if="isLand">
                <wxc-button class="okButton" text="退出账户" :textStyle="GLOBAL.cancelButtonText" :btnStyle="GLOBAL.cancelButton"
                            @wxcButtonClicked="signOutClick"></wxc-button>
            </div>
        </scroller>

        <!--退出账户弹层-->
        <wxc-mask height="290"
                  width="660"
                  border-radius="10"
                  duration="200"
                  mask-bg-color="#FFFFFF"
                  :has-animation="true"
                  :has-overlay="true"
                  :show-close="false"
                  :show="show"
                  @wxcMaskSetHidden="wxcMaskSetHidden">
            <div class="content">
                <text class="title" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">退出</text>
                <text class="titleText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">退出后您将不能查看阿凡提券,确定退出吗?</text>
                <div class="btn">
                    <text style="flex: 1;"></text>
                    <text class="btnCancel" @click="cancelClick" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}">取消</text>
                    <text class="btnConfirm" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}" @click="goToBack">退出</text>
                </div>
            </div>
        </wxc-mask>
        <toast ref="toast"></toast>
    </div>

</template>

<script>
    import { WxcMask,WxcButton,WxcMinibar, WxcPopup} from 'weex-ui';
    import Toast from './Toast.vue'
    const animation = weex.requireModule('animation')
    const modal = weex.requireModule('modal')
    const event = weex.requireModule('event');
    const dom = weex.requireModule('dom');
    const post = weex.requireModule('stream');
    const navigator = weex.requireModule('navigator');
    const GLOBAL = require('@/Global.vue');
    export default {

        components: {WxcMinibar, Toast, WxcPopup,WxcMask,WxcButton},
        data() {
            return{
                isLand:true,//判断是否为登陆状态

                show:false,
                setPwd:'',
                userPhone:'',
                pwStrength:'',
                token:'',
                imei:'',
            }
        },
        methods:{
            viewappear(){
                var that=this;
                that.getData();
            },

            minibarLeftButtonClick(){
                navigator.pop({animated:'false'});
            },
            signOutClick(){
                var that=this;
                that.show=true;
            },
            goToBack(){//确认退出
                var that=this;
                that.show=false;
                var param = that.GLOBAL.sign(that.token,that.imei);
                post.fetch({
                    method: 'post',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/userapp/Login/logout',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                },function(res){
                    if(res.data.res==1){

                        event.unregisterPush();
                        event.delete('userToken');
                        event.delete('userId');
                        event.delete('userName');
                        event.delete('userPhoto');
                        event.delete('acticleAccount');
                        event.delete('isLogin');

                        that.isLand=false;
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
                });
            },

            wxcMaskSetHidden(){
                var that=this;
                that.show=false;
            },
            cancelClick(){
                var that=this;
                that.show=false;
            },
            toPersonalInfo:GLOBAL.throttle(function () {
                var param='';
                var url='http://assets/personalInfo.js'
                event.toUrl({"url":url,"param":param})
            }),
            toChangePhone:GLOBAL.throttle(function () {
                var param='';
                var url='http://assets/changePhoneVerification.js'
                event.toUrl({"url":url,"param":param})
            }),
            toChangePassword:GLOBAL.throttle(function () {
                var that=this;
                var param=JSON.stringify({setPwd:that.setPwd});
                var url='http://assets/changePassword.js'
                event.toUrl({"url":url,"param":param})
            }),
            toSocialBinding:GLOBAL.throttle(function () {
                var param='';
                var url='http://assets/socialBinding.js'
                event.toUrl({"url":url,"param":param})
            }),
            toSecurityCenter:GLOBAL.throttle(function () {
                var param='';
                var url='http://assets/securityCenter.js'
                event.toUrl({"url":url,"param":param})
            }),
            toPushSet:GLOBAL.throttle(function () {
                var param='';
                var url='http://assets/pushMessageSetting.js'
                event.toUrl({"url":url,"param":param})
            }),
            toAboutAft:GLOBAL.throttle(function () {
                var param=''
                var url='http://assets/aboutAft.js'
                event.toUrl({"url":url,"param":param})
            }),
            toFoodPreference:GLOBAL.throttle(function () {
                var param=''
                var url='http://assets/foodPreference.js'
                event.toUrl({"url":url,"param":param})
            }),
            toSkin:GLOBAL.throttle(function () {
                var param=''
                var url='http://assets/themeColor.js'
                event.toUrl({"url":url,"param":param})
            }),//换肤

            getData(){
                var that=this;
                var param = that.GLOBAL.sign(that.token,that.imei);
                post.fetch({
                    method: 'post',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/userapp/Mine/systemSettings',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                },function(res){
                    if(res.data.res==1){
                        that.setPwd=res.data.data.setPwd;

                        //把手机中间四位变成星号
                        var tel = res.data.data.userPhone;
                        var reg = /^(\d{3})\d{4}(\d{4})$/;
                        tel = tel.replace(reg, "$1****$2");
                        that.userPhone=tel;
                    }
                    else{
                        that.isLand=false;
                        const toast =that.$refs.toast;
                        toast.editContent(res.data.info);
                    }
                });

            },
        },



        created(){
            var that=this;
            that.token = weex.config.token;
            that.imei = weex.config.imei;
            that.getData();
        },
    }
</script>

<style scoped>

    /*弹出层样式*/
    .enterButton {
        flex-direction: row;
        justify-content: space-around;
        /*position: fixed;*/
        /*left: 0;            存在时固定在底部*/
        /*bottom: 0;*/
        /*right: 0;*/
        margin-top: 30px;
        padding-left: 30px;
        padding-right: 30px;
    }

    .okButton:active {
        background-color: #f8f8f8;
    }
    .btnConfirm{
        color: #53beb7;
        font-size: 28px;

    }
    .btnCancel{
        font-size: 28px;
        color: #53beb7;
        margin-right: 50px;
    }
    .btn{
        flex-direction: row;
        align-items: center;
        margin-top: 65px;
    }
    .titleText{
        font-size: 32px;
        color: #333;
        margin-top: 35px;
    }
    .title{
        font-size: 40px;
        color: #333;
    }
    .content{
        padding-top: 50px;
        padding-left: 50px;
        padding-bottom: 50px;
        padding-right: 50px;
        flex-direction: column;
        justify-content: space-between;
    }
    /*弹出层样式*/
    .signOut{
        margin-left: 20px;
        margin-right: 20px;
        margin-top: 30px;
        padding-top: 30px;
        padding-bottom: 30px;
        background-color: #fff;
        border-style: solid;
        border-width: 2px;
        border-color: #e1e1e1;
        text-align: center;

    }
    .setPassword{
        font-size: 32px;
        color: #333;
    }
    .about{
        margin-top: 20px;
    }
    .securityCenter{
        margin-top: 20px;
    }
    .changePassword{
        font-size: 26px;
        color: #999;
        margin-right: 30px;
    }
    .noPassword{
        padding-top: 7px;
        padding-bottom: 7px;
        padding-left: 7px;
        padding-right: 7px;
        color: #ffffff;
        background-color: orangered;
        margin-right: 25px;
        border-radius: 10px;
        font-size: 20px;
    }
    .passwordStrength{
        color: orangered;
        margin-left: 30px;
    }
    .setDivIcon{
        width: 20px;
        height: 20px;
    }
    .phone{
        margin-right: 30px;
    }
    .setDivText{
        flex: 1;
    }
    .setDiv{
        background-color: #fff;
        margin-bottom: 2px;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding-top: 30px;
        padding-bottom: 30px;
        padding-left: 20px;
        padding-right: 20px;
    }
    .setDiv:active{
        background-color: #f1f1f1;
    }
    .personalInfo{
        margin-top: 20px;
    }
    .set{
        background-color: #f8f8f8;
    }
    .scroller{
        width: 750px;
        flex: 1;
    }
    .row{
        flex-direction: row;
        align-items: center;
    }
</style>
