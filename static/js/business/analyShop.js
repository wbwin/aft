window.onload = function () {
    var shopData = JSON.parse(localStorage.getItem('shopData'));
    if (!shopData) {
        location.href = "/business/Login/index.html";
    } else {
        var evaluate = new Vue({
            el: "#analyShop",
            data: {
                navs: 1,
                //price->销售额 priceScal->百分比   numb->销量 numbScal->百分比   zan->赞 tread->踩   money->价格  sigleNumb->订单量   siglesPrice->交易额   client——>下单顾客
                //data ->图表数据  comment->评论
                goods: [
                    // {name:'周瑜酿皮',price:'18',priceScal:'20%',numb:7,numbScal:'20%',zan:0,tread:0,money:20, sigleNumb:6,siglesPrice:'194.00',client:6 ,data:[],comment:[],},
                    // {name:'黄焖鸡米饭',price:'15',priceScal:'20%',numb:7,numbScal:'20%',zan:0,tread:0, money:50,sigleNumb:6,siglesPrice:'194.00',client:6 ,data:[],comment:[],},
                    // {name:'周瑜酿皮',price:'19',priceScal:'20%',numb:7,numbScal:'20%',zan:0,tread:0, money:10,sigleNumb:6,siglesPrice:'194.00',client:6 ,data:[],comment:[],},
                ],
                goodsAll: [], //价格筛选前储存所有菜

                chartNumb: -1, //显示tr图例 -1
                chartData: [], //图例数据
                comment: [], //评论数据
                plIndex: 1, //全部评论
                goodsId: 0,

                time: {start: '', end: '', name: ''}, //时间

                shopTimeNav: 1,
                shopTime: {start: '', end: '', name: ''}, //时间

                timeNav: 1,

                busineSort: 0, //排序
                busineNumb: 0,

                moneyData: {start: '', end: ''}, //搜索的价格
                moneyTogle: {txt: '', togle: false},

                errTips: {state: false, txt: '结束金额不能小于开始金额'}, //控制错误弹窗

                //分页
                pageNumb: 0, //总页数
                pageCurent: 1, //当前页
                pageEach: 10, //每一页显示数据条数

                //商圈热销榜---------------------------------------------------------------------------------------
                listTime: 1,
                listNav: 1,
                //goodsName-》菜名  shopName-》店铺名字  price-》销售额  numb-》销量  manner-》好评度
                listData: [
                    {goodsName: '香辣牛腩拼五香鸡腿套餐', shopName: '不怕虎牛腩（正佳店）', price: 14256.60, numb: 454, manner: '100.00'},
                    {goodsName: '什么菜', shopName: '什么店吧', price: 14256.60, numb: 454, manner: '100.00'},
                ],

                //帮你选折扣菜-------------------------------------------------------------------------------------

                //销量最高
                amoutData: [
                    {goodsName: '香辣牛腩拼五香鸡腿套餐', price: 12.60, numb: 454, manner: '100.00'}, //商品长度 只要前6个
                    {goodsName: '香辣牛腩拼五香鸡腿套餐', price: 12.60, numb: 454, manner: '100.00'},
                ],
                amoutTime: 2,
                //好评度最高
                praiseData: [],
                praiseTime: 2,
                //高单价

                hignData: [],
                hignTime: 2,
                day: 1,


            },
            created: function () {


                var that = this
                that.pageFn(1);

            },

            methods: {
                //------------------------分页跳转------------------------------------
                pageFn: function (pageCurent) {

                    var that = this;
                    var page = (pageCurent - 1) * that.pageEach;
                    that.pageCurent = pageCurent;
                    var start = this.shopTime['start'];
                    var end = this.shopTime['end'];
                    axios({
                        method: "post",
                        url: "https://www.aftdc.com/Business/Analy/getGoodsAnaly",
                        data: {
                            page: page,
                            day: that.day,
                            start: start,
                            end: end,
                            token: shopData.token
                        },
                    }).then(function (res) {
                        console.log(res)
                        if (res.data.res == 1) {
                            that.goods = res.data.data
                            that.goodsAll = that.goods
                            that.goods = that.goods.slice(0, that.pageEach)
                            //初始化页数
                            var pageCount = Number(res.data.pageCount);
                            var pageEach = Number(res.data.pageEach);
                            that.pageEach = res.data.pageEach;
                            var pageNumb = Math.ceil(pageCount / pageEach)
                            that.pageNumb = pageNumb
                            that.goods = that.goods.slice(0, that.pageEach)
                        }
                        else if (res.data.res == -1) {
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href = "/business/Login/index.html";
                        }

                        else {
                            that.goods = []
                        }
                    })


                },

                //**********
                navFn: function (index) {
                    this.navs = index;
                    if (index == 3) {
                        var that = this
                        axios({
                            method: "post",
                            url: 'https://www.aftdc.com/Business/Analy/pickDiscount',
                            data: {
                                day: 7,
                                token: shopData.token
                            },
                        }).then(function (res) {
                            console.log(res);
                            if (res.data.res == 1) {
                                that.amoutData = res.data.data;
                            }
                            else if (res.data.res == -1) {
                                alert(res.data.reason)
                                localStorage.removeItem('shopData');
                                location.href = "/business/Login/index.html";
                            }

                            else {
                                that.amoutData = []
                            }
                        })

                    }
                },

                //排序
                sortFn: function (name, index) {
                    var aspect = this.busineSort;
                    var busineNumb = this.busineNumb

                    if (busineNumb == index) {
                        aspect = aspect == 1 ? 2 : 1
                    } else {
                        aspect = 1
                    }


                    this.busineSort = aspect
                    this.busineNumb = index

                    var goods = this.goodsAll; //拿取所有的菜
                    if (aspect == 1) {
                        goods = goods.sort(function (a, b) {
                            return parseInt(a[name] * 100) / 100 - parseInt(b[name] * 100) / 100
                        });
                    } else {
                        goods = goods.sort(function (a, b) {
                            return parseInt(b[name] * 100) / 100 - parseInt(a[name] * 100) / 100
                        });
                    }
                    this.goodsAll = goods
                    this.goods = goods.slice(0, this.pagelist);
                    this.pageCurent = 1;
                },
                moneyFn: function () {
                    this.busineNumb = 3
                    this.moneyTogle.togle = true;

                },
                //上下架
                sold: function (index, isSale) {
                    var goods = this.goods
                    var goodsId = goods[index]['goodsId']
                    var iS = isSale
                    if (iS == 0) {
                        iS = 1;
                    } else if (iS == 1 || iS == null) {
                        iS = 0;
                    }
                    var that = this
                    axios({
                        method: "post",
                        url: 'https://www.aftdc.com/Business/Goods/saveSale',
                        data: {
                            goodsId: goodsId,
                            isSale: iS,
                            token: shopData.token
                        },
                    }).then(function (res) {
                        if (res.data.res == 1) {
                            alert('操作成功')
                            that.goods[index]['isSale'] = iS
                        }
                        else if (res.data.res == -1) {
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href = "/business/Login/index.html";
                        }

                        else {
                            alert('操作失败')
                        }
                    })


                },
                //价格筛选
                moneySort: function () {
                    var alls = []
                    var goods = this.goodsAll;
                    var start = parseInt(this.moneyData.start * 100) / 100
                    var end = parseInt(this.moneyData.end * 100) / 100

                    var st = this.moneyData.start.length

                    if (st <= 0 && !Boolean(start)) {
                        var txt = "请填写开始金额"
                        this.errTipsFn(txt)
                        return false
                    }

                    if (!Boolean(end) || end < start) {
                        var txt = "结束金额不能小于开始金额"
                        this.errTipsFn(txt)
                        return false
                    }

                    var len = goods.length
                    for (var i = 0; i < len; i++) {
                        var money = parseInt(goods[i].money * 100) / 100;
                        if (money >= start && money <= end) {
                            var obj = new Object(goods[i])
                            alls.push(obj)
                        }
                    }
                    //从新计算分页
                    this.pageNumb = Math.round(alls.length / this.pagelist)
                    this.goodsAll = alls
                    this.goods = alls.slice(0, this.pagelist);
                    this.pageCurent = 1;
                    this.moneyTogle.togle = false;
                    this.moneyTogle.txt = start + '~' + end;

                },
                moneyClose: function () {
                    this.moneyData = {start: '', end: ''}
                },

                //商品时间选择 近7日 30日 自定义按钮
                shopNavFn: function (index) {
                    this.shopTimeNav = index
                    switch (index) {
                        case 1:
                            var day = 1;
                            break;
                        case 2:
                            var day = 7;
                            break;
                        case 3:
                            var day = 30;
                            break;
                    }
                    if (index < 4) {
                        var that = this
                        that.day=day
                        that.pageFn(1);
                    } else {
                        var that=this
                        that.day='';
                        this.shopTimeFn();
                    }
                },
                shopTimeFn: function () {
                    var start = this.shopTime['start'];
                    var end = this.shopTime['end'];
                    if (start && end) {
                        var that = this
                        that.pageFn(1);

                    }
                },

                //食品近7日 30日 自定义按钮
                timeNavFn: function (index) {
                    this.timeNav = index;
                    this.$nextTick(function () { //3为自定义时间
                        if (index == 3) {
                            $(document).unbind("click")


                            var myDate = new Date();
                            var d1 = myDate.setDate(myDate.getDate() - 7);
                            d1 = new Date(d1);
                            var year1 = d1.getFullYear()
                            var month1 = d1.getMonth() + 1;
                            var day1 = d1.getDate();
                            month1 = month1 > 9 ? month1 : '0' + month1;
                            day1 = day1 > 9 ? day1 : '0' + day1;
                            var start = year1 + '-' + month1 + '-' + day1

                            var myDate2 = new Date();
                            var d2 = myDate2.setDate(myDate2.getDate() - 1);
                            d2 = new Date(d2);
                            var year2 = d2.getFullYear()
                            var month2 = d2.getMonth() + 1;
                            var day2 = d2.getDate();
                            month2 = month2 > 9 ? month2 : '0' + month2;
                            day2 = day2 > 9 ? day2 : '0' + day2;
                            var end = year2 + '-' + month2 + '-' + day2

                            this.$set(this.time, 'start', start);
                            this.$set(this.time, 'end', end);
                            $("#date").dateSelect();
                            $("#dateN").dateSelect();
                            this.timeFn()
                        } else {
                            if (index == 1) {
                                var day = 7
                            }
                            if (index == 2) {
                                var day = 30;
                            }
                            var that = this
                            axios({
                                method: "post",
                                url: 'https://www.aftdc.com/Business/Analy/chartData',
                                data: {
                                    day: day,
                                    goodsId: that.goodsId,
                                    token: shopData.token
                                },
                            }).then(function (res) {
                                console.log(res);
                                if (res.data.res == 1) {
                                    that.chartData = res.data.data

                                }
                                else if (res.data.res == -1) {
                                    alert(res.data.reason)
                                    localStorage.removeItem('shopData');
                                    location.href = "/business/Login/index.html";
                                }

                                else {
                                    that.chartData = []
                                }
                                that.explains();
                            })

                        }
                    })

                },
                timeFn: function () {
                    var start = this.time['start'];
                    var end = this.time['end'];

                    if (start && end) {
                        var that = this
                        axios({
                            method: "post",
                            url: 'https://www.aftdc.com/Business/Analy/chartData',
                            data: {
                                start: start,
                                end: end,
                                goodsId: that.goodsId,
                                token: shopData.token
                            },
                        }).then(function (res) {
                            if (res.data.res == 1) {
                                that.chartData = res.data.data

                            }
                            else if (res.data.res == -1) {
                                alert(res.data.reason)
                                localStorage.removeItem('shopData');
                                location.href = "/business/Login/index.html";
                            }

                            else {
                                that.chartData = []
                            }
                            that.explains();
                        })

                    }
                },


                //评论数据
                commentFn: function () {
                    var plIndex = this.plIndex
                    console.log(plIndex) //1全部评论  2-只看赞  3-只看踩
                },

                //------------------------分页跳转------------------------------------
                // pageClick: function (index) {
                //     this.pageCurent = index
                //     this.pageFun()
                // },
                // pageSub: function () {
                //     if (this.pageCurent == 1) {
                //         return false
                //     }
                //     this.pageCurent--
                //     this.pageFun()
                // },
                // pageAdd: function () {
                //     if (this.pageCurent == this.pageNumb) {
                //         return false
                //     }
                //     this.pageCurent++
                //     this.pageFun()
                // },
                // pageFun: function () {
                //     var goods = this.goodsAll
                //     var pageCurent = this.pageCurent
                //     var pagelist = this.pagelist
                //     //console.log(pageCurent,pagelist)
                //     this.goods = goods.slice(Number(pageCurent - 1) * pagelist, pageCurent * pagelist)
                // },

                chartFn: function (index, goodsId) {
                    this.goodsId = goodsId
                    var numb = this.chartNumb;
                    if (numb == index) {
                        this.chartNumb = -1;

                        return false
                    }
                    this.chartNumb = index;
                    this.$nextTick(function () {
                        var that = this
                        axios({
                            method: "post",
                            url: 'https://www.aftdc.com/Business/Analy/chartData',
                            data: {
                                goodsId: goodsId,
                                day: 7,
                                token: shopData.token
                            },
                        }).then(function (res) {
                            if (res.data.res == 1) {
                                that.chartData = res.data.data

                            }
                            else if (res.data.res == -1) {
                                alert(res.data.reason)
                                localStorage.removeItem('shopData');
                                location.href = "/business/Login/index.html";
                            }

                            else {
                                that.chartData = []
                            }
                            that.explains();
                        })

                        var datas = that.goods[index].data;


                    });
                },


                //图例---------------------------
                explains: function () {
                    $("#explain").empty()
                    $("#countName").empty()
                    var filterNames = [];
                    var before = this.chartData

                    var data = []
                    var beforeLen = before.length;
                    //转成数字格式
                    for (var i = 0; i < beforeLen; i++) {
                        before[i].value = parseInt(before[i].value * 100) / 100;
                        data[i] = before[i]
                    }


                    var chart = new G2.Chart({
                        id: 'explain',
                        forceFit: true,
                        height: 300,

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
                        grid: {//网格
                            line: {
                                stroke: '#ddd',
                                lineWidth: 1,
                                lineDash: 1,
                            }
                        }
                    });
                    chart.col('value', {//提示文字
                        formatter: function (val) {
                            return "    " + val + '元';
                        }
                    });

                    //图例
                    chart.legend(false);
                    chart.line().position('month*value').color('type').size(2);

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

                        var trHtml = '<div class="label-radio items" data-name="' + name + '">' +
                            '<span class="custom "></span><span class="dot" style="background:' + color + ';"></span>' + name + '</div>'


                        var dom = $(trHtml).appendTo('.lenends-radio');
                        //只显示1个图例
                        if (i < 1) {
                            stash[name] = {
                                dotDom: dom.find('.dot'),
                                dotcheck: dom.find('.custom'),
                                item: item,
                                color: color,
                                name: name,
                                isChecked: true
                            }
                            filterNames.push(name);
                            /* stash[name].dotDom.css('background', stash[name].color); */
                            stash[name].dotcheck.addClass('active');

                        } else {
                            stash[name] = {
                                dotDom: dom.find('.dot'),
                                dotcheck: dom.find('.custom'),
                                item: item,
                                color: color,
                                name: name,
                                isChecked: false
                            }
                            /*stash[name].dotDom.css('background', '#999');*/

                        }
                    }
                    chart.filter('type', filterNames)
                    chart.repaint();

                    $(".items").click(function () {
                        var name = $(this).data('name');
                        var obj = stash[name];
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
                        if (filterNames.length > 1) {
                            var txt = filterNames[0]
                            var objs = stash[txt]
                            objs.isChecked = false
                            filterNames.splice(0, 1);
                        }
                        Util.each(stash, function (v) {
                            v.isChecked = false;
                            /* v.dotDom.css('background', '#999');*/
                            v.dotcheck.removeClass('active')
                        });

                        $(".showtxt").empty();

                        for (var i = 0; i < filterNames.length; i++) {
                            var txt = filterNames[i]
                            var objs = stash[txt]
                            /* objs.dotDom.css('background', objs.color);  */
                            objs.dotcheck.addClass('active');
                            objs.isChecked = true;

                        }

                        chart.filter('type', filterNames)
                        chart.repaint();//重绘
                    });


                },
                //错误提示框
                errTipsFn: function (txt) {
                    var that = this
                    that.errTips['state'] = true;
                    if (!Boolean(txt)) {
                        txt = "错误"
                    }
                    that.errTips['txt'] = txt;
                    var errTime = setInterval(function () {
                        that.errTips['state'] = false;
                        clearInterval(errTime)
                    }, 1300)
                },

                //商圈热销榜---------------------------------------------------------------------------------------

                listTimeFn: function (index) {
                    this.listTime = index;
                },
                listNavFn: function (index) {
                    this.listNav = index;
                },

                //帮你选折扣菜-------------------------------------------------------------------------------------
                amoutFn: function (index) {
                    this.amoutTime = index
                    switch (index) {
                        case 1:
                            var day = 1;
                            break;
                        case 2:
                            var day = 7;
                            break;
                        case 3:
                            var day = 30;
                            break;
                    }
                    var that = this

                    axios({
                        method: "post",
                        url: 'https://www.aftdc.com/Business/Analy/pickDiscount',
                        data: {
                            day: day,
                            token: shopData.token
                        },
                    }).then(function (res) {
                        console.log(res);
                        if (res.data.res == 1) {
                            that.amoutData = res.data.data
                        }
                        else if (res.data.res == -1) {
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href = "/business/Login/index.html";
                        }

                        else {
                            that.amoutData = []
                        }
                    })

                },
                setDiscount: function (goodsId) {
                    location.href = '/business/Activity/hongSa.html?goodsId=' + goodsId
                },
                praiseFn: function (index) {
                    this.praiseTime = index

                },
                hignFn: function (index) {
                    this.hignTime = index
                },
                editClick: function (item) {
                    var goodsId = item.goodsId;
                    location.href = '/business/Goods/edit.html?goodsId=' + item.goodsId;
                }

            },
            watch: {
                'chartNumb': function (val, oldVal) {
                    if (val != oldVal) {
                        this.timeNav = 1;
                        this.time = {start: '', end: '', name: ''}; //时间
                    }
                }
            },
            updated: function () {

            }
        })
        $("#date2").dateSelect2(evaluate);
        $("#dateN2").dateSelect2(evaluate);
    }
}




