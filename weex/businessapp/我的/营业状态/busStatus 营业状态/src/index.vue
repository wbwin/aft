<template>
    <div class="wrapper" @viewappear="viewappear" @viewdisappear="viewdisappear">

        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    v-once
            >
                <image :style="GLOBAL.headerImg"  slot="left" @click="backClick"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">营业状态</text>
            </wxc-minibar>
        </div>

        <div class="shopMessage">
            <div class="message_top">
                <div class="shopStateDetail">
                    <image class="shopImg" :src="shopImg"></image>
                    <text class="shopStateText">{{shopAtive === 0 ? '停止营业' : shopAtive === 1 ? '营业中' : '休息中'}}</text>
                </div>
                <text class="updataHours" @click="goToBusTime" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">修改营业时间</text>
            </div>
            <div class="businessHoursDiv">
                <text class="businessHours" :style="{fontSize:GLOBAL.defaultFS}">营业时间:</text>
                <text class="businessHours" :style="{fontSize:GLOBAL.defaultFS}" v-for="(item,index) in serviceTime">{{item.serviceStartTime}}-{{item.serviceEndTime}}{{index!=serviceTime.length-1?' ':''}}</text>
            </div>
            <text class="businessTips" v-if="shopAtive === 1" :style="{fontSize:GLOBAL.defaultFS}">当前餐厅处于设置的营业时间内，正常接收新订单</text>
            <text class="businessTips" v-else-if="shopAtive === 0" :style="{fontSize:GLOBAL.defaultFS}">当前餐厅处于停止营业状态，无法接收新订单</text>
            <text class="businessTips" v-else  :style="{fontSize:GLOBAL.defaultFS}">当前餐厅处于休息中，无法接收新订单</text>
        </div>
        <div class="businessHoursButton">

            <!--取消按钮-->
            <div class=" enterButton">

                <wxc-button class="okButton" text="取消" :textStyle="GLOBAL.cancelButtonText" :btnStyle="GLOBAL.cancelButton"
                            @wxcButtonClicked="minibarLeftButtonClick"></wxc-button>
            </div>

            <!--<wxc-button text="取消" class="cancelButton" :btnStyle="cancelBtnStyle" :textStyle="textStyle"-->
            <!--@wxcButtonClicked="backClick"></wxc-button>-->


            <!--修改营业状态按钮-->
            <div class=" enterButton">
                <wxc-button :text="shopAtive === 1 ? '停止营业' : shopAtive === 0 ? '恢复营业' : '休息中'" class="stopButton" :btnStyle="stopBtnStyle" :textStyle="textStyle"
                            @wxcButtonClicked="upStatus"></wxc-button>
            </div>





            <text class="buttonTipsText" :style="{fontSize:GLOBAL.defaultFS}">当您希望长时间不再接收订单时，请点击上方按钮停止营业，开启后需手动恢复</text>
        </div>
        <toast ref="toast"></toast>
    </div>
</template>

