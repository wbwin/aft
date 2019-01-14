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
                <text :style="GLOBAL.headerCenter"  slot="middle">合作信息</text>
                <!--<text :style="GLOBAL.headerRight"  slot="right">帮助</text>-->
            </wxc-minibar>
        </div>

        <div class="scroller_content">
            <div class="box" :class="[qr?'box-ed':'']">
                <div class="box-title">
                    <text class="text-title" :style="{fontSize:'40px',color:GLOBAL.dColor}">商家自配送</text>
                </div>
                <div class="box-list" v-for="(item,index) in boxList" :key="index">
                    <text class="text textL">✓</text>
                    <text class="text">{{item.text}}</text>
                </div>
                <div class="box-qr" v-if="!qr" @click="click_qr">
                    <text class="text" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">请点击确认</text>
                </div>
                <div class="box-qred" v-if="qr">
                    <text class="text " :style="{fontSize:GLOBAL.defaultFS,color:'#fff'}">✓</text>
                </div>
                <div class="box-sf" @click="click_open">
                    <text class="text textSF">收费明细</text>
                </div>
            </div>
        </div>

        <div class="agreeButton">

            <wxc-button class="submitButton" text="同意" :textStyle="GLOBAL.buttonText" :btnStyle="GLOBAL.defaultButton"
                        @wxcButtonClicked="toApplicationInformation()"></wxc-button>
        </div>
        <wxc-mask height="450"
                  width="600"
                  border-radius="10"
                  duration="200"
                  mask-bg-color="#fff"
                  :top="top"
                  :has-animation="hasAnimation"
                  :has-overlay="true"
                  :overlay-can-close="false"
                  :show="show"
                  @wxcMaskSetHidden="wxcMaskSetHidden">
            <div class="content">
                <div class="demo-title">
                    <text class="title_close" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}"></text>
                    <text class="title" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">商家线上营业额收费</text>
                    <wxc-icon name="close" @wxcIconClicked="click_close" class="title_close"></wxc-icon>
                </div>
                <div class="demo-content">
                    <text class=" demo-text-rule" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">阿凡提点餐平台不收取平台服务费，只收取提现手续费0.06%</text>
                    <text class=" demo-text-bold" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">示例</text>
                    <text  :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">假设今日在线支付营业额4000元应收手续费为4000*0.6%=2.4元</text>
                </div>
            </div>
        </wxc-mask>


        <!--确认提交提示框-->
        <wxc-mask height="280"
                  width="600"
                  border-radius="10"
                  duration="200"
                  mask-bg-color="#FFFFFF"
                  :has-animation="true"
                  :has-overlay="true"
                  :show-close="false"
                  :show="tipsShow"
                  @wxcMaskSetHidden="tipsShowClick">
            <div class="content">
                <text class="tipsTiele" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">提示</text>
                <text class="tipsText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">资料审核通过后不可更改</text>
                <div class="row">
                    <text style="flex: 1;"></text>
                    <text class="confirmBtn" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}" @click="tipCancelClick">取消</text>
                    <text class="confirmBtn" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}" @click="tipComfirmClick">确认</text>
                </div>
            </div>
        </wxc-mask>
        <toast ref="toast"></toast>
    </div>
</template>

<script>
    import {WxcMask, WxcIcon, WxcMinibar, WxcButton} from 'weex-ui';
    import Toast from './Toast.vue'

    const post = weex.requireModule('stream');
    const event = weex.requireModule('event');
    export default {
        components: {WxcMask, WxcIcon, WxcMinibar, WxcButton, Toast},
        data() {
            return {
                tipsShow:false,//确认提示框
                show: false,
                hasAnimation: true,
                boxList: [{text: '顾客在线支付'}, {text: '在线结算'}, {text: '享受优质商家排名'}, {text: '专享活动'}],
                qr: false,
                top: 0,
                submitBtnStyle: {
                    backgroundColor: '#53beb7',
                    width: '600',
                    borderColor: '#428a85',
                    borderWidth: '1px',
                    borderStyle: 'solid'
                },
                submitStyle: {
                    color: '#fff'
                },
            }
        },
        created(){
            this.phone = JSON.parse(weex.config.param).phone;
            this.token = JSON.parse(weex.config.param).token;
        },
        methods: {
            tipCancelClick(){
                this.tipsShow=false;
            },
            wxcMaskSetHidden() {
                var that = this;
                that.show = false;
            },
            click_open() {
                this.show = true;
            },
            click_close() {
                this.show = false;
            },
            click_qr() {
                this.qr = !this.qr;

            },
            minibarLeftButtonClick() {

            },
            toApplicationInformation() {
                var that = this
                if (!that.qr) {
                    const toast = that.$refs.toast;
                    toast.editContent('未点击确认');
                    return false
                }
                this.tipsShow=true;
            },
            tipComfirmClick(){
                var that=this
                this.tipsShow=false;
                var param = 'token='+this.token+'&phone='+this.phone+'&imei='+event.find('imei')
                post.fetch({
                    method: 'post',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/businessapp/Enter/enter_thirdStep',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                }, function (res) {
                    if (res.data.res == 1) {
                        var param = {
                            phone:that.phone,
                            token:that.token
                        };
                        var url='http://assets/applicationInformation.js';
                        event.toUrl({"url":url,"param":JSON.stringify(param)});
                        event.backToIndex(3);
                    }else{
                        toast.editContent(res.data.info);
                    }
                });
            },
            tipsShowClick(){
                var that=this
                that.tipsShow=false
            }
        }
    }
