<template>
    <div class="wrapper">
        <!--头部-->
        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    v-once
            >
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">激活会员卡</text>
            </wxc-minibar>
        </div>

        <scroller style="width: 750px;flex: 1;padding-left: 20px;padding-right: 20px;" show-scrollbar="false">
            <div class="card">
                <image class="cardIcon" src="https://image.aftdc.com/images/packageA/shopImg2.jpg"></image>
                <div style="margin-left: 20px;">
                    <text class="cardText" :style="{fontSize:GLOBAL.biggerFS}">广州堡德仕</text>
                    <text class="cardTextTwo" :style="{fontSize:GLOBAL.defaultFS}">会员卡</text>
                </div>
            </div>
            <div class="cardTable">
                <div class="activation">
                    <text :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">激活立享会员特权</text>
                    <div style="flex-direction: row;align-items: center;margin-top: 10px;">
                        <text :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.tColor}" @click="detailsClick">会员卡详情</text>
                        <image class="cardTableIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                    </div>

                </div>
                <div style="padding-left: 20px;padding-right: 20px;flex: 1;">
                    <text class="mandatory" :style="{fontSize:GLOBAL.defaultFS}">必填信息</text>
                    <div class="classStyle" style="flex-direction: row;align-items: center">
                        <text class="name" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor,flex:0.3}">姓名</text>
                        <input type="text" class="input" placeholder="请输入姓名" ref="firInput" :style="GLOBAL.inputText"  @focus="allFocus" @blur="allBlur">
                    </div>
                    <div class="classStyle row">
                        <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor,flex:0.3}">手机</text>
                        <input type="tel" class="input" placeholder="请输入手机号" ref="secInput" :style="GLOBAL.inputText" @focus="allFocus" @blur="allBlur">
                    </div>
                    <div class="classStyle row">
                        <text  :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor,flex:0.3}">性别</text>
                        <div class="row" style="flex: 1">
                            <div class="row" @click="sex=0">
                                <image class="classStyleIcon" :src="sex==0?'https://image.aftdc.com/appBimg/radio_check.png':'https://image.aftdc.com/appBimg/radio.png'"></image>
                                <text class="sex" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">男</text>
                            </div>
                            <div class="row" @click="sex=1">
                                <image class="classStyleIcon" style="margin-left: 40px;" :src="sex==0?'https://image.aftdc.com/appBimg/radio.png':'https://image.aftdc.com/appBimg/radio_check.png'"></image>
                                <text class="sex" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">女</text>
                            </div>
                        </div>
                    </div>
                    <div class="classStyle" style="flex-direction: row;align-items: center">
                        <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor,flex:0.3}">出生日期</text>
                        <div class="row" style="justify-content: space-between;flex: 1;" @click="chooseTime">
                            <text class="sex" :style="{fontSize:GLOBAL.defaultFS,color:startTime==''?'#999':GLOBAL.dColor}">{{startTime==''?'未选择':startTime}}</text>
                            <image class="cardTableIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                        </div>
                    </div>
                    <div style="flex-direction: row;align-items: center;padding-top: 30px;padding-bottom: 30px;">
                        <div style="flex-direction: row;align-items: center;" @click="selectNum=!selectNum">
                            <image class="select" :src="selectNum==0?'https://image.aftdc.com/appBimg/ic_check_box_normal.png':'https://image.aftdc.com/appBimg/ic_check_box_checked.png'"></image>
                            <text :style="{fontSize:GLOBAL.defaultFS,color:'#999',marginLeft:'5px'}">我已阅读并同意</text>
                        </div>
                        <text @click="toMemberStatement" class="listsText"  :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}">会员信息使用声明</text>
                    </div>
                </div>

            </div>
        </scroller>
        <div class=" enterButton" v-if="!inputFocus">
            <wxc-button class="okButton" text="下一步" :textStyle="GLOBAL.buttonText" :btnStyle="GLOBAL.defaultButton"
                        @wxcButtonClicked="wxcButtonClicked"></wxc-button>
        </div>


        <wxc-mask height="650"
                  width="550"
                  border-radius="15"
                  duration="200"
                  mask-bg-color="#FFFFFF"
                  :has-animation="true"
                  :has-overlay="true"
                  :show-close="false"
                  :show="detailsShow"
                  @wxcMaskSetHidden="wxcMaskSetHidden">

            <div class="lists">
                <div class="listsContent">
                <div class="details">
                    <text :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.tColor,textAlign:'center'}">会员卡详情</text>
                </div>
                    <scroller style="flex: 1" show-scrollbar="false">
                <div style="margin-top: 10px;">
                    <text class="msgLeft" :style="{fontSize:GLOBAL.bigFS}">特权说明:</text>
                    <text class="msgRight" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">此卡同时局域消费积分抵现金，储值尊享优惠，电子代金券优惠，积分还礼等多项功能</text>
                </div>
                <div style="margin-top: 20px;">
                    <text class="msgLeft" :style="{fontSize:GLOBAL.bigFS}">有效日期:</text>
                    <text class="msgRight" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">永久有效</text>
                </div>
                <div>
                    <text class="msgLeft" :style="{fontSize:GLOBAL.bigFS,marginTop:'20px'}">使用须知:</text>

                    <text class="msgRight" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">1.此卡仅限本人使用,结账时出示此卡,卡内积分不可兑换,不予以开具发票;</text>
                    <text class="msgRight" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">2.此卡不与其他优惠券,代金券及店内优惠活动同时使用</text>

                </div>
                    </scroller>
                </div>
                <text class="cardConfirm" @click="wxcMaskSetHidden" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor}">确定</text>
            </div>



        </wxc-mask>

        <div class="blank" :style="{left:blankLeft}" @click="blankClick"></div>
    </div>
