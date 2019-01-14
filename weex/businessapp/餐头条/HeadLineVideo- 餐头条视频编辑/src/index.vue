<template>
    <div class="wrapper">

        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    @wxcMinibarRightButtonClicked="minibarRightButtonClick"
                    v-once
            >
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">餐头条</text>
                <text :style="GLOBAL.headerRight"  slot="right">发布</text>
            </wxc-minibar>
        </div>

        <scroller class="scroller">
            <div class="articleTop">
                <textarea class="articleTitle" v-model="articleTitle" maxlength="32" placeholder="点击输入视频标题(最多输入32个字符)" ref="firInput" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}"></textarea>
                <div class="tips" v-if="articleTitle==''" @click="showTips()">
                    <text class="tipsText" :style="{fontSize:GLOBAL.biggerFS}">?</text>
                </div>
            </div>
            <div class="videos">
                <div class="videos-left">
                    <image class="videos-img" resize="cover" :src="videoimg==''?'https://image.aftdc.com/appBimg/location.png':videoimg"></image>
                </div>
                <div class="videos-right"></div>
            </div>
            <div class="location">
                <div class="location-left">
                    <image class="location-img" src="https://image.aftdc.com/appBimg/location.png"></image>
                </div>
                <div class="location-center" @click="openMap">
                    <text class="location-text" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{location==''?'地理位置':location}}</text>
                </div>
                <div class="location-right">
                    <image class="location-img" src="https://image.aftdc.com/appBimg/right.png"></image>
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
        <!--<wxc-mask height="300"-->
                  <!--width="600"-->
                  <!--:top="top"-->
                  <!--border-radius="10"-->
                  <!--duration="0"-->
                  <!--mask-bg-color="rgba(0,0,0,0)"-->
                  <!--:show="videoShow"-->
                  <!--:has-animation="hasAnimation"-->
                  <!--:overlay-can-close="overlaycanclose"-->
                  <!--@wxcMaskSetHidden="wxcMaskSetHidden">-->
            <!--<div class="content">-->
                <!--<div class="maskTitle">-->
                    <!--<text class="defaultSize maskTitleSize" @click="chooseVideo">选择本地视频</text>-->
                <!--</div>-->
            <!--</div>-->
        <!--</wxc-mask>-->
        <toast ref="toast"></toast>
    </div>
</template>

