<template>
    <div class="manageOverview">

        <!--头部-->
        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="back()"
                    v-once
            >
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">经营报告</text>
            </wxc-minibar>
        </div>

        <scroller class="scroller">


            <!--时间选择-->
            <div class="header">
                <div class="headerOne row">
                    <text class="headerText" :class="[dateChoice==1?'headerActive':'']" :style="{fontSize:GLOBAL.defaultFS}" @click="dateFn(1)">今天</text>
                    <text class="headerText" :class="[dateChoice==2?'headerActive':'']" :style="{fontSize:GLOBAL.defaultFS}" @click="dateFn(2)">近七天</text>
                    <text class="headerText" :class="[dateChoice==3?'headerActive':'']" :style="{fontSize:GLOBAL.defaultFS}" @click="dateFn(3)">近30天</text>
                    <text class="headerText headerBr" :class="[dateChoice==4?'headerActive':'']" :style="{fontSize:GLOBAL.defaultFS}" @click="dateFn(4)">自定义</text>
                </div>
            </div>
            <!--自定义时间-->
            <div class="XiHunped row" v-if="dateChoice==4">

                <text class="XiHunpedTextOne" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}" @click="chooseTime(1)">{{time.start}}</text>
                <text class="XiHunpedzhi" :style="{fontSize:GLOBAL.bigFS,color:'#999'}">至</text>
                <text class="XiHunpedTextOne" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}" @click="chooseTime(0)">{{time.end}}</text>

            </div>

            <!--营业总览-->
            <div class="Overview">

                <div class="topnBun row" @click="topnBunClick">
                    <text class="shiSiIcon"></text>
                    <text class="lvLin" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">营业总览</text>
                    <text :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">{{period}}</text>
                </div>


                <div class="TwouDer row">

                    <div class="bin">
                        <div class="DerNser row">
                            <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">营业总额</text>
                            <text class="number" :style="{fontSize:GLOBAL.defaultFS}">?</text>
                        </div>
                        <div class="DerNonc row">
                            <text class="DerNoncText" :style="{fontSize:GLOBAL.bigFS,color:'#666'}">￥{{needPay}}</text>
                        </div>
                    </div>

                    <div class="binTwo">
                        <div class="DerNser row">
                            <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">商家补贴</text>
                            <text class="number" :style="{fontSize:GLOBAL.defaultFS}">?</text>
                        </div>
                        <div class="DerNonc row">
                            <text class="DerNoncText" :style="{fontSize:GLOBAL.bigFS,color:'#666'}">￥{{deduction}}</text>
                        </div>
                    </div>

                </div>

                <div class="TwouDer row">

                    <div class="bin">
                        <div class="DerNser row">
                            <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">有效订单量</text>
                            <text class="number" :style="{fontSize:GLOBAL.defaultFS}">?</text>
                        </div>
                        <text class="DerNoncText" :style="{fontSize:GLOBAL.bigFS,color:'#666'}">{{effectiveOrder}}</text>
                        <div class="DerNonc row">
                            <text :style="{fontSize:GLOBAL.defaultFS,color:'#666'}">客单价: ￥{{customerPrice}}</text>
                        </div>
                    </div>

                    <div class="binTwo">
                        <div class="DerNser row">
                            <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">无效订单量</text>
                            <text class="number" :style="{fontSize:GLOBAL.defaultFS}">?</text>
                        </div>
                        <text class="DerNoncText" :style="{fontSize:GLOBAL.bigFS,color:'#666'}">{{invalidOrder}}</text>
                        <div class="DerNonc row">
                            <text :style="{fontSize:GLOBAL.defaultFS,color:'#666'}">损失营业额约: ￥{{invalidAmount}}</text>
                        </div>
                    </div>

                </div>

            </div>

            <!--选择指标-->
            <div class="selectIndex">

                <div class="topnBun row" @click="topnBunClick">
                    <text class="shiSiIcon"></text>
                    <text class="lvLin" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">选择指标</text>
                    <text :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">{{period}}</text>
                </div>

                <div class="selectDiv row">
                    <text class="selectText" @click="choiceFn(index)" :style="{fontSize:GLOBAL.smallFS}" v-for="(item,index) in choiceData" :class="[choice==index?'selectActive':'']" :key="index">{{item}}</text>
                </div>

            </div>
            <web ref="firWebview" class="customer"  src="https://www.aftdc.com/mobile/public/echarts.html"
                 @pagestart="" @pagefinish="firOnPageFinish" @error="" @receivedtitle=""></web>
            <div class="analysis">

                <text class="analysisText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">1.昨天营业数据请以今天10:00后的数据为准</text>
                <text class="analysisText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">2.如需查看每日营业详细数据，请前往电脑版进行查询和下载</text>
                <text class="analysisText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">3.如需订单对账，请查看门店管理>财务信息>订单对账</text>

            </div>
            <div style="flex: 1;background-color: #fff"></div>






            <!--<div class="phoneAll minbarPT" id="count">-->

            <!---->
            <!--&lt;!&ndash; 问号弹出框 &ndash;&gt;-->
            <!--<div class="doubtBack" style="display: none">-->
            <!--<div class="doubtBox">-->
            <!--<div class="doubtDetail">-->
            <!--<p>-->
            <!--<strong>营业总额：</strong>-->
            <!--<span>门店订单的流水总额</span>-->
            <!--</p>-->
            <!--</div>-->
            <!--<div class="doubtBut">我知道了</div>-->
            <!--</div>-->
            <!--</div>-->


            <!--</div>-->
        </scroller>




    </div>
