<template>
    <div class="recordLast">

        <!--头部-->
        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="back()"
                    v-once
            >
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">顾客分析</text>
            </wxc-minibar>
        </div>

        <list class="scroller">

            <cell v-if="choice==1">

                <!--头部导航浪-->
                <div class="barTop row" v-cloak>
                    <text class="barTopText" :class="[dateChoice==1?'barActive':'']" :style="{fontSize:GLOBAL.bigFS,color:dateChoice==1?'#fff':GLOBAL.tColor}" @click="dateFn(1)">昨日</text>
                    <text class="barTopText" :class="[dateChoice==2?'barActive':'']" :style="{fontSize:GLOBAL.bigFS,color:dateChoice==2?'#fff':GLOBAL.tColor}" @click="dateFn(2)">近7日</text>
                    <text class="barTopText barTopTextTwo" :class="[dateChoice==3?'barActive':'']" :style="{fontSize:GLOBAL.bigFS,color:dateChoice==3?'#fff':GLOBAL.tColor}" @click="dateFn(3)">近30日</text>
                </div>

                <!--总览-->
                <div class="topnBun row" @click="topnBunClick">
                    <text class="shiSiIcon"></text>
                    <text class="lvLin" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">总览</text>
                    <text class="number" :style="{fontSize:GLOBAL.defaultFS}">?</text>
                </div>
                <div class="overview">

                    <div class="overviewOne row">
                        <div style="width: 200px;">
                            <text :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">下单人数</text>
                            <div class="overviewOneTop row">
                                <text class="bold" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">{{orderCount}}</text>
                                <text :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">人</text>
                            </div>
                            <div class="row overviewOneTop">
                                <text :style="{fontSize:GLOBAL.defaultFS,color:'#999'}" v-if="dateChoice==1">较前日</text>
                                <text :style="{fontSize:GLOBAL.defaultFS,color:'#999'}" v-else>较上{{day}}日</text>
                                <text v-if="subOrder==0" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}"> &#45;&#45;持平</text>
                                <text v-else :style="{fontSize:GLOBAL.smallFS,color:subOrder>0?'#f10717':'#0bdf38'}">{{subOrder|abs}}人{{subOrder>0?'↑':'↓'}}</text>
                            </div>
                        </div>


                        <web ref="firWebview" style="width: 400px; height: 138px;" src="https://www.aftdc.com/mobile/public/echarts.html"
                             @pagestart="" @pagefinish="firOnPageFinish" @error="" @receivedtitle=""></web>
                    </div>

                    <div class="overviewTwo row">

                        <div class="overviewOne overviewBr">
                            <text :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">新客</text>
                            <div class="overviewOneTop row">
                                <text class="bold" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">{{newOrderNum}}</text>
                                <text :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">人</text>
                            </div>
                            <div class="row overviewOneTop">
                                <text :style="{fontSize:GLOBAL.defaultFS,color:'#999'}" v-if="dateChoice==1">较前日</text>
                                <text :style="{fontSize:GLOBAL.defaultFS,color:'#999'}" v-else>较上{{day}}日</text>
                                <text v-if="newOrderSub==0" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}"> &#45;&#45;持平</text>
                                <text v-else :style="{fontSize:GLOBAL.smallFS,color:newOrderSub>0?'#f10717':'#0bdf38'}">{{newOrderSub|abs}}人{{newOrderSub>0?'↑':'↓'}}</text>
                            </div>
                            <div class="row overviewOneTop">
                                <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">占{{newOrderPer*100}}%</text>
                                <div class="lengthDiv">
                                    <div :style="{width:(newOrderPer*155)+'px',height:'15px',backgroundColor:'#53beb7'}"></div>
                                </div>
                            </div>
                        </div>

                        <div class="overviewOne">
                            <text :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">老客</text>
                            <div class="overviewOneTop row">
                                <text class="bold" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">{{oldOrderNum}}</text>
                                <text :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">人</text>
                            </div>
                            <div class="row overviewOneTop">
                                <text :style="{fontSize:GLOBAL.defaultFS,color:'#999'}" v-if="dateChoice==1">较前日</text>
                                <text :style="{fontSize:GLOBAL.defaultFS,color:'#999'}" v-else>较上{{day}}日</text>
                                <text v-if="oldOrderSub==0" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}"> &#45;&#45;持平</text>
                                <text v-else :style="{fontSize:GLOBAL.smallFS,color:oldOrderSub>0?'#f10717':'#0bdf38'}">{{oldOrderSub|abs}}人{{oldOrderSub>0?'↑':'↓'}}</text>
                            </div>
                            <div class="row overviewOneTop">
                                <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">占{{oldOrderPer*100}}%</text>
                                <div class="lengthDiv">
                                    <div :style="{width:Math.round(oldOrderPer*155)+'px',height:'15px',backgroundColor:'#53beb7'}"></div>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>


                <!--重复下单-->
                <div class="topnBunBig" v-if="dateChoice!=1">

                    <div class="topnBun row" @click="topnBunClick">
                        <text class="shiSiIcon"></text>
                        <text class="lvLin" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">重复下单</text>
                        <text class="number" :style="{fontSize:GLOBAL.defaultFS}">?</text>
                        <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor,flex:'1',textAlign:'right'}">{{date}}</text>
                    </div>

                    <div class="overviewS row">

                        <div class="overviewOne overviewBr">
                            <text :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">重复下单率</text>
                            <div class="overviewOneTop row">
                                <text class="bold" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">{{reOrderPer}}</text>
                                <text :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">%</text>
                            </div>
                            <div class="row overviewOneTop">
                                <text :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">较上{{day}}日</text>
                                <text v-if="reOrderSub==0" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}"> &#45;&#45;持平</text>
                                <text v-else :style="{fontSize:GLOBAL.smallFS,color:reOrderSub>0?'#f10717':'#0bdf38'}">{{reOrderSubPer|abs}}%{{reOrderSub>0?'↑':'↓'}}</text>
                            </div>
                        </div>

                        <div class="overviewOne">
                            <text :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">重复下单顾客</text>
                            <div class="overviewOneTop row">
                                <text class="bold" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">{{reOrderNum}}</text>
                                <text :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">人</text>
                            </div>
                            <div class="row overviewOneTop">
                                <text :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">较上{{day}}日</text>
                                <text v-if="reOrderSub==0" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}"> &#45;&#45;持平</text>
                                <text v-else :style="{fontSize:GLOBAL.smallFS,color:reOrderSub>0?'#f10717':'#0bdf38'}">{{reOrderSub|abs}}人{{reOrderSub>0?'↑':'↓'}}</text>
                            </div>
                        </div>


                    </div>

                    <!--顾客趋势-->
                    <div class="topnBun row" @click="topnBunClick">
                        <text class="shiSiIcon"></text>
                        <text class="lvLin" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">顾客趋势</text>
                        <text class="" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor,marginLeft:'20px'}">(点击查看每日详情)</text>
                    </div>

                    <div class="trend">
                        <div class="trendDiv row">
                            <text class="trendText" :class="[counts==1?'trendTextTwo':'']" :style="{fontSize:GLOBAL.smallFS}" @click="chooseCount(1)">下单顾客</text>
                            <text class="trendText" :class="[counts==2?'trendTextTwo':'']" :style="{fontSize:GLOBAL.smallFS}" @click="chooseCount(2)">新顾客</text>
                            <text class="trendText" :class="[counts==3?'trendTextTwo':'']" :style="{fontSize:GLOBAL.smallFS}" @click="chooseCount(3)">老顾客</text>
                        </div>
                        <div class="trendMy row">
                            <text :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.tColor}">一</text>
                            <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">我的</text>
                        </div>

                        <web ref="secWebview" class="secWebview" src="https://www.aftdc.com/mobile/public/echarts.html"
                             @pagestart="" @pagefinish="secOnPageFinish" @error="" @receivedtitle=""></web>
                    </div>


                </div>
            </cell>

            <!--顾客偏好-->
            <cell v-if="choice==2">

                <div class="topnBun row" @click="topnBunClick">
                    <text class="shiSiIcon"></text>
                    <text class="lvLin" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">本店顾客偏好</text>
                    <text class="" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor,marginLeft:'20px'}">(牢记本店顾客偏好，继续加油)</text>
                </div>

                <div class="peopleHobbyBar row">
                    <text class="peopleHobbyBarText" :class="[likeChoice==1?'hobbyActive':'']" @click="likeChoiceFn(1)" :style="{fontSize:GLOBAL.defaultFS}">爱买的商品</text>
                    <text class="peopleHobbyBarText" :class="[likeChoice==2?'hobbyActive':'']" @click="likeChoiceFn(2)" :style="{fontSize:GLOBAL.defaultFS}">喜欢的活动</text>
                </div>

                <div class="hobbyList">

                    <div v-if="likeChoice==1">
                        <div class="hobbyListLi row" v-for="(item,index) in customerLike" v-if="index < likeNumb" :key="index">
                            <text class="hobbyListLiIndex">{{index+1}}、</text>
                            <text class="hobbyListLiName" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.name}}</text>
                            <text class="hobbyListLiDetails" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.people}}人 | {{item.numb}}单</text>
                        </div>

                        <div class="hobbyMore row" v-if="customerLike&&customerLike.length > 6" @click="likeNumbFn()">
                            <text v-if="likeNumb<10" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">点击查看更多</text>
                            <text v-else :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">点击收起</text>
                            <image v-if="likeNumb<10" class="hobbyMoreIconTwo" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                            <image v-else class="hobbyMoreIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                        </div>

                        <text class="noShop" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}" v-if="customerLike.length<=0">暂无爱买商品</text>
                    </div>

                    <div v-if="likeChoice==2">
                        <div class="hobbyListLi row" v-for="(item,index) in activityLike" v-if="index < likeNumb" :key="index">
                            <text class="hobbyListLiIndex">{{index+1}}、</text>
                            <text class="hobbyListLiName" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.name}}</text>
                            <text class="hobbyListLiDetails" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.people}}人参与</text>
                        </div>

                        <div class="hobbyMore row" v-if="activityLike && activityLike.length > 6" @click="likeNumbFn()">
                            <text v-if="likeNumb<10" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">点击查看更多</text>
                            <text v-else :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">点击收起</text>
                            <image v-if="likeNumb<10" class="hobbyMoreIconTwo" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                            <image v-else class="hobbyMoreIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                        </div>

                        <div v-if="activityLike.length<=0" class="noActive">
                            <text class="noShop" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">暂无顾客参观本店活动</text>
                            <text class="changeActive" :style="{fontSize:GLOBAL.smallFS}">换个活动试试</text>
                        </div>
                    </div>

                </div>

            </cell>

            <!--顾客结构-->
            <cell v-if="choice==3">

                <div class="peopleHobbyBar row">
                    <text class="peopleHobbyBarText" :class="[structChoice==1?'hobbyActive':'']" @click="structFn(1)" :style="{fontSize:GLOBAL.defaultFS}">顾客活跃度</text>
                    <text class="peopleHobbyBarText" :class="[structChoice==2?'hobbyActive':'']" @click="structFn(2)" :style="{fontSize:GLOBAL.defaultFS}">顾客价值</text>
                </div>


                <div v-if="structChoice==1">
                    <!--图表-->
                    <!--<div class="classificationTableBig">-->
                    <!--<div class="classificationTable"></div>-->
                    <!--</div>-->
                    <web ref="pieWebview" class="classificationTableBig" src="https://www.aftdc.com/mobile/public/echarts.html"
                         @pagestart="" @pagefinish="pieOnPageFinish" @error="" @receivedtitle=""></web>
                    <div class="classification row">
                        <text class="classificationOne" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">顾客分类</text>
                        <text class="bold" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">最近成交一次在近</text>
                    </div>
                    <div class="classification row" v-for="(item,index) in brisk" :key="index">
                        <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.name}}{{'('+item.value+'人)'}}</text>
                        <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{index==0?'1-'+timeArr[index].val:timeArr[index-1].val+'-'+timeArr[index].val}}天</text>
                    </div>
                    <div class="classificationTwo row"  @click="groupingFn">
                        <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">点击编辑顾客分组</text>
                        <image class="hobbyMoreIcons" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                    </div>

                </div>

                <div v-if="structChoice==2" style="margin-bottom: 30px;">

                    <div class="barTop row" v-cloak>
                        <text class="barTopText" :class="[frameTime==1?'barActive':'']" :style="{fontSize:GLOBAL.bigFS,color:frameTime==1?'#fff':GLOBAL.tColor}" @click="frameTimeFn(1)">近7天</text>
                        <text class="barTopText" :class="[frameTime==2?'barActive':'']" :style="{fontSize:GLOBAL.bigFS,color:frameTime==2?'#fff':GLOBAL.tColor}" @click="frameTimeFn(2)">近30天</text>
                        <text class="barTopText barTopTextTwo" :class="[frameTime==3?'barActive':'']" :style="{fontSize:GLOBAL.bigFS,color:frameTime==3?'#fff':GLOBAL.tColor}" @click="frameTimeFn(3)">近90天</text>
                    </div>
                    <div class="deal">
                        <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">成交频次</text>
                        <web ref="thrWebview" style="width: 700px;height: 390px" src="https://www.aftdc.com/mobile/public/echarts.html"
                             @pagestart="" @pagefinish="thrOnPageFinish" @error="" @receivedtitle=""></web>
                    </div>
                    <div class="deal">
                        <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">成交金额分布</text>
                        <web ref="fouWebview" style="width: 700px;height: 390px" src="https://www.aftdc.com/mobile/public/echarts.html"
                             @pagestart="" @pagefinish="fouOnPageFinish" @error="" @receivedtitle=""></web>
                    </div>

                </div>

            </cell>

        </list>

        <!--底部导航-->
        <div class="bottomBar row">

            <div class="bottomDiv row" @click="choiceFn(1)">
                <image v-if="choice==1" class="bottomIcon" src="https://www.aftdc.com/static/image/mobile/people-data1.png"></image>
                <image v-else class="bottomIcon" src="https://www.aftdc.com/static/image/mobile/people-data.png"></image>
                <text class="bottomText" :style="{fontSize:GLOBAL.bigFS,color:choice==1?GLOBAL.tColor:'#fff'}">顾客数据</text>
            </div>
            <div class="bottomDivTwo row" @click="choiceFn(2)">
                <image v-if="choice==2" class="bottomIcon" src="https://www.aftdc.com/static/image/mobile/people-data1.png"></image>
                <image v-else class="bottomIcon" src="https://www.aftdc.com/static/image/mobile/people-data.png"></image>
                <text class="bottomText" :style="{fontSize:GLOBAL.bigFS,color:choice==2?GLOBAL.tColor:'#fff'}">顾客偏好</text>
            </div>
            <div class="bottomDivTwo row" @click="choiceFn(3)">
                <image v-if="choice==3" class="bottomIcon" src="https://www.aftdc.com/static/image/mobile/people-data1.png"></image>
                <image v-else class="bottomIcon" src="https://www.aftdc.com/static/image/mobile/people-data.png"></image>
                <text class="bottomText" :style="{fontSize:GLOBAL.bigFS,color:choice==3?GLOBAL.tColor:'#fff'}">顾客结构</text>
            </div>

        </div>

        <list class="scrollerTwo" v-if="groupState">
            <cell class="cell">

                <div class="groupBox">
                    <div class="groupBoxDiv" v-for="(item,index) in timeArrBox" :key="index">
                        <div class="groupBoxDivTop row">
                            <text class="groupBoxName" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}" >{{item.name}}</text>
                            <text class="groupBoxPlace" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">最近一次成交在近</text>
                        </div>
                        <div class="groupBoxBottom row">
                            <text class="groupBoxOne" :style="{fontSize:GLOBAL.bigFS}" v-if="index==0">1</text>
                            <text class="groupBoxTwo" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}" v-else>{{timeArrBox[index-1].val}}</text>
                            <text class="groupBoxThree" :style="{fontSize:GLOBAL.defaultFS}">至</text>
                            <text class="groupBoxFour" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}" @click="timeArrFn(index)">{{item.val}}天</text>
                        </div>
                    </div>
                    <text class="groupText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">系统暂时只支持统计1-120天内的顾客数据</text>
                </div>

                <div class=" enterButton" style="margin-top: 40px;">
                    <wxc-button class="okButton" text="立即保存" :textStyle="GLOBAL.buttonText" :btnStyle="GLOBAL.defaultButton"
                                @wxcButtonClicked="groupKeep()"></wxc-button>
                </div>
                <div class=" enterButton">
                    <wxc-button class="noButton" text="返回" :textStyle="GLOBAL.cancelButtonText" :btnStyle="GLOBAL.cancelButton"
                                @wxcButtonClicked="groupingFn()"></wxc-button>
                </div>
                <text class="explain" @click="defaultSys()" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">恢复至默认分组</text>


            </cell>
        </list>

        <!--选择时间-->
        <wxc-popup popup-color="rgb(220, 220, 220)"
                   :show="isBottomShow"
                   @wxcPopupOverlayClicked="popupOverlayBottomClick"
                   pos="bottom"
                   ref="popupTast"
                   height="480">
            <div class="demo-content row">
                <text class="demoCancel" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}" @click="timeCancel">取消</text>
                <text class="demoPlease" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">请选择</text>
                <text class="demoCancel" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}" @click="timeFinish">完成</text>
            </div>
            <!--<div :style="{height:'80px',backgroundColor:'#fff'}"></div>-->
            <scroller class="scroller">



                <text class="selectTime" v-for="(item,index) in timeFor" :key="index" :style="{fontSize:GLOBAL.defaultFS,color:index===selectTime?GLOBAL.tColor:GLOBAL.dColor}" @click="selectClick(index)">{{item}}</text>


                <!--<div v-for="(item,index) in timeFor" :key="index" v-if="index==timeIndex">-->
                <!--<text class="selectTime" v-for="(itemTwo,indexTwo) in item.textOne" :key="indexTwo" :style="{fontSize:GLOBAL.defaultFS,color:itemTwo.select?GLOBAL.tColor:GLOBAL.dColor}" @click="selectClick(indexTwo)">{{itemTwo.text}}</text>-->
                <!--</div>-->
            </scroller>
        </wxc-popup>



    </div>
