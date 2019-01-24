window.onload = function () {
    var shopData = JSON.parse(localStorage.getItem('shopData'));
    if (!shopData) {
        location.href = "/business/Login/index.html";
    } else {

        var evaluate = new Vue({
            el: '#preOrder',
            data: {
                timeRadio: {choice: ['未到预订时间', '60分钟内预订单', '已过预订时间'], sele: '未到预订时间'},
                radios: [
                    {val: '订单状态', choice: ['全部', '有效订单', '待消费', '消费中', '已消费', '无效订单'], sele: '全部', brackS: 3,},
                    {val: '订单排序', choice: ['预定时间', '下单时间'], sele: '预定时间'},
                ],
                time: {start: '', end: '', name: ''},

                jsonStr: '',

                giveState: [
                    {name: '订单已送达', txt: '收'}, {name: '骑手已取餐'}, {name: '骑手已到店', txt: '店'}, {name: '骑手已接单', txt: '骑'},
                    {name: '商家发起配送'}, {name: '商家已接单', txt: '接'},
                ],

                evaluateData: {stars: 0, txt: '', id: 'id'}, //评价骑手
                orderData: [],

                modalTogle: 0,
                pageNumb: 0, //总页数
                pageCurent: 1, //当前页
                pageEach: 6, //每一页显示数据条数

                toDayOrderNum: 0, //订单

                planData: {}, //点击拒绝时，存储点击的数据

                deskData: [], //预定桌位的信息
                deskChoice: -1,


            },
            created: function () {
                //初始化时查询时间
                var myDate = new Date();
                var year = myDate.getFullYear()
                var month = myDate.getMonth() + 1;
                var day = myDate.getDate();
                month = month > 9 ? month : '0' + month;
                day = day > 9 ? day : '0' + day;
                var start = year + '-' + month + '-' + day

                var days = myDate.setDate(myDate.getDate() + 7)
                var dayss = new Date(days)
                var yeare = dayss.getFullYear()
                var monthe = dayss.getMonth() + 1;
                var daye = dayss.getDate();
                monthe = monthe > 9 ? monthe : '0' + monthe;
                daye = daye > 9 ? daye : '0' + daye;

                var end = yeare + '-' + monthe + '-' + daye

                this.$set(this.time, 'start', start);
                this.$set(this.time, 'end', end);


                var orderData
                var that = this
                that.start = start
                that.end = end
                //获取数据

                that.pageFn(1);

            },


            methods: {
                //------------------------分页跳转------------------------------------
                pageFn: function (pageCurent) {

                    var that = this;
                    var page = (pageCurent - 1) * that.pageEach;
                    that.pageCurent = pageCurent;
                    axios({
                        method: "post",
                        url: "https://www.aftdc.com/Business/Canteen/canteenOrder",
                        async: false,
                        data: {
                            page: page,
                            start: that.start,
                            end: that.end,
                            jsonStr: that.jsonStr,
                            token: shopData.token
                        },
                    }).then(function (res) {
                        var orderData = res.data.data
                        if (orderData) {
                            //插入订单数据
                            var len = orderData.length;
                            for (var i = 0; i < len; i++) {
                                orderData[i].tipsTogle = 0;
                                orderData[i].open = true;
                            }
                            ;
                        } else if (res.data.res == -1) {
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href = "/business/Login/index.html";
                        }


                        that.orderData = orderData
                        //初始化页数

                        var pageCount = Number(res.data.pageCount);
                        that.toDayOrderNum = pageCount
                        var pageEach = Number(res.data.pageEach);
                        that.pageEach = res.data.pageEach;
                        var pageNumb = Math.ceil(pageCount / that.pageEach)
                        that.pageNumb = pageNumb
                    })


                },

                //**********
                changeRadio: function (e) {
                    var that = this
                    var radios = this.radios;
                    var len = radios.length;
                    var seles = [];
                    var timesele = this.timeRadio['sele'];
                    seles.push(timesele);
                    for (var i = 0; i < len; i++) {
                        var val = radios[i].sele
                        seles.push(val)
                    }


                    var jsonStr = JSON.stringify(seles)
                    this.jsonStr = jsonStr
                    console.log(jsonStr) //单选框

                    axios({
                        method: "post",
                        url: "https://www.aftdc.com/Business/Canteen/canteenOrder",
                        data: {
                            page: 0,
                            start: that.start,
                            end: that.end,
                            jsonStr: that.jsonStr,
                            token: shopData.token
                        },
                    }).then(function (res) {
                        console.log(res)
                        var orderData = res.data.data
                        if (orderData) {
                            //插入订单数据
                            var len = orderData.length;
                            for (var i = 0; i < len; i++) {
                                orderData[i].tipsTogle = 0;
                                orderData[i].open = true;
                            }
                            ;
                        } else if (res.data.res == -1) {
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href = "/business/Login/index.html";
                        }


                        that.orderData = orderData
                        //初始化页数

                        var pageCount = Number(res.data.pageCount);

                        var pageEach = Number(res.data.pageEach);
                        that.pageEach = res.data.pageEach;
                        var pageNumb = Math.ceil(pageCount / that.pageEach)
                        that.pageNumb = pageNumb
                    })
                },

                timeFn: function () {
                    var start = this.time['start'];
                    var end = this.time['end'];
                    this.start = start
                    this.end = end
                    var that = this
                    axios({
                        method: "post",
                        url: "https://www.aftdc.com/Business/Canteen/canteenOrder",
                        data: {
                            page: 0,
                            start: that.start,
                            end: that.end,
                            jsonStr: that.jsonStr,
                            token: shopData.token
                        },
                    }).then(function (res) {
                        console.log(res)
                        var orderData = res.data.data
                        if (orderData) {
                            //插入订单数据
                            var len = orderData.length;
                            for (var i = 0; i < len; i++) {
                                orderData[i].tipsTogle = 0;
                                orderData[i].open = true;
                            }
                            ;
                        } else if (res.data.res == -1) {
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href = "/business/Login/index.html";
                        }


                        that.orderData = orderData
                        //初始化页数

                        var pageCount = Number(res.data.pageCount);

                        var pageEach = Number(res.data.pageEach);
                        that.pageEach = res.data.pageEach;
                        var pageNumb = Math.ceil(pageCount / that.pageEach)
                        that.pageNumb = pageNumb
                    })
                },
                //受理或拒绝
                aceptRefuse: function (order, apply, index) {
                    var data = {orderNo: order, apply: apply, index: index};
                    var that = this
                    if (apply == 0) {
                        this.modalTogle = 1;
                    } else {
                        this.modalTogle = 2
                        //查询没有预定的桌位

                        axios({
                            method: "post",
                            url: "https://www.aftdc.com/Business/Canteen/canteenSit",
                            data: {token: shopData.token},
                        }).then(function (res) {
                            console.log(res);
                            if (res.data.res == 1) {
                                that.deskData = res.data.data;
                            } else if (res.data.res == -1) {
                                alert(res.data.reason)
                                localStorage.removeItem('shopData');
                                location.href = "/business/Login/index.html";
                            }

                            else {
                                that.deskData = [];
                            }
                        })

                    }
                    this.planData = data

                },
                //..点击安排桌位
                changeDesk: function () {
                    var that = this

                    var deskChoice = this.deskChoice;

                    if (deskChoice >= 0) {
                        that.modalTogle = 0;

                        var planData = that.planData
                        that.operation(planData)
                    } else {
                        alert("请选择安排的桌位")
                    }
                },

                //是否接受接口
                operation: function (datas) {
                    var that = this
                    var orderNo = datas.orderNo,
                        apply = datas.apply,
                        index = datas.index;

                    axios({
                        method: "post",
                        url: "https://www.aftdc.com/Business/Canteen/applyDeskOrder",
                        data: {
                            orderNo: orderNo,
                            apply: apply,
                            token: shopData.token
                        },
                    }).then(function (res) {
                        if (res.data.res == 1) {
                            if (apply == 0) {
                                that.modalTogle = 0;
                                alert("已拒绝该订单");
                                that.orderData[index].state = 3;
                                that.orderData[index].orderStatus = -1;
                            } else if (res.data.res == -1) {
                                alert(res.data.reason)
                                localStorage.removeItem('shopData');
                                location.href = "/business/Login/index.html";
                            }

                            else {
                                //安排座位
                                var orderNo = datas.orderNo;
                                that.seatFn(orderNo, index)
                            }

                        }
                    })

                },

                seatFn: function (orderNo, index) {
                    var that = this;
                    var deskChoice = this.deskChoice;
                    var deskId = this.deskData[deskChoice].deskNum;

                    axios({
                        method: "post",
                        url: "https://www.aftdc.com/Business/Canteen/canteenArrange",
                        data: {
                            orderNo: orderNo,
                            deskId: deskId,
                            token: shopData.token
                        },
                    }).then(function (res) {
                        if (res.data.res == 1) {
                            alert("已受理该订单");
                            that.orderData[index].state = 1;
                            that.orderData[index].orderStatus = 1;
                            that.orderData[index].deskId = deskId;
                            that.deskChoice = -1;
                        } else if (res.data.res == -1) {
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href = "/business/Login/index.html";
                        }

                    })

                },


            },
            updated: function () {
                $("#date").dateSelect(evaluate);
                $("#dateN").dateSelect(evaluate);
            }

        });
    }
}




