<template>
    <div class="refundProgress">

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
                <text :style="GLOBAL.headerCenter"  slot="middle">退款进度</text>
            </wxc-minibar>
        </div>

        <scroller style="flex: 1;width: 750px;" show-scrollbar="false">

            <!--退款成功-->
            <div class="success">
                <!--<text class="successText" :style="{fontSize:GLOBAL.biggerFS}">{{orderInfo.orderStatus==1?'已受理':orderInfo.orderStatus==3?'配送中':orderInfo.orderStatus==-3?'退款中':orderInfo.orderStatus==-4?'退款成功':orderInfo.orderStatus==-6?'退款中':''}}</text>-->
                <text class="successText" :style="{fontSize:GLOBAL.biggerFS}">{{orderInfo.orderStatusInfo}}</text>
                <text class="successTextTwo" :style="{fontSize:GLOBAL.smallerFS}">{{orderInfo.orderStatus==-4?'已到账':''}}</text>
            </div>

            <!--退款金额-->
            <div class="money">
                <div class="moneyTop row borderBottom">
                    <text class="moneyText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">退款金额</text>
                    <text class="moneyNum" :style="{fontSize:GLOBAL.defaultFS}">{{orderInfo.realTotalMoney}}元</text>
                </div>
                <div class="moneyTop row">
                    <text class="moneyText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">退款账户</text>
                    <text class="moneyDetails" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">退回支付账户</text>
                </div>
            </div>

            <!--退款流程-->
            <div class="program" :style="{height:takeUp?'':'620px'}">
                <div class="moneyTop row" style="margin-left: 20px;">
                    <text class="moneyText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">退款流程</text>
                </div>

                <!--流程图-->
                <!--<wxc-simple-flow :list="testData" :themeColor="themeColor"></wxc-simple-flow>-->
                <div class="programDiv" ref="box">
                    <div class="programDivLeft" :style="{height:lineHeight+'px'}"></div>
                    <div class="programDivRight" v-for="(item,index) in progressInfo" :key="index" ref="boxTwo">
                        <text class="programtitle" :style="{fontSize:GLOBAL.defaultFS,color:item.highlight?GLOBAL.tColor:GLOBAL.dColor}">{{item.title}}</text>
                        <text class="programDetails" :style="{fontSize:GLOBAL.smallFS,color:'#999'}">{{item.desc}}</text>
                        <text class="programTime" :style="{fontSize:GLOBAL.smallFS,color:'#999'}">{{item.data}}</text>

                        <!--遮住多余的灰色线-->
                        <text class="line" :style="{height:blankHeight}" v-if="takeUp==false&&index==2||index==progressInfo.length-1"></text>
                        <!--园-->
                        <text class="garden" :class="[item.highlight?'gardenTwo':'']"></text>

                    </div>
                </div>
            </div>

            <!--点击收起-->
            <div class="takeUp row" v-if="progressInfo.length>3">
                <div class="takeUpDiv row">
                    <text class="takeUpText" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}" @click="takeUpClick">{{takeUp?'点击收起':'点击展开'}}</text>
                    <image class="takeUpIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png" ref="takeUpTest"></image>
                </div>
            </div>

            <!--退款信息-->
            <div class="refund">
                <text class="refundText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">退款信息</text>
                <!--<div class="refundDiv row" :style="{marginTop:index===0?'0px':'12px'}" @click="toBusinessOrder" v-for="(item,index) in goodsInfo" :key="index">-->
                <!--<image class="refundIcon" :src="'https://image.aftdc.com/'+item.goodsImg"></image>-->
                <!--<div class="refundDetailsDiv">-->
                <!--<div class="row">-->
                <!--<text class="foodName" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.goodsName}}</text>-->
                <!--<text class="foodMoney" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">￥{{item.goodsPrice}}</text>-->
                <!--</div>-->
                <!--<text class="number" :style="{fontSize:GLOBAL.smallFS}">x{{item.goodsNums}}</text>-->
                <!--</div>-->
                <!--</div>-->

                <!-- 订单信息商品列表 -->
                <div class="foodList">
                    <div class="foodItem" v-for="(item,index) in goodsInfo" :key="index">
                        <div class="foodInfo">
                            <image class="foodImg" :src="'https://image.aftdc.com/'+item.goodsImg"></image>
                            <div class="foodName">
                                <div class="row">
                                    <text class="goodsName" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{ item.goodsName }}</text>
                                    <text class="active" :style="{fontSize:GLOBAL.smallFS}" v-if="item.type">{{item.type==1?'折':item.type==2?'秒':item.type==3?'砍':item.type==4?'赠':''}}</text>
                                </div>
                                <text class="howMany" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">×{{ item.goodsNums }}</text>
                                <text class="howMany" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}" v-if="item.goodsAttrName">{{ item.goodsAttrName }}</text>
                            </div>
                        </div>
                        <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">￥{{ item.goodsPrice * item.goodsNums }}</text>
                    </div>
                </div>

                <!-- 餐盒费 -->
                <div class="distribution lunchBoxFee" v-if="orderInfo.boxFee">
                    <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">餐盒费</text>
                    <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">￥{{orderInfo.boxFee}}</text>
                </div>
                <!-- 配送费 -->
                <div class="distribution" v-if="orderInfo.deliverMoney">
                    <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">配送费</text>
                    <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">￥{{orderInfo.deliverMoney}}</text>
                </div>
                <!-- 退回积分 -->
                <div class="distribution" v-if="orderInfo.useScore">
                    <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">退回积分</text>
                    <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">￥{{orderInfo.useScore}}</text>
                </div>

                <!-- 活动优惠 -->
                <div class="totalPricePackage" v-if="youhui.length>0">
                    <div class="CouponInfo">
                        <div class="Coupon" v-for="(item,index) in youhui" :key="index">
                            <div class="CouponName">
                                <div :class="[item.class]">
                                    <text class="CouponNameIconText" :style="{fontSize:GLOBAL.smallFS}">{{item.tip}}</text>
                                </div>
                                <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}" v-if="item.class == 'bl-mz'">买赠活动赠送</text>
                                <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}" v-else>{{item.name}}</text>
                            </div>
                            <text class="CouponText" :style="{fontSize:GLOBAL.defaultFS}" v-if="item.class == 'bl-mz'">{{item.youhui}} {{'* '+item.num}}</text>
                            <text class="CouponText" :style="{fontSize:GLOBAL.defaultFS}" v-else>{{item.name!='赠送积分'?'- ￥'+item.youhui:item.youhui}}</text>
                        </div>
                    </div>
                </div>

                <text class="oddNumbers" :style="{fontSize:GLOBAL.smallFS}">订单原因:&nbsp;&nbsp;{{orderInfo.refundRemark}}</text>
                <text class="oddNumbers" :style="{fontSize:GLOBAL.smallFS}">订单号码:&nbsp;&nbsp;{{orderInfo.orderNo}}</text>
            </div>

        </scroller>


        <!--底部按钮-->
        <text class="bottomBtn" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}" @click="bottomBtnClick">商家电话</text>

        <!--底部按钮弹层-->
        <wxc-popup popup-color="rgb(241, 241, 241)"
                   :show="isBottomShow"
                   ref="btn"
                   @wxcPopupOverlayClicked="popupOverlayBottomClick"
                   pos="bottom"
                   height="300">
            <div class="bottomDemo">
                <text class="bottomDemoOne" :style="{fontSize:GLOBAL.defaultFS}">联系电话</text>
                <text class="bottomDemoTwo" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}" @click="callShop(shopInfo.shopTel)">商家电话:{{shopInfo.shopTel}}</text>
                <text class="bottomDemoOne" :style="{fontSize:GLOBAL.defaultFS}" @click="demoCancelClick">取消</text>
            </div>
        </wxc-popup>

        <Toast ref="toast"></Toast>

    </div>
