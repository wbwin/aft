window.onload = function () {
    $.ajax({
        url: '/pc/Index/wx_message',
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
        location.href = "/pc/login.html";
    } else {
        var app = new Vue({
            el: '#app',
            data: {
                geographical: '',
                lat: '',
                lng: '',
                car: '',
                shopIds: '',
                msgData: '',
                indexCar: '',
                message: '',
                delivery: '',
                lunch: 0,
                numSun: 0,
                priceSun: 0,
                vip: '',
                discount: '',
                priceSuns: '',
                goodsStock: [],
                kucun: [],
                numSuns: '',
                totalprice: '',
                goodId: '',
                firstPrice: '',
                deliveryFreeMoney: '',
                Minimum: '',
                adrState: -1, // 右边数据
                adrbox: {},
                errShow: [0, 0, 0, 0],
                adrmore: false,
                addrData: [],
                addrText: {},
                adrArry: [],
                addressed: '',
                addresseds: '',
                adrNum: '',
                adrCloseId: '',
                dateSort: [],
                dateSorts: '',
                addClassIndex: 0,
                isAddress: false,
                subtotal: '', //小计
                arr: [],
                deduction: '',
                totalpriced: '',
                msgArrCar: [],
                size: [],
                sizeIndex: [],
                sizeleng: '',
                taste: [],
                tasteIndex: [],
                tasteleng: '',
                inputCarMark: '',

            },
            created: function () {
                var geographic = window.localStorage.getItem("geographic")
                console.log(geographic);
                var lat = window.localStorage.getItem("latitude");
                var long = window.localStorage.getItem("longitude");
                console.log(lat);
                console.log(long);
                var that = this
                var geographic = window.localStorage.getItem("geographic");//地理位置缓存
                var datas = localStorage.getItem("indexCar");// 获取数据缓存
                var indexCars = JSON.parse(datas)
                var addresseded = window.localStorage.getItem("addressededs")
                this.geographical = geographic //地址
                console.log(this.geographical);
                this.addresseds = JSON.parse(addresseded) //转换为为整型
                console.log(this.addresseds);
                this.indexCar = indexCars
                if (this.indexCar == null) {
                    this.indexCar = ''
                }
                console.log(this.indexCar);
                this.msgData = admin   //获取缓存
                console.log(this.msgData);
                this.message = this.indexCar.car  //数据
                this.delivery = this.indexCar.deliveryStartMoney //配送费
                this.deliveryFreeMoney = this.indexCar.deliveryFreeMoney //起送价
                console.log(this.deliveryFreeMoney);
                if (that.message) {
                    for (var i = 0; i < this.message.length; i++) {
                        var lunchs = that.message[i].arr.boxFee //餐盒费
                        that.numSuns = that.message[i].arr.numb  //数量
                        that.priceSuns = that.message[i].arr.shopPrice //价格
                        console.log(that.priceSuns);
                        that.lunch = parseInt(this.lunch * 100) / 100 + parseInt(lunchs * 100) / 100  //总餐盒费
                        that.numSun = that.numSun + parseInt(that.numSuns * 100) / 100  //总数量
                        that.priceSun = that.priceSun + parseInt(that.priceSuns * 100) / 100 * that.numSuns  //商品一共多少钱
                        var goodsStocks = that.message[i].arr.goodsStock
                        var sizes = that.message[i].arr.decide.size
                        that.goodsStock = that.goodsStock.concat(goodsStocks)
                        console.log(sizes);
                        that.size = that.size.concat(sizes) //规格种类
                        console.log(that.size);

                        if (that.message[i].arr.size && that.message[i].arr.size.length > 0) {
                            console.log(666);
                            var kucuns = that.message[i].arr.size[this.size[i]].kucun
                            console.log(kucuns);
                        } else {
                            console.log(777);
                            var kucuns = ''
                            console.log(kucuns);
                        }
                        that.kucun = that.kucun.concat(kucuns)
                        console.log(that.kucun);
                    }
                }
                axios({
                    method: "post",
                    url: '/pc/Order/getAddress',
                    data: {
                        shopId: that.indexCar.shopId,
                        userId: that.msgData.userId
                    }
                }).then(function (res) {
                    console.log(res);
                    if (res.data.res == 1) {
                        if (that.addresseds == null) {
                            that.addressed = res.data.data
                        } else {
                            that.addressed = that.addresseds
                        }

                        console.log(that.addressed);
                    }
                })
                axios({
                    method: 'post',
                    url: '/pc/Index/userOfshop',
                    data: {
                        shopId: that.indexCar.shopId,
                        userId: that.msgData.userId
                    }
                }).then(function (res) {
                    if (res.data.res == 1) {
                        console.log(res);
                        that.vip = res.data.vip
                        console.log(that.vip);
                        that.discount = that.vip.zk //折扣
                        console.log(that.discount);
                        that.groupId = that.vip.groupId //判断是否会员
                        console.log(that.groupId);
                        if (that.groupId > 1) {
                            that.firstPrice = that.priceSun * that.discount / 10
                            that.totalprice = (parseInt(that.firstPrice * 100) / 100 + parseInt(that.delivery * 100) / 100 + parseInt(that.lunch * 100) / 100).toFixed(2) //优惠后价格
                            that.deduction = parseInt(that.priceSun * (10 - that.discount) * 10) / 100 //优惠了多少
                            that.totalpriced = (parseInt(that.priceSun * 100) / 100 + parseInt(that.delivery) + parseInt(that.lunch * 100) / 100).toFixed(2)  //未优惠价格
                        } else {
                            that.firstPrice = that.priceSun + parseInt(that.delivery)
                            that.totalprice = (parseInt(that.firstPrice * 100) / 100 + parseInt(that.lunch * 100) / 100).toFixed(2)
                            that.deduction = 0
                            that.totalpriced = parseInt(that.totalprice * 100) / 100
                            that.discount = 0
                        }
                    }
                })
                console.log(this.indexCar);
                console.log(that.indexCar.deliveryCostTime);
                var deliveryCostTime = parseInt(that.indexCar.deliveryCostTime * 100) / 100
                console.log(deliveryCostTime);
                that.times(deliveryCostTime)
            },
            methods: {
                loginoutClick: function () {//退出登录
                    var storage = window.localStorage;
                    storage.removeItem('admin')
                    location.reload();
                },
                indexClick: function () {
                    location.href = '/pc/index.html'
                },
                shopClick: function () { //跳转店铺
                    shopId = this.indexCar.shopId
                    console.log(shopId);
                    location.href = '/pc/shop.html?shopId=' + shopId
                },
                carSub: function (num) { //购物车删除
                    var that = this
                    $(".forbid")[num].style.cursor = "pointer"
                    if (that.message[num].arr.numb > 1) {
                        that.message[num].arr.numb--
                        that.numSun--
                    } else {
                        that.message.splice(num, 1)
                        that.numSun--
                        if (that.numSun == 0) {
                            that.totalprice = 0
                            this.indexCar = ''
                            $(".commodity").show()
                            $(".content-left").hide()
                            $(".content-right").hide()
                            // console.log(777);
                        }
                    }
                    if (that.indexCar) {
                        if (that.groupId > 1) {
                            if (!that.message[num].arr.shopPrice) {
                                return false
                            }
                            that.priceSun = that.priceSun - parseInt(that.message[num].arr.shopPrice * 100) / 100
                            console.log(that.priceSun);
                            that.totalprice = (parseInt(that.priceSun * that.discount * 10) / 100 + parseInt(that.delivery * 100) / 100 + parseInt(that.lunch * 100) / 100).toFixed(2)
                            that.totalpriced = (parseInt(that.priceSun * 100) / 100 + parseInt(that.delivery * 100) / 100 + parseInt(that.lunch * 100) / 100).toFixed(2)
                        } else {
                            that.priceSun = that.priceSun - parseInt(that.message[num].arr.shopPrice * 100) / 100
                            console.log(that.priceSun);
                            that.totalprice = (parseInt(that.priceSun * 100) / 100 + parseInt(that.delivery * 100) / 100 + parseInt(that.lunch * 100) / 100).toFixed(2)
                            that.totalpriced = that.totalprice
                        }
                    }
                    localStorage.setItem("indexCar", JSON.stringify(this.indexCar))
                },
                carAdd: function (num) { //购物车添加
                    var that = this
                    console.log(that.goodsStock[num]);
                    console.log(this.message[num].arr.numb);
                    console.log(that.kucun[num]);
                    if (that.goodsStock[num] > this.message[num].arr.numb || that.goodsStock[num] == -1) {
                        console.log(that.kucun[num]);
                        if (that.kucun[num] == '') {
                            console.log('原');
                            that.message[num].arr.numb++  //商品数量
                            that.numSun++  //总商品数量
                            if (that.groupId > 1) {
                                that.priceSun = that.priceSun + parseInt(that.message[num].arr.shopPrice * 100) / 100
                                console.log(that.priceSun);
                                that.totalprice = (parseInt(that.priceSun * that.discount * 10) / 100 + parseInt(that.delivery * 100) / 100 + parseInt(that.lunch * 100) / 100).toFixed(2) //打折后
                                that.totalpriced = (parseInt(that.priceSun * 100) / 100 + parseInt(that.delivery * 100) / 100 + parseInt(that.lunch * 100) / 100).toFixed(2) //未打折
                                console.log("现价");
                            } else {
                                that.priceSun = that.priceSun + parseInt(that.message[num].arr.shopPrice * 100) / 100
                                console.log(that.priceSun);
                                that.totalprice = (parseInt(that.priceSun * 100) / 100 + parseInt(that.delivery * 100) / 100 + parseInt(that.lunch * 100) / 100).toFixed(2)
                                that.totalpriced = that.totalprice
                                console.log("原价");
                            }
                            console.log(that.indexCar);
                        } else {
                            console.log('库存');
                            if (that.kucun[num] > this.message[num].arr.numb || that.kucun[num] == -1) {
                                that.message[num].arr.numb++  //商品数量
                                that.numSun++  //总商品数量
                                if (that.groupId > 1) {
                                    that.priceSun = that.priceSun + parseInt(that.message[num].arr.shopPrice * 100) / 100
                                    console.log(that.priceSun);
                                    that.totalprice = (parseInt(that.priceSun * that.discount * 10) / 100 + parseInt(that.delivery * 100) / 100 + parseInt(that.lunch * 100) / 100).toFixed(2)
                                    that.totalpriced = (parseInt(that.priceSun * 100) / 100 + parseInt(that.delivery * 100) / 100 + parseInt(that.lunch * 100) / 100).toFixed(2)

                                    console.log("现价");
                                } else {
                                    that.priceSun = that.priceSun + parseInt(that.message[num].arr.shopPrice * 100) / 100
                                    console.log(that.priceSun);
                                    that.totalprice = (parseInt(that.priceSun * 100) / 100 + parseInt(that.delivery * 100) / 100 + parseInt(that.lunch * 100) / 100).toFixed(2)
                                    that.totalpriced = that.totalprice
                                    console.log("原价");
                                }
                                console.log(that.indexCar);
                                if (that.kucun[num] == this.message[num].arr.numb) {
                                    $(".forbid")[num].style.cursor = "not-allowed"
                                }
                            } else {
                                $(".forbid")[num].style.cursor = "not-allowed"
                                return false
                            }
                        }

                        if (that.goodsStock[num] == this.message[num].arr.numb) {
                            $(".forbid")[num].style.cursor = "not-allowed"
                        }
                        localStorage.setItem("indexCar", JSON.stringify(this.indexCar))
                    } else {
                        $(".forbid")[num].style.cursor = "not-allowed"
                        return false
                    }

                },
                addAdr: function () { //展示添加地址
                    $(".open_yincang").show()
                    this.adrState = -1
                    this.adrbox = {}
                    this.errShow = [0, 0, 0, 0]
                    $("#adrlist").val('')
                },

                cits: function () {//渲染地址信息
                    this.isAddress = false
                    $(".addressTis").show()
                    var that = this
                    var keyword = $('input[id=adrlist]').val()
                    if (keyword.length > 0) {
                        $.ajax({
                            type: "get",
                            url: "https://apis.map.qq.com/ws/place/v1/suggestion/?region=广州&region_fix=0&keyword=" + keyword + "&key=AQMBZ-L4FCO-4VNWY-S5SGC-BNSG7-ALBIS&output=jsonp",
                            dataType: 'JSONP',
                            success: function (res) {
                                console.log(res.data)
                                $(".address-list").show()
                                that.addrData = res.data
                                console.log(that.addrData);
                                if (that.addrData.length < 1) {
                                    $(".address-list").hide()
                                    $(".addressTis").hide()
                                }
                            }
                        });
                    } else {
                        $(".address-list").hide()
                        $(".addressTis").hide()
                        //如果没有输入 那选择当前位置请求
                    }

                },
                citsShow: function () {//获取焦点
                    $(".address-list").show()
                },
                citsSure: function (index) { //收货地址
                    this.isAddress = true
                    $(".addressTis").hide()
                    var adrobj = this.addrData[index]
                    console.log(adrobj);
                    var adr = new Object(adrobj)
                    console.log(adr);
                    this.addrText = adr
                    this.adrbox.addrText = adr
                    $("#adrlist").val(adr.title)
                    $(".address-list").hide()
                    this.lat = adr.location.lat  //送货地址
                    this.lng = adr.location.lng
                    console.log(this.lat);
                    console.log(this.lng);
                },
                // morePhone: function () { //更多电话
                //     $(".thisguhua").show()
                // },
                // delPhone: function () { //删除电话
                //     $(".thisguhua").hide()
                // },
                sureAddress: function () {  //保存地址
                    var that = this
                    var adrState = this.adrState// -1添加  其他数字为 修改 的索引
                    var adrbox = this.adrbox
                    var infor = {}
                    var userSex = $("input[name=1]:checked").val()           //性别
                    var adrlist = $("input[id=adrlist]").val()                //地址
                    var usernames = $("input[name=user]").val()               //用户名
                    var unit = $("input[name=unit]").val()                    //详细地址
                    var biankuan = $(".biankuan").val()                        //手机号
                    var geography = this.addrData
                    infor.userName = this.msgData.userName
                    console.log(infor.userName);
                    infor.address = adrbox.address
                    console.log(infor.address);
                    infor.userPhone = adrbox.userPhone
                    console.log(infor.userPhone);
                    var adopt = true //信息是否正确
                    var csAeeay = []
                    for (var i in infor) {
                        csAeeay.push(infor[i])
                    }
                    $(".slider").hide()
                    if (that.isAddress == false) {
                        $(".slider").show()
                        return false
                    }
                    if (!usernames) {
                        $(".Receiving").show()
                        return false
                    }
                    console.log(11);

                    if (!userSex) {
                        alert("请选择性别")
                    }
                    console.log(22);
                    if (!adrlist || !that.lat || !that.lng) {
                        $(".slider").show()
                        console.log(that.lat);
                        console.log(that.lng);
                        return false
                    }
                    console.log(33);
                    console.log(infor.userPhone);
                    if (!unit) {
                        $(".Detailed").show()
                        return false
                    }
                    console.log(44);
                    if (!(/^((\+?86)|(\(\+86\)))?1[34578]\d{9}$/.test(biankuan))) {
                        that.errShow[2] = 1
                        $(".iphone").show()
                        adopt = false
                        return false
                    }
                    console.log(55);
                    if (adopt) {
                        var adrlist = $("input[id=adrlist]").val()
                        var usernames = $("input[name=user]").val()
                        var unit = $("input[name=unit]").val()
                        var userSex = $("input[name=1]:checked").val()
                        var biankuan = $(".biankuan").val()
                        var val = $("#adrlist").val()
                        if (that.adrState < 0) {//添加
                            console.log(666666);
                            that.errShow[3] = 0
                            var street = adrbox.addrText.title
                            console.log(this.msgData.userId);
                            if (street == val) {
                                axios({
                                    method: 'post',
                                    url: '/pc/Order/userAddress',
                                    data:
                                        {
                                            latitude: that.lat,
                                            longitude: that.lng,
                                            userName: usernames,
                                            address: adrlist,
                                            userPhone: biankuan,
                                            userId: this.msgData.userId,
                                            type: 0,
                                            detailed: adrlist,
                                            userSex: userSex

                                        }
                                }).then(function (res) {
                                    console.log(res)
                                    if (res.data.res == 1) {
                                        console.log(111);
                                        location.href = '/pc/submit.html'
                                    }

                                })
                            } else {
                                that.errShow[3] = 1
                            }
                        } else {//编辑
                            var that = this
                            var latt = this.lat
                            var lngg = this.lng
                            console.log(latt);
                            console.log(lngg);
                            console.log(usernames);
                            console.log(adrlist);
                            console.log(biankuan);
                            console.log(this.msgData.userId);
                            console.log(adrlist);
                            console.log(userSex);
                            console.log(that.addressed[this.adrState].addressId);
                            console.log(7777);
                            console.log(adrlist);
                            console.log(biankuan);
                            axios({
                                method: 'post',
                                url: '/pc/Order/userAddress',
                                data:
                                    {
                                        latitude: latt,
                                        longitude: lngg,
                                        userName: usernames,
                                        address: adrlist,
                                        userPhone: biankuan,
                                        userId: this.msgData.userId,
                                        type: 0,
                                        detailed: adrlist,
                                        userSex: userSex,
                                        type: 1,
                                        aid: that.addressed[this.adrState].addressId
                                    },
                            }).then(function (res) {
                                console.log(res);
                                if (res.data.res == 1) {
                                    console.log(latt);
                                    console.log(lngg);
                                    location.href = '/pc/submit.html'
                                }

                            })

                        }
                    }
                    that.closeAdr()
                },
                modifyAdr: function (index) {  //修改配送地址
                    var that = this
                    console.log(111);
                    $(".open_yincang").show()
                    this.adrState = index
                    console.log(this.adrState);
                    this.errShow = [0, 0, 0, 0]
                    var user = that.addressed[index]
                    $("input[name=user]").val(user.userName)
                    if (user.userSex == 1) {
                        $("input:radio[value='1']").attr("check", true)
                        $("input:radio[value='1']").click()
                    } else if (user.userSex == 0) {
                        $("input:radio[value='1']").attr("check", true)
                        $("input:radio[value='1']").click()
                    }
                    $("input[id=adrlist]").val(user.address)
                    $("input[name=unit]").val(user.detailed)
                    $(".biankuan").val(user.userPhone)
                },
                selectAddress: function (index, hash) { //地址选中
                    console.log(index);
                    console.log(hash);
                    var that = this
                    if (hash == 0) {
                        $(".address-item").removeClass("addressN")
                        $(".address-item").eq(index).addClass("addressN")
                        that.lat = that.addressed[index].latitude
                        that.lng = that.addressed[index].longitude
                        console.log(that.lat);
                        console.log(that.lng);
                        that.addClassIndex = index   //选中地址的下标值
                        console.log(that.addClassIndex);
                    }
                    if ($(".address-item").eq(index).hasClass("addressN")) {
                        this.adrmore = false
                        if ($(".address-item").eq(that.addClassIndex).hasClass("addressN")) {
                            var str = that.addressed.splice(that.addClassIndex, 1)
                            console.log(str);
                            that.addressed.unshift(str[0]);
                            var addressedd = JSON.stringify(that.addressed)
                            window.localStorage.setItem("addressededs", addressedd)
                            $(".address-item").eq(0).addClass("addressN")
                        }
                    }
                },
                closeAdr: function () {//收起添加地址
                    $(".open_yincang").hide()

                },
                moreAddress: function () { //更多地址
                    var that = this
                    this.adrmore = !this.adrmore
                    if (that.adrmore == true) {
                        $(".address-item").removeClass("addressN")
                    }

                    if ($(".address-item").eq(that.addClassIndex).hasClass("addressN")) {
                        $(".address-item").eq(0).addClass("addressN")
                    }
                },
                check: function () {  //隐藏报错
                    $(".Receiving").hide()
                    $(".slider").hide()
                    $(".Detailed").hide()
                    $(".iphone").hide()
                },
                deleteAdr: function (id) { //删除地址
                    this.adrCloseId = id;
                    $('.deleceAdrs').show()
                },
                deleceSure: function () {   //确认删除地址
                    var addressindex = this.adrCloseId     //需要删除地址的 id
                    var addressId = this.addressed[this.adrCloseId].addressId
                    console.log(addressId);
                    axios({
                        method: "post",
                        url: '/pc/Order/delAddress',
                        data: {
                            addressId: addressId,
                        }
                    }).then(function (res) {
                        console.log(res);
                        if (res.data.res == 1) {
                            location.href = '/pc/submit.html'
                        }
                    })
                },
                deleceCancel: function () { //删除取消
                    $('.deleceAdrs').hide()
                },
                times: function (deliveryCostTime) {   //配送范围
                    var that = this
                    var dist = deliveryCostTime //配送时间
                    var endt = "21:50"
                    var dd = new Date()
                    console.log(dd);
                    var year = dd.getFullYear();
                    var month = dd.getMonth() + 1;
                    var data = dd.getDate();
                    console.log(dist);
                    console.log(dd.getMinutes());
                    var star = dd.setMinutes(dd.getMinutes() + dist, dd.getSeconds(), 0); //开始配送的时间
                    console.log(star);
                    var endTime = year + "-" + month + "-" + data + " " + endt //结束时间
                    console.log(endTime);

                    var end = new Date((endTime.replace(/-/g, "/")));
                    console.log(end);

                    var diff = end - star; //毫秒
                    console.log(diff);
                    // if (isNaN(diff)) {
                    //     throw Error("invalid dates arguments");
                    // }
                    if (diff < 0) {
                        alert("不在配送时间")
                        return false
                    }

                    var minu = diff / (1000 * 60);
                    console.log(minu);


                    var gre = Math.floor(minu / 15);//相隔15分钟
                    console.log(gre);
                    var dateArr = []
                    // dateArr.push(endt)
                    console.log(dateArr);
                    for (var i = 0; i < gre + 1; i++) {
                        var tim = i * 15
                        var t = that.addTimes(dist, tim)
                        dateArr.push(t)
                    }
                    var ds = dateArr.length % 2
                    console.log(ds);
                    var len = dateArr.length
                    var dateSort = []
                    for (var i = 0; i < len - 1; i++) {
                        var arrs = dateArr[i + 1]
                        dateSort.push(arrs)
                    }

                    this.dateSorts = dateArr[0]
                    this.dateSort = dateSort
                    console.log(this.dateSort);
                },
                addTimes: function (x, tim) {
                    // var x = "2010-09-28 14:25:26"; // 取得时间
                    // var dd = new Date((x.replace(/-/g, "/")));
                    var dd = new Date();
                    dd.setMinutes(dd.getMinutes() + tim + x, dd.getSeconds(), 0);
                    var hours = dd.getHours();
                    var minutes = dd.getMinutes();
                    hours = hours < 10 ? "0" + hours : hours
                    minutes = minutes < 10 ? "0" + minutes : minutes
                    var datas = hours + ":" + minutes
                    return datas
                },
                sureCheck: function () { //确认下单
                    var that = this
                    // var userAddress=
                    var num = that.addClassIndex
                    var addressed = that.addressed
                    var addressIds = addressed[num].addressId; //地址id

                    var time = $(".select-time option:selected").val();//时间
                    if (time == '立即送出') {
                        time = that.dateSorts
                    }
                    var dd = new Date()
                    var year = dd.getFullYear();
                    var month = dd.getMonth() + 1;
                    var data = dd.getDate();
                    var timer = year + '-' + month + '-' + data + ' ' + time  //配送到达时间
                    var remark = $(".remark").val();//备注
                    // var car = that.car //菜
                    var price = that.totalprice//金额
                    var indexCars = this.indexCar.car
                    var user = that.addressed[0]  //用户信息
                    var latt = that.lat//经纬度
                    var lngg = that.lng
                    if (num == 0) {
                        var nof = $(".address-item").eq(0).hasClass("addressN")
                        if (!nof) {
                            alert("请选择地址")
                            return false
                        }
                    }
                    if (that.priceSun < that.deliveryFreeMoney) {
                        console.log(that.deliveryFreeMoney);
                        console.log(that.priceSun);
                        alert("不能低于起送价")
                        return false
                    }
                    if (indexCars) {
                        that.msgArrCar = []
                        for (var i = 0; i < indexCars.length; i++) {
                            var msgObj = indexCars[i].arr
                            that.msgArrCar.push(msgObj)
                        }
                        that.msgArrCar = {arr: this.msgArrCar}
                        that.msgArrCar = JSON.stringify(that.msgArrCar)
                    }
                    axios({
                        method: 'post',
                        url: '/pc/Index/addGoods',
                        data: {
                            userName: user.userName,
                            userId: this.msgData.userId,
                            shopId: this.indexCar.shopId,
                            orderfood: that.msgArrCar,
                            totalprice: that.totalpriced,
                            userPhone: user.userPhone,
                            true_pay: that.totalprice,
                            deduction: that.deduction,
                            requireTime: time,
                            Memberdiscount: that.deduction,
                            latitude: that.lat,
                            longitude: that.lng,
                            remark: remark,
                            userAddress: user.address,
                            orderType: '商家配送',
                            deliverMoney: that.delivery,
                            boxFee: that.lunch,
                            delivery: that.delivery,
                            discount: that.discount
                        }
                    }).then(function (res) {
                        console.log(res);
                        if (res.data.res == 1) {
                            var order = res.data
                            var orderId = order.orderId
                            var orderNo = order.orderNo
                            var timestamp = order.timestamp
                            var userMoney = that.vip
                            var orders = {
                                orderId: orderId, //订单Id
                                orderNo: orderNo, //订单号
                                timestamp: timestamp,
                                shopName: that.indexCar.shopName, //店铺名
                                userName: user.userName,  //用户名
                                userPhone: user.userPhone,  //用户号码
                                address: user.address, //用户地址
                                car: that.msgArrCar,  //购物车
                                price: that.totalpriced, //未优惠价格
                                userMoney: userMoney, //用户余额
                                true_pay: that.totalprice  //优惠价格
                            }
                            orders = new Object(orders)
                            orders = JSON.stringify(orders)
                            window.localStorage.setItem('order', orders) //缓存
                            window.localStorage.removeItem('indexCar')
                            location.href = '/pc/place.html'
                        } else {
                            alert('商品库存不足')
                        }
                    })

                },
                updata: function (item, event, num) {
                    var that = this
                    that.priceSun = 0
                    that.numSun = 0
                    item.arr.numb = parseInt($(event.target).val()); //框的值

                    if (item.arr.size) {
                        if (item.arr.numb > item.arr.size[item.arr.decide.size].kucun && item.arr.goodsStock != -1) {
                            item.arr.numb = item.arr.size[item.arr.decide.size].kucun
                            that.message[num].arr.numb = item.arr.numb
                            console.log(item.arr.numb);
                        }

                    } else if (item.arr.numb > item.arr.goodsStock && item.arr.goodsStock != -1) {
                        item.arr.numb = item.arr.goodsStock
                        that.message[num].arr.numb = item.arr.numb
                        console.log(item.arr.numb);
                    }

                    if (item.arr.numb <= 0 || !Boolean(item.arr.numb)) {
                        item.arr.numb = 1;
                        that.inputCarMark = item.mark
                    } else {
                        that.inputCarMark = '';
                    }
                    console.log(that.message);

                    for (var i = 0; i < that.message.length; i++) {
                        console.log(i);
                        that.priceSun = that.priceSun + that.message[i].arr.shopPrice * that.message[i].arr.numb
                        that.numSun = that.numSun + that.message[i].arr.numb
                        console.log(that.priceSun);
                        console.log(that.numSun);
                    }
                    if (that.groupId > 1) {
                        console.log(that.priceSun);
                        that.totalprice = (parseInt(that.priceSun * that.discount * 10) / 100 + parseInt(that.delivery * 100) / 100 + parseInt(that.lunch * 100) / 100).toFixed(2) //打折后
                        that.totalpriced = (parseInt(that.priceSun * 100) / 100 + parseInt(that.delivery * 100) / 100 + parseInt(that.lunch * 100) / 100).toFixed(2) //未打折
                        console.log("现价");
                    } else {
                        console.log(that.priceSun);
                        that.totalprice = (parseInt(that.priceSun * 100) / 100 + parseInt(that.delivery * 100) / 100 + parseInt(that.lunch * 100) / 100).toFixed(2)
                        that.totalpriced = that.totalprice
                        console.log("原价");
                    }
                },
            },


        })
    }

}
