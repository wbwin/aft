var MD5Util = require('../../../../utils/md5.js');
var util = require('../../../../utils/util.js');
var app = getApp()
Page({
	data: {
		upload: [],
		choose: 1,
		reType: '选择举报类型',
		report: [
			{ 'w': '餐厅刷单', 'q': '餐厅刷单' },
			{ 'w': '商家资质', 'q': '商家缺少相关从业资质证书' },
			{ 'w': '商家价格问题', 'q': '外卖商品价格高于店内实际价格,恶意设置高满减' },
			{ 'w': '商家品类', 'q': '商家未设置品类或品类设置错误' },
			{ 'w': '商家logo问题', 'q': '商家logo错误或未上传logo' },
			{ 'w': '商家配送问题', 'q': '商家起送价、配送费或餐盒费过高' },
			{ 'w': '其他问题', 'q': '其他您认为影响了市场秩序公正的行为' },
		],
		text: ''
	},

	onLoad: function (options) {
		var shopName = options.shopName
		var shopImg = options.shopImg
		var shopId = options.shopId
		shopName = decodeURI(shopName)
		this.setData({
			shopName: shopName,
			shopImg: shopImg,
			shopId: shopId
		})
	},
	uploadimage: function (e) {
		var upload = this.data.upload
		var that = this
		wx.chooseImage({
			count: 3,
			success: function (res) {
				var tempFilePaths = res.tempFilePaths
				for (var i in tempFilePaths) {
					upload.push(tempFilePaths[i])
				}

				if (upload.length > 3) {
					var index = tempFilePaths.length
					upload.splice(0, index)

				}
				that.setData({
					upload: upload,
					uploadsrc: true
				})
			}
		})
	},
	reportType: function () {
		this.setData({
			choose: 2
		})
	},
	selReport: function (e) {
		var index = e.currentTarget.dataset.index
		var indexs = index
		var reType = this.data.report[index].w
		this.setData({
			indexs: indexs,
			choose: 1,
			reType: reType
		})
		console.log(e)
	},
	back: function () {
		this.setData({
			choose: 1
		})
	},
	getText: function (e) {
		this.setData({
			text: e.detail.value
		})
	},
  cha: function (e) {
    var dele = e.currentTarget.dataset.dele;
    var upload = this.data.upload
    upload.splice(dele, 1)
    this.setData({
      upload: upload,
    })
  },
  comfir: util.throttle(function () {
		var that = this
		var shopId = that.data.shopId
		var upload = that.data.upload
		var reType = that.data.reType
		var text = that.data.text
		var length = upload.length
		var q = 0
    if (text===''){
     wx.showToast({
       title: '请填写举报信息',
       icon: 'none',
       duration: 1500,
     })
      return false
    }
		if (length == 0) {
			wx.showModal({
				title: '提示',
				content: '请上传图片',
				showCancel: false
			})
			return false
		}
		if (reType == '选择举报类型') {
			wx.showModal({
				title: '提示',
				content: '请选择举报类型',
				showCancel: false
			})
			return false
		}
    var f = {};//----------------------------  后缀名
    for (var p in upload) {
      var filename = upload[p];
      var index1 = filename.lastIndexOf(".");
      var index2 = filename.length;
      f[p] = filename.substring(index1, index2);//后缀名  
    }
    var q = JSON.stringify(f)
    var timestamp = (Date.parse(new Date())) / 1000
    var sign = MD5Util.sign(timestamp)
		wx.request({
			url: 'https://www.aftdc.com/wxapp/Shop/shopReport',
			data:
			{
				shopId: shopId,
				reType: reType,
				text: text,
        q:q,
        sign: sign,
        timestamp: timestamp,
        token: wx.getStorageSync('usersInfo').token,
			},
			method: 'POST',
			header: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			success: function (res) {
				if(res.data.res==0){
          wx:wx.showToast({
            title: res.data.info,
            icon: 'none',
            duration: 1500,
          })
        
					return false
				}
				if (res.data.res == 1) {
          var q = 0;
          var img_file_arr = [];
          if (upload.length > 0) {
            //上传图片
            for (var i in upload) {
              var img = res.data.oss.dir + res.data.name[i];
              img_file_arr.push(img);
              wx.uploadFile({
                url: res.data.oss.host,
                filePath: upload[i],
                name: 'file',
                formData: {
                  "key": res.data.oss.dir + res.data.name[i],//图片的路径
                  "policy": res.data.oss.policy,
                  "OSSAccessKeyId": res.data.oss.accessid,
                  'success_action_status': '200',
                  'signature': res.data.oss.signature
                },
                header: { "Content-Type": "multipart/form-data" },
                success: function (ress) {
                  if (ress.statusCode == 200) {

                  }
                }
              })
            }

            //检测并把图片更新到数据库
            var timestamp = (Date.parse(new Date())) / 1000
            var sign = MD5Util.sign(timestamp)
            wx.request({
              url: 'https://www.aftdc.com/wxapp/Score/imgFilter',
              method: 'POST',
              data: {
                id: res.data.id,
                file: JSON.stringify(img_file_arr),
                sign: sign,
                timestamp: timestamp,
                token: wx.getStorageSync('usersInfo').token
              },
              success: function (b) {
                if (b.data.conclusion == '不合规') {
                  wx.showModal({
                    title: '提示',
                    content: '图片内容违规',
                    showCancel: false,
                    success: function (s) {

                    }
                  })
                  return false
                } else {
                  var timestamp = (Date.parse(new Date())) / 1000
                  var sign = MD5Util.sign(timestamp)
                  wx.request({
                    url: 'https://www.aftdc.com/wxapp/Shop/reImg',
                    method: 'POST',
                    data: {
                      id: res.data.id,
                      file: JSON.stringify(img_file_arr),
                      sign: sign,
                      timestamp: timestamp,
                      token: wx.getStorageSync('usersInfo').token
                    },
                    success: function (b) {
                      if (b.data.res == 1) {
                        q++
                        if (q == length) {
                          wx.showModal({
                            title: '提示',
                            content: '提交成功',
                            showCancel: false,
                            success: function () {
                              wx.navigateBack()
                            }
                          })
                        }
                      }
                    }
                  })
                }
              }
            })
          }
				}
			}
		})
	})
})