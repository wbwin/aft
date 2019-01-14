<template>
    <div class="wrapper" @touchstart="touchstart" @touchmove="touchmove" @touchend="touchend" @longpress="longpress" @viewappear="viewappear" @viewdisappear="viewdisappear">

        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    v-once
            >
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">提交订单</text>
            </wxc-minibar>
        </div>

        <scroller class="scroller" show-scrollbar="false" @scroll="scrollMove">
            <div class="backgroundColor"></div>
            <div class="orderPage_content">
                <!--<div class="bar">-->
                <!--<text class="barOne" :class="[option==0?'barTwo':'']" @click="distributionClick(0)" :style="{fontSize:GLOBAL.bigFS,color:option==0?GLOBAL.tColor:GLOBAL.dColor}">外卖配送</text>-->
                <!--<text class="barOne" :class="[option==1?'barTwo':'']" @click="distributionClick(1)" :style="{fontSize:GLOBAL.bigFS,color:option==1?GLOBAL.tColor:GLOBAL.dColor}">到店自取</text>-->
                <!--</div>-->
                <!--商家能自取的时候-->

                <div class="title optionOne"  v-if="orderType==0" @click="toReceivingAddress">
                    <div  class="titleTop">
                        <div class="titleTopDiv" v-if="address">
                            <!--为防止页面错乱加的div-->
                            <div >
                                <div class="titleTopA">
                                    <!--<text class="titleTextA" :style="{fontSize:GLOBAL.smallFS}">公司</text>-->
                                    <text class="titleTextB" :style="{fontSize:'35px',color:GLOBAL.dColor}">{{address.address}} {{address.detailed}}</text>
                                </div>
                                <div class="titleTopB">
                                    <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{address.userName}}({{address.userSex==1?'先生':address.userSex==1?'女士':''}})</text>
                                    <text class="titleTextD" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{address.userPhone}}</text>
                                </div>
                            </div>

                        </div>
                        <text v-else  :style="{fontSize:'36px',color:'#999',marginRight:'20px'}">请选择收货地址</text>
                        <image class="titleIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                    </div>
                    <div class="titleBottom" @click="onSelTime()">
                        <div>
                            <text class="titleBottomTextA" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">{{timeArrIndex==-1?'立即送出':'指定时间'}}</text>
                        </div>
                        <text class="titleBottomTextB" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.tColor}">{{isOpen==2&&!requireTime&&reserveTime?'现在预订,最早'+firstPresetTime.today+reserveTime:reserveTime}}{{reserveTime==''?'最快可预订'+firstPresetTime.days+'天后配送':'送达'}}</text>
                        <image class="titleIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                    </div>
                </div>
                <div class="title optionTwo" v-if="orderType==5">
                    <div class="take">
                        <image class="takeIcon" src="https://image.aftdc.com/appBimg/icon_longin_account.png"></image>
                        <text class="takeText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">自取地址</text>
                    </div>
                    <text class="takeAddress" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">{{shopInfo.shopAddress}}</text>
                    <div class="distance">
                        <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">商家距离当前位置{{shopInfo.distance}}</text>
                        <text class="distanceMap" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}">查看地图</text>
                    </div>
                    <div class="takeTime">
                        <div class="takeTimeLeft" @click="onSelTime()">
                            <text class="takeTimeText" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">自取时间</text>
                            <div class="takeTimeDiv">
                                <!--<text v-if="tadayHide" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{takeData}}</text>-->
                                <text class="takeTimeNumberTwo" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{isOpen==2&&!requireTime&&reserveTime?'最早可选'+presetTime[0].today:''}}{{reserveTime==''?'请选择':reserveTime+'到店'}}</text>
                                <image class="titleIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                            </div>
                        </div>
                        <div class="takeTimeRight">
                            <text class="takeTimeText" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">自取电话:</text>
                            <div class="takeTimeDiv">
                                <input type="number" class="takeTimeInput" v-model="userPhone" placeholder="请输入电话" :disabled="inputDisabled" ref="ref_phone"   @focus="allFocus()" @blur="allBlur()" maxlength="11"  :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">
                                <image class="titleIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                            </div>
                        </div>
                    </div>
                    <div class="agreement">
                        <image class="agreementIcon" @click="agreementClick" :src="agreement?'https://image.aftdc.com/appBimg/ic_check_box_checked.png':'https://image.aftdc.com/appBimg/ic_check_box_normal.png'"></image>
                        <text class="agreeText" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">同意</text>
                        <text class="AgreementText" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.tColor}">《到店自取服务协议》</text>
                    </div>
                </div>
                <!--商家不能自取的时候-->
                <!--<div class="title" style="border-radius: 10px">-->
                <!--<div class="titleTop">-->
                <!--<div class="titleTopDiv">-->
                <!--<div class="titleTopA">-->
                <!--<text class="titleTextA">公司</text>-->
                <!--<text class="titleTextB">广州市白云区是金正圣诞节疯狂上岛咖啡可接受的</text>-->
                <!--</div>-->
                <!--<div class="titleTopB">-->
                <!--<text class="titleTextC">黄松演(先生)</text>-->
                <!--<text class="titleTextD">13610254074</text>-->
                <!--</div>-->
                <!--</div>-->
                <!--<image class="titleIcon" src="https://image.aftdc.com/appBimg/icon_arrow_black.png"></image>-->
                <!--</div>-->
                <!--<div class="titleBottom" @click="timeClick(bridgingFour2,bridgingThree2,2)">-->
                <!--<div>-->
                <!--<text class="titleBottomTextA">{{bridgingFour2==0&&bridgingThree2==0?'立即送出':'指定时间'}}</text>-->
                <!--</div>-->
                <!--<text class="titleBottomTextB" >{{tadayHide2?takeData2+takeTime2:takeTime2}}</text>-->
                <!--<image class="titleIcon" src="https://image.aftdc.com/appBimg/icon_arrow_black.png"></image>-->
                <!--</div>-->
                <!--</div>-->

                <div class="content" ref="scrollTest">
                    <div class="contentTop">
                        <div class="contentShopName">
                            <div class="shopIconDiv">
                                <image class="shopIcon" :src="'https://image.aftdc.com/'+shopInfo.shopImg"></image>
                            </div>
                            <text class="shopNameText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{shopInfo.shopName}}</text>
                            <text class="shopNameTextTwo" v-if="orderType!=6&&orderType!=7&&(orderType==3||orderType==0)" :style="{fontSize:GLOBAL.smallerFS,color:GLOBAL.tColor}">{{orderType==3?'堂食预订':'商家配送'}}</text>
                        </div>
                        <!--<div class="prompt">-->
                        <!--<image class="promptIcon" src="https://image.aftdc.com/appBimg/redStar.png"></image>-->
                        <!--<text class="promptText" :style="{fontSize:GLOBAL.smallFS}">温馨提示:您点主食了吗?</text>-->
                        <!--</div>-->
                    </div>
                    <div v-if="!shareId">
                        <div class="dish" v-for="(item,index) in orderfood" v-if="dishLength||(!dishLength&&index<3)" :key="index">
                            <image class="dishImg" :src="'https://image.aftdc.com/'+item.goodsImg"></image>
                            <div class="dishDiv">
                                <div class="dishTop">
                                    <div class="aiCenter">
                                        <text class="dishName" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.goodsName}}</text>
                                        <text class="zhe" v-if="item.zkGoodsId&&!hongbaoDeduction" :style="{fontSize:GLOBAL.smallFS}">折</text>
                                    </div>
                                    <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">￥{{hongbaoDeduction?item.totalMarketPrice:item.totalPrice}}</text>
                                </div>
                                <div class="dishCenter">
                                    <div style="flex: 1">
                                        <text class="dishNumber" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">×{{item.numb}}</text>
                                        <text class="dishNumber" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}" v-if="item.goodsAttrName">{{item.goodsAttrName}}</text>
                                    </div>
                                    <text class="zhePrice" v-if="(item.zkGoodsId||orderType==6||orderType==7)&&!hongbaoDeduction" :style="{fontSize:GLOBAL.smallFS}">￥{{item.totalMarketPrice}}</text>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div v-else>
                        <div v-for="(item,index) in shareOrderList" v-if="dishLength||(!dishLength&&index<1)">
                            <div class="aiCenter" style="margin-top: 20px"  v-if="shareOrderList.length>1">
                                <text class="Share_circle"></text>
                                <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">口袋{{index+1}}</text>
                            </div>
                            <div class="dish" v-for="(food,foodIndex) in item.goodsInfo" v-if="dishLength||(!dishLength&&foodIndex<3)" >
                                <image class="dishImg" :src="'https://image.aftdc.com/'+food.goodsImg"></image>
                                <div class="dishDiv">
                                    <div class="dishTop">
                                        <div class="aiCenter">
                                            <text class="dishName" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{food.goodsName}}</text>
                                            <text class="zhe" v-if="food.zkGoodsId&&!hongbaoDeduction" :style="{fontSize:GLOBAL.smallFS}">折</text>
                                        </div>
                                        <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">￥{{hongbaoDeduction?food.totalMarketPrice:food.totalPrice}}</text>
                                    </div>
                                    <div class="dishCenter">
                                        <div style="flex: 1">
                                            <text class="dishNumber" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">×{{food.numb}}</text>
                                            <text class="dishNumber" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}" v-if="food.goodsAttrName">{{food.goodsAttrName}}</text>
                                        </div>
                                        <text class="zhePrice" v-if="(food.zkGoodsId||orderType==6||orderType==7)&&!hongbaoDeduction" :style="{fontSize:GLOBAL.smallFS}">￥{{food.totalMarketPrice}}</text>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="clickUnfold" @click="unfoldClick" v-if="orderfood.length>3||(shareOrderList.length>0&&shareOrderList[0].goodsInfo.length>3)||shareOrderList.length>1">
                        <text class="unfoldText" :style="{fontSize:GLOBAL.smallFS}">{{dishLength?'点击收起':'点击展开'}}</text>
                        <image class="unfoldIcon" src="https://image.aftdc.com/appBimg/ic_arrow_down_gray.png" ref="test"></image>
                    </div>

                    <div class="tipDiv">
                        <div class="tip">
                            <div class="tipOne" v-if="orderType==0">
                                <text class="tipText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">餐盒费</text>
                                <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">￥{{boxFees}}</text>
                            </div>
                            <div class="tipOne" v-if="orderType==0||orderType==5">
                                <text class="tipText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">配送费</text>
                                <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">￥{{dsm}}</text>
                            </div>
                        </div>
                        <div class="gardenA"></div>
                        <div class="gardenB"></div>
                    </div>
                    <div class="discountDiv" v-if="youhuiList.length>0||(hongbaoTemp.length>0&&orderType!=6&&orderType!=7)">
                        <div class="discount">
                            <template v-for="(item,index) in youhuiList" v-if="item.yhType!='hb'">
                                <div class="jianDiv" v-if="item.yhType!='mz'">
                                    <div class="aiCenter">
                                        <text class="jian" :style="{fontSize:GLOBAL.smallFS,backgroundColor:item.yhType=='xk'?'#53beb7':item.yhType=='zk'?'#F4A460':item.yhType=='mj'?'#ff4040':item.yhType=='jfdk'?'#49008c':item.yhType=='zsjf'?'#aa135f':''}">{{item.yhType=='xk'?'新':item.yhType=='zk'?'折':item.yhType=='mj'?'减':item.yhType=='jfdk'?'抵':item.yhType=='zsjf'?'积':''}}</text>
                                        <text class="jianType" :style="{fontSize:GLOBAL.smallFS}">{{item.name}}</text>
                                    </div>
                                    <text class="jianPrice" :style="{fontSize:GLOBAL.smallFS,color:'#fb5147'}">{{item.yhType=='zsjf'?item.youhui:'-￥'+item.youhui}}</text>
                                </div>
                                <div class="jianDiv" v-else>
                                    <div class="aiCenter">
                                        <text class="jian" :style="{fontSize:GLOBAL.smallFS,backgroundColor:'red'}">赠</text>
                                        <text class="jianType" :style="{fontSize:GLOBAL.smallFS}">买赠活动赠送</text>
                                    </div>
                                    <div class="bargainTxt">
                                        <text  :style="{fontSize:GLOBAL.smallFS,color:'#fb5147',maxWidth:'406px'}">{{item.youhui}}</text>
                                        <text  :style="{fontSize:GLOBAL.smallFS,color:'#fb5147'}">*{{item.num}}</text>
                                    </div>
                                </div>
                            </template>
                            <div class="voucher" v-if="hongbaoTemp.length>0&&orderType!=6&&orderType!=7" @click="redEnvelopesShowClick(bridgingRed)">
                                <text class="voucherText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">商家红包</text>
                                <text class="voucherNumber" v-if="!hongbaoDeduction" :class="[hongbaoTemp.length!=0?'available':'']" :style="{fontSize:GLOBAL.defaultFS,color:hongbaoTemp.length!=0?'#fb5147':GLOBAL.dColor}">{{hongbaoTemp.length+'个可用'}}</text>
                                <text  v-if="hongbaoDeduction" :class="[hongbaoTemp.length!=0?'available':'']" :style="{fontSize:GLOBAL.defaultFS,color:hongbaoTemp.length!=0?'#fb5147':GLOBAL.dColor}">-￥{{hongbaoDeduction}}</text>
                                <image class="titleIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png" v-if="!hongbaoDeduction"></image>
                            </div>
                            <!--<div class="redEnvelopes">-->
                            <!--<div class="redEnvelopesTop">-->
                            <!--<text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">购红包套餐,本单可用5元红包</text>-->
                            <!--<div class="helpIconDiv">-->
                            <!--<image class="helpIcon" src="https://image.aftdc.com/appBimg/icon_help.png"></image>-->
                            <!--</div>-->
                            <!--<image class="selectIcon" @click="redEnvelopesClick" :src="redEnvelopes?'https://image.aftdc.com/appBimg/ic_check_box_checked.png':'https://image.aftdc.com/appBimg/ic_check_box_normal.png'"></image>-->
                            <!--</div>-->
                            <!--<div class="redEnvelopesBtn">-->
                            <!--<text class="redEnvelopesBtnTextA" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">总计可得30元红包,限广州使用</text>-->
                            <!--<text class="redEnvelopesBtnTextB" :style="{fontSize:GLOBAL.smallFS}">￥30</text>-->
                            <!--<text class="redEnvelopesBtnTextC" :style="{fontSize:GLOBAL.defaultFS}">￥15</text>-->
                            <!--</div>-->
                            <!--</div>-->
                            <!--<div class="voucher" @click="couponClick(bridgingCoupon)">-->
                            <!--<text class="voucherText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">商家代金券</text>-->
                            <!--<text class="voucherNumber" v-if="couponValue2==''" :style="{fontSize:GLOBAL.defaultFS,color:couponList.length!=0?'#fb5147':GLOBAL.dColor}">{{couponList.length==0?'暂无可用':'你有'+couponList.length+'张优惠券'}}</text>-->
                            <!--<text class="voucherNumber" v-if="couponValue2!=''" :style="{fontSize:GLOBAL.defaultFS,color:couponList.length!=0?'#fb5147':GLOBAL.dColor}">-￥{{couponValue2}}</text>-->
                            <!--<image class="titleIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>-->
                            <!--</div>-->
                        </div>
                        <div class="gardenC"></div>
                        <div class="gardenD"></div>
                    </div>
                    <div class="rule">
                        <div class="heplRule" @click="toPreferentialRules()">
                            <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">优惠规则</text>
                            <div class="helpIconDiv">
                                <image class="helpIcon" src="https://image.aftdc.com/appBimg/icon_help.png"></image>
                            </div>
                        </div>
                        <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">已优惠￥{{yhMoney}}</text>
                        <text class="smallPlan" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">小计</text>
                        <text class="totalPrice" :style="{fontSize:GLOBAL.bigFS}">￥{{true_pay}}</text>
                    </div>


                </div>
                <!--<div class="protect">-->
                <!--<div class="protectDiv">-->
                <!--<image class="lockIcon" src="https://image.aftdc.com/appBimg/ic_lock.png"></image>-->
                <!--<text class="protectDivText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">号码保护</text>-->
                <!--<div class="helpIconDiv" @click="toNumberProtection">-->
                <!--<image class="helpIcon" src="https://image.aftdc.com/appBimg/icon_help.png"></image>-->
                <!--</div>-->
                <!--<div ref="test2" :class="[startSwitch==false?'close':'open']"-->
                <!--style="justify-content: center;padding-left: 1px;"-->
                <!--@click="bill">-->
                <!--<div ref="test1" :class="[startSwitch==false?'isClose':'isOpen']"></div>-->
                <!--</div>-->
                <!--</div>-->
                <!--<text class="protectText" :style="{fontSize:GLOBAL.smallFS}">对商家,骑手隐藏您的真实手机号,保护您的隐私</text>-->
                <!--</div>-->
                <div class="payment" v-if="orderType!=6&&orderType!=7">
                    <div class="payMent">
                        <text class="payMentText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">支付方式</text>
                        <text class="payMentTextTwo" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">在线支付</text>
                    </div>
                    <div class="payMent" @click="toAddRemarks()" v-if="orderType!=3">
                        <text class="payMentText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">备注</text>
                        <text class="flavorText" :style="{fontSize:GLOBAL.defaultFS,color:remarksContent==''?'#999':'#333'}">{{remarksContent==''?'口味,偏好等要求':remarksContent}}</text>
                        <image class="titleIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                    </div>
                    <div class="payMent" @click="selectClick(bridging)" v-if="orderType!=3">
                        <text class="payMentText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">餐具数量</text>
                        <!--<div class="assistant">-->
                        <!--<image class="assistantIcon" src="https://image.aftdc.com/appBimg/icon_map.jpg" v-if="tablewareSelectNumber===''||tablewareSelectNumber==0"></image>-->
                        <!--<text v-if="tablewareSelectNumber===''" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.tColor}">一起为环保助力</text>-->
                        <!--</div>-->
                        <text class="selectText" :style="{fontSize:GLOBAL.defaultFS,color:tablewareSelectNumber===''?'#999':GLOBAL.dColor}">{{tablewareSelectNumber===''?'未选择':tablewareSelectNumber===0?'不需要餐具':tablewareSelectNumber==11?'10人以上':tablewareSelectNumber+'人'}}</text>
                        <image class="titleIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                    </div>
                    <div class="payMentS">
                        <text class="payMentText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">发票</text>
                        <div ref="test2" :class="[startSwitch==false?'close':'open']" style="justify-content: center;padding-left: 1px;" @click="bill" v-if="shopInfo.fp==1">
                            <div ref="test1" :class="[startSwitch==false?'isClose':'isOpen']"></div>
                        </div>
                        <text class="invoiceText" :style="{fontSize:GLOBAL.defaultFS}" v-else>该商家不支持开发票</text>
                    </div>
                    <div class="tableware-billChose" @click="toInvoiceClick()" v-if="billSwitch">
                        <div class="billMessage">
                            <text :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">{{choiceInvoice?choiceInvoice.trueName:'您还未选择发票信息'}}</text>
                            <text :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">{{choiceInvoice.dutyNum}}</text>
                        </div>
                        <div class="tableware-view">
                            <text class="selectText" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}" >{{choiceInvoice?'重新选择':'点击选择'}}</text>
                            <image class="titleIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                        </div>

                    </div>
                </div>
                <!--<div class="publicWelfare">-->
                <!--<image class="helpIcon" src="https://image.aftdc.com/appBimg/icon_help.png"></image>-->
                <!--<text class="publicWelfareText" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">商家已加入"青山公益行动",本单完成后商家将捐献0.1元青山基金</text>-->
                <!--</div>-->
            </div>
        </scroller>
        <!--<div class="yellow">-->
        <!--<image class="yellowIcon" src="https://image.aftdc.com/appBimg/icon_help.png"></image>-->
        <!--<text class="yellowText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">满减优惠与折扣商品不能同享</text>-->
        <!--</div>-->
        <div class="placeOrder" v-if="inputFocus">
            <text class="placeOrderOne" :style="{fontSize:GLOBAL.bigFS}">已优惠￥{{yhMoney}}</text>
            <text class="placeOrderTwo" :style="{fontSize:GLOBAL.biggerFS}">合计</text>
            <text class="placeOrderThree" :style="{fontSize:GLOBAL.biggestFS}">￥{{true_pay}}</text>
            <text class="placeOrderFour" @click="orderType==6||orderType==8?upTgOrder():upOrder()" :style="{fontSize:GLOBAL.bigFS}">提交订单</text>
        </div>

        <!--弹层↓-->

        <!--用餐人数选择-->
        <wxc-popup popup-color="rgb(255,255,255)"
                   :show="tablewareShow"
                   @wxcPopupOverlayClicked="popupOverlayBottomClick"
                   pos="bottom"
                   height="650">
            <div class="tablewareAdvocacy">
                <image class="assistantIcon" src="https://image.aftdc.com/appBimg/icon_map.jpg"></image>
                <text class="tablewareAdvocacyText" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.tColor}">阿凡提外卖倡导:减少使用一次性餐具,为环境保护出份力!</text>
            </div>
            <scroller>
                <text class="tablewareSelect" :style="{fontSize:GLOBAL.bigFS,color:tablewareSelectNumber==index?GLOBAL.tColor:'#999'}" ref="itemA" v-for="(item,index) in tablewareSelectList" :key="index" @click="tablewareClick(index)">{{item.people==0?'不需要餐具':item.people==11?'10人以上':item.people+'人'}}</text>
            </scroller>
            <text class="tablewareCancel" @click="tablewareCancelClick">取消</text>
        </wxc-popup>

        <!--&lt;!&ndash;到店自取时间选择&ndash;&gt;-->
        <!--<wxc-popup popup-color="rgb(255,255,255)"-->
        <!--:show="timeShow"-->
        <!--@wxcPopupOverlayClicked="popupOverlayBottomClick"-->
        <!--pos="bottom"-->
        <!--height="650">-->
        <!--<div class="selectTime">-->
        <!--<scroller style="flex: 1;height: 560px" show-scrollbar="false">-->
        <!--<text class="selectTimeText" :class="[item.select?'selectClass':'']" ref="itemB"  v-for="(item,index) in timeList" :key="index" @click="timeOneClick(index,1)" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.time}}</text>-->
        <!--</scroller>-->
        <!--<scroller style="flex: 2;height: 560px">-->
        <!--<div class="selectTimeDiv" v-for="(item,index) in timeListTwo" :key="index" @click="timeTwoClick(index,1)" ref="itemC">-->
        <!--<text class="selectTimeTextTwo" :class="[item.timeTwoSelect?'selectClassTwo':'']" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.time}}</text>-->
        <!--<image class="selectTimeIcon" src="https://image.aftdc.com/appBimg/icon_choiceTrue.png" v-if="item.timeTwoSelect"></image>-->
        <!--</div>-->
        <!--</scroller>-->
        <!--</div>-->
        <!--<text class="tablewareCancel" @click="tablewareCancelClickTwo">取消</text>-->
        <!--</wxc-popup>-->

        <!--商家配送时间选择-->
        <wxc-popup popup-color="rgb(255,255,255)"
                   :show="timeShow"
                   @wxcPopupOverlayClicked="popupOverlayBottomClick"
                   pos="bottom"
                   ref="ref_timeShow"
                   height="650">
            <div class="selectTime">
                <scroller class="dataScroller"  show-scrollbar="false">
                    <text class="selectTimeText" :class="[unClickDataIndex==item.days?'selectClass':'']" ref="ref_presetTime"  v-for="(item,index) in presetTime"  @click="item.days==0?timeOfToday():timeOfOtherDaty(item.days)" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.today}}</text>
                </scroller>
                <scroller class="timeScroller" >
                    <div class="selectTimeDiv" v-if="unClickDataIndex==0&&isOpen==1" ref="ref_timeArrOfNow" @click="choiceTimeOfNow()" >
                        <text class="selectTimeTextTwo"  :style="{fontSize:GLOBAL.defaultFS,color:timeArrIndex==-1&&unClickDataIndex==dataIndex?'#53beb7':GLOBAL.dColor}">{{orderType==5?reTime:'立刻送出（大约'+reTime+'送达）'}}</text>
                        <image class="selectTimeIcon" src="https://image.aftdc.com/appBimg/icon_choiceTrue.png" v-if="timeArrIndex==-1&&unClickDataIndex==dataIndex"></image>
                    </div>
                    <div class="selectTimeDiv" v-for="(item,index) in timeArr" @click="choiceTime(item,index)"  ref="ref_timeArr">
                        <text class="selectTimeTextTwo"  :style="{fontSize:GLOBAL.defaultFS,color:timeArrIndex==index&&unClickDataIndex==dataIndex?'#53beb7':GLOBAL.dColor}">{{item}}</text>
                        <image class="selectTimeIcon" src="https://image.aftdc.com/appBimg/icon_choiceTrue.png" v-if="timeArrIndex==index&&unClickDataIndex==dataIndex"></image>
                    </div>
                </scroller>
            </div>
            <text class="tablewareCancel" @click="tablewareCancelClickTwo" :style="{fontSize:GLOBAL.defaultFS}">取消</text>
        </wxc-popup>


        <!--红包选择-->
        <wxc-mask height="800"
                  width="700"
                  border-radius="15"
                  duration="200"
                  mask-bg-color="#FFFFFF"
                  :has-animation="true"
                  :has-overlay="true"
                  :show-close="false"
                  :show=" redEnvelopesShow"
                  @wxcMaskSetHidden="wxcMaskSetHidden">
            <div class="coupon">
                <text class="couponTiele" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">可用红包{{hongbaoTemp.length}}个</text>
                <scroller class="couponScroller" show-scrollbar="false">
                    <div class="couponContent" v-for="(item,index) in hongbaoTemp" :key="index" @click="pouponClick(index,item.piece,item.id)" ref="redItem">
                        <div class="couponContentLeft">
                            <text class="couponName" :style="{fontSize:GLOBAL.biggerFS,color:'#333'}">商家红包</text>
                            <!--<text class="limit" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.redLimit}}</text>-->
                            <div class="hongbaoPrice">
                                <text class="number" :style="{fontSize:GLOBAL.biggerFS,color:'#fb4e44'}">￥</text>
                                <text  :style="{fontSize:'60px',color:'#fb4e44',fontWeight:'bold'}">{{item.piece}}</text>
                            </div>

                        </div>
                        <div class="couponContentRight">
                            <text class="term" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">有效期至{{item.end_time}}</text>
                            <text class="couponText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">满{{item.money}}可用</text>
                        </div>
                        <image class="redEnvelopesSelect" v-if="hongbaoTempIndex==index" src="https://image.aftdc.com/appBimg/couponSelected.png"></image>
                    </div>
                </scroller>
                <text class="noCoupon" @click="noRedEnvelopesShowClick" :style="{fontSize:GLOBAL.defaultFS}">不使用红包</text>
            </div>
        </wxc-mask>
        <!--优惠券选择-->
        <!--<wxc-mask height="800"-->
        <!--width="700"-->
        <!--border-radius="15"-->
        <!--duration="200"-->
        <!--mask-bg-color="#FFFFFF"-->
        <!--:has-animation="true"-->
        <!--:has-overlay="true"-->
        <!--:show-close="false"-->
        <!--:show="couponShow"-->
        <!--@wxcMaskSetHidden="wxcMaskSetHidden">-->
        <!--<div class="coupon">-->
        <!--<text class="couponTiele" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">可用优惠券{{couponList.length}}张</text>-->
        <!--<scroller class="couponScroller" show-scrollbar="false">-->
        <!--<div class="couponContent" v-for="(item,index) in couponList" :key="index" @click="pouponClick(index,2)" ref="couponItem">-->
        <!--<div class="couponContentLeft">-->
        <!--<text class="couponName" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.couponName}}</text>-->
        <!--<text class="limit" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.limit}}</text>-->
        <!--<text class="term" :style="{fontSize:GLOBAL.smallFS}">{{item.termOne}}到{{item.termTwo}}</text>-->
        <!--</div>-->
        <!--<div class="couponContentRight">-->
        <!--<text class="number" :style="{fontSize:GLOBAL.defaultFS}">￥{{item.number}}</text>-->
        <!--<text class="couponText" :style="{fontSize:GLOBAL.defaultFS}">优惠券</text>-->
        <!--</div>-->
        <!--<image class="redEnvelopesSelect" v-if="item.redEnvelopesSelect" src="https://image.aftdc.com/appBimg/couponSelected.png"></image>-->
        <!--</div>-->
        <!--</scroller>-->
        <!--<text class="noCoupon" @click="noCouponClick" :style="{fontSize:GLOBAL.defaultFS}">不使用优惠券</text>-->
        <!--</div>-->
        <!--</wxc-mask>-->
        <toast ref="toast"></toast>
    </div>


