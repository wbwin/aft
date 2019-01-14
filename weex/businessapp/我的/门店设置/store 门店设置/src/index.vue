<template>
    <div class="wrapper" @viewappear="viewappear" @viewdisappear="viewdisappear">
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
                <text :style="GLOBAL.headerCenter"  slot="middle">门店设置</text>
            </wxc-minibar>
        </div>

        <div class="list">
            <div style="margin-top: 15px;">
                <div class="normal" @click="goToBusStatus">
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">营业状态</text>
                    <div style="flex-direction: row;align-items: center">
                        <text v-if="shopInfo.shopAtive==1" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">营业中</text>
                        <text v-if="shopInfo.shopAtive==2" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">休息中</text>
                        <text v-if="shopInfo.shopAtive==0" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">已停业</text>
                        <image class="moreIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                    </div>
                </div>
                <div class="normal" style="margin-top: 1px;" @click="goToAnnouncement">
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">餐厅公告</text>
                    <div class="noticeDiv">
                        <text class="noticeText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{shopInfo.notice}}</text>
                        <image class="moreIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                    </div>
                </div>
                <div class="normal" @click="storShow">
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">餐厅环境</text>
                    <div style="flex-direction: row;align-items: center">
                        <image class="moreIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                    </div>
                </div>
            </div>
            <div style="margin-top: 30px;">
                <div class="normal" @click="goToPhoneNum">
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">餐厅电话</text>
                    <div style="flex-direction: row;align-items: center">
                        <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{shopInfo.phone}}</text>
                        <image class="moreIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                    </div>
                </div>
                <div class="normal" style="margin-top: 1px;" @click="openAppointMap">
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">餐厅地址</text>
                    <div class="noticeDiv">
                        <text class="noticeTextTwo" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{shopInfo.shopAddress}}</text>
                        <image class="moreIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                    </div>
                </div>
                <div class="normal" style="margin-top: 1px;" @click="goToBusTime">
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">营业时间</text>
                    <div style="flex-direction: row;align-items: center">
                        <div class="businessHoursDiv">
                            <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}" v-for="(item,index) in shopInfo.serviceTime">{{item.serviceStartTime}}-{{item.serviceEndTime}}{{index!=shopInfo.serviceTime.length-1?' ':''}}</text>
                        </div>
                        <image class="moreIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                    </div>
                </div>
            </div>
            <!--<div style="margin-top: 15px;">-->
            <!--<div class="normal">-->
            <!--<text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">支持发票</text>-->
            <!--<div ref="test2" :class="[shopInfo.bill ? 'open':'close']"-->
            <!--style="justify-content: center;padding-left: 1px;" @click="bill(shopInfo.bill)">-->
            <!--<div ref="test1" :class="[shopInfo.bill ? 'isOpen':'isClose']"></div>-->
            <!--</div>-->
            <!--</div>-->
            <!--</div>-->
            <div style="margin-top: 15px;">
                <div class="normal">
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">电子合同</text>
                    <div style="flex-direction: row;align-items: center">
                        <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">未生效</text>
                        <image class="moreIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                    </div>
                </div>
                <div class="normal" style="margin-top: 1px;" @click="toBusinessAgreement">
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">商家协议</text>
                    <div style="flex-direction: row;">
                        <image class="moreIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {WxcIcon,WxcMinibar} from 'weex-ui'
    const modal = weex.requireModule('modal')
    const navigator = weex.requireModule('navigator')
    const event = weex.requireModule('event')
    const post = weex.requireModule('stream');
    const animation = weex.requireModule('animation')
    export default {
        components: { WxcIcon, WxcMinibar},
        name: 'App',
        data() {
            return {
                backImgToggle: 0,//头部返回图片判断
                shopInfo: [],
                more: {color: '#666', fontSize: '30px', fontWeight: '15px'},
                isOn: '',
                nums: '',
                shopInfos: '',
                pageBack: false,
                token:'',
                imei:''

            }
        },
        created: function () {
            this.token = weex.config.token;
            this.imei = weex.config.imei;

            var that = this;
            var param = this.GLOBAL.sign(this.token,this.imei);
            post.fetch({
                method: 'POST',
                type: 'json',
                body: param,
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                url: 'https://www.aftdc.com/businessapp/Analy/analyDown',
            }, function (res) {
                that.shopInfo = res.data.data;
                that.isOn = that.shopInfo.bill
            })
        },
        methods: {
            //返回上一页
            minibarLeftButtonClick:function () {
                var param = {'serviceTime':this.shopInfo.serviceTime};
                event.save('timeParam',JSON.stringify(param));
                navigator.pop({ animated: 'true' });
            },
            bill: function (num) {
                var that = this
                var testEl = this.$refs.test1;
                var testE2 = this.$refs.test2;
                console.log(num);
                if (num == 0) {
                    that.nums = num
                } else {
                    that.nums = num
                }
                if (that.nums == 0) {
                    if (that.isOn == 0) {
                        that.shopInfos = true
                        that.isOn = 1
                        animation.transition(testEl, {
                            styles: {
                                transform: 'translate(52px, 0px)',
                            },
                            duration: 800, //ms
                            timingFunction: 'ease',
                            delay: 0 //ms
                        })
                        animation.transition(testE2, {
                            styles: {
                                backgroundColor: '#4ed465',
                            },
                            duration: 800, //ms
                            timingFunction: 'ease',
                            delay: 0 //ms
                        })
                    }
                    else {
                        that.isOn = 0
                        that.shopInfos = false
                        var testEl = this.$refs.test1;
                        var testE2 = this.$refs.test2;
                        animation.transition(testEl, {
                            styles: {
                                transform: 'translate(0px, 0px)',
                            },
                            duration: 800, //ms
                            timingFunction: 'ease',
                            delay: 0 //ms
                        })
                        animation.transition(testE2, {
                            styles: {
                                backgroundColor: '#e2e2e2',
                            },
                            duration: 800, //ms
                            timingFunction: 'ease',
                            delay: 0 //ms
                        })
                    }
                } else {
                    if (that.isOn == 1) {
                        that.isOn = 0
                        that.shopInfos = false
                        animation.transition(testEl, {
                            styles: {
                                transform: 'translate(-52px, 0px)',
                            },
                            duration: 800, //ms
                            timingFunction: 'ease',
                            delay: 0 //ms
                        })
                        animation.transition(testE2, {
                            styles: {
                                backgroundColor: '#e2e2e2',
                            },
                            duration: 800, //ms
                            timingFunction: 'ease',
                            delay: 0 //ms
                        })
                    }
                    else {
                        that.isOn = 1
                        that.shopInfos = true
                        animation.transition(testEl, {
                            styles: {
                                transform: 'translate(2px, 0px)',
                            },
                            duration: 800, //ms
                            timingFunction: 'ease',
                            delay: 0 //ms
                        })
                        animation.transition(testE2, {
                            styles: {
                                backgroundColor: '#4ed465',
                            },
                            duration: 800, //ms
                            timingFunction: 'ease',
                            delay: 0 //ms
                        })
                    }
                }
                var timestamp = Date.parse(new Date()) / 1000;
                var sign = 'im=' + this.imei + '&token=' +this.token + '&timestamp=' + timestamp;
                var sign = this.GLOBAL.md5(sign);
                sign = sign.toUpperCase()

                var formData = '';
                formData+='timestamp='+timestamp;
                formData+='&token='+this.token;
                formData+='&sign='+sign;

                /*获取上传的图片对象*/
                formData += '&bill=' + that.shopInfos;
                post.fetch({
                        method: 'POST',
                        type: 'json',
                        body: formData,
                        headers: {"Content-Type": "application/x-www-form-urlencoded"},
                        url: 'https://www.aftdc.com/businessapp/Store/setBill',
                    }
                    , function (e) {
                        if (e.data.res == -2) {
                            event.openURL('weex://go/scan') //跳到登陆页面
                        }
                        else {
                            if (e.data.res == 1) {
                                modal.alert({
                                    message: '操作成功'
                                })
                                // / event.openURL('weex://go/scan') //跳到登陆页面
                            }
                            if (e.data.res == 0) {
                                modal.alert({
                                    message: '操作失败'
                                })
                                return false;
                            }
                        }

                    }
                )
            },
            //跳转到公告页面
            goToAnnouncement:function () {
                var param = '';
                var url='http://assets/announcement.js';
                event.toUrl({ "url": url, "param": param });
            },
            //跳转到手机号码页面
            goToPhoneNum:function () {
                var param = '';
                var url='http://assets/poneNum.js';
                event.toUrl({ "url": url, "param": param });
            },
            //打开餐厅位置
            openAppointMap(){
                event.openAppointMap(this.shopInfo.longitude,this.shopInfo.latitude);
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
                //获取公告保存的数据
                if(event.find('data')) {
                    var param = JSON.parse(event.find('data'));
                    var type = param['type'];
                    if (type === 'notice') {
                        self.shopInfo['notice'] = param['notice'];
                    } else if (type === 'phone'){
                        self.shopInfo['phone'] = param['phone'];
                    }
                    //删除保存的数据
                    event.delete('data');
                }
                //获取营业状态保存的数据
                if (event.find('statusParam')) {
                    var statusParam = JSON.parse(event.find('statusParam'));
                    var shopAtive = statusParam['shopAtive'];
                    self.shopInfo.serviceTime = statusParam['serviceTime'];
                    if (shopAtive === 1) {
                        shopAtive = 0;
                    } else {
                        shopAtive = 1;
                    }
                    self.shopInfo.shopAtive= shopAtive;
                    event.delete('statusParam');
                }
                //获取营业时间保存的数据
                if (event.find('timeParam')) {
                    var timeParam = JSON.parse(event.find('timeParam'));
                    self.shopInfo.serviceTime = timeParam['serviceTime'];
                    event.delete('timeParam');
                    // //判断营业状态
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
                            self.shopInfo.shopAtive = 1
                            break;
                        }else{
                            self.shopInfo.shopAtive = 2
                        }
                    }
                }
            },
            goToBusStatus:function () {
                var param = {'shopAtive':this.shopInfo.shopAtive, 'serviceTime':this.shopInfo.serviceTime, 'shopImg':this.shopInfo.shopImg};
                var url='http://assets/busStatus.js';
                event.toUrl({ "url": url, "param": JSON.stringify(param)});
            },
            storShow:function () {
                var param = '';
                var url='http://assets/storShow.js';
                event.toUrl({ "url": url, "param": param });
            },
            goToBusTime:function () {
                var param = {'serviceTime':this.shopInfo.serviceTime};
                var url='http://assets/busTime.js';
                event.toUrl({ "url": url, "param": JSON.stringify(param)});
            },
            toBusinessAgreement(){
                var param = '';
                var url='http://assets/businessAgreement.js';
                event.toUrl({ "url": url, "param": param });
            },
        },
    }
