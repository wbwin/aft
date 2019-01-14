<template>
    <div class="wrapper" >
        <!-- 导航栏 -->
        <div>
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    @wxcMinibarRightButtonClicked="minibarRightButtonClick">
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text class="ellipsis" :style="GLOBAL.headerCenter"  slot="middle">{{ shopInfo.shopName }}</text>
                <image class="navigationRightIcon" slot="right" src="https://image.aftdc.com/appBimg/ic_more_head.png"></image>
            </wxc-minibar>
        </div>
        <list  class="page"  offset-accuracy="30" @scroll="onscroll">
            <refresh class="refresh" @refresh="refresh" :display="refreshing ? 'show' : 'hide'">
                <loading-indicator class="indicator"></loading-indicator>
            </refresh>

            <cell class="header">
                <!-- header个人信息 -->
                <div class="headerBottom">
                    <div class="personalInfo" >
                        <div style="flex-direction: row;padding-bottom: 20px;padding-top: 20px;">
                            <div class="userImgBox">
                                <image class="userImg" :src="'https://image.aftdc.com/'+shopInfo.shopImg"></image>
                            </div>
                            <div style="flex: 2.5;padding-left: 20px;">

                                <div class="row aiCenter personalInfoText" style="justify-content: space-between;">
                                    <div class="" @click="toOtherPage(0)">
                                        <text class="numText" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.tColor}">{{ shopInfo.attentionNum }}</text>
                                        <text class="gray mt10 attentionText" :style="{fontSize:GLOBAL.defaultFS}">&nbsp;关注</text>
                                    </div>
                                    <div class="m24" @click="toOtherPage(1)">
                                        <text class="numText" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.tColor}">{{ shopInfo.fansNum }}</text>
                                        <text class="gray mt10 attentionText" :style="{fontSize:GLOBAL.defaultFS}">&nbsp;粉丝</text>
                                    </div>
                                    <div class="" style="padding-right: 40px;" @click="toOtherPage(2)">
                                        <text class="numText" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.tColor}">{{ shopInfo.dongtaiNum}}</text>
                                        <text class="gray mt10 attentionText" :style="{fontSize:GLOBAL.defaultFS}">&nbsp;动态</text>
                                    </div>
                                </div>
                                <div class="followBox">
                                    <text class="followBtn" :class="[shopInfo.isBlack===1?'pullBlack':shopInfo.attentionType===0?'':'tColor']" :style="{fontSize:GLOBAL.defaultFS}" @click="onFollow">{{shopInfo.isBlack===1?'解除拉黑':shopInfo.attentionType===2?'互相关注':shopInfo.attentionType===1?'取消关注':'关注' }}</text>
                                </div>

                            </div>
                        </div>


                        <div class="row aiCenter" v-if="shopInfo.certification==1">
                            <!--<div class="row aiCenter">-->
                            <div class="authenticationIcon">
                                <image class="authenticationIcon" src="https://image.aftdc.com/images/daV.png"></image>
                            </div>
                            <text class="personalInfoText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">认证: {{shopInfo.shopName}}官方餐头条号</text>
                        </div>

                        <div class="row">
                            <div class="authenticationIcon" style="border-radius: 0;margin-top: 10px">
                                <image class="authenticationIcon" style="border-radius: 0;" src="https://image.aftdc.com/appBimg/icon_leaveWord.png"></image>
                            </div>
                            <text class="personalInfoText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}" style="width: 660px">签名: {{ shopInfo.acticleMood }}</text>
                        </div>

                    </div>
                </div>
            </cell>
            <cell class="stickyHeader"  ref="footer">
                <!--全部文章,视频,回收站导航栏-->
                <div class="toggle row">
                    <div class="toggleBtn " :class="[sliderIndex == 0?'toggleBtnActive':'toggleBtnActiveWhite']"
                         @click="toggle(0)">
                        <text :style="{fontSize:GLOBAL.biggerFS,color:sliderIndex==0?GLOBAL.tColor:GLOBAL.dColor}">全部文章</text>
                    </div>
                    <div class="toggleBtn" :class="[sliderIndex == 1?'toggleBtnActive':'toggleBtnActiveWhite']"
                         @click="toggle(1)">
                        <text :style="{fontSize:GLOBAL.biggerFS,color:sliderIndex==1?GLOBAL.tColor:GLOBAL.dColor}">视频</text>
                    </div>
                </div>

            </cell>
            <cell class="cell">
                <!--文章与视频内容区-->
                <slider class="slider" infinite="false" :value="sliderIndex" :index="sliderIndex" keep-index="true" @change="sliderCharge"  :style="{minHeight: minHeight-184+'px'}">
                    <!-- 文章内容 -->
                    <div class="piece" >
                        <div :style="{height:sliderIndex == 1?minHeight-184+'px':''}" >
                            <div class="headLineContent" v-for="(item,index) in article" @click="toArticleContent(item.id)"  v-if="sliderIndex ==  0 || index < 2 ">
                                <div class="contentStyle" >
                                    <div v-if="item.cover_type!=1">
                                        <text :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">{{item.title}}</text>
                                        <div class="coverImgStyle">
                                            <div class="threeImg" v-if="item.cover_type==3&&item.cover_img">
                                                <image class="threeImgSize"
                                                       :src="'https://image.aftdc.com/'+item.cover_img[0]"></image>
                                                <image class="threeImgSize"
                                                       :src="'https://image.aftdc.com/'+item.cover_img[1]"></image>
                                                <image class="threeImgSize"
                                                       :src="'https://image.aftdc.com/'+item.cover_img[2]"></image>
                                            </div>
                                            <div class="bigImg" v-if="item.cover_type==2">
                                                <image v-if="item.cover_img" class="bigImgSize" :src="'https://image.aftdc.com/'+item.cover_img[0]" ></image>
                                            </div>
                                            <div class="videoImg" v-if="item.cover_type==5">
                                                <image v-if="item.cover_img" class="bigImgSize" :src="'https://image.aftdc.com/'+item.cover_img[0]"></image>
                                                <div class="videoPlay">
                                                    <image class="videoPlayImg" src="https://image.aftdc.com/appBimg/icon_vadeoPlay.png"></image>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="smallImgContent" v-if="item.cover_type==1">
                                        <text class="smallImgeText" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">{{item.title}}</text>
                                        <image v-if="item.cover_img" class="smallImgSize" :src="'https://image.aftdc.com/'+item.cover_img[0]"></image>
                                    </div>
                                    <div class="articleMessage row aiCenter">
                                        <div class="shopAnTime">
                                            <!--<text class="shopAnTimeSize" :style="{fontSize:GLOBAL.defaultFS}">{{shopInfo.shopName}}</text>-->
                                            <text class="shopAnTimeSize" :style="{fontSize:GLOBAL.defaultFS}">{{item.read_num}}阅读</text>
                                            <text class="shopAnTimeSize" v-if="item.is_video" :style="{fontSize:GLOBAL.defaultFS}">{{item.read_num}}播放</text>
                                            <text class="shopAnTimeSize" :style="{fontSize:GLOBAL.defaultFS}">{{item.comment_num}}{{item.commentOrleaveWord==1?'评论':'留言'}}</text>
                                            <text class="shopAnTimeSize" :style="{fontSize:GLOBAL.defaultFS}">{{item.praise_num}}点赞</text>
                                            <text class="shopAnTimeSize" :style="{fontSize:GLOBAL.defaultFS}">{{item.timestamp}}</text>
                                            <text class="settop" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}" v-if="item.top>0">置顶</text>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <text class="noData" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}" v-if="article.length === 0 && delay">商家暂无发布文章</text>
                        </div>
                    </div>
                    <!-- 视频 -->
                    <div class="aiCenter w750">
                        <div  :style="{height:sliderIndex == 0?minHeight-184+'px':''}">
                            <div class="headLineContent" v-for="(item,index) in video" @click="toArticleContent(item.id)" v-if="sliderIndex ==  1 || index < 2 ">
                                <div class="contentStyle" >
                                    <div class="coverImgStyle">
                                        <div class="videoImg">
                                            <image v-if="item.cover_img" class="bigImgSize" :src="'https://image.aftdc.com/'+item.cover_img[0]"></image>
                                            <div class="videoPlay">
                                                <image class="videoPlayImg" src="https://image.aftdc.com/appBimg/icon_vadeoPlay.png"></image>
                                            </div>
                                            <div class="titleSize">
                                                <text class="titleText" >{{item.title}}</text>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="articleMessage row aiCenter">
                                        <div class="shopAnTime">
                                            <text class="shopAnTimeSize" :style="{fontSize:GLOBAL.defaultFS}">{{item.read_num}}播放</text>
                                            <text class="shopAnTimeSize" :style="{fontSize:GLOBAL.defaultFS}">{{item.comment_num}}{{item.commentOrleaveWord==1?'评论':'留言'}}</text>
                                            <text class="shopAnTimeSize" :style="{fontSize:GLOBAL.defaultFS}">{{item.praise_num}}点赞</text>
                                            <text class="shopAnTimeSize" :style="{fontSize:GLOBAL.defaultFS}">{{item.timestamp}}</text>
                                            <text class="settop" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}" v-if="item.top>0">置顶</text>
                                            <!--当接口的数据 article 里面加上settop 等于0 或1,用v-if判断上面的text组件,当settop为0时显示,为1时隐藏-->
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <text class="noData" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}" v-if="video.length === 0 && delay">商家暂无发布视频</text>
                        </div>
                    </div>

                </slider>
            </cell>
            <loading class="loading" @loading="loadmore" :display="loadinging ? 'show' : 'hide'">
                <text class="indicator-text">{{loadingText}}</text>
            </loading>
        </list>


        <!--举报弹层-->
        <wxc-popup popup-color="rgb(255, 255, 255)"
                   :show="isBottomShow"
                   @wxcPopupOverlayClicked="popupOverlayBottomClick"
                   pos="bottom"
                   ref="wxcPopup"
                   height="670">
            <div class="demo-content">
                <text class="completeBtn" :style="{color:GLOBAL.dColor}" @click="reportArticle(1)">完成</text>
                <div class="reportOption row jcSb aiCenter"  @click="otherChecked">
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">我有话要说</text>
                    <image class="arrowIcon" src="https://image.aftdc.com/appBimg/ic_expanded_down.jpg" ></image>
                </div>
                <div class="reportOption row jcSb aiCenter" v-for="(item,index) in reportOption" @click="reportChecked(index)">
                    <text :style="{fontSize:GLOBAL.bigFS,color:item.check?'#b5b5b5':GLOBAL.dColor}">{{item.check?'已举报 ':''}}{{item.text}}</text>
                    <text class="reportRight" v-if="item.check">撤销</text>
                </div>
                <div class="reportTitle aiCenter jcCenter">
                    <text class="reportTitleText" :style="{color:GLOBAL.dColor}">举报</text>
                </div>
            </div>
        </wxc-popup>
        <wxc-popup popup-color="rgb(255, 255, 255)"
                   :show="reportTextarea"
                   @wxcPopupOverlayClicked="popupReportTextareaClick"
                   pos="bottom"
                   ref="reportTextarea"
                   height="370">
            <div class="textareaBox">
                <div class="tbHeader row aiCenter">
                    <div class="row aiCenter tbFlex1">
                        <image class="arrowIcon tran90" src="https://image.aftdc.com/appBimg/ic_expanded_down.jpg"></image>
                        <text :style="{fontSize:'30px',color:GLOBAL.dColor}" @click="returnReport">返回</text>
                    </div>
                    <text class="tbTitle tbFlex1" :style="{color:GLOBAL.dColor}">我要吐槽</text>
                    <text class="tbFlex1"></text>
                </div>
                <div class="tbMain">
                    <textarea class="textarea" name="" ref="textarea" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}" placeholder="请具体说明问题，我们将尽快处理" maxlength="200" v-model="textareaText" cols="30" rows="3"></textarea>
                </div>
                <div class="tbfooter aiCenter">
                    <text class="tbBtn"  :style="{fontSize:GLOBAL.bigFS,backgroundColor:textareaText.length > 0?GLOBAL.tColor:'#d3d3d3'}" @click="reportArticle(0)">完成</text>
                </div>
            </div>
        </wxc-popup>

        <!--拉黑弹出层-->
        <wxc-mask height="260"
                  width="550"
                  border-radius="5"
                  duration="200"
                  mask-bg-color="#FFFFFF"
                  :has-animation="true"
                  :has-overlay="true"
                  :show-close="false"
                  :show="delShow"
                  @wxcMaskSetHidden="delMaskHidden">
            <div class="delBox" @click.stop="preventBubbles" >
                <div class="delText aiCenter jcCenter" >
                    <text class="delTips" :style="{fontSize:GLOBAL.bigFS}">确认{{shopInfo.isBlack === 1?'取消':''}}拉黑该用户？</text>
                </div>
                <div class="delBtn row">
                    <text class="flex1 delCancel" :style="{fontSize:GLOBAL.bigFS}" @click="delMaskHidden">取消</text>
                    <text class="flex1" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor}" @click="deleteComment">确认</text>
                </div>
            </div>
        </wxc-mask>



        <wxc-popover ref="wxc-popover"
                     :buttons="btns"
                     :position="popoverPosition"
                     :arrowPosition="popoverArrowPosition"
                     @wxcPopoverButtonClicked="popoverButtonClicked"></wxc-popover>
        <toast ref="toast"></toast>
        <share ref="share"></share>
        <div class="bigBox" ref="box"></div>
    </div>
