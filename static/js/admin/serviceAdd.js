window.onload = function(){
    var adminData = JSON.parse(localStorage.getItem('adminData'));
    if(!adminData){
        location.href="../Login/login.html";
    }else {
        var app = new Vue({
            el: "#app",
            data: {
                ptkfName:'',
                login_name:'',
                login_password:'',
                relogin_password:'',
                id:'',
                fileUpload:0,
                img:''
            },
            created: function () {

            },
            methods: {
                file:function () {
                    document.getElementById('inputfile') .click();

                },
                add:function(){
                    var that = this;
                    if(that.fileUpload == 0)
                    {
                        alert('未上传头像');
                        return false;
                    }
                    if(this.login_password != this.relogin_password)
                    {
                        alert('密码输入不一致');
                        return false;
                    }
                    axios({
                        method: "post",
                        url: 'https://www.aftdc.com/aftdcAControl/Service/serviceAdd',
                        data: {
                            img:that.img,
                            ptkfName:that.ptkfName,
                            login_name:that.login_name,
                            adminNum:adminData.adminNum,
                            login_password:that.login_password,
                            relogin_password:that.relogin_password,
                            token:adminData.token
                        }
                    }).then(function (res) {
                        if (res.data.res >= 1) {
                            that.id = res.data.res;
                            alert("上传成功");
                        }else if(res.data.res == -1){
                            alert(res.data.reason);
                            localStorage.removeItem('adminData');
                            location.href="../Login/login.html";
                        }else if(res.data.res == -3)
                        {
                            alert("客服名重复");
                        }
                        else if(res.data.res == -4)
                        {
                            alert("客服账号重复");
                        }
                    })
                },
                photo:function(e){
                    var that = this;
                    var upFileName = e.target.files[0].name;
                    var index1=upFileName.lastIndexOf(".");
                    var index2=upFileName.length;
                    var suffix=upFileName.substring(index1+1,index2);//后缀名
                    var event = e;
                    axios({
                        method: "post",
                        url: 'https://www.aftdc.com/aftdcAControl/Service/getOss',
                        data: {
                            houzui:suffix,
                            adminNum:adminData.adminNum,
                            token:adminData.token
                        }
                    }).then(function (res) {
                        if (res.data.res == 1) {
                            var oMyForm = new FormData();    // 创建一个空的FormData对象
                            var oss = res.data;

                            oMyForm.append('key','PT/ServicePhoto/'+ oss.imgName);
                            oMyForm.append('policy',oss.policy);
                            oMyForm.append('OSSAccessKeyId',oss.accessid);
                            oMyForm.append('success_action_status','200');
                            oMyForm.append('signature',oss.signature);
                            oMyForm.append("file",event.target.files[0]);
                            axios({
                                method: "post",
                                url: oss.host,
                                data: oMyForm,
                                processData:false,
                                contentType:false,
                                cache:false
                            }).then(function (res) {
                                if (res.status==200)
                                {
                                    that.fileUpload = 1;
                                    alert('图片上传成功');
                                    that.img = '/PT/ServicePhoto/'+ oss.imgName;
                                }
                            })
                        }else if(res.data.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('adminData');
                            location.href="../Login/login.html";
                        }
                    })
                },
                verity:function(repassword)
                {

                }

            }
        })
    }
}