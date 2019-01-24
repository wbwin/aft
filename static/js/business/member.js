window.onload = function() {
    var shopData = JSON.parse(localStorage.getItem('shopData'));
    if (!shopData) {
        location.href = "/business/Login/index.html";
    } else {
        var app = new Vue({
            el: '.Huod',
            data: {
                datas: {},
                dataz: {},
                pageNumb: 0, //总页数
                pageCurent: 1, //当前页
                pageEach: 5, //每一页显示数据条数
                display:'none',//地址
                img:'',
            },
            created: function () {
                var that = this;
                that.pageFn(1);
            },
            methods: {

                //------------------------分页跳转------------------------------------
                pageFn: function (pageCurent) {

                    var that = this;
                    var page = (pageCurent - 1) * that.pageEach;
                    that.pageCurent = pageCurent;
                    axios({
                        method: "post",
                        url: 'https://www.aftdc.com/business/Membership/Membership_list',
                        data: {
                            page: page,
                            token: shopData.token,

                        },
                    }).then(function (res) {
                        if (res.data.res == 1) {
                            that.datas = res.data;
                            that.dataz = res.data.data;
                            //初始化页数
                            var pageCount = Number(res.data.pageCount);
                            var pageEach = Number(res.data.pageEach);
                            that.pageEach = res.data.pageEach;
                            var pageNumb = Math.ceil(pageCount / pageEach)
                            that.pageNumb = pageNumb

                        } else if (res.data.res == -1) {
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href = "/business/Login/index.html";
                        } else {
                            alert('出错啦')
                        }
                    })


                },

                //**********
                btn1Click: function () {
                    var oDiv = document.getElementById('div1');
                    var aCh = oDiv.getElementsByTagName('input');
                    for (var i = 0; i < aCh.length; i++) {
                        aCh[i].checked = true;
                    }
                },
                btn2Click: function () {
                    var oDiv = document.getElementById('div1');
                    var aCh = oDiv.getElementsByTagName('input');
                    for (var i = 0; i < aCh.length; i++) {
                        aCh[i].checked = false;
                    }
                },
                btn3Click: function () {
                    var oDiv = document.getElementById('div1');
                    var aCh = oDiv.getElementsByTagName('input');
                    for (var i = 0; i < aCh.length; i++) {
                        if (aCh[i].checked == false) {
                            aCh[i].checked = true;
                        } else {
                            aCh[i].checked = false;
                        }
                    }
                },
                allINteClick: function () {

                    if ($('input[name="allINte"]').is(':checked')) {
                        $("#btn1").click();
                    } else {
                        $("#btn2").click();
                    }
                },
                Submit: function () {
                    var that = this
                    var phone = $('input[name="mobile"]').val();
                    axios({
                        method: "post",
                        url: 'https://www.aftdc.com/business/Membership/Membership_list',

                        data: {
                            userPhone: phone,
                            token: shopData.token,
                        },
                    }).then(function (res) {
                        if (res.data.res == 1) {
                            that.datas = res.data;
                            that.dataz = res.data.data;
                        } else if (res.data.res == -1) {
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href = "/business/Login/index.html";
                        }
                        else if (res.data.res == -5) {
                            alert('该店铺无该会员！')
                            return false;
                        }

                    })

                },
                ATERNClick: function (index) {
                    var that = this;
                    var phone = that.dataz[index].userPhone;


                    location.href = '/business/Membership/history.html?userPhone=' + phone;
                },
                //点击导入
                File: function () {
                    this.$refs.searchDom.click();
                },
                //获得文件信息导入数据库
                getFile: function (event) {
                    var file = event.target.files[0];
                    var filename = file.name;//门脸
                    var index1 = filename.lastIndexOf(".");
                    var index2 = filename.length;
                    var format = filename.substring(index1, index2);//后缀名
                    var str = ".xlsx";
                    console.log(str.indexOf(format))
                    if (str.indexOf(format) == -1) {
                        alert('传xlsx或者xls')
                        return false;
                    }
                    axios({
                        url: 'https://www.aftdc.com/business/Membership/xlsx_name',
                        method: 'post',
                        data: {
                            format: format,
                            token: shopData.token,
                        }
                    }).then(function (res) {
                        console.log(res)
                        var name = res.data.name;
                        var formData = new FormData();
                        formData.append("key", res.data.name);
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
                            console.log(res)
                            if (res.status == 200) {
                                axios({
                                    url: 'https://www.aftdc.com/business/Membership/xlsx_mysql',
                                    method: 'post',
                                    data: {
                                        name: name,
                                        token: shopData.token,
                                    }
                                }).then(function (res) {
                                    console.log(res)
                                    if (res.data.res == 1) {
                                        alert('已导入')
                                    } else {
                                        alert('未导入')
                                    }
                                })
                            } else {
                                alert('图片上传失败')
                            }
                        })
                    })
                },
                //认证会员
                box:function(id){
                    var that = this;
                    axios({
                        url:'https://www.aftdc.com/business/Membership/code',
                        method:'post',
                        data:{
                            id:id,
                            token: shopData.token,
                        },
                    }).then(function(res){
                        console.log(res)
                        that.img = res.data.getWxAppCode;
                        that.display = '';
                    })
                },
                //关闭
                togleEwm:function(){
                    this.display = 'none';
                },
            }
        })
    }
}