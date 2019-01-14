<template>
    <div class="wrapper"  @touchmove="touchmove" @touchend="touchend" :style="{visibility: visibility}">

        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    @wxcMinibarRightButtonClicked="save"
                    v-once
            >
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">商家代金券</text>
                <text :style="GLOBAL.headerRight"  slot="right">保存</text>
            </wxc-minibar>
        </div>

        <scroller  class="content" offset-accuracy="30" @scroll="scrollMove">
            <div class="contentClassfly" @touchstart="touchstart">

                <div class="betweenDiv">
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor,flex:'0.4'}">开始日期</text>
                    <div class="inputDiv" @click="chooseTime(0)">
                        <!--<input class="input" v-model="startTime" :min="minDate" @change="startTimeChange($event)" type="date" placeholder="未设置" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}"/>-->
                        <text  :style="{'font-size': GLOBAL.bigFS, 'placeholder-color': '#999', 'color': startTime==''?'#999':GLOBAL.dColor,marginRight:'10px'}">{{startTime==''?'未设置':startTime}}</text>
                        <wxc-icon name="more" :icon-style="iconStyle"></wxc-icon>
                    </div>
                </div>

                <div class="betweenDiv">
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor,flex:'0.4'}">结束日期</text>
                    <div class="inputDiv" @click="chooseTime(1)">
                        <!--<input class="input" :min="startTime" @change="endTimeChange($event)" type="date" placeholder="未设置" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}"/>-->
                        <text  :style="{'font-size': GLOBAL.bigFS, 'placeholder-color': '#999', 'color':endTime==''?'#999':GLOBAL.dColor,marginRight:'10px'}">{{endTime==''?'未设置':endTime}}</text>
                        <wxc-icon name="more" :icon-style="iconStyle"></wxc-icon>
                    </div>
                </div>

                <div class="betweenDiv">
                    <text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor,flex:'0.4'}">不可用日期</text>
                    <div class="inputDiv"  @click="useDataClick">
                        <text class="useDataText"  :style="{'font-size': GLOBAL.bigFS, 'placeholder-color': '#999', 'color':useData==''?'#999':GLOBAL.dColor,marginRight:'10px'}">{{useData==''?'未设置':useData}}</text>
                        <wxc-icon name="more" :icon-style="iconStyle"></wxc-icon>
                    </div>
                </div>

                <div class="betweenspcel">
                    <text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor,flex:'0.4'}">使用时间</text>
                    <div class="inputDiv">
                        <text @click="chooseTime(2)" :style="{'font-size': GLOBAL.bigFS, 'placeholder-color': '#999', 'color': smallStart==''?'#999':GLOBAL.dColor,marginRight:'10px'}">{{smallStart==''?'开始时间':smallStart}}</text>
                        <text @click="chooseTime(3)" :style="{'font-size': GLOBAL.bigFS, 'placeholder-color': '#999', 'color': smallEnd==''?'#999':GLOBAL.dColor,marginRight:'10px'}">- {{smallEnd==''?'结束时间':smallEnd}}</text>
                        <!--<image class="addIcon" src="https://image.aftdc.com/appBimg/add.png" @click="addClick"></image>-->
                    </div>
                </div>
                <div class="timeLabel">
                    <text class="LabelText" @click="clearLabelClick(index)" :style="{fontSize:GLOBAL.defaultFS,color:'#fff'}" v-for="(item,index) in dataList" :key="index">{{item.start}}-{{item.end}} ✗</text>
                    <text v-if="dataList.length<=0" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">请添加使用时间</text>
                </div>

            </div>

            <div class="contentClassfly">
                <div class="betweenDiv">
                    <text class="text" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor,flex:'0.4'}">代金券金额</text>
                    <div class="inputDiv">
                        <input class="input" ref="inputOne" @focus="allFocus" @blur="allBlur"  v-model="voucherMoney" type="number" placeholder="请输入代金券金额" :style="GLOBAL.inputText" />
                        <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">元</text>
                    </div>
                </div>
                <div class="betweenDiv">
                    <text class="text" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor,flex:'0.4'}">售价</text>
                    <div class="inputDiv">
                        <input class="input" ref="inputTwo" @focus="allFocus" @blur="allBlur"  v-model="price" type="number" placeholder="请输入售价" :style="GLOBAL.inputText" />
                        <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">元</text>
                    </div>
                </div>
                <!--库存-->
                <div class="contentSwitch" @touchstart="touchstart">
                    <div class="protocol">
                        <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">库存数量无限</text>
                    </div>
                    <div ref="test2Stock" :style="{backgroundColor:backgroundColorStock}" :class="[startSwitchStock==false?'close':'open']"
                         style="justify-content: center;padding-left: 1px;"
                         @click="billStock">
                        <div ref="test1Stock" :class="[startSwitchStock==false?'isClose':'isOpen']"></div>
                    </div>
                </div>
                <div class="betweenDiv" v-if="!startSwitchStock">
                    <text class="text" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor,flex:'0.4'}">库存数量</text>
                    <div class="inputDiv">
                        <input class="input" ref="inputThree" @focus="allFocus(0)" @blur="allBlur"  v-model="goodsStock" type="number" placeholder="请输入库存数量" :style="GLOBAL.inputText" />
                        <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">份</text>
                    </div>
                </div>

            </div>
            <!--备注-->
            <div class="contentSwitchs" @touchstart="touchstart">
                <div>
                    <text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor}" style="padding-bottom: 20px;">备注信息</text>
                </div>
                <div>
                    <textarea class="describe" ref="inputFive" v-model="groupDes"  @focus="allFocus" @blur="allBlur" maxlength="250" placeholder="备注一下你的代金券活动吧(非必填,最多250字)"></textarea>
                </div>

            </div>

            <div class="contentSwitchs" @touchstart="touchstart">

                <div>
                    <text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor}" style="padding-bottom: 20px;">使用规则</text>
                </div>

                <div class="row" style="padding-bottom: 15px;" @click="appointmentClick" @touchstart="touchstart">
                    <text class="notext" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">无需预约,消费高峰时可能需要等位</text>
                    <image class="useIcon" :src="appointment?'https://image.aftdc.com/appBimg/ic_check_box_checked.png':'https://image.aftdc.com/appBimg/ic_check_box_normal.png'"></image>
                </div>

                <div class="row" v-if="!appointment" style="margin-bottom: 10px;">
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">预约时间:</text>
                </div>
                <div class="row" v-if="!appointment" style="margin-bottom: 20px;" @touchstart="touchstart">
                    <text class="appointmentText" :class="[item.select?'selectAppointment':'']" @click="appoinSelect(index)" v-for="(item,index) in appointmentList" :key="index" :style="{fontSize:GLOBAL.defaultFS,color:item.select?'#fff':'#999'}">{{item.text}}</text>
                </div>

                <div class="row" style="margin-top: 10px;">
                    <input type="text" class="ruleInput" placeholder="输入使用规则" maxlength="200" ref="inputFour" v-model="rule" :style="GLOBAL.inputText"  @focus="allFocus" @blur="allBlur"/>

                    <text class="addRule" :class="[rule.length>1?'addRuleActive':'']" @click="addRuleClick">添加</text>
                    <!--<image class="addIcon" src="https://image.aftdc.com/appBimg/add.png" @click="addRuleClick"></image>-->
                </div>
                <div class="ruleLabel">
                    <div class="row ruleLabelDiv" v-for="(item,index) in ruleList" :key="index" :style="{marginTop:index!=0?'15px':''}" >
                        <text class="ruleText" :style="{fontSize:GLOBAL.defaultFS,color:'#fff'}">{{item.text}}</text>
                        <image class="pictures" src="https://image.aftdc.com/images/sub.png" @click="ruleLabelClick(index)"></image>
                        <!--<text :style="{fontSize:GLOBAL.defaultFS,color:'#fff'}"> ✗</text>-->
                    </div>
                    <text v-if="ruleList.length<=0" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">请添加使用规则</text>
                </div>

            </div>


            <div class="contentSwitch">
                <div class="protocol">
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">已阅读并同意</text>
                    <text class="protocolColor" :style="{fontSize:GLOBAL.bigFS}">《商家自营销协议》</text>
                </div>
                <div ref="test2" :style="{backgroundColor:backgroundColor}" :class="[startSwitch==false?'close':'open']"
                     style="justify-content: center;padding-left: 1px;"
                     @click="bill">
                    <div ref="test1" :class="[startSwitch==false?'isClose':'isOpen']"></div>
                </div>
            </div>
        </scroller>

        <wxc-mask height="800"
                  width="650"
                  border-radius="10"
                  duration="200"
                  mask-bg-color="#FFFFFF"
                  :has-animation="true"
                  :has-overlay="true"
                  :show="dataShow"
                  @wxcMaskSetHidden="wxcMaskSetHidden">
            <div class="useData">
                <div class="useDiv" v-for="(item,index) in useDataList" :key="index" @click="usePickClick(index)">
                    <text :style="{fontSize: GLOBAL.defaultFS, color: GLOBAL.dColor}">{{item.text}}</text>
                    <image class="useIcon" :src="item.select?'https://image.aftdc.com/appBimg/ic_check_box_checked.png':'https://image.aftdc.com/appBimg/ic_check_box_normal.png'"></image>

                </div>

                <div class="useBottom">
                    <text class="usetext" :style="{fontSize: GLOBAL.defaultFS, color:'#999'}" @click="useCancelClick">取消</text>
                    <text class="usetext" :style="{fontSize: GLOBAL.defaultFS, color: GLOBAL.tColor}" @click="useConfirmClick">确认</text>
                </div>
            </div>
        </wxc-mask>

        <!--<div class=" enterButton" v-if="inputFocus">-->
        <!--<wxc-button class="okButtonTwo" text="取消" :textStyle="GLOBAL.cancelButtonText" :btnStyle="GLOBAL.smCancelButton"-->
        <!--@wxcButtonClicked="minibarLeftButtonClick"></wxc-button>-->
        <!--<wxc-button class="okButton" text="保存" :textStyle="GLOBAL.buttonText" :btnStyle="GLOBAL.smDefaultButton"-->
        <!--@wxcButtonClicked="save"></wxc-button>-->
        <!--</div>-->
        <toast ref="toast"></toast>
    </div>
