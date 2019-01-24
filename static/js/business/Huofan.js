window.onload = function() {
    var shopData = JSON.parse(localStorage.getItem('shopData'));
    if (!shopData) {
        location.href = "/business/Login/index.html";
    } else {

        var app = new Vue({
            el: '.dec',
            data: {},
            methods: {
                cekovcreiClick: function () {// 点击 帮助说明  显示影藏框
                    $(".cdeojkw").show();
                },
                ceClick: function () {// 点击 帮助说明  错号
                    $(".cdeojkw").hide();
                },
                cvdkClick: function () {// 点击 帮助说明  取消
                    $(".cdeojkw").hide();
                },
                cdejkClick: function () {// 点击 添加优惠劵  显示 弹框
                    $(".cdeocdjkw").show();
                },
                cTvffrbClick: function () {// 领卷 数量  显示
                    $(".cedjkbh").show();
                },
                HikjhClick: function () {// cuohao
                    $(".cdeocdjkw").hide();
                },
                csdjmhyClick: function () {// 取消
                    $(".cdeocdjkw").hide();
                },
                decvwClick: function () {// 确认并添加
                    var dcvd = $(".cTRBHk").val();  // 获取  活动名称
                    var fbds = $(".cTvHk").val();  // 获取  使用条件
                    var dgrs = $(".cTvffrb").val();  // 获取  优惠券有效期


                },
                Shoe: function (obj) {
                    var fer = $(obj).text();
                    $(".cTvffrb").val(fer);
                    $(".cedjkbh").hide();
                },
                cedvvbnClick: function () {//点击   商家自营销协议 显示弹框
                    $(".cdeGjh_kw").show();
                },
                Hh_kjhClick: function () {// 点击   商家自营销协议-  错号
                    $(".cdeGjh_kw").hide();
                },
                cedjClick: function () {// 点击返回
                    history.back();
                },
                cevddjClick: function () {
                    var nas = $(".cejk").val(); // 获取 活动名称
                    var zuo = $("#zuotext").val(); // 获取 活动时间 左
                    var you = $("#csdevwe").val(); // 获取 活动时间 右
                    var cvsd = $(".csdvfdfe").val(); // 获取 订单实付金额(含运费)满
                    var vrbt = $(".cejvck").val(); // 获取 预计发放总数
                    var vreki = $("#efrvGb").is(':checked'); //  获取 是否选中

                }

            },
            mounted: function () {
                $("#zuotext").dateSelect();
                $("#csdevwe").dateSelect();
            }
        })
    }
}












