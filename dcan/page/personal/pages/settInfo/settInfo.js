var app = getApp();
var MD5Util = require('../../../../utils/md5.js');
Page({

    data: {
        infoData: [
            {
                txt: '门店名称',
                types: 'text',
                name: 'shopName',//input的name
                place: '请与门脸照上名称一致',
                val: '',
            },
            {
                txt: '门店电话',
                types: 'number',
                name: 'shopPhone',//input的name
                place: '请填写门店电话',
                val: '',
            },
            {
                txt: '联系人姓名',
                types: 'text',
                name: 'name',//input的name
                place: '请填写联系人姓名',
                val: '',
            },
            {
                txt: '联系人电话',
                types: 'text',
                name: 'phone',//input的name
                place: '联系人电话',
                val: '12345678910',
            },
            {
                txt: '邮箱',
                types: 'text',
                name: 'email',//input的name
                place: '请填写邮箱',
                val: '',
            },
        ],
        //门店照片显示数据
        imgData: [
            {
                txt: '门脸照',
                word: '一张真实美观的门脸照可以提升店铺形象',
                exampleImg: 'https://image.aftdc.com/images/packageA/shopImg2.jpg',
                exampleTxt: '门脸照需拍出完整牌匾，门框，需在餐厅开门营业状况下完成拍摄（建议正对门店2米处拍摄）',
                upImg: '',//上传的图片---本地路径
                img: '',//上传的图片路径名
                statusCode: 0,//判断是否上传成功
                name: 'frontImg'
            },
            {
                txt: '店内照',
                word: '简洁干净的店内照片可以让用户放心点单',
                exampleImg: 'https://image.aftdc.com/images/packageA/shopImg1.jpg',
                exampleTxt: '门脸照需拍出完整牌匾，门框',
                upImg: '',
                img: '',
                statusCode: 0,
                name: 'insideImg'

            },
            {
                txt: '门店LOGO',
                word: '上传与店铺配的logo，能提升店铺的概率（支持JPG、JPEG、PNG格式，大小不超过500k）',
                exampleImg: 'https://image.aftdc.com/images/packageA/logo.png',
                exampleTxt: '门脸照需拍出完整牌匾，门框',
                upImg: '',
                img: '',
                statusCode: 0,
                name: 'logo'

            },
        ],
        //分类数据
        clasifyData: [
            { name: '异国料理', child: [{ name: '披萨意面', id: 1 }, { name: '披萨意面', id: 2 }, { name: '披萨意面', id: 3 },] },
            { name: '美食', child: [{ name: '炸鸡', id: 1 }, { name: '炸鸡', id: 2 }, { name: '炸鸡', id: 3 },] },
        ],


        upIndex: '',//记录点击的上传图片
        //  uploadImg: { door: '', inside: '', logo: '' },//上传的图片数据 door 门脸，inside 店内，logo 门店logo

        exampleData: {},//示例弹出框数据,上传弹出框数据

        shopClas: '单店',//店铺类型
        rankTab: 1,//主次营选择导航
        rankData: { main: '', next: '' },//主次营选择的索引
        rankId: { mainid: '', nextid: '' },
        rankDataTxt: { main: '', next: '' },//主次营选择的文字,
        // rankActive: { a: -1, b: -1 },//选中的索引
        rankActive: -1,
        clasify: '',//分类

        switchs: true, //是否24小时营业
      serviceTime: [{ serviceStartTime: '', serviceEndTime: '' }], //自定义时间    
        time: '',//营业时间

        address: [],//省市区
        clasifyTypeItem:['单店','连锁店'],//店鋪類型
        clasifyTypeItemVal:'',//店铺类型的值
        addressVal: '',//input 的显示文本
        location: {},//地图选择经纬度
        detailAddress: '',//详细地址

        togle: false,//1为门店分类 2为营业弹框，3为上传图片，4为门店照片示例弹框，
        ok: '',
        phone: '',
        token: '',
    },


    onLoad: function (options) {
        var phone = options.phone;//上一页填写跳转的号码
        var token = options.token;//上一页填写跳转的token
        if (options.is_fill_in) var is_fill_in = options.is_fill_in;//上一页填写跳转的 is_fill_in 
        else is_fill_in = 0;
        if (!phone || !token) {
            wx.showToast({
                title: '电话和token为空',
                icon: 'loading',
                duration: 1100
            });
            return false;
        }
        var infoData = this.data.infoData;
        // if (options.ok) var ok = options.ok;
        infoData[3].val = phone;
        this.setData({
            infoData: infoData,
            // ok: ok,
            phone: phone,
            token: token,
            is_fill_in: is_fill_in,
        })
    },
    //获取菜系
    onReady: function () {
        var that = this;
        var phone = that.data.phone;
        var token = that.data.token;

        //获取菜系
        wx.request({
            url: 'https://www.aftdc.com/businessapp/Enter/sysCuisine',
            data: {
                phone: phone,
                token: token
            },
            header: {
                'content-type': 'application/json',
            },
            success: function (res) {
                //将请求的后台数据赋值new_list
                that.setData({
                    clasifyData: res.data,
                })
            }
        })

        //获取已填写的内容
        if (that.data.is_fill_in) {
            wx.request({
                url: 'https://www.aftdc.com/businessapp/Enter/get_enterInfo',
                data: {
                    phone: phone,
                    token: token,
                    num: 1,
                },
                method: 'post',
                header: { "Content-Type": "application/x-www-form-urlencoded" },
                success: function (res) {
                    if (res.data.res == 1) {
                        var enterInfo = res.data.enterInfo;
                        //infoData
                        that.data.infoData[0].val = enterInfo.shopName;
                        that.data.infoData[1].val = enterInfo.stores_phone;
                        that.data.infoData[2].val = enterInfo.userName;
                        that.data.infoData[3].val = enterInfo.phone;
                        //门店分类
                        var rankId = that.data.rankId;
                        var rankDataTxt = that.data.rankDataTxt;
                        rankId['mainid'] = enterInfo.cuisineId;//"主营"
                        rankId['nextid'] = enterInfo.secondary;//"次营"
                        for (var i in that.data.clasifyData) {
                            for (var val in that.data.clasifyData[i].child) {
                                if (that.data.clasifyData[i].child[val]['id'] == enterInfo.cuisineId) rankDataTxt.main = that.data.clasifyData[i].child[val]['name'];
                                if (that.data.clasifyData[i].child[val]['id'] == enterInfo.secondary) rankDataTxt.next = that.data.clasifyData[i].child[val]['name'];
                            }
                        }
                        if (!rankDataTxt.next) rankDataTxt.next = '无';
                        var clasify = '主营:' + rankDataTxt['main'] + '/次营:' + rankDataTxt['next']
                        //营业时间
                      var serviceTime = enterInfo.serviceTime;
                      var time = ''
                      for (var i in serviceTime) {
                        time = i == 0 ? time + serviceTime[i].serviceStartTime + '-' + serviceTime[i].serviceEndTime : time + ',' + serviceTime[i].serviceStartTime + '-' + serviceTime[i].serviceEndTime
                      }
                        //门店地址
                        that.data.addressVal = enterInfo.province + '-' + enterInfo.city + '-' + enterInfo.county;
                        //门店详细地址
                        var detailAddress = enterInfo.detailAddress;
                        //地图位置
                        var mapsTxt = enterInfo.shopAddress;
                        //经纬度
                        that.data.location.longitude = enterInfo.longitude;
                        that.data.location.latitude = enterInfo.latitude;
                        //img
                        var imgData = that.data.imgData;
                        if (enterInfo.door_img) {
                            imgData[0].statusCode = 200;
                            imgData[0].img = enterInfo.door_img;
                        }
                        if (enterInfo.store_img) {
                            imgData[1].statusCode = 200;
                            imgData[1].img = enterInfo.store_img;
                        }
                        if (enterInfo.store_img) {
                            imgData[2].statusCode = 200;
                            imgData[2].img = enterInfo.shopImg;
                        }

                        that.setData({
                            infoData: that.data.infoData,
                            rankId: rankId,
                            clasify: clasify,
                          serviceTime: serviceTime,
                            time:time,
                            addressVal: that.data.addressVal,
                            detailAddress: detailAddress,
                            mapsTxt: mapsTxt,
                            location: that.data.location,
                            imgData: imgData,
                        })
                    }
                }
            })
        }
    },
    // ------------------------------------------ 门店分类-----------------------------------------

    clasifyTogle: function () {
        this.setData({
            togle: 1
        })
    },
    // //店铺类型
    // radioChange: function (e) {
    // 	this.setData({
    // 		shopClas: e.detail.value
    // 	})
    // },

    rankTabFn: function (e) {
        var index = e.currentTarget.dataset.index;
        var rankId = this.data.rankId;
        var active = index == 1 ? rankId['mainid'] : rankId['nextid'];

        var rankActive = active
        this.setData({
            rankTab: index,
            rankActive: rankActive,
        })
    },
    rankChoiceFn: function (e) {
        var index = e.currentTarget.dataset.index;//大分类
        var idx = e.currentTarget.dataset.idx;  //小分类
        var rankTab = this.data.rankTab;
        var numb = 'a' + index + 'b' + idx;
        var rankData = this.data.rankData;//主次营的选择索引
        var rankDataTxt = this.data.rankDataTxt
        var clasifyData = this.data.clasifyData
        var txt = clasifyData[index].child[idx].name
        var rankId = this.data.rankId
        if (rankTab == 1) {
            var cid = rankId['nextid'];
            if (Boolean(cid) && clasifyData[index].child[idx].id == cid) {
                return false;
            }
            rankId['mainid'] = clasifyData[index].child[idx].id
            rankData['main'] = numb;
            rankDataTxt['main'] = txt;
        } else {
            var cid = rankId['mainid'];
            if (Boolean(cid) && clasifyData[index].child[idx].id == cid) {
                return false;
            }
            rankId['nextid'] = clasifyData[index].child[idx].id
            rankData['next'] = numb;
            rankDataTxt['next'] = txt;
        }
        var rankActive = clasifyData[index].child[idx].id
        this.setData({
            rankData: rankData,
            rankDataTxt: rankDataTxt,
            rankActive: rankActive,
            rankId: rankId
        })
    },
    //选择分类 确定
    clasifySure: function () {
        var rankDataTxt = this.data.rankDataTxt;
        if (!Boolean(rankDataTxt['main'])) {
            wx.showToast({
                title: '请选择主营分类',
                icon: 'loading',
                duration: 1200
            })
            return false
        } else if (!Boolean(rankDataTxt['next'])) {
            rankDataTxt['next'] = '无'
        }
        var clasify = '主营:' + rankDataTxt['main'] + '/次营:' + rankDataTxt['next']

        this.setData({
            togle: false,
            clasify: clasify,
        })
    },

    // ------------------------------------------ 营业时间-----------------------------------------
    //  营业时间弹出
    timeTogle: function (e) {
        this.setData({
            togle: 2
        })
    },
    switchChange: function (e) {
        this.setData({
            switchs: e.detail.value
        })
    },
    // 时间选择
    timeCharge: function (e) {
      var that=this
        var index = e.currentTarget.dataset.index;
        var name = e.currentTarget.dataset.name; //选择的是开始时间还是结束时间
      var serviceTime = this.data.serviceTime;
       
      if (name == 'start') {
        var start = e.detail.value;
        for (var i in serviceTime) {
          
          if (i < index) {
            if (!serviceTime[i].serviceStartTime || !serviceTime[i].serviceStartTime) {
              that.setData({
                hobbyTip: true,
                hobbyTips: '请先设置上一个时间段',
              })
              setTimeout(function () {
                that.setData({
                  hobbyTip: false
                })
              }, 2000)
              return false
            }
            if (start <= serviceTime[i].serviceStartTime || start <= serviceTime[i].serviceEndTime) {
              that.setData({
    							hobbyTip: true,
                hobbyTips: '当前设置时间与其他时间冲突',
    						})
    						setTimeout(function () {
    							that.setData({
    								hobbyTip: false
    							})
                }, 2000)
    						return false
            }
          }
          if (i == index) {
            if (serviceTime[i].serviceEndTime && start >= serviceTime[i].serviceEndTime) {
              that.setData({
                hobbyTip: true,
                hobbyTips: '开始时间需要小于结束时间',
              })
              setTimeout(function () {
                that.setData({
                  hobbyTip: false
                })
              }, 2000)
              return false
            }
          }
        }
        serviceTime[index].serviceStartTime = e.detail.value
        this.setData({
          serviceTime: serviceTime
        })

      } else if (name == 'end') {
        var end = e.detail.value
        for (var i in serviceTime) {
          if (i == index) {
            if (!serviceTime[i].serviceStartTime) {
              that.setData({
                hobbyTip: true,
                hobbyTips: '请先选择开始时间',
              })
              setTimeout(function () {
                that.setData({
                  hobbyTip: false
                })
              }, 2000)
              return false
            }
            if (serviceTime[i].serviceStartTime && end <= serviceTime[i].serviceStartTime) {
              that.setData({
                hobbyTip: true,
                hobbyTips: '结束时间需要大于开始时间',
              })
              setTimeout(function () {
                that.setData({
                  hobbyTip: false
                })
              }, 2000)
              return false
            }
          }
          if (i > index) {
            if ((serviceTime[i].serviceStartTime && end >= serviceTime[i].serviceStartTime) || (serviceTime[i].serviceEndTime && end >= serviceTime[i].serviceEndTime)) {
              that.setData({
                hobbyTip: true,
                hobbyTips: '当前设置时间与其他时间冲突',
              })
              setTimeout(function () {
                that.setData({
                  hobbyTip: false
                })
              }, 2000)
              return false
            }
          }
        }
        serviceTime[index].serviceEndTime = e.detail.value
        this.setData({
          serviceTime: serviceTime
        })
      }
    },
    //删除时间
    closeTime: function (e) {
        var index = e.currentTarget.dataset.index;
      var serviceTime = this.data.serviceTime;
      serviceTime.splice(index, 1)
        this.setData({
          serviceTime: serviceTime,
        })
    },
    //添加时间
    addTime: function (e) {
      var serviceTime = this.data.serviceTime;
      if (serviceTime.length<3){
        var obj = { serviceStartTime: '', serviceEndTime: '' }
        serviceTime.push(obj);
        this.setData({
          serviceTime: serviceTime
        })
      }
        
    },

    timeBut: function (e) {
        var switchs = this.data.switchs;
        if (switchs) {
            this.setData({
              serviceTime: [{ serviceStartTime: '00:00', serviceEndTime: '23:59' }],
                time: '00:00-23:59',
                togle: false,
            })
        } else {
          var serviceTime = this.data.serviceTime;
          var time=''
          for (var i in serviceTime){
            if (!serviceTime[i].serviceStartTime) {
              wx.showToast({
                title: '请选择开始时间',
                icon: 'loading',
                duration: 1200
              })
              return false
            }
            if (!serviceTime[i].serviceEndTime) {
              wx.showToast({
                title: '请选择结束时间',
                icon: 'loading',
                duration: 1200
              })
              return false
            }
            time = i == 0 ? time + serviceTime[i].serviceStartTime + '-' + serviceTime[i].serviceEndTime : time+',' + serviceTime[i].serviceStartTime + '-' + serviceTime[i].serviceEndTime 
          }
           
            this.setData({
              time: time,
                togle: false,
            })

        }
    },

    // ------------------------------------------ 地图-----------------------------------------
    clasifyTypeClick: function (e) {
        var val = e.detail.value
        var clasifyTypeItemVal = this.data.clasifyTypeItem[val]
        this.setData({
            clasifyType: val,
            clasifyTypeItemVal: clasifyTypeItemVal
        })
    },
    addressChange: function (e) {
        var val = e.detail.value
        var addressVal = val[0] + '-' + val[1] + '-' + val[2]
        this.setData({
            address: val,
            addressVal: addressVal
        })
    },
    detailFn: function (e) {
        var val = e.detail.value;
        this.setData({
            detailAddress: val
        })
    },
    mapFn: function () {
        var that = this
        var r = that.data.address;
        var a = that.data.detailAddress;
        if (r == '' || a == '') {
            wx.showToast({
                title: '完善区域和地址',
                icon: 'loading',
                duration: 2200
            })
            return false;
        }
        wx.chooseLocation({
            success: function (res) {
                var location = {};
                location.longitude = res.longitude
                location.latitude = res.latitude
                that.setData({
                    mapsTxt: res.name,
                    location: location,
                })
            }
        })
    },
    // ------------------------------------------ 上传图片-----------------------------------------
    uploadTogle: function (e) {
        var index = e.currentTarget.dataset.index;
        var exampleData = this.data.imgData[index]
        this.setData({
            upIndex: index,
            exampleData: exampleData,
        })
        this.uploadFn()
    },
    uploadFn: function () {
        var that = this;
        var lastname = '';
        var filename = '';
        var imgData = that.data.imgData;
        var upIndex = that.data.upIndex;
        imgData[upIndex].statusCode = 0;
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表， res.tempFilePaths可以作为img标签的src属性显示图片
                filename = res.tempFilePaths[0];
                var index1 = filename.lastIndexOf(".");
                var index2 = filename.length;
                lastname = filename.substring(index1, index2);//后缀名 
                imgData[upIndex].upImg = filename;
                //获取上传令牌
                var dir = 'enter/';//上传的文件路径
                var phone = that.data.phone;
                var token = that.data.token;
                wx.request({
                    url: 'https://www.aftdc.com/businessapp/Enter/getOss',
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    data: {
                        dir: dir,
                        phone: phone,
                        token: token
                    },
                    method: "POST",
                    success: function (res) {
                        if (res.data.res == 1) {
                            var response = res.data.response;
                            imgData[upIndex].img = response['dir'] + Date.parse(new Date()) + '0' + Math.round(Math.random() * 1000000) + lastname;
                            //上传图片
                            wx.uploadFile({
                                url: response['host'],
                                filePath: filename,
                                name: 'file',
                                formData: {
                                    "key": imgData[upIndex].img,//图片的路径
                                    "policy": response['policy'],
                                    "OSSAccessKeyId": response['accessid'],
                                    'success_action_status': '200',
                                    'signature': response['signature']
                                },
                                header: { "Content-Type": "multipart/form-data" },
                                success: function (res) {
                                    //成功返回{statusCode: 200, data: "", errMsg: "uploadFile:ok"}
                                    if (res.statusCode == 200) {
                                        imgData[upIndex].statusCode = 200;
                                        that.setData({
                                            togle: false,
                                            imgData: imgData,
                                        })
                                    }
                                }
                            })
                        }
                    }
                })
            }
        })
    },


    // ------------------------------------------ 示例图片-----------------------------------------
    exampleFn: function (e) {
        var index = e.currentTarget.dataset.index;
        var val = this.data.imgData[index];
        this.setData({
            exampleData: val,
            togle: 4,
        })
    },

    //-------------- 关闭弹框 -----------
    togleFn: function () {
        this.setData({
            togle: false,
        })
    },

    //获取当前时间，格式YYYY-MM-DD
    getNowFormatDate: function () {
        var date = new Date();
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate;
        return currentdate;
    },

    //--------------- 下一步 ---------------
    formSubmit: function (e) {
        var that = this;
        //--------------- 检测表单是否为空 ---------------
        //如果要改变上传数据的名字，改变data对应数据中的 name 
        var infoData = that.data.infoData;//页面数据
        var formData = e.detail.value;//-------------------提交表单数据
        for (var i in formData) {
            var txt = formData[i]
            if (txt.length == 0) {
                //获取缺少是哪个数据
                var len = infoData.length;
                var tsTile = '请完善信息';
                for (var j = 0; j < len; j++) {
                    if (infoData[j].name == i) {
                        var t = infoData[j].txt;
                        tsTile = '请填写' + t
                        break
                    }
                }
                wx.showToast({
                    title: tsTile,
                    icon: 'loading',
                    duration: 1200
                })
            }
        }
        //--------------- 门店名称 ---------------
        var shopName = formData['shopName'];
        if (shopName == '') {
            wx.showToast({
                title: '请填写名称',
                icon: 'loading',
                duration: 1100
            });
            return false;
        }
        if (shopName.length > 12) {
            wx.showToast({
                title: '名称限12字',
                icon: 'loading',
                duration: 1100
            });
            return false;
        }
        //--------------- 门店电话 ---------------
        var shopPhone = formData['shopPhone'];//"门店电话"
        if (shopPhone == '' || !/^(0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8})|(400|800)([0-9\\-]{7,10})|(([0-9]{4}|[0-9]{3})(-| )?)?([0-9]{7,8})((-| |转)*([0-9]{1,4}))?$/.test(shopPhone)) {
            wx.showToast({
                title: '门店电话错误',
                icon: 'loading',
                duration: 1100
            });
            return false;
        }
   
        //--------------- 联系人电话 ---------------
        var phone = formData['phone'];//13845456356"
        if (phone == '') {
            wx.showToast({
                title: '联系人电话为空',
                icon: 'loading',
                duration: 1100
            });
            return false;
        }
        //--------------- 联系人姓名 ---------------
        var name = formData['name'];
        if (name == '') {
            wx.showToast({
                title: '请输入联系人',
                icon: 'loading',
                duration: 1100
            });
            return false;
        }
        //--------------- 邮箱 ---------------
        var email = formData['email']
        let str = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
        if (!str.test(email)) {
            wx.showToast({
                title: '邮箱验证错误',
                icon: 'loading',
                duration: 1100
            });
            return false;
        }
        // if (email == '') {
        //     return false;
        // }

        //--------------- 门店分类例子 ---------------
        var rankId = this.data.rankId;//"主营:1/次营:2"
        var cuisineId = rankId['mainid'];//"主营"
        var secondary = rankId['nextid'];//"次营
        if (!secondary) {
            var secondary = -1;//"次营
        }
        if (cuisineId == '') {
            wx.showToast({
                title: '请选择门店分类',
                icon: 'loading',
                duration: 2100
            });
            return false;
        }
        var shopSaleClassflyId = cuisineId + ',' + secondary;
      
        //--------------- 门店类型 ---------------
        var clasifyTypeItemVal = this.data.clasifyTypeItemVal;
        if (clasifyTypeItemVal==''){
            wx.showToast({
                title: '请选择门店类型',
                icon: 'loading',
                duration: 2100
            });
            return false;
        }
      
        //--------------- 开始营业时间 ---------------
        var time = that.data.time;//"00:00-23:59"
        if (time == '') {
          
            wx.showToast({
                title: '请选择营业时间',
                icon: 'loading',
                duration: 1100
            });
            return false;
        }
        // var today = this.getNowFormatDate();
      var serviceTime = that.data.serviceTime;
        // var timeone = (new Date(today + ' ' + timeArr[0] + ':00')).getTime() / 1000;
        // //--------------- 结束营业时间 ---------------
        // var timeend = (new Date(today + ' ' + timeArr[1] + ':00')).getTime() / 1000;
        //--------------- 门店地址 ---------------
        var addressVal = that.data.addressVal;
        if (addressVal == '') {
            wx.showToast({
                title: '请选择门店地址',
                icon: 'loading',
                duration: 1100
            });
            return false;
        }
        //--------------- 门店营业执照地址 ---------------
        var detailAddress = formData['detailAddress'];//"详细地址"
        if (detailAddress == '') {
            wx.showToast({
                title: '请输入详细地址',
                icon: 'loading',
                duration: 1100
            });
            return false;
        }
        //--------------- 门店地图位置(经纬度) ---------------
        var latitude = that.data.location.latitude;//经纬度
        var longitude = that.data.location.longitude;//经纬度
        if (latitude == '' || longitude == '') {
            wx.showToast({
                title: '经纬度为空',
                icon: 'loading',
                duration: 1100
            });
            return false;
        }
        var LonLag = latitude + ',' + longitude;
        //--------------- 门店地图位置(名字) ---------------
        var mapsTxt = formData['mapsTxt'];//"三元里广州市白云区政府(广园中路南)"
        if (mapsTxt == '') {
            wx.showToast({
                title: '请选择位置',
                icon: 'loading',
                duration: 1100
            });
            return false;
        }
        //--------------- 图片路径 ---------------
        //检测图片
        var imgData = this.data.imgData;
        var ok = this.data.ok;
        var is_fill_in = this.data.is_fill_in;
        var imgs = {};//----------------------------  图片路径
        var localParts = {};//----------------------------  本地路径
        for (var k in imgData) {
            var statusCode = imgData[k].statusCode;
            if (statusCode !== 200) {
                var tsimg = imgData[k].txt
                wx.showToast({
                    title: '请上传' + tsimg,
                    icon: 'loading',
                    duration: 1200
                })
                return false
            }
            var imgname = imgData[k].name;
            imgs[imgname] = imgData[k].img;;
            localParts[imgname] = imgData[k].upImg;
        }
        var img = [{ img: imgs['frontImg'], localPart: localParts['frontImg'] }, { img: imgs['insideImg'], localPart: localParts['insideImg'] }, { img: imgs['logo'], localPart: localParts['logo'] }]
        //--------------- token ---------------
        var token = this.data.token;

        // //其他数据：店铺类型
        // var shopClas = this.data.shopClas;
        // if (shopClas == '单店') {
        // 	shopClas = 2;
        // } else {
        // 	shopClas = 1;
        // }
        wx.showLoading({
            title: '提交中',
        })
        wx.request({
            url: 'https://www.aftdc.com/businessapp/Enter/enter_firstStep',
            method: 'POST',
            data: {
                shopName: shopName,
                stores_phone: shopPhone,
                phone: phone,
                userName: name,
                detailAddress: detailAddress,//门店详细地址
                provinceValue: addressVal,//门店地址
                clasifyTypeItemVal: clasifyTypeItemVal,//门店类型
              serviceTime: JSON.stringify(serviceTime),
                shopSaleClassflyId: shopSaleClassflyId,
                img: JSON.stringify(img),
                LonLag: LonLag,//经纬度
                shopAddress: mapsTxt,//地图地址
                token: token,
                is_fill_in: is_fill_in,
            },
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            success: function (res) {
                if (res.data.res == 1) {
                    wx.hideLoading()
                    wx.showToast({
                        title: '请进行下一步',
                        mask: true,
                        success: setTimeout(function () {
                            if (ok == 1) {
                                wx.navigateTo({
                                    url: '../wait/wait?phone=' + that.data.phone + '&token=' + that.data.token,
                                })
                            } else {
                                wx.navigateTo({
                                    url: '../aptitude/aptitude?phone=' + that.data.phone + '&token=' + that.data.token + '&is_fill_in=' + is_fill_in,
                                })
                            }
                        }, 2000)
                    })
                } else {
                    wx.showToast({
                        title: res.data.info,
                        icon: 'loading',
                        duration: 1100
                    });
                }
            }
        })
        return false;
    },
})


