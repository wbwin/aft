var app = getApp();
var MD5Util = require('../../../../utils/md5.js');
Page({
  data: {
    hidden: true,
    winHeight: "",//窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    onreachBottom: true,
    cur: 0,
  },

  // 滚动切换标签样式
  switchTab: function (e) {
    this.setData({
      currentTab: e.detail.current
    });
  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    var cur = e.target.dataset.current;
    if (this.data.currentTaB == cur) { return false; }
    else {
      this.setData({
        currentTab: cur
      })
      this.cutArticle(1)
    }
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function () {
    if (this.data.currentTab > 4) {
      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },
  //切换文章
  cutArticle: function (cur) {
    if (cur == 0) {//店铺
      var url = 'https://www.aftdc.com/wxapp/Mine/collect_list'
      if (this.data.shop)
        return false
    } else {//文章
      var url = 'https://www.aftdc.com/wxapp/Article/article_collect_list'
      if (this.data.article)
        return false
    }
    var userId = wx.getStorageSync('usersInfo').userId
    var location = app.globalData.location
    var that = this;
    var timestamp = (Date.parse(new Date())) / 1000
    var sign = MD5Util.sign(timestamp)
    wx.request({
      url: url,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        longitude: location.longitude,
        latitude: location.latitude,
        sign: sign,
        timestamp: timestamp,
        token: wx.getStorageSync('usersInfo').token,
      },
      method: "POST",
      success: function (res) {
        if (cur == 0) {//店铺
          var shops = res.data.arr
          that.setData({
            shop: shops
          })
        } else {//文章
          that.setData({
            article: res.data.data
          })
        }
      }
    })
  },

  onLoad: function () {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight
        })
      }
    });
    this.cutArticle(0)
  },
  //取消收藏店铺
  cancelCollect: function (e) {
    wx.showLoading({
      mask: true
    })
    var that = this
    var shopId = e.currentTarget.dataset.shopid
    var userId = wx.getStorageSync('usersInfo').userId
    var timestamp = (Date.parse(new Date())) / 1000
    var sign = MD5Util.sign(timestamp)
    var index = e.target.dataset.index
    wx.request({
      url: 'https://www.aftdc.com/wxapp/Mine/delete_collect',
      data: {
        shopId: shopId,
        sign: sign,
        timestamp: (Date.parse(new Date())) / 1000,
        token: wx.getStorageSync('usersInfo').token,
      },
      method: "POST",
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        if (res.data.res == 1) {

          wx.showToast({
            title: '取消收藏',
          })
          that.data.shop.splice(index, 1)
          that.setData({ shop: that.data.shop })

        }
      }
    })
  },
  //取消收藏文章
  cancelCollectA: function (e) {
    wx.showLoading({
      mask: true
    })
    var that = this
    var index = e.currentTarget.dataset.index
    var article = that.data.article[index]
    var userId = wx.getStorageSync('usersInfo').userId
    var timestamp = (Date.parse(new Date())) / 1000
    var sign = MD5Util.sign(timestamp)
    var index = e.target.dataset.index;
    wx.request({
      url: 'https://www.aftdc.com/wxapp/Article/article_collect',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        article_id: article.id,    //文章的id
        business_id: article.business_id,
        sign: sign,
        timestamp: (Date.parse(new Date())) / 1000,
        token: wx.getStorageSync('usersInfo').token,
        shopId: article.shopId,
        is_collect: 0
      },
      method: "POST",
      success: function (res) {
        if (res.data.res == 1) {
          wx.showToast({
            title: '取消收藏',
          })
          that.data.article.splice(index, 1)
          that.setData({ article: that.data.article })
        }

      }
    })
  }
})