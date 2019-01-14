var MD5Util = require('../../../../utils/md5.js');
Page({

  data: {
  flow:0,//进度流程
  },

  onLoad: function (options) {
    var id=options.id
    var flow = options.status
    var that=this
    var timestamp = (Date.parse(new Date())) / 1000
    var sign = MD5Util.sign(timestamp)
    wx.request({
      url: 'https://www.aftdc.com/wxapp/Order/refundGroupon',
      data:
      {
        id:id,
        sign: sign,
        timestamp: timestamp,
        token: wx.getStorageSync('usersInfo').token,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success:function(res)
      {
        if (res.data.payType==1)
        {
          var payType ="账户余额"
        }
        if (res.data.payType == 2) {
          var payType = "微信账户"
        }
        if (res.data.payType == 3) {
          var payType = "账户余额+微信账户"
        }
        that.setData({
          payType: payType,
          res:res.data,
          flow: flow
        })
      }
    })
  },

})