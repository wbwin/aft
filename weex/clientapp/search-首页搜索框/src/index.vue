
<!--此页面的按住说话按钮效果未完成-->
<template>
    <div class="wrapper" @viewappear="viewappear" @viewdisappear="viewdisappear">
        <list class="list">

            <!--头部搜索框区域-->
            <header>
                <div class="searchTitle">
                    <image class="iconTitle" src="https://image.aftdc.com/appBimg/icon_back_pressed.png" @click="backClick()"></image>
                    <div class="input">
                        <div class="row aiCenter">
                            <image class="inputIcon" src="https://image.aftdc.com/appBimg/icon_search.png" @touchstart="touchstartInput"></image>
                            <input  ref="searchOne" class="inputText" type="text" :placeholder="searchPlaceholder" @focus="onFocus" @blur="onBlur" @input="input" v-model="searchText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}"/>
                        </div>
                        <div class="clearIconDiv" v-if="searchText!==''" @click="clearIconClick">
                            <div class="clearIconDivA"></div>
                            <div class="clearIconDivB"></div>
                        </div>
                    </div>
                    <text class="search" @click="searchClick" :style="{color:GLOBAL.dColor}">搜索</text>
                </div>
                <div class="navClassfly" ref="navClassfly" v-if="shopsShow">
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
            </header>

            <!--热门搜索和历史记录区域-->
            <cell v-if="disCon" @touchstart="touchstartInput">
                <!--热门搜索-->
                <div class="hotSearch" v-if="hotSearch.length > 0">
                    <text class="hotSearchText" :style="{fontSize:GLOBAL.defaultFS}">热门搜索</text>
                </div>
                <div class="hotSearchContent">
                    <text class="hotSearchContentText" v-for="(item,index) in hotSearch" :key="index" @click="hotAndHistori(index,0)" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">{{item.search}}</text>
                </div>
                <!--历史记录-->
                <div class="historicalRecords" v-if="history!=''">
                    <text class="historicalRecordsText" :style="{fontSize:GLOBAL.defaultFS}">历史记录</text>
                    <image class="historicalRecordsDelete" src="https://image.aftdc.com/appBimg/icon_delete.png" @click="historical"></image>
                </div>
                <div class="historicalRecordsContent ">
                    <text class="hotSearchContentText" v-for="(item,index) in history" :key="index" @click="hotAndHistori(index,1)" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">{{item.text}}</text>
                </div>
            </cell>

            <!--搜索框输入内容时的反馈内容-->
            <cell @touchstart="touchstartInput" v-if="feedBack && !disCon">

                <!--返回的关键字-->
                <div class="prompt jcSb" v-for="(item,index) in searchKeyWord" :key="index" v-if="searchKeyWord!=''" @click="promptClick(index,2)">
                    <div class="row aiCenter">
                        <image class="promptIcon" src="https://image.aftdc.com/appBimg/icon_search.png"></image>
                        <text class="promptText " :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{index}}</text>
                    </div>
                    <text  :style="{fontSize:GLOBAL.defaultFS,color:'#b5b5b5'}">约{{item}}个结果</text>
                </div>

                <!--返回的商家-->
                <div class="active" v-for="(item,index) in searchShops" :key="index"  @click="promptClick(index,1)">
                    <image class="activeIcon" :src="'https://image.aftdc.com/'+searchShops[index].shopImg"></image>
                    <div class="rowDiv">
                        <div class="rowTop">
                            <text class="title" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.shopName}}</text>
                            <div class="row" v-if="shopType !==4 && shopType!==7">
                                <text class="active_mj activeTipsSm" v-if="item.mj==1" :style="{fontSize:'22px'}">满</text>
                                <text class="active_xin activeTipsSm" v-if="item.xk==1" :style="{fontSize:'22px'}">新</text>
                                <text class="active_zk activeTipsSm" v-if="item.zk==1" :style="{fontSize:'22px'}">折</text>
                                <text class="active_hb activeTipsSm" v-if="item.hb==1" :style="{fontSize:'22px'}">红</text>
                                <text class="active_mz activeTipsSm" v-if="item.mz==1" :style="{fontSize:'22px'}">赠</text>
                                <text class="active_jf activeTipsSm" v-if="item.jf==1" :style="{fontSize:'22px'}">积</text>
                                <text class="active_tg activeTipsSm" v-if="item.tg==1" :style="{fontSize:'22px'}">团</text>
                                <text class="active_djq activeTipsSm" v-if="item.djq==1" :style="{fontSize:'22px'}">代</text>
                            </div>
                            <text v-else class="featured" :class="[item.featured === 3 ?'featuredT': item.featured === 5 ? 'featuredD' : '']">{{item.featured === 0?'外卖':item.featured === 3?'堂食':'到店自取'}}</text>
                        </div>
                        <div class="rowBottom">
                            <div class="row" v-if="shopType==1||shopType==2||shopType==3||shopType==4&&item.featured!==3||shopType==7&&item.featured!==3">
                                <text class="qisong defaultSizeTwo fontSize22">{{shopType==2 || shopType==4&&item.featured==5 || shopType==7&&item.featured==5? '起购' : '起送'}}￥{{item.psf}}</text>
                                <text class="peisong defaultSizeTwo fontSize22">{{shopType==3 ? '免配送费' : shopType==2 || shopType==4&&item.featured==5 || shopType==7&&item.featured==5? '到店自取' : '配送￥' + item.psf}}</text>
                            </div>
                            <div class="row" v-else>
                                <text class="qisong defaultSizeTwo fontSize22">{{item.county}}</text>
                                <text class="peisong defaultSizeTwo fontSize22">{{item.cuisineName}}</text>
                            </div>
                            <text class="juli defaultSizeTwo fontSize22">{{item.distance}}</text>
                        </div>
                    </div>
                </div>
            </cell>

            <!--点击搜索或查找时显示的内容-->
            <cell v-if="shopsShow">
                <div class="shopShow" ref="shopShowRef" v-for="(item,index) in shops" @click="toShopDetails(item.shopId,item.featured)">
                    <div class="shopContentLeft">
                        <image class="shopImg":src="'https://image.aftdc.com/'+item.shopImg"></image>
                        <text class="isOpen" v-if="item.shopAtive == 2" :style="{fontSize:GLOBAL.defaultFS}">休息中</text>
                        <text class="isOpen" v-if="item.gz == 1" :style="{fontSize:GLOBAL.defaultFS}">广告</text>
                    </div>
                    <div class="shopContent">
                        <div class="shopContentTop" :class="[item.projectNum < 1 ? 'noBorder': '']">
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

                        </div>
                    </div>
                    <text class="guigeNumbDiv" v-if="item.goodsNumb" :style="{fontSize:'18px',width:item.goodsNumb>99?'36px':'30px'}">{{item.goodsNumb>99?'99+':item.goodsNumb}}</text>
                </div>
                <text class="nothing" v-if="shops.length === 0" :style="{fontSize:GLOBAL.bigFS}">抱歉，未能找到您搜索的商家</text>
            </cell>
            <div class="classfly" @click="" v-if="soAndFiShow">
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
            <div class="loading aiCenter jcCenter" v-if="loading">
                <image class="indicator" src="https://image.aftdc.com/appBimg/ic_loading_gif.gif"></image>
                <text  :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">努力加载中...</text>
            </div>
        </list>


        <!--没有返回数据时显示-->
        <div class="lookup" v-if="lookup&&feedBack && !disCon" >
            <div class="prompt"  @click="searchClick">
                <image class="promptIcon" src="https://image.aftdc.com/appBimg/icon_search.png"></image>
                <text class="promptText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">查找"{{searchText}}"</text>
            </div>
        </div>

        <!-- -------------------------------------------BUG多,后面再做---------------------------------------------- -->
        <!--搜索框的语音输入区域-->
        <!--<text class="toast" v-if="toastNumber==1" :style="{fontSize:GLOBAL.defaultFS}">按住说话,松开搜索</text>-->
        <!--<div class="eject aiCenter jcCenter" v-if="show==1" @click="mongolianLayer">-->
        <!--<div class="ejectDiv aiCenter jcCenter" @click.stop="" v-if="touchendNumber==0">-->
        <!--<image class="distinguish" src="http://ae01.alicdn.com/kf/HTB1xHCuXOfrK1RjSspb5jc4pFXaU.gif"></image>-->
        <!--<text class="ejectText" :style="{fontSize:GLOBAL.defaultFS}">正在听,松开进行搜索</text>-->
        <!--</div>-->
        <!--<div class="ejectDiv aiCenter jcCenter" @click.stop="" v-if="touchendNumber==2">-->
        <!--<image class="ejectImg" src="http://ae01.alicdn.com/kf/HTB1dJGvXIfrK1Rjy1Xd761emFXa3.png"></image>-->
        <!--<text class="ejectText" :style="{fontSize:GLOBAL.defaultFS}">松开手指取消搜索</text>-->
        <!--</div>-->
        <!--<div class="ejectDiv" @click.stop="" v-if="touchendNumber==1">-->
        <!--<image class="ejectImg" src="https://image.aftdc.com/appBimg/icon_search.png"></image>-->
        <!--<text class="ejectText" :style="{fontSize:GLOBAL.defaultFS}">抱歉没有听清</text>-->
        <!--</div>-->
        <!--</div>-->
        <!--<div class="voice aiCenter jcCenter" v-if="focus==1" @click="onClick" @touchstart="touchstart" @touchend="touchend" @touchmove="touchmove">-->
        <!--<image class="voiceIcon" :src="touchstartNumber==0?'https://image.aftdc.com/appBimg/voice_icon.png':'https://image.aftdc.com/appBimg/voice_no_icon.png'"></image>-->
        <!--<text :style="{fontSize:GLOBAL.bigFS,color:touchstartNumber!=0?'#333':GLOBAL.tColor}">{{touchstartNumber==0?'按住说话':touchstartNumber==1?'松开搜索':'松开取消'}}</text>-->
        <!--</div>-->

    </div>
