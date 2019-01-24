
var app=new Vue({
	el:'#shop',
	data:{
		day:7,
		dateTogle:false,
		sortChoice:0,
		goods:[],//菜的数据
		shopId:0
	},
	created: function() {
        this.shopId = this.getQueryString('shopId');
	},
	 mounted: function() {
	  this.dateFn(7);//默认拿七天的数据
   },
   methods:{
   	// 时间弹出框显示隐藏
   	dateTogleFn:function(){
   		this.dateTogle=!this.dateTogle
   	},
   	shopNavFn:function(index){
   		this.day=index;
   		this.dateTogle=false
   		this.dateFn(index);
   	},
   	//通过选择时间加载对应的数据
   	dateFn:function(day){
   		 var that=this
		$.ajax({
			url:'https://www.aftdc.com/mobile/Manage/getGoodsAnaly',
			data:{
				day:day,
				shopId:that.shopId,
			},
			type:'post',
			success:function (res) {
			    if(res)
			    {
                    that.goods=res.data
                }
                else
                {
                    that.goods=[]
                }
            }
		})
   	},
//排序
 sortFn:function(index){
  this.sortChoice=index;
   var goods=this.goods;
   if(goods&&goods.length>0){
   	  var name=index==1?'price':'numb',//1为销售额排序，2为销量
	 //由高到底
	  goods=goods.sort(function(a,b){
	  return parseInt(b[name]*100)/100 -parseInt(a[name]*100)/100
	  });
	  this.goods=goods
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