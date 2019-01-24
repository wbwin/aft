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
                    phone: false,
                    code: false,
                },
                phone:'',
                secode: 90,
            },
            created: function () {
                var that = this
                that.userId = admin.userId;
                that.geographic = window.localStorage.getItem("geographic");



            },
            methods:{
                addressclick:function () {
                    location.href = "/pc/home.html"
                },
                phoneFocus:function () {
                    var phone=$('input[name=phone]').val()
                    if(phone==''){

                        $(".no_everything").hide();
                        $(".have_jiaodian").show();
                        $('.no_jiaodian').hide();
                        $('.phone').css('border', '1px solid #1e89e0');
                    }
                },
                phoneBlur:function () {
                    var that=this
                    var flag=that.flag
                    var phone=$('input[name=phone]').val()
                    var pattern_phone = /^1[3|4|5|8]\d{9}$/;
                    if (pattern_phone.test(phone) != true) {
                        $(".no_everything").hide();
                        $(".have_jiaodian").hide();
                        $('.no_jiaodian').show();
                        $('.phone').css('border', '1px solid red');
                        flag.phone = false;
                        return false;
                    }else{
                        $(".no_everything").hide();
                        $(".have_jiaodian").hide();
                        $('.no_jiaodian').hide();
                        $('.mail').css('border', '1px solid #1e89e0');
                        flag.phone = true;
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
                    var phone=$('input[name=phone]').val()
                    if(flag.phone){


                        axios({
                            method: "post",
                            url: "/pc/Order/yzm",
                            data: {
                                phone: phone,
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
                        alert('请先填写正确的手机号码！')
                        return false;
                    }

                },
                com_phoneClick: function () {
                    var that = this
                    var code = $('input[name=code]').val()
                    var phone = $('input[name=phone]').val()
                    var flag=that.flag
                    if(flag.phone&&flag.code){


                        axios({
                            method: "post",
                            url: "/pc/Order/validate",
                            data: {
                                phone: phone,
                                code: code,
                            }
                        }).then(function (res) {
                            if (res.data.res == 1) {
                                axios({
                                    method: "post",
                                    url: "/pc/Order/modify_phone",
                                    data: {
                                        phone: phone,
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