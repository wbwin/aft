window.onload = function () {
    var shopData = JSON.parse(localStorage.getItem('shopData'));
    if (!shopData) {
        location.href = "/business/Login/index.html";
    } else {
        var app = new Vue({
            el: '.dec',
            data: {
                dataz: {},
                datas: {},
            },
            created: function () {
                var that = this;
                axios({
                    method: 'post',
                    url: 'https://www.aftdc.com/business/Store/message_list',
                    data: {token: shopData.token},
                }).then(function (res) {
                    console.log(res);
                    that.dataz = res.data.data.res;
                    that.datas = res.data.data.ress;
                    if (res.data.res == -1) {
                        alert(res.data.reason)
                        localStorage.removeItem('shopData');
                        location.href = "/business/Login/index.html";
                    }
                })
            },
            methods: {
                tan_allClick: function (index) { // 点击【查看】
                    var that = this;
                    $(".efp").hide();
                    $(".wekj_k").show();
                    var id = $('.tan_all').attr('data-id')
                    var id = that.dataz[index].id;

                    location.href = '/business/Store/ActMesgConter.html?id=' + id
                },
                xitg_deClick: function () {
                    $(".xitg_de").css({"color": "#06c1ae", "border-bottom": "5px solid #06c1ae"});
                    $(".ywwu_de").css({"color": "#000", "border-bottom": "0px solid #fff"});
                    $(".wekj_k").hide();
                    $(".cei_xc").show();
                    $(".efp").hide();
                },
                ywwu_deClick: function () {
                    $(".xitg_de").css({"color": "#000", "border-bottom": "0px solid #fff"});
                    $(".ywwu_de").css({"color": "#06c1ae", "border-bottom": "5px solid #06c1ae"});
                    $(".cei_xc").hide();
                    $(".efp").show();
                },
                backClick: function () {
                    location.href = '/Business/Act/ActMesg'
                },
            }
        })
    }
}