var app = getApp();
var MD5Util = require('../../../../utils/md5.js');
Page({

  data: {
    isShare:1,
    payStatus:0,
		onshow:false
  },

  onLoad: function (options) {
		this.data.shopId = options.shopId
		this.data.shareId = options.shareId
    var userId = wx.getStorageSync('usersInfo').userId
    if (!userId){
      wx.navigateTo({
        url: '../author/author',
      })
    }
  },
	onShow:function(){
		if (this.data.onshow){
			this.onPullDownRefresh()
		}
    this.setData({
      userId:wx.getStorageSync('usersInfo').userId
    })
	},
  onReady:function(){
    
		var that = this
		wx.request({
      url: 'https://www.aftdc.com/wxapp/Shop/addWxFriend',
			data: {
				shareId: that.data.shareId,
				shopId: that.data.shopId
			},
			header: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			method: 'post',
			success: function (res) {
				if (res.data.res == 1) {
					that.setData({
						shareOrder: res.data.shareOrder,
						friendName: res.data.friendName,
						shop: res.data.shop,
						num: res.data.num,
						id: res.data.id,
						onshow:true,
						payStatus: res.data.payStatus						
					})
				}else{
					that.setData({
						isShare:0,
						payStatus: res.data.payStatus
					})
				}
			}
		})
  },
	//不拼了
  noShare: function (e) {
    var id = e.currentTarget.dataset.id;
    var that = this
    var timestamp = (Date.parse(new Date())) / 1000
    var sign = MD5Util.sign(timestamp)
    wx.showModal({
      title: '提示',
      content: '确定要退出该拼单吗',
      success: function (res) {
        if (res.confirm) {
					wx.request({
            url: 'https://www.aftdc.com/wxapp/Shop/delFriend',
						data: {
              sign: sign,
              timestamp: timestamp,
              token: wx.getStorageSync('usersInfo').token,
              id: id
						},
						header: {
							"Content-Type": "application/x-www-form-urlencoded"
						},
						method: 'post',
						success: function (res) {
							if (res.data.res == 1) {
                that.onPullDownRefresh()
								wx.navigateBack()
							}
						}
					})
        }
      }
    })
  },
	//和他一样
	sameFood:function(e){
    
		var friendId = e.currentTarget.dataset.friendid;
		var id = this.data.id
		var that = this
    var timestamp = (Date.parse(new Date())) / 1000
    var sign = MD5Util.sign(timestamp)
		wx.request({
      url: 'https://www.aftdc.com/wxapp/Shop/sameFood',
			data: {
        sign: sign,
        timestamp: timestamp,
        token: wx.getStorageSync('usersInfo').token,
        userName: wx.getStorageSync('usersInfo').userName,
				shareId: that.data.shareId,
				friendId: friendId
			},
			header: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			method: 'post',
			success: function (res) {
        console.log(res.data)
				if (res.data.res == 1) {
					that.onPullDownRefresh()
				}
			}
		})
	},
	//去店铺选购
	addGoods: function (e) {
    var id = e.currentTarget.dataset.id;
		wx.navigateTo({
      url: '../order/order?shopId=' + this.data.shopId + '&id=' + id
		})
	},
	//下拉刷新
	onPullDownRefresh: function () {
		var that = this
    var timestamp = (Date.parse(new Date())) / 1000
    var sign = MD5Util.sign(timestamp)
		wx.request({
      url: 'https://www.aftdc.com/wxapp/Shop/getShare',
			data: {
        sign: sign,
        timestamp: timestamp,
        token: wx.getStorageSync('usersInfo').token,
				shareId: that.data.shareId,
        shopId: that.data.shopId,
			},
			header: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			method: 'post',
			success: function (res) {
				if (res.data.res == 1) {
					that.setData({
						shareOrder: res.data.shareOrder,
						num: res.data.num,
						payStatus: res.data.payStatus
					})
				}
				wx.hideNavigationBarLoading() //完成停止加载
				wx.stopPullDownRefresh() //停止下拉刷新
			}
		})
	}
})