</template>

<script>
    import { WxcMask } from 'weex-ui';
    const event = weex.requireModule('event');
    const navigator=weex.requireModule('navigator')
    const post = weex.requireModule('stream');
    const GLOBAL = require('@/Global.vue');
    const dom = weex.requireModule('dom')
    let atimer = null
    export default {
        components: { WxcMask },
        name: 'App',
        data() {
            return {
                homePage: false,//是否从首页点击进来的
                lookup: true,
                loading: false,//加载画面显示
                soAndFiShow: false,//筛选与排序弹框
                shopType: 1,
                orderType:0,
                userId: 43,
                longitude: 113.21361,//经度
                latitude: 23.23456,//纬度
                city: '',//城市名
                disCon:true,//热门搜索和历史记录的if判断
                searchText:'',//与input输入框的数据绑定
                searchPlaceholder: '请输入商家或商品名称',
                hotSearch:[],//热门搜索-暂时只显示两行,可更改(热门搜索)
                history:[],//历史记录-暂时只显示三行,可更改,最多十条(历史记录)
                toastNumber:0,//语音输入的toast提示
                touchstartNumber:0,//语音输入的按钮按住时
                touchendNumber:0,//语音输入的按钮抬起时
                show:0,//语音输入的按钮按住时聆听框的显示和隐藏
                focus:0,//输入框获取焦点
                aaa:true,//阻止定时器点击时的多次执行
                bbb:true,//阻止定时器点击时的多次执行
                dsqtime: 0,//按钮按住时,判断按住时长,从而判断需不需要弹出聆听框
                iconLength:false,//新,团,秒,折...用if是否全部显示
                shopsShow:false,//点击搜索后
                feedBack:true,//输入框输入时的反馈内容,有值时自动显示

                //当用户在input框输入数据时,下面为提示的内容
                searchShops:[
                    //{activeName:'小程序速度测试',activePictrue:'icon_table_manage.jpg',qisong:'12',peisng:'13.2',juli:'5.2',xin:1,lin:1,zhe:1,tuan:1,kan:1,miao:1,hong:1},
                    //{activeName:'小程序速度测试',activePictrue:'icon_table_manage.jpg',qisong:'12',peisng:'13.2',juli:'5.2',xin:1,lin:0,zhe:1,tuan:0,kan:1,miao:1,hong:1},
                    //{activeName:'小程序速度测试',activePictrue:'icon_table_manage.jpg',qisong:'12',peisng:'13.2',juli:'5.2',xin:0,lin:0,zhe:0,tuan:1,kan:0,miao:0,hong:1},
                ],//input输入内容时的反馈
                searchKeyWord:[
                    // {text:'写柳树小说'},
                    // {text:'阿斯蒂芬'},
                    // {text:'噶十多个'},
                    // {text:'阿发'},
                    // {text:'更改'},
                    // {text:'写柳树顶顶顶顶小说'}
                ],//input输入内容时的反馈


                shops:[],//所有的商家
                sortType: 0,//排序规则

                currentCity: '',
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
                pageBack:false,
            }
        },

        created(){
            var that=this
            var history = event.find('searchHistoryD');
            if(history) {
                this.history = JSON.parse(history);
            }
            this.token = weex.config.token;
            this.imei = weex.config.imei;
            this.userId = weex.config.userId
            var param  = JSON.parse(weex.config.param) ;
            this.city=param.city;
            this.shopType=param.shopType
            this.orderType=param.orderType
            this.homePage = param.homePage
            var location=JSON.parse(event.find('location'))
            that.longitude=location.longitude
            that.latitude=location.latitude
            // this.token = 'fesffefe';
            // this.imei = 'fesfsefsef';
            if(this.homePage) {
                this.shopType = 4
            }

            this.getHotSearch() //获取热门搜索数据
            this.autoFocus()

            //修改筛选优惠活动选项
            var shopType = this.shopType
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
        },
        methods:{
            getShops(loading){//获取店铺数据
                var that = this
                if(loading) {//排序与筛选不需要出现
                    setTimeout(()=>{//防止点击的一瞬间闪出一下
                        that.shopsShow=true;
                    },300)
                    setTimeout(()=>{//给足够的时间让小键盘弹下去
                        that.loading = true
                    },200)
                    setTimeout(()=>{
                        that.loading = false
                    },1000)
                }
                var param = '&userId='+ that.userId
                param += '&longitude=' + that.longitude
                param += '&latitude=' + that.latitude
                param += '&city=' + that.city
                param += '&page=' + 0
                if(that.homePage) {
                    param += '&shopType=' + 0//0代表搜索全部商店
                }else {
                    param += '&shopType=' + that.shopType
                }
                if(that.searchText !== '') {
                    param += '&search=' + that.searchText
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
                        that.shops = shops
                        that.shopPage = shops.length
                    }else if(res.data.res === 0) {
                        that.shops = res.data.data
                        that.shopPage = 0
                    }
                });

            },


            getHotSearch() { //获取热门搜索数据
                var that = this
                var param = '&userId=' + that.userId
                param += '&longitude=' + that.longitude
                param += '&latitude=' + that.latitude
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: 'https://www.aftdc.com/userapp/Index/hotWord',
                }, function (res) {
                    if(res.data.res === 1) {
                        that.hotSearch = res.data.data
                        that.searchPlaceholder = res.data.data[0].search
                    }
                });
            },
            recordKeyWord(search,searchType) { //记录搜索关键词
                var that = this
                var param = that.GLOBAL.sign(this.token,this.imei);
                param += '&longitude=' + that.longitude
                param += '&latitude=' + that.latitude
                param += '&search=' + search
                param += '&searchType=' + searchType
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: 'https://www.aftdc.com/userapp/Index/logSearch',
                }, function (res) {

                });
            },

            labelClick(index){
                if(this.searchShop[index].iconLength){
                    this.searchShop[index].iconLength=false;
                }
                else{
                    this.searchShop[index].iconLength=true;
                }
            },
            saveHistorySearch() {//历史记录做缓存
                for(var i = this.history.length; i >= 10; i--) {
                    this.history.splice(i,1)
                }
                var param = JSON.stringify(this.history)
                event.save('searchHistoryD',param);
            },
            promptClick(index,searchType){//点击搜索列表
                if(searchType === 2)  {
                    var search = index
                    this.searchText=index
                    this.feedBack=false;
                    this.getShops('loading')//获取店铺数据
                }else {
                    var search = this.searchShops[index].shopName
                    var shopId = this.searchShops[index].shopId
                    var featured = this.searchShops[index].featured
                    this.toShopDetails(shopId,featured)
                }
                for(var i in this.history){//在历史记录中添加时,如果有重复的,删除重复的
                    if(search===this.history[i].text){
                        this.history.splice(i,1);
                    }
                }
                this.history.unshift({text:search})
                this.saveHistorySearch()
                this.recordKeyWord(search,searchType)

            },
            searchClick:GLOBAL.throttle(function(){//按搜索按钮时
                if(this.searchText!==''){
                    for(var i in this.history){
                        if(this.searchText===this.history[i].text){
                            this.history.splice(i,1);
                        }
                    }
                    this.history.unshift({text:this.searchText});
                    this.saveHistorySearch()
                    //在历史记录中添加时,如果有重复的,删除重复的再添加
                    this.$refs.searchOne.blur();
                    this.feedBack = false;
                    this.getShops('loading')//获取店铺数据
                }
            }),
            touchstartInput(){
                this.$refs.searchOne.blur();
            },
            hotAndHistori(index,type) {//点击热门搜索与历史记录标签
                this.disCon=false;
                if(type === 0) {
                    this.searchText = this.hotSearch[index].search;
                    for(var i in this.history){
                        if(this.hotSearch[index].search===this.history[i].text){
                            this.history.splice(i,1);
                        }
                    }//在历史记录中添加时,如果有重复的,先删除重复的
                    this.history.unshift({text:this.hotSearch[index].search})
                }else {
                    this.searchText = this.history[index].text
                    this.history.unshift({text:this.history[index].text})
                    this.history.splice(index+1,1);
                }
                this.saveHistorySearch()
                this.feedBack = false
                this.getShops('loading')//获取店铺数据

            },

            clearIconClick(){
                this.searchText='';
                this.disCon=true;
                this.$refs.searchOne.focus();
                this.input()
            },
            autoFocus(){
                var that=this;
                setTimeout(function () {
                    that.$refs.searchOne.focus()
                },0)

            },
            historical(){
                this.history.splice(0,this.history.length)
                var param = JSON.stringify(this.history)
                event.save('searchHistoryD',param);
            },
            onFocus(){
                this.focus = 1;
                this.feedBack = true;
                this.shopsShow = false;
                this.soAndFiShow = false

                //清除筛选与排序
                this.rankingChoiceIndex = 0
                this.sortType = 0
                this.allChoice.mealtime=''
                this.allChoice.price=''
                this.allChoice.myy = false
                this.allChoice.jjrty = false
                for(var i in this.activeScreen.active){
                    this.activeScreen.active[i].check=false;
                }
            },
            onBlur(){
                this.focus=0;
                this.show=0;
            },
            onClick(){
                var that=this;
                if(that.aaa){
                    that.aaa=false;
                    that.toastNumber=1;
                    setTimeout(function () {
                        that.toastNumber=0;
                        that.aaa=true;
                    },1000)
                };

            },
            touchstart(){
                var that=this;
                that.show=0;
                that.touchstartNumber=1;
                that.touchendNumber=0;
                that.dsqtime = 0;
                clearTimeout(Timer);
                if(that.bbb){
                    that.bbb=false;
                    var Timer =setTimeout(function () {
                        // that.show=1;
                        if(that.dsqtime == 0){
                            that.show = 1;
                        }
                        else {
                            that.show=0;
                        }
                        that.bbb=true;
                    },500);
                }

                // clearTimeout(Timer)


            },
            touchend(e){
                this.touchstartNumber=0;
                this.touchendNumber=1;
                if (e.changedTouches[0].screenY<650||e.changedTouches[0].screenY>800) {
                    this.show = 0;
                }
                this.dsqtime = -2;



            },
            touchmove(e){
                if (e.changedTouches[0].screenY<650||e.changedTouches[0].screenY>800){
                    this.touchendNumber=2;
                    this.touchstartNumber=2;
                }
                else {
                    this.touchendNumber=0;
                    this.touchstartNumber=1;
                }
            },
            mongolianLayer(){
                this.toastNumber=0;
                this.show=0;
            },
            input(){
                if(this.searchText===''){
                    this.disCon=true;
                    this.searchKeyWord = []
                    this.searchShops = []
                    this.lookup = true
                }
                else{
                    clearTimeout(atimer)
                    atimer = setTimeout(()=>{
                        this.getSearchRes()
                    },200)
                    this.disCon=false;
                }
            },
            getSearchRes() { //获取搜索列表
                var that = this
                var param = '&longitude=' + that.longitude
                param += '&latitude=' + that.latitude
                param += '&city=' + that.city
                param += '&search=' + that.searchText
                param += '&shopType=' + that.shopType
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: 'https://www.aftdc.com/userapp/Index/searchRes',
                }, function (res) {
                    if(res.data.res === 1) {
                        if(Object.keys(res.data.data.goodsList).length + res.data.data.shopList.length > 0) {
                            setTimeout(()=>{
                                that.lookup = false
                            },200)
                        }else {
                            that.lookup = true
                        }
                        that.searchKeyWord = res.data.data.goodsList
                        var shopList = res.data.data.shopList
                        for (var i in shopList) { //营业时间转换与活动修改
                            if( shopList[i].zk && (that.shopType === 5 || that.shopType === 6 || that.shopType === 8 || that.shopType === 7 && shopList[i].featured === 3 || that.shopType === 8 && shopList[i].featured === 3)) {//折扣
                                shopList[i].zk = 0
                            }
                            if( shopList[i].mz && (that.shopType === 5 || that.shopType === 6 || that.shopType === 8 || that.shopType === 7 && shopList[i].featured === 3 || that.shopType === 8 && shopList[i].featured === 3)) {//满赠
                                shopList[i].mz = 0
                            }
                            if( shopList[i].mj && (that.shopType === 6 || that.shopType === 8 )) {//满减
                                shopList[i].mj = 0
                            }
                            if( shopList[i].hb && (that.shopType === 6 || that.shopType === 8)) {//红包
                                shopList[i].hb = 0
                            }
                            if( shopList[i].tg && (that.shopType !== 6)) {//团购
                                shopList[i].tg = 0
                            }
                            if( shopList[i].djq && (that.shopType !== 8)) {//代金券
                                shopList[i].djq = 0
                            }
                        }
                        that.searchShops = shopList
                    }
                });
            },
            backClick(){
                navigator.pop({ animated: 'true' });
            },



            //---------------------------------------------------------------------------------------------------------------------------------
            unfolding(index) {//活动展开与收起
                var that = this
                var shop = that.shops[index]
                if(shop.projectNum > 2) {
                    that.$set(shop,'projectLay',!shop.projectLay)
                }
            },
            classflyCancelClick(){//点击筛选框的取消图标
                var that=this
                this.soAndFiShow = false
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
                    that.soAndFiShow = true
                }else {
                    that.rankingChoiceIndex = 0
                    if(that.choiceSearch === index){
                        that.choiceSearch = 0
                        that.rankingChoice(0)
                    }else {
                        that.choiceSearch=index
                        that.rankingChoice(index,true)
                    }
                    that.soAndFiShow = false
                }
            }),
            rankingChoice(index,other){//点击综合排序的选项
                if(index === 1 && other){
                    this.sortType = 7
                }else if(index === 2 && other){
                    this.sortType = 8
                }else {
                    this.soAndFiShow = false
                    this.rankingChoiceIndex = index
                    this.sortType = this.comprehensiveRanking[index].id
                }
                this.getShops()
            },
            allScreenSure(){//点击筛选框确定按钮
                this.soAndFiShow = false
                this.getShops()
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
                var param = {city: this.city,shopType: this.shopType};
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

        },
    }
