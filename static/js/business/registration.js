window.onload = function() {
    var shopData = JSON.parse(localStorage.getItem('shopData'));
    if (!shopData) {
        location.href = "/business/Login/index.html";
    } else {
        var app = new Vue({
            el: '.dec',
            data: {
                maps: '', //地图选择的位置信息
                mapAddress: '', //地图选择点击确定的信息（提交的信息）
                existMap: true, //是否是第一次加载地图
                imgBoxss: [],
                imgFiless: [], // 全局变量 图片路径
                imgBox: [],
                imgFiles: [], // 全局变量 图片路径
                imgBoxs: [],

            },
            methods: {
                xcsDikClick: function () { // 点击 营业资质【+
                    $("#inpfile").click();
                },
                xcsDiksClick: function () { // 点击 身份证【+】
                    $("#inpfiles").click();
                },
                xcsDikssClick: function () { // 点击 身份证【+】
                    $("#inpfiless").click();
                },
                init: function () {
                    var maps = this.maps;
                    var existMap = this.existMap;
                    $(".containers").show();
                    // if(existMap){
                    //     existMap=false;
                    $(".containers").append("<div class='mapWord' ><span onclick='mapWord(0)' style='color:#A0A0A0;'>取消</span><span onclick='mapWord(1)'>确定</span></div><div class='mapContent'> <iframe id='mapPage' width='100%' height='100%' frameborder=0 src='https://apis.map.qq.com/tools/locpicker?search=1&type=1&key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77&referer=myapp'></iframe> </div>")
                    window.addEventListener('message', function (event) {
                        // 接收位置信息，用户选择确认位置点后选点组件会触发该事件，回传用户的位置信息
                        var loc = event.data;
                        //防止其他应用也会向该页面post信息，需判断module是否为'locationPicker'
                        if (loc && loc.module == 'locationPicker') {
                            console.log('location', loc);
                            maps = loc;
                        }
                    }, false)

                    // }
                },
                mapWordClick: function (index) {
                    var maps = this.maps;
                    var mapAddress = this.mapAddress;
                    if (index == 1) {
                        mapAddress = maps;
                        $(".adrs").val(mapAddress.poiaddress)
                    }
                    $(".containers").hide();
                    $(".containers").empty()
                },
                /*************店铺头像**************/
                getImgss: function () { // 当 上传文件发生改变时
                    var imgBoxss = this.imgBoxss;
                    var imgFiless = this.imgFiless;
                    var fileListss = $("#inpfiless").files; //获取地址
                    if ((($("#inpfiless").files[0].size).toFixed(2)) >= (2 * 1024 * 1024)) {

                        alert("请上传小于2M的图片");
                        return false;
                    }
                    imgFiless.push(fileListss[0])
                    var imgUrlss = window.URL.createObjectURL($("#inpfiless").files[0]); // 图片 转换路径
                    imgBoxss.push(imgUrlss);
                    var imgHtmlss = ''
                    var len = imgBoxss.length; // 定义一个变量
                    if (len > 1) { // 判断 大于3张 时候 删除第一张
                        imgBoxss.splice(0, 1) // 判断 大于9张 时候 删除第一张
                        imgFiless.splice(0, 1) // 判断 大于9张 时候 删除第一张
                    }
                    for (var i = 0; i < imgBoxss.length; i++) {
                        var valss = " <img class='imgess' style='margin-right: 5px' src=" + imgBoxss[i] + " height='70' width='70'>"
                        imgHtmlss = imgHtmlss + valss
                    }
                    $("#numberimgertss").html(imgBoxss.length); //  获取图片的长度  把 长度的值 传入 上传图片的个数
                    $('.imhonss').html(imgHtmlss); // 把图传入 class 为  imhon 的DIV 中

                },
                /*************身份证**************/
                getImg: function () { // 当 上传文件发生改变时
                    var imgBox = this.imgBox;
                    var fileList = $("#inpfile").files; //获取地址
                    if ((($("#inpfile").files[0].size).toFixed(2)) >= (2 * 1024 * 1024)) {

                        alert("请上传小于2M的图片");
                        return false;
                    }
                    imgFile.push(fileList[0])
                    var imgUrl = window.URL.createObjectURL($("#inpfile").files[0]); // 图片 转换路径
                    imgBox.push(imgUrl);
                    var imgHtml = ''
                    // var lennn=imgBox.length;  // 定义一个变量
                    if (imgBox.length > 3) { // 判断 大于3张 时候 删除第一张
                        imgFile.splice(0, 1) // 判断 大于9张 时候 删除第一张
                        imgBox.splice(0, 1) // 判断 大于9张 时候 删除第一张
                    }
                    for (var i = 0; i < imgBox.length; i++) {
                        var val = " <img class='imge' style='margin-right: 5px' src=" + imgBox[i] + " height='70' width='70'>"
                        imgHtml = imgHtml + val
                    }
                    $("#numberimgert").html(imgBox.length); //  获取图片的长度  把 长度的值 传入 上传图片的个数
                    $('.imhon').html(imgHtml); // 把图传入 class 为  imhon 的DIV 中

                },
                /*************营业执照**************/
                getImgs: function () {
                    // 当 上传文件发生改变时
                    var imgBoxs = this.imgBoxs;
                    var fileLists = $("#inpfiles").files; //获取地址
                    if ((($("#inpfiles").files[0].size).toFixed(2)) >= (2 * 1024 * 1024)) {

                        alert("请上传小于2M的图片");
                        return false;
                    }
                    imgFiles.push(fileLists[0])
                    var imgUrls = window.URL.createObjectURL($("#inpfiles").files[0]); // 图片 转换路径
                    imgBoxs.push(imgUrls);
                    var imgHtmls = ''
                    // var lenn=imgBoxs.length;  // 定义一个变量
                    if (imgBoxs.length > 3) { // 判断 大于3张 时候 删除第一张
                        imgFiles.splice(0, 1) // 判断 大于9张 时候 删除第一张
                        imgBoxs.splice(0, 1) // 判断 大于9张 时候 删除第一张
                    }
                    for (var i = 0; i < imgBoxs.length; i++) {
                        var vals = " <img class='imges' style='margin-right: 5px' src=" + imgBoxs[i] + " height='70' width='70'>"
                        imgHtmls = imgHtmls + vals
                    }
                    $("#numberimgerts").html(imgBoxs.length); //  获取图片的长度  把 长度的值 传入 上传图片的个数
                    $('.imhons').html(imgHtmls); // 把图传入 class 为  imhons 的DIV 中
                },
                TijiaoClick: function () {
                    /**点击 【提交】 【验证】**/
                        // var Scode=$('input[name="scode"]').val(); /** 获取输入验证码**/
                        // if(!Scode)
                        // {
                        //     $(".coke").css('border','1px solid red'); $(".imsh_cuo").show();
                        //     $(".ziticolor").css('color','red');
                        //     $("#confo\\.info").html("验证码不能为空!!!");
                        //     return false
                        // }
                    var phone = $('input[name=phone]').val();
                    axios({
                        methods: "post",
                        url: '/index.php/Business/Annex/ckCode', // 去后台验证 输入的验证码和发送的验证码是否一致
                        data: {
                            phone: phone,
                            token:shopData.token,
                        },
                    }).then(function (arr) {
                        if(res.data.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href="/business/Login/index.html";
                        }

                        if (arr != '') {
                            var mapAddress = this.mapAddress;
                            var shopName = $('input[name=shopName]').val();
                            var shopAddress = $('input[name=shopAddress]').val();
                            var userName = $('input[name=userName]').val();
                            var bankUserName = $('input[name=bankUserName]').val();
                            var bankNo = $('input[name=bankNo]').val();
                            if (!/^([1-9]{1})(\d{14}|\d{18})$/.test(bankNo)) {
                                alert('请输入正确的银行卡号');
                                return false;
                            }
                            var dlvServi = $('input[name=dlvServi]:checked').val(); //一张
                            var dlvServic = $('input[name=dlvServic]:checked').val(); //营业
                            var dlvService = $('input[name=dlvService]:checked').val(); //身份
                            var acreage = $('input[name=acreage]').val();
                            var weburl = $('input[name=weburl]').val();
                            var email = $('input[name=email]').val();
                            if (!/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(email)) {
                                alert('请输入正确的邮箱');
                                return false;
                            }
                            var select = $('#select').val();
                            var phon = $('input[name=phon]').val();
                            var province = $(".province").find("option:selected").html(); //省
                            var city = $(".city").find("option:selected").html(); //市
                            var area = $(".area").find("option:selected").html(); //区
                            var Umage = this.imgBox; //  获取 营业资质 所有的 图片
                            var Umages = this.imgBoxs; //  获取 身份证 所有的 图片
                            var Umagess = this.imgBoxss; //  获取 身份证 所有的 图片

                            if (!shopName || !shopAddress || !userName || !dlvService || !acreage || !email || !bankUserName || !bankNo || !dlvServic || !email || !dlvServi || !weburl) {
                                alert('请把信息填写完整！');
                                return false;
                            }
                            ;
                            if (Umagess.length < 1) {
                                alert('请上传店铺头像');
                                return false;
                            }
                            if (Umage.length < 3) {
                                alert('请上传身份证正反面');
                                return false;
                            }
                            if (Umages.length < 3) {
                                alert('请上传营业执照/餐饮许可证/特许证件');
                                return false;
                            }
                            if (select == -1) {
                                alert('请选择菜系！');
                                return false;
                            }
                            ;
                            axios({
                                methods: "post",
                                url: '/Business/Registered/addshop',
                                data: {
                                    province: province,
                                    city: city,
                                    area: area,
                                    lat: mapAddress.latlng.lat, //mapAddress是选择地图后存入的全局变量
                                    lng: mapAddress.latlng.lng,
                                    shopName: shopName,
                                    userName: userName,
                                    shopAddress: shopAddress,
                                    bankUserName: bankUserName,
                                    bankNo: bankNo,
                                    dlvServi: dlvServi,
                                    dlvServic: dlvServic,
                                    dlvService: dlvService,
                                    acreage: acreage,
                                    weburl: weburl,
                                    email: email,
                                    select: select,
                                    token:shopData.token,
                                },
                            }).then(function (res) {
                                if(res.data.res == -1){
                                    alert(res.data.reason)
                                    localStorage.removeItem('shopData');
                                    location.href="/business/Login/index.html";
                                }
                                if (res.res == 1) {
                                    // alert('申请成功，请到分店列表上传相关证书');
                                    // location.reload()
                                    //上传图片
                                    if (Umage.length > 0) {
                                        for (var i = 0; i < imgFile.length; i++) {
                                            //上传图片
                                            var formData = new FormData();
                                            formData.append("file", imgFile[i]);
                                            formData.append("token", shopData.token);

                                            axios({
                                                methods: "post",
                                                url: '/index.php/Business/Registered/reportImg?type=1',
                                                data: formData,
                                                // 告诉jQuery不要去处理发送的数据
                                                processData: false,
                                                // 告诉jQuery不要去设置Content-Type请求头
                                                contentType: false,
                                            }).then(function (responseStr) {
                                                if(res.data.res == -1){
                                                    alert(res.data.reason)
                                                    localStorage.removeItem('shopData');
                                                    location.href="/business/Login/index.html";
                                                }

                                            })

                                        }

                                    }
                                    if (Umages.length > 0) {
                                        var imgFiles = this.imgFiles;
                                        for (var i = 0; i < imgFiles.length; i++) {
                                            //上传图片
                                            var formData = new FormData();
                                            formData.append("file", imgFiles[i]);
                                            formData.append("token", shopData.token);
                                            axios({
                                                methods: "post",
                                                url: '/index.php/Business/Registered/reportImg?type=2',
                                                data: formData,
                                                // 告诉jQuery不要去处理发送的数据
                                                processData: false,
                                                // 告诉jQuery不要去设置Content-Type请求头
                                                contentType: false,
                                            }).then(function (responseStr) {
                                                if(res.data.res == -1){
                                                    alert(res.data.reason)
                                                    localStorage.removeItem('shopData');
                                                    location.href="/business/Login/index.html";
                                                }

                                            })

                                        }
                                    }
                                    if (Umagess.length > 0) {
                                        var imgFiless = this.imgFiless;

                                        for (var i = 0; i < imgFiless.length; i++) {
                                            //上传图片
                                            var formData = new FormData();
                                            formData.append("file", imgFiless[i]);
                                            formData.append("token", shopData.token);
                                            axios({
                                                methods: "post",
                                                url: '/index.php/Business/Registered/reportImg?type=3',
                                                data: formData,
                                                // 告诉jQuery不要去处理发送的数据
                                                processData: false,
                                                // 告诉jQuery不要去设置Content-Type请求头
                                                contentType: false,
                                            }).then(function (responseStr) {
                                                if(res.data.res == -1){
                                                    alert(res.data.reason)
                                                    localStorage.removeItem('shopData');
                                                    location.href="/business/Login/index.html";
                                                }
                                                if (i == Umagess.length) {
                                                    //  后台 请求成功后 取消 下面注释
                                                    $(".jihuws_wj").show();
                                                    $("#cont\\.info").html("申请成功，等待审核中！");
                                                    setTimeout(function () {
                                                        $(".jihuws_wj").hide();
                                                        location.href = "http://aftdc.com/index.php?m=Business&c=Registered&a=state&phone=" + phon;
                                                    }, 3000);
                                                }
                                            })

                                        }
                                    }
                                    alert('请稍等')
                                }
                            })

                        }
                        // else{
                        //     alert('验证码错误')
                        //     return
                        // }

                    })

                },
            }
        })
    }
}




// lat:mapAddress.latlng.lat,//mapAddress是选择地图后存入的全局变量
// lng:mapAddress.latlng.lng,
//

/**********/
/*************身份证**************/

/**********/
/*************营业执照**************/

/**********/

// $(".Tijiao").click(function() {});