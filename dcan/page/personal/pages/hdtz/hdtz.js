var MD5Util = require('../../../../utils/md5.js')
var app = getApp();

Page({
  data: {
    arr: [],
    page: 0,
    nothing: true,//判断上拉是否继续加载数据
  },

  onLoad: function (options) {
    this.getMessage();
  },

  /* 上拉加载 */
  onReachBottom: function () {
    if (this.data.nothing) {
      this.setData({
        more: true
      })
      wx.showNavigationBarLoading();
      this.getMessage();
    }
  },

  /* 获取信息详情 */
  getMessage: function () {
    var that = this;
    var userId = wx.getStorageSync('usersInfo').userId;
    var page = that.data.page;
    var timestamp = (Date.parse(new Date())) / 1000;
    var sign = MD5Util.sign(timestamp);
    var token = wx.getStorageSync('usersInfo').token;
    wx.request({
      url: 'https://www.aftdc.com/wxapp/Message/getMessage',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        timestamp: timestamp,
        sign: sign,
        token: token,
        type: 8,
        page: page,
      },
      method: "POST",
      success: function (res) {
        wx.hideNavigationBarLoading();
        if (res.data.res == 1) {
          that.data.arr = that.data.arr.concat(res.data.data);
          if (res.data.page < 15) var nothing = false;
          else var nothing = true;
          that.data.page += res.data.page;
          that.setData({
            arr: that.data.arr,
            nothing: nothing,
            more: false,
          })
        } else {
          that.setData({
            nothing: false,
            more: false,
          })
        }
      }
    })
  }
})