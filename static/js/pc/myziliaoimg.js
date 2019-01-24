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
                dataz: '',
                fileUrl: '',
                file: '',
                geographic:'',
            },
            created: function () {
                var that = this
                that.userId = admin.userId;
                that.geographic = window.localStorage.getItem("geographic");
            },
            methods: {
                addressclick:function () {
                    location.href = "/pc/home.html"
                },
                felishang: function () {
                    $('#avatarInput').click();
                },
                avatarInputChange: function () {
                    var that = this;
                    $('#img').show();
                    $('#update').show()
                    var avatarInputObj = document.getElementById("avatarInput");
                    var file = avatarInputObj.files[0]
                    that.file = file;
                    console.log(file);
                    var reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = function () {
                        that.fileUrl = reader.result;
                    }
                },
                update: function () {
                    var that = this;
                    var file = that.file;
                    var suffix = '.' + file.name.split('.')[1];

                    axios({
                        method: "post",
                        url: "/pc/Order/appellation",
                        data: {
                            userId: that.userId,
                            suffix: suffix,
                        }
                    }).then(function (res) {
                        console.log(res)
                        if (res.data.res == 1) {
                            var imgurl = res.data.name;//图片的路径
                            var formData = new FormData();
                            formData.append("key",  res.data.name);
                            formData.append("policy", res.data.oss.policy);
                            formData.append("OSSAccessKeyId", res.data.oss.accessid);
                            formData.append("success_action_status", '200');
                            formData.append("signature", res.data.oss.signature);
                            formData.append("file", file);

                            axios({
                                method: "post",
                                url: res.data.oss.host,
                                data: formData,
                                processData: false,
                                contentType: false,
                            }).then(function (res) {

                                    axios({
                                        method: "post",
                                        url: "/pc/Order/updhead",
                                        data: {
                                            userPhoto: imgurl,
                                           userId:that.userId,
                                        }
                                    }).then(function (res) {
                                        console.log(res);
                                        if(res.data.res==1){
                                            alert('上传成功！');
                                            location.href='/pc/myziliao.html';
                                        }

                                    })

                            })
                        }
                    })

                },

            },
        })
    }
}