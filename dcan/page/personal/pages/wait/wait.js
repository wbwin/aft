Page({
	data: {
		flag: true,//设置密码
		pwdone: '',//设置密码
		pwdtwo: '',//确定密码
		phone: '',//上一页填写跳转的号码
    token: '',
    enterInfo: [],//申请结果数据
    msg: false,//失败弹框
    disabled: '',
	},

	onLoad: function (options) {
		var phone = options.phone;//上一页填写跳转的号码
    var token = options.token;//上一页填写跳转的号码
		this.setData({
			phone: phone,
      token: token
		})
		var that = this;
		wx.request({
      url: "https://www.aftdc.com/businessapp/Enter/enterInfo",
			data: {
				token: token,
				phone: phone,
			},
      method: 'post',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
			success: function (res) {
        if (res.data.res == 1) {
          var enterInfo = res.data.data;
          if (enterInfo.shopStatus == -1) {
            var msg = true;
          }
          that.setData({
            enterInfo: enterInfo,
            msg: false,
            flag: true,
            disabled: false
          })
        } else {
          wx.showToast({
            title: res.data.info,
            icon: 'loading',
            duration: 1200
          })
          return false
        }
			}
		})
	},

	// 下拉加载
	onPullDownRefresh: function (e) {
		var phone = this.data.phone;
    var token = this.data.token;
		var opa = { phone: phone, token: token }
		this.onLoad(opa);
		wx.hideNavigationBarLoading() //完成停止加载
		wx.stopPullDownRefresh()
	},

  //失败弹框
  closeMsg: function () {
    var msg = this.data.msg;
    msg = !msg;
    this.setData({
      msg: msg
    })
  },

  //隐藏密码弹出
  // hide: function() {
  //   var flag = !this.data.flag;
  //   this.setData({
  //     flag: flag
  //   })
  // },

	//注销
  deleteShop: function () {
    this.setData({
      disabled: 'disabled'
    })
    var phone = this.data.phone;
    var token = this.data.token;
		var that = this;
		wx.showModal({
			title: '提示',
      content: "注销店铺将删除您在阿凡提点餐的全部信息，点击'取消'关闭窗口",
			success: function (q) {
				if (q.confirm) {
          wx.request({
            url: 'https://www.aftdc.com/businessapp/Enter/deleteShop',
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
              phone: phone,
              token: token
            },
            method: "POST",
            success: function (res) {
              if (res.data.res == 1) {
                wx.showToast({
                  title: "注销成功！",
                  mask: true,
                  icon: 'loading',
                  success: setTimeout(function () {
                    wx.switchTab({
                      url: '/page/tabBar/homePage/index',
                    })
                  }, 1000)
                })
              } else {
                wx.showToast({
                  title: '注销失败，重试',
                  mask: true,
                  icon: 'loading',
                  success: setTimeout(function () {
                    that.setData({
                      disabled: false,//点一次就不能在点了
                    })
                  }, 1000)
                });
                return false
              }
            }
          })
        } else if (q.cancel) {
          setTimeout(function () {
            that.setData({
              disabled: false,//点一次就不能在点了
            })
          },1000)
        }
			}
		})
	},

  //判断是否已完成上一步了
  is_complete: function(e) {
    var num = e.currentTarget.dataset.num;
    var enterInfo = this.data.enterInfo;
    if (num == 2) {
      if (enterInfo.progress > 0) {
        wx.navigateTo({
          url: '../aptitude/aptitude?phone=' + this.data.phone + '&token=' + this.data.token + '&is_fill_in=' + this.data.is_fill_in,
        })
      } else {
        wx.showToast({
          title: '请先完成上一步',
          icon: 'loading',
          duration: 2000
        })
      }
    }
    if (num == 3) {
      if (enterInfo.progress > 1) {
        wx.navigateTo({
          url: '../scheme/scheme?phone=' + this.data.phone + '&token=' + this.data.token + '&is_fill_in=' + this.data.is_fill_in,
        })
      } else {
        wx.showToast({
          title: '请先完成上一步',
          icon: 'loading',
          duration: 2000
        })
      }
    }
  },

  //设置密码
  setMima: function (e) {
		this.setData({
			flag: false,//点一次就不能在点了
		})
	},
	detaone: function (e) {
		var val = e.detail.value;
		this.setData({
			pwdone: val
		})
	},
	detatwo: function (e) {
		var val = e.detail.value;
		this.setData({
			pwdtwo: val
		})
	},
	formSubmit: function (e) {
		// var formData = e.detail.value;//-------------------提交表单数据
		var pwdone = this.data.pwdone;
		var pwdtwo = this.data.pwdtwo;
		var phone = this.data.phone;
    var token = this.data.token;
    this.setData({
      disabled: 'disabled'
    })
		var that = this;
    if (pwdone == '' || pwdtwo == '') {
      wx.showToast({
        title: '请填写密码',
        mask: true,
        icon: 'loading',
        success: setTimeout(function () {
          that.setData({
            disabled: false,//点一次就不能在点了
          })
        }, 1000)
      });
      return false
    }

    if (pwdone !== pwdtwo) {
      wx.showToast({
        title: '两次密码不一致',
        mask: true,
        icon: 'loading',
        success: setTimeout(function () {
          that.setData({
            disabled: false,//点一次就不能在点了
          })
        }, 1000)
      });
      return false
    }
    if (pwdtwo.length < 8) {
      wx.showToast({
        title: '密码至少8位数',
        mask: true,
        icon: 'loading',
        success: setTimeout(function () {
          that.setData({
            disabled: false,//点一次就不能在点了
          })
        }, 1000)
      });
      return false
    }
    var pattern = /^.*(?=.{8,30})(?=.*\d)(?=.*[A-z])(?=.*[!@#$%^&*?.,_+\(\)]).*$/;
    var a = pattern.test(pwdtwo);
    if (!a) {
      wx.showToast({
        title: '密码需要包含字母，数字，符号',
        mask: true,
        icon: 'none',
        success: setTimeout(function () {
          that.setData({
            disabled: false,//点一次就不能在点了
          })
        }, 1000)
      });
      return false
    }
		wx.request({
      url: 'https://www.aftdc.com/businessapp/Enter/setPassword',
			data: {
				token: token,
        passWord: pwdtwo,
				phone: phone
			},
      method: 'post',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
			success: function (data) {
				if (data.data.res == 1) {
					wx.showToast({
            title: "设置成功",
						mask: true,
						icon: 'loading',
						success: setTimeout(function () {
							wx.switchTab({
                url: '/page/tabBar/homePage/index',
							})
						}, 1000)
					})
				} else {
					wx.showToast({
            title: '设置失败,重试',
            mask: true,
            icon: 'loading',
            success: setTimeout(function () {
              that.setData({
                disabled: false,//点一次就不能在点了
              })
            }, 1000)
					});
          var flag = that.data.flag;
          flag = !flag;
          that.setData({
            flag: flag
          })
          return false;
				}
			}
		})
	} 
})