var app = getApp()
var MD5Util = require('../../../../utils/md5.js');
Page({

	data: {
		write: true,
		add: false,
		content: '',
		q: []
	},

	onLoad: function (options) {
		this.data.id = options.article_id
		var that = this
		var timestamp = (Date.parse(new Date())) / 1000
		var sign = MD5Util.sign(timestamp)
		wx.request({
			url: 'https://www.aftdc.com/wxapp/Article/user_appraises',
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			data: {
				sign: sign,
				timestamp: timestamp,
				token: wx.getStorageSync('usersInfo').token,
				id: that.data.id,    //文章的id
				userId:wx.getStorageSync('usersInfo').userId,
			},
			method: "POST",
			success: function (res) {
				that.setData({ appraises: res.data.data })
			}	
		})
	},
	
	getTest: function (e) {
		this.setData({
			content: e.detail.value
		})
	},
	del: function (e) {
		var that = this
		var timestamp = (Date.parse(new Date())) / 1000
		var sign = MD5Util.sign(timestamp)
		var index = e.currentTarget.dataset.index
		wx.request({
			url: 'https://www.aftdc.com/wxapp/Article/del_appraises',
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			data: {
				sign: sign,
				timestamp: timestamp,
				token: wx.getStorageSync('usersInfo').token,
				id: e.currentTarget.dataset.appraises_id,    //评论的id
			},
			method: "POST",
			success: function (res) {
				that.data.appraises.splice(index, 1);
				that.setData({ appraises: that.data.appraises })
			}
		})
	},

	//留言
	send: function (e) {
		if (!this.data.content) {
			wx.showModal({
				title: '提示',
				content: '请输入内容',
				showCancel: false
			})
			return false
		}
		var that = this
		var timestamp = (Date.parse(new Date())) / 1000
		var sign = MD5Util.sign(timestamp)
		wx.request({
			url: 'https://www.aftdc.com/wxapp/Article/arcticle_appraises_deliver',
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			data: {
				sign: sign,
				timestamp: timestamp,
				token: wx.getStorageSync('usersInfo').token,
				id: that.data.id,    //文章的id
				userId:wx.getStorageSync('usersInfo').userId,
				content: that.data.content,
			},
			method: "POST",
			success: function (res) {
				that.data.appraises.unshift(res.data.data)
				that.setData({
					appraises: that.data.appraises,
					content:''
				})
			}
		})
	},
	add: function () {
		var add = !this.data.add
		this.setData({
			add: add
		})
	},
	chooseImg: function () {
		var that = this;
		wx.chooseImage({
			count: 3,
			sizeType: ['compressed'],
			sourceType: ['album', 'camera'],
			success: function (res) {
				var imgPaths = res.tempFilePaths
				var index1 = imgPaths[0].lastIndexOf(".");
				var index2 = imgPaths[0].length;
				var q = new Array()
				q[0] = (imgPaths[0].substring(index1, index2));//后缀名 
				that.setData({ imgPaths: imgPaths, q: q })

				var imgPaths = that.data.imgPaths
				if (imgPaths) {
					var timestamp = (Date.parse(new Date())) / 1000
					var sign = MD5Util.sign(timestamp)
					wx.request({
						url: 'https://www.aftdc.com/wxapp/Article/appraisesImgToken',
						data: {
							sign: sign,
							timestamp: timestamp,
							token: wx.getStorageSync('usersInfo').token,
							q: JSON.stringify(that.data.q)
						},
						header: {
							'content-type': 'application/x-www-form-urlencoded'
						},
						method: "POST",
						success: function (res) {
							var name = res.data.oss.name[0]
							wx.uploadFile({
								url: res.data.oss.host,
								filePath: imgPaths[0],
								name: 'file',
								formData: {
									"key": res.data.oss.name[0],//图片的路径
									"policy": res.data.oss.policy,
									"OSSAccessKeyId": res.data.oss.accessid,
									'success_action_status': '200',
									'signature': res.data.oss.signature
								},
								header: { "Content-Type": "multipart/form-data" },
								success: function (res) {
									if (res.statusCode == 200) {
										var timestamp = (Date.parse(new Date())) / 1000
										var sign = MD5Util.sign(timestamp)
										wx.request({
											url: 'https://www.aftdc.com/wxapp/Article/appraisesImg',
											data: {
												id: that.data.id,    //文章的id
												userId:wx.getStorageSync('usersInfo').userId,
												sign: sign,
												timestamp: timestamp,
												token: wx.getStorageSync('usersInfo').token,
												img: name
											},
											method: 'POST',
											header: {
												"Content-Type": "application/x-www-form-urlencoded"
											},
											success: function (res) {
												that.data.appraises.unshift(res.data.data)
												that.setData({
													appraises: that.data.appraises,
													add: false
												})
											}
										})
									}
								}
							})
						}
					})
				}
			}
		})
	},
})