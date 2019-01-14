<template>
  <div class="wrapper" @viewappear="viewappear">

    <div class="minibar">
      <wxc-minibar
              background-color="#53beb7"
              text-color="#fff"
              @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
              v-once
      >
        <image :style="GLOBAL.headerImg"  slot="left"
               src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
        <text :style="GLOBAL.headerCenter"  slot="middle">我的订单</text>
      </wxc-minibar>
    </div>

    <div class="headLineTab">

      <div class="headLineTabList" v-for="(item,index) in headLineTab" :class="[headLineTabIndex==index?'headLineTabListChoice':'']" :key="index" @click="headLineTabIndex=index">

        <text class="headLineTabText" :class="[headLineTabIndex==index?'headLineTabTextChoice':'']" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.name}}</text>
      </div>
    </div>
    <slider class="headLineSlider" infinite="false" :index="headLineTabIndex" :value="headLineTabIndex" @change="changeHeadLineSlider">

      <!--全部-->
      <scroller class="headLineBlock">
        <div class="recentlyOrder" @click="toOrderDetails()" v-for="(item,index) in myOrder">

          <image class="recentlyOrderShopImg" :src="'https://image.aftdc.com/'+item.img"></image>
          <div class="recentlyOrderContent">
            <div class="recentlyOrderContent_top">
              <text class="recentlyOrderShopName" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">{{item.shopName}}</text>
              <div v-if="item.orderType!=4">
                <text v-if="item.orderStatus=='-2'" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}">待评价</text>
                <text v-if="item.orderStatus==0&&item.userAction==1" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}">退款失败,待商家配送</text>
                <text v-if="item.orderStatus==3&&item.userAction==2" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}">退款失败</text>
                <text v-if="item.orderStatus==0&&item.deskNum!=-1" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}">待备餐</text>
                <text v-if="item.orderStatus==3&&item.deskNum!=-1" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}">备餐中</text>
                <text v-if="item.orderStatus==0&&item.userAction!=1" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}">待受理</text>
                <text v-if="item.orderStatus==3&&item.orderType==0" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}">配送中</text>
                <text v-if="item.orderStatus=='3'&&item.reminder==1" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}">已催单</text>
                <text v-if="item.orderStatus=='3'&&item.reminder==2" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}">已处理催单</text>
                <text v-if="item.orderStatus=='0'&&item.orderType==3" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}">已预定桌位</text>
                <text v-if="item.orderStatus=='3'&&item.orderType==3" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}">已受理预定,请及时到达</text>
                <text v-if="item.orderStatus=='3'&&item.orderType==5" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}">请及时到店自取</text>
                <text v-if="item.orderStatus=='-1'|| item.orderStatus=='-3'" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}">退款中</text>
                <text v-if="item.orderStatus==1&&item.orderType==4" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}">待使用</text>
                <text v-if="item.orderStatus==4&&item.isAppraises==0" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}">待评价</text>
                <text v-if="item.orderStatus=='-4'" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}">商家已退款</text>
                <text v-if="item.orderStatus=='-7'" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}">商家取消订单，已退款</text>
              </div>
            </div>
            <text class="time" :style="{fontSize:GLOBAL.defaultFS}">下单时间:{{item.createTime}}</text>
            <div class="recentlyOrderContent_bottom">
              <text class="shopPriceText" :style="{fontSize:GLOBAL.smallFS}">总价:￥{{item.price}}</text>
              <div class="recentlyOrderContent_button">
                <text class="recentlyOrder_btnback" v-if="(item.orderStatus==0 || item.orderStatus==3)&&item.userAction!=2&&item.orderType!=1&&item.tk!=1" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}">取消订单</text>
                <text class="recentlyOrder_btnback" v-if="item.orderStatus==-2||item.orderType==4" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}">取消订单</text>
                <text class="recentlyOrder_btnback" v-if="(item.orderStatus=='3'&&item.orderType!=3&&item.orderType!=5&&item.reminder==0)&&choose==1" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}">催单</text>
                <text class="recentlyOrder_btn" v-if="item.orderType==4" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}">团购详情</text>
                <text class="recentlyOrder_btn" v-if="item.orderType!=4" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}">详情</text>
                <text class="recentlyOrder_btn" v-if="item.choose==3" @click="toOrderEvaluate"  :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}">去评价</text>
                <text class="recentlyOrder_btn" v-if="(item.orderStatus==3||item.orderStatus==-9)&&choose==0&&item.deskNum=='-1'" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}">确认收货</text>
              </div>
            </div>
          </div>
        </div>
        <noOrder v-if="myOrder.length<=0" img="https://image.aftdc.com/appBimg/icon_no_order.png" textOne="暂无订单" textTwo="可以去看看那些想买的"></noOrder>
      </scroller>

      <!--代付款-->
      <scroller class="headLineBlock">
        <noOrder img="https://image.aftdc.com/appBimg/icon_no_order.png" textOne="暂无订单" textTwo="可以去看看那些想买的"></noOrder>
      </scroller>

      <!--待使用-->
      <scroller class="headLineBlock">
        <noOrder img="https://image.aftdc.com/appBimg/icon_no_order.png" textOne="暂无订单" textTwo="可以去看看那些想买的"></noOrder>
      </scroller>

      <!--代评价-->
      <scroller class="headLineBlock">
        <div class="evaluateOrder" @click="toOrderEvaluate">
          <div class="evaluateOrder_between">
            <image class="evaluateOrderImg" src="https://image.aftdc.com/appBimg/ic_app_logo.jpg"></image>
            <div class="evaluateOrderContent">
              <text :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">正宗麻辣烫(第18分店)</text>
              <text class="time" :style="{fontSize:GLOBAL.smallFS}">2018-06-10 11:20下单</text>
            </div>
          </div>
          <div class="evaluateOrder_betweenRight">
            <text class="recentlyOrder_btn" @click="toOrderEvaluate" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}">去评价</text>
          </div>
        </div>
        <noOrder v-if="false" img="https://image.aftdc.com/appBimg/icon_no_order.png" textOne="暂无订单" textTwo="可以去看看那些想买的"></noOrder>
      </scroller>

      <!--退款/售后-->
      <scroller class="headLineBlock">
        <div class="recentlyOrder" @click="toOrderDetails()">

          <image class="recentlyOrderShopImg" src="https://image.aftdc.com/images/packageA/shopImg2.jpg"></image>
          <div class="recentlyOrderContent">
            <div class="recentlyOrderContent_top">
              <text class="recentlyOrderShopName" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">正宗骨头汤</text>
              <div>
                <text  :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}">退款中</text>
              </div>
            </div>
            <text class="time" :style="{fontSize:GLOBAL.defaultFS}">下单时间:2012.12.11</text>
            <div class="recentlyOrderContent_bottom">
              <text class="shopPriceText" :style="{fontSize:GLOBAL.smallFS}">总价:￥12.22</text>
              <div class="recentlyOrderContent_button">
                <text class="recentlyOrder_btnback"  @click="toRefundProgress()" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}">退款进度</text>
              </div>
            </div>
          </div>
        </div>
        <noOrder v-if="false" img="https://image.aftdc.com/appBimg/icon_no_order.png" textOne="暂无订单" textTwo="可以去看看那些想买的"></noOrder>
      </scroller>
    </slider>
  </div>
