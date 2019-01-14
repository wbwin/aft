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
                <text :style="GLOBAL.headerCenter"  slot="middle">会员卡声明</text>
            </wxc-minibar>
        </div>

        <scroller style="width: 750px;flex: 1;">
            <div class="lists">
                <div style="align-items: center;margin-top: 50px;">
                    <text :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.tColor}">《会员卡信息使用声明》</text>
                </div>
                <div style="margin-top: 20px;margin-left: 20px;margin-right: 20px;">
                    <text class="fontSize":style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">1、本卡是打折卡，对特殊顾客使用;</text>
                    <text class="fontSize":style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">2、本卡只是在本店铺使用,其他店铺和个人使用无效,不得转借其他店铺和个人;</text>
                    <text class="fontSize":style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">3、本卡不参与积分兑换;</text>
                    <text class="fontSize":style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">4、本卡店铺员工及亲属不得使用;</text>
                    <text class="fontSize":style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">5、一经发现超出本卡的使用规定的故意行为,按公司规章和相关法律处罚。</text>
                </div>
                <div style="align-items: flex-end;margin-right: 40px;">
                    <text class="fontSize":style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">广州阿凡提有限公司</text>
                </div>

                <div class=" enterButton">
                    <wxc-button class="okButton" text="下一步" :textStyle="GLOBAL.buttonText" :btnStyle="GLOBAL.defaultButton"
                                @wxcButtonClicked="wxcButtonClicked"></wxc-button>
                </div>
            </div>
        </scroller>


        <!--<div class="lists">-->
        <!--<div class="details">-->
        <!--<text style="font-size: 35px;color: #333">会员卡详情</text>-->
        <!--</div>-->
        <!--<div style="flex-direction: row;margin-top: 20px;">-->
        <!--<text class="msgLeft">特权说明</text>-->
        <!--<text class="msgRight">1.此卡同时局域消费积分抵现金，储值尊享优惠，电子代金券优惠，积分还礼等多项功能</text>-->
        <!--</div>-->
        <!--<div style="flex-direction: row;margin-top: 20px;">-->
        <!--<text class="msgLeft">有效日期</text>-->
        <!--<text class="msgRight">永久有效</text>-->
        <!--</div>-->
        <!--<div style="flex-direction: row;margin-top: 20px;">-->
        <!--<text class="msgLeft">使用须知</text>-->
        <!--<div>-->
        <!--<text class="msgRight">1.此卡仅限本人使用,结账时出示此卡,卡内积分不可兑换,不予以开具发票;</text>-->
        <!--<text class="msgRight">2.此卡不与其他优惠券,代金券及店内优惠活动同时使用</text>-->
        <!--</div>-->
        <!--</div>-->
        <!--</div>-->
    </div>
</template>


<script>
    import {WxcIcon, WxcButton,WxcMinibar} from 'weex-ui';
    const modal = weex.requireModule('modal');

    export default {
        components: {WxcIcon, WxcButton,WxcMinibar},
        data() {
            return {
                startTime:'',
                showBtn:true,
                sex:0,
                backImgToggle: 0,//头部返回图片判断
                tabActive: 0,//详情页面切换
                selectNum: 0,//商家协议
                pageActive:'',//详情页面信息切换

            }
        },
        methods: {
            birthClick(){
                event.chooseTime(false,false,false,true,true,false)
            },
            focus(){
                this.showBtn=false;
            },
            blur(){
                this.showBtn=true;
            },
            minibarLeftButtonClick(){},
            backClick() {
                this.backImgToggle = 0
                this.tabActive = 0
            },
            wxcButtonClicked(){

            },
            detailsClick(){
                this.tabActive=1
                this.pageActive=0
            },
            informationClick(){
                this.tabActive=1
                this.pageActive=1
            }
        },
        created(){
            var that=this
            event.init();
            weex.requireModule('globalEvent').addEventListener("birthClick",function(e){
                that.startTime = e.time;
            });
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
        padding-top: 40px;
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
        background-color: #53beb7;
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
        margin-left: 50px;
        flex: 1;
        margin-top: 15px;
        margin-bottom: 15px;
    }

    .select {
        width: 27px;
        height: 27px;
    }
    .fontSize{
        line-height: 60px;
    }
    .details{
        margin-left: 20px;
        margin-right: 20px;
        padding-top: 20px;
        padding-bottom: 20px;
        border-bottom-color: #999;
        border-bottom-width: 1px;
        border-bottom-style: solid;
    }
    .msgLeft{
        font-size: 30px;
        color: #999;
        margin-left: 20px;
        margin-right: 80px;
    }
    .msgRight{
        font-size: 30px;
        color: #333;
        width: 500px;
        line-height: 40px;
    }
</style>
