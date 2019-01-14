var MD5Util = require('../../../../utils/md5.js');
var app = getApp()
Page({
  data: {
    shop:'',
    hidden:false
  },
  onReady: function () {
		var userId = wx.getStorageSync('usersInfo').userId
		var location = app.globalData.location
		this.data.userId = userId
		var that=this
    var timestamp = (Date.parse(new Date())) / 1000
    var sign = MD5Util.sign(timestamp)
		wx.request({
      url: 'https://www.aftdc.com/wxapp/Mine/notice',
			data:{
        sign: sign,
        timestamp: timestamp,
        token: wx.getStorageSync('usersInfo').token,
				latitude: location.latitude,
				longitude: location.longitude,
			},
			method: 'POST',
			header: { "Content-Type": "application/x-www-form-urlencoded" },
			success: function (res) {
        console.log(res)
				if (res.data.res==1) {
          var shops = res.data.shop
					that.setData({
            shop: shops
					})
				} else {
					that.setData({
						hidden: true
					})
				}
			}
		})
  },

	//取消关注
	cancelAttention: function (e) {
		var that = this
		var shopId = e.currentTarget.dataset.shopid
		var index = e.currentTarget.dataset.index
		var userId = wx.getStorageSync('usersInfo').userId
		var shop = this.data.shop
    var timestamp = (Date.parse(new Date())) / 1000
    var sign = MD5Util.sign(timestamp)
		wx.showLoading({
			mask: true
		})
		wx.request({
      url: 'https://www.aftdc.com/wxapp/Mine/off_notice',
			data: {
				shopId: shopId,
        sign: sign,
        timestamp: timestamp,
        token: wx.getStorageSync('usersInfo').token,
			},
			method: "POST",
			header: { "Content-Type": "application/x-www-form-urlencoded" },
			success: function (res) {
				if (res.data.res == 1) {
					wx.hideLoading()
					shop.splice(index, 1)
					that.setData({
						hobbyTip: true,
            hobbyTips:'已取消关注',
						shop: shop
					})
					setTimeout(function () {
						that.setData({
							hobbyTip: false
						})
					}, 1200)
				}
			}
		})
	},
	goToShop:function(e){
		var shopId = e.currentTarget.dataset.shopid
		wx.navigateTo({
      url: '../../../homePage/pages/order/order?shopId=' + shopId,
		})
	},
	message:function(e){
		var shopId = e.currentTarget.dataset.shopid
		wx.navigateTo({
			url: '../leaveword/leaveword?shopId=' + shopId,
		})
	}
})