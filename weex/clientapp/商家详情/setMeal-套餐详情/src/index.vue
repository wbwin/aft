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
                <text :style="GLOBAL.headerCenter"  slot="middle">套餐详情</text>
            </wxc-minibar>
        </div>

        <scroller class="scrollerStyle" show-scrollbar="false">
            <!-- header图片与信息 -->
            <div class="header bgWhite"   @click="openMask">
                <image class="headerImg" :src="setMealData.shopInfo.banner"></image>
                <div class="headerTitlebg jcCenter">
                    <text class="headerTitle" :style="{fontSize:GLOBAL.bigFS}">{{ setMealData.shopInfo.shopName }}</text>
                </div>
            </div>
            <div class="headerInfo row bgWhite">
                <div class="headerInfoItem">
                    <image class="headerInfoIconA" src="https://image.aftdc.com/images/groupG.png"></image>
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor}">随时退款</text>
                </div>
                <div class="headerInfoItem">
                    <image class="headerInfoIconB" src="https://image.aftdc.com/images/sell.png"></image>
                    <text class="gray" :style="{fontSize:GLOBAL.smallFS}">已售</text>
                </div>
                <div class="headerInfoItem">
                    <image class="headerInfoIconA" src="https://image.aftdc.com/images/groupG.png"></image>
                    <text :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.tColor}">过期自动退</text>
                </div>
            </div>
            <!-- 套餐类型选择 -->
            <div class="typeSelection bgWhite" ref="test">
                <div  v-for="(item,index) in type" v-if=" typeList ||index < 6">
                    <div class="type" :class="[item.checked?'select':'']" @click="typeSelect(item.typeName)">
                        <text class="typeText" :class="[item.checked?'selectText':'']" :style="{fontSize:GLOBAL.smallFS}">{{ item.typeName }}</text>
                    </div>
                </div>
                <div class="typeBtn row jcCenter" @click="typeListToggle">
                    <div class="row aicenter" v-if="typeList">
                        <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">收起</text>
                        <image class="typeBtnIcon" src="https://image.aftdc.com/appBimg/ic_arrow_up_green.png"></image>
                    </div>
                    <div class="row aicenter" v-else>
                        <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}">更多</text>
                        <image class="typeBtnIcon" src="https://image.aftdc.com/appBimg/ic_arrow_down_green.png"></image>
                    </div>
                </div>
            </div>
            <!-- 评价分类 -->
            <div class="shopInfo bgWhite">
                <div class="commentTitle shopInfoTitle row aicenter" @click="toUserEvaluate()">
                    <div class="row aicenter">
                        <div class="row">
                            <image class="starsGray startSize" src="https://image.aftdc.com/appBimg/icon_wuxing_nocolor.png"></image>
                            <div class="starsOrangeWidth"  :style="{width:setMealData.comment.generalComment.score*30+'px'}">
                                <image class=" startSize" src="https://image.aftdc.com/appBimg/icon_wuxing_color.png"></image>
                            </div>
                        </div>
                        <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{ setMealData.comment.generalComment.score }}分</text>
                    </div>
                    <div class="row aicenter">
                        <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{ setMealData.comment.generalComment.numberPeople }}人评价</text>
                        <image class="numberPeopleTextIcon" src ="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                    </div>
                </div>
                <div class="evaluateClass row">
                    <div  v-for="(item,index) in setMealData.comment.evaluateClass" @click="toUserEvaluate()">
                        <div class="typeClass" :class="[item.checked?'select':'']" >
                            <text class="typeClassText" :class="[item.checked?'selectText':'']" :style="{fontSize:GLOBAL.smallFS}">{{ item.evaluateClassName }}&nbsp;{{ item.numberPeople }}</text>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 商家信息 -->
            <div class="shopInfo bgWhite">
                <div class="shopInfoTitle">
                    <text class="gray" :style="{fontSize:GLOBAL.bigFS}">商家信息</text>
                </div>
                <div class="shopInfoContent row aicenter">
                    <div class="shopInfoMain">
                        <text class="shopInfoText shopName" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{ setMealData.shopInfo.shopName }}</text>
                        <text class="gray shopInfoText" :style="{fontSize:GLOBAL.smallFS}">{{ setMealData.shopInfo.address }}</text>
                        <div class="row aicenter">
                            <image class="distanceIcon" src="https://image.aftdc.com/images/hdw.png"></image>
                            <text class="gray shopInfoText" :style="{fontSize:GLOBAL.smallFS}">{{ setMealData.shopInfo.distance }}km</text>
                        </div>
                    </div>
                    <div class="phone">
                        <image class="phoneIcon" src="https://image.aftdc.com/appBimg/ic_phone_blue.png"></image>
                    </div>
                </div>
            </div>
            <!--套餐信息-->
            <div class="setMeal bgWhite">
                <div class="shopInfoTitle">
                    <text class="gray" :style="{fontSize:GLOBAL.bigFS}">套餐</text>
                </div>
                <div class="setMealName aicenter">
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{ setMealData.setMealName }}</text>
                </div>

                <div class="setMealList row aicenter" v-for="item in setMealData.foods">
                    <text class="foodName" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{ item.foodName }}</text>
                    <div class="foodNumber aicenter">
                        <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{ item.foodNumber }}份</text>
                    </div>
                    <text class="price" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">￥{{ item.foodPrice }}</text>
                </div>

                <div class="remarks">
                    <div class="aicenter">
                        <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">备注</text>
                    </div>
                        <text class="remarksInfo" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}"> • {{ setMealData.remarks }}</text>
                </div>
            </div>
            <!-- 购买须知 -->
            <div class="shopInfo bgWhite">
                <div class="shopInfoTitle">
                    <text class="gray" :style="{fontSize:GLOBAL.defaultFS}">购买须知</text>
                </div>
                <div class="notesInfo">
                    <text class="orange notesText" :style="{fontSize:GLOBAL.defaultFS}">有效期</text>
                    <text class="semiGrey notesText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{ setMealData.termOfValidity.termOfValidityStart }}&nbsp;至&nbsp;{{ setMealData.termOfValidity.termOfValidityEnd }}（可用）</text>
                    <text class="orange notesText" :style="{fontSize:GLOBAL.defaultFS}">使用时间</text>
                    <text class="notesText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{ setMealData.useTime.useTimeStart }}&nbsp;-&nbsp;{{ setMealData.useTime.useTimeEnd }}</text>
                </div>
            </div>
            <!-- 评论区 -->
            <div class="shopInfo bgWhite comment">
                <div class="commentTitle shopInfoTitle row aicenter" @click="toUserEvaluate()">
                    <div class="row aicenter">
                        <div class="row">
                            <image class="starsGray startSize" src="https://image.aftdc.com/appBimg/icon_wuxing_nocolor.png"></image>
                            <div class="starsOrangeWidth"  :style="{width:setMealData.comment.generalComment.score*30+'px'}">
                                <image class=" startSize" src="https://image.aftdc.com/appBimg/icon_wuxing_color.png"></image>
                            </div>

                        </div>
                        <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{ setMealData.comment.generalComment.score }}分</text>
                    </div>
                    <div class="row aicenter">
                        <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{ setMealData.comment.generalComment.numberPeople }}人评价</text>
                        <image class="numberPeopleTextIcon" src ="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                    </div>
                </div>
                <div>
                    <div class="commentItem" v-for="item in setMealData.comment.userComment" >
                        <div class="userHeader row aicenter" @click="toPersonalHomePage()">
                            <image class="userImg" :src="item.userImg"></image>
                            <div style="width: 595px;">
                                <div class="userTitle row aicenter">
                                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{ item.userName }}</text>
                                    <image class="userGrade" :src="item.userGrade"></image>
                                    <text class="gray dataText" :style="{fontSize:GLOBAL.smallFS}">{{ item.userReleaseTime }}</text>
                                </div>
                                <div class="startAndTime row aicenter">
                                    <div class="row">
                                        <image class="starsGray startSize" src="https://image.aftdc.com/appBimg/icon_wuxing_nocolor.png" ></image>
                                        <div class="starsOrangeWidth" :style="{width:item.userScore*30+'px'}">
                                            <image class=" startSize" src="https://image.aftdc.com/appBimg/icon_wuxing_color.png"></image>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="commentContent">
                            <text class="commentContentText" @click="toUserEvaluate()" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{ item.userText }}</text>
                            <div class="wholeCommentImg row" >
                                <div v-for="itemImg in item.userFoodImg">
                                    <image class="commentImg" :src="itemImg"></image>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="shopInfoTitle row allComments aicenter" @click="toUserEvaluate()">
                    <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}">查看全部{{ setMealData.comment.generalComment.numberPeople }}条评价</text>
                    <image class="numberPeopleTextIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                </div>
            </div>
        </scroller>
        <!-- footer抢购 -->
        <div class="footer row aicenter" >
            <div class="footerLeft row aicenter" >
                <text class="totalPrice" :style="{fontSize:GLOBAL.biggestFS}">￥{{ setMealData.totalPrice }}</text>
                <text class="gray" :style="{fontSize:GLOBAL.defaultFS,marginLeft:'20px'}">最高门市价:￥{{ setMealData.rackRate }}</text>
            </div>
            <div class="rushToBuy aicenter jcCenter" >
                <text class="rushToBuyText" :style="{fontSize:GLOBAL.bigFS}">立即抢购</text>
            </div>
        </div>
        <!-- header图片弹出层 -->
        <wxc-mask height="340"
                  width="750"
                  border-radius="0"
                  duration="200"
                  mask-bg-color="rgba(0,0,0,0)"
                  :has-animation="hasAnimation"
                  :has-overlay="true"
                  :show-close="false"
                  :show="show"
                  @wxcMaskSetHidden="wxcMaskSetHidden">
            <image class="headerImg" src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=4062622605,741429236&fm=27&gp=0.jpg"></image>
        </wxc-mask>
    </div>