</script>

<style scoped>
    .jcSb {
        justify-content: space-between;
    }
    .row{
        flex-direction: row
    }
    .aiCenter {
        align-items: center;
    }
    .jcCenter {
        justify-content: center;
    }
    .fontSize22 {
        font-size: 22px;
    }
    .shopImg{
        width: 130px;
        height: 130px;
        border-radius: 5px;
    }
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
        background-color: #e6e7e9;
        transform: rotate(45deg);
        position: absolute;
        top: 4px;
        left: 14px;
    }
    .clearIconDivB {
        width: 23px;
        height: 3px;
        background-color: #e6e7e9;
        transform: rotate(45deg);
        position: absolute;
        top: 14px;
        left: 4px;
    }

    .hotSearchContentText:active{
        background-color: #999;
    }
    .promptText{
        padding-left: 20px;
        max-width: 530px;
        lines:1;
        text-overflow: ellipsis;
    }

    .promptIcon{
        width: 35px;
        height: 35px;
        opacity: 0.6;
    }
    .prompt{
        flex-direction: row;
        align-items: center;
        padding-top: 24px;
        padding-bottom: 24px;
        padding-left: 20px;
        padding-right: 20px;
        border-bottom-style: solid;
        border-bottom-color: #f4f4f4;
        border-bottom-width: 2px;
    }
    .prompt:active{
        background-color: #f8f8f8;
    }
    .active:active{
        background-color: #f8f8f8;
    }
    .qisong{
        border-right-style: solid;
        border-right-width: 1px;
        border-right-color: #ccc;
        padding-right: 10px;
    }
    .peisong{
        border-right-style: solid;
        border-right-width: 1px;
        border-right-color: #ccc;
        padding-right: 10px;
        margin-left: 10px;
        margin-right: 10px;
    }
    .featured {
        height: 32px;
        text-align: center;
        line-height: 32px;
        color: #fff;
        margin-left: 8px;
        padding-left: 6px;
        padding-right: 6px;
        background-color: #53beb7;
    }
    .featuredD {
        background-color: #ff9600;
    }
    .featuredT {
        background-color: #659cfa;
    }
    .activeTipsSm {
        width: 32px;
        height: 32px;
        text-align: center;
        line-height: 32px;
        color: #fff;
        margin-left: 8px;
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

    .defaultSizeTwo{
        color: #999;
    }

    .title{
        max-width: 400px;
        lines:1;
        text-overflow: ellipsis;
    }
    .rowTop{
        flex-direction: row;
        align-items: center;
        padding-bottom: 5px;
    }
    .rowDiv{
        padding-left: 20px;
    }
    .rowBottom{
        flex-direction: row;
        align-items: center;
    }
    .active{
        padding-left: 20px;
        padding-right: 20px;
        flex-direction: row;
        align-items: center;
        padding-top: 20px;
        padding-bottom: 20px;
        border-bottom-style: solid;
        border-bottom-color: #f4f4f4;
        border-bottom-width: 2px;
    }
    .activeIcon{
        width: 60px;
        height: 60px;
    }
    .list{
        flex: 1;
    }
    .wrapper {
        position: relative;
        flex: 1;
    }
    .ejectImg{
        width: 139px;
        height: 149px;
    }
    .ejectText{
        color: #999;
        text-align: center;
    }
    .toast{
        border-radius: 10px;
        text-align: center;
        position: absolute;
        padding-top: 20px;
        padding-bottom: 20px;
        top:300px;
        left: 200px;
        width: 350px;
        color: #fff;
        background-color: #333;
    }
    .eject{
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(51,51,51,0.5);
    }
    .ejectDiv{
        width: 500px;
        height: 400px;
        background-color: #fff;
        border-radius: 10px;
        margin-bottom: 110px;
    }
    .voice{
        position: fixed;
        bottom:20px;
        right: 20px;
        flex-direction: row;
        align-items: center;
        width: 230px;
        height: 90px;
        border-style: solid;
        border-width: 1px;
        border-color: #ccc;
        border-radius: 50px;
        background-color: #fff;
        padding-right: 10px;
    }
    .voiceIcon{
        /*margin-left: 10px;*/
        width: 50px;
        height: 46px;
    }
    .searchTitle{
        flex-direction: row;
        align-items: center;
        background-color: #fff;
        padding-top: 20px;
        padding-bottom: 20px;
        padding-left: 20px;
        padding-right: 10px;
    }
    .iconTitle{
        width: 38px;
        height: 38px;
    }
    .input{
        margin-left: 30px;
        flex: 5;
        border-radius: 50px;
        background-color: #e6e7e9;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
    .inputText{
        background-color: #e5e7e8;
        width: 410px;
        height: 60px;
        placeholder-color:#999;
    }
    .search{
        flex: 1;
        text-align: center;
        font-size: 30px;
        padding-top: 10px;
        padding-bottom: 10px;
        margin-left: 10px;
    }
    .inputIcon{
        width: 35px;
        height: 35px;
        opacity: 0.9;
        margin-left: 14px;
        margin-right: 10px;
        margin-bottom: 2px;
    }
    .hotSearch{
        padding-top: 25px;
        padding-left: 20px;
        padding-right: 20px;
    }
    .hotSearchText{
        color: #999;
    }
    .hotSearchContent{
        max-height: 176px;
        overflow: hidden;
        flex-direction: row;
        flex-wrap: wrap;
        padding-left: 20px;
        padding-right: 20px;
    }
    .hotSearchContentText{
        margin-top: 20px;
        padding-left: 20px;
        padding-right: 20px;
        padding-top: 17px;
        padding-bottom: 17px;
        background-color: #f4f4f4;
        margin-right: 20px;
        border-radius: 15px;
        max-width: 280px;
        lines:1;
        text-overflow: ellipsis;
    }
    .historicalRecordsContent{
        padding-left: 20px;
        padding-right: 20px;
        max-height: 264px;
        overflow: hidden;
        flex-direction: row;
        flex-wrap: wrap;
    }
    .historicalRecords{
        padding-right: 20px;
        padding-left: 20px;
        flex-direction: row;
        align-items: center;
        padding-top: 30px;
    }
    .historicalRecordsText{
        flex: 1;
        color: #999;
    }
    .historicalRecordsDelete{
        width: 30px;
        height: 30px;
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
    .shopActiveContentSize {
        color: #999;
        lines: 1;
        text-overflow: ellipsis;
    }
    .shopContentLeft{
        flex-direction: column;
        align-items: center;
    }





    /*--------------------------------------------------------------------------------------------------*/
    .navClassfly {
        width: 750px;
        height: 70px;
        flex-direction: row;
        align-items: center;
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #f8f8f8;
        background-color: #fff;
        padding-bottom: 10px;
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
    .noBorder {
        border-bottom-width: 0px;
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
    .classfly{
        position: fixed;
        top: 170px;
        left: 0;
        right: 0;
        bottom: 0px;
        background-color: #fff;
        flex-direction: column;
        transition-property: transform;
        transition-duration: 0.3s;
        transition-delay: 0s;
        transition-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1.0);
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
    .loading {
        background-color: #fff;
        position: fixed;
        top: 100px;
        left: 0;
        right: 0;
        bottom: 0;
    }
    .indicator {
        height: 145px;
        width: 200px;
        color: #53beb7;
    }
    .lookup {
        position: fixed;
        top: 100px;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #fff;
    }
    .distinguish {
        width: 210px;
        height: 76px;
        margin-bottom: 20px;
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
</style>
