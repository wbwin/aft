<template>
    <div class="wrapper" :style="{visibility: visibility}">

        <!--头部-->
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
                <text :style="GLOBAL.headerCenter"  slot="middle">新客立减</text>
                <text :style="GLOBAL.headerRight"  slot="right">保存</text>
            </wxc-minibar>
        </div>

        <scroller class="content">

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
            <div class="contentClassfly">
                <div class="betweenDiv">
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">新客立减</text>
                    <div class="inputDiv">
                        <input class="input"  type="number" v-model="newCou" placeholder="请输入金额" :style="GLOBAL.inputText" @focus="focus" @blur="blur" ref="inputRef"/>
                        <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">元</text>
                    </div>
                </div>
            </div>
            <div class="contentSwitch">
                <div class="protocol">
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">已阅读并同意</text>
                    <text  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor}">《商家自营销协议》</text>
                </div>
                <div ref="test2" :class="[startSwitch==false?'close':'open']"
                     style="justify-content: center;padding-left: 1px;"
                     @click="bill">
                    <div ref="test1" :class="[startSwitch==false?'isClose':'isOpen']"></div>
                </div>
            </div>
        </scroller>

        <!--<div class=" enterButton" v-if="btnShow">-->
        <!--<wxc-button class="okButtonTwo" text="取消" :textStyle="GLOBAL.cancelButtonText" :btnStyle="GLOBAL.smCancelButton"-->
        <!--@wxcButtonClicked="minibarLeftButtonClick"></wxc-button>-->
        <!--<wxc-button class="okButton" text="保存" :textStyle="GLOBAL.buttonText" :btnStyle="GLOBAL.smDefaultButton"-->
        <!--@wxcButtonClicked="save"></wxc-button>-->
        <!--</div>-->

        <toast ref="toast"></toast>

        <div class="blank" :style="{left:blankLeft}" @click="blankClick"></div>
    </div>
</template>

