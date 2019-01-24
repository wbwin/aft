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

            },
            methods: {
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
                bottomClick: function () {
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
                            alert('设置成功!');
                            location.href='/pc/safeconter.html'
                        }else{
                            alert('设置失败!');
                        }
                    })
                },
                addressclick:function () {
                    location.href = "/pc/home.html"
                },
            },
        })
    }
}