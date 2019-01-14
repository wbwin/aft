<template>
    <div @touchstart="touchstart" @touchmove="touchmove" @touchend="touchend" @longpress="longpress" @viewappear="viewappear" @viewdisappear="viewdisappear">
        <!--搜索框内容-->
        <div class="searchTitle">
            <image class="iconTitle" @click="backClick()" src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
            <div class="input">
                <div class="row aiCenter">
                    <image class="inputIcon" src="https://image.aftdc.com/appBimg/icon_search.png"></image>
                    <input ref="searchOne" :disabled="inputDisabled" class="inputText" type="text" placeholder="请输入商品名称" maxLength="32" @input="input" @focus="allFocus()" @blur="allBlur()"  v-model="searchText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}"/>
                </div>
                <div class="clearIconDiv" v-if="ClearIcon" @click="clearIconClick">
                    <div class="clearIconDivA"></div>
                    <div class="clearIconDivB"></div>
                </div>
            </div>
            <text class="search" @click="sousuoClick">搜索</text>
        </div>


        <!--历史记录和猜你想搜-->

        <!--历史记录-->
        <div class="listHistory"  v-if="historyList.length>0&&searchText===''">
            <div class="history">
                <div class="historyDiv">
                    <div style="flex-direction: row;align-items: center;width: 300px;" >
                        <text class="historyText" :style="{fontSize:GLOBAL.bigFS}">历史记录</text>
                    </div>
                </div>
                <div style="padding-left: 30px;" @click="deleteIconClick">
                    <image class="deleteIcon"  src="https://image.aftdc.com/appBimg/icon_delete.png"></image>
                </div>
            </div>
            <div class="historyContent">
                <div class="historyContentDiv"  v-for="(item,index) in historyList"  @click="historySearchClick(index)">
                    <text class="historyContentText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item}}</text>
                </div>
            </div>
        </div>

        <scroller show-scrollbar="false" class="headLineBlock" v-if="searchText!==''" @scroll="scrollMove">
            <template v-if="orderType!=6&&orderType!=7" >
                <div v-for="(item,index) in Von" ref="friScroller" >
                    <div class="goods"
                         v-for="(food,foodIndex) in item.distop" v-if="food.goodsName.indexOf(searchText)!=-1" @click="boxShowClick(index,foodIndex,food.type)">
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
                <div v-for="(item,index) in Von"  ref="friScroller" >
                    <div class="tkDishes" >
                        <div class="tkFood"
                             v-for="(food,foodIndex) in item.distop" v-if="food.goodsName.indexOf(searchText)!=-1" >
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
            <div v-if="goodsData.length < 1">
                <text class="noArticle" :style="{color:GLOBAL.dColor}">抱歉，没有找到相关的内容</text>
            </div>

        </scroller>
        <template v-if="inputFocus">
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

            <div class="shopCar" @click="shopCarShowClick()"  >
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
                            <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}" v-if="shopInfo.deliveryStartMoney>0&&car.length>0&&orderType==0">另需配送费￥{{shopInfo.psf}}元</text>
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
            <div v-if="shopCarShow" class="shopGood" @click.stop="popupClick">
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
        </template>
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

        <toast ref="toast"></toast>

    </div>
</template>