<script>
    import {WxcButton, WxcDialog, WxcIcon,WxcMinibar} from 'weex-ui'
    import Toast from './Toast.vue'
    const event = weex.requireModule('event')
    const post = weex.requireModule('stream');
    const navigator = weex.requireModule('navigator')
    const animation = weex.requireModule('animation')
    export default {
        components: {WxcButton, WxcDialog, Toast, WxcIcon,WxcMinibar},

        data () {
            return {
                startTime:'',//开始日期
                endTime:'',//结束日期
                iconStyle: {
                    fontSize: '28px'
                },

                visibility:'hidden',
                blurPrevent:true,//阻止多次失去焦点的定时器
                blankLeft:'750px',
                btnShow:true,
                backImgToggle: 0,//头部返回图片判断
                backShow: false,
                isOn: true,
                newCou:'',
                startSwitch: true,//switch一开始的状态
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
                    color:'#fff',
                },
                token:'',
                imei:'',
                preventRepeatedClicks:false,//阻止重复点击
            }
        },
        created:function(){
            this.visibility='hidden';
            this.token = weex.config.token;
            this.imei = weex.config.imei;
            // this.token = 'CZLRJM.CVISQFRZ3MM1539067344'
            // this.imei = 'd4f4af29892c41b0be9555f85e1252c6'
            var that = this;

            var now = new Date();
            var startTime = now.getFullYear() + "-" + ((now.getMonth() + 1) < 10 ? "0" : "") + (now.getMonth() + 1) + "-" + (now.getDate() < 10 ? "0" : "") + now.getDate();
            var endTime = (now.getFullYear() + 1) + "-" + ((now.getMonth() + 1) < 10 ? "0" : "") + (now.getMonth() + 1) + "-" + (now.getDate() < 10 ? "0" : "") + now.getDate();
            var time = startTime
            that.minDate = time
            that.startTime = startTime
            //获取token和sign
            var param = this.GLOBAL.sign(this.token,this.imei);

            /*获取上传的图片对象*/
            post.fetch({
                method: 'POST',
                type: 'json',
                body: param,
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                url: 'https://www.aftdc.com/businessapp/Activity/shopcou',
            }, function (e) {
                if (e.data.res == -2) {
                    // 跳到登陆页面
                    that.GLOBAL.toLogin()
                }
                if(e.data.res == 1) {
                    that.newCou = e.data.data.newCou
                    that.startTime = e.data.data.startTime
                    that.endTime = e.data.data.endTime
                    that.id = e.data.data.id
                }
                if(e.data.res == 0) {
                    that.id=''
                }
            });

            event.init();
            weex.requireModule('globalEvent').addEventListener('chooseTime', function (e) {

                if (that.timeIndex === 0 ) {
                    that.startTime=e.time
                    that.endTime='';
                }
                else {
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
            })
            // setTimeout(function () {
            //     that.$refs.inputRef.focus()
            // },100)
        },
        mounted(){
            var that=this
            that.visibility='visible';
            that.$refs.inputRef.setTextFormatter({
                formatRule: "/(\\.\\d{2})(\\S+)/",
                formatReplace: "$1",
                recoverRule: "/\\./g",
                recoverReplace: ""
            })
        },
        methods:{
            blankClick(){
                this.$refs.inputRef.blur();
                this.blankLeft='750px';
            },
            focus(){
                this.btnShow=false;
                this.blankLeft='0px';
            },
            blur(){
                var that=this;
                this.blankLeft='750px';
                if(that.blurPrevent){
                    that.blurPrevent=false;
                    setTimeout(function () {
                        that.btnShow=true;
                        that.blurPrevent=true;
                    },150)
                }
            },

            chooseTime(timeIndex) {
                var that = this;
                that.timeIndex = timeIndex;
                if(timeIndex===0){
                    event.chooseTime(true, true, true, false, false, false)
                }
                else{
                    event.chooseTime(true, true, true, false, false, false)
                }
            },

            //返回上一页
            minibarLeftButtonClick() {
                navigator.pop({ animated: 'true' });
            },

            save:function(){
                var that = this;
                const toast = this.$refs.toast;

                if(!this.endTime){
                    toast.editContent('未填写结束日期');
                    return false
                }
                if(this.newCou === "" || this.newCou == null) {
                    toast.editContent('请填写正确的立减金额');
                    return false
                }

                if (isNaN(this.newCou)) {
                    toast.editContent('请填写正确的立减金额');
                    return false
                }

                if(!this.isOn) {
                    toast.editContent('请阅读并同意协议');
                    return false
                }

                //获取token和sign
                var param = this.GLOBAL.sign(this.token,this.imei);


                if(that.id==''){
                    param += '&newCou='+that.newCou+'&startTime='+that.startTime+'&endTime='+that.endTime;
                }
                else{
                    param += '&newCou='+that.newCou+'&startTime='+that.startTime+'&endTime='+that.endTime+'&id='+that.id;
                }

                if(that.preventRepeatedClicks){
                    return false
                }
                that.preventRepeatedClicks=true
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    url: 'https://www.aftdc.com/businessapp/Activity/NewCou',
                }, function (e) {
                    console.log(e)
                    if (e.data.res === -2) {
                        //跳到登陆页面
                        that.GLOBAL.toLogin()
                    }
                    else {
                        toast.editContent(e.data.info);
                        if(e.data.info=='成功'){
                            setTimeout(()=>navigator.pop({ animated: 'true' }),2000);
                        }
                    }
                    that.preventRepeatedClicks=false
                })
            },

            bill: function () {
                var that = this;
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
                    });
                    animation.transition(testE2, {
                        styles: {
                            backgroundColor: '#e2e2e2',
                        },
                        duration: 500, //ms
                        timingFunction: 'ease',
                        delay: 0 //ms
                    });
                    that.isOn = !that.isOn
                }

            },
        },
    }
</script>

<style scoped>
    .blank{
        position: absolute;
        width: 750px;
        bottom: 0;
        top: 0;
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
        margin-top: 20px;
        background-color: #fff;
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

    /***********************/
</style>
