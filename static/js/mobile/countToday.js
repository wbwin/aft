
var app=new Vue({
	el:'#tody',
	data:{
		total:{},
		chart:[],
		timeChoice:1,//累计或者分时选择
		dataChoice:1,//营业额还是有效订单
		alls:{},
		shopId:0
	},
	created:function(){
		var that=this;
        var shopId = that.shopId = that.getQueryString('shopId');
		$.ajax({
			url:'https://www.aftdc.com/mobile/Manage/getToday',
			data:{
                shopId:shopId
			},
			type:'post',
			success:function(res){
				that.alls=res;
				that.chart=res.price_lj;

				that.total=res.total;
				that.chartFn();
			}
		})
	},
	methods:{
      timeFn:function(index){
      	this.timeChoice=index
      	var dataChoice=this.dataChoice;
      	var alls=this.alls
      	if(index==1){//累计
            this.chart=dataChoice==1?alls.price_lj:alls.numb_lj
      	}else{
			this.chart=dataChoice==1?alls.price:alls.numb
      	}

      this.chartFn();
      },
      dataFn:function(index){
      	this.dataChoice=index;
        var timeChoice=this.timeChoice;
        var alls=this.alls;
        if(index==1){
 			this.chart=timeChoice==1?alls.price_lj:alls.price
        }else{
        	this.chart=timeChoice==1?alls.numb_lj:alls.numb
        }
        this.chartFn();
      },
		//图例
		chartFn:function(){
		  document.getElementById("target").innerHTML = "";
			// var data=[
			// {hour:"0",value:9,type:'昨日'},
			// {hour:"22",value:2,type:'昨日'},
			// {hour:"10",value:3,type:'今日'},
			// {hour:"12",value:7,type:'今日'},
			// ];

			var data=this.chart;

			var heid=document.getElementById("target").clientWidth
			var chart = new G2.Chart({
		        container: 'target', // 指定图表容器 ID
		        forceFit: true,
		        height : heid/2, // 指定图表高度
		        padding: [ 5, 25, 25, 35 ] 
		    });
			chart.source(data); 
		// 指定度量(或称 列定义）
			chart.scale('hour', {
				title: null,
				min: 0,
				range: [ 0 , 1 ],
				tickCount: 12,
			});
			chart.scale('value', {
				title: null,
				range: [ 0 , 1],
				tickCount: 5,

			});
			chart.scale('type', {
				type:"cat",
			});
		//提示框
		chart.tooltip(true,{
			showTitle:false,
			 itemTpl: "<li>"+
			 "<div  class='tooltipL tooltips tooltip{index}'>{hour}:00-{hour_end}:59</div>"+
			 "<span class='tooltipR'>"+
			 "<span style='background-color:{colors};width:8px;height:8px;display:inline-block;margin-right:8px;'></span>"+
			 "{type}：￥{value}<i class='fontCen'> </i></span>"+
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
			label:  {
				textStyle:{
					fill: '#9a9a9a'
				},
				autoRotate:false,
			},
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
		chart.axis('hour', {
			label:  {
				offset:10,
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
		chart.line().position('hour*value').color('type',['#A0A0A0','#53beb7']).size(2).tooltip('hour*value*type', (hour, value, type) => {
			let hour_end=hour+1;
			hour_end=hour_end>=10?hour_end:'0'+hour_end;
			hour=hour>=10?hour:'0'+hour;
			let colors=type=='昨日'?'#FF4500':'#ffffff'
			return {
				hour,
				hour_end,
				value,
				type,
				colors
				}; // 返回的参数名对应 itemTpl 中的变量名
			}).style('type',{
				lineDash:function(type){
					if(type=='昨日'){
						return [4, 4]
					}
				}

			});
		     // chart.point().position('hour*value').color('#53beb7').size(4).shape('circle')//点
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
