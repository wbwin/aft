<template>
    <div class="wrapper">
        <!-- 导航栏 -->

        <!--<div class="minibar">-->
            <!--<wxc-minibar-->
                    <!--background-color="#53beb7"-->
                    <!--text-color="#fff"-->
                    <!--@wxcMinibarLeftButtonClicked="minibarLeftButtonClick"-->
                    <!--@wxcMinibarRightButtonClicked="minibarRightButtonClick"-->
            <!--&gt;-->
                <!--<image :style="GLOBAL.headerImg"  slot="left"-->
                       <!--src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>-->
                <!--<text :style="GLOBAL.headerCenter"  slot="middle">{{ shopInfo.shopName }}</text>-->
                <!--<image class="backImg" slot="right"-->
                       <!--src="https://image.aftdc.com/appBimg/icon_add.png"></image>-->
            <!--</wxc-minibar>-->
        <!--</div>-->
        <div class="navigationBar aiCenter row">
            <div class="navigationLeft jcCenter" @click="minibarLeftButtonClick">
                <image class="navigationLeftIcon" :style="GLOBAL.headerImg" src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
            </div>
            <div class="navigationMiddle jcCenter aiCenter" >
                <text :style="GLOBAL.headerCenter">{{ shopInfo.shopName }}</text>
            </div>
            <div class="navigationRight aiCenter">
                <image class="navigationRightIcon" src="https://image.aftdc.com/appBimg/ic_more_head.png" @click="openBottomPopup"></image>
                <text class="white" :style="{fontSize:GLOBAL.biggerFS}" @click="privateLetter" v-if="!pullBlack">发私信</text>
            </div>
        </div>

        <scroller class="page"
                  v-bind:style="{padding:padding}">

            <div class="header"  >
                <!-- header个人信息 -->
                <div class="header">
                    <image class="banner" resize="cover" :src="'https://image.aftdc.com/'+shopInfo.shopImg"></image>
                    <div class="headerBottom">
                        <div class="follow row">
                            <div class="followBtn aiCenter jcCenter followBtnBlue" v-if="pullBlack" @click="relieveBlack">
                                <text class="blue" :style="{fontSize:GLOBAL.bigFS}">解除拉黑</text>
                            </div>
                            <div class="followBtn aiCenter jcCenter " @click="followToggle" :class="[follow?'unFollowBtn':'']" v-else>
                                <text class="white" :style="{fontSize:GLOBAL.bigFS}"  v-if="follow">已关注</text>
                                <text class="white" :style="{fontSize:GLOBAL.bigFS}" v-else>关注</text>
                            </div>
                        </div>
                        <div class="personalInfo">
                            <text class="personalName black">{{ shopInfo.shopName }}</text>
                            <div class="row aiCenter" v-if="shopInfo.certification==1">
                                <image class="authenticationIcon" src="https://image.aftdc.com/appBimg/ic_success_certification.png"></image>
                                <text class="personalInfoText black" :style="{fontSize:GLOBAL.bigFS}">认证:&nbsp;&nbsp;餐头条</text>
                            </div>
                            <text class="personalInfoText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{ shopInfo.acticleMood }}</text>
                            <div class="row aiCenter personalInfoText">
                                <text class="blue" :style="{fontSize:GLOBAL.biggerFS}" @click="toPersonalAttention">{{ shopInfo.attentionNum }}</text>
                                <text class="gray mr24" :style="{fontSize:GLOBAL.bigFS}" @click="toPersonalAttention">&nbsp;关注</text>
                                <text class="blue" :style="{fontSize:GLOBAL.biggerFS}">{{ shopInfo.fansNum }}</text>
                                <text class="gray" :style="{fontSize:GLOBAL.bigFS}">&nbsp;粉丝</text>
                                <text class="blue" :style="{fontSize:GLOBAL.biggerFS}"> 1 </text>
                                <text class="gray" :style="{fontSize:GLOBAL.bigFS}">&nbsp;动态</text>
                            </div>
                        </div>
                    </div>
                    <div class="userImgBox"  >
                        <image class="userImg"
                               :src="'https://image.aftdc.com/'+shopInfo.shopImg"></image>
                    </div>
                </div>
            </div>
            <div class="stickyHeader"  ref="footer">
                <div class="toggle row">
                    <div class="toggleBtn " :class="[sliderIndex == 0?'toggleBtnActive':'toggleBtnActiveWhite']"
                         @click="toggle(0)">
                        <text :class="[sliderIndex == 0?'toggleBtnTextActive':'']" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">全部文章</text>
                    </div>
                    <div class="toggleBtn" :class="[sliderIndex == 1?'toggleBtnActive':'toggleBtnActiveWhite']"
                         @click="toggle(1)">
                        <text :class="[sliderIndex == 1?'toggleBtnTextActive':'']" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">视频</text>
                    </div>
                </div>
            </div>
            <div class="cell">
                <!--文章与视频内容区-->
                <slider class="slider" infinite="false" :value="sliderIndex" :index="sliderIndex" keep-index="true" @change="sliderCharge">
                    <!-- 文章内容 -->
                    <!--<scroller class="sliderScroller" show-scrollbar="false">-->
                    <div class="piece" >
                        <div class="headLineContent" v-for="(item,index) in article" @click="toArticleContent" v-if="sliderIndex ==  0 || index < 4 ">
                            <div class="contentStyle" >
                                <div v-if="item.cover_type!=1">
                                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.title}}</text>
                                    <div class="coverImgStyle">
                                        <div class="threeImg" v-if="item.cover_type==3">
                                            <image class="threeImgSize"
                                                   :src="'https://image.aftdc.com/'+item.cover_img[0]"></image>
                                            <image class="threeImgSize"
                                                   :src="'https://image.aftdc.com/'+item.cover_img[1]"></image>
                                            <image class="threeImgSize"
                                                   :src="'https://image.aftdc.com/'+item.cover_img[2]"></image>
                                        </div>
                                        <div class="bigImg" v-if="item.cover_type==2">
                                            <image class="bigImgSize"
                                                   :src="'https://image.aftdc.com/'+item.cover_img[0]"></image>
                                        </div>
                                        <div class="videoImg" v-if="item.cover_type==5">
                                            <image class="bigImgSize"
                                                   :src="'https://image.aftdc.com/'+item.cover_img[0]"></image>
                                            <div class="videoPlay">
                                                <image class="videoPlayImg"
                                                       src="https://image.aftdc.com/appBimg/icon_vadeoPlay.png"></image>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="smallImgContent" v-if="item.cover_type==1">
                                    <text class="smallImgeText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.title}}</text>
                                    <image class="smallImgSize" :src="'https://image.aftdc.com/'+item.cover_img[0]"></image>
                                </div>
                                <div class="articleMessage">
                                    <div class="shopAnTime">
                                        <text class="shopAnTimeSize" :style="{fontSize:GLOBAL.smallFS}">{{shopInfo.shopName}}</text>
                                        <text class="shopAnTimeSize" :style="{fontSize:GLOBAL.smallFS}">{{item.read_num}}阅读</text>
                                        <text class="shopAnTimeSize" :style="{fontSize:GLOBAL.smallFS}">{{item.timestamp}}</text>
                                    </div>
                                    <!--<div class="articlePlace">-->
                                    <!--<text class="defaultSize shopAnTimeSize">{{item.city}}</text>-->
                                    <!--<text class="defaultSize placeSize">{{item.distance}}</text>-->
                                    <!--</div>-->
                                </div>
                            </div>
                        </div>

                    </div>
                    <!--</scroller>-->
                    <!-- 视频 -->
                    <!--<scroller class="sliderScroller" show-scrollbar="false">-->
                    <div class="aiCenter w750">
                        <div class="videoArea row ">
                            <div class="video" v-for="(item,index) in video" :class="[(index+1)%3 == 0?'mr0':'']">
                                <image class="videoCover"
                                       :src="'https://image.aftdc.com/'+item.cover_img"></image>
                                <div class="fabulous row">
                                    <image class="fabulousIcon" src="https://image.aftdc.com/appBimg/ic_good_video.png"></image>
                                    <text class="fabulousNumber white" :style="{fontSize:GLOBAL.defaultFS}">{{ item.praise_num }}</text>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--</scroller>-->
                </slider>
            </div>

        </scroller>
        <!-- 底部弹层 -->
        <wxc-popup popup-color="rgb(244, 244, 244)"
                   :show="isBottomShow"
                   @wxcPopupOverlayClicked="popupOverlayBottomClick"
                   pos="bottom"
                   :animation="ani"
                   height="640"
                   ref="wxcPopup">
            <div class="popup">
                <div class="popupTop row">
                    <div class="popupItem aiCenter">
                        <div class="popupItemIcon aiCenter jcCenter">
                            <image class="popupItemImgPyq" src="https://image.aftdc.com/appBimg/logo_weixin_friends.png"></image>
                        </div>
                        <text class="popupIteText">朋友圈</text>
                    </div>
                    <div class="popupItem aiCenter">
                        <div class="popupItemIcon aiCenter jcCenter">
                            <image class="popupItemImgWeixin" src="https://image.aftdc.com/appBimg/logo_weixin.png"></image>
                        </div>
                        <text class="popupIteText">微信好友</text>
                    </div>
                    <div class="popupItem aiCenter">
                        <div class="popupItemIcon aiCenter jcCenter">
                            <image class="popupItemImgQQ" src="https://image.aftdc.com/appBimg/logo_QQ.png"></image>
                        </div>
                        <text class="popupIteText">腾讯QQ</text>
                    </div>
                    <div class="popupItem aiCenter">
                        <div class="popupItemIcon aiCenter jcCenter">
                            <image class="popupItemImgKj" src="https://image.aftdc.com/appBimg/logo_QQ_zone.png"></image>
                        </div>
                        <text class="popupIteText">QQ空间</text>
                    </div>
                </div>
                <div class="popupButton row">
                    <div class="popupItem aiCenter mr54">
                        <div class="popupItemIcon aiCenter jcCenter">
                            <image class="popupItemImgReport" src="https://image.aftdc.com/appBimg/ic_report.png"></image>
                        </div>
                        <text class="popupIteText">举报</text>
                    </div>
                    <div class="popupItem aiCenter"  @click="relieveBlack('popupPullBlack')" v-if="pullBlack">
                        <div class="popupItemIcon aiCenter jcCenter">
                            <image class="popupItemImgPullBlack" src="https://image.aftdc.com/appBimg/ic_pullBlack_red.png"></image>
                        </div>
                        <text class="popupIteText" >取消拉黑</text>
                    </div>
                    <div class="popupItem aiCenter"  @click="openMask" v-else>
                        <div class="popupItemIcon aiCenter jcCenter">
                            <image class="popupItemImgPullBlack" src="https://image.aftdc.com/appBimg/ic_pullBlack_gray.png"></image>
                        </div>
                        <text class="popupIteText" >拉黑</text>
                    </div>

                </div>

                <div class="popupClose aiCenter" @click="orderTrackingclose">
                    <text class="black" :style="{fontSize:GLOBAL.bigFS}">取消</text>
                </div>
            </div>
        </wxc-popup>
        <!-- 拉黑弹出层 -->
        <wxc-mask height="396"
                  width="564"
                  border-radius="0"
                  duration="100"
                  mask-bg-color="#FFFFFF"
                  :has-animation="hasAnimation"
                  :has-overlay="true"
                  :show-close="false"
                  :show="show"
                  :overlay-cfg="overlay"
                  @wxcMaskSetHidden="wxcMaskSetHidden">
            <div class="mask" @click.stop="bubble">
                <text class="black" :style="{fontSize:GLOBAL.biggerFS}">确定拉黑该用户？</text>
                <text class="maskContent" :style="{fontSize:GLOBAL.bigFS}">拉黑后将不再推荐此用户的文章，此用户不能关注您，也无法给您发送任何信息</text>
                <div class="maskBtn row">
                    <text class="maskSure" :style="{fontSize:GLOBAL.bigFS}" @click="wxcMaskSetHidden">取消</text>
                    <text class="maskCancel" :style="{fontSize:GLOBAL.bigFS}" @click="determinePullBlack">确定</text>
                </div>
            </div>
        </wxc-mask>
        <!--<wxc-popover ref="wxc-popover"-->
                     <!--:buttons="btns"-->
                     <!--:position="popoverPosition"-->
                     <!--:arrowPosition="popoverArrowPosition"-->
                     <!--@wxcPopoverButtonClicked="popoverButtonClicked"></wxc-popover>-->
    </div>
