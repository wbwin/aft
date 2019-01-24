window.onload = function(){
    var adminData = JSON.parse(localStorage.getItem('adminData'));
    if(!adminData){
        location.href="../Login/login.html";
    }else {
        var app=new Vue({
            el:"#app",
            data:{
                goodsData:[],//评论数据
                shopName:'',
                content:'',

                pageNumb:0,//总页数
                pageCurent:1,//当前页
                pageEach:10,//每页分几条数据

            },
            components:{
                'pages':pages
            },
            created:function(){
                window.localStorage.removeItem("goods");
                this.pageFn(1);
            },
            methods:{
//分页请求 查询数据
                pageFn:function(pageCurent){
                    var that=this;
                    var page = (pageCurent - 1) * that.pageEach;
                    that.pageCurent = pageCurent;
                    axios({
                        method:"POST",
                        url:'https://www.aftdc.com/aftdcAControl/Goods/appraises',
                        data:{
                            shopName:that.shopName,
                            content:that.content,
                            page:page,
                            adminNum:adminData.adminNum,
                            token:adminData.token
                        },
                    }).then(function(res){
                        var require=res.data;
                        if(require.res==1){
                            that.goodsData=require.data;
                            that.pageNumb=Math.ceil(require.pageCount / require.pageEach)
                            that.pageEach=require.pageEach
                        }else if(res.data.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('adminData');
                            location.href="../Login/login.html";
                        }else{
                            that.goodsData=require.data;
                            that.pageNumb=Math.ceil(require.pageCount / require.pageEach)
                            that.pageEach=require.pageEach
                        }
                    })
                },

//操作
                operation:function(index,numb){
                    var data=this.goodsData[index];
                    //缓存点击评论的数据
                    console.log(data)
                    window.localStorage.setItem("goods",JSON.stringify(data));
                    if(numb==1){
                        window.location.href="AppraiseModify.html"
                    }else if(numb==2){
                        window.location.href="AppraiseSee.html"
                    }
                },
                del:function(index){
                    var id=this.goodsData[index].id;
                    var that=this
                    if(confirm("确认删除该评论？")){
                        axios({
                            url:"https://www.aftdc.com/aftdcAControl/Goods/Appraisesdel",
                            method:"post",
                            data:{
                                id:id,
                                adminNum:adminData.adminNum,
                                token:adminData.token
                            },

                        }).then(function(res){
                            if(res.data.res==1){
                                that.goodsData.splice(index,1);
                            }else if(res.data.res == -1){
                                alert(res.data.reason)
                                localStorage.removeItem('adminData');
                                location.href="../Login/login.html";
                            }
                        })
                    }
                },


            }
        })
    }
}