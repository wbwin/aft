<template>
    <div class="wrapper" @viewappear="viewappear" @viewdisappear="viewdisappear">
        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    @wxcMinibarRightButtonClicked="minibarRightButtonClick"
                    :use-default-return="false"
                    v-once
            >
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">阿凡提商家</text>
                <text :style="GLOBAL.headerRight"  slot="right">下一步</text>
            </wxc-minibar>
        </div>

        <scroller class="scroller">
            <div class="articleTop">
                <!--<image class="coverImg" src="https://image.aftdc.com/appBimg/ic_app_logo.jpg"></image>-->
                <textarea class="articleTitle" v-model="articleTitle" rows="4" maxlength="32" placeholder="点击输入文章标题(最多输入32个字符)" ref="firInput" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}" ></textarea>
                <div class="tips" v-if="articleTitle==''" @click="showTips()">
                    <text class="helpSize" :style="{fontSize:GLOBAL.biggerFS}">?</text>
                </div>
                <!--<div class="changeCoverImg">-->
                <!--<image class="icon_pictureImg" src="https://image.aftdc.com/appBimg/icon_picture.png"></image>-->
                <!--<text class="defaultSize coverImgText">更换封面</text>-->
                <!--</div>-->
            </div>


            <div class="addArticle" v-if="article" v-for="(item,index) in article" ref="addArticleCell">
                <image class="icon_addArticle" src="https://image.aftdc.com/appBimg/icon_addArticle.png"
                       @click="addClick(index)" ref='addArticle'></image>
                <div class="addArticleCell" v-if="!item.isFalse">

                        <div class="addImg" @click="changeVideo(index)" v-if="item.video">
                            <image resize="cover" class="imgDefault contentImg" v-if="videoCover==''||!videoCover"
                                   src="https://image.aftdc.com/appBimg/icon_default.gif"></image>
                            <image resize="cover" class="imgDefault contentImg" v-else :src="videoCover"></image>
                            <text class="addImgText">更换视频</text>
                        </div>
                        <div class="addImg" @click="changeImg(index)" v-else>
                            <image resize="cover" class="imgDefault contentImg" v-if="item.localPart==''||!item.localPart"
                                   src="https://image.aftdc.com/appBimg/icon_default.gif"></image>
                            <image resize="cover" class="imgDefault contentImg" v-else :src="item.localPart"></image>
                            <text class="addImgText">修改图片</text>
                        </div>
                        <div class="fontText" v-if="item.video">
                            <text :style="{fontSize:GLOBAL.bigFS,color:'#999'}"></text>
                        </div>
                        <div class="fontText" @click="toArticleText(index)" v-else>
                            <!--<textarea class="contentTextarea" v-model="item.content" rows="4" :placeholder="item.content==''?'点击输入文章内容':'点击输入文章内容吧'":style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}"></textarea>-->
                            <text :style="{fontSize:GLOBAL.bigFS,color:'#999'}" v-if="item.content==''">点击添加文字</text>
                            <text class="articleContentText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}" v-if="item.content!=''">{{item.content}}</text>
                        </div>

                        <div class="articCellButton">
                            <wxc-icon name="close" :icon-style="iconStyle" @wxcIconClicked="delArtice(index)"></wxc-icon>
                        </div>
                </div>
                <div class="addArticleCell" v-if="vote" @click="toVoteSetting">
                    <!--<div class="imgAText">-->
                    <div class="voitImg">
                        <div class="voitImgContent" v-for="i in 3">
                            <div class="circle"></div>
                            <div class="line"></div>
                        </div>
                        <text class="voitImgText">投票</text>
                    </div>
                    <div class="fontText" @click="toArticleText(index)">

                        <text class="articleContentText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}" >{{vote.voteTopic}}</text>
                    </div>
                    <div class="articCellButton">
                        <wxc-icon name="close" :icon-style="iconStyle" @wxcIconClicked="delVote()"></wxc-icon>
                    </div>
                </div>
                <div class="bubbleMenu" ref="bubbleMenu">

                    <div class="bubbleMenuContent" v-if="bubble[index]">
                        <div class="menuContent" :style="{opacity:article.length>=50?0.5:1}" @click="menuJump(0,index)">
                            <image class="imgDefault"
                                   src="https://image.aftdc.com/appBimg/icon_articlePicture.png"></image>
                            <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">图文</text>
                        </div>
                        <div class="menuContent" :style="{opacity:article.length>=50?0.5:1}" @click="menuJump(3,index)">
                            <image class="imgDefault"
                                   src="https://image.aftdc.com/appBimg/write.png"></image>
                            <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">文字</text>
                        </div>
                        <div class="menuContent" :style="{opacity:article.length>=50?0.5:1}" @click="menuJump(2,index)">
                            <image class="imgDefault"
                                   src="https://image.aftdc.com/appBimg/uploadVideo.png"></image>
                            <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">视频</text>
                        </div>
                        <div class="menuContent" :style="{opacity:vote?0.5:1}" @click="menuJump(1,index)">
                            <image class="imgDefault"
                                   src="https://image.aftdc.com/appBimg/icon_vote.png"></image>
                            <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">投票</text>
                        </div>

                    </div>
                    <div class="triangle" v-if="bubble[index]"></div>
                </div>
            </div>

        </scroller>
        <wxc-mask height="670"
                  width="600"
                  :top="top"
                  border-radius="10"
                  duration="0"
                  mask-bg-color="rgba(0,0,0,0)"
                  :show="show"
                  :has-animation="hasAnimation"
                  :overlay-can-close="overlaycanclose"
                  @wxcMaskSetHidden="wxcMaskSetHidden"
        >
            <div class="content">
                <div class="maskTitle">
                    <text class="maskTitleSize" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">小提示</text>
                </div>
                <div class="mask_content">
                    <text class="mask_contentText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">1.一个好的文章标题会给你带来更多阅读哦。</text>
                </div>
                <div class="mask_content">
                    <text class="mask_contentText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">2.标题是文章精华的提炼,试试用筒短的一句话了概括文章要讲述的内容吧!</text>
                </div>
                <div class="mask_content">
                    <text class="mask_contentText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">3.多多观察优秀作品的标题也许会找到更多灵感。</text>
                </div>
                <wxc-button class="sureButton" text="确定" :textStyle="textStyle" :btn-style="sureBtnStyle"
                            @wxcButtonClicked="wxcSureButtonClicked"></wxc-button>
            </div>
        </wxc-mask>
        <!--微信取消绑定弹出框-->
        <wxc-mask height="200"
                  width="600"
                  border-radius="10"
                  duration="200"
                  mask-bg-color="#FFFFFF"
                  :has-animation="true"
                  :has-overlay="true"
                  :show-close="false"
                  :show="saveShow"
                  @wxcMaskSetHidden="wxcMaskSetHidden">
            <div class="content">
                <text class="contentText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">是否存为草稿?</text>
                <div class="btnDiv">
                    <text style="flex: 1;"></text>
                    <text class="cancel" @click="backClick(0)" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">否</text>
                    <text class="confirm" @click="backClick(1)" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}">是</text>
                </div>
            </div>
        </wxc-mask>
        <toast ref="toast"></toast>
    </div>
