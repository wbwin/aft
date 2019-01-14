// pages/index/openmage.js
Page({

  data: {
    infoData:[
      {
        name: '门脸照片',
        img:"https://image.aftdc.com/images/packageA/shopImg2.jpg",
        txt:'需拍出完整门匾、门框（建议正对门店2米处拍摄）'
      },
      {
        name: '店内照片',
        img: "https://image.aftdc.com/images/packageA/shopImg1.jpg", 
        txt: '需真实反应用餐环境（收银台、用餐桌椅）'
      },
      {
        name: '商户LOGO',
        img: "https://image.aftdc.com/images/packageA/logo.png",
        txt: '需体现您店铺的特色，可吸引更多的用户进店点餐'
      },
      {
        name: '身份证照片',
        img: "https://image.aftdc.com/images/packageA/papers1.jpg",
        txt: '1)需清晰展示人物五官和身份证文字信息； 2)不可自拍,不可只拍身份证'
      },
      {
        name: '营业执照',
        img: "https://image.aftdc.com/images/packageA/setTyps.jpg",
        txt: '1)需文字清晰、边框完整、露出国徽； 2)拍复印件需加盖印章，可用有效特许证代替'
      },
      {
        name: '行业许可证',
        img: "https://image.aftdc.com/images/packageA/setAllow.jpg",
        txt: '1)需文字清晰、边框完整； 2)可用食品流通许可证等其它有效证件代替'
      },
    ],
    phone: '',
    token: '',
  },


  onLoad: function (options) {
    this.setData({
      phone: options.phone,
      token: options.token,
    })
  },

  nextBut: function (e) {
    var phone = this.data.phone;
    var token = this.data.token;
    wx.navigateTo({
      url: '../settInfo/settInfo?phone=' + phone + '&token=' + token,
      // url: '../wait/wait',
    })
  },
})