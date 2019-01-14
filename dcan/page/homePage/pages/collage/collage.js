var MD5Util = require('../../../../utils/md5.js');
var util = require('../../../../utils/util.js');
var app = getApp()
Page({

  data: {
    myCollage: {}, //我的商品
    otherCollage: [], //其他拼友的商品
    shopId: '',
    shareId: '',
    userId: '',
    shopInfo: '',
    fullReduction: '',
    onshow: false,
    togetherCollage: false,
    myId: '',
    num: '',
    noCollage: false,
    createImg: '',
    originatorIn:false,
    orderType:'',
    payStatus:'',
    payStatusShow:false,
  },
  onLoad: function(options) {
    this.setData({
      shopId: options.shopId,
      shareId: options.shareId,
      userId:wx.getStorageSync('usersInfo').userId,
      orderType: options.orderType
    })

    var userId = wx.getStorageSync('usersInfo').userId
    if (userId == options.originatorUserId){
      this.setData({
        originatorIn: true,
        
      })
    }
        console.log(app.globalData)
  },
  onReady: function() {
    var that = this
    var timestamp = (Date.parse(new Date())) / 1000
    var sign = MD5Util.sign(timestamp)

    var data = {
      sign: sign,
      timestamp: timestamp,
      token: wx.getStorageSync('usersInfo').token,
      shopId: that.data.shopId,
      shareId: that.data.shareId,
      userId:wx.getStorageSync('usersInfo').userId,
      orderType:that.data.orderType,

    }
    wx.request({
      url: 'https://www.aftdc.com/wxapp/Shop/getShare',
      data: data,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'post',
      success: function(res) {
        console.log(res)
        if (res.data.res == 1) {
          var shopInfo = res.data.shopInfo
          var fullReduction = res.data.fullReduction
          that.setData({
            shopInfo: shopInfo,
            fullReduction: fullReduction,
            num: res.data.num,
            payStatus: res.data.payStatus
          })
          if (res.data.payStatus == 2 || res.data.payStatus == 1){
            this.setData({
              payStatusShow: true,
            })
          }
          var shareOrder = res.data.shareOrder
          for (var i in shareOrder) {
            if (shareOrder[i].identity == '发起') {
              that.setData({
                createImg: shareOrder[i].userPhoto
              })

            }
          }
          for (var i in shareOrder) {
            
            if (shareOrder[i].userId == that.data.userId) {
              that.setData({
                togetherCollage: true,
                myCollage: shareOrder[i],
                myId: shareOrder[i].id,

              })
              shareOrder.splice(i, 1)
              that.setData({
                otherCollage: shareOrder
              })
              return false
            } else {
              that.setData({
                togetherCollage: false
              })
            }
          }
         
          if (wx.getStorageSync('shareData')){
            var shareData = wx.getStorageSync('shareData');
            for (var i in shareData) {
            if (shareData[i].shopId == that.data.shopId){
              shareData[i].shareId = that.data.shareId
              }
            }
          }else{
            var shareData = [];
            var shareData_one = { 'shareId': that.data.shareId, 'shopId': that.data.shopId }
            shareData.push(shareData_one);
          }

          wx.setStorageSync('shareData', shareData)
          
        } else if (res.data.res == 0 || res.data.payStatus==-2) {
          that.setData({
            noCollage: true,
          })
        }

      }
    })
  },
  onShow: function() {
    var userId = wx.getStorageSync('usersInfo').userId
    if (!userId) userId = ''
    if (this.data.onshow && userId) {
      // this.data.shareId = wx.getStorageSync('shareId')
      var shareData = wx.getStorageSync('shareData');
      for (var i in shareData) {
        if (shareData[i]['shopId'] == this.data.shopId) this.data.shareId = shareData[i]['shareId'];
      }
      this.onReady()
    } else {
      this.data.onshow = true
    }
  },
  // 下拉加载
  onPullDownRefresh: function (e) {
    var that=this
    that.onReady()
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },
  //去店铺选购
  addGoods: function(e) {
    var that = this
    if (!that.data.togetherCollage) {
      that.addFriend()
    } else {
      if (myCollage) {
        var shareFood = myCollage.goodsInfo
        wx.setStorageSync('shareFood', shareFood)
      }
      wx.navigateTo({
        url: '../order/order?shopId=' + that.data.shopId + '&id=' + that.data.myId
      })
    }
  },
  addFriend: function() {
    var that = this
    var timestamp = (Date.parse(new Date())) / 1000
    var sign = MD5Util.sign(timestamp)

    var data = {
      sign: sign,
      timestamp: timestamp,
      token: wx.getStorageSync('usersInfo').token,
      shopId: that.data.shopId,
      shareId: that.data.shareId,
      userId:wx.getStorageSync('usersInfo').userId,
      name: wx.getStorageSync('usersInfo').userName,
    }
    wx.request({
      url: 'https://www.aftdc.com/wxapp/Shop/addFriend',
      data: data,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'post',
      success: function(res) {
        console.log(res)
        if (res.data.res == 1) {
          that.setData({
            myId: res.data.id
          })
          wx.navigateTo({
            url: '../order/order?shopId=' + that.data.shopId + '&id=' + res.data.id
          })

        }
      }
    })
  },
  delGoods: function() {
    var that = this
    wx.showModal({
      content: '确定不要继续拼单了么？',
      confirmColor: '#53beb7',
      cancelColor: '#ff4500',
      success: function(res) {
        if (res.confirm) {
          var timestamp = (Date.parse(new Date())) / 1000
          var sign = MD5Util.sign(timestamp)

          var data = {
            sign: sign,
            timestamp: timestamp,
            token: wx.getStorageSync('usersInfo').token,
            delUserId: that.data.myCollage.id
          }
          wx.request({
            url: 'https://www.aftdc.com/wxapp/Shop/delFriend',
            data: data,
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            method: 'post',
            success: function(res) {
              console.log(res)
              if (res.data.res == 1) {
                that.setData({
                  togetherCollage: false
                })
              }
            }
          })
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })

  },
  cancel: function() {},
  getUserInfo: function(e) {},
})