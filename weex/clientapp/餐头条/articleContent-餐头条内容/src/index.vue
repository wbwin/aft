<template>
    <div class="wrapper" @touchstart="blurClick" @viewdisappear="viewdisappear">

        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    @wxcMinibarRightButtonClicked="minibarRightButtonClick"
                    v-once>
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">餐头条</text>
                <image class="navigationRightIcon" slot="right" src="https://image.aftdc.com/appBimg/ic_more_head.png"></image>
            </wxc-minibar>
        </div>

        <!--底部评论框-->
        <div style="position: fixed;bottom: 0;left: 0;right: 0" @click.stop="">
            <div class="messageBoard" v-if="!inputBoard">
                <div class="leavingMessageDiv row aiCenter" @click="leavingClick">
                    <image class="leavingMessageIcon" src="https://image.aftdc.com/appBimg/icon_leaveWord.png"></image>
                    <text class="leavingMessage" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">写{{articleInfo.commentOrleaveWord==1?'评论':'留言'}}...</text>
                </div>
                <div class="headline" style="padding-right: 62px;" @click="domScoller()">
                    <image class="commentIcon" src="https://image.aftdc.com/appBimg/icon_articleComment.png"></image>
                    <div class="commentNumber" v-if="articleInfo.comment_num > 0">
                        <text class="commentNumberText">{{articleInfo.comment_num}}</text>
                    </div>
                </div>
                <div class="headline" style="padding-right: 62px;">
                    <image class="commentIcon" :src="articleInfo.isCollect?'https://image.aftdc.com/images/Collection1.png':'https://image.aftdc.com/images/sooucan.png'" @click="collectAndPraise(1)"></image>
                </div>
                <div class="headline" @click="toRefue">
                    <image class="commentIcon" src="https://image.aftdc.com/images/share.png"></image>
                </div>
            </div>
            <div class="messageBoardTwo row aiCenter" v-if="inputBoard">
                <div class="commentInputBg" >
                    <div class="grayBg"></div>
                    <input class="commentInput" type="text" :placeholder="articleInfo.commentOrleaveWord==1?'请认真评论':'留言审核后可见'" ref="inputMessage" maxlength="200" v-model="messageText"  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">
                </div>
                <text class="releaseBtn " :class="[messageText!==''?'releaseColor':'']" @click="sendClick" :style="{fontSize:GLOBAL.biggerFS}">发布</text>
            </div>
        </div>
        <!--音乐播放-->
        <div v-if="articleInfo.music!==''">
            <image class="musicImg" ref="musicImg" src="https://image.aftdc.com/appBimg/icon_music_check.png"  @click.stop="musicPlay" v-if="!play"></image>
            <image class="musicImg" ref="musicImg" :style="{ transform: 'rotate(' + musicRotate + 'deg)'}" src="https://image.aftdc.com/appBimg/icon_music_check.png"  @click.stop="musicPlay" v-else></image>
        </div>
        <!--进页面动画-->
        <div class="loadingAin aiCenter jcCenter" v-if="loading">
            <image class="indicator" src="https://image.aftdc.com/appBimg/ic_loading_gif.gif"></image>
            <text  :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">马上到了...</text>
        </div>

        <scroller class="scroller" ref="scroller" show-scrollbar="false" :style="{backgroundColor:template.themeColor}">
            <image class="templateBgImg" :src="template.imgUrl" v-if="template.imgUrl"></image>
            <div class="A" ref="title">
                <text class="text dColor" :style="{color:template.fontColor}">{{articleInfo.title}}</text>
                <div class="titleContent">
                    <div style="border-radius: 55px" @click="toShopDetails">
                        <image class="titleContentLeft" :src="'https://image.aftdc.com/'+articleInfo.shopImg"></image>
                    </div>
                    <div class="titleContentCenter" @click="toShopDetails">
                        <div class="shopName">
                            <text class="shopNameTitle lineHeight28"  :style="{fontSize:GLOBAL.bigFS,color:template.fontColorUname}">{{articleInfo.shopName}}</text>
                        </div>
                        <div class="shopNameTwo">
                            <text class="size lineHeight28" :style="{color:template.fontColorTime}">{{articleInfo.timestamp}}</text>
                        </div>
                    </div>
                    <text class="titleContentRight" :class="[articleInfo.attentionType==0?'':'follow']" @click="followClick" style="font-size:22px">{{articleInfo.attentionType==1?'已关注':'关&nbsp;&nbsp;注'}}</text>
                </div>
            </div>



            <div class="content">
                <div class="article_content" v-for="(item,index) in article" :key="index" v-if="articleInfo.imageFontRadio==1"><!--//字上图下-->
                    <text class="previewContent" :style="{color:template.fontColor}" v-if="item.content!==''">{{item.content}}</text>
                    <div class="imgDiv" v-if="item.articleImg!=='' && !item.video">
                        <image class="imgDefault" @load="resize(index,$event)" :style="{width: item.width,height: item.height}" @click="onEnlargeImageClick(index)" :src="'https://image.aftdc.com/'+item.articleImg"></image>
                    </div>
                    <video class="video" :play-status="vStatus" auto-play="true" v-if="item.video" :src="'https://image.aftdc.com/'+item.video"></video>
                </div>
                <div class="article_content" v-for="(item,index) in article" :key="index" v-if="articleInfo.imageFontRadio==0"><!--//字下图上-->
                    <!--<web ref="firWebview" class="video" src="https://www.aftdc.com/mobile/public/video.html"-->
                    <!--@pagestart="" @pagefinish="onPageFinish()" @error="" @receivedtitle="" v-if="item.video"></web>-->
                    <video class="video" auto-play="true" :play-status="vStatus" v-if="item.video" :src="'https://image.aftdc.com/'+item.video"></video>
                    <div class="imgDiv" v-if="item.articleImg!=='' && !item.video">
                        <image class="imgDefault" @load="resize(index,$event)" :style="{width: item.width,height: item.height}" @click="onEnlargeImageClick(index)" :src="'https://image.aftdc.com/'+item.articleImg"></image>
                    </div>
                    <text class="previewContent" :style="{color:template.fontColor}" v-if="item.content!==''">{{item.content}}</text>
                </div>
            </div>

            <!--<div class="vote" v-if="contentVote==1">-->
            <!--<div class="voteTitle">-->
            <!--<text class="voteTitleTextOne" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">豆腐干豆腐电电饭锅的说法饭锅地方刚发的固定法定</text>-->
            <!--</div>-->
            <!--<text class="deadline" :style="{fontSize:GLOBAL.smallFS}">截止时间: 长期有效 (最多可选5项)</text>-->
            <!--<div class="li" v-for="(item,index) in liList" :key="index" @click="voteClick(index)">-->
            <!--<image class="liIcon" :src="item.liIcon==0?'https://image.aftdc.com/appBimg/radio.png':'https://image.aftdc.com/appBimg/radio_check.png'"></image>-->
            <!--<text class="liText" :class="[item.liIcon==0?'':'liTextTwo']" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.class}} {{item.name}}</text>-->
            <!--</div>-->
            <!--<text class="voteBottom" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor}">投票</text>-->
            <!--</div>-->


            <div class="footer">
                <div v-if="articleInfo.key_word.length > 0">
                    <text class="articleLabelOn" :style="{fontSize:GLOBAL.bigFS,color:template.fontColor}">文章标签</text>
                    <div class="label">
                        <text class="labelText" v-for="item in articleInfo.key_word" :style="{fontSize:GLOBAL.defaultFS}">{{item}}</text>
                    </div>
                </div>
                <div class="readingVolume">
                    <text class="articleLabel" :style="{fontSize:GLOBAL.bigFS,color:template.fontColor}">阅读&nbsp;{{articleInfo.read_num}}</text>
                    <div class="fabulous" @click="collectAndPraise(0)">
                        <image class="zhanIcon" :src="articleInfo.isPraise==0?'https://image.aftdc.com/images/nozhan.png':'https://image.aftdc.com/images/zhan.png'"></image>
                        <text class="articleLabel" :style="{fontSize:GLOBAL.bigFS,color:template.fontColor}">{{articleInfo.praise_num}}</text>
                    </div>
                </div>
            </div>

            <div class="selectedBig"  ref="comment">
                <div class="selectedTwo aiCenter" >
                    <div class="line"></div>
                    <text :style="{fontSize:GLOBAL.biggerFS,color:template.fontColor}">{{articleInfo.commentOrleaveWord==1?'热门评论':'精选留言'}}</text>
                </div>
                <div class="mySelected" v-for="(item,index) in myPlData" :key="index" @click="toCommentDetails(item)">
                    <div class="top jcSb" @click="toPersonalHomePage(item.userId,item.aId)">
                        <div class="row aiCenter">
                            <div style="border-radius: 25px">
                                <image class="mySelectedIcon" :src="item.userPhoto"></image>
                            </div>
                            <text class="userName" :style="{fontSize:GLOBAL.bigFS,color:template.fontColorUname}">{{item.userName}}</text>
                            <text class="setTop" v-if="item.top==1">置顶</text>
                        </div>
                        <div class="zhanDiv" @click="commentFabulous(item)">
                            <image class="zhanIcon"  :src="'https://image.aftdc.com/images/'+(item.isPraise==1?'zhan.png':'nozhan.png')"></image>
                            <text :style="{fontSize:GLOBAL.defaultFS,color:template.fontColor}">{{item.praise_num==0?'赞':item.praise_num}}</text>
                        </div>
                    </div>
                    <div class="center">
                        <text class="centerText" ref="plBox" :style="{color:template.fontColor}" :class="[item.height > 274?'userCommentLine6':'']">{{item.content}}</text>
                    </div>
                    <div class="buttom jcSb">
                        <div class="row aiCenter">
                            <text :style="{fontSize:'22px',color:'#666666'}">{{item.timestamp}}</text>
                            <text :style="{fontSize:'22px',color:'#666666'}">&nbsp;·&nbsp;</text>
                            <text :style="{fontSize:'22px',color:'#666666'}" v-if="item.reply_num === 0">回复</text>
                            <text class="plReply" :style="{fontSize:'22px',color:'#666666'}" v-else>{{item.reply_num}}回复</text>
                            <text class="delectPl" :style="{fontSize:'22px',color:template.fontColorTime}" @click="delMaskShow(index)">删除</text>
                        </div>
                        <text :style="{fontSize:GLOBAL.bigFS,color:template.fontColorUname}" v-if="item.height > 300">全文</text>
                    </div>
                </div>
                <div class="mySelected" v-for="(item,index) in otherPlData" @click="toCommentDetails(item)">
                    <div class="top jcSb" @click="toPersonalHomePage(item.userId,item.aId)">
                        <div class="row aiCenter">
                            <div style="border-radius: 30px">
                                <image class="mySelectedIcon" :src="item.userPhoto"></image>
                            </div>
                            <text class="userName" :style="{fontSize:GLOBAL.bigFS,color:template.fontColorUname}">{{item.userName}}</text>
                            <text class="setTop" v-if="item.top==1">置顶</text>
                        </div>
                        <div class="zhanDiv" @click="commentFabulous(item)">
                            <image class="zhanIcon"  :src="'https://image.aftdc.com/images/'+(item.isPraise==1?'zhan.png':'nozhan.png')"></image>
                            <text :style="{fontSize:GLOBAL.defaultFS,color:template.fontColor}">{{item.praise_num==0?'赞':item.praise_num}}</text>
                        </div>
                    </div>
                    <div class="center">
                        <text class="centerText" ref="plBox" :style="{color:template.fontColor}" :class="[item.height > 274?'userCommentLine6':'']">{{item.content}}</text>
                    </div>
                    <div class="buttom jcSb">
                        <div class="row aiCenter">
                            <text :style="{fontSize:'22px',color:'#666666'}">{{item.timestamp}}</text>
                            <text :style="{fontSize:'22px',color:'#666666'}">&nbsp;·&nbsp;</text>
                            <text :style="{fontSize:'22px',color:'#666666'}" v-if="item.reply_num === 0">回复</text>
                            <text class="plReply" :style="{fontSize:'22px',color:'#666666'}" v-else>{{item.reply_num}}回复</text>
                        </div>
                        <text :style="{fontSize:GLOBAL.bigFS,color:template.fontColorUname}" v-if="item.height > 300">全文</text>
                    </div>
                </div>
                <text class="noPl" :style="{fontSize:GLOBAL.biggerFS,color:template.fontColor}" v-if="myPlData.length + otherPlData.length == 0">暂无{{articleInfo.commentOrleaveWord==1?'评论':'留言'}}</text>
                <div class="row aiCenter" v-if="commentNothing && otherPlData.length > 19">
                    <div class="nothingLine"></div>
                    <text class="commentNothing" :style="{fontSize:GLOBAL.bigFS}">没有更多了</text>
                    <div class="nothingLine"></div>
                </div>
            </div>
            <loading class="loading" @loading="loadmore" :display="loadinging ? 'show' : 'hide'" v-if="otherPlData.length > 19 && !commentNothing">
                <text :style="{fontSize:GLOBAL.bigFS,color: '#888888',lineHeight:'132px'}" >加载中...</text>
            </loading>
        </scroller>


        <!--...气泡弹出层-->
        <wxc-popover ref="wxc-popover"
                     :buttons="btns"
                     :position="popoverPosition"
                     :arrowPosition="popoverArrowPosition"
                     @wxcPopoverButtonClicked="popoverButtonClicked"></wxc-popover>
        <!--删除弹出层-->
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
                    <text class="delTips" :style="{fontSize:GLOBAL.bigFS}">确认删除此{{articleInfo.commentOrleaveWord==1?'评论':'留言'}}？</text>
                </div>
                <div class="delBtn row">
                    <text class="flex1 delCancel" :style="{fontSize:GLOBAL.bigFS}" @click="delMaskHidden">取消</text>
                    <text class="flex1" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor}" @click="deleteComment">确认</text>
                </div>
            </div>
        </wxc-mask>



        <!--举报弹层-->
        <wxc-popup popup-color="rgb(255, 255, 255)"
                   :show="isBottomShow"
                   @wxcPopupOverlayClicked="popupOverlayBottomClick"
                   pos="bottom"
                   ref="wxcPopup"
                   height="1030">
            <div class="demo-content">
                <text class="completeBtn" :style="{color:GLOBAL.dColor}" @click="reportArticle(1)">完成</text>
                <div class="reportOption row jcSb aiCenter"  @click="otherChecked">
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">其他问题,我要吐槽</text>
                    <image class="arrowIcon" src="https://image.aftdc.com/appBimg/ic_expanded_down.jpg" ></image>
                </div>
                <div class="reportOption row jcSb aiCenter" v-for="(item,index) in reportOption" @click="reportChecked(index)">
                    <text :style="{fontSize:GLOBAL.bigFS,color:item.check?'#b5b5b5':GLOBAL.dColor}">{{item.check?'已举报 ':''}}{{item.text}}</text>
                    <text class="reportRight" v-if="item.check">撤销</text>
                </div>
                <div class="reportTitle aiCenter jcCenter">
                    <text class="reportTitleText" :style="{color:GLOBAL.dColor}">举报文章问题</text>
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
        <!--查看大图弹框-->
        <wxc-popup popup-color="#000"
                   :show="enlargeImageShow"
                   @wxcPopupOverlayClicked="hide"
                   ref="wxcPopup_enlargeImage"
                   pos="right"
                   width="750">
            <div class="popupBox" >
                <slider class="enlargeImageSlider"  auto-play="false" :index="firstShowImg" >
                    <div class="enlargeImageListDiv" @click="hideEnlargeImage" :style="{height:viewportHeight+'px'}" v-for="(item, index) in enlargeImageList" >
                        <image :style="{width:item.width,height:item.height}" @load="resizes(index,$event)"   :src="'https://image.aftdc.com/'+item.img"></image>
                    </div>
                    <indicator class="imgIndicator"></indicator>
                </slider>
            </div>
        </wxc-popup>

        <!--点赞动画-->
        <image class="bigZhan" ref="test" src="https://image.aftdc.com/images/zan.png"  ></image>
        <!--分享组件-->
        <share ref="share"></share>
        <!--信息提示-->
        <toast ref="toast"></toast>
        <!--发布评论或留言时计算高度区(不显示)-->
        <text class="centerText hidden" ref="plHeightBox" >{{messageText}}</text>

    </div>

