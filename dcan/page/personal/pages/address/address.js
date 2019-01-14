var app = getApp();
var util = require('../../../../utils/util.js')
var MD5Util = require('../../../../utils/md5.js');
Page({

	data: {
		height: 40,
    edit:true
	},

	onLoad: function (options) {
    if (options.edit){
      this.setData({
        edit: false
      })
    }
		this.data.shopId = options.shopId
		var alladdress = wx.getStorageSync('alladdress')
		if (alladdress) {
			this.setData({
				alladdress: alladdress
			})
		} else {
			var userId = wx.getStorageSync('usersInfo').userId
			var that = this
			var timestamp = (Date.parse(new Date())) / 1000
			var sign = MD5Util.sign(timestamp)
			wx.request({
				url: 'https://www.aftdc.com/wxapp/Order/getAddress',
				method: 'POST',
				data: {
					sign: sign,
					timestamp: timestamp,
					token: wx.getStorageSync('usersInfo').token,
				},
				header: { "Content-Type": "application/x-www-form-urlencoded" },
				success: function (res) {
					that.setData({
						alladdress: res.data
					})
					if (res.data) {
						wx.setStorageSync('alladdress', res.data)
					}
				}
			})
		}
	},
	//长按
	bindTouchStart: function (e) {
		this.startTime = e.timeStamp;
	},
	bindTouchEnd: function (e) {
		this.endTime = e.timeStamp;
	},
	longtap: function (e) {
		this.setData({
			choose: true,
			aid: e.currentTarget.dataset.aid,
      aIndex: e.currentTarget.dataset.index
		})
	},
	//编辑
	edit: function () {
		var aid = this.data.aid
		var arr = this.data.alladdress
		for (var i = 0; i < arr.length; i++) {
			if (arr[i]['addressId'] == aid) {
				var arrs = arr[i];
				break;
			}
		}
		this.setData({
			hid: true,
			arrs: arrs,
			type: 1,  //表示保存，而不是添加
		})
	},
	//保存地址
	map: function () {
		var that = this
		wx.chooseLocation({
			success: function (res) {
				that.setData({
					address: res
				})
			},
		})
	},
	add: function () {
		this.setData({
			hid: true,
			arrs: null,
			aid: null,
			type: 2
		})
	},
	saveaddr: function (e) {
		var userId = wx.getStorageSync('usersInfo').userId
		var data = e.detail.value
    if(this.data.address){
      var longitude = this.data.address.longitude
      var latitude = this.data.address.latitude
    }
		var aid = this.data.aid
		var type = this.data.type

		if (!data.userName || !data.area || !data.address) {
			util.aftModal({
				title: '请填写完整',
				icon: 'loading'
			})
			return false
		}
		if (!this.data.userPhone) {
			util.aftModal({
				title: '手机号错误',
				icon: 'loading'
			})
			return false
		} else {
			data.userPhone = this.data.userPhone
		}
		var data = JSON.stringify(data)
		var that = this
		var timestamp = (Date.parse(new Date())) / 1000
		var sign = MD5Util.sign(timestamp)
		wx.request({
			url: 'https://www.aftdc.com/wxapp/Personal/userAddress',
			method: 'POST',
			data: {
				data: data,
				longitude: longitude,
				latitude: latitude,
				aid: aid,
				sign: sign,
				timestamp: timestamp,
				token: wx.getStorageSync('usersInfo').token,
				type: type
			},
			header: { "Content-Type": "application/x-www-form-urlencoded" },
			success: function (res) {
				if (res.data) {
					wx.showModal({
						title: '提示',
						content: '保存成功',
						showCancel: false,
						success: function () {
							that.setData({
								alladdress: res.data,
								hid: false,
								choose: false,
								address: null
							})
							wx.setStorageSync('alladdress', res.data)
						}
					})
				}
			}
		})
	},
	//删除
	del: function () {
		var aid = this.data.aid
		var userId = wx.getStorageSync('usersInfo').userId
		var that = this
		var timestamp = (Date.parse(new Date())) / 1000
		var sign = MD5Util.sign(timestamp)
    var clearAddress =null
    var address = null
		wx.showModal({
			title: '删除操作',
			content: '请确定删除该地址',
			success: function (res) {
				if (res.confirm) {
					wx.request({
						url: 'https://www.aftdc.com/wxapp/Personal/delAddress',
						method: 'POST',
						data: {
							userId: userId,
							aid: aid,
							sign: sign,
							timestamp: timestamp,
							token: wx.getStorageSync('usersInfo').token,
						},
						header: { "Content-Type": "application/x-www-form-urlencoded" },
						success: function (res) {
              if (res.data.res) {
                
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 1500,

									showCancel: false,
									success: function () {
                    //清楚缓存
                    clearAddress = wx.getStorageSync('alladdress')
                    clearAddress.splice(that.data.aIndex,1)
                    wx.setStorageSync('alladdress', clearAddress)
                    //判断选中的地址是否是删除了的地址
                    address = wx.getStorageSync('address')
                    if (address && address['addressId'] == that.data.aid){
                      wx.removeStorageSync('address')
                    }
                    that.cancel()
                    that.setData({
                      alladdress: clearAddress
                    })
										// that.setData({
										// 	alladdress: res.data,
										// 	choose: false
										// })
										//wx.setStorageSync('alladdress', res.data.res)
									}
								})
							}else{
                wx.showToast({
                  title: '失败,请稍后重试',
                  icon: 'none',
                  duration: 1500,
                  //title: '提示',
                  //content: '删除失败,请稍后再试',
                  success:function(){
                    that.cancel()
                  }
                })
              }
						}
					})
				}
			}
		})
	},
	cancel: function () {
		this.setData({
			hid: false,
			choose: false,
			address: null,
			arrs: null
		})
	},
	//选择地址
	chooseAdress: function (e) {
		if (this.endTime - this.startTime < 350) {
			var aid = e.currentTarget.dataset.aid
			var arr = this.data.alladdress
			for (var i = 0; i < arr.length; i++) {
				if (arr[i]['addressId'] == aid) {
					var arrs = arr[i];
					break;
				}
			}

			// 检查是否在配送范围
			var shopId = this.data.shopId
			var lat = arrs.latitude
			var lng = arrs.longitude
			var timestamp = (Date.parse(new Date())) / 1000
			var sign = MD5Util.sign(timestamp)
			wx.request({
				url: 'https://www.aftdc.com/wxapp/Desk/checkDistance',
				method: "POST",
				data: {
					sign: sign,
					timestamp: timestamp,
					token: wx.getStorageSync('usersInfo').token,
					lat: lat,
					lng: lng,
					shopId: shopId
				},
				header: { "Content-Type": "application/x-www-form-urlencoded" },
				success: function (res) {
					if (res.data.res == 1) {
						wx.setStorageSync('address', arrs)
						app.globalData.address = arrs;  //存储数据到app对象上
						wx.navigateBack();
					} else {
						app.globalData.address = null;
            wx.showModal({
              title: '提示',
              content: '改地址不在商家配送范围',
              showCancel:false
            })
					}
				}
			})
		}
	},
	//获取手机号
	getPhoneNumber: function (e) {
		var that = this
    var usersInfo = wx.getStorageSync('usersInfo')
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
							if (res.data.res == 1) {
                
                usersInfo.userPhone = res.data.phoneNumber
                wx.setStorageSync('usersInfo', usersInfo)
								that.setData({
									userPhone: res.data.phoneNumber
								})
								util.aftModal({
									title: '设置成功'
								})
							} else {
								util.aftModal({
									title: '请重试',
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