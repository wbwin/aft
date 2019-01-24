window.onload = function () {
    var shopData = JSON.parse(localStorage.getItem('shopData'));
    if (!shopData) {
        location.href = "/business/Login/index.html";
    } else {
        var app = new Vue({
            el: '.dec',
            data: {
                urlnei: '',
                urlner: '',
            },
            methods: {
                inputcoolChange: function (obj) {
                    var fil = obj.target.files;

                    for (var i = 0; i < fil.length; i++) {
                        var urlnei = this.urlnei;
                        var reader = new FileReader();
                        reader.readAsDataURL(fil[i]);
                        reader.onload = function () {
                            document.getElementById("phongku").innerHTML = "<img class='cdsac' src='" + reader.result + "'>";
                            urlnei = reader.result
                        };
                    }
                },

                quedClick: function () {
                    // 点击 【门店装修】【开启】【保存并使用模板】【确定】
                    var thesrc = $("#phongku img").attr("src"); //  获取 门店装修 中上传的图片
                    console.log(thesrc);
                    axios({
                        methods: "post",
                        url: '/Business/Canteen/changeDesk',
                        data: deskNum, token: shopData.token
                    }).then(function () {

                        if (res.data.res == -1) {
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href = "/business/Login/index.html";
                        }

                    })
                    //  点击保存 【确定】
                    $(".ton_on").hide();
                    $(".xgcgtck").show();
                    $("#dianji\\.info").html("修改成功!!!");
                    setTimeout(function () {
                        $(".xgcgtck").hide();
                    }, 400);
                },
                ekcjChange: function (obj) {
                    var fil = obj.target.files;
                    for (var i = 0; i < fil.length; i++) {
                        var urlner = this.urlner;
                        var reader = new FileReader();
                        reader.readAsDataURL(fil[i]);
                        reader.onload = function () {
                            document.getElementById("risjkis").innerHTML = "<img class='cswkoner' src='" + reader.result + "'>";
                            urlner = reader.result
                        };
                    }
                },

                ekji_keClick: function () {
                    //  点击 【系统消息】 【保存】
                    var ulke = $("#risjkis img").attr("src"); // 获取  系统消息   保存  路径 需解码  很长  loingtime
                    console.log(ulke);
                    axios({
                        methods: "post",
                        url: '',
                        data: {token: shopData.token},
                    }).then(function () {
                        if (res.data.res == -1) {
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href = "/business/Login/index.html";
                        }
                    })
                    // 店铺招牌 保存
                    $(".xg_cgtck").show();
                    setTimeout(function () {
                        $(".xg_cgtck").hide();
                    }, 500);
                },
                diJi_kaiqiClick: function () {
                    if ($(".bug_uij").css("display") == "none") {
                        $(".bug_uij").show();
                        $("#dianji\\.info").html("已开启");
                        $(".xgcgtck").show();
                        setTimeout(function () {
                            $(".xgcgtck").hide();
                        }, 500);
                    } else {
                        $(".bug_uij").hide();
                        $("#dianji\\.info").html("开启");
                        $(".xgcgtck").show();
                        setTimeout(function () {
                            $(".xgcgtck").hide();
                        }, 500);
                    }
                },
                mobanshiyClick: function () {
                    //  点击保存 并 使用模板
                    $(".ton_on").show();
                },
                zaikClick: function () { //  点击保存 【再看看】
                    $(".ton_on").hide();

                },
                edjoo_jClick: function () { // 点击上传图片
                    $("#ekcj").click();

                },
                two_tupianClick: function () {
                    // 点击第二张 图片
                    $("#dat").click(); //  大图式 被 点击
                },
                one_tupianClick: function () {
                    $("#lie").click(); //  列表式 被 点击
                },
                eo_kiwClick: function () {
                    // 点击 上传图片
                    $(".file").click();

                },
                fe_xitgClick: function () { //   系统消息
                    $(".mendian_zhaungxiu").hide();
                    $(".xitong_xiopxi").show();
                    $("#fe_xitg").css({"color": "#06c1ae", "border-bottom": "5px solid #06c1ae"});
                    $("#fe_yewu").css({"color": "#000", "border-bottom": "0px solid #06c1ae"});

                },
                fe_yewuClick: function () { // 业务通知
                    $(".mendian_zhaungxiu").show();
                    $(".xitong_xiopxi").hide();
                    $("#fe_xitg").css({"color": "#000", "border-bottom": "0px solid #06c1ae"});
                    $("#fe_yewu").css({"color": "#06c1ae", "border-bottom": "5px solid #06c1ae"});

                }
            }
        })
    }
}