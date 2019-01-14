var app = getApp();
var MD5Util = require('../../../../utils/md5.js');
Page({
  data: {
    payTrue: false,
    friendId: 0,
    boxShow: false,
    goods: true,
    goodsPrice: 0,
    dsm: 0, //配送费
    dfm: 0,
    dfmStr: 20,
    goodsmarketPrice: 0,
    friend: [],
    orderfoodArr: [],
    orderfood: '',
    userGoodsInfo: [],
    addF: false,
    partner: [],
    FriendOrderFood: [],
    delData: {},
    plength: 1,
    flength: 0,
    onshow: false,
    otherPeople: '',
    orderType: '',
    pingdanNum:'',
    shareOrder:'',
  },

  onLoad: function (options) {
    console.log(app.globalData)
    this.setData({
      shopId: options.shopId,
      dsm: options.dsm,//配送费
      dfm: options.dfm,//起送
      shopName: options.shopName,
      dfmStr: '￥' + options.dfm + '起送',
      orderType: options.orderType,
      userId:wx.getStorageSync('usersInfo').userId
    })
    var userId = wx.getStorageSync('usersInfo').userId
    if (!userId) {
      wx.navigateTo({
        url: '../author/author',
      })
    }
    if (options.shareId) {
      // wx.setStorageSync('shareId', options.shareId)
      if (wx.getStorageSync('shareData')) var shareData = wx.getStorageSync('shareData');
      else var shareData = [];
      var shareData_one = { 'shareId': res.data.shareId, 'shopId': that.data.shopId }
      shareData.push(shareData_one);
      wx.setStorageSync('shareData', shareData)
      // this.startShare(options.shareId)
      // wx.showToast({
      //   title: '成功加入拼单',
      // })
    }
  },

  onReady: function () {
    // var shareId = wx.getStorageSync('shareId');
    var shareData = wx.getStorageSync('shareData');
    for (var i in shareData) {
      if (shareData[i]['shopId'] == this.data.shopId) var shareId = shareData[i]['shareId'];
    }
    if (Boolean(shareId)) {
      this.setData({
        shareId: shareId
      })
    } else {
      this.setData({
        shareId: ''
      })
    }
    this.onPullDownRefresh()
  },

  onShow: function () {
    var userId = wx.getStorageSync('usersInfo').userId
    if (!userId) userId = ''
    if (this.data.onshow && userId) {
      // this.data.shareId = wx.getStorageSync('shareId')
      var shareData = wx.getStorageSync('shareData');
      for (var i in shareData) {
        if (shareData[i]['shopId'] == this.data.shopId) this.data.shareId = shareData[i]['shareId'];
      }
      this.onReady()
    } else {
      this.data.onshow = true
    }
  },

  //开启拼单
  startShare: function (shareId) {
    var that = this
    var timestamp = (Date.parse(new Date())) / 1000
    var sign = MD5Util.sign(timestamp)

    var data = {
      sign: sign,
      timestamp: timestamp,
      token: wx.getStorageSync('usersInfo').token,
      userId:wx.getStorageSync('usersInfo').userId,
      name: wx.getStorageSync('usersInfo').userName,
      shopId: that.data.shopId,
      userPhoto: wx.getStorageSync('usersInfo').userPhoto
    }
    if (typeof shareId != 'object') {
      data.shareId = shareId
    }
    //初始化先创建一个拼单
    wx.request({
      url: 'https://www.aftdc.com/wxapp/Shop/startShare',
      data: data,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'post',
      success: function (res) {
        if (res.data.res == 1) {
          that.setData({
            // shareOrder: [{
            // 	name: wx.getStorageSync('usersInfo').userName,
            // 	id: res.data.id
            // }],
            shareId: res.data.shareId
          })
          that.data.shareId = res.data.shareId
          that.onPullDownRefresh()

          if (wx.getStorageSync('shareData')) var shareData = wx.getStorageSync('shareData');
          else var shareData = [];
          var shareData_one = { 'shareId': res.data.shareId, 'shopId': that.data.shopId }
          shareData.push(shareData_one);
          wx.setStorageSync('shareData', shareData)
        }
      }
    })
  },

  //倒计时
  countDown: function () {
    var otherPeople = this.data.otherPeople
    for (var i = 0; i < otherPeople.length; i++) {
      var intDiff = otherPeople[i].time * 1000;//获取数据中的时间戳
      var day = 0, hour = 0, minute = 0, second = 0;
      if (intDiff > 0) {//转换时间
        var time = new Date(intDiff);
        hour = time.getHours();
        minute = time.getMinutes();
        second = time.getSeconds();
        if (hour <= 9) hour = '0' + hour;
        if (minute <= 9) minute = '0' + minute;
        if (second <= 9) second = '0' + second;
        otherPeople[i].time--;
        var str = hour + ':' + minute + ':' + second
      } else {
        var str = "已结束！";
      }
      otherPeople[i].difftime = str;//在数据中添加difftime参数名，把时间放进去
    }
    this.setData({
      otherPeople: otherPeople
    })
  },
  add: function () {
    this.setData({
      boxShow: 4
    })
  },
  noadd: function () {
    this.setData({
      boxShow: false,
    })
  },
  //帮好友点餐
  diancanF: function () {
    var shareOrder = this.data.shareOrder;
    var num = shareOrder.length + 1
    var that = this
    var timestamp = (Date.parse(new Date())) / 1000
    var sign = MD5Util.sign(timestamp)
    wx.request({
      url: 'https://www.aftdc.com/wxapp/Shop/addFriend',
      data: {
        sign: sign,
        timestamp: timestamp,
        token: wx.getStorageSync('usersInfo').token,
        userId:wx.getStorageSync('usersInfo').userId,
        shareId: that.data.shareId,
        name: num + '号好友'
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'post',
      success: function (res) {
        if (res.data.res == 1) {
          that.setData({
            shareOrder: res.data.shareOrder
          })
        }
      }
    })
  },

  //删除他
  delFriend: function () {
    var that = this
    var timestamp = (Date.parse(new Date())) / 1000
    var sign = MD5Util.sign(timestamp)
    wx.request({
      url: 'https://www.aftdc.com/wxapp/Shop/delFriend',
      data: {
        sign: sign,
        timestamp: timestamp,
        token: wx.getStorageSync('usersInfo').token,
        // userId:wx.getStorageSync('usersInfo').userId,
        // shareId: that.data.shareId,
        delUserId: that.data.id
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'post',
      success: function (res) {
        if (res.data.res == 1) {
          that.onPullDownRefresh()
          that.setData({
            boxShow: false
          })
        }
      }
    })
  },
  delBox: function (e) {
    var id = e.currentTarget.dataset.id;
    this.data.id = id
    this.setData({
      boxShow: 1
    })
  },

  // 修改名字输入框
  // reviseInput: function (e) {
  // 	var reviseTxt = e.detail.value;
  // 	this.setData({
  // 		reviseTxt: reviseTxt
  // 	})
  // },
  // //修改名字
  // reviseTrue: function () {
  // 	var that = this
  // 	var reviseTxt = this.data.reviseTxt;
  // 	var shareId = this.data.shareId;
  // 	if (!reviseTxt || reviseTxt.length < 2) {
  // 		util.aftModal({
  // 			title: '昵称为 2-12 字',
  // 		})
  // 		that.setData({
  // 			boxShow: false,
  // 		})
  // 		return false
  // 	}
  //   var timestamp = (Date.parse(new Date())) / 1000
  //   var sign = MD5Util.sign(timestamp)
  // 	wx.request({
  //     url: 'https://www.aftdc.com/wxapp/Shop/editName',
  // 		data: {
  //       sign: sign,
  //       timestamp: timestamp,
  //       token: wx.getStorageSync('usersInfo').token,
  // 			shareId: shareId,
  // 			id: that.data.id,
  // 			name: reviseTxt
  // 		},
  // 		header: {
  // 			"Content-Type": "application/x-www-form-urlencoded"
  // 		},
  // 		method: 'post',
  // 		success: function (res) {
  // 			if (res.data.res == 1) {
  // 				that.setData({
  // 					shareOrder: res.data.shareOrder,
  // 					boxShow: false
  // 				})
  // 			}
  // 		}
  // 	})
  // },
  // reviseFn: function (e) {
  // 	var id = e.currentTarget.dataset.id;
  // 	this.data.id = id
  // 	this.setData({
  // 		boxShow: 3
  // 	})
  // },
  //下拉刷新
  onPullDownRefresh: function () {
    var shopId = this.data.shopId
    var that = this
    var timestamp = (Date.parse(new Date())) / 1000
    var sign = MD5Util.sign(timestamp)
    wx.request({
      url: 'https://www.aftdc.com/wxapp/Shop/getShare',
      data: {
        sign: sign,
        timestamp: timestamp,
        token: wx.getStorageSync('usersInfo').token,
        shareId: that.data.shareId,
        shopId: shopId,
        orderType:that.data.orderType,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'post',
      success: function (res) {
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
        if (res.data.res == 1) {
          var otherPeople = res.data.shopShareOrder
          var shareOrder = res.data.shareOrder
          // for (var i in shareOrder) {
          //   for (var j in shareOrder[i].goodsInfo) {
          //     shareOrder[i].goodsInfo[j].totalPrice = (Number(shareOrder[i].goodsInfo[j].numb) * Number(shareOrder[i].goodsInfo[j].shopPrice)).toFixed(2)
          //   }
          // }
          that.setData({
            shareOrder: shareOrder,
            num: res.data.num,
            payStatus: res.data.payStatus,
            deduction: res.data.deduction,
            otherPeople: res.data.shopShareOrder,
            pingdanNum: res.data.shopInfo.pingdanNum
          })
          var userShare = []
          for (var i in otherPeople) {
            if (otherPeople[i].userId == wx.getStorageSync('usersInfo').userId) {
              userShare.push(otherPeople[i])
            }
          }

          if (!res.data.shareOrder) {
            // wx.removeStorageSync('shareId')
            var shareData = wx.getStorageSync('shareData');
            for (var i in shareData) {
              if (shareData[i]['shareId'] == that.data.shareId) shareData.splice(i, 1);
            }
            wx.setStorageSync('shareData', shareData)
            that.setData({
              shareOrder: '',
              shareId: '',
              num: '',
              payStatus: '',
              deduction: '',
              payTrue: false,
              dfmStr: '未发起拼单'
            })
          }
          if (userShare) {
            that.setData({
              dfmStr: '正在拼单'
            })
          }
          if (res.data.shopShareOrder) {
            var timer = setInterval(that.countDown, 1000);
          }
          if(that.data.orderType==3){
            that.setData({
              dfm:res.data.shopInfo.bookingMoney
            })
          }
        }
        if (res.data.payStatus == -1) {
          wx.showModal({
            title: '提示',
            content: '已提交订单，去付款',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.switchTab({
                  url: '/page/tabBar/purchase/index',
                })
              }
            }
          })
        }
        if (res.data.payStatus == 1) {
          wx.showModal({
            title: '提示',
            content: '已提交订单',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.switchTab({
                  url: '/page/tabBar/purchase/index',
                })
              }
            }
          })
        }
        if (res.data.payStatus == -2) {
          wx.showModal({
            title: '提示',
            content: '订单已取消',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                var shareData = wx.getStorageSync('shareData');
                for (var i in shareData) {
                  if (shareData[i]['shareId'] == that.data.shareId) shareData.splice(i, 1);
                }
                wx.setStorageSync('shareData', shareData)
                that.setData({
                  shareId: ''
                })
              }
            }
          })
        }
        if (res.data.res == 0) {
          var shareData = wx.getStorageSync('shareData');
          for (var i in shareData) {
            if (shareData[i]['shareId'] == that.data.shareId) shareData.splice(i, 1);
          }
          wx.setStorageSync('shareData', shareData)
          that.setData({
            shareId: ''
          })
          if (that.data.orderType == 3) {
            that.setData({
              dfmStr: '￥' + res.data.shopInfo.bookingMoney+ '元起订',
            })
          }
        }
        if (res.data.num) {
          if (that.data.dfm - res.data.num.allPrice > 0) {
            if(that.data.orderType==3){
              that.setData({
                dfmStr: '差￥' + (Number(that.data.dfm) - Number(res.data.num.allPrice)).toFixed(2) + '元起订',
                payTrue: false
              })
            }else{
              that.setData({
                dfmStr: '差￥' + (Number(that.data.dfm) - Number(res.data.num.allPrice)).toFixed(2) + '元起送',
                payTrue: false
              })
            }
            
          } else if (that.data.dfm - res.data.num.allPrice == 0) {
            if (res.data.num.gNum == 0) {
              if (that.data.orderType == 3) {
                that.setData({
                  dfmStr: '￥0元起订',
                  payTrue: false
                })
              } else {
                that.setData({
                  dfmStr: '￥0元起订',
                  payTrue: false
                })
              }
            } else {
              if (that.data.orderType == 3) {
                that.setData({
                  dfmStr: '￥0元起订',
                  payTrue: true
                })
              } else {
                that.setData({
                  dfmStr: '￥0元起订',
                  payTrue: true
                })
              }
              
            }
          } else {
            that.setData({
              dfmStr: '去结算',
              payTrue: true
            })
          }
        }
      }
    })
  },
  // 弹出框隐藏
  boxhide: function () {
    this.setData({
      boxShow: false,
    })
  },
  //去店铺选购
  addGoods: function (e) {
    var that=this
    var shareOrder = that.data.shareOrder
    var index = e.currentTarget.dataset.index
    if (shareOrder!=''){
      var shareFood = shareOrder[index].goodsInfo
      wx.setStorageSync('shareFood', shareFood)
    }
    
    wx.navigateTo({
      url: '../order/order?shopId=' + this.data.shopId + '&id=' + e.currentTarget.dataset.id
    })
  },
  //加入拼单
  addOthers: function (e) {
    // wx.navigateTo({
    //   url: '/pages/order/goShare/goShare?shopId=' + this.data.shopId + '&shareId=' + e.currentTarget.dataset.id,
    // })
    if (this.data.shareId) {
      wx.showModal({
        title: '提示',
        content: '请完成或删除当前拼单',
        showCancel: false
      })
    } else {
      this.startShare(e.currentTarget.dataset.id)
    }
  },

  // 用户点击右上角分享
  onShareAppMessage: function (res) {
    var that = this
    // path: '/pages/order/goShare/goShare?shopId=' + this.data.shopId + '&shareId=' + this.data.tofriendShareId,

    var path = '/page/homePage/pages/collage/collage?shopId=' + this.data.shopId + '&shareId=' + this.data.shareId + '&originatorUserId=' + app.globalData.userId + '&orderType=' + this.data.orderType

    if (res.from === 'button') {
      return {
        title: '要一起拼单吗',
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
  //结算
  pay: function () {
    var that = this
    var shopId = this.data.shopId
    var dsm = this.data.dsm
    var dfm = this.data.dfm
    var shopName = this.data.shopName
    var shareOrder = that.data.shareOrder
    // if (shareOrder.length < Number(that.data.pingdanNum)){
    //   wx.showToast({
    //     title: '拼单至少需要' + that.data.pingdanNum+'个人',
    //     icon: 'none',
    //     duration: 2000,
    //   })
    //   return false;
    // }
    // for (var i in shareOrder){
    //   if (shareOrder[i].goodsInfo=='null'){
    //     wx.showToast({
    //       title: '有人未选商品哦',
    //       icon: 'none',
    //       duration: 2000,
    //     })
    //     return false;
    //   }
    //   }
    
    var timestamp = (Date.parse(new Date())) / 1000
    var sign = MD5Util.sign(timestamp)
    //从数据库获取最新的商品数据
    wx.request({
      url: 'https://www.aftdc.com/wxapp/Shop/getNewShare',
      data: {
        sign: sign,
        timestamp: timestamp,
        token: wx.getStorageSync('usersInfo').token,
        shareId: that.data.shareId,
        shopId: shopId,
        orderType: that.data.orderType,
      },
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        wx.setStorageSync('orderfood', res.data.food)
        if (that.data.orderType == 3) {
          wx.navigateTo({
            url: '../desk/desk?shopId=' + shopId + '&shopName=' + shopName + '&shareId=' + that.data.shareId,
          })
        } else {
          wx.navigateTo({
            url: '../submit/submit?shareId=' + that.data.shareId + '&deduction=' + res.data.deduction,
          })
        }
      }
    })
  },
  //关闭拼单
  closeShare: function () {
    var that = this;
    wx.showModal({
      title: '确定关闭拼单',
      content: '关闭后，拼单中包含的好友以及商品信息将无法恢复',
      confirmColor: '#53beb7',
      success: function (res) {
        if (res.confirm) {
          var timestamp = (Date.parse(new Date())) / 1000
          var sign = MD5Util.sign(timestamp)

          //用户点击确定
          wx.request({
            url: 'https://www.aftdc.com/wxapp/Shop/delShare',
            data: {
              sign: sign,
              timestamp: timestamp,
              token: wx.getStorageSync('usersInfo').token,
              shareId: that.data.shareId 
            },
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            method: 'post',
            success: function (res) {
              if (res.data.res == 1) {
                // wx.removeStorageSync("shareId")
                var shareData = wx.getStorageSync('shareData');
                for (var i in shareData) {
                  if (shareData[i]['shareId'] == that.data.shareId) shareData.splice(i, 1);
                }
                wx.setStorageSync('shareData', shareData)
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          })
        }
      },
    })

  },
  //监听页面卸载
  onUnload: function () {

  }
})