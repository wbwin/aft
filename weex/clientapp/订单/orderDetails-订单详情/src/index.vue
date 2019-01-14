<template>
    <div class="wrapper" @viewappear="viewappear" @viewdisappear="viewdisappear">

        <!--页头-->
        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    v-once
            >
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">订单详情</text>
                <image class="customerService" slot="right" src="http://chuantu.biz/t6/331/1529550282x-1566688299.png"></image>
            </wxc-minibar>
        </div>

        <scroller class="scrollerStyle" show-scrollbar="false">

            <refresh class="refresh" @refresh="onrefresh"  :display="refreshing ? 'show' : 'hide'">
                <image class="indicator" src="https://image.aftdc.com/appBimg/ic_loading_gif.gif"></image>
            </refresh>
            <!-- 订单状态栏 -->

                <div class="orderStatusContent">
                    <div class="orderStatus"  @click="openBottomPopup">
                        <text class="orderStatusText" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">【{{order.orderTypeInfo}}】 </text>
                        <text class="orderStatusText" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">{{order.orderStatusInfo}}</text>
                    </div>
                    <text class="orderStatusWord" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}" v-if="order.promptInfo">{{order.promptInfo}}</text>

                    <div class="time row" v-if="order.orderStatus === -2">
                        <image class="timeIcon" src="https://image.aftdc.com/images/stin.png"></image>
                        <text>等待支付 : {{countDown}}</text>
                    </div>
                    <!--<div class="orderProtect">-->
                    <!--<div class="orderProtectIcon">-->
                    <!--<image class="orderProtectIconSize" src="http://chuantu.biz/t6/331/1529551406x-1566688437.png"></image>-->
                    <!--</div>-->
                    <!--<text class="orderProtectText" :style="{fontSize:GLOBAL.smallerFS,color:GLOBAL.tColor}">已开启号码保护</text>-->
                    <!--</div>-->
                    <div class="orderStatusBtn">
                        <div class="btnDiv">
                            <text class="btn" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}" v-if="order.orderStatus == -2" @click="goPay">立即支付</text>
                            <text class="btn" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}" v-if="order.orderStatus == -2" @click="noPayCancel">取消订单</text>
                            <text class="btn" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}" v-if="order.orderStatus == 0" @click="noReceiptCancel">取消订单</text>
                            <text class="btn" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}" v-if="(order.orderStatus == 1 || order.orderStatus == 3) && !order.userAction" @click="isPayCancel">取消订单</text>
                            <text class="btn" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}" v-if="order.canRemind" :class="[order.reminder==3?'isRemind':'']" @click="reminder">{{order.reminder==0?'催单':order.reminder==1?'继续催单':order.reminder==3?'已催单':''}}</text>
                            <text class="btn" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}" v-if="order.orderStatus == -1|| order.orderStatus == -3 || order.orderStatus == -6" @click="tkProcess">退款进度</text>
                            <text class="btn" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}" v-if="(order.orderStatus == 1 || order.orderStatus == 3) && order.orderType != 3" @click="confirmGet">确认收货</text>
                            <text class="btn" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}" v-if="order.orderStatus == 1 && order.orderType == 3" @click="confirmGet">已用餐</text>
                            <text class="btn" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}" v-if="order.orderStatus == -10 || order.orderStatus == -4 || order.orderStatus == -7 || order.isAppraises == 1" @click="goElse">逛逛别家</text>
                            <text class="btn" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}" v-if="order.orderStatus == -10 || order.orderStatus == -7 || order.orderStatus == 0 || order.orderStatus == -3 || order.orderStatus == -4 || order.orderStatus == 4" @click="oneMore">再来一单</text>
                            <text class="btn" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}" v-if="order.orderStatus == 4 && order.isAppraises==0" @click="evaluate">评价</text>
                        </div>
                    </div>
                </div>


            <!-- 订单信息 -->

                <div class="orderInfo">

                    <!--订单信息头部-->
                    <div class="shopTitle" @click="goShop">
                        <div class="shopTitleInfo">
                            <image class="shopLogo" :src="'https://image.aftdc.com/'+shopInfo.shopImg"></image>
                            <text class="shopName" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{shopInfo.shopName}}</text>
                        </div>
                        <image class="shopTitleArrow" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                    </div>

                    <!-- 订单信息商品列表 -->
                    <div class="foodList" v-if="!order.shareId">
                        <div class="foodItem" v-for="(item,index) in goodslist" :key="index" v-if="shopFoodList || index < 3">
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
                    <div v-else>
                        <div v-for="(item,index) in shareGoodslist" v-if="shopFoodList||(!shopFoodList&&index<1)">
                            <div class="aiCenter"  v-if="shareGoodslist.length>1">
                                <text class="Share_circle"></text>
                                <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">口袋{{index+1}}</text>
                            </div>
                            <div class="foodItem" v-for="(food,foodIndex) in item.goodsInfo"  v-if="shopFoodList || (!shopFoodList&&foodIndex<3)">
                                <div class="foodInfo">
                                    <image class="foodImg" :src="'https://image.aftdc.com/'+food.goodsImg"></image>
                                    <div class="foodName">
                                        <div class="row">
                                            <text class="goodsName" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{ food.goodsName }}</text>
                                            <text class="active" :style="{fontSize:GLOBAL.smallFS}" v-if="item.type">{{food.type==1?'折':food.type==2?'秒':food.type==3?'砍':food.type==4?'赠':''}}</text>
                                        </div>
                                        <text class="howMany" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">×{{ food.goodsNums }}</text>
                                        <text class="howMany" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}" v-if="food.goodsAttrName">{{ food.goodsAttrName }}</text>
                                    </div>
                                </div>
                                <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">￥{{ food.goodsPrice * food.goodsNums }}</text>
                            </div>
                        </div>
                    </div>
                    <!--点击展开收起按钮-->
                    <div class="foodListBtn" v-if="goodslist.length>3||(shareGoodslist.length>0&&shareGoodslist[0].goodsInfo.length>3)||shareGoodslist.length>1">
                        <div class="foodListBtnStyle" v-if="shopFoodList" @click="showFoodList">
                            <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">点击收起</text>
                            <image class="foodListBtnImg" src="https://image.aftdc.com/appBimg/ic_expanded_up.jpg"></image>
                        </div>
                        <div class="foodListBtnStyle" v-else  @click="showFoodList">
                            <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">点击展开</text>
                            <image class="foodListBtnImg" src="https://image.aftdc.com/appBimg/ic_expanded_down.jpg"></image>
                        </div>
                    </div>

                    <!-- 餐盒费 -->
                    <div class="distribution lunchBoxFee" v-if="order.boxFee&&order.orderType!=6 && order.orderType!=7&&order.orderType!=3">
                        <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">餐盒费</text>
                        <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">￥{{order.boxFee}}</text>
                    </div>

                    <!-- 配送费 -->
                    <div class="distribution" v-if="shopInfo.dsm&&order.orderType!=6 && order.orderType!=7&&order.orderType!=3">
                        <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">配送费</text>
                        <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">￥{{shopInfo.dsm}}</text>
                    </div>

                    <!-- 活动 -->
                    <div class="totalPricePackage" v-if="youhui.length>0">
                        <div class="circular leftTop"></div>
                        <div class="circular rightTop"></div>
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

                    <!-- 总价格 -->
                    <div class="totalPricePackage">
                        <div class="circular leftTop"></div>
                        <div class="circular leftBottom"></div>
                        <div class="circular rightTop"></div>
                        <div class="circular rightBottom"></div>
                        <div class="totalPrice">
                            <text class="totalPriceStyle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor}">￥{{ order.needPay }}</text>
                            <text class="totalPriceText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">实付&nbsp;</text>
                            <text class="concessionText" :style="{fontSize:GLOBAL.defaultFS}">总计￥{{order.totalMoney}}</text>
                        </div>
                    </div>
                    <!-- 联系商家 -->
                    <div class="contactInfo">
                        <div class="contactBtn" @click="onlineContact">
                            <image class="lineIcon" src="https://image.aftdc.com/images/xzkf.png"></image>
                            <text class="onlineContactText contactFont" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">在线联系</text>
                        </div>
                        <div class="contactLine"></div>
                        <div class="contactBtn" @click="callBusiness">
                            <image class="contactIcon" src="https://image.aftdc.com/images/lxsj.png"></image>
                            <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">电话商家</text>
                        </div>
                    </div>
                </div>

            <!-- 配送信息 -->

                <div class="distributionInfo"  v-if=" order.orderType!=6 && order.orderType!=7&&order.orderType!=3 ">

                    <div class="distributionContent" v-if="order.orderType==0">
                        <text class="grayFont" :style="{fontSize:GLOBAL.defaultFS}">期望时间</text>
                        <text class="rightText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{order.requireTime }}</text>
                    </div>
                    <div class="distributionContent" v-if="order.orderType==5">
                        <text class="grayFont" :style="{fontSize:GLOBAL.defaultFS}">自取时间</text>
                        <text class="rightText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{order.requireTime }}</text>
                    </div>

                    <div class="distributionContent" v-if="order.orderType==0">
                        <text class="grayFont" :style="{fontSize:GLOBAL.defaultFS}">配送地址</text>
                        <div class="rightText">
                            <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{order.userName}} {{order.userPhone}}</text>
                            <text class="address" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{order.userAddress}}</text>
                        </div>
                    </div>
                    <div class="distributionContent" v-if="order.orderType==5">
                        <text class="grayFont" :style="{fontSize:GLOBAL.defaultFS}">商家地址</text>
                        <text class="rightText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{shopInfo.shopAddress}}</text>
                    </div>
                    <div class="distributionContent" v-if="order.orderType==5">
                        <text class="grayFont" :style="{fontSize:GLOBAL.defaultFS}">自取电话</text>
                        <text class="rightText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{order.userPhone}}</text>
                    </div>

                    <div class="distributionContent" v-if="order.orderType==0">
                        <text class="grayFont" :style="{fontSize:GLOBAL.defaultFS}">配送服务</text>
                        <text class="rightText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">由&nbsp;商家&nbsp;提供配送服务</text>
                    </div>
                </div>

            <!-- 订单其他信息（样式与配送信息一样） -->

                <div class="distributionInfo mm40">

                    <div class="orderNumber">
                        <div class="distributionContent">
                            <text class="grayFont" :style="{fontSize:GLOBAL.defaultFS}">订单号码</text>
                            <text class="rightText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{order.orderNo}}</text>
                        </div>
                        <div class="copy" @click="copy">
                            <text class="copyText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">复制</text>
                        </div>
                    </div>

                    <div class="distributionContent">
                        <text class="grayFont" :style="{fontSize:GLOBAL.defaultFS}">下单时间</text>
                        <text class="rightText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{order.createTime}}</text>
                    </div>

                    <div class="distributionContent" v-if="order.orderType == 3">
                        <text class="grayFont" :style="{fontSize:GLOBAL.defaultFS}">到达时间</text>
                        <text class="rightText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{order.deskArr.reachTime}}</text>
                    </div>

                    <div class="distributionContent" v-if="order.orderType == 3">
                        <text class="grayFont" :style="{fontSize:GLOBAL.defaultFS}">用餐人数</text>
                        <text class="rightText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{order.deskArr.numb}}</text>
                    </div>

                    <div class="distributionContent" v-if="order.orderType == 3">
                        <text class="grayFont" :style="{fontSize:GLOBAL.defaultFS}">预  订  人</text>
                        <text class="rightText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{order.deskArr.inputName}} {{order.deskArr.sex==2?'先生':order.deskArr.sex==1?'女士':''}}</text>
                    </div>

                    <div class="distributionContent" v-if="order.orderType == 3">
                        <text class="grayFont" :style="{fontSize:GLOBAL.defaultFS}">联系方式</text>
                        <text class="rightText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{order.deskArr.inputPhone}}</text>
                    </div>

                    <div class="distributionContent" v-if="billInfo.length>0">
                        <text class="grayFont" :style="{fontSize:GLOBAL.defaultFS}">发票信息</text>
                        <div class="rightText">
                            <div class="billDiv">
                                <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{billInfo.trueName}}</text>
                                <text class="billType">{{billInfo.type}}</text>
                            </div>
                            <text class="address" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}" v-if="billInfo.dutyNum">{{billInfo.dutyNum}}</text>
                        </div>
                    </div>

                    <div class="distributionContent" v-if="order.orderStatus!=-2">
                        <text class="grayFont" :style="{fontSize:GLOBAL.defaultFS}">支付方式</text>
                        <text class="rightText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">在线支付</text>
                    </div>
                </div>

            <!--<div class="investigation">-->
            <!--<text class="fontSize">订单匿名小调查</text>-->
            <!--<image class="arrow" src="http://chuantu.biz/t6/331/1529552181x-1566688437.png"></image>-->
            <!--</div>-->
        </scroller>

        <!-- 订单跟踪 -->
        <wxc-popup popup-color="rgb(255, 255, 255)"
                   :show="isBottomShow"
                   ref="wxcPopup"
                   @wxcPopupOverlayClicked="popupOverlayBottomClick"
                   pos="bottom"
                   height="850"  >
            <div class="demo-content orderTracking">

                <div class="orderTrackingTitle">
                    <text class="orderTrackingCloseText">订单跟踪</text>
                </div>
                <template>
                    <wxc-simple-flow :list="orderTrackingData" :themeColor="themeColor">
                    </wxc-simple-flow>
                </template>
                <div class="orderTrackingClose" @click="orderTrackingclose">
                    <text class="orderTrackingCloseText fontWhite">关闭</text>
                </div>

            </div>
        </wxc-popup>



        <!-- 固定客服icon -->

        <Toast ref="toast"></Toast>
    </div>
