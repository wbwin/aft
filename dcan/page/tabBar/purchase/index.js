var app = getApp();
var MD5Util = require('../../../utils/md5.js');
var util = require('../../../utils/util.js')
Page({
    data: {
        reason: [{
            name: "我不想买了",
            circle: true
        },
        {
            name: "下错单了",
            circle: false
        },
        {
            name: "卖家缺货",
            circle: false
        },
        {
            name: "其他",
            circle: false
        },
        ],
        tagStr: '',
        pageTab: {
            curHdIndex: 0,
            curBdIndex: 0,
        },
        hidden: true,
        hidd: true,
        hi: true,
        tk: 0,
        choose: 0,
        taste: -1,
        wrap: -1,
        goods: 1,
        tks: 0,
        tkType: false,
        tk: 0,
        first: false,
        winHeight: "", //窗口高度
        currentTab: 0, //预设当前项的值
        currentIndex: 0,
        scrollLeft: 0, //tab标题的滚动条位置
        cur: 0,
        windowHeight: 0, //高
        num: '', //数

        waitNum: 0,
        noPayNum: 0,
        groupNum: 0,
        pingjiaNum: 0,
        refundNum: 0,
        allOrder: [],

        page: 0, //上拉加载传给后台的数据(onReachBottom距离底部多少距离自动触发的事件)
        onreachBottom: true, //判断是否继续执行上拉加载
        timer: '',
    },
    onLoad: function () {
        var that = this;
        if (wx.getStorageSync('swichNav')) {
            that.setData({
                currentTab: wx.getStorageSync('currentTab')
            })
            wx.removeStorageSync('currentTab')
        }
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    windowHeight: res.windowHeight
                })
            }
        });
    },


    // 点击付款
    payment(e) {
        var orderId = e.currentTarget.dataset.orderid;
        var shopId = e.currentTarget.dataset.shopid;
        var tk = e.currentTarget.dataset.tk;
        if (tk) {
            tk = 1
        } else {
            tk = 0
        }
        wx.navigateTo({
            url: '../../homePage/pages/waitPay/waitPay?shopId=' + shopId + '&orderId=' + orderId + '&tk=' + tk,
        })
    },
    chooseTag: function (e) {
        var index = e.currentTarget.dataset.index
        var tags = this.data.tags
        tags[index]['sel'] = !tags[index]['sel']
        this.setData({
            tags: tags
        })
    },

    onReady: function (option) {
        var that = this;
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    windowHeight: res.windowHeight
                })
            }
        });
        //购买团购商品成功跳转
        var buyTk = wx.getStorageSync("buyTk")
        if (buyTk) {
            wx.removeStorageSync("buyTk")
            this.setData({
                choose: 3
            })
        }
    },

    //刷新页面
    onShow: function () {
        var first = this.data.first;
        if (first) {
            this.onPullDownRefresh();
        }
        this.timedRefresh();
        this.setData({
            page: 0,
        })
        this.getAllOrders()
    },

    //清除定时器
    onHide: function () {
        var that = this;
        clearInterval(that.data.timer);
    },


    //定时刷新页面
    timedRefresh: function () {
        var that = this;
        var timer = setInterval(function () {
            that.setData({
                page: 0,
            })
            that.getAllOrders();
        }, 30000)
        that.setData({
            timer: timer
        })
    },

    //请求数据
    getAllOrders: function () {
        var userId = wx.getStorageSync('usersInfo').userId;
        if (userId) {
            this.data.userId = userId;
            var that = this;
            var timestamp = (Date.parse(new Date())) / 1000;
            var sign = MD5Util.sign(timestamp);
            var page = that.data.page;
            var allOrder = that.data.allOrder;

            wx.request({
                url: 'https://www.aftdc.com/wxapp/Order/getAllOrders',
                header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                method: "POST",
                data: {
                    sign: sign,
                    timestamp: timestamp,
                    token: wx.getStorageSync('usersInfo').token,
                    page: 0,
                },
                success: function (res) {

                    that.setData({
                        onreachBottom: true,
                    })

                    that.setData({
                        allOrder: res.data,
                        page: page + res.data.length,
                    })



                    that.setData({
                        animationLoading: true, //加载图
                    })
                }
            })
        } else {
            var usersInfo = wx.getStorageSync('usersInfo')
            if (!usersInfo || !usersInfo.userPhone) { //如果没登录
                wx.navigateTo({
                    url: '../../homePage/pages/author/author',
                })
                return false
            }
            this.setData({
                animationLoading: true, //加载图
            })
        }
    },

    onReachBottom() {
        if (this.data.onreachBottom) {

            var userId = wx.getStorageSync('usersInfo').userId;
            if (userId) {
                this.data.userId = userId;
                var that = this;
                var timestamp = (Date.parse(new Date())) / 1000;
                var sign = MD5Util.sign(timestamp);
                var page = that.data.page;
                var allOrder = that.data.allOrder;

                that.setData({
                    more: true,
                })

                wx.request({
                    url: 'https://www.aftdc.com/wxapp/Order/getAllOrders',
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    method: "POST",
                    data: {
                        sign: sign,
                        timestamp: timestamp,
                        token: wx.getStorageSync('usersInfo').token,
                        page: page,
                    },
                    success: function (res) {

                        if ((page + res.data.length) == page) {
                            that.setData({
                                onreachBottom: false,
                                plScrolltolower: true,
                            })
                        } else {
                            that.setData({
                                onreachBottom: true,
                                plScrolltolower: false,
                            })
                        }

                        that.setData({
                            allOrder: allOrder.concat(res.data),
                            page: page + res.data.length,
                            more: false,
                            animationLoading: true, //加载图
                        })


                        // that.setData({
                        //     animationLoading: true, //加载图
                        // })
                    }
                })
            } else {
                var usersInfo = wx.getStorageSync('usersInfo')
                if (!usersInfo || !usersInfo.userPhone) { //如果没登录
                    wx.navigateTo({
                        url: '../../homePage/pages/author/author',
                    })
                    return false
                }
                this.setData({
                    animationLoading: true, //加载图
                })
            }
        }

    },


    bindscroll: function (e) {
        var num = this.data.num; //上一个状态
        if (num != this.data.currentTab) {
            this.data.onreachBottom = true
        }
        if (this.data.onreachBottom) {
            this.setData({
                more: true,
                num: this.data.currentTab,
            })
            this.data.onreachBottom = false
            var that = this
            var timestamp = (Date.parse(new Date())) / 1000
            var sign = MD5Util.sign(timestamp)
            var page = 0
            var currentTab = that.data.currentTab;
            var page = 0;
            if (currentTab == 0) {
                page = that.data.jxzpage; //进行中
            } else if (currentTab == 1) {
                page = that.data.dfkpage; //待付款
            } else if (currentTab == 2) {
                page = that.data.dsypage; //待使用
            } else if (currentTab == 3) {
                page = that.data.dpjpage; //待评价
            } else if (currentTab == 4) {
                page = that.data.tkpage; //退款
            }
            wx.request({
                url: 'https://www.aftdc.com/wxapp/Order/upOrders',
                header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                method: "POST",
                data: {
                    sign: sign,
                    timestamp: timestamp,
                    token: wx.getStorageSync('usersInfo').token,
                    type: that.data.currentTab,
                    page: page
                },
                success: function (res) {
                    if (res.data.data != '') {
                        if (currentTab == 0) {
                            //进行中
                            that.setData({
                                jxz: that.data.jxz.concat(res.data.data),
                                jxzpage: that.data.jxzpage + res.data.data.length
                            })
                        } else if (currentTab == 1) {
                            //待付款
                            that.setData({
                                dfk: that.data.dfk.concat(res.data.data),
                                dfkpage: that.data.dfkpage + res.data.data.length
                            })
                        } else if (currentTab == 2) {
                            //待使用
                            that.setData({
                                dsy: that.data.dsy.concat(res.data.data),
                                dsypage: that.data.dsypage + res.data.data.length
                            })
                        } else if (currentTab == 3) {
                            //待评价
                            that.setData({
                                dpj: that.data.dpj.concat(res.data.data),
                                dpjpage: that.data.dpjpage + res.data.data.length
                            })
                        } else if (currentTab == 4) {
                            //退款
                            that.setData({
                                tk: that.data.tk.concat(res.data.data),
                                tkpage: that.data.tkpage + res.data.data.length
                            })
                        }
                        that.data.onreachBottom = true
                    }
                }
            })
        }
    },
    //参数
    setChoose: function () {

    },

    onPullDownRefresh: function () {

        this.setData({
            page: 0,
        })

        wx.hideNavigationBarLoading(); //完成停止加载
        wx.stopPullDownRefresh(); //停止下拉刷新
        this.getAllOrders();
    },

    //没外卖订单
    rule: function () {
        wx.switchTab({
            url: '../../nearby/nearby',
        })
    },
    //确认收货
    confirmOrder: util.throttle(function (e) {
        var that = this
        var orderId = e.currentTarget.dataset.orderid
        var shopId = e.currentTarget.dataset.shopid
        var orderScore = e.currentTarget.dataset.orderscore
        var userId = wx.getStorageSync('usersInfo').userId
        var timestamp = (Date.parse(new Date())) / 1000
        var sign = MD5Util.sign(timestamp)
        var part = e.currentTarget.dataset.part

        wx.request({
            url: 'https://www.aftdc.com/wxapp/Order/confirmOrder',
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
                orderId: orderId,
                orderScore: orderScore,
                shopId: shopId,
                sign: sign,
                timestamp: timestamp,
                token: wx.getStorageSync('usersInfo').token,
            },
            method: "POST",
            success: function (res) {
                if (res.data.res == 1) {

                    that.onPullDownRefresh()
                    wx.showModal({
                        title: '提示',
                        content: '已收货',
                        showCancel: false
                    })
                } else {
                    wx.showModal({
                        title: '提示',
                        content: '失败，请重试',
                        showCancel: false,
                        success: function () {
                            that.setData({
                                not2: false,
                            })
                        }
                    })
                }
            }
        })
    }),
    //点击导航
    pageHdtap: function (e) {
        //点击子元素
        var _datasetId = e.target.dataset.id;
        var _leftObj = {};
        _leftObj.curHdIndex = _datasetId;
        _leftObj.curBdIndex = _datasetId;
        this.setData({
            pageTab: _leftObj
        });
    },
    record_detail: util.throttle(function (e) {
        var id = e.currentTarget.dataset.id
        var tk = e.currentTarget.dataset.tk
        // if (!tk) {
        //   tk = this.data.tk
        // }
        // wx.navigateTo({
        //   url: '../personal/record/record-detail/record-detail?orderId=' + id +'&tk='+tk,
        // })
        wx.navigateTo({
            url: '../../homePage/pages/waitPay/waitPay?orderId=' + id + '&tk=' + tk,
        })
    }),
    //催单
    cuidan: function (e) {
        var orderId = e.currentTarget.dataset.id
        var shopId = e.currentTarget.dataset.shopid
        var that = this
        var timestamp = (Date.parse(new Date())) / 1000
        var sign = MD5Util.sign(timestamp)

        wx.request({
            url: 'https://www.aftdc.com/wxapp/Order/cuidan',
            data: {
                orderId: orderId,
                shopId: shopId,
                sign: sign,
                timestamp: timestamp,
                token: wx.getStorageSync('usersInfo').token,
            },
            method: 'POST',
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
                if (res.data.res == 1) {
                    wx.showModal({
                        title: '提示',
                        content: '已催单',
                        showCancel: false
                    })
                    that.onPullDownRefresh()
                } else {
                    wx.showModal({
                        title: '提示',
                        content: '失败，请重试',
                        showCancel: false
                    })
                }
            }
        })
    },
    jumpOrder: util.throttle(function (e) {
        var shopId = e.currentTarget.dataset.shopid

        wx.navigateTo({
            url: '../../homePage/pages/order/order?shopId=' + shopId,
        })
    }),

    btnback: util.throttle(function (e) {
        var orderId = e.currentTarget.dataset.orderid
        var shopId = e.currentTarget.dataset.shopid
        var orderStatus = e.currentTarget.dataset.orderstatus

        wx.navigateTo({
            url: '../../personal/pages/refund/refund?orderId=' + orderId + '&shopId=' + shopId + '&orderStatus=' + orderStatus,
        })
    }),

    go: util.throttle(function (ee) {
        var pid = ee.currentTarget.dataset.orderid; //点击的是哪件商品的评价
        var shopId = ee.currentTarget.dataset.shopid;
        var tk = ee.currentTarget.dataset.tk;
        var types = ee.currentTarget.dataset.types;
        wx.navigateTo({
            url: '../../purchase/pages/score/score?pid=' + pid + '&shopId=' + shopId + '&tk=' + tk + '&types=' + types,
        })
    }),

    cancel: function () {
        this.setData({
            hidden: true
        })
    },

    //没有订单
    rule: function () {
        wx.switchTab({
            url: '../../nearby/nearby',
        })
    },
    //取消订单
    box2: function (e) {
        var rea = e.currentTarget.dataset.rea;
        var orderId = e.currentTarget.dataset.orderid;
        var index = e.currentTarget.dataset.index;
        var tks = e.currentTarget.dataset.tk
        if (tks) {
            this.setData({
                tks: 1
            })
        }
        if (rea == 1) {
            this.setData({
                show_box2: true,
            })
        } else {
            this.setData({
                show_box2: false,
            })
        }
        this.setData({
            orderId: orderId,
            index: index,
        })
    },
    reason: function (e) {
        var reason = this.data.reason
        var circle = e.currentTarget.dataset.circle;
        for (var i in reason) {
            if (i == circle) {
                reason[i].circle = true;
                this.setData({
                    reason_display: reason[i].name,
                })
            } else {
                reason[i].circle = false;
            }
        }
        this.setData({
            reason: reason,
        })
    },
    //确定取消订单
    box_ensure: function () {
        var that = this;
        var orderId = that.data.orderId
        var index = that.data.index
        var userId = wx.getStorageSync('usersInfo').userId
        var tks = that.data.tks //判断是否是团购单 1是 0否
        var timestamp = (Date.parse(new Date())) / 1000
        var sign = MD5Util.sign(timestamp)
        wx.request({
            url: 'https://www.aftdc.com/wxapp/Order/delOrder',
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
                orderId: orderId,
                tks: tks,
                sign: sign,
                timestamp: timestamp,
                token: wx.getStorageSync('usersInfo').token,
            },
            method: "POST",
            success: function (res) {
                console.log(123)
                if (res.data.res == 1) {
                    that.onPullDownRefresh()
                    that.setData({
                        show_box2: false
                    })
                }
            }
        })
    },
    bingLongTap: function (e) {
        var that = this
        var index = e.currentTarget.dataset.index
        var dpj = that.data.dpj
        for (var i in dpj) {
            dpj[i].unEvaluate = false
        }
        dpj[index].unEvaluate = true
        that.setData({
            dpj: dpj
        })
    },
    sureUnEvaluate: function (e) {
        var that = this
        var orderType = e.currentTarget.dataset.ordertype
        var orderId = e.currentTarget.dataset.orderid
        wx.showModal({
            content: '确认不评价了吗？',
            cancelText: '再想想',
            confirmText: '不评价了',
            confirmColor: '#53beb7',
            success: function (res) {
                if (res.confirm) {
                    var timestamp = (Date.parse(new Date())) / 1000
                    var sign = MD5Util.sign(timestamp)
                    if (orderType == 4) {
                        var data = {
                            sign: sign,
                            timestamp: timestamp,
                            token: wx.getStorageSync('usersInfo').token,
                            tk_orderId: orderId,
                        }
                    } else {
                        var data = {
                            sign: sign,
                            timestamp: timestamp,
                            token: wx.getStorageSync('usersInfo').token,
                            orderId: orderId,
                        }
                    }
                    wx.request({
                        url: 'https://www.aftdc.com/wxapp/Order/delWaitAppraise',
                        header: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        data: data,
                        method: "POST",
                        success: function (res) {
                            if (res.data.res == 1) {
                                wx.showToast({
                                    title: '已删除',
                                    icon: 'none',
                                    duration: 1500,
                                })
                                that.onPullDownRefresh();

                            } else {
                                wx.showToast({
                                    title: '删除失败',
                                    icon: 'none',
                                    duration: 1500,
                                })
                                that.onPullDownRefresh()
                            }
                        }
                    })
                } else if (res.cancel) { }
            }
        })
    },
    cuidanWait: function () {
        wx.showToast({
            title: '短时间内不能重复催单',
            icon: 'none',
            duration: 1500,
        })
    },
    closeUnEvaluate: function (e) {
        var that = this
        var index = e.currentTarget.dataset.index
        var dpj = that.data.dpj
        for (var i in dpj) {
            dpj[i].unEvaluate = false
        }
        that.setData({
            dpj: dpj
        })
    },
    group: util.throttle(function (e) {
        var orderId = e.currentTarget.dataset.orderid
        var shopId = e.currentTarget.dataset.shopid
        wx: wx.navigateTo({
            url: '../../purchase/pages/group/group?orderId=' + orderId + '&shopid=' + shopId
        })
    }),
    drawback: util.throttle(function (e) {
        var shopId = e.currentTarget.dataset.shopid
        var orderId = e.currentTarget.dataset.orderid
        wx.navigateTo({
            url: '../../purchase/pages/drawback/drawback?orderId=' + orderId + '&shopId=' + shopId,
        })
    })
})