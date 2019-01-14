var app = getApp();
var MD5Util = require('../../../../utils/md5.js');
Page({

  data: {
   
   
  },

  onLoad: function (options) {
     var id=options.id 
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
       header: {
         "Content-Type": "application/x-www-form-urlencoded"
       },
       success:function(res)
       {
         that.setData({
           arr:res.data
         })
       }
     })
  },
 
  seeBut:function(){
  
    wx.redirectTo({
      url: '../deskOrder/deskOrder',
    })
  },

})