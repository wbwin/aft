var app=getApp()
var MD5Util = require('../../../../utils/md5.js');
var util = require('../../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    upload:[],
    uploadsrc:[],
    getText:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var shopId = options.shopId
    var orderId=options.orderId
    this.setData({
      shopId: shopId,
      orderId: orderId
    })
  },
  uploadimage: function (e) {
    var upload = this.data.upload
    var that = this
    wx.chooseImage({
      count: 4,
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        for (var i in tempFilePaths) {
          upload.push(tempFilePaths[i])
        }

        if (upload.length > 4) {
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

  getText: function (e) {
    var getText = e.detail.value
    this.setData({
      getText: getText
    })
    console.log(getText)
  },
  add: util.throttle(function () {
   
    var that = this
    var q=0
    var getText = that.data.getText
    var upload = that.data.upload
    var timestamp = (Date.parse(new Date())) / 1000
    var sign = MD5Util.sign(timestamp)
    if (!getText) {
      util.aftModal({
        title: '请填写理由',
        icon: 'loading'
      })
      return false
    }
		if (!upload) {
			util.aftModal({
				title: '请上传图片',
				icon: 'loading'
			})
			return false
		}
    wx.request({
      url: 'https://www.aftdc.com/wxapp/Order/drawback',
      data: {
        getText: getText,
        userId:wx.getStorageSync('usersInfo').userId,
        shopId: that.data.shopId,
        orderId: that.data.orderId,
        sign: sign,
        timestamp: timestamp,
        token: wx.getStorageSync('usersInfo').token,
      },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'POST',
      success: function (res) {
      
          if (upload.length > 0) {
            for (var i in upload) {
              var timestamp = (Date.parse(new Date())) / 1000
              var sign = MD5Util.sign(timestamp)
              wx.uploadFile({
                url: 'https://www.aftdc.com/wxapp/Order/drawbackImg',
                filePath: upload[i],
                name: 'file',
                formData: {
                  "Content-Type": "multipart/form-data",
                  "id": res.data,
                  "sign": sign,
                  "timestamp": timestamp,
                  "token": wx.getStorageSync('usersInfo').token,
                },
                header: { "Content-Type": "multipart/form-data" },
                success: function (ress) {
                  q++
                  if (ress.data == '1') {
                    console.log(6)
                    if (q == upload.length) {
                      util.aftModal({
                        title: '提交成功',
                        icon: 'success',
                        duration: 2000,
                        success: setTimeout(function () {
                         
                          wx.switchTab({
                            url: "/page/tabBar/purchase/index"
                          })
                        }, 2000)
                      })
                    }
                  }
                  else
                  {
                    util.aftModal({
                      title: '提交失败',
                      icon: 'loading',
                      duration: 2000,
                    })
                  } 
                },
                fail: function (res) {
                }
              })
            }
          }
          else {
            if(res.data>0)
              util.aftModal({
                title: '提交成功',
                icon: '12',
                duration: success,
                success: setTimeout(function () {

                  wx.switchTab({
                    url: "/page/tabBar/purchase/index"
                  })
                }, 2000)
              })
          }       
      }
    })
  }),
  
})