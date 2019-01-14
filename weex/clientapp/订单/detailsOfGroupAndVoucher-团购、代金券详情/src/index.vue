<template>
    <div class="evaluate">
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
                <text :style="GLOBAL.headerCenter"  slot="middle">详情</text>
            </wxc-minibar>
        </div>
        <scroller class="scroller" show-scrollbar="false">

            <div class="order row" @click="goShop">
                <div class="row">
                    <image class="orderImg" :src="'https://image.aftdc.com/'+groupInfo.groupImg"></image>
                    <div class="orderDiv">
                        <text class="orderName" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{groupInfo.groupName}}</text>
                        <text :style="{fontSize:GLOBAL.defaultFS,color:'#999'}" v-if="!groupInfo.subscribe">免预约</text>
                        <text :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">随时退 | 过期自动退</text>
                    </div>
                </div>
                <div class="row">
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">￥ {{groupInfo.shopPrice}}</text>
                    <image class="moreIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                </div>
            </div>

            <!--二维码-->
            <div class="order">
                <div class="typeStatuBig row">
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{orderInfo.groupType==1?'团购':'代金券'}}</text>
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor}">{{orderInfo.orderStatusInfo}}</text>
                </div>
                <div class="qrCode">
                    <web :style="{width:'350px',height:'350px'}" ref="qrcode" @pagefinish="onPageFinish" src="https://www.aftdc.com/mobile/public/qrcode.html"></web>
                    <text class="qrText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">券码 : {{orderInfo.code}}</text>
                </div>
            </div>

            <!--优惠信息-->
            <div class="order" v-if="myYouhui.length>0">
                <div class="typeStatu row">
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">优惠信息</text>
                </div>
                <div class="totalPricePackage">
                    <div class="CouponInfo">
                        <div class="Coupon" v-for="(item,index) in myYouhui" :key="index">
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
            </div>

            <!--商家信息-->
            <div class="order">
                <div class="typeStatu row">
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">商家信息</text>
                </div>
                <div class="shopInfo row" @click="callShop">
                    <div>
                        <text class="shopName" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{shopInfo.shopName}}</text>
                        <div class="row" :style="{marginTop:'10px'}">
                            <image class="addressIcon" src="https://image.aftdc.com/appBimg/ic_address.png"></image>
                            <text class="shopAdress" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">{{shopInfo.distance }}{{shopInfo.shopAddress}}</text>
                        </div>
                    </div>
                    <image class="phoneIcon" src="https://image.aftdc.com/appBimg/ic_phone_blue.png"></image>
                </div>
            </div>

            <!--套餐详情-->
            <div class="order" v-if="goodsInfo.length>0 || groupInfo.groupDes">
                <div class="typeStatu row">
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">套餐详情</text>
                </div>

                <div v-if="goodsInfo.length>0">
                    <text class="shopTitle" :style="{fontSize:GLOBAL.bigFS,color:'#999'}">商品</text>
                    <div class="row foodDiv" v-for="item in goodsInfo">
                        <div class="row">
                            <text class="foodName" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.goodsName}}</text>
                            <text :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">({{item.goodsNum}}份)</text>
                        </div>
                        <text class="foodPrice" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">￥{{item.goodsPrice}}</text>
                    </div>
                </div>

                <div v-if="groupInfo.groupDes">
                    <text class="shopTitle" :style="{fontSize:GLOBAL.bigFS,color:'#999'}">备注</text>
                    <text class="remarks" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{groupInfo.groupDes}}</text>
                </div>

            </div>

            <!--温馨提示-->
            <div class="order">
                <div class="typeStatu row">
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">温馨提示</text>
                </div>

                <div>
                    <text class="shopTitle" :style="{fontSize:GLOBAL.bigFS,color:'#999'}">有效期</text>
                    <text class="ruleText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{groupInfo.startTime}}&nbsp;至&nbsp;{{groupInfo.endTime}}</text>
                </div>
                <div v-if="groupInfo.useData">
                    <text class="shopTitle" :style="{fontSize:GLOBAL.bigFS,color:'#999'}">不可用日期</text>
                    <text class="ruleText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{groupInfo.useData}}</text>
                </div>
                <div>
                    <text class="shopTitle" :style="{fontSize:GLOBAL.bigFS,color:'#999'}">使用时间</text>
                    <div class="row">
                        <text class="ruledata" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}" v-for="(item,index) in groupInfo.dataList" :key="index">{{item.start}}-{{item.end}}; </text>
                    </div>
                </div>
                <div>
                    <text class="shopTitle" :style="{fontSize:GLOBAL.bigFS,color:'#999'}">使用规则</text>
                    <text class="ruleText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">(1) {{groupInfo.subscribe?'预约需提前: '+groupInfo.subscribeTime:'无需预约,消费高峰时可能需要等位'}}</text>
                    <div v-for="(item,index) in groupInfo.ruleList" :style="{flexDirection:'row'}" v-if="groupInfo.ruleList.length>0">
                        <text class="number" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">({{index+2}}) </text>
                        <text class="ruleText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.text}}</text>
                    </div>
                </div>
            </div>

            <!--订单信息-->
            <div class="order" :style="{marginBottom:'20px'}">

                <div class="typeStatu row">
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">订单信息</text>
                </div>
                <div class="shopTitle row">
                    <text class="orderNo" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">订&nbsp;单&nbsp;号</text>
                    <text class="maohao" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">:</text>
                    <text class="orderNumber" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{youhui.orderNo}}</text>
                </div>
                <div class="shopTitle row">
                    <text class="orderNo" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">手&nbsp;机&nbsp;号</text>
                    <text class="maohao" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">:</text>
                    <text class="orderNumber" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{orderInfo.userPhone}}</text>
                </div>
                <div class="shopTitle row" v-if="orderInfo.payTime">
                    <text class="orderNo" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">付款时间</text>
                    <text class="maohao" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">:</text>
                    <text class="orderNumber" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{orderInfo.payTime}}</text>
                </div>
                <div class="shopTitle row">
                    <text class="orderNo" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">下单时间</text>
                    <text class="maohao" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">:</text>
                    <text class="orderNumber" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{youhui.createTime}}</text>
                </div>
                <div class="shopTitle row">
                    <text class="orderNo" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">总&nbsp;&nbsp;价</text>
                    <text class="maohao" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">:</text>
                    <text class="orderNumber" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">￥{{orderInfo.totalMoney}}</text>
                </div>
                <div class="shopTitle row" v-if="youhui.realTotalMoney">
                    <text class="orderNo" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">实&nbsp;付</text>
                    <text class="maohao" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">:</text>
                    <text class="orderNumber" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">￥{{youhui.realTotalMoney}}</text>
                </div>

            </div>

        </scroller>
        <div class="evaluateDiv" >
            <text class="evaluateText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}" @click="oneMore">再来一单</text>
            <text class="evaluateText" v-if="youhui.orderStatus==4 && youhui.isAppraises==0" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}" @click="evaluate">评价</text>
            <text class="evaluateText" v-if="youhui.orderStatus==0"  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}" @click="cancelOrder">取消订单</text>

        </div>


        <toast ref="toast"></toast>
    </div>