</script>

<style scoped>
    .moreIcon{
        width: 20px;
        height: 20px;
        margin-left:10px;
    }
    .minibar {
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: #f1f1f1;
    }
    .wrapper {
        background-color: #f0f0f0;
    }


    .list {
        position: absolute;
        top: 89px;
        right: 0;
        left: 0;
        bottom: 0;
    }
    .businessHoursDiv{
        flex-direction: row;
        align-items: center;
    }
    .normal {
        padding-left: 20px;
        padding-right: 20px;
        padding-top: 25px;
        padding-bottom: 25px;
        background-color: #ffffff;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
    .normalTwo{
        padding-left: 20px;
        padding-right: 20px;
        padding-top: 25px;
        padding-bottom: 25px;
        background-color: #ffffff;
        flex-direction: row;
        align-items: center;
    }

    .noticeDiv{
        flex-direction: row;
        align-items: center;
        padding-left: 20px;
    }

    .noticeTextTwo{
        flex: 1;
        text-align: left;
        max-width: 548px;

    }
    .noticeText{
        max-width: 548px;
        flex: 1;
        lines:1;
        text-overflow: ellipsis;
        text-align: left;
    }

    .open {
        width: 104px;
        height: 52px;
        border-radius: 52px;
        border-width: 1px;
        border-style: solid;
        border-color: white;
        background-color: #4ed465;
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
        margin-left: 52px;
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

</style>
