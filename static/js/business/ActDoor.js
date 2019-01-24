//店铺经纬度

window.onload = function () {


    var shopData = JSON.parse(localStorage.getItem('shopData'));
    if (!shopData) {
        location.href = "/business/Login/index.html";
    } else {
        var door = new Vue({
            el: '.dec',
            data: {
                pages: 1,

                //--------------------------------------------------  商家管理规范   ------------------------------------------------
                scrolls: [],

                file: [],
                fileUrl: [],
                urlnei: '',
                shops: {},
                dataz: {},
                datazr: {},
                datazc: {},
                datazs: {},
                datazi: {},
                datazresult: {},
                datazl1: {},
                datazl: {},
                datazs2: {},
                datazs1: {},
                dataza: {},
                datazr2: {},
                count: 0,
                secondary:{},

            },
            created: function () {
                var that = this;
                // var ps = $('input[name=ps]').val();
                //
                // if (ps == 1) {
                //     $("#directory_content").fadeIn();
                //     var div = document.getElementById('directory');
                //     div.setAttribute("class", "switch-on");
                // } else {
                //     $("#directory_content").fadeOut();
                //     var div = document.getElementById('directory');
                //     $("#directory").click();
                //     div.setAttribute("class", "switch-off");
                //
                // }


                axios({
                    method: "post",
                    url: 'https://www.aftdc.com/business/Store/store_management',
                    data: {token: shopData.token},
                }).then(function (res) {

                    that.shops = res.data.data.shops;

                    that.dataz = res.data.data;
                    that.datazr = res.data.data.r1;
                    that.datazc = res.data.data.cui;
                    // that.datazs=res.data.data.secondary;
                    that.datazi = res.data.data.isdelivery;
                    that.datazresult = res.data.data.result;
                    that.datazl1 = res.data.data.list1;
                    that.datazl = res.data.data.list;
                    that.datazs2 = res.data.data.shopImg2;
                    that.datazs1 = res.data.data.shopImg1;
                    that.dataza = res.data.data.apply;
                    that.datazr2 = res.data.data.r2;
                    that.secondary=that.dataz.secondary
                    if (res.data.res == -1) {
                        alert(res.data.reason)
                        localStorage.removeItem('shopData');
                        location.href = "/business/Login/index.html";
                    }
                    if (that.shops.isTostore == 1) {
                        $(".Runger").css("float", "right");
                        $(".KounLouis").css({"background": "#06c1ae", "border": "1px solid #06c1ae"});
                    } else {
                        $(".Runger").css("float", "left");
                        $(".KounLouis").css({"background": "#fff", "border": "1px solid #bababa"});
                    }
                    if (that.datazi.isdelivery == 1) {
                        $(".Rungers").css("float", "right");
                        $(".isdeliverys").css({"background": "#06c1ae", "border": "1px solid #06c1ae"});
                    } else {
                        $(".Rungers").css("float", "left");
                        $(".isdeliverys").css({"background": "#fff", "border": "1px solid #bababa"});
                    }
                })

            },
            methods: {
                pageFn: function (index) {
                    var that = this
                    that.pages = index;
                    that.$nextTick(function () {
                        if (index == 2) {
                            this.mapBox();
                        } else if (index == 7) {
                            var len = that.scrolls.length;
                            if (len <= 0) { //第二次不查询
                                that.scrollTxt();
                            }

                        }

                    })
                    $("#yezz").hide();

                },
                //地图-------
                mapBox: function () {
                    var lat = $('input[name=lat]').val()
                    var lng = $('input[name=lng]').val()
                    var range = $('input[name=range]').val()
                    center = new qq.maps.LatLng(lat, lng);
                    map = new qq.maps.Map(
                        document.getElementById("overboh"), {
                            center: center,
                            zoom: 12,

                        }
                    );
                    marker = new qq.maps.Marker({
                        position: center,
                        map: map
                    });
                    //圆形区域覆盖物 radius 是圆形的半径，单位是“米
                    var cirle = new qq.maps.Circle({
                        center: center,
                        radius: range * 1000,
                        map: map,
                        strokeColor: "#06C1AE",
                    });
                },
                //--------------------------------------------------  商家管理规范   ------------------------------------------------
                scrollFn: function (index) {
                    var val = this.scrolls[index]
                    $('body').animate({scrollTop: val});
                },

                //滚动
                scrollTxt: function () {
                    var len = $('.hesrrt').length;
                    var scrolls = [];
                    for (var i = 0; i < len; i++) {
                        var tops = $('.hesrrt').eq(i).offset().top;
                        scrolls.push(tops)
                    }
                    this.scrolls = scrolls;


                },
                closeFn: function (index) {
                    // $(this).hide();     //this指的是span
                    // $(this).nextAll(".img22").hide();
                    // $(this).nextAll(".img11").show();
                    // if($('.imgbox1').length>1){

                    //  file.splice(index,1)
                    // $(this).parent().parent().remove();
                    // // }
                    var fileUrl = this.fileUrl
                    fileUrl = fileUrl.splice(index, 1);
                    this.$set(this.fileUrl, '', fileUrl);

                    var files = this.file;
                    files = files.splice(index, 1);
                    this.$set(this.file, '', files);

                },
                save: function () {
                    var that = this
                    var parterrn = /^1[34578]\d{9}$/;
                    var loginPwd = $('input[name=loginPwd]').val()
                    var shopTel = $('input[name=shopTel]').val()
                    var shopTel1 = $('input[name=shopTel1]').val()
                    var shopTel2 = $('input[name=shopTel2]').val()

                    if (!parterrn.test(shopTel)) {
                        alert('手机号码1错误')
                        return false;
                    }
                    if (shopTel1) {
                        if (!parterrn.test(shopTel1)) {
                            alert('手机号码2错误')
                            return false;
                        }
                    }
                    if (shopTel2) {
                        if (!parterrn.test(shopTel2)) {
                            alert('手机号码3错误')
                            return false;
                        }
                    }

                    var notice = $('textarea[name=notice]').val();
                    axios({
                        method: "post",
                        url: 'https://www.aftdc.com/business/Store/alter_view',
                        data: {
                            loginPwd: loginPwd,
                            shopTel: shopTel,
                            shopTel1: shopTel1,
                            shopTel2: shopTel2,
                            notice: notice,
                            token: shopData.token
                        },
                    }).then(function (res) {

                        if (res.data.res == 0) {
                            if (that.count == 1) {
                                that.saveAxios();
                            } else {
                                alert('更换失败！')
                                return false;
                            }

                        }
                        else if (res.data.res == -1) {
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href = "/business/Login/index.html";
                        }
                        else if (res.data.res == -3) {
                            alert('没有数据！')
                            return false;
                        }
                        else if (res.data.res == -2) {
                            alert('密码错误！')
                            return false;
                        } else if (res.data.res == 1) {
                            if (that.count == 1) {

                                that.saveAxios();
                            } else {
                                alert('数据更换成功！');
                                location.reload();
                            }


                            // var data = new FormData();
                            // //为FormData对象添加数据
                            // $.each($('#cdefunck')[0].files, function(i, file) {
                            //     data.append('upload_file' + i, file);
                            // });
                            // //发送数据
                            // axios({
                            //     method: "post",
                            //     url: 'https://www.aftdc.com/business/Store/upload',
                            //     /*去过那个php文件*/
                            //
                            //     data: data,
                            //     cache: false,
                            //     contentType: false,
                            //     /*不可缺*/
                            //     processData: false,
                            //     /*不可缺*/
                            // }).then(function(data) {
                            //     data = $(data).html(); /*转格式*/
                            //     console.log(data);
                            //     //第一个feedback数据直接append，其他的用before第1个（ .eq(0).before() ）放至最前面。
                            //     //data.replace(/&lt;/g,'<').replace(/&gt;/g,'>') 转换html标签，否则图片无法显示。
                            //     if ($("#feedback").children('img').length == 0) {
                            //         $("#feedback").append(data.replace(/&lt;/g, '<').replace(/&gt;/g, '>'));
                            //     } else {
                            //         $("#feedback").children('img').eq(0).before(data.replace(/&lt;/g, '<').replace(/&gt;/g, '>'));
                            //     }
                            // })
                            //
                            // alert('更换成功！')
                            // location.reload();
                        }
                    })

                },
                saveAxios: function () {
                    var that = this;
                    var imgFile = that.imgFile
                    var houzui = imgFile[0].name.split(".")[1]

                    var file = imgFile[0]

                    axios({
                        method: "post",
                        url: "https://www.aftdc.com/business/Store/suffix",
                        data: {
                            suffix: houzui,
                            token: shopData.token
                        },
                    }).then(function (res) {
                        if (res.data.res == -1) {
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href = "/business/Login/index.html";
                        }

                        var imgurl = res.data.oss.dir + '/' + res.data.imgName//图片的路径
                        // console.log(imgurl);
                        var formData = new FormData();
                        formData.append("key", imgurl);
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
                            token: shopData.token
                        }).then(function (res) {

                            axios({
                                method: "post",
                                url: "https://www.aftdc.com/business/Store/img",
                                data: {
                                    shopImg: imgurl,
                                    token: shopData.token
                                }
                            }).then(function (res) {
                                if (res.data.res == 1) {
                                    alert('图片已修改！');
                                    location.reload();
                                }
                                else if (res.data.res == -1) {
                                    alert(res.data.reason)
                                    localStorage.removeItem('shopData');
                                    location.href = "/business/Login/index.html";
                                }

                            })
                        })
                    })
                },
                cdefunckChange: function (e) {
                    var that = this;
                    var fil = e.currentTarget.files;
                    that.imgFile = fil;
                    var urlnei = this.urlnei;
                    for (var i = 0; i < fil.length; i++) {
                        var reader = new FileReader();
                        reader.readAsDataURL(fil[i]);
                        reader.onload = function () {
                            document.getElementById("cvdkjv").innerHTML = "<img class='cdsac' src='" + reader.result + "'>";
                            urlnei = reader.result
                            $(".ben_tup").hide();
                            $(".shanmwango").show();
                            var xwlujin = $(".cdsac").attr("src");
                            $('.eskoo_ckc img').attr('src', xwlujin);
                            // console.log('123132131');
                        };
                    }
                },
                scw_suClick: function () {
                    // 点击上传图片【绿色 选择图片】
                    $("#cdefunck").click();
                },
                qu_wshClick: function () {
                    // 点击 使用 预览图旁边的【取消】
                    $(".shanmwango").hide();
                    $(".ben_tup").show();
                },
                KounLouisClick: function () {
                    var that = this;
                    $('input[name=isTostore]').click();
                    if ($(".Runger").css("float") == "left") {
                        $(".Runger").css("float", "right");
                        $(".KounLouis").css({"background": "#06c1ae", "border": "1px solid #06c1ae"});
                        that.shops.isTostore = 1;
                    } else {
                        $(".Runger").css("float", "left");
                        $(".KounLouis").css({"background": "#fff", "border": "1px solid #bababa"});
                        that.shops.isTostore = 0;
                    }
                },
                isdeliveryClick: function () {
                    var that = this;
                    $('input[name=isdelivery]').click();
                    if ($(".Rungers").css("float") == "left") {
                        $(".Rungers").css("float", "right");
                        $(".isdeliverys").css({"background": "#06c1ae", "border": "1px solid #06c1ae"});
                        that.datazi.isdelivery = 1;
                    } else {
                        $(".Rungers").css("float", "left");
                        $(".isdeliverys").css({"background": "#fff", "border": "1px solid #bababa"});
                        that.datazi.isdelivery = 0;
                    }
                },
                chh_hClick: function () {
                    $(".all_hetongxiazai").hide();
                    $(".ewjkdh").show();
                    $(".tio_bu").hide();
                },
                fasn_jhijClick: function () {
                    $(".ewjkdh").hide();
                    $(".all_hetongxiazai").show();
                    $(".tio_bu").show();
                },
                ufileChange: function (event) {
                    // alert(123)
                    var that = this
                    var target = event.target
                    var fil = target.files[0];
                    // console.log(door)
                    door.file.push(fil)

                    //file.push(fil)//保存图片资源

                    var reader = new FileReader();
                    reader.readAsDataURL(fil);
                    reader.onload = function () {
                        var url = reader.result;
                        door.fileUrl.push(url)
                        door.$nextTick(function () {
                            var len = $('.leison').length;


                            if (len > 5) { // 判断 大于4张 时候 删除第一张
                                $(".leison").first().find(".close1").click();
                            }
                        })
                    };
                },
                savereClick: function () {
                    var that = this
                    var shipin = $(".Xtextera").val();
                    var houtang = $(".XtexteraS").val();
                    // var formdata = new FormData();
                    // var file = door.file
                    // for (var i = 0; i < file.length; i++) {
                    //     formdata.append("file[]", file[i]); //图片路径
                    // }
                    /* var len=file.length;
                     if (len>5) {
                         file.splice(0,1);
                     }*/
                    axios({
                        method: "post",
                        url: 'https://www.aftdc.com/business/Store/alter_join',
                        data: {
                            zhibo: houtang,
                            video: shipin,
                            token: shopData.token
                        },
                    }).then(function (res) {

                        if (res.data.res == 1) {


                            for (var i = 0; i < that.file.length; i++) {
                                var houzui = that.file[i].name.split(".")[1]

                                var file = that.file[i]

                                that.axiosFn(file, houzui)
                            }
                            alert('已保存');

                        } else if (res.data.res == -1) {
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href = "/business/Login/index.html";
                        }
                        else {
                            alert('更换失败！');
                            return false;
                        }
                    })

                },
                axiosFn: function (file, houzui) {
                    axios({
                        method: "post",
                        url: 'https://www.aftdc.com/business/Store/upload_token',
                        data: {
                            houzui: houzui,
                            token: shopData.token
                        },

                    }).then(function (res) {


                        var imgurl = res.data.imgName//图片的路径
                        // console.log(imgurl);
                        var formData = new FormData();
                        formData.append("key", res.data.dir + '/' + res.data.imgName);
                        formData.append("policy", res.data.policy);
                        formData.append("OSSAccessKeyId", res.data.accessid);
                        formData.append("success_action_status", '200');
                        formData.append("signature", res.data.signature);
                        formData.append("file", file);
                        if (res.data.res == -1) {
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href = "/business/Login/index.html";
                        }


                        axios({
                            method: "post",
                            url: res.data.host,
                            data: formData,
                            processData: false,
                            contentType: false,
                            token: shopData.token
                        }).then(function (res) {

                            axios({
                                method: "post",
                                url: "https://www.aftdc.com/business/Store/upload",
                                data: {
                                    imgName: imgurl,
                                    token: shopData.token
                                }
                            }).then(function (res) {

                                if (res.data.res == 1) {

                                    window.location.reload();
                                } else if (res.data.res == -1) {
                                    alert(res.data.reason)
                                    localStorage.removeItem('shopData');
                                    location.href = "/business/Login/index.html";
                                }

                            })
                        })
                    })
                },
                closeFnend: function (that, id) {

                    var target = that.target
                    if (confirm('确定是否撤销该图片')) {
                        $(target).hide(); //this指的是span
                        $(target).nextAll(".img22").hide();
                        $(target).nextAll(".img11").show();
                        if ($('.imgbox1').length > 1) {
                            $(target).parent().parent().remove();
                            axios({
                                method: "post",
                                url: "https://www.aftdc.com/business/Store/delete_img",
                                data: {
                                    id: id,
                                    token: shopData.token
                                }
                            }).then(function (res) {
                                if (res.data.res == 1) {
                                    alert('删除成功!')
                                } else if (res.data.res == 0) {
                                    alert('删除失败!')
                                } else if (res.data.res == -5) {
                                    alert('没有上传图片ID!')
                                } else if (res.data.res == -1) {
                                    alert(res.data.reason)
                                    localStorage.removeItem('shopData');
                                    location.href = "/business/Login/index.html";
                                }
                            })

                        }
                    }
                },
                BaocunClick: function () {
                    var shopId = $('input[name=id]').val();
                    var isTostore = $('input[name=isTostore]').val(); //是否开启到店自取功能
                    console.log(isTostore);
                    var mealTime = $('input[name=mealTime]').val(); //备餐时间
                    if (mealTime > 30) {
                        alert('备餐时间不得大于30分钟，请重新设置！')
                        return false
                    }
                    ;

                    if (!/^[1-9]+[0-9]*$/.test(mealTime)) {
                        alert('请重新设置时间！')
                        return false
                    }
                    axios({
                        method: "post",
                        // url:'/Business/Act/setDaoDian',
                        url: 'https://www.aftdc.com/business/Store/self_store',
                        data: {

                            isTostore: isTostore,
                            mealTime: mealTime,
                            token: shopData.token

                        },
                    }).then(function (res) {


                        if (res.data.res == -2) {
                            alert('没有改变！')
                            return false;
                        }
                        if (res.data.res == -5) {
                            alert('没有数据！')
                            return false;
                        }
                        if (res.data.res == 1) {
                            alert('更换成功！')
                            window.location.reload();
                        }
                        else if (res.data.res == -1) {
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href = "/business/Login/index.html";
                        }
                        else {
                            alert('更换失败！')
                            return false;
                        }
                        ;

                    })

                },
                bao_cunClick: function () {
                    //  门店信息  【基本信息】【保存】
                    var dianpuphone = $(".inp_ut").val(); //  店铺电话
                    var dianpuggao = $(".xcsdll").val(); // 店铺公告

                    // 点击 【保存】【弹出框】
                    $(".bao_cunkuang").show();
                },
                bao_vfcunClick: function () {
                    // 点击 【营业设置】【保存】
                    $(".bao_fgrnkuang").show();
                    var StartTime = $("#select1  option:selected").text();
                    var time = $("#select2  option:selected").text();
                    var EndTime = $("#select3  option:selected").text();
                    var End = $("#select4  option:selected").text();
                    var start = StartTime + ":" + time;
                    var end = EndTime + ":" + End;

                    axios({
                        method: "post",
                        url: 'https://www.aftdc.com/business/Store/alter_time',
                        data: {
                            serviceStartTime: start,
                            serviceEndTime: end,
                            token: shopData.token

                        },
                    }).then(function (res) {

                        if (res.data.res == -5) {
                            alert('没有数据！');
                            return false;
                        }
                        if (res.data.res == -2) {
                            alert('数据不完整！');
                            return false;
                        }
                        if (res.data.res == -3) {
                            alert('没有更换！');
                            return false;
                        }
                        if (res.data.res == 1) {
                            alert('更换成功！');
                            window.location.reload();
                        }
                        else if (res.data.res == -1) {
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href = "/business/Login/index.html";
                        }
                        else {
                            alert('更换失败！');
                            return false;
                        }
                    })

                },
                //  上传图片完成之后的截取
                cdek_shiyClick: function () {
                    var that = this;
                    var ewfw = $(".eskoo_ckc img").attr("src");
                    $(".cckd img").attr('src', ewfw);
                    $(".me_dwjc").hide();
                    that.count = 1;
                },
                que_renlClick: function () { //  点击 【查看全部店铺分类】【弹出框】【保存】
                    var xejoi = $(".xia_lakuang").text(); //  获取弹出框 美食 中的内容
                    // $.ajax({
                    //       url:'', //    在后台 更具 美食中的值  去筛选
                    //       data:{xejoi:xejoi },
                    //       type:'post',
                    //       success:function(){

                    //       }
                    // });

                },
                xqwekcnoClick: function () { //  点击【查看全部店铺分类】
                    $(".chankan_alldenlei").show();

                },
                soan_yioClick: function () { //  点击【查看全部店铺分类】【错号】
                    $(".chankan_alldenlei").hide();

                },
                qu_xxiaoClick: function () { //  点击【查看全部店铺分类】【取消】
                    $(".chankan_alldenlei").hide();

                },
                xia_lakuangClick: function () { //  点击【快餐小吃】
                    $(".cwqeckn").show();


                },
                efvcwevClick: function () { // 点击【门店信息】【点击重新上传】
                    $(".me_dwjc").show();

                },
                ckjsaClick: function () { // 点击选择本地图片
                    $("#cdefunck").click();

                },
                si_chuanClick: function () { // 点击【本地上传】
                    $(".tu_kong").hide();
                    $(".ben_tup").show(); //  cfkwejhovhvhovhvvhsiuhvsvhsdviusdvsdhvhsvhsdjvsnhvjsvnsjds   $(".ben_tup").show();
                    $(".si_chuan").css({"border-bottom": "3px solid #06c1ae", "color": "#06c1ae"});

                },
                si_cuoClick: function () { // 点击【修改店铺头像】 【×】
                    $(".me_dwjc").hide();

                },
                guan_biClick: function () { // 点击【修改店铺头像】 【返回】
                    $(".me_dwjc").hide();

                },
                xiugaiClick: function () { // 点击 修改
                    var phpjho = $("#huopohon").text(); // 获取手机
                    var phpjho1 = $('#huopohon1').text();
                    var phpjho2 = $('#huopohon2').text();

                    $(".inp_ut").val(phpjho);
                    $(".inp_ut1").val(phpjho1);
                    $(".inp_ut2").val(phpjho2);
                    var texto = $(".dvcwlk").text(); // 获取 文字
                    $(".xcsdll").text(texto);
                    // console.log(phpjho);
                    // console.log(texto);
                    $(".maskBox").hide() //遮罩层


                    $(".xiugai").hide();
                    $(".kejoce").show();
                    $(".efvcwev").css('display', 'inline-block');
                    $(".sdgvws").hide();
                    $(".dqweof").show(); //电话
                    $(".sebws").hide();
                    $(".ecdkneowq").show(); // 店铺公告：

                },
                cdwko_cuoClick: function () { // 点击 【保存】【错号】
                    $(".bao_cunkuang").hide();

                },
                q_xixaoClick: function () { // 点击 【保存】【取消】
                    $(".bao_cunkuang").hide();

                },
                sclooClick: function () { //   点击 【营业设置】【退出弹出框】【取消】
                    $(".cw_tuichu").hide();

                },
                cwck_oiClick: function () { //   点击 【营业设置】【退出弹出框】【错号】
                    $(".cw_tuichu").hide();


                },
                cweckClick: function () { //   点击 【营业设置】【退出弹出框】【确认】
                    $(".cw_tuichu").hide();
                    $(".msdpvsdf").hide();
                    $(".msdp").show();
                    $(".kejcdoce").hide();
                    $(".xicdsugai").show();

                },
                cwck_ocdsiClick: function () { //  点击[门店信息]【基本信息】【退出弹出框】【错】
                    $(".cw_tuidvfdchu").hide();

                },
                sc_looClick: function () { //  点击[门店信息]【基本信息】【退出弹出框】【取消】
                    $(".cw_tuidvfdchu").hide();

                },
                tui_chuClick: function () { //  点击[门店信息]【基本信息】【退出弹出框】【点击退出】
                    $(".cw_tuidvfdchu").show();

                },
                cw_eckClick: function () {
                    $(".cw_tuidvfdchu").hide();
                    $(".ecdkneowq").hide();
                    $(".xiugai").show();
                    $(".kejoce").hide();
                    $(".dqweof").hide();
                    $(".sdgvws").show();
                    $(".ckwejw").hide();
                    $(".sebws").show();
                    $(".efvcwev").css('display', 'none');
                },
                TiJiaoClick: function () {
                    // var switc=$("#directory_content").css();

                    var isdelivery = $('input[name=isdelivery]').val();
                    console.log(isdelivery);
                    var dlvS = $('input[name=dlvService]:checked').val();
                    var div = $('input[name=dlvServic]:checked').val();

                    if (isdelivery == 1) {
                        if (dlvS == undefined) {
                            var dlvService = div;
                        } else if (div == undefined) {
                            var dlvService = dlvS;
                        } else {
                            var dlvService = dlvS + ',' + div;
                        }
                        if (dlvService == undefined) {
                            alert('请选择一种配送方式');
                            return false;
                        }
                        var deliveryCostTime = $('input[name=deliveryCostTime]').val();
                        var deliveryStartMoney = $('input[name=deliveryStartMoney]').val();
                        // var boxFee=$('input[name=boxFee]').val();
                        var deliveryFreeMoney = $('input[name=deliveryFreeMoney]').val();
                        var ranges = $('input[name=ranges]').val();
                        var range = ranges * 1000;

                        var parterrn = /^[^.].*/; //
                        var parterr = /^[0-9]+[1-9]*$/;

                        if (!parterrn.test(ranges) || !parterrn.test(deliveryCostTime) || !parterrn.test(deliveryStartMoney) || !parterrn.test(deliveryFreeMoney)) {
                            alert('禁止不科学操作')
                            return false;
                        }
                        var pattern = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
                        if (!pattern.test(ranges) || !pattern.test(deliveryCostTime) || !pattern.test(deliveryStartMoney) || !pattern.test(deliveryFreeMoney)) {
                            alert("请输入正确!!!");
                            return false;
                        }
                        // if(!parterr.test(ranges) || !parterr.test(deliveryCostTime) || !parterr.test(deliveryStartMoney) || !parterr.test(boxFee) || !parterr.test(deliveryFreeMoney)){
                        //   alert('最少1元啦')
                        //   return false;
                        // }
                        if (!ranges || !deliveryCostTime || !deliveryStartMoney || !deliveryFreeMoney) {
                            alert("请添加完整")
                            return false;
                        }
                    } else {
                        var dlvService = '';
                        var range = '';
                        var deliveryCostTime = '';
                        var deliveryStartMoney = '';
                        var deliveryFreeMoney = '';

                    }
                    axios({
                        method: "post",
                        url: 'https://www.aftdc.com/business/Store/distribution',
                        data: {
                            isdelivery: isdelivery,
                            dlvService: dlvService,
                            range: range,
                            deliveryCostTime: deliveryCostTime,
                            deliveryStartMoney: deliveryStartMoney,
                            deliveryFreeMoney: deliveryFreeMoney,
                            token: shopData.token
                        },
                    }).then(function (res) {

                        if (res.data.res == -5) {
                            alert("没有数据！");
                            return false;
                        }
                        if (res.data.res == -2) {
                            alert("没有改变！");

                            return false;
                        }
                        if (res.data.res == 1) {
                            alert("更换成功！");
                            window.location.reload();
                        } else if (res.data.res == -1) {
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href = "/business/Login/index.html";
                        }
                        else {
                            alert("更换失败！");
                            return false;
                        }
                    })

                },

                ekf_ololClick: function () {
                    $(".lian_yuan").css('float', 'left');
                    $(".qie_huan").css('background', '##dddddd');
                    $(".vcjc_sdvw").hide();
                },
                cew_qknClick: function () { // 点击向右 弹出框的错号
                    $(".vcjc_sdvw").hide();

                },
                cewqlj_okkClick: function () { // 点击向右 弹出框的【取消】
                    $(".vcjc_sdvw").hide();

                },
                somer_lieClick: function () { // 点击 【【弹出协议框】
                    $(".sdcfkj").show();

                },
                dvwjkClick: function () { // 点击 【错号】【关闭协议框】
                    $(".sdcfkj").hide();

                },
                cwknClick: function () {
                    location.href = ''
                },
            },

        })

    }
}

