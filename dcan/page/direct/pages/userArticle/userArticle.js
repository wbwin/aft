var app = getApp()
var zanTime
var MD5Util = require('../../../../utils/md5.js');
Page({

    data: {
        page: 0,  //分页
        articleDetail: [],
        articleInfo: {},
        lyData: [],
        xiala: true,
        onReachBottom: false,
        src: '',
        longitude: "",
        latitude: "",
        content: '',
        id: '',
        focus:false,
        show:1
    },
    //播放
    // play: function () {
    // 	this.audioCtx.pause()
    // 	this.setData({
    // 		play: false
    // 	})
    // },
    //暂停
    // stop: function () {
    // 	this.audioCtx.play()
    // 	this.setData({
    // 		play: true
    // 	})
    // },
    onShareAppMessage: function (res) {
        return {
            title: this.data.articleInfo.title,
          path: '/page/direct/pages/article/article?article_id=' + this.data.articleInfo.id,
            success: function (res) {
                // 转发成功
            }
        }
    },
    onLoad: function (options) {
        if (app.globalData.usersInfo)
            var userId = wx.getStorageSync('usersInfo').userId
        else
            var userId = ""

        var that = this
        var latitude = that.data.latitude
        var longitude = that.data.longitude
        var id = options.article_id
        this.setData({ 'id': id })
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    windowHeight: res.windowHeight + 40
                })
            }
        })
    },

    onReady: function () {
        // this.audioCtx = wx.createAudioContext('myAudio')
        // this.audioCtx.setSrc('http://zhangmenshiting.qianqian.com/data2/music/134369618/342423226800128.mp3?xcode=53479afd8066880152d17b2d9b')
        // this.audioCtx.play()
        var that = this
        wx.getLocation({
            type: 'gcj02',
            success: function (res) {
                var latitude = res.latitude
                var longitude = res.longitude
                that.article(latitude, longitude)
            },
            fail: function (res) {
                that.article('', '')
            },
        })
    },
    //文章详细
    article: function (latitude, longitude) {
        var that = this
        var id = that.data.id
        if (app.globalData.usersInfo)
            var userId = wx.getStorageSync('usersInfo').userId
        else
            var userId = ""
        var timestamp = (Date.parse(new Date())) / 1000
        var sign = MD5Util.sign(timestamp)
        wx.request({
            url: 'https://www.aftdc.com/wxapp/Userarticle/newDetail',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                id: id,
                userId: userId,
                longitude: longitude,
                latitude: latitude,
            },
            method: "POST",
            success: function (res) {
                that.setData({
                    articleInfo: res.data.data,
                    show: res.data.data.show,
                    articleDetail: res.data.data.content,
                    attentionType: res.data.data.attention,
                    collectType: res.data.data.is_collect,
                    collectTypes: res.data.data.is_collect, //初始的收藏文章状态	
                    shopCollectType: res.data.data.shop_collect,
                    shopCollectTypes: res.data.data.shop_collect,
                })
                wx.setNavigationBarTitle({
                    title: res.data.data.shopName
                })
                if (res.data.data.cover_img) {
                    var imgalist = res.data.data.content.img
                    for (var i in imgalist) {
                        imgalist[i] = 'https://image.aftdc.com/' + imgalist[i]
                    }
                    that.setData({
                        imgalist: imgalist
                    })
                }
            }
        })
        var timestamp = (Date.parse(new Date())) / 1000
        var sign = MD5Util.sign(timestamp)
        if (app.globalData.userId) {
            wx.request({
                url: 'https://www.aftdc.com/wxapp/Userarticle/newRead',
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                data: {
                    article_id: id,
                    userId: userId,
                    sign: sign,
                    timestamp: timestamp,
                    token: wx.getStorageSync('usersInfo').token,
                },
                method: "POST",
                success: function (res) {
                }
            })
        }
        var timestamp = (Date.parse(new Date())) / 1000
        var sign = MD5Util.sign(timestamp)
        wx.request({
            url: 'https://www.aftdc.com/wxapp/Userarticle/arcticle_appraises',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                article_id: id,
                page: that.data.page,
                userId: userId,
                sign: sign,
                timestamp: timestamp,
                token: wx.getStorageSync('usersInfo').token,
            },
            method: "POST",
            success: function (res) {
                that.setData({
                    lyData: res.data.data,
                    lyDatas: res.data.datas,
                    page: that.data.lyData.concat(res.data.data).length
                })
            }
        })
    },
    toView: function () {
        if (this.data.onReachBottom == true || this.data.toView == 'lyq') {
            this.setData({
                scrolltoupper: true,
                onReachBottom: false,
                toView: 'detail'
            })
        } else {
            this.setData({
                toView: 'lyq'
            })
        }
    },
    //下拉加载
    onReachBottom: function () {
        var userId = wx.getStorageSync('usersInfo').userId
        if (!userId) {
            userId = ''
        }
        if (this.data.xiala) {
            this.data.xiala = false
            var that = this
            var timestamp = (Date.parse(new Date())) / 1000
            var sign = MD5Util.sign(timestamp)
            wx.request({
                url: 'https://www.aftdc.com/wxapp/Userarticle/arcticle_appraises',
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                data: {
                    article_id: that.data.id,
                    page: that.data.page,
                    userId: userId,
                    // sign: sign,
                    // timestamp: timestamp,
                    // token: wx.getStorageSync('usersInfo').token,
                },
                method: "POST",
                success: function (res) {
                    if (res.data.res == 1) {
                        that.setData({
                            lyData: that.data.lyData.concat(res.data.data),
                            page: that.data.lyData.concat(res.data.data).length,
                            onReachBottom: true,
                            xiala: true
                        })
                        wx.getSystemInfo({
                            success: function (res) {
                                that.setData({
                                    windowHeight: res.windowHeight
                                })
                            }
                        })
                    } else {
                        that.setData({
                            onReachBottom: true
                        })
                    }
                }
            })
        }
    },
    scrolltoupper: function () {
        this.setData({
            onReachBottom: false,
            toView: null
        })
    },
    appraises_praise: function () {
        var usersInfo = wx.getStorageSync('usersInfo')
        var userId = wx.getStorageSync('usersInfo').userId
        if (!usersInfo || !usersInfo.userPhone) {//如果没登录
            wx.navigateTo({
              url: '../../../homePage/pages/author/author',
            })
            return false
        } else {
            var timestamp = (Date.parse(new Date())) / 1000
            var sign = MD5Util.sign(timestamp)

            wx.request({
                url: 'https://www.aftdc.com/wxapp/Userarticle/arcticle_appraises_praise',
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                data: {
                    article_id: that.data.id,
                    userId:wx.getStorageSync('usersInfo').userId,
                    sign: sign,
                    timestamp: timestamp,
                    token: wx.getStorageSync('usersInfo').token,
                },
                method: "POST",
                success: function (res) {

                }
            })
        }
    },
    seeReply: function (e) {
        var that = this
        wx.navigateTo({
            url: '../replyDetail/replyDetail?appraises_id=' + e.currentTarget.dataset.appraises_id + '&article_id=' + that.data.id + '&title=' + that.data.articleInfo.title
        })
    },
    write: function () {
        this.setData({
            write: false
        })
    },
    //去留言
    gotoLw: function () {
        var article_id = this.data.id
        wx.navigateTo({
            url: '../lwArticle/lwArticle?article_id=' + article_id,
        })
    },
    onUnload: function () {//退出和隐藏页面时再执行关注和取消关注动作
        //执行关注或取消关注的方法
        var attentionType = this.data.attentionType
        var touchAttention = this.data.touchAttention
        if (touchAttention) {
            if (attentionType == 1) {
                this.attention()
            } else {
                this.cancelAttention()
            }
        }
        if (this.data.collectTypes != this.data.collectType) {//收藏文章
            if (this.data.collectType == 1) {
                this.collect()
            } else {
                this.cancelCollect()
            }
        }
        if (this.data.shopCollectTypes != this.data.shopCollectType) {//收藏店铺

            if (this.data.shopCollectTypes == 1) {
                this.collectShop()
            } else {
                this.cancelCollectShop()
            }
        }
    },
    //触发了关注和取消关注的操作
    touchAttention: function () {
      console.log('触发了关注和取消关注的操作')
        var that = this
        var usersInfo = wx.getStorageSync('usersInfo')
        if (!usersInfo || !usersInfo.userPhone) {//如果没登录
            wx.navigateTo({
              url: '../../../homePage/pages/author/author?route=touchAttention',
            })
            return false
        } else {
            var hobbyTip = that.data.hobbyTip
            that.cancelAttention()
            that.setData({ touchAttention: 1 })
            var attentionType = that.data.attentionType
            if (attentionType == 1) {
                that.setData({
                    hobbyTip: true,
                    attentionType: 0,
                    hobbyTips: '已取消关注'
                })
            } else {
                that.attention()
                that.setData({
                    hobbyTip: true,
                    attentionType: 1,
                    hobbyTips: '已关注'
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
        var userId = that.data.articleInfo.userId
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
            }
        })
    },
    //取消关注
    cancelAttention: function () {
        var that = this
        var userId = that.data.articleInfo.userId
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
            }
        })
    },
    //点赞
    Praise: function (e) {
        var index = e.currentTarget.dataset.index
        var type = e.currentTarget.dataset.type
        var that = this
        var usersInfo = wx.getStorageSync('usersInfo')
        if (!usersInfo || !usersInfo.userPhone) {//如果没登录
            wx.navigateTo({
              url: '../../../homePage/pages/author/author',
            })
            return false
        } else {
            if (type == 1) {//点赞文章
                that.praiseWz()
            } else if (type == 3) {
                that.praiseMyPl(index)
            } else if (type == 2) {
                that.praisePl(index)
            }
        }
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
            wx.navigateTo({
                url: '../report/report?article_id=' + article_id+'&type=user',
            })
        }
    },
    //点赞文章
    praiseWz: function () {
        var articleInfo = this.data.articleInfo
        var that = this
        if (articleInfo.is_praise == 1) {
            wx.showToast({
                title: '已点赞',
                mask: true
            })
        } else {
            var timestamp = (Date.parse(new Date())) / 1000
            var sign = MD5Util.sign(timestamp)
            wx.request({
                url: 'https://www.aftdc.com/wxapp/Userarticle/arcticle_praise',
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                data: {
                    id: that.data.id,    //文章的id
                    userId:wx.getStorageSync('usersInfo').userId,
                    sign: sign,
                    timestamp: timestamp,
                    token: wx.getStorageSync('usersInfo').token,
                },
                method: "POST",
                success: function (res) {
                    articleInfo.is_praise = 1
                    articleInfo.praise_num += 1
                    that.setData({
                        dzan: true,
                        articleInfo: articleInfo
                    })
                    zanTime = setTimeout(function () {
                        that.setData({
                            dzan: false,
                        })
                        clearTimeout(zanTime);
                    }, 900)
                }
            })
        }
    },
    //点赞自己的评论
    praiseMyPl: function (index) {
        var lyData = this.data.lyDatas
        var that = this

        if (lyData[index].is_praise == 1) {
            wx.showToast({
                title: '已点赞',
                mask: true
            })
        } else {
            var timestamp = (Date.parse(new Date())) / 1000
            var sign = MD5Util.sign(timestamp)
            wx.request({
                url: 'https://www.aftdc.com/wxapp/Userarticle/arcticle_appraises_praise',
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                data: {
                    id: lyData[index].id,    //文章的id
                    userId:wx.getStorageSync('usersInfo').userId,
                    sign: sign,
                    timestamp: timestamp,
                    token: wx.getStorageSync('usersInfo').token,
                },
                method: "POST",
                success: function (res) {
                    lyData[index].is_praise = 1
                    lyData[index].praise_num += 1

                    that.setData({
                        dzan: true,
                        lyDatas: lyData
                    })
                    zanTime = setTimeout(function () {
                        that.setData({
                            dzan: false,
                        })
                        clearTimeout(zanTime);
                    }, 900)
                }
            })
        }
    },
    //点赞评论
    praisePl: function (index) {
        var lyData = this.data.lyData
        var that = this

        if (lyData[index].is_praise == 1) {
            wx.showToast({
                title: '已点赞',
                mask: true
            })
        } else {
            var timestamp = (Date.parse(new Date())) / 1000
            var sign = MD5Util.sign(timestamp)
            wx.request({
                url: 'https://www.aftdc.com/wxapp/Userarticle/arcticle_appraises_praise',
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                data: {
                    id: lyData[index].id,    //文章的id
                    userId:wx.getStorageSync('usersInfo').userId,
                    sign: sign,
                    timestamp: timestamp,
                    token: wx.getStorageSync('usersInfo').token,
                },
                method: "POST",
                success: function (res) {
                    lyData[index].is_praise = 1
                    lyData[index].praise_num += 1

                    that.setData({
                        dzan: true,
                        lyData: lyData
                    })
                    zanTime = setTimeout(function () {
                        that.setData({
                            dzan: false,
                        })
                        clearTimeout(zanTime);
                    }, 900)
                }
            })
        }
    },
    //进店
    gotoShop: function () {
        var shopId = this.data.articleInfo.shopId
        wx.navigateTo({
          url: '../../../homePage/pages/introduce/introduce?shopId=' + shopId,
        })
    },
    //点击收藏
    touchCollect: function () {
        var that = this
        var article = this.data.articleInfo
        var usersInfo = wx.getStorageSync('usersInfo')
        var userId = wx.getStorageSync('usersInfo').userId
        if (!usersInfo || !usersInfo.userPhone) {//如果没登录
            wx.navigateTo({
              url: '../../../homePage/pages/author/author',
            })
            return false
        } else {
            var collectType = that.data.collectType
            if (collectType == 1) {
                that.setData({
                    collectType: 0
                })
                wx.showToast({
                    title: '取消收藏',
                })
            } else {
                that.setData({
                    collectType: 1
                })
                wx.showToast({
                    title: '收藏成功',
                })
            }
        }
    },
    //收藏文章
    collect: function () {
        var article = this.data.articleInfo
        var userId = wx.getStorageSync('usersInfo').userId
        var timestamp = (Date.parse(new Date())) / 1000
        var sign = MD5Util.sign(timestamp)
        wx.request({
            url: 'https://www.aftdc.com/wxapp/Userarticle/article_collect',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                article_id: article.id,    //文章的id
                business_id: article.business_id,
                userId: userId,
                articleUserId: article.userId,
                is_collect: 1,
                sign: sign,
                timestamp: timestamp,
                token: wx.getStorageSync('usersInfo').token,
            },
            method: "POST",
            success: function (res) {

            }
        })
    },
    //取消收藏
    cancelCollect: function () {
        var article = this.data.articleInfo
        var userId = wx.getStorageSync('usersInfo').userId
        var timestamp = (Date.parse(new Date())) / 1000
        var sign = MD5Util.sign(timestamp)
        wx.request({
            url: 'https://www.aftdc.com/wxapp/Userarticle/article_collect',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                article_id: article.id,    //文章的id
                business_id: article.business_id,
                userId: userId,
                shopId: article.shopId,
                is_collect: 0,
                sign: sign,
                timestamp: timestamp,
                token: wx.getStorageSync('usersInfo').token,
            },
            method: "POST",
            success: function (res) {

            }
        })
    },
    formatten: function (e) {
        var that = this;
        var formId = e.detail.formId;
        var userId = that.data.articleInfo.userId;
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
                        console.log(res)
                    }
                })
            }
            that.touchAttention();
        }
    },
    //formId
    formnextBut: function (e) {
        var that = this;
        var formId = e.detail.formId;
        var shopId = that.data.articleInfo.shopId;
        var shopCollectTypes = that.data.shopCollectTypes
        var usersInfo = wx.getStorageSync('usersInfo')
        var userId = wx.getStorageSync('usersInfo').userId
        if (!usersInfo || !usersInfo.userPhone) {//如果没登录
            wx.navigateTo({
              url: '../../../homePage/pages/author/author?route=formnextBut',
            })
            return false
        } else {
            var userId = wx.getStorageSync('usersInfo').userId;
            var timestamp = (Date.parse(new Date())) / 1000
            var sign = MD5Util.sign(timestamp)
            if (shopCollectTypes == 0) {
                wx.request({
                    url: 'https://www.aftdc.com/wxapp/Index/formId',
                    method: 'post',
                    header: { "Content-Type": "application/x-www-form-urlencoded" },
                    data: {
                        timestamp: timestamp,
                        token: wx.getStorageSync('usersInfo').token,
                        sign: sign,
                        formId: formId,
                        shopId: shopId,
                    },
                    success: function (res) {
                        
                    }
                })
            }
            that.touchCollectShop();
        }
    },
    //点击收藏
    touchCollectShop: function () {
        var that = this
        var article = this.data.articleInfo
        var usersInfo = wx.getStorageSync('usersInfo')
        var userId = wx.getStorageSync('usersInfo').userId
        if (!usersInfo || !usersInfo.userPhone) {//如果没登录
            wx.navigateTo({
              url: '../../../homePage/pages/author/author',
            })
            return false
        } else {
            var shopCollectTypes = that.data.shopCollectTypes
            if (shopCollectTypes == 1) {
                that.setData({
                    shopCollectTypes: 0
                })
                wx.showToast({
                    title: '取消收藏',
                })
            } else {
                that.setData({
                    shopCollectTypes: 1
                })
                wx.showToast({
                    title: '收藏成功',
                })
            }
        }
    },

    collectShop: function () {

        var userId = wx.getStorageSync('usersInfo').userId
        var article = this.data.articleInfo
        var timestamp = (Date.parse(new Date())) / 1000
        var sign = MD5Util.sign(timestamp)
        wx.request({
            url: 'https://www.aftdc.com/wxapp/Index/collect',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                userId: userId,
                shopId: article.shopId,
                sign: sign,
                timestamp: timestamp,
                token: wx.getStorageSync('usersInfo').token,
            },
            method: "POST",
            success: function (res) {

            }
        })
    }
    ,
    cancelCollectShop: function () {

        var userId = wx.getStorageSync('usersInfo').userId
        var article = this.data.articleInfo
        var timestamp = (Date.parse(new Date())) / 1000
        var sign = MD5Util.sign(timestamp)
        wx.request({
            url: 'https://www.aftdc.com/wxapp/Mine/delete_collect',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                userId: userId,
                shopId: article.shopId,
                sign: sign,
                timestamp: timestamp,
                token: wx.getStorageSync('usersInfo').token,
            },
            method: "POST",
            success: function (res) {

            }
        })
    },
    //查看图片
    seeImg: function (e) {
        var imgalist = this.data.imgalist
        var index = e.currentTarget.dataset.index
        wx.previewImage({
            current: imgalist[index], // 当前显示图片的http链接   
            urls: imgalist // 需要预览的图片http链接列表   
        })
    },
    comeOn: function () {
        var articleInfo = {}
        var article_id = this.data.articleInfo.id
        wx.navigateTo({
            url: '../helpMe/helpMe?article_id=' + article_id,
        })
    },
    lwTip: function () {
        wx.navigateTo({
            url: '../lwTip/lwTip',
        })
    },
    //留言
    getTest: function (e) {
        this.setData({
            content: e.detail.value
        })
    },
    send: function (e) {
        var formId = e.detail.formId;
        var shopId = this.data.articleInfo.shopId

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
            url: 'https://www.aftdc.com/wxapp/Userarticle/arcticle_appraises_deliver',
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
            },
            method: "POST",
            success: function (res) {
                if (res.data.res == 1) {
                    res.data.data.userName = wx.getStorageSync('usersInfo').userName
                    res.data.data.userPhoto = wx.getStorageSync('usersInfo').userPhoto
                    wx.hideLoading()
                    res.data.data.is_praise = 0
                    that.data.lyDatas.unshift(res.data.data)
                    that.data.lyData.unshift(res.data.data)
                    wx.showToast({
                        title: '已发送',
                    })
                    that.setData({   
                        lyDatas: that.data.lyDatas,
                        lyData: that.data.lyData,
                        content: ''
                    })
                } else {
                    wx.hideLoading()
                    wx.showModal({
                        title: '提示',
                        content: res.data.info,
                        success:function(res){
                          if (res.confirm) {
                            wx.request({
                              url: 'https://www.aftdc.com/wxapp/Article/certain',
                              method:'post',
                              data:{
                                sign: sign,
                                timestamp: timestamp,
                                token: wx.getStorageSync('usersInfo').token,
                                id: that.data.id,    //文章的id
                                userId:wx.getStorageSync('usersInfo').userId,
                                content: that.data.content,
                                shopId: shopId,
                              },
                              success:function(res){
                                if(res.data.res == 1){
                                  res.data.data.userName = wx.getStorageSync('usersInfo').userName
                                  res.data.data.userPhoto = wx.getStorageSync('usersInfo').userPhoto
                                  that.data.lyDatas.unshift(res.data.data)
                                 
                                  wx.showToast({
                                    title: '已发送',
                                  })
                                  that.setData({
                                    lyDatas: that.data.lyDatas,
                                    content: '',
                                    attentionType: 1,
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
    del: function (e) {
        var that = this
        var timestamp = (Date.parse(new Date())) / 1000
        var sign = MD5Util.sign(timestamp)
        var index = e.currentTarget.dataset.index
        wx.request({
            url: 'https://www.aftdc.com/wxapp/Userarticle/del_appraises',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                sign: sign,
                timestamp: timestamp,
                token: wx.getStorageSync('usersInfo').token,
                id: e.currentTarget.dataset.appraises_id,    //评论的id
            },
            method: "POST",
            success: function (res) {
                wx.showToast({
                    title: '删除成功',
                })
                that.data.lyDatas.splice(index, 1);
                that.setData({ lyDatas: that.data.lyDatas })
            }
        })
    },
    focus:function(){
        this.setData({
            focus: !this.data.focus
        })
    },
    direct:function(){
        wx.switchTab({
          url: '/page/tabBar/direct/index',
        })
    },
    jump:function(e){
        var userId = e.target.dataset.userid
        var userPhoto = e.target.dataset.userphoto
        var userName = e.target.dataset.username
        wx.navigateTo({
          url: '../../../personal/pages/dynamic/dynamic?userId=' + userId + '&userPhoto=' + userPhoto + '&userName=' + userName,
        })
    }
})
