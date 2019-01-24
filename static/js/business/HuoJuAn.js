window.onload = function() {
    var shopData = JSON.parse(localStorage.getItem('shopData'));
    if (!shopData) {
        location.href = "/business/Login/index.html";
    } else {
        var app = new Vue({
            el: '.dec',
            data: {},
            methods: {
                youtoipClick: function () {
                    $(".zuotoip").css({"color": "#999", "border-top": "0px solid #06c1ae", "background": "#fafafa"});
                    $(".youtoip").css({"color": "#06c1ae", "border-top": "3px solid #06c1ae", "background": "#fff"});
                    $(".zuobb").hide();
                    $(".youbb").show();
                },
                zuotoipClick: function () {

                    $(".youtoip").css({"color": "#999", "border-top": "0px solid #06c1ae", "background": "#fafafa"});
                    $(".zuotoip").css({"color": "#06c1ae", "border-top": "3px solid #06c1ae", "background": "#fff"});
                    $(".zuobb").show();
                    $(".youbb").hide();
                },

                crjvrClick: function () {
                    if ($(".ecwkojHk").hide()) {
                        $(".ecwkojHk").show();
                    } else {
                        $(".ecwkojHk").hide();
                    }

                },
                denr: function (e) {

                    var edn = e.target.innerText;

                    $("#daison").text(edn);
                    $(".ecwkojHk").hide();
                },
            }
        })

    }
}
















