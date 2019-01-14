var util = require('../../../../utils/util.js')
var MD5Util = require('../../../../utils/md5.js');
var app = getApp();
Page({
  data: {
    src:'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJrXzp40cuBgZgPf1LVbm12OwMoqP7eNecktvOlSIUJ98LTTTOCjdANFcBDLTxuzcT2cAOgMMVeOA/0',
    opacity:0,
    left:0,
    num:'',
    page:0,
    article:[],
    releaseFocus1: false,//提问
    releaseFocus2:false,//回复
    text:'',
    noteMaxLen: 70,//备注最多字数
    noteNowLen: 0,//备注当前字数
    lock:false,
  },
  onLoad: function (options) {
      var that = this
      var userId = wx.getStorageSync('usersInfo').userId;
      if (options.userId) {
          userId = options.userId
      }
      that.setData({
          userId: userId
      })
      that.article(userId)
  },
  //下拉  
  onPullDownRefresh: function () {
      var that = this
      var userId = that.data.userId
      console.log(userId)
      that.setData({
          page: 0,
      })
      this.article(userId);
  }, 
  //上拉  
  onReachBottom: function () {
    this.article();
  },
  //跳转
  Jump:function(e){
    var user_id = e.currentTarget.dataset.userid;
    var userId = wx.getStorageSync('usersInfo').userId;
    wx.navigateTo({
      url: '../circle/circle?userId=' + user_id
    })
  },
  
  //数据
  article: function (userId){
    var that = this
    var page = that.data.page
    wx.request({
      url: 'https://www.aftdc.com/wxapp/Service/circle',
      method:'post',
      data:{
        userId: userId,
        page: page,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success:function(res){
        if(res.data.res == 1){
          var user = res.data.user
          var article = that.data.article.concat(res.data.Visible);
          for (var i = 0; i<article.length;i++){
            if (article[i]['userlike']){
              for (var g = 0; g < article[i]['userlike'].length; g++) {
                if (article[i]['userlike'][g]['userId'] == userId) {
                  article[i]['userlike'] = 1;
                }
              }
            }
          }
          that.setData({
            article: article,
            page: page + res.data.Visible.length,
            userName: user.userName,
            userPhoto: user.userPhoto,
            fc: user.fc,
            gz: user.gz,
          })
        }
      }
    })
  },
  //页面
  home:function(e){
    var that = this;
    //检查锁
    if (that.data.lock) {
      that.setData({
        lock: false,
      })
      return;
    }
    var article = that.data.article;
    for (var i = 0; i < article.length; i++) {
      if (article[i]['interflow']) {
        for (var p = 0; p < article[i]['interflow'].length; p++) {
            article[i]['interflow'][p]['option'] = 0
        }
      }
    }
    that.setData({
      article: article,
    })
  },
 
  //留言
  message: function () {
    var that = this;
    var id = that.data.id;
    var text = that.data.text;
    if(!text){
      return false
    }
    var userId = wx.getStorageSync('usersInfo').userId;
    var article = that.data.article;
    wx.request({
      url: 'https://www.aftdc.com/wxapp/Service/flow_message',
      method:'post',
      data:{
        userId: userId,
        id: id,
        text: text,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success:function(res){
        if(res.data.res == 1){
          for (var i = 0; i < article.length; i++) {
            if (article[i]['id'] == id) {
              if (article[i]['interflow']){
                article[i]['interflow'].push(res.data.interflow)
              } else {
                var interflow = [];
                interflow.push(res.data.interflow)
                article[i]['interflow'] = interflow
              }
            }
          }
          var setMessage = {
            text: that.data.userMessage
          }
          that.setData(setMessage)
          that.setData({
            article: article,
            text:'',
            releaseFocus1:false,
            noteNowLen: 0,
          })
        }
      }
    })
  },
  //字数改变触发事件
  bindTextAreaChange: function (e) {
    var that=this; 
    var value = e.detail.value, len = parseInt(value.length);
    if (len > that.data.noteMaxLen){
      return;
    }
    that.setData({
      text: value, noteNowLen: len
    })
  },
  //点赞
  praise:function(e){
    var that = this
    var id = e.currentTarget.dataset.id;
    var userId = wx.getStorageSync('usersInfo').userId
    var article = that.data.article;
    wx.request({
      url: 'https://www.aftdc.com/wxapp/Service/praise',
      method:'post',
      data:{
        userId: userId,
        id:id,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success:function(res){
        console.log(id)
        console.log(userId)
        console.log(res.data)
        if(res.data.res == 1){
          var like = res.data.like;
          if (like == 0){
            for (var i = 0; i < article.length; i++) {
              if (article[i]['id'] == id) {
                delete (article[i]['userlike'])
              }
            }
          } else {
            for (var i = 0; i < article.length; i++) {
              if (article[i]['id'] == id) {
                article[i]['userlike'] = res.data.userlike;
                for (var g = 0; g < res.data.userlike.length;g++){
                  if (res.data.userlike[g]['userId'] == userId){
                    article[i]['userlike'] = 1;
                  }
                }
              }
            }
          }
          console.log(article)
          that.setData({
            article: article,
          })
        }
      }
    })
  },
  //点击回复
  bindReply: function (e) {
    var id = e.currentTarget.dataset.id;
    this.setData({
        releaseFocus1:true,
      id: id
    })
  },
  //点击放大图片
  enlargeImg: function (e) {
    console.log(e)
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
  //发布动态
  comeOn:function(){
    wx.showModal({
        title: '提示',
        content: '请下载阿凡提点餐APP',
        showCancel:false
    })
  },
  focus1: function () {
      this.setData({
          releaseFocus1: !this.data.releaseFocus1
      })
  },
})