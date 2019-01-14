<template>
    <div class="wrapper" @viewappear="viewappear" @viewdisappear="viewdisappear">

        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    :use-default-return="false"
                    v-once
            >
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">拼单</text>
            </wxc-minibar>
        </div>
        <scroller class="list">
            <refresh class="refresh" @refresh="onrefreshShops"  :display="refreshing ? 'show' : 'hide'">
                <image class="indicator" src="https://image.aftdc.com/appBimg/ic_loading_gif.gif"></image>
            </refresh>

            <div class="bar">
                <text class="barText" :style="{fontSize:GLOBAL.defaultFS}">商家可按订餐人分开打包商品</text>
                <div class="barAdd" @click="addBookerClick">
                    <image class="barAddIcon" src="https://image.aftdc.com/appBimg/add_icon.png"></image>
                    <text class="barAddText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor}">邀请好友</text>
                </div>
            </div>


            <div >
                <text class="collageInfo" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">拼单列表</text>
                <div class="listCell"  v-for="(item,index) in shareOrderList">
                    <div class="listDiv">
                        <image class="collager_photo" :src="item.userPhoto" ></image>
                        <div class="collager_message" >
                            <div class="listTop" >
                                <div class="listTop_label">
                                    <text class="name" @click="editorClick(index)" :style="{fontSize:'30px',color:GLOBAL.dColor}">{{item.userName}}</text>
                                    <text class="labelStyle" :style="{fontSize:'18px',color:GLOBAL.tColor}">{{item.myOrder?'我':'微信'}}</text>
                                </div>
                                <div class="collager_button">
                                    <text class="addCommodity" @click="editShopFoodClick()" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.tColor}" v-if="item.myOrder">{{item.goodsInfo.length==0?'添加商品':'修改商品'}}</text>
                                    <text class="close" @click="deleteClick(index,item.myOrder)" :style="{fontSize:GLOBAL.smallFS}" v-if="item.goodsInfo.length>0">清空</text>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="listBottom">
                        <text class="prompt" v-if="item.goodsInfo.length==0" :style="{fontSize:GLOBAL.bigFS}">暂时没有点菜</text>
                        <div class="listBottomDiv" v-else v-for="(food,foodIndex) in item.goodsInfo" >
                            <div class="listBottomDiv_mes">
                                <text class="foodName" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{food.goodsName}}</text>
                                <text class="foodNumber" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">x{{food.numb}}</text>
                                <text class="totalPriceNumber" :style="{fontSize:GLOBAL.bigFS,color:'#fb574e'}">￥{{food.totalPrice}}</text>
                            </div>
                            <text :style="{fontSize:GLOBAL.defaultFS,color:'999'}" v-if="food.goodsAttrName">{{food.goodsAttrName}}</text>
                        </div>
                        <div class="listBottomDiv"  v-if="item.boxFees">
                            <div class="listBottomDiv_mes">
                                <text class="foodName" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">包装费</text>
                                <text class="foodNumber" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}"></text>
                                <text class="totalPriceNumber" :style="{fontSize:GLOBAL.bigFS,color:'#fb574e'}">￥{{item.boxFees}}</text>
                            </div>
                        </div>
                    </div>
                </div>

                <!--全部拼单-->
                <!--<div class="allCollage">-->
                <!--<text class="allCollageTop" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">全部拼单</text>-->
                <!--<div class="allCollageBottom row" :class="[index!=0?'allCollageBottomTwo':'']" v-for="(item,index) in allCollageList" :key="index">-->
                <!--<div class="row">-->
                <!--<div class="allCollageImage">-->
                <!--<image class="allCollageImage" :src="item.image"></image>-->
                <!--</div>-->
                <!--<div class="allCollageContent">-->
                <!--<div class="allCollageContentTop row">-->
                <!--<text class="allCollageName" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.name}}</text>-->
                <!--<text class="allCollageDifference" :style="{fontSize:GLOBAL.defaultFS}">还差{{item.peopel}}人</text>-->
                <!--</div>-->
                <!--<text class="allCollageTime" :style="{fontSize:GLOBAL.smallFS}">剩余 {{item.time/3600<10?'0'+Math.floor(item.time/3600)+':':Math.floor(item.time/3600)+':'}}{{item.time%3600/60<10?'0'+Math.floor(item.time%3600/60)+':':Math.floor(item.time/60)+':'}}{{item.time%60<10?'0'+item.time%60:item.time%60}}</text>-->
                <!--</div>-->
                <!--</div>-->
                <!--<text class="allCollageInvitation" :style="{fontSize:GLOBAL.defaultFS}">{{item.type==0?'邀请好友':'加入拼单'}}</text>-->

                <!--</div>-->
                <!--</div>-->

            </div>

        </scroller>
        <div class="bottom" v-if="submit">
            <div class="bottomCost">
                <div class="bottomPrice">
                    <text class="bottomPriceBig" :style="{fontSize:GLOBAL.biggestFS}">￥{{totalprice}}</text>
                    <!--<text class="bottomPriceSmall" :style="{fontSize:GLOBAL.smallFS}">已优惠￥5</text>-->
                </div>
                <text class="distributionFee" :style="{fontSize:GLOBAL.smallFS}">另需配送费￥{{shopInfo.psf}}元</text>
            </div>
            <text class="bottomTextB" v-if="distance_price>0" :style="{fontSize:GLOBAL.defaultFS}">还差￥{{distance_price}}元起{{orderType==0?'送':'购'}}</text>
            <text class="bottomSettlement" v-else @click="toOrderPage()" :style="{fontSize:GLOBAL.bigFS}">去结算</text>

        </div>
        <div class="bottom" v-else>
            <text class="bottomTextA" :style="{fontSize:GLOBAL.defaultFS}">未选购商品</text>
            <text class="bottomTextB" :style="{fontSize:GLOBAL.defaultFS}">￥{{orderType==0?shopInfo.qsj+'元起送':orderType==5?shopInfo.selfDeliveryFreeMoney+'元起购':'出错啦'}}</text>
        </div>

        <!--弹出层star-->

        <!--&lt;!&ndash;关闭拼单&ndash;&gt;-->
        <!--<div class="modifyContentDivTwo" @click="" :style="{left:modifyLeft,opacity:0}" ref="test">-->
        <!--<div class="modifyContentTwo">-->
        <!--<text class="modifyTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">确认清空?</text>-->
        <!--<text class="closeDetails" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">清空后不可恢复</text>-->
        <!--<div class="modifyBottom">-->
        <!--<text style="flex: 1"></text>-->
        <!--<text class="closeCancel" @click="closeCancelClick" :style="{fontSize:GLOBAL.defaultFS}">取消</text>-->
        <!--<text class="closeConfirm" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}">确认</text>-->
        <!--</div>-->
        <!--</div>-->
        <!--</div>-->

        <!--修改昵称-->
        <!--<div class="modifyContentDiv" @click="" :style="{left:renameLeft,opacity:0}" ref="testTwo">-->
        <!--<div class="modifyContent">-->
        <!--<text class="modifyTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">修改昵称</text>-->
        <!--<input type="text" class="modifyInput" placeholder="输入昵称(2-12字)" v-model="modifyText" ref="firInput" @focus="allFocus" @blur="allBlur" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">-->
        <!--<div class="modifyBottom">-->
        <!--<text style="flex: 1"></text>-->
        <!--<text class="closeCancel" @click="modifyCancelClick" :style="{fontSize:GLOBAL.defaultFS}">取消</text>-->
        <!--<text class="closeConfirm" :class="[modifyText.length>0?'':'closeConfirmTwo']" @click="modifyConfirmClick" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}">确认</text>-->
        <!--</div>-->
        <!--</div>-->
        <!--</div>-->
        <div class="share_lock" v-if="shareStatus>1">
            <text :style="{fontSize:'35px',color:'#999'}">锁定状态，手动解锁后可继续拼单</text>
            <text class="lockBotton" @click="unlockShareClick()" :style="{fontSize:GLOBAL.biggerFS,color:'#fff'}">解锁</text>
        </div>
        <!--弹出层end-->
        <toast ref="toast"></toast>
    </div>