</template>

<script>
    import {WxcPopup, WxcMask, WxcIcon, WxcMinibar, WxcPopover,WxcButton} from 'weex-ui';

    const modal = weex.requireModule('modal');
    const event = weex.requireModule('event');
    const post = weex.requireModule('stream');
    const webview = weex.requireModule('webview');
    export default {
        // 过滤器
        filters: {
            abs (value) {
                return Math.abs(value);
            }
        },
        components: {WxcPopup, WxcMask, WxcIcon, WxcMinibar, WxcPopover,WxcButton},

        data() {

            return {
                selectTime:'',//选择时间的索引,用于设置完成时操作timeArr
                selectValue:'',//选择时间的值
                labelSelect:0,//顾客趋势标签选择
                timeIndex:'',
                timeIndexTwo:'',//弹出框的索引，用于设置完成时操作timeArr
                timeOne:30,
                timeTwo:60,
                timeThree:90,

                isBottomShow:false,//时间选择
                shopId:642,
                choice:1,
                dateChoice:1,
                orderNum:[],//下单人数的图例数据
                date:'',//时间
                yed:'',
                yedt:'',
                counts:1,
                day:0,

                orderCount:0,//下单顾客
                subOrder:0,
                newOrderNum:0,//新客
                newOrderSub:0,
                newOrderPer:0,
                oldOrderNum:0,//老客
                oldOrderSub:0,
                oldOrderPer:0,
                reOrderNum:0,//重复顾客
                reOrderSub:0,
                reOrderSubPer:0,
                reOrderPer:0,
                nowOrder:0,

                //顾客偏好---------
                likeChoice:1,
                customerLike:[],
                activityLike:[],
                likeNumb:6,

                //顾客结构----------
                structChoice:1,//松演更改为1,原本是0
                brisk:[],//顾客活跃度数据
                customerNum:[],//成交频次
                customerPay:[],//成交金额
                groupState:false,
                popTimeState:false,//时间选择弹出框
                // timeArr:{active:30,silent:60,loss:120},//顾客活跃度设置
                timeArr:[
                    {name:'活跃顾客',val:30},
                    {name:'沉默顾客',val:60},
                    {name:'流失顾客',val:90},
                ],
                timeArrBox:[
                    {name:'活跃顾客',val:30},
                    {name:'沉默顾客',val:60},
                    {name:'流失顾客',val:90},
                ],
                timeFor:[
                    {textOne:[{text:15,select:false},{text:30,select:true},{text:45,select:false},{text:60,select:false},{text:75,select:false},{text:90,select:false},{text:105,select:false},{text:120,select:false}]},
                    {textOne:[{text:30,select:false},{text:45,select:false},{text:60,select:true},{text:75,select:false},{text:90,select:false},{text:105,select:false},{text:120,select:false}]},
                    {textOne:[{text:60,select:false},{text:75,select:false},{text:90,select:true},{text:105,select:false},{text:120,select:false}]},
                ],
                timeH:0,
                maskH:0,
                reckonNumb:0,
                frameTime:1,//顾客价值时间选择索引
                option:{//线图表
                    xAxis: {
                        axisLine: {show: false},
                        axisTick: {show: false},//刻度线
                        data: [],
                        axisLabel: {//只显示最小值最大值
                            interval: 100000,
                            showMinLabel: true,
                            showMaxLabel: true,
                        },
                        boundaryGap: false,
                    },
                    yAxis: {
                        splitLine: {show: false},//辅助线
                        axisTick: {show: false},//刻度线
                        axisLine: {show: false},//坐标轴线
                        axisLabel: {show: false}//坐标轴提示文字
                    },
                    grid:{//直角坐标系边距
                        left:20,
                        right:15,
                        top:'10',
                        bottom:'20',
                    },
                    series: [{
                        name: '下单人数',
                        type: 'line',
                        areaStyle:{
                            normal: {
                                opacity:0.2,

                            }
                        },

                        data: [],
                        symbol: 'circle', //设置拐点格式样式 如:实心圆，空心圆或不显示拐点等
                        itemStyle: {
                            normal: {
                                color:'#53beb7',
                                lineStyle: {
                                    color :"#53beb7", //设置拐点颜色
                                    width : 2 //设置各个拐点连接的线条颜色
                                },
                            },

                        },

                        symbolSize :8, //设置各个拐点的大小

                    }],
                },
                pieOption:{//饼图表
                    tooltip : {
                        trigger: 'item',
                        formatter: "{b} : {c}人 ({d}%)"
                    },
                    color:['#53beb7','#00ccff','#ffcc00'],
                    series : [
                        {
                            type: 'pie',
                            radius : '65%',
                            center: ['50%', '50%'],
                            selectedMode: 'single',
                            data:[
                                {
                                    value:1548,
                                    name: '幽州',

                                },
                                {value:535, name: '荆州'},
                                {value:510, name: '兖州'},
                                {value:634, name: '益州'},
                                {value:735, name: '西凉'}
                            ],
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                },
                secOption:{//柱状图表
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },

                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        top:'3%',
                        containLabel: true
                    },

                    xAxis: {
                        type: 'value',
                        boundaryGap: [0, 0.7],

                        splitLine: {show: false},//辅助线
                        axisTick: {show: false},//刻度线
                        axisLine: {show: false},//坐标轴线
                        axisLabel: {show: false}//坐标轴提示文字
                    },
                    yAxis: {
                        type: 'category',
                        axisLabel: {//只显示最小值最大值
                            interval: 0,
                        },

                        data: []
                    },

                    series: [
                        {
                            name: '',
                            type: 'bar',
                            data: [],
                            color:'#67e0d0',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'right',
                                    textStyle: {
                                        color: '#999'
                                    },
                                    formatter:"{c}人"
                                }
                            },
                        },

                    ]
                },
                token:'',
                imei:'',
            }
        },
        created: function () {
            var that=this;
            event.init();
            that.token = weex.config.token;
            that.imei = weex.config.imei;
        },
        methods: {

            selectClick(index){
                for(var i in this.timeFor[this.timeIndex].textOne){
                    this.timeFor[this.timeIndex].textOne[i].select=false;
                }

                this.timeFor[this.timeIndex].textOne[index].select=true;
                this.timeIndexTwo=index;

            },
            popupOverlayBottomClick(){
                this.isBottomShow=false;
                this.$refs.popupTast.hide();
            },

            choiceFn:function(index){
                var that=this;
                if (index === 2 && that.structChoice === 1 || that.structChoice === 2){
                    that.structChoice = 0;
                }
                that.choice=index;
                if(index===1){
                    that.structChoice = 0;
                    // this.ordersFn();//渲染总览
                    that.firOnPageFinish()
                    if (that.dateChoice !== 1) {
                        this.trendFn()
                    }
                }else if(index===3){
                    that.structChoice = 1;
                    var shopId=this.shopId;
                    if(event.find('timeArr'+that.shopId)){

                        that.timeArr=JSON.parse(event.find('timeArr'+that.shopId));
                        that.timeArrBox=JSON.parse(event.find('timeArr'+that.shopId));
                        // $.cookie('timeArr'+shopId,JSON.stringify(timeArr),{ expires: 7 })//weex没有cookie需要更改
                    }
                    //根据设置的活跃度时间查询数据
                    that.briskFn();
                }

            },
            //----------- 顾客数据------
            dateFn:function(index){
                this.dateChoice=index;
                var days=0;
                if(index==1){
                    days=1;
                }
                if(index==2){
                    days=7;
                }
                if(index==3){
                    days=30;
                }
                this.counts=1
                this.day=days;
                this.dataRequest(days)
            },
            //根据日期查询数据
            dataRequest:function(days){
                var that=this;
                var param = this.GLOBAL.sign(this.token,this.imei) + '&' + 'day=' + days ;//改
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/businessapp/Manage/getAnalyGuest',//改
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                }, function (res) {
                    if (res.data.res === 1){
                        that.date=res.data.data.date;//日期
                        that.orderNum=res.data.data.order;
                        that.nowOrder=res.data.data.order;
                        var ed=res.data.data.ed;

                        var newOrderNum,oldOrderNum,orderCount;
                        var newOrderSub,oldOrderSub,subOrder;

                        var reOrderNum=0;
                        if(res.data.data.yed&&res.data.data.yedt){

                            that.customerLike=res.data.data.customerLike.customerLike; //顾客偏好的爱买的商品
                            that.activityLike=res.data.data.customerLike.activityLike; //顾客偏好的的活动

                            that.yed=res.data.data.yed;
                            that.yedt=res.data.data.yedt;
                            var len=res.data.data.order.length;
                            orderCount=res.data.data.yed.newOrderNum + res.data.data.yed.oldOrderNum;//获取昨日下单人数
                            var QorderCount=res.data.data.yedt.newOrderNum + res.data.data.yedt.oldOrderNum;//获取前日日下单人数
                            //比较
                            subOrder=orderCount-QorderCount;
                            newOrderSub= res.data.data.yed.newOrderNum - res.data.data.yedt.newOrderNum;
                            oldOrderSub= res.data.data.yed.oldOrderNum - res.data.data.yedt.oldOrderNum;
                            //人数
                            newOrderNum=res.data.data.yed.newOrderNum;
                            oldOrderNum=res.data.data.yed.oldOrderNum;

                        }else{
                            //人数
                            reOrderNum=res.data.data.reOrderNum;
                            that.reOrderNum=reOrderNum;//重复顾客
                            orderCount=res.data.data.orderCount;
                            newOrderNum=res.data.data.newOrderNum;
                            oldOrderNum=res.data.data.oldOrderNum;
                            //比较
                            subOrder= orderCount-ed.orderCount;
                            newOrderSub= newOrderNum-ed.newOrderNum;
                            oldOrderSub= oldOrderNum-ed.oldOrderNum;
                            that.reOrderSub = reOrderNum-ed.reOrderNum;

                        }

                        if(orderCount>0){//比例
                            that.newOrderPer = that.pros(newOrderNum, orderCount);
                            that.oldOrderPer = that.pros(oldOrderNum, orderCount);

                            if (days != 1) {
                                that.reOrderPer = that.pros(reOrderNum, orderCount) * 100 //重复下单率
                                var ed_reOrderPer = that.pros(ed.reOrderNum, ed.orderCount) * 100;
                            }
                            that.reOrderSubPer = that.reOrderPer - ed_reOrderPer;
                        }else{
                            that.newOrderPer='0';
                            that.oldOrderPer='0';
                            that.reOrderPer='0';//重复下单率
                        }

                        that.newOrderNum=newOrderNum;//新客人数
                        that.oldOrderNum=oldOrderNum;//老客人数
                        that.orderCount=orderCount;//下单人数

                        that.newOrderSub=newOrderSub;//新客比较人数
                        that.oldOrderSub=oldOrderSub;//老客比较人数
                        that.subOrder=subOrder;//下单比较人数
                        that.firOnPageFinish();
                        if(days !== 1){
                            that.trendFn()
                        }
                    }
                });
            },

            pros(up, down){
                //分母不能为0
                let d = parseInt(down * 100) / 100;
                d = d === 0 ? 1 : d;
                let pro = Math.round((Math.abs(up) / d) * 100) / 100;
                return pro
            },

            chooseCount:function(index){
                this.counts=index;
                var that=this;
                var day=that.day;
                if(index>1)
                {
                    var param = this.GLOBAL.sign(this.token,this.imei) + '&' + 'day=' + day + '&' + 'index=' + index;//改
                    post.fetch({
                        method: 'POST',
                        type: 'json',
                        body: param,
                        url: 'https://www.aftdc.com/businessapp/Manage/getConsumer',//改
                        headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    }, function (res) {
                        that.orderNum=res.data.data;
                        that.trendFn(1)
                    })
                    // $.ajax({
                    //     url:'https://www.aftdc.com/businessapp/Manage/getConsumer',
                    //     data:{
                    //         index:index,
                    //         day:day,
                    //         shopId:that.shopId,
                    //     },
                    //     type:'post',
                    //     success:function (res) {
                    //         that.orderNum=res.data;
                    //         that.trendFn()
                    //     }
                    // })
                }
                else
                {
                    that.orderNum=that.nowOrder;
                    that.trendFn(1)
                }

            },

