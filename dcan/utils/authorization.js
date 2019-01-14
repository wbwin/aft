var app = getApp();
//录入用户信息
function userInfo() {
	var that = this
	wx.login({
		success: function (r) {
			app.globalData.code = r.code
			var code = r.code
			wx.getUserInfo({
				success: function (res) {
					app.globalData.userInfo = res.userInfo
					var nickName = res.userInfo.nickName
					var avatarUrl = res.userInfo.avatarUrl
					wx.request({
						url: 'https://www.aftdc.com/wxapp/Adduser/index',
						method: "POST",
						header: { "Content-Type": "application/x-www-form-urlencoded" },
						data: {
							code: code,
							nickName: nickName,
							avatarUrl: avatarUrl,
							encryptedData: res.encryptedData,
							iv: res.iv
						},
						success: function (user) {
							app.globalData.usersInfo = user.data
							app.globalData.userId = user.data.userId
							wx.setStorageSync('usersInfo', user.data)
							wx.navigateBack()
						}
					})
				}
			})
		}
	})
}

//获取微信运动数据
function getSport() {
	wx.login({
		success: function (r) {
			app.globalData.code = r.code
			var code = r.code
			wx.getWeRunData({
				success(re) {
					var encryptedData = re.encryptedData
					var iv = re.iv
					wx.request({
						url: 'https://www.aftdc.com/wxapp/Index/getSport',
						method: "POST",
						header: { "Content-Type": "application/x-www-form-urlencoded" },
						data: {
							code: code,
							encryptedData: encryptedData,
							iv: iv
						},
						success: function (res) {
							wx.setStorageSync('wxSport', res.data)
							wx.navigateTo({
								url: '/pages/sport/sport'
							})
						}
					})
				},
				fail(re){
          wx.OpenSetting({
						success: (re) => {
							if (re.authSetting['scope.werun']) {
								return getSport()
							}
						}
					})
				}
			})
		}
	})
}

//获取手机号
function getPhone(e) {
	var that = this
	wx.login({
		success: function (r) {
			var code = r.code
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
					userId: app.globalData.userId,
				},
				success: function (res) {
					if (res.data.res == 1) {
            app.globalData.usersInfo.userPhone = res.data.phoneNumber
						wx.setStorageSync('usersInfo', app.globalData.usersInfo)
						wx.showModal({
							title: '提示',
							content: '设置成功',
							showCancel: false
						})
					} else {
						wx.showModal({
							title: '提示',
							content: '请重试',
							showCancel: false
						})
					}
				}
			})
		}
	})
}

module.exports = {
	userInfo: userInfo,
	getSport: getSport,
	getPhone: getPhone
}