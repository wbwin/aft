window.onload = function(){
	var app = new Vue({
		el: "#wait",
        data: {
            a: '#fdf5e6',
            b: '#fdf5e6',
            c: '#fdf5e6',
            d: '#fdf5e6',
            one: '',
            two: '',
            three: '',
            phone:'',//手机号码
            shop:'需完善',//店铺信息
            oneself:'需完善',//资质信息
            distribution:'需完善',//合作犯案
            info:[],//全部数据
            logo:'',//logo图片
            why:'none',//注销留言
            cause:'',//注销原因
            rihter:'',//注销div
            del:'none',//删除div
            give:'none',//支付按钮
            dcwef:'none',//弹出窗支付
            code:'',//支付码
            pwd:'none',//密码弹出窗
            cipher:'none',//密码按钮
            enter:'',//输入密码
            again:'',//再次输入密码
            i:0,//超过20次退出页面
            token:'',
        },
        created:function(){
			var that = this;
            var token = sessionStorage.getItem("token");
            axios({
                url:"/business/Enrol/understand",
                method:"post",
                data:{
                    token:token,
                },
            }).then(function(res){
                if(res.data.res == 1){
                    that.phone = res.data.phone;
                    console.log(res.data.phone)
                    sessionStorage.setItem("token",res.data.token);
                    that.token = res.data.token;
                    that.page()
                } else {
                    alert(res.data.info)
                    location.href = './registered.html';
                }
            })

        },
        methods:{
			//页面数据
            page:function(){
            	var that = this;
                var phone = that.phone;
                console.log(phone)
                if (!phone) {
                    alert('缺少重要数据');
                    location.href = './registered.html';
                    return false
                }
                var token  = sessionStorage.getItem("token");
                if (!token){
                    alert('丢失重要数据,请重试')
                    location.href = './registered.html';
                    return false
                }
                var that = this;
                axios({
                    url:'/business/Enrol/enrol_state',
                    method:'post',
                    data:{
                        phone:phone,
                        token:token,
                    },
                }).then(function(res){
                    var all = res.data;
                    console.log(all)
                    that.info = all.data;
                    that.logo = 'https://image.aftdc.com/'+that.info.shopImg;
                    if (all.shop_message.res == 1) {
                        that.shop = '已完善';
                        that.one = 'none';
                    }
                    if (all.oneself_message.res == 1) {
                        that.oneself = '已完善';
                        that.two = 'none';
                    }
                    if (all.distribution.res == 1) {
                        that.distribution = '已完善';
                        that.three = 'none';
                    }
                    if (all.password.res == 1) {
                        that.cipher = '';
                    }
                    that.a = 'red';
                    if (all.shop_message.res == 1&&all.oneself_message.res == 1&all.distribution.res == 1) {
                        that.b = 'red';
                        that.a = '#fdf5e6';
                    }
                    if (all.data.shopStatus == 2) {
                        that.cece();//轮询
                        that.code = all.WxpayCode;//二维码
                        that.give = '';
                        that.c = 'red';
                        that.b = '#fdf5e6';
                        that.a = '#fdf5e6';
                    }
                    if (all.data.shopStatus == 3) {
                        that.d = 'red';
                        that.c = '#fdf5e6';
                        that.b = '#fdf5e6';
                        that.a = '#fdf5e6';
                    }
                    if (all.data.shopStatus == -2) {
                        that.rihter = 'none';
                        that.del = '';
                        that.d = 'fdf5e6';
                        that.c = '#fdf5e6';
                        that.b = '#fdf5e6';
                        that.a = '#fdf5e6';
                    }
                })
			},
        	//轮询
        	poll:function(){
        		var that = this;
                var token  = sessionStorage.getItem("token");
                if (!token){
                    alert('丢失重要数据,请重试')
                    location.href = './registered.html';
                    return false;
                }
                var i = that.i;
                that.i++
                if (i>10) {
                    location.href='./registered.html';
                }
        		var phone = that.phone;
        		axios({
        			url:'/business/Enrol/enrol_payment',
        			method:'post',
        			data:{
        				phone:phone,
                        token:token,
        			},
        		}).then(function(res){
        			var all = res.data;
        			console.log(res.data)
        			if (all.create_shops) {
        				clearInterval(that.poll());
        				top.location.reload()
        			}
        		})
        	},
        	cece:function(e){
        		var that = this;
				setInterval(function(){ 
		            that.poll();
		        },3000)
        	},
        	//弹出二维码与关闭
        	tanchu:function(e){
        		console.log(e)
        		if (e == 1) {
        			this.dcwef = '';
        		} else if (e == 2) {
        			this.dcwef = 'none';
        		}
        	},
        	//修改跳转
        	url:function(e){
        		if (e == 1) {
        			location.href="./aptitude.html";
        		} else if (e == 2) {
        			location.href="./scheme.html";
        		}
        	},
        	//点击注销
        	zhuxiao:function(){
        		this.why = '';
        	},
        	//取消注销
        	off:function(){
        		this.why = 'none';
        	},
        	//注销店铺
        	refund:function(){
                var token  = sessionStorage.getItem("token");
                if (!token){
                    alert('丢失重要数据,请重试')
                    location.href = './registered.html';
                    return false;
                }
			 	var that = this;
			    var applyMoney = that.info.applyMoney;//当前该店铺的注册金额
			    var shopId = that.info.shopId;//当前该店铺的shopId
			    var cause = that.cause;//注销原因
			    var tranId = that.info.tranId;//当前该店铺的支付订单
			    var timeend = Date.parse(new Date());//注销时间
			    var createTime = that.info.createTime;//当前该店铺的修改时间
			    var shopName = that.info.shopName;//当前该店铺的店铺名称
			    axios({
			    	url:'/business/Enrol/enrol_cancel',
			    	method:'post',
			    	data:{
						cause: cause,
						applyMoney: applyMoney, 
						shopId: shopId,
						tranId: tranId,
						timeend:timeend,
						createTime: createTime,
						shopName: shopName,
                        token:token,
			    	},
			    }).then(function(res){
			    	console.log(res)
			    	top.location.reload()
			    })
        	},
        	//删除店铺
        	activate:function(){
                var token  = sessionStorage.getItem("token");
                if (!token){
                    alert('丢失重要数据,请重试')
                    location.href = './registered.html';
                    return false;
                }
        		var shopId = this.info.shopId;//当前该店铺的shopId
    			var phone = this.phone;
    			axios({
    				url:'/business/Enrol/enrol_delete',
    				method:'post',
    				data:{
    					shopId: shopId,
						phone: phone,
                        token:token,
    				},
    			}).then(function(res){
    				if (res.data.res == 1) {
    					location.href="./registered.html";
    				} else {
    					alert('失败');
    				}
    			})
        	},
        	//点击设置密码
        	mount:function(){
        		this.pwd='';
        	},
        	//保存密码
        	password:function(){
                var token  = sessionStorage.getItem("token");
                if (!token){
                    alert('丢失重要数据,请重试')
                    location.href = './registered.html';
                    return false;
                }
        		var that = this;
        		var enter = that.enter;
        		var again = that.again;
        		var phone = that.phone;
        		if (!again) {
        			alert('请输入密码')
        			return false
        		}
        		if (enter!=again) {
        			alert('密码不相等')
        			return false
        		}
        		axios({
        			url:'/business/Enrol/enrol_password',
        			method:'post',
        			data:{
        				phone:phone,
        				login_password:again,
						token:token,
        			},
        		}).then(function(res){
        			console.log(res)
        			if (res.data.res == 1) {
        				alert(res.data.info)
        				location.href="https://www.aftdc.com/business/Login/index.html";
        			} else {
        				alert(res.data.info)
        			}
        		})
        	}
        },
	})
}