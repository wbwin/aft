var app = getApp();
var MD5Util = require('../../../../utils/md5.js')
Page({

  data: {
    
  },

  onLoad: function (options) {
    var that=this
    var userId = wx.getStorageSync('usersInfo').userId
    var timestamp = (Date.parse(new Date())) / 1000
    var sign = MD5Util.sign(timestamp)
    wx.request({
      url: 'https://www.aftdc.com/wxapp/Asset/getUser',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        sign: sign,
        timestamp: timestamp,
        token: wx.getStorageSync('usersInfo').token,
      },
      method: "POST",
      success: function (res) {
        that.setData({
          userInfo: res.data,
          gap: res.data.nextVal - res.data.val
        })
      }
    })
  },
})