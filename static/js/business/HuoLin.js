window.onload = function() {
    var shopData = JSON.parse(localStorage.getItem('shopData'));
    if (!shopData) {
        location.href = "/business/Login/index.html";
    } else {
        var app = new Vue({
            el: '.dec',
            data: {},
            created: function () {
                $(function () {
                    $(document).keydown(function (event) {  // 点击 回车键 保存
                        var keynum = event.keyCode;  //  获取回车键的 代码
                        //        console.log(keynum,"123");
                        if (keynum == '13') {          // 判断 enter 键的码 是否 13
                            $(".cevddj").click();
                        }
                    });
                });
            },
            mounted: function () {
                $("#zuotext").dateSelect();
                $("#csdevwe").dateSelect();
            },
            methods: {
                cdejkClick: function () {    // 点击 添加优惠劵  显示 弹框
                    $(".cdeocdjkw").show();
                },
                cTvffrbClick: function () {   // 领卷 数量  显示
                    $(".cedjkbh").show();
                },
                HikjhClick: function () { // cuohao
                    $(".cdeocdjkw").hide();
                },
                csdjmhyClick: function () {  // 取消
                    $(".cdeocdjkw").hide();
                },
                decvwClick: function () {  // 确认并添加
                    var dcvd = $(".cTRBHk").val();  // 获取  活动名称
                    var fbds = $(".cTvHk").val();  // 获取  使用条件
                    var dgrs = $(".cTvffrb").val();  // 获取  优惠券有效期


                },
                Shoe: function (e) {
                    var fer = e.target.innerText;
                    $(".cTvffrb").val(fer);
                    $(".cedjkbh").hide();
                },
                cedvvbnClick: function () { //点击   商家自营销协议 显示弹框
                    $(".cdeGjh_kw").show();
                },
                Hh_kjhClick: function () { // 点击   商家自营销协议-  错号
                    $(".cdeGjh_kw").hide();
                },
                cedjClick: function () {   // 点击 取消
                    history.back();
                },
                cevddjClick: function () { // 点击 确认
                    var nmern = $(".cejk").val(); //  活动名称
                    var timez = $("#zuotext").val(); //  活动时间 左边
                    var timey = $("#csdevwe").val(); //  活动时间 右边

                    console.log(timez)
                    //var  fwerw=$('input[name="yuu"]:checked').val(); // 面向人群
                    var spendMoney = $("input[name=spendMoney]").val(); //  满足金额
                    var couponMoney = $("input[name=couponMoney]").val(); //  优惠金额
                    var couType = $('input[name="frr"]:checked').val(); // 发放渠道
                    var cvrvg = $("#diajjh").is(':checked'); // 是否 选中
                    var parterrn = /[^.\x22]+/;
                    var date = new Date(timez);
                    var dateE = new Date(timey);
                    var dateSt = date.getTime();//开始时间时间戳
                    var dateEt = dateE.getTime();//结束时间时间戳

                    if (dateSt >=dateEt) {
                        alert('开始时间不能大于结束时间！');
                        return false;
                    }
                    if (!parterrn.test(spendMoney) || !parterrn.test(couponMoney)) {
                        alert('禁止·特殊符号开头')
                        return false;
                    }
                    if (nmern.length > 12) {
                        alert('活动名称不能大于12个字')
                        return false
                    }
                    if (!cvrvg) {
                        alert('请阅读商家自营协议')
                        return false
                    }
                    if (!couType) {
                        alert('请选择发放渠道')
                        return false
                    }
                    if (!nmern || !timez || !timey || !spendMoney || !couponMoney) {
                        alert('请填写完整')
                        return false
                    }
                    axios({
                        method: "post",
                        url: 'https://www.aftdc.com/Business/Activity/addCoupon',
                        data: {
                            couponName: nmern,
                            timez: timez,
                            timey: timey,
                            spendMoney: spendMoney,
                            couponMoney: couponMoney,
                            couType: couType,
                            token:shopData.token,
                        },
                    }).then(function (res) {

                        if (res.data.isDisable == 1) {
                            alert('含有非法字段')
                            return false;
                        }
                        if (res.data.res == -2) {
                            alert('优惠金额不可大于满足金额')
                            return false;
                        }else if (res.data.res == 1) {
                            alert('保存成功');
                            window.parent.location.href = "https://aftdc.com/index.php/Business/ShopSa/index#/Huo/Dong";
                            top.location.reload();
                        }
                       else if (res.data.res == 0) {
                            alert('保存失败')
                        }
                        else if(res.data.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href="/business/Login/index.html";
                        }
                    })

                }

            }
        })
    }
}












