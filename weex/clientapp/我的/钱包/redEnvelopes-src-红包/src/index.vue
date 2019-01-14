<template>
    <div class="redEnvelopes">

        <!--头部-->
        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    v-once
            >
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">红包中心</text>
            </wxc-minibar>
        </div>

        <!--导航栏-->
        <div class="row">
            <text v-for="(item,index) in barList" :key="index" class="bar" :class="[index==barIndex?'selectBar':'']" :style="{fontSize:GLOBAL.bigFS}" @click="barClick(index)">{{item}}</text>
        </div>

        <slider class="slider" @change="sliderChange" :index="sliderIndex" infinite="false">

            <!--待领取-->
            <div class="block">
                <list class="list" show-scrollbar="false">

                    <refresh class="refresh" @refresh="onrefreshDlq" :display="refreshing? 'show' : 'hide'">
                        <image class="indicator" src="https://image.aftdc.com/appBimg/ic_loading_gif.gif"></image>
                    </refresh>

                    <cell>
                        <div class="row listShop" v-for="(item,index) in hongBaoDlq" :key="index" @click="receive(index)">
                            <div class="row" :style="{flex:1}">
                                <image class="shopImg" :src="'https://image.aftdc.com/'+item.shopImg"></image>
                                <div class="details">
                                    <text class="shopName" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.shopName}}</text>
                                    <text :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">满{{item.money}}元可用</text>
                                    <text :style="{fontSize:GLOBAL.biggerFS,color:'#cf131f'}">￥{{item.piece}}</text>
                                </div>
                            </div>
                            <text class="receive" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor}">立即领取</text>
                        </div>
                    </cell>
                    <cell class="list">
                        <div class="noDiv">
                            <image class="noImg" src="https://image.aftdc.com/images/kong.png" v-if="hongBaoDlq.length<=0"></image>
                        </div>
                    </cell>

                    <loading class="loading" @loading="onloadingDlq" :display="loadinging ? 'show' : 'hide'">
                        <image class="indicator" src="https://image.aftdc.com/appBimg/ic_loading_gif.gif" v-if="!noMoreDlq"></image>
                        <div class="moreRecentlyOrder" v-if="noMoreDlq">
                            <text class="moreRecentlyOrderText">没有更多了~</text>
                        </div>
                    </loading>

                </list>
            </div>

            <!--待使用-->
            <div class="block">
                <list class="list" show-scrollbar="false">

                    <refresh class="refresh" @refresh="onrefreshDsy" :display="refreshing? 'show' : 'hide'">
                        <image class="indicator" src="https://image.aftdc.com/appBimg/ic_loading_gif.gif"></image>
                    </refresh>
                    <cell>
                        <div class="all" v-for="(item,index) in hongBaoDsy" :key="index" @click="goShopDsy(index)">
                            <div class="row main">
                                <image class="shopIcon" :src="'https://image.aftdc.com/'+item.shopImg"></image>
                                <div class="shop">
                                    <text class="shopName" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor,fontWeight:'bold'}">{{item.shopName}}</text>
                                    <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">有效期 : {{item.end_time}}</text>
                                </div>
                                <div class="integral">
                                    <div class="integralNum">
                                        <text class="num">￥</text>
                                        <text class="integralText">{{item.piece}}</text>
                                    </div>
                                    <text class="canUse" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">满{{item.money}}可用</text>
                                </div>

                            </div>
                            <div class="row order">
                                <text :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">可与其他活动同时享受,在线支付专享</text>
                                <text :style="{fontSize:GLOBAL.defaultFS,color:'#e51b21'}">去使用 ></text>
                            </div>
                        </div>
                    </cell>

                    <cell class="list">
                        <div class="noDiv">
                            <image class="noImg" src="https://image.aftdc.com/images/kong.png" v-if="hongBaoDsy.length<=0"></image>
                        </div>
                    </cell>

                    <loading class="loading" @loading="onloadingDsy" :display="loadinging ? 'show' : 'hide'">
                        <image class="indicator" src="https://image.aftdc.com/appBimg/ic_loading_gif.gif" v-if="!noMoreDsy"></image>
                        <div class="moreRecentlyOrder" v-if="noMoreDsy">
                            <text class="moreRecentlyOrderText">没有更多了~</text>
                        </div>
                    </loading>

                </list>
            </div>

            <!--已过期-->
            <div class="block">
                <list class="list" show-scrollbar="false">

                    <refresh class="refresh" @refresh="onrefreshYgq" :display="refreshing? 'show' : 'hide'">
                        <image class="indicator" src="https://image.aftdc.com/appBimg/ic_loading_gif.gif"></image>
                    </refresh>

                    <cell>
                        <div class="ygqAll" v-for="(item,index) in hongBaoYgq" :key="index" @click="goShopYgq(index)">
                            <div class="row ygq">
                                <div class="ygqMoney">
                                    <div class="row">
                                        <text class="ygqNum" :style="{fontSize:GLOBAL.defaultFS}">￥</text>
                                        <text class="ygqMoneyText">{{item.money}}</text>
                                    </div>
                                    <text class="ygqHongbao" :style="{fontSize:GLOBAL.bigFS,color:'#999'}">红包</text>
                                </div>
                                <div class="ygqShopName">
                                    <text class="ygqName" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">{{item.shopName}}</text>
                                    <text :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">{{item.start_time}} 至 {{item.end_time}}</text>
                                </div>
                                <image class="ygqImg" src="https://image.aftdc.com/images/overtime.png"></image>
                            </div>
                            <div class="row ygqBottom">
                                <text :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">满{{item.money}}使用</text>
                                <text :style="{fontSize:GLOBAL.defaultFS,color:'#999'}"> ∨ </text>
                            </div>
                        </div>
                    </cell>

                    <cell class="list">
                        <div class="noDiv">
                            <image class="noImg" src="https://image.aftdc.com/images/kong.png" v-if="hongBaoYgq.length<=0"></image>
                        </div>
                    </cell>

                    <loading class="loading" @loading="onloadingYgq" :display="loadinging ? 'show' : 'hide'">
                        <image class="indicator" src="https://image.aftdc.com/appBimg/ic_loading_gif.gif" v-if="!noMoreYgq"></image>
                        <div class="moreRecentlyOrder" v-if="noMoreYgq">
                            <text class="moreRecentlyOrderText">没有更多了~</text>
                        </div>
                    </loading>

                </list>
            </div>

            <!--已使用-->
            <div class="block">
                <list class="list" show-scrollbar="false">

                    <refresh class="refresh" @refresh="onrefreshYsy" :display="refreshing? 'show' : 'hide'">
                        <image class="indicator" src="https://image.aftdc.com/appBimg/ic_loading_gif.gif"></image>
                    </refresh>

                    <cell>
                        <div class="ysyAll" v-for="(item,index) in hongBaoYsy" :key="index" @click="goShopYsy(index)">
                            <div class="row ysyTop">
                                <div class="ysyMoney">
                                    <div :style="{flexDirection:'row'}">
                                        <text class="ysyPiece" :style="{fontSize:GLOBAL.smallFS,marginTop:'20px'}">￥</text>
                                        <text class="ysyPiece" :style="{fontSize:'50px'}">{{item.piece}}</text>
                                    </div>
                                    <text :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">满{{item.money}}元使用</text>
                                </div>
                                <div class="ysyShop">
                                    <text :style="{fontSize:GLOBAL.bigFS,color:'#999'}">店铺红包</text>
                                    <text class="ysyShopName" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">门店: {{item.shopName}}</text>
                                </div>
                            </div>
                            <div class="row ygqBottom">
                                <text :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">有效期: {{item.start_time}} 至 {{item.end_time}}</text>
                                <text :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">已使用</text>
                            </div>
                        </div>
                    </cell>

                    <cell class="list">
                        <div class="noDiv">
                            <image class="noImg" src="https://image.aftdc.com/images/kong.png" v-if="hongBaoYsy.length<=0"></image>
                        </div>
                    </cell>

                    <loading class="loading" @loading="onloadingYsy" :display="loadinging ? 'show' : 'hide'">
                        <image class="indicator" src="https://image.aftdc.com/appBimg/ic_loading_gif.gif" v-if="!noMoreYsy"></image>
                        <div class="moreRecentlyOrder" v-if="noMoreYsy">
                            <text class="moreRecentlyOrderText">没有更多了~</text>
                        </div>
                    </loading>
                </list>
            </div>
        </slider>

        <toast ref="toast"></toast>
    </div>
