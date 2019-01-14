<template>
    <div class="wrapper">

        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    v-once>
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">经营数据</text>
            </wxc-minibar>
        </div>

        <scroller show-scrollbar="false">

            <!--数据统计-->
            <div class="title ">
                <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">数据统计</text>
            </div>
            <div class="header row aiCenter">
                <div class="tabBar" @click="toAppCount()">
                    <image class="headerImg" src="https://www.aftdc.com/static/image/mobile/business.png" />
                    <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">营业统计</text>
                </div>
                <div class="headerLine"></div>
                <div class="tabBar" @click="toAppGuest()">
                    <image class="headerImg" src="https://www.aftdc.com/static/image/mobile/shopper.png" />
                    <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">顾客分析</text>
                </div>
                <div class="headerLine"></div>
                <div class="tabBar" @click="toAppFlow()">
                    <image class="headerImg" src="https://www.aftdc.com/static/image/mobile/flow.png" />
                    <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">流量分析</text>
                </div>
                <div class="headerLine"></div>
                <div class="tabBar" @click="toAppShop()">
                    <image class="headerImg" src="https://www.aftdc.com/static/image/mobile/goods.png" />
                    <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">商品分析</text>
                </div>
            </div>

            <!--经营报告-->
            <div class="title " @click="toAppCount_del()">
                <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">经营报告</text>
            </div>
            <div class="choice row">
                <div class="choiceItem aiCenter" @click="datefn(1)">
                    <text class="dColor" :class="[dateChoice===1?'activeText':'']" :style="{fontSize:GLOBAL.bigFS}">昨日 经营日报</text>
                </div>
                <div class="choiceItem aiCenter" @click="datefn(7)">
                    <text class="dColor" :class="[dateChoice===7?'activeText':'']" :style="{fontSize:GLOBAL.bigFS}" >近7日 经营数据</text>
                </div>
                <div class="activeBottom" :class="[dateChoice===7?'activeBottomRight':'']"></div>
            </div>

            <!--统计时间-->
            <div class="title" >
                <text class="gray" :style="{fontSize:GLOBAL.bigFS}">统计时间  {{statisticsTime}}</text>
            </div>

            <!--昨日 经营日报 -->
            <div v-if="dateChoice===1">
                <!--昨日 流量概况-->
                <div class="panel">
                    <div class="panelHeading row aiCenter ">
                        <div class="panelHeadingIcon"></div>
                        <text class="black" :style="{fontSize:GLOBAL.biggerFS}">昨日 流量概况</text>
                    </div>
                    <div class="panelBody row">
                        <div class="flex1 flowProfileLeft aiCenter">
                            <text class="gray" :style="{fontSize:GLOBAL.bigFS}">访问顾客</text>
                            <div class="dataText row jcCenter">
                                <text class="black number">{{number.readNum}}</text>
                                <text class="black" :style="{fontSize:GLOBAL.bigFS}">人</text>
                            </div>
                        </div>
                        <div class="flex1 aiCenter">
                            <text class="gray" :style="{fontSize:GLOBAL.bigFS}">下单顾客</text>
                            <div class="dataText row jcCenter">
                                <text class="black number">{{number.sales}}</text>
                                <text class="black" :style="{fontSize:GLOBAL.bigFS}">人</text>
                            </div>
                        </div>
                        <div class="flex1 flowProfileRight aiCenter">
                            <text class="gray" :style="{fontSize:GLOBAL.bigFS}">下单转化率</text>
                            <div class=" dataText row jcCenter">
                                <text class="black number" >{{number.order}}</text>
                                <text class="black" :style="{fontSize:GLOBAL.bigFS}">%</text>
                            </div>
                        </div>
                    </div>
                </div>

                <!--昨日 下单顾客概况-->
                <div class="panel">
                    <div class="panelHeading row aiCenter ">
                        <div class="panelHeadingIcon"></div>
                        <text class="black" :style="{fontSize:GLOBAL.biggerFS}">昨日 下单顾客概况</text>
                    </div>
                    <div class="panelBody row jcSb">
                        <div class="flexRight">
                            <div class="row aiCenter">
                                <div class="flexLeftBox"></div>
                                <text class="gray " :style="{fontSize:GLOBAL.bigFS}">老客</text>
                            </div>
                            <div class="customerData">
                                <!--<span class="fontjia fontNumb">{{yed.oldOrderNum}}</span><i class="expression">人 </i>-->
                                <!--较前日-->
                                <!--<i v-if="subYed.oldsub==0">&#45;&#45;持平</i>-->
                                <!--<i :class="[subYed.oldsub>0?'fa-up':'fa-down']" v-else>{{subYed.oldsub|abs}}人</i>-->
                                <div class=" dataText row">
                                    <text class="black number" >{{yed.oldOrderNum}}</text>
                                    <text class="black" :style="{fontSize:GLOBAL.bigFS}">人 较前日 </text>
                                    <text class="black" :style="{fontSize:GLOBAL.bigFS}" v-if="subYed.oldsub==0">--持平</text>
                                    <text class="black" :class="[subYed.oldsub>0?'faUp':'faDown']" :style="{fontSize:GLOBAL.bigFS}" v-else>{{subYed.oldsub|abs}}人{{subYed.oldsub>0?'↑':'↓'}}</text>
                                </div>
                            </div>
                            <div class="mt24 row aiCenter">
                                <div class="flexLeftBox bgGray"></div>
                                <text class="gray " :style="{fontSize:GLOBAL.bigFS}">新客</text>
                            </div>
                            <div class="customerData" >
                                <!--<span class="fontjia fontNumb">{{yed.newOrderNum}}</span><i class="expression">人 </i>-->
                                <!--较前日-->
                                <!--<i v-if="subYed.newsub==0">&#45;&#45;持平</i>-->
                                <!--<i :class="[subYed.newsub>0?'fa-up':'fa-down']" v-else>{{subYed.newsub|abs}}人</i>-->
                                <div class="dataText row">
                                    <text class="black number">{{yed.newOrderNum}}</text>
                                    <text class="black" :style="{fontSize:GLOBAL.bigFS}" >人 较前日 </text>
                                    <text class="black" :style="{fontSize:GLOBAL.bigFS}" v-if="subYed.newsub==0">--持平</text>
                                    <text class="black" :class="[subYed.newsub>0?'faUp':'faDown']" :style="{fontSize:GLOBAL.bigFS}" v-else>{{subYed.newsub|abs}}人{{subYed.newsub>0?'↑':'↓'}}</text>
                                </div>
                            </div>
                        </div>
                        <div class="dottedLine"></div>
                        <web ref="thrWebview"  style="width: 300px;height: 210px;" src="https://www.aftdc.com/mobile/public/echarts.html"
                             @pagestart="" @pagefinish="thrOnPageFinish" @error="" @receivedtitle=""></web>
                    </div>
                </div>

                <!--昨日 营业统计-->
                <div class="panel">
                    <div class="panelHeading row aiCenter ">
                        <div class="panelHeadingIcon"></div>
                        <text class="black" :style="{fontSize:GLOBAL.biggerFS}">昨日 营业统计</text>
                    </div>
                    <div class="row doBusinessBottom aiCenter">
                        <div class="flex1">
                            <text class="gray" :style="{fontSize:GLOBAL.bigFS}">有效订单</text>
                            <!--<p class="c-normal fonyMin font-height"><i class="fontjia fontNumb">{{YesterdayIncomes.orderNum}} </i>单</p>-->
                            <!--<p class="">较前日-->
                            <!--<i v-if="subcomes.num==0">&#45;&#45;持平</i>-->
                            <!--<i :class="[subcomes.num>0?'fa-up':'fa-down']" v-else>{{subcomes.num|abs}}单</i>-->
                            <!--</p>-->
                            <div class=" dataText row">
                                <text class="black numberSmall" >{{YesterdayIncomes.orderNum}}</text>
                                <text class="black" :style="{fontSize:GLOBAL.defaultFS}">单</text>
                            </div>
                            <div class="row mt18">
                                <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">较前日 </text>
                                <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}" v-if="subcomes.num==0">&#45;&#45;持平</text>
                                <text class="black" :class="[subcomes.num>0?'faUp':'faDown']" :style="{fontSize:GLOBAL.bigFS}" v-else>{{subcomes.num|abs}}人{{subcomes.num>0?'↑':'↓'}}</text>
                            </div>
                        </div>
                        <div class="doBusinessLine"></div>
                        <div class="flex1">
                            <text class="gray" :style="{fontSize:GLOBAL.bigFS}">营业额</text>
                            <!--<p class="c-normal fonyMin font-height">￥<i class="fontjia fontNumb">{{YesterdayIncomes.plan}}</i></p>-->
                            <!--<p class="">较前日-->
                            <!--<i v-if="subcomes.plan==0">&#45;&#45;持平</i>-->
                            <!--<i :class="[subcomes.plan>0?'fa-up':'fa-down']" v-else>{{subcomes.plan|abs}}元</i>-->
                            <!--</p>-->
                            <div class=" dataText row">
                                <text class="black" :style="{fontSize:GLOBAL.defaultFS}">￥</text>
                                <text class="black numberSmall" >{{YesterdayIncomes.plan}}</text>
                            </div>
                            <div class="row mt18">
                                <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">较前日 </text>
                                <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}" v-if="subcomes.plan==0">&#45;&#45;持平</text>
                                <text class="black" :class="[subcomes.plan>0?'faUp':'faDown']" :style="{fontSize:GLOBAL.bigFS}" v-else>{{subcomes.plan|abs}}元{{subcomes.plan>0?'↑':'↓'}}</text>
                            </div>
                        </div>
                    </div>
                    <div class="panelBody">
                        <div class="row">
                            <!--<i class="c-grayest">无效订单 </i><span class="fontNumb">{{YesterdaytodayOut.orderNum}}</span>单-->
                            <text class="gray " :style="{fontSize:GLOBAL.bigFS}">无效订单</text>
                            <text class="black " :style="{fontSize:GLOBAL.bigFS}"> {{YesterdaytodayOut.orderNum}}单</text>
                        </div>
                        <div class="row">
                            <!--<i class="c-grayest">损失金额 </i>￥<span class="fontNumb">{{YesterdaytodayOut.plan}}</span>-->
                            <text class="gray " :style="{fontSize:GLOBAL.bigFS}">损失金额</text>
                            <text class="black " :style="{fontSize:GLOBAL.bigFS}"> {{YesterdaytodayOut.plan}}￥</text>
                        </div>
                    </div>
                </div>

                <!--昨日 体验结果-->
                <!--<div class="panel">-->
                <!--<div class="panelHeading row aiCenter ">-->
                <!--<div class="panelHeadingIcon"></div>-->
                <!--<text class="black" :style="{fontSize:GLOBAL.biggerFS}">昨日 体验结果</text>-->
                <!--</div>-->
                <!--<div class="panelBody row aiCenter jcSb">-->
                <!--<div class="row aiCenter">-->
                <!--<div class="fractionBox aiCenter jcCenter">-->
                <!--<div class="fraction row">-->
                <!--<text class="fractionNumber red">64</text>-->
                <!--<text class="fractionText red" :style="{fontSize:GLOBAL.smallerFS}">分</text>-->
                <!--</div>-->
                <!--</div>-->
                <!--<div class="inlineTop">-->
                <!--<div class="row">-->
                <!--<text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">门店存在</text>-->
                <!--<text class="red" :style="{fontSize:GLOBAL.bigFS}">4个</text>-->
                <!--<text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">问题项</text>-->
                <!--</div>-->
                <!--<text class="gray mt8" :style="{fontSize:GLOBAL.bigFS}">建议尽快优化</text>-->
                <!--</div>-->
                <!--</div>-->
                <!--<text class="gray" :style="{fontSize:GLOBAL.bigFS}">立即优化 ></text>-->
                <!--</div>-->
                <!--</div>-->
            </div>

            <!-- 近7日 经营数据 -->
            <div class="weekBox" v-else>
                <!--近7日 下单顾客-->
                <div class="panel">
                    <div class="panelHeading row aiCenter ">
                        <div class="panelHeadingIcon"></div>
                        <text class="black" :style="{fontSize:GLOBAL.biggerFS}">近7日 下单顾客</text>
                    </div>
                    <div class="whole">

                        <web ref="firWebview" class="customer"  src="https://www.aftdc.com/mobile/public/echarts.html"
                             @pagestart="" @pagefinish="firOnPageFinish" @error="" @receivedtitle=""></web>

                        <div class="row aiCenter" v-if="orderCalc.max.value != orderCalc.min.value">
                            <div class="sevenData flex1">
                                <text class="gray" :style="{fontSize:GLOBAL.bigFS}">单日顾客最高({{orderCalc.max.month}})</text>
                                <div class="sevenDataText row">
                                    <text class="black lineHeight" :style="{fontSize:GLOBAL.biggerFS}">{{orderCalc.max.value}}</text>
                                    <text class="black" :style="{fontSize:GLOBAL.smallerFS}">人</text>
                                </div>
                            </div>
                            <div class="sevenDataLIne"></div>
                            <div class="sevenData flex1">
                                <text class="gray" :style="{fontSize:GLOBAL.bigFS}">单日顾客最低({{orderCalc.min.month}})</text>
                                <div class="sevenDataText row">
                                    <text class="black lineHeight" :style="{fontSize:GLOBAL.biggerFS}">{{orderCalc.min.value}}</text>
                                    <text class="black" :style="{fontSize:GLOBAL.smallerFS}">人</text>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!--近7日 有效订单-->
                <div class="panel">
                    <div class="panelHeading row aiCenter ">
                        <div class="panelHeadingIcon"></div>
                        <text class="black" :style="{fontSize:GLOBAL.biggerFS}">近7日 有效订单</text>
                    </div>
                    <web ref="secWebview" class="customer"  src="https://www.aftdc.com/mobile/public/echarts.html"
                         @pagestart="" @pagefinish="secOnPageFinish" @error="" @receivedtitle=""></web>
                    <div class="row aiCenter" v-if="validCalc.max.value != validCalc.min.value">
                        <div class="sevenData flex1">
                            <text class="gray" :style="{fontSize:GLOBAL.bigFS}">单日顾客最高({{validCalc.max.month}})</text>
                            <div class="sevenDataText row">
                                <text class="black lineHeight" :style="{fontSize:GLOBAL.biggerFS}">{{validCalc.max.value}}</text>
                                <text class="black" :style="{fontSize:GLOBAL.smallerFS}">单</text>
                            </div>
                        </div>
                        <div class="sevenDataLIne"></div>
                        <div class="sevenData flex1">
                            <text class="gray" :style="{fontSize:GLOBAL.bigFS}">单日顾客最低({{validCalc.min.month}})</text>
                            <div class="sevenDataText row">
                                <text class="black lineHeight" :style="{fontSize:GLOBAL.biggerFS}">{{validCalc.min.value}}</text>
                                <text class="black" :style="{fontSize:GLOBAL.smallerFS}">单</text>
                            </div>
                        </div>
                    </div>
                </div>

                <!--近7日 商品分析-->
                <div class="panel" >
                    <div class="panelHeading row aiCenter ">
                        <div class="panelHeadingIcon"></div>
                        <text class="black" :style="{fontSize:GLOBAL.biggerFS}">近7日 商品分析</text>
                    </div>
                    <!--<table width="100%" v-if="goods&&goods.length>0">-->
                    <!--<tr class="bg-gray">-->
                    <!--<th width="50%" style="text-align: left">&nbsp;&nbsp;&nbsp;菜品</th>-->
                    <!--<th width="20%" style="text-align: right">销量(份)</th>-->
                    <!--<th width="30%"style="text-align: right">售价(元)&nbsp;&nbsp;</th>&lt;!&ndash;销售额&ndash;&gt;-->
                    <!--</tr>-->
                    <!--<tr v-for="(item,index) in goods" :class="[index%2!==0?'bg-gray':'']">-->
                    <!--<td width="50%">&nbsp;&nbsp;{{item.name}}</td>-->
                    <!--<td width="20%" style="text-align: right">{{item.numb}}&nbsp;</td>-->
                    <!--<td width="30%" style="text-align: right">{{item.price}}&nbsp;&nbsp;&nbsp;</td>-->
                    <!--</tr>-->
                    <!--</table>-->
                    <div v-if="goods">
                        <div class="tr bgGray row aiCenter">
                            <text class="tdLeft" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">菜品</text>
                            <text class="tdMiddle" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">销量(份)</text>
                            <text class="tdRight" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">单价(元)</text><!--销售额-->
                        </div>
                        <div class="tr row aiCenter" v-for="(item,index) in goods" :class="[index%2!==0?'bgGray':'']">
                            <text class="tdLeft" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">{{item.goodsName}}</text>
                            <text class="tdMiddle" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">{{item.goodsNums}}</text>
                            <text class="tdRight" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">{{item.marketPrice}}</text>
                        </div>
                    </div>
                    <div class="notContent aiCenter" v-else>
                        <text :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">暂无商品</text>
                    </div>
                </div>
            </div>

        </scroller>


    </div>

