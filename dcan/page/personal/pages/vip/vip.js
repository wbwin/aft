var util = require('../../../../utils/util.js')
var MD5Util = require('../../../../utils/md5.js');
var app = getApp()
Page({

  data: {
      sex: ['女', '男'],
      index:0,    //选中的性别下标
      time:'',    //选中的生日日期
      startDate:'',   //下拉生日开始日期
      endDate: '',    //下拉生日结束日期
      check:'', //是否已读并同意,
      checked:0,
      userPhone:'',
      time:'',
      name:'',
      shopName:'',
      shopImg:''
  },

  onLoad: function (options) {
      wx.setNavigationBarTitle({
          title: options.shopName
      })
      var shopId = options.shopId
      this.setData({ shopName: options.shopName, shopImg: options.shopImg})
      var that = this
      var nowDate = new Date();
      var year = nowDate.getFullYear();
      var month = nowDate.getMonth() + 1 < 10 ? "0" + (nowDate.getMonth() + 1)
          : nowDate.getMonth() + 1;
      var day = nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate
          .getDate();
      var dateStr = year + "-" + month + "-" + day;
      var startDate = (year-70) + "-" + month + "-" + day;
      this.setData({ endDate: dateStr, startDate: startDate, time: startDate})
      if (wx.getStorageSync('usersInfo').userId && wx.getStorageSync('usersInfo').userPhone)
      {
          this.setData({ userPhone: wx.getStorageSync('usersInfo').userPhone})
      }
  },


  //获取手机号
  getPhoneNumber: function (e) {
      var that = this
      wx.login({
          success: function (r) {
              var code = r.code
              setTimeout(function () {
                  var encryptedData = e.detail.encryptedData
                  var iv = e.detail.iv
                  console.log(e.detail)
                  wx.request({
                      url: 'https://www.aftdc.com/wxapp/Adduser/getUserPhone',
                      method: "POST",
                      header: { "Content-Type": "application/x-www-form-urlencoded" },
                      data: {
                          code: code,
                          encryptedData: encryptedData,
                          iv: iv,
                          userId:wx.getStorageSync('usersInfo').userId,
                      },
                      success: function (res) {
                          console.log(res)
                          if (res.data.res == 1) {
                              app.globalData.usersInfo.userPhone = res.data.phoneNumber
                              wx.setStorageSync('usersInfo', app.globalData.usersInfo)
                              that.setData({
                                  userPhone: res.data.phoneNumber
                              })
                              util.aftModal({
                                  title: '设置成功'
                              })
                          } else {
                              util.aftModal({
                                  title: '请重试',
                                  icon: 'loading'
                              })
                          }
                      }
                  })
              }, 200)
          }
      })
  },

  sexChange:function(e){
      this.setData({ index: e.detail.value})
  }
  ,
  bindDateChange:function(e)
  {
      this.setData({ time: e.detail.value })
  },
  formSubmit: function (e) {
      var that = this
      var timestamp = (Date.parse(new Date())) / 1000
      var sign = MD5Util.sign(timestamp)
      this.setData({ name: e.detail.value.name})
      if (!this.data.userPhone || e.detail.value.name.length==0) {

          wx.showToast({

              title: '请填写完整',

              icon: 'loading',

              duration: 1500

          })

          setTimeout(function () {

              wx.hideToast()

          }, 2000)

      } else if (this.data.userPhone.length != 11) {

          wx.showToast({

              title: '请输入11位手机号码!',

              icon: 'loading',

              duration: 1500

          })

          setTimeout(function () {

              wx.hideToast()

          }, 2000)

      } else if (!this.data.check) {

          wx.showToast({

              title: '请阅读声明',

              icon: 'loading',

              duration: 1500

          })

          setTimeout(function () {

              wx.hideToast()

          }, 2000)

      } else {

          wx.request({

              url: 'https://www.aftdc.com/wxapp/Mine/memberCardNeed',

              header: {

                  "Content-Type": "application/x-www-form-urlencoded"

              },

              method: "POST",

              data: {
                  sign: sign,
                  timestamp: timestamp,
                  token: wx.getStorageSync('usersInfo').token,
                  userPhone:that.data.userPhone,
                  name: that.data.name,
                  sex:that.data.index,
                  birthday: that.data.time
               },

              success: function (res) {

                 if(res.data.res==1)
                 {
                     wx.showToast({

                         title: '提交成功',

                         icon: 'success',

                         duration: 2000

                     })
                     setTimeout(function () {
                         wx.navigateBack({})
                     }, 2000) //延迟时间
                    
                 }
                 else{
                     wx.showToast({

                         title: '提交失败',

                         icon: 'loading',

                         duration: 1000

                     })
                 }

              }

          })

      }

  },

    checkbox:function(e){
        this.setData({check:e.detail.value})
    },

    memberCard:function()
    {
        wx.navigateTo({
            url: '../vip/memberCard',
        })
    },

    shengMing: function () {
        wx.navigateTo({
            url: '../vip/shengMing',
        })
    }
})