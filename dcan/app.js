App({
  onLaunch: function() {
    //如果有userId，获取最新的token
    var userId = wx.getStorageSync('usersInfo').userId
    var that = this
    if(userId) {
      wx.getSystemInfo({
        success: function (res) {
          wx.request({
            url: 'https://www.aftdc.com/wxapp/addUser/getToken',
            method: "POST",
            data: {
              userId: userId,
              model: res.model
            },
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
              if(res.data.res == 1){
                var token = res.data.token
                var usersInfo = wx.getStorageSync('usersInfo')
                usersInfo.token = token
                wx.setStorageSync('usersInfo', usersInfo)
              }else{
                wx.removeStorageSync('usersInfo')
              }
            }
          })
        }
      })
    }
  },
  
  globalData: {
    userInfo: null,
    usersInfo: null,
    location: null,
    userId: null
  }
})