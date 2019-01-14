<template>
    <div class="wrapper">


        <!-- 导航栏 -->
        <div>
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    @wxcMinibarRightButtonClicked="minibarRightButtonClick"
                    v-once
            >
                <image :style="GLOBAL.headerImg" slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter" slot="middle">个人主页</text>
                <image class="backImg" slot="right"
                       src="https://image.aftdc.com/appBimg/icon_add.png"></image>
            </wxc-minibar>
        </div>


        <list class="page" v-bind:style="{padding:padding}" offset-accuracy="30" @scroll="onscroll">
            <refresh class="refresh" @refresh="refresh" :display="refreshing ? 'show' : 'hide'">
                <loading-indicator class="indicator"></loading-indicator>
            </refresh>

            <cell class="header">
                <!-- header个人信息 -->
                <div class="headerBottom">

                    <div class="personalInfo">
                        <div style="flex-direction: row;padding-top: 20px;padding-bottom: 20px">
                            <div class="userImgBox">
                                <image class="userImg"
                                       :src="userInfo.userPhoto"></image>
                            </div>
                            <div style="flex: 2.5">
                                <text class="personalName" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">{{userInfo.userName }}</text>
                                <div class="row aiCenter" v-if="userInfo.certification==1">
                                    <div class="authenticationIcon">
                                        <image class="authenticationIcon"
                                               src="https://image.aftdc.com/images/daV.png"></image>
                                    </div>
                                    <!--<text class="personalInfoText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">认证: {{userInfo.shopName}}官方餐头条号</text>-->
                                </div>
                                <div class="row">
                                    <div class="authenticationIcon" style="border-radius: 0;margin-top: 10px">
                                        <image class="authenticationIcon" style="border-radius: 0;"
                                               src="https://image.aftdc.com/appBimg/icon_leaveWord.png"></image>
                                    </div>
                                    <text class="personalInfoText" :style="{fontSize:GLOBAL.bigFS,color:userInfo.acticleMood==null||''?'#999':GLOBAL.dColor}" style="width: 480px" @click="editMood">签名: {{userInfo.acticleMood==null||''?'这个人很懒，什么都没留下':userInfo.acticleMood }}</text>
                                </div>
                            </div>
                        </div>


                        <div class="row aiCenter personalInfoText">
                            <div class="row aiCenter mr24" @click="attentionFans">
                                <text class="blue" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.tColor}">{{userInfo.attentionNum}}</text>
                                <text class="gray" :style="{fontSize:GLOBAL.bigFS}">&nbsp;关注</text>
                            </div>
                            <div class="row aiCenter mr24" @click="attentionFans">
                                <text class="blue" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.tColor}">{{userInfo.fansNum }}</text>
                                <text class="gray" :style="{fontSize:GLOBAL.bigFS}">&nbsp;粉丝</text>
                            </div>
                        </div>
                    </div>
                </div>
            </cell>
            <cell class="stickyHeader" ref="footer">
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
            </cell>
            <cell class="cell" ref="topTast">
                <!--文章与视频内容区-->
                <slider class="slider" infinite="false" :value="sliderIndex" :index="sliderIndex" keep-index="true"
                        @change="sliderCharge" :style="{minHeight: minHeight-184+'px'}">
                    <!-- 文章内容 -->
                    <!--<scroller class="sliderScroller" show-scrollbar="false">-->
                    <div class="piece" :style="{height:sliderIndex===1?minHeight-184+'px':''}">
                        <!--<div class="headLineContent" v-for="(item,index) in article" v-if="sliderIndex ==  0 || index < 2 ">-->
                        <div v-if="article.length>0">
                            <div class="headLineContent" v-for="(item,index) in article" :key="index" @click="previewClick(index)">
                                <div class="contentStyle">
                                    <div v-if="item.cover_type!=1">
                                        <text :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">{{item.title}}</text>
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
                                        <text class="smallImgeText" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">{{item.title}}</text>
                                        <image class="smallImgSize" :src="'https://image.aftdc.com/'+item.cover_img[0]"></image>
                                    </div>
                                    <div class="articleMessage row aiCenter">
                                        <div class="shopAnTime">
                                            <text class="shopAnTimeSize" :style="{fontSize:GLOBAL.defaultFS}">{{item.shopName}}</text>
                                            <text class="shopAnTimeSize" :style="{fontSize:GLOBAL.defaultFS}">{{item.read_num}}阅读</text>
                                            <text class="shopAnTimeSize" :style="{fontSize:GLOBAL.defaultFS}">{{item.timestamp}}</text>
                                            <!--当接口的数据 article 里面加上settop 等于0 或1,用v-if判断上面的text组件,当settop为0时显示,为1时隐藏-->
                                        </div>
                                        <!--<div class="articlePlace">-->
                                        <!--<text class="defaultSize shopAnTimeSize">{{item.city}}</text>-->
                                        <!--<text class="defaultSize placeSize">{{item.distance}}</text>-->
                                        <!--</div>-->
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div class="body-wxc" v-else>
                            <image class="bodyImage" src="https://image.aftdc.com/appBimg/icon_no_order.png"></image>
                            <text class="noOrder" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">暂无文章</text>
                            <!--<text class="lookAround" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.tColor}">随便逛逛</text>-->
                        </div>
                    </div>
                    <!--</scroller>-->
                    <!-- 视频 -->
                    <!--<scroller class="sliderScroller" show-scrollbar="false">-->
                    <div class="aiCenter w750" :style="{height:sliderIndex===0?minHeight-184+'px':''}">

                        <div class="videoArea row " v-if="video.length>0">
                            <div class="video" v-for="(item,index) in video" :class="[(index+1)%3 == 0?'mr0':'']">
                                <image class="videoCover"
                                       :src="'https://image.aftdc.com/'+item.cover_img"></image>
                                <div class="videoblackBg"></div>
                                <div class="fabulous row">
                                    <image class="fabulousIcon"
                                           src="https://image.aftdc.com/appBimg/ic_good_video.png"></image>
                                    <text class="fabulousNumber white" :style="{fontSize:GLOBAL.defaultFS}">{{item.praise_num }}</text>
                                </div>
                                <div class="videoDianIcon" @click.stop="videoDianIconClick(index,item.id)">
                                    <image class="videoDianIconImg"
                                           src="https://image.aftdc.com/appBimg/ic_more_user.png"></image>
                                </div>
                                <div class="noPass">
                                    <text class="noPassText" :style="{fontSize:GLOBAL.defaultFS}" v-if="item.open==0">草稿</text>
                                    <text class="noPassText" :style="{fontSize:GLOBAL.defaultFS}" v-else-if="item.isCheck==0">审核中</text>
                                    <text class="noPassText" :style="{fontSize:GLOBAL.defaultFS}" @click="auditReasonsShowClick(item.checkResult)" v-else-if="item.isCheck==1&&item.isShow==0">审核失败
                                    </text>
                                    <text class="noPassText" :style="{fontSize:GLOBAL.defaultFS}" v-else-if="item.top>0">置顶</text>
                                </div>
                                <!--气泡菜单-->

                                <!--<div class="videoDianBigDiv" ref="videoDianTast">-->
                                <!--<div class="videoJiaoDiv"></div>-->
                                <!--<div class="videoDianIconFlex ">-->
                                <!--<text class="videoDianIconFlexText videoBorBtn"  :style="{fontSize:GLOBAL.defaultFS}" @click="" v-if="item.isCheck==1&&item.open==1">帮我加油</text>-->
                                <!--<text class="videoDianIconFlexText videoBorBtn"  :style="{fontSize:GLOBAL.defaultFS,flex:item.top==0?1:1.6}" @click="settopClick(index)" v-if="item.open==1&&item.isShow==1">{{item.top==0?'置顶':'取消置顶'}}</text>-->
                                <!--&lt;!&ndash;当接口的数据 article 里面加上settop 等于0 或1,用v-if判断上面的text组件,当settop为0时显示,为1时隐藏,js事件还没有写,需要您补充&ndash;&gt;-->
                                <!--&lt;!&ndash;<text class="videoDianIconFlexText videoBorBtn"  :style="{fontSize:GLOBAL.defaultFS,}" @click="editClick(index)">编辑</text>&ndash;&gt;-->
                                <!--&lt;!&ndash;<text class="videoDianIconFlexText videoBorBtn"  :style="{fontSize:GLOBAL.defaultFS,}" @click="previewClick(index)">预览</text>&ndash;&gt;-->
                                <!--<text class="videoDianIconFlexText"  :style="{fontSize:GLOBAL.defaultFS,color:'red'}" @click="delClick(index,2)">删除</text>-->
                                <!--</div>-->

                                <!--<div class="videoJiaoDivTwo"></div>-->
                                <!--</div>-->
                            </div>
                        </div>
                        <div class="body-wxc" v-else>
                            <image class="bodyImage" src="https://image.aftdc.com/appBimg/icon_no_order.png"></image>
                            <text class="noOrder" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">暂无视频</text>
                            <!--<text class="lookAround" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.tColor}">随便逛逛</text>-->
                        </div>
                    </div>
                    <!--</scroller>-->
                </slider>
            </cell>
            <loading class="loading" @loading="loadmore" :display="loadinging ? 'show' : 'hide'">
                <text class="indicator-text">{{loadText}}</text>
            </loading>
        </list>


        <!--是否确认置顶提示框-->
        <!--<wxc-mask height="240"-->
        <!--width="600"-->
        <!--border-radius="10"-->
        <!--duration="200"-->
        <!--mask-bg-color="#FFFFFF"-->
        <!--:has-animation="true"-->
        <!--:has-overlay="true"-->
        <!--:show-close="false"-->
        <!--:show="settopShow"-->
        <!--@wxcMaskSetHidden="wxcMaskSetHidden">-->
        <!--<div class="dianDelDiv" @click="">-->
        <!--<text class="dianDelTips" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">提示</text>-->
        <!--<text class="dianDelDetails" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{articleOrVideo==0?topYes==0?'是否置顶该文章':'是否取消置顶该文章':videoTopYes==0?'是否置顶该视频':'是否取消置顶该视频'}}</text>-->
        <!--<div class="dianDelBtn row aiCenter">-->
        <!--<text style="flex: 1;"></text>-->
        <!--<text class="dianDelBtnCancel" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}" @click="settopCancelClick">否</text>-->
        <!--<text class="dianDelBtnCancel" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}"  @click="settopConfirmClick()">是</text>-->
        <!--</div>-->
        <!--</div>-->
        <!--</wxc-mask>-->


        <!--是否确认删除文章提示框-->
        <!--<wxc-mask height="240"-->
        <!--width="600"-->
        <!--border-radius="10"-->
        <!--duration="200"-->
        <!--mask-bg-color="#FFFFFF"-->
        <!--:has-animation="true"-->
        <!--:has-overlay="true"-->
        <!--:show-close="false"-->
        <!--:show="confirmShow"-->
        <!--@wxcMaskSetHidden="wxcMaskSetHidden">-->
        <!--<div class="dianDelDiv" @click="">-->
        <!--<text class="dianDelTips" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">提示</text>-->
        <!--<text class="dianDelDetails" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{articleOrVideo==0?'是否删除该文章':'是否删除该视频'}}</text>-->
        <!--<div class="dianDelBtn row aiCenter">-->
        <!--<text style="flex: 1;"></text>-->
        <!--<text class="dianDelBtnCancel" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}" @click="dianDelBtnCancelClick">否</text>-->
        <!--<text class="dianDelBtnCancel" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}" @click="dianDelBtnConfirmClick()">是</text>-->
        <!--</div>-->
        <!--</div>-->
        <!--</wxc-mask>-->
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
                <text class="maskTitle fontSize36 attention">确定拉黑该用户？</text>
                <text class="maskContent" :style="{fontSize:GLOBAL.bigFS}">拉黑后将不再推荐此用户的文章，此用户不能关注您，也无法给您发送任何信息</text>
                <div class="maskBtn row">
                    <text class="maskSure" @click="wxcMaskSetHidden" :style="{fontSize:GLOBAL.biggerFS}">取消</text>
                    <text class="maskCancel" @click="determinePullBlack" :style="{fontSize:GLOBAL.biggerFS}">确定</text>
                </div>
            </div>
        </wxc-mask>
        <!--审核失败原因提示框-->
        <wxc-mask height="300"
                  width="600"
                  border-radius="10"
                  duration="200"
                  mask-bg-color="#FFFFFF"
                  :has-animation="true"
                  :has-overlay="true"
                  :show-close="false"
                  :show="auditReasonsShow"
                  @wxcMaskSetHidden="wxcMaskSetHiddenOne">
            <div class="auditReasons" @click="">
                <text class="auditReasonsTitle" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">审核失败原因</text>
                <text class="auditReasonsDetails" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{checkResult}}</text>
                <text class="auditReasonsSureButton" @click="auditReasonsSureButtonClick" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor}">确定</text>
            </div>
        </wxc-mask>

        <!--头部的加号弹层-->
        <wxc-popover ref="wxc-popover"
                     :buttons="btns"
                     :position="popoverPosition"
                     :arrowPosition="popoverArrowPosition"
                     :textStyle="style"
                     @wxcPopoverButtonClicked="popoverButtonClicked">

        </wxc-popover>


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
                            <image class="popupItemImgPyq"
                                   src="https://image.aftdc.com/appBimg/logo_weixin_friends.png"></image>
                        </div>
                        <text class="popupIteText">朋友圈</text>
                    </div>
                    <div class="popupItem aiCenter">
                        <div class="popupItemIcon aiCenter jcCenter">
                            <image class="popupItemImgWeixin"
                                   src="https://image.aftdc.com/appBimg/logo_weixin.png"></image>
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
                            <image class="popupItemImgKj"
                                   src="https://image.aftdc.com/appBimg/logo_QQ_zone.png"></image>
                        </div>
                        <text class="popupIteText">QQ空间</text>
                    </div>
                </div>
                <div class="popupButton row">
                    <div class="popupItem aiCenter mr54">
                        <div class="popupItemIcon aiCenter jcCenter">
                            <image class="popupItemImgReport"
                                   src="https://image.aftdc.com/appBimg/ic_report.png"></image>
                        </div>
                        <text class="popupIteText">举报</text>
                    </div>
                    <div class="popupItem aiCenter" @click="relieveBlack('popupPullBlack')" v-if="black">
                        <div class="popupItemIcon aiCenter jcCenter">
                            <image class="popupItemImgPullBlack"
                                   src="https://image.aftdc.com/appBimg/ic_pullBlack_red.png"></image>
                        </div>
                        <text class="popupIteText">取消拉黑</text>
                    </div>
                    <div class="popupItem aiCenter" @click="openMask" v-else>
                        <div class="popupItemIcon aiCenter jcCenter">
                            <image class="popupItemImgPullBlack"
                                   src="https://image.aftdc.com/appBimg/ic_pullBlack_gray.png"></image>
                        </div>
                        <text class="popupIteText">拉黑</text>
                    </div>

                </div>

                <div class="popupClose aiCenter" @click="orderTrackingclose">
                    <text class="fontSize36">取消</text>
                </div>
            </div>
        </wxc-popup>
        <toast ref="toast"></toast>
    </div>
