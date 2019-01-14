var MD5Util = require('../../../../utils/md5.js');
var checkBank = require('../../../../utils/examineBank.js');
var app = getApp();

Page({

    data: {
        infoData: [
            {
                txt: '证件类型',//0
                types: 'text',
                name: 'cardClasfly',//input的name 
                place: '选择',
                val: '身份证',
                moreFn: 'more',
                index: 0,
            },
            {
                txt: '真实姓名',//1
                types: 'text',
                name: 'bankUserName',//input的name 
                place: '证件上的姓名',
                val: '',
                index: 1,
                moreFn: 'not',
            },
            {
                txt: '证件号码',//2
                types: 'text',
                name: 'IdentityNo',//input的name
                place: '证件上的号码',
                val: '',
                index: 2,
                moreFn: 'not',
            },
            {
                txt: '证件类型',//3
                types: 'text',
                name: 'unitType',//input的name
                place: '选择',
                val: '营业执照',
                moreFn: 'more',
                index: 3,
            },
            {
                txt: '单位名称',//4
                types: 'text',
                name: 'unitName',//input的name
                place: '证件上的单位名称',
                val: '',
                index: 4,
                moreFn: 'not',
            },
            {
                txt: '注册号',//5
                types: 'text',
                name: 'unitNumb',//input的name
                place: '证件对应注册号',
                val: '',
                index: 5,
                moreFn: 'not',
            },
            {
                txt: '注册地址',//6
                types: 'text',
                name: 'unitAdres',//input的name
                place: '证件对应地址',
                val: '',
                index: 6,
                moreFn: 'not',
            },
            {
                txt: '法定代表人',//7
                types: 'text',
                name: 'unitPeople',//input的name
                place: '证件上的营业者',
                val: '',
                index: 7,
                moreFn: 'not',
            },
            {
                txt: '',//8
                types: 'text',
                name: 'unitStartTime',//input的name
                place: '开始时间',
                val: '',
                index: 8,
                moreFn: 'not',
            },
            {
                txt: '证件类型',//9
                types: 'text',
                name: 'allowType',//input的name
                place: '选择',
                val: '',
                moreFn: 'more',
                index: 9,
            },
            {
                txt: '单位名称',//10
                types: 'text',
                name: 'allowName',//input的name
                place: '证件上的单位名称',
                val: '',
                index: 10,
                moreFn: 'not',
            },
            {
                txt: '许可证编号',//11
                types: 'text',
                name: 'allowNumb',//input的name
                place: '证件对应编号',
                val: '',
                index: 11,
                moreFn: 'not',
            },
            {
                txt: '许可证地址',//12
                types: 'text',
                name: 'allowAdres',//input的name
                place: '证件对应地址',
                val: '',
                index: 12,
                moreFn: 'not',
            },
            {
                txt: '法定代表人',//13
                types: 'text',
                name: 'allowPeople',//input的name
                place: '证件上对应法定代表人',
                val: '',
                index: 13,
                moreFn: 'not',
            },
            {
                txt: '',//14
                types: 'text',
                name: 'allowStartTime',//input的name
                place: '开始时间',
                val: '',
                index: 14,
                moreFn: 'not',
            },
            {
                txt: '本人银行卡',//2
                types: 'text',
                name: 'bankNo',//input的name
                place: '银行卡号',
                val: '',
                index: 15,
                moreFn: 'not',
            },
            {
                txt: '银行',//2
                types: 'text',
                name: 'bankName',//input的name
                place: '请选择银行',
                val: '',
                index: 16,
                moreFn: 'more',
            },
        ],
        imgData: [
            {
                txt: '正面照',
                word: '请注意证件照片上的文字能够清晰可见',
                exampleImg: 'https://image.aftdc.com/images/packageA/papers1.jpg',
                exampleTxt: '证件照片上的文字需要能够清晰辨认',
                upImg: '',//上传的图片，本地路径
                name: 'faceImg',//上传图片字段名
                index: 0,
                statusCode: 0,//判断是否上传成功
                img: ''//路径
            },
            {
                txt: '反面照',
                word: '请注意证件照片上的文字能够清晰可见',
                exampleImg: 'https://image.aftdc.com/images/packageA/papers2.jpg',
                exampleTxt: '证件照片上的文字需要能够清晰辨认',
                upImg: '',//上传的图片
                name: 'backImg',
                index: 1,
                statusCode: 0,//判断是否上传成功
                img: ''//路径
            },
            {
                txt: '手持正面照',
                word: '请注意证件照片上的文字能够清晰可见',
                exampleImg: 'https://image.aftdc.com/images/packageA/papers3.jpg',
                exampleTxt: '证件照片上的文字需要能够清晰辨认',
                upImg: '',//上传的图片
                name: 'handImg',
                index: 2,
                statusCode: 0,//判断是否上传成功
                img: ''//路径
            },
            {
                txt: '证件照片',
                word: '请注意证件照片上的文字能够清晰可见',
                exampleImg: 'https://image.aftdc.com/images/packageA/setTyps.jpg',
                exampleTxt: '证件照片上的文字需要能够清晰辨认',
                upImg: '',//上传的图片 餐饮许可证
                name: 'unitImg',
                index: 3,
                statusCode: 0,//判断是否上传成功
                img: ''//路径
            },
            {
                txt: '证件照片',
                word: '请注意证件照片上的文字能够清晰可见',
                exampleImg: 'https://image.aftdc.com/images/packageA/setAllow.jpg',
                exampleTxt: '证件照片上的文字需要能够清晰辨认',
                upImg: '',//上传的图片
                name: 'allowImg',
                index: 4,
                statusCode: 0,//判断是否上传成功
                img: ''//路径
            },
            {
                txt: '银行卡',
                word: '请注意证件照片上的文字能够清晰可见',
                exampleImg: 'https://image.aftdc.com/images/packageA/bank.jpg',
                exampleTxt: '证件照片上的文字需要能够清晰辨认',
                upImg: '',//上传的图片
                name: 'bankImg',
                index: 5,
                statusCode: 0,//判断是否上传成功
                img: ''//路径
            },
        ],
        //身份证证件类型选择的index
        cardData: ['身份证', '港澳居民内地居住证', '台胞证', '护照',],
        cardIndex: 0,//选择的index

        //选择银行
        bankData: [],
        bankIndex: 0,
        bankArr: [],

        //营业执照证件类型选择
        typeData: ['营业执照', '灵活就业（营业）辅导证/意见', '事业单位法人证书', '民办非企业单位登记证书', '社会团体法人登记证书'],
        typeIndex: 0,//选择的index
        dateRadio: '长期有效',
        unitStartTime: '开始时间',
        unitEndTime: '结束时间',

        //行业资质类型选择
        allowData: ['餐饮服务许可证', '食品经营许可证', '食品流通许可证', '食品摊贩临时经营公示卡', '全国工业产品生产许可证',
            '小徽餐饮分级证/登记凭证', '食品生产加工作坊准许证', '食品小作坊生产许可证', '食品小作坊登记证', '',
            '食品小作坊核准证', '小作坊、小餐饮登记证/小摊点备案凭证', '食品摊贩备案证明', '小作坊卫生许可证', '食品摊贩登记卡',
            '食品经营实名备案证', '小餐饮经营许可证'

        ],
        allowIndex: 0,//选择的index
        allowRadio: '长期有效',
        allowStartTime: '开始时间',
        allowEndTime: '结束时间',

        upIndex: '',//记录点击的上传图片
        exampleData: {},//示例弹出框数据,上传弹出框数据

        togle: false,//3为上传图片，4为门店照片示例弹框，
        ok: '',
        reverse: 0,//反面
        identify: 0,//手持
        phone: '',//手机
        token: '',//token
        sfz: '',//身份证
        sc: '',//手持身份证 
        checkBankNumber: 0,//检查银行卡号后返回的提示
    },

    onLoad: function (options) {
        var phone = options.phone;//上一页填写跳转的号码
        var token = options.token;//上一页填写跳转的号码
        if (options.is_fill_in) var is_fill_in = options.is_fill_in;
        else var is_fill_in = 0;
        this.setData({
            phone: phone,
            token: token,
            is_fill_in: is_fill_in,
            // ok: options.ok,
        })
    },

    onReady: function () {
        var that = this;
        var phone = that.data.phone;
        var token = that.data.token;

        //获取银行名
        wx.request({
            url: 'https://www.aftdc.com/businessapp/Enter/getBank',
            data: {
                phone: phone,
                token: token
            },
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST",
            success: function (res) {
                if (res.data.res == 1) {
                    var bankData = res.data.data;
                    var bankName = [];
                    for (var i = 0; i < bankData.length; i++) {
                        bankName.push(bankData[i]['bankName'])
                    }
                    that.setData({
                        bankData: bankName,
                        bankArr: bankData
                    })
                }
            }
        })

        //获取已填写的内容
        if (that.data.is_fill_in) {
            wx.request({
                url: 'https://www.aftdc.com/businessapp/Enter/get_enterInfo',
                data: {
                    phone: phone,
                    token: token,
                    num: 2,
                },
                method: 'post',
                header: { "Content-Type": "application/x-www-form-urlencoded" },
                success: function (res) {
                    if (res.data.res == 1) {
                        var enterInfo = res.data.enterInfo;
                        var infoData = that.data.infoData;
                        //idCardValue
                        var cardClasfly = enterInfo.idCardValue;
                        infoData[0].val = cardClasfly;
                        //bankUserName
                        var bankUserName = enterInfo.bankUserName;
                        infoData[1].val = bankUserName;
                        //IdentityNo
                        var IdentityNo = enterInfo.IdentityNo;
                        infoData[2].val = IdentityNo;
                        //bankNo
                        var bankNo = enterInfo.bankNo;
                        infoData[15].val = bankNo;
                        //bankName
                        var bankName = enterInfo.bankName;
                        infoData[16].val = bankName;
                        //bankId
                        that.data.bankId = enterInfo.bankId;
                        //businessLicense
                        var unitType = enterInfo.unitType;
                        infoData[3].val = unitType;
                        var unitName = enterInfo.unitName;
                        infoData[4].val = unitName;
                        var unitNumb = enterInfo.unitNumb;
                        infoData[5].val = unitNumb;
                        var unitAdres = enterInfo.unitAdres;
                        infoData[6].val = unitAdres;
                        var unitPeople = enterInfo.unitPeople;
                        infoData[7].val = unitPeople;
                        if (enterInfo.unitFixed == 0) that.data.dateRadio = '长期有效';
                        else {
                            that.data.dateRadio = '固定日期';
                            var unitTimeArr = enterInfo.unitFixed.split(",");
                            that.data.unitStartTime = unitTimeArr[0];
                            that.data.unitEndTime = unitTimeArr[1];
                            that.setData({
                                unitStartTime: that.data.unitStartTime,
                                unitEndTime: that.data.unitEndTime,
                            })
                        }
                        //otherLicense
                        var allowType = enterInfo.cardClasfly;
                        infoData[9].val = allowType;
                        var allowName = enterInfo.allowName;
                        infoData[10].val = allowName;
                        var allowNumb = enterInfo.allowNumb;
                        infoData[11].val = allowNumb;
                        var allowAdres = enterInfo.allowAdres;
                        infoData[12].val = allowAdres;
                        var allowPeople = enterInfo.allowPeople;
                        infoData[13].val = allowPeople;
                        if (enterInfo.allowFixed == 0) that.data.allowRadio = '长期有效';
                        else {
                            that.data.allowRadio = '固定日期';
                            var allowTimeArr = enterInfo.allowFixed.split(",");
                            that.data.allowStartTime = allowTimeArr[0];
                            that.data.allowEndTime = allowTimeArr[1];
                            that.setData({
                                allowStartTime: that.data.allowStartTime,
                                allowEndTime: that.data.allowEndTime,
                            })
                        }
                        //img
                        var imgData = that.data.imgData;
                        if (enterInfo.faceImg) {
                            imgData[0].statusCode = 200;
                            imgData[0].img = enterInfo.faceImg;
                        }
                        if (enterInfo.backImg) {
                            imgData[1].statusCode = 200;
                            imgData[1].img = enterInfo.backImg;
                        }
                        if (enterInfo.handImg) {
                            imgData[2].statusCode = 200;
                            imgData[2].img = enterInfo.handImg;
                        }
                        if (enterInfo.unitImg) {
                            imgData[3].statusCode = 200;
                            imgData[3].img = enterInfo.unitImg;
                        }
                        if (enterInfo.allowImg) {
                            imgData[4].statusCode = 200;
                            imgData[4].img = enterInfo.allowImg;
                        }
                        if (enterInfo.bankImg) {
                            imgData[5].statusCode = 200;
                            imgData[5].img = enterInfo.bankImg;
                        }
                        that.setData({
                            // cardClasfly: cardClasfly,
                            // bankUserName: bankUserName,
                            // IdentityNo: IdentityNo,
                            // bankNo: bankNo,
                            // bankName: bankName,
                            // unitType: unitType,
                            // unitName: unitName,
                            // unitNumb: unitNumb,
                            // unitAdres: unitAdres,
                            // unitPeople: unitPeople,
                            // allowType: cardClasfly,
                            // allowName: allowName,
                            // allowNumb: allowNumb,
                            // allowAdres: allowAdres,
                            // allowPeople: allowPeople,
                            infoData: infoData,
                            dateRadio: that.data.dateRadio,
                            allowRadio: that.data.allowRadio,
                            imgData: imgData,
                        })
                    }
                }
            })
        }
    },

    //input 输入
    bindInput: function (e) {
        var val = e.detail.value;
        var index = e.currentTarget.dataset.index;
        var infoData = this.data.infoData;
        // if (index == 9 || index == 10 || index == 11 || index == 12 || index == 13) {
        //   if (!this.data.allowIndex || !infoData[9]['val']) {
        //     wx.showToast({
        //       title: '请选择行业资质证件类型，不然所填行业资质资料不生效',
        //       icon: 'none',
        //       duration: 1000
        //     })
        //   }
        // }
        infoData[index]['val'] = val
        this.setData({
            infoData: infoData,
        })
    },

    // 银行号码自动添加空格
    kongge_string: function (e) {
        var kongge_phone = e.replace(/\s*/g, "");
        var val = this.data.infoData;
        var result = [];
        for (var i = 0; i < kongge_phone.length; i++) {
            if (i == 4 || i == 8 || i == 12 || i == 16) {
                result.push(" " + kongge_phone.charAt(i));
            }
            else {
                result.push(kongge_phone.charAt(i));
            }
        }
        kongge_phone = result.join("");
        val[15].val = kongge_phone;

        this.setData({
            infoData: val
        })
    },
    bankCheck(e) {
        var phone = e.detail.value;
        console.log(phone)
        this.kongge_string(phone);
    },


    //检测银行卡号
    checkBankNo: function (event) {
        var that = this;
        var bankNum = event.detail.value;
        var bankNumTwo = event.detail.value;
        var infoData = that.data.infoData;
        var checkBankNumber = 0;
        bankNum = bankNum.toString()
        if (bankNum.length >= 19) {
            bankNum = bankNum.replace(/ /g, '')
            var bankDetail = checkBank.getbankNameAndCardNo(that.data.infoData[16]['val'], bankNum);
            if (bankDetail == 'error') {
                checkBankNumber = -1;
                wx.showToast({
                    title: '输入正确银行卡号',
                    icon: 'none',
                    duration: 1200
                })
                return false
            } else {
                checkBankNumber = 1
                infoData[15]['val'] = bankNumTwo;
            }
        } else if (bankNum.length == 0) {
            checkBankNumber = 0
        } else {
            checkBankNumber = -1;//等于-1时提示输入正确银行卡号
            wx.showToast({
                title: '输入正确银行卡号',
                icon: 'none',
                duration: 1200
            })
            return false
        }
        that.setData({
            infoData: infoData,
            checkBankNumber: checkBankNumber,
        })
    },

    //身份证证件类型选择----------------
    cardChoice: function (e) {
        var index = e.detail.value;
        var infoData = this.data.infoData
        infoData[0]['val'] = this.data.cardData[index]
        this.setData({
            cardIndex: index,
            infoData: infoData,
        })
    },

    //银行选择----------------
    bankChoice: function (e) {
        var index = e.detail.value;
        var infoData = this.data.infoData;
        this.data.bankId = this.data.bankArr[index]['id'];
        infoData[16]['val'] = this.data.bankData[index];
        this.setData({
            bankIndex: index,
            infoData: infoData,
            bankId: this.data.bankId,
        })
    },
    //---------------------------------营业执照证件类型选择---------------------
    typeChoice: function (e) {
        var index = e.detail.value;
        var infoData = this.data.infoData
        infoData[3]['val'] = this.data.typeData[index]
        this.setData({
            typeIndex: index,
            infoData: infoData,
        })
    },
    //有效期选择
    radioChange: function (e) {
        this.setData({
            dateRadio: e.detail.value
        })
    },

    //选择固定时间
    dateChoice: function (e) {
        var val = e.detail.value
        var timeName = e.currentTarget.dataset.timename;
        if (timeName == 'unitStartTime') {
            this.setData({
                unitStartTime: val
            })
        }
        if (timeName == 'unitEndTime') {
            this.setData({
                unitEndTime: val
            })
        }
        if (timeName == 'allowStartTime') {
            this.setData({
                allowStartTime: val
            })
        }
        if (timeName == 'allowEndTime') {
            this.setData({
                allowEndTime: val
            })
        }
    },

    //-------------------------------------行业资质选填---------------------
    allowChoice: function (e) {
        var index = e.detail.value;
        var infoData = this.data.infoData
        infoData[9]['val'] = this.data.allowData[index]
        this.setData({
            allowIndex: index,
            infoData: infoData,
        })
    },
    //有效期选择
    allowRadio: function (e) {
        this.setData({
            allowRadio: e.detail.value
        })
    },
    // ------------------------------------------ 上传图片-----------------------------------------
    uploadTogle: function (e) {
        var index = e.currentTarget.dataset.index;
        // if (index == 4) {
        //   if (!this.data.allowIndex || !this.data.infoData[9]['val']) {
        //     wx.showToast({
        //       title: '请选择行业资质证件类型，不然所填行业资质资料不生效',
        //       icon: 'none',
        //       duration: 1000
        //     })
        //   }
        // }
        var exampleData = this.data.imgData[index]
        this.setData({
            upIndex: index,
            exampleData: exampleData,
            togle: 3,
        })
    },
    uploadFn: function () {
        var that = this;
        var phone = that.data.phone;//手机号码
        var token = that.data.token;//token
        var dir = 'enter/';//上传的文件路径
        var imgData = that.data.imgData;//图片数组
        var infoData = that.data.infoData//信息数组
        var upIndex = that.data.upIndex;//记录点击的上传图片
        var file = '';//图片本地路径
        var filename = ''//图片后戳
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表， res.tempFilePaths可以作为img标签的src属性显示图片
                file = res.tempFilePaths[0];
                var index1 = file.lastIndexOf(".");
                var index2 = file.length;
                filename = file.substring(index1, index2);//后缀名 
                imgData[upIndex].upImg = file;
                wx.request({
                    url: 'https://www.aftdc.com/businessapp/Enter/getOss',
                    method: 'POST',
                    data: {
                        token: token,
                        phone: phone,
                        dir: dir
                    },
                    header: { "Content-Type": "application/x-www-form-urlencoded" },
                    success: function (res) {
                        if (res.data.res == 1) {
                            var response = res.data.response;
                            imgData[upIndex].img = response['dir'] + Date.parse(new Date()) + '0' + Math.round(Math.random() * 1000000) + filename;
                            //上传图片
                            wx.uploadFile({
                                url: response['host'],
                                filePath: file,
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
    //----------------------  提交 下一步 -----------------
    formSubmit: function (e) {
        //--------------- 检测表单是否为空 ---------------
        //如果要改变上传数据的名字，改变data对应数据中的 name 
        var infoData = this.data.infoData;//页面数据
        var formData = e.detail.value;//-------------------提交表单数据
        var allowIndex = this.data.allowIndex;//判断行业资质
        var allowVal = this.data.infoData[9]['val'];//判断行业资质
        for (var i in formData) {
            if (!allowIndex || !allowVal) {
                if (i == 'allowType' || i == 'allowName' || i == 'allowNumb' || i == 'allowAdres' || i == 'allowPeople' || i == 'allowImg') {
                    continue;
                }
            }
            var txt = formData[i];
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
                    icon: 'none',
                    duration: 1200
                })
                return false;
            }
        }

        //--------------- 证件类型（身份证，身份证名，身份证号） ---------------
        if (formData.cardClasfly == '' || formData.bankUserName == '' || formData.IdentityNo == '') {
            wx.showToast({
                title: '身份证未识别',
                icon: 'loading',
                duration: 1200
            })
            return false;
        }
        var idCardValue = formData.cardClasfly;
        var bankUserName = formData.bankUserName;
        var IdentityNo = formData.IdentityNo;

        //--------------- 银行数据（银行卡号，银行卡名，银行ID） ---------------
        if (formData.bankNo == '' || formData.bankName == '') {
            wx.showToast({
                title: '银行卡错误',
                icon: 'loading',
                duration: 1200
            })
            return false;
        }
        var bankNo = formData.bankNo;
        var bankName = formData.bankName;
        var bankId = this.data.bankId;

        //--------------- 主体资质（证件类型，单位名称，注册号，注册地址，法定代表人，时间） ---------------
        if (formData.unitType == '' || formData.unitName == '' || formData.unitNumb == '' || formData.unitAdres == '' || formData.unitPeople == '') {
            wx.showToast({
                title: '主体资质未识别',
                icon: 'loading',
                duration: 1200
            })
            return false;
        }
        var unitStartTime = this.data.unitStartTime;
        var unitEndTime = this.data.unitEndTime;
        if (this.data.dateRadio == '长期有效') {
            var data = 0;
        } else {
            var data = 1;
            if (unitStartTime == '开始时间' || unitEndTime == '结束时间') {
                wx.showToast({
                    title: '请完善时间',
                    icon: 'loading',
                    duration: 1200
                })
                return false
            }
            var stringStartTime = Date.parse(new Date(unitStartTime.replace(/-/g, '/')));
            var stringEndTime = Date.parse(new Date(unitEndTime.replace(/-/g, '/')));
            if (stringStartTime > stringEndTime) {
                wx.showToast({
                    title: '时间格式错误',
                    icon: 'loading',
                    duration: 1200
                })
                return false
            }
        }
        var businessLicense = {
            unitType: formData.unitType,
            unitName: formData.unitName,
            registerNum: formData.unitNumb,
            registerAddress: formData.unitAdres,
            name: formData.unitPeople,
            data: data,
            startTime: unitStartTime,
            endTime: unitEndTime,
        }

        //--------------- 行业资质（证件类型，单位名称，注册号，注册地址，法定代表人，时间） ---------------
        if (allowIndex || allowVal) {
            if (formData.allowType == '' || formData.allowName == '' || formData.allowNumb == '' || formData.allowAdres == '' || formData.allowPeople == '') {
                wx.showToast({
                    title: '行业资质未识别',
                    icon: 'loading',
                    duration: 1200
                })
                return false;
            }
            var allowStartTime = this.data.allowStartTime;
            var allowEndTime = this.data.allowEndTime;
            if (this.data.allowRadio == '长期有效') {
                var data = 0;
            } else {
                var data = 1;
                if (allowStartTime == '开始时间' || allowEndTime == '结束时间') {
                    wx.showToast({
                        title: '请完善时间',
                        icon: 'loading',
                        duration: 1200
                    })
                    return false
                }
                var stringStartTime = Date.parse(new Date(allowStartTime.replace(/-/g, '/')));
                var stringEndTime = Date.parse(new Date(allowEndTime.replace(/-/g, '/')));
                if (stringStartTime > stringEndTime) {
                    wx.showToast({
                        title: '时间格式错误',
                        icon: 'loading',
                        duration: 1200
                    })
                    return false
                }
            }
            var otherLicense = {
                allowType: formData.allowType,
                unitName: formData.allowName,
                registerNum: formData.allowNumb,
                registerAddress: formData.allowAdres,
                name: formData.allowPeople,
                data: data,
                startTime: allowStartTime,
                endTime: allowEndTime,
            }
            var otherLicenseName = formData.allowType;
        }

        //--------------- 图片数据（正面照，方面照，手持正面照，银行卡，主体资质，行业资质） ---------------
        //检测图片
        var imgData = this.data.imgData;
        var imgs = {};//----------------------------  图片路径
        var localParts = {};//----------------------------  本地路径
        for (var k in imgData) {
            var name = imgData[k].name
            // if (!allowIndex || !allowVal) {
            //   if (name == 'allowImg') {
            //     continue;
            //   }
            // }
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
            imgs[name] = imgData[k].img
            localParts[name] = imgData[k].upImg;
        }
        var imgArr = [
            { img: imgs['faceImg'], localPart: localParts['faceImg'] },
            { img: imgs['backImg'], localPart: localParts['backImg'] },
            { img: imgs['handImg'], localPart: localParts['handImg'] },
            { img: imgs['bankImg'], localPart: localParts['bankImg'] },
            { img: imgs['unitImg'], localPart: localParts['unitImg'] },
        ]
        if (allowIndex || allowVal) {
            imgArr.push({ img: imgs['allowImg'], localPart: localParts['allowImg'] });
        }

        //--------------- 其他数据（phone，token） ---------------
        var phone = this.data.phone;
        var token = this.data.token;
        var that = this
        wx.showLoading({
            title: '提交中',
        })
        wx.request({
            url: 'https://www.aftdc.com/businessapp/Enter/enter_secondStep',
            method: 'POST',
            data: {
                phone: phone,
                token: token,
                idCardValue: idCardValue,
                bankUserName: bankUserName,
                IdentityNo: IdentityNo,
                bankNo: bankNo,
                bankName: bankName,
                bankId: bankId,
                businessLicense: JSON.stringify(businessLicense),
                otherLicense: JSON.stringify(otherLicense),
                otherLicenseName: otherLicenseName,
                img: JSON.stringify(imgArr)
            },
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            success: function (res) {
                var ok = that.data.ok;
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
                                    url: '../scheme/scheme?phone=' + that.data.phone + '&token=' + that.data.token,
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
    },
})