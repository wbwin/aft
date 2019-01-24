
var app = new Vue({
    el: "#Huod",
    data: {
        foodSele: [
            { name: '超值双人套餐',catId:'1', child: [{name:'小份周瑜酿皮1份+小份牛筋面1份+黄牛肉2两+小菜（随机）  48元',goodsId:1}] },
            { name: '特色主打',catId:'2', child: [{name:'黄牛肉夹馍',goodsId:2}] },
            { name: '主菜类',catId:'3', child: [{name:'酱香黄牛肉 12元',goodsId:3}] },
            { name: '主食类',catId:'4', child: [{name:'青菜炒鸡蛋',goodsId:4}, {name:'青菜炒12鸡蛋',goodsId:5},{name:'青蛋',goodsId:6} ,{name:'青菜炒鸡蛋',goodsId:7}  ] },

        ],
        foodMeet: [], //接收选择菜品
        errTips: false, //提示框
        discountGoods:[], //折扣商品
    },
    created: function() {
        var that=this
       $.ajax({
            url:'/index.php/Business/Activity/Tuan',
            data:{},
            type:'post',
            success:function (res) {
                that.foodSele=res.food
                that.discountGoods=res.discount
                 if(!res.discount)
                {
                    that.discountGoods=[]
                }
                var foodSele = that.foodSele;
                var len = foodSele.length;
                for(var i = 0; i < len; i++) {
                    foodSele.togle = false;
                }
                var goodsId=$('input[name=goodsId]').val()
                if(goodsId)
                {
                    app.foodMeet=[{goodsId:goodsId}];
                    save(1);


                }
            }
        })



    },

    methods: {
        foodNameFn: function(name, index) {
            var child = this[name][index]
            child.togle = !child.togle;
            this.$set(this[name], index, child)

        },
        showSet:function(index)
        {
            var discountGoods=this.discountGoods
            var goodsName=discountGoods[index]['goodsName'];
            var maxPrice=discountGoods[index]['maxPrice']
            var id=discountGoods[index]['id']
            $('.goodsName').html(goodsName)
            $('.sonedrMax').html(maxPrice)
            $(".ThisToallys").show();
            discountId=[]
            discountId.push(id)
            $('input[name=ener]').each(function(){
                $(this).attr('checked',false);

            });
            return false //禁止跳转
        },
        foodAdd: function(index) {
            var foodSele = this.foodSele;
            var togle = foodSele[index].togle
            if(togle) {
                var foodMeet = this.foodMeet;
                var len = foodMeet.length;
                var adop = true
                for(var i = 0; i < len; i++) {
                    var name = foodMeet[i].name
                    if(Boolean(name)) {
                        var n = foodMeet[i].total;
                        if(n == index) {
                            adop = false;
                            break
                        }
                    }
                }

                if(adop) {
                    var obj = new Object(foodSele[index]);
                    var objs = {}
                    for(var j in obj) {
                        var types = typeof(obj[j]);
                        if(types == 'object') {
                            objs[j] = []
                            for(var z in obj[j]) {
                                objs[j][z] = obj[j][z];
                            }

                        } else {
                            objs[j] = obj[j];
                        }

                    }
                    objs.total = index;
                    objs['togle'] = false;

                    foodMeet.unshift(objs);

                    for(var i = 0; i < foodMeet.length; i++) {
                        var name = foodMeet[i].name
                        if(!Boolean(name)) {
                            var n = foodMeet[i].total;
                            if(n == index) {
                                foodMeet.splice(i, 1);
                                i--
                            }
                        }
                    }
                    this.foodMeet = foodMeet
                }

            } else {
                this.errTipsFn()
            }

        },
        delAll:function () {
           var foodMeet=[]
           this.foodMeet=foodMeet
        },
        //选择全部
        selAll:function () {

            var foodSele = this.foodSele;
            var len=foodSele.length
            for(var q=0;q<len;q++)
            {
                if(foodSele[q]['child'].length>0){

                  for(var k=0;k<foodSele[q]['child'].length;k++)
                  {
                      var val=foodSele[q]['child'][k]['name'];
                      var goodsId=foodSele[q]['child'][k]['goodsId']
                      var foodMeet = this.foodMeet
                      var len = foodMeet.length;

                      var adop = true
                      for(var i = 0; i < len; i++) {
                          var name = foodMeet[i].name
                          if(Boolean(name)) {
                              var n = foodMeet[i].total;
                              if(n == q) {
                                  adop = false;
                                  break
                              }
                          }else{
                              var txt = foodMeet[i].val;
                              if(txt == val) {
                                  adop = false;
                                  break
                              }
                          }
                      }
                      if(adop) {
                          var obj = { val: val, total: 0,goodsId:goodsId }
                          this.foodMeet.unshift(obj)
                      }
                  }
                }
            }
        },
        foodChildFn: function(index, numb) {
            var foodSele = this.foodSele;
            var val = foodSele[index]['child'][numb]['name'];
            var goodsId=foodSele[index]['child'][numb]['goodsId']
            var foodMeet = this.foodMeet
            var len = foodMeet.length;

            var adop = true
            for(var i = 0; i < len; i++) {
                var name = foodMeet[i].name
                if(Boolean(name)) {
                    var n = foodMeet[i].total;
                    if(n == index) {
                        adop = false;
                        break
                    }
                }else{
                    var txt = foodMeet[i].val;
                    if(txt == val) {
                        adop = false;
                        break
                    }
                }
            }
            if(adop) {
                var obj = { val: val, total: index,goodsId:goodsId }
                this.foodMeet.unshift(obj)
            }
        console.log(foodMeet)
        },
        childSub: function(index, numb) {
            var child = this.foodMeet[index]['child']
            child.splice(numb, 1);
            if(child.length <= 0) {
                this.foodMeet.splice(index, 1)
            } else {
                this.foodMeet[index]['child'] = child
            }
        },

        foodSub: function(index) {
            this.foodMeet.splice(index, 1)
        },

        //提示框
        errTipsFn: function() {
            var that = this
            that.errTips = true
            var errTime = setInterval(function() {
                that.errTips = false;
                clearInterval(errTime)
            }, 1300)
        },

    }

})
function show(obj){  // 点击活动类型影
    var zhi=$(obj).text();
    $("#houone").val(zhi);
    $("#houone").css('border','1px solid #0740a8');
    $(".leixin").hide();
}

