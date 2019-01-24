window.onload = function () {
    var app=new Vue({
        el:'.collageAll',
        data:{
            currentTab:0,
            catNameIndex:0,
            goods:false,
            specBoxShow:false,
            orderFood:'',
            //接口数据
            shopInfo:{},//商店基本信息
            envImg:'',//店铺环境图片
            Von: [],
            distance:'',//距离,用于比较
            serviceStartTime:'',//商家最早营业时间
            serviceEndTime:'',//商家最晚结束营业商家
            shopType:1,//店铺类型
            requiredCatId:'',//必选的catId
            requiredName:'',//必选的catName
            requiredIndex:'',//必选的cat下标

            //商品详情弹出框
            boxShow:false,//图片弹出框判断
            boxShowHeight:810,
            box:{},//选中的商品的数据
            specTasteName:'',//规格名字
            goodsType:'',
            spec_taste:[],
            car: [],//购物车
            boxFees:0,//餐盒费
            start:0,
            showPrice:0,
            totalprice:0,//总价
            totalnumb:0,//总数
            discount:true,//是否能享受优惠
            tipsIfor:[],//满减的数据
            distance_price:0,//差多少钱起送
            shopCar: false,
            //评论
            pingLunShow:[],//显示的评论
            ratingSelect:0,//评价切换
            allPLPage:0,//全部
            photoPLPage:0,//有图
            scorePLPage:0,//评分
            noDataOfPinLun:false,//上拉加载还有没有数据
            allPf:'',//外卖综合评分
            dzan:false,


            distance_price:0,//差多少钱起送
            //通用
            shopId:'',
            userId:'',
            latitude:'',
            latitude:'',
            shareId:'',
            shopType:1,//店铺类型
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
            // that.token=that.getParamer('token');
            // that.model=that.getParamer('model');
            var userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
            that.userInfo=userInfo
            var shareOrderFood=JSON.parse(localStorage.getItem("shareOrderFood"));
            localStorage.removeItem("shareOrderFood");
            that.shopId = shareOrderFood.shopId
            that.latitude = shareOrderFood.latitude
            that.longitude = shareOrderFood.longitude
            that.shareId=shareOrderFood.shareId
            that.shopType=shareOrderFood.shopType
            if(shareOrderFood.orderFood){
                that.orderFood=shareOrderFood.orderFood
            }
            that.getShopInfo();//获取店铺信息、活动、轮播订单
            that.getCaiDan();//获取菜单信息
            that.getPl(0);//获取全部评论



        },
        methods:{

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

            //获取店铺信息、活动、轮播订单
            getShopInfo(){
                var that=this
                var shopType=that.shopType
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
                        var shopInfo=res.data.data.shopInfo
                        that.shopInfo=shopInfo

                        that.serviceStartTime=shopInfo.serviceTime[0].serviceStartTime
                        that.serviceEndTime=shopInfo.serviceTime[shopInfo.serviceTime.length-1].serviceEndTime
                        //处理距离,转化为m用于比较
                        var distance=shopInfo.distance.replace('km','')
                        that.distance = Number(distance)*1000
                        that.envImg=res.data.data.envImg//商家环境图片
                        that.distance_price = shopInfo.qsj//差多少钱起送

                        // var orderFood=event.find(that.shopId+'orderFood'+that.shopType)
                        if(orderFood){
                            var orderFood = JSON.parse(orderFood);
                            that.foodStorageSync(orderFood)
                        }
                    }
                })
            },
            //获取菜单信息
            getCaiDan(){
                var that=this
                var shopType=that.shopType
                var activityGoods = 1
                var data={
                    shopId:that.shopId,
                    activityGoods:activityGoods,
                }
                axios({
                    method: "post",
                    url:'https://www.aftdc.com/userapp/Index/caidan',
                    data:data,
                    // headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                }).then(function (res) {
                    if(res.data.res==1){
                        //如果该店铺有菜单
                        if(res.data.data){
                            var arr = res.data.data
                            for (var i = 0,len=arr.length; i < len; i++) {
                                arr[i].allNumb=0
                                for (var j = 0,jLen=arr[i].distop.length; j < jLen; j++) {
                                    //给活动商品添加一个标识
                                    arr[i].distop[j].shopCatId2 = arr[i].catId
                                }
                            }
                            that.Von=arr

                            // 设置必须分类的catId

                            for (var i = 0, len = arr.length; i < len; i++) {
                                if (arr[i].required === 1) {
                                    that.requiredCatId=arr[i].catId
                                    that.requiredName=arr[i].catName
                                    that.requiredIndex=i
                                    break;
                                }
                            }
                            if(that.orderFood){
                                that.foodStorageSync(that.orderFood)
                            }
                        }
                    }
                })


            },
            foodStorageSync(orderFood) {
                var that = this
                var car = that.car
                var Von = that.Von

                for (var i in orderFood) {
                    var obj = {
                        arr: orderFood[i],
                        mark: orderFood[i].mark
                    }
                    car.push(obj)
                    var mark = orderFood[i].mark //获取弹出盒子的弹出哪件商品标识
                    var a = mark.substring(mark.indexOf("a") + 1, mark.indexOf("b"))
                    var b = mark.substring(mark.indexOf("b") + 1)
                    if (!Von[a].distop[b].numb) {
                        Von[a].distop[b].numb = 0
                    }
                    Von[a].distop[b].numb += Number(orderFood[i].numb)
                    Von[a].allNumb+=Number(orderFood[i].numb)
                }

                that.car=car
                that.Von=Von
                that.sum()
                // }
            },
            //评论切换
            onRatingSwitch(toggle){
                var that=this
                that.ratingSelect=toggle
                that.allPLPage=0
                that.photoPLPage=0
                that.scorePLPage=0
                that.getPl(0)

            },
            getPl(toggle){//toggle=0时为重新获取评论，toggle为1时为上拉加载获取评论
                var that = this
                var ratingSelect=that.ratingSelect
                var userId=that.userInfo.userId
                if (!userId) {
                    userId = 0
                }
                var page=0
                var tab=Number(ratingSelect)+1
                switch (ratingSelect){
                    case 0:
                        page=that.allPLPage;
                        break;
                    case 1:
                        page=that.photoPLPage;
                        break;
                    case 2:
                        page=that.scorePLPage;
                        break;
                }

                var data={
                    shopId:that.shopId,
                    page:page,
                    shopType:that.shopType,
                    userId:userId,
                    tab:tab,
                }
                axios({
                    method: "post",
                    url:'https://www.aftdc.com/mobile/Index/getPl',
                    data:data,
                    // headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                }).then(function (res) {
                    that.allPf=res.data.data.allPf
                    if(res.data.res==1){

                        if(toggle==0){

                            that.pingLunShow = res.data.data.pjList
                            that.noDataOfPinLun=false
                            switch (ratingSelect){
                                case 0:
                                    that.allPLPage=res.data.data.pjList.length;
                                    break;
                                case 1:
                                    that.photoPLPage=res.data.data.pjList.length;
                                    break;
                                case 2:
                                    that.scorePLPage=res.data.data.pjList.length;
                                    break;
                            }
                        }else if(toggle==1){
                            that.pingLunShow = that.pingLunShow.concat(res.data.data.pjList)
                            switch (ratingSelect){
                                case 0:
                                    that.allPLPage=that.allPLPage+res.data.data.pjList.length;
                                    break;
                                case 1:
                                    that.photoPLPage=that.photoPLPage+res.data.data.pjList.length;
                                    break;
                                case 2:
                                    that.scorePLPage=that.scorePLPage+res.data.data.pjList.length;
                                    break;
                            }
                        }
                    }
                })
            },
            /*点击菜单*/
            sortClick(index) {
                var that=this
                if(that.catNameIndex!=index){
                    that.catNameIndex = index
                }

            },
            specBoxSub(){
                var that=this
                var box=that.box
                var mark=box.mark
                var car =that.car
                var goodsAttrName = (box.spec_size ? box.spec_size : "") + (box.spec_size && box.spec_taste ? '+' : '')
                goodsAttrName += box.spec_taste ? box.spec_taste : ""
                for(var i in car){
                    console.log(car[i].arr.goodsAttrName)
                    console.log(goodsAttrName)
                    if(car[i].mark==mark&&car[i].arr.goodsAttrName==goodsAttrName){

                        that.buysub(i);
                        that.box.numb--
                        return false
                    }

                }

            },
            add(index,foodIndex,groupId) {//加
                var that = this
                var Von = that.Von
                var car = that.car



                var buyMininum=Von[index].distop[foodIndex].buyMininum
                //判断库存
                var goodsStock = Von[index].distop[foodIndex].goodsStock
                var numb = Von[index].distop[foodIndex].numb
                if ((parseInt(goodsStock) == 0) || ((parseInt(goodsStock) <= numb) && (parseInt(goodsStock) != -1))) {

                    that.showHobbyTips('没有库存了');
                    Von[index].distop[foodIndex].numb = Von[index].distop[foodIndex].numb
                    that.Von=Von
                    return false
                }
                if (parseInt(Von[index].distop[foodIndex].isSale) == 0) {
                    that.showHobbyTips('商品已下架');
                    Von[index].distop[foodIndex].numb = Von[index].distop[foodIndex].numb
                    that.Von=Von

                    return false
                }

                if (!Boolean(Von[index].distop[foodIndex].numb)) {
                    Von[index].distop[foodIndex].numb = 0
                }
                //n份起购，如果商品有n份起购，那么第一次添加此商品的数量为最小起购数量
                if (buyMininum > 1 && Von[index].distop[foodIndex].numb < buyMininum) {
                    Von[index].distop[foodIndex].numb = buyMininum
                    if(Von[index].allNumb){
                        Von[index].allNumb+=buyMininum
                    }else{
                        Von[index].allNumb=buyMininum
                    }
                } else {
                    Von[index].distop[foodIndex].numb++
                    if(Von[index].allNumb){
                        Von[index].allNumb++
                    }else{
                        Von[index].allNumb=1
                    }
                }

                that.Von=Von

                var arr = JSON.parse(JSON.stringify(Von[index].distop[foodIndex]))
                //折扣优惠判断
                if (arr.zkGoodsId && arr.buyNum != -1 && Number(arr.numb) == Number(arr.buyNum) + 1) {
                    that.showHobbyTips('此折扣商品限优惠' + arr.buyNum + '份,超过' + arr.buyNum + '份恢复原价');
                }
                arr.goodsAttrName=''
                var boxFee = that.boxFee
                var deskNum =that.deskNum
                if (deskNum == -1) {
                    if (arr.boxFee == '1') {
                        that.start++
                        var boxFees = that.start * boxFee
                        that.boxFees=boxFees
                    }
                }
                var mark = 'a' + index + 'b' + foodIndex
                var obj = { arr: arr, mark: mark };
                var car1 = car.filter(item => item.mark != mark)
                if (obj.arr.type == 2) {
                    if (car1.length > 0) {
                        Von[index].distop[foodIndex].numb = 0

                        that.Von=Von

                    } else {
                        car1.push(obj)

                        that.car=car1

                        // that.price() //下单购买
                    }
                } else {
                    car1.push(obj)

                    that.car=car1

                }
                that.zkPrice(index, foodIndex) //折扣价格处理
                that.sum()
            },
            sub(index,foodIndex){//减
                var that=this
                var Von = that.Von
                var buyMininum=Von[index].distop[foodIndex].buyMininum
                //n份限购，当商品的数量等于最小限购数，那么减去该商品的数量后为0
                if (buyMininum > 1 && buyMininum == Von[index].distop[foodIndex].numb) {
                    Von[index].allNumb-=Von[index].distop[foodIndex].numb
                    Von[index].distop[foodIndex].numb = 0
                } else {
                    Von[index].distop[foodIndex].numb--
                    Von[index].allNumb--
                }
                that.Von=Von

                var mark = 'a' + index + 'b' + foodIndex
                var arr = JSON.parse(JSON.stringify(Von[index].distop[foodIndex]))
                var boxFee = that.boxFee
                var deskNum = that.deskNum
                if (deskNum == -1) {
                    if (arr.boxFee == '1') {
                        that.start--
                        var boxFees = that.start * boxFee
                        that.boxFees=boxFees
                    }
                }

                var car = that.car
                var obj = { arr: arr, mark: mark };
                var car1 = car.filter(item => item.mark != mark)
                if (Von[index].distop[foodIndex].numb > 0) {
                    car1.push(obj)

                    that.car=car1
                    that.box.numb--
                } else {
                    for (var i in car) {
                        if (mark == car[i].mark) {
                            car.splice(i, 1)
                            that.box.numb=0
                            that.car=car
                            that.sum()
                            return
                        }
                    }
                }
                that.zkPrice(index, foodIndex) //折扣价格处理
                that.sum()
            },
            //购物总数弹出框的·加
            buyadd(index){
                var that=this
                var car = that.car


                var mark = car[index].mark

                var a = mark.substring(mark.indexOf("a") + 1, mark.indexOf("b"))
                var b = mark.substring(mark.indexOf("b") + 1)

                var Von = that.Von
                if ((parseInt(Von[a].distop[b].goodsStock) == 0) || ((parseInt(Von[a].distop[b].goodsStock) <= Von[a].distop[b].numb) && (parseInt(Von[a].distop[b].goodsStock) != -1))) {
                    that.showHobbyTips('没有库存了');
                    Von[a].distop[b].numb = Von[a].distop[b].numb
                    that.Von=Von
                    return false
                }

                car[index].arr.numb++
                Von[a].distop[b].numb++
                var arr = Von[a].distop[b]
                if (arr.zkGoodsId && arr.buyNum != -1 && Number(arr.numb) == Number(arr.buyNum) + 1) {
                    that.showHobbyTips('此折扣商品限优惠' + arr.buyNum + '份,超过' + arr.buyNum + '份恢复原价');
                }
                var boxFee = that.boxFee
                var deskNum = that.deskNum
                if (deskNum == -1) {
                    if (arr.boxFee == '1') {
                        that.start++
                        var boxFees = start * boxFee

                        that.boxFees=boxFees

                    }
                }


                if(Von[a].allNumb){
                    Von[a].allNumb++
                }else{
                    Von[a].allNumb=1
                }
                that.Von=Von;
                that.car=car;
                that.zkPrice(a, b) //折扣价格处理
                that.sum()
            },
            //购物总数弹出框的·减
            buysub(index){
                var that=this
                var car = that.car
                var Von = that.Von
                if (!car[index]) {
                    return false
                }
                //n份限购，当商品的数量等于最小限购数，那么减去该商品的数量后为0
                if (car[index].arr.buyMininum > 1 && car[index].arr.buyMininum == car[index].arr.numb) {
                    car[index].arr.numb = 0
                } else {
                    car[index].arr.numb--
                }
                var mark = car[index].mark
                var a = mark.substring(mark.indexOf("a") + 1, mark.indexOf("b"))
                var b = mark.substring(mark.indexOf("b") + 1)


                //n份限购，当商品的数量等于最小限购数，那么减去该商品的数量后为0
                if (Von[a].distop[b].buyMininum > 1 && Von[a].distop[b].buyMininum == Von[a].distop[b].numb) {
                    Von[a].allNumb-=Von[a].distop[b].numb
                    Von[a].distop[b].numb = 0
                } else {
                    Von[a].distop[b].numb--
                    Von[a].allNumb--
                }
                var arr = Von[a].distop[b]
                var deskNum = that.deskNum
                if (deskNum == -1) {
                    var boxFee = that.boxFee
                    if (arr.boxFee == '1') {
                        that.start--
                        var boxFees = start * boxFee

                        that.boxFees=boxFees

                    }
                }

                if (car[index].arr.numb <= 0) {
                    car.splice(index, 1)

                }
                that.car=car;
                that.Von=Von;

                that.zkPrice(a, b) //折扣价格处理
                that.sum()
                if(that.car.length<=0){
                    that.goods=false
                }
            },
            //规格详情弹出框
            specBoxShowClick(index,foodIndex) {
                var that=this

                //对应左边类目
                var Von = that.Von
                var box = JSON.parse(JSON.stringify(Von[index].distop[foodIndex]))
                var mark = 'a' + index + 'b' + foodIndex
                box.mark = mark

                //规格
                box.spec_size=''
                box.spec_taste=''
                that.box=box
                that.specBoxShow=true
                //显示规格弹出框并自动选择所有选项的第一个
                if(box.guige.length>0){
                    for(var i in box.guige){
                        if(box.guige[i].stock>0||box.guige[i].stock==-1){
                            that.sizeClick(i,box.guige[i].guigeName)
                            break;
                        }

                    }

                }

                for (let i in box.guigeAttr){
                    that.tasteClick(i,box.guigeAttr[i].attrContent[0],0)

                }
            },
            //获取点击的规格
            sizeClick(index,val){
                var that=this
                var box = that.box //获取弹出盒子的数据
                // var goodsId = box.goodsId
                that.$set(that.box,'choose',index) //点击变色

                var mark = box.mark;
                var a = mark.substring(mark.indexOf("a") + 1, mark.indexOf("b"))
                var b = mark.substring(mark.indexOf("b") + 1)
                var Von = that.Von
                box.shopPrice = Von[a].distop[b].guige[index].price
                box.spec_size = val
                that.checkBox(box)
            },
            tasteClick(index,val,attrIndex){
                var that=this
                var box = that.box //获取弹出盒子的数据
                that.$set(that. box.guigeAttr[index],'choose',attrIndex)//点击变色
                that.spec_taste[index] = val
                box.spec_taste = ''
                var specTasteName=''
                for (var i in box.guigeAttr){
                    if (that.spec_taste[i]){
                        box.spec_taste += that.spec_taste[i]
                        if( box.spec_size){
                            specTasteName+=','+that.spec_taste[i]
                        }else{
                            specTasteName=that.spec_taste[i]
                        }

                        if(i!=box.guigeAttr.length-1) {
                            box.spec_taste += "+"
                        }
                    }

                }
                that.specTasteName=specTasteName
                that.checkBox(box)
            },
            // 判断是否选好了
            checkBox:function(box){
                var that=this
                var car=that.car
                for(let i in car){
                    if(car[i].arr.goodsId==box.goodsId&&car[i].arr.spec_size==box.spec_size&&car[i].arr.spec_taste==box.spec_taste){
                        that.box.numb=car[i].arr.numb
                        break
                    }else{
                        that.box.numb=0
                    }

                }


                that.box=box

            },
            //选好了
            ok: function () {
                var that=this
                var box = that.box
                var car =that.car


                if (car.length>0&&box.groupId!=car[0].arr.groupId) {
                    that.showHobbyTips(that.type==1?'只能选择一种团购商品':'只能选择一种代金券商品');
                    return false
                }//团购限制选择商品


                var mark = box.mark //获取弹出盒子的弹出哪件商品标识
                var a = mark.substring(mark.indexOf("a") + 1, mark.indexOf("b"))
                var b = mark.substring(mark.indexOf("b") + 1)
                var Von = that.Von
                var buyMininum=Von[a].distop[b].buyMininum
                Von[a].distop[b].shopPrice = box.shopPrice
                Von[a].distop[b].spec_size = box.spec_size
                Von[a].distop[b].spec_taste = box.spec_taste
                Von[a].distop[b].goodsAttrName = (Von[a].distop[b].spec_size ? Von[a].distop[b].spec_size : "") + (Von[a].distop[b].spec_size && Von[a].distop[b].spec_taste ? '+' : '')
                Von[a].distop[b].goodsAttrName += Von[a].distop[b].spec_taste ? Von[a].distop[b].spec_taste : ""
                Von[a].distop[b].decide = box.decide;


                //判断库存
                var goodsStock = Von[a].distop[b].goodsStock
                var numb = Von[a].distop[b].numb
                for (var i in that.car) {
                    if (that.car[i].arr.spec_size && Von[a].distop[b].spec_size == that.car[i].arr.spec_size) {
                        numb = that.car[i].arr.numb
                        break;
                    } else {
                        numb = 0
                    }
                }
                if ((parseInt(goodsStock) == 0) || ((parseInt(goodsStock) <= numb) && (parseInt(goodsStock) != -1))) {
                    that.showHobbyTips('没有库存了');
                    Von[a].distop[b].numb = Von[a].distop[b].numb
                    that.Von=Von
                    return false
                }
                if (parseInt(Von[a].distop[b].isSale) == 0) {
                    that.showHobbyTips('商品已下架');
                    Von[a].distop[b].numb = Von[a].distop[b].numb
                    that.Von=Von

                    return false
                }


                if (isNaN(Von[a].distop[b].numb)){
                    Von[a].distop[b].numb = 0
                }


                Von[a].distop[b].numb++
                that.box.numb++
                if(Von[a].allNumb){
                    Von[a].allNumb++
                }else{
                    Von[a].allNumb=1
                }


                var arr = JSON.parse(JSON.stringify(Von[a].distop[b]))
                //折扣优惠判断
                if (arr.zkGoodsId && arr.buyNum != -1 && Number(arr.numb) == Number(arr.buyNum) + 1) {
                    that.showHobbyTips('此折扣商品限优惠' + arr.buyNum + '份,超过' + arr.buyNum + '份恢复原价');
                }

                var car1 = car
                if (car1.filter(item => item.arr.goodsId == arr.goodsId && item.arr.spec_size == arr.spec_size && item.arr.spec_taste == arr.spec_taste).length > 0) {
                    car1.filter(item => item.arr.goodsId == arr.goodsId && item.arr.spec_size == arr.spec_size && item.arr.spec_taste == arr.spec_taste)[0].arr.numb++;
                }
                else {
                    //n份起购，如果商品有n份起购，那么第一次添加此商品的数量为最小起购数量
                    if (arr.buyMininum > 1) {
                        arr.numb = arr.buyMininum
                    } else {
                        arr.numb = 1;
                    }
                    // arr.userId = wx.getStorageSync('usersInfo').userId
                    var obj = { arr: arr, mark: mark };
                    car1.push(obj)
                }


                that.Von=Von
                // that.boxShow=false
                // that.bargainShow=false
                // that.specBoxShow=false
                that.car=car1
                that.zkPrice(a, b) //折扣价格处理
                that.sum()
            },
            //总数
            sum(){
                var that=this
                var totalprice = 0
                var totalnumb = 0
                var totalMarketPrice = 0
                var car = that.car
                that.totalPrices(); //计算每件商品的总价和餐盒费
                for (var i = 0,len=car.length; i < len; i++) {
                    totalprice += Number(car[i].arr.totalPrice);
                    totalMarketPrice += car[i].arr.marketPrice * car[i].arr.numb;
                    totalnumb += car[i].arr.numb
                }
                if (that.boxFee && that.shopType != 5) {
                    totalprice = Number(totalprice) + Number(that.boxFee)
                }
                totalMarketPrice = Number(totalMarketPrice)
                totalprice = Number(totalprice).toFixed(2)
                totalMarketPrice = Number(totalMarketPrice).toFixed(2)

                that.totalprice=totalprice;
                that.totalnumb=totalnumb;
                that.totalMarketPrice=totalMarketPrice;
                //判断起送价
                // if (that.id == undefined) {
                //外卖或到店自取的起送价

                // } else {
                //     // that.shareIdD=true
                //     that.shopCar=true
                // }

            },
            //折扣价格处理
            zkPrice(a, b) {
                var that = this
                var Von = that.Von
                var car1 = that.car
                if (Von[a].distop[b].zkGoodsId) {
                    var preferentialNumb = 0 //优惠数量

                    for (var i = car1.length - 1; i >= 0; i--) {
                        if (car1[i].arr.buyNum != -1) {
                            if (car1[i].arr.zkGoodsId == Von[a].distop[b].zkGoodsId) {

                                if (preferentialNumb < car1[i].arr.buyNum) {
                                    if (car1[i].arr.numb >= car1[i].arr.buyNum - preferentialNumb) {
                                        car1[i].arr.preferentialNumb = Number(car1[i].arr.buyNum) - preferentialNumb
                                    } else {
                                        car1[i].arr.preferentialNumb = Number(car1[i].arr.numb)
                                    }
                                } else {
                                    car1[i].arr.preferentialNumb = 0
                                }
                                // } else {
                                //     car1[i].arr.preferentialNumb = Number(car1[i].arr.numb)
                                // }
                                preferentialNumb += car1[i].arr.preferentialNumb
                                if (car1[i].arr.preferentialNumb != 0) {
                                    if (car1[i].arr.buyNum != -1 && Number(car1[i].arr.numb) > Number(car1[i].arr.preferentialNumb)) {
                                        car1[i].arr.totalPrice = (Number(car1[i].arr.shopPrice) * Number(car1[i].arr.preferentialNumb) + Number(car1[i].arr.marketPrice) * (Number(car1[i].arr.numb) - Number(car1[i].arr.preferentialNumb))).toFixed(2)
                                    } else {
                                        car1[i].arr.totalPrice = (Number(car1[i].arr.shopPrice) * Number(car1[i].arr.numb)).toFixed(2)
                                    }
                                } else {
                                    car1[i].arr.totalPrice = (Number(car1[i].arr.marketPrice) * Number(car1[i].arr.numb)).toFixed(2)
                                }
                            }
                        }
                    }
                }
                that.car=car1
            },
            //计算每件商品的总价
            totalPrices: function() {
                var that = this
                var car = that.car
                var boxFee = 0


                for (var i in car) {
                    if (car[i].arr.bargainId && car[i].arr.numb > 1) {
                        car[i].arr.totalPrice = (Number(car[i].arr.shopPrice) + Number(car[i].arr.marketPrice) * (Number(car[i].arr.numb) - 1)).toFixed(2)
                    } else if (car[i].arr.zkGoodsId) {

                    } else {
                        car[i].arr.totalPrice = (Number(car[i].arr.shopPrice) * Number(car[i].arr.numb)).toFixed(2)
                    }
                    car[i].arr.totalMarketPrice = (Number(car[i].arr.marketPrice) * Number(car[i].arr.numb)).toFixed(2)
                    boxFee += Number(car[i].arr.boxFee) * Number(car[i].arr.numb)
                }
                that.car=car
                that.boxFee=boxFee
            },
            shareChooseTrue(){
                var that=this
                var car =that.car
                var orderFood = []
                for (var i in car) {
                    orderFood[i] = car[i].arr
                    orderFood[i].mark = car[i].mark
                }
                var passCheck = true
                if (that.requiredCatId) {
                    passCheck = false
                    for (var i in car) {
                        if (car[i].arr.shopCatId2 === that.requiredCatId) {
                            var passCheck = true
                            break;
                        }
                    }
                }
                if (passCheck) {
                    that.orderfoodBegain(orderFood)
                    that.editShare()
                }else{
                    that.showHobbyTips('需要选择[' + that.requiredName + ']下的商品才可下单哦~')
                    that.catNameIndex=requiredIndex
                }

            },
            //对折扣商品做处理，把折扣商品超出数量部分分开
            orderfoodBegain(orderFood){
                var that=this
                var orderfoodBegain = JSON.parse(JSON.stringify(orderFood))
                for (var i in orderfoodBegain) {
                    var arr = ''
                    if (orderfoodBegain[i].zkGoodsId && orderfoodBegain[i].buyNum != -1 && orderfoodBegain[i].numb != orderfoodBegain[i].preferentialNumb) { //折扣
                        if (orderfoodBegain[i].preferentialNumb == 0) {
                            orderFood[i].zkGoodsId = ''
                            orderFood[i].shopPrice = orderFood[i].marketPrice
                        } else if (Number(orderfoodBegain[i].numb) - Number(orderfoodBegain[i].preferentialNumb) > 0) {
                            arr = orderfoodBegain[i]
                            arr.zkGoodsId = ''
                            arr.shopPrice = arr.marketPrice
                            arr.numb = Number(arr.numb) - Number(arr.preferentialNumb)
                            arr.totalPrice = arr.totalMarketPrice = (Number(arr.shopPrice) * Number(arr.numb)).toFixed(2)
                            orderFood.push(arr)
                            orderFood[i].numb = Number(arr.preferentialNumb)
                            orderFood[i].totalPrice = (Number(orderFood[i].shopPrice) * Number(orderFood[i].numb)).toFixed(2)
                            orderFood[i].totalMarketPrice = (Number(orderFood[i].marketPrice) * Number(orderFood[i].numb)).toFixed(2)
                        }
                    }
                }
                that.orderFood=orderFood
            },
            editShare(){
                var that=this
                var data={
                    token:that.userInfo.token,
                    shareId: that.shareId,
                    goodsInfo:JSON.stringify(that.orderFood)
                }
                axios({
                    method: "post",
                    url:'https://www.aftdc.com/mobile/Index/editShare',
                    data:data,
                    // headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                }).then(function (res) {
                    // alert('A'+JSON.stringify(that.orderFood))
                    if(res.data.res==1){
                        window.location.href=document.referrer;
                    }else{
                        that.showHobbyTips(res.data.info)
                    }
                })
            },
            shopCarShowClick(){
                var that=this
                if(that.car.length<=0){
                    return false
                }

                that.goods=!that.goods
            },

            //点击黑色层跳出弹出框
            boxHide(){
                var that=this
                that.specBoxShow=false
            },
            /*清空购物车*/
            closeShopCarClick(){
                var that=this
                var car = that.car
                var Von = that.Von
                var a = Von.length;
                for (var i = 0; i < a; i++) {
                    if (Boolean(Von[i].distop)) {
                        var b = Von[i].distop.length
                        for (var j = 0; j < b; j++) {
                            Von[i].distop[j].numb = 0
                        }
                    }
                }
                that.car=[];
                that.Von=Von;
                that.boxFees=0
                that.start = 0;
                that.sum()
                that.goods=false
            },
            onCurrentTabClick(toggle){
                var that=this
                that.currentTab=toggle
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