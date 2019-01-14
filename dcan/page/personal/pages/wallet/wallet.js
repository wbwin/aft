var MD5Util = require('../../../../utils/md5.js')
var util = require('../../../../utils/util.js')
var app = getApp();

Page({
  data: {
    title: [{
      name: '会员卡',
      photo: 'https://image.aftdc.com/images/hyk.png',
      url: '../hyk/hyk',
      num: 0
    }, {
      name: '红包',
      photo: 'https://image.aftdc.com/images/hb.png',
      url: '../hb/hb',
      num: 0
    },
    //  {
    //   name: '优惠券',
    //   photo: 'https://image.aftdc.com/images/yhq.png',
    //     url: '/pages/personal/coupon/coupon',
    //   num: 0
    // }
    ],
  },
  onLoad() {
   
  },
  goto:util.throttle(function (e) {
    var index = e.currentTarget.dataset.index;
    var url = this.data.title[index]['url'];
    this.data.title[index]['num'] = 0;
    this.setData({
      title: this.data.title
    })
    wx.navigateTo({
      url: url,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  })
})

// var app = getApp();
// var MD5Util = require('../../../utils/md5.js');
// Page({

// 	data: {
// 		bullet: [],
// 		choose:0,
// 		currentTab:0
// 	},

// 	onLoad: function (options) {

// 		var timestamp = (Date.parse(new Date())) / 1000
// 		var sign = MD5Util.sign(timestamp)
// 		var that = this
// 		wx.getSystemInfo({
// 			success: function (res) {
// 				that.setData({
// 					windowHeight: res.windowHeight
// 				})
// 			}
// 		});
// 		wx.request({
// 			url: 'https://www.aftdc.com/wxapp/Asset/bullet',
// 			data: {
// 				sign: sign,
// 				timestamp: timestamp,
// 				token: wx.getStorageSync('usersInfo').token
// 			},
// 			header: {
// 				"Content-Type": "application/x-www-form-urlencoded"
// 			},
// 			method: "POST",
// 			success: function (res) {
// 				if (res.data.res==1)
// 					that.setData({ 'bullet': res.data.data })
// 				else {
// 					wx.showToast({
// 						title: '出错了',
// 						icon: 'loading',
// 						duration: 1000,
// 						mask: true
// 					})
// 				}
// 			}
// 		})
// 	},

// 	//领券中心
// 	coupon: function () {
// 		wx.navigateTo({
// 			url: '/pages/personal/coupon/coupon',
// 		})
// 	},
// 	//打开隐藏款
// 	openHid: function (e) {
// 		var hid = e.currentTarget.dataset.hid;
// 		if (hid == 1) {
// 			this.setData({
// 				hid1: true
// 			})
// 		} else if (hid == 2) {
// 			this.setData({
// 				hid2: true
// 			})
// 		} else if (hid == 3) {
// 			this.setData({
// 				hid3: true
// 			})
// 		}
// 	},
// 	//隐藏
// 	hid: function () {
// 		this.setData({
// 			hid1: false,
// 			hid2: false,
// 			hid3: false
// 		})
// 	},
// 	//去店铺
// 	toShop:function(e){
// 		var shopId = e.currentTarget.dataset.id;
// 		wx.navigateTo({
// 			url: '/pages/introduce/introduce?shopId='+shopId,
// 		})
// 	},
// 	// 滚动切换标签样式
// 	switchTab: function (e) {
// 		this.setData({
// 			currentTab: e.detail.current,
// 			choose: e.detail.current
// 		});
// 	},
// 	// 点击标题切换当前页时改变样式
// 	swichNav: function (e) {
// 		var cur = e.currentTarget.dataset.choose;
// 		if (this.data.currentTab == cur) { return false; }
// 		else {
// 			this.setData({
// 				currentTab: cur,
// 				choose: cur
// 			})
// 		}
// 	},
	
// })