</template>

<script>

    import {WxcDialog, WxcButton, WxcIcon, WxcMask, WxcMinibar} from 'weex-ui';
    import Toast from './Toast.vue';
    import {WxcPopover} from 'weex-ui';
    const post = weex.requireModule('stream');
    const modal = weex.requireModule('modal');
    const animation = weex.requireModule('animation');
    const event = weex.requireModule('event');
    const navigator = weex.requireModule('navigator');
    export default {
        components: {WxcButton, WxcDialog, Toast, WxcPopover, WxcIcon, WxcMask, WxcMinibar},
        data() {
            return {
                backImgToggle: 0,//头部返回图片判断
                backShow: false,
                iconStyle: {
                    fontSize: '35px',
                },
                show: false,
                videoShow: false,
                saveShow:false,
                hasAnimation: true,
                overlaycanclose: true,
                top: 0,
                textStyle: {
                    color: '#fff'
                },
                sureBtnStyle: {
                    backgroundColor: '#53beb7',
                    width: '540',
                    borderColor: '#666',
                    borderWidth: '1px',
                    borderStyle: 'solid'
                },
                articleTitle: '',//文章标题
                article: [
                    // {localPart: '',articleImg:'', content: '试试用筒短的一句话了概括文章要讲述的内容吧试试用筒短的一句话了概括文章要讲述的内容吧试试用筒短的一句话了概括文章要讲述的内容吧试试用筒短的一句话了概括文章要讲述的内容吧试试用筒短的一句话了概括文章要讲述的内容吧试试用筒短的一句话了概括文章要讲述的内容吧试试用筒短的一句话了概括文章要讲述的内容吧试试用筒短的一句话了概括文章要讲述的内容吧试试用筒短的一句话了概括文章要讲述的内容吧'},
                    {localPart: '',articleImg:'', content: '',video:'',isFalse:true},
                ],//文章个数，，默认一个且为空

                articleType: 2,//1为图片，2为文字，3为视频
                // addButton:true,//控制是否还可以添加文章，当article长度为9时不能，当articleType=3且article长度为1时不能
                vote:'',//无设置投票时为'',{title:'啊啊啊啊啊啊啊啊'}
                pageBack: false,
                ok:1,
                bubble: [true],
                //每当新添加一个article时就在这个数据的头部添加一个false，article为空时bubble为[true];
                articleData:{},
                videos:{
                    video:'',
                    videoCover:'',
                    videos:'',//+s表示本地
                    videoCovers:'',
                },
                videoCover:'',
                video:'',
                imgNum:0,
                imgNums:0,
                token: '',
                imei: '',
            }
        },
        created() {
            this.token = weex.config.token;
            this.imei = weex.config.imei;
            var that = this
            var param = weex.config.param;
            if (param) {
                var articleId = JSON.parse(param).articleId;
                var param = this.GLOBAL.sign(this.token,this.imei);
                param += '&articleId='+ articleId;
                post.fetch({
                    method: 'post',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/businessapp/Article/articleDetail',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                },function(res){
                    if (res.data.res==1){
                        console.log(res.data.data)
                        that.bubble[0] = false
                        var article = res.data.data.content
                        if (res.data.data.content!=[]){
                            for (var i in article) {
                                that.bubble.unshift(false)//每当新添加一个article时就在这个数据的头部添加一个false
                                if (article[i].articleImg!='') {
                                    article[i].localPart = 'https://image.aftdc.com/'+article[i].articleImg
                                }else{
                                    article[i].localPart = ''
                                }

                            }
                            var lastObj={localPart: '',articleImg:'', content: '',isFalse:true}
                            article.push(lastObj)
                            that.article = article
                        }
                        if (res.data.data.video!='') {
                            var videos = {
                                video:res.data.data.video,
                                videoCover:res.data.data.cover_img?res.data.data.cover_img[0]:'',
                                videos:'https://image.aftdc.com/'+res.data.data.video,//+s表示本地
                                videoCovers:'https://image.aftdc.com/'+res.data.data.cover_img[0]
                            }
                            that.video = videos.videos

                            that.videoCover = videos.videoCovers
                            that.videos = videos
                        }

                        that.articleTitle = res.data.data.title
                        that.vote = res.data.data.vote

                        that.articleData.id = res.data.data.id
                        that.articleData.cover_type = res.data.data.cover_type
                        that.articleData.cover_img = res.data.data.cover_img
                        that.articleData.template = res.data.data.template
                        that.articleData.music = res.data.data.music
                        that.articleData.commentOrleaveWord = res.data.data.commentOrleaveWord
                        that.articleData.open = res.data.data.open
                        that.articleData.imageFontRadio = res.data.data.imageFontRadio

                    }
                })
            }

            event.init();
            weex.requireModule('globalEvent').addEventListener("upLoadFile",function(e){
                if (e.upLoad == 1){
                    that.updata(e)
                }
            });
        },
        mounted: function() {
            //去掉回车换行
            this.$refs.firInput.setTextFormatter({
                formatRule: "/[\\n]/g",
                formatReplace: "$1 ",
                recoverRule: "/\\n/g",
                recoverReplace: ""
            })
        },
        methods: {
            addClick(index) {
                var that = this
                var bubbleMenu = that.$refs.bubbleMenu[index];
                if (that.bubble[index] == true) {
                    that.animationHide(bubbleMenu, index)
                } else {
                    var bubbleMenuHide = that.$refs.bubbleMenuLast;
                    that.animationHide(bubbleMenuHide, that.bubble.length - 1)
                    for (var i = 0; i < that.bubble.length; i++) {

                        if (index != i) {
                            var bubbleMenuHide = that.$refs.bubbleMenu[i];
                            that.animationHide(bubbleMenuHide, i)
                        }
                    }
                    that.animationShow(bubbleMenu, index);
                }
            },
            menuJump(toggle, index) {
                var that = this

                // if (index == that.bubble.length - 1) {
                //     var bubbleMenu = that.$refs.bubbleMenuLast;
                // } else {
                var bubbleMenu = that.$refs.bubbleMenu[index];
                // }

                if (that.article.length >= 50) {
                    that.animationHide(bubbleMenu, index)
                }else{
                    that.animationHide(bubbleMenu, index+1)
                }

                if(toggle==0){
                    var toast = that.$refs.toast;
                    if (that.article.length > 50) {
                        toast.editContent('当前一篇文章只支持插入50个段落');
                        return false
                    }
                    this.selectIndex = index
                    var imgNum = 0;
                    var article = this.article
                    for (var i in article) {
                        if (article[i].articleImg)
                            imgNum++;
                    }
                    event.selectImg(50-imgNum,'')
                    that.bubble.unshift(false)
                }else if(toggle==1){
                    if(that.vote){
                        var toast = that.$refs.toast;
                        toast.editContent('一篇文章只能设置一个投票');
                        return false
                    }
                    var param={
                        inArticle:1,
                        vote:this.vote
                    };
                    var url='http://assets/voteSetting.js';
                    event.toUrl({"url":url,"param": JSON.stringify(param)})
                }else if (toggle==2||toggle==3){
                    if(toggle==2){
                        if (that.video) {
                            var toast = that.$refs.toast;
                            toast.editContent('一篇文章只能设置一个视频');
                            return false
                        }
                        event.chooseVideo()
                    }
                    var article={localPart: '',articleImg:'', content: '',video:''};
                    if(index!=that.bubble.length - 1){//点击有index的添加按钮
                        var newArticle=that.article.slice(index)
                        that.article.splice(index,that.article.length-index)
                        newArticle.unshift(article)
                        that.article=that.article.concat(newArticle)
                        that.bubble.unshift(false)
                    }
                    if(index==that.bubble.length - 1){//点击最后一个添加按钮
                        that.article.splice(that.article.length-1,0,article)
                        that.bubble.unshift(false)
                    }
                    this.selectIndex = index
                }
            },
            animationShow(obj, index) {
                var that = this
                that.$set(that.bubble, index, true)

                animation.transition(obj, {
                    styles: {
                        transform: 'scale(1)',

                        transformOrigin: 'center top'

                    },
                    duration: 200, //ms
                    timingFunction: 'ease',
                    delay: 0 //ms
                })
            },
            animationHide(obj, index) {
                var that = this
                animation.transition(obj, {
                    styles: {
                        transform: 'scale(0.01)',

                        transformOrigin: 'center top'
                    },
                    duration: 200, //ms
                    timingFunction: 'ease',
                    delay: 0 //ms
                }, function () {

                    that.$set(that.bubble, index, false)
                    console.log(that.bubble)
                })
            },
            showTips() {
                var that = this;
                that.show = true;
            },
            wxcSureButtonClicked() {
                var that = this
                that.show = false
            },
            wxcMaskSetHidden() {
                var that = this
                that.show = false
                that.videoShow = false
                that.saveShow=false
                this.resetClick()
            },

            delArtice(index) {
                var that = this;
                modal.confirm({
                    message: '确定删除此段',
                    okTitle: '确定',
                    cancelTitle: '取消'
                }, result => {
                    if (result == '确定') {
                        var obj = that.$refs.addArticleCell[index]
                        animation.transition(obj, {
                            styles: {
                                transform: 'translate(750px,0px)',
                            },
                            duration: 300, //ms
                            timingFunction: 'ease',
                            delay: 0 //ms
                        }, function () {
                            var obj = that.$refs.addArticleCell[index]
                            animation.transition(obj, {
                                styles: {
                                    transform: 'translate(0px,0px)',
                                },
                                duration: 0, //ms
                                timingFunction: 'ease',
                                delay: 0 //ms
                            },function () {

                            })
                            if (that.article[index].video) that.delVideo();
                            that.article.splice(index, 1);
                        })
                    }
                })
            },
            delVideo(){
                this.video = ''
                event.deleteVideo();
            },
            delVote(){
                var that = this;
                modal.confirm({
                    message: '确定删除投票',
                    okTitle: '确定',
                    cancelTitle: '取消'
                }, result => {
                    if (result == '确定') {
                        that.vote=''
                    }
                })
            },
            minibarRightButtonClick() {
                if (!this.minibarRightButtonClicks){
                    this.minibarRightButtonClicks = true
                    var that = this;
                    if (that.articleTitle == '') {
                        const toast = that.$refs.toast;
                        toast.editContent('请先输入文章标题');
                        this.resetClick()
                        return false
                    }
                    for (var i=0,len=that.article.length-1;i<len;i++) {
                        if (that.article[i].content==''&&that.article[i].localPart=='') {
                            that.article.splice(i,1)
                        }
                    }
                    if (!that.video&&that.article.length < 2) {
                        const toast = that.$refs.toast;
                        toast.editContent('至少添加一个段落才能发布哦');
                        this.resetClick()
                        return false
                    }

                    var title = that.articleTitle
                    title = title.replace(/[\r\n]/g,"");
                    title = title.substring(0, 32);

                    this.articleData.title = title
                    this.articleData.article = that.article
                    this.articleData.vote = that.vote
                    this.articleData.videos = that.videos

                    //如果有图片，且没有封面样式，默认封面样式
                    var cover_type = this.articleData.cover_type
                    var url = 'http://assets/coverStyle.js';
                    if(!cover_type||cover_type == 4||that.video){
                        if (that.video) { //如果有视频，默认使用视频的封面图
                            url = 'http://assets/articlePreview.js';
                            this.articleData.cover_type = 2

                            this.articleData.cover_img = []
                            this.articleData.cover_img_local = []
                            this.articleData.cover_img[0] = that.videos.videoCover;
                            this.articleData.cover_img_local[0] = {
                                cover_img:that.videos.videoCover,
                                localImg:that.videos.videoCovers
                            }
                        }else{
                            var a= this.article
                            for (var i in a) {
                                if (a[i].articleImg) {
                                    var coverImg = []
                                    coverImg[0] = a[i].articleImg
                                    this.articleData.cover_type = 2
                                    this.articleData.cover_img = coverImg
                                    var coverImgs = []
                                    coverImgs[0] = a[i].localPart
                                    this.articleData.cover_img_local = coverImgs
                                    break;
                                }
                            }
                        }
                    }

                    event.save('articleData',JSON.stringify(this.articleData));
                    event.toUrl({url:url,param:''});
                }
            },
            minibarLeftButtonClick() {
                if (!this.minibarLeftButtonClicks) {
                    this.minibarLeftButtonClicks = true
                    if (this.articleData.open==0||!this.articleData.open) {
                        if (this.articleTitle||(this.article.length>=1&&(this.article[0].articleImg!=''||this.article[0].content!='')))
                            this.saveShow=true
                        else
                            navigator.pop({ animated: 'true' });
                    }else{
                        navigator.pop({ animated: 'true' });
                    }
                }
            },
            backClick(toggle){
                if(toggle==1){
                    if (!this.backClick1) {
                        this.backClick1 = true
                        var that = this;
                        var title = that.articleTitle
                        this.articleData.title = title
                        for(var i in that.article){
                            if(that.article[i].isFalse){
                                that.article.splice(i,1)
                            }
                        }
                        this.articleData.article = that.article
                        this.articleData.videos = that.videos
                        if (that.vote) {
                            this.articleData.vote = that.vote
                        }else{
                            this.articleData.vote = ''
                        }
                        this.articleData.cover_type = 4;

                        var articleData = this.articleData;
                        if (that.articleData.id)
                            articleData.id = that.articleData.id;

                        var upLoad = []
                        var article = articleData.article
                        for (var s in article) {
                            if (article[s].localPart!=''&&article[s].localPart.substr(0, 5) != 'https'&&!article[s].video){
                                var obj = { url:'',loacl:''}
                                obj.url = article[s].articleImg
                                obj.loacl = article[s].localPart
                                upLoad.push(obj)
                            }
                        }

                        var videos = articleData.videos
                        if (videos.videos!=''&&videos.videos.substr(0, 5) != 'https') {
                            var obj = {
                                url:videos.video,
                                loacl:videos.videos
                            }

                            upLoad.push(obj)
                            var obj1 = {
                                url:videos.videoCover,
                                loacl:videos.videoCovers
                            }
                            var coverImg = [];coverImg[0] = videos.videoCover;
                            this.articleData.cover_img = coverImg
                            this.articleData.cover_type = 2
                            upLoad.push(obj1)
                        }
                        this.imgNums = upLoad.length
                        if (upLoad.length>0){
                            var param = this.GLOBAL.sign(this.token,this.imei);
                            event.showLoading();post.fetch({
                                method: 'post',
                                type: 'json',
                                body: param,
                                url: 'https://www.aftdc.com/businessapp/Goods/uploadOss',
                                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                            },function(res){
                                var waterMarkStr = '';
                                for (var i in upLoad) {
                                    event.uploadImg(res.data.AccessKeyId,res.data.AccessKeySecret,res.data.SecurityToken,upLoad[i].url,upLoad[i].loacl,waterMarkStr);
                                }
                            });
                        } else{
                            event.showLoading();
                            this.saveArticle()
                        }
                    }
                }else {
                    navigator.pop({ animated: 'true' });
                }
            },
            changeImg(index){
                this.articleIndex = index;
                event.chooseImg(0,0);
            },
            changeVideo(index){
                this.selectIndex = index;
                event.chooseVideo()
            },
            //监听页面返回
            viewdisappear() {
                let self = this;
                self.pageBack = true;
            },
            viewappear() {
                let self = this;
                if (!self.pageBack) { return; }
                this.resetClick()
                self.pageBack = false;
                var localvideo = event.find("localvideo")
                var localImg = event.find("localImg")

                if (localvideo) {
                    var videos = {
                        video:'',
                        videoCover:'',
                        videos:'',//+s表示本地
                        videoCovers:'',
                    }
                    //图片
                    var localPart = localImg;
                    var houzui = localPart.substring(localPart.lastIndexOf("."), localPart.length)
                    var articleImg = 'shops/'+event.find('shopId')+'/videoImg/'+Date.parse(new Date())+houzui;
                    this.videoCover = localPart;
                    videos['videoCover'] = articleImg;
                    videos['videoCovers'] = localPart;

                    var index = this.selectIndex
                    this.article[index].localPart = localPart;
                    this.article[index].articleImg = articleImg;

                    event.delete("localImg");localImg=0;

                    //视频
                    localPart = event.find("localvideo");
                    houzui = localPart.substring(localPart.lastIndexOf("."), localPart.length)
                    articleImg = 'shops/'+event.find('shopId')+'/video/'+Date.parse(new Date())+houzui;
                    this.video = localPart;
                    videos['video'] = articleImg;
                    videos['videos'] = localPart;
                    this.videos = videos
                    this.articleData.videos = videos
                    event.delete("localvideo");

                    this.article[index].video = articleImg;
                }

                if (localImg) {
                    var index=this.articleIndex;
                    var localPart = event.find("localImg");
                    var houzui = localPart.substring(localPart.lastIndexOf("."), localPart.length)
                    var articleImg = 'shops/'+event.find('shopId')+'/articleImg/'+Date.parse(new Date())+ houzui;
                    this.article[index].localPart = localPart;
                    this.article[index].articleImg = articleImg;
                    event.delete("localImg");
                }
                if (event.find("content")) {
                    var content = JSON.parse(event.find("content"));
                    self.$set(self.article[content.index],'content',content.content)
                    event.delete("content");
                }
                if (event.find("vote")) {
                    this.vote = JSON.parse(event.find("vote"));
                    event.delete("vote");
                }
                var imageList = event.find('imageList');
                if (imageList) {
                    var selectIndex = this.selectIndex
                    var article = this.article
                    imageList = JSON.parse(imageList);
                    for (var i = 0;i< imageList.length;i++){
                        var houzui = imageList[i].substring(imageList[i].lastIndexOf("."), imageList[i].length)
                        var articleImg = 'shops/'+event.find('shopId')+'/articleImg/'+Date.parse(new Date())/1000+parseInt(Math.random()*10000+1)+ houzui;
                        var obj = {localPart:'',articleImg:'',content:'',video:''};
                        obj.localPart = imageList[i]
                        obj.articleImg = articleImg
                        article.splice(selectIndex,0,obj)
                        selectIndex++;
                        this.bubble.unshift(false)//每当新添加一个article时就在这个数据的头部添加一个false
                    }
                    this.article=article
                    event.delete('imageList')
                }
            },
            //上传图片
            uploadImg(articleImg,localPart){
                var that = this;
                var param = this.GLOBAL.sign(this.token,this.imei);
                post.fetch({
                    method: 'post',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/businessapp/Goods/uploadOss',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                },function(res){
                    var waterMarkStr = event.find('shopName');
                    event.uploadImg(res.data.AccessKeyId,res.data.AccessKeySecret,res.data.SecurityToken,articleImg,localPart,waterMarkStr);
                })
            },
            toArticleText(index){
                var that=this
                var content={index:index,content:that.article[index].content}
                event.editText(index,that.article[index].content,2000,'不能超过2000字');
            },
            toVoteSetting(){
                var param={
                    inArticle:1,
                    vote:this.vote
                };
                var url='http://assets/voteSetting.js';
                event.toUrl({"url":url,"param": JSON.stringify(param)})
            },
            updata(){
                this.imgNum++;
                if (this.imgNums == this.imgNum) {
                    this.saveArticle()
                }
            },
            saveArticle(){
                var that=this
                for(var i in that.article){
                    if(that.article[i].isFalse){
                        that.article.splice(i,1)
                    }
                }
                this.articleData.article=that.article
                var param = this.GLOBAL.sign(this.token,this.imei);
                param += '&articleData='+ JSON.stringify(this.articleData);
                console.log(param)
                post.fetch({
                    method: 'post',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/businessapp/Article/draft',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                },function(res){event.hidLoading();
                    event.deleteVideo();
                    navigator.pop()
                })
            },
            //重置防二次点击
            resetClick(){
                this.minibarLeftButtonClicks = false
                this.minibarRightButtonClicks = false
            }
        },
    }
