window.onload = function () {
    var adminData = JSON.parse(localStorage.getItem('adminData'));
    if (!adminData) {
        location.href = "../Login/login.html";
    } else {
        var app = new Vue({
            el: "#app",
            data: {
                listData: [],
                modalTxt: '',
                tips: {txt: '', clas: 'onFocus'},
                togle: 0,
                pageNumb: 0,//总页数
                pageCurent: 1,//当前页
                pageEach: 10,//每页分几条数据
                tuisong: 'none',//推送按钮
                length: 0,//长度
                tit: '',//标题
                matter: '',//内容
                matt_img: [],//内容图片
                tit_img: '',//标题图片
                selected: '1',
                options: [
                    {text: '推送用户', value: '1'},
                    {text: '推送商家', value: '2'},
                ],
                c: 0,
                disabled: false,
                files: [],
                fileUrl: [],

            },
            created: function () {
                this.pageFn(1)

            },
            methods: {
                //分页请求 查询数据
                pageFn: function (pageCurent) {
                    var that = this;
                    var page = (pageCurent - 1) * that.pageEach;
                    that.pageCurent = pageCurent;
                    axios({
                        method: "POST",
                        url: "https://www.aftdc.com/aftdcacontrol/Push/index",
                        data: {
                            page: page,
                            adminNum: adminData.adminNum,
                            token: adminData.token
                        },
                    }).then(function (res) {
                        var require = res.data;
                        if (require.res == 1) {
                            that.listData = require.data;
                            that.pageNumb = Math.ceil(require.pageCount / require.pageEach)
                            that.pageEach = require.pageEach
                        } else if (res.data.res == -1) {
                            alert(res.data.reason)
                            localStorage.removeItem('adminData');
                            location.href = "../Login/login.html";
                        }
                    })
                },
                modalTogle: function () {
                    this.togle = 1;
                },

                onfocus: function () {
                    this.tips = {txt: '请输入推广消息', clas: 'onFocus'}
                },
                onblur: function () {
                    var txt = this.modalTxt;
                    if (Boolean(txt) && txt.length > 0) {
                        this.tips = {txt: '输入正确', clas: 'onCorrect'}
                    } else {
                        this.tips = {txt: '您输入的长度不正确,请确认', clas: 'onError'}
                    }
                },
                //添加推广消息
                addWord: function () {
                    var that = this;
                    var txt = that.modalTxt;
                    if (!Boolean(txt) || txt.length == 0) {
                        that.onfocus();
                        return false
                    }
                    axios({
                        method: "post",
                        url: "https://www.aftdc.com/aftdcAControl/Push/add",
                        data: {
                            content: txt,
                            adminNum: adminData.adminNum,
                            token: adminData.token
                        }
                    }).then(function (res) {
                        if (res.data.res == 1) {
                            that.listData.push(res.data.data);
                            that.togle = 0;
                            that.modalTxt = '';
                        } else if (res.data.res == -1) {
                            alert(res.data.reason)
                            localStorage.removeItem('adminData');
                            location.href = "../Login/login.html";
                        }
                    })
                },
                del: function (id, index) {
                    var that = this;
                    if (confirm("确认删除该推广消息")) {
                        axios({
                            method: "post",
                            url: "https://www.aftdc.com/aftdcAControl/Push/delPush",
                            data: {
                                id: id,
                                adminNum: adminData.adminNum,
                                token: adminData.token
                            }
                        }).then(function (res) {
                            if (res.data.res == 1) {
                                that.listData.splice(index, 1)
                            } else if (res.data.res == -1) {
                                alert(res.data.reason)
                                localStorage.removeItem('adminData');
                                location.href = "../Login/login.html";
                            }
                        })
                    }
                },
                //打开添加推送
                show: function () {
                    this.tuisong = '';
                },
                //关闭添加推送
                guanbi: function () {
                    this.tuisong = 'none';
                },
                //推送图片
                file: function () {
                    document.getElementById("file").click();
                },
                //上传图片
                uploadImg: function (event) {
                    console.log(event)
                    var files = event.target.files, file;
                    if (files && files.length > 0) {
                        // 获取目前上传的文件
                        file = files[0];// 文件大小校验的动作
                        if (file.size > 1024 * 1024 * 2) {
                            alert('图片大小不能超过 2MB!');
                            return false;
                        }
                        this.tit_img = file;
                        var URL = window.URL || window.webkitURL;
                        var imgURL = URL.createObjectURL(file);
                        document.getElementById("img-change").setAttribute("src", imgURL);
                    }
                },
                //内容图片
                matt: function () {
                    document.getElementById('pic_selector').click()
                },
                matter_img: function () {
                    var that = this
                    // $('.imgtogle').hide();
                    // $('.text-center').hide();
                    that.fileUrl=[];
                    that.files=[];
                    var files = that.files;
                    var docObj = document.getElementById("pic_selector");
                    var fileList = docObj.files;
                    var len = fileList.length;
                    if (len > 9) {
                        alert('一次最多选择9张图片保存，已为您选择前9张图片')
                        len = 9
                    }
                    for (var i = 0; i < len; i++) {
                        files[i] = docObj.files[i];

                        var fil = files[i];

                        var reader = new FileReader();
                        reader.readAsDataURL(fil);
                        that.reader(reader);
                        // var files = event.target.files, file;
                        // var that = this;
                        // if (files && files.length > 0) {
                        //     // 获取目前上传的文件
                        //     file = files[0];// 文件大小校验的动作
                        //     if(file.size > 1024 * 1024 * 2) {
                        //         alert('图片大小不能超过 2MB!');
                        //         return false;
                        //     }
                        //     // 获取 window 的 URL 工具
                        //     var URL = window.URL || window.webkitURL;
                        //     // 通过 file 生成目标 url
                        //     var img = [];
                        //     if(document.getElementById("thisNode")){
                        //         that.matt_img = [];
                        //         for(var i = 0;i<that.length;i++){
                        //             var obj = document.getElementById("thisNode");
                        //             var impParent = obj.parentNode;//获取img的父对象
                        //             impParent.removeChild(obj);//通过img的父对象把它删除
                        //         }
                        //     }
                        //     that.length = files.length
                        //     if (files.length>9) {
                        //         return false;
                        //     }
                        //     // $(".matter_img").removeChild(getElementById("thisNode"));
                        //     for(var i = 0;i<files.length;i++){
                        //         img.push(files[i]);
                        //         var imgURL = URL.createObjectURL(files[i]);
                        //         var otest = document.getElementById("test");
                        //         var pic_div="<img id='thisNode' style='width:100px;height:100px;float:left;margin-top:10px;' onclick='del()' src="+imgURL+">";
                        //         var newEle = document.createElement('div');//先创建一个
                        //         newEle.innerHTML = pic_div;//赋值
                        //         otest.appendChild(newEle);//在最后一个子节点列表之后添加一个新的子节点。追加节点
                        //     }
                        //     that.matt_img = img;
                        // URL.revokeObjectURL(imgURL);
                    }
                },
                reader: function (reader) {
                    var that = this
                    reader.onload = function () {
                        var url = reader.result;
                        that.fileUrl.push(url)


                    }
                },
                closeFn: function (index) {

                    var fileUrl = this.fileUrl

                    fileUrl = fileUrl.splice(index, 1);

                    var files = this.files;

                    files = files.splice(index, 1);

                },
                //确定推送
                tui: function () {
                    var that = this;
                    that.disabled = true;
                    var title = that.tit;//标题
                    if (!title) {
                        alert('标题不能为空')
                        return false
                    }
                    var matter = that.matter;//内容
                    if (!matter) {
                        alert('内容不能为空')
                        return false
                    }
                    var selecte = that.selected;//复选框
                    var matt_img = that.files;//内容图片
                    if (matt_img.length<=0) {
                        alert('内容图片不能为空')
                        return false
                    }
                    var tit_img = that.tit_img;//标题图片
                    if (!tit_img) {
                        alert('标题图片不能为空')
                        return false
                    }
                    console.log(tit_img)
                    var one = [];
                    for (var i = 0; i < matt_img.length; i++) {
                        console.log(matt_img)
                        var filename = matt_img[i].name;//门脸
                        var index1 = filename.lastIndexOf(".");
                        var index2 = filename.length;
                        one[i] = filename.substring(index1, index2);//后缀名
                    }
                    var one_name = JSON.stringify(one);
                    var filename = matt_img[0].name;//门脸
                    var index1 = filename.lastIndexOf(".");
                    var index2 = filename.length;
                    var two_name = filename.substring(index1, index2);//后缀名
                    axios({
                        url: '/aftdcAControl/Push/tuisong',
                        method: 'post',
                        data: {
                            two_name: two_name,
                            one_name: one_name,
                            content: matter,
                            title: title,
                            type: selecte,
                        },
                    }).then(function (res) {
                        var oss = res.data.oss;//oss
                        var t_img = res.data.t_img;
                        var content_name = res.data.n_img;//内容图片
                        var img = res.data.t_img;//标题图片
                        var id = res.data.res;//id
                        var contentImg = JSON.stringify(content_name)
                        if (res.data.res != 0) {
                            var p = 0;
                            if (matt_img.length>0) {
                                for (var i = 0; i < matt_img.length; i++) {
                                    var formData = new FormData();
                                    formData.append("key", res.data.n_img[i]);
                                    formData.append("policy", res.data.oss.policy);
                                    formData.append("OSSAccessKeyId", res.data.oss.accessid);
                                    formData.append("success_action_status", '200');
                                    formData.append("signature", res.data.oss.signature);
                                    formData.append("file", matt_img[i]);
                                    axios({
                                        method: "post",
                                        url: res.data.oss.host,
                                        data: formData,
                                        processData: false,
                                        contentType: false,
                                    }).then(function (one) {
                                        if (one.status == 200) {
                                            p++
                                            if (p == matt_img.length) {
                                                axios({
                                                    url: '/aftdcAControl/Push/insert_img',
                                                    method: 'post',
                                                    data: {
                                                        file: contentImg,
                                                        type: 1,
                                                        id: id,
                                                    }
                                                }).then(function (n) {
                                                    if (n.data.res == 1) {
                                                        that.c++
                                                        if (that.c == 2) {
                                                            alert('推送成功')
                                                            // top.location.reload()
                                                        }
                                                    }
                                                })
                                            }
                                        }
                                    })
                                }
                            }
                            if (tit_img) {
                                var formData = new FormData();
                                formData.append("key", t_img);
                                formData.append("policy", oss.policy);
                                formData.append("OSSAccessKeyId", oss.accessid);
                                formData.append("success_action_status", '200');
                                formData.append("signature", oss.signature);
                                formData.append("file", tit_img);
                                axios({
                                    method: "post",
                                    url: oss.host,
                                    data: formData,
                                    processData: false,
                                    contentType: false,
                                }).then(function (two) {
                                    if (two.status == 200) {
                                        axios({
                                            url: '/aftdcAControl/Push/insert_img',
                                            method: 'post',
                                            data: {
                                                file: img,
                                                type: 2,
                                                id: id,
                                            }
                                        }).then(function (n) {
                                            if (n.data.res == 1) {
                                                that.c++
                                                if (that.c == 2) {
                                                    alert('推送成功')
                                                    // top.location.reload()
                                                }
                                            }
                                        })
                                    }
                                })
                            }
                        }
                    })
                },
            }
        })
    }
}