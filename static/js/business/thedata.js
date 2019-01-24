window.onload = function() {
    var shopData = JSON.parse(localStorage.getItem('shopData'));
    if (!shopData) {
        location.href = "/business/Login/index.html";
    } else {
        var app = new Vue({
            el: '#preOrder',
            data: {
                ComerMessage: '', // 全局变量  短息验证码
                time: '', // 全局变量  验证码 【时间】
                secode: 90,
                Min: '',//类型
                license: '',//请输入工商执照注册号,
                operator: '',//请输入经营者姓名
                General: '',//一般经营范围
                approved: '',//前置许可经营范围
                account: '',//开户名称
                bank: '',//开户银行
                number_bank: '',//银行账号
                Contact_name: '',//联系人姓名
                phone: '',//联系人手机号码
                landline: '',//联系人座机
                Emailo: '',//联系人电子邮箱
                code: '',//验证码
                a: 'none',//一般经营范围是否正确
                b: 'none',//前置许可经营范围是否正确
                c: 'none',//银行卡是否错误
                d: 'none',//联系人姓名是否错误
                e: 'none',//手机号是否错误
                f: 'none',//联系人座机是否错误
                g: 'none',//邮箱是否错误
                color: '',//颜色
            },
            created: function () {
                var that = this;
                axios({
                    url: 'https://www.aftdc.com/business/Certification/complete_data',
                    method: 'post',
                    data: {
                        token:shopData.token,
                    },
                }).then(function (res) {
                    if(res.data.res == -1){
                        alert(res.data.reason)
                        localStorage.removeItem('shopData');
                        location.href="/business/Login/index.html";
                    }

                    that.Min = res.data.type;
                    that.license = res.data.license;
                    that.operator = res.data.operator;
                    that.General = res.data.General;
                    that.approved = res.data.approved;
                    that.account = res.data.account;
                    that.bank = res.data.bank;
                    that.number_bank = res.data.number_bank;
                    that.Contact_name = res.data.Contact_name;
                    that.phone = res.data.phone;
                    that.landline = res.data.landline;
                    that.Emailo = res.data.Emailo;
                })
            },
            methods: {
                step: function () { //  【上一步】
                    location.href = './Comder.html';
                },
                //一般经营范围
                one: function () {
                    var General = this.General;
                    var pattern = /^[\u4e00-\u9fa5]{2,150}$/;
                    if (!pattern.test(General)) {
                        this.a = '';
                    } else {
                        this.a = 'none';
                    }
                },
                //前置许可经营范围
                two: function () {
                    var approved = this.approved;
                    var pattern = /^[\u4e00-\u9fa5]{2,150}$/;
                    if (!pattern.test(approved)) {
                        this.b = '';
                    } else {
                        this.b = 'none';
                    }
                },
                //银行卡编辑
                three: function () {
                    var number_bank = this.number_bank;
                    var pattern = /^[0-9]{4}[ ]{1}[0-9]{4}[ ]{1}[0-9]{4}[ ]{1}[0-9]{4}[ ]{1}...$/;
                    if (!pattern.test(number_bank)) {
                        this.c = '';
                    } else {
                        this.c = 'none';
                    }
                },
                //联系人姓名
                four: function () {
                    var Contact_name = this.Contact_name;
                    var pattern = /^[\u4e00-\u9fa5]{2,5}$/;
                    if (!pattern.test(Contact_name)) {
                        this.d = '';
                    } else {
                        this.d = 'none';
                    }
                },
                //手机号码
                five: function () {
                    var that = this;
                    var phone = that.phone;
                    var pattern = /^1[34578]\d{9}$/;
                    if (!pattern.test(phone)) {
                        that.e = '';
                        that.color = '#C0C0C0';
                    } else {
                        that.e = 'none';
                        that.color = 'red';
                    }
                },
                //联系人座机
                six: function () {
                    var landline = this.landline;
                    var pattern = /^(\(\d{3,4}\)|\d{3,4}-)?\d{7,8}$/;
                    if (!pattern.test(landline)) {
                        this.f = '';
                    } else {
                        this.f = 'none';
                    }
                },
                //邮箱
                seven: function () {
                    var Emailo = this.Emailo;
                    var pattern = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
                    if (!pattern.test(Emailo)) {
                        this.g = '';
                    } else {
                        this.g = 'none';
                    }
                },
                //获取验证码
                yzm: function () {
                    var that = this;
                    var phone = that.phone;
                    var e = that.e;
                    if (e == '') {
                        return false;
                    }
                    if (phone == '') {
                        return false;
                    }
                    var secode = that.secode;
                    axios({
                        method: "post",
                        // url:'https://www.aftdc.com/index.php/Wxapp/Msm/send', // 请求接口
                        url: 'https://www.aftdc.com/business/Certification/yzm',
                        data: {
                            phone: phone,
                            token:shopData.token,
                        },
                    }).then(function (res) {

                        if (res.data.res == 1) {
                            $(".XinSin").hide(); //  【影藏 获取验证码】
                            $(".ScterSin").show(); //  【显示 60秒】
                            time = setInterval(function () { //   countdown  倒计时器
                                secode--;
                                $(".ScterSin").text(secode + "秒");
                                if (secode < 0) {
                                    clearInterval(time);
                                    secode = 90;
                                    $(".ScterSin").text(secode + "秒");
                                    $(".XinSin").show();
                                    $(".ScterSin").hide();
                                }
                            }, 1000); // countdown  倒计时器
                        }else if(res.data.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href="/business/Login/index.html";
                        }
                    })
                },
                //下一步
                next: function () {
                    var that = this;
                    var data = {};
                    data.type = that.Min
                    data.license = that.license
                    data.operator = that.operator
                    data.General = that.General
                    var pattern = /^[\u4e00-\u9fa5]{2,150}$/;
                    if (!pattern.test(data.General)) {

                        return false;
                    }
                    data.approved = that.approved
                    if (!pattern.test(data.approved)) {

                        return false;
                    }
                    data.account = that.account
                    data.bank = that.bank
                    data.Contact_name = that.Contact_name
                    if (!pattern.test(data.Contact_name)) {

                        return false;
                    }
                    data.phone = that.phone
                    var pattern = /^1[34578]\d{9}$/;
                    if (!pattern.test(data.phone)) {

                        return false;
                    }
                    data.landline = that.landline
                    var pattern = /^(\(\d{3,4}\)|\d{3,4}-)?\d{7,8}$/;
                    if (!pattern.test(data.landline)) {

                        return false;
                    }
                    data.Emailo = that.Emailo
                    var pattern = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
                    if (!pattern.test(data.Emailo)) {

                        return false;
                    }
                    data.start_time = Date.parse(new Date());
                    data.code = that.code
                    data.token=shopData.token;
                    if (!data.code) {
                        alert('未验证码')
                        return false;
                    }

                    axios({
                        url: 'https://www.aftdc.com/business/Certification/prove_data',
                        method: 'post',
                        data: data,
                    }).then(function (res) {
                        if (res.data.res == 1) {
                            location.href = './invoice.html';
                        }else if(res.data.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href="/business/Login/index.html";
                        } else {
                            alert(res.data.info)
                        }
                    })
                }

            }
        })
    }
}