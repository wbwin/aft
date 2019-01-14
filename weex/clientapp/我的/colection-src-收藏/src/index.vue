
<template>
    <div class="colection">
        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    v-once
            >
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">收藏</text>
            </wxc-minibar>
        </div>
        <!--头部-->
        <div class="colectionBar row">
            <text class="shop" :class="[barIndex==0?'shopTwo':'']" :style="{fontSize:GLOBAL.bigFS,color:barIndex==0?GLOBAL.tColor:GLOBAL.dColor}" @click="barClick(0)">店铺</text>
            <text class="shop" :class="[barIndex==1?'shopTwo':'']" :style="{fontSize:GLOBAL.bigFS,color:barIndex==1?GLOBAL.tColor:GLOBAL.dColor}" @click="barClick(1)">文章</text>
        </div>

        <!--店铺和文章部分-->
        <slider class="scrollerBig" @change="change" :index="sliderIndex">

            <!--店铺-->
            <div class="listDiv">
                <scroller class="scroller" offset-accuracy="10" @scroll="shopScroll">

                    <refresh class="refresh" @refresh="onrefreshShop" :display="refreshing? 'show' : 'hide'">
                        <image class="indicator" src="https://image.aftdc.com/appBimg/ic_loading_gif.gif"></image>
                    </refresh>

                    <div class="shopDiv row" v-for="(item,index) in shopInfo" :key="index" @click="toShop(index)" @touchstart="shopOntouchstart(item.id,index)" @touchend="shopOntouchend">
                        <image class="shopImg" :src="'https://image.aftdc.com/'+item.shopImg"></image>
                        <div style="margin-left: 20px;flex: 1;">
                            <div class="shopTop row">
                                <text class="shopName" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.shopName}}</text>
                                <text class="juli" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">{{item.distance}}</text>
                            </div>
                            <div class="shopCenter">
                                <image class="starIcon" src="https://image.aftdc.com/appBimg/icon_wuxing_nocolor.png"></image>
                                <div class="starDiv" :style="{width:item.shopAvg*30+'px'}">
                                    <image class="starIcon" src="https://image.aftdc.com/appBimg/icon_wuxing_color.png"></image>
                                </div>
                            </div>
                            <div class="shopBotton row">
                                <text class="give" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">起送&nbsp;￥{{item.deliveryFreeMoney}}&nbsp;&nbsp;配送&nbsp;￥{{item.deliveryStartMoney}}</text>
                                <!--<text class="canCel" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.tColor}" @click="cancelClick(index)">取消收藏</text>-->
                            </div>
                        </div>

                    </div>

                    <noOrder img="https://image.aftdc.com/appBimg/icon_no_order.png" textOne="暂无店铺" textTwo="" v-if="shopInfo.length<=0"></noOrder>

                    <loading class="loading" @loading="onloadingShop" :display="loadinging ? 'show' : 'hide'">
                        <image class="indicator" src="https://image.aftdc.com/appBimg/ic_loading_gif.gif" v-if="!noMoreShop"></image>
                        <div class="moreRecentlyOrder" v-else>
                            <text class="moreRecentlyOrderText">没有更多了~</text>
                        </div>
                    </loading>

                </scroller>
            </div>

            <!--文章-->
            <div class="listDiv">
                <scroller class="scroller" @scroll="articelScroll">

                    <refresh class="refresh" @refresh="onrefreshArticel" :display="refreshing? 'show' : 'hide'">
                        <image class="indicator" src="https://image.aftdc.com/appBimg/ic_loading_gif.gif"></image>
                    </refresh>

                    <div class="contentStyle" :class="[index===4?'noBorder':'']" v-for="(item,index) in articleInfo" @click="toArticleContent(item.article_id)" @touchstart="articelOntouchstart(item.id,index)" @touchend="articelOntouchend">
                        <div v-if="item.cover_type!=1">
                            <div class="row activeHeadInfo">
                                <div class="row">
                                    <div class="ArticlePortrait"><image class="ArticlePortrait" :src="'https://image.aftdc.com/'+item.shopImg"></image></div>
                                    <text class="shopAnTimeSize" :style="{fontSize:GLOBAL.defaultFS,marginLeft:'10px'}">{{item.shopName}}</text>
                                </div>
                                <text class="shopAnTimeSize" :style="{fontSize:GLOBAL.smallFS}">{{item.city}} {{item.distance}}</text>
                            </div>
                            <text v-if="item.cover_type!=5" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">{{item.title}}</text>
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
                                    <text class="videoTitle">{{item.title}}</text>
                                </div>
                            </div>
                        </div>
                        <div v-if="item.cover_type==1">
                            <div class="row activeHeadInfo">
                                <div class="row">
                                    <div class="ArticlePortrait"><image class="ArticlePortrait" :src="'https://image.aftdc.com/'+item.shopImg"></image></div>
                                    <text class="shopAnTimeSize toEllipsis" :style="{fontSize:GLOBAL.bigFS,marginLeft:'10px'}">{{item.shopName}}</text>
                                </div>
                                <text class="shopAnTimeSize" :style="{fontSize:GLOBAL.smallFS}">{{item.city}} {{item.distance}}</text>
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

                    <noOrder class="noOrderTwo" img="https://image.aftdc.com/appBimg/icon_no_order.png" textOne="暂无文章" textTwo="" v-if="articleInfo.length<=0"></noOrder>

                    <loading class="loading" @loading="onloadingArticel" :display="loadinging ? 'show' : 'hide'">
                        <image class="indicator" src="https://image.aftdc.com/appBimg/ic_loading_gif.gif" v-if="!noMoreArticel"></image>
                        <div class="moreRecentlyOrder" v-else>
                            <text class="moreRecentlyOrderText">没有更多了~</text>
                        </div>
                    </loading>

                </scroller>
            </div>


        </slider>

        <!-- 店铺删除提示框 -->
        <wxc-mask height="322"
                  width="566"
                  border-radius="0"
                  duration="100"
                  mask-bg-color="#FFFFFF"
                  :has-animation="true"
                  :has-overlay="true"
                  :show-close="false"
                  :show="shopShow"
                  :overlay-can-close="false"
                  @wxcMaskSetHidden="wxcMaskSetHidden">
            <div class="mask" @click.stop="">
                <text class="maskTitle">提示</text>
                <text class="maskContent">确定删除此收藏店铺</text>
                <div class="maskBtn row">
                    <text class="maskSure" @click="wxcMaskSetHidden">取消</text>
                    <text class="maskCancel" @click="confirmShopDel">确定</text>
                </div>
            </div>
        </wxc-mask>

        <!-- 文章删除提示框 -->
        <wxc-mask height="322"
                  width="566"
                  border-radius="0"
                  duration="100"
                  mask-bg-color="#FFFFFF"
                  :has-animation="true"
                  :has-overlay="true"
                  :show-close="false"
                  :show="articelShow"
                  :overlay-can-close="false"
                  @wxcMaskSetHidden="wxcMaskSetHidden">
            <div class="mask" @click.stop="">
                <text class="maskTitle">提示</text>
                <text class="maskContent">确定删除此收藏文章？</text>
                <div class="maskBtn row">
                    <text class="maskSure" @click="wxcMaskSetHidden">取消</text>
                    <text class="maskCancel" @click="confirmArticelDel">确定</text>
                </div>
            </div>
        </wxc-mask>

        <toast ref="toast"></toast>

    </div>

    <!--</div>-->
