window.onload = function () {
    var app=new Vue({
        el:'.article',
        data:{
            isLoad:false,
            articleInfo:'',
            articleDetail:'',
            attentionType:'',
            collectType:'',
            collectTypes:'',
            shopCollectType:'',
            shopCollectTypes:'',
            template:'',
            vote:'',
            inputList:[{ value: '公共卫生', percentageVotes: '54.45%', voteNum: 87, checked: 0 }, { value: '啥都会卡死', percentageVotes: '45.55%', voteNum: 72, checked: 1 }],
            voteSure:'',
            voteClickIndex:[],
            lyData:[],
            lyDatas:[],
            page:0,//分页
            content:'',
            focus:false,
            dzan:false,
        },
        created:function () {
            var that=this
            var id='150101'
            var userId='1330015'
            var data={
                    id:id,
                userId:userId,
                }
            axios({
                method: "post",
                url:'https://www.aftdc.com/wxapp/Article/newDetail',
                params:data,
                // headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            }).then(function (res) {
                if(res.data.res==1){
                    that.isLoad=true;
                    that.articleInfo=res.data.data;
                    that.articleDetail=res.data.data.content;
                    that.attentionType=res.data.data.attention;
                    that.collectType=res.data.data.is_collect;
                    that.collectTypes=res.data.data.is_collect;//初始的收藏文章状态
                    that.shopCollectType=res.data.data.shop_collect;
                    that.shopCollectTypes=res.data.data.shop_collect;
                    that.template=res.data.data.template
                }

                if (res.data.data.vote){
                    var vote = res.data.data.vote
                    for (var i in vote.inputList){
                        vote.inputList[i].checked=false
                    }
                    if(res.data.data.userVote){
                        var voteClickIndex = res.data.data.userVote
                        var inputList = vote.inputList
                        for (var i = 0; i < voteClickIndex.length; i++) {
                            inputList[voteClickIndex[i]].checked = true
                        }
                        for (var i in inputList) {
                            inputList[i].percentageVotes = (inputList[i].voteNum / res.data.data.voteNum * 100).toFixed(0) + '%'
                        }
                        that.vote=vote
                        that.inputList=inputList
                        that.voteSure=1
                    }else{
                       that.vote=vote
                    }
                }
                if (res.data.data.music) {
                    // innerAudioContext.src = 'https://image.aftdc.com/' + res.data.data.music.musicPath
                    // innerAudioContext.autoplay = true
                    // that.setData({
                    //     play:true
                    // })
                }
                // var timestamp = (Date.parse(new Date())) / 1000
                // var sign = MD5Util.sign(timestamp)
                // if (app.globalData.userId) {
                //     wx.request({
                //         url: 'https://www.aftdc.com/wxapp/Article/newRead',
                //         header: {
                //             'content-type': 'application/x-www-form-urlencoded'
                //         },
                //         data: {
                //             article_id: id,
                //             userId: userId,
                //             sign: sign,
                //             timestamp: timestamp,
                //             token: app.globalData.usersInfo.token,
                //         },
                //         method: "POST",
                //         success: function (res) {
                //         }
                //     })
                // }
                that.getUserTask(id, userId)
            })
        },
        methods:{
            //获取评论
            getUserTask:function (id, userId) {
                var that=this
                var data={
                    article_id:id,
                    page:that.page,
                    userId:userId,
                }
                axios({
                    method: "post",
                    url:'https://www.aftdc.com/wxapp/Article/arcticle_appraises',
                    params:data,
                    // headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                }).then(function (res) {
                    if(res.data.res==1){
                        that.lyData=res.data.data;
                        that.lyDatas=res.data.datas;
                        that.page=that.lyData.concat(res.data.data).length
                    }

                })
            },
            //点击投票选项
            voteClick:function(index) {
                var that = this
                var vote = that.vote
                var voteClickIndex = that.voteClickIndex
                if (vote.type === 1) {   // 单选
                    for (let i = 0, len = vote.inputList.length; i < len; i++) {
                        vote.inputList[i].checked = false

                    }
                    if (voteClickIndex[0] !== index) {
                        vote.inputList[index].checked = true
                        voteClickIndex[0] = index
                    } else {
                        voteClickIndex = []
                    }
                } else if (vote.type === 0) {    // 多选,无限制
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

                } else {    // 多选,可选n项
                    if (voteClickIndex.length < vote.type || vote.inputList[index].checked === true) {
                        if (vote.inputList[index].checked !== true) {
                            voteClickIndex.push(index)

                        } else {
                            for (var i=0;i<voteClickIndex.length;i++){
                                if (voteClickIndex[i]==index){
                                    voteClickIndex.splice(i,1)
                                }
                            }
                        }
                        vote.inputList[index].checked = !vote.inputList[index].checked
                    }
                }


                    that.vote=vote,
                    that.voteClickIndex=voteClickIndex

            },
            //确认投票
            sureVote:function (){
                // var usersInfo = wx.getStorageSync('usersInfo')
                // if (!usersInfo) {//如果没登录
                //     wx.navigateTo({
                //         url: '/pages/author/author',
                //     })
                //     return false
                // }
                var that=this
                var articleId = that.articleInfo.id
                var voteClickIndex = that.voteClickIndex//已投票的index 例：[2]
                voteClickIndex = JSON.stringify(voteClickIndex)
                // var timestamp = (Date.parse(new Date())) / 1000
                // var sign = MD5Util.sign(timestamp)
                // wx.request({
                //     url: 'https://www.aftdc.com/wxapp/Article/vote',
                //     header: {
                //         'content-type': 'application/x-www-form-urlencoded'
                //     },
                //     data: {
                //         id: articleId,
                //         voteList: voteClickIndex,
                //         sign: sign,
                //         timestamp: timestamp,
                //         token: app.globalData.usersInfo.token,
                //     },
                //     method: "POST",
                //     success: function (res) {
                //         if(res.data.res==1){
                //             var voteClickIndex = that.data.voteClickIndex
                //             var inputList = that.data.vote.inputList
                //             for (var i = 0; i < voteClickIndex.length;i++){
                //                 inputList[voteClickIndex[i]].voteNum += 1
                //             }
                //             for (var i in inputList){
                //                 inputList[i].percentageVotes = (inputList[i].voteNum / res.data.voteNum*100).toFixed(0)+'%'
                //             }
                //             that.setData({
                //                 inputList: inputList,
                //                 voteSure: 1
                //             })
                //         }
                //     }
                // })
                // var data={
                //     id: articleId,
                //     voteList: voteClickIndex,
                //     // sign:'AC60CD66A85E277B3A9CFF69821C3EB9',
                //     // timestamp:'1533644981',
                //     // token:'$2y$10$0T6GGcVBTMn1IACi6fbOyO2bgE86KDLaW0rnsK1/.t6gPJv31/YIy',
                // }
                // axios({
                //     method: "post",
                //     url:'https://www.aftdc.com/wxapp/Article/vote',
                //     params:data,
                //     // headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                // }).then(function (res) {
                //     if(res.data.res==1){
                //         var voteClickIndex = that.data.voteClickIndex
                //         var inputList = that.data.vote.inputList
                //         for (var i = 0; i < voteClickIndex.length;i++){
                //             inputList[voteClickIndex[i]].voteNum += 1
                //         }
                //         for (var i in inputList){
                //             inputList[i].percentageVotes = (inputList[i].voteNum / res.data.voteNum*100).toFixed(0)+'%'
                //         }
                //
                //             that.inputList=inputList,
                //             that.voteSure=1
                //
                //     }
                //
                // })
                that.voteSure=1
            },
            //点赞
            Praise: function (type,index) {
                // var index = e.currentTarget.dataset.index

                var that = this
                // var usersInfo = wx.getStorageSync('usersInfo')
                // if (!usersInfo || !usersInfo.userPhone) {//如果没登录
                //     wx.navigateTo({
                //         url: '/pages/author/author',
                //     })
                //     return false
                // } else {
                    if (type == 1) {//点赞文章
                        that.praiseWz()
                    } else if (type == 3) {
                        that.praiseMyPl(index)
                    } else if (type == 2) {
                        that.praisePl(index)
                    }
                // }
            },
            //点赞文章
            praiseWz: function () {

                var that = this
                var articleInfo = that.articleInfo
                // if (articleInfo.is_praise == 1) {
                //   wx.showToast({
                //     title: '已点赞',
                //     mask: true
                //   })
                // } else {
                // var timestamp = (Date.parse(new Date())) / 1000
                // var sign = MD5Util.sign(timestamp)
                // wx.request({
                //     url: 'https://www.aftdc.com/wxapp/Article/arcticle_praise',
                //     header: {
                //         'content-type': 'application/x-www-form-urlencoded'
                //     },
                //     data: {
                //         id: that.data.id,    //文章的id
                //         userId: app.globalData.userId,
                //         sign: sign,
                //         timestamp: timestamp,
                //         token: app.globalData.usersInfo.token,
                //     },
                //     method: "POST",
                //     success: function (res) {
                //         if(res.data.res == 1){
                            articleInfo.is_praise = 1
                            articleInfo.praise_num += 1
                that.dzan=true
                that.articleInfo=articleInfo

                           var zanTime = setTimeout(function () {
                                that.dzan=false
                                clearTimeout(zanTime);
                            }, 900)
                        // }else{
                        //     articleInfo.is_praise = 0
                        //     articleInfo.praise_num -= 1
                        //     that.setData({
                        //         articleInfo: articleInfo
                        //     })
                        // }
                //     }
                // })
                // }
            },
            //点赞文章

            //点赞自己的评论
            praiseMyPl:function(index) {
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
                        url: 'https://www.aftdc.com/wxapp/Article/arcticle_appraises_praise',
                        header: {
                            'content-type': 'application/x-www-form-urlencoded'
                        },
                        data: {
                            id: lyData[index].id,    //文章的id
                            userId: app.globalData.userId,
                            sign: sign,
                            timestamp: timestamp,
                            token: app.globalData.usersInfo.token,
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
                        url: 'https://www.aftdc.com/wxapp/Article/arcticle_appraises_praise',
                        header: {
                            'content-type': 'application/x-www-form-urlencoded'
                        },
                        data: {
                            id: lyData[index].id,    //文章的id
                            userId: app.globalData.userId,
                            sign: sign,
                            timestamp: timestamp,
                            token: app.globalData.usersInfo.token,
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
        },
    })
}