var util = require('../../../../utils/util.js')
var MD5Util = require('../../../../utils/md5.js');
var app = getApp()
Page({

    data: {
        clasData: ["配送问题", "功能改善建议", "其他问题"],
        clasIndex: -1,
        detailPro: '',
        phone: '',
        imgData: [],
        clasIfy: '',
        userId:wx.getStorageSync('usersInfo').userId,
        submitButSure: true,
    },

    onLoad: function(options) {

    },
    clasChoice: function(e) {
        var index = e.currentTarget.dataset.index;
        //    var txt = this.data.clasData[index]
        this.setData({
            clasIndex: index,
            clasIfy: index,
        })
        console.log(this.data.clasIfy)
    },
    //详细问题
    bindTextAreaBlur: function(e) {
        var val = e.detail.value
        this.setData({
            detailPro: val
        })
    },
    //上传图片
    uploadImg: function(e) {
        var that = this
        wx.chooseImage({
            count: 9, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function(res) {
                var tempFilePaths = res.tempFilePaths;
                var imgData = that.data.imgData;
                imgData = imgData.concat(tempFilePaths);
                var len = imgData.length
                if (len > 9) {
                    imgData.splice(0, len - 9)
                }
                that.setData({
                    imgData: imgData,
                })
                console.log(tempFilePaths)
            }
        })
    },
    //删除图片
    closeImg: function(e) {
        var index = e.currentTarget.dataset.index;
        var imgData = this.data.imgData;
        imgData.splice(index, 1);
        this.setData({
            imgData: imgData,
        })
    },
    //手机号
    phoneBlur: function(e) {

        var val = e.detail.value;
        this.setData({
            phone: val,
        })
    },

    // 打电话
    contactClick(){
        wx.makePhoneCall({
          phoneNumber: '4008677791',
			  success: function (res) {
                console.log(res)
            }
        })
    },

  submitBut: util.throttle(function (e) {
        var that = this
        if (this.data.submitButSure) {

            this.setData({
                submitButSure: false
            })

            var usersInfo = wx.getStorageSync('usersInfo')
            if (!usersInfo || !usersInfo.userPhone) { //如果没登录
                wx.navigateTo({
                  url: '../../../homePage/pages/author/author',
                })
                return false
            }
            var clasIfy = this.data.clasIfy; //反馈类型
            var detailPro = this.data.detailPro //详细描述
            var phone = this.data.phone; //手机号码
            var imgData = this.data.imgData; //图片

            if (!Boolean(clasIfy)) {
                util.aftModal({
                    title: '请选择反馈类型',
                    icon: 'loading',
                    duration: 1500
                })
                return false
            }
            if (!Boolean(detailPro)) {
                util.aftModal({
                    title: '请填写详细描述',
                    icon: 'loading',
                    duration: 1500
                })
                return false
            }
            if (!Boolean(phone)) {
                util.aftModal({
                    title: '请输入号码',
                    icon: 'loading',
                    duration: 1500
                })
                return false
            }
            if (!(/^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9])|(17[0-9]))\d{8}$/.test(phone))) {
                util.aftModal({
                    title: '号码不正确',
                    icon: 'loading',
                    duration: 1500
                })
                return false
            }
            var f = {}; //----------------------------  后缀名
            for (var p in imgData) {
                var filename = imgData[p];
                var index1 = filename.lastIndexOf(".");
                var index2 = filename.length;
                f[p] = filename.substring(index1, index2); //后缀名  
            }
            var timestamp = (Date.parse(new Date())) / 1000
            var sign = MD5Util.sign(timestamp)
            var q = JSON.stringify(f)
            wx.request({
                url: 'https://www.aftdc.com/wxapp/Service/me_idea',
                data: {
                    userId:wx.getStorageSync('usersInfo').userId,
                    question: detailPro,
                    phone: phone,
                    feedtype: clasIfy,
                    q: q,
                    sign: sign,
                    timestamp: timestamp,
                    token: wx.getStorageSync('usersInfo').token,
                },
                header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                method: "POST",
                success: function(res) {
                    if (res.data.res == 1) {
                        var p = 0;
                        var q = imgData.length;
                        for (var i in imgData) {
                            var img = res.data.oss.dir + res.data.name[i];
                            console.log(img)
                            wx.uploadFile({
                                url: res.data.oss.host,
                                filePath: imgData[i],
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
                                success: function(ress) {
                                    var timestamp = (Date.parse(new Date())) / 1000
                                    var sign = MD5Util.sign(timestamp)
                                    if (ress.statusCode == 200) {
                                        wx.request({
                                            url: 'https://www.aftdc.com/wxapp/Service/me_upload',
                                            method: 'POST',
                                            data: {
                                                sign: sign,
                                                timestamp: timestamp,
                                                token: wx.getStorageSync('usersInfo').token,
                                                id: res.data.id,
                                                file: res.data.oss.dir + res.data.name[i],
                                            },
                                            success: function(b) {
                                                if (b.data.res == 1) {
                                                    p++
                                                } else {
                                                    wx.showToast({
                                                        title: b.data.info,
                                                        mask: true,
                                                        icon: 'loading',
                                                        success: setTimeout(function() {

                                                        }, 1000)
                                                    })
                                                    return false;
                                                }
                                                if (p == q) {
                                                    wx.showToast({
                                                        title: '提交成功',
                                                        mask: true,
                                                        icon: 'loading',
                                                        success: setTimeout(function() {
                                                            wx.switchTab({
                                                                url: '/page/tabBar/homePage/index',
                                                            })
                                                        }, 2000)
                                                    })
                                                }
                                                that.setData({
                                                    submitButSure: true
                                                })
                                            }
                                        })
                                    }
                                    // var ress = JSON.parse(info);
                                    that.setData({
                                        submitButSure: true
                                    })
                                }
                            })
                        }
                    } else {
                        that.setData({
                            submitButSure: true
                        })
                        wx.showToast({
                            title: res.data.info,
                            mask: true,
                            icon: 'loading',
                            success: setTimeout(function() {

                            }, 1000)
                        })
                    }
                }
            })
        }
    }),


})