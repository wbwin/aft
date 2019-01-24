window.onload = function () {
    var app = new Vue({
        el: '.article',
        data: {
            aa: 'aaaaa',
            option: {
                tooltip: {
                    show: true,
                    trigger: 'axis',
                    confine: 'true',
                    textStyle: {
                        fontSize: 12,
                    },

                    formatter: function (params) {

                    }

                },
                legend: {
                    orient: 'vertical',
                    y: 'center',
                    right: '1%',
                    itemWidth: 12,
                    itemHeight: 12,
                    data: ['昨日', '今日'],
                    textStyle: {    //图例文字的样式
                        fontSize: 9
                    }
                },
                xAxis: {
                    axisLine: {show: true, onZero: false},
                    axisTick: {show: false},//刻度线
                    splitLine: {show: true, interval: 0,},//辅助线
                    boundaryGap: false,
                    // data: [0,2,],
                    // axisLabel: {//只显示最小值最大值
                    //     interval: 1000,
                    //     showMinLabel: true,
                    //     showMaxLabel: true,
                    // },
                    min: 0,
                    max: 22,
                    splitNumber: 12,
                    type: 'value',
                    axisPointer: {
                        lineStyle: {
                            color: '#53beb7'
                        }
                    },
                },
                yAxis: {
                    // splitLine: {show: false},//辅助线
                    axisTick: {show: false},//刻度线
                    // axisLine: {show: false,onZero: false},//坐标轴线
                    // axisLabel: {show: false},//坐标轴提示文字
                    type: 'value',
                    tickCount: 5,
                },
                grid: {//直角坐标系边距
                    left: 50,
                    right: 50,
                    top: '10',
                    bottom: '30',
                },
                series: [{
                    name: '昨日',
                    type: 'line',
                    smooth: true,
                    data: '',
                    // symbol: 'none', //设置拐点格式样式 如:实心圆，空心圆或不显示拐点等
                    itemStyle: {
                        normal: {
                            color: '#53beb7',
                            lineStyle: {
                                // color :"#53beb7", //设置拐点颜色
                                width: 2 //设置各个拐点连接的线条颜色
                            },
                        },

                    },

                    symbolSize: 8, //设置各个拐点的大小

                },
                    {
                        name: '今日',
                        type: 'line',
                        data: '',
                        smooth: true,
                        // symbol: 'none', //设置拐点格式样式 如:实心圆，空心圆或不显示拐点等
                        itemStyle: {
                            normal: {
                                color: '#eead0e',
                                lineStyle: {
                                    // color :"#53beb7", //设置拐点颜色
                                    width: 2 //设置各个拐点连接的线条颜色
                                },
                            },

                        },

                        symbolSize: 8, //设置各个拐点的大小

                    }],
                // animationEasingUpdate:'linear',
            }
        },
        created: function () {

        },
        mounted:function() {

            window.addEventListener('message', event => {
                var chartType = event.data.message.chartType
                if (chartType == 1) {
                    var chart = event.data.message.chart
                    var option = this.option
                    var firData = []
                    var secData = []
                    for (var i in chart) {
                        var dataItem = [chart[i].hour, chart[i].value]
                        if (chart[i].type == '昨日') {
                            firData.push(dataItem)
                        }
                        if (chart[i].type == '今日') {
                            secData.push(dataItem)
                        }
                    }

                    option.series[0].data = firData
                    option.series[1].data = secData
                    // option.series[1].data[1][1]=26.60
                    //  option.series[0].data[3][1]=55.66
                    option.tooltip.formatter = function (params) {

                        let hour = ''
                        let res = ''
                        let hour_end = ''
                        for (var i in params) {
                            hour = params[0].value[0]
                            hour_end = hour + 1;
                            hour_end = hour_end >= 10 ? hour_end : '0' + hour_end;
                            hour = hour >= 10 ? hour : '0' + hour;
                            res += params[i].marker + params[i].seriesName + '：￥' + params[i].value[1] + '<br/>'
                        }
                        res = hour + ':00-' + hour_end + ':59<br />' + res
                        return res

                    }
                }
                if (chartType == 0) {
                    var option = event.data.message.option
                }

                this.$nextTick(function () {
                    var myChart = echarts.init(document.getElementById('main'));
                    myChart.clear()
                    myChart.setOption(option, true);
                })


            })
        }
    })
}