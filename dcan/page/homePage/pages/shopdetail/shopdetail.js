var MD5Util = require('../../../../utils/md5.js');
var app = getApp()
Page({
	data: {
		page:0,
    nothingA: false,
		nothingV:false,
    sliderIndex:0,
    top:0,
    toView:'',
    attentionType:0,//是否关注
    isLoad:false,
    allArticle: false,
    allVideo:false,
    isMe: 0,
	},

	onLoad: function (options) {
    //判断是用户还是商家
    //商家调用
    if (options.shopId) {
      var url = 'https://www.aftdc.com/wxapp/Article/shopArticle';
      this.setData({ shopId: options.shopId })
      this.shopArticle(url, options.shopId)
    }
    //用户调用
    if (options.boosterId) {
      var url = 'https://www.aftdc.com/wxapp/Article/userArticle';
      var userId = wx.getStorageSync('usersInfo').userId;
      if (userId == options.boosterId) this.data.isMe = 1;
      else this.data.isMe = 0;
      this.setData({ boosterId: options.boosterId, isMe: this.data.isMe})
      this.shopArticle(url, options.boosterId)
    }
    
	},
  //文章和视频
  shopArticle: function (url,id) {
    var userId = wx.getStorageSync('usersInfo').userId
    if (!userId) {
      userId = ''
    }
    var that = this;
    var timestamp = (Date.parse(new Date())) / 1000
    var sign = MD5Util.sign(timestamp)
    wx.request({
      url: url,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        userId: userId,
        shopId: id
      },
      method: "POST",
      success: function (res) {
        //商家
        if (res.data.shopInfo) {
          wx.setNavigationBarTitle({
            title: res.data.shopInfo.shopName
          })
          that.setData({
            shopInfo: res.data.shopInfo,
          })
        }
        //用户
        if (res.data.userInfo) {
          wx.setNavigationBarTitle({
            title: res.data.userInfo.userName
          })
          that.setData({
            userInfo: res.data.userInfo,
          })
        }

        that.setData({
          article: res.data.article,
          video: res.data.video,
          count: res.data.count,
          attentionType: res.data.attention
        })
        if (res.data.article.length == 0) {
          that.setData({
            nothingA: true
          })
        } else {
          that.setData({
            pageA: res.data.article.length
          })
        }
        if (res.data.video.length == 0) {
          that.setData({
            nothingV: true
          })
        } else {
          that.setData({
            pageV: res.data.video.length
          })
        }
        that.setData({
          animationLoading: true,//加载图
        })
      }
    })
  },

  /*上拉加载*/
  loadmore: function () {
    //判断是用户还是商家
    //商家
    if (this.data.shopInfo) {
      var url = 'https://www.aftdc.com/wxapp/Article/moreShopArticle';
      var id = this.data.shopId;
    }
    //用户
    if (this.data.userInfo) {
      var url = 'https://www.aftdc.com/wxapp/Article/moreUserArticle';
      var id = this.data.boosterId;
    }
    if (this.data.isLoad){
      return false;
    }
    this.data.isLoad = true
    var that = this;
    if (this.data.sliderIndex == 0 && !this.data.allArticle) {
      wx.request({
        url: url,
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          shopId: id,
          page: that.data.pageA,
          moreType: 1
        },
        method: "POST",
        success: function (res) {
          if (res.data.res == 1) {
            that.setData({
              article: that.data.article.concat(res.data.data),
              pageA: that.data.pageA + res.data.data.length
            })
          } else {
            that.setData({
              allArticle: true
            })
          }
        }
      })
    }

    if (this.data.sliderIndex == 1 && !this.data.allVideo) {
      wx.request({
        url: url,
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          shopId: id,
          page: that.data.pageV,
          moreType: 2
        },
        method: "POST",
        success: function (res) {
          if (res.data.res == 1) {
            that.setData({
              video: that.data.video.concat(res.data.data),
              pageV: that.data.pageV + res.data.data.length
            })
          } else {
            that.setData({
              allVideo: true
            })
          }
        }
      })
    }
    that.data.isLoad = false
    
  },

	//返回上一页
	back: function (e) {
		wx.navigateBack({
			delta: 1
		})
	},
  //关注已关注切换
  attentionClick(){
    //获取页面栈，并拿到上一个页面的
    var wxCurrPage = getCurrentPages();
    var wxPrevPage = wxCurrPage[wxCurrPage.length - 2];
    var usersInfo = wx.getStorageSync('usersInfo')
    if (!usersInfo || !usersInfo.userPhone) {//如果没登录
      wx.navigateTo({
        url: '../../author/author',
      })
      return false
    } 
    var that = this;
    //判断是关注的对象是商家还是用户
      if (that.data.shopInfo) var hobbyTips = '已关注';
      if (that.data.userInfo) var hobbyTips = '已关注';
    if (that.data.attentionType==0){
      that.setData({ attentionType:1})
      this.setData({
        hobbyTip: true,
        hobbyTips: hobbyTips,
        clickAttention:true
      })
      wxPrevPage.setData({
        attentionType: 1
      })
    }else{
      that.setData({ attentionType: 0 })
      this.setData({
        hobbyTip: true,
        hobbyTips: '已取消关注',
        clickAttention: true
      })
      wxPrevPage.setData({
        attentionType: 0
      })
    }
    setTimeout(function () {
      that.setData({
        hobbyTip: false
      })
    }, 5000)
  },

  onUnload:function(){
    //判断关注对象是用户还是商家
    if (this.data.shopInfo){
      var objId = this.data.shopInfo.shopId;//商家
      var is_user = 0;
    }
    if (this.data.userInfo){
      var objId = this.data.userInfo.userId;//用户
      var is_user = 1;
    }
    if (this.data.clickAttention){
      if (this.data.attentionType == 1){
        this.attention(objId, is_user)
      }else{
        this.cancelAttention(objId, is_user)
      }
    }
  },
  onHide:function(){//页面隐藏时也更新关注数据
    this.onUnload()
  },

  //发私信
  chat:function(){
    var usersInfo = app.globalData.usersInfo
    if (!usersInfo || !usersInfo.userPhone) {//如果没登录
      wx.navigateTo({
        url: '../author/author',
      })
      return false
    } 
    //判断发送对象
    if (this.data.shopInfo) var url = '../contact/contact?shopId=' + this.data.shopInfo.shopId;
    if (this.data.userInfo) var url = '../contact/contact?userId=' + this.data.userInfo.userId;
    wx.navigateTo({
      url: url,
    })
  },
  //文章视频切换
  toArticle:function(){
    var that = this
    that.setData({
      toView: 'stickyHeader',
      sliderIndex: 0
    })
  },
  toVideo:function(){
    var that=this
      that.setData({
        toView: 'stickyHeader',
        sliderIndex:1
      })
  },

	seeDetail: function (e) {
		var id = e.currentTarget.dataset.id
    var url = '';
    if (this.data.shopId) url = '../../../direct/pages/article/article?article_id=' + id + '&is_user=' + 0;
    else url = '../../../direct/pages/article/article?article_id=' + id + '&is_user=' + this.data.boosterId;
		wx.navigateTo({
			url: url,
		})
	},
	onShareAppMessage: function () {
		var that = this
    var shopId = '';
    var shopname = '';
    if (that.data.shopId) {
      shopname = that.data.shopInfo.shopName;
      shopId = that.data.shopInfo.shopId;
    } else {
      shopname = that.data.userInfo.userName;
      shopId = that.data.userInfo.userId;
    }
		
		return {
			title: shopname,
      path: '/page/homePage/pages/shopdetail/shopdetail?shopId=' + shopId,
			success: function (res) {
				// 分享成功
			}
		}
	},
  scrollTopFun(e){
    let that = this;
    that.setData({
      top: e.detail.scrollTop
    })
  },
  //关注
  attention: function (objId, is_user) {
    var that = this
    var userId = wx.getStorageSync('usersInfo').userId
    var timestamp = (Date.parse(new Date())) / 1000
    var sign = MD5Util.sign(timestamp)
    wx.request({
      url: 'https://www.aftdc.com/wxapp/Article/attention',
      data: {
        userId: userId,
        shopId: objId,
        is_user: is_user,
        sign: sign,
        timestamp: timestamp,
        token: wx.getStorageSync('usersInfo').token,
      },
      method: "POST",
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
      }
    })
  },
  //取消关注
  cancelAttention: function (objId, is_user) {
    var that = this
    var userId = wx.getStorageSync('usersInfo').userId
    var timestamp = (Date.parse(new Date())) / 1000
    var sign = MD5Util.sign(timestamp)
    wx.request({
      url: 'https://www.aftdc.com/wxapp/Article/cancelAttention',
      data: {
        userId: userId,
        shopId: objId,
        is_user: is_user,
        sign: sign,
        timestamp: timestamp,
        token: wx.getStorageSync('usersInfo').token,
      },
      method: "POST",
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
      }
    })
  },
})