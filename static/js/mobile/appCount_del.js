var chartAll;//图例
var app=new Vue({
	el:'#count',
	data:{
		dataState:false,
        period:'',//时间段
        time: {start: '', end: ''},
        needPay:0,//营业总额
        effectiveOrder:0,//有效订单
        deduction:0,//商家补贴
        invalidOrder:0,//无效订单
        effectiveAmount:0,//有效单金额
        invalidAmount:0,//无效单金额
        customerPrice:0,//客单价
        nowadays:'',//今天
		dateChoice:1,
		chartData:[], //图例数据
		choiceData:['营业总额','订单收入','有效订单'], //可以选择显示的图例字段
		choice:0,     //显示索引
		days:false,
		shopId:0
	},
	created:function(){
        var shopId = this.shopId = this.getQueryString('shopId');
        var myDate = new Date();
        var ey = myDate.getFullYear();
        var em = myDate.getMonth() + 1;
        var ed = myDate.getDate();
        var end = ey + '-' + timeRet(em) + '-' + timeRet(ed);

        var endDate = myDate.setDate(myDate.getDate() - 7);
        endDate = new Date(endDate)
        var sy = endDate.getFullYear();
        var sm = endDate.getMonth() + 1;
        var sd = endDate.getDate();
        var start = sy + '-' + timeRet(sm) + '-' + timeRet(sd);


        this.time['start'] = start;
        this.time['end'] = end;
        this.period = this.nowadays = end;

        function timeRet(t) {
            t = t > 9 ? t : '0' + t
            return t
        }
        if (this.dateChoice === 1) {
                var dat = {
                    start: end,
                    end: end,
                    shopId: shopId,
                };
                this.chartRequest(dat)
        }
	},
	methods:{ 
		dateFn:function(index){
            var that=this;
            that.dateChoice=index;
			 that.$nextTick(function(){
			 	var data = {};
                 if (index === 1) {
                     that.period = that.nowadays;
                     data = {
                         start: that.nowadays,
                         end: that.nowadays,
                         shopId: that.shopId,
                     };
                 } else if (index === 2 || index === 3){
			    	var days = index === 2 ? 7 : 30;
			    	data={days:days,shopId:642,pasd:123456};
			    } else if (index === 4) {
                     that.timeFn();
                 }
                 that.chartRequest(data);
             })
		},
		//请求数据
		chartRequest:function(data){	
			var dataState=this.dataState;
			var that=this;
				$.ajax({
					url:'https://www.aftdc.com/mobile/Manage/analyCounts',
					type:'post',
					data:data,
					success:function(res)
					{  
						var tendency=res.data.tendency;
						if (that.dateChoice === 2) {
							that.period = res.data.businessData[0].time + "-" + res.data.businessData[6].time;
                        }
                        if (that.dateChoice === 3) {
                            that.period = res.data.businessData[0].time + "-" + res.data.businessData[29].time;
						}
						// that.tendency=tendency
						var myd=[];
                     	var myarr=[];
                     	for(var i in tendency){
                     		var t=tendency[i].type;
                     		let indexo=myd.indexOf(t);
                            if(indexo<0){
									myd.push(t);
									let a=[];
									tendency[i].value=parseInt(tendency[i].value*100)/100;
									a.push(tendency[i]);
									myarr.push(a)
								}else{
									//存在
								tendency[i].value=parseInt(tendency[i].value*100)/100;
								  myarr[indexo].push(tendency[i])
								}
                        }
                        let needPay = 0;
                        let deduction = 0;
                        let effectiveOrder = 0;
                        let invalidOrder = 0;
                        let effectiveAmount = 0;
                        let invalidAmount = 0;
                        for (var o in myarr) {
                     		for (var j in myarr[o]) {
                                if (myarr[o][j].type === "营业总额"){
                                    needPay += parseFloat(myarr[o][j].value);
								}
                                if (myarr[o][j].type === "商家补贴"){
                                    deduction += parseFloat(myarr[o][j].value);
                                }
                                if (myarr[o][j].type === "有效订单"){
                                    effectiveOrder += parseFloat(myarr[o][j].value);
                                    effectiveAmount += parseFloat(myarr[o][j].amount);
                                }
                                if (myarr[o][j].type === "无效订单"){
                                    invalidOrder += parseFloat(myarr[o][j].value);
                                    invalidAmount += parseFloat(myarr[o][j].amount);
                                }
							}
						}
						if (effectiveAmount && effectiveOrder) {
                            that.customerPrice = (effectiveAmount / effectiveOrder).toFixed(2);
						}
						that.needPay = needPay.toFixed(2);
						that.deduction = deduction.toFixed(2);
						that.effectiveOrder = effectiveOrder.toFixed(2);
						that.invalidOrder = invalidOrder.toFixed(2);
						that.effectiveAmount = effectiveAmount.toFixed(2);
						that.invalidAmount = invalidAmount.toFixed(2);
                     	that.chartData=myarr;//二维数组 位置对应 choiceData 的值
						if(dataState){
							 that.chartFn();
						}else{
                         //首次渲染图表
                           that.dataState=true;
                         	that.choiceData=myd;
                            that.chartFn();
						}
					}
				});
		},
		choiceFn:function(index){
          this.choice=index;
          var data=this.chartData[index];
          chartAll.changeData(data)
		},
		chartFn:function(){

			document.getElementById("target").innerHTML = "";

			var choice=this.choice;

			var data=this.chartData[choice];
	
        var heid=document.getElementById("target").clientWidth
			chartAll = new G2.Chart({
        container: 'target', // 指定图表容器 ID
        forceFit: true,
        height : heid/2, // 指定图表高度
        padding: [ 5, 25, 35, 25 ] 
    });
			const chart=chartAll
			chart.source(data); 
// 指定度量(或称 列定义）
	chart.scale('month', {
		title: null,
		min: 0,
		range: [ 0 , 1 ],
	});
	chart.scale('value', {
		title: null,
		range: [ 0 , 1],
		tickCount: 4,

	});
	chart.scale('type', {
   type:"cat",
	});
//提示框
chart.tooltip({
	showTitle: false,
	itemTpl: "<li>"+
	"  <span  class='tooltipL'>{month}</span>"+
	"<span class='tooltipR'>{type}：{value}<i class='fontCen'> </i></span>"+
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
chart.line().position('month*value').color('#53beb7').size(2).tooltip('month*value*type', (month, value, type) => {
	return {
		month, 
		value,
		type
		}; // 返回的参数名对应 itemTpl 中的变量名
	});
     chart.point().position('month*value').color('#53beb7').size(4).shape('circle')//点
     chart.render();

 },
        timeFn: function () {
            var start = this.time['start'];
            var end = this.time['end'];
            this.period = start + "-" + end;
            if (start && end) {
                var dat = {
                    start: start,
                    end: end,
                    shopId: this.shopId,
                };
                this.chartRequest(dat)
            }
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
