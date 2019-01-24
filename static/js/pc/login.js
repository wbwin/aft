window.onload = function () {
    var app = new Vue({
        el: '.loginBox',
        data: {
            secode: 60,
            jumpUrl: '',
            toggle: 2,
        },
        created: function () {
            var that = this;

            that.jumpUrl = window.localStorage.getItem('jumpUrl');
            console.log(that.jumpUrl)
            if(that.toggle==2){
            var auto = {};
            var jumpUrl = that.jumpUrl;
            if (jumpUrl) {
                var urlAll = jumpUrl.replace('https://www.aftdc.com/pc/', '');
                var url = urlAll.split('.')[0];

                var caishu = urlAll.split('?')[1];

            } else {
                var url = 'index';
                var caishu = '';
            }

            auto.url = url;
            auto.id = caishu;
            var json = JSON.stringify(auto)
            var obj = new WxLogin({
                id: "for_weixin_login",//div的Id名字
                appid: "wx81f79d12c16833a8",//appid
                scope: "snsapi_login",//snsapi_login写死0
                redirect_uri: 'https://www.aftdc.com/pc/Index/oauth?auto=' + json,//回调地址
                state: "",//密钥可不填
                style: "",
                href: "https://www.aftdc.com/static/css/pc/weixin.css",//填写css样式
            });
            }
            // 验证码生成
            var captcha_img = $('.yanzhenma').find('img')
            var verifyimg = captcha_img.attr("src");
            captcha_img.attr('title', '点击刷新');
            captcha_img.click(function () {
                if (verifyimg.indexOf('?') > 0) {
                    $(this).attr("src", verifyimg + '&random=' + Math.random());
                } else {
                    $(this).attr("src", verifyimg.replace(/\?.*$/, '') + '?' + Math.random());
                }
            });
        },
        methods: {
            <!--   切换密码和短信登录方式   -->
            weixinClick: function () {
                var that = this;
                that.toggle = 2;


            },
            mimaClick: function () {
                var that = this;
                that.toggle = 1;
            },
            duanxinClick: function () {
                var that = this;
                that.toggle = 0;
            },
            <!--   切换密码和短信登录方式   -->
            <!--  密码登录     密码登录     密码登录     密码登录   -->
            mima_phoneFocus: function () {
                $('.mima_phone').css('border', '1px solid #1998f9');
            },
            mima_phoneBlur: function () {
                $('.mima_phone').css('border', '1px solid #eee');
            },
            mima_passwordFocus: function () {
                $('.mima_password').css('border', '1px solid #1998f9');
            },
            mima_passwordBlur: function () {
                $('.mima_password').css('border', '1px solid #eee');
            },
            tuoyuanClick: function () {
                if ($(".kaiguan").css("float") == "left") {
                    $(".kaiguan").css('float', 'right');
                    $('.tuoyuan').css('background', '#1998f9');
                    $('.kaiguan').css('background', '#fff');

                    $(".mima_password[type='password']").attr('type', 'text');
                } else {
                    $(".kaiguan").css('float', 'left');
                    $('.tuoyuan').css('background', '#fff');
                    $('.kaiguan').css('background', '#1998f9');
                    $(".mima_password[type='text']").attr('type', 'password');
                }
            },
            <!--  密码登录     密码登录     密码登录     密码登录   -->
            <!--  短息登录    短息登录    短息登录    短息登录    短息登录  -->
            dx_phoneInput: function () {
                $('.dx_phone').css('border', '1px solid #1998f9');
                var phone = $(".dx_phone").val();
                if (phone && /^1[3|4|5|8]\d{9}$/.test(phone)) {
                    $('.hqyzm').css({"cursor": "pointer", "color": "#1998f9"});
                } else {
                    $('.hqyzm').css({"color": "#bbb", "cursor": ""});
                }
            },
            dx_phoneBlur: function () {
                $('.dx_phone').css('border', '1px solid #eee');
            },
            dx_yzmFocus: function () {
                $('.dx_yzm').css('border', '1px solid #1998f9');
            },
            dx_yzmBlur: function () {
                $('.dx_yzm').css('border', '1px solid #eee');
            },


            <!--  短息登录    短息登录    短息登录    短息登录    短息登录  -->
            submit: function () {
                var that = this
                if (that.toggle == 0) {
                    var rememberme = $("input[name='rememberme']:checked");
                    var phone = $('input[ name=phone]').val();

                    var code = $('input[ name=code]').val()
                    // if (!loginName || !loginPwd || !code) {
                    //     alert('请填写完整')
                    //     return false
                    // }
                    if (!phone || !code) {
                        alert('请填写完整！');
                        return false;
                    }
                    if (!/^1[3|4|5|8]\d{9}$/.test(phone)) {
                        alert('请填写正确的手机号！');
                        return false
                    }
                    axios({
                        method: "post",
                        url: '/pc/Index/phone_login',
                        data:
                            {

                                // loginName: loginName,
                                // loginPwd: loginPwd,
                                phone: phone,
                                code: code,
                                // type: type
                            },
                    }).then(function (res) {
                        console.log(res)
                        if (res.data.res == 1) {
                            var dataz = res.data.data;
                            var data = JSON.stringify(dataz);
                            var storage = window.localStorage;
                            storage.removeItem('admin')
                            storage.setItem("admin", data);

                            storage.removeItem('jumpUrl')
                            if (that.jumpUrl) {
                                window.location.href = that.jumpUrl;
                            } else {
                                window.location.href = 'https://www.aftdc.com/pc/index.html';
                            }
                        }
                        // if (res.status == 1) {
                        //     alert('账号不存在')
                        // }
                        // if (res.status == 2) {
                        //     alert('验证码错误')
                        // }
                        // if (res.status == 4) {
                        //     alert('密码错误')
                        // }
                        // if (res.status == 3 && res.type != 'check') {
                        //     //location.href='/index.php/HomePc/Index/Index'
                        //     window.location.replace("/index.php/HomePc/Index/Index")
                        // }
                        // if (res.status == 3 && res.type == 'check') {
                        //     var shopId = $('input[name=shopId]').val();
                        //     //location.href='/index.php/HomePc/Index/submit/shopId/'+shopId
                        //     window.location.replace("/index.php/HomePc/Index/submit/shopId/" + shopId)
                        // }
                    })
                }
                if(that.toggle==1){

                    var loginName = $('input[name=loginName]').val()
                    var loginPwd = $('input[name=loginPwd]').val()
                    if(!loginName||!loginPwd){
                        alert('请检查填写完整！');
                        return false

                    }
                    axios({
                        method: "post",
                        url: "/pc/Index/login",
                        data: {
                            name:loginName,
                            password:loginPwd,
                        }
                    }).then(function (res) {
                        if (res.data.res == 1) {
                            var dataz = res.data.data;
                            var data = JSON.stringify(dataz);
                            var storage = window.localStorage;
                            storage.removeItem('admin')
                            storage.setItem("admin", data);

                            storage.removeItem('jumpUrl')
                            if (that.jumpUrl) {
                                window.location.href = that.jumpUrl;
                            } else {
                                window.location.href = 'https://www.aftdc.com/pc/index.html';
                            }
                        }
                        if(res.data.res==0){
                            alert('密码错误!')
                            return false;
                        }
                        if(res.data.res==-2){
                            alert('为了账户安全请选择使用短信登录或微信二维码登录!')
                            return false;
                        }
                        if(res.data.res==-3){
                            alert('账户不存在!')
                            return false;
                        }

console.log(res)
                    })
                }

            },
            hqyzmClick: function () {
                var that = this;
                var phone = $('input[ name=phone]').val();
                var secode = that.secode;

                axios({
                    method: "post",
                    url: '/pc/Index/yzm',
                    data:
                        {

                            phone: phone,
                        },
                }).then(function (res) {
                    console.log(res);
                    if (res.data.res == 1) {
                        $(".hqyzm").hide(); //  【影藏 获取验证码】
                        $(".Times").show(); //  【显示 60秒】
                        time = setInterval(function () { //   countdown  倒计时器
                            secode--;
                            $(".Times").text("已发送(" + secode + ")s");
                            if (secode < 1) {
                                clearInterval(time);
                                secode = 59;
                                $(".Times").text("已发送(" + secode + ")s");
                                $(".hqyzm").show();
                                $(".hqyzm").html('重新获取');
                                $(".Times").hide();
                            }
                        }, 1000); // countdown  倒计时器
                    }
                })
            },
            chack: function () {
                var that = this;
                var phone = that.phone
                if (phone == "") {
                    return false;
                }
                var parttern = /^1[34578]\d{9}$/;
                if (!parttern.test(phone)) {
                    $(".hqyzm").html('获取验证码');
                    return false;
                } else {

                    return true;
                }
            },
        },
    })
}