</script>

<style scoped>
    .wrapper {
        flex-direction: column;
        background-color: #f8f8f8;
    }

    .content{
        justify-content: space-between;
        flex: 1;
    }
    .tipsTiele{
        padding-top: 20px;
        padding-bottom: 20px;
        padding-left: 25px;
        background-color: #f8f8f8;

    }
    .tipsText{
        padding-left: 25px;
        /*padding-top: 30px;*/
    }
    .confirmBtn{
        padding-top: 30px;
        padding-bottom: 30px;
        padding-left: 30px;
        padding-right: 30px;
    }
    .scroller {
        position: absolute;
        top: 93px;
        bottom: 108px;
        left: 0;
        right: 0;

    }

    .scroller_content {
        flex: 1;
        width: 750px;
        justify-content: center;
        align-items: center;
    }

    .box {
        width: 650px;
        border-style: solid;
        border-width: 2px;
        border-color: #999;
        padding-left: 50px;
        padding-right: 50px;
        justify-content: center;

    }

    .box-ed {
        border-width: 2px;
        border-style: solid;
        border-color: #57aba5;
    }

    .box-title {
        padding-top: 50px;
        padding-bottom: 40px;
        text-align: center;
    }

    .box-list {
        padding-top: 35px;
        padding-bottom: 35px;
        flex-direction: row;
        border-bottom-style: dashed;
        border-bottom-width: 1px;
        border-bottom-color: #ccc;
    }

    .text-title {

        text-align: center;
        font-weight: bold;
    }

    .text {
        text-align: center;
    }

    .textL {
        margin-right: 15px;
        color: #57beb7;
    }

    .box-qr {
        margin-left: 160px;
        margin-right: 160px;
        margin-top: 40px;
        margin-bottom: 30px;
        padding-top: 20px;
        padding-bottom: 20px;
        border-style: solid;
        border-width: 2px;
        border-color: #666;
        border-radius: 10px;
    }

    .box-qred {
        border-radius: 10px;
        margin-left: 160px;
        margin-right: 160px;
        margin-top: 40px;
        margin-bottom: 30px;
        padding-top: 20px;
        padding-bottom: 20px;
        background-color: #57beb7;
        color: #fff;
    }



    .textSF {
        color: #57beb7;
        margin-bottom: 40px;
    }

    .textBTN {
        color: #fff;
    }

    .box2 {
        width: 650px;
        justify-content: center;
    }

    .demo-title {
        flex-direction: row;
        border-bottom-style: solid;
        border-bottom-width: 1px;
        border-bottom-color: #ccc;
    }

    .title {
        height: 90px;
        line-height: 90px;

        width: 400px;
        text-align: center;
    }

    .title_close {
        height: 90px;
        line-height: 90px;
        width: 100px;
        text-align: center;

    }

    .demo-content {

        padding-top: 60px;
        padding-bottom: 60px;
        padding-left: 40px;
        padding-right: 40px;
    }

    .demo-text-rule {
        margin-bottom: 20px;
    }

    .demo-text-bold {
        font-weight: bold;
    }



    .agreeButton {
        flex-direction: row;
        justify-content: space-around;
        padding-top: 20px;
        padding-bottom: 20px;
        padding-left: 30px;
        padding-right: 30px;

    }

    .submitButton:active {
        background-color: #57aba5;
    }
    .submitButton:enabled {
        background-color: #53BEB7;
    }
    .row{
        flex-direction: row;
        align-items: center;
    }

    .backImg {
        width: 40px;
        height: 40px;
    }

    /*.minibar {*/
    /*border-bottom-width: 2px;*/
    /*border-bottom-style: solid;*/
    /*border-bottom-color: #a1a1a1;*/
    /*}*/
</style>
