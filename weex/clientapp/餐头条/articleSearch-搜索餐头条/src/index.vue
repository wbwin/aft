<template>
    <div>
        <!--搜索框内容-->
        <div class="searchTitle">
            <image class="iconTitle" @click="backClick()" src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
            <div class="input">
                <div class="row aiCenter">
                    <image class="inputIcon" src="https://image.aftdc.com/appBimg/icon_search.png"></image>
                    <input ref="searchOne" class="inputText" type="text" placeholder="横店电影城" maxLength="32" @input="input" @blur="blur" @focus="focus" v-model="searchText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}"/>
                </div>
                <div class="clearIconDiv" v-if="ClearIcon" @click="clearIconClick">
                    <div class="clearIconDivA"></div>
                    <div class="clearIconDivB"></div>
                </div>
            </div>
            <text class="search" @click="sousuoClick">搜索</text>
        </div>


        <!--历史记录和猜你想搜-->
        <list @touchstart="touchstart" v-if="!barShow">
            <!--注意:下面的cell设置style="position: relative;flex: 1;"时会无视软件盘弹起的干扰-->
            <cell style="position: relative;flex: 1;">
                <!--历史记录-->
                <div class="listHistory"  v-if="historyList.length>0">
                    <div class="history">
                        <div class="historyDiv">
                            <div style="flex-direction: row;align-items: center;width: 300px;" @click="openHistory">
                                <text class="historyText" :style="{fontSize:GLOBAL.bigFS}">历史记录</text>
                                <image class="hisIcon" :src="historyLength?'https://image.aftdc.com/appBimg/ic_expanded_up.jpg':'https://image.aftdc.com/appBimg/ic_expanded_down.jpg'"></image>
                            </div>
                        </div>
                        <div style="padding-left: 30px;" @click="deleteIconClick">
                            <image class="deleteIcon" v-if="Complete==false" src="https://image.aftdc.com/appBimg/icon_delete.png"></image>
                            <text class="historyText" v-if="Complete==true" :style="{fontSize:GLOBAL.bigFS}">完成</text>
                        </div>
                    </div>
                    <div class="historyContent">
                        <div class="historyContentDiv" :class="[index%2==0?'borderClass':'']" v-for="(item,index) in historyList" :key="index" v-if="(index<6||historyLength) && index<20" @click="historySearchClick(index)">
                            <text class="historyContentText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item}}</text>
                            <div class="clearHistoryDiv"  v-if="ClearHistory&&item.text!=''" @click="clearHistoryDivClick(index)">
                                <image class="clearHistoryIcon" src="https://image.aftdc.com/appBimg/icon_close.png"></image>
                            </div>
                        </div>
                    </div>
                </div>
            </cell>
        </list>
        <scroller show-scrollbar="false" class="headLineBlock" v-if="barShow">
            <div v-if="articleData.length < 1">
                <text class="noArticle" :style="{color:GLOBAL.dColor}">抱歉，没有找到相关的内容</text>
            </div>
            <div class="headLineContent" ref="firHeadLineTab" v-for="(item,index) in articleData" @click="toArticleContent(item.id)">
                <div class="contentStyle"  :class="[index===4?'noBorder':'']">
                    <div v-if="item.cover_type!=1">
                        <div class="row aiCenter activeHeadInfo">
                            <div class="row aiCenter">
                                <div class="ArticlePortrait"><image class="ArticlePortrait" :src="'https://image.aftdc.com/'+item.shopImg"></image></div>
                                <text class="shopAnTimeSize" :style="{fontSize:GLOBAL.bigFS,marginLeft:'10px'}">{{item.shopName}}</text>
                            </div>
                            <text class="shopAnTimeSize" :style="{fontSize:GLOBAL.smallFS}">{{item.city}} {{item.distance}}</text>
                        </div>
                        <text :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">{{item.title}}</text>
                        <div class="coverImgStyle" >
                            <div class="threeImg" v-if="item.cover_type==3">
                                <image class="threeImgSize" :src="'https://image.aftdc.com/'+item.cover_img[0]"></image>
                                <image class="threeImgSize" :src="'https://image.aftdc.com/'+item.cover_img[1]"></image>
                                <image class="threeImgSize" :src="'https://image.aftdc.com/'+item.cover_img[2]"></image>
                            </div>
                            <div class="bigImg" v-if="item.cover_type==2">
                                <image class="bigImgSize" :src="'https://image.aftdc.com/'+item.cover_img[0]"></image>
                            </div>
                            <div class="videoImg" v-if="item.cover_type==5">
                                <image class="bigImgSize" :src="'https://image.aftdc.com/'+item.cover_img[0]"></image>
                                <div class="videoPlay">
                                    <image class="videoPlayImg" src="https://image.aftdc.com/appBimg/icon_vadeoPlay.png"></image>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="item.cover_type==1">
                        <div class="row aiCenter activeHeadInfo">
                            <div class="row aiCenter">
                                <div class="ArticlePortrait"><image class="ArticlePortrait" :src="'https://image.aftdc.com/'+item.shopImg"></image></div>
                                <text class="shopAnTimeSize toEllipsis" :style="{fontSize:GLOBAL.bigFS,marginLeft:'10px'}">{{item.shopName}}</text>
                            </div>
                            <text class="shopAnTimeSize" :style="{fontSize:GLOBAL.smallFS}">{{item.city}} {{item.distance}}5.6km</text>
                        </div>
                        <div class="smallImgContent">
                            <text class="smallImgeText" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">{{item.title}}</text>
                            <image class="smallImgSize" :src="'https://image.aftdc.com/'+item.cover_img[0]"></image>
                        </div>
                    </div>
                    <div class="articleMessage">
                        <text class="shopAnTimeSize" :style="{fontSize:GLOBAL.smallFS}">{{item.read_num}}{{item.cover_type===5?'播放':'阅读'}}  {{item.comment_num}}{{item.commentOrleaveWord==1?'评论':'留言'}}  {{item.praise_num}}点赞 {{item.timestamp}}</text>
                    </div>
                </div>

            </div>
            <loading class="loading" @loading="onloadingNews" :display="loadinging ? 'show' : 'hide'" v-if="articleData.length > 0">
                <text :style="{fontSize:GLOBAL.bigFS,color: '#888888',lineHeight:'132px'}" v-if="articleNothing && articleData.length > 0">没有更多文章了</text>
                <image class="indicator" src="https://image.aftdc.com/appBimg/ic_loading_gif.gif" v-else></image>
            </loading>
        </scroller>

        <div class="loadingPage aiCenter jcCenter" v-if="loading">
            <image class="loadingImg" src="https://image.aftdc.com/appBimg/ic_loading_gif.gif"></image>
            <text  :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">努力加载中...</text>
        </div>

        <toast ref="toast"></toast>

    </div>