</template>

<script>
    import  noOrder from './noOrder.vue';
    import { WxcMinibar} from 'weex-ui';
    var modal = weex.requireModule('modal')
    const event = weex.requireModule('event');
export default {
    components: { WxcMinibar,noOrder},
  name: 'App',
  data () {
    return {
        headLineTab:[{name:'全部'},{name:'待付款'},{name:'待使用'},{name:'待评价'},{name:'退款/售后'},],//餐头条导航栏
        headLineTabIndex:0,//导航栏下标
        myOrder:[//我的最近订单
            {img:'images/packageA/shopImg2.jpg',shopName:'正宗麻辣烫(第18分店)',createTime:'2018-06-10 11:20',price:'16.38',orderType:0,isAppraises:0,orderStatus:4},
            {img:'images/packageA/shopImg2.jpg',shopName:'正宗麻辣烫',createTime:'2018-06-10 11:20',price:'16.38',orderType:2,isAppraises:0,orderStatus:4},
            {img:'images/packageA/shopImg2.jpg',shopName:'正宗麻辣烫',createTime:'2018-06-10 11:20',price:'16.38',orderType:0,isAppraises:0,orderStatus:4},
            {img:'images/packageA/shopImg2.jpg',shopName:'正宗麻辣烫',createTime:'2018-06-10 11:20',price:'16.38',orderType:0,isAppraises:0,orderStatus:4},
            {img:'images/packageA/shopImg2.jpg',shopName:'正宗麻辣烫',createTime:'2018-06-10 11:20',price:'16.38',orderType:0,isAppraises:0,orderStatus:4},
            {img:'images/packageA/shopImg2.jpg',shopName:'正宗麻辣烫',createTime:'2018-06-10 11:20',price:'16.38',orderType:0,isAppraises:0,orderStatus:4},
            {img:'images/packageA/shopImg2.jpg',shopName:'正宗麻辣烫',createTime:'2018-06-10 11:20',price:'16.38',orderType:0,isAppraises:0,orderStatus:4},
            {img:'images/packageA/shopImg2.jpg',shopName:'正宗麻辣烫',createTime:'2018-06-10 11:20',price:'16.38',orderType:0,isAppraises:0,orderStatus:4},
            {img:'images/packageA/shopImg2.jpg',shopName:'正宗麻辣烫',createTime:'2018-06-10 11:20',price:'16.38',orderType:0,isAppraises:0,orderStatus:4},
            {img:'images/packageA/shopImg2.jpg',shopName:'正宗麻辣烫',createTime:'2018-06-10 11:20',price:'16.38',orderType:0,isAppraises:0,orderStatus:4},
        ],
    }
  },
    created(){



    },
    methods:{
        changeHeadLineSlider(event){
            var that=this
            that.headLineTabIndex=event.index
        },
        minibarLeftButtonClick() {

        },
        toOrderDetails(){
            var param='';
            var url='http://assets/orderDetails.js';
            event.toUrl({ "url": url, "param": param });
        },
        viewappear(){
            var that=this
            if(weex.config.param){
                var param  = weex.config.param ;
                that.headLineTabIndex=param;
            }
        },
        toRefundProgress(){
            var param='';
            var url='http://assets/refundProgress.js';
            event.toUrl({"url":url,"param":param})
        },
        toOrderEvaluate(){
            var param='';
            var url='http://assets/orderEvaluate.js';
            event.toUrl({"url":url,"param":param})
        },
    }
}
</script>

