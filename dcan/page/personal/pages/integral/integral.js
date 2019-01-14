var MD5Util = require('../../../../utils/md5.js');
var app=getApp();
Page({
  data:{
    hidden:true
  },
  onLoad: function (options) {     
    var userId = wx.getStorageSync('usersInfo').userId
    console.log(userId)
    var that = this
    var timestamp = (Date.parse(new Date())) / 1000
    var sign = MD5Util.sign(timestamp)
    wx.request({
      url: 'https://www.aftdc.com/wxapp/Asset/integral',
      method: "POST",
      data: {
        type:1,
        userId: userId,
        sign: sign,
        timestamp: timestamp,
        token: wx.getStorageSync('usersInfo').token,
      },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        console.log(res)
        if (res.data!= null) {
          that.setData({
            info: res.data
          })
        } else {
          that.setData({
            hidden: false
          })
        }
      }
    })
  }
})
