window.onload = function() {
    var shopData = JSON.parse(localStorage.getItem('shopData'));
    if (!shopData) {
        location.href = "/business/Login/index.html";
    } else {
        var app = new Vue({
            el: '.dec',
            data: {},
            methods: {
                cekosClick: function () {
                    $(".cdeGjh_kw").show();
                },
                Hh_kjhClick: function () {
                    $(".cdeGjh_kw").hide();
                },
                xwicClick: function () {
                    history.back();
                },
                sjwiClick: function () {
                    var mihn = $("#minchen").val(); // 获取优惠劵名称
                    var shux = $("#shuzi").text(); //获取  优惠劵数量
                    var skvg = $("#cveko").val(); //获取  优惠劵金额
                    var sfght = $("#cejHjk").val(); //获取  使用门槛
                    var xhucc = $('input[name="fr"]:checked').val();  //  使用门槛
                    var sfght = $("#ceJonj").val(); //获取  优惠劵有效期
                    var eioug = $('input[name="padcoed"]').is(':checked');

                }
            }

        })
    }
}







    
