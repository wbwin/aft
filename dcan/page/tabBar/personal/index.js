var app = getApp()
var util = require('../../../utils/util.js')
var MD5Util = require('../../../utils/md5.js');
Page({
	data: {
	},
	onShow: function () {
    var that = this
    var userId = wx.getStorageSync('usersInfo').userId
    if (!userId)
      return false;
    wx.request({
      url: 'https://www.aftdc.com/wxapp/Adduser/vip_grade',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        userId: userId
      },
      success: function (res) {
        that.data.vip_grade = res.data.data
        that.setData({
          countNum: res.data.countNum
        })
      }
    })
    var userInfo = wx.getStorageSync('usersInfo')
    if (userInfo) {
      this.setData({
        userName: userInfo.userName,
        userPhoto: userInfo.userPhoto
      })
    }
    
		var vip_grade = this.data.vip_grade
    var userInfo = wx.getStorageSync('usersInfo')
		if (vip_grade && userInfo) {
			for (var i in vip_grade) {
				if (userInfo.spend >= vip_grade[i].val) {
					var grade = vip_grade[i].grade
					this.setData({
						grade: grade
					})
					break;
				}
			}
			//红点
			var usersInfo = wx.getStorageSync('usersInfo')
			if (usersInfo.notReadMessage.activity + usersInfo.notReadMessage.article + usersInfo.notReadMessage.system > 0) {
				this.setData({
					redDot: true
				})
			} else {
				this.setData({
					redDot: false
				})
				wx.hideTabBarRedDot({
					index: 3,
				})
			}
		}
	},
	onReady: function () {
   
	},
  onTabItemTap(item) {
    var that=this
    that.onShow()
  },
  block: util.throttle(function (e) {
		var usersInfo = wx.getStorageSync('usersInfo')
		var route = e.currentTarget.dataset.url;
		if (!usersInfo || !usersInfo.userPhone) {//如果没登录
			wx.navigateTo({
        url: '../../homePage/pages/author/author',
			})
			return false
		} else {
			if (route == 'goSet') {
        var url = '../../personal/pages/phone/phone?type=1'
			} else if (route == 'fapiao') {
        var url = '../../personal/pages/invoice/invoice'
			} else if (route == 'cooperation') {
        var url = '../../personal/pages/phone/phone?type=2'
			} else if (route == 'coupon') {
        var url = '../../personal/pages/coupon/coupon'
			} else if (route == 'integral') {
        var url = '../../personal/pages/integral/integral'
			} else if (route == 'recharge') {
        var url = '../../personal/pages/recharge/recharge'
			} else if (route == 'myvip') {
        var url = '../../personal/pages/myvip/myvip'
			} else if (route == 'attention') {
        var url = '../../personal/pages/attention/attention'
			} else if (route == 'collect') {
        var url = '../../personal/pages/collect/collect'
			} else if (route == 'shield') {
        var url = '../../personal/pages/shield/shield'
			} else if (route == 'history') {
        var url = '../../personal/pages/history/history'
			} else if (route == 'wallet') {
        var url = '../../personal/pages/wallet/wallet'
			} else if (route == 'news') {
        var url ='../../direct/pages/downloadApp/downloadApp'
      } else if (route == 'friend'){
        var url = '../../personal/pages/circle/circle'
      } else if (route == 'address') {
        var url = '../../personal/pages/address/address?edit=1'
      }
			wx.navigateTo({
				url: url
      })
		}
	}),
  onShareAppMessage: function (res) {
    return {
      title: '阿凡提智慧点餐',
      path: '/page/tabBar/homePage/index',
      success: function (res) {
        // 分享成功
      }
    }
  },
	info: function (e) {
		var nickName = this.data.userInfo.userName
		var imagesrc = this.data.userInfo.userPhoto
		wx.navigateTo({
      url: '../../personal/pages/info/info?nickName=' + nickName + '&&imagesrc=' + imagesrc,
		})
	},
	//login
  login: util.throttle(function () {
		wx.navigateTo({
      url: '../../homePage/pages/author/author',
		})
	}),
  app: util.throttle(function () {
		wx.navigateTo({
      url: '../../personal/pages/download/download'
		})
	}),
	//扫码点餐
	sys: function () {
		wx.scanCode({
			success: (res) => {
				wx.navigateTo({
					url: '../../' + res.path,
				})
			}
		})
	}
})
