var app = getApp();
var MD5Util = require('../../../../utils/md5.js');
Page({

  data: {
    hidden: true,
    recharges:null,
    money:null,
    focus:false,
  },

  onLoad: function (options) {
    var userId = wx.getStorageSync('usersInfo').userId
    var that=this
    var timestamp = (Date.parse(new Date())) / 1000
    var sign = MD5Util.sign(timestamp)
    wx.request({
      url: 'https://www.aftdc.com/wxapp/Asset/membership',
      method: "POST",
      data: {   
        sign: sign,
        timestamp: timestamp,
        token: wx.getStorageSync('usersInfo').token,
        userId: userId       
      },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success:function(res)
      {
        console.log(res)
        if(res.data!=null){
          that.setData({
            info: res.data
          })
        }else{
          that.setData({
            hidden: false
          })
        }
      }
    })
  }
})