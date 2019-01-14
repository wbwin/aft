var MD5Util = require('../../../../utils/md5.js');
var util = require('../../../../utils/util.js')
var authorization = require('../../../../utils/authorization.js')
var app = getApp();
Page({
  data: {
    storage: {
      billId: 0,
      orderRemarks: '',
      pickNumb: -1,
      pickTxt: -1
    },
    pickNumb: -1, //需要用餐的人数
    pickTxt: -1,
    pick: true,
    // remarkNumb: 0,
    remarkBox: true,
    remarkLabel: ["不要辣", "不吃辣", "不需要餐具", "要冰的"],
    orderRemarks: '',
  },
  onLoad: function (options) {
    var orderRemarks = options.orderRemarks
    this.setData({
      orderRemarks: orderRemarks
    })
  },
  onReady:function(e){
  
  },
  bindtext: function (e) {
    var val = e.detail.value;
    if (val.length > 50) {
      wx.showToast({
        title: '最大长度为50',
        icon: 'none',
        duration: 1200,
      })
    }else {
      this.setData({
        // remarkNumb: val.length,
        orderRemarks: val
      })
    }
  },


  remarkLabelItem: function (e) {
    var index = e.currentTarget.dataset.index
    var remarkLabel = this.data.remarkLabel
    var orderRemarks = this.data.orderRemarks //备注框内容 
    var val = orderRemarks + ',' + remarkLabel[index]
    if (val.substr(0, 1) == ',') val = val.substr(1);
    console.log(val.length)
    if (val.length > 50) {
      wx.showToast({
        title: '最大长度为50',
        icon: 'none',
        duration: 1200,
      })
    }else {
      this.setData({
        orderRemarks: val,
        // remarkNumb: val.length,
      })
    }
  },


  pickshow: function () {
    var pick = !this.data.pick
    this.setData({
      pick: pick,
      showTime: true,
    })
  },
  //选择发票
  gotoInvoice: function () {
    var userId = wx.getStorageSync('usersInfo').userId
    wx.navigateTo({
      url: '../../../personal/pages/invoice/invoice?userId=' + userId,
    })
  },
  //打开和确定备注发票框
  invoiceRemark: function (e) {
    // var remarkBox = !this.data.remarkBox
    // var storage = this.data.storage
    // var billId = app.globalData.billId
    // if (billId) {
    //   this.data.billId = billId
    // } else {
    //   storage.billId = this.data.billId
    // }
    var orderRemarks = this.data.orderRemarks
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; //上一个页面

    //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    prevPage.setData({
      orderRemarks: orderRemarks
    })

    wx.navigateBack();
    // this.setData({
    //   remarkBox: remarkBox,
    //   storage: storage,
    // })
  },
  //返回就不获取数据
  remarkBack: function () {
    var storage = this.data.storage
    this.setData({
      billId: storage.billId,
      orderRemarks: storage.orderRemarks,
      pickNumb: storage.pickNumb, //需要用餐的人数
      pickTxt: storage.pickTxt,
      remarkBox: true,
    })
  },
  picks: function (e) {
    var numb = e.currentTarget.dataset.numb
    var pickTxt
    if (numb == 0) {
      pickTxt = numb + "(不需要餐具)"
    } else {
      pickTxt = numb + "人 "
    }
    this.setData({
      pick: true,
      pickTxt: pickTxt,
      pickNumb: numb,
    })
  },
})