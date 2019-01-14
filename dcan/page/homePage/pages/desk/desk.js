var app = getApp();
var MD5Util = require('../../../../utils/md5.js');
var util = require('../../../../utils/util.js')
var authorization = require('../../../../utils/authorization.js')
Page({
	data: {
    optionalTime: ['00:00','00:30','01:00','01:30','02:00','02:30','03:00','03:30','04:00','04:30','05:00','05:30','06:00','06:30','07:00','07:30','08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00','18:30','19:00','19:30','20:00','20:30','21:00','21:30','22:00','22:30','23:00','23:30'],
    
    inputPhone:'',//电话号码
    name:'',//姓名
		showImg: true,
		showTime: true,
		datacolor: 0,
		gett: -1,
		pick: true,
		pickNumb: "请选择",
    reserveTime: "请选择",
		inputs: {},
		deskChild: [],
		deskTypeOk: 1,
		orderFoodStatus: true,
		isBj: false,
		sex: 2,
    mealTime:2,//选择备餐时间，，，接口数据未写
		baojian: 2,//值 1 只包间，2 可接受大厅
		enlargeBox: false,
    time:'请选择',
    startOrderDay:'',
    orderStartDate:'',
    orderEndDate:'',
    orderStartTime:'',
    orderEndTime: ''
	},


	onLoad: function (options) {
		var that = this
		var shopId = options.shopId
		var shopName = options.shopName
    this.data.shareId = options.shareId
    var orderStartDate = options.orderStartDate
    var now = util.formatTimes(new Date)
    now = util.formateIOS(now)
    if (now > util.formateIOS(orderStartDate + ' ' + "00:00:00")){
      orderStartDate = util.formatTime(new Date)
    }
    var orderEndDate = options.orderEndDate
    var serviceTime = JSON.parse(options.serviceTime)
    // var orderStartTime = options.orderStartTime
    // var orderEndTime = options.orderEndTime
    var orderStartTime = serviceTime[0].serviceStartTime //最早的预订时间
    var orderEndTime = serviceTime[serviceTime.length - 1].serviceEndTime //最晚的预订时间

   
    //预订日期
    var dateN = util.formatTime(new Date)
    var datestr = util.formateIOS(dateN + ' ' + "00:00:00")
    // var scheduledDates = options.scheduledDates
    // scheduledDates = scheduledDates.split(",");
    // var startOrderDay = util.addDay(datestr, scheduledDates[0] - 1)
  
    var userId = wx.getStorageSync('usersInfo').userId
		that.setData({
			shopName: shopName,
			shopId: shopId,
			userId: userId,
      orderStartDate: orderStartDate,
      orderEndDate: orderEndDate,
      serviceTime: serviceTime,
      orderStartTime: orderStartTime,
      orderEndTime: orderEndTime
		})
		// //三天日期
		// var das = util.formatTime(new Date)
		// var HM = das.substring(das.indexOf("-") + 1)
		// var dataThree = {}
		// dataThree.today = HM
		// for (var i = 1; i < 3; i++) {
		// 	var today = "today" + i
		// 	var HMs = util.addDay(das, i)
		// 	HMs = HMs.substring(HMs.indexOf("-") + 1)
		// 	dataThree[today] = HMs
		// }

		// var dateN = util.formatTime(new Date)
		// //获取可选预计的时间
		// that.today()
		// var requireTime = dateN + " " + that.data.reTime + ":00";
		// that.setData({
		// 	today: dateN,
		// 	serviceStartTime: "09:00", //开店时间
		// 	serviceEndTime: "23:00",  //关店时间
		// 	dataThree: dataThree,
		// })
		// that.today()
  
    var optionalTime = this.data.optionalTime
    var date = new Date()
    var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
    var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
    var presentTime = hours + ':' + minutes
    var businessHours = []
    var todayTime = []
    for (var i = 0;i < serviceTime.length;i++){
      for (var j = 0, len = optionalTime.length; j < len; j++){
        if (optionalTime[j] >= serviceTime[i].serviceStartTime && optionalTime[j] <= serviceTime[i].serviceEndTime){
          businessHours.push(optionalTime[j])
        }
        if (optionalTime[j] >= serviceTime[i].serviceStartTime && optionalTime[j] <= serviceTime[i].serviceEndTime && optionalTime[j] >= presentTime) {
          todayTime.push(optionalTime[j])
        }
      }
    }
    
    // 把开始营业半小时内的时间删除
    for (var i = 0, len = optionalTime.length; i < len; i++) {
      if (optionalTime[i] >= serviceTime[0].serviceStartTime ) {
        if (optionalTime[i] === businessHours[0]) {
          businessHours.splice(0, 1)
        }
        break
      }
    }

    // 把现在半小时内的时间删除
    for (var i = 0, len = optionalTime.length; i < len; i++) {
      if (optionalTime[i] >= presentTime) {
        if (optionalTime[i] === todayTime[0]) {
          todayTime.splice(0, 1)
        }
        break
      }
    }

    this.setData({
      allTime: businessHours,//渲染的时间
      optionalTime: businessHours,//明天开始可选时间
      todayTime: todayTime//今天可先时间
    })
	},

  bindDateChange: function (e) {
    var that=this
    var dateN = util.formatTime(new Date)
    if (e.detail.value == dateN){
      //现在时间的半小时后可以开始预订
      var nowTime = util.formatData(new Date)
      var datestr = util.formateIOS(dateN + ' ' + nowTime + ":00")
      var nowTime = util.addMinutes(datestr, 30)
      if (util.formateIOS(dateN + ' ' + nowTime + ":00") < util.formateIOS(dateN + ' ' + that.data.orderEndTime + ":00") && this.data.todayTime.length > 0){
        if(that.data.time!='请选择'){
          that.setData({
            time: '请重新选择',
          })
        }
        that.setData({
          orderStartTime: nowTime,
          reserveTime: e.detail.value,
        })
      }else{
       wx.showToast({
          title: '当前可选时间已超过可预订时间,请重新选择日期',
          icon: 'none',
          duration: 1500,
        })
      }
    }else{
      that.setData({
        reserveTime: e.detail.value,
      })
    }
    // var date = new Date()
    // var year = date.getFullYear(), month = date.getMonth() + 1, strDate = date.getDate()
    // if (month >= 1 && month <= 9) {
    //   month = "0" + month;
    // }
    // if (strDate >= 0 && strDate <= 9) {
    //   strDate = "0" + strDate;
    // }
    // var todayDate = year + '-' + month + '-' + strDate
    
    // 判断是否在可选时间段
    if (e.detail.value !== dateN || e.detail.value == dateN && util.formateIOS(dateN + ' ' + nowTime + ":00") < util.formateIOS(dateN + ' ' + that.data.orderEndTime + ":00") && this.data.todayTime.length > 0) {
      if (dateN === e.detail.value) { // 判断是否为今天
        this.setData({ allTime: this.data.todayTime })
      } else {
        this.setData({ allTime: this.data.optionalTime })
      }
    }
  },
 
  bindTimeChange: function (e) {
    var time = this.data.allTime[0][e.detail.value[0]] + ':' + this.data.allTime[1][e.detail.value[1]]
    this.setData({
      time: time
    })
  },
  bindPickerChange(e){
    this.setData({
      time: this.data.allTime[e.detail.value]
    })
  },
	deskTop: function (e) {
		var id = e.target.dataset.index
		this.setData({
			deskTypeOk: id,
		})
		this.desks(id)
	},
	desks: function (id) {
		var deskChild = []
		var desk = this.data.desk
		if (id == 1) {
			var txt = "散台"
		} else if (id == 2) {
			var txt = "包厢"
		}
		for (var i in desk) {
			if (desk[i].deskType == txt) {
				deskChild.push(desk[i])
			}
		}
		this.setData({
			deskChild: deskChild,
		})
	},
	goon: function () {
		this.setData({
			isclose: 0
		})
		wx.navigateBack({
			delta: 1
		})
	},
	//时间选择
	instant: function (e) {
		var time = e.currentTarget.dataset.str
		this.setData({
			showTime: true,
			gett: -1,
			reserveTime: this.data.today + " " + time,//用餐时间
		})
	},
	comTime: function (e) {
		var index = e.currentTarget.dataset.number
		var time = e.currentTarget.dataset.time
		this.setData({
			showTime: true,
			requireTime: this.data.today + " " + time,
			reserveTime: this.data.today + " " + time,//用餐时间
			gett: index
		})
	},
	today: function () {
		var that = this
		var dateN = util.formatTime(new Date)

		var addTime = util.formatData(new Date)
		//获取可选预计的时间
		var timearr = [];
		for (var i = 0; i < 50; i++) {
			var datestr = util.formateIOS(dateN + ' ' + addTime + ":00")
			var addTime = util.addMinutes(datestr, 30)
			if (datestr < util.formateIOS(dateN + ' ' + that.data.serviceEndTime + ":00")) {
				timearr.push(addTime)
			}
			else {
				break;
			}
		}
		var today = util.formatTime(new Date)
		timearr.pop()
		that.setData({
			timearr: timearr,
			today: today,
			datacolor: 0,
		})
	},
	toTime: function (e) {
		var days = e.currentTarget.dataset.id
		var dateN = util.formatTime(new Date)
		var addTime = this.data.serviceStartTime
		//获取可选预计的时间
		var timearr = [];
		for (var i = 0; i < 50; i++) {
			var datestr = util.formateIOS(dateN + ' ' + addTime + ":00")
			var addTime = util.addMinutes(datestr, 30)
			if (datestr >= util.formateIOS(dateN + ' ' + this.data.serviceEndTime + ":00")) {
				break;
			}
			else {
				timearr.push(addTime)
			}
		}
    
		var datestr = util.formateIOS(dateN + ' ' + "00:00:00")
		var today = util.addDay(datestr, days)
		timearr.pop()
		this.setData({
			timearr: timearr,
			today: today,
			datacolor: days
		})
	},
	selTime: function () {
		var that = this
		var showTime = !that.data.showTime
		that.setData({
			showTime: showTime,
			pick: true
		})
	},
	quxiao: function () {
		var that = this
		that.setData({
			showTime: true
		})
	},
	ReserveClose: function () {
		var that = this
		that.setData({
			isbuy: 0,
		})
		var options = [];
		options.shopId = that.data.shopId
		options.shopName = that.data.shopName
		that.onLoad(options)
	},
	pickshow: function () {
		var pick = !this.data.pick
		this.setData({
			pick: pick,
			showTime: true,
		})
	},
	picks: function (e) {
		var numb = e.currentTarget.dataset.numb
		this.setData({
			pick: true,
			pickNumb: numb + "人 ",
			sbNumb: numb
		})
	},
	//获取input值

	names: function (e) {
		var inputName = e.detail.value
		this.setData({
			inputName: inputName,
		})
	},

    // 验证电话
    phone:function(e){
        var inputPhone = e.detail.value;
        var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
        if (!myreg.test(inputPhone)) {
            wx.showToast({
                title: '手机号码有误！',
                icon: 'none',
                duration: 1500
            })
            return false;
        }

    },
    phoneInput(e) {
      var that=this
        var inputPhone = e.detail.value;
        that.setData({
          inputPhone: inputPhone
        })
        // this.kongge_string(phone);

    },
    //   // 手机号码自动添加空格
    // kongge_string: function (e) {
    //     var kongge_phone = e.replace(/\s*/g, "");
    //     var result = [];
    //     for (var i = 0; i < kongge_phone.length; i++) {
    //         if (i == 3 || i == 7) {
    //             result.push(" " + kongge_phone.charAt(i));
    //         }
    //         else {
    //             result.push(kongge_phone.charAt(i));
    //         }
    //     }
    //     kongge_phone = result.join("");
    //     this.setData({
    //         phone: kongge_phone
    //     })
    // },


	//   phones: function (e) {
	//     var inputPhone = e.detail.value
	//     this.setData({
	//       inputPhone: inputPhone,
	//     })
	//   },
	remarks: function (e) {
		var inputRemark = e.detail.value
		this.setData({
			inputRemark: inputRemark,
		})
	},

	Reserves: function (e) {
		var that = this
		var usersInfo = wx.getStorageSync('usersInfo')
		if (!usersInfo || !usersInfo.userPhone) {//如果没登录
			wx.navigateTo({
				url: '../author/author',
			})
			return false
		} else {
			var sex = that.data.sex
            var mealTime = that.data.mealTime
			var baojian = that.data.baojian
			if (!that.data.isBj) {
				baojian = 0
			}
			var fromId = e.detail.formId
			var numb = that.data.sbNumb;//人数
      var reserveTime = that.data.reserveTime;//预订日期
      var time = that.data.time;//用餐时间
      var reachTime = reserveTime + ' ' +time;//时间
			var inputName = that.data.inputName//姓名
			// var inputPhone = wx.getStorageSync('usersInfo').userPhone
      var inputPhone = that.data.inputPhone
     
			// if (!inputPhone) {//没有电话号码时中断弹出设置框
			// 	that.setData({
			// 		noPhone: true
			// 	})
			// 	return false
			// }
			var inputRemark = that.data.inputRemark//备注
			var oid = wx.getStorageSync('usersInfo').openid
			var timestamp = (Date.parse(new Date()) / 1000).toString();
			timestamp = timestamp + Math.floor(9999 * Math.random());;
			if (inputRemark == '' || inputRemark == undefined) {
				inputRemark = ''
			}
      if (numb == "请选择" || reserveTime == "请选择" || time == "请选择" || inputName == undefined || inputName == "" ||!inputPhone) {
				util.aftModal({
					title: '请填写完整',
					icon: 'loading',
					duration: 1000,
				})
				return false
			}
      var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
      if (!myreg.test(inputPhone)) {
        wx.showToast({
          title: '手机号码有误！',
          icon: 'none',
          duration: 1500
        })
        return false;
      }

			var shopName = that.data.shopName
			var id = that.data.id
			var money = that.data.money
			var date = that.data.date;
			var userId = wx.getStorageSync('usersInfo').userId
				var arr = new Object();
				arr.numb = numb;
				arr.reachTime = reachTime;
				arr.inputName = inputName;
				arr.inputPhone = inputPhone;
				arr.inputRemark = inputRemark;
				arr.id = id;
				arr.shopId = that.data.shopId;
				arr.userId = userId;
				arr.shopName = shopName;
				arr.money = money;
				arr.fromId = fromId;
				arr.openid = oid;
				arr.baojian = baojian;
				arr.isYu = 1;
				arr.orderNo = timestamp;
        arr.sex = sex
        arr.mealTime = mealTime
				//缓存订座数据
				wx.setStorageSync('deskArr', arr)
        if(this.data.shareId)
          var url = '../submit/submit?shareId=' + this.data.shareId
        else
          var url = '../submit/submit' 
				wx.navigateTo({
          url: url,
				})
		}
	},
	//需要包间
	switch1Change: function (e) {
		var isBj = e.detail.value
		if (isBj) {
			this.setData({
				isBj: true,
			})
		} else {
			this.setData({
				isBj: false,
			})
		}
	},
	//是否接受大厅
	radioChanges: function () {
		if (this.data.baojian == 1) {
			this.setData({
				baojian: 2
			})
		} else {
			this.setData({
				baojian: 1
			})
		}
	},

	//性别选择
	sexChoose: function (e) {
		var sex = e.detail.value
		this.setData({
			sex: sex
		})
	},
    //备餐时间选择

    mealTimeChoose: function (e) {
        var mealTime = e.detail.value
        this.setData({
            mealTime: mealTime
        })
    },
	onShow: function () {
		//返回删除缓存
		wx.removeStorageSync('deskArr')
	},
	seeDesk: function () {
		var shopId = this.data.shopId
		var that = this
		var timestamp = (Date.parse(new Date())) / 1000
		var sign = MD5Util.sign(timestamp)
		wx.request({
			url: 'https://www.aftdc.com/wxapp/Desk/shopImg',
			data: {
				sign: sign,
				timestamp: timestamp,
				token: wx.getStorageSync('usersInfo').token,
				shopId: shopId
			},
			header: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			method: 'POST',
			success: function (res) {
				var src = res.data;
				var index = 0;
				var txt = 'ImgUrl';
				if (txt != 'img') {
					var srcs = []
					for (var i in src) {
						var img = src[i][txt]
						var obj = { img: img }
						srcs.push(obj)
					}
					src = srcs
				}
				that.setData({
					enlargeSrc: src,
					enlargeBox: true,
					enlargeNumb: index,
				})
			}
		})
	},
	enlargeClose: function (e) {
		this.setData({
			enlargeBox: false,
		})
	},
	//获取手机号
	getPhoneNumber: function (e) {
		this.setData({
			noPhone: false
		})
		authorization.getPhone(e)
	},
  
})