</template>

<script>
    import {WxcMinibar} from 'weex-ui';
    // var stream = weex.requireModule('stream');
    const post = weex.requireModule('stream');
    const event = weex.requireModule('event');
    // Vue.filter('abs', function (value) {
    //     return Math.abs(value);
    // });
    const webview = weex.requireModule('webview');
    export default {
        //过滤器
        filters: {
            abs (value) {
                return Math.abs(value);
            }
        },
        components: {WxcMinibar},
        data() {
            return {

                statisticsTime: '',//统计时间
                dataState: false,
                dateChoice: 1,
                number: {},//流量概况
                yed: {},
                subYed: {},
                YesterdayIncomes: {},
                YesterdaytodayOut: {},
                subcomes: {},
                // 近7日
                order: [],//下单顾客
                orderCalc: {max: '', min: ''},//最高，最低值
                valid: [],//有效订单
                validCalc: {max: '', min: ''},//最高，最低值
                goods: [],

                shopId:0,

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
                            interval: 1000,
                            showMinLabel: true,
                            showMaxLabel: true,
                        },
                        axisPointer:{
                            lineStyle:{
                                color:'#53beb7'
                            }
                        },
                    },
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
                },
                pieOption:{
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b}: {c} ({d}%)",
                        textStyle:{
                            fontSize:8,
                        },
                    },
                    series: [
                        {
                            name:'新老客比例',
                            type:'pie',
                            radius: ['50%', '70%'],
                            avoidLabelOverlap: false,
                            label: {
                                normal: {
                                    show: false,
                                    position: 'center'
                                },
                                emphasis: {
                                    show: true,
                                    textStyle: {
                                        fontSize: '12',
                                        fontWeight: 'bold'
                                    }
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data:[]
                        }
                    ]
                },
                token:'',
                imei:'',
            }
        },
        created: function () {
            let that = this;
            //获取昨日时间
            let myDate = new Date();//获取系统当前时间
            let year = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
            let month = myDate.getMonth() + 1; //获取当前月份(0-11,0代表1月)
            let date = myDate.getDate() - 1; //获取当前日(1-31)（-1昨日）
            that.statisticsTime = year + "-" + month + "-" + date; //昨日时间
            event.init();
            this.token = weex.config.token;
            this.imei = weex.config.imei;
        },
        mounted: function () {
            this.dataRequest(1)
        },
        methods: {

            minibarLeftButtonClick(){

            },
            datefn: function (index) {
                var that = this;
                that.dateChoice = index;


                if (index === 7 && !that.dataState) {//首次请求数据
                    that.dataState = true;
                    this.dataRequest(7)
                }

            },

            dataRequest: function (day) {
                var param = this.GLOBAL.sign(this.token,this.imei);
                var that = this;
                param += '&day=' + day + '&page=' + 0;
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/businessapp/Manage/getIndex',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                }, function (res) {
                    if (day === 1) {

                        that.number = res.data.number;//流量概况

                        var yed = res.data.yed;//昨日新老客
                        var yedt = res.data.yedt;//前日新老客
                        var subYed = {};
                        subYed.newsub = yed.newOrderNum - yedt.newOrderNum;
                        subYed.oldsub = yed.oldOrderNum - yedt.oldOrderNum;
                        that.yed = yed;
                        that.subYed = subYed;//数据比
                        var BeforedayIncomes = res.data.arr.BeforedayIncomes; //前日数据
                        var YesterdayIncomes = res.data.arr.YesterdayIncomes; //昨日数据；
                        var subcomes = {};
                        subcomes.num = YesterdayIncomes.orderNum - BeforedayIncomes.orderNum;
                        subcomes.plan = YesterdayIncomes.plan - BeforedayIncomes.plan;
                        that.subcomes = subcomes;
                        that.YesterdayIncomes = YesterdayIncomes;
                        that.YesterdaytodayOut = res.data.arr.YesterdaytodayOut
                    } else {
                        var order = res.data.order;
                        that.order = order;
                        var tendency = res.data.tendency;//有效订单
                        that.valid = tendency;
                        that.goods = res.data.goods;

// 计算最高最低-----
                        that.orderCalc = that.calcFn(order);
                        that.validCalc = that.calcFn(tendency);
// 渲染图例-----
                        that.customerOrder({
                            id: 'customer',
                            color: '#53beb7',
                            datas: order,
                        });//渲染下单顾客

                        that.customerOrder({
                            id: 'valids',
                            color: '#EEAD0E',
                            datas: tendency,
                        });//渲染有效订单
                    }
                })


            },