</template>

<script>
    import Toast from './Toast.vue';
    import {WxcMask, WxcMinibar, WxcPopup} from 'weex-ui';
    const post = weex.requireModule('stream');
    const animation = weex.requireModule('animation')
    const event=weex.requireModule('event')
    const navigator=weex.requireModule('navigator')
    export default {
        components: {WxcMask, WxcMinibar, WxcPopup,Toast},
        name: 'App',
        data() {
            return {
                jarvis: true,
                loading: false,
                loadinging: false,
                articleNothing: false,
                userId: 0,
                longitude: '',//经度
                latitude:'',//纬度
                articleData: [],

                searchText:'',//input框的数据绑定
                ClearIcon:false,//字体清除图标
                ClearHistory:false,//
                Complete:false,
                historyLength:false,
                barShow:false,
                historyList:[],//历史记录
            }
        },
        created() {

            this.token = weex.config.token;
            this.imei = weex.config.imei;
            this.userId = weex.config.userId;
            this.latitude = weex.config.latitude;
            this.longitude = weex.config.longitude;

            var history = event.find('searchHistoryT');
            if(history) {
                this.historyList = JSON.parse(history);
            }
        },
        methods: {

            toArticleContent(id){
                var param=id;
                var url='http://assets/articleContent.js';
                event.toUrl({ "url": url, "param": param });
            },
            searchArticle(pullup) {//搜索获取文章列表(是否上拉加载)
                var that = this
                var param = '&userId=' + that.userId
                if(pullup) {
                    param += '&page=' + that.articleData.length
                }else {
                    setTimeout(()=>{//防止点击的一瞬间闪出一下
                        that.barShow = true
                    },300)
                    setTimeout(()=>{//给足够的时间让小键盘弹下去
                        that.loading = true
                    },200)
                    setTimeout(()=>{
                        that.loading = false
                    },1000)
                    param += '&page=' + 0
                }
                param += '&tab=' + 0
                param += '&latitude=' + that.latitude
                param += '&longitude=' + that.longitude
                param += '&search=' + that.searchText

                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: 'https://www.aftdc.com/userapp/Article/getArticle',
                }, function (res) {
                    if(res.data.res === 1) {
                        that.articleNothing = false
                        if(pullup) {
                            that.articleData = that.articleData.concat(res.data.data)
                        }else {
                            that.articleData = res.data.data
                        }
                    }else if(res.data.res === 0){
                        if(!pullup) {
                            that.articleData = []
                        }
                        that.articleNothing = true
                    }
                });

            },
            onloadingNews () {//上拉加载
                this.loadinging = true
                setTimeout(() => {
                    this.loadinging = false
                }, 2000)
                if(!this.articleNothing) {
                    this.searchArticle(true)
                }
            },



            focus(){

            },
            blur(){
                // this.$refs.searchOne.blur();
            },
            touchstart(){
                this.$refs.searchOne.blur();
            },

            historySearchClick(index){
                this.searchArticle(false)
                this.searchText=this.historyList[index];
                this.ClearIcon=true;
                setTimeout(()=> {
                    this.historyList.unshift(this.historyList[index])
                    this.historyList.splice(index+1,1)
                    for(var i = this.historyList.length; i >= 20; i--) {
                        this.historyList.splice(i,1)
                    }
                    var param = JSON.stringify(this.historyList)
                    event.save('searchHistoryT',param);
                },200)

            },
            sousuoClick(){//点击搜索
                if(this.searchText !== '') {
                    this.$refs.searchOne.blur();
                    this.searchArticle(false)
                    setTimeout(()=> {
                        this.historyList.unshift(this.searchText)
                        for(var i = this.historyList.length; i >= 20; i--) {
                            this.historyList.splice(i,1)
                        }
                        var param = JSON.stringify(this.historyList)
                        event.save('searchHistoryT',param);
                    },200)
                }
            },
            clearHistoryDivClick(index){//点击删除历史记录
                this.$refs.searchOne.blur();
                this.historyList.splice(index,1)

                var param = JSON.stringify(this.historyList)
                event.save('searchHistoryT',param);
            },
            openHistory(){
                if(this.historyLength==false){
                    this.historyLength=true
                }
                else{
                    this.historyLength=false;
                }
            },//展开收起历史记录
            deleteIconClick(){
                this.$refs.searchOne.blur();
                if(this.Complete==false){
                    this.Complete=true;
                    this.ClearHistory=true;
                    this.historyLength=true;
                }
                else{
                    this.Complete=false;
                    this.ClearHistory=false;
                    this.historyLength=false;
                }
            },//历史记录删除图标
            input(e){
                if(e.value!=''){
                    this.ClearIcon=true;
                }
                else{
                    this.ClearIcon=false;
                    this.barShow=false;
                }
            },
            clearIconClick(){
                this.barShow=false;
                this.ClearIcon=false;
                // this.searchText+='2';
                this.searchText='';
            },//input框的清除按钮

            backClick(){
                navigator.pop({animated:'true'})
            },
        },
        mounted() {
            var that=this;
            setTimeout(function () {
                that.$refs.searchOne.focus();
            })
        },
    }
