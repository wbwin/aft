<template>
    <div class="wrapper" @viewappear="viewappear" @viewdisappear="viewdisappear" :style="{visibility: visibility}">
        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="backClick"
                    @wxcMinibarRightButtonClicked="saveDisc"
                    v-once
            >
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">折扣活动</text>
                <text :style="GLOBAL.headerRight"  slot="right">保存</text>
            </wxc-minibar>
        </div>
        <scroller class="content">
            <div class="contentClassfly" @touchstart="touchstart">
                <div class="betweenDiv">
                    <text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor,flex:'0.4'}">开始日期</text>
                    <div class="inputDiv" @click="chooseTime(1)">
                        <!--<input class="input" v-model="startTime" :min="minDate" @change="startTimeChange($event)" type="date" placeholder="未设置"/>-->
                        <text  :style="{'font-size': GLOBAL.bigFS, 'placeholder-color': '#999', 'color': startTime==''?'#999':GLOBAL.dColor,marginRight:'10px'}">{{startTime==''?'未设置':startTime}}</text>
                        <wxc-icon name="more" :icon-style="iconStyle"></wxc-icon>
                    </div>
                </div>
                <div class="betweenDiv">
                    <text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor,flex:'0.4'}">结束日期</text>
                    <div class="inputDiv" @click="chooseTime(0)">
                        <!--<input class="input" v-model="endTime" :min="startTime" @change="endTimeChange($event)" type="date" placeholder="未设置"/>-->
                        <text  :style="{'font-size': GLOBAL.bigFS, 'placeholder-color': '#999', 'color':endTime==''?'#999':GLOBAL.dColor,marginRight:'10px'}">{{endTime==''?'未设置':endTime}}</text>
                        <wxc-icon name="more" :icon-style="iconStyle"></wxc-icon>
                    </div>
                </div>
            </div>
            <div class="contentClassfly">
                <div class="betweenDiv" @touchstart="touchstart">
                    <text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor,flex:'0.4'}">选择商品</text>
                    <div class="inputDiv">
                        <text class=" jumpSize" :style="{'font-size': GLOBAL.bigFS, 'color': goodsName == '' ?'#999':GLOBAL.dColor}" :class="[goodsName == '' ? '' : 'goodsNameColor']" @click="selectGoods">{{goodsName == '' ? '未选择' : goodsName}}</text>
                        <wxc-icon name="more" :icon-style="iconStyle"></wxc-icon>
                    </div>
                </div>
                <div class="betweenDiv" @touchstart="touchstart">
                    <text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor,flex:'0.4'}">商品原价</text>
                    <div class="inputDiv">
                        <input class="input" v-model="shopPrice" type="text" disabled="true" placeholder="请先选择商品"/>
                        <wxc-icon name="more" :icon-style="iconStyle"></wxc-icon>
                    </div>
                </div>
                <!--库存-->
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
                <div class="betweenDiv" v-if="startSwitchStock==false">
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor,flex:'0.4'}">库存数量</text>
                    <div class="inputDiv">
                        <input class="input" type="number" ref="inputOne" :style="GLOBAL.inputText" v-model="goodsStock" placeholder="请填写库存数量"  @focus="allFocus(0)" @blur="allBlur"/>
                        <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">份</text>
                    </div>
                </div>

            </div>
            <div class="contentClassfly">
                <div class="betweenDiv" @touchstart="touchstart">
                    <text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor,flex:'0.4'}">价格设置方式</text>
                    <div class="inputDiv">
                        <text @click="pick" :style="{'font-size': GLOBAL.bigFS, 'color': pickSuccess!==-1?GLOBAL.dColor:'#999'}" :class="[pickSuccess!==''?'pickSuccess':'']">{{classify}}</text>
                        <wxc-icon name="more" :icon-style="iconStyle"></wxc-icon>
                    </div>
                </div>
                <div class="betweenDiv">
                    <text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor,flex:'0.4'}">活动力度</text>
                    <text class="jumpSize" :style="{'font-size': GLOBAL.bigFS, 'color': '#999'}" v-if="pickSuccess===-1">未选择价格设置方式</text>
                    <div class="inputDiv" v-if="pickSuccess===0">

                        <input class="input" :style="GLOBAL.inputText"  type="number" ref="inputTwo" @focus="allFocus(1)" @blur="allBlur" v-model="zheKou" placeholder="请输入0~10折"/>
                        <text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor}">折</text>
                    </div>
                    <div class="inputDiv" v-if="pickSuccess===1">

                        <input class="input" :style="GLOBAL.inputText" type="number" ref="inputTwo" @focus="allFocus(1)" @blur="allBlur" v-model="youHuiPrice" placeholder="请输入优惠后的价格"/>
                        <text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor}">元</text>
                    </div>
                </div>

                <!--<div class="contentSwitch" @touchstart="touchstart">-->
                <!--<div class="protocol">-->
                <!--<text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor}">限优惠数量无限</text>-->
                <!--</div>-->
                <!--<div ref="test2Two" :style="{backgroundColor:backgroundColorTwo}" :class="[startSwitchTwo==false?'close':'open']"-->
                <!--style="justify-content: center;padding-left: 1px;"-->
                <!--@click="billTwo">-->
                <!--<div ref="test1Two" :class="[startSwitchTwo==false?'isClose':'isOpen']"></div>-->
                <!--</div>-->
                <!--</div>-->
                <div class="betweenDiv" v-if="startSwitchTwo==false">
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor,flex:'0.4'}">限优惠数量</text>
                    <div class="inputDiv">
                        <input class="input" type="number" ref="inputThree" :style="GLOBAL.inputText" v-model="buyNum" placeholder="限优惠数量最多可填10份"  @focus="allFocus" @blur="allBlur"/>
                        <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">份</text>
                    </div>
                </div>

            </div>
            <div class="contentSwitch" @touchstart="touchstart">
                <div class="protocol">
                    <text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor}">已阅读并同意</text>
                    <text  :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.tColor}">《商家自营销协议》</text>
                </div>
                <div ref="test2" :style="{backgroundColor:backgroundColor}" :class="[startSwitch==false?'close':'open']"
                     style="justify-content: center;padding-left: 1px;"
                     @click="bill">
                    <div ref="test1" :class="[startSwitch==false?'isClose':'isOpen']"></div>
                </div>
            </div>
        </scroller>
        <!--<div class=" activeButton" v-if="inputFocus">-->
            <!--<wxc-button class="cancelButton" text="取消"  :btnStyle="GLOBAL.smCancelButton" :textStyle="GLOBAL.cancelButtonText"-->
                        <!--@wxcButtonClicked="backClick"></wxc-button>-->
            <!--<wxc-button class="saveButton" text="保存" :textStyle="GLOBAL.buttonText" :btnStyle="GLOBAL.smDefaultButton"-->
                        <!--@wxcButtonClicked="saveDisc"></wxc-button>-->
        <!--</div>-->
        <!--<div class="blank" :style="{left:blankLeft}" @click="blankClick"></div>-->
        <toast ref="toast"></toast>
    </div>
