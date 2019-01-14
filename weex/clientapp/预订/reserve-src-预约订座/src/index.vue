<template>
    <div class="wrapper" @touchstart="touchstart" @touchmove="touchmove" @touchend="touchend" @longpress="longpress">

        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    v-once
            >
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter" class="headerCenter"   slot="middle">{{shopName}}</text>
            </wxc-minibar>
        </div>

        <scroller class="scroller"  show-scrollbar="false" @scroll="scrollMove">

            <div class="reserve_reserveContent">
                <image class="reserve_contentImg" src="https://image.aftdc.com/images/icon_pan.png"></image>
                <div class="reserve_topMes">
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor,width:'610px'}">{{peopleNumber}}人，{{dateData[dateDataIndex]}} {{timeData[timeDataIndex]}}，{{eatPlace==0?'大厅':eatPlace==1?'包间':'包间（接受大厅）'}}，{{readyWay==0?'到店前备餐':'到店后备餐'}}</text>
                </div>
            </div>
            <div class="reserve_reserveContent">
                <image class="reserve_contentImg" src="https://image.aftdc.com/images/icon_name.png"></image>
                <div class="reserve_topMes">
                    <input type="text" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}" maxlength="15" v-model="name" placeholder="请填写用餐人姓名" :disabled="inputDisabled" ref="ref_name" @focus="allFocus()" @blur="allBlur()"  class="reserve_input"/>
                    <div class="aiCenter">
                        <text class="reserve_choiceSex" @click="sexDataIndex=0" :style="{fontSize:GLOBAL.bigFS,color:sexDataIndex==0?'#fff':GLOBAL.dColor,backgroundColor:sexDataIndex==0?'#53beb7':'#fff'}">女士</text>
                        <text class="reserve_choiceSex" @click="sexDataIndex=1" :style="{fontSize:GLOBAL.bigFS,color:sexDataIndex==1?'#fff':GLOBAL.dColor,backgroundColor:sexDataIndex==1?'#53beb7':'#fff'}">先生</text>
                    </div>
                </div>
            </div>
            <div class="reserve_reserveContent">
                <image class="reserve_contentImg" src="https://image.aftdc.com/images/icon_phone.png"></image>
                <div class="reserve_topMes">
                    <input type="number" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}" maxlength="11" v-model="phone" :disabled="inputDisabled" ref="ref_phone"   @focus="allFocus()" @blur="allBlur()" placeholder="请填写联系人电话" class="reserve_input"/>
                </div>
            </div>
            <div class="reserve_reserveContent">
                <image class="reserve_contentImg" src="https://image.aftdc.com/images/icon_remakers.png"></image>
                <div class="reserve_topMes">
                    <input type="text" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}" maxlength="25" v-model="remarks" :disabled="inputDisabled" ref="ref_content" @focus="allFocus()" @blur="allBlur()" @input="remarksInput" placeholder="用餐备注，我们尽量满足" class="reserve_input"/>
                    <text class=" numberWords" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">{{ remarksContent.length }}/25</text>
                </div>
            </div>
            <div>
                <scroller class="reserve_choiceScoller" scroll-direction="horizontal">
                    <text class="reserve_choice" @click="onPeopleNumberClick(index)" ref="ref_peopleNumber" v-for="index in 30" :style="{fontSize:GLOBAL.bigFS,color:peopleNumber==index?'#fff':GLOBAL.dColor,backgroundColor:peopleNumber==index?'#53beb7':'#fff'}">{{index}}人</text>
                </scroller>
            </div>
            <div>
                <scroller class="reserve_choiceScoller" scroll-direction="horizontal">
                    <text class="reserve_choice" @click="onDateDataClick(index)" ref="ref_dateData" v-for="(item,index) in dateData" :style="{fontSize:GLOBAL.bigFS,color:dateDataIndex==index?'#fff':GLOBAL.dColor,backgroundColor:dateDataIndex==index?'#53beb7':'#fff'}">{{item}}</text>
                </scroller>
            </div>
            <div>
                <scroller class="reserve_choiceScoller" scroll-direction="horizontal">
                    <text class="reserve_choice" @click="onTimeDataClick(index)" ref="ref_timeData" v-for="(item,index) in timeData" :style="{fontSize:GLOBAL.bigFS,color:timeDataIndex==index?'#fff':GLOBAL.dColor,backgroundColor:timeDataIndex==index?'#53beb7':'#fff'}">{{item}}</text>
                </scroller>
            </div>
            <div>
                <scroller class="reserve_choiceScoller" scroll-direction="horizontal">
                    <text class="reserve_choice"  @click="eatPlace=0" :style="{fontSize:GLOBAL.bigFS,color:eatPlace==0?'#fff':GLOBAL.dColor,backgroundColor:eatPlace==0?'#53beb7':'#fff'}">大厅</text>
                    <text class="reserve_choice" @click="eatPlace=1"  :style="{fontSize:GLOBAL.bigFS,color:eatPlace==1?'#fff':GLOBAL.dColor,backgroundColor:eatPlace==1?'#53beb7':'#fff'}">包间</text>
                    <text class="reserve_choice"  @click="eatPlace=2" :style="{fontSize:GLOBAL.bigFS,color:eatPlace==2?'#fff':GLOBAL.dColor,backgroundColor:eatPlace==2?'#53beb7':'#fff'}">包间(接受大厅)</text>
                </scroller>
            </div>
            <div>
                <scroller class="reserve_choiceScoller" scroll-direction="horizontal">
                    <text class="reserve_choice" @click="readyWay=0" :style="{fontSize:GLOBAL.bigFS,color:readyWay==0?'#fff':GLOBAL.dColor,backgroundColor:readyWay==0?'#53beb7':'#fff'}">到店前备餐</text>
                    <text class="reserve_choice" @click="readyWay=1" :style="{fontSize:GLOBAL.bigFS,color:readyWay==1?'#fff':GLOBAL.dColor,backgroundColor:readyWay==1?'#53beb7':'#fff'}">到店后备餐</text>
                </scroller>
            </div>
        </scroller>
        <div class="reserve_bottom" v-if="inputFocus">
            <wxc-button class="button" text="确认"  :text-style="GLOBAL.buttonText" :btn-style="GLOBAL.defaultButton"
                        @wxcButtonClicked="wxcButtonClicked"></wxc-button>
        </div>
        <toast ref="toast"></toast>
    </div>