</template>

<script>
    import {WxcMinibar} from 'weex-ui';
    import { WxcMask } from 'weex-ui';
    const modal = weex.requireModule('modal');
    const dom = weex.requireModule('dom');
    const event = weex.requireModule('event');
    export default {
        name: 'App',
        data() {
            return {
                typeList: false,
                // 套餐banner图控制
                show: false,
                overlayCanClose: true,
                isFalse: false,
                hasAnimation: true,
                // 套餐类型选择
                type: [
                    {typeName:"超值全家桶",checked:true},
                    {typeName:"巨无霸套餐",checked:false},
                    {typeName:"儿童特惠套餐",checked:false},
                    {typeName:"儿童特惠套餐1",checked:false},
                    {typeName:"儿童特惠套餐2",checked:false},
                    {typeName:"儿童特惠套餐3",checked:false},
                    {typeName:"儿童特惠套餐4",checked:false},
                    {typeName:"儿童特惠套餐5",checked:false}
                ],
                // 套餐信息与评价
                setMealData: {
                    shopInfo: {
                        banner: "https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=4062622605,741429236&fm=27&gp=0.jpg",
                        shopName: "广州麦丹劳",
                        address: "广园汽车客运站",
                        distance: 0.5
                    },
                    setMealName: "超值全家桶",
                    foods: [
                        {foodName:"全家桶鸡块",foodNumber:1,foodPrice:33},
                        {foodName:"香辣鸡腿堡",foodNumber:3,foodPrice:36},
                        {foodName:"薯条",foodNumber:2,foodPrice:10},
                        {foodName:"百事可乐",foodNumber:1,foodPrice:18},
                    ],
                    remarks: "免费提供餐巾纸",
                    termOfValidity: {
                        termOfValidityStart: "2018-06-16",
                        termOfValidityEnd: "2018-07-16"
                    },
                    useTime: {
                        useTimeStart: "08:00",
                        useTimeEnd: "22:00"
                    },
                    comment: {
                        generalComment: {
                            score : 3.5,
                            numberPeople: 50
                        },
                        evaluateClass: [
                            {
                                evaluateClassName: "上菜快",
                                numberPeople: 486
                            },
                            {
                                evaluateClassName: "回头客",
                                numberPeople: 419
                            },
                            {
                                evaluateClassName: "干净卫生",
                                numberPeople: 191
                            },
                            {
                                evaluateClassName: "现做现买",
                                numberPeople: 53
                            },
                            {
                                evaluateClassName: "菜品健康",
                                numberPeople: 67
                            },
                            {
                                evaluateClassName: "下午茶",
                                numberPeople: 32
                            },
                            {
                                evaluateClassName: "不推荐",
                                numberPeople: 31
                            },
                            {
                                evaluateClassName: "朋友聚餐",
                                numberPeople: 22
                            },
                            {
                                evaluateClassName: "深夜食堂",
                                numberPeople: 20
                            },
                            {
                                evaluateClassName: "工作餐",
                                numberPeople: 9
                            }
                        ],
                        userComment:[
                            {
                                userImg: "http://www.shangol.cn/uploads/allimg/20180306/1P306041552U63.jpg",
                                userName: "RSo1169014",
                                userScore : 3,
                                userGrade: "https://image.aftdc.com/images/v1.png",
                                userReleaseTime: "2018-05-20",
                                userText: "这次点了小吃单人餐。味道个人感觉不错，小孩特别爱吃，环境也不错，多位置选择， 有音乐，这次比上次服务到位很多，餐巾纸，沙拉酱都有，回头客了，10来块钱，价格也挺优惠的。",
                                userFoodImg: ["https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1529935988834&di=c0cd25c9b92c527432be16d5b261823b&imgtype=0&src=http%3A%2F%2Frj2.douguo.net%2Fupload%2Fdiet%2Fc%2F7%2F4%2Fc7a68d36063924d008bd8d0645500ea4.jpg","https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1530530742&di=cb268f321332d2de08ef077563ef2425&imgtype=jpg&er=1&src=http%3A%2F%2Fcbu01.alicdn.com%2Fimg%2Fibank%2F2015%2F115%2F758%2F2702857511_678103496.jpg","https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1529936065356&di=3bfbb71b8aff4ad6f453ecc1161ec725&imgtype=0&src=http%3A%2F%2Fqcloud.dpfile.com%2Fpc%2FqVH5mLJuR23Cb5iC1SuIV_ZqhTgh9rmNPHE-Pk43lNt_kQU1XxpLvyT7Ek61DQZ1F5u7J_jS4MuCaeLAHD0KTg.jpg"]
                            },
                            {
                                userImg: "http://www.shangol.cn/uploads/allimg/20180306/1P306041552U63.jpg",
                                userName: "RSo1169014",
                                userScore : 4.5,
                                userGrade: "https://image.aftdc.com/images/v1.png",
                                userReleaseTime: "2018-05-20",
                                userText: "这次点了小吃单人餐。味道个人感觉不错，小孩特别爱吃，环境也不错，多位置选择， 有音乐，这次比上次服务到位很多，餐巾纸，沙拉酱都有，回头客了，10来块钱，价格也挺优惠的。",
                                userFoodImg: ["https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1529935988834&di=c0cd25c9b92c527432be16d5b261823b&imgtype=0&src=http%3A%2F%2Frj2.douguo.net%2Fupload%2Fdiet%2Fc%2F7%2F4%2Fc7a68d36063924d008bd8d0645500ea4.jpg","https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1530530742&di=cb268f321332d2de08ef077563ef2425&imgtype=jpg&er=1&src=http%3A%2F%2Fcbu01.alicdn.com%2Fimg%2Fibank%2F2015%2F115%2F758%2F2702857511_678103496.jpg","https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1529936065356&di=3bfbb71b8aff4ad6f453ecc1161ec725&imgtype=0&src=http%3A%2F%2Fqcloud.dpfile.com%2Fpc%2FqVH5mLJuR23Cb5iC1SuIV_ZqhTgh9rmNPHE-Pk43lNt_kQU1XxpLvyT7Ek61DQZ1F5u7J_jS4MuCaeLAHD0KTg.jpg","https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1529935988834&di=c0cd25c9b92c527432be16d5b261823b&imgtype=0&src=http%3A%2F%2Frj2.douguo.net%2Fupload%2Fdiet%2Fc%2F7%2F4%2Fc7a68d36063924d008bd8d0645500ea4.jpg","https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1530530742&di=cb268f321332d2de08ef077563ef2425&imgtype=jpg&er=1&src=http%3A%2F%2Fcbu01.alicdn.com%2Fimg%2Fibank%2F2015%2F115%2F758%2F2702857511_678103496.jpg","https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1529936065356&di=3bfbb71b8aff4ad6f453ecc1161ec725&imgtype=0&src=http%3A%2F%2Fqcloud.dpfile.com%2Fpc%2FqVH5mLJuR23Cb5iC1SuIV_ZqhTgh9rmNPHE-Pk43lNt_kQU1XxpLvyT7Ek61DQZ1F5u7J_jS4MuCaeLAHD0KTg.jpg","https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1529935988834&di=c0cd25c9b92c527432be16d5b261823b&imgtype=0&src=http%3A%2F%2Frj2.douguo.net%2Fupload%2Fdiet%2Fc%2F7%2F4%2Fc7a68d36063924d008bd8d0645500ea4.jpg","https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1530530742&di=cb268f321332d2de08ef077563ef2425&imgtype=jpg&er=1&src=http%3A%2F%2Fcbu01.alicdn.com%2Fimg%2Fibank%2F2015%2F115%2F758%2F2702857511_678103496.jpg","https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1529936065356&di=3bfbb71b8aff4ad6f453ecc1161ec725&imgtype=0&src=http%3A%2F%2Fqcloud.dpfile.com%2Fpc%2FqVH5mLJuR23Cb5iC1SuIV_ZqhTgh9rmNPHE-Pk43lNt_kQU1XxpLvyT7Ek61DQZ1F5u7J_jS4MuCaeLAHD0KTg.jpg"]
                            }
                        ]
                    },
                    totalPrice: 97.00,
                    rackRate: 110.00
                }
            }
        },
        components: { WxcMinibar,WxcMask },
        methods: {
            // 顶部导航栏
            minibarLeftButtonClick () {
            },
            minibarRightButtonClick () {
                modal.toast({ 'message': 'click rightButton!', 'duration': 1 });
            },
            // banner图蒙版
            openMask (e) {
                this.show = true;
                this.hasAnimation = true;
            },
            wxcMaskSetHidden () {
                this.show = false;
            },
            typeListToggle(){
                this.typeList = !this.typeList
            },
            // 套餐类型选择
            typeSelect(type){
                for(let i in this.type){
                    // this.type[i] = false
                    if(this.type[i].typeName === type){
                        this.type[i].checked = true
                    }else {
                        this.type[i].checked = false
                    }
                }
            },
            toUserEvaluate(){
                var param='';
                var url='http://assets/userEvaluate.js';
                event.toUrl({"url":url,"param":param})
            },
            toPersonalHomePage(){
                var param='';
                var url='http://assets/personalHomePage.js'
                event.toUrl({"url":url,"param":param})
            }
        }

    }
