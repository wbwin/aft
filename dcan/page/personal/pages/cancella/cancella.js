// pages/index/cancella.js
Page({

  data: {
   togle:false,
   reasonSure: '请选择原因',
   reason:[
     "有其他的账号",
     "感觉不好用",
     "拖慢手机运行",
     "就是不想要",
     "感觉服务不好",
     "配送太慢了",
     "不喜欢界面的风格",
   ]
  },

  togleFn: function (e) {
    var togle = !this.data.togle;
    this.setData({
      togle: togle,
    })
  },
  choice: function (e) {
    var val = e.currentTarget.dataset.txt;
    this.setData({
      reasonSure: val,
      togle: false,
    })
  },




  onLoad: function (options) {
  
  },


  
})