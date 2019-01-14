<template>
    <div class="openExtension">
        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    v-once
            >
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">推广数据</text>
                <image class="backImg" slot="right"
                       src="https://image.aftdc.com/appBimg/icon_add.png"></image>
            </wxc-minibar>
        </div>
        <scroller style="flex: 1;width: 750px;">

            <!--顶部暂停-->
            <div class="one row">
                <text class="oneText" :style="{fontSize:GLOBAL.smallFS}">!</text>
                <text class="oneTextTwo" :style="{fontSize:GLOBAL.defaultFS}">{{promotionInfo.status === 1 ? '推广已开始' : '因门店置休,推广已暂停'}}</text>
            </div>


            <div class="two">

                <!--未启推广-->
                <div class="twoTop row">
                    <text class="twoTopTextOne" :class="[startSwitch?'twoTopSelect':'']">￥</text>
                    <text class="twoTopTextTwo" :style="{fontSize:GLOBAL.defaultFS}" :class="[startSwitch?'twoTopSelectTwo':'']">{{startSwitch ? '已开启推广' : '未开启推广'}}</text>

                    <div ref="test2" :class="[startSwitch==false?'close':'open']"
                         style="justify-content: center;padding-left: 1px;"
                         @click="bill(1)">
                        <div ref="test1" :class="[startSwitch==false?'isClose':'isOpen']"></div>
                    </div>
                </div>


                <div class="twoBottom row">

                    <!--每日预算-->
                    <div class="twoBottomLeft">
                        <div class="twoBottomLeftOne row">
                            <text class="budget" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">每日预算</text>
                            <text class="budgetIcon">?</text>
                        </div>
                        <div class="twoBottomLeftTwo row">
                            <text class="money"  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{promotionInfo.budget ? promotionInfo.budget : '20'}}元</text>
                            <image class="moneyIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                        </div>
                        <div class="row" style="margin-top: 5px;">
                            <text class="twoBottomLeftThree" :style="{fontSize:GLOBAL.smallFS}">预算已消耗</text>
                            <text class="twoBottomLeftThreeOne" :style="{fontSize:GLOBAL.smallFS}">{{promotionInfo.deplete ? promotionInfo.deplete : '0'}}%</text>
                        </div>
                    </div>

                    <!--推广出价-->
                    <div class="twoBottomRight">
                        <div class="twoBottomLeftOne row">
                            <text class="budget" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">推广出价</text>
                            <text class="budgetIcon">?</text>
                        </div>
                        <div class="twoBottomLeftTwo row">
                            <text class="money"  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{promotionInfo.bid ? promotionInfo.bid : '0.3'}}元</text>
                            <image class="moneyIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                        </div>
                        <div class="row" style="margin-top: 5px;">
                            <text class="twoBottomLeftyellow" :style="{fontSize:GLOBAL.smallFS}">系统推荐</text>
                            <text class="twoBottomLeftyellowOne" :style="{fontSize:GLOBAL.smallFS}">{{promotionInfo.recommend ? promotionInfo.recommend : '0.3'}}元</text>
                        </div>
                    </div>
                </div>
            </div>

            <!--推广实况-->
            <div class="three row">
                <div class="threeLeft">
                    <text class="threeLeftOne" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">推广实况</text>
                    <text class="threeLeftTwo" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">点击查看最近1小时,门店推广的排名情况</text>
                </div>
                <image class="moneyIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
            </div>

            <!--数据切换按钮-->
            <div class="four row">
                <text class="fourText radius" :class="[fourSelect===0?'fourTextTwo':'']" @click="fourClick(0)">今日数据总览</text>
                <text class="fourTextThree radius" :class="[fourSelect===1?'fourTextTwo':'']" @click="fourClick(1)">历史数据分析</text>
            </div>
            <div class="chooseTime_row" v-if="fourSelect">
                <text class="chooseTime" @click="chooseTime">---  {{everyDays}}  ---</text>
            </div>

            <!--今日数据-->
            <div class="five">
                <div class="fiveTop row">
                    <text class="colorIcon"></text>
                    <text class="fiveTopTitle" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{fourSelect ? '当天数据': '今日数据'}}</text>
                    <text class="fiveTopLast" :style="{color:GLOBAL.dColor}">看不到推广排名?</text>
                </div>
                <div class="fiveCenter row">
                    <div class="fiveCenterLeft">
                        <div class="vistDiv row">
                            <text class="vistDivText">访问提升数</text>
                            <text class="vistDivIcon">?</text>
                        </div>
                        <div class="vistDivTwo row">
                            <text class="vistDivNumber" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{promotionData.views ? promotionData.views : '0'}}</text>
                            <text class="vistDivNunText" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">次</text>
                        </div>
                    </div>
                    <div class="fiveCenterRight">
                        <div class="vistDiv row">
                            <text class="vistDivText">曝光提升数</text>
                            <text class="vistDivIcon">?</text>
                        </div>
                        <div class="vistDivTwo row">
                            <text class="vistDivNumber" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{promotionData.exposure ? promotionData.exposure : '0'}}</text>
                            <text class="vistDivNunText" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">次</text>
                        </div>
                    </div>
                </div>
                <div class="fiveCenter row">
                    <div class="fiveCenterLeft">
                        <div class="vistDiv row">
                            <text class="vistDivText">推广消费</text>
                            <text class="vistDivIcon">?</text>
                        </div>
                        <div class="vistDivTwo row">
                            <text class="vistDivNumber" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{promotionData.total_consumption ? promotionData.total_consumption : '0'}}</text>
                            <text class="vistDivNunText" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">元</text>
                        </div>
                    </div>
                    <div class="fiveCenterRight">
                        <div class="vistDiv row">
                            <text class="vistDivText">单次访问消费</text>
                            <text class="vistDivIcon">?</text>
                        </div>
                        <div class="vistDivTwo row">
                            <text class="vistDivNumber" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{promotionData.consumption ? promotionData.consumption : '0'}}</text>
                            <text class="vistDivNunText" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">元</text>
                        </div>
                    </div>
                </div>
            </div>

            <!--今日趋势图-->
            <div class="six row">
                <div class="fiveTop row">
                    <text class="colorIcon"></text>
                    <text class="fiveTopTitle" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">今日趋势图</text>
                </div>
            </div>
        </scroller>
        <toast ref="toast"></toast>
    </div>