// $(function () {
//
//     switchEvent("#directory", function () {
//         // alert(123)
//         $("#directory_content").fadeIn();
//     }, function () {
//         // alert(456)
//         $("#directory_content").fadeOut();
//     });
//     // if($('#directory').hasClass('.switch-on'))
// });
//------------------------------------- 到店自取  ---------------------------------------------------4

$(document).ready(function (e) {
    //设置最大值
    ScrollBar.maxValue = 30;
    //初始化
    ScrollBar.Initialize();
    //设置最大值
    ProgressBar.maxValue = 30;
    //设置当前刻度
    var index = 0;
    var mProgressTimer = setInterval(function () {
        index += 2;
        ProgressBar.SetValue(index);
    }, 100);
});
var ScrollBar = {
    value: 1,
    maxValue: 30,
    step: 1,
    currentX: 0,
    Initialize: function () {
        if (this.value > this.maxValue) {
            alert("给定当前值大于了最大值");
            return;
        }
        this.GetValue();
        $("#scroll_Track").css("width", this.currentX + 2 + "px");
        $("#scroll_Thumb").css("margin-left", this.currentX + "px");
        this.Value();

        $("#scrollBarTxt").html(ScrollBar.value + "/" + ScrollBar.maxValue);
    },
    Value: function () {
        var valite = false;
        var currentValue = 0

        $("#scroll_Thumb").mousedown(function () {
            valite = true;
            // $(document.body)
            $(".all_daodianziqu").mousemove(function (event) {
                if (valite == false) return;
                //  var changeX = event.clientX - ScrollBar.currentX;
                var changeX = event.clientX
                currentValue = changeX - ScrollBar.currentX - $("#Demo").offset().left + 5;


                $("#scroll_Thumb").css("margin-left", currentValue + "px");
                $("#scroll_Track").css("width", currentValue + 2 + "px");
                if ((currentValue + 25) >= $("#scrollBar").width()) {
                    $("#scroll_Thumb").css("margin-left", $("#scrollBar").width() - 25 + "px");
                    $("#scroll_Track").css("width", $("#scrollBar").width() + 2 + "px");
                    ScrollBar.value = ScrollBar.maxValue;
                } else if (currentValue <= 0) {
                    $("#scroll_Thumb").css("margin-left", "0px");
                    $("#scroll_Track").css("width", "0px");
                } else {
                    ScrollBar.value = Math.round(30 * (currentValue / $("#scrollBar").width()));

                }
                $("#scrollBarTxt").html(ScrollBar.value + "/" + ScrollBar.maxValue);
            });
        });
        // $(document.body)
        $(document.body).mouseup(function () {
            // var w=parseInt(currentValue*100) /parseInt($("#scrollBar").width())/100
            //   ScrollBar.value = Math.round(30 * w);

            ScrollBar.value = Math.round(30 * (currentValue / $("#scrollBar").width()));
            valite = false;
            if (ScrollBar.value >= ScrollBar.maxValue) ScrollBar.value = ScrollBar.maxValue;
            if (ScrollBar.value <= 0) ScrollBar.value = 0;
            $("#scrollBarTxt").html(ScrollBar.value + "/" + ScrollBar.maxValue);
        });
    },
    GetValue: function () {
        this.currentX = $("#scrollBar").width() * (this.value / this.maxValue);
    }
}
var ProgressBar = {
    maxValue: 100,
    value: 20,
    SetValue: function (aValue) {
        this.value = aValue;
        if (this.value >= this.maxValue) this.value = this.maxValue;
        if (this.value <= 0) this.value = 0;
        var mWidth = this.value / this.maxValue * $("#progressBar").width() + "px";
        $("#progressBar_Track").css("width", mWidth);
        $("#progressBarTxt").html(this.value + "/" + this.maxValue);
    }
}

