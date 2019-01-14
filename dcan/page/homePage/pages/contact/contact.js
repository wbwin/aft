var app = getApp()
var MD5Util = require('../../../../utils/md5.js');
var util = require('../../../../utils/util.js')
var authorization = require('../../../../utils/authorization.js')
Page({

	data: {
		write: true,
		add: false,
		content: '',
		contact: [],
		q: [],
		business_id: 0,
		InvervalPage: 0,
		page: 0,
		intervalis: '',
		onReachUpper: 1,
		timeRange: 0,
    index:'',
	},

	onLoad: function (options) {
    //商家
    if (options.shopId){
      this.data.shopId = options.shopId;
      this.setData({ shopId: options.shopId})
      var objId = options.shopId;
      var is_user = 0;
    } 
    //用户
    if (options.userId){
      this.data.objUserId = options.userId;
      this.setData({ objUserId: options.userId })
      var objId = options.userId;
      var is_user = 1;
    } 
		var that = this
		wx.getSystemInfo({
			success: function (res) {
				that.setData({
					windowHeight: res.windowHeight - 60,
				})
			}
		})
		var timestamp = (Date.parse(new Date())) / 1000
		var sign = MD5Util.sign(timestamp)
		wx.request({
			url: 'https://www.aftdc.com/wxapp/Kufu/contactList',
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			data: {
				sign: sign,
				timestamp: timestamp,
				token: wx.getStorageSync('usersInfo').token,
				shopId: objId,    //对象的id
        is_user: is_user,
				userId:wx.getStorageSync('usersInfo').userId,
				page: that.data.page
			},
			method: "POST",
			success: function (res) {
        if (that.data.shopId) that.setData({ contact: res.data.data, business_id: res.data.business_id, id: res.data.id });
        if (that.data.objUserId) that.setData({ contact: res.data.data, id: res.data.id });
				if (res.data.data != '') {
					that.setData({
						index: res.data.data.length - 1,
						page: that.data.page + 8,
						timeRange: res.data.timeRange
					})
				}
			}
		})


		that.data.intervalis = setInterval(function () {
      if (that.data.shopId) {
        var business_id = that.data.business_id;
        var is_user = 0;
      } 
      if (that.data.objUserId) {
        var business_id = that.data.objUserId;
        var is_user = 1;
      }
			var timestamp = (Date.parse(new Date())) / 1000
			var sign = MD5Util.sign(timestamp)
			if (business_id) {
				wx.request({
					url: 'https://www.aftdc.com/wxapp/Kufu/gu',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						sign: sign,
						timestamp: timestamp,
						token: wx.getStorageSync('usersInfo').token,
						business_id: business_id,    //店铺的id
						id: that.data.id,
            is_user: is_user,
					},
					method: "POST",
					success: function (res) {
						if (res.data.res) {
              that.data.contact = that.data.contact.concat(res.data.data)

							that.setData({
								contact: that.data.contact,
								content: '',
								id: res.data.id,
								index: res.data.data.concat(that.data.contact).length - 2,
							})
						}
					}
				})
			}
		}, 15000);
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
			url: 'https://www.aftdc.com/wxapp/KuFu/del_KuFu',
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			data: {
				sign: sign,
				timestamp: timestamp,
				token: wx.getStorageSync('usersInfo').token,
				id: e.currentTarget.dataset.kufu_id,    //客服的id
			},
			method: "POST",
			success: function (res) {
				that.data.contact.splice(index, 1);
				that.setData({ contact: that.data.contact })
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
    //判断发送对象
    //商家
    if (that.data.shopId) {
      var business_id = that.data.business_id;
      var shopId = that.data.shopId;
    }
    //用户
    if (that.data.objUserId) {
      var business_id = 0 ;
      var shopId = that.data.objUserId;
    }
		var timestamp = (Date.parse(new Date())) / 1000
		var sign = MD5Util.sign(timestamp)
		wx.request({
			url: 'https://www.aftdc.com/wxapp/KuFu/KuFuImg',
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			data: {
        business_id: business_id,    //店铺的id
        shopId: shopId,
        userId:wx.getStorageSync('usersInfo').userId,
				sign: sign,
				timestamp: timestamp,
				token: wx.getStorageSync('usersInfo').token,
				content: that.data.content,
			},
			method: "POST",
			success: function (res) {
				that.data.contact.push(res.data.data)
				that.setData({
					contact: that.data.contact,
					content: '',
					index: that.data.contact.length - 1
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
			count: 1,
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
						url: 'https://www.aftdc.com/wxapp/KuFu/KuFuImgToken',
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
                    //判断发送对象
                    //商家
                    if (that.data.shopId) {
                      var business_id = that.data.business_id;
                      var shopId = that.data.shopId;
                    }
                    //用户
                    if (that.data.objUserId) {
                      var business_id = 0;
                      var shopId = that.data.objUserId;
                    }
										var timestamp = (Date.parse(new Date())) / 1000
										var sign = MD5Util.sign(timestamp)
										wx.request({
											url: 'https://www.aftdc.com/wxapp/KuFu/KuFuImg',
											data: {
												business_id: business_id,    //店铺的id
                        shopId: shopId,
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
												that.data.contact.push(res.data.data)
												that.setData({
													contact: that.data.contact,
													add: false,
													img: ''
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

	onUnload: function () {
		clearInterval(this.data.intervalis)
	},
	onReachUpper: function () {
		if (this.data.onReachUpper) {
			this.data.onReachUpper = 0
      //判断发送对象
      //商家
      if (this.data.shopId) var shopId = this.data.shopId;
      //用户
      if (this.data.objUserId) var shopId = this.data.objUserId;
			var timestamp = (Date.parse(new Date())) / 1000
			var sign = MD5Util.sign(timestamp)
			var that = this
			wx.request({
				url: 'https://www.aftdc.com/wxapp/Kufu/contactList',
				header: {
					'content-type': 'application/x-www-form-urlencoded'
				},
				data: {
					sign: sign,
					timestamp: timestamp,
					token: wx.getStorageSync('usersInfo').token,
					shopId: shopId,    //店铺的id
					userId:wx.getStorageSync('usersInfo').userId,
					page: that.data.page,
					timeRange: that.data.timeRange
				},
				method: "POST",
				success: function (res) {
					if (res.data.data != '') {
						that.data.onReachUpper = 1;
						var temp = that.data.contact
						var tempMain = res.data.data


						that.setData({
							page: that.data.page + 8,
							contact: res.data.data.concat(that.data.contact),
							timeRange: res.data.timeRange
						})
					}
				}
			})
		}
	}

})