window.onload = function() {


    var app = new Vue({
        el: "#wait",
        data: {
            one: { $one },
            two: { $two },
            three: { $three },
            five: { $five },

        },
        created: function() {
            var type = { $type }; //支付状态
            if (type == 2) {
                $('.ewm').show();
                $('.onebuts').show();
                var codeUrl = $('input[name=wxcode]').val();
                $('.ImgerTu').attr('src', "http://paysdk.weixin.qq.com/example/qrcode.php?data=" + encodeURI(codeUrl))
            }
            var shopId = window.localStorage.getItem("shopId");
            if (shopId == '' || shopId == null) {
                shopId = sessionStorage.getItem('shopId');
            }
            var time; //设置定时器
            time = setInterval(dsq, 4000);
            var four = { $four }; //是否循环查询
            if (type == 1 || four == -2) {
                clearInterval(time)
            }
            //已注销
            if (four == -2) {
                $('.logout').hide();
                $('.delete').show();
            }
            var getting = {
                url: "{:U('getting')}",
                data: { shopId: shopId },
                dataType: 'json',

            };

            function dsq() {
                axios(getting).then(function(res) {
                    console.log(res)
                    if (res.code == 1) {
                        clearInterval(time)
                        alert(res.info)
                        if (confirm('是否回到初始页面')) {
                            window.localStorage.removeItem("ok");
                            // window.localStorage.removeItem("shopId");
                            location.href = "/index.php/Business/Annex/add";
                        }
                    }
                    if (res.code == 2) {
                        clearInterval(time)
                        alert(res.info)
                        if (confirm('是否回到初始页面')) {
                            window.localStorage.removeItem("ok");
                            // window.localStorage.removeItem("shopId");
                            location.href = "/index.php/Business/Annex/add";
                        }
                    }
                })
            }
            var five = this.five; //这个是设置密码
            console.log(five)
            if (five == 1) {
                // $('.password').show();
                $('.twobuts').show();
                $('.logout').hide();
            }
            //显示状态
            if (one == 0 || two == 0 || three == 0) {
                $(".five").css({ "background": "#00abe4" }); //待提交开店申请
            }
            if (one == 1 && two == 1 && three == 1 && type != 2 && five != 1) {
                $(".one").css({ "background": "#00abe4" }); //待审核
            }
            if (one == 1 && two == 1 && three == 1 && type == 2) {
                $(".two").css({ "background": "#00abe4" }); //请支付
            }
            if (one == 1 && two == 1 && three == 1 && five == 1) {
                $(".three").css({ "background": "#00abe4" }); //完成交易
            }
            if (type != 2) {
                $('.ImgerTu').hide();
            }
            if (one == 1) {
                $('.THone').hide();
            }
            if (two == 1) {
                $('.THtwo').hide();
            }
            if (three == 1) {
                $('.THthr').hide();
            }
            // var shopId = sessionStorage.getItem('shopId');
            // console.log(shopId)
            // var userId = 65;
            // var that=this;
            // $.ajax({
            //   url: "https://www.aftdc.com/index.php/wxapp/Shops/queryone",
            //   data:{
            //     userId: userId,
            //   },
            //   type:"post",
            //   success: function (all){

            //     that.setData({
            //       info: all,
            //       choice: res.type,
            //       two: res.two,
            //     })
            //     //.....
            //     if (all.shopStatus==3){
            //       that.infoFn();
            //     }
            //   }
            // })
        },
        methods: {
            //点击弹出书写原因
            logoutClick: function() {
                $('.why').show();
            },
            //退款//付钱就退不了
            submitClick: function() {
                var cause = $('.cause').val();
                if (cause == '') {
                    alert('请输入内容')
                    return false;
                }
                axios({
                    methods: "post",
                    url: "{:U('refund')}",
                    data: {
                        shopId: shopId,
                        cause: cause
                    },
                }).then(function(data) {
                    if (data.code == 1) {
                        $('.why').hide();
                        clearInterval(time)
                        window.localStorage.removeItem("ok");
                        window.localStorage.removeItem("shopId");
                        alert(data.info)
                        top.location.reload();
                    } else {
                        alert(data.info)
                    }
                })

            },
            //这个是跳转店铺信息https://www.aftdc.com/index.php/wxapp/Shops/inputCode

            ShongClick: function() {
                var one = this.one;
                if (one == 0) {
                    window.localStorage.setItem('shopId', shopId)
                    window.localStorage.setItem('ok', 1)
                    location.href = "/index.php/Business/Branch/settInfo";
                } else {
                    alert('已填写')
                }
            },

            //这个是跳转资质信息
            UnongClick: function() {
                var two = this.two;
                if (two == 0) {
                    window.localStorage.setItem('shopId', shopId)
                    window.localStorage.setItem('ok', 1)
                    location.href = "/index.php/Business/Branch/aptitude";
                } else {
                    alert('已填写')
                }
            },
            //这个是跳转资质信息
            GnongClick: function() {
                var three = this.three;
                if (three == 0) {
                    window.localStorage.setItem('shopId', shopId)
                    window.localStorage.setItem('ok', 1)
                    location.href = "/index.php/Business/Branch/scheme";
                } else {
                    alert('已填写')
                }
            },

            pwdClick: function() {
                var pwdone = $('.pwdone').val();
                var pwdtwo = $('.pwdtwo').val();
                if (pwdone != pwdtwo || pwdtwo == '' || !/^[a-zA-Z][a-zA-Z0-9_]{5,15}$/.test(pwdtwo)) {
                    alert('请正确填写密码')
                    return false
                }
                axios({
                    methods: "post",
                    url: "{:U('Business/Branch/enter')}",
                    data: {
                        login_password: pwdtwo,
                        shopId: shopId
                    },
                }).then(function(e) {
                    if (e) {
                        window.localStorage.removeItem("ok");
                        window.localStorage.removeItem("shopId");
                        // top.location.reload();
                        location.href = "/index.php/Business/Annex/add";
                    } else {
                        alert('失败')
                    }

                })

            },
            deleteClick: function() {
                axios({
                    methods: "post",
                    url: "{:U('del')}",
                    data: {
                      shopId: shopId 
                    },
                }).then(function(a) {
                  if (a == 1) {
                        alert('删除店铺成功')
                        location.href = "/index.php/Business/Annex/add";
                    } else {
                        alert('失败')
                    }
                })
                
            },
            togleEwm: function() {
                $('.ewm').toggle();
            },
            toglePas: function() {
                $(".password").toggle()
            }
        }
    })
}