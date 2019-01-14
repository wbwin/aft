<template>
    <div class="wrapper">

        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    v-once>
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">今日实时数据</text>
            </wxc-minibar>
        </div>

        <div class="panel" >
            <div class="row aiCenter">
                <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">营业额</text>
                <text class="news">新</text>
                <text class="querter">?</text>
            </div>
            <div class="dataText row">
                <text class="black" :style="{fontSize:GLOBAL.bigFS}" >￥ </text>
                <text class="black number">{{total.needPay}}</text>
            </div>
            <div class="turnoverInfo row">
                <div class="flex1 line">
                    <div class="ordeInfo">
                        <div class="row aiCenter">
                            <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">有效订单 </text>
                            <text class="querter">?</text>
                        </div>
                        <div class="dataTextSmall row">
                            <text class="black numberSmall" >{{total.orderNum}}</text>
                            <text class="black words" :style="{fontSize:GLOBAL.defaultFS}">单</text>
                        </div>
                    </div>
                    <div class="ordeInfo">
                        <div class="row aiCenter">
                            <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">无效订单 </text>
                            <text class="querter">?</text>
                        </div>
                        <div class="dataTextSmall row">
                            <text class="black numberSmall" >{{total.loss}}</text>
                            <text class="black words" :style="{fontSize:GLOBAL.defaultFS}">单</text>
                        </div>
                    </div>
                </div>
                <div class="flex1">
                    <div class="ordeInfo">
                        <div class="row aiCenter">
                            <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">预计订单收入 </text>
                            <text class="querter">?</text>
                        </div>
                        <div class="dataTextSmall row">
                            <text class="black words" :style="{fontSize:GLOBAL.defaultFS}">￥</text>
                            <text class="black numberSmall" >{{total.plan}}</text>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="ainder">
            <div class="asin row">
                <div class="quSi flex1 aiCenter jcCenter" :class="[dataChoice===1?'activeBorder':'']" @click="dataFn(1)">
                    <text class="dColor" :class="[dataChoice===1?'active':'']" :style="{fontSize:GLOBAL.bigFS}">营业额趋势</text>
                </div>
                <div class="quSi flex1 aiCenter jcCenter" :class="[dataChoice===2?'activeBorder':'']" @click="dataFn(2)">
                    <text class="dColor" :class="[dataChoice===2?'active':'']" :style="{fontSize:GLOBAL.bigFS}">有效订单趋势</text>
                </div>
            </div>
            <web ref="firWebview" class="customer"  src="https://www.aftdc.com/mobile/public/echarts.html"
                 @pagefinish="firOnPageFinish"></web>
            <div class="asinCK row">
                <div class="flex1 aiCenter jcCenter" :class="[timeChoice===1?'':'activeBg']" @click="timeFn(1)">
                    <text class="dColor" :class="[timeChoice===1?'active':'']" :style="{fontSize:GLOBAL.bigFS}">累计</text>
                </div>
                <div class="flex1 aiCenter jcCenter" :class="[timeChoice===2?'':'activeBg']" @click="timeFn(2)">
                    <text class="dColor" :class="[timeChoice===2?'active':'']" :style="{fontSize:GLOBAL.bigFS}">分时</text>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
    import {WxcMinibar} from 'weex-ui';
    var post = weex.requireModule('stream');
    const webview = weex.requireModule('webview');
    const event = weex.requireModule('event');
    export default {
        components: {WxcMinibar},
        data() {
            return {
                total:{},
                chart:[],
                timeChoice:1,//累计或者分时选择
                dataChoice:1,//营业额还是有效订单
                alls:{},
                token:'',
                imei:'',
            }
        },


        created() {
            var that = this;
            that.token = weex.config.token;
            that.imei = weex.config.imei;

            var param = this.GLOBAL.sign(this.token,this.imei);
            post.fetch({
                method: 'POST',
                type: 'json',
                body: param,
                url: 'https://www.aftdc.com/businessapp/Manage/getToday',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
            },function (res) {
                that.alls = res.data;
                that.chart = res.data.price_lj;
                that.total = res.data.total;
            })
        },

        methods: {

            minibarLeftButtonClick() {

            },
            timeFn(index){
                this.timeChoice=index
                var dataChoice=this.dataChoice;
                var alls=this.alls
                if(index==1){//累计
                    this.chart=dataChoice==1?alls.price_lj:alls.numb_lj
                }else{
                    this.chart=dataChoice==1?alls.price:alls.numb
                }

                this.firOnPageFinish();
            },
            dataFn(index){
                this.dataChoice=index;
                var timeChoice=this.timeChoice;
                var alls=this.alls;
                if(index==1){
                    this.chart=timeChoice==1?alls.price_lj:alls.price
                }else{
                    this.chart=timeChoice==1?alls.numb_lj:alls.numb
                }
                this.firOnPageFinish();
            },
            firOnPageFinish(){
                var that=this
                webview.postMessage(that.$refs.firWebview, {message: {chart:that.chart,chartType:1}});
            },
        }
    }



</script>

<style scoped>

    .wrapper {
        position: relative;
        flex-direction: column;
        background-color: #efefef;
    }
    .minibar {
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: #f1f1f1;
    }
    .dColor {
        color: #666;
    }
    .black {
        color: #525252;
    }
    .flex1 {
        flex: 1;
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

    .panel {
        background-color: #fff;
        padding-top: 24px;
        padding-left: 28px;
        padding-bottom: 40px;
        margin-bottom: 20px;
    }
    .news{
        font-size: 24px;
        border-width: 1px;
        border-style: solid;
        border-color: #ff0000;
        padding-top: 1px;
        padding-bottom: 1px;
        padding-left: 1px;
        padding-right: 1px;
        line-height: 26px;
        color: #ff0000;
        align-items: center;
        border-radius: 3px;
        margin-left: 8px;
    }
    .querter{
        width: 30px;
        height: 30px;
        line-height: 30px;
        background-color: #C0C0C0;
        font-size: 24px;
        text-align: center;
        border-radius: 50px;
        cursor: pointer;
        color: #fff;
        margin-left: 10px;

    }
    .dataText {
        height: 60px;
        align-items: flex-end;
    }
    .number {
        font-size: 50px;
        line-height: 40px;
        font-weight: bold;
    }
    .turnoverInfo {
        padding-top: 20px;
    }
    .numberSmall {
        font-size: 36px;
        line-height: 32px;
        font-weight: bold;
    }
    .dataTextSmall {
        height: 40px;
        align-items: flex-end;
    }
    .words {
        line-height: 30px;
    }
    .ordeInfo {
        margin-top: 6px;
    }
    .line {
        border-right-width: 2px;
        border-right-style: dashed;
        border-right-color: #ebebeb;
        margin-right: 28px;
    }
    .ainder{
        background-color: #fff;
    }
    .asin{
        width: 750px;
        height: 90px;
    }
    .quSi{
        border-bottom-width: 8px;
        border-bottom-style: solid;
        border-bottom-color: #fff;
    }
    .active {
        color: #53beb7;
    }
    .activeBorder {
        border-bottom-color: #53beb7;
    }
    .customer {
        width: 750px;
        height: 375px;
    }
    .asinCK{
        height: 90px;
    }
    .activeBg {
        background-color: #f5f9f8;
    }

</style>
