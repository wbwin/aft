var app = getApp()
var MD5Util = require('../../../../utils/md5.js');
Page({
  data: {
  
  },
  onLoad: function (options) {
		this.data.shopId=options.shopId
		this.setData({
			userPhoto: wx.getStorageSync('usersInfo').userPhoto
		})
  },
  onReady: function () {
		var shopId = this.data.shopId
		var userId = wx.getStorageSync('usersInfo').userId
		this.data.userId = userId
		var that = this
    var timestamp = (Date.parse(new Date())) / 1000
    var sign = MD5Util.sign(timestamp)
		wx.request({
      url: 'https://www.aftdc.com/wxapp/Mine/message_list',
			data: {
        sign: sign,
        timestamp: timestamp,
        token: wx.getStorageSync('usersInfo').token,
				userId: userId,
				shopId: shopId,
				isUser:1
			},
			method: 'POST',
			header: { "Content-Type": "application/x-www-form-urlencoded" },
			success: function (res) {
				if (res.data.res == 1) {
					that.setData({
						leaveword: res.data.arr,
						top: res.data.top,
						isBlack: res.data.isBlack
					})
				} else {
					that.setData({
						leaveword: false
					})
				}
			}
		})
  },
	leave:function(){
		if (this.data.isBlack) {
			wx.showModal({
				title: '提示',
				content: '你已被商家拉黑',
				showCancel:false
			})
			return false
		}
		this.setData({
			wordborder:true
		})
	},
	text:function(e){
		this.data.leavewords = e.detail.value
	},
	cancel:function(){
		this.setData({
			wordborder: false
		})
	},
	sure: function () {
		
		var shopId = this.data.shopId
		var userId = this.data.userId 
		var leaveword = this.data.leavewords 
		if (!leaveword){
			wx.showModal({
				title: '提示',
				content: '请填写内容',
				showCancel: false
			})
			return false
		}
    wx.showLoading({
      mask: true
    })
		var that = this
    var timestamp = (Date.parse(new Date())) / 1000
    var sign = MD5Util.sign(timestamp)
		wx.request({
      url: 'https://www.aftdc.com/wxapp/Mine/notice_message',
			data: {
        sign: sign,
        timestamp: timestamp,
        token: wx.getStorageSync('usersInfo').token,
				userId: userId,
				shopId: shopId,
				leaveword: leaveword
			},
			method: 'POST',
			header: { "Content-Type": "application/x-www-form-urlencoded" },
			success: function (res) {
        console.log(res)
				wx.hideLoading()
				if (res.data.res == 1) {
					that.onReady()
					that.setData({
						wordborder: false
					})
				} else {
					wx.showModal({
						title: '提示',
            content: res.data.info,
					})
				}
			}
		})
	},
})