</template>

<script>
    import {WxcButton, WxcDialog, WxcIcon,WxcMinibar} from 'weex-ui'
    import Toast from './Toast.vue'

    const modal = weex.requireModule('modal');
    const picker = weex.requireModule('picker')
    const animation = weex.requireModule('animation')
    const navigator = weex.requireModule('navigator');
    const event = weex.requireModule('event');
    const post = weex.requireModule('stream');
    const dom = weex.requireModule('dom')

    export default {
        components: {WxcButton, WxcDialog, Toast, WxcIcon,WxcMinibar},
        data() {
            return {
                visibility:'hidden',
                // 协议按钮
                startSwitch: true,//switch一开始的状态
                backgroundColor:'',//动画背景色
                prevent:true,//阻止多次点击绿色按钮

                startSwitchStock: true,//switch一开始的状态
                backgroundColorStock:'',//动画背景色
                preventStock:true,//阻止多次点击绿色按钮


                // 限购按钮
                startSwitchTwo: false,//switch一开始的状态
                backgroundColorTwo:'',//动画背景色
                preventTwo:true,//阻止多次点击绿色按钮

                boxHeight:0,//页面高度\解决底部按钮弹起问题

                backImgToggle: 0,//头部返回图片判断
                backShow: false,
                minDate: '',
                iconStyle: {
                    fontSize: '30px'
                },
                startTime: '',
                endTime:'',
                goodsName:'',
                shopPrice:'',
                goodsId:'',
                goodsImg: '',
                goodsStock:'',
                guigeAttr:'',
                buyNum: 1,
                attr: '',
                boxFee: '',
                marketPrice: '',
                classify: '未设置',
                index: 0,
                classifyData: ['折扣', '按优惠后的价格'],
                pickSuccess: -1,
                zheKou: '',
                zheKouPrice:'',
                youHuiPrice:'',
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
                token:'',
                imei:'',
                pageBack:false,
                timeIndex:'',
                inputFocus:true,
                blurPrevent:false,//阻止多次失去焦点的定时器
                blurPreventSec:false,
                preventRepeatedClicks:false,//阻止重复点击
            }
        },
        created() {
            this.visibility='hidden';
            this.token = weex.config.token;
            this.imei = weex.config.imei;

            var that = this
            var now = new Date();
            var startTime = now.getFullYear() + "-" + ((now.getMonth() + 1) < 10 ? "0" : "") + (now.getMonth() + 1) + "-" + (now.getDate() < 10 ? "0" : "") + now.getDate();
            var endTime = (now.getFullYear() + 1) + "-" + ((now.getMonth() + 1) < 10 ? "0" : "") + (now.getMonth() + 1) + "-" + (now.getDate() < 10 ? "0" : "") + now.getDate();
            var time = startTime
            that.min = time
            that.startTime = startTime
            event.init();
            weex.requireModule('globalEvent').addEventListener('chooseTime', function (e) {

                if (that.timeIndex == 1) {
                    that.startTime=e.time
                } else {
                    that.endTime=e.time
                }

            })
        },
        methods: {
            chooseTime( timeIndex) {
                var that = this;
                that.timeIndex = timeIndex;
                event.chooseTime(true, true, true, false, false, false)
            },
            //返回上一页
            backClick() {
                navigator.pop({ animated: 'true' });
            },
            minibarRightButtonClick(){},
            //跳转到商品选择页面
            selectGoods() {
                var param = '';
                var url='http://assets/choiceGoods.js';
                event.toUrl({ "url": url, "param": param });
            },
            //保存折扣活动
            saveDisc() {

                const toast = this.$refs.toast;
                // 判断活动时间是否已选
                if(!this.endTime) {
                    toast.editContent('请填写结束日期');
                    return false
                }
                //判断商品是否已选择
                if(!this.goodsName) {
                    toast.editContent('你还没有选择商品');
                    return false
                }
                //判断商品原价是否已填
                if(!this.shopPrice) {
                    toast.editContent('商品原价还没有获取到');
                    return false
                }
                //判断库存是否填写正确
                if(!this.goodsStock) {
                    toast.editContent('请填写库存数量');
                    return false
                }
                if(!this.startSwitchStock&&this.goodsStock<1) {
                    toast.editContent('库存数量不得小于1');
                    return false
                }
                //判断价格方式是否已选
                if(this.pickSuccess === '') {
                    toast.editContent('商品价格方式还没有选择');
                    return false
                }
                //判断活动力度是否已填
                if(!this.zheKou && !this.youHuiPrice) {
                    toast.editContent('商品活动力度还没有填写');
                    return false
                }
                if(!this.buyNum)
                {
                    toast.editContent('请填写限优惠量');
                    return false
                }
                if(this.buyNum <1||this.buyNum>10)
                {
                    toast.editContent('限优惠量不合法');
                    return false
                }
                //判断是否已同意协议
                if(!this.startSwitch) {
                    toast.editContent('请阅读并同意协议');
                    return false
                }
                var that = this;

                //获取token和sign
                var param = this.GLOBAL.sign(this.token,this.imei);
                //判断价格方式
                if (this.pickSuccess === 0) {
                    var zheKou = that.zheKou;
                    zheKou = parseFloat(zheKou);
                    if (zheKou >= 0.00 && zheKou <= 10.00) {
                        that.zheKouPrice = zheKou * parseFloat(that.shopPrice) / 10;//计算折后价
                        if (parseFloat(that.zheKouPrice) > parseFloat(that.shopPrice)) {
                            toast.editContent('折后价大于原价，数据有误！');
                            return false;
                        }
                        param+= '&discount='+zheKou;
                        param+= '&discountPrice='+'';
                    } else {
                        toast.editContent('折扣不在有效范围！');
                        return false;
                    }
                } else if (this.pickSuccess === 1) {
                    if (parseFloat(that.shopPrice) < parseFloat(that.youHuiPrice)) {
                        toast.editContent('优惠后价大于原价，数据有误！');
                        return false;
                    }
                    param+= '&discount='+0;
                    param+= '&discountPrice='+that.youHuiPrice;
                } else {
                    toast.editContent('数据有误！');
                    return false;
                }
                param+= '&goodsName='+that.goodsName;
                param+= '&goodsId='+that.goodsId;
                param+= '&startTime='+that.startTime;
                param+= '&endTime='+that.endTime;
                param+= '&shopPrice='+that.shopPrice;
                param+= '&attr=' +that.attr;
                param+= '&guigeAttr=' +that.guigeAttr;
                param+= '&goodsImg=' +that.goodsImg;
                param+= '&goodsStock=' +that.goodsStock;
                param+= '&buyNum=' +that.buyNum;
                param+= '&boxFee=' +that.boxFee;
                param+= '&marketPrice=' +that.marketPrice;
                console.log('log---'+param)
                if(this.preventRepeatedClicks){
                    return false
                }
                this.preventRepeatedClicks=true
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    url: 'https://www.aftdc.com/businessapp/Activity/editDiscount',
                }, function (e) {

                    if (e.data.res == -2) {
                        //跳到登陆页面
                        navigator.push({
                            url: "https://image.aftdc.com/images/shop/",
                            animated: 'true'
                        })
                    }
                    else {
                        if (e.data.res === 1) {
                            const toast = that.$refs.toast;
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

            //监听选择商品页面返回
            viewdisappear(){
                let self=this;
                self.pageBack = true;
            },
            viewappear(){
                let self=this;
                if(!self.pageBack){ return; }
                self.pageBack = false;

                var param = event.find('param');//获取商品选择页面保存的数据

                if(param) {
                    console.log('log----'+param)
                    param = JSON.parse(param);
                    var that = this;
                    that.goodsId = param['goodsId'];
                    that.goodsName = param['goodsName'];
                    that.shopPrice = param['shopPrice'];
                    that.goodsImg = param['goodsImg'];
                    // that.goodsStock = param['goodsStock'];
                    that.attr = param['attr'];
                    that.guigeAttr=param['guigeAttr']
                    that.boxFee = param['boxFee'];
                    that.marketPrice = param['marketPrice'];
                    //删除选择商品页面保存的数据
                    event.delete('param');
                }
            },

            pick() {
                picker.pick({
                    index: this.index,
                    items: this.classifyData,
                    confirmTitle: '确认',
                    cancelTitle: '取消',

                }, event => {
                    if (event.result === 'success') {
                        this.classify = this.classifyData[event.data]
                        this.index = event.data;
                        if(this.index === 0){
                            this.pickSuccess = 0;
                        }else if(this.index===1){
                            this.pickSuccess = 1;
                        }
                    }
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
            billTwo: function () {
                if(this.preventTwo){
                    this.preventTwo=false;


                    var that = this
                    if (that.startSwitchTwo) {
                        that.buyNum=1;

                        // 解决兼容star
                        setTimeout(function () {
                            that.backgroundColorTwo='#e2e2e2'
                        },450)
                        // 解决兼容end

                        var testEl = this.$refs.test1Two;
                        var testE2 = this.$refs.test2Two;
                        var transform = 'translate(0px, 0px)';
                        animation.transition(testEl, {
                            styles: {
                                transform: transform,
                            },
                            duration: 500, //ms
                            timingFunction: 'ease',
                            delay: 0 //ms
                        },function () {
                            that.preventTwo=true;
                        })
                        animation.transition(testE2, {
                            styles: {
                                backgroundColor: '#e2e2e2',
                            },
                            duration: 500, //ms
                            timingFunction: 'ease',
                            delay: 0 //ms
                        })
                        that.startSwitchTwo=false;
                    } else {
                        that.buyNum=-1;
                        // 解决兼容star
                        setTimeout(function () {
                            that.backgroundColorTwo='#4ed465'
                        },450)

                        //解决兼容end
                        var testEl = this.$refs.test1Two;
                        var testE2 = this.$refs.test2Two;
                        var transform = 'translate(52px, 0px)';
                        animation.transition(testEl, {
                            styles: {
                                transform: transform,
                            },
                            duration: 500, //ms
                            timingFunction: 'ease',
                            delay: 0 //ms
                        },function () {
                            that.preventTwo=true;
                        })
                        animation.transition(testE2, {
                            styles: {
                                backgroundColor: '#4ed465',
                            },
                            duration: 500, //ms
                            timingFunction: 'ease',
                            delay: 0 //ms
                        },function () {
                            that.backgroundColorTwo='#4ed465'
                        })
                        that.startSwitchTwo=true;
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
                        that.goodsStock='';
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
            //键盘弹起后点击其他地方收起键盘

            touchstart(){
                var that=this;
                if(!startSwitchStock){
                    setTimeout(function () {
                        that.$refs.inputOne.blur();
                    },10)
                }

                setTimeout(function () {
                    that.$refs.inputTwo.blur();
                },15)
                setTimeout(function () {
                    that.$refs.inputThree.blur();
                },20)
            },
            allFocus(toggle){
                var that=this;
                that.inputFocus=false;
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
                if(toggle==0){
                    that.$refs.inputOne.setTextFormatter({
                        formatRule: "/(\\.\\d{2})(\\S+)/",
                        formatReplace: "$1",
                        recoverRule: "/\\./g",
                        recoverReplace: ""
                    })
                }else if(toggle==1){
                    that.$refs.inputTwo.setTextFormatter({
                        formatRule: "/(\\.\\d{2})(\\S+)/",
                        formatReplace: "$1",
                        recoverRule: "/\\s+/g",
                        recoverReplace: ""
                    })
                }


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
                        that.inputFocus=true;
                        that.blurPrevent = false;
                    }
                }, 200)
            },
        },
        mounted() {
            var that = this;
            that.visibility='visible';
            that.startSwitch=!that.startSwitch
            that.bill()

            that.startSwitchTwo=!that.startSwitchTwo
            that.billTwo()

            that.startSwitchStock=!that.startSwitchStock
            that.billStock()
            that.$refs.inputThree.setTextFormatter({
                formatRule: "/(\\.\\d{2})(\\S+)/",
                formatReplace: "$1",
                recoverRule: "/\\./g",
                recoverReplace: ""
            })
        },
    }
</script>

<style scoped>
    .wrapper {
        flex-direction: column;
        background-color: #f8f8f8;
    }

    .content {
        flex-direction: column;
        width: 750px;
        flex: 1;
    }

    .contentClassfly {
        flex-direction: column;
        margin-top: 20px;
        background-color: #fff;

    }

    .defaultSize {
        font-size: 35px;
        color: #333;

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

    .input {

        font-size: 26px;
        text-align: right;
        flex: 1;
        margin-right: 10px;
        placeholder-color: #999;
    }

    /*.input:active {*/
    /*placeholder-color: #333;*/
    /*}*/

    .inputDiv {
        flex-direction: row;
        align-items: center;
        flex: 1;
        justify-content: flex-end;
    }

    .goodsNameColor {
        color: #333;
    }

    .jumpSize {
        color: #999;
        flex: 1;
        margin-right: 10px;
        text-align: right;
    }
    .pickSuccess{
        color: #333;
    }
    /*.jumpSize:active {*/
    /*color: #333;*/
    /*}*/
    .contentSwitch{
        flex-direction: row;
        align-items: center;
        margin-top: 20px;
        background-color: #fff;
        padding-top: 20px;
        padding-left: 20px;
        padding-right: 20px;
        padding-bottom: 20px;
        justify-content: space-between;
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
</style>
