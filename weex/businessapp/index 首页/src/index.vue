
<template>
    <div @viewappear="viewappear" @viewdisappear="viewdisappear">
        <slider class="size" infinite="false"  :index="tabIndex" @change="changeSlider">

            <div class="block">

                <div class="tabbar">
                    <div class="tab active" :style="{ left: activeTab * 188 + 'px'}"></div>
                    <div class="tab activeName" :style="{ left: activeTab * 188 + 'px'}"></div>
                    <div v-for="(tab, i) in tabs" :key="i" class="tab" @click="toggle(i)">
                        <text class="title" :style="{fontSize:GLOBAL.biggestFS,color:'#fff'}">{{tab.title}}</text>
                        <text :style="{fontSize: '26px',color: activeTab==i? '#0fe3c5':'#fff',marginTop: '25px'}">{{tab.titleName}}</text>
                    </div>
                </div>

                <slider class="slider" infinite="false" :index="activeTab" @change="change">
                    <!--新订单 催单 退款单 团购单-->
                    <list class="wrapper" v-for="(i,indexs) in tabsList" :key="indexs">
                        <refresh class="refresh" @refresh="onrefresh(indexs)" :display="refreshing ? 'show' : 'hide'" v-if="indexs!==3">
                            <!--<text class="indicator-text">Refreshing ...</text>-->
                            <!--<loading-indicator class="indicator"></loading-indicator>-->
                            <image class="loadingImg" src="https://image.aftdc.com/appBimg/ic_loading_gif.gif"></image>
                        </refresh>
                        <!--v-if="!i.arr"-->
                        <cell class="section" :style="{flex: 1}" v-if="i.arr.length < 1&&indexs!=3" >
                            <div class="newDiv">
                                <image class="noOrderIcon" src="https://image.aftdc.com/appBimg/icon_no_order.png"></image>
                                <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor,marginTop:'30px'}">暂无订单</text>
                            </div>
                        </cell>
                        <cell class="section" v-if="i.arr.length>=1&&indexs!=3" v-for="(item,index) in i.arr">
                            <div class="box">
                                <div class="boxDiv">
                                    <text class="order-head" :style="{fontSize:GLOBAL.biggerFS}" v-if="item.orderType==0">外卖{{item.shareId?'（拼单）':''}}</text>
                                    <text class="order-head" :style="{fontSize:GLOBAL.biggerFS}" v-if="item.orderType==2">扫码点餐</text>
                                    <text class="order-head" :style="{fontSize:GLOBAL.biggerFS}" v-if="item.orderType==3">堂食</text>
                                    <text class="order-head" :style="{fontSize:GLOBAL.biggerFS}" v-if="item.orderType==4">团购</text>
                                    <text class="order-head" :style="{fontSize:GLOBAL.biggerFS}" v-if="item.orderType==5">自取单{{item.shareId?'（拼单）':''}}</text>
                                    <text class="order-head" :style="{fontSize:GLOBAL.biggerFS}">#{{item.orderNo}}</text>
                                </div>
                                <!--<div class="boxTime" v-if="item.orderType!==3">-->
                                <!--<text class="order-address" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">下单时间　{{item.createTime}}</text>-->
                                <!--<text class="order-address" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}" v-if="item.orderType !== 2">{{item.orderType==3?'到达时间':item.orderType==5?'自取时间':'请求送达'}}　{{item.requireTime}}</text>-->
                                <!--</div>-->
                                <div class="boxTime" >
                                    <text class="order-address" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">下单时间 {{item.createTime}}</text>
                                    <text class="order-address" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}" v-if="item.orderType !== 2">{{item.orderType==3?'到达时间':item.orderType==5?'自取时间':'请求送达'}} {{item.requireTime}}</text>
                                </div>

                                <div class="boxDetails">
                                    <div :style="{flex: 12}">
                                        <div v-if="item.orderType !== 2">
                                            <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor,maxWidth:'500px'}" >{{item.userAddress}}</text>
                                            <div class="fdRow">
                                                <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor,maxWidth:'190px'}" >{{item.userName}} {{item.userSex?item.userSex==2?'先生':item.userSex==1?'女士':'':''}}</text>
                                                <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}" >　{{item.userPhone}}　</text>
                                                <text :style="{fosntSize:GLOBAL.bigFS,color:GLOBAL.dColor}" v-if="item.orderType==0">{{(item.distance/1000).toFixed(1)}}km</text>
                                            </div>
                                        </div>
                                        <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor,maxWidth:'500px'}" v-else>桌位号　{{item.deskNum}}</text>
                                    </div>
                                    <div class="boxDetailsDiv" :class="[item.orderType==0?'':'jcFe']">
                                        <image class="boxDetailsIocn" src="https://image.aftdc.com/appBimg/icon_map.png" @click="openMap(item.lat,item.lng)"  v-if="item.orderType==0"></image>
                                        <image class="boxDetailsIocn" src="https://image.aftdc.com/appBimg/icon_phone.png"  @click="phone(item.userPhone)"></image>
                                    </div>
                                </div>

                                <div class="goods">
                                    <div :style="{flexDirection:'row'}">
                                        <image class="goodsIcon" src="https://image.aftdc.com/appBimg/icon_goods_list.png"></image>
                                        <text :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor,marginLeft:'5px'}">商品</text>
                                    </div>
                                    <div v-if="!item.shareId">
                                        <div class="goodsDiv" v-for="(v,k) in item.goodlist" >
                                            <div style="margin-left:25px;flex:5;flex-direction: row">
                                                <text :style="{fontSize:GLOBAL.bigFS,color:'#999'}">· </text>
                                                <div style="flex: 1">
                                                    <text :style="{fontSize:GLOBAL.bigFS,color:'#999',lines:'1',textOverflow:'ellipsis'}">{{v.goodsName}}</text>
                                                    <text :style="{fontSize:GLOBAL.bigFS,color:'#999',lines:'1',textOverflow:'ellipsis'}" v-if="v.goodsAttrName && v.goodsAttrName!==''">({{v.goodsAttrName}})</text>
                                                </div>
                                            </div>
                                            <text :style="{fontSize:GLOBAL.bigFS,color:'#999',flex:'1',textAlign:'center'}">x{{v.goodsNums}}</text>
                                            <text :style="{fontSize:GLOBAL.bigFS,color:'#999',flex:'2',textAlign:'right'}" v-if="!v.gift">￥{{(Number(v.goodsNums)*Number(v.goodsPrice)).toFixed(2)}}</text>
                                            <text :style="{flex:'2',textAlign:'right'}" v-else></text>
                                        </div>
                                    </div>
                                    <!--拼单-->
                                    <div v-else>
                                        <div v-for="(v,k) in item.goodlist" >
                                            <div style="margin-left:20px;flex-direction: row" v-if="!v.gift">
                                                <text :style="{fontSize:GLOBAL.bigFS,color:'#53beb7'}">· </text>
                                                <div style="flex: 1">
                                                    <text :style="{fontSize:GLOBAL.bigFS,color:'#53beb7'}">{{k+1}}号口袋</text>
                                                </div>
                                            </div>
                                            <div class="goodsDiv" v-for="(z,m) in v.goodsInfo" >
                                                <div style="margin-left:25px;flex:5;flex-direction: row">
                                                    <text :style="{fontSize:GLOBAL.bigFS,color:'#999'}">· </text>
                                                    <div style="flex: 1">
                                                        <text :style="{fontSize:GLOBAL.bigFS,color:'#999',lines:'1',textOverflow:'ellipsis'}">{{z.goodsName}}</text>
                                                        <text :style="{fontSize:GLOBAL.bigFS,color:'#999',lines:'1',textOverflow:'ellipsis'}" v-if="z.goodsAttrName && z.goodsAttrName!==''">({{z.goodsAttrName}})</text>
                                                    </div>
                                                </div>
                                                <text :style="{fontSize:GLOBAL.bigFS,color:'#999',flex:'1',textAlign:'center'}">x{{z.goodsNums}}</text>
                                                <text :style="{fontSize:GLOBAL.bigFS,color:'#999',flex:'2',textAlign:'right'}" v-if="!z.gift">￥{{(Number(z.goodsNums)*Number(z.goodsPrice)).toFixed(2)}}</text>
                                                <text :style="{flex:'2',textAlign:'right'}" v-else></text>
                                            </div>
                                            <div class="goodsDiv" v-if="v.gift" >
                                                <div style="margin-left:25px;flex:5;flex-direction: row">
                                                    <text :style="{fontSize:GLOBAL.bigFS,color:'#999'}">· </text>
                                                    <div style="flex: 1">
                                                        <text :style="{fontSize:GLOBAL.bigFS,color:'#999',lines:'1',textOverflow:'ellipsis'}">{{v.goodsName}}</text>
                                                        <text :style="{fontSize:GLOBAL.bigFS,color:'#999',lines:'1',textOverflow:'ellipsis'}" v-if="v.goodsAttrName && v.goodsAttrName!==''">({{v.goodsAttrName}})</text>
                                                    </div>
                                                </div>
                                                <text :style="{fontSize:GLOBAL.bigFS,color:'#999',flex:'1',textAlign:'center'}">x{{v.goodsNums}}</text>
                                                <text :style="{fontSize:GLOBAL.bigFS,color:'#999',flex:'2',textAlign:'right'}" v-if="!v.gift">￥{{(Number(v.goodsNums)*Number(v.goodsPrice)).toFixed(2)}}</text>
                                                <text :style="{flex:'2',textAlign:'right'}" v-else></text>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="goodsDiv" v-if="item.orderType!==3">
                                        <text :style="{fontSize:GLOBAL.bigFS,color:'#999',marginLeft:'40px',flex:'4'}">餐盒费</text>
                                        <text :style="{fontSize:GLOBAL.bigFS,color:'#999',flex:'1',textAlign:'right'}">￥{{item.boxFee}}</text>
                                    </div>
                                    <div class="goodsDiv" v-if="item.orderType!==5&&item.orderType!==3">
                                        <text :style="{fontSize:GLOBAL.bigFS,color:'#999',marginLeft:'40px'}">配送费</text>
                                        <text :style="{fontSize:GLOBAL.bigFS,color:'#999'}">￥{{item.deliverMoney}}</text>
                                    </div>
                                </div>

                                <div class="count">
                                    <text class="order-normal" :style="{fontSize:GLOBAL.bigFS,color:'#999'}">活动支出　-￥{{(item.totalMoney-item.needPay).toFixed(2)}}</text>
                                    <text class="order-normal" :style="{fontSize:GLOBAL.bigFS,color:'#999'}" v-if="item.payType==1">余额支付　￥{{item.needPay}}</text>
                                    <text class="order-normal" :style="{fontSize:GLOBAL.bigFS,color:'#999'}" v-if="item.payType==2">微信支付　￥{{item.needPay}}</text>
                                    <text class="order-normal" :style="{fontSize:GLOBAL.bigFS,color:'#999'}" v-if="item.payType==3">支付宝支付　￥{{item.needPay}}</text>
                                </div>

                                <div class="remarks jcSb" >
                                    <text class="remarksText" :style="{fontSize:GLOBAL.bigFS,color:'#999'}"  v-if="item.orderType!==3">餐具数量　{{item.pickNumb===-1?'1人':item.pickNumb===0?'不需要餐具':item.pickNumb+'人'}}</text>
                                    <text class="remarksText" :style="{fontSize:GLOBAL.bigFS,color:'#999'}" v-else>用餐人数　{{item.deskArr.numb?item.deskArr.numb+'人':'未填写'}}</text>
                                    <div class="fdRow" >
                                        <text class="remarksText" :style="{fontSize:GLOBAL.bigFS,color:'#999'}">发票信息　</text>
                                        <text class="remarksText" :style="{fontSize:GLOBAL.bigFS,color:'#5d9cd9'}" @click="invoiceOpenMask(0,indexs,index)" v-if="item.billInfo">需开发票 ></text>
                                        <text class="remarksText" :style="{fontSize:GLOBAL.bigFS,color:'#999'}" v-else>无需开票</text>
                                    </div>
                                </div>

                                <div class="remarks" v-if="item.orderRemarks!==''">
                                    <text class="remarksText" :style="{fontSize:GLOBAL.bigFS,color:'#999'}">订单备注　</text>
                                    <div :style="{flex:1}" >
                                        <text class="remarksText"  :style="{fontSize:GLOBAL.bigFS,color:'#999',width:'474px'}">{{item.orderRemarks}}</text>
                                    </div>
                                </div>

                                <div class="remarks jcSb" v-if="item.orderType==3">
                                    <text class="remarksText" :style="{fontSize:GLOBAL.bigFS,color:'#999'}">备餐时间　{{item.deskArr.mealTime==1?'到店前':'到店后'}}</text>
                                    <text class="remarksText" :style="{fontSize:GLOBAL.bigFS,color:'#999'}" v-if="item.deskArr.baojian!==0">需要包厢，{{item.deskArr.baojian==1?'不接受大厅':'可接受大厅'}}</text>
                                </div>
                                <div class="remarks column" v-if="indexs==2">
                                    <text class="remarksText" :style="{fontSize:GLOBAL.bigFS,color:'#999'}">退款方式　{{item.refundType===1?'仅退款':'退货并退款'}}</text>
                                    <div class="fdRow">
                                        <text class="remarksText" :style="{fontSize:GLOBAL.bigFS,color:'#999'}">退款原因　</text>
                                        <div :style="{flex:1}">
                                            <text class="remarksText"  :style="{fontSize:GLOBAL.bigFS,color:'#999'}">{{item.refundRemark}}</text>
                                        </div>
                                    </div>
                                </div>

                                <div class="orderBut" v-if="indexs==0">
                                    <text class="cancelBtn" :style="{fontSize:GLOBAL.defaultFS}" v-if="item.deStatus==0" @click="reasonWxcMaskSetShow(0,index)">取消订单</text>
                                    <text class="btn" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}" v-if="item.deStatus==0" @click="apply(index)">{{item.distributionNow?'备餐':'接受预定'}}</text>
                                </div>
                                <div class="orderBut" v-if="indexs==1">
                                    <text class="btn" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}" v-if="item.reminder==1" @click="cuidan(index)">处理催单</text>
                                    <text class="btn" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}" v-if="item.reminder==2">已处理</text>
                                </div>
                                <div class="orderBut" v-if="indexs==2">
                                    <text class="cancelBtn" :style="{fontSize:GLOBAL.defaultFS}" @click="reasonWxcMaskSetShow(item.orderType==3?3:item.orderType==5?2:1,index)">不同意</text>
                                    <text class="btn" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}" @click="aRefund(index)">同意</text>
                                </div>
                            </div>
                        </cell>

                        <cell class="section" v-if="indexs==3">
                            <div v-if="groups">
                                <div class="box" v-if="groups.orderStatus==0">
                                    <div class="tg">
                                        <text class="quanTitle" :style="{fontSize:GLOBAL.biggestFS,color:'#f9aa10'}">{{groups.type==1?'团购券':'代金券'}}</text>
                                        <div class="tgTitle">
                                            <text :style="{fontSize:GLOBAL.bigFS,color:'#999'}">· {{groups.type==1?'团购券':'代金券'}}名称</text>
                                            <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{groups.groupName}}</text>
                                        </div>
                                        <div class="tgTitle">
                                            <text :style="{fontSize:GLOBAL.bigFS,color:'#999'}">· 数量(券)</text>
                                            <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">× {{groups.num}}</text>
                                        </div>
                                        <div class="tgTitle">
                                            <text :style="{fontSize:GLOBAL.bigFS,color:'#999'}">· 金额</text>
                                            <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">￥{{groups.realTotalMoney}}</text>
                                        </div>
                                        <div class="line"></div>
                                        <div class="tgContent"  v-for="(i,index) in groups.goodslist">
                                            <div class="tgList">
                                                <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">· {{i.goodsName}}</text>
                                                <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}" v-if="i.numAndSpe">({{i.numAndSpe}})</text>
                                                <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}" v-else>× {{i.goodsNum}}</text>
                                            </div>
                                        </div>
                                        <div class="tgNum">
                                            <div class="tgNumDiv">
                                                <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">单号</text>
                                                <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{groups.orderNo}}</text>
                                            </div>
                                            <div class="tgNumDiv">
                                                <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">下单时间</text>
                                                <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{groups.createTime}}</text>
                                            </div>
                                        </div>

                                        <div class="tgbottom">
                                            <text class="scanButtom" @click="haveScan()" :style="{fontSize:GLOBAL.bigFS}">继续扫码</text>
                                            <text class="tgComfirButtom"   @click="comfirGoods" :style="{fontSize:GLOBAL.bigFS}">核销</text>
                                        </div>

                                    </div>
                                </div>

                                <div class="box" v-else>
                                    <div class="boxMoreDiv">
                                        <image class="boxMoreIcon" src="https://image.aftdc.com/appBimg/checkboxyes.png"></image>
                                        <text :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">已使用</text>
                                        <text :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor,marginTop:'20px',marginBottom:'20px'}">核销时间</text>
                                        <text :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">{{groups.time}}</text>
                                        <div class="tgbottom" >
                                            <text class="tgbuttom" @click="haveScan()" :style="{fontSize:GLOBAL.bigFS}">继续扫码</text>
                                        </div>
                                    </div>
                                </div>

                                <!--<div class="tgbottom" v-if="groups">-->
                                <!--<text class="tgbuttomContinue" @click="haveScan()" :style="{fontSize:GLOBAL.bigFS}">继续扫码</text>-->
                                <!--</div>-->
                            </div>
                        </cell>
                        <loading class="loading" @loading="loadmore(indexs)" :display="loadinging ? 'show' : 'hide'" v-if="indexs!==3">
                            <text class="indicator-text">加载中...</text>
                        </loading>

                    </list>

                </slider>

            </div>
            <!--新订单 页面-->
            <div class="block">

                <div class="ordertabbar">
                    <div class="ordertab orderactive" :style="{ left: orderactiveTab * 250 + 'px'}"></div>
                    <div v-for="(tab, i) in ordertabs" :key="i" class="ordertab" @click="orderactiveTab = i">
                        <text :style="{fontSize:GLOBAL.bigFS,color:'#fff'}">{{tab.title}}</text>
                    </div>
                </div>

                <slider class="slider" infinite="false"  :index="orderactiveTab" @change="orderChange">

                    <!--进行中 已完成 已退款-->
                    <list class="wrapper" v-for="(i,indexs) in tabLists" :key="indexs">
                        <cell class="section" :style="{flex: 1}" v-if="i.arr.length < 1">
                            <div class="newDiv">
                                <image class="noOrderIcon" src="https://image.aftdc.com/appBimg/icon_no_order.png"></image>
                                <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor,marginTop:'30px'}">暂无订单</text>
                            </div>
                        </cell>
                        <cell class="section"  v-for="(item,index) in i.arr">
                            <div class="box">
                                <div class="boxDiv">
                                    <text class="order-head wm" :style="{fontSize:GLOBAL.biggerFS}" v-if="item.orderType==0">外卖{{item.shareId?'（拼单）':''}}</text>
                                    <text class="order-head wm" :style="{fontSize:GLOBAL.biggerFS}" v-if="item.orderType==2">扫码点餐</text>
                                    <text class="order-head wm" :style="{fontSize:GLOBAL.biggerFS}" v-if="item.orderType==3">堂食订单</text>
                                    <text class="order-head wm" :style="{fontSize:GLOBAL.biggerFS}" v-if="item.orderType==4">团购单</text>
                                    <text class="order-head wm" :style="{fontSize:GLOBAL.biggerFS}" v-if="item.orderType==5">自取单{{item.shareId?'（拼单）':''}}</text>
                                    <text class="order-head wm" :style="{fontSize:GLOBAL.biggerFS}" v-if="item.groupType==1">团购券</text>
                                    <text class="order-head wm" :style="{fontSize:GLOBAL.biggerFS}" v-if="item.groupType==2">代金券</text>
                                    <text class="order-head" :style="{fontSize:GLOBAL.biggerFS}">#{{item.orderNo}}</text>
                                </div>

                                <!--<div class="boxTime" v-if="item.orderType!==3">-->
                                <!--<text class="order-address" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">下单时间　{{item.createTime}}</text>-->
                                <!--<text class="order-address" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}" v-if="item.orderType !== 2">{{item.orderType==3?'到达时间':item.orderType==5?'自取时间':'请求送达'}}　{{item.requireTime}}</text>-->
                                <!--</div>-->
                                <div class="boxTime" >
                                    <text class="order-address" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">下单时间 {{item.createTime}}</text>
                                    <text class="order-address" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}" v-if="item.orderType !== 2">{{item.orderType==3?'到达时间':item.orderType==5?'自取时间':item.groupType?'核销时间':'请求送达'}} {{item.requireTime}}</text>
                                </div>

                                <div class="boxDetails">
                                    <div :style="{flex: 12}">
                                        <div v-if="item.orderType !== 2">
                                            <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor,maxWidth:'500px'}" >{{item.userAddress}}</text>
                                            <div class="fdRow">
                                                <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor,maxWidth:'190px'}" >{{item.userName}}</text>
                                                <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}" >　{{item.userPhone}}　</text>
                                                <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}" v-if="item.orderType==0">{{(item.distance/1000).toFixed(1)}}km</text>
                                            </div>
                                        </div>
                                        <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor,maxWidth:'500px'}" v-else>桌位号　{{item.deskNum}}</text>
                                    </div>
                                    <div class="boxDetailsDiv" :class="[item.orderType==0?'':'jcFe']">
                                        <image class="boxDetailsIocn" src="https://image.aftdc.com/appBimg/icon_map.png" @click="openMap(item.lat,item.lng)"  v-if="item.orderType==0"></image>
                                        <image class="boxDetailsIocn" src="https://image.aftdc.com/appBimg/icon_phone.png"  @click="phone(item.userPhone)"></image>
                                    </div>
                                </div>

                                <div class="goods">
                                    <div :style="{flexDirection:'row'}">
                                        <image class="goodsIcon" src="https://image.aftdc.com/appBimg/icon_goods_list.png"></image>
                                        <text :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor,marginLeft:'5px'}">商品</text>
                                    </div>
                                    <div v-if="!item.shareId">
                                        <div class="goodsDiv" v-for="(v,k) in item.goodlist" >
                                            <div style="margin-left:25px;flex:5;flex-direction: row">
                                                <text :style="{fontSize:GLOBAL.bigFS,color:'#999'}">· </text>
                                                <div style="flex: 1">
                                                    <text :style="{fontSize:GLOBAL.bigFS,color:'#999',lines:'1',textOverflow:'ellipsis'}">{{v.goodsName}}</text>
                                                    <text :style="{fontSize:GLOBAL.bigFS,color:'#999',lines:'1',textOverflow:'ellipsis'}" v-if="v.goodsAttrName && v.goodsAttrName!==''">({{v.goodsAttrName}})</text>
                                                </div>
                                            </div>
                                            <text :style="{fontSize:GLOBAL.bigFS,color:'#999',flex:'1',textAlign:'center'}">x{{v.goodsNums}}</text>
                                            <text :style="{fontSize:GLOBAL.bigFS,color:'#999',flex:'2',textAlign:'right'}" v-if="!v.gift">￥{{(Number(v.goodsNums)*Number(v.goodsPrice)).toFixed(2)}}</text>
                                            <text :style="{flex:'2',textAlign:'right'}" v-else></text>
                                        </div>
                                    </div>
                                    <!--拼单-->
                                    <div v-else>
                                        <div v-for="(v,k) in item.goodlist" >
                                            <div style="margin-left:20px;flex-direction: row" v-if="!v.gift">
                                                <text :style="{fontSize:GLOBAL.bigFS,color:'#53beb7'}">· </text>
                                                <div style="flex: 1">
                                                    <text :style="{fontSize:GLOBAL.bigFS,color:'#53beb7'}">{{k+1}}号口袋</text>
                                                </div>
                                            </div>
                                            <div class="goodsDiv" v-for="(z,m) in v.goodsInfo" >
                                                <div style="margin-left:25px;flex:5;flex-direction: row">
                                                    <text :style="{fontSize:GLOBAL.bigFS,color:'#999'}">· </text>
                                                    <div style="flex: 1">
                                                        <text :style="{fontSize:GLOBAL.bigFS,color:'#999',lines:'1',textOverflow:'ellipsis'}">{{z.goodsName}}</text>
                                                        <text :style="{fontSize:GLOBAL.bigFS,color:'#999',lines:'1',textOverflow:'ellipsis'}" v-if="z.goodsAttrName && z.goodsAttrName!==''">({{z.goodsAttrName}})</text>
                                                    </div>
                                                </div>
                                                <text :style="{fontSize:GLOBAL.bigFS,color:'#999',flex:'1',textAlign:'center'}">x{{z.goodsNums}}</text>
                                                <text :style="{fontSize:GLOBAL.bigFS,color:'#999',flex:'2',textAlign:'right'}" v-if="!z.gift">￥{{(Number(z.goodsNums)*Number(z.goodsPrice)).toFixed(2)}}</text>
                                                <text :style="{flex:'2',textAlign:'right'}" v-else></text>
                                            </div>
                                            <div class="goodsDiv" v-if="v.gift" >
                                                <div style="margin-left:25px;flex:5;flex-direction: row">
                                                    <text :style="{fontSize:GLOBAL.bigFS,color:'#999'}">· </text>
                                                    <div style="flex: 1">
                                                        <text :style="{fontSize:GLOBAL.bigFS,color:'#999',lines:'1',textOverflow:'ellipsis'}">{{v.goodsName}}</text>
                                                        <text :style="{fontSize:GLOBAL.bigFS,color:'#999',lines:'1',textOverflow:'ellipsis'}" v-if="v.goodsAttrName && v.goodsAttrName!==''">({{v.goodsAttrName}})</text>
                                                    </div>
                                                </div>
                                                <text :style="{fontSize:GLOBAL.bigFS,color:'#999',flex:'1',textAlign:'center'}">x{{v.goodsNums}}</text>
                                                <text :style="{fontSize:GLOBAL.bigFS,color:'#999',flex:'2',textAlign:'right'}" v-if="!v.gift">￥{{(Number(v.goodsNums)*Number(v.goodsPrice)).toFixed(2)}}</text>
                                                <text :style="{flex:'2',textAlign:'right'}" v-else></text>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="goodsDiv" v-if="item.orderType!==3&&!item.groupType">
                                        <text :style="{fontSize:GLOBAL.bigFS,color:'#999',marginLeft:'40px',flex:'4'}">餐盒费</text>
                                        <text :style="{fontSize:GLOBAL.bigFS,color:'#999',flex:'1',textAlign:'right'}">￥{{item.boxFee}}</text>
                                    </div>
                                    <div class="goodsDiv" v-if="item.orderType!==5&&item.orderType!==3&&!item.groupType">
                                        <text :style="{fontSize:GLOBAL.bigFS,color:'#999',marginLeft:'40px'}">配送费</text>
                                        <text :style="{fontSize:GLOBAL.bigFS,color:'#999'}">￥{{item.deliverMoney}}</text>
                                    </div>
                                </div>

                                <div class="count">
                                    <text class="order-normal" :style="{fontSize:GLOBAL.bigFS,color:'#999'}">活动支出　-￥{{(item.totalMoney-item.needPay).toFixed(2)}}</text>
                                    <text class="order-normal" :style="{fontSize:GLOBAL.bigFS,color:'#999'}" v-if="item.payType==1">余额支付　￥{{item.needPay}}</text>
                                    <text class="order-normal" :style="{fontSize:GLOBAL.bigFS,color:'#999'}" v-if="item.payType==2">微信支付　￥{{item.needPay}}</text>
                                    <text class="order-normal" :style="{fontSize:GLOBAL.bigFS,color:'#999'}" v-if="item.payType==3">支付宝支付　￥{{item.needPay}}</text>
                                </div>


                                <div class="remarks jcSb" v-if="!item.groupType">
                                    <text class="remarksText" :style="{fontSize:GLOBAL.bigFS,color:'#999'}"  v-if="item.orderType!==3">餐具数量　{{item.pickNumb===-1?'1人':item.pickNumb===0?'不需要餐具':item.pickNumb+'人'}}</text>
                                    <text class="remarksText" :style="{fontSize:GLOBAL.bigFS,color:'#999'}" v-else>用餐人数　{{item.deskArr.numb?item.deskArr.numb+'人':'未填写'}}</text>
                                    <div class="fdRow" >
                                        <text class="remarksText" :style="{fontSize:GLOBAL.bigFS,color:'#999'}">发票信息　</text>
                                        <text class="remarksText" :style="{fontSize:GLOBAL.bigFS,color:'#5d9cd9'}" @click="invoiceOpenMask(1,indexs,index)" v-if="item.billInfo">需开发票 ></text>
                                        <text class="remarksText" :style="{fontSize:GLOBAL.bigFS,color:'#999'}" v-else>无需开票</text>
                                    </div>
                                </div>
                                <div class="remarks jcSb" v-if="item.orderType==3">
                                    <text class="remarksText" :style="{fontSize:GLOBAL.bigFS,color:'#999'}">备餐时间　{{item.deskArr.mealTime==1?'到店前':'到店后'}}</text>
                                    <text class="remarksText" :style="{fontSize:GLOBAL.bigFS,color:'#999'}" v-if="item.deskArr.baojian!==0">需要包厢，{{item.deskArr.baojian==1?'不接受大厅':'可接受大厅'}}</text>
                                </div>
                                <div class="remarks" v-if="item.orderRemarks && item.orderRemarks!==''">
                                    <text class="remarksText" :style="{fontSize:GLOBAL.bigFS,color:'#999'}">订单备注　</text>
                                    <div :style="{flex:'1'}" >
                                        <text class="remarksText" :style="{fontSize:GLOBAL.bigFS,color:'#999',width:'474px'}">{{item.orderRemarks}}</text>
                                    </div>
                                </div>

                                <div class="remarks" v-if="indexs===2">
                                    <text class="remarksText" :style="{fontSize:GLOBAL.bigFS,color:'#999'}">取消原因　</text>
                                    <text class="remarksText" :style="{fontSize:GLOBAL.bigFS,color:'#999',flex:1}">{{item.refundRemark}}</text>
                                </div>

                                <div class="orderBut underWay" v-if="indexs===0">
                                    <text class="btn" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor,width:'300px'}" @click="completeTake(index)" v-if="item.orderType==0&&item.orderStatus==1">开始配送</text>
                                    <text class="btn" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor,width:'300px'}" @click="complete(index,item.orderType)" v-else>{{item.orderType===0?'已送达':item.orderType===3?'已用餐':'已自取'}}</text>
                                </div>

                            </div>
                        </cell>
                        <loading class="loading" @loading="loadOrder(indexs)" :display="loadinging ? 'show' : 'hide'">
                            <text class="indicator-text">加载中...</text>
                        </loading>
                    </list>

                </slider>
            </div>
            <!--消息中心之类-->
            <div class="block">
                <div class="top">
                    <div class="top_content">
                        <div class="row_num">
                            <text class=" topNum" >{{message.toDayOrderNum}}</text>
                            <text  :style="{fontSize:GLOBAL.defaultFS,color:'#fff'}">单</text>
                        </div>
                        <div class="row">
                            <text class=" numMain" :style="{fontSize:GLOBAL.defaultFS,color:'#fff'}">今日有效订单</text>
                        </div>
                    </div>
                    <div class="top_content">
                        <div class="row_num">
                            <text class="  topNum" >{{message.income}}</text>
                            <text  :style="{fontSize:GLOBAL.defaultFS,color:'#fff'}">元</text>
                        </div>
                        <div class="row">
                            <text  class=" numMain" :style="{fontSize:GLOBAL.defaultFS,color:'#fff'}">今日订单收入</text>
                        </div>
                    </div>
                </div>
                <!--<div class="messageCenter" @click="goToMessageCenter">-->
                <!--<text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">消息中心</text>-->

                <!--<div style="flex-direction: row;align-items: center;">-->
                <!--<text class="noReadNum" :style="{fontSize:GLOBAL.smallFS,color:'#fff'}" v-if="message.count>0">{{message.count}}</text>-->
                <!--<image class="img_default arrow_right"-->
                <!--src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>-->
                <!--</div>-->
                <!--</div>-->
                <div class="operationCard" v-for="(item,index) in stortabs">
                    <div class="caedTitle"><text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.title}}</text></div>
                    <div class="cardContent">
                        <div class="contentClassify" v-for="(i,j) in item.case"  @click="openUrl(i.url)">
                            <div class="justify_content">
                                <image class="img_default cardImg" :src="'https://image.aftdc.com/appBimg/'+i.caseImg"></image>
                            </div>
                            <div class="justify_content">
                                <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{i.caseName}}</text>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="block">
                <div class="mytitle">

                    <image class="mytitleIcon" v-if="shopInfo.shopImg" :src="'https://image.aftdc.com/' + shopInfo.shopImg"></image>
                    <div :style="{flexDirection:'column',marginTop:'10px'}">
                        <div class="mytitleShopName">
                            <text :style="{color:'#fff',width:'380px',fontSize:GLOBAL.biggerFS}">{{shopInfo.shopName}}</text>
                        </div>
                        <div class="mytitleDiv" @click="goToShopShow">
                            <text :style="{fontSize:GLOBAL.defaultFS,color:'#fff'}">点击预览门店&nbsp;</text>
                            <image class="mytitleImage" src="https://image.aftdc.com/appBimg/icon_arrow_white.png"></image>
                        </div>
                    </div>

                    <image class="goToIcon" src="https://image.aftdc.com/appBimg/ic_qr_code.png" @click="goToQr"></image>
                </div>
                <div class="gotoDiv" @click="goToBusStatus">
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">营业状态</text>
                    <div :style="{flexDirection:'row',alignItems:'center'}">
                        <text :style="{fontSize:GLOBAL.defaultFS,color:'#38c6b1',paddingRight:'15px'}">{{shopInfo.shopAtive === 1 ? '营业中 ' : shopInfo.shopAtive === 0 ? '停止营业 ' : '休息中 '}}</text>
                        <image src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png" :style="{width:'25px',height:'25px'}"></image>
                    </div>
                </div>
                <div :style="{height:'20px',backgroundColor:'#eff3f6'}"></div>
                <div :style="{flexDirection:'row',backgroundColor:'#fff'}">
                    <div class="set" @click="goToStore">
                        <image class="PrintIcon" src="https://image.aftdc.com/appBimg/ic_setting.png"></image>
                        <text class="PrintText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">门店设置</text>
                    </div>
                    <div class="set" @click="goToPrinting">
                        <image class="PrintIcon" src="https://image.aftdc.com/appBimg/ic_print_machine.png"></image>
                        <text class="PrintText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">打印设置</text>
                    </div>
                    <div class="set" @click="goToVolume">
                        <image class="PrintIcon" src="https://image.aftdc.com/appBimg/ic_volume.png"></image>
                        <text class="PrintText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">铃声</text>
                    </div>
                    <div class="set" @click="goToMessageCenter">
                        <image class="PrintIcon" src="https://image.aftdc.com/images/xzkf.png"></image>
                        <text class="PrintText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">消息通知</text>
                        <text class="notice" v-if="unread_information > 0">{{unread_information > 99 ? '99+' : unread_information}}</text>
                    </div>
                </div>

                <div  :style="{height:'20px',backgroundColor:'#eff3f6'}"></div>

                <div class="public"  @click="phone(shopInfo.salesman)">
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">联系业务经理</text>
                    <div :style="{flexDirection:'row',alignItems:'center'}">
                        <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor,marginRight:'15px'}">{{shopInfo.salesman}}</text>
                        <image src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png" :style="{width:'25px',height:'25px'}"></image>
                    </div>
                </div>

                <div class="public" :style="{alignItems:'center'}" @click="goToHelp">
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">商家服务中心</text>
                    <image class="publicIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                </div>
                <div class="public" :style="{alignItems:'center'}" @click="goToFeedBack">
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">产品意见反馈</text>
                    <image class="publicIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                </div>
                <div class="public" @click="goToThisUser" :style="{alignItems:'center'}">
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">当前账号</text>
                    <image class="publicIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                </div>

                <div class="logout"  @click="showConfirm">
                    <text :style="{fontSize:GLOBAL.bigFS,color:'#fff'}">退出登录</text>
                </div>

            </div>

        </slider>

        <div class="Tab">
            <div class="Tablist" v-for="(tab, i) in tabList" :key="i" @click="chooseTab(i)">
                <image class="TabImg" :src="tabIndex == i?tab.chooseTabImg:tab.tabImg"></image>
                <text :style="{fontSize:GLOBAL.defaultFS,color:tabIndex == i?GLOBAL.tColor:GLOBAL.dColor}" :class="['TabName' ,tabIndex == i?'chooseTab':'']">{{tab.tabName}}</text>
                <text class="noticeTwo" v-if="unread_information > 0 && tab.tabName === '我的'"></text>
            </div>
        </div>
        <!--版本更新-->
        <wxc-mask height="1000"
                  width="560"
                  border-radius="15"
                  duration="200"
                  mask-bg-color="#FFFFFF"
                  :has-animation="true"
                  :has-overlay="true"
                  :show-close="false"
                  :overlay-can-close="false"
                  :show="show"
                  @wxcMaskSetHidden="wxcMaskSetHidden">
            <div class="update">
                <text class="updateTitle" :style="{fontSize:GLOBAL.biggestFS,color:GLOBAL.tColor}">发现新版本{{appUp.version}}</text>
                <text class="updateContent" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">更新内容:</text>
                <div :style="{flex: 1}">
                    <scroller class="updateScroller">
                        <text class="thisUpdate" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">本次更新</text>
                        <text class="thisUpdate" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}" v-for="item in appUp.details">- {{item}}</text>
                        <text class="thisUpdate" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor,marginTop:'60px'}">更新时间</text>
                        <text class="thisUpdate" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">- {{appUp.timestamp}}</text>
                    </scroller>
                </div>
                <div class="ignoreDiv aiCenter" @click="ignoreClick">
                    <image class="ignoreIcon" :src="ignore?'https://image.aftdc.com/appBimg/ic_check_box_checked.png':'https://image.aftdc.com/appBimg/ic_check_box_normal.png'"></image>
                    <text class="ignoreText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">忽略该版本</text>
                </div>
                <div class="updateBtn aiCenter">
                    <text class="updateBtnLeft" :style="{fontSize:GLOBAL.bigFS}" @click="noUpdate">暂不更新</text>
                    <text class="updateBtnRight" :style="{fontSize:GLOBAL.bigFS}">立即更新</text>
                </div>
            </div>
        </wxc-mask>

        <!--查看发票-->
        <wxc-mask height="400"
                  width="600"
                  border-radius="4"
                  duration="150"
                  mask-bg-color="#FFFFFF"
                  :has-animation="true"
                  :has-overlay="true"
                  :show-close="false"
                  :show="invoiceShow"
                  @wxcMaskSetHidden="invoiceWxcMaskSetHidden">
            <div class="content">
                <text class="invoiceTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{invoiceInfo.type}}</text>
                <div class="fdRow mt6">
                    <text class="invoiceText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">抬头名称：</text>
                    <text class="invoiceText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor,flex:1}">{{invoiceInfo.trueName}}</text>
                </div>
                <div class="fdRow mt6" v-if="invoiceInfo.dutyNum !== ''">
                    <text class="invoiceText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">税       号：</text>
                    <text class="invoiceText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{invoiceInfo.dutyNum}}</text>
                </div>
                <div class="fdRow mt6">
                    <text class="invoiceText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">电话号码：</text>
                    <text class="invoiceText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{invoiceInfo.phone}}</text>
                    <text class="invoiceText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{invoiceInfo.comTel}}</text>
                </div>
                <div class="fdRow mt6">
                    <text class="invoiceText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">电子邮件：</text>
                    <text class="invoiceText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{invoiceInfo.email}}</text>
                </div>
            </div>
        </wxc-mask>

        <!--取消订单原因-->
        <wxc-mask height="480"
                  width="600"
                  border-radius="4"
                  duration="150"
                  mask-bg-color="#FFFFFF"
                  :has-animation="true"
                  :has-overlay="true"
                  :show-close="false"
                  :show="cancelOrderShow"
                  :overlay-cfg="overlayCfg"
                  @wxcMaskSetHidden="reasonWxcMaskSetHidden">
            <div class="wrap" @click="">
                <div class="checked">
                    <text :style="{fontSize:'30px',color:GLOBAL.dColor}">原因：</text>
                    <div class="checkedAll fdRow">
                        <div class="fdRow checkedItem" v-for="(item,index) in reason" @click="checkedReason(index)">
                            <div class="checkedIcon">
                                <div class="checkedInside" :class="[reasonIndex===index?'checkedActive':'']"></div>
                            </div>
                            <text :style="{fontSize:'30px',color:GLOBAL.dColor}">{{ item }}</text>
                        </div>
                    </div>
                </div>
                <textarea class="textarea" rows="4" maxlength="50" placeholder="请输入说明最多50字" v-model="explainText" ref="textEl" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}"></textarea>
                <div class="canOrdBtn fdRow">
                    <div class="canOrdBtnSty canText" @click="reasonWxcMaskSetHidden">
                        <text :style="{fontSize:GLOBAL.bigFS,color:'#787878'}">取消</text>
                    </div>
                    <div class="canOrdBtnSty" @click="determine">
                        <text :style="{fontSize:GLOBAL.bigFS,color:'#53beb7'}">确定</text>
                    </div>
                </div>
            </div>
        </wxc-mask>


        <toast ref="toast"></toast>
    </div>