</script>

<style scoped>
    .clearIconDiv{
        width: 31px;
        height: 31px;
        background-color: #c9cacc;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        border-radius: 15px;
        margin-right: 20px;
        position: relative;
    }
    .clearIconDivA {
        width: 3px;
        height: 23px;
        background-color: #fff;
        transform: rotate(45deg);
        position: absolute;
        top: 4px;
        left: 14px;
    }
    .clearIconDivB {
        width: 23px;
        height: 3px;
        background-color: #fff;
        transform: rotate(45deg);
        position: absolute;
        top: 14px;
        left: 4px;
    }



    .row {
        flex-direction: row;
    }
    .jcCenter {
        justify-content: center;
    }
    .aiCenter {
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
    .clearHistoryDiv{
        flex-direction: row;
        justify-content: flex-end;
        position: absolute;
        width: 375px;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
    }
    .clearHistoryIcon{
        width: 20px;
        height: 20px;
        margin-top: 30px;
        margin-right: 20px;
        opacity: 0.4;
    }
    .listHistory{
        background-color: #fff;
        border-top-width: 12px;
        border-top-style: solid;
        border-top-color: #f6f6f6;
        border-bottom-width: 12px;
        border-bottom-style: solid;
        border-bottom-color: #f6f6f6;
    }
    .borderClass{
        border-right-style: solid;
        border-right-color: #f6f6f6;
        border-right-width: 2px;
    }
    .historyContentDiv{
        width: 375px;
        padding-left: 30px;
        padding-right: 30px;
        border-bottom-style: solid;
        border-bottom-color: #f6f6f6;
        border-bottom-width: 2px;
        flex-direction: row;
        align-items: center;
        position: relative;
    }
    .historyContent{
        flex-direction: row;
        flex-wrap: wrap;
    }
    .historyContentText{
        height: 80px;
        line-height: 80px;
        width: 300px;
        text-overflow: ellipsis;
        lines:1;
    }
    .historyText{
        color: #999;
    }
    .historyDiv{
        flex: 1;
        flex-direction: row;
        align-items: center;
    }
    .history{
        flex-direction: row;
        align-items: center;
        padding-left: 30px;
        padding-right: 30px;
        padding-top: 25px;
        padding-bottom: 25px;
        border-style: solid;
        border-color: #f1f1f1;
        border-width: 2px;
    }
    .deleteIcon{
        width: 30px;
        height: 30px;
    }
    .hisIcon{
        width: 25px;
        height: 25px;
        margin-left: 10px;
        opacity: 0.4;
    }
    .search {
        font-size: 30px;
        color: #fff;
        text-align: center;
        padding-left: 30px;
        padding-right: 30px;
    }

    .inputText {
        background-color: #fff;
        width: 410px;
        placeholder-color:#999;
        height: 70px;
    }

    .inputIcon {
        margin-left: 10px;
        margin-right: 10px;
        width: 35px;
        height: 35px;
        opacity: 0.7;
    }

    .input {
        margin-left: 30px;
        flex: 1;
        border-radius: 15px;
        background-color: #fff;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }

    .iconTitle {
        width: 40px;
        height: 40px;
    }

    .searchTitle {
        flex-direction: row;
        align-items: center;
        background-color: #53beb7;
        padding-bottom: 15px;
        padding-top: 15px;
        padding-left: 15px;
    }
    .toEllipsis {
        max-width: 400px;
        lines:1;
        text-overflow: ellipsis;
    }
    .ArticlePortrait {
        width: 45px;
        height: 45px;
        border-radius: 30px;
    }

    .headLineBlock{
        width: 750px;
        background-color: #fff;
    }
    .headLineContent {
        flex-direction: column;
        padding-top: 30px;
    }
    .headLineContent:active{
        background-color: #f1f1f1;
    }

    .contentStyle {
        flex-direction: column;
        padding-bottom: 30px;
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #f1f1f1;
        margin-left: 30px;
        margin-right: 30px;
    }

    .articleMessage {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
    .closeIcon{
        color: #d1d1d1;
        width: 35px;
        height: 25px;
        line-height: 25px;
        border-radius: 5px;
        text-align: center;
        border-style: solid;
        border-width: 1px;
        border-color: #d1d1d1;
        margin-left: 20px;
    }
    .shopAnTimeSize {
        color: #999;
        margin-right: 10px;
    }
    .activeHeadInfo {
        justify-content: space-between;
        padding-bottom: 10px;
    }

    .coverImgStyle {
        margin-top: 15px;
        margin-bottom: 15px;
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
    .smallImgSize {
        width: 220px;
        height: 165px;
    }
    .noArticle{
        flex: 1;
        text-align: center;
        font-size:30px;
        padding-top: 100px;
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
    .indicator {
        margin-top: 16px;
        height: 100px;
        width: 100px;
        color: #53beb7;
        margin-bottom: 16px;
    }
    .loadingPage {
        background-color: #fff;
        position: fixed;
        top: 100px;
        left: 0;
        right: 0;
        bottom: 0;
    }
    .loadingImg {
        width: 200px;
        height: 145px;
    }


</style>
