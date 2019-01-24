window.onload = function () {
    var app = new Vue({
            el: '#app',
            data: {
                cuisine: '',
                shops: '',
                num: 0,
                searchlist: [],
                carIfor: 0,
                sidetitl: 3,
                shopcart: [],
                shopIndex: -1,
                carnumb: 0,
                indexId: 0,
                latitude: '',
                longitude: '',
                geographical: '',
                shopSum: '',
                indexCar: '',
                indexSum: '',
                submitData: '',
                carNum: 0, //总数
                shopSumNum: [],
                shopMarketPrice: [],
                shopName: '',
                good: '',
                priceSum: 0,  //总价
                allData: '',
                reshopId: '',
                goodsStock: [],
                size: [],
                kucun: []
            },
            created: function () {
                var that = this
                var geographic = window.localStorage.getItem("geographic");
                var lat = window.localStorage.getItem("latitude");
                var long = window.localStorage.getItem("longitude");
                var indexCars = window.localStorage.getItem("indexCar");
                this.latitude = lat
                this.longitude = long
                console.log(this.latitude);
                console.log(this.longitude);
                this.geographical = geographic
                console.log(this.geographical);
                this.indexCar = indexCars
                if (this.indexCar) {
                    console.log(this.indexCar);
                    var indexSum = JSON.parse(that.indexCar)
                    console.log(indexSum)
                    that.allData = indexSum
                    console.log(that.allData.car);
                    if (that.allData.car) {
                        console.log(666);
                        var leng = that.allData.car.length
                        for (var j = 0; j < leng; j++) {
                            that.shopSumNum = that.shopSumNum.concat(that.allData.car[j].arr.numb) //获取每一条的数量放入数组
                            console.log(that.shopSumNum);
                            that.shopMarketPrice = that.shopMarketPrice.concat(that.allData.car[j].arr.shopPrice)//获取每一条的价格放入数组
                            that.carNum = Number(that.carNum) + Number(that.shopSumNum[j])  //获取每一条的数量
                            console.log(that.carNum);
                            that.priceSum = that.priceSum + (that.shopSumNum[j] * that.shopMarketPrice[j]) //总价
                            var goodsStocks = that.allData.car[j].arr.goodsStock
                            var sizes = that.allData.car[j].arr.decide.size
                            that.goodsStock = that.goodsStock.concat(goodsStocks)
                            that.size = that.size.concat(sizes)
                            console.log(that.goodsStock);
                            console.log(that.size);
                            if (that.allData.car[j].arr.size && that.allData.car[j].arr.size.length > 0) {
                                console.log(666);
                                var kucuns = that.allData.car[j].arr.size[this.size[j]].kucun
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
                    that.good = that.allData.car
                    that.shopName = that.allData.shopName
                    that.reshopId = that.allData.shopId
                }

                console.log(geographic);
                if (geographic != null) {
                    axios({
                        method: "post",
                        url: "/pc/Index/index",
                        data: {
                            latitude: that.latitude,
                            longitude: that.longitude,
                            page: 0
                        }
                    }).then(function (res) {
                        console.log(res);
                        if (res.data.res == 1) {
                            that.cuisine = res.data.data.cuisine
                            if (res.data.data.shops != '') {
                                that.shops = res.data.data.shops
                                var excavator = $('.excavator-filter-item')
                                excavator.eq(0).addClass('active')
                                $(document).keyup(function (event) {
                                    if (event.keyCode == 13) {
                                        that.search()
                                    }
                                });
                            } else {
                                $(".foodMore").hide()
                                $(".noshop").show()
                            }
                        }

                    })
                }
                else {
                    location.href = '/pc/home.html'
                }

            },
            methods: {
                jump: function (shopId) {
                    location.href = '/pc/shop.html?shopId=' + shopId
                }
                ,
                light: function (index) { //店家信息鼠标进入
                    var fodblock = $(".fodblock")
                    var fodblockName = $(".fodblock-name")
                    fodblock.eq(index).css('background', '#f5f5f5 ')
                    fodblockName.eq(index).css('color', '#0089dc')
                    timer = setTimeout(function () {
                        var shopExplain = $(".shopExplain")
                        var leng = (index % 4 + 1) * 294 + 'px'
                        var top = Math.floor((index) / 4) * 141 + 'px'
                        shopExplain.eq(index).css({left: leng, top: top, display: 'block'})
                    }, 500)
                }
                ,
                blank: function (index) {       //店家信息鼠标移出
                    var fodblock = $(".fodblock")
                    var fodblockName = $(".fodblock-name")
                    var shopExplain = $(".shopExplain")
                    fodblock.eq(index).css('background', '')
                    shopExplain.eq(index).css('display', 'none')
                    fodblockName.eq(index).css('color', '')
                    clearTimeout(timer)
                }
                ,
                search: function () {       //搜索框
                    var keyword = $('input[name=search]').val()
                    var that = this
                    if (!keyword) {
                        return false;
                    }
                    axios({
                        method: "post",
                        url: "/pc/Index/serchShop",
                        data: {
                            keyword: keyword
                        }
                    }).then(function (res) {
                        if (res.data.res == 1) {
                            that.searchlist = res.data.data
                            $('.place-tab').hide()
                            $('.shopDetail').hide()
                            // $(".noshop").css({display:'block'})
                            if (that.searchlist.length == '') {
                                // $(".noshop").show()
                                $(".noshop").css({display: 'block'})
                            } else {
                                $(".noshop").hide()
                            }


                        }
                    })
                }
                ,
                tabsInform: function (index) {   //购物车划入划出
                    this.sidetitl = index;
                    var carIfor = this.carIfor;
                    var that = this
                    var sidw = $(".sidebar").hasClass('sidebarTran');
                    if (sidw) {
                        if (carIfor == index) {//两次点击相同
                            $(".sidebar").removeClass('sidebarTran');
                            that.sidetitl = 3;
                        } else {
                            that.carIfor = index;
                        }
                    } else {
                        $(".sidebar").addClass('sidebarTran');
                        that.carIfor = index;
                    }
                    if (index == 1) {
                        $(".tabs-inform").removeClass('tabsactive')
                        $(".tabsCar ").addClass('tabsactive')
                    }
                    if (index == 2) {
                        console.log(11);
                        $(".tabsCar").removeClass('tabsactive')
                        $(".tabs-inform").addClass('tabsactive')
                    }
                }
                ,
                tabshide: function () {
                    $(".sidebar").removeClass('sidebarTran')
                }
                ,
                closeCar: function () {  //清空购物车
                    window.localStorage.removeItem("indexCar");
                    var shopcart = this.shopcart
                    var shopIndex = this.shopIndex;
                    this.good = [];
                    $(".sidebar-choice").remove()
                    $(".sidebar-summary").remove()
                    this.carNum = 0
                    shopcart.splice(shopIndex, 1);
                    window.localStorage.setItem("shop", JSON.stringify(shopcart));
                }
                ,
                excavator: function (index, id) {   //菜系分类
                    var excavator = $('.excavator-filter-item')
                    var that = this
                    this.num = 0
                    excavator.removeClass('active')
                    excavator.eq(index).addClass('active')
                    that.indexId = id
                    axios({
                        method: "post",
                        url: "/pc/Index/getCmShop",
                        data: {
                            latitude: that.latitude,
                            longitude: that.longitude,
                            id: id
                        }
                    }).then(function (res) {
                        if (res.data.res == 1) {
                            if (res.data.data != '') {
                                that.shops = res.data.data
                                $(".foodMore").show()
                                $(".noshop").hide()
                            } else {
                                that.shops = []
                                $(".noshop").css({display: 'block'})
                                $(".foodMore").hide()
                            }
                        }
                    })
                }
                ,
                more: function () {  //点击加载更多
                    this.num++
                    page = this.num * 12
                    var that = this
                    var id = this.indexId
                    axios({
                        method: "post",
                        url: "/pc/Index/getCmShop",
                        data: {
                            latitude: that.latitude,
                            longitude: that.longitude,
                            id: id,
                            page: page
                        }
                    }).then(function (res) {
                        if (res.data.res == 1) {
                            if (res.data.data.shop != '') {
                                var shoplist = res.data.data
                                that.shops = that.shops.concat(shoplist)
                            } else {
                                //不让 执行 more 方法
                                return false
                            }
                        } else {
                            alert('没有更多了')
                        }
                    })
                }
                ,
                change: function () {
                    location.href = "/pc/home.html"
                },
                changeNum: function (index) {
                    var that = this
                    that.priceSum = 0
                    that.carNum = 0
                    if (that.goodsStock[index] > that.allData.car[index].arr.numb || that.goodsStock[index] == -1) {
                        console.log(666);
                        if (that.kucun[index] == '') {
                            console.log(777);
                            if (that.allData.car[index].arr.numb < 1) {
                                that.good[index].arr.numb = 1
                            }
                        } else {
                            if (that.kucun[index] > that.allData.car[index].arr.numb || that.kucun[index] == -1) {
                                console.log(888);
                                if (that.allData.car[index].arr.numb < 1) {
                                    that.good[index].arr.numb = 1
                                }
                            } else {
                                console.log(999);
                                that.good[index].arr.numb = that.kucun[index]
                                console.log(that.goodsStock[index]);
                            }
                        }
                    } else {
                        if (that.kucun[index]) {
                            that.good[index].arr.numb = that.kucun[index]
                        } else {
                            console.log(11010);
                            console.log(that.goodsStock[index]);
                            that.good[index].arr.numb = that.goodsStock[index]
                        }

                    }
                    for (var i = 0; i < that.good.length; i++) {
                        console.log(i);
                        console.log(that.priceSum);
                        that.priceSum = that.priceSum + that.good[i].arr.shopPrice * that.good[i].arr.numb
                        console.log(that.carNum);
                        that.carNum = Number(that.carNum) + Number(that.good[i].arr.numb)
                        console.log(that.carNum);
                        console.log(that.priceSum);
                        console.log(that.good[i].arr.shopPrice);
                        console.log(that.good[i].arr.numb);
                        console.log(that.allData);
                    }
                    console.log(that.allData);
                    localStorage.setItem("indexCar", JSON.stringify(that.allData))
                },
                carsub: function (num) {  // 购物车 - 号
                    var that = this
                    var msg = that.allData
                    $(".forbid")[num].style.cursor = "pointer"
                    if (that.good[num].arr.numb == 1) {
                        that.carNum--
                        that.priceSum = that.priceSum - that.good[num].arr.shopPrice
                        that.good.splice(num, 1)
                        console.log(that.carNum);
                        console.log(that.allData.car);
                        localStorage.setItem("indexCar", JSON.stringify(msg))
                        if (that.carNum == 0) {
                            $(".sidebar-choice").remove()
                            $(".sidebar-summary").remove()
                        }
                    }
                    else {
                        that.carNum--
                        that.good[num].arr.numb--
                        that.priceSum = that.priceSum - that.good[num].arr.shopPrice
                        localStorage.setItem("indexCar", JSON.stringify(msg))
                    }
                },
                caradd: function (num) {  // 购物车 + 号
                    var that = this
                    if (that.goodsStock[num] > that.allData.car[num].arr.numb || that.goodsStock[num] == -1) {
                        console.log(that.kucun[num]);
                        if (that.kucun[num] == '') {
                            that.carNum++
                            that.good[num].arr.numb++
                            that.priceSum = that.priceSum + parseInt(that.good[num].arr.shopPrice * 100) / 100
                        } else {
                            if (that.kucun[num] > that.allData.car[num].arr.numb || that.kucun[num] == -1) {
                                that.carNum++
                                that.good[num].arr.numb++
                                that.priceSum = that.priceSum + parseInt(that.good[num].arr.shopPrice * 100) / 100
                                if (that.kucun[num] == that.allData.car[num].arr.numb) {
                                    $(".forbid")[num].style.cursor = "not-allowed"
                                }
                            } else {
                                $(".forbid")[num].style.cursor = "not-allowed"
                                return false
                            }
                        }
                        if (that.goodsStock[num] == that.allData.car[num].arr.numb) {
                            $(".forbid")[num].style.cursor = "not-allowed"
                        }
                    } else {
                        $(".forbid")[num].style.cursor = "not-allowed"
                        return false
                    }
                    localStorage.setItem("indexCar", JSON.stringify(that.allData))
                },
                balance: function () {
                    location.href = '/pc/submit.html'
                }

            }
        }
        )
    ;
}
