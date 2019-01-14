var authorization = require('../../../../utils/authorization.js')
var app = getApp()
Page({

	data: {
    clickOne:true,
    clickOnes: true,
    options:'',
	},
	onLoad:function(options){
    this.setData({
      options: options,
    })
    var userInfo = wx.getStorageSync('usersInfo')
    if (!userInfo){
      this.setData({
        openType: 1
      })
      return false;
    }
    if (userInfo && !userInfo.userPhone){
			this.setData({
				openType:2
			})
    } else if (userInfo && userInfo.userPhone) {
      if (options.route){
        
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];  //上一个页面
        //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
        prevPage.setData({
          route: options.route,
        })
      }
      wx.navigateBack()
    }
    
	},
	cancel: function () {
		wx.navigateBack()
	},
	getUserInfo: function (e) {
    if(this.data.clickOne)
      this.data.clickOne = false
		var that = this
		wx.getSystemInfo({
			success: function (res) {
				that.data.model = res.model
			}
		})
		app.globalData.userInfo = e.detail.userInfo
		wx.login({
			success: function (r) {
				wx.request({
					url: 'https://www.aftdc.com/wxapp/addUser/index',
					method: "POST",
					header: { "Content-Type": "application/x-www-form-urlencoded" },
					data: {
						code: r.code,
						nickName: e.detail.userInfo.nickName,
						model: that.data.model,
						avatarUrl: e.detail.userInfo.avatarUrl,
						encryptedData: e.detail.encryptedData,
						iv: e.detail.iv
					},
					success: function (user) {
            if (user.data.userId) {
              app.globalData.usersInfo = user.data
              app.globalData.userId = user.data.userId
              wx.setStorageSync('usersInfo', user.data)
              that.onLoad(that.data.options)
            }else{
              that.data.clickOne = true
              wx.showToast({
                title: '注册失败,请重试',
                icon:'loading'
              })
            }
					}
				})
			}
		})
	},
	//获取手机号
	getPhoneNumber: function (e) {
    if (this.data.clickOnes)
      this.data.clickOnes = false
		var that = this
		wx.login({
			success: function (r) {
				var code = r.code
				setTimeout(function () {
					var encryptedData = e.detail.encryptedData
					var iv = e.detail.iv
					wx.request({
						url: 'https://www.aftdc.com/wxapp/Adduser/getUserPhone',
						method: "POST",
						header: { "Content-Type": "application/x-www-form-urlencoded" },
						data: {
							code: code,
							encryptedData: encryptedData,
							iv: iv,
							userId:wx.getStorageSync('usersInfo').userId,
						},
						success: function (res) {
              if (res.data.phoneNumber){
                var usersInfo = wx.getStorageSync('usersInfo')
                usersInfo.userPhone = res.data.phoneNumber
                app.globalData.userInfo = usersInfo
                wx.setStorageSync('usersInfo', usersInfo)
                wx.navigateBack()
              }else{
                this.data.clickOnes = true                
                wx.showToast({
                  title: '获取失败,请重试',
                  icon: 'loading'
                })
              }
						}
					})
				}, 200)
			}
		})
	}
})