var app = getApp();
var MD5Util = require('../../../../utils/md5.js');
var wxCharts = require('../../../../utils/wxcharts.js');
var lineChart = null;
Page({
	data: {
		steps: [],
		allStep: 0,//当天步数
		allCalorie: 0,
		onshow: false
	},
	onLoad: function () {
		// var steps = wx.getStorageSync('wxSport')
		// this.setData({
		// 	steps: steps,
		// 	allStep: steps.allStep,
		// 	timestamp: steps.stepList[6].timestamp + ' ',
		// 	vals: steps.stepList[6].step,
		// })
		// this.charts()
	},
	onShow: function () {
		if (this.data.onshow) {//让它第一次进来不要执行
			this.calculate()
		}
	},
	onReady: function () {
		var that = this;
		var timestamp = (Date.parse(new Date())) / 1000
		var sign = MD5Util.sign(timestamp)
		wx.request({
			url: 'https://www.aftdc.com/wxapp/Index/aftSport',
			method: "POST",
			header: { "Content-Type": "application/x-www-form-urlencoded" },
			data: {
				sign: sign,
				timestamp: timestamp,
				token: wx.getStorageSync('usersInfo').token
			},
			success: function (ress) {
				that.setData({
					userName: wx.getStorageSync('usersInfo').userName,
					userPhoto: wx.getStorageSync('usersInfo').userPhoto,
					// goodsLists: ress.data,
					goodsList: ress.data.goodsList[6],
					allCalorie: ress.data.goodsList[6].calorie,
					user: ress.data.user,
					edit: false,
					onshow: true
				})
				wx.setStorageSync('user', ress.data.user)
				that.calculate()
			}
		})
	},
	//计算
	calculate: function () {
		var user = wx.getStorageSync('user')
		var allCalorie = this.data.allCalorie
		var vals = this.data.vals

		if (user.sex == 1) {//建议男性摄入的卡路里
			var suggestCalorie = parseInt((66 + 13.8 * user.weight + 5 * user.height - 6.8 * user.age) * 1.3)
		} else if (user.sex == 0) {//建议男性摄入的卡路里
			var suggestCalorie = parseInt((655 + 9.6 * user.weight + 1.9 * user.height - 4.7 * user.age) * 1.3)
		} else {
			var suggestCalorie = '_'
		}
		var expend = parseInt(vals / 32)  //总消耗
		if (!expend) { expend = '_' }
		var suggestWalk = allCalorie * 32 //建议行走
		if (!suggestWalk) { suggestWalk = '_' }
		var BMI = parseInt(user.weight / user.height / user.height * 10000)  //BMI
		if (!BMI) { BMI = '_' }
		var bodyFat = parseInt((1.20 * user.weight / user.height / user.height * 10000) + (0.23 * user.age) - (10.8 * user.sex) - 5.4)//体脂率
		if (!bodyFat) { bodyFat = '_' } else { bodyFat = bodyFat + '%' }

		this.setData({
			user: user,
			suggestCalorie: suggestCalorie,
			expend: expend,
			suggestWalk: suggestWalk,
			BMI: BMI,
			bodyFat: bodyFat
		})
	},
	//图表
	// charts: function () {
	// 	var stepList = this.data.steps.stepList;
	// 	var len = stepList.length
	// 	var seriesData = [],
	// 		categoriesData = [],
	// 		maxY = 0;//y轴最大值
	// 	for (var i = 0; i < len; i++) {
	// 		var serie = parseInt(stepList[i].step);
	// 		if (maxY < serie) {
	// 			maxY = serie
	// 		}
	// 		seriesData.push(serie);
	// 		var timestamp = stepList[i].timestamp;
	// 		timestamp = timestamp.split("-");
	// 		// var l = timestamp.length;
	// 		var times = ''

	// 		if (i == 0) {
	// 			times = timestamp[1] + '月' + timestamp[2]
	// 		} else {
	// 			times = timestamp[2]
	// 		}
	// 		categoriesData.push(times)
	// 	}

	// 	maxY = maxY + maxY / 4 + 1 //没有最大值步数都是0时图会去到中间

	// 	var boxWidth = 300;
	// 	var boxHeight = 150;
	// 	try {
	// 		wx.createSelectorQuery().select('.canvasBox').boundingClientRect(function (rect) {
	// 			boxHeight = rect.height;
	// 			lineChart = new wxCharts({
	// 				canvasId: 'lineCanvas',
	// 				type: 'line',
	// 				categories: categoriesData,
	// 				animation: false,
	// 				background: '#f5f5f5',

	// 				color: '#ffffff',
	// 				series: [{
	// 					name: '步数',
	// 					data: seriesData,
	// 					color: '#f0f0f0',
	// 					format: function (val) {
	// 						return val;
	// 					},
	// 				}],
	// 				xAxis: {
	// 					disableGrid: true,
	// 					fontColor: '#ffffff',
	// 					gridColor: "#ffffff",
	// 				},
	// 				yAxis: {
	// 					disabled: true,//不绘制y轴
	// 					title: '',
	// 					format: function (val) {
	// 						return val;
	// 					},
	// 					min: 0,
	// 					max: maxY,
	// 				},
	// 				width: boxWidth,
	// 				height: boxHeight,
	// 				legend: false,
	// 				dataLabel: false,
	// 				dataPointShape: true,
	// 				extra: {
	// 					lineStyle: 'curve',
	// 					color: '#fff',
	// 				}
	// 			});
	// 		}).exec()
	// 	} catch (e) {
	// 	}
	// },
	//点击提示
	// touchHandler: function (e) {
	// 	var index = lineChart.getCurrentDataIndex(e);
	// 	var stepList = this.data.steps.stepList;
	// 	var vals = stepList[index].step//当天行走的步数
	// 	var timestamp = stepList[index].timestamp
	// 	var steps = this.data.goodsLists
	// 	this.setData({
	// 		timestamp: timestamp + ' ',
	// 		goodsList: steps.goodsList[index],
	// 		allCalorie: steps.goodsList[index].calorie,
	// 		vals: vals
	// 	})
	// 	lineChart.showToolTip(e, {
	// 		background: '#000000',
	// 		format: function (e) {
	// 			return vals;
	// 		},
	// 	});
	// 	this.calculate()
	// }
})



