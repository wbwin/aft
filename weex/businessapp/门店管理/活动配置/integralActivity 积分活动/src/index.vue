<template>
    <div class="wrapper" :style="{visibility: visibility}">
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
                <text :style="GLOBAL.headerCenter"  slot="middle">积分活动</text>
                <text :style="GLOBAL.headerRight"  slot="right">保存</text>
            </wxc-minibar>
        </div>

        <scroller style="flex: 1;width: 750px;">
            <div class="contentClassfly">
                <div class="betweenDiv">
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">开始日期</text>
                    <div class="inputDiv" @click="chooseTime(0)">
                        <!--<input class="input" :style="GLOBAL.inputText" v-model="startTime" :min="minDate" @change="startTimeChange($event)" type="date" placeholder="未设置" />-->
                        <text  :style="{'font-size': GLOBAL.bigFS, 'placeholder-color': '#999', 'color': startTime==''?'#999':GLOBAL.dColor,marginRight:'10px'}">{{startTime==''?'未设置':startTime}}</text>
                        <image class="inputIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                    </div>
                </div>
                <div class="betweenDiv">
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">结束日期</text>
                    <div class="inputDiv" @click="chooseTime(1)">
                        <!--<input class="input" :min="startTime" @change="endTimeChange($event)" type="date" placeholder="未设置" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}"/>-->
                        <text  :style="{'font-size': GLOBAL.bigFS, 'placeholder-color': '#999', 'color':endTime==''?'#999':GLOBAL.dColor,marginRight:'10px'}">{{endTime==''?'未设置':endTime}}</text>
                        <image class="inputIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                    </div>
                </div>
            </div>

            <div class="scrollerCell">

                <div class="betweenDiv">
                    <text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor,flex:0.6}">购买赠送</text>
                    <div class="inputDiv" >
                        <input :style="GLOBAL.inputText"   ref="inputOne" class="input" v-model="invoiceRemarks"  type="number" placeholder="订单金额百分比"/>
                        <text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor}">%</text>
                    </div>
                </div>

                <div class="betweenDiv">
                    <text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor,flex:0.6}">积分价值</text>
                    <div class="inputDiv" >
                        <input :style="GLOBAL.inputText"   ref="inputTwo" class="input" v-model="invoiceRemarkstrD"  type="number" placeholder="1积分价值"/>
                        <text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor}">元</text>
                    </div>
                </div>

            </div>

            <!--协议-->
            <div class="contentSwitch" @touchstart="touchstart">
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
        </scroller>

        <toast ref="toast"></toast>
    </div>
</template>

