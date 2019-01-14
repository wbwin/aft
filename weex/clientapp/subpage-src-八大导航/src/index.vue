<template>
    <div class="allBgColor" @viewappear="viewappear" @viewdisappear="viewdisappear">
        <!--筛选框-->
        <div class="classfly" :style="classflyStyle" @click="" >
            <scroller show-scrollbar="false" style="flex: 1" v-if="choiceSearch==0">
                <text class="rankingContent" @click="rankingChoice(index)" :style="{fontSize:GLOBAL.bigFS,color:rankingChoiceIndex==index?GLOBAL.tColor:GLOBAL.dColor}" v-for="(item,index) in comprehensiveRanking">{{item.name}}</text>
            </scroller>
            <scroller show-scrollbar="false" v-if="choiceSearch==3" style="flex: 1">
                <div class="aiCenter" v-if="shopType === 6 || shopType === 8">
                    <div class="allCuisuneDiv">
                        <div class="allScreen"  @click="ruleScreenClick(0)">
                            <text class="screen" :class="[allChoice.myy?'cuisuneColor':'']" :style="{fontSize:GLOBAL.defaultFS,color:allChoice.myy?GLOBAL.tColor:GLOBAL.dColor}">免预约</text>
                        </div>
                        <div class="allScreen"  @click="ruleScreenClick(1)">
                            <text class="screen holiday" :class="[allChoice.jjrty?'cuisuneColor':'']" :style="{fontSize:GLOBAL.defaultFS,color:allChoice.jjrty?GLOBAL.tColor:GLOBAL.dColor}">节假日通用</text>
                        </div>
                    </div>
                </div>
                <!--营业时段-->
                <div>
                    <text class="screenTitle" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{timeScreen.title}}</text>
                    <div class="aiCenter">
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
                    <div class="aiCenter">
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

        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    v-once>
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">{{title}}</text>
            </wxc-minibar>
        </div>
        <div class="searchBoxBg">
            <div class="searchBox row">
                <image class="articleSearchImg" src="https://image.aftdc.com/appBimg/icon_search.png"></image>
                <text class="searchTextSec" @click="toSearch" :style="{fontSize:GLOBAL.bigFS}">请输入商家或商品名称</text>
            </div>
        </div>
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

        <div class="wrap">
            <list ref="list" class="scroller" show-scrollbar="false" >
                <cell style="background-color: white">
                    <div class="shopShow" ref="shopShowRef" v-for="(item,index) in shops" @click="toShopDetails(item.shopId,item.featured)">
                        <div class="shopContentLeft">
                            <image class="shopImg":src="'https://image.aftdc.com/'+item.shopImg"></image>
                            <text class="isOpen" v-if="item.shopAtive == 2" :style="{fontSize:GLOBAL.defaultFS}">休息中</text>
                            <text class="isOpen" v-if="item.gz == 1" :style="{fontSize:GLOBAL.defaultFS}">广告</text>
                        </div>
                        <div class="shopContent">
                            <div class="shopContentTop">
                                <div class="row aiCenter jcSb">
                                    <text class="shopContentName" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">{{item.shopName}}</text>
                                    <text class="mainCamp" :class="[item.featured === 5 ? 'mainCampD': item.featured === 3 ? 'mainCampT' : '']" v-if="shopType === 7 || shopType === 4">{{item.featured === 0?'外卖':item.featured === 3?'堂食':'到店自取'}}</text>
                                </div>
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
                                        <text class="shopTimeSize" :style="{fontSize:GLOBAL.smallerFS,color:GLOBAL.dColor}" v-if="shopType==1||shopType==3||shopType==4&&item.featured==0||shopType==7&&item.featured==0">{{item.deliveryCostTime}}分钟</text>
                                        <text class="shopPlaceSize" :style="{fontSize:GLOBAL.smallerFS,color:GLOBAL.dColor}">{{item.distance}}</text>
                                    </div>
                                </div>
                                <div class="givePrice">
                                    <div class="row" v-if="shopType==1||shopType==2||shopType==3||shopType==4&&item.featured!==3||shopType==7&&item.featured!==3">
                                        <text class="startingPrice" :style="{fontSize:GLOBAL.smallerFS,color:GLOBAL.dColor}">{{shopType==2 || shopType==4&&item.featured==5 || shopType==7&&item.featured==5? '起购' : '起送'}}￥{{item.qsj}}</text>
                                        <text class="distributionPrice" :style="{fontSize:GLOBAL.smallerFS,color:GLOBAL.dColor}">{{shopType==3 ? '免配送费' : shopType==2 || shopType==4&&item.featured==5 || shopType==7&&item.featured==5? '到店自取' : '配送￥' + item.psf}}</text>
                                    </div>
                                    <div class="row" v-else>
                                        <text class="startingPrice" :style="{fontSize:GLOBAL.smallerFS,color:GLOBAL.dColor}">{{item.county}}</text>
                                        <text class="distributionPrice" :style="{fontSize:GLOBAL.smallerFS,color:GLOBAL.dColor}">{{item.cuisineName}}</text>
                                    </div>
                                    <text class="perCapitaPrice" :style="{fontSize:GLOBAL.smallerFS,color:GLOBAL.dColor}">{{item.avgeCostMoney ? '人均￥'+item.avgeCostMoney : ''}}</text>
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
                                        <text class="shopActiveContentSize" v-if="item.projectNum>2&&!item.projectLay&&(item.mj||item.newCou||item.zk||item.hb||item.mz)" :style="{fontSize:GLOBAL.smallFS}">...</text>
                                    </div>

                                    <div class="shopActive" v-if="item.tg">
                                        <text class="activeTips active_tg" :style="{fontSize:GLOBAL.smallFS}">团</text>
                                        <text class="shopActiveContentSize" :style="{fontSize:GLOBAL.smallFS}">{{item.tgName}}</text>
                                        <text class="shopActiveContentSize" v-if="item.projectNum>2&&!item.projectLay&&(item.mj||item.newCou||item.zk||item.hb||item.mz||item.jf)" :style="{fontSize:GLOBAL.smallFS}">...</text>
                                    </div>
                                    <div class="shopActive" v-if="item.djq">
                                        <text class="activeTips active_djq" :style="{fontSize:GLOBAL.smallFS}">代</text>
                                        <text class="shopActiveContentSize" :style="{fontSize:GLOBAL.smallFS}">{{item.djqName}}</text>
                                        <text class="shopActiveContentSize" v-if="item.projectNum>2&&!item.projectLay&&(item.mj||item.newCou||item.zk||item.hb||item.mz||item.jf||djq)" :style="{fontSize:GLOBAL.smallFS}">...</text>
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
                    <text class="nothing" v-if="shops.length === 0" :style="{fontSize:GLOBAL.bigFS}">附近暂无商家或无您筛选的结果</text>

                </cell>
                <loading class="loading" @loading="onloadingShops" :display="loadinging ? 'show' : 'hide'">
                    <text :style="{fontSize:GLOBAL.bigFS,color: '#888888',lineHeight:'132px'}" v-if="shopsNothing && shops.length > 0">没有更多店铺了</text>
                    <image class="indicator" src="https://image.aftdc.com/appBimg/ic_loading_gif.gif" v-else></image>
                </loading>
            </list>
        </div>

        <!--进页面动画-->
        <div class="loadingAin" v-if="loadingAin">
            <image class="indicatorAin" src="https://image.aftdc.com/appBimg/ic_loading_gif.gif"></image>
            <text  :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">马上到了...</text>
        </div>

        <toast ref="toast"></toast>
    </div>