</template>

<script>
    import Toast from './Toast.vue';
    import {WxcMask, WxcMinibar} from 'weex-ui';
    const GLOBAL = require('@/Global.vue');
    const animation = weex.requireModule('animation')
    const modal = weex.requireModule('modal')
    const event = weex.requireModule('event');
    const post = weex.requireModule('stream');
    const navigator = weex.requireModule('navigator');
    export default {
        components: {WxcMask, WxcMinibar,Toast},
        name: 'App',
        data() {
            return {
                // btnShow:true,//底部去结算
                renameLeft:'-750px',//修改昵称
                modifyLeft:'-750px',//关闭拼单
                showCollage:false,//发起拼单和拼单信息的显示隐藏
                modifyText:'',//与input输入框的数据绑定
                allCollageList:[
                    {image:'https://image.aftdc.com/images/packageA/shopImg2.jpg',peopel:1,time:200,type:0},
                    {image:'https://image.aftdc.com/images/packageA/shopImg2.jpg',peopel:1,time:400,type:1},
                    {image:'https://image.aftdc.com/images/packageA/shopImg2.jpg',peopel:1,time:300,type:1},
                ],//全部拼单(type为0时邀请好友,1时加入拼单,time以秒为单位)
                collageList:[
                    {
                        name:'千寻',totalPrice:50,
                        orderList:[
                            {foodName:'麦香鸡',number:1,price:10.4,},
                            {foodName:'麦香鸡',number:1,price:10.4,},
                        ],
                    },
                ],
                inputFocus:false,
                blurPrevent:true,//阻止多次失去焦点的定时器
                shareId:'',
                totalMarketPrice:'',
                boxFee:'',

                //拼单详情
                shareOrderList:'',
                shareStatus:0,
                totalprice:'',
                submit:'',//是否可以提交
                distance_price:'',
                //通用
                token:'',
                imei:'',
                shopId:'',
                shopType:'',
                orderType:'',
                requiredCatId:'',
                requiredName:'',
                shopInfo:'',
                orderFood:'',
                longitude:'',
                latitude:'',
                pageBack:false,
                refreshing: false,
            }
        },
        created(){
            var that=this
            event.init();
            that.token = weex.config.token;
            that.imei = weex.config.imei;
            that.userId = weex.config.userId;
            that.latitude = weex.config.latitude;
            that.longitude = weex.config.longitude;
            var param=JSON.parse(weex.config.param)
            that.shopId=param.shopId
            that.orderType=param.orderType
            that.shopType=param.shopType
            if(param.requiredCatId){
                that.requiredCatId=param.requiredCatId
                that.requiredName=param.requiredName
            }
            that.shopInfo=JSON.parse(event.find('shopInfo'))

            if(event.find(that.shopId+'orderFood'+that.shopType)){
                var orderFood=JSON.parse(event.find(that.shopId+'orderFood'+that.shopType))
                that.orderfoodBegain(orderFood)
            }

            //开启拼单
            that.startShare();
            //对折扣商品做处理，把折扣商品超出数量部分分开



        },
        methods: {
            //开启拼单
            startShare(){
                var that=this
                var param=that.GLOBAL.sign(that.token,that.imei)
                param+='&shopId='+that.shopId
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/userapp/Index/startShare',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                }, function (res) {
                    if(res.data.res==1) {
                        that.shareId=res.data.data.shareId
                        that.editShare()

                    }
                })
            },
            //修改拼单商品
            editShare(){
                var that=this
                var param=that.GLOBAL.sign(that.token,that.imei)
                param+='&shareId='+that.shareId+'&goodsInfo='+JSON.stringify(that.orderFood)
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/userapp/Index/editShare',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                }, function (res) {

                    if(res.data.res==1) {
                        that.getShareDetail();
                    }
                })
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
            getShareDetail(){
                var that=this
                var param=that.GLOBAL.sign(that.token,that.imei)
                param+='&shareId='+that.shareId
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/userapp/Index/shareDetail',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                }, function (res) {
                    console.log(param)
                    console.log(JSON.stringify(res))
                    if(res.data.res==1) {
                        that.shareOrderList=res.data.data.userList
                        that.shareStatus=res.data.data.userList[0].shareStatus
                        that.totalprice=res.data.data.needPay
                        that.submit=res.data.data.submit
                        if (that.orderType == 0) {
                            var dfm = that.shopInfo.qsj
                            var distance_price = parseInt(dfm * 100 - res.data.data.allMoney * 100) / 100
                        }
                        //到店自取的起购价
                        if (that.orderType == 5) {
                            var dfm = that.shopInfo.selfDeliveryFreeMoney
                            var distance_price = parseInt(dfm * 100 - res.data.data.allMoney * 100) / 100
                        }
                        that.distance_price=distance_price
                    }
                })
            },
            //总数
            sum(){
                var that=this
                var totalprice = 0
                var totalMarketPrice = 0
                var car = that.orderFood
                that.totalPrices(); //计算每件商品的总价和餐盒费
                for (var i = 0,len=car.length; i < len; i++) {
                    totalprice += Number(car[i].totalPrice);
                    totalMarketPrice += car[i].marketPrice * car[i].numb;
                    boxFee += Number(car[i].boxFee) * Number(car[i].numb)
                }
                if (boxFee) {
                    totalprice = Number(totalprice) + Number(that.boxFee)
                }
                totalprice = Number(totalprice).toFixed(2)
                totalMarketPrice = Number(totalMarketPrice).toFixed(2)

                that.totalprice=totalprice;
                that.totalMarketPrice=totalMarketPrice;
                that.boxFee=boxFee
                //判断起送价
                // if (that.id == undefined) {
                //外卖或到店自取的起送价
                if (that.orderType == 0) {
                    var dfm = that.shopInfo.qsj
                    var distance_price = parseInt(dfm * 100 - totalMarketPrice * 100) / 100
                }
                //到店自取的起购价
                if (that.orderType == 5) {
                    var dfm = that.shopInfo.selfDeliveryFreeMoney
                    var distance_price = parseInt(dfm * 100 - totalMarketPrice * 100) / 100
                }

                if (distance_price > 0) {
                    that.distance_price=distance_price
                    that.shopCar=false
                } else if (car.length < 1) {
                    that.shopCar=false
                } else {
                    that.distance_price=false
                    that.shopCar=true
                }
                // } else {
                //     // that.shareIdD=true
                //     that.shopCar=true
                // }

            },
            allFocus(){
                var that=this
                that.inputFocus=true

            },
            allBlur(){
                var that=this

                if(that.blurPrevent) {
                    that.blurPrevent = false;
                    setTimeout(function () {
                        that.inputFocus = false;
                        that.blurPrevent=true;
                    }, 150)
                }

            },

            minibarLeftButtonClick(){
                var that=this
                modal.confirm({
                    message: '你确定退出拼单吗?',
                    okTitle:'确定',
                    cancelTitle:'取消',
                    duration: 0.3
                },function (result) {
                    if(result=='确定') {
                        var param=that.GLOBAL.sign(that.token,that.imei)
                        param+='&shareId='+that.shareId
                        post.fetch({
                            method: 'POST',
                            type: 'json',
                            body: param,
                            url: 'https://www.aftdc.com/userapp/Index/delShare',
                            headers: {"Content-Type": "application/x-www-form-urlencoded"},
                        }, function (res) {
                            if(res.data.res==1) {
                                navigator.pop({animated: 'true'});
                            }
                        })
                    }
                })
            },


            addBookerClick(){
                var that=this
                var shareTitle='要一起拼单吗？'
                var shareImg='https://image.aftdc.com/'+that.shopInfo.shopImg
                var webUrl='https://www.aftdc.com/mobile/Goods/collage.html?shopId='+that.shopId+'&latitude='+that.latitude+'&longitude='+that.longitude+'&shareId='+that.shareId+'&shopType='+that.shopType
                var description='我想点'+that.shopInfo.shopName+'，有人一起么？'
                event.shareWxUrl(shareTitle,shareImg,webUrl,description,1);
            },// 发起拼单

            //动画
            moveOne(opacity){
                var testEl = this.$refs.test;
                animation.transition(testEl, {
                    styles: {
                        opacity: opacity,
                    },
                    duration: 300, //ms
                    timingFunction: 'ease',
                    delay: 0 //ms
                })
            },
            moveTwo(opacity){
                var testEl = this.$refs.testTwo;
                animation.transition(testEl, {
                    styles: {
                        opacity: opacity,
                    },
                    duration: 300, //ms
                    timingFunction: 'ease',
                    delay: 0 //ms
                })
            },
            //点击弹出关闭拼单对话框
            deleteClick:GLOBAL.throttle(function(index,myOrder){
                var that=this
                modal.confirm({
                    message: '清空后不可恢复，确认清空吗?',
                    okTitle:'确定',
                    cancelTitle:'取消',
                    duration: 0.3
                },function (result) {
                    if(result=='确定'){
                        if(myOrder){
                            that.orderFood=''
                            that.editShare()
                            event.delete(that.shopId+'orderFood'+that.shopType)
                        }else{
                            that.delFshare(index)
                        }

                    }
                })

            }),
            delFshare(index){
                var that=this
                var userId=that.shareOrderList[index].userId
                var param=that.GLOBAL.sign(that.token,that.imei)
                param+='&shareId='+that.shareId+'&userId='+that.userId
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/userapp/Index/delFshare',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                }, function (res) {
                    if(res.data.res==1) {
                        that.getShareDetail();
                    }
                })
            },
            onrefreshShops (event) {//首页下拉刷新
                this.refreshing = true
                setTimeout(() => {
                    this.refreshing = false
                }, 2000)
                this.getShareDetail()
            },
            closeCancelClick(){
                var that=this;
                this.moveOne(0);
                setTimeout(function () {
                    that.modifyLeft='-750px'
                },300)
            },

            editorClick(){
                var that=this;
                that.modifyText=that.collageList[0].name

                this.renameLeft='0px';
                this.moveTwo(1);
                // setTimeout(function () {
                //     that.$refs.firInput.focus();
                // },0)

            },//点击编辑图标

            modifyCancelClick(){
                var that=this;
                that.$refs.firInput.blur()
                that.moveTwo(0);
                setTimeout(function () {
                    that.renameLeft='-750px'
                },300)
            },//取消编辑

            //点击确认修改昵称
            modifyConfirmClick(){
                var that=this;
                if(that.modifyText!=''){
                    var that=this;
                    that.collageList[0].name=that.modifyText;
                    that.$refs.firInput.blur()
                    var that=this;
                    that.moveTwo(0);
                    setTimeout(function () {
                        that.renameLeft='-750px'
                    },300)
                }
            },
            toOrderPage:GLOBAL.throttle(function(){
                var that=this
                modal.confirm({
                    message: '去结算后其他用户不可加入，确定去结算么?',
                    okTitle:'确定',
                    cancelTitle:'取消',
                    duration: 0.3
                },function (result) {
                    if(result=='确定'){
                        var passCheck = true
                        if(that.requiredCatId){
                            passCheck=false
                            for(var i in that.shareOrderList[0].goodsInfo){
                                if(that.shareOrderList[0].goodsInfo[i].shopCatId2==that.requiredCatId){
                                    passCheck=true
                                    break
                                }
                            }
                        }
                        if(passCheck){
                            var param=that.GLOBAL.sign(that.token,that.imei)
                            param+='&shareId='+that.shareId
                            post.fetch({
                                method: 'POST',
                                type: 'json',
                                body: param,
                                url: 'https://www.aftdc.com/userapp/Index/lockShare',
                                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                            }, function (res) {
                                if(res.data.res==1) {
                                    var param={shareId:that.shareId,shareOrderList:that.shareOrderList,orderType:that.orderType,shopType:that.shopType};
                                    var url='http://assets/orderPage.js';
                                    event.toUrl({"url":url,"param":JSON.stringify(param)})
                                }
                            })
                        }else{
                            const toast=that.$refs.toast
                            toast.editContent('需要选择[' + that.requiredName + ']下的商品才可下单哦~')
                        }

                    }
                })
            }),
            unlockShareClick(){
                var that=this
                modal.confirm({
                    message: '你确定解锁拼单吗?',
                    okTitle:'确定',
                    cancelTitle:'取消',
                    duration: 0.3
                },function (result) {
                    if(result=='确定') {

                        var param=that.GLOBAL.sign(that.token,that.imei)
                        param+='&shareId='+that.shareId
                        post.fetch({
                            method: 'POST',
                            type: 'json',
                            body: param,
                            url: 'https://www.aftdc.com/userapp/Index/unlockShare',
                            headers: {"Content-Type": "application/x-www-form-urlencoded"},
                        }, function (res) {

                            if(res.data.res==1) {
                                that.getShareDetail();
                            }
                        })
                    }
                })
            },

            editShopFoodClick:GLOBAL.throttle(function(){
                var that=this
                var param={shopId:that.shopId,shareOrder:true,orderType:that.orderType,shopType:that.shopType};
                var url='http://assets/businessOrder.js';
                event.toUrl({"url":url,"param":JSON.stringify(param)})
            }),
            viewappear(){
                var that=this
                if (!that.pageBack) { return; }
                that.pageBack = false;
                var orderFood=JSON.parse(event.find(that.shopId+'orderFood'+that.shopType))
                //对折扣商品做处理，把折扣商品超出数量部分分开
                that.orderfoodBegain(orderFood)
                that.editShare()
                that.getShareDetail()
            },
            viewdisappear() {
                var that=this
                that.pageBack = true;
            },
        },
        computed:{
            sum(){
                var totalPrice=0;
                for(var i in this.collageList){
                    totalPrice+=this.collageList[i].totalPrice;
                }
                return totalPrice;
            },
        },
        mounted(){

        },
    }
