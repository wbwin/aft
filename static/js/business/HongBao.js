window.onload = function () {
    var shopData = JSON.parse(localStorage.getItem('shopData'));
    if (!shopData) {
        location.href = "/business/Login/index.html";
    } else {

        var app = new Vue({
            el: '.dec',
            data: {
                money: '',
                piece: '',
                ids: '',
                start_time:'',
                end_time:'',
            },
            created: function () {
                var that = this
                var url = location.search;
                var id = url.substr(1);
                id = id.replace('id=', '');
                if (id) {
                    axios({
                        method: "post",
                        url: "https://www.aftdc.com/Business/Activity/HongBaoEdit",
                        data: {
                            history: 0,
                            id: id,
                            token: shopData.token
                        }
                    }).then(function (res) {
                        console.log(res);
                        var require = res.data
                        if (require.res == 1) {
                            that.money = require.data[0].money
                            that.piece = require.data[0].piece
                            that.ids = require.data[0].id
                            that.start_time= require.data[0].start_time;
                            that.end_time= require.data[0].end_time;
                            console.log(that.ids);
                        }
                        else if (res.data.res == -1) {
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href = "/business/Login/index.html";
                        }

                    })
                }

                $(document).keydown(function (event) {  // 点击 回车键 保存
                    var keynum = event.keyCode;  //  获取回车键的 代码
                    //        console.log(keynum,"123");
                    if (keynum == '13') {          // 判断 enter 键的码 是否 13
                        $(".cevddj").click();
                    }
                })
            }
            ,
            mounted: function () {
                $("#zuotext").dateSelect();
                $("#csdevwe").dateSelect();
            }
            ,
            methods: {
                CunderClick: function () {
                    $(".Sinder").hide();
                }
                ,
                cedvvbnClick: function () {
                    $(".Sinder").show();
                }
                ,
                cevddjClick: function () {
                    var text = $("input:checkbox[name='Fruit']:checked").map(function (index, elem) {
                        return $(elem).val();
                    }).get().join(',');//
                    if (!text) {
                        // alert('请选择可用时段')
                        //   return false;
                    }
                    var timez = $("#zuotext").val(); //  开始时间 左边
                    var timey = $("#csdevwe").val(); //  结束时间 右边
                    if (!timez || !timey) {
                        alert('活动时间必填');
                        return false;
                    }
                    var spendMoney = $("input[name=spendMoney]").val(); //  满足金额
                    var couponMoney = $("input[name=couponMoney]").val(); //  优惠金额
                    if (isNaN(spendMoney) || isNaN(couponMoney)) {
                        alert("请输入数字")
                        return false
                    }
                    spendMoney = parseInt(spendMoney * 100) / 100
                    couponMoney = parseInt(couponMoney)
                    var id = $("input[name=id]").val();//红包id

                    var parterrn = /[^.\x22]+/;
                    if (!parterrn.test(spendMoney) || !parterrn.test(couponMoney)) {
                        alert('禁止·特殊符号开头')
                        return false;
                    }
                    var cvrvg = $("#diajjh").is(':checked'); // 是否 选中
                    if (!cvrvg) {
                        alert('请阅读商家自营协议')
                        return false;
                    }
                    var nmern = spendMoney + " 元代 " + couponMoney + " 元券";
                    if (!nmern) {
                        alert('请填写金额');
                        return false;
                    }
                    var getType = $('input[name="frr"]:checked').val(); // 发放渠道
                    axios({
                        method: "post",
                        url: "https://www.aftdc.com/Business/Activity/HongBao",
                        data: {
                            nmern: nmern,
                            text: text,
                            spendMoney: spendMoney,
                            couponMoney: couponMoney,
                            timez: timez,
                            timey: timey,
                            getType: getType,
                            id: id,
                            token: shopData.token
                        }
                    }).then(function (res) {
                        console.log(res)
                        if (res.data.res == 1) {
                            var end = $("#csdevwe").val()
                            var year1 = end.split("-")[0]
                            var mouth1 = end.split("-")[1]
                            var day1 = end.split("-")[2]
                            var dateSelect = new Date(year1, mouth1 - 1, day1).getTime()
                            var dateNow = new Date().getTime()
                            if (dateSelect < dateNow) {
                                alert("红包时间不可以低于今天时间")
                                return false;
                            } else {
                                alert('添加红包成功')
                                // window.parent.location.href="https://aftdc.com/index.php/Business/ShopSa/index#/Huo/Dong";
                                top.location.reload();
                            }


                        } else if (res.data.res == -1) {
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href = "/business/Login/index.html";
                        }

                        else {
                            alert('添加红包失败')
                        }
                    })

                }
            }
        })
    }

}