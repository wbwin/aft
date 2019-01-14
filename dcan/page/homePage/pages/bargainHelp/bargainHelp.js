var app = getApp();
var MD5Util = require('../../../../utils/md5.js');
var util = require('../../../../utils/util.js');
Page({
  data: {
    goods:{
      name:'【血腥玛丽亚】恐怖先锋您的至尊选择',
      price:999.99,
      bargainPrice:666.66
    },
    priceDifference:'',
    pricePercent:'',
    model: {},
    bargainSure:false,
    shopId:'',
    bargainNo:'',
    sponsor:'',
    bargainId:'',
    bargain:'',
    shopType:'',
    originator:'',
    mySelf:false,
    noBargain:false,
    others:false,
  },
  onLoad(option){
    var that=this
    var shopId = option.shopId
    var bargainNo = option.bargainNo
    var sponsor = option.sponsor
    var bargainId = option.bargainId
    var shopType = option.shopType
    that.setData({
      shopId: shopId,
      bargainNo: bargainNo,
      sponsor: sponsor,
      bargainId: bargainId,
      shopType: shopType
    })
    that.getHelpBargainGoods();
  },
onReady(){
  var that=this
  var priceDifference = (parseInt(that.data.goods.price * 100 - that.data.goods.bargainPrice * 100) / 100).toFixed(2);
  var pricePercent = ((that.data.goods.bargainPrice * 100) / (that.data.goods.price * 100)*100).toFixed(2);

  that.setData({
    priceDifference:priceDifference,
    pricePercent: pricePercent,
  })
},
  getHelpBargainGoods(){
    if (app.globalData.usersInfo)
      var userId = wx.getStorageSync('usersInfo').userId
    else
      var userId = 0
    var that=this
    var timestamp = (Date.parse(new Date())) / 1000
    var sign = MD5Util.sign(timestamp)
    wx.request({
      url: 'https://www.aftdc.com/wxapp/Shop/getHelpBargainGoods',
      data: {
        userId: userId,
        shopId: that.data.shopId,
        bargainNo: that.data.bargainNo,
        sponsor: that.data.sponsor,
        bargainId: that.data.bargainId,
      },
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if (res.data.res == 1) {
         var bargain=res.data.data
          bargain.remaining = (((bargain.result * 100) - (bargain.minPrice * 100)) / 100).toFixed(2)
          var originator = res.data.data.users[0]
          var users = res.data.data.users
          var model = that.data.model
          for (var i in users){
            if(users[i].userId== wx.getStorageSync('usersInfo').userId){
              model.price = users[i].bargain
              that.setData({
                others: false
              })
              break;
            }
            if (bargain.type == 2 && users[i].userId != wx.getStorageSync('usersInfo').userId){
                that.setData({
                  others:true
                })
            }
          }
          if (app.globalData.userId == originator.userId) {
            that.setData({
              mySelf: true
            })
          }
         that.setData({
           bargain:bargain,
           originator: originator,
           model: model
         })
        }else{
          that.setData({
            noBargain:true
          })
        }

      }
    })
  },
  bargainBut: function (e) {
    var that = this
    var usersInfo = wx.getStorageSync('usersInfo')
    if (!usersInfo || !usersInfo.userPhone) { //如果没登录
      wx.navigateTo({
        url: '../author/author',
      })
      return false
    }
    //播放砍价的声音
    var innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.autoplay = true
    innerAudioContext.src = '/audios/bargain.wav'
    innerAudioContext.onPlay(() => {
    })
    var model = this.data.model;
    var bargain = that.data.bargain
    var bargainNumb = bargain.bargainNumb//砍价成功次数
    var random = Math.random();
    var start = bargain.minPrice;
    var end = bargain.result;
    var poor = ((end * 100 - start * 100) / 100).toFixed(2);
    var bargainPoor = ((poor * 100) / (bargainNumb * 100)).toFixed(2)
    if (bargainNumb == 1) {
      var money =bargain.remaining;
      var percent = ((poor * 100 - money * 100) / (poor * 100) * 100).toFixed(2)//比例长度
    } else {
    var money = (bargainPoor * random).toFixed(2);
    var percent = ((poor * 100 - money * 100) / (poor * 100) * 100).toFixed(2)//比例长度
    }
    var prans = {};
    prans.percent = percent;
    prans.money = money
    model.togle = true;
    model.txt = "力道虽好，技术欠佳",
      model.price = prans.money;
    this.setData({
      prans: prans,
      model: model,
    })
    bargain.bargain = model.price
    this.logbargain(JSON.stringify(bargain))
  },
  //记录砍价
  logbargain: function (bargain) {
    var that = this;
    var timestamp = (Date.parse(new Date())) / 1000
    var sign = MD5Util.sign(timestamp)
    wx.request({
      url: 'https://www.aftdc.com/wxapp/Shop/logbargain',
      data: {
        sign: sign,
        timestamp: timestamp,
        token: wx.getStorageSync('usersInfo').token,
        shopId: that.data.shopId,
        goodsInfo: bargain,
        bargainNo: that.data.bargainNo
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'post',
      success: function (res) {
        if (res.data.res == 1) {
          // var bargainBox = that.data.bargainBox
          // bargainBox.bargainNo = res.data.bargainNo
          // that.setData({
          //   bargainBox: bargainBox
          // })
        }else{

        }
      }
    })
  },
  modelClose: function () {
    var that=this
    that.getHelpBargainGoods();
    var model=that.data.model
    model.togle = false;
  //   var goods = that.data.goods
  //   var price = goods.price
  //   var newBargainPercent = ((model.price * 100) / (price * 100) * 100).toFixed(2);
    
  //   var pricePercent = (parseInt((that.data.pricePercent*100) + (newBargainPercent*100))/100).toFixed(2)
  //   goods.bargainPrice =(parseInt((goods.bargainPrice * 100) + (model.price * 100)) / 100).toFixed(2)
  that.setData({
    model: model,
  })
    //添加缓存

  },
  toShop: function (e) {
    var that=this
    //1外卖 2堂食 3到店 4免配送 5优质商家 6夜市 21团购 26代金券 28砍价 27秒杀   30商家红包
    var shopId = that.data.bargain.shopId
    wx.setStorageSync('shopType', that.data.shopType)
    wx.setStorageSync('orderType', 0)
    wx.navigateTo({
      url: '../order/order?shopId=' + shopId,
    })
   
  },
  // 帮忙砍价
  onShareAppMessage: function (res) {
    var that = this
    // path: '/pages/order/goShare/goShare?shopId=' + this.data.shopId + '&shareId=' + this.data.tofriendShareId,
    var bargain = that.data.bargain
    var path = '/page/homePage/pages/bargainHelp/bargainHelp?shopId=' + bargain.shopId + '&bargainNo=' + bargain.bargainNo + '&sponsor=' + app.globalData.userId + '&bargainId=' + bargain.bargainId + '&shopType=' + that.data.shopType

    if (res.from === 'button') {
      return {
        title: '帮我砍一刀',
        path: path,
        success: function (res) {

          // that.setData({
          // 	boxShow: 2,
          // })
        },
        fail: function (res) {

        }
      }
    }
  },
})