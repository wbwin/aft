
var evaluate=new Vue({
	el:'#than',
	data:{
        than:{},//营业环比数据
        thandb:{},//营业环比数据对比值
        invalidNum:'',//无效订单几单
        invalidb:'',//无效订单几单对比前几天值
        diff:7,//比前几日
        dayNav:7,
        time: { start: '', end: ''},
        moreData:false,
        shopId:0
      },
      created:function(){
       var that=this;
       // var day=$("input[name=day]").val();
       // var time=$("input[name=time]").val();
       var day = that.getQueryString('dayNav');
       var time = that.getQueryString('time');
       that.shopId = that.getQueryString('shopId');

       try{
         time=JSON.parse(time);
         that.time=time
       }catch(e){
        console.log('解析时间json错误');
      }
      that.dayNav=day;
      that.dayNavFn(day)
    },
    methods:{ 
      dayNavFn:function(index){
        this.dayNav=index;
        if(index!=0){
          this.diff=index
          var dat={
            day:index,
            shopId:this.shopId,
          };
          this.dateFn(dat)
        }else{
            this.timeFn();
          }
      },
      timeFn: function() {
        var start = this.time['start'];
        var end = this.time['end'];
        if(Boolean(start)&&Boolean(end)){
          var dat={
            start:start,
            end:end,
            shopId:this.shopId,
          };
          this.dateFn(dat)
        }


      },
      dateFn:function(dat){
        var that=this;
        $.ajax({
         url:'https://www.aftdc.com/mobile/Manage/getappCount',
         data:dat,
         type:'post',
         success:function(res){
          var than=res.than;
	       than.means=pros(than.orderNum,than.needPay);//单均价

	       that.than=than;
	       that.invalidNum=res.invalid.orderNum;
	       //对比
	       var than_ed=res.than_ed;

           let subNum=parseInt(than.orderNum)-parseInt(than_ed.orderNum); //有效单对比
           let proNum=parseInt(pros(subNum,than.orderNum)*100)+"%";

           let subNeed=than.needPay-than_ed.needPay;//营业额对比
           let proNeed=parseInt(pros(subNeed,than.needPay)*100)+"%";


           let mean_ed=pros(than_ed.orderNum,than_ed.needPay);
           let subMean=than.means-mean_ed; //单均价对比
           let proMean=parseInt(pros(mean_ed,than.means)*100)+"%";

           let subPlan=than.plan-than_ed.plan;//订单收入对比
           let proPlan=parseInt(pros(subPlan,than.plan)*100)+"%";

           var thandb={
           	subNum:subNum,
           	proNum:proNum,
           	subNeed:subNeed,
           	proNeed:proNeed,
           	subMean:subMean,
           	proMean:proMean,
            subPlan:subPlan,
            proPlan:proPlan,
          };

          that.thandb=new Object(thandb)

          function pros(up,down){
            	//分母不能为0
            	let d=parseInt(down*100)/100
            	d=d===0?1:d;
            	let pro = Math.round(Math.abs(up)/d*100)/100;
            	return pro
            }

            if(that.dayNav===0){
             that.diff=res.diff
           }

         },
       })
},
      moreDataFn:function(){
  this.moreData=!this.moreData;
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
