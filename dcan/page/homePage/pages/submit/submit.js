var MD5Util = require('../../../../utils/md5.js');
var util = require('../../../../utils/util.js')
var authorization = require('../../../../utils/authorization.js')
var app = getApp();
Page({
  data: {
    yhqId: 0, //优惠券选取使用id
    honbaoId: 0, //红包选取使用id
    deskNum: -1,
    aa: [{
        a: 0
      },
      {
        a: 0
      },
      {
        a: 0
      },
      {
        a: 0
      },
      {
        a: 0
      },
    ],
    showTime: true,
    datacolor: 0,
    unClickDatacolor: 0,
    gett: -1,
    billShow: true,
    back: false,
    billText: '商家支持开发票',
    billId: 0,
    billMessage: '',
    closeFoodIndex: [],
    dsm: 0,
    deskArr: 0,
    isclose: 0,
    array: ["1", "2", "3"],
    storage: {
      billId: 0,
      orderRemarks: '',
      pickNumb: -1,
      pickTxt: -1
    },
    pickNumb: -1, //需要用餐的人数
    pickTxt: -1,
    pick: true,
    remarkNumb: 0,
    remarkBox: true,
    remarkLabel: ["不要辣", "不吃辣", "不需要餐具", "要冰的"],
    orderRemarks: '',
    addressText: '添加收货地址',
    isTostore: 0, //是否支持到店自取
    shareId: 0,
    killId: 0,
    bargainId: 0,
    orderType: 0,
    zkGoodsId: 0,
    isFrist: 0,
    pid: 0,
    storeType: 0, //配送方式，1商家配送 2到店自取 3堂食，无需配送 4团购
    submit: 'pay', //提交订单按钮的状态 ，空为不能点击

    discount: 0,
    kill: 0,
    bargin: 0,
    discomjunt: 0,
    discount: 0,
    newCou: 0,
    Memberdiscount: 0,
    hongbaoDeduction: 0,
    scoreIntoMoney: 0,
    useScore: 0,
    protocolRadio: true,
    reserve: '',
    presetTime: '',
    requireTime: '',
    reserveTime: '',
    userIds: [],
    newShareId: '',
    orderId: '',
    orderNo: '',
    billSwitch: false,
    isOpen: 1,
    clickTimearr: [],
    clickToday: '',
    timer: '',
    setTimeoutTimer: '',
    allShareOrder: '',
    willUnlock: true, //可以解锁
  },
  onLoad: function(options) {
    
    wx.setStorageSync('backThisAgain', 1)
    var that = this

    var shopInfo = wx.getStorageSync('shopInfo')
    this.orderType(options) //判断订单类型

    if (options.orderNo != undefined) {
      this.setData({
        orderNo: options.orderNo
      })
    }

    if (options.isOpen != undefined) {
      this.setData({
        isOpen: options.isOpen
      })
    }
    if (options.shareId) {
      this.setData({
        newShareId: options.shareId,
      })
    } else {


      //获得缓存·购买的商品
      var orderfood = wx.getStorageSync('orderfood')
      //   var userIds = []
      // if (this.data.shareId) {
      //   userIds.push(orderfood[0].userId)

      //   for (let i = 1; i < orderfood.length; i++) {
      //       if (orderfood[i].userId != orderfood[i - 1].userId) {
      //           userIds.push(orderfood[i].userId)
      //       }
      //   }
      // }else{
      //   var userId = wx.getStorageSync('usersInfo').userId;
      //   userIds.push(userId)
      //   for (let i = 0; i < orderfood.length; i++) {
      //     orderfood[i].userId = userId 
      //   }
      // }
      // for (var j in userIds){
      //   for (var k in orderfood){
      //     if (orderfood[k])
      //   }
      // }
      this.setData({
        orderfood: orderfood,
      })


      //活动商品超出限购数量处理
      var orderfoodBegain = JSON.parse(JSON.stringify(orderfood))
      for (var i in orderfoodBegain) {
        var arr = ''
        // if (orderfoodBegain[i].bargainId && orderfoodBegain[i].numb > 1) {砍价
        //   arr = orderfoodBegain[i]
        //   arr.bargainId = ''
        //   arr.shopPrice = arr.marketPrice
        //   arr.numb = Number(arr.numb) - 1
        //   arr.totalPrice = arr.totalMarketPrice = (Number(arr.shopPrice) * Number(arr.numb)).toFixed(2)
        //   orderfood.push(arr)
        //   orderfood[i].numb = 1
        //   orderfood[i].totalPrice = (Number(orderfood[i].shopPrice) * Number(orderfood[i].numb)).toFixed(2)
        //   orderfood[i].totalMarketPrice = (Number(orderfood[i].marketPrice) * Number(orderfood[i].numb)).toFixed(2)
        // }
        if (orderfoodBegain[i].zkGoodsId && orderfoodBegain[i].buyNum != -1 && orderfoodBegain[i].numb != orderfoodBegain[i].preferentialNumb) { //折扣
          if (orderfoodBegain[i].preferentialNumb == 0) {
            orderfood[i].zkGoodsId = ''
            orderfood[i].shopPrice = orderfood[i].marketPrice
          } else if (Number(orderfoodBegain[i].numb) - Number(orderfoodBegain[i].preferentialNumb) > 0) {
            arr = orderfoodBegain[i]
            arr.zkGoodsId = ''
            arr.shopPrice = arr.marketPrice
            arr.numb = Number(arr.numb) - Number(arr.preferentialNumb)
            arr.totalPrice = arr.totalMarketPrice = (Number(arr.shopPrice) * Number(arr.numb)).toFixed(2)
            orderfood.push(arr)
            orderfood[i].numb = Number(arr.preferentialNumb)
            orderfood[i].totalPrice = (Number(orderfood[i].shopPrice) * Number(orderfood[i].numb)).toFixed(2)
            orderfood[i].totalMarketPrice = (Number(orderfood[i].marketPrice) * Number(orderfood[i].numb)).toFixed(2)
          }
        }
      }
      this.setData({
        orderfood: orderfood,
      })
    }
    console.log(this.data.orderfood)
    //送达时间的处理
    that.serviceTime(options)
    this.setData({
      options: options,
      dlvService: shopInfo.dlvService,
      isTostore: shopInfo.isTostore,
      deductions: options.deduction, //优惠金额
      userPhone: wx.getStorageSync('usersInfo').userPhone,
    })

    if (this.data.orderType == 4) {
      that.addtkOrders()
    } else {
      if (that.data.newShareId) {
        that.settlementShare();
      } else {
        that.addOrders()
      }

    }
  },
  //送达时间的处理
  serviceTime: function(options) {
    var shopInfo = wx.getStorageSync('shopInfo')
    console.log(shopInfo)
    var now = util.formatTimes(new Date)
    now = util.formateIOS(now)
    if (this.data.storeType == 2) {
      if (options.isOpen == 1) {
        var reserveTime = util.addMinutes(new Date, shopInfo.choiceMealTime) //当前时间加上商家的备餐格式:(12:22)

      } else {
        var dateN = util.formatTime(new Date)
        for (var i = shopInfo.serviceTime.length - 1; i >= 0; i--) { //商家休息的时候，reserveTime的值
          if (now > util.formateIOS(dateN + ' ' + shopInfo.serviceTime[i].serviceEndTime + ":00")) {
            if (i == shopInfo.serviceTime.length - 1) {
              var datestr = util.formateIOS(dateN + ' ' + shopInfo.serviceTime[0].serviceStartTime + ":00")
            } else {
              var datestr = util.formateIOS(dateN + ' ' + shopInfo.serviceTime[i + 1].serviceStartTime + ":00")
            }
            break;
          } else {
            var datestr = util.formateIOS(dateN + ' ' + shopInfo.serviceTime[0].serviceStartTime + ":00")
          }
        }
        var reserveTime = util.addMinutes(datestr, shopInfo.choiceMealTime)
      }
    } else {
      if (options.isOpen == 1) {
        var reserveTime = util.addMinutes(new Date, shopInfo.deliveryCostTime) //当前时间加上商家的配送时间格式:(12:22)

      } else {
        var dateN = util.formatTime(new Date)
        for (var i = shopInfo.serviceTime.length - 1; i >= 0; i--) {
          if (now > util.formateIOS(dateN + ' ' + shopInfo.serviceTime[i].serviceEndTime + ":00")) {
            if (i == shopInfo.serviceTime.length - 1) {
              var datestr = util.formateIOS(dateN + ' ' + shopInfo.serviceTime[0].serviceStartTime + ":00")
            } else {
              var datestr = util.formateIOS(dateN + ' ' + shopInfo.serviceTime[i + 1].serviceStartTime + ":00")
            }
            break;
          } else {
            var datestr = util.formateIOS(dateN + ' ' + shopInfo.serviceTime[0].serviceStartTime + ":00")
          }
        }
        var reserveTime = util.addMinutes(datestr, shopInfo.deliveryCostTime)
      }
    }

    var dateN = util.formatTime(new Date)
    var datestr = util.formateIOS(dateN + ' ' + "00:00:00")

    //预订时间
    var now = util.formatTimes(new Date)
    now = util.formateIOS(now)
    var endTime = util.formateIOS(dateN + ' ' + shopInfo.serviceTime[shopInfo.serviceTime.length - 1].serviceEndTime + ":00")
    if ((shopInfo.reserve == 1 && this.data.orderType == 0) || (shopInfo.selfReserve == 1 && this.data.orderType == 5)) {
      if (this.data.orderType == 5) {
        var scheduledDate = shopInfo.selfScheduledDate
      } else {
        var scheduledDate = shopInfo.scheduledDate
      }

      scheduledDate = scheduledDate.split(",");
      var presetTime = []

      for (var i in scheduledDate) {
        var today = util.addDay(datestr, scheduledDate[i] - 1)
        if (scheduledDate[i] == 1) {
          today = '今天'
        }
        if (scheduledDate[i] == 2) {
          today = '明天'
        }
        var presetTimeItem = {
          days: scheduledDate[i] - 1,
          today: today
        }
        presetTime.push(presetTimeItem)

      }
      if (now > endTime && presetTime[0].days == 0) { //如果当前时间超出结束营业时间且预订时间含有今天则删除掉今天
        presetTime.splice(0, 1)
      }

      this.setData({
        presetTime: presetTime,
      })
    } else {
      var presetTime = []
      var scheduledDate = [1]
      var presetTimeItem = {
        days: 0,
        today: '今天'
      }
      presetTime.push(presetTimeItem)
      this.setData({
        presetTime: presetTime,

      })
    }

    if (scheduledDate == 1 || scheduledDate[0] == 1) {
      if (this.data.isOpen == 2) {
        var requireTime = ''
      } else {
        if (this.data.orderType == 5) {
          var reserveTimeYear = util.reserveTimeYear(new Date, shopInfo.choiceMealTime) //当前时间加上商家的备餐时间格式:(2018-10-15 55:22:00)
        } else {
          var reserveTimeYear = util.reserveTimeYear(new Date, shopInfo.deliveryCostTime) //当前时间加上商家的配送时间格式:(2018-10-15 55:22:00)
        }

        var requireTime = util.formatTime(util.formateIOS(reserveTimeYear)) + ' ' + reserveTime //默认的请求送达时间

      }
      if (this.data.orderType != 5 && options.isOpen == 1) {
        this.setData({
          reserveTime: "尽快到达|预计" + reserveTime,
        })
      } else {
        this.setData({
          reserveTime: reserveTime,
        })
      }


    } else {
      var requireTime = ''
      reserveTime = ''
    }
    if (this.data.orderType == 5) {
      this.setData({
        reserve: shopInfo.selfReserve,
      })
    } else {
      this.setData({
        reserve: shopInfo.reserve,
      })
    }
    this.setData({
      options: options,
      shopInfo: shopInfo,
      requireTime: requireTime,
      reTime: reserveTime,
    })
  },
  //隔一分钟刷新一次时间
  refreshServiceTime: function(options) {
    var that = this
    var now = util.formatTimes(new Date)
    now = now.split(':')[2]
    var countDown = (60 - Number(now)) * 1000
    var setTimeoutTimer = setTimeout(function() { //延迟执行确保整点刷新时间

      var unClickDatacolor = that.data.unClickDatacolor
      var presetTime = that.data.presetTime
      that.serviceTime(options)
      console.log(2)
      if (that.data.reserve == 1 && presetTime) {
        if (presetTime[0].days == 0 && unClickDatacolor == 0) {
          that.today() //当前时间
        }
        var gett = that.data.gett
        if (gett != -1) {
          var time = that.data.clickTimearr[gett]
          that.setData({
            requireTime: that.data.clickToday + " " + time,
            reserveTime: that.data.clickToday + " " + time,
          })
        }
      }
      //整点刷新时间后每隔1分钟刷新一次时间
      var timer = setInterval(function() {
        that.serviceTime(options)
        console.log(3)
        var unClickDatacolor = that.data.unClickDatacolor
        if (that.data.reserve == 1 && presetTime) {
          if (presetTime[0].days == 0 && unClickDatacolor == 0) {
            that.today() //当前时间
          }
          var gett = that.data.gett
          if (gett != -1) {
            var time = that.data.clickTimearr[gett]
            that.setData({
              requireTime: that.data.clickToday + " " + time,
              reserveTime: that.data.clickToday + " " + time,
            })
          }

        }
      }, 60000)
      that.setData({
        timer: timer
      })
    }, countDown)
    that.setData({
      setTimeoutTimer: setTimeoutTimer,
    })
  },
  //添加订单
  addOrders: function() {
    var that = this;
    var timestamp = (Date.parse(new Date())) / 1000;
    var sign = MD5Util.sign(timestamp);
    var orderfood = JSON.stringify(that.data.orderfood);
    console.log(orderfood)
    var shopInfo = wx.getStorageSync('shopInfo');
    var orderType = this.data.orderType;
    var shopId = shopInfo.shopId;
    var userId = wx.getStorageSync('usersInfo').userId;
    var deskNum = this.data.deskNum ? this.data.deskNum : -1;
    var deskArr = this.data.deskArr ? JSON.stringify(this.data.deskArr) : '';
    var couponId = this.data.couponId ? this.data.couponId : '';
    var hongbaoId = this.data.hongbaoId ? this.data.hongbaoId : '';
    wx.request({
      url: 'https://www.aftdc.com/wxapp/Desk/addOrders',
      method: "POST",
      data: {
        sign: sign,
        timestamp: timestamp,
        token: wx.getStorageSync('usersInfo').token,
        orderfood: orderfood,
        shopId: shopId,
        userId: userId,
        orderType: orderType,
        deskNum: deskNum,
        deskArr: deskArr,
        shareId: that.data.shareId,
        couponId: couponId,
        redpacketId: hongbaoId,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        if (res.data.res == 1) {
          that.data.orderId = res.data.orderId
          that.data.orderNo = res.data.orderNo
          that.setData({
            dsm: res.data.data.peisongMoney,
            boxFees: res.data.data.allBoxMoney,
            totalprice: res.data.data.allMoney,
            totalnumb: res.data.data.allNum,
            true_pay: res.data.data.needPay,
            youhuiList: res.data.data.youhui,
            payYes: true,
            orderId: res.data.orderId,
            orderNo: res.data.orderNo,
            animationLoading: true, //加载图
          })
          if (that.data.shareId) {
            that.setData({
              true_pay: res.data.data.pdneedPay,
              pdYouhui: res.data.data.pdYouhui,
            })
          }
          that.getUserYH(res.data.data.allMoney + res.data.data.allBoxMoney, shopId, userId)
        } else {
          wx.showModal({
            title: '',
            content: res.data.info,
            showCancel: false,
            confirmColor: '#53beb7',
            success: function(res) {
              wx.navigateBack({
                delta: 2
              })
            }
          })
          that.setData({
            submit: 'pay',
            payYes: false,
            animationLoading: true, //加载图
          })
        }
      }
    })
  },

  //添加团购订单
  addtkOrders: function() {
    var that = this
    var timestamp = (Date.parse(new Date())) / 1000
    var sign = MD5Util.sign(timestamp)
    var orderfood = JSON.stringify(wx.getStorageSync('orderfood'))
    var shopInfo = wx.getStorageSync('shopInfo')
    var orderType = this.data.orderType
    var shopType = wx.getStorageSync('shopType')
    var shopId = shopInfo.shopId
    var userId = wx.getStorageSync('usersInfo').userId
    var couponId = this.data.couponId ? this.data.couponId : ''
    var hongbaoId = this.data.hongbaoId ? this.data.hongbaoId : ''
    wx.request({
      url: 'https://www.aftdc.com/wxapp/Desk/addtkOrders',
      method: "POST",
      data: {
        sign: sign,
        timestamp: timestamp,
        token: wx.getStorageSync('usersInfo').token,
        orderfood: orderfood,
        shopId: shopId,
        userId: userId,
        orderType: orderType,
        shareId: that.data.shareId,
        couponId: couponId,
        redpacketId: hongbaoId,
        shopType: shopType
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        if (res.data.res == 1) {
          that.data.orderId = res.data.orderId
          that.data.orderNo = res.data.orderNo
          that.setData({
            dsm: 0,
            boxFees: 0,
            totalprice: res.data.data.allMoney,
            totalnumb: res.data.data.allNum,
            true_pay: res.data.data.needPay,
            youhuiList: res.data.data.youhui,
            payYes: true,
            animationLoading: true, //加载图
          })
          if (that.data.shareId) {
            that.setData({
              true_pay: res.data.data.pdneedPay,
              pdYouhui: res.data.data.pdYouhui,
            })
          }
          that.getUserYH(res.data.data.allMoney, shopId, userId)
        } else {
          that.setData({
            submit: 'pay',
            payYes: false,
            animationLoading: true, //加载图
          })
        }
      }
    })
  },
  //获取用户的优惠券和红包
  getUserYH: function(money, shopId, userId) {
    var that = this
    var timestamp = (Date.parse(new Date())) / 1000
    var sign = MD5Util.sign(timestamp)
    wx.request({
      url: 'https://www.aftdc.com/wxapp/Desk/getUserYH',
      method: "POST",
      data: {
        sign: sign,
        timestamp: timestamp,
        token: wx.getStorageSync('usersInfo').token,
        shopId: shopId,
        userId: userId,
        money: money
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        if (res.data.res == 1) {
          that.setData({
            canUseYhq: res.data.coupon,
            hongbaoTemp: res.data.hongbao,
          })
        }
      }
    })
  },
  //获取用户的信息
  onReady: function() {
    var that = this


    console.log(this.data.reserve)
    if (this.data.reserve != 1) {
      var dateN = util.formatTime(new Date)
      this.setData({
        today: dateN,
      })
    }
    if (this.data.presetTime.length > 0) {
      this.setData({
        datacolor: this.data.presetTime[0].days,
        unClickDatacolor: this.data.presetTime[0].days,
      })
    }



  },
  //获取拼单的信息
  settlementShare: function() {
    var that = this;
    var timestamp = (Date.parse(new Date())) / 1000;
    var sign = MD5Util.sign(timestamp);
    var shopInfo = wx.getStorageSync('shopInfo');
    var shopId = shopInfo.shopId;
    wx.request({
      url: 'https://www.aftdc.com/wxapp/Desk/settlementShare',
      method: "POST",
      data: {
        sign: sign,
        timestamp: timestamp,
        token: wx.getStorageSync('usersInfo').token,
        shopId: shopId,
        shareId: that.data.newShareId,
        orderType: that.data.orderType,
        deskNum:-1,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        if (res.data.res == 1) {
          that.data.orderId = res.data.orderId
          that.data.orderNo = res.data.orderNo
          that.setData({
            dsm: res.data.data.peisongMoney,
            boxFees: res.data.data.allBoxMoney,
            totalprice: res.data.data.allMoney,
            totalnumb: res.data.data.allNum,
            true_pay: res.data.data.needPay,
            youhuiList: res.data.data.youhui,
            payYes: true,
            orderId: res.data.orderId,
            orderNo: res.data.orderNo,
            allShareOrder: res.data.goodsInfo,
            animationLoading: true, //加载图
          })

          // if (that.data.shareId) {
          //   that.setData({
          //     true_pay: res.data.data.pdneedPay,
          //     pdYouhui: res.data.data.pdYouhui,
          //   })
          // }
          that.getUserYH(res.data.data.allMoney + res.data.data.allBoxMoney, shopId, wx.getStorageSync('usersInfo').userId)
        } else {
          wx.showModal({
            title: '',
            content: res.data.info,
            showCancel: false,
            confirmColor: '#53beb7',
            success: function(res) {
              wx.navigateBack({
                delta: 2
              })
            }
          })
          that.setData({
            submit: 'pay',
            payYes: false,
            animationLoading: true, //加载图
          })
        }
      }
    })
  },
  //订单类型和配送方式
  orderType: function(options) {
    if (options.orderType) { //拼单，订单 页面进来
      wx.setStorageSync('orderType', options.orderType)
      this.setData({
        orderType: orderType
      })
    } else { //从首页一路进来
      var orderType = wx.getStorageSync('orderType')
      this.setData({
        orderType: orderType
      })
    }
    if (orderType == 0) { //外卖
      this.setData({
        storeType: 1
      })
    } else if (orderType == 2) { //扫码堂食
      this.setData({
        storeType: 3,
        deskNum: options.deskNum,
        deskName: options.deskName
      })
    } else if (orderType == 3) { //堂食预订
      var deskArr = wx.getStorageSync('deskArr')
      this.setData({
        storeType: 3,
        deskArr: deskArr,
      })
    } else if (orderType == 4) { //团购
      var tk = 1
      this.setData({
        storeType: 4,
        tk: tk
      })
    } else if (orderType == 5) { //到店
      this.setData({
        storeType: 2
      })
    }
  },
  //选择送达时间
  instant: function(e) {
    var time = e.currentTarget.dataset.str

    this.setData({
      requireTime: this.data.today + " " + time,
      showTime: true,
      reserveTime: this.data.today + " " + time,
      gett: -1,
      datacolor: this.data.unClickDatacolor
    })
  },
  comTime: function(e) {
    var index = e.currentTarget.dataset.number
    var time = e.currentTarget.dataset.time
    this.setData({
      showTime: true,
      requireTime: this.data.today + " " + time,
      reserveTime: this.data.today + " " + time,
      gett: index,
      datacolor: this.data.unClickDatacolor,
      clickTimearr: this.data.timearr,
      clickToday: this.data.today
    })
    console.log(this.data.datacolor)
  },
  today: function() {
    if (this.data.reserve == 1) {
      var dateN = util.formatTime(new Date)
      var addTime = this.data.reTime
      var shopInfo = wx.getStorageSync('shopInfo')
      //获取可选预计的时间
      var timearr = [];
      if (this.data.isOpen == 2) {
        timearr.push(this.data.reTime)
      }
      for (var j = 0; j < shopInfo.serviceTime.length; j++) {
        if (util.formateIOS(dateN + ' ' + addTime + ":00") < util.formateIOS(dateN + ' ' + shopInfo.serviceTime[j].serviceStartTime + ":00")) {
          var addTime = shopInfo.serviceTime[j].serviceStartTime
        }
        if (this.data.orderType == 5) {
          var reserveTimeYear = util.reserveTimeYear(new Date, shopInfo.choiceMealTime) //当前时间加上商家的备餐时间格式:(2018-10-15 55:22:00)
        } else {
          var reserveTimeYear = util.reserveTimeYear(new Date, shopInfo.deliveryCostTime) //当前时间加上商家的配送时间格式:(2018-10-15 55:22:00)
        }



        var timeEnd = false
        if (util.formateIOS(reserveTimeYear) < util.formateIOS(dateN + ' ' + shopInfo.serviceTime[j].serviceEndTime + ":00")) {
          for (var i = 0; i < 50; i++) {
            var datestr = util.formateIOS(dateN + ' ' + addTime + ":00")

            var addTime = util.addMinutes(datestr, 15)
            if (datestr >= util.formateIOS(dateN + ' ' + shopInfo.serviceTime[j].serviceEndTime + ":00")) {
              if (datestr != util.formateIOS(dateN + ' ' + shopInfo.serviceTime[j].serviceEndTime + ":00")) {
                timeEnd = true
              }
              break;
            } else if (datestr >= util.formateIOS(dateN + ' ' + "23:45" + ":00")) {
              timearr.push(addTime)
              timeEnd = true
              break;
            } else {
              timearr.push(addTime)
            }
          }


          timearr.pop()
          if (timeEnd) {
            var addTime = shopInfo.serviceTime[j].serviceEndTime
            timearr.push(addTime)
          }
        }
      }
      this.setData({
        timearr: timearr,
        today: util.formatTime(util.formateIOS(reserveTimeYear)),
        unClickDatacolor: 0
      })
    }
  },

  toTime: function(e) {
    var days = e.currentTarget.dataset.id
    var dateN = util.formatTime(new Date)
    var shopInfo = wx.getStorageSync('shopInfo')
    //获取可选预计的时间
    var timearr = [];
    for (var j = 0; j < shopInfo.serviceTime.length; j++) {
      var addTime = shopInfo.serviceTime[j].serviceStartTime
      var datestr = util.formateIOS(dateN + ' ' + addTime + ":00")
      if (this.data.storeType == 2) {
        var addTime = util.addMinutes(datestr, shopInfo.choiceMealTime) //开始时间加备餐
      } else {
        var addTime = util.addMinutes(datestr, shopInfo.deliveryCostTime) //开始时间加配送时间
      }

      timearr.push(addTime)
      var timeEnd = false
      for (var i = 0; i < 50; i++) {
        var datestr = util.formateIOS(dateN + ' ' + addTime + ":00")
        var addTime = util.addMinutes(datestr, 30)
        if (datestr >= util.formateIOS(dateN + ' ' + shopInfo.serviceTime[j].serviceEndTime + ":00")) {
          if (datestr != util.formateIOS(dateN + ' ' + shopInfo.serviceTime[j].serviceEndTime + ":00")) {
            timeEnd = true
          }
          break;
        } else if (datestr >= util.formateIOS(dateN + ' ' + "23:30" + ":00")) {
          timearr.push(addTime)
          timeEnd = true
          break;
        } else {
          timearr.push(addTime)
        }
      }

      var datestr = util.formateIOS(dateN + ' ' + "00:00:00")
      var today = util.addDay(datestr, days)
      timearr.pop()
      if (timeEnd) {
        var addTime = shopInfo.serviceTime[j].serviceEndTime
        timearr.push(addTime)
      }
    }
    this.setData({
      timearr: timearr,
      today: today,
      unClickDatacolor: days
    })
  },
  selTime: function() {
    var that = this
    this.setData({
      unClickDatacolor: this.data.datacolor,
    })
    var presetTime = that.data.presetTime
    if (this.data.reserve == 1) {
      if (presetTime) {
        if (this.data.unClickDatacolor == 0) {

          that.today() //当前时间
        } else {
          var days = this.data.unClickDatacolor
          var dateN = util.formatTime(new Date)
          var shopInfo = wx.getStorageSync('shopInfo')
          //获取可选预计的时间
          var timearr = [];
          for (var j = 0; j < shopInfo.serviceTime.length; j++) {
            var addTime = shopInfo.serviceTime[j].serviceStartTime
            var datestr = util.formateIOS(dateN + ' ' + addTime + ":00")
            if (this.data.orderType == 5) {
              var addTime = util.addMinutes(datestr, shopInfo.choiceMealTime) //开始时间加备餐
            } else {
              var addTime = util.addMinutes(datestr, shopInfo.deliveryCostTime) //开始时间加配送时间
            }


            timearr.push(addTime)
            var timeEnd = false
            for (var i = 0; i < 50; i++) {
              var datestr = util.formateIOS(dateN + ' ' + addTime + ":00")
              var addTime = util.addMinutes(datestr, 30)
              if (datestr >= util.formateIOS(dateN + ' ' + shopInfo.serviceTime[j].serviceEndTime + ":00")) {
                if (datestr != util.formateIOS(dateN + ' ' + shopInfo.serviceTime[j].serviceEndTime + ":00")) {
                  timeEnd = true
                }
                break;
              } else if (datestr >= util.formateIOS(dateN + ' ' + "23:30" + ":00")) {
                timearr.push(addTime)
                timeEnd = true
                break;
              } else {
                timearr.push(addTime)
              }
            }
            var datestr = util.formateIOS(dateN + ' ' + "00:00:00")
            var today = util.addDay(datestr, days)
            timearr.pop()
            if (timeEnd) {
              var addTime = shopInfo.serviceTime[j].serviceEndTime
              timearr.push(addTime)
            }
          }
          this.setData({
            timearr: timearr,
            today: today,
            datacolor: days
          })
        }
      }
    }
    this.setData({
      showTime: false,
    })
  },
  quxiao: function() {
    var that = this
    that.setData({
      showTime: true
    })
  },
  goon: function() {
    this.setData({
      isclose: 0
    })
  },

  //提交订单购买
  pay: util.throttle(function (e) {
    this.setData({ //标志按下提交订单
      submit: ''
    })
    var that = this
    var orderfood = wx.getStorageSync('orderfood')
    orderfood = JSON.stringify(orderfood)

    // if (this.data.orderNo) { //如果有单号，直接付款
    //   var true_pay = this.data.true_pay
    //   var shopName = this.data.shopInfo.shopName
    //   var orderNo = this.data.orderNo
    //   var pay_money = parseInt(true_pay * 100) / 100
    //   this.payment(pay_money, shopName, orderNo)
    // } else { //添加数据到后台
    // this.addGoods(e)
    // }

    if (this.data.orderType == 4)
      this.addtkGoods(e)
    else
      this.addGoods(e)
  }),
  //添加数据到后台
  addGoods: function(e) {
    var that = this
    var deskArr = wx.getStorageSync('deskArr') || []
    if (!that.data.address && that.data.storeType == 1 && that.data.orderType == 0) {
      wx.showToast({
        title: '请选择收货地址',
        icon: 'loading',
        duration: 1000
      })
      this.setData({
        submit: 'pay'
      })
      return false;
    }
    if (that.data.orderType == 3) {
      var userName = that.data.deskArr.inputName
      var userPhone = that.data.deskArr.inputPhone
      this.data.requireTime = that.data.deskArr.reachTime;
      var address = '堂食预订'
      var lat = 0
      var lng = 0
    } else if (that.data.orderType == 2) {
      var userName = wx.getStorageSync('usersInfo').userName
      var userPhone = wx.getStorageSync('usersInfo').userPhone
      var address = that.data.deskNum + '号桌'
      var lat = 0
      var lng = 0
    } else if (that.data.orderType == 5) {
      var userName = wx.getStorageSync('usersInfo').userName
      var userPhone = wx.getStorageSync('usersInfo').userPhone
      var address = '到店自取'
      var lat = 0
      var lng = 0
    } else {
      var userName = that.data.address.userName
      var userPhone = that.data.address.userPhone
      var address = that.data.address.address
      var lat = that.data.address.latitude
      var lng = that.data.address.longitude
    }
    var protocolRadio = this.data.protocolRadio
    if (that.data.orderType == 5 && !protocolRadio) {
      wx.showToast({
        title: '未同意服务协议',
        icon: 'loading',
        duration: 1000,
      })
      this.setData({
        submit: 'pay'
      })
      return false
    }
    if (!userPhone) {
      wx.showToast({
        title: '请设置手机号',
        icon: 'loading',
        duration: 1000,
      })
      this.setData({
        submit: 'pay'
      })
      return false
    }
    var payYes = that.data.payYes
    if (!payYes) {
      wx.showToast({
        title: '购买金额不够',
        icon: 'loading',
        duration: 1000,
      })
      this.setData({
        submit: 'pay'
      })
      return false
    }
    var requireTime = that.data.requireTime; //送达时间
    if (!requireTime) {
      wx.showToast({
        title: '未选择送达时间',
        icon: 'loading',
        duration: 1000,
      })
      this.setData({
        submit: 'pay'
      })
      return false
    }
   
    var shopInfo = this.data.shopInfo
    if (this.data.orderType == 5) {
      var reserveTimeYear = util.reserveTimeYear(new Date, shopInfo.choiceMealTime) //当前时间加上商家的备餐时间格式:(2018-10-15 55:22:00)
    } else {
      var reserveTimeYear = util.reserveTimeYear(new Date, shopInfo.deliveryCostTime) //当前时间加上商家的配送时间格式:(2018-10-15 55:22:00)
    }
    console.log(123)
    var distributionNow = 0
    if (orderType != 3) {
      if (util.formateIOS(reserveTimeYear) >= util.formateIOS(requireTime + ':00')) {
        distributionNow = 1 //立即送达
      } else {
        distributionNow = 0 //预订
      }
    }

    
    var shopName = that.data.shopInfo.shopName
    var orderRemarks = that.data.orderRemarks
    var fromId = e.detail.formId;
    var orderType = that.data.orderType
    if (that.data.billSwitch) {
      var billId = app.globalData.billId //发票Id
      if (!billId) {
        wx.showToast({
          title: '请选择发票',
          icon: 'loading',
          duration: 1000,
        })
        this.setData({
          submit: 'pay'
        })
        return false
      }
    } else {
      var billId = ''
    }

    if (orderType == 0) {
      var deskNum = -1
    } else {
      var deskNum = that.data.deskNum
    }
    var openid = wx.getStorageSync('usersInfo').openid
    var pickNumb = that.data.pickNumb
    var timestamp = (Date.parse(new Date())) / 1000
    var sign = MD5Util.sign(timestamp)
    wx.request({
      url: 'https://www.aftdc.com/wxapp/Desk/updataOrders',
      method: "POST",
      data: {
        sign: sign,
        timestamp: timestamp,
        token: wx.getStorageSync('usersInfo').token,
        orderId: that.data.orderId,
        userName: userName,
        userPhone: userPhone,
        address: address,
        orderRemarks: orderRemarks,
        pickNumb: pickNumb, //用餐人数，餐具数量
        requireTime: requireTime,
        billId: billId,
        lat: lat,
        lng: lng,
        fromId: fromId,
        distributionNow: distributionNow,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        if (res.data.res == 0) {
          wx.showModal({
            title: '',
            content: res.data.info,
            showCancel: false,
            confirmColor: '#53beb7',
            success: function(res) {
              wx.navigateBack({
                delta: 2
              })
            }
          })
          return false
        }
        wx.removeStorageSync('shareId')
        if (res.data.type == 2) { //微信支付
          that.setData({
            willUnlock: false,
          })
          that.payment(res.data.needPay, shopName, that.data.orderNo);
        } else { //余额支付
          that.setData({
            willUnlock: false,
          })
          that.userMoneyPay(res.data.needPay, shopName, that.data.orderNo)
        }
      }
    })
  },
  //添加团购数据
  addtkGoods: function(e) {
    var userName = wx.getStorageSync('usersInfo').userName
    var userPhone = wx.getStorageSync('usersInfo').userPhone
    var address = '团购'

    var that = this
    var shopName = that.data.shopInfo.shopName
    var fromId = e.detail.formId;
    var openid = wx.getStorageSync('usersInfo').openid
    var timestamp = (Date.parse(new Date())) / 1000
    var sign = MD5Util.sign(timestamp)
    wx.request({
      url: 'https://www.aftdc.com/wxapp/Desk/updataTkOrders',
      method: "POST",
      data: {
        sign: sign,
        timestamp: timestamp,
        token: wx.getStorageSync('usersInfo').token,
        orderId: that.data.orderId,
        userName: userName,
        userPhone: userPhone,
        address: address,
        fromId: fromId
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        if (res.data.res == 0) {
          wx: wx.showToast({
            title: res.data.info,
            icon: 'loading',
            duration: 1500,
          })
          return false
        }
        wx.removeStorageSync('shareId')
        if (res.data.type == 2) { //微信支付
          that.payment(res.data.needPay, shopName, that.data.orderNo);
        } else { //余额支付
          that.userMoneyPay(res.data.needPay, shopName, that.data.orderNo)
        }
      }
    })
  },
  //微信付款
  payment: function(true_pay, shopName, orderNo) {
    var that = this
    var oid = wx.getStorageSync('usersInfo').openid
    var userId = wx.getStorageSync('usersInfo').userId
    var p_name = shopName + "外卖订单"
    var shopInfo = wx.getStorageSync('shopInfo')
    var shopId = shopInfo.shopId

    var timestamp = (Date.parse(new Date())) / 1000
    var sign = MD5Util.sign(timestamp)
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
        shopId: shopId,
        tk: that.data.tk
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(res) {

        var deskArr = JSON.stringify(that.data.deskArr) //获取缓存
        wx.requestPayment({
          timeStamp: res.data.timestamp,
          nonceStr: res.data.nonce_str,
          package: res.data.pkg,
          signType: 'MD5',
          paySign: res.data.signc,
          success: function(res) {
            wx.setStorageSync('backThisAgain', 0)
            if (that.data.storeType == 4) {
              wx.redirectTo({
                url: '../../../purchase/pages/group/group?orderId=' + that.data.orderId + '&shopid=' + that.data.shopId
              })
            } else {
              wx.redirectTo({
                url: '../waitPay/waitPay?orderId=' + that.data.orderId + '&tk=' + that.data.tk,
              })
            }

            if (that.data.shareId) {
              wx.removeStorageSync('shareId') //拼单
            }
            //支付成功删除缓存
            wx.removeStorageSync('deskArr')
            // wx.navigateBack()

          },
          fail: function(res) {
            wx.setStorageSync('backThisAgain', 0)
            wx.redirectTo({
              url: '../waitPay/waitPay?orderId=' + that.data.orderId + '&tk=' + that.data.tk + '&pid=' + that.data.pid,
            })
          }
        })
      }
    })
  },
  //余额支付
  userMoneyPay: function(true_pay, shopName, orderNo) {
    var that = this
    var userId = wx.getStorageSync('usersInfo').userId


    wx.showModal({
      title: '提示',
      content: '确定使用余额' + true_pay + '元付款？',
      success: function(res) {
        if (res.confirm) {
          var timestamp = (Date.parse(new Date())) / 1000
          var sign = MD5Util.sign(timestamp)
          wx.request({
            url: 'https://www.aftdc.com/wxapp/Desk/updGoods',
            method: "POST",
            data: {
              sign: sign,
              timestamp: timestamp,
              token: wx.getStorageSync('usersInfo').token,
              orderNo: orderNo,
              pid: that.data.pid,
              userId: userId,
              shopId: that.data.shopInfo.shopId,
              tk: that.data.tk
            },
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function(conn) {
              //支付成功删除缓存
              wx.removeStorageSync('deskArr')
              if (conn.data.res == 1) {
                wx.showModal({
                  title: '提示',
                  content: '购买成功',
                  showCancel: false,
                  success: function() {
                    wx.setStorageSync('backThisAgain', 0)
                    if (that.data.storeType == 4) {
                      wx.redirectTo({
                        url: '../../../purchase/pages/group/group?orderId=' + that.data.orderId + '&shopid=' + that.data.shopId
                      })
                    } else {
                      wx.redirectTo({
                        url: '../waitPay/waitPay?orderId=' + that.data.orderId + '&tk=' + that.data.tk,
                      })
                    }
                    // wx.navigateBack()
                    if (that.data.shareId) {
                      // wx.removeStorageSync('shareId') //拼单
                      var shareData = wx.getStorageSync('shareData');
                      for (var i in shareData) {
                        if (shareData[i]['shareId'] == that.data.shareId) shareData.splice(i, 1);
                      }
                      wx.setStorageSync('shareData', shareData)
                    }
                    //支付成功删除缓存
                    wx.removeStorageSync('deskArr')
                  }
                })
              } else if (conn.data.res == 2) { //余额不足
                that.setData({ //标志按下提交订单
                  submit: 'pay'
                })
                wx.showModal({
                  title: '提示',
                  content: '余额不足',
                  showCancel: false,
                  success: function() {
                    that.onReady()
                  }
                })
              }
            }
          })
        } else {
          wx.setStorageSync('backThisAgain', 0)
          wx.redirectTo({
            url: '../waitPay/waitPay?orderId=' + that.data.orderId + '&tk=' + that.data.tk + '&pid=' + that.data.pid,
          })
        }
      }
    })
  },
  //备注的内容
  bindblur: function(e) {
    var orderRemarks = e.detail.value;
    var that = this
    that.setData({
      orderRemarks: orderRemarks
    })
  },
  //选择地址
  checkaddr: util.throttle(function () {
    wx.navigateTo({
      url: '../../../personal/pages/address/address?shopId=' + this.data.shopInfo.shopId,
    })
  }),
  //弹出优惠券选择框
  docoupon: function(e) {
    this.setData({
      couponshow: true,
    })
  },

  //弹出红包选择框
  dohongbao: function(e) {
    this.setData({
      hongbaoshow: true,
    })
  },
  //不使用优惠券
  closeYhq: function() {
    this.data.couponId = ''
    this.addOrders()
    this.setData({
      deduction: '',
      couponshow: false,
    })
  },
  //不使用红包
  closeHongbao: function() {
    this.data.hongbaoId = ''
    this.addOrders()
    this.setData({
      hongbaoDeduction: '',
      hongbaoId: '',
      hongbaoshow: false,
    })
  },
  //选择优惠券
  couponChoice: function(e) {
    var index = e.currentTarget.dataset.index
    this.data.couponId = this.data.canUseYhq[index].couponId
    this.addOrders()
    this.setData({
      deduction: this.data.canUseYhq[index].couponMoney,
      couponshow: false,
    })
  },
  switchChange: function(e) {
    var that = this
    that.setData({
      billSwitch: e.detail.value
    })

  },
  //选择红包
  hongbaoChoice: function(e) {
    var that = this
    var index = e.currentTarget.dataset.index
    this.data.hongbaoId = this.data.hongbaoTemp[index].id
    this.setData({
      hongbaoDeduction: this.data.hongbaoTemp[index].piece,
      hongbaoId: this.data.hongbaoTemp[index].id,
      hongbaoshow: false,
    })
    var timestamp = (Date.parse(new Date())) / 1000
    var sign = MD5Util.sign(timestamp)
    wx.request({
      url: 'https://www.aftdc.com/wxapp/Desk/selectRedpacket',
      method: "POST",
      data: {
        sign: sign,
        timestamp: timestamp,
        token: wx.getStorageSync('usersInfo').token,
        orderId: that.data.orderId,
        orderNo: that.data.orderNo,
        redpacketId: that.data.hongbaoId
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        if (res.data.res == 1) {
          that.data.orderId = res.data.orderId
          that.data.orderNo = res.data.orderNo
          that.setData({
            dsm: res.data.data.peisongMoney,
            boxFees: res.data.data.allBoxMoney,
            totalprice: res.data.data.allMoney,
            totalnumb: res.data.data.allNum,
            true_pay: res.data.data.needPay,
            youhuiList: res.data.data.youhui,
            payYes: true,
            orderId: res.data.orderId,
            orderNo: res.data.orderNo,
          })
          if (that.data.shareId) {
            that.setData({
              true_pay: res.data.data.pdneedPay,
              pdYouhui: res.data.data.pdYouhui,
            })
          }
          that.getUserYH(res.data.data.allMoney + res.data.data.allBoxMoney, that.data.shopInfo.shopId, wx.getStorageSync('usersInfo').userId)
        } else {
          that.setData({
            submit: 'pay',
            payYes: false
          })
        }
      }
    })

  },
  //选择发票
  gotoInvoice: util.throttle(function () {
    var userId = wx.getStorageSync('usersInfo').userId
    wx.navigateTo({
      url: '../../../personal/pages/invoice/invoice?userId=' + userId,
    })
  }),

  //继续购买   返回上一页
  shopContinue: util.throttle(function (e) {
    if (this.data.orderType == 3) {
      wx.navigateBack({
        delta: 2
      })
    } else {
      wx.navigateBack({
        delta: 1
      })
    }
  }),
  againContinue: util.throttle(function (e) {
    var shopId = this.data.shopId
    var orderfood = this.data.orderfood
    if (orderfood) {
      if (orderfood.length > 0) {
        var foodAdd = []
        for (var i in orderfood) {
          var obj = {
            goodsId: orderfood[i].goodsId,
            numb: orderfood[i].numb
          }
          foodAdd.push(obj)
        }
        wx.setStorageSync('foodAdd', foodAdd)
      }
    }
    wx.redirectTo({
      url: '../order/order?shopId=' + shopId
    })
  }),
  //删除商品
  closeFood: function(e) {
    var index = e.currentTarget.dataset.index
    var orderfood = this.data.orderfood
    var closeFoodIndex = this.data.closeFoodIndex
    closeFoodIndex.push(orderfood[index].goodsId)
    wx.setStorageSync('closeFoodIndex', closeFoodIndex)
    orderfood.splice(index, 1)
    wx.setStorageSync('orderfood', orderfood)
    this.addOrders()
    this.setData({
      orderfood: orderfood,
      closeFoodIndex: closeFoodIndex,
    })
  },

  onShow: function() {
    // var submit = this.data.submit
    // if (!submit){//已下单则返回上一次
    // 	wx.navigateBack()
    // }
    var that = this
    //隔一分钟刷新一次时间
    that.refreshServiceTime(that.data.options)
    var address = wx.getStorageSync('address')
    if (wx.getStorageSync('billMessage')) {
      var billMessage = JSON.parse(wx.getStorageSync('billMessage'))
    }

    this.setData({
      billShow: true,
      back: false,
      tipss: 0,
      address: address,
      billMessage: billMessage,
    })
  },
  onUnload: function() {
    if (this.data.setTimeoutTimer) {
      clearInterval(this.data.setTimeoutTimer)
    }
    if (this.data.timer) {
      clearInterval(this.data.timer)
    }
    if (this.data.newShareId && this.data.willUnlock) {
      this.unlockOrder(); //解锁拼单
    }
    wx.removeStorageSync('billMessage')
    app.globalData.billId = ''
  },
  //解锁拼单
  unlockOrder: function() {
    var that = this
    var timestamp = (Date.parse(new Date())) / 1000
    var sign = MD5Util.sign(timestamp)
    wx.request({
      url: 'https://www.aftdc.com/wxapp/Desk/unlockOrder',
      method: "POST",
      data: {
        sign: sign,
        timestamp: timestamp,
        token: wx.getStorageSync('usersInfo').token,
        shareId: that.data.newShareId,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        if (res.data.res == 1) {} else {

        }
      }
    })
  },
  pickshow: function() {
    var pick = !this.data.pick
    this.setData({
      pick: pick,
      showTime: true,
    })
  },
  pickCancel() {
    // var pick = !this.data.pick
    this.setData({
      pick: true,
    })
  },
  picks: function(e) {
    var numb = e.currentTarget.dataset.numb
    var pickTxt
    if (numb == 0) {
      // pickTxt = numb + "(不需要餐具)"
      pickTxt = "不需要餐具"
    } else {
      pickTxt = numb + "人 "
    }
    this.setData({
      pick: true,
      pickTxt: pickTxt,
      pickNumb: numb,
    })
  },

  bindtext: function(e) {
    var val = e.detail.value;
    if (val.length >= 50) {
      wx.showToast({
        title: '最大长度为50',
        icon: 'loading',
        duration: 1200,
      })
    }
    this.setData({
      remarkNumb: val.length,
      orderRemarks: val
    })
  },
  //打开和确定备注发票框
  invoiceRemark: util.throttle(function (e) {
    // var remarkBox = !this.data.remarkBox
    // var storage = this.data.storage
    // var billId = app.globalData.billId
    // if (billId) {
    //   this.data.billId = billId
    // } else {
    //   storage.billId = this.data.billId
    // }
    // storage.orderRemarks = this.data.orderRemarks
    // storage.pickNumb = this.data.pickNumb
    // storage.pickTxt = this.data.pickTxt

    // this.setData({
    //   remarkBox: remarkBox,
    //   storage: storage,
    // })
    var orderRemarks = this.data.orderRemarks
    wx.navigateTo({
      url: '../orderRemarks/orderRemarks?orderRemarks=' + orderRemarks
    })
  }),

  // remarkLabelItem: function(e) {
  //   var index = e.currentTarget.dataset.index
  //   var remarkLabel = this.data.remarkLabel
  //   var orderRemarks = this.data.orderRemarks //备注框内容 
  //   var val = orderRemarks + remarkLabel[index]

  //   if (val.length >= 50) {
  //     wx.showToast({
  //       title: '最大长度为50',
  //       icon: 'loading',
  //       duration: 1200,
  //     })
  //     val.length = 50;
  //   }
  //   this.setData({
  //     orderRemarks: val,
  //     remarkNumb: val.length,
  //   })
  // },
  // //返回就不获取数据
  // remarkBack: function() {
  //   var storage = this.data.storage
  //   this.setData({
  //     billId: storage.billId,
  //     orderRemarks: storage.orderRemarks,
  //     pickNumb: storage.pickNumb, //需要用餐的人数
  //     pickTxt: storage.pickTxt,
  //     remarkBox: true,
  //   })
  // },
  //点击配送方式
  takeout: function(e) { //点击外卖配送
    var storeType = e.currentTarget.dataset.storetype
    if (storeType == 1) { //点击外卖配送
      this.setData({
        storeType: 1,
        orderType: 0
      })
    } else { //到店自取
      this.setData({
        storeType: 2,
        orderType: 5
      })
    }
    this.addOrders()
  },
  protocolRadio: function() {
    var protocolRadio = !this.data.protocolRadio
    this.setData({
      protocolRadio: protocolRadio
    })
  },
  ddzq: function() {
    wx.navigateTo({
      url: '../ddzqProtocol/ddzqProtocol',
    })
  },
  //获取手机号
  getPhoneNumber: function(e) {
    authorization.getPhone(e)
    var userPhone = wx.getStorageSync('usersInfo').userPhone
    if (userPhone) {
      this.setData({
        userPhone: userPhone
      })
    } else {
      return this.setPhone()
    }
  },
  setPhone: function() {
    var userPhone = wx.getStorageSync('usersInfo').userPhone
    if (userPhone) {
      this.setData({
        userPhone: userPhone
      })
    } else {
      var that = this
      setTimeout(function() {
        return that.setPhone()
      }, 200)
    }
  }


})