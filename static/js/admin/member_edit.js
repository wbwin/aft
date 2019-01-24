window.onload = function(){
    var adminData = JSON.parse(localStorage.getItem('adminData'));
    if(!adminData){
        location.href="../Login/login.html";
    }else {
        var app = new Vue({
            el: "#app",
            data: {
                userData: {},
                file: false,//上传的图片

            },
            created: function () {
                var that = this;
                var userId = window.localStorage.getItem("userId");
                if (userId) {
                    axios({
                        method: "post",
                        url: "https://www.aftdc.com/aftdcAControl/Member/member_edit",
                        data: {
                            userId: userId,
                            adminNum:adminData.adminNum,
                            token:adminData.token
                        }
                    }).then(function (res) {
                        if (res.data.res == 1) {
                            that.userData = res.data;
                        }else if(res.data.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('adminData');
                            location.href="../Login/login.html";
                        }
                    })

                } else {
                    window.history.go(-1)
                }

            },
            methods: {

                upPhoto: function (event) {
                    var that = event.target
                    var file = that.files[0];
                    this.file = file
                    var url = null;
                    if (window.createObjectURL != undefined) {
                        url = window.createObjectURL(file)
                    } else if (window.URL != undefined) {
                        url = window.URL.createObjectURL(file)
                    } else if (window.webkitURL != undefined) {
                        url = window.webkitURL.createObjectURL(file)
                    }
                    this.userData.userPhoto = url
                },
                keep: function () {
                    var that = this;
                    var userData = that.userData;
                    var userPhone = userData.userPhone;
                    if (!(/^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9])|(17[0-9]))\d{8}$/.test(userPhone))) {
                        alert("手机号错误")
                        return false
                    }
                    var userEmail = userData.userEmail;
                    if (userEmail) {
                        if (!(/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(userEmail))) {
                            alert("邮箱错误")
                            return false
                        }
                    }
                    var formData = new Object()
                    formData.userId = userData.userId
                    formData.userName = userData.userName
                    formData.sex = userData.sex
                    formData.userQQ = userData.userQQ
                    formData.userPhone = userData.userPhone
                    formData.userEmail = userData.userEmail
                    formData = JSON.stringify( formData );
                    axios({
                        method: "POST",
                        url: "https://www.aftdc.com/aftdcAControl/Member/member_alter",
                        data: {
                            formData:formData,
                            adminNum:adminData.adminNum,
                            token:adminData.token
                        }
                    }).then(function (res) {
                        if(res.data.res==1){
                            alert('修改成功!');
                            top.location.reload();
                        }
                        if(res.data.res==0){
                            alert('修改失败!');
                            return false
                        }
                        var file = that.file;
                        if (file) {
                            var formData = new FormData();
                            formData.append('image', file);
                            formData.append('userId', res.userId);
                            axios({
                                method: "post",
                                url: 'https://www.aftdc.com/aftdcAControl/Member/member_upload',
                                data: formData
                            }).then(function (res) {
                                var state = res.data.res
                                if (state == 1) {
                                    alert("图片上传成功")
                                } else if (state == 0) {
                                    alert("图片上传失败")
                                } else if (state == -1) {
                                    alert("图片过大")
                                }else if(res.data.res == -1){
                                    alert(res.data.reason)
                                    localStorage.removeItem('adminData');
                                    location.href="../Login/login.html";
                                }
                            })
                        }
                    })


                },


            }
        })
    }
}