// *********************************  顾客偏好  *******************************
            likeChoiceFn:function(index){
                this.likeChoice=index
            },
            likeNumbFn:function(){
                this.likeNumb=this.likeNumb < 10?100:6
            },


//*********************************  顾客结构  ***********************************

            structFn:function(index){
                this.structChoice=index;
                // this.$nextTick(function(){
                if(index===1){
                    this.thrOnPageFinish()
                }else{
                    var customerNum = this.customerNum;//成交频次
                    var customerPay=  this.customerPay;
                    if(!customerNum || customerNum.length===0 || !customerPay || customerPay.length===0){
                        this.customerFn(7);//查询顾客价值的数据
                    } else {
                        that.thrOnPageFinish()
                        that.fouOnPageFinish()
                    }
                }
                // })

            },
            //顾客价值时间选择
            frameTimeFn:function(index){
                this.frameTime=index;
                var day=0
                switch (index)
                {
                    case 1: day=7;break;
                    case 2: day=30;break;
                    case 3: day=90;break;
                }
                this.customerFn(day)
            },
            customerFn:function(day){
                var that=this
                var param = this.GLOBAL.sign(this.token,this.imei) + '&' + 'day=' + day;//改
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/businessapp/Manage/customerValue',//改
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                }, function (res) {
                    that.customerNum=res.data.data.customerNum;//成交频次
                    that.customerPay=res.data.data.customerPay;//成交金额

                    // that.priceFn({
                    //     id:"frequency",
                    //     data:res.data.data.customerNum
                    // });
                    // that.priceFn({
                    //     id:"moneyPillar",
                    //     data:res.data.data.customerPay
                    // });
                    that.thrOnPageFinish()
                    that.fouOnPageFinish()
                })
            },