</template>

<script>
    import Toast from './Toast.vue';
    import {WxcMask, WxcMinibar,WxcPopup } from 'weex-ui';
    const post = weex.requireModule('stream');
    const animation = weex.requireModule('animation')
    const modal = weex.requireModule('modal')
    const dom = weex.requireModule('dom')
    const event=weex.requireModule('event')
    const GLOBAL = require('@/Global.vue');
    export default {
        components: {WxcMask, WxcMinibar,WxcPopup,Toast },
        name: 'App',
        data() {
            return {
                bridging:'',//点击选择用餐人数时获取当前index
                bridgingRed:0,//红包桥接
                tablewareShow:false,//选择用餐人数弹出层

                redEnvelopesShow:false,//可用红包弹出层



                tablewareSelectNumber:'',//用餐人数
                couponValue:'',//红包值
                couponValue2:'',//优惠券值
                redEnvelopes:false,//购红包套餐
                option:0,//为0时外卖配送,为1时到店自取
                agreement:true,//同意自取服务协议
                // redEnvelopesSelect:false,//红包是否选择

                tablewareSelectList:[
                    //              默认↓
                    {people:0},
                    {people:1},
                    {people:2},
                    {people:3},
                    {people:4},
                    {people:5},
                    {people:6},
                    {people:7},
                    {people:8},
                    {people:9},
                    {people:10},
                    {people:11},
                ],//筷子的选择列表



                remarksContent:'',
                pageBack:false,
                address:'',//选择的地址
                shopType:1,
                orderType:0,
                tk:'',//是否是团购、代金券
                isOpen:'',//是否营业
                shopInfo:'',//店铺信息
                orderfood:'',//商品信息
                startSwitch: false,//发票一开始的状态
                billSwitch:false,//是否开启发票
                choiceInvoice:'',//已选择的发票信息
                dishLength:false,//菜品数量是否大于3

                deskNum:'',//桌位号,暂无用
                deskArr:'',//桌位信息,暂无用
                couponId:'',//优惠卷Id,暂无用
                hongbaoId:'',//红包Id,暂无用
                //拼单
                shareOrderList:'',//拼单详情
                shareId: 0,//拼单Id

                //时间
                reserveTime:'',
                requireTime:'',
                reserve:'',
                presetTime:'',//可选择时间年月日数组
                firstPresetTime:'',
                reTime:'',
                setTimeoutTimer:'',
                timer:'',

                //时间弹出框
                timeShow:false,//时间选择的显示隐藏
                unClickDataIndex:'',//点击选择时间的时分的index
                dataIndex:'',//点击选择时间的时分的备份index
                timeArr:[],//可选择时间的时分数组
                timeArrIndex:-1,//点击选择时间的时分的index，默认为-1表示为立即送出
                today:'',//今天的日期

                //每隔一分钟刷新一次时间
                clickTimeArr:[],//选择后的timeArr
                clickToday:'',//选择后的today

                //添加订单
                orderId:'',
                orderNo:'',
                dsm:'',
                boxFees:'',
                totalprice:'',
                totalnumb:'',
                true_pay:'',
                youhuiList:'',
                yhMoney:'',//优惠的价格
                payYes:false,

                //红包
                hongbaoDeduction:0,//红包优惠金额
                hongbaoTemp:[{
                    "id": 50,
                    "money": 50,
                    "piece": 30,
                    "end_time": "2018-11-03"
                },
                    {
                        "id": 51,
                        "money": 30,
                        "piece": 20,
                        "end_time": "2018-11-03"
                    },
                    {
                        "id": 55,
                        "money": 4,
                        "piece": 3,
                        "end_time": "2018-11-03"
                    }],//可用红包
                hongbaoTempIndex:-1,

                //通用
                userId:0,
                token:'',
                imei:'',
                userPhone:'',

                touch:false,//用于获取焦点和失去焦点的兼容
                inputFocus:true,
                blurPrevent:false,//阻止多次失去焦点的定时器
                blurPreventSec:false,
                inputDisabled:false,//防止长按复制粘贴的时候底部消失

            }
        },
        created(){
            var that=this
            event.init()

            that.token = weex.config.token;
            that.imei = weex.config.imei;
            that.userId = weex.config.userId;
            that.userName = weex.config.userName;
            var shopInfo=JSON.parse(event.find('shopInfo'))

            that.shopInfo=shopInfo
            var param=JSON.parse(weex.config.param)
            var shopType=param.shopType
            that.shopType=shopType
            that.orderType=param.orderType
            if(param.deskArr){
                that.deskArr=param.deskArr
            }
            that.isOpen=shopInfo.dpzt
            if(param.shareId){
                that.shareId=param.shareId
                that.shareOrderList=param.shareOrderList
                that.tablewareSelectNumber=that.shareOrderList.length>11?'11':that.shareOrderList.length
            }else{
                var orderfood=JSON.parse(event.find(shopInfo.shopId+'orderFood'+shopType))
                that.dishLength=orderfood.length>3?false:true
                var orderfoodBegain = JSON.parse(JSON.stringify(orderfood))
                for (var i in orderfoodBegain) {
                    var arr = ''
                    if (orderfoodBegain[i].zkGoodsId && orderfoodBegain[i].buyNum != -1 && orderfoodBegain[i].numb != orderfoodBegain[i].preferentialNumb) { //折扣
                        if (orderfoodBegain[i].preferentialNumb == 0) {
                            orderfood[i].zkGoodsId = ''
                            orderfood[i].shopPrice = orderfood[i].marketPrice
                        } else if (Number(orderfoodBegain[i].numb) - Number(orderfoodBegain[i].preferentialNumb) > 0) {
                            arr = orderfoodBegain[i]
                            arr.zkGoodsId = ''
                            arr.shopPrice = arr.marketPrice
                            arr.numb = Number(arr.numb) - Number(arr.preferentialNumb)
                            arr.totalPrice = arr.totalMarketPrice = (Number(arr.shopPrice) * Number(arr.numb)).toFixed(2)
                            orderfood.push(arr)
                            orderfood[i].numb = Number(arr.preferentialNumb)
                            orderfood[i].totalPrice = (Number(orderfood[i].shopPrice) * Number(orderfood[i].numb)).toFixed(2)
                            orderfood[i].totalMarketPrice = (Number(orderfood[i].marketPrice) * Number(orderfood[i].numb)).toFixed(2)
                        }
                    }
                }
                that.orderfood=orderfood
            }
            //如果有缓存地址，则获取地址
            if(that.orderType==0&&event.find('orderPageAddress')){
                that.address=JSON.parse(event.find('orderPageAddress'))
            }
            //送达时间的处理
            that.serviceTime()
            if (that.reserve != 1) {
                var dateN = that.GLOBAL.formatTime(new Date())
                that.today=dateN
            }
            if (that.presetTime.length > 0) {
                that.dataIndex=that.presetTime[0].days
                that.unClickDataIndex=that.presetTime[0].days
            }
            if (that.orderType == 6||that.orderType == 7) {
                that.addTgOrder()
            } else if(that.shareId){
                that.addPdOrder()
            }else{
                that.addOrder()
            }
            //是否支持发票并获取默认发票信息
            if(that.shopInfo.fp==1&&event.find('defaultInvoice')){
                that.choiceInvoice=JSON.parse(event.find('defaultInvoice'))
            }

            // })
        },
        mounted(){
            var that=this
            that.refreshServiceTime()  //隔一分钟刷新一次时间
            if(that.orderType==5){
                setTimeout(function () {
                    that.$refs.ref_phone.setTextFormatter({
                        formatRule: "/(\\.\\d{2})(\\S+)/",
                        formatReplace: "$1",
                        recoverRule: "/\\./g",
                        recoverReplace: ""
                    })
                },0)
            }

        },
        methods: {
            //送达时间的处理
            serviceTime() {
                var that=this
                var shopInfo = that.shopInfo
                var isOpen=that.isOpen
                var orderType=that.orderType
                var now = that.GLOBAL.formatTimes(new Date())
                now = that.GLOBAL.formateIOS(now)
                if (orderType== 5) {
                    if (isOpen == 1) {
                        var reserveTime = that.GLOBAL.addMinutes(new Date(), shopInfo.choiceMealTime) //当前时间加上商家的备餐格式:(12:22)
                    } else {
                        var dateN = that.GLOBAL.formatTime(new Date())
                        for (var i = shopInfo.serviceTime.length - 1; i >= 0; i--) { //商家休息的时候，reserveTime的值
                            if (now > that.GLOBAL.formateIOS(dateN + ' ' + shopInfo.serviceTime[i].serviceEndTime + ":00")) {
                                if (i == shopInfo.serviceTime.length - 1) {
                                    var datestr = that.GLOBAL.formateIOS(dateN + ' ' + shopInfo.serviceTime[0].serviceStartTime + ":00")
                                } else {
                                    var datestr = that.GLOBAL.formateIOS(dateN + ' ' + shopInfo.serviceTime[i + 1].serviceStartTime + ":00")
                                }
                                break;
                            } else {
                                var datestr = that.GLOBAL.formateIOS(dateN + ' ' + shopInfo.serviceTime[0].serviceStartTime + ":00")
                            }
                        }
                        var reserveTime = that.GLOBAL.addMinutes(datestr, shopInfo.choiceMealTime)
                    }
                } else {
                    if (isOpen == 1) {
                        var reserveTime = that.GLOBAL.addMinutes(new Date, shopInfo.deliveryCostTime) //当前时间加上商家的配送时间格式:(12:22)

                    } else {
                        var dateN = that.GLOBAL.formatTime(new Date)
                        for (var i = shopInfo.serviceTime.length - 1; i >= 0; i--) {
                            if (now > that.GLOBAL.formateIOS(dateN + ' ' + shopInfo.serviceTime[i].serviceEndTime + ":00")) {
                                if (i == shopInfo.serviceTime.length - 1) {
                                    var datestr = that.GLOBAL.formateIOS(dateN + ' ' + shopInfo.serviceTime[0].serviceStartTime + ":00")
                                } else {
                                    var datestr = that.GLOBAL.formateIOS(dateN + ' ' + shopInfo.serviceTime[i + 1].serviceStartTime + ":00")
                                }
                                break;
                            } else {
                                var datestr = that.GLOBAL.formateIOS(dateN + ' ' + shopInfo.serviceTime[0].serviceStartTime + ":00")
                            }
                        }
                        var reserveTime = that.GLOBAL.addMinutes(datestr, shopInfo.deliveryCostTime)
                    }
                }

                var dateN = that.GLOBAL.formatTime(new Date)
                var datestr = that.GLOBAL.formateIOS(dateN + ' ' + "00:00:00")

                //预订时间
                var now = that.GLOBAL.formatTimes(new Date)
                now = that.GLOBAL.formateIOS(now)
                var endTime = that.GLOBAL.formateIOS(dateN + ' ' + shopInfo.serviceTime[shopInfo.serviceTime.length - 1].serviceEndTime + ":00")
                if ((shopInfo.reserve == 1 && orderType == 0) || (shopInfo.selfReserve == 1 && orderType == 5)) {
                    if (orderType == 5) {
                        var scheduledDate = shopInfo.selfScheduledDate
                    } else {
                        var scheduledDate = shopInfo.scheduledDate
                    }

                    scheduledDate = scheduledDate.split(",");
                    var presetTime = []

                    for (var i in scheduledDate) {
                        var today = that.GLOBAL.addDay(datestr, scheduledDate[i] - 1)
                        if (scheduledDate[i] == 1) {
                            today = '今天'
                        }
                        if (scheduledDate[i] == 2) {
                            today = '明天'
                        }
                        var presetTimeItem = {
                            days: scheduledDate[i] - 1,
                            today: today
                        }
                        presetTime.push(presetTimeItem)

                    }
                    if (now > endTime && presetTime[0].days == 0) { //如果当前时间超出结束营业时间且预订时间含有今天则删除掉今天
                        presetTime.splice(0, 1)
                    }

                    that.presetTime=presetTime
                    that.firstPresetTime=presetTime[0]
                } else {
                    var presetTime = []
                    var scheduledDate = [1]
                    var presetTimeItem = {
                        days: 0,
                        today: '今天'
                    }
                    presetTime.push(presetTimeItem)
                    that.presetTime=presetTime
                    that.firstPresetTime=presetTime[0]
                }
                if (scheduledDate == 1 || scheduledDate[0] == 1) {
                    if (isOpen == 2) {
                        var requireTime = ''
                    } else {
                        if (orderType == 5) {
                            var reserveTimeYear = that.GLOBAL.reserveTimeYear(new Date, shopInfo.choiceMealTime) //当前时间加上商家的备餐时间格式:(2018-10-15 55:22:00)
                        } else {
                            var reserveTimeYear = that.GLOBAL.reserveTimeYear(new Date, shopInfo.deliveryCostTime) //当前时间加上商家的配送时间格式:(2018-10-15 55:22:00)
                        }

                        var requireTime = that.GLOBAL.formatTime(that.GLOBAL.formateIOS(reserveTimeYear)) + ' ' + reserveTime //默认的请求送达时间

                    }
                    if (orderType != 5 && isOpen == 1) {
                        that.reserveTime="尽快到达|预计" + reserveTime
                    } else {
                        that.reserveTime=reserveTime
                    }


                } else {
                    var requireTime = ''
                    reserveTime = ''
                }
                if (orderType == 5) {
                    that.reserve=shopInfo.selfReserve
                } else {
                    that.reserve=shopInfo.reserve
                }
                that.requireTime=requireTime
                that.reTime=reserveTime
            },
            //隔一分钟刷新一次时间
            refreshServiceTime: function() {
                var that = this
                var now = that.GLOBAL.formatTimes(new Date())
                now = now.split(':')[2]
                var countDown = (60 - Number(now)) * 1000
                var setTimeoutTimer = setTimeout(function() { //延迟执行确保整点刷新时间

                    var unClickDataIndex = that.unClickDataIndex
                    var presetTime = that.presetTime
                    that.serviceTime()
                    if (that.reserve == 1 && presetTime) {
                        if (presetTime[0].days == 0 && unClickDataIndex == 0) {
                            that.timeOfToday() //当前时间
                        }
                        var timeArrIndex = that.timeArrIndex
                        if (timeArrIndex != -1) {
                            var time = that.clickTimeArr[timeArrIndex]
                            that.requireTime=that.clickToday + " " + time
                            that.reserveTime=that.clickToday + " " + time

                        }
                    }
                    //整点刷新时间后每隔1分钟刷新一次时间
                    var timer = setInterval(function() {
                        that.serviceTime()
                        console.log(3)
                        var unClickDataIndex = that.unClickDataIndex
                        if (that.reserve == 1 && presetTime) {
                            if (presetTime[0].days == 0 && unClickDataIndex == 0) {
                                that.today() //当前时间
                            }
                            var timeArrIndex = that.timeArrIndex
                            if (timeArrIndex != -1) {
                                var time = that.clickTimeArr[timeArrIndex]
                                that.requireTime=that.clickToday + " " + time
                                that.reserveTime=that.clickToday + " " + time
                            }

                        }
                    }, 60000)

                    that.timer=timer

                }, countDown)

                that.setTimeoutTimer=setTimeoutTimer

            },
            //添加普通订单
            addOrder() {

                var that = this;

                var orderfood = JSON.stringify(that.orderfood);
                console.log(orderfood)
                var shopInfo = that.shopInfo;
                var orderType = that.orderType;
                var shopId = shopInfo.shopId;
                var deskNum = that.deskNum? that.deskNum : 0;
                var deskArr = that.deskArr ? JSON.stringify(that.deskArr) : 0;
                var hongbaoId = that.hongbaoId ? that.hongbaoId : 0;
                var param=that.GLOBAL.sign(that.token,that.imei)
                param+= '&orderfood=' + orderfood +'&shopId=' + shopId +'&orderType=' + orderType +'&deskNum=' + deskNum+'&deskArr=' +deskArr+'&redpacketId=' + hongbaoId;

                var url = 'https://www.aftdc.com/userapp/Index/addOrder'
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    url: url,
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                }, function (res) {

                    if (res.data.res == 1) {
                        that.orderId = res.data.data.orderId
                        that.orderNo = res.data.data.orderNo
                        that.dsm=res.data.data.peisongMoney
                        that.boxFees=res.data.data.allBoxMoney
                        that.totalprice=res.data.data.allMoney
                        that.totalnumb=res.data.data.allNum
                        that.hongbaoTemp=res.data.data.hongbao
                        that.true_pay=res.data.data.needPay
                        that.youhuiList=res.data.data.youhui
                        that.yhMoney=that.true_pay==0?that.totalprice:parseInt(that.totalprice * 100 - that.true_pay * 100+that.dsm*100+that.boxFees*100) / 100
                        that.payYes=true
                    } else {
                        modal.alert({
                            message:res.data.info,
                            okTitle:'好的',
                        },function (value) {
                            event.backToIndex(2);
                        })

                        that.submit='pay'
                        that.payYes=false

                    }
                })

            },
            //添加团购、代金券订单
            addTgOrder(){
                var that = this;

                var orderfood = JSON.stringify(that.orderfood);
                var shopInfo = that.shopInfo;
                var orderType = that.orderType;
                var shopId = shopInfo.shopId;
                var groupType=orderType==6?1:2
                var param=that.GLOBAL.sign(that.token,that.imei)
                param+= '&orderfood=' + orderfood +'&shopId=' + shopId +'&orderType=' + orderType +'&groupType=' + groupType;
                var url = 'https://www.aftdc.com/userapp/Index/addTgOrder'
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    url: url,
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                }, function (res) {
                    console.log(param)
                    if (res.data.res == 1) {

                        that.orderId = res.data.data.orderId
                        that.orderNo = res.data.data.orderNo
                        that.totalprice=res.data.data.allMoney
                        that.totalnumb=res.data.data.allNum
                        that.true_pay=res.data.data.needPay
                        that.youhuiList=res.data.data.youhui
                        that.yhMoney=that.true_pay==0?that.totalprice:parseInt(that.totalprice * 100 - that.true_pay * 100) / 100
                        that.payYes=true
                    } else {
                        modal.alert({
                            message:res.data.info,
                            okTitle:'好的',
                        },function (value) {
                            event.backToIndex(2);
                        })

                        that.payYes=false

                    }
                })

            },
            //添加拼单订单
            addPdOrder(){
                var that=this
                var param=that.GLOBAL.sign(that.token,that.imei)
                param+='&shareId='+that.shareId+'&shopId='+that.shopInfo.shopId+'&redpacketId='+that.redpacketId
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/userapp/Index/addPdOrder',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                }, function (res) {
                    if (res.data.res == 1) {
                        that.orderId = res.data.data.orderId
                        that.orderNo = res.data.data.orderNo
                        that.dsm=res.data.data.peisongMoney
                        that.boxFees=res.data.data.allBoxMoney
                        that.totalprice=res.data.data.allMoney
                        that.totalnumb=res.data.data.allNum
                        that.hongbaoTemp=res.data.data.hongbao
                        that.true_pay=res.data.data.needPay
                        that.youhuiList=res.data.data.youhui
                        that.yhMoney=that.true_pay==0?that.totalprice:parseInt(that.totalprice * 100 - that.true_pay * 100+that.dsm*100+that.boxFees*100) / 100
                        that.payYes=true
                    } else {
                        modal.alert({
                            message:res.data.info,
                            okTitle:'好的',
                        },function (value) {
                            event.backToIndex(2);
                        })

                        that.submit='pay'
                        that.payYes=false

                    }
                })
            },
            upOrder(){
                var that = this
                const toast=that.$refs.toast
                var orderType=that.orderType
                if (!that.address  && orderType == 0) {
                    toast.editContent('请选择收货地址')
                    return false;
                }
                if (orderType == 3) {
                    var userName = that.deskArr.inputName
                    var userPhone = that.deskArr.inputPhone
                    that.requireTime = that.deskArr.reachTime;
                    var address = '堂食预订'
                    var lat = 0
                    var lng = 0
                } else if (orderType == 5) {
                    var userName = that.userName
                    var userPhone = that.userPhone
                    if(!userPhone||!(/^((\+?86)|(\(\+86\)))?1[34578]\d{9}$/.test(userPhone))){
                        toast.editContent('自取手机号码错误')
                        return false
                    }
                    var address = '到店自取'
                    var lat = 0
                    var lng = 0
                } else {
                    var userName = that.address.userName
                    var userPhone = that.address.userPhone

                    var address = that.address.address+' '+that.address.detailed
                    var lat = that.address.latitude
                    var lng = that.address.longitude
                }
                if (orderType == 5 && !that.agreement) {
                    toast.editContent('未同意到店自取服务协议')
                    return false
                }
                var payYes = that.payYes
                if (!payYes) {
                    toast.editContent('购买金额不够')
                    return false
                }
                //送达时间
                if (!that.requireTime) {
                    toast.editContent('未选择送达时间')
                    return false
                }

                var shopInfo = that.shopInfo
                if (orderType == 5) {
                    var reserveTimeYear = that.GLOBAL.reserveTimeYear(new Date(), shopInfo.choiceMealTime) //当前时间加上商家的备餐时间格式:(2018-10-15 55:22:00)
                } else {
                    var reserveTimeYear = that.GLOBAL.reserveTimeYear(new Date(), shopInfo.deliveryCostTime) //当前时间加上商家的配送时间格式:(2018-10-15 55:22:00)
                }
                var distributionNow = 0
                if (orderType != 3) {
                    if (that.GLOBAL.formateIOS(reserveTimeYear) >= that.GLOBAL.formateIOS(that.requireTime + ':00')) {
                        distributionNow = 1 //立即送达
                    } else {
                        distributionNow = 0 //预订
                    }
                }


                var shopName = shopInfo.shopName
                var orderRemarks = that.remarksContent//备注
                if (that.billSwitch) {
                    var billId = that.choiceInvoice.id //发票Id
                    if (!billId) {
                        toast.editContent('请选择发票')
                        return false
                    }
                } else {
                    var billId = 0
                }

                if (orderType == 0) {
                    var deskNum = -1
                } else {
                    var deskNum = that.deskNum
                }
                // var openid = wx.getStorageSync('usersInfo').openid
                var pickNumb = that.tablewareSelectNumber
                var param=that.GLOBAL.sign(that.token,that.imei)
                param+= '&orderId=' + that.orderId +'&shopId=' + shopInfo.shopId +'&userPhone=' + userPhone +'&userName=' + userName+'&address=' +address+'&orderRemarks=' + orderRemarks
                    +'&requireTime=' +that.requireTime+'&lat=' + lat+'&lng=' +lng+'&pickNumb=' + pickNumb+'&distributionNow=' + distributionNow+'&billId=' + billId;
                var url = 'https://www.aftdc.com/userapp/Index/upOrder'
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    url: url,
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                }, function (res) {
                    console.log(JSON.stringify(res))
                    if(res.data.res==1){
                        if(res.data.data.type==2){
                            event.wxpay(JSON.stringify(res.data.data.payParem))
                        }else if(res.data.data.needPay==0&&res.data.data.type==1){
                            const toast=that.$refs.toast
                            toast.editContent(res.data.info)
                            setTimeout(function () {
                                that.jumpToOrderDetails(1)
                            },1000)
                        }
                    }
                    if (res.data.res == 0) {
                        modal.alert({
                            message:res.data.info,
                            okTitle:'好的',
                        },function (value) {
                            event.backToIndex(2);
                        })
                        return false
                    }
                })
            },
            upTgOrder(){
                var that=this
                var param=that.GLOBAL.sign(that.token,that.imei)
                param+= '&orderId=' + that.orderId
                var url = 'https://www.aftdc.com/userapp/Index/upTgOrder'
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    url: url,
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                }, function (res) {
                    if(res.data.res==1){
                        if(res.data.data.type==2){
                            event.wxpay(JSON.stringify(res.data.data.payParem))
                        }else if(res.data.data.needPay==0&&res.data.data.type==1){
                            const toast=that.$refs.toast
                            toast.editContent(res.data.info)
                            setTimeout(function () {
                                that.jumpToOrderDetails(1)
                            },1000)
                        }
                    }
                    if (res.data.res == 0) {
                        modal.alert({
                            message:res.data.info,
                            okTitle:'好的',
                        },function (value) {
                            event.backToIndex(2);
                        })
                        return false
                    }
                })
            },


            minibarLeftButtonClick(){},
            pouponClick(index,price,id){
                var that=this
                that.hongbaoTempIndex=index
                that.hongbaoDeduction=price
                that.hongbaoId=id
                that.redEnvelopesShow=false;
                if(that.shareId){
                    that.addPdOrder()
                }else{
                    that.addOrder()
                }

            },
            redEnvelopesShowClick(index){
                var that=this;
                that.redEnvelopesShow=true;
                setTimeout(function () {
                    dom.scrollToElement(that.$refs.redItem[index])
                },100)
            },
            noRedEnvelopesShowClick(){
                var that=this;
                that.redEnvelopesShow=false;
                that.hongbaoDeduction=0;
                that.hongbaoTempIndex=-1
                that.hongbaoId=''
                that.addOrder()
            },
            couponClick(index){
                var that=this;
                that.couponShow=true;
                setTimeout(function () {
                    dom.scrollToElement(that.$refs.couponItem[index])
                },50)
            },
            noCouponClick(){
                this.couponShow=false;
                this.couponValue2='';
                this.bridgingCoupon=0;
                for(var i in this.couponList){
                    this.couponList[i].redEnvelopesSelect=false;
                }
            },
            redEnvelopesClick(){
                if(this.redEnvelopes==true){
                    this.redEnvelopes=false;
                }
                else{
                    this.redEnvelopes=true;
                }
            },
            onSelTime() {
                var that = this
                var shopInfo =that.shopInfo
                that.unClickDataIndex=that.dataIndex
                var presetTime = that.presetTime
                if (that.reserve == 1) {
                    if (presetTime) {
                        if (that.unClickDataIndex == 0) {

                            that.timeOfToday() //当前时间
                        } else {
                            var days = that.unClickDataIndex
                            var dateN = that.GLOBAL.formatTime(new Date())
                            //获取可选预计的时间
                            var timeArr = [];
                            for (var j = 0; j < shopInfo.serviceTime.length; j++) {
                                var addTime = shopInfo.serviceTime[j].serviceStartTime
                                var datestr = that.GLOBAL.formateIOS(dateN + ' ' + addTime + ":00")
                                if (that.orderType == 5) {
                                    var addTime = that.GLOBAL.addMinutes(datestr, shopInfo.choiceMealTime) //开始时间加备餐
                                } else {
                                    var addTime = that.GLOBAL.addMinutes(datestr, shopInfo.deliveryCostTime) //开始时间加配送时间
                                }


                                timeArr.push(addTime)
                                var timeEnd = false
                                for (var i = 0; i < 50; i++) {
                                    var datestr = that.GLOBAL.formateIOS(dateN + ' ' + addTime + ":00")
                                    var addTime = that.GLOBAL.addMinutes(datestr, 30)
                                    if (datestr >= that.GLOBAL.formateIOS(dateN + ' ' + shopInfo.serviceTime[j].serviceEndTime + ":00")) {
                                        if (datestr != that.GLOBAL.formateIOS(dateN + ' ' + shopInfo.serviceTime[j].serviceEndTime + ":00")) {
                                            timeEnd = true
                                        }
                                        break;
                                    } else if (datestr >= that.GLOBAL.formateIOS(dateN + ' ' + "23:30" + ":00")) {
                                        timeArr.push(addTime)
                                        timeEnd = true
                                        break;
                                    } else {
                                        timeArr.push(addTime)
                                    }
                                }
                                var datestr = that.GLOBAL.formateIOS(dateN + ' ' + "00:00:00")
                                var today = that.GLOBAL.addDay(datestr, days)
                                timeArr.pop()
                                if (timeEnd) {
                                    var addTime = shopInfo.serviceTime[j].serviceEndTime
                                    timeArr.push(addTime)
                                }
                            }
                            that.timeArr=timeArr
                            that.today=today
                            that.dataIndex=days
                        }
                    }

                }
                that.timeShow=true
                setTimeout(()=>{
                    dom.scrollToElement(that.$refs.ref_presetTime[that.unClickDataIndex])
                    if(that.timeArrIndex==-1){
                        dom.scrollToElement(that.$refs.ref_timeArrOfNow)
                    }else{
                        dom.scrollToElement(that.$refs.ref_timeArr[that.timeArrIndex])
                    }

                },300)
            },
            //点击选择今天的时间
            timeOfToday(){
                var that=this
                if (that.reserve != 1) {
                    return false
                }
                var dateN = that.GLOBAL.formatTime(new Date())
                var addTime = that.reTime
                var shopInfo = that.shopInfo
                //获取可选预计的时间
                var timeArr = [];
                if (that.isOpen == 2) {
                    timeArr.push(that.reTime)
                }
                for (var j = 0; j < shopInfo.serviceTime.length; j++) {
                    if (that.GLOBAL.formateIOS(dateN + ' ' + addTime + ":00") < that.GLOBAL.formateIOS(dateN + ' ' + shopInfo.serviceTime[j].serviceStartTime + ":00")) {
                        var addTime = shopInfo.serviceTime[j].serviceStartTime
                    }
                    if (that.orderType == 5) {
                        var reserveTimeYear = that.GLOBAL.reserveTimeYear(new Date(), shopInfo.choiceMealTime) //当前时间加上商家的备餐时间格式:(2018-10-15 55:22:00)
                    } else {
                        var reserveTimeYear = that.GLOBAL.reserveTimeYear(new Date(), shopInfo.deliveryCostTime) //当前时间加上商家的配送时间格式:(2018-10-15 55:22:00)
                    }



                    var timeEnd = false
                    if (that.GLOBAL.formateIOS(reserveTimeYear) < that.GLOBAL.formateIOS(dateN + ' ' + shopInfo.serviceTime[j].serviceEndTime + ":00")) {
                        for (var i = 0; i < 50; i++) {
                            var datestr = that.GLOBAL.formateIOS(dateN + ' ' + addTime + ":00")

                            var addTime = that.GLOBAL.addMinutes(datestr, 15)
                            if (datestr >= that.GLOBAL.formateIOS(dateN + ' ' + shopInfo.serviceTime[j].serviceEndTime + ":00")) {
                                if (datestr != that.GLOBAL.formateIOS(dateN + ' ' + shopInfo.serviceTime[j].serviceEndTime + ":00")) {
                                    timeEnd = true
                                }
                                break;
                            } else if (datestr >= that.GLOBAL.formateIOS(dateN + ' ' + "23:45" + ":00")) {
                                timeArr.push(addTime)
                                timeEnd = true
                                break;
                            } else {
                                timeArr.push(addTime)
                            }
                        }


                        timeArr.pop()
                        if (timeEnd) {
                            var addTime = shopInfo.serviceTime[j].serviceEndTime
                            timeArr.push(addTime)
                        }
                    }
                }

                that.timeArr=timeArr
                that.today=that.GLOBAL.formatTime(that.GLOBAL.formateIOS(reserveTimeYear))
                that.unClickDataIndex=0
                //自动滚动处理
                setTimeout(()=> {
                    if (that.unClickDataIndex == that.dataIndex) {
                        if (that.timeArrIndex == -1) {
                            dom.scrollToElement(that.$refs.ref_timeArrOfNow)
                        } else {
                            dom.scrollToElement(that.$refs.ref_timeArr[that.timeArrIndex])
                        }
                    } else {
                        dom.scrollToElement(that.$refs.ref_timeArrOfNow)
                    }
                },100)
            },
            //点击选择其他日期的时间
            timeOfOtherDaty(days){
                var that=this
                var dateN = that.GLOBAL.formatTime(new Date())
                var shopInfo = that.shopInfo
                //获取可选预计的时间
                var timeArr = [];
                for (var j = 0; j < shopInfo.serviceTime.length; j++) {
                    var addTime = shopInfo.serviceTime[j].serviceStartTime
                    var datestr = that.GLOBAL.formateIOS(dateN + ' ' + addTime + ":00")
                    if (that.orderType == 5) {
                        var addTime = that.GLOBAL.addMinutes(datestr, shopInfo.choiceMealTime) //开始时间加备餐
                    } else {
                        var addTime = that.GLOBAL.addMinutes(datestr, shopInfo.deliveryCostTime) //开始时间加配送时间
                    }

                    timeArr.push(addTime)
                    var timeEnd = false
                    for (var i = 0; i < 50; i++) {
                        var datestr = that.GLOBAL.formateIOS(dateN + ' ' + addTime + ":00")
                        var addTime = that.GLOBAL.addMinutes(datestr, 30)
                        if (datestr >= that.GLOBAL.formateIOS(dateN + ' ' + shopInfo.serviceTime[j].serviceEndTime + ":00")) {
                            if (datestr != that.GLOBAL.formateIOS(dateN + ' ' + shopInfo.serviceTime[j].serviceEndTime + ":00")) {
                                timeEnd = true
                            }
                            break;
                        } else if (datestr >= that.GLOBAL.formateIOS(dateN + ' ' + "23:30" + ":00")) {
                            timeArr.push(addTime)
                            timeEnd = true
                            break;
                        } else {
                            timeArr.push(addTime)
                        }
                    }

                    var datestr = that.GLOBAL.formateIOS(dateN + ' ' + "00:00:00")
                    var today = that.GLOBAL.addDay(datestr, days)
                    timeArr.pop()
                    if (timeEnd) {
                        var addTime = shopInfo.serviceTime[j].serviceEndTime
                        timeArr.push(addTime)
                    }
                }
                that.timeArr=timeArr
                that.today=today
                that.unClickDataIndex=days
                //自动滚动处理
                setTimeout(()=>{
                    if(that.unClickDataIndex==that.dataIndex){
                        dom.scrollToElement(that.$refs.ref_timeArr[that.timeArrIndex])
                    }else{
                        dom.scrollToElement(that.$refs.ref_timeArr[0])
                    }
                },100)

            },
            //选择当前时间的时间
            choiceTimeOfNow(){
                var that=this
                var time=that.reTime
                that.requireTime=that.today + " " + time
                that.reserveTime=that.today + " " + time
                that.timeArrIndex=-1
                that.dataIndex=that.unClickDataIndex
                that.$refs.ref_timeShow.hide()
            },
            //选择非当前时间的时间
            choiceTime(time,index) {
                var that=this
                that.requireTime=that.today + " " + time
                that.reserveTime=that.today + " " + time
                that.timeArrIndex=index
                that.dataIndex=that.unClickDataIndex
                that.clickTimeArr=that.timeArr
                that.clickToday=that.today
                that.$refs.ref_timeShow.hide()
            },
            //添加订单
            bill: function () {
                var that = this
                if (that.billSwitch == false) {

                    var testEl = this.$refs.test1;
                    var testE2 = this.$refs.test2;
                    if (that.startSwitch == true) {
                        var transform = 'translate(0px, 0px)';
                    } else {
                        var transform = 'translate(52px, 0px)';
                    }
                    animation.transition(testEl, {
                        styles: {
                            transform: transform,
                        },
                        duration: 500, //ms
                        timingFunction: 'ease',
                        delay: 0 //ms
                    })
                    animation.transition(testE2, {
                        styles: {
                            backgroundColor: '#4ed465',
                        },
                        duration: 500, //ms
                        timingFunction: 'ease',
                        delay: 0 //ms
                    })
                    that.billSwitch = !that.billSwitch
                } else {

                    var testEl = this.$refs.test1;
                    var testE2 = this.$refs.test2;
                    if (that.startSwitch == true) {
                        var transform = 'translate(-52px, 0px)';
                    } else {
                        var transform = 'translate(0px, 0px)';
                    }
                    animation.transition(testEl, {
                        styles: {
                            transform: transform,
                        },
                        duration: 500, //ms
                        timingFunction: 'ease',
                        delay: 0 //ms
                    })
                    animation.transition(testE2, {
                        styles: {
                            backgroundColor: '#e2e2e2',
                        },
                        duration: 500, //ms
                        timingFunction: 'ease',
                        delay: 0 //ms
                    })
                    that.billSwitch = !that.billSwitch
                }

            },
            popupOverlayBottomClick(){
                this.tablewareShow=false;
                this.timeShow=false;
                this.timeShow2=false;
            },
            tablewareClick(index){
                this.tablewareSelectNumber=this.tablewareSelectList[index].people;
                this.tablewareShow=false;
                for(var i in this.tablewareSelectList){
                    this.tablewareSelectList[i].style=false;
                }
                this.tablewareSelectList[index].style=true;
                this.bridging=index;
            },
            selectClick(index){
                var that=this;
                that.tablewareShow=true;
                setTimeout(function () {

                    dom.scrollToElement(that.$refs.itemA[index],{})
                },100)
            },
            tablewareCancelClick(){
                this.tablewareShow=false;
            },
            tablewareCancelClickTwo(){
                this.timeShow=false;
                this.timeShow2=false;
            },
            unfoldClick(){
                if(this.dishLength){
                    this.dishLength=false;
                    this.moveTwo();
                    dom.scrollToElement(this.$refs.scrollTest)
                }
                else {
                    this.dishLength=true;
                    this.moveOne();
                }
            },

            // 点击展开收起的动画
            moveOne() {
                var testEl = this.$refs.test;
                animation.transition(testEl, {
                    styles: {
                        transform: 'rotateX(180deg)',
                        transformOrigin: 'center center'
                    },
                    duration: 800, //ms
                    timingFunction: 'ease',
                    delay: 0 //ms
                })
            },
            moveTwo() {
                var testEl = this.$refs.test;
                animation.transition(testEl, {
                    styles: {
                        transform: 'rotateX(0deg)',
                        transformOrigin: 'center center'
                    },
                    duration: 800, //ms
                    timingFunction: 'ease',
                    delay: 0 //ms
                })
            },


            distributionClick(index){
                this.option=index;
            },
            agreementClick(){
                if(this.agreement){
                    this.agreement=false;
                }
                else{
                    this.agreement=true;
                }
            },
            wxcMaskSetHidden(){
                this.couponShow=false;
                this.redEnvelopesShow=false;
            },
            toReceivingAddress:GLOBAL.throttle(function(){
                var that=this
                var shopInfo = that.shopInfo
                var param={shopId:shopInfo.shopId,longitude:shopInfo.longitude,latitude:shopInfo.latitude,source:0};
                var url='http://assets/receivingAddress.js';
                event.toUrl({"url":url,"param":JSON.stringify(param)})
            }),
            toPreferentialRules:GLOBAL.throttle(function(){
                var param='';
                var url='http://assets/preferentialRules.js';
                event.toUrl({"url":url,"param":param})
            }),
            toAddRemarks:GLOBAL.throttle(function(){
                var that=this
                var remarks=that.remarksContent
                var param=remarks
                event.save('remarks',param)
                var param='';
                var url='http://assets/addRemarks.js';
                event.toUrl({"url":url,"param":param})
            }),
            toNumberProtection:GLOBAL.throttle(function(){
                var param='';
                var url='http://assets/numberProtection.js';
                event.toUrl({"url":url,"param":param})
            }),
            toInvoiceClick:GLOBAL.throttle(function(){
                var that=this
                if(that.choiceInvoice){
                    var param={invoiceType:0,invoiceId:that.choiceInvoice.id}
                }else {
                    var param = {invoiceType: 0}
                }
                var url='http://assets/invoice.js';
                event.toUrl({"url":url,"param":JSON.stringify(param)})
            }),
            jumpToOrderDetails(toggle){
                var that=this
                if(that.shareId||that.shopType==5){
                    event.backToIndex(2)
                }else{
                    event.backToIndex(1)
                }
                event.delete(that.shopInfo.shopId+'orderFood'+that.shopType)
                if(that.shopType==6||that.shopType==8){
                    if(toggle!=1){
                        var param={orderId:that.orderId,tk:1}
                        var url='http://assets/orderDetails.js';
                        event.toUrl({"url":url,"param":JSON.stringify(param)})
                    }else{
                        var param={orderId:that.orderId,shopType:that.shopType,orderType:that.orderType}
                        var url='http://assets/detailsOfGroupAndVoucher.js';
                        event.toUrl({"url":url,"param":JSON.stringify(param)})
                    }
                }else{
                    var param={orderId:that.orderId,tk:0}
                    var url='http://assets/orderDetails.js';
                    event.toUrl({"url":url,"param":JSON.stringify(param)})
                }


            },
            // input的获取焦点和失去焦点
            touchmove(){
                this.touch=true;
            },
            touchstart(){
                this.inputDisabled=false
            },
            touchend(){
                this.touch=false;

            },
            scrollMove(){
                if(this.touch){
                    this.blur()
                }
            },
            longpress(){
                var that=this
                if(that.inputFocus){
                    that.inputDisabled=true
                }

            },
            //键盘弹起后点击其他地方收起键盘
            allFocus(){
                var that=this;
                if(that.inputDisabled){
                    return false
                }
                that.inputFocus=false;
                if(that.blurPrevent){
                    that.blurPreventSec=true;
                }
                else{
                    that.blurPreventSec=false;
                }
                // that.aa=true;
                setTimeout(function () {
                    that.blurPrevent = true;
                },80)
                setTimeout(function () {
                    that.blurPreventSec=false;
                },320)

            },
            allBlur(){
                var that=this;
                setTimeout(function () {
                    if(that.blurPreventSec){
                        setTimeout(function () {
                            that.blurPreventSec=false;
                        },40)
                    }
                    else{
                        that.inputFocus=true;
                        that.blurPrevent = false;
                    }
                }, 200)
            },
            blur(){
                var that=this
                that.$refs.ref_phone.blur()
            },

            viewappear(){
                var that=this
                if (!that.pageBack) { return; }
                that.pageBack = false;
                //地址
                if(event.find('orderPageAddress')){
                    that.address=JSON.parse(event.find('orderPageAddress'))
                }
                //备注
                if(event.find('remarks')){//备注
                    that.remarksContent=event.find('remarks')
                    event.delete('remarks')
                }
                //发票
                if(that.billSwitch&&event.find('choiceInvoice')){
                    that.choiceInvoice=JSON.parse(event.find('choiceInvoice'))
                    event.delete('choiceInvoice')
                }

                if(event.find('paystate')){

                    that.jumpToOrderDetails(event.find('paystate'))
                    event.delete('paystate')
                }

                //隔一分钟刷新一次时间
                if (that.setTimeoutTimer) {
                    clearTimeout(that.setTimeoutTimer)
                }
                if (that.timer) {
                    clearInterval(that.timer)
                }
                that.refreshServiceTime()  //隔一分钟刷新一次时间

            },
            viewdisappear(){
                var that=this
                that.pageBack = true;
                if (that.setTimeoutTimer) {
                    clearTimeout(that.setTimeoutTimer)
                }
                if (that.timer) {
                    clearInterval(that.timer)
                }
            },


        },

    }