</template>

<script>
    import { WxcMask,WxcMinibar,WxcPopover,WxcPopup} from 'weex-ui';
    import Toast from './Toast.vue';
    import Share from './Share.vue';
    const GLOBAL = require('@/Global.vue');
    const event = weex.requireModule('event');
    const post = weex.requireModule('stream');
    const dom = weex.requireModule('dom');

    export default {
        data() {
            return {
                userId: '',
                aId: '',
                token: '',
                imei: '',

                delay: false, //暂无数据是text延迟显示
                articleNothing: false,
                videoNothing: false,
                loadingText: '加载中...',
                delShow: false, // 拉黑作者弹出层
                textareaText: '', //吐槽输入框文本
                reportTextarea: false, //吐槽弹层
                isBottomShow: false, //举报弹层
                reportOption: [ //举报选项
                    {text:'恶意攻击谩骂',check: false},
                    {text:'营销广告',check: false},
                    {text:'违法信息',check: false},
                    {text:'淫秽色情',check: false}
                ],
                minHeight: 0,//给slider高度一个最小值
                once: false,//执行一次给minHeight赋值
                sliderIndex: 0,// slider索引值
                article: [], //商家文章数据
                video: [], //商家视频数据
                shopInfo: { //商家信息
                    acticleMood: "",
                    attentionNum: 0,
                    certification: 0,
                    dongtaiNum: 0,
                    fansNum: 0,
                    shopImg: "",
                    shopName: ""
                },
                black: 0,
                btns:[
                    // {  icon: 'https://image.aftdc.com/images/ic_fenxiang.png', text:'分享' },
                    { icon: 'http://image.aftdc.com/images/ly.png', text:'私信' },
                    { icon: 'http://image.aftdc.com/images/icon_shopReport.png', text:'举报' },
                    { icon: 'https://image.aftdc.com/appBimg/ic_black_fans.jpg', text: this.black == 1?'取消拉黑':'拉黑' },
                ],
                popoverPosition:{x:-16,y:50},
                popoverArrowPosition:{pos:'top',x:-14},

                loadinging:false,
                refreshing:false,
            }
        },
        components: {WxcMask,WxcMinibar,WxcPopover,Toast,Share,WxcPopup},

        created: function () {
            this.userId = weex.config.userId
            this.aId  = weex.config.param
            this.token = weex.config.token;
            this.imei = weex.config.imei;
            // this.userId = 42
            // this.aId = 10000014
            // this.token = 'BYSIWWFIICOYX7VIOQ61542372159'
            // this.imei = 'cb69d47112e44082bcdc0251d62b221d'

            this.getInformation()
            this.getArticles(0,1)
            this.getArticles(0,2)


            setTimeout(()=>{this.delay = true},500)

        },
        methods: {
            refresh() {
                this.refreshing = true
                setTimeout(()=> {
                    this.refreshing = false
                },1000)
                this.getInformation()
                this.getArticles(0,1)
                this.getArticles(0,2)
            },

            onFollow:GLOBAL.throttle(function(){ //取消拉黑、关注、取消关注头条作者
                // shopInfo.isBlack===1?'pullBlack':shopInfo.attentionType===1?'tColor':''
                if(this.shopInfo.isBlack === 1) {
                    this.deleteComment()
                }else if(this.shopInfo.attentionType===0){
                    this.followClick(0)
                }else {
                    this.followClick(1)
                }
            }),

            followClick(type){ //关注、取消关注头条作者
                var that = this
                const toast=that.$refs.toast;
                var url = null
                if(type === 1) {
                    url = 'https://www.aftdc.com/userapp/Index/cancelAttentShop'//取消关注
                }else {
                    url = 'https://www.aftdc.com/userapp/Index/attentShop'//关注
                }
                var param = that.GLOBAL.sign(this.token,this.imei);
                param += '&shopId=' + that.shopInfo.shopId
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: url,
                }, function (res) {
                    if(res.data.res === 1) {
                        if(type === 1) {
                            that.shopInfo.attentionType = 0
                        }else {
                            that.shopInfo.attentionType = 1
                        }
                    }else if(res.data.res === -2) {
                        that.toLogin()
                    }
                    toast.editContent(res.data.info);
                });
            },

            delMaskShow() { //显示拉黑弹层
                this.delShow = true
                this.commentIndex = index
            },
            delMaskHidden() { //隐藏拉黑弹层
                this.delShow = false
            },
            deleteComment:GLOBAL.throttle(function() { //拉黑或取消拉黑作者
                var that = this
                var url = null
                if(that.shopInfo.isBlack === 1) {
                    url = 'https://www.aftdc.com/userapp/Article/cancelBlack'
                }else {
                    url = 'https://www.aftdc.com/userapp/Article/black'
                }
                const toast=that.$refs.toast;
                var param = that.GLOBAL.sign(this.token,this.imei);
                param += '&aId=' + that.aId
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: url,
                }, function (res) {
                    if(res.data.res === 1) {
                        that.delShow = false
                        if(that.shopInfo.isBlack === 1) {
                            that.shopInfo.isBlack = 0
                            that.btns[2].text = '拉黑'
                        }else {
                            that.shopInfo.isBlack = 1
                            that.btns[2].text = '取消拉黑'
                            that.shopInfo.attentionType = 0
                        }
                    }
                    toast.editContent(res.data.info);
                });
            }),


            reportArticle:GLOBAL.throttle(function(btn) { //举报作者
                var that = this
                const toast=that.$refs.toast;
                if(btn===1) {
                    that.popupOverlayBottomClick()
                }else {
                    that.popupReportTextareaClick()
                }
                var reason = []
                for(var i = that.reportOption.length - 1; i >= 0; i--) {
                    if(that.reportOption[i].check) {
                        reason.push(that.reportOption[i].text)
                    }
                }
                if(that.textareaText.length > 0) {
                    reason.push(that.textareaText)
                }
                if(reason.length > 0) {
                    var param = that.GLOBAL.sign(that.token,that.imei);
                    param += '&aId=' + that.aId
                    param += '&reason=' + JSON.stringify(reason)
                    post.fetch({
                        method: 'POST',
                        type: 'json',
                        body: param,
                        headers: { "Content-Type": "application/x-www-form-urlencoded" },
                        url: 'https://www.aftdc.com/userapp/Article/reportAuthor',
                    }, function (res) {
                        if(res.data.res === 1) {
                            for(var i in that.reportOption) {
                                that.reportOption[i].check = false
                            }
                            that.textareaText = ''
                        }else if(res.data.res === -2) {
                            that.toLogin()
                        }
                        toast.editContent(res.data.info);
                    });
                }
            }),
            returnReport() { //返回按钮
                this.popupReportTextareaClick ()
                setTimeout(()=>{ this.isBottomShow = true },200)
            },
            popupReportTextareaClick () { //关闭吐槽弹层
                this.$refs.reportTextarea.hide();
                this.$refs.textarea.blur()
                setTimeout(()=>{ this.reportTextarea = false },400)
            },
            otherChecked(index) { //我有话要说
                this.$refs.wxcPopup.hide();
                setTimeout(()=>{ this.isBottomShow = false },400)
                setTimeout(()=>{
                    this.reportTextarea = true;
                    setTimeout(()=>{ this.$refs.textarea.focus() },200)
                },100)
            },
            reportChecked(index) { //选中举报选项
                this.reportOption[index].check = !this.reportOption[index].check
            },
            showReport() {
                this.isBottomShow = true
            },
            popupOverlayBottomClick () { //关闭举报弹层
                this.$refs.wxcPopup.hide();
                setTimeout(()=>{ this.isBottomShow = false; },400)
            },


            getInformation() { //获取个人餐头条首页信息
                var that = this
                var param = '&userId=' + that.userId
                param += '&aId=' + that.aId
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    url: 'https://www.aftdc.com/userapp/Article/getInformation',
                }, function (res) {
                    if(res.data.res === 1) {
                        that.shopInfo = res.data.data
                        if(res.data.data.isBlack === 1) {
                            that.btns[2].text = '取消拉黑'
                        }else {
                            that.btns[2].text = '拉黑'
                        }

                    }
                })
            },
            getArticles(page,type) { //获取个人餐头条文章与视频 type:1(文章)，2(视频)
                var that = this
                var param = '&userId=' + that.userId
                param += '&aId=' + that.aId
                param += '&page=' + page
                if(type === 1) {
                    param += '&type=' + 1
                }else {
                    param += '&type=' + 2
                }
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    url: 'https://www.aftdc.com/userapp/Article/getArticles',
                }, function (res) {
                    if(res.data.res === 1) {
                        if(page === 0) {
                            if(type === 1) {
                                that.article = res.data.data
                            }else {
                                that.video = res.data.data
                            }
                        }else {
                            if(type === 1) {
                                that.article = that.article.concat(res.data.data)
                            }else {
                                that.video = that.video.concat(res.data.data)
                            }
                        }
                        if(res.data.data.length !== 20) {
                            if(type === 1) {
                                that.articleNothing = true
                            }else {
                                that.videoNothing = true
                            }
                            setTimeout(()=>{that.loadingText = '没有更多了'},1500)
                        }
                    }else if(res.data.res === 0){
                        if(type === 1) {
                            that.articleNothing = true
                        }else {
                            that.videoNothing = true
                        }
                        setTimeout(()=>{that.loadingText = '没有更多了'},1500)
                    }
                })
            },

            /*上拉加载*/
            loadmore () {
                this.loadinging = true;
                setTimeout(()=>{
                    this.loadinging = false
                },1000)
                if(this.sliderIndex === 0) {
                    if(!this.articleNothing) {
                        this.getArticles(this.article.length,1)
                    }
                }else {
                    if(!this.videoNothing) {
                        this.getArticles(this.article.length,2)
                    }
                }
            },


            previewClick(id){
                this.articleId = id
                var that=this
                var param = {
                    articleId: this.articleId
                }
                var url = 'http://assets/seeArticle.js'
                event.toUrl({url: url, param: JSON.stringify(param)});
            },//点击图片的预览



            // 监听slider显示第几页
            sliderCharge(e){
                this.sliderIndex = e.index
                if(e.index === 0 && !this.articleNothing) {
                    this.loadingText = '加载中...'
                }else if (e.index === 1 && !this.videoNothing) {
                    this.loadingText = '加载中...'
                }
            },

            // 文章与视频的切换
            toggle(type){
                this.sliderIndex = type
                // this.scrollToNext()
            },
            minibarLeftButtonClick() {
                navigator.pop()
            },
            minibarRightButtonClick () {
                this.$refs['wxc-popover'].wxcPopoverShow();
                this.bubbleHide();
            },
            popoverButtonClicked (obj) {
                if(obj.index==0){ //私信
                    var param = this.shopInfo.shopId;
                    var url='http://assets/privateLetter.js';
                    event.toUrl({ "url": url, "param": param });
                }
                else if(obj.index==1){ //举报
                    this.isBottomShow = true;
                }
                else if(obj.index==2){ //拉黑
                    this.delMaskShow()
                }
            },
            articleShare() {//分享
                var wxappPart = '';					                                                                //小程序路径
                var webUrl = 'https://www.aftdc.com/mobile/article/articleDetail.html?id=' + 'this.articleInfo.id';	//网页链接
                var title = 'this.articleInfo.title';						                                        //分享标题
                var shareImg = 'https://image.aftdc.com/' + 'this.articleInfo.shopImg';                             //分享缩略图片
                var description = 'this.article[0].content.slice(0,20)';					                        //分享描述
                var scene = 2;
                const share = this.$refs.share;
                share.show(false,true,true,false,false,false,false,false,wxappPart,webUrl,title,shareImg,description,scene);
            },
            onscroll(){
                if(this.once===false){
                    dom.getComponentRect(this.$refs.box, option => {
                        if (option.result && option.size) {
                            this.minHeight = Math.ceil(option.size.height)
                        }
                    })
                    this.once = true
                    return false;
                }

            },//滚动条滚动时

            toArticleContent(id) {
                var param = id
                var url = 'http://assets/articleContent.js'
                event.toUrl({url:url,param:param});
            },
            toOtherPage(type){ //查看关注、粉丝、动态(0:关注、1:粉丝、2:动态)
                var url = null
                var param = null
                switch(type) {
                    case 0:
                        url = 'http://assets/followAanFans.js'
                        param = JSON.stringify({isWho:0})
                        break
                    case 1:
                        url = 'http://assets/followAanFans.js'
                        param = JSON.stringify({isWho:1})
                        break
                    case 2:
                        url = 'http://assets/personalHomepage.js'
                        param = this.userId
                        break
                }
                event.toUrl({url:url,param:param});
            },
            toLogin(){ //跳转到登录页面
                var param='';
                var url='http://assets/login.js';
                event.toUrl({"url":url,"param":param})
            },

        }
    }
