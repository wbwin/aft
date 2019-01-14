// var tcity = require("https://image.aftdc.com/images/packageA/../utils/citys.js");
var util = require('../../../../utils/util.js')
var MD5Util = require('../../../../utils/md5.js');
var app = getApp();
Page({

	data: {
		value: [0, 0, 0],
		values: [0, 0, 0],
		countdown: 'countdown',
		second: 60,
		phone: '',
		phoneY: true,
		phoneTxt: false,
		codesTxt: false,
		region: ['', '', ''], //省市区
		imgData: [
			{
				txt: '身份证',
				word: '一张真实的身份证正面',
				exampleImg: 'https://image.aftdc.com/images/packageA/papers1.jpg',
				exampleTxt: '证件照片上的文字需要能够清晰辨认',
				upImg: '',//上传的图片---
				name: 'faceImg'
			},
			{
				txt: '营业执照',
				word: '请注意证件照片上的文字能够清晰可见',
				exampleImg: 'https://image.aftdc.com/images/packageA/setTyps.jpg',
				exampleTxt: '证件照片上的文字需要能够清晰辨认',
				upImg: '',
				name: 'unitImg'

			},
		],
		info: {
			company: '',//公司名称
			address: '',//公司地址
			time: '',//2018-03-22
			name: '',//姓名
			identity: '',//身份证
		},

	},

	onLoad: function (options) {
		var phone = options.phone;//上一页填写跳转的号码
		this.setData({
			phone: phone,
		})
		var phone = this.data.phone;
		console.log(phone)
		this.data.userId = options.userId
	},
	open: function () {
		this.setData({
			condition: !this.data.condition
		})
	},
	chooseimage: function (e) {
		var index = e.currentTarget.dataset.index;
		console.log(index)
		var that = this;
		var phone = that.data.phone;
		var imgData = that.data.imgData;
		wx.chooseImage({
			count: 1, // 默认9  
			sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
			sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
			success: function (res) {
				console.log(res)
				var file = res.tempFilePaths[0];
				imgData[index].upImg = file
				that.setData({
					togle: false,
					imgData: imgData,
				})
				var filename = file;//后缀名 
				var index1 = filename.lastIndexOf(".");
				var index2 = filename.length;
				var name = filename.substring(index1, index2);//后缀名 
				var timestamp = (Date.parse(new Date())) / 1000
				var sign = MD5Util.sign(timestamp)
				wx.request({
					url: 'https://www.aftdc.com/wxapp/Service/img_city',
					method: 'POST',
					data: {
						userId:wx.getStorageSync('usersInfo').userId,
						name: name,
						phone: phone,
						type: index,
						sign: sign,
						timestamp: timestamp,
						token: wx.getStorageSync('usersInfo').token,
					},
					success: function (res) {
						var imgurl = 'https://image.aftdc.com/' + res.data.name;//图片的路径
						if (index == 1) {
							index = 3;
						}
						wx.uploadFile({
							url: res.data.oss.host,
							filePath: file,
							name: 'file',
							formData: {
								"key": res.data.name,//图片的路径
								"policy": res.data.oss.policy,
								"OSSAccessKeyId": res.data.oss.accessid,
								'success_action_status': '200',
								'signature': res.data.oss.signature
							},
							header: { "Content-Type": "multipart/form-data" },
							success: function (res) {
								var timestamp = (Date.parse(new Date())) / 1000
								var sign = MD5Util.sign(timestamp)
								if (res.statusCode == 200) {
									wx.request({
										url: 'https://www.aftdc.com/wxapp/Service/oneself_upload',
										method: 'POST',
										data: {
											type: index,
											file: imgurl,
											sign: sign,
											timestamp: timestamp,
											token: wx.getStorageSync('usersInfo').token,
										},
										header: { "Content-Type": "application/x-www-form-urlencoded" },
										success: function (res) {
											console.log(res)
											var info = that.data.info;
											if (index == 0) {
												info.name = '';
												info.identity = '';
												that.setData({
													info: info,
												})
											}
											if (index == 0 && res.data[6] == '正') {
												info.name = res.data[2];
												info.identity = res.data[5];
												that.setData({
													info: info,
												})
											}
											if (index == 3) {
												info.company = '';
												info.address = '';
												info.time = '';
												that.setData({
													info: info,
												})
											}
											if (index == 3 && res.data[5] == '营') {
												info.company = res.data[2];
												info.address = res.data[3];
												info.time = res.data[6];
												that.setData({
													info: info,
												})
											}
											console.log(info)
										}
									})
								}
							}
						})
					}
				})
			}
		})
	},
	//滚动选择地区
	bindChange: function (e) {

		var val = e.detail.value
		var t = this.data.values;
		var cityData = this.data.cityData;

		if (val[0] != t[0]) {
			console.log('province no ');
			const citys = [];
			const countys = [];
			for (let i = 0; i < cityData[val[0]].sub.length; i++) {
				citys.push(cityData[val[0]].sub[i].name)
			}
			for (let i = 0; i < cityData[val[0]].sub[0].sub.length; i++) {
				countys.push(cityData[val[0]].sub[0].sub[i].name)
			}
			this.setData({
				province: this.data.provinces[val[0]],
				city: cityData[val[0]].sub[0].name,
				citys: citys,
				county: cityData[val[0]].sub[0].sub[0].name,
				countys: countys,
				values: val,
				value: [val[0], 0, 0]
			})
			return;
		}
		if (val[1] != t[1]) {
			console.log('city no');
			const countys = [];
			for (let i = 0; i < cityData[val[0]].sub[val[1]].sub.length; i++) {
				countys.push(cityData[val[0]].sub[val[1]].sub[i].name)
			}
			this.setData({
				city: this.data.citys[val[1]],
				county: cityData[val[0]].sub[val[1]].sub[0].name,
				countys: countys,
				values: val,
				value: [val[0], val[1], 0]
			})
			return;
		}
		if (val[2] != t[2]) {
			console.log('county no');
			this.setData({
				county: this.data.countys[val[2]],
				values: val
			})
			return;
		}
	},
	bindDateChange: function (e) {
		this.setData({
			date: e.detail.value
		})
	},
	getphone: function (e) {
		this.data.phonenum = e.detail.value;

		var phone = e.detail.value;
		var state = true
		var phoneTxt = false

		if (phone.length > 0) {
			if ((/^((13[0-9])|(17[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/.test(phone))) {
				state = false
			}
			phoneTxt = true
		}
		this.setData({
			phoneY: state,
			phoneTxt: phoneTxt,
		})
	},
	//获取验证码
	countdown: function () {
		var phone = this.data.phonenum
		if ((/^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/.test(phone))) {
			util.aftModal({
				title: '手机号错误',
				icon: 'loading'
			})
			return false;
		}
		var second = this.data.second
		var that = this
		var timestamp = (Date.parse(new Date())) / 1000
		var sign = MD5Util.sign(timestamp)
		if (phone && second == 60) {

			wx.request({
				url: 'https://www.aftdc.com/wxapp/Order/send',
				method: 'POST',
				data: {
					phone: phone,
					userId: that.data.userId,
					sign: sign,
					timestamp: timestamp(),
					token: wx.getStorageSync('usersInfo').token,
				},
				header: { "Content-Type": "application/x-www-form-urlencoded" },
				success: function (res) {
					if (res.data.res == 0) {
						that.setData({
							noYan: true
						})
					}
					else {
						that.setData({
							countdown: ''
						});
						that.second()//60s倒计时
						that.setData({
							//返回验证码
							code: res.data.code,
							noYan: false
						})
					}
				}
			})
		}
	},
	//验证验证码
	checkyzm: function (e) {
		var yzm = e.detail.value
		var code = this.data.code
		if (yzm == code) {
			this.setData({
				yzm: true
			})
		} else {
			this.setData({
				yzm: false
			})
		}
		var codesTxt = false
		if (yzm.length > 0) {
			codesTxt = true;
		}
		this.setData({
			codesTxt: codesTxt,
		})
	},
	second: function () {
		var second = this.data.second
		var that = this
		if (second > 0) {
			var time = setTimeout(function () {
				that.setData({
					second: second - 1
				});
				that.second();
			}, 1000)
		} else {
			that.setData({
				second: 60,
				countdown: 'countdown'
			});
		}
	},
	formSubmit: function (e) {
		var userId = this.data.userId
		var dat = e.detail.value
		var data = JSON.stringify(dat)
		if (!dat.company || !dat.address || !dat.time || !dat.scale || !dat.money || !dat.operation || !dat.city || !dat.resource || !dat.name || !dat.cityScale) {
			util.aftModal({
				title: '请填写完整',
				icon: 'loading'
			})
			return false;
		}
		// if (!this.data.yzm) {
		//   util.aftModal({
		//     title: '请正确填写手机号',
		//     icon: 'loading'
		//   })
		//   return false;
		// }
		var em = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
		var bChk = em.test(dat.email);
		if (!bChk) {
			util.aftModal({
				title: '请正确填写邮箱',
				icon: 'loading'
			})
			return false;
		}
		if (!(/^(\d{18}|\d{17}x)$/.test(dat.identity))) {
			util.aftModal({
				title: '请正确填写身份证',
				icon: 'loading'
			})
			return false;
		}
		var region = this.data.region
		for (var i = 0; i < region.length; i++) {
			if (!Boolean(region[i])) {
				util.aftModal({
					title: '请选择城市',
					icon: 'loading'
				})
				return false;
			}
		}

		var userId = wx.getStorageSync('usersInfo').userId;
		var that = this
		var timestamp = (Date.parse(new Date())) / 1000
		var sign = MD5Util.sign(timestamp)
		wx.request({
			url: 'https://www.aftdc.com/wxapp/Service/insert_city',
			header: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			data: {
				sign: sign,
				timestamp: timestamp,
				token: wx.getStorageSync('usersInfo').token,
				userId: userId,
				arr: data
			},
			method: "POST",
			success: function (res) {
				console.log(res)
				// if (res.data.isUse == 0) {
				//   util.aftModal({
				//     title: '你的账号已被封停！无法进行该操作',
				//     icon: 'loading'
				//   })
				//   return false
				// }
				if (res.data.res == 1) {
					util.aftModal({
						title: res.data.info,
						icon: '12',
						success: setTimeout(function () {
							wx.switchTab({
								url: 'https://image.aftdc.com/images/packageA/index/index',
							})
						}, 2000)
					})
				} else {
					util.aftModal({
						title: res.data.info,
						icon: 'loading'
					})
				}
			}
		})
	},


	closeTxt: function (e) {
		var index = e.currentTarget.dataset.index;
		if (index == 1) {
			this.setData({
				phonenum: '',
				phoneNumber: '',
				phoneY: true,
				phoneTxt: false,
			})
		}
		else if (index == 2) {
			this.setData({
				yzmNumb: '',
				codesTxt: false,
				yzm: false,
			})
		}

	},
	bindRegionChange: function (e) {
		console.log('picker发送选择改变，携带值为', e.detail.value)
		this.setData({
			region: e.detail.value,
		})
	},

	// ------------------------------------------ 示例图片-----------------------------------------
	exampleFn: function (e) {
		var index = e.currentTarget.dataset.index;
		var val = this.data.imgData[index];
		this.setData({
			exampleData: val,
			togle: 4,
		})
	},

	//-------------- 关闭弹框 -----------
	togleFn: function () {
		this.setData({
			togle: false,
		})
	},
})