//计算最高最低
            calcFn: function (data) {
                var max = new Object(data[0]), min = new Object(data[0]);
                var len = data.length;
                for (var i = 1; i < len; i++) {
                    if (max.value < data[i].value) {
                        max = new Object(data[i])
                    } else if (min.value > data[i].value) {
                        min = new Object(data[i])
                    }
                }
                return {max: max, min: min};
            },
            //获取 URL 传过来的值
            getQueryString(name) {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
                var r = window.location.search.substr(1).match(reg);
                if (r != null) return unescape(r[2]);
                return null;
            },
            firOnPageFinish(){
                var that=this
                let option=that.option
                option.xAxis.data=[]
                option.series[0].data=[]
                option.series[0].name='下单顾客'
                option.tooltip.formatter='{b}<br>{a}：{c}人'
                option.series[0].itemStyle.normal.color='#53beb7'
                option.xAxis.axisPointer.lineStyle.color='#53beb7'
                for(var i in that.order){

                    option.xAxis.data.push(that.order[i].month)
                    option.series[0].data.push(that.order[i].value)
                }

                webview.postMessage(that.$refs.firWebview, {message: {option:option,chartType:0}});
            },
            secOnPageFinish(){
                var that=this
                let option=that.option
                option.xAxis.data=[]
                option.series[0].data=[]
                option.series[0].itemStyle.normal.color='#eead0e'
                option.series[0].name='有效订单'
                option.tooltip.formatter='{b}<br>{a}：{c}单'
                option.xAxis.axisPointer.lineStyle.color='#eead0e'
                for(var i in that.valid){

                    option.xAxis.data.push(that.valid[i].month)
                    option.series[0].data.push(that.valid[i].value)
                }

                webview.postMessage(that.$refs.secWebview, {message: {option:option,chartType:0}});
            },
            thrOnPageFinish(){
                var that=this
                let option=that.pieOption
                option.series[0].data=[{value:that.yed.oldOrderNum,name:'老客'},{value:that.yed.newOrderNum,name:'新客'}]
                webview.postMessage(that.$refs.thrWebview, {message: {option:option,chartType:0}});
            },

            //跳转
            toAppCount(){
                var that=this
                var param=''
                var url='https://assets/appCount.js'
                event.toUrl({"url":url,"param":param})
            },
            toAppGuest(){
                var that=this
                var param=''
                var url='https://assets/appGuest.js'
                event.toUrl({"url":url,"param":param})
            },
            toAppFlow(){
                var that=this
                var param=''
                var url='https://assets/appFlow.js'
                event.toUrl({"url":url,"param":param})
            },
            toAppShop(){
                var that=this
                var param=''
                var url='https://assets/appShop.js'
                event.toUrl({"url":url,"param":param})
            },
            toAppCount_del(){
                var that=this
                var param=''
                var url='https://assets/appCount_del.js'
                event.toUrl({"url":url,"param":param})
            }

        }
    }