</template>

<script>
    import Toast from './Toast.vue';
    import {WxcMask } from 'weex-ui'
    const navigator = weex.requireModule('navigator');
    const event = weex.requireModule('event');
    const post = weex.requireModule('stream');
    const modal = weex.requireModule('modal');

    export default {
        components: { Toast,WxcMask},
        name: 'App',
        data() {
            return {
                cancelOrderShow: false, //取消订单原因弹出层
                overlayCfg: {//蒙层参数
                    duration: 150
                },
                reason: ['库存不足','缺少食材','业务繁忙','其他'],
                //reason: ['配送中','未协商','已送达','其他'],
                reasonIndex: 0, //选中原因
                explainText: '', //商家输入说明
                canType: 0, //0-取消订单，1-不同意退款
                canorderIndex: 0, //选择订单Index


                loadinging: false, //上拉加载
                invoiceShow: false, //发票详情弹出层
                invoiceInfo: {}, //点击获取的发票信息
                //更新弹出框部分
                show:false,//更新弹出框
                ignore:false,
                appUp:{},//本次跟新内容

                refreshing:false,
                isShow: false,
                tabIndex:0,
                pageBack: false,
                tabList:[
                    {
                        chooseTabImg:'https://image.aftdc.com/appBimg/icon_tab_pending_selected.png',
                        tabImg:'https://image.aftdc.com/appBimg/icon_tab_pending_normal.png',
                        tabName:'待处理'
                    },
                    {
                        chooseTabImg:'https://image.aftdc.com/appBimg/icon_tab_management_selected.png',
                        tabImg:'https://image.aftdc.com/appBimg/icon_tab_management_normal.png',
                        tabName:'订单管理'
                    },
                    {
                        chooseTabImg:'https://image.aftdc.com/appBimg/icon_tab_operation_selected.png',
                        tabImg:'https://image.aftdc.com/appBimg/icon_tab_operation_normal.png',
                        tabName:'门店管理'
                    },
                    {
                        chooseTabImg:'https://image.aftdc.com/appBimg/icon_myDetailsChoice.png',
                        tabImg:'https://image.aftdc.com/appBimg/icon_myDetails.png',
                        tabName:'我的'
                    }
                ],

                //待处理
                backImgToggle:0,//头部返回图片判断
                tabs: [{
                    title: '新',
                    titleName: '新订单'
                }, {
                    title: '催',
                    titleName: '催单'
                }, {
                    title: '退',
                    titleName: '退款'
                }, {
                    title: '扫',
                    titleName: '扫码'
                }],
                tabsList:[
                    {
                        name: '新订单',
                        arr:[],
                        page: 0
                    }, {
                        name: '催单',
                        arr:[],
                        page: 0
                    }, {
                        name: '退款单',
                        arr:[],
                        page: 0
                    },{
                        name: '扫码',
                        arr:[],
                        page: 0
                    }
                ],
                tabLists:[
                    {
                        name: '进行中',
                        arr:[],
                        page: 0,
                    }, {
                        name: '已完成',
                        arr:[],
                        page: 0,
                        tkPage: 0,
                    }, {
                        name: '已取消',
                        arr:[],
                        page: 0,
                    }
                ],

                groups:'',
                activeTab: '',

                //订单管理
                orderactiveTab:0,
                ordertabs: [{
                    title: '进行中'
                }, {
                    title: '已完成'
                }, {
                    title: '已取消'
                }],
                token:'',
                imei:'',

                //门店管理
                stortabs:[{
                    title: '门店管理',
                    case: [
                        {caseName: '订单设置', caseImg: 'icon_operation_orders.png',url:'http://assets/storeConfiguration.js'},
                        {caseName: '商品管理', caseImg: 'icon_operation_commodity.png',url:'http://assets/goodsManage.js'},
                        // {caseName: '门店展示', caseImg: 'icon_operation_exhibition.png',url:'http://assets/storShow.js'},
                        // {caseName: '堂食管理', caseImg: 'icon_operation_hall.png',url:'http://assets/homeFoodManage.js'},
                        // {caseName: '商家服务', caseImg: 'icon_operation_self_pickup.png',url:'http://assets/merchantService.js'},

                        {caseName: '活动配置', caseImg: 'icon_operation_active.png',url:'http://assets/activeConfiguration.js'},
                        {caseName: '门店推广', caseImg: 'icon_operation_tuiguang.png',url:'http://assets/productIntroduction.js'},
                        // {caseName: '开具发票', caseImg: 'icon_operation_invoice.png',url:'http://assets/addInvoice.js'}
                    ]
                },{
                    title: '大数据中心',
                    case: [
                        {caseName: '今日收银', caseImg: 'icon_operation_financial.png', url:'http://assets/cashier.js'},
                        {caseName: '经营分析', caseImg: 'icon_operation_analysis.jpg', url:'http://assets/businessAnalysis.js'},
                        // {caseName: '粉丝', caseImg: 'icon_operation_vip.png', url:'http://assets/fans.js'},
                        // {caseName: '用户评价', caseImg: 'icon_operation_evaluation.png', url:'http://assets/rating.js'},
                        {caseName: '餐头条', caseImg: 'icon_operation_article.png',url:'http://assets/headLineArticle.js'},
                        // {caseName: '友情提醒', caseImg: 'icon_yqtx.jpg',url:'http://assets/help.js'}
                    ]
                }],
                message:{
                    toDayOrderNum:0,
                    income:0,
                    // count:0,
                    // is_show:1,
                },

                //我的
                shopInfo:'',
                seeOrder:true,
                seeDoor:true,
                is_open_promotion: false,//判断是否已开通推广
                unread_information:0,//未读信息数
            }
        },
        created () {

            var that=this;
            event.init();
            weex.requireModule('globalEvent').addEventListener("newOrder",function(e){
                if (JSON.parse(e.param).orderNo) {
                    var i = JSON.parse(e.param).type; //1:新订单 2:催单 3:退款
                    that.toggle(i-1)
                    that.chooseTab(0)
                }
            });
            this.token = weex.config.token;
            this.imei = weex.config.imei;
            // that.token = 'SGIPGF2MYDBZLSBWS1539928112';
            // that.imei = 'd4f4af29892c41b0be9555f85e1252c6';

            var param = this.GLOBAL.sign(this.token,this.imei);
            param += '&orderStatus=0'
            //获取店铺信息和待处理
            post.fetch({
                method: 'POST',
                type: 'json',
                body: param,
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                url: 'https://www.aftdc.com/businessapp/Store/shopOrder',
            }, function (res) {
                if (res.data.res == -2) {
                    that.toLogin();
                }else{
                    that.shopInfo = res.data.shop;
                    that.is_open_promotion = res.data.is_open_promotion;
                    that.unread_information = res.data.unread_information
                    // 储存缓存
                    var cache = that.unread_information;
                    event.save('unread_information',cache);
                    //app版本
                    that.appUp = res.data.appUp
                    if (event.find('version')!==res.data.appUp.version) that.show = true

                    if(res.data.res==1){
                        that.tabsList[0].arr = res.data.data.newOrder;
                        that.tabsList[0].page = res.data.data.page
                        // that.tabsList[1].arr = res.data.data.reminder;
                        // that.tabsList[2].arr = res.data.data.refund;
                    }
                }
            });
        },
        methods: {
            // 更新部分
            noUpdate(){
                this.show=false;
            },
            ignoreClick(){
                if(this.ignore){
                    this.ignore=false;
                }
                else{
                    this.ignore=true;
                }
            },
            //获取我的
            myMessage(){
                var that=this;
                var param = this.GLOBAL.sign(this.token,this.imei);
                param += '&orderStatus=0'
                //获取店铺信息和待处理
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: 'https://www.aftdc.com/businessapp/Store/shopOrder',
                }, function (res) {
                    if (res.data.res == -2) {
                        that.toLogin();
                    } else{
                        that.shopInfo = res.data.shop;
                        that.is_open_promotion = res.data.is_open_promotion;
                        that.unread_information = res.data.unread_information
                        // 储存缓存
                        var cache = that.unread_information;
                        event.save('unread_information', cache); // -------------------------------------------------------
                    }
                });
            },
            //获取待处理
            onrefresh:function(indexs) {
                this.refreshing = true
                setTimeout(() => {
                    this.refreshing = false
                }, 2000)
                var orderStatus = 0
                switch(indexs){
                    case 0:
                        orderStatus = 0
                        break;
                    case 1:
                        orderStatus = 3
                        break;
                    case 2:
                        orderStatus = -3
                        break;
                }
                var that = this
                var param = this.GLOBAL.sign(this.token,this.imei);
                param += '&orderStatus=' + orderStatus
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: 'https://www.aftdc.com/businessapp/Store/newOrder',
                }, function (res) {
                    if (res.data.res == -2){
                        that.toLogin();
                    } else if(res.data.res == 1){
                        if(orderStatus === 0){
                            that.tabsList[0].arr = res.data.data.newOrder
                            that.tabsList[0].page = res.data.data.page
                        }else if(orderStatus === 3){
                            that.tabsList[1].arr = res.data.data.reminder
                            that.tabsList[1].page = res.data.data.page
                        }else{
                            that.tabsList[2].arr = res.data.data.refund
                            that.tabsList[2].page = res.data.data.page
                        }
                        that.seeOrder = true
                        that.seeDoor = true
                    }else {
                        if(orderStatus === 0){
                            that.tabsList[0].arr = []
                        }else if(orderStatus === 3){
                            that.tabsList[1].arr = []
                        }else{
                            that.tabsList[2].arr = []
                        }
                    }
                })
            },
            //获取订单管理
            seeOrders(type){
                console.log(this.token)
                var that = this


                var param = this.GLOBAL.sign(this.token,this.imei);
                param += '&orderStatus=' + type
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: 'https://www.aftdc.com/businessapp/Store/seeOrders',
                }, function (res) {
                    if (res.data.res == -2) {
                        that.toLogin();
                    } else if(res.data.res == 1){
                        if(type ===  3){
                            that.tabLists[0].arr= res.data.data.doing
                            that.tabLists[0].page = res.data.data.page
                        }else if(type === 4){
                            that.tabLists[1].arr = res.data.data.finish
                            that.tabLists[1].page = res.data.data.page
                            that.tabLists[1].tkPage = res.data.data.tkPage
                        }else{
                            that.tabLists[2].arr = res.data.data.cancel
                            that.tabLists[2].page = res.data.data.page
                        }
                        // that.tabLists[0].arr= res.data.data.doing
                        // that.tabLists[1].arr = res.data.data.finish
                        // that.tabLists[2].arr = res.data.data.cancel
                        that.seeOrder = false
                    } else {
                        if(type === 3){
                            that.tabLists[0].arr = []
                        }else if(type === 4){
                            that.tabLists[1].arr = []
                        }else{
                            that.tabLists[2].arr = []
                        }
                    }
                })
            },
            //获取门店管理
            seeDoors(){
                var that = this
                var param = this.GLOBAL.sign(this.token,this.imei);
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: 'https://www.aftdc.com/businessapp/Store/seeDoor',
                }, function (res) {
                    if (res.data.res == -2) {
                        that.toLogin();
                    } else {
                        that.message.toDayOrderNum = res.data.data.toDayOrderNum;
                        that.message.income = res.data.data.income;
                        // that.message.count = res.data.data.count;
                        // that.message.is_show = res.data.data.is_show;
                        that.seeDoor = false
                    }
                })
            },
            //选择Tab
            chooseTab(i){
                this.tabIndex = i;
                if(i===1){
                    this.seeOrders(3)
                }else if (i===2){
                    this.seeDoors()
                }else if(i===0){
                    this.onrefresh(this.activeTab)
                }else{
                    this.myMessage()
                }
            },
            changeSlider(event){
                this.tabIndex = event.index
            },
            //待处理
            buttonClicked () {
                this.isShow = true;
            },
            overlayClicked () {
                this.isShow = false;
            },
            toggle: function (index) {
                if (index == this.activeTab)
                    return false;
                this.activeTab = index
                if (index == 3&&!this.groups) {
                    event.scan();
                }
            },
            haveScan(){
                event.scan();
            },
            // cancelOrder: function (index, event) {
            //     modal.confirm({
            //         message: '确定取消订单？',
            //         okTitle: '确定',
            //         cancelTitle: '取消'
            //     }, result => {
            //         var that = this
            //         this.res = result;
            //         if (that.res == "确定") {
            //             var that = this
            //
            //             that.tabsList[0].arr[index].deStatus = 4
            //             var param = this.GLOBAL.sign(this.token,this.imei);
            //             param+='&deStatus=4'
            //             param+='&orderId='+that.tabsList[0].arr[index].orderId
            //             post.fetch({
            //                 method: 'POST',
            //                 type: 'json',
            //                 body: param,
            //                 headers: { "Content-Type": "application/x-www-form-urlencoded" },
            //                 url: 'https://www.aftdc.com/businessapp/Ordersa/cancelOrder',
            //             }, function (res) {
            //                 if (res.data.res == -2)
            //                     that.toLogin();
            //                 else {
            //                     that.tabsList[0].arr.splice(index, 1);
            //                     that.tabsList[0].page -= 1
            //                     if (that.tabsList[0].arr.length === 0) {
            //                         that.tabsList[0].arr = false
            //                     }
            //                     const toast=that.$refs.toast
            //                     toast.editContent('订单已取消');
            //                 }
            //             })
            //         } else {
            //             return false;
            //         }
            //     })
            // },
            apply: function (index) {
                modal.confirm({
                    message: '确认备餐?',
                    okTitle: '确认',
                    cancelTitle: '取消'
                }, result => {
                    this.res = result
                    if (this.res == "确认") {

                        this.preparation(index);

                    } else {
                        return false;
                    }
                })
            },
            //备餐
            preparation:function(index){
                var that = this;
                var param = this.GLOBAL.sign(this.token,this.imei);
                var url = '';
                param+='&deStatus=7';
                param+='&orderId='+that.tabsList[0].arr[index].orderId;
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: 'https://www.aftdc.com/businessapp/Ordersa/waitGive',
                }, function (res) {
                    if (res.data.res == -2){
                        that.toLogin();
                    }else {
                        that.tabsList[0].arr.splice(index, 1);
                        that.tabsList[0].page -= 1
                        const toast=that.$refs.toast
                        toast.editContent(res.data.info);

                        // 备餐后转到订单管理
                        setTimeout(function () {
                            that.chooseTab(1)
                            that.orderactiveTab=0;
                        },500)
                        // if (that.tabsList[0].arr.length === 0) {
                        //     that.tabsList[0].arr = []//false
                        // }
                    }
                })
            },

            cuidan: function (index, event) {
                modal.confirm({
                    message: '确定处理催单？',
                    okTitle: '确定',
                    cancelTitle: '取消'
                }, result => {
                    console.log('result:', result)
                    this.re = result
                    if (this.re == "确定") {
                        var that = this
                        that.tabsList[1].arr[index].reminder = 2
                        var param = this.GLOBAL.sign(this.token,this.imei);
                        param+='&reminder=2'+'&orderId='+ that.tabsList[1].arr[index].orderId;
                        post.fetch({
                            method: 'POST',
                            type: 'json',
                            body: param,
                            headers: { "Content-Type": "application/x-www-form-urlencoded" },
                            url: 'https://www.aftdc.com/businessapp/Ordersa/cuidan',
                        }, function (res) {
                            if (res.data.res == -2)
                                that.toLogin();
                            else {
                                const toast=that.$refs.toast
                                toast.editContent(res.data.info);
                                that.tabsList[1].arr.splice(index, 1);
                                that.tabsList[1].page -= 1
                                // if (that.tabsList[1].arr.length === 0) {
                                //     that.tabsList[1].arr = []
                                // }
                            }
                        })
                    } else {
                        return false;
                    }
                })

            },

            aRefund: function (index, event) {
                var that = this
                modal.confirm({
                    message: '确认同意？',
                    okTitle: '确认',
                    cancelTitle: '取消'
                }, result => {
                    this.re = result
                    if (this.re == '确认') {
                        var param = this.GLOBAL.sign(this.token,this.imei);
                        param+='&orderId='+that.tabsList[2].arr[index].orderId
                        post.fetch({
                            method: 'POST',
                            type: 'json',
                            body: param,
                            headers: { "Content-Type": "application/x-www-form-urlencoded" },
                            url: 'https://www.aftdc.com/businessapp/Ordersa/aRefund',
                        }, function (res) {
                            if (res.data.res == -2)
                                that.toLogin();
                            else {
                                const toast=that.$refs.toast
                                toast.editContent(res.data.info);
                                that.tabsList[2].arr.splice(index, 1);
                                that.tabsList[2].page -= 1
                                // if (that.tabsList[2].arr.length === 0) {
                                //     that.tabsList[2].arr = []
                                // }
                            }
                        })
                    } else {
                        return false
                    }
                })
            },

            // bRefund: function (index, event) {
            //     var that = this
            //     modal.confirm({
            //         message: '确定不同意？',
            //         okTitle: '确认',
            //         cancelTitle: '取消'
            //     }, result => {
            //         this.re = result
            //         if (this.re == "确认") {
            //             var param = this.GLOBAL.sign(this.token,this.imei);
            //             param+='&orderId='+ that.tabsList[2].arr[index].orderId
            //             post.fetch({
            //                 method: 'POST',
            //                 type: 'json',
            //                 body: param,
            //                 headers: { "Content-Type": "application/x-www-form-urlencoded" },
            //                 url: 'https://www.aftdc.com/businessapp/Ordersa/bRefund',
            //             }, function (res) {
            //                 if (res.data.res == -2)
            //                     that.toLogin();
            //                 else {
            //                     const toast=that.$refs.toast
            //                     toast.editContent('已拒绝退款');
            //                     that.tabsList[2].arr.splice(index, 1);
            //                     that.tabsList[2].page -= 1
            //                     if (that.tabsList[2].arr.length === 0) {
            //                         that.tabsList[2].arr = false
            //                     }
            //                 }
            //             })
            //         } else {
            //             return false
            //         }
            //     })
            // },
            complete(index,orderType){
                var that = this
                switch(orderType){
                    case 0:
                        var message = '确认送达成功？'
                        break;
                    case 3:
                        var message = '确认用餐成功？'
                        break;
                    case 5:
                        var message = '确认自取成功？'
                }
                modal.confirm({
                    message: message,
                    okTitle: '确认',
                    cancelTitle: '取消'
                }, result => {
                    this.res = result;
                    if (that.res == "确认") {
                        var param = this.GLOBAL.sign(this.token,this.imei);
                        param+='&orderId='+that.tabLists[0].arr[index].orderId
                        param+='&orderType=' + orderType
                        post.fetch({
                            method: 'POST',
                            type: 'json',
                            body: param,
                            headers: { "Content-Type": "application/x-www-form-urlencoded" },
                            url: 'https://www.aftdc.com/businessapp/Ordersa/confirmOrder',
                        }, function (res) {
                            if (res.data.res == -2)
                                that.toLogin();
                            else if(res.data.res == 1){
                                that.tabLists[0].arr.splice(index, 1);
                                that.tabLists[0].page -= 1
                                const toast=that.$refs.toast
                                toast.editContent(res.data.info);
                            }else {
                                const toast=that.$refs.toast
                                toast.editContent(res.data.info);
                            }
                        })
                    } else {
                        return false;
                    }
                })
            },
            completeTake(index){
                var that=this;
                modal.confirm({
                    message: '确认开始配送',
                    okTitle: '确认',
                    cancelTitle: '取消'
                }, result => {
                    this.res = result;
                    if (that.res == "确认") {
                        var param = this.GLOBAL.sign(this.token,this.imei);
                        param+='&orderId='+that.tabLists[0].arr[index].orderId
                        param+='&deStatus=7'
                        post.fetch({
                            method: 'POST',
                            type: 'json',
                            body: param,
                            headers: { "Content-Type": "application/x-www-form-urlencoded" },
                            url: 'https://www.aftdc.com/businessapp/Ordersa/StartSend',
                        }, function (res) {
                            if (res.data.res == -2)
                                that.toLogin();
                            else if(res.data.res == 1){
                                that.$set(that.tabLists[0].arr[index],'orderStatus',4)
                                // that.tabLists[0].arr[index].orderStatus=4;
                                const toast=that.$refs.toast
                                toast.editContent(res.data.info);
                            }else {
                                const toast=that.$refs.toast
                                toast.editContent(res.data.info);
                            }
                        })
                    }
                    else {
                        return false;
                    }
                })
            },

            //扫码获取团购商品信息
            scan: function (data) {
                var that = this
                var param = this.GLOBAL.sign(this.token,this.imei);
                param+='&code='+data
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: 'https://www.aftdc.com/businessapp/Ordersa/getGroupGoods',
                }, function (res) {
                    if (res.data.res == -2)
                        that.toLogin();
                    else if(res.data.res==0){
                        const toast=that.$refs.toast
                        toast.editContent(res.data.info);
                    }else{
                        console.log(res.data.groups)
                        that.groups = res.data.groups
                    }
                })
            },

            comfirGoods: function () {
                var that = this
                const toast=that.$refs.toast
                var getScanResult = that.groups.code;
                var param = this.GLOBAL.sign(this.token,this.imei);
                param+='&code='+ getScanResult
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: 'https://www.aftdc.com/businessapp/Ordersa/comfirGoods',
                }, function (res) {
                    if (res.data.res == 1){
                        toast.editContent(res.data.info);
                        that.scan(getScanResult);
                    }else{
                        toast.editContent(res.data.info);
                    }
                })
            },

            //我的
            showConfirm (event) {
                var that = this
                modal.confirm({
                    message: '退出登录？',
                    okTitle: '退出',
                    cancelTitle: '取消'
                }, result => {
                    this.res = result
                    if(this.res=='退出'){
                        that.toLogin();
                    }else {
                        return false;
                    }
                })
            },
            toLogin(){
                var that = this;
                var param = 'imei='+this.imei;
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: 'https://www.aftdc.com/businessapp/Login/logout',
                }, function (res) {
                    // if (res.data.res == 1){
                    //--------------------------------------------------------------------------------------------------------------------
                    event.unregisterPush();
                    event.delete("businessToken");
                    event.delete("shopId");
                    event.delete("shopName");
                    var url='http://assets/login.js';
                    var param='';
                    event.toUrl({url:url,param:param});
                    navigator.pop({ animated: 'false' });
                    //--------------------------------------------------------------------------------------------------------------------
                    // }
                })
            },
            //跳转
            openUrl(url){
                if(url){
                    //判断是否已开通推广
                    if (this.is_open_promotion&&url=='http://assets/productIntroduction.js')
                        url = 'http://assets/promotionHome.js';
                    else if (!this.is_open_promotion&&url=='http://assets/productIntroduction.js')
                        url = 'http://assets/productIntroduction.js';
                    else if (!this.shopInfo.acticleAccount&&url=='http://assets/headLineArticle.js')
                        url = 'http://assets/registerCtt.js';
                    var param='';
                    event.toUrl({url:url,param:param});
                }
            },
            //监听扫码后页面返回
            viewdisappear(){
                let self=this;
                self.pageBack = true;
            },
            viewappear(){
                let self=this;
                if(!self.pageBack){ return; }
                self.pageBack = false;
                //获取消息通知
                if (event.find('unread_information')) {
                    self.unread_information=event.find('unread_information');
                }
                if (event.find('scanResult')) {
                    var getScanResult = event.find('scanResult');
                    this.scan(getScanResult);
                    event.delete('scanResult');
                }else {
                    this.showWaitData()
                    this.toggle(0);//没结果就默认到新订单页
                }
                //开通餐头条
                if (event.find('registerCtt')) {
                    this.shopInfo.acticleAccount = true
                    event.delete('registerCtt')
                }
                //营业状态页面返回
                if (event.find('statusParam')) {
                    var param = event.find('statusParam');
                    var shopAtive = JSON.parse(param).shopAtive;
                    if (shopAtive == 1) {
                        shopAtive = 0;
                    } else {
                        shopAtive = 1;
                    }
                    self.shopInfo.shopAtive = shopAtive;
                    event.delete('statusParam');
                }
                //获取营业时间保存的数据
                if (event.find('timeParam')) {
                    var timeParam = JSON.parse(event.find('timeParam'));
                    self.shopInfo.serviceTime = timeParam['serviceTime'];
                    // self.shopInfo.serviceEndTime = timeParam['serviceEndTime'];
                    event.delete('timeParam');
                    // //判断营业状态
                    var serviceTime=self.shopInfo.serviceTime
                    var date = new Date();
                    var hours = date.getHours()
                    if(hours<10){
                        hours='0'+hours
                    }

                    var minutes=date.getMinutes()
                    if(minutes<10){
                        minutes='0'+minutes
                    }
                    var now=hours+':'+minutes
                    for(var i in serviceTime){
                        if(now > serviceTime[i].serviceStartTime && now < serviceTime[i].serviceEndTime){
                            self.shopInfo.shopAtive = 1
                            break;
                        }else{
                            self.shopInfo.shopAtive = 2
                        }
                    }
                }
            },
            //判断有没有未处理数据，有则去显示
            showWaitData(){
                var tabsList = this.tabsList
                for (var i in tabsList) {
                    if (tabsList[i].arr.length!=0) {
                        this.toggle(i)
                        this.chooseTab(0)
                        break;
                    }
                }
            },
            openMap(lat,lng){
                var userLat = lat ;
                var userLng = lng ;
                var shopLat = this.shopInfo.latitude ;
                var shopLng = this.shopInfo.longitude ;
                var range = this.shopInfo.range ;
                var obj = {userLat:userLat,userLng:userLng,shopLat:shopLat,shopLng:shopLng,range:range};
                event.navigationMap(obj);
            },
            phone(phone){
                event.phone(phone);
            },
            //跳转到当前账户页面
            goToThisUser:function () {
                var param = '';
                var url='http://assets/modify.js';
                event.toUrl({ "url": url, "param": param });
            },
            //跳转到我的反馈页面
            goToFeedBack:function () {
                var param = this.shopInfo.salesman;
                var url='http://assets/feedback.js';
                event.toUrl({ "url": url, "param": param });
            },
            //跳转到消息和铃声页面
            goToVolume:function () {
                // var param = '';
                // var url='http://assets/volume.js';
                // event.toUrl({ "url": url, "param": param });
                event.volume();
            },
            //跳转到二维码页面
            goToQr:function () {
                var param = '';
                var url='http://assets/qr.js';
                event.toUrl({ "url": url, "param": param });
            },
            //跳转到打印设置页面
            goToPrinting:function () {
                var param = '';
                var url='http://assets/printing.js';
                event.toUrl({ "url": url, "param": param });
            },
            //跳转到门店设置页面
            goToStore:function () {
                var param = '';
                var url='http://assets/store.js';
                event.toUrl({ "url": url, "param": param });
            },
            //跳转到订单设置页面
            // goToSetOrder:function () {
            //     var param = '';
            //     var url='http://assets/storeConfiguration.js';
            //     event.toUrl({ "url": url, "param": param });
            // },
            //跳转到预览门店页面
            goToShopShow:function () {
                var that=this
                var shopInfo=that.shopInfo
                var shopType=1
                var orderType=0
                switch (shopInfo.featured) {
                    case 0:
                        shopType = 1
                        orderType=0
                        break;
                    case 3:
                        shopType = 5
                        orderType=3
                        break;
                    case 5:
                        shopType = 2
                        orderType=5
                        break;
                }
                var param = {shopId:shopInfo.shopId,shopType:shopType,orderType:orderType,latitude:shopInfo.latitude,longitude:shopInfo.longitude};
                var url='http://assets/shopShow.js';
                event.toUrl({ "url": url, "param": JSON.stringify(param)});
            },
            //跳转到消息中心页面
            goToMessageCenter:function () {
                var param = '';
                var url='http://assets/message.js';
                event.toUrl({ "url": url, "param": param });

                var cache = JSON.stringify();
            },
            //跳转到营业状态页面
            goToBusStatus:function () {
                var param = '';
                var url='http://assets/busStatus.js';
                event.toUrl({ "url": url, "param": param });
            },
            //跳转帮助页面
            goToHelp:function () {
                var param = '';
                var url='http://assets/help.js';
                event.toUrl({ "url": url, "param": param });
            },
            change: function (event) {
                this.toggle(event.index)
                this.onrefresh(event.index)
            },
            orderChange(event){
                this.orderactiveTab = event.index;
                var i = event.index;
                // if(i===1&&this.seeOrder){
                //     this.seeOrders()
                // }else if (i===2&&this.seeDoor){
                //     this.seeDoors()
                // }
                switch(i){
                    case 0:
                        var type = 3
                        break;
                    case 1:
                        var type = 4
                        break;
                    case 2:
                        var type = -1
                }
                this.seeOrders(type)
                if (i===2&&this.seeDoor){
                    this.seeDoors()
                }
            },
            wxcMaskSetHidden(){
                this.show=false;
            },
            // 点击查看发票
            invoiceOpenMask (type,indexs,index) {
                if(type == 0){
                    this.invoiceInfo = this.tabsList[indexs].arr[index].billInfo
                }else {
                    this.invoiceInfo = this.tabLists[indexs].arr[index].billInfo
                }
                this.invoiceShow = true;
            },
            // 隐藏发票
            invoiceWxcMaskSetHidden () {
                this.invoiceShow = false;
            },
            // 上拉加载
            loadmore(indexs){
                var that = this
                this.loadinging = true
                setTimeout(() => {
                    this.loadinging = false
                }, 2000)
                switch(indexs){
                    case 0:
                        var orderStatus = 0
                        break;
                    case 1:
                        var orderStatus = 3
                        break;
                    case 2:
                        var orderStatus = -3
                        break;
                }
                var param = this.GLOBAL.sign(this.token,this.imei);
                param+='&orderStatus=' + orderStatus
                param+='&page=' + this.tabsList[indexs].page
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: 'https://www.aftdc.com/businessapp/Store/loadOrder',
                }, function (res) {
                    if(res.data.res === 1) {
                        if(orderStatus === 0){
                            that.tabsList[0].arr = that.tabsList[0].arr.concat(res.data.data.newOrder)
                            that.tabsList[0].page += res.data.data.page
                        }else if(orderStatus === 3){
                            that.tabsList[1].arr = that.tabsList[1].arr.concat(res.data.data.reminder)
                            that.tabsList[1].page += res.data.data.page
                        }else{
                            that.tabsList[2].arr = that.tabsList[2].arr.concat(res.data.data.refund)
                            that.tabsList[2].page += res.data.data.page
                        }
                    }else {
                        setTimeout(() => {
                            const toast=that.$refs.toast
                            toast.editContent(res.data.info);
                        }, 2000)
                    }
                })
            },
            loadOrder(indexs) {
                var that = this
                this.loadinging = true
                setTimeout(() => {
                    this.loadinging = false
                }, 2000)
                switch(indexs){
                    case 0:
                        var orderStatus = 3
                        break;
                    case 1:
                        var orderStatus = 4
                        break;
                    case 2:
                        var orderStatus = -1
                        break;
                }
                var param = this.GLOBAL.sign(this.token,this.imei);
                param+='&orderStatus=' + orderStatus
                param+='&page=' + this.tabLists[indexs].page

                if(indexs ===1 ){
                    param+='&tkPage=' + this.tabLists[indexs].tkPage
                }
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: 'https://www.aftdc.com/businessapp/Store/seeOrders',
                }, function (res) {
                    if(res.data.res === 1) {
                        if(orderStatus === 3){
                            // this.test = this.test.concat(jj)
                            that.tabLists[0].arr = that.tabLists[0].arr.concat(res.data.data.doing)
                            that.tabLists[0].page += res.data.data.page
                        }else if(orderStatus === 4){
                            that.tabLists[1].arr = that.tabLists[1].arr.concat(res.data.data.finish)
                            that.tabLists[1].page += res.data.data.page
                            that.tabLists[1].tkPage += res.data.data.tkPage
                        }else{
                            that.tabLists[2].arr = that.tabLists[2].arr.concat(res.data.data.cancel)
                            that.tabLists[2].page += res.data.data.page
                        }
                    }else {
                        setTimeout(() => {
                            const toast=that.$refs.toast
                            toast.editContent(res.data.info);
                        }, 2000)
                    }
                })
            },
            // 选择取消订单与不同意退款原因
            checkedReason(index){
                this.reasonIndex = index
                if(index === 3){
                    this.$refs.textEl.focus()
                }
            },
            blur(){

            },
            reasonWxcMaskSetShow(type,index){
                if(type === 0){
                    this.reason = ['库存不足','缺少食材','业务繁忙','其他']
                }
                else if(type===1) {
                    this.reason = ['配送中','未协商','已送达','其他']
                }
                else if(type===2) {
                    this.reason = ['已备餐','已自取']
                }else if(type===3) {
                    this.reason = ['已备餐','已用餐']
                }
                this.cancelOrderShow = true;
                this.canType = type
                this.canorderIndex = index
            },
            reasonWxcMaskSetHidden(){
                this.cancelOrderShow = false;


                this.reasonIndex = 0
                this.explainText = ''
            },
            // 取消订单与不同意退款原因确定按钮
            determine(){
                if(this.reasonIndex === 3 && this.explainText === ''){
                    const toast=this.$refs.toast
                    toast.editContent('其他说明不能为空');
                }else {
                    var that = this
                    const toast=this.$refs.toast
                    var reasonContent = this.reason[this.reasonIndex] + '。'+this.explainText

                    if(this.canType === 0){
                        //that.tabsList[0].arr[that.canorderIndex].deStatus = 4
                        var param = this.GLOBAL.sign(this.token,this.imei);
                        //param+='&deStatus=4'
                        param+='&orderId='+that.tabsList[0].arr[that.canorderIndex].orderId
                        param+='&reason='+reasonContent
                        post.fetch({
                            method: 'POST',
                            type: 'json',
                            body: param,
                            headers: { "Content-Type": "application/x-www-form-urlencoded" },
                            url: 'https://www.aftdc.com/businessapp/Ordersa/cancelOrder',
                        }, function (res) {
                            if (res.data.res == -2){
                                that.toLogin();
                            }else {
                                that.tabsList[0].arr.splice(that.canorderIndex, 1);
                                that.tabsList[0].page -= 1
                                // if (that.tabsList[0].arr.length === 0) {
                                //     that.tabsList[0].arr = []
                                // }
                                toast.editContent(res.data.info);
                            }
                        })
                    }else {
                        var param = this.GLOBAL.sign(this.token, this.imei);
                        param += '&orderId=' + that.tabsList[2].arr[that.canorderIndex].orderId
                        param+='&reason='+reasonContent
                        post.fetch({
                            method: 'POST',
                            type: 'json',
                            body: param,
                            headers: {"Content-Type": "application/x-www-form-urlencoded"},
                            url: 'https://www.aftdc.com/businessapp/Ordersa/bRefund',
                        }, function (res) {
                            if (res.data.res == -2)
                                that.toLogin();
                            else {
                                const toast = that.$refs.toast
                                toast.editContent(res.data.info);
                                that.tabsList[2].arr.splice(that.canorderIndex, 1);
                                that.tabsList[2].page -= 1
                                // if (that.tabsList[2].arr.length === 0) {
                                //     that.tabsList[2].arr = []
                                // }
                            }
                        })
                    }

                    this.cancelOrderShow = false;
                    this.reasonIndex = 0
                    this.explainText = ''

                }
            },
            // cancelOrder: function (index, event) {
            //     modal.confirm({
            //         message: '确定取消订单？',
            //         okTitle: '确定',
            //         cancelTitle: '取消'
            //     }, result => {
            //         var that = this
            //         this.res = result;
            //         if (that.res == "确定") {
            //             var that = this
            //             that.tabsList[0].arr[index].deStatus = 4
            //             var param = this.GLOBAL.sign(this.token,this.imei);
            //             param+='&deStatus=4'
            //             param+='&orderId='+that.tabsList[0].arr[index].orderId
            //             post.fetch({
            //                 method: 'POST',
            //                 type: 'json',
            //                 body: param,
            //                 headers: { "Content-Type": "application/x-www-form-urlencoded" },
            //                 url: 'https://www.aftdc.com/businessapp/Ordersa/cancelOrder',
            //             }, function (res) {
            //                 if (res.data.res == -2)
            //                     that.toLogin();
            //                 else {
            //                     that.tabsList[0].arr.splice(index, 1);
            //                     that.tabsList[0].page -= 1
            //                     if (that.tabsList[0].arr.length === 0) {
            //                         that.tabsList[0].arr = false
            //                     }
            //                     const toast=that.$refs.toast
            //                     toast.editContent('订单已取消');
            //                 }
            //             })
            //         } else {
            //             return false;
            //         }
            //     })
            // },
            // bRefund: function (index, event) {
            //     var that = this
            //     modal.confirm({
            //         message: '确定不同意？',
            //         okTitle: '确认',
            //         cancelTitle: '取消'
            //     }, result => {
            //         this.re = result
            //         if (this.re == "确认") {
            //             var param = this.GLOBAL.sign(this.token,this.imei);
            //             param+='&orderId='+ that.tabsList[2].arr[index].orderId
            //             post.fetch({
            //                 method: 'POST',
            //                 type: 'json',
            //                 body: param,
            //                 headers: { "Content-Type": "application/x-www-form-urlencoded" },
            //                 url: 'https://www.aftdc.com/businessapp/Ordersa/bRefund',
            //             }, function (res) {
            //                 if (res.data.res == -2)
            //                     that.toLogin();
            //                 else {
            //                     const toast=that.$refs.toast
            //                     toast.editContent('已拒绝退款');
            //                     that.tabsList[2].arr.splice(index, 1);
            //                     that.tabsList[2].page -= 1
            //                     if (that.tabsList[2].arr.length === 0) {
            //                         that.tabsList[2].arr = false
            //                     }
            //                 }
            //             })
            //         } else {
            //             return false
            //         }
            //     })
            // },
        }
    }