//------------------------------------- 合同下载  ---------------------------------------------------

//------------------------------------- 商家管理规范  ---------------------------------------------------

// function kleft(obj) {
//     var kefy = $(obj).text();
//     //  $(".kai_left").html(kefy+'▼');
//     $("#kai_left").html(kefy);
//     console.log(kefy)
//     $(".kai_leftying").hide();
// }

// function kright(obj) {
//     var krig = $(obj).text();
//     //  $(".kai_right").html(krig+'▼');
//     $("#kai_right").html(krig);
//     $(".kai_rightying").hide();
// }
// function ondrag(pos, x) {
//     var bar = document.getElementById('bar');
//     var title = document.getElementById('title');
//     var step = bar.getElementsByTagName("DIV")[0];
//     step.style.width = Math.max(0, x) + 'px';
//     title.innerHTML = pos + '%';
// }


// function jleft(obj) {
//     var fefy = $(obj).text();
//     // $(".jie_left").html(fefy+'▼');
//     $("#jie_left").html(fefy);

//     $(".jie_leftying").hide();
// }

// function jright(obj) {
//     var dewm = $(obj).text();
//     // $(".jie_right").html(dewm+'▼');
//     $("#jie_right").html(dewm);
//     $(".jie_rightying").hide();
// }
// $(function() {
//     $(".jie_left").click(function() { // 点击

