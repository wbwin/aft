<template>
    <div class="wrapper" @viewappear="viewappear" @viewdisappear="viewdisappear" @touchmove="touchmove" @touchend="touchend" :style="{visibility: visibility}">

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
                <text :style="GLOBAL.headerCenter"  slot="middle">秒杀活动</text>
            </wxc-minibar>
        </div>

        <scroller class="content" @scroll="scrollMove">
            <div class="contentClassfly">
                <div class="betweenDiv">
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">开始日期</text>
                    <div class="inputDiv" @click="chooseTime(1)">
                        <!--<input class="input" :style="GLOBAL.inputText" v-model="startTime" :min="minDate" @change="startTimeChange($event)" type="date" placeholder="未设置" />-->
                        <text  :style="{'font-size': GLOBAL.bigFS, 'placeholder-color': '#999', 'color': startTime==''?'#999':GLOBAL.dColor,marginRight:'10px'}">{{startTime==''?'未设置':startTime}}</text>
                        <image class="inputIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                    </div>
                </div>
                <div class="betweenDiv">
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">结束日期</text>
                    <div class="inputDiv" @click="chooseTime(0)">
                        <!--<input class="input" :min="startTime" @change="endTimeChange($event)" type="date" placeholder="未设置" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}"/>-->
                        <text  :style="{'font-size': GLOBAL.bigFS, 'placeholder-color': '#999', 'color':endTime==''?'#999':GLOBAL.dColor,marginRight:'10px'}">{{endTime==''?'未设置':endTime}}</text>
                        <image class="inputIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                    </div>
                </div>
                <div class="betweenDiv">
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">开始时间</text>
                    <div class="inputDiv" @click="chooseTime(3)">
                        <!--<input class="input" :style="GLOBAL.inputText" v-model="startTime" :min="minDate" @change="startTimeChange($event)" type="date" placeholder="未设置" />-->
                        <text  :style="{'font-size': GLOBAL.bigFS, 'placeholder-color': '#999', 'color': todayStartTime==''?'#999':GLOBAL.dColor,marginRight:'10px'}">{{todayStartTime==''?'未设置':todayStartTime}}</text>
                        <image class="inputIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                    </div>
                </div>
                <div class="betweenDiv">
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">结束时间</text>
                    <div class="inputDiv" @click="chooseTime(2)">
                        <!--<input class="input" :min="startTime" @change="endTimeChange($event)" type="date" placeholder="未设置" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}"/>-->
                        <text  :style="{'font-size': GLOBAL.bigFS, 'placeholder-color': '#999', 'color':todayEndTime==''?'#999':GLOBAL.dColor,marginRight:'10px'}">{{todayEndTime==''?'未设置':todayEndTime}}</text>
                        <image class="inputIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                    </div>
                </div>
            </div>


            <div class="contentClassfly">
                <div class="betweenDiv">
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">选择商品</text>
                    <div class="inputDiv">
                        <text class="jumpSize" :class="[goodsName === '' ? '' : 'goodsNameColor']" @click="selectGoods" :style="{fontSize:GLOBAL.bigFS}">{{goodsName === '' ? '未选择' : goodsName}}</text>
                        <image class="inputIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                    </div>
                </div>
                <div class="betweenDiv">
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">商品原价</text>
                    <div class="inputDiv">
                        <input class="input" type="text" v-model="shopPrice" disabled="true" placeholder="请先选择商品" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}"/>
                        <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">元</text>
                    </div>
                </div>
                <div class="betweenDiv">
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">秒杀价格</text>
                    <div class="inputDiv">
                        <input class="input" type="number" ref="firInput" :style="GLOBAL.inputText" v-model="skillPrice" placeholder="请输入秒杀价格"  @focus="allFocus" @blur="allBlur"/>
                        <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">元</text>
                    </div>
                </div>
                <!--<div class="betweenDiv">-->
                <!--<text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">限购数量无限</text>-->
                <!--<div ref="test2Two" :style="{backgroundColor:backgroundColorTwoTwo}" :class="[startSwitchTwo==false?'close':'open']"-->
                <!--style="justify-content: center;padding-left: 1px;"-->
                <!--@click="billTwo">-->
                <!--<div ref="test1Two" :class="[startSwitchTwo==false?'isClose':'isOpen']"></div>-->
                <!--</div>-->
                <!--</div>-->
                <div class="betweenDiv" >
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">限购数量</text>
                    <div class="inputDiv">
                        <input class="input" type="number" ref="secInput" :style="GLOBAL.inputText" v-model="buyNum" placeholder="限购数量最多可填10份"  @focus="allFocus" @blur="allBlur"/>
                        <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">份</text>
                    </div>
                </div>

                <!--库存-->
                <!--<div class="contentSwitch">-->
                <!--<div class="protocol">-->
                <!--<text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">库存</text>-->
                <!--</div>-->

                <!--<div ref="test2Stock" :style="{backgroundColor:backgroundColorStock}" :class="[startSwitchStock==false?'close':'open']"-->
                <!--style="justify-content: center;padding-left: 1px;"-->
                <!--@click="billStock">-->
                <!--<div ref="test1Stock" :class="[startSwitchStock==false?'isClose':'isOpen']"></div>-->
                <!--</div>-->
                <!--</div>-->
                <div class="betweenDiv" v-if="!startSwitchStock">
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">商品总库存</text>
                    <div class="inputDiv">
                        <input class="input" type="number" ref="stockInput" :style="GLOBAL.inputText" v-model="goodsStock" placeholder="请输入商品活动的库存"  @focus="allFocus" @blur="allBlur"/>
                        <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">份</text>
                    </div>
                </div>
            </div>


            <div class="contentSwitch">
                <div class="protocol">
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">已阅读并同意</text>
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor}">《商家自营销协议》</text>
                </div>

                <div ref="test2" :style="{backgroundColor:backgroundColorTwo}" :class="[startSwitch==false?'close':'open']"
                     style="justify-content: center;padding-left: 1px;"
                     @click="bill">
                    <div ref="test1" :class="[startSwitch==false?'isClose':'isOpen']"></div>
                </div>
            </div>

            <!--打印保存的数据-->
            <!--<text style="width: 750px;line-height: 32px;":style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{alldata}}</text>-->

        </scroller>



        <div class=" enterButton" v-if="inputFocus">
            <wxc-button class="okButtonTwo" text="取消" :textStyle="GLOBAL.cancelButtonText" :btnStyle="GLOBAL.smCancelButton"
                        @wxcButtonClicked="minibarLeftButtonClick"></wxc-button>
            <wxc-button class="okButton" text="保存" :textStyle="GLOBAL.buttonText" :btnStyle="GLOBAL.smDefaultButton"
                        @wxcButtonClicked="save"></wxc-button>
        </div>
        <toast ref="toast"></toast>
    </div>
