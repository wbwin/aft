
<template>
    <div class="wrapper">
        <!--头部-->
        <div class="header">
            <div class="back">
                <image class="backImg" @click="backClick()"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text class="appNameCss">{{shopInfo.shopName}}</text>
            </div>
            <div class="allSave ">
                <!--<image class="icon_search" src="https://image.aftdc.com/appBimg/ic_rearch_user.png"></image>-->
                <!--<image class="icon_star" :src="shopInfo.attentionType==1?'https://image.aftdc.com/images/attention3.png':'https://image.aftdc.com/images/attention4.png'"></image>-->
                <image class="icon_star" src="https://image.aftdc.com/appBimg/ic_start_user.png"></image>
                <image class="icon_ping" src="https://image.aftdc.com/appBimg/ic_pingdan.png" @click="toCollage"></image>
                <image class="icon_more" src="https://image.aftdc.com/appBimg/ic_more_user.png" @click="popoverShowClick()"></image>
            </div>
        </div>

        <div class="toTop">
            <!--商家基本信息-->
            <div>
                <div class="topBody" @click="toPersonalHomePage">
                    <div>
                        <image class="userImg" :src="'https://image.aftdc.com/'+shopInfo.shopImg"></image>
                    </div>
                    <div style="flex: 1;margin-left: 20px;justify-content: space-between;height: 150px;position: relative">
                        <div style="flex-direction:row;justify-content: space-between;">
                            <div class="shopAvg">
                                <div class="star">
                                    <image class="starSize" src="https://image.aftdc.com/appBimg/icon_wuxing_nocolor.png"></image>
                                    <div class="shopAvgImg" :style="{width:shopInfo.shopAvg*29+'px'}">
                                        <image class="starSize"  src="https://image.aftdc.com/appBimg/icon_wuxing_color.png"></image>
                                    </div>
                                </div>
                                <text class="defaultSize shopContentSize " style="font-size: 22px">销量{{shopInfo.shopSales}}</text>
                            </div>
                        </div>
                        <div style="flex-direction: row;">
                            <text class=" " style="padding-right: 10px;font-size: 22px;color: #ffffff;">商家配送</text>
                            <text class=" padding leftRight "style="font-size: 22px;color: #ffffff;">{{shopInfo.deliveryCostTime==0?'45':shopInfo.deliveryCostTime}}分钟</text>
                            <text class=" " style="padding-left: 10px;font-size: 22px;color: #ffffff;">距离{{shopInfo.distance}}m</text>

                        </div>
                        <div style="flex-direction: row;align-items: center;" >
                            <text class=" borderBottom"  style="padding-right: 10px;font-size: 22px;color: #ffffff;">{{shopInfo.fansNum}} 粉丝</text>
                            <text class=" padding leftRight borderBottom" style="font-size: 22px;color: #ffffff;">{{shopInfo.appraiseNum}} 动态</text>
                            <div style="flex-direction: row;align-items: center;padding-left: 10px" class="borderBottom">
                                <image class="whiteTime" src="https://image.aftdc.com/images/shijian1.png" ></image>
                                <text class=" padding" style="font-size: 22px;color: #ffffff;">{{shopInfo.serviceStartTime}}</text>
                                <text class="" style="font-size: 22px;color: #ffffff;">起送</text>
                            </div>
                        </div>
                        <div style="flex-direction: row;align-items: center">
                            <image class="whiteHorn" src="https://image.aftdc.com/images/note.jpg"></image>
                            <text class="whiteFont" style="margin-left: 10px" :style="{fontSize:GLOBAL.smallerFS}">{{shopInfo.notice}}</text>
                        </div>
                    </div>
                    <div class="topBody-right">
                        <text class=" btnFocus"style="font-size: 22px;color: #ffffff;" :style="{backgroundColor:shopInfo.attentionType==1?'#00b8a5':'#bf5b4c'}">{{shopInfo.attentionType==1?'已关注':'关注'}}</text>
                        <image style="width: 20px;height: 30px" src="https://image.aftdc.com/appBimg/icon_arrow_white.png" ></image>
                    </div>
                </div>
                <!--轮播图-->
                <!--一使用判断，dom.scrollerElement就会有偏移-->
                <div class="textCarousel" v-if="orders.length>0">

                    <div ref="test" :class="[scrollsTransform?'scrollsTransform':'']">
                        <div class="historyOrder"  v-for="(item,index) in orders">
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

            </div>
            <div  :ref="'box'" class="boxs"
                  v-bind:style="boxStyle"
                  @touchstart="ontouchstart"
                  @touchmove="ontouchmove"
                  @touchend="ontouchend"
                  fireEventSync="true">
                <div class="tabActive"  style="flex-direction: row;justify-content: space-around;align-items: center">
                    <text :class="[tabIndex==0?'tab':'tabs']" @click="tabIndex=0">点餐</text>
                    <text :class="[tabIndex==1?'tab':'tabs']" @click="tabIndex=1">评价(99+)</text>
                    <text :class="[tabIndex==2?'tab':'tabs']" @click="tabIndex=2">商家</text>
                </div>
                <!--<div :style="{width: 2250+'px',flexDirection:'row',left:-tabIndex * 750+'px'}">-->
                <slider class="slider" infinite="false" :index="tabIndex" @change="change">
                    <!--点餐-->
                    <div style="width: 750px;flex-direction: column;">
                        <div style="flex-direction: row;width: 750px;flex: 1;">
                            <scroller show-scrollbar="false" style="flex: 1;background-color: #EDFFFE;">
                                <div v-for="(item,index) in Von" :class="[leftIndex==index?'leftBoxs':'leftBox']"
                                     @click="sortClick(index)">
                                    <image v-if="item.catName=='砍价'" class="leftIcon"
                                           src="https://image.aftdc.com/images/cut-icon.png"></image>
                                    <image v-if="item.catName=='秒杀'" class="leftIcon"
                                           src="https://image.aftdc.com/images/sec-icon.png"></image>
                                    <image v-if="item.catName=='折扣'" class="leftIcon"
                                           src="https://image.aftdc.com/images/reb-icon.png"></image>
                                    <image v-if="item.catName=='热销'" class="leftIcon"
                                           src="https://image.aftdc.com/images/hot-icon.png"></image>
                                    <text :class="[leftIndex==index?'leftSliders':'leftSlider']">{{item.catName}}</text>
                                    <text class="numbText" v-if="item.allNumb&&item.allNumb>0" :style="{fontSize:GLOBAL.smallerFS}">{{item.allNumb}}</text>
                                </div>
                            </scroller>
                            <scroller show-scrollbar="false" style="flex: 3;background-color: #ffffff">
                                <!--<div v-if="orderCoupon" class="couponDiv" @click="couponShowClick()">-->
                                <!--<image class="quanImg" src="https://image.aftdc.com/appBimg/icon_yhq.png"></image>-->
                                <!--<div class="yhqbox" >-->
                                <!--<div style="flex-direction:row;flex: 2">-->
                                <!--<div class="couponPrice">-->
                                <!--<text style="font-size: 30px;color: rgba(255,5,0,0.8);margin-bottom: 7px">￥</text>-->
                                <!--<text style="font-size: 55px;color: #f00;font-weight: bold">{{couponSum}}</text>-->
                                <!--</div>-->
                                <!--<div class="couponMessage">-->
                                <!--<text style="color: #666;font-size: 30px;">商家优惠券</text>-->
                                <!--<text style="color: rgba(255,5,0,0.8);font-size: 25px;margin-top: 7px" :style="{color:couponlen>1?'#f00':'#c9c9c9'}">{{couponlen>1?'内含'+couponlen+'张券':'满'+OnespendMoney+'可用'}}</text>-->
                                <!--</div>-->
                                <!--</div>-->
                                <!--<div class="get">-->
                                <!--<text style="font-size: 35px;color: #e40500" v-if="couponState">去领取</text>-->
                                <!--<text style="font-size: 35px;color: #FF2329" v-if="!couponState">已领取</text>-->
                                <!--</div>-->
                                <!--</div>-->
                                <!--</div>-->
                                <div v-for="(item,index) in Von" >
                                    <text class="catNameText"  ref="gooding" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.catName}}</text>
                                    <div class="goods" style="flex-direction: row;align-items: center"
                                         v-for="(food,foodIndex) in item.distop" @click="boxShowClick(index,foodIndex,food.type)">
                                        <image class="goodImg"
                                               :src="'https://image.aftdc.com/'+food.goodsImg" ></image>
                                        <div  style="justify-content: center;flex: 1;position: relative;margin-left: 10px">
                                            <text class="foodNameText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{food.goodsName}}</text>
                                            <text  :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}">￥{{food.shopPrice}}</text>
                                            <div style="flex-direction: row;align-items: center;justify-content: space-between">
                                                <text style="text-decoration: line-through" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}" v-if="food.shopPrice!=food.marketPrice">￥{{food.marketPrice}}</text>
                                                <text style="font-size: 35px;color:#999;text-decoration: line-through" v-else> </text>
                                                <div style="flex-direction: row;align-items: center;margin-right: 20px;">
                                                    <!--有规格  -->

                                                    <text class='chooseGG' :style="{fontSize:GLOBAL.smallerFS,color:'#fff'}" v-if="food.guige||food.taste" @click="specBoxShowClick(index,foodIndex)">选规格</text>

                                                    <!--加减  catId=1 砍价   catId=2 秒杀   catId=3 折扣-->
                                                    <div style="flex-direction: row;align-items: center;" v-else-if="item.catId!=1||food.result">
                                                        <image v-if="food.numb>0" class="addImgs" src="https://image.aftdc.com/images/sub.png" @click="sub(index,foodIndex)"></image>
                                                        <text v-if="food.numb>0" style="font-size: 35px">{{food.numb}}</text>
                                                        <image v-if="item.catId!=1||food.result" class="addImg" src="https://image.aftdc.com/images/add.png" @click="add(index,foodIndex)"></image>
                                                    </div>

                                                    <text class="bargain" v-else @click="bargainShowClick(index,foodIndex)" :style="{fontSize:GLOBAL.smallerFS}">砍价</text>


                                                </div>

                                            </div>
                                            <text class="guigeNumbDiv" v-if="(food.guige||food.taste)&&food.numb>0" :style="{fontSize:GLOBAL.smallerFS}">{{food.numb}}</text>
                                        </div>
                                    </div>
                                </div>
                            </scroller>
                        </div>

                        <!--购物车商品-->

                        <div class="shopCar" @click="shopCarShowClick()">
                            <div style="flex-direction: row;align-items: center">
                                <div >
                                    <image class="carImg" src="https://image.aftdc.com/images/car.png"></image>
                                    <div v-if="totalnumb>0" style="position: absolute;bottom: 65px;left: 60px;">
                                        <text class="sumNum">{{totalnumb}}</text>
                                    </div>
                                </div>

                                <div>
                                    <text v-if="totalprice<=0" :style="{fontSize:'35px',color:GLOBAL.tColor}">￥0</text>
                                    <div v-else style="flex-direction: column;justify-content: space-around">
                                        <text :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.tColor}">￥{{totalprice}}</text>
                                        <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}">另需配送费￥3.00元</text>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <text class="addCar" v-if="shopInfo.distance>shopInfo.range" @click.stop="" :style="{fontSize:GLOBAL.defaultFS}">超出配送范围</text>
                                <div v-else>
                                    <text class="addCar" v-if="distance_price>0 && showPrice==0 && car.length>0" :style="{fontSize:GLOBAL.defaultFS}">还差{{distance_price}}元起送</text>
                                    <text class="addCar" v-if="car&&car.length==0" :style="{fontSize:GLOBAL.defaultFS}">￥{{shopInfo.deliveryFreeMoney}}元起送</text>
                                    <text class="order" v-if="shopCar" @click=toOrderPage :style="{fontSize:GLOBAL.defaultFS}">下单</text>
                                </div>

                            </div>
                        </div>
                        <div v-if="shopCarShow" class="shopGood" @click.stop="popupClick">
                            <div style="position: absolute;bottom: 0;left: 0;right: 0;justify-content: flex-end">
                                <div class="empty" @click="closeShopCarClick()">
                                    <image style="width: 30px;height: 30px;" src="https://image.aftdc.com/images/closeCar.png"></image>
                                    <text :style="{fontSize:GLOBAL.smallFS,color:'#999'}">清空购物车</text>
                                </div>
                                <scroller style="flex-direction:column;max-height: 560px;background-color: #ffffff;">
                                    <div class="bBorder" v-for="(item,index) in car">
                                        <div>
                                            <text class="myText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.arr.goodsName}} </text>
                                            <text class="spec-color" v-if="item.arr.spec_size||item.arr.spec_taste" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">{{item.arr.spec_size}}+{{item.arr.spec_taste}}</text>
                                        </div>
                                        <div style="flex-direction: row;align-items: center">
                                            <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor,marginRight:'80px'}">￥{{item.arr.shopPrice}}</text>
                                            <image class="addeImgs" src="https://image.aftdc.com/images/sub.png" @click="buysub(index)"></image>
                                            <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.arr.numb}}</text>
                                            <image class="addeImg" src="https://image.aftdc.com/images/add.png" @click="buyadd(index)"></image>
                                        </div>
                                    </div>
                                </scroller>
                            </div>
                        </div>
                    </div>
                    <!--评价-->
                    <scroller style="width: 750px;height: 500px;position: relative" v-if="pinglun.all!=''">
                        <div class="rating">
                            <div style="align-items: center;padding-top: 15px;padding-bottom: 15px">
                                <text class="allScore" :style="{color:GLOBAL.tColor}">{{pinglun.allScroe}}</text>
                                <text class="textFont" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">综合评分</text>
                            </div>
                            <div style="justify-content: center;;padding-top: 15px;padding-bottom: 15px">
                                <div style="flex-direction: row;align-items: center;margin-bottom: 15px">
                                    <text class="textFont" style="padding-right: 20px;" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">口味</text>
                                    <div class="stars" style="padding-right: 30px;align-items: center">
                                        <image class="starSize"
                                               src="https://image.aftdc.com/appBimg/icon_wuxing_nocolor.png"></image>
                                        <div class=" yellowStar" :style="{width:pinglun.taste*30+'px'}">
                                            <image class="starSize"
                                                   src="https://image.aftdc.com/appBimg/icon_wuxing_color.png"></image>
                                        </div>
                                    </div>
                                    <text class="startScore" :style="{fontSize:GLOBAL.bigFS}">{{pinglun.taste}}</text>
                                </div>
                                <div style="flex-direction: row;margin-top: 5px;align-items: center;">
                                    <text class="textFont" style="padding-right: 20px;" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">包装</text>
                                    <div class="stars" style="padding-right: 30px;align-items: center">
                                        <image class="starSize"
                                               src="https://image.aftdc.com/appBimg/icon_wuxing_nocolor.png"></image>
                                        <div class=" yellowStar" :style="{width:pinglun.warp*30+'px'}">
                                            <image class="starSize"
                                                   src="https://image.aftdc.com/appBimg/icon_wuxing_color.png"></image>
                                        </div>
                                    </div>
                                    <text class="startScore" :style="{fontSize:GLOBAL.bigFS}">{{pinglun.warp}}</text>
                                </div>
                            </div>
                            <div style="align-items: center;border-left-width: 2px;border-left-color:#f1f1f1 ;padding-left: 50px;padding-top: 15px;padding-bottom: 15px">
                                <text class="allScore" :style="{color:GLOBAL.tColor}">{{pinglun.psScore}}</text>
                                <text class="textFont" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">配送评分</text>
                            </div>
                        </div>
                        <div class="bars"></div>

                        <div style="flex-direction: row;justify-content: center;padding-top: 20px;padding-bottom: 20px">
                            <text :class="[ratingSelect==0?'ratinges':'ratings']" style="border-top-left-radius: 10px;border-bottom-left-radius: 10px" @click="ratingSelect=0">全部</text>
                            <text :class="[ratingSelect==1?'ratinges':'ratings']" @click="ratingSelect=1">有图</text>
                            <text :class="[ratingSelect==2?'ratinges':'ratings']" style="border-right-width: 2px;border-top-right-radius: 10px;border-bottom-right-radius: 10px" @click="ratingSelect=2">最新</text>
                        </div>


                        <!--<slider :index="ratingSelect" infinite="false" class="slider" @change="changes">-->
                        <!--全部 切换有图/最新直接从接口返回zanData数据-->
                        <div v-if="ratingSelect==0">
                            <div style="padding-left: 10px;padding-right: 20px;width: 750px;" v-for="(item,index) in pinglun.all">
                                <div style="border-bottom-width: 1px;border-bottom-color:#f8f8f8;margin-bottom: 10px;">
                                    <!--优质评论  -->
                                    <image v-if="item.isGood==1" class="yzpl" src="https://image.aftdc.com/images/yzpl.png"></image>
                                    <div style="flex-direction: row;justify-content: space-between;align-items: center;">
                                        <div style="flex-direction: row;align-items: center">
                                            <div style="border-radius: 40px; margin-right: 5px;">
                                                <image class="ratImg" :src="item.userPhoto?item.userPhoto:'https://image.aftdc.com/images/wtx.png'"></image>
                                            </div>
                                            <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor,maxWidth:'370px'}">{{item.userName}}</text>
                                            <image class="gradeImg" :src="'https://image.aftdc.com/images/v'+item.grade+'.png'"></image>
                                        </div>
                                        <div>
                                            <text :style="{fontSize:GLOBAL.smallFS,color:'#999'}">{{item.createTime}}</text>
                                        </div>
                                    </div>
                                    <div style="margin-left: 90px;margin-bottom: 20px;flex-direction: row;" v-if="item.avg">

                                        <text :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">对商品打分：</text>
                                        <div class="stars" style="padding-right: 30px;align-items: center">
                                            <image class="starSize"
                                                   src="https://image.aftdc.com/appBimg/icon_wuxing_nocolor.png"></image>
                                            <div class=" yellowStar" :style="{width:item.avg*30+'px'}">

                                                <image class="starSize"
                                                       src="https://image.aftdc.com/appBimg/icon_wuxing_color.png"></image>
                                            </div>
                                        </div>
                                    </div>
                                    <div style="flex-direction: row;margin-left: 90px;margin-bottom: 20px;" v-if="item.content">
                                        <text :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">对商品评价:</text>
                                        <text :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">{{item.content}}</text>
                                    </div>
                                    <div style="margin-left: 90px;margin-bottom: 20px;flex-direction: row;" v-if="item.wgoods">

                                        <text :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">对服务员打分：</text>
                                        <div class="stars" style="padding-right: 30px;align-items: center">
                                            <image class="starSize"
                                                   src="https://image.aftdc.com/appBimg/icon_wuxing_nocolor.png"></image>
                                            <div class=" yellowStar" :style="{width:item.wgoods*30+'px'}">

                                                <image class="starSize"
                                                       src="https://image.aftdc.com/appBimg/icon_wuxing_color.png"></image>
                                            </div>
                                        </div>
                                    </div>
                                    <div style="flex-direction: row;margin-left: 90px;margin-bottom: 20px;" v-if="item.wContent">
                                        <text :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">对服务员评价:</text>
                                        <text :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">{{item.wContent}}</text>
                                    </div>
                                    <div style="margin-left: 90px;max-width: 520px;flex-direction:row;flex-wrap: wrap">
                                        <image class="ratGoodImg" v-for="(img,imgIndex) in item.appraisesAnnex" :src="'https://image.aftdc.com/'+img.img"></image>
                                    </div>
                                    <div style="flex-direction: row;margin-left: 90px;margin-bottom: 20px;" v-if="item.goodslist">
                                        <image style="width: 30px;height: 30px;" src="https://image.aftdc.com/images/zanfood.png"></image>
                                        <text v-for="(goods,goodsIndex) in item.goodslist" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.tColor,maxWidth:'600px'}">{{goods.goodsName}}</text>
                                    </div>
                                    <div style="flex-direction: row;margin-left: 90px;margin-bottom: 20px;" v-if="item.tagStr">
                                        <image style="width: 30px;height: 30px;" src="https://image.aftdc.com/images/shuqian.png"></image>
                                        <text :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.tColor,alignItems:'center'}">{{item.tagStr}}</text>
                                    </div>

                                    <div style="flex-direction: row;margin-left: 90px;margin-bottom: 20px;" v-if="item.shopReply!=null">
                                        <image class="replyAll-img" src="https://image.aftdc.com/images/replyAll.png" ></image>
                                        <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">商家回复: </text>
                                        <text :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">{{item.shopReply.content}}</text>
                                    </div>
                                    <div style="position: absolute;top: 350px;left: 280px;opacity:0" ref="zan">
                                        <image style="width: 150px;height: 150px;" src="https://image.aftdc.com/images/zan.png"></image>
                                    </div>
                                    <div style="flex-direction: row;margin-left: 90px;margin-bottom: 20px;justify-content: space-between;align-items: center">
                                        <div style="flex-direction: row;align-items: center">
                                            <text :style="{fontSize:GLOBAL.smallFS,color:'#999'}">浏览量:</text>
                                            <text :style="{fontSize:GLOBAL.smallFS,color:'#999'}">{{item.readNum}}</text>
                                        </div>
                                        <div class="zanDiv" @click="praiseClick(item.id,index)">
                                            <image class="zanImg" :src="item.isDZ==0?'https://image.aftdc.com/images/nozhan.png':'https://image.aftdc.com/images/zhan.png'"></image>
                                            <text  class="hot" v-if="item.numbs!=0" :style="{fontSize:GLOBAL.smallerFS}"> {{item.numbs}} 热度</text>
                                            <text v-else  class="hot" :style="{fontSize:GLOBAL.smallerFS}">赞</text>
                                            <!--如果点赞为0，显示赞，否则多少热度-->

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!--</slider>-->



                    </scroller>
                    <scroller style="width: 750px;height: 500px" v-else>
                        <text class='wuPl' :style="{fontSize:GLOBAL.bigFS}">暂无评论...</text>
                    </scroller>
                    <!--商家-->
                    <div style="width: 750px;">
                        <scroller show-scrollbar="false">
                            <div>
                                <div v-if="shopInfo.lunbo">
                                    <text class="label" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">商家环境</text>
                                    <scroller scroll-direction="horizontal" class="environment" show-scrollbar="false">
                                        <image class="sliders" v-for="(item,index) in shopInfo.lunbo" :src="'https://image.aftdc.com/'+item.ImgUrl"></image>
                                    </scroller>
                                </div>
                                <div class="bar"></div>
                                <div>
                                    <text class="label" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">商家公告</text>
                                </div>
                                <div style="flex-direction: row;margin-top: 5px;align-items: center;padding-bottom: 20px;padding-bottom: 40px;">
                                    <image class="horns" src="https://image.aftdc.com/images/note.jpg"></image>
                                    <text class="blackFont" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor,paddingLeft:'10px'}">{{shopInfo.notice}}</text>
                                </div>
                                <div>
                                    <text class="label" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">商家信息</text>
                                </div>
                                <div style="flex-direction: row;margin-left: 20px;margin-top: 20px;align-items: center">
                                    <image class="icon" src="https://image.aftdc.com/images/phone.png"></image>
                                    <text class="textMsg" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">电话:</text>
                                    <text class="textMsg" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">{{shopInfo.shopTel}}</text>
                                </div>
                                <div style="flex-direction: row;margin-left: 20px;margin-top: 20px;align-items: center">
                                    <image class="icon" src="https://image.aftdc.com/images/send1.png"></image>
                                    <text class="textMsg" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">配送服务：由 {{shopInfo.dlvService=='1'?'蜂鸟':'商家'}} 提供配送服务</text>
                                </div>
                                <div style="flex-direction: row;margin-left: 20px;margin-top: 20px;align-items: center">
                                    <image class="icon" src="https://image.aftdc.com/images/time.png"></image>
                                    <text class="textMsg" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">营业时间: </text>
                                    <text class="textMsg" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">{{shopInfo.serviceStartTime}} - {{shopInfo.serviceEndTime}}</text>
                                </div>
                                <div style="flex-direction: row;margin-left: 20px;margin-top: 20px;align-items: center">
                                    <image class="icon" src="https://image.aftdc.com/images/licence.png"></image>
                                    <text class="textMsg" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">查看食品安全档案</text>
                                </div>
                                <div style="flex-direction: row;margin-left: 20px;margin-top: 20px; padding-bottom: 40px;align-items: center" v-if="shopInfo.certification==1">
                                    <image class="icon" src="https://image.aftdc.com/images/daV.png"></image>
                                    <text class="textMsg" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">已认证</text>
                                </div>
                                <div>
                                    <div v-if="shopInfo.projectNum>0">
                                        <text class="label" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">商家活动</text>
                                    </div>
                                    <div class="normal" style="justify-content: space-between;">
                                        <div style="flex-direction: row;align-items: center">
                                            <text class="filling" :style="{fontSize:GLOBAL.smallFS}">充</text>
                                            <text class="textMsg" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">充值成为商家VIP会员，享受更多优惠</text>
                                        </div>
                                        <div>
                                            <text class="fillings" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.tColor}">充值</text>
                                        </div>
                                    </div>
                                    <div class="normal" v-if="shopInfo.mj">
                                        <text class="reduction" :style="{fontSize:GLOBAL.smallFS}">减</text>
                                        <text class="textMsg" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">{{shopInfo.youhui}}</text>
                                    </div>
                                    <div class="normal" v-if="shopInfo.newCou">
                                        <text class="newUser" :style="{fontSize:GLOBAL.smallFS}">新</text>
                                        <text class="textMsg" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">新用户立减{{shopInfo.newCou}}元</text>
                                    </div>
                                    <div class="normal" v-if="shopInfo.yhq">
                                        <text class="receive" :style="{fontSize:GLOBAL.smallFS}">领</text>
                                        <text class="textMsg" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">进店领取优惠券</text>
                                    </div>
                                    <div class="normal" v-if="shopInfo.zk">
                                        <text class="bl-zhe" :style="{fontSize:GLOBAL.smallFS}">折</text>
                                        <text class="textMsg" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">折扣商品</text>
                                    </div>
                                    <div class="normal" v-if="shopInfo.tg">
                                        <text class="bulk" :style="{fontSize:GLOBAL.smallFS}">团</text>
                                        <text class="textMsg" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">团购商品</text>
                                    </div>
                                    <div class="normal" v-if="shopInfo.djq">
                                        <text class="rob" :style="{fontSize:GLOBAL.smallFS}">代</text>
                                        <text class="textMsg" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">抢购代金券</text>
                                    </div>
                                    <div class="normal" v-if="shopInfo.kj">
                                        <text class="cut" :style="{fontSize:GLOBAL.smallFS}">砍</text>
                                        <text class="textMsg" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">砍价商品</text>
                                    </div>
                                    <div class="normal" v-if="shopInfo.kj">
                                        <text class="bl-miao" :style="{fontSize:GLOBAL.smallFS}">秒</text>
                                        <text class="textMsg" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">秒杀商品</text>
                                    </div>
                                    <div class="normal" v-if="shopInfo.kj" style="padding-bottom: 20px;">
                                        <text class="bl-jian" :style="{fontSize:GLOBAL.smallFS}">红</text>
                                        <text class="textMsg" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">进店领红包</text>
                                    </div>
                                </div>
                            </div>

                            <div class="jumpDiv">
                                <text class="map" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">位于{{shopInfo.shopAddress}}</text>
                                <image class="arrow_blackSize" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                            </div>
                            <div class="jumpDiv">
                                <text class="report" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">举报商家</text>
                                <image class="arrow_blackSize" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                            </div>
                            <div class="jumpDiv">
                                <text  class="collection" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">{{shopInfo.colType==1?'已收藏商家':'收藏商家'}}</text>
                                <!--<text>已经收藏商家</text>-->
                                <image class="arrow_blackSize" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                            </div>
                            <!--<div style="flex-direction: row;justify-content: space-between;margin: 20px;">-->
                            <!--<text class="line"></text>-->
                            <!--<text class="overline">我是有底线的</text>-->
                            <!--<text class="line"></text>-->
                            <!--</div>-->

                        </scroller>
                    </div>
                </slider>
            </div>
        </div>
        <!--&lt;!&ndash;商品详情弹出框&ndash;&gt;-->


        <div class="backDiv" v-if="specBoxShow" @click="boxHide">
            <div class="box" @click="">
                <text class="box_name" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{box.goodsName}}</text>
                <div class="box_spec">
                    <div class="box_size" v-if="box.guige">
                        <text class='box_guigeName' :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">规格:</text>
                        <div class='box_guigeNameR'>
                            <text class="box_specClass" v-for="(item,index) in box.guige" :class="[box.choose==index?'select':'']" @click="sizeClick(index,item.guigeName)" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">{{item.guigeName}} </text>
                        </div>
                    </div>
                    <div class="box_taste" v-if="box.guigeAttr">

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
        </div>
        <!--商品详情弹出框-->
        <wxc-mask height="810"
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
            <text class="box_name shopDetailName" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{box.goodsName}}</text>
            <div class="box_bott">
                <div class="box_price">
                    <text class="box_sale">￥{{box.shopPrice}}</text>
                </div>
                <text class="box_okbtn box_btn"  v-if="box.guige||box.taste" @click="choiceGuigeClick()" :style="{fontSize:GLOBAL.smallFS}">选规格</text>
                <text class="box_okbtn box_btn" v-else @click="ok()" :style="{fontSize:GLOBAL.smallFS}">选好了</text>
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
                        <div class="allCouponDiv" v-for="(item,index) in coupon">
                            <image class="couponBoxImg" src="https://image.aftdc.com/appBimg/icon_yhq.png"></image>
                            <div class="couponDetailContent">
                                <div class="couponDetailPrice">
                                    <text class="rmbText" >￥</text>
                                    <text class="detailPriceText">{{item.couponMoney}}</text>
                                </div>
                                <div class="couponDetailTip">
                                    <text class="useCouponText">满{{item.spendMoney}}可用</text>
                                    <text class="couponTime">有效期{{item.validEndTime}}</text>
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

    </div>

    <!--</div>-->
