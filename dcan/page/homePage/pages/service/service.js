var app = getApp()
var MD5Util = require('../../../../utils/md5.js');
var util = require('../../../../utils/util.js')
var authorization = require('../../../../utils/authorization.js')
Page({
	data: {
		hotList: [
			{
				title: '您可能遇到以下问题',
				a: { title: '菜品少送', id: 0 },
				b: { title: '菜品送错了', id: 1 },
				c: { title: '我想申请退款', id: 2 },
				d: { title: '菜品问题导致身体不适', id: 3 },
				e: { title: '我要补开发票', id: 4 },
				f: { title: '餐未到却显示已送达', id: 5 },
			},
			{
				title: '您可能遇到以下问题2',
				a: { title: '菜品质量问题', id: 6 },
				b: { title: '菜品没有餐具', id: 7 },
				c: { title: '如何修改评价', id: 8 },
				d: { title: '如何删除评价', id: 9 },
				e: { title: '菜品量太少', id: 10 },
				f: { title: '联系不到商家', id: 11 },
			},
			{
				title: '您可能遇到以下问题3',
				// a: { title: '没有红包分享', id: 12 },
				a: { title: '菜品送错了', id: 12 },
				b: { title: '如何评价', id: 13 }
			},
		],
		windowHeight: '',
	},
	onLoad: function (options) {
        this.setData({
          shopId: options.shopId,
          phone: options.phone
        })
	},
	//问题
	problem: function (e) {
		var problem = e.currentTarget.dataset.problem;//问题
		wx.navigateTo({
			url: '../online/online?id=' + problem,
		})
		console.log(problem)
	},
	//联系客服
	service: function (e) {
        var that = this
		wx.navigateTo({
            url: '../contact/contact?shopId=' + that.data.shopId
		})
	},
	//联系骑手
	// horseman: function (e) {
	// 	wx.makePhoneCall({
	// 		phoneNumber: '1520000777',
	// 		success: function (res) {
	// 			console.log(res)
	// 		}
	// 	})
	// },
	//联系商家
	merchant: function (e) {
		wx.makePhoneCall({
			phoneNumber: this.data.phone,
			success: function (res) {
				console.log(res)
			}
		})
	},
})
