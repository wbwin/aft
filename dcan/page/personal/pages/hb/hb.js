var util = require('../../../../utils/util.js')
var MD5Util = require('../../../../utils/md5.js');
var app = getApp();
Page({
  data: {
    pageTab: {
      curHdIndex: 4,
      curBdIndex: 4,
    },
    more: false,
    plScrolltolower: false,
    isLate:[],
    isUse:[],
    waitUse:[],
    Unclaimed:[],
    isLatePage:0,
    isUesPage:0,
    waitUsePage:0,
    unclaimedPage:0,
    toView:'',
  },
  onLoad: function (options) {
    var that = this;
    // that.onReachBottom()
    var timestamp = (Date.parse(new Date())) / 1000
    var sign = MD5Util.sign(timestamp)
    wx.request({
      url: 'https://www.aftdc.com/wxapp/Asset/hongbao',
      data: {
        sign: sign,
        timestamp: timestamp,
        token: wx.getStorageSync('usersInfo').token,
        latitude: app.globalData.location.latitude,
        longitude: app.globalData.location.longitude,
        // page:0,
      },
      method: 'post',
      header: { 'Content-Type': 'application/json' },
      success: function (res) {
        console.log(res)
        if(res.data.res==1){
          that.setData({
            isLate: res.data.isLate,//已过期
            isUse: res.data.isUse,//已使用
            waitUse: res.data.waitUse,  //待使用
            Unclaimed: res.data.Unclaimed,
            isLatePage: res.data.isLate.length,
            isUsePage: res.data.isUse.length,
            waitUsePage: res.data.waitUse.length,
            unclaimedPage: res.data.Unclaimed.length,
          })
        }
        that.setData({
          animationLoading: true,//加载图
        }) 
      },

    })
  },
  //点击导航
  pageHdtap: function (e) {
    var that=this
    //点击子元素
    var _datasetId = e.target.dataset.id;
    console.log(_datasetId)
    var _leftObj = {};
    _leftObj.curHdIndex = _datasetId;
    _leftObj.curBdIndex = _datasetId;
    this.setData({
      pageTab: _leftObj,
      plScrolltolower:false,
      toView: 'scrollView0'
      // isLate: [],
      // isUse: [],
      // waitUse: [],
      // Unclaimed: [],
      // isLatePage: 0,
      // isUesPage: 0,
      // waitUsePage: 0,
      // unclaimedPage: 0,
    })
    // that.onReachBottom()
  },
  addCou: function (e) {
    var that = this
    var id = e.currentTarget.dataset.id
    var shopId = e.currentTarget.dataset.shopid
    var userId = wx.getStorageSync('usersInfo').userId
    var index = e.currentTarget.dataset.index
    var Unclaimed = that.data.Unclaimed
    var timestamp = (Date.parse(new Date())) / 1000
    var sign = MD5Util.sign(timestamp)
    wx.request({
      url: 'https://www.aftdc.com/wxapp/Shop/hongbao',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        hongbaoId: id,
        userId: userId,
        shopId: shopId,
        sign: sign,
        timestamp: timestamp,
        token: wx.getStorageSync('usersInfo').token,
      },
      method: "POST",
      success: function (res) {
        if (res.data.res == 1) {
          util.aftModal({
            title: '领取成功',
            icon: 'success',
            duration: 1500,
            success: function (res) {
              /* Unclaimed[index]['isUse']=1;
               that.setData({
                 Unclaimed: Unclaimed
               })*/
              that.onLoad();
            },

          })
        }
      }
    })
  },
  goto: util.throttle(function (e) {
    var shopId = e.currentTarget.dataset.shopid
    wx.navigateTo({
      url: '../../../homePage/pages/order/order?shopId=' + shopId,
    })
  }),
  /*上拉加载*/
  onReachBottom: function () {
    var that = this;
    if (!this.data.plScrolltolower) {
      this.setData({
        more: true
      })
      wx.showNavigationBarLoading()
      var pageTab = that.data.pageTab
      var timestamp = (Date.parse(new Date())) / 1000
      var sign = MD5Util.sign(timestamp)
      if (pageTab.curHdIndex==0){
        var url ='https://www.aftdc.com/wxapp/Asset/waitUsehongbao'
        var data = {
          sign: sign,
          timestamp: timestamp,
          token: wx.getStorageSync('usersInfo').token,
          page: that.data.waitUsePage,
          }
      } else if (pageTab.curHdIndex == 1){
        var url = 'https://www.aftdc.com/wxapp/Asset/isLatehongbao'
        var data = {
          sign: sign,
          timestamp: timestamp,
          token: wx.getStorageSync('usersInfo').token,
          page: that.data.isLatePage,
        }
      } else if (pageTab.curHdIndex == 2) {
        var url = 'https://www.aftdc.com/wxapp/Asset/isUserhongbao'
        var data = {
          sign: sign,
          timestamp: timestamp,
          token: wx.getStorageSync('usersInfo').token,
          page: that.data.isUesPage,
        }
      } else if (pageTab.curHdIndex == 4){
        var url = 'https://www.aftdc.com/wxapp/Asset/unclaimedHongbao'
        var data = {
          sign: sign,
          timestamp: timestamp,
          token: wx.getStorageSync('usersInfo').token,
          page: that.data.unclaimedPage,
          latitude: app.globalData.location.latitude,
        longitude: app.globalData.location.longitude,
        }
      }
      wx.request({
        url: url,
        data: data,
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        success: function (res) {
          wx.hideNavigationBarLoading()
          if (res.data.res == 1) {
            var hongbao = res.data.hongbao
            if (pageTab.curHdIndex == 0) {
              that.setData({
                waitUse: that.data.waitUse.concat(hongbao),
                waitUsePage: that.data.waitUse.concat(hongbao).length,
                more: false
              })
            } else if (pageTab.curHdIndex == 1) {
              that.setData({
                isLate: that.data.isLate.concat(hongbao),
                isLatePage: that.data.isLate.concat(hongbao).length,
                more: false
              })
            } else if (pageTab.curHdIndex == 2) {
              that.setData({
                isUse: that.data.isUse.concat(hongbao),
                isUsePage: that.data.isUse.concat(hongbao).length,
                more: false
              })
            } else if (pageTab.curHdIndex == 4) {
              that.setData({
                Unclaimed: that.data.Unclaimed.concat(hongbao),
                unclaimedPage: that.data.Unclaimed.concat(hongbao).length,
                more: false
              })
            }
            

          } else {
            that.setData({
              more: false,
              plScrolltolower: true
            })
            var hobbyTip = that.data.hobbyTip
            if(res.data.info){
              that.setData({
                hobbyTip: true,
                hobbyTips: res.data.info
              })
            }
            if (hobbyTip) {
              return false
            } else {
              var times = setTimeout(function () {
                that.setData({
                  hobbyTip: false,
                  timeout: true
                })
              },2000)
            }
            
          }
          // if (pageTab.curHdIndex == 0) {
          //   if (that.data.waitUsePage==0){
          //     that.setData({
          //       plScrolltolower:false
          //     })
          //   }
          // } else if (pageTab.curHdIndex == 1) {
          //   if (that.data.isLatePage == 0) {
          //     that.setData({
          //       plScrolltolower: false
          //     })
          //   }
          // } else if (pageTab.curHdIndex == 2) {
          //   if (that.data.isUesPage == 0) {
          //     that.setData({
          //       plScrolltolower: false
          //     })
          //   }
          // } else if (pageTab.curHdIndex == 4) {
          //   if (that.data.unclaimedPage == 0) {
          //     that.setData({
          //       plScrolltolower: false
          //     })
          //   }
          // }
        }
      })
    }
  },
})