</template>

<script>
    import { WxcPopup,WxcMask,WxcIcon,WxcMinibar,WxcPopover} from 'weex-ui';
    const modal = weex.requireModule('modal');
    const event = weex.requireModule('event');
    const post = weex.requireModule('stream');
    export default {
        data() {

            return {

                // 模板数据
                padding: 0,
                showHeader: true,

                // 底部弹层
                isBottomShow: false,
                ani:{
                    timingFunction: 'ease'
                },
                // 拉黑弹出层
                show: false,
                overlayCanClose: true,
                isFalse: false,
                hasAnimation: true,
                overlay: {
                    duration: 150
                },
                // slider索引值
                sliderIndex: 0,
                // 关注与拉黑
                follow: false,
                pullBlack: false,
                video: [],
                article: [],
                shopInfo: {
                    acticleMood: "",
                    attentionNum: 0,
                    certification: 1,
                    fansNum: 0,
                    shopImg: "",
                    shopName: ""
                },
                btns:[
                    { icon: 'https://image.aftdc.com/appBimg/icon_articlePicture.png', text:'图文' },
                    { icon: 'https://image.aftdc.com/appBimg/icon_articleVideo.png', text:'视频' },
                    { icon: 'https://image.aftdc.com/appBimg/icon_vote.png', text:'投票', },
                ],
                popoverPosition:{x:-16,y:50},
                popoverArrowPosition:{pos:'top',x:-14}
            }
        },
        components: { WxcPopup,WxcMask,WxcIcon,WxcMinibar,WxcPopover},

        created: function () {
            this.token = weex.config.token;
            this.imei = weex.config.imei;

            var param = this.GLOBAL.sign(this.token,this.imei);
            var that = this
            post.fetch({
                method: 'POST',
                type: 'json',
                body: param,
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                url: 'https://www.aftdc.com/businessapp/Article/shopArticle',
            }, function (e) {
                if (e.data.res == -2) {
                    //跳到登陆页面
                    that.GLOBAL.toLogin()
                } else {
                    if (e.data.res == 1) {
                        that.video = e.data.video;
                        that.article = e.data.article;
                        that.shopInfo = e.data.shopInfo
                    }
                }
            })
        },
        methods: {
            scrollToNext: function() {
                weex.requireModule('dom').scrollToElement(this.$refs.footer)
            },
            // 文章与视频的切换
            toggle(type){
                this.sliderIndex = type
                this.scrollToNext()
            },
            // 监听slider显示第几页
            sliderCharge(e){
                this.sliderIndex = e.index
                this.scrollToNext()
            },
            // 发私信
            privateLetter(){
                if(this.follow == true){
                    modal.toast({
                        message: '跳转页面'
                    })
                }else {
                    modal.toast({
                        message: '关注后才可发私信'
                    })
                }
            },
            // 点击关注
            followToggle(){
                this.follow = !this.follow
            },
            // 拉黑用户
            determinePullBlack(){
                this.show = false;
                this.follow = false
                this.pullBlack = true
                modal.toast({
                    message: '拉黑成功'
                })
            },
            wxcMaskSetHidden () {
                this.show = false;
            },
            // 解除用户黑名单
            relieveBlack(string){
                this.pullBlack = false
                modal.toast({
                    message: '已解除黑名单'
                })
            },
            // 底部弹层
            openBottomPopup () {
                this.isBottomShow = true;
            },
            orderTrackingclose () {
                this.$refs.wxcPopup.hide()
            },
            //非状态组件，需要在这里关闭
            popupOverlayBottomClick () {
                this.isBottomShow = false;
            },
            // 拉黑弹出层
            openMask (e) {
                this.isBottomShow = false
                this.show = true;
                this.hasAnimation = true;
            },
            openNoAnimationMask (e) {
                this.show = true;
                this.hasAnimation = false;
            },
            minibarLeftButtonClick() {
                navigator.pop()
            },
            minibarRightButtonClick () {
                this.$refs['wxc-popover'].wxcPopoverShow();
                console.log("fef")
            },
            popoverButtonClicked (obj) {
                if(obj.index==0){//图片
                    var url = 'http://assets/headLine.js'
                    event.toUrl({url:url,param:''});
                }else if(obj.index==1){//视频
                    var url = 'http://assets/headLine.js'
                    event.chooseVideo()
                }else if(obj.index==2){//投票
                    var url = 'http://assets/voteSetting.js'
                }
            },
            // 阻止拉黑弹出层冒泡事件
            bubble(){},
            toArticleContent(){
                var param='';
                var url='http://assets/articleContent.js';
                event.toUrl({"url":url,"param":param})
            },
            toPersonalAttention(){
                var param='';
                var url='http://assets/personalAttention.js';
                event.toUrl({"url":url,"param":param})
            },
        }
    }