</template>

<script>
    import Toast from './Toast.vue';
    import { WxcMask,WxcMinibar,WxcButton,WxcPopup} from 'weex-ui';
    const GLOBAL = require('@/Global.vue');
    const modal = weex.requireModule('modal');
    const event = weex.requireModule('event');
    const dom = weex.requireModule('dom');
    const post = weex.requireModule('stream');
    const navigator = weex.requireModule('navigator');
    const webview = weex.requireModule('webview');

    export default {
        components: { WxcMask,WxcMinibar,WxcButton,WxcPopup,webview,Toast},
        name: 'App',
        data () {
            return {
                orderId:'',
                orderInfo:{},
                groupInfo:{},
                goodsInfo:[],
                youhui:{},
                myYouhui:[],
                shopInfo:{},
                //通用
                token:'',
                imei:'',
                longitude:'',
                latitude:'',
            }
        },
        methods:{
            getTkOrderDetails(){
                var that=this
                var param = this.GLOBAL.sign(this.token,this.imei);
                param+= '&orderId='+that.orderId +'&latitude='+that.latitude +'&longitude='+that.longitude;
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/userapp/Order/getTkOrderDetails',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                },function(res){

                    if(res.data.res==1){

                        if(res.data.data.orderInfo) var orderInfo=res.data.data.orderInfo;
                        if(res.data.data.groupInfo) that.groupInfo=res.data.data.groupInfo;
                        if(res.data.data.goodsInfo) that.goodsInfo=res.data.data.goodsInfo;
                        if(res.data.data.youhui) that.youhui=res.data.data.youhui;that.myYouhui=res.data.data.youhui.youhui
                        if(res.data.data.shopInfo) that.shopInfo=res.data.data.shopInfo;
                        switch (orderInfo.orderType) {
                            case 6:
                                orderInfo.shopType = 6
                                break;
                            case 7:
                                orderInfo.shopType = 8
                                break;
                        }
                        that.orderInfo=orderInfo
                    }
                    else{
                        const toast =that.$refs.toast;
                        toast.editContent(res.data.info);
                    }
                });
            },
            onPageFinish(){
                var that=this;
                webview.postMessage(that.$refs.qrcode, {message: that.orderInfo.code})
            },

            callShop(){//电话商家
                var that=this;
                event.phone(that.shopInfo.shopTel)
            },//电话商家

            goShop:GLOBAL.throttle(function () {//跳转去店铺
                var that=this;
                var url='http://assets/businessOrder.js';
                var param={shopId:that.orderInfo.shopId,orderType:that.orderInfo.orderType,shopType:that.orderInfo.shopType};
                event.toUrl({url:url,param:JSON.stringify(param)});
            }),//跳转去店铺

            minibarLeftButtonClick(){
                navigator.pop({animated:'false'});
            },

            evaluate:GLOBAL.throttle(function () {//评价
                var that=this;
                var orderId=that.orderInfo.orderId;
                var shopId=that.orderInfo.shopId;
                var orderType=that.orderInfo.orderType;//评价页面中orderType用来判断是外卖(0)还是其他(3、5、6、7)
                var shopName=that.shopInfo.shopName;
                var shopImg=that.shopInfo.shopImg;
                var url='http://assets/orderEvaluate.js';
                var param=JSON.stringify({orderId:orderId,shopId:shopId,orderType:orderType,shopName:shopName,shopImg:shopImg,});
                event.toUrl({url:url,param:param});
            }),//评价

            oneMore:GLOBAL.throttle(function () {//再来一单
                var that=this;
                var orderInfo=that.orderInfo
                var orderId=orderInfo.orderId;
                var shopId=orderInfo.shopId;
                var orderType=orderInfo.orderType;
                var shopType=orderInfo.shopType
                var param = this.GLOBAL.sign(this.token,this.imei);
                param+='&orderId='+orderId+'&orderType='+orderType+'&shareId='+'';

                post.fetch({
                    method: 'post',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/userapp/Order/orderAgain',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                },function(res){
                    if(res.data.res==1){
                        var goodsInfo=res.data.data.goodsInfo

                        if(event.find(shopId+'orderFood'+shopType)){
                            event.delete(shopId+'orderFood'+shopType)
                        }
                        event.save(shopId+'orderFood'+shopType,JSON.stringify(goodsInfo));
                        var url='http://assets/businessOrder.js';
                        var param={shopId:shopId,orderType:orderType,shopType:shopType};
                        event.toUrl({url:url,param:JSON.stringify(param)});
                    }
                });
            }),//再来一单
            cancelOrder:GLOBAL.throttle(function () {
                var that=this;
                modal.confirm({
                    message: '确定取消订单吗?',
                    okTitle:'确定',
                    cancelTitle:'取消',
                    duration: 0.3
                },function (result) {
                    if(result=='确定') {
                        var orderInfo=that.orderInfo
                        var orderId=orderInfo.orderId;
                        var shopId=orderInfo.shopId;
                        var param = that.GLOBAL.sign(that.token,that.imei);
                        param+='&orderId='+orderId+'&tk='+1;

                        post.fetch({
                            method: 'post',
                            type: 'json',
                            body: param,
                            url: 'https://www.aftdc.com/userapp/Order/unpaidCancelOrder',
                            headers: {"Content-Type": "application/x-www-form-urlencoded"},
                        },function(res){
                            if(res.data.res==1){
                                that.getTkOrderDetails()
                                const toast =that.$refs.toast;
                                toast.editContent(res.data.info);
                            }
                        });
                    }
                })
            }),


        },
        mounted(){

        },
        created(){
            var that=this;
            var param=JSON.parse(weex.config.param)
            that.orderId=param.orderId
            that.token = weex.config.token;
            that.imei = weex.config.imei;
            that.latitude = weex.config.latitude;
            that.longitude = weex.config.longitude;
            that.getTkOrderDetails()

        },
    }
