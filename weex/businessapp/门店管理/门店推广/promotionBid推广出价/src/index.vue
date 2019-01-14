<template>
    <div class="promotionBid">

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
                <text :style="GLOBAL.headerCenter"  slot="middle">推广出价</text>
            </wxc-minibar>
        </div>

        <div class="slider row">

            <!--手动出价-->
            <div class="scrollerDiv">
                <scroller class="scroller">

                    <!--<div class="manual">-->
                    <!--<div class="manualEstimate row">-->
                    <!--<text class="manualEstimateOne" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">出价效果预估</text>-->
                    <!--<text class="manualEstimateTwo" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">(点击出价0.3元)</text>-->
                    <!--</div>-->
                    <!--<div class="manualCenter row">-->
                    <!--<div class="manualCenterLeft">-->
                    <!--<text class="manualCenterLeftOne" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">全天顾客访问预估</text>-->
                    <!--<text class="manualCenterLeftTwo" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">- - 次</text>-->
                    <!--</div>-->
                    <!--<div class="manualCenterRight">-->
                    <!--<text class="manualCenterLeftOne" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">全天顾客访问预估</text>-->
                    <!--<text class="manualCenterLeftTwo" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">- - 次</text>-->
                    <!--</div>-->
                    <!--</div>-->
                    <!--<text class="manualBottom" v-if="rest" :style="{fontSize:GLOBAL.smallFS}">门店最近休息,暂时无法为您预估顾客访问次数</text>-->
                    <!--</div>-->

                    <div class="manualBottomDiv">
                        <div class="manualBottomClickDiv">
                            <div class="manualBottomClickSmallDiv" :style="{left:changeWidth}">
                                <text class="manualBottomClick" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.tColor}">点击出价</text>
                                <text class="manualBottomClickMoney" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.tColor}">{{changeMoney}}元</text>
                            </div>
                        </div>
                        <div class="row detailsDiv">
                            <text :style="{fontSize:GLOBAL.smallerFS,color:GLOBAL.dColor}">{{minimumBid}}元</text>
                            <text :style="{fontSize:GLOBAL.smallerFS,color:GLOBAL.dColor}">{{maximumBid}}元</text>
                        </div>
                        <div class="manualBottomChange row">
                            <div class="plus" @click="reduceClick">
                                <div class="plusIn"></div>
                            </div>
                            <div class="ChangeDivOne" @touchstart="touchstart" @touchmove="touchmove">
                                <div class="ChangeDiv">
                                    <div class="ChangeDivColor" :style="{width:changeWidth+'px'}"></div>
                                </div>
                                <div class="manualBottomChangeGarden" :style="{left:changeLeft+'px'}"></div>
                            </div>
                            <div class="plus" @click="plusClick">
                                <div class="plusInT"></div>
                                <div class="plusInTwo"></div>
                            </div>
                        </div>
                    </div>

                    <div class="trusteeshipOpen row">
                        <div class="trusteeshipOpenLeft">
                            <div class="trusteeshipOpenLeftTop row">
                                <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{startSwitch?'已开启':'已关闭'}}智能托管</text>
                                <text class="trusteeshipExplain" :style="{fontSize:GLOBAL.smallerFS,color:GLOBAL.tColor}">智能托管说明</text>
                            </div>
                            <text class="trusteeshipOpenLeftBottom" :style="{fontSize:GLOBAL.smallerFS}">开启后手动出价变成无效状态</text>
                        </div>

                        <!--绿色按钮-->
                        <div ref="test2" :style="{backgroundColor:backgroundColorTwo}" :class="[startSwitch==false?'close':'open']"
                             style="justify-content: center;padding-left: 1px;"
                             @click="bill">
                            <div ref="test1" :class="[startSwitch==false?'isClose':'isOpen']"></div>
                        </div>
                    </div>
                    <text class="details" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">只有您的门店被顾客点击时,系统才会进行计费,且计费金额小于您的出价</text>
                    <text class="detailsTwo" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">特殊说明:预估的顾客访问数仅供参考,以实际值为准</text>

                </scroller>


                <div class=" enterButton">
                    <wxc-button class="okButton" text="确认出价" :textStyle="GLOBAL.buttonText" :btnStyle="GLOBAL.defaultButton"
                                @wxcButtonClicked="toEnterMessage"></wxc-button>
                </div>
            </div>
        </div>
        <toast ref="toast"></toast>
    </div>
