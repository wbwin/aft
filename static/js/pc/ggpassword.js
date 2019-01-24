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
                phone: '',
                userPhone: '',
                secode: 90,
                active: 1,
                flag: {
                    newpassword: false,
                    passwordmore: false,
                },
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

                        var phone = res.data.data.userPhone
                        that.phone = phone;
                        that.userPhone = phone.replace(phone.substring(3, 7), '****')

                    }

                })


            },
            methods: {
                addressclick:function () {
                    location.href = "/pc/home.html"
                },
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
                newpasswordFocus: function () {
                    $(".newcuo").hide();
                    $(".newdui").show();

                    $(".xskint").css('color', '#1998f9');
                    $(".newpassword").css('border', '1px solid green');
                    $("#paswdnew\\.info").html("密码是必填项");
                    return;
                },
                newpasswordBlur: function () {
                    var that = this;
                    var flag = that.flag;
                    var newpassword = $('input[name=loginPwd]').val();
                    if (newpassword == "") {
                        $(".newcuo").show();
                        $(".newdui").hide();
                        $(".xskint").css('color', 'red');
                        $(".newpassword").css('border', '1px solid red');
                        $("#paswdnew\\.info").html("密码不能为空");
                        return;
                    }
                    var pattern = /\b(^['A-Za-z0-9]{6,20}$)\b/;
                    if (!pattern.test(newpassword)) {
                        $(".newcuo").show();
                        $(".newdui").hide();
                        $(".xskint").css('color', 'red');
                        $(".newpassword").css('border', '1px solid red');
                        $("#paswdnew\\.info").html("密码长度为6-20位 大小写英文，数字");
                        return;
                    } else {
                        $(".newcuo").hide();
                        $(".newdui").show();
                        $(".xskint").css('color', '#1998f9');
                        $(".newpassword").css('border', '1px solid green');
                        $("#paswdnew\\.info").html("密码格式正确");
                        flag.newpassword = true;
                        return;
                    }
                },
                passwordmoreFocus: function () {
                    $('.agecuo').hide();
                    $('.agedui').show();
                    $(".cprent").css('color', '#1998f9');
                    $(".passwordmore").css('border', '1px solid green');
                    $("#paswdagean\\.info").html("确认密码是必填项");
                },
                passwordmoreBlur: function () {
                    var that = this;
                    var flag = that.flag;
                    var passwordmore = $('input[name=passwordmore]').val();
                    if (passwordmore == "") {
                        $('.agecuo').show();
                        $('.agedui').hide();
                        $(".cprent").css('color', 'red');
                        $(".passwordmore").css('border', '1px solid red');
                        $("#paswdagean\\.info").html("确认密码不能为空");
                        return;
                    }
                    var pattern = /\b(^['A-Za-z0-9]{6,20}$)\b/;
                    if (!pattern.test(passwordmore)) {
                        $('.agecuo').show();
                        $('.agedui').hide();
                        $(".cprent").css('color', 'red');
                        $(".passwordmore").css('border', '1px solid red');

                        $("#paswdagean\\.info").html("密码格式错误");
                        return;
                    } else if (passwordmore != $("#newpassword").val()) {
                        $('.agecuo').show();
                        $('.agedui').hide();
                        $(".cprent").css('color', 'red');
                        $(".passwordmore").css('border', '1px solid red');
                        $("#paswdagean\\.info").html("两次密码不一致");
                        return;
                    } else {
                        $('.agecuo').hide();
                        $('.agedui').show();
                        $(".cprent").css('color', '#1998f9');
                        $(".passwordmore").css('border', '1px solid green');
                        $("#paswdagean\\.info").html("密码格式正确");
                        flag.passwordmore = true;
                        return;
                    }
                },

                xiu_gaiClick: function () {
                    var that = this;
                    var flag = that.flag;
                    var call = flag.newpassword && flag.passwordmore;
                    if (call == false) {
                        alert('请填写完整，认真检查!!!');
                        return false;
                    }
                    var newpassword = $('input[name=loginPwd]').val();
                    axios({
                        method: "post",
                        url: "/pc/Order/cipher",
                        data: {
                            loginPwd: newpassword,
                            userId: that.userId,
                        }
                    }).then(function (res) {

                        if (res.data.res == 1) {
                            console.log(res)
                            that.active = 3;
                        }
                    })

                },
                okClick: function () {
                    location.href = '/pc/safeconter.html';
                },
            },
        })
    }
}
// window.onload=function () {
//     var admin = JSON.parse(localStorage.getItem('admin'));
//     if (!admin) {
//         var test = window.location.href;
//         var  storage = window.localStorage;
//         storage.removeItem('jumpUrl')
//         storage.setItem("jumpUrl", test);
//         console.log(test)
//         location.href = "/pc/login.html";
//     } else {
//         var app = new Vue({
//             el: '#app',
//             data: {
//                 flag :{
//                     password: false,
//                     loginPwd: false,
//                     agenpassword: false,
//                 },
//             },
//             created: function () {
//
//             },
//             methods:{
//                 passwordBlur:function () {
//                     var that=this
//                     var flag=that.flag;
//                     var password = $(this).val();
//                     if (password == "") {
//                         $(".shangjiushi").show();
//                         $(".nowpasswoed").css('border', '1px solid red');
//                         $(".coloerone").css({"color": "red", "margin-left": "0px"});
//                         $("#coloerone\\.info").html("当前密码不能为空");
//                         return;
//                     }
//                     var pattern = /\b(^['A-Za-z0-9]{6,20}$)\b/;
//                     if (!pattern.test(password)) {
//                         $(".shangjiushi").show();
//                         $(".nowpasswoed").css('border', '1px solid red');
//                         $(".coloerone").css({"color": "red", "margin-left": "0px"});
//                         $("#coloerone\\.info").html("密码格式错误!!!");
//                         return;
//                     } else {
//                         $(".shangjiushi").hide();
//                         $(".nowpasswoed").css('border', '1px solid green');
//                         $(".coloerone").css({"color": "green", "margin-left": "165px"});
//                         $("#coloerone\\.info").html("格式正确");
//                         flag.password = true;
//                         return;
//                     }
//
//                 },
//                 loginPwdBlur:function () {
//                     var that=this
//                     var flag=that.flag;
//                     var loginPwd = $(this).val();
//                     if (loginPwd == "") {
//                         $('.leftjiushi').show();
//                         $('.newpassword').css('border', '1px solid red');
//                         $('.coloertwo').css({"color": "red", "margin-left": "0px"});
//                         $("#loginPwd\\.info").html("昵称不能为空");
//                         return;
//                     }
//                     var pattern = /\b(^['A-Za-z0-9]{4,20}$)\b/;
//                     if (!pattern.test(loginPwd)) {
//                         $('.leftjiushi').show();
//                         $('.newpassword').css('border', '1px solid red');
//                         $('.coloertwo').css({"color": "red", "margin-left": "0px"});
//                         $("#loginPwd\\.info").html("密码格式不正确");
//                         return;
//                     } else {
//                         $('.leftjiushi').hide();
//                         $('.newpassword').css('border', '1px solid green');
//                         $('.coloertwo').css({"color": "green", "margin-left": "165px"});
//                         $("#loginPwd\\.info").html("格式正确");
//                         flag.loginPwd = true;
//                         return;
//                     }
//                 },
//                 agenpasswordBlur:function () {
//                     var that=this
//                     var flag=that.flag;
//                     var agenpassword = $(this).val();
//                     if (agenpassword == "") {
//                         $(".xaijiushi").show();
//                         $('.agenpassword').css('border', '1px solid red');
//                         $('.coloerthree').css({"color": "red", "margin-left": "0px"});
//                         $("#coloerthree\\.info").html("确认密码不为能空");
//                         return;
//                     }
//                     var pattern = /\b(^['A-Za-z0-9]{4,20}$)\b/;
//                     if (!pattern.test(agenpassword)) {
//                         $(".xaijiushi").show();
//                         $('.agenpassword').css('border', '1px solid red');
//                         $('.coloerthree').css({"color": "red", "margin-left": "0px"});
//                         $("#coloerthree\\.info").html("密码格式不正确");
//                         return;
//                     } else if (agenpassword != $("#loginPwd").val()) {
//                         $(".xaijiushi").show();
//                         $('.agenpassword').css('border', '1px solid red');
//                         $('.coloerthree').css({"color": "red", "margin-left": "0px"});
//                         $("#coloerthree\\.info").html("两次密码不一致");
//                         return;
//                     } else {
//                         $(".xaijiushi").hide();
//                         $('.agenpassword').css('border', '1px solid green');
//                         $('.coloerthree').css({"color": "green", "margin-left": "165px"});
//                         $("#coloerthree\\.info").html("格式正确");
//                         flag.agenpassword = true;
//                         return;
//                     }
//                 },
//                 submitClick:function () {
//                     var that=this
//                     var flag=that.flag;
//                     var ok = flag.password && flag.loginPwd && flag.agenpassword;
//                     if (ok == false) {
//                         $(".yckuang").show();
//                         $(".mu_ment").text("请填写完整！！！");
//                         $(".comfit").click(function () {
//                             location.reload();
//                         });
//                         $(".spant").click(function () {
//                             location.reload();
//                         });
//                         // alert("表单项正在检测或存在错误");
//                         //   history.back();  // 返回上一页
//                         return false;
//                     }
//
//                     $(".yckuang").show();
//                     var password = $('[name="password"]').val();
//                     var loginPwd = $('[name="loginPwd"]').val();
//                     /* var loginPwd=$(this).serializeArray();*/
//                     $.post('{:U("HomePc/Ggpassword/doeditpwd")}', {
//                         password: password,
//                         loginPwd: loginPwd
//                     }, function (data) {
//                         if (data == 0) {
//                             $(".mu_ment").text("修改失败！当前密码有误");
//                             $(".comfit").click(function () {
//                                 location.reload();
//                             });
//                             $(".spant").click(function () {
//                                 location.reload();
//                             });
//                         } else if (data == 1) {
//                             $(".mu_ment").text("修改成功");
//                             $(".comfit").click(function () {
//                                 location.reload();
//                             });
//                             $(".spant").click(function () {
//                                 location.reload();
//                             });
//                         } else {
//                             $(".mu_ment").text("修改失败！");
//                             $(".comfit").click(function () {
//                                 location.reload();
//                             });
//                             $(".spant").click(function () {
//                                 location.reload();
//                             });
//                         }
//                     }, 'json');
//                 },
//
//             },
//         })
//     }
// }