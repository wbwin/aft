var app = getApp()
var util = require('../../../../utils/util.js')
var MD5Util = require('../../../../utils/md5.js');
Page({

  data: {
    searchGoodsList: '',
    searchShopList: '',
    searchw: '',
    nothing: true,
    longitude: 0,
    latitude: 0,
    params: {},
    searchList: 0,
    recorderManager: "",
    tempFilePath: '',
    voice: 0
  },

  gator: function(e) {
    //1外卖 2堂食 3到店 4免配送 21团购 26代金券
    var shopId = e.currentTarget.dataset.shopid;
    var distance = e.currentTarget.dataset.distance;
    var shopType = this.data.params.shopType;
    // wx.setStorageSync('shopType', shopType)
    //  if (shopType == 5 || shopType == 21 || shopType == 26 || shopType == 6) {
    // 	wx.navigateTo({
    // 		url: '../introduce/introduce?shopId=' + shopId + '&distance=' + distance,
    // 	})
    // } else {
    wx.navigateTo({
      url: '../order/order?shopId=' + shopId,
    })
    // }
  },

  onLoad: function(options) {
    var that = this
    that.data.params = JSON.parse(options.current)
    console.log(that.data.params)
    // var timestamp = (Date.parse(new Date())) / 1000
    // var sign = MD5Util.sign(timestamp)
    wx.request({
      url: 'https://www.aftdc.com/wxapp/Search/hot',
      data: {
        // sign: sign,
        // timestamp: timestamp,
        // token: wx.getStorageSync('usersInfo').token,
        userId:wx.getStorageSync('usersInfo').userId,
        longitude: app.globalData.location.longitude,
        latitude: app.globalData.location.latitude,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: function(res) {
        that.setData({
          searchHot: res.data.hot,
          searchHistory: res.data.history,
          nearShop: res.data.shop,
          search: true,
        })
      }
    })
  },
  //弹出活动标签
  project: function(e) {
    var index = e.currentTarget.dataset.index;
    var shops = this.data.shops
    var projectLay = shops[index].projectLay
    if (Boolean(projectLay)) {
      shops[index].projectNum = projectLay
      shops[index].projectLay = false
    } else {
      shops[index].projectLay = shops[index].projectNum
      shops[index].projectNum = 100
    }
    this.setData({
      shops: shops,
    })
  },
  //删除历史
  delhistory: function(e) {
    var that = this
    var del = e.target.dataset.name;
    var name = that.data.searchHistory;
    var userId = wx.getStorageSync('usersInfo').userId;
    for (var i = 0; i < name.length; i++) {
      if (name[i] == del) {
        name.splice(i,1);
        var timestamp = (Date.parse(new Date())) / 1000
        var sign = MD5Util.sign(timestamp)
        wx.request({
          url: 'https://www.aftdc.com/wxapp/Search/del_record',
          data: {
            sign: sign,
            timestamp: timestamp,
            token: wx.getStorageSync('usersInfo').token,searchTerm: del, userId: userId},
            method:'post',
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            success:function(e){
            console.log(e)
          }
        })
      }
    }
    that.setData({
      searchHistory: name,
      // search: true,
    })
  },

  // 搜索商品
  getSearchw: function(e) {
    console.log(1)
    var that = this
    var longitude = 0
    var latitude = 0
    if ((e.detail.value !== undefined) || (e.target.dataset.name !== undefined)) {

      if (e.detail.value !== undefined) {
        this.setData({
          searchw: e.detail.value,
          nothing: true
        })

        if (e.detail.value.length == 0) {
          this.setData({
            searchList: false
          })
        } else {
          that.setData({
            searchList: true
          })
        }
      }

      if (e.target.dataset.name !== undefined) {
        this.setData({
          searchw: e.target.dataset.name,
          nothing: true,
          searchList: true
        })
      }
      // var timestamp = (Date.parse(new Date())) / 1000
      // var sign = MD5Util.sign(timestamp)
      if (app.globalData.usersInfo)
        var userId = wx.getStorageSync('usersInfo').userId
      else
        var userId = 0
      wx.request({
        url: 'https://www.aftdc.com/wxapp/Search/getSearchw',
        data: {
          // sign: sign,
          // timestamp: timestamp,
          // token: wx.getStorageSync('usersInfo').token,
          userId: userId,
          search: that.data.searchw,
          longitude: app.globalData.location.longitude,
          latitude: app.globalData.location.latitude,
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        success: function(res) {
         
            var shops = res.data.shop
            for (var i in shops) { //单位换算
              if (parseFloat(shops[i].distance) > 0 && parseFloat(shops[i].distance) < 1000) {
                shops[i].distance = shops[i].distance + 'm'
              } else if (parseFloat(shops[i].distance) == 0) {
                shops[i].distance = '1m'
              } else {
                shops[i].distance = parseFloat(shops[i].distance / 1000).toFixed(1) + 'km'
              }
            }
            that.setData({
              searchShopList: shops,
              shops: [],
              searchGoodsList: res.data.goods,
              nothing:true,
            })
          if(res.data.res==0){
            that.setData({
              nothing: false,
            })
          }         
        }
      })

    }
  },

  commentGet: function() {
    var conditionArr = JSON.stringify(this.data.params.conditionArr)
    var that = this
    var timestamp = (Date.parse(new Date())) / 1000
    var sign = MD5Util.sign(timestamp)
    wx.request({
      url: 'https://www.aftdc.com/wxapp/index/getShops',
      data: {
        sign: sign,
        timestamp: timestamp,
        token: wx.getStorageSync('usersInfo').token,
        userId:wx.getStorageSync('usersInfo').userId,
        longitude: app.globalData.location.longitude,
        latitude: app.globalData.location.latitude,
        page: 0,
        city: that.data.params.city,
        conditionArr: conditionArr
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: function(res) {
        wx.hideNavigationBarLoading()
        if (res.data) {
          var shops = res.data.shops
          if (res.data.openCity == 0) {
            that.setData({
              shops: false,
              nothing: false
            })
          }
          for (var i in res.data.shops) {
            var ress = res.data.shops[i].serviceEndTime - res.data.shops[i].serviceStartTime
            if (ress < 0) {
              res.data.shops[i].shopAtive = 0
            }
          }
          res.data.shops.sort(function(a, b) {
            return parseInt(b.shopAtive) - parseInt(a.shopAtive);
          });
          that.setData({
            shops: shops,
            page: res.data.length,
            nothing: true,
            arr: ''
          })
        } else {
          that.setData({
            shops: false
          })
        }
      }
    })
  },

  sou: function() {
    wx.showNavigationBarLoading()
    var searchw = this.data.searchw
    var searchw = {
      'searchw': searchw
    }
    this.data.params.conditionArr[3] = searchw
    this.setData({
      shops: ""
    })
    this.commentGet()
    this.setData({
      search: false,
      searchShopList: "",
      searchGoodsList: "",
      searchw: '',
    })
  },
  //历史搜索
  history: function(e) {
    var searchw = e.currentTarget.dataset.name
    var index = e.currentTarget.dataset.index;
    var searchHistory = this.data.searchHistory
    var val = searchHistory[index].name
    searchHistory.splice(index, 1)
    this.setData({
      searchHistory: searchHistory,
      searchw: searchw
    })
    this.sou()
  },
  //热门搜索
  hot: function(e) {
    var val = e.currentTarget.dataset.text;
    var searchHistory = this.data.params.searchHistory
    for (var i in searchHistory) {
      if (searchHistory[i].name == val) {
        searchHistory.splice(i, 1)
      }
    }
    this.setData({
      searchHistory: searchHistory,
      searchw: val
    })
    this.sou()
  },
  //开始录音
  // starRecord: function () {
  // 	var recorderManager = wx.getRecorderManager()
  // 	this.setData({ recorderManager: recorderManager })
  // 	this.setData({ voice: 1 })
  // 	var that = this

  // 	recorderManager.onStart(() => {
  // 		console.log('recorder start')
  // 	})
  // 	recorderManager.onResume(() => {
  // 		console.log('recorder resume')
  // 	})
  // 	recorderManager.onPause(() => {
  // 		console.log('recorder pause')
  // 	})
  // 	recorderManager.onStop((res) => {
  // 		that.setData({ tempFilePath: res })

  // 		var innerAudioContext = wx.createInnerAudioContext();
  // 		innerAudioContext.onError((res) => {
  // 			// 播放音频失败的回调
  // 			console.log(res)
  // 		})
  // 		innerAudioContext.src = that.data.tempFilePath.tempFilePath;  // 这里可以是录音的临时路径
  // 		innerAudioContext.play()

  // 		wx.uploadFile({
  // 			url: 'https://www.aftdc.com/index.php/wxapp/index/updimg',
  // 			filePath: that.data.tempFilePath.tempFilePath,
  // 			name: 'file',
  // 			formData: {
  // 				"Content-Type": "multipart/form-data",
  // 			},
  // 			header: { "Content-Type": "multipart/form-data" },
  // 			success: function (ress) {
  // 				console.log('文件上传成功')
  // 				console.log(ress)
  // 			}
  // 		})

  // 	})
  // 	recorderManager.onFrameRecorded((res) => {
  // 		const { frameBuffer } = res
  // 	})

  // 	const options = {
  // 		duration: 10000,
  // 		sampleRate: 8000,
  // 		numberOfChannels: 2,
  // 		encodeBitRate: 16000,
  // 		format: 'mp3',
  // 		frameSize: 50
  // 	}

  // 	recorderManager.start(options)

  // },

  // stopRecord: function () {
  // 	//结束录音  
  // 	var that = this
  // 	this.data.recorderManager.stop()
  // 	this.setData({ voice: 0 })
  // }
})