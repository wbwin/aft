<template>
    <div class="wrapper" @viewappear="viewappear" @viewdisappear="viewdisappear" :style="{visibility: visibility}">
        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="backClick"
                    v-once
            >
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">活动配置</text>
                <!--<text :style="GLOBAL.headerRight"  slot="right">帮助</text>-->
            </wxc-minibar>
        </div>
        <div class="countent">
            <div class="content_top">
                <div class="topNav" @click="toggleClick(0)">
                    <text class=" drageDown" :style="{fontSize:GLOBAL.bigFS,color:toggle==0?GLOBAL.tColor:GLOBAL.dColor}" >新建活动</text>
                </div>
                <div class="topNav" @click="toggleClick(1)">
                    <text class="ascending" :style="{fontSize:GLOBAL.bigFS,color:toggle==1?GLOBAL.tColor:GLOBAL.dColor}" >已创建活动</text>
                </div>
            </div>
            <!--********新建活动*******-->
            <slider class="slider" infinite="false"  :index="toggle" @change="change">
                <scroller class="scroller">
                    <div v-for="(item,index) in allActive">
                        <div class="listCell">
                            <div class="cellBorder">
                                <div class="cellRight">

                                    <text class="textImg" :style="{fontSize:GLOBAL.defaultFS,color:'#fff',backgroundColor:item.backgroundColor}" >{{item.backgroundName}}</text>
                                    <div class="activeClassfly">
                                        <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.activeName}}</text>
                                        <text class="activeEffect" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">{{item.activeEffect}}</text>
                                    </div>

                                </div>
                                <div class="createActive">
                                    <wxc-button class="createButton" text="新建" :textStyle="createStyle"
                                                :btn-style="createBtnStyle"
                                                @wxcButtonClicked="goToNew(item.url)"></wxc-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </scroller>
                <!--********新建活动*******-->
                <!--********已创建活动*******-->
                <div class="createdActive" >
                    <div class="timeActive">

                        <text class=" ongoingActive" :style="{fontSize:GLOBAL.bigFS,color:timeToggle==0?'#fff':GLOBAL.dColor,backgroundColor:timeToggle==0?'#53beb7':'#fff'}" @click="timeToggleClick(0)">进行中</text>
                        <text class=" endActive" :style="{fontSize:GLOBAL.bigFS,color:timeToggle==1?'#fff':GLOBAL.dColor,backgroundColor:timeToggle==1?'#53beb7':'#fff'}"  @click="timeToggleClick(1)">已结束</text>
                    </div>
                    <slider class="slider" infinite="false"  :index="timeToggle" @change="timeChange">


                        <!--*********进行中*******-->
                        <scroller class="listHeight">

                            <div v-if="res">
                                <!--新客立减-->
                                <div v-if="newCou">
                                    <text class="endTitle" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.tColor}">新客立减</text>
                                </div>
                                <div class="timeListCell" v-if="newCou">
                                    <div class="listContent timeCellName">
                                        <text class="endTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">新客立减</text>
                                        <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{newCou.WaitUp?'待上线':'进行中'}}</text>
                                    </div>
                                    <div class="listContent activeOrder">
                                        <div class="orderContent">
                                            <text class=" orderTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">昨日订单</text>
                                            <div class="orderNum">
                                                <text  :style="{fontSize:GLOBAL.biggestFS,color:GLOBAL.tColor}">{{newCou.lastCount}}</text>
                                                <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor,marginBottom:'5px'}">个</text>
                                            </div>
                                        </div>
                                        <div class="orderContent">
                                            <text class=" orderTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">总计订单</text>
                                            <div class="orderNum">
                                                <text  :style="{fontSize:GLOBAL.biggestFS,color:GLOBAL.tColor}">{{newCou.allCount}}</text>
                                                <text  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor,marginBottom:'5px'}">个</text>
                                            </div>
                                        </div>
                                        <div class="orderContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">昨日流水</text>
                                            <div class="orderNum">
                                                <text  :style="{fontSize:GLOBAL.biggestFS,color:GLOBAL.tColor}">{{newCou.lastPay}}</text>
                                                <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor,marginBottom:'5px'}">元</text>
                                            </div>
                                        </div>
                                        <div class="orderContent">
                                            <text class=" orderTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">总计流水</text>
                                            <div class="orderNum">
                                                <text  :style="{fontSize:GLOBAL.biggestFS,color:GLOBAL.tColor}">{{newCou.allPay}}</text>
                                                <text  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor,marginBottom:'5px'}">元</text>
                                            </div>
                                        </div>
                                    </div>
                                    <div class=" activeDatails">
                                        <!--<div class="datailsContent">-->
                                        <!--<text class="orderTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">活动类型：</text>-->
                                        <!--<text class="orderTitleWidth" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">新客立减</text>-->
                                        <!--</div>-->
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">开始时间：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{newCou.startTime}} 00:00:00</text>
                                        </div>
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">结束时间：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{newCou.endTime}} 23:59:59</text>
                                        </div>
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">活动规则：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">新客户立减首单{{newCou.newCou}}元</text>
                                        </div>
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">创建时间：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{newCou.createTime}}</text>
                                        </div>
                                    </div>
                                    <div class="cancelCell">
                                        <wxc-button class="cancelButton" text="撤销" :textStyle="cancelStyle"
                                                    :btn-style="cancelBtnStyle"
                                                    @wxcButtonClicked="del(1,index)"></wxc-button>
                                    </div>
                                </div>

                                <!--积分活动-->
                                <div  v-if="integral.length>0">
                                    <text class="endTitle" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.tColor}">积分活动</text>
                                </div>
                                <div class="timeListCell" v-if="integral.length>0" v-for="(item,index) in integral" :key="index">
                                    <div class="listContent timeCellName">
                                        <text class="endTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">积分活动</text>
                                        <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.WaitUp?'待上线':'进行中'}}</text>
                                    </div>
                                    <div class="listContent activeOrder">
                                        <div class="orderContent">
                                            <text class=" orderTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">昨日使用积分</text>
                                            <div class="orderNum">
                                                <text  :style="{fontSize:GLOBAL.biggestFS,color:GLOBAL.tColor}">{{item.lastCount}}分</text>
                                                <!--<text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor,marginBottom:'5px'}">个</text>-->
                                            </div>
                                        </div>
                                        <div class="orderContent">
                                            <text class=" orderTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">总计使用积分</text>
                                            <div class="orderNum">
                                                <text  :style="{fontSize:GLOBAL.biggestFS,color:GLOBAL.tColor}">{{item.allCount}}分</text>
                                                <!--<text  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor,marginBottom:'5px'}">个</text>-->
                                            </div>
                                        </div>
                                    </div>
                                    <div class=" activeDatails">
                                        <!--<div class="datailsContent">-->
                                        <!--<text class="orderTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">活动类型：</text>-->
                                        <!--<text class="orderTitleWidth" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">积分活动</text>-->
                                        <!--</div>-->
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">开始时间：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.startTime}} 00:00:00</text>
                                        </div>
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">结束时间：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.endTime}} 23:59:59</text>
                                        </div>
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">活动规则：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">赠送积分为订单金额的{{item.invoiceRemarks}}%,1积分等于{{item.invoiceRemarkstrD}}元</text>
                                        </div>
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">创建时间：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.createTime}}</text>
                                        </div>
                                    </div>
                                    <div class="cancelCell">
                                        <wxc-button class="cancelButton" text="撤销" :textStyle="cancelStyle"
                                                    :btn-style="cancelBtnStyle"
                                                    @wxcButtonClicked="del(11,index)"></wxc-button>
                                    </div>
                                </div>

                                <!--优惠卷活动-->
                                <!--<div v-if="coupon.length>0">-->
                                <!--<text class="endTitle" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.tColor}">优惠卷活动</text>-->
                                <!--</div>-->
                                <!--<div class="timeListCell" v-if="coupon.length>0" v-for="(item,index) in coupon">-->
                                <!--<div class="listContent timeCellName">-->
                                <!--<text class="endTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">优惠卷活动</text>-->
                                <!--<text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.WaitUp?'待上线':'进行中'}}</text>-->
                                <!--</div>-->
                                <!--<div class="listContent activeOrder">-->
                                <!--<div class="orderContent">-->
                                <!--<text class="orderTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">昨日订单</text>-->
                                <!--<div class="orderNum">-->
                                <!--<text  :style="{fontSize:GLOBAL.biggestFS,color:GLOBAL.tColor}">{{item.lastCount}}</text>-->
                                <!--<text  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor,marginBottom:'5px'}">个</text>-->
                                <!--</div>-->
                                <!--</div>-->
                                <!--<div class="orderContent">-->
                                <!--<text class="orderTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">总计订单</text>-->
                                <!--<div class="orderNum">-->
                                <!--<text  :style="{fontSize:GLOBAL.biggestFS,color:GLOBAL.tColor}">{{item.allCount}}</text>-->
                                <!--<text  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor,marginBottom:'5px'}">个</text>-->
                                <!--</div>-->
                                <!--</div>-->
                                <!--<div class="orderContent">-->
                                <!--<text class="orderTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">昨日流水</text>-->
                                <!--<div class="orderNum">-->
                                <!--<text  :style="{fontSize:GLOBAL.biggestFS,color:GLOBAL.tColor}">{{item.lastPay}}</text>-->
                                <!--<text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor,marginBottom:'5px'}">元</text>-->
                                <!--</div>-->
                                <!--</div>-->
                                <!--<div class="orderContent">-->
                                <!--<text class="orderTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">总计流水</text>-->
                                <!--<div class="orderNum">-->
                                <!--<text  :style="{fontSize:GLOBAL.biggestFS,color:GLOBAL.tColor}">{{item.allPay}}</text>-->
                                <!--<text  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor,marginBottom:'5px'}">元</text>-->
                                <!--</div>-->
                                <!--</div>-->
                                <!--</div>-->
                                <!--<div class=" activeDatails">-->
                                <!--&lt;!&ndash;<div class="datailsContent">&ndash;&gt;-->
                                <!--&lt;!&ndash;<text class="orderTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">活动类型：</text>&ndash;&gt;-->
                                <!--&lt;!&ndash;<text class="orderTitleWidth" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">优惠卷活动</text>&ndash;&gt;-->
                                <!--&lt;!&ndash;</div>&ndash;&gt;-->
                                <!--<div class="datailsContent">-->
                                <!--<text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">活动规则：</text>-->
                                <!--<text class="orderTitleWidth" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">满{{item.spendMoney}}减{{item.couponMoney}}优惠卷</text>-->
                                <!--</div>-->
                                <!--<div class="datailsContent">-->
                                <!--<text class=" orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">开始时间：</text>-->
                                <!--<text class="orderTitleWidth" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.sendStartTime}}</text>-->
                                <!--</div>-->
                                <!--<div class="datailsContent">-->
                                <!--<text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">结束时间：</text>-->
                                <!--<text class="orderTitleWidth" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.sendEndTime}}</text>-->
                                <!--</div>-->
                                <!--</div>-->
                                <!--<div class="cancelCell">-->
                                <!--<wxc-button class="cancelButton" text="撤销" :textStyle="cancelStyle"-->
                                <!--:btn-style="cancelBtnStyle"-->
                                <!--@wxcButtonClicked="del(2,index)"></wxc-button>-->
                                <!--</div>-->
                                <!--</div>-->

                                <!--折扣活动-->
                                <div v-if="zk.length>0">
                                    <text class="endTitle" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.tColor}">折扣活动</text>
                                </div>
                                <div class="timeListCell" v-if="zk.length>0" v-for="(item,index) in zk">
                                    <div class="listContent timeCellName">
                                        <text class="endTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">折扣活动</text>
                                        <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.WaitUp?'待上线':'进行中'}}</text>
                                    </div>
                                    <div class="listContent activeOrder">
                                        <div class="orderContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.bigFS,color:'#999'}">库存</text>
                                            <div class="orderNum">
                                                <text  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor,marginBottom:'5px'}" v-if="item.goodsStock!=-1">剩</text>
                                                <text  :style="{fontSize:item.goodsStock===-1?GLOBAL.biggerFS:GLOBAL.biggestFS,color:GLOBAL.tColor,marginBottom:item.goodsStock===-1?'5px':''}">{{item.goodsStock==-1?'无限':item.goodsStock}}</text>
                                                <!--<text  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor}">元</text>-->
                                            </div>
                                        </div>
                                        <div class="orderContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.bigFS,color:'#999'}">昨日订单</text>
                                            <div class="orderNum">
                                                <text  :style="{fontSize:GLOBAL.biggestFS,color:GLOBAL.tColor}">{{item.lastCount}}</text>
                                                <text  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor,marginBottom:'5px'}">个</text>
                                            </div>
                                        </div>
                                        <div class="orderContent">
                                            <text class=" orderTitle" :style="{fontSize:GLOBAL.bigFS,color:'#999'}">总计订单</text>
                                            <div class="orderNum">
                                                <text  :style="{fontSize:GLOBAL.biggestFS,color:GLOBAL.tColor}">{{item.allCount}}</text>
                                                <text  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor,marginBottom:'5px'}">个</text>
                                            </div>
                                        </div>
                                        <!--<div class="orderContent">-->
                                        <!--<text class="orderTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">昨日流水</text>-->
                                        <!--<div class="orderNum">-->
                                        <!--<text  :style="{fontSize:GLOBAL.biggestFS,color:GLOBAL.tColor}">{{item.lastPay}}</text>-->
                                        <!--<text  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor}">元</text>-->
                                        <!--</div>-->
                                        <!--</div>-->
                                        <div class="orderContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.bigFS,color:'#999'}">总计流水</text>
                                            <div class="orderNum">
                                                <text  :style="{fontSize:GLOBAL.biggestFS,color:GLOBAL.tColor}">{{item.allPay}}</text>
                                                <text  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor,marginBottom:'5px'}">元</text>
                                            </div>
                                        </div>
                                    </div>
                                    <div class=" activeDatails">
                                        <!--<div class="datailsContent">-->
                                        <!--<text class="orderTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">活动类型：</text>-->
                                        <!--<text class="orderTitleWidth" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">折扣活动</text>-->
                                        <!--</div>-->
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">活动规则：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">折扣商品不享受其他优惠活动</text>
                                        </div>
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">开始时间：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.startTime}} 00:00:00</text>
                                        </div>
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">结束时间：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.endTime}} 23:59:59</text>
                                        </div>
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">活动商品：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.goodsName}}</text>
                                        </div>
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">活动折扣：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.discount}}折</text>
                                        </div>
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">折后价格：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.discountPrice}}元</text>
                                        </div>
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">优惠数量：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">每单最多{{item.buyNum}}份</text>
                                        </div>
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">创建时间：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.createTime}}</text>
                                        </div>
                                    </div>
                                    <div class="cancelCell">
                                        <wxc-button class="cancelButton" text="撤销" :textStyle="cancelStyle"
                                                    :btn-style="cancelBtnStyle"
                                                    @wxcButtonClicked="del(3,index)"></wxc-button>
                                    </div>
                                </div>

                                <!--满减活动-->
                                <div v-if="mjYouHui.length>0">
                                    <text class="endTitle" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.tColor}">满减活动</text>
                                </div>
                                <div class="timeListCell" v-if="mjYouHui.length>0" v-for="(item,index) in mjYouHui">
                                    <div class="listContent timeCellName">
                                        <text class="endTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">满减活动</text>
                                        <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.WaitUp?'待上线':'进行中'}}</text>
                                    </div>
                                    <div class="listContent activeOrder">
                                        <div class="orderContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.bigFS,color:'#999'}">昨日订单</text>
                                            <div class="orderNum">
                                                <text :style="{fontSize:GLOBAL.biggestFS,color:GLOBAL.tColor}">{{item.lastCount}}</text>
                                                <text  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor,marginBottom:'5px'}">个</text>
                                            </div>
                                        </div>
                                        <div class="orderContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.bigFS,color:'#999'}">总计订单</text>
                                            <div class="orderNum">
                                                <text :style="{fontSize:GLOBAL.biggestFS,color:GLOBAL.tColor}">{{item.allCount}}</text>
                                                <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor,marginBottom:'5px'}">个</text>
                                            </div>
                                        </div>
                                        <div class="orderContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.bigFS,color:'#999'}">昨日流水</text>
                                            <div class="orderNum">
                                                <text :style="{fontSize:GLOBAL.biggestFS,color:GLOBAL.tColor}">{{item.lastPay}}</text>
                                                <text  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor,marginBottom:'5px'}">元</text>
                                            </div>
                                        </div>
                                        <div class="orderContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.bigFS,color:'#999'}">总计流水</text>
                                            <div class="orderNum">
                                                <text  :style="{fontSize:GLOBAL.biggestFS,color:GLOBAL.tColor}">{{item.allPay}}</text>
                                                <text  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor,marginBottom:'5px'}">元</text>
                                            </div>
                                        </div>
                                    </div>
                                    <div class=" activeDatails">
                                        <!--<div class="datailsContent">-->
                                        <!--<text class="orderTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">活动类型：</text>-->
                                        <!--<text class="orderTitleWidth" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">满减活动</text>-->
                                        <!--</div>-->
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">活动规则：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.val}}</text>
                                        </div>
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">开始时间：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.startTime}} 00:00:00</text>
                                        </div>
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">结束时间：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.endTime}} 23:59:59</text>
                                        </div>
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">创建时间：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.createTime}}</text>
                                        </div>
                                    </div>
                                    <div class="cancelCell">
                                        <wxc-button class="cancelButton" text="撤销" :textStyle="cancelStyle"
                                                    :btn-style="cancelBtnStyle"
                                                    @wxcButtonClicked="del(4,index)"></wxc-button>
                                    </div>
                                </div>

                                <!--买赠活动-->
                                <div v-if="fullGift.length>0">
                                    <text class="endTitle" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.tColor}">买赠活动</text>
                                </div>
                                <div class="timeListCell" v-if="fullGift.length>0" v-for="(item,index) in fullGift">

                                    <div class="listContent timeCellName">
                                        <text class="endTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">买赠活动</text>
                                        <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.WaitUp?'待上线':'进行中'}}</text>
                                    </div>

                                    <div class="listContent activeOrder">
                                        <div class="orderContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.bigFS,color:'#999'}">库存</text>
                                            <div class="orderNum">
                                                <text  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor,marginBottom:'5px'}" v-if="item.goodsStock!=-1">剩</text>
                                                <text  :style="{fontSize:item.goodsStock===-1?GLOBAL.biggerFS:GLOBAL.biggestFS,color:GLOBAL.tColor,marginBottom:item.goodsStock===-1?'5px':''}">{{item.goodsStock==-1?'无限':item.goodsStock}}</text>
                                                <!--<text  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor}">元</text>-->
                                            </div>
                                        </div>
                                        <div class="orderContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.bigFS,color:'#999'}">昨日订单</text>
                                            <div class="orderNum">
                                                <text  :style="{fontSize:GLOBAL.biggestFS,color:GLOBAL.tColor}">{{item.lastCount}}</text>
                                                <text  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor,marginBottom:'5px'}">个</text>
                                            </div>
                                        </div>
                                        <div class="orderContent">
                                            <text class=" orderTitle" :style="{fontSize:GLOBAL.bigFS,color:'#999'}">总计订单</text>
                                            <div class="orderNum">
                                                <text  :style="{fontSize:GLOBAL.biggestFS,color:GLOBAL.tColor}">{{item.allCount}}</text>
                                                <text  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor,marginBottom:'5px'}">个</text>
                                            </div>
                                        </div>
                                        <!--<div class="orderContent">-->
                                        <!--<text class="orderTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">昨日流水</text>-->
                                        <!--<div class="orderNum">-->
                                        <!--<text  :style="{fontSize:GLOBAL.biggestFS,color:GLOBAL.tColor}">{{item.lastPay}}</text>-->
                                        <!--<text  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor}">元</text>-->
                                        <!--</div>-->
                                        <!--</div>-->
                                        <div class="orderContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.bigFS,color:'#999'}">总计流水</text>
                                            <div class="orderNum">
                                                <text  :style="{fontSize:GLOBAL.biggestFS,color:GLOBAL.tColor}">{{item.allPay}}</text>
                                                <text  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor,marginBottom:'5px'}">元</text>
                                            </div>
                                        </div>

                                    </div>
                                    <div class=" activeDatails">
                                        <!--<div class="datailsContent">-->
                                        <!--<text class="orderTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">活动类型：</text>-->
                                        <!--<text class="orderTitleWidth" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">买赠活动</text>-->
                                        <!--</div>-->
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">活动规则：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">买赠商品不享受其他优惠活动</text>
                                        </div>
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">开始时间：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.start_time}} 00:00:00</text>
                                        </div>
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">结束时间：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.end_time}} 23:59:59</text>
                                        </div>
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">活动详情：</text>
                                            <div style="flex-direction: column">
                                                <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">买{{item.buy_num}}份{{item.buy_goods.goodsName}}</text>
                                                <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">赠送{{item.gift_num}}份{{item.gift_goods.goodsName}}</text>
                                            </div>
                                        </div>
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">创建时间：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.createTime}}</text>
                                        </div>
                                    </div>
                                    <div class="cancelCell">
                                        <wxc-button class="cancelButton" text="撤销" :textStyle="cancelStyle"
                                                    :btn-style="cancelBtnStyle"
                                                    @wxcButtonClicked="del(10,index)"></wxc-button>
                                    </div>
                                </div>

                                <!--团购活动-->
                                <div v-if="tk.length>0">
                                    <text class="endTitle" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.tColor}">团购活动</text>
                                </div>
                                <div class="timeListCell" v-if="tk.length>0" v-for="(item,index) in tk">
                                    <div class="listContent timeCellName">
                                        <text class="endTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">团购活动</text>
                                        <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.WaitUp?'待上线':'进行中'}}</text>
                                    </div>
                                    <div class="listContent activeOrder">

                                        <div class="orderContent">
                                            <text class=" orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">库存</text>
                                            <div class="orderNum">
                                                <text  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor,marginBottom:'5px'}" v-if="item.goodsStock!=-1">剩</text>
                                                <text  :style="{fontSize:item.goodsStock===-1?GLOBAL.biggerFS:GLOBAL.biggestFS,color:GLOBAL.tColor,marginBottom:item.goodsStock===-1?'5px':''}">{{item.goodsStock==-1?'无限':item.goodsStock}}</text>
                                            </div>
                                        </div>

                                        <div class="orderContent">
                                            <text class=" orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">销量</text>
                                            <div class="orderNum">
                                                <text  :style="{fontSize:GLOBAL.biggestFS,color:GLOBAL.tColor}">{{item.sale}}</text>
                                            </div>
                                        </div>

                                        <div class="orderContent">
                                            <text class=" orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">预计收入</text>
                                            <div class="orderNum">
                                                <text  :style="{fontSize:GLOBAL.biggestFS,color:GLOBAL.tColor}">{{item.totalPay}}</text>
                                                <text  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor,marginBottom:'5px'}">元</text>
                                            </div>
                                        </div>

                                        <div class="orderContent">
                                            <text class=" orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">已收入</text>
                                            <div class="orderNum">
                                                <text  :style="{fontSize:GLOBAL.biggestFS,color:GLOBAL.tColor}">{{item.allPay}}</text>
                                                <text  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor,marginBottom:'5px'}">元</text>
                                            </div>
                                        </div>

                                    </div>
                                    <div class=" activeDatails">
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">活动名称：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.groupName}}</text>
                                        </div>
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">活动规则：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">团购商品不享受其他优惠活动</text>
                                        </div>
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">开始时间：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.startTime}} 00:00:00</text>
                                        </div>
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">结束时间：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.endTime}} 23:59:59</text>
                                        </div>
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">活动商品：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.name}}</text>
                                        </div>
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">不可使用日期：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.useData?item.useData:'未设置不可使用日期'}}</text>
                                        </div>
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">使用时间：</text>
                                            <text  :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}" v-for="(i,k) in item.dataList">{{i.start}}-{{i.end}}{{k!=item.dataList.length-1?',':''}}</text>
                                        </div>
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">创建时间：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.createTime}}</text>
                                        </div>
                                    </div>
                                    <div class="cancelCell">
                                        <wxc-button class="cancelButton" text="撤销" :textStyle="cancelStyle"
                                                    :btn-style="cancelBtnStyle"
                                                    @wxcButtonClicked="del(5,index)"></wxc-button>
                                    </div>
                                </div>

                                <!--红包活动-->
                                <div v-if="hongbao.length>0">
                                    <text class="endTitle" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.tColor}">红包活动</text>
                                </div>
                                <div class="timeListCell" v-if="hongbao.length>0" v-for="(item,index) in hongbao">
                                    <div class="listContent timeCellName">
                                        <text class="endTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">红包活动</text>
                                        <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.WaitUp?'待上线':'进行中'}}</text>
                                    </div>

                                    <div class="listContent activeOrder">
                                        <div class="orderContent">
                                            <text class=" orderTitle" :style="{fontSize:GLOBAL.bigFS,color:'#999'}">昨日订单</text>
                                            <div class="orderNum">
                                                <text  :style="{fontSize:GLOBAL.biggestFS,color:GLOBAL.tColor}">{{item.lastCount}}</text>
                                                <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor,marginBottom:'5px'}">个</text>
                                            </div>
                                        </div>
                                        <div class="orderContent">
                                            <text class=" orderTitle" :style="{fontSize:GLOBAL.bigFS,color:'#999'}">总计订单</text>
                                            <div class="orderNum">
                                                <text  :style="{fontSize:GLOBAL.biggestFS,color:GLOBAL.tColor}">{{item.allCount}}</text>
                                                <text  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor,marginBottom:'5px'}">个</text>
                                            </div>
                                        </div>
                                        <div class="orderContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.bigFS,color:'#999'}">昨日流水</text>
                                            <div class="orderNum">
                                                <text  :style="{fontSize:GLOBAL.biggestFS,color:GLOBAL.tColor}">{{item.lastPay}}</text>
                                                <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor,marginBottom:'5px'}">元</text>
                                            </div>
                                        </div>
                                        <div class="orderContent">
                                            <text class=" orderTitle" :style="{fontSize:GLOBAL.bigFS,color:'#999'}">总计流水</text>
                                            <div class="orderNum">
                                                <text  :style="{fontSize:GLOBAL.biggestFS,color:GLOBAL.tColor}">{{item.allPay}}</text>
                                                <text  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor,marginBottom:'5px'}">元</text>
                                            </div>
                                        </div>
                                    </div>

                                    <div class=" activeDatails">
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">活动名称：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.piece}}元红包</text>
                                        </div>
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">活动规则：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">满{{item.money}}元减{{item.piece}}元红包</text>
                                        </div>
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">开始时间：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.startTime}} 00:00:00</text>
                                        </div>
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">结束时间：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.endTime}} 23:59:59</text>
                                        </div>
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">创建时间：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.createTime}}</text>
                                        </div>
                                    </div>
                                    <div class="cancelCell">
                                        <wxc-button class="cancelButton" text="撤销" :textStyle="cancelStyle"
                                                    :btn-style="cancelBtnStyle"
                                                    @wxcButtonClicked="del(6,index)"></wxc-button>
                                    </div>
                                </div>

                                <!--砍价活动-->

                                <!--<div class="timeListCell" v-if="bargain.length>0" v-for="(item,index) in bargain">-->
                                <!--<div class="listContent timeCellName">-->
                                <!--<text class="endTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">砍价活动</text>-->
                                <!--<text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.WaitUp?'待上线':'进行中'}}</text>-->
                                <!--</div>-->
                                <!--<div class="listContent activeOrder">-->
                                <!--<div class="orderContent">-->
                                <!--<text class="orderTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">昨日订单</text>-->
                                <!--<div class="orderNum">-->
                                <!--<text  :style="{fontSize:GLOBAL.biggestFS,color:GLOBAL.tColor}">{{item.lastCount}}</text>-->
                                <!--<text  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor}">个</text>-->
                                <!--</div>-->
                                <!--</div>-->
                                <!--<div class="orderContent">-->
                                <!--<text class="orderTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">总计订单</text>-->
                                <!--<div class="orderNum">-->
                                <!--<text  :style="{fontSize:GLOBAL.biggestFS,color:GLOBAL.tColor}">{{item.allCount}}</text>-->
                                <!--<text  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor}">个</text>-->
                                <!--</div>-->
                                <!--</div>-->
                                <!--<div class="orderContent">-->
                                <!--<text class="orderTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">昨日流水</text>-->
                                <!--<div class="orderNum">-->
                                <!--<text  :style="{fontSize:GLOBAL.biggestFS,color:GLOBAL.tColor}">{{item.lastPay}}</text>-->
                                <!--<text  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor}">元</text>-->
                                <!--</div>-->
                                <!--</div>-->
                                <!--<div class="orderContent">-->
                                <!--<text class="orderTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">总计流水</text>-->
                                <!--<div class="orderNum">-->
                                <!--<text  :style="{fontSize:GLOBAL.biggestFS,color:GLOBAL.tColor}">{{item.allPay}}</text>-->
                                <!--<text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor}">元</text>-->
                                <!--</div>-->
                                <!--</div>-->
                                <!--</div>-->
                                <!--<div class=" activeDatails">-->
                                <!--&lt;!&ndash;<div class="datailsContent">&ndash;&gt;-->
                                <!--&lt;!&ndash;<text class="orderTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">活动类型：</text>&ndash;&gt;-->
                                <!--&lt;!&ndash;<text class="orderTitleWidth" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">砍价活动</text>&ndash;&gt;-->
                                <!--&lt;!&ndash;</div>&ndash;&gt;-->
                                <!--<div class="datailsContent">-->
                                <!--<text class="orderTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">活动规则：</text>-->
                                <!--<text class="orderTitleWidth" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">砍价商品不享受其他优惠活动</text>-->
                                <!--</div>-->
                                <!--<div class="datailsContent">-->
                                <!--<text class="orderTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">开始时间：</text>-->
                                <!--<text class="orderTitleWidth" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.startTime}}</text>-->
                                <!--</div>-->
                                <!--<div class="datailsContent">-->
                                <!--<text class="orderTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">结束时间：</text>-->
                                <!--<text class="orderTitleWidth" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.endTime}}</text>-->
                                <!--</div>-->
                                <!--<div class="datailsContent">-->
                                <!--<text class="orderTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">活动商品：</text>-->
                                <!--<text class="orderTitleWidth" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.name}}</text>-->
                                <!--</div>-->

                                <!--</div>-->
                                <!--<div class="cancelCell">-->
                                <!--<wxc-button class="cancelButton" text="撤销" :textStyle="cancelStyle"-->
                                <!--:btn-style="cancelBtnStyle"-->
                                <!--@wxcButtonClicked="del(7,index)"></wxc-button>-->
                                <!--</div>-->
                                <!--</div>-->

                                <!--秒杀活动-->

                                <!--<div class="timeListCell" v-if="seckill.length>0" v-for="(item,index) in seckill">-->
                                <!--<div class="listContent timeCellName">-->
                                <!--<text class="endTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">秒杀活动</text>-->
                                <!--<text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.WaitUp?'待上线':'进行中'}}</text>-->
                                <!--</div>-->
                                <!--<div class="listContent activeOrder">-->
                                <!--<div class="orderContent">-->
                                <!--<text class="orderTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">昨日订单</text>-->
                                <!--<div class="orderNum">-->
                                <!--<text  :style="{fontSize:GLOBAL.biggestFS,color:GLOBAL.tColor}">{{item.lastCount}}</text>-->
                                <!--<text  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor}">个</text>-->
                                <!--</div>-->
                                <!--</div>-->
                                <!--<div class="orderContent">-->
                                <!--<text class="orderTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">总计订单</text>-->
                                <!--<div class="orderNum">-->
                                <!--<text  :style="{fontSize:GLOBAL.biggestFS,color:GLOBAL.tColor}">{{item.allCount}}</text>-->
                                <!--<text  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor}">个</text>-->
                                <!--</div>-->
                                <!--</div>-->
                                <!--<div class="orderContent">-->
                                <!--<text class="orderTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">昨日流水</text>-->
                                <!--<div class="orderNum">-->
                                <!--<text :style="{fontSize:GLOBAL.biggestFS,color:GLOBAL.tColor}">{{item.lastPay}}</text>-->
                                <!--<text  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor}">元</text>-->
                                <!--</div>-->
                                <!--</div>-->
                                <!--<div class="orderContent">-->
                                <!--<text class="orderTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">总计流水</text>-->
                                <!--<div class="orderNum">-->
                                <!--<text  :style="{fontSize:GLOBAL.biggestFS,color:GLOBAL.tColor}">{{item.allPay}}</text>-->
                                <!--<text  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor}">元</text>-->
                                <!--</div>-->
                                <!--</div>-->
                                <!--</div>-->
                                <!--<div class=" activeDatails">-->
                                <!--&lt;!&ndash;<div class="datailsContent">&ndash;&gt;-->
                                <!--&lt;!&ndash;<text class=" orderTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">活动类型：</text>&ndash;&gt;-->
                                <!--&lt;!&ndash;<text class="orderTitleWidth" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">秒杀活动</text>&ndash;&gt;-->
                                <!--&lt;!&ndash;</div>&ndash;&gt;-->
                                <!--<div class="datailsContent">-->
                                <!--<text class="orderTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">活动规则：</text>-->
                                <!--<text class="orderTitleWidth" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">秒杀商品不享受其他优惠活动</text>-->
                                <!--</div>-->
                                <!--<div class="datailsContent">-->
                                <!--<text class="orderTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">开始时间：</text>-->
                                <!--<text class="orderTitleWidth" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.startTime}}</text>-->
                                <!--</div>-->
                                <!--<div class="datailsContent">-->
                                <!--<text class="orderTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">结束时间：</text>-->
                                <!--<text class="orderTitleWidth" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.endTime}}</text>-->
                                <!--</div>-->
                                <!--<div class="datailsContent">-->
                                <!--<text class="orderTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">活动商品：</text>-->
                                <!--<text class="orderTitleWidth" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.name}}</text>-->
                                <!--</div>-->
                                <!--</div>-->
                                <!--<div class="cancelCell">-->
                                <!--<wxc-button class="cancelButton" text="撤销" :textStyle="cancelStyle"-->
                                <!--:btn-style="cancelBtnStyle"-->
                                <!--@wxcButtonClicked="del(8,index)"></wxc-button>-->
                                <!--</div>-->
                                <!--</div>-->

                                <!--代金券活动-->
                                <div v-if="voucher.length>0">
                                    <text class="endTitle" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.tColor}">代金券活动</text>
                                </div>
                                <div class="timeListCell" v-if="voucher.length>0" v-for="(item,index) in voucher">
                                    <div class="listContent timeCellName">
                                        <text class="endTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">代金券活动</text>
                                        <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.WaitUp?'待上线':'进行中'}}</text>
                                    </div>

                                    <div class="listContent activeOrder">
                                        <div class="orderContent">
                                            <text class=" orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">库存</text>
                                            <div class="orderNum">
                                                <text  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor,marginBottom:'5px'}" v-if="item.goodsStock!=-1">剩</text>
                                                <text  :style="{fontSize:item.goodsStock===-1?GLOBAL.biggerFS:GLOBAL.biggestFS,color:GLOBAL.tColor,marginBottom:item.goodsStock===-1?'5px':''}">{{item.goodsStock==-1?'无限':item.goodsStock}}</text>
                                            </div>
                                        </div>

                                        <div class="orderContent">
                                            <text class=" orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">销量</text>
                                            <div class="orderNum">
                                                <text  :style="{fontSize:GLOBAL.biggestFS,color:GLOBAL.tColor}">{{item.sale}}</text>
                                            </div>
                                        </div>

                                        <div class="orderContent">
                                            <text class=" orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">预计收入</text>
                                            <div class="orderNum">
                                                <text  :style="{fontSize:GLOBAL.biggestFS,color:GLOBAL.tColor}">{{item.totalPay}}</text>
                                                <text  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor,marginBottom:'5px'}">元</text>
                                            </div>
                                        </div>

                                        <div class="orderContent">
                                            <text class=" orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">已收入</text>
                                            <div class="orderNum">
                                                <text  :style="{fontSize:GLOBAL.biggestFS,color:GLOBAL.tColor}">{{item.allPay}}</text>
                                                <text  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor,marginBottom:'5px'}">元</text>
                                            </div>
                                        </div>
                                    </div>

                                    <div class=" activeDatails">
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">活动名称：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.marketPrice}}元代金券</text>
                                        </div>
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">活动规则：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.groupName}}</text>
                                        </div>
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">开始时间：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.startTime}} 00:00:00</text>
                                        </div>
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">结束时间：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.endTime}} 23:59:59</text>
                                        </div>
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">不可使用日期：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.useData?item.useData:'未设置不可使用日期'}}</text>
                                        </div>
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">使用时间：</text>
                                            <text  :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}" v-for="(i,k) in item.dataList">{{i.start}}-{{i.end}}{{k!=item.dataList.length-1?',':''}}</text>
                                        </div>
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">创建时间：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.createTime}}</text>
                                        </div>
                                    </div>
                                    <div class="cancelCell">
                                        <wxc-button class="cancelButton" text="撤销" :textStyle="cancelStyle"
                                                    :btn-style="cancelBtnStyle"
                                                    @wxcButtonClicked="del(9,index)"></wxc-button>
                                    </div>
                                </div>
                            </div>
                            <noOrder v-if="!res" img="https://image.aftdc.com/appBimg/icon_no_order.png" textOne="暂无进行中活动" textTwo=""></noOrder>


                        </scroller>
                        <!--*********进行中*******-->


                        <!--*********已结束*******-->
                        <scroller class="listHeight" show-scrollbar="false">

                            <div v-if="resEnd">
                                <!--新客立减-->
                                <div v-if="endnc.length>0">
                                    <text class="endTitle" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.tColor}">新客立减活动</text>
                                </div>
                                <div class="timeListCell" v-if="endnc.length>0" ref="box" v-for="(item,index) in endnc" :key="index">
                                    <div class="listContent timeCellName">
                                        <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">新客立减活动</text>
                                        <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">已结束</text>
                                    </div>
                                    <div class="listContent activeOrder">
                                        <div class="orderContent">
                                            <text class=" orderTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">昨日订单</text>
                                            <div class="orderNum">
                                                <text  :style="{fontSize:GLOBAL.biggestFS,color:GLOBAL.tColor}">{{item.lastCount}}</text>
                                                <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor,marginBottom:'5px'}">个</text>
                                            </div>
                                        </div>
                                        <div class="orderContent">
                                            <text class=" orderTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">总计订单</text>
                                            <div class="orderNum">
                                                <text  :style="{fontSize:GLOBAL.biggestFS,color:GLOBAL.tColor}">{{item.allCount}}</text>
                                                <text  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor,marginBottom:'5px'}">个</text>
                                            </div>
                                        </div>
                                        <div class="orderContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">昨日流水</text>
                                            <div class="orderNum">
                                                <text  :style="{fontSize:GLOBAL.biggestFS,color:GLOBAL.tColor}">{{item.lastPay}}</text>
                                                <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor,marginBottom:'5px'}">元</text>
                                            </div>
                                        </div>
                                        <div class="orderContent">
                                            <text class=" orderTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">总计流水</text>
                                            <div class="orderNum">
                                                <text  :style="{fontSize:GLOBAL.biggestFS,color:GLOBAL.tColor}">{{item.allPay}}</text>
                                                <text  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor,marginBottom:'5px'}">元</text>
                                            </div>
                                        </div>
                                    </div>
                                    <div class=" activeDatails">
                                        <!--<div class="datailsContent">-->
                                        <!--<text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">活动规则：</text>-->
                                        <!--<text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">折扣商品不享受其他优惠活动</text>-->
                                        <!--</div>-->
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">开始时间：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.startTime}} 00:00:00</text>
                                        </div>
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">结束时间：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.endTime}} 23:59:59</text>
                                        </div>
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">活动规则：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">新客户立减首单{{item.newCou}}元</text>
                                        </div>
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">创建时间：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.createTime}}</text>
                                        </div>
                                        <div class="datailsContent" v-if="item.cancelTime">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">撤销时间：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.cancelTime}}</text>
                                        </div>
                                    </div>
                                </div>

                                <!--积分活动-->
                                <div v-if="endjf.length>0">
                                    <text class="endTitle" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.tColor}">积分活动</text>
                                </div>
                                <div class="timeListCell" v-if="endjf.length>0" ref="box" v-for="(item,index) in endjf" :key="index">

                                    <div class="listContent timeCellName">
                                        <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">积分活动</text>
                                        <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">已结束</text>
                                    </div>

                                    <div class="listContent activeOrder">
                                        <div class="orderContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.bigFS,color:'#999'}">昨日使用积分</text>
                                            <div class="orderNum">
                                                <text  :style="{fontSize:GLOBAL.biggestFS,color:GLOBAL.tColor}">{{item.lastCount}}</text>
                                                <text  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor,marginBottom:'5px'}">分</text>
                                            </div>
                                        </div>
                                        <div class="orderContent">
                                            <text class=" orderTitle" :style="{fontSize:GLOBAL.bigFS,color:'#999'}">总计使用积分</text>
                                            <div class="orderNum">
                                                <text  :style="{fontSize:GLOBAL.biggestFS,color:GLOBAL.tColor}">{{item.allCount}}</text>
                                                <text  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor,marginBottom:'5px'}">分</text>
                                            </div>
                                        </div>
                                    </div>

                                    <div class=" activeDatails">
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">开始时间：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.startTime}} 00:00:00</text>
                                        </div>
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">结束时间：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.endTime}} 23:59:59</text>
                                        </div>
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">活动规则：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">赠送积分为订单金额的{{item.invoiceRemarks}},1积分等于{{item.invoiceRemarkstrD}}元</text>
                                        </div>
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">创建时间：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.createTime}}</text>
                                        </div>
                                        <div class="datailsContent" v-if="item.cancelTime">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">撤销时间：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.cancelTime}}</text>
                                        </div>
                                    </div>

                                </div>

                                <!--折扣活动-->
                                <div v-if="endzk.length>0">
                                    <text class="endTitle" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.tColor}">折扣活动</text>
                                </div>
                                <div class="timeListCell" v-if="endzk.length>0" ref="box" v-for="(item,index) in endzk" :key="index">
                                    <div class="listContent timeCellName">
                                        <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">折扣活动</text>
                                        <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">已结束</text>
                                    </div>
                                    <div class="listContent activeOrder">
                                        <div class="orderContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.bigFS,color:'#999'}">库存</text>
                                            <div class="orderNum">
                                                <text  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor,marginBottom:'5px'}" v-if="item.goodsStock!=-1">剩</text>
                                                <text  :style="{fontSize:item.goodsStock===-1?GLOBAL.biggerFS:GLOBAL.biggestFS,color:GLOBAL.tColor,marginBottom:item.goodsStock===-1?'5px':''}">{{item.goodsStock==-1?'无限':item.goodsStock}}</text>
                                                <!--<text  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor}">元</text>-->
                                            </div>
                                        </div>
                                        <div class="orderContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.bigFS,color:'#999'}">昨日订单</text>
                                            <div class="orderNum">
                                                <text  :style="{fontSize:GLOBAL.biggestFS,color:GLOBAL.tColor}">{{item.lastCount}}</text>
                                                <text  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor,marginBottom:'5px'}">个</text>
                                            </div>
                                        </div>
                                        <div class="orderContent">
                                            <text class=" orderTitle" :style="{fontSize:GLOBAL.bigFS,color:'#999'}">总计订单</text>
                                            <div class="orderNum">
                                                <text  :style="{fontSize:GLOBAL.biggestFS,color:GLOBAL.tColor}">{{item.allCount}}</text>
                                                <text  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor,marginBottom:'5px'}">个</text>
                                            </div>
                                        </div>
                                        <!--<div class="orderContent">-->
                                        <!--<text class="orderTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">昨日流水</text>-->
                                        <!--<div class="orderNum">-->
                                        <!--<text  :style="{fontSize:GLOBAL.biggestFS,color:GLOBAL.tColor}">{{item.lastPay}}</text>-->
                                        <!--<text  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor}">元</text>-->
                                        <!--</div>-->
                                        <!--</div>-->
                                        <div class="orderContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.bigFS,color:'#999'}">总计流水</text>
                                            <div class="orderNum">
                                                <text  :style="{fontSize:GLOBAL.biggestFS,color:GLOBAL.tColor}">{{item.allPay}}</text>
                                                <text  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor,marginBottom:'5px'}">元</text>
                                            </div>
                                        </div>
                                    </div>
                                    <div class=" activeDatails">
                                        <!--<div class="datailsContent">-->
                                        <!--<text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">活动规则：</text>-->
                                        <!--<text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">折扣商品不享受其他优惠活动</text>-->
                                        <!--</div>-->
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">开始时间：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.startTime}} 00:00:00</text>
                                        </div>
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">结束时间：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.endTime}} 23:59:59</text>
                                        </div>
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">活动商品：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.goodsName}}</text>
                                        </div>
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">活动折扣：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.discount}}折</text>
                                        </div>
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">折后价格：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.discountPrice}}元</text>
                                        </div>
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">优惠数量：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">每单最多{{item.buyNum}}份</text>
                                        </div>
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">创建时间：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.createTime}}</text>
                                        </div>
                                        <div class="datailsContent" v-if="item.cancelTime">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">撤销时间：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.cancelTime}}</text>
                                        </div>
                                    </div>
                                </div>

                                <!--满减活动-->
                                <div v-if="endmj.length>0">
                                    <text class="endTitle" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.tColor}">满减活动</text>
                                </div>
                                <div class="timeListCell" v-if="endmj.length>0" v-for="(item,index) in endmj">
                                    <div class="listContent timeCellName">
                                        <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">满减活动</text>
                                        <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">已结束</text>
                                    </div>
                                    <div class="listContent activeOrder">
                                        <div class="orderContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.bigFS,color:'#999'}">昨日订单</text>
                                            <div class="orderNum">
                                                <text :style="{fontSize:GLOBAL.biggestFS,color:GLOBAL.tColor}">{{item.lastCount}}</text>
                                                <text  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor,marginBottom:'5px'}">个</text>
                                            </div>
                                        </div>
                                        <div class="orderContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.bigFS,color:'#999'}">总计订单</text>
                                            <div class="orderNum">
                                                <text :style="{fontSize:GLOBAL.biggestFS,color:GLOBAL.tColor}">{{item.allCount}}</text>
                                                <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor,marginBottom:'5px'}">个</text>
                                            </div>
                                        </div>
                                        <div class="orderContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.bigFS,color:'#999'}">昨日流水</text>
                                            <div class="orderNum">
                                                <text :style="{fontSize:GLOBAL.biggestFS,color:GLOBAL.tColor}">{{item.lastPay}}</text>
                                                <text  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor,marginBottom:'5px'}">元</text>
                                            </div>
                                        </div>
                                        <div class="orderContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.bigFS,color:'#999'}">总计流水</text>
                                            <div class="orderNum">
                                                <text  :style="{fontSize:GLOBAL.biggestFS,color:GLOBAL.tColor}">{{item.allPay}}</text>
                                                <text  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor,marginBottom:'5px'}">元</text>
                                            </div>
                                        </div>
                                    </div>
                                    <div class=" activeDatails">
                                        <!--<div class="datailsContent">-->
                                        <!--<text class="orderTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">活动名称：</text>-->
                                        <!--<text class="orderTitleWidth" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">满减活动</text>-->
                                        <!--</div>-->
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">活动规则：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.val}}</text>
                                        </div>
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">开始时间：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.startTime}} 00:00:00</text>
                                        </div>
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">结束时间：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.endTime}} 23:59:59</text>
                                        </div>
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">创建时间：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.createTime}}</text>
                                        </div>
                                        <div class="datailsContent" v-if="item.cancelTime">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">撤销时间：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.cancelTime}}</text>
                                        </div>
                                    </div>
                                </div>
                                <!--买赠活动-->
                                <div v-if="endFullGift.length>0">
                                    <text class="endTitle" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.tColor}">买赠活动</text>
                                </div>
                                <div class="timeListCell" v-if="endFullGift.length>0" v-for="(item,index) in endFullGift">
                                    <div class="listContent timeCellName">
                                        <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">买赠活动</text>
                                        <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">已结束</text>
                                    </div>
                                    <div class="listContent activeOrder">
                                        <div class="orderContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.bigFS,color:'#999'}">库存</text>
                                            <div class="orderNum">
                                                <text  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor,marginBottom:'5px'}" v-if="item.goodsStock!=-1">剩</text>
                                                <text  :style="{fontSize:item.goodsStock===-1?GLOBAL.biggerFS:GLOBAL.biggestFS,color:GLOBAL.tColor,marginBottom:item.goodsStock===-1?'5px':''}">{{item.goodsStock==-1?'无限':item.goodsStock}}</text>
                                                <!--<text  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor}">元</text>-->
                                            </div>
                                        </div>
                                        <div class="orderContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.bigFS,color:'#999'}">昨日订单</text>
                                            <div class="orderNum">
                                                <text  :style="{fontSize:GLOBAL.biggestFS,color:GLOBAL.tColor}">{{item.lastCount}}</text>
                                                <text  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor,marginBottom:'5px'}">个</text>
                                            </div>
                                        </div>
                                        <div class="orderContent">
                                            <text class=" orderTitle" :style="{fontSize:GLOBAL.bigFS,color:'#999'}">总计订单</text>
                                            <div class="orderNum">
                                                <text  :style="{fontSize:GLOBAL.biggestFS,color:GLOBAL.tColor}">{{item.allCount}}</text>
                                                <text  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor,marginBottom:'5px'}">个</text>
                                            </div>
                                        </div>
                                        <!--<div class="orderContent">-->
                                        <!--<text class="orderTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">昨日流水</text>-->
                                        <!--<div class="orderNum">-->
                                        <!--<text  :style="{fontSize:GLOBAL.biggestFS,color:GLOBAL.tColor}">{{item.lastPay}}</text>-->
                                        <!--<text  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor}">元</text>-->
                                        <!--</div>-->
                                        <!--</div>-->
                                        <div class="orderContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.bigFS,color:'#999'}">总计流水</text>
                                            <div class="orderNum">
                                                <text  :style="{fontSize:GLOBAL.biggestFS,color:GLOBAL.tColor}">{{item.allPay}}</text>
                                                <text  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor,marginBottom:'5px'}">元</text>
                                            </div>
                                        </div>

                                    </div>
                                    <div class=" activeDatails">
                                        <!--<div class="datailsContent">-->
                                        <!--<text class="orderTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">活动类型：</text>-->
                                        <!--<text class="orderTitleWidth" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">买赠活动</text>-->
                                        <!--</div>-->
                                        <!--<div class="datailsContent">-->
                                        <!--<text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">活动规则：</text>-->
                                        <!--<text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">买赠商品不享受其他优惠活动</text>-->
                                        <!--</div>-->
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">开始时间：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.start_time}} 00:00:00</text>
                                        </div>
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">结束时间：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.end_time}} 23:59:59</text>
                                        </div>
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">活动详情：</text>
                                            <div style="flex-direction: column">
                                                <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">买{{item.buy_num}}份{{item.buy_goods.goodsName}}</text>
                                                <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">赠送{{item.gift_num}}份{{item.gift_goods.goodsName}}</text>
                                            </div>
                                        </div>
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">创建时间：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.createTime}}</text>
                                        </div>
                                        <div class="datailsContent" v-if="item.cancelTime">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">撤销时间：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.cancelTime}}</text>
                                        </div>
                                    </div>
                                </div>

                                <!--团购活动-->
                                <div v-if="endtk.length>0">
                                    <text class="endTitle" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.tColor}">团购活动</text>
                                </div>
                                <div class="timeListCell" v-if="endtk.length>0" v-for="(item,index) in endtk">
                                    <div class="listContent timeCellName">
                                        <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">团购活动</text>
                                        <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">已结束</text>
                                    </div>
                                    <div class="listContent activeOrder">

                                        <div class="orderContent">
                                            <text class=" orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">库存</text>
                                            <div class="orderNum">
                                                <text  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor,marginBottom:'5px'}" v-if="item.goodsStock!=-1">剩</text>
                                                <text  :style="{fontSize:item.goodsStock===-1?GLOBAL.biggerFS:GLOBAL.biggestFS,color:GLOBAL.tColor,marginBottom:item.goodsStock===-1?'5px':''}">{{item.goodsStock==-1?'无限':item.goodsStock}}</text>
                                            </div>
                                        </div>

                                        <div class="orderContent">
                                            <text class=" orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">销量</text>
                                            <div class="orderNum">
                                                <text  :style="{fontSize:GLOBAL.biggestFS,color:GLOBAL.tColor}">{{item.sale}}</text>
                                            </div>
                                        </div>

                                        <div class="orderContent">
                                            <text class=" orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">预计收入</text>
                                            <div class="orderNum">
                                                <text  :style="{fontSize:GLOBAL.biggestFS,color:GLOBAL.tColor}">{{item.totalPay}}</text>
                                                <text  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor,marginBottom:'5px'}">元</text>
                                            </div>
                                        </div>

                                        <div class="orderContent">
                                            <text class=" orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">已收入</text>
                                            <div class="orderNum">
                                                <text  :style="{fontSize:GLOBAL.biggestFS,color:GLOBAL.tColor}">{{item.allPay}}</text>
                                                <text  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor,marginBottom:'5px'}">元</text>
                                            </div>
                                        </div>

                                    </div>
                                    <div class=" activeDatails">
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">活动名称：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.groupName}}</text>
                                        </div>
                                        <!--<div class="datailsContent">-->
                                        <!--<text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">活动规则：</text>-->
                                        <!--<text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">团购商品不享受其他优惠活动</text>-->
                                        <!--</div>-->
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">开始时间：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.startTime}} 00:00:00</text>
                                        </div>
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">结束时间：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.endTime}} 23:59:59</text>
                                        </div>
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">活动商品：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.name}}</text>
                                        </div>
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">不可使用日期：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.useData?item.useData:'未设置不可使用日期'}}</text>
                                        </div>
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">使用时间：</text>
                                            <text  :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}" v-for="(i,k) in item.dataList">{{i.start}}-{{i.end}}{{k!=item.dataList.length-1?',':''}}</text>
                                        </div>
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">创建时间：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.createTime}}</text>
                                        </div>
                                        <div class="datailsContent" v-if="item.cancelTime">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">撤销时间：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.cancelTime}}</text>
                                        </div>
                                    </div>
                                </div>

                                <!--秒杀活动-->
                                <!--<div class="timeListCell" v-if="endSeckill.length>0" v-for="(item,index) in endSeckill">-->
                                <!--<div class="listContent timeCellName">-->
                                <!--<text class="endTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">秒杀活动</text>-->
                                <!--<text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">已结束</text>-->
                                <!--</div>-->
                                <!--<div class=" activeDatails">-->
                                <!--<div class="datailsContent">-->
                                <!--<text class="orderTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">活动名称：</text>-->
                                <!--<text class="orderTitleWidth" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.name}}</text>-->
                                <!--</div>-->
                                <!--<div class="datailsContent">-->
                                <!--<text class="orderTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">开始时间：</text>-->
                                <!--<text class="orderTitleWidth" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.startTime}}</text>-->
                                <!--</div>-->
                                <!--<div class="datailsContent">-->
                                <!--<text class="orderTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">结束时间：</text>-->
                                <!--<text class="orderTitleWidth" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.endTime}}</text>-->
                                <!--</div>-->
                                <!--</div>-->
                                <!--</div>-->

                                <!--优惠卷活动-->
                                <!--<div v-if="endCoupon.length>0">-->
                                <!--<text class="endTitle" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.tColor}">优惠卷活动</text>-->
                                <!--</div>-->
                                <!--<div class="timeListCell" v-if="endCoupon.length>0" v-for="(item,index) in endCoupon">-->
                                <!--<div class="listContent timeCellName">-->
                                <!--<text class="endTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">优惠卷活动</text>-->
                                <!--<text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">已结束</text>-->
                                <!--</div>-->
                                <!--<div class=" activeDatails">-->
                                <!--<div class="datailsContent">-->
                                <!--<text class=" orderTitle" :style="{fontSize:GLOBAL.bigFS,color:'#999'}">活动名称：</text>-->
                                <!--<text class="orderTitleWidth" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.couponName}}</text>-->
                                <!--</div>-->
                                <!--<div class="datailsContent">-->
                                <!--<text class="orderTitle" :style="{fontSize:GLOBAL.bigFS,color:'#999'}">开始时间：</text>-->
                                <!--<text class="orderTitleWidth" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.sendStartTime}}</text>-->
                                <!--</div>-->
                                <!--<div class="datailsContent">-->
                                <!--<text class="orderTitle" :style="{fontSize:GLOBAL.bigFS,color:'#999'}">结束时间：</text>-->
                                <!--<text class="orderTitleWidth" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.sendEndTime}}</text>-->
                                <!--</div>-->
                                <!--</div>-->
                                <!--</div>-->

                                <!--砍价活动-->
                                <!--<div class="timeListCell" v-if="endBargain.length>0" v-for="(item,index) in endBargain">-->
                                <!--<div class="listContent timeCellName">-->
                                <!--<text class="endTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">砍价活动</text>-->
                                <!--<text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">已结束</text>-->
                                <!--</div>-->
                                <!--<div class=" activeDatails">-->
                                <!--<div class="datailsContent">-->
                                <!--<text class="orderTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">活动名称：</text>-->
                                <!--<text class="orderTitleWidth" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.name}}</text>-->
                                <!--</div>-->
                                <!--<div class="datailsContent">-->
                                <!--<text class="orderTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">开始时间：</text>-->
                                <!--<text class="orderTitleWidth" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.startTime}}</text>-->
                                <!--</div>-->
                                <!--<div class="datailsContent">-->
                                <!--<text class="orderTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">结束时间：</text>-->
                                <!--<text class="orderTitleWidth" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.endTime}}</text>-->
                                <!--</div>-->
                                <!--</div>-->
                                <!--</div>-->

                                <!--红包活动-->
                                <div v-if="endHongbao.length>0">
                                    <text class="endTitle" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.tColor}">红包活动</text>
                                </div>
                                <div class="timeListCell" v-if="endHongbao.length>0" v-for="(item,index) in endHongbao">
                                    <div class="listContent timeCellName">
                                        <text  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">红包活动</text>
                                        <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">已结束</text>
                                    </div>
                                    <div class="listContent activeOrder">
                                        <div class="orderContent">
                                            <text class=" orderTitle" :style="{fontSize:GLOBAL.bigFS,color:'#999'}">昨日订单</text>
                                            <div class="orderNum">
                                                <text  :style="{fontSize:GLOBAL.biggestFS,color:GLOBAL.tColor}">{{item.lastCount}}</text>
                                                <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor,marginBottom:'5px'}">个</text>
                                            </div>
                                        </div>
                                        <div class="orderContent">
                                            <text class=" orderTitle" :style="{fontSize:GLOBAL.bigFS,color:'#999'}">总计订单</text>
                                            <div class="orderNum">
                                                <text  :style="{fontSize:GLOBAL.biggestFS,color:GLOBAL.tColor}">{{item.allCount}}</text>
                                                <text  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor,marginBottom:'5px'}">个</text>
                                            </div>
                                        </div>
                                        <div class="orderContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.bigFS,color:'#999'}">昨日流水</text>
                                            <div class="orderNum">
                                                <text  :style="{fontSize:GLOBAL.biggestFS,color:GLOBAL.tColor}">{{item.lastPay}}</text>
                                                <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor,marginBottom:'5px'}">元</text>
                                            </div>
                                        </div>
                                        <div class="orderContent">
                                            <text class=" orderTitle" :style="{fontSize:GLOBAL.bigFS,color:'#999'}">总计流水</text>
                                            <div class="orderNum">
                                                <text  :style="{fontSize:GLOBAL.biggestFS,color:GLOBAL.tColor}">{{item.allPay}}</text>
                                                <text  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor,marginBottom:'5px'}">元</text>
                                            </div>
                                        </div>
                                    </div>
                                    <div class=" activeDatails">
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">活动名称：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.piece}}元红包</text>
                                        </div>
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">活动规则：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">满{{item.money}}元减{{item.piece}}元红包</text>
                                        </div>
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">开始时间：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.startTime}} 00:00:00</text>
                                        </div>
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">结束时间：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.endTime}} 23:59:59</text>
                                        </div>
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">创建时间：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.createTime}}</text>
                                        </div>
                                        <div class="datailsContent" v-if="item.cancelTime">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">撤销时间：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.cancelTime}}</text>
                                        </div>
                                    </div>
                                </div>

                                <!--代金券活动-->
                                <div v-if="endVoucher.length>0">
                                    <text class="endTitle" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.tColor}">代金券活动</text>
                                </div>
                                <div class="timeListCell" v-if="endVoucher.length>0" v-for="(item,index) in endVoucher">
                                    <div class="listContent timeCellName">
                                        <text  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">代金券活动</text>
                                        <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">已结束</text>
                                    </div>
                                    <div class="listContent activeOrder">

                                        <div class="orderContent">
                                            <text class=" orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">库存</text>
                                            <div class="orderNum">
                                                <text  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor,marginBottom:'5px'}" v-if="item.goodsStock!=-1">剩</text>
                                                <text  :style="{fontSize:item.goodsStock===-1?GLOBAL.biggerFS:GLOBAL.biggestFS,color:GLOBAL.tColor,marginBottom:item.goodsStock===-1?'5px':''}">{{item.goodsStock==-1?'无限':item.goodsStock}}</text>
                                            </div>
                                        </div>

                                        <div class="orderContent">
                                            <text class=" orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">销量</text>
                                            <div class="orderNum">
                                                <text  :style="{fontSize:GLOBAL.biggestFS,color:GLOBAL.tColor}">{{item.sale}}</text>
                                            </div>
                                        </div>

                                        <div class="orderContent">
                                            <text class=" orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">预计收入</text>
                                            <div class="orderNum">
                                                <text  :style="{fontSize:GLOBAL.biggestFS,color:GLOBAL.tColor}">{{item.totalPay}}</text>
                                                <text  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor,marginBottom:'5px'}">元</text>
                                            </div>
                                        </div>

                                        <div class="orderContent">
                                            <text class=" orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">已收入</text>
                                            <div class="orderNum">
                                                <text  :style="{fontSize:GLOBAL.biggestFS,color:GLOBAL.tColor}">{{item.allPay}}</text>
                                                <text  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor,marginBottom:'5px'}">元</text>
                                            </div>
                                        </div>

                                    </div>
                                    <div class=" activeDatails">
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">活动名称：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.marketPrice}}元代金券</text>
                                        </div>
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">活动规则：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.groupName}}</text>
                                        </div>
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">开始时间：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.startTime}} 00:00:00</text>
                                        </div>
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">结束时间：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.endTime}} 23:59:59</text>
                                        </div>
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">不可使用日期：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.useData?item.useData:'未设置不可使用日期'}}</text>
                                        </div>
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">使用时间：</text>
                                            <text  :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}" v-for="(i,k) in item.dataList">{{i.start}}-{{i.end}}{{k!=item.dataList.length-1?',':''}}</text>
                                        </div>
                                        <div class="datailsContent">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">创建时间：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.createTime}}</text>
                                        </div>
                                        <div class="datailsContent" v-if="item.cancelTime">
                                            <text class="orderTitle" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">撤销时间：</text>
                                            <text class="orderTitleWidth" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.cancelTime}}</text>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <text style="padding-top: 20px;padding-bottom: 20px;width: 710px;text-align: center;color: #999;font-size: 28px;">没有更多了~</text>
                                </div>
                            </div>
                            <noOrder v-if="!resEnd" img="https://image.aftdc.com/appBimg/icon_no_order.png" textOne="暂无已结束活动" textTwo=""></noOrder>
                            <!--<loading class="loading" @loading="loadmore" :display="loadinging ? 'show' : 'hide'">-->
                            <!--<text class="indicator-text">{{loadText}}</text>-->
                            <!--</loading>-->
                        </scroller>
                        <!--*********已结束*******-->
                    </slider>
                </div>
                <!--********已创建活动*******-->
            </slider>
        </div>

        <toast ref="toast"></toast>

        <wxc-mask height="250"
                  width="600"
                  border-radius="10"
                  duration="200"
                  mask-bg-color="#ffffff"
                  :has-animation="true"
                  :has-overlay="true"
                  :show="tkCancelShow"
                  @wxcMaskSetHidden="wxcMaskSetHidden">
            <div class="content">
                <text :style="{fontSize:GLOBAL.biggerFS,color:'#999'}">提示</text>
                <text class="TipsText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">撤销后,用户已购买但未使用的团购券将自动退款</text>
                <div class="row">
                    <text style="flex: 1;"></text>
                    <text class="cancel" :style="{fontSize:GLOBAL.bigFS}" @click="tipCancel">取消</text>
                    <text class="confirm" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor}"@click="tipConfirm">确认</text>
                </div>
            </div>
        </wxc-mask>
    </div>
