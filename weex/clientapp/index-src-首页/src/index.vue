<template>
    <div class="allBgColor" ref="wrapper" @viewappear="viewappear" @viewdisappear="viewdisappear" >

        <!--订单组件-->
        <div class="orderPrompt fdRow" v-if="newsOrder" @click="">
            <div class="fdRow aiCenter">
                <div class="orderPromptImg"><image class="orderPromptImg" :src="'https://image.aftdc.com/'+newsOrder.shopImg"></image></div>
                <div class="orderPromptInfo">
                    <text :style="{fontSize: GLOBAL.smallFS,color: 'white',lineHeight:'36px',fontWeight:'bold'}">{{newsOrder.tip}}</text>
                    <div class="fdRow"><text :style="{fontSize:GLOBAL.smallerFS,color: 'white'}" v-if="newsOrder.btipl">{{newsOrder.btipl}}</text><text :style="{fontSize:GLOBAL.smallerFS,color: '#fffb00'}" v-if="newsOrder.btipr">: {{newsOrder.btipr}}</text></div>
                </div>
            </div>
            <image class="orderPromptGo" src="https://image.aftdc.com/images/ic_come_into.png"></image>
        </div>
        <!--进页面动画-->
        <div class="loadingAin" v-if="loadingAin.getIndexInfo || loadingAin.getShops || loadingAin.getOrderPrompt">
            <image class="indicatorAin" src="https://image.aftdc.com/appBimg/ic_loading_gif.gif"></image>
            <text  :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">马上到了...</text>
        </div>

        <slider class="size" infinite="false" :index="tabIndex" @change="changeSlider">
            <!--首页 页面-->
            <div class="block">
                <!--<div style="background-color: red">tet</div>-->
                <!--<list class="scroller" :style="{backgroundColor:themeColor!=1?'rgb('+themeColor+')':'#53beb7'}"  show-scrollbar="false">-->
                <list ref="list" class="scroller" style="top: -1px" show-scrollbar="false" @scroll="onScroll">
                    <refresh class="refresh" @refresh="onrefreshShops"  :display="refreshing ? 'show' : 'hide'">
                        <image class="indicator" src="https://image.aftdc.com/appBimg/ic_loading_gif.gif"></image>
                    </refresh>
                    <cell>
                        <div class="indexTop" ref="firBlock" :style="{backgroundColor:themeColor!=1?themeColor:'#53beb7'}">
                            <div class="indexTop_top">
                                <div class="top_address" @click="openMap">
                                    <image class="nearbyDWImg" src="https://image.aftdc.com/images/nearbyDW.png"></image>
                                    <text class="indexTop_address" :style="{fontSize:GLOBAL.bigFS}">{{addclass}}</text>
                                </div>
                                <div class="top_weather">
                                    <div class="weather_left">
                                        <text class="weather_numb" :style="{fontSize:GLOBAL.smallFS}">{{weather.temp}}°C</text>
                                        <text class="weather_numb" :style="{fontSize:GLOBAL.smallFS}">{{weather.weather}}</text>
                                    </div>
                                    <image class="weatherImg" :src="'https://image.aftdc.com/images/weatherImg/W'+weather.weatherImg+'.png'"></image>
                                </div>
                            </div>
                            <text class="searchTextSec" @click="toSearch" :style="{fontSize:GLOBAL.defaultFS}">搜索商家、商品名称</text>
                        </div>
                        <div class="carousel" :class="[orderHistory.length < 1 ? 'noCarousel':'']">
                            <div ref="test" :class="[scrollsTransform?'scrollsTransform':'']">
                                <div class="historyOrder" :style="{backgroundColor:themeColor!=1?themeColor:'#53beb7'}" v-for="(item,index) in orderHistory" @click="toShopDetails(item.shopId)">
                                    <div style="border-radius: 20px">
                                        <image class="headSculpture" :src="item.userPhoto"></image>
                                    </div>
                                    <div class="historyOrderContent">
                                        <div class="orderContent" style="margin-right: 20px;">
                                            <text class="orderName">{{item.userName}}</text>
                                            <text class="orderTimeText">{{item.times}}在</text>
                                            <text class="orderShopName orderTimeText">{{item.shopName}}</text>
                                            <text class="orderTimeText">下了一笔订单</text>
                                        </div>
                                        <div class="orderContent">
                                            <text class="orderContentBorderText" :style="{fontSize:GLOBAL.smallerFS}">{{item.cuisine}} {{item.city}} {{item.county}}</text>
                                            <text class="orderContentBorderText" :style="{fontSize:GLOBAL.smallerFS}">{{item.fansNum}} 粉丝 {{item.dongtaiNum}} 动态</text>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="iconSearch">
                            <div class="textIcon" v-for="(item,index) in iconSearch" interval="1000" @click="chooseShopType(item.shopType,item.orderType)">
                                <image class="iconSearchImg" :src="'https://image.aftdc.com/'+item.icon"></image>
                                <text class="iconSearchText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.name}}</text>
                            </div>
                        </div>
                        <div class="slider" @click="toPersonalList('http://assets/entry.js')">
                            <image class="sliderSize" resize="cover" src="https://image.aftdc.com/images/packageA/ruzhu.jpg"></image>
                        </div>
                        <div class="recommendation">
                            <div class="line"></div>
                            <text class="recommendationText" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">智能推荐</text>
                            <div class="line"></div>
                        </div>
                    </cell>
                    <cell style="position: sticky ;background-color: white">
                        <div class="navClassfly" ref="navClassfly">
                            <div class="allClassfly">
                                <text class="allClassflySize" :class="[choiceSearch===0?'choiceSearchStyle':'']"  @click="mainChoiceSearchClick(0)" :style="{fontSize:GLOBAL.bigFS,color:choiceSearch===0?GLOBAL.tColor:GLOBAL.dColor}">{{comprehensiveRanking[rankingChoiceIndex].name}}</text>
                                <image class="downArrow_classfly" src="https://image.aftdc.com/appBimg/ic_expanded_down.jpg"></image>
                            </div>
                            <text class="classflySize" :class="[choiceSearch===1?'choiceSearchStyle':'']"  @click="mainChoiceSearchClick(1)" :style="{fontSize:GLOBAL.bigFS,color:choiceSearch===1?GLOBAL.tColor:GLOBAL.dColor}">好评优先</text>
                            <text class="classflySize" :class="[choiceSearch===2?'choiceSearchStyle':'']"  @click="mainChoiceSearchClick(2)" :style="{fontSize:GLOBAL.bigFS,color:choiceSearch===2?GLOBAL.tColor:GLOBAL.dColor}">离我最近</text>
                            <div class="screenClassfly">
                                <text class="allClassflySize" :class="[choiceSearch===3?'choiceSearchStyle':'']"  @click="mainChoiceSearchClick(3)" :style="{fontSize:GLOBAL.bigFS,color:choiceSearch===3?GLOBAL.tColor:GLOBAL.dColor}">筛 选</text>
                                <image class="screenImg" src="https://image.aftdc.com/images/sxuan.png"></image>
                            </div>
                        </div>
                    </cell>
                    <cell style="background-color: white">
                        <div class="shopShow" ref="shopShowRef" v-for="(item,index) in shops" @click="toShopDetails(item.shopId)">
                            <div class="shopContentLeft">
                                <image class="shopImg":src="'https://image.aftdc.com/'+item.shopImg"></image>
                                <text class="isOpen" v-if="item.shopAtive == 2" :style="{fontSize:GLOBAL.defaultFS}">休息中</text>
                                <text class="isOpen" v-if="item.gz == 1" :style="{fontSize:GLOBAL.defaultFS}">广告</text>
                            </div>
                            <div class="shopContent">
                                <div class="shopContentTop">
                                    <text class="shopContentName" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">{{item.shopName}}</text>
                                    <div class="avgAndTime">
                                        <div class="shopAvg">
                                            <div class="star">
                                                <image class="starSize" src="https://image.aftdc.com/appBimg/icon_wuxing_nocolor.png"></image>
                                                <div class="shopAvgImg" :style="{width:item.shopAvg*25+'px'}">
                                                    <image class="starSize"  src="https://image.aftdc.com/appBimg/icon_wuxing_color.png"></image>
                                                </div>
                                            </div>
                                            <text :style="{fontSize:GLOBAL.smallerFS,color:GLOBAL.dColor}">月销{{item.monthlySales}}</text>
                                        </div>
                                        <div class="shopTime">
                                            <text class="shopTimeSize" :style="{fontSize:GLOBAL.smallerFS,color:GLOBAL.dColor}">{{item.deliveryCostTime}}分钟</text>
                                            <text class="shopPlaceSize" :style="{fontSize:GLOBAL.smallerFS,color:GLOBAL.dColor}">{{item.distance}}</text>
                                        </div>
                                    </div>
                                    <div class="givePrice">
                                        <text class="startingPrice" :style="{fontSize:GLOBAL.smallerFS,color:GLOBAL.dColor}">起送￥{{item.qsj}}</text>
                                        <text class="distributionPrice" :style="{fontSize:GLOBAL.smallerFS,color:GLOBAL.dColor}">配送￥{{item.psf}}</text>
                                        <text class="perCapitaPrice" :style="{fontSize:GLOBAL.smallerFS,color:GLOBAL.dColor}">人均￥{{item.avgeCostMoney}}</text>
                                    </div>
                                    <div class="givePrice">
                                        <text class="startingPrice" :style="{fontSize:GLOBAL.smallerFS,color:GLOBAL.dColor}">{{item.fansNum}} 粉丝</text>
                                        <text class="distributionPrice" :style="{fontSize:GLOBAL.smallerFS,color:GLOBAL.dColor}">{{item.dongtaiNum}} 动态</text>
                                        <image class="timeImg" src='https://image.aftdc.com/images/shijian.png'></image>
                                        <text class="perCapitaPrice timeBeginSize" :style="{fontSize:GLOBAL.smallerFS,color:GLOBAL.tColor}">{{item.serviceTime}}营业</text>
                                        <!--<text class="defaultSize shopContentSize perCapitaPrice timeBeginSize">{{item.serviceStartTime}}-{{item.serviceEndTime}} 营业</text>-->
                                    </div>
                                </div>

                                <div class="shopContentButtom" :style="{height:item.projectLay || item.projectNum < 3 ?'':'80px'}">
                                    <div class="shopActiveDiv" @click="unfolding(index)">
                                        <div class="shopActive" v-if="item.mj">
                                            <text class="activeTips active_mj" :style="{fontSize:GLOBAL.smallFS}">减</text>
                                            <text class="shopActiveContentSize" :style="{fontSize:GLOBAL.smallFS,width:'400px'}">{{item.youhui}}</text>
                                        </div>
                                        <div class="shopActive" v-if="item.newCou">
                                            <text class="activeTips active_xin" :style="{fontSize:GLOBAL.smallFS}">新</text>
                                            <text class="shopActiveContentSize" :style="{fontSize:GLOBAL.smallFS}">新用户立减{{item.newCou}}元</text>
                                            <text class="shopActiveContentSize" v-if="item.projectNum>2&&!item.projectLay&&item.youhui" :style="{fontSize:GLOBAL.smallFS}">...</text>
                                        </div>
                                        <div class="shopActive" v-if="item.zk">
                                            <text class="activeTips active_zk" :style="{fontSize:GLOBAL.smallFS}">折</text>
                                            <text class="shopActiveContentSize" :style="{fontSize:GLOBAL.smallFS}">限时折扣商品</text>
                                            <text class="shopActiveContentSize" v-if="item.projectNum>2&&!item.projectLay&&(item.mj||item.newCou)" :style="{fontSize:GLOBAL.smallFS}">...</text>
                                        </div>
                                        <div class="shopActive"  v-if="item.hb">
                                            <text class="activeTips active_hb" :style="{fontSize:GLOBAL.smallFS}">红</text>
                                            <text class="shopActiveContentSize" :style="{fontSize:GLOBAL.smallFS}">进店领红包</text>
                                            <text class="shopActiveContentSize" v-if="item.projectNum>2&&!item.projectLay&&(item.mj||item.newCou||item.zk)" :style="{fontSize:GLOBAL.smallFS}">...</text>
                                        </div>
                                        <div class="shopActive" v-if="item.mz">
                                            <text class="activeTips active_mz" :style="{fontSize:GLOBAL.smallFS}">赠</text>
                                            <text class="shopActiveContentSize" :style="{fontSize:GLOBAL.smallFS}">购买指定商品有赠品</text>
                                            <text class="shopActiveContentSize" v-if="item.projectNum>2&&!item.projectLay&&(item.mj||item.newCou||item.zk||item.hb)" :style="{fontSize:GLOBAL.smallFS}">...</text>
                                        </div>
                                        <div class="shopActive" v-if="item.jf">
                                            <text class="activeTips active_jf" :style="{fontSize:GLOBAL.smallFS}">积</text>
                                            <text class="shopActiveContentSize" :style="{fontSize:GLOBAL.smallFS}">购买赠送积分</text>
                                        </div>
                                    </div>
                                    <div class="shopContentMore" @click="contentMoreClick(index)">
                                        <text class=" " style="text-align: center;line-height: 40px;color: #dedede;font-size: 35px">...</text>
                                    </div>
                                </div>
                            </div>
                            <text class="guigeNumbDiv" v-if="item.goodsNumb" :style="{fontSize:'18px',width:item.goodsNumb>99?'36px':'30px'}">{{item.goodsNumb>99?'99+':item.goodsNumb}}</text>
                            <div class="chooseLayer" :style="{height:chooseLayerHeight+'px'}" v-if="item.closeHobby" @click.stop="chooseLayerClick(index)" >
                                <div class="circle" @click="collectAndFollow(index,item.shopId,'attentionType')">
                                    <image class="circleImg" v-if="item.attentionType==1" src='https://image.aftdc.com/images/attention3.png'></image>
                                    <image class="circleImg" v-else src='https://image.aftdc.com/images/attention4.png'></image>
                                    <text class="circleText" v-if="item.attentionType==1" :style="{color:GLOBAL.dColor}">已关注</text>
                                    <text class="circleText"  v-else :style="{color:GLOBAL.dColor}">关注</text>
                                </div>
                                <div class="circle"  @click="collectAndFollow(index,item.shopId,'colType')">
                                    <image class="circleImg" v-if="item.colType==1" src='https://image.aftdc.com/images/Collection1.png'></image>
                                    <image class="circleImg" v-else src='https://image.aftdc.com/images/sooucan2.png'></image>
                                    <text class="circleText" v-if="item.colType==1" :style="{color:GLOBAL.dColor}">已收藏</text>
                                    <text class="circleText"  v-else :style="{color:GLOBAL.dColor}">未收藏</text>
                                </div>
                                <div class="circle"  @click="findSimilarity(item.cuisineId)">
                                    <image class="circleImg" src='https://image.aftdc.com/images/zxs.png'></image>
                                    <text class="circleText" :style="{color:GLOBAL.dColor}">找相似</text>
                                </div>
                            </div>

                        </div>
                        <!--<div class="noMore row aiCenter" v-if="shopsNothing && shops.length > 0">-->
                        <!--<div class="noMoreLine"></div>-->
                        <!--<text :style="{fontSize:GLOBAL.defaultFS,color: '#aaaaaa'}">      没有更多店铺了      </text>-->
                        <!--<div class="noMoreLine"></div>-->
                        <!--</div>-->
                        <text class="nothing" v-if="shops.length === 0" :style="{fontSize:GLOBAL.bigFS}">附近暂无商家或无您筛选的结果</text>

                    </cell>
                    <loading class="loading" @loading="onloadingShops" :display="loadinging ? 'show' : 'hide'">
                        <text :style="{fontSize:GLOBAL.bigFS,color: '#888888',lineHeight:'132px'}" v-if="shopsNothing && shops.length > 0">没有更多店铺了</text>
                        <image class="indicator" src="https://image.aftdc.com/appBimg/ic_loading_gif.gif" v-else></image>
                    </loading>
                </list>
                <!--筛选框-->
                <div class="classfly" :style="classflyStyle" @click="" >
                    <div class="newNavClassfly">
                        <div class="allClassfly">
                            <text class="allClassflySize" :class="[choiceSearch===0?'choiceSearchStyle':'']" @click="choiceSearchClick(0)" :style="{fontSize:GLOBAL.bigFS,color:choiceSearch===0?GLOBAL.tColor:GLOBAL.dColor}">综合排序</text>
                            <image class="downArrow_classfly"
                                   src="https://image.aftdc.com/appBimg/ic_expanded_down.jpg"></image>
                        </div>
                        <text class="classflySize" :class="[choiceSearch===1?'choiceSearchStyle':'']"   @click="choiceSearchClick(1)" :style="{fontSize:GLOBAL.bigFS,color:choiceSearch===1?GLOBAL.tColor:GLOBAL.dColor}">好评优先</text>
                        <text class="classflySize"  :class="[choiceSearch===2?'choiceSearchStyle':'']"  @click="choiceSearchClick(2)" :style="{fontSize:GLOBAL.bigFS,color:choiceSearch===2?GLOBAL.tColor:GLOBAL.dColor}">离我最近</text>
                        <div class="screenClassfly">
                            <text class="allClassflySize" :class="[choiceSearch===3?'choiceSearchStyle':'']"   @click="choiceSearchClick(3)" :style="{fontSize:GLOBAL.bigFS,color:choiceSearch===3?GLOBAL.tColor:GLOBAL.dColor}">筛 选</text>
                            <image class="screenImg" src="https://image.aftdc.com/images/sxuan.png"></image>
                        </div>
                    </div>
                    <scroller show-scrollbar="false" style="flex: 1" v-if="choiceSearch==0">

                        <text class="rankingContent" @click="rankingChoice(index)" :style="{fontSize:GLOBAL.bigFS,color:rankingChoiceIndex==index?GLOBAL.tColor:GLOBAL.dColor}" v-for="(item,index) in comprehensiveRanking">{{item.name}}</text>

                    </scroller>
                    <scroller show-scrollbar="false" v-if="choiceSearch==3" style="flex: 1">
                        <!--营业时段-->
                        <div>
                            <text class="screenTitle" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{timeScreen.title}}</text>
                            <div style="align-items: center">
                                <div class="allCuisuneDiv">
                                    <div class="allScreen" v-for="(item,index) in timeScreen.time" @click="timeScreenClick(index)">
                                        <text class="screen" :class="[allChoice.mealtime===index+1?'cuisuneColor':'']" :style="{fontSize:GLOBAL.defaultFS,color:allChoice.mealtime===index+1?GLOBAL.tColor:GLOBAL.dColor}">{{item}}</text>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!--人均价格-->
                        <div>
                            <text class="screenTitle" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{priceScreen.title}}</text>
                            <div style="align-items: center">
                                <div class="allCuisuneDiv">
                                    <div class="allScreen" v-for="(item,index) in priceScreen.price" @click="priceScreenClick(index)">
                                        <text class="screen" :class="[allChoice.price === index+1?'cuisuneColor':'']" :style="{fontSize:GLOBAL.defaultFS,color:allChoice.price=== index+1?GLOBAL.tColor:GLOBAL.dColor}">{{item}}</text>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!--优惠活动-->
                        <div>
                            <text class="screenTitle" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{activeScreen.title}}</text>
                            <div style="align-items: center">
                                <div class="allCuisuneDiv">
                                    <div class="allActiveDiv" v-for="(item,index) in activeScreen.active" @click="activeScreenClick(index)">
                                        <text class="activeTips" :style="{fontSize:GLOBAL.smallFS,backgroundColor:item.backgroundColor}">{{item.backgroundName}}</text>
                                        <text class="activeText" :style="{fontSize:GLOBAL.defaultFS,color:item.check?GLOBAL.tColor:GLOBAL.dColor}">{{item.activeName}}</text>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </scroller>
                    <div class="termboxBot">
                        <text @click="delClassflyClick()" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{choiceSearch==0?'清除排序':'清除筛选'}}</text>
                        <text class="classflySure" @click="allScreenSure()">确定</text>
                    </div>
                    <div class='classflyCancel' @click="classflyCancelClick()">
                        <image class="classflyCancelImg" src='https://image.aftdc.com/images/cancel.png'></image>
                    </div>
                </div>
            </div>

            <!--订单 页面-->
            <div class="block">
                <div class="orderBar">
                    <text :style="GLOBAL.headerCenter">订单</text>
                </div>
                <list show-scrollbar="false" v-if="order.length>0">

                    <refresh class="refresh" @refresh="onrefreshOrder" :display="refreshing? 'show' : 'hide'">
                        <image class="indicator" src="https://image.aftdc.com/appBimg/ic_loading_gif.gif"></image>
                    </refresh>

                    <cell>
                        <div class="recentlyOrder" @click="toOrderDetails(index)" v-for="(item,index) in order" :key="index">

                            <image class="recentlyOrderShopImg" :src="'https://image.aftdc.com/'+item.shopImg"></image>
                            <div class="recentlyOrderContent">
                                <div class="recentlyOrderContent_top">
                                    <text class="recentlyOrderShopName" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.shopName}}</text>
                                    <div class="orderType">

                                        <text class="state">{{item.orderTypeInfo}} {{item.orderStatusInfo}}</text>

                                    </div>
                                </div>
                                <text class="time" :style="{fontSize:GLOBAL.defaultFS}">下单时间: {{item.createTime}}</text>
                                <div class="recentlyOrderContent_bottom">
                                    <text class="shopPriceText" :style="{fontSize:GLOBAL.defaultFS}">总价:￥{{item.needPay}}</text>
                                    <div class="recentlyOrderContent_button">
                                        <text class="recentlyOrder_btn" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.tColor}" v-if="item.orderStatus == -2" @click="goPay(index)">立即付款</text>
                                        <text class="recentlyOrder_btnback" :class="[item.reminder==3?'isReminder':'']" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.tColor}" v-if="item.canRemind == 1" @click="reminder(index)">{{item.reminder==0?'催单':item.reminder==1?'继续催单':item.reminder==3?'已催单':''}}</text>
                                        <text class="recentlyOrder_btn" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.tColor}" v-if="item.orderStatus ==-1 || item.orderStatus == -3 || item.orderStatus == -4 || item.orderStatus == -6" @click="tkProcess(index)">退款进度</text>
                                        <text class="recentlyOrder_btn" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.tColor}" v-if="(item.orderStatus == 1 || item.orderStatus == 3) && item.orderType != 3" @click="confirmGet(index)">确认收货</text>
                                        <text class="recentlyOrder_btn" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.tColor}" v-if="item.orderStatus == 1 && item.orderType == 3" @click="confirmGet(index)">已用餐</text>
                                        <text class="recentlyOrder_btn" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.tColor}" v-if="item.orderStatus == 0 && (item.orderType==6 || item.orderType==7)" @click="toOrderDetails(index)">去使用</text>
                                        <text class="recentlyOrder_btn" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.tColor}" v-if="item.orderStatus == -7||item.orderStatus == 4 || item.isAppraises == 1||item.orderStatus ==-1 || item.orderStatus == -3 || item.orderStatus == -4 || item.orderStatus == -6" @click="oneMore(index)">再来一单</text>
                                        <text class="recentlyOrder_btn" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.tColor}" v-if="item.orderStatus == 4&&item.isAppraises==0" @click="evaluate(index)">评价</text>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="moreRecentlyOrder" v-if="!noMore">
                            <text class="moreRecentlyOrderText">没有更多订单了</text>
                        </div>
                    </cell>

                    <loading v-if="noMore" class="loading" @loading="onloadingOrder" :display="loadinging ? 'show' : 'hide'">
                        <image class="indicator" src="https://image.aftdc.com/appBimg/ic_loading_gif.gif"></image>
                    </loading>

                </list>
                <noOrder img="https://image.aftdc.com/appBimg/icon_no_order.png" textOne="暂无订单" textTwo="可以去看看哪些想买的" v-if="order.length<=0"></noOrder>
                <div class="orderLoadingAin" v-if="orderLoadingAin">
                    <image class="indicatorAin" src="https://image.aftdc.com/appBimg/ic_loading_gif.gif"></image>
                    <text  :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">马上到了...</text>
                </div>

            </div>

            <!--餐头条 页面-->
            <div class="block">
                <div class="headerH" :style="{backgroundColor:themeColor!=1?themeColor:'#53beb7'}">
                    <div class="newsHeaderMiddle aiCenter jcCenter">
                        <div class=" newsSearch" @click="toArticleSearch">
                            <image class="articleSearchImg" src="https://image.aftdc.com/appBimg/icon_search.png"></image>
                            <text class="articleSearchText" :style="{fontSize:GLOBAL.bigFS}">搜索头条、小视频</text>
                        </div>
                    </div>
                </div>
                <div>
                    <scroller class="tabScroller" scroll-direction="horizontal" show-scrollbar="false">
                        <div class="headLineTab" style="justify-content: space-between">
                            <div class="headLineTabList" v-for="(item,index) in headLineTab" :class="[headLineTabIndex===index?'headLineTabListChoice':'']" :key="index" @click="headLineTabIndexClick(index)" ref="testEl">
                                <text class="headLineTabText" :style="{fontSize:GLOBAL.biggerFS,color:headLineTabIndex===index?GLOBAL.tColor:GLOBAL.dColor}">{{item.name}}</text>
                            </div>
                        </div>
                    </scroller>
                </div>
                <slider class="headLineSlider" infinite="false" :index="headLineTabIndex" @change="changeHeadLineSlider" >
                    <list show-scrollbar="false" class="headLineBlock" v-for="(items,indexs) in headLineArticle" :key="indexs">
                        <refresh class="refresh" @refresh="onrefreshNews(indexs)"  :display="refreshing ? 'show' : 'hide'">
                            <image class="indicator" src="https://image.aftdc.com/appBimg/ic_loading_gif.gif"></image>
                        </refresh>
                        <cell class="newsLoadingAin" v-if="newsLoadingAin[indexs]">
                            <image class="indicatorAin" src="https://image.aftdc.com/appBimg/ic_loading_gif.gif"></image>
                            <text  :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">马上到了...</text>
                        </cell>
                        <cell v-if="headLineArticle[indexs].arr.length < 1 && !newsLoadingAin[indexs]">
                            <text class="noArticle" :style="{color:GLOBAL.dColor}">暂无相关文章</text>
                        </cell>
                        <cell class="headLineContent" ref="firHeadLineTab" v-for="(item,index) in items.arr" @click="toArticleContent(item.id)">
                            <div class="contentStyle"  :class="[index===4?'noBorder':'']">
                                <div v-if="item.cover_type!=1">
                                    <div class="fdRow aiCenter activeHeadInfo">
                                        <div class="fdRow aiCenter">
                                            <div class="ArticlePortrait"><image class="ArticlePortrait" :src="'https://image.aftdc.com/'+item.shopImg"></image></div>
                                            <text class="shopAnTimeSize" :style="{fontSize:GLOBAL.bigFS,marginLeft:'10px'}">{{item.shopName}}</text>
                                        </div>
                                        <text class="shopAnTimeSize" :style="{fontSize:GLOBAL.smallFS}">{{item.city}} {{item.distance}}</text>
                                    </div>
                                    <text :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">{{item.title}}</text>
                                    <div class="coverImgStyle" >
                                        <div class="threeImg" v-if="item.cover_type==3">
                                            <image resize="cover" class="threeImgSize" :src="'https://image.aftdc.com/'+item.cover_img[0]"></image>
                                            <image resize="cover" class="threeImgSize" :src="'https://image.aftdc.com/'+item.cover_img[1]"></image>
                                            <image resize="cover" class="threeImgSize" :src="'https://image.aftdc.com/'+item.cover_img[2]"></image>
                                        </div>
                                        <div class="bigImg" v-if="item.cover_type==2">
                                            <image resize="cover" class="bigImgSize" :src="'https://image.aftdc.com/'+item.cover_img[0]"></image>
                                        </div>
                                        <div class="videoImg" v-if="item.cover_type==5">
                                            <image resize="cover" class="bigImgSize" :src="'https://image.aftdc.com/'+item.cover_img[0]"></image>
                                            <div class="videoPlay">
                                                <image resize="cover" class="videoPlayImg" src="https://image.aftdc.com/appBimg/icon_vadeoPlay.png"></image>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="item.cover_type==1">
                                    <div class="fdRow aiCenter activeHeadInfo">
                                        <div class="fdRow aiCenter">
                                            <div class="ArticlePortrait"><image class="ArticlePortrait" :src="'https://image.aftdc.com/'+item.shopImg"></image></div>
                                            <text class="shopAnTimeSize toEllipsis" :style="{fontSize:GLOBAL.bigFS,marginLeft:'10px'}">{{item.shopName}}</text>
                                        </div>
                                        <text class="shopAnTimeSize" :style="{fontSize:GLOBAL.smallFS}">{{item.city}} {{item.distance}}5.6km</text>
                                    </div>
                                    <div class="smallImgContent">
                                        <text class="smallImgeText" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">{{item.title}}</text>
                                        <image resize="cover" class="smallImgSize" :src="'https://image.aftdc.com/'+item.cover_img[0]"></image>
                                    </div>
                                </div>
                                <div class="articleMessage">
                                    <text class="shopAnTimeSize" :style="{fontSize:GLOBAL.smallFS}">{{item.read_num}}{{item.cover_type===5?'播放':'阅读'}}  {{item.comment_num}}{{item.commentOrleaveWord==1?'评论':'留言'}}  {{item.praise_num}}点赞 {{item.timestamp}}</text>
                                    <text class="closeIcon" :style="{fontSize:GLOBAL.smallerFS}" @click="closeIconClick(indexs,index)" ref="closeTest">✕</text>
                                </div>
                            </div>
                        </cell>

                        <loading class="loading" @loading="onloadingNews(indexs)" :display="loadinging ? 'show' : 'hide'">
                            <text :style="{fontSize:GLOBAL.bigFS,color: '#888888',lineHeight:'132px'}" v-if="items.articleNothing && items.arr.length > 0">没有更多文章了</text>
                            <image class="indicator" src="https://image.aftdc.com/appBimg/ic_loading_gif.gif" v-else></image>
                        </loading>
                    </list>


                </slider>
            </div>

            <!--我的 页面-->
            <div class="block">
                <div class="personal">

                    <div class="userinfo" :style="{backgroundColor:themeColor!=1?themeColor:'#53beb7'}">
                        <div class="userinfo_left">
                            <div style="margin-top: 40px;margin-left: 40px;margin-bottom: 40px;border-radius:55px">
                                <image class="userinfo-avatar" :src="userPhoto" @click="toPersonalList('http://assets/personalInfo.js')" v-if="userPhoto !== ''"></image>
                                <image class="userinfo-avatar" src="http://www.bbvdd.com/d/20181109110021aq7.png" @click="toLogin()" v-else></image>
                            </div>
                            <div class="userinfo-word">
                                <text class="userinfo-nickname toEllipsis"  style="font-size: 30px" @click="toPersonalList('http://assets/personalInfo.js')" v-if="userName !== ''" >{{userName}}</text>
                                <text class="userinfo-nickname" style="font-size: 30px" @click="toLogin()" v-else>登录/注册</text>
                            </div>
                        </div>
                        <div style="flex-direction: row;align-items: center">
                            <image class="setUpImg" @click="toAftSet" src="https://image.aftdc.com/appBimg/icon_setUp.png"></image>
                        </div>
                    </div>
                    <div class="middleBox row" >
                        <div class='middleItem' @click="toPage('http://assets/followAanFans.js',0)">
                            <text class='number' :style="{color:GLOBAL.tColor}">{{userData.attentionNum}}</text>
                            <text :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">关注</text>
                        </div>
                        <div class='middleItem' @click="toPage('http://assets/followAanFans.js',1)">
                            <text class='number' :style="{color:GLOBAL.tColor}">{{userData.fansNum}}</text>
                            <text :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">粉丝</text>
                        </div>
                        <div class='middleItem' @click="toPersonalList('http://assets/personalHomepage.js')">
                            <text class='number' :style="{color:GLOBAL.tColor}">{{userData.dynamicNum}}</text>
                            <text :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">动态</text>
                        </div>
                    </div>

                    <div class="myList">
                        <div class="listItem row" :class="[index==4||index==6?'borderBOttom20':'']" v-for="(item,index) in personalBlock" @click="toPersonalList(item.url)">
                            <div class="aiCenter">
                                <image class="listItemImg" src="http://www.bbvdd.com/d/201811090925191my.png" v-if="index===3"></image>
                                <image class="listItemImg" :src="'https://image.aftdc.com/'+item.icon" v-else></image>
                            </div>
                            <div class="listItemRight row" :class="[index==4||index==6?'borderBottom0':'']">
                                <text :style="{fontSize:'30px',color:GLOBAL.dColor}">{{item.name}}</text>
                                <div class="row">
                                    <text class="newNum" v-if="index==4 && userData.messageNum">{{userData.messageNum}}</text>
                                    <image class="listItemIcon" src='https://image.aftdc.com/appBimg/ic_text_right.png'></image>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </slider>


        <div class="Tab" :style="{backgroundColor:themeColor=='#53beb7'?'#fff':themeColor!=1?themeColor:'#fff'}">
            <div class="Tablist"  v-for="(tab, i) in tabList" :key="i" @click="tabIndexClick(i)">
                <image class="TabImg" :src="tabIndex == i?tab.chooseTabImg:tab.tabImg"></image>
                <text class="TabName" :style="{fontSize:GLOBAL.defaultFS,color:tabIndex == i?GLOBAL.tColor:themeColor=='#53beb7'?GLOBAL.dColor:themeColor!=1?'#fff':GLOBAL.dColor}" >{{tab.tabName}}</text>
            </div>
        </div>



        <!--版本更新-->
        <wxc-mask height="1000"
                  width="560"
                  border-radius="15"
                  duration="200"
                  mask-bg-color="#FFFFFF"
                  :has-animation="true"
                  :has-overlay="true"
                  :show-close="false"
                  :overlay-can-close="false"
                  :show="show"
                  @wxcMaskSetHidden="wxcMaskSetHidden">
            <div class="update">
                <text class="updateTitle" :style="{fontSize:GLOBAL.biggestFS}">发现新版本4 5.1</text>
                <text class="updateContent" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">更新内容:</text>
                <div style="flex: 1">
                    <scroller class="updateScroller">
                        <text class="thisUpdate" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">本次更新</text>
                        <text class="thisUpdate" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}" v-for="item in thisUpdateList">- {{item.text}}</text>
                        <text class="thisUpdate" style="margin-top: 60px;" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">最近更新</text>
                        <text class="thisUpdate" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}" v-for="item in latelyUpdateList">- {{item.text}}</text>
                    </scroller>
                </div>

                <div class="ignoreDiv aiCenter" @click="ignoreClick">
                    <image class="ignoreIcon" :src="ignore?'https://image.aftdc.com/appBimg/ic_check_box_checked.png':'https://image.aftdc.com/appBimg/ic_check_box_normal.png'"></image>
                    <text class="ignoreText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">忽略该版本</text>
                </div>
                <div class="updateBtn aiCenter">
                    <text class="updateBtnLeft" :style="{fontSize:GLOBAL.bigFS}" @click="noUpdate">暂不更新</text>
                    <text class="updateBtnRight" :style="{fontSize:GLOBAL.bigFS}">立即更新</text>
                </div>

            </div>
        </wxc-mask>
        <!--餐头条操作新闻操作框-->
        <wxc-mask height="700"
                  width="680"
                  class="uninterestedBox"
                  border-radius="12"
                  duration="200"
                  mask-bg-color="rgba(255,255,255,0)"
                  :has-animation="hasAnimation"
                  :has-overlay="true"
                  :show-close="false"
                  :show="uninterested"
                  @wxcMaskSetHidden="uninterestedHidden">
            <div class="uninterestedBox" ref="uninterestedHeight" v-if="uninterested" >
                <div class="uninterested row">
                    <div class="uninterestedLeft" ref="ulEl" @click.stop="circleClick">
                        <div>
                        </div>
                        <div class="ulItem row" :class="[uninterestedText.length-1===index?'noBorder':'']"  v-for="(item,index) in uninterestedText" @click="uninterestedClick(index)">
                            <div class="row">
                                <div class="circleIcon" v-if="index!==2">
                                    <div class="forkOne" :class="[index===4?'tr0':'']" v-if="index===0||index===4&&!headLineArticle[xIndexs].arr[xIndex].attentionType"></div>
                                    <div class="forkTwo" :class="[index===4?'tr90':'']" v-if="index===0||index===3||index===4"></div>
                                    <div class="exclamatoryMarkOne" v-if="index===1"></div>
                                    <div class="exclamatoryMarkTwo" v-if="index===1"></div>
                                </div>
                                <image class="ulPullBlack" src="https://image.aftdc.com/appBimg/ic_pullBlack_gray.png" v-else></image>
                                <div>
                                    <text class="ulLineHeight" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}" v-if="index<2||index===3">{{item.title}}</text>
                                    <text class="ulLineHeight toEllipsis" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor,maxWidth:'500px'}" v-if="index===2">拉黑作者:{{headLineArticle[xIndexs].arr[xIndex].shopName}}</text>
                                    <text class="ulLineHeight" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}" v-if="index===4">{{headLineArticle[xIndexs].arr[xIndex].attentionType?'取消关注':'添加关注'}}</text>
                                    <text class="ulLineHeight gray" :style="{fontSize:GLOBAL.smallFS}" v-if="index<2">{{item.subTitle}}</text>
                                    <div class="row" v-if="index===3">
                                        <text class="ulLineHeight gray" :style="{fontSize:GLOBAL.smallFS}" v-for="(item,index) in headLineArticle[xIndexs].arr[xIndex].key_word" >{{item}}&nbsp;&nbsp;</text>
                                    </div>
                                </div>
                            </div>
                            <image class="ulArrowIcon" src="https://image.aftdc.com/appBimg/ic_expanded_up.jpg" v-if="index%2!==0"></image>
                        </div>
                    </div>

                    <div class="uninterestedRight" ref="urElA" @click.stop="circleClick">
                        <div class="nrHead row">
                            <div class="nrHeadLeft flex1 row" @click="urReturn(0)">
                                <image class="ulArrowIcon tr270" src="https://image.aftdc.com/appBimg/ic_expanded_up.jpg"></image>
                                <text :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">返回</text>
                            </div>
                            <text class="flex1 nrHeadTitle" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">反馈</text>
                            <div class="flex1"></div>
                        </div>
                        <div class="nrContent">
                            <div class="nrContentItem aiCenter" :class="[urText.length-1===index?'noBorder':'']"  v-for="(item,index) in urText" @click="shieldArticle('',item,1)">
                                <text :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">{{item}}</text>
                            </div>
                        </div>
                    </div>

                    <div class="uninterestedRight" ref="urElB" @click.stop="circleClick">
                        <div class="nrHead row">
                            <div class="nrHeadLeft flex1 row" @click="urReturn(1)">
                                <image class="ulArrowIcon tr270" src="https://image.aftdc.com/appBimg/ic_expanded_up.jpg"></image>
                                <text :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">返回</text>
                            </div>
                            <text class="flex1 nrHeadTitle" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">屏蔽</text>
                            <div class="flex1"></div>
                        </div>
                        <div class="nrContent">
                            <div class="nrContentItem aiCenter" v-for="(item,index) in headLineArticle[xIndexs].arr[xIndex].key_word" @click="shieldArticle(item,'',0)">
                                <text :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">屏蔽：{{item}}</text>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </wxc-mask>
        <toast ref="toast"></toast>



    </div>
