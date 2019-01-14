<template>
    <div class="wrapper" @viewappear="viewappear" @viewdisappear="viewdisappear" :style="{visibility: visibility}">

        <!--头部-->
        <div>
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    @wxcMinibarRightButtonClicked="sureClick"
                    v-once
            >
                <image :style="GLOBAL.headerImg" slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter" slot="middle">买赠活动</text>
                <text :style="GLOBAL.headerRight"  slot="right">保存</text>
            </wxc-minibar>
        </div>
        <!--<scroller class="scroller" :style="{height:height2!=0?'1250px':null,}">-->
        <scroller class="scroller">
            <!--开始日期结束日期-->
            <div class="daySelect" @touchstart="touchstart">

                <div class="daySelectTop row" @click="chooseTime(1)">
                    <text class="starTimeText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">开始日期</text>
                    <text class="starTime" :style="{fontSize:GLOBAL.defaultFS,color:startTime!=''?GLOBAL.dColor:'#999'}">{{startTime!=''?startTime:'未设置'}}</text>
                    <image class="moreIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                </div>
                <div class="daySelectBottom row" @click="chooseTime(0)">
                    <text class="starTimeText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">结束日期</text>
                    <text class="starTime" :style="{fontSize:GLOBAL.defaultFS,color:endTime!=''?GLOBAL.dColor:'#999'}">{{endTime!=''?endTime:'未设置'}}</text>
                    <image class="moreIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                </div>

            </div>

            <!--买x赠-->
            <div class="daySelect" @touchstart="touchstart">

                <div class="daySelectBottom row" @click="selectGoods">
                    <text class="starTimeText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">买x赠</text>
                    <text class="starTime" :style="{fontSize:GLOBAL.defaultFS,color:buyFood?GLOBAL.dColor:'#999'}">{{buyFood?buyFood.goodsName:'未选择'}}</text>
                    <image class="moreIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                </div>

            </div>

            <!--赠送y-->
            <div class="daySelect" @touchstart="touchstart">

                <div class="daySelectBottom row" @click="giveShopClick">
                    <text class="starTimeText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">赠送y</text>
                    <text class="starTime" :style="{fontSize:GLOBAL.defaultFS,color:giveFood?GLOBAL.dColor:'#999'}">{{giveFood?giveFood.goodsName:'未选择'}}</text>
                    <image class="moreIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                </div>

            </div>

            <!--赠品名称-->
            <!--<div class="daySelect" >-->

            <!--<div class="daySelectBottom row">-->
            <!--<text class="starTimeText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">赠品名称</text>-->
            <!--<text class="starTime" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{TgoodsName!=''?TgoodsName:'赠送商品名称'}}</text>-->
            <!--<image class="moreIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>-->
            <!--</div>-->

            <!--</div>-->

            <!--买赠数量-->
            <div class="daySelect">

                <div class="daySelectBottom row">
                    <text class="starTimeText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">买赠数量</text>
                    <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">买</text>
                    <input class="numInput" type="number" placeholder="点击输入" :style="GLOBAL.inputText" ref="toastOne" v-model="bayNum" @focus="allFocus" @blur="allBlur" @input="inputBuy" @touchstart.stop="">
                    <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">赠</text>
                    <input class="numInput" style="margin-right: 0px" type="number" placeholder="点击输入" :style="GLOBAL.inputText" ref="toastTwo" v-model="giveNum" @focus="allFocus" @blur="allBlur" @input="inputGive" @touchstart.stop="">
                </div>

            </div>

            <!--库存-->
            <div class="agreement row" @touchstart="touchstart">

                <div class="agreementDiv row">
                    <text class="" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">库存数量无限</text>
                </div>

                <div ref="test2Stock" :style="{backgroundColor:backgroundColorStock}" :class="[startSwitchStock==false?'close':'open']"
                     style="justify-content: center;padding-left: 1px;"
                     @click="billStock">
                    <div ref="test1Stock" :class="[startSwitchStock==false?'isClose':'isOpen']"></div>
                </div>

            </div>
            <div class="betweenDiv" v-if="!startSwitchStock">
                <text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor,flex:0.4}">库存数量</text>
                <div class="inputDiv">
                    <input :style="GLOBAL.inputText" class="input" ref="toastThree" type="number" v-model="goodsStock" @focus="allFocus(2)" @blur="allBlur" placeholder="请输入库存数量" @touchstart="touchstart"/>
                    <text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor}">份</text>
                </div>
            </div>

            <!--协议-->
            <div class="agreement row" @touchstart="touchstart">

                <div class="agreementDiv row">
                    <text class="" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">已阅读并同意</text>
                    <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor,marginLeft:'10px'}">《商家自营销协议》</text>
                </div>

                <div ref="test2" :style="{backgroundColor:backgroundColorTwo}" :class="[startSwitch==false?'close':'open']"
                     style="justify-content: center;padding-left: 1px;"
                     @click="bill">
                    <div ref="test1" :class="[startSwitch==false?'isClose':'isOpen']"></div>
                </div>

            </div>

        </scroller>
        <!--<div class=" classflyButton" v-if="inputFocus">-->

            <!--<wxc-button class="sureButton" text="保存" :textStyle="GLOBAL.buttonText" :btnStyle="GLOBAL.defaultButton"-->
                        <!--@wxcButtonClicked="sureClick()"></wxc-button>-->
        <!--</div>-->

        <!--底部弹层-->
        <wxc-popup popup-color="rgb(248, 248, 248)"
                   :show="isBottomShow"
                   @wxcPopupOverlayClicked="popupOverlayBottomClick"
                   pos="bottom"
                   height="230">
            <div class="demo-content">
                <text class="popupOne" :style="{fontSize:GLOBAL.defaultFS,color:goodsName!=''?GLOBAL.dColor:'#999'}" @click="giveMyShop">赠送本菜品</text>
                <text class="popupTwo" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}" @click="selectGoodsTwo">赠送其他菜品</text>
                <text class="popupThree" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}" @click="bottomClick">取消</text>
            </div>
        </wxc-popup>

        <!--toast提示-->
        <toast ref="toast"></toast>

    </div>