// 顾客分组显示隐藏
            groupingFn:function(){
                var that=this
                if(event.find('timeArr'+that.shopId)){

                    console.log(event.find('timeArr'+that.shopId))
                    that.timeArrBox=JSON.parse(event.find('timeArr'+that.shopId));
                    // $.cookie('timeArr'+shopId,JSON.stringify(timeArr),{ expires: 7 })//weex没有cookie需要更改

                }else{
                    that.timeArrBox=[ {name:'活跃顾客',val:30},
                        {name:'沉默顾客',val:60},
                        {name:'流失顾客',val:90},]
                }
                this.groupState=!this.groupState;
            },

            selectClick(index){
                this.selectTime=index;
                this.selectValue=this.timeFor[index];
                console.log(this.selectValue)

            },
            popupOverlayBottomClick(){
                this.isBottomShow=false;
                this.selectTime='';
                this.$refs.popupTast.hide();

            },
//选择的是哪个活跃度的弹出
            timeArrFn:function(index){
                this.isBottomShow=true;
                this.timeIndex=index
                var ins=index-1;
                var state=ins>=0?this.timeArrBox[ins].val:15;
                var sum=[];

                while(state<=120){
                    sum.push(state);
                    state=state+15;
                }

                this.timeFor=sum;
                this.popTimeState=true;

                // var timeH=this.timeH;
                // var maskH=this.maskH;
                // if(!Boolean(timeH) || !Boolean(maskH)){
                //     let boxH=$(".choiceNumbBox").outerHeight();
                //     timeH=$(".numBox li").outerHeight();
                //     maskH=(boxH-timeH)/2;
                //     this.timeH=timeH;
                //     this.maskH=maskH;
                //     var that=this
                //     $('.choiceNumb').off("scrollstop")
                //     $('.choiceNumb').on("scrollstop",function(){
                //         // console.log("停止滚动!");
                //         let scrolt=$(this).scrollTop()
                //         let reckonNumb=Math.round(scrolt/timeH);
                //         $(this).scrollTop(reckonNumb*timeH);
                //         that.reckonNumb=reckonNumb
                //
                //     });
                // }

            },