</template>

<script>
    import {WxcButton, WxcDialog,WxcMinibar,WxcMask } from 'weex-ui';
    const modal = weex.requireModule('modal');
    import Toast from './Toast.vue';
    import noOrder from './noOrder.vue';
    const post = weex.requireModule('stream');
    const event = weex.requireModule('event');
    const navigator = weex.requireModule('navigator');
    const dom = weex.requireModule('dom');
    export default {
        components: {WxcButton, WxcDialog, Toast,WxcMinibar,WxcMask,noOrder},
        data() {
            return {
                // 上拉加载
                // loadText:'加载中...',
                // loadinging:false,
                // allLoading:true,//判断是否已加载所有数据
                // loadShow:true,

                res:1,//判断是否有进行中数据
                resEnd:1,//判断是否有已结束数据
                tkCancelShow:false,
                tkIndex:'',//获取团购index

                visibility:'hidden',
                backImgToggle: 0,//头部返回图片判断
                backShow: false,
                toggle: 0,
                timeToggle: 0,
                createBtnStyle: {
                    backgroundColor: '#53beb7',
                    width: '135',
                    height: '65',

                },
                createStyle: {
                    color: '#fff',
                    fontSize:'28px'
                },
                cancelBtnStyle: {
                    backgroundColor: '#fff',
                    width: '135',
                    height: '65',
                    borderColor: '#ff4500',
                    borderWidth: '1px',
                    borderStyle: 'solid'
                },
                cancelStyle: {
                    color: '#ff4500',
                    fontSize:'28px'
                },
                allActive: [
                    {backgroundColor: '#6d8c3c', backgroundName: '新', activeName: '新客立减', activeEffect: '拉新', url:'http://assets/newGuestErectActive.js'},
                    {backgroundColor: '#49008c', backgroundName: '积', activeName: '积分活动', activeEffect: '引流', url:'http://assets/integralActivity.js'},
                    {backgroundColor: '#fd0002', backgroundName: '减', activeName: '满减活动', activeEffect: '引流&促销', url:'http://assets/fullSubtractionActive.js'},
                    {backgroundColor: '#ff4040', backgroundName: '红', activeName: '商家红包', activeEffect: '引流&拉新', url:'http://assets/redEnvelope.js'},
                    {backgroundColor: '#ead500', backgroundName: '折', activeName: '折扣活动', activeEffect: '推商品&打造爆款', url:'http://assets/discountActive.js'},
                    {backgroundColor: '#08fd00', backgroundName: '赠', activeName: '买赠活动', activeEffect: '引流&促销', url:'http://assets/fullOfGiftsActive.js'},

                    // {backgroundColor: '#a8145e', backgroundName: '领', activeName: '商家优惠卷', activeEffect: '引流&拉新', url:'http://assets/shopCoupon.js'},


                    {backgroundColor: '#1d90fd', backgroundName: '团', activeName: '团购活动', activeEffect: '引流', url:'http://assets/bulk.js'},
                    // {backgroundColor: '#e99915', backgroundName: '砍', activeName: '砍价活动', activeEffect: '引流&促销', url:'http://assets/bargainActive.js'},
                    // {backgroundColor: '#7166cf', backgroundName: '秒', activeName: '秒杀活动', activeEffect: '推商品&打造爆款', url:'http://assets/seckillActive.js'},

                    {backgroundColor: '#aa135f', backgroundName: '代', activeName: '商家代金券', activeEffect: '引流&拉新', url:'http://assets/voucher.js'},
                ],
                newCou:'',//进行中新客立减
                integral:'',//进行中积分活动
                endnc:'',//结束了的新客立减
                endjf:'',//结束了的积分活动
                coupon:[],//进行中优惠卷
                endCoupon:[],//优惠卷结束
                zk:[],//进行中折扣
                endzk:[],//结束了的折扣
                // mj:[],//进行中的满减
                mjYouHui:[],
                // endmj:[],//结束了的满减
                endmj:[],
                tk:[],//进行中的团购
                endtk:[],//结束了的团购
                hongbao:[],//进行中红包
                endHongbao:[],//结束红包
                bargain:[],//进行中砍价
                endBargain:[],//砍价结束
                seckill:[],//进行中秒杀
                endSeckill:[],//结束秒杀
                voucher:[],//进行中的代金券
                endVoucher:[],//结束的代金券
                fullGift:[],//进行中的满赠活动
                endFullGift:[],//结束的满赠活动
                token:'',
                imei:'',
                pageBack:false,
                serviceTime: [],//营业时间
            }
        },
        created:function(){
            var that=this;
            that.visibility='hidden';
            this.token = weex.config.token;
            this.imei = weex.config.imei;
            // this.token = 'HEMXBTOEHZECZJRSBO1539157758';
            // this.imei = 'd4f4af29892c41b0be9555f85e1252c6';
            that.activeCreated();

        },
        mounted(){
            var that=this;
            that.visibility='visible';
        },
        methods: {

            tipCancel(){
                var that=this;
                that.tkCancelShow=false;
            },
            tipConfirm(){
                var that=this;
                const toast=that.$refs.toast;
                //获取token和sign
                var param = this.GLOBAL.sign(this.token,this.imei);
                var groupId = that.tk[that.tkIndex]['groupId'];
                //获取token和sign
                //新客立减

                that.tkCancelShow=false;
                param += '&groupId='+groupId;
                post.fetch({
                    method: 'post',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/businessapp/Activity/delTuan',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                },function(res){
                    if (res.data.res == 1){
                        that.tk.splice(that.tkIndex,1);
                    }
                    toast.editContent(res.data.info);
                })
            },
            wxcMaskSetHidden(){
                var that=this;
                that.tkCancelShow=false;
            },

            activeCreated(){

                var that = this;
                var param = that.GLOBAL.sign(that.token,that.imei);
                post.fetch({
                    method: 'post',
                    type: 'json',
                    body:param,
                    url: 'https://www.aftdc.com/businessapp/Activity/getShopActivity',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                },function(res){
                    that.res=res.data.res;
                    if (res.data.res === 1) {
                        var data = res.data;

                        //新客立减
                        if(data.newCou) that.newCou = data.newCou;

                        //积分活动
                        if(data.integral) that.integral = data.integral;

                        //优惠卷
                        // if(data.coupon) that.coupon = data.coupon;

                        // 折扣
                        if(data.zk) that.zk = data.zk;

                        //满减
                        if(data.mj) that.mjYouHui = data.mj;

                        //团购
                        if(data.tk) that.tk = data.tk;

                        //红包
                        if(data.hongbao) that.hongbao = data.hongbao;

                        //砍价
                        // if(data.bargain) that.bargain = data.bargain;

                        // 秒杀
                        // if(data.seckill) that.seckill = data.seckill;

                        //代金券
                        if (data.voucher) that.voucher = data.voucher;

                        //满赠活动
                        if (data.fullGift) that.fullGift = data.fullGift;

                        that.serviceTime = data.serviceTime

                    }
                    // else {
                    //     if(res.data.info){
                    //         const toast=that.$refs.toast;
                    //         toast.editContent(res.data.info);
                    //     }else{
                    //         const toast=that.$refs.toast;
                    //         toast.editContent('网络出错了');
                    //     }
                    //
                    // }
                })
            },
            loadmore(){
                var that=this;
                that.loadinging = true;

                var param = this.GLOBAL.sign(this.token,this.imei);
                param += '&is_over=1';

                post.fetch({
                    method: 'post',
                    type: 'json',
                    body:param,
                    url: 'https://www.aftdc.com/businessapp/Activity/getShopActivity',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                },function(res){
                    that.resEnd=res.data.res;
                    if (res.data.res == 1) {
                        var data = res.data;

                        //优惠卷
                        // if (data.endCoupon.length>0) that.endCoupon =data.endCoupon;
                        //新客立减
                        if (data.endnc.length>0) that.endnc = data.endnc;

                        //积分活动
                        if (data.endintegral.length>0) that.endjf = data.endintegral;

                        //折扣
                        if (data.endzk.length>0) that.endzk = data.endzk;

                        //满减
                        if (data.endmj.length>0) that.endmj  = data.endmj;

                        //团购
                        if (data.endtk.length>0) that.endtk = data.endtk;

                        //红包
                        if (data.endhongbao.length>0) that.endHongbao = data.endhongbao;
                        //砍价
                        // if(data.endBargain) that.endBargain = data.endBargain;

                        //秒杀
                        // if(data.endSeckill) that.endSeckill = data.endSeckill;

                        //代金券
                        if (data.endvoucher.length>0) that.endVoucher = data.endvoucher;

                        //满赠活动
                        if (data.endFullGift.length>0) that.endFullGift = data.endFullGift;
                    }
                    //其他情况
                    // else {
                    //     if(res.data.info){
                    //         const toast=that.$refs.toast;
                    //         toast.editContent(res.data.info);
                    //     }else{
                    //         const toast=that.$refs.toast;
                    //         toast.editContent('网络出错了');
                    //     }
                    //
                    // }
                })
            },//上拉加载
            del(type,index){
                var that = this;
                const toast=that.$refs.toast;
                //获取token和sign
                var param = this.GLOBAL.sign(this.token,this.imei);
                //新客立减
                if(type == 1){
                    param += '&id='+that.newCou['id'];
                    post.fetch({
                        method: 'post',
                        type: 'json',
                        body: param,
                        url: 'https://www.aftdc.com/businessapp/Activity/del_newCou',
                        headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    },function(res){
                        if (res.data.res == 1){
                            that.newCou='';
                            toast.editContent('撤销成功...');
                        } else {
                            toast.editContent('撤销失败...');
                        }
                    });
                }
                //优惠卷
                if(type == 2){
                    var couponId = that.coupon[index]['couponId'];
                    param += '&couponId='+couponId;
                    post.fetch({
                        method: 'post',
                        type: 'json',
                        body: param,
                        url: 'https://www.aftdc.com/businessapp/Activity/del',
                        headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    },function(res){
                        if (res.data.res == 1){
                            that.coupon.splice(index,1);
                            toast.editContent('撤销成功...');
                        } else {
                            toast.editContent('撤销失败...');
                        }
                    })
                }
                //折扣
                else if(type == 3){
                    var id = that.zk[index]['id'];
                    param += '&id='+id;
                    post.fetch({
                        method: 'post',
                        type: 'json',
                        body: param,
                        url: 'https://www.aftdc.com/businessapp/Activity/delDiscountGoods',
                        headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    },function(res){
                        if (res.data.res == 1){
                            that.zk.splice(index,1);
                            toast.editContent('撤销成功...');
                        } else {
                            toast.editContent('撤销失败...');
                        }
                    })
                    // var formData = 'couponId='+couponId;
                }
                //满减
                else if(type == 4){
                    var id = that.mjYouHui[index]['id'];
                    param += '&id='+id;
                    post.fetch({
                        method: 'post',
                        type: 'json',
                        body: param,
                        url: 'https://www.aftdc.com/businessapp/Activity/delMJ',
                        headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    },function(res){
                        if (res.data.res == 1){
                            that.mjYouHui.splice(index,1);
                            toast.editContent('撤销成功...');
                        } else {
                            toast.editContent('撤销失败...');
                        }
                    })
                }
                //团购
                else if(type == 5){

                    that.tkIndex=index;
                    that.tkCancelShow=true;
                }
                //红包
                else if(type == 6){
                    var id = that.hongbao[index]['id'];
                    param += '&id='+id;
                    post.fetch({
                        method: 'post',
                        type: 'json',
                        body: param,
                        url: 'https://www.aftdc.com/businessapp/Activity/delHongBao',
                        headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    },function(res){
                        if (res.data.res == 1){
                            that.hongbao.splice(index,1);
                            toast.editContent('撤销成功...');
                        } else {
                            toast.editContent('撤销失败...');
                        }
                    })
                }
                //砍价
                else if(type == 7){
                    var id = that.bargain[index]['id'];
                    param += '&id='+id;
                    post.fetch({
                        method: 'post',
                        type: 'json',
                        body: param,
                        url: 'https://www.aftdc.com/businessapp/Activity/delBargainGoods',
                        headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    },function(res){
                        if (res.data.res == 1){
                            that.bargain.splice(index,1);
                            toast.editContent('撤销成功...');
                        } else {
                            toast.editContent('撤销失败...');
                        }
                    })
                }
                //秒杀
                else if(type == 8){
                    var id = that.seckill[index]['id'];
                    param += '&id='+ id;
                    post.fetch({
                        method: 'post',
                        type: 'json',
                        body: param,
                        url: 'https://www.aftdc.com/businessapp/Activity/delseckillGoods',
                        headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    },function(res){
                        if (res.data.res == 1){
                            that.seckill.splice(index,1);
                            toast.editContent('撤销成功...');
                        } else {
                            toast.editContent('撤销失败...');
                        }
                    })
                }
                //代金券
                else if(type == 9){
                    var groupId = that.voucher[index]['groupId'];
                    param += '&groupId='+ groupId;
                    post.fetch({
                        method: 'post',
                        type: 'json',
                        body: param,
                        url: 'https://www.aftdc.com/businessapp/Activity/generadel',
                        headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    },function(res){
                        if (res.data.res == 1){
                            that.voucher.splice(index,1);
                            toast.editContent('撤销成功...');
                        } else {
                            toast.editContent('撤销失败...');
                        }
                    })
                }
                //满赠活动
                else if(type == 10){
                    var fullGiftId = that.fullGift[index]['id'];
                    param += '&fullGiftId='+ fullGiftId;
                    post.fetch({
                        method: 'post',
                        type: 'json',
                        body: param,
                        url: 'https://www.aftdc.com/businessapp/Activity/delFullGift',
                        headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    },function(res){
                        if (res.data.res == 1){
                            that.fullGift.splice(index,1);
                            toast.editContent('撤销成功...');
                        } else {
                            toast.editContent('撤销失败...');
                        }
                    })
                }
                //积分活动
                else if(type == 11){
                    var integralId = that.integral[index].id;
                    param += '&integralId='+ integralId;
                    post.fetch({
                        method: 'post',
                        type: 'json',
                        body: param,
                        url: 'https://www.aftdc.com/businessapp/Activity/delInvoice',
                        headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    },function(res){
                        if (res.data.res == 1){
                            that.integral.splice(index,1);
                            toast.editContent('撤销成功...');
                        } else {
                            toast.editContent('撤销失败...');
                        }
                    })
                }
            },
            //跳转到新建活动页面
            goToNew(url) {
                var param = JSON.stringify(this.serviceTime);
                var url=url;
                event.toUrl({ "url": url, "param": param });
            },
            //返回上一页
            backClick() {
                navigator.pop({ animated: 'true' });
            },

            toggleClick(index) {
                var that = this;
                that.toggle = index
                if(index==1){

                }

            },
            timeToggleClick(index) {
                var that = this;
                if(that.timeToggle==0 && index==1){
                    that.loadmore();
                }
                if(index==1 && that.timeToggle==1){
                    that.scrollTop();
                }
                that.timeToggle = index
            },
            change(event){
                // console.log(event.index);
                this.toggle = event.index;

            },
            timeChange(event){
                this.timeToggle = event.index;
                if(event.index==1){
                    this.loadmore();
                }
            },
            scrollTop(){
                dom.scrollToElement(this.$refs.box)
            },
            //监听扫码后页面返回
            viewdisappear(){
                let that=this;
                that.pageBack = true;
            },
            viewappear(){
                let that=this;
                if(!that.pageBack){ return; }
                that.pageBack = false;
                that.token = weex.config.token;
                that.imei = weex.config.imei;
                that.activeCreated()

            },
        }
    }

