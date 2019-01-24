window.onload = function () {
    var shopData = JSON.parse(localStorage.getItem('shopData'));
    if (!shopData) {
        location.href = "/business/Login/index.html";
    } else {



        var app = new Vue({
            el: '#app',
            data: {
                navNumb: 1, //顾客概况和结构
                surveyTime: 1, //顾客概况的时间按钮

                frameNav: 1,
                frameTime: 1,

                /*本店顾客偏好  people人数  numb 份数*/ //原本thisShop已被注释
                thisShop: [
                    {name: '小份周瑜酿皮+黄牛肉夹馍1个+300ml饮料', people: '15', numb: '20'},
                    {name: '小份周瑜酿皮+黄牛肉夹馍1个+300ml饮料', people: '20', numb: '20'},
                    {name: '小份周瑜酿皮+黄牛肉夹馍1个+300ml饮料', people: '15', numb: '20'},
                    {name: '小份周瑜酿皮+黄牛肉夹馍1个+300ml饮料', people: '1', numb: '2'},
                    {name: '小份周瑜酿皮+黄牛肉夹馍1个+300ml饮料', people: '15', numb: '20'},
                    {name: '小份周瑜酿皮+黄牛夹馍1个+300ml饮料', people: '15', numb: '20'},
                    {name: '小份周瑜酿皮+黄牛肉夹馍1个+300ml饮料', people: '15', numb: '20'},
                    {name: '小份周瑜酿皮+黄牛肉夹馍1个+300ml饮料', people: '15', numb: '20'},
                    {name: '小份周瑜酿皮+黄牛肉夹馍1个+300ml饮料', people: '10', numb: '20'},
                    {name: '小份周瑜酿皮+黄牛肉夹馍1个+300ml饮料', people: '15', numb: '20'},
                    {name: '小份周瑜酿皮+黄牛肉夹馍1个+300ml饮料', people: '15', numb: '20'},
                    {name: '小份周瑜酿皮+黄牛肉夹馍1个+300ml饮料', people: '10', numb: '20'},

                ],

                tipsData: {togle: false, styles: {top: 0, left: 0}, txt: '这就是提示框啊'}, //鼠标经过事件

                brisk: [ //顾客活跃度饼状图
                    {name: '活跃顾客', value: 5},
                    {name: '沉默顾客', value: 4},
                    {name: '流失顾客', value: 3},
                ],
                date: '',
                dataz: '',
                dateStr: '昨日',
                orderCount: 0,
                QorderCount: 0,
                YorderCount: 0,
                subOrder: 0,
                subOrder1: 0,
                subOrder2: 0,
                choday: '',
                oldOrderNum: 0,
                newOrderNum: 0,
                newPer: '',
                newPer1: '',
                oldPer: '',
                oldPer1: '',
                sub: 0,
                sub1: 0,
                sub2: 0,
                subAll: 0,
                reOrderNum: 0,
                yed: [],
                yedt: [],
                rePer: 0,
                TwoArr: [],
                SanArr: [],
                OneArr: [],
                timeArr: []
            },
            created: function () {
                //获取数据
                var that = this;
                axios({
                    method: "post",
                    url: 'https://www.aftdc.com/Business/Analy/getAnalyGuest',
                    data: {
                        day: 1,
                        token: shopData.token
                    },
                }).then(function (res) {
                    if (res.data.res == -1) {
                        alert(res.data.reason)
                        localStorage.removeItem('shopData');
                        location.href = "/business/Login/index.html";
                    }
                    console.log(res);

                    that.dataz = res.data.data
                    that.date = res.data.data.date
                    that.orderNum = res.data.data.order
                    that.yed = res.data.data.yed
                    that.yedt = res.data.data.yedt
                    that.thisShop = res.data.data.customerLike
                    that.yesterdays();
                })
            },

            methods: {
                navFn: function (index) {
                    var that = this
                    that.navNumb = index;
                    that.$nextTick(function () {
                        if (index == 2) {
                            //判断用户是否在顾客概况  页面保存时间筛选分组
                            var shopId = $('input[name=shopId]').val()
                            var timeArr = $.cookie('timeArr' + shopId)
                            console.log(timeArr)
                            if (timeArr != 'null' && Boolean(timeArr)) {
                                timeArr = JSON.parse(timeArr);
                                $("input[name=OnePon]").val(timeArr[0].start);
                                $("input[name=OnePon1]").val(timeArr[0].end);
                                $("input[name=TwoPon]").val(timeArr[1].start);
                                $("input[name=TwoPon1]").val(timeArr[1].end);
                                $("input[name=SanPon]").val(timeArr[2].start);
                                $("input[name=SanPon1]").val(timeArr[2].end);
                                $.cookie('timeArr' + shopId, JSON.stringify(timeArr), {expires: 7})
                            } else {
                                $("input[name=OnePon]").val(1);
                                $("input[name=OnePon1]").val(30);
                                $("input[name=TwoPon]").val(30);
                                $("input[name=TwoPon1]").val(90);
                                $("input[name=SanPon]").val(90);
                                $("input[name=SanPon1]").val(120);
                            }

                            var OnePon = $("input[name=OnePon]").val(); // 获取 活跃顾客 【天数   1】
                            var OnePon1 = $("input[name=OnePon1]").val(); // 获取 活跃顾客 【天数   1】
                            var TwoPon = $("input[name=TwoPon]").val(); // 获取 活跃顾客 【天数   1】
                            var TwoPon1 = $("input[name=TwoPon1]").val(); // 获取 活跃顾客 【天数   1】
                            var SanPon = $("input[name=SanPon]").val(); // 获取 活跃顾客 【天数   1】
                            var SanPon1 = $("input[name=SanPon1]").val(); // 获取 活跃顾客 【天数   1】
                            var timeArr = [{start: OnePon, end: OnePon1}, {start: TwoPon, end: TwoPon1}, {
                                start: SanPon,
                                end: SanPon1
                            }]
                            that.timeArr = timeArr
                            axios({
                                method: "post",
                                url: 'https://www.aftdc.com/Business/Analy/customer',
                                data: {
                                    timeArr: JSON.stringify(timeArr),
                                    token: shopData.token
                                },
                            }).then(function (res) {
                                if (res.data.res == -1) {
                                    alert(res.data.reason)
                                    localStorage.removeItem('shopData');
                                    location.href = "/business/Login/index.html";
                                }
                                console.log(res);
                                that.brisk = res.data.data
                                that.cakeCharts();
                            })
                        }
                        that.funPublic();
                    })

                },

                chooseCount: function (index) {
                    //console.log(index)
                    var that = this
                    var day = that.day
                    if (index > 1) {
                        axios({
                            method: "post",
                            url: 'https://www.aftdc.com/Business/Analy/getConsumer',
                            data: {
                                index: index,
                                day: day,
                                token: shopData.token
                            },
                        }).then(function (res) {
                            if (res.data.res == -1) {
                                alert(res.data.reason)
                                localStorage.removeItem('shopData');
                                location.href = "/business/Login/index.html";
                            }
                            console.log(res);
                            that.orderNum = res.data.data
                            that.trendGuests()
                        })

                    } else {
                        that.orderNum = that.nowOrder
                        that.trendGuests()
                    }
                },
                surveyTimeFn: function (index) {


                    var that = this
                    var day = ''
                    this.surveyTime = index;
                    that.$nextTick(function () {
                        switch (index) {
                            case 1:
                                day = 1
                                that.dateStr = '昨日'
                                break
                            case 2:
                                day = 7;
                                that.dateStr = '近7日'
                                that.choday = '7日'
                                break;
                            case 3:
                                day = 30;
                                that.dateStr = '近30日'
                                that.choday = '30日'
                                break;
                            case 4:
                                day = 90
                                that.dateStr = '近90日'
                                that.choday = '90日'
                                break;
                        }
                        that.day = day
                        axios({
                            method: "post",
                            url: 'https://www.aftdc.com/Business/Analy/getAnalyGuest',
                            data: {
                                day: day,
                                token: shopData.token
                            },
                        }).then(function (res) {
                            if (res.data.res == -1) {
                                alert(res.data.reason)
                                localStorage.removeItem('shopData');
                                location.href = "/business/Login/index.html";
                            }
                            that.date = res.data.data.date
                            that.orderNum = res.data.data.order
                            that.nowOrder = res.data.data.order
                            that.newOrderNum = res.data.data.newOrderNum
                            that.oldOrderNum = res.data.data.oldOrderNum
                            that.ed = res.data.data.ed
                            that.orderCount = res.data.data.orderCount
                            that.reOrderNum = res.data.data.reOrderNum
                            if (res.data.data.yed && res.data.data.yedt) {
                                that.yed = res.data.data.yed
                                that.yedt = res.data.data.yedt
                            }

                            if (index == 1) {
                                that.yesterdays()
                            }

                            if (index != 1) {

                                that.trendGuests()
                            }
                        })


                    })

                },

                //顾客结构 里 的导航
                frameNavFn: function (index) {
                    this.frameNav = index;

                    this.$nextTick(function () {
                        if (index == 2) {
                            var that = this
                            axios({
                                method: "post",
                                url: 'https://www.aftdc.com/Business/Analy/customerValue',
                                data: {
                                    day: 7,
                                    token: shopData.token,
                                },
                            }).then(function (res) {
                                if (res.data.res == -1) {
                                    alert(res.data.reason)
                                    localStorage.removeItem('shopData');
                                    location.href = "/business/Login/index.html";
                                }
                                that.customerNum = res.data.data.customerNum
                                that.customerPay = res.data.data.customerPay
                                that.frequencys(); //成交频次
                                that.moneyPillars(); //成交金额
                            })


                        }

                    });
                },
                frameTimeFn: function (index) {
                    this.frameTime = index
                    if (index == 1) {
                        var day = 7;
                    }
                    if (index == 2) {
                        var day = 30;
                    }
                    if (index == 3) {
                        var day = 90
                    }
                    var that = this
                    axios({
                        method: "post",
                        url: 'https://www.aftdc.com/Business/Analy/customerValue',
                        data: {
                            day: day,
                            token: shopData.token
                        },
                    }).then(function (res) {
                        if (res.data.res == -1) {
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href = "/business/Login/index.html";
                        }
                        that.customerNum = res.data.data.customerNum
                        that.customerPay = res.data.data.customerPay
                        that.frequencys(); //成交频次
                        that.moneyPillars(); //成交金额
                    })

                },
                //回复默认
                defaultSys: function () {
                    var shopId = $('input[name=shopId]').val();
                    $.cookie('timeArr' + shopId, null)

                    this.navFn(2)
                },
                //鼠标经过提示
                tipsOver: function (event, txt) {
                    this.tipsData.togle = true;
                    this.tipsData.txt = txt
                    this.$nextTick(function () {
                        var target = event.target;
                        var w = $(target).innerWidth() / 2
                        var zw = $(".XunisraFk").innerWidth() / 2;
                        var move = w - zw

                        var x = $(target).offset().left + move + 'px';
                        var y = $(target).offset().top - 24 + 'px';
                        this.tipsData.styles = {top: y, left: x};

                    });


                },
                //计算时间分组下拉数值
                funPublic: function () {
                    var Obb = $('input[name=TwoPon1]').val()
                    var Oab = $('input[name=SanPon1]').val()
                    var Ocb = $('input[name=OnePon1]').val()
                    var TwoArr = []
                    for (var i = Number(Obb); i <= 120; i = i + 15) {
                        TwoArr.push(i)
                    }
                    app.TwoArr = TwoArr

                    var SanArr = []
                    for (var i = Number(Oab); i <= 120; i = i + 15) {
                        SanArr.push(i)
                    }
                    app.SanArr = SanArr

                    var OneArr = []
                    for (var i = Number(Ocb); i <= 120; i = i + 15) {
                        OneArr.push(i)
                    }
                    app.OneArr = OneArr
                },
                //顾客概况的  昨日 ->顾客趋向图
                yesterdays: function () {


                    $("#yesterday").empty()
                    var filterNames = [];
                    var that = this;
                    var before = that.orderNum
                    var data = []
                    //转成数字格式
                    var beforeLen = before.length
                    var orderCount = 0;
                    var YorderCount = before[beforeLen - 1].value; //获取昨日下单数
                    var QorderCount = before[beforeLen - 2].value; //获取前日日下单数
                    var subOrder = YorderCount - QorderCount
                    var subOrder1 = that.yed.newOrderNum - that.yedt.newOrderNum
                    var subOrder2 = that.yed.oldOrderNum - that.yedt.oldOrderNum
                    console.log(subOrder)
                    if (subOrder > 0) {
                        $('.fa-down1').attr('class', 'fa-up')

                    } else if (subOrder == 0) {
                        $('.fa-down1').attr('class', 'rotatei')

                    } else {
                        $('.fa-down1').attr('class', 'fa-down')

                    }
                    if (subOrder1 > 0) {
                        $('.fa-down2').attr('class', 'fa-up')

                    } else if (subOrder1 == 0) {
                        $('.fa-down2').attr('class', 'rotatei')

                    } else {
                        $('.fa-down2').attr('class', 'fa-down')

                    }
                    if (subOrder2 > 0) {
                        $('.fa-down3').attr('class', 'fa-up')

                    } else if (subOrder2 == 0) {
                        $('.fa-down3').attr('class', 'rotatei')

                    } else {
                        $('.fa-down3').attr('class', 'fa-down')

                    }
                    for (var i = 0; i < beforeLen; i++) {

                        before[i].value = parseInt(before[i].value * 100) / 100;
                        data[i] = before[i]
                    }
                    that.YorderCount = YorderCount
                    that.QorderCount = QorderCount
                    that.subOrder = Math.abs(subOrder)
                    that.subOrder1 = Math.abs(subOrder1)
                    that.subOrder2 = Math.abs(subOrder2)
                    if (that.YorderCount > 0) {
                        that.newPer1 = Math.round(app.yed.newOrderNum / app.YorderCount * 10000) / 100.00 + "%"
                        that.oldPer1 = Math.round(app.yed.oldOrderNum / app.YorderCount * 10000) / 100.00 + "%"
                    } else {
                        that.newPer1 = '0%'
                        that.oldPer1 = '0%'
                    }

                    var chart = new G2.Chart({
                        id: 'yesterday',
                        forceFit: true,
                        height: 200
                    });
                    var Util = G2.Util;
                    var Stat = G2.Stat;

                    chart.source(data, {
                        month: {
                            alias: '日期',
                            range: [0, 1]
                        },
                        type: { //设置条件，显示不同的颜色
                            type: 'cat',
                        }
                    });

                    //坐标轴处理
                    chart.axis('value', {
                        title: null, // 不展示 xDim 对应坐标轴的标题
                        labels: null,
                        line: {
                            stroke: 'transparent', // 设置线的颜色
                        },
                        tickLine: {
                            lineWidth: 0,
                        },
                        grid: {
                            line: {
                                lineWidth: 0,
                            }
                        }
                    });
                    //提示框
                    chart.tooltip(false);
                    //图例
                    chart.legend({
                        title: null, // 不展示图例的标题
                        marker: 'square', // 设置图例 marker 的显示样式
                    });
                    chart.legend(false); // 关掉自带图例
                    chart.area().position('month*value').color('#06C1AE').shape('smooth').opacity(0.2);
                    chart.line().position('month*value').color('#06C1AE').size(2).shape('smooth');
                    chart.point().position('month*value').color('#06C1AE').size("6").shape('hollowCircle');

                    chart.render();

                },
                trendGuests: function () {
                    $("#trendGuest").empty()
                    var that = this;
                    var filterNames = [];
                    var beforeData = that.orderNum
                    var beforeLen = beforeData.length;
                    var data = []
                    //转成数字格式

                    for (var i = 0; i < beforeLen; i++) {

                        beforeData[i].value = parseInt(beforeData[i].value * 100) / 100;
                        data[i] = beforeData[i]
                    }
                    if (that.orderCount > 0) {
                        that.newPer = Math.round(that.newOrderNum / that.orderCount * 10000) / 100.00 + "%"
                        that.oldPer = Math.round(that.oldOrderNum / that.orderCount * 10000) / 100.00 + "%"
                        that.rePer = Math.round(that.reOrderNum / that.orderCount * 10000) / 100.00 + "%"
                    } else {
                        that.newPer = '0%'
                        that.oldPer = '0%'
                        that.rePer = '0%'
                    }
                    // 新客人数，老客人数 的波动值
                    var sub = that.newOrderNum - that.ed.newOrderNum
                    if (sub > 0) {
                        $('#fa-down5').attr('class', 'fa-up')
                    } else if (sub == 0) {
                        $('#fa-down5').attr('class', 'rotatei')
                    } else {
                        $('#fa-down5').attr('class', 'fa-down')
                    }
                    that.sub = Math.abs(sub)

                    var subAll = that.orderCount - that.ed.orderCount
                    if (subAll > 0) {
                        $('#fa-down4').attr('class', 'fa-up')
                    } else if (subAll == 0) {
                        $('#fa-down4').attr('class', 'rotatei')
                    } else {
                        $('#fa-down4').attr('class', 'fa-down')
                    }
                    that.subAll = Math.abs(subAll)

                    var sub1 = that.oldOrderNum - that.ed.oldOrderNum

                    if (sub1 > 0) {
                        $('#fa-down6').attr('class', 'fa-up')
                    } else if (sub1 == 0) {
                        $('#fa-down6').attr('class', 'rotatei')
                    } else {
                        $('#fa-down6').attr('class', 'fa-down')
                    }
                    that.sub1 = Math.abs(sub1)

                    var sub2 = that.reOrderNum - that.ed.reOrderNum

                    if (sub2 > 0) {
                        $('#fa-down7').attr('class', 'fa-up')
                    } else if (sub2 == 0) {
                        $('#fa-down7').attr('class', 'rotatei')
                    } else {
                        $('#fa-down7').attr('class', 'fa-down')
                    }
                    that.sub2 = Math.abs(sub2)


                    //同行的
                    /*var beforePeer = [
                        { month: '10.14', value: 0.8, },
                        { month: '09.21', value: 2.5, },
                        { month: '09.22', value: 15.2, },
                        { month: '09.23', value: 16.5, },
                        { month: '09.24', value: 13.3, },
                        { month: '09.25', value: 58.3, },
                        { month: '09.26', value: 23.9, },
                        { month: '09.27', value: 9.6, },
                    ]*/
                    /*	var beforePeer=app.orderNum
                        var peerLen=beforePeer.length;
                         var peer=[]
                        //转成数字格式
                        for(var i=0;i<peerLen;i++){
                            beforePeer[i].value=parseInt(beforePeer[i].value*100)/100;
                            peer[i]=beforePeer[i]
                        }





                        //拿到同行优秀中的最大数
                        var maxNumb = 0
                        for(var i in peer) {
                            var val = parseInt(peer[i].value * 100) / 100;
                            if(maxNumb < val) {
                                maxNumb = val
                            }
                        }*/

                    var chart = new G2.Chart({
                        id: 'trendGuest',
                        forceFit: true,
                        height: 260
                    });
                    var Util = G2.Util;
                    var Stat = G2.Stat;

                    var txts = '顾客'
                    var source = {
                        month: {
                            alias: '日期',
                            range: [0, 1]
                        },
                        value: {
                            alias: txts,
                            tickCount: 4,
                            min: 0,
                            //max: maxNumb,
                            formatter: function (val) {
                                return "    " + val + ' 人';
                            }
                        },
                        type: { //设置条件，显示不同的颜色
                            type: 'cat',
                        }

                    };
                    /*	var txts2 = peer[0]['type']
                        var source2 = {
                            month: {
                                alias: '日期',
                                range: [0, 1]
                            },
                            value: {
                                alias: '同行优秀',
                                tickCount: 4,
                                formatter: function(val) {
                                    return "    " + val + ' 人';
                                }
                            },
                            type: { //设置条件，显示不同的颜色
                                type: 'cat',
                            }

                        };*/

                    //坐标轴处理
                    chart.axis('value', {
                        title: null, // 不展示 xDim 对应坐标轴的标题
                        labels: null,
                        line: {
                            stroke: 'transparent', // 设置线的颜色
                        },
                        tickLine: {
                            lineWidth: 0,
                            value: 4,
                        },
                        grid: { //网格
                            line: {
                                lineWidth: 0.5,
                                lineDash: 1,
                            }
                        }
                    });

                    //图例
                    chart.legend({
                        title: null, // 不展示图例的标题
                        marker: 'square', // 设置图例 marker 的显示样式
                    });
                    chart.legend(false); // 关掉自带图例

                    var view1 = chart.createView();
                    view1.source(data, source);

                    view1.line().position('month*value').color('#06C1AE').size(2);
                    view1.point().position('month*value').color('#06C1AE').shape('triangle');

                    chart.render();
                    /*	var view2 = chart.createView();
                        view2.source(peer, source2);
                        view2.line().position('month*value').color('#A0A0A0').size(2).style({ lineDash: [4, 4] });
                        */
                },
                // ----------------------------------------------------  顾客活跃度饼状图  --------------------------------------------------------------------
                cakeCharts: function () {
                    $("#cakeChart").empty()

                    var brisk = app.brisk;

                    var briskLen = brisk.length;
                    var data = []
                    //转成数字格式
                    for (var i = 0; i < briskLen; i++) {
                        brisk[i].value = parseInt(brisk[i].value * 100) / 100;
                        data[i] = brisk[i]
                    }


                    //var data =[
                    /*{ name: '活跃顾客', value: 5 },
                    { name: '沉默顾客', value: 4 },
                    { name: '流失顾客', value: 3 },
                    ]*/
                    //设置方框文字

                    var numbSum = 0
                    var lens = brisk.length;
                    for (var i = 0; i < lens; i++) {
                        var value = parseInt(brisk[i].value);
                        numbSum = numbSum + value
                    }
                    for (var j = 0; j < lens; j++) {
                        var scale = (brisk[j].value / numbSum) * 100;
                        scale = scale.toFixed(2);
                        brisk[j].scale = scale
                    }
                    app.$set(app.brisk, '', brisk)


                    //---------------
                    var Stat = G2.Stat;
                    var chart = new G2.Chart({
                        id: 'cakeChart',
                        forceFit: true,
                        height: 260
                    });
                    chart.source(data);
                    // 重要：绘制饼图时，必须声明 theta 坐标系
                    chart.coord('theta', {
                        radius: 1 // 设置饼图的大小
                    });
                    chart.legend(false);

                    chart.tooltip({
                        title: null,
                    });
                    //统计函数  label(Stat.summary.percent('y'));
                    chart.intervalStack().position(Stat.summary.percent('value')).color('name', ['#36be37', '#fcbb0b', '#77726d']).label(Stat.summary.percent('value'), {
                        offset: 10,
                        labelLine: false,
                        label: {
                            fontSize: 16,
                            rotate: 0,
                        }
                    });
                    chart.render();
                },
                //----------------------------------------成交频次----------------------------------
                frequencys: function () {
                    $("#frequency").empty()
                    var before = app.customerNum;

                    var data = []
                    var beforeLen = before.length;
                    //转成数字格式
                    var max = 0
                    for (var i = 0; i < beforeLen; i++) {
                        before[i].numb = parseInt(before[i].numb * 100) / 100;
                        max = Number(max + before[i].numb)
                        data[i] = before[i]
                    }


                    var chart = new G2.Chart({
                        id: 'frequency', // 指定图表容器 ID
                        forceFit: true,
                        height: 310 // 指定图表高度
                    });
                    // Step 2: 载入数据源,定义列信息
                    chart.source(data, {
                        txt: {
                            alias: ' ',

                        },
                        numb: {
                            alias: '人数',
                            range: [0, 1]
                        }
                    });
                    // 坐标轴设置
                    chart.axis('numb', {
                        title: null,
                        line: {
                            stroke: 'transparent', // 设置线的颜色
                        },
                        formatter: function (val) { // 轴的文字
                            var txt = parseInt(val / max * 100) + '%';
                            return txt;
                        }

                    });
                    chart.axis('txt', {
                        title: null,
                    });

                    //提示框设置
                    chart.tooltip({
                        title: null, // 用于控制是否显示 tooltip 框内的 title

                    });

                    chart.legend(false); // 关掉自带图例
                    chart.interval().position('txt*numb').color("#9be6df").label('numb', {
                        labelLine: false, // 不显示文本的连接线
                        offset: 10, // 文本距离图形的距离
                        label: {
                            fontSize: 16,
                        }
                    });
                    chart.render();

                    chart.on('tooltipchange', function (ev) {
                        var item = ev.items[0]; // 获取tooltip要显示的内容
                        // console.log(item)
                        item.value = item.value + '人';
                    });
                },
                //--------------------------------成交金额
                moneyPillars: function () {
                    $("#moneyPillar").empty()
                    var before = app.customerPay

                    var data = []
                    var beforeLen = before.length;
                    //转成数字格式
                    var max = 0;
                    for (var i = 0; i < beforeLen; i++) {
                        before[i].numb = parseInt(before[i].numb * 100) / 100;
                        max = Number(max + before[i].numb)
                        data[i] = before[i]
                    }
                    var chart = new G2.Chart({
                        id: 'moneyPillar', // 指定图表容器 ID
                        forceFit: true,
                        height: 310 // 指定图表高度
                    });
                    // Step 2: 载入数据源,定义列信息
                    chart.source(data, {
                        txt: {
                            alias: ' ',

                        },
                        numb: {
                            alias: '下单量',
                            range: [0, 1]
                        }
                    })

                    // 坐标轴设置
                    chart.axis('numb', {
                        title: null,
                        line: {
                            stroke: 'transparent', // 设置线的颜色
                        },
                        formatter: function (val) { // 轴的文字
                            var txt = parseInt(val / max * 100) + '%';
                            return txt;
                        }

                    });
                    chart.axis('txt', {
                        title: null,
                    });

                    //提示框设置
                    chart.tooltip({
                        title: null, // 用于控制是否显示 tooltip 框内的 title

                    });

                    chart.legend(false); // 关掉自带图例
                    chart.interval().position('txt*numb').color("#9be6df").label('numb', {
                        labelLine: false, // 不显示文本的连接线
                        offset: 10, // 文本距离图形的距离
                        label: {
                            fontSize: 16,
                        }
                    });
                    chart.render();

                    chart.on('tooltipchange', function (ev) {
                        var item = ev.items[0]; // 获取tooltip要显示的内容
                        // console.log(item)
                        item.value = item.value + '单';
                    });
                },
                Qu: function (obj) {
                    var Obb = obj.target.innerText;
                    $("#NeOne").val(Obb);
                    $('input[name=TwoPon]').val(Obb)
                    var TwoArr = []
                    for (var i = Number(Obb); i <= 120; i = i + 15) {
                        TwoArr.push(i)
                    }
                    app.TwoArr = TwoArr

                    $(".OnePon").hide();
                },
                NeOneClick: function () {
                    $(".OnePon").show();
                },
                Gu: function (obj) {
                    var Oab = obj.target.innerText;
                    $("#NeTwo").val(Oab);
                    $('input[name=SanPon]').val(Oab)
                    var SanArr = []
                    for (var i = Number(Oab); i <= 120; i = i + 15) {
                        SanArr.push(i)
                    }
                    app.SanArr = SanArr
                    $(".TwoPon").hide();
                },
                NeTwoClick: function () {
                    $(".TwoPon").show();
                },
                Vu: function (obj) {
                    var Ocs = obj.target.innerText;
                    $("#NeSan").val(Ocs);
                    $(".SanPon").hide();
                },
                NeSanClick: function () {
                    $(".SanPon").show();
                },
                cianFerClick: function () { // 点击 【设置分组】  【显示影藏框】
                    $(".clasAtr").show();
                },
                ouTerClick: function () { //  点击 【影藏框】 【错号】
                    $(".clasAtr").hide();
                },
                GuanBiClick: function () { //  点击 【影藏框】 【关闭】
                    $(".clasAtr").hide();
                },
                BaoCunClick: function () { //  点击 【影藏框】 【保存】
                    var OnePon = $("input[name=OnePon]").val(); // 获取 活跃顾客 【天数   1】
                    var OnePon1 = $("input[name=OnePon1]").val(); // 获取 活跃顾客 【天数   1】
                    var TwoPon = $("input[name=TwoPon]").val(); // 获取 活跃顾客 【天数   1】
                    var TwoPon1 = $("input[name=TwoPon1]").val(); // 获取 活跃顾客 【天数   1】
                    var SanPon = $("input[name=SanPon]").val(); // 获取 活跃顾客 【天数   1】
                    var SanPon1 = $("input[name=SanPon1]").val(); // 获取 活跃顾客 【天数   1】
                    console.log(OnePon);
                    console.log(OnePon1);
                    console.log(TwoPon);
                    console.log(TwoPon1);
                    console.log(SanPon);
                    console.log(SanPon1);
                    if (OnePon >OnePon1) {

                        alert('开始时间不能小于结束时间')
                        return false;
                    } else if (TwoPon>TwoPon1) {

                        alert('开始时间不能小于结束时间')
                        return false;
                    } else if (SanPon > SanPon1) {

                        alert('开始时间不能小于结束时间')
                        return false;
                    }
                    var timeArr = [{start: OnePon, end: OnePon1}, {start: TwoPon, end: TwoPon1}, {
                        start: SanPon,
                        end: SanPon1
                    }]
                    //保存到cookie
                    var shopId = $('input[name=shopId]').val() //获取Id标识cookie
                    $.cookie('timeArr' + shopId, JSON.stringify(timeArr), {expires: 7})
                    app.timeArr = timeArr
                    console.log(timeArr);
                    var that = this;
                    axios({
                        method: "post",
                        url: 'https://www.aftdc.com/Business/Analy/customer',
                        data: {
                            timeArr: JSON.stringify(timeArr),
                            token: shopData.token
                        },
                    }).then(function (res) {
                        if (res.data.res == -1) {
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href = "/business/Login/index.html";
                        }
                        app.brisk = res.data.data;
                        that.cakeCharts();
                    })

                    $(".clasAtr").hide();
                },
                Ayi: function () {
                    $(".csdaFk").show();
                    $(".xsjhGki").show();
                },
                Nyi: function () {
                    $(".csdaFk").hide();
                    $(".xsjhGki").hide();
                },
                Byi: function () {
                    $(".cssaFk").show();
                    $(".xscGki").show();
                },
                Vyi: function () {
                    $(".cssaFk").hide();
                    $(".xscGki").hide();
                },
                Bdi: function () {
                    $(".csscedaFk").show();
                    $(".xscscGki").show();
                },
                Vdi: function () {
                    $(".csscedaFk").hide();
                    $(".xscscGki").hide();
                },
                Cind: function () {
                    $(".csUkdaFk").show();
                    $(".xsdcGki").show();
                },
                Cent: function () {
                    $(".csUkdaFk").hide();
                    $(".xsdcGki").hide();
                },
                whetleft: function () {
                    $(".SkdhraFk").show();
                    $(".SdchrGki").show();
                },
                whetrigth: function () {
                    $(".SkdhraFk").hide();
                    $(".SdchrGki").hide();
                },
                Dnleft: function () {
                    $(".LouisraFk").show();
                    $(".LouishrGki").show();
                },
                Dnrigth: function () {
                    $(".LouisraFk").hide();
                    $(".LouishrGki").hide();
                },
                changeClick: function () {
                    // window.parent.location.href = "https://www.aftdc.com/business/Activity/HuoDong.html";
                    window.parent.location.href = "https://www.aftdc.com/business/Index/index.html#/Huo/Dong";
                    top.location.reload();
                    // location.href = "https://www.aftdc.com/business/Activity/HuoDong.html";
                    // top.location.reload();
                }
            }

        });
        }

}

/*$(function() {
    yesterdays();
    trendGuests();
    cakeCharts(); //饼状图
    frequencys();//成交频次
})
//计算时间分组下拉数值

//顾客概况的  昨日 ->顾客趋向图

*/