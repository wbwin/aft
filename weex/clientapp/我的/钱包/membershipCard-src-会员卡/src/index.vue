<template>
    <div class="membershipCard">

        <!--页面头部信息-->
        <div>
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    v-once
            >
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">店铺会员</text>
            </wxc-minibar>
        </div>

        <!--会员店铺列表-->
        <list class="list" show-scrollbar="false">

            <refresh class="refresh" @refresh="onrefreshOrder" :display="refreshing? 'show' : 'hide'">
                <image class="indicator" src="https://image.aftdc.com/appBimg/ic_loading_gif.gif"></image>
            </refresh>

            <cell>
                <div class="all" v-for="(item,index) in couponInfo" :key="index" @click="goShop(index)">
                    <div class="row main">
                        <image class="shopImg" :src="'https://image.aftdc.com/'+item.shopImg"></image>
                        <div class="shop">
                            <text class="shopName" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor,fontWeight:'bold'}">{{item.shopName}}</text>
                            <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.city}} • {{item.distance}}</text>
                        </div>
                        <div class="integral">
                            <div class="integralNum">
                                <text class="num">{{item.userScore}}</text>
                                <text class="integralText" :style="{fontSize:GLOBAL.smallFS}">积分</text>
                            </div>
                            <text class="canUse" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">可用</text>
                        </div>

                    </div>
                    <div class="row order">
                        <text :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">{{item.msg}}</text>
                        <text :style="{fontSize:GLOBAL.defaultFS,color:'#999'}" v-if="item.endTime">有效期至 : {{item.endTime}}</text>
                    </div>

                </div>
            </cell>

            <loading class="loading" @loading="onloadingOrder" :display="loadinging ? 'show' : 'hide'">
                <image class="indicator" src="https://image.aftdc.com/appBimg/ic_loading_gif.gif" v-if="!noMore"></image>
                <div class="moreRecentlyOrder" v-if="noMore">
                    <text class="moreRecentlyOrderText">没有更多了~</text>
                </div>
            </loading>

        </list>
        <Toast ref="toast"></Toast>
    </div>
</template>

<script>
    import { WxcMinibar,WxcButton} from 'weex-ui';
    import noOrder from './noOrder.vue';
    const event = weex.requireModule('event');
    const navigator = weex.requireModule('navigator');
    const post = weex.requireModule('stream');
    import Toast from './Toast.vue';
    const GLOBAL = require('@/Global.vue');
    const modal = weex.requireModule('modal')
    export default {
        components: { WxcMinibar,WxcButton,noOrder,Toast},
        name: 'App',
        data() {
            return {
                refreshing:false,
                loadinging:false,
                noMore:false,
                couponInfo:[],

                token:'',
                imei:'',
                latitude:'',
                longitude:'',
            }
        },
        methods: {
            minibarLeftButtonClick:GLOBAL.throttle(function () {
                navigator.pop({animated:'false'});
            }),

            onrefreshOrder:GLOBAL.throttle(function () {//下拉刷新

                var that=this;
                that.refreshing=true;
                var param = that.GLOBAL.sign(that.token,that.imei);
                param+='&page=0' +'&latitude='+that.latitude +'&longitude='+that.longitude;

                post.fetch({
                    method: 'post',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/userapp/Mine/getMemberCard',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                },function(res){
                    if(res.data.res==1){
                        that.couponInfo=res.data.data.couponInfo;
                        if(res.data.data.couponInfo.length<20) {
                            setTimeout(function () {
                                that.noMore=true;
                            },50)
                        }
                    }
                    else{
                        const toast =that.$refs.toast;
                        toast.editContent(res.data.info);
                    }
                    that.refreshing=false;
                });
            }),//下拉刷新

            onloadingOrder:GLOBAL.throttle(function () {//上拉加载

                var that=this;

                that.loadinging=true;
                var page = that.couponInfo.length;
                var param = that.GLOBAL.sign(that.token,that.imei);
                param+='&page='+page +'&latitude='+that.latitude +'&longitude='+that.longitude;

                post.fetch({
                    method: 'post',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/userapp/Mine/getMemberCard',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                },function(res){
                    if(res.data.res==1){
                        that.couponInfo=that.couponInfo.concat(res.data.data.couponInfo);
                    }
                    else{
                        const toast =that.$refs.toast;
                        toast.editContent(res.data.info);
                        that.noMore=true;
                    }
                    that.loadinging=false;
                });
            }),//上拉加载

            goShop:GLOBAL.throttle(function (index) {//跳转去店铺
                var that=this;
                var orderType='';
                var shopType='';
                if(that.couponInfo.featured==0) {//主打业务 0 外卖 3堂食预订 5到店自取
                    orderType=0;
                    shopType=1;
                }
                else if(that.couponInfo.featured==3){
                    orderType=3;
                    shopType=5;
                }
                else if(that.couponInfo.featured==5){
                    orderType=5;
                    shopType=2;
                }

                var shopId=that.couponInfo[index].shopId;

                var url='http://assets/businessOrder.js';
                var param={shopId:shopId,orderType:orderType,shopType:shopType};
                event.toUrl({url:url,param:JSON.stringify(param)});
            }),//跳转去店铺

        },
        created(){
            var that=this;
            event.init();
            that.latitude = weex.config.latitude;
            that.longitude = weex.config.longitude;
            that.onrefreshOrder();
        },
    }
</script>

<style scoped>

    /*没有更多了start*/
    .moreRecentlyOrder{
        align-items: center;
        justify-content: center;
        height: 60px;
    }

    .moreRecentlyOrderText{
        font-size: 28px;
        color:#999;
    }
    /*没有更多了end*/


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


    /*会员店铺列表start*/
    .list{
        width: 750px;
        flex: 1;
        padding-top: 20px;
    }
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
    .shopImg{
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
    .shopName{
        flex: 1;
        text-overflow: ellipsis;
        lines:1;
    }
    .integral{
        flex: 1.2;
        height: 130px;
        justify-content: space-between;
        padding-top: 10px;
        padding-bottom: 10px;
    }
    .num{
        font-weight: bold;
        color: #e51b21;
        font-size: 50px;
    }
    .integralText{
        color: #e51b21;
        margin-top: 23px;
        margin-left: 3px;
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
    /*会员店铺列表end*/


    .membershipCard{
        background-color: #f8f8f8;
    }
    .row{
        flex-direction: row;
        align-items: center;
    }

</style>