// kai_left 23
//         $(".jie_leftying").show(); // 显示 影藏框
//         var Ptxt = '' // 接收值
//         for (var i = 0; i < 24; i++) { // 循环 里面

// 的数字
//             var txt = "<div class='j_stime'

// onclick='jleft(this)'>" + i + "</div>";
//             Ptxt = Ptxt + txt // 没次加1
//         }
//         $(".jie_leftying").html(Ptxt); // chuaru
//     });

//     $(".jie_right").click(function() { // 点击

// jie_right 23
//         $(".jie_rightying").show(); // 显示 影藏框
//         var Htxt = '' // 接收值
//         for (var i = 0; i < 60; i += 5) { // 循环 里

// 面的数字
//             var txt = "<div class='j_jiawu'

// onclick='jright(this)'>" + i + "</div>";
//             Htxt = Htxt + txt // 没次加1
//         }
//         $(".jie_rightying").html(Htxt); // chuaru
//     });

// });
// function Meishi(obj) { //  点击美食中的下拉框
//     var zhi = $(obj).text();
//     $(".xia_lakuang").text(zhi + '▼');
//     $(".cwqeckn").hide();
//     $(".xia_lakuang").css({ "background": "",

// "color": "#06c1ae" });
// }
// $(".xicdsugai").click(function() { // 点击 【营业设置

