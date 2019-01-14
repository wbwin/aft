var app = getApp()
var util = require('../../../utils/util.js')
var MD5Util = require('../../../utils/md5.js');
var authorization = require('../../../utils/authorization.js')
Page({
    data: {
        characteristic: [{
            image: 'https://image.aftdc.com/images/tannei.png',
            name: '堂食预定',
            shopType: 2,
            ok: false,
            orderType: 3,
        },
        {
            image: 'https://image.aftdc.com/images/tg.png',
            name: '团购',
            shopType: 21,
            ok: false,
            orderType: 4,
        },
        {
            image: 'https://image.aftdc.com/images/mdzq.png',
            name: '到店自取',
            shopType: 3,
            ok: false,
            orderType: 5,
        },
        {
            image: 'https://image.aftdc.com/images/mdzq.png',
            name: '免费配送',
            shopType: 4,
            ok: false,
            orderType: 0,
        },
        {
            image: 'https://image.aftdc.com/images/waimai.png',
            name: '外卖',
            shopType: 1,
            ok: false,
            orderType: 0,
        },
        {
            image: 'https://image.aftdc.com/images/yexiao.png',
            name: '夜宵',
            shopType: 6,
            ok: false,
            orderType: 0,
        },
        {
            image: 'https://image.aftdc.com/images/youhui.png',
            name: '附近优惠',
            shopType: 26,
            ok: false,
            orderType: 4,
        },
        {
            image: 'https://image.aftdc.com/images/youzi.png',
            name: '品牌商家',
            shopType: 5,
            ok: false,
            orderType: 3,
        },
        ],
        userInfo: {},
        longitude: "",
        latitude: "",
        searchw: '',
        price: '',
        time: '',
        activityArr: [],
        nothing: true,
        shops: true,
        commercial: true,
        allChoice: false, //综合排序和筛选选择框是否显示
        cuisineId: 0,
        chooseHobby1: [{
            name: '配送时间长',
            sel: false,
            id: 1
        },
        {
            name: '包装差',
            sel: false,
            id: 5
        },
        {
            name: '价格偏高',
            sel: false,
            id: 2
        },
        {
            name: '分量不足',
            sel: false,
            id: 6
        },
        // { name: '不想看·', sel: false, id: 3 },
        {
            name: '关注商家',
            sel: false,
            id: 10
        },
            // { name: '屏蔽商家', sel: false, id: 4 }
        ],
        chooseHobby2: [{
            name: '吃过了',
            sel: false,
            id: 7
        },
        {
            name: '环境不好',
            sel: false,
            id: 8
        },
        {
            name: '价格偏高',
            sel: false,
            id: 2
        },
        {
            name: '服务态度不好',
            sel: false,
            id: 9
        },
        // { name: '不想看·', sel: false, id: 3 },
        {
            name: '关注商家',
            sel: false,
            id: 10
        },
            // { name: '屏蔽商家', sel: false, id: 4 }
        ],
        sortChoice: [{
            name: '评分最高',
            ok: false,
            id: 3
        },
        {
            name: '起送价最低',
            ok: false,
            id: 4
        },
        {
            name: '配送费最低',
            ok: false,
            id: 5
        }
        ],
        sortChoiceId: '', //综合排序Id
        choiceId: -1,
        query: {}, //查询的内容
        termActivity: [{
            title: '减',
            titleColor: 'ff4040',
            name: '满减优惠',
            ok: false,
            shopType: 22
        },
        // {
        //     title: '领',
        //     titleColor: 'aa135f',
        //     name: '进店领券',
        //     ok: false,
        //     shopType: 24
        // },
        {
            title: '折',
            titleColor: 'F4A460',
            name: '折扣商品',
            ok: false,
            shopType: 25
        },
        {
            title: '新',
            titleColor: '06c1ae',
            name: '新客立减',
            ok: false,
            shopType: 23
        },
        // {
        //     title: '团',
        //     titleColor: '1988f9',
        //     name: '团购活动',
        //     ok: false,
        //     shopType: 21
        // },
        // {
        //     title: '砍',
        //     titleColor: 'ADFF2F',
        //     name: '砍价活动',
        //     ok: false,
        //     shopType: 28
        // },
        // {
        //     title: '秒',
        //     titleColor: '029900',
        //     name: '秒杀商品',
        //     ok: false,
        //     shopType: 27
        // },
        {
            title: '红',
            titleColor: 'ff4040',
            name: '商家红包',
            ok: false,
            shopType: 30
        },
        // {
        //   title: '拼',
        //   titleColor: 'F4A460',
        //   name: '拼单活动',
        //   ok: false,
        //   shopType: 31
        // },
        // {
        //     title: '代',
        //     titleColor: '1988f9',
        //     name: '代金券',
        //     ok: false,
        //     shopType: 29
        // },
        {
            title: '赠',
            titleColor: 'ff0000',
            name: '买赠活动',
            ok: false,
            shopType: 32
        },
        {
            title: '积',
            titleColor: 'aa135f',
            name: '积分抵扣',
            ok: false,
            shopType: 33
        },

        ],
        history: true,
        search: false, //商品页和搜索页显示隐藏
        query: {}, //综合排序，销量，距离，筛选 所需要查询的数据存储的名称
        loading: false,
        addclass: "正在定位...",
        positionAllow: false,
        code: 100, //天气图标
        recommendState: true, //推荐商品隐藏
        // shopType: 2, //商家特色
        shopType: 1, //商家特色
        // backcolor: 1,//改变那个背景色
        filterType: '', //筛选页面选择的商家特色
        orderbyarr: "",
        conditionArr: [],
        zhSortIndex: 0,
        zhSort: [{
            id: 0,
            name: '综合排序'
        },
        {
            id: 8,
            name: '销量最高'
        },
        {
            id: 9,
            name: '起送价最低'
        },
        {
            id: 10,
            name: '配送最快'
        },
        {
            id: 11,
            name: '配送费最低'
        },
        {
            id: 12,
            name: '人均从低到高'
        },
        {
            id: 13,
            name: '人均从高到低'
        },
        ],
        first: false, //第一次进来不执行页面刷新
        where: 0,
        isScreen: 0,//判断是否已经有筛选条件
    },
    //事件处理函数
    bindViewTap: function () {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },
    onMessage: function (res) {
        this.setData({
            data: res.data
        });
    },
    //点击首页时刷新数据
    // onTabItemTap(item) {
    // 	wx.startPullDownRefresh()
    // },
    onShow: function () {
        var that = this;
        // wx.setStorageSync('shopType', '2')
        // wx.setStorageSync('orderType', '3')
        wx.setStorageSync('shopType', '1')
        wx.setStorageSync('orderType', '0')
        //刷新页面
        var first = this.data.first
        if (first) {
            this.onPullDownRefresh()
        }
        // setTimeout(function() {

        //     // 订单页的数据,用于判断小红点
        //     // var userId = wx.getStorageSync('usersInfo').userId
        //     // this.data.userId = userId
        //     var timestamp = (Date.parse(new Date())) / 1000
        //     var sign = MD5Util.sign(timestamp)
        //     wx.request({
        //         url: 'https://www.aftdc.com/wxapp/Order/getAllOrders',
        //         header: {
        //             "Content-Type": "application/x-www-form-urlencoded"
        //         },
        //         method: "POST",
        //         data: {
        //             sign: sign,
        //             timestamp: timestamp,
        //             token: wx.getStorageSync('usersInfo').token,
        //         },
        //         success: function(res) {

        //             //   判断订单是否有红点
        //             var jxz = res.data.waitNum;
        //             var dfk = res.data.noPayNum;
        //             var dsy = res.data.groupNum;
        //             var dpj = res.data.pingjiaNum;
        //             var tk = res.data.refundNum;

        //             if (jxz > 0 || dfk > 0 || dsy > 0 || dpj > 0 || tk > 0) {
        //                 wx.showTabBarRedDot({
        //                     index: 1
        //                 })
        //             } else if (jxz <= 0 && dfk <= 0 && dsy <= 0 && dpj <= 0 && tk <= 0) {
        //                 wx.hideTabBarRedDot({
        //                     index: 1
        //                 })
        //             }
        //         }
        //     })
        // }, 2100)
    },
    onReady: function () {
        wx.showNavigationBarLoading()
        var that = this
        wx.getLocation({
            type: 'gcj02',
            success: function (res) {
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
                    // backcolor: 1,
                    nothing: true,
                    sortid: 0,
                    sortstyle: 23,
                })
                that.data.conditionArr[0] = {
                    'shopType': 1
                };

                that.getShop(latitude, longitude)
                // that.webs()
                app.globalData.location = location
            },
        })
    },

    //根据经纬度和用户id获取首页信息
    getShop: function (latitude, longitude) {
        var userId = wx.getStorageSync('usersInfo').userId
        var conditionArr = JSON.stringify(this.data.conditionArr)
        if (!userId) userId = -1
        var that = this
        wx.request({
            url: 'https://www.aftdc.com/wxapp/Index/index',
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
                userId: userId,
                longitude: longitude,
                latitude: latitude,
                page: 0,
                conditionArr: conditionArr
            },
            method: "POST",
            success: function (res) {
                console.log(res.data)
                wx.hideNavigationBarLoading();
                //判断订单是否有红点
                // if (res.data.order) {
                //     wx.showTabBarRedDot({
                //         index: 1
                //     })
                // } else {
                //     wx.hideTabBarRedDot({
                //         index: 1
                //     })
                // }
                //保存全局变量city
                if (res.data.city) app.globalData.city = res.data.city;

                if (userId != -1) {
                    var usersInfo = wx.getStorageSync('usersInfo')
                    if (usersInfo.notReadMessage.activity + usersInfo.notReadMessage.article + usersInfo.notReadMessage.system > 0) {
                        // wx.showTabBarRedDot({
                        // 	index: 3,
                        // })
                    }
                }
                //附件没有商家
                if (res.data.openCity == 0) {
                    that.setData({
                        openCity: 0,
                        shops: [],
                        loading: true,
                        nothing: false,
                        weather: res.data.weather,
                        addclass: res.data.addclass, //详细地址
                        orders: []
                    })
                } else { //有商家
                    //轮播订单
                    if (res.data.orders) {
                        // var orders = util.shijian(new Date, res.data.orders)
                        var orders = res.data.orders;
                    }
                    //商家
                    var shops = res.data.shops;
                    if (shops) {
                        var len = shops.length;
                        for (var i in shops) { 
                            //显示的活动数量判断
                            if (shops[i].tg == 1) {
                                shops[i].projectNum--
                            }
                            if (shops[i].djq == 1) {
                                shops[i].projectNum--
                            }
                        }
                    }
                    //广告
                    var commercial = res.data.commercial;
                    if (commercial) {
                        var mark = 1;
                        for (var i in shops) {
                            if (i == 4 * mark) {
                                var one = commercial[0];
                                if (!one) break;
                                commercial.splice(0, 1);
                                shops.splice(i, 0, one);
                            }
                        }
                    }

                    that.setData({
                        openCity: 1,
                        // shopType: 2, //默认堂食
                        shopType: 1, //默认外卖
                        shops: shops,
                        page: len,
                        loading: true,
                        cat: res.data.cat,
                        city: res.data.city,
                        catChild: res.data.cat[0]['child'],
                        orders: orders,
                        weather: res.data.weather,
                        addclass: res.data.addclass, //详细地址
                        sort: null,
                        commercial: commercial,
                        first: true,
                    })
                    app.globalData.addclass = that.data.addclass
                }
            }
        })


    },
    onLoad: function () {
        var that = this;
        console.log(app.globalData)
        wx.getSetting({
            success(res) {
                if (!res.authSetting['scope.userLocation']) {
                    that.setData({
                        positionAllow: true,
                    })
                }
            }
        })

    },

    /*上拉加载*/
    onReachBottom: function () {
        if (this.data.nothing) {
            this.setData({
                more: true
            })
            wx.showNavigationBarLoading()
            var conditionArr = JSON.stringify(this.data.conditionArr)
            var that = this;
            var timestamp = (Date.parse(new Date())) / 1000
            var sign = MD5Util.sign(timestamp)
            wx.request({
                url: 'https://www.aftdc.com/wxapp/index/getShops',
                data: {
                    userId: wx.getStorageSync('usersInfo').userId,
                    longitude: that.data.longitude,
                    latitude: that.data.latitude,
                    page: that.data.page,
                    city: that.data.city,
                    conditionArr: conditionArr
                },
                header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                method: "POST",
                success: function (res) {
                    wx.hideNavigationBarLoading();
                    if (res.data.res == 1) {
                        //商家
                        var shops = res.data.shops;
                        if (shops) {
                            var len = shops.length;
                            for (var i in shops) {
                                //显示的活动数量判断
                                if (shops[i].tg == 1) {
                                    shops[i].projectNum--
                                }
                                if (shops[i].djq == 1) {
                                    shops[i].projectNum--
                                }
                            }

                        }
                        //广告
                        var commercial = res.data.commercial;
                        if (commercial) {
                            var mark = 1;
                            for (var i in shops) {
                                if (i == 4 * mark) {
                                    var one = commercial[0];
                                    if (!one) break;
                                    commercial.splice(0, 1);
                                    shops.splice(i, 0, one);
                                }
                            }
                        }
                        that.setData({
                            shops: that.data.shops.concat(shops),
                            page: that.data.shops.concat(shops).length,
                            more: false
                        })
                    } else {
                        that.setData({
                            nothing: false,
                            more: false
                        })
                    }
                }
            })
        }
    },
    // 下拉加载
    onPullDownRefresh: function (e) {
        //this.onReady()
        // wx.setStorageSync('shopType', '2')
        // wx.setStorageSync('orderType', '3')
        wx.setStorageSync('shopType', '1')
        wx.setStorageSync('orderType', '0')
        //
        var termActivity = this.data.termActivity
        var termcharacteristic = this.data.characteristic
        // for (var i in termFeature) {
        //   termFeature[i].ok = false
        // }
        // for (var i in termActivity) {
        //     termActivity[i].ok = false
        // }
        for (var i in termcharacteristic) {
            termcharacteristic[i].ok = false;
        }
        this.data.query = {};
        //delete this.data.conditionArr[4]
        // this.data.activityArr = []
        this.setData({
            // termActivity: termActivity,
            // termFeature: termFeature,
            characteristic: termcharacteristic,
            okActivity: '',
            // price: null,
            //time: null,
            cuisineId: null,
            filterstyle: 0,
            filterType: '',
            // activityArr: []
        })
        this.data.sortChoiceId = '';
        delete this.data.conditionArr[2]
        this.setData({
            sort: 0,
            sortid: 0,
            sortstyle: 23,
            zhSortIndex: 0,
        })
        
        

        this.getShop(this.data.latitude, this.data.longitude)
        this.setData({
            searchw: '',
            // backcolor: 2,

        })
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
    },

    //搜索页面
  focus_search: util.throttle(function () {
        var that = this
        that.closeHobbyClose()
        var current = {
            shopType: this.data.shopType,
            city: this.data.city,
            conditionArr: this.data.conditionArr,
            searchHistory: this.data.searchHistory
        }
        wx.navigateTo({
            url: '../../homePage/pages/search/search?current=' + JSON.stringify(current),
        })
    }),

    back: function () {
        this.setData({
            search: false,
            searchw: '',
        })
    },
    recommendClose: function () {
        this.setData({
            recommendState: true
        })
    },
    //选择坐标查看
  choose: util.throttle(function () {
        var that = this
        that.closeHobbyClose()
        that.again()
        wx.chooseLocation({
            success: function (res) {
                that.setData({
                    addclass: res.address,
                    longitude: res.longitude,
                    latitude: res.latitude
                })
                var location = {}
                location.longitude = res.longitude
                location.latitude = res.latitude
                app.globalData.location = location
                that.getShop(res.latitude, res.longitude)
            }
        })
    }),
    //如果没有授权重新获取授权
    again: function () {
        var that = this
        wx.getLocation({
            type: 'gcj02',
            success: function (res) {
                var latitude = res.latitude
                var longitude = res.longitude
                var location = {}
                location.longitude = longitude
                location.latitude = latitude
                that.setData({
                    latitude: latitude,
                    longitude: longitude,
                    location: location,
                    // backcolor: 2,
                    nothing: true,
                    sortid: 0,
                    sortstyle: 23,
                })
                that.data.conditionArr[0] = {
                    'shopType': that.data.shopType
                };
                // wx.setStorageSync('shopType', '2')
                // wx.setStorageSync('orderType', '3')
                wx.setStorageSync('shopType', '1')
                wx.setStorageSync('orderType', '0')
                that.getShop(latitude, longitude)
                // that.webs()
                app.globalData.location = location
            }
        })
        // wx.getSetting({
        //   success(res) {
        //     if (!res.authSetting['scope.userLocation']) {
        //       wx.OpenSetting({
        //         success: (res) => {
        //           that.onLoad()
        //           res.authSetting = {
        //             "scope.userLocation": true,
        //             positionAllow: false,
        //           }
        //         }
        //       })
        //       return false
        //     }
        //   }
        // })
    },
    onShareAppMessage: function () {
        return {
            title: '阿凡提智慧点餐',
            path: '/page/tabBar/homePage/index',
            success: function (res) {
                // 分享成功
            }
        }
    },
    //弹出活动标签
    project: function (e) {
        var that = this
        that.closeHobbyClose()
        var index = e.currentTarget.dataset.index;
        var shops = this.data.shops
        var projectLay = shops[index].projectLay
        if (Boolean(projectLay)) {
            shops[index].projectNum = projectLay
            shops[index].projectLay = false
        } else {
            shops[index].projectLay = shops[index].projectNum
            shops[index].projectNum = 100
        }
        this.setData({
            shops: shops,
        })
    },

  gator: util.throttle(function (e) {
        //1外卖 2堂食 3到店 4免配送 5优质商家 6夜市 21团购 26代金券 28砍价 27秒杀   30商家红包
        var shopId = e.currentTarget.dataset.shopid;
        var distance = e.currentTarget.dataset.distance;
        var gz = e.currentTarget.dataset.gz;
        var that = this;
        that.closeHobbyClose()
        var shopType = that.data.shopType
        wx.setStorageSync('shopType', shopType)

        if (shopType === '6' || shopType === '5') {
            var featured = e.currentTarget.dataset.featured
            switch (featured) {
                case 0:
                    wx.setStorageSync('orderType', 0)
                    break;
                case 3:
                    wx.setStorageSync('orderType', 3)
                    break;
                case 5:
                    wx.setStorageSync('orderType', 5)
                    break;
            }
        }
        // if (shopType == 5 || shopType == 21 || shopType == 26 || shopType == 6) {
        //   wx.navigateTo({
        //     url: '../introduce/introduce?shopId=' + shopId + '&distance=' + distance,
        //   })
        // } else {
        wx.navigateTo({
            url: '../../homePage/pages/order/order?shopId=' + shopId,
        })
        // }
        if (gz == 1) { //点击广告
            var timestamp = (Date.parse(new Date())) / 1000
            var sign = MD5Util.sign(timestamp)
            var userId = wx.getStorageSync('usersInfo').userId;
            wx.request({
                url: 'https://www.aftdc.com/wxapp/index/commercial_name',
                method: 'post',
                header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                data: {
                    sign: sign,
                    timestamp: timestamp,
                    token: wx.getStorageSync('usersInfo').token,
                    userId: userId,
                    shopId: shopId,
                },
                success: function (res) {

                }
            })
        }
    }),
    //跳转到运动
    sport: function (e) {
        // var backcolor = e.currentTarget.dataset.backcolor//只为该变颜色
        wx.navigateTo({
            url: '../../homePage/pages/sport/sport',
        })
    },
    //城市合伙人
    partnership: function () {
        wx.navigateTo({
            url: '../../personal/pages/phone/phone?type=2',
        })
    },
    close: function () {
        this.setData({
            conpouBox: false
        })
    },
    //下拉标签
    closeHobby: function (e) {
        var index = e.currentTarget.dataset.index;
        var shops = this.data.shops
        var closeHobby = shops[index].closeHobby
        for (var i in shops) {
            shops[i].closeHobby = false
        }
        // var chooseHobby1 = this.data.chooseHobby1
        // for (var i in chooseHobby1) {
        // 	chooseHobby1[i].sel = false
        // } 
        // var chooseHobby2 = this.data.chooseHobby2
        // for (var i in chooseHobby2) {
        // 	chooseHobby2[i].sel = false
        // } 
        shops[index].closeHobby = !closeHobby
        // if (Boolean(closeHobby)) {
        // 	shops[index].closeHobby = closeHobby
        // 	shops[index].closeHobby = false
        // } else {
        // 	shops[index].closeHobby = shops[index].closeHobby
        // 	shops[index].closeHobby = true
        // }
        this.setData({
            shops: shops,
            // chooseHobby1: chooseHobby1,
            // chooseHobby2: chooseHobby2,
            // chooseH:false
        })
    },
    //选择标签
    // chooseHobby: function (e) {
    // 	//单选
    // 	if (this.data.shopType == 2 || this.data.shopType == 21) {
    // 		var chooseHobby = this.data.chooseHobby2
    // 	} else {
    // 		var chooseHobby = this.data.chooseHobby1
    // 	}

    // 	var index = e.currentTarget.dataset.index
    // 	this.data.cuisineId = e.currentTarget.dataset.id
    // 	this.data.chooseHobbyId = chooseHobby[index]['id']
    // 	for (var i in chooseHobby) {
    // 		if (this.data.chooseHobbyId == chooseHobby[i]['id'] && chooseHobby[i]['sel'] == false) {
    // 			chooseHobby[i]['sel'] = true
    // 		} else {
    // 			chooseHobby[i]['sel'] = false
    // 		}
    // 	}
    // 	for (var i in chooseHobby) {
    // 		if (chooseHobby[i]['sel']) {
    // 			var chooseH = true
    // 			break;
    // 		} else {
    // 			var chooseH = false
    // 		}
    // 	}
    // 	if (this.data.shopType == 2 || this.data.shopType == 21) {
    // 		this.setData({
    // 			chooseH: chooseH,
    // 			chooseHobby2: chooseHobby,
    // 			chooseHobbyId: this.data.chooseHobbyId
    // 		})
    // 	} else {
    // 		this.setData({
    // 			chooseH: chooseH,
    // 			chooseHobby1: chooseHobby,
    // 			chooseHobbyId: this.data.chooseHobbyId
    // 		})
    // 	}

    // },
    // sureReason: function (e) {
    // 	var that = this
    // 	wx.getSetting({
    // 		success(res) {
    // 			if (!res.authSetting['scope.userInfo']) {//如果没登录
    // 				wx.navigateTo({
    // 					url: '../author/author',
    // 				})
    // 				return false
    // 			}else{
    // 				var shopId = e.currentTarget.dataset.id
    // 				var index = e.currentTarget.dataset.index
    // 				var shops = that.data.shops
    // 				var chooseHobbyId = that.data.chooseHobbyId
    // 				var cuisineId = that.data.cuisineId

    // 				if (chooseHobbyId == 10) { //关注 和 取消关注
    // 					var shopId = shops[index]['shopId']
    // 					shops[index].closeHobby = false
    // 					if (shops[index]['attentionType'] == 1) {
    // 						that.cancelAttention()
    // 						shops[index]['attentionType'] = 0
    // 						that.setData({
    // 							hobbyTip: true,
    // 							hobbyTips: '已取消关注',
    // 							shops: shops
    // 						})
    // 						setTimeout(function () {
    // 							that.setData({
    // 								hobbyTip: false
    // 							})
    // 						}, 5000)
    // 						return false
    // 					} else {
    // 						that.attention(shopId)
    // 						shops[index]['attentionType'] = 1
    // 						that.setData({
    // 							hobbyTip: true,
    // 							hobbyTips: '已关注',
    // 							shops: shops
    // 						})
    // 						setTimeout(function () {
    // 							that.setData({
    // 								hobbyTip: false
    // 							})
    // 						}, 5000)
    // 						return false
    // 					}
    // 				}

    // 				shops.splice(index, 1)
    // 				that.setData({
    // 					shops: shops
    // 				})
    // 				var chooseHobbyId = that.data.chooseHobbyId
    // 				var cuisineId = that.data.cuisineId
    //       var timestamp = (Date.parse(new Date())) / 1000
    //       var sign = MD5Util.sign(timestamp)
    // 				wx.request({
    //         url: 'https://www.aftdc.com/wxapp/index/userHobby',
    // 					data: {
    //           sign: sign,
    //           timestamp: timestamp,
    //           token: wx.getStorageSync('usersInfo').token,
    // 						userId:wx.getStorageSync('usersInfo').userId,
    // 						shopId: shopId,
    // 						chooseHobbyId: chooseHobbyId,
    // 						cuisineId: cuisineId
    // 					},
    // 					header: {
    // 						"Content-Type": "application/x-www-form-urlencoded"
    // 					},
    // 					method: "POST",
    // 					success: function (res) {
    // 						if (res.data.res == 1) {
    // 							that.setData({
    // 								hobbyTip: true
    // 							})
    // 							setTimeout(function () {
    // 								that.setData({
    // 									hobbyTip: false
    // 								})
    // 							}, 5000)
    // 						}
    // 					}
    // 				})
    // 				this.setData({
    // 					hobbyTip: true
    // 				})
    // 			}
    // 		}
    // 	})
    // },
    //不感兴趣
    // notInterest: function (e) {
    // 	var that = this
    // 	wx.getSetting({
    // 		success(res) {
    // 			if (!res.authSetting['scope.userInfo']) {//如果没登录
    // 				wx.navigateTo({
    // 					url: '../author/author',
    // 				})
    // 				return false
    // 			} else {
    // 				var shopId = e.currentTarget.dataset.id
    // 				var index = e.currentTarget.dataset.index
    // 				var shops = that.data.shops
    // 				shops.splice(index, 1)
    // 				that.setData({
    // 					shops: shops
    // 				})
    //       var timestamp = (Date.parse(new Date())) / 1000
    //       var sign = MD5Util.sign(timestamp)
    // 				wx.request({
    //         url: 'https://www.aftdc.com/wxapp/index/userHobby',
    // 					data: {
    //           sign: sign,
    //           timestamp: timestamp,
    //           token: wx.getStorageSync('usersInfo').token,
    // 						userId:wx.getStorageSync('usersInfo').userId,
    // 						shopId: shopId
    // 					},
    // 					header: { "Content-Type": "application/x-www-form-urlencoded" },
    // 					method: "POST",
    // 					success: function (res) {
    // 						if (res.data.res == 1) {
    // 							that.setData({
    // 								notInterest: true
    // 							})
    // 							setTimeout(function () {
    // 								that.setData({
    // 									notInterest: false
    // 								})
    // 							}, 5000)
    // 						}
    // 					}
    // 				})
    // 			}
    // 		}
    // 	})
    // },


    //打开排序和筛选列表
    openSortbox: function (e) {
        var that = this;
        if (!that.data.allChoice) {
            wx.pageScrollTo({
                scrollTop: 440
            })
        }
        var opentype = e.currentTarget.dataset.id
        //23打开综合排序 21打开筛选
        that.setData({
            opentype: opentype,
            allChoice: true,
        })
        if (that.data.opentype == 21) { //设置23综合排序 21打开筛选，字体颜色

            if (that.data.where != 21) {
                that.setData({
                    filterstyle: 21,
                    where: 21,
                })
            } else {
                that.setData({
                    where: 0,
                    allChoice: false,
                })

                //没有选择就不会字体不改变21排序，23筛选
                if (!this.data.conditionArr[4]) {
                    this.setData({
                        filterstyle: 0
                    })
                }
            }
        } else {
            if (that.data.where != 23) {
                that.setData({
                    sortstyle: 23,
                    where: 23,
                })
            } else {
                that.setData({
                    where: 0,
                    allChoice: false,
                })
                //没有选择就不会字体不改变21排序，23筛选

                var id = this.data.sortChoiceId;
                if (id == 2 || id == 3) {
                    this.setData({
                        sortstyle: 0
                    })
                }
            }
            this.screenSelect();
        }

    },

    //找相似
    lookfor: function (e) {
        var index = e.currentTarget.dataset.index
        var id = this.data.shops[index].cuisineId
        this.data.conditionArr = []
        var cuisineId = {
            'cuisineId': id
        }
        this.data.conditionArr[1] = cuisineId
        this.commentGet()
    },
    //-------------** 大导航的筛选 **-------------
  chooseShopType: util.throttle(function (e) {
        wx.navigateTo({
            url: '../../homePage/pages/subpage/subpage?dataShoptype=' + e.currentTarget.dataset.shoptype + '&orderType=' + e.currentTarget.dataset.ordertype,
        })

        // //只为该变颜色
        // // var backcolor = e.currentTarget.dataset.backcolor
        // // this.setData({
        // //   backcolor: backcolor
        // // })
        // //加载导航条动画
        // wx.showNavigationBarLoading()
        // //shopType  1外卖 2堂食 3到店 4免配送 5品牌商家 6夜宵 21团购 26代金券（附近优惠） 27秒杀 28砍价
        // var shopType = e.currentTarget.dataset.shoptype
        // if (shopType == this.data.shopType) { return false;}
        // this.data.shopType = shopType;
        // this.setData({
        //   shopType: shopType
        // })

        // //orderType 订单类型 0外卖 2扫码点餐 3订座点餐 4团购单 5自取单
        // if (shopType == 1) {
        //   wx.setStorageSync('orderType', '0')
        // } else if (shopType == 2) {
        //   wx.setStorageSync('orderType', '3')
        // } else if (shopType == 3) {
        //   wx.setStorageSync('orderType', '5')
        // }

        // var shopType = { 'shopType': shopType }
        // this.data.conditionArr[0] = shopType
        // this.commentGet()
    }),
    //选择综合排序
    chooseZhSort: function (e) {
        //排序sort 0：综合排序，8：销量优先，9：起送价最低，10：配送最快，11：配送费最低，12：人均从低到高，13：人均从高到低
        var sort = e.currentTarget.dataset.id
        // if (sort == this.data.sortChoiceId) {
        //     return false;
        // }
        this.data.sortChoiceId = sort;
        var index = e.currentTarget.dataset.index
        this.setData({
            opentype: sort,
            sort: sort,
            zhSortIndex: index,
            sortid: sort,
            where: 0,
        })
        var sort = {
            'sort': sort
        }
        this.data.conditionArr[2] = sort
        this.commentGet()
        this.hiddenChoice()
    },
    //选择菜系
    chooseChild: function (e) {
        var id = e.currentTarget.dataset.id
        var idx = e.currentTarget.dataset.idx
        this.setData({
            cuisineId: id,
            idx: idx
        })
        var cuisineId = {
            'cuisineId': id
        }
        this.data.conditionArr[1] = cuisineId
        // this.commentGet()
    },
    //选择排序
    sortChoice: function (e) {
        wx.pageScrollTo({
            scrollTop: 440
        })
        //排序sort 2:离我最近，3：好评优先
        var sort = e.currentTarget.dataset.id
        if (sort == this.data.sortChoiceId) {
            this.data.conditionArr[2] = 0
            this.data.sortChoiceId = 0;
            this.setData({
                opentype: 0,
                sort: 0,
                sortid: 0,
                sortstyle: 23,
                zhSortIndex: 0,
                where: 0,
            })
        } else {
            this.data.sortChoiceId = sort;
            this.setData({
                opentype: sort,
                sort: sort,
                sortid: sort,
                sortstyle: 0,
                zhSortIndex: 0,
                where: 0,
            })
            var sort = {
                'sort': sort
            }
            this.data.conditionArr[2] = sort
        }
        this.commentGet();
        this.hiddenChoice();
        this.screenSelect();
    },
    //进行排序 sort： 0：综合排序，2:离我最近，3：好评优先，8：销量优先，9：起送价最低，10：配送最快，11：配送费最低，12：人均从低到高，13：人均从高到低
    paixu: function () {
        var id = this.data.sortChoiceId
        var shops = this.data.shops
        if (shops) {
            shops.sort(function (a, b) {
                if (id == 0) {
                    if (a.distance == b.distance) {
                        if (a.shopAvg == b.shopAvg) {
                            return parseInt(b.sales) - parseInt(a.sales);
                        } else return parseInt(b.shopAvg) - parseInt(a.shopAvg);
                    } else return parseInt(a.distance) - parseInt(b.distance);
                } else if (id == 2) {
                    if (a.distance == b.distance) {
                        return parseInt(b.sales) - parseInt(a.sales);
                    } else return parseInt(a.distance) - parseInt(b.distance);
                } else if (id == 3) {
                    if (b.shopAvg == a.shopAvg) {
                        return parseInt(b.sales) - parseInt(a.sales);
                    } else return parseInt(b.shopAvg) - parseInt(a.shopAvg);
                } else if (id == 8) {
                    if (b.sales == a.sales) {
                        return parseInt(b.shopAvg) - parseInt(a.shopAvg);
                    } else return parseInt(b.sales) - parseInt(a.sales);
                } else if (id == 9) {
                    if (a.deliveryFreeMoney == b.deliveryFreeMoney) {
                        return parseInt(a.deliveryStartMoney) - parseInt(b.deliveryStartMoney);
                    } else return parseInt(a.deliveryFreeMoney) - parseInt(b.deliveryFreeMoney);
                } else if (id == 10) {
                    if (a.deliveryCostTime == b.deliveryCostTime) {
                        return parseInt(a.distance) - parseInt(b.distance);
                    } else return parseInt(a.deliveryCostTime) - parseInt(b.deliveryCostTime);
                } else if (id == 11) {
                    if (a.deliveryStartMoney == b.deliveryStartMoney) {
                        return parseInt(a.deliveryFreeMoney) - parseInt(b.deliveryFreeMoney);
                    } else return parseInt(a.deliveryStartMoney) - parseInt(b.deliveryStartMoney);
                } else if (id == 12) {
                    if (a.avgeCostMoney == b.avgeCostMoney) {
                        return parseInt(b.sales) - parseInt(a.sales);
                    } else return parseInt(a.avgeCostMoney - b.avgeCostMoney);
                } else if (id == 13) {
                    if (b.avgeCostMoney == a.avgeCostMoney) {
                        return parseInt(b.sales) - parseInt(a.sales);
                    } else return parseInt(b.avgeCostMoney - a.avgeCostMoney);
                }
            })
            this.setData({
                shops: shops
            })
        }
    },
    //获取店铺
    commentGet: function () {
        var conditionArr = JSON.stringify(this.data.conditionArr)
        var that = this
        var timestamp = (Date.parse(new Date())) / 1000
        var sign = MD5Util.sign(timestamp)
        wx.request({
            url: 'https://www.aftdc.com/wxapp/index/getShops',
            data: {
                userId: wx.getStorageSync('usersInfo').userId, //用户Id
                longitude: that.data.longitude, //经度
                latitude: that.data.latitude, //纬度
                page: 0,
                city: that.data.city, //所在的城市
                conditionArr: conditionArr //条件
            },
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST",
            success: function (res) {
                wx.hideNavigationBarLoading()
                if (res.data.res == 1) {
                    if (res.data.openCity == 0 || res.data == '') {
                        that.setData({
                            shops: false,
                            nothing: false,
                            openCity: 0
                        })
                    } else {
                        // if (conditionArr[2]) {
                        //   that.paixu()
                        // }
                        //商家
                        var shops = res.data.shops;
                        //广告
                        var commercial = res.data.commercial;
                        if (commercial) {
                            var mark = 1;
                            for (var i in shops) {
                                if (i == 4 * mark) {
                                    var one = commercial[0];
                                    if (!one) break;
                                    commercial.splice(0, 1);
                                    shops.splice(i, 0, one);
                                }
                            }
                        }
                        that.setData({
                            shops: shops,
                            page: len,
                            nothing: true,
                            arr: '',
                            openCity: 1,
                        })
                    }
                } else {
                    that.setData({
                        shops: false
                    })
                }
            }
        })
    },
    //关闭排序和筛选的弹框
    hiddenChoice: function () {
        this.setData({
            allChoice: false
        })
    },
    //点x图标关闭排序和筛选的弹框
    isxClose: function (e) {
        this.setData({
            allChoice: false,
            where: 0,
        })
        //没有选择就不会字体不改变21排序，23筛选
        var openstyle = e.currentTarget.dataset.openstyle;
        if (openstyle == 21) {
            if (!this.data.conditionArr[4]) {
                this.setData({
                    filterstyle: 0
                })
            }
        } else {
            var id = this.data.sortChoiceId;
            if (id == 2 || id == 3) {
                this.setData({
                    sortstyle: 0
                })
            }
        }
    },
    // //筛选选择
    // termFeature: function (e) {
    //   var feindex = e.currentTarget.dataset.feindex;
    //   var termFeature = this.data.termFeature
    //   termFeature[feindex].ok = !termFeature[feindex].ok
    //   this.setData({
    //     termFeature: termFeature
    //   })
    // },
    //营业时段
    OpenTime: function (e) {
        var that = this
        var time = e.currentTarget.dataset.time
        if (time == that.data.time) {
            this.setData({
                time: ''
            })
        } else {
            this.setData({
                time: time
            })
        }

    },
    //人均价格
    Price: function (e) {
        var that = this
        var price = e.currentTarget.dataset.price
        if (price == that.data.price) {
            this.setData({
                price: ''
            })
        } else {
            this.setData({
                price: price
            })
        }

    },
    //活动选择
    termActivity: function (e) {
        var that = this
        var acindex = e.currentTarget.dataset.acindex;
        var termActivity = this.data.termActivity
        var okActivity = termActivity[acindex].shopType
        var activityArr = that.data.activityArr
        var activityArrTOR = false
        if (termActivity[acindex].ok) {
            termActivity[acindex].ok = false;
        } else {
            termActivity[acindex].ok = true;
        }
        for (var i in activityArr) {
            if (activityArr[i] == okActivity) {
                activityArr.splice(i, 1)
                activityArrTOR = true
                break;
            }
        }
        if (!activityArrTOR) {
            activityArr.push(okActivity);
        }
        this.setData({
            termActivity: termActivity,
            okActivity: okActivity,
        })
    },
    //选择商家特色
    characteristicClick: function (e) {
        var that = this
        var acindex = e.currentTarget.dataset.acindex;
        var termActivity = this.data.characteristic
        var okActivity = termActivity[acindex].shopType
        var orderType = termActivity[acindex].orderType
        wx.setStorageSync('orderType', orderType)
        this.data.filterType = okActivity;
        var shopType = okActivity
        for (var i in termActivity) {
            if (acindex == i && !termActivity[i].ok) {
                termActivity[i].ok = true
            } else {
                termActivity[i].ok = false
            }
        }
        if (!termActivity[acindex].ok) {
            this.data.filterType = 1;
            shopType = 1
        }
        this.setData({
            characteristic: termActivity,
            shopType: shopType
        })
    },
    //组合
    termbut: function (e) {
        wx.showNavigationBarLoading()
        // var termFeature = this.data.termFeature
        var price = this.data.price
        var time = this.data.time
        var activityArr = this.data.activityArr
        var filterType = this.data.filterType; //商家特色
        var query = {}
        //商家特色
        if (filterType) this.data.conditionArr[0] = {
            'shopType': filterType
        };
        //优惠活动
        if (JSON.stringify(activityArr) !== '[]') {
            query.shopType = activityArr
        }
        //用餐时段
        if (time) {
            query.time = time
        }
        //人均价格
        if (price) {
            query.price = price
        }
        var conditionArr = this.data.conditionArr
        if (JSON.stringify(query) !== '{}') {
            conditionArr[4] = query
            this.setData({
                conditionArr: conditionArr,
                isScreen: 1,
            })
        } else {
            conditionArr[4] = null
            this.setData({
                conditionArr: conditionArr,
                isScreen: 0,
            })
        }
        this.setData({
            query: query,
            allChoice: false,
            where: 0,
        })
        //更新首页商家特色背景色
        // if (filterType) {
        //   this.setData({
        //     backcolor: filterType
        //   })
        // }
        this.commentGet();



        var confrim = e.currentTarget.dataset.confrim;
        if (confrim == 21) {
            this.screenSelect();
        }

    },
    screenSelect: function () {

        if (!this.data.isScreen) {

            //没有选择就不会字体不改变21排序，23筛选

            var id = this.data.sortChoiceId;
            if (!this.data.conditionArr[4]) {
                this.setData({
                    filterstyle: 0
                })
            }
        }
    },
    //清除筛选
    termDelete: function (e) {
        //判断清除的是23排序还是21筛选
        var openstyle = e.currentTarget.dataset.openstyle;
        if (openstyle == 21) {
            // var termFeature = this.data.termFeature
            var termActivity = this.data.termActivity
            var termcharacteristic = this.data.characteristic
            // for (var i in termFeature) {
            //   termFeature[i].ok = false
            // }
            for (var i in termActivity) {
                termActivity[i].ok = false
            }
            for (var i in termcharacteristic) {
                termcharacteristic[i].ok = false;
            }
            this.data.query = {};
            delete this.data.conditionArr[4]
            this.data.activityArr = []
            this.setData({
                termActivity: termActivity,
                // termFeature: termFeature,
                characteristic: termcharacteristic,
                okActivity: '',
                price: null,
                time: null,
                cuisineId: null,
                filterstyle: 0,
                filterType: '',
                activityArr: [],
            })
        } else {
            this.data.sortChoiceId = '';
            delete this.data.conditionArr[2]
            this.setData({
                sort: 0,
                sortid: 0,
                sortstyle: 23,
                zhSortIndex: 0,
            })
        }
    },
    attentions: function (index, type) {
        var shops = this.data.shops

        var that = this
        var usersInfo = wx.getStorageSync('usersInfo')
        if (!usersInfo || !usersInfo.userPhone) { //如果没登录
            wx.navigateTo({
                url: '../../homePage/pages/author/author',
            })
            return false
        } else {
            var shopId = shops[index]['shopId']
            shops[index].closeHobby = false
            if (type == 1) {
                if (shops[index]['attentionType'] == 1) {
                    var url = 'https://www.aftdc.com/wxapp/Shop/cancelAttention'
                    that.cancelAttention(shopId, url)
                    shops[index]['attentionType'] = 0
                    that.setData({
                        chooseHobbyId: 10,
                        hobbyTip: true,
                        hobbyTips: '已取消关注',
                        shops: shops
                    })
                    setTimeout(function () {
                        that.setData({
                            hobbyTip: false
                        })
                    }, 5000)
                } else {
                    var url = 'https://www.aftdc.com/wxapp/Shop/attention'
                    that.attention(shopId, url)
                    shops[index]['attentionType'] = 1
                    that.setData({
                        chooseHobbyId: 10,
                        hobbyTip: true,
                        hobbyTips: '已关注',
                        shops: shops
                    })
                    setTimeout(function () {
                        that.setData({
                            hobbyTip: false
                        })
                    }, 5000)
                }
            } else {
                if (shops[index]['colType'] == 1) {
                    var url = 'https://www.aftdc.com/wxapp/Mine/delete_collect'
                    that.cancelAttention(shopId, url)
                    shops[index]['colType'] = 0
                    that.setData({
                        chooseHobbyId: 10,
                        hobbyTip: true,
                        hobbyTips: '已取消收藏',
                        shops: shops
                    })
                    setTimeout(function () {
                        that.setData({
                            hobbyTip: false
                        })
                    }, 5000)
                } else {
                    var url = 'https://www.aftdc.com/wxapp/Index/collect'
                    that.attention(shopId, url)
                    shops[index]['colType'] = 1
                    that.setData({
                        chooseHobbyId: 10,
                        hobbyTip: true,
                        hobbyTips: '收藏成功',
                        shops: shops
                    })
                    setTimeout(function () {
                        that.setData({
                            hobbyTip: false
                        })
                    }, 5000)
                }
            }
        }
    },
    //关注
    attention: function (shopId, url) {
        var that = this
        // var userId = wx.getStorageSync('usersInfo').userId
        var timestamp = (Date.parse(new Date())) / 1000
        var sign = MD5Util.sign(timestamp)
        wx.request({
            url: url,
            data: {
                sign: sign,
                timestamp: timestamp,
                token: wx.getStorageSync('usersInfo').token,
                // userId: userId,
                shopId: shopId
            },
            method: "POST",
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {

            }
        })
    },
    //取消关注
    cancelAttention: function (shopId, url) {
        var that = this
        // var userId = app.usersInfo.userId
        var timestamp = (Date.parse(new Date())) / 1000
        var sign = MD5Util.sign(timestamp)
        wx.request({
            url: url,
            data: {
                sign: sign,
                timestamp: timestamp,
                token: wx.getStorageSync('usersInfo').token,
                // userId: userId,
                shopId: shopId
            },
            method: "POST",
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) { }
        })
    },
    closeHobbyClose: function () {
        var shops = this.data.shops
        for (var i in shops) {
            shops[i].closeHobby = false
        }
        this.setData({
            shops: shops
        })
    },
    closeOpen: function (e) {
        var index = e.currentTarget.dataset.index;
        var shops = this.data.shops
        var projectLay = shops[index].projectLay
        var closeHobby = shops[index].closeHobby
        if (Boolean(projectLay)) {
            shops[index].projectNum = projectLay
            shops[index].projectLay = false
        }
        if (Boolean(closeHobby)) {
            shops[index].closeHobby = closeHobby
            shops[index].closeHobby = false
        }
        this.setData({
            shops: shops,
        })
    },
    formnextBut: function (e) {
        var that = this;
        var shops = this.data.shops
        var formId = e.detail.formId;
        var index = e.currentTarget.dataset.index
        var type = e.currentTarget.dataset.type
        this.attentions(index, type)
        if (type == 1) { //关注
            var attentionType = shops[index]['attentionType'];
            if (attentionType == 0) {
                that.formId(formId, index)
            }
        } else {
            var colType = shops[index]['colType'];
            if (colType == 0) {
                that.formId(formId, index)
            }
        }
    },

    formId: function (formId, index) {
        var that = this;
        var shops = this.data.shops
        var shopId = shops[index]['shopId']
        var userId = wx.getStorageSync('usersInfo').userId;
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
                userId: userId,
                shopId: shopId,
            },
            success: function (res) { }
        })
    },
    not: function (e) { }, //空白区域关闭抽屉
    //扫码点餐
    sys: function () {
        wx.scanCode({
            success: (res) => {
                wx.navigateTo({
                    url: res.path,
                })
            }
        })
    }
})