</template>

<script>
    import { WxcMinibar,WxcButton} from 'weex-ui';
    import noOrder from './noOrder.vue';
    const event = weex.requireModule('event');
    const navigator = weex.requireModule('navigator');
    const post = weex.requireModule('stream');
    const modal = weex.requireModule('modal');
    const GLOBAL = require('@/Global.vue');
    import Toast from './Toast.vue';
    const dom = weex.requireModule('dom')
    export default {
        components: { WxcMinibar,WxcButton,noOrder,Toast},
        name: 'App',
        data() {
            return {
                height:0,
                barList:['待领取','待使用','已过期','已使用'],
                barIndex:0,
                sliderIndex:0,
                refreshing:false,
                loadinging:false,
                noMoreDlq:false,
                noMoreDsy:false,
                noMoreYgq:false,
                noMoreYsy:false,

                hongBaoDlq:[],//待领取
                hongBaoDsy:[],//待使用
                hongBaoYgq:[],//已过期
                hongBaoYsy:[],//已使用

                token:'',
                imei:'',
            }
        },
        methods: {

            // 待领取---------------------------------------------------------------------------------------------------------------------
            goShopDlq:GLOBAL.throttle(function (index) {//跳转去店铺
                var that=this;
                var orderType='';
                var shopType='';
                if(that.hongBaoDlq[index].featured==0) {//主打业务 0 外卖 3堂食预订 5到店自取
                    orderType=0;
                    shopType=1;
                }
                else if(that.hongBaoDlq[index].featured==3){
                    orderType=3;
                    shopType=5;
                }
                else if(that.hongBaoDlq[index].featured==5){
                    orderType=5;
                    shopType=2;
                }

                var shopId=that.hongBaoDlq[index].shopId;

                var url='http://assets/businessOrder.js';
                var param={shopId:shopId,orderType:orderType,shopType:shopType};
                event.toUrl({url:url,param:JSON.stringify(param)});
            }),//跳转至该商家主打业务的商品选择页面

            receive:GLOBAL.throttle(function (index) {//免费领取
                var that=this;
                var id=that.hongBaoDlq[index].id;
                var param= that.GLOBAL.sign(that.token,that.imei);
                param+= '&id='+id;

                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: 'https://www.aftdc.com/userapp/Index/getHongbao',
                }, function (res) {

                    if(res.data.res==1){
                        that.hongBaoDlq.splice(index,1)
                        const toast =that.$refs.toast;
                        toast.editContent(res.data.info);
                    }
                    else{
                        const toast =that.$refs.toast;
                        toast.editContent(res.data.info);
                    }
                });
            }),//免费领取

            getDlq(index){//获取待领取数据

                var that=this;
                var param= that.GLOBAL.sign(that.token,that.imei);
                param+= '&page=0' +'&latitude='+that.latitude +'&longitude='+that.longitude;

                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: 'https://www.aftdc.com/userapp/Mine/getPendingHongBao',
                }, function (res) {
                    if(res.data.res==1){
                        var hongBaoDlq=res.data.data.hongBaoInfo;
                        that.hongBaoDlq=hongBaoDlq;
                        if(hongBaoDlq.length<20) that.noMoreDlq=true;
                    }
                    else{
                        that.noMoreDlq=true;
                        if(index==1){
                            const toast =that.$refs.toast;
                            toast.editContent(res.data.info);
                        }
                    }
                    that.refreshing=false;
                });
            },//获取待领取数据

            onrefreshDlq:GLOBAL.throttle(function () {//下拉刷新
                var that=this;
                that.getDlq(1);
                that.refreshing=true;
                that.noMoreDlq=false;
            }),//下拉刷新

            onloadingDlq:GLOBAL.throttle(function () {//上拉加载

                var that=this;
                that.loadinging=true;
                var page=that.hongBaoDlq.length;
                var param= that.GLOBAL.sign(that.token,that.imei);
                param+= '&page='+page +'&latitude='+that.latitude +'&longitude='+that.longitude;
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: 'https://www.aftdc.com/userapp/Mine/getPendingHongBao',
                }, function (res) {
                    if(res.data.res==1){
                        that.hongBaoDlq=that.hongBaoDlq.concat(res.data.data.hongBaoInfo);
                    }
                    else{
                        that.noMoreDlq=true;
                        const toast =that.$refs.toast;
                        toast.editContent(res.data.info);
                    }
                    that.loadinging=false;
                });
            }),//上拉加载



            // 待使用----------------------------------------------------------------------------------------------------------------------------------------
            goShopDsy:GLOBAL.throttle(function (index) {//跳转至该商家主打业务的商品选择页面
                var that=this;
                var orderType='';
                var shopType='';
                if(that.hongBaoDsy[index].featured==0) {//主打业务 0 外卖 3堂食预订 5到店自取
                    orderType=0;
                    shopType=1;
                }
                else if(that.hongBaoDsy[index].featured==3){
                    orderType=3;
                    shopType=5;
                }
                else if(that.hongBaoDsy[index].featured==5){
                    orderType=5;
                    shopType=2;
                }

                var shopId=that.hongBaoDsy[index].shopId;

                var url='http://assets/businessOrder.js';
                var param={shopId:shopId,orderType:orderType,shopType:shopType};
                event.toUrl({url:url,param:JSON.stringify(param)});
            }),//跳转至该商家主打业务的商品选择页面

            getDsy(index){//获取待使用数据

                var that=this;
                var param= that.GLOBAL.sign(that.token,that.imei);
                param+= '&page=0';

                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: 'https://www.aftdc.com/userapp/Mine/getWaitUseHongBao',
                }, function (res) {
                    if(res.data.res==1){
                        var hongBaoDsy=res.data.data.hongBaoInfo;
                        that.hongBaoDsy=hongBaoDsy;
                        if(hongBaoDsy.length<20) that.noMoreDsy=true;
                    }
                    else{
                        that.noMoreDsy=true;
                        if(index==1){
                            const toast =that.$refs.toast;
                            toast.editContent(res.data.info);
                        }
                    }
                    that.refreshing=false;
                });
            },//获取待使用数据

            onrefreshDsy:GLOBAL.throttle(function () {//下拉刷新
                var that=this;
                that.getDsy(1);
                that.refreshing=true;
                that.noMoreDsy=false;
            }),//下拉刷新

            onloadingDsy:GLOBAL.throttle(function () {//上拉加载

                var that=this;
                that.loadinging=true;
                var page=that.hongBaoDsy.length;
                var param= that.GLOBAL.sign(that.token,that.imei);
                param+= '&page='+page;

                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: 'https://www.aftdc.com/userapp/Mine/getWaitUseHongBao',
                }, function (res) {
                    if(res.data.res==1){
                        that.hongBaoDsy=that.hongBaoDsy.concat(res.data.data.hongBaoInfo);
                    }
                    else{
                        that.noMoreDsy=true;
                        const toast =that.$refs.toast;
                        toast.editContent(res.data.info);
                    }
                    that.loadinging=false;
                });
            }),//上拉加载




            // 已过期----------------------------------------------------------------------------------------------------------------------------------------
            goShopYgq:GLOBAL.throttle(function (index) {//跳转至该商家主打业务的商品选择页面
                var that=this;
                var orderType='';
                var shopType='';
                if(that.hongBaoYgq[index].featured==0) {//主打业务 0 外卖 3堂食预订 5到店自取
                    orderType=0;
                    shopType=1;
                }
                else if(that.hongBaoYgq[index].featured==3){
                    orderType=3;
                    shopType=5;
                }
                else if(that.hongBaoYgq[index].featured==5){
                    orderType=5;
                    shopType=2;
                }

                var shopId=that.hongBaoYgq[index].shopId;

                var url='http://assets/businessOrder.js';
                var param={shopId:shopId,orderType:orderType,shopType:shopType};
                event.toUrl({url:url,param:JSON.stringify(param)});
            }),//跳转至该商家主打业务的商品选择页面

            getYgq(index){//获取待使用数据

                var that=this;
                var param= that.GLOBAL.sign(that.token,that.imei);
                param+= '&page=0';
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: 'https://www.aftdc.com/userapp/Mine/getFailHongBao',
                }, function (res) {
                    if(res.data.res==1){
                        var hongBaoYgq=res.data.data.hongBaoInfo;
                        that.hongBaoYgq=hongBaoYgq;
                        if(hongBaoYgq.length<20) that.noMoreYgq=true;
                    }
                    else{
                        that.noMoreYgq=true;
                        if(index==1){
                            const toast =that.$refs.toast;
                            toast.editContent(res.data.info);
                        }
                    }
                    that.refreshing=false;
                });
            },//获取已过期数据

            onrefreshYgq:GLOBAL.throttle(function () {//下拉刷新
                var that=this;
                that.getYgq(1);
                that.refreshing=true;
            }),//下拉刷新

            onloadingYgq:GLOBAL.throttle(function () {//上拉加载

                var that=this;

                that.loadinging=true;
                var page=that.hongBaoYgq.length;
                var param= that.GLOBAL.sign(that.token,that.imei);
                param+= '&page='+page;

                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: 'https://www.aftdc.com/userapp/Mine/getFailHongBao',
                }, function (res) {
                    if(res.data.res==1){
                        that.hongBaoYgq=that.hongBaoYgq.concat(res.data.data.hongBaoInfo);
                    }
                    else{
                        that.noMoreYgq=true;
                        const toast =that.$refs.toast;
                        toast.editContent(res.data.info);
                    }
                    that.loadinging=false;
                });
            }),//上拉加载




            // 已使用----------------------------------------------------------------------------------------------------------------------------------------

            goShopYsy:GLOBAL.throttle(function (index) {//跳转至该商家主打业务的商品选择页面
                var that=this;
                var orderType='';
                var shopType='';
                if(that.hongBaoYsy[index].featured==0) {//主打业务 0 外卖 3堂食预订 5到店自取
                    orderType=0;
                    shopType=1;
                }
                else if(that.hongBaoYsy[index].featured==3){
                    orderType=3;
                    shopType=5;
                }
                else if(that.hongBaoYsy[index].featured==5){
                    orderType=5;
                    shopType=2;
                }

                var shopId=that.hongBaoYsy[index].shopId;

                var url='http://assets/businessOrder.js';
                var param={shopId:shopId,orderType:orderType,shopType:shopType};
                event.toUrl({url:url,param:JSON.stringify(param)});
            }),//跳转至该商家主打业务的商品选择页面

            getYsy(index){//获取待使用数据
                var that=this;
                var param= that.GLOBAL.sign(that.token,that.imei);
                param+= '&page=0';

                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: 'https://www.aftdc.com/userapp/Mine/getUsedHongBao',
                }, function (res) {
                    if(res.data.res==1){
                        var hongBaoYsy=res.data.data.hongBaoInfo;
                        that.hongBaoYsy=hongBaoYsy;
                        if(hongBaoYsy.length<20) that.noMoreYsy=true;
                    }
                    else{
                        that.noMoreYsy=true;
                        if(index==1){
                            const toast =that.$refs.toast;
                            toast.editContent(res.data.info);
                        }
                    }
                    that.refreshing=false;
                });
            },//获取已过期数据

            onrefreshYsy:GLOBAL.throttle(function () {//下拉刷新
                var that=this;
                that.getYsy(1);
                that.refreshing=true;
                that.noMoreYsy=false;
            }),//下拉刷新

            onloadingYsy:GLOBAL.throttle(function () {//上拉加载

                var that=this;

                that.loadinging=true;
                var page=that.hongBaoYsy.length;
                var param= that.GLOBAL.sign(that.token,that.imei);
                param+= '&page='+page;

                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: 'https://www.aftdc.com/userapp/Mine/getFailHongBao',
                }, function (res) {
                    if(res.data.res==1){
                        that.hongBaoYsy=that.hongBaoYsy.concat(res.data.data.hongBaoInfo);
                    }
                    else{
                        that.noMoreYsy=true;
                        const toast =that.$refs.toast;
                        toast.editContent(res.data.info);
                    }
                    that.loadinging=false;
                });
            }),//上拉加载



            // 公用-------------------------------------------------------------------------------------------------------------------------------------
            sliderChange(e){//slider滑动切换
                var that=this;
                that.barIndex=e.index;

                if(e.index==0) that.getDlq(0);
                else if(e.index==1) that.getDsy(0);
                else if(e.index==2) that.getYgq(0);
                else if(e.index==3) that.getYsy(0);

            },//slider滑动切换

            barClick(index){//导航切换
                var that=this;
                if(index!=that.barIndex){
                    that.barIndex=index;
                    that.sliderIndex=index;
                }

            },//导航切换

            minibarLeftButtonClick() {
                navigator.pop({animated: 'false'});
            },




        },
        created(){
            var that=this;
            event.init();
            that.token = weex.config.token;
            that.imei = weex.config.imei;
            that.latitude = weex.config.latitude;
            that.longitude = weex.config.longitude;
            that.getDlq();
            that.getDsy();
            that.getYgq();
            that.getYsy();
        },
    }
