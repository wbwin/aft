<template>
    <div class="wrapper">

        <!--页头-->
        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    @wxcMinibarRightButtonClicked="minibarRightButtonClick"
                    v-once>
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">帮TA加油</text>
                <image class="navigationRightIcon" slot="right" src="https://image.aftdc.com/appBimg/ic_more_head.png"></image>
            </wxc-minibar>
        </div>
        <!--主体-->
        <scroller class="scrollerStyle" show-scrollbar="false">
            <div class="content">

                <div class="bgWhite"></div>
                <div class="contentMain">

                    <text class="fontStyle" :style="{fontSize:GLOBAL.biggerFS}">“帮TA加油上餐头条”</text>
                    <div class="refuel" @click="toggle">
                        <text class="refulText" v-if="!isPraise" :style="{fontSize:GLOBAL.bigFS}">为TA加油</text>
                        <image class="refulImg" src="https://image.aftdc.com/images/dagou.png" v-else></image>
                    </div>
                    <div class="helpPeople">
                        <div class="helpPeopleImgBox" v-for="(item,index) in helpPeople" v-if="isPraise">
                            <image class="helpPeopleImg" :src="item.userPhoto"></image>
                        </div>

                    </div>
                    <text class="fontStyle mar10" :style="{fontSize:GLOBAL.biggerFS}">{{ praiseNum }}人为TA助力加油</text>
                </div>
                <div class="contentBottom">
                    <div class="shopInfo">
                        <div style="border-radius: 40px">
                            <image class="shopImg"  :src="'https://image.aftdc.com/'+shopInfo.shopImg"></image>
                        </div>
                        <text class="shopName" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{shopInfo.shopName}}</text>
                    </div>
                    <div class="enterShop">
                        <text @click="toShopDetails()" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}">进店</text>
                    </div>
                </div>
                <div style="position: absolute;left: 303px;top: 18px;border-radius: 50px">
                    <image class="titleImg" :src="'https://image.aftdc.com/'+shopInfo.shopImg"></image>
                </div>
            </div>
            <div class="enterNews">
                <text @click="toIndex()" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}">进入餐头条</text>
            </div>

        </scroller>

        <toast ref="toast"></toast>
        <!--...气泡弹出层-->
        <wxc-popover ref="wxc-popover"
                     :buttons="btns"
                     :position="popoverPosition"
                     :arrowPosition="popoverArrowPosition"
                     @wxcPopoverButtonClicked="popoverButtonClicked"></wxc-popover>
        <!--分享组件-->
        <share ref="share"></share>



    </div>
</template>

