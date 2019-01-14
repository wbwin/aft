<template>
    <div @viewappear="viewappear" @viewdisappear="viewdisappear" class="wrapper" @touchmove="touchmove" @touchend="touchend" :style="{visibility: visibility}">
        <wxc-minibar
                background-color="#53beb7"
                text-color="#fff"
                @wxcMinibarLeftButtonClicked="backClick"
                @wxcMinibarRightButtonClicked="minibarRightButtonClick"
                v-once
        >
            <image :style="GLOBAL.headerImg"  slot="left"
                   src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
            <text :style="GLOBAL.headerCenter"  slot="middle">砍价活动</text>
            <text :style="GLOBAL.headerRight"  slot="right"></text>
        </wxc-minibar>
        <scroller class="content">
            <div class="contentClassfly" @touchstart="touchstart">

                <div class="betweenDiv">
                    <text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor,flex:0.4}">开始日期</text>
                    <div class="inputDiv" @click="chooseTime(1)">
                        <!--<input :style="{'font-size': GLOBAL.bigFS, 'placeholder-color': '#999', 'color': GLOBAL.dColor}" class="input" v-model="startTime" :min="minDate" @change="startTimeChange($event)" type="date" placeholder="未设置"/>-->
                        <text  :style="{'font-size': GLOBAL.bigFS, 'placeholder-color': '#999', 'color': startTime==''?'#999':GLOBAL.dColor,marginRight:'10px'}">{{startTime==''?'未设置':startTime}}</text>
                        <wxc-icon name="more" :icon-style="iconStyle"></wxc-icon>
                    </div>
                </div>
                <div class="betweenDiv">
                    <text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor,flex:0.4}">结束日期</text>
                    <div class="inputDiv" @click="chooseTime(0)">
                        <!--<input :style="{'font-size': GLOBAL.bigFS, 'placeholder-color': '#999', 'color': GLOBAL.dColor}" class="input" v-model="endTime" :min="startTime" @change="endTimeChange($event)" type="date" placeholder="未设置"/>-->
                        <text  :style="{'font-size': GLOBAL.bigFS, 'placeholder-color': '#999', 'color':endTime==''?'#999':GLOBAL.dColor,marginRight:'10px'}">{{endTime==''?'未设置':endTime}}</text>
                        <wxc-icon name="more" :icon-style="iconStyle"></wxc-icon>
                    </div>
                </div>
            </div>


            <div class="contentClassfly">
                <div class="betweenDiv" @touchstart="touchstart">
                    <text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor,flex:0.4}">选择商品</text>
                    <div class="inputDiv">
                        <text :style="{'font-size': GLOBAL.bigFS, 'color': '#999'}" class="jumpSize" :class="[goodsName == ''?'':'goodsNameColor']" @click="selectGoods">{{goodsName == ''?'请选择':goodsName}}</text>
                        <wxc-icon name="more" :icon-style="iconStyle"></wxc-icon>
                    </div>
                </div>
                <div class="betweenDiv" @touchstart="touchstart">
                    <text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor,flex:0.4}">商品原价</text>
                    <div class="inputDiv">
                        <input :style="{'font-size': GLOBAL.bigFS, 'placeholder-color': '#999', 'color': GLOBAL.dColor}" class="input" type="text" disabled="true" v-model="shopPrice" placeholder="请先选择商品"/>
                        <text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor}">元</text>
                    </div>
                </div>
                <div class="betweenDiv">
                    <text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor,flex:0.4}">最低价格</text>
                    <div class="inputDiv">
                        <input :style="GLOBAL.inputText" class="input" ref="firInput" type="number" v-model="minPrice" @focus="allFocus" @blur="allBlur" placeholder="请先输入砍价最低价格"/>
                        <text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor}">元</text>
                    </div>
                </div>
                <div class="betweenDiv">
                    <text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor,flex:0.4}">砍价成功次数</text>
                    <div class="inputDiv">
                        <input :style="GLOBAL.inputText" class="input" ref="secInput" type="number" v-model="bargainNumb" @focus="allFocus" @blur="allBlur" placeholder="用户砍价成功需要的次数"/>
                        <text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor}">次</text>
                    </div>
                </div>
                <!--<div class="betweenDiv" >-->
                <!--<text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor,flex:0.4}">限优惠数量</text>-->
                <!--<div class="inputDiv">-->
                <!--<input class="input" type="number" ref="inputThree" :style="GLOBAL.inputText" v-model="buyNum" placeholder="限优惠数量最多可填10份"  @focus="allFocus" @blur="allBlur"/>-->
                <!--<text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">份</text>-->
                <!--</div>-->
                <!--</div>-->
                <!--库存-->
                <div class="contentSwitch" @touchstart="touchstart">
                    <div class="protocol">
                        <text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor}">库存无限</text>
                    </div>
                    <div ref="test2Stock" :style="{backgroundColor:backgroundColorStock}" :class="[startSwitchStock==false?'close':'open']"
                         style="justify-content: center;padding-left: 1px;"
                         @click="billStock">
                        <div ref="test1Stock" :class="[startSwitchStock==false?'isClose':'isOpen']"></div>
                    </div>
                </div>



                <div class="betweenDiv" v-if="!startSwitchStock">
                    <text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor,flex:0.4}">库存数量</text>
                    <div class="inputDiv">
                        <input :style="GLOBAL.inputText" class="input" ref="stockInput" type="number" v-model="goodsStock" @focus="allFocus" @blur="allBlur" placeholder="请输入库存数量"/>
                        <text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor}">份</text>
                    </div>
                </div>
            </div>


            <div class="contentSwitch" @touchstart="touchstart">
                <div class="protocol">
                    <text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor}">已阅读并同意</text>
                    <text :style="{'font-size': GLOBAL.bigFS, 'color': '#53beb7'}">《商家自营销协议》</text>
                </div>
                <div ref="test2" :style="{backgroundColor:backgroundColor}" :class="[startSwitch==false?'close':'open']"
                     style="justify-content: center;padding-left: 1px;"
                     @click="bill">
                    <div ref="test1" :class="[startSwitch==false?'isClose':'isOpen']"></div>
                </div>
            </div>
        </scroller>
        <div class=" activeButton" v-if="inputFocus">
            <wxc-button class="cancelButton" text="取消"  :btnStyle="GLOBAL.smCancelButton" :textStyle="GLOBAL.cancelButtonText"
                        @wxcButtonClicked="backClick"></wxc-button>
            <wxc-button class="saveButton" text="保存" :textStyle="GLOBAL.buttonText" :btnStyle="GLOBAL.smDefaultButton"
                        @wxcButtonClicked="saveBar"></wxc-button>
        </div>
        <toast ref="toast"></toast>
    </div>
