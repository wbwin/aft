var util = require('../../../../utils/util.js')
var MD5Util = require('../../../../utils/md5.js');
var app = getApp();
Page({
  data: {
    pageTab: {
      curHdIndex: 4,
      curBdIndex: 4,
    }
  },
  onLoad: function (options) {
    var that = this;
    var uid = wx.getStorageSync('usersInfo').userId;
    var timestamp = (Date.parse(new Date())) / 1000
    var sign = MD5Util.sign(timestamp)
    console.log(uid)
    wx.request({
      url: 'https://www.aftdc.com/wxapp/Asset/coupon',
      data: {
        userId: uid,
        sign: sign,
        timestamp: timestamp,
        token: wx.getStorageSync('usersInfo').token,
      },
      method: 'post',
      header: { 'Content-Type': 'application/json' },
      success: function (res) {
        console.log(res)
        that.setData({
          isLate: res.data.isLate,//已过期
          isUse: res.data.isUse,//已使用
          waitUse: res.data.waitUse,  //待使用
          Unclaimed: res.data.Unclaimed
        })
      },

    })

  },
  //点击导航
  pageHdtap: function (e) {
    //点击子元素
    var _datasetId = e.target.dataset.id;
    console.log(_datasetId)
    var _leftObj = {};
    _leftObj.curHdIndex = _datasetId;
    _leftObj.curBdIndex = _datasetId;
    this.setData({
      pageTab: _leftObj
    })
  },
  addCou:function(e)
  {
    var that=this
    var id = e.currentTarget.dataset.id
    var userId= wx.getStorageSync('usersInfo').userId
    var index = e.currentTarget.dataset.index
    var Unclaimed = that.data.Unclaimed
    var timestamp = (Date.parse(new Date())) / 1000
    var sign = MD5Util.sign(timestamp)
    wx.request({
      url: 'https://www.aftdc.com/wxapp/Asset/receive_coupon',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        conpouIdArr: id,
        userId: userId,
        sign: sign,
        timestamp: timestamp,
        token: wx.getStorageSync('usersInfo').token,
      },
      method: "POST",
      success:function(res)
      {
        console.log(res)
        if (res.data.type==1)
        {
          util.aftModal({
            title: '领取成功',
            icon: 'success',    
            duration: 1500,         
            success: function(res) 
            {
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
  }
})