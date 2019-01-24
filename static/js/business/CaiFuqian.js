window.onload = function () {
    var shopData = JSON.parse(localStorage.getItem('shopData'));
    if (!shopData) {
        location.href = "/business/Login/index.html";
    } else {


            var app = new Vue({
                el: '.dec',
                data: {},
                methods: {
                    yhangpClick: function () {
                        //  点击 【储蓄卡】
                        $(".wsdj_one").hide();
                        $(".wsdj_two").show();
                        $(".wsdj_three").hide();
                        $(".alipai").css({"border": "0px", "background": "#ebeef2"});
                        $(".yhangp").css({
                            "border": "2px solid #06c1ae",
                            "background": "#fff",
                            "border-bottom": "2px solid #fff"
                        });
                        $(".tangsj").css({"border": "0px", "background": "#ebeef2"});
                    },
                    tangsjClick: function () {
                        //  点击 【企业网银支付】
                        $(".wsdj_one").hide();
                        $(".wsdj_two").hide();
                        $(".wsdj_three").show();
                        $(".alipai").css({"border": "0px", "background": "#ebeef2"});
                        $(".yhangp").css({"border": "0px", "background": "#ebeef2"});
                        $(".tangsj").css({
                            "border": "2px solid #06c1ae",
                            "background": "#fff",
                            "border-bottom": "2px solid #fff"
                        });
                    },
                    alipaiClick: function () {
                        //  点击 【企业网银支付】
                        $(".wsdj_one").show();
                        $(".wsdj_two").hide();
                        $(".wsdj_three").hide();
                        $(".alipai").css({
                            "border": "2px solid #06c1ae",
                            "background": "#fff",
                            "border-bottom": "2px solid #fff"
                        });
                        $(".yhangp").css({"border": "0px", "background": "#ebeef2"});
                        $(".tangsj").css({"border": "0px", "background": "#ebeef2"});
                    },
                    efj_dsClick: function () {
                        // 点击预付款
                        var ccdee = $("input[name='ss']:checked").val() // 获取付款的方式
                        console.log(ccdee);
                        axios({
                            methods: "post",
                            url: '',
                            data: {},
                        }).then(function () {

                        })

                    },
                }
            })
        }

}