window.onload=function () {
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
        var  storage = window.localStorage;
        storage.removeItem('jumpUrl')
        storage.setItem("jumpUrl", test);
        console.log(test)
        location.href = "/pc/login.html";
    } else {
        var app = new Vue({
            el: '#app',
            data: {
                userId: '',
                dataz:{},
                geographic:'',
                flag: {
                    email: false,
                    code: false,
                },
                phone:'',
                secode: 90,
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


                    }

                })


            },
            methods:{
                addressclick:function () {
                    location.href = "/pc/home.html"
                },
                mailFocus:function () {
                    var email=$('input[name=mail]').val()
                    if(email==''){

                    $(".no_everything").hide();
                    $(".have_jiaodian").show();
                    $('.no_jiaodian').hide();
                    $('.mail').css('border', '1px solid #1e89e0');
                    }
                },
                mailBlur:function () {
                    var that=this
                    var flag=that.flag
                    var email=$('input[name=mail]').val()
                    var pattern_email = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
                    if (pattern_email.test(email) != true) {
                        $(".no_everything").hide();
                        $(".have_jiaodian").hide();
                        $('.no_jiaodian').show();
                        $('.mail').css('border', '1px solid red');
                        flag.email = false;
                        return false;
                    }else{
                        $(".no_everything").hide();
                        $(".have_jiaodian").hide();
                        $('.no_jiaodian').hide();
                        $('.mail').css('border', '1px solid #1e89e0');
                        flag.email = true;
                        return;
                    }


                },
                codekogFocus:function () {
                    var that=this
                    var flag=that.flag;
                    var code=$('input[name=code]').val();
                    if(code==''){

                    $('.block').show();
                    $('.reder').hide();
                    $('.codekog').css('border', '1px solid #1e89e0');
                        flag.code = true;
                        return
                    }else{
                        flag.code = true;
                        return
                    }
                },

                // codekogBlur:function () {
                //     $('.block').hide();
                //     $('.reder').show();
                //     $('.codekog').css('border', '1px solid red');
                // },
                hqyzmClick: function () {
                    var that = this

                    var flag=that.flag;
                    var secode = that.secode;
                    if(flag.email){


                    axios({
                        method: "post",
                        url: "/pc/Order/yzm",
                        data: {
                            phone: that.phone,
                        }
                    }).then(function (res) {
                        if (res.data.res == 1) {
                            $(".spaned").hide(); //  【影藏 获取验证码】
                            $(".Times").show(); //  【显示 60秒】
                            time = setInterval(function () { //   countdown  倒计时器
                                secode--;
                                $(".Times").text(secode + "秒");
                                if (secode < 1) {
                                    clearInterval(time);
                                    secode = 89;
                                    $(".Times").text(secode + "秒");
                                    $(".spaned").show();
                                    $(".spaned").html('重新发送验证码');
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
                    }else{
                        alert('请先填写正确的邮箱！')
                        return false;
                    }

                },
                com_emailClick: function () {
                    var that = this
                    var code = $('input[name=code]').val()
                    var email = $('input[name=mail]').val()
                    var flag=that.flag
                    if(flag.email&&flag.code){


                        axios({
                            method: "post",
                            url: "/pc/Order/validate",
                            data: {
                                phone: that.phone,
                                code: code,
                            }
                        }).then(function (res) {
                            if (res.data.res == 1) {
                                axios({
                                    method: "post",
                                    url: "/pc/Order/email",
                                    data: {
                                        userEmail: email,
                                        userId: that.userId,
                                    }
                                }).then(function (res) {
                                    if (res.data.res == 1) {
                                        alert('绑定成功！');
                                        location.href = '/pc/safeconter.html';
                                    }else{
                                        alert('绑定失败！')
                                        return false
                                    }
                                })
                            } else if (res.data.res == 0) {
                               alert('验证码错误！')
                                return false
                            }
                        })
                    }else{
                        alert('请填写完整，认真检查!!!');
                        return false;
                    }
                },
            },
        })
    }
}