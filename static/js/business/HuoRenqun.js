window.onload = function () {


    var app = new Vue({
        el: '.dec',
        data: {},
        methods: {
            youkClick: function () {
                $(".xing").click();
                $(".youk").css({"background": "#06c1ae", "color": "#fff"});
                $(".zauo").css({"background": "#fff", "color": "#06c1ae"});
                $(".louischowone").hide();
                $(".louischowtwo").show();
            },
            zauoClick: function () {
                $(".laog").click();
                $(".zauo").css({"background": "#06c1ae", "color": "#fff"});
                $(".youk").css({"background": "#fff", "color": "#06c1ae"});
                $(".louischowone").show();
                $(".louischowtwo").hide();
            },
            chu: function () {
                $(".cweoiFk").show();
            },
            yin: function () {
                $(".cweoiFk").hide();
            },
            scdcdkClick: function () { // 点击  时间段
                if ($(".cdeoFkj").css("display") == "none") {
                    $(".cdeoFkj").show();
                } else {
                    $(".cdeoFkj").hide();
                }
            },
            Louis: function (obj) { //  非 【自定义】
                var vrf = obj.target.innerText;
                $(".scdcdk").val(vrf);
                $(".A_own").hide();
                $(".cdeoFkj").hide();
            },
            Chow: function (obj) { //  【自定义】
                var vrf = obj.target.innerText;
                $(".scdcdk").val(vrf);
                $(".A_own").show();
                $(".cdeoFkj").hide();
            },
            onpchu: function () {
                $(".oneiFk").show();
            },
            onpyin: function () {
                $(".oneiFk").hide();
            },
            twpchu: function () {
                $(".twoiFk").show();
            },
            twpyin: function () {
                $(".twoiFk").hide();
            },
            foupchu: function () {
                $(".theeiFk").show();
            },
            foupyin: function () {
                $(".theeiFk").hide();
            },
            sichu: function () {
                $(".fouriFk").show();
            },
            siyin: function () {
                $(".fouriFk").hide();
            },
            wuchu: function () {
                $(".fiveFk").show();
            },
            wuyin: function () {
                $(".fiveFk").hide();
            },
            sicchu: function () {
                $(".sicFk").show();
            },
            sicyin: function () {
                $(".sicFk").hide();
            },
            qicchu: function () {
                $(".seveFk").show();
            },
            qicyin: function () {
                $(".seveFk").hide();
            },
            bacchu: function () {
                $(".enghtFk").show();
            },
            bacyin: function () {
                $(".enghtFk").hide();
            },
            szjiaClick: function () { // 点击  消费 频次 【左】 【加】
                var szjiaZhi = $("#Acon").val();
                if (szjiaZhi == "") {
                    $("#Acon").val(szjiaZhi + 1);
                } else {
                    SefZhi = parseInt(szjiaZhi) + 1
                    $("#Acon").val(SefZhi);
                }
            },
            szjianClick: function () { // 点击  消费 频次 【左】 【减】
                var szjiaZhi = $("#Acon").val();
                if (szjiaZhi == "") {
                    $("#Acon").val();
                } else {
                    if (szjiaZhi <= 1) {
                        $("#Acon").val('1');
                    } else {
                        SenZhi = parseInt(szjiaZhi) - 1;
                        $("#Acon").val(SenZhi);
                    }
                }
            },
            syjiaClick: function () {
                var syjiaZhi = $("#Bcon").val();
                if (syjiaZhi == "") {
                    $("#Bcon").val(syjiaZhi + 1);
                } else {
                    SefZhi = parseInt(syjiaZhi) + 1
                    $("#Bcon").val(SefZhi);
                }
            },
            syjian: function () {
                var syjiaZhi = $("#Bcon").val();
                if (syjiaZhi == "") {
                    $("#Bcon").val();
                } else {
                    if (syjiaZhi <= 1) {
                        $("#Bcon").val('1');
                    } else {
                        ohjew = parseInt(syjiaZhi) - 1;
                        $("#Bcon").val(ohjew);
                    }
                }
            },
            AjiaClick: function () { // 点击 消费客价格 【左】 【加】
                var Coned = $("#Ccon").val();
                if (Coned == "") {
                    $("#Ccon").val(Coned + 1);
                } else {
                    SenZhi = parseInt(Coned) + 1;
                    $("#Ccon").val(SenZhi);
                }
            },
            AjianClick: function () { // 点击 消费客价格 【左】 【减】
                var Coned = $("#Ccon").val();
                if (Coned == "") {
                    $("#Ccon").val();
                } else {
                    if (Coned <= 1) {
                        $("#Ccon").val('1');
                    } else {
                        RedZhi = parseInt(Coned) - 1;
                        $("#Ccon").val(RedZhi);
                    }
                }
            },
            BjiaClick: function () { // 点击 消费客价格 【右】 【加】
                var Coned = $("#Dcon").val();
                if (Coned == "") {
                    $("#Dcon").val(Coned + 1);
                } else {
                    SenZhi = parseInt(Coned) + 1;
                    $("#Dcon").val(SenZhi);
                }
            },
            BjianClick: function () { // 点击 消费客价格 【右】 【减】
                var Coned = $("#Dcon").val();
                if (Coned == "") {
                    $("#Dcon").val();
                } else {
                    if (Coned <= 1) {
                        $("#Dcon").val('1');
                    } else {
                        RedZhi = parseInt(Coned) - 1;
                        $("#Dcon").val(RedZhi);
                    }
                }
            },
            buttClick: function () {
                var laoguke = $(".laog").is(':checked'); //  获取 老顾客 有无 选中
                // console.log(laoguke);
                if (laoguke == true) { //
                    // alert('0');  // 为 0 是 老顾客
                    var vcedvcd = $(".sjcdk").val(); //  人群名称
                    var minchen = $(".sjcvfrdk").val(); //  人群描述
                    var xce = $(".scdcdk").val(); //  时间段

                    var checkeds = []; //  获取选框 是否选中  [多个 选中]
                    $("input[name='ckler']:checked").each(function () {
                        var aa = $(this).val();
                        checkeds.push(aa);
                    })


                    var ecs = $("#Acon").val(); // 消费频次 [左]
                    var sdv = $("#Bcon").val(); // 消费频次 [右边]
                    var bned = $("#Ccon").val(); // 消费客价格 [左]
                    var sdbv = $("#Dcon").val(); // 消费客价格 [右边]
                    var svsdf = $('input[name=ok]:checked').val(); // 获取 评价
                    var vfn = $('input[name=dian]:checked').val(); // 获取 是否收藏店铺

                } else {
                    // alert('1'); // 为 1 是 新顾客
                    var minchen = $(".sjcdk").val(); //  人群名称
                    var minwev = $(".sjcvfrdk").val(); //  人群描述
                    var shiduan = []; //  获取选框 是否选中  [多个 选中]  【下单时段】
                    $("input[name='fuhf']:checked").each(function () {
                        var louikd = $(this).val();
                        shiduan.push(louikd);
                    });



                }
            }
        },
        mounted: function () {
            $("#Aown").dateSelect();
            $("#Aurh").dateSelect();
        }

    })
}