</template>


<script>
    import {WxcIcon, WxcButton,WxcMinibar,WxcMask } from 'weex-ui';
    const modal = weex.requireModule('modal');
const event=weex.requireModule('event');
    export default {
        components: {WxcIcon, WxcButton,WxcMinibar,WxcMask },
        data() {
            return {
                detailsShow:false,
                startTime:'',
                sex:0,
                backImgToggle: 0,//头部返回图片判断
                tabActive: 0,//详情页面切换
                selectNum: 0,//商家协议
                pageActive:'',//详情页面信息切换
                inputFocus:false,
                blurPrevent:true,//阻止多次失去焦点的定时器
                blankLeft:'750px',
            }
        },
        methods: {
            cardConfirm(){
                this.detailsShow=false;
            },
            chooseTime(){
                this.$refs.firInput.focus();
                this.$refs.firInput.blur();
                event.chooseTime(true,true,true,false,false,false)
            },

            minibarLeftButtonClick(){},
            backClick() {
                this.backImgToggle = 0
                this.tabActive = 0
            },
            wxcMaskSetHidden(){
                this.detailsShow=false;
            },

            detailsClick(){
                this.detailsShow=true;
            },
            toMemberStatement(){
              var param='';
              var url='http://assets/memberStatement.js';
              event.toUrl({"url":url,"param":param})
            },
            allFocus(){
                var that=this
                that.inputFocus=true
                that.blankLeft='0px';
            },
            allBlur(){
                var that=this
                that.blankLeft='750px';
                if(that.blurPrevent) {
                    that.blurPrevent = false;
                    setTimeout(function () {
                        that.inputFocus = false;
                        that.blurPrevent=true;

                    }, 150)
                }

            },
            blankClick(){
                this.$refs.firInput.blur()
                this.$refs.secInput.blur()
                this.blankLeft='750px';
            },
            wxcButtonClicked(){
                var param='';
                var url='http://assets/rechargeAmount.js';
                event.toUrl({"url":url,"param":param})
            },
        },
        created(){
            var that=this
            event.init();
            weex.requireModule('globalEvent').addEventListener("chooseTime",function(e){
                that.startTime = e.time;
            });
        },
    }
</script>


