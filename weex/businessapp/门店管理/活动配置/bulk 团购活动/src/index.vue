<template>
    <div @viewappear="viewappear" @viewdisappear="viewdisappear" class="wrapper" :style="{visibility: visibility}">
        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="backClick"
                    @wxcMinibarRightButtonClicked="save"
                    v-once
            >
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">团购活动</text>
                <text :style="GLOBAL.headerRight"  slot="right">保存</text>
            </wxc-minibar>
        </div>
        <scroller class="content" @scroll="scrollMove" @touchstart="touchstart" @touchmove="touchmove" @touchend="touchend">

            <div class="contentClassfly">
                <div class="betweenDiv">
                    <text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor,flex:'0.4'}">团购名称</text>
                    <div class="inputDiv" >
                        <input :style="GLOBAL.inputText"   ref="inputOne" class="input" @focus="allFocus" @blur="allBlur" maxlength="18" v-model="groupName" type="text" placeholder="请输入活动名称（限18字以内）"/>
                    </div>
                </div>

                <div class="betweenDiv" @touchstart="touchstart">
                    <text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor,flex:'0.4'}">开始日期</text>
                    <div class="inputDiv"  @click="chooseTime(0)">
                        <!--<input :style="{'font-size': GLOBAL.biggerFS, 'placeholder-color': '#999', 'color': GLOBAL.dColor}" class="input" v-model="startTime" :min="minDate"-->
                        <!--@change="startTimeChange($event)"-->
                        <!--type="date" placeholder="未设置"/>-->
                        <text  :style="{'font-size': GLOBAL.bigFS, 'placeholder-color': '#999', 'color': startTime==''?'#999':GLOBAL.dColor,marginRight:'10px'}">{{startTime==''?'未设置':startTime}}</text>
                        <wxc-icon name="more" :icon-style="iconStyle"></wxc-icon>
                    </div>
                </div>

                <div class="betweenDiv" @touchstart="touchstart">
                    <text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor,flex:'0.4'}">结束日期</text>
                    <div class="inputDiv"  @click="chooseTime(1)">
                        <!--<input :style="{'font-size': GLOBAL.biggerFS, 'placeholder-color': '#999', 'color': GLOBAL.dColor}" class="input" :min="startTime" @change="endTimeChange($event)" type="date"-->
                        <!--placeholder="未设置"/>-->
                        <text  :style="{'font-size': GLOBAL.bigFS, 'placeholder-color': '#999', 'color':endTime==''?'#999':GLOBAL.dColor,marginRight:'10px'}">{{endTime==''?'未设置':endTime}}</text>
                        <wxc-icon name="more" :icon-style="iconStyle"></wxc-icon>
                    </div>
                </div>

                <div class="betweenDiv" @touchstart="touchstart">
                    <text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor,flex:'0.4'}">不可用日期</text>
                    <div class="inputDiv"  @click="useDataClick">
                        <!--<input :style="{'font-size': GLOBAL.biggerFS, 'placeholder-color': '#999', 'color': GLOBAL.dColor}" class="input" :min="startTime" @change="endTimeChange($event)" type="date"-->
                        <!--placeholder="未设置"/>-->
                        <text class="useDataText"  :style="{'font-size': GLOBAL.bigFS, 'placeholder-color': '#999', 'color':useData==''?'#999':GLOBAL.dColor,marginRight:'10px'}">{{useData==''?'未设置':useData}}</text>
                        <wxc-icon name="more" :icon-style="iconStyle"></wxc-icon>
                    </div>
                </div>

                <div class="betweenspcel" @touchstart="touchstart">
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
                <div class="betweenDiv"  @touchstart="touchstart">
                    <text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor,flex:'0.4'}">选择商品</text>
                    <div class="inputDiv" style="height: 74px">

                        <text :style="{'font-size': GLOBAL.bigFS, 'color': '#999'}" class="jumpSize" style="margin-right: 15px;" @click="choiceGoods">请选择</text>
                        <!--<text :style="{'font-size': GLOBAL.biggerFS, 'color': GLOBAL.dColor}">重新选择</text>-->
                        <wxc-icon name="more" :icon-style="iconStyle"></wxc-icon>
                    </div>
                    <div class="goodsAdd" ref="goodsAdd">
                        <text class="goodsAddText" @click="openCustomShow">自定义商品</text>
                        <text class="goodsAddText" @click="goToFools">已有商品</text>
                    </div>
                </div>
                <div class="betweenDiv">
                    <text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor,flex:'0.4'}">团购原价</text>
                    <div class="inputDiv" >
                        <input :style="{'font-size': GLOBAL.bigFS, 'placeholder-color': '#999', 'color': GLOBAL.dColor}" class="input"  v-model="marketPrice" disabled="true" type="number" placeholder="请先选择商品"/>
                        <text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor}">元</text>
                    </div>
                </div>
                <div class="betweenDiv">
                    <text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor,flex:'0.4'}">团购总价</text>
                    <div class="inputDiv">
                        <input :style="GLOBAL.inputText" class="input" v-model="shopPrice" type="number" ref="inputTwo" @focus="allFocus(0)" @blur="allBlur" placeholder="请输入团购总价"/>
                        <text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor}">元</text>
                    </div>
                </div>

                <div class="contentSwitch" @touchstart="touchstart">
                    <div class="protocol">
                        <text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor}">库存数量无限</text>
                    </div>
                    <div ref="test2Stock" :style="{backgroundColor:backgroundColorStock}" :class="[startSwitchStock==false?'close':'open']"
                         style="justify-content: center;padding-left: 1px;"
                         @click="billStock">
                        <div ref="test1Stock" :class="[startSwitchStock==false?'isClose':'isOpen']"></div>
                    </div>
                </div>
                <div class="betweenDiv" v-if="!startSwitchStock">
                    <text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor,flex:'0.4'}">库存数量</text>
                    <div class="inputDiv">
                        <input :style="GLOBAL.inputText" class="input" v-model="goodsStock" type="number" ref="inputThree" @focus="allFocus(1)" @blur="allBlur" placeholder="请输入库存数量"/>
                        <text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor}">份</text>
                    </div>
                </div>

            </div>
            <div style="margin-top: 20px;">
                <div class="betweenDiv" style="background-color: #ffffff" v-for="(items,indexs) in goodsSet" :key="indexs">
                    <div style="flex-direction: row;align-items: center">
                        <text :style="{fontSize: GLOBAL.bigFS, color: '#999'}" style="margin-right: 20px;">{{indexs+1}}</text>
                        <text :style="{fontSize: GLOBAL.bigFS, color: '#999'}" class="goodsSet_goodsName" style="flex: 1">{{items.goodsName}}</text>
                    </div>

                    <div style="flex-direction: row;align-items: center">
                        <div class="picturesDiv" @click="del(indexs)">
                            <image class="pictures" src="https://image.aftdc.com/images/sub.png"></image>
                        </div>
                        <input :style="GLOBAL.inputText" ref="inputFour" style="width: 80px;text-align: center" type="number" disabled="true" @change="onchange" @focus="catIndex(indexs)" @blur="allBlur" v-model="items.num" />
                        <div class="picturesDiv" @click="add(indexs)">
                            <image class="pictures" src="https://image.aftdc.com/images/add.png"></image>
                        </div>
                        <text :style="{fontSize: GLOBAL.bigFS, color: '#4ed465'}">份</text>
                    </div>
                </div>


                <div class="betweenDiv" style="background-color: #ffffff" v-for="(items,indexs) in customShopsList">
                    <div style="flex-direction: row;align-items: center;flex:11">
                        <text :style="{fontSize: GLOBAL.bigFS, color: '#999'}" style="margin-right: 20px;">{{goodsSet.length+indexs+1}}</text>
                        <text class="goodsName" :style="{fontSize: GLOBAL.bigFS, color: '#999'}">{{items.goodsName}}（{{items.numAndSpe}}）</text>
                    </div>
                    <div style="flex:6;flex-direction: row;align-items:center;justify-content: space-between">
                        <text :style="{fontSize: GLOBAL.bigFS, color: '#999'}">￥{{Number(items.shopPrice).toFixed(2)}}</text>
                        <image class="pictures" style="margin-top: 10px;margin-bottom: 10px;" src="https://image.aftdc.com/images/sub.png" @click="delPictures(indexs)"></image>
                        <!--<div class="delBtn">-->
                        <!--<div class="delBtnIn"></div>-->
                        <!--</div>-->
                    </div>
                </div>



            </div>
            <div class="contentClassfly" @touchstart="touchstart">
                <div class="betweenDiv">
                    <div>
                        <text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor}">上传图片</text>
                        <text :style="{'font-size': GLOBAL.defaultFS, 'color': '#999'}">图片需要小于2m</text>
                    </div>
                    <div>
                        <image class="picture" :src="imgSrc" @click="selectImg"></image>
                    </div>
                </div>
            </div>
            <div class="contentSwitchs" @touchstart="touchstart">
                <div>
                    <text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor}" style="padding-bottom: 20px;">备注信息</text>
                </div>
                <div>
                    <textarea class="describe" ref="inputFive" v-model="groupDes"  @focus="allFocus" @blur="allBlur" maxlength="250" placeholder="备注一下你的团购活动吧(非必填,最多250字)"></textarea>
                </div>

            </div>

            <div class="contentSwitchs" @touchstart="touchstart">

                <div>
                    <text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor}" style="padding-bottom: 20px;">使用规则</text>
                </div>

                <div class="row" style="padding-bottom: 15px;" @click="appointmentClick">
                    <text class="notext" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">无需预约,消费高峰时可能需要等位</text>
                    <image class="useIcon" :src="appointment?'https://image.aftdc.com/appBimg/ic_check_box_checked.png':'https://image.aftdc.com/appBimg/ic_check_box_normal.png'"></image>
                </div>

                <div class="row" v-if="!appointment" style="margin-bottom: 10px;">
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">预约时间:</text>
                </div>
                <div class="row" v-if="!appointment" style="margin-bottom: 20px;">
                    <text class="appointmentText" :class="[item.select?'selectAppointment':'']" @click="appoinSelect(index)" v-for="(item,index) in appointmentList" :key="index" :style="{fontSize:GLOBAL.defaultFS,color:item.select?'#fff':'#999'}">{{item.text}}</text>
                </div>

                <div class="row" style="margin-top: 10px;">
                    <input type="text" class="ruleInput" placeholder="输入使用规则" maxlength="200" ref="inputFive" v-model="rule" :style="GLOBAL.inputText"  @focus="allFocus" @blur="allBlur"/>
                    <text class="addRule" :class="[rule.length>1?'addRuleActive':'']" @click="addRuleClick">添加</text>
                    <!--<image class="addIcon" src="https://image.aftdc.com/appBimg/add.png" ></image>-->
                </div>
                <div class="ruleLabel">
                    <div class="row ruleLabelDiv" v-for="(item,index) in ruleList" :key="index" :style="{marginTop:index!=0?'15px':''}" >
                        <text class="ruleText" :style="{fontSize:GLOBAL.defaultFS,color:'#fff'}">{{item.text}}</text>
                        <image class="pictures" src="https://image.aftdc.com/images/sub.png" @click="ruleLabelClick(index)"></image>
                    </div>
                    <text v-if="ruleList.length<=0" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">请添加使用规则</text>
                </div>

            </div>

            <div class="contentSwitch" @touchstart="touchstart">
                <div class="protocol">
                    <text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor}">已阅读并同意</text>
                    <text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.tColor}">《商家自营销协议》</text>
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
        <!--<div class=" activeButton" v-if="inputFocus">-->
        <!--<wxc-button class="cancelButton" text="取消"  :btnStyle="GLOBAL.smCancelButton" :textStyle="GLOBAL.cancelButtonText"-->
        <!--@wxcButtonClicked="backClick"></wxc-button>-->
        <!--<wxc-button class="saveButton" text="创建团购活动" :textStyle="GLOBAL.buttonText" :btnStyle="GLOBAL.smDefaultButton"-->
        <!--@wxcButtonClicked="save"></wxc-button>-->
        <!--</div>-->

        <wxc-mask height="550"
                  width="600"
                  border-radius="8"
                  duration="200"
                  mask-bg-color="#FFFFFF"
                  :has-animation="true"
                  :has-overlay="true"
                  :show-close="false"
                  :show="customShow"
                  @wxcMaskSetHidden="customHidden">
            <div class="customContent" @click.stop="">
                <text class="customTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">自定义商品</text>
                <div class="fillIn">
                    <div class="fillInLeft">
                        <text class="leftText" :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor}">名        称：</text>
                        <text class="leftText" :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor}">单        价：</text>
                        <text class="leftText" :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor}">数量/规格：</text>
                    </div>
                    <div class="fillInRight">
                        <input class="fillInInput" type="text" :style="GLOBAL.inputText"  @focus="allFocus" @blur="allBlur" v-model="customShops.goodsName" maxlength="20" placeholder="限20字以内">
                        <input class="fillInInput" type="number" :style="GLOBAL.inputText" @focus="allFocus" @blur="allBlur" maxlength="8" v-model="customShops.shopPrice" placeholder="请填写价格">
                        <input class="fillInInput" type="text" :style="GLOBAL.inputText" @focus="allFocus" @blur="allBlur" maxlength="20" v-model="customShops.numAndSpe" placeholder="例如：1份/50g">
                    </div>

                </div>
                <div class="customBtn">
                    <text class="customBtnStyle customBtnCan" :style="{fontSize:GLOBAL.bigFS}" @click="customHidden">取消</text>
                    <text class="customBtnStyle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor}" @click="customDetermine">确定</text>
                </div>
            </div>
        </wxc-mask>

        <toast ref="toast"></toast>
        <!--<div class="useDatadiv" @click="" :style="{left:useLeft}" ref="useTost">-->
        <!--<div class="useData">-->
        <!--<div class="useDiv" v-for="(item,index) in useDataList" :key="index" :style="{marginTop:index!=0?'25px':''}" @click="usePickClick(index)">-->
        <!--<text :style="{fontSize: GLOBAL.defaultFS, color: GLOBAL.dColor}">{{item.text}}</text>-->
        <!--<image class="useIcon" :src="item.select?'https://image.aftdc.com/appBimg/ic_check_box_checked.png':'https://image.aftdc.com/appBimg/ic_check_box_normal.png'"></image>-->

        <!--</div>-->

        <!--<div class="useBottom">-->
        <!--<text class="usetext" :style="{fontSize: GLOBAL.defaultFS, color:'#999'}" @click="useCancelClick">取消</text>-->
        <!--<text class="usetext" :style="{fontSize: GLOBAL.defaultFS, color: GLOBAL.tColor}" @click="useConfirmClick">确认</text>-->
        <!--</div>-->
        <!--</div>-->
        <!--</div>-->

    </div>