</template>

<script>
    import {WxcButton, WxcDialog, WxcIcon,WxcMinibar} from 'weex-ui'
    import Toast from './Toast.vue'
    const animation = weex.requireModule('animation')
    const event = weex.requireModule('event')
    const post = weex.requireModule('stream');
    const navigator = weex.requireModule('navigator')

    export default {
        components: {WxcButton, WxcDialog, Toast, WxcIcon,WxcMinibar},
        data () {
            return {
                // alldata:'',//保存的数据
                visibility:'hidden',
                startSwitch: true,//switch一开始的状态
                backgroundColorTwo:'',//动画背景色
                prevent:true,//阻止多次点击绿色按钮

                startSwitchTwo: false,//switch一开始的状态
                backgroundColorTwoTwo:'',//动画背景色
                preventTwo:true,//阻止多次点击绿色按钮

                // 库存
                startSwitchStock: false,//switch一开始的状态
                backgroundColorStock:'',//动画背景色
                preventStock:true,//阻止多次点击绿色按钮

                btnShow:true,
                backImgToggle: 0,//头部返回图片判断
                backShow: false,
                isOn: true,
                marketPrice: '',
                radio: 0,//0为普通领取，1为分享领取
                minDate: '',
                iconStyle: {
                    fontSize: '30px'
                },
                goodsStock: '',//库存
                buyNum:1,//限购数
                skillPrice: '',  //秒杀价格
                startTime: '',//开始日期
                endTime:'',
                todayStartTime:'',//开始时间
                todayEndTime:'',
                goodsName:'',
                shopPrice:'',
                goodsId:'',
                goodsImg: '',
                attr: '',
                guigeAttr:'',
                boxFee: '',
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
                // disId:[566706,1054,552],  //团购商品json
                token:'',
                imei:'',
                pageBack:false,
                timeIndex:'',
                touch:false,//用于获取焦点和失去焦点的兼容
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
            // var time = startTime
            // that.minDate = time
            that.startTime = startTime;
            event.init();
            weex.requireModule('globalEvent').addEventListener('chooseTime', function (e) {

                if (that.timeIndex == 1) {
                    that.startTime=e.time
                }
                else if(that.timeIndex == 0) {
                    that.endTime=e.time
                }
                else if(that.timeIndex == 3){
                    that.todayStartTime=e.time
                }
                else if(that.timeIndex == 2){
                    that.todayEndTime=e.time
                }

            })
        },
        methods: {
            chooseTime(timeIndex) {
                this.blur()
                // this.$refs.firInput.focus();
                // this.$refs.firInput.blur();
                var that = this;
                that.timeIndex = timeIndex;
                if(timeIndex==0||timeIndex==1){
                    event.chooseTime(true, true, true, false, false, false)
                }
                else if(timeIndex==2||timeIndex==3){
                    event.chooseTime(false, false, false, true, true, false)
                }
            },

            save:function(){
                const toast = this.$refs.toast;
                if(!this.endTime)
                {
                    toast.editContent('请选择结束日期');
                    return false
                }
                if(!this.todayStartTime)
                {
                    toast.editContent('请选择开始时间');
                    return false
                }
                if(!this.todayEndTime)
                {
                    toast.editContent('请选择结束时间');
                    return false
                }
                if(!this.goodsName)
                {
                    toast.editContent('请选择秒杀商品');
                    return false
                }
                if(!this.skillPrice)
                {
                    toast.editContent('请填写秒杀价');
                    return false
                }
                if (Number(this.shopPrice) < Number(this.skillPrice)) {
                    toast.editContent('秒杀价大于原价');
                    return false
                }
                if(!this.buyNum)
                {
                    toast.editContent('请填写限购量');
                    return false
                }
                if(this.buyNum <1||this.buyNum>10)
                {
                    toast.editContent('限购量不合法');
                    return false
                }
                if(!this.goodsStock)
                {
                    toast.editContent('请填写库存');
                    return false
                }
                if(!this.startSwitchStock&&this.goodsStock<1){
                    toast.editContent('库存数量不能小于1!');
                    return false
                }

                if(!this.startSwitch) {
                    toast.editContent('请阅读并同意协议');
                    return false
                }
                //获取token和sign
                var param = this.GLOBAL.sign(this.token,this.imei);
                var that = this;
                param += '&startTime='+that.startTime;//日期
                param += '&endTime='+that.endTime;//日期
                param += '&todayStartTime='+that.todayStartTime;//时间
                param += '&todayEndTime='+that.todayEndTime;//时间

                param += '&skillPrice='+that.skillPrice;
                // param += '&disId='+JSON.stringify(that.disId)
                param += '&goodsStock='+that.goodsStock;//商品总库存
                param += '&buyNum='+that.buyNum;//限购数量

                param+= '&boxFee=' +that.boxFee;
                param+= '&marketPrice=' +that.marketPrice;
                param+= '&goodsName='+that.goodsName;
                param+= '&goodsId='+that.goodsId;
                param+= '&shopPrice='+that.shopPrice;
                param+= '&attr=' +that.attr;
                param+= '&guigeAttr=' +that.guigeAttr;
                param+= '&goodsImg=' +that.goodsImg;

                // this.alldata=param;
                /*获取上传的图片对象*/
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    url: 'https://www.aftdc.com/businessapp/Activity/argainMiaon',
                }, function (e) {
                    // this.alldata=param;
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
                })
            },
            radioClick(index) {
                var that = this;
                that.radio = index
            },
            //返回上一页
            minibarLeftButtonClick() {
                navigator.pop({ animated: 'true' });
            },

            //跳转到商品选择页面
            selectGoods() {
                this.blur()
                var param = '';
                var url='http://assets/choiceGoods.js';
                event.toUrl({ "url": url, "param": param });
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
                    that.guigeAttr = param['guigeAttr'];
                    that.boxFee = param['boxFee'];
                    that.marketPrice = param['marketPrice'];

                    //删除选择商品页面保存的数据
                    event.delete('param');

                }
            },

            bill: function () {
                this.blur()
                if(this.prevent){
                    this.prevent=false;


                    var that = this
                    if (that.startSwitch) {

                        // 解决兼容star
                        setTimeout(function () {
                            that.backgroundColorTwo='#e2e2e2'
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
                            that.backgroundColorTwo='#4ed465'
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
                            that.backgroundColorTwo='#4ed465'
                        })
                        that.startSwitch=true;
                    }

                }
            },
            billTwo: function () {
                this.blur()
                if(this.preventTwo){
                    this.preventTwo=false;


                    var that = this
                    if (that.startSwitchTwo) {

                        // 解决兼容star
                        setTimeout(function () {
                            that.backgroundColorTwoTwo='#e2e2e2'
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
                        that.buyNum=1;
                    } else {

                        // 解决兼容star
                        setTimeout(function () {
                            that.backgroundColorTwoTwo='#4ed465'
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
                            that.backgroundColorTwoTwo='#4ed465'
                        })
                        that.startSwitchTwo=true;
                        that.buyNum=-1;
                    }

                }
            },
            billStock(){
                this.blur()
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

                that.$refs.firInput.blur()
                if(!that.startSwitchTwo){
                    that.$refs.secInput.blur()
                }
                if(!that.startSwitchStock){
                    that.$refs.stockInput.blur();
                }



            },
        },
        mounted() {
            var that = this;
            that.visibility='visible';
            that.startSwitch=!that.startSwitch
            that.bill();
            //
            // that.startSwitchTwo=!that.startSwitchTwo
            // that.billTwo()
            //
            // that.startSwitchStock=!that.startSwitchStock
            // that.billStock()
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
    .wrapper {
        flex-direction: column;
        background-color: #f8f8f8;
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
        text-align: right;
        width: 450px;
        margin-right: 10px;
        placeholder-color: #999;
    }



    .inputIcon{
        width: 20px;
        height: 20px;
    }

    .inputDiv {
        flex-direction: row;
        align-items: center;
        flex: 1;
        justify-content: flex-end;
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
    .jumpSize {
        color: #999;
        flex: 1;
        margin-right: 10px;
        text-align: right;
    }
    .goodsNameColor {
        color: #333;
    }
    .jumpSize:active {
        color: #333;
    }
    .jumpSize:enabled{
        color: #999;
    }
    .blank{
        position: absolute;
        width: 750px;
        bottom: 0;
        top: 0;
    }
    /***********************/
</style>