</template>

<script>
    import {WxcMinibar, WxcButton,} from 'weex-ui';
    import { WxcPopup } from 'weex-ui';
    import Toast from './Toast.vue';
    const animation = weex.requireModule('animation');
    const event = weex.requireModule('event');
    const post = weex.requireModule('stream');
    const navigator = weex.requireModule('navigator');
    const dom = weex.requireModule('dom');
    export default {
        components: {WxcMinibar, WxcButton, Toast,WxcPopup},
        data() {
            return {
                // size:{height:0},
                // height2:0,
                visibility:'hidden',
                // 协议
                startSwitch: true,//switch一开始的状态
                backgroundColorTwo:'',//动画背景色
                prevent:true,//阻止多次点击绿色按钮

                //库存
                startSwitchStock: true,//switch一开始的状态
                backgroundColorStock:'',//动画背景色
                preventStock:true,//阻止多次点击绿色按钮
                goodsStock:'',//库存数量

                startTime:'',//开始日期
                endTime:'',//结束日期

                boxHeight:0,//获取高度解决保存按钮弹起问题
                num:0,//用于解决焦点的取消问题

                isBottomShow:false,//弹出层
                isFocus:false,//

                bayNum:'',//购买数量
                giveNum:'',//赠送数量

                bay:false,//判断选择商品返回该页面后是买x赠获取商品信息还是赠送y获取商品信息
                give:false,//判断选择商品返回该页面后是买x赠获取商品信息还是赠送y获取商品信息
                //买x赠商品信息
                buyFood:'',
                //赠送y商品信息
                giveFood:'',
                pageBack:false,
                timeIndex:'',

                token:'',
                imei:'',
                inputFocus:true,
                blurPrevent:false,//阻止多次失去焦点的定时器
                blurPreventSec:false,
                preventRepeatedClicks:false,//阻止重复点击
            }
        },
        created() {
            this.visibility='hidden';
            this.token = weex.config.token;
            this.imei = weex.config.imei;
            var that = this
            var now = new Date();
            var startTime = now.getFullYear() + "-" + ((now.getMonth() + 1) < 10 ? "0" : "") + (now.getMonth() + 1) + "-" + (now.getDate() < 10 ? "0" : "") + now.getDate();
            var endTime = (now.getFullYear() + 1) + "-" + ((now.getMonth() + 1) < 10 ? "0" : "") + (now.getMonth() + 1) + "-" + (now.getDate() < 10 ? "0" : "") + now.getDate();
            var time = startTime;
            that.minDate = time;
            that.startTime = startTime;
            event.init();
            weex.requireModule('globalEvent').addEventListener('chooseTime', function (e) {

                if (that.timeIndex == 1) {
                    that.startTime=e.time
                } else {
                    that.endTime=e.time
                }

            })
        },
        methods: {
            //返回上一页
            minibarLeftButtonClick() {
                navigator.pop({ animated: 'true' });
            },

            inputBuy(e){
                this.bayNum=e.value;
                // modal.toast({
                //     message: e.value,
                //     duration: 0.3
                // })
            },
            inputGive(e){
                this.giveNum=e.value;
                // modal.toast({
                //     message: e.value,
                //     duration: 0.3
                // })
            },
            allFocus(toggle){
                var that=this;
                that.inputFocus=false;
                if(that.blurPrevent){
                    that.blurPreventSec=true;
                }
                else{
                    that.blurPreventSec=false;
                }

                setTimeout(function () {
                    that.blurPrevent = true;
                },80)
                setTimeout(function () {
                    that.blurPreventSec=false;
                },320)
                if(toggle==2){
                    that.$refs.toastThree.setTextFormatter({
                        formatRule: "/(\\.\\d{2})(\\S+)/",
                        formatReplace: "$1",
                        recoverRule: "/\\./g",
                        recoverReplace: ""
                    })
                }

            },
            allBlur(){
                var that=this;
                setTimeout(function () {
                    if(that.blurPreventSec){
                        setTimeout(function () {
                            that.blurPreventSec=false;
                        },40)
                    }
                    else{
                        that.inputFocus=true;
                        that.blurPrevent = false;
                    }
                }, 200)
            },

            //监听选择商品页面返回
            viewdisappear(){
                let self=this;
                self.pageBack = true;
            },
            viewappear(){
                let self=this;
                if(!self.pageBack){ return; }
                self.pageBack = false;

                if(event.find('param')) {
                    var param = event.find('param');//获取商品选择页面保存的数据
                    param = JSON.parse(param);
                    //购买的商品
                    if(this.bay){
                        self.buyFood=param;
                        //删除选择商品页面保存的数据
                        event.delete('param');
                    }
                    //赠送商品
                    if(this.give){
                        self.giveFood=param;
                        //删除选择商品页面保存的数据
                        event.delete('param');
                    }
                }
            },
            touchstart(){

                this.$refs.toastOne.blur();
                this.$refs.toastTwo.blur();
                if(!this.startSwitchStock){
                    this.$refs.toastThree.blur()
                }
            },
            //跳转到商品选择页面
            selectGoods() {
                this.bay=true;
                this.give=false;
                var param = '';
                var url='http://assets/choiceGoods.js';
                event.toUrl({ "url": url, "param": param });
            },
            selectGoodsTwo(){
                this.bay=false;
                this.give=true;
                this.isBottomShow=false;
                var param = '';
                var url='http://assets/choiceGoods.js';
                event.toUrl({ "url": url, "param": param });
            },
            bottomClick(){
                this.isBottomShow=false;
            },
            giveShopClick(){
                if(this.buyFood){
                    this.isBottomShow=true;
                }else{
                    const toast=this.$refs.toast;
                    toast.editContent('请先选择购买商品!');
                }
            },
            giveMyShop(){
                if(this.buyFood){
                    this.giveFood=this.buyFood;
                    // this.TgoodsId=this.goodsId;
                    // this.TgoodsName=this.goodsName;//赠送商品名称
                    // this.TshopPrice=this.shopPrice;
                    // this.TgoodsImg=this.goodsImg;
                    // this.TgoodsStock=this.goodsStock;
                    // this.Tattr=this.attr;
                    // this.TboxFee=this.boxFee;
                    // this.TmarketPrice=this.marketPrice;

                    this.isBottomShow=false;
                }
            },
            popupOverlayBottomClick(){
                this.isBottomShow=false;
            },

            chooseTime( timeIndex) {
                var that = this;
                that.timeIndex = timeIndex;
                event.chooseTime(true, true, true, false, false, false)
            },
            bill: function () {
                if(this.prevent){
                    this.prevent=false;

                    var that = this;
                    if (that.startSwitch) {

                        // 解决兼容star
                        setTimeout(function () {
                            that.backgroundColorTwo='#e2e2e2'
                        },450);
                        // 解决兼容end

                        var testEl = this.$refs.test1;
                        var testE2 = this.$refs.test2;
                        var transform = 'translate(0px, 0px)';
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
                        var testEl = this.$refs.test1;
                        var testE2 = this.$refs.test2;
                        var transform = 'translate(52px, 0px)';
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
            },
            billStock(){
                if(this.preventStock){
                    this.preventStock=false;


                    var that = this
                    if (that.startSwitchStock) {

                        // 解决兼容star
                        setTimeout(function () {
                            that.backgroundColorStock='#e2e2e2'
                        },450)
                        // 解决兼容end

                        var testEl = this.$refs.test1Stock;
                        var testE2 = this.$refs.test2Stock;
                        var transform = 'translate(0px, 0px)';
                        animation.transition(testEl, {
                            styles: {
                                transform: transform,
                            },
                            duration: 500, //ms
                            timingFunction: 'ease',
                            delay: 0 //ms
                        },function () {
                            that.preventStock=true;
                        })
                        animation.transition(testE2, {
                            styles: {
                                backgroundColor: '#e2e2e2',
                            },
                            duration: 500, //ms
                            timingFunction: 'ease',
                            delay: 0 //ms
                        })
                        that.startSwitchStock=false;
                        that.goodsStock='';
                    } else {

                        // 解决兼容star
                        setTimeout(function () {
                            that.backgroundColorStock='#4ed465'
                        },450)
                        //解决兼容end
                        var testEl = this.$refs.test1Stock;
                        var testE2 = this.$refs.test2Stock;
                        var transform = 'translate(52px, 0px)';
                        animation.transition(testEl, {
                            styles: {
                                transform: transform,
                            },
                            duration: 500, //ms
                            timingFunction: 'ease',
                            delay: 0 //ms
                        },function () {
                            that.preventStock=true;
                        })
                        animation.transition(testE2, {
                            styles: {
                                backgroundColor: '#4ed465',
                            },
                            duration: 500, //ms
                            timingFunction: 'ease',
                            delay: 0 //ms
                        },function () {
                            that.backgroundColorStock='#4ed465'
                        })
                        that.startSwitchStock=true;
                        that.goodsStock=-1;
                    }

                }
            },
            sureClick(){
                const toast=this.$refs.toast;

                if(!this.endTime){
                    toast.editContent('未设置结束日期!');
                    return false;
                }
                if(!this.buyFood){
                    toast.editContent('未设置买赠商品!');
                    return false;
                }
                if(!this.giveFood){
                    toast.editContent('未设置赠送商品!');
                    return false;
                }
                if(!this.bayNum||!this.giveNum){
                    toast.editContent('请正确设置买赠数量!');
                    return false;
                }
                if(!this.goodsStock){
                    toast.editContent('请填写库存数量!');
                    return false
                }
                if(!this.startSwitchStock&&this.goodsStock<1){
                    toast.editContent('库存数量需大于0!');
                    return false
                }

                if(!this.startSwitch){
                    toast.editContent('未同意协议!');
                    return false;
                }

                var that = this;
                var postData = {'start_time': that.startTime, 'end_time': that.endTime, 'buy_goods': JSON.stringify(that.buyFood),'goodsStock':that.goodsStock, 'gift_goods': JSON.stringify(that.giveFood), 'buy_num': that.bayNum, 'gift_num': that.giveNum};

                var param = this.GLOBAL.sign(this.token,this.imei);
                param += '&postData=' + JSON.stringify(postData);
                if(this.preventRepeatedClicks){
                    return false
                }
                this.preventRepeatedClicks=true
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: 'https://www.aftdc.com/businessapp/Activity/setFullGift',//买赠
                }, function (e) {
                    if(e.data.res === 1) {
                        toast.editContent(e.data.info);
                        setTimeout(()=>navigator.pop({ animated: 'true' }),2000);
                    } else if(e.data.res === 0) {
                        toast.editContent(e.data.info);
                    } else {
                        toast.editContent('亲，网络君开小差啦!');
                        return false;
                    }
                    that.preventRepeatedClicks=false
                });
            },
        },
        mounted() {
            var that = this;
            that.visibility='visible';
            that.startSwitch=!that.startSwitch
            that.bill();

            that.startSwitchStock=!that.startSwitchStock
            that.billStock()
            that.$refs.toastOne.setTextFormatter({
                formatRule: "/(\\.\\d{2})(\\S+)/",
                formatReplace: "$1",
                recoverRule: "/\\./g",
                recoverReplace: ""
            })
            that.$refs.toastTwo.setTextFormatter({
                formatRule: "/(\\.\\d{2})(\\S+)/",
                formatReplace: "$1",
                recoverRule: "/\\./g",
                recoverReplace: ""
            })

        },
    }
