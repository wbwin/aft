var app = getApp()
var MD5Util = require('../../../../utils/md5.js');
Page({
  data: {
		shop:true
  },

  onLoad: function (options) {
		this.data.shopId = options.shopId
  },

  onReady: function () {
		var location = app.globalData.location
		var longitude = location.longitude
		var latitude = location.latitude
		var shopId = this.data.shopId

		var shopId = 508
		var that=this
    var timestamp = (Date.parse(new Date())) / 1000
    var sign = MD5Util.sign(timestamp)
		wx.request({
			url: 'https://www.aftdc.com/index.php/wxapp/shops/getShopVoucher',
			header: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			data: {
        sign: sign,
        timestamp: timestamp,
        token: wx.getStorageSync('usersInfo').token,
				shopId: shopId,
				longitude: longitude,
				latitude: latitude
			},
			method: "POST",
			success: function (res) {
				console.log(res)
				if(res.data.res){
					var shopInfo = res.data.arr
					for (var i in shopInfo['voucher']){
						shopInfo['voucher'][i]['discount'] = (shopInfo['voucher'][i]['marketPrice'] / shopInfo['voucher'][i]['shopPrice'] * 10).toFixed(2)
					}
					that.setData({
						shopInfo: shopInfo
					})
				}else{
					that.setData({
						shopInfo:false
					})
				}
			}
		})
  },
	buy:function(e){
		var userPhone = wx.getStorageSync('usersInfo').userPhone
		if (!userPhone){
			var userPhone=0;
		}
		var index = e.currentTarget.dataset.index
		var voucherInfo = this.data.shop[index].vouchers
		wx.setStorageSync('voucherInfo', voucherInfo)
		wx.navigateTo({
			url: '../buyVoucher/buyVoucher'
		})
	}
})