<script>
    import {WxcButton, WxcDialog, WxcIcon, WxcMinibar,WxcMask} from 'weex-ui';
    import Toast from './Toast.vue';
    const post = weex.requireModule('stream');
    const navigator = weex.requireModule('navigator');
    const event = weex.requireModule('event');
    const modal = weex.requireModule('modal');
    const animation = weex.requireModule('animation');

    export default {
        components: {WxcButton, WxcDialog,WxcIcon, WxcMinibar,WxcMask,Toast},
        name: 'App',

        data() {
            return {

                startSwitch: true,//switch一开始的状态
                backgroundColorTwo:'',//动画背景色
                prevent:true,//阻止多次点击绿色按钮

                // startSwitchIntegral: false,//switch一开始的状态
                // backgroundColorIntegral:'',//动画背景色
                // preventIntegral:true,//阻止多次点击绿色按钮

                invoiceRemarks:'',//积分赠送百分比
                invoiceRemarkstrD:'',//积分价值
                id:'',//已创建活动时,此ID不为空
                startTime:'',
                endTime:'',

                visibility:'hidden',
                preventRepeatedClicks:false,//阻止重复点击
            }
        },
        computed: {

        },
        created() {
            var that = this;
            that.visibility='hidden';
            that.token = weex.config.token;
            that.imei = weex.config.imei;
            // that.token = 'ZN39NR7ITUJH.ESJW21538306330'
            // that.imei = '0254fd8964f94275b24532e1b1e6c979'

            var now = new Date();
            var startTime = now.getFullYear() + "-" + ((now.getMonth() + 1) < 10 ? "0" : "") + (now.getMonth() + 1) + "-" + (now.getDate() < 10 ? "0" : "") + now.getDate();
            var endTime = (now.getFullYear() + 1) + "-" + ((now.getMonth() + 1) < 10 ? "0" : "") + (now.getMonth() + 1) + "-" + (now.getDate() < 10 ? "0" : "") + now.getDate();
            // var time = startTime
            // that.minDate = time
            that.startTime = startTime;

            var param = this.GLOBAL.sign(this.token,this.imei);
            post.fetch({
                method: 'post',
                type: 'json',
                body: param,
                url: 'https://www.aftdc.com/businessapp/Activity/getInvoice',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
            },function(res){
                console.log(res)
                if(res.data.res==-2){
                    // 跳到登陆页面
                    that.GLOBAL.toLogin()
                }
                if(res.data.res==1){
                    that.startTime=res.data.data.startTime;
                    that.endTime=res.data.data.endTime;
                    that.invoiceRemarks=res.data.data.invoiceRemarks;
                    that.invoiceRemarkstrD=res.data.data.invoiceRemarkstrD;
                    that.id=res.data.data.id;
                }else if(res.data.res==0){
                    that.id='';
                }

            })

            event.init();
            weex.requireModule('globalEvent').addEventListener('chooseTime', function (e) {

                if (that.timeIndex == 0) {
                    that.startTime=e.time;
                    that.endTime='';
                }
                else if(that.timeIndex == 1) {
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
                        toast.editContent('结束日期要大于开始日期');
                        return false;
                    }
                    else if(endOne==endTopOne && endTwo<endTopTwo){
                        const toast = that.$refs.toast;
                        toast.editContent('结束日期要大于开始日期');
                        return false;
                    }
                    else if(endOne==endTopOne && endTwo==endTopTwo && endThree<=endTopThree){
                        const toast = that.$refs.toast;
                        toast.editContent('结束日期要大于开始日期');
                        return false;
                    }
                    that.endTime=e.time
                }

            })
        },
        mounted() {
            var that = this;
            that.startSwitch=!that.startSwitch
            that.visibility='visible';
            that.$refs.inputOne.setTextFormatter({
                formatRule: "/(\\.\\d{2})(\\S+)/",
                formatReplace: "$1",
                recoverRule: "/\\s+/g",
                recoverReplace: ""
            })
            that.$refs.inputTwo.setTextFormatter({
                formatRule: "/(\\.\\d{2})(\\S+)/",
                formatReplace: "$1",
                recoverRule: "/\\s+/g",
                recoverReplace: ""
            })
            that.bill()

        },
        methods:{
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
            blur(){
                this.$refs.inputOne.blur();
                this.$refs.inputTwo.blur();
            },
            touchstart(){
                this.blur();
            },
            save(){

                var that=this;

                const toast=that.$refs.toast;
                if(that.endTime==''){
                    toast.editContent('未选择结束日期')
                    return false;
                }
                if(that.invoiceRemarks==''){
                    toast.editContent('未输入购买赠送百分比')
                    return false;
                }
                if(that.invoiceRemarkstrD==''){
                    toast.editContent('未输入积分价值')
                    return false;
                }
                if(!this.startSwitch) {
                    toast.editContent('未同意协议');
                    return false
                }
                var param = that.GLOBAL.sign(that.token,that.imei);
                param+='&startTime='+that.startTime + '&endTime='+that.endTime + '&invoiceRemarks='+that.invoiceRemarks + '&invoiceRemarkstrD='+that.invoiceRemarkstrD + '&id='+that.id;
                if(this.preventRepeatedClicks){
                    return false
                }
                this.preventRepeatedClicks=true;
                post.fetch({
                    method: 'post',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/businessapp/Activity/setInvoice',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                },function(res){
                    if (res.data.res === -2) {
                        //跳到登陆页面
                        that.GLOBAL.toLogin();
                    }
                    else {
                        toast.editContent(res.data.info);
                        if(res.data.info=='成功'){
                            setTimeout(()=>navigator.pop({ animated: 'true' }),2000);
                        }
                    }
                    that.preventRepeatedClicks=false

                })

            },
            backClick(){},
            chooseTime(timeIndex) {
                var that = this;
                that.timeIndex = timeIndex;
                event.chooseTime(true, true, true, false, false, false)

            },
        },
    }
</script>

<style scoped>
    .wrapper{
        background-color: #f8f8f8;
    }
    .scrollerCell{
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
    .inputDiv {
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
    .contentClassfly {
        flex-direction: column;
        margin-top: 20px;
        background-color: #fff;

    }
    .inputIcon{
        width: 20px;
        height: 20px;
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

</style>