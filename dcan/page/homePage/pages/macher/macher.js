var app=getApp();
var MD5Util = require('../../../../utils/md5.js');
Page({
      
  data: {
    //认证时间
   certification_time:"",
   //法定代表人
   unitPeople: "",
   //工商执照注册号
   unitNumb:"",
   //认证 企业名称
   unitName:"",
   unitFixed:"",
   createTime:"",
   shopId:0
  },

  onLoad: function (options) {
    var shopId = options.shopId
    var that = this
     this.setData({shopId:shopId})
     var timestamp = (Date.parse(new Date())) / 1000
     var sign = MD5Util.sign(timestamp)
     wx.request({
       url: 'https://www.aftdc.com/wxapp/Shop/certification',
       header: {"Content-Type": "application/x-www-form-urlencoded"},
       data: { 
         sign: sign,
         timestamp: timestamp,
         token: wx.getStorageSync('usersInfo').token,
         shopId: shopId,
         },
       method:'POST',
       success:function(res){
         that.setData({ unitPeople: res.data.unitPeople})
         that.setData({ unitNumb: res.data.unitNumb })
         that.setData({ unitName: res.data.unitName })
         that.setData({ unitFixed: res.data.unitFixed })
         that.setData({ createTime: res.data.createTime })
         that.setData({ certification_time: res.data.certification_time })
       }
     })
  },
})