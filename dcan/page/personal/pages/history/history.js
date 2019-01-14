// pages/personal/history/history.js
var MD5Util = require('../../../../utils/md5.js');
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userId: '',
        list: '',
        shops: true,
        longitude: '',
        latitude: '',
    },

    onReady: function () {
        var userId = wx.getStorageSync('usersInfo').userId
        var that = this
        var latitude = app.globalData.location.latitude
        var longitude = app.globalData.location.longitude
        var timestamp = (Date.parse(new Date())) / 1000
        var sign = MD5Util.sign(timestamp)
        this.setData({
            userId: userId,
            latitude: latitude,
            longitude: longitude
        })
        wx.request({
            url: 'https://www.aftdc.com/wxapp/Mine/getHistory',
            data: {
                latitude: latitude,
                longitude: longitude,
                sign: sign,
                timestamp: timestamp,
                token: wx.getStorageSync('usersInfo').token,
            },
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST",
            success: function (res) {
                that.setData({ list: res.data });
            }
        })
    },

    gator: function (e) {
        //1外卖 2堂食 3到店 4免配送 21团购 26代金券 28砍价 27秒杀
        var shopId = e.currentTarget.dataset.shopid;
        var distance = e.currentTarget.dataset.distance;
        var shopType = this.data.shopType
        wx.setStorageSync('shopType', shopType)
        if (shopType == 2) {
            var shopName = e.currentTarget.dataset.shopname
            wx.navigateTo({
              url: '../../../homePage/pages/desk/desk?shopId=' + shopId + '&shopName=' + shopName,
            })
            return false
        } else if (shopType == 21 || shopType == 26) {
            wx.navigateTo({
              url: '../../../homePage/pages/introduce/introduce?shopId=' + shopId + '&distance=' + distance,
            })
        } else {
            wx.navigateTo({
              url: '../../../homePage/pages/order/order?shopId=' + shopId,
            })
        }
    },
    del: function (e) {
        var shopId = e.currentTarget.dataset.shopid;
        var index = e.currentTarget.dataset.index
        var that = this
        wx.showModal({
            title: '提示',
            content: '删除该历史纪录',
            success: function () {
                if (res.confirm) {
                    var timestamp = (Date.parse(new Date())) / 1000
                    var sign = MD5Util.sign(timestamp)
                    wx.request({
                        url: 'https://www.aftdc.com/wxapp/Mine/delHistory',
                        data: {
                            sign: sign,
                            timestamp: timestamp,
                            token: wx.getStorageSync('usersInfo').token,
                            shopId: shopId
                        },
                        header: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        method: "POST",
                        success: function (res) {
                            if (res.data.res) {
                                that.data.list.splice(index, 1)
                                that.setData({ list: that.data.list });
                            }
                        }
                    })
                }
            }
        })
    }
})