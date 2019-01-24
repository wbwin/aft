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
                dataz: {},
                email: '',
                userEmail: '',
                secode: 90,
                active: 1,
                phone:'',
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

                    if (res.data.res == 1) {
                        that.phone = res.data.data.userPhone
                        var email = res.data.data.userEmail
                        that.email = email;
                        that.userEmail = email.replace(email.substring(3, 8), '*****')

                    }

                })


            },
            methods: {
                hqyzmClick: function () {
                    var that = this
                    var secode = that.secode;
                    axios({
                        method: "post",
                        url: "/pc/Order/yzm",
                        data: {
                            phone: that.phone,
                        }
                    }).then(function (res) {
                        if (res.data.res == 1) {
                            $(".hqyzm").hide(); //  【影藏 获取验证码】
                            $(".Times").show(); //  【显示 60秒】
                            time = setInterval(function () { //   countdown  倒计时器
                                secode--;
                                $(".Times").text(secode + "秒");
                                if (secode < 1) {
                                    clearInterval(time);
                                    secode = 89;
                                    $(".Times").text(secode + "秒");
                                    $(".hqyzm").show();
                                    $(".hqyzm").html('重新发送验证码');
                                    $(".Times").hide();
                                }
                            }, 1000); // countdown  倒计时器
                        } else if (res.data.res == -2) {
                            alert('短时间内不能重复获取验证码！');
                            return false;
                        } else if (res.data.res == 0) {
                            alert('获取验证码次数用尽！');
                            return false;
                        }
                    })
                },
                xia_yibuClick: function () {
                    var that = this
                    var code = $('input[name=code]').val()
                    if (code == '') {
                        $('.you_jiaodian').show();
                    } else {
                        axios({
                            method: "post",
                            url: "/pc/Order/validate",
                            data: {
                                phone: that.phone,
                                code: code,
                            }
                        }).then(function (res) {
                            if (res.data.res == 1) {
                                that.active = 2;
                            } else if (res.data.res == 0) {
                                $('.shi_jiaodian').show();
                                return false
                            }
                        })
                    }
                },
                codeInput: function () {
                    var code = $('input[name=code]').val()
                    if (code == '') {
                        $('.you_jiaodian').show();
                        $('.shi_jiaodian').hide();
                    } else {
                        $('.you_jiaodian').hide();
                        $('.shi_jiaodian').hide();
                    }
                },
                codeFocus: function () {
                    var code = $('input[name=code]').val()
                    if (code == '') {
                        $('.you_jiaodian').show();
                        $('.shi_jiaodian').hide();
                    } else {
                        $('.you_jiaodian').hide();
                        $('.shi_jiaodian').hide();
                    }
                },
                newEmailInput: function () {
                    var newEmail = $('input[name=newEmail]').val()
                    if (newEmail == '') {
                        $('.you_jiaodian').show();
                        $('.shi_jiaodian').hide();
                    } else {
                        $('.you_jiaodian').hide();
                        $('.shi_jiaodian').hide();
                    }
                },
                newEmailFocus: function () {
                    var newEmail = $('input[name=newEmail]').val()
                    if (newEmail == '') {
                        $('.you_jiaodian').show();
                        $('.shi_jiaodian').hide();
                    } else {
                        $('.you_jiaodian').hide();
                        $('.shi_jiaodian').hide();
                    }
                },

                xiu_gaiClick: function () {
                    var that = this
                    var newEmail = $('input[name=newEmail]').val()
                    if (newEmail == '') {
                        $('.you_jiaodian').show();
                        return false;
                    }
                    var pattern_email = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
                    if (pattern_email.test(newEmail) != true) {
                        $('.shi_jiaodian').show();
                        return false;
                    }

                    axios({
                        method: "post",
                        url: "/pc/Order/email",
                        data: {
                            userEmail: newEmail,
                            userId: that.userId,
                        }
                    }).then(function (res) {
                        if (res.data.res == 1) {
                            that.active = 3;
                        }
                        if(res.data.res==-2){
                            alert('该邮箱已被使用！')
                            return false0
                        }
                    })

                },
                okClick: function () {
                    location.href = '/pc/safeconter.html';
                },
                addressclick:function () {
                    location.href = "/pc/home.html"
                },
            },
        })
    }
}