</template>

<script>
    import {WxcButton, WxcDialog, WxcIcon,WxcMinibar,WxcMask} from 'weex-ui'
    import Toast from './Toast.vue'
    const animation = weex.requireModule('animation');
    const event = weex.requireModule('event');
    const post = weex.requireModule('stream');
    const navigator = weex.requireModule('navigator');
    const modal = weex.requireModule('modal')
    export default {
        components: {WxcButton, WxcDialog, Toast, WxcIcon,WxcMinibar,WxcMask},
        data () {
            return {
                visibility:'hidden',
                btnShow:true,
                backImgToggle: 0,//头部返回图片判断
                backShow: false,
                isOn: true,

                startSwitch: true,//switch一开始的状态
                backgroundColor:'',//动画背景色
                prevent:true,//阻止多次点击绿色按钮

                groupDes:'',//备注

                //库存
                startSwitchStock: true,//switch一开始的状态
                backgroundColorStock:'',//动画背景色
                preventStock:true,//阻止多次点击绿色按钮
                goodsStock:'',//库存数量

                useData:'',//使用日期
                dataShow:false,
                useDataList:[
                    {text:'周一',select:false},
                    {text:'周二',select:false},
                    {text:'周三',select:false},
                    {text:'周四',select:false},
                    {text:'周五',select:false},
                    {text:'周六',select:false},
                    {text:'周日',select:false},
                    {text:'法定节假日',select:false},
                ],//使用日期选择
                useDataCache:[
                    {text:'周一',select:false},
                    {text:'周二',select:false},
                    {text:'周三',select:false},
                    {text:'周四',select:false},
                    {text:'周五',select:false},
                    {text:'周六',select:false},
                    {text:'周日',select:false},
                    {text:'法定节假日',select:false},
                ],//使用日期选择暂时的缓存

                smallStart:'',
                smallEnd:'',
                dataList:[],//使用時間

                rule:'',
                ruleList:[],

                appointment:false,//请用于样式开关
                subscribeTime:'',//是否预约传给接口的值
                appointmentList:[
                    {text:'30分钟',select:false},
                    {text:'1小时',select:false},
                    {text:'2小时',select:false},
                    {text:'3小时',select:false},
                    {text:'5小时',select:false},
                    {text:'1天',select:false},
                ],


                radio: 0,//0为普通领取，1为分享领取
                minDate: '',
                iconStyle: {
                    fontSize: '30px'
                },
                startTime: '',
                endTime:'',
                cancelBtnStyle:{
                    backgroundColor: '#fff',
                    width: '300',
                    borderColor: '#333',
                    borderWidth: '1px',
                    borderStyle: 'solid'
                },
                cancelStyle:{
                    color:'#53beb7'
                },
                saveBtnStyle:{
                    backgroundColor: '#53beb7',
                    width: '300',
                    borderColor: '#333',
                    borderWidth: '1px',
                    borderStyle: 'solid'
                },
                saveStyle:{
                    color:'#fff'
                },
                price:'',
                voucherMoney:'',
                token:'',
                imei:'',
                timeIndex:'',
                inputFocus:true,
                blurPrevent:false,//阻止多次失去焦点的定时器
                blurPreventSec:false,
                touch:false,
                preventRepeatedClicks:false,//阻止重复点击


            }

        },
        created() {
            var that = this;
            that.visibility='hidden';
            that.token = weex.config.token;
            that.imei = weex.config.imei;
            var param  = JSON.parse(weex.config.param)
            for(var i = 0;i < param.length; i++){
                that.dataList.push({start:param[i].serviceStartTime,end:param[i].serviceEndTime})
            }

            var now = new Date();
            var startTime = now.getFullYear() + "-" + ((now.getMonth() + 1) < 10 ? "0" : "") + (now.getMonth() + 1) + "-" + (now.getDate() < 10 ? "0" : "") + now.getDate();
            var endTime = (now.getFullYear() + 1) + "-" + ((now.getMonth() + 1) < 10 ? "0" : "") + (now.getMonth() + 1) + "-" + (now.getDate() < 10 ? "0" : "") + now.getDate();
            var time = startTime;
            that.minDate = time;
            that.startTime = startTime;
            event.init();
            weex.requireModule('globalEvent').addEventListener('chooseTime', function (e) {

                if (that.timeIndex === 0 ) {
                    that.startTime=e.time
                }
                else if (that.timeIndex === 1) {
                    var timeTop=that.startTime.split('-');
                    var endTopOne=Number(timeTop[0]);
                    var endTopTwo=Number(timeTop[1]);
                    var endTopThree=Number(timeTop[2]);

                    var time=e.time.split('-');
                    var endOne=Number(time[0]);
                    var endTwo=Number(time[1]);
                    var endThree=Number(time[2]);
                    if(endOne<endTopOne){
                        const toast = that.$refs.toast;
                        toast.editContent('结束日期不能小于开始日期');
                        return false;
                    }
                    else if(endOne==endTopOne && endTwo<endTopTwo){
                        const toast = that.$refs.toast;
                        toast.editContent('结束日期不能小于开始日期');
                        return false;
                    }
                    else if(endOne==endTopOne && endTwo==endTopTwo && endThree<endTopThree){
                        const toast = that.$refs.toast;
                        toast.editContent('结束日期不能小于开始日期');
                        return false;
                    }
                    that.endTime=e.time
                }
                else if (that.timeIndex === 2) {

                    if(that.dataList.length<=0){

                        that.smallStart=e.time
                    }
                    else if(that.dataList.length>0){
                        for(var i in that.dataList){

                            var timeStart=that.dataList[i].start.split(':');
                            var star=Number(timeStart[0])*60+Number(timeStart[1]);//开始时间

                            var timeEnd=that.dataList[i].end.split(':');
                            var end=Number(timeEnd[0])*60+Number(timeEnd[1]);//结束时间

                            var selectTime=e.time.split(':');
                            var select=Number(selectTime[0])*60+Number(selectTime[1]);

                            if(select>=star&&select<=end){
                                const toast = that.$refs.toast;
                                toast.editContent('选择时间有重复');
                                return false;
                                break;
                            }


                        }
                        that.smallStart=e.time
                    }
                }
                else if (that.timeIndex === 3) {

                    var startTime=that.smallStart.split(':');
                    var start=Number(startTime[0])*60+Number(startTime[1]);//选择的开始时间

                    var endTime=e.time.split(':');
                    var end=Number(endTime[0])*60+Number(endTime[1]);

                    // var startTimeTop=that.dataList[0].start.split(':');
                    // var startTop=Number(startTimeTop[0])*60+Number(startTimeTop[1]);
                    //
                    // var endTimeTop=that.dataList[0].end.split(':');
                    // var endTop=Number(endTimeTop[0])*60+Number(endTimeTop[1]);
                    //
                    // var startTimeTopTwo=that.dataList[1].start.split(':');
                    // var startTopTwo=Number(startTimeTopTwo[0])*60+Number(startTimeTopTwo[1]);
                    //
                    // var endTimeTopTwo=that.dataList[1].end.split(':');
                    // var endTopTwo=Number(endTimeTopTwo[0])*60+Number(endTimeTopTwo[1]);

                    if(end<=start){
                        const toast = that.$refs.toast;
                        toast.editContent('结束时间小于开始时间');
                        return false;
                    }

                    else if(that.dataList.length==1){

                        var startTimeTop=that.dataList[0].start.split(':');
                        var startTop=Number(startTimeTop[0])*60+Number(startTimeTop[1]);

                        var endTimeTop=that.dataList[0].end.split(':');
                        var endTop=Number(endTimeTop[0])*60+Number(endTimeTop[1]);

                        if(start<startTop && end>=startTop){
                            const toast = that.$refs.toast;
                            toast.editContent('选择时间有重复');
                            return false;
                        }
                    }
                    else if(that.dataList.length==2){

                        var startTimeTop=that.dataList[0].start.split(':');
                        var startTop=Number(startTimeTop[0])*60+Number(startTimeTop[1]);

                        var endTimeTop=that.dataList[0].end.split(':');
                        var endTop=Number(endTimeTop[0])*60+Number(endTimeTop[1]);

                        var startTimeTopTwo=that.dataList[1].start.split(':');
                        var startTopTwo=Number(startTimeTopTwo[0])*60+Number(startTimeTopTwo[1]);

                        var endTimeTopTwo=that.dataList[1].end.split(':');
                        var endTopTwo=Number(endTimeTopTwo[0])*60+Number(endTimeTopTwo[1]);

                        if((start<startTop && start<startTopTwo) && (end>=startTop || end>=startTopTwo)){
                            const toast = that.$refs.toast;
                            toast.editContent('选择时间有重复');
                            return false;
                        }
                        else if((start>startTop && start<startTopTwo) && end >=startTopTwo){
                            const toast = that.$refs.toast;
                            toast.editContent('选择时间有重复');
                            return false;
                        }
                        else if((start>startTopTwo && start<startTop) && end>=startTop){
                            const toast = that.$refs.toast;
                            toast.editContent('选择时间有重复');
                            return false;
                        }
                    }

                    that.smallEnd=e.time
                    that.dataList.push({start:that.smallStart,end:that.smallEnd})
                    that.smallStart='';
                    that.smallEnd='';
                }
            })

        },
        methods: {
            blur(){
                var that=this;
                that.$refs.inputOne.blur();
                that.$refs.inputTwo.blur();
                if(!that.startSwitchStock){
                    that.$refs.inputThree.blur();
                }
                that.$refs.inputFour.blur();



            },
            touchmove(){
                this.touch=true;
            },
            touchend(){
                this.touch=false;
            },
            scrollMove(){
                if(this.touch){
                    this.blur()
                }
            },
            touchstart(){
                this.blur()
            },
            chooseTime( timeIndex) {
                var that = this;
                that.timeIndex = timeIndex;
                if(timeIndex===0||timeIndex===1){
                    event.chooseTime(true, true, true, false, false, false)
                }
                else if(timeIndex===2||timeIndex===3){
                    if(that.dataList.length>=3){
                        const toast = that.$refs.toast;
                        toast.editContent('最多可添加三个时间段');
                        return false;
                    }
                    if(timeIndex===3&&that.smallStart===''){
                        const toast = this.$refs.toast;
                        toast.editContent('请选择开始时间');
                        return false
                    }
                    event.chooseTime(false, false, false, true, true, false)
                }
            },
            useDataClick(){
                var that=this;
                that.dataShow=true;
            },

            addClick(){
                var that = this;
                if(that.smallStart==''||that.smallEnd==''){
                    const toast = that.$refs.toast;
                    toast.editContent('时间设置不完善');
                    return false;
                }

                if(that.smallStart!=''&&that.smallEnd!=''){
                    that.dataList.push({start:that.smallStart,end:that.smallEnd})
                    that.smallStart='';
                    that.smallEnd='';
                    modal.toast({
                        message:that.dataList
                    })
                }
            },

            clearLabelClick(index){
                this.dataList.splice(index,1)

            },

            wxcMaskSetHidden(){
                var that=this;
                that.dataShow=false;
                that.useDataList=that.useDataCache;
            },
            usePickClick(index){
                var that=this;
                if(that.useDataList[index].select){
                    that.useDataList[index].select=false;
                    return false
                }
                else{
                    that.useDataList[index].select=true;
                    return false
                }
            },
            useCancelClick(){
                var that=this;
                that.dataShow=false;
                that.useDataList=that.useDataCache;
            },
            useConfirmClick(){
                var that=this;

                that.useDataCache=that.useDataList;

                that.useData='';
                that.dataShow=false;
                var length=0;
                for(var i=that.useDataList.length-1;i>=0;i--){
                    if(that.useDataList[i].select){
                        length=i;
                        break;
                    }
                }
                for (var i in that.useDataList){
                    if(that.useDataList[i].select){
                        that.useData=that.useData+that.useDataList[i].text+(i!=length?',':'')
                    }
                }
            },

            appointmentClick(){
                var that=this;
                if(that.appointment){
                    that.appointment=false;
                }
                else{
                    that.appointment=true;
                }
            },
            appoinSelect(index){
                var that=this;
                for(var i in that.appointmentList){
                    that.appointmentList[i].select=false;
                }
                that.appointmentList[index].select=true
            },
            addRuleClick(){
                var that=this;
                if (that.rule===''){
                    const toast = that.$refs.toast;
                    toast.editContent('请输入活动规则');
                    return false;
                }
                that.ruleList.push({text:that.rule});
                that.rule='';
            },
            ruleLabelClick(index){
                var that = this;
                that.ruleList.splice(index,1)
            },

            save:function(){
                var that = this;

                this.blur();
                const toast = this.$refs.toast;
                if(!this.endTime) {
                    toast.editContent('未填写结束日期');
                    return false
                }
                // if(!that.useData){
                //     toast.editContent('未设置不可用日期');
                //     return false
                // }
                if(that.dataList.length<1){
                    toast.editContent('未添加使用时间');
                    return false
                }
                if(!this.voucherMoney)
                {
                    toast.editContent('未填写代金券金额');
                    return false
                }
                if(!this.price)
                {
                    toast.editContent('未填写售价');
                    return false
                }
                if(Number(this.voucherMoney) < Number(this.price))
                {
                    toast.editContent('售价大于代金卷金额');
                    return false
                }
                if(!this.goodsStock){
                    toast.editContent('未输入库存数量');
                    return false
                }
                if(!this.startSwitchStock&&this.goodsStock<1){
                    toast.editContent('库存数量需大于0');
                    return false
                }
                if(!that.appointment){
                    var num=0;
                    for(var i in that.appointmentList){
                        if(that.appointmentList[i].select){
                            num+=1;
                        }
                    }
                    if(num==0){
                        toast.editContent('未选择无需预约或预约时间');
                        return false
                    }
                }
                // if(that.ruleList==''){
                //     toast.editContent('未添加活动规则');
                //     return false
                // }
                if (this.rule !== ''){
                    toast.editContent('请添加输入的规则');
                    return false
                }
                if(!this.startSwitch) {
                    toast.editContent('未同意协议');
                    return false
                }
                if(that.appointment){
                    that.subscribeTime='';
                }
                else{
                    var num =[];
                    for(var i in that.appointmentList){
                        if(that.appointmentList[i].select){
                            num.push(that.appointmentList[i].text)
                        }
                    }
                    that.subscribeTime=num;
                }
                //获取token和sign
                var param = this.GLOBAL.sign(this.token,this.imei);
                var that = this;
                param+= '&timez='+that.startTime;
                param+= '&timey='+that.endTime;
                param += '&useData=' + that.useData;//使用日期
                param += '&dataList=' + JSON.stringify(that.dataList);//使用时间
                param+= '&voucherMoney='+that.voucherMoney;
                param+= '&price='+that.price;
                param+= '&goodsStock=' +that.goodsStock;
                param+= '&groupDes=' +that.groupDes;//备注
                param += '&subscribeTime=' + that.subscribeTime;//预约
                param += '&ruleList=' + JSON.stringify(that.ruleList);//规则
                console.log('log---'+JSON.stringify(param))
                if(that.preventRepeatedClicks){
                    return false
                }
                that.preventRepeatedClicks=true
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    url: 'https://www.aftdc.com/businessapp/Activity/genera',
                }, function (e) {
                    if (e.data.res == -2) {
                        //跳到登陆页面
                        navigator.push({
                            url: "https://image.aftdc.com/images/shop/",
                            animated: 'true'
                        })
                    }
                    else {
                        if (e.data.res == 1) {
                            toast.editContent('创建成功');
                            setTimeout(()=>navigator.pop({ animated: 'true' }),2000);
                        }
                        else {
                            if (e.data.msg) toast.editContent(e.data.msg);
                            else toast.editContent('网络出错');
                            return false;
                        }
                    }
                    that.preventRepeatedClicks=false
                })
            },
            radioClick(index) {
                var that = this;
                that.radio = index;
                if(that.radio==0)
                {
                    this.couType=1;
                }
                else
                {
                    this.couType=2;
                }
            },
            //返回上一页
            minibarLeftButtonClick() {
                navigator.pop({ animated: 'true' });
            },
            bill: function () {
                if(this.prevent){
                    this.prevent=false;


                    var that = this
                    if (that.startSwitch) {

                        // 解决兼容star
                        setTimeout(function () {
                            that.backgroundColor='#e2e2e2'
                        },450)
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
                        })
                        animation.transition(testE2, {
                            styles: {
                                backgroundColor: '#e2e2e2',
                            },
                            duration: 500, //ms
                            timingFunction: 'ease',
                            delay: 0 //ms
                        })
                        that.startSwitch=false;
                    } else {

                        // 解决兼容star
                        setTimeout(function () {
                            that.backgroundColor='#4ed465'
                        },450)
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
                        })
                        animation.transition(testE2, {
                            styles: {
                                backgroundColor: '#4ed465',
                            },
                            duration: 500, //ms
                            timingFunction: 'ease',
                            delay: 0 //ms
                        },function () {
                            that.backgroundColor='#4ed465'
                        })
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
                        that.goodsStock=1;
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
            startTimeChange(event){
                var that=this
                that.startTime=event.value
            },
            endTimeChange(event){
                var that=this
                that.endTime=event.value
            },
            allFocus(){
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
                if(toggle==0){
                    that.$refs.inputThree.setTextFormatter({
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
            blankClick(){
                this.$refs.firInput.blur();
                this.$refs.secInput.blur();
            },
        },
        mounted() {
            var that = this;
            that.visibility='visible';

            that.startSwitch=!that.startSwitch
            that.bill()

            that.startSwitchStock=!that.startSwitchStock
            that.billStock()
            that.$refs.inputOne.setTextFormatter({
                formatRule: "/(\\.\\d{2})(\\S+)/",
                formatReplace: "$1",
                recoverRule: "/\\./g",
                recoverReplace: ""
            })
            that.$refs.inputTwo.setTextFormatter({
                formatRule: "/(\\.\\d{2})(\\S+)/",
                formatReplace: "$1",
                recoverRule: "/\\s+/g",
                recoverReplace: ""
            })
        },
    }
</script>

<style scoped>
    .usetext{
        padding-top: 10px;
        padding-bottom: 10px;
        padding-left: 30px;
        padding-right: 30px;
    }
    .useBottom{
        width: 600px;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
        margin-top: 25px;
    }
    .selectAppointment{
        border-color: #53beb7;
        background-color: #53beb7;
    }
    .useIcon{
        width: 35px;
        height: 35px;
    }
    .useDiv{
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding-left: 25px;
        padding-right: 25px;
        padding-top: 25px;
        padding-bottom: 25px;
        border-bottom-style: solid;
        border-bottom-width: 2px;
        border-bottom-color: #dedede;
    }
    .useData{
        background-color: #fff;
        /*padding-top: 20px;*/
        padding-bottom: 20px;
        padding-left: 20px;
        padding-right: 20px;
    }
    .enterButton {
        flex-direction: row;
        justify-content: space-around;
        /*position: fixed;*/
        /*left: 0;            存在时固定在底部*/
        /*bottom: 0;*/
        /*right: 0;*/
        background-color: #fff;
        border-top-width: 2px;
        border-top-style: solid;
        border-top-color: #f1f1f1;
        padding-top: 20px;
        padding-bottom: 20px;
        padding-left: 30px;
        padding-right: 30px;
    }

    .okButton:active {
        background-color: #57aba5;
    }
    .okButtonTwo:active {
        background-color: #f1f1f1;
    }
    .okButton:enabled {
        background-color: #53beb7;
    }
    .okButtonTwo:enabled {
        background-color: #fff;
    }
    .minibar {
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: #f1f1f1;
    }
    .wrapper {
        flex-direction: column;
        background-color: #f8f8f8;
    }
    .content {
        flex: 1;
        width: 750px;
    }

    .contentClassfly {
        flex-direction: column;
        margin-top: 20px;
        background-color: #fff;

    }

    .betweenDiv {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding-top: 20px;
        padding-left: 20px;
        padding-right: 20px;
        padding-bottom: 20px;
    }

    .text {
        width: 150px;
    }

    .input {
        text-align: right;
        flex: 1;
        margin-right: 10px;
        placeholder-color: #999;
    }
    .inputWidth{
        flex: 0;
        width: 190px;
    }

    /*.input:active {*/
    /*placeholder-color: #333;*/
    /*}*/

    .contentSwitchs {
        margin-top: 20px;
        background-color: #fff;
        padding-top: 20px;
        padding-left: 20px;
        padding-right: 20px;
        padding-bottom: 20px;
    }
    .describe {
        width: 710px;
        height: 220px;
        padding-left: 10px;
        padding-top: 10px;
        padding-right: 10px;
        padding-bottom: 10px;
        border-width: 1px;
        border-style: solid;
        border-color: #53beb7;
        border-radius: 8px;
        lines: 5
    }
    .row{
        flex-direction: row;
        align-items: center;
    }
    .notext{
        /*padding-top: 15px;*/
        /*padding-bottom: 15px;*/
        margin-right: 20px;
    }
    .appointmentText{
        width: 105px;
        text-align: center;
        padding-top: 5px;
        padding-bottom: 5px;
        margin-right: 10px;
        border-style: solid;
        border-color: #ccc;
        border-width: 2px;
        border-radius: 15px;
    }
    .ruleInput{
        flex: 1;
        margin-right: 14px;
    }
    .ruleLabel{
        padding-top: 40px;
        padding-bottom: 20px;
    }
    .ruleLabelDiv{
        padding-right: 10px;
    }
    .ruleText{
        flex: 1;
        padding-left: 20px;
        padding-top: 15px;
        padding-bottom: 15px;
        background-color: #53beb7;
        border-radius: 10px;
        margin-right: 30px;
    }
    .inputDiv {
        flex-direction: row;
        align-items: center;
        flex: 1;
        justify-content: flex-end;
    }
    .betweenspcel{
        flex-direction: row;
        align-items: center;
        padding-top: 20px;
        padding-left: 20px;
        padding-right: 20px;
        padding-bottom: 20px;
    }
    .useDataText{
        text-overflow: ellipsis;
        lines:1;
        flex: 1;
        text-align: right;
    }
    .addIcon{
        width: 30px;
        height: 30px;
    }
    .timeLabel{
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
        padding-left: 20px;
        padding-right: 60px;
        padding-bottom: 20px;
        height: 90px;
    }
    .LabelText{
        padding-left: 15px;
        padding-right: 5px;
        padding-top: 10px;
        padding-bottom: 10px;
        background-color: #53beb7;
        border-radius: 10px;
        margin-left: 15px;
    }
    .imgDefault {
        width: 50px;
        height: 50px;
    }

    .radio_content {
        flex-direction: row;
        align-items: center;
        justify-content: center;
        margin-left: 30px;
    }

    .radioNameSize {
        margin-left: 10px;
    }
    .contentSwitch{
        flex-direction: row;
        margin-top: 20px;
        background-color: #fff;
        padding-top: 20px;
        padding-left: 20px;
        padding-right: 20px;
        padding-bottom: 20px;
        justify-content: space-between;
        align-items: center;
    }
    .protocol {
        flex-direction: row;
        align-items: center;
    }

    .protocolColor {
        color: #53beb7;
    }
    .addRule {
        color: #53beb7;
        font-size: 28px;
        padding-top: 18px;
        padding-bottom: 18px;
        padding-left: 26px;
        padding-right: 26px;
        border-radius: 8px;
        border-width: 1px;
        border-style: solid;
        border-color:  #53beb7;
    }
    .addRuleActive {
        color: #fff;
        background-color: #53beb7;
    }
    .pictures{
        width: 40px;
        height: 40px;
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
    .blank{
        position: absolute;
        width: 750px;
        bottom: 0;
        top: 0;
    }
    /***********************/
</style>
