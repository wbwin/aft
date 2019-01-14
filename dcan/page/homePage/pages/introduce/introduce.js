var app = getApp()
var MD5Util = require('../../../../utils/md5.js');
Page({

  data: {
    otherPeople :'',
    noDesk: 0,
    imgBox: false,
    classifyId: 3,
    nops: '',
    tsyd: 0,
    wm: 0,
    djq: 0,
    tg: 0,
    ddzq: 0,
    toView: ''
  },
  getTagPl: function(e) {
    var shopId = this.data.shopId
    wx.navigateTo({
      url: '../allpj/allpj?shopId=' + shopId,
    })
  },

  onLoad: function(options) {

    var shopId = options.shopId
    var distance = options.distance
    var nearbyShop = options.nearbyShop
    var location = app.globalData.location


    if (nearbyShop != undefined) {
      nearbyShop = nearbyShop.split(","); // 
    } else {
      nearbyShop = ''
    }
    this.setData({
      shopId: shopId,
      distance: distance,
      nearbyShop: nearbyShop
    })
    var that = this
    wx.request({
      url: 'https://www.aftdc.com/wxapp/Grouporder/getShopInfo',
      // data: {
      //   shopId: 1020449,
      //   chooseId: 1,
      //   nearbyShop: "",
      //   lat: 23.23456,
      //   lng: 113.21361
      // },


      
      data: {
        shopId: shopId,
        chooseId: 1,
        nearbyShop: JSON.stringify(nearbyShop),
        lat: location.latitude,
        lng: location.longitude
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: function(res) {
        wx.setNavigationBarTitle({
          title: res.data.shop.shopName
        })


        //距离单位换算
        if (parseFloat(res.data.distance) > 0 && parseFloat(res.data.distance) < 1000) {
          var value = res.data.distance + 'm'
        } else if (parseFloat(res.data.distance) == 0) {
          var value = '1m'
        } else {
          var value = parseFloat(res.data.distance / 1000).toFixed(1) + 'km'
        }
        res.data.distance = value


        //缓存店铺信息
         wx.setStorageSync('shopInfo', res.data.shop)

        that.setData({
          arr: res.data,
          tsyd: res.data.shop.tsyd,
          wm: res.data.shop.wm,
          djq: res.data.shop.djq,
          tg: res.data.shop.tg,
          ddzq: res.data.shop.ddzq,
        })


        if (res.data.shop.range < that.data.distance) {
          that.setData({
            nops: '不在配送范围'
          })
        }
      }
    })

    

    


    //获取拼单数据
    var shopId = this.data.shopId
    var timestamp = (Date.parse(new Date())) // 1000
    var sign = MD5Util.sign(timestamp)
    wx.request({
      url: 'https://www.aftdc.com/wxapp/Shop/getShare',
      data: {
        sign: sign,
        timestamp: timestamp,
        token: wx.getStorageSync('usersInfo').token,
        shopId: shopId
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'post',
      success: function (res) {
        if (res.data.res == 1) {
          that.setData({       
            otherPeople: res.data.shopShareOrder,
            userId:wx.getStorageSync('usersInfo').userId
          })
          if (res.data.shopShareOrder) {
            var timer = setInterval(that.countDown, 1000);
          }
        }
      }
    })
  },

  //滚动到某个区域
  toPosition:function(e){
    var type = e.currentTarget.dataset.id
    this.setData({
      toView: type
    })
  },

  //拼单倒计时
  countDown: function () {
    var otherPeople = this.data.otherPeople
    for (var i = 0; i < otherPeople.length; i++) {
      var intDiff = otherPeople[i].time * 1000;//获取数据中的时间戳
      var day = 0, hour = 0, minute = 0, second = 0;
      if (intDiff > 0) {//转换时间
        var time = new Date(intDiff);
        hour = time.getHours();
        minute = time.getMinutes();
        second = time.getSeconds();
        if (hour <= 9) hour = '0' + hour;
        if (minute <= 9) minute = '0' + minute;
        if (second <= 9) second = '0' + second;
        otherPeople[i].time--;
        var str = hour + ':' + minute + ':' + second
      } else {
        var str = "已结束！";
      }
      otherPeople[i].difftime = str;//在数据中添加difftime参数名，把时间放进去
    }
    this.setData({
      otherPeople: otherPeople
    })
  },
  
  // 跳转到拼单界面
  shareOrder: function () {
    var that = this
    var usersInfo = wx.getStorageSync('usersInfo')
    if (!usersInfo || !usersInfo.userPhone) {//如果没登录
      wx.navigateTo({
        url: '../author/author?route=shareOrder',
      })
      return false
    } 
    else {

      var shopId = that.data.shopId
      var dsm = that.data.arr.deliveryStartMoney
      var dfm = that.data.arr.deliveryFreeMoney
      var shopName = that.data.arr.shop.shopName
      // var orderType = that.data.orderType
      wx.navigateTo({
        url: '../shareOrder/shareOrder?shopId=' + shopId + '&dsm=' + dsm + '&dfm=' + dfm + '&shopName=' + shopName
        // + '&orderType=' + orderType,
      })
    }
  },
  //切换评价
  choiceYes: function(e) {
    var index = e.target.dataset.id
    var classifyId = index
    var that = this
    var timestamp = (Date.parse(new Date())) / 1000
    var sign = MD5Util.sign(timestamp)

    wx.request({
      url: 'https://www.aftdc.com/wxapp/Grouporder/getPingLun',
      data: {
        sign: sign,
        timestamp: timestamp,
        token: wx.getStorageSync('usersInfo').token,
        classifyId: classifyId,
        shopId: that.data.shopId
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        var pinglun = res.data
        var arr = that.data.arr
        arr.pinglun = pinglun
        that.setData({
          classifyId: classifyId,
          arr: arr
        })
      }
    })
  },
  goshop: function() {
    var nops = this.data.nops
    var shopId = this.data.shopId
    var distance = this.data.distance
    if (nops != '不在配送范围') {
      wx.setStorageSync('orderType', '0')
      wx.navigateTo({
        url: '../order/order?shopId=' + shopId + '&distance=' + distance,
      })
    }
  },
  godesk: function() {
    wx.setStorageSync('orderType', '3')
    var shopId = this.data.shopId
    wx.navigateTo({
      url: '../order/order?shopId=' + shopId,
    })
    // var shopName=this.data.arr.shop.shopName
    // wx.navigateTo({
    //   url: '../order/desk/desk?shopId=' + shopId + '&shopName=' + shopName,
    // })
  },
  gotake: function () {
    wx.setStorageSync('orderType', '5')
    var shopId = this.data.shopId
    wx.navigateTo({
      url: '../order/order?shopId=' + shopId,
    })
  },
  //商家店铺图片
  imgsShow: function() {
    var shopId = this.data.shopId
    wx.navigateTo({
      url: '../imgDetail/imgDetail?shopId=' + shopId,
    })
  },
  //拨打商家电话
  markPhone: function(e) {
    var phone = e.currentTarget.dataset.phone
    wx.makePhoneCall({
      phoneNumber: phone //仅为示例，并非真实的电话号码 })
    })
  },
  //查看地址
  address: function(e) {
    var jd = Number(e.currentTarget.dataset.jd)
    var wd = Number(e.currentTarget.dataset.wd)
    wx.openLocation({
      latitude: wd,
      longitude: jd,
      fail: function(err) {}
    })
  },
  //点击放大图片
  enlargeImg: function(e) {
    var src = e.currentTarget.dataset.src;
    var index = e.currentTarget.dataset.index;
    this.setData({
      enlargeSrc: src,
      enlargeBox: true,
      enlargeNumb: index,
    })
  },
  enlargeClose: function(e) {
    this.setData({
      enlargeBox: false,
    })
  },
  goto: function(e) {
    var shopId = e.currentTarget.dataset.shopid
    var groupId = e.currentTarget.dataset.groupid
    wx.navigateTo({
      url: '../foodDetail/foodDetail?shopId=' + shopId + '&groupId=' + groupId,
    })
  },
  shopdetail: function() {
    wx.navigateTo({
      url: '../shopdetail/shopdetail?shopId=' + this.data.shopId,
    })
  },
  index: function() {
    wx.switchTab({
      url: '/page/tabBar/homePage/index',
    })
  },
})