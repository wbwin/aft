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
                dataz:'',
                geographic:'',
                pageNumb: 0, //总页数
                pageCurent: 1, //当前页
                pageEach: 10, //每一页显示数据条数
            },

            created: function () {
                var that = this
                that.userId = admin.userId;
                that.geographic = window.localStorage.getItem("geographic");
                that.pageFn(1);
            },
            methods: {
                //------------------------分页跳转------------------------------------
                pageFn: function (pageCurent) {
                    var that = this;
                    var page = (pageCurent - 1) * that.pageEach;
                    that.pageCurent = pageCurent;
                    axios({
                        method: "post",
                        url: '/pc/Order/shop_coupon',
                        data: {
                            page: page,
                            userId: that.userId,
                        },
                    }).then(function (res) {
                        if (res.data.res == 1) {
                            that.dataz=res.data.data;
                            //初始化页数
                            var pageCount = Number(res.data.count);
                            var pageNumb = Math.ceil(pageCount / that.pageEach)
                            that.pageNumb = pageNumb

                        }

                    })

                },

                //**********
                moneyClick: function (index) {
                    $(this).css({"background-color": "#0089dc", "color": "#fff"});
                    $(this).siblings().css({"background-color": "#fff", "color": "#999999"});
                },
                dateClick: function (index) {
                    $(this).css({"background-color": "#0089dc", "color": "#fff"});
                    $(this).siblings().css({"background-color": "#fff", "color": "#999999"});
                },
                addressclick:function () {
                    location.href = "/pc/home.html"
                },
            },
        })
    }
}