</template>

<script>

    import {WxcMask,WxcPopover,WxcMinibar,WxcPopup} from 'weex-ui';
    import Share from './Share.vue';
    const animation = weex.requireModule('animation')
    const modal = weex.requireModule('modal')
    const GLOBAL = require('@/Global.vue');
    import Toast from './Toast.vue'
    const event = weex.requireModule('event');
    const dom = weex.requireModule('dom');
    const post = weex.requireModule('stream');
    const webview = weex.requireModule('webview');
    let timer = null;

    export default {

        components: {WxcMinibar, Toast, WxcPopup,WxcMask,Share,WxcPopover},
        data() {
            return {
                userId: 0,
                id: 0,
                vStatus:'play',
                loading: true,
                textareaText: '', //吐槽输入框文本
                reportTextarea: false, //吐槽弹层
                isBottomShow: false, //举报弹层
                reportOption: [ //举报选项
                    {text:'侵权（抄袭、侵犯名誉等）',check: false},
                    {text:'涉嫌违法犯罪',check: false},
                    {text:'内容不实',check: false},
                    {text:'广告软文',check: false},
                    {text:'旧闻重复',check: false},
                    {text:'错别字多',check: false},
                    {text:'低俗色情',check: false},
                    {text:'标题夸张',check: false}
                ],
                commentNothing: false, //没有更评论或留言
                loadinging: false,
                commentIndex: 0, // 点击评论或留言删除下标
                delShow: false, // 评论或删除弹出层
                btns:[ //气泡层更多功能
                    {
                        icon: 'https://image.aftdc.com/images/ic_fenxiang.png',
                        text:'分享',
                        key:'key-scan'
                    },
                    {
                        icon: 'https://image.aftdc.com/images/share.png',
                        text:'转发',
                        key:'key-qrcode'
                    },
                    {
                        icon: 'http://image.aftdc.com/images/ly.png',
                        text:'私信',
                        key:'key-help'
                    },
                    {
                        icon: 'http://image.aftdc.com/images/icon_shopReport.png',
                        text:'举报',
                        key:'key-help'
                    }
                ],
                popoverPosition:{x:-14,y:70},
                popoverArrowPosition:{pos:'top',x:-28},

                articleInfo: {
                    key_word: []
                },//文章全部数据
                attentionType: 0,//是否关注
                template: {},//文章模板
                liIcon:0,//投标选择
                contentVote:0,//等于0是为内容,等于一为投票
                toMusic:1,//音乐
                zhanIconThree:false,//精选留言赞
                zhanIconTwo:false,//我的留言的赞
                messageBoard:true,
                inputBoard:false,//请留言的点击隐藏显示
                messageText:'',//;留言内容
                count:0,//限制投票数
                liList:[
                    {class:'初一九班',name:'第一个'},
                    {class:'初二九班',name:'第二个'},
                    {class:'初一六班',name:'第三个'},
                ],
                article: [],
                play: false,
                music:'',//默认为‘’
                current_rotate: 360,
                musicRotate: 0,
                myPlData:[], //我的评论或留言
                otherPlData: [], //其他评论或留言
                //点赞动画
                rotateRight:{
                    styles: {
                        transform: 'rotate(10deg) scale(2.3, 2.3)',
                    },
                    duration: 30,
                    timingFunction: 'linear',
                    delay: 0
                },
                rotateLeft:{
                    styles: {
                        transform: 'rotate(-10deg) scale(2.3, 2.3)',
                    },
                    duration: 30, //ms
                    timingFunction: 'linear',
                    delay: 0 //ms
                },
                scrollerComment:false,//是否滚动到评论
                //查看大图
                articleImg:[],
                viewportHeight:'',//屏幕高度
                enlargeImageShow:false,
                firstShowImg:0,//打开的图片下标
                enlargeImageList:[],
            }
        },
        created() {

            this.userId = weex.config.userId
            this.id  = weex.config.param
            this.token = weex.config.token;
            this.imei = weex.config.imei;

            this.getArticleDetail() //
            this.getArticlePl(0) //获取评论或留言

            event.init();
            event.initMusic();
        },
        mounted(){
            var that=this
            setTimeout(function () {
                dom.getComponentRect('viewport', option => {
                    that.viewportHeight=option.size.height
                })
            },0)
        },
        methods: {
            //重置图片大小
            resize (i,event) {
                if (event.success) {
                    var ratio = event.size.naturalHeight / event.size.naturalWidth
                    var width = 700
                    var height = width * ratio
                    this.$set(this.article[i],'width',width + 'px')
                    this.$set(this.article[i],'height',height + 'px')
                }
            },
            resizes (i,event) { //重置图片大小
                var that=this
                if (event.success) {
                    var ratio = event.size.naturalHeight / event.size.naturalWidth
                    var width = 750
                    var height = width * ratio
                    that.$set(that.enlargeImageList[i],'width',width + 'px')
                    that.$set(that.enlargeImageList[i],'height',height + 'px')
                }
            },
            onEnlargeImageClick(toggle){
                var that=this
                that.firstShowImg=toggle
                that.enlargeImageList=that.articleImg
                that.enlargeImageShow=true
            },
            //隐藏弹出框
            hideEnlargeImage(){
                var that=this
                that.$refs.wxcPopup_enlargeImage.hide()
            },
            //非状态组件，需要在这里关闭
            hide(){
                this.enlargeImageShow = false;
            },
            onPageFinish(){ //视频
                var that = this
                var videoUrl = []
                for(var i in this.article) {
                    if(this.article[i].video !== '') {
                        videoUrl.push(this.article[i].video)
                    }
                }
                for(var j in videoUrl) {
                    webview.postMessage(that.$refs.firWebview[j], {message: {action:1,url:'https://image.aftdc.com/'+videoUrl[j],poster:'',title:''}});
                }
            },

            reportArticle(btn) { //举报文章
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
                    param += '&id=' + that.articleInfo.id
                    param += '&img=[]'
                    param += '&reason=' + JSON.stringify(reason)
                    post.fetch({
                        method: 'POST',
                        type: 'json',
                        body: param,
                        headers: { "Content-Type": "application/x-www-form-urlencoded" },
                        url: 'https://www.aftdc.com/userapp/Article/reportArticle',
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

            },
            returnReport() { //返回按钮
                this.popupReportTextareaClick ()
                setTimeout(()=>{ this.isBottomShow = true },200)
            },
            popupReportTextareaClick () { //关闭吐槽弹层
                this.$refs.reportTextarea.hide();
                this.$refs.textarea.blur()
                setTimeout(()=>{ this.reportTextarea = false },400)
            },
            otherChecked(index) { //其他问题，我要吐槽
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
            popupOverlayBottomClick () { //关闭举报弹层
                this.$refs.wxcPopup.hide();
                setTimeout(()=>{ this.isBottomShow = false; },400)
            },
            delMaskShow(index) { //显示删除评论弹层
                this.delShow = true
                this.commentIndex = index
            },
            delMaskHidden() { //隐藏删除评论弹层
                this.delShow = false
            },
            deleteComment:GLOBAL.throttle(function() { //删除评论或留言
                var that = this
                const toast=that.$refs.toast;
                var id = that.myPlData[that.commentIndex].id
                var param = that.GLOBAL.sign(this.token,this.imei);
                param += '&id=' + id
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: 'https://www.aftdc.com/userapp/Article/deleteComment',
                }, function (res) {
                    that.delShow = false
                    if(res.data.res === 1) {
                        that.myPlData.splice(that.commentIndex,1)
                        that.articleInfo.comment_num--
                    }else if(res.data.res === -2) {
                        that.toLogin()
                    }
                    toast.editContent(res.data.info);
                });
            }),
            commentFabulous:GLOBAL.throttle(function(item){ //点赞、取消点赞评论或留言
                var that = this
                const toast=that.$refs.toast;
                var id = item.id
                var url = null
                if(item.isPraise === 1) {
                    url = 'https://www.aftdc.com/userapp/Article/cancelPraiseComment' //取消点赞
                }else {
                    url = 'https://www.aftdc.com/userapp/Article/praiseComment' //点赞
                }
                var param = that.GLOBAL.sign(this.token,this.imei);
                param += '&id=' + id
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: url,
                }, function (res) {
                    if(res.data.res === 1) {
                        if(item.isPraise === 1) {
                            item.isPraise = 0
                            item.praise_num--
                        }else {
                            that.zanAnimation()
                            item.isPraise = 1
                            item.praise_num++
                        }
                    }else if(res.data.res === -2) {
                        that.toLogin()
                    }
                });
            }),
            collectAndPraise:GLOBAL.throttle(function(type){ //收藏、取消收藏、点赞、取消点赞文章(type 0:点赞 1:收藏)
                var that = this
                const toast=that.$refs.toast;
                var id = that.articleInfo.id
                var url = null
                if(type === 1) {
                    if(that.articleInfo.isCollect === 1) {
                        url = 'https://www.aftdc.com/userapp/Article/cancelCollectArticle' //取消收藏
                    }else {
                        url = 'https://www.aftdc.com/userapp/Article/collectArticle' //收藏
                    }
                }else {
                    if(that.articleInfo.isPraise === 1) {
                        url = 'https://www.aftdc.com/userapp/Article/cancelPraiseArticle' //取消点赞
                    }else {
                        url = 'https://www.aftdc.com/userapp/Article/praiseArticle' //点赞
                    }
                }
                var param = that.GLOBAL.sign(this.token,this.imei);
                param += '&id=' + id
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: url,
                }, function (res) {
                    if(res.data.res === 1) {
                        if(type === 1) {
                            if(that.articleInfo.isCollect === 1) {
                                that.articleInfo.isCollect = 0 //取消收藏
                            }else {
                                that.articleInfo.isCollect = 1 //收藏
                            }
                            toast.editContent(res.data.info);
                        }else {
                            if(that.articleInfo.isPraise === 1) {
                                that.articleInfo.isPraise = 0 //取消点赞
                                that.articleInfo.praise_num --
                            }else {
                                that.zanAnimation()
                                that.articleInfo.isPraise = 1 //点赞
                                that.articleInfo.praise_num ++
                            }
                        }
                    }else if(res.data.res === -2) {
                        that.toLogin()
                    }
                });

            }),
            toLogin(){ //跳转到登录页面
                var that=this
                var param='';
                var url='http://assets/login.js';
                event.toUrl({"url":url,"param":param})
            },
            followClick:GLOBAL.throttle(function(){ //关注、取消关注头条作者
                var that = this
                const toast=that.$refs.toast;
                var shopId = that.articleInfo.shopId
                var url = null
                if(that.articleInfo.attentionType === 1) {
                    url = 'https://www.aftdc.com/userapp/Index/cancelAttentShop'//取消关注
                }else {
                    url = 'https://www.aftdc.com/userapp/Index/attentShop'//关注
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
                        if(that.articleInfo.attentionType === 1) {
                            that.articleInfo.attentionType = 0
                        }else {
                            that.articleInfo.attentionType = 1
                        }
                    }else if(res.data.res === -2) {
                        that.toLogin()
                    }
                    toast.editContent(res.data.info);
                });
            }),
            getArticlePl(page) { //获取评论或留言
                var that = this
                var param = 'userId=' + that.userId
                param += '&id=' + that.id
                param += '&page=' + page
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: 'https://www.aftdc.com/userapp/Article/getArticlePl',
                }, function (res) {
                    if(res.data.res === 1 ) {
                        that.loadinging = false
                        if(page === 0) {
                            that.myPlData = res.data.data.my
                            that.otherPlData = res.data.data.other

                            setTimeout(() => {
                                for(let i in that.myPlData) {
                                    dom.getComponentRect(that.$refs.plBox[i], option => {
                                        if (option.result && option.size) {
                                            that.$set(that.myPlData[i],'height',option.size.height)
                                        }
                                    })
                                }
                                for(let i in that.otherPlData) {
                                    var j = parseInt(i) + that.myPlData.length
                                    dom.getComponentRect(that.$refs.plBox[j], option => {
                                        if (option.result && option.size) {
                                            that.$set(that.otherPlData[i],'height',option.size.height)
                                        }
                                    })
                                }
                            }, 50)

                        }else {
                            that.otherPlData = that.otherPlData.concat(res.data.data.other)
                            setTimeout(()=>{//计算新添加的评论高度
                                for(let i in that.otherPlData) {
                                    var j = parseInt(i) + that.myPlData.length
                                    dom.getComponentRect(that.$refs.plBox[j], option => {
                                        if(i > page-1) {
                                            if (option.result && option.size) {
                                                that.$set(that.otherPlData[i],'height',option.size.height)
                                            }
                                        }
                                    })
                                }
                            },50)
                        }
                        if(res.data.data.other.length !== 20) {
                            that.commentNothing = true
                        }
                    }else if(res.data.res === 0) {
                        that.commentNothing = true
                    }
                })
            },
            loadmore() {
                this.loadinging = true
                setTimeout(() => {
                    this.loadinging = false
                }, 2000)
                this.getArticlePl(this.otherPlData.length)
            },

            minibarRightButtonClick () { //...更多功能气泡层弹出
                this.$refs['wxc-popover'].wxcPopoverShow();
            },
            popoverButtonClicked (obj) { //...更多功能选中
                const toast=this.$refs.toast;
                switch(obj.index) {
                    case 0:
                        this.articleShare()
                        break
                    case 1:
                        var param = JSON.stringify({articleId:this.articleInfo.id,shopImg:this.articleInfo.shopImg,title:this.articleInfo.title})
                        var url='http://assets/forward.js';
                        event.toUrl({ "url": url, "param": param });
                        break
                    case 2:
                        var param = this.articleInfo.shopId;
                        var url='http://assets/contact.js';
                        event.toUrl({ "url": url, "param": param });
                        break
                    case 3:
                        this.isBottomShow = true;
                        break
                }
            },

            articleShare() {//分享
                var wxappPart = '';					                                                                //小程序路径
                var webUrl = 'https://www.aftdc.com/mobile/article/articleDetail.html?id=' + this.articleInfo.id;	//网页链接
                var title = this.articleInfo.title;						                                        //分享标题
                var shareImg = 'https://image.aftdc.com/' + this.articleInfo.shopImg;                             //分享缩略图片
                var description = this.article[0].content.slice(0,20);					                            //分享描述
                var scene = 2;
                const share = this.$refs.share;
                share.show(false,true,true,false,false,false,true,false,wxappPart,webUrl,title,shareImg,description,scene);
            },
            getArticleDetail() {
                var that = this
                var param = 'userId=' + that.userId
                param += '&id=' + that.id
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: 'https://www.aftdc.com/userapp/Article/articleDetail',
                }, function (res) {
                    if(res.data.res === 1 ) {
                        setTimeout(()=>{
                            that.loading = false
                        },100)

                        that.articleInfo = res.data.data
                        that.template = res.data.data.template
                        that.shopId = res.data.data.shopId

                        var article = res.data.data.content
                        var articleImg = []
                        for (var i in article) {
                            article[i].width = '700px'
                            article[i].height = '525px'
                            if(article[i].articleImg){
                                var obj={img:article[i].articleImg,width:'750px',height:'525px'}
                                articleImg.push(obj)
                            }
                        }
                        that.article = article
                        that.articleImg=articleImg
                    }
                })
            },



            voteClick(index){//投票
                if(this.liList[index].liIcon==0){
                    if(this.count<5){
                        this.count++;
                        this.liList[index].liIcon=1;
                    }
                }
                else if(this.liList[index].liIcon==1){
                    this.count--;
                    this.liList[index].liIcon=0;

                }
            },
            blurClick(){
                var that=this
                if(that.inputBoard) {
                    that.$refs.inputMessage.blur()//点击其他时键盘失去焦点
                    setTimeout(function () {
                        that.inputBoard=false;
                    },100)
                }

            },

            leavingClick(){
                var that=this;
                setTimeout(function () {
                    that.$refs.inputMessage.focus();
                },100)
                that.inputBoard=true;
            },
            sendClick(){ //发布评论或留言
                var that = this
                var height = 0
                dom.getComponentRect(that.$refs.plHeightBox, option => { //计算我发布评论的高度，超出六行省略显示全文
                    if (option.result && option.size) {
                        height = option.size.height
                    }
                })
                that.$refs.inputMessage.blur()
                that.inputBoard = false;
                const toast = that.$refs.toast;
                var param = that.GLOBAL.sign(this.token,this.imei);
                param += '&id=' + that.articleInfo.id
                param += '&content=' + that.messageText
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: 'https://www.aftdc.com/userapp/Article/commentArticle',
                }, function (res) {
                    that.messageText = ''
                    if(res.data.res === 1) {
                        if(that.articleInfo.commentOrleaveWord === 1) {
                            res.data.data.height = height
                            that.myPlData.unshift(res.data.data)
                            that.articleInfo.comment_num++
                        }
                    }else if(res.data.res === -2) {
                        that.toLogin()
                    }
                    toast.editContent(res.data.info);
                });
                setTimeout(()=>{
                    that.scrollerComment = true
                    dom.scrollToElement(that.$refs.comment, {})
                },200)
            },

            musicPlay(){ //播放音乐
                if (this.play) {
                    this.vStatus = 'play'
                    this.play = false;
                    event.pauseMusic()
                    //播放音乐动画关闭效果
                    this.musicRotate -= 360
                    clearInterval(timer)
                }else {
                    this.vStatus = 'pause'
                    this.play = true;
                    var musicPart = this.articleInfo.music.musicPath
                    event.playMusic('https://image.aftdc.com/'+musicPart)
                    //播放音乐动画开启效果
                    this.musicRotate += 360
                    timer = setInterval(()=>{
                        this.musicRotate += 60
                    },1000)
                }
            },
            viewdisappear() { //页面关闭时停止音乐
                if (this.play) {
                    this.play = false;
                    event.pauseMusic()
                    //播放音乐动画关闭效果
                    this.musicRotate -= 360
                    clearInterval(timer)
                }
            },
            zanAnimation(){ //点赞动画
                var that=this
                var testEl = that.$refs.test;
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
                        animation.transition(testEl, that.rotateLeft,function () {
                            animation.transition(testEl, that.rotateRight,function () {
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
            },
            toRefue:GLOBAL.throttle(function(){ //跳转到帮他加油页面
                var data = {
                    articleId: this.articleInfo.id,
                    shopId: this.articleInfo.shopId,
                    title: this.articleInfo.title,
                    description: this.article[0].content.slice(0,20)
                }
                var param = JSON.stringify(data);
                var url = 'http://assets/refue.js';
                event.toUrl({"url":url,"param":param})
            }),
            domScoller(){
                var that=this
                if(!that.scrollerComment){
                    that.scrollerComment=true
                    dom.scrollToElement(this.$refs.comment, {})
                }else{
                    that.scrollerComment=false
                    dom.scrollToElement(this.$refs.title, {})
                }
            },
            toShopDetails(){ //跳转到商家个人主页
                var param=this.articleInfo.acticleAccount;
                var url='http://assets/headLineArticle.js';
                event.toUrl({"url":url,"param":param})
            },
            toPersonalHomePage:GLOBAL.throttle(function(userId,aId){ //跳转到用户个人主页
                var param = JSON.stringify({id:userId,acticleAccount:aId});
                var url='http://assets/personalHomepage.js';
                event.toUrl({"url":url,"param":param})
            }),
            toCommentDetails:GLOBAL.throttle(function(item){ //跳转到评论详情
                if(this.articleInfo.commentOrleaveWord==1){
                    var param=JSON.stringify({comment:item,articleId:item.id});
                    var url='http://assets/commentDetails.js';
                    event.toUrl({"url":url,"param":param})
                }
            }),
            minibarLeftButtonClick(){

            },

        }
    }
</script>

<style scoped>
    .video {/*688*420   750*450*/
        position: relative;
        width: 690px;
        height: 414px;
        margin-top: 20px;
        background-color: #000000;
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

    .commentNothing {
        color: #999;
        text-align: center;
        margin-top: 14px;
        margin-bottom: 14px;
        margin-left: 20px;
        margin-right: 20px;
    }
    .nothingLine {
        flex: 1;
        border-bottom-style: solid;
        border-bottom-width: 1px;
        border-bottom-color: #ccc;
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

    .hidden {
        position: fixed;
        top: 0;
        left: -800px;
        background-color: #fff;
    }
    .delTips {
        color: #555;
        font-size: 28px;
        line-height: 40px;
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

    .noPl {
        text-align: center;
        margin-top: 100px;
        margin-bottom: 100px;
    }
    .userCommentLine6 {
        lines: 6;
        text-overflow: ellipsis;
    }
    .plReply {
        background-color: #f8f8f8;
        padding-bottom: 3px;
        padding-top: 3px;
        padding-right: 15px;
        padding-left: 15px;
        border-radius: 20px;
    }
    .delectPl {
        margin-left: 13px;
        padding-bottom: 6px;
        padding-top: 6px;
        padding-right: 12px;
        padding-left: 12px;
    }
    .setTop {
        font-size: 20px;
        color: #fff;
        background-color: #c5c5c5;
        padding-bottom: 3px;
        padding-top: 3px;
        padding-right: 5px;
        padding-left: 5px;
        border-radius: 3px;
    }
    .jcSb {
        justify-content: space-between;
    }
    .navigationRightIcon {
        width: 50px;
        height: 50px;
    }
    .dColor {
        color: #666;
    }
    .templateBgImg {
        width: 750px;
        height: 750px;
        position: absolute;
        top: 0;
        left: 0;
    }

    .lineHeight28 {
        line-height: 28px;
    }
    .releaseBtn {
        padding-left: 28px;
        padding-right: 20px;
        padding-top: 20px;
        padding-bottom: 20px;
        font-weight: bold;
        color: #999;
    }
    .releaseColor{
        color: #53beb7;
    }
    .commentInput {
        width: 546px;
        height: 90px;
        padding-top: 20px;
        padding-bottom: 22px;/*94 65*/
        margin-left: 20px;
        placeholder-color:#999;

    }
    .grayBg {
        width: 586px;
        height: 60px;
        position: absolute;
        top: 15px;
        left: 0;
        border-width: 1px;
        border-style: solid;
        border-color: #edeeee;
        border-radius: 50px;
        background-color: #f4f5f6;
    }
    .commentInputBg {
        width: 586px;
        margin-left: 30px;
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
    .minibar {
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: #f1f1f1;
    }
    .bigZhan{
        width: 160px;
        height: 160px;
        opacity: 0;
        position: absolute;
        top: 500px;
        left: 300px;
    }
    .voteBottom{
        padding-top: 30px;
        padding-bottom: 30px;
        text-align: center;


    }
    .voteBottom:active{
        color: #999;
    }
    .liIcon{
        width: 40px;
        height: 40px;
    }
    .liText{
        margin-left: 20px;
    }
    .liTextTwo{
        color: #53beb7;
    }
    .li{
        flex-direction: row;
        align-items: center;
        padding-top: 30px;
        padding-bottom: 30px;
        border-bottom-style: solid;
        border-bottom-width: 2px;
        border-bottom-color: #53beb7;
    }
    .deadline{
        color: #999;
    }
    .vote{
        margin-top: 30px;
        padding-left: 20px;
        padding-right: 20px;
        margin-left: 40px;
        margin-right: 40px;
        background-color:#FFF ;
        border-radius: 15px;
        border-style: solid;
        border-width: 2px;
        border-color: #888;
    }
    .voteTitle{
        flex-direction: row;
        align-items: center;
    }
    .voteTitleTextOne{
        font-weight: bold;
        padding-top: 30px;
        padding-bottom: 30px;
        max-width: 630px;

    }
    .A{
        padding-left: 30px;
        padding-right: 30px;
    }

    .zhanDiv{
        flex-direction: row;
        align-items: center;
    }

    .messageBoardTwo{
        background-color: #fff;
        width: 750px;
        height: 90px;
        align-items: center;
        border-top-style: solid;
        border-top-width: 2px;
        border-top-color: #f1f1f1;
    }
    .mySelected{
        padding-top: 30px;
        padding-bottom: 30px;
        padding-left: 30px;
        padding-right: 30px;
    }
    .mySelected:active {
        background-color: #f0f0f0;
    }
    .follow{
        background-color: #00b8a5;
    }
    .leavingMessageIcon{
        width: 27px;
        height: 27px;
    }
    .leavingMessage{
        margin-left:15px;
    }
    .scroller{
        position: absolute;
        top: 90px;
        left: 0;
        right: 0;
        bottom: 100px;
    }
    .leavingMessageDiv{
        flex-direction: row;
        align-items: center;
        background-color: #f1f1f1;
        height: 60px;
        padding-left: 30px;
        /*margin-right: 25px;*/
        margin-right: 36px;
        border-radius: 30px;
        /*width: 375px;*/
        flex: 4;
    }
    .headline{
        /*flex: 1;*/
        flex-direction: row;
        align-items: center;
        /*padding-left: 25px;*/
        /*padding-right: 25px;*/
        padding-top: 25px;
        padding-bottom: 25px;
        position: relative;
    }
    .commentIcon {
        height: 40px;
        width: 40px;
    }
    .commentNumber {
        position: absolute;
        top: 18px;
        right: 36px;
        width: 52px;
        flex-direction: row;
        justify-content: center;
    }
    .commentNumberText {
        color: #fff;
        font-size: 18px;
        text-align: center;
        line-height: 22px;
        background-color: #f85656;
        border-radius: 11px;
        padding-left: 5px;
        padding-right: 5px;
    }
    .messageBoard{
        height: 90px;
        padding-left: 30px;
        padding-right: 30px;
        border-top-style: solid;
        border-top-width: 2px;
        border-top-color: #f1f1f1;
        flex-direction: row;
        align-items: center;
        background-color: #fff;
    }
    .selectedBig{
        /*padding-left: 30px;*/
        /*padding-right: 30px;*/
    }
    .buttom{
        flex-direction: row;
        align-items: center;
        margin-left: 82px;
        margin-top: 10px;
    }

    .centerText{
        font-size: 30px;
        flex: 1;
        width: 580px;
        line-height: 46px;
    }
    .center{
        flex-direction: row;
        align-items: center;
        margin-left: 82px;
    }

    .userName{
        margin-left: 20px;
        max-width: 300px;
        lines: 1;
        text-overflow: ellipsis;
    }
    .top{
        flex-direction: row;
        align-items: center;
    }
    .mySelectedIcon{
        border-radius: 30px;
        width: 60px;
        height: 60px;
    }

    .line{
        height: 34px;
        width: 6px;
        background-color: red;
        margin-right: 14px;
    }

    .selectedTwo{
        padding-left: 30px;
        padding-right: 30px;
        padding-top: 30px;
        padding-bottom: 30px;
        flex-direction: row;
        align-items: center;
    }
    .fabulous{
        margin-left: 40px;
        margin-right: 40px;
        flex-direction: row;
        align-items: center;
    }
    .zhanIcon{
        width: 35px;
        height: 35px;
        margin-right: 5px;
    }
    .readingVolume{
        flex-direction: row;
        align-items: center;
        /*padding-top: 30px;*/
        padding-bottom: 30px;
    }
    .labelText{
        color: #999;
        background-color: #f8f8f8;
        padding-top: 20px;
        padding-right: 30px;
        padding-bottom: 20px;
        padding-left: 30px;
        margin-right: 10px;
        border-radius: 15px;
    }
    .label{
        flex-direction: row;
        align-items: center;
        flex-wrap: wrap;
        margin-bottom: 20px;
        margin-top: 20px;
    }
    .articleLabel{
        padding-top: 20px;
        padding-bottom: 20px;
    }
    .footer{
        padding-top: 20px;
        padding-left: 30px;
        padding-right: 30px;
    }
    .titleContentCenter{
        flex: 1;
    }
    .titleContentRight{
        padding-top: 13px;
        padding-bottom: 13px;
        width: 100px;
        text-align: center;
        color: #fff;
        background-color: #e16456;
        border-radius: 8px;
        margin-top: 20px;
    }
    .shopName{
        flex-direction: row;
        align-items: center;
    }
    .shopNameTwo{
        flex-direction: row;
        align-items: center;
        margin-top: 15px;
    }
    .shopNameTitle{
        font-weight: 600;
        margin-left: 20px;
        max-width: 300px;
        text-overflow:ellipsis;
        lines:1;
    }
    .size{
        font-size: 24px;
        margin-left: 20px;
        color: #6f6f6f;
    }
    .titleContentLeft{
        width: 110px;
        height: 110px;
        border-radius: 55px;
    }
    .titleContent{
        flex-direction: row;
        align-items: center;
        margin-top: 20px;
    }
    .text{
        font-weight: 700;
        margin-top: 40px;
        margin-bottom: 10px;
        font-size: 38px;

    }
    .wrapper {
        position: relative;
        flex-direction: column;
    }




    .content {
        padding-top: 20px;
        margin-left: 30px;
        margin-right: 30px;
    }

    .article_content {
        /*margin-top: 40px;*/
    }

    .previewContent {
        font-size: 30px;
        margin-top: 20px;
        line-height: 48px;
    }

    .imgDefault {
    }

    .imgDiv {
        flex-direction: row;
        align-items: center;
        justify-content: center;
        margin-top: 20px;
    }
    /* 音乐播放 */
    .article_music {
        flex-direction: row;
        align-items: center;
        padding-top: 20px;
        padding-left: 20px;
        padding-bottom: 20px;
        background-color: #f8f8f8;
        border-radius: 10px;
    }
    .musicIcon{
        width: 35px;
        height: 35px;
        margin-right: 15px;
    }
    .musicTextSize{
        align-items: center;
        flex-direction: row;
        justify-content: center;
    }
    .musicImg {
        position:fixed;
        width:75px;
        height:75px;
        top:160px;
        right:43px;
        /*animation:musicImg 6s linear infinite;*/
        transition: transform 6s linear;
        background-color: #fff;
        border-radius: 100px;
    }
    .loadingAin {
        background-color: #fff;
        position: fixed;
        top: 90px;
        left: 0;
        right: 0;
        bottom: 0;
    }
    .indicator {
        height: 145px;
        width: 200px;
        color: #53beb7;
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
        justify-content: center;
        align-items: center;

    }
    .enlargeImageListDiv{
        justify-content: center;
        align-items: center;
        width: 750px;
    }
    .imgIndicator {
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
</style>