</template>

<script>
    import { WxcMask,WxcPopup,WxcPopover,WxcMinibar } from 'weex-ui';
    import  Toast from './Toast.vue';
    import noOrder from './noOrder.vue';
    const event=weex.requireModule('event');
    const post = weex.requireModule('stream');
    const navigator = weex.requireModule('navigator');
    const GLOBAL = require('@/Global.vue');
    var shopTimer = null;
    export default {
        components: { WxcMask,WxcPopup,WxcPopover,Toast,WxcMinibar,noOrder },
        name: 'App',
        data() {
            return {
                barIndex:0,
                sliderIndex:0,
                refreshing:false,
                loadinging:false,
                noMoreShop:false,
                noMoreArticel:false,
                shopShow:false,
                articelShow:false,
                longPress: false,//是否正在长按

                shopInfo:[],
                articleInfo:[],

                token:'',
                imei:'',
                delId:'',
                delIndex:'',
            }
        },
        created(){
            var that=this;
            that.token = weex.config.token;
            that.imei = weex.config.imei;
            that.latitude = weex.config.latitude;
            that.longitude = weex.config.longitude;
            that.getShop(0);
            that.getArticel(0);
        },
        methods: {
            getShop(index){//获取店铺数据
                var that=this;
                var param= that.GLOBAL.sign(that.token,that.imei);
                param+= '&page=0' +'&latitude='+that.latitude +'&longitude='+that.longitude;

                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: 'https://www.aftdc.com/userapp/Mine/getShopCollect',
                }, function (res) {
                    if(res.data.res==1){
                        that.shopInfo=res.data.data.shopInfo;
                    }
                    else{
                        that.noMoreShop=true;
                        if(index==1){
                            const toast =that.$refs.toast;
                            toast.editContent(res.data.info);
                        }
                    }
                    that.refreshing=false;
                });
            },

            onrefreshShop:GLOBAL.throttle(function () {//店铺下拉刷新
                var that=this;
                clearTimeout(shopTimer)//防止上拉刷新弹出删除层
                that.refreshing=true;
                that.getShop(1);
            }),

            onloadingShop:GLOBAL.throttle(function () {//店铺上拉加载
                var that=this;
                clearTimeout(shopTimer)//防止上拉刷新弹出删除层
                that.loadinging=true;
                var page=that.shopInfo.length;
                var param= that.GLOBAL.sign(that.token,that.imei);
                param+= '&page='+page +'&latitude='+that.latitude +'&longitude='+that.longitude;

                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: 'https://www.aftdc.com/userapp/Mine/getShopCollect',
                }, function (res) {
                    if(res.data.res==1){
                        var shopInfo=res.data.data.shopInfo;
                        that.shopInfo=that.shopInfo.concat(shopInfo);
                    }
                    else{
                        const toast =that.$refs.toast;
                        toast.editContent(res.data.info);
                        that.noMoreShop=true;
                    }
                    that.loadinging=false;
                });
            }),

            getArticel(index){//获取文章数据
                var that=this;
                var param= that.GLOBAL.sign(that.token,that.imei);
                param+= '&page=0' +'&latitude='+that.latitude +'&longitude='+that.longitude;
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: 'https://www.aftdc.com/userapp/Mine/getArticleCollect',
                }, function (res) {
                    if(res.data.res==1){
                        that.articleInfo=res.data.data.articleInfo;
                    }
                    else{
                        that.noMoreArticel=true
                        if(index==1){
                            const toast =that.$refs.toast;
                            toast.editContent(res.data.info);
                        }
                    }
                    that.refreshing=false;
                });
            },

            onrefreshArticel:GLOBAL.throttle(function () {//文章下拉刷新
                var that=this;
                clearTimeout(shopTimer);
                that.refreshing=true;
                that.getArticel(1);
            }),

            onloadingArticel:GLOBAL.throttle(function () {//文章上拉加载
                var that=this;
                clearTimeout(shopTimer);
                that.loadinging=true;
                var page=that.articleInfo.length;
                var param= that.GLOBAL.sign(that.token,that.imei);
                param+= '&page='+page +'&latitude='+that.latitude +'&longitude='+that.longitude;

                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: 'https://www.aftdc.com/userapp/Mine/getArticleCollect',
                }, function (res) {
                    if(res.data.res==1){
                        var articleInfo=res.data.data.articleInfo;
                        that.articleInfo=that.articleInfo.concat(articleInfo);
                    }
                    else{
                        const toast =that.$refs.toast;
                        toast.editContent(res.data.info);
                        that.noMoreArticel=true;
                    }
                    that.loadinging=false;
                });
            }),



            barClick(index){
                var that=this;
                that.sliderIndex=index;
                that.barIndex=index;
            },
            change(e){
                var that=this;
                that.sliderIndex=e.index;
                that.barIndex=e.index;
            },

            minibarLeftButtonClick() {
                navigator.pop({animated: 'false'});
            },

            // cancelClick(index){
            //     const toast=this.$refs.toast;
            //     this.shopList.splice(index,1);
            //     toast.editContent('已取消收藏')
            // },//店铺取消收藏
            // articleCancelClick(index){
            //     const toast=this.$refs.toast;
            //     this.articleList.splice(index,1);
            //     toast.editContent('已取消收藏')
            // },

            toShop:GLOBAL.throttle(function (index) {//跳转店铺详情
                var that=this;
                if(that.longPress===false){

                    var that=this;
                    var orderType='';
                    var shopType='';
                    if(that.shopInfo[index].featured==0) {//主打业务 0 外卖 3堂食预订 5到店自取
                        orderType=0;
                        shopType=1;
                    }
                    else if(that.shopInfo[index].featured==3){
                        orderType=3;
                        shopType=5;
                    }
                    else if(that.shopInfo[index].featured==5){
                        orderType=5;
                        shopType=2;
                    }

                    var shopId=that.shopInfo[index].shopId;

                    var url='http://assets/businessOrder.js';
                    var param={shopId:shopId,orderType:orderType,shopType:shopType};
                    event.toUrl({url:url,param:JSON.stringify(param)});
                }
            }),

            toArticleContent:GLOBAL.throttle(function (id) {//跳转文章详情
                var that=this;
                if(that.longPress===false){
                    var param=id;
                    var url='http://assets/articleContent.js';
                    event.toUrl({ "url": url, "param": param });
                }
            }),

            wxcMaskSetHidden(){
                var that=this;
                that.shopShow=false;
                that.articelShow=false;
            },

            //店铺长按删除开始
            shopOntouchstart(id,index){
                clearTimeout(shopTimer);
                var that = this;
                shopTimer = setTimeout(function(){
                    that.shopShow = true;
                    that.delId = id;
                    that.delIndex = index;
                    that.longPress = true;
                },800)
            },
            //店铺长按删除结束
            shopOntouchend(){
                clearTimeout(shopTimer)
                var that = this;
                setTimeout(function(){
                    that.longPress = false;
                },10)
            },
            //文章长按删除开始
            articelOntouchstart(id,index){
                clearTimeout(shopTimer);
                var that = this;
                shopTimer = setTimeout(function(){
                    that.articelShow = true;
                    that.delId = id;
                    that.delIndex = index;
                    that.longPress = true;
                },800)
            },
            //文章长按删除结束
            articelOntouchend(){
                clearTimeout(shopTimer)
                var that = this;
                setTimeout(function(){
                    that.longPress = false;
                },10)
            },

            //店铺防止上下滚动弹出删除层
            shopScroll(){
                clearTimeout(shopTimer);
            },

            //文章防止上下滚动弹出删除层
            articelScroll(){
                clearTimeout(shopTimer);
            },

            confirmShopDel:GLOBAL.throttle(function () {//店铺确定删除
                var that=this;
                that.shopShow=false;
                var param= that.GLOBAL.sign(this.token,this.imei);
                param+= '&id='+that.delId;

                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "alongPressrlencoded" },
                    url: 'https://www.aftdc.com/userapp/Mine/delShopCollect',
                }, function (res) {
                    if(res.data.res==1){
                        that.shopInfo.splice(that.delIndex,1)
                        const toast =that.$refs.toast;
                        toast.editContent(res.data.info);
                    }
                    else{
                        const toast =that.$refs.toast;
                        toast.editContent(res.data.info);
                    }
                });
            }),

            confirmArticelDel:GLOBAL.throttle(function () {//文章确定删除
                var that=this;
                that.articelShow=false;
                var param= that.GLOBAL.sign(this.token,this.imei);
                param+= '&id='+that.delId;

                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: 'https://www.aftdc.com/userapp/Mine/delArticleCollect',
                }, function (res) {
                    if(res.data.res==1){
                        that.articleInfo.splice(that.delIndex,1)
                        const toast =that.$refs.toast;
                        toast.editContent(res.data.info);
                    }
                    else{
                        const toast =that.$refs.toast;
                        toast.editContent(res.data.info);
                    }
                });
            }),

            toArticleContent:GLOBAL.throttle(function () {
                var param='';
                var url='http://assets/articleContent.js';
                event.toUrl({"url":url,"param":param})
            }),
        }
    }

