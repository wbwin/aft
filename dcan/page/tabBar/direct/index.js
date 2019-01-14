var app = getApp()
var MD5Util = require('../../../utils/md5.js');
var util = require('../../../utils/util.js')
const innerAudioContext = wx.createInnerAudioContext();
Page({

    data: {
        uninterestedTab: 0,
        noInterest: false,
        first: false,//是否执行刷新页面
        //餐头条不感兴趣数据
        uninterestedText: [
            {
                title: '不感兴趣',
                subTitle: '减少这类内容'
            },
            {
                title: '反馈垃圾内容',
                subTitle: '低俗，标题党等'
            },
            {},
            {
                title: '屏蔽'
            },
            {}
        ],
        urText: ['旧闻重复', '垃圾内容','低俗色情', '标题党', '内容不实'],



        winHeight: "", //窗口高度
        currentTab: 0, //预设当前项的值
        onreachBottom: true,
        cur: 0,
        mFirst: 0,
        recede: 0,
        length: 0,
        action: 0,
        videoRecommendData: ''
    },


    // 下拉刷新
    onPullDownRefresh: function(e) {
        this.cutArticle(this.data.currentTab)
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
    },
    moreVideo(){
        this.setData({currentTab: 3});
        this.cutArticle(3);
    },
    // 滚动切换标签样式
    // switchTab: function (e) {
    // 	if (e.detail.source =='touch'){
    // 		this.setData({
    // 			article:[],
    // 			currentTab: e.detail.current,
    // 			toView: 'id' + e.detail.current
    // 		});
    // 		this.cutArticle(e.detail.current);
    // 	}
    // },
    // 点击标题切换当前页时改变样式
    swichNav: function(e) {
        var cur = e.target.dataset.current;
        if (this.data.currentTab == cur) {
            if (cur == 0) {
                wx.startPullDownRefresh()
            } else
                return false;
        } else {
            this.setData({
                currentTab: cur
            })
            this.cutArticle(cur);
        }
    },
    onTabItemTap(item) {
        if (this.data.action)
            wx.startPullDownRefresh()
        this.setData({
            action: 1
        })
    },
    //切换文章
    cutArticle: function(cur) {
        this.setData({
            article: [],
            cur: cur,
            page: 0,
            onreachBottom: true,
            articleRes: 1
        });

        if (cur != 0)
            var cur = this.data.cat[cur].id
        var userId = userId = wx.getStorageSync('usersInfo').userId
        if (!userId) {
            userId = ''
        }

        var that = this;
        var timestamp = (Date.parse(new Date())) / 1000
        var sign = MD5Util.sign(timestamp)
        wx.request({
            url: 'https://www.aftdc.com/wxapp/Article/NewsTo',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                latitude: that.data.latitude,
                longitude: that.data.longitude,
                userId: userId,
                cur: cur,
                page: that.data.page,
            },
            method: "POST",
            success: function(res) {
                that.setData({
                    article: res.data.data,
                    page: res.data.data.length,
                    articleRes: res.data.res,
                    cur: cur,
                    first: true,
                })
            }
        })
    },
    //点击时隐藏红点
    // onTabItemTap(item) {
    // 	wx.hideTabBarRedDot({
    // 		index: 2,
    // 	})
    // },
    onReady: function(options) {
        this.setData({
            cur: 0,
            page: 0,
            onreachBottom: true,
            articleRes: 1
        });
    },
    onLoad: function() {
        if (!this.data.action) {
            var that = this
            console.log('onload')
            wx.getLocation({
                type: 'gcj02',
                success: function(res) {
                    var latitude = res.latitude
                    var longitude = res.longitude
                    that.setData({
                        latitude: latitude,
                        longitude: longitude,
                    })
                    that.article(latitude, longitude)
                },
                fail: function(res) {
                    that.article('', '')
                },
            })
        }
    },
    article: function(latitude, longitude) {
        var userId = userId = wx.getStorageSync('usersInfo').userId
        if (!userId) {
          userId = ''
        }
        var cur = 0;
        var that = this;
        var timestamp = (Date.parse(new Date())) / 1000
        var sign = MD5Util.sign(timestamp)
        wx.request({
            url: 'https://www.aftdc.com/wxapp/Article/News',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                userId: userId,
                cur: cur,
                page: that.data.page,
                latitude: latitude,
                longitude: longitude
            },
            method: "POST",
            success: function(res) {
                that.setData({
                    article: res.data.data,
                    page: that.data.page + res.data.data.length,
                    articleRes: res.data.res,
                    length: res.data.data.length,
                    cat: res.data.cat,
                    first: true,
                })
                if (res.data.video){
                    that.setData({
                        videoRecommendData: res.data.video
                    })
                }
              that.setData({
                animationLoading: true,//加载图
              })
            }
        })
    },

    //刷新页面
    onShow: function () {
        var first = this.data.first
        console.log(first);
        if (first) {
            this.onPullDownRefresh()
        }
    },

    onReachBottom: function() {
        if (this.data.onreachBottom) {
            this.setData({
                more: true
            })
            this.data.onreachBottom = false
            var userId = userId = wx.getStorageSync('usersInfo').userId
            if (!userId) {
              userId = ''
            }
            var that = this;
            wx.request({
                url: 'https://www.aftdc.com/wxapp/Article/NewsTo',
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                data: {
                    latitude: that.data.latitude,
                    longitude: that.data.longitude,
                    userId: userId,
                    cur: that.data.cur,
                    page: that.data.page
                },
                method: "POST",
                success: function(res) {
                    if (res.data.res == 1) {
                        that.setData({
                            article: that.data.article.concat(res.data.data),
                            page: that.data.page + res.data.data.length,
                            onreachBottom: true,
                            first: true,
                        })
                        if (res.data.video) {
                            that.setData({
                                videoRecommendData: res.data.video
                            })
                        }
                    }else{
                      that.setData({
                        more: false,
                        onreachBottom:false
                      })
                    }
                    that.setData({
                        more: false
                    })
                }
            })
        }
    },

  seeDetail: util.throttle(function (e) {
        var id = e.currentTarget.dataset.id
        wx.request({
            url: 'https://www.aftdc.com/wxapp/Article/article_click',
            method: 'post',
            data: {
                id: id,
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function(res) {
                console.log(res)
            }
        })
        wx.navigateTo({
          url: '../../direct/pages/article/article?article_id=' + id,
        })
    }),
    //点击X
  noInterest: util.throttle(function (e) {
        var index = e.currentTarget.dataset.index
        var article = this.data.article[index]
        if (article.attention == 1){
            var name = '取消关注'
        }else{
            var name = '关注'
        }
        var chooseHobby = [{
            name: name,
            sel: false,
            id: 0
        },{
            name: '看过了',
            sel: false,
            id: 1
        }, {
            name: '内容太水',
            sel: false,
            id: 2
        }]
        chooseHobby.push({
            name: '拉黑作者',
            sel: false,
            id: 3
        })
        if (article.key_word!='') {
            for (var i in article.key_word) {
                var a = {
                    name: '不想看·' + article.key_word[i],
                    sel: false,
                    id: 4 + i
                }
                chooseHobby.push(a)
            }
        }
        this.setData({
            noInterest: true,
            index: index,
            chooseHobby: chooseHobby
        })

        this.setData({
            shield: article.key_word
        })

    }),


    //禁止不感兴趣左右滑动
    catchTouchMove: function (res) {
        return false
    },
    uninterestedClick: function (e) {
        var i = e.currentTarget.dataset.index;
        switch (i) {
            case 0:
                this.notInterestfun(e);
                break;
            case 1:
                this.setData({ uninterestedTab: 1 });
                break;
            case 2:
                this.chooseHobby(3);
                this.sureReason();
                break;
            case 3:
                this.setData({ uninterestedTab: 2 });
                break;
            case 4:
                this.chooseHobby(0);
                this.sureReason();
                break;
        }
    },
    //返回不敢兴趣小页面
    uninterestedReturn: function () {
        this.setData({ uninterestedTab: 0 })
    },
    //反馈
    feedback: function (e) {
        var i = e.currentTarget.dataset.index;
        if (i < 2) {
            this.chooseHobby(i + 1);
            this.sureReason();
        }
    },
    //按类型屏蔽文章
    shieldType: function (e) {
        var i = e.currentTarget.dataset.index;
        this.chooseHobby(i + 4);
        this.sureReason();
    },


    closeBox: function() {
        var chooseHobby = this.data.chooseHobby
        for (var i in chooseHobby) {
            chooseHobby[i]['sel'] = false
        }
        this.setData({
            noInterest: false,
            chooseHobbyId: null,
            chooseHobby: chooseHobby,
            chooseH: false
        })
        this.setData({ uninterestedTab: 0 })
    },
    //选择标签
    chooseHobby: function(i) {    //原始值：e
        //单选
        var chooseHobby = this.data.chooseHobby

        //var index = e.currentTarget.dataset.index     //传index
        var index = i
        // this.data.cuisineId = e.currentTarget.dataset.id
        this.data.chooseHobbyId = chooseHobby[index]['id']
        for (var i in chooseHobby) {
            if (this.data.chooseHobbyId == chooseHobby[i]['id'] && chooseHobby[i]['sel'] == false) {
                chooseHobby[i]['sel'] = true
            } else {
                chooseHobby[i]['sel'] = false
            }
        }
        for (var i in chooseHobby) {
            if (chooseHobby[i]['sel']) {
                var chooseH = true
                break;
            } else {
                var chooseH = false
            }
        }
        this.setData({
            chooseH: chooseH,
            chooseHobby: chooseHobby,
            chooseHobbyId: this.data.chooseHobbyId
        })
    },
    sureReason: function() {
        var that = this
        var usersInfo = wx.getStorageSync('usersInfo')
        if (!usersInfo || !usersInfo.userPhone) { //如果没登录
            wx.navigateTo({
              url: '../../homePage/pages/author/author',
            })
            return false
        } else {
            var index = that.data.index
            var article = that.data.article
            var shopId = article[index].shopId
            var business_id = article[index].business_id
            var article_id = article[index].id

            for (var j = 0; j < that.data.chooseHobby.length; j++) {
                if (that.data.chooseHobby[j].id == that.data.chooseHobbyId)
                    var chooseHobby = that.data.chooseHobby[j]
            }
            var reason = chooseHobby.name

            var chooseHobbyId = that.data.chooseHobbyId
            if (chooseHobbyId == 0){ //关注或取消关注
                var article = this.data.article
                if (reason == '关注'){
                    for (var i in article){
                        if (article[i].shopId == shopId){
                            article[i].attention =1
                        }
                    }
                    this.attention(shopId)
                    this.setData({
                        article: article,
                        hobbyTip: true,
                        hobbyTips: '已关注',
                    })
                }else{
                    for (var i in article) {
                        if (article[i].shopId == shopId) {
                            article[i].attention = 0
                        }
                    }
                    this.cancelAttention(shopId)
                    this.setData({
                        article: article,
                        hobbyTip: true,
                        hobbyTips: '已取消关注',
                    })
                }
                this.closeBox()
                setTimeout(function () {
                    that.setData({
                        hobbyTip: false
                    })
                }, 5000)
                return false;
            }

            if (chooseHobbyId == 3) { //拉黑作者
                this.black(shopId);
                this.closeBox();
                this.setData({
                    hobbyTip: true,
                    hobbyTips: '已拉黑',
                })
                setTimeout(function () {
                    that.setData({
                        hobbyTip: false
                    })
                }, 5000)
                this.onPullDownRefresh()
                return false
            }

            var cuisineId = that.data.cuisineId

            article.splice(index, 1)
            that.setData({
                article: article,
                hobbyTip: true,
                hobbyTips: '将减少此类文章推荐',
            })
            setTimeout(function() {
                that.setData({
                    hobbyTip: false
                })
            }, 5000)
            that.closeBox()
            var timestamp = (Date.parse(new Date())) / 1000
            var sign = MD5Util.sign(timestamp)
            wx.request({
                url: 'https://www.aftdc.com/wxapp/Article/article_shield',
                data: {
                    sign: sign,
                    timestamp: timestamp,
                    token: wx.getStorageSync('usersInfo').token,
                    userId:wx.getStorageSync('usersInfo').userId,
                    shopId: shopId,
                    business_id: business_id,
                    article_id: article_id,
                    reason: reason,
                    tagName: ""
                },
                header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                method: "POST",
                success: function(res) {
                    if (res.data.res == 1) {

                    }
                }
            })
        }
    },
    //不感兴趣
    notInterestfun: function(e) {
        var that = this
        var usersInfo = wx.getStorageSync('usersInfo')
        if (!usersInfo || !usersInfo.userPhone) { //如果没登录
            wx.navigateTo({
              url: '../../homePage/pages/author/author',
            })
            return false
        } else {
            var index = that.data.index
            var article = that.data.article
            var shopId = article[index].shopId
            var business_id = article[index].business_id
            var article_id = article[index].id
            article.splice(index, 1)
            that.setData({
                article: article,
                hobbyTip: true,
                hobbyTips: '将减少此类文章推荐',
            })
            setTimeout(function() {
                that.setData({
                    hobbyTip: false
                })
            }, 5000)
            that.closeBox()
            var timestamp = (Date.parse(new Date())) / 1000
            var sign = MD5Util.sign(timestamp)
            wx.request({
                url: 'https://www.aftdc.com/wxapp/Article/article_shield',
                data: {
                    sign: sign,
                    timestamp: timestamp,
                    token: wx.getStorageSync('usersInfo').token,
                    userId:wx.getStorageSync('usersInfo').userId,
                    shopId: shopId,
                    business_id: business_id,
                    article_id: article_id,
                    reason: '不感兴趣',
                    tagName: ""
                },
                header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                method: "POST",
                success: function(res) {
                    if (res.data.res == 1) {

                    }
                }
            })
        }
    },
    onShareAppMessage: function() {
        return {
            title: '餐头条',
          path: '/page/tabBar/direct/index',
            success: function(res) {}
        }
    },
    toshopInfo: function() {
        wx.navigateTo({
          url: '../../homePage/pages/shopdetail/shopdetail?shopId=642',
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {},
        })
    },
    //关注
    attention: function (shopId) {
        var that = this
        var userId = wx.getStorageSync('usersInfo').userId
        var timestamp = (Date.parse(new Date())) / 1000
        var sign = MD5Util.sign(timestamp)
        wx.request({
            url: 'https://www.aftdc.com/wxapp/Article/attention',
            data: {
                userId: userId,
                shopId: shopId,
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
    cancelAttention: function (shopId) {
        var that = this
        var userId = wx.getStorageSync('usersInfo').userId
        var timestamp = (Date.parse(new Date())) / 1000
        var sign = MD5Util.sign(timestamp)
        wx.request({
            url: 'https://www.aftdc.com/wxapp/Article/cancelAttention',
            data: {
                userId: userId,
                shopId: shopId,
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
    //拉黑作者
    black: function (shopId){
        var that = this
        var userId = wx.getStorageSync('usersInfo').userId
        var timestamp = (Date.parse(new Date())) / 1000
        var sign = MD5Util.sign(timestamp)
        wx.request({
            url: 'https://www.aftdc.com/wxapp/Article/black',
            data: {
                userId: userId,
                shopId: shopId,
                sign: sign,
                timestamp: timestamp,
                token: wx.getStorageSync('usersInfo').token,
            },
            method: "POST",
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            success: function (res) {
            }
        })
    }
})