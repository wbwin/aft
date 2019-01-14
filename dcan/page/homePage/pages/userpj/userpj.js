var app = getApp()
var util = require('../../../../utils/util.js')
var zanTime 

Page({
  data: {
    nothing: true,
    classifyId: 0,
    userInfo: {},
    submitOpen: false,
    backgound: false,
    jubaoBox: false,
    dzan:false,
    changepl:[],
    backgound: false,
    jubaoBoxc: false,
    isMe:0,
    bjBox:false
  },

  onLoad: function (options) {

    var that = this
    var userId = options.userId 
    var shopId=options.shopId 
    this.setData({
      pid: userId,
      shopId: shopId    
    })
    if(userId== wx.getStorageSync('usersInfo').userId)
    {
      this.setData({
        isMe:1
      })
    }
    //调用应用实例的方法获取全局数据
    var pid= wx.getStorageSync('usersInfo').userId
    wx.request({
      url: 'https://www.aftdc.com/index.php/wxapp/index/userPl',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        
        page: 0,
        userId: userId,
        pid: pid
      },
      method: "POST",
      success: function (res) {
        var pingluns = res.data.all
   
        for (var i in pingluns) {
          pingluns[i].writePl = true;
          pingluns[i].mores = 3;       
          var dataY = pingluns[i].createTime
          dataY = util.formateIOS(dataY)
          var datas = util.formateContrast(new Date, dataY)
          pingluns[i].createTime = datas
          
          var shopNumber=0
          var len=0
          if (Boolean(pingluns[i].shopReply)){
            shopNumber = 1         
          }
          if (Boolean(pingluns[i].reply)) {
            len = pingluns[i].reply.length
          }
          pingluns[i].plNumber = parseInt(shopNumber + len) 
        }
        
       var pinglunT=res.data.alls.all
       for (var i in pinglunT) {
         pinglunT[i].writePl = true;
         pingluns[i].mores = 3;
         var dataY = pinglunT[i].createTime
         dataY = util.formateIOS(dataY)
         var datas = util.formateContrast(new Date, dataY)
         pinglunT[i].createTime = datas

         var shopNumber = 0
         var len = 0
         if (Boolean(pinglunT[i].shopReply)) {
           shopNumber = 1
         }
         if (Boolean(pinglunT[i].reply)) {
           len = pinglunT[i].reply.length
         }
         pinglunT[i].plNumber = parseInt(shopNumber + len)
       }
        var pinglun = pingluns.slice(0, 10)
        that.setData({
          pingluns: res.data.all,
          pinglun: pinglun,
          page: pinglun.length,
          count: res.data.count,
          difen: res.data.difen,
          imgNums: res.data.imgNums,
          pinglunT: pinglunT,
          pinglunTs: res.data.alls,
          userName: res.data.userName,
          userPhoto:res.data.userPhoto,
          dzNum: res.data.dzNum,
          pingjiaNum: res.data.pingjiaNum,
          arr:res.data
        })
      }
    })
  },
  
  /*Praise: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var id = e.currentTarget.dataset.id
    var userId = wx.getStorageSync('usersInfo').userId
    var pinglun = that.data.pingluns
    var pinglunT = that.data.pinglunT
    var classifyId = that.data.classifyId
    var pid = that.data.pid
    console.log(index)
    that.setData({
      dzan: false,
    })
    clearTimeout(zanTime);

    wx.request({
      url: 'https://www.aftdc.com/index.php/wxapp/index/tags',
      data:
      {
        index: id,
        userId: userId,
        pid:pid
      },
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if (res.data == 1) {
          if (classifyId==0)
          {
            var numb = Number(pinglun[index]['numbs'])
            pinglun[index]['numbs'] = Number(numb - 1)
            pinglun[index]['isDZ'] = 0
            that.setData({
              pinglun: pinglun,
            
            })
          }
          if (classifyId==1)
          {
            var numbT = Number(pinglunT[index]['numbs'])
            pinglunT[index]['numbs'] = Number(numbT - 1)
            pinglunT[index]['isDZ'] = 0
            that.setData({
              pinglunT: pinglunT,
            })
          }
        }
        if (res.data == 2) {
          if (classifyId==0)
          {
            var numb = Number(pinglun[index]['numbs'])
            pinglun[index]['numbs'] = Number(numb + 1)
            pinglun[index]['isDZ'] = 1
            // that.zan();
            that.setData({
              pinglun: pinglun,
              dzan:true,
            })
          }
          if (classifyId==1)
          {
            var numbT = Number(pinglunT[index]['numbs'])
            pinglunT[index]['numbs'] = Number(numbT + 1)
            pinglunT[index]['isDZ'] = 1
            // that.zan();
            that.setData({
              pinglunT: pinglunT,
              dzan: true,
            })
          }
          clearTimeout(zanTime);
          zanTime = setTimeout(function () {
            that.setData({
              dzan: false,
            })
            clearTimeout(zanTime);
          }, 1100)
         
        }
        
      }
    })

  },*/
  Praise:function(e)
  {
    var that = this
    var index = e.currentTarget.dataset.index
    var id = e.currentTarget.dataset.id
    var userId = wx.getStorageSync('usersInfo').userId
    var pinglun = that.data.pingluns
    var pinglunT = that.data.pinglunT
    var classifyId = that.data.classifyId
    var pid = that.data.pid
    console.log(index)
    that.setData({
      dzan: false,
    })
    clearTimeout(zanTime);
    var changepl = that.data.changepl;
    if (classifyId==0)
    {
      var isDZ = pinglun[index]['isDZ']
      pinglun[index]['isDZ'] = isDZ == 0 ? 1 : 0;

      var zanshow = pinglun[index]['isDZ'];
      var numb = Number(pinglun[index]['numbs']);

    

      if (zanshow == 0) {
        pinglun[index]['numbs'] = Number(numb - 1);
      }
      else if (zanshow == 1) {
        that.setData({
          dzan: true,
        })
        clearTimeout(zanTime);
        zanTime = setTimeout(function () {
          that.setData({
            dzan: false,
          })
          clearTimeout(zanTime);
        }, 1100)
        pinglun[index]['numbs'] = Number(numb + 1)
      }
      var len = changepl.length
      for (var i = 0; i < len; i++) {
        if (changepl[i].id == id) {
          changepl.splice(i, 1)
          break
        }
      }
      var obj = { id: id, isDZ: zanshow }
      changepl.push(obj)
      that.setData({
        pinglun: pinglun,
        changepl: changepl,
      })
    }
    if (classifyId==1)
    {
      var isDZ = pinglunT[index]['isDZ']
      pinglunT[index]['isDZ'] = isDZ == 0 ? 1 : 0;

      var zanshow = pinglunT[index]['isDZ'];
      var numb = Number(pinglunT[index]['numbs']);



      if (zanshow == 0) {
        pinglunT[index]['numbs'] = Number(numb - 1);
      }
      else if (zanshow == 1) {
        that.setData({
          dzan: true,
        })
        clearTimeout(zanTime);
        zanTime = setTimeout(function () {
          that.setData({
            dzan: false,
          })
          clearTimeout(zanTime);
        }, 1100)
        pinglunT[index]['numbs'] = Number(numb + 1)
      }
      var len = changepl.length
      for (var i = 0; i < len; i++) {
        if (changepl[i].id == id) {
          changepl.splice(i, 1)
          break
        }
      }
      var obj = { id: id, isDZ: zanshow }
      changepl.push(obj)
      that.setData({
        pinglunT: pinglunT,
        changepl: changepl,
      })
    }
    console.log(that.data.changepl)
  },
  onUnload: function () {
    var that = this
    var changepl = that.data.changepl;
    var add = [];
    var deletes = [];
    var userId = wx.getStorageSync('usersInfo').userId;
    var len = changepl.length
    for (var i = 0; i < len; i++) {
      var id = changepl[i].id
      if (changepl[i].isDZ == 1) {
        add.push(id)
      } else if (changepl[i].isDZ == 0) {
        deletes.push(id);
      }
    }
    //改变过 点赞 状态的评论id
    console.log(add, "add") //点赞的
    console.log(deletes, "deletes")//没点赞
    if (add.length > 0 || deletes.length > 0) {
      wx.request({
        url: 'https://www.aftdc.com/index.php/Wxapp/GoodsAppraises/updDz',
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data:
        {
          add: JSON.stringify(add),
          deletes: JSON.stringify(deletes),
          userId: userId,
          shopId:that.data.shopId
        },
        success: function (res) {

        }

      })
    }
  },
  //切换评价
  choiceYes: function (e) {
    var index = e.target.dataset.id
    var classifyId = index

  /*  if (classifyId == 0) {
      var pingluns = this.data.pingluns
      console.log(pinglun)
      for (var i in pingluns) {
      
      var pinglun = pingluns.slice(0, 10)
      }
    }
    if (classifyId == 1) {
      var pingluns = this.data.pingluns
      var pinglun = []
      for (var i in pingluns) {
     
        if (pingluns[i].appraisesAnnex != null) {
          pinglun.push(pingluns[i])
        }
      }
    }*/
    if (classifyId==0)
    {
      var pinglun = this.data.pingluns
      var dzNum = this.data.arr.dzNum
      var pingjiaNum = this.data.arr.pingjiaNum
      console.log(this.data.pingluns)
      this.setData({
        pinglun: pinglun,
        dzNum: dzNum,
        pingjiaNum: pingjiaNum
      })
    }
    if (classifyId == 1) {
      var pinglunT = this.data.pinglunT
      var dzNum = this.data.pinglunTs.dzNum
      var pingjiaNum = this.data.pinglunTs.pingjiaNum
      this.setData({
        pinglunT: pinglunT,
        dzNum: dzNum,
        pingjiaNum: pingjiaNum
      })
    }
   this.setData({
     classifyId: classifyId
   })
    



  },
  //弹出评论
  reply: function (e) {
    if (this.data.classifyId==0)
    {
      var pinglun = this.data.pinglun
      var index = e.currentTarget.dataset.index
      for (var i in pinglun) {
        if (i != index) {
          pinglun[i].writePl = true
        }
      }
      pinglun[index].writePl = !pinglun[index].writePl
      this.setData({
        pinglun: pinglun,
        plText: '',
      })
    }
    if (this.data.classifyId == 1) {
      var pinglun = this.data.pinglunT
      var index = e.currentTarget.dataset.index
      for (var i in pinglun) {
        if (i != index) {
          pinglun[i].writePl = true
        }
      }
      pinglun[index].writePl = !pinglun[index].writePl
      this.setData({
        pinglunT: pinglun,
        plText: '',
      })
    }
  
  },
  //评论框
  plText: function (e) {
    var txt = e.detail.value
    this.setData({
      plText: txt,
    })

  },

  //提交评价
  submitPl: function (e) {
    var that = this
    var index = e.currentTarget.dataset.id
    var plText = that.data.plText
    var userId = wx.getStorageSync('usersInfo').userId
    var page = that.data.page
    var pid = that.data.pid
    if (!plText || plText == "") {
      return false
    }
    wx.request({
      url: 'https://www.aftdc.com/index.php/wxapp/index/reply',
      data:
      {
        plText: plText,
        index: index,
        userId: userId,
        pid: pid
      },
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if (res.data.isUse == 0) {
          util.aftModal({
            title: '你的账号已被封停！无法进行该操作',
            icon: 'loading'
          })
          return false
        }
        if (res.data == 1) {
          util.aftModal({
            title: '发表成功',
            icon: 'success',
            duration: 1500,
            success: function (res) {
              var options = []
              options.userId = that.data.pid
              that.onLoad(options)
            }

          })
        }
        else {
          util.aftModal({
            title: '发表失败',
            icon: 'loading',
            duration: 1500,
            success: function (res) {
              var options = []
              options.userId = that.data.pid
              that.onLoad(options)
            }
          })
        }
      }
    })
    that.setData({
      plText: '',
    })
  },

  zan: function (e) {
    this.setData({
      dzan: true
    })

    var animation = wx.createAnimation({
      duration: 260,
      timingFunction: "linear",
      delay: 0,
    })
    this.animation = animation
    animation.scale(2, 2).opacity(1).step()

    animation.rotate(10).step({ duration: 60 })
    animation.rotate(0).step({ duration: 60 })
    animation.rotate(-10).step({ duration: 60 })

    animation.rotate(10).step({ duration: 60 })
    animation.rotate(0).step({ duration: 60 })
    animation.rotate(-10).step({ duration: 60 })

    animation.rotate(0).scale(1, 1).opacity(0).step()
    this.setData({
      animationData: animation.export(),
    })
  },

  //点击放大图片
  enlargeImg: function (e) {
    var src = e.currentTarget.dataset.src;
    var index = e.currentTarget.dataset.index;
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
  //更多评论
  morePl: function (e) {
    var index = e.currentTarget.dataset.index;
    var len = e.currentTarget.dataset.len + 1;
    var pinglun = this.data.pinglun;
    var mores = pinglun[index].mores;
    mores = mores > 3 ? 3 : len
    pinglun[index].mores = mores;
    this.setData({
      pinglun: pinglun,
    })
  },
  jubao: function (e) {
    var that = this
    var pjid = e.currentTarget.dataset.pid
    var index = e.currentTarget.dataset.index
    var content = e.currentTarget.dataset.content
    that.setData({
      backgound: true,
      pjid: pjid,
      pjIndex: index,
      plcontent:content
    })
    if(that.data.isMe==1)
    {
      that.setData({
        jubaoBox:true
      })
    }
    else
    {
      that.setData({
        jubaoBoxc: true
      })
    }
  },
  canBox: function () {
    var that = this
    that.setData({
      backgound: false,
      jubaoBox: false,
      jubaoBoxc: false,
      bjBox:false
    })
  },
  gotoJubao:function(e)
  {
    var pid = this.data.pjid
    this.setData({
      backgound: false,
      jubaoBoxc: false
    })
    wx.navigateTo({
      url: '../report/report?pid=' + pid,
    })
  },

  delPj:function(e)
  { 
    var that=this
    var id = that.data.pjid
    var pjIndex = that.data.pjIndex
   
    wx.request({
      url: 'https://www.aftdc.com/index.php/Wxapp/GoodsAppraises/delPl',
      data:{
        id:id,
        userId: that.data.pid
      },
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success:function(res)
      {
        if(res.data.res==1)
        {
          util.aftModal({
            title: '删除成功',
            icon:'success',
            duration:2000,
            success:function()
            {
              var pinglun = that.data.pinglun
              that.data.pinglun.splice(pjIndex, 1)
              that.setData({
                pinglun: pinglun,
                backgound: false,
                jubaoBox: false
              })
            }
          })
        }
        else
        {
          util.aftModal({
            title: '操作失败',
          })
        }
      }
    })
  },
  updPj:function()
  {
    var that=this
    that.setData({
      bjBox:true
    })
  },
  getVal:function(e)
  {
    var content = e.detail.value
    this.setData({
      pjcontent:content
    })
  },
  save:function()
  {
    var that=this 
    var id = that.data.pjid
    var pjIndex = that.data.pjIndex
    var content = that.data.pjcontent
    wx.request({
      url: 'https://www.aftdc.com/index.php/Wxapp/GoodsAppraises/savePl',
      data:{
        id: id,
        userId: that.data.pid,
        content: content
      },
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success:function(res)
      {
        if (res.data.res == 1) {
          util.aftModal({
            title: '修改成功',
            icon: 'success',
            duration: 2000,
            success: function () {
              var pinglun = that.data.pinglun
              that.data.pinglun[pjIndex]['content'] = content
              that.setData({
                pinglun: pinglun,
                backgound: false,
                jubaoBox: false,
                bjBox:false
              })
            }
          })
        }
        else {
          util.aftModal({
            title: '操作失败',
          })
        }
      }
    })
  }
})

  
