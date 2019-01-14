var MD5Util = require('../../../../utils/md5.js')
var app = getApp();

Page({
  data: {
    noData: false
  },
  onLoad() {
    var timestamp = (Date.parse(new Date())) / 1000
    var sign = MD5Util.sign(timestamp)
    var that = this
    wx.request({
      url: 'https://www.aftdc.com/wxapp/Asset/coupon',
      data: {
        sign: sign,
        timestamp: timestamp,
        token: wx.getStorageSync('usersInfo').token
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: function (res) {
        console.log(res)
       
        if (res.data.res == 1){
          if (res.data.waitUse.length==0){
            that.setData({ noData: true })
          }
          that.setData({ coupon: res.data.waitUse })
        }
        else {
          that.setData({ noData: true })
        }
      }
    })
  },
  //去店铺
  toShop: function (e) {
    var shopId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../../../homePage/pages/introduce/introduce?shopId=' + shopId,
    })
  },
  	//领券中心
	coupon: function () {
		wx.navigateTo({
			url: '../coupon/coupon',
		})
	},
})