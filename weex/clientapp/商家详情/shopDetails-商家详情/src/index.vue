<template>
    <div class="wrapper">

        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    v-once
            >
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">商家详情</text>
            </wxc-minibar>
        </div>

        <scroller class="scroller"  style="flex: 1">
            <image class="titleImg" @click="toStorePicture()" src="https://image.aftdc.com/images/packageA/shopImg2.jpg"></image>
            <div class="titleImgNumber" @click="toStorePicture()">
                <image class="titleImgNumberIcon" src="https://image.aftdc.com/images/slideImg.png"></image>
                <text class="titleImgNumberNumber" :style="{fontSize:GLOBAL.defaultFS}">{{listOne[0].pictureNumber}}张</text>
            </div>

            <div class="shopName">
                <div class="shopNameLeft">
                    <text class="shopNameLeftTitle" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">{{listOne[0].shopName}}</text>
                    <div class="star">
                        <image class="starIcon" src="https://image.aftdc.com/appBimg/icon_wuxing_nocolor.png"></image>
                        <div class="starIconTwoDiv" :style="{width:(listOne[0].star*30)}">
                            <image class="starIconTwo" src="https://image.aftdc.com/appBimg/icon_wuxing_color.png"></image>
                        </div>
                            <text class="starNumber" :style="{fontSize:GLOBAL.smallFS}">人均:￥{{listOne[0].money}}</text>
                    </div>
                </div>
                <image class="defaultIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
            </div>

            <div class="address">
                <image class="defaultIconTwo" src="https://image.aftdc.com/images/hdw.png"></image>
                <text class="addressText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">广园汽车客运啊</text>
                <image class="defaultIconTwo" src="https://image.aftdc.com/images/phoneG.png"></image>
            </div>

            <div class="outFood" @click="toBusinessOrder()">
                <image class="defaultIconTwo" src="https://image.aftdc.com/images/abroad.png"></image>
                <text class="outFoodText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">外卖</text>
                <image class="defaultIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
            </div>

            <div class="cashCoupon" v-if="cashCoupon!=''">
                <div class="cashCouponTitle">
                    <text class="quan" :style="{fontSize:GLOBAL.bigFS}">券</text>
                    <text class="cashCouponText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">代金券</text>
                </div>
                <div class="cashCouponDiv" @click="toSetMeal()" v-for="(item,index) in cashCoupon" :key="index">
                    <div class="cashCouponContent">
                        <div class="cashCouponContentText">
                            <text class="defaultCash"  :style="{fontSize:GLOBAL.defaultFS}">{{item.time}}</text>
                            <text class="defaultCash"  :style="{fontSize:GLOBAL.defaultFS}">{{item.limit}}</text>
                            <text class="defaultCash"  :style="{fontSize:GLOBAL.defaultFS}">{{item.yuyue}}</text>
                            <text class="cashText"  :style="{fontSize:GLOBAL.defaultFS}">{{item.number}}</text>
                            <text class="cashSold"  :style="{fontSize:GLOBAL.defaultFS}">已售 {{item.sold}}</text>
                        </div>
                        <image class="defaultIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                    </div>
                    <div class="cashCouponBottom">
                        <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor}">￥{{item.money}}</text>
                        <text class="cashCouponBottomTextTwo" :style="{fontSize:GLOBAL.defaultFS}">代{{item.moneyTwo}}元</text>
                    </div>
                </div>

            </div>

            <div class="canteen" v-if="canteenList!=''">
                <div class="canteenTitle">
                    <text class="tuan" :style="{fontSize:GLOBAL.bigFS}">团</text>
                    <text class="tuanText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">堂食套餐</text>
                </div>
                <div class="canteenContent" @click="toSetMeal()" v-for="(item,index) in canteenList"  v-if="canteenLength==1||index<3" :key="index">
                    <image class="canteenImg" :src="item.img"></image>
                    <div class="canteenContentCenter">
                        <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.theme}}</text>
                        <div class="reriod">
                            <text class="reriodLeft" :style="{fontSize:GLOBAL.defaultFS}">{{item.time}}</text>
                            <text class="reriodRight" :style="{fontSize:GLOBAL.smallFS}">{{item.type}}</text>
                        </div>
                        <div class="price">
                            <text class="priceLeft" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}">￥{{item.price}}</text>
                            <text class="priceRight" :style="{fontSize:GLOBAL.smallFS}">门市价{{item.primaryPrice}}</text>
                        </div>
                    </div>
                    <div class="canteenContentButtom">
                        <text class="canteenText" :style="{fontSize:GLOBAL.defaultFS}">已售{{item.sold}}</text>
                        <image class="defaultIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                    </div>
                </div>
            </div>

            <div class="canteenBottom" @click="canteenClick" v-if="canteenLength==0">
                <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}">点击展开</text>
                <image class="canteenIcon" src="https://image.aftdc.com/appBimg/ic_arrow_down_green.png"></image>
            </div>

            <div class="evaluate">
                <div class="userEvaluate" @click="toUserEvaluate()">
                    <div class="userEvaluateDiv">
                        <text class="userEvaluateText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">用户评价 </text>
                        <text class="userEvaluateNumber" :style="{fontSize:GLOBAL.smallFS}">({{messageListOne.length}})</text>
                    </div>
                    <image class="defaultIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                </div>
                <div class="evaluateBar">
                    <text class="barText" style="border-top-left-radius: 10px;border-bottom-left-radius: 10px;" :style="{fontSize:GLOBAL.defaultFS,color:evaluateSelected==0?'#fff':GLOBAL.tColor,backgroundColor:evaluateSelected==0?'#53beb7':'#fff'}" @click="evaluateClick(0)">全部</text>
                    <text class="barText" :style="{fontSize:GLOBAL.defaultFS,color:evaluateSelected==1?'#fff':GLOBAL.tColor,backgroundColor:evaluateSelected==1?'#53beb7':'#fff'}" @click="evaluateClick(1)">最新</text>
                    <text class="barText barTextThree" :style="{fontSize:GLOBAL.defaultFS,color:evaluateSelected==2?'#fff':GLOBAL.tColor,backgroundColor:evaluateSelected==2?'#53beb7':'#fff'}" @click="evaluateClick(2)">晒图评价</text>
                </div>
                <div class="scoreTable">
                    <text class="scoreTableNum">{{score.number}}</text>
                    <div class="scoreTableDiv">
                        <text class="scoreTableText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">综合评分</text>
                        <div class="starDiv">
                            <image class="starIcon" src="https://image.aftdc.com/appBimg/icon_wuxing_nocolor.png"></image>
                            <div class="starIconTwoDiv" :style="{width:score.star*30}">
                                <image class="starIconTwo" src="https://image.aftdc.com/appBimg/icon_wuxing_color.png"></image>
                            </div>

                        </div>
                    </div>
                </div>

                <!--bar全部-->
                <div class="message" v-if="evaluateSelected==0&&index<3" v-for="(item,index) in messageListOne" :key="index">
                    <div class="messageDiv">
                        <div class="messageImg">
                        <image class="messageImg" :src="item.personalImg"></image>
                        </div>
                        <div class="messageInfo">
                            <div class="messageInfoTitle">
                                <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.name}}</text>
                                <image class="messageInfoIcon" :src="'https://image.aftdc.com/images/v'+item.grade+'.png'"></image>
                            </div>
                            <div class="starTimeDiv">
                                <div class="starDiv">
                                    <image class="starIcon" src="https://image.aftdc.com/appBimg/icon_wuxing_nocolor.png"></image>
                                    <div class="starIconTwoDiv" :style="{width:item.star*30}">
                                        <image class="starIconTwo" src="https://image.aftdc.com/appBimg/icon_wuxing_color.png"></image>
                                    </div>
                                </div>
                                <text class="messageTime" :style="{fontSize:GLOBAL.smallFS}">{{item.time}}</text>
                            </div>
                        </div>

                    </div>
                    <text class="messageText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.message}}</text>
                    <div class="messageIconDiv">
                        <image class="messageIcon" @click="toPictureEvaluation" v-for="(item,index) in messageListOne[index].pictureList" :key="index" :src="item.img"></image>
                    </div>

                </div>

                <!--bar最新-->
                <div class="message" v-if="evaluateSelected==1" v-for="(item,index) in messageListTwo" :key="index">
                    <div class="messageDiv">
                        <div class="messageImg">
                        <image class="messageImg" :src="item.personalImg"></image>
                        </div>
                        <div class="messageInfo">
                            <div class="messageInfoTitle">
                                <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.name}}</text>
                                <image class="messageInfoIcon" :src="'https://image.aftdc.com/images/v'+item.grade+'.png'"></image>
                            </div>
                            <div class="starTimeDiv">
                                <div class="starDiv">
                                    <image class="starIcon" src="https://image.aftdc.com/appBimg/icon_wuxing_nocolor.png"></image>
                                    <div class="starIconTwoDiv" :style="{width:item.star*30}">
                                        <image class="starIconTwo" src="https://image.aftdc.com/appBimg/icon_wuxing_color.png"></image>
                                    </div>
                                </div>
                                <text class="messageTime" :style="{fontSize:GLOBAL.smallFS}">{{item.time}}</text>
                            </div>

                        </div>

                    </div>
                    <text class="messageText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.message}}</text>
                    <div class="messageIconDiv">
                        <image class="messageIcon" @click="toPictureEvaluation" v-for="(item,index) in messageListTwo[index].pictureList" :key="index" :src="item.img"></image>
                    </div>

                </div>

                <!--bar晒图评价-->
                <div class="message" v-if="evaluateSelected==2" v-for="(item,index) in messageListThree" :key="index">
                    <div class="messageDiv" @click="toPersonalHomePage()">
                        <div class="messageImg">
                        <image class="messageImg" :src="item.personalImg"></image>
                        </div>
                        <div class="messageInfo">
                            <div class="messageInfoTitle">
                                <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.name}}</text>
                                <image class="messageInfoIcon" :src="'https://image.aftdc.com/images/v'+item.grade+'.png'"></image>
                            </div>
                            <div class="starTimeDiv">
                                <div class="starDiv">
                                    <image class="starIcon" src="https://image.aftdc.com/appBimg/icon_wuxing_nocolor.png"></image>
                                    <div class="starIconTwoDiv" :style="{width:item.star*30}">
                                        <image class="starIconTwo" src="https://image.aftdc.com/appBimg/icon_wuxing_color.png"></image>
                                    </div>
                                </div>
                                <text class="messageTime" :style="{fontSize:GLOBAL.smallFS}">{{item.time}}</text>
                            </div>
                        </div>

                    </div>
                    <text class="messageText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.message}}</text>
                    <div class="messageIconDiv">
                        <image class="messageIcon" @click="toPictureEvaluation" v-for="(item,index) in messageListThree[index].pictureList" :key="index" :src="item.img"></image>
                    </div>

                </div>
                <div class="userEvaluate userEvaluateActive" @click="toUserEvaluate()">
                    <div class="userEvaluateDiv">
                        <text class="userEvaluateTextTwo"  :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">查看所有用户评价</text>
                        <text class="userEvaluateNumber" :style="{fontSize:GLOBAL.smallFS}">共{{messageListOne.length}}条</text>
                    </div>
                    <image class="defaultIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                </div>
            </div>

            <div class="moreInfo">
                <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">更多信息</text>
                <div class="moreInfoContent">
                    <image class="timeIcon" src="https://image.aftdc.com/images/blackColor.png"></image>
                    <div class="moreInfoDiv">
                        <text class="moreText"  :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">营业时间:周一至周日</text>
                        <text class="moreText"  :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">08:00-08:00</text>
                    </div>
                </div>
            </div>
        </scroller>
        <text class="return" @click="backClick"  :style="{fontSize:GLOBAL.defaultFS}">返回</text>

    </div>
