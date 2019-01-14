var MD5Util = require('../../../../utils/md5.js');
var util = require('../../../../utils/util.js')
var app = getApp();
Page({

  data: {
    payFaceType: 0,
    second: 60,
    countdown: 'countdown',
    phoneY:true,
    phoneTxt:false,
    codesTxt:false,
  },
  onLoad: function (options) {
    wx.login({
    })
    this.data.userId = wx.getStorageSync('usersInfo').userId
  },
  onReady: function () {
    var userId = this.data.userId
    var that=this
    wx.request({
      url: 'https://www.aftdc.com/wxapp/Adduser/idImg',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        userId: userId
      },
      method: "POST",
      success: function (res) {
        if (res.data.res == 1) {
          that.setData({
            isOpen: 1
          })
        } else {
          that.setData({
            isOpen: 0,
            payFaceType: res.data.payFaceType
          })
        }
      }
    })
  },
  upId:function(){
    var yzm=this.data.yzm
    if(!yzm){
      util.aftModal({
        title: '手机验证失败',
        icon:'loading'
      })
      return false
    }
    var userId = this.data.userId
    var phoneNumber = this.data.phonenum
    var oid = wx.getStorageSync('usersInfo').openid
    var payFaceType = this.data.payFaceType
    var that=this
    var sign = MD5Util.sign()
    if (payFaceType=='0')
    {
        wx.request({
          url: 'https://www.aftdc.com/wxapp/Order/payFace',
          data:{
            userId:userId,
            openId: oid,
            money:0.01,
            sign: sign,
            timestamp: (Date.parse(new Date())) / 1000,
            token: wx.getStorageSync('usersInfo').token,
          },
          method:'POST',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success:function(res)
          {
  
            wx.requestPayment({
              timeStamp: res.data.timestamp,
              nonceStr: res.data.nonce_str,
              package: res.data.pkg,
              signType: 'MD5',
              paySign: res.data.signc,
              success: function (row)
               {
                  that.setData({
                    payFaceType:1
                  })
               }
              })
          }
        })
    }
    else{
    wx.chooseImage({
      count: 1, 
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['camera'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        wx.showLoading({
          mask: true,
          title: "正在上传",
        })
        wx.uploadFile({
          url: 'https://www.aftdc.com/wxapp/Adduser/idImg',
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            "Content-Type": "multipart/form-data",
            'userId': userId,
            'userPhone': phoneNumber
          },
          header: { "Content-Type": "multipart/form-data" },
          success: function (res) {
            wx.hideLoading()
            util.aftModal({
              title: '上传成功',
            })
            that.setData({
              isOpen: 1
            })
          },
        })
      }
    })
    }
  },
  getPhoneNumber: function (e) {
    // var that = this;
    // wx.login({
    //   success: function (r) {
    //     var code = r.code
    //     var iv = e.detail.iv
    //     var encryptedData = e.detail.encryptedData
    //     wx.request({
    //       url: 'https://www.aftdc.com/index.php/wxapp/addUser/getUserPhone',
    //       method: "POST",
    //       header: { "Content-Type": "application/x-www-form-urlencoded" },
    //       data: {
    //         code: code,
    //         encryptedData: encryptedData,
    //         iv: iv
    //       },
    //       success: function (res) {
    //         if (res.data == '-41003'){
    //           util.aftModal({
    //             title: '请重试',
    //             icon:'loading'
    //           })
    //         }else{
    //           that.setData({
    //             phoneNumber: res.data.phoneNumber
    //           })
    //         }
    //       }
    //     })
    //   }
    // })

  },
  //验证码
  countdown: function () {
    var phone = this.data.phone
    if (!(/^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/.test(phone))) {
      util.aftModal({
        title: '手机号错误',
        icon: 'loading'
      })
      return false;
    }
    var second = this.data.second
    var that = this
    var sign = MD5Util.sign()
    if (phone && second == 60) {
      that.setData({
        countdown: ''
      });
      that.second()//60s倒计时
      wx.request({
        url: 'https://www.aftdc.com/wxapp/Order/send',
        method: 'POST',
        data: {
          phone: phone,
          sign: sign,
          timestamp: (Date.parse(new Date())) / 1000,
          token: wx.getStorageSync('usersInfo').token,
        },
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        success: function (res) {
          that.setData({
            //返回验证码
            code: res.data.code
          })
        }
      })
    }
  },
  //验证验证码
  checkyzm: function (e) {
    var yzm = e.detail.value
    var code = this.data.code
    if (yzm == code) {
      this.setData({
        yzm: true,
        phonenum: this.data.phone
      })
    } else {
      this.setData({
        yzm: false
      })
    }
    var codesTxt=false
    if (yzm.length>0){
      codesTxt=true;
    }
   this.setData({
     codesTxt: codesTxt,
   })

  },
  second: function () {
    var second = this.data.second
    var that = this
    if (second > 0) {
      var time = setTimeout(function () {
        that.setData({
          second: second - 1
        });
        that.second();
      }, 1000)
    } else {
      that.setData({
        second: 60,
        countdown: 'countdown'
      });
    }
  },
  code: function (c) {
    var int = c.detail.value
    var code = this.data.code
    if (int == code) {
      this.setData({
        tip: '正确',
        ccode: true,
        countdown: '1'
      })
    } else {
      this.setData({
        tip: '验证码错误',
        ccode: false
      })
    }
  },


  phone:function(e){
    this.data.phone=e.detail.value;
    var phone = e.detail.value;
    var state=true
    var phoneTxt=false
  
    if(phone.length>0){
      if ((/^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/.test(phone))) {
        state = false
      }
        phoneTxt=true
    }
    this.setData({
      phoneY: state,
      phoneTxt: phoneTxt,
    })
 
  },
  //刷脸
  face:function(){
    var phone = this.data.phone
    if (!(/^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/.test(phone))) {
      util.aftModal({
        title: '手机号错误',
        icon: 'loading'
      })
      return false;
    }
    var that = this
    var sign = MD5Util.sign()
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['camera'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        wx.showLoading({
          mask: true,
          title: "正在验证",
        })
        wx.uploadFile({
          url: 'https://www.aftdc.com/wxapp/Order/face',
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            "Content-Type": "multipart/form-data",
            'userPhone': phone,
            'sign': sign,
            'timestamp': (Date.parse(new Date())) / 1000,
            'token': wx.getStorageSync('usersInfo').token,
          },
          header: { "Content-Type": "multipart/form-data" },
          success: function (res) {
            console.log(res)
            var obj = JSON.parse(res.data); 
            console.log(obj)            
            if (obj.confidence>80){
              wx.hideLoading()
              util.aftModal({
                title: '刷脸成功',
                icon:'12'
              })
            }else{
              wx.hideLoading()
              util.aftModal({
                title: '刷脸失败',
                icon: 'loading'
              })
            }
          },
        })
      }
    })
  },

  closeTxt: function (e) {
    var index = e.currentTarget.dataset.index;
    if (index == 1) {
      this.setData({
         phone:'',
        phoneNumber: '',
        phoneY: true,
        phoneTxt: false,
      })
    }
    else if (index == 2) {
      this.setData({
        yzmNumb: '',
        codesTxt: false,
        yzm:false,
      })
    }

  }


})