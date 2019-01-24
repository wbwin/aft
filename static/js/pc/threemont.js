window.onload = function () {
    $.ajax({
        url: 'https://www.aftdc.com/pc/Index/wx_message',
        type:'post',
        async:false,
        data:{},
        success:function(res){
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
                dataz: {},
                pageNumb: 0, //总页数
                pageCurent: 1, //当前页
                pageEach: 10, //每一页显示数据条数
                userId: '',
                geographic: '',
                timer: '',
                msg: '',
                userInfo:'',
                vip:'',
            },
            created: function () {
                var that = this
                that.userId = admin.userId;
                that.geographic = window.localStorage.getItem("geographic");
                console.log(that.geographic)
                that.pageFn(1);
            },
            methods: {
                //------------------------分页跳转------------------------------------
                pageFn: function (pageCurent) {
                    var that = this;
                    var page = (pageCurent - 1) * that.pageEach;
                    that.pageCurent = pageCurent;
                    axios({
                        method: "post",
                        url: "/pc/Order/threemont",
                        data: {
                            page: page,
                            userId: that.userId,
                        },
                    }).then(function (res) {
                        console.log(res)
                        if (res.data.res == 1) {
                            that.dataz = res.data.orderList
                            that.userInfo=res.data.userinfo;
                            for(var i=0;i<that.dataz.length;i++){
                                var timestamp = Date.parse(new Date())/1000;
                                var createTime=new Date(res.data.orderList[i].createTime)
                                createTime=createTime.getTime()/1000
                                if( that.dataz[i].orderStatus=='等待付款'&&timestamp-createTime>900){
                                    that.dataz[i].orderStatus='已取消'
                                }
                            }

                            //初始化页数
                            var pageCount = Number(res.data.orderCount);
                            var pageEach = Number(res.data.orderEachPage);
                            that.pageEach = pageEach;
                            var pageNumb = Math.ceil(pageCount / pageEach);
                            that.pageNumb = pageNumb;

                        }


                    })


                },

                //**********
                chack: function (item) {
                    return a;
                },
                dingdanxiangqinClick: function (item) {
                    location.href = '/pc/dingdanxiangqin.html?orderId=' + item.orderId;
                },
                shopImgClick: function (item) {
                    location.href = '/pc/shop.html?shopId=' + item.shopId;
                },
                addressclick: function () {
                    location.href = "/pc/home.html"
                },
                againClick: function (item) {//再来一份
                    console.log(item);
                    var that = this
                    axios({
                        method: "post",
                        url: "/pc/Shop/once_more",
                        data: {
                            orderId: item.orderId
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
                                deliveryCostTime:datas.deliveryCostTime
                            };
                            var indexNewObj = new Object(indexObj)
                            var stor = window.localStorage;
                            stor.setItem("indexCar", JSON.stringify(indexNewObj));
                            location.href='/pc/submit.html'
                        }

                    })
                },
                out: function () {
                    $('.backG').hide();
                    $('.msgbox').hide();
                },
                dingdanxiangqinOver: function (event) {
                    var that = this;
                    that.timer = setTimeout(function () {
                        $(event.target).parent().find('.goodsNameHide').show();
                    }, 500)
                },
                dingdanxiangqinOut: function () {
                    var that = this
                    $('.goodsNameHide').hide();
                    clearTimeout(that.timer)
                },
                goodsName: function (item) {
                    var goodsName = '';
                    var goodsNames = '';

                    var goodsCount = item.goodsCount;
                    for (var i = 0; i < goodsCount.length; i++) {

                        goodsName = goodsCount[i].goodsName

                        if (i >= 1 && i < 2) {
                            goodsName = goodsNames + '/' + goodsName
                        } else if (i >= 2) {
                            goodsName = goodsNames + '  等商品'
                            break

                        }

                        goodsNames = goodsName
                    }
                    return goodsName
                },
                goodsNameHide: function (item) {
                    var goodsNameHide = '';
                    var goodsNameHides = '';
                    var goodsCount = item.goodsCount;
                    for (var i = 0; i < goodsCount.length; i++) {

                        goodsNameHide = goodsCount[i].goodsName
                        if (i >= 1) {
                            goodsNameHide = goodsNameHides + '/' + goodsNameHide
                        }


                        goodsNameHides = goodsNameHide
                    }
                    return goodsNameHide
                },
                goodsLength: function (item) {
                    var goodsLength = item.goodsCount.length;
                    return goodsLength
                },
                payClick: function (item) {
                    var that = this
                    axios({
                        method: 'post',
                        url: '/pc/Index/userOfshop',
                        data: {
                            shopId: item.shopId,
                            userId: that.userInfo.userId
                        }
                    }).then(function (res) {
                        console.log(res)
                        if (res.data.res == 1) {
                            that.vip = res.data.vip
                        }

                    })
                    axios({
                        method: "post",
                        url: "/pc/Shop/once_more",
                        data: {
                            orderId: item.orderId
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
                            var createTime = new Date(item.createTime)
                            var timestamp = createTime.getTime() / 1000
                            var orders = {
                                orderId: item.orderId, //订单Id
                                orderNo: item.orderNo, //订单号
                                timestamp: timestamp,
                                shopName: item.shopName, //店铺名
                                userName: that.userInfo.userName,  //用户名
                                userPhone: that.userInfo.userPhone,  //用户号码
                                address: item.userAddress, //用户地址
                                car: JSON.stringify(car),  //购物车
                                price: item.totalMoney, //未优惠价格
                                userMoney: that.vip, //用户余额
                                true_pay: item.realTotalMoney  //优惠价格
                            }
                            orders = new Object(orders)
                            orders = JSON.stringify(orders)
                            window.localStorage.setItem('order', orders) //缓存
                            window.localStorage.removeItem('indexCar')
                            location.href = '/pc/place.html'
                        }
                    })
                },
            },
        })
    }
}