// 选择时间完成
            timeFinish:function(){
                if(this.selectValue!=''){
                    this.timeArrBox[this.timeIndex].val=this.selectValue;
                    this.$refs.popupTast.hide();
                    this.selectTime='';
                    this.selectValue='';
                    if(this.timeArrBox[1].val<this.timeArrBox[0].val){
                        this.timeArrBox[1].val=this.timeArrBox[0].val
                    }
                    if(this.timeArrBox[2].val<this.timeArrBox[1].val){
                        this.timeArrBox[2].val=this.timeArrBox[1].val
                    }
                }
                else{
                    this.$refs.popupTast.hide();
                }



                // var numb=this.timeFor[this.reckonNumb];
                // var index=this.timeIndex;
                // var timeArr=this.timeArrBox
                // timeArr[index]['val']=numb;
                // var len=timeArr.length-1;
                // for(let i=index;i<len;i++){
                //     var n=timeArr[i].val;
                //     var e=timeArr[i+1].val;
                //
                //     if(n>e){
                //         timeArr[i+1].val=timeArr[i].val
                //     }
                // }
                //
                // this.timeArrBox=timeArr
                // this.timeTogle();
            },
            timeCancel(){
                this.selectTime='';
                this.selectValue='';
                this.$refs.popupTast.hide();
            },
