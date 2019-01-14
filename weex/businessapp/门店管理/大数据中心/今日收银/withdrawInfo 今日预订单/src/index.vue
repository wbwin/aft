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
                <text :style="GLOBAL.headerCenter"  slot="middle">提现记录</text>
                <text :style="GLOBAL.headerRight"  slot="right"></text>
            </wxc-minibar>
        </div>
        <div class="list">
            <div style="align-items: center;padding: 20px;background-color: #ffffff">
                <text :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.tColor}" @click="chooseTime">{{createTime === '' ? '选择时间查询指定日期的记录' : createTime}}</text>
            </div>
            <!--<div style="flex-direction: row;background-color: #ffffff;padding: 20px;margin-top: 5px;margin-bottom: 5px;">-->
            <!--<text class="title" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">时间</text>-->
            <!--<text class="title" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">金额</text>-->
            <!--<text class="title" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">状态</text>-->
            <!--</div>-->
            <scroller class="scroller_content">
                <div class="row forwardDivBig" style="background-color: #ffffff" v-if="allCashDraws.length > 0" v-for="(item,index) in allCashDraws" :key="index">

                    <div class="forwardDiv row">
                        <div class="forwardTop">
                            <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">余额提现</text>
                            <text :style="{fontSize:GLOBAL.smallFS,color:'#999',marginTop:'10px'}">{{item.createTime}} {{item.content}}</text>
                        </div>
                        <div class="forwardBottom">
                            <text :style="{fontSize:GLOBAL.defaultFS,color:'red',textAlign:'right'}">{{item.amount}}</text>
                            <!--<text :style="{fontSize:GLOBAL.smallFS,color:'#999',marginTop:'10px',textAlign:'right'}">余额</text>-->
                        </div>
                    </div>
                    <image class="moreIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                    <!--<text :style="{color:GLOBAL.dColor}" :class="[createTime === '' ? 'titleLeft' : 'fontsize']">{{item.createTime}}</text>-->
                    <!--<text class="titleMiddle" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">{{item.amount}}</text>-->
                    <!--<text class="titleRight" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">{{item.content}}</text>-->
                </div>
                <div style="align-items: center;justify-content: center;flex:1;background-color: #ffffff" v-if="allCashDraws.length === 0">
                    <image style="width: 150px;height: 150px;" src="https://image.aftdc.com/appBimg/icon_no_order.png"></image>
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">当日暂无提现纪录</text>
                </div>
            </scroller>
        </div>
    </div>
</template>

<script>
    import { WxcMinibar } from 'weex-ui';
    const navigator = weex.requireModule('navigator');
    const event = weex.requireModule('event');
    const post = weex.requireModule('stream');
    const modal = weex.requireModule('modal');

    export default {
        data() {
            return {
                backImgToggle: 0,//头部返回图片判断
                createTime:'',
                allCashDraws:[],
                token:'',
                imei:''
            }
        },
        components: { WxcMinibar },
        created: function() {
            event.init();
            this.token = weex.config.token;
            this.imei = weex.config.imei;
            var that = this;

            that.getData(that.createTime);
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
                var param = this.GLOBAL.sign(this.token,this.imei);
                param += '&createTime=' + createTime;

                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    url: 'https://www.aftdc.com/businessapp/Ordersa/getCashDraws'
                }, function (e) {
                    if (e.data.res === -2) {
                        //跳到登陆页面
                        that.GLOBAL.toLogin()
                    } else {
                        if(e.data.res === 1){
                            that.allCashDraws = [];
                            that.allCashDraws = e.data.data;
                        } else{
                            if (e.data.allCashDraws.length === 0) {
                                modal.toast({
                                    message: '亲，当日没有提现记录哦'
                                });
                                that.allCashDraws = [];
                                return false
                            } else {
                                modal.toast({
                                    message: '亲，网络君开小差了'
                                });
                                that.allCashDraws = [];
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
    .row{
        flex-direction: row;
        align-items: center;
    }
    .wrapper {
        flex-direction: column;
        background-color: #f8f8f8;
        position: relative;
    }
    .scroller_content {
        position: relative;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }

    .list {
        position: absolute;
        top: 89px;
        left: 0;
        right: 0;
        bottom: 0;
    }
    .forwardDiv{
        padding-left: 25px;
        padding-right: 5px;
        padding-top: 20px;
        padding-bottom: 20px;
        width: 720px;
    }
    .forwardDivBig{
        border-bottom-style: solid;
        border-bottom-width: 2px;
        border-bottom-color: #dedede;
    }
    .forwardTop{
        /*justify-content: space-between;*/
        /*width: 670px;*/
        flex: 1;
    }
    .forwardBottom{
        /*justify-content: space-between;*/
        /*width: 670px;*/
        /*margin-top: 10px;*/
        flex: 1;
    }
    .moreIcon{
        width: 20px;
        height: 20px;
    }
    /***********************/
    .title {
        font-size: 35px;
        color: #333;
        flex: 1;
        text-align: center;
    }
    .fontsize {
        font-size: 35px;
        color: #333;
        flex: 1;
        text-align: center;
        padding-bottom: 20px;
        border-width: 1px;
        height: 80px;
        line-height: 80px;
    }
    .titleLeft {
        font-size: 26px;
        color: #333;
        flex: 1;
        text-align: center;
        padding-bottom: 20px;
        border-width: 1px;
        height: 80px;
        line-height: 80px;

    }
    .titleMiddle {
        flex: 1;
        text-align: center;
        padding-bottom: 20px;
        border-width: 1px;
        height: 80px;
        line-height: 80px;
    }
    .titleRight {
        flex: 1;
        text-align: center;
        padding-bottom: 20px;
        border-width: 1px;
        height: 80px;
        line-height: 80px;
    }
</style>