<script>
    import Toast from './Toast.vue';
    import {WxcMask, WxcMinibar, WxcPopup} from 'weex-ui';
    const animation = weex.requireModule('animation')
    const modal = weex.requireModule('modal')
    const dom = weex.requireModule('dom');
    const post = weex.requireModule('stream');
    const event=weex.requireModule('event');
    const GLOBAL = require('@/Global.vue');
    const navigator = weex.requireModule('navigator');
    export default {
        components: {WxcMask, WxcMinibar, WxcPopup,Toast},
        name: 'App',
        data() {
            return {
                hasAnimation: true,
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
                //接口数据
                shopInfo:{},//商店基本信息
                Von: [],
                distance:'',//距离,用于比较
                serviceStartTime:'',//商家最早营业时间
                serviceEndTime:'',//商家最晚结束营业商家
                orderType:0,//店铺类型
                shopType:1,//店铺类型
                shopId:'',
                requiredCatId:'',//必选的catId
                requiredName:'',//必选的catName
                //预订时间
                presetTime: [],
                presetStartTime: '',
                restTimeBookForward: false,
                closeButton: true, //是否显示所有添加商品的按钮
                //团购
                type:0,
                shopCarShow:false,//购物车详情弹出框判断
                shopCarPopupHeight:'',//购物车详情弹出框高度
                specBoxShow:false,//规格详情弹出框判断
                shareOrder:false,

                searchText:'',//input框的数据绑定
                ClearIcon:false,//字体清除图标
                ClearHistory:false,//
                Complete:false,
                historyLength:false,
                barShow:false,
                historyList:[],//历史记录
                goodsData:[],
                pageBack:false,
                canSave:true,//是否是返回上一页

                touch:false,//用于获取焦点和失去焦点的兼容
                inputFocus:true,
                blurPrevent:false,//阻止多次失去焦点的定时器
                blurPreventSec:false,
                inputDisabled:false,//防止长按复制粘贴的时候底部消失


            }
        },
        created() {
            var that=this
            var messageToSearch=JSON.parse(event.find('messageToSearch'))
            event.delete('messageToSearch')
            that.Von=messageToSearch.Von
            that.car=messageToSearch.car
            that.requiredCatId=messageToSearch.requiredCatId
            that.requiredName=messageToSearch.requiredName
            that.shopType=messageToSearch.shopType
            that.orderType=messageToSearch.orderType
            that.shopInfo=messageToSearch.shopInfo
            that.shopId=that.shopInfo.shopId
            that.box=messageToSearch.box//选中的商品的数据
            that.goodsType=messageToSearch.goodsType
            that.car=messageToSearch.car//购物车
            that.boxFees=messageToSearch.boxFees//餐盒费
            that.distance=messageToSearch.distance//距离,用于比较
            that.serviceStartTime=messageToSearch.serviceStartTime//商家最早营业时间
            that.serviceEndTime=messageToSearch.serviceEndTime//商家最晚结束营业商家
            //预订时间
            that.presetTime=messageToSearch.presetTime
            that.presetStartTime=messageToSearch.presetStartTime
            that.restTimeBookForward=messageToSearch.restTimeBookForward
            that.closeButton=messageToSearch.closeButton//是否显示所有添加商品的按钮
            that.type=messageToSearch.type//团购 代金券
            that.shareOrder=messageToSearch.shareOrder//团购 代金券
            if(event.find('historyList'+that.shopId)){
                that.historyList=JSON.parse(event.find('historyList'+that.shopId))
                event.delete('historyList'+that.shopId)
            }

            that.sum()



        },
        methods: {
            // input的获取焦点和失去焦点
            touchmove(){
                this.touch=true;
            },
            touchstart(){
                this.inputDisabled=false
            },
            touchend(){
                this.touch=false;

            },
            scrollMove(){
                if(this.touch){
                    this.blur()
                }
            },
            longpress(){
                var that=this
                if(that.inputFocus){
                    that.inputDisabled=true
                }

            },
            //键盘弹起后点击其他地方收起键盘
            allFocus(){
                var that=this;
                if(that.inputDisabled){
                    return false
                }
                that.inputFocus=false;
                if(that.blurPrevent){
                    that.blurPreventSec=true;
                }
                else{
                    that.blurPreventSec=false;
                }
                // that.aa=true;
                setTimeout(function () {
                    that.blurPrevent = true;
                },80)
                setTimeout(function () {
                    that.blurPreventSec=false;
                },320)

            },
            allBlur(){
                var that=this;
                setTimeout(function () {
                    if(that.blurPreventSec){
                        setTimeout(function () {
                            that.blurPreventSec=false;
                        },40)
                    }
                    else{
                        that.inputFocus=true;
                        that.blurPrevent = false;
                    }
                }, 200)
            },
            blur(){
                var that=this

                that.$refs.searchOne.blur()


            },

            deleteIconClick(){
                var that=this
                modal.confirm({
                    message: '是否清除历史记录？',
                    okTitle:'确定',
                    cancelTitle:'取消',
                },function (value) {
                    if(value=='确定'){
                        that.historyList=[]
                    }
                })
            },
            sousuoClick(){
                var that=this
                that.saveHistoryList()
                that.goodsDataMessage(that.searchText)
                that.blur()
            },
            clearIconClick(){
                var that=this
                that.saveHistoryList()
                that.searchText=''
                that.ClearIcon=false
            },
            input(event){
                var that=this
                that.goodsDataMessage(event.value)

                if(event.value!==''){
                    that.ClearIcon=true;
                }
                else{
                    that.ClearIcon=false;
                }
                that.searchText=event.value
            },
            historySearchClick(index){
                var that=this
                that.searchText=that.historyList[index]
                that.goodsDataMessage(that.searchText)
            },
            goodsDataMessage(value){
                var that=this
                var Von=that.Von
                var goodsData=[]
                for(var i in Von){
                    for(var j in Von[i].distop){

                        if(Von[i].distop[j].goodsName.indexOf(value)!=-1){
                            goodsData.push(Von[i].distop[j])
                        }
                    }

                }
                that.goodsData=goodsData
            },
            saveHistoryList(){
                var that=this
                var historyList=that.historyList
                var searchText=that.searchText
                if(searchText!==''){
                    for(var i in historyList){
                        if(historyList[i]==searchText){
                            historyList.splice(i,1);
                        }else if(historyList.length==10){
                            historyList.splice(9,1)
                        }

                    }
                    historyList.unshift(searchText)
                    that.historyList=historyList
                }
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
            //点击黑色层跳出弹出框
            boxHide(){
                var that=this
                that.boxShow=false
                that.specBoxShow=false
            },
            //弹出层隐藏
            wxcMaskSetHidden(){
                var that=this
                that.boxShow=false
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
            toOrderPage:GLOBAL.throttle(function(){
                var that=this
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
                    that.canSave=false
                    var param={shopType:that.shopType,orderType:that.orderType};
                    var url='http://assets/orderPage.js';
                    event.toUrl({"url":url,"param":JSON.stringify(param)})
                }else{
                    modal.alert({
                        message:'需要选择[' + that.requiredName + ']下的商品才可下单哦~',
                        okTitle:'好的',
                    },function (value) {
                    })
                }

            }),
            toReserveClick:GLOBAL.throttle(function(){
                var that=this
                that.canSave=false
                var param={shopType:that.shopType,orderType:that.orderType,shopId:that.shopId,shopName:that.shopInfo.shopName,serviceTime:that.shopInfo.serviceTime};
                var url='http://assets/reserve.js';
                event.toUrl({"url":url,"param":JSON.stringify(param)})
            }),
            backToCollage:GLOBAL.throttle(function(){
                var that=this
                that.canSave=false
                var car =that.car
                var orderFood = []
                for (var i in car) {
                    orderFood[i] = car[i].arr
                    orderFood[i].mark = car[i].mark
                }
                var param = JSON.stringify(orderFood);
                event.delete(that.shopId+'orderFood'+that.shopType)
                event.save(that.shopId+'orderFood'+that.shopType,param);
                event.backToIndex(2)
            }),
            viewappear(){
                var that=this
                if (!that.pageBack) { return; }
                that.pageBack = false;


            },
            viewdisappear(){
                var that=this
                that.pageBack = true;
                if(that.canSave){
                    var searchPageMessage={Von:that.Von,car:that.car}
                    event.save('searchPageMessage',JSON.stringify(searchPageMessage))
                }
                that.saveHistoryList()
                event.save('historyList'+that.shopId,JSON.stringify(that.historyList))
            },
            backClick(){
                navigator.pop({animated:'true'})
            },
        },
        mounted() {
            var that=this;
            setTimeout(function () {
                that.$refs.searchOne.focus();
            },0)
        },
    }
</script>

<style scoped>
    .clearIconDiv{
        width: 31px;
        height: 31px;
        background-color: #c9cacc;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        border-radius: 15px;
        margin-right: 20px;
        position: relative;
    }
    .clearIconDivA {
        width: 3px;
        height: 23px;
        background-color: #fff;
        transform: rotate(45deg);
        position: absolute;
        top: 4px;
        left: 14px;
    }
    .clearIconDivB {
        width: 23px;
        height: 3px;
        background-color: #fff;
        transform: rotate(45deg);
        position: absolute;
        top: 14px;
        left: 4px;
    }



    .row {
        flex-direction: row;
    }
    .jcCenter {
        justify-content: center;
    }
    .aiCenter {
        align-items: center;
    }

    .shopAnTimeSize {
        color: #999;
        margin-right: 10px;
    }
    .coverImgStyle {
        margin-top: 15px;
        margin-bottom: 15px;
    }
    .clearHistoryDiv{
        flex-direction: row;
        justify-content: flex-end;
        position: absolute;
        width: 375px;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
    }
    .clearHistoryIcon{
        width: 20px;
        height: 20px;
        margin-top: 30px;
        margin-right: 20px;
        opacity: 0.4;
    }
    .listHistory{
        background-color: #f8f8f8;
        flex: 1;
    }
    .borderClass{
        border-right-style: solid;
        border-right-color: #f6f6f6;
        border-right-width: 2px;
    }
    .historyContentDiv{
        padding-left: 30px;
        padding-right: 30px;
        padding-top: 15px;
        padding-bottom: 15px;
        margin-left: 15px;
        margin-right: 15px;
        margin-top: 15px;
        margin-bottom: 15px;
        border-radius: 5px;
        background-color: rgba(83, 190, 183, 0.18);
        flex-direction: row;
        align-items: center;
        position: relative;
    }
    .historyContent{
        flex-direction: row;
        flex-wrap: wrap;
        padding-left: 15px;
        padding-right: 15px;
        padding-top: 15px;
        padding-bottom: 15px;
        background-color: #fff;

    }
    .historyContentText{
        max-width: 300px;
        text-overflow: ellipsis;
        lines:1;
    }
    .historyText{
        color: #999;
    }
    .historyDiv{
        flex: 1;
        flex-direction: row;
        align-items: center;
    }
    .history{
        flex-direction: row;
        align-items: center;
        padding-left: 30px;
        padding-right: 30px;
        padding-top: 25px;
        padding-bottom: 25px;
        border-style: solid;
        border-color: #f1f1f1;
        border-width: 2px;
        background-color: #fff;
    }
    .deleteIcon{
        width: 30px;
        height: 30px;
    }
    .hisIcon{
        width: 25px;
        height: 25px;
        margin-left: 10px;
        opacity: 0.4;
    }
    .search {
        font-size: 30px;
        color: #fff;
        text-align: center;
        padding-left: 30px;
        padding-right: 30px;
    }

    .inputText {
        background-color: #fff;
        width: 410px;
        placeholder-color:#999;
        height: 70px;
    }

    .inputIcon {
        margin-left: 10px;
        margin-right: 10px;
        width: 35px;
        height: 35px;
        opacity: 0.7;
    }

    .input {
        margin-left: 30px;
        flex: 1;
        border-radius: 15px;
        background-color: #fff;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }

    .iconTitle {
        width: 40px;
        height: 40px;
    }

    .searchTitle {
        flex-direction: row;
        align-items: center;
        background-color: #53beb7;
        padding-bottom: 15px;
        padding-top: 15px;
        padding-left: 15px;
    }
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

    .headLineBlock{
        width: 750px;
        background-color: #fff;
        flex: 1;
    }
    .headLineContent {
        flex-direction: column;
        padding-top: 30px;
    }
    .headLineContent:active{
        background-color: #f1f1f1;
    }

    .contentStyle {
        flex-direction: column;
        padding-bottom: 30px;
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #f1f1f1;
        margin-left: 30px;
        margin-right: 30px;
    }

    .articleMessage {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
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
        height:518px ;
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
        height: 518px;
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
        margin-bottom: 15px;
    }
    .smallImgeText{
        width: 450px;
        lines:3,
    }
    .smallImgSize {
        width: 220px;
        height: 165px;
    }
    .noArticle{
        flex: 1;
        text-align: center;
        font-size:30px;
        padding-top: 100px;
    }
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
    .indicator {
        margin-top: 16px;
        height: 100px;
        width: 100px;
        color: #53beb7;
        margin-bottom: 16px;
    }
    .loadingPage {
        background-color: #fff;
        position: fixed;
        top: 100px;
        left: 0;
        right: 0;
        bottom: 0;
    }
    .loadingImg {
        width: 200px;
        height: 145px;
    }


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
        padding-left: 20px;
        padding-right: 20px;
        background-color: #e06556;
        border-radius: 20px;
        color: #ffffff;
        font-size: 22px;
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
        height: 100px;
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
        /*padding-left: 188px;*/
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
