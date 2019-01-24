window.onload = function () {
    var shopData = JSON.parse(localStorage.getItem('shopData'));
    if (!shopData) {
        location.href = "/business/Login/index.html";
    } else {
        var evaluate = new Vue({
            el: '#analyCounts',
            data: {
                numb: 5,
                businessTitle: [
                    {txt: '营业总额(元)', name: 'total'}, {txt: '商家补贴(元)', name: 'shop'}, {txt: '阿凡提补贴(元)', name: 'aft'},
                    {txt: '订单收入(元)', name: 'income'}, {txt: '有效订单(单)', name: 'valid'}, {txt: '无效订单(单)', name: 'invalid'}
                ],
                busineSort: {aspect: 0, txt: ''},
                tendency: {},
                timeSpreads: {},
                businessData: [
                    {time: '2017.10.08', total: 37, shop: 5, aft: 0, income: '34.40', valid: 1, invalid: 2},
                    {time: '2017.10.07', total: 40, shop: 1, aft: 2, income: '24.40', valid: 11, invalid: 5},
                    {time: '2017.10.06', total: 60, shop: 9, aft: 7, income: '4.40', valid: 10, invalid: 4},
                    {time: '2017.10.05', total: 0, shop: 0, aft: 0, income: '0', valid: 0, invalid: 0},
                    {time: '2017.10.04', total: 20, shop: 5, aft: 1, income: '214.40', valid: 5, invalid: 2},
                    {time: '2017.10.03', total: 17, shop: 7, aft: 0, income: '204.40', valid: 1, invalid: 0},
                ],
                flag: {
                    "mtxt": false, // 优惠券名称
                    "more": false, // 优惠券金额
                    "ptxt": false, // 使用门槛
                    "hine": false, // 优惠券有效期
                },
                businessDatas: {},
                businessPage: 32, //营业详情数据长度
                pageNumb: 0, //总页数
                pageCurent: 1, //当前页


                historys: 1, //历史营业统计
                time: {start: '', end: '', name: ''},
                selTimes: ['近7日', '近30日'],
                selTime: '近7日',

                lat: 39.914850,
                lng: 116.403765,
                count: '',
                todayOut: '',
                YesterdayIncome: '',
                YesterdayIncomes: '',
                YesterdaytodayOut: '',
                qiTian: '',
                qiTianOut: '',
                todayIncome: '',
                todayIncomes: '',


            },
            created: function () {
                var that = this
                var myDate = new Date();
                var year = myDate.getFullYear()
                var month = myDate.getMonth() + 1;
                var day = myDate.getDate();
                month = month > 9 ? month : '0' + month;

                day = day > 9 ? day : '0' + day;
                var start = year + '-' + month + '-' + '01'
                var end = year + '-' + month + '-' + day

                this.$set(this.time, 'start', start);
                this.$set(this.time, 'end', end);
                axios({
                    method: "post",
                    url: "https://www.aftdc.com/Business/Analy/analyCount",
                    data: {token: shopData.token}
                }).then(function (res) {
                    console.log(res);

                    if (res.data.res == 1) {
                        that.count = res.data.data
                        that.YesterdayIncome = that.count.YesterdayIncome
                        that.YesterdayIncomes = that.count.YesterdayIncomes
                        that.YesterdaytodayOut = that.count.YesterdaytodayOut
                        that.qiTian = that.count.qiTian
                        that.qiTianOut = that.count.qiTianOut
                        that.todayIncome = that.count.todayIncome
                        that.todayIncomes = that.count.todayIncomes
                        that.todayOut = that.count.todayOut
                        console.log(11111)
                    }
                    else if (res.data.res == -1) {
                        alert(res.data.reason)
                        localStorage.removeItem('shopData');
                        location.href = "/business/Login/index.html";
                    }

                })
                this.selTime = this.selTimes[0]

                axios({
                    method: "post",
                    url: 'https://www.aftdc.com/Business/Analy/analyCounts ',
                    data: {
                        days: 7,
                        token: shopData.token
                    },
                }).then(function (res) {
                    console.log(res);

                    that.tendency = res.data.data.tendency
                    that.timeSpreads = res.data.data.timeSpreads
                    that.priceSpreads = res.data.data.priceSpreads
                    that.businessData = res.data.data.businessData
                    that.trends();
                    that.timeSpread();
                    that.priceSpread();

                    if (res.data.res == -1) {
                        alert(res.data.reason)
                        localStorage.removeItem('shopData');
                        location.href = "/business/Login/index.html";
                    }

                })
            },

            methods: {
                //营业额排序
                busineSortFn: function (txt) {
                    var val = this.busineSort['txt'];
                    var numb = this.busineSort['aspect']; //代表上1 下2
                    var index = 2
                    //大于0 代表有排序
                    if (numb > 0) {
                        if (val == txt) { //点击的是同一个
                            index = numb == 1 ? 2 : 1;
                        }
                    }
                    this.busineSort['aspect'] = index;
                    this.busineSort['txt'] = txt;

                    var businessData = this.businessData;
                    if (index == 1) {
                        businessData = businessData.sort(function (a, b) {
                            return parseInt(a[txt] * 100) / 100 - parseInt(b[txt] * 100) / 100
                        });
                    } else {
                        businessData = businessData.sort(function (a, b) {
                            return parseInt(b[txt] * 100) / 100 - parseInt(a[txt] * 100) / 100
                        });
                    }
                    this.businessData = businessData;

                },


                //------------------------分页跳转------------------------------------
                pageClick: function (index) {
                    this.pageCurent = index
                    var businessDatas = this.businessDatas
                    this.businessData = businessDatas.slice((index - 1) * 10, index * 10)
                },
                pageSub: function () {
                    if (this.pageCurent == 1) {
                        return false
                    }
                    this.pageCurent--
                    var index = this.pageCurent
                    var businessDatas = this.businessDatas
                    this.businessData = businessDatas.slice((index - 1) * 10, index * 10)
                },
                pageAdd: function () {
                    if (this.pageCurent == this.pageNumb) {
                        return false
                    }
                    this.pageCurent++
                    var index = this.pageCurent
                    var businessDatas = this.businessDatas
                    this.businessData = businessDatas.slice((index - 1) * 10, index * 10)
                },

                //历史营业统计选择
                historyFn: function (index) {
                    this.historys = index
                    if (index == 1) {
                        this.selTime = this.selTimes[0]
                        var that = this
                        axios({
                            method: "post",
                            url: 'https://www.aftdc.com/Business/Analy/analyCounts ',
                            data: {
                                days: 7,
                                token: shopData.token
                            },
                        }).then(function (res) {
                            that.tendency = res.data.data.tendency
                            that.timeSpreads = res.data.data.timeSpreads
                            that.priceSpreads = res.data.data.priceSpreads
                            that.businessData = res.data.data.businessData
                            that.trends();
                            that.timeSpread();
                            that.priceSpread();

                            if (res.data.res == -1) {
                                alert(res.data.reason)
                                localStorage.removeItem('shopData');
                                location.href = "/business/Login/index.html";
                            }

                        })

                    }
                    if (index == 2) {
                        this.selTime = this.selTimes[1]
                        var that = this
                        axios({
                            method: "post",
                            url: 'https://www.aftdc.com/Business/Analy/analyCounts ',
                            data: {
                                days: 30,
                                token: shopData.token
                            },
                        }).then(function (res) {
                            console.log(res);
                            that.tendency = res.data.data.tendency
                            that.timeSpreads = res.data.data.timeSpreads
                            that.priceSpreads = res.data.data.priceSpreads
                            if (res.data.data.businessData.length <= 10) {
                                that.businessDatas = []
                                that.businessData = res.data.data.businessData
                            }

                            else if (res.data.res == -1) {
                                alert(res.data.reason)
                                localStorage.removeItem('shopData');
                                location.href = "/business/Login/index.html";
                            }

                            else {
                                that.businessPage = res.data.data.businessData.length
                                var len = parseInt(that.businessPage);
                                var leave = len % 10
                                var numb = (len - leave) / 10 //10条一页
                                var pages = leave > 0 ? numb + 1 : numb
                                that.pageNumb = pages
                                that.businessDatas = res.data.data.businessData
                                that.businessData = that.businessDatas.slice(0, 10);

                            }
                            that.trends();
                            that.timeSpread();
                            that.priceSpread();
                        })
                    }
                    if (index == 3) {
                        var start = this.time['start'];
                        var end = this.time['end'];

                        this.selTime = start.slice(5) + '~' + end.slice(5)
                        var that = this
                        axios({
                            method: "post",
                            url: 'https://www.aftdc.com/Business/Analy/analyCounts ',
                            data: {
                                start: start,
                                end: end,
                                token: shopData.token
                            },
                        }).then(function (res) {
                            console.log(res);
                            that.tendency = res.data.data.tendency
                            that.timeSpreads = res.data.data.timeSpreads
                            that.priceSpreads = res.data.data.priceSpreads
                            //that.businessData=res.businessData
                            if (res.data.data.businessData.length <= 10) {
                                that.businessDatas = []
                                that.businessData = res.data.data.businessData
                            }
                            else if (res.data.res == -1) {
                                alert(res.data.reason)
                                localStorage.removeItem('shopData');
                                location.href = "/business/Login/index.html";
                            }

                            else {
                                that.businessPage = res.data.data.businessData.length
                                var len = parseInt(that.businessPage);
                                var leave = len % 10
                                var numb = (len - leave) / 10 //10条一页
                                var pages = leave > 0 ? numb + 1 : numb
                                that.pageNumb = pages
                                that.businessDatas = res.data.data.businessData
                                that.businessData = that.businessDatas.slice(0, 10);

                            }
                            that.trends();
                            that.timeSpread();
                            that.priceSpread();
                        })

                    }
                },
                //时间
                timeFn: function () {
                    var start = this.time['start'];
                    var end = this.time['end'];
                    this.selTime = start.slice(5) + '~' + end.slice(5)
                    var that = this
                    axios({
                        method: "post",
                        url: 'https://www.aftdc.com/Business/Analy/analyCounts ',
                        data: {
                            start: start,
                            end: end,
                            token: shopData.token
                        },
                    }).then(function (res) {
                        that.tendency = res.data.data.tendency
                        that.timeSpreads = res.data.data.timeSpreads
                        that.priceSpreads = res.data.data.priceSpreads
                        // that.businessData=res.businessData
                        if (res.data.data.businessData.length <= 10) {
                            that.businessDatas = []
                            that.businessData = res.data.data.businessData
                        }

                        else if (res.data.res == -1) {
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href = "/business/Login/index.html";
                        }

                        else {
                            that.businessPage = res.data.data.businessData.length
                            var len = parseInt(that.businessPage);
                            var leave = len % 10
                            var numb = (len - leave) / 10 //10条一页
                            var pages = leave > 0 ? numb + 1 : numb
                            that.pageNumb = pages
                            that.businessDatas = res.data.data.businessData
                            that.businessData = that.businessDatas.slice(0, 10);

                        }
                        that.trends();
                        that.timeSpread();
                        that.priceSpread();

                    })

                },
                yijuspanOver: function () {
                    $(".yiju").show();
                    $(".yijuimg").show();
                },
                yijuspanOut: function () {
                    $(".yiju").hide();
                    $(".yijuimg").hide();
                },
                chipitwoOver: function () {
                    $(".chipin").show();
                    $(".chipinimg").show();
                },
                chipitwoOut: function () {
                    $(".chipin").hide();
                    $(".chipinimg").hide();
                },
                shouruOver: function () {
                    $(".shusan").show();
                    $(".sanimg").show();
                },
                shouruOut: function () {
                    $(".shusan").hide();
                    $(".sanimg").hide();
                },
                wuxiaoOver: function () {
                    $(".cdacv").show();
                    $(".cdacvimg").show();
                },
                wuxiaoOut: function () {
                    $(".cdacv").hide();
                    $(".cdacvimg").hide();
                },
                chuaxianClick: function () {
                    // 点击 【操作 出现1级 影藏框】
                    $(".cangkuang").show();
                },
                cieyiClick: function () { //点击 商家自营销协议
                    $(".nextku").show();
                    return false; //   防止冒泡

                },
                cderClick: function () { // 【影藏框】【影藏框】【错号】
                    $(".nextku").hide();

                },
                MtxtFocus: function () { //  Mtxt  优惠券名称
                    $("#Mtxt").css('border', '1px solid #06c1ae');
                    return;

                },
                MtxtInput: function () {
                    var flag = this.flag;
                    var mtxt = $("#Mtxt").val();
                    // console.log(mtxt);
                    if (mtxt == "") {
                        $("#Mtxt").css('border', '1px solid red');
                        $("#konep\\.info").html("优惠券名称不能为空");
                        $(".tisikonep").css('color', 'red');
                        // return;
                    } else {
                        $("#Mtxt").css('border', '1px solid #000');
                        $("#konep\\.info").html("");
                        $(".tisikonep").css('color', '');
                        flag.mtxt = true;
                        return;
                    }
                },
                MoreFocus: function () { // 优惠卷金额
                    $("#More").css('border', '1px solid #06c1ae');
                    return;

                },
                MoreInput: function () {
                    var flag = this.flag;
                    var more = $("#More").val();
                    if (more == "") {
                        $("#More").css('border', '1px solid red');
                        $("#kmorep\\.info").html("优惠券金额不能为空");
                        $(".tisikmorep").css('color', 'red');
                        return;
                    } else {
                        $("#More").css('border', '1px solid #000');
                        $("#kmorep\\.info").html("");
                        $(".tisikmorep").css('color', '');
                        flag.more = true;
                        return;
                    }
                },
                PtxtFocus: function () { //  Ptxt 使用门槛
                    $("#Ptxt").css('border', '1px solid #06c1ae');
                    return;

                },
                PtxtInput: function () {
                    var flag = this.flag;
                    var ptxt = $("#Ptxt").val();
                    if (ptxt == "") {
                        $("#Ptxt").css('border', '1px solid red');
                        $("#kthreep\\.info").html("使用门槛不能为空");
                        $(".tisikthreep").css('color', 'red');
                        return;
                    } else {
                        $("#Ptxt").css('border', '1px solid #000');
                        $("#kthreep\\.info").html("");
                        $(".tisikthreep").css('color', '');
                        flag.ptxt = true;
                        return;
                    }
                },
                HineFocus: function () { // 优惠券有效期
                    $("#Hine").css('border', '1px solid #06c1ae');
                    return;

                },
                HineInput: function () {
                    var flag = this.flag;
                    var hine = $("#Hine").val();
                    if (hine == "") {
                        $("#Hine").css('border', '1px solid red');
                        $("#kfourp\\.info").html("优惠券有效期不能为空");
                        $(".tisikfourp").css('color', 'red');
                        return;
                    } else {
                        $("#Hine").css('border', '1px solid #000');
                        $("#kfourp\\.info").html("");
                        $(".tisikfourp").css('color', '');
                        flag.hine = true;
                        return;
                    }
                },
                cuoiClick: function () {
                    $(".cangkuang").hide();
                },
                louisOver: function () {
                    $(".cmks").show();
                    $(".hjkimg").show();
                },
                louisOut: function () {
                    $(".cmks").hide();
                    $(".hjkimg").hide();
                },
                aconerClick: function () { // 点击我同意
                    if ($("#aconer").is(':checked')) { // 判断是否选中
                        // alert('1')
                        $('#sendjuan').attr("disabled", false); // 如果选中 移出  disabled="disabled"
                        $("#sendjuan").css('background', '#06c1ae'); // 改变 按钮颜色
                    } else {
                        $('#sendjuan').attr("disabled", true); // 如果 没有选中 添加 disabled="disabled"
                        $("#sendjuan").css('background', '#c3c3c4'); // 改变 按钮颜色
                        // alert('0');
                    }

                },
                sendjuanClick: function () {
                    var flag = this.flag;
                    // 点击 【立即发劵】
                    var ok = flag.mtxt && flag.more && flag.ptxt && flag.hine;
                    if (ok == false) {
                        $('#sendjuan').attr("disabled", true); // 如果 没有选中 添加 disabled="disabled"
                        $("#sendjuan").css('background', '#c3c3c4'); // 改变 按钮颜色
                        //alert("表单项正在检测或存在错误");
                        return false;
                    } else {
                        var mtxt = $("#Mtxt").val(); // 获取 优惠券名称 val
                        var numer = $("#numer").text(); // 获取 优惠券数量  值
                        var more = $("#More").val(); // 获取 优惠券金额 val
                        var ptxt = $("#Ptxt").val(); // 获取 使用门槛 val
                        var hine = $("#Hine").val(); // 获取 发券之日起 val
                        axios({
                            method: "post",
                            url: '',
                            data: {},
                        }).then(function () {

                        })
                    }
                },

//线性图 营业趋势
                trends: function () {
                    var filterNames = [];
                    $("#trend").empty();
                    $("#legend").empty();
                    var that = this;
                    var before = that.tendency;
                    var beforeLen = that.tendency.length;
                    var data = []
                    //转成数字格式
                    for (var i = 0; i < beforeLen; i++) {
                        before[i].value = parseInt(before[i].value * 100) / 100;
                        data[i] = before[i]
                    }

                    /*var aa=JSON.stringify(data) //看数据
                    console.log(JSON.parse(aa))*/
                    var chart = new G2.Chart({
                        id: 'trend',
                        forceFit: true,
                        height: 300
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
                        },
                        value: {
                            range: [0, 1]
                        },
                    });

                    //坐标轴处理
                    chart.axis('value', {
                        title: null, // 不展示 xDim 对应坐标轴的标题
                        labels: null,
                        line: {
                            lineWidth: 2, // 设置线的宽度
                            stroke: 'transparent', // 设置线的颜色
                            lineDash: [3, 3] // 设置虚线
                        },
                    });
                    //chart.axis('value', false);
                    chart.col('value', {//提示文字
                        formatter: function (val) {
                            return "    " + val + '元';
                        }
                    });
                    //提示框
                    chart.tooltip(true, {});
                    //图例
                    chart.legend({
                        title: null, // 不展示图例的标题
                        marker: 'square', // 设置图例 marker 的显示样式
                    });
                    chart.legend(false); // 关掉自带图例
                    chart.line().position('month*value').color('type').size(2);
                    //chart.line().position('month*value').color('type').size(2).shape('type', ['活动补贴','有效订单']);
                    chart.point().position('month*value').color('type').shape('triangle');
                    chart.render();


                    var geom = chart.getGeoms()[0]; // 获取所有的图形
                    var items = geom.getData(); // 获取图形对应的数据

                    var stash = {};
                    for (var i = 0, l = items.length; i < l; i++) {
                        var item = items[i];
                        var itemData = item._origin;
                        var color = item.color;
                        var name = itemData[0].type;


                        var value = itemData[0].value;

//        var trHtml = '<label class="item" data-name="' + name + '">' +
//          '<span class="dot" style="background:' + color + ';"></span>' + name +'</label>'

                        var trHtml = '<label class="label-checkbox items" @click="itemsClick()" data-name="' + name + '">' +
                            '<span class="customs"></span>' + name +
                            '</label>'


                        var dom = $(trHtml).appendTo('#legend');
                        //只显示两个图例
                        //只显示两个图例
                        if (i < 2) {
                            stash[name] = {
                                dotDom: dom.find('.dot'),
                                dotcheck: dom.find('.customs'),
                                item: item,
                                color: color,
                                name: name,
                                isChecked: true
                            }
                            filterNames.push(name);
                            stash[name].dotDom.css('background', stash[name].color);
                            stash[name].dotcheck.addClass('active');
                            var txt = '<span class="oblong" style="background:' + color + ';"></span>' + name
                            $(".showtxt").append(txt)
                        } else {
                            stash[name] = {
                                dotDom: dom.find('.dot'),
                                dotcheck: dom.find('.customs'),
                                item: item,
                                color: color,
                                name: name,
                                isChecked: false
                            }
                            stash[name].dotDom.css('background', '#999');

                        }
                    }
                    console.log(filterNames)
                    chart.filter('type', filterNames)
                    chart.repaint();
                    $(".items").click(function () {
                        var name = $(this).data('name');
                        var obj = stash[name];
                        // var filterNames = [];
                        var len = filterNames.length

                        obj.isChecked = obj.isChecked ? false : true;

                        if (obj.isChecked) {
                            filterNames.push(obj.name);
                        } else {
                            if (len <= 1) {
                                obj.isChecked = true
                                return false
                            }
                            var name = obj.name
                            for (var i = 0; i < filterNames.length; i++) {
                                var txt = filterNames[i]
                                if (txt == name) {
                                    filterNames.splice(i, 1)
                                }
                            }
                        }
                        if (filterNames.length > 2) {
                            var txt = filterNames[0]
                            var objs = stash[txt]
                            objs.isChecked = false
                            filterNames.splice(0, 1);
                        }
                        Util.each(stash, function (v) {
                            v.isChecked = false;
                            v.dotDom.css('background', '#999');
                            v.dotcheck.removeClass('active')
                        });

                        $(".showtxt").empty();

                        for (var i = 0; i < filterNames.length; i++) {
                            var txt = filterNames[i]
                            var objs = stash[txt]
                            objs.dotDom.css('background', objs.color);
                            objs.dotcheck.addClass('active');
                            objs.isChecked = true;

                        }

                        chart.filter('type', filterNames)
                        chart.repaint();//重绘
                    });


                },


                timeSpread: function () {

                    var before = evaluate.timeSpreads
                    var beforeLen = before.length;
                    var data = []
                    //转成数字格式
                    for (var i = 0; i < beforeLen; i++) {
                        before[i].value = parseInt(before[i].value * 100) / 100;
                        data[i] = before[i]
                    }

                    //随机30个data数据 ---测试

//    var data = [
//      {month: '1', value: 7.0},
//      {month: '2', value: 6.9},
//    ];
                    $('#timeSpread').empty()
                    var chart = new G2.Chart({
                        id: 'timeSpread',
                        forceFit: true,
                        height: 310,
                    });
                    chart.col('value', {
                        formatter: function (val) {
                            return "    " + val + '单';
                        }
                    });
                    chart.source(data, {
                        month: {
                            alias: " ",
                            range: [0, 1]
                        },
                        value: {
                            alias: '下单量'
                        }
                    });
                    // 坐标轴设置
                    chart.axis('value', {
                        title: null, // 不展示 xDim 对应坐标轴的标题
                        //	labels: '',
                        line: {
                            lineWidth: 2, // 设置线的宽度
                            stroke: 'transparent', // 设置线的颜色
                            lineDash: [3, 3] // 设置虚线
                        },
                    });


                    chart.line().position('month*value').color("#06C1AE").size(2);
                    chart.point().position('month*value').color("#06C1AE").shape('triangle');//点
                    chart.render();

                },

                priceSpread: function () {
                    var before = evaluate.priceSpreads
                    var beforeLen = before.length;
                    var data = []
                    //转成数字格式
                    for (var i = 0; i < beforeLen; i++) {
                        before[i].numb = parseInt(before[i].numb * 100) / 100;
                        data[i] = before[i]
                    }

                    // G2 对数据源格式的要求，仅仅是 JSON 数组，数组的每个元素是一个标准 JSON 对象。
                    // Step 1: 创建 Chart 对象
                    $('#priceSpread').empty();
                    var chart = new G2.Chart({
                        id: 'priceSpread', // 指定图表容器 ID
                        forceFit: true,
                        height: 310 // 指定图表高度
                    });
                    // Step 2: 载入数据源,定义列信息
                    chart.source(data, {
                        genre: {
                            alias: ' ' // 列定义，定义该属性显示的别名
                        },
                        numb: {
                            alias: '下单量'
                        }
                    });
                    // 坐标轴设置
                    chart.axis('numb', {
                        title: null,
                        line: {
                            stroke: 'transparent', // 设置线的颜色
                        },
                    });

                    //提示框设置
                    chart.tooltip({
                        title: null, // 用于控制是否显示 tooltip 框内的 title

                    });

                    chart.legend(false); // 关掉自带图例
                    // Step 3：创建图形语法，绘制柱状图，由 genre 和 sold 两个属性决定图形位置，genre 映射至 x 轴，sold 映射至 y 轴
                    chart.interval().position('txt*numb').color("#06C1AE")
                    // Step 4: 渲染图表
                    chart.render();

                    chart.on('tooltipchange', function (ev) {
                        var item = ev.items[0]; // 获取tooltip要显示的内容
                        // console.log(item)
                        item.value = item.value + '单';
                    });

                },
                // itemsClick: function () {
                //     var chart = new G2.Chart({
                //         id: 'trend',
                //         forceFit: true,
                //         height: 300
                //     });
                //     var Util = G2.Util;
                //     var Stat = G2.Stat;
                //     var stash = {};
                //     var filterNames = [];
                //     var name = $(this).data('name');
                //     var obj = stash[name];
                //     // var filterNames = [];
                //     var len = filterNames.length
                //
                //     obj.isChecked = obj.isChecked ? false : true;
                //
                //     if (obj.isChecked) {
                //         filterNames.push(obj.name);
                //     } else {
                //         if (len <= 1) {
                //             obj.isChecked = true
                //             return false
                //         }
                //         var name = obj.name
                //         for (var i = 0; i < filterNames.length; i++) {
                //             var txt = filterNames[i]
                //             if (txt == name) {
                //                 filterNames.splice(i, 1)
                //             }
                //         }
                //     }
                //     if (filterNames.length > 2) {
                //         var txt = filterNames[0]
                //         var objs = stash[txt]
                //         objs.isChecked = false
                //         filterNames.splice(0, 1);
                //     }
                //     Util.each(stash, function (v) {
                //         v.isChecked = false;
                //         v.dotDom.css('background', '#999');
                //         v.dotcheck.removeClass('active')
                //     });
                //
                //     $(".showtxt").empty();
                //
                //     for (var i = 0; i < filterNames.length; i++) {
                //         var txt = filterNames[i]
                //         var objs = stash[txt]
                //         objs.dotDom.css('background', objs.color);
                //         objs.dotcheck.addClass('active');
                //         objs.isChecked = true;
                //
                //     }
                //
                //     chart.filter('type', filterNames)
                //     chart.repaint();//重绘
                // },
            },
            updated: function () {

            }

        });
        $("#date").dateSelect(evaluate);
        $("#dateN").dateSelect(evaluate);
        $(function () {
            //trends();
            //timeSpreads();
            //priceSpreads();
            mapBox();//地图


        })


//**************************************************订单时间分布*************************************


//-----------------------------------------------------------柱状图--------------------------------------------------------------


//店铺经纬度
        var lat = "39.914850";
        var lng = "116.403765";

//地图
        function mapBox() {
            center = new qq.maps.LatLng(lat, lng);
            map = new qq.maps.Map(
                document.getElementById("container"), {
                    center: center,
                    zoom: 12,

                }
            );
            marker = new qq.maps.Marker({
                position: center,
                map: map
            });
            //圆形区域覆盖物 radius 是圆形的半径，单位是“米
            var cirle = new qq.maps.Circle({
                center: center,
                radius: 3000,
                map: map,
                strokeColor: "#06C1AE",
            });

        }
    }
}