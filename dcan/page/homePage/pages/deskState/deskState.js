var app=getApp()
var MD5Util = require('../../../../utils/md5.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cancelReason: ["不想订了", "行程有变/取消", "信息填写错误", "反馈太慢，不想等了", "通过其他方式预定", "其他"],
    cancelTxt: '',
    cancelShow: false,
  },

  onLoad: function (options) {
    var id =options.id
    this.setData({
      id:id
    })
    var that=this
    var timestamp = (Date.parse(new Date())) / 1000
    var sign = MD5Util.sign(timestamp)
    wx.request({
      url: 'https://www.aftdc.com/wxapp/Desk/deskInfo',
      data:
      {
        sign: sign,
        timestamp: timestamp,
        token: wx.getStorageSync('usersInfo').token,
        id:id
      },
      method:'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success:function(res)
      {
        that.setData({
          arr:res.data
        })
      }
    })
  },
  radiochange: function (e) {
    this.setData({
      cancelTxt: e.detail.value
    })
  },
  getCancel: function () {
    var cancelShow = !this.data.cancelShow;
    this.setData({
      cancelShow: cancelShow,
    })
  },
  //确认取消订单
  sureCancel: function () {
    var cancelTxt = this.data.cancelTxt;
    var id=this.data.id
    var that=this
    var timestamp = (Date.parse(new Date())) / 1000
    var sign = MD5Util.sign(timestamp)
    wx.request({
      url: 'https://www.aftdc.com/wxapp/Desk/cancalDesk',
      data:
      {
        sign: sign,
        timestamp: timestamp,
        token: wx.getStorageSync('usersInfo').token,
        cancelTxt: cancelTxt,
        id: id
      },
      method:'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success:function(res)
      {
        if(res.data.res==1)
        {
          var arr =that.data.arr
          arr.state=3
          that.setData({
            cancelShow: false,
            arr: arr
          })
        }
      }
    })
   
  },
  gotoShop:function()
  {
    var shopId=this.data.arr.shopId
    wx.redirectTo({
      url: '../order/order?shopId=' + shopId,
    })
  }

})