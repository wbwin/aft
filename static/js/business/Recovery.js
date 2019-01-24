window.onload = function() {

        var app = new Vue({
            el: "#dec",
            data: {
                phone: '',
                secode: 90,
                code: '',
                color: '',
            },
            created: function () {
                var that = this;
                $(document).keyup(function (e) {//捕获文档对象的按键弹起事件
                    if (e.keyCode == 13) {//按键信息对象以参数的形式传递进来了
                        //此处编写用户敲回车后的代码
                        that.next()
                    }
                });
            },
            //生命周期+
            beforeDestroy: function () {
                eventBus.$emit('get', '测试');
            },
            methods: {
                //手机号码改变颜色
                wuha: function () {
                    var that = this;
                    // that.color = 'red';
                    var phone = that.phone;
                    var parttern = /^1[3|4|5|7|8][0-9]\d{8}$/;
                    if (!parttern.test(phone)) {

                        that.color = '#C0C0C0';
                    } else {

                        that.color = 'red';
                    }
                },
                //验证码
                yzm: function (e) {
                    var that = this;
                    var secode = that.secode;
                    var phone = that.phone;
                    var parttern = /^1[3|4|5|7|8][0-9]\d{8}$/;
                    if (!parttern.test(phone)) {
                        alert('手机号码错误')
                        return false
                    }
                    axios({
                        method: "post",
                        // url:'https://www.aftdc.com/index.php/Wxapp/Msm/send', // 请求接口
                        url: 'https://www.aftdc.com/business/Recovery/yzm', // 请求接口
                        data: {
                            phone: phone,

                        },
                    }).then(function (res) {
                        if (res.data.res == 1) {
                            $("#coke").hide(); //  【影藏 获取验证码】
                            $(".Times").show(); //  【显示 60秒】
                            time = setInterval(function () { //   countdown  倒计时器
                                secode--;
                                $(".Times").text(secode + "秒");
                                if (secode < 0) {
                                    clearInterval(time);
                                    secode = 90;
                                    $(".Times").text(secode + "秒");
                                    $("#coke").show();
                                    $(".Times").hide();
                                }
                            }, 1000); // countdown  倒计时器
                        }
                    })
                },
                //下一步
                next: function () {
                    var that = this;
                    var code = that.code;
                    if (code == '') {
                        alert('验证码错误')
                        return false
                    }
                    var phone = that.phone;
                    if (!(/^1[3|4|5|7|8][0-9]\d{8}$/.test(phone))) {
                        alert('手机号码错误')
                        return false
                    }
                    axios({
                        url: 'https://www.aftdc.com/business/Recovery/proof_phone',
                        method: 'post',
                        data: {
                            code: code,
                            phone: phone,

                        },
                    }).then(function (res) {
                        if (res.data.res == 1) {
                            sessionStorage.setItem("phone", phone);
                            location.href = './Modify.html';
                        }else {
                            alert(res.data.info)
                        }
                    })
                }
            },
        })

}