var app = getApp()
var MD5Util = require('../../../../utils/md5.js');
var util = require('../../../../utils/util.js')
Page({
    data: {
        beingPaid: false, //是否正在支付，防止多次点击提交订单
        second: 60,
        countdown: 'countdown',
    },
    // //减
    // sub: function () {
    //   var numb = this.data.numb;

    //   if (numb > 1) {
    //     numb--
    //     this.setData({
    //       numb: numb,
    //     })
    //   }
    //   this.sum()
    // },
    // //加
    // add: function () {
    //   var numb = this.data.numb
    //   numb++
    //   this.setData({
    //     numb: numb,
    //   })
    //   this.sum()
    // },
    // //总数
    // sum: function () {
    //   var numb = this.data.numb;
    //   var arr = this.data.arr
    //   var marketPrices = parseInt(arr.group.shopPrice * 100 * numb) / 100;
    //   var waitUses = this.data.waitUses;
    // 	var clearprice = this.data.clearprice;
    // 	var waitUse = []
    // 	console.log(waitUses)

    // 	if (waitUses!=''){
    // 		var lenw = waitUses.length;
    // 		for (var i = 0; i < lenw; i++) {
    // 			var spendMoney = waitUses[i].spendMoney;
    // 			//乘100取整，相当于保留两位小数 比较大小
    // 			if (parseInt(marketPrices * 100) >= parseInt(spendMoney * 100)) {
    // 				waitUse.push(waitUses[i])
    // 			}
    // 		}
    // 		var waitEnd = waitUse[waitUse.length - 1]
    // 		var couponMoney = waitEnd.couponMoney
    // 		if (clearprice == 0 || parseInt(clearprice * 100) > parseInt(couponMoney * 100)) 			{
    // 			//clearprice==0为初始化的时候 优惠券金额为 优惠券最后一个，clearprice>couponMoney,是商品减掉的时候 抵掉金额大于最大优惠券减去金额
    // 			clearprice = parseInt(couponMoney * 100) / 100;
    // 			var couponId = waitEnd['couponId']
    // 			this.setData({
    // 				clearprice: clearprice,
    // 				couponId: couponId
    // 			})
    // 		} 
    // 	}

    //   var totalprice = parseInt(marketPrices * 100 - clearprice * 100) / 100;
    //   totalprice = totalprice < 0 ? 0 : totalprice

    //   this.setData({
    //     marketPrices: marketPrices,
    //     totalprice: totalprice,
    //     waitUse: waitUse,
    //   })
    // },

    // //优惠券
    // docoupon: function (e) {
    //   var couponshow = !this.data.couponshow;
    //   this.setData({
    //     couponshow: couponshow,
    //   })
    // },
    // //选择优惠券
    // couponChoice: function (e) {
    //   var index = e.currentTarget.dataset.index;
    //   var waitUse = this.data.waitUse;
    //   var clearprice = waitUse[index].couponMoney;
    //   var couponId = waitUse[index].couponId;

    //   var marketPrices = this.data.marketPrices
    //   var totalprice = parseInt(marketPrices * 100 - clearprice * 100) / 100;
    //   totalprice = totalprice < 0 ? 0 : totalprice

    //   this.setData({
    //     totalprice: totalprice,
    //     clearprice: clearprice,
    //     couponshow: false,
    //     couponId: couponId
    //   })
    // },
    onLoad: function(options) {
        var userPhone = wx.getStorageSync('usersInfo').userPhone
        var voucherInfo = wx.getStorageSync('voucherInfo')
        if (!userPhone) {
            this.setData({
                inputPhone: true,
                voucherInfo: voucherInfo
            })
        } else {
            this.setData({
                userPhone: userPhone,
                voucherInfo: voucherInfo
            })
        }
    },
    pay: function(e) {
        this.data.fromId = e.detail.formId;
        var userId = wx.getStorageSync('usersInfo').userId
        var shopId = this.data.voucherInfo.shopId
        var price = this.data.voucherInfo.shopPrice
        var that = this
        var timestamp = (Date.parse(new Date())) / 1000
        var sign = MD5Util.sign(timestamp)
        if (this.data.beingPaid === false) {
            this.data.beingPaid = true
            //查询用户的金额
            wx.request({
                url: 'https://www.aftdc.com/wxapp/Order/getUserMoney',
                data: {
                    sign: sign,
                    timestamp: timestamp,
                    token: wx.getStorageSync('usersInfo').token,
                    userId: userId,
                    shopId: shopId
                },
                method: 'POST',
                header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                success: function(res) {
                    if (res.data.res) {
                        var userMoney = res.data.money
                        if (parseInt(userMoney) >= parseInt(price)) {
                            //余额支付
                            that.data.payType = 1
                            wx.showModal({
                                title: '提示',
                                content: '确定使用余额付款',
                                success: function(msg) {
                                    if (msg.confirm) {
                                        that.addorder()
                                    }
                                }
                            })
                        } else {
                            //微信支付
                            that.data.payType = 3
                            that.addorder()
                        }
                    } else {
                        that.data.payType = 3
                        that.addorder()
                    }
                }
            })

        }
    },
    addorder: function() {

        var arr = new Object()
        var voucherInfo = this.data.voucherInfo
        arr.shopId = voucherInfo.shopId
        arr.groupId = voucherInfo.groupId
        arr.userId = wx.getStorageSync('usersInfo').userId
        arr.realTotalMoney = voucherInfo.shopPrice
        arr.needPay = voucherInfo.shopPrice //
        arr.num = 1
        arr.totalMoney = voucherInfo.marketPrice
        arr.payType = this.data.payType
        arr.fromId = this.data.fromId
        var jsonarr = JSON.stringify(arr)
        var money = (voucherInfo.shopPrice / 100 * 100).toFixed(2) //
        var openid = wx.getStorageSync('usersInfo').openid
        var orderNo = ''
        var that = this
        var timestamp = (Date.parse(new Date())) / 1000
        var sign = MD5Util.sign(timestamp)
        wx.request({
            url: 'https://www.aftdc.com/wxapp/Order/addOrder',
            data: {
                sign: sign,
                timestamp: timestamp,
                token: wx.getStorageSync('usersInfo').token,
                arr: jsonarr,
                orderNo: orderNo
            },
            method: 'POST',
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function(row) {
                if (row.data.res) {
                    that.setData({
                        orderNo: row.data.orderNo
                    })
                } else {
                    util.aftModal({
                        title: '余额不足',
                        icon: 'loading',
                        mask: true
                    })
                    return false
                }
                if (that.data.payType != 1) {
                    var timestamp = (Date.parse(new Date())) / 1000
                    var sign = MD5Util.sign(timestamp)
                    wx.request({
                        url: 'https://www.aftdc.com/wxapp/Order/tkPay',
                        data: {
                            sign: sign,
                            timestamp: timestamp,
                            token: wx.getStorageSync('usersInfo').token,
                            money: money,
                            openId: openid,
                            orderNo: row.data.orderNo
                        },
                        method: 'POST',
                        header: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        success: function(res) {
                            wx.requestPayment({
                                timeStamp: res.data.timestamp,
                                nonceStr: res.data.nonce_str,
                                package: res.data.pkg,
                                signType: 'MD5',
                                paySign: res.data.signc,
                                success: function(res) {
                                    wx.removeStorageSync('voucherInfo')
                                    util.aftModal({
                                        title: '购买成功',
                                        icon: '12',
                                        duration: 2000,
                                        success: setTimeout(function() {
                                            wx.setStorageSync("buyTk", "buyTk")
                                            wx.setStorageSync("currentTab", 3)
                                            wx.switchTab({
                                                url: "/page/tabBar/purchase/index"
                                            })
                                        }, 2000)
                                    })
                                },

                                fail: function(res) {
                                    console.log('1313323')
                                    wx.redirectTo({
                                        url: '../waitPay/waitPay?shopid=' + arr.shopId + '&orderId=' + 423 + '&tk=0',
                                    })
                                }
                            })
                        }
                    })
                    setTimeout(function() {
                        that.data.beingPaid = false
                    }, 2000)
                } else {
                    wx.removeStorageSync('voucherInfo')
                    util.aftModal({
                        title: '购买成功',
                        icon: '12',
                        duration: 2000,
                        success: setTimeout(function() {
                            wx.setStorageSync("buyTk", "buyTk")
                            wx.setStorageSync("currentTab", 3)
                            wx.switchTab({
                              url: "/page/tabBar/purchase/index"
                            })
                        }, 2000)
                    })
                    setTimeout(function() {
                        that.data.beingPaid = false
                    }, 2000)
                }

            }
        })

    },

    getphone: function(e) {
        this.data.phonenum = e.detail.value;
        var phone = e.detail.value;
        var state = true
        var phoneTxt = false

        if (phone.length > 0) {
            if ((/^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/.test(phone))) {
                state = false
            }
            phoneTxt = true
        }
        this.setData({
            phoneY: state,
            phoneTxt: phoneTxt,
        })
    },
    //验证码
    countdown: function() {
        var phone = this.data.phonenum
        if (!(/^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/.test(phone))) {
            util.aftModal({
                title: '手机号错误',
                icon: 'loading'
            })
            return false;
        }
        var second = this.data.second
        var that = this
        if (phone && second == 60) {
            wx.request({
                url: 'https://www.aftdc.com/wxapp/Order/send',
                method: 'POST',
                data: {
                    phone: phone
                },
                header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                success: function(res) {
                    that.setData({
                        countdown: ''
                    });
                    that.second() //60s倒计时
                }
            })
        }
    },

    checkyzm: function(e) {
        this.data.yzm = e.detail.value
    },
    second: function() {
        var second = this.data.second
        var that = this
        if (second > 0) {
            var time = setTimeout(function() {
                that.setData({
                    second: second - 1
                });
                that.second();
            }, 1000)
        } else {
            that.setData({
                second: 60,
                countdown: 'countdown'
            });
        }
    },
    //验证验证码
    tijiao: function() {
        wx.showLoading({
            mask: true
        })
        var yzm = this.data.yzm
        var userId = wx.getStorageSync('usersInfo').userId
        var userPhone = this.data.phonenum
        if (yzm) {
            var that = this
            wx.request({
                url: 'https://www.aftdc.com/wxapp/Order/updUserPhone',
                method: 'POST',
                data: {
                    userPhone: userPhone,
                    userId: userId,
                    yzm: yzm
                },
                header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                success: function(res) {
                    wx.hideLoading()
                    if (res.data.res == 1) {
                        that.setData({
                            userPhone: userPhone,
                            inputPhone: false
                        })
                        util.aftModal({
                            title: '设置成功'
                        })
                    } else if (res.data.res == 2) {
                        util.aftModal({
                            title: '验证码错误',
                            icon: 'loading'
                        })
                    } else {
                        util.aftModal({
                            title: '请重试'
                        })
                    }
                }
            })
        } else {
            util.aftModal({
                title: '输入验证码',
                icon: 'loading'
            })
        }
    }
})