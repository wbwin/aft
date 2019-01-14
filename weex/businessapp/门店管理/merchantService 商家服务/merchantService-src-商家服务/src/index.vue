<template>
    <div class="wrapper">

        <div class="minibar" @touchmove="touchmove" @touchend="touchend">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    @wxcMinibarRightButtonClicked="backConfirmBtnClicked"
                    v-once
            >
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">商家服务</text>
                <text :style="GLOBAL.headerRight"  slot="right">保存</text>
            </wxc-minibar>
        </div>

        <list class="scroller" @scroll="scrollMove">

            <cell>
                <div class="listCell">
                    <div class="cell">
                        <div class="cell_left">
                            <div class="cellTitle">
                                <text  :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">外卖</text>
                                <image class="cellTitleIcon" src="https://image.aftdc.com/appBimg/icon_help_exhibition.jpg" @click="iconClicked(0)"></image>
                            </div>
                        </div>

                        <div ref="takeOutF" :class="[takeOutSwitch==false?'close':'open']"
                             style="justify-content: center;padding-left: 1px;"
                             @click="bill(0)">
                            <div ref="takeOutS" :class="[takeOutSwitch==false?'isClose':'isOpen']"></div>
                        </div>
                    </div>
                    <div class="cell">
                        <div class="cell_left">
                            <div class="cellTitle">
                                <text  :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">免费配送</text>
                                <image class="cellTitleIcon" src="https://image.aftdc.com/appBimg/icon_help_exhibition.jpg" @click="iconClicked(1)"></image>
                            </div>
                        </div>
                        <div ref="freeDistributionF" :class="[freeDistributionSwitch==false?'close':'open']"
                             style="justify-content: center;padding-left: 1px;"
                             @click="bill(5)">
                            <div ref="freeDistributionS" :class="[freeDistributionSwitch==false?'isClose':'isOpen']"></div>
                        </div>
                    </div>
                    <div class="cell">
                        <div class="cell_left">
                            <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">配送费</text>
                        </div>
                        <div class="cell_right">
                            <input :style="GLOBAL.inputText" v-if="!freeDistributionSwitch"  ref="inputOne" class="input" @focus="allFocus" @blur="allBlur"  v-model="distributionFee"  type="number" placeholder="配送费"/>
                            <text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor}" v-else>0</text>
                            <text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor}">元</text>
                        </div>
                    </div>

                </div>
            </cell>
            <cell>
                <div class="listCell">
                    <div class="cell">
                        <div class="cell_left">
                            <div class="cellTitle">
                                <text  :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">顾客到店自取</text>
                                <image class="cellTitleIcon" src="https://image.aftdc.com/appBimg/icon_help_exhibition.jpg" @click="iconClicked(2)"></image>
                            </div>
                        </div>
                        <div ref="test1" :class="[startSwitch==false?'close':'open']"
                             style="justify-content: center;padding-left: 1px;"
                             @click="bill(2)">
                            <div ref="test2" :class="[startSwitch==false?'isClose':'isOpen']"></div>
                        </div>
                    </div>


                    <div class=" choiceCell" @click="pick()">
                        <div class="cell">
                            <div class="cell_left">
                                <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">备餐时间</text>
                            </div>
                            <div class="cell_right">

                                <text class="choiceTimeSize" :style="{fontSize:GLOBAL.defaultFS}">{{inShopChoiceTime}}</text>
                                <image class="arrowRightIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                            </div>
                        </div>
                    </div>
                </div>
            </cell>
            <cell>
                <div class="listCell">
                    <div class="cell">
                        <div class="cell_left">
                            <div class="cellTitle">
                                <text  :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">堂食预订</text>
                                <image class="cellTitleIcon" src="https://image.aftdc.com/appBimg/icon_help_exhibition.jpg" @click="iconClicked(3)"></image>
                            </div>
                        </div>
                        <div ref="foodBookF" :class="[foodBookSwitch==false?'close':'open']"
                             style="justify-content: center;padding-left: 1px;"
                             @click="bill(1)">
                            <div ref="foodBookS" :class="[foodBookSwitch==false?'isClose':'isOpen']"></div>
                        </div>
                    </div>

                </div>
            </cell>
            <cell>
                <div class="listCell">
                    <div class="cell">
                        <div class="cell_left">
                            <div class="cellTitle">
                                <text  :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">团购</text>
                                <image class="cellTitleIcon" src="https://image.aftdc.com/appBimg/icon_help_exhibition.jpg" @click="iconClicked(4)"></image>
                            </div>
                        </div>
                        <div ref="grouponF" :class="[grouponSwitch==false?'close':'open']"
                             style="justify-content: center;padding-left: 1px;"
                             @click="bill(3)">
                            <div ref="grouponS" :class="[grouponSwitch==false?'isClose':'isOpen']"></div>
                        </div>
                    </div>
                </div>
            </cell>

            <cell>
                <div class="listCell">
                    <div class="cell">
                        <div class="cell_left">
                            <div class="cellTitle">
                                <text  :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">夜宵</text>
                                <image class="cellTitleIcon" src="https://image.aftdc.com/appBimg/icon_help_exhibition.jpg" @click="iconClicked(5)"></image>
                            </div>
                        </div>
                        <div ref="midnightSnackF" :class="[midnightSnackSwitch==false?'close':'open']"
                             style="justify-content: center;padding-left: 1px;"
                             @click="bill(6)">
                            <div ref="midnightSnackS" :class="[midnightSnackSwitch==false?'isClose':'isOpen']"></div>
                        </div>
                    </div>
                    <div class="cell">
                        <div class="cell_left">
                            <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">营业时间</text>
                        </div>
                        <div class="cell_right">
                            <div class="time">
                                <text class="number" @click="chooseTime(1)" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{serviceStartTime}}</text>
                                <text class="line" :style="{color:GLOBAL.dColor}"></text>
                                <text class="number" @click="chooseTime(0)" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{serviceEndTime}}</text>
                            </div>
                        </div>

                    </div>

                </div>
            </cell>

        </list>
        <wxc-mask height="970"
                  width="650"
                  border-radius="10"
                  duration="200"
                  mask-bg-color="#FFFFFF"
                  :has-animation="true"
                  :has-overlay="true"
                  :show-close="false"
                  :show="choiceDate"
                  @wxcMaskSetHidden="wxcMaskSetHidden">
            <div class="content">
                <div class="checkList" @click="checkClick(item.checked,index)" v-for="(item,index) in list">
                    <text class="checkTitle" :style="{fontSize: GLOBAL.bigFS, color: GLOBAL.dColor}">{{item.title}}</text>
                    <image class="checkIcon" :src="item.checked?'https://image.aftdc.com/appBimg/ic_check_box_checked.png':'https://image.aftdc.com/appBimg/ic_check_box_normal.png'"></image>
                </div>
                <text :style="{fontSize: GLOBAL.smallFS, color:maskTips?'#ff4500':'#999'}" style="margin-left: 10px;margin-top:15px">至少选择一天或相邻几天，不可隔天选择</text>
                <div class="maskButton">
                    <wxc-button class="cancelButton" text="取消"  :btnStyle="smCancelButton" :textStyle="GLOBAL.cancelButtonText"
                                @wxcButtonClicked="wxcMaskSetHidden"></wxc-button>
                    <wxc-button class="sureButton" text="确定" :textStyle="GLOBAL.buttonText" :btnStyle="smDefaultButton"
                                @wxcButtonClicked="choiceDateSure"></wxc-button>
                </div>
                <!--<wxc-checkbox-list :list="list"-->
                <!--:config="config"-->
                <!--@wxcCheckBoxListChecked="wxcCheckBoxListChecked"></wxc-checkbox-list>-->
            </div>
        </wxc-mask>
        <wxc-mask height="970"
                  width="650"
                  border-radius="10"
                  duration="200"
                  mask-bg-color="#FFFFFF"
                  :has-animation="true"
                  :has-overlay="true"
                  :show-close="false"
                  :show="choiceTime"
                  @wxcMaskSetHidden="wxcMaskSetHidden">
            <div class="content">
                <scroller style="flex: 1" show-scrollbar="false" >
                    <div class="checkList" @click="choiceTimeClick(index)" v-for="(item,index) in timeList">
                        <text class="checkTitle" :style="{fontSize: GLOBAL.bigFS, color: GLOBAL.dColor}">{{item}}</text>
                        <image class="checkIcon" :src="timeListIndex==index?'https://image.aftdc.com/appBimg/ic_check_box_checked.png':'https://image.aftdc.com/appBimg/ic_check_box_normal.png'"></image>
                    </div>
                </scroller>
                <div class="maskButton">
                    <wxc-button class="cancelButton" text="取消"  :btnStyle="smCancelButton" :textStyle="GLOBAL.cancelButtonText"
                                @wxcButtonClicked="wxcMaskSetHidden"></wxc-button>
                    <wxc-button class="sureButton" text="确定" :textStyle="GLOBAL.buttonText" :btnStyle="smDefaultButton"
                                @wxcButtonClicked="choiceTimeSure"></wxc-button>
                </div>
                <!--<wxc-checkbox-list :list="list"-->
                <!--:config="config"-->
                <!--@wxcCheckBoxListChecked="wxcCheckBoxListChecked"></wxc-checkbox-list>-->
            </div>
        </wxc-mask>
        <toast ref="toast"></toast>
    </div>
