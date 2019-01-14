
<template>
    <div class="wrapper" @viewappear="viewappear" @viewdisappear="viewdisappear" :style="{visibility: visibility}">
        <!--头部-->
        <div class="header">
            <div class="back">
                <image class="backImg" @click="backClick()"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text class="appNameCss">{{shopInfo.shopName}}</text>
            </div>
            <div class="allSave ">
                <image class="icon_search" src="https://image.aftdc.com/appBimg/ic_rearch_user.png" @click="toShopGoodsSearchClick()"></image>
                <!--<image class="icon_star" :src="shopInfo.attentionType==1?'https://image.aftdc.com/images/attention3.png':'https://image.aftdc.com/images/attention4.png'"></image>-->
                <image class="icon_star" :src="shopInfo.colType==1?'https://image.aftdc.com/images/icon_starCollage.png':'https://image.aftdc.com/images/icon_starUnCollage.png'" @click="collectAndFollow('colType')"></image>
                <image class="icon_ping" src="https://image.aftdc.com/appBimg/ic_pingdan.png" @click="toCollage" v-if="(orderType==0||orderType==5)&&distance < shopInfo.range&&closeButton&&!shareOrder"></image>
                <image class="icon_more" src="https://image.aftdc.com/appBimg/ic_more_user.png" @click="popoverShowClick()"></image>
            </div>
        </div>

        <div class="toTop">
            <!--商家基本信息-->
            <div>
                <div class="topBody" @click="toHeadLineArticleClick()">
                    <div ref="topBody_img" class="topBody_img">
                        <image class="userImg "  :src="'https://image.aftdc.com/'+shopInfo.shopImg"></image>
                    </div>
                    <div ref="topBody_message" class="topBody_message" >
                        <div style="flex-direction:row;justify-content: space-between;">
                            <div class="shopAvg">
                                <div class="star">
                                    <image class="starSize" src="https://image.aftdc.com/appBimg/icon_wuxing_nocolor.png"></image>
                                    <div class="shopAvgImg" :style="{width:shopInfo.shopAvg*29+'px'}">
                                        <image class="starSize"  src="https://image.aftdc.com/appBimg/icon_wuxing_color.png"></image>
                                    </div>
                                </div>
                                <text class="defaultSize shopContentSize " style="font-size: 22px">月售{{shopInfo.monthlySales}}</text>
                            </div>
                        </div>
                        <div style="flex-direction: row;" v-if="orderType==0">
                            <text class="top_fontText" style="padding-right: 10px;">商家配送</text>
                            <text class=" padding leftRight top_fontText">{{shopInfo.deliveryCostTime==0?'45':shopInfo.deliveryCostTime}}分钟</text>
                            <text class="top_fontText" style="padding-left: 10px">距离 {{shopInfo.distance}}</text>
                        </div>
                        <div style="flex-direction: row;" v-else-if="orderType==5">
                            <text class="top_fontText" style="padding-right: 10px">到店自取</text>
                            <text class=" padding leftRight top_fontText">起购价￥{{shopInfo.selfDeliveryFreeMoney}}</text>
                            <text class="top_fontText" style="padding-left: 10px">距离 {{shopInfo.distance}}</text>
                        </div>
                        <div style="flex-direction: row;" v-else>
                            <text class="top_fontText" style="padding-right: 10px">{{shopInfo.county}}</text>
                            <text class=" padding leftRight top_fontText">{{orderType==3?'起订价￥'+shopInfo.bookingMoney:shopInfo.cuisineName}}</text>
                            <text class="top_fontText" style="padding-left: 10px;">距离 {{shopInfo.distance}}</text>
                        </div>

                        <div style="flex-direction: row;align-items: center;" >
                            <text class=" borderBottom top_fontText"  style="padding-right: 10px">{{shopInfo.fansNum}} 粉丝</text>
                            <text class=" padding leftRight borderBottom top_fontText" >{{shopInfo.dongtaiNum}} 动态</text>
                            <div style="flex-direction: row;align-items: center;padding-left: 10px" class="borderBottom">
                                <image class="whiteTime" src="https://image.aftdc.com/images/shijian1.png" ></image>
                                <text v-if="orderType==0" class="top_fontText"> {{serviceStartTime}}起送</text>
                                <text v-else class=" padding top_fontText" > {{serviceStartTime}}-{{serviceEndTime}} 营业</text>
                            </div>
                        </div>
                        <div style="flex-direction: row;align-items: center">
                            <image class="whiteHorn" src="https://image.aftdc.com/images/mod.png"></image>
                            <text class="whiteFont"  :style="{fontSize:GLOBAL.smallerFS}">{{shopInfo.notice}}</text>
                        </div>
                    </div>
                    <div class="topBody-right">
                        <text class=" btnFocus" :class="[shopInfo.attentionType==1?'attentionGreen':'attentionRed']"  @click="collectAndFollow('attentionType')">{{shopInfo.attentionType==1?'已关注':'关注'}}</text>
                        <image style="width: 20px;height: 30px" src="https://image.aftdc.com/appBimg/icon_arrow_white.png" ></image>
                    </div>
                </div>
                <!--轮播图-->
                <!--一使用判断，dom.scrollerElement就会有偏移-->
                <div class="textCarousel_content">
                    <div class="textCarousel" v-if="lunboOrders.length>0">

                        <div ref="test" :class="[scrollsTransform?'scrollsTransform':'']">
                            <div class="historyOrder"  v-for="(item,index) in lunboOrders">
                                <div style="border-radius: 20px">
                                    <image class="headSculpture"
                                           :src="item.userPhoto?item.userPhoto:'https://image.aftdc.com/images/wtx.png'"></image>
                                </div>
                                <div class="historyOrderContent">
                                    <div class="orderContent">
                                        <text class="orderName">{{item.userName}}</text>
                                        <text class="orderTimeText">{{item.times}}前 下了一笔订单</text>
                                    </div>
                                    <div class="orderContent">
                                        <text class="orderContentBorderText" :style="{fontSize:GLOBAL.smallerFS}">{{item.shopName}}</text>
                                        <text class="orderContentBorderText" :style="{fontSize:GLOBAL.smallerFS}">3公里{{item.cuisine}}前10名</text>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>
                    <!--<div class="textCarousel_redPackets">-->
                    <!--<image class="textCarouselR_img" src="https://image.aftdc.com/images/received_redRacketsBg.png" @click="onTopDetails()"></image>-->
                    <!--</div>-->
                </div>
                <scroller show-scrollbar="false" style="flex: 1" >
                    <scroller v-if="orderRedPackets" scroll-direction="horizontal" class="redPackets_scroller" show-scrollbar="false" >
                        <div class="redPackets_small" ref="redPackets_small">
                            <div  v-for="(item,index) in redPackets" class="couponDiv"  @click="onRedRacketsReceive(index,item.id)">
                                <image class="quanImg"  :src="item.isGet?'https://image.aftdc.com/images/received_redRacketsBg.png':'https://image.aftdc.com/images/redPacketsBg.png'"></image>
                                <div class="yhqbox" ref="ref_yhqbox">
                                    <div class="redPacket_content" >
                                        <div class="couponPrice">
                                            <text  style="font-size: 35px;margin-bottom: 7px" :style="{color:item.isGet?'#fb574e':'#fff'}">￥</text>
                                            <text style="font-size: 60px" :style="{color:item.isGet?'#fb574e':'#fff'}">{{item.piece}}</text>
                                        </div>
                                        <div class="couponDetailTip">
                                            <text class="useCouponText" :style="{color:item.isGet?'#fb574e':'#fff'}">满{{item.money}}可用</text>
                                            <text class="couponTime" :style="{color:item.isGet?'#fb574e':'#fff'}">有效期至{{item.end_time}}</text>
                                        </div>
                                    </div>

                                </div>
                                <div class="get" ref="ref_get">
                                    <text style="font-size: 35px" :style="{color:item.isGet?'#fb574e':'#fff'}" v-if="!item.isGet">领取</text>
                                    <text style="font-size: 35px" :style="{color:item.isGet?'#fb574e':'#fff'}" v-if="item.isGet">已领取</text>
                                </div>
                                <div class="smallYhqbox"  ref="ref_smallYhqbox">
                                    <div class="couponPrice">
                                        <text  style="font-size: 75px;margin-bottom: 7px" :style="{color:item.type?'#fb574e':'#fff'}">￥</text>
                                        <text style="font-size: 100px" :style="{color:item.type?'#fb574e':'#fff'}">{{item.piece}}</text>
                                    </div>
                                </div>
                                <div class="smallGet" ref="ref_smallGet">
                                    <text style="font-size: 75px" :style="{color:item.type?'#fb574e':'#fff'}" >领</text>
                                </div>
                            </div>
                        </div>
                    </scroller>
                    <div ref="top_activity" class="top_activity">
                        <div class="top_normal" v-if="shopInfo.mj">
                            <text class="reduction" :style="{fontSize:GLOBAL.smallFS}">减</text>
                            <text class="textMsg" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{shopInfo.youhui}}</text>
                        </div>
                        <div class="top_normal" v-if="shopInfo.newCou">
                            <text class="newUser" :style="{fontSize:GLOBAL.smallFS}">新</text>
                            <text class="textMsg" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">新用户立减{{shopInfo.newCou}}元</text>
                        </div>
                        <div class="top_normal" v-if="shopInfo.zk">
                            <text class="bl-zhe" :style="{fontSize:GLOBAL.smallFS}">折</text>
                            <text class="textMsg" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">折扣商品</text>
                        </div>
                        <div class="top_normal" v-if="shopInfo.hb" >
                            <text class="bl-jian" :style="{fontSize:GLOBAL.smallFS}">红</text>
                            <text class="textMsg" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">进店领红包</text>
                        </div>
                        <div class="top_normal" v-if="shopInfo.mz" >
                            <text class="bl-man" :style="{fontSize:GLOBAL.smallFS}">赠</text>
                            <text class="textMsg" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">指定商品有赠品</text>
                        </div>
                        <div class="top_normal" v-if="shopInfo.jf" >
                            <text class="bl-jf" :style="{fontSize:GLOBAL.smallFS}">积</text>
                            <text class="textMsg" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">购买赠送积分</text>
                        </div>
                        <div class="top_normal" v-if="shopInfo.tg">
                            <text class="bulk" :style="{fontSize:GLOBAL.smallFS}">团</text>
                            <text class="textMsg" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">团购商品</text>
                        </div>
                        <div class="top_normal" v-if="shopInfo.djq">
                            <text class="rob" :style="{fontSize:GLOBAL.smallFS}">代</text>
                            <text class="textMsg" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">抢购代金券</text>
                        </div>

                        <div class="top_notice">
                            <text :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">公告</text>
                            <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor,marginTop:'10px'}">{{shopInfo.notice}}</text>
                        </div>
                    </div>
                </scroller>
                <div class="top_bottomArrow" @click="onTopDetails" v-if="!topDetails">
                    <image class="double_arrowImg" src="https://image.aftdc.com/images/double_arrow.png"></image>
                </div>
            </div>
            <div  :ref="'boxs'" class="boxs"
                  v-bind:style="boxStyle">
                <div class="tabActive" @click=""  style="flex-direction: row;justify-content: space-around;align-items: center">
                    <text :class="[tabIndex==0?'tab':'tabs']" @click="tabIndex=0">点餐</text>
                    <text :class="[tabIndex==1?'tab':'tabs']" @click="tabIndex=1">评价{{allPf.pinglun_num?allPf.pinglun_num>99?'(99+)':'('+allPf.pinglun_num+')':''}}</text>
                    <text :class="[tabIndex==2?'tab':'tabs']" @click="tabIndex=2">商家</text>
                </div>
                <!--<div :style="{width: 2250+'px',flexDirection:'row',left:-tabIndex * 750+'px'}">-->
                <slider class="slider" infinite="false" :index="tabIndex" :value="tabIndex" @change="change">
                    <!--点餐-->

                    <div style="flex-direction: row;width: 750px;" >
                        <div style="flex: 1" @touchstart="ontouchstart($event,0)" @touchmove="ontouchmove($event,0)" @touchend="ontouchend($event,0)"
                             fireEventSync="true">
                            <scroller show-scrollbar="false" @scroll="scrollHandler($event,0)" offset-accuracy="10px"  style="margin-bottom:95px;flex:3;background-color: #ffffff;">
                                <template v-if="orderType!=6&&orderType!=7" >
                                    <div v-for="(item,index) in Von" ref="friScroller" @appear="scrollerAppear($event,index)" @disappear="scrollerDisappear($event,index)">
                                        <text class="catNameText"  ref="gooding" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.catName}}{{item.catName=='折扣'&&item.type==1?'（超过限购份数可原价购买）':''}}</text>
                                        <div class="goods"
                                             v-for="(food,foodIndex) in item.distop" @click="boxShowClick(index,foodIndex,food.type)">
                                            <div style="position: relative">
                                                <image class="goodImg"
                                                       :src="'https://image.aftdc.com/'+food.goodsImg" ></image>
                                                <div class='noFoodDiv' v-if="food.goodsStock==0||food.todayGoodsStock==0">
                                                    <text class='noFood' :style="{fontSize:GLOBAL.bigFS,color:'#fff'}">已售罄</text>
                                                </div>
                                            </div>
                                            <div class="disfood" >
                                                <div class="disfood-name">
                                                    <text class="foodNameText" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">{{food.goodsName}}</text>
                                                    <text class='foodDetails' :style="{fontSize:GLOBAL.smallerFS,color:GLOBAL.dColor}" v-if="food.goodsDesc">{{food.goodsDesc}}</text>
                                                    <div style='flex-direction: row;'>
                                                        <div class='discountDiv' v-if="item.catId==3">
                                                            <image class='discountIcon' src='https://image.aftdc.com/appBimg/discountDetails.png'></image>
                                                            <text class='discountText' :style="{fontSize:GLOBAL.smallerFS,color:GLOBAL.tColor}">{{food.discount}}折 {{food.buyNum==-1?'不限量':'限'+food.buyNum+'份'}}</text>
                                                        </div>

                                                        <div class='discountDiv' style='width:130px' v-if="food.buyMininum>1">
                                                            <image class='discountIcon' src='https://image.aftdc.com/appBimg/discountDetails.png'></image>
                                                            <text class='discountText' :style="{fontSize:GLOBAL.smallerFS,color:GLOBAL.tColor}">{{food.buyMininum}}份起购</text>
                                                        </div>
                                                    </div>

                                                    <div class='fullGiveDiv' v-if="item.catId==4">
                                                        <image class='discountIcon' style='margin-top:4px' src='https://image.aftdc.com/appBimg/discountDetails.png'></image>
                                                        <text class='discountText' :style="{fontSize:GLOBAL.smallerFS,color:GLOBAL.tColor}" v-if="item.catId==4">买{{food.buy_num}}份赠{{food.gift_num}}份{{food.gift_goods.goodsName}}</text>
                                                    </div>
                                                </div>



                                                <div class="disfood-bottom" >
                                                    <div class="spec-market">
                                                        <div class="marketPrice_spec" v-if="food.guige.length>0">
                                                            <text :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.tColor}" >￥{{food.marketPrice}}</text>
                                                            <text :style="{fontSize:GLOBAL.smallFS,color:'#999',marginBottom:'3px'}" >起</text>
                                                        </div>
                                                        <text  :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.tColor}" v-else>￥{{food.shopPrice}}</text>
                                                        <text  class="marketPriceText" :style="{fontSize:GLOBAL.smallFS,color:'#999'}" v-if="food.shopPrice!=food.marketPrice&&food.zkGoodsId">￥{{food.marketPrice}}</text>
                                                        <text style="font-size: 35px;color:#999;text-decoration: line-through" v-else> </text>
                                                    </div>
                                                    <div style="flex-direction: row;align-items: center;margin-right: 20px;">
                                                        <!--有规格  -->

                                                        <text class='chooseGG' :style="{fontSize:GLOBAL.smallerFS,color:'#fff'}" v-if="(food.guige.length>0||food.guigeAttr.length>0)&&closeButton" @click="specBoxShowClick(index,foodIndex)">选规格</text>

                                                        <!--加减  catId=1 砍价   catId=2 秒杀   catId=3 折扣-->
                                                        <div style="flex-direction: row;align-items: center;" v-else-if="item.catId!=1&&closeButton">
                                                            <image v-if="food.numb>0" class="addImgs" src="https://image.aftdc.com/images/sub.png" @click="sub(index,foodIndex)"></image>
                                                            <text v-if="food.numb>0" style="font-size: 35px">{{food.numb}}</text>
                                                            <image v-if="item.catId!=1||food.result" class="addImg" src="https://image.aftdc.com/images/add.png" :style="{opacity:food.goodsStock==0||food.todayGoodsStock==0?'0.3':'1'}" @click="add(index,foodIndex)"></image>
                                                        </div>



                                                    </div>

                                                </div>
                                                <text class="guigeNumbDiv" v-if="(food.guige.length>0||food.guigeAttr.length>0)&&food.numb>0" :style="{fontSize:'18px',width:food.numb>99?'36px':'30px'}">{{food.numb>99?'99+':food.numb}}</text>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                                <!-- 团购商品 -->
                                <template style="width: 750px" v-else>
                                    <div v-for="(item,index) in Von"  ref="friScroller" v-if="catNameIndex==index">
                                        <div class="tkDishes" >
                                            <div class="tkFood"
                                                 v-for="(food,foodIndex) in item.distop" >
                                                <div class="tkGoods"  >
                                                    <image class="goodImg" @click="boxShowClick(index,foodIndex,food.type)"
                                                           :src="'https://image.aftdc.com/'+food.goodsImg" ></image>
                                                    <div class="disfood" >
                                                        <div class="disfood-name">
                                                            <text class="foodNameText" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">{{food.goodsName}}</text>
                                                            <text class='foodDetails' :style="{fontSize:GLOBAL.smallerFS,color:GLOBAL.dColor}" v-if="food.goodsDesc">{{food.goodsDesc}}</text>
                                                        </div>
                                                        <div class="disfood-bottom" >
                                                            <div class="spec-tkMarket">
                                                                <text  :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.tColor}" >￥{{food.shopPrice}}</text>
                                                                <div>
                                                                    <!--<text  :style="{fontSize:GLOBAL.smallFS,color:'#999'}">原价</text>-->
                                                                    <text  class="marketPriceText" :style="{fontSize:GLOBAL.smallFS,color:'#999'}" v-if="food.shopPrice!=food.marketPrice">原价￥{{food.marketPrice}}</text>
                                                                    <text style="font-size: 35px;color:#999;text-decoration: line-through" v-else> </text>
                                                                </div>
                                                            </div>
                                                            <div style="flex-direction: row;align-items: center;margin-right: 20px;" v-if="item.catId!=1|| food.result">
                                                                <image v-if="food.numb>0" class="addImgs" src="https://image.aftdc.com/images/sub.png" @click="sub(index,foodIndex)"></image>
                                                                <text v-if="food.numb>0" style="font-size: 35px">{{food.numb}}</text>
                                                                <image v-if="item.catId!=1||food.result" class="addImg" src="https://image.aftdc.com/images/add.png" :style="{opacity:car.length>0&&food.groupId!=car[0].arr.groupId?'0.3':'1'}" @click="add(index,foodIndex,food.groupId)" ></image>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="tk_backDiv">
                                                    <text class='tk_backText' :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">随时退</text>
                                                    <text class='tk_backText' :style="{fontSize:GLOBAL.defaultFS,color:'#999'}" v-if="!food.subscribeTime">| 免预约</text>
                                                    <text class='tk_backText' :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">| 过期自动退</text>
                                                </div>



                                                <div class="mealDetail" v-if="type==1||type==2">
                                                    <div class='detailDiv' v-if="food.goodslist&&food.goodslist.length>0">
                                                        <text class="inforName" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">套餐</text>
                                                        <div v-for="(list,listIndex) in food.goodslist">
                                                            <div class="mealKind">
                                                                <div class='aiCenter'>
                                                                    <text class="mealKind_name" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">&nbsp;•&nbsp;{{list.goodsName}}&nbsp;</text>
                                                                    <text class="mealKind_numb" :style="{fontSize:GLOBAL.smallFS,color:'#9d9d9d'}" v-if="list.numAndSpe">({{list.numAndSpe}})</text>
                                                                    <text class="mealKind_numb" :style="{fontSize:GLOBAL.smallFS,color:'#9d9d9d'}" v-else>（{{list.goodsNum}}份）</text>
                                                                </div>
                                                                <text class="mealKind_money" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">￥{{list.goodsPrice}}</text>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class='moreInfo'>
                                                        <text class="inforName" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}" v-if="food.groupDes">备注:</text>
                                                        <div class="mealKindTwo" v-if="food.groupDes">
                                                            <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">&nbsp;•&nbsp;</text>
                                                            <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{food.groupDes}}</text>
                                                        </div>

                                                        <text class="inforName" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">有效期:</text>
                                                        <div class="mealKindTwo">
                                                            <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">&nbsp;•&nbsp;{{food.startTime}} 至 {{food.endTime}}</text>
                                                        </div>

                                                        <text class="inforName" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}" v-if="food.useData">不可用日期:</text>
                                                        <div class="mealKindTwo" v-if="food.useData">
                                                            <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">&nbsp;•&nbsp;</text>
                                                            <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{food.useData}}</text>
                                                        </div>

                                                        <text class="inforName" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">使用时间:</text>
                                                        <div class="mealKindTwo">
                                                            <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">&nbsp;•&nbsp;</text>
                                                            <div class='mealKindWrap'>
                                                                <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}" v-for="(dataL,dataLIndex) in food.dataList" >{{dataL.start}}-{{dataL.end}}{{dataLIndex!=food.dataList.length-1?',':''}}&nbsp;</text>
                                                            </div>
                                                        </div>

                                                        <text class="inforName" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">使用规则:</text>

                                                        <div class="mealKindTwo" v-if="!food.subscribeTime">
                                                            <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">&nbsp;•&nbsp;</text>
                                                            <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">无需预约,消费高峰时可能需要等位</text>
                                                        </div>

                                                        <div class="mealKindTwo" v-if="food.subscribeTime">
                                                            <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">&nbsp;•&nbsp;</text>
                                                            <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">预约需提前: {{food.subscribeTime}}</text>
                                                        </div>

                                                        <div class="mealKindTwo" v-for="(rule,ruleIndex) in food.ruleList" >
                                                            <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">&nbsp;•&nbsp;</text>
                                                            <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor,width:'500px'}">{{rule.text}}无需预约,消费高峰时可能需要等位无需预约,消费高峰时可能需要等位</text>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </template>

                            </scroller>
                        </div>
                        <div class="catName_class"  @touchstart="ontouchstart($event,1)"  @touchmove="ontouchmove($event,1)" @touchend="ontouchend($event,1)"
                             fireEventSync="true">
                            <scroller show-scrollbar="false" style="flex: 1;" offset-accuracy="10px" @scroll="scrollHandler($event,1)">

                                <div v-for="(item,index) in Von" :class="[catNameIndex==index?'leftBoxs':'leftBox']" ref="secScroller"
                                     @click="sortClick(index)">
                                    <image v-if="item.catName=='买赠'&&item.type==1" class="leftIcon"
                                           src="https://image.aftdc.com/appBimg/give-icon.png"></image>
                                    <image v-if="item.catName=='砍价'&&item.type==1" class="leftIcon"
                                           src="https://image.aftdc.com/images/cut-icon.png"></image>
                                    <image v-if="item.catName=='秒杀'&&item.type==1" class="leftIcon"
                                           src="https://image.aftdc.com/images/sec-icon.png"></image>
                                    <image v-if="item.catName=='折扣'&&item.type==1" class="leftIcon"
                                           src="https://image.aftdc.com/images/reb-icon.png"></image>
                                    <image v-if="item.catName=='热销'&&item.type==1" class="leftIcon"
                                           src="https://image.aftdc.com/images/hot-icon.png"></image>


                                    <text :class="[catNameIndex==index?'leftSliders':'leftSlider']">{{item.catName}}</text>
                                    <text class="numbText" v-if="item.allNumb&&item.allNumb>0" :style="{fontSize:'18px',width:item.allNumb>99?'36px':'30px'}">{{item.allNumb>99?'99+':item.allNumb}}</text>
                                </div>

                            </scroller>
                        </div>
                    </div>



                    <!--评价-->
                    <div @touchstart="ontouchstart($event,2)" @touchmove="ontouchmove($event,2)" @touchend="ontouchend($event,2)" fireEventSync="true">
                        <scroller style="width: 750px;position: relative"  @scroll="scrollHandler($event,2)">
                            <div class="rating">
                                <div class="pinglun_allScroe" >
                                    <text class="allScore" :style="{color:GLOBAL.tColor}" v-if="allPf.avg">{{allPf.avg}}</text>
                                    <text class="allScore" :style="{color:GLOBAL.tColor}" v-else>暂无</text>
                                    <text class="textFont" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">综合评分</text>
                                </div>
                                <div class="pinglun_centerScroe">
                                    <div class="pinglun_tasteScroe">
                                        <text class="textFont" style="padding-right: 20px;" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">口味</text>
                                        <div class="stars pinLun_scroeStar" >
                                            <image class="starSize"
                                                   src="https://image.aftdc.com/appBimg/icon_wuxing_nocolor.png"></image>
                                            <div class=" yellowStar" :style="{width:allPf.tasteScore*30+'px'}">
                                                <image class="starSize"
                                                       src="https://image.aftdc.com/appBimg/icon_wuxing_color.png"></image>
                                            </div>
                                        </div>
                                        <text class="startScore" :style="{fontSize:GLOBAL.bigFS}" v-if="allPf.tasteScore">{{allPf.tasteScore}}</text>
                                        <text class="startScore" :style="{fontSize:GLOBAL.bigFS}" v-else>暂无</text>
                                    </div>
                                    <div class="pinglun_warpScroe">
                                        <text class="textFont" style="padding-right: 20px;" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">包装</text>
                                        <div class="stars pinLun_scroeStar" >
                                            <image class="starSize"
                                                   src="https://image.aftdc.com/appBimg/icon_wuxing_nocolor.png"></image>
                                            <div class=" yellowStar" :style="{width:allPf.warpScore*30+'px'}">
                                                <image class="starSize"
                                                       src="https://image.aftdc.com/appBimg/icon_wuxing_color.png"></image>
                                            </div>
                                        </div>
                                        <text class="startScore" :style="{fontSize:GLOBAL.bigFS}" v-if="allPf.warpScore">{{allPf.warpScore}}</text>
                                        <text class="startScore" :style="{fontSize:GLOBAL.bigFS}" v-else>暂无</text>
                                    </div>
                                </div>
                                <div class="pinLun_psScore" >
                                    <text class="allScore" :style="{color:GLOBAL.tColor}" v-if="allPf.timeScore">{{allPf.timeScore}}</text>
                                    <text class="allScore" :style="{color:GLOBAL.tColor}" v-else>暂无</text>
                                    <text class="textFont" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">配送评分</text>
                                </div>
                            </div>
                            <div class="bars"></div>

                            <div class="pinLun_choice" >
                                <text class="pinLun_choiceAll" :class="[ratingSelect==0?'ratinges':'ratings']"  @click="onRatingSwitch(0)">全部</text>
                                <text :class="[ratingSelect==1?'ratinges':'ratings']"  @click="onRatingSwitch(1)">有图</text>
                                <text class="pinLun_choiceScore" :class="[ratingSelect==2?'ratinges':'ratings']"  @click="onRatingSwitch(2)">评分</text>
                            </div>


                            <!--<slider :index="ratingSelect" infinite="false" class="slider" @change="changes">-->
                            <!--全部 切换有图/最新直接从接口返回zanData数据-->
                            <div v-if="pingLunShow.length>0">
                                <div class="pinLun_topStyle"  v-for="(item,index) in pingLunShow" @click="toGoodsCommentDetailsClick(index)">
                                    <div class="pinLun_bottomStyle" >
                                        <!--优质评论  -->
                                        <image v-if="item.isGood==1" class="yzpl" src="https://image.aftdc.com/images/yzpl.png"></image>
                                        <div class="pinLun_topMess">
                                            <div  class="aiCenter">
                                                <div class="pinLun_photo">
                                                    <image class="ratImg" :src="item.userPhoto?item.userPhoto:'https://image.aftdc.com/images/wtx.png'"></image>
                                                </div>
                                                <div style="flex: 1">
                                                    <div class="pinLun_name">
                                                        <text :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor,maxWidth:'350px',textOverflow:'ellipsis',lines:1}">{{item.userName}}</text>
                                                        <text :style="{fontSize:GLOBAL.smallFS,color:'#999'}">{{item.createTime}}</text>
                                                    </div>
                                                    <div style="flex-direction: row;align-items: center" v-if="item.avg">

                                                        <text :style="{fontSize:GLOBAL.smallFS,color:'#999'}">评分：</text>
                                                        <div class="pinLun_stars" >
                                                            <image class="pinLun_starSize"
                                                                   src="https://image.aftdc.com/appBimg/icon_wuxing_nocolor.png"></image>
                                                            <div class="pinLun_yellowStar" :style="{width:item.avg*22+'px'}">

                                                                <image class="pinLun_starSize"
                                                                       src="https://image.aftdc.com/appBimg/icon_wuxing_color.png"></image>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <text class="pinLun_content" v-if="item.content" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor,maxWidth:'620px'}">{{item.content}}</text>

                                        <div class="pinLun_foodImg" >
                                            <image class="ratGoodImg" v-for="(img,imgIndex) in item.appraisesAnnex" @click="onEnlargeImageClick(index,imgIndex)" :src="'https://image.aftdc.com/'+img"></image>
                                        </div>
                                        <div class="pinLun_content" style="max-width:630px;flex-wrap: wrap" v-if="item.goodsInfo">
                                            <image class="pinLun_littleIcon"  src="https://image.aftdc.com/images/zanfood.png"></image>
                                            <text v-for="(goods,goodsIndex) in item.goodsInfo" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.tColor}"> {{goods.goodsName}}</text>
                                        </div>
                                        <div class="pinLun_content" v-if="item.tagStr">
                                            <image class="pinLun_littleIcon" src="https://image.aftdc.com/images/shuqian.png"></image>
                                            <text :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.tColor,alignItems:'center',maxWidth:'590px'}">{{item.tagStr}}</text>
                                        </div>
                                        <!--<image class="replyAll-img" src="https://image.aftdc.com/images/replyAll.png" ></image>-->
                                        <text class="pinLun_content pinLun_shopReply" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}" v-if="item.isShopReply">商家回复:{{item.busReply}}</text>

                                        <div class="pinLun_zanImgDiv" ref="zan">
                                            <image class="pinLun_zanImg" src="https://image.aftdc.com/images/zan.png"></image>
                                        </div>
                                        <div class="pinLun_zan">
                                            <div class="aiCenter">
                                                <text :style="{fontSize:GLOBAL.smallFS,color:'#999'}">浏览量:</text>
                                                <text :style="{fontSize:GLOBAL.smallFS,color:'#999'}">{{item.readNum}}</text>
                                            </div>
                                            <div class="aiCenter">
                                                <div class="zanDiv" @click="praiseClick(item.id,index)">
                                                    <image class="zanImg" :src="item.isZan==0?'https://image.aftdc.com/images/allzan.png':'https://image.aftdc.com/images/allzan1.png'"></image>
                                                    <text  class="hot"  :style="{fontSize:GLOBAL.smallerFS,color:'#999'}"> {{item.numbs!=0?item.numbs+' 热度':' 赞'}}</text>
                                                    <!--如果点赞为0，显示赞，否则多少热度-->

                                                </div>
                                                <div class="zanDiv" style="margin-left: 20px" @click="toGoodsCommentDetailsClick(index)">
                                                    <text  class="hot"  :style="{fontSize:GLOBAL.smallerFS,color:'#999'}">{{item.reply_num?item.reply_num:''}} 评论</text>
                                                    <!--如果点赞为0，显示赞，否则多少热度-->

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="noPinLun" v-else>
                                <image class="noOrderIcon" src="https://image.aftdc.com/appBimg/icon_no_order.png"></image>
                                <text class='wuPl' :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">暂无评论~</text>
                            </div>
                            <!--</slider>-->
                            <loading class="loading"  @loading="onloading" :display="loadinging ? 'show' : 'hide'">
                                <image class="loadingIndicator" v-if="!noDataOfPinLun"  src="https://image.aftdc.com/appBimg/ic_loading_gif.gif"></image>
                                <div style="flex-direction: row;justify-content: space-between;margin: 20px;" v-else>
                                    <text class="line"></text>
                                    <text class="overline">我是有底线的</text>
                                    <text class="line"></text>
                                </div>
                            </loading>


                        </scroller>

                        <!--<scroller class="noPinLun"  v-else>-->
                        <!--<image class="noOrderIcon" src="https://image.aftdc.com/appBimg/icon_no_order.png"></image>-->
                        <!--<text class='wuPl' :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">暂无评论~</text>-->
                        <!--</scroller>-->
                    </div>
                    <!--商家-->
                    <div style="width: 750px;" @touchstart="ontouchstart($event,3)" @touchmove="ontouchmove($event,3)" @touchend="ontouchend($event,3)" fireEventSync="true">
                        <scroller show-scrollbar="false" @scroll="scrollHandler($event,3)">
                            <div>
                                <div >
                                    <text class="label" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">商家信息</text>
                                    <scroller scroll-direction="horizontal" class="environment" show-scrollbar="false" v-if="envImg.length>0">
                                        <image class="sliders" v-for="(item,index) in envImg" @click="onShopMessageClick(index)" :src="'https://image.aftdc.com/'+item"></image>
                                    </scroller>
                                </div>
                                <div class="noteView" >
                                    <image class="horns" src="https://image.aftdc.com/images/note.jpg"></image>
                                    <text class="blackFont" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor,paddingLeft:'10px'}">{{shopInfo.notice}}</text>
                                </div>
                                <div>
                                    <!--<text class="label" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">商家信息</text>-->
                                </div>
                                <div class="shop_messageView">
                                    <image class="icon" src="https://image.aftdc.com/images/dw.png"></image>
                                    <text class="textMsgWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">位置:{{shopInfo.shopAddress}}</text>
                                </div>
                                <div class="shop_messageView">
                                    <image class="icon" src="https://image.aftdc.com/images/phone.png"></image>
                                    <text class="textMsgWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">电话:{{shopInfo.shopTel}}</text>
                                </div>
                                <div class="shop_messageView">
                                    <image class="icon" src="https://image.aftdc.com/images/send1.png"></image>
                                    <text class="textMsgWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">配送服务：由 商家 提供配送服务</text>
                                </div>
                                <div class="shop_messageView">
                                    <image class="icon" src="https://image.aftdc.com/images/time.png"></image>
                                    <div class="textMsgWidth" style="flex-direction: row;">
                                        <text  :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}" v-for="(item,index) in shopInfo.serviceTime">{{index==0?'营业时间: ':''}}{{item.serviceStartTime}}-{{item.serviceEndTime}}{{index!=shopInfo.serviceTime.length-1?',':''}}</text>
                                    </div>
                                </div>
                                <div class="shop_messageView" @click="toBusinessQualificationClick()">
                                    <image class="icon" src="https://image.aftdc.com/images/licence.png"></image>
                                    <text class="textMsgWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">查看营业资质</text>
                                </div>
                                <div style="flex-direction: row;margin-left: 20px;margin-top: 20px; padding-bottom: 40px;align-items: center" v-if="shopInfo.certification==1">
                                    <image class="icon" src="https://image.aftdc.com/images/daV.png"></image>
                                    <text class="textMsgWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">已认证</text>
                                </div>
                                <div>
                                    <div v-if="shopInfo.projectNum>0">
                                        <text class="label" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">商家活动</text>
                                    </div>
                                    <div class="float">
                                        <div class="normal" v-if="shopInfo.mj">
                                            <text class="reduction" :style="{fontSize:GLOBAL.smallFS}">减</text>
                                            <text class="textMsg" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{shopInfo.youhui}}</text>
                                        </div>
                                        <div class="normal" v-if="shopInfo.newCou">
                                            <text class="newUser" :style="{fontSize:GLOBAL.smallFS}">新</text>
                                            <text class="textMsg" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">新用户立减{{shopInfo.newCou}}元</text>
                                        </div>
                                        <div class="normal" v-if="shopInfo.zk">
                                            <text class="bl-zhe" :style="{fontSize:GLOBAL.smallFS}">折</text>
                                            <text class="textMsg" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">折扣商品</text>
                                        </div>
                                        <div class="normal" v-if="shopInfo.hb" >
                                            <text class="bl-jian" :style="{fontSize:GLOBAL.smallFS}">红</text>
                                            <text class="textMsg" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">进店领红包</text>
                                        </div>
                                        <div class="normal" v-if="shopInfo.mz" >
                                            <text class="bl-man" :style="{fontSize:GLOBAL.smallFS}">赠</text>
                                            <text class="textMsg" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">指定商品有赠品</text>
                                        </div>
                                        <div class="normal" v-if="shopInfo.jf" >
                                            <text class="bl-jf" :style="{fontSize:GLOBAL.smallFS}">积</text>
                                            <text class="textMsg" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">购买赠送积分</text>
                                        </div>
                                        <div class="normal" v-if="shopInfo.tg">
                                            <text class="bulk" :style="{fontSize:GLOBAL.smallFS}">团</text>
                                            <text class="textMsg" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">团购商品</text>
                                        </div>
                                        <div class="normal" v-if="shopInfo.djq">
                                            <text class="rob" :style="{fontSize:GLOBAL.smallFS}">代</text>
                                            <text class="textMsg" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">抢购代金券</text>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </scroller>
                    </div>
                </slider>
            </div>
        </div>

        <!-- 休息中接受预订提醒 -->
        <div class='bottom yuding' v-if="shopInfo.dpzt==2&&car.length==0&&shopType != 6&&shopType != 8">
            <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor}" v-if="(!shopInfo.reserve&&(shopType==1||shopType==3))||(!shopInfo.selfReserve&&shopType==2)||(!restTimeBookForward&&shopType==5)">商家休息中，不可预订</text>
            <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor}" v-else-if="restTimeBookForward&&shopType==5">商家休息中，接受预订</text>
            <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor}" v-else>商家休息中，现在预订，最早{{presetTime[0].today}} {{presetStartTime}}开始{{shopType == 1  || shopType == 3?'配送':'受理'}}</text>
        </div>
        <div class='bottom yuding' v-if="shopInfo.dpzt==0">
            <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor}">商家已暂停营业</text>
        </div>
        <!-- 超出配送范围 -->
        <div class='bottom yuding' v-if="shopType == 1&&distance>=shopInfo.range">
            <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor}">您的位置太远了，商家送不到</text>
        </div>
        <!-- 超出自取范围 -->
        <div class='bottom yuding' v-if="shopType == 2&&distance>=shopInfo.selfDistance">
            <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor}">您的位置距离商家太远了</text>
        </div>
        <!--&lt;!&ndash;商品详情弹出框&ndash;&gt;-->


        <div class="backDiv" v-if="specBoxShow" @click="boxHide">
            <div class="box" @click="">
                <text class="box_name" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{box.goodsName}}</text>
                <div class="box_spec">
                    <div class="box_size" v-if="box.guige.length>0">
                        <text class='box_guigeName' :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">规格:</text>
                        <div class='box_guigeNameR'>
                            <text class="box_specClass" v-for="(item,index) in box.guige" :class="[box.choose==index?'select':'']"  @click="item.stock==0?'':sizeClick(index,item.guigeName)" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor,opacity:item.stock==0?'0.3':'1'}">{{item.guigeName}} </text>
                        </div>
                    </div>
                    <div class="box_taste" v-if="box.guigeAttr.length>0">

                        <div class="box_size box_sizeAttr" v-for="(item,index) in box.guigeAttr" >
                            <text class='box_guigeName' :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.attrName}}:</text>
                            <div class='box_guigeNameR'>

                                <text class="box_specClass" v-for="(i,attrIndex) in item.attrContent" :class="[box.guigeAttr[index].choose==attrIndex?'select':'']" @click="tasteClick(index,i,attrIndex)" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">{{i}}</text>

                            </div>
                        </div>

                    </div>
                </div>
                <div class="box_bott spec_bott">
                    <div class="box_price">
                        <text class="box_sale" :style="{fontSize:GLOBAL.biggerFS}">￥{{box.shopPrice}}</text>
                        <text class="choiceTipText" :style="{fontSize:GLOBAL.smallerFS}">(</text>
                        <text class="choiceTipText choiceTipNameText" :style="{fontSize:GLOBAL.smallerFS}">{{box.spec_size}}{{specTasteName}}</text>
                        <text class="choiceTipText" :style="{fontSize:GLOBAL.smallerFS}">)</text>
                    </div>
                    <!--<text class="box_okbtn"  v-if="(box.guige||box.taste)&&(box.nochooseGG||box.nochooseAttr)">请选择</text>-->
                    <text class="box_okbtn box_btn" @click="ok()" v-if="box.numb==0" :style="{fontSize:GLOBAL.smallFS}">加入购物车</text>
                    <div style="flex-direction: row;align-items: center;margin-right: 20px;height: 60px" v-else>
                        <image  class="addImgs" src="https://image.aftdc.com/images/sub.png" @click="specBoxSub()"></image>
                        <text  style="font-size: 35px">{{box.numb}}</text>
                        <image  class="addImg" src="https://image.aftdc.com/images/add.png" @click="ok()"></image>
                    </div>
                </div>
                <text class="del" @click="boxHide">×</text>
            </div>
            <toast ref="toastSpecBox"></toast>
        </div>
        <!--购物车商品-->

        <div class="shopCar" @click="shopCarShowClick()" v-if="tabIndex==0&&topDetails">
            <div style="flex-direction: row;align-items: center">
                <div >
                    <image class="carImg" src="https://image.aftdc.com/images/car.png"></image>
                    <div v-if="totalnumb>0" style="position: absolute;bottom: 63px;left: 60px;">
                        <text class="sumNum" :style="{fontSize:'18px',width:totalnumb>99?'36px':'30px'}">{{totalnumb>99?'99+':totalnumb}}</text>
                    </div>
                </div>

                <div>
                    <text v-if="totalprice<=0" :style="{fontSize:'35px',color:GLOBAL.tColor}">￥0</text>
                    <div v-else style="flex-direction: column;justify-content: space-around">
                        <text :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.tColor}">￥{{totalprice}}</text>
                        <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}" v-if="shopInfo.psf>0&&car.length>0&&orderType==0">另需配送费￥{{shopInfo.psf}}元</text>
                    </div>
                </div>
            </div>
            <div v-if="shareOrder">
                <text class="addCar" v-if="car&&car.length==0&&orderType==0" :style="{fontSize:GLOBAL.defaultFS}">￥{{shopInfo.qsj}}元起送</text>
                <text class="addCar" v-else-if="car&&car.length==0&&orderType==5" :style="{fontSize:GLOBAL.defaultFS}">￥{{shopInfo.selfDeliveryFreeMoney}}元起购</text>
                <text class="order" v-else-if="shopCar" @click="backToCollage" :style="{fontSize:GLOBAL.defaultFS}">选好了</text>
            </div>
            <!--外卖按钮  -->
            <div v-else-if="orderType==0&&closeButton">
                <text class="addCar" v-if="distance>shopInfo.range" @click.stop="" :style="{fontSize:GLOBAL.defaultFS}">超出配送范围</text>
                <div v-else>
                    <text class="addCar" v-if="distance_price>0 && showPrice==0 && car.length>0" :style="{fontSize:GLOBAL.defaultFS}">还差{{distance_price}}元起送</text>
                    <text class="addCar" v-else-if="car&&car.length==0" :style="{fontSize:GLOBAL.defaultFS}">￥{{shopInfo.qsj}}元起送</text>
                    <text class="order" v-else-if="shopCar" @click="toOrderPage" :style="{fontSize:GLOBAL.defaultFS}">下单</text>
                </div>
            </div>
            <!--到店自取按钮  -->
            <div v-else-if="orderType==5&&closeButton">
                <text class="addCar" v-if="distance>shopInfo.selfDistance" @click.stop="" :style="{fontSize:GLOBAL.defaultFS}">超出配送范围</text>
                <div v-else>
                    <text class="addCar" v-if="distance_price>0 && showPrice==0 && car.length>0" :style="{fontSize:GLOBAL.defaultFS}">还差{{distance_price}}元起购</text>
                    <text class="addCar" v-else-if="car&&car.length==0" :style="{fontSize:GLOBAL.defaultFS}">￥{{shopInfo.selfDeliveryFreeMoney}}元起购</text>
                    <text class="order" v-else-if="shopCar" @click="toOrderPage" :style="{fontSize:GLOBAL.defaultFS}">下单</text>
                </div>
            </div>
            <!--堂食预订按钮  -->
            <div v-else-if="orderType==3&&closeButton">
                <text class="addCar" v-if="distance_price>0 && showPrice==0 && car.length>0" :style="{fontSize:GLOBAL.defaultFS}">还差{{distance_price}}元起订</text>
                <text class="addCar" v-else-if="car&&car.length==0" :style="{fontSize:GLOBAL.defaultFS}">￥{{shopInfo.bookingMoney}}元起订</text>
                <text class="order" v-else-if="shopCar" @click="toReserveClick()" :style="{fontSize:GLOBAL.defaultFS}">填写预订信息</text>
            </div>
            <!--团购代金券按钮  -->
            <div v-else-if="orderType==6||orderType==7">
                <text class="addCar" v-if="car&&car.length==0" :style="{fontSize:GLOBAL.defaultFS}">未选择商品</text>
                <text class="order" v-else-if="shopCar" @click="toOrderPage" :style="{fontSize:GLOBAL.defaultFS}">下单</text>
            </div>
        </div>
        <div v-if="shopCarShow&&tabIndex==0" class="shopGood" @click.stop="popupClick">
            <div style="position: absolute;bottom: 0;left: 0;right: 0;justify-content: flex-end">
                <div class="empty" @click="closeShopCarClick()">
                    <image style="width: 30px;height: 30px;" src="https://image.aftdc.com/images/closeCar.png"></image>
                    <text :style="{fontSize:GLOBAL.smallFS,color:'#999'}">清空购物车</text>
                </div>
                <scroller style="flex-direction:column;max-height: 560px;background-color: #ffffff;">
                    <div class="bBorder" v-for="(item,index) in car">
                        <div class="name-size">
                            <text class="shopCar_goodsName" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.arr.goodsName}} </text>
                            <text class="spec-color" v-if="item.arr.zkGoodsId&&item.arr.preferentialNumb!=0&&item.arr.numb>item.arr.preferentialNumb" :style="{fontSize:GLOBAL.smallFS,color:'#999'}">含{{item.arr.numb*1-item.arr.preferentialNumb*1}}份原价商品</text>

                            <text class="spec-color" v-else-if="item.arr.spec_size||item.arr.spec_taste" :style="{fontSize:GLOBAL.smallFS,color:'#999'}">{{item.arr.goodsAttrName}}</text>

                        </div>


                        <text class="buy-price" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">￥{{item.arr.totalPrice}}</text>
                        <div class="buy-subadd">
                            <image class="addeImgs" src="https://image.aftdc.com/images/sub.png" @click="buysub(index)"></image>
                            <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.arr.numb}}</text>
                            <image class="addeImg" src="https://image.aftdc.com/images/add.png" @click="buyadd(index)"></image>
                        </div>
                    </div>
                </scroller>
                <div class="bBorder" v-if="boxFee>0 && shopType!=5">
                    <!-- 更改 -->
                    <div class="name-size">
                        <text class="myText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">餐盒费</text>
                    </div>
                    <text class="buy-price" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">￥{{boxFee}}</text>
                    <div class="buy-subadd">
                    </div>
                </div>
            </div>
        </div>
        <!--商品详情弹出框-->
        <wxc-mask :height="boxShowHeight"
                  width="650"
                  border-radius="20"
                  duration="200"
                  mask-bg-color="#FFFFFF"
                  :has-animation="hasAnimation"
                  :has-overlay="true"
                  :show-close="false"
                  :show="boxShow"
                  @wxcMaskSetHidden="wxcMaskSetHidden">
            <image class="box_Img" :src="'https://image.aftdc.com/'+box.goodsImg"></image>
            <scroller show-scrollbar="false">
                <text class="box_name shopDetailName" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">{{box.goodsName}}</text>
                <div class="box_activityTips" >
                    <div class='discountDiv' v-if="box.catId==3">
                        <image class='discountIcon' src='https://image.aftdc.com/appBimg/discountDetails.png'></image>
                        <text class='discountText' :style="{fontSize:GLOBAL.smallerFS,color:GLOBAL.tColor}">{{box.discount}}折 {{box.buyNum==-1?'不限量':'限'+box.buyNum+'份'}}</text>
                    </div>

                    <div class='discountDiv' style='width:130px' v-if="box.buyMininum>1">
                        <image class='discountIcon' src='https://image.aftdc.com/appBimg/discountDetails.png'></image>
                        <text class='discountText' :style="{fontSize:GLOBAL.smallerFS,color:GLOBAL.tColor}">{{box.buyMininum}}份起购</text>
                    </div>

                    <div class='fullGiveDiv'  v-if="box.catId==4">
                        <image class='discountIcon' style='margin-top:4px' src='https://image.aftdc.com/appBimg/discountDetails.png'></image>
                        <text class='discountText'   :style="{fontSize:GLOBAL.smallerFS,color:GLOBAL.tColor}">买{{box.buy_num}}份赠{{box.gift_num}}份{{box.gift_goods.goodsName}}</text>
                    </div>
                </div>
                <text class='boxDetails' :style="{fontSize:GLOBAL.smallerFS,color:GLOBAL.dColor}" v-if="box.goodsDesc">{{box.goodsDesc}}</text>
            </scroller>
            <div class="box_bott">
                <div class="box_price">
                    <div class="marketPrice_spec" v-if="box.guige&&box.guige.length>0">
                        <text class="box_sale" :style="{fontSize:GLOBAL.biggerFS}" >￥{{box.marketPrice}}</text>
                        <text :style="{fontSize:GLOBAL.smallFS,color:'#999',marginBottom:'3px'}" >起</text>
                    </div>
                    <text class="box_sale" :style="{fontSize:GLOBAL.biggerFS}" v-else >￥{{box.shopPrice}}</text>
                    <text  class="marketPriceText" :style="{fontSize:GLOBAL.smallFS,color:'#999'}" v-if="box.shopPrice!=box.marketPrice">￥{{box.marketPrice}}</text>
                    <text style="font-size: 35px;color:#999;text-decoration: line-through" v-else> </text>
                </div>
                <div v-if="closeButton">
                    <text class="box_okbtn box_btn"  v-if="(box.guige&&box.guige.length>0)||(box.guigeAttr&&box.guigeAttr.length>0)" @click="choiceGuigeClick()" :style="{fontSize:GLOBAL.smallFS}">选规格</text>
                    <text class="box_okbtn box_btn" v-else-if="box.numb==0" @click="box.goodsStock==0||box.todayGoodsStock==0?'':ok()" :style="{fontSize:GLOBAL.smallFS,opacity:box.goodsStock==0||box.todayGoodsStock==0||car.length>0&&box.groupId!=car[0].arr.groupId?'0.3':'1'}">加入购物车</text>
                    <div style="flex-direction: row;align-items: center;margin-right: 20px;height: 60px" v-else>
                        <image  class="addImgs" src="https://image.aftdc.com/images/sub.png" @click="specBoxSub()"></image>
                        <text  style="font-size: 35px">{{box.numb}}</text>
                        <image  class="addImg" src="https://image.aftdc.com/images/add.png" @click="ok()"></image>
                    </div>
                </div>
            </div>
            <text class="del" @click="boxHide">×</text>
        </wxc-mask>
        <!--砍价弹出框-->
        <wxc-mask height="850"
                  width="600"
                  border-radius="10"
                  duration="200"
                  mask-bg-color="#FFFFFF"
                  :has-animation="hasAnimation"
                  :has-overlay="true"
                  :show-close="false"
                  :show="bargainShow"
                  @wxcMaskSetHidden="wxcMaskSetHidden">
            <image style="width: 600px;height: 450px;" :src="'https://image.aftdc.com/'+bargainBox.goodsImg"></image>
            <div @click="closeClick" style="position: absolute;top: 10px;right: 10px;">
                <text class="close">X</text>
            </div>
            <div style="align-items: center;margin-top: 20px;">
                <text style="font-size: 35px;color: #333;width:550px;lines:1;">原味版烧鸡腿包</text>
            </div>
            <div class="wordLR-degree">
                <div class="price" :style="{fontSize:GLOBAL.defaultFS}">
                    <text style="font-size: 26px">￥{{bargainBox.start}}</text>
                    <text style="font-size: 26px">￥{{bargainBox.end}}</text>
                </div>
                <div style="height: 100px;width: 600px;flex-direction: row;justify-content: center;position: relative" ref="parentLine">
                    <div style="position: relative">
                        <div class="degreeBox"></div>
                        <div class="finish" ref="widthLine" :style="{width:bargainBox.bargainType==2?480-480*bargainBox.percent+'px':'480px'}"></div>
                    </div>
                    <div class="degreeL">
                        <div class="circle"></div>
                    </div>
                    <div class="degreeC"  ref="leftLine" :style="{right:bargainBox.bargainType==2?480*bargainBox.percent+45+'px':'45px'}">
                        <div class="circle"></div>
                    </div>
                    <div class="degreeR">
                        <div class="circle"></div>
                    </div>



                    <div class="result" v-if="bargainBox.result"  ref="priceLine" :style="{right:bargainBox.bargainType==2?480*bargainBox.percent+5+'px':'5px'}">
                        <text :style="{fontSize:GLOBAL.defaultFS,color:'#ee7942'}">￥{{bargainBox.result}}</text>
                    </div>
                    <div class="arrow"  v-if="bargainBox.result"  ref="arrowLine" :style="{right:bargainBox.bargainType==2?480*bargainBox.percent+52+'px':'52px'}"></div>

                </div>

            </div>
            <text class="BargainBut" @click="bargainBox.result?ok():bargainButClick()" :style="{fontSize:GLOBAL.biggerFS}">{{bargainBox.result?'加入购物车':'砍价'}}</text>

            <div class="modelBack" v-if="bargainTipsShow" @click="">
                <div class="model">
                    <text class="model-title">{{bargainTipsPrice}}</text>
                    <text class="model-txt">力道虽好，技术欠佳</text>
                    <text class="model-but" @click="bargainTipsSure" :style="{color:GLOBAL.tColor}">确定</text>
                </div>
            </div>

        </wxc-mask>
        <!--优惠卷弹出框-->
        <wxc-mask height="880"
                  width="610"
                  duration="200"
                  mask-bg-color="rgba(255,255,255,0)"
                  :has-animation="hasAnimation"
                  :has-overlay="true"
                  :show-close="true"
                  :show="couponShow"
                  @wxcMaskSetHidden="wxcMaskSetHidden">
            <image  class="couponImg" src="https://image.aftdc.com/appBimg/bg_coupon.png"></image>
            <div class="couponContent">
                <div class="couponContent_top">
                    <text class="halfTopWord">成功领取</text>
                    <!--<text class="halfTopNub">110</text>-->
                    <!--<text class="halfTopWord">元优惠券</text>-->
                </div>
                <div class="couponContent_buttom">
                    <scroller class="couponScroller">
                        <div class="allCouponDiv" v-for="(item,index) in redPackets">
                            <image class="couponBoxImg" src="https://image.aftdc.com/appBimg/icon_yhq.png"></image>
                            <div class="couponDetailContent">
                                <div class="couponDetailPrice">
                                    <text class="rmbText" >￥</text>
                                    <text class="detailPriceText">{{item.piece}}</text>
                                </div>
                                <div class="couponDetailTip">
                                    <text class="useCouponText">满{{item.money}}可用</text>
                                    <text class="couponTime">有效期{{item.end_time}}</text>
                                </div>
                            </div>
                        </div>
                    </scroller>
                    <div class="boxBottom">
                        <div class="boxBottomLine"></div>
                        <text class="boxBottomTips">可与其它优惠同享</text>
                        <div class="boxBottomLine"></div>
                    </div>
                </div>
            </div>

        </wxc-mask>
        <wxc-popover ref="wxc-popover"
                     :buttons="btns"
                     :position="popoverPosition"
                     :arrowPosition="popoverArrowPosition"
                     @wxcPopoverButtonClicked="popoverButtonClicked"></wxc-popover>

        <image class="zanStyle"  src="https://image.aftdc.com/images/zan.png" ref="shopZan"></image>
        <!--查看大图弹框-->
        <wxc-popup popup-color="#000"
                   :show="enlargeImageShow"
                   @wxcPopupOverlayClicked="hide"
                   ref="wxcPopup_enlargeImage"
                   pos="right"
                   width="750">
            <div class="popupBox" >
                <slider class="enlargeImageSlider"  auto-play="false" :index="firstShowImg" >
                    <div class="enlargeImageListDiv" @click="hideEnlargeImage" :style="{height:viewportHeight+'px'}" v-for="(item, index) in enlargeImageList" >
                        <image :style="{width:item.width,height:item.height}" @load="resize(index,$event)"   :src="'https://image.aftdc.com/'+item.img"></image>
                    </div>
                    <indicator class="indicator"></indicator>
                </slider>
            </div>
        </wxc-popup>
        <!--砍价提示弹框  -->
        <!--购物车详情弹出框-->
        <!--<wxc-popup popup-color="#fff"-->
        <!--:show="shopCarShow"-->
        <!--@wxcPopupOverlayClicked="popupOverlayBottomClick"-->
        <!--pos="bottom"-->
        <!--:height="shopCarPopupHeight">-->
        <!--<div  class="shopGood" ref="shopCarShow">-->
        <!--<div class="empty" @click="emptyClick">-->
        <!--<image style="width: 40px;height: 40px;" src="https://image.aftdc.com/images/closeCar.png"></image>-->
        <!--<text style="font-size: 30px;color: #999">清空购物车</text>-->
        <!--</div>-->
        <!--<scroller style="height: 560px;background-color: #ffffff;">-->
        <!--<div class="bBorder" v-for="(item,index) in car">-->
        <!--<text style="font-size: 35px;color: #333;max-width: 350px;text-overflow: ellipsis;lines:1">{{item.arr.goodsName}} </text>-->
        <!--<div style="flex-direction: row;align-items: center">-->
        <!--<text style="font-size: 35px;color: #333;margin-right: 80px;">￥{{item.arr.shopPrice}}</text>-->
        <!--<image class="addeImgs" src="https://image.aftdc.com/images/sub.png" @click="goodSubClick(index)"></image>-->
        <!--<text style="font-size: 35px">{{item.arr.numb}}</text>-->
        <!--<image class="addeImg" src="https://image.aftdc.com/images/add.png" @click="goodAddClick(index)"></image>-->
        <!--</div>-->
        <!--</div>-->
        <!--</scroller>-->
        <!--</div>-->
        <!--</wxc-popup>-->
        <toast ref="toast"></toast>
        <share ref="share"></share>
    </div>

    <!--</div>-->
