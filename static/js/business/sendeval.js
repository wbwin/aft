window.onload = function() {
    var shopData = JSON.parse(localStorage.getItem('shopData'));
    if (!shopData) {
        location.href = "/business/Login/index.html";
    } else {
        var app = new Vue({
            el: '.TheAllEvery',
            data: {
                imgBox: [],
                imgFile: [], // 全局变量 图片路径
                appId: '',
            },
            created: function () {
                var that = this;
                var url = location.search;
                var pid = url.substr(1);
                pid = pid.replace('appId=', '')

                that.appId = pid;
            },
            methods: {
                texTaInput: function () {
                    var dayDap = $("#texTa").val(); // 获取值
                    if (dayDap.length > 300) {
                        $("#texTa").css('border', '1px solid red');
                        $("#texTa").val($("#texTa").val().substring(0, 300));
                    } else {
                        $("#texTa").css('border', '1px solid #d2d2d2');
                        $("#texTa").val($("#texTa").val().substring(0, 300));
                    }
                    len = $('#texTa[name=oker]').val().length;
                    $("#Nunbtn").text(len);

                },
                xcsDikClick: function () { // 点击 【+】
                    $("#inpfile").click();

                },
                getImg: function (obj) {
                    // 当 上传文件发生改变时
                    var imgBox = this.imgBox;
                    var imgFile = this.imgFile;
                    var fileList = obj.target.files; //获取地址
                    imgFile.push(fileList[0])
                    var imgUrl = window.URL.createObjectURL(fileList[0]); // 图片 转换路径
                    imgBox.push(imgUrl);
                    var imgHtml = ''
                    var len = imgBox.length; // 定义一个变量
                    if (len > 9) { // 判断 大于9张 时候 删除第一张
                        imgBox.splice(0, 1) // 判断 大于9张 时候 删除第一张
                    }
                    for (var i = 0; i < imgBox.length; i++) {
                        var val = " <img class='imgs' style='margin-right: 5px' src=" + imgBox[i] + " height='70' width='70'>"
                        imgHtml = imgHtml + val
                    }
                    $("#numberimgert").html(imgBox.length); //  获取图片的长度  把 长度的值 传入 上传图片的个数
                    $('.imhon').html(imgHtml); // 把图传入 class 为  imhon 的DIV 中
                },
                NogbackClick: function () { // 点击 【取消并返回】 【弹出影藏框】
                    $(".csekjHoio").show();

                },
                cselkClick: function () { // 点击 【取消并返回】 【错号】
                    $(".csekjHoio").hide();

                },
                quxuaClick: function () { // 点击 【取消并返回】 【取消】
                    $(".csekjHoio").hide();

                },
                jixuClick: function () { //  点击 【取消并返回】  【继续推出】
                    history.back(); // 跳转回到上一页

                },
                OhjubaoClick: function () {
                    var that = this;
                    //  点击 【举报评价】
                    if ($("input[name='pre-status']:checked").val()) // 判断  【input】  有选中的
                    {
                        var fusdend = $("#texTa").val(); // 获取  textarea 中的 值
                        if (fusdend == '') // 如果 textarea值  为空
                        {
                            $(".jihuws_wj").show();
                            $("#cont\\.info").html("请详细描述问题，最少输入10字!!!");
                            setTimeout(function () {
                                $(".jihuws_wj").hide();
                            }, 2000);
                        } else { // 如果 textarea值  不为空
                            var approve = $("input[name='pre-status']:checked").val(); //  获取 选中 的 VAL
                            var fusdend = $("#texTa").val(); // 获取  textarea 中的内容
                            var Umage = that.imgBox; //  获取 所有的 图片
                            var pid = that.appId;

                            var that = this;
                            var  imgFile = that.imgFile;
                            axios({
                                method: "post",
                                url: 'https://www.aftdc.com/Business/GoodsAppraises/report',
                                data: {
                                    content: fusdend,
                                    reason: approve,
                                    pid: pid,
                                    token:shopData.token,
                                },
                            }).then(function (res) {
                                if(res.data.res == -1){
                                    alert(res.data.reason)
                                    localStorage.removeItem('shopData');
                                    location.href="/business/Login/index.html";
                                }


                                if (res.data.res == 1) {
                                    this.imgFile = $("#inpfile")[0].files;
                                    var imgFile = this.imgFile
                                    var houzui = imgFile[0].name.split(".")[1]
                                    var reportId = res.data.reportId;

                                    var file = imgFile[0]

                                    axios({
                                        method: "post",
                                        url: "https://www.aftdc.com/Business/Goodsappraises/reportImg1",
                                        data: {
                                            houzui: houzui,
                                            token:shopData.token,
                                        },
                                    }).then(function (res) {
                                        if(res.data.res == -1){
                                            alert(res.data.reason)
                                            localStorage.removeItem('shopData');
                                            location.href="/business/Login/index.html";
                                        }
                                        var imgurl = res.data.imgName//图片的路径
                                        // console.log(imgurl);
                                        var formData = new FormData();
                                        formData.append("key", res.data.dir + '/' + res.data.imgName);
                                        formData.append("policy", res.data.policy);
                                        formData.append("OSSAccessKeyId", res.data.accessid);
                                        formData.append("success_action_status", '200');
                                        formData.append("signature", res.data.signature);
                                        formData.append("file", file);
                                        formData.append("token", shopData.token);
                                        axios({
                                            method: "post",
                                            url: res.data.host,
                                            data: formData,
                                            processData: false,
                                            contentType: false,
                                        }).then(function (res) {
                                            if(res.data.res == -1){
                                                alert(res.data.reason)
                                                localStorage.removeItem('shopData');
                                                location.href="/business/Login/index.html";
                                            }
                                            axios({
                                                method: "post",
                                                url: "https://www.aftdc.com/Business/Goodsappraises/reportImg",
                                                data: {
                                                    imgName: imgurl,
                                                    reportId: reportId,
                                                    token:shopData.token,
                                                }
                                            }).then(function (res) {
                                                if(res.data.res == -1){
                                                    alert(res.data.reason)
                                                    localStorage.removeItem('shopData');
                                                    location.href="/business/Login/index.html";
                                                }

                                                if (res.data.res == 1) {
                                                    $(".jihuws_wj").show();
                                                    $("#cont\\.info").html("提交成功!!!");
                                                    setTimeout(function () {
                                                        $(".jihuws_wj").hide();
                                                    }, 2000);
                                                }
                                            })
                                        })
                                    })
                                    // if (Umage.length > 0) {
                                    //
                                    //     for (var i = 0; i < imgFile.length; i++) {
                                    //         //上传图片
                                    //         var formData = new FormData();
                                    //         formData.append("imgName", imgFile[i]);
                                    //         formData.append("reportId", res.data.reportId);
                                    //         axios({
                                    //             method: "post",
                                    //             url: 'https://www.aftdc.com/Business/Goodsappraises/reportImg',
                                    //
                                    //             data: formData,
                                    //             // 告诉jQuery不要去处理发送的数据
                                    //             processData: false,
                                    //             // 告诉jQuery不要去设置Content-Type请求头
                                    //             contentType: false,
                                    //         }).then(function(res) {
                                    //             console.log(res)
                                    //             if (i == Umage.length) {
                                    //                 //  后台 请求成功后 取消 下面注释
                                    //                 $(".jihuws_wj").show();
                                    //                 $("#cont\\.info").html("提交成功!!!");
                                    //                 setTimeout(function() {
                                    //                     $(".jihuws_wj").hide();
                                    //                 }, 2000);
                                    //             }
                                    //         })
                                    //
                                    //     }
                                    // } else {
                                    //     $(".jihuws_wj").show();
                                    //     $("#cont\\.info").html("举报失败或已举报过!!!");
                                    //     setTimeout(function() {
                                    //         $(".jihuws_wj").hide();
                                    //     }, 2000);
                                    // }
                                } else {
                                    if (res.data.res == 1) {
                                        //  后台 请求成功后 取消 下面注释
                                        $(".jihuws_wj").show();
                                        $("#cont\\.info").html("提交成功!!!");
                                        setTimeout(function () {
                                            $(".jihuws_wj").hide();
                                        }, 2000);
                                    } else {
                                        $(".jihuws_wj").show();
                                        $("#cont\\.info").html("举报失败或已举报过!!!");
                                        setTimeout(function () {
                                            $(".jihuws_wj").hide();
                                        }, 2000);
                                    }
                                }

                            })


                        }
                    } else { //  【input】  没有选中的
                        $(".jihuws_wj").show();
                        $("#cont\\.info").html("请选择恶意评价类型!!!");
                        setTimeout(function () {
                            $(".jihuws_wj").hide();
                        }, 2000);
                    }
                },
            }
        })
    }
}

/*************/

/**********/