</template>

<script>
    import noOrder from './noOrder.vue';
    import Toast from './Toast.vue';
    const GLOBAL = require('@/Global.vue');
    const event = weex.requireModule('event');
    const post = weex.requireModule('stream');
    const animation = weex.requireModule('animation');
    import {WxcIcon,WxcCity,WxcPopover,WxcPopup,WxcMask } from 'weex-ui';
    const dom = weex.requireModule('dom');

    export default {
        components: {WxcIcon,WxcCity,WxcPopover,WxcPopup,WxcMask,Toast,noOrder},
        name: 'App',
        data() {
            return {
                loadingAin: { //第一次进入首页接口请求完成情况加载动画
                    getIndexInfo: true, //获取首页信息
                    getShops: true, //获取首页店铺数据
                    getOrderPrompt: true //获取首页最新订单组件信息
                },
                orderLoadingAin: true, //订单加载动画
                newsLoadingAin: [true,true,true], //餐头条加载动画

                token: '',
                imei: '',
                headLineTabIndex:0,//餐头条导航栏下标

                // 首页 页面-----------------------------------------------------------------
                shopType: 1,
                orderType:0,
                userId: 0,
                longitude: 0,//经度
                latitude: 0,//纬度
                city: '',//城市
                addclass: '',//地址
                weather: {},//天气信息
                sortType: 0,//排序规则
                cuisineId: '',//找相似
                shopsNothing: false,//没有更多店铺
                moreActionIndex: '',//关注，收藏，找相似Index
                animationType: 'push',
                currentCity: '',
                cityStyleType:'',
                location: '定位中',
                iconSearch: [ //首页类型选择
                    {icon: 'images/waimai.png', name: '外卖',shopType:1,orderType:0},
                    {icon: 'images/mdzq.png', name: '到店自取',shopType:2,orderType:5},
                    {icon: 'images/mps.png', name: '免配送费',shopType:3,orderType:0},
                    {icon: 'images/yexiao.png', name: '夜宵',shopType:4,orderType:''},
                    {icon: 'images/tannei.png', name: '堂食预订',shopType:5,orderType:3},
                    {icon: 'images/tg.png', name: '团购',shopType:6,orderType:6},
                    {icon: 'images/youzi.png', name: '品牌商家',shopType:7,orderType:''},
                    {icon: 'images/youhui.png', name: '附件优惠',shopType:8,orderType:7},
                ],
                shops:[],//所有的商家
                shopPage: 0,
                comprehensiveRanking:[//综合排序
                    {id: 0,name: '综合排序'},
                    {id: 1,name: '销量最高'},
                    {id: 2,name: '起送价最低'},
                    {id: 3,name: '配送最快'},
                    {id: 4,name: '配送费最低'},
                    {id: 5,name: '人均从低到高'},
                    {id: 6,name: '人均从高到低'}
                ],
                rankingChoiceIndex: 0,//综合排序选项的下标，默认为0
                allChoice:{//未点击确定按钮的所有筛选框下标
                    mealtime: '',//选择了营业时间段筛选的下标
                    price: '',//选择了价格筛选的下标
                    costForm: 0,//人均价开始
                    costTo: 0,//人均价结束
                    mj: 0,
                    xk: 0,
                    zk: 0,
                    hb: 0,
                    mz: 0,
                    jf: 0
                },
                choiceSearch:'',//选择综合分类、好评优先等的下标
                timeScreen:{title:'营业时段',time:['早餐','午餐','晚餐','宵夜']},//筛选框的数据
                priceScreen:{title:'人均价格',price:['￥20以下','￥20-40','￥40以上']},//筛选框的数据
                activeScreen:{title:'优惠活动',active:[//筛选框的数据
                        {backgroundColor: '#fd0002', backgroundName: '减', activeName: '满减活动',check:false,shopType:22,abbreviate:'mj'},
                        {backgroundColor: '#F4A460', backgroundName: '折', activeName: '折扣活动',check:false,shopType:25,abbreviate:'zk'},
                        {backgroundColor: '#06c1ae', backgroundName: '新', activeName: '新客立减',check:false,shopType:23,abbreviate:'xk'},
                        {backgroundColor: '#ff4040', backgroundName: '红', activeName: '商家红包',check:false,shopType:30,abbreviate:'hb'},
                        {backgroundColor: '#ff0000', backgroundName: '赠', activeName: '买赠活动',check:false,shopType:32,abbreviate:'mz'},
                        {backgroundColor: '#aa135f', backgroundName: '积', activeName: '积分抵扣',check:false,shopType:33,abbreviate:'jf'},
                    ]
                },
                scrolls: 1,//首页订单滚动位置判断
                scrollsTransform:false,//首页订单滚动样式判断
                orderHistory: [],//订单轮播
                pageBack:true,
                chooseLayerHeight:'280',
                popupHeight:'',
                classflyStyle:{transform: 'translateY(-2000)'},
                newsOrder:'',

                //订单 页面-----------------------------------------------------------------
                order:[],
                noMore:true,

                //餐头条 页面-----------------------------------------------------------------

                headLineTab:[{name:'推荐'},{name:'关注'},{name:'同城'}],//餐头条导航栏
                headLineArticle: [//餐头条文章内容
                    {
                        name: '推荐',
                        arr:[],
                        page: 0,
                        articleNothing: false
                    }, {
                        name: '关注',
                        arr:[],
                        page: 0,
                        articleNothing: false
                    }, {
                        name: '同城',
                        arr:[],
                        page: 0,
                        articleNothing: false
                    }

                ],
                uninterestedText: [ //餐头条不感兴趣数据
                    {title: '不感兴趣',subTitle: '减少这类内容' },
                    {title: '反馈垃圾内容',subTitle: '低俗，标题党等' },
                    {},
                    {title: '屏蔽' },
                    {}
                ],
                urText: ['低俗色情','标题党','内容不实','旧闻重复','垃圾内容'],
                xIndexs: 0,//点击x储存indexs
                xIndex: 0,//点击x储存index
                loadinging:false,
                refreshing: false,
                themeColor:1,//1为默认主题颜色
                intersting:false,
                elasticLeft:'-750px',
                elasticOpacity:0,
                selectIcon:'',//用于判断不敢兴趣下面标签的第二次点击
                iconCloseList:[], // 不感兴趣弹出框
                uninterested: false,// 不感兴趣弹出层
                hasAnimation: true,


                //我的 页面-----------------------------------------------------------------
                userPhoto: '',
                userName: '',
                userData: {
                    attentionNum: 0, //关注
                    fansNum: 0, //粉丝
                    dynamicNum: 0, //动态
                    messageNum:0,//未读消息数量
                },
                personalBlock:[
                    {icon:'images/wallet.png',name:'钱包',url:'http://assets/myWallet.js'},
                    {icon:'images/soucang.png',name:'收藏',url:'http://assets/colection.js'},
                    {icon:'images/lsjl.png',name:'历史',url:'http://assets/history.js'},
                    {icon:'images/ic_private _letter.png',name:'私信',url:'http://assets/privateLetter.js'},
                    {icon:'images/news.png',name:'消息中心',url:'http://assets/messageCenter.js'},
                    {icon:'images/settled.png',name:'商家入驻',url:'http://assets/entry.js'},
                    {icon:'images/opinion.png',name:'意见反馈',url:'http://assets/feedback.js'}
                ],
                //其他-----------------------------------------------------------------
                //底部导航栏
                tabIndex: 0,
                tabList: [
                    {
                        chooseTabImg: 'https://image.aftdc.com/images/home1.png',
                        tabImg: 'https://image.aftdc.com/images/home.png',
                        tabName: '首页'
                    },
                    {
                        chooseTabImg: 'https://image.aftdc.com/images/purchase1.png',
                        tabImg: 'https://image.aftdc.com/images/purchase.png',
                        tabName: '订单'
                    },
                    {
                        chooseTabImg: 'https://image.aftdc.com/images/direct1.png',
                        tabImg: 'https://image.aftdc.com/images/direct.png',
                        tabName: '餐头条'
                    },
                    {
                        chooseTabImg: 'https://image.aftdc.com/images/personal1.png',
                        tabImg: 'https://image.aftdc.com/images/personal.png',
                        tabName: '我的'
                    }
                ],
                //更新弹出框部分
                show:false,//更新弹出框
                ignore:false,
                thisUpdateList:[],//本次跟新内容
                latelyUpdateList:[],//最近更新内容

            }
        },
        created() {
            this.token = weex.config.token;
            this.imei = weex.config.imei;
            this.userId = weex.config.userId;
            this.userName=weex.config.userName
            this.userPhoto = weex.config.userPhoto;
            this.latitude = weex.config.latitude;
            this.longitude = weex.config.longitude;

            // this.token = 'weex.config.token';
            // this.imei = 'weex.config.imei';
            // this.userId = 42;
            // this.userName = 'Jack'
            // this.userPhoto = 'http://life.southmoney.com/tuwen/UploadFiles_6871/201809/20180918151548594.jpg'
            // this.latitude = 23.15792;
            // this.longitude = 113.27324;

            this.textCarousel();//首页订单轮播
            this.getIndexInfo();//获取首页信息
            this.getShops();//获取首页店铺数据
            this.getOrderPrompt()//获取首页最新订单组件信息

            //坐标更换时刷新


            event.init();
            var that = this;
            if(event.find('tabIndex')){
                var tabIndex=event.find('tabIndex')
                that.tabIndex=tabIndex
                event.delete('tabIndex');
            }

            weex.requireModule('globalEvent').addEventListener("changeLngLat",function(e){
                that.latitude = event.find('latitude');
                that.longitude = event.find('longitude');
                that.getIndexInfo();that.getShops();
            });

        },

        methods: {
            viewappear(){
                var that=this
                if (!that.pageBack) { return; }
                that.pageBack = false;
                that.getUserData();
                if(event.find('tabIndex')){
                    var tabIndex=event.find('tabIndex')
                    that.tabIndex=tabIndex
                    event.delete('tabIndex');
                }

                if(event.find('themeColor')){
                    var themeColor=event.find('themeColor')
                    that.themeColor=themeColor
                    event.inChangeColor(themeColor);
                }

                if(that.tabIndex==1){//订单
                    that.tabIndexClick(1);
                }

                if (event.find('address')) {
                    var address = JSON.parse(event.find('address'));
                    that.latitude = address.latlng.split(",")[0];
                    that.longitude = address.latlng.split(",")[1];
                    that.getIndexInfo();that.getShops();
                    event.save('latitude',that.latitude);
                    event.save('longitude',that.longitude);
                    event.delete('address');
                }

                if (event.find('isLogin')) {
                    this.token = event.find('userToken');
                    this.userId = event.find('userId');
                    this.userName = event.find('userName');
                    this.userPhoto = event.find('userPhoto');
                    this.getShops();this.getOrder();this.getUserData();
                    event.delete('isLogin')
                }
                var shops = that.shops
                for (var i in shops) {
                    //查看是否缓存了商品
                    if(event.find(shops[i].shopId+'orderFood'+that.shopType)){
                        var orderFood=JSON.parse(event.find(shops[i].shopId+'orderFood'+that.shopType))
                        shops[i].goodsNumb=0
                        for(var j in orderFood){
                            shops[i].goodsNumb+=Number(orderFood[j].numb)
                        }
                    }
                }
                that.shops=shops;

                if(event.find('logout')){//代表已退出的缓存
                    that.token='';
                    that.userId='';
                    that.userName='';
                    that.userPhoto='';
                    event.delete('logout');
                }
            },
            viewdisappear() {
                this.pageBack = true;
            },
            changeSlider(event) {
                this.tabIndex = event.index
                this.shopsNothing = false//允许上拉请求数据
                if(event.index === 1) {
                    this.getOrder()
                }
                if(event.index === 2 && !this.headLineArticle[0].first) {
                    this.getArticle(1,0)
                    this.headLineArticle[0].first = true
                }
                if(event.index === 3) {
                    if(this.userId !=0) {
                        this.getUserData()
                    }
                }
            },
            // 首页 页面---------------------------------------------------------
            onScroll() {
                if(this.moreActionIndex !== '') {
                    this.$set(this.shops[this.moreActionIndex],'closeHobby',false)
                    this.moreActionIndex = ''
                }
            },
            getOrderPrompt() {//获取最新订单组件信息
                var that = this
                if (this.userId==0){
                    that.loadingAin.getOrderPrompt = false
                    return false;
                }

                var param = that.GLOBAL.sign(this.token,this.imei);
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: 'https://www.aftdc.com/userapp/Index/newestOrder',
                }, function (res) {
                    that.loadingAin.getOrderPrompt = false

                    if(res.data.res === 1) {
                        that.newsOrder = res.data.data
                    }
                });
            },
            getIndexInfo() {//获取首页信息
                var that = this
                var param = '&userId=' + that.userId
                param += '&longitude=' + that.longitude
                param += '&latitude=' + that.latitude
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: 'https://www.aftdc.com/userapp/Index/index',
                }, function (res) {

                    that.loadingAin.getIndexInfo = false

                    if(res.data.res === 1) {
                        that.orderHistory = res.data.data.orders
                        that.addclass = res.data.data.addclass
                        that.weather = res.data.data.weather
                        if(res.data.data.city) {
                            that.city = res.data.data.city
                        }
                    }
                });
            },
            getShops(loading){//获取店铺数据(是否上拉刷新)
                var that = this
                var param = '&userId='+ that.userId
                param += '&longitude=' + that.longitude
                param += '&latitude=' + that.latitude
                param += '&city=' + that.city
                param += '&shopType=' + that.shopType
                if(loading) {//上拉刷新状态
                    param += '&page=' + that.shopPage
                }else {
                    param += '&page=' + 0
                }
                if(this.cuisineId !== '') {
                    param += '&cuisineId=' + this.cuisineId
                }
                if(that.sortType !== 0){//排序
                    param += '&sortType=' + that.sortType
                }
                if(that.allChoice.mealtime !== '') {//营业时段
                    if(that.allChoice.mealtime > 2){
                        param += '&mealtime=' + (that.allChoice.mealtime + 1)
                    }else {
                        param += '&mealtime=' + that.allChoice.mealtime
                    }
                }
                if(that.allChoice.price !== '') {//人均价格
                    param += '&cost_form=' + that.allChoice.costForm
                    param += '&cost_to=' + that.allChoice.costTo
                }
                for(var i in that.activeScreen.active ) {//优惠活动
                    if(that.activeScreen.active[i].check === true){
                        param += '&'+ that.activeScreen.active[i].abbreviate + '=' + 1
                    }
                }
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: 'https://www.aftdc.com/userapp/Index/getShops',
                }, function (res) {
                    setTimeout(()=>{ that.loadingAin.getShops = false },300)

                    if(res.data.res === 1) {
                        var shops = res.data.data
                        for (var i in shops) { //单位换算
                            shops[i].djq == 1 ? shops[i].projectNum-- : ''
                            shops[i].tg == 1 ? shops[i].projectNum-- : ''
                            shops[i].serviceTime = shops[i].serviceTime[0].serviceStartTime + '-' + shops[i].serviceTime[shops[i].serviceTime.length-1].serviceEndTime

                            //查看是否缓存了商品
                            if(event.find(shops[i].shopId+'orderFood'+that.shopType)){
                                var orderFood=JSON.parse(event.find(shops[i].shopId+'orderFood'+that.shopType))
                                shops[i].goodsNumb=0
                                for(var j in orderFood){
                                    shops[i].goodsNumb+=Number(orderFood[j].numb)
                                }
                            }
                        }
                        that.shopsNothing = false//允许上拉请求数据
                        if(loading) {//上拉刷新状态
                            that.shops = that.shops.concat(shops)
                            that.shopPage = that.shopPage + shops.length
                        }else {
                            that.shops = shops
                            that.shopPage = shops.length
                        }
                    }else if(res.data.res === 0) {
                        if(loading) {//上拉刷新状态
                            setTimeout(()=>{
                                that.shopsNothing = true
                            },1000)
                        }else {
                            that.shops = res.data.data
                            that.shopPage = 0
                        }
                    }
                });
            },
            collectAndFollow(index,shopId,type) {//关注、取消关注、收藏、取消收藏
                var that = this
                var url = null
                const toast=that.$refs.toast;
                if(type==='attentionType') {
                    if(that.shops[index].attentionType === 1) {
                        url = 'https://www.aftdc.com/userapp/Index/cancelAttentShop'//取消关注
                    }else {
                        url = 'https://www.aftdc.com/userapp/Index/attentShop'//关注
                    }
                }else {
                    if(that.shops[index].colType === 1) {
                        url = 'https://www.aftdc.com/userapp/Index/cancelCollectShop'//取消收藏
                    }else {
                        url = 'https://www.aftdc.com/userapp/Index/collectShop'//收藏
                    }
                }
                var param = that.GLOBAL.sign(this.token,this.imei);
                param += '&shopId=' + shopId
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: url,
                }, function (res) {
                    if(res.data.res === 1) {
                        if(type==='attentionType') {
                            if(that.shops[index].attentionType === 1) {
                                that.shops[index].attentionType = 0//取消关注
                            }else {
                                that.shops[index].attentionType = 1//关注
                            }

                            var arr = that.headLineArticle[0].arr
                            for(var i in arr) {//同步餐头条的商家关注状态
                                if(arr[i].shopId === shopId) {
                                    if(that.shops[index].attentionType === 1) {
                                        arr[i].attentionType = 1
                                    }else {
                                        arr[i].attentionType = 0
                                    }
                                }
                            }
                        }else {
                            if(that.shops[index].colType === 1) {
                                that.shops[index].colType = 0//取消收藏
                            }else {
                                that.shops[index].colType = 1//收藏
                            }
                        }
                        toast.editContent(res.data.info);
                    }else if(res.data.res === 0) {
                        toast.editContent(res.data.info);
                    }else if(res.data.res === -2) {
                        that.toLogin()
                    }
                });
                that.$set(that.shops[index],'closeHobby',false)
            },
            findSimilarity(cuisineId) {//找相似商家
                this.cuisineId = cuisineId
                this.getShops()
            },
            onrefreshShops (event) {//首页下拉刷新
                this.refreshing = true
                this.cuisineId = ''
                setTimeout(() => {
                    this.refreshing = false
                }, 2000)
                this.getIndexInfo()
                this.getShops()
            },
            onloadingShops(event) {//首页上拉加载
                if(!this.shopsNothing) { this.getShops(true) }
                this.loadinging = true
                setTimeout(() => {
                    this.loadinging = false
                }, 2000)
            },
            openMap() {//跳转到定位页面
                event.openWebMap();
            },
            unfolding(index) {
                var that = this
                var shop = that.shops[index]
                if(shop.projectNum > 2) {
                    that.$set(shop,'projectLay',!shop.projectLay)
                }
            },
            classflyCancelClick(){//点击筛选框的取消图标
                var that=this
                that.classflyStyle.transform='translateY(-2000px)';

            },
            activeScreenClick(index){//活动选择筛选
                var that = this;
                var active = that.activeScreen.active[index]
                active.check = !active.check
            },
            timeScreenClick(index){//选择营业时间筛选
                if (this.allChoice.mealtime === index+1) {
                    this.allChoice.mealtime = ''
                }else {
                    this.allChoice.mealtime = index+1
                }
            },
            priceScreenClick(index){//选择价格筛选
                if (this.allChoice.price === index+1) {
                    this.allChoice.price=''
                }else {
                    this.allChoice.price=index+1
                    switch(index) {
                        case 0:
                            this.allChoice.costForm = 0
                            this.allChoice.costTo = 20
                            break
                        case 1:
                            this.allChoice.costForm = 20
                            this.allChoice.costTo = 40
                            break
                        case 2:
                            this.allChoice.costForm = 40
                            this.allChoice.costTo = 10000
                            break
                    }
                }
            },
            delClassflyClick(){//清除筛选条件按钮
                var that=this
                if(that.choiceSearch ===0 ) {
                    that.rankingChoiceIndex = 0
                    that.sortType = 0
                }else {
                    that.allChoice.mealtime='';
                    that.allChoice.price='';
                    for(var i in that.activeScreen.active){
                        that.activeScreen.active[i].check=false;
                    }
                }

            },
            mainChoiceSearchClick:GLOBAL.throttle(function(index){//点击首页的综合分类、好评优先等
                var that=this
                dom.scrollToElement(that.$refs.navClassfly)
                if(index==0||index==3){
                    that.choiceSearch=index
                    that.classflyStyle.transform='translateY(0)';
                }else {
                    that.rankingChoiceIndex = 0
                    if(that.choiceSearch === index){
                        that.choiceSearch = 0
                        that.rankingChoice(0)
                    }else {
                        that.choiceSearch=index
                        that.rankingChoice(index,true)
                    }
                }
            }),
            choiceSearchClick:GLOBAL.throttle(function(index){//点击筛选框的综合分类、好评优先等
                this.choiceSearch=index
                if(index==1||index==2){
                    this.classflyStyle.transform='translateY(-2000px)';
                    this.rankingChoiceIndex = 0
                    this. rankingChoice(index,true)
                }
            }),
            rankingChoice(index,other){//点击综合排序的选项
                if(index === 1 && other){
                    this.sortType = 7
                }else if(index === 2 && other){
                    this.sortType = 8
                }else {
                    this.classflyStyle.transform='translateY(-2000px)';
                    this.rankingChoiceIndex = index
                    this.sortType = this.comprehensiveRanking[index].id
                }
                this.getShops()
            },
            allScreenSure(){//点击筛选框确定按钮
                this.classflyStyle.transform='translateY(-2000px)';
                this.getShops()
            },
            chooseLayerClick(index){
                var that=this
                that.$set(that.shops[index],'closeHobby',false)
                that.moreActionIndex = ''
            },
            contentMoreClick(index){
                var that=this
                that.moreActionIndex = index
                dom.getComponentRect(that.$refs.shopShowRef[index], option=> {
                    console.log('getComponentRect:', option)
                    that.chooseLayerHeight = option.size.height
                })
                for(var i=0;i<that.shops.length;i++){
                    that.$set(that.shops[i],'closeHobby',false)
                }
                setTimeout(()=>{
                    that.$set(that.shops[index],'closeHobby',true)
                },50)
            },
            textCarousel() {
                var that = this
                setInterval(() => {
                    var testEl = this.$refs.test;
                    var bb = 'translate(0px,-' + 90 * that.scrolls + 'px)'
                    animation.transition(testEl, {
                        styles: {
                            transform: bb,
                        },
                        duration: 500, //ms
                        timingFunction: 'ease',
                        needLayout: false,
                        delay: 0 //ms
                    }, function () {
                        if(that.scrolls==that.orderHistory.length){
                            that.orderHistory.unshift(that.orderHistory[that.orderHistory.length - 1])
                            that.orderHistory.pop()
                            that.scrollsTransform=true
                            that.scrolls = 0
                        }
                    })
                    that.scrollsTransform=false
                    that.scrolls = that.scrolls + 1
                }, 4000)
            },
            showListCity () {
                this.cityStyleType = 'group'
                this.$refs['wxcCity'].show();
            },
            citySelect (e) {
                this.currentCity=e.item.name;
            },
            chooseShopType:GLOBAL.throttle(function(shopType,orderType){//跳转到八大导航
                console.log('跳转到八大导航页面')
                var url='http://assets/subpage.js'

                var param={shopType:shopType,orderType:orderType}
                param=JSON.stringify(param)
                event.toUrl({"url":url,"param":param})
            }),
            toShopDetails:GLOBAL.throttle(function(shopId){//跳转到商家详情页
                // shopType  外卖：1    到店自取：2    免费配送：3    夜宵：4    堂食预订：5    团购：6      品牌商家：7    附近优惠：8
                // orderType 外卖：0    到店自取：5    免费配送：0    夜宵：0    堂食预订：3    团购：6      品牌商家：3    附近优惠：7
                var that=this
                var url='http://assets/businessOrder.js'
                var param={shopId:shopId,shopType:that.shopType,orderType:that.orderType}
                param=JSON.stringify(param)
                console.log(param)
                event.toUrl({"url":url,"param":param})
            }),
            openUrl(url) { //跳转
                if (url) {
                    var param = '';
                    event.toUrl({url: url, param: param});
                }
            },
            toSearch:GLOBAL.throttle(function(shopId){//跳转到搜索页
                var param = {city: this.city,homePage:true,shopType:1,orderType:this.orderType};
                param=JSON.stringify(param)
                var url='http://assets/search.js';
                event.toUrl({ "url": url, "param": param });
            }),


            // 订单 页面---------------------------------------------------------
            onrefreshOrder:GLOBAL.throttle(function () {//下拉刷新
                var that=this;
                that.tabIndexClick(1);
                that.refreshing=true;
            }),//下拉刷新
            onloadingOrder:GLOBAL.throttle(function () {//上拉加载
                var that=this;
                that.loadinging=true;
                if (this.userId==0){
                    this.refreshing=false;return false;
                }
                var param = this.GLOBAL.sign(this.token,this.imei);
                param+= '&page='+that.order.length;
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/userapp/Order/getAllOrders',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                },function(res){
                    if(res.data.res==1){
                        that.order=that.order.concat(res.data.data);
                        that.loadinging=false;
                        if(res.data.data.length<20) that.noMore=false;
                    }
                    else{
                        that.loadinging=false;
                        const toast =that.$refs.toast;
                        toast.editContent(res.data.info);
                    }
                    that.loadinging=false;
                });
            }),//上拉加载
            toAllOrder(){
                var param = '';
                var url='http://assets/allOrderList.js';
                event.toUrl({ "url": url, "param": param });
            },
            goPay(index){//立即支付
                var that = this
                const toast=that.$refs.toast
                var order=that.order
                var param=that.GLOBAL.sign(that.token,that.imei)
                param+= '&orderId=' + order[index].orderId +'&orderType=' + order[index].orderType ;
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
                            that.tabIndexClick(1);
                        }
                    }
                    if (res.data.res == 0) {
                        modal.alert({
                            message:res.data.info,
                            okTitle:'好的',
                        },function (value) {
                            that.tabIndexClick(1);
                        })
                        return false
                    }
                })
            },
            myOrderChooseClick(index){//点击订单页跳转
                var that=this
                var param = index+1;
                var url='http://assets/allOrderList.js';
                event.toUrl({ "url": url, "param": param });
            },
            toOrderDetails:GLOBAL.throttle(function (index) {//订单点击跳转至订单详情
                var that=this;
                var tk='';
                var url='';

                if(that.order[index].orderType==6 || that.order[index].orderType==7){
                    url='http://assets/detailsOfGroupAndVoucher.js'
                    tk=1;
                }
                else{
                    url='http://assets/orderDetails.js'
                    tk=0;
                }
                var param=JSON.stringify({orderId:that.order[index].orderId,tk:tk,orderType:that.order[index].orderType});
                event.toUrl({ "url": url, "param": param });
            }),//订单点击跳转至订单详情
            reminder(index){//催单
                var that=this;
                if(that.order[index].reminder===0||that.order[index].reminder===3){
                    var param = this.GLOBAL.sign(this.token,this.imei);
                    param+='&orderId='+that.order[index].orderId +'&shopId='+that.order[index].shopId +'&reminder=1'

                    post.fetch({
                        method: 'post',
                        type: 'json',
                        body: param,
                        url: 'https://www.aftdc.com/userapp/Order/reminders',
                        headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    },function(res){
                        if(res.data.res==1){
                            that.order[index].reminder=3;
                            const toast =that.$refs.toast;
                            toast.editContent(res.data.info);
                            that.tabIndexClick(1);
                        }
                    });
                }else{
                    const toast =that.$refs.toast;
                    toast.editContent('已发送催单，请耐心等待商家回复');
                }
            },//催单

            confirmGet(index){//确认收货、已用餐
                var that=this;
                var param = this.GLOBAL.sign(this.token,this.imei);
                param+='&orderId='+that.order[index].orderId;

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
                        that.evaluate(index)
                        that.tabIndexClick(1);

                    }
                });
            },//确认收货、已用餐
            evaluate:GLOBAL.throttle(function (index) {//评价
                var that=this;
                var order=that.order;
                var url='http://assets/orderEvaluate.js';
                var param=JSON.stringify({orderId:order[index].orderId,shopId:order[index].shopId,orderType:order[index].orderType,shopName:order[index].shopName,shopImg:order[index].shopImg,});
                console.log(param);
                event.toUrl({url:url,param:param});
            }),//评价
            oneMore:GLOBAL.throttle(function (index) {//再来一单
                var that=this;
                var order=that.order[index]
                var orderId=order.orderId
                var orderType=order.orderType;
                var shopId=order.shopId;
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
                        var shopType=0
                        switch (orderType) {
                            case 0:
                                shopType = 1
                                break;
                            case 5:
                                shopType = 2
                                break;
                            case 3:
                                shopType = 5
                                break;
                            case 6:
                                shopType = 6
                                break;
                            case 7:
                                shopType = 8
                                break;
                        }
                        if(orderType==0&&order.dsm==0){
                            shopType = 3
                        }
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
            tkProcess:GLOBAL.throttle(function (index) {//退款进度
                var that=this;
                var url='http://assets/refundProgress.js';
                var param={orderId:that.order[index].orderId,tk:(that.order[index].orderType==6 || that.order[index].orderType==7)?1:0};
                event.toUrl({url:url,param:JSON.stringify(param)});
            }),//退款进度



            //餐头 条页面---------------------------------------------------------
            getArticle(tab,page){ //获取餐头条数据(文章类型，页数)
                var that = this
                var param = '&userId=' + that.userId
                param += '&page=' + page
                param += '&tab=' + tab
                param += '&latitude=' + that.latitude
                param += '&longitude=' + that.longitude
                param += '&search=' + ''
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: 'https://www.aftdc.com/userapp/Article/getArticle',
                }, function (res) {
                    that.newsLoadingAin[tab - 1] = false

                    if(res.data.res === 1) {
                        that.headLineArticle[tab - 1].articleNothing = false
                        if(page === 0) {
                            that.headLineArticle[tab - 1].arr = res.data.data
                            that.headLineArticle[tab - 1].page = res.data.data.length
                        }else {
                            that.headLineArticle[tab - 1].arr = that.headLineArticle[tab - 1].arr.concat(res.data.data)
                            that.headLineArticle[tab - 1].page = that.headLineArticle[tab - 1].page + res.data.data.length
                        }
                    }else if(res.data.res === 0){
                        if(page === 0) {
                            that.headLineArticle[tab - 1].arr = res.data.data
                        }
                        setTimeout(()=>{
                            that.headLineArticle[tab - 1].articleNothing = true
                        },1000)
                    }
                });
            },
            //刷新餐头条数据
            onrefreshNews (indexs) {
                this.refreshing = true
                setTimeout(() => {
                    this.refreshing = false
                }, 2000)
                this.getArticle(indexs+1,0)
            },
            toArticleContent(id){
                var param=id;
                var url='http://assets/articleContent.js';
                event.toUrl({ "url": url, "param": param });
            },
            toArticleSearch(){
                var that=this
                var param='';
                var url='http://assets/articleSearch.js'
                event.toUrl({"url":url,"param":param})
            },
            uninterestedAni(x,rx,h){//不感兴趣动弹出层画调用
                let uninterestedHeight = this.$refs.uninterestedHeight;
                let ulEl = this.$refs.ulEl;
                let urEl = rx
                animation.transition(uninterestedHeight, {
                    styles: {
                        height: h+'px'
                    },
                    duration: 200, //ms
                    timingFunction: 'ease'
                })
                animation.transition(ulEl, {
                    styles: {
                        transform: 'translateX('+x+'px)'
                    },
                    duration: 200, //ms
                    timingFunction: 'ease'
                })
                animation.transition(urEl, {
                    styles: {
                        transform: 'translateX('+x+'px)'
                    },
                    duration: 200, //ms
                    timingFunction: 'ease'
                })
            },
            urReturn(i){//返回左区域
                if(i===0){
                    this.uninterestedAni('0',this.$refs.urElA,'700')
                }else{
                    this.uninterestedAni('0',this.$refs.urElB,'700')
                }
            },
            uninterestedClick(index){//不感兴趣类型选择
                switch(index){
                    case 0:
                        this.shieldArticle('','不感兴趣',0)
                        break;
                    case 1:
                        this.uninterestedAni('-680',this.$refs.urElA,'568');//x,rx,h
                        break;
                    case 2:
                        this.pullBlack()
                        break;
                    case 3:
                        if(this.headLineArticle[this.xIndexs].arr[this.xIndex].key_word){
                            let len = 98+this.headLineArticle[this.xIndexs].arr[this.xIndex].key_word.length*94
                            this.uninterestedAni('-680',this.$refs.urElB,len);
                        }
                        break;
                    case 4:
                        this.uninterested = false;
                        this.followArticle(this.headLineArticle[this.xIndexs].arr[this.xIndex].shopId)
                        break;
                }
            },
            shieldArticle(tag,reason,type) {//屏蔽标签、理由(不感兴趣)、接口类型(0为屏蔽和不感兴趣，1为反馈举报)
                var that = this
                that.uninterested = false;
                const toast=this.$refs.toast;
                var url = null
                var param = this.GLOBAL.sign(this.token,this.imei);
                param += '&id=' + that.headLineArticle[that.xIndexs].arr[that.xIndex].id
                if(type === 0) {
                    param += '&reason=' + reason
                    param += '&tag=' + tag
                    url = 'https://www.aftdc.com/userapp/Article/shieldArticle'
                }else {
                    param += '&reason=' + '["' + reason + '"]'
                    param += '&img=' + []
                    url = 'https://www.aftdc.com/userapp/Article/reportArticle'
                }
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: url,
                }, function (res) {
                    if(res.data.res === 1) {
                        that.headLineArticle[that.xIndexs].arr.splice(that.xIndex,1)
                    }
                    toast.editContent(res.data.info);

                })
            },
            pullBlack() {//拉黑餐头条
                var that = this
                const toast=this.$refs.toast;
                that.uninterested = false;
                var param = this.GLOBAL.sign(this.token,this.imei);
                param += '&aId=' + that.headLineArticle[that.xIndexs].arr[that.xIndex].acticleAccount
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: 'https://www.aftdc.com/userapp/Article/black',
                }, function (res) {
                    if(res.data.res === 1) {
                        var arr = that.headLineArticle[that.xIndexs].arr
                        for(var i = arr.length - 1; i >= 0; i--) {
                            if(arr[i].acticleAccount === arr[that.xIndex].acticleAccount) {
                                arr.splice(i,1)
                            }
                        }
                    }
                    toast.editContent(res.data.info);
                })
            },
            followArticle(shopId) {//关注、取消关注头条
                var that = this
                const toast=that.$refs.toast;
                var url = null
                if(that.headLineArticle[that.xIndexs].arr[that.xIndex].attentionType === 1) {
                    url = 'https://www.aftdc.com/userapp/Index/cancelAttentShop'//取消关注
                }else {
                    url = 'https://www.aftdc.com/userapp/Index/attentShop'//关注
                }
                var param = that.GLOBAL.sign(this.token,this.imei);
                param += '&shopId=' + shopId
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: url,
                }, function (res) {
                    if(res.data.res === 1) {
                        var arr = that.headLineArticle[that.xIndexs].arr
                        var follow =  arr[that.xIndex].attentionType
                        for(var i in arr) {
                            if(arr[i].shopId === shopId) {
                                if(follow === 1) {
                                    arr[i].attentionType = 0
                                }else {
                                    arr[i].attentionType = 1
                                }
                            }
                        }
                        for(var j in that.shops) {
                            if(that.shops[j].shopId === shopId) {
                                if(follow === 1) {
                                    that.shops[j].attentionType = 0
                                }else {
                                    that.shops[j].attentionType = 1
                                }
                                break
                            }
                        }
                    }else if(res.data.res === -2) {
                        that.toLogin()
                    }
                    toast.editContent(res.data.info);
                });
            },
            onloadingNews (indexs) {//上拉加载
                this.loadinging = true
                setTimeout(() => {
                    this.loadinging = false
                }, 2000)
                if(!this.headLineArticle[indexs].articleNothing) {
                    this.getArticle(indexs+1,this.headLineArticle[indexs].page)
                }
            },
            closeIconClick(indexs,index){
                console.log(indexs,index)
                this.xIndexs = indexs
                this.xIndex = index;
                this.uninterested = true;
                this.hasAnimation = true;
            },
            uninterestedHidden () {
                this.uninterested = false;
            },
            tabIndexClick(index){//餐头条点击x取消关注的事件end
                var that=this
                that.tabIndex=index
                that.classflyStyle.transform='translateY(-2000px)';
                if(index==0){//首页
                    setTimeout(function () {
                        dom.scrollToElement(that.$refs.firBlock,{})
                    },0)
                }
                else if(index==1){//订单
                    if (this.userId==0){
                        this.refreshing=false;return false;
                    }
                    this.getOrder()
                }
            },
            //获取订单
            getOrder(){
                var that = this
                var param = this.GLOBAL.sign(this.token,this.imei);
                param+= '&page=0';
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/userapp/Order/getAllOrders',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                },function(res){
                    setTimeout(()=>{ that.orderLoadingAin = false },300)

                    if(res.data.res==1){
                        that.order=res.data.data;
                        if(res.data.data.length<20) that.noMore=false;
                    }
                    else{
                        const toast =that.$refs.toast;
                        toast.editContent(res.data.info);
                    }
                    that.refreshing=false;
                });
            },
            headLineTabIndexClick(index){
                var that=this
                that.headLineTabIndex=index
            },
            ignoreClick(){
                if(this.ignore){
                    this.ignore=false;
                }
                else{
                    this.ignore=true;
                }
            },
            changeHeadLineSlider(event){//餐头条新闻分类当前选中tab
                var that=this
                that.headLineTabIndex=event.index
                this.getArticle(event.index + 1,0)
            },


            //我的 页面
            toPersonalList:GLOBAL.throttle(function(url){
                var that=this;
                var param = that.userId;
                if(that.userId==0) {
                    that.toLogin()
                }else {
                    event.toUrl({ "url": url, "param": param });
                }
            }),

            toPage:GLOBAL.throttle(function(url,index){
                var that=this;
                var param = JSON.stringify({isWho:index});
                if(that.userId==0) {
                    that.toLogin()
                }else {
                    event.toUrl({ "url": url, "param": param });
                }
            }),

            toLogin:GLOBAL.throttle(function(){
                var that=this
                var param='';
                var url='http://assets/login.js';
                event.toUrl({"url":url,"param":param})
            }),
            toAftSet:GLOBAL.throttle(function(){
                var that=this
                var param=''
                var url='http://assets/aftSet.js'
                event.toUrl({"url":url,"param":param})
            }),
            getUserData() {
                var that = this
                var param = this.GLOBAL.sign(this.token,this.imei);
                post.fetch({
                    method: 'post',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/userapp/Mine/getAttentionAndFanAndDynamicNum',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                },function(res){
                    if(res.data.res === 1){
                        that.userData = res.data.data
                    }
                });
            },


            //其它
            wxcMaskSetHidden(){
                this.show=false;
            },
            // 更新部分
            noUpdate(){
                this.show=false;
            },
        }
    }
