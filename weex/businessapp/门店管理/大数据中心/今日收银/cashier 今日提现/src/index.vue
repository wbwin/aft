<template>
    <div class="wrapper" @viewappear="viewappear" @viewdisappear="viewdisappear" :style="{visibility: visibility}">
        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="backClick"
                    @wxcMinibarRightButtonClicked="minibarRightButtonClick"
                    v-once>
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">今日提现</text>
                <text :style="GLOBAL.headerRight"  slot="right"></text>
            </wxc-minibar>
        </div>
        <div class="list">
            <div class="withdrawal">
                <div>
                    <text :style="{fontSize:GLOBAL.bigFS,color:'#fff'}">可提现余额</text>
                    <text class="money" :style="{fontSize:GLOBAL.biggerFS,color:'#fff'}">￥{{canDraw?canDraw:0}}</text>
                </div>
                <div>
                    <text class="remain" :style="{fontSize:GLOBAL.bigFS,color:'#fff'}" @click="goToWithdraw">提现</text>
                </div>
            </div>
            <div class="view" style="flex-direction: row;background-color: #53beb7;align-items: center;padding-top: 35px;padding-bottom: 35px;justify-content: space-between" @click="goToWithdrawInfo">
                <text :style="{fontSize:GLOBAL.bigFS,color:'#fff'}">查看提现记录</text>
                <wxc-icon name="more" style="color: #ffffff;font-size: 35px"></wxc-icon>
            </div>
            <div class="expect" @click="goToDiscountActive">
                <div style="flex-direction: row;align-items: center">
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">今日预计收入</text>
                    <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor,marginLeft:'5px'}">({{today}})</text>
                </div>
                <div style="flex-direction: row;align-items: center;justify-items: center">
                    <div>
                        <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor}">￥{{sum}}</text>
                    </div>
                    <div>
                        <wxc-icon name="more" style="color: #53bdb6;fontSize: 30px"></wxc-icon>
                    </div>
                </div>
            </div>
            <list>
                <cell class="cell">

                    <!--<div class="order">-->
                    <!--<text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">扫码订单</text>-->
                    <!--<div class="unit">-->
                    <!--<text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}" style="margin-right: 45px;">共{{sm}}笔</text>-->
                    <!--<text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">￥{{sm_sum}}</text>-->
                    <!--</div>-->
                    <!--</div>-->
                    <!--<div style="height: 12px;background-color: #f1f1f1;border-radius: 5px"></div>-->

                    <div class="order">
                        <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">订座订单</text>
                        <div class="unit">
                            <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}" style="margin-right: 45px;">共{{dz}}笔</text>
                            <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">￥{{dz_sum}}</text>
                        </div>
                    </div>
                    <div style="height: 12px;background-color: #f1f1f1;border-radius: 5px"></div>

                    <div class="order">
                        <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">自取订单</text>
                        <div class="unit">
                            <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}" style="margin-right: 45px;">共{{zq}}笔</text>
                            <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">￥{{zq_sum}}</text>
                        </div>
                    </div>
                    <div style="height: 12px;background-color: #f1f1f1;border-radius: 5px"></div>

                    <div class="order">
                        <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">团购订单</text>
                        <div class="unit">
                            <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}" style="margin-right: 45px;">共{{tk}}笔</text>
                            <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">￥{{tk_sum}}</text>
                        </div>
                    </div>

                    <div style="height: 12px;background-color: #f1f1f1;border-radius: 5px"></div>

                    <div class="order">
                        <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">代金券订单</text>
                        <div class="unit">
                            <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}" style="margin-right: 45px;">共{{djq}}笔</text>
                            <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">￥{{djq_sum}}</text>
                        </div>
                    </div>

                    <div style="height: 12px;background-color: #f1f1f1;border-radius: 5px"></div>

                    <div class="order">
                        <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">外卖订单</text>
                        <div class="unit">
                            <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}" style="margin-right: 45px">共{{wm}}笔</text>
                            <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">￥{{wm_sum}}</text>
                        </div>
                    </div>
                    <div style="height: 12px;background-color: #f1f1f1;border-radius: 5px"></div>

                    <!--<div class="order">-->
                    <!--<text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">充值订单</text>-->
                    <!--<div class="unit">-->
                    <!--<text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}" style="margin-right: 45px">共{{recharge}}笔</text>-->
                    <!--<text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">￥{{recharge_sum}}</text>-->
                    <!--</div>-->
                    <!--</div>-->
                    <div class="order">
                        <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">退款订单</text>
                        <div class="unit">
                            <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}" style="margin-right: 45px">共{{refund}}笔</text>
                            <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">￥{{refund_sum}}</text>
                        </div>
                    </div>
                    <div style="height: 12px;background-color: #f1f1f1;border-radius: 5px"></div>

                </cell>
                <!--<cell>-->
                <!--<div style="flex-direction: row;justify-content: center;margin-top: 40px;align-items: center;margin-bottom: 40px;">-->
                <!--<div>-->
                <!--<text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}"  @click="goToHelp">帮助中心</text>-->
                <!--</div>-->
                <!--<div>-->
                <!--<wxc-icon name="more" :icon-style="icon"></wxc-icon>-->
                <!--</div>-->
                <!--</div>-->
                <!--</cell>-->
            </list>
        </div>
    </div>
</template>