</script>

<style scoped>
    /*已使用start*/
    .ysyAll{
        margin-left: 20px;
        margin-right: 20px;
        margin-bottom: 20px;
        background-color: #fff;
    }
    .ysyMoney{
        flex: 0.8;
        height: 130px;
        align-items: center;
        justify-content: center;
        /*border-right-style: dashed;*/
        /*border-right-width: 2px;*/
        /*border-right-color: #dedede;*/
    }
    .ysyTop{
        padding-top: 20px;
        padding-bottom: 20px;
    }
    .ysyPiece{
        color: #999;
    }
    .ysyShop{
        flex: 2;
        height: 130px;
        align-items: center;
        justify-content: center;
    }
    .ysyShopName{
        text-overflow: ellipsis;
        lines:1;
        margin-top: 20px;
    }
    /*已使用end*/




    /*已过期start*/
    .ygqBottom{
        justify-content: space-between;
        padding-top: 15px;
        padding-bottom: 15px;
        border-top-style: dashed;
        border-top-width: 2px;
        border-top-color: #f1f1f1;
        padding-left: 20px;
        padding-right: 20px;
    }
    .ygqImg{
        width: 180px;
        height: 180px;
    }
    .ygqShopName{
        justify-content: space-between;
        align-items: center;
        height: 130px;
        flex: 2;
    }
    .ygqName{
        padding-top:18px;
        text-overflow: ellipsis;
        lines:1;
    }
    .ygqMoney{
        flex: 1;
        height: 130px;
        justify-content: space-between;
        align-items: center;
    }
    .ygq{
        padding-top: 20px;
        padding-bottom: 20px;
    }
    .ygqAll{
        background-color: #fff;
        opacity: 0.8;
        margin-left: 20px;
        margin-right: 20px;
        margin-bottom: 20px;
    }
    .ygqNum{
        color: #999;
    }
    .ygqMoneyText{
        font-size: 50px;
        color: #999;
    }
    .ygqHongbao{

    }
    /*已过期end*/


    /*待使用start*/
    .all{
        margin-left: 20px;
        margin-right: 20px;
        background-color: #fff;
        border-radius: 10px;
        margin-bottom: 20px;
    }
    .main{
        padding-left: 20px;
        padding-right: 20px;
        padding-top: 20px;
        padding-bottom: 20px;
        border-bottom-style: dashed;
        border-bottom-width: 2px;
        border-bottom-color: #dedede;
    }
    .shopIcon{
        width: 130px;
        height: 130px;
        border-radius: 10px;
    }
    .shop{
        flex: 3;
        height: 130px;
        padding-top: 5px;
        padding-bottom: 5px;
        justify-content: space-between;
        margin-left: 10px;
    }
    /*.shopName{*/
    /*flex: 1;*/
    /*text-overflow: ellipsis;*/
    /*lines:1;*/
    /*}*/
    .integral{
        flex: 1.2;
        height: 130px;
        justify-content: space-between;
        padding-top: 10px;
        padding-bottom: 10px;
    }
    .num{
        color: #e51b21;
        font-size: 26px;
        margin-top: 20px;
    }
    .integralText{
        color: #e51b21;
        font-size: 50px;
    }
    .integralNum{
        flex-direction: row;
        justify-content: flex-end;
    }
    .canUse{
        text-align: right;
    }
    .order{
        justify-content: space-between;
        padding-left: 20px;
        padding-right: 20px;
        padding-top: 15px;
        padding-bottom: 15px;
    }
    /*待使用end*/



    /*待领取start*/

    .moreRecentlyOrder{
        align-items: center;
        justify-content: center;
        height: 80px;
    }
    .moreRecentlyOrder:active{
        background-color: #f1f1f1;
    }

    .moreRecentlyOrderText{
        font-size: 28px;
        color:#999;
    }
    .shopName{
        text-overflow: ellipsis;
        lines:1;
    }
    .shopImg{
        width: 160px;
        height: 160px;
        border-radius: 15px;
        margin-right: 10px;
    }
    .listShop{
        margin-bottom: 20px;
        background-color: #fff;
        padding-left: 20px;
        padding-right: 0;
        padding-top: 20px;
        padding-bottom: 20px;
    }
    .details{
        justify-content: space-between;
        height: 160px;
        padding-top: 10px;
        padding-bottom: 10px;
        flex: 2;
    }
    .receive{
        width: 230px;
        height: 140px;
        line-height: 140px;
        margin-left: 20px;
        text-align: center;
        border-left-style: dashed;
        border-left-width: 2px;
        border-left-color: #dedede;
    }
    /*待领取end*/



    /*头部导航start*/
    .bar{
        flex: 1;
        text-align: center;
        padding-top: 20px;
        padding-bottom: 20px;
        border-bottom-style: solid;
        border-bottom-width: 4px;
        border-bottom-color: #fff;
        color: #666;
    }
    .selectBar{
        border-bottom-color: #53beb7;
        color: #53beb7;
    }
    /*头部导航end*/



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




    .slider{
        width: 750px;
        position: absolute;
        top: 167px;
        bottom: 0;
    }
    .list{
        padding-top: 20px;
        flex: 1;
    }
    .block{
        background-color: #f8f8f8;
        width: 750px;
        height: inherit;
        position: absolute;
        top: 0;
        bottom: 0;
    }
    .noImg{
        width: 300px;
        height: 300px;
    }
    .noDiv{
        flex: 1;
        align-items: center;
        justify-content: center;
    }
    .row{
        flex-direction: row;
        align-items: center;
    }
</style>
