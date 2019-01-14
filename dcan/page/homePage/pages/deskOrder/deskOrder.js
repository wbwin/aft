// pages/order/desk/deskOrder/deskOrder.js
var MD5Util = require('../../../../utils/md5.js');
var app=getApp()
Page({


  data: {
    isOrder:false
  },

  onLoad: function (options) {
    var userId = wx.getStorageSync('usersInfo').userId
    this.setData({
      userId: userId
    })
    var that = this
    var timestamp = (Date.parse(new Date())) / 1000
    var sign = MD5Util.sign(timestamp)
    wx.request({
      url: 'https://www.aftdc.com/wxapp/Desk/getUserDesk',
      data: {
        userId: userId,
        sign: sign,
        timestamp: timestamp,
        token: wx.getStorageSync('usersInfo').token
      },
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        if(res.data.length>0){
          that.setData({
            arr: res.data
          })
          for (var i in res.data){
            if (res.data[i].state || res.data[i].state==0){
              that.setData({
                isOrder: false
              })
              return false
            }else{
              that.setData({
                isOrder: true
              })
            }
          }
        }
        
        else
        {
          that.setData({
            isOrder:true
          })
        }
      }
    })
  },



})