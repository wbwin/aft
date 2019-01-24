
var evaluate=new Vue({
	el:"#aptitude",
	// this.$emit
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

 },
 created:function(){
	// var ok=this.ok
    // this.ok=data.ok
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
  switch (togle)
  {
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
// rest:function(){
// 	alert('正在上传')
// },
// 上传图片后执行的事件
upImgFn:function(index){
	var img=this.imgData[index].upImg;
	var shop_id = window.localStorage.getItem("shopId");
	var formData = new FormData();
	var _self = this
    var infoData=[]
	formData.append("file",img);
	formData.append("shopId",shop_id);
	formData.append("ImgType",index);
	// _self.rest()
	$.ajax({
		url : 'https://www.aftdc.com/index.php/wxapp/shops/identify',
		type : 'POST',
		data : formData,
		processData : false,
		contentType : false,
		success : function(res) {
			// console.log(res)
			if (res.error == false) {
				alert(res.info)
				return false;
			}
			if (index == 0) {
				_self.infoData[1].val='';
				_self.infoData[2].val='';
			}
			if (index == 3) {
				_self.infoData[4].val='';
				_self.infoData[5].val='';
				_self.infoData[6].val='';
				_self.infoData[7].val='';
				_self.infoData[8].val='';//重新输出归零
			}
			if (index == 4) {
				_self.infoData[10].val = '';//不必必填证件内容
				_self.infoData[11].val = '';
				_self.infoData[12].val = '';
				_self.infoData[13].val = '';
				_self.infoData[14].val = '';
			}
			if (index == 5) {
				_self.infoData[15].val='';
			}
			if (index == 1 && res!=false) {
            	_self.reverse=1;//身份证反面
            }
            if (res.confidence>50) {
            	_self.identify=1;//手持对比
            }
            // var json = JSON.parse(all);
            if (res[6] == "正") {
            	// _self.datas=res;
				_self.infoData[1].val=res[2];
				_self.infoData[2].val=res[3];
				// _self.yy[2].index=res.poorly;
            }
            if (index == 5 && res[2] == '银') {
              _self.infoData[15].val = res[0];//银行
            }
            if (index == 3 && res[6]=='营') {
				_self.infoData[4].val = res[1];//必填证件内容
				_self.infoData[5].val = res[0];
				if (res[4] == "无") {
				res[4] = res['shopAddress'];
				}
				_self.infoData[6]['val'] = res[4];
				_self.infoData[7]['val'] = res[2];
				var time = res[5];
				if (time == "长期") {
				_self.typeRadio = '长期有效';
				} else {
				_self.infoData[8]['val'] = res[5];
				_self.typeRadio = '固定日期';
				}
            }
            if (index == 4 && res[6]=='营') {
				_self.infoData[10].val = res[1];//不必必填证件内容
				_self.infoData[11].val = res[0];
				if (res[4] == "无") {
				res[4] = res['shopAddress'];
				}
				_self.infoData[12]['val'] = res[4];
				_self.infoData[13]['val'] = res[2];
				var time = res[5];
				if (time == "长期") {
				_self.allowRadio = '长期有效';
				} else {
				_self.infoData[14]['val'] = res[5];
				_self.allowRadio = '固定日期';
				}
            }
            // if (true) {}
		},
	});
},

//---------------------------  确定  --------
formSubmit:function(){

  var infoData=this.infoData

   var formData={};
  var len=infoData.length;
  for(let i=0;i<len;i++){
  	var name=infoData[i].name
  	 formData[name]=infoData[i].val
  }
  // var shop_id = window.localStorage.getItem("shopId");
  var backImg = this.imgData[0].upImg;//身份证正面照
  var faceImg = this.imgData[1].upImg;//身份证反面照
  var handImg = this.imgData[2].upImg;//身份证手持
  var unitImg = this.imgData[3].upImg;//证件照片
  var allowImg = this.imgData[4].upImg;//可不填证件照片
  var shop_id = window.localStorage.getItem("shopId");
  var typeRadio = this.typeRadio;//证件有效期
  var allowRadio = this.allowRadio;//证件有效期
  formData['unitRadio'] = typeRadio;
  formData['allowRadio'] = allowRadio;
  formData['shop_id'] = shop_id;
	if (formData['IdentityNo'] == '' && formData['bankUserName'] == ''){
	  alert('身份证未识别')
	  return false;
	}
	// if (!/^([1-9]{1})(\d{14}|\d{18})$/.test(formData['bankNo'])) {
	// 	alert('银行卡错误')
	// 	return false;
	// }
	if (formData['bankNo'] == '') {
		alert('请上传银行卡')
		return false;
	}
	if (formData.unitName == '' || formData.unitNumb == '' || formData.unitAdres == '' || formData.unitPeople == '') {
	  alert('营业执照未识别')
	  return false;
	}
	if (formData.unitPeople != formData.bankUserName){
      alert('持证人要一致')
      return false;
    }
	if (allowImg) {
		var five =5;
	}else {
		var five =4;
	}
	var unm = 0;
	var ok = window.localStorage.getItem('ok')
	var reverse = this.reverse;
	if (reverse == 0) {
		alert('请上传正确的反面照')
		return false
	}
	var identify = this.identify;
	if (identify == 0) {
		alert('请上传正确的手持身份证')
		return false
	}
	this.disabled = true;//不能连续点击
	$.ajax({
   	 url: 'https://www.aftdc.com/index.php/Business/Request/detailed',
   	 type:"post",
   	 data:formData,
   	 success:function(res){
   	 	// console.log(res)
         if (res.res == 1) {
         	if (backImg) {
				var formData = new FormData();
				formData.append("file",backImg);
				formData.append("shopId",res.id);
				formData.append("ImgType",6);
				$.ajax({
				    url : 'https://www.aftdc.com/index.php/wxapp/shops/updimg',
				    type : 'POST',
				    data : formData,
				    processData : false,
				    contentType : false,
				    success : function(a) {
				    	unm++
				    	if (unm == five) {
				    		if (ok == 1) {
				    			location.href="http://aftdc.com/index.php?m=Business&c=Request&a=wait";
				    		} else {
				    			location.href="http://aftdc.com/index.php?m=Business&c=Request&a=scheme";
				    		}
				    	}
				    },
				});
         	}
         	if (faceImg) {
				var formData = new FormData();
				formData.append("file",faceImg);
				formData.append("shopId",res.id);
				formData.append("ImgType",7);
				$.ajax({
				    url : 'https://www.aftdc.com/index.php/wxapp/shops/updimg',
				    type : 'POST',
				    data : formData,
				    processData : false,
				    contentType : false,
				    success : function(b) {
				    	unm++
				    	if (unm == five) {
				    		if (ok == 1) {
				    			location.href="http://aftdc.com/index.php?m=Business&c=Request&a=wait";
				    		} else {
				    			location.href="http://aftdc.com/index.php?m=Business&c=Request&a=scheme";
				    		}
				    	}
				    },
				});
         	}
         	if (handImg) {
				var formData = new FormData();
				formData.append("file",handImg);
				formData.append("shopId",res.id);
				formData.append("ImgType",8);
				$.ajax({
				    url : 'https://www.aftdc.com/index.php/wxapp/shops/updimg',
				    type : 'POST',
				    data : formData,
				    processData : false,
				    contentType : false,
				    success : function(c) {
				    	unm++
				    	if (unm == five) {
				    		if (ok == 1) {
				    			location.href="http://aftdc.com/index.php?m=Business&c=Request&a=wait";
				    		} else {
				    			location.href="http://aftdc.com/index.php?m=Business&c=Request&a=scheme";
				    		}
				    	}
				    },
				});
         	}
         	if (unitImg) {
				var formData = new FormData();
				formData.append("file",unitImg);
				formData.append("shopId",res.id);
				formData.append("ImgType",9);
				$.ajax({
				    url : 'https://www.aftdc.com/index.php/wxapp/shops/updimg',
				    type : 'POST',
				    data : formData,
				    processData : false,
				    contentType : false,
				    success : function(d) {
				    	unm++
				    	if (unm == five) {
				    		if (ok == 1) {
				    			location.href="http://aftdc.com/index.php?m=Business&c=Request&a=wait";
				    		} else {
				    			location.href="http://aftdc.com/index.php?m=Business&c=Request&a=scheme";
				    		}
				    	}
				    },
				});
         	}
         	if (allowImg) {
				var formData = new FormData();
				formData.append("file",allowImg);
				formData.append("shopId",res.id);
				formData.append("ImgType",10);
				$.ajax({
				    url : 'https://www.aftdc.com/index.php/wxapp/shops/updimg',
				    type : 'POST',
				    data : formData,
				    processData : false,
				    contentType : false,
				    success : function(e) {
				    	unm++
				    	if (unm == five) {
				    		if (ok == 1) {
				    			location.href="http://aftdc.com/index.php?m=Business&c=Request&a=wait";
				    		} else {
				    			location.href="http://aftdc.com/index.php?m=Business&c=Request&a=scheme";
				    		}
				    	}
				    },
				});
         	}
         } else {
         	alert(res.info)
         	location.href="http://aftdc.com/index.php?m=Business&c=Request&a=wait";
         }
   	 }
   })
  },


}

})

