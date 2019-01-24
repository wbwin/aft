window.onload=function () {


        var app = new Vue({
            el: '#app',
            data: {
                data:[
                    {img:"/static/image/pc/q1.png",title:'催单问题',question:["我的订单超时了怎么办？","订单一直没有骑手接单怎么办？","下单以后怎么修改订单信息？",
                        "为什么超时送达了没有超时赔付？","怎么催单？"]},
                    {img:"/static/image/pc/q2.png",title:'退单问题',question:["商家拒绝退单怎么办？","订单被取消了怎么办？","怎么退单？"]},
                    {img:"/static/image/pc/q3.png",title:'活动问题',question:["我是新用户吗？","我的红包为什么用不了？","订单取消后红包会返还吗？",
                        "什么是准时达订单？","怎么关闭超级会员自动续费功能？"]},
                    {img:"/static/image/pc/q4.png",title:'投诉建议',question:["错送漏送餐品怎么办？","我要投诉餐厅/骑手"]}]
            },
            created: function () {



            },
            methods:{
                questionClick:function (index,k) {
                    if(index==0){
                        location.href='/pc/reminder.html?questionCount='+k;
                    }
                    if(index==1){
                        location.href='/pc/chargeback.html?questionCount='+k;
                    }
                    if(index==2){
                        location.href='/pc/activity.html?questionCount='+k;
                    }
                    if(index==3){
                        location.href='/pc/complaint.html?questionCount='+k;
                    }
                },
            },
        })

}