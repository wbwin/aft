var app=new Vue({
	el:"#wait",
	data:{
  info:'',
  choice:'',
  two:'',
	},
  created:function(){
    // console.log(123)
        var userId = 65;
    var that=this;
    $.ajax({
      url: "https://www.aftdc.com/index.php/wxapp/Shops/queryone",
      data:{
        userId: userId,
      },
      type:"post",
      success: function (all){

        that.setData({
          info: all,
          choice: res.type,
          two: res.two,
        })
        //.....
        if (all.shopStatus==3){
          that.infoFn();
        }
      }
    })
  },
	methods:
  {

  }
})
