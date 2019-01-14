var app = getApp();
var MD5Util = require('../../../../utils/md5.js');
var time = null
var start = 0;
var util = require('../../../../utils/util.js');
var zanTime
Page({
  data: {
    briding: '',
    bridingTwo: '',
    spec: {},
    car: [],
    toView: '',
    foodname: '',
    totalprice: 0,
    totalMarketPrice: 0,
    totalnumb: 0,
    boxshow: false, //详情显示
    conpouBox: false, //优惠券弹出框
    hongbaoBox: false, //是否显示红包弹出框
    hongbaoBox2: false,
    hongbaoStatus: false, //红包是否已经领取过
    hongbaoSum: 0, //红包总额
    hongbaoCount: 0, //红包数
    hongbaoList: '', //获得的红包列表
    conpouIdArr: '',
    deskNum: -1, //外卖
    hidden: true,
    shopcar: false,
    ordersHeight: 50,
    showPrice: 0,
    boxFees: 0,
    boxFee: 0, //餐盒费
    languageScoll: false,
    zkshow: true,
    lenOrder: 100,
    shopType: 0,
    bargain: [], //砍价缓存
    bargainBox: {}, //砍价的数据
    bargainIndex: false,
    bargainTogle: false,
    model: {
      togle: false,
      txt: '力道虽好，技术欠佳',
      price: '0.06'
    },
    attentionType: 0,
    discount: true, //是否享受优惠
    options: [], //实现下拉刷新需要的options
    shareId: '', //拼单id
    more: false,
    currentTab: 0, //预设当前项的值
    plindex: 1,
    plPage: 0, //全部评论条数
    pplPage: 0, //有图评论条数
    nplPage: 0, //最新评论条数
    plScrolltolower: true, //评论上拉加载
    changepl: [], //点赞
    add: [],
    deletes: [],
    Von: [],
    hongbao: '',
    spec_taste: [],
    foodindex: 0,
    scrollTop: 0,
    distance:'',
    // 定义一个空数组，用来存放右侧滑栏中每一个商品分类的 Height
    listHeight: '',
    timer: '',
    is_less: false,
    pinlunView: '',

    //红包
    redPackets: '',
    redPacketsIdArr: '',
    orderRedPackets: false,
    redPacketslen: '',
    redPacketsSum: '',
    redPacketsState: false,
    redPacketsPresentNub: false,
    OneRedPacketsMoney: '',

    //预订时间
    presetTime: [],
    presetStartTime: '',

    restTimeBookForward: false,
    closeButton: true, //是否显示所有添加商品的按钮
    shareOrderState: 0,
    sharing: 0,
    usersInfo: '',
    shareSelfId: 0, //拼单的个人id
    shareGoodsInfo: [], //个人拼单商品缓存
    selectedGoodsNumb: 0, //拼单选好商品的人数
    updateGoodsNumb: 0, //拼单修改商品的人数
    noSelectedGoodsNumb: false, //拼单选好商品的人数是否可以继续增加
    addShareGoodsTimer: '', //拼单添加商品定时器
    shareInitiator: true, //是否是拼单发起者
    getShareGoodsTimer: '', //拼单数据刷新定时器
    otherSharer: [], //其他拼单人的信息
    shareTotalPrice: 0, //拼单的总价
    shareNumb: 0, //拼单的总数量
    changeCollage: 0, //是否为改变拼单，0:没有改变，1:修改商品，2:退出拼单,
    selfUpdateGoods: false, //自己是否正在修改商品
  },

  onLoad: function(options) {
    var that = this
    wx.setStorageSync('backThisAgain', 1)
    var usersInfo = wx.getStorageSync('usersInfo')
    var userId = wx.getStorageSync('usersInfo').userId
    if (!userId) userId = 0
    var orderType = options.orderType


    //如果有shops_coupon_id则执行
    var shops_coupon_id = options.shops_coupon_id
    that.shops_coupon(shops_coupon_id);


    if (options.latitude) { //拼单用的经纬度是发起人的经纬度
      var latitude = options.latitude
      var longitude = options.longitude
    } else {
      var latitude = app.globalData.location.latitude
      var longitude = app.globalData.location.longitude
    }


    //加入拼单
    if (options.userId) { //如果有参数的shareId 证明从拼单分享中进来
      if (!userId) {
        wx.navigateTo({
          url: '../author/author?route=onLoad',
        })
        return false
      }
      if (options.userId != userId) {

        that.setData({
          shareInitiator: false
        })
      }
    }
    if (orderType) { //扫码进来
      wx.setStorageSync('orderType', orderType)
      this.setData({
        orderType: orderType
      })
    } else if (options.shareOrderType) {//如果是拼单
      this.setData({
        orderType: options.shareOrderType
      })
    } else { //从首页进来
      var orderType = wx.getStorageSync('orderType')
      this.setData({
        orderType: orderType
      })
    }


    var shopId = options.shopId


    //否则清除订座缓存
    // wx.removeStorageSync('orderfood')
    if (options.deskNum != undefined && options.deskName != undefined) { //有座位号和桌位名称，堂食扫码点餐进来
      var deskName = options.deskName
      // unicode 转成 中文
      var str = deskName.replace(/\\/g, "%");
      deskName = unescape(str);
      this.setData({
        deskNum: options.deskNum,
        deskName: deskName,
        orderType: 2
      })
    }

    if (options.shareShopType){//如果是拼单
      var shopType = options.shareShopType
    }else{
      var shopType = wx.getStorageSync('shopType')
    }
    if (shopType == 21 || shopType == 26) { //判断是否是团购或代金券
      this.setData({
        tk: 1,
        shopType: shopType
      })
      var tk = 1
      if (shopType == 21) {
        var type = 1
        this.setData({
          type: type
        })
      } else {
        var type = 2
        this.setData({
          type: type
        })
      }
    } else {
      var tk = ''
      var type = ''
    }
    if (shopType == 1 || shopType == 3 || shopType == 4) {
      //需要活动商品
      var activityGoods = 1
    } else {
      var activityGoods = 0
    }
    that.setData({
      options: options,
      shopId: shopId,
      usersInfo: usersInfo,
      shopType: shopType
    })
    //获取商品信息
    that.obtainGoods(shopId, userId, latitude, longitude, tk, activityGoods, type, orderType, options)



  },
  //如果有shops_coupon_id则执行
  shops_coupon: function(shops_coupon_id) {
    if (shops_coupon_id) {
      var timestamp = (Date.parse(new Date())) / 1000
      var sign = MD5Util.sign(timestamp)
      wx.request({
        url: 'https://www.aftdc.com/wxapp/Shop/shops_coupon',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          shops_coupon_id: shops_coupon_id,
          userId: userId,
          sign: sign,
          timestamp: timestamp,
          token: wx.getStorageSync('usersInfo').token,
        },
        method: "POST",
        success: function(res) {

        }
      })
    }
  },
  //获取商品信息
  obtainGoods: function(shopId, userId, latitude, longitude, tk, activityGoods, type, orderType, options) {
    var that = this
    var timestamp = (Date.parse(new Date())) / 1000
    var sign = MD5Util.sign(timestamp)
    if (orderType == '4') {
      var url = 'https://www.aftdc.com/wxapp/Shop/tg_index'
    } else {
      var url = 'https://www.aftdc.com/wxapp/Shop/index'
    }
    wx.request({
      //url: 'https://www.aftdc.com/wxapp/Shop/tg_index',
      url: url,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        shopId: shopId,
        userId: userId,
        deskNum: that.data.deskNum,
        latitude: latitude,
        longitude: longitude,
        tk: tk,
        activityGoods: activityGoods,
        type: type
      },
      method: "POST",
      success: function(res) {
        var shopInfo = res.data.info
        //处理距离,转化为m用于比较
        var distance=shopInfo.distance.replace('km','')
        distance = Number(distance)*1000
        
        that.setData({
          arr: res.data,
          shopInfo: shopInfo,
          attentionType: res.data.info.attentionType,
          totalMarketPrice: 0,
          totalprice: 0,
          distance: distance,
        })

        //轮播订单
        var orders = res.data.orders
        var len = orders.length
        if (Boolean(len)) {
          that.setData({
            lenOrder: 10,
          })
        }
        that.setData({
          orders: orders
        })
        //评价
        var pinglun = res.data.pinglun.all

        if (pinglun) {
          that.setData({
            plPage: res.data.pinglun.all.length
          })
        } else {
          that.setData({
            plScrolltolower: false
          })
        }

        //如果该店铺有菜单
        var orders = res.data[0]
        if (orders) {
          that.setData({
            languageTxt: res.data[0].language
          })
          var arr = res.data[0].dishes
          for (var i = 0; i < arr.length; i++) {
            for (var j = 0; j < arr[i].distop.length; j++) {
              //给活动商品添加一个标识
              arr[i].distop[j].shopCatId2 = arr[i].catId
            }
            //秒杀活动商品时间状态
            if (arr[i].catId === 2) {
              for (var j = 0; j < arr[i].distop.length; j++) {
                var date = new Date()
                // 获取现在时间、秒杀活动开始时间、秒杀活动结束时间的当天分钟数
                var currentTime = date.getHours() * 60 + date.getMinutes()
                var startTime = parseInt(arr[i].distop[j].todayStartTime.slice(0, 2)) * 60 + parseInt(arr[i].distop[j].todayStartTime.slice(3, 5))
                var endTime = parseInt(arr[i].distop[j].todayEndTime.slice(0, 2)) * 60 + parseInt(arr[i].distop[j].todayEndTime.slice(3, 5))
                if (endTime > currentTime && currentTime > startTime) {
                  arr[i].distop[j].timeType = 1
                } else if (startTime > currentTime) {
                  arr[i].distop[j].timeType = 2
                } else {
                  arr[i].distop[j].timeType = 3
                }
              }
            }
          }
          that.setData({
            Von: arr,
          })
          //有商品缓存
          var foodAdd = wx.getStorageSync('foodAdd')
          wx.removeStorageSync('foodAdd')
          var Von = arr
          if (foodAdd) {
            if (foodAdd.length > 0) {
              for (var z in foodAdd) {
                for (var i in Von) {
                  for (var j in Von[i].distop) {
                    if (foodAdd[z].goodsId == Von[i].distop[j].goodsId) {
                      var numb = foodAdd[z].numb
                      that.foodAdd(i, j, numb)
                    }
                  }
                }
              }
            }
          }
          //拼单处理
          if ((orderType == 0 || orderType == 5) && res.data.share.sharing && that.data.shareInitiator) {
            var shareId = res.data.share.shareId
            that.setData({
              shareId: shareId, //拼单id
              shareGoodsInfo: res.data.share.goodsInfo, //个人拼单商品缓存
              sharing: res.data.share.sharing, //是否是发起拼单人
            })
            that.fsRGetShareGoods() //正在拼单的时候执行每隔5秒刷新一遍拼单数据
          } else if (!that.data.shareInitiator) {
            that.setData({
              sharing: 1
            })
            that.joinShare(options) //加入拼单
          }
          //....拼单商品缓存
          if (that.data.shareGoodsInfo.length > 0) {
            that.setData({
              selectedGoodsNumb: that.data.selectedGoodsNumb + 1,
              noSelectedGoodsNumb: true
            })
            that.foodStorageSync();
          }
        }

        if (tk == 1) { //如果是团购优惠卷
          that.setData({
            distance_price: 0, //差多少钱起送
            tipsIfor: [], //满减的数据
          })
        } else {
          //砍价---
          if (res.data.info.kj == 1 && userId) {
            that.bargainOnload()
          }

          // 截取优惠信息
          var youh = res.data.info.youhui
          youh = youh.replace(/，/g, ',')
          var str = youh.split(",")
          var lenstr = str.length
          var tipsIfor = []
          for (var i = 0; i < lenstr; i++) {
            var cond = str[i].substring(str[i].indexOf("满") + 1, str[i].indexOf("减"));
            var result = str[i].substring(str[i].indexOf("减") + 1);
            var obj = {
              m: cond,
              j: result
            }
            tipsIfor.push(obj)
          }
          that.setData({
            distance_price: shopInfo.deliveryFreeMoney, //差多少钱起送
            tipsIfor: tipsIfor, //满减的数据
          })
        }


        wx.setNavigationBarTitle({
          title: shopInfo.shopName
        })

        //缓存店铺信息
        wx.setStorageSync('shopInfo', shopInfo)
        //获取处理红包优惠卷的信息
        that.hongbaoAndConpou(res.data);

        //计算左右两侧菜单商品的高度 用于做滚动特效
        that.leftRightTabHight()
        //商家休息中的判断
        if (shopInfo.shopAtive == 2 && ((shopInfo.reserve && orderType == 0) || (shopInfo.selfReserve && orderType == 5))) {
          that.isOpen();
        }

        // 商家是否开启了堂食预订里面的休息时间支持预订
        var date = new Date()
        var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
        var minutes = date.getMinutes() < 10 ? '0' + date.getHours() : date.getMinutes()
        var nowTime = hours + ':' + minutes
        var forward = false
        for (var i = 0, len = shopInfo.serviceTime.length; i < len; i++) {
          if (nowTime > shopInfo.serviceTime[i].serviceStartTime && nowTime < shopInfo.serviceTime[i].serviceEndTime) {
            forward = true
            break;
          }
        }
        if (forward || shopInfo.restTimeBook === 1) {
          that.setData({
            restTimeBookForward: true
          })
        }

        //控制显示隐藏添加商品的按钮
        var closeButton = that.data.closeButton
        if (orderType != 3 && that.data.shopType != 21 && that.data.shopType != 26) {
          if (shopInfo.shopAtive == 0 || (((!shopInfo.reserve && orderType == 0) || (!shopInfo.selfReserve && orderType == 5)) && shopInfo.shopAtive == 2)) {
            closeButton = false
          }
        } else if (that.data.shopType != 21 && that.data.shopType != 26) {
          if (shopInfo.shopAtive == 0 || !that.data.restTimeBookForward) {
            closeButton = false
          }
        }
        that.setData({
          closeButton: closeButton
        })

        // 设置必须分类的catId
        if (orderType !== '4') {
          for (var i = 0, len = arr.length; i < len; i++) {
            if (arr[i].required === 1) {
              that.setData({
                requiredCatId: arr[i].catId,
                requiredName: arr[i].catName
              })
              break;
            }
          }
        }
        if (!that.data.shareId) {
          that.setData({
            loading: true
          })
        }

      }
    })
  },
  //加入拼单
  joinShare: function(options) {
    var that = this
    var timestamp = (Date.parse(new Date())) / 1000
    var sign = MD5Util.sign(timestamp)
    wx.request({
      url: 'https://www.aftdc.com/wxapp/Desk/addOthers',
      data: {
        sign: sign,
        timestamp: timestamp,
        token: wx.getStorageSync('usersInfo').token,
        shopId: options.shopId,
        userId: options.userId,
        userName: that.data.usersInfo.userName,
        userPhoto: that.data.usersInfo.userPhoto
      },
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        if (res.data.res == 1) {
          that.setData({
            shareId: res.data.shareId
          })
          if (res.data.goodsStatus == 0) { //未选商品
            that.fsRGetShareGoods() //正在拼单的时候执行每隔5秒刷新一遍拼单数据
          } else {
            wx.navigateTo({
              url: '../collages/collages?shareId=' + that.data.shareId + '&shopId=' + that.data.shopId
            })
          }

        } else if (res.data.res == 0) {
          wx.showToast({
            title: res.data.info,
            icon: 'none',
            duration: 1500,
          })
          clearInterval(that.data.getShareGoodsTimer)
          that.getShareGoods();
          that.reSet()
        }
      }
    })
  },
  //获取处理红包优惠卷的信息
  hongbaoAndConpou: function(resData) {
    var that = this
    //判定红包
    var redPackets = resData.hongbao
    var redPacketsIdArr = that.data.conpouIdArr
    if (redPackets) {
      var orderRedPackets = true
      var redPacketslen = redPackets.length
      //计算优惠券总金额
      var redPacketsSum = 0
      for (var i in redPackets) {
        redPacketsSum += Number(redPackets[i].piece)
        redPacketsIdArr += redPackets[i].id + ","
        if (!redPackets[i].type) {
          var redPacketsState = true;
        } else {
          if (!redPacketsState) {
            var redPacketsState = false;
          }
        }
      }
      that.setData({
        redPacketsSum: redPacketsSum,
        redPacketsIdArr: redPacketsIdArr,
        redPacketsState: redPacketsState,
        redPackets: redPackets,
      })
      //优惠券长度
      if (redPacketslen > 1) {
        that.setData({
          redPacketsPresentNub: true,
        })
      } else {
        var OneRedPacketsMoney = redPackets[0].money
        that.setData({
          redPacketsPresentNub: false,
          OneRedPacketsMoney: OneRedPacketsMoney
        })
      }
    } else {
      var orderRedPackets = false
    }
    //判定优惠券
    var conpou = resData.coupon
    var conpouIdArr = that.data.conpouIdArr

    if (conpou) {
      var orderCoupon = true
      var conpoulen = conpou.length
      //计算优惠券总金额
      var couponSum = 0
      for (var i in conpou) {
        couponSum += Number(conpou[i].couponMoney)
        conpouIdArr += conpou[i].couponId + ","
        if (!conpou[i].type) {
          var conpouState = true;
        } else {
          var conpouState = false;
        }
      }
      that.setData({
        couponSum: couponSum,
        conpouIdArr: conpouIdArr,
        conpouState: conpouState,
      })
      //优惠券长度
      if (conpoulen > 1) {
        that.setData({
          presentNub: true,
        })
      } else {
        var OnespendMoney = conpou[0].spendMoney
        that.setData({
          presentNub: false,
          OnespendMoney: OnespendMoney
        })
      }
    } else {
      var orderCoupon = false
    }

    if (!conpou == '') {
      that.setData({
        conpou: conpou.reverse(),
      })
    }
    //获取信息
    that.setData({
      vip: resData.vip,
      conpoulen: conpoulen,
      orderCoupon: orderCoupon,
      orderRedPackets: orderRedPackets,
      redPacketslen: redPacketslen,
    })
  },
  //计算左右两侧菜单商品的高度 用于做滚动特效
  leftRightTabHight: function() {
    var that = this
    // 定义右侧标题的 rpx 高度 和 px 高度
    var right_titleRpxHeight = 70;
    var right_titleHeight;
    // 定义右侧单个商品的 rpx 高度 和 px 高度
    var right_contentRpxHeight = 168;
    var right_contentHeight;
    // 定义左侧单个tab的 rpx 高度 和 px 高度
    var left_titleRpxHeight = 104;
    var left_titleHeight;
    //  获取可视区屏幕高度
    wx.getSystemInfo({
      success: function(res) {
        // percent 为当前设备1rpx对应的px值
        var percent = res.windowWidth / 750;
        that.setData({
          right_titleHeight: Number(right_titleRpxHeight * percent),
          right_contentHeight: Number(right_contentRpxHeight * percent),
          left_titleHeight: Number(left_titleRpxHeight * percent)
        })
      }
    })
    // 把请求到的 list 中的数据赋值给  listChild1
    var listChild1 = that.data.Von;

    // 定义一个 names ，用于存放 scroll-into-view 使用的 id
    // var names = '';
    // 循环 listChild1 中的每一项
    for (var item in listChild1) {
      if (that.data.orderCoupon && item == 0) {
        var height = (listChild1[item].distop.length) * that.data.right_contentHeight + that.data.right_titleHeight + 70; //优惠卷的高度
      } else {
        var height = (listChild1[item].distop.length) * that.data.right_contentHeight + that.data.right_titleHeight
      }

      that.data.listHeight += ":" + height;
      that.setData({
        listHeight: that.data.listHeight
      })
    }
    var height = that.data.listHeight.substring(1).split(':');

    var heights = [];
    for (var i = 0; i < height.length; i++) {
      if (i == 0) {
        heights.push(Number(height[i]))
      } else {
        heights.push(Number(height[i]) + Number(heights[i - 1]))
      }

    }
    that.setData({
      heights: heights
    })
  },
  onReady: function() {},
  onShow: function() {
    var that = this
    //获取是否有拼单
    // var shareId = wx.getStorageSync('shareId');
    if (wx.getStorageSync('backThisAgain') == 0) { //从某个页面返回到这个页面是否重置所有数据
      this.allReSet()
      this.setData({
        otherSharer: [],
      })
      this.onLoad(this.data.options)
    }
    // if (wx.getStorageSync('updateShareOrder') == 1) {
    //   wx.removeStorageSync('updateShareOrder')
    //   that.updateShareOrder(); //判断订单是否锁定，再提示是否要进行修改
    // }
    if (that.data.changeCollage !== 0) {
      if (that.data.changeCollage === 1) {
        that.updateShareOrder(); //判断订单是否锁定，再提示是否要进行修改修改商品
      } else {
        clearInterval(that.data.getShareGoodsTimer)
        that.getShareGoods();
        that.reSet()
      }
      that.setData({
        updateShareOrder: false
      })

    }

    // var shareData = wx.getStorageSync('shareData');

    var shareId = that.data.shareId;
    if (shareId) {
      that.fsRGetShareGoods() //正在拼单的时候执行每隔5秒刷新一遍拼单数据

    }

    var route = this.data.route
    console.log(route)
    var that = this
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) { //登录了
          if (route == 'price') {
            that.price()
          } else if (route == 'shareOrder') {
            that.shareOrder()
          } else if (route == 'touchAttention') {
            that.touchAttention()
          } else if (route == 'onLoad') {
            that.onLoad(that.data.options)
          }
          that.data.route = null
        }
      }
    })
    this.setData({
      shopType: this.data.shopType,
    })
  },
  //判断订单是否锁定，再提示是否要进行修改
  updateShareOrder: function() {
    var that = this
    var timestamp = (Date.parse(new Date())) / 1000
    var sign = MD5Util.sign(timestamp)
    wx.request({
      url: 'https://www.aftdc.com/wxapp/Desk/checkGoodsStatus',
      data: {
        sign: sign,
        timestamp: timestamp,
        token: wx.getStorageSync('usersInfo').token,
        shareId: that.data.shareId
      },
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(res) {

        if (res.data.res == 1) {
          wx.showModal({
            title: '您已选好商品，是否要进行修改？',
            content: '修改商品后，需点击【选好了】，将商品同步给好友',
            showCancel: true,
            cancelText: '不改了',
            cancelColor: '#666',
            confirmText: '修改',
            confirmColor: '#53beb7',
            success: function(e) {
              if (e.confirm) {
                wx.request({
                  url: 'https://www.aftdc.com/wxapp/Desk/changeGoodsStatus',
                  data: {
                    sign: sign,
                    timestamp: timestamp,
                    token: wx.getStorageSync('usersInfo').token,
                    shareId: that.data.shareId
                  },
                  method: "POST",
                  header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                  },
                  success: function(com) {
                    if (com.data.res == 1) {
                      // that.onLoad(that.data.options)
                      //....拼单商品缓存
                      if (that.data.shareGoodsInfo.length > 0) {
                        that.setData({
                          updateGoodsNumb: that.data.updateGoodsNumb + 1,
                          noSelectedGoodsNumb: true,
                          selfUpdateGoods: true
                        })
                        // that.foodStorageSync();
                      }
                    }
                  },
                })
              }
              if (e.cancel) {
                wx.navigateTo({
                  url: '../collages/collages?shareId=' + that.data.shareId + '&shopId=' + that.data.shopId
                })
              }
            }
          })



        } else if (res.data.res == 0) {
          wx.showModal({
            title: '',
            content: res.data.info,
            showCancel: false,
            cancelText: '不改了',
            cancelColor: '#666',
            confirmText: '确定',
            confirmColor: '#53beb7',
            success: function(e) {
              if (e.confirm) {
                if (res.data.collagesStatus == -1) { //拼单已取消
                  clearInterval(that.data.getShareGoodsTimer)
                  that.getShareGoods();
                  that.allReSet();
                  var options = that.data.options
                  options.userId = '',
                    that.onLoad(options)
                } else { //拼单已锁定
                  wx.navigateTo({
                    url: '../collages/collages?shareId=' + that.data.shareId + '&shopId=' + that.data.shopId
                  })
                }

              }
            },
          })
        }
      }
    })
  },
  //5秒刷新
  fsRGetShareGoods: function() {
    var that = this
    clearInterval(that.data.getShareGoodsTimer)
    that.getShareGoods(); //获取其他人拼单数据
    var getShareGoodsTimer = setInterval(function() { //正在拼单的时候执行每隔5秒刷新一遍拼单数据
      that.getShareGoods(); //获取其他人拼单数据
    }, 5000)
    that.setData({
      getShareGoodsTimer: getShareGoodsTimer
    })
  },
  //拼单数据
  getShareGoods: function() {
    var that = this

    var timestamp = (Date.parse(new Date())) / 1000
    var sign = MD5Util.sign(timestamp)
    wx.request({
      url: 'https://www.aftdc.com/wxapp/Desk/getShareGoods',
      data: {
        sign: sign,
        timestamp: timestamp,
        token: wx.getStorageSync('usersInfo').token,
        shareId: that.data.shareId
      },
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(res) {

        if (res.data.res == 1) {
          var Von = that.data.Von
          var otherSharerOlder = that.data.otherSharer
          var selectedGoodsNumb = that.data.selectedGoodsNumb
          var updateGoodsNumb = that.data.updateGoodsNumb
          if (otherSharerOlder.length > 0) {
            for (var i = 0, len = otherSharerOlder.length; i < len; i++) {
              var shareFood = otherSharerOlder[i].goodsInfo
              for (var j in shareFood) {
                var mark = shareFood[j].mark //获取弹出盒子的弹出哪件商品标识
                var a = mark.substring(mark.indexOf("a") + 1, mark.indexOf("b"))
                var b = mark.substring(mark.indexOf("b") + 1)
                Von[a].distop[b].numb -= Number(shareFood[j].numb)
              }
              if (otherSharerOlder[i].goodsInfo.length > 0 && (otherSharerOlder[i].goodsStatus == 1 || otherSharerOlder[i].goodsStatus == 1)) {
                selectedGoodsNumb--
              } else if (otherSharerOlder[i].goodsInfo.length > 0 && otherSharerOlder[i].goodsStatus == 3) {
                updateGoodsNumb--
              }

            }
          }
          var otherSharer = res.data.otherSharer
          for (var i = 0, len = otherSharer.length; i < len; i++) {
            var shareFood = otherSharer[i].goodsInfo
            var goodsInfoBoxFee = 0 //餐盒费
            var goodsInfoTotalPrice = 0 //总价
            var goodsInfoNumb = 0 //总数量
            var goodsInfoTotalMarketPrice = 0 //总原价
            for (var j in shareFood) {

              var mark = shareFood[j].mark //获取弹出盒子的弹出哪件商品标识
              var a = mark.substring(mark.indexOf("a") + 1, mark.indexOf("b"))
              var b = mark.substring(mark.indexOf("b") + 1)
              if (!Von[a].distop[b].numb) {
                Von[a].distop[b].numb = 0
              }
              Von[a].distop[b].numb += Number(shareFood[j].numb)
              goodsInfoBoxFee += Number(shareFood[j].boxFee) * Number(shareFood[j].numb)
              goodsInfoTotalPrice += Number(shareFood[j].totalPrice)
              goodsInfoTotalMarketPrice += Number(shareFood[j].totalMarketPrice)
              goodsInfoNumb += Number(shareFood[j].numb)
            }
            otherSharer[i].goodsInfoBoxFee = goodsInfoBoxFee //餐盒费
            otherSharer[i].goodsInfoTotalPrice = goodsInfoTotalPrice + goodsInfoBoxFee //总价
            otherSharer[i].goodsInfoTotalMarketPrice = goodsInfoTotalMarketPrice + goodsInfoBoxFee //总价
            otherSharer[i].goodsInfoNumb = goodsInfoNumb //总数量
            // that.sum()
            if (otherSharer[i].goodsInfo.length > 0 && (otherSharer[i].goodsStatus == 1 || otherSharer[i].goodsStatus == 2)) {
              selectedGoodsNumb++
            } else if (otherSharer[i].goodsInfo.length > 0 && otherSharer[i].goodsStatus == 3) {
              updateGoodsNumb++
            }

          }
          that.setData({
            otherSharer: otherSharer,
            Von: Von,
            selectedGoodsNumb: selectedGoodsNumb,
            updateGoodsNumb: updateGoodsNumb,
          })
          that.allShareSum()

        }
        that.setData({
          loading: true,
        })
      }
    })

  },
  //其他拼友的金额处理
  allShareSum: function() {
    var that = this
    var otherSharer = that.data.otherSharer
    console.log(otherSharer)
    var shareTotalPrice = 0
    var shareNumb = 0
    var allTotalMarketPrice = 0
    for (var i = 0, len = otherSharer.length; i < len; i++) {
      shareTotalPrice += otherSharer[i].goodsInfoTotalPrice
      allTotalMarketPrice += otherSharer[i].goodsInfoTotalMarketPrice
      shareNumb += otherSharer[i].goodsInfoNumb
    }
    //
    shareTotalPrice += Number(that.data.totalprice)
    allTotalMarketPrice += Number(that.data.totalMarketPrice)
    //格式化
    shareTotalPrice = Number(shareTotalPrice).toFixed(2)
    allTotalMarketPrice = Number(allTotalMarketPrice).toFixed(2)
    //
    shareNumb += Number(that.data.totalnumb)
    that.setData({
      shareTotalPrice: shareTotalPrice,
      shareNumb: shareNumb,
    })
    if (that.data.orderType == 0) { //外卖 免费配送
      var dfm = this.data.shopInfo.deliveryFreeMoney
    } else if (that.data.orderType == 5) { //到店自取
      var dfm = this.data.shopInfo.selfDeliveryFreeMoney
    }

    var distance_price = parseInt(dfm * 100 - allTotalMarketPrice * 100) / 100
    if (distance_price > 0) {
      this.setData({
        distance_price: distance_price,
        shopcar: false,
      })
    } else if (distance_price == 0 && dfm==0){
      this.setData({
        distance_price: distance_price,
        shopcar: false,
      })

      }else {
      this.setData({
        distance_price: false,
        shopcar: true,
      })
    }


  },
  //每隔5秒刷新一遍拼单数据
  foodStorageSync: function() {
    var that = this
    var car = that.data.car
    var Von = that.data.Von
    // if (that.data.id) {
    // var shareFood = wx.getStorageSync('shareFood');
    var shareFood = that.data.shareGoodsInfo

    for (var i in shareFood) {
      var obj = {
        arr: shareFood[i],
        mark: shareFood[i].mark
      }
      car.push(obj)
      var mark = shareFood[i].mark //获取弹出盒子的弹出哪件商品标识
      var a = mark.substring(mark.indexOf("a") + 1, mark.indexOf("b"))
      var b = mark.substring(mark.indexOf("b") + 1)
      if (!Von[a].distop[b].numb) {
        Von[a].distop[b].numb = 0
      }
      Von[a].distop[b].numb += Number(shareFood[i].numb)
    }

    that.setData({
      car: car,
      Von: Von
    })
    console.log(that.data.Von)
    that.sum()
    // }
  },
  scroll(event) {
    if (this.data.orderType !== '4') {

      var that = this

      var height = this.data.heights;


      var index = 0;
      var num = 0;
      for (var i = 0; i < height.length; i++) {

        if (height[i] > event.detail.scrollTop) {

          index = i;
          // // 如果右侧滑栏滚动高度小于单个类别高度的 1/2 时，index 为 0
          // if (event.detail.scrollTop < height[0] / 2) {
          //   index = 0;
          // }
          break;
        }

      }
      var left_scrollTop = this.data.left_titleHeight * index
      if (index != this.data.foodindex) {
        clearTimeout(that.data.timer)
        that.data.timer = setTimeout(function() {

          that.setData({
            scrollTop: left_scrollTop,
            foodindex: index
          })

        }, 100)

      }
    }

  },
  //商家休息中的判断
  isOpen: function() {
    var that = this
    var shopInfo = that.data.shopInfo
    if (that.data.orderType == 5) {
      var scheduledDate = shopInfo.selfScheduledDate
    } else {
      var scheduledDate = shopInfo.scheduledDate
    }
    var presetTime = []
    scheduledDate = scheduledDate.split(",");
    var now = util.formatTimes(new Date)
    now = util.formateIOS(now)
    var dateN = util.formatTime(new Date)
    var datestr = util.formateIOS(dateN + ' ' + "00:00:00")
    var endTime = util.formateIOS(dateN + ' ' + shopInfo.serviceTime[shopInfo.serviceTime.length - 1].serviceEndTime + ":00")
    if (scheduledDate.length == 1 && scheduledDate[0] == 1) {
      if (that.data.shopType == 3) {
        shopInfo.selfReserve = 0
      } else {
        shopInfo.reserve = 0
      }
    }

    for (var i in scheduledDate) {
      var today = util.addDay(datestr, scheduledDate[i] - 1)
      today = today.substring(5)
      if (scheduledDate[i] == 1) {
        today = '今天'
      }
      if (scheduledDate[i] == 2) {
        today = '明天'
      }
      var presetTimeItem = {
        days: scheduledDate[i] - 1,
        today: today
      }
      presetTime.push(presetTimeItem)

    }
    if (now > endTime && presetTime[0].days == 0) { //如果当前时间超出结束营业时间且预订时间含有今天则删除掉今天
      presetTime.splice(0, 1)
    }
    this.setData({
      presetTime: presetTime,

    })
    if (presetTime[0].days == 0) {
      for (var i = shopInfo.serviceTime.length - 1; i >= 0; i--) { //商家休息的时候，reserveTime的值
        if (now > util.formateIOS(dateN + ' ' + shopInfo.serviceTime[i].serviceEndTime + ":00")) {
          if (i == shopInfo.serviceTime.length - 1) {
            var presetStartTime = shopInfo.serviceTime[0].serviceStartTime
          } else {
            var presetStartTime = shopInfo.serviceTime[i + 1].serviceStartTime
          }
          break;
        } else {
          var presetStartTime = shopInfo.serviceTime[0].serviceStartTime
        }
      }
    } else {
      var presetStartTime = shopInfo.serviceTime[0].serviceStartTime
    }

    // if (now > endTime) {

    // } 
    that.setData({
      shopInfo: shopInfo,
      presetStartTime: presetStartTime
    })
  },
  //初始化砍价信息
  bargainOnload: function() {

    var that = this
    var shopId = that.data.shopId
    var userId = wx.getStorageSync('usersInfo').userId
    var timestamp = (Date.parse(new Date())) / 1000
    var sign = MD5Util.sign(timestamp)
    wx.request({
      url: 'https://www.aftdc.com/wxapp/Shop/getUserbargain',
      data: {
        sign: sign,
        timestamp: timestamp,
        token: wx.getStorageSync('usersInfo').token,
        shopId: shopId
      },
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        if (res.data.res == 0) {
          return false;
        }
        var all = that.data.Von;
        var lenall = all.length;
        var kanIndex = ''; //随便预定义，如果没获取到新值，证明没有砍价活动
        for (var i = 0; i < lenall; i++) {
          if (all[i].catId == 1) {
            kanIndex = i;
            break;
          }
        }

        var goods = all[kanIndex].distop;
        var len = goods.length;
        for (var i = 0; i < len; i++) {
          goods[i].percent = 100; //插入控制砍价的长度比
        }
        //砍价记录
        var bargain = res.data.data;

        var datasL = bargain.length
        for (var i = 0; i < len; i++) {
          var goodsId = goods[i].goodsId;
          for (var j = 0; j < datasL; j++) {
            var id = bargain[j].goodsId;
            if (id == goodsId) {
              goods[i].percent = bargain[j].percent;
              goods[i].result = bargain[j].result;
              if (bargain[j].type == 2) {
                goods[i].shopPrice = bargain[j].result.toFixed(2);
              }
              goods[i].bargainType = bargain[j].type
              goods[i].bargainNo = bargain[j].bargainNo
            }
          }
        }
        all[kanIndex].distop = goods
        that.setData({
          Von: all,
          bargain: bargain, //缓存
        })
      }
    })
  },
  //店铺详情
  shopdetail: util.throttle(function() {
    var that = this;
    wx.navigateTo({
      url: '../shopdetail/shopdetail?shopId=' + that.data.shopId + '&attentionType=' + that.data.attentionType,
    })
  }),
  //选择菜品分类
  selectMenu: function(e) {
    var index = e.currentTarget.dataset.index;
    this.setData({
      toView: 'order' + index.toString(),
      foodindex: index
    })
  },
  selectfood: function(e) {
    var index = e.currentTarget.dataset.index;
    this.setData({
      foodname: 'name' + index.toString(),
      foodindex: index
    })
  },
  sub: function(e) { //减
    var that = this
    var index = e.currentTarget.dataset.index;
    var foodindex = e.currentTarget.dataset.foodindex;
    var Von = this.data.Von
    if (Von[index].distop[foodindex].numb <= 0) {
      return false
    }

    var mark = 'a' + index + 'b' + foodindex
    var otherSharer = that.data.otherSharer
    if (otherSharer.length > 0) {
      for (var i = 0, len = otherSharer.length; i < len; i++) {

        var shareFood = otherSharer[i].goodsInfo
        for (var j in shareFood) {
          var shareFoodMark = shareFood[j].mark //获取弹出盒子的弹出哪件商品标识
          if (shareFoodMark == mark && Von[index].distop[foodindex].numb == shareFood[j].numb) {
            return false
          }

        }
      }
    }

    //n份限购，当商品的数量等于最小限购数，那么减去该商品的数量后为0
    if (Von[index].distop[foodindex].buyMininum > 1 && Von[index].distop[foodindex].buyMininum == Von[index].distop[foodindex].numb) {
      Von[index].distop[foodindex].numb = 0
    } else {
      Von[index].distop[foodindex].numb--
    }
    this.setData({
      Von: Von
    })


    var arr = Von[index].distop[foodindex]
    if (otherSharer.length > 0) {
      for (var i = 0, len = otherSharer.length; i < len; i++) {

        var shareFood = otherSharer[i].goodsInfo
        for (var j in shareFood) {
          var shareFoodMark = shareFood[j].mark //获取弹出盒子的弹出哪件商品标识
          if (shareFoodMark == mark) {
            arr.numb = arr.numb - Number(shareFood[j].numb)
          }
        }
      }
    }
    var boxFee = this.data.boxFee
    var deskNum = this.data.deskNum
    if (deskNum == -1) {
      if (arr['boxFee'] == '1') {
        start--
        var boxFees = start * boxFee
        this.setData({
          boxFees: boxFees
        })
      }
    }

    var car = this.data.car
    arr.userId = wx.getStorageSync('usersInfo').userId
    var obj = {
      arr: arr,
      mark: mark
    };
    var car1 = car.filter(item => item.mark != mark)
    if (arr.numb > 0) {
      car1.push(obj)
      this.setData({
        car: car1
      })
    } else {
      for (var i in car) {
        if (mark == car[i].mark) {
          car.splice(i, 1)
          this.setData({
            car: car
          })
          this.sum()
          return
        }
      }
    }
    that.zkPrice(index, foodindex) //折扣价格处理
    this.sum()
  },

  add: function(e) { //加
    var grouptype = e.currentTarget.dataset.grouptype
    if (grouptype == 1) {
      wx.showToast({
        title: '只能选择一种团购商品',
        icon: 'none',
        duration: 1500,
      })
      return false
    }


    var index = e.currentTarget.dataset.index;
    var foodindex = e.currentTarget.dataset.foodindex;
    var Von = this.data.Von
    var that = this
    if ((parseInt(Von[index].distop[foodindex].goodsStock) == 0) || ((parseInt(Von[index].distop[foodindex].goodsStock) <= Von[index].distop[foodindex].numb) && (parseInt(Von[index].distop[foodindex].goodsStock) != -1))) {
      wx.showToast({
        title: '没有库存了',
        content: '该订单部分商品库存不足',
        icon: 'loading',
        duration: 2000,
        success: function() {
          Von[index].distop[foodindex].numb = Von[index].distop[foodindex].numb
          that.setData({
            Von: Von
          })
          return false
        }
      })
      return false
    }

    if (parseInt(Von[index].distop[foodindex].isSale) == 0) {
      wx.showToast({
        title: '商品已下架',
        content: '该订单部分商品已下架',
        icon: 'loading',
        duration: 2000,
        success: function() {
          Von[index].distop[foodindex].numb = Von[index].distop[foodindex].numb
          that.setData({
            Von: Von
          })
          return false
        }
      })
      return false
    }
    //秒杀商品限制购买数量
    if (Von[index].distop[foodindex].killId && Von[index].distop[foodindex].numb === Von[index].distop[foodindex].buyNum) {
      wx.showToast({
        title: '此秒杀商品限购' + Von[index].distop[foodindex].buyNum + '份',
        icon: 'none',
        duration: 1500,
      })
      return false
    }

    if (!Boolean(Von[index].distop[foodindex].numb)) {
      Von[index].distop[foodindex].numb = 0
    }
    //n份起购，如果商品有n份起购，那么第一次添加此商品的数量为最小起购数量
    if (Von[index].distop[foodindex].buyMininum > 1 && Von[index].distop[foodindex].numb < Von[index].distop[foodindex].buyMininum) {
      Von[index].distop[foodindex].numb = Von[index].distop[foodindex].buyMininum
    } else {
      Von[index].distop[foodindex].numb++
    }

    this.setData({
      Von: Von
    })
    var car = this.data.car
    var arr = Von[index].distop[foodindex]
    var mark = 'a' + index + 'b' + foodindex
    arr.userId = wx.getStorageSync('usersInfo').userId

    var otherSharer = that.data.otherSharer
    if (otherSharer.length > 0) {
      for (var i = 0, len = otherSharer.length; i < len; i++) {

        var shareFood = otherSharer[i].goodsInfo
        for (var j in shareFood) {
          var shareFoodMark = shareFood[j].mark //获取弹出盒子的弹出哪件商品标识
          if (shareFoodMark == mark) {
            arr.numb -= Number(shareFood[j].numb)
          }

        }
      }
    }

    if (arr.bargainId && arr.numb == 2) {
      wx.showToast({
        title: '砍价商品限购1份,超过1份恢复原价',
        icon: 'none',
        duration: 1500,
      })
    }
    if (arr.zkGoodsId && arr.buyNum != -1 && Number(arr.numb) == Number(arr.buyNum) + 1) {
      wx.showToast({
        title: '此折扣商品限优惠' + arr.buyNum + '份,超过' + arr.buyNum + '份恢复原价',
        icon: 'none',
        duration: 1500,
      })
    }



    var boxFee = this.data.boxFee
    var deskNum = this.data.deskNum
    if (deskNum == -1) {
      if (arr['boxFee'] == '1') {
        start++
        var boxFees = start * boxFee
        this.setData({
          boxFees: boxFees
        })
      }
    }


    var obj = {
      arr: arr,
      mark: mark
    };
    var car1 = car.filter(item => item.mark != mark)
    if (obj.arr.type == 2) {
      if (car1.length > 0) {
        wx.showToast({
          title: '团购商品不可与其他商品同时购买',
          icon: 'loading',
          duration: 1500
        })
        Von[index].distop[foodindex].numb = 0
        this.setData({
          Von: Von
        })
      } else {
        car1.push(obj)
        this.setData({
          car: car1
        })
        this.price()
      }
    } else {
      car1.push(obj)
      this.setData({
        car: car1
      })
    }

    var cars = this.data.car
    that.zkPrice(index, foodindex) //折扣价格处理
    this.sum()
  },
  //总数
  sum: function(index, foodindex) {
    var that = this
    var totalprice = 0
    var totalnumb = 0
    var totalMarketPrice = 0
    var car = this.data.car
    this.totalPrices(); //计算每件商品的总价和餐盒费
    // for(let i in car){

    // }

    var zkNumb = this.data.zkNumb
    this.setData({
      zkshow: true,
    })
    var types = true
    for (var i = 0; i < car.length; i++) {
      //商品存在 type=1为不享受活动
      if (Boolean(car[i].arr.type) && types) {
        types = false;
      }
      totalprice += Number(car[i].arr.totalPrice);
      totalMarketPrice += car[i].arr.shopPrice * car[i].arr.numb;
      totalnumb += car[i].arr.numb
      if (Boolean(zkNumb)) {
        var mark = car[i].mark
        var a = mark.substring(mark.indexOf("a") + 1, mark.indexOf("b"))
        if (a == Number(zkNumb) - 1) {
          this.setData({
            zkshow: false,
          })
          zkNumb = false
        }
      }
    }
    if (this.data.boxFee && this.data.shopType != 2) {
      totalprice = Number(totalprice) + Number(this.data.boxFee)
    }
    totalMarketPrice = Number(totalMarketPrice)
    totalprice = Number(totalprice).toFixed(2)
    totalMarketPrice = Number(totalMarketPrice).toFixed(2)
    this.setData({
      totalprice: totalprice,
      totalnumb: totalnumb,
      totalMarketPrice: totalMarketPrice,
      discount: types, //是否能享受优惠
    })

    //判断起送价和起订价
    if (this.data.id == undefined) {
      //外卖或到店自取的起送价
      if (this.data.orderType == 0) {
        var dfm = this.data.shopInfo.deliveryFreeMoney
        var distance_price = parseInt(dfm * 100 - totalMarketPrice * 100) / 100
      }
      //到店自取的起购价
      if (this.data.orderType == 5) {
        var dfm = this.data.shopInfo.selfDeliveryFreeMoney
        var distance_price = parseInt(dfm * 100 - totalMarketPrice * 100) / 100
      }

      //堂食预订起订价
      if (this.data.orderType == 3) {
        var bookingMoney = this.data.shopInfo.bookingMoney;
        var distance_price = parseInt(bookingMoney * 100 - totalMarketPrice * 100) / 100
      }

      if (distance_price > 0) {
        this.setData({
          distance_price: distance_price,
          shopcar: false,
        })
      } else if (car.length < 1) {
        this.setData({
          shopcar: false
        })
      } else {
        this.setData({
          distance_price: false,
          shopcar: true,
        })
      }
    } else {
      this.setData({
        shopcar: true
      })

    }

    console.log(that.data.shareId)
    if (that.data.shareId) { //如果正在拼单 计算所有人的商品合计
      that.allShareSum();
    }
    //不能享受优惠就不走下面的计算
    if (types) {

      //满减
      var tipsIfor = this.data.tipsIfor
      var lenTips = tipsIfor.length
      var tipsIforEnd = -1
      var tipsIforData = {}
      for (var i = 0; i < lenTips; i++) {
        var m = Number(tipsIfor[i].m)
        if (m && m <= totalprice) {
          tipsIforEnd = i
        }
      }
      var Ends = tipsIforEnd + 1
      if (tipsIforEnd < 0) {
        var againM = parseInt(tipsIfor[0].m * 100 - totalprice * 100) / 100
        tipsIforData.againM = againM;
        tipsIforData.againJ = tipsIfor[0].j;
        var deduction = 0 //优惠金额
      } else if (tipsIforEnd >= 0 && Ends < lenTips) { //有立减，而且后面还存在金额更大的立减
        var againM = parseInt(tipsIfor[Ends].m * 100 - totalprice * 100) / 100
        tipsIforData.againM = againM;
        tipsIforData.againJ = tipsIfor[Ends].j;
        tipsIforData.resultJ = tipsIfor[tipsIforEnd].j;
        var deduction = tipsIfor[tipsIforEnd].j; //优惠金额
      } else if (tipsIforEnd == lenTips - 1) {
        tipsIforData.endM = tipsIfor[tipsIforEnd].m;
        tipsIforData.endJ = tipsIfor[tipsIforEnd].j;
        var deduction = tipsIfor[tipsIforEnd].j; //优惠金额
      }
      this.setData({
        tipsIforData: tipsIforData,
        deduction: deduction
      })
    }
    //如果正在拼单则每改变一次数据接一次接口
    if (this.data.sharing == 1 && this.data.shareInitiator) {
      var goodsInfo = []
      for (var i in car) {
        goodsInfo[i] = car[i].arr
        goodsInfo[i].mark = car[i].mark
      }
      //改变已完成人数
      if (!that.data.noSelectedGoodsNumb && goodsInfo.length > 0) {
        that.setData({
          selectedGoodsNumb: that.data.selectedGoodsNumb + 1,
          noSelectedGoodsNumb: true,
        })
      } else if (goodsInfo.length == 0) {
        that.setData({
          selectedGoodsNumb: that.data.selectedGoodsNumb - 1,
          noSelectedGoodsNumb: false,
        })
      }
      clearTimeout(that.data.addShareGoodsTimer)
      var addShareGoodsTimer = setTimeout(function() {
        that.addShareGoodsFn(goodsInfo)
      }, 2000)
      that.setData({
        addShareGoodsTimer: addShareGoodsTimer
      })
    }
  },
  //添加拼单商品
  addShareGoodsFn: function(goodsInfo) {
    var that = this
    var timestamp = (Date.parse(new Date())) / 1000
    var sign = MD5Util.sign(timestamp)
    wx.request({
      url: 'https://www.aftdc.com/wxapp/Desk/addShareGoods',
      data: {
        sign: sign,
        timestamp: timestamp,
        token: wx.getStorageSync('usersInfo').token,
        userName: that.data.usersInfo.userName,
        userPhoto: that.data.usersInfo.userPhoto,
        shareId: that.data.shareId,
        shopId: that.data.shopId,
        goodsInfo: JSON.stringify(goodsInfo),
      },
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        if (res.data.res == 1) {


        }
      }
    })
  },
  //计算每件商品的总价
  totalPrices: function() {
    var that = this
    var car = that.data.car
    var boxFee = 0


    for (var i in car) {
      if (car[i].arr.bargainId && car[i].arr.numb > 1) {
        car[i].arr.totalPrice = (Number(car[i].arr.shopPrice) + Number(car[i].arr.marketPrice) * (Number(car[i].arr.numb) - 1)).toFixed(2)
      } else if (car[i].arr.zkGoodsId) {

      } else {
        car[i].arr.totalPrice = (Number(car[i].arr.shopPrice) * Number(car[i].arr.numb)).toFixed(2)
      }
      car[i].arr.totalMarketPrice = (Number(car[i].arr.marketPrice) * Number(car[i].arr.numb)).toFixed(2)
      boxFee += Number(car[i].arr.boxFee) * Number(car[i].arr.numb)
    }
    that.setData({
      car: car,
      boxFee: boxFee
    })
  },
  //获取点击的规格
  size: function(e) {
    var index = e.target.dataset.size
    var val = e.target.dataset.val
    var box = this.data.box //获取弹出盒子的数据
    var goodsId = box.goodsId
    box.choose = index //点击变色
    var mark = box.mark;
    var a = mark.substring(mark.indexOf("a") + 1, mark.indexOf("b"))
    var b = mark.substring(mark.indexOf("b") + 1)
    var Von = this.data.Von
    box.shopPrice = Von[a].distop[b].guige[index].price
    box.goodsStock = Von[a].distop[b].guige[index].stock
    Von[a].distop[b].goodsStock = Von[a].distop[b].guige[index].stock //把规格里的库存赋给商品总库存
    box.spec_size = val
    this.setData({
      Von: Von
    })
    this.checkBox(box)
  },
  taste: function(e) {
    var index = e.target.dataset.index
    var ind = e.target.dataset.taste
    var val = e.target.dataset.val
    var box = this.data.box //获取弹出盒子的数据
    box.guigeAttr[index].choose = ind //点击变色
    this.data.spec_taste[index] = val
    box.spec_taste = ''
    for (var i in box.guigeAttr) {
      if (this.data.spec_taste[i])
        box.spec_taste += this.data.spec_taste[i] + (box.guigeAttr.length > 1 && i != box.guigeAttr.length - 1 ? '+' : '')
    }
    this.checkBox(box)
  },
  // 判断是否选好了
  checkBox: function(box) {
    if (box.guige) {
      if (!box.choose && box.choose !== 0) {
        box.nochooseGG = true;
      } else {
        box.nochooseGG = false
      }
    }
    if (box.guigeAttr) {
      for (var i in box.guigeAttr) {
        if (!box.guigeAttr[i].choose && box.guigeAttr[i].choose !== 0) {
          box.nochooseAttr = true;
          break;
        } else {
          box.nochooseAttr = false
        }
      }
    }

    this.setData({
      box: box,
    })
  },
  //隐藏详情弹出框
  hidden: function(e) {
    this.setData({
      boxshow: false
    })
  },
  //详情弹出框
  boxshow: function(e) {
    var index = e.currentTarget.dataset.index;
    var foodindex = e.currentTarget.dataset.foodindex;
    var goodsType = e.currentTarget.dataset.type;
    //对应左边类目
    var Von = this.data.Von

    //如果为砍价
    if (Von[index].catId == 1) {
      this.bargainBoxShow(index, foodindex);
      return false
    }

    //
    var box = Von[index].distop[foodindex]
    box.catId = Von[index].catId
    var mark = 'a' + index + 'b' + foodindex
    box.mark = mark
    //规格
    this.checkBox(box)
    this.setData({
      box: box,
      boxshow: true,
      goodsType: goodsType
    })
  },
  killshow: function(e) {
    var index = e.currentTarget.dataset.index;
    var box = this.data.goodsKill[index]
    this.setData({
      box: box,
      boxshow: true
    })
  },
  //选好了
  ok: function(e) {
    var grouptype = e.currentTarget.dataset.grouptype
    if (grouptype == 1) {
      wx.showToast({
        title: '只能选择一种团购商品',
        icon: 'none',
        duration: 1500,
      })
      return false
    }
    var box = this.data.box
    var mark = box.mark //获取弹出盒子的弹出哪件商品标识
    var a = mark.substring(mark.indexOf("a") + 1, mark.indexOf("b"))
    var b = mark.substring(mark.indexOf("b") + 1)
    var Von = this.data.Von

    Von[a].distop[b].shopPrice = box.shopPrice
    Von[a].distop[b].spec_size = box.spec_size
    Von[a].distop[b].spec_taste = box.spec_taste
    Von[a].distop[b].goodsAttrName = (Von[a].distop[b].spec_size ? Von[a].distop[b].spec_size : "") + (Von[a].distop[b].spec_size && Von[a].distop[b].spec_taste ? '+' : '')
    Von[a].distop[b].goodsAttrName += Von[a].distop[b].spec_taste ? Von[a].distop[b].spec_taste : ""
    Von[a].distop[b].decide = box.decide
    this.setData({
      Von: Von,
      boxshow: false,
      bargainTogle: false, //砍价弹出框
    })
    var Von = this.data.Von

    var that = this
    var goodsStock = Von[a].distop[b].goodsStock
    var numb = Von[a].distop[b].numb
    for (var i in this.data.car) {
      if (this.data.car[i].arr.spec_size && Von[a].distop[b].spec_size == this.data.car[i].arr.spec_size) {
        numb = this.data.car[i].arr.numb
        break;
      } else {
        numb = 0
      }
    }
    if ((parseInt(goodsStock) == 0) || ((parseInt(goodsStock) <= numb) && (parseInt(goodsStock) != -1))) {
      wx.showToast({
        title: '没有库存了',
        content: '该订单部分商品库存不足',
        icon: 'loading',
        duration: 2000,
        success: function() {
          Von[a].distop[b].numb = Von[a].distop[b].numb
          that.setData({
            Von: Von
          })
          //要延时执行的代码
          return false
        }
      })
      return false
    }
    if (parseInt(Von[a].distop[b].isSale) == 0) {
      wx.showToast({
        title: '商品已下架',
        content: '该订单部分商品已下架',
        icon: 'loading',
        duration: 2000,
        success: function() {
          Von[a].distop[b].numb = Von[a].distop[b].numb
          that.setData({
            Von: Von
          })
          return false
        }
      })
      return false
    }

    if (isNaN(Von[a].distop[b].numb)) {
      Von[a].distop[b].numb = 0
    }

    Von[a].distop[b].numb++
      this.setData({
        Von: Von
      })
    var car = this.data.car
    var arr = JSON.parse(JSON.stringify(Von[a].distop[b])) //也可以是  var arr=box
    //var car2 = car.filter(item => item.arr.spec_size == arr.spec_size && item.arr.spec_taste == arr.spec_taste)

    //	if (car2.length > 0) {
    //	arr.numb = car2[0].arr.numb + 1
    //} else {
    //		arr.numb = 1
    //	}
    if (arr.bargainId && arr.numb == 2) {
      wx.showToast({
        title: '砍价商品限购1份,超过1份恢复原价',
        icon: 'none',
        duration: 1500,
      })
    }
    if (arr.zkGoodsId && arr.buyNum != -1 && Number(arr.numb) == Number(arr.buyNum) + 1) {
      wx.showToast({
        title: '此折扣商品限优惠' + arr.buyNum + '份,超过' + arr.buyNum + '份恢复原价',
        icon: 'none',
        duration: 1500,
      })
    }
    var car1 = car //.filter(item => item.arr.spec_size != arr.spec_size || item.arr.spec_taste != arr.spec_taste)

    if (car1.filter(item => item.arr.goodsId == arr.goodsId && item.arr.spec_size == arr.spec_size && item.arr.spec_taste == arr.spec_taste).length > 0) {
      car1.filter(item => item.arr.goodsId == arr.goodsId && item.arr.spec_size == arr.spec_size && item.arr.spec_taste == arr.spec_taste)[0].arr.numb++;

    } else {
      //n份起购，如果商品有n份起购，那么第一次添加此商品的数量为最小起购数量
      if (arr.buyMininum > 1) {
        arr.numb = arr.buyMininum
      } else {
        arr.numb = 1;
      }
      arr.userId = wx.getStorageSync('usersInfo').userId

      var obj = {
        arr: arr,
        mark: mark
      };
      car1.push(obj)
    }


    this.setData({
      car: car1,
    })
    that.zkPrice(a, b) //折扣价格处理
    this.sum()
  },
  //折扣价格处理
  zkPrice(a, b) {
    var that = this
    var Von = that.data.Von
    var car1 = that.data.car
    var otherSharer = that.data.otherSharer
    console.log(car1)
    if (Von[a].distop[b].zkGoodsId) {
      var preferentialNumb = 0 //优惠数量

      // if (that.data.shareId && otherSharer.length>0){
      //   for (var i = 0, len = otherSharer.length; i < len; i++) {

      //     var shareFood = otherSharer[i].goodsInfo
      //     for (var j in shareFood) {
      //       if (shareFood[j].zkGoodsId && shareFood[j].zkGoodsId == Von[a].distop[b].zkGoodsId){
      //         preferentialNumb += Number(shareFood[j].numb)
      //       }
      //     }
      //   }
      // }


      for (var i = car1.length - 1; i >= 0; i--) {
        if (car1[i].arr.buyNum != -1) {
          if (car1[i].arr.zkGoodsId == Von[a].distop[b].zkGoodsId) {

            if (preferentialNumb < car1[i].arr.buyNum) {
              if (car1[i].arr.numb >= car1[i].arr.buyNum - preferentialNumb) {
                car1[i].arr.preferentialNumb = Number(car1[i].arr.buyNum) - preferentialNumb
              } else {
                car1[i].arr.preferentialNumb = Number(car1[i].arr.numb)
              }
            } else {
              car1[i].arr.preferentialNumb = 0
            }
            // } else {
            //     car1[i].arr.preferentialNumb = Number(car1[i].arr.numb)
            // }
            preferentialNumb += car1[i].arr.preferentialNumb
            if (car1[i].arr.preferentialNumb != 0) {
              if (car1[i].arr.buyNum != -1 && Number(car1[i].arr.numb) > Number(car1[i].arr.preferentialNumb)) {
                car1[i].arr.totalPrice = (Number(car1[i].arr.shopPrice) * Number(car1[i].arr.preferentialNumb) + Number(car1[i].arr.marketPrice) * (Number(car1[i].arr.numb) - Number(car1[i].arr.preferentialNumb))).toFixed(2)
              } else {
                car1[i].arr.totalPrice = (Number(car1[i].arr.shopPrice) * Number(car1[i].arr.numb)).toFixed(2)
              }
            } else {
              car1[i].arr.totalPrice = (Number(car1[i].arr.marketPrice) * Number(car1[i].arr.numb)).toFixed(2)
            }
          }
        }
      }
    }
    that.setData({
      car: car1
    })
  },
  //购物总数弹出框
  shopp: function(e) {
    var car = this.data.car
    if (car.length > 0 || this.data.otherSharer.length > 0) {
      this.setData({
        tipss: true,
      });
      var animation = wx.createAnimation({
        duration: 300,
        timingFunction: "linear",
        delay: 0,
      })
      this.animation = animation
      animation.translateY(300).step()
      setTimeout(function() {
        this.setData({
          tipss: false,
        });
      }.bind(this), 600)
      this.setData({
        animationData: animation.export()
      })
      if (e.currentTarget.dataset.serve == 1) {
        this.setData({
          goods: true
        });
      }
      setTimeout(function() {
        animation.translateY(0).step()
        this.setData({
          animationData: animation.export()
        })
        if (e.currentTarget.dataset.serve == 0) {
          this.setData({
            tipss: false,
            goods: false
          });
        }
      }.bind(this), 300)
    } else {
      this.setData({
        tipss: false,
        goods: false
      });
    }
  },
  //购物总数弹出框的·减
  buysub: function(e) {
    var that = this
    var i = e.currentTarget.dataset.i;

    var car = this.data.car
    if (!car[i]) {
      return false
    }
    //n份限购，当商品的数量等于最小限购数，那么减去该商品的数量后为0
    if (car[i].arr.buyMininum > 1 && car[i].arr.buyMininum == car[i].arr.numb) {
      car[i].arr.numb = 0
    } else {
      car[i].arr.numb--
    }
    var mark = car[i].mark
    var a = mark.substring(mark.indexOf("a") + 1, mark.indexOf("b"))
    var b = mark.substring(mark.indexOf("b") + 1)

    var Von = this.data.Von
    //n份限购，当商品的数量等于最小限购数，那么减去该商品的数量后为0
    if (Von[a].distop[b].buyMininum > 1 && Von[a].distop[b].buyMininum == Von[a].distop[b].numb) {
      Von[a].distop[b].numb = 0
    } else {
      Von[a].distop[b].numb--
    }
    var arr = Von[a].distop[b]
    var deskNum = this.data.deskNum
    if (deskNum == -1) {
      var boxFee = this.data.boxFee
      if (arr['boxFee'] == '1') {
        start--
        var boxFees = start * boxFee
        this.setData({
          boxFees: boxFees
        })
      }
    }
    this.setData({
      car: car,
      Von: Von,
    })
    if (car[i].arr.numb <= 0) {
      car.splice(i, 1)
      this.setData({
        car: car,
      })
    }
    that.zkPrice(a, b) //折扣价格处理
    this.sum()
  },
  //购物总数弹出框的·加
  buyadd: function(e) {
    var that = this
    var i = e.currentTarget.dataset.i;
    var car = this.data.car


    var mark = car[i].mark

    var a = mark.substring(mark.indexOf("a") + 1, mark.indexOf("b"))
    var b = mark.substring(mark.indexOf("b") + 1)

    var Von = this.data.Von
    if ((parseInt(Von[a].distop[b].goodsStock) == 0) || ((parseInt(Von[a].distop[b].goodsStock) <= Von[a].distop[b].numb) && (parseInt(Von[a].distop[b].goodsStock) != -1))) {

      wx.showToast({
        title: '没有库存了',
        content: '该订单部分商品库存不足',
        icon: 'loading',
        duration: 2000,
        success: function() {
          Von[a].distop[b].numb = Von[a].distop[b].numb
          that.setData({
            Von: Von
          })
          //要延时执行的代码
          return false
        }
      })
      return false
    }
    //秒杀商品限制购买数量
    if (Von[a].distop[b].killId && Von[a].distop[b].numb === Von[a].distop[b].buyNum) {
      wx.showToast({
        title: '此秒杀商品限购' + Von[a].distop[b].buyNum + '份',
        icon: 'none',
        duration: 1500,
      })
      return false
    }
    car[i].arr.numb++
      Von[a].distop[b].numb++
      var arr = Von[a].distop[b]
    if (arr.bargainId && arr.numb == 2) {
      wx.showToast({
        title: '砍价商品限购1份,超过1份恢复原价',
        icon: 'none',
        duration: 1500,
      })
    }
    if (arr.zkGoodsId && arr.buyNum != -1 && Number(arr.numb) == Number(arr.buyNum) + 1) {
      wx.showToast({
        title: '此折扣商品限优惠' + arr.buyNum + '份,超过' + arr.buyNum + '份恢复原价',
        icon: 'none',
        duration: 1500,
      })
    }
    var boxFee = this.data.boxFee
    var deskNum = this.data.deskNum
    if (deskNum == -1) {
      if (arr['boxFee'] == '1') {
        start++
        var boxFees = start * boxFee
        this.setData({
          boxFees: boxFees
        })
      }
    }
    this.setData({
      car: car,
      Von: Von,
    })
    that.zkPrice(a, b) //折扣价格处理
    this.sum()
  },
  //红包
  //优惠券
  conpouShow: function(e) {
    // var show = e.currentTarget.dataset.show;
    var presentNub = this.data.presentNub
    var userId = wx.getStorageSync('usersInfo').userId
    var receiveSum = 0
    var conpou = this.data.conpou
    for (var i in conpou) {
      if (!conpou[i].type) {
        receiveSum += Number(conpou[i].couponMoney)
      }
    }
    this.setData({
      receiveSum: receiveSum
    })
    var that = this
    var conpouIdArr = that.data.conpouIdArr
    var timestamp = (Date.parse(new Date())) / 1000
    var sign = MD5Util.sign(timestamp)
    wx.request({
      url: 'https://www.aftdc.com/wxapp/Shop/addCou',
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        sign: sign,
        timestamp: timestamp,
        token: wx.getStorageSync('usersInfo').token,
        conpouIdArr: conpouIdArr,
        userId: userId
      },
      success: function(res) {
        if (res.data == 1) {
          that.setData({
            conpouState: false
          })
        }
      }
    })
    if (presentNub) {
      this.setData({
        conpouBox: true
      })
    }
  },
  close: function() {
    this.setData({
      conpouBox: false
    })
  },

  hongBaoShow: function() {
    var userId = wx.getStorageSync('usersInfo').userId
    var shopId = this.data.shopId
    var usersInfo = wx.getStorageSync('usersInfo')
    if (!usersInfo || !usersInfo.userPhone) { //如果没登录
      wx.navigateTo({
        url: '../author/author',
      })
      return false
    } else {
      var redPacketsPresentNub = this.data.redPacketsPresentNub
      var receiveSum = 0
      var redPackets = this.data.redPackets
      for (var i in redPackets) {
        if (!redPackets[i].type) {
          receiveSum += Number(redPackets[i].piece)
        }
      }
      this.setData({
        receiveSum: receiveSum
      })
      var that = this
      var timestamp = (Date.parse(new Date())) / 1000
      var sign = MD5Util.sign(timestamp)
      wx.request({
        url: 'https://www.aftdc.com/wxapp/Shop/hongbao',
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          sign: sign,
          timestamp: timestamp,
          token: wx.getStorageSync('usersInfo').token,
          shopId: shopId,
          userId: userId
        },
        success: function(res) {
          if (res.data.res == 1) {
            that.setData({
              redPacketsState: false
            })
          }
          //  if (res.data == 1) {
          // that.setData({
          //   hongbaoState: 0,
          //   hongbaoList: res.data,
          //   hongbaoBox2: 1
          // })
          //   }
        }
      })
      if (redPacketsPresentNub) {
        this.setData({
          conpouBox: true
        })
      }
    }
  },
  closeRed: function() {
    this.setData({
      hongbaoBox: false,
    })
  },

  close: function() {
    this.setData({
      conpouBox: false
    })
  },

  hongBaoClose: function() {
    this.setData({
      hongbaoBox2: false
    })
  },

  //下单购买
  price: util.throttle(function() {
    var that = this
    var usersInfo = wx.getStorageSync('usersInfo')
    console.log(usersInfo)
    if (!usersInfo || !usersInfo.userPhone) { //如果没登录
      wx.navigateTo({
        url: '../author/author?route=price',
      })
      return false
    } else {

      var car = that.data.car
      var passCheck = true
      if (this.data.requiredCatId) {
        passCheck = false
        for (var i in car) {
          if (car[i].arr.shopCatId2 === this.data.requiredCatId) {
            var passCheck = true
            break;
          }
        }
      }
      if (passCheck) {
        var shopId = that.data.shopId
        var deskNum = that.data.deskNum
        var deskName = that.data.deskName
        var userId = wx.getStorageSync('usersInfo').userId
        wx.removeStorageSync('orderfood')

        var orderfood = []
        var orderType = that.data.orderType
        for (var i in car) {
          orderfood[i] = car[i].arr
          orderfood[i].mark = car[i].mark
        }
        wx.setStorageSync('orderfood', orderfood)

        if (orderType == 2) { //扫码点餐进来
          wx.navigateTo({
            url: '../submit/submit?deskNum=' + deskNum + '&deskName=' + deskName + '&deduction=' + that.data.deduction + '&isOpen=' + that.data.shopInfo.shopAtive
          })
        } else if (deskNum == -1) {
          // that.getShareGoods();
          if (that.data.shareId && that.data.updateGoodsNumb == 0) {
            wx.showModal({
              title: '确定下单吗？',
              content: '下单后，其他人将不可加入或修改商品',
              showCancel: true,
              cancelText: '取消',
              cancelColor: '#666',
              confirmText: '确认',
              confirmColor: '#53beb7',
              success: function(res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '../submit/submit?deduction=' + that.data.deduction + '&isOpen=' + that.data.shopInfo.shopAtive + '&shareId=' + that.data.shareId
                  })
                }
              },
            })

          } else if (that.data.shareId && that.data.updateGoodsNumb > 0) {
            wx.showModal({
              title: '',
              content: '无法结算，好友正在修改商品',
              showCancel: false,
              confirmText: '知道了',
              confirmColor: '#53beb7',
              success: function(res) {
                if (res.confirm) {

                }
              },
            })
          } else {
            wx.navigateTo({
              url: '../submit/submit?deduction=' + that.data.deduction + '&isOpen=' + that.data.shopInfo.shopAtive,
            })
          }

        }
      } else {
        wx.showModal({
          title: '必选',
          content: '需要选择[' + this.data.requiredName + ']下的商品才可下单哦~',
          showCancel: false,
          confirmText: '好的',
          success: function(res) {
            for (var i = 0, len = that.data.Von.length; i < len; i++) {
              if (that.data.Von[i].required === 1) {
                that.setData({
                  foodindex: i,
                  toView: 'order' + i.toString(),
                })
              }
            }
          }
        })
      }

    }
  }),
  //分享设置
  // onShareAppMessage: function() {
  //   var that = this
  //   var shopname = that.data.arr.info.shopName
  //   var shopId = that.data.shopId
  //   var userId = wx.getStorageSync('usersInfo').userId
  //   var timestamp = (Date.parse(new Date())) / 1000
  //   var sign = MD5Util.sign(timestamp)

  //   if (userId) {

  //     return {
  //       title: shopname,
  //       path: '/page/homePage/pages/order/order?shopId=' + shopId,
  //       success: function(res) {

  //         if (that.data.hongbao.hongbao_count > 0) {
  //           that.setData({
  //             hongbaoBox: true,
  //             hongbaoSum: that.data.hongbao.sum_money,
  //             hongbaoCount: that.data.hongbao.hongbao_count,
  //             hongbaoState: that.data.hongbao.get,
  //           })
  //           if (that.data.hongbao.get == 0 && that.data.hongbao.hongbao_count > 0)
  //             that.hongBaoShow()
  //         } else {
  //           that.setData({
  //             hongbaoBox: false
  //           })
  //         }


  //       }
  //     }
  //   } else {
  //     return {
  //       title: shopname,
  //       path: '/pages/order/order?shopId=' + shopId
  //     }
  //   }
  // },
  foodAdd: function(i, j, numb) { //加
    var index = i
    var foodindex = j
    var Von = this.data.Von
    Von[index].distop[foodindex].numb = numb
    this.setData({
      Von: Von
    })
    var car = this.data.car
    var arr = Von[index].distop[foodindex]
    var boxFee = this.data.boxFee
    var deskNum = this.data.deskNum
    if (deskNum == -1) {
      if (arr['boxFee'] == '1') {
        start = numb + start
        var boxFees = start * boxFee
        this.setData({
          boxFees: boxFees
        })
      }
    }
    var mark = 'a' + index + 'b' + foodindex
    arr.userId = wx.getStorageSync('usersInfo').userId
    var obj = {
      arr: arr,
      mark: mark,
    };
    var car1 = car.filter(item => item.mark != mark)
    car1.push(obj)
    this.setData({
      car: car1
    })
    var cars = this.data.car
    this.sum()
  },

  closeCar: function(i, nub) {
    var i = i;
    var car = this.data.car
    car[i].arr.numb = 0
    var mark = car[i].mark
    var a = mark.substring(mark.indexOf("a") + 1, mark.indexOf("b"))
    var b = mark.substring(mark.indexOf("b") + 1)

    var Von = this.data.Von
    Von[a].distop[b].numb = 0
    var arr = Von[a].distop[b]
    var deskNum = this.data.deskNum
    if (deskNum == -1) {
      var boxFee = this.data.boxFee
      if (arr['boxFee'] == '1') {
        start = start - nub;

        var boxFees = start * boxFee
        this.setData({
          boxFees: boxFees
        })
      }
    }
    this.setData({
      car: car,
      Von: Von,
    })

    if (car[i].arr.numb <= 0) {
      car.splice(i, 1)
      this.setData({
        car: car,
      })
    }
    this.sum()
  },
  allpj: function() {
    wx.navigateTo({
      url: '../allpj/allpj?shopId=' + this.data.shopId,
    })
  },

  //堂食预订
  reserveDesk: function(e) {
    var shopId = this.data.shopId
    var shopName = this.data.shopInfo.shopName
    wx.navigateTo({
      url: '../desk/desk?shopId=' + shopId + '&shopName=' + shopName,
    })
  },

  languageChoi: function() {
    var lan = !this.data.languageScoll
    this.setData({
      languageScoll: lan,
    })
  },
  shareOrder: function() {
    var that = this
    var usersInfo = wx.getStorageSync('usersInfo')
    if (!usersInfo || !usersInfo.userPhone) { //如果没登录
      wx.navigateTo({
        url: '../author/author?route=shareOrder',
      })
      return false
    } else {
      var shopId = that.data.shopId
      var dsm = that.data.shopInfo.deliveryStartMoney
      var dfm = that.data.shopInfo.deliveryFreeMoney
      var shopName = that.data.shopInfo.shopName
      var orderType = that.data.orderType
      wx.navigateTo({
        url: '../shareOrder/shareOrder?shopId=' + shopId + '&dsm=' + dsm + '&dfm=' + dfm + '&shopName=' + shopName + '&orderType=' + orderType,
      })
    }
  },
  //清空购物车
  closeCars: function(e) {
    var car = this.data.car
    var Von = this.data.Von
    var a = Von.length;
    for (var i = 0; i < a; i++) {
      if (Boolean(Von[i].distop)) {
        var b = Von[i].distop.length
        for (var j = 0; j < b; j++) {
          Von[i].distop[j].numb = 0
        }
      }
    }
    this.setData({
      car: [],
      Von: Von,
      tipss: false,
      goods: false,
      boxFees: 0,
    })
    start = 0;
    this.sum()
  },
  //改为外卖模式
  checkShopType: function() {
    this.setData({
      shopType: 0
    })
  },
  //-- 砍价
  bargainBoxFn: function(e) {
    var index = e.currentTarget.dataset.index;
    var foodindex = e.currentTarget.dataset.foodindex;
    var bargainGood = this.data.Von[index].distop[foodindex];
    var bargainIndex = 'a' + index + "b" + foodindex
    var datas = bargainGood;
    this.setData({
      bargainBox: datas,
      bargainIndex: bargainIndex,
      bargainTogle: true,
    })
  },
  //点击图片详情进入
  bargainBoxShow: function(index, foodindex) {

    var bargainGood = this.data.Von[index].distop[foodindex];
    var bargainIndex = 'a' + index + "b" + foodindex
    var datas = bargainGood;
    var box = bargainGood
    box.mark = bargainIndex
    this.setData({
      bargainBox: datas,
      bargainIndex: bargainIndex,
      bargainTogle: true,
      box: box,
    })
  },
  bargainTogleFn: function() {
    var bargainTogle = !this.data.bargainTogle;
    this.setData({
      bargainTogle: bargainTogle,
    })
  },

  bargainBut: function(e) {
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
    innerAudioContext.onPlay(() => {})

    var bari = this.data.bargainIndex
    var random = Math.random();

    var a = bari.substring(bari.indexOf("a") + 1, bari.indexOf("b"))
    var b = bari.substring(bari.indexOf("b") + 1)
    var Von = this.data.Von
    var bargainGood = Von[a].distop[b];
    var bargainNumb = bargainGood.bargainNumb //砍价成功次数
    var re = bargainGood.result;
    var start = bargainGood.start;
    var end = bargainGood.end;
    var poor = ((end * 100 - start * 100) / 100).toFixed(2);
    var bargainPoor = ((poor * 100) / (bargainNumb * 100)).toFixed(2)

    var money = (bargainPoor * 2 * random).toFixed(2);
    if (money < bargainPoor) {
      money = ((money * 100 + bargainPoor * 100) / 100).toFixed(2)
    }

    var percent = ((poor * 100 - money * 100) / (poor * 100) * 100).toFixed(2) //比例长度
    var prans = {};
    prans.index = bari;
    prans.percent = percent;
    prans.money = money

    var model = this.data.model;
    model.togle = true;
    model.txt = "力道虽好，技术欠佳",
      model.price = prans.money;
    this.setData({
      prans: prans,
      model: model,
    })
    bargainGood.bargain = model.price
    bargainGood.formId = e.detail.formId
    this.logbargain(JSON.stringify(bargainGood))
  },

  //记录砍价
  logbargain: function(bargainGood) {
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
        goodsInfo: bargainGood
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'post',
      success: function(res) {
        if (res.data.res == 1) {
          var bargainBox = that.data.bargainBox
          bargainBox.bargainNo = res.data.bargainNo
          that.setData({
            bargainBox: bargainBox
          })
        }
      }
    })
  },

  modelClose: function() {
    var model = this.data.model;
    model.togle = false;
    var bargainBox = this.data.bargainBox
    var Von = this.data.Von

    var prans = this.data.prans;
    var bari = prans.index;
    var a = bari.substring(bari.indexOf("a") + 1, bari.indexOf("b"))
    var b = bari.substring(bari.indexOf("b") + 1)
    var percent = prans.percent;
    var money = prans.money;
    var start = bargainBox.start;
    var end = bargainBox.end;
    var numb = (((end * 100) - (money * 100)) / 100).toFixed(2)
    bargainBox.result = numb;
    // bargainBox.shopPrice = numb;
    bargainBox.bargainType = 1
    bargainBox.percent = percent; //百分比
    bargainBox.mark = bari

    Von[a].distop[b] = bargainBox

    this.setData({
      model: model,
      Von: Von,
      bargainBox: bargainBox,
      box: bargainBox
    })
    //添加缓存

  },

  //选好拼单商品
  // shareAdd: function() {
  //   var that = this
  //   var car = that.data.car
  //   var passCheck = true
  //   if (this.data.requiredCatId) {
  //     passCheck = false
  //     for (var i in car) {
  //       if (car[i].arr.shopCatId2 === this.data.requiredCatId) {
  //         var passCheck = true
  //         break;
  //       }
  //     }
  //   }
  //   if (passCheck) {
  //     var orderfood = []
  //     var serviceTime = JSON.stringify(that.data.shopInfo.serviceTime)
  //     for (var i in car) {
  //       orderfood[i] = car[i].arr
  //       orderfood[i].mark = car[i].mark
  //     }
  //     wx.setStorageSync('orderfood', orderfood)
  //     wx.navigateTo({
  //       url: '../desk/desk?shopId=' + that.data.shopId + '&shopName=' + that.data.shopInfo.shopName + '&scheduledDates=' + that.data.shopInfo.scheduledDates + '&orderStartDate=' + that.data.shopInfo.orderStartDate + '&orderEndDate=' + that.data.shopInfo.orderEndDate + '&serviceTime=' + serviceTime
  //       // + '&orderStartTime=' + that.data.shopInfo.orderStartTime + '&orderEndTime=' + that.data.shopInfo.orderEndTime
  //     })
  //   } else {
  //     var id = this.data.id
  //     var shareFood = []
  //     for (var i in car) {
  //       shareFood[i] = car[i].arr
  //       shareFood[i].mark = car[i].mark
  //       delete shareFood[i].guige;
  //       delete shareFood[i].guigeAttr;
  //     }
  //     var goodsInfo = JSON.stringify(shareFood)
  //     var timestamp = (Date.parse(new Date())) / 1000
  //     var sign = MD5Util.sign(timestamp)
  //     wx.request({
  //       url: 'https://www.aftdc.com/wxapp/Shop/addGoods',
  //       data: {
  //         sign: sign,
  //         timestamp: timestamp,
  //         token: wx.getStorageSync('usersInfo').token,
  //         userPhoto: wx.getStorageSync('usersInfo').userPhoto,
  //         id: id,
  //         shopId: that.data.shopId,
  //         goodsInfo: goodsInfo
  //       },
  //       header: {
  //         "Content-Type": "application/x-www-form-urlencoded"
  //       },
  //       method: 'post',
  //       success: function(res) {
  //         if (res.data.res == 1) {
  //           wx.navigateBack({
  //             delta: 1
  //           })
  //         } else if (res.data.res == 0) {
  //           wx.showToast({
  //             title: '你已被踢出此拼单',
  //             icon: 'none',
  //             duration: 2000
  //           })
  //           wx.navigateBack({
  //             delta: 1
  //           })
  //         }
  //       }
  //     })
  //   }
  // },
  shareAdd: util.throttle(function() {
    var that = this
    var car = that.data.car
    var passCheck = true
    if (this.data.requiredCatId) {
      passCheck = false
      for (var i in car) {
        if (car[i].arr.shopCatId2 === this.data.requiredCatId) {
          var passCheck = true
          break;
        }
      }
    }
    if (passCheck) {
      var timestamp = (Date.parse(new Date())) / 1000
      var sign = MD5Util.sign(timestamp)
      wx.request({
        url: 'https://www.aftdc.com/wxapp/Desk/checkGoodsStatus',
        data: {
          sign: sign,
          timestamp: timestamp,
          token: wx.getStorageSync('usersInfo').token,
          shareId: that.data.shareId
        },
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function(res) {
          if (res.data.res == 1) {
            var goodsInfo = []
            for (var i in that.data.car) {
              goodsInfo[i] = that.data.car[i].arr
              goodsInfo[i].mark = that.data.car[i].mark
            }
            // if (goodsInfo.length > 0) {
            //   that.setData({
            //     selectedGoodsNumb: that.data.selectedGoodsNumb + 1,
            //     noSelectedGoodsNumb: true,
            //   })
            // }
            that.addShareGoodsFn(goodsInfo)
            wx.navigateTo({
              url: '../collages/collages?shareId=' + that.data.shareId + '&shopId=' + that.data.shopId
            })
          } else if (res.data.res == 0) {
            wx.showModal({
              title: '',
              content: res.data.info,
              showCancel: false,
              cancelText: '不改了',
              cancelColor: '#666',
              confirmText: '确定',
              confirmColor: '#53beb7',
              success: function(e) {
                if (e.confirm) {
                  if (res.data.collagesStatus == -1 || res.data.collagesStatus == 1) { //拼单已取消
                    clearInterval(that.data.getShareGoodsTimer)
                    that.getShareGoods();
                    that.allReSet();
                    var options = that.data.options
                    options.userId = '',
                      that.onLoad(options)
                  }

                }
              },
            })
          }
        }
      })

    } else {
      wx.showModal({
        title: '必选',
        content: '需要选择[' + this.data.requiredName + ']下的商品才可下单哦~',
        showCancel: false,
        confirmText: '好的',
        success: function(res) {
          for (var i = 0, len = that.data.Von.length; i < len; i++) {
            if (that.data.Von[i].required === 1) {
              that.setData({
                foodindex: i,
                toView: 'order' + i.toString(),
              })
            }
          }
        }
      })
    }
  }),
  //关闭拼单
  closeShare: util.throttle(function() {
    var that = this;
    wx.showModal({
      title: '确定取消吗？',
      content: '取消后不会保留此次拼单内容',
      showCancel: true,
      cancelText: '继续拼单',
      cancelColor: '#666',
      confirmText: '取消拼单',
      confirmColor: '#53beb7',
      success: function(res) {
        if (res.confirm) {
          var timestamp = (Date.parse(new Date())) / 1000
          var sign = MD5Util.sign(timestamp)
          wx.request({
            url: 'https://www.aftdc.com/wxapp/Desk/cancelShare',
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
            success: function(res) {
              if (res.data.res == 1) {
                clearInterval(that.data.getShareGoodsTimer)
                that.getShareGoods();
                that.reSet()
              }
            }
          })
        }
      },
    })
  }),
  //退出拼单
  outShare: util.throttle(function() {
    var that = this;
    wx.showModal({
      title: '',
      content: '是否退出拼单？',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#666',
      confirmText: '确认',
      confirmColor: '#53beb7',
      success: function(res) {
        if (res.confirm) {
          var timestamp = (Date.parse(new Date())) / 1000
          var sign = MD5Util.sign(timestamp)
          wx.request({
            url: 'https://www.aftdc.com/wxapp/Desk/outShare',
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
            success: function(res) {
              if (res.data.res == 1 || res.data.res == 0) {
                clearInterval(that.data.getShareGoodsTimer)
                that.getShareGoods();
                that.reSet()
              }
            }
          })
        }
      },
    })
  }),
  onUnload: function() {
    var that = this
    clearInterval(that.data.getShareGoodsTimer)
  },
  onHide: function() {
    this.onUnload()
  },
  //formId
  formnextBut: function(e) {
    var that = this;
    var shopId = that.data.shopId;
    var formId = e.detail.formId;
    var attentionType = that.data.attentionType
    var usersInfo = wx.getStorageSync('usersInfo')
    if (!usersInfo || !usersInfo.userPhone) { //如果没登录
      wx.navigateTo({
        url: '../author/author?route=formnextBut',
      })
      return false
    } else {
      var userId = wx.getStorageSync('usersInfo').userId;
      var timestamp = (Date.parse(new Date())) / 1000
      var sign = MD5Util.sign(timestamp)
      if (attentionType == 0) {
        wx.request({
          url: 'https://www.aftdc.com/wxapp/Index/formId',
          method: 'post',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          data: {
            timestamp: timestamp,
            token: wx.getStorageSync('usersInfo').token,
            sign: sign,
            formId: formId,
            userId: userId,
            shopId: shopId,
          },
          success: function(res) {}
        })
      }
      that.touchAttention();
    }
  },
  //触发了关注和取消关注的操作
  touchAttention: function(e) {
    this.data.formId = e.detail.formId
    var that = this
    var usersInfo = wx.getStorageSync('usersInfo')
    if (!usersInfo || !usersInfo.userPhone) { //如果没登录
      wx.navigateTo({
        url: '../author/author?route=touchAttention',
      })
      return false
    } else {

      that.data.touchAttention = 1
      var attentionType = that.data.attentionType
      if (attentionType == 1) {

        this.cancelAttention()
      } else {

        this.attention()
      }

    }
  },
  //关注
  attention: function() {
    var that = this
    var shopId = that.data.shopId
    var userId = wx.getStorageSync('usersInfo').userId
    var timestamp = (Date.parse(new Date())) / 1000
    var sign = MD5Util.sign(timestamp)
    wx.request({
      url: 'https://www.aftdc.com/wxapp/Shop/attention',
      data: {
        sign: sign,
        timestamp: timestamp,
        token: wx.getStorageSync('usersInfo').token,
        userId: userId,
        shopId: shopId,
        action: 4,
        formId: that.data.formId
      },
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        if (res.data.res == 1) {
          var shopInfo = that.data.shopInfo
          var hobbyTip = that.data.hobbyTip
          shopInfo.fansNum++
            that.setData({
              hobbyTip: true,
              attentionType: 1,
              hobbyTips: res.data.info,
              shopInfo: shopInfo,
            })
          if (hobbyTip) {
            return false
          } else {
            var times = setTimeout(function() {
              that.setData({
                hobbyTip: false
              })
            }, 2000)
          }
        } else {
          that.setData({
            hobbyTip: true,
            hobbyTips: res.data.info,
          })
          if (hobbyTip) {
            return false
          } else {
            var times = setTimeout(function() {
              that.setData({
                hobbyTip: false
              })
            }, 2000)
          }
        }
      }
    })
  },
  //取消关注
  cancelAttention: function() {
    var that = this
    var shopId = that.data.shopId
    var userId = wx.getStorageSync('usersInfo').userId
    var timestamp = (Date.parse(new Date())) / 1000
    var sign = MD5Util.sign(timestamp)
    wx.request({
      url: 'https://www.aftdc.com/wxapp/Shop/cancelAttention',
      data: {
        sign: sign,
        timestamp: timestamp,
        token: wx.getStorageSync('usersInfo').token,
        userId: userId,
        shopId: shopId,
        formId: that.data.formId
      },
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        if (res.data.res == 1) {
          var shopInfo = that.data.shopInfo
          shopInfo.fansNum--
            var hobbyTip = that.data.hobbyTip
          that.setData({
            hobbyTip: true,
            attentionType: 0,
            hobbyTips: res.data.info,
            shopInfo: shopInfo,
          })

          if (hobbyTip) {
            return false
          } else {
            var times = setTimeout(function() {
              that.setData({
                hobbyTip: false,
                timeout: true
              })
            }, 2000)
          }
        } else {
          that.setData({
            hobbyTip: true,
            hobbyTips: res.data.info,
          })
          if (hobbyTip) {
            return false
          } else {
            var times = setTimeout(function() {
              that.setData({
                hobbyTip: false
              })
            }, 2000)
          }
        }
      }
    })
  },
  // 滚动切换标签样式
  switchTab: function(e) {
    if (e.detail.source == "touch") {
      //防止swiper控件卡死
      if (e.detail.current == 0 && this.data.currentTab > 1) { //卡死时，重置current为正确索引
        this.setData({
          currentTab: this.data.currentTab
        });
      } else { //正常轮转时，记录正确页码索引
        this.setData({
          currentTab: e.detail.current
        });
      }
    }

    // this.setData({
    //     currentTab: e.detail.current
    // });
  },
  // 点击标题切换当前页时改变样式
  swichNav: function(e) {
    var cur = e.target.dataset.current;
    if (cur == 1) {
      this.setData({
        onreachBottom: true,
        pinlunView: 'pinlun'
      })
    } else {
      this.setData({
        onreachBottom: false
      })
    }
    if (this.data.currentTaB == cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur
      })
    }
  },
  phone: function() {
    var that = this
    wx.makePhoneCall({
      phoneNumber: that.data.shopInfo.shopTel,
    })
  },
  //点击评论标签
  plindex: function(e) {
    //1 全部 2有图 3最新
    var plindex = e.currentTarget.dataset.plindex;
    this.setData({
      plindex: plindex
    })
    this.getPl(plindex)
  },
  //获取评论
  getPl: function(plindex) {
    var that = this
    that.data.plPage = 0
    var userId = wx.getStorageSync('usersInfo').userId
    if (!userId) {
      userId = 0
    }
    var timestamp = (Date.parse(new Date())) / 1000
    var sign = MD5Util.sign(timestamp)
    wx.request({
      url: 'https://www.aftdc.com/wxapp/Index/getpl',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        sign: sign,
        timestamp: timestamp,
        token: wx.getStorageSync('usersInfo').token,
        shopId: that.data.shopId,
        page: 0,
        id: plindex,
        userId: userId
      },
      method: "POST",
      success: function(res) {
        that.data.arr.pinglun.all = res.data.data
        that.setData({
          arr: that.data.arr,
          plScrolltolower: true,
        })
        if (plindex == 1) {
          that.setData({
            plPage: res.data.data.length
          })
        } else if (plindex == 2) {
          that.setData({
            pplPage: res.data.data.length
          })
        } else if (plindex == 3) {
          that.setData({
            nplPage: res.data.data.length
          })
        }
      }
    })
  },
  //评论下拉加载
  plScrolltolower: function() {
    if (this.data.plScrolltolower) {
      this.setData({
        more: true
      })
      var userId = wx.getStorageSync('usersInfo').userId
      if (!userId) {
        userId = 0
      }
      this.data.plScrolltolower = false
      var that = this
      var plindex = that.data.plindex
      var timestamp = (Date.parse(new Date())) / 1000
      var sign = MD5Util.sign(timestamp)
      if (plindex == 1) {
        var data = {
          sign: sign,
          timestamp: timestamp,
          token: wx.getStorageSync('usersInfo').token,
          shopId: that.data.shopId,
          page: that.data.plPage,
          id: plindex,
          userId: userId
        }
      } else if (plindex == 2) {
        var data = {
          sign: sign,
          timestamp: timestamp,
          token: wx.getStorageSync('usersInfo').token,
          shopId: that.data.shopId,
          page: that.data.pplPage,
          id: plindex,
          userId: userId
        }

      } else if (plindex == 3) {
        var data = {
          sign: sign,
          timestamp: timestamp,
          token: wx.getStorageSync('usersInfo').token,
          shopId: that.data.shopId,
          page: that.data.nplPage,
          id: plindex,
          userId: userId
        }
      }
      wx.request({
        url: 'https://www.aftdc.com/wxapp/Index/getpl',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: data,
        method: "POST",
        success: function(res) {
          setTimeout(function() {
            if (res.data.res == 1) {
              that.data.arr.pinglun.all = that.data.arr.pinglun.all.concat(res.data.data)
              that.setData({
                arr: that.data.arr,
                plScrolltolower: true
              })

              if (plindex == 1) {
                that.setData({
                  plPage: that.data.plPage + res.data.data.length
                })
              } else if (plindex == 2) {
                that.setData({
                  pplPage: that.data.pplPage + res.data.data.length
                })
              } else if (plindex == 3) {
                that.setData({
                  nplPage: that.data.nplPage + res.data.data.length
                })
              }
            } else {
              that.setData({
                plScrolltolower: false
              })
            }

            that.setData({
              more: false
            })
          }, 1000)


        }
      })
    }
  },
  //填写预订信息
  book: util.throttle(function() {
    var that = this
    var car = that.data.car
    var passCheck = true
    if (this.data.requiredCatId) {
      passCheck = false
      for (var i in car) {
        if (car[i].arr.shopCatId2 === this.data.requiredCatId) {
          var passCheck = true
          break;
        }
      }
    }
    if (passCheck) {
      var orderfood = []
      var serviceTime = JSON.stringify(that.data.shopInfo.serviceTime)
      for (var i in car) {
        orderfood[i] = car[i].arr
        orderfood[i].mark = car[i].mark
      }
      wx.setStorageSync('orderfood', orderfood)
      wx.navigateTo({
        url: '../desk/desk?shopId=' + that.data.shopId + '&shopName=' + that.data.shopInfo.shopName + '&scheduledDates=' + that.data.shopInfo.scheduledDates + '&orderStartDate=' + that.data.shopInfo.orderStartDate + '&orderEndDate=' + that.data.shopInfo.orderEndDate + '&serviceTime=' + serviceTime
        // + '&orderStartTime=' + that.data.shopInfo.orderStartTime + '&orderEndTime=' + that.data.shopInfo.orderEndTime 
      })
    } else {
      wx.showModal({
        title: '必选',
        content: '需要选择[' + this.data.requiredName + ']下的商品才可下单哦~',
        showCancel: false,
        confirmText: '好的',
        success: function(res) {
          for (var i = 0, len = that.data.Von.length; i < len; i++) {
            if (that.data.Von[i].required === 1) {
              that.setData({
                foodindex: i,
                toView: 'order' + i.toString(),
              })
            }
          }
        }
      })
    }
  }),
  //点赞
  Praise: function(e) {
    var index = e.currentTarget.dataset.index
    var that = this
    var usersInfo = wx.getStorageSync('usersInfo')
    if (!usersInfo || !usersInfo.userPhone) { //如果没登录
      wx.navigateTo({
        url: '../author/author',
      })
      return false
    } else {
      that.setData({
        dzan: false
      })
      clearTimeout(zanTime);
      var id = e.currentTarget.dataset.id
      var pinglun = that.data.arr.pinglun.all
      var isDZ = pinglun[index]['isDZ']
      pinglun[index]['isDZ'] = isDZ == 0 ? 1 : 0;

      var zanshow = pinglun[index]['isDZ'];
      var numb = Number(pinglun[index]['numbs']);

      var changepl = that.data.changepl;

      if (zanshow == 0) {
        if (!that.data.is_less) pinglun[index]['numbs'] = Number(numb - 1);
        that.data.is_less = true;
      } else if (zanshow == 1) {
        that.setData({
          dzan: true,
        })
        clearTimeout(zanTime);
        zanTime = setTimeout(function() {
          that.setData({
            dzan: false
          })
          clearTimeout(zanTime);
        }, 1100)
        pinglun[index]['numbs'] = Number(numb + 1)
        that.data.is_less = false;
      }
      var len = changepl.length
      for (var i = 0; i < len; i++) {
        if (changepl[i].id == id) {
          changepl.splice(i, 1)
          break
        }
      }
      var obj = {
        id: id,
        isDZ: zanshow
      }
      changepl.push(obj)
      that.data.arr.pinglun.all = pinglun
      that.setData({
        arr: that.data.arr,
        changepl: changepl,
      })
      that.changeZan();
    }
  },
  //上传点赞
  changeZan: function() {
    var that = this
    var changepl = that.data.changepl;
    var add = that.data.add;
    var deletes = that.data.deletes;
    add = [];
    deletes = [];
    var userId = wx.getStorageSync('usersInfo').userId;
    var len = changepl.length
    for (var i = 0; i < len; i++) {
      var id = changepl[i].id
      if (changepl[i].isDZ == 1) {
        add.push(id)
      } else if (changepl[i].isDZ == 0) {
        deletes.push(id);
      }
    }
    //改变过 点赞 状态的评论id
    if (add.length > 0 || deletes.length > 0) {
      var timestamp = (Date.parse(new Date())) / 1000
      var sign = MD5Util.sign(timestamp)
      wx.request({
        url: 'https://www.aftdc.com/wxapp/Appraises/updDz',
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          add: JSON.stringify(add),
          deletes: JSON.stringify(deletes),
          sign: sign,
          timestamp: timestamp,
          token: wx.getStorageSync('usersInfo').token,
          shopId: that.data.shopId
        },
        success: function(res) {

        }
      })
    }
  },

  zan: function(e) {
    var that = this
    var animation = wx.createAnimation({
      duration: 60,
      timingFunction: "linear",
      delay: 0,
    })
    this.animation = animation

    animation.scale(2, 2).opacity(1).step({
      duration: 260
    })
    animation.rotate(10).step()
    animation.rotate(0).step()
    animation.rotate(-10).step()

    animation.rotate(10).step()
    animation.rotate(0).step()
    animation.rotate(-10).step()
    animation.rotate(0).scale(1, 1).opacity(0).step({
      duration: 260
    })
    this.setData({
      animationData: animation.export(),
    })
  },
  //关闭图片
  enlargeClose: function(e) {
    this.setData({
      enlargeBox: false,
    })
  },
  //去收藏页面
  gotoCollect: function() {
    wx.navigateTo({
      url: '../../../personal/pages/collect/collect',
    })
  },
  formId: function(formId, shopId) {
    var that = this;
    // var userId = wx.getStorageSync('usersInfo').userId;
    var timestamp = (Date.parse(new Date())) / 1000
    var sign = MD5Util.sign(timestamp)
    wx.request({
      url: 'https://www.aftdc.com/wxapp/Index/formId',
      method: 'post',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        timestamp: timestamp,
        token: wx.getStorageSync('usersInfo').token,
        sign: sign,
        formId: formId,
        // userId: userId,
        shopId: shopId,
      },
      success: function(res) {}
    })
  },
  //收藏
  collect: function(e) {
    var that = this
    var formId = e.detail.formId;
    var usersInfo = wx.getStorageSync('usersInfo')
    if (!usersInfo || !usersInfo.userPhone) { //如果没登录
      wx.navigateTo({
        url: '../author/author?route=collect',
      })
      return false
    } else {
      var shopId = that.data.shopId
      that.formId(formId, shopId)
      var userId = wx.getStorageSync('usersInfo').userId
      var timestamp = (Date.parse(new Date())) / 1000
      var sign = MD5Util.sign(timestamp)
      wx.request({
        url: 'https://www.aftdc.com/wxapp/Index/collect',
        data: {
          sign: sign,
          timestamp: timestamp,
          token: wx.getStorageSync('usersInfo').token,
          userId: userId,
          shopId: shopId,
          action: 3
        },
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function(res) {
          if (res.data.res == 1) {
            wx.showModal({
              title: '提示',
              content: '已收藏',
              showCancel: false,
              success: function() {
                that.data.shopInfo.colType = 1
                var shopInfo = that.data.shopInfo
                that.setData({
                  shopInfo: shopInfo
                })
              }
            })
          }
        }
      })
    }
  },
  cancelCollect(e) {
    var that = this
    var formId = e.detail.formId;
    var usersInfo = wx.getStorageSync('usersInfo')
    if (!usersInfo || !usersInfo.userPhone) { //如果没登录
      wx.navigateTo({
        url: '../author/author?route=collect',
      })
      return false
    } else {
      var shopId = that.data.shopId
      that.formId(formId, shopId)
      var userId = wx.getStorageSync('usersInfo').userId
      var timestamp = (Date.parse(new Date())) / 1000
      var sign = MD5Util.sign(timestamp)
      wx.request({
        url: 'https://www.aftdc.com/wxapp/Mine/delete_collect',
        data: {
          sign: sign,
          timestamp: timestamp,
          token: wx.getStorageSync('usersInfo').token,
          shopId: shopId,
        },
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function(res) {
          if (res.data.res == 1) {
            wx.showModal({
              title: '提示',
              content: '已取消收藏',
              showCancel: false,
              success: function() {
                that.data.shopInfo.colType = 0
                var shopInfo = that.data.shopInfo
                that.setData({
                  shopInfo: shopInfo
                })
              }
            })
          }
        }
      })
    }
  },
  //查看认证页
  seeAttestation: function() {
    var shopId = this.data.shopId
    wx.navigateTo({
      url: '../macher/macher?shopId=' + shopId,
    })
  },
  //显示营业执照和餐饮许可证
  qualifications: function() {
    var shopId = this.data.shopId
    wx.navigateTo({
      url: '../qualifications/qualifications?shopId=' + shopId,
    })
  },
  //点击放大图片
  enlargeImg: function(e) {
    var type = e.currentTarget.dataset.type;
    var index = e.currentTarget.dataset.index;
    var ind = e.currentTarget.dataset.ind;
    if (type == 'pingjia') {
      var src = this.data.arr.pinglun.all[ind].appraisesAnnex
      for (var i in src) {
        src[i].ImgUrl = src[i].img
      }
    } else if (type == 'env') {
      var src = this.data.shopInfo.lunbo
    }
    this.setData({
      enlargeSrc: src,
      enlargeBox: true,
      enlargeNumb: index,
    })
  },
  address: function() {
    var latitude = parseFloat(this.data.shopInfo.latitude)
    var longitude = parseFloat(this.data.shopInfo.longitude)
    wx.openLocation({
      latitude: latitude,
      longitude: longitude,
      fail: function(err) {}
    })
  },
  //举报
  report: util.throttle(function() {
    var that = this
    var usersInfo = wx.getStorageSync('usersInfo')
    if (!usersInfo || !usersInfo.userPhone) { //如果没登录
      wx.navigateTo({
        url: '../author/author?route=report',
      })
      return false
    } else {
      var shopName = that.data.shopInfo.shopName
      var shopImg = that.data.shopInfo.shopImg
      var shopId = that.data.shopId
      wx.navigateTo({
        url: '../shopReport/shopReport?shopName=' + shopName + '&shopImg=' + shopImg + "&shopId=" + shopId,
      })
    }
  }),
  //充值
  recharge: function() {
    var timestamp = (Date.parse(new Date())) / 1000
    var sign = MD5Util.sign(timestamp)
    var that = this
    var shopName = that.data.shopInfo.shopName
    var shopImg = that.data.shopInfo.shopImg
    wx.request({
      url: 'https://www.aftdc.com/wxapp/Mine/isInfoFull',
      data: {
        sign: sign,
        timestamp: timestamp,
        token: wx.getStorageSync('usersInfo').token,
      },
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        if (res.data.res == 1) {
          wx.navigateTo({
            url: '../charge/charge?shopId=' + that.data.shopId,
          })
        } else if (res.data.res == -1) {
          wx.navigateTo({
            url: '../../../personal/pages/vip/vip?shopId=' + that.data.shopId + '&shopName=' + shopName + '&shopImg=' + shopImg,
          })
        }

      }
    })
  },

  goshop: function() {
    var nops = this.data.nops
    var shopId = this.data.shopId
    var distance = this.data.distance
    if (nops != '不在配送范围') {
      wx.setStorageSync('shopType', 0)
      wx.setStorageSync('orderType', '0')
      wx.navigateTo({
        url: '../order/order?shopId=' + shopId + '&distance=' + distance,
      })
    }
  },
  godesk: function() {
    wx.setStorageSync('shopType', 0)
    wx.setStorageSync('orderType', '3')
    var shopId = this.data.shopId
    wx.navigateTo({
      url: '../order/order?shopId=' + shopId,
    })
    // var shopName=this.data.arr.shop.shopName
    // wx.navigateTo({
    //   url: '../order/desk/desk?shopId=' + shopId + '&shopName=' + shopName,
    // })
  },
  gotake: function() {
    wx.setStorageSync('shopType', 0)
    wx.setStorageSync('orderType', '5')
    var shopId = this.data.shopId
    wx.navigateTo({
      url: '../order/order?shopId=' + shopId,
    })
  },

  // 帮忙砍价
  onShareAppMessage: function(res) {
    var that = this

    if (res.target) {
      if (res.target.dataset.index == 1) {
        var usersInfo = wx.getStorageSync('usersInfo')
        if (!that.data.shareId) {
          var timestamp = (Date.parse(new Date())) / 1000
          var sign = MD5Util.sign(timestamp)
          wx.request({
            url: 'https://www.aftdc.com/wxapp/Desk/startShare',
            data: {
              sign: sign,
              timestamp: timestamp,
              token: wx.getStorageSync('usersInfo').token,
              shopId: that.data.shopId,
              userName: usersInfo.userName,
              userPhoto: usersInfo.userPhoto,
            },
            method: "POST",
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function(e) {
              if (e.data.res == 1) {
                that.setData({
                  sharing: 1,
                  shareId: e.data.shareId,
                })
                var goodsInfo = []
                for (var i in that.data.car) {
                  goodsInfo[i] = that.data.car[i].arr
                  goodsInfo[i].mark = that.data.car[i].mark
                }
                if (goodsInfo.length > 0) {
                  that.setData({
                    selectedGoodsNumb: 1,
                    noSelectedGoodsNumb: true,
                  })
                }
                that.allShareSum()
                that.addShareGoodsFn(goodsInfo)
              }
            }
          })
        }
        var latitude = app.globalData.location.latitude
        var longitude = app.globalData.location.longitude
        var path = '/page/homePage/pages/order/order?shopId=' + that.data.shopId + '&userId=' + that.data.usersInfo.userId + '&latitude=' + latitude + '&longitude=' + longitude + '&shareOrderType=' + that.data.orderType+ '&shareShopType=' + that.data.shopType
        if (res.from === 'button') {
          console.log(12)
          return {
            title: '【拼单】' + usersInfo.userName + '喊你一起点外卖~',
            path: path,
            success: function(res) {

            },
            fail: function(res) {

            }
          }
        }


      } else {
        var bargainBox = that.data.bargainBox
        var path = '/page/homePage/pages/bargainHelp/bargainHelp?shopId=' + bargainBox.shopId + '&bargainNo=' + bargainBox.bargainNo + '&sponsor=' + app.globalData.userId + '&bargainId=' + bargainBox.bargainId + '&shopType=' + that.data.shopType
        if (res.from === 'button') {
          return {
            title: '帮我砍一刀',
            path: path,
            success: function(res) {

              // that.setData({
              // 	boxShow: 2,
              // })
            },
            fail: function(res) {

            }
          }
        }
      }
    }



  },
  toLogin: function() {
    wx.navigateTo({
      url: '../author/author',
    })
    // that.data.route = 'onShareAppMessage'
  },
  location: function() {
    var that = this
    wx.getLocation({
      type: 'gcj02',
      success: function(res) {
        var latitude = res.latitude
        var longitude = res.longitude
        // var latitude = 23.23456
        // var longitude = 113.21361
        var location = {}
        // location.longitude = 113.21361
        // location.latitude = 23.23456
        location.longitude = longitude
        location.latitude = latitude
        that.setData({
          latitude: latitude,
          longitude: longitude,
          location: location,
        })
        // that.webs()
        app.globalData.location = location
      },
    })
  },
  //拼单重置数据
  reSet: function() {
    var that = this
    that.setData({
      sharing: 0,
      shareId: '',
      selectedGoodsNumb: 0,
      updateGoodsNumb: 0,
      shareGoodsInfo: [],
      // otherSharer: [],
      shareInitiator: true,
      changeCollage: 0,
    })
  },
  //所有重置数据
  allReSet: function() {
    var that = this
    that.setData({
      shopcar: false,
      car: [],
      totalprice: 0,
      totalnumb: 0,
      totalMarketPrice: 0,
      sharing: 0,
      shareId: '',
      selectedGoodsNumb: 0,
      updateGoodsNumb: 0,
      shareGoodsInfo: [],
      shareInitiator: true,
      changeCollage: 0,
      animationLoading: false
    })
  },


})