</script>

<style scoped>
    /*.minibar {*/
    /*border-bottom-width: 1px;*/
    /*border-bottom-style: solid;*/
    /*border-bottom-color: #f1f1f1;*/
    /*}*/
    .wrapper {
        flex-direction: column;
        background-color: #eff3f6;
    }

    .articleTop {
        position: relative;
    }

    .scroller {
        position: absolute;
        top: 90px;
        left: 0;
        right: 0;
        bottom: 0;
    }

    .coverImg {
        width: 750px;
        height: 400px;
    }

    .articleTitle {
        padding-left: 20px;
        padding-right: 20px;
        padding-bottom: 20px;
        padding-top: 20px;

        placeholder-color: #999;
        width: 750px;
        height: 160px;
        background-color: #fff;
    }

    .tips {
        position: absolute;
        right: 30px;
        top: 25px;
        background-color: rgba(0, 0, 0, 0.5);
        height: 40px;
        width: 40px;
        /*text-align: center;*/
        border-radius: 50px;

    }

    .tips:active {
        background-color: rgba(186, 186, 186, 0.5);
    }

    .helpSize {
        color: #fff;
        height: 40px;
        line-height: 40px;
        text-align: center;
    }

    .changeCoverImg {
        flex-direction: row;
        align-items: center;
        justify-content: center;
        position: absolute;
        right: 0;
        bottom: 50px;
        background-color: rgba(0, 0, 0, 0.5);
        padding-left: 25px;
        padding-right: 20px;
        padding-top: 10px;
        padding-bottom: 10px;
        border-top-left-radius: 50px;
        border-bottom-left-radius: 50px;
    }

    .changeCoverImg:active {
        background-color: rgba(186, 186, 186, 0.5);
    }

    .icon_pictureImg {
        width: 35px;
        height: 35px;
    }

    .coverImgText {
        color: #fff;
        margin-left: 15px;
        font-size: 26px;
    }

    .addArticle {
        flex-direction: column;
        align-items: center;
        position: relative;
        margin-top: 20px;
        /*margin-bottom: 20px;*/
        height: 300px;
        /*background-color: #666;*/
        transform: scale(1);
    }

    .icon_addArticle {
        width: 65px;
        height: 65px;

    }

    .bubbleMenu {
        position: absolute;
        width: 420px;
        height: 150px;
        /*background-color: #999;*/
        top: 65px;
        flex-direction: column;
        align-items: center;
        left: 165px;
        overflow: hidden;
        transform: scale(1);

    }

    .triangle {
        width: 20px;
        height: 20px;
        background-color: #fff;
        transform: rotate(45deg);
        margin-top: 10px;
    }

    .bubbleMenuContent {
        /*width: 200px;*/
        /*height: 75px;*/
        background-color: #fff;
        border-radius: 20px;
        position: absolute;
        top: 20px;
        left: 0;
        flex-direction: row;
        justify-content: space-around;
        padding-top: 15px;
        padding-bottom: 15px;
        padding-left: 25px;
        padding-right: 25px;
        border-width: 1px;
        border-style: solid;
        border-color: #f1f1f1;
    }

    .menuContent {
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding-left: 20px;
        padding-right: 20px;
        padding-top: 10px;
        padding-bottom: 10px;
        /*margin-left: 20px;*/
        /*margin-right: 20px;*/
        border-radius: 10px;
        opacity: 1;
    }

    .menuContent:active {
        background-color: #a1a1a1;
    }

    .imgDefault {
        width: 40px;
        height: 40px;
        margin-bottom: 5px;
    }

    .menuContentText {
        font-size: 26px;

    }

    .addArticleCell {
        width: 750px;
        flex-direction: row;
        /*justify-content: space-between;*/
        padding-top: 30px;
        padding-right: 20px;
        padding-bottom: 30px;
        padding-left: 20px;
        background-color: #ffffff;
        margin-top: 15px;

    }
    .voitImg{
        width: 150px;
        height: 160px;
        opacity: 0.9;
        background-image:linear-gradient(to bottom, #53beb7, #969696);
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border-radius: 5px;
    }
    .voitImgContent{
        flex-direction: row;
        align-items: center;
        margin-bottom: 10px;
    }

    .voitImgText{
        color: #fff;
        font-size: 28px;
        margin-top: 10px;
    }
    .circle{
        width: 15px;
        height: 15px;
        border-radius: 8px;
        border-width: 3px;
        border-style: solid;
        border-color: #fff;
    }
    .line{
        width: 55px;
        height: 4px;
        border-radius: 10px;
        margin-left: 10px;
        background-color: #fff;

    }

    .imgAText {
        flex-direction: row;
    }

    .addImg {
        flex-direction: column;
        justify-content: center;
        position: relative;
    }

    .contentImg {
        width: 150px;
        height: 125px;
        margin-bottom: 0;
    }

    .videoPlay {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        height: 125px;
        width: 150px;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-color: rgba(102, 102, 102, 0.3);
    }

    .videoPlayImg {
        width: 110px;
        height: 110px;
    }

    .addImgText {
        padding-top: 5px;
        padding-bottom: 5px;
        width: 150px;
        text-align: center;
        font-size: 22px;
        background-color: #adbbbb;
        color: #fff;
        /*height: 43px;*/
        /*flex: 5;*/
    }

    .fontText {
        flex: 15;
        padding-left: 20px;
        height: 170px;

    }

    .articCellButton {
        flex: 1;
    }

    .articleContentText {
        flex-direction: row;
        text-overflow: ellipsis;
        lines: 5;

    }

    .articleContentNot {
        color: #666;
    }
    .defaultSize {
        font-size: 35px;
        color: #333;
    }



    .content {
        background-color: #fff;
        border-radius: 10px;
        padding-top: 30px;
        padding-right: 30px;
        padding-bottom: 30px;
        padding-left: 30px;
    }

    .mask_content {
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        margin-top: 20px;
        margin-bottom: 20px;
    }

    .mask_contentText {
        width: 540px;
        color: #666;
    }

    .maskTitle{
        height: 100px;
        line-height: 100px;
        text-align: center;
        background-color: #fff;
    }

    .maskTitleSize {
    }

    .sureButton {
        margin-top: 30px;
    }

    .sureButton:active {
        background-color: #57aba5;
    }
    .contentTextarea{
        padding-top: 5px;
        padding-right: 5px;
        padding-bottom: 5px;
        padding-left: 5px;
        width: 505px;
        height: 170px;
    }

    /*****************/

    .backImg {
        width: 40px;
        height: 40px;
    }

    /***********************/
    .content{
        padding-left: 40px;
        padding-right: 40px;
        padding-top: 40px;
    }
    .btnDiv{
        flex-direction: row;
        margin-top: 60px;
    }
    .cancel{
        padding-left: 20px;
        padding-right: 30px;
    }
    .confirm{
        padding-left: 30px;
        padding-right: 20px;
    }

</style>
