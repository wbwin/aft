<template>
    <div class="businessHours">

        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    v-once
            >
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">修改营业时间</text>
            </wxc-minibar>
        </div>

        <text class="title" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">请设置营业时间段</text>
        <div class="content">
            <div class="time" v-for="(item,index) in serviceTime" :key="index">
                <div class="delIconDiv"></div>
                <text class="number" @click="chooseTime(index,1)" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">{{item.serviceStartTime!=''?item.serviceStartTime:'开始时间'}}</text>
                <text class="line" :style="{color:GLOBAL.dColor}"></text>
                <text class="number" @click="chooseTime(index,0)" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">{{item.serviceEndTime!=''?item.serviceEndTime:'结束时间'}}</text>
                <div class="delIconDiv">
                    <image class="delIcon" src="https://image.aftdc.com/appBimg/ic_delete.png" @click="delTimeClick(index)" v-if="index>0"></image>
                </div>
            </div>
            <text class="addTime" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}" v-if="serviceTime.length<3" @click="addTimeClick">添加营业时间</text>
            <text class="ruler" :style="{fontSize:GLOBAL.bigFS}">营业时间的配置需在配送的营业时间之内</text>
            <div class="businessHoursDiv">
                <text class="distributionTime" :style="{fontSize:GLOBAL.bigFS}">配送时间: </text>
                <text class="distributionTime" :style="{fontSize:GLOBAL.defaultFS}" v-for="(item,index) in serviceTime">{{item.serviceStartTime}}-{{item.serviceEndTime}}{{index!=serviceTime.length-1?' ':''}}</text>
            </div>
        </div>

        <!--确定按钮-->
        <div class=" enterButton" style="padding-top: 20px;">

            <wxc-button class="okButton" text="确定" :textStyle="GLOBAL.buttonText" :btnStyle="GLOBAL.defaultButton"
                        @wxcButtonClicked="toEnterMessage"></wxc-button>
        </div>

        <!--返回按钮-->
        <div class=" enterButton">

            <wxc-button class="okButtonTwo" text="返回" :textStyle="GLOBAL.cancelButtonText" :btnStyle="GLOBAL.cancelButton"
                        @wxcButtonClicked="toEnterMessageTwo"></wxc-button>
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
    const post = weex.requireModule('stream');
    const navigator = weex.requireModule('navigator');
    export default {
        components: {WxcMinibar,WxcButton,Toast},
        name: 'App',
        data() {
            return {
                // serviceStartTime: '',//开始时间
                // serviceEndTime: '',//结束时间
                serviceStartTimes:'',
                serviceEndTimes:'',
                timeIndexLeft:'',
                timeIndexRight:'',
                confirmBtnStyle:{
                    backgroundColor: '#53beb7',
                    width: '690',
                    borderColor: '#57aba5',
                    borderWidth: '2px',
                    borderStyle: 'solid'
                },
                backBtnStyle:{
                    backgroundColor: '#fff',
                    width: '690',
                    borderColor: '#a1a1a1',
                    borderWidth: '2px',
                    borderStyle: 'solid'
                },
                confirmTextStyle:{
                    color: '#fff',
                    fontWeight:'bold',
                },
                backTextStyle:{
                    color: '#666',
                    fontWeight:'bold',
                },
                serviceTime:[
                    {serviceStartTime:'',serviceEndTime:''},
                ],
                token:'',
                imei:'',
                timeListIndex:'',
                timeIndex:'',
            }
        },
        created(){
            this.token = weex.config.token;
            this.imei = weex.config.imei;
            event.init();
            var that=this;
            that.serviceTime = JSON.parse(weex.config.param).serviceTime;
            weex.requireModule('globalEvent').addEventListener("chooseTime", function (e) {
                if(that.timeIndex==1){
                    const toast=that.$refs.toast;
                    var start=e.time;

                    for(var i in that.serviceTime){
                        if(i<that.timeListIndex){
                            if(start<=that.serviceTime[i].serviceStartTime||start<=that.serviceTime[i].serviceEndTime){
                                toast.editContent('当前设置时间与其他时间冲突')
                                return false;
                            }
                        }
                        if(i==that.timeListIndex){
                            if(that.serviceTime[i].serviceEndTime&&start>=that.serviceTime[i].serviceEndTime){
                                toast.editContent('开始时间需要小于结束时间')
                                return false;
                            }
                        }
                    }
                    that.$set(that.serviceTime[that.timeListIndex],'serviceStartTime',e.time)

                }else if(that.timeIndex==0){
                    const toast=that.$refs.toast;
                    var end=e.time
                    for(var i in that.serviceTime){
                        if(i==that.timeListIndex){
                            if(that.serviceTime[i].serviceStartTime&&end<=that.serviceTime[i].serviceStartTime){
                                toast.editContent('结束时间需要大于开始时间')
                                return false;
                            }
                        }
                        if(i>that.timeListIndex){
                            if((that.serviceTime[i].serviceStartTime&&end>=that.serviceTime[i].serviceStartTime)||(that.serviceTime[i].serviceEndTime&&end>=that.serviceTime[i].serviceEndTime)){
                                toast.editContent('当前设置时间与其他时间冲突')
                                return false;
                            }
                        }
                    }
                    that.$set(that.serviceTime[that.timeListIndex],'serviceEndTime',e.time)

                }

            });
        },
        methods:{
            chooseTime(index,timeIndex){
                var that=this
                const toast=that.$refs.toast;
                this.timeIndex = timeIndex;
                this.timeListIndex=index;
                for(var i in that.serviceTime) {
                    if (timeIndex == 1 && i < index) {
                        if (!that.serviceTime[i].serviceStartTime || !that.serviceTime[i].serviceStartTime) {
                            toast.editContent('请先设置上一个时间段')
                            return false;
                        }
                    }
                    if(timeIndex == 0&&i==index) {
                        if (!that.serviceTime[i].serviceStartTime) {
                            toast.editContent('请先选择开始时间')
                            return false;
                        }
                    }
                }
                event.chooseTime(false, false, false, true, true, false);

            },

            addTimeClick(){
                const toast=this.$refs.toast;
                if(this.serviceTime.length<3){
                    this.serviceTime.push({serviceStartTime:'',serviceEndTime:''})
                }
                else{
                    toast.editContent('营业时间最多设置三个')
                }
            },
            delTimeClick(index){
                this.serviceTime.splice(index,1)
            },
            minibarLeftButtonClick(){
                navigator.pop({ animated: 'true' });
            },
            //放回上一页
            toEnterMessageTwo:function () {
                navigator.pop({ animated: 'true' });
            },
            //登录
            toLogin(){
                event.delete("businessToken");
                event.delete("shopId");
                event.delete("shopName");
                modal.toast({
                    message: '退出成功'
                });
                var url='http://assets/login.js';
                var param='';
                event.toUrl({url:url,param:param});
                navigator.pop({ animated: 'false' });
            },
            //修改时间
            toEnterMessage:function () {
                var param = this.GLOBAL.sign(this.token,this.imei);
                var that = this;
                param += '&serviceTime=' + JSON.stringify(that.serviceTime);
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: 'https://www.aftdc.com/businessapp/Store/alter_time',
                }, function (e) {
                    if (e.data.res === -2) {
                        that.toLogin();
                    } else if (e.data.res ===1){
                        modal.toast({
                            message:e.data.info
                        });
                        var param = {serviceTime:that.serviceTime};
                        event.save('timeParam',JSON.stringify(param));
                        navigator.pop({ animated: 'true' });
                    } else {
                        modal.toast({
                            message:e.data.info
                        });
                    }
                });
                console.log(this.serviceTime)
            },
        },
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
        margin-top: 30px;
    }

    .okButton:active {
        background-color: #57aba5;
    }
    .okButton:enabled {
        background-color: #53beb7;
    }
    .okButtonTwo:active {
        background-color: #f1f1f1;
    }
    .okButtonTwo:enabled {
        background-color: #fff;
    }
    .content{
        background-color: #fff;
    }
    .backImg {
        width: 40px;
        height: 40px;
    }
    .backButton{
        margin-top: 30px;
        margin-left: 30px;
    }
    .backButton:active{
        background-color: #f1f1f1;
    }
    .confirmButton{
        margin-top: 30px;
        margin-left: 30px;
    }
    .confirmButton:active{
        background-color:#57aba5;
    }
    .businessHoursDiv{
        flex-direction: row;
        align-items: center;
        justify-content: center;
        padding-top: 30px;
        padding-bottom: 30px;
    }
    .distributionTime{
        color: #999;
        font-weight: 600;
    }
    .addTime{
        flex: 1;
        text-align: center;
        margin-left: 100px;
        margin-right: 100px;
        padding-top: 15px;
        padding-bottom: 15px;
        margin-top: 20px;
        margin-bottom: 20px;
        border-style: solid;
        border-width: 2px;
        border-color: #53beb7;
    }
    .addTime:active{
        background-color: #f8f8f8;
    }
    .ruler{
        color: #999;
        text-align: center;
        font-weight: 600;
    }
    .line{
        width: 50px;
        border-style: solid;
        border-color: #666;
        border-width: 2px;
    }
    .delIconDiv{
        flex-direction: row;
        justify-content: flex-end;
        width: 200px;
        padding-right: 30px;
    }
    .delIcon{
        width: 35px;
        height: 35px;
    }
    .number{
        flex: 1;
        text-align: center;
        font-weight: 600;
    }
    .time{
        margin-top: 30px;
        margin-bottom: 30px;
        flex-direction: row;
        align-items: center;
    }
    .title{
        padding-top: 30px;
        padding-bottom: 30px;
        padding-left: 30px;
        font-size: 32px;
        background-color: #f1f1f1;
        font-weight: 600;
    }
    .businessHours{
        background-color: #f9f9f9;
    }
</style>
