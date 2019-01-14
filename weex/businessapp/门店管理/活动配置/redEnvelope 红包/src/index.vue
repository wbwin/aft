<template>
    <div class="wrapper" @touchstart="loseBlur" :style="{visibility: visibility}">

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
                <text :style="GLOBAL.headerCenter"  slot="middle">商家红包</text>
                <text :style="GLOBAL.headerRight"  slot="right">保存</text>
            </wxc-minibar>
        </div>

        <scroller class="content">
            <div class="contentClassfly">
                <div class="betweenDiv">
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">开始日期</text>
                    <div class="inputDiv" @click="chooseTime(1)">
                        <!--<input class="input" v-model="startTime" :min="minDate" @change="startTimeChange($event)" type="date" placeholder="未设置" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}"/>-->
                        <text  :style="{'font-size': GLOBAL.bigFS, 'placeholder-color': '#999', 'color': startTime==''?'#999':GLOBAL.dColor,marginRight:'10px'}">{{startTime==''?'未设置':startTime}}</text>
                        <wxc-icon name="more" :icon-style="iconStyle"></wxc-icon>
                    </div>
                </div>
                <div class="betweenDiv">
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">结束日期</text>
                    <div class="inputDiv" @click="chooseTime(0)">
                        <!--<input class="input" :min="startTime" @change="endTimeChange($event)" type="date" placeholder="未设置" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}"/>-->
                        <text  :style="{'font-size': GLOBAL.bigFS, 'placeholder-color': '#999', 'color':endTime==''?'#999':GLOBAL.dColor,marginRight:'10px'}">{{endTime==''?'未设置':endTime}}</text>
                        <wxc-icon name="more" :icon-style="iconStyle"></wxc-icon>
                    </div>
                </div>
            </div>

            <div class="contentClassfly">
                <div class="betweenDiv">
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">红包金额</text>
                    <div class="inputDiv">
                        <input class="input" ref="firInput" @focus="allFocus" @blur="allBlur"  v-model="couponMoney" type="text" placeholder="请输入红包金额" :style="GLOBAL.inputText" style="margin-left: 70px"/>
                        <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">元</text>
                    </div>
                </div>
                <div class="betweenDiv">
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">使用条件</text>
                    <div class="inputDiv">
                        <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">订单满</text>
                        <input class="input inputWidth" ref="secInput" @focus="allFocus" @blur="allBlur" :style="GLOBAL.inputText" type="text" style="margin-left: 10px" v-model="spendMoney" placeholder="请输入金额" />
                        <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">元</text>
                    </div>
                </div>
            </div>


            <div class="contentSwitch">
                <div class="protocol">
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">已阅读并同意</text>
                    <text class="protocolColor" :style="{fontSize:GLOBAL.bigFS}">《商家自营销协议》</text>
                </div>
                <div ref="test2" :class="[startSwitch==false?'close':'open']"
                     style="justify-content: center;padding-left: 1px;"
                     @click="bill">
                    <div ref="test1" :class="[startSwitch==false?'isClose':'isOpen']"></div>
                </div>
            </div>
        </scroller>


        <!--<div class=" enterButton" v-if="!inputFocus">-->
            <!--<wxc-button class="okButtonTwo" text="取消" :textStyle="GLOBAL.cancelButtonText" :btnStyle="GLOBAL.smCancelButton"-->
                        <!--@wxcButtonClicked="minibarLeftButtonClick"></wxc-button>-->
            <!--<wxc-button class="okButton" text="保存" :textStyle="GLOBAL.buttonText" :btnStyle="GLOBAL.smDefaultButton"-->
                        <!--@wxcButtonClicked="save"></wxc-button>-->
        <!--</div>-->
        <div class="blank" :style="{left:blankLeft}" @click="blankClick"></div>
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
                visibility:'hidden',
                btnShow:true,
                backImgToggle: 0,//头部返回图片判断
                backShow: false,
                isOn: true,
                startSwitch: true,//switch一开始的状态
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
                spendMoney:'',
                couponMoney:'',
                token:'',
                imei:'',
                timeIndex:'',
                inputFocus:false,
                blurPrevent:true,//阻止多次失去焦点的定时器
                blankLeft:'750px',
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
        mounted(){
            var that=this
            that.visibility='visible';
            that.$refs.firInput.setTextFormatter({
                formatRule: "/(\\.\\d{2})(\\S+)/",
                formatReplace: "$1",
                recoverRule: "/\\./g",
                recoverReplace: ""
            })
            that.$refs.secInput.setTextFormatter({
                formatRule: "/(\\.\\d{2})(\\S+)/",
                formatReplace: "$1",
                recoverRule: "/\\./g",
                recoverReplace: ""
            })
        },
        methods: {
            chooseTime( timeIndex) {
                this.$refs.firInput.focus();
                this.$refs.firInput.blur();
                var that = this;
                that.timeIndex = timeIndex;
                event.chooseTime(true, true, true, false, false, false)
            },
            save:function(){

                const toast = this.$refs.toast;
                if(!this.endTime) {
                    toast.editContent('请填写结束日期');
                    return false
                }
                if(!this.couponMoney)
                {
                    toast.editContent('请填写红包金额');
                    return false
                }
                if(!this.spendMoney)
                {
                    toast.editContent('请填写使用条件');
                    return false
                }
                if(Number(this.spendMoney) < Number(this.couponMoney))
                {
                    toast.editContent('红包金额大于使用条件金额');
                    return false
                }
                if(!this.isOn) {
                    toast.editContent('请阅读并同意协议');
                    return false
                }
                //获取token和sign
                var param = this.GLOBAL.sign(this.token,this.imei);
                var that = this;
                param+= '&timez='+that.startTime;
                param+= '&timey='+that.endTime;
                param+= '&fullMoney='+that.spendMoney;
                param+= '&redEnvelopeMoney='+that.couponMoney;
                if(this.preventRepeatedClicks){
                    return false
                }
                this.preventRepeatedClicks=true
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    url: 'https://www.aftdc.com/businessapp/Activity/HongBao',
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
                var that = this
                if (that.isOn == false) {

                    var testEl = this.$refs.test1;
                    var testE2 = this.$refs.test2;
                    if (that.startSwitch == true) {
                        var transform = 'translate(0px, 0px)';
                    } else {
                        var transform = 'translate(52px, 0px)';
                    }
                    animation.transition(testEl, {
                        styles: {
                            transform: transform,
                        },
                        duration: 500, //ms
                        timingFunction: 'ease',
                        delay: 0 //ms
                    });
                    animation.transition(testE2, {
                        styles: {
                            backgroundColor: '#4ed465',
                        },
                        duration: 500, //ms
                        timingFunction: 'ease',
                        delay: 0 //ms
                    });
                    that.isOn = !that.isOn;
                    that.goodsStock = -1;
                } else {

                    var testEl = this.$refs.test1;
                    var testE2 = this.$refs.test2;
                    if (that.startSwitch == true) {
                        var transform = 'translate(-52px, 0px)';
                    } else {
                        var transform = 'translate(0px, 0px)';
                    }
                    animation.transition(testEl, {
                        styles: {
                            transform: transform,
                        },
                        duration: 500, //ms
                        timingFunction: 'ease',
                        delay: 0 //ms
                    })
                    animation.transition(testE2, {
                        styles: {
                            backgroundColor: '#e2e2e2',
                        },
                        duration: 500, //ms
                        timingFunction: 'ease',
                        delay: 0 //ms
                    })
                    that.isOn = !that.isOn
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
                var that=this
                that.inputFocus=true
                that.blankLeft='0px';
            },
            allBlur(){
                var that=this;
                that.blankLeft='750px';
                if(that.blurPrevent) {
                    that.blurPrevent = false;
                    setTimeout(function () {
                        that.inputFocus = false;
                        that.blurPrevent=true;
                    }, 150)
                }
            },
            blankClick(){
                this.$refs.firInput.blur();
                this.$refs.secInput.blur();
                // this.$refs.thrInput.blur();
                this.blankLeft='750px';
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
    .okButton:active {
        background-color: #53beb7;
    }
    .okButtonTwo:active {
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

    .input {
        text-align: right;
        flex: 1;
        margin-right: 10px;
        margin-left: 100px;
        placeholder-color: #999;
    }
    .inputWidth{
        flex: 0;
        width: 190px;
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
        left: 52px;
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
