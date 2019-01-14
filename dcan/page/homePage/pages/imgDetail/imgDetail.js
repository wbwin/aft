var app = getApp();
var MD5Util = require('../../../../utils/md5.js');
Page({

  data: {
    choiceNav:0,
  },

  onLoad: function (options) {
    var shopId=options.shopId
    this.setData({
      shopId:shopId
    })
    var that=this
    var timestamp = (Date.parse(new Date())) / 1000
    var sign = MD5Util.sign(timestamp)
    wx.request({
      url: 'https://www.aftdc.com/wxapp/Grouporder/getShopImg',
      data:
      {
        sign: sign,
        timestamp: timestamp,
        token: wx.getStorageSync('usersInfo').token,
        shopId:shopId
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success:function(res)
      {
        that.setData({
          arr: res.data.meImg,
          allArr:res.data
        })
      }
    })
  },
 
 navBind:function(e){
   var index = e.target.dataset.id
   var arr = this.data.allArr
   this.setData({
     choiceNav:index,
   })
   switch(index)
   {
     case '1':
       this.setData({
         arr: arr.lImg
       })
       break;
     case '0':
       this.setData({
         arr: arr.meImg
       })
       break;
     case '2':
       this.setData({
         arr: arr.lImg.concat(arr.meImg)
       })
       break;
   }
 },

})