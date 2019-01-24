window.onload = function () {
    $.ajax({
        url: 'https://www.aftdc.com/pc/Index/wx_message',
        type:'post',
        async:false,
        data:{},
        success:function(res){
            if (res.res == 1) {
                var dataz = res.data.users
                var data = JSON.stringify(dataz);
                var storage = window.localStorage;
                storage.removeItem('admin')
                storage.setItem("admin", data);

            }
        }
    })
    var admin = JSON.parse(localStorage.getItem('admin'));
    if (!admin) {
        var test = window.location.href;
        var storage = window.localStorage;
        storage.removeItem('jumpUrl')
        storage.setItem("jumpUrl", test);
        console.log(test)
        location.href = "/pc/login.html";
    } else {
        var app = new Vue({
            el: '#app',
            data: {
                userId: '',
                datai: '',
                datao:'',
                geographic:'',
            },
            created: function () {
                var that = this
                that.userId = admin.userId;
                that.geographic = window.localStorage.getItem("geographic");
                axios({
                    method: "post",
                    url: "/pc/Order/getHongbao",
                    data: {
                        userId: that.userId,
                    }
                }).then(function (res) {
                    console.log(res)
                    if (res.data.res == 1) {
                        that.datai = res.data.instigate;
                        that.datao = res.data.out;
                        console.log(that.datao);

                    }


                })
            },
            methods: {
                hteout: function () {
                    $('.all_pingmu').hide();
                },
                keyong: function () {
                    $('.keyong_hongbao').show();
                    $('.leftone').css({"border-bottom": "3px solid #0089dc", "font-weight": "900"});
                    $('.lishi_hongbao').hide();
                    $('.lefttwo').css({"border-bottom": "0px", "font-weight": "100"});
                },
                lishi: function () {
                    /**$("p").css({"background-color":"blue","font-size":"14px"});**/
                    $('.keyong_hongbao').hide();
                    $('.leftone').css({"border-bottom": "0px", "font-weight": "100"});
                    $('.lishi_hongbao').show();
                    $('.lefttwo').css({"border-bottom": "3px solid #0089dc", "font-weight": "900"});
                },
                duihuan: function () {
                    $('.all_pingmu').show();
                },
                addressclick:function () {
                    location.href = "/pc/home.html"
                },
            },
        })
    }
}