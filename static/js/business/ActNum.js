window.onload = function () {
    var shopData = JSON.parse(localStorage.getItem('shopData'));
    if (!shopData) {
        location.href = "/business/Login/index.html";
    } else {
        var app = new Vue({
            el: '.dec',
            data: {
                flag: {
                    ymiam: false, // 原始密码
                    newmiam: false, // 新密码
                    agenmiam: false, // 再次输入密码
                    dxmessage: false, //  短息验证码
                },

                userPhonecode: '', // 短息 验证码
                dxtanzmage: '',
                time: '', // 全局变量  验证码 【时间】
                dataz: {},

                secode: 60,

            },
            created: function () {
                var that = this;
                var revise = window.localStorage.getItem("revise"); // 在 缓存里面 寻找 revise  变量
                if (revise == 1) { // 判断  revise 变量  等于 1  如果等于 1 就让影藏框显示
                    $(".this_kiai").show();
                    window.localStorage.removeItem("revise"); // 显示完成后 再 移除 缓存
                }
                if (revise == 11) { // 判断  revise 变量  等于 1  如果等于 1 就让影藏框显示
                    $(".this_ini").show();
                    window.localStorage.removeItem("revise"); // 显示完成后 再 移除 缓存
                }
                axios({
                    method: "post",
                    url: 'https://www.aftdc.com/business/Store/account_message',
                    data: {token: shopData.token},
                }).then(function (res) {
                    console.log(res);
                    if (res.data.res == 1) {
                        that.dataz = res.data.data;
                    } else if (res.data.res == -1) {
                        alert(res.data.reason)
                        localStorage.removeItem('shopData');
                        location.href = "/business/Login/index.html";
                    }
                    else {
                        alert("出错啦!");
                    }

                })
            },
            methods: {
                xiupasdClick: function () {
                    // 点击【修改密码】弹出框
                    $(".this_kiai").show();
                },
                olwjopClick: function () {
                    // 点击【修改密码】【错号】
                    $(".this_kiai").hide();
                },
                xiu_kaiClick: function () { // 点击【开启】
                    $("#xiu_kai").hide();
                    $("#xiu_gan").show();
                    $(".nei_conterkai").hide();
                    $(".nei_contergan").show();

                },
                xiu_ganClick: function () {
                    // 点击关闭 时的弹框
                    $(".guan_kuang").show();
                },
                q_renClick: function () { //  点击关闭时的[弹框] 【确认】
                    $(".guan_kuang").hide();
                    $(".nei_contergan").hide();
                    $(".nei_conterkai").show();
                    $("#xiu_gan").hide();
                    $("#xiu_kai").show();

                },
                dscdxcClick: function () { //  点击关闭时的[弹框] 【错号】
                    $(".guan_kuang").hide();

                },
                q_xiaoClick: function () { //  点击关闭时的[弹框] 【取消】
                    $(".guan_kuang").hide();

                },
                benxianClick: function () { // 点击【显示更多记录▼】
                    $(".benxian").hide();
                    $(".benshou").show();
                    $(".qdnkqo").show();

                },
                benshouClick: function () { // 点击【收起更多记录▲▼】
                    $(".benxian").show();
                    $(".benshou").hide();
                    $(".qdnkqo").hide();

                },
                tidiaiClick: function () { // 点击【踢掉设备】
                    $(".guan_kti").show();

                },
                dscokocClick: function () { // 点击【踢掉设备】[X]
                    $(".guan_kti").hide();

                },
                qc_xiaoClick: function () { // 点击【踢掉设备】[取消]
                    $(".guan_kti").hide();

                },
                geh_huanClick: function () { // 点击 【绑定手机号】
                    $(".this_ini").show();

                },
                olvcde_wjopClick: function () { // 点击 【绑定手机号】[X]
                    $(".this_ini").hide();

                },
                bmimaFocus: function () { // 【修改密码】【原密码】【获取焦点】
                    $(".bmima").css({"border": "1px solid green"});
                    $(".bimg").hide();
                    $("#b\\.info").html("");
                    return;

                },
                bmimaBlur: function () {
                    var ymiam = $('input[name="ypasd"]').val();
                    var flag = this.flag;
                    if (ymiam == "") {
                        $(".bmima").css({"border": "1px solid red"});
                        $(".bimg").show();
                        $("#b\\.info").html("原始密码不为空!!!");
                        $(".zhang_b").css('color', 'red');
                        return;
                    }
                    var pattern = /^[a-zA-Z][a-zA-Z0-9_]{5,15}$/;
                    if (!pattern.test(ymiam)) {
                        $(".bmima").css({"border": "1px solid red"});
                        $(".bimg").show();
                        $("#b\\.info").html("密码格式不对!!!");
                        $(".zhang_b").css('color', 'red');
                        return;
                    } else {
                        $(".bmima").css({"border": "1px solid green"});
                        $(".bimg").hide();
                        $("#b\\.info").html("");
                        flag.ymiam = true;
                        return;
                    }
                },
                cmimaFocus: function () { // 【修改密码】【新密码】【获取焦点】
                    $(".cmima").css({"border": "1px solid green"});
                    $(".cimg").hide();
                    $("#c\\.info").html("");
                    return;

                },
                cmimaBlur: function () {
                    var flag = this.flag;
                    var newmiam = $('input[name="npasd"]').val();
                    if (newmiam == "") {
                        $(".cmima").css({"border": "1px solid red"});
                        $(".cimg").show();
                        $("#c\\.info").html("密码不为空!!!");
                        $(".zhang_c").css('color', 'red');
                        return;
                    }
                    var pattern = /^[a-zA-Z][a-zA-Z0-9_]{5,15}$/;
                    if (!pattern.test(newmiam)) {
                        $(".cmima").css({"border": "1px solid red"});
                        $(".cimg").show();
                        $("#c\\.info").html("密码格式不对!!!");
                        $(".zhang_c").css('color', 'red');
                        return;
                    } else {
                        $(".cmima").css({"border": "1px solid green"});
                        $(".cimg").hide();
                        $("#c\\.info").html("");
                        flag.newmiam = true;
                        return;
                    }
                },
                dmimaFocus: function () { // 【修改密码】【确认密码】【获取焦点】
                    $(".dmima").css({"border": "1px solid green"});
                    $(".dimg").hide();
                    $("#d\\.info").html("");
                    return;

                },
                dmimaBlur: function () {
                    var flag = this.flag;
                    var agenmiam = $('input[name="agepasd"]').val();
                    if (agenmiam == "") {
                        $(".dmima").css({"border": "1px solid red"});
                        $(".dimg").show();
                        $("#d\\.info").html("密码不为空!!!");
                        $(".zhang_d").css('color', 'red');
                        return;
                    }
                    var pattern = /^[a-zA-Z][a-zA-Z0-9_]{5,15}$/;
                    if (!pattern.test(agenmiam)) {
                        $(".dmima").css({"border": "1px solid red"});
                        $(".dimg").show();
                        $("#d\\.info").html("密码格式不对!!!");
                        $(".zhang_d").css('color', 'red');
                        return;
                    } else if (agenmiam != $(".cmima").val()) {
                        $(".dmima").css({"border": "1px solid red"});
                        $(".dimg").show();
                        $("#d\\.info").html("两次密码不一致!!!");
                        $(".zhang_d").css('color', 'red');
                        return;
                    } else {
                        $(".dmima").css({"border": "1px solid green"});
                        $(".dimg").hide();
                        $("#d\\.info").html("");
                        flag.agenmiam = true;
                        return;
                    }
                },
                enchClick: function () { //  点击修改密码中的  【完成】
                    var flag = this.flag;
                    var ok = flag.ymiam && flag.newmiam && flag.agenmiam;
                    if (ok == false) {
                        alert("表单项正在检测或存在错误");
                        return false;
                    } else {
                        //alert("1212");
                        var LogName = $('input[name="loginName"]').val(); // 获取 用户名  【获取的是影藏域的loginName 要在影藏于里面的val 修改 {$v.loginName} 】
                        var Ypasd = $('input[name="ypasd"]').val(); // 获取 输入的 原密码
                        console.log(Ypasd);
                        var Npasd = $('input[name="npasd"]').val(); // 获取 输入的 新密码
                        var pass = $('input[name="agepasd"]').val();
                        if (Npasd != pass) {
                            alert('两次密码不一致')
                            return false;
                        }
                        console.log(Npasd);
                        axios({
                            method: "post",
                            url: 'https://www.aftdc.com/business/Store/alter_password',
                            data: {
                                original_pwd: Ypasd,
                                new_pwd: Npasd,
                                token: shopData.token
                            },
                        }).then(function (res) {
                            console.log(res);
                            if (res.data.res == -1) {
                                alert('没有数据');
                                return false;
                            }
                            if (res.data.res == -2) {
                                alert('数据不完整');
                                return false;
                            }
                            if (res.data.res == -3) {
                                alert('原密码错误');
                                return false;
                            }


                            if (res.data.res == 1) {
                                alert('更换成功');
                                location.reload()
                            } else if (res.data.res == -1) {
                                alert(res.data.reason)
                                localStorage.removeItem('shopData');
                                location.href = "/business/Login/index.html";
                            }

                            else {
                                alert('更换失败');
                                return false;
                            }
                        })

                    }

                },
                boyyenerClick: function () { //   点击发送 【验证码】点击发送 【验证码】点击发送 【验证码】
                    var phone = $('input[name="userPhone"]').val(); // 获取影藏域中的手机号码 根据 boyyener 搜索位置 修改 影藏于中的 {$v.userPhone}
                    var dxtanzmage = this.dxtanzmage;
                    var time = this.time;
                    var secode = this.secode;
                    axios({
                        method: "post",
                        // url:'https://www.aftdc.com/index.php/Wxapp/Msm/send', // 请求接口
                        url: 'https://www.aftdc.com/business/Store/yzm', // 请求本地接口
                        data: {
                            original_phone: phone,
                            token: shopData.token
                        },
                    }).then(function (res) {

                        if (res.data.res == -1) {
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href = "/business/Login/index.html";
                        }

                        $(".boyyener").hide(); //  【影藏 获取验证码】
                        $(".Times").show(); //  【显示 60秒】
                        time = setInterval(function () {
                            //   countdown  倒计时器
                            secode--;
                            $(".Times").text(secode + "秒");
                            if (secode < 0) {
                                clearInterval(time);
                                secode = 60;
                                $(".Times").text(secode + "秒");
                                $(".boyyener").show();
                                $(".Times").hide();
                            }
                        }, 1000) // countdown  倒计时器
                        // console.log(ree);
                    })


                },
                // yan_enchClick: function() { /**点击 【绑定手机号】 【验证】**/
                //     var Scode = $('input[name="scode"]').val(); /** 获取输入验证码**/
                //     if (!Scode) {
                //         $(".kuananzm").css('border', '1px solid red');
                //         $(".imsh_cuo").show();
                //         $(".ziticolor").css('color', 'red');
                //         $("#confo\\.info").html("验证码不能为空!!!");
                //         return false
                //     }
                //     var phone = $('input[name="userPhone"]').val();
                //     axios({
                //         method: "post",
                //         url: 'https://www.aftdc.com/business/recovery/proof_phone', // 处理  验证码是否相等
                //         data: {
                //             code: Scode,
                //             phone: phone
                //         },
                //     }).then(function(res) {
                //         console.log(res);
                //         if (res.data.res == 1) {
                //             $('.xqw_klj').html('绑定新手机')
                //             $('.yan_ma').hide()
                //             $('.yan_ma').hide()
                //             $('.ckwj_neo').hide()
                //             $('.yan_ench').hide()
                //             $('.ckwj_neo1').show()
                //             $('.savePhone').show()
                //         } else {
                //             alert('验证码错误');
                //         }
                //     })
                //
                //
                // },
                savePhoneClick: function () {
                    var flag = this.flag;
                    var Scode = $('input[name="scode"]').val();
                    /** 获取输入验证码**/
                    if (!Scode) {
                        $(".kuananzm").css('border', '1px solid red');
                        $(".imsh_cuo").show();
                        $(".ziticolor").css('color', 'red');
                        $("#confo\\.info").html("验证码不能为空!!!");
                        return false
                    }

                    if (flag.phone) {
                        var newPhone = $('input[name="newPhone"]').val()
                        var phone = $('input[name="userPhone"]').val();
                        axios({
                            method: "post",
                            url: 'https://www.aftdc.com/business/Store/alter_phone',
                            data: {
                                original_phone: phone,
                                new_Phone: newPhone,
                                code: Scode,
                                token: shopData.token
                            },
                        }).then(function (res) {
                            if (res.data.res == 1) {
                                alert('更换成功！')
                                location.reload()
                            } else if (res.data.res == -1) {
                                alert(res.data.reason)
                                localStorage.removeItem('shopData');
                                location.href = "/business/Login/index.html";
                            }

                            else if (res.data.res == 0) {
                                alert('验证码错误，更换保存失败！')
                            }
                        })


                    }
                },
                kuananzmFocus: function () { //  短息验证码 输入框 【获取焦点】
                    $(".kuananzm").css('border', '1px solid #06c1ae');
                    $(".imsh_cuo").hide();
                    $("#confo\\.info").html("");
                    return;

                },
                kuananzmBlur: function () {
                    var flag = this.flag;
                    var dxmessage = $('input[name="scode"]').val();
                    if (dxmessage == "") {
                        $(".kuananzm").css('border', '1px solid red');
                        $(".imsh_cuo").show();
                        $(".ziticolor").css('color', 'red');
                        $("#confo\\.info").html("验证码不能为空!!!");
                        return;
                    }
                    var pattern = /[0-9]{4,6}/;
                    if (!pattern.test(dxmessage)) {
                        $(".kuananzm").css('border', '1px solid red');
                        $(".imsh_cuo").show();
                        $(".ziticolor").css('color', 'red');
                        $("#confo\\.info").html("验证码位4-6位数字!!!");
                        return;
                    } else {
                        $(".kuananzm").css('border', '1px solid #06c1ae');
                        $(".imsh_cuo").hide();
                        $(".ziticolor").css('color', '#06c1ae');
                        $("#confo\\.info").html("格式正确!!!");
                        flag.dxmessage = true;
                        return;
                    }
                },
                phonesFocus: function () { //  短息验证码 输入框 【获取焦点】
                    $(".phones").css('border', '1px solid #06c1ae');
                    $(".imsh_cuo").hide();
                    $("#confo\\.info").html("");
                    return;

                },
                phonesBlur: function () {
                    var flag = this.flag;
                    var dxmessage = $('input[name="newPhone"]').val();
                    if (dxmessage == "") {
                        $(".phones").css('border', '1px solid red');
                        $(".imsh_cuo").show();
                        $(".ziticolor").css('color', 'red');
                        $("#confo\\.info").html("手机号不能为空!!!");
                        flag.phone = false;
                        return;
                    }
                    var pattern = /^1[3|4|5|8|7][0-9]\d{4,8}$/;
                    if (!pattern.test(dxmessage)) {
                        $(".phones").css('border', '1px solid red');
                        $(".imsh_cuo").show();
                        $(".ziticolor").css('color', 'red');
                        $("#confo\\.info").html("不是完整的11位手机号或者正确的手机号前七位!!!");
                        flag.phone = false;
                        return;
                    } else {
                        $(".phones").css('border', '1px solid #06c1ae');
                        $(".imsh_cuo").hide();
                        $(".ziticolor").css('color', '#06c1ae');
                        $("#confo\\.info").html("格式正确!!!");
                        flag.phone = true;
                        return;
                    }

                },
            }
        })
    }
}


// /*分店申请验证码请求*/
// $(".cokeas").click(function() { //   点击发送 【验证码】点击发送 【验证码】点击发送 【验证码】
//     var phone = $('input[name=phone]').val(); // 获取影藏域中的手机号码 根据 cokeas 搜索位置 修改 影藏于中的 {$v.userPhone}
//     if (flag.phone) {
//         $.ajax({
//             url: '/index.php/Wxapp/Msm/appSendCode', // 请求发短信
//             data: { phone: phone },
//             type: 'post',
//             success: function(ree) {
//                 alert('已发送，请在60秒内完成认证')
//             }
//         });
//     }
// });