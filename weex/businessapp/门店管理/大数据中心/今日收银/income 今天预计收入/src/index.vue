<template>
    <div class="wrapper">
        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="backClick"
                    @wxcMinibarRightButtonClicked="minibarRightButtonClick"
                    v-once>
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">今日预计收入</text>
                <text :style="GLOBAL.headerRight"  slot="right"></text>
            </wxc-minibar>
        </div>
        <div class="list">
            <div>
                <div style="align-items: center;padding: 20px;background-color: #ffffff">
                    <text style="font-size: 28px;color: #53beb7" @click="chooseTime">{{createTime}}</text>
                </div>
                <div style="flex-direction: row;background-color: #ffffff;margin-top: 5px;padding-top: 20px;padding-bottom: 20px;">
                    <text class="title" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">订单号</text>
                    <text class="title" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">交易类型</text>
                    <text class="title" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">金额</text>
                </div>
            </div>
            <scroller class="scroller_content">
                <div class="row orderListBig" :class="[index==0?'orderList':'',index%2==0?'orderListTwo':'']" v-if="allOrders.length > 0" v-for="(item, index) in allOrders" :key="index">
                    <text class="titleLeft" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.orderNo}}</text>
                    <text class="titleMiddle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.content}}</text>
                    <text class="titleRight" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">￥{{item.realTotalMoney}}</text>
                </div>
                <div class="noIncome"  v-if="allOrders.length === 0">
                    <image style="width: 150px;height: 150px;" src="https://image.aftdc.com/appBimg/icon_no_order.png"></image>
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">当日无收入</text>
                </div>
            </scroller>
        </div>
        <toast ref="toast"></toast>
    </div>
</template>

<script>
    import Toast from './Toast.vue';
    import { WxcMinibar } from 'weex-ui';
    const navigator = weex.requireModule('navigator');
    const event = weex.requireModule('event');
    const post = weex.requireModule('stream');
    const modal = weex.requireModule('modal');

    export default {
        data() {
            return {
                backImgToggle: 0,//头部返回图片判断
                createTime: '',
                allOrders: [],
                token:'',
                imei:'',
            }
        },
        components: { WxcMinibar,Toast },
        created: function() {
            event.init();
            this.token = weex.config.token;
            this.imei = weex.config.imei;
            var that = this;
            //获取当前时间
            var date = new Date();
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            if (month < 10) {
                month = "0" + month;
            }
            if (day < 10) {
                day = "0" + day;
            }
            var nowDate = year + "-" + month + "-" + day;
            that.createTime = nowDate;
            console.log(that.createTime)
            that.getData(nowDate);

            //获取选择的时间
            weex.requireModule('globalEvent').addEventListener("chooseTime", function (e) {
                that.createTime = e.time;
                that.getData(e.time);
            });
        },
        methods: {
            minibarRightButtonClick(){

            },
            //返回上一页
            backClick:function() {
                navigator.pop({ animated: 'true' });
            },
            //选择时间
            chooseTime(){
                event.chooseTime(true, true, true, false, false, false);
            },
            //获取数据
            getData:function (createTime) {
                var that = this;
                //获取token和sign
                const toast=that.$refs.toast
                var param = this.GLOBAL.sign(this.token,this.imei);
                param += '&createTime=' + createTime;
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    url: 'https://www.aftdc.com/businessapp/Ordersa/getDateOrders'
                }, function (e) {
                    if (e.data.res === -2) {
                        //跳到登陆页面
                        that.GLOBAL.toLogin()
                    } else {
                        if(e.data.res === 1){
                            that.allOrders = [];
                            that.allOrders = e.data.allOrders;
                        } else {
                            if (e.data.allOrders.length === 0) {

                                toast.editContent('亲，当日没有收入哦');
                                that.allOrders = [];
                                return false
                            } else {
                                toast.editContent('亲，网络君开小差了');
                                that.allOrders = [];
                                return false
                            }
                        }
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .noMore{
        width: 750px;
        background-color: #fff;
        padding-top: 20px;
        padding-bottom: 20px;
        text-align: center;
        color: #999;
    }
    .wrapper {
        flex-direction: column;
        background-color: #f8f8f8;
        position: relative;
    }


    .scroller_content {
        position: relative;
        width: 750px;
        flex: 1;
    }
    .orderList{
        border-top-style: solid;
        border-top-width: 2px;
        border-top-color: #dedede;
    }
    .orderListBig{
        border-bottom-style: solid;
        border-bottom-width: 2px;
        border-bottom-color: #dedede;
        background-color: #fff;
    }
    .orderListTwo{
        background-color: #f8f8f8;
    }
    .row{
        flex-direction: row;
        align-items: center;
    }
    .list {
        position: absolute;
        top: 89px;
        left: 0;
        right: 0;
        bottom: 0;
    }

    /***********************/
    .title {
        flex: 1;
        text-align: center;
    }
    .titleLeft {
        flex: 1;
        text-align: center;
        padding-bottom: 20px;
        border-right-style: solid;
        border-right-width: 2px;
        border-right-color: #dedede;
        height: 80px;
        line-height: 80px;

    }
    .titleMiddle {
        flex: 1;
        text-align: center;
        padding-bottom: 20px;
        border-right-style: solid;
        border-right-width: 2px;
        border-right-color: #dedede;
        height: 80px;
        line-height: 80px;
    }
    .titleRight {
        flex: 1;
        text-align: center;
        padding-bottom: 20px;
        height: 80px;
        line-height: 80px;
    }
    .noIncome{
        align-items: center;
        justify-content: center;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background-color: #fff;

    }
</style>
