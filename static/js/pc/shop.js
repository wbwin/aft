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
    var app = new Vue({
        el: '#app',
        data: {
            dataz: '',
            von: [],
            searchData: [],
            searchShow: false,
            ordernav: 0,
            car: [],
            distance_text: "购物车是空的",
            shopSure: false, //是否可以下单
            totalnumb: 0,
            totalprice: 0,
            box: {},
            ordertabTF: 0,
            plSum: [],
            foodBoxT: false,
            updataSum: false,
            foodSort: 0,
            active: '',
            pinglun: '',
            shopId: '',
            foodTop: [], //菜系距离顶部的距离
            navH: '',
            boxPrice: 0,
            shopShowType: 0,
            boxFees: '',
            car: [],
            repeat: false,
            boxArr: {},
            boxArrDecide: {},
            boxDecideSName: '',
            boxDecideTName: '',
            boxGoodsImg: '',
            boxGoodsName: '',
            boxMarketPrice: '',
            boxNumb: '',
            sortJudge: false,
            orderType: '',
            search: true,
            items: true,//判断菜品数量输入框是否为空
            buyItems: true,//判断购物菜品数量输入框是否为空
            serviceStartTime: '',
            serviceEndTime: '',
            collect: '',//是否收藏
            userId: '',
            index: 1,
            pageEach: 10,
            commentfilter: 0,//全部 有图 最新
            allCount: 0,//全部评论总数
            youtuCount: 0,//有图评论总数
            zuixinCount: 0,//最新评论总数
            orderFoodTop: [],//所有食物的坐标
            orderFood: [],//所有食物的名字
            complain: ['餐厅刷单', '商家资质', '商家价格问题', '商家品类', '商家logo问题', '商家配送问题', '其他问题'],//举报主题
            timer: null,
            tisSubTimer: null,
            inputMark: '',
            inputCarMark: '',
        },
        created: function () {

            var that = this

            that.boxFees = $('input[name=boxFee]').val(); //商家餐盒费
            var url = location.search;
            var shopId = url.substr(1);
            that.shopId = shopId.replace('shopId=', '');
            var storage = window.localStorage;


            var indexCar = JSON.parse(storage.getItem("indexCar"));
            var admin = JSON.parse(storage.getItem('admin'));
            console.log(storage.getItem("indexCar"))
            console.log(storage.getItem('admin'))
            if (admin) {
                that.userId = admin.userId;
                axios({//记录浏览历史
                    method: "post",
                    url: "/pc/Order/putInHistory",
                    data: {
                        shopId: that.shopId,
                        userId: that.userId,
                    }
                }).then(function (res) {

                })
            } else {
                that.userId = ''
            }

            if (indexCar && indexCar.shopId == that.shopId) {
                console.log(indexCar);

                that.car = indexCar.car;
            } else {
                storage.removeItem('indexCar')
            }

            axios({
                method: "post",
                url: "/pc/Shop/shop",
                data: {
                    userId: that.userId,
                    shopId: that.shopId,
                }
            }).then(function (res) {
                console.log(res);
                if (res.data.res === 1) {
                    that.dataz = res.data.data
                    if (that.dataz.collect) {
                        that.collect = that.dataz.collect;
                    }
                    // var date = new Date(that.dataz.serviceStartTime * 1000);
                    // var dateN = new Date(that.dataz.serviceEndTime * 1000);
                    // that.serviceStartTime = date.getHours();
                    // that.serviceEndTime = dateN.getHours();
                    axios({
                        method: "post",
                        url: "/pc/Shop/goods",

                        data: {
                            shopId: that.shopId,
                        }
                    }).then(function (res) {
                        console.log(res);
                        if (res.data.res === 1) {

                            var von = res.data.data[0].dishes

                            if (indexCar && indexCar.shopId == that.shopId) {
                                for (var i = 0; i < indexCar.car.length; i++) {
                                    var mark = indexCar.car[i].mark;
                                    console.log(mark)
                                    var a = mark.substring(mark.indexOf("a") + 1, mark.indexOf("b"));
                                    var b = mark.substring(mark.indexOf("b") + 1);

                                    von[a].distop[b].numb = von[a].distop[b].numb + indexCar.car[i].arr.numb;
                                    that.sum();
                                }

                            }
                            that.von = von;
                            console.log(that.von);
                            that.$nextTick(function () {
                                that.repeat = true
                                that.scrollEvent()
                            });
                        }
                    })
                }
            })


            //********************************* //侧边回到顶部等
            var side0 = $(".sidetools-item").eq(0);
            that.righthover(side0, '我要开店');
            var side1 = $(".sidetools-item").eq(2);
            that.righthover(side1, '在线客服');
            var side3 = $(".sidetools-item").eq(3);
            that.righthover(side3, '回到顶部');

            var topTime;
            $(".addcar").hover(function (event) {
                console.log(event)
                topTime = setTimeout(function () {
                    $(".tooltips-top").show();
                }, 500)
            }, function () {
                $(".tooltips-top").hide();
                clearTimeout(topTime);
            })
            // var shopId = $('input[name=shopId]').val();
            // axios({
            //     method: "post",
            //     url: "https://www.aftdc.com/Business/Activity/HuoDong",
            //     data: {
            //     }
            // }).then(function (res) {
            //
            // })
            // $.ajax({
            //     url: '/index.php/HomePc/index/aa', // 跳转到 action
            //     data: {
            //         shopId: shopId,
            //         type: 'web'
            //     },
            //     type: 'post',
            //     dataType: 'json',
            //     success: function (data) {
            //         console.log(data)
            //         contentAll = data
            //         if (!Boolean(data)) {
            //             return false
            //         }
            //         von = data[0].dishes;
            //
            //         that.von = von;
            //
            //         storage(shopId);
            //         $scope().$apply();
            //     },
            //     fail: function (err) {
            //
            //     }
            // });
            //***************************************


        },
        methods: {
            range: function (n) {
                var backArr = new Array();
                for (var i = 0; i < n; i++) {
                    backArr[i] = i;
                }
                return backArr;
            },
            retua: function (mark) {
                var a = mark.substring(mark.indexOf("a") + 1, mark.indexOf("b"));
                return a;
            },
            retub: function (mark) {
                var b = mark.substring(mark.indexOf("b") + 1);
                return b;
            },
            //导航滚动
            ordernavs: function (index) {
                var that = this
                var topNum = that.foodTop[index];
                console.log(topNum)
                $('html,body').animate({scrollTop: topNum});
            },

            //菜的数量输入框
            updata: function (item, event, key, index) {

                var foodId = item.goodsId;
                var that = this
                that.inputCarMark = '';
                var car = that.car

                item.numb = parseInt($(event.target).val());
                if (item.numb > item.goodsStock && item.goodsStock != -1) {
                    item.numb = item.goodsStock
                }


                if (!Boolean(item.numb)) {
                    that.inputMark = 'a' + key + 'b' + index;

                    item.numb = 1;


                } else {
                    that.inputMark = ''

                }
                console.log(item.numb)
                var len = car.length;
                for (var i = 0; i < len; i++) {
                    var carId = car[i].arr.goodsId;
                    if (carId == foodId) {
                        if (item.numb <= 0) {
                            car.splice(i, 1);
                        } else {
                            car[i].arr.numb = item.numb;
                        }
                        that.car = car;
                        that.updataSum = true;
                        that.sum();
                        break;
                    }
                }

            },

            updataCar: function (item, event, key, index) {
                var that = this
                that.inputMark = '';
                item.arr.numb = parseInt($(event.target).val());

                if (item.arr.size) {
                        if (item.arr.numb > item.arr.size[item.arr.decide.size].kucun && item.arr.goodsStock != -1) {
                            item.arr.numb = item.arr.size[item.arr.decide.size].kucun
                        }

                }else
                if (item.arr.numb > item.arr.goodsStock && item.arr.goodsStock != -1 ) {
                    item.arr.numb = item.arr.goodsStock
                }

                if (item.arr.numb <= 0 || !Boolean(item.arr.numb)) {
                    item.arr.numb = 1;
                    that.inputCarMark = item.mark


                } else {
                    that.inputCarMark = '';

                }


                var mark = item.mark;
                var cars = that.car;
                var testing = cars.filter(function (item) {
                    return item.mark == mark;
                });
                var a = mark.substring(mark.indexOf("a") + 1, mark.indexOf("b"));
                var b = mark.substring(mark.indexOf("b") + 1);
                var numbs = 0
                for (var i = 0; i < testing.length; i++) {
                    numbs = numbs + parseInt(testing[i].arr.numb)
                }
                var von = that.von
                von[a].distop[b].numb = numbs
                that.von = that.von
                that.updataSum = true;
                that.sum();
            },
            //清空购物车
            closeCar: function () {
                var that = this
                var cars = that.car;
                var len = cars.length
                if (len > 0) {
                    var boxPrice = 0;//餐盒费;
                    var von = that.von;
                    for (var i = 0; i < len; i++) {
                        var mark = cars[i].mark;
                        var a = mark.substring(mark.indexOf("a") + 1, mark.indexOf("b"));
                        var b = mark.substring(mark.indexOf("b") + 1);
                        that.von[a].distop[b].numb = 0;
                    }

                    that.car = [];
                    var car = [];
                    that.von = von;

                    that.sum()


                }
            },
            //排序
            orderFilt: function (index) {
                var that = this
                that.foodSort = index
                if (index == 0) {
                    that.searchShow = false;
                } else if (index == 3) { //价格排序
                    var searchData = {}
                    var data = []
                    var vons = that.von
                    for (var i in vons) {
                        for (var j in vons[i].distop) {
                            var obj = new Object(vons[i].distop[j])
                            obj.a = i;
                            obj.b = j
                            data.push(obj);

                        }
                    }
                    console.log(that.sortJudge);
                    if (that.sortJudge == false) {
                        data = data.sort(function (a, b) {
                            return a.shopPrice - b.shopPrice
                        });

                        that.searchData = {distop: data, txt: '价格从低到高排序'};
                        that.sortJudge = true;
                    } else {
                        data = data.sort(function (a, b) {
                            return b.shopPrice - a.shopPrice
                        });
                        that.sortJudge = false;
                        that.searchData = {distop: data, txt: '价格从高到低排序'};
                    }
                    that.searchShow = true;


                }
            },
            //通过缓存加载商品
//             storage: function (shopId) {
//                 var that = this
//                 var stor = window.localStorage;
//                 var shop = stor.getItem("shop");
//                 if (Boolean(shop)) {
//                     shop = JSON.parse(shop);
//                     shop = shop.filter(function (item) {
//                         return item.shopId == shopId;
//                     })
//
//                     if (Boolean(shop) && shop.length > 0) {
//                         var cars = shop[0].car;
//                         var order = []
//                         for (var i in cars) {
//                             var obj = new Object(cars[i]);
//                             order.push(obj);
//                         }
//
//
//                         for (var i in von) {
//                             for (var j in von[i].distop) {
//                                 for (var k = 0; k < order.length; k++) {
//                                     var goodsId = von[i].distop[j].goodsId;
//                                     var carId = order[k].arr.goodsId;
//
//                                     if (goodsId == carId) {
//                                         var numb = order[k].arr.numb;
//                                         var mark = order[k].mark;
//                                         that.shopAdd(mark, numb);
//                                         var objs = order[k];
//                                         car.push(objs);
//
//
//                                         order.splice(k, 1);
//                                         k--;
//
//
//                                     }
//
//
//                                 }
//
//                             }
//
//                             if (order.length <= 0) {
//
//                                 that.car = car;
//                                 that.sum();
//                                 // scope.$apply();
//
//                                 break;
//                             }
//
//                         }
//
//
//                     }
//                 }
//             },
// //通过缓存添加
//             shopAdd: function (mark, numb) {
//                 var that = this;
//
//                 var a = mark.substring(mark.indexOf("a") + 1, mark.indexOf("b"));
//                 var b = mark.substring(mark.indexOf("b") + 1);
//
//                 von[a].distop[b].numb = parseInt(von[a].distop[b].numb) + parseInt(numb);
//                 var arr = von[a].distop[b];
//                 if (arr.boxFee == 1) {
//                     boxPrice = Number(boxPrice) + Number(boxFees);
//                     //$('#canhe').text('￥' + boxPrice);
//                 }
//                 ;
//                 that.von = von;
//             },
            //侧边回到顶部等
            righthover: function (obj, txts) {
                var tipTime
                $(obj).hover(function () {
                    var that = $(this)
                    tipTime = setTimeout(function () {
                        $(".tooltip-word").text(txts)
                        $(".tooltips").css('display', 'block')
                        var wid = -($(".tooltips").innerWidth()) + 'px'
                        var top = that.position().top + 'px'

                        $(".tooltips").css({top: top, left: wid})
                    }, 500)
                }, function () {
                    $(".tooltips").css('display', 'none')
                    clearTimeout(tipTime)
                })
            },
            //有规格减号提示框
            tisSub: function (obj) {
                $('.tooltipSub,.backWhite').show()
                //var y = document.body.scrollTop || document.documentElement.scrollTop;
                var hid = $(".tooltipSub").innerHeight() + 8
                var wid = $(".tooltipSub").innerWidth() / 2 - 12

                var top = ($(obj).offset().top - hid) + 'px'
                var left = ($(obj).offset().left - wid) + 'px'

                $(".tooltipSub").css({top: top, left: left})
                setTimeout(function () {
                    $('.tooltipSub,.backWhite').hide()
                }, 1000)
            },
            //商品页，评价页切换
            ordertab: function (index) {
                var shopId = $('input[name=shopId]').val()
                var that = this;
                that.ordertabTF = index
                if (index == 0) {
                    that.searchShow = false;
                }
                else if (index == 1) {

                    var sw = true;
                    axios({
                        method: "post",
                        url: "/pc/Shop/observe",
                        data: {
                            shopId: that.shopId,
                            page: 0,
                            userId: '',
                            tagId: '',
                        }
                    }).then(function (res) {
                        console.log(res)
                        if (res.data.data && res.data.data.length > 10) {
                            that.plSum = res.data.data.slice(0, 10)
                        } else {
                            that.plSum = res.data.data
                        }
                        console.log(that.plSum)

                        // that.pinglun = res.data.data
                        that.allCount = res.data.count;
                        // that.pageEach = res.data.pageEach;
                        // scope.$apply()
                    })
                    // 注册scroll事件并监听
                    window.addEventListener('scroll', function () {
                        // console.log(document.documentElement.clientHeight + '-----------' + window.innerHeight); // 可视区域高度
                        // console.log(document.documentElement.scrollTop); // 滚动高度
                        // console.log(document.body.offsetHeight); // 文档高度
                        // 判断是否滚动到底部
                        console.log(document.documentElement.scrollTop + window.innerHeight >= document.body.offsetHeight)
                        if (document.documentElement.scrollTop + window.innerHeight >= document.body.offsetHeight) {

                            // console.log(sw);
                            // 如果开关打开则加载数据
                            if (that.commentfilter == 0) {


                                if (sw == true) {
                                    // 将开关关闭
                                    sw = false;
                                    that.index++;

                                    var page = that.index * that.pageEach - that.pageEach
                                    axios({
                                        method: "post",
                                        url: "/pc/Shop/observe",
                                        data: {
                                            shopId: that.shopId,
                                            page: page,
                                            userId: '',
                                            tagId: '',
                                        }
                                    }).then(function (res) {
                                        var pingluns = res.data.data;
                                        pingluns.forEach(function (val, index) {
                                            that.plSum.push(val);
                                            // console.log(val);
                                        });
                                        // 数据更新完毕，将开关打开
                                        sw = true;
                                    })


                                }
                            }
                            else if (that.commentfilter == 1) {


                                if (sw == true) {
                                    // 将开关关闭
                                    sw = false;
                                    that.index++;
                                    var page = that.index * that.pageEach - that.pageEach
                                    axios({
                                        method: "post",
                                        url: "/pc/Shop/cut_observe",
                                        data: {
                                            shopId: that.shopId,
                                            chooseId: 1,
                                            page: page,
                                            userId: '',
                                            tagId: '',

                                        }
                                    }).then(function (res) {
                                        var pingluns = res.data.data;
                                        pingluns.forEach(function (val, index) {
                                            that.plSum.push(val);
                                            // console.log(val);
                                        });
                                        // 数据更新完毕，将开关打开
                                        sw = true;
                                    })


                                }
                            } else if (that.commentfilter == 2) {
                                if (sw == true) {
                                    // 将开关关闭
                                    sw = false;
                                    that.index++;
                                    console.log(333);
                                    var page = that.index * that.pageEach - that.pageEach
                                    console.log(page);
                                    axios({
                                        method: "post",
                                        url: "/pc/Shop/cut_observe",
                                        data: {
                                            shopId: that.shopId,
                                            chooseId: 3,
                                            page: page,
                                            userId: '',
                                            tagId: '',
                                        }
                                    }).then(function (res) {
                                        var pingluns = res.data.data;
                                        pingluns.forEach(function (val, index) {
                                            that.plSum.push(val);
                                            // console.log(val);
                                        });
                                        // 数据更新完毕，将开关打开
                                        sw = true;
                                    })


                                }
                            }
                        }
                    });
                }
                // scope.$apply()
            },
            seeFoodClick: function (x) {//查看商品
                var that = this
                that.ordertabTF = 0;
                var name = x.goodsName;
                var orderFood = that.orderFood
                for (var i = 0; i < orderFood.length; i++) {
                    if (name == orderFood[i]) {
                        var j = i;
                        break;
                    }
                }
                var topNum = that.orderFoodTop[j];
                console.log(topNum)
                if (topNum) {
                    $('html,body').animate({scrollTop: topNum});
                } else {
                    $('html,body').animate({scrollTop: 0});
                }


            },
            commentfilterClick: function (index) {//全部有图最新
                var that = this;
                that.commentfilter = index
                that.index = 1;
                if (index == 0) {
                    that.youtuCount = 0;
                    that.zuixinCount = 0;
                    var sw = true;
                    axios({
                        method: "post",
                        url: "/pc/Shop/observe",
                        data: {
                            shopId: that.shopId,
                            page: 0,
                            userId: '',
                            tagId: '',
                        }
                    }).then(function (res) {
                        console.log(res)
                        if (res.data.data && res.data.data.length > 10) {
                            that.plSum = res.data.data.slice(0, 10)
                        } else {
                            that.plSum = res.data.data
                        }
                        console.log(that.plSum)

                        // that.pinglun = res.data.data
                        that.allCount = res.data.count;
                        // that.pageEach = res.data.pageEach;
                        // scope.$apply()
                    })

                } else if (index == 1) {

                    that.allCount = 0;
                    that.zuixinCount = 0;
                    var sw = true;
                    axios({
                        method: "post",
                        url: "/pc/Shop/cut_observe",
                        data: {
                            shopId: that.shopId,
                            chooseId: 1,
                            page: 0,
                            userId: '',
                        }
                    }).then(function (res) {
                        console.log(res)
                        if (res.data.data && res.data.data.length > 10) {
                            that.plSum = res.data.data.slice(0, 10)
                        } else {
                            that.plSum = res.data.data
                        }
                        console.log(that.plSum)

                        // that.pinglun = res.data.data
                        that.youtuCount = res.data.count;
                        // that.pageEach = res.data.pageEach;
                    })

                } else if (index == 2) {
                    that.allCount = 0;
                    that.youtuCount = 0;

                    axios({
                        method: "post",
                        url: "/pc/Shop/cut_observe",
                        data: {
                            shopId: that.shopId,
                            chooseId: 3,
                            page: 0,
                            userId: '',
                        }
                    }).then(function (res) {
                        console.log(res)
                        if (res.data.data && res.data.data.length > 10) {
                            that.plSum = res.data.data.slice(0, 10)
                        } else {
                            that.plSum = res.data.data
                        }
                        console.log(that.plSum)

                        // that.pinglun = res.data.data
                        that.zuixinCount = res.data.count;
                        // that.pageEach = res.data.pageEach;
                    })

                }


            },
            //列表网格切换
            arrayShop: function (obj, i) {
                var th = this
                var that = $(obj.currentTarget)
                $(".ordermain-list").removeClass("grid")
                $(".ordermain-list").removeClass("list")

                if (i == 1) {
                    $(".ordermain-list").addClass('grid') //网格
// $('#orderBG1').addClass('active');
                    th.switchImg(that)


                } else {
                    $(".ordermain-list").addClass('list ') //列表
                    th.switchImg(that)
                }
                th.scrollEvent()
            },
            switchImg: function (that) {
                var len = $('.ordernav-filter-display').length
                $('.ordernav-filter-display img').removeClass('active')
                for (var i = 0; i < len; i++) { //还原图片路径
                    var selectSrc = $('.ordernav-filter-display').eq(i).children("img").attr("src")
                    selectSrc = selectSrc.split("1").join("")
                    $('.ordernav-filter-display').eq(i).children("img").attr("src", selectSrc)
                }
                that.children('img').addClass('active')
                var src = that.children("img").attr("src")
                var newSrc = src.substr(0, src.indexOf('.png')) + 1 + ".png" //设置新的图片路径
                that.children("img").attr("src", newSrc)
            },
            //选择规格 加入购物车
            addFood: function (event) {
                var that = this
                var obj = (event.target)
                var index = $(obj).attr("data-index");
                // console.log(index);
                var foodindex = $(obj).attr("data-foodindex");
                var spec = that.von[index].distop[foodindex]
                var bole = Boolean(spec.size || spec.taste)
                if (bole) { //有规格
                    that.specs(obj)
                } else {
                    that.add(event)
                }
            },
            //选择规格
            specs: function (obj) {
                var that = this

                var index = $(obj).attr("data-index");
                var foodindex = $(obj).attr("data-foodindex");
                var spec = that.von[index].distop[foodindex]

                var mark = "a" + index + "b" + foodindex
                var arr = new Object(spec)
                console.log(arr);
                var objs = {arr: arr, mark: mark}
                that.box = new Object(objs)

                // scope.$apply()


                //显示位置

                that.boxArr = that.box.arr;
                that.boxArrDecide = that.box.arr.decide;
                console.log(that.box.arr.taste)
                if (that.box.arr.taste != undefined &&that.box.arr.taste != '') {

                    that.boxDecideTName = that.box.arr.taste[that.box.arr.decide.taste].name
                }
                console.log(that.box.arr.size)
                if (that.box.arr.size != undefined &&that.box.arr.size != ''){
                    that.boxDecideSName = that.box.arr.size[that.box.arr.decide.size].name
                }

                $(".back").addClass("active")
                var top = $(obj).offset().top - 10
                var left = $(obj).offset().left + $(obj).outerWidth() + 12
                $(".specBox").css({"top": top, "left": left, "display": "block",})
            },
            boxsize: function (event) {//规格名字
                var th = this
                var that = $(event.target)
                var index = that.attr("data-index")

                // var goodsId = th.box.arr.goodsId
                //
                // var val = that.text()
                // axios({
                //     method: "post",
                //     url: "/index.php/wxapp/order/specPrice",
                //     data: {
                //         goodsId: goodsId,
                //         val: val
                //     },
                // }).then(function (res) {
                //     console.log(res)
                //     th.box.arr.decide.size = index
                //     th.box.arr.shopPrice = res.attrPrice
                //     // th.$apply()
                // })

                th.box.arr.decide.size = index;
                th.box.arr.shopPrice = th.box.arr.size[th.box.arr.decide.size].price
                th.boxDecideSName = th.box.arr.size[th.box.arr.decide.size].name


            },
            boxtaste: function (event) {//口味名字
                var th = this

                var that = $(event.target)
                var index = that.attr("data-index")
                console.log(index)
                var box = th.box;
                box.arr.decide.taste = index

                th.box = box;

                th.boxDecideTName = th.box.arr.taste[th.box.arr.decide.taste].name

                // th.$apply()
            },
            //动画
            animtions: function (event) {
//加入动画
                var offset = $(".shopcar-icon").offset(),
                    flyer = $('<img class="u-flyer" src="/static/image/pc/shopColl1.png"/>');
                var y = document.body.scrollTop || document.documentElement.scrollTop;
                var ys = offset.top - y
                flyer.fly({
                    start: {
                        left: event.clientX,
                        top: event.clientY,
                    },
                    end: {
                        left: offset.left,
                        top: ys,
                        width: 20,
                        height: 20
                    }

                });
            },
            //弹出规格  选好了
            ok: function (event) {

                var th = this
                var boxs = th.box
                var box = new th.clone(boxs)
                console.log(box)
                var mark = box.mark //获取弹出盒子的弹出哪件商品标识
                var a = mark.substring(mark.indexOf("a") + 1, mark.indexOf("b"))
                var b = mark.substring(mark.indexOf("b") + 1)
                var von = th.von
                var car = th.car;


                var pushcar = false

                if (car.length > 0) {
                    for (var i in car) {
                        var carst = car[i].arr.decide.size + car[i].mark + car[i].arr.decide.taste
                        var boxst = box.arr.decide.size + mark + box.arr.decide.taste
                        if (carst == boxst) {
                            // console.log(box.arr.size[box.arr.decide.size].kucun)

                            if (box.arr.size && box.arr.size.length > 0) {
                                if (Number(car[i].arr.numb) >= Number(box.arr.size[box.arr.decide.size].kucun)) {
                                    alert('该规格已选数量超出库存范围，请选择其他规格！')
                                    return false
                                    break
                                }
                            }
                            //
                            // box.arr.numb++
                            car[i].arr.numb++
                            pushcar = true
                            console.log("1")
                            break
                        }
                    }
                    if (!pushcar) {
                        console.log("2")
                        if (box.arr.size && box.arr.size.length > 0) {
                            if (Number(box.arr.size[box.arr.decide.size].kucun) == 0) {
                                alert('该规格已选数量超出库存范围，请选择其他规格！')
                                return false

                            }
                        }
                        box.arr.numb = 1
                        // box.arr.goodsName = box.arr.goodsName + ' ' + th.boxDecideSName + ' ' + th.boxDecideTName;
                        car.push(box)
                    }

                } else {
                    console.log("3")
                    if (box.arr.size && box.arr.size.length > 0) {
                        if (Number(box.arr.size[box.arr.decide.size].kucun) == 0) {
                            alert('该规格已选数量超出库存范围，请选择其他规格！')
                            return false

                        }
                    }
                    box.arr.numb = 1
                    // box.arr.goodsName = box.arr.goodsName + ' ' + th.boxDecideSName + ' ' + th.boxDecideTName;
                    car.push(box)

                }
                von[a].distop[b].numb = von[a].distop[b].numb + 1

                th.von = von
                th.car = car
                console.log(th.car)
                th.sum()
                th.boxDecideSName = '';
                th.boxDecideTName = '';
                th.closeSpec()
            },
            //弹出规格  关闭
            closeSpec: function () {
                $(".back").removeClass("active")
                $(".specBox").hide()
            },
            //弹出详情 显示隐藏
            shopShow: function (event) {

                var that = this
                var t = that.foodBoxT
                var von = that.von
                if (t == false) {
                    var obj = (event.currentTarget)
                    var a = $(obj).attr("data-index")
                    var b = $(obj).attr("data-foodindex")

                    var arr = von[a].distop[b]
                    var mark = "a" + a + "b" + b
                    var boxs = {arr: arr, mark: mark}
                    that.box = boxs

                }
                that.boxArr = that.box.arr;

                that.foodBoxT = !t

                $(".back").toggle()
                that.shopShowType = 1
                // scope.$apply()

            },
            //举报弹出框
            reportClick: function () {
                var that = this;
                if (that.userId == '') {
                    var test = window.location.href;
                    var storage = window.localStorage;
                    storage.removeItem('jumpUrl')
                    storage.setItem("jumpUrl", test);

                    location.href = "/pc/login.html";
                    //return false
                } else {
                    $('.thistousu').show()
                    $(".back").show()
                }
            },
//关闭举报框
            logout: function () {
                $('.thistousu').hide()
                $(".back").hide()
            },
            // an_nivClick: function () {
            //     var that = this
            //
            //     var question = $('.shopcomplaint-textarea').val();
            //     if (question == '') {
            //         alert('请填写举报信息！');
            //     } else {
            //         axios({
            //             method: "post",
            //             url: "/pc/Shop/me_idea",
            //             data: {
            //                 userId: that.userId,
            //                 question: question,
            //             }
            //         }).then(function (res) {
            //             if (res.data.res == 1) {
            //                 alert('举报成功！');
            //                 location.reload();
            //             }
            //         })
            //     }
            // },
            //*************************
            // shophide: function () {
            //     $('.foodBox').hide()
            //     $(".back").hide()
            // },
            //页面滚动事件
            scrollEvent: function () {
                var that = this
                $(".toolbar-butbtn").click(function (e) { //回到顶部
                    $('html,body').animate({scrollTop: '0'});

                })


                var navH = $(".ordermain-nav").outerHeight()

                var lastItem = $(".orderFood-item:last").offset().top + $(".orderFood-item:last").outerHeight() - navH

                var ordermainOff = $(".ordermain-list").offset().top - navH
                var len = $(".ordermain-list h3").length
                var orderFoodLen = $(".orderFood-item").length//含有.orderFood-item的数量
                // var orderFoodNameLen = $(".orderFood-word-name").length
                // console.log(orderFoodNameLen)
                var foodTop = []
                var arrayTOP = []
                var orderFoodTop = []//所有食物的坐标
                var orderFood = []//所有食物的名字
                for (var i = 0; i < orderFoodLen; i++) {//用于评论的查看商品
                    var FoodTop = $('.orderFood-item').eq(i).offset().top - navH
                    var orderFoods = $('.orderFood-item').eq(i).find('.orderFood-word-name').text();
                    orderFoodTop.push(FoodTop);
                    orderFood.push(orderFoods)

                }

                for (var i = 0; i < len; i++) {
                    var top = $(".ordermain-title ").eq(i).position().top - 10
                    arrayTOP.push(top)
                    var tops = $(".ordermain-title").eq(i).offset().top - navH
                    foodTop.push(tops)
                }
                that.foodTop = foodTop;
                that.orderFoodTop = orderFoodTop;
                that.orderFood = orderFood;

                window.onscroll = function () {
                    var that = this

                    var searchShow = that.searchShow; //筛选出来的商品部用执行页面滚动滚动
                    if (!searchShow) {

                        var y = document.body.scrollTop || document.documentElement.scrollTop;

                        var dist = ordermainOff - y
                        if (dist <= 0) {
                            var clas = $(".ordermain-nav").hasClass("sticky")

                            if (!clas) {
                                $(".ordermain-nav").addClass('sticky')
                                var maxh = $(".sticky").outerHeight()

                            }

                            var cliH = window.screen.height

                            var st = lastItem - y

                            if (st < cliH && st < maxh) {
                                st = st + 'px'
                                $(".sticky").css("max-height", st)

                            } else {
                                $(".sticky").css("max-height", maxh)

                            }
                            var index = 0

                            for (; index < len; index++) {
                                var abs = Math.abs(dist)
                                if (arrayTOP[index] >= abs) {
                                    break
                                }
                            }
                            index--
                            $(".ordermain-nav a").removeClass("active")
                            $(".ordermain-nav a").eq(index).addClass("active")

                        } else {
                            $(".ordermain-nav").removeClass('sticky')
                            navH = $(".ordermain-nav").outerHeight()
                        }

                    }
                }
            },
            //加
            add: function (event) {
                var obj = (event.target)
                var that = this;
                that.items = true;
                console.log("加")
                var index = $(obj).attr("data-index")
                var foodindex = $(obj).attr("data-foodindex")
                var size = that.von[index].distop[foodindex].size
                var taste = that.von[index].distop[foodindex].taste
                var showst = false
                if (Boolean(size)) {
                    if (size.length > 0) {
                        showst = true
                    }
                }
                if (Boolean(taste)) {
                    if (taste.length > 0) {
                        showst = true
                    }
                }
                if (showst) {
                    that.specs(obj)
                } else {
                    console.log(that.von)
                    console.log(that.von[index].distop[foodindex].numb)
                    that.von[index].distop[foodindex].numb++
                    var von = that.von
                    console.log(von)
                    var arr = new Object(von[index].distop[foodindex])
                    if (arr.boxFee == 1) {
                        that.boxPrice = Number(that.boxPrice) + Number(that.boxFees);
                        //$('#canhe').text('￥' + boxPrice)
                    }
                    var mark = 'a' + index + 'b' + foodindex
                    var objs = {arr: arr, mark: mark};
                    var ob = new Object(objs)
                    var car1 = []
                    if (that.car != '') {

                        car1 = that.car.filter(function (item) {
                            return item.mark != mark
                        })
                    }
                    if (ob.arr.type == 2) {
                        if (car1.length > 0) {
                            alert('团购商品不可与其他商品同时购买')
                            that.von[index].distop[foodindex].numb = 0
                        } else {
                            car1.push(ob)
                            var car = new that.clone(car1)
                            console.log('car', car)
                            $(".btnjs").addClass("sure")
                            that.orderType = 4
                            // xiadan()
                        }
                    } else {
                        car1.push(ob)
                    }
                    var car = new that.clone(car1)
                    console.log(car);
                    that.car = car
                    that.animtions(event) //动画
                    that.sum()
                }
            },

            sub: function (event) { //减
                var that = this
                that.items = true;
                var obj = (event.target)
                var index = $(obj).attr("data-index")
                var foodindex = $(obj).attr("data-foodindex")

                var spec = that.von[index].distop[foodindex]
                var bole = Boolean(spec.size || spec.taste)
                if (bole) {
                    that.tisSub(obj)
                } else {
                    var von = that.von
                    von[index].distop[foodindex].numb--
                    that.$set(von[index].distop[foodindex], 'numb', von[index].distop[foodindex].numb)

                    var mark = 'a' + index + 'b' + foodindex
                    var arr = new Object(von[index].distop[foodindex])
                    if (arr.boxFee == 1) {
                        that.boxPrice = Number(that.boxPrice) - Number(that.boxFees);
                        //$('#canhe').text('￥' + boxPrice)
                    }
                    var objs = {arr: arr, mark: mark};
                    var car = that.car;
                    var car1 = car.filter(function (item) {
                        return item.mark != mark
                    })

                    if (that.von[index].distop[foodindex].numb > 0) {
                        car1.push(objs)
                        var car = car1

                    } else {

                        for (var i in car) {

                            if (mark == car[i].mark) {
                                console.log("减")
                                car.splice(i, 1)
                                that.car = car
                                that.von = von
                                that.sum()
                                return false
                            }
                        }

                    }
                    that.car = car

                    that.sum()
                }
            },
            //总数
            sum: function () {

                var that = this
                console.log(that.von)

                var totalprice = 0
                var totalnumb = 0
                var totalMarketPrice = 0
                var car = that.car
                if (Boolean(car)) {
                    console.log(car);
                    for (var i = 0; i < car.length; i++) {
                        totalprice = Math.round(totalprice * 100 + car[i].arr.shopPrice * car[i].arr.numb * 100) / 100;
                        totalMarketPrice = totalMarketPrice + car[i].arr.marketPrice * car[i].arr.numb
                        totalnumb = Number(totalnumb) + Number(car[i].arr.numb)
                    }

                    totalprice = Math.round(totalprice * 100 + that.boxPrice * 100) / 100

                    totalMarketPrice = totalMarketPrice + parseInt(that.boxPrice * 100) / 100
                    //total(totalprice, totalnumb)

                }

                that.totalprice = totalprice
                that.totalnumb = totalnumb

                console.log("总价")
                //判断起送价
                var distance_price = 0
                var dfm = that.dataz.deliveryFreeMoney
                dfm = Number(dfm)
                distance_price = (parseInt(dfm * 100) - parseInt(totalMarketPrice * 100)) / 100
                console.log(distance_price);
                var shopSure = that.shopSure
                var distance_text = that.distance_text


                //加入缓存
                var shopId = $('input[name=shopId]').val();
                var shopName = $(".shopName").text();

                var stor = window.localStorage;
                var shop = stor.getItem("shop");
                if (!Boolean(shop)) {
                    shop = [];
                } else {
                    shop = JSON.parse(shop);
                    shop = shop.filter(function (item) {
                        return item.shopId != shopId
                    })
                    if (shop.length > 9) {
                        shop.shift()
                    }

                }
                //判断是否休息
                var shopAtive = $('input[name=shopAtive]').val()
                var isShopAtive = $('input[name=isShopAtive]').val()
                var indexNewObj = false
                if (shopAtive == 1 && isShopAtive == 1) {
                    if (car.length > 0) {
                        if (distance_price > 0) {
                            shopSure = false
                            distance_text = "还差" + distance_price + "起送"
                        } else {
                            shopSure = true
                            distance_text = "去结算"

                        }

                        var obj = {car: car, shopId: shopId};
                        var newObj = new Object(obj)
                        shop.push(newObj)
                        var deliveryStartMoney = that.dataz.deliveryStartMoney;
                        var deliveryFreeMoney = that.dataz.deliveryFreeMoney;
                        var deliveryCostTime = that.dataz.deliveryCostTime;
                        var indexObj = {
                            car: car,
                            shopId: shopId,
                            shopName: shopName,
                            deliveryStartMoney: deliveryStartMoney,
                            deliveryFreeMoney: deliveryFreeMoney,
                            deliveryCostTime: deliveryCostTime
                        };//主页的购物车
                        indexNewObj = new Object(indexObj)


                    } else {
                        shopSure = false
                        distance_text = "购物车是空的"
                    }
                }
                else {

                    shopSure = false
                    distance_text = "商家已歇业"
                }


                stor.setItem("shop", JSON.stringify(shop));
                stor.setItem("indexCar", JSON.stringify(indexNewObj));
// console.log(JSON.parse(stor.getItem("shop")))
                console.log(JSON.parse(stor.getItem("indexCar")))
                that.shopSure = shopSure;
                that.distance_text = distance_text;
                if (that.updataSum) {
                    that.updataSum = false
                } else {
                    // scope.$apply();
                }

            },
            dfmS: function () {
                var dfm = $(".deliveryFreeMoney").text()
                dfm = Number(dfm)
                if (dfm > 0) {
                    $(".sureWord").text("还差" + dfm + "起送")
                } else {
                    $(".sureWord").text("下单")
                }
            },
            // total: function () {
            //     if (totalnumb > 0) {
            //         $('.sunamount').show()
            //         var totalnumb = parseInt(totalnumb)
            //         $('.sunamount').text(totalnumb)
            //     } else {
            //         $('.sunamount').hide()
            //     }
            //
            //     var totalprice = totalprice > 0 ? Number(totalprice).toFixed(2) : 0
            //
            //     $('#shopp-price').text(totalprice)
            // },
            //购物总数弹出框的·减
            buysub: function (index) {
                var that = this
                that.buyItems = true

                var car = that.car
                var von = that.von

                car[index].arr.numb--

                var mark = car[index].mark
                var a = mark.substring(mark.indexOf("a") + 1, mark.indexOf("b"))
                var b = mark.substring(mark.indexOf("b") + 1)

                von[a].distop[b].numb--
                var arr = von[a].distop[b]
                if (arr.boxFee == 1) {
                    that.boxPrice = Number(that.boxPrice) - Number(that.boxFees);
                    //$('#canhe').text('￥' + boxPrice)
                }

                if (car[index].arr.numb <= 0) {
                    car.splice(index, 1)
                }
                that.car = car
                that.von = von

                that.sum()
            },
            //购物总数弹出框的·加
            buyadd: function (index) {
                var that = this
                that.buyItems = true
                var car = that.car
                console.log(car[index])

                var von = that.von;
                console.log(car[index].arr.numb)
                car[index].arr.numb++
                console.log(car[index].arr.numb)
                var mark = car[index].mark
                var a = mark.substring(mark.indexOf("a") + 1, mark.indexOf("b"))
                var b = mark.substring(mark.indexOf("b") + 1)
                console.log(von[a].distop[b].numb)
                if (car[index].arr.numb != von[a].distop[b].numb) {
                    von[a].distop[b].numb++
                }//von为缓存时和非缓存时的区别

                console.log(von[a].distop[b].numb)

                var arr = von[a].distop[b]
                if (arr.boxFee == 1) {
                    that.boxPrice = Number(that.boxPrice) + Number(that.boxFees);
                    //$('#canhe').text('￥' + boxPrice)
                }
                that.car = car
                that.von = von
                that.sum()
            },
            //购物车显示隐藏
            shopcartTF: function () {
                $(".shopCart-food").slideToggle('fast')
            },
            //购买下单
            puy: function (event) {
                var that = this
                var shopSure = that.shopSure

                if (shopSure) {
                    location.href = '/pc/submit.html'
                    // var car = that.car;
                    // var shopId = $('input[name=shopId]').val();
                    // var obj = {car: car, shopId: shopId}
                    // var stor = window.localStorage
                    // var orderType = that.orderType
                    // stor.setItem("submitData", JSON.stringify(obj))
                    //
                    // var json_cat = JSON.stringify(car);
                    // that.StandardPost('/index.php/HomePc/index/submit', json_cat);
                    // if (orderType) {
                    //     that.StandardPost('/index.php/HomePc/index/submit?orderType=' + orderType, json_cat);
                    // }

                }

                // event.stopPropagation();
                // event.preventDefault()
            },
            // //js 实现表单post跳转页面
            // StandardPost: function (url, args) {
            //     var shopId = $('input[name=shopId]').val();
            //
            //     var form = $("<form method='post'></form>");
            //     form.attr({"action": url});
            //
            //
            //     var input = $("<input type='hidden'>");
            //     input.attr({"name": "arr"});
            //     input.val(args);
            //
            //     var shopinput = $("<input type='hidden'>");
            //     shopinput.attr("name", "shopId")
            //     shopinput.val(shopId)
            //
            //     form.append(input);
            //     form.append(shopinput);
            //
            //     form.submit();
            // },
            // //angularjs调用
            // $scope:function () {
            //     var appElement = document.querySelector('[ng-controller=myCtrl]');
            //     var $scope = angular.element(appElement).scope();
            //     return $scope
            //
            //     // $scope.$apply(); 提醒更新视图
            // },
            clone: function (obj) {
                var o, i, j, k;
                if (typeof(obj) != "object" || obj === null) return obj;
                if (obj instanceof (Array)) {
                    o = [];
                    i = 0;
                    j = obj.length;
                    for (; i < j; i++) {
                        if (typeof(obj[i]) == "object" && obj[i] != null) {
                            o[i] = arguments.callee(obj[i]);
                        } else {
                            o[i] = obj[i];
                        }
                    }

                } else {
                    o = {};
                    for (i in obj) {
                        if (typeof(obj[i]) == "object" && obj[i] != null) {
                            o[i] = arguments.callee(obj[i]);
                        } else {
                            o[i] = obj[i];
                        }
                    }
                }
                console.log(o)
                return o;

            },
            //收藏
            collectClick: function (obj) {
                var that = this
                // var userId = $('input[name=userId]').val()
                // var shopId = $('input[name=shopId]').val();
                if (that.userId == '') {
                    var test = window.location.href;
                    var storage = window.localStorage;
                    storage.removeItem('jumpUrl')
                    storage.setItem("jumpUrl", test);

                    location.href = "/pc/login.html";
                    //return false
                }
                else {
                    // var active = $(obj).attr('data-active');
                    if (that.collect == 1) {
                        axios({
                            method: "post",
                            url: '/pc/Shop/delete_collect',
                            data:
                                {
                                    userId: that.userId,
                                    shopId: that.shopId
                                },
                        }).then(function (res) {
                            console.log(res)
                            if (res.data.res == 1) {
                                that.collect = 0;
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
                                    shopId: that.shopId
                                },
                        }).then(function (res) {
                            console.log(res)
                            if (res.data.res == 1) {
                                that.collect = 1;
                            }
                        })

                    }
                }
            },
            //     $(document).keyup(function (event) {
            //     if (shopShowType == 1) {
            //         switch (event.keyCode) {
            //             case 27:
            //                 shopShow()
            //
            //                 break;
            //             case 96:
            //                 shopShow()
            //                 break;
            //         }
            //     }
            //     shopShowType = 0
            // });
            //搜索商品
            serchGoods: function () {
                var that = this
                var searchData = {}
                console.log(10)
                var keyword = $('input[name=search]').val()
                var shopId = $('input[name=shopId]').val()
                if (!keyword) {

                    location.reload();
                }
                axios({
                    method: "post",
                    url: '/pc/Shop/serchGoods',
                    data:
                        {
                            keyword: keyword,
                            shopId: shopId
                        },
                }).then(function (res) {
                    console.log(res);
                    if (res.data.res == 1) {
                        /*$('.ordermain-nav').hide()
                        von=res.dishes;
                        $scope().von = res.dishes;
                        $scope().$apply();*/
                        var datas = []
                        if (Boolean(res)) {
                            var arr = res.data.data
                            var vons = that.von
                            for (var i in vons) {
                                for (var j in vons[i].distop) {
                                    for (var k = 0; k < arr.length; k++) {
                                        var goodsId = vons[i].distop[j].goodsId;
                                        var carId = arr[k]
                                        if (goodsId == carId) {
                                            var obj = new Object(vons[i].distop[j])
                                            obj.a = i;
                                            obj.b = j

                                            datas.push(obj)

                                            arr.splice(k, 1)
                                        }
console.log(datas)

                                    }

                                }

                                if (arr.length <= 0) {
                                    break;
                                }

                            }
                            that.search = true
                            searchData = {distop: datas, name: keyword}
                            console.log(searchData, "searchData")
                            that.searchShow = true;
                            that.searchData = searchData;
                            $('.searchClear').hide();
                            // $scope().$apply()

                        }


                    } else {

                        that.search = false
                        that.searchShow = true;
                        that.searchData = {name: keyword};
                    }
                })
            },
            bottomClick: function () {//投诉
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
                        shopId: that.shopId,
                    }
                }).then(function (res) {
                    if (res.data.res == 1) {
                        alert('提交成功！');
                        location.reload();
                    } else {
                        alert('提交失败！');
                        return false
                    }
                })
            },
            count: function (item) {

                var count = item.arr.shopPrice * item.arr.numb
                var count = count.toFixed(2)
                return count
                console.log(count)
            },
            itemnameMove: function (event) {
                var that = this;
                that.timer = setTimeout(function () {
                    $(event.target).parent().find('.boxHide').show();
                }, 500)

//           that.timer=setTimeout(function () {
// console.log(event)
//
//                     var x = event.offsetX+5;
//                     var y = event.offsetY+25
//                   console.log(x,y)
//                     $(event.target).parent().find('.boxHide').css({'top': y, 'left': x, 'display': 'inline-block'})
//
//
//                 }, 100);


            },
            itemnameOver: function () {
                var that = this
                $('.boxHide').hide();
                clearTimeout(that.timer)
            },
            kucunMove: function (event) {
                var that = this;
                that.timer = setTimeout(function () {
                    $(event.target).parent().find('.kucunHide').show();
                }, 500)
            },
            kucunOver: function () {
                var that = this
                $('.kucunHide').hide();
                clearTimeout(that.timer)
            },
            check: function (item) {//判断库存
                console.log(item)
                var sizeIndex = Number(item.arr.decide.size);
                // console.log(item.arr.size.length>0&&item.arr.size)
                var kucunCheck =true
                if (item.arr.size) {
                        if (item.arr.numb < item.arr.size[sizeIndex].kucun || item.arr.size[sizeIndex].kucun == -1) {
                            return true
                        }
                }else
                if (item.arr.numb < item.arr.goodsStock || item.arr.goodsStock == -1) {
                        return true
                    }

            },
            detaileName: function (item) {//显示详细名字
                var sizeIndex = Number(item.arr.decide.size);
                var tasteIndex = Number(item.arr.decide.taste);
                var detaileName = item.arr.goodsName;
                if (item.arr.size) {


                        detaileName = detaileName + ' ' + item.arr.size[sizeIndex].name;

                }
                if (item.arr.taste) {


                        detaileName = detaileName + ' ' + item.arr.taste[tasteIndex].name;

                }
                return detaileName
            },
        }
    });


}
// window.onmousedown = function () {
//     $('.tooltipSub').hide()
// }
// $(document).keyup(function (event) {
//     if (shopShowType == 1) {
//         switch (event.keyCode) {
//             case 27:
//                 shopShow()
//
//                 break;
//             case 96:
//                 shopShow()
//                 break;
//         }
//     }
//     shopShowType = 0
// });