</template>

<script>
    const GLOBAL = require('@/Global.vue');
    import { WxcMask,WxcPopup,WxcPopover } from 'weex-ui';
    import Toast from './Toast.vue';
    import Share from './Share.vue';
    const animation = weex.requireModule('animation')
    const modal = weex.requireModule('modal')
    const dom = weex.requireModule('dom');
    const post = weex.requireModule('stream');
    const event=weex.requireModule('event')
    const navigator = weex.requireModule('navigator');
    export default {
        components: { WxcMask,WxcPopup,WxcPopover,Toast,Share },
        name: 'App',
        data() {
            return {
                backImgToggle: 0,//头部返回图片判断
                activeTab: 0,//轮播图
                tabIndex: 0,//切换
                shopCarShow:false,//购物车详情弹出框判断
                shopCarPopupHeight:'',//购物车详情弹出框高度
                specBoxShow:false,//规格详情弹出框判断

                catNameIndex: 0,//分类



                //点赞动画
                rotateRight:{styles: {

                        transform: 'rotate(10deg) scale(2.3, 2.3)',

                    },
                    duration: 40,
                    timingFunction: 'linear',
                    delay: 0
                },
                rotateRecover:{
                    styles: {

                        transform: 'rotate(0deg) scale(2.3, 2.3)',

                    },
                    duration: 40, //ms
                    timingFunction: 'linear',
                    delay: 0 //ms
                },
                rotateLeft:{
                    styles: {

                        transform: 'rotate(-10deg) scale(2.3, 2.3)',

                    },
                    duration: 40, //ms
                    timingFunction: 'linear',
                    delay: 0 //ms
                },
                btns:[
                    {
                        icon: 'https://image.aftdc.com/images/share.png',
                        text:'分享商家',
                        key:'key-scan'
                    },
                    {
                        icon: 'https://image.aftdc.com/appBimg/notice_icon.png',
                        text:'联系商家',
                        key:'key-qrcode'
                    },
                    {
                        icon: 'https://image.aftdc.com/images/icon_shopReport.png',
                        text:'举报商家',
                        key:'key-help'
                    },
                ],
                popoverPosition:{x:-11,y:60},
                popoverArrowPosition:{pos:'top',x:-11},
                orderHistory: [{name: '哈哈哈', time: '15天前'}, {name: '哦哦哦', time: '15天前'}, {name: '呵呵呵', time: '15天前'},{name: '呵呵呵', time: '15天前'},{name: '呵呵呵', time: '15天前'},{name: '呵呵呵', time: '15天前'},{name: '呵呵呵', time: '15天前'},{name: '呵呵呵', time: '15天前'},{name: '呵呵呵', time: '15天前'},{name: '呵呵呵', time: '15天前'},{name: '呵呵呵', time: '15天前'},],

                //砍价弹出框

                hasAnimation: true,
                //砍价例子数据
                bargainPrice:{minPrice:'5.00',maxPrice:'15.00',bargainSurePrice:'',bargainPrice:'',percent:'',bargain:0,},//bargainSurePrice:砍后的价格；percent：随机百分比;bargain:0为未砍价；1为第一次砍价；2为砍过价
                //砍价提示框
                bargainTipsShow:false,

                scrolls: 1,//历史订单滚动位置判断
                scrollsTransform:false,//历史订单滚动样式判断


                couponShow:false,//优惠卷弹出框
                shopId:1020467,
                //接口数据
                shopInfo:{},//商店基本信息
                lunboOrders:[],//商店轮播订单信息
                envImg:'',//店铺环境图片
                Von: [],
                distance:'',//距离,用于比较
                serviceStartTime:'',//商家最早营业时间
                serviceEndTime:'',//商家最晚结束营业商家
                orderType:0,//店铺类型
                shopType:1,//店铺类型
                requiredCatId:'',//必选的catId
                requiredName:'',//必选的catName
                //预订时间
                presetTime: [],
                presetStartTime: '',
                restTimeBookForward: false,
                closeButton: true, //是否显示所有添加商品的按钮

                //团购
                type:0,

                //紅包
                redPackets: '',
                redPacketsIdArr: '',
                orderRedPackets: false,
                redPacketslen: 0,
                redPacketsSum: '',
                redPacketsState: false,
                redPacketsPresentNub: false,
                OneRedPacketsMoney: '',
                //紅包
                pinglun:'',//评论
                changepl:[],//评论点赞保存的数据，接接口用
                //接口数据
                //商品详情弹出框
                boxShow:false,//图片弹出框判断
                boxShowHeight:810,
                box:{},//选中的商品的数据
                goodsType:'',
                spec_taste:[],
                car: [],//购物车
                boxFees:0,//餐盒费
                start:0,
                showPrice:0,
                totalprice:0,//总价
                totalnumb:0,//总数
                discount:true,//是否能享受优惠
                tipsIfor:[],//满减的数据
                distance_price:0,//差多少钱起送
                shopCar: false,
                specTasteName:'',

                specBox:'',
                // shopCarPop:false,//控制是否能点击弹出购物车详情框
                bargainBox: {},//砍价的数据
                bargainMark: false,//砍价商品的标识
                bargainShow: false,//砍价框
                prans:'',//点击砍价储存的信息
                bargainTipsPrice:0,//砍价砍了的价格


                boxStyle: {
                    top:'260',
                    height:'',
                    transform:'',
                    transitionDuration:'0.0',
                },
                boxStyleTop:-260,
                x: 0,
                y: 0,
                startX :0,
                startY : 0,
                topDetails:true,//是否下滑显示商家详情
                top_activityHeight:'',//下滑的活动高度
                toClick:false,//限制只有执行了ontouchmove才会执行ontouchend
                scrollTo:false,//是否点击菜单自动滚动
                scrollerToggle:'',//第几个滚动的标识
                offsetY:[],//纪录每个滚动的offsetY
                loadinging:false,

                pageBack:false,
                //放大图片
                viewportHeight:'',//屏幕高度
                enlargeImageShow:false,
                firstShowImg:0,//打开的图片下标
                enlargeImageList:[],

                //评论
                pingLunShow:[],//显示的评论
                ratingSelect:0,//评价切换
                allPLPage:0,//全部
                photoPLPage:0,//有图
                scorePLPage:0,//评分
                noDataOfPinLun:false,//上拉加载还有没有数据
                allPf:'',//外卖综合评分

                //通用
                shopId:'',
                userId:0,
                token:'',
                imei:'',
                latitude:'',
                longitude:'',
                shareOrder:false,//是否从拼单进来
                visibility:'hidden',
            }
        },
        created() {
            var that=this
            that.visibility='hidden';
            that.token = weex.config.token;
            that.imei = weex.config.imei;
            that.userId = weex.config.userId;
            that.longitude = weex.config.longitude;
            that.latitude = weex.config.latitude;
            that.shopId=JSON.parse(weex.config.param).shopId
            var orderType=JSON.parse(weex.config.param).orderType
            var shopType=JSON.parse(weex.config.param).shopType
            that.orderType=orderType
            that.shopType=shopType
            if(JSON.parse(weex.config.param).shareOrder){
                that.shareOrder=JSON.parse(weex.config.param).shareOrder
            }


            that.getShopInfo();//获取店铺信息、活动、轮播订单
            that.getPl(0);//获取全部评论


            that.textCarousel();//开始滚动轮播订单


        },
        mounted(){
            var that=this

            setTimeout(function () {
                dom.getComponentRect('viewport', option => {
                    that.viewportHeight=option.size.height
                    that.boxStyle.height = option.size.height-90
                    // modal.toast({message:'log'+option.size.height})
                })

            },0)
            var that=this
            that.visibility='visible';
        },
        methods: {
            //获取店铺信息、活动、轮播订单
            getShopInfo(){
                var that=this
                var orderType=that.orderType
                var shopType=that.shopType
                var param='&longitude='+that.longitude+'&latitude='+that.latitude+'&userId='+that.userId+'&shopId='+that.shopId
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/userapp/Index/shopInfo',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                }, function (res) {
                    if(res.data.res==1){
                        var shopInfo=res.data.data.shopInfo;
                        event.save('shopInfo',JSON.stringify(shopInfo));
                        that.shopInfo=shopInfo;
                        that.serviceStartTime=shopInfo.serviceTime[0].serviceStartTime;
                        that.serviceEndTime=shopInfo.serviceTime[shopInfo.serviceTime.length-1].serviceEndTime;
                        if(res.data.data.lunbo){
                            that.lunboOrders=res.data.data.lunbo
                        }
                        if(that.lunboOrders.length<=0){
                            that.boxStyle.top='170px'
                            that.boxStyleTop=-170
                        }
                        //处理距离,转化为m用于比较
                        var distance=shopInfo.distance.replace('km','')
                        that.distance = Number(distance)*1000
                        that.envImg=res.data.data.envImg//商家环境图片
                        //获取处理红包优惠卷的信息
                        if(res.data.data.hongbao.length>0){
                            that.hongbaoAndConpou(res.data.data.hongbao);
                        }else{
                            that.orderRedPackets=false
                        }

                        if (shopType == 6||shopType==8) { //如果是团购优惠卷
                            that.distance_price=0//差多少钱起送
                        } else {
                            that.distance_price = shopInfo.qsj
                        }
                        //商家休息中的判断
                        if (shopInfo.dpzt == 2 && ((shopInfo.reserve && orderType == 0) || (shopInfo.selfReserve && orderType == 5))) {
                            that.isOpen();
                        }

                        // 商家是否开启了堂食预订里面的休息时间支持预订
                        var date = new Date()
                        var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
                        var minutes = date.getMinutes() < 10 ? '0' + date.getHours() : date.getMinutes()
                        var nowTime = hours + ':' + minutes
                        var forward = false
                        for (var i = 0, len = shopInfo.serviceTime.length; i < len; i++) {
                            if (nowTime > shopInfo.serviceTime[i].serviceStartTime && nowTime < shopInfo.serviceTime[i].serviceEndTime) {
                                forward = true
                                break;
                            }
                        }
                        if (forward || shopInfo.restTimeBook === 1) {
                            that.restTimeBookForward=true
                        }

                        //控制显示隐藏添加商品的按钮
                        var closeButton = that.closeButton
                        if (orderType != 3 && shopType != 6 && shopType != 8) {
                            if (shopInfo.dpzt == 0 || (((!shopInfo.reserve && orderType == 0) || (!shopInfo.selfReserve && orderType == 5)) && shopInfo.dpzt == 2)) {
                                closeButton = false
                            }
                        } else if (that.shopType != 6 && that.shopType != 8) {
                            if (shopInfo.dpzt == 0 || !that.restTimeBookForward) {
                                closeButton = false
                            }
                        }
                        if((shopType == 1&&that.distance>=shopInfo.range)||(shopType == 2&&that.distance>=shopInfo.selfDistance)){
                            closeButton = false
                        }
                        that.closeButton=closeButton
                        that.getCaiDan();//获取菜单信息

                    }
                })
            },
            //获取菜单信息
            getCaiDan(){
                var that=this
                var shopType=that.shopType
                var orderType=that.orderType
                if (shopType == 1 || shopType == 2 || shopType == 3) {
                    //需要活动商品
                    var activityGoods = 1
                } else {
                    var activityGoods = 0
                }
                if (orderType == 6||orderType == 7) {
                    if (orderType == 6) { //判断是否是团购或代金券
                        var type = 1
                    } else {
                        var type = 2
                    }
                    that.type=type
                    var param='&type='+type+'&shopId='+that.shopId
                    var url = 'https://www.aftdc.com/userapp/Index/tgCaidan'
                } else {
                    var param='&activityGoods='+activityGoods+'&shopId='+that.shopId
                    var url = 'https://www.aftdc.com/userapp/Index/caidan'
                }

                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    url: url,
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                }, function (res) {
                    if(res.data.res==1){
                        //如果该店铺有菜单
                        if(res.data.data){
                            var arr = res.data.data
                            for (var i = 0,len=arr.length; i < len; i++) {
                                arr[i].allNumb=0
                                for (var j = 0,jLen=arr[i].distop.length; j < jLen; j++) {
                                    //给活动商品添加一个标识
                                    arr[i].distop[j].shopCatId2 = arr[i].catId
                                }
                            }
                            that.Von=arr
                            that.car=[]
                            // 设置必须分类的catId
                            if (orderType != 6&&orderType != 7) {
                                for (var i = 0, len = arr.length; i < len; i++) {
                                    if (arr[i].required === 1) {
                                        that.requiredCatId=arr[i].catId
                                        that.requiredName=arr[i].catName
                                        break;
                                    }
                                }
                            }
                            var orderFood=event.find(that.shopId+'orderFood'+that.shopType)
                            if(orderFood){
                                var orderFood = JSON.parse(orderFood);
                                that.foodStorageSync(orderFood)
                            }
                        }
                    }
                })

            },
            scrollerAppear(e,index){
                var that=this
                var boxStyleTop=that.boxStyleTop
                if(e.direction=='down'&&!that.scrollTo&&that.y==boxStyleTop){
                    that.catNameIndex=index
                    dom.scrollToElement(that.$refs.secScroller[index])
                }

            },
            scrollerDisappear(e,index){
                var that=this
                var boxStyleTop=that.boxStyleTop
                if(e.direction=='up'&&!that.scrollTo&&that.y==boxStyleTop){
                    that.catNameIndex=index+1
                    dom.scrollToElement(that.$refs.secScroller[index+1])
                }

            },
            scrollHandler: function(e,toggle) {
                var that=this

                that.offsetY[toggle] = e.contentOffset.y;
            },
            ontouchend(event,toggle) {
                var that=this
                if(that.toClick){

                    if(that.y > 450) {
                        that.topDetails=false
                    } else if(that.y < 450&&this.y >0)  {
                        that.topDetails=true

                    }
                    that.doAnimation();
                    var boxStyleTop=that.boxStyleTop
                    if(that.y>boxStyleTop&&that.offsetY[toggle]>-10){
                        if(toggle==0){
                            dom.scrollToElement(that.$refs.friScroller[0])
                        }else if(toggle==1){
                            dom.scrollToElement(that.$refs.secScroller[0])
                        }

                    }
                }

            },
            ontouchmove(event,toggle) {
                var self = this;
                var boxRef = this.$refs.boxs;
                self.toClick=true
                var screenY=parseFloat(event.changedTouches[0].screenY)
                var changeScreenY=self.startY-screenY
                var y = self.y +  screenY - self.startY;
                var boxStyleTop=self.boxStyleTop
                if ((self.y ==boxStyleTop &&self.offsetY[toggle]<=-10)||(self.y>boxStyleTop&&self.offsetY[toggle]<=-10&&changeScreenY<0)){
                    self.startY = screenY;
                    self.scrollerToggle=toggle
                    return false;
                }
                if(y>=0){
                    self.y = y;
                    self.topAnimationChange()



                }
                else if (y>=boxStyleTop) {
                    self.y = y;
                    // self.boxStyle.top-=y
                }else{
                    self.y = boxStyleTop
                }

                animation.transition(boxRef, {
                    styles: {
                        transform:'translateY(' + self.y +  'px)'
                    }
                })
                self.startY = screenY;

            },
            ontouchstart (event,toggle) {

                var self = this;
                self.boxStyle.transitionDuration = '0';
                self.startY = parseFloat(event.changedTouches[0].screenY);
                self.toClick=false;

            },
            //移动时头部动画效果
            topAnimationChange(){
                var self=this
                var  y=self.y
                dom.getComponentRect(self.$refs.top_activity, option => {

                    self.top_activityHeight = option.size.height
                    // modal.toast({message:'log'+option.size.height})

                })
                var  top_activityHeight=self.top_activityHeight;
                // animation.transition(self.$refs.topBody_message, {
                //     styles: {
                //         opacity:1-y/300
                //     }
                // })
                if(self.orderRedPackets&&y>248&&y<278+top_activityHeight){

                    animation.transition(self.$refs.top_activity, {
                        styles: {
                            opacity:y/(278+top_activityHeight)
                        },
                    })
                }else if(!self.orderRedPackets&&y>20&&y<50+top_activityHeight){
                    animation.transition(self.$refs.top_activity, {
                        styles: {
                            opacity:y/(50+top_activityHeight)
                        },
                    })
                }
                if(self.orderRedPackets){//红包
                    if(y>88&&y<=248){
                        // for(var i in self.redPackets){
                        animation.transition(self.$refs.redPackets_small, {
                            styles: {
                                transform:' scale('+(y/248)+')'
                            },
                        })
                        for(var i in self.redPackets){
                            animation.transition(self.$refs.ref_smallYhqbox[i], {
                                styles: {
                                    opacity:(148-y)/100
                                },
                            })
                            animation.transition(self.$refs.ref_smallGet[i], {
                                styles: {
                                    opacity:(148-y)/100
                                },
                            })
                        }

                    }
                    if(y>248&&y<=488){
                        animation.transition(self.$refs.redPackets_small, {
                            styles: {
                                transform:' scale(1)'
                            },
                        })
                        for(var i in self.redPackets){
                            animation.transition(self.$refs.ref_smallYhqbox[i], {
                                styles: {
                                    opacity: 0
                                },
                            })
                            animation.transition(self.$refs.ref_smallGet[i], {
                                styles: {
                                    opacity: 0
                                },
                            })
                            animation.transition(self.$refs.ref_yhqbox[i], {
                                styles: {
                                    opacity:(y-248)/200
                                },
                            })
                            animation.transition(self.$refs.ref_get[i], {
                                styles: {
                                    opacity:(y-248)/200
                                },
                            })
                        }
                    }

                }


                // if(y>50&&y<330){
                //     var translateNumber=y-50
                //     animation.transition(self.$refs.topBody_img, {
                //         styles: {
                //             transform:'translateX(' + translateNumber +  'px)'
                //         }
                //     })
                // }
            },
            doAnimation(){
                var boxRef = this.$refs.boxs;
                var self = this;
                var final_y;
                if (self.y>=0) {
                    if(!self.topDetails) {
                        final_y = self.boxStyle.height-Number(self.boxStyle.top);
                        // self.topDetails=true
                    } else  {
                        final_y = 0;
                        // self.topDetails=false
                        self.topAnimationReSet()

                    }
                    animation.transition(boxRef, {
                        styles: {
                            transform:'translateY(' + final_y +  'px)'
                        },
                        duration:100
                    },function () {
                        if(!self.topDetails){
                            self.topAnimationComplate()
                        }
                    })

                    self.y = final_y;
                }
            },
            //
            topAnimationComplate(){
                var that=this
                animation.transition(that.$refs.top_activity, {
                    styles: {
                        opacity:1
                    },
                })
                if(that.orderRedPackets) {//红包
                    animation.transition(that.$refs.redPackets_small, {
                        styles: {
                            transform:' scale(1)'
                        },
                    })
                    for (var i in that.redPackets) {
                        animation.transition(that.$refs.ref_smallYhqbox[i], {
                            styles: {
                                opacity: 0
                            },
                        })
                        animation.transition(that.$refs.ref_smallGet[i], {
                            styles: {
                                opacity: 0
                            },
                        })
                        animation.transition(that.$refs.ref_yhqbox[i], {
                            styles: {
                                opacity: 1
                            },
                        })
                        animation.transition(that.$refs.ref_get[i], {
                            styles: {
                                opacity: 1
                            },
                        })
                    }
                }
            },
            //复原头部动画效果
            topAnimationReSet(){
                var self=this
                // animation.transition(self.$refs.topBody_message, {
                //     styles: {
                //         opacity:1
                //     },
                //     duration:600
                // })
                animation.transition(self.$refs.top_activity, {
                    styles: {
                        opacity:0
                    },
                    duration:600
                })
                if(self.orderRedPackets) {//红包
                    animation.transition(self.$refs.redPackets_small, {
                        styles: {
                            transform: ' scale(0.3)'
                        },
                        duration: 600
                    })
                    for (var i in self.redPackets) {
                        animation.transition(self.$refs.ref_smallYhqbox[i], {
                            styles: {
                                opacity: 1
                            },
                            duration: 600
                        })
                        animation.transition(self.$refs.ref_smallGet[i], {
                            styles: {
                                opacity: 1
                            },
                            duration: 600
                        })
                        animation.transition(self.$refs.ref_yhqbox[i], {
                            styles: {
                                opacity: 0
                            },
                            duration: 600
                        })
                        animation.transition(self.$refs.ref_get[i], {
                            styles: {
                                opacity: 0
                            },
                            duration: 600
                        })
                    }
                }
            },
            textCarousel() {
                var that = this
                setInterval(() => {
                    var testEl = this.$refs.test;
                    var changeTl = 'translate(0px,-' + 100 * that.scrolls + 'px)'
                    animation.transition(testEl, {
                        styles: {
                            transform: changeTl,
                        },
                        duration: 800, //ms
                        timingFunction: 'ease',
                        needLayout: false,
                        delay: 0 //ms
                    }, function () {
                        if(that.scrolls==that.lunboOrders.length){
                            that.lunboOrders.unshift(that.lunboOrders[that.lunboOrders.length - 1])
                            that.lunboOrders.pop()
                            that.scrollsTransform=true
                            that.scrolls = 0
                        }

                    })
                    // that.orderHistory.shift()
                    that.scrollsTransform=false
                    that.scrolls = that.scrolls + 1


                }, 2000)


            },
            foodStorageSync(orderFood) {
                var that = this
                var car = that.car
                var Von = that.Von

                for (var i in orderFood) {
                    for(var j in Von){
                        for(var k in Von[j].distop){
                            if(orderFood[i].goodsId==Von[j].distop[k].goodsId&&orderFood[i].type==Von[j].distop[k].type){
                                orderFood[i].mark='a'+j+'b'+k
                                break;
                            }
                        }

                    }
                    if(orderFood[i].mark){
                        var obj = {
                            arr: orderFood[i],
                            mark: orderFood[i].mark
                        }
                        var mark = orderFood[i].mark //获取弹出盒子的弹出哪件商品标识
                        var a = mark.substring(mark.indexOf("a") + 1, mark.indexOf("b"))
                        var b = mark.substring(mark.indexOf("b") + 1)
                        if(Von[a].distop[b].goodsStock!=0){//判断是否有库存
                            car.push(obj)

                            if (!Von[a].distop[b].numb) {
                                Von[a].distop[b].numb = 0
                            }
                            Von[a].distop[b].numb += Number(orderFood[i].numb)
                            Von[a].allNumb+=Number(orderFood[i].numb)
                        }
                    }

                }

                that.car=car
                that.Von=Von
                for(var i in car){
                    if(car[i].arr.zkGoodsId){
                        var mark = car[i].mark //获取弹出盒子的弹出哪件商品标识
                        var a = mark.substring(mark.indexOf("a") + 1, mark.indexOf("b"))
                        var b = mark.substring(mark.indexOf("b") + 1)
                        that.zkPrice(a,b)
                    }

                }

                that.sum()
                // }
            },
            //图片弹出框
            boxShowClick(index,foodIndex,type) {
                var that=this
                if(that.toClick){
                    return false
                }

                var Von = that.Von
                //如果为砍价
                if (Von[index].catId == 1) {
                    that.bargainShowClick(index, foodIndex);
                    return false
                }

                //
                var box = JSON.parse(JSON.stringify(Von[index].distop[foodIndex]))
                var mark = 'a' + index + 'b' + foodIndex
                box.catId = Von[index].catId
                box.mark = mark
                //规格
                that.box=box
                that.goodsType=type
                that.boxShow=true
                if((box.catId==3||box.catId==4||box.buyMininum>1)&&box.goodsDesc){
                    that.boxShowHeight=900
                }else if(box.catId==3||box.catId==4||box.buyMininum>1||box.goodsDesc){
                    that.boxShowHeight=850
                }else{
                    that.boxShowHeight=810
                }

            },
            //领取红包
            onRedRacketsReceive(index,id){

                var that=this
                if(that.userId==0) {
                    that.toLogin()
                    return false
                }
                redPackets=that.redPackets;
                const toast=that.$refs.toast;
                if(redPackets[index].isGet==0){
                    var param=that.GLOBAL.sign(that.token,that.imei)
                    param+='&id='+id
                    post.fetch({
                        method: 'POST',
                        type: 'json',
                        body: param,
                        url: 'https://www.aftdc.com/userapp/Index/getHongbao',
                        headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    }, function (res) {
                        console.log(id+JSON.stringify(res))
                        if(res.data.res==1){

                            that.$set(redPackets[index],'isGet',1)
                            toast.editContent(res.data.info)

                        }

                    })


                }
            },
            //下滑显示详情
            onTopDetails(){
                var that=this
                that.topDetails=!that.topDetails
                that.doAnimation()


            },

            //获取处理红包优惠卷的信息
            hongbaoAndConpou(redPackets) {
                var that = this
                //判定红包
                var redPacketsIdArr = that.redPacketsIdArr

                var orderRedPackets = true
                var redPacketslen = redPackets.length
                //计算优惠券总金额
                var redPacketsSum = 0
                for (var i in redPackets) {
                    redPacketsSum += Number(redPackets[i].piece)
                    redPacketsIdArr += redPackets[i].id + ","
                    if (!redPackets[i].type) {
                        var redPacketsState = true;
                    } else {
                        if (!redPacketsState) {
                            var redPacketsState = false;
                        }
                    }
                }

                that.redPacketsSum=redPacketsSum
                that.redPacketsIdArr=redPacketsIdArr
                that.redPacketsState=redPacketsState
                that.redPackets=redPackets

                //优惠券长度
                if (redPacketslen > 1) {
                    that.redPacketsPresentNub=true

                } else {
                    var OneRedPacketsMoney = redPackets[0].money
                    that.redPacketsPresentNub=false
                    that.OneRedPacketsMoney=OneRedPacketsMoney

                }


                that.orderRedPackets=orderRedPackets;
                that.redPacketslen=redPacketslen

            },
            choiceGuigeClick(){
                var that=this
                var box=that.box
                var mark = box.mark;
                var a = mark.substring(mark.indexOf("a") + 1, mark.indexOf("b"))
                var b = mark.substring(mark.indexOf("b") + 1)
                that.boxShow=false
                that.specBoxShowClick(a,b)
            },
            //规格详情弹出框
            specBoxShowClick(index,foodIndex) {
                var that=this

                //对应左边类目
                var Von = that.Von
                var box = JSON.parse(JSON.stringify(Von[index].distop[foodIndex]))
                var mark = 'a' + index + 'b' + foodIndex
                box.mark = mark

                //规格
                box.spec_size=''
                box.spec_taste=''
                that.box=box
                that.specBoxShow=true
                //显示规格弹出框并自动选择所有选项的第一个
                if(box.guige.length>0){
                    for(var i in box.guige){
                        if(box.guige[i].stock>0||box.guige[i].stock==-1){
                            that.sizeClick(i,box.guige[i].guigeName)
                            break;
                        }

                    }

                }

                for (let i in box.guigeAttr){
                    that.tasteClick(i,box.guigeAttr[i].attrContent[0],0)

                }
            },
            //获取点击的规格
            sizeClick(index,val){
                var that=this
                var box = that.box //获取弹出盒子的数据
                // var goodsId = box.goodsId
                that.$set(that.box,'choose',index) //点击变色

                var mark = box.mark;
                var a = mark.substring(mark.indexOf("a") + 1, mark.indexOf("b"))
                var b = mark.substring(mark.indexOf("b") + 1)
                var Von = that.Von
                box.shopPrice = Von[a].distop[b].guige[index].price
                box.spec_size = val
                that.checkBox(box)
            },
            tasteClick(index,val,attrIndex){
                var that=this
                var box = that.box //获取弹出盒子的数据
                that.$set(that. box.guigeAttr[index],'choose',attrIndex)//点击变色
                that.spec_taste[index] = val
                box.spec_taste = ''
                var specTasteName=''
                for (var i in box.guigeAttr){
                    if (that.spec_taste[i]){
                        box.spec_taste += that.spec_taste[i]
                        if( box.spec_size){
                            specTasteName+=','+that.spec_taste[i]
                        }else{
                            specTasteName=that.spec_taste[i]
                        }

                        if(i!=box.guigeAttr.length-1) {
                            box.spec_taste += "+"
                        }
                    }

                }
                that.specTasteName=specTasteName
                that.checkBox(box)
            },
            // 判断是否选好了
            checkBox:function(box){
                var that=this
                // console.log(box)
                // if (box.guige) {
                //     if (!box.choose && box.choose!==0) {
                //         box.nochooseGG = true;
                //     } else {
                //         box.nochooseGG = false
                //     }
                // }
                // if (box.guigeAttr) {
                //     for (var i in box.guigeAttr) {
                //         if (!box.guigeAttr[i].choose && box.guigeAttr[i].choose !== 0) {
                //             box.nochooseAttr = true;
                //             break;
                //         }else{
                //             box.nochooseAttr = false
                //         }
                //     }
                // }
                var car=that.car
                for(let i in car){
                    if(car[i].arr.goodsId==box.goodsId&&car[i].arr.spec_size==box.spec_size&&car[i].arr.spec_taste==box.spec_taste){
                        that.box.numb=car[i].arr.numb
                        break
                    }else{
                        that.box.numb=0
                    }

                }


                that.box=box

            },
            //选好了
            ok: function () {
                var that=this
                const toastSpecBox=that.$refs.toastSpecBox
                const toast=that.$refs.toast
                var box = that.box
                var car =that.car


                if (car.length>0&&box.groupId!=car[0].arr.groupId) {
                    toast.editContent(that.type==1?'只能选择一种团购商品':'只能选择一种代金券商品');
                    return false
                }//团购限制选择商品


                var mark = box.mark //获取弹出盒子的弹出哪件商品标识
                var a = mark.substring(mark.indexOf("a") + 1, mark.indexOf("b"))
                var b = mark.substring(mark.indexOf("b") + 1)
                var Von = that.Von
                var buyMininum=Von[a].distop[b].buyMininum
                Von[a].distop[b].shopPrice = box.shopPrice
                Von[a].distop[b].spec_size = box.spec_size
                Von[a].distop[b].spec_taste = box.spec_taste
                Von[a].distop[b].goodsAttrName = (Von[a].distop[b].spec_size ? Von[a].distop[b].spec_size : "") + (Von[a].distop[b].spec_size && Von[a].distop[b].spec_taste ? '+' : '')
                Von[a].distop[b].goodsAttrName += Von[a].distop[b].spec_taste ? Von[a].distop[b].spec_taste : ""
                Von[a].distop[b].decide = box.decide;


                //判断库存
                var goodsStock = Von[a].distop[b].goodsStock
                var numb = Von[a].distop[b].numb
                for (var i in that.car) {
                    if (that.car[i].arr.spec_size && Von[a].distop[b].spec_size == that.car[i].arr.spec_size) {
                        numb = that.car[i].arr.numb
                        break;
                    } else {
                        numb = 0
                    }
                }
                if ((parseInt(goodsStock) == 0) || ((parseInt(goodsStock) <= numb) && (parseInt(goodsStock) != -1))) {

                    toastSpecBox.editContent('没有库存了');
                    Von[a].distop[b].numb = Von[a].distop[b].numb
                    that.Von=Von
                    return false
                }
                if (parseInt(Von[a].distop[b].isSale) == 0) {
                    toastSpecBox.editContent('商品已下架');
                    Von[a].distop[b].numb = Von[a].distop[b].numb
                    that.Von=Von

                    return false
                }


                if (isNaN(Von[a].distop[b].numb)){
                    Von[a].distop[b].numb = 0
                }


                Von[a].distop[b].numb++
                that.box.numb++
                if(Von[a].allNumb){
                    Von[a].allNumb++
                }else{
                    Von[a].allNumb=1
                }


                var arr = JSON.parse(JSON.stringify(Von[a].distop[b]))
                //折扣优惠判断
                if (arr.zkGoodsId && arr.buyNum != -1 && Number(arr.numb) == Number(arr.buyNum) + 1) {
                    toastSpecBox.editContent('此折扣商品限优惠' + arr.buyNum + '份,超过' + arr.buyNum + '份恢复原价');
                }

                var car1 = car
                if (car1.filter(item => item.arr.goodsId == arr.goodsId && item.arr.spec_size == arr.spec_size && item.arr.spec_taste == arr.spec_taste).length > 0) {
                    car1.filter(item => item.arr.goodsId == arr.goodsId && item.arr.spec_size == arr.spec_size && item.arr.spec_taste == arr.spec_taste)[0].arr.numb++;
                }
                else {
                    //n份起购，如果商品有n份起购，那么第一次添加此商品的数量为最小起购数量
                    if (arr.buyMininum > 1) {
                        arr.numb = arr.buyMininum
                    } else {
                        arr.numb = 1;
                    }
                    // arr.userId = wx.getStorageSync('usersInfo').userId
                    var obj = { arr: arr, mark: mark };
                    car1.push(obj)
                }


                that.Von=Von
                // that.boxShow=false
                // that.bargainShow=false
                // that.specBoxShow=false
                that.car=car1
                that.zkPrice(a, b) //折扣价格处理
                that.sum()
            },
            //折扣价格处理
            zkPrice(a, b) {
                var that = this
                var Von = that.Von
                var car1 = that.car
                if (Von[a].distop[b].zkGoodsId) {
                    var preferentialNumb = 0 //优惠数量

                    for (var i = car1.length - 1; i >= 0; i--) {
                        if (car1[i].arr.buyNum != -1) {
                            if (car1[i].arr.zkGoodsId == Von[a].distop[b].zkGoodsId) {

                                if (preferentialNumb < car1[i].arr.buyNum) {
                                    if (car1[i].arr.numb >= car1[i].arr.buyNum - preferentialNumb) {
                                        car1[i].arr.preferentialNumb = Number(car1[i].arr.buyNum) - preferentialNumb
                                    } else {
                                        car1[i].arr.preferentialNumb = Number(car1[i].arr.numb)
                                    }
                                } else {
                                    car1[i].arr.preferentialNumb = 0
                                }
                                // } else {
                                //     car1[i].arr.preferentialNumb = Number(car1[i].arr.numb)
                                // }
                                preferentialNumb += car1[i].arr.preferentialNumb
                                if (car1[i].arr.preferentialNumb != 0) {
                                    if (car1[i].arr.buyNum != -1 && Number(car1[i].arr.numb) > Number(car1[i].arr.preferentialNumb)) {
                                        car1[i].arr.totalPrice = (Number(car1[i].arr.shopPrice) * Number(car1[i].arr.preferentialNumb) + Number(car1[i].arr.marketPrice) * (Number(car1[i].arr.numb) - Number(car1[i].arr.preferentialNumb))).toFixed(2)
                                    } else {
                                        car1[i].arr.totalPrice = (Number(car1[i].arr.shopPrice) * Number(car1[i].arr.numb)).toFixed(2)
                                    }
                                } else {
                                    car1[i].arr.totalPrice = (Number(car1[i].arr.marketPrice) * Number(car1[i].arr.numb)).toFixed(2)
                                }
                            }
                        }
                    }
                }
                that.car=car1
            },
            specBoxSub(){
                var that=this
                var box=that.box
                var mark=box.mark
                var car =that.car
                var goodsAttrName = (box.spec_size ? box.spec_size : "") + (box.spec_size && box.spec_taste ? '+' : '')
                goodsAttrName += box.spec_taste ? box.spec_taste : ""
                for(var i in car){
                    console.log(car[i].arr.goodsAttrName)
                    console.log(goodsAttrName)
                    if(car[i].mark==mark&&car[i].arr.goodsAttrName==goodsAttrName){

                        that.buysub(i);
                        that.box.numb--
                        return false
                    }

                }

            },
            add(index,foodIndex,groupId) {//加
                var that = this
                const toast=that.$refs.toast
                var Von = that.Von
                var car = that.car
                if (groupId&&car.length>0&&groupId!=car[0].arr.groupId) {
                    toast.editContent(that.type==1?'只能选择一种团购商品':'只能选择一种代金券商品');
                    return false
                }



                var buyMininum=Von[index].distop[foodIndex].buyMininum
                //判断库存
                var goodsStock = Von[index].distop[foodIndex].goodsStock
                var numb = Von[index].distop[foodIndex].numb
                if ((parseInt(goodsStock) == 0) || ((parseInt(goodsStock) <= numb) && (parseInt(goodsStock) != -1))) {

                    toast.editContent('没有库存了');
                    Von[index].distop[foodIndex].numb = Von[index].distop[foodIndex].numb
                    that.Von=Von
                    return false
                }
                if (parseInt(Von[index].distop[foodIndex].isSale) == 0) {
                    toast.editContent('商品已下架');
                    Von[index].distop[foodIndex].numb = Von[index].distop[foodIndex].numb
                    that.Von=Von

                    return false
                }

                if (!Boolean(Von[index].distop[foodIndex].numb)) {
                    Von[index].distop[foodIndex].numb = 0
                }
                //n份起购，如果商品有n份起购，那么第一次添加此商品的数量为最小起购数量
                if (buyMininum > 1 && Von[index].distop[foodIndex].numb < buyMininum) {
                    Von[index].distop[foodIndex].numb = buyMininum
                    if(Von[index].allNumb){
                        Von[index].allNumb+=buyMininum
                    }else{
                        Von[index].allNumb=buyMininum
                    }
                } else {
                    Von[index].distop[foodIndex].numb++
                    if(Von[index].allNumb){
                        Von[index].allNumb++
                    }else{
                        Von[index].allNumb=1
                    }
                }

                that.Von=Von

                var arr = JSON.parse(JSON.stringify(Von[index].distop[foodIndex]))
                //折扣优惠判断
                if (arr.zkGoodsId && arr.buyNum != -1 && Number(arr.numb) == Number(arr.buyNum) + 1) {
                    toast.editContent('此折扣商品限优惠' + arr.buyNum + '份,超过' + arr.buyNum + '份恢复原价');
                }
                arr.goodsAttrName=''
                var boxFee = that.boxFee
                var deskNum =that.deskNum
                if (deskNum == -1) {
                    if (arr.boxFee == '1') {
                        that.start++
                        var boxFees = that.start * boxFee
                        that.boxFees=boxFees
                    }
                }
                var mark = 'a' + index + 'b' + foodIndex
                var obj = { arr: arr, mark: mark };
                var car1 = car.filter(item => item.mark != mark)
                if (obj.arr.type == 2) {
                    if (car1.length > 0) {
                        Von[index].distop[foodIndex].numb = 0

                        that.Von=Von

                    } else {
                        car1.push(obj)

                        that.car=car1

                        // that.price() //下单购买
                    }
                } else {
                    car1.push(obj)

                    that.car=car1

                }
                that.zkPrice(index, foodIndex) //折扣价格处理
                that.sum()
            },
            sub(index,foodIndex){//减
                var that=this
                var Von = that.Von
                var buyMininum=Von[index].distop[foodIndex].buyMininum
                //n份限购，当商品的数量等于最小限购数，那么减去该商品的数量后为0
                if (buyMininum > 1 && buyMininum == Von[index].distop[foodIndex].numb) {
                    Von[index].allNumb-=Von[index].distop[foodIndex].numb
                    Von[index].distop[foodIndex].numb = 0
                } else {
                    Von[index].distop[foodIndex].numb--
                    Von[index].allNumb--
                }
                that.Von=Von

                var mark = 'a' + index + 'b' + foodIndex
                var arr = JSON.parse(JSON.stringify(Von[index].distop[foodIndex]))
                var boxFee = that.boxFee
                var deskNum = that.deskNum
                if (deskNum == -1) {
                    if (arr.boxFee == '1') {
                        that.start--
                        var boxFees = that.start * boxFee
                        that.boxFees=boxFees
                    }
                }

                var car = that.car
                var obj = { arr: arr, mark: mark };
                var car1 = car.filter(item => item.mark != mark)
                if (Von[index].distop[foodIndex].numb > 0) {
                    car1.push(obj)

                    that.car=car1
                    that.box.numb--
                } else {
                    for (var i in car) {
                        if (mark == car[i].mark) {
                            car.splice(i, 1)
                            that.box.numb=0
                            that.car=car
                            that.sum()
                            return
                        }
                    }
                }
                that.zkPrice(index, foodIndex) //折扣价格处理
                that.sum()
            },
            //购物总数弹出框的·加
            buyadd(index){
                var that=this
                const toast=that.$refs.toast
                var car = that.car


                var mark = car[index].mark

                var a = mark.substring(mark.indexOf("a") + 1, mark.indexOf("b"))
                var b = mark.substring(mark.indexOf("b") + 1)

                var Von = that.Von
                if ((parseInt(Von[a].distop[b].goodsStock) == 0) || ((parseInt(Von[a].distop[b].goodsStock) <= Von[a].distop[b].numb) && (parseInt(Von[a].distop[b].goodsStock) != -1))) {
                    toast.editContent('没有库存了');
                    Von[a].distop[b].numb = Von[a].distop[b].numb
                    that.Von=Von
                    return false
                }

                car[index].arr.numb++
                Von[a].distop[b].numb++
                var arr = Von[a].distop[b]
                if (arr.zkGoodsId && arr.buyNum != -1 && Number(arr.numb) == Number(arr.buyNum) + 1) {
                    toast.editContent('此折扣商品限优惠' + arr.buyNum + '份,超过' + arr.buyNum + '份恢复原价');
                }
                var boxFee = that.boxFee
                var deskNum = that.deskNum
                if (deskNum == -1) {
                    if (arr.boxFee == '1') {
                        that.start++
                        var boxFees = start * boxFee

                        that.boxFees=boxFees

                    }
                }


                if(Von[a].allNumb){
                    Von[a].allNumb++
                }else{
                    Von[a].allNumb=1
                }
                that.Von=Von;
                that.car=car;
                that.zkPrice(a, b) //折扣价格处理
                that.sum()
            },
            //购物总数弹出框的·减
            buysub(index){
                var that=this
                var car = that.car
                var Von = that.Von
                if (!car[index]) {
                    return false
                }
                //n份限购，当商品的数量等于最小限购数，那么减去该商品的数量后为0
                if (car[index].arr.buyMininum > 1 && car[index].arr.buyMininum == car[index].arr.numb) {
                    car[index].arr.numb = 0
                } else {
                    car[index].arr.numb--
                }
                var mark = car[index].mark
                var a = mark.substring(mark.indexOf("a") + 1, mark.indexOf("b"))
                var b = mark.substring(mark.indexOf("b") + 1)


                //n份限购，当商品的数量等于最小限购数，那么减去该商品的数量后为0
                if (Von[a].distop[b].buyMininum > 1 && Von[a].distop[b].buyMininum == Von[a].distop[b].numb) {
                    Von[a].allNumb-=Von[a].distop[b].numb
                    Von[a].distop[b].numb = 0
                } else {
                    Von[a].distop[b].numb--
                    Von[a].allNumb--
                }
                var arr = Von[a].distop[b]
                var deskNum = that.deskNum
                if (deskNum == -1) {
                    var boxFee = that.boxFee
                    if (arr.boxFee == '1') {
                        that.start--
                        var boxFees = start * boxFee

                        that.boxFees=boxFees

                    }
                }

                if (car[index].arr.numb <= 0) {
                    car.splice(index, 1)

                }
                that.car=car;
                that.Von=Von;

                that.zkPrice(a, b) //折扣价格处理
                that.sum()
                if(that.car.length<=0){
                    that.shopCarShow=false
                }
            },
            //总数
            sum(){
                var that=this
                var totalprice = 0
                var totalnumb = 0
                var totalMarketPrice = 0
                var car = that.car
                that.totalPrices(); //计算每件商品的总价和餐盒费
                for (var i = 0,len=car.length; i < len; i++) {
                    totalprice += Number(car[i].arr.totalPrice);
                    totalMarketPrice += car[i].arr.marketPrice * car[i].arr.numb;
                    totalnumb += car[i].arr.numb
                }
                if (that.boxFee && that.shopType != 5) {
                    totalprice = Number(totalprice) + Number(that.boxFee)
                }
                totalMarketPrice = Number(totalMarketPrice)
                totalprice = Number(totalprice).toFixed(2)
                totalMarketPrice = Number(totalMarketPrice).toFixed(2)

                that.totalprice=totalprice;
                that.totalnumb=totalnumb;
                that.totalMarketPrice=totalMarketPrice;
                //判断起送价
                // if (that.id == undefined) {
                //外卖或到店自取的起送价
                if (that.orderType == 0) {
                    var dfm = that.shopInfo.qsj
                    var distance_price = parseInt(dfm * 100 - totalMarketPrice * 100) / 100
                }
                //到店自取的起购价
                if (that.orderType == 5) {
                    var dfm = that.shopInfo.selfDeliveryFreeMoney
                    var distance_price = parseInt(dfm * 100 - totalMarketPrice * 100) / 100
                }

                //堂食预订起订价
                if (that.orderType == 3) {
                    var bookingMoney = that.shopInfo.bookingMoney;
                    var distance_price = parseInt(bookingMoney * 100 - totalMarketPrice * 100) / 100
                }

                if (distance_price > 0) {
                    that.distance_price=distance_price
                    that.shopCar=false
                } else if (car.length < 1) {
                    that.shopCar=false
                } else {
                    that.distance_price=false
                    that.shopCar=true
                }
                // } else {
                //     // that.shareIdD=true
                //     that.shopCar=true
                // }

            },
            //计算每件商品的总价
            totalPrices: function() {
                var that = this
                var car = that.car
                var boxFee = 0


                for (var i in car) {
                    if (car[i].arr.bargainId && car[i].arr.numb > 1) {
                        car[i].arr.totalPrice = (Number(car[i].arr.shopPrice) + Number(car[i].arr.marketPrice) * (Number(car[i].arr.numb) - 1)).toFixed(2)
                    } else if (car[i].arr.zkGoodsId) {

                    } else {
                        car[i].arr.totalPrice = (Number(car[i].arr.shopPrice) * Number(car[i].arr.numb)).toFixed(2)
                    }
                    car[i].arr.totalMarketPrice = (Number(car[i].arr.marketPrice) * Number(car[i].arr.numb)).toFixed(2)
                    boxFee += Number(car[i].arr.boxFee) * Number(car[i].arr.numb)
                }
                that.car=car
                that.boxFee=boxFee
            },

            //点击黑色层跳出弹出框
            boxHide(){
                var that=this
                that.boxShow=false
                that.specBoxShow=false
            },
            backClick() {
                navigator.pop({animated:'true'})
            },
            /*监听点餐，评价，商家的Index*/
            change: function (event) {
                // console.log(event.index);
                this.tabIndex = event.index;
            },
            /*监听全部，有图，最新的Index*/
            changes: function (event) {
                // console.log(event.index);
                this.ratingSelect = event.index;
            },
            /*点击菜单*/
            sortClick(index) {
                var that=this
                if(!that.toClick){
                    var boxRef = this.$refs.boxs;
                    that.catNameIndex = index
                    that.scrollTo=true
                    dom.scrollToElement(that.$refs.gooding[index], {})
                    setTimeout(function () {
                        that.scrollTo=false
                    },200)

                    that.y='-'+Number(that.boxStyle.top);
                    animation.transition(boxRef, {
                        styles: {
                            transform:'translateY(' + that.y +  'px)'
                        }
                    })
                }


            },
            /*点赞热度热度*/
            praiseClick(id,index){
                var that=this
                var userId=that.userId
                if(that.userId==0) {
                    that.toLogin()
                    return false
                }
                //登陆时的情况，未登陆需跳转的登陆页面
                var pingLunShow = that.pingLunShow
                var isZan = pingLunShow[index].isZan
                pingLunShow[index].isZan = isZan == 0 ? 1 : 0;

                var zanshow = pingLunShow[index].isZan;
                that.pingLunShow = pingLunShow

                if (zanshow == 0) {//已赞过
                    that.updDz(0,id,index)
                } else if (zanshow == 1) {//未赞过
                    that.updDz(1,id,index)

                }




            },
            //上传点赞
            updDz(toggle,id,index){
                var that=this
                const toast=that.$refs.toast
                var numb = Number(that.pingLunShow[index].numbs);
                if(toggle==0){
                    var url='https://www.aftdc.com/userapp/Index/cancelZanPj'
                }else{
                    var url='https://www.aftdc.com/userapp/Index/zanPj'
                }
                var param=that.GLOBAL.sign(that.token,that.imei)
                param+='&id='+id
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    url: url,
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                }, function (res) {
                    console.log(toggle+JSON.stringify(res))
                    if(res.data.res==1&&toggle==1){
                        that.zanAnimation()
                        that.$set(that.pingLunShow[index],'numbs',numb + 1)
                    }else if(res.data.res==1&&toggle==0){
                        that.$set(that.pingLunShow[index],'numbs',numb - 1)
                        toast.editContent(res.data.info);
                    }
                })
            },
            //关注、取消关注、收藏、取消收藏
            collectAndFollow(type) {
                var that = this
                if(that.userId==0) {
                    that.toLogin()
                    return false
                }
                var url = null
                const toast=that.$refs.toast;
                if(type==='attentionType') {
                    if(that.shopInfo.attentionType === 1) {
                        url = 'https://www.aftdc.com/userapp/Index/cancelAttentShop'//取消关注
                    }else {
                        url = 'https://www.aftdc.com/userapp/Index/attentShop'//关注
                    }
                }else {
                    if(that.shopInfo.colType === 1) {
                        url = 'https://www.aftdc.com/userapp/Index/cancelCollectShop'//取消收藏
                    }else {
                        url = 'https://www.aftdc.com/userapp/Index/collectShop'//收藏
                    }
                }
                var param = that.GLOBAL.sign(this.token,this.imei);
                param += '&shopId=' + that.shopId
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: url,
                }, function (res) {
                    console.log(that.shopInfo.colType+JSON.stringify(res))
                    if(res.data.res === 1) {
                        if(type==='attentionType') {
                            if(that.shopInfo.attentionType === 1) {
                                that.shopInfo.attentionType = 0//取消关注
                            }else {
                                that.shopInfo.attentionType = 1//关注
                            }
                        }else {
                            if(that.shopInfo.colType === 1) {
                                that.shopInfo.colType = 0//取消收藏
                            }else {
                                that.shopInfo.colType = 1//收藏
                            }
                        }
                        toast.editContent(res.data.info);
                    }else if(res.data.res === 0) {
                        toast.editContent(res.data.info);
                    }else if(res.data.res === -2) {
                        that.toLogin()
                    }
                });
            },
            /*点赞动画*/
            zanAnimation(){
                var testEl = this.$refs.shopZan;
                var that=this
                animation.transition(testEl, {
                    styles: {
                        opacity: 1,
                        transform: 'scale(2.3)',

                    },
                    duration: 400, //ms
                    timingFunction: 'linear',
                    delay: 0 //ms
                },function () {
                    animation.transition(testEl, that.rotateRight,function () {
                        animation.transition(testEl,that.rotateRecover,function () {
                            animation.transition(testEl, that.rotateLeft,function () {
                                animation.transition(testEl, that.rotateRight,function () {
                                    animation.transition(testEl,that.rotateRecover,function () {
                                        animation.transition(testEl, that.rotateLeft,function () {
                                            animation.transition(testEl, {
                                                styles: {
                                                    opacity: 0,
                                                    transform: 'scale(1, 1)',

                                                },
                                                duration: 240, //ms
                                                timingFunction: 'linear',
                                                delay: 0 //ms
                                            },function () {
                                                that.toastFive=false;
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                });

            },


            /*购物车弹出*/
            shopCarClick(){
                var that = this
                if(that.sumNumber>0){
                    if(that.popup==0){
                        that.isPopup =  true
                        that.popup=1
                    }else{
                        that.isPopup =  false
                        that.popup=0
                    }
                }

            },
            /*点击界面购物车弹出界面消失*/
            popupClick(){
                this.isPopup = false
                this.popup = 0
            },
            /*清空购物车*/
            closeShopCarClick(){
                var that=this
                var car = that.car
                var Von = that.Von
                var a = Von.length;
                for (var i = 0; i < a; i++) {
                    Von[i].allNumb=0
                    if (Boolean(Von[i].distop)) {
                        var b = Von[i].distop.length
                        for (var j = 0; j < b; j++) {
                            Von[i].distop[j].numb = 0
                        }
                    }
                }
                that.car=[];
                that.Von=Von;
                that.boxFees=0
                that.start = 0;
                that.sum()
                that.shopCarShow=false
            },

            //商品详情
            bargainShowClick(index,foodIndex){
                var that=this;

                var bargainBox = JSON.parse(JSON.stringify(that.Von[index].distop[foodIndex]));
                var bargainMark = 'a' + index + "b" + foodIndex
                if(bargainBox.bargainType==1){
                    //如果砍过价bargainPrice.bargain=2
                    bargainBox.bargainType=2
                }
                that.bargainBox=bargainBox;
                that.bargainMark=bargainMark
                that.bargainShow=true


            },
            //砍价弹出框变化
            bargainButClick(){
                var that=this

                var barIndex = that.bargainMark
                var random = Math.random();

                var a = barIndex.substring(barIndex.indexOf("a") + 1, barIndex.indexOf("b"))
                var b = barIndex.substring(barIndex.indexOf("b") + 1)
                var Von = that.Von
                var bargainGood = JSON.parse(JSON.stringify(Von[a].distop[b]));
                var result = bargainGood.result;
                var start = bargainGood.start;
                var end = bargainGood.end;
                var poor = parseInt(start * 100 - end * 100) / 100;

                var money = (poor * random).toFixed(2);
                var percent = Math.round(random * 100)/100;//比例长度
                console.log(poor+'+'+percent+'+'+money)
                var prans = {};
                prans.index = barIndex;
                prans.percent = percent;
                prans.money = money
                var bargainTipsPrice=money;
                that.prans=prans
                that.bargainTipsPrice=bargainTipsPrice
                // var poor = parseInt(Number(that.bargainPrice.minPrice)* 100 - Number(that.bargainPrice.maxPrice) * 100) / 100;
                //
                // this.bargainPrice.bargainPrice = (poor * random).toFixed(2);
                // this.bargainPrice.percent = Math.round(random * 100)/100;
                // this.bargainPrice.bargainSurePrice=(Number(that.bargainPrice.maxPrice)+Number(that.bargainPrice.bargainPrice)).toFixed(2)
                that.bargainTipsShow=true
            },
            //砍价提示框确定
            bargainTipsSure(){
                var that=this
                this.bargainTipsShow=false
                var bargainTipsPrice = that.bargainTipsPrice;
                var bargainBox = that.bargainBox
                var Von = that.Von
                var prans = that.prans;
                var barIndex = prans.index;
                var a = barIndex.substring(barIndex.indexOf("a") + 1, barIndex.indexOf("b"))
                var b = barIndex.substring(barIndex.indexOf("b") + 1)
                var percent = prans.percent;
                var money = prans.money;
                var end = bargainBox.end;
                var numb = parseInt((end * 100) + (money * 100)) / 100
                bargainBox.result = numb;
                bargainBox.shopPrice = numb;
                bargainBox.percent = percent;//百分比
                bargainBox.mark = barIndex
                bargainBox.bargainType=1;//用来判断第二次打开详情的样式状态
                Von[a].distop[b] = JSON.parse(JSON.stringify(bargainBox))
                that.Von=Von
                that.bargainBox=bargainBox
                that.box=bargainBox
                // dom.moveElement(this.$refs.leftLine,this.$refs.parentLine,4)更改层级
                setTimeout(function () {
                    animation.transition(that.$refs.widthLine, {
                        styles: {
                            width:480-480*prans.percent+'px'
                        },
                        duration: 800, //ms
                        timingFunction: 'ease',
                        needLayout:false,
                        delay: 0 //ms
                    })

                    animation.transition(that.$refs.leftLine, {
                        styles: {
                            transform:'translate('+-480*prans.percent+'px, 0px)'
                        },
                        duration: 800, //ms
                        timingFunction: 'ease',
                        needLayout:false,
                        delay: 0 //ms
                    })
                    animation.transition(that.$refs.arrowLine, {
                        styles: {
                            transform:'translate('+-480*prans.percent+'px, 0px) rotate(45deg)'
                        },
                        duration: 800, //ms
                        timingFunction: 'ease',
                        needLayout:false,
                        delay: 0 //ms
                    })
                    animation.transition(that.$refs.priceLine, {
                        styles: {
                            transform:'translate('+-480*prans.percent+'px, 0px)'
                        },
                        duration: 800, //ms
                        timingFunction: 'ease',
                        needLayout:false,
                        delay: 0 //ms
                    })
                },0)

            },
            //商家休息中的判断
            isOpen: function() {
                var that = this
                var shopInfo = that.shopInfo
                if (that.orderType == 5) {
                    var scheduledDate = shopInfo.selfScheduledDate
                } else {
                    var scheduledDate = shopInfo.scheduledDate
                }
                var presetTime = []
                scheduledDate = scheduledDate.split(",");
                var now = that.GLOBAL.formatTimes(new Date())
                now = that.GLOBAL.formateIOS(now)

                var dateN = that.GLOBAL.formatTime(new Date())
                var datestr = that.GLOBAL.formateIOS(dateN + ' ' + "00:00:00")
                var endTime = that.GLOBAL.formateIOS(dateN + ' ' + shopInfo.serviceTime[shopInfo.serviceTime.length - 1].serviceEndTime + ":00")
                if (scheduledDate.length == 1 && scheduledDate[0] == 1) {
                    if (that.shopType == 2) {
                        shopInfo.selfReserve = 0
                    } else {
                        shopInfo.reserve = 0
                    }
                }

                for (var i in scheduledDate) {
                    var today = that.GLOBAL.addDay(datestr, scheduledDate[i] - 1)
                    today = today.substring(5)
                    if (scheduledDate[i] == 1) {
                        today = '今天'
                    }
                    if (scheduledDate[i] == 2) {
                        today = '明天'
                    }
                    var presetTimeItem = {
                        days: scheduledDate[i] - 1,
                        today: today
                    }
                    presetTime.push(presetTimeItem)

                }
                if (now > endTime && presetTime[0].days == 0) { //如果当前时间超出结束营业时间且预订时间含有今天则删除掉今天
                    presetTime.splice(0, 1)
                }

                if (presetTime[0].days == 0) {
                    for (var i = shopInfo.serviceTime.length - 1; i >= 0; i--) { //商家休息的时候，reserveTime的值
                        if (now > that.GLOBAL.formateIOS(dateN + ' ' + shopInfo.serviceTime[i].serviceEndTime + ":00")) {
                            if (i == shopInfo.serviceTime.length - 1) {
                                var presetStartTime = shopInfo.serviceTime[0].serviceStartTime
                            } else {
                                var presetStartTime = shopInfo.serviceTime[i + 1].serviceStartTime
                            }
                            break;
                        } else {
                            var presetStartTime = shopInfo.serviceTime[0].serviceStartTime
                        }
                    }
                } else {
                    var presetStartTime = shopInfo.serviceTime[0].serviceStartTime
                }
                that.presetTime=presetTime
                that.shopInfo=shopInfo
                that.presetStartTime=presetStartTime
            },


            //评论切换
            onRatingSwitch(toggle){
                var that=this
                that.ratingSelect=toggle
                that.allPLPage=0
                that.photoPLPage=0
                that.scorePLPage=0
                that.getPl(0)

            },
            getPl(toggle){//toggle=0时为重新获取评论，toggle为1时为上拉加载获取评论
                var that = this
                const toast=that.$refs.toast
                var ratingSelect=that.ratingSelect
                var userId=that.userId
                if (!userId) {
                    userId = 0
                }
                var page=0
                var tab=Number(ratingSelect)+1
                switch (ratingSelect){
                    case 0:
                        page=that.allPLPage;
                        break;
                    case 1:
                        page=that.photoPLPage;
                        break;
                    case 2:
                        page=that.scorePLPage;
                        break;
                }

                var param='&shopId='+that.shopId+'&page='+page+'&shopType='+that.shopType+'&userId='+userId+'&tab='+tab
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/userapp/Index/getPl',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                }, function (res) {
                    if(res.data.data.allPf){
                        that.allPf=res.data.data.allPf
                    }


                    if(res.data.res==1){

                        if(toggle==0){

                            that.pingLunShow = res.data.data.pjList
                            that.noDataOfPinLun=false
                            switch (ratingSelect){
                                case 0:
                                    that.allPLPage=res.data.data.pjList.length;
                                    break;
                                case 1:
                                    that.photoPLPage=res.data.data.pjList.length;
                                    break;
                                case 2:
                                    that.scorePLPage=res.data.data.pjList.length;
                                    break;
                            }
                        }else if(toggle==1){
                            that.pingLunShow = that.pingLunShow.concat(res.data.data.pjList)
                            switch (ratingSelect){
                                case 0:
                                    that.allPLPage=that.allPLPage+res.data.data.pjList.length;
                                    break;
                                case 1:
                                    that.photoPLPage=that.photoPLPage+res.data.data.pjList.length;
                                    break;
                                case 2:
                                    that.scorePLPage=that.scorePLPage+res.data.data.pjList.length;
                                    break;
                            }
                            that.loadinging = false
                        }
                    }else if(res.data.res==0&&toggle==1){
                        that.loadinging = false
                        that.noDataOfPinLun=true
                    }else if(res.data.res==0&&toggle==0&&that.tabIndex==1){
                        that.noDataOfPinLun=true
                        toast.editContent(res.data.info)
                    }
                })
            },
            //评论上拉加载
            onloading (event) {
                var that=this
                that.loadinging = true
                if(!that.noDataOfPinLun){
                    that.getPl(1)
                }else{
                    setTimeout(function () {
                        that.loadinging = false
                    },0)
                }

            },
            onEnlargeImageClick(index,imgIndex){
                var that=this
                that.enlargeImageList=[]
                for(var i in that.pingLunShow[index].appraisesAnnex){
                    var obj={img:that.pingLunShow[index].appraisesAnnex[i],width:'750px',height:'500'}
                    that.enlargeImageList.push(obj)
                }
                that.firstShowImg=imgIndex
                that.enlargeImageShow=true


            },
            onShopMessageClick(index){
                var that=this
                that.enlargeImageList=[]
                for(var i in that.envImg){
                    var obj={img:that.envImg[i],width:'750px',height:'500'}
                    that.enlargeImageList.push(obj)
                }
                that.firstShowImg=index
                that.enlargeImageShow=true
            },

            //重置图片大小
            resize (i,event) {
                var that=this
                if (event.success) {
                    var ratio = event.size.naturalHeight / event.size.naturalWidth
                    var width = 750
                    var height = width * ratio
                    that.$set(that.enlargeImageList[i],'width',width + 'px')
                    that.$set(that.enlargeImageList[i],'height',height + 'px')
                }
            },
            //隐藏弹出框
            hideEnlargeImage(){
                var that=this
                that.$refs.wxcPopup_enlargeImage.hide()
            },
            //非状态组件，需要在这里关闭
            hide () {
                this.enlargeImageShow = false;
            },
            //弹出层隐藏
            wxcMaskSetHidden(){
                var that=this
                that.bargainShow=false
                that.boxShow=false
                that.couponShow=false
            },
            //关闭砍价弹出层
            closeClick(){
                var that=this
                that.bargainShow=false
            },
            popupClick () {
                var that=this
                that.shopCarShow = false;
            },
            shopCarShowClick(){
                var that=this
                if(that.car.length<=0){
                    return false
                }

                that.shopCarShow=!that.shopCarShow
            },
            popoverShowClick(){
                var that=this
                that.$refs['wxc-popover'].wxcPopoverShow();
            },
            popoverButtonClicked:GLOBAL.throttle(function(obj){
                var that=this
                if(that.userId==0) {
                    that.toLogin()
                    return false
                }
                const share=that.$refs.share

                var index=obj.index//点击气泡层按钮的index
                if(index==0){
                    share.show(true,true,false,false,false,false)
                }else if(index==1){
                    var param = {
                        aId:that.shopInfo.acticleAccount,
                        userName:that.shopInfo.shopName,
                        userPhoto:that.shopInfo.shopImg,
                    }
                    var url='http://assets/chat.js';
                    event.toUrl({"url":url,"param":param})
                }else if(index==2){
                    var param=that.shopId
                    var url='http://assets/reportingBusiness.js';
                    event.toUrl({"url":url,"param":param})
                }

            }),
            toOrderPage:GLOBAL.throttle(function(){
                var that=this
                if(that.userId==0) {
                    that.toLogin()
                    return false
                }
                var car = that.car
                var passCheck = true
                if (that.requiredCatId) {
                    passCheck = false
                    for (var i in car) {
                        if (car[i].arr.shopCatId2 === that.requiredCatId) {
                            var passCheck = true
                            break;
                        }
                    }
                }
                if (passCheck) {
                    var param={shopType:that.shopType,orderType:that.orderType};
                    var url='http://assets/orderPage.js';
                    event.toUrl({"url":url,"param":JSON.stringify(param)})
                }else{
                    modal.alert({
                        message:'需要选择[' + that.requiredName + ']下的商品才可下单哦~',
                        okTitle:'好的',
                    },function (value) {
                        for (var i = 0, len = that.Von.length; i < len; i++) {
                            if (that.Von[i].required === 1) {
                                that.sortClick(i)
                            }
                        }
                    })
                }

            }),
            toReserveClick:GLOBAL.throttle(function(){
                var that=this
                if(that.userId==0) {
                    that.toLogin()
                    return false
                }
                var param={shopType:that.shopType,orderType:that.orderType,shopId:that.shopId,shopName:that.shopInfo.shopName,serviceTime:that.shopInfo.serviceTime};
                var url='http://assets/reserve.js';
                event.toUrl({"url":url,"param":JSON.stringify(param)})
            }),
            toCollage:GLOBAL.throttle(function(){
                var that=this
                if(that.userId==0) {
                    that.toLogin()
                    return false
                }
                var param={shopId:that.shopId,shopType:that.shopType,orderType:that.orderType};
                if (that.requiredCatId) {
                    param.requiredCatId=that.requiredCatId
                    param.requiredName=that.requiredName
                }
                var url='http://assets/collage.js';
                event.toUrl({"url":url,"param":JSON.stringify(param)})
            }),
            backToCollage:GLOBAL.throttle(function(){
                var that=this
                var car =that.car
                var orderFood = []
                for (var i in car) {
                    orderFood[i] = car[i].arr
                    orderFood[i].mark = car[i].mark
                }
                var param = JSON.stringify(orderFood);
                event.delete(that.shopId+'orderFood'+that.shopType)
                event.save(that.shopId+'orderFood'+that.shopType,param);
                navigator.pop({ animated: 'true' });
            }),
            toPersonalHomePage:GLOBAL.throttle(function(){
                var param='';
                var url='http://assets/personalHomePage.js';
                event.toUrl({"url":url,"param":param})
            }),
            toBusinessQualificationClick:GLOBAL.throttle(function(){
                var that=this
                var param=that.shopId;
                var url='http://assets/businessQualification.js';
                event.toUrl({"url":url,"param":param})
            }),
            toLogin:GLOBAL.throttle(function(){
                var that=this
                var param='';
                var url='http://assets/login.js';
                event.toUrl({"url":url,"param":param})
            }),
            toShopGoodsSearchClick:GLOBAL.throttle(function(){
                var that=this
                var messageToSearch={
                    Von:that.Von,
                    car:that.car,
                    requiredCatId:that.requiredCatId,
                    requiredName:that.requiredName,
                    shopType:that.shopType,
                    orderType:that.orderType,
                    shopInfo:that.shopInfo,
                    box:that.box,//选中的商品的数据
                    goodsType:that.goodsType,
                    car: that.car,//购物车
                    boxFees:that.boxFees,//餐盒费
                    distance:that.distance,//距离,用于比较
                    serviceStartTime:that.serviceStartTime,//商家最早营业时间
                    serviceEndTime:that.serviceEndTime,//商家最晚结束营业商家
                    shareOrder:that.shareOrder,//商家最晚结束营业商家
                    //预订时间
                    presetTime: that.presetTime,
                    presetStartTime: that.presetStartTime,
                    restTimeBookForward: that.restTimeBookForward,
                    closeButton: that.closeButton, //是否显示所有添加商品的按钮
                    type:that.type,//团购 代金券
                }
                event.save('messageToSearch',JSON.stringify(messageToSearch))
                var param=''
                var url='http://assets/shopGoodsSearch.js';
                event.toUrl({"url":url,"param":param})
            }),
            toGoodsCommentDetailsClick:GLOBAL.throttle(function(index){
                var that=this
                var pingLunShow=that.pingLunShow
                var param={id:pingLunShow[index].id}
                var url='http://assets/goodsCommentDetails.js';
                event.toUrl({"url":url,"param":JSON.stringify(param)})
            }),
            toHeadLineArticleClick:GLOBAL.throttle(function(){
                var that=this
                var param=that.shopInfo.acticleAccount
                var url='http://assets/headLineArticle.js';
                event.toUrl({"url":url,"param":JSON.stringify(param)})
            }),
            viewappear(){
                var that=this
                if (!that.pageBack) { return; }
                that.pageBack = false;
                //重新获取token
                if (event.find('isLogin')) {
                    that.token = event.find('userToken');
                    that.userId = event.find('userId');
                    that.getShopInfo();//获取店铺信息、活动、轮播订单
                    that.getPl(0);//获取全部评论
                }

                if(event.find('searchPageMessage')){
                    var searchPageMessage=JSON.parse(event.find('searchPageMessage'))
                    event.delete('searchPageMessage')
                    that.Von=searchPageMessage.Von
                    that.car= searchPageMessage.car
                    that.sum();

                }else{
                    that.totalprice=0//总价
                    that.totalnumb=0//总数
                    that.getCaiDan();//获取菜单信息
                }

            },
            viewdisappear() {
                var that=this
                that.pageBack = true;
                if(that.shareOrder){return;}//如果是从拼单进来，需要点选好了才保存orderFood
                var car =that.car
                var orderFood = []
                for (var i in car) {
                    orderFood[i] = car[i].arr
                    orderFood[i].mark = car[i].mark
                }
                var param = JSON.stringify(orderFood);
                event.delete(that.shopId+'orderFood'+that.shopType)
                event.save(that.shopId+'orderFood'+that.shopType,param);
            },

        }
    }

</script>

<style scoped>
    /*****************/
    .header {
        flex-direction: row;
        height: 90px;
        background-color: #53beb7;
        align-items: center;
        justify-content: space-between;
        /*position: absolute;*/
        /*top: 0;*/
        /*left: 0;*/
        /*right: 0;*/
    }

    .back {
        flex-direction: row;
        margin-left: 40px;
        align-items: center;
        flex: 1;
    }

    .backImg {
        width: 40px;
        height: 40px;
    }

    .appNameCss {
        width: 320px;
        padding-left: 20px;
        font-size: 35px;
        color: #fff;
        text-overflow: ellipsis;
        lines: 1
    }

    .allSave {
        flex: 0.7;
        /*margin-left: 60px;*/
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
        padding-right: 20px;

    }

    .icon_search {
        width: 60px;
        height: 60px;
    }

    .icon_star {
        width: 50px;
        height: 50px;
    }

    .icon_ping {
        width: 50px;
        height: 50px;
        margin-left: 15px;
    }

    .icon_more {
        width: 60px;
        height: 60px;
        margin-left: 15px;
    }

    /***********************/
    .wrapper {
        background-color: #f8f8f8;
        position: relative;
    }

    .backImg {
        width: 40px;
        height: 40px;
    }

    .userImg {
        width: 150px;
        height: 150px;
        border-radius: 5px;
        box-shadow: 3px 3px 4px #000;
    }

    .whiteFont {
        color: #ffffff;
        margin-left: 10px;
        max-width: 350px;
        lines:1;
        text-overflow: ellipsis;
    }

    .whiteTime {
        width: 25px;
        height: 25px;
    }

    .toTop {
        flex: 1;
        background-color: #fff;
    }

    .topBody {
        background-color: #53beb7;
        flex-direction: row;
        padding-top: 10px;
        padding-left: 20px;
        padding-right: 5px;
        align-items: center;
    }
    .top_fontText{
        font-size: 22px;
        color: #ffffff;
    }
    .padding {
        padding-left: 10px;
        padding-right: 10px;
    }

    .leftRight {
        border-left-color: #ffffff;
        border-left-width: 1px;
        border-right-color: #ffffff;
        border-right-width: 1px;

    }

    .borderBottom {
        border-bottom-color: #ffffff;
        border-bottom-width: 1px;
        border-bottom-style: solid;
    }
    .attentionGreen{
        background-color: #00b8a5;
    }
    .attentionRed{
        background-color: #bf5b4c;
    }
    .btnFocus {
        padding-top: 5px;
        padding-bottom: 5px;
        /*padding-left: 20px;*/
        /*padding-right: 20px;*/
        background-color: #e06556;
        border-radius: 20px;
        color: #ffffff;
        font-size: 22px;
        width: 106px;
        text-align: center;
    }

    .btnFocus:active {
        background-color: #bf5b4c;
    }

    .whiteHorn {
        width: 30px;
        height: 30px;
    }

    .userImgs {
        width: 100px;
        height: 100px;
        border-radius: 10px;
    }

    .topFont {
        margin-left: 10px;
        font-size: 30px;
        color: #ffffff;
        margin-bottom: 15px;
    }

    .bottomFont {
        padding-top: 5px;
        padding-bottom: 5px;
        padding-left: 10px;
        padding-right: 10px;
        font-size: 25px;
        color: #ffffff;
        border-width: 1px;;
        border-color: #ffffff;
        border-radius: 10px;
        margin-left: 10px;
    }

    .tab {

        border-bottom-style: solid;
        border-bottom-width: 5px;
        border-bottom-color: #50BEB7;
        padding-top: 18px;
        padding-bottom: 18px;
        font-size: 26px;
        color: #666;
        text-align: center;
        padding-left: 30px;
        padding-right: 30px;
    }

    .tabs {
        text-align: center;
        padding-left: 30px;
        padding-right: 30px;
        padding-top: 18px;
        padding-bottom: 18px;
        padding-top: 15px;
        padding-bottom: 15px;
        font-size: 26px;
        color: #999;
    }

    .tabActive {
        border-bottom-style: solid;
        border-bottom-width: 1px;
        border-bottom-color: rgba(153, 153, 153, 0.2);
        background-color: #EDFFFE;
        flex-direction: row;
        justify-content: space-around;
    }

    .leftSlider {
        font-size: 26px;
        color: #999;
        max-width: 170px;

    }

    .leftSliders {
        font-size: 26px;
        color: #666;
        max-width: 170px;

    }

    .leftBoxs {
        padding: 20px;
        padding-top: 30px;
        padding-bottom: 30px;
        flex-direction: row;
        align-items: center;
        background-color: #ffffff;
        border-bottom-color: #dedede;
        border-bottom-width: 1px;
        border-bottom-style: solid;
        justify-content: center;
        position: relative;
    }

    .leftBox {
        padding: 20px;
        padding-top: 30px;
        padding-bottom: 30px;
        flex-direction: row;
        align-items: center;
        border-bottom-color: #dedede;
        border-bottom-width: 1px;
        border-bottom-style: solid;
        justify-content: center;
        position: relative;
    }

    .leftIcon {
        width: 35px;
        height: 35px;
    }
    .redPackets_scroller{
        flex-direction: row;
        justify-content: flex-start;
        padding-right: 10px;
        padding-left: 10px;
        padding-top: 20px;
        padding-bottom: 20px;
    }
    .redPackets_small{
        flex-direction: row;
        transform:  scale(0.3);
        transition-property: transform;
        transform-origin:top left;
        transition-duration: 0s;
        transition-timing-function:cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .couponDiv{
        position: relative;
        width: 398px;
        height: 160px;
        /*width: 119px;*/
        /*height: 48px;*/
        /*margin-top: 10px;*/
        margin-left: 10px;
        margin-right: 10px;
        /*margin-bottom: 10px;*/
        /*transform: translate(-285px,-50px) scale(0.3);*/
        /*transition-property: transform;*/
        /*transition-duration: 0s;*/
        /*transition-timing-function:cubic-bezier(0.175, 0.885, 0.32, 1.275);*/
    }
    .quanImg {
        width: 398px;
        height: 160px;


    }
    .redPacket_content{
        flex-direction:column;
        margin-left: 20px;
        margin-bottom: 20px;
    }


    .goodImg {
        margin-top: 5px;
        width: 160px;
        height: 160px;
    }
    .noFoodDiv{
        position: absolute;
        bottom: 0;
        left: 0;
        width: 160px;
        height: 160px;
        background-color: rgba(255, 255, 255,0.5)
    }
    .noFood{
        position: absolute;
        bottom: 0;
        left: 0;
        width: 160px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        background-color: rgba(0, 0, 0, 0.7);
    }
    .foodNameText{
        flex-direction:row;
        max-width: 300px;
        lines:1;
        text-overflow: ellipsis;
    }
    .foodDetails{
        max-width: 340px;
        lines:1;
        text-overflow: ellipsis;
        margin-top: 5px;
    }
    .discountDiv {
        border-width: 1px;
        border-style: solid;
        border-color: #53beb7;
        flex-direction: row;
        align-items: center;
        justify-content: initial;
        margin-top: 5px;
        /* width: 150rpx; */
        padding-top: 3px;
        padding-bottom: 3px;
        padding-right: 5px;
        border-radius: 5px;
    }
    .fullGiveDiv{
        flex-direction: row;
        align-items: center;
        padding-top: 3px;
        padding-bottom: 3px;
        border-radius: 5px;
    }
    .discountIcon {
        width: 22px;
        height: 22px;
        margin-left: 10px;
    }
    .discountText{
        margin-left: 5px;
    }
    .disfood{
        flex-direction: column;
        justify-content: space-between;
        flex: 1;
        height: 160px;
        osition: relative;
        margin-left: 10px
    }
    .disfood-name{
        flex-direction: column;
    }


    .disfood-bottom{
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
    .spec-market{
        flex-direction: row;
        align-items: flex-end;

    }
    .marketPrice_spec{
        flex-direction: row;
        align-items: flex-end;
    }
    .marketPriceText{
        text-decoration: line-through;
        margin-bottom: 3px;
    }
    .slider {
        position: relative;
        width: 750px;
        flex: 1;
        flex-direction: row;
        background-color: #ffffff;
        transition: left 0.2s ease-in-out;
    }
    .addImgs{
        width: 50px;
        height: 50px;
        margin-right: 5px;
    }
    .addImg {
        width: 50px;
        height: 50px;
        margin-left: 5px;
    }
    .addImgs:active {
        background-color: #999;
        border-radius: 25px;
    }
    .addImg:active {
        background-color: #53beb7;
        border-radius: 25px;
    }
    .bargain{
        color: #ffffff;
        padding-top: 10px;
        padding-bottom: 10px;
        width: 110px;
        background-color: #53beb7;
        border-radius: 30px;
        /*border-width: 2px;*/
        /*border-style: solid;*/
        /*border-color: #57aba5;*/
        text-align: center;
    }
    .bargain:active{
        background-color: #57aba5;
    }
    .yhqbox {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        flex-direction: row;
        align-items: center;
        opacity: 0;
        transition-property: opacity;
        transition-duration: 0s;
        transition-timing-function:cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .smallYhqbox{
        position: absolute;
        top: 0;
        left: 0;
        right: 145px;
        bottom: 0;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        opacity: 1;
        transition-property: opacity;
        transition-duration: 0s;
        transition-timing-function:cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .couponPrice{
        flex-direction: row;
        align-items: flex-end;
        /*margin-left: 10px*/
    }
    .couponMessage{
        flex-direction: column;
        justify-content: center;
        margin-left: 15px;
    }

    .get {
        position: absolute;
        top: 0;
        left: 255px;
        right: 0;
        bottom: 0;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition-property: opacity;
        transition-duration: 0s;
        transition-timing-function:cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .smallGet{
        position: absolute;
        top: 0;
        left: 255px;
        right: 0;
        bottom: 0;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        opacity: 1;
        transition-property: opacity;
        transition-duration: 0s;
        transition-timing-function:cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .goods {
        flex-direction: row;
        align-items: center;
        height: 185px;
        border-bottom-style: solid;
        border-bottom-width: 1px;
        border-bottom-color: rgba(153, 153, 153, 0.2);
        padding-bottom: 15px;
        padding-top: 10px;
        margin-left: 10px;
        padding-left: 188px;
    }

    .shopCar {
        width: 750px;
        flex-direction: row;
        justify-content: space-between;
        /*border-width: 1px;*/
        background-color: #ffffff;
        align-items: center;
    }

    .carImg {
        width: 75px;
        height: 75px;
        margin: 10px;
    }
    .sumNum{
        height: 30px;
        background-color: red;
        border-radius: 30px;
        text-align: center;
        line-height: 30px;
        color: #ffffff;
    }

    .addCar {
        background-color: #999;
        color: #ffffff;
        padding-left: 23px;
        padding-right: 23px;
        height: 95px;
        line-height: 95px;
    }

    .order {
        background-color: #53beb7;
        color: #ffffff;
        padding-left: 50px;
        padding-right: 50px;
        height: 95px;
        line-height: 95px;
    }

    .environment {
        flex-direction: row;
        margin: 20px;
        margin-top: 10px;
        height: 128px;
    }

    .sliders {
        width: 200px;
        height: 150px;
        margin-right: 10px;
    }

    .label {
        margin-left: 20px;
        margin-right: 20px;
        padding-top: 20px;
        padding-bottom: 10px;
        border-bottom-style: dashed;
        border-bottom-color: #f1f1f1;
        border-bottom-width: 2px;
    }
    .noteView{
        flex-direction: row;
        align-items: flex-start;
        margin-top: 5px;
        margin-left: 20px;
        margin-right: 20px;
        padding-top: 12px;
        padding-left: 20px;
        padding-bottom: 12px;
        padding-right: 20px;
        background-color: #f8f8f8;
        border-radius: 10px;
    }
    .blackFont{
        width: 665px;
    }
    .shop_messageView{
        flex-direction: row;
        margin-left: 20px;
        margin-top: 20px;
        align-items: flex-start;
    }
    .bar {
        width: 710px;
        height: 5px;
        background-color: #f8f8f8;
        margin-left: 20px;
        border-radius: 5px;
    }

    .icon {
        width: 30px;
        height: 30px;
    }
    .textMsgWidth{
        padding-left: 10px;
        width: 670px;
    }
    .textMsg {
        padding-left: 10px;
    }

    .filling {
        width: 40px;
        height: 40px;
        background-color: #007c0b;
        color: #ffffff;
        text-align: center;
        line-height: 40px;
    }

    .fillings {
        border-color: #53beb7;
        border-width: 1px;
        padding-top: 5px;
        padding-bottom: 5px;
        padding-left: 10px;
        padding-right: 10px;
        border-radius: 5px;
        margin-right: 20px;
    }

    .fillings:active {
        background-color: rgba(153, 153, 153, 0.5);
    }

    .reduction {
        width: 40px;
        height: 40px;
        line-height: 40px;
        background-color: #ff4040;
        color: #ffffff;
        text-align: center;
    }

    .newUser {
        width: 40px;
        height: 40px;
        line-height: 40px;
        background-color: #53beb7;
        color: #ffffff;
        text-align: center;
    }

    .receive {
        width: 40px;
        height: 40px;
        line-height: 40px;
        background-color: #960044;
        color: #ffffff;
        text-align: center;
    }
    .bl-zhe{
        width: 40px;
        height: 40px;
        line-height: 40px;
        background-color: #F4A460;
        color: #ffffff;
        text-align: center;
    }

    .bulk {
        width: 40px;
        height: 40px;
        line-height: 40px;
        background-color: #1988f9;
        color: #ffffff;
        text-align: center;
    }

    .rob {
        width: 40px;
        height: 40px;
        line-height: 40px;
        background-color: #aa135f;
        color: #ffffff;
        text-align: center;
    }

    .cut {
        width: 40px;
        height: 40px;
        line-height: 40px;
        background-color: #98cc2f;
        color: #ffffff;
        text-align: center;
    }
    .bl-miao{
        width: 40px;
        height: 40px;
        line-height: 40px;
        background-color: green;
        color: #ffffff;
        text-align: center;
    }
    .bl-jian{
        width: 40px;
        height: 40px;
        line-height: 40px;
        background-color: #ff4040;
        color: #ffffff;
        text-align: center;
    }
    .bl-man {
        width: 40px;
        height: 40px;
        line-height: 40px;
        background-color: red;
        color: #ffffff;
        text-align: center;
    }
    .bl-jf{
        width: 40px;
        height: 40px;
        line-height: 40px;
        background-color: #aa135f;
        color: #ffffff;
        text-align: center;
    }
    .float{
        flex-direction: row;
        align-items: center;
        width: 710px;
        flex-wrap: wrap;
        margin-left: 20px;
        padding-top: 7px;

    }
    .top_normal{
        flex-direction: row;
        margin-top: 10px;
        padding-right: 20px;
        align-items: center;
        min-width: 355px;
        padding-left: 20px;
    }
    .normal {
        flex-direction: row;
        margin-top: 10px;
        padding-right: 20px;
        align-items: center;
        min-width: 355px;
    }

    .horns {
        width: 30px;
        height: 30px;
        margin-top: 2px;
    }

    .map:active {
        background-color: #ffffff;
    }


    .report:active {
        background-color: #ffffff;
    }

    .collection:active {
        background-color: #ffffff;
    }

    .overline {
        font-size: 30px;
        color: #333;
    }

    .line {
        width: 200px;
        height: 20px;
        border-bottom-width: 1px;
        border-bottom-color: #999;
    }

    .stars {
        position: relative;
    }
    .pinLun_stars{
        position: relative;
        padding-right: 30px;
        align-items: center
    }

    .starSize {
        width: 150px;
        height: 25px;
    }

    .yellowStar {
        position: absolute;
        top: 0;
        left: 0;
        height: 25px;
        overflow: hidden;
    }
    .pinLun_starSize{
        width: 110px;
        height: 18px;
    }
    .pinLun_yellowStar {
        position: absolute;
        top: 0;
        left: 0;
        height: 18px;
        overflow: hidden;
    }
    .pinLun_content{
        flex-direction: row;
        margin-left: 90px;
        margin-bottom: 15px;
    }
    .pinLun_foodImg{
        margin-left: 90px;
        max-width: 520px;
        flex-direction:row;
        flex-wrap: wrap
    }
    .pinLun_littleIcon{
        width: 30px;
        height: 30px;
    }
    .pinLun_zanImgDiv{
        position: absolute;
        top: 350px;
        left: 280px;
        opacity:0
    }
    .pinLun_zanImg{
        width: 150px;
        height: 150px;
    }
    .pinLun_shopReply{
        line-height: 35px;
        background-color: #f8f8f8;
        border-radius: 10px;
        padding-top: 10px;
        padding-bottom: 10px;
        padding-left: 20px;
        padding-right: 20px;
    }
    .rating {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding-left: 50px;
        padding-right: 50px;
        padding-top: 10px;
        padding-bottom: 10px;
        justify-items: center;
    }

    .allScore {
        font-size: 40px;
        margin-bottom: 15px;
    }

    .startScore {
        color: #ffd510;
    }

    .textFont {
    }

    .bars{
        height: 15px;
        background-color: #f8f8f8;
    }

    .ratings{
        color: #53beb7;
        border-top-width: 2px;
        border-left-width: 2px;
        border-bottom-width: 2px;
        border-color: #53beb7;
        font-size: 26px;
        padding-top: 15px;
        padding-bottom: 15px;
        padding-left: 65px;
        padding-right: 65px;
    }
    .ratinges{
        color: #ffffff;
        border-top-width: 2px;
        border-left-width: 2px;
        border-bottom-width: 2px;
        border-color: #53beb7;
        font-size: 26px;
        padding-top: 15px;
        padding-bottom: 15px;
        padding-left: 65px;
        padding-right: 65px;
        background-color: #53beb7;
    }
    .ratImg{
        width: 80px;
        height: 80px;
        border-radius: 40px ;


    }
    .pinglun_allScroe{
        align-items: center;
        padding-top: 15px;
        padding-bottom: 15px
    }
    .pinglun_centerScroe{
        justify-content: center;
        padding-top: 15px;
        padding-bottom: 15px
    }
    .pinglun_tasteScroe{
        flex-direction: row;
        align-items: center;
        margin-bottom: 15px
    }
    .pinglun_warpScroe{
        flex-direction: row;
        margin-top: 5px;
        align-items: center;
    }
    .pinLun_scroeStar{
        padding-right: 30px;
        align-items: center
    }
    .pinLun_psScore{
        align-items: center;
        border-left-width: 2px;
        border-left-color:#f1f1f1 ;
        padding-left: 50px;
        padding-top: 15px;
        padding-bottom: 15px
    }
    .pinLun_choice{
        flex-direction: row;
        justify-content: center;
        padding-top: 20px;
        padding-bottom: 20px;
        background-color: #fff;
        /*position: sticky;*/
        /*left: 0;*/
    }
    .pinLun_choiceAll{
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px
    }
    .pinLun_choiceScore{
        border-right-width: 2px;
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px
    }
    .pinLun_topStyle{
        padding-left: 10px;
        padding-right: 20px;
        width: 750px;
    }
    .pinLun_bottomStyle{
        border-bottom-width: 1px;
        border-bottom-color:#f8f8f8;
        margin-bottom: 10px;
    }
    .pinLun_topMess{
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 10px;
    }
    .pinLun_photo{
        border-radius: 40px;
        margin-right: 5px;
    }
    .pinLun_name{
        width: 630px;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
    .gradeImg{
        margin-left: 5px;
        width: 30px;
        height: 30px;
    }
    .ratGoodImg{
        margin-bottom: 20px;
        margin-right: 20px;
        width: 150px;
        height: 150px;
    }
    .pinLun_zan{
        flex-direction: row;
        margin-left: 90px;
        margin-bottom: 20px;
        justify-content: space-between;
        align-items: center
    }
    .zanDiv{
        flex-direction:row;
        justify-content: center;
        align-items: center;
        padding-top: 10px;
        padding-bottom: 10px;
        padding-left: 10px;
        padding-right: 10px;
        border-width: 1px;
        border-style: solid;
        border-color: #999;
        border-radius: 20px;
        min-width: 120px;
    }
    .zanDiv:active{
        background-color: #f1f1f1;
    }
    .hot{
        color: #999;
    }
    .close{
        width: 50px;
        height: 50px;
        border-radius: 25px;
        background-color: #53beb7;
        font-size: 30px;
        text-align: center;
        line-height: 50px;
        color: #ffffff;
    }
    .shopGood{
        position: fixed;
        top: 0;
        bottom: 93px;
        left: 0;
        right: 0;
        background-color: rgba(0, 0, 0, 0.5);
        justify-content: flex-end;
    }
    .empty{
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
        background-color: rgb(230, 230, 230);
        height: 80px;
        padding-right: 20px;

    }
    .bBorder{
        border-bottom-width: 1px;
        border-bottom-color: rgba(153, 153, 153, 0.22);
        border-bottom-style: solid;
        flex-direction: row;
        /*justify-content: space-between;*/
        height: 120px;
        align-items: center;
        padding-right: 20px;
        padding-left: 20px;
        background-color: #fff;
    }
    .name-size {
        flex-direction: column;
        /* justify-content:space-between; */
        flex: 5;
        margin-right: 10px;
    }
    .buy-price{
        flex-direction: row;
        flex: 2;
        justify-content: flex-end;
        text-align: right;
        align-items: center;
    }
    .buy-subadd {
        flex-direction: row;
        align-items: center;
        flex: 3;
        justify-content: flex-end;
    }
    .addeImgs{
        width: 40px;
        height: 40px;
        margin-right: 10px;
    }
    .addeImg {
        width: 40px;
        height: 40px;
        margin-left: 5px;
    }
    .addeImgs:active {
        background-color: #999;
        border-radius: 25px;
    }
    .addeImg:active {
        background-color: #53beb7;
        border-radius: 25px;
    }
    .historyOrder {
        flex-direction: row;
        align-items: center;
        padding-top: 5px;
        padding-bottom: 5px;
        padding-left: 20px;
        background-color: #53beb7;
        height: 100px;
    }


    .headSculpture {
        width: 80px;
        height: 80px;
        border-radius: 20px;
    }

    .historyOrderContent {
        flex-direction: column;
        justify-content: center;

    }

    .orderContent {
        flex-direction: row;
        align-items: center;

    }

    .orderName {
        font-size: 25px;
        color: #fff;
        /*width: 70px;*/
        /*text-overflow: ellipsis;*/
        /*lines: 1;*/
        font-weight: bold;
        margin-left: 10px;
    }

    .orderTimeText {
        font-size: 25px;
        color: #fff;
        font-weight: bold;
    }

    .orderContentBorderText {
        padding-top: 5px;
        padding-left: 10px;
        padding-right: 10px;
        padding-bottom: 5px;
        color: #fff;
        border-width: 1px;
        border-style: solid;
        border-color: #fff;
        border-radius: 5px;
        margin-top: 5px;
        margin-left: 10px;
    }
    .textCarousel_content{
        /*height: 100px;*/
        flex-direction: row;
        align-items: center;
        background-color: #53beb7;
    }
    .textCarousel {
        height: 100px;
        overflow: hidden;
        flex: 6;

    }
    .textCarousel_redPackets{

        flex: 1;
        flex-direction: row;
        align-items: center;
        position: relative;
    }
    .textCarouselR_img{
        width: 84px;
        height:33px;
    }
    .scrollsTransform{
        transform: translate(0px,0px)
    }
    .jumpDiv{
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding-top: 20px;
        padding-bottom: 20px;
        border-top-color: #f8f8f8;
        border-top-width: 1px;
        margin-left: 20px;
        margin-right: 20px;
    }
    .arrow_blackSize{
        width: 18px;
        height: 18px;
    }

    /***砍价提示条***/
    .wordLR-degree {
        width: 600px;
        margin-top: 30px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .price {
        width: 540px;
        margin-bottom: 10px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .degreeBox {
        background-color: #c0c0c0;
        position: relative;
        width: 480px;
        height: 10px;
        margin-top: 16px;
    }

    .degreeL, .degreeR, .degreeC {
        position: absolute;
        top: -10px;
        width: 30px;
        height: 30px;
        border-radius: 15px;
        flex-direction: row;
        justify-content: center;
        align-items: center;

    }

    .circle {
        width: 15px;
        height:15px;
        background-color: #fff;
        border-radius: 7px;
    }

    .degreeL {
        background-color: #53beb7;
        top: 5px;
        left: 45px;
    }

    .degreeR {
        right: 45px;
        top: 5px;
        background-color: #c0c0c0;
    }

    .finish {
        position: absolute;
        background-color: #53beb7;
        top: 16px;
        left: 0;
        height: 10px;
        width: 480px;
        transition: all 0.5s linear;
    }

    .degreeC {
        right: 45px;
        top: 5px;
        background-color: #ee7942;
    }

    /*.degreeC.active {*/
    /*z-index: 10;*/
    /*}*/

    .result {
        position: absolute;
        border-radius: 12px;
        padding-top: 8px;
        padding-bottom: 8px;
        padding-left: 12px;
        padding-right: 12px;
        border-width: 1px;
        border-style: solid;
        border-color: #dedede;
        text-align: center;
        top: 45px;
        right: 5px;
        /*left: 100%;*/
        /*transform: translateX(-50%);*/

    }

    .arrow {
        width: 16px;
        height: 16px;
        border-top-width: 1px;
        border-top-style: solid;
        border-top-color: #dedede;
        border-left-width: 1px;
        border-left-style: solid;
        border-left-color: #dedede;
        transform: rotate(45deg);
        background-color: #fff;
        position: absolute;
        top: 38px;
        right: 52px;
        /*left: 50%;*/
        /*margin-left: -8px;*/
    }
    .BargainBut{
        width: 540px;
        /*margin-top: 30px;*/
        margin-left: 30px;
        background-color: #53beb7;
        color: #fff;
        border-radius: 10px;
        text-align: center;
        padding-top: 22px;
        padding-bottom: 22px;
        position: absolute;
        bottom: 30px;
        border-width: 2px;
        border-style: solid;
        border-color: #57aba5;
        /*height: 40px;*/
    }
    .BargainBut:active{
        background-color: #57aba5;
    }

    /*砍价提示手气弹框  */

    .modelBack {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.3);

    }

    .model {
        background-color: #fff;
        border-radius: 10px;
        width: 580px;
        display: flex;

        flex-direction: column;
        text-align: center;
        align-items: center;
    }

    .model-title {
        font-size: 34px;
        font-weight: 700;
        color: #ffcc01;
        padding-top: 30px;
        padding-bottom: 30px;
    }

    .model-txt {
        color: #6a6a6a;
        font-size: 30px;
        margin-bottom: 30px;
    }

    .model-but {
        flex: 1;
        text-align: center;
        width: 580px;
        font-size: 30px;
        border-top-width: 1px;
        border-top-style: solid;
        border-top-color: #dedede;
        padding-top: 14px;
        padding-bottom: 14px;
    }
    /*星星/销量*/
    .shopAvg {
        flex-direction: row;
        align-items: center;
        position: relative;

    }
    .star{
        position: relative;
        margin-right: 10px;
    }
    .starSize{
        width: 143px;
        height: 23px;

    }

    .shopAvgImg {
        position: absolute;
        left: 0;
        top:0;
        /*width: 15px;*/
        height: 23px;
        overflow: hidden;
    }

    .shopContentSize {
        font-size: 22px;
        color: #fff;
    }
    .chooseGG{
        background-color: #53beb7;
        text-align: center;
        padding-top: 10px;
        padding-bottom: 10px;
        width: 110px;
        border-radius: 30px;
        /*border-width: 2px;*/
        /*border-style: solid;*/
        /*border-color: #57aba5;*/

    }
    .chooseGG:active{
        background-color: #57aba5;
    }
    .replyAll-img{
        width:28px;
        height:28px;
        /*margin-top: 6px;*/
        /*margin-right: 16px;*/
        /*margin-bottom: 16px;*/
        margin-right: 16px;
    }
    .yzpl {
        width: 120px;
        height: 120px;
        position: absolute;
        top: 10px;
        right: 20px;
    }
    .zanImg{
        width: 25px;
        height: 25px;
    }
    .wuPl{
        text-align: center;
        padding-top: 10px;
        padding-bottom: 250px;
    }
    /*<!--商品详情弹出框-->*/
    .backDiv{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.4);
        justify-content: center;
        align-items: center;

    }
    .box {
        width: 650px;
        background-color: #fff;
        border-radius: 20px;
        overflow: hidden;
        flex-direction: column;
    }
    .del {
        width: 60px;
        height: 60px;
        position: absolute;
        right: 8px;
        top: 8px;
        background-color: #53beb7;
        color: #ffffff;
        opacity: 0.8;
        border-radius: 30px;
        font-size: 36px;
        line-height: 60px;
        text-align: center;
    }
    .del:active{
        background-color: #f1f1f1;
    }
    .box_Img{
        width: 650px;
        height: 650px;
    }
    .box_name{
        margin-top: 20px;
        margin-right: 20px;
        margin-left: 20px;
        text-align: center;
    }
    .shopDetailName{
        text-align: left;
        font-weight: bold;
    }
    .box_activityTips{
        flex-direction: row;
        margin-left: 20px;
    }
    .boxDetails {
        line-height: 30px;
        margin-left: 20px;
        margin-right: 20px;
    }
    .box_spec{
        margin-left:20px;
        flex-direction: column;


    }
    .box_size{
        flex-direction: column;
        margin-top: 20px;

    }
    .box_sizeAttr{
        margin-top: 10px;
    }
    .box_guigeName{
        margin-right: 30px;
        flex: 1;
        margin-top: 20px;
        margin-left: 10px;

    }
    .box_guigeNameR{
        flex: 1;
        flex-direction: row;
        flex-wrap: wrap;
    }
    .box_specClass{
        text-align: center;
        margin-left: 10px;
        margin-right: 10px;
        padding-left: 40px;
        padding-right: 40px;
        margin-top: 15px;
        margin-bottom: 15px;
        padding-top: 15px;
        padding-bottom: 15px;
        border-width: 1px;
        border-style: solid;
        border-color: #dedede;
        border-radius: 8px;
        max-width: 590px;
        text-overflow: ellipsis;
        lines: 1
    }
    .box_taste{
        flex-direction: column;
    }
    .box_bott{
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: 650px;
        /*padding-top: 20px;*/
        padding-bottom: 20px;
    }
    .spec_bott{
        background-color: #f1f1f1;
        padding-top: 20px;
    }

    .box_price{
        flex-direction: row;
        align-items: flex-end;
    }
    .box_sale{
        color: #f00;
        margin-left: 22px;
        font-weight: bold;
    }
    .choiceTipText{
        color: #999;
        padding-bottom: 8px;
    }
    .choiceTipNameText{
        flex-direction: row;
        lines:1;
        text-overflow: ellipsis;
        max-width: 260px;
    }
    .box_okbtn{
        color: #fff;
        line-height: 60px;
        justify-content: center;
        padding-left: 25px;
        padding-right: 25px;
        background-color: #dedede;
        border-radius: 10px;
        margin-right: 20px;
        height: 60px;
    }
    .box_btn{
        background-color: #53beb7;
    }
    .select{
        background-color: rgba(83, 190, 183, 0.1);
        color: #53beb7;
        border-width: 1px;
        border-style: solid;
        border-color: #53beb7;

    }
    .guigeNumbDiv{
        height: 30px;
        text-align: center;
        line-height: 30px;
        color: #fff;
        background-color: #f00;
        position: absolute;
        bottom: 35px;
        right: 25px;
        border-radius: 30px;
    }
    .myText{
        max-width: 350px;
        lines:1;
        text-overflow: ellipsis;
    }
    .spec-color{
        margin-top: 10px;
        max-width: 350px;
        lines:1;
        text-overflow: ellipsis;
    }
    .catName_class{
        margin-bottom:95px;
        background-color: #EDFFFE;
        position:absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 188px
    }
    .numbText{
        height: 30px;
        text-align: center;
        line-height: 30px;
        color: #fff;
        background-color: #f00;
        position: absolute;
        top: 10px;
        right: 10px;
        border-radius: 30px;
    }
    .couponImg{
        width: 610px;
        height: 880px;
    }
    .couponContent{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        flex-direction: column;
        align-items: center;
    }
    .couponContent_top{
        flex: 1;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }
    .couponContent_buttom{
        flex: 2;
    }
    .halfTopWord{
        font-size: 70px;
        color: #000;
        font-weight: bold;
    }
    .couponScroller{
        flex: 1;
        align-items: center;
    }
    .allCouponDiv{
        position: relative;
        margin-top: 10px;
    }
    .couponBoxImg{
        width: 540px;
        height: 150px;
        transform: rotate(180deg);
    }
    .couponDetailContent{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        flex-direction: row;
        align-items: center;
        width: 540px;
        height: 150px;

    }
    .couponDetailPrice{
        flex-direction: row;
        flex: 1;
        text-align: center;
        align-items: flex-end;
        justify-content: center;


    }
    .couponDetailTip{
        flex-direction: column;
        justify-content: center;
    }
    .rmbText{
        font-size: 35px;
        color: rgba(255,5,0,0.8);
        margin-bottom: 7px;
        font-weight: bold;
    }
    .detailPriceText{
        font-size: 60px;
        color: #f00;
        font-weight: bold;
    }
    .useCouponText{
        font-size: 22px;
        color: #fff;
    }
    .couponTime{
        font-size: 22px;
        color: #fff;
        margin-top: 5px;
    }
    .boxBottom{
        flex-direction: row;
        align-items: center;
        justify-content: center;
        width: 540px;
        padding-bottom: 30px;
        padding-top: 30px;
    }
    .boxBottomLine{
        border-top-width: 1px;
        border-top-style: solid;
        border-top-color: #d4d4d4;
        flex: 0.5;
    }
    .boxBottomTips{
        margin-left: 20px;
        margin-right: 20px;
        font-size: 35px;
        color: #fff;
    }
    .zanStyle{
        position: absolute;
        bottom: 600px;
        left: 325px;
        opacity:0;
        width: 100px;
        height: 100px;
    }
    .catNameText{
        flex-direction: row;
        padding-left: 198px;
        padding-right: 30px;
        height: 80px;
        line-height: 80px;
        position: sticky;
        position: -webkit-sticky;
        background-color: #fff;
        font-weight: bold;
        width: 750px;
        lines:1;
        text-overflow: ellipsis;
    }
    .topBody-right{
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        height: 160px;
        padding-right: 20px;
        padding-bottom: 4px;
    }
    .boxs {
        position: absolute;

        left: 0;
        right: 0;
        /*bottom: 95px;*/

        transition-property: transform;
        transition-duration: 0s;
        transition-timing-function:cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .topBody_message{
        flex: 1;
        margin-left: 20px;
        justify-content: space-between;
        height: 150px;
        position: relative;
        transition-property: opacity;
        transition-duration: 0s;
        transition-timing-function:cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .topBody_img{
        transition-property: transform;
        transition-duration: 0s;
        transition-timing-function:cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .top_activity{
        opacity: 0;
        transition-property: opacity;
        transition-duration: 0s;
        transform-origin:top left;
        transition-timing-function:cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .top_notice{
        flex-direction: column;
        margin-top: 40px;
        padding-left: 20px;
    }
    .top_bottomArrow{
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        height: 100px;
        background-color: rgba(255,255,255,0.7);
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }
    .double_arrowImg {
        width: 50px;
        height: 50px;
    }
    /*底部预订提醒*/
    .bottom {
        position: fixed;
        height: 100px;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: #fff;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
    }
    /*团购*/
    .tkDishes {
        background-color: #f8f8f8;
    }
    .tkFood{
        flex-direction: column;
        padding-left: 188px;
    }
    .tkGoods{
        flex-direction: row;
        align-items: center;
        padding-bottom: 15px;
        padding-top: 10px;
        padding-left: 10px;
        background-color: #fff;
    }
    .spec-tkMarket{
        flex-direction: column;
    }
    .tk_backDiv{
        display: flex;
        flex-direction: row;
        align-items: center;
        padding-top: 20px;
        padding-bottom: 20px;
        padding-left: 15px;
        background-color: #fff;
    }
    .tk_backText{
        padding-right: 15px;
    }
    .mealDetail {
        display: flex;
        flex-direction: column;
    }
    .detailDiv{
        margin-top: 20px;
        background-color: #fff;
        padding-left: 10px;
        padding-right: 10px;
    }
    .mealKindTwo {
        flex-direction: row;
        padding-top: 5px;
        padding-bottom: 5px;
    }
    .mealKindWrap{
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }
    .mealDiv{
        display: flex;
        flex-direction: row;
        line-height: 40px;
    }
    .aiCenter {
        flex-direction: row;
        align-items: center;
    }
    .inforName {
        line-height: 60px;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
    .moreInfo{
        margin-top: 20px;
        padding-top: 20px;
        padding-left: 10px;
        padding-right: 10px;
        padding-bottom: 20px;
        background-color: #fff;
    }

    .mealKind {
        flex-direction: row;
        padding-top: 10px;
        padding-bottom: 10px;
        justify-content: space-between;
    }

    .mealKind_name {
        max-width: 320px;
        lines:1;
        text-overflow: ellipsis;
    }

    .mealKind_numb {
        font-size: 24px;
        color: #9d9d9d;
    }
    .mealKind_money {
        text-align: center;
        margin-right: 10px;
    }
    .noPinLun{
        width: 750px;
        height: 800;
        justify-content: center;
        align-items: center;
    }

    .noOrderIcon{
        width: 200px;
        height: 200px;
    }



    /*上拉加载*/
    .loading {
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
    .loadingIndicator {
        margin-top: 10px;
        height: 80px;
        width: 80px;
        color: #53beb7;
        margin-bottom: 15px;

    }
    /*查看大图*/
    .popupBox{
        width: 750px;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex: 1;
    }
    .enlargeImageSlider {
        width: 750px;
        flex: 1;

    }
    .enlargeImageListDiv{
        justify-content: center;
        align-items: center;
        width: 750px;
    }
    .indicator {
        height: 80px;
        item-color: #dedede;
        item-selected-color: #53beb7;
        item-size: 15px;
        position: absolute;
        bottom:30px;
        left: 0px;
        width: 750px;
        justify-content: center;
        align-items: center;
    }
    .shopCar_goodsName{
        max-width: 350px;
        lines:1;
        text-overflow: ellipsis;
    }
</style>
