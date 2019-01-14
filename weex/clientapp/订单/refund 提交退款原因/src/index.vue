<template>
    <div class="refundProgress">

        <!--头部-->
        <div>
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    v-once
            >
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">申请退款</text>
            </wxc-minibar>
        </div>

        <!--解决input获取焦点的兼容-->
        <scroller show-scrollbar="false" class="scrollerFiexd" :style="{height:scroHeight}">
            <div class=" enterButton row">
                <text class="btnLeft" :style="{fontSize:GLOBAL.bigFS}">退款金额￥{{orderInfo.realTotalMoney}}</text>
                <text class="btnRight" :style="{fontSize:GLOBAL.bigFS}" @click="submission">提交</text>
            </div>
        </scroller>

        <scroller class="scroller" show-scrollbar="false" :style="{flex:scroHeight?null:1,height:scroHeight?scroHeight-115:null,bottom:scroHeight?null:'100px'}">

            <!--退款原因-->
            <text class="shopBar" :style="{fontSize:GLOBAL.defaultFS}">退款原因</text>
            <div class="reason row" @click="bottomBtnClick">
                <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{refundRemark?refundRemark:'请选择退款原因'}}</text>
                <image class="resaonIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
            </div>
            <div class="reasonPicture">
                <textarea placeholder="请描述退款原因,最多200字" maxlength="200" rows="3" v-model="reason" @focus="allFocus" @blur="isBlur" ref="input1" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}"></textarea>
                <text class="fontNum" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}">{{reason.length}}/200</text>
            </div>


            <text class="shopBar" :style="{fontSize:GLOBAL.defaultFS}">退款商品</text>
            <div class="shopList">
                <!--店铺信息-->
                <div class="shopTitle">
                    <div class="shopTitleInfo">
                        <image class="shopLogo" :src="'https://image.aftdc.com/'+shopInfo.shopImg"></image>
                        <text class="shopName" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{shopInfo.shopName}}</text>
                    </div>
                    <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{orderInfo.orderType===0?'外卖':orderInfo.orderType===3?'堂食预定':orderInfo.orderType===5?'到店自取':orderInfo.orderType===2?'扫码点餐':''}}</text>
                </div>
                <!-- 商品列表 -->
                <div class="foodList">
                    <div class="foodItem" v-for="(item,index) in goodsInfo" :key="index" v-if="shopFoodList || index<3">
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
                        <div>
                            <text class="goodsPrice" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">￥{{ item.goodsPrice * item.goodsNums }}</text>
                            <text class="marketPrice" :style="{fontSize:GLOBAL.smallFS,color:'#999'}" v-if="item.marketPrice!=item.goodsPrice">￥{{ item.marketPrice * item.goodsNums }}</text>
                        </div>
                    </div>
                </div>
            </div>


            <!--点击展开收起按钮-->
            <div class="foodListBtn" v-if="listLength>= 4">
                <div class="foodListBtnStyle" v-if="shopFoodList" @click="showFoodList">
                    <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">点击收起</text>
                    <image class="foodListBtnImg" src="https://image.aftdc.com/appBimg/ic_expanded_up.jpg"></image>
                </div>
                <div class="foodListBtnStyle" v-else  @click="showFoodList">
                    <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">点击展开</text>
                    <image class="foodListBtnImg" src="https://image.aftdc.com/appBimg/ic_expanded_down.jpg"></image>
                </div>
            </div>

            <div>
                <!--餐盒费-->
                <div class="row integral" :style="{paddingTop:'15px'}">
                    <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">餐盒费</text>
                    <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">￥{{orderInfo.boxFee}}</text>
                </div>

                <!--配送费-->
                <div class="row integral" :style="{paddingTop:'15px'}">
                    <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">配送费</text>
                    <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">￥{{orderInfo.deliverMoney}}</text>
                </div>

                <!--退回积分-->
                <div class="row integral" :style="{paddingTop:'15px'}">
                    <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">退回积分</text>
                    <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{orderInfo.useScore}}</text>
                </div>
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

            <!--退款金额-->
            <div class="tkMoney row">
                <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">退款金额 </text>
                <text :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.tColor}">￥{{orderInfo.realTotalMoney}}</text>
            </div>


        </scroller>

        <!--提交按钮-->
        <div class=" HideEnterButton row" v-if="!scroHeight">
            <text class="btnLeft" :style="{fontSize:GLOBAL.bigFS}">退款金额￥{{orderInfo.realTotalMoney}}</text>
            <text class="btnRight" :style="{fontSize:GLOBAL.bigFS}" @click="submission">提交</text>
        </div>


        <!--底部按钮弹层-->
        <wxc-popup popup-color="rgb(241, 241, 241)"
                   :show="isBottomShow"
                   ref="btn"
                   @wxcPopupOverlayClicked="popupOverlayBottomClick"
                   pos="bottom"
                   height="720">
            <div class="bottomDemo">
                <text class="DemoText" v-for="(item,index) in reasonList" :key="index" :style="{fontSize:GLOBAL.defaultFS}" @click="selectReason(index)">{{item}}</text>
                <text class="DemoCancel" :style="{fontSize:GLOBAL.defaultFS}" @click="demoCancelClick">取消</text>
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
    const GLOBAL = require('@/Global.vue');
    export default {
        components: { WxcMask,WxcMinibar,WxcButton,WxcPopup,Toast },
        name: 'App',
        data () {
            return {
                scroHeight:0,
                refundRemark:'',//选择的退款原因
                reason:'',//描述原因
                isBottomShow:false,
                reasonList:['计划有变','买错了,买多了,买少了','地址、电话填写有误','送达时间选错了','预计送达时间久,不想要了','无法开发票','商家通知我卖完了'],
                listLength:0,//获取商品列表长度
                shopFoodList:true,
                shopInfo:{},
                goodsInfo:[],
                orderInfo:{},
                youhui:[],
                token:'',
                imei:'',
                orderId:'',
                isFocus:false,
            }
        },
        created(){
            var that=this;
            event.init();
            var paramI=weex.config.param;
            paramI=JSON.parse(paramI);
            that.token = weex.config.token;
            that.imei = weex.config.imei;
            that.orderId=paramI.orderId;
            var param = this.GLOBAL.sign(this.token,this.imei);
            param+= '&orderId='+that.orderId;
            post.fetch({
                method: 'POST',
                type: 'json',
                body: param,
                url: 'https://www.aftdc.com/userapp/Order/refundOrder',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
            },function(res){
                console.log(res)
                if(res.data.res==1){
                    console.log(res)
                    that.orderInfo=res.data.data.orderInfo;
                    that.youhui=res.data.data.orderInfo.youhui;
                    that.goodsInfo=res.data.data.goodsInfo;
                    that.shopInfo=res.data.data.shopInfo;
                }
                else{
                    const toast =that.$refs.toast;
                    toast.editContent(res.data.info);
                }
            });


        },
        methods:{

            submission:GLOBAL.throttle(function () {//提交
                var that=this;
                if(!that.refundRemark){
                    const toast =that.$refs.toast;
                    toast.editContent('请选择退款原因');
                    return false;
                }

                var param = that.GLOBAL.sign(that.token,that.imei);
                var orderId = that.orderId;
                var shopId = that.orderInfo.shopId;
                var refundRemark = that.refundRemark+'。 '+that.reason;

                param+= '&orderId='+orderId + '&shopId='+shopId + '&refundRemark='+refundRemark;
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/userapp/Order/orderCancel',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                },function(res){
                    console.log(res)
                    if(res.data.res==1){

                        setTimeout(function () {
                            navigator.pop({animated: 'true'})
                        },1000)

                        const toast =that.$refs.toast;
                        toast.editContent(res.data.info);
                    }
                    else{
                        const toast =that.$refs.toast;
                        toast.editContent(res.data.info);
                    }
                })
            }),//提交

            showFoodList(){
                this.shopFoodList = !this.shopFoodList
            },

            allFocus(){
                var that=this;
                if(!that.scroHeight){
                    setTimeout(() => {
                        dom.getComponentRect('viewport', option => {
                            if (option.result && option.size) {
                                that.scroHeight = option.size.height-74;
                            }
                        })
                        console.log(that.scroHeight)
                    }, 30)
                }
                that.isFocus=true;
            },

            isBlur(){
                var that=this;
                that.isFocus=false;
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
                var that=this;
                if(that.isFocus){
                    setTimeout(function () {
                        that.isBottomShow=true;
                    },150)
                    that.$refs.input1.blur();
                }
                else{
                    this.isBottomShow=true;
                }
            },
            selectReason(index){
                var that=this;
                that.refundRemark=that.reasonList[index];
                that.demoCancelClick();

            },
        },
    }