</script>

<style scoped>

    .bottomTextB{
        color: #fff;
        height: 100px;
        line-height: 100px;
        padding-right: 30px;
    }
    .bottomTextA{
        color: #fff;
        flex: 1;
        height: 100px;
        line-height: 100px;
        padding-left: 30px;
    }
    .promptindex{
        position: fixed;
        top:450px;
        left: 300px;
        width: 150px;
        height: 40px;
        line-height: 40px;
        background-color: rgba(0,0,0,0.5);

    }
    .modifyInput{
        padding-top: 20px;
        padding-bottom: 20px;
        padding-left: 10px;
        padding-right: 10px;
        margin-top: 30px;
        width: 520px;
        border-style: solid;
        border-color: #f1f1f1;
        border-width: 2px;
        placeholder-color:#999;
    }
    .modifyTitle{
        font-weight: bold;
        width: 520px;
    }
    .modifyContentDivTwo{
        position: absolute;
        width: 750px;
        top: 0;
        bottom: 0;
        background-color: rgba(0,0,0,0.5);
        align-items: center;
        justify-content: center;
    }
    .modifyContentDiv{
        position: absolute;
        width: 750px;
        top: 0;
        bottom: 0;
        background-color: rgba(0,0,0,0.5);
        align-items: center;
        justify-content: center;
    }
    .modifyContentTwo{
        padding-top: 40px;
        padding-left: 40px;
        padding-right: 40px;
        width: 600px;
        background-color: #fff;
    }
    .modifyContent{
        padding-top: 40px;
        padding-left: 40px;
        padding-right: 40px;
        width: 600px;
        background-color: #fff;
    }
    .delBottom{
        flex-direction: row;
        align-items: center;
        margin-top: 50px;
    }
    .modifyBottom{
        flex-direction: row;
        align-items: center;
        margin-top: 30px;
        margin-bottom: 30px;
    }
    .delContent{
        padding-top: 40px;
        padding-left: 40px;
        padding-right: 40px;
    }
    .closeConfirm{
        margin-left: 60px;
        opacity: 1;
    }
    .closeConfirmTwo{
        opacity: 0.5;
    }
    .closeCancel{
        color:#999;
    }
    .closeDetails{
        margin-top: 30px;
    }
    .contentBottom{
        width: 600px;
        height: 120px;
        text-align: center;
        line-height: 120px;
    }
    .addHelpText{
        color: #999;
        margin-top: 5px;
    }
    .helpText{
        color: #999;
    }
    .contentTop{
        width: 600px;
        height: 120px;
        border-bottom-style: solid;
        border-bottom-width: 2px;
        border-bottom-color: #f1f1f1;
        justify-content: center;
        align-items: center;
    }
    .bottomSettlement{
        color: #fff;
        background-color: #53beb7;
        padding-left: 55px;
        padding-right: 55px;
        height: 100px;
        line-height: 100px;

    }
    .distributionFee{
        color: #fff;
    }
    .bottomPriceSmall{
        color: #fff;
        margin-left: 10px;
        font-weight: bold;
    }
    .bottomPriceBig{
        font-weight: bold;
        color: #fff;
    }
    .bottomPrice{
        flex-direction: row;
        align-items: center;
    }
    .bottomCost{
        padding-left: 20px;
        padding-right: 10px;
        height: 100px;
        justify-content: center;
        background-color: #666;
        flex: 1;
    }
    .bottom{
        flex-direction: row;
        align-items: center;
        background-color: #666;
    }
    .allCollageBottom{
        padding-top: 15px;
        padding-bottom: 20px;
        justify-content: space-between;
    }
    .allCollageBottomTwo{
        border-top-style: solid;
        border-top-width: 2px;
        border-top-color: #f1f1f1;
    }
    .allCollageInvitation{
        padding-top: 17px;
        padding-bottom: 17px;
        padding-left: 15px;
        padding-right: 15px;
        background-color: #53beb7;
        color: #fff;
        border-radius: 10px;
    }
    .allCollageTime{
        color: #999;
        margin-top: 20px;
    }
    .allCollageDifference{
        color: #999;
        margin-left: 15px;
    }
    .allCollageContent{
        margin-left: 35px;
    }
    .allCollageImage{
        width: 90px;
        height: 90px;
        border-radius: 45px;

    }
    .row{
        flex-direction: row;
        align-items: center;
    }
    .allCollageTop{
        padding-top: 25px;
        padding-bottom: 25px;
    }
    .allCollage{
        margin-top: 25px;
        padding-left: 20px;
        padding-right: 20px;
        background-color: #fff;
    }
    .foodNumber{
        width: 150px;
        margin-left: 15px;
        text-align: center ;
    }
    .totalPriceNumber{
        width: 150px;
        margin-left: 15px;
        text-align: right ;
    }
    .foodName{
        flex: 1;
        lines:1;
        text-overflow: ellipsis;
    }
    .listDiv{

        /*border-bottom-style: solid;*/
        /*border-bottom-color: #f1f1f1;*/
        /*border-bottom-width: 2px;*/
        flex-direction: row;
        justify-content: flex-start;
        padding-top: 10px;
        /*padding-bottom: 30px;*/
        padding-right: 20px;
    }
    .prompt{
        color: #999;
        margin-top: 10px;

    }
    .listBottom{
        margin-left: 100px;
        padding-top:15px;
        padding-bottom: 20px;
        border-top-width: 1px;
        border-top-style: solid;
        border-top-color: #dedede;
    }
    .listBottomDiv{
        flex-direction: column;
        margin-top: 5px;
    }
    .listBottomDiv_mes{
        flex-direction: row;
        align-items: center;
    }
    .close{
        padding-top: 5px;
        padding-bottom: 5px;
        width: 120px;
        border-style: solid;
        border-width: 1px;
        border-color: #999;
        color: #999;
        margin-left: 15px;
        text-align: center ;
        border-radius: 5px;
    }
    .addCommodity{
        padding-top: 5px;
        padding-bottom: 5px;
        width: 120px;
        text-align: center;
        border-style: solid;
        border-width: 1px;
        border-color: #53beb7;
        border-radius: 5px;
    }
    .editorIcon{
        width: 30px;
        height: 30px;
    }
    .editorIconDiv{
        margin-left: 10px;
        flex: 1;
    }
    .name{
        margin-left: 10px;
        font-weight: bold;
        max-width: 250px;
        lines:1;
        text-overflow: ellipsis;
    }
    .number{
        width: 40px;
        height:40px;
        text-align: center;
        line-height: 40px;
        border-radius: 25px;
        background-color: orangered;
        color: #fff;
    }
    .listCell{
        width: 750px;
        margin-top: 20px;
        margin-bottom: 20px;
    }
    .list{
        flex: 1;
        width: 750px;
        background-color: #f8f8f8;
        flex-direction: column;
    }
    .cell{
        flex: 1;
        width: 750px;
        background-color: #f8f8f8;
    }
    .collageInfo{
        padding-top: 20px;
        padding-left: 20px;
    }
    .collager_message{
        flex: 1
    }

    .listTop{
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        flex: 1;
    }
    .listTop_label{
        flex-direction: row;
        align-items: center;
    }
    .labelStyle{
        padding-top: 1px;
        padding-bottom: 1px;
        padding-left: 7px;
        padding-right: 7px;
        border-width: 1px;
        border-style: solid;
        border-color: #53beb7;
        margin-left: 5px;
        border-radius: 2px;
    }
    .listCell{
        padding-left: 20px;
        padding-right: 20px;
        background-color: #fff;
    }
    .barAddText{
        margin-left: 10px;
    }
    .barAddIcon{
        width: 40px;
        height: 40px;
    }
    .barAdd{
        background-color: #fff;
        padding-top: 20px;
        padding-bottom: 20px;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        margin-bottom: 20px;
        width: 620px;
        border-radius: 15px;
    }
    .barText{
        color: #fff;
        margin-top: 20px;
        margin-bottom: 20px;
    }
    .bar{
        padding-left: 20px;
        padding-right: 20px;
        background-color: #53beb7;
        align-items: center;
        position: sticky;
        top: 0;
        left: 0;
    }
    .wrapper {
        background-color: #53beb7;
    }
    .collager_photo{
        width: 80px;
        height: 80px;
        border-radius: 80px;
        margin-right: 10px;
    }
    .collager_button{
        flex-direction: row;
        align-content: center;
    }
    .share_lock{
        position: fixed;
        top:90px;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #f1f1f1;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    .lockBotton{
        width: 550px;
        text-align: center;
        padding-top: 25px;
        padding-bottom: 25px;
        background-color: #53beb7;
        margin-top: 20px;
        border-radius: 5px;
        box-shadow:2px 2px 5px 2px #a1a1a1;
    }
    .lockBotton:active{
        background-color: #53aba5;
    }

    /*下拉刷新*/
    .refresh {
        width: 750px;
        display: -ms-flex;
        display: -webkit-flex;
        display: flex;
        -ms-flex-align: center;
        -webkit-align-items: center;
        -webkit-box-align: center;
        align-items: center;
        background-color: #fff;

    }
    .indicator {
        margin-top: 16px;
        height: 100px;
        width: 100px;
        color: #53beb7;
        margin-bottom: 16px;

    }

</style>
