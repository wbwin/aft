var app = getApp();
var MD5Util = require('../../../../utils/md5.js');
var authorization = require('../../../../utils/authorization.js')
Page({
	data: {
		btn: ["餐厅刷单", "视频违规", '政治内容', '淫秽内容', '脏话', '评错项目', '泄露隐私', '广告', '其他原因'],
		btnText: [
			'餐厅刷单',
			'诋毁我国政党、领导人、散播一些可能造成国家分裂、民族分裂、民族矛盾、社会恐慌的信息等',
			'诋毁我国政党、领导人、散播一些可能造成国家分裂、民族分裂、民族矛盾、社会恐慌的信息等',
			'包含色漆服务、内容包含淫秽不良信息，任务裸体,露点等',
			'使用淫秽词语辱骂、攻击他人等',
			'评价内容与该项目无关,或评价内容为凑字乱打、无实际含义的内容等',
			'泄露个人信息或商家机密，如文字泄露电话号码、人名，图片侵犯肖像权，密室逃脱泄露密码等。',
			'引导消费者购买除商家、阿凡提点餐之外的第三方产品或服务等。',
			''
		],
		text: '',
		getText: '',
		backgoundA: false,
		jubaoBoxA: false,
		tips: 1,
		imgPaths: null,
	},

	onLoad: function (options) {
		var pid = options.pid
		this.setData({
			pid: pid
		})
		var that = this
		var userId = wx.getStorageSync('usersInfo').userId
    var timestamp = (Date.parse(new Date())) / 1000
    var sign = MD5Util.sign(timestamp)
		wx.request({
      url: 'https://www.aftdc.com/wxapp/Appraises/checkApprove',
			data: {
        sign: sign,
        timestamp: timestamp,
        token: wx.getStorageSync('usersInfo').token,
				userId: userId
			},
			header: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			method: 'post',
			success: function (res) {
				if (res.data == 1) {
					that.setData({
						backgoundA: true,
						jubaoBoxA: true,
						tips: 0
					})
				}
			}
		})
	},
	//上传图片
	upImg: function () {
		var that = this
		wx.chooseImage({
			count: 1,
			sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
			sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
			success: function (res) {
				that.setData({
					imgPaths: res.tempFilePaths
				})
			}
		})
	},
	//点击变颜色
	changeColor: function (e) {
		var index = e.currentTarget.dataset.index
		var btnText = this.data.btnText
		var text = btnText[index]
		console.log(index)
		this.setData({
			change: index,
			text: text
		})
	},
	//获取文本
	getText: function (e) {
		var getText = e.detail.value
		this.setData({
			getText: getText
		})
	},
	tijiao: function (e) {
		var that = this
		var userPhone = wx.getStorageSync('usersInfo').userPhone
		if (!userPhone) {
			that.setData({
				noPhone: true
			})
			return false
		}
		var getText = that.data.getText
		var index = that.data.change //原因div 的 id
		var btn = that.data.btn
		var reason = btn[index]
		var pid = that.data.pid
		var userId = wx.getStorageSync('usersInfo').userId
		var imgPaths = that.data.imgPaths
		if (getText == '') {
			wx.showModal({
				title: '提示',
				content: '请填写说明',
				showCancel: false
			})
			return false
		}
		if (reason == undefined) {
			wx.showModal({
				title: '提示',
				content: '请选择举报原因',
				showCancel: false
			})
			return false
		}
    var timestamp = (Date.parse(new Date())) / 1000
    var sign = MD5Util.sign(timestamp)
		wx.request({
      url: 'https://www.aftdc.com/wxapp/Appraises/report',
			data: {
        sign: sign,
        timestamp: timestamp,
        token: wx.getStorageSync('usersInfo').token,
				getText: getText,
				reason: reason,
				pid: pid,
				userId: userId
			},
			method: 'POST',
			header: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			success: function (res) {
				if (res.data.isUse == 0) {
					wx.showModal({
						title: '提示',
						content: '你的账号已被封停！无法进行该操作',
						showCancel: false
					})
					return false
				}
				if (res.data.res == 1) {
					if (imgPaths) {
            var timestamp = (Date.parse(new Date())) / 1000
            var sign = MD5Util.sign(timestamp)
						wx.uploadFile({
              url: 'https://www.aftdc.com/wxapp/Appraises/reportImg',
							filePath: imgPaths[0],
							name: 'file',
							formData: {
                sign: sign,
                timestamp: timestamp,
                token: wx.getStorageSync('usersInfo').token,
								'reportId': res.data.reportId
							},
							success: function (res) {
								wx.showModal({
									title: '提示',
									content: '举报成功',
									showCancel: false,
									success: function () {
										wx.navigateBack()
									}
								})
							}
						})
					} else {
						wx.showModal({
							title: '提示',
							content: '举报成功',
							showCancel: false,
							success: function () {
								wx.navigateBack()
							}
						})
					}
				}
				if (res.data == 2) {
					wx.showModal({
						title: '提示',
						content: '您已举报该评论',
						showCancel: false,
						success: function () {
							wx.navigateBack()
						}
					})
				}
			}
		})
	},
	//获取手机号
	getPhoneNumber: function (e) {
		this.setData({
			noPhone: false
		})
		authorization.getPhone(e)
	},
})