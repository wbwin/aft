window.onload = function () {
    var shopData = JSON.parse(localStorage.getItem('shopData'));
    if (!shopData) {
        location.href = "/business/Login/index.html";
    } else {
        var app = new Vue({
            el: '.esfwefcw',
            data: {
                flag: {

                    "pasd": false, // 密码
                    "pasdd": false, // 再次输入密码
                    "Phone": false, // 手机号码
                    "vcode": false, // 手机验证码
                },
                secode: 90,
                dxtanzmage: '' //dxtanzmage短信验证码
            },
            methods: {
                ConDerInput: function () {
                    // 给一个 input 事件
                    var Phone = $("#ConDer").val(); // 获取 手机号码
                    var pattern = /^1[34578]\d{9}$/; // 手机号匹配 正则表达式
                    if (!pattern.test(Phone)) { //  手机号是否匹配正则
                        $('.HuoQu').attr('disabled', "true"); //添加disabled属性
                        $(".HuoQu").css({"background": "#bababa", "border": "1px solid #bababa"}); // [获取验证码] 添加背景
                    } else {
                        $('.HuoQu').removeAttr("disabled"); //移除disabled属性
                        $(".HuoQu").css({"background": "#06c1ae", "border": "1px solid #06c1ae"}); // [获取验证码] 添加背景
                    }
                },
                countdown: function () {
                    //   countdown  倒计时器
                    secode--;
                    $(".Times").text(secode + "秒");
                    if (secode < 0) {
                        clearInterval(time);
                        secode = 90;
                        $(".Times").text(secode + "秒");
                        $(".dianfa").show();
                        $(".Times").hide();
                    }
                },
                dianfaClick: function () {
                    // 点击【点击获取验证码】
                    // if(!flag.Phone==true){
                    //     alert('请重新检查手机号码!!!');
                    //     return false;
                    // }
                    var Phone = $('input[name="userPhone"]').val(); // 获取手机号
                    axios({
                        methods: "post",
                        // url:'https://www.aftdc.com/index.php/Wxapp/Msm/send', // 请求接口
                        url: "{:U('Verification')}", // 请求本地接口
                        data: {
                            phone: Phone,
                            token: shopData.token
                        },
                    }).then(function (arr) {
                        console.log(arr)
                        // if(arr){
                        if (arr.code == 1) {
                            dxtanzmage = arr
                            $(".dianfa").hide(); //  【影藏 获取验证码】
                            $(".Times").show(); //  【显示 60秒】
                            time = setInterval(countdown, 1000); // countdown  倒计时器
                            // console.log(ree);
                        } else if (res.data.res == -1) {
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href = "/business/Login/index.html";
                        }

                        else if (arr.res == 2) {
                            alert(arr.info)
                        } else {
                            alert(arr.info)
                        }
                    })

                },
                buttonClick: function () {
                    //  点击【注册】
                    //  if(!flag.Phone==true){
                    //     alert('请重新检查手机号码!!!');
                    //     return false;
                    // }
                    var Phone = $('input[name="userPhone"]').val(); //  获取 输入的【手机号】
                    var vcode = $('input[name="code"]').val(); //  获取 输入的【手机验证码】
                    if (Phone == '' || !/^1[34578]\d{9}$/.test(Phone)) {
                        return false;
                    }
                    if (vcode == '') {
                        // alert('验证码不能为空!!!');
                        return false;
                    }
                    axios({
                        methods: "post",
                        url: "{:U('inputCode')}", // 处理  验证码是否相等
                        data: {
                            code: vcode,
                            phone: Phone,
                            token: shopData.token
                        },
                    }).then(function (res) {
                        window.localStorage.removeItem("shopId");
                        window.localStorage.removeItem("ok");
                        // if(res){
                        if (res.code == 1) {
                            axios({
                                methods: "post",
                                url: "{:U('registerBusiness')}", //  处理添加注册
                                data: {
                                    phone: Phone,
                                    token: shopData.token
                                }, // 【账号】【密码】【手机号】
                            }).then(function (data) {
                                sessionStorage.setItem("phone", Phone);
                                if (dater.code == 1) {
                                    window.parent.location.hash = "#/Branch/open/1"
                                    location.href = "{:U('Business/Branch/openmage')}";
                                }
                                else if (res.data.res == -1) {
                                    alert(res.data.reason)
                                    localStorage.removeItem('shopData');
                                    location.href = "/business/Login/index.html";
                                }

                                else {
                                    alert(dater.info);
                                }
                            })

                            // }else if (res) {
                        }
                        else if (res.data.res == -1) {
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href = "/business/Login/index.html";
                        }

                        else if (res.code == 2) {
                            sessionStorage.setItem("shopId", res.shopId);
                            window.parent.location.hash = "#/Branch/wait/1"
                            location.href = "{:U('Business/Branch/wait')}"; //已注册
                        } else {
                            alert(res.info) //错误
                        }
                    })

                },
                inponeFocus: function () {
                    //账号获取焦点
                    $(".inpone").css('border', '1px solid green');
                    $(".pone").hide();
                    $("#one\\.info").html("");
                    return;
                },
                inponeBlur: function () {
                    var flag = this.flag;
                    var username = $('input[name="loginName"]').val();
                    if (username == "") {
                        $(".inpone").css('border', '1px solid red');
                        $(".pone").show();
                        $("#one\\.info").html("账号不能为空!!!");
                        return;
                    }
                    var parterrn = /^[A-Za-z0-9]{5,20}$/; // 账号 大小写 英文和数字
                    if (!parterrn.test(username)) {
                        $(".inpone").css('border', '1px solid red');
                        $(".pone").show();
                        $("#one\\.info").html("账号为大小写英文和数字!!!");
                        return;
                    } else {
                        $(".inpone").css('border', '1px solid green');
                        $(".pone").hide();
                        $("#one\\.info").html("");
                        flag.username = true;
                        return;
                    }
                },
                inptwoFocus: function () {
                    // [密码 获取事件]
                    $(".ptwo").hide();
                    $(".inptwo").css('border', '1px solid green');
                    $("#two\\.info").html("");
                    return;
                },
                inptwoBlur: function () {
                    var flag = this.flag;
                    var pasd = $('input[name="loginPwd"]').val();
                    if (pasd == "") {
                        $(".ptwo").show();
                        $(".inptwo").css('border', '1px solid red');
                        $("#two\\.info").html("密码不能为空!!!");
                        return;
                    }
                    var parrtern = /^[a-zA-Z][a-zA-Z0-9_]{5,15}$/;
                    if (!parrtern.test(pasd)) {
                        $(".ptwo").show();
                        $(".inptwo").css('border', '1px solid red');
                        $("#two\\.info").html("密码格式不对!!!");
                        return;
                    } else {
                        $(".ptwo").hide();
                        $(".inptwo").css('border', '1px solid green');
                        $("#two\\.info").html("");
                        flag.pasd = true;
                        return;
                    }
                },
                inptwoagenFocus: function () {
                    // 再次输入密码
                    $(".ptwoagen").hide();
                    $(".inptwoagen").css('border', '1px solid green');
                    $("#twoagen\\.info").html("");
                    return;
                },
                inptwoagenBlur: function () {
                    var flag = this.flag;
                    var pasdd = $(this).val();
                    if (pasdd == "") {
                        $(".ptwoagen").show();
                        $("#twoagen\\.info").html("密码不能为空");
                        $(".inptwoagen").css('border', '1px solid red');
                        return;
                    } else if (pasdd != $('input[name="loginPwd"]').val()) {
                        $(".ptwoagen").show();
                        $("#twoagen\\.info").html("两次密码不一致");
                        $(".inptwoagen").css('border', '1px solid red');
                        return;
                    } else {
                        $(".ptwoagen").hide();
                        $("#twoagen\\.info").html("");
                        $(".inptwoagen").css('border', '1px solid green');
                        flag.pasdd = true;
                        return;
                    }
                },
                inpfourFocus: function () {
                    $(".pfour").hide();
                    $(".inpfour").css('border', '1px solid green');
                    $("#four\\.info").html("");
                    return;
                },
                inpfourBlur: function () {
                    var flag = this.flag;
                    var Phone = $('input[name="userPhone"]').val();
                    if (Phone == "") {
                        $(".pfour").show();
                        $("#four\\.info").html("手机号不能为空!!!");
                        $(".inpfour").css('border', '1px solid green');
                        return;
                    }
                    var parrtern = /^(13[0-9]|17[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
                    if (!parrtern.test(Phone)) {
                        $(".pfour").show();
                        $("#four\\.info").html("手机号格式不正确!!!");
                        $(".inpfour").css('border', '1px solid green');
                        return;
                    } else {
                        $(".pfour").hide();
                        $("#four\\.info").html("");
                        $(".inpfour").css('border', '1px solid green');
                        flag.Phone = true;
                        return;
                    }
                },
                inpfiveFocus: function () {
                    // 验证码
                    $(".pfive").hide();
                    $("#five\\.info").html("");
                    $(".inpfive").css('border', '1px solid green');
                    return;
                },
                inpfiveBlur: function () {
                    var flag = this.flag;
                    var vcode = $('input[name="code"]').val();
                    if (vcode == "") {
                        $(".pfive").show();
                        $("#five\\.info").html("验证码不能为空");
                        $(".inpfive").css('border', '1px solid red');
                        return;
                    }
                    var parrtern = /[0-9]{4,6}/;
                    if (!parrtern.test(vcode)) {
                        $(".pfive").show();
                        $("#five\\.info").html("验证码最少为4位数");
                        $(".inpfive").css('border', '1px solid red');
                        return;
                    } else {
                        $(".pfive").hide();
                        $("#five\\.info").html("");
                        $(".inpfive").css('border', '1px solid green');
                        flag.vcode = true;
                        return;
                    }
                },
                inpthreeFocus: function () {
                    $(".pakerter").show(); // 关闭弹框选择时间
                },

            }
        })
    }
}
// function Show(obj) { //  选择区号
//         var zhi = $(obj).text(); // 获取当前的区号
//         $(".inpthree").val(zhi); // 将当前的数据传入
//         $(".pakerter").hide(); // 关闭弹框选择时间
//     }
// $(function(){
//     $(".xcsDik").click(function(){  // 点击 营业资质【+】
//         $("#inpfile").click();
//     });
// });
// $(function(){
//     $(".xcsDiks").click(function(){  // 点击 身份证【+】
//         $("#inpfiles").click();
//     });
// });
// $(function(){
//     $(".xcsDikss").click(function(){  // 点击 身份证【+】
//         $("#inpfiless").click();
//     });
// });
// var maps //地图选择的位置信息
// var mapAddress //地图选择点击确定的信息（提交的信息）
// var existMap=true //是否是第一次加载地图
// function init(){
//     $(".containers").show();
//     // if(existMap){
//     //     existMap=false;
//         $(".containers").append("<div class='mapWord' ><span onclick='mapWord(0)' style='color:#A0A0A0;'>取消</span><span onclick='mapWord(1)'>确定</span></div><div class='mapContent'> <iframe id='mapPage' width='100%' height='100%' frameborder=0 src='https://apis.map.qq.com/tools/locpicker?search=1&type=1&key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77&referer=myapp'></iframe> </div>")
//         window.addEventListener('message', function(event) {
//         // 接收位置信息，用户选择确认位置点后选点组件会触发该事件，回传用户的位置信息
//         var loc = event.data;
//         //防止其他应用也会向该页面post信息，需判断module是否为'locationPicker'
//         if (loc && loc.module == 'locationPicker') {
//             console.log('location', loc);
//             maps=loc;
//          }
// },false)

//     // }
// }


// function mapWord(index){
//     if(index==1){
//         mapAddress=maps;
//         $(".adrs").val(mapAddress.poiaddress)
//     }
//     $(".containers").hide();
//        $(".containers").empty()
// }
// // lat:mapAddress.latlng.lat,//mapAddress是选择地图后存入的全局变量
// // lng:mapAddress.latlng.lng,
// //
// /*************店铺头像**************/
// var imgBoxss=[];
// var imgFiless=[]// 全局变量 图片路径
// function getImgss(obj){  // 当 上传文件发生改变时
//     var fileListss = obj.files;//获取地址
//     if(((obj.files[0].size).toFixed(2))>=(2*1024*1024)){

//                   alert("请上传小于2M的图片");
//                   return false;
//              }
//     imgFiless.push(fileListss[0])
//     var imgUrlss = window.URL.createObjectURL(obj.files[0]); // 图片 转换路径
//     imgBoxss.push(imgUrlss);
//     var imgHtmlss=''
//     var len=imgBoxss.length;  // 定义一个变量
//     if(len>1){ // 判断 大于3张 时候 删除第一张
//         imgBoxss.splice(0,1)  // 判断 大于9张 时候 删除第一张
//         imgFiless.splice(0,1)  // 判断 大于9张 时候 删除第一张
//     }
//     for(var i=0;i<imgBoxss.length;i++){
//         var valss =" <img class='imgess' style='margin-right: 5px' src="+imgBoxss[i]+" height='70' width='70'>"
//         imgHtmlss=imgHtmlss+valss
//     }
//     $("#numberimgertss").html(imgBoxss.length);  //  获取图片的长度  把 长度的值 传入 上传图片的个数
//     $('.imhonss').html(imgHtmlss);   // 把图传入 class 为  imhon 的DIV 中
// }
// /**********/
// /*************身份证**************/
// var imgBox=[];
// var imgFile=[]// 全局变量 图片路径
// function getImg(obj){  // 当 上传文件发生改变时
//     var fileList = obj.files;//获取地址
//     if(((obj.files[0].size).toFixed(2))>=(2*1024*1024)){

//                   alert("请上传小于2M的图片");
//                   return false;
//              }
//     imgFile.push(fileList[0])
//     var imgUrl = window.URL.createObjectURL(obj.files[0]); // 图片 转换路径
//     imgBox.push(imgUrl);
//     var imgHtml=''
//     // var lennn=imgBox.length;  // 定义一个变量
//     if(imgBox.length>3){ // 判断 大于3张 时候 删除第一张
//         imgFile.splice(0,1)  // 判断 大于9张 时候 删除第一张
//         imgBox.splice(0,1)  // 判断 大于9张 时候 删除第一张
//     }
//     for(var i=0;i<imgBox.length;i++){
//         var val =" <img class='imge' style='margin-right: 5px' src="+imgBox[i]+" height='70' width='70'>"
//         imgHtml=imgHtml+val
//     }
//     $("#numberimgert").html(imgBox.length);  //  获取图片的长度  把 长度的值 传入 上传图片的个数
//     $('.imhon').html(imgHtml);   // 把图传入 class 为  imhon 的DIV 中
// }
// /**********/
// /*************营业执照**************/
// var imgBoxs=[];
// var imgFiles=[]// 全局变量 图片路径
// function getImgs(obj){  // 当 上传文件发生改变时
//     var fileLists = obj.files;//获取地址
//     if(((obj.files[0].size).toFixed(2))>=(2*1024*1024)){

//                   alert("请上传小于2M的图片");
//                   return false;
//              }
//     imgFiles.push(fileLists[0])
//     var imgUrls = window.URL.createObjectURL(obj.files[0]); // 图片 转换路径
//     imgBoxs.push(imgUrls);
//     var imgHtmls=''
//     // var lenn=imgBoxs.length;  // 定义一个变量
//     if(imgBoxs.length>3){ // 判断 大于3张 时候 删除第一张
//         imgFiles.splice(0,1)  // 判断 大于9张 时候 删除第一张
//          imgBoxs.splice(0,1)  // 判断 大于9张 时候 删除第一张
//     }
//     for(var i=0;i<imgBoxs.length;i++){
//         var vals =" <img class='imges' style='margin-right: 5px' src="+imgBoxs[i]+" height='70' width='70'>"
//         imgHtmls=imgHtmls+vals
//     }
//     $("#numberimgerts").html(imgBoxs.length);  //  获取图片的长度  把 长度的值 传入 上传图片的个数
//     $('.imhons').html(imgHtmls);   // 把图传入 class 为  imhons 的DIV 中
// }
// /**********/

// $(".Tijiao").click(function(){  /**点击 【提交】 【验证】**/
//          // var Scode=$('input[name="scode"]').val(); /** 获取输入验证码**/
//          // if(!Scode)
//          // {
//          //     $(".coke").css('border','1px solid red'); $(".imsh_cuo").show();
//          //     $(".ziticolor").css('color','red');
//          //     $("#confo\\.info").html("验证码不能为空!!!");
//          //     return false
//          // }

//     var phone=$('input[name=phone]').val();
//          $.ajax({
//              url:'/index.php/Business/Annex/ckCode', // 去后台验证 输入的验证码和发送的验证码是否一致
//              // data:{ Scode:Scode ,phone:phone},
//              data:{phone:phone},
//              type:'post',
//              success:function(arr){
//                  if(arr==1){
//                     var shopName=$('input[name=shopName]').val();
//                     var shopAddress=$('input[name=shopAddress]').val();
//                     var userName=$('input[name=userName]').val();
//                     var bankUserName=$('input[name=bankUserName]').val();
//                     var bankNo=$('input[name=bankNo]').val();
//                     if (!/^([1-9]{1})(\d{14}|\d{18})$/.test(bankNo)) {
//                         alert('请输入正确的银行卡号');
//                         return false;
//                     }
//                     var dlvServi=$('input[name=dlvServi]:checked').val();//一张
//                     var dlvServic=$('input[name=dlvServic]:checked').val();//营业
//                     var dlvService=$('input[name=dlvService]:checked').val();//身份
//                     var acreage=$('input[name=acreage]').val();
//                     var weburl=$('input[name=weburl]').val();
//                     var email=$('input[name=email]').val();
//                     if (!/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(email)) {
//                         alert('请输入正确的邮箱');
//                         return false;
//                     }
//                     var select=$('#select').val();
//                     var phon=$('input[name=phon]').val();
//                     var province = $(".province").find("option:selected").html();//省
//                     var city = $(".city").find("option:selected").html();//市
//                     var area = $(".area").find("option:selected").html();//区
//                     var Umage=imgBox;  //  获取 营业资质 所有的 图片
//                     var Umages=imgBoxs;  //  获取 身份证 所有的 图片
//                     var Umagess=imgBoxss;  //  获取 头像 所有的 图片
//                     if (!shopName||!shopAddress||!userName||!dlvService||!acreage||!email||!bankUserName||!bankNo||!dlvServic||!email||!dlvServi||!weburl) {
//                         alert('请把信息填写完整！');
//                         return false;
//                     };
//                     if (Umagess.length<1) {
//                         alert('请上传店铺头像');
//                         return false;
//                     }
//                     if (Umage.length<3) {
//                         alert('请上传身份证正反面');
//                         return false;
//                     }
//                     if (Umages.length<3) {
//                         alert('请上传营业执照/餐饮许可证/特许证件');
//                         return false;
//                     }
//                     if (select==-1) {
//                         alert('请选择菜系！');
//                         return false;
//                     };
//                     $.ajax({
//                     url:'/index.php/Business/Annex/addshop',
//                     data:
//                         {
//                             province:province,
//                             city:city,
//                             area:area,
//                             lat:mapAddress.latlng.lat,//mapAddress是选择地图后存入的全局变量
//                             lng:mapAddress.latlng.lng,
//                             shopName:shopName,
//                             userName:userName,
//                             shopAddress:shopAddress,
//                             bankUserName:bankUserName,
//                             bankNo:bankNo,
//                             dlvServi:dlvServi,
//                             dlvServic:dlvServic,
//                             dlvService:dlvService,
//                             acreage:acreage,
//                             weburl:weburl,
//                             email:email,
//                             select:select
//                         },
//                     type:'post',
//                     success:function (res) {
//                         if(res.res==1)
//                         {
//                             // alert('申请成功，请到分店列表上传相关证书');
//                             // location.reload()
//                             //上传图片
//                                        if(Umage.length>0)
//                                         {

//                                         for (var i =0;i<imgFile.length;i++)
//                                         {
//                                             //上传图片
//                                             var formData = new FormData();
//                                             formData.append("file",imgFile[i]);
//                                             formData.append("shopId",res.shopId);
//                                             $.ajax({
//                                                 url : '/index.php/Business/Registered/reportImg?type=1',
//                                                 type : 'POST',
//                                                 data : formData,
//                                                 // 告诉jQuery不要去处理发送的数据
//                                                 processData : false,
//                                                 // 告诉jQuery不要去设置Content-Type请求头
//                                                 contentType : false,
//                                                 beforeSend:function(){

//                                                 },
//                                                 success : function(responseStr) {
//                                                    // if(i==Umage.length)
//                                                    // {
//                                                    //     //  后台 请求成功后 取消 下面注释
//                                                    //     $(".jihuws_wj").show();
//                                                    //     $("#cont\\.info").html("图片正在上传...");
//                                                    //     setTimeout(function(){
//                                                    //         $(".jihuws_wj").hide();
//                                                    //     },2000);
//                                                    // }
//                                                 },
//                                                 error : function(responseStr) {

//                                                 }
//                                             });
//                                         }

//                                     }
//                                             if(Umages.length>0)
//                                             {

//                                             for (var i =0;i<imgFiles.length;i++)
//                                             {
//                                                 //上传图片
//                                                 var formData = new FormData();
//                                                 formData.append("file",imgFiles[i]);
//                                                 formData.append("shopId",res.shopId);
//                                                 $.ajax({
//                                                     url : '/index.php/Business/Registered/reportImg?type=2',
//                                                     type : 'POST',
//                                                     data : formData,
//                                                     // 告诉jQuery不要去处理发送的数据
//                                                     processData : false,
//                                                     // 告诉jQuery不要去设置Content-Type请求头
//                                                     contentType : false,
//                                                     beforeSend:function(){

//                                                     },
//                                                     success : function(responseStr) {
//                                                        // if(i==Umages.length)
//                                                        // {
//                                                        //     //  后台 请求成功后 取消 下面注释
//                                                        //     $(".jihuws_wj").show();
//                                                        //     $("#cont\\.info").html("资料提交中...");
//                                                        //     setTimeout(function(){
//                                                        //         $(".jihuws_wj").hide();
//                                                        //     },2000);
//                                                        // }
//                                                     },
//                                                     error : function(responseStr) {

//                                                     }
//                                                 });
//                                             }
//                                         }
//                                         if(Umagess.length>0)
//                                             {

//                                             for (var i =0;i<imgFiless.length;i++)
//                                             {
//                                                 //上传图片
//                                                 var formData = new FormData();
//                                                 formData.append("file",imgFiless[i]);
//                                                 formData.append("shopId",res.shopId);
//                                                 $.ajax({
//                                                     url : '/index.php/Business/Registered/reportImg?type=3',
//                                                     type : 'POST',
//                                                     data : formData,
//                                                     // 告诉jQuery不要去处理发送的数据
//                                                     processData : false,
//                                                     // 告诉jQuery不要去设置Content-Type请求头
//                                                     contentType : false,
//                                                     beforeSend:function(){

//                                                     },
//                                                     success : function(responseStr) {
//                                                        if(i==Umagess.length)
//                                                        {
//                                                            //  后台 请求成功后 取消 下面注释
//                                                            $(".jihuws_wj").show();
//                                                            $("#cont\\.info").html("申请成功，等待审核中！");
//                                                            setTimeout(function(){
//                                                                $(".jihuws_wj").hide();
//                                                                 location.href="http://aftdc.com/index.php?m=Business&c=Registered&a=state&phone="+phon;
//                                                            },3000);
//                                                        }
//                                                     },
//                                                     error : function(responseStr) {

//                                                     }
//                                                 });
//                                             }
//                                         }
//                                         alert('请稍等')
//                                 }
//                             }
//                      })
//                  }
//                  // else{
//                  //     alert('验证码错误')
//                  //     return
//                  // }

//              }
//          });
//    });