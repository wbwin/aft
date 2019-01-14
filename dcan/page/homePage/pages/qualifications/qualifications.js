var app = getApp();
var MD5Util = require('../../../../utils/md5.js');
Page({
  data: {
     maxSrc:'',
     maxSrcBox:false,
  },

  onLoad: function (options) {
    var shopId = options.shopId;
    var that = this;
    var timestamp = (Date.parse(new Date())) / 1000
    var sign = MD5Util.sign(timestamp)
    if (shopId){
      wx.request({
        url: 'https://www.aftdc.com/wxapp/Shop/supervision',
        data:{
          sign: sign,
          timestamp: timestamp,
          token: wx.getStorageSync('usersInfo').token,
          shopId:shopId
          },
        method:'post',
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        success:function(res){
          var all = [];
          all[0] = "https://image.aftdc.com/" + res.data.unitImg;//门脸照
          if (res.data.allowImg){
            all[1] = "https://image.aftdc.com/" + res.data.allowImg;//门脸照
          }
          that.setData({
            info:all,
          }) 
        }
      })
      
    }
  },

 //点击放大图片
  enlargeImg: function (e) {
    var src = e.currentTarget.dataset.src;
    // this.setData({
    //   maxSrcBox:true,
    //   maxSrc: src,
    // })
    var imgList = this.data.info;
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },

  // hide:function(){
  //   this.setData({
  //     maxSrcBox: false,
  //   })
  // },
})










