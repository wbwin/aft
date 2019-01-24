var app=new Vue({
	el:"#openshop",
	data:{
	 explain:[
      {
        name:'入驻阿凡提需要什么条件？',
        txt:"入驻阿凡提需要有实体店铺，需要准备门脸照片、店内照片、门店logo、身份证照片、营业执照、餐饮许可证。"
      },
      {
        name: '入驻阿凡提流程是怎么样？',
        txt: "1.需要您填写店铺的名称、地址、门店照等基本信息   2.上传您的身份证、行业资质和餐饮许可证即可完成入驻"
      },
      {
        name: '与阿凡提合作的收费标准是什么？',
        txt: "不同的配送模式、不同的市场的收费标准是不同的，提交入驻申请后会有市场经理与您详细沟通"
      },
      {
        name: '我想找市场经理帮我线上开店，怎么联系？',
        txt: "提交信息后，12小时内将会有市场经理与您联系。"
      },
      {
        name: '开店申请提交后多久店铺能上线？',
        txt: "提交信息后进行审核，审核结果将在3个工作日内以短信的方式通知您。"
      }
    ],
      butTogle:true, //点击获取验证码或倒数秒数
    adopt:false, //是否可以点击获取时间
    second:60,
    phone:'',//电话号码
    code:'',//返回的验证码
    inputCode:'',//输入的验证码
    check:1,

    togle:false,
	},
  created:function(){},
	methods:{
     openFn:function(){
      this.togle=!this.togle
     },  
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
      // alert("手机号码错误")
      return false;
    }
    var phone = this.phone;
    var inputCode = this.inputCode;
    if (inputCode == ''){
      // alert("请输入验证码")
      return false;
    }
    if(this.check!=1){
      // alert("请阅读同意平台协议")
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















// //发送验证码
// function sendPhone(){
// 	var scope=$scope()
// 	var phoneErr= scope.phoneErr
// 	var send= scope.send
// 	if(phoneErr==3 && send){
// 		scope.send=false
// 		var time=60
// 		var setTime=setInterval(function(){
// 			time--
// 			var txt=time+' 秒'
//         	if(time<=0){
//         		txt='发送验证码';
//         		scope.send=true;
// 				clearInterval(setTime);
// 			}
			 
// 			$(".phone-but").text(txt)
// 		},1000)
// 		scope.$apply()
// 	}
// }