<template>
    <div class="wrapper" :style="{visibility: visibility}">

        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    @wxcMinibarRightButtonClicked="minibarRightButtonClick"
                    v-once
            >
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">满减活动</text>
                <text :style="GLOBAL.headerRight"  slot="right">保存</text>
            </wxc-minibar>
        </div>

        <scroller class="content_scroller">
            <div class="content">
                <div class="content_switch">
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
            </div>
            <list class="scroller">
                <cell v-for="(item,index) in active" ref="scroller">
                    <div class="listCell">
                        <div class="cellTitle">
                            <text class="titleSize" :style="{fontSize:GLOBAL.bigFS}">活动{{index+1}}</text>
                            <text class="delColor" @click="delCell(index)" :style="{fontSize:GLOBAL.bigFS}">删除</text>
                        </div>
                        <div class="cellContent">
                            <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">开始日期</text>
                            <div class="inputDiv" @click="chooseTime(0,index)">
                                <!--<input class="input" :value="item.startTime" @change="startTimeChange($event,item)" :min="min" type="date" placeholder="未设置" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}"/>-->
                                <text  :style="{'font-size': GLOBAL.bigFS, 'placeholder-color': '#999', 'color': item.startTime==''?'#999':GLOBAL.dColor,marginRight:'10px'}">{{item.startTime==''?'未设置':item.startTime}}</text>
                                <wxc-icon name="more" :icon-style="iconStyle"></wxc-icon>
                            </div>
                        </div>
                        <div class="cellContent">
                            <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">结束日期</text>
                            <div class="inputDiv" @click="chooseTime(1,index)">
                                <!--<input class="input" :value="item.endTime" @change="endTimeChange($event,item)" :min="item.startTime" type="date" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}" placeholder="未设置"/>-->
                                <text  :style="{'font-size': GLOBAL.bigFS, 'placeholder-color': '#999', 'color':item.endTime==''?'#999':GLOBAL.dColor,marginRight:'10px'}">{{item.endTime==''?'未设置':item.endTime}}</text>
                                <wxc-icon name="more" :icon-style="iconStyle"></wxc-icon>
                            </div>
                        </div>
                        <div class="cellContent">
                            <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">满金额</text>
                            <div class="inputDiv">
                                <input class="input" :style="GLOBAL.inputText" v-model="item.full" type="number" placeholder="请输入满金额"  ref="firInput" @focus="allFocus(index,0)" @blur="allBlur"  />
                                <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">元</text>
                            </div>
                        </div>
                        <div class="cellContent">
                            <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">减金额</text>
                            <div class="inputDiv">
                                <input class="input" :style="GLOBAL.inputText" v-model="item.minus" type="number" placeholder="请输入减金额"  ref="secInput" @focus="allFocus(index,1)" @blur="allBlur"  />
                                <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">元</text>
                            </div>
                        </div>
                    </div>
                </cell>
            </list>
        </scroller>

        <!--添加满减活动按钮-->
        <div class="enterButton" v-if="!inputFocus">
            <wxc-button class="okButton" text="+ 添加满减活动" :disabled="active.length>=5?true:false" :textStyle="GLOBAL.buttonText" :btnStyle="GLOBAL.defaultButton"
                        @wxcButtonClicked="addClick"></wxc-button>
        </div>

        <div class="blank" :style="{left:blankLeft}" @click="blankClick"></div>
        <toast ref="toast"></toast>

    </div>
</template>

