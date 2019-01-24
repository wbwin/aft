window.onload = function () {
    var app = new Vue({
            el: '#app',
            data: {
                mode: 2,
                orders: '',
                goods: '',
                money: '',
                orderNo: '',
                urls: '',
                second: '',
                minu: '',
                timestamp: '',
                toggle:1,
            },
            created: function () {
                var geographic = window.localStorage.getItem("geographic")
                console.log(geographic);
                var lat = window.localStorage.getItem("latitude");
                var long = window.localStorage.getItem("longitude");
                console.log(lat);
                console.log(long);
                var order = window.localStorage.getItem('order')//缓存
                order = JSON.parse(order)
                console.log(order);
                this.orders = order
                var good = JSON.parse(order.car)
                this.goods = good
                this.money = order.userMoney.money
                this.orderNo = order.orderNo
                var len = $(".payMode-choice").length
                this.timestamp = order.timestamp
                var timeNow = Date.parse(new Date()) / 1000;
                var apart = timeNow - this.timestamp
                var lastTime = 900 - apart
                this.resetTime(lastTime)
                this.success()

            },
            methods: {
                success: function () {
                    var that = this
                    var timers = setInterval(function () {
                        axios({
                            method: 'post',
                            url: '/pc/Order/checkOrder',
                            data: {
                                orderNo: that.orderNo
                                // orderNo: 15257703930
                            }
                        }).then(function (res) {
                            console.log(res);
                            if (res.data.res == 1) {
                                alert("支付成功")
                                location.href = '/pc/onlyconter.html'
                                window.storage.removeItem('indexCar')
                                clearInterval(timers);
                            }
                        })
                    }, 1000)
                },
                resetTime: function (time) { //支付倒计时
                    var timer = null;
                    var t = time;
                    var m = 0;
                    var s = 0;
                    m = Math.floor(t / 60 % 60);//分钟
                    console.log(m);
                    s = Math.floor(t % 60);//秒
                    console.log(s);

                    function countDown() {
                        var that = this
                        if (s == 0) {
                            s = '59';
                            m = m - 1
                        }
                        s--;
                        if (m < 0) {
                            $(".payMode-choice").removeClass("payModeYes")
                            $(".count").hide()
                            $(".over").show()
                            $(".payBut").css({background: 'rgba(204, 204, 204, 0.66)',color:'rgba(0,0,0,0)'})
                            $(".payButd").show()
                            clearInterval(timer);
                        }

                        if (s < 10) {
                            s = '0' + s
                        }
                        if (m < 10) {
                            m = m
                        }
                        var times = m + "分" + s + "秒"
                        $(".times").text(times)

                    }

                    timer = setInterval(countDown, 1000);

                },
                detail: function () {  //查看详情
                    var that=this;
                    if( that.toggle==1){
                        that.toggle=2
                    }else{
                        that.toggle=1
                    }

                    //
                    //
                    // var addclas = $(".message").hasClass("msg")
                    // if (addclas) {
                    //     $(".message").removeClass("msg")
                    //     $(".descCk").css({display:'block'})
                    //     $(".descSQ").css({display:'none'})
                    // } else {
                    //     $(".message").addClass("msg")
                    //     $(".descCk").css({display:'none'})
                    //     $(".descSQ").css({display:'table-caption'})
                    // }
                },
                Alipay: function () {  //支付宝支付
                    this.mode = 0
                    $(".payMode-choice").removeClass("payModeYes")
                    $(".payMode-zfb").addClass("payModeYes")
                },
                WeChat: function () { //微信支付
                    this.mode = 1
                    $(".payMode-choice").removeClass("payModeYes")
                    $(".pay-wx").addClass("payModeYes")
                },
                payment: function () { //余额支付
                    this.mode = 3
                    $(".payMode-choice").removeClass("payModeYes")
                    $(".pay-ye").addClass("payModeYes")
                },
                pay: function () {  //确定判断
                    var that = this
                    var orderNos = that.orderNo
                    console.log(orderNos);
                    console.log(that.mode);
                    if (that.mode == 0) {    //支付宝支付
                        axios({
                            method: 'post',
                            url: '/pc/Order/AliPayCode',
                            data: {
                                orderNo: orderNos
                            }
                        }).then(function (res) {
                            console.log(res);
                            // if (res.data.res == 1) {
                            that.urls = res.data
                            console.log(that.urls);
                        })
                        $(".payBox p").text("请使用支付宝支付")
                        $(".payqBoxBackZfb").show()

                    } else if (that.mode == 1) {    //微信支付
                        axios({
                            method: 'post',
                            url: '/pc/Order/WxpayCode',
                            data: {
                                orderNo: orderNos
                            }
                        }).then(function (res) {
                            console.log(res);
                            if (res.data.res == 1) {
                                that.urls = res.data.url
                            }
                        })
                        $(".payBox p").text("请使用微信支付")

                        $(".payqBoxBackWx").show()
                    } else if (that.mode == 3) {  //余额支付
                        axios({
                            method: 'post',
                            url: ' /pc/Order/updGoods',
                            data: {
                                orderNo: orderNos
                            }
                        }).then(function (res) {
                            console.log(res);
                            if (res.data.res == 1) {
                                alert('下单成功');
                                location.href = '/pc/onlyconter.html'
                            }
                        })
                    } else if (that.mode == -1) {
                        return false
                    }
                    else {
                        alert('请选择支付方式')
                        return false
                    }
                },
                closePay: function () { //关闭二维码
                    $(".payqBoxBackZfb").hide()
                    $(".payqBoxBackWx").hide()
                }
            }
        }
    )
}