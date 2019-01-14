var app = getApp();
var authorization = require('../../../../utils/authorization.js')
var MD5Util = require('../../../../utils/md5.js');
Page({
	data: {
    btn: ['欺诈', '色情', '诱导行为', '不实信息', '违法犯罪', '骚扰', '违规声明原创', '未授权','其他'],
		btnText: [
			'',
			'',
			'',
			'',
			'',
			''
		],
		text: '',
		getText: '',
		backgoundA: false,
		jubaoBoxA: false,
		tips: 1,
		imgPaths: null,
        type:''
	},

	onLoad: function (options) {
    var article_id = options.article_id
		this.setData({
      article_id: article_id,
      type: options.type
		})
		var that = this
		var userId = wx.getStorageSync('usersInfo').userId

	},
	//上传图片
	upImg: function () {
		var that = this
		wx.chooseImage({
			count: 1,
			sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
			sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
			success: function (res) {
				that.setData({
					imgPaths: res.tempFilePaths
				})
			}
		})
	},
	//点击变颜色
	changeColor: function (e) {
		var index = e.currentTarget.dataset.index
		var btnText = this.data.btnText
		var text = btnText[index]
		console.log(index)
		this.setData({
			change: index,
			text: text
		})
	},
	//获取文本
	getText: function (e) {
		var getText = e.detail.value
		this.setData({
			getText: getText
		})
	},
	tijiao: function (e) {
		var that = this
		var userPhone = wx.getStorageSync('usersInfo').userPhone
		if (!userPhone) {
			that.setData({
				noPhone: true
			})
			return false
		}
		var getText = that.data.getText
		var index = that.data.change //原因div 的 id
		var btn = that.data.btn
		var reason = btn[index]
    var article_id = that.data.article_id
		var userId = wx.getStorageSync('usersInfo').userId
		var imgPaths = that.data.imgPaths
    console.log(imgPaths)
    var index1 = imgPaths[0].lastIndexOf(".");
    var index2 = imgPaths[0].length;
    var q = [];
    q.push(imgPaths[0].substring(index1, index2));//后缀名 
    var oss = ""
		if (getText == '') {
			wx.showModal({
				title: '提示',
				content: '请填写说明',
				showCancel: false
			})
			return false
		}
		if (reason == undefined) {
			wx.showModal({
				title: '提示',
				content: '请选择举报原因',
				showCancel: false
			})
			return false
		}
    if(that.data.type=='user')
        var url = 'https://www.aftdc.com/wxapp/Userarticle/arcticle_report'
    else
        var url = 'https://www.aftdc.com/wxapp/Article/arcticle_report'
    var timestamp = (Date.parse(new Date())) / 1000
    var sign = MD5Util.sign(timestamp)
		wx.request({
            url: url,
			data: {
        sign: sign,
        timestamp: timestamp,
        token: wx.getStorageSync('usersInfo').token,
        content: that.data.getText,
				tagStr: reason,
        article_id: article_id,
				userId: userId,
        userPhone: wx.getStorageSync('usersInfo').userPhone,
        q:JSON.stringify(q)
			},
			method: 'POST',
			header: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			success: function (res) {
        oss = res.data.oss
        var report_id = res.data.report_id
        var path = res.data.oss.name[0];
				if (res.data.isUse == 0) {
					wx.showModal({
						title: '提示',
						content: '你的账号已被封停！无法进行该操作',
						showCancel: false
					})
					return false
				}
				if (res.data.res == 1) {
          console.log(res.data.oss)
					if (imgPaths) {
            wx.uploadFile({
              url: res.data.oss.host,
              filePath: imgPaths[0],
              name: 'file',
              formData: {
                "key": res.data.oss.name[0],//图片的路径
                "policy": res.data.oss.policy,
                "OSSAccessKeyId": res.data.oss.accessid,
                'success_action_status': '200',
                'signature': res.data.oss.signature
              },
              header: { "Content-Type": "multipart/form-data" },
              success: function (res) {
                if (res.statusCode==200)
                {
                  if(that.data.type=='user')
                      var url = 'https://www.aftdc.com/wxapp/Userarticle/reportImg'
                  else
                      var url = 'https://www.aftdc.com/wxapp/Article/reportImg'
                  var timestamp = (Date.parse(new Date())) / 1000
                  var sign = MD5Util.sign(timestamp)
                  wx.request({
                      url: url,
                    data: {
                      sign: sign,
                      timestamp: timestamp,
                      token: wx.getStorageSync('usersInfo').token,
                      report_id: report_id,
                      imgPaths: path, 
                    },
                    method: 'POST',
                    header: {
                      "Content-Type": "application/x-www-form-urlencoded"
                    },
                    success: function (res) {

                    }
                  })
                }
              }
            })
					}
						wx.showModal({
							title: '提示',
							content: '举报成功',
							showCancel: false,
							success: function () {
								wx.navigateBack()
							}
						})
	
				}
				if (res.data == 2) {
					wx.showModal({
						title: '提示',
						content: '您已举报该评论',
						showCancel: false,
						success: function () {
							wx.navigateBack()
						}
					})
				}
			}
		})
	},
	//获取手机号
	getPhoneNumber: function (e) {
		this.setData({
			noPhone: false
		})
		authorization.getPhone(e)
	},
})