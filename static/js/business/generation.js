window.onload = function () {
    var shopData = JSON.parse(localStorage.getItem('shopData'));
    if (!shopData) {
        location.href = "/business/Login/index.html";
    } else {



            var app = new Vue({
                el: '#app',
                data: {},
                created: function () {
                    $(document).keydown(function (event) {  // 点击 回车键 保存
                        var keynum = event.keyCode;  //  获取回车键的 代码
                        //        console.log(keynum,"123");
                        if (keynum == '13') {          // 判断 enter 键的码 是否 13
                            $(".cevddj").click();
                        }
                    });
                },
                methods: {
                    huqwe_kqdClick: function () {
                        $(".skjkEJ_Evfgr").hide();
                    },
                    cedvvbnClick: function () {
                        $(".skjkEJ_Evfgr").show();
                    },
                    allBuXuanzhongClick: function () {
                        console.log(123)
                        if ($(".allBuXuanzhong").is(':checked')) {
                            $("input:checkbox[name='Fruit']").prop("checked", true);
                        } else {
                            $("input:checkbox[name='Fruit']").prop("checked", false);
                        }
                    },
                    cedjClick: function () {
                        history.back();
                    },
                    cevddjClick: function () {
                        var text = $("input:checkbox[name='Fruit']:checked").map(function (index, elem) {
                            return $(elem).val();
                        }).get().join(',');//
                        if (!text) {
                            alert('请选择可用时段')
                            return false;
                        }
                        var timez = $("#zuotext").val(); //  开始时间 左边
                        var timey = $("#csdevwe").val(); //  结束时间 右边
                        var date = new Date(timez);
                        var dateE = new Date(timey);
                        var dateSt = date.getTime();//开始时间时间戳
                        var dateEt = dateE.getTime();//结束时间时间戳

                        if (dateSt >=dateEt) {
                            alert('开始时间不能大于结束时间！');
                            return false;
                        }
                        if (!timez || !timey) {
                            alert('活动时间必填');
                            return false;
                        }
                        var spendMoney = $("input[name=spendMoney]").val(); //  满足金额
                        var couponMoney = $("input[name=couponMoney]").val(); //  优惠金额
                        var parterrn = /[^.\x22]+/;
                        if (!parterrn.test(spendMoney) || !parterrn.test(couponMoney)) {
                            alert('禁止·特殊符号开头')
                            return false;
                        }
                        var cvrvg = $("#diajjh").is(':checked'); // 是否 选中
                        if (!cvrvg) {
                            alert('请阅读商家自营协议')
                            return false;
                        }
                        var nmern = spendMoney + " 元代 " + couponMoney + " 元券";
                        if (!nmern) {
                            alert('请填写金额');
                            console.log(spendMoney);
                            console.log(couponMoney);
                            console.log(nmern);
                            return false;
                        }
                        axios({
                            method: "post",
                            url: "https://www.aftdc.com/Business/Activity/genera",
                            data: {
                                nmern: nmern,
                                text: text,
                                spendMoney: spendMoney,
                                couponMoney: couponMoney,
                                timez: timez,
                                timey: timey,
                                token: shopData.token
                            }
                        }).then(function (res) {
                            console.log("res")
                            console.log(res);
                            if (res.data.res == 1) {
                                alert('添加代金卷成功')
                                window.parent.location.href = "https://aftdc.com/index.php/Business/ShopSa/index#/Huo/Dong";
                                top.location.reload();
                            } else if (res.data.res == -1) {
                                alert(res.data.reason)
                                localStorage.removeItem('shopData');
                                location.href = "/business/Login/index.html";
                            }

                            else {
                                alert('添加代金卷失败')
                            }
                        })
                    }
                },
                mounted: function () {
                    $("#zuotext").dateSelect();
                    $("#csdevwe").dateSelect();
                }
            })
        }

}
/*
$(function(){

    $(".cdejk").click(function(){    // 点击 添加优惠劵  显示 弹框
        $(".cdeocdjkw").show();
    });

    $(".cTvffrb").click(function(){   // 领卷 数量  显示
        $(".cedjkbh").show();
    });
    $(".Hikjh").click(function(){ // cuohao
        $(".cdeocdjkw").hide();
    });
    $(".csdjmhy").click(function(){  // 取消
        $(".cdeocdjkw").hide();
    });
    $(".decvw").click(function(){  // 确认并添加
        var dcvd=$(".cTRBHk").val();  // 获取  活动名称
        var fbds=$(".cTvHk").val();  // 获取  使用条件
        var dgrs=$(".cTvffrb").val();  // 获取  优惠券有效期
        console.log(dcvd);
        console.log(fbds);
        console.log(dgrs);
        $.ajax({
            url:'',
            data:{},
            type:'post',
            success:function(){

            }
        });

    });

});

function Shoe(obj){
    var fer=$(obj).text();
    $(".cTvffrb").val(fer);
    $(".cedjkbh").hide();
}

$(function(){
    $(".cedvvbn").click(function(){ //点击   商家自营销协议 显示弹框
        $(".cdeGjh_kw").show();
    });
    $(".Hh_kjh").click(function(){ // 点击   商家自营销协议-  错号
        $(".cdeGjh_kw").hide();
    });
});
*/