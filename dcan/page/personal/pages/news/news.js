var MD5Util = require('../../../../utils/md5.js')
var app = getApp();

Page({
  data: {
    title: [{
      name: '关注',
      photo: 'https://image.aftdc.com/appBimg/icon_fans.jpg',
      url: '../gz/gz',
      num: 0
    }, {
      name: '赞',
      photo: 'https://image.aftdc.com/appBimg/icon_zhan.jpg',
      url: '../zan/zan',
      num: 0
    }, {
      name: '评论',
      photo: 'https://image.aftdc.com/appBimg/icon_pl.jpg',
      url: '../pl/pl',
      num: 0
    }, {
      name: '留言',
      photo: 'https://image.aftdc.com/appBimg/icon_liuyan.jpg',
      url: '../ly/ly',
      num: 0
    }, 
    // {
    //   name: '收藏',
    //   photo: 'https://image.aftdc.com/appBimg/icon_soucang.jpg',
    //   url: '/pages/personal/news/sc/sc',
    //   num: 0
    // }, 
    // {
    //   name: '转发',
    //   photo: 'https://image.aftdc.com/appBimg/icon_share.jpg',
    //   url: '/pages/personal/news/zf/zf',
    //   num: 0
    // }, 
    {
      name: '私信',
      photo: 'https://image.aftdc.com/appBimg/icon_sixin.jpg',
      url: '../sx/sx',
      num: 0
    }, {
      name: '活动通知',
      photo: 'https://image.aftdc.com/appBimg/icon_huodongtongzhi.jpg',
      url: '../hdtz/hdtz',
      num: 0
    }, {
      name: '系统通知',
      photo: 'https://image.aftdc.com/appBimg/icon_xitong.jpg',
      url: '../xttz/xttz',
      num: 0
    }],
  },
  onLoad() {
    var that = this
    var userId = wx.getStorageSync('usersInfo').userId
    var timestamp = (Date.parse(new Date())) / 1000
    var sign = MD5Util.sign(timestamp)
    var token = wx.getStorageSync('usersInfo').token
    wx.request({
      url: 'https://www.aftdc.com/wxapp/Message/getMessageNum',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        timestamp: timestamp,
        sign: sign,
        token: token
      },
      method: "POST",
      success: function(res) {
        if (res.data.res == 1) {
          that.data.title[0]['num'] = res.data.data.gz.num;
          that.data.title[1]['num'] = res.data.data.zan.num;
          that.data.title[2]['num'] = res.data.data.pl.num;
          that.data.title[3]['num'] = res.data.data.ly.num;
          // that.data.title[4]['num'] = res.data.data.sc.num;
          // that.data.title[5]['num'] = res.data.data.zf.num;
          that.data.title[4]['num'] = res.data.data.sx.num;
          that.data.title[5]['num'] = res.data.data.hdtz.num;
          that.data.title[6]['num'] = res.data.data.xttz.num;
          that.setData({
            title: that.data.title
          })
        }
      }
    })
  },
  goto(e) {
    var index = e.currentTarget.dataset.index;
    var url = this.data.title[index]['url'];
    this.data.title[index]['num'] = 0;
    this.setData({
      title: this.data.title
    })
    wx.navigateTo({
      url: url,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  }
})