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
                img:''
            },
            created: function () {
                var that = this;
                var ptkfId = this.getPar('ptkfId');
                axios({
                    method: "post",
                    url: 'https://www.aftdc.com/aftdcAControl/Service/detail',
                    data: {
                        ptkfId:ptkfId,
                        adminNum:adminData.adminNum,
                        token:adminData.token
                    }
                }).then(function (res) {
                    console.log(res);
                    if (res.data.res >= 1) {
                        that.login_name = res.data.data.login_name
                        that.ptkfName = res.data.data.ptkfName
                        that.img = res.data.data.photo;
                    }else if(res.data.res == -1){
                        alert(res.data.reason);
                        localStorage.removeItem('adminData');
                        location.href="../Login/login.html";
                    }
                })

            },
            methods: {
                file:function () {
                   document.getElementById('inputfile') .click();
                    
                },
                add:function(){
                    var ptkfId = this.getPar('ptkfId');
                    var that = this;
                    if(this.login_password != this.relogin_password)
                    {
                        alert('密码输入不一致');
                        return false;
                    }
                    axios({
                        method: "post",
                        url: 'https://www.aftdc.com/aftdcAControl/Service/serviceEdit',
                        data: {
                            ptkfId:ptkfId,
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
                            location.href="./list.html";
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
                            that.img = 'PT/ServicePhoto/'+ oss.imgName;
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
                getPar:function (par)
             {
                 //获取当前URL
                 var local_url = document.location.href;
                 //获取要取得的get参数位置
                 var get = local_url.indexOf(par + "=");
                 if (get == -1) {
                     return false;
                 }
                 //截取字符串
                 var get_par = local_url.slice(par.length + get + 1);
                 //判断截取后的字符串是否还有其他get参数
                 var nextPar = get_par.indexOf("&");
                 if (nextPar != -1) {
                     get_par = get_par.slice(0, nextPar);
                 }
                 return get_par;
             }

            }
        })
    }
}