</script>

<style scoped>

    .faDown {
        color: #0bdf38;
    }
    .faUp{
        color: #f10717;
    }

    .wrapper {
        position: relative;
        flex-direction: column;
    }
    .minibar {
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: #f1f1f1;
    }
    .dColor {
        color: #666;
    }
    .black {
        color: #525252;
    }
    .gray {
        color: #959595;
    }
    .red {
        color: #ff3e66;
    }
    .jcSb {
        justify-content: space-between;
    }
    .flex1 {
        flex: 1;
    }
    .row {
        flex-direction: row;
    }
    .aiCenter {
        align-items: center;
    }
    .jcCenter {
        justify-content: center;
    }

    /*数据统计*/
    .title {
        background-color: #efefef;
        padding-left: 25px;
        padding-top: 15px;
        padding-bottom: 15px;
    }
    .header {
        padding-top: 26px;
        padding-bottom: 36px;
    }
    .tabBar {
        flex: 1;
        align-items: center;
        justify-content: center;
    }
    .headerImg {
        width: 55px;
        height: 55px;
        margin-bottom: 18px;
    }
    .headerLine{
        width: 2px;
        height: 60px;
        background-color: #e7e7e7;
    }

    /*经营报告*/
    .choice {
        position: sticky;
        background-color: #fff;
    }
    .choiceItem {
        flex: 1;
        text-align: center;
        padding-top: 24px;
        padding-bottom: 24px;

    }
    .activeBottom {
        width: 375px;
        height: 5px;
        background-color: #53beb7;
        position: absolute;
        left: 0;
        bottom: 0;
    }
    .activeBottomRight {
        left: 375px;
    }
    .activeText {
        color: #53beb7;
    }


    /*昨日 流量概况*/
    .panel {
        border-bottom-width: 20px;
        border-bottom-style: solid;
        border-bottom-color: #efefef;
    }
    .panelHeading {
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #efefef;
        padding-top: 26px;
        padding-bottom: 26px;
    }
    .panelHeadingIcon {
        width: 8px;
        height: 30px;
        background-color: #53beb7;
        margin-right: 22px;
    }
    .panelBody {
        padding-left: 30px;
        padding-right: 30px;
        padding-top: 30px;
        padding-bottom: 30px;

    }
    .flowProfileLeft {
        margin-right: 110px;
    }
    .flowProfileRight {
        margin-left: 110px;
    }
    .dataText {
        height: 52px;
        align-items: flex-end;
    }
    .number {
        font-size: 40px;
        line-height: 40px;
        font-weight: bold;
    }

    /*昨日 下单顾客概况*/
    .flexLeftBox{
        width: 14px;
        height: 14px;
        background-color: #53beb7;
        margin-right: 18px;
    }
    .customerData {
        padding-left: 32px;
    }

    .dottedLine {
        height: 190px;
        border-left-width: 2px;
        border-left-style: dashed;
        border-left-color: #ebebeb;
        /*margin-right: 270px;*/
    }
    .flexRight {
        /*background-color: red;*/
    }
    .mt24 {
        margin-top: 24px;
    }

    /*昨日 营业统计*/
    .doBusinessBottom {
        padding-left: 30px;
        padding-right: 30px;
        padding-top: 30px;
        padding-bottom: 30px;
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #efefef;
    }
    .numberSmall {
        font-size: 36px;
        line-height: 36px;
        font-weight: bold;
    }
    .mt18 {
        margin-top: 14px;
    }
    .doBusinessLine {
        height: 120px;
        border-left-width: 2px;
        border-left-style: dashed;;
        border-left-color: #ebebeb;
        margin-right: 28px;
    }

    /*昨日 体验结果*/
    .fractionBox {
        width: 130px;
        height: 130px;
        border-radius: 65px;
        border-width: 2px;
        border-style: solid;
        border-color: #ff3e66;
        border: 1px solid #ff3e66;
        margin-right: 40px;
    }
    .fraction {
        height: 38px;
        /*background-color: red;*/
        align-items: flex-end;
    }
    .fractionNumber {
        font-size: 38px;
        line-height: 38px;
    }
    .fractionText {
        line-height: 30px;
    }
    .mt8 {
        margin-top: 8px;
    }

    /* 近七日 下单顾客 */
    .customer {
        width: 750px;
        height: 288px;
        /*border-width: 2px;*/
        /*border-style: solid;*/
        /*border-color: #e5e4e9;*/

    }
    .sevenDataText {
        height: 38px;
        align-items: flex-end;
    }
    .lineHeight {
        line-height: 32px;
        font-weight: bold;
    }
    .sevenData {
        padding-left: 30px;
        padding-top: 22px;
        padding-bottom: 34px;
        border-top-width: 2px;
        border-top-style: solid;
        border-top-color: #efefef;
    }
    .sevenDataLIne {
        height: 80px;
        border-left-width: 2px;
        border-left-style: dashed;
        border-left-color: #efefef;
    }
    /*近7日 商品分析*/
    .tr {
        height: 86px;
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #f2f2f2;
    }
    .tdLeft {
        flex: 5;
        padding-left: 25px;
    }
    .tdMiddle {
        flex: 2;
        text-align: right;
    }
    .tdRight {
        flex: 3;
        text-align: right;
        padding-right: 25px;
    }
    .bgGray {
        background-color: #f8f8f8;
    }
    .notContent {
        padding-top: 80px;
        padding-bottom: 100px;
    }
    .whole-datas{
        flex-direction: row;
        align-items: center;

    }
    .br-dashed{
        flex-direction: column;
        flex: 1;
        margin-top: 20px;
        margin-bottom: 20px;
        padding-left: 20px;
        padding-right: 20px;
    }


</style>