</template>

<script>
    import {WxcPopup, WxcMask, WxcIcon, WxcMinibar, WxcPopover} from 'weex-ui';

    const modal = weex.requireModule('modal');
    const event = weex.requireModule('event');
    const post = weex.requireModule('stream');
    const webview = weex.requireModule('webview');
    export default {
        components: {WxcPopup, WxcMask, WxcIcon, WxcMinibar, WxcPopover},
        data() {

            return {
                dataState: false,
                period: '',//时间段
                time: {start: '', end: ''},
                needPay: 0,//营业总额
                effectiveOrder: 0,//有效订单
                deduction: 0,//商家补贴
                invalidOrder: 0,//无效订单
                effectiveAmount: 0,//有效单金额
                invalidAmount: 0,//无效单金额
                customerPrice: 0,//客单价
                nowadays: '',//今天
                dateChoice: 1,
                chartData: [], //图例数据
                choiceData: ['营业总额', '订单收入', '有效订单'], //可以选择显示的图例字段
                choice: 0,     //显示索引
                days: false,
                shopId: 642,
                option:{
                    tooltip:{
                        show:true,
                        trigger:'axis',
                        confine:'true',
                        textStyle:{
                            fontSize:12,
                        },
                        formatter: '{b}<br>{a}：{c}人',
                        alwaysShowContent:false,
                    },
                    xAxis: {
                        axisLine: {show: true,onZero: false},
                        axisTick: {show: false},//刻度线
                        splitLine: {show: true,interval:0,},//辅助线
                        boundaryGap: false,
                        data: [],
                        axisLabel: {//只显示最小值最大值
                            // interval: 0,
                            // showMinLabel: true,
                            showMaxLabel: true,
                        },
                        axisPointer:{
                            lineStyle:{
                                color:'#53beb7'
                            }
                        },
                    },
                    dataZoom: [{

                        show:false,
                        zoomLock:true
                    }, {
                        type: 'inside',

                    }],
                    yAxis: {
                        splitLine: {show: false},//辅助线
                        axisTick: {show: false},//刻度线
                        axisLine: {show: false,onZero: false},//坐标轴线
                        axisLabel: {show: false}//坐标轴提示文字
                    },
                    grid:{//直角坐标系边距
                        left:50,
                        right:50,
                        top:'10',
                        bottom:'30',
                    },
                    series: [{
                        name: '下单顾客',
                        type: 'line',
                        // areaStyle:{
                        //     normal: {
                        //         opacity:0.2,
                        //
                        //     }
                        // },
                        data: [4, 0, 0, 0, 0, 0],
                        symbol: 'circle', //设置拐点格式样式 如:实心圆，空心圆或不显示拐点等
                        itemStyle: {
                            normal: {
                                color:'#53beb7',
                                lineStyle: {
                                    // color :"#53beb7", //设置拐点颜色
                                    width : 2 //设置各个拐点连接的线条颜色
                                },
                            },

                        },

                        symbolSize :8, //设置各个拐点的大小

                    }],
                    // animationEasingUpdate:'linear',
                    timeIndex:'',
                    token:'',
                    imei:''
                }
            }
        },
        created:function(){
            var that=this
            event.init();
            that.token = weex.config.token;
            that.imei = weex.config.imei;
            var myDate = new Date();
            var ey = myDate.getFullYear();
            var em = myDate.getMonth() + 1;
            var ed = myDate.getDate();
            var end = ey + '-' + that.timeRet(em) + '-' + that.timeRet(ed);

            var endDate = myDate.setDate(myDate.getDate() - 7);
            endDate = new Date(endDate)
            var sy = endDate.getFullYear();
            var sm = endDate.getMonth() + 1;
            var sd = endDate.getDate();
            var start = sy + '-' + that.timeRet(sm) + '-' + that.timeRet(sd);


            that.time['start'] = start;
            that.time['end'] = end;
            that.period = that.nowadays = end;


            if (that.dateChoice === 1) {
                var data = this.GLOBAL.sign(this.token,this.imei) + '&' + 'start=' + end + '&' + 'end='+end
                that.chartRequest(data)
            }

            weex.requireModule('globalEvent').addEventListener('chooseTime', function (e) {

                    if (that.timeIndex == 1) {
                        that.$set(that.time, 'start', e.time)
                    } else {
                        that.$set(that.time, 'end', e.time)
                    }

                that.timeFn();
            })
        },
        methods: {
            timeRet(t){
                t = t > 9 ? t : '0' + t
                return t
            },
            chooseTime(timeIndex) {
                var that = this
                that.timeIndex = timeIndex;
                event.chooseTime(true, true, true, false, false, false)

            },
            dateFn: function (index) {
                var that = this;
                that.dateChoice = index;

                var data = {};
                if (index === 1) {
                    that.period = that.nowadays;
                    data =this.GLOBAL.sign(this.token,this.imei) + '&' + 'start=' + that.nowadays + '&' + 'end='+that.nowadays
                    that.chartRequest(data);
                } else if (index === 2 || index === 3) {
                    var days = index === 2 ? 7 : 30;
                    data = this.GLOBAL.sign(this.token,this.imei)+ '&' + 'days=' + days + '&' + 'pasd='+123456
                    that.chartRequest(data);
                } else if (index === 4) {
                    that.timeFn();
                }


            },
            //请求数据
            chartRequest: function (data) {
                var dataState = this.dataState;
                var that = this;
                var param = data ;//改
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/businessapp/Manage/analyCounts',//改
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                }, function (res) {
                    var tendency = res.data.data.tendency;
                    if (that.dateChoice === 2) {
                        that.period = res.data.data.businessData[0].time + "-" + res.data.data.businessData[6].time;
                    }
                    if (that.dateChoice === 3) {
                        that.period = res.data.data.businessData[0].time + "-" + res.data.data.businessData[29].time;
                    }
                    // that.tendency=tendency
                    var myd = [];
                    var myarr = [];
                    for (var i in tendency) {
                        var t = tendency[i].type;
                        let indexo = myd.indexOf(t);
                        if (indexo < 0) {
                            myd.push(t);
                            let a = [];
                            tendency[i].value = parseInt(tendency[i].value * 100) / 100;
                            a.push(tendency[i]);
                            myarr.push(a)
                        } else {
                            //存在
                            tendency[i].value = parseInt(tendency[i].value * 100) / 100;
                            myarr[indexo].push(tendency[i])
                        }
                    }
                    let needPay = 0;
                    let deduction = 0;
                    let effectiveOrder = 0;
                    let invalidOrder = 0;
                    let effectiveAmount = 0;
                    let invalidAmount = 0;
                    for (var o in myarr) {
                        for (var j in myarr[o]) {
                            if (myarr[o][j].type === "营业总额") {
                                needPay += parseFloat(myarr[o][j].value);
                            }
                            if (myarr[o][j].type === "商家补贴") {
                                deduction += parseFloat(myarr[o][j].value);
                            }
                            if (myarr[o][j].type === "有效订单") {
                                effectiveOrder += parseFloat(myarr[o][j].value);
                                effectiveAmount += parseFloat(myarr[o][j].amount);
                            }
                            if (myarr[o][j].type === "无效订单") {
                                invalidOrder += parseFloat(myarr[o][j].value);
                                invalidAmount += parseFloat(myarr[o][j].amount);
                            }
                        }
                    }
                    if (effectiveAmount && effectiveOrder) {
                        that.customerPrice = (effectiveAmount / effectiveOrder).toFixed(2);
                    }
                    that.needPay = needPay.toFixed(2);
                    that.deduction = deduction.toFixed(2);
                    that.effectiveOrder = effectiveOrder.toFixed(2);
                    that.invalidOrder = invalidOrder.toFixed(2);
                    that.effectiveAmount = effectiveAmount.toFixed(2);
                    that.invalidAmount = invalidAmount.toFixed(2);
                    that.chartData = myarr;//二维数组 位置对应 choiceData 的值
                    console.log( that.chartData)
                    if (dataState) {
                        that.firOnPageFinish();
                    } else {
                        //首次渲染图表
                        that.dataState = true;
                        that.choiceData = myd;
                        that.firOnPageFinish();
                    }
                })

            },
            choiceFn: function (index) {
                this.choice = index;
                var data = this.chartData[index];
                this.firOnPageFinish();
                // chartAll.changeData(data)
            },
            timeFn: function () {
                var that=this
                var start = this.time['start'];
                var end = this.time['end'];
                this.period = start + "-" + end;
                if (start && end) {
                    var data =this.GLOBAL.sign(this.token,this.imei)+ '&' + 'start=' + start + '&' + 'end='+end
                    this.chartRequest(data)
                }
            },
            firOnPageFinish(){
                var that=this
                var option=that.option
                var choice=that.choice
                option.xAxis.data=[]
                option.series[0].data=[]
                option.series[0].name=that.chartData[choice][0].type
                if( option.series[0].name=='订单收入'||option.series[0].name=='营业总额'||option.series[0].name=='商家补贴'){
                    option.tooltip.formatter='{b}<br>{a}：{c}元'
                }else{
                    option.tooltip.formatter='{b}<br>{a}：{c}单'
                }

                for(var i in that.chartData[choice]){
                    option.xAxis.data.push(that.chartData[choice][i].month)
                    option.series[0].data.push(that.chartData[choice][i].value)
                }
                console.log(   option)
                webview.postMessage(that.$refs.firWebview, {message: {option:option,chartType:0}});
            },

        },
    }