</template>

<script>
    import {WxcMinibar} from 'weex-ui';
    const dom = weex.requireModule('dom');
    const modal = weex.requireModule('modal');
    const navigator = weex.requireModule('navigator');
    const event = weex.requireModule('event');
    export default {
        components: {WxcMinibar},
        name: 'App',
        created(){

        },
        data() {
            return {
                listOne:[{
                    pictureNumber:231,shopName:'广州堡德仕',star:4.5,money:12,address:'广园汽车客运站',
                }],
                canteenList:[
                    {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg',theme:'经典单人餐',time:'周一至周日',type:'免预约',sold:'1234',price:'12',primaryPrice:'15.5'},
                    {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg',theme:'经典双人餐',time:'周一至周日',type:'免预约',sold:'1234',price:'12',primaryPrice:'15.5'},
                    {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg',theme:'经典多人餐',time:'周一至周日',type:'免预约',sold:'1234',price:'12',primaryPrice:'15.5'},
                    {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg',theme:'经典双人餐',time:'周一至周日',type:'免预约',sold:'1234',price:'12',primaryPrice:'15.5'},
                ],

                //全部
                messageListOne:[
                    {personalImg:'https://image.aftdc.com/images/packageA/shopImg2.jpg',name:'千与千寻',star:5,message:'不错,很喜欢这家的汉堡,实惠又好吃,重点是配送的小姐姐很好看,又会说话>_<',grade:6,time:'2018-09-06',pictureList:
                                [   {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                    {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                    {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                    {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                    {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                    {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},]
                    },
                    {personalImg:'https://image.aftdc.com/images/packageA/shopImg2.jpg',name:'大傻逼',star:1,message:'离开家离开家离开家离开家离开家第三方sad风口浪尖的非法哦哦了加水电费后来就是地发斯蒂芬阿斯蒂芬阿斯蒂芬',grade:6,time:'2018-09-06',pictureList:
                            [   {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},]
                    },
                    {personalImg:'https://image.aftdc.com/images/packageA/shopImg2.jpg',name:'大傻逼',star:1,message:'离开家离开家离开家离开家离开家第三方sad风口浪尖的非法哦哦了加水电费后来就是地发斯蒂芬阿斯蒂芬阿斯蒂芬',grade:6,time:'2018-09-06',pictureList:
                            [{img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},]
                    },
                    {personalImg:'https://image.aftdc.com/images/packageA/shopImg2.jpg',name:'大傻逼',star:1,message:'离开家离开家离开家离开家离开家第三方sad风口浪尖的非法哦哦了加水电费后来就是地发斯蒂芬阿斯蒂芬阿斯蒂芬',grade:6,time:'2018-09-06',pictureList:
                            [{img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},]
                    },
                    {personalImg:'https://image.aftdc.com/images/packageA/shopImg2.jpg',name:'大傻逼',star:1,message:'离开家离开家离开家离开家离开家第三方sad风口浪尖的非法哦哦了加水电费后来就是地发斯蒂芬阿斯蒂芬阿斯蒂芬',grade:6,time:'2018-09-06',pictureList:
                            [{img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},]
                    },
                ],

                //最新
                messageListTwo:[
                    {personalImg:'https://image.aftdc.com/images/packageA/shopImg2.jpg',name:'第三方',star:1,message:'离开家离开家离开家离开家离开家第三方sad风口浪尖的非法哦哦了加水电费后来就是地发斯蒂芬阿斯蒂芬阿斯蒂芬',grade:6,time:'2018-09-06',pictureList:
                            [   {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},]
                    },
                    {personalImg:'https://image.aftdc.com/images/packageA/shopImg2.jpg',name:'大傻逼',star:1,message:'离开家离开家离开家离开家离开家第三方sad风口浪尖的非法哦哦了加水电费后来就是地发斯蒂芬阿斯蒂芬阿斯蒂芬',grade:6,time:'2018-09-06',pictureList:
                            [   {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},]
                    },
                    {personalImg:'https://image.aftdc.com/images/packageA/shopImg2.jpg',name:'大傻逼',star:1,message:'离开家离开家离开家离开家离开家第三方sad风口浪尖的非法哦哦了加水电费后来就是地发斯蒂芬阿斯蒂芬阿斯蒂芬',grade:6,time:'2018-09-06',pictureList:
                            [{img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},]
                    },
                ],

                //嗮图评价
                messageListThree:[
                    {personalImg:'https://image.aftdc.com/images/packageA/shopImg2.jpg',name:'千寻',star:1,message:'怎么说呢....很无语.一个字形容,坑',grade:6,time:'2018-09-06',pictureList:
                            [   {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},]
                    },
                    {personalImg:'https://image.aftdc.com/images/packageA/shopImg2.jpg',name:'大傻逼',star:1,message:'离开家离开家离开家离开家离开家第三方sad风口浪尖的非法哦哦了加水电费后来就是地发斯蒂芬阿斯蒂芬阿斯蒂芬',grade:6,time:'2018-09-06',pictureList:
                            [   {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},]
                    },
                    {personalImg:'https://image.aftdc.com/images/packageA/shopImg2.jpg',name:'大傻逼',star:1,message:'离开家离开家离开家离开家离开家第三方sad风口浪尖的非法哦哦了加水电费后来就是地发斯蒂芬阿斯蒂芬阿斯蒂芬',grade:6,time:'2018-09-06',pictureList:
                            [{img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},]
                    },
                ],
                cashCoupon:[
                    {time:'周一至周日',limit:'部分商品可用',yuyue:'免预约',number:'不限张数',sold:78,money:40,moneyTwo:50,},
                    {time:'周一至周日',limit:'部分商品可用',yuyue:'免预约',number:'不限张数',sold:78,money:40,moneyTwo:50,},
                    {time:'周一至周日',limit:'部分商品可用',yuyue:'免预约',number:'不限张数',sold:78,money:40,moneyTwo:50,},
                    {time:'周一至周日',limit:'部分商品可用',yuyue:'免预约',number:'不限张数',sold:78,money:40,moneyTwo:50,},
                    ],
                score:{number:3.2,star:3.5},
                canteenLength:0,//判断食堂套餐的个数是否展示所有列表
                evaluateSelected:0,//全部,最新,晒图评价的点击切换
                lengthSmall:0,//点击展开的显示隐藏
                opacity:0,
                start:'',
                end:'',
            }
        },
        created(){
             var that=this
            if(this.canteenList.length>3){
                this.canteenLength=0;
            }
            else{
                this.canteenLength=1;
            }
            // //给所有评价加上行数判断
            // for(let i in that.messageListOne){
            //      that.messageListOne[i].linesJudge=false
            // }
            // for(let i in that.messageListTwo){
            //     that.messageListTwo[i].linesJudge=false
            // }
            // for(let i in that.messageListThree){
            //     that.messageListThree[i].linesJudge=false
            // }
        },
        methods:{
            minibarLeftButtonClick(){},
            canteenClick(){
                this.canteenLength=1;
            },
            evaluateClick(index){
                this.evaluateSelected=index;
            },
            //用于操作评价文字是否显示全部，接接口后可整合
            // allMessageClick(index){
            //     var that=this
            //     var ref=that.$refs.allMessage[index]
            //     if(that.messageListOne[index].linesJudge==false){
            //         that.messageListOne[index].linesJudge=true
            //     dom.updateStyle(ref,{lines:''})
            //     }else{
            //         that.messageListOne[index].linesJudge=false
            //         dom.updateStyle(ref,{lines:2})
            //     }
            // },
            // newMessageClick(index){
            //     var that=this
            //     var ref=that.$refs.newMessage[index]
            //     if(that.messageListTwo[index].linesJudge==false){
            //         that.messageListTwo[index].linesJudge=true
            //         dom.updateStyle(ref,{lines:''})
            //     }else{
            //         that.messageListTwo[index].linesJudge=false
            //         dom.updateStyle(ref,{lines:2})
            //     }
            // },
            // imgMessageClick(index){
            //     var that=this
            //     var ref=that.$refs.imgMessage[index]
            //     if(that.messageListThree[index].linesJudge==false){
            //         that.messageListThree[index].linesJudge=true
            //         dom.updateStyle(ref,{lines:''})
            //     }else{
            //         that.messageListThree[index].linesJudge=false
            //         dom.updateStyle(ref,{lines:2})
            //     }
            // },
            //用于操作评价文字是否显示全部，接接口后可整合
            backClick(){
                navigator.pop({ animated: 'true' });
            },
            toStorePicture(){
                var param='';
                var url='http://assets/storePicture.js';
                event.toUrl({"url":url,"param":param})
            },
            toUserEvaluate(){
                var param='';
                var url='http://assets/userEvaluate.js';
                event.toUrl({"url":url,"param":param})
            },
            toSetMeal(){
              var param='';
              var url='http://assets/setMeal.js';
              event.toUrl({"url":url,"param":param})
            },
            toPersonalHomePage(){
                var param='';
                var url='http://assets/personalHomePage.js'
                event.toUrl({"url":url,"param":param})
            },
            toBusinessOrder(){
                var param='';
                var url='http://assets/businessOrder.js'
                event.toUrl({"url":url,"param":param})
            },
            toPictureEvaluation(){
                var param='';
                var url='http://assets/pictureEvaluation.js'
                event.toUrl({"url":url,"param":param})
            },

//             scroll(event){
//                 modal.toast({
//                     message: this.start
//
//                 })
//                 if(event.contentOffset.y==0){
//                     dom.updateStyle(this.$refs.minibar,{opacity:0})
// return false
//                 }
//                 if(event.contentOffset.y==-250){
//                     dom.updateStyle(this.$refs.minibar,{opacity:1})
//                     return false
//                 }
//                 if(this.start-this.end<0&&this.opacity<1){
//                this.opacity+=0.1
//                 dom.updateStyle(this.$refs.minibar,{opacity:this.opacity})
//                     return false
//                 }
//                 if(this.start-this.end>0&&this.opacity>0){
//                     this.opacity-=0.1
//                     dom.updateStyle(this.$refs.minibar,{opacity:this.opacity})
//                     return false
//                 }
//             },
//             scrollStart(event){
//                 this.start=event.contentOffset.y
//             },
//             scrollEnd(event){
//                 this.end=event.contentOffset.y
//             }
        },
    }
</script>

<style scoped>
    .minibar {
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: #f1f1f1;
    }
    .userEvaluateNumber{
        color: #999;
        margin-right: 30px;
    }
    .userEvaluateDiv{
        flex: 1;
        flex-direction: row;
        align-items: center;
    }
    .userEvaluateText{
        padding-top: 30px;
        padding-bottom: 30px;
    }
    .userEvaluateTextTwo{
        padding-top: 30px;
        padding-bottom: 30px;
        flex: 1;
    }
    .userEvaluate{
        padding-left: 30px;
        padding-right: 30px;
        flex-direction: row;
        align-items: center;
    }
    .cashCouponBottomTextTwo{
        color: #999;
        margin-left: 20px;
    }
    .cashCouponBottom{
        flex-direction: row;
        align-items: center;
        margin-bottom: 30px;
    }
    .cashCouponContent{
        padding-top: 30px;
        padding-bottom: 30px;
        flex-direction: row;
        align-items: center;
    }
    .cashCouponContentText{
        flex-direction: row;
        align-items: center;
        flex: 1;
    }
    .cashSold{
        color: #999;
    }
    .defaultCash{
        padding-right: 10px;
        margin-right: 10px;
        color: #999;
        border-right-style: solid;
        border-right-width: 2px;
        border-right-color: #999;
    }
    .cashText{
        color: #999;
        margin-right: 8px;
    }
    .return{
        position: fixed;
        bottom: 200px;
        right: 20px;
        width: 100px;
        height: 100px;
        background-color: #53beb7;
        border-radius: 50px;
        text-align: center;
        line-height: 100;
        color: #fff;
    }
    .return:active{
        background-color: #57aba5;
    }
    .canteenIcon{
        width: 20px;
        height: 13px;
        margin-left: 8px;
    }
    .moreText{
        margin-top: 20px;
    }
    .moreInfoDiv{
        margin-left: 20px;
    }
    .timeIcon{
        width: 40px;
        height: 40px;
    }
    .moreInfoContent{
        flex-direction: row;
        align-items: center;
        margin-top: 10px;
    }
    .moreInfo{
        background-color: #ffffff;
        margin-top: 20px;
        /*margin-bottom: 20px;*/
        padding-top: 30px;
        padding-left: 30px;
        padding-bottom: 30px;
        padding-right: 30px;
    }
    .messageIconDiv{
        flex-wrap: wrap;
        margin-left: 97px;
        flex-direction: row;
        align-items: center;
        max-width: 600px;
    }
    .messageIcon{
        width: 125px;
        height: 125px;
        margin-top: 30px;
        margin-right: 20px;
    }
    .messageText{
        margin-top: 30px;
        margin-left: 97px;
        lines:2;
        text-overflow: ellipsis;
    }
    .messageTime{
        color: #999;
    }
    .messageInfoIcon{
        width: 30px;
        height: 30px;
        margin-left: 20px;
    }
    .messageInfo{
        flex: 1;
        margin-left: 20px;
    }
    .messageInfoTitle{
        flex-direction: row;
        align-items: center;
    }
    .messageImg{
        width: 75px;
        height: 75px;
        border-radius: 75px;
    }
    .messageDiv{
        flex-direction: row;
        align-items: center;
        opacity: 1;
    }
    .messageDiv:active{
        opacity: 0.7;
    }
    .message{
        border-bottom-style: solid;
        border-bottom-color: #f1f1f1;
        border-bottom-width: 2px;
        padding-bottom: 30px;
        padding-top: 40px;
        padding-left: 30px;
        padding-right: 30px;

    }

    .starDiv{
        position: relative;
        width: 150px;
        height: 24px;
        /*margin-top: 10px;*/
        justify-content: center;
        align-items: center;
    }
    .scoreTableText{
        width: 150px;
        text-align: center;
    }
    .scoreTableNum{
        font-size: 50px;
        color: orange;
    }
    .scoreTableDiv{
        margin-left: 20px;
    }
    .scoreTable{
        flex-direction: row;
        align-items: center;
        justify-content: center;
        margin-top: 35px;
    }
    .barTextThree{
        border-right-style: solid;
        border-right-color: #53beb7;
        border-right-width: 2px;
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
    }
    .barText{
        padding-top: 17px;
        padding-bottom: 17px;
        flex: 1;
        text-align: center;
        justify-content: center;
        border-left-style: solid;
        border-left-width: 2px;
        border-left-color: #53beb7;
        border-top-style: solid;
        border-top-width: 2px;
        border-top-color: #53beb7;
        border-bottom-style: solid;
        border-bottom-width: 2px;
        border-bottom-color: #53beb7;

    }
    .evaluateBar{
        flex-direction: row;
        align-items: center;
        justify-content: center;
        margin-top: 20px;
        padding-left: 80px;
        padding-right: 80px;
    }
    .evaluate{
        background-color: #fff;
        margin-top: 20px;
    }
    .canteenBottom{
        justify-content: center;
        flex-direction: row;
        align-items: center;
        padding-top: 30px;
        padding-bottom: 30px;
        background-color: #fff;
    }
    .canteenText{
        color: #999;
        margin-right: 20px;
    }
    .priceRight{
        color: #999;
        margin-left: 30px;
    }
    .canteenContentButtom{
        flex-direction: row;
        align-items: center;
        padding-top: 66px;
        padding-bottom: 66px;
    }
    .priceLeft{
    }
    .price{
        flex-direction: row;
        align-items: center;
    }
    .reriodRight{
        color: #999;
        margin-left: 15px;
        padding-left: 15px;
        border-left-style: solid;
        border-left-width: 2px;
        border-left-color: #ccc;

    }
    .reriodLeft{
        color: #999;
    }
    .reriod{
        margin-top: 30px;
        margin-bottom: 30px;
        flex-direction: row;
        align-items: center;
    }
    .canteenContentCenter{
        margin-left: 20px;
        flex: 1;
    }
    .canteenImg{
        width: 140px;
        height: 130px;
    }
    .canteenContent{
        flex-direction: row;
        padding-left: 60px;
        padding-top: 30px;
        border-bottom-style: solid;
        border-bottom-width: 2px;
        border-bottom-color: #f1f1f1;
        padding-bottom: 20px;
    }
    .canteenContent:active{
        background-color: #f8f8f8;
    }
    .tuanText{
        margin-left: 20px;
    }
    .canteenTitle{
        flex-direction: row;
        align-items: center;
        margin-bottom: 20px;
    }
    .tuan{
        padding-left: 5px;
        padding-right: 5px;
        padding-top: 2px;
        padding-bottom: 2px;
        background-color: #53beb7;
        color: #fff;
        border-radius: 5px;
    }
    .quan{
        padding-left: 5px;
        padding-right: 5px;
        padding-top: 2px;
        padding-bottom: 2px;
        color: #fff;
        background-color: #d100a4;
        border-radius: 5px;
    }
    .canteen{
        padding-top: 40px;
        padding-left: 30px;
        padding-right: 30px;
        background-color: #fff;
        border-top-style: solid;
        border-top-color: #f1f1f1;
        border-top-width: 2px;
    }
    .outFoodText{
        margin-left: 20px;
        flex: 1;
    }
    .cashCouponText{
        margin-left: 20px;
    }
    .outFood{
        margin-top: 20px;
        background-color:#fff;
        padding-top: 20px;
        padding-left: 30px;
        padding-bottom: 20px;
        padding-right: 30px;
        flex-direction: row;
        align-items: center;
    }
    .outFood:active{
        background-color: #f1f1f1;
    }
    .cashCoupon{
        margin-top: 20px;
        background-color:#fff;
        padding-top: 20px;
        padding-left: 30px;
        padding-bottom: 20px;
        padding-right: 30px;
    }
    .cashCouponTitle{
        flex-direction: row;
        align-items: center;
    }
    .defaultIconTwo{
        width: 35px;
        height: 35px;
    }
    .defaultIcon{
        width: 20px;
        height: 20px;
    }
    .addressText{
        margin-left: 20px;
        flex: 1;
    }
    .address{
        flex-direction: row;
        align-items: center;
        padding-top: 30px;
        padding-left: 30px;
        padding-bottom: 30px;
        padding-right: 30px;
        background-color: #fff;
    }
    .shopNameLeft{
        flex: 1;
    }
    .starNumber{
        color: #999;
        margin-left: 20px;
    }
    .star{
        margin-top: 20px;
        flex-direction: row;
        align-items: center;
        position: relative;
        overflow: hidden;
        height: 24px;
    }
    .starIconTwoDiv{
        position: absolute;
        overflow: hidden;
        left: 0px;
        top: 0;
        width: 0px;
        height: 24px;
    }
    .starIconTwo{
        width: 150px;
        height: 24px;
    }
    .starIcon{
        width: 150px;
        height: 24px;
    }
    .shopNameLeftTitle{
        font-weight: 900;
    }
    .shopName {
        padding-top: 30px;
        padding-left: 30px;
        padding-right: 30px;
        padding-bottom: 30px;
        background-color: #fff;
        flex-direction: row;
        align-items: center;
        border-bottom-style: solid;
        border-bottom-width: 2px;
        border-bottom-color: #f1f1f1;
    }
.shopName:active{
    background-color: #f1f1f1;
}
    .titleImgNumberIcon {
        width: 45px;
        height: 45px;
    }

    .titleImgNumberNumber {
        color: #fff;
        margin-top: 10px;
    }

    .titleImgNumber {
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 210px;
        right: 10px;
        width: 120px;
        height: 120px;
        border-radius: 75px;
        background-color: rgba(0, 0, 0, 0.5);
        opacity: 1;
    }
.titleImgNumber:active{
    opacity: 0.8;
}
    .titleImg {
        width: 750px;
        height: 340px;
        opacity: 1;
    }
.titleImg:active{
    opacity: 0.8;
}
    .wrapper {
        position: relative;
        background-color: #f8f8f8;
    }
.starTimeDiv{
    flex: 1;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: 5px;
}
    .cashCouponDiv{
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #f1f1f1;
    }
    .cashCouponDiv:active{
        background-color: #f8f8f8;
    }
    .userEvaluateActive:active{
        background-color: #f1f1f1;
    }
</style>