// 选择时间取消
//             timeTogle:function(){
//                 this.popTimeState=!this.popTimeState;
//                 $('.choiceNumb').scrollTop(0)
//             },
// 立即保存
            groupKeep:function(){
                this.groupState=false;
                var timeArr=JSON.stringify(this.timeArrBox);
                this.timeArr=JSON.parse(timeArr);

                var shopId=this.shopId;
                var param = JSON.stringify(this.timeArr);

                event.save('timeArr'+this.shopId,param);
                // $.cookie('timeArr'+shopId,JSON.stringify(timeArr),{ expires: 7 })//缓存到本地cookie
                this.briskFn();
            },
//根据设置的活跃度时间查询数据
            briskFn:function(){
                var that=this
                let timeArr=this.timeArr

                let len=timeArr.length;
                let arr=[]
                for(let i=0;i<len;i++){
                    let start=i>0?timeArr[i-1].val:1;
                    let end=timeArr[i].val;
                    var obj={start:start,end:end};
                    arr.push(new Object(obj))
                }

                //arr=[{start:1,end:30},{start:30,end:60},{start:60,end:90}]
                var param = this.GLOBAL.sign(this.token,this.imei) + '&' + 'timeArr=' + JSON.stringify(arr);//改
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/businessapp/Manage/customer',//改
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                }, function (res) {
                    that.brisk=res.data.data;
                    that.pieOnPageFinish()
                })
                // $.ajax({
                //     url:'https://www.aftdc.com/businessapp/Manage/customer',
                //     data:{
                //         timeArr:JSON.stringify(arr),
                //         shopId:that.shopId,
                //     },
                //     type:'post',
                //     success:function(res)
                //     {
                //         that.brisk=res.data;
                //         that.cakeChartFn()
                //     }
                // })
            },
            //恢复默认
            defaultSys:function () {
                var shopId=this.shopId
                // $.cookie('timeArr'+shopId,null);//缓存到本地cookie
                event.delete('timeArr'+shopId);
                this.groupingFn();
                this.timeArr=[{name:'活跃顾客',val:30},
                    {name:'沉默顾客',val:60},
                    {name:'流失顾客',val:90},]
                this.briskFn()
            },
            /**************************************** 图例**********************************************************/
            // 总览
