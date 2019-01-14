<template>
    <div class="wrapper" @viewappear="viewappear" @viewdisappear="viewdisappear">

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
                <text :style="GLOBAL.headerCenter"  slot="middle">封面样式</text>
                <text :style="GLOBAL.headerRight"  slot="right">下一步</text>
            </wxc-minibar>
        </div>

        <scroller class="scroller">
            <div class="coverStyle" :class="[radioChoice===index?'radioChoiceBor':'']" v-for="(item,index) in article" @click="radioClick(index)">
                <div class="radio">
                    <image class="radioImg" :src="radioChoice===index?'https://image.aftdc.com/appBimg/ic_check_box_checked.png':'https://image.aftdc.com/appBimg/ic_check_box_normal.png'"></image>
                </div>
                <div class="coverStyleContent" :class="[radioChoice===index?'contentStyleChoice':'']">
                    <div class="contentStyle">
                        <div v-if="item.cover_type!=1">
                            <text :class="[radioChoice===index?'titleChoice':'']" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.title}}
                            </text>
                            <div class="coverImgStyle">
                                <div class="threeImg" v-if="item.cover_type==3" >
                                    <image class="threeImgSize" :src="img2.localImg" @click="changeImg(2,index)"></image>
                                    <image class="threeImgSize" :src="img3.localImg" @click="changeImg(3,index)"></image>
                                    <image class="threeImgSize" :src="img4.localImg" @click="changeImg(4,index)"></image>
                                </div>
                                <div class="bigImg" v-if="item.cover_type==2">
                                    <image class="bigImgSize" resize="cover" :src="img5.localImg" @click="changeImg(5,index)"></image>
                                </div>
                            </div>
                        </div>
                        <div class="smallImgContent" v-if="item.cover_type==1">
                            <text class="smallImgeText" :class="[radioChoice===index?'titleChoice':'']" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.title}}</text>
                            <image class="smallImgSize" :src="img1.localImg" @click="changeImg(1,index)"></image>
                        </div>
                        <!--<div class="articleMessage">-->
                            <!--<div class="shopAnTime">-->
                                <!--<text class="shopAnTimeSize">商家店名</text>-->
                                <!--<text class="shopAnTimeSize">1阅读</text>-->
                                <!--<text class="shopAnTimeSize">1分钟前</text>-->
                            <!--</div>-->
                            <!--<div class="articlePlace">-->
                                <!--<text class="shopAnTimeSize">广州市</text>-->
                                <!--<text class="placeSize">1.0km</text>-->
                            <!--</div>-->
                        <!--</div>-->
                    </div>
                </div>
            </div>
        </scroller>
        <toast ref="toast"></toast>
    </div>
</template>

