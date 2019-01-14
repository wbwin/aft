var app = getApp()
var util = require('../../../../utils/util.js');
var util = require('../../../../utils/authorization.js');
var zanTime
Page({
	data: {
		nothing: true,
		classifyId: 0,
		submitOpen: false,
		backgound: false,
		jubaoBox: false,
		backgoundA: false,
		jubaoBoxA: false,
		change: -1,
		idCar: '',
		isCheckCode: 0,
		dzan: false,
		tagId: '',
		changepl: [],
		add: [],
		deletes: [],
		pingluns: true,
		pinglun: true,
	},
	onShow: function () {
		this.setData({
			changepl: [],
			add: [],
			deletes: []
		})
	},
	onLoad: function (options) {
		var that = this
		if (app.globalData.usersInfo) {
			var userId = wx.getStorageSync('usersInfo').userId
		} else {
			var userId = 0
		}
		var shopId = options.shopId
		that.data.shopId = shopId
		wx.request({
			url: 'https://www.aftdc.com/wxapp/Appraises/pinglun',
			header: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			data: {
				shopId: shopId,
				page: 0,
				userId: userId
			},
			method: "POST",
			success: function (res) {
				var pingluns = res.data.all
				if (!pingluns) {
					that.setData({
						pingluns: false
					})
				}
				if (!pingluns || pingluns.lengtn <= 0) {
					return false
				}

				for (var i in pingluns) {
					pingluns[i].writePl = true;
					pingluns[i].mores = 3;
					pingluns[i].createTime = pingluns[i].createTime.split(" ")[0]
					var shopNumber = 0
					var len = 0
					if (Boolean(pingluns[i].shopReply)) {
						shopNumber = 1
					}
					if (Boolean(pingluns[i].reply)) {
						len = pingluns[i].reply.length
					}
					pingluns[i].plNumber = parseInt(shopNumber + len)
				}
				var pinglun = pingluns.slice(0, 10)
				that.setData({
					pingluns: res.data.all,
					shopId: shopId,
					pinglun: pinglun,
					page: pinglun.length,
					count: res.data.count,
					difen: res.data.difen,
					imgNums: res.data.imgNums,
					userName: res.data.userName,
					tag: res.data.tag,
					isApprove: res.data.isApprove,
					allScroe: res.data.allScroe,
					warp: res.data.warp,
					taste: res.data.taste,
					psScore: res.data.psScore,
					waiterScore: res.data.waiterScore
				})
			}
		})
	},

	/*上拉加载*/
	onReachBottom: function () {
		if (this.data.nothing) {
			var that = this
			var chooseId = that.data.chooseId
			var tagId = that.data.tagId
			if (app.globalData.usersInfo) {
				var userId = wx.getStorageSync('usersInfo').userId
			} else {
				var userId = 0
			}
			var page = that.data.page

			var shopId = that.data.shopId

			wx.showLoading()
			wx.request({
				url: 'https://www.aftdc.com/wxapp/Appraises/getpl',
				data: {
					shopId: shopId,
					page: page,
					userId: userId,
					chooseId: chooseId,
					tagId: tagId
				},
				method: "POST",
				header: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
				success: function (res) {
					if (res.data.all != null) {
						var ping = res.data.all
						for (var i in ping) {
							ping[i].writePl = true;
							ping[i].mores = 3;
						}
						that.setData({
							pinglun: that.data.pinglun.concat(ping),
							page: that.data.pinglun.concat(res.data.all).length
						})
						wx.hideLoading()
					} else {
						that.setData({
							nothing: false
						})
						wx.hideLoading()
					}
				}
			})
		}
	},
	//点赞
	Praise: function (e) {
		var that = this
		var index = e.currentTarget.dataset.index
		var usersInfo = wx.getStorageSync('usersInfo')
		if (!usersInfo || !usersInfo.userPhone) {//如果没登录
			wx.navigateTo({
				url: '../author/author',
			})
			return false
		} else {
			that.setData({
				dzan: false,
			})
			clearTimeout(zanTime);
			var id = e.currentTarget.dataset.id
			// var userId = wx.getStorageSync('usersInfo').userId
			var pinglun = that.data.pinglun
			var isDZ = pinglun[index]['isDZ']
			pinglun[index]['isDZ'] = isDZ == 0 ? 1 : 0;

			var zanshow = pinglun[index]['isDZ'];
			var numb = Number(pinglun[index]['numbs']);

			var changepl = that.data.changepl;

			if (zanshow == 0) {
				pinglun[index]['numbs'] = Number(numb - 1);
			}
			else if (zanshow == 1) {
				that.setData({
					dzan: true,
				})
				clearTimeout(zanTime);
				zanTime = setTimeout(function () {
					that.setData({
						dzan: false,
					})
					clearTimeout(zanTime);
				}, 1100)
				pinglun[index]['numbs'] = Number(numb + 1)
			}
			var len = changepl.length
			for (var i = 0; i < len; i++) {
				if (changepl[i].id == id) {
					changepl.splice(i, 1)
					break
				}
			}
			var obj = { id: id, isDZ: zanshow }
			changepl.push(obj)

			that.setData({
				pinglun: pinglun,
				changepl: changepl,
			})
		}
	},

	// 页面卸载
	onHide: function () {
		var that = this
		var changepl = that.data.changepl;
		var add = that.data.add;
		var deletes = that.data.deletes;
		var userId = wx.getStorageSync('usersInfo').userId;
		var len = changepl.length
		for (var i = 0; i < len; i++) {
			var id = changepl[i].id
			if (changepl[i].isDZ == 1) {
				add.push(id)
			} else if (changepl[i].isDZ == 0) {
				deletes.push(id);
			}
		}
		//改变过 点赞 状态的评论id
		if (add.length > 0 || deletes.length > 0) {
			wx.request({
				url: 'https://www.aftdc.com/wxapp/Appraises/updDz',
				method: "POST",
				header: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
				data:
				{
					add: JSON.stringify(add),
					deletes: JSON.stringify(deletes),
					userId: userId,
					shopId: that.data.shopId
				},
				success: function (res) {

				}

			})
		}
	},

	onUnload: function () {
		var that = this
		var changepl = that.data.changepl;
		var add = that.data.add;
		var deletes = that.data.deletes;
		var userId = wx.getStorageSync('usersInfo').userId;
		var len = changepl.length
		for (var i = 0; i < len; i++) {
			var id = changepl[i].id
			if (changepl[i].isDZ == 1) {
				add.push(id)
			} else if (changepl[i].isDZ == 0) {
				deletes.push(id);
			}
		}
		//改变过 点赞 状态的评论id
		if (add.length > 0 || deletes.length > 0) {
			wx.request({
				url: 'https://www.aftdc.com/wxapp/Appraises/updDz',
				method: "POST",
				header: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
				data:
				{
					add: JSON.stringify(add),
					deletes: JSON.stringify(deletes),
					userId: userId,
					shopId: that.data.shopId
				},
				success: function (res) {

				}

			})
		}
	},

	//切换评价
	choiceYes: function (e) {
		var index = e.target.dataset.id
		this.data.chooseId = index
		var classifyId = index
		this.setData({
			classifyId: classifyId,
			pinglun: true
		})
		var that = this
		var userId = wx.getStorageSync('usersInfo').userId
		var page = 0
		var shopId = that.data.shopId
		wx.request({
			url: 'https://www.aftdc.com/wxapp/Appraises/getpl',
			data: {
				shopId: shopId,
				page: page,
				userId: userId,
				chooseId: index
			},
			method: "POST",
			header: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			success: function (res) {
				if (res.data.all != null) {
					var ping = res.data.all
					for (var i in ping) {
						ping[i].writePl = true;
						ping[i].mores = 3;
					}
					that.setData({
						pinglun: ping,
						page: ping.length,
						tagId: ''
					})
				} else {
					that.setData({
						pinglun: null,
						tagId: ''
					})
				}
			}
		})
	},
	//弹出评论
	reply: function (e) {
		var pinglun = this.data.pinglun
		var index = e.currentTarget.dataset.index
		for (var i in pinglun) {
			if (i != index) {
				pinglun[i].writePl = true
			}
		}
		pinglun[index].writePl = !pinglun[index].writePl
		this.setData({
			pinglun: pinglun,
			plText: '',
		})
	},
	//评论框
	plText: function (e) {
		var txt = e.detail.value
		this.setData({
			plText: txt,
		})

	},
	userpjHead: function () {
		wx.navigateTo({
			url: '../userpj/userpj',
		})
	},
	//提交评价
	submitPl: function (e) {
		var that = this
		var usersInfo = wx.getStorageSync('usersInfo')
		if (!usersInfo || !usersInfo.userPhone) {//如果没登录
			wx.navigateTo({
				url: '../author/author',
			})
			return false
		} else {
			var index = e.currentTarget.dataset.index
			var i = e.currentTarget.dataset.i
			var pinglun = that.data.pinglun
			var plText = that.data.plText
			var userId = wx.getStorageSync('usersInfo').userId
			var page = that.data.page
			var shopId = that.data.shopId
			if (!plText || plText == "") {
				return false
			}
			wx.request({
				url: 'https://www.aftdc.com/wxapp/Appraises/reply',
				data: {
					plText: plText,
					index: index,
					userId: userId,
					shopId: shopId,
				},
				method: "POST",
				header: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
				success: function (res) {
					if (res.data.isUse == 0) {
						util.aftModal({
							title: '你的账号已被封停！无法进行该操作',
							icon: 'loading'
						})
						return false
					}
					if (res.data == 1) {
						util.aftModal({
							title: '发表成功',
							icon: 'success',
							duration: 1500,
							success: function (res) {
								var options = []
								options.shopId = that.data.shopId
								//  that.onLoad(options)
								var userName = wx.getStorageSync('usersInfo').userName
								var content = plText
								var obj = { userName: userName, content: content }
								if (!Boolean(pinglun[i].reply)) {
									pinglun[i].reply = []
								}
								pinglun[i].plNumber = pinglun[i].plNumber + 1
								pinglun[i].writePl = true
								pinglun[i].reply.push(obj)
								that.setData({
									pinglun: pinglun,
								})
							}
						})
					}
					else if (res.data.isDisable == 1) {
						util.aftModal({
							title: '含有敏感字符，请文明评论',
							icon: 'loading',
							duration: 1500
						})
					}
					else {
						util.aftModal({
							title: '发表失败',
							icon: 'loading',
							duration: 1500,
							success: function (res) {
								var options = []
								options.shopId = that.data.shopId
								that.onLoad(options)
							}
						})
					}
				}
			})
			that.setData({
				plText: '',
			})
		}
	},
	//举报评价
	jubao: function (e) {
		var pid = e.currentTarget.dataset.pid
		this.setData({
			backgound: true,
			jubaoBox: true,
			pid: pid
		})
	},
	//取消举报
	canBox: function () {
		var that = this
		that.setData({
			backgound: false,
			jubaoBox: false
		})
	},
	//跳转举报页面
	gotoJubao: function () {
		var that = this
		var usersInfo = wx.getStorageSync('usersInfo')
		if (!usersInfo || !usersInfo.userPhone) {//如果没登录
			wx.navigateTo({
				url: '../author/author',
			})
			return false
		} else {
			var pid = that.data.pid
			that.setData({
				backgound: false,
				jubaoBox: false
			})
			wx.navigateTo({
				url: '../report/report?pid=' + pid,
			})
		}
	},
	getTagPl: function (e) {
		var that = this
		var shopId = that.data.shopId
		var id = e.currentTarget.dataset.id
		this.setData({
			tagId: id
		})
		var index = e.currentTarget.dataset.index
		var userId = wx.getStorageSync('usersInfo').userId
		wx.request({
			url: 'https://www.aftdc.com/wxapp/Appraises/pinglun',
			data:
			{
				tagId: id,
				shopId: shopId,
				page: 0,
				userId: userId,
			},
			method: "POST",
			header: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			success: function (res) {
				var pingluns = res.data.all
				if (!Boolean(pingluns)) {
					that.setData({
						nopl: true,
					})
					return false
				}
				if (pingluns.lengtn <= 0) {
					that.setData({
						nopl: true,
					})
					return false
				}

				for (var i in pingluns) {
					pingluns[i].writePl = true
					pingluns[i].createTime = pingluns[i].createTime.split(" ")[0]
					var shopNumber = 0
					var len = 0
					if (Boolean(pingluns[i].shopReply)) {
						shopNumber = 1
					}
					if (Boolean(pingluns[i].reply)) {
						len = pingluns[i].reply.length
					}
					pingluns[i].plNumber = parseInt(shopNumber + len)
				}
				var pinglun = pingluns.slice(0, 10)
				that.setData({
					pinglun: res.data.all,
					change: index,
					pinglunTag: res.data.all,
					nothing: true
				})
			}
		})
	},
	getIdCode: function (e) {
		this.setData({
			codes: e.detail.value
		})
	},
	zan: function (e) {
		var that = this
		//  this.setData({
		//    dzan:true
		//  })
		var animation = wx.createAnimation({
			duration: 60,
			timingFunction: "linear",
			delay: 0,
		})
		this.animation = animation

		animation.scale(2, 2).opacity(1).step({ duration: 260 })
		animation.rotate(10).step()
		animation.rotate(0).step()
		animation.rotate(-10).step()

		animation.rotate(10).step()
		animation.rotate(0).step()
		animation.rotate(-10).step()
		animation.rotate(0).scale(1, 1).opacity(0).step({ duration: 260 })
		this.setData({
			animationData: animation.export(),
		})
	},
	//点击放大图片
	enlargeImg: function (e) {
		var src = e.currentTarget.dataset.src;
		var index = e.currentTarget.dataset.index;
		console.log(src)
		this.setData({
			enlargeSrc: src,
			enlargeBox: true,
			enlargeNumb: index,
		})
	},
	enlargeClose: function (e) {
		this.setData({
			enlargeBox: false,
		})
	},

	//更多评论
	morePl: function (e) {
		var index = e.currentTarget.dataset.index;
		var len = e.currentTarget.dataset.len + 1;
		var pinglun = this.data.pinglun;
		var mores = pinglun[index].mores;
		mores = mores > 3 ? 3 : len
		pinglun[index].mores = mores;
		this.setData({
			pinglun: pinglun,
		})
	}
})