</template>
<script>
    import {WxcButton,WxcMinibar,WxcMask} from 'weex-ui'
    import {WxcDialog} from 'weex-ui';
    import Toast from './Toast.vue'
    const event = weex.requireModule('event');
    const navigator = weex.requireModule('navigator');
    const animation = weex.requireModule('animation');
    const post = weex.requireModule('stream');
    export default {
        components: {WxcButton, WxcDialog, Toast, WxcMinibar,WxcMask },
        data() {
            return {
                startSwitch: false,//switch一开始的状态
                fourSelect:0,
                promotionInfo: [],//推广设置信息
                promotionData: [],//推广数据
                everyDays: '',//历史数据（每天）
                token: '',
                imei: ''
            }
        },
        created: function () {
            //获取数据
            this.token = weex.config.token;
            this.imei = weex.config.imei;
            var param = this.GLOBAL.sign(this.token,this.imei);
            var that = this;
            post.fetch({
                method: 'POST',
                type: 'json',
                body: param,
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                url: 'https://www.aftdc.com/businessapp/Promotion/getPromotionData',
            }, function (e) {
                const toast = that.$refs.toast;
                if (e.data.res === -2) {
                    that.toLogin();
                } else if (e.data.res ===1){
                    if (e.data.msg) toast.editContent(e.data.msg);
                    if (e.data.promotionInfo) {
                        that.promotionInfo = e.data.promotionInfo;
                        if (that.promotionInfo.is_open) {
                            that.startSwitch = false;
                            that.bill(0);
                        } else {
                            that.startSwitch = true;
                            that.bill(0);
                        }
                    }
                    if (e.data.promotionData) that.promotionData = e.data.promotionData;
                } else {
                    if (e.data.msg) toast.editContent(e.data.msg);
                    else toast.editContent('抱歉，网络出错了，请稍后重试');
                    return false;
                }
            });
            //获取时间
            var now = new Date();
            that.everyDays = now.getFullYear() + "-" + ((now.getMonth() + 1) < 10 ? "0" : "") + (now.getMonth() + 1) + "-" + (now.getDate() < 10 ? "0" : "") + now.getDate();
            event.init();
            weex.requireModule('globalEvent').addEventListener('chooseTime', function (e) {
                that.everyDays=e.time;
                that.getEveryDays(that.everyDays);
            })
        },
        methods: {
            minibarLeftButtonClick(){
                var param = {'is_open': this.startSwitch,'status': this.promotionInfo.status};
                event.save('dataParam', param);
                navigator.pop({animated:'true'})
            },
            fourClick(index){
                this.fourSelect=index
            },
            //选择时间
            chooseTime() {
                event.chooseTime(true, true, true, false, false, false)
            },
            bill: function (is_click) {//is_click = 1为点击调用，is_click = 0为默认渲染
                var that = this;
                const toast = that.$refs.toast;
                var param = that.GLOBAL.sign(that.token,that.imei);
                var testEl = '';
                var testE2 = '';
                var transform = '';
                if (that.startSwitch) {
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
                    if (is_click) {
                        //关闭推广
                        param += '&is_open=' + 0;
                        post.fetch({
                            method: 'POST',
                            type: 'json',
                            body: param,
                            headers: { "Content-Type": "application/x-www-form-urlencoded" },
                            url: 'https://www.aftdc.com/businessapp/Promotion/setIs_open',
                        }, function (e) {
                            if (e.data.res === -2) {
                                that.toLogin();
                            } else if (e.data.res ===1){
                                if (e.data.msg) toast.editContent(e.data.msg);
                                that.promotionInfo.status = 0;
                            } else {
                                if (e.data.msg) toast.editContent(e.data.msg);
                                else toast.editContent('抱歉，网络出错，请稍后再试！');
                                that.startSwitch=true;
                                return false;
                            }
                        });
                    }
                } else {
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
                    });
                    animation.transition(testE2, {
                        styles: {
                            backgroundColor: '#4ed465',
                        },
                        duration: 500, //ms
                        timingFunction: 'ease',
                        delay: 0 //ms
                    });
                    that.startSwitch=true;
                    if (is_click) {
                        //开启推广
                        param += '&is_open=' + 1;
                        post.fetch({
                            method: 'POST',
                            type: 'json',
                            body: param,
                            headers: { "Content-Type": "application/x-www-form-urlencoded" },
                            url: 'https://www.aftdc.com/businessapp/Promotion/setIs_open',
                        }, function (e) {
                            if (e.data.res === -2) {
                                that.toLogin();
                            } else if (e.data.res ===1){
                                if (e.data.msg) toast.editContent(e.data.msg);
                                that.promotionInfo.status = 1;
                            } else {
                                if (e.data.msg) toast.editContent(e.data.msg);
                                else toast.editContent('抱歉，网络出错，请稍后再试！');
                                that.startSwitch=false;
                                return false;
                            }
                        });
                    }
                }
            },
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
            //获取历史数据
            getEveryDays(dayDate) {
                //获取数据
                var param = this.GLOBAL.sign(this.token,this.imei);
                param += '&dayDate=' + dayDate;
                var that = this;
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: 'https://www.aftdc.com/businessapp/Promotion/getEveryDays',
                }, function (e) {
                    const toast = that.$refs.toast;
                    if (e.data.res === -2) {
                        that.toLogin();
                    } else if (e.data.res ===1){
                        if (e.data.msg) toast.editContent(e.data.msg);
                        if (e.data.promotionData) that.promotionData = e.data.promotionData;
                        else that.promotionData = [];
                    } else {
                        that.promotionData = [];
                        if (e.data.msg) toast.editContent(e.data.msg);
                        else toast.editContent('抱歉，网络出错了，请稍后重试');
                        return false;
                    }
                });
            }
        },
        // mounted() {
        //     var that = this;
        //     that.startSwitch=!that.startSwitch
        //     that.bill()
        // },
    }