</template>

<script>
    const GLOBAL = require('@/Global.vue');
    import { WxcMinibar } from 'weex-ui';
    import { WxcPopup } from 'weex-ui';
    import { WxcSimpleFlow } from 'weex-ui';
    const modal = weex.requireModule('modal');
    const clipboard = weex.requireModule('clipboard');
    const post = weex.requireModule('stream');
    const navigator = weex.requireModule('navigator');
    const event = weex.requireModule('event');
    import Toast from './Toast.vue';

    export default {
        name: 'App',
        components: { WxcMinibar,WxcPopup,WxcSimpleFlow,Toast},
        data() {
            return {

                order:{},
                shopInfo:{},
                orderTrackingData:[],
                billInfo:[],
                youhui:[],

                shopFoodList: false,
                isBottomShow: false,
                goodslist:[],//获取商品列表
                shareGoodslist:[],//获取拼单商品列表

                refreshing:false,


                themeColor: {
                    lineColor: '#d8d8d8',
                    pointInnerColor: '#d8d8d8',
                    pointBorderColor: '#d8d8d8',
                    highlightTitleColor: '#53beb7',
                    highlightPointInnerColor: '#029181',
                    highlightPointBorderColor: '#53beb7'
                },

                countDown:'00:00',//倒计时
                tk:'',
                token:'',
                imei:'',
                orderId:'',
                pageBack:false,

            }
        },

        created(){
            var that=this
            event.init();
            var paramI  = weex.config.param ;
            paramI=JSON.parse(paramI);
            that.token = weex.config.token;
            that.imei = weex.config.imei;
            that.orderId=paramI.orderId
            that.tk=paramI.tk
            this.getData();
        },
        methods: {

            getData(){
                var that=this;

                var param= that.GLOBAL.sign(this.token,this.imei);
                param+= '&orderId=' +that.orderId + '&tk='+that.tk;
                // param+= '&orderId=' +'3585' + '&tk='+'0';

                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: 'https://www.aftdc.com/userapp/Order/getOrderDetails',
                }, function (res) {
                    console.log(JSON.stringify(res))
                    if(res.data.res==1){
                        var order=res.data.data;
                        that.order=order;
                        if(order.goodslist&&!order.shareId) that.goodslist=order.goodslist;
                        if(order.goodslist&&order.shareId) that.shareGoodslist=order.goodslist;
                        if(order.shopInfo) that.shopInfo=order.shopInfo;
                        if(order.orderTrackingData)  that.orderTrackingData=order.orderTrackingData;
                        if(order.billInfo) that.billInfo=order.billInfo;
                        if(order.youhui) that.youhui=order.youhui;
                        switch (order.orderType) {
                            case 0:
                                order.shopType = 1
                                break;
                            case 5:
                                order.shopType = 2
                                break;
                            case 3:
                                order.shopType = 5
                                break;
                        }
                        if(order.orderType==0&&that.shopInfo.dsm==0){
                            order.shopType = 3
                        }


                        // 15分钟倒计时
                        if(that.order.orderStatus===-2){
                            var createTime = that.order.createTime.replace(/-/g, '/');
                            var createTime2 = new Date;
                            var d1 = new Date(createTime);
                            console.log(d1+'123');
                            var d3 = Math.floor((createTime2 -d1 ) / 1000) ;

                            if (d3 < 900) {
                                var time = setInterval(function () {
                                    var sub = 900 - d3
                                    var min = Math.floor(sub / 60);
                                    min = min > 9 ? min : '0' + min
                                    var sec = sub % 60;
                                    sec = sec > 9 ? sec : '0' + sec
                                    var t = min + ":" + sec
                                    that.countDown= t;
                                    d3++;
                                    if (d3 > 900 || sub < 0) {
                                        that.countDown=false;
                                        that.order.orderStatusInfo='订单已取消';
                                        that.order.promptInfo='';
                                        that.order.orderStatus=-10;
                                        that.getData();
                                        clearInterval(time)
                                    }

                                }, 1000)
                            }
                        }

                    }
                });
            },//获取页面数据

            goShop(){//跳转去店铺
                var that=this;
                var shopId=that.order.shopId;
                var orderType=that.order.orderType;
                var shopType=that.order.shopType;

                var url='http://assets/businessOrder.js';
                var param={shopId:shopId,orderType:orderType,shopType:shopType};
                event.toUrl({url:url,param:JSON.stringify(param)});
            },//跳转去店铺
            goPay(){
                var that = this
                const toast=that.$refs.toast
                var order=that.order
                var param=that.GLOBAL.sign(that.token,that.imei)
                param+= '&orderId=' + order.orderId +'&orderType=' + order.orderType ;
                var url = 'https://www.aftdc.com/userapp/Order/getPayType'

                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    url: url,
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                }, function (res) {
                    console.log(JSON.stringify(res))
                    if(res.data.res==1){
                        if(res.data.data.type==2){
                            event.wxpay(JSON.stringify(res.data.data.payParem))
                        }else if(res.data.data.needPay==0&&res.data.data.type==1){
                            const toast=that.$refs.toast
                            toast.editContent(res.data.info)
                            that.getData()
                        }
                    }
                    if (res.data.res == 0) {
                        modal.alert({
                            message:res.data.info,
                            okTitle:'好的',
                        },function (value) {
                            that.getData()
                        })
                        return false
                    }
                })
            },
            noPayCancel(){//未支付时,取消订单
                var that=this;
                modal.confirm({
                    message: '确认取消订单',
                    okTitle:'确认',
                    cancelTitle:'取消',
                    duration: 0.3,
                }, function (value) {
                    if(value=='确认'){
                        var tk='';
                        (that.order.orderType==6 || that.order.orderType==7)?tk=1:tk=0;
                        var param = that.GLOBAL.sign(that.token,that.imei);
                        param+='&orderId='+that.order.orderId +'&tk='+tk;

                        post.fetch({
                            method: 'post',
                            type: 'json',
                            body: param,
                            url: 'https://www.aftdc.com/userapp/Order/unpaidCancelOrder',
                            headers: {"Content-Type": "application/x-www-form-urlencoded"},
                        },function(res){
                            if(res.data.res==1){

                                setTimeout(function () {
                                    navigator.pop({animated:true});
                                },1000)

                                const toast =that.$refs.toast;
                                toast.editContent(res.data.info);
                            }
                            else{
                                const toast =that.$refs.toast;
                                toast.editContent(res.data.info);
                            }
                        });

                    }
                })

            },//未支付时,取消订单

            noReceiptCancel(){//未受理,取消订单
                var that=this;
                modal.confirm({
                    message: '确认取消订单',
                    okTitle:'确认',
                    cancelTitle:'取消',
                    duration: 0.3,
                }, function (value) {
                    if(value=='确认'){

                        var param = that.GLOBAL.sign(that.token,that.imei);
                        var orderId = that.order.orderId;
                        var shopId = that.order.shopId;
                        var refundRemark = '';
                        var refundType = '';
                        param+='&orderId='+orderId +'&shopId='+shopId +'&refundRemark='+refundRemark +'&refundType='+refundType;

                        post.fetch({
                            method: 'post',
                            type: 'json',
                            body: param,
                            url: 'https://www.aftdc.com/userapp/Order/orderCancel',
                            headers: {"Content-Type": "application/x-www-form-urlencoded"},
                        },function(res){
                            if(res.data.res==1){

                                setTimeout(function () {
                                    navigator.pop({animated:true});
                                },1000)

                                const toast =that.$refs.toast;
                                toast.editContent(res.data.info);
                            }
                            else{
                                const toast =that.$refs.toast;
                                toast.editContent(res.data.info);
                            }
                        });

                    }
                })
            },//未受理,取消订单

            isPayCancel(){//商家已受理,取消订单
                var that = this;
                var url = 'http://assets/refund.js';
                var orderId = that.order.orderId;
                var tk = (that.order.orderType==6 || that.order.orderType==7)?1:0;
                var param={orderId:orderId,tk:tk};
                event.toUrl({url:url,param:JSON.stringify(param)});
            },//商家已受理,取消订单

            reminder(){//催单
                var that=this;
                if(that.order.reminder===0||that.order.reminder===1){
                    var param = this.GLOBAL.sign(this.token,this.imei);
                    param+='&orderId='+that.order.orderId +'&shopId='+that.order.shopId +'&reminder=1'

                    post.fetch({
                        method: 'post',
                        type: 'json',
                        body: param,
                        url: 'https://www.aftdc.com/userapp/Order/reminders',
                        headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    },function(res){
                        if(res.data.res==1){
                            that.order.reminder=3;
                        }
                        const toast =that.$refs.toast;
                        toast.editContent(res.data.info);
                        that.getData()
                    });
                }else{
                    const toast =that.$refs.toast;
                    toast.editContent('已发送催单，请耐心等待商家回复');
                }
            },//催单


            tkProcess:GLOBAL.throttle(function () {//退款进度
                var that=this;
                var url='http://assets/refundProgress.js';
                var param={orderId:that.order.orderId,tk:(that.order.orderType==6 || that.order.orderType==7)?1:0};
                event.toUrl({url:url,param:JSON.stringify(param)});
            }),//退款进度

            confirmGet(){//确认收货、已用餐
                var that=this;
                var param = this.GLOBAL.sign(this.token,this.imei);
                param+='&orderId='+that.order.orderId;

                post.fetch({
                    method: 'post',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/userapp/Order/confirmOrder',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                },function(res){
                    if(res.data.res==1){
                        const toast =that.$refs.toast;
                        toast.editContent(res.data.info);
                        that.evaluate();
                    }
                });
            },//确认收货、已用餐

            goElse:GLOBAL.throttle(function () {//逛逛别家
                var that=this;
                var shopType=that.order.shopType;
                var orderType=that.order.orderType;
                var url='http://assets/subpage.js';
                var param={shopType:shopType,orderType:orderType};
                param=JSON.stringify(param)
                event.toUrl({url:url,param:param});
            }),//逛逛别家

            oneMore:GLOBAL.throttle(function () {//再来一单
                var that=this;
                var order=that.order
                var orderId=order.orderId;
                var shopId=order.shopId;
                var orderType=order.orderType;
                var shopType=order.shopType;
                var param = this.GLOBAL.sign(this.token,this.imei);
                param+='&orderId='+orderId+'&orderType='+orderType+'&shareId='+order.shareId;

                post.fetch({
                    method: 'post',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/userapp/Order/orderAgain',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                },function(res){

                    if(res.data.res==1){
                        var goodsInfo=res.data.data.goodsInfo
                        console.log(JSON.stringify(goodsInfo))
                        if(event.find(shopId+'orderFood'+shopType)){
                            event.delete(shopId+'orderFood'+shopType)
                        }
                        event.save(shopId+'orderFood'+shopType,JSON.stringify(goodsInfo));
                        console.log(JSON.stringify(goodsInfo))
                        var url='http://assets/businessOrder.js';
                        var param={shopId:shopId,orderType:orderType,shopType:shopType};
                        event.toUrl({url:url,param:JSON.stringify(param)});
                    }
                });

            }),//再来一单

            evaluate:GLOBAL.throttle(function () {//评价
                var order=this.order;
                var shopInfo=this.shopInfo
                var url='http://assets/orderEvaluate.js';
                var param=JSON.stringify({orderId:order.orderId,shopId:order.shopId,orderType:order.orderType,shopName:shopInfo.shopName,shopImg:shopInfo.shopImg,});
                console.log(param);
                event.toUrl({url:url,param:param});
            }),//评价

            onrefresh:GLOBAL.throttle(function (event) {//下拉刷新
                var that = this;
                that.refreshing = true
                setTimeout(() => {
                    that.refreshing = false
                }, 2000)

                that.getData();
            }),//下拉刷新



            minibarLeftButtonClick () {
                navigator.pop({animated:true});
            }, // 导航栏

            openBottomPopup () {
                this.isBottomShow = true;
            }, // 订单跟踪底部弹出层

            popupOverlayBottomClick () {
                this.isBottomShow = false;
            },//非状态组件，需要在这里关闭

            orderTrackingclose () {
                this.$refs.wxcPopup.hide()
            },

            copy() {
                clipboard.setString(this.order.orderNo)
                modal.toast({
                    message: '复制成功'
                })
            },// 订单号复制

            showFoodList(){
                this.shopFoodList = !this.shopFoodList
            },

            onlineContact(){
                var that=this;
                var url='http://assets/contact.js';
                var param={orderId:that.order.orderId,userName:that.order.userName,shopName:that.shopInfo.shopName};
                event.toUrl({url:url,param:JSON.stringify(param)});
            },//在线联系


            onrefresh () {
                var that = this;
                that.refreshing = true
                setTimeout(() => {
                    that.refreshing = false
                }, 2000)

                that.getData();
            },//下拉刷新

            callBusiness(){
                var that=this;
                event.phone(that.shopInfo.shopTel)
            },//联系客服

            viewappear(){
                var that=this
                if (!that.pageBack) { return; }
                that.pageBack = false;

                that.getData()
                if(event.find('paystate')){
                    event.delete('paystate')
                }

            },
            viewdisappear(){
                var that=this
                that.pageBack = true;
            },


        },

    }
