// 过滤器
Vue.filter('abs', function (value) {
    return Math.abs(value);
});
var app = new Vue({
    el: '#indexBox',
    data: {
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
        goods: false,

        shopId:0
    },
    created: function () {
        let that = this;
        //获取昨日时间
        let myDate = new Date();//获取系统当前时间
        let year = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
        let month = myDate.getMonth() + 1; //获取当前月份(0-11,0代表1月)
        let date = myDate.getDate() - 1; //获取当前日(1-31)（-1昨日）
        that.statisticsTime = year + "-" + month + "-" + date; //昨日时间
        that.shopId = that.getQueryString('shopId');
    },
    mounted: function () {
        this.dataRequest(1)
    },
    methods: {
        datefn: function (index) {
            var that = this;
            that.dateChoice = index;

            that.$nextTick(function () {
                if (index === 7 && !that.dataState) {//首次请求数据
                    that.dataState = true;
                    this.dataRequest(7)
                }
            })
        },

        dataRequest: function (day) {
            var that = this;
            var shopId = that.shopId;
            $.ajax({
                url: 'https://www.aftdc.com/mobile/Manage/getIndex',
                data: {
                    day: day,
                    shopId: shopId,
                    page: 0
                },
                type: 'post',
                success: function (res) {
                    if (day === 1) {
                        that.number = res.number;//流量概况
                        var yed = res.yed;//昨日新老客
                        var yedt = res.yedt;//前日新老客
                        var subYed = {};
                        subYed.newsub = yed.newOrderNum - yedt.newOrderNum;
                        subYed.oldsub = yed.oldOrderNum - yedt.oldOrderNum;
                        that.yed = yed;
                        that.subYed = subYed;//数据比
                        var BeforedayIncomes = res.arr.BeforedayIncomes; //前日数据
                        var YesterdayIncomes = res.arr.YesterdayIncomes; //昨日数据；
                        var subcomes = {};
                        subcomes.num = YesterdayIncomes.orderNum - BeforedayIncomes.orderNum;
                        subcomes.plan = YesterdayIncomes.plan - BeforedayIncomes.plan;
                        that.subcomes = subcomes;
                        that.YesterdayIncomes = YesterdayIncomes;
                        that.YesterdaytodayOut = res.arr.YesterdaytodayOut
                    } else {
                        var order = res.order;
                        that.order = order;
                        var valid = [];
                        var tendency = res.tendency;//订单收入 ,营业总额，有效订单，无效订单
                        var len = tendency.length;
                        for (var i = 0; i < len; i++) {
                            if (tendency[i].type === "订单收入") {
                                valid.push(new Object(tendency[i]))
                            }
                        }
                        that.valid = valid;
                        that.goods = res.goods;
// 计算最高最低-----
                        that.orderCalc = that.calcFn(order);
                        that.validCalc = that.calcFn(valid);
// 渲染图例-----
                        that.customerOrder({
                            id: 'customer',
                            color: '#53beb7',
                            datas: order,
                        });//渲染下单顾客

                        that.customerOrder({
                            id: 'valids',
                            color: '#EEAD0E',
                            datas: valid,
                        });//渲染有效订单
                    }
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
        // 图例
        customerOrder: function (variable) {

            let {id, color, datas} = variable
            document.getElementById(id).innerHTML = '';
            // var data=[
            // { month: '12.30', value: 5 },
            // { month: '12.31', value: 1 },
            // { month: '01.01', value: 1 },
            // { month: '01.02', value: 10 },
            // { month: '01.03', value: 3 },
            // { month: '01.04', value: 9 },
            // { month: '01.05', value: 1 }
            // ]
            var data = datas;
            var heig = document.getElementById(id).clientWidth;
            var chart = new G2.Chart({
                container: id, // 指定图表容器 ID
                forceFit: true,
                height: heig / 2.5, // 指定图表高度
                padding: [5, 25, 35, 25]
            });

            chart.source(data);
// 指定度量(或称 列定义）
            chart.scale('month', {
                title: null,
                min: 0,
                range: [0, 1],
                // tickCount: 12-----------------------------------------------
            });
            chart.scale('value', {
                title: null,
                range: [0, 1],
                tickCount: 3,

            });

            chart.legend('value', false); //不显示图例
            chart.axis('value', {
                label: null,
                grid: { //网格
                    type: 'line',
                    lineStyle: {
                        stroke: '#9a9a9a',
                        lineWidth: 0.5,
                        lineDash: 1,
                    }
                },
                tickLine: {
                    lineWidth: 0,
                    value: 3,
                },
            });
            chart.axis('month', {
                label: {
                    formatter: val => {
                        if (val === data[0].month || val === data[data.length - 1].month) {
                            return val;
                        } else {
                            return ''
                        }

                    },
                    textStyle: {
                        fill: '#9a9a9a'
                    },
                },

                tickLine: {
                    length: 0,
                },
                grid: { //网格
                    type: 'line',
                    lineStyle: {
                        stroke: '#9a9a9a',
                        lineWidth: 0.5,
                        lineDash: 1, //实线 [4,4]这种格式是虚线
                    }
                },

            });
// 应该改为最高和最低
            var monthStart = data[0].value;
            var lenz = Math.round(data.length / 2);
            var monthEnd = data[lenz - 1].value;

            chart.line().position('month*value').color(color).size(2);
            chart.point().position('month*value').color(color).size('value', function (val) {
                if (val === monthStart || val === monthEnd) {
                    return 4;
                } else {
                    return 0;
                }
            }).shape('circle');//点
            chart.render();

        },
        //获取 URL 传过来的值
        getQueryString(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        },
        back(){
            history.back();
        }
    },
});

