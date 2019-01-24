window.onload = function () {


    var app = new Vue({
        el: '#app',
        data: {
            reminder: ["我的订单超时了怎么办？", "订单一直没有骑手接单怎么办？", "下单以后怎么修改订单信息？",
                "为什么超时送达了没有超时赔付？", "怎么催单？", "怎么联系餐厅？", "怎么联系骑手?", "准时达怎么申请赔付？"],
            chargeback: ["商家拒绝退单怎么办？", "订单被取消了怎么办？", "怎么退单？"],
            activity: ["我是新用户吗？", "我的红包为什么用不了？", "订单取消后红包会返还吗？",
                "什么是准时达订单？", "怎么关闭超级会员自动续费功能？", "新用户优惠使用要求是什么？", "怎么参加餐厅满减活动？"],
            complaint: ["错送漏送餐品怎么办？", "我要投诉餐厅/骑手"],

            questionCount: 0,
        },
        created: function () {
            var that = this
            var url = location.search;
            var questionCount = url.substr(1);
            if (questionCount) {
                that.questionCount = questionCount.replace('questionCount=', '');
            }
            console.log(that.questionCount);
        },
        methods: {
            questionClick: function (index) {
                var that = this;
                that.questionCount = index
            },
            solveClick:function () {
                $('.bottom_button').hide();
                $('.bottom_success').show();
            },
        },
    })

}