<script>
    import {WxcButton, WxcDialog, WxcIcon,WxcMinibar} from 'weex-ui'
    import Toast from './Toast.vue'

    const animation = weex.requireModule('animation')
    import {WxcPageCalendar} from 'weex-ui';
    const picker = weex.requireModule('picker')
    const post = weex.requireModule('stream');
    const navigator = weex.requireModule('navigator');
    const event = weex.requireModule('event');
    const dom = weex.requireModule('dom');

    export default {
        components: {WxcButton, WxcDialog, Toast, WxcPageCalendar, WxcIcon,WxcMinibar},
        data() {
            return {
                visibility:'hidden',
                btnShow:true,
                backImgToggle: 0,//头部返回图片判断
                backShow: false,
                isOn: true,
                startSwitch: true,//switch一开始的状态
                iconStyle: {
                    fontSize: '30px'
                },
                min: '',
                active: [

                ],
                addBtnStyle:{
                    backgroundColor: '#53beb7',
                    width: '600',
                    borderColor: '#333',
                    borderWidth: '1px',
                    borderStyle: 'solid'
                },
                addStyle:{
                    color:'#fff'
                },
                token:'',
                imei:'',
                timeIndex:'',
                inputFocus:false,
                itemIndex:'',
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
            that.min = time;
            event.init();
            weex.requireModule('globalEvent').addEventListener('chooseTime', function (e) {

                if (that.timeIndex == 0 ) {
                    that.active[that.itemIndex].startTime=e.time
                }
                else{
                    var timeTop= that.active[that.itemIndex].startTime.split('-');
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
                    that.active[that.itemIndex].endTime=e.time;
                }
            });

            //获取token和sign
            var param = this.GLOBAL.sign(this.token,this.imei);
            post.fetch({
                method: 'post',
                type: 'json',
                body:param,
                url: 'https://www.aftdc.com/businessapp/Activity/Mj',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
            },function(res){
                //full满多少,minus减多少,startTime开,endTime结
                that.active = that.active.concat(res.data.data);
                console.log(res)
            })

        },
        mounted(){
            var that=this
            that.visibility='visible';



            // that.$refs.secInput.setTextFormatter({
            //     formatRule: "/(\\.\\d{2})(\\S+)/",
            //     formatReplace: "$1",
            //     recoverRule: "/\\./g",//不能输入小数点
            //     recoverReplace: ""
            // })


        },
        methods: {
            chooseTime( timeIndex,index) {
                this.$refs.firInput[0].focus();
                this.$refs.firInput[0].blur();
                var that = this;
                that.timeIndex = timeIndex;
                that.itemIndex=index;
                event.chooseTime(true, true, true, false, false, false)
            },
            focus(){
                this.btnShow=false;
            },
            blur(){
                this.btnShow=true;
            },
            startTimeChange: function (event,item) {
                item.startTime = event.value;
            },
            endTimeChange: function (event,item) {
                item.endTime = event.value;
            },
            minibarRightButtonClick(){
                var that = this;
                const toast=that.$refs.toast;
                var active = that.active;
                //获取token和sign
                var param = this.GLOBAL.sign(this.token,this.imei);
                //添加或修改操作
                for(var i = 0;i<active.length;i++){
                    if(!active[i]['full']||!active[i]['minus']||!active[i]['startTime']||!active[i]['endTime']){
                        toast.editContent('请填写完整');
                        return false;
                    }
                    if (Number(active[i].full)<Number(active[i].minus)) {
                        toast.editContent('减金额大于满金额');
                        return false;
                    }
                }
                if (!that.isOn) {
                    toast.editContent('请阅读并同意《商家自营销协议》');
                    return false;
                }
                active = JSON.stringify(active);
                param += '&clasData='+active;
                if(that.preventRepeatedClicks){
                    return false
                }
                that.preventRepeatedClicks=true
                post.fetch({
                    method: 'post',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/businessapp/Activity/editMj',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                },function(res){
                    if (res.data.res === -2) {
                        //跳到登陆页面
                        that.GLOBAL.toLogin()
                    }
                    else {
                        if (res.data.res === 1) {
                            toast.editContent('创建成功');
                            setTimeout(() => navigator.pop({animated: 'true'}), 2000);
                        }
                        else {
                            if (res.data.msg) toast.editContent(res.data.msg);
                            else toast.editContent('网络出错');
                            return false;
                        }
                    }
                    that.preventRepeatedClicks=false
                })
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

            delCell(index){
                var that=this;
                if (that.active[index]['id']) {
                    var Btndel = that.active[index]['id'];
                    //获取token和sign
                    var param = this.GLOBAL.sign(this.token,this.imei);
                    //删除操作
                    param+= '&id='+Btndel;
                    post.fetch({
                        method: 'post',
                        type: 'json',
                        body: param,
                        url: 'https://www.aftdc.com/businessapp/Activity/delMJ',
                        headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    },function(res){
                        if(res.data.res === 1){
                            that.active.splice(index,1);
                            const toast=that.$refs.toast;
                            toast.editContent('删除成功');
                        } else if (res.data.res === -1) {
                            const toast=that.$refs.toast;
                            toast.editContent('删除失败');
                        } else {
                            const toast=that.$refs.toast;
                            toast.editContent('网络出错了');
                        }
                    })
                } else that.active.splice(index,1);
            },
            addClick(){
                var that=this;
                if(that.active.length>=5){
                    return false
                }
                //full满多少,minus减多少,startTime开,endTime结
                var newActive={startTime: that.min, endTime: '', full: '', minus: '',id:''};
                that.active.push(newActive);
                setTimeout(() => {
                    dom.scrollToElement(that.$refs.scroller[that.active.length - 1], {})
                }, 100)
            },
            allFocus(index,toggle){
                var that=this
                that.inputFocus=true
                that.blankLeft='0px';
                if(toggle==0){
                    that.$refs.firInput[index].setTextFormatter({
                        formatRule: "/(\\.\\d{2})(\\S+)/",
                        formatReplace: "$1",
                        recoverRule: "/\\./g",
                        recoverReplace: ""
                    })
                }else{
                    that.$refs.secInput[index].setTextFormatter({
                        formatRule: "/(\\.\\d{2})(\\S+)/",
                        formatReplace: "$1",
                        recoverRule: "/\\./g",
                        recoverReplace: ""
                    })
                }
            },
            allBlur(){
                var that=this
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
                for(var i in this.active){
                    this.$refs.firInput[i].blur()
                    this.$refs.secInput[i].blur()
                }
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
    .okButton:enabled {
        background-color: #53beb7;
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
        flex-direction: column;
    }
    .content_scroller{
        flex: 1;
        width: 750px;
    }
    .scroller{
        flex-direction: column;
        position: absolute;
        top: 120px;
        left: 0;
        right: 0;
        bottom: 0px;
    }

    .content_switch {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding-top: 30px;
        padding-bottom: 30px;
        padding-left: 20px;
        padding-right: 30px;
        background-color: #fff;
        margin-bottom: 10px;
    }

    .protocol {
        flex-direction: row;
        align-items: center;
    }

    .protocolColor {
        color: #53beb7;
    }

    .listCell {
        flex-direction: column;
        background-color: #fff;
        margin-top: 10px;
    }

    .cellTitle {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding-left: 20px;
        padding-right: 30px;
        padding-top: 10px;
        padding-bottom: 10px;
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #f8f8f8;
    }

    .titleSize {
        color: #999;
    }

    .delColor {
        color: red;
    }

    .cellContent {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding-left: 20px;
        padding-right: 20px;
        padding-top: 20px;
        padding-bottom: 20px;
        /*border-bottom-width: 2px;*/
        /*border-bottom-style: solid;*/
        /*border-bottom-color: #f8f8f8;*/
    }

    .input {
        text-align: right;
        flex: 1;
        margin-right: 10px;
        margin-left: 100px;
    }

    .inputDiv {
        flex-direction: row;
        align-items: center;
        flex: 1;
        justify-content: flex-end;
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
