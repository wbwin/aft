window.onload = function () {
    $.ajax({
        url: 'https://www.aftdc.com/pc/Index/wx_message',
        type: 'post',
        async: false,
        data: {},
        success: function (res) {
            if (res.res == 1) {
                var dataz = res.data.users
                var data = JSON.stringify(dataz);
                var storage = window.localStorage;
                storage.removeItem('admin')
                storage.setItem("admin", data);

            }
        }
    })
    var admin = JSON.parse(localStorage.getItem('admin'));
    if (!admin) {
        var test = window.location.href;
        var storage = window.localStorage;
        storage.removeItem('jumpUrl')
        storage.setItem("jumpUrl", test);
        console.log(test)
        location.href = "/pc/login.html";
    } else {
        var app = new Vue({
            el: '#app',
            data: {
                userId: '',
                orderId: '',
                dataz: {},
                geographic: '',
                complain: ['餐厅刷单', '商家资质', '商家价格问题', '商家品类', '商家logo问题', '商家配送问题', '其他问题'],//举报主题
                vip: "",
            },
            created: function () {
                var that = this
                that.userId = admin.userId;
                var url = location.search;
                var orderId = url.substr(1);
                that.orderId = orderId.replace('orderId=', '');
                that.geographic = window.localStorage.getItem("geographic");
                axios({
                    method: "post",
                    url: "/pc/Order/order_details",
                    data: {
                        userId: that.userId,

                        orderId: that.orderId,
                    }
                }).then(function (res) {
                    console.log(res);
                    if (res.data.res == 1) {
                        that.dataz = res.data.data;
                        var timestamp = Date.parse(new Date()) / 1000;
                        var createTime = new Date(res.data.data.createTime)
                        createTime = createTime.getTime() / 1000
                        if (that.dataz.orderStatus == -2 && timestamp - createTime > 900) {
                            that.dataz.orderStatus = -1
                        }
                        axios({
                            method: 'post',
                            url: '/pc/Index/userOfshop',
                            data: {
                                shopId: that.dataz.shopId,
                                userId: that.userId
                            }
                        }).then(function (res) {
                            console.log(res)
                            if (res.data.res == 1) {
                                that.vip = res.data.vip
                            }

                        })
                    }
                })


            },
            methods: {
                addressclick: function () {
                    location.href = "/pc/home.html"
                },
                // textearNoClick: function () {
                //     console.log(1)
                //     $('#textear').attr("disabled", true);
                // },
                // textearoffClick: function () {
                //     console.log(2)
                //     $('#textear').attr("disabled", false);
                // },
                bottomClick: function () {
                    var that = this
                    var reType = $('input[name="1"]:checked').parent().text();

                    var text = $('#textear').val();
                    if (!reType) {
                        alert('请选择投诉举报主题！')
                        return false
                    }
                    if (!text) {
                        alert('请填写投诉举报理由！')
                        return false
                    }
                    axios({
                        method: "post",
                        url: "/pc/Order/shopReport",
                        data: {
                            reType: reType,
                            text: text,
                            userId: that.userId,
                            shopId: that.dataz.shopId,
                        }
                    }).then(function (res) {
                        if (res.data.res == 1) {
                            alert('提交成功！');
                            location.reload();
                        }
                        else {
                            alert('提交失败！');
                            return false
                        }
                    })
                },
                alltousuClick: function () {
                    $('.thistousu').show();
                },
                logout: function () {
                    $('.thistousu').hide();
                },
                collectClick: function () {
                    var that = this;
                    if (that.dataz.collect == 1) {
                        axios({
                            method: "post",
                            url: '/pc/Shop/delete_collect',
                            data:
                                {
                                    userId: that.userId,
                                    shopId: that.dataz.shopId
                                },
                        }).then(function (res) {
                            console.log(res)
                            if (res.data.res == 1) {
                                that.dataz.collect = 0;
                            }
                        })

                    }
                    else {
                        axios({
                            method: "post",
                            url: '/pc/Shop/collect',
                            data:
                                {
                                    userId: that.userId,
                                    shopId: that.dataz.shopId
                                },
                        }).then(function (res) {
                            console.log(res)
                            if (res.data.res == 1) {
                                that.dataz.collect = 1;
                            }
                        })

                    }
                },
                againClick: function () {//再来一份

                    var that = this
                    axios({
                        method: "post",
                        url: "/pc/Shop/once_more",
                        data: {
                            orderId: that.orderId
                        }

                    }).then(function (res) {
                        console.log(res)
                        if (res.data.res == -2) {
                            that.msg = '该商家不存在，请您选择其他商家下单'
                            $('.backG').show();
                            $('.msgbox').show();
                        } else if (res.data.res == -3) {
                            that.msg = '该商家已停业，请您选择其他商家下单'
                            $('.backG').show();
                            $('.msgbox').show();
                        } else if (res.data.res == -4) {
                            that.msg = '商家不在营业时间，请您选择其他商家下单'
                            $('.backG').show();
                            $('.msgbox').show();
                        } else if (res.data.res == -5) {
                            that.msg = '商品不存在，请您选择其他商品下单'
                            $('.backG').show();
                            $('.msgbox').show();
                        } else if (res.data.res == 1) {
                            var datas = res.data
                            var dataz = res.data.data;
                            var car = [];

                            for (var i = 0; i < dataz.length; i++) {
                                var arr = {arr};
                                arr.arr = dataz[i];

                                car.push(arr);

                            }
                            var indexObj = {
                                car: car,
                                shopId: datas.shopId,
                                shopName: datas.shopName,
                                deliveryStartMoney: datas.deliveryStartMoney,
                                deliveryFreeMoney: datas.deliveryFreeMoney,
                            };
                            var indexNewObj = new Object(indexObj)
                            var stor = window.localStorage;
                            stor.setItem("indexCar", JSON.stringify(indexNewObj));
                            location.href = '/pc/submit.html'
                        }

                    })

                },
                nameClick: function () {
                    var that = this
                    location.href = '/pc/shop.html?shopId=' + that.dataz.shopId
                },
                payClick: function () {
                    var that = this
                    axios({
                        method: "post",
                        url: "/pc/Shop/once_more",
                        data: {
                            orderId: that.orderId
                        }

                    }).then(function (res) {
                        if (res.data.res == 1) {
                            var datas = res.data
                            var dataz = res.data.data;

                            var arr = [];
                            for (var i = 0; i < dataz.length; i++) {

                                arr.push(dataz[i]);


                            }

                            var car = {arr: arr};
                            var createTime = new Date(that.dataz.createTime)
                            var timestamp = createTime.getTime() / 1000
                            var orders = {
                                orderId: that.orderId, //订单Id
                                orderNo: that.dataz.orderNo, //订单号
                                timestamp: timestamp,
                                shopName: that.dataz.shopName, //店铺名
                                userName: that.dataz.userName,  //用户名
                                userPhone: that.dataz.userPhone,  //用户号码
                                address: that.dataz.userAddress, //用户地址
                                car: JSON.stringify(car),  //购物车
                                price: that.dataz.totalMoney, //未优惠价格
                                userMoney: that.vip, //用户余额
                                true_pay: that.dataz.needPay  //优惠价格
                            }
                            orders = new Object(orders)
                            orders = JSON.stringify(orders)
                            window.localStorage.setItem('order', orders) //缓存
                            window.localStorage.removeItem('indexCar')
                            location.href = '/pc/place.html'
                        }
                    })
                },
                cencelClick: function () {
                    var that = this
                    if (confirm('确定取消删除订单？？？')) {
                        axios({
                            method: "post",
                            url: "/pc/Order/delOrder",
                            data: {
                                orderId: that.orderId,
                                userId: that.userId
                            }
                        }).then(function (res) {
                            if (res.data.res == 1) {
                                alert('已取消删除订单！')
                                history.back();
                            }

                        })
                    }
                },
            },
        })
    }
}