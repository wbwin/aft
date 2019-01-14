var app = getApp()
var MD5Util = require('../../../../utils/md5.js');
var util = require('../../../../utils/util.js')
Page({

    data: {
        show_box1: false,
        show_box2: false,
        box2: false,
        refundType: 1,
        refundRemark: '',
        mode: [{
            name: "仅退款",
            circle: true
        }, {
            name: "退货并退款",
            circle: false
        }],
        mode_display: '仅退款',
        reason: [{
                name: "买/卖双方协商一致",
                circle: true
            },
            {
                name: "买错/不想要",
                circle: false
            },
            {
                name: "商品质量有问题",
                circle: false
            },
            {
                name: "未收到货",
                circle: false
            },
            {
                name: "其他",
                circle: false
            },
        ],
        reason_display: '买/卖双方协商一致',
    },
    onLoad: function(options) {
        var orderId = options.orderId
        var that = this
        var timestamp = (Date.parse(new Date())) / 1000
        var sign = MD5Util.sign(timestamp)
        that.setData({
            orderId: orderId,
            shopId: options.shopId,
            orderStatus: options.orderStatus
        })
        wx.request({
            url: 'https://www.aftdc.com/wxapp/order/refundOrder',
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
                sign: sign,
                timestamp: timestamp,
                token: wx.getStorageSync('usersInfo').token,
                orderId: orderId
            },
            success: function(res) {
                that.setData({
                    order: res.data,
                })
            }
        })
    },
    box1: function(e) {
        var status = e.currentTarget.dataset.status;
        if (status == 1) {
            this.setData({
                show_box1: true
            })
        } else {
            this.setData({
                show_box1: false
            })
        }
    },
    box2: function(e) {
        var rea = e.currentTarget.dataset.rea;
        if (rea == 1) {
            this.setData({
                show_box2: true,
            })
        } else {
            this.setData({
                show_box2: false,
            })
        }
    },
    //退款售后选中框
    mode: function(e) {
        var that = this;
        var mode = that.data.mode
        var circle = e.currentTarget.dataset.circle;
        if (circle == 0) {
            that.setData({
                refundType: 1
            })
        }
        if (circle == 1) {
            that.setData({
                refundType: 2
            })
        }
        for (var i in mode) {
            if (i == circle) {
                mode[i].circle = true;
                this.setData({
                    mode_display: mode[i].name,
                })
            } else {
                mode[i].circle = false;
            }
        }
        this.setData({
            mode: mode,
            show_box1: false,
            show_box2: false
        })

    },
    //退款原因选中框
    reason: function(e) {
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
            show_box1: false,
            show_box2: false
        })

    },
    refund_sm: function(e) {
        var refundRemark = e.detail.value
        var that = this
        that.setData({
            refundRemark: refundRemark
        })
    },
  but: util.throttle(function () {
        wx.showLoading()
        var that = this
        var reason = that.data.reason_display
        var refundRemark = reason + '。' + that.data.refundRemark
        var userId = wx.getStorageSync('usersInfo').userId
        var orderId = that.data.orderId
        var shopId = that.data.shopId
        var orderStatus = that.data.orderStatus
        var backMoney = that.data.order.realTotalMoney
        var refundType = that.data.refundType
        var timestamp = (Date.parse(new Date())) / 1000
        var sign = MD5Util.sign(timestamp)
        wx.request({
            url: 'https://www.aftdc.com/wxapp/order/orderCancel',
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
                orderId: orderId,
                shopId: shopId,
                userId: userId,
                refundRemark: refundRemark,
                sign: sign,
                timestamp: timestamp,
                token: wx.getStorageSync('usersInfo').token,
                refundType: refundType,
            },
            success: function(res) {
                wx.hideLoading()
                wx.showModal({
                    title: '提示',
                    content: res.data.info,
                    showCancel: false,
                    success: function() {

                        wx.navigateBack()


                        // 提交信息后返回订单页面时更新订单页面
                        var pages = getCurrentPages();
                        if (pages.length > 1) {
                            //上一个页面实例对象
                            var prePage = pages[pages.length - 2];
                            //关键在这里,这里面是触发上个界面
                            prePage.getAllOrders(prePage.data.historyArr) // 不同的人里面的值是不同的，这个数据是我的，具体的你们要根据自己的来查看所要传的参数
                        }
                    }
                })
            }
        })
    })
})