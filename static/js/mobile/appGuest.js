var chartOrder;
var chartTrend;
// 过滤器
Vue.filter('abs', function(value) {
	return Math.abs(value);
});
var app=new Vue({
	el:'#guest',
	data:{
		shopId:0,
		choice:1,
		dateChoice:1,
		orderNum:[],//下单人数的图例数据
		date:'',//时间
		yed:'',
		yedt:'',
		counts:1,
		day:0,

        orderCount:0,//下单顾客
        subOrder:0,
        newOrderNum:0,//新客
        newOrderSub:0,
        newOrderPer:0,
        oldOrderNum:0,//老客
        oldOrderSub:0,
        oldOrderPer:0,
        reOrderNum:0,//重复顾客
        reOrderSub:0,
        reOrderPer:0,

      //顾客偏好---------
      likeChoice:1,
      customerLike:[],
      likeNumb:6,

      //顾客结构----------
      structChoice:0,
      brisk:[],//顾客活跃度数据
      customerNum:[],//成交频次
      customerPay:[],//成交金额
      groupState:false,
      popTimeState:false,//时间选择弹出框
     // timeArr:{active:30,silent:60,loss:120},//顾客活跃度设置
      timeArr:[
      		{name:'活跃顾客',val:30},{name:'沉默顾客',val:60},{name:'流失顾客',val:90},
      ],
       timeArrBox:[
      		{name:'活跃顾客',val:30},{name:'沉默顾客',val:60},{name:'流失顾客',val:90},
      ],
      timeFor:[],
      timeH:0,
      maskH:0,
      reckonNumb:0,
      timeIndex:-1,//弹出框的索引，用于设置完成时操作timeArr
      frameTime:1,//顾客价值时间选择索引
  },
	created: function() {
        this.shopId = this.getQueryString('shopId');
	},
  mounted: function() {
	 	//渲染顾客结构的图例
	 	this.dataRequest(1)
	 },
	 methods: {
	 	choiceFn:function(index){
            var that=this;
	 		if (index === 2 && that.structChoice === 1 || that.structChoice === 2){
                that.structChoice = 0;
	 			document.getElementById("cakeChart").innerHTML='';
	 		}
	 		that.choice=index;
	 		this.$nextTick(function(){
	 			if(index===1){
	 				that.structChoice = 0;
   		 this.ordersFn();//渲染总览
		if (that.dateChoice !== 1) {
			this.trendFn()
		}
   		}else if(index===3){
            that.structChoice = 1;
            var shopId=this.shopId;
            var timeArr=$.cookie('timeArr'+shopId);
            if(Boolean(timeArr)){
            	try{
            	timeArr=JSON.parse(timeArr);
            	that.timeArr=timeArr;
            	that.timeArrBox=timeArr;
            	$.cookie('timeArr'+shopId,JSON.stringify(timeArr),{ expires: 7 })
            	}catch(e){
            		console.log("cook=>timeArr 错误")
            	}
            }
	          //根据设置的活跃度时间查询数据
				that.briskFn();	
   		}
   	})

	 	},
  //----------- 顾客数据------
  dateFn:function(index){
  	this.dateChoice=index;
  	this.$nextTick(function(){
  		var days=0;
  		switch(index)
  		{
  			case 1: days=1; break;
  			case 2: days=7; break;
  			case 3:days=30; break; 
  		}
  		this.day=days;
  		this.dataRequest(days)	

  	})
  },
//根据日期查询数据
dataRequest:function(days){
	var that=this;
	$.ajax({
		url:'https://www.aftdc.com/mobile/Manage/getAnalyGuest',
		data:
		{
			day:days,
			shopId:that.shopId,
		},
		type:'post',
		success:function (res) {
			that.date=res.data.date;
			that.orderNum=res.data.order;
			that.nowOrder=res.data.order;
			var ed=res.data.ed;

			var newOrderNum,oldOrderNum,orderCount;
			var newOrderSub,oldOrderSub,subOrder;
			
			var reOrderNum=0;
			if(res.data.yed&&res.data.yedt){

				that.customerLike=res.data.customerLike; //顾客偏好的爱买的商品

				that.yed=res.data.yed;
				that.yedt=res.data.yedt;
				var len=res.data.order.length;
	             orderCount=res.data.order[len-1].value;//获取昨日下单人数
	            var QorderCount=res.data.order[len-2].value;//获取前日日下单人数
	            //比较
	            subOrder=orderCount-QorderCount;
	            newOrderSub= res.data.yed.newOrderNum- res.data.yedt.newOrderNum;
	            oldOrderSub= res.data.yed.oldOrderNum- res.data.yedt.oldOrderNum;
	            //人数
	            newOrderNum=res.data.yed.newOrderNum;
	            oldOrderNum=res.data.yed.oldOrderNum;

	        }else{
	        	//人数
	        	reOrderNum=res.data.reOrderNum;
				that.reOrderNum=reOrderNum;//重复顾客
				orderCount=res.data.orderCount;
				newOrderNum=res.data.newOrderNum;
				oldOrderNum=res.data.oldOrderNum;
				 //比较
				 subOrder= orderCount-ed.orderCount;
				 newOrderSub= newOrderNum-ed.newOrderNum;
				 oldOrderSub= oldOrderNum-ed.oldOrderNum;
				 reOrderSub= reOrderNum-ed.reOrderNum

				}

		if(orderCount>0){//比例
			that.newOrderPer=Math.round(newOrderNum /orderCount  * 10000) / 100.00 + "%";
			that.oldOrderPer=Math.round(oldOrderNum /orderCount  * 10000) / 100.00 + "%";
			that.reOrderPer=Math.round(reOrderNum /orderCount  * 10000) / 100.00 //重复下单率
		}else{
			that.newOrderPer='0%';
			that.oldOrderPer='0%';
                that.reOrderPer='0'//重复下单率
            }


         	that.newOrderNum=newOrderNum;//新客人数
			that.oldOrderNum=oldOrderNum;//老客人数
			that.orderCount=orderCount;//下单人数

			that.newOrderSub=newOrderSub;//新客比较人数
			that.oldOrderSub=oldOrderSub;//老客比较人数
			that.subOrder=subOrder;//下单比较人数
      // 渲染图表
      that.ordersFn();
      if(days !== 1){
      	that.trendFn()
      }
  }
})
},
chooseCount:function(index){
	this.counts=index;
	var that=this;
	var day=that.day;
	if(index>1)
	{
		$.ajax({
			url:'https://www.aftdc.com/mobile/Manage/getConsumer',
			data:{
				index:index,
				day:day,
				shopId:that.shopId,
			},
			type:'post',
			success:function (res) {
				that.orderNum=res.data;
				that.trendFn()
			}
		})
	}
	else
	{
		that.orderNum=that.nowOrder;
		that.trendFn()
	}

},

// *********************************  顾客偏好  *******************************
likeChoiceFn:function(index){
	this.likeChoice=index
},
likeNumbFn:function(){
	this.likeNumb=this.likeNumb < 10?100:6
},


//*********************************  顾客结构  ***********************************

structFn:function(index){
	this.structChoice=index;
	this.$nextTick(function(){
		if(index===1){
			this.cakeChartFn()
		}else{
			var customerNum = this.customerNum;//成交频次
             var customerPay=  this.customerPay;
             if(!customerNum || customerNum.length===0 || !customerPay || customerPay.length===0){
             	this.customerFn(7);//查询顾客价值的数据
             } else {
                 this.priceFn({
                     id:"frequency",
                     data:this.customerNum
                 });
                 this.priceFn({
                     id:"moneyPillar",
                     data:this.customerPay
                 });
			 }
		}
	})

},
//顾客价值时间选择
frameTimeFn:function(index){
	this.frameTime=index;
	var day=0
	switch (index)
	{
		case 1: day=7;break;
		case 2: day=30;break;
		case 3: day=90;break;
	}
	this.customerFn(day)
},
customerFn:function(day){
  		var that=this
		$.ajax({
			url:'https://www.aftdc.com/mobile/Manage/customerValue',
			data:{
				day:day,
				shopId:that.shopId,
			},
			type:'post',
			success:function (res) {
                that.customerNum=res.data.customerNum;//成交频次
                that.customerPay=res.data.customerPay;//成交金额

                that.priceFn({
                	id:"frequency",
                	data:res.data.customerNum
                });
                that.priceFn({
                	id:"moneyPillar",
                	data:res.data.customerPay
                });
            }
		})
},
// 顾客分组显示隐藏
groupingFn:function(){
  this.groupState=!this.groupState;
},
//选择的是哪个活跃度的弹出
timeArrFn:function(index){
	this.timeIndex=index
	var ins=index-1;
	var state=ins>=0?this.timeArrBox[ins].val:15;
	var sum=[];

	while(state<=120){
       sum.push(state);
       state=state+15;	
	}

	this.timeFor=sum;
	this.popTimeState=true;

	this.$nextTick(function(){
	var timeH=this.timeH;
	var maskH=this.maskH;
   if(!Boolean(timeH) || !Boolean(maskH)){
   	  let boxH=$(".choiceNumbBox").outerHeight();
      timeH=$(".numBox li").outerHeight();
      maskH=(boxH-timeH)/2;
      this.timeH=timeH;
      this.maskH=maskH;
     var that=this
       $('.choiceNumb').off("scrollstop")
      $('.choiceNumb').on("scrollstop",function(){
  		 // console.log("停止滚动!");
  		let scrolt=$(this).scrollTop()
  		let reckonNumb=Math.round(scrolt/timeH);
  		$(this).scrollTop(reckonNumb*timeH);
  		that.reckonNumb=reckonNumb

});
 }

	})

},
// 选择时间完成
timeFinish:function(){
	var numb=this.timeFor[this.reckonNumb];
	var index=this.timeIndex;
	var timeArr=this.timeArrBox
	timeArr[index]['val']=numb;
	var len=timeArr.length-1;
	for(let i=index;i<len;i++){
		var n=timeArr[i].val;
		var e=timeArr[i+1].val;

		if(n>e){
			timeArr[i+1].val=timeArr[i].val
		}
	}
   
   this.timeArrBox=timeArr
	this.timeTogle();
},
// 选择时间取消
timeTogle:function(){
	this.popTimeState=!this.popTimeState;
	 $('.choiceNumb').scrollTop(0)
},
// 立即保存
groupKeep:function(){
 this.groupState=false;
 var timeArr=this.timeArrBox
  this.timeArr=timeArr;
  var shopId=this.shopId
   $.cookie('timeArr'+shopId,JSON.stringify(timeArr),{ expires: 7 })
  this.briskFn();
},
//根据设置的活跃度时间查询数据
briskFn:function(){
	var that=this
	let timeArr=this.timeArr
  let len=timeArr.length;
    let arr=[]
    for(let i=0;i<len;i++){
    	let start=i>0?timeArr[i-1].val:1;
    	let end=timeArr[i].val;
    	var obj={start:start,end:end};
    	arr.push(new Object(obj))
    }
    //arr=[{start:1,end:30},{start:30,end:60},{start:60,end:90}]
  	$.ajax({
		url:'https://www.aftdc.com/mobile/Manage/customer',
		data:{
            timeArr:JSON.stringify(arr),
			shopId:that.shopId,
		},
		type:'post',
		success:function(res)
		{
			 that.brisk=res.data;
             that.cakeChartFn()
		}
	})
},
//恢复默认
defaultSys:function () {
	var shopId=this.shopId
    $.cookie('timeArr'+shopId,null);
    this.groupingFn()
},
/**************************************** 图例**********************************************************/
  // 总览
ordersFn:function(){
    document.getElementById("orders").innerHTML = "";
  	var data=this.orderNum
  	var heig=document.getElementById("orders").clientWidth;
  	chartOrder = new G2.Chart({
        container: "orders", // 指定图表容器 ID
        forceFit: true,
        height : heig/3, // 指定图表高度
        padding: [ 5, 15, 25, 15 ] 
    });
  	const chart=chartOrder
  	chart.source(data); 
  // 指定度量(或称 列定义）
	chart.scale('month', {
		title: null,
		min: 0,
		range: [ 0 , 1 ],
	});
	chart.scale('value', {
		title: null,
		range: [ 0 , 1 ],
		tickCount: 3,

	});
	chart.tooltip(false)
  // 坐标轴
  chart.axis('value',{
	label:null,
	grid: false,
	tickLine: {
		lineWidth: 0,
		value: 3,
	},
   })
   chart.axis('month', {
	label:  {
		formatter: val => {
			if(val==data[0].month||val==data[data.length-1].month){
				return val ;
			}else{
				return ''
			}
		},
		offset:8,
		textStyle:{
			fill: '#9a9a9a'
		},
	},
	autoRotate:false,
	line:{
		lineWidth:0,
	},
	tickLine:{
		length:0,
	},
  });
     chart.area().position('month*value').color('#53beb7').opacity(0.2); //shape('smooth')起伏感
     chart.line().position('month*value').color('#53beb7').size(2);
     if(data.length<10){
     	chart.point().position('month*value').color('#53beb7').size(4).shape('circle')//点
     }
     
     chart.render();
 },
//********  趋势  ****
trendFn:function(){
    document.getElementById("trend").innerHTML = "";

	var beforeData=this.orderNum;
	var beforeLen=beforeData.length
	var data=[];

	for(var i=0;i<beforeLen;i++){

		beforeData[i].value=parseInt(beforeData[i].value*100)/100;
		data[i]=beforeData[i]
	}

	var heig=document.getElementById("trend").clientWidth
	chartTrend = new G2.Chart({
        container: 'trend', // 指定图表容器 ID
        forceFit: true,
        height : heig/2, // 指定图表高度
        padding: [ 5, 25, 35, 25 ] 
    });
	const chart=chartTrend
	chart.source(data); 
   // 指定度量(或称 列定义）
   	chart.scale('month', {
   		title: null,
   		range: [ 0 , 1 ],
   	});
   	chart.scale('value', {
   		title: null,
   		range: [ 0 , 1],
   		min: 0,
		// tickCount: 5,

	});
  //提示框
  chart.tooltip({
  	showTitle: false,
  	itemTpl: "<li>"+
  	"  <span  class='tooltipL'>{month}</span>"+
  	"<span class='tooltipR'>{value}<i class='fontCen'> 人</i></span>"+
  	"</li>",
  	crosshairs: {
  		type: 'y' ,
  		style: {
	    	stroke:'#53beb7' // 辅助线的颜色

	    }
	  }, // tooltip 辅助线配置
	});

 // 坐标轴
 chart.axis('value',{
 	label:null,
     	grid: { //网格
     		type: 'line',
     		lineStyle: {
     			stroke: '#9a9a9a',
     			lineWidth: 0.5,
     			lineDash: 1,
     		}
     	},
     	tickLine: {
     		lineWidth: 0,
     		value: 3,
     	},
     })
 chart.axis('month', {
 	label:  {
 		formatter: val => {
 			if(val==data[0].month||val==data[data.length-1].month){
 				return val ;
 			}else{
 				return ''
 			}

 		},
 		textStyle:{
 			fill: '#9a9a9a'
 		},
 		autoRotate:false,
 	},

 	tickLine:{
 		length:0,
 	},
		    grid: { //网格
		    	type: 'line',
		    	lineStyle: {
		    		stroke: '#9a9a9a',
		    		lineWidth: 0.5,
				lineDash: 1, //实线 [4,4]这种格式是虚线
			}
		},

	});
  // 应该改为最高和最低
	var monthStart=data[0].value;
	var lenz=Math.round(data.length/2);
	var monthEnd=data[lenz-1].value;

	chart.line().position('month*value').color('#53beb7').size(2).tooltip('month*value', (month, value) => {
		return {
			month, 
			value
			}; // 返回的参数名对应 itemTpl 中的变量名
		});
	chart.point().position('month*value').color('#53beb7').size(4).shape('circle');//点

	chart.render();
},
// 顾客活跃度
cakeChartFn:function (){

	var that=this;
		document.getElementById("cakeChart").innerHTML='';
	/*var brisk=[
	{name:"活跃客户",value:7},
	{name:"沉默客户",value:5},
	{name:"流失客户",value:3},
	];*/
	var brisk=that.brisk;
	
			//计算百分比
			var numbSum=0;
			var lens=brisk.length;
			for(var i=0;i<lens; i++){
				var value=parseInt(brisk[i].value);
				numbSum=numbSum+value
			}

			//没数据就不描绘图例
			if(numbSum===0){
				return false
			}

			for(var j=0;j< lens;j++){
				var vals=parseInt(brisk[j].value);
				var scale=(vals/numbSum)*100;
	
				scale=scale.toFixed(2);
				brisk[j].scale=scale
			}
			var data=brisk;

			//---------------
			var Stat = G2.Stat;
			var heig=document.getElementById("cakeChart").clientWidth;

			var chart = new G2.Chart({
				id: 'cakeChart',
				forceFit: true,
			    height :heig , // 指定图表高度
			    padding: [ 16, 5, 16, 5 ] 
			});
			chart.source(data,{
				scale: {
					formatter: val => {
						val = val  + '%';
						return val;
					}
				}
			});
			// 重要：绘制饼图时，必须声明 theta 坐标系
			chart.coord('theta', {
				radius: 1 // 设置饼图的大小
			});
			chart.legend(false);

			chart.tooltip({
				showTitle: false,
			});
			//统计函数  label(Stat.summary.percent('y'));
			chart.intervalStack().position('value').color('name', ['#04c2a9', '#3ca0db', '#1e7fa9']).label('scale', {
				offset: -25,
				textStyle: {
					rotate: 0,
					textAlign: 'center',
					shadowBlur: 2,
					shadowColor: 'rgba(0, 0, 0, .45)'
				}
			});
			chart.render();
		},
// 顾客价值
priceFn:function (variable){
	let {id,data}=variable;
	// const data = [
	// { txt: '1(次)', numb: 38 },
	// { txt: '2(次)', numb: 52 },
	// { txt: '3(次)', numb: 61 },
	// { txt: '4(次)', numb: 45 },
	// { txt: '5(次及以上)', numb: 48 },
	// ];
		document.getElementById(id).innerHTML='';
	var heig=document.getElementById(id).clientWidth/1.8;
	const chart = new G2.Chart({
		container: id,
		forceFit: true,
		height: heig,
		padding: [ 5, 20, 5, heig/2.5 ] 
	});
	chart.coord().transpose(); 
	chart.source(data);
	chart.scale('numb', {
		tickInterval: 20,
		range:[0,1]
	});
	chart.scale('txt', {
		tickInterval: 20,

	});

	chart.axis('txt', {
		title: null,
		label: {
			offset:30,
			textStyle: {
	      textAlign: 'center', // 文本对齐方向，可取值为： start middle end
	      fill: '#888888', // 文本的颜色
	      fontSize: '12', // 文本大小
	      fontWeight: '400', // 文本粗细
	  }
	},
	line:{
		lineWidth:0.5,
	},
	tickLine:{
		length: 0,
	},
	subTickCount: 1,
	subTickLine: {
		length: 7,
		stroke: '#D0D0D0',
		lineWidth: 1
	},
});
	chart.axis('numb',{
		label:null,
		grid:null,
	});
	chart.interval().position('txt*numb').color("#4cdbc8").label('numb',{
		formatter:val=>{
			return val+'人'
		}

	});
	chart.render();
},
 //获取 URL 传过来的值
 getQueryString(name) {
	 var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	 var r = window.location.search.substr(1).match(reg);
	 if (r != null) return unescape(r[2]);
	 return null;
 },
         back(){
             history.back();
         }
}
});


/********************************************  顾客结构 ********************************************/