function funp(obj){  // 点击活动类状态
    var dat=$(obj).text();
    $("#houtwo").val(dat);
    $("#houtwo").css('border','1px solid #0740a8');
    $(".zhuangtaia").hide();
}



$(function(){

    $("#houone").click(function(){  // 点击 活动类型
        $(".leixin").show();
    });
    $("#houtwo").click(function(){  // 点击 活动状态
        $(".zhuangtaia").show();
    });

    $(".made_chaxun").click(function(){  // 点击【活动历史】【下 查看详情】【查询】
        var oLex=$("#houone").val(); // 获取 【活动类型】
        var oLen=$("#houtwo").val(); // 获取 【活动状态】
        var Htime=$("#azuihou").val(); // 获取 【活动时间】
        var Jtime=$("#bzuihou").val(); // 获取 【结束时间】
        $.ajax({
            url:'',  //请求后台的路径
            data:{ oLex:oLex,oLen:oLen,Htime:Htime,Jtime:Jtime },
            type:'post',
            success:function(){

            }
        });
    });


    $(".hsaidgai").click(function(){  // 点击【修改】
        $(".cewo_iej").show();
    });

    $(".ba_kcfc").click(function(){  // 点击   【每单限购折扣商品种类】  [保存]
        var tthis=$('input[name="codj"]').val();
        $("#daichuan").val(tthis);
        $(".cewo_iej").hide();
    });

    $(".xdecf").click(function(){  // 点击  548【错】
        $(".cewo_iej").hide();
    });
    $(".qu_xwkc").click(function(){  // 点击  548【返回】
        $(".cewo_iej").hide();
    });

/***********************************/
    $("#xauhsping").click(function(){  // 点击【选择菜品】
        $(".xuanhcaiping").show();
    });

    $(".ongtuhgJpo").click(function(){ // 点击【选择菜品  ×】
        $(".xuanhcaiping").hide();
    });
    $(".sks_oo").click(function(){  // 点击【选择菜品  取消】
        $(".xuanhcaiping").hide();
    });




   /* $(".xz_ch").click(function(){  // 点击【删除全部】
        var ckierop=$("#neirongcent").find('div').remove();
        //  console.log(ckierop);
    });
   $(".xz_qb").click(function(){  // 点击【选择全部】
        var cedosw=$(".p_onw").text();

        var csdac='<div> <span class="aaa">'+cedosw+'</span><span class="cxej" onclick="ceej(this)">×</span>'+'<br/>'+'</div>'

        $(".you_kai").append(csdac);
    });*/


});

