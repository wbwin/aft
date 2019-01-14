<template>
    <div class="Analysis">

        <!--头部-->
        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="back()"
                    v-once
            >
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">流量分析</text>
            </wxc-minibar>
        </div>

        <scroller class="scroller">


            <div class="topnBun row" @click="topnBunClick">
                <text class="shiSiIcon"></text>
                <text class="lvLin" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">今日实时数据</text>
                <text :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">(统计"阿凡提"和"阿凡提小程序"数据)</text>
            </div>

            <!--统计表-->
            <div class="table row">

                <div class="tableLeft">
                    <text class="tableText" :style="{fontSize:GLOBAL.defaultFS}">曝光</text>
                    <div class="line"></div>
                    <div class="jiantou"></div>
                    <div class="line"></div>
                    <text class="tableText" :style="{fontSize:GLOBAL.defaultFS}">访问</text>
                    <div class="line"></div>
                    <div class="jiantou"></div>
                    <div class="line"></div>
                    <text class="tableText" :style="{fontSize:GLOBAL.defaultFS}">下单</text>
                </div>

                <div class="tableRight">

                    <div class="tableRightOne row">
                        <div class="oneLeft row">
                            <text class="tabelText" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">{{exposure.visibility}}</text>
                            <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">人</text>

                        </div>
                        <div class="oneRight row">
                            <text class="tabelText" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">{{exposure.app_visibility}}</text>
                            <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">人</text>
                        </div>
                    </div>

                    <div class="tableRightTwo row">
                        <div class="transverseLine"></div>
                        <text class="tableRightTwoText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">访问转化率: {{pageviewsRate}}</text>
                        <div class="transverseLine"></div>
                    </div>

                    <div class="tableRightOne row">
                        <div class="oneLeft row">
                            <text class="tabelText" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">{{pageviews.views}}</text>
                            <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">人</text>

                        </div>
                        <div class="oneRight row">
                            <text class="tabelText" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">{{pageviews.app_views}}</text>
                            <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">人</text>
                        </div>
                    </div>

                    <div class="tableRightTwo row">
                        <div class="transverseLine"></div>
                        <text class="tableRightTwoText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">下单转化率: {{ordersRate}}</text>
                        <div class="transverseLine"></div>
                    </div>

                    <div class="tableRightOne row">
                        <div class="oneLeft row">
                            <text class="tabelText" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">{{orders.appletsNum}}</text>
                            <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">人</text>
                        </div>
                        <div class="oneRight row">
                            <text class="tabelText" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">{{orders.appNum}}</text>
                            <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">人</text>
                        </div>
                    </div>
                </div>
            </div>
        </scroller>
    </div>
</template>

<script>
    import {WxcPopup, WxcMask, WxcIcon, WxcMinibar, WxcPopover} from 'weex-ui';
    const modal = weex.requireModule('modal');
    const event = weex.requireModule('event');
    const post = weex.requireModule('stream');

    export default {
        components: {WxcPopup, WxcMask, WxcIcon, WxcMinibar, WxcPopover},
        data() {
            return {
                exposure:{},//曝光量
                orders:{},//订单量
                pageviews:{},//浏览量
                pageviewsRate:'',//访问转化率
                ordersRate:'',//下单转化率
                token:'',
                imei:'',
            }
        },
        created: function () {
            var that=this;
            event.init();
            that.token = weex.config.token;
            that.imei = weex.config.imei;
            that.getData();
        },
        methods: {
            getData: function () {
                let that = this;
                var param = this.GLOBAL.sign(this.token,this.imei) ;//改
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/businessapp/Manage/getFlowHappening',//改
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                }, function (res) {
                    let exposure = that.exposure = res.data.visibility;//曝光量
                    let orders = that.orders = res.data.orders;//订单量
                    let pageviews = that.pageviews = res.data.views;//浏览量
                    that.pageviewsRate = that.pros((parseInt(pageviews.views) + parseInt(pageviews.app_views)), (parseInt(exposure.app_visibility) + parseInt(exposure.visibility))) * 100 + "%";
                    that.ordersRate = that.pros((parseInt(orders.appletsNum) + parseInt(orders.appNum)), (parseInt(pageviews.views) + parseInt(pageviews.app_views))) * 100 + "%";
                })
            },
            pros(up,down){
                //分母不能为0
                let d = parseInt(down * 100) / 100;
                d = d === 0 ? 1 : d;
                return (Math.round(Math.abs(up) / d * 100) / 100);
            }
        }
    }
</script>


<style scoped>
    .lvLin {
        font-weight: 600;
        margin-left: 20px;
        margin-right: 20px;
    }

    .shiSiIcon {
        width: 8px;
        height: 29px;
        background-color: #53beb7;
    }

    .topnBun {
        padding-top: 30px;
        padding-bottom: 30px;
        padding-left: 25px;
        padding-right: 25px;
        background-color: #fff;
        border-bottom-style: solid;
        border-bottom-width: 2px;
        border-bottom-color: #e0e0e0;
    }

    .scroller {
        flex: 1;
        width: 750px;
    }
    .Analysis {
        background-color: #f8f8f8;
    }
    .row {
        flex-direction: row;
        align-items: center;
    }
    .table{
        padding-bottom: 30px;
        padding-left: 90px;
        padding-right: 30px;
        background-color: #fff;
    }
    .tableLeft{
        align-items: center;
        width: 120px;
    }
    .tableText{
        width: 120px;
        height: 50px;
        line-height: 50px;
        text-align: center;
        border-style: solid;
        border-width: 1px;
        border-color: #FFA500;
        border-radius: 30px;
    }
    .line{
        width: 1px;
        height: 65px;
        border-style: solid;
        border-width: 1px;
        border-color: #dedede;
        margin-top: 5px;
        margin-bottom: 5px;
    }
    .jiantou{
        width: 20px;
        height: 20px;
        border-left-style: solid;
        border-left-width: 2px;
        border-left-color: #dedede;
        border-bottom-style: solid;
        border-bottom-width: 2px;
        border-bottom-color: #dedede;
        transform: rotate(-45deg) translate(0px,-30px);
    }
    .tableRight{
        width: 510px;
    }
    .tableRightOne{
        padding-top: 30px;
        padding-bottom: 30px;
    }
    .oneLeft{
        border-right-style: solid;
        border-right-width: 2px;
        border-right-color: #dedede;
        flex: 1;
        justify-content: center;
        padding-top: 30px;
        padding-bottom: 30px;
    }
    .oneRight{
        flex: 1;
        justify-content: center;
    }
    .tabelText{
        font-weight: bold;
    }
    .transverseLine{
        width: 100px;
        height: 1px;
        border-bottom-style: solid;
        border-bottom-width: 1px;
        border-bottom-color: #dedede;
    }
    .tableRightTwoText{
        width: 310px;
        height: 60px;
        line-height: 60px;
        text-align: center;
        background-color: #f8f8f8;
        border-radius: 60px;
    }
</style>


