
var evaluate=new Vue({
	el:'#not',
	data:{

        invalidNum:'',//无效订单几单
        invalidb:'',//无效订单几单对比前几天值
        diff:7,//比前几日
        dayNav:7,
        time: { start: '', end: ''},
        reason:0,
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
      that.dayNavFn(day);
    },
    methods:{ 
      dayNavFn:function(index){
        this.dayNav=index;
        if(index!==0){
          this.diff=index;
          var dat={
            day:index,
            shopId:this.shopId,
          };

          this.dateFn(dat)
        }else{
          this.timeFn()
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
          that.invalidNum=res.invalid.orderNum;
          that.reason=res.reason;
          let subi=parseInt(res.invalid.orderNum)-parseInt(res.invalid_ed.orderNum);
          let proi=pros(subi,res.invalid.needPay)*100+"%";
          var invalidb={subi:subi,proi:proi};
          that.invalidb=new Object(invalidb)
          function pros(up,down){
            	//分母不能为0
            	let d=parseInt(down*100)/100
            	d=d===0?1:d;
            	let pro=Math.round(Math.abs(up)/d*100)/100;
            	return pro
            }
            if(that.dayNav===0){
             that.diff=res.diff
           }
         },
       })
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
