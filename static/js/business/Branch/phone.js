var app=new Vue({
	el:"#phone",
	data:{
		butTogle:true, //点击获取验证码或倒数秒数
    adopt:false, //是否可以点击获取时间
    second:60,
    phone:'',//电话号码
    code:'',//返回的验证码
    inputCode:'',//输入的验证码
	  },

	methods:{
  phoneTest:function(e){
    var val=this.phone;
    var adopt=false;
    if ((/^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9])|(17[0-9]))\d{8}$/.test(val))) {
      adopt=true;
    }
    this.adopt=adopt
  },
  getVerif:function(){
    var phone = this.phone
    var adopt = this.adopt
    var that = this
    if (phone && adopt) {
      $.ajax({
        url: 'https://www.aftdc.com/index.php/wxapp/Shops/Verification',
        data: { phone: phone},
        type:'post',
        success: function (info) {
          if (info.code==1){
            //成功
            that.butTogle=false
            that.secondFn()
          } else if (info.code == 2){
            //90秒不能重复
             alert("90秒不能重复发送")
          } else {
            //失败
           alert("失败")
          }
        }
      })
      
    }
  },
  //倒计时
  secondFn: function () {
    clearInterval()
    var second = 90
    var that = this
   var time= setInterval(function(){
      that.second=second;
     second = second-1;
     if (second<=0){
       that.second=60;
       that.butTogle=true;
      clearInterval(time)
    }
   },1000)
  },

//确定
  nextBut:function(e){
    var adopt = this.adopt;
    if (adopt == false){
      alert("手机号码错误")
      return false;
    }
    var phone = this.phone;
    var inputCode = this.inputCode;
    console.log(inputCode)
    if (inputCode == ''){
      alert("请输入验证码")
      return false;
    }
    // type 1为商家入驻 2为城市合伙人
    type=1
    var result = type;
    $.ajax({
      url: 'https://www.aftdc.com/index.php/wxapp/Shops/inputCode',
      data: { 
        phone: phone,
        code: inputCode,
      },
      type: 'post',
      success: function(info){
        if(info.code == 1){
          // if (result == 1) {
          //       wx.navigateTo({
          //         url: '../openmage/openmage?phone=' + phone,
          //         // url: '../wait/wait',
          //       })
          //     } else {
          //       wx.navigateTo({
          //         url: '../../personal/cooperation/cooperation',
          //       })
          //     }
        } else if(info.code == 2){
           window.location.href="wait.html"
        } else {
         alert("info.info")
        }
      }
    })
    return false;
    
  },    

	}
})