<style scoped>
  .wrapper {
  flex-direction: column;
  }
  .minibar {
    /*border-bottom-width: 2px;*/
    /*border-bottom-style: solid;*/
    /*border-bottom-color: #a1a1a1;*/
  }

  .backImg {
    width: 40px;
    height: 40px;
  }

  .headLineTab{
    flex-direction: row;
    align-items: center;
    padding-left: 20px;
    padding-right: 20px;
    background-color: #fff;
    border-bottom-width: 2px;
    border-bottom-style: solid;
    border-bottom-color: #f8f8f8;
    /*padding-bottom: 5px;*/
    justify-content: space-around;
    position: relative;
  }
  .headLineTabList{

    /*margin-left: 10px;*/
    /*margin-right: 10px;*/
    padding-top: 20px;
    padding-bottom: 20px;
    padding-left: 20px;
    padding-right: 20px;
    border-bottom-width: 0px;
    border-bottom-color: #fff;

  }
  .headLineTabListChoice{
    padding-bottom: 15px;
    border-bottom-width: 5px;
    border-bottom-style: solid;
    border-bottom-color: #53beb7;
  }
  .headLineTabText{
    text-align: center;
  }
  .headLineTabTextChoice{
    color: #53beb7;
  }
  .headLineSlider{
    width: 750px;
  flex: 1;
    background-color: #f8f8f8;


  }
  .headLineBlock{
    width: 750px;
    position: absolute;
    top: 0;
    bottom: 0;
    background-color: #fff;
  }
  .recentlyOrder{
    flex-direction: row;
    padding-top: 30px;
    padding-bottom: 30px;
    padding-left: 20px;
    padding-right: 20px;
    background-color: #fff;
    border-bottom-width: 2px;
    border-bottom-style: solid;
    border-bottom-color: #f1f1f1;

  }
  .recentlyOrder:active{
    background-color: #f1f1f1;
  }

  .recentlyOrderShopImg{
    width: 100px;
    height: 100px;
  }
  .recentlyOrderContent{
    margin-left: 15px;
    flex-direction: column;
    flex: 1;
  }
  .recentlyOrderContent_top{
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .recentlyOrderShopName{
    font-weight: bold;
    width: 320px;
    lines:1;
    text-overflow: ellipsis;
  }
  .time{
    margin-top: 15px;
    color: #999;
  }
  .shopPriceText{
    color: #999;
  }
  .recentlyOrderContent_bottom{
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .recentlyOrderContent_button{
    flex-direction: row;
    align-items: center;
  }
  .recentlyOrder_btn{
    /*font-weight: 600;*/
    padding-top: 10px;
    padding-bottom: 10px;
    width: 145px;
    text-align: center;
    border-width: 1px;
    border-style: solid;
    border-color: #53beb7;
    border-radius: 8px;
    margin-left: 30px;
    margin-top: 5px;
  }
  .recentlyOrder_btn:active{
    background-color: #53beb7;
    color: #fff;
  }
  .recentlyOrder_btnback{
    /*font-weight: 600;*/
    padding-top: 10px;
    padding-bottom: 10px;
    width: 145px;
    text-align: center;
    border-width: 1px;
    border-style: solid;
    border-color: #666;
    border-radius: 8px;
    margin-top: 5px;
  }
  .recentlyOrder_btnback:active{
    background-color: #999;
  }
  .evaluateOrder{
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding-top: 30px;
    padding-bottom: 30px;
    padding-left: 20px;
    padding-right: 20px;
    background-color: #fff;
    border-bottom-width: 2px;
    border-bottom-style: solid;
    border-bottom-color: #f1f1f1;
  }
  .evaluateOrderImg{
    width: 150px;
    height: 150px;
  }
 .evaluateOrder_between{
   flex-direction: row;
   align-items: center;

 }
 .evaluateOrder_betweenRight{
   flex-direction: column;
   align-items: center;
   justify-content: center;
 }
  .evaluateOrderContent{
    flex-direction: column;
    justify-content: center;
    margin-left: 15px;
  }
</style>