</template>

<script>
    import {WxcButton, WxcDialog, WxcIcon, WxcMinibar,WxcMask } from 'weex-ui'
    import Toast from './Toast.vue'
    const event = weex.requireModule('event');
    const post = weex.requireModule('stream');
    const navigator = weex.requireModule('navigator');
    const animation = weex.requireModule('animation');
    const dom = weex.requireModule('dom')
    const modal = weex.requireModule('modal')
    export default {
        components: {WxcButton, WxcDialog, Toast, WxcIcon, WxcMinibar,WxcMask },
        data() {
            return {
                customShow: false,//自定义商品弹出层
                customShops: {
                    goodsName: '',
                    shopPrice: '',
                    numAndSpe: ''
                },
                customShopsList: [],

                visibility:'hidden',
                backImgToggle: 0,//头部返回图片判断
                backShow: false,
                isOn: true,

                startSwitch: true,//switch一开始的状态
                backgroundColor:'',//动画背景色
                prevent:true,//阻止多次点击绿色按钮

                startSwitchStock: true,//switch一开始的状态
                backgroundColorStock:'',//动画背景色
                preventStock:true,//阻止多次点击绿色按钮

                touch:false,

                radio: 0,//0为普通领取，1为分享领取
                minDate: '',
                iconStyle: {
                    fontSize: '28px'
                },
                startTime: '',
                endTime: '',

                smallStart:'',
                smallEnd:'',
                dataList:[],//使用时间

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
                ],
                useLeft:'-750px',


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


                groupName: '',
                shopPrice: '',
                groupDes: '',
                goodsStock:'',//库存数量
                index: '',
                indexCode: 0,
                marketPrice: '',
                // goodsSet: [{'goodsId':309, 'shopPrice': 13.00, 'goodsName':'酸菜牛肉面', 'num':1},{'goodsId':286, 'shopPrice': 15.00, 'goodsName':'黄焖鸡', 'num':2}],  //团购商品json
                goodsSet:[],
                opinionImg:'',
                imgSrc:'https://image.aftdc.com/appBimg/icon_add_image.png',
                token: '',
                imei: '',
                pageBack: false,
                timeIndex:'',
                useIndex:'',
                inputFocus:true,
                blurPrevent:false,//阻止多次失去焦点的定时器
                blurPreventSec:false,
                preventRepeatedClicks:false,//阻止重复点击
            }

        },
        created() {
            var that = this
            this.visibility='hidden';
            this.token = weex.config.token;
            this.imei = weex.config.imei;
            var param  = JSON.parse(weex.config.param)
            for(var i = 0;i < param.length; i++){
                that.dataList.push({start:param[i].serviceStartTime,end:param[i].serviceEndTime})
            }

            var now = new Date();
            var startTime = now.getFullYear() + "-" + ((now.getMonth() + 1) < 10 ? "0" : "") + (now.getMonth() + 1) + "-" + (now.getDate() < 10 ? "0" : "") + now.getDate();
            var endTime = (now.getFullYear() + 1) + "-" + ((now.getMonth() + 1) < 10 ? "0" : "") + (now.getMonth() + 1) + "-" + (now.getDate() < 10 ? "0" : "") + now.getDate();
            var time = startTime
            that.minDate = time
            that.startTime = startTime
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
                        // var startime=that.dataList[that.dataList.length-1].start.split(':');
                        // var start=Number(startime[0])*60+Number(startime[1]);
                        //
                        // var endtime=e.time.split(':');
                        // var end=Number(endtime[0])*60+Number(endtime[1]);
                        //
                        // if(end<=start){
                        //     const toast = this.$refs.toast;
                        //     toast.editContent('结束时间大于开始时间');
                        //     return false;
                        // }
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
            /* 自定义商品 */
            customHidden () {
                this.customShow = false;
            },
            openCustomShow (e) {
                this.customShow = true;
            },
            customDetermine() {
                const toast = this.$refs.toast;
                if(this.customShops.goodsName===''){
                    toast.editContent('未填写商品名称');
                }else if(this.customShops.shopPrice==='') {
                    toast.editContent('未填写商品价格');
                }else if(this.customShops.numAndSpe==='') {
                    toast.editContent('未填写商品数量/规格');
                }else{
                    this.customShow = false;
                    var customShops = JSON.parse(JSON.stringify(this.customShops))
                    this.customShopsList.push(customShops)
                    this.customShops.goodsName = ''
                    this.customShops.shopPrice = ''
                    this.customShops.numAndSpe = ''
                    this.setMarketPrice()
                }
            },
            delPictures(indexs){
                this.customShopsList.splice(indexs,1)
                this.setMarketPrice()
            },




            ruleLabelClick(index){
                var that = this;
                that.ruleList.splice(index,1)
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

                that.appointmentList[index].select=true;
            },

            clearLabelClick(index){
                this.dataList.splice(index,1)

            },
            addClick(){
                var that = this;
                if(that.smallStart==''||that.smallEnd==''){
                    const toast = that.$refs.toast;
                    toast.editContent('时间设置不完善');
                    return false;
                }
                // if(that.dataList.length>=3){
                //     const toast = that.$refs.toast;
                //     toast.editContent('最多可添加三个时间段');
                //     return false;
                // }
                if(that.smallStart!=''&&that.smallEnd!=''){
                    that.dataList.push({start:that.smallStart,end:that.smallEnd})
                    that.smallStart='';
                    that.smallEnd='';
                    // modal.toast({
                    //     message:that.dataList
                    // })
                }
            },
            chooseTime(timeIndex) {
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

            useConfirmClick(){
                this.useData='';
                this.dataShow=false;
                var length=0;
                for(var i=this.useDataList.length-1;i>=0;i--){
                    if(this.useDataList[i].select){
                        length=i;
                        break;
                    }
                }
                for (var i in this.useDataList){
                    if(this.useDataList[i].select){
                        this.useData=this.useData+this.useDataList[i].text+(i!=length?',':'')
                    }
                }
            },

            useCancelClick(){
                this.dataShow=false;
            },

            usePickClick(index){
                if(this.useDataList[index].select){
                    this.useDataList[index].select=false
                }
                else{
                    this.useDataList[index].select=true
                }
            },
            move () {
                var testEl = this.$refs.useTost;
                animation.transition(testEl, {
                    styles: {
                        opacity:1
                    },
                    duration: 500, //ms
                    timingFunction: 'ease',
                    delay: 0 //ms
                })
            },
            clearMove(){
                var that=this;
                var testEl = this.$refs.useTost;
                animation.transition(testEl, {
                    styles: {
                        opacity:0
                    },
                    duration: 500, //ms
                    timingFunction: 'ease',
                    delay: 0 //ms
                })
                setTimeout(function () {
                    that.useLeft='-750'
                },500)
            },
            choiceGoods(){
                var goodsAdd = this.$refs.goodsAdd;
                animation.transition(goodsAdd, {
                    styles: {
                        transform: 'translateX(0)',
                    },
                    duration: 200, //ms
                    timingFunction: 'ease',
                    delay: 0 //ms
                })
            },
            //跳转到商品选择页面
            goToFools() {
                var that=this;
                var param = '';
                var url = 'http://assets/foodsMultiSelect.js';
                var goodsSet= that.goodsSet;

                event.save('localShop',goodsSet);
                event.toUrl({"url": url, "param": param});
            },
            //选择图片
            selectImg:function () {
                event.chooseImg(1,1);
            },
            //上传图片
            uploadImg(opinionImg,localPart){
                var param = this.GLOBAL.sign(this.token,this.imei);
                post.fetch({
                    method: 'post',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/businessapp/Goods/uploadOss',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                },function(res){
                    var waterMarkStr = '';
                    event.uploadImg(res.data.AccessKeyId,res.data.AccessKeySecret,res.data.SecurityToken,opinionImg,localPart,waterMarkStr);
                })
            },
            //计算团购原价格
            setMarketPrice() {
                var that = this;
                that.marketPrice = 0.00;
                var prices = 0.00;
                for (var i = 0; i < that.goodsSet.length; i++) {
                    prices += parseFloat(that.goodsSet[i]['shopPrice']) * Number(that.goodsSet[i]['num']);
                }
                for (var i = 0,len = that.customShopsList.length;i < len;i++){
                    prices += parseFloat(that.customShopsList[i]['shopPrice'])
                }
                that.marketPrice = prices.toFixed(2);
            },
            //获取修改份数商品的序号
            catIndex(index) {
                var that = this;
                if (that.indexCode === 0) {
                    that.index = index;
                    that.indexCode = 1;
                }
                that.inputFocus=false;
                if(that.blurPrevent){
                    that.blurPreventSec=true;
                }
                else{
                    that.blurPreventSec=false;
                }
                // that.blurPreventSec=true;
                setTimeout(function () {
                    that.blurPrevent = true;
                },60)
                setTimeout(function () {
                    that.blurPreventSec=false;
                },120)

            },
            //获得份数改变的值
            onchange: function (event) {
                var that = this;
                var index = that.index;
                var num = event.value;
                if (num === '' || num == null) {
                    num = 0;
                }
                if (!isNaN(num)) {
                    //保存份数
                    that.goodsSet[index]['num'] = Number(num);
                    //调用计算团购总价的方法
                    this.setMarketPrice();
                    that.indexCode = 0;
                } else {
                    const toast = this.$refs.toast;
                    toast.editContent('输入的份数有误！');
                    return false;
                }
            },

            //监听选择商品页面返回
            viewdisappear() {
                let self = this;
                self.pageBack = true;
            },
            viewappear() {
                let self = this;
                if (!self.pageBack) {
                    return;
                }
                self.pageBack = false;
                var param = event.find('checkboxList');//获取商品选择页面保存的数据
                if (param) {
                    param = JSON.parse(param);
                    var that = this;
                    that.goodsSet=[];
                    //循环得到goodsName 和 shopPrice
                    for (var i = 0; i < param.length; i++) {
                        var groupGoods = {};
                        groupGoods['id'] =  param[i]['id'];
                        groupGoods['goodsId'] = param[i]['goodsId'];
                        groupGoods['shopPrice'] = param[i]['shopPrice'];
                        groupGoods['goodsName'] = param[i]['goodsName'];
                        groupGoods['goodsImg'] = param[i]['goodsImg'];
                        // groupGoods['goodsStock'] = param[i]['goodsStock'];
                        groupGoods['attr'] = param[i]['attr'];
                        groupGoods['boxFee'] = param[i]['boxFee'];
                        groupGoods['marketPrice'] = param[i]['marketPrice'];
                        groupGoods['num'] =  param[i]['num'];
                        that.goodsSet.push(groupGoods);
                    }
                    //调用计算团购总价的方法
                    that.setMarketPrice();
                    //删除选择商品页面保存的数据
                    event.delete('checkboxList');
                }
                if (event.find("localImg")) {
                    // var index=this.articleIndex;
                    var localPart = event.find("localImg");
                    self.imgSrc = localPart;
                    var opinionImg = 'shops/'+event.find('shopId')+'/opinionImg/'+Date.parse(new Date())+'.jpg';
                    self.opinionImg = opinionImg;
                    // this.article[index].localPart = localPart;
                    // this.article[index].articleImg = articleImg;
                    self.uploadImg(opinionImg,localPart);
                    event.delete("localImg");
                }
            },

            radioClick(index) {
                var that = this;
                that.radio = index
            },
            //返回上一页
            backClick() {
                navigator.pop({animated: 'true'});
            },
            wxcMaskSetHidden(){
                var that=this;
                that.dataShow=false;
            },
            minibarRightButtonClick(){},
            save: function () {
                var that = this;

                const toast = that.$refs.toast
                if (!that.groupName) {
                    toast.editContent('未填写团购名称');
                    return false
                }
                if(!that.endTime){
                    toast.editContent('未设置结束日期');
                    return false
                }
                // if(!that.useData){
                //     toast.editContent('请设置不可用日期');
                //     return false
                // }
                if(that.dataList.length < 1){
                    toast.editContent('未添加使用时间');
                    return false
                }
                if(that.goodsSet.length + that.customShopsList.length < 1){
                    toast.editContent('请至少选择一样商品');
                    return false
                }
                if (!that.shopPrice) {
                    toast.editContent('未填写总价');
                    return false
                }
                if (Number(that.marketPrice) < Number(that.shopPrice)) {
                    toast.editContent('团购价大于原价');
                    return false
                }
                if(!that.goodsStock){
                    toast.editContent('未填写库存数量');
                    return false
                }
                if(!that.startSwitchStock&&that.goodsStock<1){
                    toast.editContent('库存数量不得小于1');
                    return false
                }
                if (!that.opinionImg) {
                    toast.editContent('请选择图片');
                    return false
                }
                // if(!that.groupDes){
                //     toast.editContent('请添加备注信息');
                //     return false
                // }
                if(!that.appointment){
                    var num=0;
                    for(var i in that.appointmentList){
                        if(that.appointmentList[i].select){
                            num+=1;
                        }
                    }
                    if(num==0){
                        toast.editContent('请选择无需预约或预约时间');
                        return false
                    }
                }
                if (this.rule !== ''){
                    toast.editContent('请添加输入的规则');
                    return false
                }
                // if(that.ruleList==''){
                //     toast.editContent('请添加活动规则');
                //     return false
                // }
                if (!that.isOn) {
                    toast.editContent('请阅读并同意协议');
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
                // modal.toast({
                //     message:{useData:that.useData,dataList:that.dataList,subscribeTime:that.subscribeTime,ruleList:that.ruleList},
                //     duration:10
                //
                // })
                //获取token和sign
                var param = this.GLOBAL.sign(this.token, this.imei);
                param += '&groupName=' + that.groupName;
                param += '&startTime=' + that.startTime;
                param += '&endTime=' + that.endTime;
                param += '&useData=' + that.useData;//使用日期
                param += '&dataList=' + JSON.stringify(that.dataList);//使用时间
                param += '&shopPrice=' + that.shopPrice;
                param += '&marketPrice=' + that.marketPrice;
                param += '&groupDes=' + that.groupDes;
                param += '&subscribeTime=' + that.subscribeTime;//预约
                param += '&ruleList=' + JSON.stringify(that.ruleList);//规则
                param += '&groupImg=' + that.opinionImg;
                param += '&goodsSet=' + JSON.stringify(that.goodsSet);
                param += '&goodsStock=' + that.goodsStock;
                param += '&customGoodsList=' + JSON.stringify(that.customShopsList);
                if(that.preventRepeatedClicks){
                    return false
                }
                that.preventRepeatedClicks=true
                /*获取上传的图片对象*/
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    url: 'https://www.aftdc.com/businessapp/Activity/argainTuan',
                }, function (e) {
                    if (e.data.res === -2) {
                        //跳到登陆页面
                        that.GLOBAL.toLogin()
                    }
                    else {
                        if (e.data.res === 1) {
                            const toast = that.$refs.toast;
                            toast.editContent('创建成功');
                            setTimeout(() => navigator.pop({animated: 'true'}), 2000);
                        }
                        else {
                            if (e.data.msg) toast.editContent(e.data.msg);
                            else toast.editContent('网络出错');
                        }
                    }
                    that.preventRepeatedClicks=false
                })
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
            startTimeChange(event) {
                var that = this
                that.startTime = event.value
            },
            endTimeChange(event) {
                var that = this
                that.endTime = event.value
            },
            del: function (index) {
                var that=this;
                var num=Number(that.goodsSet[index].num);
                //删除
                if(num>1){
                    that.goodsSet[index].num=num-1
                }
                else{
                    that.goodsSet.splice(index, 1);
                }

                //调用计算团购总价的方法
                that.setMarketPrice();
                that.blur();
            },
            add:function(index){
                var that=this;
                var num=Number(that.goodsSet[index].num);
                //删除
                that.goodsSet[index].num= num+1
                //调用计算团购总价的方法
                that.setMarketPrice();
                that.blur();
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
                // that.blurPreventSec=true;
                setTimeout(function () {
                    that.blurPrevent = true;
                },80)
                setTimeout(function () {
                    that.blurPreventSec=false;
                },320)
                if(toggle==0){
                    that.$refs.inputTwo.setTextFormatter({
                        formatRule: "/(\\.\\d{2})(\\S+)/",
                        formatReplace: "$1",
                        recoverRule: "/\\s+/g",
                        recoverReplace: ""
                    })
                }else if(toggle==1){
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
            blur(){
                this.$refs.inputOne.blur();
                this.$refs.inputTwo.blur();
                if(!startSwitchStock){
                    this.$refs.inputThree.blur();
                }
                this.$refs.inputFour.blur();
                this.$refs.inputFive.blur();
                this.$refs.inputSix.blur();
            },
            touchstart(){
                this.blur();
            },
            touchmove(){
                this.touch=true;
            },
            touchend(){
                this.touch=false;
            },
            scrollMove(){
                if(this.touch){
                    this.blur();
                }
            },

        },
        mounted() {
            var that = this;
            that.visibility='visible';
            that.startSwitch=!that.startSwitch
            that.bill()
            that.startSwitchStock=!that.startSwitchStock
            that.billStock()


        },
    }
</script>

<style scoped>
    .goodsAdd {
        flex-direction: row;
        background-color: #fff;
        position: absolute;
        top: 20px;
        right: 20px;
        transform: translateX(400px);

    }
    .goodsAddText {
        font-size: 26px;
        padding-top: 16px;
        padding-bottom: 16px;
        padding-left: 20px;
        padding-right: 20px;
        border-radius: 14px;
        margin-left: 20px;
        color: #919191;
        border-color: #8d8d8d;
        border-width: 1px;
        border-style: solid;
    }
    .customContent {
        flex: 1;
        padding-top: 40px;
        padding-left: 20px;
        padding-right: 20px;
    }
    .customTitle {
        text-align: center;
        margin-bottom: 40px;
    }
    .fillIn {
        flex-direction: row;
    }
    .fillInLeft {
        flex: 3;
        /*align-items: flex-end;*/
    }
    .leftText {
        height: 80px;
        line-height: 80px;
        margin-bottom: 20px;
    }
    .fillInRight {
        flex: 8;
    }
    .fillInInput {
        height: 80px;
        margin-bottom: 20px;
    }
    .customBtn {
        width: 600px;
        height: 90px;
        flex-direction: row;
        position: absolute;
        left: 0;
        bottom: 0;
        border-top-width: 1px;
        border-top-style: solid;
        border-top-color: #e8e8e8;
    }
    .customBtnStyle {
        flex: 1;
        line-height: 90px;
        text-align: center;
    }
    .customBtnCan {
        color: #888;
        border-right-width: 1px;
        border-right-style: solid;
        border-right-color: #e8e8e8;
    }
    .delBtn {
        width: 34px;
        height: 34px;
        background-color: red;
        border-radius: 50px;
        /*margin-right: 48px;*/
        margin-top: 10px;
        margin-bottom: 10px;
    }
    .delBtnIn {
        background-color: #fff;
        width: 18px;
        height: 2px;
        position: absolute;
        top: 16px;
        left: 8px;
        border-radius: 10px;
    }
    .goodsName {
        max-width: 400px;
        lines: 1;
        text-overflow: ellipsis;
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



    .userIconSmallSelect{
        width: 25px;
        height: 25px;
        background-color: #53beb7;
        border-radius: 30px;
    }
    .useIconSmall{
        width: 25px;
        height: 25px;
        background-color: #fff;
        border-radius: 30px;

    }
    .userIconSelect{
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-style: solid;
        border-width: 3px;
        border-color: #53beb7;
        border-radius: 30px;
    }
    .useIcon{
        width: 35px;
        height: 35px;
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
    .selectAppointment{
        border-color: #53beb7;
        background-color: #53beb7;

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
    .useIndex{
        /*border-bottom-style: solid;*/
        /*border-bottom-width: 2px;*/
        /*border-bottom-color: #dedede;*/
        /*margin-top: 25px;*/
    }
    .useData{
        background-color: #fff;
        /*padding-top: 20px;*/
        padding-bottom: 20px;
        padding-left: 20px;
        padding-right: 20px;
    }
    .useDatadiv{
        position: absolute;
        width: 750px;
        top: 0;
        bottom: 0;
        background-color: rgba(0,0,0,0.5);
        align-items: center;
        justify-content: center;
        opacity: 0;
    }
    .useBottom{
        width: 600px;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
        margin-top: 25px;
    }
    .usetext{
        padding-top: 10px;
        padding-bottom: 10px;
        padding-left: 30px;
        padding-right: 30px;
    }
    .wrapper {
        flex-direction: column;
        background-color: #f8f8f8;
    }

    .content {
        flex-direction: column;
        width: 750px;
        flex: 1;
    }
    .activeButton{
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
    .contentClassfly {
        flex-direction: column;
        margin-top: 20px;
        background-color: #fff;
    }

    .jumpSize {
        flex: 1;
        margin-right: 10px;
        text-align: right;
    }

    .picture {
        width: 100px;
        height: 100px;
        margin-right: 20px;
    }
    .pictures{
        width: 40px;
        height: 40px;
    }
    .picturesDiv{
        width: 80px;
        height: 40px;
        padding-left: 20px;
        padding-right: 20px;
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
    .betweenspcel{
        flex-direction: row;
        align-items: center;
        padding-top: 20px;
        padding-left: 20px;
        padding-right: 20px;
        padding-bottom: 20px;
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
    .row{
        flex-direction: row;
        align-items: center;
    }
    .input {
        text-align: right;
        flex: 1;
        margin-right: 10px;
    }
    /*.input:active {*/
    /*placeholder-color: #666;*/
    /*}*/
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
    .inputDiv {
        flex-direction: row;
        align-items: center;
        flex: 1;
        justify-content: flex-end;
    }

    .contentSwitch {
        flex-direction: row;
        margin-top: 20px;
        background-color: #fff;
        padding-top: 20px;
        padding-left: 20px;
        padding-right: 20px;
        padding-bottom: 20px;
        margin-bottom: 20px;
        justify-content: space-between;
        align-items: center;
    }

    .contentSwitchs {
        margin-top: 20px;
        background-color: #fff;
        padding-top: 20px;
        padding-left: 20px;
        padding-right: 20px;
        padding-bottom: 20px;
    }
    .notext{
        /*padding-top: 15px;*/
        /*padding-bottom: 15px;*/
        margin-right: 20px;
    }

    .protocol {
        flex-direction: row;
        align-items: center;
    }

    .protocolColor {
        color: #53beb7;
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
    .ruleInput{
        flex: 1;
        margin-right: 14px;
    }
    .cancelButton:active{
        background-color: #f1f1f1;
    }
    .saveButton:active{
        background-color: #57aba5;
    }
    .cancelButton:enabled{
        background-color: #fff;
    }
    .saveButton:enabled{
        background-color: #53beb7;
    }
    .blank{
        position: absolute;
        width: 750px;
        bottom: 0;
        top: 0;
    }
    /***********************/
    .goodsSet_goodsName{
        max-width: 390px;
        lines:1;
        text-overflow: ellipsis;
    }
</style>
