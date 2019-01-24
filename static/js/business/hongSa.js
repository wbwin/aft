window.onload = function () {
    var shopData = JSON.parse(localStorage.getItem('shopData'));
    if (!shopData) {
        location.href = "/business/Login/index.html";
    } else {
        var app = new Vue({
            el: "#HuoDong",
            data: {
                foodSele: [
                    {name: '超值双人套餐', catId: '1', child: [{name: '小份周瑜酿皮1份+小份牛筋面1份+黄牛肉2两+小菜（随机）  48元', goodsId: 1}]},
                    {name: '特色主打', catId: '2', child: [{name: '黄牛肉夹馍', goodsId: 2}]},
                    {name: '主菜类', catId: '3', child: [{name: '酱香黄牛肉 12元', goodsId: 2}]},
                    {
                        name: '主食类',
                        catId: '4',
                        child: [{name: '青菜炒鸡蛋', goodsId: 4}, {name: '青菜炒12鸡蛋', goodsId: 5}, {
                            name: '青蛋',
                            goodsId: 6
                        }, {name: '青菜炒鸡蛋', goodsId: 7}]
                    },


                ],
                foodMeet: [], //接收选择菜品
                errTips: false, //提示框
                discountGoods: [], //折扣商品
                discountId: [],
                isSave: false,
                goodsIdName: '',
                namess: ''
            },
            created: function () {
                var that = this
                axios({
                    method: "post",
                    url: 'https://www.aftdc.com/Business/Activity/getFood',
                    data: {token: shopData.token},

                }).then(function (res) {
                    if (res.data.res == 1) {
                        var namess = sessionStorage.getItem("namess");
                        that.namess = namess
                        that.foodSele = res.data.data.food
                        if (Boolean(res.data.data.discount)) {
                            that.discountGoods = res.data.data.discount;
                        }
                        var foodSele = that.foodSele;
                        var len = foodSele.length;
                        for (var i = 0; i < len; i++) {
                            foodSele.togle = false;
                        }
                        goodsIdName = foodSele.goodsId
                        console.log("goodsIdName");
                        console.log(goodsIdName);
                        var goodsId = $("input[name=goodsId]").val()
                        console.log("goodsId");
                        console.log(goodsId);
                        if (goodsId) {
                            console.log(goodsId);
                            app.foodMeet = [{goodsId: goodsId}];
                            // save(1);
                        }
                    } else if (res.data.res == -1) {
                        alert(res.data.reason)
                        localStorage.removeItem('shopData');
                        location.href = "/business/Login/index.html";
                    }


                })

            },

            methods: {
                foodNameFn: function (name, index) {
                    var child = this[name][index]
                    child.togle = !child.togle;
                    this.$set(this[name], index, child)

                },
                showSet: function (index) {
                    var discountGoods = this.discountGoods
                    var goodsName = discountGoods[index]['goodsName'];
                    var id = discountGoods[index]['id']
                    $('.goodsName').html(goodsName)
                    $(".ThisToallys").show();
                    discountId = []
                    discountId.push(id)
                    $('input[name=ener]').each(function () {
                        $(this).attr('checked', false);

                    });
                    console.log(discountId);
                    return false //禁止跳转
                },
                foodAdd: function (index) {
                    var foodSele = this.foodSele;
                    var togle = foodSele[index].togle
                    if (togle) {
                        var foodMeet = this.foodMeet;
                        var len = foodMeet.length;
                        var adop = true
                        for (var i = 0; i < len; i++) {
                            var name = foodMeet[i].name
                            if (Boolean(name)) {
                                var n = foodMeet[i].total;
                                if (n == index) {
                                    adop = false;
                                    break
                                }
                            }
                        }

                        if (adop) {
                            var obj = new Object(foodSele[index]);
                            var objs = {}
                            for (var j in obj) {
                                var types = typeof(obj[j]);
                                if (types == 'object') {
                                    objs[j] = []
                                    for (var z in obj[j]) {
                                        objs[j][z] = obj[j][z];
                                    }

                                } else {
                                    objs[j] = obj[j];
                                }

                            }
                            objs.total = index;
                            objs['togle'] = false;

                            foodMeet.unshift(objs);

                            for (var i = 0; i < foodMeet.length; i++) {
                                var name = foodMeet[i].name
                                if (!Boolean(name)) {
                                    var n = foodMeet[i].total;
                                    if (n == index) {
                                        foodMeet.splice(i, 1);
                                        i--
                                    }
                                }
                            }
                            this.foodMeet = foodMeet
                        }

                    } else {
                        this.errTipsFn()
                    }

                },
                delAll: function () {
                    var foodMeet = []
                    this.foodMeet = foodMeet
                },
                //选择全部
                selAll: function () {

                    var foodSele = this.foodSele;
                    var len = foodSele.length
                    for (var q = 0; q < len; q++) {
                        if (foodSele[q].child.length > 0) {
                            for (var k = 0; k < foodSele[q]['child'].length; k++) {
                                var val = foodSele[q]['child'][k]['name'];
                                var goodsId = foodSele[q]['child'][k]['goodsId']
                                var foodMeet = this.foodMeet
                                var len = foodMeet.length;

                                var adop = true
                                for (var i = 0; i < len; i++) {
                                    var name = foodMeet[i].name
                                    if (Boolean(name)) {
                                        var n = foodMeet[i].total;
                                        if (n == q) {
                                            adop = false;
                                            break
                                        }
                                    } else {
                                        var txt = foodMeet[i].val;
                                        if (txt == val) {
                                            adop = false;
                                            break
                                        }
                                    }
                                }
                                if (adop) {
                                    var obj = {val: val, total: 0, goodsId: goodsId}
                                    this.foodMeet.unshift(obj)
                                }
                            }
                        }
                    }
                },
                foodChildFn: function (index, numb) {
                    var foodSele = this.foodSele;
                    var val = foodSele[index]['child'][numb]['name'];
                    var goodsId = foodSele[index]['child'][numb]['goodsId']
                    var foodMeet = this.foodMeet
                    var len = foodMeet.length;

                    var adop = true
                    for (var i = 0; i < len; i++) {
                        var name = foodMeet[i].name
                        if (Boolean(name)) {
                            var n = foodMeet[i].total;
                            if (n == index) {
                                adop = false;
                                break
                            }
                        } else {
                            var txt = foodMeet[i].val;
                            if (txt == val) {
                                adop = false;
                                break
                            }
                        }
                    }
                    if (adop) {
                        var obj = {val: val, total: index, goodsId: goodsId}
                        this.foodMeet.unshift(obj)
                    }
                    console.log(foodMeet)
                },
                childSub: function (index, numb) {
                    var child = this.foodMeet[index]['child']
                    child.splice(numb, 1);
                    if (child.length <= 0) {
                        this.foodMeet.splice(index, 1)
                    } else {
                        this.foodMeet[index]['child'] = child
                    }
                },

                foodSub: function (index) {
                    this.foodMeet.splice(index, 1)
                },

                //提示框
                errTipsFn: function () {
                    var that = this
                    that.errTips = true
                    var errTime = setInterval(function () {
                        that.errTips = false;
                        clearInterval(errTime)
                    }, 1300)
                },
                show: function (obj) {
                    var zhi = $(obj).text();
                    $("#houone").val(zhi);
                    $("#houone").css('border', '1px solid #0740a8');
                    $(".leixin").hide();
                },
                funp: function (obj) {
                    var dat = $(obj).text();
                    $("#houtwo").val(dat);
                    $("#houtwo").css('border', '1px solid #0740a8');
                    $(".zhuangtaia").hide();
                },
                houoneClick: function () {// 点击 活动类型
                    $(".leixin").show();
                },
                houtowClick: function () {// 点击 活动状态
                    $(".zhuangtaia").show();
                },
                made_chaxunClick: function () {
                    var oLex = $("#houone").val(); // 获取 【活动类型】
                    var oLen = $("#houtwo").val(); // 获取 【活动状态】
                    var Htime = $("#azuihou").val(); // 获取 【活动时间】
                    var Jtime = $("#bzuihou").val(); // 获取 【结束时间】
                    axios({
                        method: "post",
                        url: '',//请求后台的路径 //如为空值页面发生错误，未解决
                        data: {
                            oLex: oLex,
                            oLen: oLen,
                            Htime: Htime,
                            Jtime: Jtime,
                            token: shopData.token
                        },
                    }).then(function (res) {
                        if (res.data.res == -1) {
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href = "/business/Login/index.html";
                        }

                    })
                },
                hsaidgaiClick: function () {// 点击【修改】
                    $(".cewo_iej").show();
                },
                ba_kcfcClick: function () {// 点击   【每单限购折扣商品种类】  [保存]
                    var tthis = $('input[name="codj"]').val();
                    $("#daichuan").val(tthis);
                    $(".cewo_iej").hide();
                },
                xdecfClick: function () {// 点击  548【错】
                    $(".cewo_iej").hide();
                },
                qu_xwkcClick: function () {// 点击  548【返回】
                    $(".cewo_iej").hide();
                },
                xauhspingClick: function () {// 点击【选择菜品】
                    $(".xuanhcaiping").show();
                    this.foodMeet = []
                },
                ongtuhgJpoClick: function () {// 点击【选择菜品  ×】
                    $(".xuanhcaiping").hide();
                },
                sks_ooClick: function () {// 点击【选择菜品  取消】
                    $(".xuanhcaiping").hide();
                },
                allBuXuanzhongClick: function () {// 点击菜品名称
                    if ($('input[name="allname"]').is(':checked'))  //  点击菜品名称 有没有选择
                    {
                        $('input[name="ener"]').prop('checked', true);
                    } else {
                        $('input[name="ener"]').prop('checked', false);
                    }
                },

                ppliangshzClick: function () {// 点击 批量设置 【弹出框
                    var discountID = this.discountID
                    if ($('input[name="ener"]').is(':checked')) {
                        $(".ThisToallys").show();
                        var id = []
                        $('input[name=ener]:checked').each(function () {
                            var checkValue = $(this).val();
                            id.push(checkValue)
                        });
                        discountId = id
                        console.log(discountId);
                        //   待处理    待处理  待处理  待处理  待处理
                    } else {
                        $(".wdWsw").show();
                        $(".swikDin").html("您没有勾选任何菜品");
                        setTimeout(function () {
                            $(".wdWsw").hide();
                        }, 2000);
                    }
                },
                pplianshchClick: function () {
                    if ($('input[name="ener"]').is(':checked')) {
                        //alert("有选择的菜品 待处理【去删除】");  //   待处理    待处理  待处理  待处理  待处理
                        if (confirm('是否删除')) {
                            var id = []
                            $('input[name=ener]:checked').each(function () {
                                var checkValue = $(this).val();
                                id.push(checkValue)
                            });
                            var jsonId = JSON.stringify(id)
                            axios({
                                method: "post",
                                url: 'https://www.aftdc.com/Business/Activity/delDiscountGoods',
                                data:
                                    {
                                        id: jsonId,
                                        token: shopData.token
                                    },
                            }).then(function (res) {
                                if (res.data.res == 1) {
                                    $(".wdWsw").show();
                                    $(".swikDin").html("删除成功");
                                    setTimeout(function () {
                                        $(".wdWsw").hide();
                                        window.parent.location.href = "/Business/ShopSa/index#/Huo/Dong";
                                        top.location.reload();
                                    }, 2000);
                                } else if (res.data.res == -1) {
                                    alert(res.data.reason)
                                    localStorage.removeItem('shopData');
                                    location.href = "/business/Login/index.html";
                                }

                            })

                        }
                    } else {
                        $(".wdWsw").show();
                        $(".swikDin").html("您没有勾选任何菜品");
                        setTimeout(function () {
                            $(".wdWsw").hide();
                        }, 2000);
                    }
                },
                saveClick: function (type) {
                    var foodMeet = app.foodMeet
                    var discountGoods = app.discountGoods
                    console.log(1111);
                    console.log(foodMeet);
                    console.log(discountGoods);
                    var goodsId = [];
                    for (var i = 0; i < foodMeet.length; i++) {
                        goodsId.push(foodMeet[i]['goodsId'])
                    }
                    axios({
                        method: "post",
                        url: 'https://www.aftdc.com/Business/Activity/setDiscount',  // 后台请求
                        data: {
                            goodsId: JSON.stringify(goodsId),
                            token: shopData.token
                        },
                    }).then(function (res) {
                        console.log(res.data);
                        if (res.data.res == 1) {
                            for (var i = 0; i < res.data.data.length; i++) {
                                discountGoods.push(res.data.data[i])
                            }
                            app.discountGoods = discountGoods
                            $('.xuanhcaiping').hide()
                            isSave = false
                            //判断是否从商品分析页面跳转进来的 是则执行下面函数调用砍价商品编辑弹出框
                            if (type == 1) {
                                var index = discountGoods.length
                                var goodsName = discountGoods[index - 1]['goodsName'];
                                var id = discountGoods[index - 1]['id']
                                $('.goodsName').html(goodsName)
                                $(".ThisToallys").show();
                                discountId = []
                                discountId.push(id)
                                $('input[name=ener]').each(function () {
                                    $(this).attr('checked', false);

                                });
                                return false //禁止跳转*/
                            }
                            $(window).bind('beforeunload', function () {
                                if (!isSave) {
                                    return '您输入的内容尚未保存，确定离开此页面吗？';
                                }

                            });

                        } else if (res.data.res == -1) {
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href = "/business/Login/index.html";
                        }

                    })

                },
                tiOoneClick: function (obj) {
                    var tone = $(obj).text();
                    $("#cenOne").val(tone);
                    $(".tinem_one").hide();
                },
                tiOtwoClick: function (obj) {
                    var ttwo = $(obj).text();
                    $("#cenTwo").val(ttwo);
                    $(".tinem_two").hide();
                },
                tiOthreeClick: function (obj) {
                    var tthree = $(obj).text();
                    $("#cenThree").val(tthree);
                    $(".tinem_three").hide();
                },
                tiOfourClick: function (obj) {
                    var tfour = $(obj).text();
                    $("#cenFour").val(tfour);
                    $(".tinem_four").hide();
                },
                cenOneClick: function () {
                    $(".tinem_one").show();
                },
                cenTwoClick: function () {
                    $(".tinem_two").show();
                },
                cenThreeClick: function () {
                    $(".tinem_three").show();
                },
                cenFourClick: function () {
                    $(".tinem_four").show();
                },
                cohn_SDUCClick: function () {
                    $(".skjkEJ_Evfgr").show();
                },
                huqwe_kqdClick: function () {
                    $(".skjkEJ_Evfgr").hide();
                },
                xcAcjkClick: function () {
                    $(".ThisToallys").hide();
                },
                Fuck_quClick: function () {
                    $(".ThisToallys").hide();
                },
                zhekouClick: function () {// 判断折扣
                    var zhekou = $("#zheIszheKou").is(':checked');
                    // console.log(zhekou);
                    if (zhekou == true) {
                        $("#zhekou_aa").show();
                        $("#huodong_bb").hide();
                        var val = $("#huodong_bb").val()
                        val = 0
                    } else {
                        $("#zhekou_aa").hide();
                        $("#huodong_bb").show();
                        var val = $("#zhekou_aa").val()
                        val = 0
                    }
                },
                Fuck_baoClick: function () {
                    var zhekou = $("#zheIszheKou").is(':checked');
                    var that = this
                    if (zhekou == true) {
                        // alert('1');

                        var Shuz = []; //做一个数组
                        /*   $('input[name=oChow]:checked').each(function(){    // 【each】 返回当前元素的键名和键值，并将内部指针向前移动：
                               var faer=$(this).val();
                               Shuz.push(faer);     // 【push】  向数组尾部插入
                           });*/
                        /* var  cenOne=$("#cenOne").val();  // 生效时段 【1】
                         var  cenTwo=$("#cenTwo").val();  // 生效时段 【2】
                         var  cenThree=$("#cenThree").val();  // 生效时段 【3】
                         var  cenFour=$("#cenFour").val();  // 生效时段 【4】
                         var  mianxiangyh=$('input[name="mianxiangyh"]:checked').val();  //面向用户
                         var  zhekou=$('input[name="zhekou"]:checked').val();  //面向用户*/
                        /* var  AerMerTop=$(".AerMerTop").val();  // 每单限购
                         var  AerMerTop=$(".Ae_MonTop").val();  // 当日活动库存*/

                        var sonedr = $(".sonedr").val();  // 折扣
                        var Vondr = '0';  // 活动价
                        if (sonedr > 9) {
                            alert('不能大于10折')
                            return false
                        }
                        if (sonedr < 1) {
                            alert('不能小于0折')
                            return false
                        }
                        ;
                    }
                    else {
                        var Vondr = $(".Vondr").val()
                        var sonedr = '0';

                    }

                    var Lzhi = $("#zuotiomn").val();  // 活动日期 【左】
                    var Rzhi = $("#youtiomn").val();  // 活动日期 【右】
                    var date = new Date(Lzhi);
                    var dateE = new Date(Rzhi);
                    var dateSt = date.getTime();//开始时间时间戳
                    var dateEt = dateE.getTime();//结束时间时间戳

                    if (dateSt >=dateEt) {
                        alert('开始时间不能大于结束时间！');
                        return false;
                    }
                    var cewko = $("#zuoend").is(':checked'); //  已阅读并同意
                    var disId = JSON.stringify(discountId)
                    if (!Lzhi || !Rzhi || !sonedr || !Vondr) {
                        alert('请填写完整')
                        return false
                    }
                    if (!cewko) {
                        alert('请阅读商家自营销协议')
                        return false
                    }
                    axios({
                        method: "post",
                        url: 'https://www.aftdc.com/Business/Activity/editDiscount',
                        data: {
                            startTime: Lzhi,
                            endTime: Rzhi,
                            disId: disId,
                            discount: sonedr,
                            discountPrice: Vondr,
                            token: shopData.token
                        },
                    }).then(function (res) {
                        console.log(res);
                        if (res.data.res == 0) {
                            alert(res.data.msg)
                            return false
                        } else if (res.data.res == -3) {
                            alert('该商品已存在类似活动，请修改活动商品')
                            return false;
                        } else if (res.data.res == -2) {
                            alert("保存成功")
                        } else if (res.data.res == 1) {

                            var discountGoods = app.discountGoods
                            console.log(discountGoods);
                            console.log(discountId);
                            for (var i = 0; i < discountId.length; i++) {
                                for (var k = 0; k < discountGoods.length; k++) {
                                    if (discountGoods[k]['id'] == discountId[i]) {
                                        that.$set(discountGoods[k], 'startTime', Lzhi);
                                        that.$set(discountGoods[k], 'endTime', Rzhi);
                                        // discountGoods[k]['startTime'] = Lzhi
                                        // discountGoods[k]['endTime'] = Rzhi
                                        if (Vondr == '0') {
                                            var ss = (discountGoods[k]['price'] * sonedr / 10).toFixed(2)
                                            that.$set(discountGoods[k], 'discount', sonedr);
                                            that.$set(discountGoods[k], 'discountPrice', ss);
                                            // discountGoods[k]['discount'] = sonedr
                                            // console.log(sonedr);
                                            // discountGoods[k]['discountPrice'] = (discountGoods[k]['price'] * sonedr / 10).toFixed(2)
                                        }
                                        else {
                                            var yy = (Vondr / discountGoods[k]['price']).toFixed(2)
                                            that.$set(discountGoods[k], 'discountPrice', Vondr);
                                            that.$set(discountGoods[k], 'discount', yy);
                                            // discountGoods[k]['discountPrice'] = Vondr
                                            // discountGoods[k]['discount'] = (Vondr / discountGoods[k]['price']).toFixed(2)
                                        }
                                        discountGoods[k]['isSale'] = '1'
                                        discountGoods[k]['goodsStatus'] = '0'
                                    }
                                }

                            }
                            $(window).unbind()
                            $(".ThisToallys").hide();
                        }
                        else if (res.data.res == -1) {
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href = "/business/Login/index.html";
                        }

                        else {
                            alert('请输入正确的金额')
                        }
                    })

                }


            },
            mounted: function () {
                $("#zuotiomn").dateSelect();
                $("#youtiomn").dateSelect();
            }

        })
    }
}
























































