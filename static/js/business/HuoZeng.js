window.onload = function() {
    var shopData = JSON.parse(localStorage.getItem('shopData'));
    if (!shopData) {
        location.href = "/business/Login/index.html";
    } else {

        var app = new Vue({
            el: ".dec",
            data: {
                foodSele: [
                    {name: '超值双人套餐', child: ['小份周瑜酿皮1份+小份牛筋面1份+黄牛肉2两+小菜（随机）  48元']},
                    {name: '特色主打', child: ['黄牛肉夹馍']},
                    {name: '主菜类', child: ['酱香黄牛肉 12元',]},
                    {name: '主食类', child: ['青菜炒鸡蛋', '青菜炒12鸡蛋', '青蛋', '青菜炒鸡蛋',]},
                    {name: '小菜类', child: ['挨揍的小黄瓜 6元', '宝塔萝卜丝', '山西老醋拌云耳 8元', '酸辣土豆丝 6元',]},
                    {name: '超值男神餐', child: ['青菜炒鸡蛋', '青菜炒12鸡蛋', '青蛋', '青菜炒鸡蛋',]},
                    {name: '超值女神餐', child: ['青菜炒鸡蛋', '青菜炒12鸡蛋', '青蛋', '青菜炒鸡蛋',]},
                ],
                foodMeet: [], //接收选择菜品
                errTips: false, //提示框
            },
            created: function () {
                var foodSele = this.foodSele;
                var len = foodSele.length;
                for (var i = 0; i < len; i++) {
                    foodSele.togle = false;
                }
                var myDate = new Date();

                var year = myDate.getFullYear(); //年
                var month = myDate.getMonth() + 1; // 月
                var day = myDate.getDate(); // 日期

                month = month > 9 ? month : '0' + month // 三目判断
                day = day > 9 ? day : '0' + day // 三目判断

                var time = year + '-' + month + '-' + day
                $("#tdata").val(time)
            },

            methods: {
                foodNameFn: function (name, index) {
                    var child = this[name][index]
                    child.togle = !child.togle;
                    this.$set(this[name], index, child)

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

                // foodChildFn: function(index, numb) {
                //     var foodSele = this.foodSele;
                //     var val = foodSele[index]['child'][numb];
                //
                //     var foodMeet = this.foodMeet
                //     var len = foodMeet.length;
                //     var adop = true
                //     for(var i = 0; i < len; i++) {
                //         var name = foodMeet[i].name
                //         if(Boolean(name)) {
                //             var n = foodMeet[i].total;
                //             if(n == index) {
                //                 adop = false;
                //                 break
                //             }
                //         }else{
                //             var txt = foodMeet[i].val;
                //             if(txt == val) {
                //                 adop = false;
                //                 break
                //             }
                //         }
                //
                //
                //     }
                //     if(adop) {
                //         var obj = { val: val, total: index }
                //         this.foodMeet.unshift(obj)
                //     }
                //
                // },
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
                pedone: function () {
                    $(".thisEon").show();
                },
                ynone: function () {
                    $(".thisEon").hide();
                },
                edone: function () {
                    $(".thedEon").show();
                },
                adone: function () {
                    $(".thedEon").hide();
                },
                lastzuo: function () {
                    $(".thedSan").show();
                },
                lastyou: function () {
                    $(".thedSan").hide();
                },
                tonesFocus: function () {
                    $(".tones").css('border', '1px solid #06c1ae');
                },
                tonesBlur: function () {
                    $(".tones").css('border', '1px solid #bababa');
                },
                ttwosFocus: function () {
                    $(".ttwos").css('border', '1px solid #06c1ae');
                },
                ttwosBlur: function () {
                    $(".ttwos").css('border', '1px solid #bababa');
                },
                baocunzClick: function () {
                    var tom = $("#tdata").val(); // 活动开始时间
                    var fei = $("#Ndata").val(); // 活动结束时间
                    var csi = $(".dsFEw").val(); // 菜品名称
                    var fgi = $(".dHlorfw").val(); // 赠送Y
                    var bji = $(".dLouidw").val(); // 赠品名称
                    var mai = $(".vrrgbr").val(); // 买
                    var zen = $(".ttwos").val(); // 赠
                    var yan = $(".tones").val(); // 元
                    var jian = $("#toncvgves").val(); // 件
                    var Check = $("input[type='checkbox']").is(':checked'); //  获取选框 是否选中



                },
                kachu: function () {
                    $(".tdafoan").show();
                },
                kayin: function () {
                    $(".tdafoan").hide();
                },
                gtchu: function () {
                    $(".tdrgbran").show();
                },
                gtyin: function () {
                    $(".tdrgbran").hide();
                },
                frin: function (obj) {
                    var vreo = obj.target.innerText;
                    var cde = $(".dsFEw").val();
                    $(".dHlorfw").val(vreo);
                    $(".dLouidw").val(cde);
                    $(".dLouidw").attr("readonly", false);
                    $("#cesochHko").hide();
                },
                foub: function (obj) {
                    var vreo = obj.target.innerText;
                    var cde = $(".dsFEw").val();
                    $(".dHlorfw").val(vreo);
                    $(".dLouidw").val(cde);
                    $(".dLouidw").attr("readonly", true);
                    $("#cesochHko").hide();
                },
                dHlorfwClick: function () {
                    if ($("#cesochHko").hide()) {
                        $("#cesochHko").show();
                    } else {
                        $("#cesochHko").hide();
                    }
                },
                foChild: function (obj) {
                    var frjk = obj.target.innerText;
                    $("#neirongcent").text(frjk);
                },
                dsvswClick: function () {
                    $(".xuanhcaiping").show();
                },
                ongtuhgJpoClick: function () { // 点击【选择菜品  ×】
                    $(".xuanhcaiping").hide();
                },
                sks_ooClick: function () { // 点击【选择菜品  取消】
                    $(".xuanhcaiping").hide();
                },
                sks_kkClick: function () { //  点击  【选择菜品】 【保存】
                    var conetrx = $("#neirongcent").text(); //  获取 左边 框内的内容
                    $(".dsFEw").val(conetrx);
                    $(".xuanhcaiping").hide();
                },
                ConeylerClick: function () { // 点击 商家自营销协议 影藏框弹出
                    $(".allUender").show();

                },
                dckAwsClick: function () { // 点击 错号 【关闭影藏框】
                    $(".allUender").hide();

                }
            }

        })
    }
}