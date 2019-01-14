var app = getApp();
var MD5Util = require('../../../../utils/md5.js');
Page({
	data: {
		butTogle: true, //点击获取验证码或倒数秒数
		adopt: false, //是否可以点击获取时间
		second: 60,
		phone: '',//电话号码
		code: '',//返回的验证码
		inputCode: '',//输入的验证码
    protocolRadio: false,//同意服务协议
		disabled: '',
	},

	onLoad: function (options) {
		// type 1为商家入驻 2为城市合伙人
		this.setData({
			type: options.type,
		})
	},
	phoneTest: function (e) {
		let val = e.detail.value;
		var adopt = false;
		if ((/^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9])|(17[0-9]))\d{8}$/.test(val))) {
			adopt = true;
		}
		this.setData({
			adopt: adopt,
			phone: val,
		})
	},
	getVerif: function () {
		var phone = this.data.phone
		var adopt = this.data.adopt
		var that = this
		if (phone && adopt) {
			wx.request({
        url: 'https://www.aftdc.com/businessapp/Login/yzm',
				data: {
					phone: phone
				},
        method: 'post',
				header: { "Content-Type": "application/x-www-form-urlencoded" },
				success: function (res) {
					var info = res.data;
					if (info.res == 1) {
						wx.showToast({
							title: info.info,
							mask: true,
							icon: 'loading',
							success: setTimeout(function () {
								that.secondFn()
								that.setData({
									butTogle: false,
								})
							}, 1000)
						})
					} else if (info.res == -2) {
						wx.showToast({
							title: info.info,
							mask: true,
							icon: 'loading',
							success: setTimeout(function () {

							}, 1000)
						})
					} else {
						wx.showToast({
							title: info.info,
							mask: true,
							icon: 'loading',
							success: setTimeout(function () {

							}, 1000)
						})
					}
				}
			})
		}
	},
	//倒计时
	secondFn: function () {
		clearInterval()
		var second = 60
		var that = this
		var time = setInterval(function () {
			that.setData({
				second: second
			});
			second = second - 1;
			if (second <= 0) {
				that.setData({
					second: 60,
					butTogle: true,
				});
				clearInterval(time)
			}
		}, 1000)
	},
	//验证码输入框
	codeFn: function (e) {
		var val = e.detail.value;
		this.setData({
			inputCode: val
		})
	},
	//确定
	nextBut: function (e) {
		//   临时测试
		//   wx.navigateTo({
		// 	  url: '../openmage/openmage?phone=' + this.data.phone
		//   })
		//   return false


		this.setData({
			disabled: "disabled",//点一次就不能在点了
		})
		var that = this;
		var adopt = that.data.adopt;
    var protocolRadio = that.data.protocolRadio;
		if (adopt == false) {
			wx.hideLoading()
			wx.showToast({
				title: '手机号码错误',
				mask: true,
				icon: 'loading',
				success: setTimeout(function () {
					that.setData({
						disabled: false,//点一次就不能在点了
					})
				}, 1000)
			})
			return false;
		}
		var phone = that.data.phone;
		var inputCode = that.data.inputCode;
		if (inputCode == '') {
			wx.showToast({
				title: '请输入验证码',
				icon: 'loading',
				duration: 1000
			});
			that.setData({
				disabled: false,//点一次就不能在点了
			})
			return false;
		}
    var protocolRadio = that.data.protocolRadio;
    if (!protocolRadio){
      wx.showToast({
        title: '请同意协议',
        mask: true,
        icon: 'loading',
        success: setTimeout(function () {
          that.setData({
            disabled: false,//点一次就不能在点了
          })
        }, 1000)
      })
      return false;
    }
		var result = that.data.type;
		if (result == 2) {
			var timestamp = (Date.parse(new Date())) / 1000
			var sign = MD5Util.sign(timestamp)
			wx.request({
				url: 'https://www.aftdc.com/wxapp/Service/enrol_city',
				method: 'post',
				data: {
					sign: sign,
					timestamp: timestamp,
					token: wx.getStorageSync('usersInfo').token,
					phone: phone,
					code: inputCode,
				},
				header: { "Content-Type": "application/x-www-form-urlencoded" },
				success: function (res) {
					var info = res.data;
					if (info.res == 1) {
						wx.navigateTo({
							url: '../cooperation/cooperation?phone=' + phone
						})
					} else {
						wx.showToast({
							title: info.info,
							mask: true,
							icon: 'loading',
							success: setTimeout(function () {
								that.setData({
									disabled: false,//点一次就不能在点了
								})
							}, 1000)
						})
					}
				}
			})
			return false
		}
		wx.request({
      url: 'https://www.aftdc.com/businessapp/Enter/isEnter',
			data: {
				phone: phone,
				code: inputCode,
			},
			method: 'post',
			header: { "Content-Type": "application/x-www-form-urlencoded" },
			success: function (data) {
				var info = data.data;
				if (info.res == 1) {
					wx.showToast({
						title: info.info,
						mask: true,
						icon: 'loading',
						success: setTimeout(function () {
							if (result == 1) {
								wx.navigateTo({
									url: '../openmage/openmage?phone=' + info.phone + '&token=' + info.token
								})
							} else if (result == 2) {
								wx.navigateTo({
									url: '../cooperation/cooperation',
								})
              } else {
								wx.showToast({
									title: '恶意操作',
									icon: 'loading',
									duration: 1000
								});
							}
						}, 1000)
					})
				} else if (info.res == 2) {
          console.log(2222222222222222)
					wx.showToast({
						title: info.info,
						mask: true,
						icon: 'loading',
						success: setTimeout(function () {
							wx.navigateTo({
                url: '../wait/wait?phone=' + info.phone + '&token=' + info.token,
							})
						}, 1000)
					})
				} else {
					wx.showToast({
						title: info.info,
						mask: true,
						icon: 'loading',
						success: setTimeout(function () {
							that.setData({
								disabled: false,//点一次就不能在点了
							})
						}, 1000)
					})
				}
			}
		})
		return false;
	},
  read:function(){
    wx.navigateTo({
      url: '../read/read',
    })
  },
  protocolRadio:function(){
    var that = this;
    that.data.protocolRadio = !that.data.protocolRadio;
    that.setData({
      protocolRadio: that.data.protocolRadio
    })
  }
})