<script>
    import {WxcMinibar,WxcButton} from 'weex-ui';
    import Toast from './Toast.vue';
    const animation = weex.requireModule('animation');
    const modal = weex.requireModule('modal');
    const event = weex.requireModule('event');
    const navigator = weex.requireModule('navigator');
    const post = weex.requireModule('stream');

    export default {
        components: {WxcMinibar,WxcButton,Toast},
        data() {
            return {
                cancelBtnStyle:{
                    backgroundColor: '#fff',
                    width: '650',
                    borderColor: '#a1a1a1',
                    borderWidth: '2px',
                    borderStyle: 'solid'
                },
                stopBtnStyle:{
                    backgroundColor: '#FFEFDB',
                    width: '600',
                    borderColor: '#f00',
                    borderWidth: '1px',
                    borderStyle: 'solid'
                },
                textStyle:{
                    color: '#666',
                    fontSize:'26px'
                },
                shopAtive:'',
                serviceStartTime:'',
                serviceEndTime:'',
                serviceTime:[],
                shopImg:'',
                pageBack: false,
                token:'',
                imei:''
            }
        },
        created() {
            var that=this
            this.token = weex.config.token;
            this.imei = weex.config.imei;
            that.getStoreInformation()

        },
        methods: {
            getStoreInformation(){

                var param = this.GLOBAL.sign(this.token,this.imei);
                var that = this;
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: 'https://www.aftdc.com/businessapp/Store/getStoreInformation',
                }, function (e) {
                    if (e.data.res === -2) {
                        that.toLogin();
                    } else if (e.data.res ===1){
                        that.shopAtive = e.data.data.shopAtive;
                        that.serviceTime = e.data.data.serviceTime;
                        // that.serviceStartTime = e.data.data.serviceStartTime;
                        // that.serviceEndTime = e.data.data.serviceEndTime;
                        that.shopImg = e.data.data.shopImg;
                    } else {
                        const toast=that.$refs.toast
                        toast.editContent('网络出错了');
                    }
                });
            },
            //返回上一页
            minibarLeftButtonClick(){
                var param = {'shopAtive':that.shopAtive,'serviceTime':this.serviceTime};
                event.save('timeParam',JSON.stringify(param));
                navigator.pop({ animated: 'true' });
            },
            //修改营业状态
            upStatus:function () {
                var param = this.GLOBAL.sign(this.token,this.imei);
                if (event.find('timeParam')) {
                    event.delete('timeParam');
                }
                var that = this;
                var shopAtive = that.shopAtive;
                if (shopAtive === 2) {
                    const toast=that.$refs.toast
                    toast.editContent('当前处于休息中，如需更改请修改营业时间...');
                    return false;
                } else if (shopAtive === 1) {
                    shopAtive = 0;
                } else if (shopAtive === 0){
                    shopAtive = 1;
                } else {
                    const toast=that.$refs.toast
                    toast.editContent('出错啦。。。');
                    return false;
                }
                param += '&shopAtive=' + shopAtive;
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: 'https://www.aftdc.com/businessapp/Index/shopAtive',
                }, function (e) {
                    if (e.data.res === -2) {
                        that.toLogin();
                    } else if (e.data.res ===1){
                        const toast=that.$refs.toast
                        toast.editContent('修改成功！');
                        var param = {'shopAtive':that.shopAtive,'serviceTime':that.serviceTime};
                        event.save('statusParam',JSON.stringify(param));
                        navigator.pop({ animated: 'true' });
                    } else {
                        const toast=that.$refs.toast
                        toast.editContent('网络出错了');
                    }
                });
            },
            //登录
            toLogin(){
                event.delete("businessToken");
                event.delete("shopId");
                event.delete("shopName");
                const toast=that.$refs.toast
                toast.editContent('退出成功');
                var url='http://assets/login.js';
                var param='';
                event.toUrl({url:url,param:param});
                navigator.pop({ animated: 'false' });
            },
            //跳转到修改营业时间页面
            goToBusTime:function () {
                var that = this;
                var param = {'serviceTime':this.serviceTime};
                var url='http://assets/busTime.js';
                event.toUrl({ "url": url, "param": JSON.stringify(param) });
            },
            //监听页面返回
            viewdisappear(){
                let self=this;
                self.pageBack = true;
            },
            viewappear(){
                let self=this;
                if(!self.pageBack){ return; }
                self.pageBack = false;

                if (event.find('timeParam')) {
                    var timeParam = JSON.parse(event.find('timeParam'));
                    self.serviceTime = timeParam.serviceTime;

                }
                if(self.shopAtive!=0){
                    var serviceTime=self.serviceTime
                    var date = new Date();
                    var hours = date.getHours()
                    if(hours<10){
                        hours='0'+hours
                    }

                    var minutes=date.getMinutes()
                    if(minutes<10){
                        minutes='0'+minutes
                    }
                    var now=hours+':'+minutes
                    for(var i in serviceTime){
                        if(now > serviceTime[i].serviceStartTime && now < serviceTime[i].serviceEndTime){
                            self.shopAtive = 1
                            break;
                        }else{
                            self.shopAtive = 2
                        }
                    }
                }

            },
        }
    }
</script>

<style scoped>
    .enterButton {
        flex-direction: row;
        justify-content: space-around;
        /*position: fixed;*/
        /*left: 0;            存在时固定在底部*/
        /*bottom: 0;*/
        /*right: 0;*/
        padding-left: 30px;
        padding-right: 30px;
    }

    .okButton:active {
        background-color: #f1f1f1;
    }
    .okButton:enabled {
        background-color: #fff;
    }
    .wrapper {
        background-color: #f8f8f8;
    }

    .shopMessage{
        flex-direction: column;
        margin-top: 20px;
        background-color: #fff;
        padding-left: 30px;
        padding-right: 30px;
    }
    .message_top{
        flex-direction: row;
        padding-top: 30px;
        padding-bottom: 15px;
    }
    .shopStateDetail{
        flex-direction: row;
        align-items: center;
        flex: 1;
    }
    .shopImg{
        width: 150px;
        height: 150px;
    }
    .shopStateText{
        font-size: 60px;
        color: #999;
        margin-left: 30px;
        font-weight: 600;
    }
    .updataHours{
        font-weight: bold;
        opacity: 1;
    }
    .updataHours:active{
        opacity: 0.7;
    }
    .businessHoursDiv{
        flex-direction: row;
        align-items: center;
        padding-top: 15px;
        padding-bottom: 15px;
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #dedede;
    }
    .businessHours{
        color: #999;
        font-weight: 600;
    }
    .businessTips{
        color: #999;
        padding-top: 15px;
        padding-bottom: 15px;
        font-weight: 600;
    }
    .businessHoursButton{
        padding-left: 50px;
        padding-right: 50px;
    }
    .okButton{
        margin-top: 30px;
    }
    .stopButton{
        margin-top: 30px;
    }
    .stopButton:active{
        background-color: #FFE4B2;
    }
    .stopButton:enabled{
        background-color: #FFEFDB;
    }
    .buttonTipsText{
        color: #999;
        font-weight: 600;
        margin-top: 30px;
        width: 650px;
    }
</style>