<script>
    import Toast from './Toast.vue';
    import Share from './Share.vue';
    import { WxcMinibar,WxcButton,WxcPopover} from 'weex-ui';
    const GLOBAL = require('@/Global.vue');
    const modal = weex.requireModule('modal');
    const event = weex.requireModule('event');
    const post = weex.requireModule('stream');
    let timer = null;

    export default {
        name: 'App',
        components: { WxcMinibar,WxcButton,WxcPopover,Share,Toast},
        data() {
            return {
                userId: 0,
                articleId: 0,
                shopId: 0,
                userPhoto: '',
                title: '',
                description: '',

                shopInfo: {},
                isPraise: 0,
                praiseNum: 0,
                id: 1,
                helpPeople: [],

                btns:[ //气泡层更多功能
                    {
                        icon: 'http://www.bbvdd.com/d/2018111419563157n.png',
                        text:'分享',
                        key:'key-scan'
                    }
                ],
                popoverPosition:{x:-14,y:70},
                popoverArrowPosition:{pos:'top',x:-28},

            }
        },
        created() {
            var param = JSON.parse(weex.config.param)
            this.articleId = param.articleId
            this.shopId = param.shopId
            this.title = param.title
            this.description = param.description
            this.userId = weex.config.userId
            this.userPhoto = weex.config.userPhoto
            this.getRefuelInfo()
        },
        methods: {

            getRefuelInfo() {
                var that = this
                var param = '&userId=' + that.userId
                param += '&articleId=' + that.articleId
                param += '&shopId=' + that.shopId
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: 'https://www.aftdc.com/userapp/Article/refuelPageInfo',
                }, function (res) {
                    if(res.data.res === 1) {
                        that.isPraise = res.data.data.isPraise
                        that.praiseNum = res.data.data.praiseNum
                        that.helpPeople = res.data.data.praiseInfo
                        that.shopInfo = res.data.data.shopInfo
                    }else if(res.data.res === -2) {
                        that.toLogin()
                    }
                })
            },
            minibarLeftButtonClick () {

            },
            toggle:GLOBAL.throttle(function(){
                var that = this
                const toast=that.$refs.toast;
                if(!that.isPraise) {
                    var param = that.GLOBAL.sign(this.token,this.imei);
                    param += '&id=' + that.articleId
                    post.fetch({
                        method: 'POST',
                        type: 'json',
                        body: param,
                        headers: { "Content-Type": "application/x-www-form-urlencoded" },
                        url: 'https://www.aftdc.com/userapp/Article/praiseArticle',
                    }, function (res) {
                        if(res.data.res === 1) {
                            that.isPraise = 1
                            that.praiseNum++
                            if(that.helpPeople.length === 10) {
                                that.helpPeople.splice(9,1)
                            }
                            that.helpPeople.unshift({userPhoto:that.userPhoto})
                            that.userPhoto
                            toast.editContent('加油成功');
                        }else if(res.data.res === -2) {
                            that.toLogin()
                        }
                    });
                }else {
                    toast.editContent('已经加油过了');
                }

            }),
            toIndex:GLOBAL.throttle(function() {
                var tabIndex='2';
                event.save('tabIndex',tabIndex);
                var param='';
                var url='http://assets/index.js'
                event.toUrl({"url":url,"param":param})
            }),
            toShopDetails:GLOBAL.throttle(function() {
                var shopType = null
                var orderType = null
                switch(this.shopInfo.featured) {
                    case 0:
                        shopType = 1
                        orderType = 0
                        break
                    case 3:
                        shopType = 5
                        orderType = 3
                        break
                    case 5:
                        shopType = 2
                        orderType = 5
                        break
                }
                var param={shopId:this.shopId,shopType:shopType,orderType:orderType}
                param=JSON.stringify(param)
                var url='http://assets/businessOrder.js';
                event.toUrl({"url":url,"param":param})
            }),
            minibarRightButtonClick () { //...更多功能气泡层弹出
                this.$refs['wxc-popover'].wxcPopoverShow();
            },
            popoverButtonClicked (obj) { //...更多功能选中
                this.articleShare()
            },
            articleShare() {//分享
                var wxappPart = '';					                                                            //小程序路径
                var webUrl = 'https://www.aftdc.com/mobile/article/articleDetail.html?id=' + this.articleId;	//网页链接
                var title = this.title;						                                                    //分享标题
                var shareImg = 'https://image.aftdc.com/' + 'this.articleInfo.shopImg';                         //分享缩略图片
                var description = this.description;					                                        //分享描述
                var scene = 2;
                const share = this.$refs.share;
                share.show(true,true,true,false,false,false,true,false,wxappPart,webUrl,title,shareImg,description,scene);
            },
            toLogin(){ //跳转到登录页面
                var param='';
                var url='http://assets/login.js';
                event.toUrl({"url":url,"param":param})
            },
        }
    }
</script>