</template>

<script>
    import { WxcMask,WxcMinibar,WxcButton,WxcPopup } from 'weex-ui';
    const animation = weex.requireModule('animation');
    const modal = weex.requireModule('modal');
    const event = weex.requireModule('event');
    const dom = weex.requireModule('dom');
    const post = weex.requireModule('stream');
    import Toast from './Toast.vue';
    const navigator = weex.requireModule('navigator');
    var param  = weex.config.param ;
    export default {
        components: { WxcMask,WxcMinibar,WxcButton,WxcPopup,Toast },
        name: 'App',
        data () {
            return {
                blankHeight:0,
                isBottomShow:false,
                lineHeight:0,
                takeUp:false,
                // money:12,
                // transactionNum:2312132321123321654,

                size: {
                    height: 0,
                },
                sizeTwo: {
                    height: 0,
                },


                token:'',
                imei:'',
                orderInfo:{},
                goodsInfo:[],
                shopInfo:{},
                youhui:[],

                progressInfo:[],
                orderId:'',
                tk:0,
            }
        },
        created(){
            var that=this;
            event.init();
            var paramI=weex.config.param;
            paramI=JSON.parse(paramI);
            that.orderId=paramI.orderId
            that.tk=paramI.tk
            that.token = weex.config.token;
            that.imei = weex.config.imei;
            var param = this.GLOBAL.sign(this.token,this.imei);
            param+= '&orderId='+that.orderId + '&tk='+that.tk;
            post.fetch({
                method: 'POST',
                type: 'json',
                body: param,
                url: 'https://www.aftdc.com/userapp/Order/refundProgress',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
            },function(res){
                console.log(res)
                if(res.data.res==1){
                    that.orderInfo=res.data.data.orderInfo;
                    that.youhui=res.data.data.orderInfo.youhui;
                    that.goodsInfo=res.data.data.goodsInfo;
                    that.shopInfo=res.data.data.shopInfo;
                    that.progressInfo=res.data.data.progressInfo;
                }
                else{

                    const toast =that.$refs.toast;
                    toast.editContent(res.data.info);
                }
            });
        },
        methods:{
            toEnterMessage(){

            },

            minibarLeftButtonClick(){
                navigator.pop({animated:'false'});
            },
            demoCancelClick(){
                this.$refs.btn.hide()
            },
            popupOverlayBottomClick(){
                this.isBottomShow=false;
            },
            bottomBtnClick(){
                this.isBottomShow=true;
            },
            takeUpClick(){
                if(this.takeUp){
                    var that=this;
                    this.takeUp=false;
                    var testEl = this.$refs.takeUpTest;
                    animation.transition(testEl, {
                        styles: {
                            transform: 'rotate(90deg)',
                            transformOrigin: 'center center'
                        },
                        duration: 500, //ms
                        timingFunction: 'ease',
                        delay: 0 //ms
                    })
                    console.log(that.size.height)
                    console.log(that.lineHeight)
                }
                else{
                    this.takeUp=true;
                    var testEl = this.$refs.takeUpTest;
                    animation.transition(testEl, {
                        styles: {
                            transform: 'rotate(0deg)',
                            transformOrigin: 'center center'
                        },
                        duration: 500, //ms
                        timingFunction: 'ease',
                        delay: 0 //ms
                    })
                }

            },//点击展开收起的动画
            callShop(phone){
                event.phone(phone)
            },//打电话给商家
            toBusinessOrder(){
                var param='';
                var url='http://assets/businessOrder.js';
                event.toUrl({"url":url,"param":param})
            },
        },

        mounted () {
            var that=this;
            setTimeout(() => {
                dom.getComponentRect(that.$refs.box, option => {
                    if (option.result && option.size) {
                        that.$set(that.size,'height',option.size.height)
                    }
                })
                setTimeout(function () {
                    that.lineHeight+=that.size.height
                },50)
            },250);//获取退款流程的最大高度

            setTimeout(() => {
                dom.getComponentRect(that.$refs.boxTwo[that.progressInfo.length-1], option => {
                    if (option.result && option.size) {
                        that.$set(that.sizeTwo,'height',option.size.height)
                    }
                })
                setTimeout(function () {
                    that.blankHeight+=that.sizeTwo.height
                },50)
                // modal.toast({message:'a'+that.lineHeight+"b"+that.blankHeight})
            },250);//获取退款流程最后一个的高度


        },
    }
