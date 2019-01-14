var app = getApp()
var MD5Util = require('../../../../utils/md5.js');
Page({

  data: {
    lyDatas: [],
    content: '',
    firstClick: true,
    timer: false
  },

  onLoad: function (options) {
    this.data.functionType = options.functionType;
    this.data.commentOrleaveWord = options.commentOrleaveWord;
    this.data.shopId = options.shopId;
    this.data.id = options.id;
    this.data.appraises_id = options.appraises_id;
    this.data.userId= options.userId
    this.setData({
      title: options.title,
      commentOrleaveWord: options.commentOrleaveWord
    })
    this.getUserTask();
  },

  onReady: function () {
  
  },
  //获取留言
  getUserTask: function(){
    var that = this
    var timestamp = (Date.parse(new Date())) / 1000
    var sign = MD5Util.sign(timestamp)
    wx.request({
      url: 'https://www.aftdc.com/wxapp/Article/arcticle_appraises',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        article_id: that.data.id,
        //page: that.data.page,
        userId: that.data.userId,
        sign: sign,
        timestamp: timestamp,
        token: wx.getStorageSync('usersInfo').token,
      },
      method: "POST",
      success: function (res) {
        that.setData({
          lyDatas: res.data.datas
        })
      }
    })
  },
  del: function (e) {
    this.setData({ firstClick:false})
    var that = this
    var timestamp = (Date.parse(new Date())) / 1000
    var sign = MD5Util.sign(timestamp)
    var index = e.currentTarget.dataset.index
    var id = e.currentTarget.dataset.appraises_id
    wx.request({
      url: 'https://www.aftdc.com/wxapp/Article/del_appraises',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        sign: sign,
        timestamp: timestamp,
        token: wx.getStorageSync('usersInfo').token,
        id: id,    //评论的id
      },
      method: "POST",
      success: function (res) {
        if(res.data.res === 1) {
          wx.showToast({
            title: '删除成功',
          })
          that.data.lyDatas.splice(index, 1);
          that.setData({ lyDatas: that.data.lyDatas })

          if (that.data.commentOrleaveWord == 1) {
            var pages = getCurrentPages();
            var prevPage = pages[pages.length - 2];
            var lyData = prevPage.data.lyData
            var num = --prevPage.data.articleInfo.comment_num
            for (var i = lyData.length - 1; i >= 0 ; i--) {
              if (lyData[i].id == id){
                lyData.splice(i, 1)
                prevPage.setData({ page: prevPage.data.page - 1})
              }
            }
            prevPage.setData({
              lyData: lyData,
              'articleInfo.comment_num': num
            })
          } 
        }else if (res.data.res === 0) {
          wx.showToast({
            title: res.data.info,
            icon: 'none',
            duration: 1500,
          })
        }
        that.setData({ firstClick: true })
      }
    })
  },

  getTest: function (e) {
    this.setData({
      content: e.detail.value
    })
  },
  send:function(e){
    var formId = e.detail.formId;
    // if (this.data.functionType == 'send') {
      this.userSend(formId)
    // } else {
    //   this.userReplay(formId)
    // }
  },
  //留言或评论
  userSend: function (formId) {

    var shopId = this.data.shopId
    var commentOrleaveWord = this.data.commentOrleaveWord
    console.log(this.data.content)
    if (this.data.content == '') {
      wx.showModal({
        title: '提示',
        content: '请输入内容',
        showCancel: false
      })
      return false
    }
    wx.showLoading({
      mask: true,
    })
    var that = this
    var timestamp = (Date.parse(new Date())) / 1000
    var sign = MD5Util.sign(timestamp)
    wx.request({
      url: 'https://www.aftdc.com/wxapp/Article/arcticle_appraises_deliver',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        sign: sign,
        timestamp: timestamp,
        token: wx.getStorageSync('usersInfo').token,
        id: that.data.id,    //文章的id
        userId:wx.getStorageSync('usersInfo').userId,
        content: that.data.content,
        shopId: shopId,
        formId: formId,
        commentOrleaveWord: commentOrleaveWord
      },
      method: "POST",
      success: function (res) {
        wx.hideLoading()
        if (res.data.res == 1) {
          wx.showToast({
            title: res.data.info
          })
          that.setData({content:''})
          that.getUserTask();//发送成功在下面我的留言显示出来

          if(that.data.commentOrleaveWord == 1) {
            var pages = getCurrentPages();
            var prevPage = pages[pages.length - 2];
            var lyData = prevPage.data.lyData
            var num = ++prevPage.data.articleInfo.comment_num
            res.data.data.userName = wx.getStorageSync('usersInfo').userName
            lyData.unshift(res.data.data)
            prevPage.setData({
              lyData: lyData,
              'articleInfo.comment_num': num,
              page: prevPage.data.page + 1
            })
          }
          that.data.timer = setTimeout(()=>{
            wx.navigateBack()
          },2000)
        } else if (res.data.res == 2) {
          wx.showModal({
            title: '提示',
            content: res.data.info,
            showCancel: false
          })
        } else {
          wx.hideLoading()
          wx.showModal({
            title: '提示',
            content: res.data.info,
            success: function (res) {
              if (res.confirm) {
                wx.request({
                  url: 'https://www.aftdc.com/wxapp/Article/certain',
                  method: 'post',
                  data: {
                    sign: sign,
                    timestamp: timestamp,
                    token: wx.getStorageSync('usersInfo').token,
                    id: that.data.id,    //文章的id
                    userId:wx.getStorageSync('usersInfo').userId,
                    content: that.data.content,
                    shopId: shopId,
                    commentOrleaveWord: commentOrleaveWord
                  },
                  success: function (res) {
                    if (res.data.res == 1) {
                      wx.showToast({
                        title: '审核通过后展示',
                      })
                      // setTimeout(function () {
                      //   wx.navigateBack()
                      // }, 1500)
                    } else if (res.data.res == 2) {
                      wx.showModal({
                        title: '提示',
                        content: res.data.info,
                        showCancel: false
                      })
                    } else {
                      wx.showToast({
                        title: res.data.info,
                      })
                    }
                  }
                })
              }
            }
          })
        }
      }
    })
  },
  onUnload() {
    clearTimeout(this.data.timer)
  },
  //用户回复
  // userReplay: function (formId) {
  //   var shopId = this.data.shopId;
  //   var commentOrleaveWord = this.data.commentOrleaveWord;
  //   if (this.data.content == '') {
  //     wx.showModal({
  //       title: '提示',
  //       content: '请输入内容',
  //       showCancel: false
  //     })
  //     return false
  //   }
  //   wx.showLoading({
  //     mask: true,
  //   })
  //   var that = this
  //   var timestamp = (Date.parse(new Date())) / 1000
  //   var sign = MD5Util.sign(timestamp)
  //   wx.request({
  //     url: 'https://www.aftdc.com/wxapp/Article/arcticle_reply',
  //     header: {
  //       'content-type': 'application/x-www-form-urlencoded'
  //     },
  //     data: {
  //       sign: sign,
  //       timestamp: timestamp,
  //       token: wx.getStorageSync('usersInfo').token,
  //       id: that.data.id,    //文章的id
  //       appraises_id: that.data.appraises_id,//评论Id
  //       content: that.data.content,
  //       shopId: shopId,
  //       formId: formId,
  //       commentOrleaveWord: commentOrleaveWord,
  //     },
  //     method: "POST",
  //     success: function (res) {
  //       wx.hideLoading()
  //       if (res.data.res == 1) {
  //         wx.showToast({
  //           title: res.data.info
  //         })
  //         that.setData({ content: '' })
  //       }
  //     }
  //   })
  // }
})