<script>
    import {WxcIcon,WxcMinibar} from 'weex-ui'

    const navigator = weex.requireModule('navigator');
    const event = weex.requireModule('event');
    const post = weex.requireModule('stream');
    const modal = weex.requireModule('modal');
    export default {
        components: {WxcIcon,WxcMinibar},
        name: 'App',
        data() {
            return {
                today:'',//今天的日期
                backImgToggle: 0,//头部返回图片判断
                icon: {
                    fontSize: '30px',
                    color: '#333'
                },
                wm:0,
                tk:0,
                sm:0,
                dz:0,
                zq:0,
                djq:0,
                wm_sum:0,
                tk_sum:0,
                sm_sum:0,
                dz_sum:0,
                zq_sum:0,
                djq_sum:0,
                canDraw:0,
                sum:0,
                refund:0,
                recharge:0,
                refund_sum:0,
                recharge_sum:0,
                token:'',
                imei:'',
                visibility:'hidden',
                pageBack:false,
            }
        },
        created: function () {
            this.visibility='hidden';
            this.token = weex.config.token;
            this.imei = weex.config.imei;
            var that = this;
            that.createdClick();
            // 获取今天的日期
            var myDate = new Date();
            this.today=myDate.getFullYear()+'-'+((myDate.getMonth()+1)<10?'0'+(myDate.getMonth()+1):(myDate.getMonth()+1))+'-'+(myDate.getDate()<10?'0'+myDate.getDate():myDate.getDate());
        },
        mounted(){
            var that=this
            that.visibility='visible';
        },
        methods: {
            createdClick(){
                var that = this;

                //获取token和sign
                var param = this.GLOBAL.sign(this.token,this.imei);

                param+= '&page=0';
                param+= '&jsonStr='+ JSON.stringify(that.jsonStr);
                /*获取上传的图片对象*/
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    url: 'https://www.aftdc.com/businessapp/Finance/orders_count',
                }, function (e) {
                    if (e.data.res === -2) {
                        //跳到登陆页面
                        that.GLOBAL.toLogin()
                    }
                    else {
                        if(e.data.res)
                        {
                            that.wm=e.data.wm;
                            that.tk=e.data.tk;
                            that.sm=e.data.sm;
                            that.dz=e.data.dz;
                            that.zq=e.data.zq;
                            that.djq=e.data.djq;
                            that.wm_sum=e.data.wm_sum;
                            that.tk_sum=e.data.tk_sum;
                            that.sm_sum=e.data.sm_sum;
                            that.dz_sum=e.data.dz_sum;
                            that.zq_sum=e.data.zq_sum;
                            that.djq_sum=e.data.djq_sum;
                            that.canDraw=e.data.canDraw;
                            that.sum=e.data.sum;
                            that.refund=e.data.refund;
                            that.recharge=e.data.recharge;
                            that.refund_sum=e.data.refund_sum;
                            that.recharge_sum=e.data.recharge_sum;
                        }
                        else
                        {
                            if (e.data.info) {
                                modal.toast({
                                    message: e.data.info,
                                });
                            }
                            return false
                        }
                    }
                })
            },
            minibarRightButtonClick(){

            },
            //返回上一页
            backClick: function () {
                navigator.pop({ animated: 'true' });
            },
            //跳转到提现页面
            goToWithdraw:function () {
                var param = '';
                var url='http://assets/withdraw.js';
                event.toUrl({ "url": url, "param": param });
            },
            //跳转到帮助中心页面
            goToHelp:function () {
                var param = '';
                var url='http://assets/help.js';
                event.toUrl({ "url": url, "param": param });
            },
            //跳转到今日收入界面
            goToDiscountActive: function() {
                var param = '';
                var url='http://assets/income.js';
                event.toUrl({ "url": url, "param": param });
            },
            //跳转到提现纪录页面
            goToWithdrawInfo:function() {
                var param = '';
                var url='http://assets/withdrawInfo.js';
                event.toUrl({ "url": url, "param": param });
            },
            //监听扫码后页面返回
            viewdisappear(){
                let self=this;
                self.pageBack = true;
            },
            viewappear(){
                let self=this;
                if(!self.pageBack){ return; }
                self.pageBack = false;
                //获取消息通知
                self.createdClick();

            },
        },

    }
</script>

<style scoped>
    .wrapper {
        background-color: #f8f8f8;
    }

    /*****************/
    .list {
        position: absolute;
        top: 89px;
        left: 0;
        right: 0;
        bottom: 0;
    }
    .withdrawal {
        flex-direction: row;
        justify-content: space-between;
        background-color: #53beb7;
        padding-left: 30px;
        padding-right: 30px;
        padding-top: 40px;
        padding-bottom: 40px;
        border-bottom-color: #ffffff;
        border-bottom-style: solid;
        border-bottom-width: 2px;
    }
    .money {
        margin-top: 40px;
    }

    .remain {
        padding-top: 10px;
        padding-bottom: 10px;
        padding-left: 20px;
        padding-right: 20px;
        border-color: #ffffff;
        border-style: solid;
        border-width: 2px;
        border-radius: 6px;
    }

    .view {
        padding-left: 20px;
        padding-right: 20px;
        padding-top: 30px;
        padding-bottom: 30px;
        justify-content: space-between;
    }

    .expect {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-top: 20px;
        background-color: #ffffff;
        padding-left: 20px;
        padding-right: 20px;
        padding-top: 35px;
        padding-bottom: 35px;
        border-bottom-style: solid;
        border-bottom-color: #dedede;
        border-bottom-width: 2px;
    }

    .order {
        padding-left: 20px;
        padding-top: 35px;
        padding-bottom: 22px;
        /*background-color: #ffffff;*/
        /*border-bottom-color: #f1f1f1;*/
        /*border-bottom-style: solid;*/
        /*border-bottom-width: 12px;*/
        flex-direction: row;
        justify-content: space-between
    }
    .cell{
        padding-left: 30px;
        padding-right: 30px;
        padding-bottom: 40px;
        background-color: #fff;
    }

    .unit {
        flex-direction: row;
        width: 220px;
        justify-content: space-between;
    }
</style>
