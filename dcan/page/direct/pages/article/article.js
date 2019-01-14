var app = getApp()
var zanTime
var MD5Util = require('../../../../utils/md5.js');
var util = require('../../../../utils/util.js');
const innerAudioContext = wx.createInnerAudioContext();
Page({

    data: {
        load: false,
        pullUp: true,
        toView: 'detail',
        page: 0, //分页
        articleDetail: [],
        articleInfo: {},
        lyData: [],
        xiala: true,
        onReachBottom: true,
        src: '',
        longitude: "",
        latitude: "",
        content: '',
        id: '',
        focus: false,
        play: false,
        isLoad: false,
        vote: '',
        template: '',
        voteClickIndex: [], //投票的变量
        voteTicket: [{
            value: '公共卫生',
            percentageVotes: '54.45%',
            ballot: 87,
            voteType: 0
        }, {
            value: '啥都会卡死',
            percentageVotes: '45.55%',
            ballot: 72,
            voteType: 1
        }], //percentageVotes为当前选项票数占总票数的百分比，ballot为当前选项票数,voteType为1为已为该选项投票
        voteSure: 0, //是否投票了
        isZan: false,
        videoStop:false,
        firstClick: true
    },
    filters: {
        toFixedTwo(value) {
            // 截取当前数据到小数点后两位
            let realVal = Number(value).toFixed(2)
            // num.toFixed(2)获取的是字符串
            return Number(realVal)
        }
    },
    //播放
    plays: function() {
        if (this.data.play) {
            this.stop()
        } else {
            this.play()
        }
    },
    //播放
    play: function() {
        innerAudioContext.play()
        this.setData({
            play: true,
            videoStop: true
        })
        this.videoContext.pause()
    },
    //暂停
    stop: function() {
        innerAudioContext.pause()
        this.setData({
            play: false,
            videoStop:false
        })
    },

    //视频暂停
    onVideoPause:function(){
      this.setData({
        videoStop: true
      })
    },
    //视频结束
    onVideoEnd: function () {
      this.setData({
        videoStop: true
      })
    },
    onHide: function() {
        this.stop()
        innerAudioContext.destroy()
    },
    back: function() {
        wx.navigateBack()
    },

    onShareAppMessage: function(res) {
        var articleId = this.data.articleInfo.id
        var title = this.data.articleInfo.title
        var shopId = this.data.articleInfo.shopId
        var timestamp = (Date.parse(new Date())) / 1000
        var sign = MD5Util.sign(timestamp)
        var token = wx.getStorageSync('usersInfo').token
        return {
            title: this.data.articleInfo.title,
            path: '/page/direct/pages/article/article?article_id=' + this.data.articleInfo.id,
            success: function(res) {
                // 转发成功
                wx.request({
                    url: 'https://www.aftdc.com/wxapp/Article/articleShare',
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    data: {
                        timestamp: timestamp,
                        sign: sign,
                        token: token,
                        type: 1,
                        articleId: articleId,
                        shopId: shopId,
                        title: title
                    },
                    method: "POST",
                    success: function(res) {
                        if (res.data.res == 1) {
                            wx.showToast({
                                title: '转发成功',
                                mask: true
                            })
                        }
                    }
                })
            }
        }
    },
    onShow:function(){
        // this.play();
     
    },

    onLoad: function(options) {
        var userId = wx.getStorageSync('usersInfo').userId
        if (!userId) userId = ''

        var that = this;
        var latitude = that.data.latitude;
        var longitude = that.data.longitude;
        if (options.article_id) var id = options.article_id;
        if (options.is_user) var is_user = options.is_user;
        else var is_user = 0;
        if (is_user == wx.getStorageSync('usersInfo').userId) var is_me = 1;
        else is_me = 0;
        this.setData({
            'id': id,
            is_user: is_user,
            is_me: is_me
        });
        wx.getSystemInfo({
            success: function(res) {
                that.setData({
                    windowHeight: res.windowHeight + 40
                })
            }
        })
        this.setData({userId:userId})
    },

    onReady: function() {

        var that = this
        wx.getLocation({
            type: 'gcj02',
            success: function(res) {
                var latitude = res.latitude
                var longitude = res.longitude
                that.article(latitude, longitude)
            },
            fail: function(res) {
                that.article('', '')
            },
        })
     
    },
    //文章详细
    article: function(latitude, longitude) {
        var that = this
        var id = that.data.id
        var userId = wx.getStorageSync('usersInfo').userId
        if (!userId) userId = ''
        var timestamp = (Date.parse(new Date())) / 1000
        var sign = MD5Util.sign(timestamp)
        wx.request({
            url: 'https://www.aftdc.com/wxapp/Article/newDetail',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                id: id,
                userId: userId,
                is_user: that.data.is_user,
                longitude: longitude,
                latitude: latitude,
            },
            method: "POST",
            success: function(res) {
              that.setData({
                  isLoad: true,
                  articleInfo: res.data.data,
                  articleDetail: res.data.data.content,
                  attentionType: res.data.data.attention,
                  collectType: res.data.data.is_collect,
                  collectTypes: res.data.data.is_collect, //初始的收藏文章状态	
                  shopCollectType: res.data.data.shop_collect,
                  shopCollectTypes: res.data.data.shop_collect,
                  template: res.data.data.template,
                  shopId: res.data.data.shopId
              })
              wx.setNavigationBarTitle({
                // title: res.data.data.shopName
                  title: '餐头条'
              })
              if (res.data.data.vote) {
                  var vote = res.data.data.vote
                  for (var i in vote.inputList) {
                      vote.inputList[i].checked = false
                  }
                  if (res.data.data.userVote) {
                      var voteClickIndex = res.data.data.userVote
                      var inputList = vote.inputList
                      for (var i = 0; i < voteClickIndex.length; i++) {
                          inputList[voteClickIndex[i]].checked = true
                      }
                      for (var i in inputList) {
                          inputList[i].percentageVotes = (inputList[i].voteNum / res.data.data.voteNum * 100).toFixed(0) + '%'
                      }
                      that.setData({
                          vote: vote,
                          inputList: inputList,
                          voteSure: 1
                      })
                  } else {
                      that.setData({
                          vote: vote
                      })
                  }
              }
              if (res.data.data.music && !res.data.data.video) {
                  innerAudioContext.src = 'https://image.aftdc.com/' + res.data.data.music.musicPath
                if (!res.data.data.video){
                  innerAudioContext.autoplay = true
                  that.setData({
                    play: true
                  })
                }
              }
              if (res.data.data.video) {
                that.videoContext = wx.createVideoContext('myVideo')
                var template = res.data.data.template
                template.fontColor = '#666'
                template.fontColorTime = '#999'
                template.fontColorUname = '#53beb7'
                template.themeColor = '#fff'
                template.imgUrl = ''
                that.setData({
                  template: template
                })
              }
              that.setData({
                animationLoading: true,//加载图
              })
            }
        })
        var timestamp = (Date.parse(new Date())) / 1000
        var sign = MD5Util.sign(timestamp)
        if (userId) {
            wx.request({
                url: 'https://www.aftdc.com/wxapp/Article/newRead',
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                data: {
                    article_id: id,
                    userId: userId,
                    sign: sign,
                    is_user: that.data.is_user,
                    timestamp: timestamp,
                    token: wx.getStorageSync('usersInfo').token,
                },
                method: "POST",
                success: function(res) {}
            })
        }


        this.getUserTask(id, userId)
    },
    //获取评论留言
    getUserTask: function(id, userId) {
        var that = this
        var timestamp = (Date.parse(new Date())) / 1000
        var sign = MD5Util.sign(timestamp)
        wx.request({
            url: 'https://www.aftdc.com/wxapp/Article/arcticle_appraises',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                article_id: id,
                //page: that.data.page,
                userId: userId,
                //sign: sign,
                //timestamp: timestamp,
                token: wx.getStorageSync('usersInfo').token,
            },
            method: "POST",
            success: function(res) {
              if(res.data.res === 1){
                that.setData({
                  lyData: res.data.data,
                  lyDatas: res.data.datas,
                  page: res.data.page,
                  aaa: res.data.aaa
                })
              }else {
                that.setData({
                  pullUp: false,
                  onReachBottom: false
                })
              }
                
            }
        })
    },
    toView: function() {
        // if (this.data.onReachBottom == true || this.data.toView == 'lyq') {
        if (this.data.toView == 'lyq') {
            this.setData({
                scrolltoupper: true,
                // onReachBottom: false,
                toView: 'detail'
            })
        } else {
            this.setData({
                toView: 'lyq'
            })
        }
    },
    // 投票
    voteClick: function(e) {
        var that = this
        var index = e.currentTarget.dataset.index
        var vote = that.data.vote
        var voteClickIndex = that.data.voteClickIndex
        if (vote.type === 1) { // 单选
            for (let i = 0, len = vote.inputList.length; i < len; i++) {
                vote.inputList[i].checked = false

            }
            if (voteClickIndex[0] !== index) {
                vote.inputList[index].checked = true
                voteClickIndex[0] = index
            } else {
                voteClickIndex = []
            }
        } else if (vote.type === 0) { // 多选,无限制
            if (vote.inputList[index].checked !== true) {
                voteClickIndex.push(index)

            } else {
                for (var i = 0; i < voteClickIndex.length; i++) {
                    if (voteClickIndex[i] == index) {
                        voteClickIndex.splice(i, 1)
                    }
                }
            }
            vote.inputList[index].checked = !vote.inputList[index].checked

        } else { // 多选,可选n项
            if (voteClickIndex.length < vote.type || vote.inputList[index].checked === true) {
                if (vote.inputList[index].checked !== true) {
                    voteClickIndex.push(index)

                } else {
                    for (var i = 0; i < voteClickIndex.length; i++) {
                        if (voteClickIndex[i] == index) {
                            voteClickIndex.splice(i, 1)
                        }
                    }
                }
                vote.inputList[index].checked = !vote.inputList[index].checked
            }
        }

        that.setData({
            vote: vote,
            voteClickIndex: voteClickIndex
        })
    },
    //确认投票
    sureVote() {
        var usersInfo = wx.getStorageSync('usersInfo')
        if (!usersInfo) { //如果没登录
            wx.navigateTo({
              url: '../../../homePage/pages/author/author',
            })
            return false
        }
        var that = this
        var articleId = this.data.articleInfo.id
        var voteClickIndex = that.data.voteClickIndex //已投票的index 例：[2]
        voteClickIndex = JSON.stringify(voteClickIndex)
        var timestamp = (Date.parse(new Date())) / 1000
        var sign = MD5Util.sign(timestamp)
        wx.request({
            url: 'https://www.aftdc.com/wxapp/Article/vote',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                id: articleId,
                voteList: voteClickIndex,
                sign: sign,
                timestamp: timestamp,
                token: wx.getStorageSync('usersInfo').token,
            },
            method: "POST",
            success: function(res) {
                if (res.data.res == 1) {
                    var voteClickIndex = that.data.voteClickIndex
                    var inputList = that.data.vote.inputList
                    for (var i = 0; i < voteClickIndex.length; i++) {
                        inputList[voteClickIndex[i]].voteNum += 1
                    }
                    for (var i in inputList) {
                        inputList[i].percentageVotes = (inputList[i].voteNum / res.data.voteNum * 100).toFixed(0) + '%'
                    }
                    that.setData({
                        inputList: inputList,
                        voteSure: 1
                    })
                }
            }
        })

    },
    //上拉加载
    onReachBottom: function () {
      var userId = wx.getStorageSync('usersInfo').userId
      if (!userId) {
        userId = ''
      }
      if (this.data.onReachBottom) {
        this.data.onReachBottom = false
        var that = this
        that.setData({load:true})
        var timestamp = (Date.parse(new Date())) / 1000
        var sign = MD5Util.sign(timestamp)
        wx.request({
          url: 'https://www.aftdc.com/wxapp/Article/arcticle_appraises',
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
            console.log(that.data.page)
            setTimeout(() => {
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
                  onReachBottom: false
                })
              }
              that.setData({ load: false })
            },1000)
            
          }
        })
      }
    },
    scrolltoupper: function() {
        this.setData({
            // onReachBottom: false,
            toView: null
        })
    },
    // appraises_praise: function () {
    //   var usersInfo = wx.getStorageSync('usersInfo')
    //   var userId = wx.getStorageSync('usersInfo').userId
    //   if (!usersInfo || !usersInfo.userPhone) {//如果没登录
    //     wx.navigateTo({
    //       url: '/pages/author/author',
    //     })
    //     return false
    //   } else {
    //     var timestamp = (Date.parse(new Date())) / 1000
    //     var sign = MD5Util.sign(timestamp)

    //     wx.request({
    //       url: 'https://www.aftdc.com/wxapp/Article/arcticle_appraises_praise',
    //       header: {
    //         'content-type': 'application/x-www-form-urlencoded'
    //       },
    //       data: {
    //         article_id: that.data.id,
    //         userId:wx.getStorageSync('usersInfo').userId,
    //         userId: that.data.articleInfo.shopId,
    //         sign: sign,
    //         timestamp: timestamp,
    //         token: wx.getStorageSync('usersInfo').token,
    //       },
    //       method: "POST",
    //       success: function (res) {

    //       }
    //     })
    //   }
    // },
    seeReply: function(e) {
        var that = this
        wx.navigateTo({
            url: '../replyDetail/replyDetail?appraises_id=' + e.currentTarget.dataset.appraises_id + '&article_id=' + that.data.id + '&title=' + that.data.articleInfo.title
        })
    },
    write: function() {
        this.setData({
            write: false
        })
    },
    //去留言
    gotoLw: function() {
        var article_id = this.data.id
        wx.navigateTo({
            url: '../lwArticle/lwArticle?article_id=' + article_id,
        })
    },
    onUnload: function() { //退出和隐藏页面时再执行关注和取消关注动作
        //执行关注或取消关注的方法
        var attentionType = this.data.attentionType
        // var touchAttention = this.data.touchAttention
        // if (touchAttention) {
        //     if (attentionType == 1) {
        //         this.attention()
        //     } else {
        //         this.cancelAttention()
        //     }
        // }
        // if (this.data.collectTypes != this.data.collectType) { //收藏文章
        //     if (this.data.collectType == 1) {
        //         this.collect()
        //     } else {
        //         this.cancelCollect()
        //     }
        // }
        if (this.data.shopCollectTypes != this.data.shopCollectType) { //收藏店铺

            if (this.data.shopCollectTypes == 1) {
                this.collectShop()
            } else {
                this.cancelCollectShop()
            }
        }
        innerAudioContext.stop()
        // innerAudioContext.destroy()
    },
    //触发了关注和取消关注的操作
    touchAttention: function() {
        var that = this
        var usersInfo = wx.getStorageSync('usersInfo')
        if (!usersInfo || !usersInfo.userPhone) { //如果没登录
            wx.navigateTo({
              url: '../../../homePage/pages/author/author?route=touchAttention',
            })
            return false
        } else {
            var hobbyTip = that.data.hobbyTip
            var attentionType = that.data.attentionType
            if (attentionType == 1) {
              that.cancelAttention()
                
            } else {
                that.attention()
                
            }
            if (hobbyTip) {
                return false
            } else {
                var times = setTimeout(function() {
                    that.setData({
                        hobbyTip: false,
                        timeout: true
                    })
                }, 5000)
            }
        }
    },
    //关注
    attention: function() {
        var that = this
        var shopId = that.data.articleInfo.shopId
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
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function(res) {
              if(res.data.res === 1) {
                that.setData({
                  hobbyTip: true,
                  attentionType: 1,
                  hobbyTips: '已关注'
                })
              }
            }
        })
    },
    //取消关注
    cancelAttention: function() {
        var that = this
        var shopId = that.data.articleInfo.shopId
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
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function(res) {
              if(res.data.res === 1) {
                that.setData({
                  hobbyTip: true,
                  attentionType: 0,
                  hobbyTips: '已取消关注'
                })
              }
            }
        })
    },
    //点赞
    Praise: function(e) {
        var index = e.currentTarget.dataset.index
        var type = e.currentTarget.dataset.type
        var that = this
        var usersInfo = wx.getStorageSync('usersInfo')
        if (!usersInfo || !usersInfo.userPhone) { //如果没登录
            wx.navigateTo({
              url: '../../../homePage/pages/author/author',
            })
            return false
        } else {
            if (type == 1) { //点赞文章
                that.praiseWz()
            } else {
                that.praisePl(index)
            }
        }
    },
    report: function(e) {
        var article_id = e.currentTarget.dataset.id
        var usersInfo = wx.getStorageSync('usersInfo')
        var userId = wx.getStorageSync('usersInfo').userId
        if (!usersInfo || !usersInfo.userPhone) { //如果没登录
            wx.navigateTo({
              url: '../../../homePage/pages/author/author',
            })
            return false
        } else {
            wx.navigateTo({
                url: '../report/report?article_id=' + article_id,
            })
        }
    },
    //点赞文章
    praiseWz: function() {
        var articleInfo = this.data.articleInfo
        var that = this
        if (this.data.isZan)
            return false;
        this.data.isZan = true
        
        // if (articleInfo.is_praise == 1) {
        //   wx.showToast({
        //     title: '已点赞',
        //     mask: true
        //   })
        // } else {
        
        var timestamp = (Date.parse(new Date())) / 1000
        var sign = MD5Util.sign(timestamp)
        wx.request({
            url: 'https://www.aftdc.com/wxapp/Article/arcticle_praise',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                id: that.data.id, //文章的id
                userId:wx.getStorageSync('usersInfo').userId,
                sign: sign,
                timestamp: timestamp,
                token: wx.getStorageSync('usersInfo').token,
            },
            method: "POST",
            success: function(res) {
                that.data.isZan = false
                if (res.data.res == 1) {
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
                } else if (res.data.res == 2){
                    articleInfo.is_praise = 0
                    articleInfo.praise_num -= 1
                    that.setData({
                        articleInfo: articleInfo
                    })
                }
            }
        })
        // }
    },
    //点赞文章

    //点赞自己的评论
    // praiseMyPl: function(index) {
    //     var lyData = this.data.lyDatas
    //     var that = this

    //     if (lyData[index].is_praise == 1) {
    //         wx.showToast({
    //             title: '已点赞',
    //             mask: true
    //         })
    //     } else {
    //         var timestamp = (Date.parse(new Date())) / 1000
    //         var sign = MD5Util.sign(timestamp)
    //         wx.request({
    //             url: 'https://www.aftdc.com/wxapp/Article/arcticle_appraises_praise',
    //             header: {
    //                 'content-type': 'application/x-www-form-urlencoded'
    //             },
    //             data: {
    //                 id: lyData[index].id, //文章的id
    //                 userId:wx.getStorageSync('usersInfo').userId,
    //                 sign: sign,
    //                 timestamp: timestamp,
    //                 token: wx.getStorageSync('usersInfo').token,
    //             },
    //             method: "POST",
    //             success: function(res) {
    //               if(res.data.res === 1) {
    //                 lyData[index].is_praise = 1
    //                 lyData[index].praise_num += 1

    //                 that.setData({
    //                   dzan: true,
    //                   lyDatas: lyData
    //                 })
    //                 zanTime = setTimeout(function () {
    //                   that.setData({
    //                     dzan: false,
    //                   })
    //                   clearTimeout(zanTime);
    //                 }, 900)
    //               }
    //             }
    //         })
    //     }
    // },
    //点赞评论
  praisePl: function (index) {
        var that = this
        var lyData = this.data.lyData

        // if (lyData[index].is_praise == 1) {

        //     that.setData({ firstClick: false })
        //     var timestamp = (Date.parse(new Date())) / 1000
        //     var sign = MD5Util.sign(timestamp)
        //     wx.request({
        //       url: 'https://www.aftdc.com/wxapp/Article/arcticle_appraises_praise',
        //       header: {
        //         'content-type': 'application/x-www-form-urlencoded'
        //       },
        //       data: {
        //         id: lyData[index].id,
        //         userId: wx.getStorageSync('usersInfo').userId,
        //         sign: sign,
        //         timestamp: timestamp,
        //         token: wx.getStorageSync('usersInfo').token,
        //       },
        //       method: "POST",
        //       success: function (res) {
        //         if (res.data.res === 1) {
        //           lyData[index].is_praise = 0
        //           lyData[index].praise_num -= 1
        //           that.setData({
        //             lyData: lyData
        //           }) 
        //         }
        //         that.setData({ firstClick: true })
        //       }
        //     })

        //     wx.showToast({
        //         title: '已点赞',
        //         mask: true
        //     })
        // } else {

            that.setData({ firstClick: false })
            var timestamp = (Date.parse(new Date())) / 1000
            var sign = MD5Util.sign(timestamp)
            wx.request({
                url: 'https://www.aftdc.com/wxapp/Article/arcticle_appraises_praise',
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                data: {
                    is_praise: lyData[index].is_praise,
                    id: lyData[index].id, //文章的id
                    userId:wx.getStorageSync('usersInfo').userId,
                    sign: sign,
                    timestamp: timestamp,
                    token: wx.getStorageSync('usersInfo').token,
                },
                method: "POST",
                success: function(res) {
                  if (lyData[index].is_praise == 1) {
                    if (res.data.res === 1) {
                      lyData[index].is_praise = 0
                      lyData[index].praise_num -= 1
                      that.setData({
                        lyData: lyData
                      }) 
                    }
                  }else {
                    if (res.data.res === 1) {
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
                    } else if (res.data.res === 0) {

                    }
                  }



                  
                  that.setData({ firstClick: true })
                }
            })
        // }
    },
    //进店
    gotoShop: function() {
        var shopId = this.data.articleInfo.shopId
        wx.navigateTo({
          url: '../../../homePage/pages/introduce/introduce?shopId=' + shopId,
        })
    },
    //点击收藏
    touchCollect: function() {
        var that = this
        var article = this.data.articleInfo
        var usersInfo = wx.getStorageSync('usersInfo')
        var userId = wx.getStorageSync('usersInfo').userId
        if (!usersInfo || !usersInfo.userPhone) { //如果没登录
            wx.navigateTo({
              url: '../../../homePage/pages/author/author?route=touchCollect',
            })
            return false
        } else {
           
            if (that.data.collectType == 1) {
              that.cancelCollect()
            } else {
              that.collect()
            }
        }
    },
    //收藏文章
    collect: function() {
      var that=this
        var article = this.data.articleInfo
        var userId = wx.getStorageSync('usersInfo').userId
        var timestamp = (Date.parse(new Date())) / 1000
        var sign = MD5Util.sign(timestamp)
        wx.request({
            url: 'https://www.aftdc.com/wxapp/Article/article_collect',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                article_id: article.id, //文章的id
                business_id: article.business_id,
                userId: userId,
                shopId: article.shopId,
                is_collect: 1,
                sign: sign,
                timestamp: timestamp,
                token: wx.getStorageSync('usersInfo').token,
            },
            method: "POST",
            success: function(res) {
              if(res.data.res==1){
                that.setData({
                  collectType:1,
                  hobbyTip: true,
                  attentionType: 1,
                  hobbyTips: res.data.info
                })
                setTimeout(function () {
                  that.setData({
                    hobbyTip: false,
                  })
                }, 2000)
              }
            }
        })
    },
    //取消收藏
    cancelCollect: function() {
      var that=this
        var article = this.data.articleInfo
        var userId = wx.getStorageSync('usersInfo').userId
        var timestamp = (Date.parse(new Date())) / 1000
        var sign = MD5Util.sign(timestamp)
        wx.request({
            url: 'https://www.aftdc.com/wxapp/Article/article_collect',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                article_id: article.id, //文章的id
                business_id: article.business_id,
                userId: userId,
                shopId: article.shopId,
                is_collect: 0,
                sign: sign,
                timestamp: timestamp,
                token: wx.getStorageSync('usersInfo').token,
            },
            method: "POST",
            success: function(res) {
              if (res.data.res == 1) {
                that.setData({
                  collectType: 0,
                  hobbyTip: true,
                  attentionType: 1,
                  hobbyTips: res.data.info
                })
                setTimeout(function () {
                  that.setData({
                    hobbyTip: false,
                  })
                }, 2000)
              }
            }
        })
    },
    formatten: function(e) {
        var that = this;
        var formId = e.detail.formId;
        var shopId = that.data.articleInfo.shopId;
        var attentionType = that.data.attentionType
        var usersInfo = wx.getStorageSync('usersInfo')
        if (!usersInfo || !usersInfo.userPhone) { //如果没登录
            wx.navigateTo({
              url: '../../../homePage/pages/author/author?route=formatten',
            })
            return false
        } else {
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
                        shopId: shopId,
                    },
                    success: function(res) {}
                })
            }
            that.touchAttention();
        }
    },
    //formId
    formnextBut: function(e) {
        var that = this;
        var formId = e.detail.formId;
        var shopId = that.data.articleInfo.shopId;
        var shopCollectTypes = that.data.shopCollectTypes
        var usersInfo = wx.getStorageSync('usersInfo')
        var userId = wx.getStorageSync('usersInfo').userId
        if (!usersInfo || !usersInfo.userPhone) { //如果没登录
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
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    data: {
                        timestamp: timestamp,
                        token: wx.getStorageSync('usersInfo').token,
                        sign: sign,
                        formId: formId,
                        shopId: shopId,
                    },
                    success: function(res) {

                    }
                })
            }
            that.touchCollectShop();
        }
    },
    //点击收藏
    touchCollectShop: function() {
        var that = this
        var article = this.data.articleInfo
        var usersInfo = wx.getStorageSync('usersInfo')
        var userId = wx.getStorageSync('usersInfo').userId
        if (!usersInfo || !usersInfo.userPhone) { //如果没登录
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

    collectShop: function() {

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
            success: function(res) {

            }
        })
    },
    cancelCollectShop: function() {

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
            success: function(res) {

            }
        })
    },
    //查看图片
    // seeImg: function (e) {
    //     var imgalist = this.data.imgalist
    //     var index = e.currentTarget.dataset.index
    //     wx.previewImage({
    //         current: imgalist[index], // 当前显示图片的http链接   
    //         urls: imgalist // 需要预览的图片http链接列表   
    //     })
    // },
  comeOn: util.throttle(function () {
        var articleInfo = {}
        var article_id = this.data.articleInfo.id
        wx.navigateTo({
            url: '../helpMe/helpMe?article_id=' + article_id,
        })
    }),
    lwTip: function() {
        wx.navigateTo({
            url: '../lwTip/lwTip',
        })
    },
    //留言
    getTest: function(e) {
        this.setData({
            content: e.detail.value
        })
    },
    send: function(e) {
        var formId = e.detail.formId;
        if (this.functionType == 'send') {
            this.userSend(formId)
        } else {
            this.userReplay(formId)
        }
    },

    //留言或评论
    userSend: function(formId) {

        var shopId = this.data.articleInfo.shopId
        var commentOrleaveWord = this.data.articleInfo.commentOrleaveWord
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
                id: that.data.id, //文章的id
                userId:wx.getStorageSync('usersInfo').userId,
                content: that.data.content,
                shopId: shopId,
                formId: formId,
                commentOrleaveWord: commentOrleaveWord
            },
            method: "POST",
            success: function(res) {
                wx.hideLoading()
                if (res.data.res == 1) {
                    res.data.data.userName = wx.getStorageSync('usersInfo').userName
                    res.data.data.userPhoto = wx.getStorageSync('usersInfo').userPhoto
                    res.data.data.is_praise = 0
                    that.data.lyDatas.unshift(res.data.data)
                    if (commentOrleaveWord === 1) {
                        that.data.lyData.unshift(res.data.data)
                        that.setData({
                            lyData: that.data.lyData,
                            content: ''
                        })
                    }
                    wx.showToast({
                        title: '已发送',
                    })
                    that.setData({
                        lyDatas: that.data.lyDatas,
                        content: ''
                    })
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
                        success: function(res) {
                            if (res.confirm) {
                                wx.request({
                                    url: 'https://www.aftdc.com/wxapp/Article/certain',
                                    method: 'post',
                                    data: {
                                        sign: sign,
                                        timestamp: timestamp,
                                        token: wx.getStorageSync('usersInfo').token,
                                        id: that.data.id, //文章的id
                                        userId:wx.getStorageSync('usersInfo').userId,
                                        content: that.data.content,
                                        shopId: shopId,
                                        commentOrleaveWord: commentOrleaveWord
                                    },
                                    success: function(res) {
                                        if (res.data.res == 1) {
                                            res.data.data.userName = wx.getStorageSync('usersInfo').userName
                                            res.data.data.userPhoto = wx.getStorageSync('usersInfo').userPhoto
                                            that.data.lyDatas.unshift(res.data.data)
                                            if (commentOrleaveWord === 1) {
                                                that.data.lyData.unshift(res.data.data)
                                                that.setData({
                                                    lyData: that.data.lyData,
                                                    content: ''
                                                })
                                            }
                                            wx.showToast({
                                                title: '已发送',
                                            })
                                            that.setData({
                                                lyDatas: that.data.lyDatas,
                                                content: '',
                                                attentionType: 1,
                                            })
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
    //用户回复
    userReplay: function(formId) {
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
            url: 'https://www.aftdc.com/wxapp/Article/arcticle_reply',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                sign: sign,
                timestamp: timestamp,
                token: wx.getStorageSync('usersInfo').token,
                id: that.data.id, //文章的id
                content: that.data.content,
                shopId: shopId,
                formId: formId
            },
            method: "POST",
            success: function(res) {
                wx.hideLoading()
                if (res.data.res == 1) {
                    var id = that.data.id
                    var userId = wx.getStorageSync('usersInfo').userId
                    if (!userId) userId = ''
                    that.getUserTask(id, userId)
                    wx.showToast({
                        title: '已发送',
                    })
                }
            }
        })
    },
    //
    del: function(e) {
        var that = this
        var timestamp = (Date.parse(new Date())) / 1000
        var sign = MD5Util.sign(timestamp)
        var index = e.currentTarget.dataset.index
        wx.request({
            url: 'https://www.aftdc.com/wxapp/Article/del_appraises',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                sign: sign,
                timestamp: timestamp,
                token: wx.getStorageSync('usersInfo').token,
                id: e.currentTarget.dataset.appraises_id, //评论的id
            },
            method: "POST",
            success: function(res) {
                wx.showToast({
                    title: '删除成功',
                })
                that.data.lyDatas.splice(index, 1);
                that.setData({
                    lyDatas: that.data.lyDatas
                })
            }
        })
    },
    focus: function(e) {
        this.functionType = e.target.dataset.type
        this.setData({
            focus: !this.data.focus
        })
    },
  toTextBox:util.throttle(function (e) {
        var appraises_id = -1;
        var functionType = e.target.dataset.type;
        var userId = wx.getStorageSync('usersInfo').userId;
        var title = this.data.articleInfo.title
        if (e.target.dataset.appraises_id) appraises_id = e.target.dataset.appraises_id;
        wx.navigateTo({
          url: '../textbox/textbox?functionType=' + functionType + '&commentOrleaveWord=' + this.data.articleInfo.commentOrleaveWord + '&appraises_id=' + appraises_id + '&shopId=' + this.data.articleInfo.shopId + '&id=' + this.data.id + '&userId=' + userId + '&title=' + title,
        })
    }),
    toDownloadApp() {
        wx.navigateTo({
            url: '../downloadApp/downloadApp',
        })
    },
    direct: function() {
        wx.switchTab({
            url: '/page/tabBar/direct/index',
        })
    },
    //点击滚动到评论
    toViewClick() {
        if (this.data.toView == 'detail') {
            this.setData({
                toView: 'comment'
            })
        } else if (this.data.toView == 'comment') {
            this.setData({
                toView: 'detail'
            })
        }
    },
    jump: function(e) {
        var userId = e.target.dataset.userid
        var userPhoto = e.target.dataset.userphoto
        var userName = e.target.dataset.username
        wx.navigateTo({
          url: '../../../personal/dynamic/dynamic?userId=' + userId + '&userPhoto=' + userPhoto + '&userName=' + userName,
        })
    },
    // 删除评论或留言
    del(e) {
      this.setData({ firstClick: false })
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
          if (res.data.res === 1) {
            wx.showToast({
              title: '删除成功',
            })
            that.data.lyData.splice(index, 1);
            that.setData({ 
              lyData: that.data.lyData,
              'articleInfo.comment_num': that.data.articleInfo.comment_num - 1,
              page: that.data.page - 1
            })
            

          } else if (res.data.res === 0) {
            wx.showToast({
              title: res.data.info,
              icon: 'none',
              duration: 1500,
            })
          }
          that.setData({ firstClick: true })
        }
      })
    }

})