var MD5Util = require('../../../../utils/md5.js');
var util = require('../../../../utils/util.js')
var authorization = require('../../../../utils/authorization.js')
var app = getApp();
Page({
    data: {
        countDown: '',
        pid: 0,
        orderRemarks: '',
        orderId: '',
        tk: '',
    },

    onLoad: function (options) {
        var that = this
        var orderId = options.orderId
        var tk = options.tk
        this.setData({
            pid: options.pid,
            tk: tk,
            orderId: orderId,
        })
        wx.showLoading()
        that.onPullDownRefresh()
    },
    onPullDownRefresh: function () {
        var that = this
        var timestamp = (Date.parse(new Date())) / 1000
        var sign = MD5Util.sign(timestamp)
        wx.request({
            url: 'https://www.aftdc.com/wxapp/Orderinfo/getOneOrder',
            data: {
                orderId: that.data.orderId,
                tk: that.data.tk,
                sign: sign,
                timestamp: timestamp,
                token: wx.getStorageSync('usersInfo').token,
            },
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            method: 'post',
            success: function (res) {
                that.setData({
                    order: res.data
                })
                var order = res.data
                if (order.orderType == 3) {
                    var deskArr = JSON.parse(order.deskArr)
                    var orderRemarks = order.orderRemarks

                    that.setData({
                        desk: deskArr,
                        orderRemarks: orderRemarks
                    })
                }
                //商品总价和口袋
                that.total();
                //判断订单当前状态
                that.orderStatus(order.orderStatus, order.orderType, order.userAction, order.isAppraises, order.reminder, order.groupType);
                //判断订单类型
                that.orderType(order.orderType);
                //等待付款倒计时
                if (order.orderStatus == -2) {
                    that.countDownFn(order.createTime)
                }
                that.setData({
                    animationLoading: true,//加载图
                })
                wx.hideLoading()
                wx.stopPullDownRefresh() //停止下拉刷新
            }
        })
    },
    //商品总价和口袋
    total: function () {
        var that = this
        var order = that.data.order

        if (!order.shareId) {
            for (let i in order.goodslist) {
                order.goodslist[i].totalPrice = (Number(order.goodslist[i].goodsPrice) * Number(order.goodslist[i].goodsNums)).toFixed(2)
                order.goodslist[i].totalMarketPrice = (Number(order.goodslist[i].marketPrice) * Number(order.goodslist[i].goodsNums)).toFixed(2)
            }
        }
        this.setData({
            order: order
        })
    },
    //判断订单当前状态
    // orderStatus的值     1待发货已受理，0已支付未受理，3配送中，- 3退款中, 2打包中，4已收货待评价，5已支付拼单中，-1 取消 - 2待付款 - 4取消退款成功 - 7商家取消订单 - 8平台申退款中, 8平台退款成功 - 9平台拒绝退款 - 10临时订单 - 6备餐后用户取消订单

    orderStatus: function (orderStatus, orderType, userAction, isAppraises, reminder, groupType) {
        if (orderStatus == 1 && orderType != 3 && !userAction && reminder == 1) {
            this.setData({
                orderStatus: "订单已受理,催单中"
            })
        } else if (orderStatus == 1 && orderType != 3 && !userAction && reminder == 2) {
            this.setData({
                orderStatus: "订单已受理,商家已处理催单"
            })
        } else if (orderStatus == 1 && orderType != 3 && !userAction) {
            this.setData({
                orderStatus: "订单已受理"
            })
        } else if (orderStatus == 3 && !userAction) {
            this.setData({
                orderStatus: "订单正在配送中"
            })
        } else if (orderStatus == 1 && userAction == 2 && orderType!=3) {
            this.setData({
                orderStatus: "退款失败,商家已备餐"
            })
        } else if (orderStatus == 3 && (userAction == 3 || userAction == 2)) {
            this.setData({
                orderStatus: "退款失败,配送中"
            })
        } else if (orderStatus == 1 && orderType == 3 &&!userAction) {
            this.setData({
                orderStatus: "已受理,请提前10分钟到店"
            })
        } else if (orderType == 3 && userAction && orderStatus != -4 && orderStatus != -6 && orderStatus != 4) {
            this.setData({
                orderStatus: "退款失败,商家已备餐"
            })
        } else if (orderStatus == 1 && orderType == 1) {
            this.setData({
                orderStatus: "备餐中"
            })
        } else if (orderStatus == 0) {
            this.setData({
                orderStatus: "等待商家受理"
            })
        } else if (orderStatus == -2) {
            this.setData({
                orderStatus: "等待付款"
            })
        } else if (orderStatus == 4 && isAppraises == 0) {
            this.setData({
                orderStatus: "订单已完成,待评价"
            })
        } else if (orderStatus == 4) {
            this.setData({
                orderStatus: "订单已完成"
            })
        } else if (orderStatus == -1 || orderStatus==-6) {
            this.setData({
                orderStatus: "申请退款中"
            })
        } else if (orderStatus == -4 && !userAction && !groupType) {
            this.setData({
                orderStatus: "商家未受理，已退款"
            })
        } else if (orderStatus == -4) {
            this.setData({
                orderStatus: "商家已同意退款"
            })
        } else if (orderStatus == -7) {
            this.setData({
                orderStatus: "商家取消订单,已退款"
            })
        } else if (orderStatus == 5) {
            this.setData({
                orderStatus: "拼单中"
            })
        }
    },
    //判断订单类型
    orderType: function (orderType) {
        //0外卖 2扫码点餐 3订座点餐 4团购单 5自取单
        if (orderType == 0 && this.data.order.shareId) {
            var orderTypeTip = '【外卖】(拼单)'
        } else if (orderType == 0) {
            var orderTypeTip = '【外卖】'
        } else if (orderType == 2) {
            var orderTypeTip = '【扫码点餐】'
        } else if (orderType == 3) {
            var orderTypeTip = '【堂食预订】'
        } else if (orderType == 4) {
            var orderTypeTip = '【团购】'
        } else if (orderType == 5 && this.data.order.shareId) {
            var orderTypeTip = '【到店自取】(拼单)'
        } else if (orderType == 5) {
            var orderTypeTip = '【到店自取】'
        }
        this.setData({
            orderTypeTip: orderTypeTip
        })
    },

    //等待付款倒计时
    countDownFn: function (createTime) {
        var that = this;
        var d3 = util.subTime(createTime, new Date)
        console.log(d3)
        if (d3 >= 900) {
            this.setData({
                countDown: false,
                orderStatus: '订单已失效'
            })
        } else {
            var time = setInterval(function () {
                var sub = 900 - d3
                var min = Math.floor(sub / 60);
                min = min > 9 ? min : '0' + min
                var sec = sub % 60;
                sec = sec > 9 ? sec : '0' + sec
                var t = min + ":" + sec
                that.setData({
                    countDown: t
                })
                d3++;
                if (d3 > 900 || sub < 0) {
                    that.setData({
                        countDown: false,
                        orderStatus: '订单已失效'
                    })
                    clearInterval(time)
                }

            }, 1000)

        }

    },

    //联系商家
    call: function (e) {
        var phone = e.currentTarget.dataset.phone
        wx.makePhoneCall({
            phoneNumber: phone
        })
    },
    //在线客服
    service: function (e) {
        var that = this
        wx.navigateTo({
            url: '../contact/contact?shopId=' + that.data.order.shopId
        })
    },
    //跳转去店铺
    gotoShop: function () {
        var shopId = this.data.order.shopId
        wx.navigateTo({
            url: '../order/order?shopId=' + shopId,
        })
    },
    //提交订单购买
    pay: function (e) {
        wx.showNavigationBarLoading()
        var true_pay = this.data.order.realTotalMoney
        var shopName = this.data.order.shopInfo.shopName
        var orderNo = this.data.order.orderNo
        var pay_money = parseInt(true_pay * 100) / 100
        var userId = wx.getStorageSync('usersInfo').userId
        var shopId = this.data.order.shopId
        var timestamp = (Date.parse(new Date())) / 1000
        var sign = MD5Util.sign(timestamp)
        //查看会员信息，选择支付方式
        var that = this
        wx.request({
            url: 'https://www.aftdc.com/wxapp/Order/payType',
            method: "POST",
            data: {
                orderNo: orderNo,
                sign: sign,
                timestamp: timestamp,
                token: wx.getStorageSync('usersInfo').token,
                tk: that.data.tk
            },
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
                if (res.data.res == 1) {
                    if (res.data.type == 2) { //微信支付
                        that.payment(res.data.needPay, shopName, orderNo);
                    } else { //余额支付
                        that.userMoneyPay(res.data.needPay, shopName, orderNo)
                    }
                } else if (res.data.res == 0) {
                    wx.showModal({
                        title: '',
                        content: res.data.info,
                        showCancel: false,
                        confirmColor: '#53beb7',
                        success: function (res) {
                            wx.navigateBack({
                                delta: 2
                            })
                        }
                    })
                }
            }
        })
    },
    //微信付款
    payment: function (true_pay, shopName, orderNo) {
        var that = this;
        var oid = wx.getStorageSync('usersInfo').openid;
        var userId = wx.getStorageSync('usersInfo').userId;
        var p_name = shopName + "外卖订单";
        var timestamp = (Date.parse(new Date())) / 1000;
        var sign = MD5Util.sign(timestamp);
        wx.request({
            url: 'https://www.aftdc.com/wxapp/Order/Wxpay',
            method: 'POST',
            data: {
                sign: sign,
                timestamp: timestamp,
                token: wx.getStorageSync('usersInfo').token,
                p_name: p_name,
                openid: oid,
                paid_amount: true_pay,
                orderNo: orderNo,
                pid: that.data.pid,
                userId: userId,
                shopId: that.data.order.shopId,
                tk: that.data.tk
            },
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
                if (res.data.res == 'err') {

                 

                    wx.showModal({
                        title: '提示',
                        content: '该商品已售罄',
                        showCancel: false,
                        success: function (res) {
                            wx.navigateBack()
                        }
                    })
                    return false
                }

                var deskArr = JSON.stringify(that.data.deskArr) //获取缓存
                wx.requestPayment({
                    timeStamp: res.data.timestamp,
                    nonceStr: res.data.nonce_str,
                    package: res.data.pkg,
                    signType: 'MD5',
                    paySign: res.data.signc,
                    success: function (res) {

                     

                        //支付成功删除缓存
                        wx.removeStorageSync('deskArr')
                        wx.switchTab({
                            url: '/page/tabBar/purchase/index',
                        })
                    },
                })
            }
        })
    },
    //余额支付
    userMoneyPay: function (true_pay, shopName, orderNo) {
        var that = this

        var timestamp = (Date.parse(new Date())) / 1000
        var sign = MD5Util.sign(timestamp)
        wx.showModal({
            title: '提示',
            content: '确定使用余额' + true_pay + '元付款？',
            success: function (res) {
                if (res.confirm) {
                    wx.showNavigationBarLoading()
                    wx.request({
                        url: 'https://www.aftdc.com/wxapp/Desk/updGoods',
                        method: "POST",
                        data: {
                            orderNo: orderNo,
                            pid: that.data.pid,
                            userId: wx.getStorageSync('usersInfo').userId,
                            shopId: that.data.shopId,
                            sign: sign,
                            timestamp: timestamp,
                            token: wx.getStorageSync('usersInfo').token,
                            tk: that.data.tk

                        },
                        header: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        success: function (conn) {
                            //支付成功删除缓存
                            wx.removeStorageSync('deskArr')
                            if (conn.data.res == 1) {

                                
                                wx.switchTab({
                                    url: '/page/tabBar/purchase/index',
                                })
                            } else if (conn.data.res == 2) { //余额不足
                                wx.showToast({
                                    title: '余额不足',
                                    icon: 'loading',
                                    duration: 1000,
                                    success: function (res) {
                                        that.onReady()
                                    }
                                })
                            }
                        }
                    })
                }
            }
        })
    },
    toPtkf: function () {
        var that = this
        wx.navigateTo({
            url: '../service/service?shopId=' + that.data.order.shopId + '&phone=' + that.data.order.shopInfo.shopTel,
        })
    },
    //取消订单
    cancelOrder: function (e) {
        var orderId = e.currentTarget.dataset.orderid;
        var that = this;
        wx.showModal({
            title: '取消订单',
            content: '确定取消订单？',
            success: function (res) {
                if (res.confirm) {
                    var tks = that.data.tk //判断是否是团购单 1是 0否
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
                            if (res.data.res == 1) {
                                wx.navigateBack()
                            }
                        }
                    })
                }
            }
        })

    },
})