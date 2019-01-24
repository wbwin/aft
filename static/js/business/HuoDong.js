window.onload = function() {
    var shopData = JSON.parse(localStorage.getItem('shopData'));
    if (!shopData) {
        location.href = "/business/Login/index.html";
    } else {
        var app = new Vue({
            el: '#app',
            data: {
                shop: '',
                huodong: '',
                youhui: '',
                cou: ''
            },
            created: function () {
                var that = this
                axios({
                    method: "post",
                    url: "https://www.aftdc.com/Business/Activity/HuoDong",
                    data: {
                        token:shopData.token,
                    }
                }).then(function (res) {
                    var require = res.data
                    if (require.res == 1) {
                        that.huodong = require.data
                        that.shop = require.data.shop.youhui.length
                        that.cou = require.data.shop
                        that.youhui = require.data.shop.youhui[0]
                        that.man = require.data.shop.full
                        that.jian = require.data.shop.minus
                        that.newCou = require.data.shop.newCou

                    }else if(require.res == -1){
                        alert(res.data.reason)
                        localStorage.removeItem('shopData');
                        location.href="/business/Login/index.html";
                    }
                })
            },
            methods: {
                HuoJianClick: function () {
                    location.href = "/business/Activity/HuoJian.html?" + "man=" + this.man + "&" + "jian=" + this.jian //满减活动
                },
                HuoLinClick: function () {
                    location.href = "/business/Activity/HuoLin.html" //商家优惠券
                },
                seeCouponClick: function () {
                    location.href = "/business/Activity/seeCoupon.html" //查看商家优惠券
                },
                HuoNewClick: function () {
                    location.href = "/business/Activity/HuoNew.html"  //新客立减
                },
                hongSaClick: function () {
                    location.href = "/business/Activity/hongSa.html" //折扣活动
                },
                BargainClick: function () {
                    location.href = "/business/Activity/Bargain.html" //砍价活动
                },
                HuogroupClick: function () {
                    location.href = "/business/Activity/Huogroup.html" //团购活动
                },
                HuomiaoClick: function () {
                    location.href = "/business/Activity/Huomiao.html" //秒杀活动
                },
                generationClick: function () {
                    location.href = "/business/Activity/generation.html" //代金券活动
                },
                generaISClick: function () {
                    location.href = "/business/Activity/generaIS.html" //代金券活动
                },
                huoMessageClick: function () {
                    location.href = "/business/Activity/huoMessage.html?" + "Cou=" + this.newCou //新用户下单立减
                },
                HongBaoClick: function () {
                    location.href = "/business/Activity/HongBao.html" //红包大派送
                },
                seeHongBaoClick: function () {
                    location.href = "/business/Activity/seeHongBao.html" //红包大派送
                },
                setCouponClick: function () {
                    location.href = "/business/Activity/setCoupon.html" //满减活动
                },
                lishiClick: function () {// 点击 【历史活动】
                    $("#lishi").css({"border-bottom": "5px solid #06c1ae", "color": "#06c1ae"});
                    $("#dangqian").css({"border-bottom": "0px solid #06c1ae", "color": "#000"});
                    $(".cweochwocc").show();
                    $(".diyikuang").hide();
                },
                dangqianClick: function () {// 点击 【当前活动】
                    $("#lishi").css({"border-bottom": "0px solid #06c1ae", "color": "#000"});
                    $("#dangqian").css({"border-bottom": "5px solid #06c1ae", "color": "#06c1ae"});
                    $(".cweochwocc").hide();
                    $(".diyikuang").show();
                },
                hswqcuoClick: function () {
                    $(".wearebest").hide();
                },
                goguanbiClick: function () {
                    $(".wearebest").hide();
                }
            }
        })
    }
}


/* $(function(){//暫無引用
 	$("#p_onwtwomore").click(function(){
        if($(".kifckmore").css("display")=="none"){
                $(".kifckmore").show();
        }else{
                $(".kifckmore").hide();
        }
    });
 }); */


// $(".cujianok").click(function(){  // 点击【立即创建】
//      $(".yingcangkuzng").show();
// });


/* $("#danhuy").click(function(){  // 点击【返回列表】  //暫無引用
     $(".yingcangkuzng_chankan").hide();
 });
 $("#faqimnch").click(function(){  // 点击【重新发起】
     $(".wearebest").show();
 });*/


/* $("#p_onwone").click(function(){  //   双人套餐   //暫無引用
     if($(".sefck").css("display")=="none"){
         $(".sefck").show();
     }else{
         $(".sefck").hide();
     }
 });
 $("#p_onwtwo").click(function(){  // 特色主打
      if($(".kifck").css("display")=="none"){
         $(".kifck").show();
      }else{
         $(".kifck").hide();
      }
 });
 $("#p_onwthree").click(function(){  // 主菜类
      if($(".jsics").css("display")=="none"){
         $(".jsics").show();
      }else{
         $(".jsics").hide();
      }
 });
 $("#p_onwfour").click(function(){  // 主食类
      if($(".efjcd").css("display")=="none"){
         $(".efjcd").show();
      }else{
         $(".efjcd").hide();
      }
 });
 $("#p_onwfive").click(function(){  // 小菜类
     if($(".cdklo").css("display")=="none"){
         $(".cdklo").show();
      }else{
         $(".cdklo").hide();
      }
 });
 $("#p_onwsix").click(function(){ // 超值男神餐
    if($(".cdhuse").css("display")=="none"){
        $(".cdhuse").show();
     }else{
        $(".cdhuse").hide();
     }
 });
 $("#p_onwseven").click(function(){  // 超值女神餐
      if($(".conde").css("display")=="none"){
         $(".conde").show();
      }else{
         $(".conde").hide();
      }
  });

});
function shuangren(obj){ // 获取里面的内容 并传入左匡
var shuangren =$(obj).text();
var val='<div> <span class="aaa">'+shuangren+'</span><span class="cxej" onclick="ceej(this)">×</span>'+'<br/>'+'</div>'
$(".you_kai").append(val); /**每次添加一个**/
/*}
function ceej(obj){  // 删除 父级元素
   $(obj).parent().remove();
}
*/




