<style scoped>
    .navigationRightIcon {
        width: 50px;
        height: 50px;
    }
    .enterButton {
        width: 750px;
        flex-direction: row;
        justify-content: space-around;
        /*position: fixed;*/
        /*left: 0;            存在时固定在底部*/
        /*bottom: 0;*/
        /*right: 0;*/
        background-color: #fff;
        border-top-width: 2px;
        border-top-style: solid;
        border-top-color: #f1f1f1;
        padding-top: 20px;
        padding-bottom: 20px;
        padding-left: 30px;
        padding-right: 30px;
    }

    .okButton:active {
        background-color: #57aba5;
    }
    .okButtonTwo:active{
        background-color: #f8f8f8;
    }
    .wrapper {
        /*justify-content: center;*/
        align-items: center;
        background-color: #f8f8f8;
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
        flex: 1;
        width: 750px;
        align-items: center;
        background-color: #f8f8f8;
    }
    /* 主体样式 */
    .content {
        background-color: #fff;
        /*margin-top: 68px;*/
    }
    .bgWhite {
        height: 68px;
        width: 706px;
        background-color: #f8f8f8;
    }
    .titleImg {
        width: 100px;
        height: 100px;
        border-radius: 50px;
        border-width: 1px;
        border-style: solid;
        border-color: #dedede;

        overflow: visible;
    }
    .contentMain {
        background-image: linear-gradient(to bottom right ,#fff,#50bdb6);
        padding-top: 100px;
        padding-bottom: 36px;
        align-items: center;
        width: 706px;

    }
    .fontStyle {
        color: #fff;
        font-weight: 600;
    }
    .refuel {
        width:250px;
        height:250px;
        background-color:#53beb7;
        border-radius: 125px;
        border-width: 2px;
        border-style: solid;
        border-color: #fff;
        align-items: center;
        justify-content: center;
        margin-top: 72px;
        margin-bottom: 70px;
        /*border:1rpx solid #fff;*/
    }
    .refulText {
        color: #fff;
        font-weight: 600;
    }
    .refulImg {
        width:180px;
        height:180px;
    }
    .mar10 {
        margin-top: 10px;
    }

    /* 店铺信息 */
    .contentBottom {
        width: 706px;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding-left: 20px;
        padding-right: 20px;
        padding-top: 34px;
        padding-bottom: 34px;
    }
    .shopInfo {
        flex-direction: row;
        align-items: center;
    }
    .shopImg {
        width:80px;
        height:80px;
        border-radius: 40px;
        border-width: 1px;
        border-style: solid;
        border-color: #dedede;

    }
    .shopName {
        padding-left: 10px;
        max-width: 400px;
        lines: 1;
        text-overflow: ellipsis;
    }
    .enterShop {
        padding-top: 7px;
        padding-bottom: 7px;
        padding-left: 20px;
        padding-right: 20px;
        border-width: 2px;
        border-style: solid;
        border-color: #4cbbb4;
        border-radius: 10px;
    }
    .enterShop:active{
        background-color: #f8f8f8;
    }

    /* 进入餐头条 */
    .enterNews {
        border-width: 2px;
        border-style: solid;
        border-color: #42b8b0;
        background-color: #fff;
        padding-top: 20px;
        padding-bottom: 20px;
        padding-left: 72px;
        padding-right: 72px;
        border-radius: 50px;
        margin-top: 34px;
        margin-bottom: 140px;
    }
    .enterNews:active{
        background-color: #f8f8f8;
    }

    /* 底部按钮样式 */
    .footerBtn {
        flex-direction: row;
        position: fixed;
        bottom: 0;
        width: 750px;
        justify-content: space-between;
        background-color: #fff;
        padding-top: 16px;
        padding-bottom: 14px;
        padding-left: 22px;
        padding-right: 22px;
    }
    .btn {
        padding-top: 21px;
        padding-bottom: 21px;
        padding-left: 84px;
        padding-right: 84px;
        border-radius: 10px;
    }
    .sharingFriends {
        background-color: #53beb7;
        border-width: 2px;
        border-style: solid;
        border-color: #42b8b0;
    }
    .sharingFriends:active{
        background-color: #57aba5;
    }
    .sharingFriendsText {
        color: #fff;
    }
    .generatePictures {
        background-color: #fff;
        border-width: 2px;
        border-style: solid;
        border-color: #42b8b0;
    }
    .generatePictures:active{
        background-color: #f8f8f8;
    }
    .helpPeople {
        flex-direction: row;
    }
    .helpPeopleImgBox {
        width: 45px;
        height: 45px;
        border-radius: 30px;
        margin-left: 5px;
        margin-right: 5px;
    }
    .helpPeopleImg {
        width: 45px;
        height: 45px;
        border-radius: 30px;
    }
    /* 提示框 */
    .prompt {
        width: 250px;
        height: 250px;
        background-color: rgba(0,0,0,0.7);
        position: absolute;
        top: 480px;
        left: 250px;

        align-items: center;
        justify-content: center;
        border-radius: 12px;
    }
    .promptImg {
        width: 100px;
        height: 100px;
    }
    .promptText {
        color: #fff;
    }

</style>