</script>

<style scoped>
    .startAndTime{}
    .evaluateClass {
        flex-wrap: wrap;
        margin-top: 18px;
        padding-left: 30px;
        padding-right: 30px;
        margin-bottom: 18px;
    }



    .wrapper {
        align-items: center;
        background-color: #f0f0f0;
    }
    .minibar {
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: #f1f1f1;
    }
    .backImg{
        width: 40px;
        height: 40px;
    }
    .scrollerStyle {
        width: 750px;
        flex: 1;
    }
    .dataText{
        flex: 1;
        text-align: right;
    }
    /*  公共样式 */
    .gray {
        color: #999;
    }
    .orange {
        color: #ff9900;
    }
    .semiGrey {
        color: #484848;
    }
    .row {
        flex-direction: row;
    }
    .jcCenter {
        justify-content: center;
    }
    .aicenter {
        align-items: center;
    }
    .bgWhite {
        background-color: #fff;
    }
    /* header图片 */
    .header {
        position: relative;
    }
    .headerImg {
        width: 750px;
        height: 340px;
    }
    .headerTitlebg {
        width: 750px;
        height: 64px;
        background-color: rgba(0,0,0,0.4);
        position: absolute;
        left: 0;
        bottom: 0;
    }
    .headerTitle {
        color: #fff;
        margin-left: 36px;
    }
    .headerInfo {
        width: 750px;
        padding-left: 30px;
        padding-right: 30px;
        flex-wrap: wrap;
        padding-top: 10px;
        padding-bottom: 10px;
    }
    .headerInfoItem {
        width: 345px;
        height: 68px;
        flex-direction: row;
        align-items: center;
    }
    .headerInfoIconA {
        width: 30px;
        height: 30px;
        margin-right: 12px;
    }
    .headerInfoIconB {
        width: 50px;
        height: 50px;
        margin-right: 10px;
    }
    /* 套餐类型选择 */
    .typeSelection {
        width: 750px;
        margin-top: 18px;
        padding-left: 30px;
        padding-right: 30px;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: center;
        padding-top: 16px;    /* 原始8 */
        padding-bottom: 8px;
    }
    .type {
        border-width: 2px;
        border-style: solid;
        border-color: #b0b0b0;
        padding-top: 13px;
        padding-bottom: 13px;
        padding-left: 18px;
        padding-right: 18px;
        border-radius: 5px;
        margin-right: 16px;
        margin-top: 8px;
        margin-bottom: 10px;
    }
    .typeClass {
        border-width: 1px;
        border-style: solid;
        border-color: #b0b0b0;
        padding-top: 5px;
        padding-bottom: 5px;
        padding-left: 8px;
        padding-right: 8px;
        border-radius: 5px;
        margin-right: 16px;
        margin-top: 8px;
        margin-bottom: 10px;
    }
    .typeText {
        color: #999;
    }
    .typeClassText {
        color: #999;
    }
    .select {
        border-color: #30b0a8;
        background-color: #d3f9f5;
    }
    .selectText {
        color: #30b0a8;
    }
    .typeBtnIcon {
        width: 18px;
        height: 13px;
        margin-left: 14px;
    }
    .typeBtn {
        width: 720px;
        padding-top: 14px;
        padding-bottom: 14px;
    }
    /* 商家信息 */
    .shopInfo {
        width: 750px;
        margin-top: 18px;
    }
    .shopInfoTitle {
        padding-top: 20px;
        padding-bottom: 20px;
        padding-left: 30px;
        padding-right: 30px;
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #e2e2e2;
    }
    .shopInfoContent {
        width: 690px;
        padding-top: 6px;
        padding-bottom: 6px;
        justify-content: space-between;
        padding-left: 30px;
    }
    .shopName {
        width: 380px;
        lines: 1;
        text-overflow: ellipsis;
    }
    .distanceIcon {
        width: 30px;
        height: 32px;
        margin-right: 6px;
    }
    .shopInfoText {
        padding-top: 5px;
        padding-bottom: 5px;
    }
    .phone {
        border-left-width: 2px;
        border-left-style: solid;
        border-left-color:  #e2e2e2;
        padding-left: 30px;
    }
    .phoneIcon {
        width: 40px;
        height: 44px;
    }
    /* 套餐信息 */
    .setMeal {
        width: 750px;
        margin-top: 18px;
    }
    .setMealName {
        padding-top: 22px;
        padding-bottom: 22px;
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #ececec;
    }
    .setMealList {
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #ececec;
        padding-left: 30px;
        padding-right: 30px;
    }
    .foodName {
        flex: 6;
    }
    .foodNumber {
        flex: 3.5;
        padding-bottom: 18px;
        padding-top: 18px;
        border-left-width: 2px;
        border-left-style: solid;
        border-left-color: #ececec;
        border-right-width: 2px;
        border-right-style: solid;
        border-right-color: #ececec;
    }
    .price {
        flex: 2.5;
        padding-left: 10px;
    }
    .remarks {
        padding-top: 26px;
        padding-bottom: 30px;
    }
    .remarksInfo {
        padding-left: 30px;
        padding-top: 36px;

    }
    /* 购买须知 */
    .notesInfo {
        padding-left: 30px;
        padding-right: 30px;
        padding-top: 10px;
        padding-bottom: 10px;
    }
    .notesText {
        padding-top: 8px;
        padding-bottom: 8px;
    }
    /* 评论区 */
    .comment {
        margin-bottom: 50px;
    }
    .commentTitle {
        justify-content: space-between;
    }
    .startSize {
        width: 150px;
        height: 25px;
    }
    .starsGray {
        margin-right: 10px;
    }
    .starsOrangeWidth {
        overflow: hidden;
        position: absolute;
        top: 0px;
        left: 0px;
    }
    .numberPeopleTextIcon {
        width: 26px;
        height: 24px;
        margin-left: 4px;
    }
    .commentItem {
        padding-left: 30px;
        padding-right: 30px;
        padding-bottom: 30px;
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #e2e2e2;
    }
    .userHeader {
        padding-top: 32px;
        padding-bottom: 12px;
    }
    .userImg {
        width: 75px;
        height: 75px;
        border-radius: 100px;
        margin-right: 20px;
    }
    .userGrade {
        width: 30px;
        height: 30px;
        margin-left: 20px;
    }
    .commentContentText{

    }
    .wholeCommentImg {
        margin-top: 10px;
        flex-wrap: wrap;
    }
    .commentImg {
        width: 130px;
        height: 130px;
        margin-right: 10px;
        margin-bottom: 10px;
    }
    .allComments {
        justify-content: space-between;
    }
    /* header图片弹出层 */
    .footer{
        width: 750px;
        height: 80px;
        background-color: #fff;
        justify-content: space-between;
        border-top-width: 1px;
        border-top-style: solid;
        border-top-color: #e2e2e2
    }
    .rushToBuy{
        height: 80px;
        width: 200px;
        background-color: #53beb7;
    }
    .rushToBuyText {
        color: #fff
    }
    .totalPrice {
        color: #ff9900;
        margin-left: 20px;
        margin-right: 10px;
    }
</style>
