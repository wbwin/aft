var app = getApp()
var MD5Util = require('../../../../utils/md5.js');
var authorization = require('../../../../utils/authorization.js')

Page({
	data: {
		recharges: '',
		choicePrice: ["100", "200", "300", "500", "800", "1000", "1500", "2000", "自定义"],
	},

	onLoad: function (options) {
		this.data.shopId = options.shopId
		this.data.userPhone = wx.getStorageSync('usersInfo').userPhone
	},

	onReady: function () {
		var shopId = this.data.shopId
		var that = this
		var timestamp = (Date.parse(new Date())) / 1000
		var sign = MD5Util.sign(timestamp)
		wx.request({
			url: 'https://www.aftdc.com/wxapp/Shop/getShopVip',
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			data: {
				sign: sign,
				timestamp: timestamp,
				token: wx.getStorageSync('usersInfo').token,
				shopId: shopId,
				userId:wx.getStorageSync('usersInfo').userId
			},
			method: "POST",
			success: function (res) {
				that.setData({
					userVip: res.data.userVip,
					vip: res.data.vip
				})
			}
		})
	},
	//充值选择
	rechargePrice: function (e) {
		var index = e.currentTarget.dataset.index;
		var choicePrice = this.data.choicePrice
		var pricePrompt = choicePrice[index]
		var custom = choicePrice.length - 1
		if (custom == index) {
			this.setData({
				focus: true,
				Prompt: true,//充值提示显示
			})
			var recharges = this.data.recharges
			if (Boolean(recharges)) {
				this.inspect(recharges)
			}
		} else {
			this.inspect(pricePrompt)
			this.setData({
				focus: false,
				recharges: choicePrice[index]
			})
		}
		this.setData({
			okprice: index,
		})
	},
	//输入金额
	bindinput: function (e) {
		if (e.detail.value.length != null) {
			var pricePrompt = e.detail.value
			this.inspect(pricePrompt)//折扣提示
			this.setData({
				recharges: e.detail.value
			})
		} else {
			this.setData({
				Prompt: true,//充值提示
			})
		}
	},
	//折扣提示
	inspect: function (pricePrompt) {
		var vip = this.data.vip
		if (vip) {
			var len = vip.length
			var popMoney = parseInt(vip[len - 1].money)
			var first = parseInt(vip[0].money)
			if (pricePrompt >= popMoney) {
				var discountPrompt = vip[len - 1].zk
				var vipName = vip[len - 1].name
			} else if (pricePrompt < first) {
				this.setData({
					Prompt: true,//充值提示显示
				})
				return false
			} else {
				for (var i = 0; i < len; i++) {
					var moneys = parseInt(vip[i].money)
					var end = i + 1
					if (end < len) {
						var moneyEnd = parseInt(vip[end].money)
						if (pricePrompt >= moneys && pricePrompt < moneyEnd) {
							var discountPrompt = vip[i].zk
							var vipName = vip[i].name
							break
						}
					}
				}
			}
			this.setData({
				Prompt: false,//充值提示显示
				discountPrompt: discountPrompt,//充值后折扣
				vipName: vipName
			})
		}
	},
	//确认充值
	confirm: function (e) {
		var that = this
		var usersInfo = wx.getStorageSync('usersInfo')
		if (!usersInfo || !usersInfo.userPhone) {//如果没登录
			wx.navigateTo({
				url: '../author/author',
			})
			return false
		} else {
			var userPhone = that.data.userPhone
			if (!userPhone) {//没有电话号码时中断弹出设置框
				that.setData({
					noPhone: true
				})
				return false
			}
			var oid = wx.getStorageSync('usersInfo').openid
			var recharges = that.data.recharges
			var userId = wx.getStorageSync('usersInfo').userId
			var shopId = that.data.shopId
			var fromId = e.detail.formId;
			wx.showLoading({
				title: '正在充值..',
				mask: true
			})
			var cz = this
			var timestamp = (Date.parse(new Date())) / 1000
			var sign = MD5Util.sign(timestamp)
			wx.request({
				url: 'https://www.aftdc.com/wxapp/Thirdfun/recharge',
				method: 'POST',
				data: {
					sign: sign,
					timestamp: timestamp,
					token: wx.getStorageSync('usersInfo').token,
					openid: oid,
					paid_amount: recharges,
					p_name: '店家充值',
					money: recharges,
					shopId: shopId,
					userId: userId,
					fromId: fromId
				},
				header: { "Content-Type": "application/x-www-form-urlencoded" },
				success: function (res) {
					if (res.data.isUse == 0) {
						wx.showModal({
							title: '提示',
							content: '你的账号已被封停！无法进行该操作',
							showCancel: false
						})
						return false
					}

					wx.requestPayment({
						timeStamp: res.data.timestamp,
						nonceStr: res.data.nonce_str,
						package: res.data.pkg,
						signType: 'MD5',
						paySign: res.data.signc,
						success: function (res) {
							wx.hideLoading()
							that.onReady()
							wx.showModal({
								title: '提示',
								content: '充值成功',
								showCancel: false
							})
						},
						fail: function (res) {
							wx.hideLoading()
							wx.showModal({
								title: '提示',
								content: '充值失败',
								showCancel: false
							})
						}
					})
				},
				fail: function (res) {
					wx.hideLoading()
					wx.showModal({
						title: '提示',
						content: '充值失败',
						showCancel: false
					})
				},
			})
		}
	},
	//获取手机号
	getPhoneNumber: function (e) {
		this.setData({
			noPhone: false
		})
		authorization.getPhone(e)
		this.setData({ userPhone: wx.getStorageSync('usersInfo').userPhone })
	},
	cancel: function () {
		wx.navigateBack()
	}
})