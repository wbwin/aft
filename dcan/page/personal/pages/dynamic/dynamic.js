var util = require('../../../../utils/util.js')
var MD5Util = require('../../../../utils/md5.js');
var app = getApp();
Page({
  data: {
    top_Height: '',
    windowHeight:'',
    message_one:'中山大学附属第六医院官方账号中山大学附属第六医...',
    message_two:'中山大学附属第六医院官方账号中山大学附属第六医中山大学附属第六医院官方账号中山大学附属第六医',
    gz:0,
    fs:0,
    message_b:0,
    scrollLeft:0,
    currentTab:0,
    onreachBottom: true,//下拉状态
    page:'',//页数
    pinglun:[],
    pl_page:0,//评论页数
    lyDatas: [],
    ly_page:0,//留言页数
    article:[],
    wz_page:0,//文章页数
    dongtai_page:0,//动态页面
    num:'',//上个状态
    latitude:'',
    dongtai:[],
    longitude:'',
    userId:'',
    attentionType:0,
    self:0 //是否自己的个人动态
  },
  //
  onLoad: function (options) {
    var that = this;
    this.setData({ userId: options.userId, userPhoto: options.userPhoto, userName: options.userName})
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          top_Height: res.windowHeight*0.1,
          windowHeight: res.windowHeight
        })
      }
    })
  },
  //拿到经纬度
  onReady: function () {
    var that = this
    
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        that.setData({
          latitude: latitude,
          longitude: longitude,
        })
        that.dongtai();//动态
        that.article(latitude, longitude)
        that.getPl(1)
        that.getTest()
      },
      fail: function (res) {
        that.dongtai();//动态
        that.article('', '')
        that.getPl(1)
        that.getTest()
      },
    })
  },

  //获取评论
  dongtai: function () {
      var that = this
      var dongtai_page = that.data.dongtai_page;
      var userId = that.data.userId;
      var MyuserId = wx.getStorageSync('usersInfo').userId;
      if (userId == MyuserId)
        that.setData({self:1})
      var timestamp = (Date.parse(new Date())) / 1000
      var sign = MD5Util.sign(timestamp)
      wx.request({
          url: 'https://www.aftdc.com/wxapp/Userarticle/dongtai',
          header: {
              "Content-Type": "application/x-www-form-urlencoded"
          },
          data: {
              sign: sign,
              timestamp: timestamp,
              token: wx.getStorageSync('usersInfo').token,
              userId: userId,
              page: dongtai_page,
          },
          method: "POST",
          success: function (res) {
              if (res.data.res == 1) {
                  that.data.onreachBottom = true
                  var dongtai = that.data.dongtai.concat(res.data.data)
                  that.setData({
                      dongtai: dongtai,
                      dongtai_page: that.data.dongtai_page + 20,
                      attentionType: res.data.attentionType,
                      fanNum:res.data.fanNum,
                      attentionNum:res.data.attentionNum,
                      is_black: res.data.is_black
                  })
              } else {
                  that.data.onreachBottom = false
              }
          }
      })
  },


  //获取评论
  getPl: function (plindex) {
    var that = this
    var pl_page = that.data.pl_page;
    // var userId = wx.getStorageSync('usersInfo').userId;
    // var timestamp = (Date.parse(new Date())) / 1000
    // var sign = MD5Util.sign(timestamp)
    wx.request({
        url: 'https://www.aftdc.com/wxapp/Userarticle/observe',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        // sign: sign,
        // timestamp: timestamp,
        // token: wx.getStorageSync('usersInfo').token,
        userId: that.data.userId,
        page: pl_page,
        id: plindex,
      },
      method: "POST",
      success: function (res) {
        if(res.data.res == 1){
          that.data.onreachBottom = true
          var pinglun = that.data.pinglun.concat(res.data.data)
          that.setData({
            pinglun: pinglun,
            pl_page: that.data.pl_page + res.data.data.length,
          })
        } else {
          that.data.onreachBottom = false
        }
      }
    })
  },
  //获取留言
  getTest:function(){
    var that = this
    var ly_page = that.data.ly_page
    var userId = this.data.userId
    // var userId = wx.getStorageSync('usersInfo').userId;
    // var timestamp = (Date.parse(new Date())) / 1000
    // var sign = MD5Util.sign(timestamp)
    wx.request({
        url: 'https://www.aftdc.com/wxapp/Userarticle/me_message',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        page: ly_page,
        userId: userId,

        // sign: sign,
        // timestamp: timestamp,
        // token: wx.getStorageSync('usersInfo').token,
      },
      method: "POST",
      success: function (res) {
        if (res.data.res == 1) {
          that.data.onreachBottom = true
          var lyDatas = that.data.lyDatas.concat(res.data.datas)
          that.setData({
            lyDatas: lyDatas,
            ly_page: res.data.datas.length + ly_page
          })
        } else {
          that.data.onreachBottom = false
        }
      }
    })
  },
  //文章
  article: function (latitude, longitude) {
    var that = this;
    var wz_page = that.data.wz_page
    // var timestamp = (Date.parse(new Date())) / 1000
    // var sign = MD5Util.sign(timestamp)
    wx.request({
        url: 'https://www.aftdc.com/wxapp/Userarticle/me_article',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        userId: that.data.userId,
        page: wz_page,
        latitude: latitude,
        longitude: longitude
      },
      method: "POST",
      success: function (res) {
        if (res.data.res == 1) {
          that.data.onreachBottom = true
          var article = that.data.article.concat(res.data.data)
          that.setData({
            article: article,
            wz_page: that.data.wz_page + res.data.data.length,
          })
        } else {
          that.data.onreachBottom = false
        }
        that.setData({
          article: res.data.data,
          page: that.data.page + res.data.data.length,
        })
      }
    })
  },
  //展开
  message:function(){
    var that = this;
    var message = this.data.message_two;
    that.setData({
      message_one:message,
      message_b:1,
    })
  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    var cur = e.currentTarget.dataset.choose;
    if (this.data.currentTab == cur) {
       return false; 
    } else {
      this.setData({
        currentTab: cur,
        choose: cur
      })
    }
  },
  // 滚动切换标签样式
  switchTab: function (e) {
    this.setData({
      currentTab: e.detail.current
    });
  },
  //下拉加载当前状态
  onreachBottom: function (e) {
    var that = this
    var num = that.data.num;//上一个状态
    var currentTab = that.data.currentTab;
    if (num != currentTab) {
      this.data.onreachBottom = true
    }
    if (this.data.onreachBottom) {
      this.setData({
        num: currentTab,
      })
      this.data.onreachBottom = false
      var timestamp = (Date.parse(new Date())) / 1000
      var sign = MD5Util.sign(timestamp)
      if (currentTab == 0) {
        that.dongtai();//动态
      } else if (currentTab == 1) {
        var latitude = that.data.latitude
        var longitude = that.data.longitude
        that.article(latitude, longitude);//文章
      } else if (currentTab == 2) {
        that.getPl(1);//评价
      } else if (currentTab == 3) {
        that.getTest();//留言
      }
    }
  },
  //文章跳转
  seeDetail:function(e){
    var id = e.currentTarget.dataset.id;
    wx.request({
      url: 'https://www.aftdc.com/wxapp/Article/article_click',
      method: 'post',
      data: {
        id: id,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
      }
    })
    wx.redirectTo({
      url: '../../../direct/pages/userArticle/userArticle?article_id=' + id,
    })
  },
  //点击放大图片
  enlargeImg: function (e) {
    var src = e.currentTarget.dataset.src;
    var index = e.currentTarget.dataset.index;
    var txt = e.currentTarget.dataset.txt;
    // if (txt != 'img') {
      var srcs = []
      for (var i in src) {
        var img = src[i][txt]
        var obj = { img: img }
        srcs.push(obj)
      }
      src = srcs
    // }
    this.setData({
      enlargeSrc: src,
      enlargeBox: true,
      enlargeNumb: index,
    })
  },
  //关闭图片
  enlargeClose: function (e) {
    this.setData({
      enlargeBox: false,
    })
  },
  //留言跳转
  actDetail:function(e){
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index
    wx.request({
      url: 'https://www.aftdc.com/wxapp/Article/article_click',
      method: 'post',
      data: {
        id: id,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
      }
    })
    if (this.data.lyDatas[index].type == 1)
      var url = '../../../direct/pages/article/article?article_id=' + id
    else
      var url = '../../../direct/pages/userArticle/userArticle?article_id=' + id
    wx.redirectTo({
        url: url,
    })
  },
  //显示隐藏
  showModal: function (e) {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    var index = e.currentTarget.dataset.index
    var type = e.currentTarget.dataset.type
    if (type == 'dongtai')
        var type2 = this.data.dongtai[index].type
    else
        var type2 = this.data.lyDatas[index].type

    if (type =='dongtai')
    {
        this.setData({ article_id: this.data.dongtai[index].article_id, type: type, type2: type2}) 
    }

    if (type == 'ly')
    {
        this.setData({ article_id: this.data.lyDatas[index].article_id, type: type, type2: type2}) 
    }
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true,

    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  //打开隐藏
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },
  formatten: function (e) {
      var that = this;
      var formId = e.detail.formId;
      var userId = that.data.userId;
      var attentionType = that.data.attentionType
      var usersInfo = wx.getStorageSync('usersInfo')
      if (!usersInfo || !usersInfo.userPhone) {//如果没登录
          wx.navigateTo({
            url: '../../../homePage/pages/author/author?route=formnextBut',
          })
          return false
      } else {
          var timestamp = (Date.parse(new Date())) / 1000
          var sign = MD5Util.sign(timestamp)
          if (attentionType == 0) {
              wx.request({
                  url: 'https://www.aftdc.com/wxapp/Userarticle/formId',
                  method: 'post',
                  header: { "Content-Type": "application/x-www-form-urlencoded" },
                  data: {
                      timestamp: timestamp,
                      token: wx.getStorageSync('usersInfo').token,
                      sign: sign,
                      formId: formId,
                      userId: userId,
                  },
                  success: function (res) {
                  }
              })
          }
          that.touchAttention();
      }
  },

  //触发了关注和取消关注的操作
  touchAttention: function () {
      var that = this
      var usersInfo = wx.getStorageSync('usersInfo')
      if (!usersInfo || !usersInfo.userPhone) {//如果没登录
          wx.navigateTo({
            url: '../../../homePage/pages/author/author?route=touchAttention',
          })
          return false
      } else {
          var hobbyTip = that.data.hobbyTip
          that.setData({ touchAttention: 1 })
          var attentionType = that.data.attentionType
          if (attentionType == 1) {
              that.cancelAttention()
              that.setData({
                  hobbyTip: true,

                  hobbyTipTitle: '已取消关注'
              })
          } else {
              that.attention()
              that.setData({
                  hobbyTip: true,

                  hobbyTipTitle: '已关注'
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
              }, 5000)
          }
      }
  },
  //关注
  attention: function () {
      var that = this
      var userId = that.data.userId
      var timestamp = (Date.parse(new Date())) / 1000
      var sign = MD5Util.sign(timestamp)
      wx.request({
          url: 'https://www.aftdc.com/wxapp/Userarticle/attention',
          data: {
              userId: userId,
              sign: sign,
              timestamp: timestamp,
              token: wx.getStorageSync('usersInfo').token,
          },
          method: "POST",
          header: { "Content-Type": "application/x-www-form-urlencoded" },
          success: function (res) {
              if(res.data.res==1)
              {
                  that.setData({attentionType: 1})
              }
          }
      })
  },
  //取消关注
  cancelAttention: function () {
      var that = this
      var userId = that.data.userId
      var timestamp = (Date.parse(new Date())) / 1000
      var sign = MD5Util.sign(timestamp)
      wx.request({
          url: 'https://www.aftdc.com/wxapp/Userarticle/cancelAttention',
          data: {
              userId: userId,
              sign: sign,
              timestamp: timestamp,
              token: wx.getStorageSync('usersInfo').token,
          },
          method: "POST",
          header: { "Content-Type": "application/x-www-form-urlencoded" },
          success: function (res) {
              if (res.data.res == 1) {
                  that.setData({ attentionType: 0 })
              }
          }
      })
  },
  back:function(){
      var userId = this.data.userId
      var timestamp = (Date.parse(new Date())) / 1000
      var sign = MD5Util.sign(timestamp)
      var is_black = this.data.is_black
      var that = this
      if (is_black==1)
          is_black=0
      if (is_black == 0)
          is_black = 1
      wx.request({
          url: 'https://www.aftdc.com/wxapp/Userarticle/back',
          data: {
              userId: userId,
              black: is_black,
              sign: sign,
              timestamp: timestamp,
              token: wx.getStorageSync('usersInfo').token,
          },
          method: "POST",
          header: { "Content-Type": "application/x-www-form-urlencoded" },
          success: function (res) {
              if(res.data.res==1)
              {
                wx.showToast({
                    title: '成功',
                    mask: true
                })
                that.setData({is_black:is_black})
              }
          }
      })
  },
    report: function (e) {
      var article_id = e.currentTarget.dataset.id
      var usersInfo = wx.getStorageSync('usersInfo')
      var userId = wx.getStorageSync('usersInfo').userId
      if (!usersInfo || !usersInfo.userPhone) {//如果没登录
          wx.navigateTo({
            url: '../../../homePage/pages/author/author',
          })
          return false
      } else {
          var article_id = this.data.article_id
          var type2 = this.data.type2
          var type = this.data.type
          if (type=='dongtai')
          {
              if (type2==2)
                var url = '../../../direct/pages/report/report?article_id=' + article_id + '&type=user'
               else
                var url = '../../../direct/pages/report/report?article_id=' + article_id 
          }
          if (type == 'ly'){
              if (type2==2)
                var url = '../../../direct/pages/report/report?article_id=' + article_id + '&type=user'
              else
                var url = '../../../direct/pages/report/report?article_id=' + article_id
          }
          wx.navigateTo({
              url: url,
          })
      }
  },
})