</template>

<script>
    import {WxcMinibar, WxcButton, WxcDialog, WxcIcon} from 'weex-ui'
    import Toast from './Toast.vue'
    const animation = weex.requireModule('animation');
    const navigator = weex.requireModule('navigator');
    const event = weex.requireModule('event');
    const post = weex.requireModule('stream');
    const dom = weex.requireModule('dom')

    export default {
        components: {WxcMinibar, WxcButton, WxcDialog, Toast, WxcIcon},
        data () {
            return {
                visibility:'hidden',
                backImgToggle: 0,//头部返回图片判断
                backShow: false,
                isOn: true,

                startSwitch: true,//switch一开始的状态
                backgroundColor:'',//动画背景色
                prevent:true,//阻止多次点击绿色按钮

                startSwitchStock: false,//switch一开始的状态
                backgroundColorStock:'',//动画背景色
                preventStock:true,//阻止多次点击绿色按钮

                boxHeight:0,//获取高度解决底部按钮弹起问题

                radio: 0,//0为普通领取，1为分享领取
                minDate: '',
                iconStyle: {
                    fontSize: '28px'
                },
                startTime: '',
                endTime:'',
                goodsName:'',
                shopPrice:'',
                minPrice:'',
                goodsId:'',
                goodsImg: '',
                goodsStock: '',

                buyNum:'1',
                attr: '',
                boxFee: '',
                guigeAttr:'',
                marketPrice: '',
                bargainNumb:'',//砍价成功次数
                token:'',
                imei:'',
                pageBack:false,
                timeIndex:'',
                inputFocus:true,
                blurPrevent:false,//阻止多次失去焦点的定时器
                blurPreventSec:false,

            }

        },
        created() {
            this.visibility='hidden';
            this.token = weex.config.token
            this.imei = weex.config.imei
            var that = this
            var now = new Date();
            var startTime = now.getFullYear() + "-" + ((now.getMonth() + 1) < 10 ? "0" : "") + (now.getMonth() + 1) + "-" + (now.getDate() < 10 ? "0" : "") + now.getDate();
            var endTime = (now.getFullYear() + 1) + "-" + ((now.getMonth() + 1) < 10 ? "0" : "") + (now.getMonth() + 1) + "-" + (now.getDate() < 10 ? "0" : "") + now.getDate();
            var time = startTime;
            that.minDate = time;
            that.startTime = startTime;
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
            radioClick(index) {
                var that = this;
                that.radio = index
            },
            //跳转到商品选择页面
            selectGoods() {
                var param = '';
                var url='http://assets/choiceGoods.js';
                event.toUrl({ "url": url, "param": param });
            },
            //返回上一页
            backClick() {
                navigator.pop({ animated: 'true' });
            },
            minibarRightButtonClick(){},
            //保存砍价活动
            saveBar() {
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
                //判断商品最低价已填
                if(!this.minPrice) {
                    toast.editContent('商品最低价格还没有填写');
                    return false
                }
                //判断商品最低价已填
                if(parseFloat(this.minPrice) > parseFloat(this.shopPrice)) {
                    toast.editContent('最低价大于原价！');
                    return false
                }
                //判断砍价成功次数已填且大于0
                if(this.bargainNumb<=0||!this.bargainNumb){
                    toast.editContent('砍价成功次数需大于0次!');
                    return false
                }
                if(!this.goodsStock) {
                    toast.editContent('请填写库存');
                    return false
                }
                if(!this.startSwitchStock&&this.goodsStock<1){
                    toast.editContent('库存数量需大于0');
                    return false
                }
                // if(!this.buyNum)
                // {
                //     toast.editContent('请填写限优惠量');
                //     return false
                // }
                // if(this.buyNum <1||this.buyNum>10)
                // {
                //     toast.editContent('限优惠量不合法');
                //     return false
                // }
                //判断是否已同意协议
                if(!this.startSwitch) {
                    toast.editContent('请阅读并同意协议');
                    return false
                }

                var that = this;
                //获取token和sign
                var param = this.GLOBAL.sign(this.token,this.imei);
                param+= '&goodsName='+that.goodsName;
                param+= '&startTime='+that.startTime;
                param+= '&endTime='+that.endTime;
                param+= '&shopPrice='+that.shopPrice;
                param+= '&minPrice='+that.minPrice;
                param+= '&goodsId=' +that.goodsId;
                param+= '&goodsImg=' +that.goodsImg;
                param+= '&goodsStock=' +that.goodsStock;
                // param+= '&buyNum=' +that.buyNum;
                param+= '&attr=' +that.attr;
                param+= '&guigeAttr=' +that.guigeAttr;
                param+= '&boxFee=' +that.boxFee;
                param+= '&marketPrice=' +that.marketPrice;
                param+= '&bargainNumb=' +that.bargainNumb;//砍价成功次数
                console.log('log---'+param)
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    url: 'https://www.aftdc.com/businessapp/Activity/argain',
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
                            toast.editContent('创建成功');
                            setTimeout(()=>navigator.pop({ animated: 'true' }),2000);
                        }
                        else {
                            if (e.data.msg) toast.editContent(e.data.msg);
                            else toast.editContent('网络出错');
                            return false;
                        }
                    }
                })

            },

            bill () {
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

                    param = JSON.parse(param);
                    var that = this;

                    that.goodsId = param['goodsId'];
                    that.goodsName = param['goodsName'];
                    that.shopPrice = param['shopPrice'];
                    that.goodsImg = param['goodsImg'];
                    // that.goodsStock = param['goodsStock'];
                    that.attr = param['attr'];
                    that.boxFee = param['boxFee'];
                    that.guigeAttr = param['guigeAttr'];
                    that.marketPrice = param['marketPrice'];

                    //删除选择商品页面保存的数据
                    event.delete('param');

                }
            },
            // input的获取焦点和失去焦点
            touchstart(){
                this.$refs.firInput.blur();
                this.$refs.secInput.blur();
                if(!startSwitchStock){
                    this.$refs.stockInput.blur();
                }

            },
            //键盘弹起后点击其他地方收起键盘
            allFocus(){
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
            that.startSwitchStock=!that.startSwitchStock
            that.billStock()
        },
    }
</script>

<style scoped>
    .wrapper {
        flex-direction: column;
        background-color: #f8f8f8;
    }
    .content {
        width: 750px;
        flex: 1;
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
    .input {
        /*margin-left: 100px;*/
        text-align: right;
        flex: 1;
        placeholder-color:'#999';
        margin-right: 10px;
    }
    /*.input:active {*/
    /*placeholder-color: #666;*/
    /*}*/
    .inputDiv {
        flex-direction: row;
        align-items: center;
        flex: 1;
        justify-content: flex-end;
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
    .jumpSize {
        flex: 1;
        margin-right: 10px;
        text-align: right;
    }
    .goodsNameColor{
        color: #666;
    }
    .blank{
        position: absolute;
        width: 750px;
        bottom: 0;
        top: 0;
    }
    /*****************/
</style>
