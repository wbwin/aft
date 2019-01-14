var app=getApp();
Page({

  data: {
    nameValue:"小伙子",//input的value
    name:"小伙子",//显示的名字
    change:true,
  },

  onLoad: function (options) {
    var nickName=options.nickName
    var imagesrc = options.imagesrc
    this.setData({
      nickName: nickName,
      imagesrc: imagesrc,
    })
  },

  onShow: function () {
  
  },
  //上传头像
 head:function(e){
   var that=this
  wx.chooseImage({
    count:1,
    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有 
    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    success: function(res) {
      var tempFilePaths = res.tempFilePaths

      that.setData({
        imagesrc: tempFilePaths
      })
      wx.showLoading({
        mask:true,
        title: "正在上传头像",
        
      })
      var imagesrc = that.data.imagesrc
      var userId = wx.getStorageSync('usersInfo').userId
      wx.uploadFile({
        url: 'https://www.aftdc.com/wxapp/Adduser/updhead',
        filePath: imagesrc[0],
        name: 'file',
        formData: {
          "Content-Type": "multipart/form-data",
          'userId': userId
        },
        header: { "Content-Type": "multipart/form-data" },
        success: function (res) {
          console.log(res.data)
          if(res.data==1)
          {
            wx.hideLoading()
          }
        },

      })
    },
  })
 
 },
  names:function(e){
    var change = this.data.change
    this.setData({
      change: !change,
    })
  },
 
bindinput:function(e){
  var value=e.detail.value
  this.setData({
    nameValue: value
  })
},

 but:function(){
   var nameValue = this.data.nameValue
   var userId= wx.getStorageSync('usersInfo').userId
   var len=0

   for (var i = 0; i < nameValue.length; i++) {
     if (nameValue.charCodeAt(i) > 127 || nameValue.charCodeAt(i) == 94) {
       len += 2;
     } else {
       len++;
     }
   }
   var that = this
  if(len<4){
  
    util.aftModal({
      title:"不能小于4个字符",
      icon: "loading",
      duration: 1200,
      success:function(){
        return false;
      }
    }) 
  } else if (len > 16){
    util.aftModal({
      title: "不能大于16个字符",
      icon: "loading",
      duration:1200,
      success: function () {
        return false;
      }
    }) 
  }else{
    wx.request({
      url: 'https://www.aftdc.com/wxapp/Adduser/updUserName',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        userId: userId,
        nameValue: nameValue
      },
      method: "POST",
      success:function(res)
      {
          if(res.data==1)
          {
            util.aftModal({
              title: "修改成功",
              icon: "success",
              duration: 1000,
              success: function () {
                that.setData({
                  change: true,
                  nickName: nameValue,
                })
              }
            })
          }
      }
    })
  
  }
 
 },
 //收货地址
 checkadd: function () {
   wx.chooseAddress({
     success: function (res) { },
     fail: function (err) { }
   })
 },
 
})
