var MD5Util = require('../../../../utils/md5.js')
var util = require('../../../../utils/util.js')
var app = getApp();

Page({
    data: {
        noData:false
    },
    onLoad() {
        var timestamp = (Date.parse(new Date())) / 1000
        var sign = MD5Util.sign(timestamp)
        var that = this
        wx.request({
            url: 'https://www.aftdc.com/wxapp/Asset/membership',
            data: {
                sign: sign,
                timestamp: timestamp,
                token: wx.getStorageSync('usersInfo').token
            },
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST",
            success: function (res) {
                if (res.data.res==1)
                    that.setData({ memberCard: res.data.data })
                else {
                    that.setData({ noData: '暂无会员卡' })
                }
            }
        })
    },
    //去店铺
  toShop: util.throttle(function (e) {
        var shopId = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../../../homePage/pages/order/order?shopId='+shopId,
        })
    }),

    // 显示积分规则
    toRule(e){
        var ruleIndex=e.currentTarget.dataset.index;
        var ruleText = this.data.memberCard[ruleIndex].jf
        wx.showModal({
            title: '积分规则',
            content: ruleText,
            showCancel:false,
        })
    },
})