</template>

<script>
    import {WxcPopup, WxcMask, WxcIcon, WxcMinibar, WxcPopover} from 'weex-ui';
    import Toast from './Toast.vue';

    const modal = weex.requireModule('modal')
    const event = weex.requireModule('event');
    const post = weex.requireModule('stream');
    const navigator = weex.requireModule('navigator');
    const dom = weex.requireModule('dom');
    export default {
        components: {WxcPopup, WxcMask, WxcIcon, WxcMinibar, WxcPopover, Toast},
        data() {
            return {

                popoverPosition: {x: -16, y: 50},
                popoverArrowPosition: {pos: 'top', x: -14},
                btns: [
                    { text: '发私信    '},
                    { text: ''},
                    { text: '关注',},
                ],
                style:{
                    fontSize:'26px',
                    color:'#666',
                    fontWeight:'bold',
                },

                minHeight: 0,//给slider高度一个最小值
                loadText: '加载中 ...',
                confirmShow: false,
                auditReasonsShow: false,
                loadinging: false,
                checkResult: '',
                allArticle: false,


                padding: 0,
                touchs: false,
                refreshing: false,
                // 底部弹层
                isBottomShow: false,
                ani: {
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
                attention: 0,
                black: 0,
                video: [],
                article: [],
                // 主页信息
                userInfo: {
                    userName: '',
                    userPhoto: '',
                    acticleMood: '',
                    fansNum: '',
                    certification: '',
                    attentionNum: '',
                    dongTai: '0',
                },
                userName: ''
            }
        },
        created: function () {
            // var a = {
            //     "id": 150213,
            //     "title": "子弹短信能够火爆的原因并非全部是因为其“高效”,更多是源自微信态",
            //     "timestamp": "3天前",
            //     "cover_type": 2,
            //     "cover_img": ["shops/1020451/articleImg/1535500530000.jpg"],
            //     "read_num": 2,
            //     "praise_num": 0,
            //     "shopName": "芦蜜欧—茶饮•炸鸡•汉堡",
            //     "key_word": ["子弹"],
            //     "top": 0,
            //     "isCheck": 1,
            //     "isShow": 1,
            //     "open": 1,
            //     "checkResult": null
            // };
            //
            // this.article.push(a);
            // console.log(this.article);
            this.token = weex.config.token;
            this.imei = weex.config.imei;
            this.userId = JSON.parse(weex.config.param).userId;
            // this.userId = 1330016;
            var param = this.GLOBAL.sign(this.token, this.imei);
            param += '&userId=' + this.userId;
            console.log(param);
            var that = this;
            post.fetch({
                method: 'POST',
                type: 'json',
                body: param,
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                url: 'https://www.aftdc.com/businessapp/Article/userArticle',
            }, function (e) {
                console.log(e)
                if (e.data.res == 1) {
                    that.video = e.data.video;
                    that.article = e.data.article;
                    that.userInfo = e.data.userInfo
                    // 判断登录者(me)是否关注了作者(userInfo)
                    that.attention = e.data.attention
                    that.black = e.data.black

                }
                if (that.black) {
                    that.btns[1].text = '取消拉黑'
                }
                else {
                    that.btns[1].text = '拉黑        '
                }
                if (that.attention) {
                    that.btns[2].text = '取消关注'
                }
                else {
                    that.btns[2].text = '关注'
                }
            })
        },
        methods: {
            loadmore() {

                var that = this;
                var param = that.GLOBAL.sign(that.token, that.imei);
                that.loadinging = true;

                if (that.sliderIndex == 0) {
                    if (!that.allArticle) {
                        this.loadText = '加载中 ...';
                        param += '&userId=' + this.userId;
                        post.fetch({
                            method: 'POST',
                            type: 'json',
                            body: param,
                            headers: {"Content-Type": "application/x-www-form-urlencoded"},
                            url: 'https://www.aftdc.com/businessapp/Article/userArticle',
                        }, function (res) {
                            console.log(res)
                            if (res.data.res == 1) {
                                that.video = res.data.video;
                                // that.article = res.data.article;
                                that.userInfo = res.data.userInfo
                                // 判断登录者(me)是否关注了作者(userInfo)
                                that.attention = res.data.attention
                                that.black = res.data.black

                            }
                        })
                    } else {
                        setTimeout(() => {
                            this.loadinging = false
                        }, 1000);
                        this.allArticle = true
                        this.loadText = '我是有底线的'
                    }
                }

                if (that.sliderIndex == 1) {
                    // 视频加载未写
                }
            },
            popoverButtonClicked(obj) {
                var that = this;
                const toast = this.$refs.toast;
                if (obj.index == 0) {//发私信
                    if (this.attention == 1) {
                        var userId = this.userInfo.userId;
                        var userName = this.userInfo.userName;
                        var userPhoto = this.userInfo.userPhoto;
                        var param = {userId: userId, userName: userName, userPhoto: userPhoto};
                        var url = 'http://assets/chat.js';
                        event.toUrl({url: url, param: JSON.stringify(param)});
                    } else {
                        toast.editContent("关注后才可发私信");
                    }
                } else if (obj.index == 1) {//拉黑用户
                    if (that.black) {
                        // if (!this.touchs) {
                        //     this.touchs = true;
                        this.defriend(0);
                        // }
                    }
                    else if(!that.black){
                        that.isBottomShow = false;
                        that.show = true;
                        that.hasAnimation = true;
                    }
                } else if (obj.index == 2) {//关注
                    // if (!this.touch) {
                    //     this.touch = true
                    const toast = this.$refs.toast;


                    var param = this.GLOBAL.sign(this.token, this.imei);
                    param += '&userId=' + this.userId + '&attention=' + this.attention;
                    var that = this
                    post.fetch({
                        method: 'POST',
                        type: 'json',
                        body: param,
                        headers: {"Content-Type": "application/x-www-form-urlencoded"},
                        url: 'https://www.aftdc.com/businessapp/Membership/attention'
                    }, function (e) {
                        if (e.data.res == -2) {
                            //跳到登陆页面
                            that.GLOBAL.toLogin()
                        } else if (e.data.res == 1) {
                            if (that.attention == 0) {
                                that.userInfo.fansNum++
                                that.attention = 1;
                                that.btns[2].text='取消关注'
                                toast.editContent("关注成功");
                            } else {
                                that.userInfo.fansNum--
                                that.attention = 0;
                                that.btns[2].text='关注'
                                toast.editContent("已取消关注");
                            }
                        }else{
                            toast.editContent("出错啦。。。");
                        }

                    })
                    // }
                }
            },

            //拉黑
            defriend(black) {
                var that=this
                var param = this.GLOBAL.sign(this.token, this.imei);
                param += '&userId=' + this.userId + '&black=' + black;
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    url: 'https://www.aftdc.com/businessapp/Membership/black',
                }, function (e) {
                    if (e.data.res == -2) {
                        //跳到登陆页面
                        that.GLOBAL.toLogin()
                    } else if(e.data.res == 1) {
                        if(black==1){
                            that.btns[1].text = '取消拉黑'
                            that.black = 1;
                            const toast = that.$refs.toast;
                            toast.editContent("拉黑成功");
                            // that.touchs = false
                        }else{
                            that.black = 0;
                            that.btns[1].text = '拉黑        ';
                            const toast = that.$refs.toast;
                            toast.editContent("已解除黑名单");
                        }

                    }else{
                        const toast = that.$refs.toast;
                        toast.editContent("出错啦。。。");
                    }
                })
            },

            //刷新数据
            refresh() {
                // var a = {
                //     "id": 150213,
                //     "title": "子弹短信能够火爆的原因并非全部是因为其“高效”,更多是源自微信态",
                //     "timestamp": "3天前",
                //     "cover_type": 2,
                //     "cover_img": ["shops/1020451/articleImg/1535500530000.jpg"],
                //     "read_num": 2,
                //     "praise_num": 0,
                //     "shopName": "芦蜜欧—茶饮•炸鸡•汉堡",
                //     "key_word": ["子弹"],
                //     "top": 0,
                //     "isCheck": 1,
                //     "isShow": 1,
                //     "open": 1,
                //     "checkResult": null
                // };
                //
                // this.article.push(a);
                // console.log(this.article);
                this.token = weex.config.token;
                this.imei = weex.config.imei;
                this.userId = JSON.parse(weex.config.param).userId;
                // this.userId = 1330016;
                var param = this.GLOBAL.sign(this.token, this.imei);
                param += '&userId=' + this.userId;
                console.log(param);
                var that = this
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    url: 'https://www.aftdc.com/businessapp/Article/userArticle',
                }, function (e) {
                    console.log(e)
                    if (e.data.res == 1) {
                        that.video = e.data.video;
                        // that.article = e.data.article;
                        that.userInfo = e.data.userInfo
                        // 判断登录者(me)是否关注了作者(userInfo)
                        that.attention = e.data.attention
                        that.black = e.data.black

                    }
                })
            },
            //编辑文章心情
            editMood() {
                event.editText(0, this.userInfo.acticleMood, 100, '不能超过100字');
            },
            //查看粉丝
            attentionFans() {
                var url = 'http://assets/attentionFans.js'
                event.toUrl({url: url, param: ''});
            },
            auditReasonsShowClick(checkResult) {
                this.auditReasonsShow = true
                this.checkResult = checkResult
            },

            minibarLeftButtonClick() {
                navigator.pop()
            },
            // 发私信
            privateLetter() {
                if (this.attention == 1) {
                    var userId = this.userInfo.userId;
                    var userName = this.userInfo.userName;
                    var userPhoto = this.userInfo.userPhoto;
                    var param = {userId: userId, userName: userName, userPhoto: userPhoto};
                    var url = 'http://assets/chat.js';
                    event.toUrl({url: url, param: JSON.stringify(param)});
                } else {
                    const toast = this.$refs.toast;
                    toast.editContent("关注后才可发私信");
                }
            },
            previewClick(index){
                var that=this
                var param = {
                    articleId: that.article[index].id
                }
                var url = 'http://assets/seeArticle.js'
                event.toUrl({url: url, param: JSON.stringify(param)});

            },
            minibarRightButtonClick() {
                // if(this.attention == 1){
                //     var userId = this.userInfo.userId;
                //     var userName = this.userInfo.userName;
                //     var userPhoto = this.userInfo.userPhoto;
                //     var param = {userId:userId,userName:userName,userPhoto:userPhoto};
                //     var url = 'http://assets/chat.js';
                //     event.toUrl({url:url,param:JSON.stringify(param)});
                // }else {
                //     modal.toast({
                //         message: '关注后才可发私信'
                //     })
                // }
                this.$refs['wxc-popover'].wxcPopoverShow();
            },
            // 点击关注
            // followToggle() {
            //     if (!this.touch) {
            //         this.touch = true
            //         if (this.attention == 0) {
            //             this.userInfo.fansNum++
            //             this.attention = 1
            //         } else {
            //             this.userInfo.fansNum--
            //             this.attention = 0
            //         }
            //
            //         var param = this.GLOBAL.sign(this.token, this.imei);
            //         param += '&userId=' + this.userId + '&attention=' + this.attention;
            //         var that = this
            //         post.fetch({
            //             method: 'POST',
            //             type: 'json',
            //             body: param,
            //             headers: {"Content-Type": "application/x-www-form-urlencoded"},
            //             url: 'https://www.aftdc.com/businessapp/Membership/attention'
            //         }, function (e) {
            //             if (e.data.res == -2) {
            //                 //跳到登陆页面
            //                 that.GLOBAL.toLogin()
            //             } else {
            //                 if (e.data.res == 1) {
            //                     that.touch = false
            //                 }
            //             }
            //         })
            //     }
            // },
            // 拉黑用户
            determinePullBlack() {
                // if (!this.touchs) {
                //     this.touchs = true

                this.show = false;
                this.defriend(1);
                // }
            },
            // 解除用户黑名单
            relieveBlack(string) {
                // // if (!this.touchs) {
                // //     this.touchs = true
                //
                // this.black = 0
                // modal.toast({
                //     message: '已解除黑名单'
                // })
                // if (string == 'popupPullBlack') {
                //     this.$refs.wxcPopup.hide()
                // }
                // this.defriend(0)
                // // }
            },
            // 阻止拉黑弹出层冒泡事件
            bubble() {
            },
            //拉黑
            // defriend(black) {
            //     var param = this.GLOBAL.sign(this.token, this.imei);
            //     param += '&userId=' + this.userId + '&black=' + black;
            //     var that = this
            //     post.fetch({
            //         method: 'POST',
            //         type: 'json',
            //         body: param,
            //         headers: {"Content-Type": "application/x-www-form-urlencoded"},
            //         url: 'https://www.aftdc.com/businessapp/Membership/black',
            //     }, function (e) {
            //         if (e.data.res == -2) {
            //             //跳到登陆页面
            //             that.GLOBAL.toLogin()
            //         } else {
            //             if (e.data.res == 1) {
            //                 that.touchs = false
            //             }
            //         }
            //     })
            // },

            // 监听slider显示第几页
            sliderCharge(e) {
                this.sliderIndex = e.index
            },
            // 文章与视频的切换
            toggle(type) {
                this.sliderIndex = type
            },
            // 底部弹层
            openBottomPopup() {
                this.isBottomShow = true;
            },
            orderTrackingclose() {
                this.$refs.wxcPopup.hide()
            },
            //非状态组件，需要在这里关闭
            popupOverlayBottomClick() {
                this.isBottomShow = false;
            },
            // 拉黑弹出层
            openMask(e) {
                this.isBottomShow = false
                this.show = true;
                this.hasAnimation = true;
            },
            wxcMaskSetHiddenOne() {
                this.confirmShow = false;
                // this.settopShow=false;
                this.auditReasonsShow = false
            },
            auditReasonsSureButtonClick() {
                var that = this
                that.auditReasonsShow = false
            },
            wxcMaskSetHidden() {
                this.show = false;
                // 拉黑用户
                // if(str = 'determine'){
                //     this.black = true
                //     modal.toast({
                //         message: '拉黑成功'
                //     })
                // }
            },
            openNoAnimationMask(e) {
                this.show = true;
                this.hasAnimation = false;
            }

        }
    }