<script>

    import {WxcDialog, WxcButton, WxcIcon, WxcMask, WxcMinibar} from 'weex-ui';
    import Toast from './Toast.vue';
    import {WxcPopover} from 'weex-ui';
    const post = weex.requireModule('stream');
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
                location:'',
                articleType: 3,//1为图片，2为文字，3为视频
                // addButton:true,//控制是否还可以添加文章，当article长度为9时不能，当articleType=3且article长度为1时不能
                pageBack: false,
                ok:1,
                videoimg:'',
                videos:[],
                uploadNum:0,
                first:true
            }
        },
        created() {
            this.token = weex.config.token;
            this.imei = weex.config.imei;
            if (event.find("localImg")&&event.find("localvideo")) {
                //图片
                var localPart = event.find("localImg");
                var articleImg = 'shops/'+event.find('shopId')+'/videoImg/'+Date.parse(new Date())+'.jpg';
                this.videoimg = localPart;
                this.videos['videoimg'] = articleImg;
                this.uploadImg(articleImg,localPart);
                event.delete("localImg");
                //视频
                localPart = event.find("localvideo");
                articleImg = 'shops/'+event.find('shopId')+'/video/'+Date.parse(new Date())+'.mp4';
                this.video = localPart;
                this.videos['video'] = articleImg;
                this.uploadImg(articleImg,localPart);
                event.delete("localvideo");
            }
            var that = this;
            event.init();
            weex.requireModule('globalEvent').addEventListener("upLoadFile",function(e){
                if (e.upLoad == 1)
                    that.updata(e)
            });
            weex.requireModule('globalEvent').addEventListener("address",function(e){
                var data = JSON.parse(e.data)
                that.location = data.poiaddress
                that.LonLag = data.latlng.lng+','+data.latlng.lat
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
            minibarRightButtonClick() {
                const toast = this.$refs.toast;

                if (!this.articleTitle) {
                    toast.editContent('请填写标题');
                    return false;
                }

                if (this.uploadNum == 2&&this.first){
                    this.first = false
                    const toast = this.$refs.toast;
                    var articleData = {}
                    articleData.article = [];
                    articleData.title = this.articleTitle;
                    articleData.video = this.videos['video'];
                    articleData.cover_type = 5;
                    articleData.cover_img = [];
                    articleData.cover_img.push(this.videos['videoimg']);
                    if (this.LonLag){
                        var address = {}
                        address.location = this.location
                        address.LonLag = this.LonLag
                        articleData.address = JSON.stringify(address)
                    }

                    var param = this.GLOBAL.sign(this.token,this.imei);
                    param += '&articleData='+ JSON.stringify(articleData);
                    console.log(param);
                    post.fetch({
                        method: 'post',
                        type: 'json',
                        body: param,
                        url: 'https://www.aftdc.com/businessapp/Article/saveArticle',
                        headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    },function(res){
                        if (res.data.res==1){
                            toast.editContent('上传成功，等待审核');
                            setTimeout(()=>navigator.pop({ animated: 'true' }),2000);
                        }else {
                            this.first = true
                            toast.editContent('网络出错，请稍后再试');
                        }
                    })
                }else{
                    this.first = true
                    toast.editContent('请检查当前网络状况，稍后再试');
                }
            },
            chooseVideo(){
                event.chooseVideo();
            },
            openMap(){
                event.openWebMap()
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
            },

            minibarLeftButtonClick() {
                navigator.pop({ animated: 'true' });
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
                    var waterMarkStr = '';
                    event.uploadImg(res.data.AccessKeyId,res.data.AccessKeySecret,res.data.SecurityToken,articleImg,localPart,waterMarkStr);
                })
            },
            updata(e){
                this.uploadNum ++;
                console.log("1111111111111"+"00000000000"+this.uploadNum);
            }
        },
    }
</script>

<style scoped>
    .wrapper {
        flex-direction: column;
        background-color: #eff3f6;
    }

    .articleTop {
        position: relative;
    }

    .scroller {
        position: absolute;
        top: 91px;
        left: 0;
        right: 0;
        bottom: 0;
    }
    .videos{
        margin-top: 20px;
        width: 750px;
        height: 300px;
        background-color: #fff;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .videos-img{
        width:260px;
        height: 260px;
    }
    .videos-left{
        width: 260px;
        height: 260px;
        margin-left: 20px;
    }
    .videos-right{
        width: 430px;
        height: 260px;
        margin-right: 20px;
    }
    .location{
        margin-top: 20px;
        width: 750px;
        height: 100px;
        background-color: #fff;
        flex-direction: row;
        align-items: center;
    }
    .location-img{
        margin-left: 10px;
        width: 50px;
        height: 50px;
    }
    .location-left{
        flex: 1;
        height: 80px;
        justify-content: center;
        text-align: center;
    }
    .location-center{
        flex: 8;
        height: 80px;
    }
    .location-text{
        line-height: 80px;
    }
    .location-right{
        flex: 1;
        height: 80px;
        justify-content: center;
        text-align: center;
    }
    .articleTitle {
        padding-left: 20px;
        padding-right: 20px;
        padding-bottom: 20px;
        padding-top: 20px;
        placeholder-color: #999;
        width: 750px;
        height: 200px;
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

    .tipsText{
        height: 40px;
        line-height: 40px;
        text-align: center;
        color: #fff;
    }
    .tips:active {
        background-color: rgba(186, 186, 186, 0.5);
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

    .maskTitle {
        flex-direction: row;
        justify-content: center;
        align-items: center;
        margin-bottom: 20px;
        margin-top: 20px;
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
        font-size: 35px;
        width: 505px;
        height: 170px;
    }
    .minibar {
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #a1a1a1;
    }
    /*****************/

    .backImg {
        width: 40px;
        height: 40px;
    }

    /***********************/
</style>