</script>


<style scoped>
    .manageOverview{
        background-color: #f8f8f8;
    }
    .row {
        flex-direction: row;
        align-items: center;
    }
    .scroller{
        flex: 1;
        width: 750px;
    }
    /*头部选择star*/
    .header{
        background-color: #fff;
        padding-top: 25px;
        padding-left: 30px;
        padding-right: 30px;
        padding-bottom: 25px;
    }
    .headerText{
        flex: 1;
        text-align: center;
        color: #53beb7;
        padding-top: 15px;
        padding-bottom: 15px;
        border-top-style: solid;
        border-top-width: 2px;
        border-top-color: #53beb7;
        border-bottom-style: solid;
        border-bottom-width: 2px;
        border-bottom-color: #53beb7;
        border-left-style: solid;
        border-left-width: 2px;
        border-left-color: #53beb7;
    }
    .headerActive{
        background-color: #53beb7;
        color: #fff;
    }
    .headerBr{
        border-right-style: solid;
        border-right-width: 2px;
        border-right-color: #53beb7;
    }

    .XiHunpedzhi {
        margin-left: 15px;
        margin-right: 15px;
    }

    .XiHunpedTextOne {
        width: 230px;
        height: 70px;
        text-align: center;
        line-height: 70px;
        border-style: solid;
        border-width: 1px;
        border-color: #dedede;
    }

    .XiHunped {
        padding-bottom: 20px;
        justify-content: center;
        background-color: #fff;
    }
    /*头部选择end*/

    /*营业总览star*/
    .Overview{
        margin-top: 20px;
        background-color: #fff;
    }
    .shisiImg {
        width: 20px;
        height: 20px;
        margin-left: 5px;
    }

    .lvLin {
        font-weight: 600;
        flex: 1;
        margin-left: 20px;
    }

    .shiSiIcon {
        width: 8px;
        height: 29px;
        background-color: #53beb7;
    }

    .topnBun {
        padding-top: 30px;
        padding-bottom: 30px;
        padding-left: 25px;
        padding-right: 25px;
        background-color: #fff;
        justify-content: space-between;
        border-bottom-style: solid;
        border-bottom-width: 2px;
        border-bottom-color: #e0e0e0;
    }
    .TwouDer {
        padding-top: 25px;
        padding-bottom: 20px;
        background-color: #fff;
        border-bottom-style: solid;
        border-bottom-width: 2px;
        border-bottom-color: #e0e0e0;
    }
    .number {
        width: 30px;
        height: 30px;
        border-radius: 40px;
        background-color: #C0C0C0;
        color: #fff;
        line-height: 30px;
        text-align: center;
        margin-left: 20px;
    }

    .xin {
        padding-top: 1px;
        padding-bottom: 1px;
        padding-left: 2px;
        padding-right: 2px;
        margin-left: 20px;
        border-radius: 5px;
        color: #ff0000;
        border-style: solid;
        border-width: 1px;
        border-color: #ff0000;

    }

    .binTwo {
        flex: 1;
        justify-content: center;
        align-items: center;
    }

    .bin {
        flex: 1;
        border-right-style: solid;
        border-right-width: 2px;
        border-right-color: #dedede;
        justify-content: center;
        align-items: center;
    }
    .DerNoncMoney {
        font-weight: bold;

    }
    .DerNonc {
        margin-top: 10px;
    }
    .DerNoncText{
        font-weight: bold;
        margin-top: 10px;
    }
    /*营业总览end*/

    /*选择指标star*/
    .selectIndex{
        background-color: #FFF;
        margin-top: 20px;
    }
    .selectDiv{
        padding-top: 20px;
        padding-bottom: 10px;
        padding-left: 30px;
        padding-right: 30px;
        flex-wrap: wrap;
    }

    .selectText{
        padding-top: 3px;
        padding-bottom: 3px;
        padding-left: 6px;
        padding-right: 6px;
        border-radius: 2px;
        border-style: solid;
        border-width: 2px;
        border-color: #e5e5e5;
        color:#9a9a9a;
        margin-right: 5px;
        margin-bottom: 6px;
    }
    .selectActive{
        color: #53beb7;
        border-color: #53beb7;
    }
    /*指标选择end*/

    /*说明*/
    .analysis{
        padding-top: 30px;
        padding-left: 25px;
        padding-right: 25px;
        padding-bottom: 30px;
        width: 750px;
    }
    .analysisText{
        margin-top: 8px;
    }

    .customer {
        width: 750px;
        height: 371px;
        /*border-width: 2px;*/
        /*border-style: solid;*/
        /*border-color: #e5e4e9;*/

    }

</style>


