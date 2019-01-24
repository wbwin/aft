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
                dataUi: {},
                userPhone: '',
                userEmail:'',
                geographic:'',
            },
            created: function () {

                var that = this
                that.userId = admin.userId;
                that.geographic = window.localStorage.getItem("geographic");
                axios({
                    method: "post",
                    url: "/pc/Order/myziliao",
                    data: {
                        userId: that.userId,

                    }
                }).then(function (res) {
                    console.log(res);
                    if (res.data.res == 1) {
                        that.dataUi = res.data.data;
                        var phone = res.data.data.userPhone
                        var email=res.data.data.userEmail


                        that.userPhone = phone.replace(phone.substring(3, 7), '****')
                        that.userEmail = email.replace(email.substring(3, 8), '*****')
                        console.log(that.userPhone)
                    }

                })
            },
            methods: {
                ggphoneClick: function () {
                    var that = this;
                    location.href = '/pc/ggphone.html'
                },
                addressclick:function () {
                    location.href = "/pc/home.html"
                },
                shezhiemailClick:function () {
                    var that=this
                    if(that.userPhone=='') {
                        alert('请先绑定手机号码！')
                        return false;
                    }else{
                        location.href='/pc/bangdingemail.html'
                    }
                },
            },

        })
    }
}