</template>

<script>
    import { WxcMask,WxcPopup,WxcPopover } from 'weex-ui';
    const animation = weex.requireModule('animation')
    const modal = weex.requireModule('modal')
    const dom = weex.requireModule('dom');
    const post = weex.requireModule('stream');
    const event=weex.requireModule('event')
    const navigator = weex.requireModule('navigator');
    export default {
        components: { WxcMask,WxcPopup,WxcPopover },
        name: 'App',
        data() {
            return {
                backImgToggle: 0,//头部返回图片判断
                activeTab: 0,//轮播图
                tabIndex: 0,//切换
                shopCarShow:false,//购物车详情弹出框判断
                shopCarPopupHeight:'',//购物车详情弹出框高度
                specBoxShow:false,//规格详情弹出框判断

                leftIndex: 0,//分类


                ratingSelect:0,//评价切换

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
                        icon: 'https://image.aftdc.com/appBimg/icon_operation_vip.png',
                        text:'分享商家',
                        key:'key-scan'
                    },
                    {
                        icon: 'https://image.aftdc.com/appBimg/icon_operation_vip.png',
                        text:'联系商家',
                        key:'key-qrcode'
                    },
                    {
                        icon: 'https://image.aftdc.com/appBimg/icon_operation_vip.png',
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
                //接口数据
                shopInfo:{},//商店基本信息
                orders:[],//商店历史订单信息
                Von: [],
                //优惠卷
                coupon:[],//优惠卷信息
                orderCoupon:'',//是否有优惠卷
                couponlen:'',//优惠卷长度
                couponState:'',//是否领取过优惠卷
                couponSum:'',//优惠卷总价格
                presentNub:false,//是否有多张优惠卷
                //优惠卷
                pinglun:'',//评论
                changepl:[],//评论点赞保存的数据，接接口用
                //接口数据
                //商品详情弹出框
                boxShow:false,//图片弹出框判断
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
                deskNum: -1,//外卖
                // shopCarPop:false,//控制是否能点击弹出购物车详情框
                bargainBox: {},//砍价的数据
                bargainMark: false,//砍价商品的标识
                bargainShow: false,//砍价框
                prans:'',//点击砍价储存的信息
                bargainTipsPrice:0,//砍价砍了的价格
                specTasteName:'',

                specBox:'',

                boxStyle: {
                    top:'260',
                },
                x: 0,
                y: 0,
                startX :0,
                startY : 0,
            }
        },
        created() {
            //     var that = this
            //     setInterval(function () {
            //         that.activeTab++;
            //         console.log(that.activeTab);
            //     }, 2000)
            var that=this

            var timestamp = Date.parse(new Date()) / 1000;
            var sign = 'im=' + that.imei + '&token=' + that.token + '&timestamp=' + timestamp
            // var sign = this.GLOBAL.md5(sign);
            sign = sign.toUpperCase()
            var shopId = 642
            var userId = 16
            var latitude = 23.15792
            var longitude = 113.27324
            var formData = 'shopId=' + shopId + '&&' + 'userId=' + userId + '&&' + 'latitude=' + latitude + '&&' + 'longitude=' + longitude;
            post.fetch({
                method: 'POST',
                type: 'json',
                body: formData,
                url: 'https://www.aftdc.com/wxapp/Shop/index',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
            }, function (res) {
                // that.Von = res.data[0].dishes
                // that.rows = res.data[0].dishes
                that.shopInfo=res.data.info
                that.orders=res.data.orders
                that.Von=res.data[0].dishes
                //判断优惠卷
                var coupon = res.data.coupon
                if (coupon) {
                    var orderCoupon = true
                    var couponlen = coupon.length
                    //计算优惠券总金额
                    var couponSum = 0
                    for (var i in coupon) {
                        couponSum += Number(coupon[i].couponMoney)
                        // couponIdArr += coupon[i].couponId + ","
                        if (!coupon[i].type) {
                            var couponState = true;
                        } else {
                            var couponState = false;
                        }
                    }
                    //优惠券长度
                    if (couponlen > 1) {
                        that.presentNub=true
                    }else{
                        that.OnespendMoney = coupon[0].spendMoney
                        that.presentNub=false
                    }
                    that.couponSum=couponSum
                    // that.couponIdArr=couponIdArr
                    that.couponState=couponState
                } else {
                    var orderCoupon = false
                }
                if (!coupon=='') {

                    that.coupon=coupon.reverse()

                }
                that.couponlen=couponlen
                that.orderCoupon=orderCoupon
                //判断优惠卷
                that.pinglun=res.data.pinglun
                // 截取优惠信息
                var youh = res.data.info.youhui
                youh = youh.replace(/，/g, ',')
                var str = youh.split(",")
                var lenstr = str.length
                var tipsIfor = []
                for (var i = 0; i < lenstr; i++) {
                    var cond = str[i].substring(str[i].indexOf("满") + 1, str[i].indexOf("减"));
                    var result = str[i].substring(str[i].indexOf("减") + 1);
                    var obj = { m: cond, j: result }
                    tipsIfor.push(obj)
                }
                that.tipsIfor=tipsIfor
                that.distance_price=that.shopInfo.deliveryFreeMoney
                console.log(that.shopInfo)
            })

            that.textCarousel();

        },
        methods: {
            ontouchend(event) {
                // this.doAnimation();
            },
            ontouchmove(event) {
                var self = this;
                var boxRef = this.$refs.box;


                self.y =  (self.y +  parseFloat(event.changedTouches[0].screenY) - self.startY);
                var top = parseFloat(this.boxStyle.top)+parseFloat(this.y)
                if(top<100){
                    top=0

                }else if(top>260){
                    top=260

                }else{

                }

                dom.updateStyle(boxRef,{top:top})
                modal.toast({message:top})

                self.startY = parseFloat(event.changedTouches[0].screenY);
            },
            ontouchstart (event) {
                var self = this;

                // self.startX = parseFloat(event.changedTouches[0].screenX);
                self.startY = parseFloat(event.changedTouches[0].screenY);
            },
            textCarousel() {
                var that = this
                setInterval(() => {
                    var testEl = this.$refs.test;
                    var bb = 'translate(0px,-' + 100 * that.scrolls + 'px)'
                    animation.transition(testEl, {
                        styles: {
                            transform: bb,
                        },
                        duration: 800, //ms
                        timingFunction: 'ease',
                        needLayout: false,
                        delay: 0 //ms
                    }, function () {
                        if(that.scrolls==that.orders.length){
                            that.orders.unshift(that.orders[that.orders.length - 1])
                            that.orders.pop()
                            that.scrollsTransform=true
                            that.scrolls = 0
                        }

                    })
                    // that.orderHistory.shift()
                    that.scrollsTransform=false
                    that.scrolls = that.scrolls + 1


                }, 2000)


            },
            //图片弹出框
            boxShowClick(index,foodIndex,type) {
                var that=this


                var Von = that.Von
                //如果为砍价
                if (Von[index].catId == 1) {
                    that.bargainShowClick(index, foodIndex);
                    return false
                }

                //
                var box = JSON.parse(JSON.stringify(Von[index].distop[foodIndex]))
                var mark = 'a' + index + 'b' + foodIndex
                box.mark = mark
                //规格
                that.box=box
                that.goodsType=type
                that.boxShow=true

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
                // box.shopPrice = Von[index].distop[foodIndex].guige[0].price
                // box.choose=0;
                // for(let i in box.guigeAttr){
                //     box.guigeAttr[i].choose=0
                // }
                // box.spec_size=box.guige[0].guigeName
                //

                //规格
                box.spec_size=''
                box.spec_taste=''
                that.box=box
                that.specBoxShow=true
                //显示输入框并自动选择所有选项的第一个
                that.sizeClick(0,box.guige[0].guigeName)
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

                console.log(box)
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
                        specTasteName+=','+that.spec_taste[i]
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
                console.log(box.spec_taste)
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
                var box = that.box
                var mark = box.mark //获取弹出盒子的弹出哪件商品标识
                var a = mark.substring(mark.indexOf("a") + 1, mark.indexOf("b"))
                var b = mark.substring(mark.indexOf("b") + 1)
                var Von = that.Von
                Von[a].distop[b].shopPrice = box.shopPrice
                Von[a].distop[b].spec_size = box.spec_size
                Von[a].distop[b].spec_taste = box.spec_taste
                Von[a].distop[b].goodsAttrName = (Von[a].distop[b].spec_size ? Von[a].distop[b].spec_size : "") + "+"
                Von[a].distop[b].goodsAttrName += Von[a].distop[b].spec_taste ? Von[a].distop[b].spec_taste : ""
                Von[a].distop[b].decide = box.decide



                // if ((parseInt(Von[a].distop[b].goodsStock) == 0) || ((parseInt(Von[a].distop[b].goodsStock) <= Von[a].distop[b].numb) && (parseInt(Von[a].distop[b].goodsStock) != -1))) {
                //
                //     wx.showToast({
                //         title: '没有库存了',
                //         content: '该订单部分商品库存不足',
                //         icon: 'loading',
                //         duration: 2000,
                //         success: function () {
                //             Von[a].distop[b].numb = Von[a].distop[b].numb
                //             that.setData({
                //                 Von: Von
                //             })
                //             //要延时执行的代码
                //             return false
                //         }
                //     })
                //     return false
                // }
                //
                // if (parseInt(Von[a].distop[b].isSale) == 0) {
                //     wx.showToast({
                //         title: '商品已下架',
                //         content: '该订单部分商品已下架',
                //         icon: 'loading',
                //         duration: 2000,
                //         success: function () {
                //             Von[a].distop[b].numb = Von[a].distop[b].numb
                //             that.setData({
                //                 Von: Von
                //             })
                //             return false
                //         }
                //     })
                //     return false
                // }
                if (isNaN(Von[a].distop[b].numb)){
                    Von[a].distop[b].numb = 0
                }
                Von[a].distop[b].numb++
                that.box.numb++
                var car = that.car
                var arr = JSON.parse(JSON.stringify(Von[a].distop[b]))
                var car1 = car
                if (car1.filter(item => item.arr.goodsId == arr.goodsId && item.arr.spec_size == arr.spec_size && item.arr.spec_taste == arr.spec_taste).length > 0) {
                    car1.filter(item => item.arr.goodsId == arr.goodsId && item.arr.spec_size == arr.spec_size && item.arr.spec_taste == arr.spec_taste)[0].arr.numb++;
                }
                else {
                    arr.numb = 1;
                    var obj = { arr: arr, mark: mark };
                    car1.push(obj)
                }
                if(Von[a].allNumb){
                    Von[a].allNumb++
                }else{
                    Von[a].allNumb=1
                }

                that.Von=Von
                that.boxShow=false
                that.bargainShow=false
                // that.specBoxShow=false
                that.car=car1
                console.log(that.car)
                that.sum()
            },
            specBoxSub(){
                var that=this
                var box=that.box
                var mark=box.mark
                var a = mark.substring(mark.indexOf("a") + 1, mark.indexOf("b"))
                var b = mark.substring(mark.indexOf("b") + 1)
                that.sub(a,b)
            },
            add(index,foodIndex) {//加
                var that = this

                var Von = that.Von
                //
                // if ((parseInt(Von[index].distop[foodIndex].goodsStock) == 0) || ((parseInt(Von[index].distop[foodIndex].goodsStock) <= Von[index].distop[foodIndex].numb) && (parseInt(Von[index].distop[foodIndex].goodsStock) != -1))) {
                //     wx.showToast({
                //         title: '没有库存了',
                //         content: '该订单部分商品库存不足',
                //         icon: 'loading',
                //         duration: 2000,
                //         success: function () {
                //             Von[index].distop[foodIndex].numb = Von[index].distop[foodIndex].numb
                //             that.setData({
                //                 Von: Von
                //             })
                //             return false
                //         }
                //     })
                //     return false
                // }

                // if (parseInt(Von[index].distop[foodIndex].isSale) == 0) {
                //     wx.showToast({
                //         title: '商品已下架',
                //         content: '该订单部分商品已下架',
                //         icon: 'loading',
                //         duration: 2000,
                //         success: function () {
                //             Von[index].distop[foodIndex].numb = Von[index].distop[foodIndex].numb
                //             that.setData({
                //                 Von: Von
                //             })
                //             return false
                //         }
                //     })
                //     return false
                // }


                if (!Boolean(Von[index].distop[foodIndex].numb)) {
                    Von[index].distop[foodIndex].numb = 0
                }
                Von[index].distop[foodIndex].numb++
                if(Von[index].allNumb){
                    Von[index].allNumb++
                }else{
                    Von[index].allNumb=1
                }

                that.Von=Von
                var car = that.car
                var arr = JSON.parse(JSON.stringify(Von[index].distop[foodIndex]))
                var boxFee = that.boxFee
                var deskNum =that.deskNum
                if (deskNum == -1) {
                    if (arr['boxFee'] == '1') {
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
                        // wx.showToast({
                        //     title: '团购商品不可与其他商品同时购买',
                        //     icon: 'loading',
                        //     duration: 1500
                        // })
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

                that.sum()
            },
            sub(index,foodIndex){//减
                var that=this
                var Von = that.Von
                Von[index].distop[foodIndex].numb--
                Von[index].allNumb--
                that.Von=Von
                var mark = 'a' + index + 'b' + foodIndex
                var arr = JSON.parse(JSON.stringify(Von[index].distop[foodIndex]))
                var boxFee = that.boxFee
                var deskNum = that.deskNum
                if (deskNum == -1) {
                    if (arr['boxFee'] == '1') {
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

                that.sum()
            },
            //购物总数弹出框的·加
            buyadd(index){
                var that=this
                var car = that.car
                console.log(car)
                car[index].arr.numb++

                var mark = car[index].mark
                console.log(mark)

                var a = mark.substring(mark.indexOf("a") + 1, mark.indexOf("b"))
                var b = mark.substring(mark.indexOf("b") + 1)

                var Von = that.Von
                Von[a].distop[b].numb++
                var arr = Von[a].distop[b]
                var boxFee = that.boxFee
                var deskNum = that.deskNum
                if (deskNum == -1) {
                    if (arr['boxFee'] == '1') {
                        that.start++
                        var boxFees = start * boxFee

                        that.boxFees=boxFees

                    }
                }

                that.car=car;
                if(Von[a].allNumb){
                    Von[a].allNumb++
                }else{
                    Von[a].allNumb=1
                }
                that.Von=Von;

                that.sum()
            },
            //购物总数弹出框的·减
            buysub(index){
                var that=this
                var car = that.car
                car[index].arr.numb--
                var mark = car[index].mark
                var a = mark.substring(mark.indexOf("a") + 1, mark.indexOf("b"))
                var b = mark.substring(mark.indexOf("b") + 1)

                var Von = that.Von
                Von[a].distop[b].numb--
                Von[a].allNumb--
                var arr = Von[a].distop[b]
                var deskNum = that.deskNum
                if (deskNum == -1) {
                    var boxFee = that.boxFee
                    if (arr['boxFee'] == '1') {
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
                // var zkNumb = that.zkNumb
                // that.zkshow=true
                var types = true
                for (var i = 0; i < car.length; i++) {
                    //商品存在 type=1为不享受活动
                    if (Boolean(car[i].arr.type) && types) {
                        types = false;
                    }
                    totalprice += car[i].arr.shopPrice * car[i].arr.numb;
                    totalMarketPrice += car[i].arr.marketPrice * car[i].arr.numb;
                    totalnumb += car[i].arr.numb
                    // if (Boolean(zkNumb)) {
                    //     var mark = car[i].mark
                    //     var a = mark.substring(mark.indexOf("a") + 1, mark.indexOf("b"))
                    //     if (a == Number(zkNumb) - 1) {
                    //
                    //         that.zkshow=false,
                    //
                    //         zkNumb = false
                    //     }
                    // }
                }
                totalprice = Number(totalprice + that.boxFees).toFixed(2)
                totalMarketPrice = Number(totalMarketPrice).toFixed(2)

                that.totalprice=totalprice;
                that.totalnumb=totalnumb;
                that.discount=types;//是否能享受优惠

                //判断起送价
                if (that.id == undefined) {
                    var dfm = that.shopInfo.deliveryFreeMoney
                    var distance_price = parseInt(dfm * 100 - totalMarketPrice * 100) / 100

                    if (distance_price > 0) {
                        that.distance_price=distance_price
                        that.shopCar=false
                    } else if (car.length < 1) {
                        that.shopCar=false
                    } else {
                        that.distance_price=false
                        that.shopCar=true
                    }
                } else {
                    // that.shareIdD=true
                    that.shopCar=true
                }
                //不能享受优惠就不走下面的计算
                // if (types) {
                //
                //     //满减
                //     var tipsIfor = that.tipsIfor
                //     var lenTips = tipsIfor.length
                //     var tipsIforEnd = -1
                //     var tipsIforData = {}
                //     for (var i = 0; i < lenTips; i++) {
                //         var m = Number(tipsIfor[i].m)
                //         if (m <= totalprice) {
                //             tipsIforEnd = i
                //         }
                //     }
                //     var Ends = tipsIforEnd + 1
                //     if (tipsIforEnd < 0) {
                //         var againM = parseInt(tipsIfor[0].m * 100 - totalprice * 100) / 100
                //         tipsIforData.againM = againM;
                //         tipsIforData.againJ = tipsIfor[0].j;
                //         var deduction = 0 //优惠金额
                //     } else if (tipsIforEnd >= 0 && Ends < lenTips) {     //有立减，而且后面还存在金额更大的立减
                //         var againM = parseInt(tipsIfor[Ends].m * 100 - totalprice * 100) / 100
                //         tipsIforData.againM = againM;
                //         tipsIforData.againJ = tipsIfor[Ends].j;
                //         tipsIforData.resultJ = tipsIfor[tipsIforEnd].j;
                //         var deduction = tipsIfor[tipsIforEnd].j;//优惠金额
                //     } else if (tipsIforEnd == lenTips - 1) {
                //         tipsIforData.endM = tipsIfor[tipsIforEnd].m;
                //         tipsIforData.endJ = tipsIfor[tipsIforEnd].j;
                //         var deduction = tipsIfor[tipsIforEnd].j;//优惠金额
                //     }
                //     that.tipsIforData=tipsIforData
                //     that.deduction=deduction
                // }
            },
            couponShowClick(){

                var that=this
                //已领取过优惠卷时
                if(that.presentNub){
                    that.couponShow=true
                }
                //未领取优惠卷需接接口
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
            /*购物车分类*/
            sortClick(index) {
                this.leftIndex = index
                dom.scrollToElement(this.$refs.gooding[index], {})
            },


            // /*还没有点赞过*/
            // zanClick(num){
            //     if(this.zanNums==0){
            //         this.zanData[num].zanNum=1;
            //         this.goodClick()
            //         this.zanNums=1
            //     }else{
            //         this.zanData[num].zanNum=0;
            //         this.zanNums=0
            //     }
            // },
            /*点赞热度热度*/
            praiseClick(id,index){
                var that=this

                //登陆时的情况，未登陆需跳转的登陆页面
                var pinglun = that.pinglun.all
                var isDZ = pinglun[index].isDZ
                pinglun[index].isDZ = isDZ == 0 ? 1 : 0;

                var zanshow = pinglun[index].isDZ;
                var numb = Number(pinglun[index].numbs);

                var changepl = that.changepl;
                if (zanshow == 0) {
                    pinglun[index].numbs = Number(numb - 1);
                } else if (zanshow == 1) {
                    that.zanAnimation()
                    pinglun[index].numbs = Number(numb + 1)
                }
                var len = changepl.length
                for (var i = 0; i < len; i++) {
                    if (changepl[i].id == id) {
                        changepl.splice(i, 1)
                        break
                    }
                }
                var obj = { id: id, isDZ: zanshow }
                changepl.push(obj)
                that.pinglun.all = pinglun
                that.changepl=changepl

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
            popoverButtonClicked(obj){
                var index=obj.index//点击气泡层按钮的index
            },
            toOrderPage(){
                var param='';
                var url='http://assets/orderPage.js';
                event.toUrl({"url":url,"param":param})
            },
            toCollage(){
                var param='';
                var url='http://assets/collage.js';
                event.toUrl({"url":url,"param":param})
            },
            toPersonalHomePage(){
                var param='';
                var url='http://assets/personalHomePage.js';
                event.toUrl({"url":url,"param":param})
            }
            // backClick(){
            //     // navigator.pop({animated:'true'})
            // },

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
        flex: 0.5;
        /*margin-left: 60px;*/
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
        padding-right: 20px;

    }

    .icon_search {
        width: 65px;
        height: 65px;
    }

    .icon_star {
        width: 45px;
        height: 45px;
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
    }

    .whiteFont {
        color: #ffffff;
    }

    .whiteTime {
        width: 25px;
        height: 25px;
    }

    .toTop {
        flex: 1;
    }

    .topBody {
        background-color: #53beb7;
        flex-direction: row;
        padding-top: 10px;
        padding-left: 20px;
        padding-right: 5px;
        align-items: center;
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

    .btnFocus {
        padding-top: 5px;
        padding-bottom: 5px;
        padding-left: 20px;
        padding-right: 20px;
        background-color: #e06556;
        border-radius: 40px;
        color: #ffffff;

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
    .couponDiv{
        position: relative;
        height: 130px;
        margin-top: 10px;
        margin-left: 10px
    }
    .quanImg {
        width: 540px;
        height: 130px;

    }

    .goodImg {
        margin-top: 5px;
        width: 135px;
        height: 135px;
    }
    .foodNameText{
        flex-direction:row;
        padding-bottom: 5px;
        max-width: 300px;
        lines:1;
        text-overflow: ellipsis
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
        width: 40px;
        height: 40px;
        margin-right: 5px;
    }
    .addImg {
        width: 40px;
        height: 40px;
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



    }
    .couponPrice{
        flex-direction: row;
        align-items: flex-end;
        margin-left: 10px
    }
    .couponMessage{
        flex-direction: column;
        justify-content: center;
        margin-left: 15px;
    }

    .get {
        flex-direction: row;
        flex: 1.2;
        justify-content: center;

    }

    .goods {
        border-bottom-style: solid;
        border-bottom-width: 1px;
        border-bottom-color: rgba(153, 153, 153, 0.2);
        padding-bottom: 15px;
        padding-top: 10px;
        margin-left: 10px;
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
        width: 26px;
        height: 26px;
        background-color: red;
        border-radius: 13px;
        text-align: center;
        line-height: 26px;
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
        width: 230px;
        height: 128px;
        margin-right: 10px;
    }

    .label {
        padding-left: 20px;
        padding-top: 10px;
        padding-bottom: 10px;
    }

    .bar {
        width: 710px;
        height: 10px;
        background-color: #f8f8f8;
        margin-left: 20px;
        border-radius: 5px;
    }

    .icon {
        width: 30px;
        height: 30px;
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
        background-color: #fd423a;
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
        background-color: #f4a460;
        color: #ffffff;
        text-align: center;
    }

    .bulk {
        width: 40px;
        height: 40px;
        line-height: 40px;
        background-color: #1c86f1;
        color: #ffffff;
        text-align: center;
    }

    .rob {
        width: 40px;
        height: 40px;
        line-height: 40px;
        background-color: #960044;
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
    .normal {
        flex-direction: row;
        margin-left: 20px;
        margin-top: 10px;
        align-items: center;
    }

    .horns {
        width: 30px;
        height: 30px;
        margin-left: 20px;
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
        justify-content: space-between;
        height: 120px;
        align-items: center;
        padding-right: 20px;
        padding-left: 20px;
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

    .textCarousel {
        height: 100px;
        overflow: hidden;

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
        padding-top: 200px;
        padding-bottom: 200px;
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
        flex: 1;
        text-align: center;
    }
    .shopDetailName{
        text-align: left;
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
    }
    .box_taste{
        flex-direction: column;
    }
    .box_bott{
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: 650px;
        padding-top: 20px;
        padding-bottom: 20px;
    }
    .spec_bott{
        background-color: #f1f1f1;
    }

    .box_price{
        flex-direction: row;
        align-items: flex-end;
    }
    .box_sale{
        color: #f00;
        margin-left: 22px;
        margin-right: 10px;
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
        width: 30px;
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
    }
    .numbText{
        width: 30px;
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
        flex: 2;
        flex-direction: column;
        align-items: center;
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
        font-size: 35px;
        color: #333;
        font-weight: bold;
    }
    .couponTime{
        font-size: 30px;
        color: #a1a1a1;
        font-weight: bold;
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
        padding-left: 10px;
        margin-top: 20px;
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
        bottom: 0;
        flex: 1;
        transition-property: top;
        transition-duration: 0.5s;
        transition-timing-function:linear;
    }
</style>