</script>

<style scoped>
    .six{
        background-color: #fff;
        margin-top: 15px;
    }
    .vistDivTwo{
        margin-top: 10px;
    }
    .vistDivNunText{
        margin-left: 5px;
    }
    .vistDivNumber{
        font-weight: bold;
    }
    .vistDivIcon{
        width: 20px;
        height: 20px;
        color: #fff;
        font-size: 20px;
        background-color: #ccc;
        margin-left:10px;
        border-radius: 10px;
        line-height: 20px;
        text-align: center;
    }
    .vistDivText{
        font-size: 22px;
        color: #999;
    }
    .fiveTopLast{
        font-size: 22px;
    }
    .fiveTopTitle{
        margin-left: 15px;
        font-weight: bold;
        flex: 1;
    }
    .colorIcon{
        width: 5px;
        height: 25px;
        background-color: #53beb7;
    }
    .fiveTop{
        padding-top: 25px;
        padding-right: 25px;
        padding-left: 25px;
        padding-bottom: 25px;
    }
    .fiveCenterRight{
        padding-left: 30px;
        flex: 1;
    }
    .fiveCenterLeft{
        padding-left: 30px;
        border-right-style: solid;
        border-right-color: #e1e1e1;
        border-right-width: 2px;
        flex: 1;
    }
    .fiveCenter{
        border-top-style: solid;
        border-top-color: #e1e1e1;
        border-top-width: 2px;
        padding-top: 15px;
        padding-bottom: 15px;
    }
    .five{
        background-color: #fff;
        margin-top: 15px;
    }
    .fourTextTwo{
        background-color: #53beb7;
        color: #fff;
    }
    .radius{
        border-style: solid;
        border-color: #53beb7;
        border-width: 2px;
        flex: 1;
        text-align: center;
        padding-top: 10px;
        padding-bottom: 10px;
        color: #53beb7;
        background-color: #fff;
        font-size: 24px;
    }
    .chooseTime{
        flex: 1;
        text-align: center;
        padding-top: 10px;
        padding-bottom: 10px;
        color: #53beb7;
        background-color: #fff;
        font-size: 24px;
    }
    .chooseTime_row{
        flex-direction: row;
        align-items: center;
        /*padding: 15px 60px;*/
        margin-top: 15px;
        background-color: #fff;
    }
    .fourText{
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
    }
    .fourTextThree{
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
    }
    .four{
        padding: 15px 60px;
        margin-top: 15px;
        background-color: #fff;
    }
    .threeLeftOne{
        font-weight: bold;
    }
    .threeLeftTwo{
        margin-top: 10px;
    }
    .three{
        padding: 30px 20px;
        justify-content: space-between;
        background-color: #fff;
        margin-top: 15px;
    }
    .twoBottomLeftTwo{
        margin-top: 8px;
    }
    .moneyIcon{
        width: 20px;
        height: 20px;
    }
    .twoBottomLeftyellowOne{
        font-weight: bold;
        color: #f09e4c;
        margin-left: 3px;
    }
    .twoBottomLeftyellow{
        color: #f09e4c;
    }
    .twoBottomLeftThree{
        margin-top: 5px;
        color: #999;
    }
    .twoBottomLeftThreeOne{
        margin-left: 3px;
        color: #999;
        font-weight: bold;
    }
    .money{
        font-weight: bold;
        flex: 1;
    }
    .budgetIcon{
        width: 20px;
        height: 20px;
        background-color: #ccc;
        color: #fff;
        font-size: 20px;
        line-height: 20px;
        text-align: center;
        border-radius: 10px;
        margin-left: 10px;
    }
    .budget{

    }
    .twoBottomLeft{
        flex: 1;
        margin-top: 20px;
        margin-bottom: 20px;
        padding-left: 20px;
        padding-right: 20px;
        border-right-style: dashed;
        border-right-width: 2px;
        border-right-color: #f1f1f1;
    }
    .twoBottomRight{
        margin-top: 20px;
        margin-bottom: 20px;
        padding-left: 20px;
        flex: 1;
    }
    .twoBottom{
    }
    .twoTopTextTwo{
        margin-left: 20px;
        color: #999;
        font-weight: bold;
        flex: 1;
    }
    .twoTopSelect{
        background-color: #53beb7;
    }
    .twoTopSelectTwo{
        color: #666;
    }
    .twoTopTextOne{
        width: 60px;
        height: 60px;
        line-height: 60px;
        background-color: #ccc;
        color: #fff;
        text-align: center;
        border-radius: 30px;
        font-weight: 900;
        font-size: 35px;
    }
    .twoTop{
        padding-top: 20px;
        padding-bottom: 20px;
        border-bottom-style: dashed;
        border-bottom-width: 2px;
        border-bottom-color: #e1e1e1;
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
    .oneTextTwo{
        margin-left: 5px;
        color: #ec6866;
    }
    .oneText{
        width: 20px;
        height: 20px;
        background-color: #ec6866;
        line-height: 20px;
        text-align: center;
        border-radius: 30px;
        color: #fff;
    }
    .one{
        padding-left: 20px;
        padding-top: 20px;
        padding-bottom: 20px;
        background-color: #fff;
    }
    .two{
        padding-left: 20px;
        padding-right: 20px;
        padding-bottom: 20px;
        background-color: #fff;
        margin-top: 15px;
    }
    .openExtension{
        background-color: #f8f8f8;
    }
    /*默认样式*/
    .row{
        flex-direction: row;
        align-items: center;
    }
</style>
