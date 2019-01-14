var app = getApp();
var MD5Util = require('../../../../utils/md5.js');
Page({

    data: {
        serveData: ['顾客在线支付', '在线结算', '享受优质商家排名', '专享活动'],
        choice: 0,//配送选择 1为商家配送，2为阿凡提配送

        choiceTxt: [
            {
                name: '商家配送', per: '收取提现手续费0.06%',
                //  { name: '商家配送', per: '堂食、外卖每单收取3%服务费', 
                //    shili: ['假设今日在线支付营业额4000元', '应收服务费4000*3.00%=120.00元']
                shili: ['假设今日在线支付营业额4000元', '应收手续费为4000*0.06%=2.4元']
            },
            //  {
            //    name: '阿凡提配送', per: '堂食每单收取3%服务费，外卖每单收取13%服务费',
            //    shili: ['假设今日堂食支付营业额4000元', '应收服务费4000*3.00%=120.00元',
            //           '假设今日外卖支付营业额3000元', '应收服务费4000*13.00%=90.00元'
            //    ]
            //  }
        ],
        modealTxt: {},
        togle: false,
        tipShow: false,//确认提示框
        phone: '',
        token: '',
    },


    onLoad: function (options) {
        var phone = options.phone;//上一页填写跳转的号码
        var token = options.token;//上一页填写跳转的号码
        this.setData({
            phone: phone,
            token: token,
        })
    },
    choiceFn: function (e) {
        var index = e.currentTarget.dataset.index;
        this.setData({
            choice: index,
        })
    },

    datailFn: function (e) {
        var index = e.currentTarget.dataset.index;
        var modealTxt = this.data.choiceTxt[index]
        this.setData({
            togle: true,
            modealTxt: modealTxt,
        })
    },

    closeModeal: function (e) {
        this.setData({
            togle: false,
        })
    },
    //提交
    formSubmit: function (e) {
        var that = this;
        // wx.showToast({
        //   title: '请选择位置',
        //   icon: 'loading',
        //   duration: 2100
        // });
        var choice = this.data.choice;// 1为商家配送，2为阿凡提配送
        console.log(choice)
        if (choice == 0) {
            wx.showToast({
                title: '请选择合作方案',
                icon: 'loading',
                duration: 1200
            })
            return false
        }
        var tipShow = this.data.tipShow;
        this.setData({
            tipShow: true,
        });

    },
    tipCancelClick() {
        var tipShow = this.data.tipShow;
        this.setData({
            tipShow: false,
        });
    },
    tipConfirmClick(e) {
        var formId = e.detail.formId;
        var tipShow = this.data.tipShow;
        this.setData({
            tipShow: false,
        });
        var phone = this.data.phone;
        var token = this.data.token;
        wx.request({
            url: "https://www.aftdc.com/businessapp/Enter/enter_thirdStep",
            data: {
                formId: formId,
                token: token,
                userId:wx.getStorageSync('usersInfo').userId,
                phone: phone,
            },
            method: 'post',
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            success: function (res) {
                if (res.data.res == 1) {
                    wx.showToast({
                        title: '已提交,请留意手机短信',
                        icon: 'none',
                        mask: true,
                        success: setTimeout(function () {
                            wx.navigateTo({//跳转方法
                                url: '../wait/wait?phone=' + phone + '&token=' + token,
                            })
                        }, 2000)
                    })
                } else {
                    wx.showToast({
                        title: res.data.info,
                        icon: 'loading',
                        duration: 2100
                    });
                }
            }
        })
    },
})