</script>

<style scoped>
    /* 取消订单与不同意退款弹出层 */
    .wrap {
        flex: 1;
        align-items: center;
        justify-content: space-between;
    }
    .checked {
        width: 560px;
        padding-top: 20px;

    }
    .checkedAll {
        flex-wrap: wrap;
    }
    .checkedItem {
        width: 280px;
        align-items: center;
        padding-top: 20px;
        padding-right: 20px;
    }
    .checkedIcon {
        width: 34px;
        height: 34px;
        border-radius: 18px;
        border-width: 3px;
        border-style: solid;
        border-color: #b5b5b5;
        margin-right: 10px;
    }
    .checkedInside {
        width: 17px;
        height: 17px;
        border-radius: 50px;
        background-color: #fff;
        margin-left: 6px;
        margin-top: 6px;
    }
    .checkedActive {
        background-color: #b5b5b5;
    }



    .textarea {
        padding-right: 10px;
        padding-left: 10px;
        padding-top: 10px;
        padding-bottom: 10px;
        width: 560px;
        border-width: 1px;
        border-style: solid;
        border-color: #bcbcbc;
    }
    .canOrdBtn {
        width: 600px;
        border-top-width: 1px;
        border-top-style: solid;
        border-top-color: #dbdbdb;
    }
    .canOrdBtnSty {
        height: 90px;
        flex: 1;
        align-items: center;
        justify-content: center;
    }
    .canText {
        border-right-width: 1px;
        border-right-style: solid;
        border-right-color: #dbdbdb;
    }











    /*导航栏上部*/
    .size {
        width: 750px;
        position: absolute;
        top: 0;
        bottom: 120px;
    }
    .block{
        width: 750px;
        height: inherit;
        position: absolute;
        top: 0;
        bottom: 0;
    }
    /*上拉加载*/
    .loading {
        width: 750px;
        display: -ms-flex;
        display: -webkit-flex;
        display: flex;
        -ms-flex-align: center;
        -webkit-align-items: center;
        -webkit-box-align: center;
        align-items: center;
    }
    .indicator-text {
        color: #888888;
        font-size: 42px;
        text-align: center;
    }
    .indicator {
        margin-top: 16px;
        height: 40px;
        width: 40px;
        color: blue;
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
    }
    .loadingImg{
        width: 90px;
        height: 66px;
    }
    /*导航栏*/
    .Tab {
        display: flex;
        flex-direction: row;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        border-top-width: 1px;
        border-top-color: #d9d9d9;
        background-color: #fff;
        height: 120px;
    }
    .Tablist {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;;
        align-items: center;
        text-align: center;
    }
    .TabImg{
        width: 45px;
        height: 45px;
    }
    .TabName {
        margin-top: 8px;
    }

    /*待处理*/
    .tabbar {
        height: 150px;
        width: 750px;
        display: flex;
        flex-direction: row;
        background-color: #53bdb6;
    }

    /*.lists{*/
    /*display: flex;*/
    /*flex-direction: row;*/
    /*width: 3000px;*/
    /*position: absolute;*/
    /*top: 150px;*/
    /*bottom: 0;*/
    /*}*/
    .slider {
        position: relative;
        width: 750px;
        flex: 1;
        flex-direction: row;
        background-color: #ffffff;
        transition: left 0.2s ease-in-out;
    }
    .tab {
        height: 150px;
        width: 187px;
        justify-content: center;
        align-items: center;
    }

    .active {
        position: absolute;
        width: 75px;
        height: 75px;
        top: 14px;
        margin-left: 55px;
        border-radius: 20px;
        background-color: rgb(15, 227, 197);
        transition: left 0.2s ease-in-out;
    }

    .activeName {
        position: absolute;
        /*margin-left: 10px;*/
        border-bottom-color: #0FE3C5;
        border-bottom-width: 5px;
        border-bottom-style: solid;
        transition: left 0.2s ease-in-out;
    }

    .title {
        margin-top: 10px;
    }


    .wrapper {
        transition: left 0.2s ease-in-out;
        background-color: #eff3f6;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }

    .section {
        justify-content: center;
        align-items: center;
    }
    .newDiv{
        flex-direction: column;
        align-items: center;
        justify-content:center;
        flex: 1;
        width: 750px
    }
    .noOrderIcon{
        width: 200px;
        height: 200px;
    }

    .tg{

    }

    .tgTitle{
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
        padding-left: 10px;
        padding-right: 10px;
    }
    .quanTitle{
        width: 640px;
        text-align: center;
        padding-top: 15px;
        padding-bottom: 20px;
    }

    .tgContent{
        flex-direction: column;
    }
    .line{
        height: 2px;
        background-color: #dedede;
        margin-left: 15px;
        margin-right: 15px;
        margin-top: 10px;
    }
    .tgList{
        padding-left: 10px;
        padding-right: 15px;
        padding-top: 15px;
        flex-direction: row;
        justify-content: space-between
    }
    .tgNum{
        padding-left: 20px;
        padding-right: 20px;
        margin-top: 20px;
        flex-direction: column;
    }
    .tgNumDiv{
        padding-top: 15px;
        flex-direction: row;
        justify-content: space-between;
    }
    .tgbottom{
        /*width: 700px;*/
        margin-top: 40px;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        margin-bottom: 20px;
    }
    .tgbuttomContinue{
        width: 600px;
        border-radius: 10px;
        background-color: #53beb7;
        text-align: center;
        padding-top: 25px;
        padding-bottom: 25px;
        color: #fff;
    }
    .tgbuttom{
        width: 600px;
        border-radius: 10px;
        background-color: #53beb7;
        text-align: center;
        padding-top: 25px;
        padding-bottom: 25px;
        color: #fff;
    }
    .scanButtom{
        width: 280px;
        border-radius: 10px;
        background-color: #fff;
        text-align: center;
        padding-top: 25px;
        padding-bottom: 25px;
        color: #666;
        border-width: 1px;
        border-style: solid;
        border-color: #666;
    }
    .tgComfirButtom{
        width: 280px;
        border-radius: 10px;
        background-color: #53beb7;
        text-align: center;
        padding-top: 25px;
        padding-bottom: 25px;
        color: #fff;
    }

    .wm {
        color: #f9aa10;
    }

    .count{
        flex-direction: row;
        justify-content: space-between;
        margin-top: 10px;
        background-color: #f8f8f8;
        padding-bottom: 10px;
        padding-left: 10px;
        padding-right: 10px;
        border-radius: 8px;
    }

    .orderBut{
        flex-direction: row;
        justify-content: space-between;
        margin-top: 10px;
    }

    .cancelBtn{
        width: 200px;
        height: 60px;

        color: #ff0000;
        border-color: #ff0000;
        border-style: solid;
        border-width: 1px;
        line-height: 60px;
        text-align: center;
        border-radius: 8px;
    }
    .btn {
        width: 200px;
        height: 60px;
        border-color: #53beb7;
        border-style: solid;
        border-width: 1px;
        line-height: 60px;
        text-align: center;
        border-radius: 8px;
    }

    /*订单管理*/
    .ordertabbar {
        display: flex;
        flex-direction: row;
        background-color: #53beb7;
    }

    .ordertab {
        height: 100px;
        width: 250px;
        justify-content: center;
        align-items: center;
    }

    .orderactive {
        position: absolute;
        top: 0;
        left: 0;
        font-size: 55px;
        color: #ffc310;
        transition: left 0.2s ease-in-out;
        border-bottom-width: 5px;
        border-bottom-color: #0FE3C5;
    }
    .order-head {
        text-align: center;
        color: #f9aa10;
    }

    .box {
        width: 700px;
        margin-top: 20px;
        padding-left: 30px;
        padding-top: 20px;
        padding-right: 30px;
        padding-bottom: 20px;
        border-width: 3px;
        border-style: solid;
        border-color: #dedede;
        border-radius: 10px;
        background-color: #fff;
    }
    .boxDiv{
        flex-direction: row;
        justify-content: space-between
    }
    .boxTime{
        flex-direction: row;
        justify-content: space-between;
        padding-bottom: 10px;
        border-bottom-width: 1px;
        border-bottom-color: #dedede
    }
    .boxDetails{
        flex-direction:row;
        justify-content: space-between;
        padding-top: 20px;
        padding-bottom: 10px;
        align-items: center
    }
    .boxDetailsDiv{
        flex: 3;
        flex-direction: row;
        justify-content: space-between;
    }
    .jcFe {
        justify-content: flex-end;
    }
    .boxDetailsIocn{
        width: 55px;
        height: 55px;
    }
    .goodsIcon{
        width: 30px;
        height: 30px;
        margin-top: 5px
    }
    .goodsDiv{
        flex-direction: row;
        justify-content: space-between;
        margin-top: 5px
    }
    .boxMoreDiv{
        justify-content: center;
        align-items: center;
        padding-top: 50px;
        padding-bottom: 50px
    }
    .boxMoreIcon{
        border-radius: 70px;
        width: 140px;
        height: 140px;
        margin-bottom: 30px
    }
    .goods{
        background-color: #f8f8f8;
        margin-top: 10px;
        padding-top: 10px;
        padding-bottom: 10px;
        padding-left: 10px;
        padding-right: 10px;
        border-radius: 8px;
    }

    .wm {
        color: #f9aa10;
    }

    .order-address {
        margin-top: 12px;
    }

    .order-normal {
        margin-top: 12px;
        text-align: center;
    }

    /*门店管理*/
    .top {
        flex-direction: row;
        justify-content: space-around;
        background-color: #53beb7;
    }

    .top_content {

    }
    .justify_content{
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }
    .row {
        flex-direction: row;
        width: 375px;
        justify-content: center;
        align-items: center;
        margin-top: 10px;
        margin-bottom: 10px;
    }
    .fdRow {
        flex-direction: row;
    }
    .noReadNum{

        width: 36px;
        height: 36px;
        line-height: 36px;
        background-color: red;
        border-radius: 18px;
        margin-right: 10px;
    }

    .topNum {
        font-size: 55px;
        margin-right: 10px;
        color: #fff;
    }

    .row_num {
        flex-direction: row;
        width: 375px;
        justify-content: center;
        align-items: center;
        margin-top: 10px;
    }

    .numMain {
        line-height: 55px;
        height: 55px;
    }

    .img_default {
        width: 50px;
        height: 50px;

    }

    .messageCenter {
        width: 750px;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding-top: 25px;
        padding-left: 20px;
        padding-right: 20px;
        padding-bottom: 25px;
        background-color: #fff;
        border-bottom-color: #eeeeee;
        border-bottom-width: 1px;
    }
    .messageCenter p:nth-child(2){
        margin-left: auto;
    }

    .arrow_right {
        width: 25px;
        height: 25px;

    }

    .all {
        background-color: #f8f8f8;
    }
    .operationCard{
        background-color: #fff;
        flex-direction: column;
    }
    .cardContent{
        flex-wrap: wrap;
        flex-direction: row;
    }
    .contentClassify{

        justify-content: center;
        width: 187.5px;
        padding-top: 20px;
        padding-left: 20px;
        padding-right: 20px;
        padding-bottom: 20px;
        box-sizing: border-box;
        border-width: 1px;
        border-style: solid;

        border-color: #eeeeee;
        border-collapse: collapse;


    }
    .cardImg{
        width: 70px;
        height: 70px;
        margin-bottom: 20px;
    }
    .caedTitle{
        margin-top: 25px;
        margin-left: 20px;
        margin-bottom: 25px;
    }
    /*我的*/
    .mytitle {
        display: flex;
        flex-direction: row;
        background-color: #53bdb6;
        justify-content: space-between;
        padding-left: 25px;
        padding-top: 20px;
        padding-right: 25px;
        padding-bottom: 20px;
    }
    .mytitleIcon{
        width: 130px;
        height: 130px;
        margin-right: 25px;
    }
    .mytitleShopName{
        flex-direction: row;
        justify-content: space-between
    }
    .mytitleDiv{
        flex-direction: row;
        align-items: center;
        margin-top: 20px
    }
    .mytitleImage{
        width: 20px;
        height: 20px;
        margin-top: 5px
    }
    .goToIcon{
        width: 50px;
        height: 50px;
        margin: 20px
    }
    .gotoDiv{
        flex-direction: row;
        justify-content: space-between;
        padding-top: 20px;
        padding-bottom: 20px;
        padding-left: 20px;
        padding-right: 20px;
        background-color: #fff
    }
    .PrintIcon{
        width: 50px;
        height: 50px;
    }
    .PrintText{
        margin-top: 20px;
    }

    .set {
        width: 187px;
        height: 180px;
        border-color: #f0f0f0;
        border-style: solid;
        border-top-width: 1px;
        border-right-width: 3px;
        border-bottom-width: 3px;
        align-items: center;
        justify-content: center;
    }

    .public {
        padding-top: 25px;
        padding-bottom: 25px;
        padding-left: 20px;
        padding-right: 20px;
        border-bottom-width: 1px;
        border-bottom-color: #eeeeee;
        border-bottom-style: solid;
        flex-direction: row;
        justify-content: space-between;
        background-color: #fff
    }
    .publicIcon{
        width: 25px;
        height: 25px;
    }

    .logout {
        padding-top: 25px;
        padding-bottom: 25px;
        align-items: center;
        width: 650px;
        background-color: red;
        margin-left: 50px;
        margin-top:50px;
        border-radius: 10px
    }
    /*更新弹出框*/
    .aiCenter {
        flex-direction: row;
        align-items: center;
    }
    .updateBtnRight{
        flex: 1;
        text-align: center;
        padding-top: 30px;
        padding-bottom: 30px;
        color: #53beb7;
    }
    .updateBtnLeft{
        flex: 1;
        text-align: center;
        padding-top: 30px;
        padding-bottom: 30px;
        border-right-style: solid;
        border-right-width: 1px;
        border-right-color: #f1f1f1;
        color: #999;
    }
    .updateBtn{
        border-top-style: solid;
        border-top-width: 1px;
        border-top-color: #f1f1f1;
    }
    .ignoreText{
        margin-left: 5px;
    }
    .ignoreIcon{
        width: 25px;
        height: 25px;
    }
    .ignoreDiv{
        padding-left: 20px;
        padding-right: 20px;
        margin-top: 60px;
        margin-bottom: 60px;
    }
    .thisUpdate{
        line-height: 40px;
        padding-right: 20px;
        /*flex: 1;*/
    }
    .updateContent{
        font-weight: bold;
        margin-left: 20px;
        margin-bottom: 5px;
    }
    .updateScroller{
        flex: 1;
        margin-left: 20px;
        margin-right: 20px;
    }
    .updateTitle{

        text-align: center;
        margin-top: 50px;
        margin-bottom: 60px;
    }
    .update{
        flex: 1;
    }
    .notice {
        position: absolute;
        width: 30px;
        height: 30px;
        text-align: center;
        line-height: 30px;
        color: #ffffff;
        background-color: #ff3b30;
        border-radius: 15px;
        right: 40px;
        top: 23px;
        font-size: 18px;
    }
    .noticeTwo{
        position: absolute;
        width: 18px;
        height: 18px;
        background-color: #ff3b30;
        border-radius: 15px;
        right: 40px;
        top: 5px;
        font-size: 18px;
    }

    .remarks{
        flex-direction: row;
        margin-top: 10px;
        background-color: #f8f8f8;
        padding-bottom: 10px;
        padding-left: 10px;
        padding-right: 10px;
        border-radius: 8px;
    }
    .remarksText {
        margin-top: 12px;
    }
    .jcSb {
        justify-content: space-between;
    }
    .underWay {
        justify-content: center;
    }
    .column {
        flex-direction: column;
    }
    .indicator-text {
        color: #666;
        font-size: 28px;
        text-align: center;
        margin-top: 30px;
        margin-bottom: 30px;
    }
    .content {
        flex: 1;
        padding-top: 40px;
        padding-left: 40px;
        padding-right: 40px;
    }
    /* 发票弹出层 */
    .invoiceTitle {
        text-align: center;
        line-height: 50px;
        color: #555;
    }
    .invoiceText {
        line-height: 38px;
    }
    .mt6 {
        margin-top: 12px;
    }


</style>