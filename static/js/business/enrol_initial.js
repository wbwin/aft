window.onload = function() {
    var app = new Vue({
        el: '#dec',
        data: {
            papers:[
	        { name: "身份证照片", tips: "证件照需清晰可辨认，不得使用复印件", img: "/static/image/papers1.jpg" },
	        { name: "营业执照 ", tips: "正面拍摄证件，照片需清晰可辨认，不得使用复印件", img: "/static/image/setTyps.jpg" },
	        { name: "餐饮行业许可证  ", tips: "正面拍摄证件，照片需清晰可辨认，不得使用复印件", img: "/static/image/setAllow.jpg" },
	        { name: " 店内照片", tips: " 照片体现店铺环境，地面需干净，墙面无霉斑，图片不得有水印、logo和其他网站信息", img: "/static/image/shopImg1.jpg" },
	        { name: " 门脸照 ", tips: " 店面招牌和店面大门全景拍摄，图片不得有水印、logo和其他网站信息", img: "/static/image/shopImg2.jpg" },
	        { name: " 商户logo", tips: "符合商品气质的店铺标志", img: "/static/image/logo.png" },
	        ],
	        imgTogle:-1,
            token:'',
            time:0,
        },
        //
        created:function(){
            var that = this;
            var token = sessionStorage.getItem("token");
            if (!token) {
                alert('失去重要信息,请重试')
                location.href = './registered.html';
                return false
            }
            axios({
                url:"/business/Enrol/understand",
                method:"post",
                data:{
                    token:token,
                },
            }).then(function(res){
                console.log(res)
                if(res.data.res == 1){
                    sessionStorage.setItem("token",res.data.token);
                    that.token = res.data.token;
                } else {
                    alert(res.data.info)
                    sessionStorage.setItem("code_token",res.data.info);
                    location.href = './registered.html';
                }
            })

        },
        methods: {
        	//我已准备好资料，进行开店申请
        	apply:function(){
        		var that = this;
                var token = sessionStorage.getItem("token");
                console.log(token)
        		if (!token) {
        			alert('失去重要信息,请重试')
        			return false
        		}
        		location.href = './settInfo.html';
        	}
        }
    })
}