</script>

<style scoped>

    /* 删除评论提示层 */
    .mask {
        flex: 1;
        position: relative;
        padding-top: 46px;
        /*padding-left: 50px;*/
    }
    .maskTitle {
        font-size: 36px;
        color: #181818;
        margin-left: 50px;
    }
    .maskContent {
        width: 440px;
        color: #898989;
        padding-top: 40px;
        font-size: 32px;
        margin-left: 50px;
    }
    .maskBtn {
        width: 566px;
        height: 90px;
        position: absolute;
        /*right: 40px;*/
        /*bottom: 38px;*/
        bottom: 0px;
        flex-direction: row;
    }
    .maskSure {
        text-align: center;
        line-height: 90px;
        flex: 1;
        color: #757575;
        /*margin-right: 56px;*/
        font-size: 32px;
        border-top-width: 1px;
        border-top-style: solid;
        border-top-color: #e7e7e7;
    }
    .maskCancel {
        text-align: center;
        line-height: 90px;
        flex: 1;
        color: #53beb7;
        font-size: 32px;
        border-top-width: 1px;
        border-top-style: solid;
        border-top-color: #e7e7e7;
        border-left-width: 1px;
        border-left-style: solid;
        border-left-color: #e7e7e7;
    }






    /*文章*/
    .contentStyle {
        padding-left: 20px;
        padding-right: 20px;
        background-color: #fff;
        margin-bottom: 20px;
    }
    .activeHeadInfo {
        justify-content: space-between;
        padding-top: 20px;
        padding-bottom: 20px;
    }
    .ArticlePortrait {
        width: 45px;
        height: 45px;
        border-radius: 30px;
    }
    .shopAnTimeSize {
        color: #999;
        margin-right: 10px;
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
        width: 710px;
        height:415px;
    }
    .videoTitle{
        position: absolute;
        left: 10px;
        top: 10px;
        right: 10px;
        line-height: 40px;
        color: #fff;
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
        justify-content: center;
        align-items: center;
        background-color: rgba(0,0,0,0.3);
    }
    .videoPlayImg{
        width: 100px;
        height: 100px;
    }
    .smallImgContent{
        flex-direction: row;
        justify-content: space-between;
        /*align-items: center;*/
        margin-bottom: 15px;
    }
    .smallImgeText{
        width: 450px;
        lines:3,
    }
    .smallImgSize{
        width: 220px;
        height: 165px;
        border-radius: 5px;
    }
    .toEllipsis {
        max-width: 400px;
        lines:1;
        text-overflow: ellipsis;
    }
    .articleMessage {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding-top: 20px;
        padding-bottom: 20px;
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





    /*视频*/
    /*.videoPlay{*/
    /*position: absolute;*/
    /*left: 0;*/
    /*right: 0;*/
    /*top: 0;*/
    /*bottom: 0;*/
    /*align-items: center;*/
    /*justify-content: center;*/
    /*background-color:rgba(0,0,0,0.4);*/
    /*}*/
    /*.playIcon{*/
    /*width: 120px;*/
    /*height: 120px;*/
    /*}*/
    /*.videoImg{*/
    /*width: 710px;*/
    /*height: 415px;*/
    /*}*/
    /*.videoText{*/
    /*position: absolute;*/
    /*left: 10px;*/
    /*right: 10px;*/
    /*top: 10px;*/
    /*color: #fff;*/
    /*}*/
    /*.bigImgSize{*/
    /*position: relative;*/
    /*width: 710px;*/
    /*height:415px;*/
    /*background-color: skyblue;*/
    /*border-radius: 5px;*/
    /*}*/



    /*按钮*/
    /*.forwardBtn{*/
    /*width: 750px;*/
    /*}*/
    /*.btn{*/
    /*flex: 1;*/
    /*height: 80px;*/
    /*align-items: center;*/
    /*justify-content: center;*/
    /*}*/
    /*.goShopIcon{*/
    /*width: 40px;*/
    /*height: 40px;*/
    /*border-radius: 40px;*/
    /*}*/
    /*.leftIcon{*/
    /*width: 35px;*/
    /*height: 35px;*/
    /*opacity: 0.6;*/
    /*}*/
    /*.centerIcon{*/
    /*width: 40px;*/
    /*height: 40px;*/
    /*}*/
    /*.rightIcon{*/
    /*width: 40px;*/
    /*height: 40px;*/
    /*}*/




    /*文章*/
    /*.articelAll{*/
    /*background-color: #fff;*/
    /*margin-bottom: 20px;*/
    /*padding-left: 20px;*/
    /*padding-right: 20px;*/
    /*}*/
    /*.articelTitle{*/
    /*padding-top: 20px;*/
    /*padding-bottom: 20px;*/
    /*!*border-bottom-style: solid;*!*/
    /*!*border-bottom-width: 1px;*!*/
    /*!*border-bottom-color: #dedede;*!*/
    /*}*/
    /*.shopIcon{*/
    /*width: 60px;*/
    /*height: 60px;*/
    /*border-radius: 40px;*/
    /*margin-right: 20px;*/
    /*}*/
    /*.imgText{*/
    /*flex-direction: row;*/
    /*width: 710px;*/
    /*padding-top: 20px;*/
    /*padding-left: 20px;*/
    /*padding-bottom: 20px;*/
    /*border-style: solid;*/
    /*border-width: 1px;*/
    /*border-color: #dedede;*/
    /*border-radius: 10px;*/
    /*}*/
    /*.imgDetail{*/
    /*width: 448px;*/
    /*}*/
    /*.imgPicture{*/
    /*width: 220px;*/
    /*height: 165px;*/
    /*border-radius: 5px;*/
    /*}*/



    /*下拉刷新*/
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
        margin-top: 16px;
        height: 100px;
        width: 100px;
        color: #53beb7;
        margin-bottom: 16px;
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
    .moreRecentlyOrder{
        align-items: center;
        justify-content: center;
        height: 80px;
    }
    .moreRecentlyOrderText{
        font-size: 28px;
        color:#999;
    }




    .give{
        flex: 1;
    }
    .articleBotton{
        margin-top: 45px;
    }
    .shopBotton{
        margin-top: 15px;
    }
    .starDiv{
        overflow: hidden;
        position: absolute;
        left: 0;
        top: 0;
    }
    .starIcon{
        width: 150px;
        height: 24px;
    }
    .shopCenter{
        position: relative;
        width: 150px;
        height: 24px;
        margin-top: 10px;
    }
    .shopName{
        font-weight: bold;
        flex: 1;
    }
    .shopImg{
        width: 130px;
        height: 130px;
        border-radius: 10px;
    }
    .shopDiv{
        padding-top: 20px;
        padding-bottom: 20px;
        padding-left: 20px;
        padding-right: 20px;
        background-color: #fff;
        margin-bottom: 20px;
    }
    .scrollerBig{
        position: absolute;
        top: 200px;
        bottom: 0;
        width: 750px;
    }
    .scroller{
        flex: 1;
    }
    .listDiv{
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        width: 750px;
    }
    .shopTwo{
        border-bottom-color: #53beb7;
    }
    .shop{
        flex: 1;
        line-height: 86px;
        text-align: center;
        border-bottom-style: solid;
        border-bottom-width: 4px;
        border-bottom-color: #fff;

    }
    .colectionBar{
        height: 90px;
        background-color: #fff;
    }
    .colection{
        background-color: #f8f8f8;
    }
    .row{
        flex-direction: row;
        align-items: center;
    }
</style>
