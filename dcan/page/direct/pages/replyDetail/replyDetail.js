var app = getApp()
var MD5Util = require('../../../../utils/md5.js');

Page({

	data: {
		write: true,
		page: 0
	},

	onLoad: function (options) {
		var userId = wx.getStorageSync('usersInfo').userId
		if (!userId) {
			userId = ''
		}
		var that = this
		this.setData({
			appraises_id: options.appraises_id,//评论的id
			article_id: options.article_id,
			title: options.title,
		})
		var timestamp = (Date.parse(new Date())) / 1000
		var sign = MD5Util.sign(timestamp)
		wx.request({
			url: 'https://www.aftdc.com/wxapp/Article/arcticle_reply_seek',
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			data: {
				// sign: sign,
				// timestamp: timestamp,
				// token: wx.getStorageSync('usersInfo').token,
				appraises_id: that.data.appraises_id,
				article_id: that.data.article_id,
				userId: userId,
			},
			method: "POST",
			success: function (res) {
				that.setData({
					reply: res.data.reply,
					appraises: res.data.appraises,
					page: that.data.page
				})
			}
		})
	},

	onReady: function () {

	},

	onReachBottom: function () {
		var userId = wx.getStorageSync('usersInfo').userId
		if (!userId) {
			userId = ''
		}
		var that = this
		var timestamp = (Date.parse(new Date())) / 1000
		var sign = MD5Util.sign(timestamp)
		wx.request({
			url: 'https://www.aftdc.com/wxapp/Article/arcticle_reply_seek',
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			data: {
				sign: sign,
				timestamp: timestamp,
				token: wx.getStorageSync('usersInfo').token,
				appraises_id: that.data.appraises_id,
				article_id: that.data.article_id,
				userId: userId
			},
			method: "POST",
			success: function (res) {
				that.setData({
					reply: res.data, reply,
					appraises: res.data.appraises,
					page: that.data.page + 5
				})
			}
		})
	},

	onShareAppMessage: function () {
		return {
			title: this.data.title,
      path: '/page/direct/pages/article/article?article_id=' + this.data.article_id,
			success: function (res) {
				// 转发成功
			},
			fail: function (res) {
				// 转发失败
			}
		}
	},
	getcontent: function (e) {
		this.setData({ content: e.detail.value })
	},
	write: function () {
		this.setData({
			write: false
		})
	},

	closeWrite: function () {
		this.setData({
			write: true
		})
	},
	send: function () {
		var that = this
		var timestamp = (Date.parse(new Date())) / 1000
		var sign = MD5Util.sign(timestamp)
		wx.request({
			url: 'https://www.aftdc.com/wxapp/Article/arcticle_reply',
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			data: {
				sign: sign,
				timestamp: timestamp,
				token: wx.getStorageSync('usersInfo').token,
				appraises_id: that.data.appraises_id,
				content: that.data.content,
				article_id: that.data.article_id,
				userId:wx.getStorageSync('usersInfo').userId
			},
			method: "POST",
			success: function (res) {
				var option = { 'appraises_id': that.data.appraises_id, 'article_id': that.data.article_id }
				that.onLoad(option)
				that.closeWrite()
				wx.showModal({
					title: '提示',
					content: '留言成功',
					showCancel: false,
				})
			}
		})
	},
	//点赞
	Praise: function (e) {
		var index = e.currentTarget.dataset.index
		var type = e.currentTarget.dataset.type
		var that = this
		var usersInfo = wx.getStorageSync('usersInfo')
		if (!usersInfo || !usersInfo.userPhone) {//如果没登录
			wx.navigateTo({
        url: '../../../homePage/pages/author/author',
			})
			return false
		} else {
			if (type == 1) {//点赞文章
				that.praisePl()
			} else {
				that.praiseZjpl(index)
			}
		}
	},
	//点赞评论
	praisePl: function () {
		var appraises = this.data.appraises
		console.log(appraises)
		var that = this
		var timestamp = (Date.parse(new Date())) / 1000
		var sign = MD5Util.sign(timestamp)
		wx.request({
			url: 'https://www.aftdc.com/wxapp/Article/arcticle_praise',
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			data: {
				sign: sign,
				timestamp: timestamp,
				token: wx.getStorageSync('usersInfo').token,
				id: appraises[0].id,    //文章的id
				userId:wx.getStorageSync('usersInfo').userId
			},
			method: "POST",
			success: function (res) {
				if (!res.data.res) {
					wx.showToast({
						title: '已点赞',
						mask: true
					})
					return false;
				}
			}
		})
		if (appraises[0].is_praise == 1) {
			wx.showToast({
				title: '已点赞',
				mask: true
			})
		} else {
			appraises[0].is_praise = 1
			appraises[0].praise_num += 1
			this.setData({
				appraises: appraises
			})
			var that = this
			that.setData({
				dzan: true,
			})
			zanTime = setTimeout(function () {
				that.setData({
					dzan: false,
				})
				clearTimeout(zanTime);
			}, 900)
		}
	},
	//点赞追加评论
	praiseZjpl: function (index) {
		var reply = this.data.reply
		var that = this
		var timestamp = (Date.parse(new Date())) / 1000
		var sign = MD5Util.sign(timestamp)
		wx.request({
			url: 'https://www.aftdc.com/wxapp/Article/arcticle_reply_praise',
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			data: {
				sign: sign,
				timestamp: timestamp,
				token: wx.getStorageSync('usersInfo').token,
				id: reply[index].id,    //文章的id
				userId:wx.getStorageSync('usersInfo').userId
			},
			method: "POST",
			success: function (res) {
				if (!res.data.res) {
					wx.showToast({
						title: '已点赞',
						mask: true
					})
					return false;
				}
			}
		})
		if (reply[index].is_praise == 1) {
			wx.showToast({
				title: '已点赞',
				mask: true
			})
		} else {
			reply[index].is_praise = 1
			reply[index].praise_num += 1
			this.setData({
				reply: reply
			})
			var that = this
			that.setData({
				dzan: true,
			})
			zanTime = setTimeout(function () {
				that.setData({
					dzan: false,
				})
				clearTimeout(zanTime);
			}, 900)
		}
	},
})