</template>

<script>
    const animation = weex.requireModule('animation')
    const modal = weex.requireModule('modal');
    const picker = weex.requireModule('picker')
    import {WxcIcon,WxcDialog,WxcMinibar,WxcMask,WxcButton} from 'weex-ui'
    import Toast from './Toast.vue'
    const post = weex.requireModule('stream');
    const event = weex.requireModule('event');
    const navigator = weex.requireModule('navigator');
    export default {
        components: {WxcIcon,Toast,WxcDialog,WxcMinibar,WxcMask,WxcButton},
        data() {
            return {
                backImgToggle: 0,//头部返回图片判断
                backShow: false,
                isOn: '',
                startSwitch: false,//switch一开始的状态；
                inShopChoiceTime: '',//
                time: [],
                index: 0,
                iconStyle: {
                    fontSize: '35px'
                },
                posters:['https://image.aftdc.com/appBimg/ic_pickup_bill_first.jpg',
                    'https://image.aftdc.com/appBimg/ic_pickup_bill_second.jpg'],

                takeOutSwitch:false,//是否已开启外卖
                foodBookSwitch:false,//是否已开启堂食预订
                grouponSwitch:false,//是否已开启团购
                freeDistributionSwitch:false,//是否开启免费配送
                midnightSnackSwitch:false,//是否开启夜宵

                blurPrevent:false,//阻止多次失去焦点的定时器
                aa:false,
                touch:false,//用于获取焦点和失去焦点的兼容

                distributionFee:'',//配送费
                distance:'',//配送距离
                bookMoney:'',//预订金额
                deliveryFreeMoney:'',//起送费
                timeIndex:'',

                choiceDate:false,//选择预订日期弹出层
                maskTips:false,//判断选择预订日期提示的颜色
                choiceDateMax:'',//保存的日期的最大值（0~7）
                choiceDateMin:'',//保存的日期的最小值（0~7）
                choiceDateToggle:'',
                foodChoiceDateMax:'',//堂食预订保存的日期的最大值（0~7）
                foodChoiceDateMin:'',//堂食预订保存的日期的最小值（0~7）
                list: [//预订日期范围
                    { title: '今天(第0天)'},
                    { title: '明天(第1天)' },
                    { title: '后天(第2天)' },
                    { title: '第3天'},
                    { title: '第4天'},
                    { title: '第5天'},
                    { title: '第6天'},
                    { title: '第7天'},

                ],
                checkedList:[],//选中的所有日期（保存时勿用此来做接口数据保存）
                choiceTime:false,//预订时间弹出层
                timeList:['30分钟','45分钟','1小时','1小时15分钟','1小时30分钟','1小时45分钟','2小时','2小时15分钟','2小时30分钟','2小时45分钟','3小时'],//预订时间服围
                timeListIndex:-1,//选中的预订时间
                remindTime:-1,//保存的预订时间
                foodRemindTime:-1,//堂食预订保存的预订时间
                choiceTimeToggle:'',
                smCancelButton:{
                    backgroundColor: '#fff',
                    width: '270',
                    height:'80',
                    borderColor: '#666',
                    borderWidth: '1px',
                    borderStyle: 'solid'
                },
                smDefaultButton:{
                    backgroundColor: '#53beb7',
                    width: '270',
                    height:'80',
                },
                serviceStartTime:'',
                serviceEndTime:'',

                token:'',
                imei:''
            }
        },
        created() {
            this.token = weex.config.token
            this.imei = weex.config.imei
            var that = this
            for (var i = 1; i <= 6; i++) {
                var time = 5 * i + '分钟'
                that.time.push(time);
            }

            //获取token和sign
            var param = this.GLOBAL.sign(this.token,this.imei);

            post.fetch({
                method: 'post',
                type: 'json',
                body: param,
                url: 'https://www.aftdc.com/businessapp/Enrol/self_store',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
            },function(res){
                if (res.data.res == 1) {
                    var store = res.data.data
                    if(store.ddzq == 1){
                        that.bill(2);
                    }
                    if(store.wm == 1){
                        that.bill(0);
                    }
                    if(store.tsyd == 1){
                        that.bill(1);
                    }
                    if(store.tg == 1){
                        that.bill(3);
                    }
                    if(store.psf == 0){
                        that.bill(5);
                    }else {
                        that.distributionFee = store.psf
                    }
                    that.serviceStartTime = store.ksyy
                    that.serviceEndTime = store.jsyy

                    //结束营业时间大于等于22:00，属于夜宵
                    var times = parseInt(store.jsyy.replace(":","").replace(/\b(0+)/gi,""))
                    var timess = parseInt(store.ksyy.replace(":","").replace(/\b(0+)/gi,""))
                    if (times>=2200||(times>0&&timess>=times)){
                        that.bill(6);
                    }

                    that.inShopChoiceTime = res.data.mealTime+'分钟';
                    for(var i=0;i<that.time.length;i++){
                        if( that.inShopChoiceTime==that.time[i]){
                            that.index=i
                        }
                    }
                }
            })
            event.init();
            weex.requireModule('globalEvent').addEventListener("chooseTime", function (e) {
                if (that.timeIndex === 1) {
                    that.serviceStartTime = e.time;
                    that.serviceStartTimes = e.timestamp;
                } else {
                    that.serviceEndTime = e.time;
                    that.serviceEndTimes = e.timestamp;
                }
            });
        },
        mounted() {
            var that = this;
            //switch按钮开始状态
            that.takeOutSwitch=!that.takeOutSwitch;
            that.foodBookSwitch=!that.foodBookSwitch;
            that.startSwitch=!that.startSwitch;
            that.grouponSwitch=!that.grouponSwitch;
            that.freeDistributionSwitch=!that.freeDistributionSwitch;
            that.midnightSnackSwitch=!that.midnightSnackSwitch;
            that.takeOutBookSwitch=!that.takeOutBookSwitch;
            that.bill(5);
            that.bill(1);
            that.billTwo(0);
            // that.billTwo(4);
            that.bill(2);
            that.bill(3);
            that.bill(6);
        },
        methods: {
            // input的获取焦点和失去焦点
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
            //键盘弹起后点击其他地方收起键盘
            allFocus(){
                var that=this;
                if(that.blurPrevent){
                    that.aa=true;
                }
                else{
                    that.aa=false;
                }
                // that.aa=true;
                setTimeout(function () {
                    that.blurPrevent = true;
                },80)
                setTimeout(function () {
                    that.aa=false;
                },320)


            },
            allBlur(){
                var that=this;
                setTimeout(function () {
                    if(that.aa){
                        setTimeout(function () {
                            that.aa=false;
                        },40)
                    }
                    else{
                        that.blurPrevent = false;
                    }
                }, 200)
            },
            blur(){
                this.$refs.inputOne.blur();

                // this.$refs.inputFive.blur();
                // this.$refs.inputSix.blur();
            },
            choiceDateShowClick(toggle){
                var that=this;
                that.checkedList=[];
                for(let i=0;i<that.list.length;i++){
                    that.$set(that.list[i],'checked',false)
                }
                if(toggle==0){
                    if(that.choiceDateMax!==''&&that.choiceDateMin!==''){

                        for(let i=that.choiceDateMin;i<=that.choiceDateMax;i++){
                            that.checkedList.push(i);
                            that.$set(that.list[i],'checked',true)
                        }
                    }
                }else{
                    if(that.foodChoiceDateMax!==''&&that.foodChoiceDateMin!==''){

                        for(let i=that.foodChoiceDateMin;i<=that.foodChoiceDateMax;i++){
                            that.checkedList.push(i);
                            that.$set(that.list[i],'checked',true)
                        }
                    }
                }
                that.choiceDateToggle=toggle
                that.choiceDate=true
            },
            choiceTimeShowClick(toggle){
                var that=this;
                if(toggle==0){
                    that.timeListIndex=that.remindTime;
                }else{
                    that.timeListIndex=that.foodRemindTime;
                }
                that.choiceTimeToggle=toggle
                that.choiceTime=true
            },
            choiceDateSure(){
                var that=this
                if(that.checkedList.length==0){
                    that.maskTips=true
                    return false
                }
                var max=Math.max.apply(null,that.checkedList);
                var min=Math.min.apply(null,that.checkedList);
                if(that.choiceDateToggle==0){
                    that.choiceDateMax=max;
                    that.choiceDateMin=min;
                }else{
                    that.foodChoiceDateMax=max;
                    that.foodChoiceDateMin=min;
                }

                that.choiceDate=false
            },
            choiceTimeSure(){
                var that=this
                if(that.choiceTimeToggle==0){
                    that.remindTime=that.timeListIndex;
                }else{
                    that.foodRemindTime=that.timeListIndex;
                }

                that.choiceTime=false
            },
            checkClick(checked,index){

                var that=this;
                that.maskTips=false;
                if(checked){
                    for(let i in that.checkedList){
                        if(that.checkedList[i]<index){
                            for(let j=index;j<that.list.length;j++){
                                that.$set(that.list[j],'checked',false)
                                that.checkedList=[];
                                for(let i in that.list){
                                    if(that.list[i].checked){
                                        that.checkedList.push(i)
                                    }
                                }
                            }
                            break
                        }else{
                            that.$set(that.list[index],'checked',false)
                            that.checkedList=[]
                            for(let i in that.list){
                                if(that.list[i].checked){
                                    that.checkedList.push(i)
                                }
                            }
                        }
                    }
                }else{
                    // that.$set(that.list[index],'checked',true)
                    that.checkedList.push(index);
                    var max=Math.max.apply(null,that.checkedList);
                    var min=Math.min.apply(null,that.checkedList);
                    for(let i=min;i<=max;i++){
                        that.$set(that.list[i],'checked',true)
                    }
                    that.checkedList=[];
                    for(let i in that.list){
                        if(that.list[i].checked){
                            that.checkedList.push(i)
                        }
                    }
                }
            },
            choiceTimeClick(index){
                var that=this;
                that.timeListIndex=index
            },
            allSaveClick(){
                this.backShow = true;
            },
            pick() {
                picker.pick({
                    index: this.index,
                    items: this.time,
                    confirmTitle: '确认',
                    cancelTitle: '取消',

                }, event => {
                    if (event.result === 'success') {
                        this.inShopChoiceTime = this.time[event.data]
                        this.index = event.data
                    }
                })
            },
            bill: function (switchIndex) {
                var that = this;
                if(switchIndex===0){
                    var testEl = this.$refs.takeOutF;
                    var testE2 = this.$refs.takeOutS;
                    var switchBl=that.takeOutSwitch;
                    that.takeOutSwitch=!that.takeOutSwitch;
                    if(!that.takeOutSwitch&&that.freeDistributionSwitch){
                        that.bill(5)
                    }
                }else if(switchIndex===1){
                    var testEl = this.$refs.foodBookF;
                    var testE2 = this.$refs.foodBookS;
                    var switchBl=that.foodBookSwitch;
                    that.foodBookSwitch=!that.foodBookSwitch;
                    // if(that.foodBookSwitch&&!that.invoice){
                    //     that.bill(5)
                    // }
                }else if(switchIndex===2){
                    var testEl = this.$refs.test1;
                    var testE2 = this.$refs.test2;
                    var switchBl=that.startSwitch;
                    that.startSwitch=!that.startSwitch
                }else if(switchIndex===3){
                    var testEl = this.$refs.grouponF;
                    var testE2 = this.$refs.grouponS;
                    var switchBl=that.grouponSwitch;
                    that.grouponSwitch=!that.grouponSwitch
                }
                else if(switchIndex===4){
                    var testEl = this.$refs.takeOutBookF;
                    var testE2 = this.$refs.takeOutBookS;
                    var switchBl=that.takeOutBookSwitch;
                    that.takeOutBookSwitch=!that.takeOutBookSwitch;
                    if(!that.takeOutSwitch&&that.takeOutBookSwitch){
                        that.bill(0)
                    }
                }
                else if(switchIndex===5){
                    var testEl = this.$refs.freeDistributionF;
                    var testE2 = this.$refs.freeDistributionS;
                    var switchBl=that.freeDistributionSwitch;
                    that.freeDistributionSwitch=!that.freeDistributionSwitch;
                    if(!that.takeOutSwitch&&that.freeDistributionSwitch){
                        that.bill(0);
                    }
                }else if(switchIndex===6){
                    var testEl = this.$refs.midnightSnackF;
                    var testE2 = this.$refs.midnightSnackS;
                    var switchBl=that.midnightSnackSwitch;
                    that.midnightSnackSwitch=!that.midnightSnackSwitch;
                    if (that.midnightSnackSwitch) {
                        var times = parseInt(that.serviceEndTime.replace(":","").replace(/\b(0+)/gi,""))
                        var timess = parseInt(that.serviceStartTime.replace(":","").replace(/\b(0+)/gi,""))
                        if (times>=2200||(times>0&&timess>=times)){

                        }else {
                            that.serviceEndTime = '22:00';
                            that.serviceEndTimes = 1535810400;
                        }
                    }else{
                        that.serviceEndTime = '21:59';
                        that.serviceEndTimes = 1535810340;
                    }
                }

                if (switchBl) {
                    var transform = 'translate(0px, 0px)';
                    animation.transition(testE2, {
                        styles: {
                            transform: transform,
                        },
                        duration: 500, //ms
                        timingFunction: 'ease',
                        delay: 0 //ms
                    });
                    animation.transition(testEl, {
                        styles: {
                            backgroundColor: '#e2e2e2',
                        },
                        duration: 500, //ms
                        timingFunction: 'ease',
                        delay: 0 //ms
                    })

                } else {
                    var transform = 'translate(52px, 0px)';
                    animation.transition(testE2, {
                        styles: {
                            transform: transform,
                        },
                        duration: 500, //ms
                        timingFunction: 'ease',
                        delay: 0 //ms
                    })
                    animation.transition(testEl, {
                        styles: {
                            backgroundColor: '#4ed465',
                        },
                        duration: 500, //ms
                        timingFunction: 'ease',
                        delay: 0 //ms
                    })
                }

            },
            billTwo:function(switchIndex){
                var that = this;
                if(switchIndex===5){
                    var testEl = this.$refs.invoiceF;
                    var testE2 = this.$refs.invoiceS;
                    var switchBl=that.invoice;
                    that.invoice=!that.invoice;
                }
                else if(switchIndex===0){
                    var testEl = this.$refs.takeOutF;
                    var testE2 = this.$refs.takeOutS;
                    var switchBl=that.takeOutSwitch;
                    that.takeOutSwitch=!that.takeOutSwitch;
                }
                else if(switchIndex===4){
                    var testEl = this.$refs.takeOutBookF;
                    var testE2 = this.$refs.takeOutBookS;
                    var switchBl=that.takeOutBookSwitch;
                    that.takeOutBookSwitch=!that.takeOutBookSwitch;
                }
                else if(switchIndex===1){
                    var testEl = this.$refs.foodBookF;
                    var testE2 = this.$refs.foodBookS;
                    var switchBl=that.foodBookSwitch;
                    that.foodBookSwitch=!that.foodBookSwitch
                }
                if (switchBl) {
                    var transform = 'translate(0px, 0px)';
                    animation.transition(testE2, {
                        styles: {
                            transform: transform,
                        },
                        duration: 500, //ms
                        timingFunction: 'ease',
                        delay: 0 //ms
                    });
                    animation.transition(testEl, {
                        styles: {
                            backgroundColor: '#e2e2e2',
                        },
                        duration: 500, //ms
                        timingFunction: 'ease',
                        delay: 0 //ms
                    })

                } else {
                    var transform = 'translate(52px, 0px)';
                    animation.transition(testE2, {
                        styles: {
                            transform: transform,
                        },
                        duration: 500, //ms
                        timingFunction: 'ease',
                        delay: 0 //ms
                    })
                    animation.transition(testEl, {
                        styles: {
                            backgroundColor: '#4ed465',
                        },
                        duration: 500, //ms
                        timingFunction: 'ease',
                        delay: 0 //ms
                    })
                }
            },//用于mounted一开始的兼容
            //返回上一页
            minibarLeftButtonClick(){
                navigator.pop({ animated: 'true' });
            },
            backConfirmBtnClicked () {//点保存时时
                var that = this;
                const toast=that.$refs.toast

                that.backShow = false;

                var takeOutSwitch=that.takeOutSwitch//是否已开启外卖
                var foodBookSwitch=that.foodBookSwitch//是否已开启堂食预订
                var grouponSwitch=that.grouponSwitch//是否已开启团购
                var freeDistributionSwitch=that.freeDistributionSwitch//是否开启免费配送
                var midnightSnackSwitch=that.midnightSnackSwitch//是否开启夜宵
                if(freeDistributionSwitch){
                    var distributionFee=0//开启免配送费的话，配送费为0
                }else{
                    that.$refs.inputOne.blur();
                    var distributionFee=that.distributionFee//配送费
                }

                //以下是到店自取
                var ddzq = that.startSwitch;//是否开启到店自取
                if(ddzq)
                    ddzq = 1;
                else
                    ddzq = 0;

                if (takeOutSwitch)
                    var wm = 1
                else
                    var wm = 0
                if (foodBookSwitch)
                    var tsyd = 1
                else
                    var tsyd = 0
                if (grouponSwitch)
                    var tg = 1
                else
                    var tg = 0
                if (freeDistributionSwitch)
                    var psf = 0
                else
                    var psf = distributionFee
                if (midnightSnackSwitch){
                    //结束营业时间大于等于22:00，属于夜宵
                    var times = parseInt(that.serviceEndTime.replace(":","").replace(/\b(0+)/gi,""))
                    var timess = parseInt(that.serviceStartTime.replace(":","").replace(/\b(0+)/gi,""))
                    if (times>=2200||(times>0&&timess>=times)){
                        var ksyy = that.serviceStartTimes
                        var jsyy = that.serviceEndTimes
                        console.log(times)
                        console.log(timess)
                    }else {
                        toast.editContent('营业时间不属于夜宵');
                        return false;
                    }
                } else{
                    var ksyy = that.serviceStartTimes
                    var jsyy = that.serviceEndTimes
                }

                var select_shop = {ddzq:ddzq, wm:wm, tsyd:tsyd, tg:tg, psf:psf, ksyy:ksyy, jsyy:jsyy}

                var mealTime = that.inShopChoiceTime;

                //获取token和sign
                var param = this.GLOBAL.sign(this.token,this.imei);
                param += '&&mealTime='+mealTime+'&&'+'select_shop='+JSON.stringify(select_shop);
                console.log(param);
                post.fetch({
                    method: 'post',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/businessapp/Enrol/up_store',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                },function(res){
                    if(res.data.res === 1){
                        toast.editContent('保存成功...');
                        setTimeout(()=>navigator.pop({ animated: 'true' }),1500);
                    } else {
                        toast.editContent('保存失败');
                    }
                })
            },
            iconClicked(index){
                var param=index
                var url='http://assets/merchantServiceDescription.js'
                event.toUrl({"url":url,"param":param})
            },
            wxcMaskSetHidden(){
                var that=this
                that.choiceDate=false
                that.choiceTime=false
            },
            chooseTime(index){
                this.timeIndex = index;
                event.chooseTime(false, false, false, true, true, false);
            },
        }
    }
