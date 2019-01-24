window.onload = function() {
    var shopData = JSON.parse(localStorage.getItem('shopData'));
    if (!shopData) {
        location.href = "/business/Login/index.html";
    } else {

        var app = new Vue({
            el: '.dec',
            data: {},

            methods: {
                adfka_fanClick: function () {
                    history.back(); // 点击 返回上一页
                }
            },
            mounted: function () {
                $(function dnq_om() {
                    var filterNames = [];
                    var data = [


                        {month: '09.20', order: 21.5, stream: 9, type: '有效订单'},
                        {month: '09.21', order: 21.5, stream: 7, type: '有效订单'},
                        {month: '09.22', order: 25.2, stream: 8, type: '有效订单'},
                        {month: '09.23', order: 26.5, stream: 15, type: '有效订单'},
                        {month: '09.24', order: 23.3, stream: 5, type: '有效订单'},
                        {month: '09.25', order: 18.3, stream: 8, type: '有效订单'},
                        {month: '09.26', order: 13.9, stream: 16, type: '有效订单'},
                        {month: '09.27', order: 9.6, stream: 0, type: '有效订单'},

                    ];
                    var chart = new G2.Chart({
                        id: 'dnq_om',
                        forceFit: true,
                        height: 280,
                    });
                    var Util = G2.Util;
                    var Stat = G2.Stat;

                    chart.source(data, {
                        month: {
                            alias: '日期',
                            range: [0, 1] //0代表是坐标（0,0）
                        },
                        order: {
                            alias: '活动订单',
                            range: [0, 1],
                            min: 0,
                            tickCount: 6
                        },
                        stream: {
                            alias: '活动流水',
                            range: [0, 1],
                            min: 0,
                            tickCount: 6
                        },
                        type: { //设置条件，显示不同的颜色
                            type: 'cat',
                        },


                    });
                    var axiss = {
                        title: null, // 不展示 xDim 对应坐标轴的标题
                        line: {
                            lineWidth: 1, // 设置线的宽度
                            stroke: '#000', // 设置线的颜色
                            lineDash: 1 // 设置虚线
                        },
                        tickLine: {
                            lineWidth: 1,
                            stroke: '#000'

                        },
                        grid: {
                            line: {
                                stroke: '#d9d9d9',
                                lineWidth: 1,
                                lineDash: 1
                            }
                        }
                    }

                    //坐标轴处理
                    chart.axis('order', axiss);
                    chart.axis('month', axiss);
                    chart.axis('stream', axiss);

                    //chart.axis('value', false);

                    //提示框
                    chart.tooltip(true, {
                        crosshairs: true,
                    });
                    //图例
                    chart.legend({
                        title: null, // 不展示图例的标题
                        marker: 'square', // 设置图例 marker 的显示样式
                    });
                    chart.legend(false); // 关掉自带图例
                    chart.line().position('month*order').color("#DC143C").size(2);
                    chart.line().position('month*stream').color("#515151").size(2);

                    var monthStart = data[0].month
                    var monthEnd = data[data.length - 1].month

                    chart.point().position('month*order').shape('hollowCircle').size('month', function (val) {
                        if (val == monthStart || val == monthEnd) {
                            return 5;
                        } else {
                            return 0;
                        }
                    });

                    chart.point().position('month*stream').shape('hollowCircle').size('month', function (val) {
                        if (val == monthStart || val == monthEnd) {
                            return 5;
                        } else {
                            return 0;
                        }
                    });

                    chart.render();

                })
            }
        })
    }
}

//图表