// 】【修改】
//         $(".kejcdoce").show();
//         $(".xicdsugai").hide();
//         $(".msdp").hide();
//         $(".msdpvsdf").show();
//     });
// $(".cdko_cuo").click(function() { // 点击 【营业设置

// 】【保存弹出框】【错号】
//         $(".bao_fgrnkuang").hide();
//     });
//     $(".qsd_xixao").click(function() { // 点击 【营

// 业设置】【保存弹出框】【取消】
//         $(".bao_fgrnkuang").hide();
//     });
// $(".tui_vfchu").click(function() { //   点击 【营业设

// 置】【退出弹出框】
//         $(".cw_tuichu").show();
//     });
// $(".xiuhgo").click(function() {
//         $(".xiuhgo").hide();
//         $(".cmodvcws").show();
//         //    var Ovid=document.getElementById

// ('scroll_Thumb');
//         //    Ovid.ondragstart = function() {
//         //        return false;
//         //    };
//     });
//     $(".dcmwo_qu").click(function() {
//         $(".xiuhgo").show();
//         $(".cmodvcws").hide();
//     });


//     $(".qie_huan").click(function() {
//         if ($(".lian_yuan").css("float") == "left")

// {
//             $(".lian_yuan").css('float', 'right');
//             $(".qie_huan").css('background',

