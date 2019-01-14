var MD5Util = require('../../../../utils/md5.js');
var app = getApp()
Page({

	data: {
		back: 'none',
		img_l: "",
		// hongbao: 0,  //是否弹出领取红包显示框
		// getHongbao: 0
	},

	onLoad: function (options) {
		var article_id = options.article_id
		this.setData({ article_id: article_id })
		this.getDetail(options.article_id)
	},

	getDetail: function (article_id) {
		var that = this
		if (app.globalData.usersInfo)
			var userId = wx.getStorageSync('usersInfo').userId
		else
			var userId = 0
		wx.request({
			url: 'https://www.aftdc.com/wxapp/Article/gabadie',
			data: {
				article_id: article_id,
				userId: userId
			},
			header: { "Content-Type": "application/x-www-form-urlencoded" },
			method: "POST",
			success: function (res) {
				if (res.data.res == 1) {
					wx.setNavigationBarTitle({
						title: res.data.data.shopName
					})
					that.setData({
						people: res.data.data.num,
						shopId: res.data.data.shopId,
						shopImg: res.data.data.shopImg,
						shopName: res.data.data.shopName,
						business_id: res.data.data.business_id,
						invert_picture: res.data.data.invert_picture,
						is_gabadie: res.data.data.is_gabadie
					})
				}
			}
		})
	},

	gabadie: function () {
		var timestamp = (Date.parse(new Date())) / 1000
		var sign = MD5Util.sign(timestamp)
		var that = this
		var usersInfo = wx.getStorageSync('usersInfo')
		if (!usersInfo || !usersInfo.userPhone) {//如果没登录
			wx.navigateTo({
        url: '../../../homePage/pages/author/author',
			})
			return false
		} else {
			wx.request({
				url: 'https://www.aftdc.com/wxapp/Article/article_gabadie',
				data: {
					sign: sign,
					timestamp: timestamp,
					token: wx.getStorageSync('usersInfo').token,
					userId:wx.getStorageSync('usersInfo').userId,
					shopId: that.data.shopId,
					business_id: that.data.business_id,
					article_id: that.data.article_id
				},
				header: { "Content-Type": "application/x-www-form-urlencoded" },
				method: "POST",
				success: function (res) {
					that.setData({ is_gabadie: 1 })
					if (res.data.res == 1) {
						that.getDetail(that.data.article_id)
						wx.showToast({
							title: '加油成功',
						})
            var pages = getCurrentPages();
            var prevPage = pages[pages.length - 2];
            var num = ++prevPage.data.articleInfo.praise_num
            prevPage.setData({
              'articleInfo.is_praise': 1,
              'articleInfo.praise_num': num
            })
					}
					else {
						wx.showToast({
							title: '已经加油过了',
						})
						that.setData({ is_gabadie: 1 })
					}
				}
			})
		}
	},
	index: function () {
		wx.switchTab({
      url: '/page/tabBar/homePage/index',
		})
	},
	news: function () {
		wx.switchTab({
      url: '/page/tabBar/direct/index',
		})
	},
	shop: function () {
		wx.navigateTo({
      url: '../../../homePage/pages/introduce/introduce?shopId=' + this.data.shopId,
		})
	},
	shopdetail: function () {
		wx.navigateTo({
      url: '../../../homePage/pages/shopdetail/shopdetail?shopId=' + this.data.shopId,
		})
	},
  //调到用户信息详情页
  goToInfoPage: function (e) {
    var boosterId = e.currentTarget.dataset.userid;
    console.log('boosterId:' + boosterId);
    wx.navigateTo({
      url: '../../../homePage/pages/shopdetail/shopdetail?boosterId=' + boosterId,
    })
  },
	backHidden: function () {
		this.setData({ back: 'none' })
	},
	//分享设置
	shareImg: function () {
		if (this.data.img_l) {
			wx.showToast({
				title: '已下载',
			})
			return false;
		}
		wx.showLoading({
			title: '正在生成',
			mask: true
		})
		var that = this
		wx.request({
			url: 'https://www.aftdc.com/wxapp/Article/shareImg',
			data: {
				article_id: that.data.article_id
			},
			header: { "Content-Type": "application/x-www-form-urlencoded" },
			method: "POST",
			success: function (res) {
				var shareImg = res.data.data
				const downloadTask = wx.downloadFile({
					url: shareImg,
					success: function (res) {
						if (res.statusCode === 200) {
							wx.hideLoading()
							that.setData({
								back: 'shareImg',
								img_l: res.tempFilePath //将下载的图片临时路径赋值给img_l,用于预览图片  
							})
							wx.saveImageToPhotosAlbum({
								filePath: that.data.img_l,
								success: function (res) {
									that.setData({
										img_l: res.savedFilePath
									})
								}
							})
							wx.showToast({
								title: '已保存到相册',
							})
						}
					}
				})
			}
		})
	},

	onShareAppMessage: function (res) {
		var usersInfo = wx.getStorageSync('usersInfo')
		if (!usersInfo || !usersInfo.userPhone) {//如果没登录
			wx.navigateTo({
        url: '../../../homePage/pages/author/author',
			})
			return false
		} else {
			var that = this
			var timestamp = (Date.parse(new Date())) / 1000
			var sign = MD5Util.sign(timestamp)
			return {
				title: '帮我加油上餐头条',
        // path: '/pages/direct/helpMe/helpMe?article_id=' + that.data.article_id,
        path: '/page/direct/pages/article/article?article_id=' + that.data.article_id,
				success: function (res) {
					// wx.request({
					// 	url: 'https://www.aftdc.com/wxapp/Article/shareRebouns',
					// 	data: {
					// 		sign: sign,
					// 		timestamp: timestamp,
					// 		token: wx.getStorageSync('usersInfo').token,
					// 		article_id: that.data.article_id,
					// 		shopId: that.data.shopId
					// 	},
					// 	header: { "Content-Type": "application/x-www-form-urlencoded" },
					// 	method: "POST",
					// 	success: function (res) {
					// 		if (res.data.res == 1) {
					// 			that.setData({ 'hongbaoMu': res.data.res })
					// 			that.hongbao()
					// 		}
					// 	}
					// })
				}
			}
		}
	},
	// closeRed: function () {
	// 	this.setData({ 'hongbaoMu': 0, 'hongbao': 0, 'getHongbao': 0 })
	// },
	//领取红包
	// hongbao: function () {
	// 	var timestamp = (Date.parse(new Date())) / 1000
	// 	var sign = MD5Util.sign(timestamp)
	// 	var that = this
	// 	wx.request({
	// 		url: 'https://www.aftdc.com/wxapp/Article/getHongbao',
	// 		data: {
	// 			sign: sign,
	// 			timestamp: timestamp,
	// 			token: wx.getStorageSync('usersInfo').token,
	// 			article_id: that.data.article_id,
	// 			shopId: that.data.shopId
	// 		},
	// 		header: { "Content-Type": "application/x-www-form-urlencoded" },
	// 		method: "POST",
	// 		success: function (res) {
	// 			if (res.data.res)
	// 				that.setData({ 'hongbao': 0, 'getHongbao': 1, 'money': res.data.data.money })
	// 		}
	// 	})
	// },
	yjy: function () {
		wx.showToast({
			title: '已加油',
		})
	}
})