<style scoped>
    .noButton:active{
        background-color: #f8f8f8;
    }
    .cardConfirm{
        width: 550px;
        /*position: fixed;*/
        /*left: 0;*/
        /*bottom: 0;*/
        /*right: 0;*/
        border-top-style: solid;
        border-top-width:1px;
        border-top-color: #f8f8f8;
        margin-top: 20px;
        padding-top: 20px;
        padding-bottom: 20px;
        /*margin-left: 150px;*/
        /*margin-right: 150px;*/
        background-color: #fff;
        text-align: center;
        /*border-radius: 10px;*/
    }
    .cardConfirm:active{
        background-color: #f1f1f1;
    }
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
    }

    .okButton:active {
        background-color: #57aba5;
    }
    .wrapper {
        background-color: #f8f8f8;
    }

    .header {
        flex-direction: row;
        height: 90px;
        background-color: #53beb7;
        align-items: center;
        justify-content: space-between;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
    }

    .back {
        margin-left: 40px;
        flex: 1;
    }

    .backImg {
        width: 40px;
        height: 40px;
    }

    .appName {
        flex: 2;
    }

    .appNameCss {
        text-align: center;
        font-size: 40px;
        color: #fff;
    }

    .allSave {
        flex: 1;
        margin-right: 40px;

    }

    .leftPage {
        width: 750px;
    }

    .list {
        position: absolute;
        top: 89px;
        left: 0;
        right: 0;
        bottom: 0;
        align-items: center;
    }
    .listsText{
        text-decoration: underline;
        margin-left: 10px;
    }
    .lists{
        width: 550px;
        flex-direction: column;
        justify-content: space-between;
    }
.listsContent{
   padding-left: 20px;
    padding-right: 20px;
}

    .rightPage {
        width: 750px;

    }

    .cardTable{
        background-color: #fff;
        flex: 1;
        margin-top: 20px;
    }
    .cardTextTwo{
        color:#fff;
        margin-top: 10px;
    }
    .cardText{
        color: #fff;
    }
    .cardIcon{
        width: 100px;
        height: 100px;
        border-radius: 50px;
    }
    .card {
        flex-direction: row;
        background-image:linear-gradient(to right, #54e6df,#57aba5);
        border-radius: 10px;
        padding-left: 20px;
        padding-right: 20px;
        align-items: center;
        margin-top: 20px;
        padding-top: 20px;
        padding-bottom: 20px;
    }

    .cardTableIcon{
        width: 20px;
        height: 20px;
        margin-left: 5px;
    }
    .activation {
        align-items: center;
        padding-top: 40px;
        padding-bottom: 40px;
        border-bottom-style: dashed;
        border-bottom-color: #dedede;
        border-bottom-width: 2px;
    }

    .mandatory {
        color: #999;
        padding-top: 30px;
        padding-bottom: 30px;
        padding-left: 10px;
        padding-right: 10px;
        border-bottom-width: 1px;
        border-bottom-color: #dedede;
    }
    .name{
    }
    .sex{
        margin-left: 5px;
    }
    .classStyleIcon{
        width: 35px;
        height: 35px;
    }
    .classStyle {
        padding-left: 10px;
        padding-right: 10px;
        border-bottom-width: 1px;
        border-bottom-color: #dedede;
        height: 100px;
    }
    .row{
        flex-direction: row;
        align-items: center;
    }

    .input {
        /*margin-left: 50px;*/
        flex: 1;
        margin-top: 15px;
        margin-bottom: 15px;
        margin-left: 10px;
    }

    .select {
        width: 27px;
        height: 27px;
    }
    .confirmText{

    }
    .fontSize{
        font-size: 25px;
        color: #333;
        line-height: 60px;
    }
    .details{
        padding-top: 30px;
        padding-bottom: 20px;
    }
    .msgLeft{
        color: #999;
    }
    .msgRight{
        line-height: 40px;
        flex: 1;
        margin-left: 20px;
        margin-top: 10px;
    }
    .blank{
        position: absolute;
        width: 750px;
        bottom: 0;
        top: 0;
    }
</style>