// '#06c1ae');
//         } else {
//             $(".vcjc_sdvw").show();
//         }
//     });
// //------------------------------------- 营业资质

// ---------------------------------------------------5

// var url = ''
// $(document).ready(function() { //   111111111111
//     $("#inputs").change(function() {
//         var fil = this.files;

//         for (var i = 0; i < fil.length; i++) {
//             readso(fil[i]);
//         }
//     });
// });

// function readso(fil) {
//     var reader = new FileReader();
//     reader.readAsDataURL(fil);
//     reader.onload = function() {
//         document.getElementById("cweowjh").innerHTML

// = "<img class='sllo'

// style='width:200px;height:150px;' src='" +

// reader.result + "'>";
//         url = reader.result

//         console.log('123132131');
//     };
// }

// $(function() {
//     $(".dekol_kko").click(function() { //  点击 营业

// 执照【保存】点击 营业执照【保存】点击 营业执照【保存】
//         var Umage = $(".sllo")[0].src; // 获取到图片

// 的路径
//         var Usder = $("#minchen").val(); // 获取 【

// 名称】
//         var Faren = $("#faren").val(); // 获取 法人
//         var Zcenu = $("#zhucenum").val(); // 获取注

// 册号
//         var Dearr = $("#dizhi").val(); // 获取 地址
//         var Fawei = $("#fanwei").val(); // 获取范围
//         var Youxo = $("input

// [name='rd']:checked").val(); // 选择 有效期的值
//         // $.ajax({
//         //      url:'', // 后台 请求路径
//         //      data:{

// Umage:Umage,Usder:Usder,Faren:Faren,Zcenu:Zcenu,Dear

// r:Dearr,Fawei:Fawei,Youxo:Youxo},
//         //      type:'post',
//         //      success:function(){

//         //      }
//         // });

//     });
// });


// var urlone = ''
// $(document).ready(function() {
//     $("#inputser").change(function() {
//         var fil = this.files;

//         for (var i = 0; i < fil.length; i++) {
//             readsw(fil[i]);
//         }
//     });
// });

// function readsw(fil) {
//     var reader = new FileReader();
//     reader.readAsDataURL(fil);
//     reader.onload = function() {
//         document.getElementById("cccsdc").innerHTML

// = "<img class='svfrlo'

// style='width:200px;height:150px;' src='" +

// reader.result + "'>";
//         urlone = reader.result
//         // console.log(url);
//     };
// }


// $(function() {
//     $(".dekol_kcdsko").click(function() { //  点击【

// 餐饮可证类】【保存】
//         var Isage = $(".svfrlo")[0].src; // 获取到图

// 片的路径
//         var Leixin = $(".wecdsa_yiqi").val(); //  获

// 取许可证类型
//         var Banhao = $("#zhennum").val(); //  获取许

// 可证【编号】
//         var Xcejou = $("input

// [name='pdc']:checked").val(); // 获取 长期 或者 定期
//         var Thtime = $("#Gdata").val(); // 获取 截至

// 日期
//         var Dizhio = $("#aderrz").val(); // 获取 地

// 址
//         // $.ajax({
//         //     url:'',  //
//         //     data:{

// Leixin:Leixin,Banhao:Banhao,Xcejou:Xcejou,Thtime:Tht

// ime,Dizhio:Dizhio },
//         //     type:'post',
//         //     success:function(){

//         //     }
//         // });
//     });
// });