</script>

<style scoped>
    .bottomDemoTwo{
        text-align: center;
        height: 110px;
        line-height: 110px;
        margin-top: 2px;
        margin-bottom: 8px;
        background-color: #fff;
    }
    .bottomDemoOne{
        text-align: center;
        height: 90px;
        line-height: 90px;
        background-color: #fff;
        color: #999;
    }
    .bottomBtn{
        padding-top: 30px;
        padding-bottom: 30px;
        text-align: center;
        background-color: #fff;
        border-top-style: solid;
        border-top-color: #f1f1f1;
        border-top-width: 2px;
    }
    /*流程图star*/
    .gardenTwo{
        border-style: solid;
        border-width: 5px;
        border-color: #53beb7;
        background-color: #fff;
        width: 20px;
        height: 20px;
        left: 30px;
    }
    .line{
        position: absolute;
        left: 40px;
        top:19px;
        width: 2px;
        background-color: #fff;
        height: 30px;
    }
    .garden{
        width: 10px;
        height: 10px;
        border-radius: 10px;
        background-color: #999;
        position: absolute;
        left: 35px;
        top: 8px;
    }
    .programTime{
        margin-top: 10px;
    }
    .programDetails{
        width: 660px;
        margin-top: 10px;
    }
    .programDivRight{
        padding-left: 70px;
        padding-bottom: 70px;
    }
    .programDivLeft{
        position: absolute;
        top: 8px;
        left: 40px;
        height: 800px;
        width: 1px;
        border-style: solid;
        border-width: 1px;
        border-color: #dedede;
    }
    .programDiv{
        position: relative;
    }
    /*流程图end*/

    .bl-jian {
        width: 35px;
        height: 35px;
        border-radius: 3px;
        background-color: #ff4040;
        justify-content: center;
        align-items: center;
        margin-right: 12px;
    }

    .bl-tuan {
        width: 35px;
        height: 35px;
        border-radius: 3px;
        background-color: #1988f9;
        justify-content: center;
        align-items: center;
        margin-right: 12px;
    }

    .bl-kan {
        width: 35px;
        height: 35px;
        border-radius: 3px;
        background-color: yellowgreen;
        justify-content: center;
        align-items: center;
        margin-right: 12px;
    }

    .bl-miao {
        width: 35px;
        height: 35px;
        border-radius: 3px;
        background-color: green;
        justify-content: center;
        align-items: center;
        margin-right: 12px;
    }

    .bl-zhe {
        width: 35px;
        height: 35px;
        border-radius: 3px;
        background-color: #f4a460;
        justify-content: center;
        align-items: center;
        margin-right: 12px;
    }

    .bl-xin {
        width: 35px;
        height: 35px;
        border-radius: 3px;
        background-color: #53beb7;
        justify-content: center;
        align-items: center;
        margin-right: 12px;
    }

    .bl-xian {
        width: 35px;
        height: 35px;
        border-radius: 3px;
        background-color: #ebd500;
        justify-content: center;
        align-items: center;
        margin-right: 12px;
    }

    .bl-lin {
        width: 35px;
        height: 35px;
        border-radius: 3px;
        background-color: #aa135f;
        justify-content: center;
        align-items: center;
        margin-right: 12px;
    }
    .bl-mz{
        width: 35px;
        height: 35px;
        border-radius: 3px;
        background-color: red;
        justify-content: center;
        align-items: center;
        margin-right: 12px;
    }
    .totalPricePackage {
        position: relative;
    }
    .CouponInfo {
        width: 690px;
        padding-top: 30px;
        border-top-width: 4px;
        border-top-style: dotted;
        border-top-color: #e2e2e2;
        border-bottom-width: 4px;
        border-bottom-style: dotted;
        border-bottom-color: #e2e2e2;
        margin-top: 11px;
        margin-left: 30px;
    }
    .Coupon {
        flex-direction: row;
        justify-content: space-between;
        padding-left: 7px;
        padding-right: 7px;
        align-items: center;
        margin-bottom: 30px;
    }
    .CouponName {
        flex-direction: row;
        align-items: center;
    }
    .CouponText{
        max-width: 406px;
        text-overflow: ellipsis;
        lines:1;
        color: red;
    }

    .CouponNameIconText {
        color: #fff;
    }
    /* 配送费 */
    .distribution {
        flex-direction: row;
        justify-content: space-between;
        padding-left: 33px;
        padding-right: 33px;
        padding-top: 26px;
        padding-bottom: 24px;
    }
    /* 餐盒费 */
    .lunchBoxFee {
        /* 覆盖.distribution的padding-bottom */
        padding-bottom: 14px;
    }
    /* 订单信息商品列表与价格 */
    .foodItem {
        background-color: #f8f8f8;
        justify-content: space-between;
        flex-direction: row;
        align-items: center;
        padding-top: 20px;
        padding-bottom: 20px;
        padding-left: 33px;
        padding-right: 33px;
        margin-bottom: 10px;
    }
    .foodInfo {
        flex-direction: row;
        align-items: center;
    }
    .foodImg {
        width: 115px;
        height: 115px;
    }
    .foodName {
        margin-left: 20px;
        flex: 1;
    }
    .active{
        width: 30px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        margin-left: 10px;
        color: #fff;
        background-color: orange;
    }
    .goodsName{
        max-width: 380px;
        text-overflow: ellipsis;
        lines:1;
    }
    .howMany {
        margin-top: 14px;
    }


    .oddNumbers{
        color: #999;
        margin-top: 20px;
        margin-left: 30px;
    }
    .number{
        margin-top: 30px;
        color: #999;
    }
    .orderMoney{
        justify-content: space-between;
        padding-left: 20px;
        padding-right: 20px;
    }
    .foodName{
        flex: 1;
    }
    .refundDetailsDiv{
        margin-left: 15px;
        flex: 1;
    }
    .refundIcon{
        width: 100px;
        height: 100px;
    }
    .refundDiv{
        padding-top: 15px;
        padding-bottom: 15px;
        padding-left: 20px;
        padding-right: 20px;
        background-color: #f8f8f8;
        flex: 1;
    }
    .refundText{
        margin-left: 20px;
        padding-top: 20px;
        padding-bottom: 20px;
    }
    .refund{
        margin-top: 20px;
        padding-bottom: 20px;
        margin-bottom: 40px;
        background-color: #fff;
    }
    .takeUpDiv{
        border-style: solid;
        border-width: 2px;
        border-color: #dedede;
        padding-top: 8px;
        padding-bottom: 8px;
        padding-left: 8px;
        padding-right: 8px;
    }
    .takeUpIcon{
        width: 20px;
        height: 20px;
        margin-left: 5px;
    }
    .takeUp{
        justify-content: center;
        padding-top: 10px;
        padding-bottom: 30px;
        background-color: #fff;
    }
    .program{
        background-color: #fff;
        margin-top: 15px;
        overflow: hidden;
    }
    .moneyNum{
        color: #f64365;
    }
    .moneyText{
        flex: 1;
    }
    .moneyTop{
        padding-top: 25px;
        padding-bottom: 25px;
    }
    .money{
        background-color: #fff;
        padding-left: 20px;
        padding-right: 20px;
    }
    .successTextTwo{
        color: #fff;
        margin-top: 10px;
    }
    .successText{
        color: #fff;
    }
    .success{
        background-image: linear-gradient(to bottom,#53beb7, #2dd1a7);
        padding-top: 40px;
        padding-bottom: 40px;
        padding-left: 25px;
    }
    .enterButton {
        width: 750px;
        flex-direction: row;
        justify-content: space-around;
        /*position: fixed;*/
        /*left: 0;            存在时固定在底部*/
        /*bottom: 0;*/
        /*right: 0;*/
        background-color: #fff;
        border-top-width: 2px;
        border-top-style: solid;
        border-top-color: #f1f1f1;
        padding-top: 20px;
        padding-bottom: 20px;
        padding-left: 30px;
        padding-right: 30px;
    }

    .okButton:active {
        background-color: #57aba5;
    }
    .minibar {
        /*border-bottom-width: 1px;*/
        /*border-bottom-style: solid;*/
        /*border-bottom-color: #f1f1f1;*/
    }
    .refundProgress{
        background-color: #f8f8f8;
    }
    .row{
        flex-direction: row;
        align-items: center;
    }
    .borderBottom{
        border-bottom-style: solid;
        border-bottom-width: 2px;
        border-bottom-color: #f8f8f8;

    }
</style>