</script>

<style scoped>
    /*我的新增-------------------------------------*/
    .middleBox {
        width: 750px;
    }
    .middleItem {
        display: flex;
        flex: 1;
        padding-top: 30px;
        padding-bottom: 30px;
        align-items: center;
        justify-content: center;
    }
    .number {
        height: 60px;
        font-size: 44px;
        font-weight: bold;
        line-height: 60px;
    }

    .myList {
        width: 750px;
        border-top-width: 20px;
        border-top-style: solid;
        border-top-color: #f8f8f8;
    }
    .listItem {
        height: 90px;
    }
    .listItemImg {
        width: 50px;
        height: 50px;
        margin-right: 20px;
        margin-left: 30px;
    }
    .listItemRight {
        height: 90px;
        flex: 1;
        justify-content: space-between;
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #f6f5f5;
    }
    .listItemIcon {
        width: 18px;
        height: 30px;
        margin-right: 20px;
    }
    .newNum{
        width: 40px;
        height: 40px;
        border-radius: 30px;
        margin-right: 25px;
        line-height: 40px;
        text-align: center;
        background-color: #fb5147;
        color: #fff;
        font-size: 28px;
    }
    .borderBOttom20 {
        height: 110px;
        border-bottom-width: 20px;
        border-bottom-style: solid;
        border-bottom-color: #f8f8f8;
    }
    .borderBottom0 {
        border-bottom-width: 0;
    }





    /* 公共样式 */
    .gray {
        color: #929292;
    }
    .jcCenter {
        justify-content: center;
    }
    .aiCenter {
        flex-direction: row;
        align-items: center;
    }

    /*更新弹出框*/
    .updateBtnRight{
        flex: 1;
        text-align: center;
        padding-top: 30px;
        padding-bottom: 30px;
        color: #53beb7;
    }
    .updateBtnLeft{
        flex: 1;
        text-align: center;
        padding-top: 30px;
        padding-bottom: 30px;
        border-right-style: solid;
        border-right-width: 1px;
        border-right-color: #f1f1f1;
        color: #999;
    }
    .updateBtn{
        border-top-style: solid;
        border-top-width: 1px;
        border-top-color: #f1f1f1;
    }
    .ignoreText{
        margin-left: 5px;
    }
    .ignoreIcon{
        width: 25px;
        height: 25px;
    }
    .ignoreDiv{
        padding-left: 20px;
        padding-right: 20px;
        margin-top: 60px;
        margin-bottom: 60px;
    }
    .thisUpdate{
        line-height: 40px;
        padding-right: 20px;
        /*flex: 1;*/
    }
    .updateContent{
        font-weight: bold;
        margin-left: 20px;
        margin-bottom: 5px;
    }
    .updateScroller{
        flex: 1;
        margin-left: 20px;
        margin-right: 20px;
    }
    .updateTitle{
        color: #53beb7;
        text-align: center;
        margin-top: 50px;
        margin-bottom: 60px;
    }
    .update{
        flex: 1;
        flex-direction: column;
    }




    /* 首页部分 */
    .allBgColor {
        background-color: #f8f8f8;
        position: relative;
    }
    .scroller {
        flex: 1;
    }
    .indexTop {
        flex-direction: column;
        justify-content: center;
        padding-top: 10px;
        padding-left: 20px;
        padding-right: 20px;
        background-color: #53beb7
    }
    .indexTop_top{
        flex-direction: row;
        align-items: center;
    }
    .top_address{
        flex-direction: row;
        align-items: center;
        flex: 1;
    }

    .nearbyDWImg{
        width: 30px;
        height: 30px;
    }
    .indexTop_address{
        flex-direction: row;
        color: #fff;
        width: 500px;
        lines:1;
        text-overflow: ellipsis;
        margin-left: 10px;
        font-weight: bold;
    }
    .top_weather{
        flex-direction: row;
        align-items: center;
    }
    .weather_left{
        flex-direction: column;
        align-items: center;
        margin-right: 5px;
    }
    .weather_numb{
        color: #fff;
    }
    .searchTextSec{
        color: #999;
        align-items: center;
        flex: 1;
        padding-top: 15px;
        padding-bottom: 15px;
        background-color: #fff;
        border-radius: 30px;
        text-align: center;
        margin-top: 10px;
    }
    .weatherImg {
        width: 50px;
        height: 50px;
    }
    .historyOrder {
        flex-direction: row;
        align-items: center;
        padding-top: 10px;
        padding-bottom: 10px;
        padding-left: 20px;
        background-color: #53beb7;
        height: 90px;
        line-height: 90px;
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
        max-width: 80px;
        text-overflow: ellipsis;
        lines: 1;
        font-weight: bold;
        margin-left: 10px;
    }

    .orderTimeText {
        font-size: 25px;
        color: #fff;
        font-weight: bold;
    }
    .orderShopName {
        max-width: 260px;
        text-overflow: ellipsis;
        lines: 1;
    }
    .fdRow {
        flex-direction: row;
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

    .carousel {
        height: 90px;
        overflow: hidden;
        background-color: #53beb7;
    }
    .noCarousel {
        height: 14px;
    }
    .scrollsTransform{
        transform: translate(0px,0px)
    }
    .iconSearch {
        flex-direction: row;
        flex-wrap: wrap;
        padding-left: 10px;
        padding-right: 10px;
        justify-content: center;
        align-items: center;
        background-color: #fff;

    }

    .textIcon {
        flex-direction: column;
        align-items: center;
        margin-left: 10px;
        margin-right: 10px;
        margin-top: 10px;
        margin-bottom: 10px;
        padding-top: 10px;
        padding-bottom: 10px;
        width: 160px;
    }

    .iconSearchImg {
        width: 80px;
        height: 80px;

    }

    .iconSearchText {
        margin-top: 15px;
    }

    .slider {
        justify-content: center;
        padding-left: 20px;
        padding-right: 20px;
        background-color: #fff;
    }

    .sliderSize {
        width: 710px;
        height: 230px;
    }

    .recommendation {
        flex-direction: row;
        align-items: center;
        justify-content: center;
        padding-top: 20px;
        padding-bottom: 20px;
        background-color: #fff;
    }

    .recommendationText {
        font-weight: bold;
        margin-left: 10px;
        margin-right: 10px;
    }

    .line {
        border-width: 1px;
        border-style: solid;
        border-color: #333;
        width: 75px;
    }

    .navClassfly {
        flex-direction: row;
        align-items: center;
        padding-top: 20px;
        padding-bottom: 20px;
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #f8f8f8;
        position: sticky;
        background-color: #fff;
    }

    .allClassfly {
        flex-direction: row;
        align-items: center;
        justify-content: center;
        flex: 1;
        border-right-width: 2px;
        border-right-style: solid;
        border-right-color: #f8f8f8;
        padding-top: 3px;
        padding-bottom: 3px;
    }

    .allClassflySize {
        max-width: 155px;
        lines:1;
        text-overflow: ellipsis;
        flex-direction: row;
    }

    .classflySize {
        flex: 1;
        text-align: center;
        border-right-width: 2px;
        border-right-style: solid;
        border-right-color: #f8f8f8;
        padding-top: 3px;
        padding-bottom: 3px;
    }

    .screenClassfly {
        flex-direction: row;
        align-items: center;
        justify-content: center;
        flex: 0.8;
        padding-top: 3px;
        padding-bottom: 3px;
    }

    .downArrow_classfly {
        width: 15px;
        height: 15px;
        margin-left: 10px;
    }

    .screenImg {
        width: 30px;
        height: 30px;
    }
    .rankingContent{
        padding-top: 30px;
        padding-left: 30px;
        padding-bottom: 30px;
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #f5f5f5;
    }

    .rankingContent:active{
        background-color: #f1f1f1;
    }
    .shopShow {
        flex-direction: row;
        padding-top: 20px;
        padding-right: 20px;
        padding-bottom: 20px;
        padding-left: 20px;
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #f8f8f8;
        position: relative;
        background-color: #fff;
        position: relative;
    }
    .shopImg {
        width: 150px;
        height: 150px;
    }

    .shopContent {
        flex-direction: column;
        margin-left: 15px;
        flex: 1;

    }

    .shopContentTop {
        flex-direction: column;
        flex: 1;
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #f8f8f8;
    }
    .shopContentName {
        font-weight: bold;
        width: 350px;
        lines:1;
        text-overflow: ellipsis;
    }

    .avgAndTime {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-top: 5px;
        margin-bottom: 5px;
    }

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
        width: 125px;
        height: 20px;

    }

    .shopAvgImg {
        position: absolute;
        left: 0;
        top:0;
        height: 20px;
        overflow: hidden;
    }
    .shopTime {
        flex-direction: row;
        align-items: center;
    }

    .shopTimeSize {
        padding-right: 10px;
        border-right-width: 2px;
        border-right-style: solid;
        border-right-color: #c2c2c2;
    }

    .shopPlaceSize {
        padding-left: 10px;
    }

    .givePrice {
        flex-direction: row;
        align-items: center;
        margin-top: 5px;
        margin-bottom: 5px;
    }

    .startingPrice {
        padding-right: 10px;
        border-right-width: 2px;
        border-right-style: solid;
        border-right-color: #c2c2c2;
    }

    .distributionPrice {
        padding-left: 10px;
        padding-right: 10px;
        border-right-width: 2px;
        border-right-style: solid;
        border-right-color: #c2c2c2;
    }

    .perCapitaPrice {
        padding-left: 10px;
    }

    .timeImg {
        width: 28px;
        height: 28px;
        margin-left: 10px;
    }

    .timeBeginSize {
        color: #53beb7;
    }

    .shopContentButtom {
        flex-direction: row;
        justify-content: space-between;
        overflow: hidden;
        margin-top: 5px;
    }

    .shopActiveDiv {
        flex-direction: column;
        flex: 9;
    }

    .shopContentMore {
        flex: 1;
        flex-direction: column;
    }

    .shopActive {
        flex-direction: row;
        align-items: center;
        height: 42px;

    }

    .activeTips {
        width: 36px;
        height: 36px;
        text-align: center;
        line-height: 36px;
        color: #fff;
        margin-right: 15px;
    }

    .active_mj {
        background-color: #ff4040;
    }

    .active_xin {
        background-color: #53beb7;
    }

    .active_zk {
        background-color: #f4a460;
    }

    .active_hb {
        background-color: #ff4040;
    }

    .active_mz {
        background-color: #FF0000;
    }
    .active_jf {
        background-color: #aa135f;
    }

    .shopActiveContentSize {
        color: #999;
        lines: 1;
        text-overflow: ellipsis;
    }
    .shopContentLeft{
        flex-direction: column;
        align-items: center;
    }

    .isOpen{
        text-align: center;
        color: #808080;
        border-width: 1px;
        border-style: solid;
        border-color: #f8f8f8;
        padding-top: 5px;
        padding-bottom: 5px;
        width: 150px;
        margin-top:5px;
    }

    .chooseLayer{
        flex-direction: row;
        align-items: center;
        justify-content: space-around;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0,0,0,0.4);
        width: 750px;
        height: 327px;

    }
    .circle{
        width: 130px;
        height: 130px;
        background-color: #fff;
        border-radius: 65px;
        border-width: 2px;
        border-style: solid;
        border-color: #dedede;
        flex-direction: column;
        align-items: center;
    }
    .circle:active{
        background-color: #f1f1f1;
    }
    .circle:enabled{
        background-color: #fff;
    }
    .circleImg{
        width: 45px;
        height: 45px;
        margin-top: 15px;
    }
    .circleText{
        font-size: 25px;
        margin-top: 10px;
    }
    .classfly{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 120px;
        background-color: #fff;
        flex-direction: column;
        transition-property: transform;
        transition-duration: 0.3s;
        transition-delay: 0s;
        transition-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1.0);
    }
    .newNavClassfly{
        flex-direction: row;
        align-items: center;
        padding-top: 20px;
        padding-bottom: 20px;
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #f7f7f7;
        background-color: #fff;
    }
    .cuisuneColor{
        border-color: #53beb7;
    }
    .allCuisuneDiv{
        flex-direction: row;
        width:750px;
        flex-wrap: wrap;
        background-color: #fff;
    }
    .termboxBot{
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding-left: 25px;
        background-color: #f8f8f8;
    }
    .classflySure{
        padding-top: 25px;
        padding-bottom: 25px;
        padding-left: 55px;
        padding-right: 55px;
        background-color: #53beb7;
        font-size: 25px;
        color: #fff;
    }
    .classflySure:active{
        background-color: #53aba5;
    }
    .classflySure:enabled{
        background-color: #53beb7;
    }
    .classflyCancel{
        padding-top: 40px;
        align-items: center;
        justify-content: center;
        padding-bottom: 60px;
    }
    .classflyCancelImg{
        width: 40px;
        height: 40px;
    }
    .screenTitle{
        padding-top: 10px;
        padding-left: 20px;
        padding-bottom: 10px;
        padding-right: 20px;
        background-color: #f8f8f8;
    }
    .allScreen{
        padding-top: 20px;
        padding-bottom: 20px;
        padding-left: 30px;
    }
    .screen{
        width: 150px;
        text-align: center;
        padding-top: 13px;
        padding-bottom: 13px;
        border-radius: 10px;
        border-width: 2px;
        border-style: solid;
        border-color: #dedede;
    }
    .allActiveDiv{
        flex-direction: row;
        align-items: center;
        padding-left: 20px;

        padding-top: 20px;
        padding-bottom: 20px;
    }
    .activeText{
        width: 300px;
    }
    .choiceSearchStyle{
        font-weight: bold;
    }
    .orderPrompt {
        width: 310px;
        height: 86px;
        background-image: linear-gradient(to right,#53beb7, #7acbbf);
        justify-content: space-between;
        align-items: center;
        border-radius: 50px;
        /*position: absolute;*/
        position: fixed;
        right: 20px;
        /*bottom: 20px;*/
        bottom: 140px;
        padding-top: 8px;
        padding-left: 8px;
        padding-right: 14px;
        padding-bottom: 8px;
    }
    .orderPromptImg {
        width: 70px;
        height: 70px;
        border-radius: 40px;
    }
    .orderPromptInfo {
        margin-left: 8px;
    }
    .orderPromptGo {
        width: 24px;
        height: 24px;
    }
    .noMore {
        padding-top: 26px;
        padding-bottom: 26px;
    }
    .noMoreLine {
        height: 2px;
        flex: 1;
        background-color: #eeeeee;
    }



    /**订单**/

    .orderType{
        flex-direction: row;
    }
    .nothing {
        text-align: center;
        padding-top: 50px;
        padding-bottom:50px;
        padding-left: 50px;
        padding-right: 50px;
        color: #999;
    }
    .moreRecentlyOrder{
        background-color: #fff;
        align-items: center;
        justify-content: center;
        height: 80px;
    }
    .moreRecentlyOrder:active{
        background-color: #f1f1f1;
    }
    .moreRecentlyOrder:enabled{
        background-color: #fff;
    }

    .moreRecentlyOrderText{
        font-size: 26px;
        color:#999;
    }
    .orderBar{
        width: 750px;
        height: 100px;
        align-items: center;
        justify-content: center;
        background-color: #53beb7;
    }
    .recentlyOrder{
        flex-direction: row;
        padding-top: 30px;
        padding-bottom: 30px;
        padding-left: 20px;
        padding-right: 20px;
        background-color: #fff;
        /*border-bottom-width: 2px;*/
        /*border-bottom-style: solid;*/
        /*border-bottom-color: #f1f1f1;*/
        border-bottom-width: 20px;
        border-bottom-style: solid;
        border-bottom-color: #f9f9f9;

    }
    .recentlyOrder:active{
        background-color: #f1f1f1;
    }
    .recentlyOrder:enabled{
        background-color: #fff;
    }

    .recentlyOrderShopImg{
        width: 100px;
        height: 100px;
        border-radius: 5px;
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
    .state{
        font-size: 25px;
        color: #53beb7;
        max-width: 280px;
        lines:1;
        text-overflow: ellipsis;
    }
    .time{
        margin-top: 15px;
        color: #969696;
    }
    .shopPriceText{
        color: #969696;
        margin-top: 15px;
    }
    .recentlyOrderContent_bottom{
        flex-direction: row;
        justify-content: space-between;
    }
    .recentlyOrderContent_button{
        flex-direction: row;
        align-items: center;
        margin-top: 20px;
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
        border-radius: 5px;
        margin-left: 30px;
        margin-top: 5px;
        background-color: #fff;
    }
    .recentlyOrder_btn:active{
        background-color: #f1f1f1;
    }
    .recentlyOrder_btnback{
        /*font-weight: 600;*/
        padding-top: 10px;
        padding-bottom: 10px;
        width: 145px;
        text-align: center;
        border-width: 1px;
        border-style: solid;
        border-color: #53beb7;
        border-radius: 5px;
        margin-top: 5px;
        opacity: 1;
    }
    .recentlyOrder_btnback:active{
        background-color: #f1f1f1;
    }
    .isReminder{
        opacity: 0.7;
        background-color: #f1f1f1;
    }
    .isReminder:enabled{
        background-color: #f1f1f1;
    }
    .moreRecentlyOrder{
        background-color: #fff;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        padding-top: 30px;
        padding-bottom: 30px;
    }
    .moreRecentlyOrder:active{
        background-color: #f1f1f1;
    }
    .moreRecentlyOrder:enabled{
        background-color: #fff;
    }

    .moreRecentlyOrderText{
        font-size: 30px;
        margin-right: 15px;
    }
    .moreRecentlyOrderImg{
        width: 18px;
        height: 12px;
    }


    /**餐头条 页面**/
    .toEllipsis {
        max-width: 400px;
        lines:1;
        text-overflow: ellipsis;
    }
    .ArticlePortrait {
        width: 45px;
        height: 45px;
        border-radius: 30px;
    }
    .headLineTab{
        height: 82px;
        flex-direction: row;
        align-items: center;
        padding-left: 30px;
        padding-right: 30px;
        flex: 1;
        position: relative
    }
    .headLineTabList{
        /*flex: 1;*/
        /*width: 170px;*/
        /*margin-left: 10px;*/
        /*margin-right: 10px;*/
        padding-top: 16px;
        padding-bottom: 16px;
        padding-left: 50px;
        padding-right: 50px;
        border-bottom-width: 0px;
        border-bottom-color: #fff;

    }

    .headLineTabListChoice{
        border-bottom-width: 5px;
        border-bottom-style: solid;
        border-bottom-color: #53beb7;
        border-radius: 3px;
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
        /*height: 500px;*/
        width: 750px;
        position: absolute;
        top: 0;
        bottom: 0;
        background-color: #fff;
    }
    .headLineContent {
        flex-direction: column;
        padding-top: 30px;

    }
    .headLineContent:active{
        background-color: #f1f1f1;
    }
    .headLineContent:enabled{
        background-color: #fff;
    }

    .contentStyle {
        flex-direction: column;
        padding-bottom: 30px;
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #f1f1f1;
        /*padding-left: 30px;*/
        /*padding-right: 30px;*/
        margin-left: 30px;
        margin-right: 30px;
    }

    .articleMessage {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }

    .shopAnTime {
        flex-direction: row;
        align-items: center;
    }

    .closeIcon{
        color: #d1d1d1;
        width: 35px;
        height: 25px;
        line-height: 25px;
        border-radius: 5px;
        text-align: center;
        border-style: solid;
        border-width: 1px;
        border-color: #d1d1d1;
        margin-left: 20px;
    }
    .attentionTexte{
        margin-left: 10px;
    }
    .shopAnTimeSizeTwo{
        color: #999;
    }
    .shopAnTimeSize {
        color: #999;
        margin-right: 10px;
    }
    .activeHeadInfo {
        justify-content: space-between;
        padding-bottom: 10px;
    }

    .coverImgStyle {
        margin-top: 15px;
        margin-bottom: 15px;
    }

    .articlePlace {
        flex-direction: row;
        align-items: center;
    }
    .threeImg{
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
    .threeImgSize{
        width: 220px;
        height: 165px;
    }
    .bigImg{
        flex-direction: row;
    }
    .bigImgSize{
        width: 690px;
        height:400px ;
    }
    .videoImg{
        flex-direction: row;
        position: relative;
    }
    .videoPlay{
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        height: 400px;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-color: rgba(102,102,102,0.3);
    }
    .videoPlayImg{
        width: 100px;
        height: 100px;
    }
    .smallImgContent{
        flex-direction: row;
        justify-content: space-between;
        /*align-items: center;*/
        margin-bottom: 15px;
    }
    .smallImgeText{
        width: 450px;
        lines:3,
    }
    .smallImgSize{
        width: 220px;
        height: 165px;
    }

    .noArticle{
        flex: 1;
        text-align: center;
        font-size:30px;
        padding-top: 100px;

    }
    .newsSearch {
        width: 690px;
        margin-left: 6px;
        border-radius: 15px;
        background-color: #fff;
        flex-direction: row;
        align-items: center;
        padding-left: 10px;
    }
    .headerH {
        flex-direction: row;
        justify-content: center;
        padding-top: 10px;
        padding-left: 20px;
        padding-right: 20px;
        padding-bottom: 4px;
        height: 100px;
    }
    /* 餐头条Tab类型选项 */
    .tabScroller{
        flex-direction: row;
        height: 82px;
        width: 750px;
    }





    /**我的**/
    .personal{
        flex-direction: column;
        background-color: #fff;
        flex: 1;
    }
    .userinfo{
        flex-direction:row;
        align-items:center;
        justify-content: space-between;
        /*margin-bottom: 18px;*/
    }
    .userinfo-avatar{
        width:110px;
        height:110px;
        border-radius:55px;
    }
    .userinfo-word{
        flex-direction: row;
        align-items:center;

    }
    .userinfo-nickname{
        margin-right:10px;
        margin-left:30px;
        color: #fff;
    }
    .topImg{
        width:38px;
        height:38px;

    }
    .personalContent{
        background-color: #f8f8f8;
        /*padding-left: 30px;*/
        /*padding-right: 30px;*/
    }
    .personalBlock{
        background-color: #fff;
        flex-direction: column;

        margin-top: 18px;
    }

    .personalBlock_title{
        padding-top: 40px;
        padding-bottom: 30px;
        padding-left: 30px;
        padding-right: 30px;
        font-weight: bold;
        /*padding-left: 50px;*/
        /*border-bottom-width: 1px;*/
        /*border-bottom-style: solid;*/
        /*border-bottom-color: #dedede;*/
    }
    .personalBlock_content{
        flex-direction: row;
        flex-wrap: wrap;
        /*padding-left: 10px;*/
        /*padding-right: 10px;*/
        /*justify-content: center;*/
        align-items: center;
        border-top-width: 1px;
        border-top-style: solid;
        border-top-color: #f8f8f8;
        /*background-color: #fff;*/
    }
    .personalBlock_contentList{
        flex-direction: column;
        align-items: center;
        width: 187px;
        border-left-width: 1px;
        border-left-style: solid;
        border-left-color: #f8f8f8;
        padding-bottom: 10px;
        margin-top: 15px;
        margin-bottom: 15px;
    }
    .personalBlock_contentList:active{
        background-color: #f1f1f1;
    }
    .personalBlock_contentList:enabled{
        background-color: #fff;
    }
    .personal_icon{
        width: 55px;
        height: 55px;
        margin-top: 10px;
        margin-bottom: 10px;
    }
    .personal_text{
        margin-top: 10px;
        margin-bottom: 10px;
    }







    /*导航栏上部*/
    .size {
        width: 750px;
        position: absolute;
        top: 0;
        bottom: 120px;
    }

    .block {
        width: 750px;
        height: inherit;
        position: absolute;
        top: 0;
        bottom: 0;
    }
    .elasticBtnText{
        width: 295px;
        padding-top: 15px;
        padding-bottom: 15px;
        text-align: center;
        border-style: solid;
        border-width: 2px;
        margin-left: 30px;
        border-radius: 10px;
        margin-bottom: 25px;
    }
    .elasticDivButtom{
        padding-right: 30px;
        flex-direction: row;
        align-items: center;
        flex-wrap: wrap;
    }
    .elasticIcon{
        width: 180px;
        height: 60px;
        line-height: 60px;
        background-color: #f75959;
        color: #fff;
        text-align: center;
        border-radius:30px;
    }
    .elasticText{
        flex: 1;
    }
    .elasticDivTop{
        padding-left: 25px;
        padding-right: 25px;
        padding-top: 25px;
        padding-bottom: 25px;
    }
    .elasticDiv{
        width: 680px;
        background-color: #fff;
        margin-left: 35px;
        margin-right: 35px;
        border-radius: 15px;
    }
    .elastic{
        position: fixed;
        align-items: center;
        justify-content: center;
        width: 750px;
        top: 0;
        bottom: 0;
        background-color: rgba(0,0,0,0.5);
    }

    /*!*上拉加载*!*/
    /*.loading {*/
    /*width: 750px;*/
    /*display: -ms-flex;*/
    /*display: -webkit-flex;*/
    /*display: flex;*/
    /*-ms-flex-align: center;*/
    /*-webkit-align-items: center;*/
    /*-webkit-box-align: center;*/
    /*align-items: center;*/
    /*}*/

    /*!*下拉刷新*!*/
    /*.refresh {*/
    /*width: 750px;*/
    /*display: -ms-flex;*/
    /*display: -webkit-flex;*/
    /*display: flex;*/
    /*-ms-flex-align: center;*/
    /*-webkit-align-items: center;*/
    /*-webkit-box-align: center;*/
    /*align-items: center;*/
    /*}*/

    /*.loadingImg {*/
    /*width: 90px;*/
    /*height: 66px;*/
    /*}*/

    /*导航栏*/
    .Tab {
        display: flex;
        flex-direction: row;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        border-top-width: 1px;
        border-top-color: #d9d9d9;
        height: 120px;
    }

    .Tablist {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;;
        align-items: center;
        text-align: center;
    }

    .TabImg {
        width: 50px;
        height: 50px;
    }

    .TabName {
        margin-top: 5px;
    }
    .blockTitleText{
        color: #fff;
        padding-top: 20px;
        padding-bottom: 20px;
        font-size: 38px;
    }
    .articleSearchImg{
        width: 35px;
        height: 35px;
        opacity: 0.7;
    }
    .articleSearchText{
        background-color: #fff;
        width: 410px;
        color: #999;
        padding-top: 20px;
        padding-bottom: 16px;
        margin-left: 10px;
    }
    .userinfo_left{
        flex-direction: row;
        align-items: center;
        flex: 1;
    }
    .themeColorImg{
        width: 40px;
        height:40px;
        margin-right: 20px;
    }
    .setUpImg{
        width: 50px;
        height: 50px;
        margin-right: 40px;
    }
    .row{
        flex-direction: row;
        align-items: center;
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
        height: 80px;
        width: 100px;
        color: #53beb7;
        margin-bottom: 16px;
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


    /* 不感兴趣弹出层 */
    .uninterestedBox {
        overflow: hidden;
        border-radius: 12px;
    }
    .uninterested {
        width: 1360px;
        background-color: #fff;
        /*transform: translateX(-680px);*/
    }
    .uninterestedLeft {
        width: 680px;
        padding-left: 26px;
        padding-right: 26px;
    }
    .ulItem {
        justify-content: space-between;
        height: 140px;
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: #e2e2e2;
    }
    .ulLineHeight {
        line-height: 40px;
    }
    .circleIcon {
        width: 34px;
        height: 34px;
        border-radius: 20px;
        border-width: 2px;
        border-style: solid;
        border-color: #4d4d4d;
        margin-right: 28px;
    }
    .forkOne {
        width: 2px;
        height: 20px;
        background-color: #4d4d4d;
        position: absolute;
        top: 5px;
        left: 15px;
        transform: rotate(45deg);
    }
    .forkTwo {
        width: 2px;
        height: 20px;
        background-color: #4d4d4d;
        position: absolute;
        top: 5px;
        left: 15px;
        transform: rotate(-45deg);
    }
    .ulArrowIcon {
        width: 30px;
        height: 30px;
        transform: rotate(90deg);
        opacity: 0.6;
    }
    .exclamatoryMarkOne {
        width: 2px;
        height: 14px;
        background-color: #4d4d4d;
        position: absolute;
        top: 5px;
        left: 15px;
    }
    .exclamatoryMarkTwo {
        width: 2px;
        height: 3px;
        background-color: #4d4d4d;
        position: absolute;
        top: 22px;
        left: 15px;
    }
    .ulPullBlack {
        width: 26px;
        height: 36px;
        margin-left: 4px;
        margin-right: 32px;
    }
    .tr0 {
        transform: rotate(0);
    }
    .tr90 {
        transform: rotate(90deg);
    }
    .uninterestedRight {
        width: 680px;
        height: 700px;
        background-color: #fff;
        position: absolute;
        top: 0;
        right: 0;
    }
    .flex1 {
        flex: 1;
    }
    .nrHead {
        width: 680px;
        height: 98px;
        padding-left: 30px;
        padding-right: 30px;
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #eeeeee;
    }
    .nrHeadLeft {
        padding-top: 20px;
        padding-bottom: 20px;
    }
    .tr270 {
        transform: rotate(270deg);
        margin-right: 5px;
    }
    .nrHeadTitle {
        text-align: center;
        font-weight: bold;
    }
    .nrContent {
        padding-left: 30px;
        padding-right: 30px;
    }
    .nrContentItem {
        height: 94px;
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: #ebebeb;
    }

    .guigeNumbDiv{
        height: 30px;
        text-align: center;
        line-height: 30px;
        color: #fff;
        background-color: #f00;
        position: absolute;
        top: 150px;
        left: 150px;
        border-radius: 30px;
    }


    .loadingAin {
        background-color: #fff;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 120px;
    }
    .indicatorAin {
        height: 145px;
        width: 200px;
        color: #53beb7;
    }
    .orderLoadingAin {
        background-color: #fff;
        position: absolute;
        top: 90px;
        left: 0;
        right: 0;
        bottom: 0;
        align-items: center;
        justify-content: center;
    }
    .newsLoadingAin {
        background-color: #fff;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        align-items: center;
        justify-content: center;
    }
</style>