</template>
<script>
    import {WxcButton,WxcMinibar,WxcMask } from 'weex-ui'
    import Toast from './Toast.vue'
    const event = weex.requireModule('event');
    const post = weex.requireModule('stream');
    const navigator = weex.requireModule('navigator');
    const animation = weex.requireModule('animation');
    export default {
        components: {WxcButton, Toast, WxcMinibar,WxcMask },
        data() {
            return {
                rest:true,//门店最近是否休息
                startSwitch: false,//switch一开始的状态
                backgroundColorTwo:'',//动画背景色
                prevent:true,//阻止多次点击绿色按钮
                changeMoney:0.3,//出价
                minimumBid:'0.1',//最大金额
                maximumBid:'3.0',//最大金额
                sliderIndex:0,
                changeWidth:38,
                changeLeft:43,
                token:'',
                imei:'',
            }
        },
        created: function () {
            //上一个页面传值
            // if (weex.config.param) {
            //     this.changeMoney = JSON.parse(weex.config.param).bid;
            //     var hosting = JSON.parse(weex.config.param).hosting;
            //     if (hosting === 1) {
            //         this.startSwitch = false;
            //         this.bill();
            //     } else {
            //         this.startSwitch = true;
            //         this.bill();
            //     }
            // }
            //获取数据库数据
            this.token = weex.config.token;
            this.imei = weex.config.imei;
            var param = this.GLOBAL.sign(this.token,this.imei);
            var that = this;
            post.fetch({
                method: 'POST',
                type: 'json',
                body: param,
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                url: 'https://www.aftdc.com/businessapp/Promotion/getBid',
            }, function (e) {
                const toast = that.$refs.toast;
                if (e.data.res === -2) {
                    that.toLogin();
                } else if (e.data.res === 1){
                    if (e.data.msg) toast.editContent(e.data.msg);
                    that.changeMoney = e.data.promotionInfo.bid;
                    that.changeWidth = (that.changeMoney * 10 - 1) * 19;
                    that.changeLeft = that.changeWidth + 5;
                    if (e.data.promotionInfo.hosting === 1) {
                        that.startSwitch = false;
                        that.bill();
                    } else {
                        that.startSwitch = true;
                        that.bill();
                    }
                } else {
                    if (e.data.msg) toast.editContent(e.data.msg);
                    else toast.editContent('抱歉，网络出错，请稍后再试！');
                    return false;
                }
            });
        },
        methods: {
            touchstart(e){
                if(e.changedTouches[0].screenX<=635&&e.changedTouches[0].screenX>=95) {
                    this.changeWidth = e.changedTouches[0].screenX - 95;
                    this.changeLeft = this.changeWidth+5;
                    if((this.changeWidth/180).toFixed(1)<0.1) {
                        this.changeMoney=0.1
                    }
                    else{
                        this.changeMoney = (this.changeWidth / 180).toFixed(1);
                    }
                }
            },
            touchmove(e){
                if(e.changedTouches[0].screenX<=635&&e.changedTouches[0].screenX>=95){
                    this.changeWidth=e.changedTouches[0].screenX-95;
                    this.changeLeft=this.changeWidth+5;
                    if((this.changeWidth/180).toFixed(1)<0.1){
                        this.changeMoney=0.1
                    }
                    else{
                        this.changeMoney=(this.changeWidth/180).toFixed(1);
                    }
                }
            },
            reduceClick(){
                if(this.changeWidth>19){
                    this.changeWidth-=19;
                    this.changeLeft=this.changeWidth+5;
                    this.changeMoney=(this.changeMoney-0.1).toFixed(1);
                    // else{
                    //     this.changeMoney=(this.changeWidth/180).toFixed(1);
                    // }
                }
                else{
                    this.changeWidth=0;
                    this.changeLeft=this.changeWidth+5;
                    this.changeMoney=0.1;
                }
            },
            plusClick(){
                if(this.changeWidth<531){
                    this.changeWidth+=19;
                    this.changeLeft=this.changeWidth+5;
                    this.changeMoney=(this.changeMoney-(-0.1)).toFixed(1);
                    // this.changeMoney=(this.changeWidth/180).toFixed(1);
                }
                else{
                    this.changeWidth=540;
                    this.changeLeft=this.changeWidth+5;
                    this.changeMoney=3;
                    this.changeMoney=this.changeMoney.toFixed(1);
                }
            },
            toEnterMessage(){
                const toast = this.$refs.toast;
                // var money=this.changeMoney;//出价金额
                // var trusteeship=this.startSwitch;//为true时开启智能推广
                var hosting = 0;
                if (this.startSwitch) hosting = 1;
                if (this.changeMoney < 0.1 || this.changeMoney > 3.0) {
                    toast.editContent('出价不合法！');
                    return false;
                }
                var param = this.GLOBAL.sign(this.token,this.imei);
                param += '&bid=' + this.changeMoney + '&hosting=' + hosting;
                var that = this;
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: 'https://www.aftdc.com/businessapp/Promotion/setBid',
                }, function (e) {
                    if (e.data.res === -2) {
                        that.toLogin();
                    } else if (e.data.res === 1){
                        if (e.data.msg) toast.editContent(e.data.msg);
                        var bidParam = {'bid': that.changeMoney};
                        event.save('bidParam', bidParam);
                        setTimeout(()=>navigator.pop({ animated: 'true' }),2000);
                    } else {
                        if (e.data.msg) toast.editContent(e.data.msg);
                        else toast.editContent('抱歉，网络出错，请稍后再试！');
                        return false;
                    }
                });
            },
            minibarLeftButtonClick(){
                navigator.pop({animated:'true'})
            },
            bill: function () {
                if(this.prevent){
                    this.prevent=false;
                    var that = this;
                    var testEl = '';
                    var testE2 = '';
                    var transform = '';
                    if (that.startSwitch) {
                        // 解决兼容star
                        setTimeout(function () {
                            that.backgroundColorTwo='#e2e2e2'
                        },450);
                        // 解决兼容end
                        testEl = this.$refs.test1;
                        testE2 = this.$refs.test2;
                        transform = 'translate(0px, 0px)';
                        animation.transition(testEl, {
                            styles: {
                                transform: transform,
                            },
                            duration: 500, //ms
                            timingFunction: 'ease',
                            delay: 0 //ms
                        },function () {
                            that.prevent=true;
                        });
                        animation.transition(testE2, {
                            styles: {
                                backgroundColor: '#e2e2e2',
                            },
                            duration: 500, //ms
                            timingFunction: 'ease',
                            delay: 0 //ms
                        });
                        that.startSwitch=false;
                    } else {
                        // 解决兼容star
                        setTimeout(function () {
                            that.backgroundColorTwo='#4ed465'
                        },450);
                        //解决兼容end
                        testEl = this.$refs.test1;
                        testE2 = this.$refs.test2;
                        transform = 'translate(52px, 0px)';
                        animation.transition(testEl, {
                            styles: {
                                transform: transform,
                            },
                            duration: 500, //ms
                            timingFunction: 'ease',
                            delay: 0 //ms
                        },function () {
                            that.prevent=true;
                        });
                        animation.transition(testE2, {
                            styles: {
                                backgroundColor: '#4ed465',
                            },
                            duration: 500, //ms
                            timingFunction: 'ease',
                            delay: 0 //ms
                        },function () {
                            that.backgroundColorTwo='#4ed465'
                        });
                        that.startSwitch=true;
                    }
                }
            },//绿色按钮
            //跳转登录
            toLogin(){
                event.delete("businessToken");
                event.delete("shopId");
                event.delete("shopName");
                const toast = this.$refs.toast;
                toast.editContent('退出成功！');
                var url='http://assets/login.js';
                var param='';
                event.toUrl({url:url,param:param});
                navigator.pop({ animated: 'false' });
            },
        },
        // mounted() {
        //     var that = this;
        //     that.startSwitch=!that.startSwitch;
        //     that.bill()
        // },
    }
