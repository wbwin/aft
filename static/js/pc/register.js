window.onload=function () {

        var app = new Vue({
            el: '.loginBox',
            data: {
                flag: {

                    Phone: false, //手机号
                    vcode: false, //输入的验证码
                },
                phone:'',
                dxtanzmage: '', //短信验证码
                secode: 90,
            },
            created: function () {

            },
            methods:{
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
                chack:function () {
                    var that=this;
                    var phone=that.phone
                    if (phone == "") {
                        return false;
                    }
                    var parttern = /^1[34578]\d{9}$/;
                    if (!parttern.test(phone)) {
                        $(".fayzm").html('发送验证码');
                        return false;
                    } else {

                        return true;
                    }

                },
                cokeClick: function() {
                    // 点击 【发送验证码】
                    var flag = this.flag;
                    var dxtanzmage = this.dxtanzmage;
                    var secode = this.secode;

                    if (!flag.Phone == true) {
                        alert("请检查手机号是否填写或错误");
                       return false
                    }
                    var Phone = $('input[name="userPhone"]').val();
                    axios({
                        method: "post",
                        url: 'https://www.aftdc.com/pc/Index/yzm', // 请求接口
                        data: {
                            phone: Phone
                        },
                    }).then(function(arr) {
                        if (arr.data.res == 1) {
                            dxtanzmage = arr
                            $(".fayzm").hide(); //  【影藏 获取验证码】
                            $(".Times").show(); //  【显示 60秒】
                            time = setInterval(function() { //   countdown  倒计时器
                                secode--;
                                $(".Times").text(secode + "秒");
                                if (secode < 1) {
                                    clearInterval(time);
                                    secode = 89;
                                    $(".Times").text(secode + "秒");
                                    $(".fayzm").show();
                                    $(".fayzm").html('重新发送验证码');
                                    $(".Times").hide();
                                }
                            }, 1000); // countdown  倒计时器
                        } else if (arr.data.res == -2) {
                            alert('90秒内不能同时请求两次')
                        } else {
                            alert('该手机已注册')
                        }
                    })
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
                denglutwoClick: function() {
                    var vcode = $('input[name="code"]').val();
                    var Phone = $('input[name="userPhone"]').val();
                    if (!vcode) {
                        alert('请填写完整！')
                        return false
                    }
                    axios({
                        method: "post",
                        url: 'https://www.aftdc.com/pc/Index/yz_phone', // 处理  验证码是否相等
                        data: {
                            code: vcode,
                            phone: Phone
                        },
                    }).then(function(res) {
                        if(res.data.res==1){
                            var jumpUrl=window.localStorage.getItem('jumpUrl');
                            if(jumpUrl){
                                window.location.href=jumpUrl;
                            }else{
                                window.location.href='https://www.aftdc.com/pc/index.html';
                            }
                        }else if(res.data.res==0){
                            alert('验证码错误！');
                            return false
                        }


                    })

                },
            },
        })

}