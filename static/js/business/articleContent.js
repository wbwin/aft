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
            inputList:[],
            voteSure:'',
            voteClickIndex:[],
            lyData:[],
            lyDatas:[],
            page:0,//分页
            content:'',
            focus:false,
            dzan:false,
            functionType:'',
            focus:false,


            token:'',
            articleId:'461',
            userId:'',
            latitude:'',
            longitude:'',
            userPhone:'',
        },
        created:function () {
            var that=this
            //参数
            // that.token=that.getParamer('token');
            // that.model=that.getParamer('model');
            // that.articleId=that.getParamer('articleId');
            // that.userId=that.getParamer('userId');
            // that.latitude=that.getParamer('latitude');
            // that.longitude=that.getParamer('longitude');
            // that.userPhone=that.getParamer('userPhone');
            that.latitude = 23.15792
            that.longitude = 113.27324
            //参数
            var data={
                id:that.articleId,
                userId:44,
                longitude: that.longitude,
                latitude: that.latitude,
                is_user:0,
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
                var timestamp = (Date.parse(new Date()))/1000
                var sign = tokenSign(timestamp,that.model,that.token);
                if (that.userId) {
                    var data={
                            article_id: that.articleId,
                            userId: that.userId,
                            sign: sign,
                            timestamp: timestamp,
                            token: that.token
                        }
                        axios({
                        method: "post",
                        url:'https://www.aftdc.com/wxapp/Article/newRead',
                        params:data,
                        // headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    }).then(function (res) {

                    })
                }

                that.getUserTask(that.id, that.userId)
            })
        },
        methods:{

            // getParamer:function(paramer){
            //
            //     var url=window.location.href.split("?")[1];            /*获取url里"?"后面的值*/
            //     if(url.indexOf("&")>0){                                      /*判断是否是一个参数还是多个参数*/
            //       var  urlParamArry=url.split("&");                            /*分开每个参数，并放到数组里*/
            //         for(var i=0; i<urlParamArry.length; i++){
            //             var paramerName=urlParamArry[i].split("=");   /*把每个参数名和值分开，并放到数组里*/
            //             if(paramer==paramerName[0]){                     /*匹配输入的参数和数组循环出来的参数是否一样*/
            //                 return paramerName[1];                           /*返回想要的参数值*/
            //             }
            //         }
            //     }else{                                                              /*判断只有个参数*/
            //         var paramerValue=url.split("=")[1];
            //         return paramerValue;
            //     }
            //
            // },

            //获取评论
            getUserTask:function (id, userId) {
                var that=this
                var timestamp = (Date.parse(new Date()))/1000
                var sign = tokenSign(timestamp,that.model,that.token);
                var data={
                    article_id:that.articleId,
                    page:that.page,
                    userId:userId,
                    // sign: sign,
                    // timestamp: timestamp,
                    // token: that.token
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
                var timestamp = (Date.parse(new Date()))/1000
                var sign = tokenSign(timestamp,that.model,that.token);
                var data={
                    id: that.articleId,
                    voteList: voteClickIndex,
                    sign:sign,
                    timestamp:timestamp,
                    token:that.token,
                }
                axios({
                    method: "post",
                    url:'https://www.aftdc.com/wxapp/Article/vote',
                    params:data,
                    // headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                }).then(function (res) {
                    if(res.data.res==1){
                        var voteClickIndex = that.data.voteClickIndex
                        var inputList = that.data.vote.inputList
                        for (var i = 0; i < voteClickIndex.length;i++){
                            inputList[voteClickIndex[i]].voteNum += 1
                        }
                        for (var i in inputList){
                            inputList[i].percentageVotes = (inputList[i].voteNum / res.data.voteNum*100).toFixed(0)+'%'
                        }

                            that.inputList=inputList,
                            that.voteSure=1

                    }

                })

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
                var timestamp = (Date.parse(new Date()))/1000
                var sign = tokenSign(timestamp,that.model,that.token);
                var data={
                        id: that.articleId,    //文章的id
                        userId: that.userId,
                        sign: sign,
                        timestamp: timestamp,
                        token: that.token,
                    }
                axios({
                    method: "post",
                    url:'https://www.aftdc.com/wxapp/Article/arcticle_praise',
                    params:data,
                    // headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                }).then(function (res) {
                    if(res.data.res==1){

                            articleInfo.is_praise = 1
                            articleInfo.praise_num += 1
                            that.dzan=true
                            that.articleInfo=articleInfo

                            var zanTime = setTimeout(function () {
                                that.dzan=false
                                clearTimeout(zanTime);
                            }, 900)
                        }else{
                            articleInfo.is_praise = 0
                            articleInfo.praise_num -= 1

                               that.articleInfo=articleInfo

                        }


                })


            },
            //点赞文章

            //点赞自己的评论
            praiseMyPl:function(index) {

                var that = this
                var lyData = that.lyDatas
                if (lyData[index].is_praise == 1) {
                    wx.showToast({
                        title: '已点赞',
                        mask: true
                    })
                } else {
                    var timestamp = (Date.parse(new Date()))/1000
                    var sign = tokenSign(timestamp,that.model,that.token);
                    var data={
                        id: lyData[index].id,    //文章的id
                        userId: that.userId,
                        sign: sign,
                        timestamp: timestamp,
                        token: that.token,
                    }
                    axios({
                        method: "post",
                        url:'https://www.aftdc.com/wxapp/Article/arcticle_appraises_praise',
                        params:data,
                        // headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    }).then(function (res) {
                        if(res.data.res==1){
                            lyData[index].is_praise = 1
                            lyData[index].praise_num += 1


                                that.dzan=true,
                                that.lyDatas=lyData

                            var zanTime = setTimeout(function () {

                                    that.dzan=false,

                                clearTimeout(zanTime);
                            }, 900)
                        }

                    })
                }
            },
            //点赞评论
            praisePl: function (index) {

                var that = this
                var lyData = that.lyData
                if (lyData[index].is_praise == 1) {
                    wx.showToast({
                        title: '已点赞',
                        mask: true
                    })
                } else {
                    var timestamp = (Date.parse(new Date()))/1000
                    var sign = tokenSign(timestamp,that.model,that.token);
                    var data={
                        id: lyData[index].id,    //文章的id
                        userId: that.userId,
                        sign: sign,
                        timestamp: timestamp,
                        token: that.token,
                    }
                    axios({
                        method: "post",
                        url:'https://www.aftdc.com/wxapp/Article/arcticle_appraises_praise',
                        params:data,
                        // headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    }).then(function (res) {
                        if(res.data.res==1){
                            lyData[index].is_praise = 1
                            lyData[index].praise_num += 1


                            that.dzan=true,
                                that.lyData=lyData

                            var zanTime = setTimeout(function () {

                                that.dzan=false,

                                    clearTimeout(zanTime);
                            }, 900)
                        }

                    })
                }
            },
            //回复
            focus: function (type) {
                this.functionType =type

                    this.focus=!this.focus

            },
            //删除
            del: function (index,id) {
                var that = this
                var timestamp = (Date.parse(new Date()))/1000
                var sign = tokenSign(timestamp,that.model,that.token);
                var data={
                    sign: sign,
                    timestamp: timestamp,
                    token: that.token,
                    id: id,    //评论的id
                    }
                axios({
                    method: "post",
                    url: 'https://www.aftdc.com/wxapp/Article/del_appraises',
                    params:data,
                    // headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                }).then(function (res) {
                    if(res.data.res==1){
                        // wx.showToast({
                        //     title: '删除成功',
                        // })
                        that.data.lyDatas.splice(index, 1);

                    }


                })
            },

            //帮他加油
            comeOn: function () {
                var articleInfo = {}
                var article_id = this.articleId
                wx.miniProgram.navigateTo({
                    url: '../helpMe/helpMe?article_id=' + article_id,
                })
            },
            //进店
            gotoShop: function () {
                var shopId = this.articleInfo.shopId
                wx.miniProgram.navigateTo({
                    url: '/pages/introduce/introduce?shopId=' + shopId,
                })
            },
            //投诉
            report: function (e) {
               var that=this
                if (!that.userId || !that.userPhone) {//如果没登录
                    wx.miniProgram.navigateTo({
                        url: '/pages/author/author',
                    })
                    return false
                } else {
                    wx.miniProgram.navigateTo({
                        url: '/pages/direct/report/report?article_id=' + that.articleId,
                    })
                }
            },
            jump: function (userId,userPhoto,userName) {
                wx.miniProgram.navigateTo({
                    url: '/pages/personal/dynamic/dynamic?userId=' + userId + '&userPhoto=' + userPhoto + '&userName=' + userName,
                })
            },
            //了解留言功能详情
            lwTip: function () {
                wx.miniProgram.navigateTo({
                    url: '../lwTip/lwTip',
                })
            },
        },
    })
}