</script>

<style scoped>
    .evaluateText{
        width: 150px;
        border-style: solid;
        border-width: 2px;
        border-color: #efefef;
        border-radius: 10px;
        background-color: #fff;
        margin-top: 15px;
        margin-bottom: 15px;
        margin-left: 20px;
        margin-right: 20px;
        line-height: 70px;
        text-align: center;
    }
    .evaluateText:active{
        background-color: #dedede;
    }
    .evaluateDiv{
        width: 750px;
        height: 100px;
        flex-direction: row;
        justify-content: flex-end;
    }
    .remarks{
        max-width: 670px;
        margin-top: 10px;
    }
    .foodName{
        margin-right: 20px;
        max-width: 450px;
        text-overflow: ellipsis;
        lines:1;
    }
    .foodDiv{
        justify-content: space-between;
        margin-top: 10px;
    }
    .shopTitle{
        margin-top: 20px;
    }
    .orderNo{
        margin-right: 20px;
        flex: 1;
        text-align: right;
    }
    .maohao{
        flex: 0.2;
    }
    .orderNumber{
        flex: 4.5;
    }
    .ruleText{
        padding-top: 10px;
        flex: 1;
    }
    .ruledata{
        padding-top: 10px;
    }
    .number{
        padding-top: 10px;
    }
    .phoneIcon{
        width: 44px;
        height: 44px;
    }
    .shopName{
        max-width: 550px;
        text-overflow: ellipsis;
        lines:1;
    }
    .shopAdress{
        max-width: 520px;
        text-overflow: ellipsis;
        lines:1;
    }
    .addressIcon{
        width: 20px;
        height: 25px;
        margin-right: 10px;
    }
    .shopInfo{
        padding-top: 20px;
        justify-content: space-between;
    }
    .qrText{
        margin-top: 20px;
    }
    .qrImg{
        width: 350px;
        height: 350px;
    }
    .qrCode{
        align-items: center;
        padding-top: 20px;
    }
    .typeStatu{
        justify-content: space-between;
        border-bottom-style: dashed;
        border-bottom-width: 2px;
        border-bottom-color: #dedede;
        padding-bottom: 20px;
    }
    .typeStatuBig{
        justify-content: space-between;
        border-bottom-style: dashed;
        border-bottom-width: 2px;
        border-bottom-color: #dedede;
        padding-bottom: 20px;
        padding-left: 40px;
        padding-right: 40px;
    }

    .totalPricePackage {
        position: relative;
    }
    .CouponInfo {
        padding-top: 30px;
        margin-top: 11px;
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
    .moreIcon{
        width: 20px;
        height: 20px;
        margin-left: 15px;
    }
    .orderName{
        max-width: 300px;
        font-weight: 600;
    }
    .orderDiv{
        margin-left: 20px;
        justify-content: space-between;
        height: 110px;
        width: 300px;
    }
    .orderImg{
        width: 110px;
        height: 110px;
        border-radius: 5px;
    }
    .order{
        padding-left: 20px;
        padding-right: 20px;
        padding-top: 20px;
        padding-bottom: 20px;
        background-color: #fff;
        margin-top: 20px;
        justify-content: space-between;
        border-right: 10px;
    }
    .scroller{
        width: 750px;
        flex: 1;
        padding-left: 20px;
        padding-right: 20px;
    }
    .minibar {
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: #f1f1f1;
    }
    .evaluate{
        background-color: #f1f1f1;
    }
    .row{
        flex-direction: row;
        align-items: center;
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
</style>