//********  趋势  ****
            trendFn:function(index){

                var beforeData=this.orderNum;
                var beforeLen=beforeData.length;
                var data=[];

                for(var i=0;i<beforeLen;i++){

                    beforeData[i].value=parseInt(beforeData[i].value*100)/100;
                    data[i]=beforeData[i]
                }
                if(index!=1){
                    this.firOnPageFinish()
                }


                this.secOnPageFinish()

            },
            // 顾客价值
            // priceFn:function (variable){
            //     let {id,data}=variable;
            //     // const data = [
            //     // { txt: '1(次)', numb: 38 },
            //     // { txt: '2(次)', numb: 52 },
            //     // { txt: '3(次)', numb: 61 },
            //     // { txt: '4(次)', numb: 45 },
            //     // { txt: '5(次及以上)', numb: 48 },
            //     // ];
            //     // document.getElementById(id).innerHTML='';
            //     var heig=document.getElementById(id).clientWidth/1.8;
            //     const chart = new G2.Chart({
            //         container: id,
            //         forceFit: true,
            //         height: heig,
            //         padding: [ 5, 20, 5, heig/2.5 ]
            //     });
            // },
            //获取 URL 传过来的值
            getQueryString(name) {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
                var r = window.location.search.substr(1).match(reg);
                if (r != null) return unescape(r[2]);
                return null;
            },
            back(){
                history.back();
            },
            // 顾客活跃度
            // cakeChartFn:function (){
            //
            //     var that=this;
            //     // document.getElementById("cakeChart").innerHTML='';
            //     /*var brisk=[
            //     {name:"活跃客户",value:7},
            //     {name:"沉默客户",value:5},
            //     {name:"流失客户",value:3},
            //     ];*/
            //     var brisk=that.brisk;
            //
            //     //计算百分比
            //     var numbSum=0;
            //     var lens=brisk.length;
            //     for(var i=0;i<lens; i++){
            //         var value=parseInt(brisk[i].value);
            //         numbSum=numbSum+value
            //     }
            //
            //     //没数据就不描绘图例
            //     if(numbSum===0){
            //         return false
            //     }
            //
            //     for(var j=0;j< lens;j++){
            //         var vals=parseInt(brisk[j].value);
            //         var scale=(vals/numbSum)*100;
            //
            //         scale=scale.toFixed(2);
            //         brisk[j].scale=scale
            //     }
            //     var data=brisk;
            //
            //
            // },
            firOnPageFinish(){
                var that=this
                var option=that.option
                // var choice=that.choice
                option.xAxis.data=[]
                option.series[0].data=[]
                // option.series[0].name=that.chartData[choice][0].type
                // if( option.series[0].name=='订单收入'||option.series[0].name=='营业总额'||option.series[0].name=='商家补贴'){
                //     option.tooltip.formatter='{b}<br>{a}：{c}元'
                // }else{
                //     option.tooltip.formatter='{b}<br>{a}：{c}单'
                // }
                //
                option.tooltip={show:false}
                option.xAxis.axisLine={show: false,onZero: false}
                option.series[0].symbolSize=8
                option.xAxis.splitLine={show: false,interval:0,}
                option.yAxis.splitLine={show: false,}
                if(that.dateChoice==3){
                    option.series[0].symbol='none'
                }else{
                    option.series[0].symbol='circle'
                }
                for(var i in that.orderNum){
                    option.xAxis.data.push(that.orderNum[i].month)
                    option.series[0].data.push(that.orderNum[i].value)
                }
                // console.log(   option)
                webview.postMessage(that.$refs.firWebview, {message: {option:option,chartType:0}});
            },
            secOnPageFinish(){
                var that=this
                var option=that.option
                option.xAxis.data=[]
                option.series[0].data=[]
                option.tooltip={
                    show:true,
                    trigger:'axis',
                    confine:'true',
                    textStyle:{
                        fontSize:12,
                    },
                    formatter: '{b}<br>{a}：{c}人',
                }
                option.xAxis.axisLine={show: true,onZero: false}
                option.xAxis.splitLine={show: true,interval:0,}
                option.xAxis.axisPointer={
                    lineStyle:{
                        color:'#53beb7'
                    }
                }
                option.series[0].symbol='circle'
                option.series[0].symbolSize=6
                option.yAxis.splitLine={show: true,}
                if(that.counts==1){
                    option.series[0].name='下单顾客'
                }else if(that.counts==2){
                    option.series[0].name='新顾客'
                }else if(that.counts==3){
                    option.series[0].name='老顾客'
                }
                for(var i in that.orderNum){
                    option.xAxis.data.push(that.orderNum[i].month)
                    option.series[0].data.push(that.orderNum[i].value)
                }
                webview.postMessage(that.$refs.secWebview, {message: {option:option,chartType:0}});
            },
            pieOnPageFinish(){
                var that=this
                var option=that.pieOption
                option.series[0].data=that.brisk
                webview.postMessage(that.$refs.pieWebview, {message: {option:option,chartType:0}});
            },
            thrOnPageFinish(){
                var that=this
                var option=that.secOption
                option.yAxis.data=[]
                option.series[0].data=[]
                option.tooltip={
                    show:true,
                    trigger:'axis',
                    confine:'true',
                    textStyle:{
                        fontSize:12,
                    },
                    formatter: '{a}<br>{b}：{c}人',
                    axisPointer: {
                        type: 'shadow'
                    }
                }
                option.series[0].name='成交频次'
                for(var i in that.customerNum){
                    option.yAxis.data.push(that.customerNum[i].txt)
                    option.series[0].data.push(that.customerNum[i].numb)
                }
                webview.postMessage(that.$refs.thrWebview, {message: {option:option,chartType:0}});
            },
            fouOnPageFinish(){
                var that=this
                var option=that.secOption
                option.yAxis.data=[]
                option.series[0].data=[]
                option.tooltip={
                    show:true,
                    trigger:'axis',
                    confine:'true',
                    textStyle:{
                        fontSize:12,
                    },
                    formatter: '{a}<br>{b}：{c}人',
                    axisPointer: {
                        type: 'shadow'
                    }
                }
                option.series[0].name='成交金额'
                for(var i in that.customerPay){
                    option.yAxis.data.push(that.customerPay[i].txt)
                    option.series[0].data.push(that.customerPay[i].numb)
                }
                webview.postMessage(that.$refs.fouWebview, {message: {option:option,chartType:0}});
            },
        },


        mounted: function() {
            //渲染顾客结构的图例
            this.dataRequest(1)
        },
    }
</script>