</script>


<style>
    .cell {
        width: 750px;

    }


    .page {
        background-color: #EFEFEF;
        margin-top: 90px;
    }
    .banner {
        height: 377px;
        flex-direction: row;
    }

    .stickyHeader {
        position: sticky;
        height: 94px;
        flex-direction: row;
    }


    .wrapper {

    }
    /* 公共样式 */
    .black {
        color: #2b2b2b;
    }
    .white {
        color: #fff;
    }
    .gray {
        color: #b9b9b9;
    }
    .blue {
        color: #43689b;
    }
    .row {
        flex-direction: row;
    }
    .aiCenter {
        align-items: center;
    }
    .jcCenter {
        justify-content: center;
    }
    .mr24 {
        margin-right: 24px;
    }
    .w750 {
        width: 750px;
    }
    /* 导航栏 */
    /* 导航栏 */
    .navigationBar {
        width: 750px;
        height: 90px;
        background-color: #53beb7;
        position: fixed;
        top: 0;
        left: 0;

    }
    .navigationLeft {
        flex: 1;
    }
    .navigationLeftIcon {
        margin-left: 32px;
    }
    .navigationMiddle {
        flex: 1;
    }
    .navigationRight {
        flex-direction: row-reverse;
        width: 50px;
        flex: 1;
    }
    .navigationRightIcon {
        width: 50px;
        height: 50px;
        margin-left: 30px;
        margin-right: 30px;
    }

    /* header个人信息 */
    .header {
        position: relative;
    }
    .banner {
        width: 750px;
        height: 200px;
    }
    .headerBottom {
        width: 750px;
        background-color: #fff;
        padding-bottom: 10px;
    }
    .userImgBox {
        border-radius: 100px;
        position: absolute;
        top: 110px;
        left: 30px;
    }
    .userImg {
        width: 170px;
        height: 170px;
        border-radius: 100px;
    }
    .follow {
        height: 90px;
        align-items: flex-end;
        justify-content: flex-end;
    }
    .followBtn {
        width: 150px;
        height: 60px;
        margin-right: 30px;
        background-color: #ff4500;
        border-radius: 8px;
    }
    .followBtnBlue {
        background-color: white;
        border-width: 2px;
        border-style: solid;
        border-color: #406599;
    }
    .unFollowBtn {
        background-color: #53beb7;
        border-width: 2px;
        border-style: solid;
        border-color: #53beb7;
    }
    .personalInfo {
        padding-left: 30px;
        padding-right: 30px;
    }
    .personalName {
        font-size: 36px;
        font-weight: 600;
        padding-top: 10px;
        padding-bottom: 10px;
    }
    .authenticationIcon {
        width: 27px;
        height: 27px;
        margin-right: 10px;
    }
    .personalInfoText {
        padding-top: 8px;
        padding-bottom: 8px;
    }
    /* 文章与视频切换按钮 */
    .toggle {
        width: 750px;
        background-color: #fff;
        border-top-width: 2px;
        border-top-style: solid;
        border-top-color: #ededed;
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #ededed;
        padding-left: 30px;
    }
    .toggleBtn {
        padding-top: 28px;
        padding-bottom: 28px;
        margin-right: 64px;
    }
    .toggleBtnActive {
        border-bottom-width: 4px;
        border-bottom-style: solid;
        border-bottom-color: #53beb7;
    }
    .toggleBtnTextActive {
        color:  #53beb7;
    }
    .toggleBtnActiveWhite {
        border-bottom-width: 4px;
        border-bottom-style: solid;
        border-bottom-color: #fff;
    }
    /* 文章与视频 */
    .slider {
        width: 750px;
        flex-direction: row;
        /*flex: 1;*/
    }
    .sliderScroller {
        width: 750px;
        flex: 1;
    }
    .videoArea {
        width: 746px;
        flex-wrap: wrap;
    }
    /* 视频样式 */
    .video {
        width: 247px;
        height: 330px;
        background-color: #50514d;
        margin-right: 2px;
        margin-bottom: 2px;
    }
    .videoCover {
        width: 248px;
        height: 330px;
    }
    .mr0 {
        margin-right: 0;
    }
    .fabulous {
        height: 30px;
        position: absolute;
        left: 23px;
        bottom: 23px;
    }
    .fabulousIcon {
        width: 30px;
        height: 30px;
    }
    .fabulousNumber {
        padding-left: 10px;
        padding-top: 3px;
    }

    /* 文章样式 */
    .piece {

        background-color: #ffffff;
        width: 750px;
        /*padding: 30px;*/
    }
    .headLineContent {
        flex-direction: column;
        padding-left: 30px;
        padding-right: 30px;
        padding-top: 30px;

    }
    .contentStyle {
        flex-direction: column;
        padding-bottom: 20px;
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #f1f1f1;
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
    .shopAnTimeSize {
        color: #999;
        margin-right: 10px;
    }
    .coverImgStyle {
        margin-top: 15px;
        margin-bottom: 15px;
    }
    .articlePlace {
        flex-direction: row;
        align-items: center;
    }
    .placeSize {
        font-size: 25px;
        color: #999;
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
    .smallImgSize{
        width: 220px;
        height: 165px;
    }
    /* 底部弹层 */
    .popup {
        flex: 1;
        position: relative;
    }
    .popupTop {
        padding-top: 50px;
        padding-bottom: 56px;
        margin-left: 46px;
        margin-right: 46px;
        justify-content: space-between;
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #eaeaea;
    }
    .popupItem {
        /*margin-right: 46px;*/
    }
    .popupItemIcon {
        width: 125px;
        height: 125px;
        background-color: #fff;
        border-radius: 100px;
    }
    .popupItemImgPyq {
        width: 64px;
        height: 64px;
    }
    .popupItemImgWeixin {
        width: 67px;
        height: 54px;
    }
    .popupItemImgQQ {
        width: 57px;
        height: 67px;
    }
    .popupItemImgKj {
        width: 64px;
        height: 64px;
    }
    .popupItemImgReport {
        width: 52px;
        height: 54px;
    }
    .popupItemImgPullBlack {
        width: 44px;
        height: 56px;
    }
    .popupIteText {
        padding-top: 18px;
        font-size: 22px;
    }
    .popupButton {
        padding-top: 28px;
        margin-left: 46px;
    }
    .mr54 {
        margin-right: 54px;
    }
    .popupClose {
        width: 750px;
        background-color: #f7f7f7;
        padding-top: 34px;
        padding-bottom: 34px;
        border-top-width: 2px;
        border-top-style: solid;
        border-top-color: #eaeaea;
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #eaeaea;
        position: absolute;
        bottom: 0;
    }
    /*拉黑弹出层 */
    .mask {
        flex: 1;
        position: relative;
        padding-top: 46px;
        padding-left: 50px;
    }
    .maskContent {
        width: 440px;
        color: #898989;
        padding-top: 40px;

    }
    .maskBtn {
        position: absolute;
        right: 40px;
        bottom: 38px;
    }
    .maskSure {
        color: #097ed1;
        margin-right: 56px;
    }
    .maskCancel {
        color: #097ed1;
    }
</style>