</script>
<style scoped>
    .popupOne{
        width: 750px;
        height: 70px;
        line-height: 70px;
        text-align: center;
        background-color: #fff;
    }
    .popupTwo{
        width: 750px;
        height: 70px;
        line-height: 70px;
        text-align: center;
        margin-top: 2px;
        background-color: #fff;
    }
    .popupThree{
        width: 750px;
        height: 70px;
        line-height: 70px;
        text-align: center;
        margin-top: 18px;
        background-color: #fff;
    }
    .scroller{
        width: 750px;
        flex: 1;
    }
    .daySelect{
        background-color: #fff;
        margin-top: 20px;
        padding-left: 20px;
    }
    .agreement{
        background-color: #fff;
        margin-top: 20px;
        padding-left: 20px;
        padding-right: 20px;
        justify-content: space-between;
        padding-top: 20px;
        padding-bottom: 20px;
    }
    .daySelectTop{
        padding-top: 25px;
        padding-bottom: 25px;
        padding-right: 30px;
        border-bottom-style: solid;
        border-bottom-width: 1px;
        border-bottom-color: #dedede;
    }
    .daySelectBottom{
        padding-top: 25px;
        padding-bottom: 25px;
        padding-right: 30px;
    }
    .betweenDiv {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding-top: 20px;
        padding-left: 20px;
        padding-right: 20px;
        padding-bottom: 20px;
        background-color: #fff;
    }
    .inputDiv {
        flex-direction: row;
        align-items: center;
        flex: 1;
        justify-content: flex-end;
    }
    .input {
        /*margin-left: 100px;*/
        text-align: right;
        flex: 1;
        placeholder-color:'#999';
        margin-right: 10px;
    }
    .starTime{
        margin-right: 20px;
    }
    .starTimeText{
        flex: 1;
    }
    .numInput{
        width: 210px;
        margin-left: 20px;
        margin-right: 20px;
        text-align: center;
    }
    .moreIcon{
        width: 20px;
        height: 20px;
    }

    /*****************/

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
    .wrapper {
        background-color: #f8f8f8;
    }

    .classflyButton {
        flex-direction: row;
        justify-content: space-around;
        background-color: #fff;
        border-top-width: 1px;
        border-top-style: solid;
        border-top-color: #dedede;
        margin-top: 20px;
        padding-top: 20px;
        padding-bottom: 20px;
        padding-left: 30px;
        padding-right: 30px;
    }

    .sureButton:active {
        background-color: #57aba5;
    }
    .sureButton:enabled {
        background-color: #53beb7;
    }
    .row{
        flex-direction: row;
        align-items: center;
    }
</style>