</script>

<style scoped>
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
        background-color: #fff;
    }
    .indicator-text {
        color: #666;
        font-size: 28px;
        text-align: center;
        margin-top: 30px;
        margin-bottom: 30px;
    }
    .wrapper {
        flex-direction: column;
        background-color: #000;
    }

    .content{
        padding-left: 20px;
        padding-right: 20px;
        padding-top: 20px;
        justify-content: space-between;
        width: 600px;
        height: 250px;
    }
    .TipsText{
        padding-top: 20px;
    }
    .cancel{
        padding-left: 20px;
        padding-right: 20px;
        padding-top: 20px;
        padding-bottom: 20px;
        color: #999;
    }
    .confirm{
        padding-left: 20px;
        padding-right: 20px;
        padding-top: 20px;
        padding-bottom: 20px;
    }
    .row{
        flex-direction: row;
        align-items: center;
    }
    .countent {
        flex: 1;
        width: 750px;
        flex-direction: column;

    }

    .content_top {
        flex-direction: row;
        align-items: center;
    }
    .topNav {
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding-top: 20px;
        padding-bottom: 20px;
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: #a1a1a1;
        /*box-shadow: 0px 3px #e1e1e1;*/
        background-color: #f8f8f8;
        flex: 1;
    }

    .topNav:active {
        background-color: #e1e1e1;
    }

    .drageDown {
        flex: 1;
        text-align: center;
        border-right-width: 1px;
        border-right-style: solid;
        border-right-color: #e3e3e3;

        color: #999;
    }

    .ascending {
        flex: 1;
        text-align: center;
        border-left-width: 1px;
        border-left-style: solid;
        border-left-color: #e3e3e3;

        color: #999;
    }

    .toggleColor {
        color: #53beb7;
    }

    .listCell {
        flex-direction: row;
        /*justify-content: space-between;*/
        align-items: center;

        padding-left: 30px;
        padding-right: 30px;

    }
    .listCell:active{
        background-color: #f8f8f8;
    }

    .cellBorder {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #f1f1f1;
        padding-top: 40px;
        padding-bottom: 40px;
        flex: 1;
    }

    .cellRight {
        flex-direction: row;
        align-items: center;
    }

    .textImg {
        width: 45px;
        height: 45px;
        line-height: 45px;
        text-align: center;
        /*background-color: red;*/

        margin-right: 30px;

    }

    .activeEffect {
        margin-top: 10px;
    }

    .createButton:active {
        background-color: #57aba5;
    }
    .createButton:enabled {
        background-color: #53beb7;
    }

    .createdActive {
        flex-direction: column;
        /*padding-top: 20px;*/
        /*padding-bottom: 20px;*/
        /*padding-left: 20px;*/
        /*padding-right: 20px;*/
        position: absolute;
        top: 0;
        bottom:0;
        left: 0;
        right: 0;
        /*background-color: red;*/
        /*align-items: center;*/
    }

    .timeActive {
        margin-top: 20px;
        margin-left: 40px;
        margin-right: 40px;
        margin-bottom: 20px;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        border-width: 1px;
        border-style: solid;
        border-color: #53beb7;
    }

    .ongoingActive {
        flex: 1;
        color: #53beb7;
        padding-top: 20px;
        padding-bottom: 20px;
        background-color: #fff;
        text-align: center;
    }

    .endActive {
        flex: 1;
        color: #53beb7;
        padding-top: 20px;
        padding-bottom: 20px;
        background-color: #fff;
        text-align: center;
    }

    .timeToggle {
        background-color: #53beb7;
        color: #fff;
    }

    .timeListCell {
        flex-direction: column;
        border-width: 1px;
        border-style: solid;
        border-color: #a1a1a1;
        border-radius: 5px;
        margin-bottom: 15px;
    }
    .endTitle{
        padding-top: 20px;
        padding-bottom: 10px;
        font-weight: bold;
    }

    .listContent {
        padding-left: 20px;
        padding-right: 20px;
        padding-top: 10px;
        padding-bottom: 10px;
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: #a1a1a1;

    }

    .timeCellName {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    .activeOrder {
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
    }

    .orderContent {
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .orderTitle {
        color: #999;
    }
    .orderTitleWidth{
        color: #999;
        width:525px;
    }

    .orderNum {
        flex-direction: row;
        justify-content: center;
        align-items: flex-end;
        height: 90px;
        padding-bottom: 15px;
    }



    .activeDatails {
        flex-direction: column;
        padding-left: 20px;
        padding-right: 20px;
        padding-bottom: 20px;
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: #a1a1a1;
    }

    .datailsContent {
        flex-direction: row;
        align-items: flex-start;
        margin-top: 20px;
    }

    .cancelCell {
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        padding-top: 20px;
        padding-left: 20px;
        padding-right: 20px;
        padding-bottom: 20px;
    }

    .cancelButton:active {
        background-color: #f1f1f1;
    }

    .slider {
        position: relative;
        width: 750px;
        flex: 1;
        background-color: #ffffff;
        transition: left 0.2s ease-in-out;
    }
    .scroller{
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
    }
    .listHeight{
        padding-left: 20px;
        padding-right: 20px;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }
    /*****************/

    /***********************/
</style>
