var app = getApp();
var MD5Util = require('../../../../utils/md5.js');
Page({

	data: {
		hidden: true
	},

	onLoad: function () {
		var that = this
		var userId = wx.getStorageSync('usersInfo').userId
		var location = app.globalData.location
    var timestamp = (Date.parse(new Date())) / 1000
    var sign = MD5Util.sign(timestamp)
		wx.request({
      url: 'https://www.aftdc.com/wxapp/Shop/getShield',
			data:	{
        sign: sign,
        timestamp: timestamp,
        token: wx.getStorageSync('usersInfo').token,
				userId: userId,
				longitude: location.longitude,
				latitude: location.latitude,
			},
			method: 'POST',
			header: { "Content-Type": "application/x-www-form-urlencoded" },
			success: function (res) {
				if (res.data.res==1) {
					that.setData({
						shop: res.data.arr
					})
					console.log(shop)
				} else {
					that.setData({
						shop: false
					})
				}
			}
		})
	},
	goToShop:function(e){
		var shopId = e.currentTarget.dataset.shopid
		var distance = e.currentTarget.dataset.distance
		wx.navigateTo({
      url: '../../../homePage/pages/order/order?shopId=' + shopId + '&distance=' + distance,
		})
	},
	replay:function(e){
		var userId = wx.getStorageSync('usersInfo').userId
		var shopId = e.currentTarget.dataset.shopid
		var that=this
    var timestamp = (Date.parse(new Date())) / 1000
    var sign = MD5Util.sign(timestamp)
		wx.showLoading({
			mask:true
		})
		wx.request({
      url: 'https://www.aftdc.com/wxapp/Shop/replayShop',
			data: {
				userId: userId,
				shopId: shopId,
        sign: sign,
        timestamp:timestamp,
        token: wx.getStorageSync('usersInfo').token,
			},
			method: 'POST',
			header: { "Content-Type": "application/x-www-form-urlencoded" },
			success: function (res) {
				if (res.data.res == 1) {
					wx.hideLoading()
					that.onLoad()
				} else {
					that.setData({
						hidden: false
					})
				}
			}
		})
	}
})