</script>

<style>

    /* 公共样式 */

    .gray {
        color: #b9b9b9;
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
    .jcSb {
        justify-content: space-between;
    }
    .w750 {
        width: 750px;
    }
    .mt10{
        margin-top: 10px;
    }
    .navigationRightIcon {
        width: 50px;
        height: 50px;
    }
    .bigBox {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        opacity: 0;
    }
    .ellipsis {
        text-overflow: ellipsis;
        max-width: 380px;
        lines: 1;
    }
    .noData {
        text-align: center;
        margin-top: 200px;
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
        min-height: 94px;
        background-color: #f8f8f8;
    }


    /* header个人信息 */
    .header {
        position: relative;
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

    .followBox {
        flex: 1;
        flex-direction: row-reverse;
        align-items: flex-end;
        padding-right: 16px;
    }
    .followBtn {
        color: #fff;
        width: 140px;
        height: 56px;
        line-height: 56px;
        text-align: center;
        border-radius: 8px;
        background-color: #f85959;
    }

    .tColor {
        background-color: #53beb7;
    }
    .pullBlack {
        color: #6f6f6f;
        background-color: #fff;
        border-width: 2px;
        border-style: solid;
        border-color: #6f6f6f;
    }
    .personalInfo {
        padding-left: 30px;
        padding-right: 30px;
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
    .numText{
        font-weight: 400;
        width: 100px;
        text-align: center;
    }
    .attentionText{
        width: 100px;
        text-align: center;
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
    .toggleBtnActiveWhite {
        border-bottom-width: 4px;
        border-bottom-style: solid;
        border-bottom-color: #fff;
    }
    /* 文章与视频 */
    .slider {
        width: 750px;
        flex-direction: row;

    }



    /* 文章样式 */
    .piece {

        background-color: #ffffff;
        width: 750px;
        position: relative;
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
        padding-bottom:20px;
        width: 690px;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
    .shopAnTime {
        flex-direction: row;
        align-items: center;
    }



    .settop{
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
        position: relative;
        width: 690px;
    }
    .bigImgSize{
        width: 690px;
        height:400px ;
    }
    .titleSize{
        position: absolute;
        top: 0;
        left: 0;
        width: 690px;
        padding-left: 30px;
        padding-right: 30px;
        padding-top: 20px;
    }
    .titleText{
        line-height: 40px;
        flex: 1;
        font-size: 36px;
        color: #fff;
    }

    .videoImg{
        flex-direction: row;
        position: relative;
        width: 690px;
        height:400px ;
    }
    .videoPlay{
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        /*height: 518px;*/
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-color: rgba(102,102,102,0.5);
    }
    .videoPlayImg{
        width: 100px;
        height: 100px;
    }
    .smallImgContent{
        flex-direction: row;
        justify-content: space-between;
    }
    .smallImgeText{
        width: 450px;
        lines:3,
    }
    .smallImgSize{
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

    .demo-content {
        flex: 1;
        flex-direction: column-reverse;
    }
    .completeBtn {
        font-size: 30px;
        height: 96px;
        line-height: 90px;
        text-align: center;
        border-top-width: 2;
        border-top-style: solid;
        border-top-color: #f1f1f1;
    }
    .reportOption {
        height: 90px;
        border-top-width: 2;
        border-top-style: solid;
        border-top-color: #f1f1f1;
        margin-left: 66px;
        margin-right: 66px;
    }
    .reportRight {
        color: #4aaaa3;
        font-size: 28px;
    }
    .arrowIcon {
        width: 22px;
        height: 22px;
        transform: rotate(-90deg);
        opacity: 0.5;
    }
    .tran90 {
        transform: rotate(90deg);
    }
    .reportTitle {
        flex: 1;
    }
    .reportTitleText {
        font-size: 30px;
        font-weight: bold;
    }

    .textareaBox {
        flex: 1;
        background-color: #f8f8f8;
        padding-left: 24px;
        padding-right: 24px;
    }
    .tbHeader {
        padding-left: 40px;
        padding-right: 40px;
        height: 120px;
    }
    .tbTitle {
        text-align: center;
        font-size: 30px;
        font-weight: bold;
    }
    .tbFlex1 {
        flex: 1;
    }
    .tbMain {
        height: 160px;
        background-color: #fff;
        border-width: 1px;
        border-style: solid;
        border-color: #d4d4d4;
        border-radius: 10px;
    }
    .textarea {
        height: 160px;
        padding-left: 20px;
        padding-right: 20px;
        padding-top: 20px;
        padding-bottom: 20px;
    }
    .tbfooter {
        height: 90px;
        flex-direction: row-reverse;
    }
    .tbBtn {
        width: 116px;
        height: 54px;
        color: #fff;
        line-height: 54px;
        text-align: center;
        border-radius: 10px;
    }

    .delBox {
        justify-content: space-between;
    }
    .delText {
        height: 166px;
    }
    .delBtn {
        height: 94px;
        border-top-width: 2px;
        border-top-style: solid;
        border-top-color: #f0f0f0;
    }
    .flex1 {
        line-height: 94px;
        text-align: center;
        flex: 1;
    }
    .delCancel {
        color: #444;
        border-right-width: 2px;
        border-right-style: solid;
        border-right-color: #f0f0f0;
    }
    .delTips {
        color: #555;
        font-size: 28px;
        line-height: 40px;
        max-width: 400px;
        text-align: center;
    }
</style>


