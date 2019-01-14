var MD5Util = require('../../../../utils/md5.js');
Page({

	data: {
		clasData: ["配送问题", "功能改善建议", "其他问题"],
		feedback: 0,
		feedbackList: ''
	},


	onLoad: function () {
		var that = this
    var userId = wx.getStorageSync('usersInfo').userId
		var timestamp = (Date.parse(new Date())) / 1000
		var sign = MD5Util.sign(timestamp)
		wx.request({
      url: 'https://www.aftdc.com/wxapp/Service/me_list',
			data: {
				userId: userId,
				sign: sign,
				timestamp: timestamp,
				token: wx.getStorageSync('usersInfo').token
			},
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
			method: "POST",
			success: function (res) {
				if (res.data.res == 1) {
					that.setData({ feedback: 1 });
					that.setData({ feedbackList: res.data.data });
				}
			}
		})
	},
})