</script>

<style scoped>
    .orderTrackingClose {
        width: 750px;
        background-color: #53beb7;
        align-items: center;
        padding-top: 32px;
        padding-bottom: 32px;
        position: absolute;
        bottom: 0;
    }
    .orderTrackingCloseText {
        font-size: 34px;
        color: #363636;

    }
    .orderTrackingTitle {
        padding-top: 30px;
        padding-bottom: 30px;
        align-items: center;
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #e3e3e3;
    }
    .orderTracking {
        height: 850px;
    }

    /*下拉刷新*/
    .refresh {
        width: 750px;
        display: -ms-flex;
        display: -webkit-flex;
        display: flex;
        -ms-flex-align: center;
        -webkit-align-items: center;
        -webkit-box-align: center;
        align-items: center;
        background-color: #fff;

    }
    .indicator {
        margin-top: 16px;
        height: 100px;
        width: 100px;
        color: #53beb7;
        margin-bottom: 20px;

    }


    .wrapper {
        align-items: center;
        background-color: #f0f0f0;
    }
    .minibar {
        /*border-bottom-width: 2px;*/
        /*border-bottom-style: solid;*/
        /*border-bottom-color: #f1f1f1;*/

    }
    .backImg{
        width: 40px;
        height: 40px;
    }
    .scrollerStyle {
        align-items: center;
        flex: 1;
    }
    /* 共同样式 */
    /* 字体样式 */

    /* 固定客服icon */
    .customerService {
        width: 60px;
        height: 64px;
        /*position: fixed;*/
        /*top: 20px;*/
        /*right: 28px*/
    }
    /* 头部banner图 */
    .banner {
        width: 750px;
        height: 250px;
    }
    /* 订单状态 */
    .orderStatusContent {
        width: 708px;
        background-color: #fff;
        align-items: center;
        padding-bottom: 30px;
    }
    .twoLine {
        width: 56px;
        height: 8px;
        border-top-width: 2px;
        border-top-style: solid;
        border-top-color: #dedede;
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #dedede;
    }
    .orderStatus {
        flex-direction: row;
        align-items: center;
        justify-content: center;
        padding-top: 30px;
    }
    .orderStatusText {
        font-weight: 600;
    }
    .arrow {
        width: 15px;
        height: 24px;
        margin-left: 12px;
    }
    .orderStatusWord {
        margin-top: 30px;
    }
    .time{
        margin-top: 20px;
        justify-content: center;
        align-items: center;
    }
    .timeIcon{
        width: 30px;
        height: 30px;
        margin-right: 15px;
    }
    .orderProtect {
        flex-direction: row;
        border-width: 2px;
        border-style: solid;
        border-color: #53beb7;
        margin-top: 12px;
    }
    .orderProtectIcon {
        padding-top: 2px;
        padding-bottom: 3px;
        padding-left: 7px;
        padding-right: 7px;
        background-color: #53beb7;
    }
    .orderProtectIconSize {
        width: 16px;
        height: 22px;
    }
    .orderProtectText {
        margin-top: 2px;
        margin-left: 10px;
        margin-right: 10px;
    }
    .orderStatusBtn {
        flex-direction: row;
        margin-top: 30px;
    }
    .btnDiv{
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
    .btn {
        width: 198px;
        height: 72px;
        line-height: 72px;
        text-align: center;
        background-color: #fff;
        border-width: 1px;
        border-style: solid;
        border-color: #999;
        border-radius: 5px;
        margin-left: 10px;
        margin-right: 10px;
        opacity: 1;
    }
    .btn:active{
        background-color: #f1f1f1;
    }

    .isRemind{
        background-color: #f1f1f1;
        opacity: 0.7;
    }
    .isRemind:enabled{
        background-color: #f1f1f1;
    }
    .ml20 {
        margin-left: 20px;
    }
    .discount {
        width: 708px;
        height: 180px;
        margin-top: 10px;
    }
    /* 订单信息 */
    .orderInfo {
        width: 708px;
        background-color: #fff;
        margin-top: 20px;
    }
    /* 订单信息头部 */
    .shopTitle {
        flex-direction: row;
        padding-left: 32px;
        padding-right: 32px;
        padding-top: 25px;
        padding-bottom: 25px;
        align-items: center;
        justify-content: space-between;
    }
    .shopTitleInfo {

        flex-direction: row;
        align-items: center;
    }
    .shopLogo {
        width: 50px;
        height: 50px;
        border-radius: 25px;
    }
    .shopName {
        margin-left: 12px;
        width: 330px;
        lines: 1;
        text-overflow: ellipsis;
    }
    .refund {
        border-width: 1px;
        border-style: solid;
        border-color: #36bbae;
        padding-top:5px;
        padding-bottom: 5px;
        padding-left: 10px;
        padding-right: 10px;
        margin-left: 10px;
    }
    .shopTitleArrow {
        width: 22px;
        height: 23px;
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
    .price {
        margin-top: 28px;
    }
    /* Food列表展开与收起 */
    .foodListBtn {
        width: 750px;
        align-items: center;
        justify-content: center;
        padding-top: 40px;
        padding-bottom: 20px;
    }
    .foodListBtnStyle {
        border-width: 2px;
        border-style: solid;
        border-color: #cdcdcd;
        padding-top: 10px;
        padding-bottom: 10px;
        padding-left: 18px;
        padding-right: 18px;
        flex-direction: row;
        align-items: center;
    }
    .foodListBtnImg {
        width: 20px;
        height: 20px;
        margin-left: 10px;
        opacity: 0.6;
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
    /* 合计 */
    .totalPricePackage {
        position: relative;
    }
    .totalPrice {
        width: 656px;
        height: 110px;
        flex-direction: row-reverse;
        padding-top: 36px;
        padding-bottom: 36px;
        align-items: center;
        border-top-width: 4px;
        border-top-style: dotted;
        border-top-color: #e2e2e2;
        border-bottom-width: 4px;
        border-bottom-style: dotted;
        border-bottom-color: #e2e2e2;
        margin-top: 11px;
        margin-bottom: 11px;
        margin-left: 26px;
    }
    .concessionText {
        color: #999999;
        margin-right: 40px;
    }
    .totalPriceStyle {
        /*color: #fb4e44;*/
        font-weight: bold;

    }
    /* 合计四角圆圈 */
    .circular {
        width: 26px;
        height: 26px;
        border-radius: 13px;
        background-color: #f0f0f0;
        position: absolute;
        left: 0;
        top: 0;
    }
    .leftTop {
        top: 0;
        left: -13px;
    }
    .leftBottom {
        left: -13px;
        top: 105px;
    }
    .rightTop {
        top: 0;
        left: 695px;
    }
    .rightBottom {
        left: 695px;
        top: 105px;
    }
    /* 联系商家 */
    .contactInfo {
        flex-direction: row;
        align-items: center;
    }
    .contactBtn{
        width: 353px;
        padding-top: 34px;
        padding-bottom: 34px;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }
    .contactIcon {
        width: 35px;
        height: 35px;
        margin-right: 20px;
    }
    .lineIcon{
        width: 40px;
        height: 40px;
        margin-right: 20px;
    }
    .contactLine {
        width: 2px;
        height: 58px;
        background-color: #e9e9e9;
    }
    .onlineContactText {
        color: #696969;
    }
    /* 配送信息 */
    .distributionInfo {
        width: 708px;
        margin-top: 20px;
        background-color: #fff;
        padding-top: 15px;
        padding-left: 22px;
    }
    .distributionContent {
        flex-direction: row;
        padding-top: 20px;
        padding-bottom: 20px;
    }
    .grayFont {
        color: #999;
    }
    .rightText {
        padding-left: 30px;
        max-width: 530px;
    }
    .billDiv{
        flex-direction: row;
        align-items: center;
    }
    .billType{
        height: 28px;
        line-height: 28px;
        padding-left: 10px;
        padding-right: 10px;
        font-size: 24px;
        color: #999;
        border-style: solid;
        border-width: 1px;
        border-color: #999;
        border-radius: 3px;
        margin-left: 20px;
    }
    .address {
        width: 500px;
        margin-top: 10px;
    }
    .mm40 {
        margin-bottom: 40px;
    }
    /* 优惠券与红包 */
    .CouponInfo {
        width: 656px;
        padding-top: 30px;
        border-top-width: 4px;
        border-top-style: dotted;
        border-top-color: #e2e2e2;
        margin-top: 11px;
        margin-left: 26px;
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
    .couponPrice {
        color: #dc3f64;
    }
    .darkGreen {
        background-color: #53beb7;
    }
    .blue {
        background-color: #1bacff;
    }
    /* 订单其他信息 */
    .copy {
        width: 100px;
        height: 45px;
        border-width: 2px;
        border-style: solid;
        border-color: #c9c9c9;
        align-items: center;
        justify-content: center;
        margin-top: 10px;
        margin-right: 20px;
        border-radius: 5px;
    }
    .orderNumber {
        flex-direction: row;
        justify-content: space-between;
    }
    /* 调查 */
    .investigation {
        flex-direction: row;
        align-items: center;
        padding-top: 46px;
        padding-bottom: 56px;
    }

    /* 隐藏元素 */
    /* 订单跟踪 */
    .orderTracking {
        height: 850px;
    }
    .orderTrackingClose {
        width: 750px;
        background-color: #53beb7;
        align-items: center;
        padding-top: 32px;
        padding-bottom: 32px;
        position: absolute;
        bottom: 0;
    }
    .orderTrackingCloseText {
        font-size: 34px;
        color: #363636;

    }
    .orderTrackingTitle {
        padding-top: 30px;
        padding-bottom: 30px;
        align-items: center;
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #e3e3e3;
    }
    .fontWhite {
        color: #fff;
    }


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
    .row{
        flex-direction: row;
        align-items: center;
    }
    .aiCenter{
        flex-direction: row;
        align-items: center;
        margin-top: 15px;
        margin-bottom: 15px;
    }
    .Share_circle{
        width: 12px;
        height: 12px;
        border-radius: 12px;
        background-color: #53beb7;
        margin-left: 10px;
        margin-right: 10px;
        margin-top: 3px;
    }
</style>