</template>

<script>
    import Toast from './Toast.vue';
    const GLOBAL = require('@/Global.vue');
    const navigator = weex.requireModule('navigator');
    const event = weex.requireModule('event');
    const post = weex.requireModule('stream');
    const animation = weex.requireModule('animation');
    import {WxcIcon,WxcCity,WxcPopover,WxcPopup,WxcMask,WxcMinibar } from 'weex-ui'
    const dom = weex.requireModule('dom')
    export default {
        components: {WxcIcon,WxcCity,WxcPopover,WxcPopup,WxcMask,Toast,WxcMinibar},
        name: 'App',
        data() {
            return {
                loadingAin: true, //进页面动画

                token: '',
                imei: '',
                title: '外卖',
                shopType: 1,
                orderType: 0,
                userId: 42,
                longitude: 113.21361,//经度
                latitude: 23.23456,//纬度
                city: '',//城市
                sortType: 0,//排序规则
                cuisineId: '',//找相似
                shopsNothing: false,//没有更多店铺
                moreActionIndex: 0,//关注，收藏，找相似下标
                currentCity: '',
                cityStyleType:'',
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
                    myy: false,
                    jjrty: false,
                    mj: 0,
                    xk: 0,
                    zk: 0,
                    hb: 0,
                    mz: 0,
                    jf: 0
                },
                choiceSearch:'',//选择综合分类、好评优先等的下标
                timeScreen:{
                    title:'营业时段',
                    time:['早餐','午餐','晚餐','宵夜']
                },
                priceScreen:{
                    title:'人均价格',
                    price:['￥20以下','￥20-40','￥40以上']
                },
                activeScreen:{
                    title:'优惠活动',
                    active:[
                        {backgroundColor: '#fd0002', backgroundName: '减', activeName: '满减活动',check:false,shopType:22,abbreviate:'mj'},
                        {backgroundColor: '#F4A460', backgroundName: '折', activeName: '折扣活动',check:false,shopType:25,abbreviate:'zk'},
                        {backgroundColor: '#06c1ae', backgroundName: '新', activeName: '新客立减',check:false,shopType:23,abbreviate:'xk'},
                        {backgroundColor: '#ff4040', backgroundName: '红', activeName: '商家红包',check:false,shopType:30,abbreviate:'hb'},
                        {backgroundColor: '#ff0000', backgroundName: '赠', activeName: '买赠活动',check:false,shopType:32,abbreviate:'mz'},
                        {backgroundColor: '#aa135f', backgroundName: '积', activeName: '积分抵扣',check:false,shopType:33,abbreviate:'jf'},
                    ]
                },
                chooseLayerHeight:'280',
                popupHeight:'',
                classflyStyle:{transform: 'translateY(-2000)'},
                loadinging:false,
                pageBack:false,
            }
        },
        created() {;
            this.userId = weex.config.userId
            this.token = weex.config.token;
            this.imei = weex.config.imei
            this.latitude = weex.config.latitude;
            this.longitude = weex.config.longitude;
            var param  = JSON.parse(weex.config.param) ;
            this.shopType = param.shopType;
            this.orderType = param.orderType;

            // this.userId = 42
            // this.token = 'weex.config.token;'
            // this.imei = '161'
            // this.latitude = 23.15792;
            // this.longitude = 113.27324;
            // this.shopType = 1;
            // this.orderType = 1;


            var shopType = this.shopType
            this.title = shopType===1?'外卖':shopType===2?'到店自取':shopType===3?'免费配送':shopType===4?'夜宵':shopType===5?'堂食预订':shopType===6?'团购':shopType===7?'品牌商家':'附近优惠'
            //修改筛选优惠活动选项
            var activety = this.activeScreen.active
            for (var i = activety.length-1;i>= 0;i--) {
                if(((shopType !== 1 && shopType !== 2 && shopType !== 3) && (activety[i].abbreviate === 'zk' || activety[i].abbreviate === 'mz')) || //折扣与满减
                    ((shopType === 6 || shopType === 8) && (activety[i].abbreviate === 'mj' || activety[i].abbreviate === 'hb'))                    //满减与红包
                ) {
                    activety.splice(i,1)
                }
            }
            //修改排序选项
            var sort = this.comprehensiveRanking
            for (var i = sort.length-1;i>= 0;i--) {
                if((sort[i].id === 2 && (shopType === 5 || shopType === 6 || shopType === 8)) ||                                   //起送价最低
                    (sort[i].id === 3 && (shopType === 2 || shopType === 5 || shopType === 6 || shopType === 8)) ||                 //配送最快
                    (sort[i].id === 4 && (shopType === 2 || shopType === 5 || shopType === 3 || shopType === 6 || shopType === 8))  //配送费最低
                ) {
                    sort.splice(i,1)
                }
                if(sort[i].id === 2 && shopType === 2) {//如果是到店自取,显示"起订价最低"
                    sort[i].name = '起订价最低'
                }
            }
            this.getShops()//获取首页店铺数据


        },
        methods: {


            minibarLeftButtonClick() {//返回上一页
                navigator.pop()
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
                if(that.sortType !== 0) {//排序
                    param += '&sortType=' + that.sortType
                }
                if(that.allChoice.myy) {//是否免预约
                    param += '&myy=' + 1
                }
                if(that.allChoice.jjrty) {//是否节假日通用
                    param += '&jjrty=' + 1
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
                    that.loadingAin = false

                    if(res.data.res === 1) {
                        var shops = res.data.data
                        for (var i in shops) { //营业时间转换与活动修改
                            shops[i].serviceTime = shops[i].serviceTime[0].serviceStartTime + '-' + shops[i].serviceTime[shops[i].serviceTime.length-1].serviceEndTime //营业时间转换
                            if( shops[i].zk && (that.shopType === 5 || that.shopType === 6 || that.shopType === 8 || that.shopType === 7 && shops[i].featured === 3 || that.shopType === 8 && shops[i].featured === 3)) {//折扣
                                shops[i].projectNum--
                                shops[i].zk = 0
                            }
                            if( shops[i].mz && (that.shopType === 5 || that.shopType === 6 || that.shopType === 8 || that.shopType === 7 && shops[i].featured === 3 || that.shopType === 8 && shops[i].featured === 3)) {//满赠
                                shops[i].projectNum--
                                shops[i].mz = 0
                            }
                            if( shops[i].mj && (that.shopType === 6 || that.shopType === 8 )) {//满减
                                shops[i].projectNum--
                                shops[i].mj = 0
                            }
                            if( shops[i].hb && (that.shopType === 6 || that.shopType === 8)) {//红包
                                shops[i].projectNum--
                                shops[i].hb = 0
                            }
                            if( shops[i].tg && (that.shopType !== 6)) {//团购
                                shops[i].projectNum--
                                shops[i].tg = 0
                            }
                            if( shops[i].djq && (that.shopType !== 8)) {//代金券
                                shops[i].projectNum--
                                shops[i].djq = 0
                            }
                            //查看是否缓存了商品
                            var shopType=0
                            if(that.shopType === 4 || that.shopType === 7) {

                                switch (shops[i].featured) {
                                    case 0:
                                        shopType = 1
                                        break;
                                    case 3:
                                        shopType = 5
                                        break;
                                    case 5:
                                        shopType = 2
                                        break;
                                }
                            }else {
                                shopType = that.shopType
                            }
                            if(event.find(shops[i].shopId+'orderFood'+shopType)){

                                var orderFood=JSON.parse(event.find(shops[i].shopId+'orderFood'+shopType))
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
            onloadingShops(event) {//首页上拉加载
                if(!this.shopsNothing) { this.getShops(true) }
                this.loadinging = true
                setTimeout(() => {
                    this.loadinging = false
                }, 2000)
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
            ruleScreenClick(value){
                if(value === 0) {
                    this.allChoice.myy = !this.allChoice.myy
                }else {
                    this.allChoice.jjrty = !this.allChoice.jjrty
                }
            } ,
            delClassflyClick(){//清除筛选条件按钮
                if(this.choiceSearch ===0 ) {
                    this.rankingChoiceIndex = 0
                    this.sortType = 0
                }else {
                    this.allChoice.mealtime=''
                    this.allChoice.price=''
                    this.allChoice.myy = false
                    this.allChoice.jjrty = false
                    for(var i in this.activeScreen.active){
                        this.activeScreen.active[i].check=false;
                    }
                }

            },
            mainChoiceSearchClick:GLOBAL.throttle(function(index){//点击首页的综合分类、好评优先等
                var that=this
                dom.scrollToElement(that.$refs.navClassfly)
                if(index==0||index==3){
                    that.choiceSearch=index
                    that.classflyStyle.transform='translateY(264)';
                }else {
                    that.rankingChoiceIndex = 0
                    if(that.choiceSearch === index){
                        that.choiceSearch = 0
                        that.rankingChoice(0)
                    }else {
                        that.choiceSearch=index
                        that.rankingChoice(index,true)
                    }
                    this.classflyStyle.transform='translateY(-2000px)';
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
            toShopDetails:GLOBAL.throttle(function(shopId,featured){//跳转到商家详情页
                // shopType  外卖：1  到店自取：2  免费配送：3  夜宵：4  堂食预订：5  团购：6  品牌商家：7  附近优惠：8
                // orderType 外卖：0  到店自取：5  免费配送：0  夜宵：0  堂食预订：3  团购：6   品牌商家：3  附近优惠：7
                var shopType = null
                var orderType = null
                if(this.shopType === 4 || this.shopType === 7) {
                    switch (featured) {
                        case 0:
                            shopType = 1
                            orderType = 0
                            break;
                        case 3:
                            shopType = 5
                            orderType = 3
                            break;
                        case 5:
                            shopType = 2
                            orderType = 5
                            break;
                    }
                }else {
                    shopType = this.shopType
                    orderType = this.orderType
                }
                var url='http://assets/businessOrder.js'
                var param={shopId:shopId,shopType:shopType,orderType:orderType}
                param=JSON.stringify(param)
                event.toUrl({"url":url,"param":param})
            }),
            toSearch:GLOBAL.throttle(function(shopId){//跳转到搜索页
                var param = {city: this.city,shopType: this.shopType,homePage:false,orderType:this.orderType};
                param=JSON.stringify(param)
                var url='http://assets/search.js';
                event.toUrl({ "url": url, "param": param });
            }),
            viewappear(){
                var that=this
                if (!that.pageBack) { return; }
                that.pageBack = false;
                var shops = that.shops
                for (var i in shops) {
                    //查看是否缓存了商品
                    var shopType=0
                    if(that.shopType === 4 || that.shopType === 7) {

                        switch (shops[i].featured) {
                            case 0:
                                shopType = 1
                                break;
                            case 3:
                                shopType = 5
                                break;
                            case 5:
                                shopType = 2
                                break;
                        }
                    }else {
                        shopType = that.shopType
                    }
                    if(event.find(shops[i].shopId+'orderFood'+shopType)){

                        var orderFood=JSON.parse(event.find(shops[i].shopId+'orderFood'+shopType))
                        shops[i].goodsNumb=0
                        for(var j in orderFood){
                            shops[i].goodsNumb+=Number(orderFood[j].numb)
                        }
                    }


                }
                that.shops=shops
            },
            viewdisappear() {
                this.pageBack = true;
            },
        }
    }
</script>

<style scoped>

    /*首页新增-------------------------------------*/


    /* 公共样式 */
    .gray {
        color: #929292;
    }
    /*默认头部字体大小*/
    .fontSize38 {
        font-size: 38px;
    }
    .jcSb {
        justify-content: space-between;
    }
    .row {
        flex-direction: row;
    }
    .jcCenter {
        justify-content: center;
    }
    .aiCenter {
        flex-direction: row;
        align-items: center;
    }


    /* 首页部分 */
    .minibar {
        position: fixed;
        top: 0;
        left: 0;
    }
    .allBgColor {
        /*background-color: #f8f8f8;*/
        position: relative;
    }
    .scroller {
        flex: 1;
    }
    .searchBoxBg {
        position: fixed;
        top: 90px;
        left: 0;
        background-color: #fff;
    }
    .searchBox {
        width: 710px;
        height: 70px;
        /*margin-top: 14px;*/
        margin-top: 18px;
        margin-left: 20px;
        margin-right: 20px;
        margin-bottom: 10px;
        background-color: #f7f7f7;
        border-radius: 100px;
        align-items: center;
    }
    .articleSearchImg{
        width: 35px;
        height: 35px;
        margin-left: 20px;
        margin-right: 10px;
        opacity: 0.8;
        margin-bottom: 3px;
    }
    .searchTextSec{
        color: #999;
        flex: 1;
    }
    .navClassfly {
        width: 750px;
        height: 80px;
        flex-direction: row;
        align-items: center;
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #f8f8f8;
        position: fixed;
        top: 184px;
        left: 0;
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
    .mainCamp {
        font-size: 22px;
        color: #53beb7;
        border-width: 2px;
        border-style: solid;
        border-color: #53beb7;
        line-height: 28px;
        padding-left: 4px;
        padding-right: 4px;
        border-radius: 2px;
    }
    .mainCampD {
        color: #efd721;
        border-color: #efd721;
    }
    .mainCampT {
        color: #659cfa;
        border-color: #659cfa;
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
    .active_tg {
        background-color: #1988f9;
    }
    .active_djq {
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
        bottom: 264px;
        background-color: #fff;
        flex-direction: column;
        /*transform: translateY(-1300);*/
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
    .cuisuneColor{
        border-color: #53beb7;
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
    .holiday {
        width: 170px;
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

    .nothing {
        text-align: center;
        padding-top: 50px;
        padding-bottom:50px;
        padding-left: 50px;
        padding-right: 50px;
        color: #999;
    }

    .wrap {
        width: 750px;
        height: inherit;
        position: absolute;
        top: 264px;
        bottom: 0;
    }

    .indicator {
        margin-top: 16px;
        height: 100px;
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
        top: 264px;
        left: 0;
        right: 0;
        bottom: 0;
    }
    .indicatorAin {
        height: 145px;
        width: 200px;
        color: #53beb7;
    }
</style>


