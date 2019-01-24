window.onload = function () {
    var shopData = JSON.parse(localStorage.getItem('shopData'));
    if (!shopData) {
        location.href = "/business/Login/index.html";
    } else {

        var home = new Vue({
            el: '#home',
            data: {
                stars: 4, //头部星级

                yy: [
                    {name: '今日预约订单', index: '0'},
                    {name: '到期预约单', index: '0'},
                    {name: '待回复差评', index: '0'},
                ],
                datas: {},
                Statistics: {},
                shops: {},
                datas: {},
                tail: [{}],
                newCou: '',
            },

            beforeCreate: function () {
                // var _self = this
                // $.ajax({
                //     url:'/index.php/Business/ShopSa/ajaxHome',
                //     data:{},
                //     async: false,
                //     success:function(res)
                //     {
                //         _self.datas=res;
                //         console.log("456")
                //         _self.yy[0].index=res.yuOrderToday;
                //         _self.yy[1].index=res.FinshOrderToday;
                //         _self.yy[2].index=res.poorly;
                //     }
                // })
            },
            /*created: function () {
                            var that = this
                            axios({
                                method:"post",
                                url:"http://111.231.248.206/aftdcAControl/Config/main",
                                data:''
                            }).then(function(res){
                                if(res.data.res==1){
                                    that.sessionData=res.data.data
                                }else{
                                    location.href="../Login/login.html";
                                }
                            })
                        }*/
            created: function () { //加载执行
                var that = this;

                axios({
                    method: "post",
                    url: 'https://www.aftdc.com/Business/Index/home',
                    data: {token: shopData.token},
                }).then(function (res) {


                    that.datas = res.data.data;
                    that.Statistics = res.data.data.Statistics;
                    that.shops = res.data.data.Statistics.shops;
                    that.shopcoupon = res.data.data.shopcoupon;
                    that.newCou = res.data.data.newCou;
                    that.man = that.datas.youhui.split("减")[0].split("满")[1]
                    that.jian = that.datas.youhui.split("减")[1]

                    if (res.data.res == -1) {
                        alert(res.data.reason)
                        localStorage.removeItem('shopData');
                        location.href = "/business/Login/index.html";
                    }

                })
                /*var _self = this
                var yy = []
                axios({
                    method: "get",
                    url: 'http://111.231.248.206/Business/Index/home',
                    data: '',
                }).then(function(res) {
                    _self.datas = res;
                    console.log(res)
                    _self.yy[0].index = res.yuOrderToday;
                    _self.yy[1].index = res.FinshOrderToday;
                    _self.yy[2].index = res.poorly;
                })
    */
            },
            methods: {
                YTmousemove: function () {
                    $(".thisCai").show();
                    $(".yue").css({
                        "background": "#fff",
                        "border-left": "1px solid #eee",
                        "border-right": "1px solid #eee"
                    });
                },
                YTmouseout: function () {
                    $(".thisCai").hide();
                    $(".yue").css({
                        "background": "#fafafa",
                        "border-left": "0px solid #eee",
                        "border-right": "0px solid #eee"
                    });
                },
                Hmousemove: function () {
                    $(".xianshione").show();
                    $(".sanimg").show();
                },
                Hmouseout: function () {
                    $(".xianshione").hide();
                    $(".sanimg").hide();
                },
                Smousemove: function () {
                    $(".astuk").show();
                    $(".teoimg").show();
                },
                Smouseout: function () {
                    $(".astuk").hide();
                    $(".teoimg").hide();
                },
                ss: function () {
                    $(".this_kiai").hide();
                },
                sub: function () {

                    var password = $("input[name='password']").val();
                    var repassword = $("input[name='repassword']").val();

                    if (!password || !repassword) {
                        alert('请输入完整');
                        return false;
                    }

                    if (password != repassword) {
                        alert('两次密码输入不一致');
                        return false;
                    }
                    var shopId = $("input[name='shopId']").val();
                    axios({
                        method: "post",
                        url: "https://www.aftdc.com/index.php/Business/Business/registerPassword",

                        data: {
                            password: password,
                            shopId: shopId,
                            token: shopData.token
                        }

                    }).then(function (res) {
                        if (res.res == 1) {
                            alert("添加密码成功")
                        } else if (res.data.res == -1) {
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href = "/business/Login/index.html";
                        }

                        else if (res.res == 0) {
                            alert("添加密码失败")
                        }
                        $(".this_kiai").hide();

                    })


                },
                xyhljClick: function () { //新用户立减
                    location.href = '/business/Activity/huoMessage.html?' + "Cou=" + this.newCou
                },
                mjhdClick: function () { //满减活动
                    location.href = '/business/Activity/HuoJian.html?' + "man=" + this.man + "&" + "jian=" + this.jian
                },
                zkhdClick: function () { //折扣活动
                    location.href = '/business/Activity/hongSa.html'
                },
                kjhdClick: function () { //砍价活动
                    location.href = '/business/Activity/Bargain.html'
                },
                tghdClick: function () { //团购活动
                    location.href = '/business/Activity/Huogroup.html'
                },
                mshdClick: function () { //秒杀活动
                    location.href = '/business/Activity/Huomiao.html'
                },
                seeCouponClick: function (item) {
                    var couponId = item.couponId;
                    location.href = '/business/Activity/seeCoupon.html?couponId=' + couponId;
                },
                ActDoorClick: function () {

                    window.parent.location.href = "https://www.aftdc.com/business/Index/index.html#/Act/Door";
                    top.location.reload();
                    // location.href = '/business/Store/ActDoor.html';

                },
                GoodsClick: function () {

                    window.parent.location.href = " https://www.aftdc.com/business/Index/index.html#/shop";
                    top.location.reload();
                    // location.href = '/business/Goods/shop.html';
                },
                orderHistoryClick: function () {
                    window.parent.location.href = " https://www.aftdc.com/business/Index/index.html#/order/Pre";
                    top.location.reload();
                    // location.href = '/business/Ordersa/orderHistory.html';
                },
                CaiDuizhangClick: function () {
                    window.parent.location.href = " https://www.aftdc.com/business/Index/index.html#/Cai/Duizhang";
                    top.location.reload();
                    // location.href = '/business/Finance/CaiDuizhang.html';
                },
            },
        });
    }

}


