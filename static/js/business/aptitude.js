window.onload = function(){
	var app = new Vue({
		el:'#aptitude',
		components:{
			'my-input':{
				props: ['message'],
				template: '#inputs'
			},
			'my-img':{
				props: ['photo',],
				data:function(){
					return {
						hover:-1,//鼠标经过显示图片
					}
				},
				methods:{
					uploadFn:function(e){
					var that=this
					var target= event.target
					var tempFilePaths = target.files[0]; 
					this.photo['upImg']=tempFilePaths;
					let data = {
						a:'data'
					};
					var index=this.photo.index
					this.$parent.upImgFn(index)
					},
					imgReturn:function(datas){
						var url=window.URL.createObjectURL(datas);
						return url
					},
					//图片
					mouseenter:function(index){
						this.hover=index;
					},
					mouseover:function(){
						this.hover=-1;
					},
				},
				template: '#imgs',
			},
		},
		data:{
			message:'',
			photo : [],
			ok:0,
			title : ["门店信息", "资质信息", "合作方案"],
			infoData:[
				{
			        txt: '证件类型',//0
			        types: 'text',
			        name: 'cardClasfly',//input的name 
			        place: '选择',
			        val: '身份证',
			        moreFn:'more',
			        index:0,
			    },
			    {
			        txt: '真实姓名',//1
			        types: 'text',
			        name: 'bankUserName',//input的name 
			        place: '证件上的姓名',
			        val: '',
			        index: 1,
			    },
			    {
			        txt: '证件号码',//2
			        types: 'idcard',
			        name: 'IdentityNo',//input的name
			        place: '证件上的号码',
			        val: '',
			        index: 2,
			    },
			    {
			        txt: '证件类型',//3
			        types: 'text',
			        name: 'unitType',//input的name
			        place: '选择',
			        val: '营业执照',
			        moreFn: 'more',
			        index: 3,
			    },
			    {
			        txt: '单位名称',//4
			        types: 'text',
			        name: 'unitName',//input的name
			        place: '证件上的单位名称',
			        val: '',
			        index: 4,
			    },
			    {
			        txt: '注册号',//5
			        types: 'text',
			        name: 'unitNumb',//input的name
			        place: '证件对应注册号',
			        val: '',
			        index: 5,
			    },
			    {
			        txt: '注册地址',//6
			        types: 'text',
			        name: 'unitAdres',//input的name
			        place: '证件对应地址',
			        val: '',
			        index: 6,
			    },
			    {
			        txt: '法定代表人',//7
			        types: 'text',
			        name: 'unitPeople',//input的name
			        place: '证件上的营业者',
			        val: '',
			        index: 7,
			    },
			    {
			        txt: '有效期',//8
			        types: 'text',
			        name: 'unitFixed',//input的name
			        place: '选择固定时间',
			        val: '',
			        moreFn: 'more',
			        index: 8,
			    },
			      //---
			      {
			        txt: '证件类型',//9
			        types: 'text',
			        name: 'allowType',//input的name
			        place: '选择',
			        val: '',
			        moreFn: 'more',
			        index: 9,
			    },
			    {
			        txt: '单位名称',//10
			        types: 'text',
			        name: 'allowName',//input的name
			        place: '证件上的单位名称',
			        val: '',
			        index: 10,
			    },
			    {
			        txt: '许可证编号',//11
			        types: 'text',
			        name: 'allowNumb',//input的name
			        place: '证件对应编号',
			        val: '',
			        index: 11,
			    },
			    {
			        txt: '许可证地址',//12
			        types: 'text',
			        name: 'allowAdres',//input的name
			        place: '证件对应地址',
			        val: '',
			        index: 12,
			    },
			    {
			        txt: '法定代表人',//13
			        types: 'text',
			        name: 'allowPeople',//input的name
			        place: '证件上对应法定代表人',
			        val: '',
			        index: 13,
			    },
			    {
			        txt: '有效期',//14
			        types: 'text',
			        name: 'allowFixed',//input的name
			        place: '选择固定时间',
			        val: '',
			        moreFn: 'more',
			        index: 14,
			    },
			    {
			        txt: '银行卡',//14
			        types: 'text',
			        name: 'bankNo',//input的name
			        place: '填写银行卡号',
			        val: '',
			        moreFn: 'more',
			        index: 15,
			    },
			    {
			        txt: '银行',//14
			        types: 'text',
			        name: 'bankName',//input的name
			        place: '填写银行',
			        val: '',
			        moreFn: 'more',
			        index: 16,
			    },
		    ],
		    imgData:[
				{
					txt: '正面照',
					word: '请注意证件照片上的文字能够清晰辨认',
					exampleImg: 'images/papers1.jpg',
					upImg: '',//上传的图片
					name:'faceImg',//上传图片字段名
					index:0,
				},
				{
					txt: '反面照',
					word: '请注意证件照片上的文字能够清晰辨认',
					exampleImg: 'images/papers2.jpg',
					upImg: '',//上传的图片
					name: 'backImg',
					index: 1,
				},
				{
					txt: '手持正面照',
					word: '请参考示例照片拍摄，请勿遮挡或模糊',
					exampleImg: 'images/papers3.jpg',
					upImg: '',//上传的图片
					name: 'handImg',
					index: 2,
				},
				{ 
					txt: '资质照片',
					word: '证照照片需高清、完整、不能有遮挡，不能出现水印',
					exampleImg: 'images/setTyps.jpg',
					upImg: '',//上传的图片 餐饮许可证
					name: 'unitImg',
					index: 3,
				},
				{
					txt: '资质照片',
					word: '证照照片需高清、完整、不能有遮挡，不能出现水印',
					exampleImg: 'images/setAllow.jpg',
					upImg: '',//上传的图片
					name: 'allowImg',
					index: 4,
				},
				{
					txt: '银行卡照片',
					word: '证照照片需高清、完整、不能有遮挡，不能出现水印',
					exampleImg: 'images/setAllow.jpg',
					upImg: '',//上传的图片
					name: 'bankImg',
					index: 5,
				},
		    ],
		    time: { unitFixed: '', allowFixed: ''},//选择的固定时间
		    //身份证证件类型选择的index
			cardData: ['身份证', '港澳居民内地居住证', '台胞证', '护照',],
		    cardIndex: 0,//选择的index
		    //营业执照证件类型选择
			typeData: ['营业执照', '灵活就业（营业）辅导证/意见', '事业单位法人证书', '民办非企业单位登记证书','社会团体法人登记证书'],
			typeIndex: 0,//选择的index
			typeRadio:'固定日期',
			typeFixed:'', //具体固定时间
			//营业执照证件类型选择
			allowData: ['餐饮服务许可证', '食品经营许可证', '食品流通许可证', '食品摊贩临时经营公示卡', '全国工业产品生产许可证',
			'小徽餐饮分级证/登记凭证', '食品生产加工作坊准许证', '食品小作坊生产许可证', '食品小作坊登记证', '',
			'食品小作坊核准证','小作坊、小餐饮登记证/小摊点备案凭证', '食品摊贩备案证明', '小作坊卫生许可证', '食品摊贩登记卡',
			'食品经营实名备案证', '小餐饮经营许可证'
			],
			allowIndex: 0,//选择的index
			allowRadio: '固定日期',
			togle:0,//弹框选择的显示隐藏。1:证件类型 。2：主体资质。3:行业资质。
			reverse:0,//身份证反面
			identify:0,//对比
			disabled:false,
			phone:'',//手机号码
			// shopId:'',//店铺Id
			sfz:'',//身份证
			sc:'',//手持
            token:'',
		},
		//生命周期
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
			whole:function(){
		 		this.togle=0
		 	},
			togleFn:function(index){
				this.togle=index
			},
			//第二次点击隐藏
			togleDb:function(index) {
				var togle = this.togle
				if(index == togle) {
					this.togle = 0
				} else {
					this.togle = index
				}
			},
			//证件选择
			papers:function(index,txt){
			var that=this
			var togle=that.togle;
			switch (togle){
				case 1:
				that.typeIndex=index;
				that.infoData[0].val=txt;
				break
				case 2:
				that.cardIndex=index;
				that.infoData[3].val=txt;
				break
				case 3:
				that.allowIndex=index;
				that.infoData[9].val=txt;
				break
			}
			this.togle=0
			},
			//时间
			timeFn: function(index) {
			console.log(index)
				if(index==8){
					this.typeRadio="固定日期"
				}else if(index==14){
					this.allowRadio="固定日期"
				}
			},
			//选择长期有效时
			timeChange:function(index){
				this.infoData[index]['val']=""	
			},
			// 上传图片后执行的事件
			upImgFn:function(index){
				var that = this;
                var token  = sessionStorage.getItem("token");
                if (!token){
                    alert('丢失重要数据,请重试')
                    location.href = './registered.html';
                    return false;
                }
                var phone = that.phone;
                if (!phone){
                    alert('丢失重要数据,请重试')
                    location.href = './registered.html';
                    return false;
                }
				var imgName=that.imgData[index].upImg.name;//图片名称
				var file=that.imgData[index].upImg;//图片参数
				var filename = imgName;
				var index1 = filename.lastIndexOf(".");
				var index2 = filename.length;
				var suffix = filename.substring(index1, index2);//后缀名  
				axios({
					url:'https://www.aftdc.com/business/Enrol/oneself_imgname',
					method:'post',
					data:{
						name:suffix,
						phone:phone,
						type:index,
                        token:token,
					},
				}).then(function(res){
					console.log(res.data)
					var imgurl = 'https://image.aftdc.com/'+ res.data.name;//图片的路径
					var formData = new FormData();
					formData.append("key",res.data.name);
					formData.append("policy",res.data.oss.policy);
					formData.append("OSSAccessKeyId",res.data.oss.accessid);
					formData.append("success_action_status",'200');
					formData.append("signature",res.data.oss.signature);
					formData.append("file",file);
					axios({
						method: "post",
						url: res.data.oss.host,
						data: formData,
						processData: false,
                		contentType: false,
					}).then(function(res){
						if (res.status==200) {
							if (index == 0) {
								that.sfz = imgurl;//身份证
							}
							if (index == 2) {
								that.identify = 0;
								that.sc = imgurl;//手持
							}
							var identify = that.identify;
							var sfz = that.sfz;
							var sc = that.sc;
							if (identify!=1&& sfz && sc) {
								axios({
									url:'https://www.aftdc.com/business/Enrol/oneself_handheld',
									method:'post',
									data:{
										sfz:sfz,
										sc:sc,
                                        token:token,
									},
								}).then(function(ai){
									console.log(ai)
									if (ai.data[0] > 30) {
										that.identify = 1;
									}
								})
							}
							axios({
								url:'https://www.aftdc.com/business/Enrol/oneself_upload',
								method:'post',
								data:{
									file: imgurl,
									type: index,
                                    token:token,
								},
							}).then(function(res){
								var all = res.data;
								console.log(res)
								if (index == 0) {
									that.infoData[1].val='';
									that.infoData[2].val='';
								}
								if (index == 3) {
									that.infoData[4].val='';
									that.infoData[5].val='';
									that.infoData[6].val='';
									that.infoData[7].val='';
									that.infoData[8].val='';//重新输出归零
								}
								if (index == 4) {
									that.infoData[10].val = '';//不必必填证件内容
									that.infoData[11].val = '';
									that.infoData[12].val = '';
									that.infoData[13].val = '';
									that.infoData[14].val = '';
								}
								if (index == 5) {
									that.infoData[15].val='';
									that.infoData[16].val='';
								}
								if (all[1] == '反') {
					            	that.reverse=1;//身份证反面
					            }
					            if (all[6] == "正") {
									that.infoData[1].val=all[2];
									that.infoData[2].val=all[5];
					            }
					            if (all[5] == '银') {
									that.infoData[15].val = all[0];//银行
									that.infoData[16].val = all[3];//银行
					            }
								if (index == 3 && all[5]=='营') {
									console.log(index)
									that.infoData[4].val = all[1];//必填证件内容
									that.infoData[5].val = all[0];
									that.infoData[6]['val'] = all[3];
									that.infoData[7]['val'] = all[1];
									var time = all[4];
									if (time == "长期") {
										that.typeRadio = '长期有效';
									} else {
										that.infoData[8]['val'] = all[4];
										that.typeRadio = '固定日期';
									}
								}
								if (index == 4 && all[5]=='营') {
									that.infoData[10].val = all[1];//不必必填证件内容
									that.infoData[11].val = all[0];
									that.infoData[12]['val'] = all[3];
									that.infoData[13]['val'] = all[1];
									var time = all[4];
									if (time == "长期") {
									that.allowRadio = '长期有效';
									} else {
									that.infoData[14]['val'] = all[4];
									that.allowRadio = '固定日期';
									}
					            }
							})
						}
					})
				})
			},
			//确定
			formSubmit:function(){
                var that = this;
                var token  = sessionStorage.getItem("token");
                if (!token){
                    alert('丢失重要数据,请重试')
                    location.href = './registered.html';
                    return false;
				}
                var phone = that.phone;
                if (!phone){
                    alert('丢失重要数据,请重试')
                    location.href = './registered.html';
                    return false;
                }
				var infoData=that.infoData;
				var formData={};
				var len=infoData.length;
				for(let i=0;i<len;i++){
					var name=infoData[i].name
					formData[name]=infoData[i].val
				}
				formData['phone'] = that.phone;
				formData['createTime'] = Date.parse(new Date());
				var typeRadio = that.typeRadio;//证件有效期
				var allowRadio = that.allowRadio;//证件有效期
				formData['unitRadio'] = typeRadio;
				formData['allowRadio'] = allowRadio;
				if (formData['IdentityNo'] == '' && formData['bankUserName'] == ''){
					alert('身份证未识别')
					return false;
				}
				if (formData['bankNo'] == '') {
					alert('请上传银行卡')
					return false;
				}
				if (formData.unitName == '' || formData.unitNumb == '' || formData.unitAdres == '' || formData.unitPeople == '') {
					alert('营业执照未识别')
					return false;
				}
				// if (formData.unitPeople != formData.bankUserName){
				// 	alert('持证人要一致')
				// 	return false;
				// }
				var reverse = that.reverse;
				if (reverse == 0) {
					alert('请上传正确的反面照')
					return false
				}
				var identify = that.identify;
				if (identify == 0) {
					alert('请上传正确的手持身份证')
					return false
				}

                formData['token'] = token;
				this.disabled = true;//不能连续点击
				console.log(formData)
				axios({
					url:'https://www.aftdc.com/business/Enrol/enrol_oneself_message',
					method:'post',
					data:formData,
				}).then(function(res){
					if (res.data.res == 1) {
						alert(res.data.info)
						if (res.data.payOrderNo) {
							location.href="./wait.html";
						} else {
							location.href="./scheme.html";
						}
					} else {
						alert(res.data.info)
					}
				})
			}
		},
	})
}