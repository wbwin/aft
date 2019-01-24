window.onload=function(){
   var aa=document.getElementById('aa');  //  商品分类中的 INPUT
   aa.onfocus=function(){
    aa.style.border='1px solid #000';
   }
   aa.onblur=function(){
    aa.style.border='1px solid #e5e5e5';
   }


   var Nekjl=document.getElementById('nederc');   //  售卖状态 中的 INPUT
   var CdOsc=document.getElementById('yng_ing');  //  下面影藏框 

    Nekjl.onclick=function(){
       CdOsc.style.display='block';
    }

   var Xdwsj=document.getElementById('xxk_swjr');   // 获取 清理回收站
   var Oiji=document.getElementById('hui_ying');   // 获取 清理回收站 [影藏框]
   var Fjsi=document.getElementById('guahibi');  //  获取 清理回收站 [影藏框][关闭]
   var Onei=document.getElementById('ticqewuo');   //  获取 清理回收站 [影藏框][错号]

    Xdwsj.onclick=function(){
      Oiji.style.display='block';
    }
    Fjsi.onclick=function(){
      Oiji.style.display='none';
    }
    Onei.onclick=function(){
      Oiji.style.display='none';
    }

var Eedfj=document.getElementById('edcei');   // 获取 批量恢复
var Ycang=document.getElementById('huifuying');   // 获取 批量恢复【影藏框】
var Ganbi=document.getElementById('guan_bi');   // 获取 批量恢复【影藏框】[关闭]
var Cuoha=document.getElementById('ti_cuo');   // 获取 批量恢复【影藏框】[错号]

   Eedfj.onclick=function(){
     Ycang.style.display='block';
   }
   Ganbi.onclick=function(){
     Ycang.style.display='none';
   }
   Cuoha.onclick=function(){
     Ycang.style.display='none';
   }

var Hongh=document.getElementById('sm_ks');   // 获取  修复

   Hongh.onclick=function(){
     Ycang.style.display='block';
   }


var Xone=document.getElementById('x_one');   // 获取  小菜类(1
var Xtwo=document.getElementById('x_two');   // 获取  测试(1

   Xtwo.onclick=function(){
        Xtwo.style.background='#06c1ae';    Xone.style.background='#f5f5f5'; 
        Xtwo.style.color='#fff';            Xone.style.color='#06c1ae';
   }
   Xone.onclick=function(){
        Xone.style.background='#06c1ae';    Xtwo.style.background='#f5f5f5'; 
        Xone.style.color='#fff';            Xtwo.style.color='#06c1ae';
   }


}

function Shoe(obj){
  var txt=obj.innerHTML  //获取html中的值

    var Nekjl=document.getElementById('nederc');   //  售卖状态 中的 INPUT [上面已经获取]
    var CdOsc=document.getElementById('yng_ing');  //  下面影藏框  [上面已经获取]
      Nekjl.value=txt;  //  把值传到 value  中 
      CdOsc.style.display='none';   // 关闭 影藏框
}



    var myDate=new Date();

    var year=myDate.getFullYear();   //年
    var month= myDate.getMonth()+1;  // 月
    var day= myDate.getDate();  // 日期

    month=month>9?month:'0'+month  // 三目判断  
    day=day>9?day:'0'+day   // 三目判断  

    var time=year+'-'+month+'-'+day
       $("#shuantime").val(time)
function sousuo(){    //  点击 搜索 
    var San=$("#shuantime").val(); // 获取删除时间
    var Zhy=$("#zhitime").val();  // 获取 至 时间
    console.log(San);
    console.log(Zhy);
    $.ajax({
        url:'',
        data:{},
        type:'post',
        success:function(ree){

        }
    });

}
function queqk(){  //  点击  清理回收站   【确认清空】
    var shzotime=$("#thisunder").val();  //  获取 时间  【从什么 时间开始删除】
    console.log(shzotime);
    $.ajax({
        url:'',
        data:{},
        type:'post',
        success:function(){

        }
    });
}









