var app=new Vue({
	el:"#scheme",
	data:{
		title : ["门店信息", "资质信息", "合作方案"],
		serveData:['顾客在线支付','在线结算','享受优质商家排名','专享活动'],
		choice:0,//配送选择 1为商家配送，2为阿凡提配送
		choiceTxt:[
			{ 
				name: '商家配送', per: '堂食、外卖每单收取3%服务费', 
				shili:[ '假设今日在线支付营业额4000元','应收服务费4000*3.00%=120.00元']
			},
			{		
				name: '阿凡提配送', per: '堂食每单收取3%服务费，外卖每单收取13%服务费',
				shili: ['假设今日堂食支付营业额4000元', '应收服务费4000*3.00%=120.00元',
				'假设今日外卖支付营业额3000元', '应收服务费4000*13.00%=520.00元'
				]
			}
		],
		giveDate:{},
		togle:0,//弹框选择的显示隐藏。
		phone:'',
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
                sessionStorage.setItem("token",res.data.token);
                that.token = res.data.token;
            } else {
                alert(res.data.info)
                location.href = './registered.html';
            }
        })
	},
	methods:{
		giveChange:function(index){
			this.choice=index
		},
		priceDetail:function(index){
			this.giveDate=this.choiceTxt[index];
			this.togle=1;
		},
		closeModel:function(){
			this.togle=0;
		},
		//提交
		submit:function(){
			var that = this;
            var token = sessionStorage.getItem("token");
            if (!token){
                alert('丢失重要数据,请重试')
                location.href = './registered.html';
                return false;
            }
			var choice=that.choice;
			console.log(choice)
			if (choice == '') {
				alert('请选择合作方案')
				return false;
			}
			var createTime = Date.parse(new Date());
			var phone = that.phone;
			axios({
				url:'/business/Enrol/enrol_distribution',
				method:'post',
				data:{
					dlvService:choice,
					createTime:createTime,
					phone:phone,
                    token:token,
				},
			}).then(function(res){
				if (res.data.res == 1) {
					alert(res.data.info)
					location.href="./wait.html";
				} else {
					alert(res.data.info)
				}
			})
		},
	}
})
