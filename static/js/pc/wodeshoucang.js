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
                datac: '',
                dataf: '',
                a: '50%',
                geographic:'',
            },
            created: function () {

                var that = this
                var latitude = localStorage.getItem('latitude');
                var longitude = localStorage.getItem('longitude');
                that.userId = admin.userId;
                that.geographic = window.localStorage.getItem("geographic");
                axios({
                    method: "post",
                    url: "/pc/Order/wodeshoucang",
                    data: {
                        latitude: latitude,
                        longitude: longitude,
                        userId: that.userId,
                    }
                }).then(function (res) {
                    if (res.data.res == 1) {
                        that.datac = res.data.close;
                        that.dataf = res.data.far;
                        console.log(that.datac);
                        console.log(that.dataf);
                    }else if(res.data.res==-2){
                        location.href='/pc/home.html'
                    }
                    console.log(res);
                })


            },
            methods: {
                shopAvg: function (item) {
                    var that = this
                    var shopAvg = item.shopAvg.avg * 20;
                    console.log(shopAvg)
                    var width = shopAvg + '%';
                    return 'width:' + width;
                },
                cancelCollect: function (item) {
                    // var userId = $('input[name=userId]').val()
                    // var shopId = $(obj).attr('data-shopId')
                    var that = this
                    axios({
                        method: "post",
                        url: '/pc/Shop/delete_collect',
                        data: {
                            shopId: item.shopId,
                            userId: that.userId
                        }
                    }).then(function (res) {
                        if (res.data.res == 1) {
                            location.reload();
                        }else {
                            alert('取消失败！');
                            return false;
                        }
                    })

                },
                shan_deleteClick: function (event) {
                    $(event.currentTarget).parent().parent().find('.ban_toumin').show()
                    $(event.currentTarget).parent().parent().css('opacity','1');
            },
                no_quxiaoClick: function (event) {
                    $(event.currentTarget).parent().parent().hide()
                },
                allprotenerClick: function (item) {
                    location.href = '/pc/shop.html?shopId=' + item.shopId;
                },
                addressclick:function () {
                    location.href = "/pc/home.html"
                },
            },
        })
    }
}