// function Phow(obj) {
//     var zhu = $(obj).text();
//     $("#txleixin").val(zhu);
//     $(".cecfweoi_esijc").hide();
// }
// $(function() {
//     $("#txleixin").click(function() { //
//         $(".cecfweoi_esijc").show();
//     });


//     var urltwo = ''
//     $(document).ready(function() {
//         $("#inputsan").change(function() {
//             var fil = this.files;

//             for (var i = 0; i < fil.length; i++) {
//                 readsr(fil[i]);
//             }
//         });
//     });

//     function readsr(fil) {
//         var reader = new FileReader();
//         reader.readAsDataURL(fil);
//         reader.onload = function() {
//             document.getElementById

// ("sdvsdv").innerHTML = "<img class='spanimg'

// style='width:200px;height:150px;' src='" +

// reader.result + "'>";
//             urltwo = reader.result
//             // console.log(url);
//         };
//     }

//     $(".tec_cen").click(function() { //  点击 【特许

// 证件】【保存】【影藏框中的 确定 】
//         var Siage = $(".spanimg")[0].src; // 获取到

// 图片的路径
//         var Txzjlx = $("#txleixin").val(); // 获取

// 特许证件类型
//         var Txzchao = $("#zhuhaom").val(); // 获取

// 特许证件注册号
//         var Tdizhio = $("#cedcdsa").val(); // 获取

// 地址
//         var Tdfjou = $("input

// [name='fv']:checked").val(); // 获取 长期 或者 定期
//         $.ajax({
//             url: '',
//             data: { Txzjlx: Txzjlx, Txzchao:

// Txzchao, Tdizhio: Tdizhio, Tdfjou: Tdfjou },
//             type: 'post',
//             success: function() {

//             }
//         });
//     });


// });


// var urlsi = ''
// $(document).ready(function() {
//     $("#inputsi").change(function() {
//         var fil = this.files;

//         for (var i = 0; i < fil.length; i++) {
//             readsrp(fil[i]);
//         }
//     });
// });

// function readsrp(fil) {
//     var reader = new FileReader();
//     reader.readAsDataURL(fil);
//     reader.onload = function() {
//         document.getElementById("sizai").innerHTML =

// "<img class='siimg' src='" + reader.result + "'>";
//         urlsi = reader.result
//         // console.log(url);
//     };
// }
// /***************************************************

// *************************/
// var urlwu = ''
// $(document).ready(function() {
//     $("#inputwu").change(function() {
//         var fil = this.files;

//         for (var i = 0; i < fil.length; i++) {
//             readswu(fil[i]);
//         }
//     });
// });

// function readswu(fil) {
//     var reader = new FileReader();
//     reader.readAsDataURL(fil);
//     reader.onload = function() {
//         document.getElementById("wuzai").innerHTML =

// "<img class='wuimg' src='" + reader.result + "'>";
//         urlwu = reader.result
//         // console.log(url);
//     };
// }

// $(function() {
//     $(".dekojdsko").click(function() { //  点击 【个

// 人证件】【弹出框】【保存】
//         var Simge = $(".siimg")[0].src; // 获取到图

// 片的路径   44444444
//         var Wumge = $(".wuimg")[0].src; // 获取到图

// 片的路径   55555555
//         var Zjianx = $("#madebi_bi").val(); // 获取

// 证件类型
//         var Cfelkd = $("#cvmp").val(); // 获取 姓名
//         var Deooed = $("#scjop").val(); // 获取  个

// 人证件号
//         // $.ajax({
//         //     url:({
//         //          url:'',  // 请求路径
//         //          data:{},
//         //          type:'post',
//         //          success:function(){

//         //          }
//         //     });
//         // });


//     });
// });


// function zheng(obj) {
//     var zhis = $(obj).text();
//     $("#onelon").val(zhis);
//     $(".ejek").hide();
// }

// function win(obj) {
//     var decf = $(obj).text();
//     $("#madebi_bi").val(decf);
//     $(".ijsd_jjkkdc").hide();
// }

// $(function() {


//     $(".wea_yiqi").focus(function() { // 获取焦点弹出
//         $(".ejek").show();
//     });
//     $("#madebi_bi").focus(function() { // 获取焦点弹

// 出
//         $(".ijsd_jjkkdc").show();
//     });


//     $(".dsaj_kkia").click(function() { // 点击上传若
//         $(".ekk_jkjiju").click();
//     });
//     $(".disao_so").click(function() { //  点击【营业

// 执照】 【编辑】
//         $(".disao_so").hide();
//         $(".tipoc").show();
//         $(".dsaj_kkia").show();
//         $(".ck_kkjo").show();
//         $(".weare_yiqi").show();
//     });
//     $(".dekol_kko").click(function() { // 点击【营业

// 执照】【保存】
//         $(".wejpo_ke").show();
//     });
//     $(".xiol_xai").click(function() { // 点击【营业执

// 照】【保存弹出框】【取消】
//         $(".wejpo_ke").hide();
//     });

//     $(".dekol_ooj").click(function() { //  点击【营

// 业执照】 【退出】
//         $(".wejpo_kcse").show();
//     });
//     $(".x_cvi").click(function() { //  点击【营业执照

// 】 【退出】[取消]
//         $(".wejpo_kcse").hide();
//     });
//     $(".q_cen").click(function() { //  点击【营业执照

// 】 【退出】[取消]
//         window.location.reload(); //刷新当前页面.
//     });


//     $(".disao_sdaso").click(function() {
//         $(".wea_yiqione").css('border', '1px solid

// #ccc');
//         $(".cekon").show();
//         $("input[readonly='readonly']").removeProp

// ("readonly");
//         $(".disao_sdaso").hide();
//         $(".tipdsaoc").show();
//         $(".dsaj_dkkia").show();
//         $(".sdkl_ookj").show();
//         $(".wea_yiqi").css('border', '1px solid

// #ccc');

//         $(".wea_yiqi

// [readonly='readonly']").removeProp("readonly");
//     });
//     $(".dsaj_dkkia").click(function() { // 【餐饮许

// 可证】【点击上传图片】
//         $(".edkk_jkjiju").click();
//     });


//     $(".dekol_kcdsko").click(function() { // 【餐饮

// 许可证 】 【编辑保存 】
//         $(".wtioc_kcse").show();
//     });

//     $(".xd_cvi").click(function() { // 【餐饮许可证

// 】 【编辑保存 】[取消]
//         $(".wtioc_kcse").hide();
//     });


//     $(".dekol_sdvooj").click(function() { // 【餐饮