$(function(){
    $(".allBuXuanzhong").click(function(){  // 点击菜品名称
        if($('input[name="allname"]').is(':checked'))  //  点击菜品名称 有没有选择
        {
            $('input[name="ener"]').attr('checked',true);
        }else{
            $('input[name="ener"]').attr('checked',false);
        }
    });
});
var discountId=[];
$(function(){

    $(".ppliangshz").click(function(){  // 点击 批量设置 【弹出框】
        if($('input[name="ener"]').is(':checked'))
        {
            $(".ThisToallys").show();
            var id=[]
            $('input[name=ener]:checked').each(function(){
                var checkValue = $(this).val();
                id.push(checkValue)
            });
            discountId=id
            console.log(discountId)
                               //   待处理    待处理  待处理  待处理  待处理
        }else{
            $(".wdWsw").show();  $(".swikDin").html("您没有勾选任何菜品");
            setTimeout(function(){
                $(".wdWsw").hide();
            },2000);
        }
    });

    $(".pplianshch").click(function(){  // 点击 批量处理 【弹出框】
        if($('input[name="ener"]').is(':checked'))
        {
            //alert("有选择的菜品 待处理【去删除】");  //   待处理    待处理  待处理  待处理  待处理
            if(confirm('是否删除'))
            {
                var id=[]
                $('input[name=ener]:checked').each(function(){
                    var checkValue = $(this).val();
                    id.push(checkValue)
                });
                var jsonId=JSON.stringify(id)
               $.ajax({
                   url:'/index.php/Business/Activity/delBargainGoods',
                   data:
                       {
                           id:jsonId
                       },
                   type:'post',
                   success:function(res)
                   {
                       if(res==1)
                       {
                           $(".wdWsw").show();  $(".swikDin").html("删除成功");
                           setTimeout(function(){
                               $(".wdWsw").hide();
                               location.href='/index.php/Business/Activity/HuoDong'
                           },2000);
                       }

                   }
               })
            }
        }else{
            $(".wdWsw").show();  $(".swikDin").html("您没有勾选任何菜品");
            setTimeout(function(){
                $(".wdWsw").hide();
            },2000);
        }
    });
});
var isSave=false
function save(type) {

    var foodMeet=app.foodMeet
    var discountGoods=app.discountGoods

    var goodsId=[];
    for(var i=0;i<foodMeet.length;i++)
    {
        goodsId.push(foodMeet[i]['goodsId'])
    }

    $.ajax({
        url:'/index.php/Business/Activity/setTuan',  // 后台请求
        data:{
            goodsId:JSON.stringify(goodsId)
        },
        type:'post',
        success:function(res){
            if(res)
            {
                for(var i=0;i<res.length;i++)
                {
                    discountGoods.push(res[i])
                }
                app.discountGoods=discountGoods
                $('.xuanhcaiping').hide()
                isSave=false
                //判断是否从商品分析页面跳转进来的 是则执行下面函数调用砍价商品编辑弹出框
                if(type==1)
                {
                    var index=discountGoods.length
                    var goodsName=discountGoods[index-1]['goodsName'];
                    var id=discountGoods[index-1]['id']
                    $('.goodsName').html(goodsName)
                    $(".ThisToallys").show();
                    discountId=[]
                    discountId.push(id)
                    $('input[name=ener]').each(function(){
                        $(this).attr('checked',false);

                    });
                    return false //禁止跳转*/
                }
                $(window).bind('beforeunload',function()
                {
                    if(!isSave)
                    {
                        return '您输入的内容尚未保存，确定离开此页面吗？';
                    }

                });

            }
        }
    });
}