<script>
    import {WxcMask, WxcIcon, WxcMinibar, WxcPopover} from 'weex-ui';
    import Toast from './Toast.vue'
    const event = weex.requireModule('event');
    const post = weex.requireModule('stream');
    export default {
        components: {WxcMask, WxcIcon, WxcMinibar,WxcPopover, Toast},

        data() {
            return {
                article: [
                    // {
                    //     title: '封面样式(无图片)',
                    //     cover_type: 4,
                    // },
                    {
                        title: '点击下面,添加一张封面大图片',
                        cover_type: 2,
                    },
                    {
                        title: '点击右边,添加一张封面图片',
                        cover_type: 1,
                    },

                    {
                        title: '点击下面,添加三张封面图片',
                        cover_type: 3,
                    },

                ],
                img1:{
                    cover_img:'',
                    localImg:'https://image.aftdc.com/appBimg/icon_default.gif'
                },
                img2:{
                    cover_img:'',
                    localImg:'https://image.aftdc.com/appBimg/icon_default.gif'
                },
                img3:{
                    cover_img:'',
                    localImg:'https://image.aftdc.com/appBimg/icon_default.gif'
                },
                img4:{
                    cover_img:'',
                    localImg:'https://image.aftdc.com/appBimg/icon_default.gif'
                },
                img5:{
                    cover_img:'',
                    localImg:'https://image.aftdc.com/appBimg/icon_default.gif'
                },
                nextBtnStyle: {
                    backgroundColor: '#53beb7',
                    width: '600',
                    borderColor: '#428a85',
                    borderWidth: '1px',
                    borderStyle: 'solid'
                },
                nextStyle: {
                    color: '#fff'
                },
                radioChoice: '',
                ok:1,
                pageBack:false
            }
        },
        created () {
            this.token = weex.config.token
            this.imei = weex.config.imei
            var that = this
            this.articleData = JSON.parse(event.find('articleData'));
            var articleData = this.articleData
            if (articleData.cover_type) {
                if (articleData.cover_type == 1) {
                    this.img1.localImg = 'https://image.aftdc.com/'+ articleData.cover_img[0]
                    this.img1.cover_img = articleData.cover_img[0]
                    this.radioChoice = 1
                }else if (articleData.cover_type == 2){
                    if (articleData.cover_img_local){
                        this.img5.localImg = articleData.cover_img_local[0]
                    }else{
                        this.img5.localImg = 'https://image.aftdc.com/'+ articleData.cover_img[0]
                    }
                    this.img5.cover_img = articleData.cover_img[0]
                    this.radioChoice = 0
                }else if (articleData.cover_type == 3){
                    this.img2.localImg = 'https://image.aftdc.com/'+ articleData.cover_img[0];
                    this.img3.localImg = 'https://image.aftdc.com/'+ articleData.cover_img[1];
                    this.img4.localImg = 'https://image.aftdc.com/'+ articleData.cover_img[2];
                    this.img2.cover_img = articleData.cover_img[0];
                    this.img3.cover_img = articleData.cover_img[1];
                    this.img4.cover_img = articleData.cover_img[2];
                    this.radioChoice = 2
                }
                // else if (articleData.cover_type == 4){
                //     this.radioChoice = 0
                // }
            }
        },
        methods: {
            minibarLeftButtonClick() {

            },
            radioClick(index) {
                this.radioChoice = index
            },
            minibarRightButtonClick() {
                var that = this
                const toast = that.$refs.toast;
                if (that.radioChoice === '') {
                    toast.editContent('请选择一个封面样式!');
                    return false;
                }

                var articleData = this.articleData;
                var radioChoice = this.radioChoice;
                articleData.cover_img = [];
                articleData.cover_img_local = [];
                if (radioChoice==1){
                    if (this.img1.cover_img) {
                        articleData.cover_img[0] = this.img1.cover_img;
                        articleData.cover_type = 1

                        articleData.cover_img_local[0] = this.img1
                    }else{
                        toast.editContent('请上传图片');
                        return false;
                    }
                }
                else if (radioChoice==2) {
                    if (!this.img2.cover_img||!this.img3.cover_img||!this.img4.cover_img) {
                        toast.editContent('请上传三张图片');
                        return false;
                    }else {
                        articleData.cover_img[0] = this.img2.cover_img;
                        articleData.cover_img[1] = this.img3.cover_img;
                        articleData.cover_img[2] = this.img4.cover_img;
                        articleData.cover_type = 3

                        articleData.cover_img_local[0] = this.img2
                        articleData.cover_img_local[1] = this.img3
                        articleData.cover_img_local[2] = this.img4
                    }
                }
                else if (radioChoice==0) {
                    if (this.img5.cover_img) {
                        articleData.cover_img[0] = this.img5.cover_img;
                        articleData.cover_type = 2

                        articleData.cover_img_local[0] = this.img5
                    }else{
                        toast.editContent('请上传图片');
                        return false;
                    }
                }
                event.save('articleData',JSON.stringify(articleData))
                var url = 'http://assets/articlePreview.js';
                event.toUrl({url:url,param:''});

            },

            changeImg(ind,index){
                this.radioClick(index);
                this.imgIndex = ind;
                if (ind==5){
                    event.chooseImg(5,3);
                } else {
                    event.chooseImg(4,3);
                }
            },
            //监听页面返回
            viewdisappear() {
                this.pageBack = true;
            },
            viewappear() {
                if (!this.pageBack) { return; }
                this.pageBack = false;
                if (event.find("localImg")) {
                    var imgIndex=this.imgIndex;
                    if (imgIndex==1){var img=this.img1} else if (imgIndex==2){var img=this.img2}else if (imgIndex==3){var img=this.img3}else if (imgIndex==4){var img=this.img4}else if (imgIndex==5){var img=this.img5}
                    var localPart = event.find("localImg");
                    var cover_img = 'shops/'+event.find('shopId')+'/coverImg/'+Date.parse(new Date())+'.jpg';
                    img.localImg = localPart;
                    img.cover_img = cover_img;
                    if (imgIndex==1){this.img1=img} else if (imgIndex==2){this.img2=img}else if (imgIndex==3){this.img3=img}else if (imgIndex==4){this.img4=img}else if (imgIndex==5){this.img5=img}
                    // this.uploadImg(cover_img,localPart);
                    event.delete("localImg");
                }
            },
            //上传图片
            uploadImg(cover_img,localPart){
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
                    event.uploadImg(res.data.AccessKeyId,res.data.AccessKeySecret,res.data.SecurityToken,cover_img,localPart,waterMarkStr);
                })
            },
        }
    }
