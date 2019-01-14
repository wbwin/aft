var app=getApp()
Page({
  data: {
  mealNumb: 6,
  electNumb:6,
  enlargeBox:false
  },
  price:function(){
    var groupId=this.data.groupId
    wx.navigateTo({
			url: '../buyVoucher/buyVoucher',
    })
  },
  tuijian:function(e)
  {
    var shopId = e.currentTarget.dataset.shopid;
    var groupId = e.currentTarget.dataset.groupid;
    wx.navigateTo({
      url: '../foodDetail/foodDetail?shopId='+shopId+'&groupId='+groupId,
    })
  },
  onLoad: function (options) {
    var shopId=options.shopId
    var groupId = options.groupId
    var location = app.globalData.location
    this.setData({
      shopId: shopId,
      groupId: groupId
    })
    var that=this
    wx.request({
      url: 'https://www.aftdc.com/wxapp/Order/foodDetail',
      data:{
        shopId:shopId,
        groupId:groupId,
        lat:  location.latitude,
        lng: location.longitude
      },
      method:'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success:function(res){
        that.setData({
          arr:res.data,
					groupsLen: res.data.groups.length,
          mealYes: res.data.mealYes,
					group: res.data.group
        })
				wx.setStorageSync('voucherInfo', that.data.group)
        if (res.data.shops){
          that.setData({
            shopsNum: res.data.shops.length
          })
        }
      }
    })
  },
  goallpj:function(e){
    var shopId=this.data.shopId
    wx.navigateTo({
      url: '../allpj/allpj?shopId='+shopId,
    })
  },
  chooseGroup:function(e){
    var index = e.currentTarget.dataset.index
		this.data.group = this.data.arr.groups[index]
		wx.setStorageSync('voucherInfo', this.data.group)
		this.setData({
			group: this.data.group,
			mealYes: index
		})
  },
//套餐
  mealMore:function(e){
    var mealNumb = this.data.mealNumb;
    mealNumb = mealNumb>6?6:100;
    this.setData({
      mealNumb: mealNumb,
    })
  },
  //更多推荐
  electMore:function(){
    this.setData({
      electNumb:100,
    })
  },
 
  //拨打商家电话
  markPhone: function () {
    var arr= this.data.arr
    wx.makePhoneCall({
      phoneNumber: arr.shop.shopTel //电话号码 
    })
  },

  //点击放大图片
  enlargeImg: function (e) {
    var src = e.currentTarget.dataset.src;
    var index = e.currentTarget.dataset.index;
    if (!Boolean(src)){
      src = this.data.topImg
    }

    this.setData({
      enlargeSrc: src,
      enlargeBox: true,
      enlargeNumb: index,
    })
  },
  enlargeClose: function (e) {
    this.setData({
      enlargeBox: false,
    })
  },
  Imgchange:function(e){
    var index = e.detail.current
    console.log(detail)
  }

})