window.onload = function() {
    var app = new Vue({
        el: '#dec',
        data: {
            flag: {
                user: false, //账号
                pasd: false, //密码
                Phone: false, //手机号
                vcode: false, //输入的验证码
            },
            sleep: 60,
            interval: null,
            dxtanzmage: '', //短信验证码
            secode: 60,
        },

        methods: {
            on_return: function() {
                if (window.event.keyCode == 13) {
                    if (document.all('dengluone') != null) {
                        document.all('dengluone').click();
                    }
                }
            },
            dengluoneClick: function() {
                var user = $('input[name="username"]').val(); // 获取 账号中的值
console.log(user);
                if (user == "") {
                    $(".cfmweo").css('display', 'flex');
                    $("#spanone\\.info").html("请输入账号!!!");
                    return;
                }
                // var parttern=/^[\u4E00-\u9FA5A-Za-z0-9]+$/; // 中文、英文、数字但不包括下划线等符号


                // var parttern=/^[a-zA-Z]\w{5,17}$/; // 以字母开头，长度在6~18之间，只能包含字母、数字和下划线
                var parttern = /^[a-zA-z0-9\.\-]{6,18}$/;

                if (!parttern.test(user)) {
                    $(".cfmweo").css('display', 'flex');
                    $("#spanone\\.info").html("请输入格式正确账号!!!");
                    return;
                } else {

                    var pasd = $('input[name="password"]').val(); // 获取 密码中的值
                    if (pasd == "") {
                        $(".cfmweo").css('display', 'flex');
                        $("#spanone\\.info").html("密码不能为空!!!");
                        return;
                    }
                    var parttern = /^\w{3,20}$/; // 数字、26个英文字母或者下划线组成的字符串
                    if (!parttern.test(pasd)) {
                        $(".cfmweo").css('display', 'flex');
                        $("#spanone\\.info").html("密码格式错误!!!");
                        return;
                    } else {

                        axios({
                            methods: "post",
                            url: 'https://www.aftdc.com/Business/Login/login_number',
                            data: {

                                name: user,

                                password: pasd
                            },
                        }).then(function(res) {
                            
                            if (res == 1) {
                                location.href = '/index.php/Business/ShopSa/index';
                            } else if (res == 0) {
                                $(".cfmweo").css('display', 'flex');
                                $("#spanone\\.info").html("用户不存在!!!");
                                return;
                            }
                            if (res == 2) {
                                $(".cfmweo").css('display', 'flex');
                                $("#spanone\\.info").html("密码错误!!!");
                                return;
                            }
                        })

                    }
                }
            },
            keyLogin: function() {
                if (event.keyCode == 13) //回车键的键值为13
                    $(".denglutwo").click();
            },
            cokeClick: function() {
                var sleep = this.sleep;
                var interval = this.interval;
                if (!interval) {
                    this.style.backgroundColor = '#A3A3A3';
                    this.disabled = "disabled";
                    this.style.cursor = "wait";
                    this.value = "重新发送 (" + sleep-- + ")";
                    interval = setInterval(function() {
                        if (sleep == 0) {
                            if (!!interval) {
                                clearInterval(interval);
                                interval = null;
                                sleep = 60;
                                coke.style.cursor = "pointer";
                                coke.removeAttribute('disabled');
                                coke.value = "获取验证码";
                                coke.style.backgroundColor = '';
                            }
                            return false;
                        }
                        coke.value = "重新发送 (" + sleep-- + ")";
                    }, 1000);
                }
            },
            fayzmClick: function() {
                // 点击 【发送验证码】
                var flag = this.flag;
                var dxtanzmage = this.dxtanzmage;
                var secode = this.secode;
                if (!flag.Phone == true) {
                    alert("正在检测或存在错误");
                    location.reload()
                }
                var Phone = $('input[name="userPhone"]').val();
                axios({
                    methods: "post",
                    // url:'https://www.aftdc.com/index.php/Wxapp/Msm/send', // 请求接口
                    url: 'https://www.aftdc.com/index.php/Wxapp/Users/Modifyphone', // 请求接口
                    data: {
                        phone: Phone
                    },
                }).then(function(arr) {
                    if (arr.res == 1) {
                        dxtanzmage = arr
                        $(".fayzm").hide(); //  【影藏 获取验证码】
                        $(".Times").show(); //  【显示 60秒】
                        time = setInterval(function() { //   countdown  倒计时器
                            secode--;
                            $(".Times").text(secode + "秒");
                            if (secode < 0) {
                                clearInterval(time);
                                secode = 60;
                                $(".Times").text(secode + "秒");
                                $(".fayzm").show();
                                $(".Times").hide();
                            }



                        }, 1000); // countdown  倒计时器
                        // console.log(ree);
                    } else if (arr.res == 2) {
                        alert('60秒内不能同时请求两次')
                    } else {
                        alert('该手机已注册')
                    }
                })

            },
            denglutwoClick: function() {
                var vcode = $('input[name="code"]').val();
                var Phone = $('input[name="userPhone"]').val();
                if (!vcode) {
                    alert('请填写完整！')
                    return false
                }
                axios({
                    methods: "post",
                    url: 'https://www.aftdc.com/index.php/Wxapp/Users/checkYzm', // 处理  验证码是否相等
                    data: {
                        code: vcode,
                        phone: Phone
                    },
                }).then(function(data) {
                    if (data.res == 1) {
                        $.post("{:U('validation')}", { phone: Phone }, function(res) {
                            if (res == 1) {
                                location.href = '/index.php/Business/ShopSa/index';
                            } else {
                                alert('手机号不存在');
                            }
                        })
                    } else {
                        $(".cfmwetwo").css('display', 'flex');
                        $("#spantwo\\.info").html("验证码不正确!!!");
                        return;
                    }
                })

            },
            phoneBlur: function() {
                var flag = this.flag;
                var Phone = $('input[name="userPhone"]').val();
                if (Phone == "") {
                    $(".cfmwetwo").css('display', 'flex');
                    $("#spantwo\\.info").html("手机号码不能为空!!!");
                    return;
                }
                var parttern = /^1[34578]\d{9}$/;
                if (!parttern.test(Phone)) {
                    $(".cfmwetwo").css('display', 'flex');
                    $("#spantwo\\.info").html("请输入正确的手机号码!!!");
                    return;
                } else {
                    $(".cfmwetwo").hide();
                    flag.Phone = true;
                    return;
                }
            },
            yzmkuangBlur: function() {
                var flag = this.flag;
                var vcode = $('input[name="code"]').val();
                if (vcode == "") {
                    $(".cfmwetwo").css('display', 'flex');
                    $("#spantwo\\.info").html("短信验证码不为空!!!");
                    return;
                }
                var parttern = /[0-9]{4,6}/;
                if (!parttern.test(vcode)) {
                    $(".cfmwetwo").css('display', 'flex');
                    $("#spantwo\\.info").html("验证码最少4位!!!");
                    return;
                } else {
                    $(".cfmwetwo").hide();
                    flag.vcode = true;
                    return;
                }
            },
            phemunberClick: function() { //  点击  手机验证登录
                $(".oneid").hide();
                $(".twonu").show();
                $(".number").css({ "font-weight": "100", "color": "#000" });
                $(".phemunber").css({ "font-weight": "900", "color": "#06c1ae" });

            },
            numberClick: function() {
                //  点击  账号密码登录
                $(".oneid").show();
                $(".twonu").hide();
                $(".phemunber").css({ "font-weight": "100", "color": "#000" });
                $(".number").css({ "font-weight": "900", "color": "#06c1ae" });
            },
        }
    })
}