</script>

<style scoped>
    .minibar {
        /*border-bottom-width: 1px;*/
        /*border-bottom-style: solid;*/
        /*border-bottom-color: #f1f1f1;*/
    }
    .backImg {
        width: 40px;
        height: 40px;
    }
    .redEnvelopesSelect{
        position: absolute;
        right: -16px;
        top:-16px;
        width: 80px;
        height: 80px;
    }
    .optionTwo{
        border-top-left-radius: 15px;
    }
    .optionOne{
        border-top-right-radius: 15px;
    }
    .noCoupon{
        color:#999;
        padding-top: 30px;
        padding-bottom: 30px;
        text-align: center;
        background-color: #f9f9f9;
        border-top-style: solid;
        border-top-width: 2px;
        border-top-color: #f1f1f1;
        border-bottom-left-radius: 15px;
        border-bottom-right-radius: 15px;
    }
    .couponText{
        text-align: right;
    }
    .number{
        margin-bottom: 4px;
    }
    .couponContentRight{
        flex: 1;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 10px;
    }
    .hongbaoPrice{
        flex-direction: row;
        align-items: flex-end;
        justify-content: flex-end;
    }

    .couponScroller{
        width: 700px;
        flex: 1;
    }
    .term{
    }
    .limit{
        padding-bottom: 20px;
    }
    .couponName{
        font-weight: bold;
    }
    .couponContentLeft{
        flex: 1;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding-top: 20px;
        padding-bottom: 10px;
    }
    .couponContent{
        position: relative;
        flex-direction: column;
        /*align-items: center;*/
        background-color: #f9f9f9;
        border-radius: 15px;
        padding-left: 30px;
        padding-right: 30px;
        border-top-style: dashed;
        border-top-width: 2px;
        border-top-color: #999;
    }
    .coupon{
        background-color: #f1f1f1;
        flex: 1;
        border-radius: 15px;
    }
    .couponTiele{
        text-align: center;
        width: 700px;
        height: 100px;
        line-height: 100px;
        background-color: #f1f1f1;
        border-top-left-radius: 15px;
        border-top-right-radius: 15px;
    }
    .takeTimeIcon{
        width: 25px;
        height: 35px;
        margin-right: 30px;
    }
    .selectClass{
        background-color: #fff;
    }
    .selectTimeIcon{
        width: 40px;
        height: 40px;
        margin-right: 20px;
    }
    .selectTimeDiv{
        flex-direction: row;
        align-items: center;
        width: 500px;
    }
    .selectTimeTextTwo{
        flex: 1;
        padding-left: 30px;
        padding-top: 30px;
        padding-bottom: 30px;
    }
    .dataScroller{
        flex: 1;
        height: 560px;
        background-color: #f1f1f1;
    }
    .timeScroller{
        flex: 2;
        height: 560px
    }
    .selectTimeText{
        width: 250px;
        text-align: center;
        padding-top: 30px;
        padding-bottom: 30px;
        background-color: #f1f1f1;
    }
    .selectTime{
        flex-direction: row;
    }
    .backgroundColor{
        width: 750px;
        height: 220px;
        background-color: #53beb7;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
    }
    .AgreementText{
        margin-left: 5px;
        text-decoration: underline;
    }
    .agreeText{
        margin-left: 10px;
    }
    .agreementIcon{
        width: 30px;
        height: 30px;
    }
    .agreement{
        flex-direction: row;
        align-items: center;
        margin-top: 30px;
        margin-bottom: 30px;
    }
    .takeTimeInput{
        text-align:center;
        /*flex: 1;*/
        width: 180px;
        padding-top: 5px;
        padding-bottom: 5px;
        /*margin-left: 40px;*/
    }
    .takeTimeNumberTwo{
        margin-left: 10px;
        margin-right: 10px;
    }
    .takeTimeDiv{
        flex-direction: row;
        align-items: center;
        justify-content: center;
        margin-top: 10px;
    }
    .takeTimeText{
        color: #999;
        text-align: center;
    }
    .takeTimeRight{
        width: 335px;
    }
    .takeTimeLeft{
        width: 335px;
        border-right-style: solid;
        border-right-width: 2px;
        border-right-color: #f1f1f1;
    }
    .takeTime{
        padding-top: 30px;
        padding-bottom: 30px;
        flex-direction: row;
        align-items: center;
        border-bottom-style: solid;
        border-bottom-width: 2px;
        border-bottom-color: #f1f1f1;
    }
    .distanceMap{
        text-decoration: underline;
        margin-left: 10px;
    }
    .distance{
        flex-direction: row;
        align-items: center;
        justify-content: center;
        margin-top: 20px;
        padding-bottom: 30px;
        border-bottom-style: solid;
        border-bottom-width: 2px;
        border-bottom-color: #f1f1f1;
    }
    .takeAddress{
        width: 650px;
        margin-left: 10px;
        text-align: center;
    }
    .takeIcon{
        width: 35px;
        height: 35px;
    }
    .take{
        flex-direction: row;
        align-items: center;
        margin-top: 30px;
        margin-bottom: 30px;
        justify-content: center;
    }
    .barOne{
        width: 315px;
        margin-left: 21px;
        margin-right: 20px;
        margin-top: 10px;
        height: 70px;
        text-align: center;
        line-height: 70px;
        background-color: #e1e1e1;
        opacity: 0.8;
        border-top-left-radius:15px;
        border-top-right-radius:15px;
    }
    .barTwo{
        width: 355px;
        height: 80px;
        line-height: 80px;
        background-color: #fff;
        margin-left: 0;
        margin-right: 0;
        margin-top: 0;
        opacity: 1;
    }
    .bar{
        flex-direction: row;
        background-color: #53beb7;
    }
    .unfoldIcon{
        width: 25px;
        height: 25px;
        margin-left: 10px;
        /*transition-property: width,height,backgroundColor;*/
        transition-duration: 0.3s;
        transition-delay: 0s;
        transition-timing-function:linear;
    }
    .unfoldText{
        color: #999;
    }
    .clickUnfold{
        flex-direction: row;
        align-items: center;
        justify-content: center;
        margin-left: 280px;
        margin-right: 280px;
        margin-top: 20px;
        padding-top: 10px;
        padding-bottom: 10px;
        border-style: solid;
        border-width: 2px;
        border-color: #f1f1f1;
        border-radius: 5px;
    }
    .tipDiv{
        position: relative;
    }
    .scroller{
        width: 750px;
        flex: 1;
    }
    .orderPage_content{
        width: 710px;
        margin-left: 20px;
        margin-top: 30px;
        margin-bottom: 50px;
    }
    .gardenA{
        left: -12px;
        bottom:0px;
        width: 24px;
        height: 24px;
        border-radius: 12px;
        background-color: #f1f1f1;
        position: absolute;
    }
    .gardenB{
        bottom: 0px;
        right: -12px;
        position: absolute;
        width: 24px;
        height: 24px;
        border-radius: 12px;
        background-color: #f1f1f1;
    }
    .gardenC{
        bottom: 0px;
        left: -12px;
        position: absolute;
        width: 24px;
        height: 24px;
        border-radius: 12px;
        background-color: #f1f1f1;
    }
    .gardenD{
        bottom: 0px;
        right: -12px;
        position: absolute;
        width: 24px;
        height: 24px;
        border-radius: 12px;
        background-color: #f1f1f1;
    }
    .selectStyle{
        color: #53beb7;
    }
    .tablewareCancel{
        color: #999;
        padding-top: 25px;
        padding-bottom: 25px;
        width: 750px;
        border-top-style: solid;
        border-top-width: 2px;
        border-top-color: #f1f1f1;
        text-align: center;
    }
    .tablewareSelect{
        width: 750px;
        margin-top: 30px;
        margin-bottom: 30px;
        text-align: center;
    }
    .tablewareAdvocacyText{
        margin-left: 20px;
    }
    .tablewareAdvocacy{
        flex-direction: row;
        align-items: center;
        background-color: #f4fefa;
        padding-top: 10px;
        padding-bottom: 10px;
        margin-left: 30px;
        margin-right: 30px;
        margin-top: 30px;
        margin-bottom: 30px;
    }
    .placeOrderFour{
        color: #fff;
        background-color: #53beb7;
        height: 100px;
        line-height: 100px;
        padding-left: 50px;
        padding-right: 50px;
    }
    .placeOrderThree{
        color: #fff;
        background-color: #333;
        height: 100px;
        line-height: 100px;
        padding-left: 10px;
        padding-right: 40px;
    }
    .placeOrderTwo{
        color: #fff;
        background-color: #333;
        height: 100px;
        line-height: 100px;
    }
    .placeOrderOne{
        flex: 1;
        background-color: #333;
        color: #fff;
        height: 100px;
        line-height: 100px;
        padding-left: 20px;
    }
    .placeOrder{
        flex-direction: row;
        align-items: center;
    }
    .assistantIcon{
        width: 30px;
        height: 30px;
    }
    .assistant{
        padding-top: 10px;
        padding-bottom: 10px;
        background-color: #f4fefa;
        flex-direction: row;
        align-items: center;
        margin-right: 30px;
    }

    .isOpen {
        width: 50px;
        height: 50px;
        border-radius: 26px;
        border-width: 1px;
        border-style: solid;
        border-color: #e2e2e2;
        background-color: #ffffff;
        left: 52px;
    }

    .isClose {
        width: 50px;
        height: 50px;
        background-color: white;
        border-radius: 26px;
        border-width: 1px;
        border-style: solid;
        border-color: #e2e2e2;

    }
    .open {
        width: 104px;
        height: 52px;
        border-radius: 52px;
        border-width: 1px;
        border-style: solid;
        border-color: white;
        background-color: #4ed465;

    }

    .close {
        width: 104px;
        height: 52px;
        border-radius: 52px;
        border-width: 1px;
        border-style: solid;
        border-color: #bbbbbb;

    }
    .yellowText{
        margin-left: 20px;
    }
    .yellowIcon{
        width: 40px;
        height: 40px;
    }
    .yellow{
        flex-direction: row;
        align-items: center;
        padding-top: 20px;
        padding-bottom: 20px;
        padding-left: 30px;
        background-color: #fff8e3;
    }
    .publicWelfareText{
        max-width: 630px;
        line-height: 35px;
        margin-left: 10px;
    }
    .publicWelfare{
        background-color: #fff;
        padding-left: 20px;
        padding-right: 20px;
        padding-top: 20px;
        padding-bottom: 20px;
        margin-top: 20px;
        margin-bottom: 50px;
        flex-direction: row;
        align-items: center;
        border-radius: 10px;

    }
    .invoiceText{
        color: #999;
    }
    .tableware-billChose{
        flex-direction: row;
        justify-content: space-between;
        padding-top: 20px;
        padding-bottom:30px;
        align-items: center;
    }
    .billMessage{
        flex: 1;
        flex-direction: column;
        justify-content: center;
    }
    .tableware-view {
        flex-direction: row;
        align-items: center;
    }
    .selectText{
        text-align: center;
        margin-right: 10px;
        /*width: 84px;*/
    }
    .flavorText{
        margin-right: 7px;
        max-width: 560px;
        lines:1;
        text-overflow: ellipsis;
    }
    .payMentTextTwo{
        margin-right: 30px;
    }
    .payMentText{
        flex: 1;
    }
    .payMent{
        flex-direction: row;
        align-items: center;
        /*border-bottom-style: solid;*/
        /*border-bottom-width: 2px;*/
        /*border-bottom-color: #f1f1f1;*/
        padding-top: 30px;
        padding-bottom: 30px;
    }
    .payMentS{
        flex-direction: row;
        align-items: center;
        padding-top: 30px;
        padding-bottom: 30px;
    }
    .payment{
        padding-left: 20px;
        padding-right: 20px;
        margin-top: 20px;
        background-color: #fff;
        border-radius: 10px;
        margin-bottom: 30px;
    }
    .protectText{
        margin-top: 20px;
        color: #999;
    }
    .protectDivText{
        margin-left: 15px;
    }
    .lockIcon{
        width: 28px;
        height: 35px;
    }
    .protectDiv{
        flex-direction: row;
        align-items: center;
    }
    .protect{

        padding-left: 20px;
        padding-right: 20px;
        padding-top: 20px;
        padding-bottom: 20px;
        margin-top: 20px;
        background-color: #fff;
        border-radius: 10px;
    }
    .totalPrice{
        font-weight: bold;
        color: #fb5147;
        margin-left: 10px;
    }
    .smallPlan{
        margin-left: 30px;
    }
    .rule{
        flex-direction: row;
        align-items: center;
        margin-top: 30px;
        margin-bottom: 30px;
        margin-left: 20px;
        margin-right: 20px;
    }
    .redEnvelopesBtnTextC{
        color:#fb5147;
    }
    .redEnvelopesBtnTextB{
        color: #999;
        text-decoration: line-through;
    }
    .redEnvelopesBtnTextA{
        flex: 1;
    }
    .redEnvelopesBtn{
        flex-direction: row;
        align-items: center;
        margin-top: 25px;
    }
    .selectIcon{
        width: 40px;
        height: 40px;
    }
    .helpIcon{
        width: 30px;
        height: 30px;
    }
    .helpIconDiv{
        flex: 1;
        margin-left: 10px;
    }
    .redEnvelopesTop{
        flex-direction: row;
        align-items: center;
    }
    .redEnvelopes{
        padding-top: 15px;
        padding-bottom: 15px;
        padding-left: 15px;
        padding-right: 15px;
        margin-bottom: 30px;
        margin-top: 20px;
        background-color: #fffbf1;
    }
    .available{
        color:#fb5147;
    }
    .voucherNumber{
        margin-right: 10px;
    }
    .voucherText{
        flex: 1;
    }
    .voucher{
        flex-direction: row;
        align-items: center;
    }
    .xin{
        color: #fff;
        background-color: #c183e2;
        padding-top: 3px;
        padding-bottom: 3px;
        padding-left: 5px;
        padding-right: 5px;
    }
    .shou{
        color: #fff;
        background-color: #fea62b;
        padding-top: 3px;
        padding-bottom: 3px;
        padding-left: 5px;
        padding-right: 5px;
    }
    .bargainTxt{
        flex: 1;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
    }
    .aiCenter{
        flex-direction: row;
        align-items: center;
    }
    .jianPrice{

    }
    .jianType{
        color: #999;
        flex: 1;
        margin-left: 20px;
        margin-top: 5px;
    }
    .jian{
        color: #fff;
        padding-top: 5px;
        padding-bottom: 5px;
        padding-left: 7px;
        padding-right: 7px;
    }
    .jianDiv{
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
    }
    .discountDiv{
        position: relative;
    }
    .discount{
        margin-left: 20px;
        margin-right: 20px;
        padding-top: 30px;
        padding-bottom: 30px;
        border-bottom-style: dashed;
        border-bottom-width: 2px;
        border-bottom-color: #f1f1f1;
        margin-bottom: 12px;
    }
    .tipText{
        flex: 1;
    }
    .tipOne{
        margin-top: 30px;
        flex-direction: row;
        align-items: center;
    }
    .tip{
        margin-left: 20px;
        margin-right: 20px;
        border-bottom-style: dashed;
        border-bottom-color: #f1f1f1;
        border-bottom-width:2px;
        padding-bottom: 30px;
        margin-bottom: 11px;
    }
    .dishDiv{
        margin-left: 20px;
        flex: 1;
    }
    .dishNumber{
        margin-top: 10px;
    }
    .zhePrice{
        margin-top: 10px;
        color: #999;
        text-decoration: line-through ;
    }
    .Share_circle{
        width: 12px;
        height: 12px;
        border-radius: 12px;
        background-color: #53beb7;
        margin-left: 10px;
        margin-right: 10px;
        margin-top: 3px;
    }

    .dishCenter{
        flex-direction: row;
        align-items: center;
    }
    .dishName{
        /*margin-left: 15px;*/
        max-width: 350px;
        margin-right: 5px;
        lines:1;
        text-overflow: ellipsis;
    }
    .zhe{
        color: #fff;
        /*background-color: #c183e2;*/
        background-color: #F4A460;
        padding-top: 2px;
        padding-bottom: 2px;
        padding-left: 3px;
        padding-right: 3px;
    }
    .dishTop{
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
    .dishImg{
        width: 130px;
        height: 130px;
    }
    .dishTwo{
        height: 550px;
        overflow: hidden;
    }
    .dish{
        padding-top: 20px;
        padding-left: 20px;
        padding-bottom: 20px;
        padding-right: 20px;
        margin-top: 10px;
        flex-direction: row;
        align-items: center;
        background-color: #f7f7f7;
    }
    .promptText{
        color: red;
        margin-left: 5px;
    }
    .promptIcon{
        width: 20px;
        height: 20px;
    }
    .prompt{
        flex-direction: row;
        align-items: center;
        margin-top: 30px;
    }
    .shopNameTextTwo{
        border-style: solid;
        border-width: 2px;
        border-color: #53beb7;
        border-radius: 5px;
        padding-top: 3px;
        padding-bottom: 3px;
        padding-left: 5px;
        padding-right: 5px;
    }
    .shopNameText{
        margin-left: 10px;
        flex: 1;
    }
    .shopIcon{
        width: 50px;
        height: 50px;
        border-radius: 25px;
    }
    .shopIconDiv{
        width: 50px;
        height: 50px;
        border-radius: 25px;
    }
    .contentShopName{
        flex-direction: row;
        align-items: center;
    }
    .contentTop{
        /*border-bottom-style: solid;*/
        /*border-bottom-width: 2px;*/
        /*border-bottom-color: #f1f1f1;*/
        padding-top: 20px;
        padding-left: 20px;
        padding-right: 20px;
        padding-bottom: 20px;
    }
    .content{
        background-color: #fff;
        margin-top: 20px;
        border-radius: 10px;
    }
    .titleBottomTextA{
    }
    .titleBottomTextB{
        margin-left: 20px;
        flex: 1;
        text-align: right;
        margin-right: 20px;
    }
    .titleBottom{
        flex: 1;
        flex-direction: row;
        align-items: center;
        padding-top: 30px;
        padding-bottom: 30px;
        border-top-width: 1px;
        border-top-style: solid;
        border-top-color: #dedede;
    }
    .titleIcon{
        width: 20px;
        height: 20px;
    }
    .titleTextD{
        margin-left: 20px;
    }


    .titleTopB{
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        flex: 1;
        margin-top: 10px;
    }
    .titleTextB{
        lines:2;
        text-overflow: ellipsis;
        max-width: 620px;
        text-align: left;
    }
    .titleTextA{
        color:#488ff3;
        background-color: #afddff;
        padding-top: 3px;
        padding-bottom: 3px;
        padding-left: 5px;
        padding-right: 5px;
    }
    .titleTopDiv{
        flex: 1;
        padding-right: 20px;
    }
    .titleTopA{
        flex-direction: row;
        align-items: center;
    }
    .titleTop{
        flex-direction: row;
        align-items: center;
        padding-top: 30px;
        padding-bottom: 30px;
    }
    .title{
        padding-left: 30px;
        padding-right: 30px;
        background-color: #fff;
        border-radius: 10px;
    }
    .wrapper{
        background-color: #f1f1f1;
    }
    .heplRule{
        flex-direction: row;
        align-items: center;
        flex: 1;
    }

</style>
