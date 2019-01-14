var MD5Util = require('../../../../utils/md5.js');
var util = require('../../../../utils/util.js')
var app = getApp();
Page({
    data: {
        tags: [{
            name: '准时送到',
            sel: false
        },
            {
                name: '商品完整',
                sel: false
            },
            {
                name: '配送快',
                sel: false
            },
            {
                name: '送货快',
                sel: false
            },
            {
                name: '整洁卫生',
                sel: false
            },
            {
                name: '骑手服务好',
                sel: false
            }
        ],
        imagesrc: [],
        content: '', //评论
        contentPf: '', //服务员评分
        mood: '', //评价类型...
        tk: 0,
        service: -1, //商品评分
        serviceIndex: -1, //商品评分
        vtime: -1, //时效评分
        waiterIndex: -1,
        choose: 1,
        taste: -1,
        wrap: -1,
        goods: 1,
        tks: 0,
        tkType: false,
        tk: 0,
        mode: false, //服务员评分显示隐藏
        tagStr: '',
        types: '',
        hobbyTip: false,
    },

    onLoad: function (options) {
        //点击的是哪件商品的评价
        var pid = options.pid;
        var shopId = options.shopId;
        var tk = options.tk;
        var types = options.types;

        // tk为1时,是团购,为2时是代金券
        if (tk == 1 || tk == 2 ) {
            this.setData({
                tkType: false,
                types: -1,
            })
        } else if (types == 3 || types == 5){
            this.setData({
                tkType: false,
                types: types,
            })
        } else {
            this.setData({
                tkType: true,
                types: types,
            })
        }
        this.setData({
            hidden: false,
            pid: pid,
            shopId: shopId,
            tk: tk,
        })
    },
    onReady: function () {
        var shopId = this.data.shopId
        var that = this
        if (that.data.tk == 1 || that.data.tk == 3 || that.data.types == 3 || that.data.types == 5) {
            var timestamp = (Date.parse(new Date())) / 1000
            var sign = MD5Util.sign(timestamp)
            wx.request({
                url: 'https://www.aftdc.com/wxapp/Score/getWaiter',
                data: {
                    sign: sign,
                    timestamp: timestamp,
                    token: wx.getStorageSync('usersInfo').token,
                    shopId: shopId
                },
                method: 'POST',
                header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                success: function (res) {
                    if (res.data.res == 1) {
                        var arr = res.data.waiter
                        that.data.waiterInfo = arr
                        var waiter = []
                        for (var i in arr) {
                            waiter[i] = arr[i]['waiterName']
                        }
                        that.setData({
                            waiter: waiter,
                            mode: true
                        })
                    } else {
                        that.setData({
                            mode: false
                        })
                    }
                }
            })
        }
    },
    //获取服务员的编号
    bindPickerChange: function (e) {
        var index = e.detail.value
        var arr = this.data.waiterInfo
        var id = arr[index]['id']
        this.setData({
            index: index,
            id: id
        })
    },
    confirm: util.throttle(function () {
        var com = this;
        var userId = wx.getStorageSync('usersInfo').userId;
        var imagesrc = com.data.imagesrc
        var length = imagesrc.length
        var content = com.data.content;
        var mood = com.data.mood;
        var pid = com.data.pid;
        var shopId = com.data.shopId;
        var serviceScore = this.data.serviceIndex + 1; //服务评分
        var goodsScore = this.data.service + 1; //商品评分
        var timeScore = this.data.vtime + 1; //时效评分
        var wrap = this.data.wrap + 1; //包装
        var taste = this.data.taste + 1 //口味
        var tags = this.data.tags
        var tagStr = this.data.tagStr
        var hobbyTip = com.data.hobbyTip
        for (var i in tags) {
            if (tags[i]['sel']) {
                tagStr = tagStr + tags[i]['name'] + ','
            }
        }
        if (!this.data.tkType) {
            var tk = 1
        } else {
            var tk = 0
        }
        var that = this
        if (mood == "") {
            mood = "好评";
        }
        if (that.data.tk == 1 || that.data.tk == 2 || that.data.types == 3 || that.data.types == 5) {
            if (serviceScore == 0 || goodsScore == 0) {
                that.setData({
                    hobbyTip: true,
                    hobbyTips: "请选择星级"
                })
                if (hobbyTip) {
                    return false
                } else {
                    var times = setTimeout(function () {
                        that.setData({
                            hobbyTip: false,
                            timeout: true
                        })
                    }, 2000)
                }
                return false
            }
        } else {
            if (serviceScore == 0 || goodsScore == 0 || timeScore == 0 || wrap == 0 || taste == 0) {
                that.setData({
                    hobbyTip: true,
                    hobbyTips: "请选择星级"
                })
                if (hobbyTip) {
                    return false
                } else {
                    var times = setTimeout(function () {
                        that.setData({
                            hobbyTip: false,
                            timeout: true
                        })
                    }, 2000)
                }
                return false
            }
        }

        //服务员评分
        // var mode=com.data.mode;
        // var pf='';
        // if (mode){
        //     var contentPf = com.data.contentPf
        //     var waiterIndex = com.data.waiterIndex + 1
        //     var id = com.data.id
        //     if (!content && !waiterIndex && !id) {
        //         wx.showModal({
        //             title: '提示',
        //             content: '请填写完整',
        //             showCancel: false
        //         })
        //         return false;
        //     }
        //     pf = {};
        //     pf = {content: contentPf, goods: waiterIndex, waiterId: id, orderId: pid, userId: userId,shopId: shopId};
        //     pf=JSON.stringify(pf)
        // }
        var pf = ""
        var f = {}; //----------------------------  后缀名
        for (var p in imagesrc) {
            var filename = imagesrc[p];
            var index1 = filename.lastIndexOf(".");
            var index2 = filename.length;
            f[p] = filename.substring(index1, index2); //后缀名
        }
        var timestamp = (Date.parse(new Date())) / 1000
        var sign = MD5Util.sign(timestamp)
        var q = JSON.stringify(f);

        // 因为订单页面的团购和代金券都没有返回ordertype,在这里赋值,都为4
        var orderType = this.data.types;
        if (orderType >= 0){//外卖
            if (orderType == 0){
                orderType = 1;
            }
            else if (orderType == 2) {//扫码
                orderType = 6;
            }
            else if (orderType == 3) {//堂食
                orderType = 3;
            }
            else if (orderType == 5) {//自取
                orderType = 2;
            }
        } else {
            if (this.data.tk == 1) {//团购
                orderType = 4
            }
            if (this.data.tk == 2) {//代金券
                orderType = 5
            }
        }
        wx.request({
            url: 'https://www.aftdc.com/wxapp/Score/addAis',
            data: {
                orderId: pid,
                content: content,
                goodsScore: goodsScore,
                timeScore: timeScore,
                serviceScore: serviceScore,
                userId: userId,
                shopId: shopId,
                wrap: wrap,
                taste: taste,
                tagStr: tagStr,
                pf: pf, //评分数据 无数据为‘’ 有数据为json
                q: q,
                orderType: orderType,
                sign: sign,
                timestamp: timestamp,
                model: wx.getStorageSync('usersInfo').model,
                token: wx.getStorageSync('usersInfo').token,
            },
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
                if (res.data.res == 0) {
                    that.setData({
                        hobbyTip: true,
                        hobbyTips: res.data.info
                    })
                    if (hobbyTip) {
                        return false
                    } else {
                        var times = setTimeout(function () {
                            that.setData({
                                hobbyTip: false,
                                timeout: true
                            })
                        }, 2000)
                    }
                    return false
                }

                if (res.data.res == 1) {


                    // wx.showModal({
                    //   title: '提示',
                    //   content: '评价成功',
                    //   showCancel: false,
                    //   success: function (s) {
                    //     if (s.confirm) {
                    //       com.cancel()
                    //     }
                    //   }
                    // })
                    var q = 0;
                    //上传图片到数据库

                    var img_file_arr = [];

                    if (imagesrc.length > 0) {
                        for (var i in imagesrc) {
                            var img_file = res.data.oss.dir + res.data.name[i];
                            img_file_arr.push(img_file);

                            wx.uploadFile({
                                url: res.data.oss.host,
                                filePath: imagesrc[i],
                                name: 'file',
                                formData: {
                                    "key": res.data.oss.dir + res.data.name[i], //图片的路径
                                    "policy": res.data.oss.policy,
                                    "OSSAccessKeyId": res.data.oss.accessid,
                                    'success_action_status': '200',
                                    'signature': res.data.oss.signature
                                },
                                header: {
                                    "Content-Type": "multipart/form-data"
                                },
                                success: function (ress) {
                                    if (ress.statusCode == 200) { }
                                }
                            })
                        }

                        var timestamp = (Date.parse(new Date())) / 1000
                        var sign = MD5Util.sign(timestamp)
                        wx.request({
                            url: 'https://www.aftdc.com/wxapp/Score/imgFilter',
                            method: 'POST',
                            data: {
                                id: res.data.id,
                                file: JSON.stringify(img_file_arr),
                                sign: sign,
                                timestamp: timestamp,
                                token: wx.getStorageSync('usersInfo').token
                            },
                            success: function (b) {
                                if (b.data.conclusion == '不合规') {
                                    wx.showModal({
                                        title: '提示',
                                        content: '图片内容违规',
                                        showCancel: false,
                                        success: function (s) {
                                            if (s.confirm) {
                                                com.cancel()
                                            }
                                        }
                                    })
                                    return false
                                } else {
                                    var timestamp = (Date.parse(new Date())) / 1000
                                    var sign = MD5Util.sign(timestamp)
                                    wx.request({
                                        url: 'https://www.aftdc.com/wxapp/Score/updImg',
                                        method: 'POST',
                                        data: {
                                            id: res.data.id,
                                            file: JSON.stringify(img_file_arr),
                                            sign: sign,
                                            timestamp: timestamp,
                                            token: wx.getStorageSync('usersInfo').token
                                        },
                                        success: function (b) {
                                            if (b.data.res == 1) {

                                                wx.showModal({
                                                    title: '提示',
                                                    content: '评价成功',
                                                    showCancel: false,
                                                    success: function (s) {
                                                        if (s.confirm) {
                                                            com.cancel()
                                                        }
                                                    }
                                                })

                                            }
                                        }
                                    })
                                }
                            }
                        })
                    } else {
                        wx.showModal({
                            title: '提示',
                            content: '评价成功',
                            showCancel: false,
                            success: function (s) {
                                if (s.confirm) {
                                    com.cancel()
                                }
                            }
                        })
                    }
                } else if (res.data.isDisable == 1) {
                    wx.showModal({
                        title: '提示',
                        content: '含有敏感字符，请文明评论',
                        showCancel: false
                    })
                } else {
                    wx.showModal({
                        title: '提示',
                        content: '失败，请重试',
                        showCancel: false
                    })
                }
            },
        })
    }),
    cancel: function () {
        //返回订单页
        wx.navigateBack({
            delta: 1,
        })

    },
    //获取评论数据
    com: function (e) {
        var re = this;
        this.data.content = e.detail.value
    },
    compf: function (e) {
        this.data.contentPf = e.detail.value
    },
    //上传图片
    add: function () {
        var that = this
        wx.chooseImage({
            success: function (res) {
                var tempFilePaths = res.tempFilePaths
                var imagesrc = that.data.imagesrc
                for (var i in tempFilePaths) {
                    imagesrc.unshift(tempFilePaths[i]);
                }
                if (imagesrc.length > 10) {
                    imagesrc.splice(10)
                }
                that.setData({
                    imagsrc: imagesrc,
                })
            }
        })
    },
    //商品评分
    service: function (e) {
        var index = e.currentTarget.dataset.index;
        var service = index
        this.setData({
            service: service,
        })
    },
    //服务评分：
    goods: function (e) {
        var index = e.currentTarget.dataset.index;
        var serviceIndex = index
        this.setData({
            serviceIndex: serviceIndex,
        })
    },
    //时效评分：
    vtime: function (e) {
        var index = e.currentTarget.dataset.index;
        var vtime = index
        this.setData({
            vtime: vtime,
        })
    },
    //口味评分：
    taste: function (e) {
        var index = e.currentTarget.dataset.index;
        var taste = index
        this.setData({
            taste: taste,
        })
    },
    //包装评分：
    wrap: function (e) {
        var index = e.currentTarget.dataset.index;
        var wrap = index
        this.setData({
            wrap: wrap,
        })
    },
    cha: function (e) {
        var dele = e.currentTarget.dataset.dele;
        var imagesrc = this.data.imagesrc
        imagesrc.splice(dele, 1)
        this.setData({
            imagsrc: imagesrc,
        })
    },
    goto: function (e) {
        var that = this
        var orderId = e.currentTarget.dataset.orderid
        var shopId = e.currentTarget.dataset.shopid
        that.setData({
            modelshow: false,
            orderId: orderId,
            shopId: shopId
        })
    },
    waiterIndex: function (e) {
        var index = e.currentTarget.dataset.index;
        var waiterIndex = index
        this.setData({
            waiterIndex: waiterIndex,
        })
    },
    //没有订单
    rule: function () {
        wx.switchTab({
            url: '../../nearby/nearby',
        })
    },
    chooseTag: function (e) {
        var index = e.currentTarget.dataset.index
        var tags = this.data.tags
        tags[index]['sel'] = !tags[index]['sel']
        this.setData({
            tags: tags
        })
    },

})