window.onload = function() {
    var shopData = JSON.parse(localStorage.getItem('shopData'));
    if (!shopData) {
        location.href = "/business/Login/index.html";
    } else {
        var app = new Vue({
            el: '.dec',
            data: {},
            created: function () {

                var newCoulook = location.href

                $(document).keydown(function (event) {  // 点击 回车键 保存
                    var keynum = event.keyCode;  //  获取回车键的 代码
//        console.log(keynum,"123");
                    if (keynum == '13') {          // 判断 enter 键的码 是否 13
                        $(".enh").click();
                    }

                });
                var myDate = new Date();

                var year = myDate.getFullYear();   //年
                var month = myDate.getMonth() + 1;  // 月
                var day = myDate.getDate();  // 日期

                month = month > 9 ? month : '0' + month  // 三目判断
                day = day > 9 ? day : '0' + day   // 三目判断

                var time = year + '-' + month + '-' + day
                $("#act").val(time)
            },
            methods: {
                kjeClick: function () {
                    $(".cdeGjh_kw").show();
                },
                Hh_kjhClick: function () {
                    $(".cdeGjh_kw").hide();
                },
                enhClick: function () {
                    // var act=$("#act").val();  // 获取 开始时间
                    // var ove=$("#ove").val();  // 获取 结束时间
                    var dec = $("#dec").val();  // 获取 结束时间dccvd
                    var ddw = $("#ddw").is(':checked');  // 获取 结束时间dccvd


                    if (!ddw) {
                        alert('请阅读商家自营协议')
                        return false
                    }
                    if (dec == '') {
                        alert('请填写金额')
                        return false
                    }
                    axios({
                        method: "post",
                        url: 'https://www.aftdc.com/Business/Activity/NewCou',
                        data: {
                            newCou: dec,
                            token:shopData.token,
                        },
                    }).then(function (res) {

                        if (res.data.res == 1) {
                            alert('保存成功');
                            window.parent.location.href = "https://aftdc.com/index.php/Business/ShopSa/index#/Huo/Dong";
                            top.location.reload();
                        }else if(res.data.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href="/business/Login/index.html";
                        }
                    })
                },
                chuuuClick: function () {
                    $("#edfcpoiw").show();
                },
                yuiuuClick: function () {
                    $("#edfcpoiw").hide();
                },
                wenClick: function () {
                    $("#svfrbtgnr").show();
                },
                menClick: function () {
                    $("#svfrbtgnr").hide();
                },
                ejkClick: function () {
                    history.back();
                }
            },
            mounted: function () {
                $("#act").dateSelect();
                $("#ove").dateSelect();
            }
        })
    }
}