</script>

<style scoped>
    .minibar {
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: #f1f1f1;
    }
    .wrapper {
        justify-content: center;
        align-items: center;
    }

    .scroller {
        background-color: #f8f8f8;
        flex: 1;
        width: 750px;

    }

    .listCell {
        flex-direction: column;
        margin-bottom: 20px;
        background-color: #fff;
    }

    .cell {
        flex-direction: row;
        justify-content: space-between;

        padding-top: 15px;
        padding-bottom: 15px;
        padding-left: 20px;
        padding-right: 20px;
        align-items: center;
    }

    .cell_left {
        flex-direction: column;
        flex: 0.6;
    }

    .explainSize {
        color: #999;
        margin-top: 5px;
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
        background-color: #e2e2e2;
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

    .choiceCell:active {
        background-color: #f1f1f1;
    }

    .cell_right {
        flex-direction: row;
        align-items: center;
        flex: 1;
        justify-content: flex-end;
    }
    .input {
        padding-top: 10px;
        padding-bottom: 10px;
        text-align: right;
        flex: 1;
        margin-right: 10px;
    }
    .choiceTimeSize {
        color: #999;
    }

    .listExplain {
        flex-direction: column;
        background-color: #fff;
        margin-bottom: 20px;
    }

    .explain_title {
        flex-direction: row;
        align-items: center;
        padding-left: 20px;
        padding-top: 20px;
        padding-bottom: 20px;
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #f8f8f8;
    }

    .explain_content {
        flex-direction: column;
        /*align-items: center;*/
        padding-top: 30px;
        padding-bottom: 30px;
    }

    .content_inline {
        flex-direction: row;
        align-items: center;
    }

    .content_img {
        padding-left: 20px;
        padding-right: 20px;
    }

    .imgDefault {
        width: 60px;
        height: 60px;
    }

    .explain_font {
        flex-direction: column;
        padding-left: 20px;
        border-left-width: 1px;
        border-left-style: solid;
        border-left-color: #f1f1f1;
    }
    .imgSlider{
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding-top: 30px;
        padding-bottom: 30px;
    }
    .slider {
        position: relative;
    }
    .indicator {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 20px;
        height: 60px;
        /*background-color: rgba(0, 0, 0, 0.3);*/
        itemSize:25px;
        itemColor: #DDDDDD;
        itemSelectedColor: rgb(0, 180, 255);
    }
    .size{
        width: 700px;
        height: 1000px;
    }
    .prompt{
        flex-direction: row;
        justify-content: center;
        align-items: center;
        margin-top: 20px;
    }
    /***********************/
    .arrowRightIcon{
        width: 20px;
        height: 20px;
        margin-left: 10px;
    }
    .content{
        flex-direction: column;
        flex: 1;
    }
    .checkList{
        padding-top: 30px;
        padding-left: 30px;
        padding-right: 30px;
        padding-bottom: 30px;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: #f1f1f1;
    }
    .checkTitle{

    }
    .checkIcon{
        width: 40px;
        height: 40px;
    }
    .maskButton{
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        margin-top: 25px;
        margin-bottom: 15px;
    }
    .sureButton:active{
        background-color: #57aba5;
    }
    .setButton{
        flex-direction: row;
        justify-content: space-around;
        background-color: #fff;
        border-top-width: 2px;
        border-top-style: solid;
        border-top-color: #f1f1f1;
        padding-top: 20px;
        padding-bottom: 20px;
        padding-left: 30px;
        padding-right: 30px;
        /*margin-top: 20px;*/

    }
    .cancelButton:active{
        background-color: #f1f1f1;
    }
    .saveButton:active{
        background-color: #57aba5;
    }
    .cellTitle {
        flex-direction: row;
        align-items: center;
    }
    .cellTitleIcon{
        width: 37px;
        height: 37px;
        margin-left: 20px;
    }
    .time{
        margin-top: 30px;
        margin-bottom: 30px;
        padding-left: 200px;
        padding-right: 200px;
        flex-direction: row;
        align-items: center;
    }
    .line{
        width: 40px;
        border-style: solid;
        border-color: #666;
        border-width: 1px;
        margin-left: 5px;
        margin-right: 5px;
    }
    .number{
        flex: 1;
        text-align: center;
    }
</style>