</script>

<style scoped>
    .bigBox {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }

    .dianDelBtnCancel {
        /*padding-top: 5px;*/
        padding-bottom: 25px;
        padding-left: 40px;
        padding-right: 40px;
    }

    .dianDelBtn {
    }

    .dianDelDetails {
        padding-left: 30px;
        padding-right: 30px;
    }

    .dianDelTips {
        padding-top: 25px;
        /*padding-bottom: 5px;*/
        padding-left: 30px;
    }

    .dianDelDiv {
        flex: 1;
        justify-content: space-between;
    }

    .cell {
        width: 750px;

    }

    .page {
        background-color: #fff;
    }

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
        margin-top: 10px;
        height: 40px;
        width: 40px;
        color: blue;
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

    .mr24 {
        margin-right: 24px;
    }

    .w750 {
        width: 750px;
    }

    /* 导航栏 */
    .backImg {
        width: 40px;
        height: 40px;
    }

    /* header个人信息 */
    .header {
        position: relative;
    }

    .banner {
        width: 750px;
        height: 120px;
        background-color: #53beb7;
    }

    .headerBottom {
        width: 750px;
        background-color: #fff;
        padding-bottom: 10px;
    }

    .userImgBox {
        flex: 1;
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
        background-color: #53beb7;
        border-radius: 8px;
    }

    .personalInfo {
        padding-left: 20px;
        padding-right: 20px;
    }

    .personalName {
        font-weight: 600;
        padding-top: 10px;
        padding-bottom: 10px;
    }

    .authenticationIcon {
        width: 30px;
        height: 30px;
        margin-right: 10px;
        border-radius: 20px;
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
        color: #53beb7;
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

    .videoDianIcon {

        position: absolute;
        right: 23px;
        bottom: 18px;
    }

    .videoDianIconImg {
        width: 35px;
        height: 35px;
    }

    .noPass {
        position: absolute;
        width: 120px;
        height: 65px;
        right: 10px;
        top: 10px;
    }

    .noPassText {
        text-align: right;
        color: #fff;
    }

    /* 文章样式 */
    .piece {

        background-color: #ffffff;
        width: 750px;
        /*padding: 30px;*/
    }

    .headLineContent {
        flex-direction: column;
        padding-top: 30px;
        position: relative;
    }

    .contentStyle {
        flex-direction: column;
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #f1f1f1;
        margin-left: 30px;
        margin-right: 30px;
    }

    .articleMessage {
        padding-top: 20px;
        padding-bottom: 20px;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }

    .shopAnTime {
        flex-direction: row;
        align-items: center;
    }

    .jiaoDivTwo {
        width: 28px;
        height: 28px;
        position: absolute;
        bottom: 60px;
        right: 50px;
        background-color: #fff;
        transform: rotate(45deg);
    }

    .jiaoDiv {
        width: 30px;
        height: 30px;
        position: absolute;
        bottom: 60px;
        right: 50px;
        background-color: #fff;
        transform: rotate(45deg);
        border-style: solid;
        border-width: 1px;
        border-color: #999;
    }

    .dianIconFlexText {
        height: 45px;
        flex: 1;
        line-height: 45px;
        text-align: center;
        color: #999;
    }

    .borBtn {
        border-right-style: solid;
        border-right-width: 1px;
        border-right-color: #dedede;
    }

    .dianIconFlex {
        position: absolute;
        right: 40px;
        bottom: 70px;
        width: 500px;
        height: 90px;
        background-color: #fff;
        border-radius: 10px;
        border-style: solid;
        border-width: 1px;
        border-color: #999;
    }

    .dianBigDiv {
        position: absolute;
        height: 200px;
        width: 750px;
        bottom: 0;
        right: 0;
        transform: scale(0.001);
        opacity: 0.1;
    }

    .dianIconDiv {
        width: 75px;
        height: 55px;
        justify-content: center;
        align-items: center;
    }

    .dianIcon {
        width: 35px;
        height: 35px;
    }

    .settop {
        padding-left: 20px;
        padding-right: 20px;
    }

    .shopAnTimeSize {
        color: #999;
        margin-right: 10px;
    }

    .coverImgStyle {
        margin-top: 15px;
    }

    .articlePlace {
        flex-direction: row;
        align-items: center;
    }

    .placeSize {
        font-size: 25px;
        color: #999;
    }

    .threeImg {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }

    .threeImgSize {
        width: 220px;
        height: 165px;
    }

    .bigImg {
        flex-direction: row;
    }

    .bigImgSize {
        width: 690px;
        height: 400px;
    }

    .videoImg {
        flex-direction: row;
        position: relative;
    }

    .videoPlay {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        height: 518px;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-color: rgba(102, 102, 102, 0.3);
    }

    .videoPlayImg {
        width: 100px;
        height: 100px;
    }

    .smallImgContent {
        flex-direction: row;
        justify-content: space-between;
    }

    .smallImgeText {
        width: 450px;
        lines: 3,
    }

    .smallImgSize {
        width: 220px;
        height: 165px;
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

    .indicator-text {
        color: #666;
        font-size: 28px;
        text-align: center;
        margin-top: 30px;
        margin-bottom: 30px;
    }

    .indicator {
        margin-top: 16px;
        height: 40px;
        width: 40px;
        color: blue;
    }

    /*拉黑弹出层 */
    .mask {
        flex: 1;
        position: relative;
        padding-top: 46px;
        padding-left: 50px;
    }

    .maskTitle {
        font-size: 36px;
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

    .videoJiaoDivTwo {
        width: 20px;
        height: 20px;
        position: absolute;
        bottom: 40px;
        right: 30px;
        background-color: #fff;
        transform: rotate(45deg);
    }

    .videoJiaoDiv {
        width: 22px;
        height: 22px;
        position: absolute;
        bottom: 40px;
        right: 30px;
        background-color: #fff;
        transform: rotate(45deg);
        border-style: solid;
        border-width: 1px;
        border-color: #999;
    }

    .videoDianIconFlexText {
        height: 75px;
        flex: 1;
        line-height: 75px;
        padding-left: 20px;
        padding-right: 20px;
        text-align: center;
        color: #999;
    }

    .videoBorBtn {
        border-bottom-style: solid;
        border-bottom-width: 1px;
        border-bottom-color: #dedede;
    }

    .videoDianIconFlex {
        position: absolute;
        right: 10px;
        bottom: 50px;

        width: 165px;
        justify-content: center;
        align-items: center;
        background-color: #fff;
        border-radius: 10px;
        border-style: solid;
        border-width: 1px;
        border-color: #999;
    }

    .videoDianBigDiv {
        position: absolute;
        width: 248px;
        height: 330px;
        bottom: 0;
        right: 0px;
        transform: scale(0.001);
        opacity: 0.1;
    }

    /*审核失败原因提示框*/
    .auditReasons {
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        flex: 1;
    }

    .auditReasonsDetails {
        padding-left: 20px;
        padding-right: 20px;
        line-height: 40px;
    }

    .auditReasonsTitle {
        padding-top: 25px;
        font-weight: bold;

    }

    .auditReasonsSureButton {
        /*width: 400px;*/
        /*text-align: center;*/
        /*padding-top: 20px;*/
        /*padding-bottom: 20px;*/
        /*background-color: #53beb7;*/
        /*border-radius: 8px;*/
        /*margin-bottom: 25px;*/
        width: 600px;
        text-align: center;
        padding-top: 20px;
        padding-bottom: 20px;
        border-top-width: 1px;
        border-top-style: solid;
        border-top-color: #dedede;
    }

    .auditReasonsSureButton:active {
        background-color: #f8f8f8;
    }

    .videoblackBg {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #666;
        opacity: 0.3;
    }

    .lookAround{
        margin-top: 30px;
        width: 200px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border-style: solid;
        border-width: 2px;
        border-color: #53beb7;
        border-radius: 10px;
    }
    .proposal{
        margin-top: 20px;
    }
    .noOrder{
        margin-top: 30px;
    }
    .bodyImage{
        width: 200px;
        height: 200px;
    }
    .body-wxc{
        flex: 1;
        margin-top: 100px;
        align-items: center;
        justify-content: center;
        /*background-color: #f8f8f8;*/
    }
</style>
