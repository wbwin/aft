window.onload = function () {
    $.ajax({
        url: 'https://www.aftdc.com/pc/Index/wx_message',
        type: 'post',
        async: false,
        data: {},
        success: function (res) {
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
            el: '.agent',
            data: {
                userId: '',
                dataz: {},
                geographic: '',
                secode: 90,
            },
            created: function () {


            },
            methods: {
                valiPhone: function () {
                    var phone = $("input[name=phone]").val()
                    if (/^((\+?86)|(\(\+86\)))?1[34578]\d{9}$/.test(phone)) {
                        //验证码正确
                        $(".phoneErr").hide();
                        var that = this
                        var secode = that.secode;
                        axios({
                            method: "post",
                            url: "/pc/League/yzm",
                            data: {
                                phone: phone,
                            }
                        }).then(function (res) {
                            if (res.data.res == 1) {
                                $(".form-item-but").hide(); //  【影藏 获取验证码】
                                $(".Times").show(); //  【显示 60秒】
                                time = setInterval(function () { //   countdown  倒计时器
                                    secode--;
                                    $(".Times").text(secode + "秒");
                                    if (secode < 1) {
                                        clearInterval(time);
                                        secode = 89;
                                        $(".Times").text(secode + "秒");
                                        $(".form-item-but").show();
                                        $(".form-item-but").html('重新发送验证码');
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

                    } else {
                        $(".phoneErr").show();
                    }
                },
                phoneInupt: function () {
                    var phone = $("input[name=phone]").val()
                    if (/^((\+?86)|(\(\+86\)))?1[34578]\d{9}$/.test(phone)) {
                        //验证码正确
                        $(".phoneErr").hide();

                    } else {
                        $(".phoneErr").show();
                    }
                },
                need: function () {
                    $(".need").hide();
                    $(".apply").show();
                },
                codeFocus: function () {
                    var code = $("input[name=code]").val()
                    if (code == '') {
                        $(".codeNumb").show();
                    } else {
                        $(".codeNumb").hide();
                    }
                },
                codeInput: function () {
                    var code = $("input[name=code]").val()
                    if (code == '') {
                        $(".codeNumb").show();
                    } else {
                        $(".codeNumb").hide();
                    }
                },
                checkUser: function () {
                    var phone = $("input[name=phone]").val()
                    var code = $("input[name=code]").val()
                    if (!/^((\+?86)|(\(\+86\)))?1[34578]\d{9}$/.test(phone)) {
                        $(".phoneErr").show();
                        return false
                    }
                    if (code == '') {
                        $(".codeNumb").show();
                        return false
                    }
                    axios({
                        method: "post",
                        url: "/pc/League/enrol_city",
                        data: {
                            phone: phone,
                            code: code,
                            userId:admin.userId
                        }
                    }).then(function (res) {
                        if (res.data.res == 1) {
                            $(".phoneNumb").hide();
                            location.href = '/pc/agentApply.html?phone=' + phone;
                        } else if (res.data.res == 0) {
                            $(".phoneNumb").show();
                        }else if(res.data.res==-2){
                            alert('该账户已申请！')
                            return false
                        }

                    })
                },
            },
        })
    }
}