<style scoped>
    .faDown {
    }
    .faUp {
    }
    .scroller {
        flex: 1;
        width: 750px;
        background-color: #f8f8f8;
    }
    .scrollerTwo{
        flex: 1;
        width: 750px;
        position: absolute;
        top: 90px;
        bottom: 0;
        background-color: #fff;
    }
    .cell{
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
    }
    .recordLast {
        background-color: #f8f8f8;
    }
    .row {
        flex-direction: row;
        align-items: center;
    }


    .barTop{
        padding-top: 25px;
        padding-left: 30px;
        padding-right: 30px;
        padding-bottom: 25px;
        background-color: #fff;
    }
    .barTopText{
        flex: 1;
        text-align: center;
        padding-top: 10px;
        padding-bottom: 10px;
        border-top-style: solid;
        border-top-width: 2px;
        border-top-color: #53beb7;
        border-left-style: solid;
        border-left-width: 2px;
        border-left-color: #53beb7;
        border-bottom-style: solid;
        border-bottom-width: 2px;
        border-bottom-color: #53beb7;
    }
    .barTopTextTwo{
        border-right-style: solid;
        border-right-width: 2px;
        border-right-color: #53beb7;
    }
    .barActive{
        background-color: #53beb7;
    }


    /*总览*/
    .overview{
        background-color: #fff;
        padding-bottom: 60px;
        padding-left: 25px;
        padding-right: 25px;
    }
    .lvLin {
        font-weight: 600;
        margin-left: 20px;
    }

    .shiSiIcon {
        width: 8px;
        height: 29px;
        background-color: #53beb7;
    }

    .topnBun {
        margin-top: 20px;
        padding-top: 30px;
        padding-bottom: 30px;
        padding-left: 25px;
        padding-right: 25px;
        background-color: #fff;
        border-bottom-style: solid;
        border-bottom-width: 2px;
        border-bottom-color: #e0e0e0;
    }
    .topnBunText{
        flex: 1;
        text-align: right;
    }

    .number {
        width: 30px;
        height: 30px;
        border-radius: 40px;
        background-color: #C0C0C0;
        color: #fff;
        line-height: 30px;
        text-align: center;
        margin-left: 20px;
    }

    .overviewOne{
        margin-top: 25px;
        margin-bottom: 25px;
        padding-left: 30px;
        padding-right: 30px;
        flex: 1;
        justify-content: space-between;
    }
    .overviewBr{
        border-right-style: dashed;
        border-right-width: 2px;
        border-right-color: #dedede;
    }
    .overviewOneTop{
        margin-top: 15px;
    }
    .bold{
        font-weight: bold;
    }
    .black{
    }
    .overviewTwo{
        border-top-style: dashed;
        border-top-width: 2px;
        border-top-color: #dedede;
        border-bottom-style: solid;
        border-bottom-width: 2px;
        border-bottom-color: #dedede;
    }
    .overviewS{
        background-color: #fff;
    }
    .lengthDiv{
        margin-left: 10px;
        height: 15px;
        background-color: #dedede;
        width: 155px;
    }
    .trend{
        padding-top: 40px;
        padding-left: 30px;
        padding-right: 30px;
        padding-bottom: 40px;
        background-color: #fff;
    }
    .trendText{
        padding-left: 20px;
        padding-right: 20px;
        padding-top: 8px;
        padding-bottom: 8px;
        background-color: #f8f8f8;
        margin-right: 25px;
        border-radius: 30px;
        color: #999;
    }
    .trendTextTwo{
        background-color: #53beb7;
        color: #fff;
    }
    .trendMy{
        margin-top: 40px;
    }
    .peopleHobbyBar{
        border-bottom-style: solid;
        border-bottom-width: 2px;
        border-bottom-color: #dedede;
        background-color: #fff;
    }
    .classificationTableBig{
        width: 750px;
        height: 406px;
        align-items:center;
        justify-content: center;
        background-color: #999;
    }
    .classificationTable{
        width: 405px;
        height: 406px;
        background-color: #53beb7;
    }
    .peopleHobbyBarText{
        flex: 1;
        padding-top: 15px;
        padding-bottom: 15px;
        border-bottom-style: solid;
        border-bottom-width: 5px;
        border-bottom-color: #fff;
        color: #999;
        text-align: center;
    }
    .hobbyActive{
        border-bottom-style: solid;
        border-bottom-width: 5px;
        border-bottom-color: #53beb7;
        color: #53beb7;
    }
    .hobbyList{
        padding-left: 25px;
        padding-right: 25px;
        padding-bottom: 25px;
    }
    .hobbyListLi{
        margin-top: 25px;
    }
    .hobbyListLiIndex{
        color: #ff5a5a;
    }
    .hobbyListLiName{
        flex: 1;
    }
    .hobbyMore{
        margin-top: 25px;
        justify-content: center;
    }
    .hobbyMoreIcons{
        width: 20px;
        height: 20px;
    }
    .hobbyMoreIcon{
        width: 20px;
        height: 20px;
        transform: rotate(270deg);
    }
    .hobbyMoreIconTwo{
        width: 20px;
        height: 20px;
        transform: rotate(90deg);
    }
    .noShop{
        text-align: center;
        margin-top: 25px;
    }
    .noActive{
        align-items: center;
    }
    .changeActive{
        padding-top: 10px;
        padding-bottom: 10px;
        width: 200px;
        background-color: #53beb7;
        color: #fff;
        text-align: center;
        margin-top: 20px;
        border-radius: 5px;
    }
    .classification{
        width: 750px;
        padding-top: 25px;
        padding-bottom: 25px;
        padding-left: 20px;
        padding-right: 20px;
        justify-content: space-between;
        background-color: #fff;
        border-top-style: solid;
        border-top-width: 2px;
        border-top-color: #f1f1f1;
    }
    .classificationTwo{
        width: 750px;
        padding-top: 25px;
        padding-bottom: 25px;
        padding-left: 20px;
        padding-right: 20px;
        margin-top: 20px;
        justify-content: space-between;
        background-color: #fff;
    }
    .classificationOne{
        font-weight: bold;
    }
    .flex{
        flex: 1;
    }
    .deal{
        margin-top: 20px;
        padding-top: 25px;
        padding-bottom: 25px;
        padding-left: 25px;
        padding-right: 25px;
        background-color: #fff;
    }

    .bottomBar{
        background-color: #484848;
    }
    .bottomDiv{
        flex: 1;
        justify-content:center;
        padding-top: 20px;
        padding-bottom: 20px;
    }
    .bottomDivTwo{
        flex: 1;
        justify-content: center;
        border-left-style: solid;
        border-left-width: 2px;
        border-left-color: #cdcdcd;
        padding-top: 20px;
        padding-bottom: 20px;
    }
    .bottomIcon{
        width: 46px;
        height: 46px;
        margin-right: 5px;
    }
    .bottomActive{
        color:#53beb7;
    }

    .groupBox{
    }
    .groupBoxDiv{
        padding-left: 25px;
        padding-right: 25px;
        padding-top: 30px;
        padding-bottom: 30px;
        border-bottom-style: solid;
        border-bottom-width: 2px;
        border-bottom-color: #dedede;
    }
    .groupBoxDivTop{
    }
    .groupBoxName{
        font-weight: bold;
    }
    .groupBoxPlace{
        margin-left: 30px;
    }
    .groupBoxBottom{
        margin-top: 20px;
    }
    .groupBoxOne{
        width: 150px;
        text-align: center;
        padding-top: 7px;
        padding-bottom: 7px;
        color: #999;
        border-style: solid;
        border-width: 2px;
        border-color: #dedede;
        border-radius: 5px;
    }
    .groupBoxTwo{
        width: 150px;
        text-align: center;
        padding-top: 7px;
        padding-bottom: 7px;
        color: #999;
        border-style: solid;
        border-width: 2px;
        border-color: #dedede;
        border-radius: 5px;
    }
    .groupBoxThree{
        padding-left: 30px;
        padding-right: 30px;
        color: #999;
    }
    .groupBoxFour{
        width: 150px;
        text-align: center;
        padding-top: 7px;
        padding-bottom: 7px;
        color: #999;
        border-style: solid;
        border-width: 2px;
        border-color: #dedede;
        border-radius: 5px;
    }
    .groupText{
        padding-top: 25px;
        padding-bottom: 25px;
        padding-right: 25px;
        text-align: right;
    }

    .enterButton {
        width: 750px;
        flex-direction: row;
        justify-content: space-around;
        /*position: fixed;*/
        /*left: 0;            存在时固定在底部*/
        /*bottom: 0;*/
        /*right: 0;*/
        background-color: #fff;
        padding-top: 20px;
        padding-bottom: 10px;
        padding-left: 30px;
        padding-right: 30px;
    }

    .okButton:active {
        background-color: #57aba5;
    }
    .noButton:active{
        background-color: #f8f8f8;
    }
    .explain{
        margin-top: 40px;
        margin-bottom: 20px;
        margin-right: 25px;
        text-align: right;
    }
    .demo-content{
        justify-content: space-between;
    }
    .demoCancel{
        padding-left: 25px;
        padding-right: 25px;
        padding-top: 20px;
        padding-bottom: 20px;
    }
    .selectTime{
        text-align: center;
        padding-top: 15px;
        padding-bottom: 15px;
    }
    .secWebview{
        width: 700px;
        height: 351px;
    }
</style>


