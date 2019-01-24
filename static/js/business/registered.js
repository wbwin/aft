window.onload = function() {
    var app = new Vue({
        el: '#dec',
        data: {
            phone:'',
            secode: 90,
            text:'',
            color:'',
            code:'',
            token:'',
            code_token:'none',
            code_code:'',
        },
        created:function(){
            var that = this;
            var code_token = sessionStorage.getItem("code_token");
            if (code_token){
                that.code_token = '';
                that.token = 'none';
            }
            $(document).keyup(function (e) {//捕获文档对象的按键弹起事件
                if (e.keyCode == 13) {//按键信息对象以参数的形式传递进来了  
                    //此处编写用户敲回车后的代码 
                    that.registered()
                }  
            }); 
        },
        methods: {
        	//手机号码改变颜色
        	wuha: function() {
                var that = this;
                // that.color = 'red';
                var phone = that.phone;
                var parttern = /^1[3|4|5|7|8][0-9]\d{8}$/;
                if(!parttern.test(phone)){ 
                    that.color = '#C0C0C0';
                } else {
                    that.color = 'red';
                }
            },
            //获取验证码
 			yzm:function(){
 				var that = this;
 				var secode = that.secode;
 				var phone = that.phone;
                console.log(phone)
 				if(!(/^1[3|4|5|7|8][0-9]\d{8}$/.test(phone))){ 
					alert('手机号码错误')
    				return false
 				}
 				axios({
 					method: "post",
                    // url:'https://www.aftdc.com/index.php/Wxapp/Msm/send', // 请求接口
                    url: 'https://www.aftdc.com/business/Enrol/yzm', // 请求接口
                    data: {
                        phone: phone,
                    },
 				}).then(function(res){
 					if (res.data.res == 1) {
 						$(".dianfa").hide(); //  【影藏 获取验证码】
		                $(".Times").show(); //  【显示 60秒】
		                time = setInterval(function() { //   countdown  倒计时器
		                    secode--;
		                    $(".Times").text(secode + "秒");
		                    if (secode < 0) {
		                        clearInterval(time);
		                        secode = 90;
		                        $(".Times").text(secode + "秒");
		                        $(".dianfa").show();
		                        $(".Times").hide();
		                    }
		                }, 1000); // countdown  倒计时器
 					}
 				})
 			},
 			//注册账号
            registered:function(){
            	var that = this;
            	var code = that.code;
                console.log(code)
            	if (code == '') {
            		alert('验证码错误')
    				return false
            	}
 				var phone = that.phone;
 				if(!(/^1[3|4|5|7|8][0-9]\d{8}$/.test(phone))){ 
					alert('手机号码错误')
    				return false
 				}
 				axios({
 					method:"post",
 					url:'https://www.aftdc.com/business/Enrol/enrol_initial',
 					data:{
 						phone:phone,
 						code:code,
 					},
                    header: {
                        'content-type': 'application/json',
                    },
 				}).then(function(res){
 				    console.log(res.data)
                    var i = res.data.info
                    var t = res.data.token;
                    var res = res.data.res;
 					if (res == 1) {
                        alert(i)
                        sessionStorage.setItem("token",t);
                        location.href = './enrol_initial.html'
                    } else if (res == 2) {
                        alert(i)
                        sessionStorage.setItem("token",t);
                        location.href = './wait.html'
                    } else if(res == -3){
                        sessionStorage.setItem("code_token",i);
                        alert(i)
                        that.code_token = '';
                        that.token = 'none';
                    } else {
 					    alert(i)
                    }
 				})
            },
            //重新获得TOKEN
            open:function(){
                var that = this;
                var phone = that.phone;
                var code_code = that.code_code;
                if (code_code == '') {
                    alert('验证码错误')
                    return false
                }
                axios({
                    url:'/business/Enrol/code_token',
                    method:'post',
                    data:{
                        phone:phone,
                        code_code:code_code,
                    }
                }).then(function(res){
                    var i = res.data.info
                    var res = res.data.res;
                    if (res == 1){
                        alert(i)
                        sessionStorage.removeItem("code_token");
                        top.location.reload()
                    } else {
                        alert(i)
                    }
                })
            },
        }
    })
}