</template>

<script>
    import Toast from './Toast.vue';
    import {WxcMask, WxcMinibar,WxcPopup,WxcButton } from 'weex-ui';
    const post = weex.requireModule('stream');
    const animation = weex.requireModule('animation')
    const modal = weex.requireModule('modal')
    const dom = weex.requireModule('dom')
    const event=weex.requireModule('event')
    const GLOBAL = require('@/Global.vue');
    const navigator = weex.requireModule('navigator');
    export default {
        components: {WxcMask, WxcMinibar,WxcPopup,Toast,WxcButton },
        name: 'App',
        data() {
            return {
                name:'',//姓名
                phone:'',//电话
                remarks:'',//备注
                remarksContent:'',//备注字数
                peopleNumber:1,//人数
                sexDataIndex:1,//性别
                dateData:[],//日期
                dateDataIndex:0,//日期下标
                timeData:[],//时间
                timeDataIndex:0,//时间下标
                eatPlace:0,//用餐地方
                readyWay:1,//备餐方式

                optionalTime:[],//非今天的可选时间
                dayTime:[],//一天内每隔30分钟的时间数组
                //参数

                serviceTime:[],
                orderType:'',
                shopType:'',
                shopId:'',
                shopName:'',
                //通用
                userId:0,
                token:'',
                imei:'',
                pageBack:false,

                touch:false,//用于获取焦点和失去焦点的兼容
                inputFocus:true,
                blurPrevent:false,//阻止多次失去焦点的定时器
                blurPreventSec:false,
                inputDisabled:false,//防止长按复制粘贴的时候底部消失

            }
        },
        created(){
            var that=this
            // that.token = weex.config.token;
            // that.imei = weex.config.imei;
            // that.userId = weex.config.userId;
            var param=JSON.parse(weex.config.param)
            that.orderType=param.orderType
            that.shopType=param.shopType
            that.shopId=param.shopId
            that.shopName=param.shopName
            that.serviceTime=param.serviceTime
            if(event.find('defaultDeskMes')){
                var defaultDeskMes=JSON.parse(event.find('defaultDeskMes'));
                that.name=defaultDeskMes.name
                that.phone=defaultDeskMes.phone
                that.sexDataIndex=defaultDeskMes.sex
            }
            //计算日期数据
            that.calculateDateData()
            //计算时间数据
            that.calculateTimeData()

        },
        mounted(){
            var that=this
            setTimeout(function () {
                that.$refs.ref_phone.setTextFormatter({
                    formatRule: "/(\\.\\d{2})(\\S+)/",
                    formatReplace: "$1",
                    recoverRule: "/\\./g",
                    recoverReplace: ""
                })
            },0)

        },
        methods: {
            calculateDateData(){
                var that=this
                var starDate = that.GLOBAL.formatTime(new Date())
                var datestr = that.GLOBAL.formateIOS(starDate + ' ' + "00:00:00")
                var endDate = that.GLOBAL.addDay(datestr, 7)//暂时默认7天
                that.dateData=that.GLOBAL.calculateDate(starDate,endDate)
            },
            calculateTimeData(){
                var that=this
                var m = 0;
                var n = -30;
                var arr=[];
                for(var i=0;i<48;i++){//算出一天内每隔30分钟的时间数组
                    n+=30;
                    if(n>50){
                        n = 0;
                        m+=1
                    }
                    arr.push((m>9?m:"0"+m)+":"+(n>9?n:"0"+n));
                }
                var presentTime=that.GLOBAL.formatData(new Date())
                var businessHours = []
                var todayTime = []
                var serviceTime=that.serviceTime
                for (var i = 0;i < serviceTime.length;i++){
                    for (var j = 0, len = arr.length; j < len; j++){
                        if (arr[j] >= serviceTime[i].serviceStartTime && arr[j] <= serviceTime[i].serviceEndTime){
                            businessHours.push(arr[j])
                        }
                        if (arr[j] >= serviceTime[i].serviceStartTime && arr[j] <= serviceTime[i].serviceEndTime && arr[j] >= presentTime) {
                            todayTime.push(arr[j])
                        }
                    }
                }

                // 把开始营业半小时内的时间删除
                for (var i = 0, len = arr.length; i < len; i++) {
                    if (arr[i] >= serviceTime[0].serviceStartTime ) {
                        if (arr[i] === businessHours[0]) {
                            businessHours.splice(0, 1)
                        }
                        break
                    }
                }

                // 把现在半小时内的时间删除
                for (var i = 0, len = arr.length; i < len; i++) {
                    if (arr[i] >= presentTime) {
                        if (arr[i] === todayTime[0]) {
                            todayTime.splice(0, 1)
                        }
                        break
                    }
                }
                if(todayTime.length==0){
                    that.dateData.splice(0,1)
                    that.timeData=businessHours
                }else{
                    that.timeData=todayTime
                }
                that.optionalTime=businessHours//非今天的可选时间
                that.dayTime=arr//一天内每隔30分钟的时间数组
            },
            onDateDataClick(index) {
                var that = this
                var dateOfNow = that.GLOBAL.formatTime(new Date())
                var presentTime = that.GLOBAL.formatData(new Date())
                var arr = that.dayTime
                var dateData = that.dateData
                var serviceTime = that.serviceTime
                var todayTime = []
                if (dateData[index] == dateOfNow) {
                    for (var i = 0; i < serviceTime.length; i++) {
                        for (var j = 0, len = arr.length; j < len; j++) {
                            if (arr[j] >= serviceTime[i].serviceStartTime && arr[j] <= serviceTime[i].serviceEndTime && arr[j] >= presentTime) {
                                todayTime.push(arr[j])
                            }
                        }
                    }
                    // 把现在半小时内的时间删除
                    for (var i = 0, len = arr.length; i < len; i++) {
                        if (arr[i] >= presentTime) {
                            if (arr[i] === todayTime[0]) {
                                todayTime.splice(0, 1)
                            }
                            break
                        }
                    }
                    that.timeData = todayTime
                } else {
                    that.timeData = that.optionalTime
                }

                that.dateDataIndex = index
                that.timeDataIndex = 0
                dom.scrollToElement(that.$refs.ref_timeData[0],{offset: -40})
                if (index < 2) {
                    var ref_dateData = that.$refs.ref_dateData[0];
                    dom.scrollToElement(ref_dateData,{offset: -40})
                } else {
                    var ref_dateData = that.$refs.ref_dateData[index - 2];
                    dom.scrollToElement(ref_dateData, {offset: 200})
                }
            },
            onTimeDataClick(index){
                var that = this
                that.timeDataIndex=index
                if (index < 2) {
                    var ref_timeData = that.$refs.ref_timeData[0];
                    dom.scrollToElement(ref_timeData,{offset: -40})
                } else {
                    var ref_timeData = that.$refs.ref_timeData[index - 2];
                    dom.scrollToElement(ref_timeData, {offset: 15})
                }
            },
            onPeopleNumberClick(index){
                var that = this
                that.peopleNumber=index
                if (index < 2) {
                    var ref_peopleNumber = that.$refs.ref_peopleNumber[0];
                    dom.scrollToElement(ref_peopleNumber,{offset: -40})
                } else {
                    var ref_peopleNumber = that.$refs.ref_peopleNumber[index - 2];
                    dom.scrollToElement(ref_peopleNumber, {offset: -200})
                }
            },
            remarksInput(){
                var that=this
                const toast=that.$refs.toast
                if(that.remarksContent.length == 25){
                    toast.editContent('最多25字噢~')
                    return false
                }
            },


            wxcButtonClicked(){
                var that=this
                var name=that.name
                var phone=that.phone
                var remarks=that.remarks
                var peopleNumber=that.peopleNumber
                var sex=that.sexDataIndex
                var date=that.dateData[that.dateDataIndex]
                var time=that.timeData[that.timeDataIndex]
                var eatPlace=that.eatPlace
                var readyWay=that.readyWay
                var timestamp = (Date.parse(new Date()) / 1000).toString();
                timestamp = timestamp + Math.floor(9999 * Math.random());
                const toast=that.$refs.toast
                if(name===''){
                    toast.editContent('请输入用餐人姓名')
                    return false;
                }
                if(phone===''){
                    toast.editContent('请输入联系人电话')
                    return false;
                }
                if(!(/^1[34578]\d{9}$/.test(phone))){
                    toast.editContent('手机号码有误，请重填')
                    return false;
                }
                if(!date||!time){
                    toast.editContent('页面出错啦~')
                    navigator.pop({ animated: 'true' });
                    return false;
                }
                var arr = {};
                arr.numb = peopleNumber;
                arr.reachTime = date+' '+time;
                arr.inputName = name;
                arr.inputPhone = phone;
                arr.inputRemark = remarks;
                arr.id = '';//散台，包厢
                arr.shopId = that.shopId;
                arr.userId = that.userId;
                arr.shopName = that.shopName;
                arr.money = '';//订金
                arr.openid = '';
                arr.baojian = eatPlace;
                arr.isYu = 1;
                arr.orderNo = timestamp;
                arr.sex = sex+1
                arr.mealTime = readyWay+1
                var defaultDeskMes={name:name,phone:phone,sex:sex}
                if(event.find('defaultDeskMes')){
                    event.delete('defaultDeskMes')
                }
                event.save('defaultDeskMes',JSON.stringify(defaultDeskMes))
                var param={orderType:that.orderType,shopType:that.shopType,deskArr:arr};
                var url='http://assets/orderPage.js';
                event.toUrl({"url":url,"param":JSON.stringify(param)})

            },


            minibarLeftButtonClick(){},
            // input的获取焦点和失去焦点
            touchmove(){
                this.touch=true;
            },
            touchstart(){
                this.inputDisabled=false
            },
            touchend(){
                this.touch=false;

            },
            scrollMove(){
                if(this.touch){
                    this.blur()
                }
            },
            longpress(){
                var that=this
                if(that.inputFocus){
                    that.inputDisabled=true
                }

            },
            //键盘弹起后点击其他地方收起键盘
            allFocus(){
                var that=this;
                if(that.inputDisabled){
                    return false
                }
                that.inputFocus=false;
                if(that.blurPrevent){
                    that.blurPreventSec=true;
                }
                else{
                    that.blurPreventSec=false;
                }
                // that.aa=true;
                setTimeout(function () {
                    that.blurPrevent = true;
                },80)
                setTimeout(function () {
                    that.blurPreventSec=false;
                },320)

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
            blur(){
                var that=this

                that.$refs.ref_name.blur()
                that.$refs.ref_phone.blur()
                that.$refs.ref_content.blur()


            },

            // viewappear(){
            //     var that=this
            //     if (!that.pageBack) { return; }
            //     that.pageBack = false;
            //     that.getInvoice();
            //
            // },
            // viewdisappear(){
            //     var that=this
            //     that.pageBack = true;
            // },

        },

    }
</script>

<style scoped>
    .headerCenter{
        text-align:center;
        width:400px;
        lines:1;
        overflow: hidden;
        white-space:nowrap;
        text-overflow:ellipsis
    }
    .scroller{
        flex-direction: column;
        background-color: #fff;
        flex: 1;
    }
    .aiCenter{
        flex-direction: row;
        align-items: center;
    }
    .reserve_reserveContent{
        flex-direction: row;
        align-items: center;
        padding-left: 30px;
        padding-right: 30px;
        flex-wrap: wrap;
        margin-top: 30px;
    }
    .reserve_contentImg{
        width: 40px;
        height: 40px;
        margin-right: 20px;
    }
    .reserve_topMes{
        flex-direction: row;
        align-items: center;
        padding-top: 20px;
        padding-bottom: 20px;
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: #dedede;
        flex: 1;
    }
    .reserve_choiceSex{
        padding-top: 10px;
        padding-left: 15px;
        padding-right: 15px;
        padding-bottom: 10px;
        border-width: 1px;
        border-style: solid;
        border-color: #53beb7;
    }
    .reserve_input{
        flex: 1;
        padding-top:5px;
        padding-bottom:5px;
        margin-right: 20px;

    }
    .reserve_write{
        padding-left: 50px;
        margin-top: 40px;
        padding-right: 50px;
        margin-bottom: 10px;
    }
    .reserve_choiceScoller{
        margin-top: 30px;
        margin-bottom: 30px;
        flex-direction: row;
        width: 750px;
        padding-left: 40px;
        padding-right: 40px;
    }
    .reserve_choice{
        padding-left: 40px;
        padding-right: 40px;
        padding-top: 25px;
        padding-bottom: 25px;
        border-radius: 45px;
        transition-property: backgroundColor;
        transition-duration: 0.3s;
        transition-delay: 0s;
        transition-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1.0);
    }
    .reserve_bottom {
        flex-direction: row;
        justify-content: space-around;
        background-color: #fff;
        padding-top: 20px;
        padding-bottom: 20px;
        padding-left: 30px;
        padding-right: 30px;
        border-top-width: 2px;
        border-top-style: solid;
        border-top-color: #f8f8f8;
    }
    .button:active {
        background-color: #57aba5;
    }
    .button:enabled{
        background-color: #53beb7;
    }
</style>
