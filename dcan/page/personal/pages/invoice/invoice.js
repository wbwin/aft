var app = getApp();
var util = require('../../../../utils/util.js')
var MD5Util = require('../../../../utils/md5.js');
Page({

  data: {
    choose:1,
    type1:true,
    type2:false,
    back:false,
    from:'',
  },
  onLoad: function (options) {
    var from = options.from //如果等于1，说明从商家入住跳转过来
    this.setData({
      from: from
    })
    this.data.userId = wx.getStorageSync('usersInfo').userId
	  var userId = wx.getStorageSync('usersInfo').userId
    var that=this
    var timestamp = (Date.parse(new Date())) / 1000
    var sign = MD5Util.sign(timestamp)
    wx.request({
      url: 'https://www.aftdc.com/wxapp/Mine/seeInvoice',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        sign: sign,
        timestamp: timestamp,
        token: wx.getStorageSync('usersInfo').token,
      },
      method: "POST",
      success: function (res) {
        if(res.data!=0){
          that.setData({
            da: res.data
          })
        }else{
          that.setData({
            tips: '暂无发票抬头'
          })
        }
      }
    })
  },
  danwei:function(){
    this.setData({
      choose:1,
      type1: true,
      type2: false
    })
  },
  geren: function () {
    this.setData({
      choose:2,
      type1: false,
      type2: true
    })
  },
  //添加抬头
  add:function(){
    this.setData({
      choose: 1,
      hid1: false,
      hid2: false,
      type1: true,
      type2: false,
      back: true,
      arr: null
    })
  },
  //保存
  formSubmit:function(e){
    var userId = this.data.userId
    var dat = e.detail.value
    var data = JSON.stringify(dat)
    if(this.data.choose==1){
      var typ ='单位'

      var em = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
      var bChk = em.test(dat.email);
      if (!bChk) {
        util.aftModal({
          title: '请正确填写邮箱',
          icon: 'loading'
        })
        return false;
      }

      if (!(/^[A-Z0-9]{15}$|^[A-Z0-9]{17}$|^[A-Z0-9]{18}$|^[A-Z0-9]{20}$/.test(dat.dutyNum))) {
        util.aftModal({
          title: '请正确填写税号',
          icon: 'loading'
        })
        return false;
      }

      if (!(/^(0\d{2,3}-?)?\d{7,8}$/.test(dat.comTel)) && !(/^((\+?86)|(\(\+86\)))?1[34578]\d{9}$/.test(dat.comTel))) {
        util.aftModal({
          title: '请正确填写电话',
          icon: 'loading'
        })
        return false;
      }
     
    
      // if (!(/^(\d{16}|\d{19})$/.test(dat.bankNo))) {
      //   util.aftModal({
      //     title: '请正确填写银行账号',
      //     icon: 'loading'
      //   })
      //   return false;
      // }

    }else{
      var typ = '个人'
      if (!(/^((\+?86)|(\(\+86\)))?1[34578]\d{9}$/.test(dat.phone))) {
        util.aftModal({
          title: '请正确填写手机号',
          icon: 'loading'
        })
        return false;
      }
      var em = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
      var bChk = em.test(dat.email);
      if (!bChk) {
        util.aftModal({
          title: '请正确填写邮箱',
          icon: 'loading'
        })
        return false;
      }
    }
    
    var timestamp = (Date.parse(new Date())) / 1000
    var sign = MD5Util.sign(timestamp)
    
    var that=this
    if(dat.trueName==''){
      util.aftModal({
        title: '抬头名称不能为空',
        icon:'loading'
      })
    }else{
      if(that.data.arr){
        wx.request({
          url: 'https://www.aftdc.com/wxapp/Mine/insert_invoice',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          data: {
            arr: data,
            type: typ,
            id:that.data.id,
            sign: sign,
            timestamp: timestamp,
            token: wx.getStorageSync('usersInfo').token,
          },
          method: "POST",
          success: function (res) {
            if(res.data.res == 1){
              that.setData({
                back: false
              })
            }
            util.aftModal({
              title: '保存成功',
              icon: '12'
            })
          }
        })
      }else{
        var timestamp = (Date.parse(new Date())) / 1000
        var sign = MD5Util.sign(timestamp)
        wx.request({
          url: 'https://www.aftdc.com/wxapp/Mine/insert_invoice',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          data: {
            arr: data,
            type: typ,
            sign: sign,
            timestamp: timestamp,
            token: wx.getStorageSync('usersInfo').token,
          },
          method: "POST",
          success: function (res) {
            console.log(res)
            if(that.data.da!=null){
              that.setData({
                //da: that.data.da.concat(res.data),
                da: res.data,
                tips:null,
                back: false
              })
            }else{
              var da=[]
              that.setData({
                da: da.concat(res.data),
                tips:null,
                back: false
              })
            }
            util.aftModal({
              title: '添加成功',
              icon: '12'
            })
          }
        })
      }
    }
  },
  //编辑抬头
  edit: function (e) {
    var id = e.currentTarget.dataset.id
    var da=this.data.da
    this.setData({
      back: true,
      id:id
    })
    for (var i = 0; i < da.length;i++){
      if(da[i]['id']==id){
        var arr=da[i];
        break;
      }
    }
    if(arr.type=='个人'){
      this.setData({
        arr: arr,
        choose: 2,
        type1: false,
        type2: true,
        hid1:true,
        hid2:false
      })
    }else{
       this.setData({
        arr: arr,
        choose: 1,
        type1: true,
        type2: false,
        hid1:false,
        hid2: true
      })
    }
  },
  //长按删除抬头
  bindTouchStart: function (e) {
    this.startTime = e.timeStamp;
  },
  bindTouchEnd: function (e) {
    this.endTime = e.timeStamp;
  },
  deletclang: function (e) {
    var id = e.currentTarget.dataset.id
    var that = this
    var timestamp = (Date.parse(new Date())) / 1000
    var sign = MD5Util.sign(timestamp)
    wx.showModal({
      title: '提示',
      content: '确定删除该抬头？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: 'https://www.aftdc.com/wxapp/Mine/delInvoice',
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
              id:id,
              sign: sign,
              timestamp: timestamp,
              token: wx.getStorageSync('usersInfo').token,
            },
            method: "POST",
            success: function (res) {
              if (res.data != 0 && res.data!=null){
                that.setData({
                  da: res.data
                })
                util.aftModal({
                  title: '删除成功',
                  icon: '12',
                  duration: 1000
                })
              }else{
                that.setData({
                  da: null,
                  tips:"暂无发票抬头"
                })
              }
            }
          })
        }
      }
    })
  },
  //选择发票
  chooseinvoice:function(e){
    if (this.endTime - this.startTime < 350) {
      var billId = e.currentTarget.dataset.id
      var name = e.currentTarget.dataset.name
      var index = e.currentTarget.dataset.index
      app.globalData.billId = billId;  //存储数据到app对象上
      if(this.data.from==1){
        this.updataApplyshop(billId)
      }
      wx.setStorageSync('billMessage', JSON.stringify(this.data.da[index]))
      wx.navigateBack();
    }
  },
  // 记录发票信息到商家入住
  updataApplyshop(billId){
    var timestamp = (Date.parse(new Date())) / 1000
    var sign = MD5Util.sign(timestamp)
    wx.request({
      url: 'https://www.aftdc.com/wxapp/Service/updataApplyshopBillId',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        billId: billId,
        sign: sign,
        timestamp: timestamp,
        token: wx.getStorageSync('usersInfo').token,
      },
      method: "POST",
      success: function (res) {
        if (res.data.res ==1) 
          wx.showToast({title: '已选择'})
      }
    })
  },
  cancel: function () {
    this.setData({
      back: false
    })
  }
})