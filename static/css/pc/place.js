
	var mode=0

$(function(){
    var len=$(".payMode-choice").length
	if(!len)
	{
        mode=3
	}
	 //查看详情
	$(".order-desc-more").on("click",function(event){
		var addclas=$(".order-desc").hasClass("desc-column")
		if(addclas){
				$(".order-desc").removeClass("desc-column")
		}else{
				$(".order-desc").addClass("desc-column")
		}

	
	})
	
	//选择支付方式

	$(".payMode-choice").on("click",function(event){
		$(".payMode-choice").removeClass("payModeYes")
		$(this).addClass("payModeYes")
		
		var len=$(".payMode-choice").length
		//var mode
		for(var i=0;i<len;i++){
			var whether=$(".payMode-choice").eq(i).hasClass("payModeYes")
			if(whether){
				mode=i
				break
			}
		}
		console.log(mode)//0 支付宝 1微信支付

		
		
	})
})

//确认支付
function pay(){
	console.log(mode)//0 支付宝 1微信支付
		if(mode==0){
            var codeUrl=$('input[name=alicode]').val();
            $('.codeImg').attr('src',"https://www.aftdc.com/"+encodeURI(codeUrl))
			$(".payBox p").text("请使用支付宝支付")
			$(".payqBoxBack").show()
		
		}else if(mode==1){
            var codeUrl=$('input[name=wxcode]').val();
            $('.codeImg').attr('src',"http://paysdk.weixin.qq.com/example/qrcode.php?data="+encodeURI(codeUrl))

            $(".payBox p").text("请使用微信支付")

            $(".payqBoxBack").show()

			
		}
		else if(mode==3)
		{
			var orderNo=$('input[name=orderNo]').val()
			$.ajax({
				url:'/index.php/HomePc/Index/payment',
				data:{
					orderNo:orderNo
				},
				type:'post',
				success:function (res) {
					if(res==1)
					{
						alert('下单成功');
						location.href='/index.php/HomePc/Myziliao/myziliao'
					}
                }

			})
		}

}


function closePay(){
		$(".payqBoxBack").hide()
}
function payment(obj)
{
	mode=3

    $(obj).addClass("payModeYes")
}