</script>

<style scoped>
    .wrapper {
        flex-direction: column;
        background-color: #f8f8f8;
    }

    .minibar {
        /*border-bottom-width: 2px;*/
        /*border-bottom-style: solid;*/
        /*border-bottom-color: #a1a1a1;*/
    }

    .backImg {
        width: 40px;
        height: 40px;
    }

    .coverStyle {
        margin-top: 20px;
        border-width: 1px;
        border-style: solid;
        border-color: #999;
        background-color: #fff;
        border-radius: 10px;
        flex-direction: row;
        align-items: center;
        margin-left: 20px;
        margin-right: 20px;

    }

    .coverStyle:active {
        background-color: #f1f1f1;
    }

    .radio {
        flex: 1;
        justify-content: center;
        align-items: center;
    }

    .radioImg {
        width: 50px;
        height: 50px;
    }

    .coverStyleContent {
        padding-top: 20px;
        padding-left: 20px;
        padding-right: 20px;
        padding-bottom: 20px;
        flex: 4;
        border-left-width: 1px;
        border-left-style: solid;
        border-left-color: #999;
    }

    .contentStyle {
        flex-direction: column;
        padding-bottom: 10px;

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
        font-size: 20px;
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
        font-size: 20px;
        color: #999;
    }

    .threeImg {
        flex-direction: row;
        justify-content: space-around;
    }

    .threeImgSize {
        width: 160px;
        height: 120px;
    }

    .bigImg {
        flex-direction: row;
    }

    .bigImgSize {
        width: 500px;
        height: 300px;
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
        height: 390px;
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
        align-items: center;
        margin-bottom: 15px;
    }

    .smallImgeText {
        width: 260px;
        lines: 3,
    }

    .smallImgSize {
        width: 160px;
        height: 120px;
    }

    .radioChoiceBor {
        border-color: #53beb7;
    }

    .contentStyleChoice {
        border-left-color: #53beb7;
    }

    .titleChoice {
        color: #53beb7;
    }

    .coverButton {
        flex-direction: row;
        justify-content: space-around;
        position: fixed;
        left: 0;
        bottom: 0;
        right: 0;
        background-color: #fff;
        border-top-width: 2px;
        border-top-style: solid;
        border-top-color: #f1f1f1;
        padding-top: 20px;
        padding-bottom: 20px;
        padding-left: 30px;
        padding-right: 30px;
    }

    .nextButton:active {
        background-color: #57aba5;
    }

    .scroller {
        position: absolute;
        top: 93px;
        left: 0;
        right: 0;
        bottom: 0;
        padding-bottom: 20px;
    }
</style>
