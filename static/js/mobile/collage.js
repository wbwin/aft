window.onload = function () {
    var app=new Vue({
        el:'.collageAll',
        data:{
            shopInfo:'',//店铺信息
            userList:'',//拼单人加商品信息
            needPay:'',//总金额
            identityShareOrder:'',//发起人的拼单信息
            togetherCollage:false,//是否加入了拼单
            myShareOrder:'',//我的拼单信息
            unShareShow:false,//弹出退出拼单框
            getShareDetailTimer:'',
            shareStatus:'',//拼单的状态
            //通用
            shopId:'',
            userId:'',
            latitude:'',
            latitude:'',
            shareId:'',
            shopType:1,
            model:'',//设备号
            token:'',
            userInfo:'',
            hobbyTip:false,
            hobbyTips:'',
            hobbyTipTimer:'',

        },
        created:function () {
            var that=this
            //参数
            // that.userInfo.token=that.getParamer('token');
            // that.model=that.getParamer('model');
            // that.articleId=that.getParamer('articleId');
            // that.userInfo.userId=that.getParamer('userId');
            // that.latitude=that.getParamer('latitude');
            // that.longitude=that.getParamer('longitude');
            // that.userPhone=that.getParamer('userPhone');
            if(sessionStorage.getItem('urlMessage')){
                var urlMessage=JSON.parse(sessionStorage.getItem('urlMessage'))
                that.shopId=urlMessage.shopId;
                that.latitude=urlMessage.latitude;
                that.longitude=urlMessage.longitude;
                that.shareId=urlMessage.shareId;
                that.shopType=urlMessage.shopType;
            }
            var userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
            var code = this.getQueryString('code');
            if(!code&&!userInfo){
                var obj={
                    shopId:that.getQueryString('shopId'),
                    latitude:that.getQueryString('latitude'),
                    longitude:that.getQueryString('longitude'),
                    shareId:that.getQueryString('shareId'),
                    shopType:that.getQueryString('shopType'),
                }
                sessionStorage.setItem('urlMessage',JSON.stringify(obj))
            }
            if (userInfo) {//已登录
                this.userInfo = userInfo;
            }else if (code) {//未登录，通过code去登录
                this.getUserInfo(code)

            }else {//未登录，去获取code
                this.getCode()
            }
            that.getShopInfo()
            that.getShareDetail()
            clearInterval(that.getShareDetailTimer)
            that.getShareDetailTimer=setInterval(function(){
                that.getShareDetail()
            },10000)



        },
        methods:{
            getCode:function () {
                window.location.href='https://www.aftdc.com/mobile/Wxdecode/getCode?url='+window.location.href;
            },
            getUserInfo:function (code) {
                var that = this
                var param='code='+code;
                axios({
                    method: "post",
                    url: 'https://www.aftdc.com/mobile/Wxdecode/getUserInfo',
                    data: param,
                }).then(function (res) {
                    if (res.data.res == 1){
                        that.userInfo = res.data.data;
                        that.getShopInfo()
                        that.getShareDetail()
                        clearInterval(that.getShareDetailTimer)
                        that.getShareDetailTimer=setInterval(function(){
                            that.getShareDetail()
                        },100000)
                        sessionStorage.setItem('userInfo',JSON.stringify(that.userInfo));//缓存本次登录
                    }
                })
            },
            //获取 URL 传过来的值
            getQueryString(name) {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
                var r = window.location.search.substr(1).match(reg);
                if (r != null) return unescape(r[2]);
                return null;
            },


            // getParamer:function(paramer){
            //
            //     var url=window.location.href.split("?")[1];            /*获取url里"?"后面的值*/
            //     if(url.indexOf("&")>0){                                      /*判断是否是一个参数还是多个参数*/
            //       var  urlParamArry=url.split("&");                            /*分开每个参数，并放到数组里*/
            //         for(var i=0; i<urlParamArry.length; i++){
            //             var paramerName=urlParamArry[i].split("=");   /*把每个参数名和值分开，并放到数组里*/
            //             if(paramer==paramerName[0]){                     /*匹配输入的参数和数组循环出来的参数是否一样*/
            //                 return paramerName[1];                           /*返回想要的参数值*/
            //             }
            //         }
            //     }else{                                                              /*判断只有个参数*/
            //         var paramerValue=url.split("=")[1];
            //         return paramerValue;
            //     }
            //
            // },

            //获取店铺信息
            getShopInfo(){
                var that=this
                var data={
                    userId:that.userInfo.userId,
                    shopId:that.shopId,
                    longitude: that.longitude,
                    latitude: that.latitude,
                }
                axios({
                    method: "post",
                    url:'https://www.aftdc.com/mobile/Index/shopInfo',
                    data:data,
                    // headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                }).then(function (res) {
                    if(res.data.res==1){
                        that.shopInfo=res.data.data.shopInfo
                    }
                })
            },
            //获取拼单详情
            getShareDetail(){
                var that=this
                var data={
                    token:that.userInfo.token,
                    shareId: that.shareId,
                }
                axios({
                    method: "post",
                    url:'https://www.aftdc.com/mobile/Index/shareDetail',
                    data:data,
                    // headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                }).then(function (res) {
                    if(res.data.res==1){
                        that.userList=res.data.data.userList
                        that.needPay=res.data.data.needPay
                        that.togetherCollage=false
                        for(var i in that.userList){
                            if(that.userList[i].identity==1){//谁是发起人
                                that.identityShareOrder=that.userList[i]
                                that.shareStatus=that.identityShareOrder.shareStatus
                            }
                            if(that.userList[i].myOrder==1){
                                that.togetherCollage=true
                                that.myShareOrder=that.userList[i]
                            }
                        }
                    }
                })
            },
            //加入拼单
            onFJoinShareClick(){
                var that=this
                var data={
                    token:that.userInfo.token,
                    shareId: that.shareId,
                }
                axios({
                    method: "post",
                    url:'https://www.aftdc.com/mobile/Index/fJoinShare',
                    data:data,
                    // headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                }).then(function (res) {
                    if(res.data.res==1){
                        var shareOrderFood={
                            shopId:that.shopId,
                            latitude:that.latitude,
                            longitude:that.longitude,
                            shareId:that.shareId,
                            shopType:that.shopType,
                            shopId:that.shopId,
                        }
                        localStorage.setItem("shareOrderFood",JSON.stringify(shareOrderFood));
                        location.href = "/mobile/Goods/chooseGoods.html"
                        that.togetherCollage=true
                    }
                })
            },
            toChooseGoodsClick(){
                var that=this
                var shareOrderFood={
                    shopId:that.shopId,
                    userId:that.userInfo.userId,
                    latitude:that.latitude,
                    longitude:that.longitude,
                    shareId:that.shareId,
                    shopType:that.shopType,
                    shopId:that.shopId,
                }
                if(that.myShareOrder){
                    shareOrderFood.orderFood=that.myShareOrder.goodsInfo
                }
                localStorage.setItem("shareOrderFood",JSON.stringify(shareOrderFood));
                location.href = "/mobile/Goods/chooseGoods.html"
            },
            //退出拼单
            onUnShareShowClick(){
                var that=this
                that.unShareShow=true
            },
            onUnShareShowCancel(){
                var that=this
                that.unShareShow=false
            },
            //退出拼单
            fDelShare(){
                var that=this
                var data={
                    token:that.userInfo.token,
                    shareId: that.shareId,
                }
                axios({
                    method: "post",
                    url:'https://www.aftdc.com/mobile/Index/fDelShare',
                    data:data,
                    // headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                }).then(function (res) {
                    if(res.data.res==1){
                        that.togetherCollage=false
                        that.unShareShow=false
                        that.getShareDetail();
                    }else{
                        that.showHobbyTips(res.data.info)
                    }

                })
            },
            showHobbyTips(content){
                var that=this
                clearTimeout(that.hobbyTipTimer)
                that.hobbyTip=true
                that.hobbyTips=content
                that.hobbyTipTimer=setTimeout(function(){
                    that.hobbyTip=false
                },3000)
            },

        },
    })
}