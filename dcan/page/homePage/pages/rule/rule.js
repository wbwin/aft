Page({

  data: {
    
  },

  togleFn: function (e) {
    var togle = !this.data.togle; 
    this.setData({
      togle: togle,
    })
  },

  Ernter: function (e) {
    var yingcan = !this.data.yingcan;
    this.setData({
      yingcan: yingcan,
    })
  },


  San: function (e) {
    var sanshi = !this.data.sanshi;
    this.setData({
      sanshi: sanshi,
    })
  },

  Four: function (e) {
    var si = !this.data.si;
    this.setData({
      si: si,
    })
  },

  Five: function (e) {
    var wu = !this.data.wu;
    this.setData({
      wu: wu,
    })
  },

  Six: function (e) {
    var liu = !this.data.liu;
    this.setData({
      liu: liu,
    })
  },

  Seven: function (e) {
    var qi = !this.data.qi;
    this.setData({
      qi: qi,
    })
  },

  Einght : function(e) {
    var ba = !this.data.ba;
    this.setData({
      ba: ba,
    })
  },

  Nine : function(e) {
    var jiu = !this.data.jiu;
    this.setData({
      jiu: jiu,
    })
  },

})