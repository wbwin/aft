<template>
    <div class="wrapper" >
        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    v-once>
                <image :style="GLOBAL.headerImg" slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter" slot="middle">关于阿凡提</text>
            </wxc-minibar>
        </div>
        <div class="aftExeInfo aiCenter">
            <div class="aftLogo aiCenter jcCenter">
                <image class="aftLogoImg" src="https://image.aftdc.com/appBimg/icon_aft_logo.png"></image>
            </div>
            <text class="aftSignature" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">美好生活 智慧点餐</text>
            <text class="aftVersion" :style="{fontSize:GLOBAL.smallFS}">阿凡提 V1.0.0</text>
        </div>
        <div class="other">
            <!--<div class="otherItem row aiCenter" @click="toQuestionnaire">-->
            <!--<text class="itemText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">调查问卷</text>-->
            <!--<image class="itemIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>-->
            <!--</div>-->
            <div class="otherItem row aiCenter" @click="toAgreementAndDeclaration">
                <text class="itemText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">协议及声明</text>
                <image class="itemIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
            </div>
            <div class="otherItem row aiCenter" @click="checkUpdate">
                <text class="itemText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">检查更新</text>
                <!-- 当前程序是否为最新版本 -->
                <!--<text :style="{fontSize:GLOBAL.defaultFS,color:'#999',marginRight:'5px'}" v-if="latestVersion">好赞，当前已是最新版本</text>-->
                <!--<image class="itemIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png" v-else></image>-->
                <image class="itemIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
            </div>
        </div>
        <scroller></scroller>
        <div class="footer aiCenter">
            <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}">版权信息</text>
            <text class="copyright" :style="{fontSize:GLOBAL.smallFS}">www.aftdc.com</text>
        </div>

        <!--跟新弹层-->
        <wxc-mask height="320"
                  width="600"
                  border-radius="15"
                  duration="200"
                  mask-bg-color="#FFFFFF"
                  :has-animation="true"
                  :has-overlay="true"
                  :show-close="false"
                  :show="updateShow"
                  @wxcMaskSetHidden="wxcMaskSetHidden">
            <div class="content">
                <text class="demoTitle" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">更新{{newVersion}}</text>
                <text class="details" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">新版本发布啦,更多功能优化,享受精致生活,赶紧来体验吧。</text>
                <div class="row aiCenter btn">
                    <text class="btnCancel" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}" @click="demoCancel">取消</text>
                    <text class="btnConfirm" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}" @click="demoUpdate">更新</text>
                </div>

            </div>
        </wxc-mask>
        <Toast ref="toast"></Toast>
    </div>
</template>
<script>
    import {WxcMinibar,WxcMask } from 'weex-ui';
    const event=weex.requireModule('event');
    const navigator = weex.requireModule('navigator');
    const post = weex.requireModule('stream');
    import Toast from './Toast.vue';
    export default {
        components: {WxcMinibar,WxcMask,Toast},
        data() {
            return {
                latestVersion:false,//当前程序是否为最新版本
                updateShow:false,

                token:'',
                imei:'',

                updateData:{},
                version:'1.0.0',//当前版本号
                newVersion:'',//要更新的版本号


            }
        },
        methods: {
            demoCancel(){
                var that=this;
                that.updateShow=false;
            },

            demoUpdate(){
                var that=this;
                that.updateShow=false;
            },

            minibarLeftButtonClick(){
                navigator.pop({animated:'false'});
            },

            toAgreementAndDeclaration(){
                var param=''
                var url='http://assets/agreementAndDeclaration.js'
                event.toUrl({"url":url,"param":param})
            },

            checkUpdate(){
                var that=this;
                var param = this.GLOBAL.sign(this.token,this.imei);;
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: 'https://www.aftdc.com/userapp/Mine/checkForUpdates',
                }, function (res) {
                    if(res.data.res==1){
                        if(that.version!=res.data.data.appUp.version){
                            that.newVersion=res.data.data.appUp.version
                            that.updateShow=true;
                        }
                        else{
                            const toast =that.$refs.toast;
                            toast.editContent('当前已是最新版本');
                            that.latestVersion=true;
                        }
                    }
                    else{
                        const toast =that.$refs.toast;
                        toast.editContent(res.data.info);
                    }
                })
            },

            wxcMaskSetHidden(){
                var that=this;
                that.updateShow=false;
            },

            // toQuestionnaire(){
            //     var param=''
            //     var url='http://assets/questionnaire.js'
            //     event.toUrl({"url":url,"param":param})
            // },

        }
    }
</script>

<style scoped>
    .btnConfirm{
        width: 150px;
        line-height: 100px;
        text-align: center;
    }
    .btnCancel{
        width: 150px;
        line-height: 100px;
        text-align: center;
    }
    .btn{
        justify-content: flex-end;
        margin-top: 40px;
    }
    .details{
        margin-left: 40px;
        margin-right: 40px;
    }
    .demoTitle{
        margin-left: 40px;
        line-height: 120px;
        font-weight: bold;
    }
    .wrapper {
        background-color: #f1f1f1;
    }
    .row {
        flex-direction: row;
    }
    .aiCenter {
        align-items: center;
    }
    .jcCenter {
        justify-content: center;
    }
    .aftExeInfo {
        padding-top: 82px;
        padding-bottom: 86px;
    }
    .aftLogo {
        width: 146px;
        height: 146px;
        background-color: #fff;
        border-radius: 30px;
        margin-bottom: 38px;
    }
    .aftLogoImg {
        width: 122px;
        height: 122px;
        border-radius: 100px;
    }
    .aftVersion {
        color: #999;
        margin-top: 26px;
    }
    .middle {
        height: 100px;
        background-color: #fff;
        border-top-width: 1px;
        border-top-style: solid;
        border-top-color: #e5e5e5;
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: #e5e5e5;
        margin-bottom: 20px;
    }
    .middleBtn {
        flex: 1;
        height: 100px;
    }
    .middleIcon {
        width: 58px;
        height: 58px;
        margin-right: 26px;
    }
    .rightBorder {
        border-right-width: 1px;
        border-right-style: solid;
        border-right-color: #e5e5e5;
    }
    .other {
        background-color: #fff;
        border-top-width: 1px;
        border-top-style: solid;
        border-top-color: #e5e5e5;
    }
    .otherItem {
        justify-content: space-between;
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: #e5e5e5;
        padding-top: 30px;
        padding-bottom: 30px;
        padding-left: 25px;
        padding-right: 25px;
    }
    .itemText {

    }
    .itemIcon {
        width: 22px;
        height: 22px;
    }
    .footer {
        padding-top: 44px;
        margin-bottom: 20px;
    }
    .copyright {
        color: #999;
        margin-top: 10px;
    }
</style>
