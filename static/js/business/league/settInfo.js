var maps='';//地图标记选择
var app=new Vue({
	el:"#shop",
	data:{
		ok:0,
		message:'',
		title : ["门店信息", "资质信息", "合作方案"],
		 infoData: [
		      {
		      	 txt: '门店名称',
		        name: 'shopName',//input的name
		        place: '请与门店照上名称保持一致',
		        val: '',
		        errTxt:'门店名称不能为空',
		        index:0,
		      },
		      {
		        txt: '门店电话',
		        name: 'shopPhone',//input的name
		        place: '请输入外卖电话',
		        val: '',
		        errTxt:'请正确填写门店电话',
		        index:1,
		      },
		      {
		        txt: '联系人姓名',
		        name: 'name',//input的name
		        place: '请填写联系人姓名',
		        val: '',
		        errTxt:'请正确填写联系人姓名',
		        index:2,
		      },
		      {
		        txt: '联系人电话',
		        name: 'phone',//input的name
		        place: '联系人电话',
		        val: '13143545926',
		        errTxt:'请正确填写联系人电话电话',
		        index:3,
		      },
		],

        clasifyData:[{ name: '', child: [{name:'披萨意面',id:1}]},],//菜品分类
        rankId: { mainid: '', nextid:''},
        rankDataTxt: { main: '', next: '' },//主次营选择的文字,
        rankActive:-1,//索引

		switchs : 0, //是否24小时营业
		times: { start: '', end: '' }, //自定义时间 
     
		province : provinceList,
		city : [],
		town : [],
		address:['','',''],//地址的选择
		adrsNumb:[-1,-1,-1],//地址选择上的索引
		detailAddress:'',//详细地址
		mapsTxt:'',//地图定位获得的地址名字
		streetData:[],//搜索地址
		location:{lat:'',lng:''},//已选择经纬度
		maploca:{lat:'',lng:''},//地图经纬度

		partTime:[{ startH: "10", startM: "00", endH: "22", endM: "00" }],
		adrsNumb : { province: 0, city: 0, town: 0, },
		adrsTxt : { province: '-省-', city: '-市-', town: '-区/县-', },

		showTime : -1,
		endBan : { h: -1, m: -1 },
		shopPhoto : [
		{ 
			txt: " 门脸照 ", 
			tips: " 门脸照需拍出完整门匾，门框，需在餐厅开门营业状态下完成拍摄（建议正对门店2米处拍摄，支持JPG、JPEG、PNG格式，", 
			img: "images/shopImg2.jpg",
			upImg:'', //上传的数据
			okimg:'',//显示的图片
			name:'frontImg',
		},
		{ 
			txt: " 店内照片",
			 tips: " 店内照需真实反映用餐环境（收银台，用餐桌椅。支持JPG、JPEG、PNG格式，", 
			 img: "images/shopImg1.jpg",
			 upImg:'',  
			 okimg:'',//显示的图片
			  name: 'insideImg'
		},
		{  
		     txt: "门店logo", 
			 img: "Public/logo.png" ,
			 upImg:'',  
			 okimg:'',//显示的图片
			 name: 'logo'
		}, 
		],
        shopClas:"单店",//店铺类型 0单店，1；连锁
		infoClas : [], //门店分类
		showClass : false,
		clasTxt : [],
		adrsYes : 3,
		streetLeng : 0,
		selectClick:false,

		mapTrue:false,//是否在地图上点击确定获取地址

		judge : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //输入内容判断

		err:0,//错误判断

		togle:0,//弹框选择的显示隐藏。1:主营分类。2：次营分类。3:开始时间。4：结束时间。5:省。6:市。7:区。
		imgTogle:-1,

	},
	created:function(){
		var phone = sessionStorage.getItem('phone');
			this.infoData[3].val=phone;
	  var that=this;
	  var ok = 0;
	  this.ok=ok
	  // if(ok==1){
	  // 	 //数据查询//第一步店铺信息的
   //    // var userId = 188;
   //   $.ajax({
   //      url: "https://www.aftdc.com/index.php/wxapp/Shops/applyone",
   //      data:{
   //        userid:userId,
   //      },
   //      type:"post",
   //      success:function(all){
   //        var infoData = that.infoData;
   //        infoData[0].val = all.shopName;//门店名称
   //        infoData[1].val = all.shopPhone;//门店电话
   //        infoData[2].val = all.name;//联系人姓名
   //        infoData[3].val = all.phone;//联系人电话
   //        var shopPhoto = that.shopPhoto;
   //        shopPhoto[0].okimg = "https://www.aftdc.com/"+all.door_img;//门脸照
   //        shopPhoto[1].okimg = "https://www.aftdc.com/"+all.store_img;//店内照
   //        shopPhoto[2].okimg = "https://www.aftdc.com/"+all.shopImg;//门店logo
   //        var rankId = that.rankId;//门店分类
   //        rankId['mainid'] = all.mainid; //门店分类
   //        rankId['nextid'] = all.nextid;//门店分类
   //        var times = that.times;//营业时间
   //        times['start'] = all.timeone; //营业时间
   //        times['end'] = all.timeend;//营业时间
   //        var address = that.address;//省市区
   //        address[0] = all.address[0]; //省市区
   //        address[1] = all.address[1];//省市区
   //        address[2] = all.address[2];//省市区
   //        var location = {};//经纬度
   //        location.lng = all.longitude;//经纬度
   //        location.lat = all.latitude;//经纬度
   //        var rankDataTxt = { main: '', next: '' };//门店分类
   //        rankDataTxt.main = all.clasify1;//门店分类
   //        rankDataTxt.next = all.clasify2;//门店分类
   //        that.setData({
   //          info:all,//全局传递给wxml
   //          infoData: infoData,//前四个信息
   //          shopPhoto: shopPhoto,//三张图片
   //          rankId: rankId,//门店分类
   //          rankActive: all.mainid,//门店分类
   //          rankDataTxt: rankDataTxt,//门店分类
   //          shopClas: all.shopType,//单店/连锁店
   //          switchs:1,//营业时间更换自定义
   //          times: times,//营业时间更换自定义
   //          address:address,//门店地址
   //          location: location,//经纬度
   //          maploca:location,//地图经纬度
   //          mapsTxt: all.mapsTxt,//标记地图位置
   //          detailAddress:all.detailAddress,//详细地址
   //        })
   //      }
   //    })
   //      that.mapBox();
	  // }else{
	  // 	that.onloads();
	  // }
that.onloads();
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
setData:function(obj){
	var that=this
	try{
	  for(var i in obj){
        that[i]=obj[i]
	  }
	}catch(e){
       console.log("setData-err")
	}

},
onloads:function(){
	var that=this
  	//查询经纬度--------------
  	try {
  		$.ajax({
  			type: "get",
  			url: "https://apis.map.qq.com/ws/location/v1/ip?&key=CLWBZ-O7HKP-GFHDX-VYRP7-D57KK-EOFRX&output=jsonp",
  			dataType: 'JSONP',
  			success: function(res) {
  			
					that.location=res.result.location
					that.maploca=res.result.location
					that.mapBox()
				}
			});
  		　　 　
  	　　 } catch(err) {
  		　　 　　console.log(err,'经纬度错误')
  	　　}
    $.ajax({
    	url:"https://www.aftdc.com/index.php/wxapp/Shops/Classification",
    	data:{},
    	type:"POST",
    	success:function(res){
			that.clasifyData= res;
			console.log(res)
    	}
    })
},


//菜品分类
rankChoiceFn:function(index,idx){
   //index:大分类 。 小分类:idx;
    var togle = this.togle;
    var clasifyData = this.clasifyData
    var txt = clasifyData[index].child[idx].name
    var id= clasifyData[index].child[idx].id
    if (togle==1){
      this.rankId['mainid'] =id
      this.rankDataTxt['main'] = txt;
    }else if(togle==2){
      this.rankId['nextid'] = id
      this.rankDataTxt['next'] = txt;
    }
    this.rankActive = id;
     this.togle=0;
},
clasChoice:function(index){
  this.togle=index;
  if(this.togle==1){
  	this.rankActive=this.rankId['mainid']
  }else if(this.togle==2){
   this.rankActive=this.rankId['nextid']
  }
},
 // ------- 时间 ----

  stTime:function(s){
  	var sta=isNaN(s)?0:parseInt(s)
   return sta
  },
  endTime:function(e){
   var sta=isNaN(parseInt(e))?24:parseInt(e);
   return sta
  },
 timeChoice:function(t){
 	var togle=this.togle;
 	var tt=t>9?t:'0'+t;
 	tt=tt+":00"
 	if(togle==3){
      this.times['start']=tt
 	}else if(togle==4){
    this.times['end']=tt
 	}
 	this.togle=0
 },


//****************** 地址 *****************
//省市区
 selectAdres:function(index,key){
 	var that=this
  if(key==0){
    this.city=this.province[index].cityList
    var name = this.province[index].name;
   }else if(key==1){
    this.town=this.city[index].areaList
    var name = this.city[index].name;
   }else{
     var name = this.town[index];
   }
 	var address=this.address,adrsNumb=this.adrsNumb;
 	address[key]=name;
 	adrsNumb[key]=index
 	//比如选择市的时候，区应该置为空
   for(let i=0;i<3;i++){
     if(i>key){
       address[i]='';
 	   adrsNumb[i]=-1
     }
   };

   this.address=address;
   this.adrsNumb=adrsNumb;
   	this.togle=0
 },


mapBox:function(index){
	var that=this
	var location=this.maploca;
	var lat=location.lat,lng=location.lng;

	center = new qq.maps.LatLng(lat, lng);
	map = new qq.maps.Map(
		document.getElementById("container"), {
			center: center,
			zoom: 18,
		}
		);

	marker = new qq.maps.Marker({
		position: center,
		map: map
	});

	qq.maps.event.addListener(map, 'click', function(event) {
		//清除覆盖物的函数
		marker.setMap(null);

		map.panTo(new qq.maps.LatLng(event.latLng.getLat(), event.latLng.getLng())); //中心点				
		center = new qq.maps.LatLng(event.latLng.getLat(), event.latLng.getLng())

		//			var marker = new qq.maps.Label({
		//				position: center,
		//				map: map,
		//				content: address
		//			});

		//覆盖物
		marker = new qq.maps.Marker({
			position: center,
			map: map
		});
		//把经纬度解析成地址		
		geocoder = new qq.maps.Geocoder({
			complete: function(result) {
				console.log(result.detail);
				 that.streetData =  result.detail.nearPois
				maps = result.detail.nearPois[0]
				maps.title = maps.name

				info.open();
				info.setContent("<div class='adrsSure'><p class='title'>是否将该位置设置为门店位置</p><p class='adrstitle word'>" + maps.title + "</p><p class='adrstxt word'>" + maps.address + "</p><div class='but' onclick='infoSure()'>确定</div></div>");
				info.setPosition(center);
				mapYes = false
			}
		});

		var coord = new qq.maps.LatLng(event.latLng.getLat(), event.latLng.getLng());
		geocoder.getAddress(coord);

	});

	//添加到提示窗
	info = new qq.maps.InfoWindow({
		map: map
	});
   var selectClick=that.selectClick
	if(selectClick) {
		var locations=that.location
		if( locations.lng == maps.latLng.lng && locations.lat == maps.latLng.lat){	
          	info.open();
			info.setContent("<div class='adrsSure'><p class='title'>门店位置</p><p class='adrstitle word'>" + maps.title + "</p><p class='adrstxt word'>" + maps.address + "</p></div>");
			info.setPosition(center);
	    }else{
		    info.open();
			info.setContent("<div class='adrsSure'><p class='title'>是否将该位置设置为门店位置</p><p class='adrstitle word'>" + maps.title + "</p><p class='adrstxt word'>" + maps.address + "</p><div class='but' onclick='infoSure()'>确定</div></div>");
			info.setPosition(center);
	    }
	}

},
detailAdrs:function(val){
	var that=this
 	$(".mapChoice").show()
	$("#container").css({ "width": "80%", "left": "20%" })
	this.analysis(val)
},
//检测地址选择
selectDetail :function(index) {
		var datas = this.streetData[index];
		this.maploca=datas.latLng;
		this.selectClick = true
		datas.title=datas.name
		maps=datas
		this.mapBox()
	},
//去定位 地址解析
 analysis:function(adresVal) {
 	var that=this
	$.ajax({
		type: "get",
		url: "https://apis.map.qq.com/ws/geocoder/v1/?address=" + adresVal + "&key=AQMBZ-L4FCO-4VNWY-S5SGC-BNSG7-ALBIS&output=jsonp",
		dataType: 'JSONP',
		success: function(res) {
			if(res.status == 0) {
				that.maploca = res.result.location;
				that.selectClick=true
				that.mapBox();
			}

		}
	});

},

//上传图片
 uploadFn:function(event,index){
    var that=this
  	var target= event.target
  	var tempFilePaths = target.files[0]; 
  	 this.shopPhoto[index].upImg=tempFilePaths;
  	  var url=window.URL.createObjectURL(tempFilePaths);
  	//   console.log(index)
  	// return false;
  	 this.shopPhoto[index].okimg=url;
 },
 imgReturn:function(datas){
			 var url=window.URL.createObjectURL(datas);
			// return url
		   },
//下一步
formSubmit:function(){
  // return false
	var infoData=this.infoData;
    var lenif=infoData.length
    this.err=1;//错误
    var mapTrue=this.mapTrue;//在地图上选择定位确定
    var data={};
    data.latitude=this.location.lat;//经纬度
    data.longitude=this.location.lng;
    data.shopType =  this.shopClas;// 店铺类型
    data.province=this.address[0]; //"北京市-北京市-东城区"
    data.city=this.address[1]; //"北京市-北京市-东城区"
    data.county=this.address[2]; //"北京市-北京市-东城区"
    data.cuisineId = this.rankId['mainid'];//"主营"
    data.detailAddress=this.detailAddress;//"详细地址"
    data.shopAddress=this.mapsTxt;//"三元里广州市白云区政府(广园中路南)"
    // data.userId = 65;//---------------------------现在写死的
    data.shopName=infoData[0].val;//"门店名称"
    if (data.shopName == '') {
    	alert('请填写名称')
    	return false;
    }
    if (data.shopName.length>12) {
    	alert('名称限12字')
    	return false;
    }
    data.stores_phon=infoData[1].val;//"门店电话"
    data.userName=infoData[2].val;//"联系人"
    data.phone=infoData[3].val;//13845456356"
    if (!/^(0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8})|(400|800)([0-9\\-]{7,10})|(([0-9]{4}|[0-9]{3})(-| )?)?([0-9]{7,8})((-| |转)*([0-9]{1,4}))?$/.test(data.stores_phon)) {
    	alert('门店电话错误')
    	return false;
    }
    var switchs=this.switchs
    if(switchs==0){
	    data.timeone ="00:00";
	    data.timeend = "23:59";
    }else{
    	data.timeone = this.times['start'];
        data.timeend = this.times['end'];
    }
    data.createTime = Date.parse(new Date());
    for(var i in data){
    	if(!Boolean(data[i])){
    		alert("信息不完整")
    		return false
    	}
    }
    data.secondary = this.rankId['nextid'];//"次营
    //upImg
    var unm = 0;//上传数量
    var five = 3;//实际
    var door_img=this.shopPhoto[0].upImg;//门脸
    var okimgzore=this.shopPhoto[0].okimg;//
    if (okimgzore == '') {
    	alert('请上传门脸图')
    	return false
    }
    if (okimgzore.substr(22, 5) == "Public"){
    	data.door_img = okimgzore;
      five--
    }
    var store_img=this.shopPhoto[1].upImg;//店内okimg
    var okimgone=this.shopPhoto[1].okimg;//
    if (okimgone == '') {
    	alert('请上传店内图')
    	return false
    }
    if (okimgone.substr(22, 5) == "Public"){
    	data.store_img = okimgone;
      five--
    }
    var okimglogin=this.shopPhoto[2].okimg;//logo
    var shopImg=this.shopPhoto[2].upImg;//
    if (shopImg == '') {
    	alert('请上传logo图')
    	return false
    }
    if (okimglogin.substr(22, 5) == "Public"){
    	data.shopImg = okimglogin;
      five--
    }
   //分类
	$.ajax({
   	 url: 'https://www.aftdc.com/index.php/Business/Request/new_in',
   	 type:"post",
   	 data:data,
   	 success:function(res){
         if (res.res == 1) {
         	var shopId = res.id
         	if (five == 0) {
         		window.localStorage.setItem('shopId',shopId)
         		location.href="http://aftdc.com/index.php?m=Business&c=Request&a=aptitude";
         		return false;//没有上传新的图片
         	}
         	if (okimglogin.substr(22, 5) != "Public") {
				var formData = new FormData();
				formData.append("file",shopImg);
				formData.append("shopId",res.id);
				formData.append("ImgType",3);
				$.ajax({
				    url : 'https://www.aftdc.com/index.php/wxapp/shops/updimg',
				    type : 'POST',
				    data : formData,
				    processData : false,
				    contentType : false,
				    success : function(shopImg) {
				    	unm++
				    	if (unm == five) {
				    	    window.localStorage.setItem('shopId',shopId)
				    		location.href="http://aftdc.com/index.php?m=Business&c=Request&a=aptitude";
				    	}
				    },
				});
         	}
         	if (okimgzore.substr(22, 5) != "Public") {
         		var formData = new FormData();
				formData.append("file",door_img);
				formData.append("shopId",res.id);
				formData.append("ImgType",4);
				$.ajax({
				    url : 'https://www.aftdc.com/index.php/wxapp/shops/updimg',
				    type : 'POST',
				    data : formData,
				    processData : false,
				    contentType : false,
				    success : function(door_img) {
				    	unm++
				    	if (unm == five) {
				    		window.localStorage.setItem('shopId',shopId)
				    		location.href="http://aftdc.com/index.php?m=Business&c=Request&a=aptitude";
				    	}
				    },
				});
         	}
         	if (okimgone.substr(22, 5) != "Public") {
     			var formData = new FormData();
				formData.append("file",store_img);
				formData.append("shopId",res.id);
				formData.append("ImgType",5);
				$.ajax({
				    url : 'https://www.aftdc.com/index.php/wxapp/shops/updimg',
				    type : 'POST',
				    data : formData,
				    processData : false,
				    contentType : false,
				    success : function(store_img) {
				    	unm++
				    	if (unm == five) {
				    		window.localStorage.setItem('shopId',shopId)
				    		location.href="http://aftdc.com/index.php?m=Business&c=Request&a=aptitude";
				    	}
				    },
				});
         	}
         	
         } else {
         	alert(res.info)
         }
   	 }
   })

}



}

})













function infoSure(){
	$(".adrsSure .title").text("门店位置");
	$(".adrsSure .but").hide()
	 app.location = maps.latLng;//经纬度
	 app.mapTrue=true
    app.detailAddress=maps.address;
    app.mapsTxt=maps.name;

}