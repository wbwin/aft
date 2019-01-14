var MD5Util = require('../../../../utils/md5.js');
var QRCode = require('../../../../utils/weapp-qrcode.js')
var app = getApp();
var qrcode = ''
var Inverval = ''
Page({

    data: {
        erweima: ''
    },

    onLoad: function (options) {

        var str = 0;
        str = str.toString()
        var codeNum = str.replace(/(\d{4})/g, '$1 ').replace(/\s*$/, '');
        this.setData({
            codeNum: codeNum,
        })
        var that = this
        var orderId = options.orderId
        var shopId = options.shopid
        var location = app.globalData.location
        var timestamp = (Date.parse(new Date())) / 1000
        var sign = MD5Util.sign(timestamp)
        wx.request({
            url: 'https://www.aftdc.com/wxapp/Grouporder/tgOrderDetail',
            data:
                {
                    orderId: orderId,
                    shopId: shopId,
                    lng: location.longitude,
                    lat: location.latitude,
                    sign: sign,
                    timestamp: timestamp,
                    token: wx.getStorageSync('usersInfo').token,
                    // orderId: 799,
                    // shopId: 1020454,
                    // lng: 113.27324,
                    // lat: 23.15792,
                    // sign: '833CBAADF890E29D9611E519FC2B5A72',
                    // timestamp: '1536289183',
                    // token: '$2y$10$glD6mwg/wT1JbA/JMZbMN.zVyjXqNpcfafvZqnL2B9lrbCw8oq002',
                },
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            success: function (res) {
                if(res.data.res ==1){
                    //距离单位换算
                    if (parseFloat(res.data.data.shop.distance) > 0 && parseFloat(res.data.data.shop.distance) < 1000) {
                        var value = res.data.data.shop.distance + 'm'
                    } else if (parseFloat(res.data.data.shop.distance) == 0) {
                        var value = '1m'
                    } else {
                        var value = parseFloat(res.data.data.shop.distance / 1000).toFixed(1) + 'km'
                    }
                    res.data.data.shop.distance = value

                    that.setData({
                        shop: res.data.data.shop,
                        group: res.data.data.group,
                    })
                }
                // that.setData({
                // 	res: res.data,
                // 	code: res.data.groupon.code,
                // 	lat: res.data.shop.latitude,
                // 	lng: res.data.shop.longitude,
                // 	img: res.data.groupon.Imgurl
                // })

                // // var timestamp = (Date.parse(new Date())) / 1000
                // // var sign = MD5Util.sign(timestamp)
                //         // var arr = { code: that.data.code, sign: sign, token: wx.getStorageSync('usersInfo').token, timestamp: timestamp}
                // var t = JSON.stringify(arr)
                qrcode = new QRCode('canvas', {
                    text: res.data.data.group.code,
                    width: 150,
                    height: 150,
                    colorDark: "#000000",
                    colorLight: "#ffffff",
                    correctLevel: QRCode.CorrectLevel.H,
                });

                // Inverval = setInterval(function () {
                // 	var timestamp = (Date.parse(new Date())) / 1000
                // 	var sign = MD5Util.sign(timestamp)
                // 	var arr = { code: that.data.code, sign: sign, token: wx.getStorageSync('usersInfo').token, timestamp: timestamp }
                // 	var t = JSON.stringify(arr)
                // 	that.confirmHandler(t)
                // }, 50000)

                // var str = that.data.code
                // str = str.toString()
                // var codeNum = str.replace(/(\d{4})/g, '$1 ').replace(/\s*$/, '');
                // that.setData({
                // 	codeNum: codeNum,
                // })
                wx.setStorageSync('orderType', '4')
                if(that.data.group.type == 1){
                    wx.setStorageSync('shopType', '21')
                }else {
                    wx.setStorageSync('shopType', '26')
                }
              that.setData({
                animationLoading: true,//加载图
              })
            }
        })

    },

    confirmHandler: function (e) {
        var value = e
        qrcode.makeCode(value)
    },

    onUnload: function () {
        clearInterval(Inverval)
    },

    call: function () {
        var that = this
        var phone = this.data.shop.shopTel
        wx.makePhoneCall({
            phoneNumber: phone  //仅为示例，并非真实的电话号码
        })
    },
    address: function () {
        var latitude = Number(this.data.shop.latitude)
        var longitude = Number(this.data.shop.longitude)
        wx.openLocation({
            latitude: latitude,
            longitude: longitude,
            fail: function (err) {
            }
        })
    }
})