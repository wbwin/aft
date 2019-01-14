var MD5Util = require('../../../../utils/md5.js')
var app = getApp();
var util = require('../../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
      share: ['是', '否'],
      index:0,
      contact:[],
      Canform:0,
      text:'',
      title:'',
      coverImg:[],
      Img:[],
      coverType:["一张小图","一张大图","三张小图","没有图片","有视频"],
      coverTypeIndex:0,
      show:0,
      video:[],
      contentFileHouZui:[],
      coverImgHouZui:[],
      videoHouZui:[],
      files:'',
      tt:[[],[],[]]
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

    shareChange:function(e){
            this.setData({ index: e.detail.value })
    },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  upCoverFile:function(){
      var that = this
      wx.chooseImage({
          count: 1,
          sizeType: ['compressed'],
          sourceType: ['album', 'camera'],
          success: function (res) {
              var imgPaths = res.tempFilePaths
  
              var index1 = imgPaths[0].lastIndexOf(".");
              var index2 = imgPaths[0].length;
              that.data.coverImgHouZui.push((imgPaths[0].substring(index1, index2)));//后缀名  1为上传封面图片


              if (that.data.video.length && (imgPaths[0].substring(index1, index2)) == '.mp4') {
                  wx.showToast({
                      title: '视频只能上传一个',

                      icon: 'loading',

                      duration: 2000
                  })
                  return false
              }

              that.data.coverImg.push(imgPaths[0])
              that.setData({
                  coverImg: that.data.coverImg
              })
          }
      })
  },


  upFile: function () {
      var that = this
      wx.chooseImage({
          count: 1,
          sizeType: ['compressed'],
          sourceType: ['album', 'camera'],
          success: function (res) {
              var imgPaths = res.tempFilePaths
             
              var index1 = imgPaths[0].lastIndexOf(".");
              var index2 = imgPaths[0].length;
              that.data.contentFileHouZui.push((imgPaths[0].substring(index1, index2)));//后缀名   1为上传内容图片

              if (that.data.video.length && (imgPaths[0].substring(index1, index2)) == '.mp4') {
                  wx.showToast({
                      title: '视频只能上传一个',

                      icon: 'loading',

                      duration: 2000
                  })
                  return false
              }


              that.data.Img.push(imgPaths[0])
              that.setData({
                  Img: that.data.Img
              })
          }
      })
  },


  upVideo: function () {
      if(this.data.video.length)
       {
          wx.showToast({
              title: '视频只能上传一个',

              icon: 'loading',

              duration: 2000
          })
          return false
        }
      var that = this
      wx.chooseImage({
          count: 1,
          sizeType: ['compressed'],
          sourceType: ['album', 'camera'],
          success: function (res) {
              var imgPaths = res.tempFilePaths
        
              var index1 = imgPaths[0].lastIndexOf(".");
              var index2 = imgPaths[0].length;
              var q = imgPaths[0].substring(index1, index2)
              that.data.videoHouZui.push(q);//后缀名   2为上传视频
              if (q!='.mp4') 
              {
                  wx.showToast({
                      title: '请上传视频',

                      icon: 'loading',

                      duration: 2000
                  })
                  return false
              }

              that.data.video.push(imgPaths[0]);//后缀名   2为上传视频
              that.setData({
                  video: that.data.video
              })
          }
      })
  },

  
  formSubmit: function (e) {
      var that = this
      var files = ""
      if (this.data.contentFileHouZui.length || this.data.coverImgHouZui.length || this.data.videoHouZui.length) {
          var tt = { Img: this.data.Img ,  coverImg: this.data.coverImg , video:this.data.video};
                      var timestamp = (Date.parse(new Date())) / 1000
                      var sign = MD5Util.sign(timestamp)
                      wx.request({
                          url: 'https://www.aftdc.com/wxapp/article/articleImgToken',
                          data: {
                              sign: sign,
                              timestamp: timestamp,
                              token: wx.getStorageSync('usersInfo').token,
                              contentFileHouZui: JSON.stringify(that.data.contentFileHouZui),
                              coverImgHouZui: JSON.stringify(that.data.coverImgHouZui),
                              videoHouZui: JSON.stringify(that.data.videoHouZui)
                          },
                          header: {
                              'content-type': 'application/x-www-form-urlencoded'
                          },
                          method: "POST",
                          success: function (res) {
                              var name = res.data.oss.name
                              that.setData({ files:name})
                              files = JSON.stringify(that.data.files)
                              for (var i in name)
                              {
                                 for(var j in i){
                                     if (name[i][j]){
                                   wx.uploadFile({
                                        url: res.data.oss.host,
                                        filePath: tt[i][j],
                                        name: 'file',
                                        formData: {
                                            "key": name[i][j],//图片的路径
                                            "policy": res.data.oss.policy,
                                            "OSSAccessKeyId": res.data.oss.accessid,
                                            'success_action_status': '200',
                                            'signature': res.data.oss.signature
                                        },
                                        header: { "Content-Type": "multipart/form-data" },
                                        success: function (res) {
                                            if (res.statusCode == 200) {
                                                
                                            }
                                         }
                                      })
                                    }
                                }
                            }
                          }
                      })
                  }
        
      setTimeout(function(){
                  var imgPaths = that.data.imgPaths
                  var timestamp = (Date.parse(new Date())) / 1000
                  if (that.data.index)
                     var isShare = 0
                  else
                      var isShare = 1
                  wx.request({
                      url: 'https://www.aftdc.com/wxapp/article/articleSend',
                      data: {
                          sign: sign,
                          timestamp: timestamp,
                          token: wx.getStorageSync('usersInfo').token,
                          title: that.data.title,
                          content:that.data.text,
                          cover_type: parseInt(that.data.coverTypeIndex)+1,
                          files: files,
                          isShare: isShare
                      },
                      header: {
                          'content-type': 'application/x-www-form-urlencoded'
                      },
                      method: "POST",
                      success: function (res) {
                  if (res.data.res == 1) {
                      wx.showToast({

                          title: '提交成功',

                          icon: 'success',

                          duration: 2000

                      })
                      setTimeout(function () {
                          wx.navigateBack({})
                      }, 2000) //延迟时间
              }
          }
       })
     }, 2000)
  },
  getTest:function(e){
          this.setData({text: e.detail.value})

  },
  getTitle:function(e){
      this.setData({ title: e.detail.value })
  },

  coverTypeChange:function(e)
  {
      this.setData({ coverTypeIndex: e.detail.value, coverImg: [], Img: [], video: [], contentFileHouZui: [], coverImgHouZui: [], videoHouZui:[]})
  }
  ,

  delImg:function(e)
  {
      var index = e.target.dataset.index
      var type = e.target.dataset.type
      if (type=='coverImg')
      {
          this.data.coverImg.splice(index,1)
          this.data.coverImgHouZui.splice(index, 1)
          this.setData({ coverImg: this.data.coverImg, coverImgHouZui: this.data.coverImgHouZui})
      }
      if (type == 'Img')
      {
          this.data.Img.splice(index, 1)
          this.data.contentFileHouZui.splice(index, 1)
          this.setData({ Img: this.data.Img, contentFileHouZui: this.data.contentFileHouZui})
      }
      if (type == 'video') {
          this.data.video.splice(index,1)
          this.data.video.splice(videoHouZui, 1)         
          this.setData({ video: this.data.video, videoHouZui: this.data.videoHouZui})
      }
  }
})