/*$(function(){
    $(".conmer").mousemove(function(){
         $(".Doors").show();
         $(".conmer").css({"background":"#fff","border-left":"1px solid #eee","border-right":"1px solid #eee"});
    });
    $(".conmer").mouseout(function(){
         $(".Doors").hide();
         $(".conmer").css({"background":"#fafafa","border-left":"0px solid #eee","border-right":"0px solid #eee"});
    });
    $(".Doors").mousemove(function(){
         $(".Doors").show();
         $(".conmer").css({"background":"#fff","border-left":"1px solid #eee","border-right":"1px solid #eee"});
    });
    $(".Doors").mouseout(function(){
         $(".Doors").hide();
         $(".conmer").css({"background":"#fafafa","border-left":"0px solid #eee","border-right":"0px solid #eee"});
    });
});



$(function(){
     $(".konone").mousemove(function(){
          $(".allone").show(); $(".alloneimg").show();
     });
     $(".konone").mouseout(function(){
          $(".allone").hide(); $(".alloneimg").hide();
     });

     $(".kontwo").mousemove(function(){
          $(".alltwo").show(); $(".alltwoimg").show();
     });
     $(".kontwo").mouseout(function(){
          $(".alltwo").hide(); $(".alltwoimg").hide();
     });

    $(".konsan").mousemove(function(){
          $(".allsan").show(); $(".allsanimg").show();
     });
     $(".konsan").mouseout(function(){
          $(".allsan").hide(); $(".allsanimg").hide();
     });

    $(".konfour").mousemove(function(){
          $(".allfour").show(); $(".allfourimg").show();
     });
     $(".konfour").mouseout(function(){
          $(".allfour").hide(); $(".allfourimg").hide();
     });

     $(".konfive").mousemove(function(){
          $(".allfive").show(); $(".allfiveimg").show();
     });
     $(".konfive").mouseout(function(){
          $(".allfive").hide(); $(".allfiveimg").hide();
     });
});




*/