</script>

<style scoped>
    .trusteeshipOpenLeftBottom{
        margin-top: 5px;
        color: #999;
    }
    .trusteeshipExplain{
        margin-left: 10px;
    }
    .trusteeshipOpen{
        margin-left: 25px;
        margin-right: 25px;
        margin-top: 25px;
        padding-top: 25px;
        padding-bottom: 25px;
        padding-left: 25px;
        padding-right: 25px;
        background-color: #fff;
        border-radius: 10px;
        justify-content: space-between;
    }
    .open {
        width: 104px;
        height: 52px;
        border-radius: 52px;
        border-width: 1px;
        border-style: solid;
        border-color: white;

    }

    .close {
        width: 104px;
        height: 52px;
        border-radius: 52px;
        border-width: 1px;
        border-style: solid;
        border-color: #bbbbbb;

    }

    .isOpen {
        width: 50px;
        height: 50px;
        border-radius: 26px;
        border-width: 1px;
        border-style: solid;
        border-color: #e2e2e2;
        background-color: #ffffff;
    }

    .isClose {
        width: 50px;
        height: 50px;
        background-color: white;
        border-radius: 26px;
        border-width: 1px;
        border-style: solid;
        border-color: #e2e2e2;

    }
    .ChangeDivColor{
        height: 10px;
        background-color: #53beb7;
    }
    .ChangeDivOne{
        padding-top: 30px;
        padding-bottom: 30px;
        /*background-color: greenyellow;*/
        position: relative;
    }
    .ChangeDiv{
        width: 540px;
        height: 10px;
        background-color: #f1f1f1;
        margin-left: 25px;
        margin-right: 25px;
    }
    .plusIn{
        position: absolute;
        height: 5px;
        width: 25px;
        top: 25px;
        left: 25px;
        background-color: #53beb7;
    }
    .plusInT{
        position: absolute;
        height: 5px;
        width: 25px;
        top: 25px;
        left: 5px;
        background-color: #53beb7;
    }
    .plusInTwo{
        position: absolute;
        height: 25px;
        width: 5px;
        top: 15px;
        left: 15px;
        background-color: #53beb7;
    }
    .plus{
        width: 55px;
        height: 55px;
        position: relative;
        /*background-color: green;*/
    }
    .manualBottomChangeGarden{
        width: 40px;
        height: 40px;
        border-radius: 20px;
        position: absolute;
        top: 16px;
        background-color: rgba(0,0,0,0.2);
    }
    .manualBottomChange{
    }
    .detailsDiv{
        justify-content: space-between;
        margin-left: 50px;
        margin-right: 50px;
    }
    .manualBottomClickMoney{
        text-align: center;
        font-weight: bold;
    }
    .manualBottomClick{
        text-align: center;
    }
    .manualBottomDiv{
        padding-top: 25px;
        margin-left: 25px;
        margin-right: 25px;
        background-color: #fff;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
    }
    .manualBottomClickDiv{
        position: relative;
        height: 80px;
        margin-left: 10px;
        /*background-color: orange;*/
    }
    .manualBottomClickSmallDiv{
        position: absolute;
        top: 0;
        bottom: 0;
        width: 150px;
    }
    .enterButton {
        width: 750px;
        flex-direction: row;
        justify-content: space-around;
        /*position: fixed;*/
        /*left: 0;            存在时固定在底部*/
        /*bottom: 0;*/
        /*right: 0;*/
        padding-top: 20px;
        padding-bottom: 20px;
        padding-left: 30px;
        padding-right: 30px;
    }

    .okButton:active {
        background-color: #57aba5;
    }
    .details{
        padding-top: 25px;
        padding-left: 50px;
        padding-right: 50px;
        line-height: 30px;
    }
    .detailsTwo{
        padding-left: 50px;
        padding-right: 50px;
        padding-top: 35px;
    }
    .manualBottom{
        padding-top: 25px;
        padding-bottom: 25px;
        margin-left: 25px;
        margin-right: 25px;
        color: #f85959;
        border-bottom-style: dashed;
        border-bottom-width: 2px;
        border-bottom-color: #dedede;
    }
    .manualCenterLeftTwo{
        margin-top: 30px;
    }
    .manualCenterRight{
        flex: 1;
        padding-left: 20px;
    }
    .manualCenterLeft{
        border-right-style: dashed;
        border-right-width: 2px;
        border-right-color: #dedede;
        flex: 1;
    }
    .manualCenter{
        padding-top: 30px;
        padding-bottom: 30px;
        margin-left: 25px;
        margin-right: 25px;
        border-bottom-style: dashed;
        border-bottom-width: 2px;
        border-bottom-color: #dedede;
        border-top-style: dashed;
        border-top-width: 2px;
        border-top-color: #dedede;
    }
    .manualEstimate{
        padding-top: 25px;
        padding-left: 25px;
        padding-right: 25px;
        padding-bottom: 25px;
        /*background-color: #f8f8f8;*/
    }
    .manual{
        background-color: #fff;
        margin-top: 25px;
        margin-left: 25px;
        margin-right: 25px;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;

        /*border-left-style: solid;*/
        /*border-left-width: 2px;*/
        /*border-left-color: #f1f1f1;*/
        /*border-top-style: solid;*/
        /*border-top-width: 2px;*/
        /*border-top-color: #f1f1f1;*/
        /*border-right-style: solid;*/
        /*border-right-width: 2px;*/
        /*border-right-color: #f1f1f1;*/
        /*border-style: solid;*/
        /*border-width: 2px;*/
        /*border-color: #f1f1f1;*/
    }
    .scroller{
        flex: 1;
        width: 750px;
    }
    .scrollerDiv{
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
    }
    .slider{
        flex: 1;
        width: 750px;
        position: relative;
    }
    .promotionBid{
        background-color: #f8f8f8;
    }
    /*默认样式*/
    .row{
        flex-direction: row;
        align-items: center;
    }
</style>
