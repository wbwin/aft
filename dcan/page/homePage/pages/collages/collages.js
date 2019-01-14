
var app = getApp()
var MD5Util = require('../../../../utils/md5.js');
var util = require('../../../../utils/util.js');
// var MD5Util = require('../../../utils/md5.js');
// var util = require('../../../utils/util.js');
Page({

  data: {
    unfolded: false, 
    // popup: false, 
    show: false,
    change: false,
    shareStatus: 0,
    collageStateText: '订单已锁定，无法修改商品',
    locking: false
  },
  onLoad(options) {
    var shareId = options.shareId
    var shopId = options.shopId
    this.setData({
      shareId: shareId,
      shopId: shopId
    })    
    this.getData()
  },
  onUnload() {
    this.changeGoods()
  },
  // 下拉刷新
  onPullDownRefresh() {
    wx.stopPullDownRefresh()
    this.getData()
  },
  // 进入页面与下拉刷新请求数据并判断拼单状态
  getData() {
    var that = this
    var timestamp = (Date.parse(new Date())) / 1000
    var sign = MD5Util.sign(timestamp)
    wx.request({
      url: 'https://www.aftdc.com/wxapp/Desk/getAllShareGoods',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        sign: sign,
        timestamp: timestamp,
        token: wx.getStorageSync('usersInfo').token,
        shareId: that.data.shareId,
        shopId: that.data.shopId,
        // shareId: 15395742036,
        // shopId: 1020454
      },
      method: "POST",
      success: function (res) {
        if (res.data.res === 1) {
          that.setData({
            discountedPrice: res.data.discountedPrice,
            goodsInfo: res.data.goodsInfo,
            shopInfo: res.data.shopInfo,
            shareStatus: res.data.shareStatus,
            total: res.data.total,
          })
          var pages = getCurrentPages();
          var prevPage = pages[pages.length - 2];  //上一个页面
          //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
          prevPage.setData({
            changeCollage: 1,
            shareGoodsInfo: res.data.goodsInfo[0].goodsInfo
          })
          if (res.data.collagesStatus) {
            that.setData({ locking: true})
          }else {
            that.setData({ locking: false})
          }
        }else if(res.data.res === 0) {
          if (res.data.collagesStatus) {
            var pages = getCurrentPages();
            var prevPage = pages[pages.length - 2];
            prevPage.setData({
              changeCollage: 1
            })
            setTimeout(function () {
              wx.showToast({
                title: '当前拼单已关闭',
                icon: 'none',
                duration: 1500,
              })
            }, 500)
            setTimeout(function () {
              wx.navigateBack()
            }, 2500)
          }
        }
        that.setData({
          animationLoading: true, //加载图
        })
      }
    })
  },
  // 展开更多与点击收起
  open() {
    this.setData({
      unfolded: !this.data.unfolded
    })
  },
  // 显示退出拼单弹层
  openPopup() {
    this.setData({
      show: true
    })
  },
  // 关闭退出拼单弹层
  wxClosePopup() {
    this.setData({
      show: false
    })
  },
  // 退出拼单弹层点击确定
  wxQuitCollage() {
    var that = this
    var timestamp = (Date.parse(new Date())) / 1000
    var sign = MD5Util.sign(timestamp)
    wx.request({
      url: 'https://www.aftdc.com/wxapp/Desk/outShare',
      data: {
        sign: sign,
        timestamp: timestamp,
        token: wx.getStorageSync('usersInfo').token,
        shareId: that.data.shareId
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'post',
      success: function (res) {
        if (res.data.res === 1) {
          var pages = getCurrentPages();
          var prevPage = pages[pages.length - 2];  //上一个页面
          //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
          prevPage.setData({
            changeCollage: 2
          })
          wx.navigateBack()
        }else if(res.data.res === 0){
          if (res.data.collagesStatus === 1){
            wx.showToast({
              title: res.data.info,
              icon: 'none',
              duration: 1500,
            })
          }else {
            var pages = getCurrentPages();
            var prevPage = pages[pages.length - 2];
            prevPage.setData({
              changeCollage: 1
            })
            wx.navigateBack()
          }
        }
      }
    })
    this.setData({
      show: false
    })
  },
  // 修改商品按钮
  changeGoods() {
    var that = this
    var timestamp = (Date.parse(new Date())) / 1000
    var sign = MD5Util.sign(timestamp)
    wx.request({
      url: 'https://www.aftdc.com/wxapp/Desk/checkGoodsStatus',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        sign: sign,
        timestamp: timestamp,
        token: wx.getStorageSync('usersInfo').token,
        shareId: that.data.shareId
      },
      method: "POST",
      success: function (res) {
        if (res.data.res === 1) {
          wx.navigateBack()
        }else if (res.data.res === 0) {
          that.setData({
            collageStateText: res.data.info,
            collagesStatus: res.data.collagesStatus,
            change: true
          })
        }
      }
    })
  },
  // 修改商品弹层点击确定按钮
  good() {
    this.setData({
      change: false
    })
    if (this.data.collagesStatus === -1) {
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2];
      prevPage.setData({
        changeCollage: 1
      })
      setTimeout(function () {
        wx.showToast({
          title: '当前拼单已关闭',
          icon: 'none',
          duration: 1500,
        })
      }, 500)
      setTimeout(function () {
        wx.navigateBack()
      }, 2500)
    }else if (this.data.collagesStatus === 1) {
      this.setData({ locking: true })
    }
  },
})