// 许可证 】 【编辑退出 】[弹出框]
//         $(".lvwj_kows").show();
//     });
//     $(".xdc_cvi").click(function() { // 【餐饮许可证

// 】 【编辑退出 】[弹出框取消]
//         $(".lvwj_kows").hide();
//     });


//     $(".disao_vfrso").click(function() { // 【特许证

// 件】 【编辑 】
//         $(".disao_vfrso").hide();
//         $(".tidfvpoc").show();
//         $(".dsajasdc_kkia").show();
//         $(".wecdsa_yiqi").show();
//         $(".ek_liu").show();
//     });

//     $(".dsajasdc_kkia").click(function() {
//         $(".ekk_jkju").click();
//     });

//     $(".dekol_dvkko").click(function() { // 【特许证

// 件】 【保存】
//         $(".texu_jkkw").show();
//     });
//     $(".tec_cvi").click(function() { //  【特许证件】

// 【保存】[取消]
//         $(".texu_jkkw").hide();
//     });

//     $(".dekol_dooj").click(function() { //  【特许证

// 件】 【退出】[弹出框 ]
//         $(".txu_jkkw").show();
//     });
//     $(".tec_fcvi").click(function() { //  【特许证件

// 】 【退出】[弹出框 ][取消]
//         $(".txu_jkkw").hide();
//     });


//     $(".disao_sdasyo").click(function() { //  【个人

// 证件】【编辑】
//         $(".disao_sdasyo").hide();
//         $(".tipd_saoc").show();
//         $(".chionx_img").show();
//         $(".chionxcde_img").show();
//         $(".wealla_yiqi").css('border', '1px solid

// #bababa');
//         $(".wealla_yiqi

// [readonly='readonly']").removeProp("readonly");
//     });
//     $(".chionxcde_img").click(function() {
//         $(".zui_hjidcsvcd").click();
//     });


//     $(".chionx_img").click(function() { // 重新上传

// 图片
//         $(".zui_hjidvcd").click();
//     });

//     $(".dekojdsko").click(function() { //  【个人证

// 件】【保存】
//         $(".geren_jkkw").show();
//     });
//     $(".geren_fcvi").click(function() { //  【个人证

// 件】【保存弹框】【取消】
//         $(".geren_jkkw").hide();
//     });
//     $(".dekolcvooj").click(function() { //  【个人证

// 件】【退出】
//         $(".tuichu_jkkw").show();
//     });
//     $(".tuichu_fcvi").click(function() { //  【个人

// 证件】【退出】
//         $(".tuichu_jkkw").hide();
//     });


// });

// function incom() {
//     $(".sklp_Hjk").show();
//     $(".eshdcJmo").show();
// }

// function outmon() {
//     $(".sklp_Hjk").hide();
//     $(".eshdcJmo").hide();
// }

// function Tin() {
//     $(".xcdkqHklxs").show();
//     $(".CaxsHiks").show();
// }

// function Tou() {
//     $(".xcdkqHklxs").hide();
//     $(".CaxsHiks").hide();
// }


// // function kleft(obj){
// //     var kefy=$(obj).text();
// //     $(".kai_left").html(kefy+'▼');
// //     $(".kai_leftying").hide();
// // }
// // function kright(obj){
// //     var krig=$(obj).text();
// //     $(".kai_right").html(krig+'▼');
// //     $(".kai_rightying").hide();
// // }

// $(function() {

//     $(".kai_left").click(function() { // 点击

// kai_left 23
//         $(".kai_leftying").show(); // 显示 影藏框
//         var sumTxt = '' // 接收值
//         for (var i = 0; i < 24; i++) { // 循环 里面

// 的数字
//             var txt = "<div class='k_stime'

// onclick='kleft(this)'>" + i + "</div>";
//             sumTxt = sumTxt + txt // 没次加1
//         }
//         $(".kai_leftying").html(sumTxt); // chuaru
//     });

//     $(".kai_right").click(function() { // 点击

// kai_right
//         $(".kai_rightying").show();
//         var OTxt = '' // 接收值
//         for (var i = 0; i < 60; i += 5) { // 循环 里

// 面的数字
//             var txt = "<div class='k_jiawu'

// onclick='kright(this)'>" + i + "</div>";
//             OTxt = OTxt + txt // 没次加5
//         }
//         $(".kai_rightying").html(OTxt); // chuaru
//     });

// });


// function over(obj) {
//     $(obj).find('div').show();
// }

// function out(obj) {
//     $(obj).find('div').hide();
// }


// function Wone() {
//     $(".Hvone").show();
//     $(".HvoneImg").show();
// }

// function Mone() {
//     $(".Hvone").hide();
//     $(".HvoneImg").hide();
// }

// function Wtwo() {
//     $(".Hvtwo").show();
//     $(".HvtwoImg").show();
// }

// function Mtwo() {
//     $(".Hvtwo").hide();
//     $(".HvtwoImg").hide();
// }

// function Wsan() {
//     $(".Hvsan").show();
//     $(".HvsanImg").show();
// }

// function Msan() {
//     $(".Hvsan").hide();
//     $(".HvsanImg").hide();
// }

// function Wfour() {
//     $(".Hvfour").show();
//     $(".HvfourImg").show();
// }

// function Mfour() {
//     $(".Hvfour").hide();
//     $(".HvfourImg").hide();
// }


/*----------------------
function drag(){

scale=function (btn,bar,title){
  this.btn=document.getElementById(btn);
  this.bar=document.getElementById(bar);
  this.title=document.getElementById(title);
  this.step=this.bar.getElementsByTagName("DIV")[0];
  this.init();
};
scale.prototype={
  init:function (){
    var f=this,g=document,b=window,m=Math;
    f.btn.onmousedown=function (e){
      var x=(e||b.event).clientX;
      var l=this.offsetLeft;
      var max=f.bar.offsetWidth-this.offsetWidth;
      g.onmousemove=function (e){
        var thisX=(e||b.event).clientX;
        var to=m.min(max,m.max(-2,l+(thisX-x)));
        f.btn.style.left=to+'px';
        f.ondrag(m.round(m.max(0,to/max)*100),to);
        b.getSelection ? b.getSelection().removeAllRanges() : g.selection.empty();
      };
      g.onmouseup=new Function('this.onmousemove=null');
    };

  },
  ondrag:function (pos,x){
    this.step.style.width=Math.max(0,x)+'px';
    this.title.innerHTML=pos+'%';
  }
}
new scale('btn','bar','title');

}
*/