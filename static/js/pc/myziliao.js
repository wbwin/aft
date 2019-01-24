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
                        that.userPhone = phone.replace(phone.substring(3, 7), '****')
                        console.log(that.userPhone)
                    }

                })
            },
            methods: {
                xiansi: function () {
                    $('.bianji_touxiang').show();
                },
                out: function () {
                    $('.bianji_touxiang').hide();
                },
                xiugaiuserClick: function () {
                    $('.yng_kang').show();
                },
                guanniClick: function () {
                    $('.yng_kang').hide();
                },
                qu_xiaoClick: function () {
                    $('.yng_kang').hide();
                },
                comfirmaClick: function () {
                    var that = this;
                    var loginName = $('input[name=loginName]').val();
                    axios({
                        method: "post",
                        url: "/pc/Order/dosave",
                        data: {
                            userId:that.userId,
                            loginName: loginName,
                        }
                    }).then(function (res) {
                        if (res.data.res == 1) {
                            alert('修改成功！');
                            admin.loginName=loginName
                            var data=JSON.stringify(admin);
                            var  storage = window.localStorage;
                            storage.removeItem('admin')
                            storage.setItem("admin", data);
                            location.reload();
                        }
                    })

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