</script>

<style scoped>

    /*底部按钮弹层start*/
    .DemoCancel{
        text-align: center;
        height: 90px;
        line-height: 90px;
        background-color: #fff;
        color: #999;
    }
    .DemoText{
        text-align:left;
        padding-left: 20px;
        height: 90px;
        line-height: 90px;
        color: #666;
        border-bottom-style: solid;
        border-bottom-width: 2px;
        border-bottom-color: #f8f8f8;

    }
    .bottomDemo{
        padding-left: 20px;
        padding-right: 20px;
        background-color: #fff;
    }
    /*底部按钮弹层end*/


    /*提交按钮start*/
    .btnLeft{
        flex: 2;
        line-height: 100px;
        padding-left: 30px;
        background-color: #666;
        color: #fff;
    }
    .btnRight{
        flex: 1;
        line-height: 100px;
        text-align: center;
        background-color: #53beb7;
        color: #fff;
    }
    .HideEnterButton{
        width: 750px;
        position: absolute;
        bottom: 0;
        left: 0;
    }
    /*提交按钮end*/


    /*退款金额start*/
    .tkMoney{
        justify-content: flex-end;
        padding-left: 30px;
        padding-right: 30px;
        padding-top: 30px;
        padding-bottom: 30px;
        margin-bottom: 20px;
        background-color: #fff;
        border-top-style: solid;
        border-top-width: 1px;
        border-top-color: #dedede;
    }
    /*退款金额end*/


    /*活动优惠start*/
    .totalPricePackage {
        position: relative;
        background-color: #fff;
    }
    .CouponInfo {
        width: 690px;
        padding-top: 30px;
        margin-left: 30px;
        border-top-width: 1px;
        border-top-style: dashed;
        border-top-color: #e2e2e2;
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
    /*活动优惠end*/


    /*餐盒费start*/
    .integral{
        padding-left: 30px;
        padding-right: 30px;
        padding-bottom: 25px;
        justify-content: space-between;
        background-color: #fff;
    }
    /*餐盒费end*/


    /*点击展开收起按钮start*/
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
    /*点击展开收起按钮end*/


    /*商品列表start*/
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
    .marketPrice{
        margin-top: 14px;
        text-decoration: line-through;
        width: 100px;
        text-align: right;
    }
    .goodsPrice{
        width: 100px;
        text-align: right;
    }
    /*商品列表end*/


    /*店铺信息start*/
    .shopList{
        background-color: #fff;
    }
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
    /*店铺信息end*/


    /*退款原因start*/
    .fontNum{
        text-align: right;
        padding-right: 10px;
        padding-top: 5px;
    }
    .reasonPicture{
        padding-left: 20px;
        padding-right: 20px;
        padding-top: 15px;
        padding-bottom: 15px;
        background-color: #fff;
    }
    .resaonIcon{
        width: 20px;
        height: 20px;
        transform: rotate(90deg);
    }
    .reason{
        padding-top: 25px;
        padding-bottom: 25px;
        padding-right: 20px;
        padding-left: 20px;
        padding-right: 20px;
        border-bottom-style: solid;
        border-bottom-width: 1px;
        border-bottom-color: #dedede;
        justify-content: space-between;
        background-color: #fff;
    }
    .shopBar{
        width: 750px;
        padding-top: 15px;
        padding-bottom: 15px;
        padding-left: 20px;
        color: #999;
    }
    /*退款原因end*/


    .row{
        flex-direction: row;
        align-items: center;
    }
    .scroller{
        width: 750px;
        position: absolute;
        top: 90px;
        left: 0;
        background-color: #f8f8f8;
    }
    .refundProgress{
        background-color: #fff;
    }
    .enterButton {
        width: 750px;
        height: 130px;
        position: absolute;
        bottom: 0;
        left: 0;
    }
    .scrollerFiexd{
        width: 750px;
        position: relative;
    }
</style>
