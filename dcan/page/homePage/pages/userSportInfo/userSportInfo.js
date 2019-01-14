var app = getApp();
var MD5Util = require('../../../../utils/md5.js');
var rangeAge = [];
var util = require('../../../../utils/util.js')
for (let i = 0; i < 101; i++) {
	rangeAge[i] = i;
}
var rangeHeight = [];
for (let i = 90; i < 220; i++) {
	rangeHeight.push(i);
}
var rangeWeight = [];
for (let i = 60; i < 200; i++) {
	rangeWeight.push(i);
}
Page({

  data: {
		rangeAge: rangeAge,
		rangeHeight: rangeHeight,
		rangeWeight: rangeWeight,
  },

	onReady:function(){
		var user = wx.getStorageSync('user')
		var changeAge = parseInt(user.age)
		var changeHeight = parseInt(user.height) - 90
		var changeWeight = user.weight - 60
		var changegoalWeight = user.goalWeight - 60

		this.setData({
			user:user,
			changeAge: changeAge,
			changeHeight: changeHeight,
			changeWeight: changeWeight,
			changegoalWeight: changegoalWeight,
		})
	},
	//选择年龄
	changeAge: function (e) {
		this.setData({
			changeAge: e.detail.value
		})
	},
	// //选择身高
	// changeHeight: function (e) {
	// 	this.setData({
	// 		changeHeight: e.detail.value
	// 	})
	// },
  //选择身高
  changeSlider2(e) {
    console.log(e.detail.value)
    this.setData({
      changeHeight: e.detail.value
    })
  },
	//选择体重
	changeWeight: function (e) {
		this.setData({
			changeWeight: e.detail.value
		})
	},
	//选择目标体重
	changegoalWeight: function (e) {
		this.setData({
			changegoalWeight: e.detail.value
		})
	},

	formSubmit: function (e) {
		var that = this;
    var timestamp = (Date.parse(new Date())) / 1000
    var sign = MD5Util.sign(timestamp)

		var formData = e.detail.value;
     formData.sign = sign; 
     formData.timestamp = timestamp; 
     formData.token = wx.getStorageSync('usersInfo').token;
     formData.height = that.data.changeHeight;
		formData.userId = parseInt(app.globalData.userId)
    console.log(formData)
		if (!formData.userId || !formData.age || !formData.sex || !formData.height || !formData.weight || !formData.goalWeight) {
			util.aftModal({
				title: '请填写完整',
				icon: 'loading',
				mask: true
			})
			return false
		} else {//补差
			formData.height = parseInt(formData.height) + 90
			formData.weight = parseInt(formData.weight) + 60
			formData.goalWeight = parseInt(formData.goalWeight) + 60
		}
		var that = this
		wx.request({
      url: 'https://www.aftdc.com/wxapp/Adduser/saveUser_Info',
			method: 'POST',
			data: formData,
			header: {
				'Content-Type': 'application/json'
			},
			success: function (res) {
				if (res.data.res == 1) {
					wx.setStorageSync('user', formData)
					wx.showLoading({
						success:setTimeout(function(){
							wx.navigateBack()
							wx.hideLoading()
						},500)
					})
				} else {
					util.aftModal({
						title: '保存失败',
						icon: 'loading',
						mask: true
					})
				}
			}
		})
	},
})