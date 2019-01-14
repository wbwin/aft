<template>
    <div class="wrapper" @touchmove="touchmove" @touchend="touchend" :style="{visibility: visibility}">
        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="backClick"
                    @wxcMinibarRightButtonClicked="save"
                    v-once
            >
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">订单设置</text>
                <text :style="GLOBAL.headerRight"  slot="right">保存</text>
            </wxc-minibar>
        </div>

        <scroller class="scroller" @scroll="scrollMove">
            <div style="padding-bottom: 20px">
                <div class="scrollerCell">


                    <div class="betweenDiv" >
                        <text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor,flex:0.6}">主打业务</text>
                        <div class="inputDiv" @click="pick">

                            <text :style="{'font-size': GLOBAL.defaultFS, 'color': index==-1?'#999':GLOBAL.dColor}">{{index==-1?'请选择':mainBusiness}}</text>
                            <image class="arrowRightIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                        </div>
                    </div>
                    <!--<div class="betweenDiv">-->
                    <!--<text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor,flex:0.6}">拼单</text>-->
                    <!--&lt;!&ndash;<div ref="test2" :class="[startSwitch==false?'close':'open']"&ndash;&gt;-->
                    <!--&lt;!&ndash;style="justify-content: center;padding-left: 1px;"&ndash;&gt;-->
                    <!--&lt;!&ndash;@click="bill">&ndash;&gt;-->
                    <!--&lt;!&ndash;<div ref="test1" :class="[startSwitch==false?'isClose':'isOpen']"></div>&ndash;&gt;-->
                    <!--&lt;!&ndash;</div>&ndash;&gt;-->
                    <!--</div>-->
                    <!--<div class="betweenDiv">-->
                    <!--<text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor,flex:0.6}">拼单最低人数</text>-->
                    <!--<div class="inputDiv" >-->
                    <!--<input :style="GLOBAL.inputText"   ref="firInput" class="input" @focus="allFocus" @blur="allBlur" v-model="collageNumb"  type="number" placeholder="拼单成功人数"/>-->
                    <!--<text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor}">人</text>-->
                    <!--</div>-->
                    <!--</div>-->

                    <!--<div class="betweenDiv" v-for="(item,index) in fullSubtraction">-->
                    <!--<text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor,flex:0.6}">{{index==0?'满减优惠':''}}</text>-->
                    <!--<div class="inputDiv" >-->
                    <!--<text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor}" style="margin-right: 20px">满</text>-->
                    <!--<input class=" input inputText"   ref="secInput"  @focus="allFocus" @blur="allBlur" v-model="item.full"  type="number" placeholder="单位(元)"/>-->
                    <!--<text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor}" style="margin-right: 20px;margin-left: 10px">减</text>-->
                    <!--<input class=" input inputText"    ref="thrInput"  @focus="allFocus" @blur="allBlur" v-model="item.subtraction"  type="number" placeholder="单位(元)"/>-->
                    <!--<image class="delIcon" src="https://image.aftdc.com/appBimg/ic_list_item_delete.png" @click="delFullSubtraction(index)"></image>-->

                    <!--</div>-->
                    <!--</div>-->
                    <!--<div class="betweenDiv" v-if="fullSubtraction.length<5">-->
                    <!--<text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor,flex:0.6}">{{fullSubtraction.length==0?'满减优惠':''}}</text>-->
                    <!--<div class="inputDiv" :style="{justifyContent:fullSubtraction.length>0?'center':'flex-end'}" >-->
                    <!--<image class="addIcon" src="https://image.aftdc.com/appBimg/add_icon.png" @click="addFullSubtraction"></image>-->
                    <!--</div>-->
                    <!--</div>-->
                    <!--<div class="betweenDiv">-->
                    <!--<text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor,flex:0.6}">拼单成失效时间</text>-->
                    <!--<div class="inputDiv" >-->
                    <!--<text :style="{'font-size': GLOBAL.bigFS, 'color': '#999'}" class="jumpSize" style="margin-right: 15px;">请选择</text>-->
                    <!--&lt;!&ndash;<text :style="{'font-size': GLOBAL.biggerFS, 'color': GLOBAL.dColor}">重新选择</text>&ndash;&gt;-->
                    <!--<image class="arrowRightImg" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>-->
                    <!--</div>-->
                    <!--</div>-->
                </div>
                <!-- ************ 发票 ************ -->
                <div class="scrollerCell">
                    <div class="betweenDiv">
                        <text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor,flex:0.6}">开发票</text>
                        <div ref="invoiceF" :class="[invoice===false?'close':'open']"
                             style="justify-content: center;padding-left: 1px;"
                             @click="bill(5)">
                            <div ref="invoiceS" :class="[invoice===false?'isClose':'isOpen']"></div>
                        </div>
                    </div>
                </div>

                <div class="scrollerCell">

                    <div class="betweenDiv">
                        <text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor,flex:0.6}">外卖</text>
                        <div ref="takeOutF" :class="[takeOutSwitch===false?'close':'open']"
                             style="justify-content: center;padding-left: 1px;"
                             @click="bill(0)">
                            <div ref="takeOutS" :class="[takeOutSwitch===false?'isClose':'isOpen']"></div>
                        </div>
                    </div>
                    <div class="betweenDiv" v-if="takeOutSwitch">
                        <text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor,flex:0.6}">配送费</text>
                        <div class="inputDiv" >
                            <input :style="GLOBAL.inputText"  ref="inputOne" class="input" @focus="allFocus(0)" @blur="allBlur"  v-model="distributionFee"  type="number" placeholder="配送费"/>
                            <text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor}">元</text>
                        </div>
                    </div>
                    <div class="betweenDiv" v-if="takeOutSwitch">
                        <text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor,flex:0.6}">起送价</text>
                        <div class="inputDiv" >
                            <input :style="GLOBAL.inputText"   ref="inputTwo" class="input" @focus="allFocus(1)" @blur="allBlur"  v-model="deliveryFreeMoney"  type="number" placeholder="起送费"/>
                            <text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor}">元</text>
                        </div>
                    </div>
                    <div class="betweenDiv" v-if="takeOutSwitch">
                        <text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor,flex:0.6}">配送距离</text>
                        <div class="inputDiv" >
                            <input :style="GLOBAL.inputText"   ref="inputThree" class="input" @focus="allFocus(2)" @blur="allBlur"  v-model="distance" type="number" placeholder="配送距离"/>
                            <text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor}" >公里</text>
                        </div>
                    </div>
                </div>

                <div class="scrollerCell" >

                    <div class="betweenDiv">
                        <text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor,flex:0.6}">外卖预订</text>
                        <div ref="takeOutBookF" :class="[takeOutBookSwitch===false?'close':'open']"
                             style="justify-content: center;padding-left: 1px;"
                             @click="bill(4)">
                            <div ref="takeOutBookS" :class="[takeOutBookSwitch===false?'isClose':'isOpen']"></div>
                        </div>
                    </div>
                    <div class="betweenDiv" v-if="takeOutBookSwitch">
                        <text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor,flex:0.6}">商家接受预订日期</text>
                        <div class="inputDiv" @click="choiceDateShowClick(0)">

                            <text :style="{'font-size': GLOBAL.defaultFS, 'color': choiceDateMin===''?'#999':GLOBAL.dColor}">{{choiceDateMin===''?'请选择':list[choiceDateMin].title+'~'}}{{choiceDateMax===''?'':list[choiceDateMax].title}}</text>
                            <image class="arrowRightIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                        </div>
                    </div>
                    <div class="betweenDiv" v-if="takeOutBookSwitch">
                        <text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor,flex:0.6}">预订单时间提醒</text>
                        <div class="inputDiv" @click="choiceTimeShowClick(0)">

                            <text :style="{'font-size': GLOBAL.defaultFS, 'color': remindTime==-1?'#999':GLOBAL.dColor}">{{remindTime==-1?'请选择':timeList[remindTime]}}</text>
                            <image class="arrowRightIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                        </div>
                    </div>
                </div>

                <div class="scrollerCell">
                    <div class="cell">
                        <div class="cell_left">
                            <div class="cellTitle">
                                <text  :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">到店自取</text>
                            </div>
                        </div>
                        <div ref="selftest1" :class="[selfSwitch==false?'close':'open']"
                             style="justify-content: center;padding-left: 1px;"
                             @click="bill(2)">
                            <div ref="selftest2" :class="[selfSwitch==false?'isClose':'isOpen']"></div>
                        </div>
                    </div>
                    <div class="betweenDiv" v-if="selfSwitch" @click="mealTimePick()">
                        <div class="cell_left">
                            <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">备餐时间</text>
                            <text class="explainSize" :style="{fontSize:GLOBAL.defaultFS}">请在规定时间内完成备餐</text>
                        </div>
                        <div class="inputDiv">

                            <text class="choiceTimeSize" :style="{fontSize:GLOBAL.bigFS, color: choiceMealTime?GLOBAL.dColor:'#999'}">{{choiceMealTime?choiceMealTime:'请选择'}}</text>
                            <image class="arrowRightIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>

                            <!--<image class="arrowImg"-->
                            <!--:src="'https://image.aftdc.com/'+goodsImg"></image>-->

                        </div>

                    </div>
                    <div class="betweenDiv" v-if="selfSwitch">
                        <text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor,flex:0.6}">起订价</text>
                        <div class="inputDiv" >
                            <input :style="GLOBAL.inputText"   ref="inputFive" class="input" @focus="allFocus(4)" @blur="allBlur"  v-model="selfDeliveryFreeMoney"  type="number" placeholder="到店自取最低价格"/>
                            <text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor}">元</text>
                        </div>
                    </div>
                    <div class="betweenDiv" v-if="selfSwitch">
                        <text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor,flex:0.6}">自取范围</text>
                        <div class="inputDiv" >
                            <input :style="GLOBAL.inputText"   ref="inputSix" class="input" @focus="allFocus(5)" @blur="allBlur"  v-model="selfDistance" type="number" placeholder="到店自取距范围"/>
                            <text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor}" >公里</text>
                        </div>
                    </div>
                </div>
                <div class="scrollerCell" >

                    <div class="betweenDiv">
                        <text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor,flex:0.6}">到店自取预订</text>
                        <div ref="selfTakeOutBookF" :class="[selfTakeOutBookSwitch===false?'close':'open']"
                             style="justify-content: center;padding-left: 1px;"
                             @click="bill(8)">
                            <div ref="selfTakeOutBookS" :class="[selfTakeOutBookSwitch===false?'isClose':'isOpen']"></div>
                        </div>
                    </div>
                    <div class="betweenDiv" v-if="selfTakeOutBookSwitch">
                        <text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor,flex:0.6}">商家接受预订日期</text>
                        <div class="inputDiv" @click="choiceDateShowClick(1)">

                            <text :style="{'font-size': GLOBAL.defaultFS, 'color': selfChoiceDateMin===''?'#999':GLOBAL.dColor}">{{selfChoiceDateMin===''?'请选择':list[selfChoiceDateMin].title+'~'}}{{selfChoiceDateMax===''?'':list[selfChoiceDateMax].title}}</text>
                            <image class="arrowRightIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                        </div>
                    </div>
                    <div class="betweenDiv" v-if="selfTakeOutBookSwitch">
                        <text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor,flex:0.6}">预订单时间提醒</text>
                        <div class="inputDiv" @click="choiceTimeShowClick(2)">

                            <text :style="{'font-size': GLOBAL.defaultFS, 'color': selfReminderTime==-1?'#999':GLOBAL.dColor}">{{selfReminderTime==-1?'请选择':timeList[selfReminderTime]}}</text>
                            <image class="arrowRightIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                        </div>
                    </div>
                </div>
                <div class="scrollerCell">

                    <div class="betweenDiv">
                        <text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor,flex:0.6}">堂食预订</text>
                        <div ref="foodBookF" :class="[foodBookSwitch===false?'close':'open']"
                             style="justify-content: center;padding-left: 1px;"
                             @click="bill(1)">
                            <div ref="foodBookS" :class="[foodBookSwitch===false?'isClose':'isOpen']"></div>
                        </div>
                    </div>
                    <div class="betweenDiv" v-if="foodBookSwitch">
                        <text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor,flex:0.6}">起订金额</text>
                        <div class="inputDiv" >
                            <input :style="GLOBAL.inputText"   ref="inputFour" class="input" @focus="allFocus(3)" @blur="allBlur" v-model="bookMoney"  type="number" placeholder="预订金额"/>
                            <text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor}">元</text>
                        </div>
                    </div>
                    <div class="betweenDiv" v-if="foodBookSwitch">
                        <text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor,flex:0.6}">商家接受预订日期</text>
                        <div class="inputDiv">

                            <text class=" flewSize" :style="{fontSize:GLOBAL.bigFS,color:orderStartDate!=''?GLOBAL.dColor:'#999'}"  @click="chooseTime(0,1)">{{orderStartDate!=''?orderStartDate:'开始日期'}}</text>
                            <text  :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}"> — </text>
                            <text class=" flewSize" :style="{fontSize:GLOBAL.bigFS,color:orderEndDate!=''?GLOBAL.dColor:'#999'}"  @click="chooseTime(0,2)">{{orderEndDate!=''?orderEndDate:'结束日期'}}</text>
                        </div>
                    </div>
                    <div class="betweenDiv" v-if="foodBookSwitch">
                        <!--<text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor,flex:0.6}">商家接受预订时间</text>-->
                        <!--<div class="inputDiv"  >-->
                        <!--<text class=" flewSize" :style="{fontSize:GLOBAL.bigFS,color:orderStartTime!=''?GLOBAL.dColor:'#999'}"  @click="chooseTime(1,1)">{{orderStartTime!=''?orderStartTime:'开始时间'}}</text>-->
                        <!--<text  :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}"> — </text>-->
                        <!--<text class=" flewSize" :style="{fontSize:GLOBAL.bigFS,color:orderEndTime!=''?GLOBAL.dColor:'#999'}"  @click="chooseTime(1,2)">{{orderEndTime!=''?orderEndTime:'结束时间'}}</text>-->
                        <!--</div>-->
                        <text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor,flex:0.6}">休息时间支持预订</text>
                        <div ref="restTimeF" :class="[restTimeBook===false?'close':'open']"
                             style="justify-content: center;padding-left: 1px;"
                             @click="bill(7)">
                            <div ref="restTimeS" :class="[restTimeBook===false?'isClose':'isOpen']"></div>
                        </div>
                    </div>
                    <div class="betweenDiv" v-if="foodBookSwitch">
                        <text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor,flex:0.6}">预订单时间提醒</text>
                        <div class="inputDiv" @click="choiceTimeShowClick(1)">

                            <text :style="{'font-size': GLOBAL.defaultFS, 'color': foodRemindTime==-1?'#999':GLOBAL.dColor}">{{foodRemindTime==-1?'请选择':timeList[foodRemindTime]}}</text>
                            <image class="arrowRightIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                        </div>
                    </div>
                </div>
                <!--<div class="scrollerCell">-->
                <!--<div class="cell">-->
                <!--<div class="cell_left">-->
                <!--<div class="cellTitle">-->
                <!--<text  :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">团购</text>-->
                <!--</div>-->
                <!--</div>-->
                <!--<div ref="grouptext1" :class="[grouponSwitch==false?'close':'open']"-->
                <!--style="justify-content: center;padding-left: 1px;"-->
                <!--@click="bill(6)">-->
                <!--<div ref="grouptext2" :class="[grouponSwitch==false?'isClose':'isOpen']"></div>-->
                <!--</div>-->
                <!--</div>-->
                <!--</div>-->
                <!--<div class="scrollerCell">-->

                <!--<div class="betweenDiv">-->
                <!--<text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor,flex:0.6}">分销</text>-->
                <!--<div ref="distributionF" :class="[distributionSwitch===false?'close':'open']"-->
                <!--style="justify-content: center;padding-left: 1px;"-->
                <!--@click="bill(2)">-->
                <!--<div ref="distributionS" :class="[distributionSwitch===false?'isClose':'isOpen']"></div>-->
                <!--</div>-->
                <!--</div>-->
                <!--<div class="betweenDiv">-->
                <!--<text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor,flex:0.6}">一级分销奖励</text>-->
                <!--<div class="inputDiv">-->
                <!--<input :style="GLOBAL.inputText"   ref="sixInput" class="input" @focus="allFocus" @blur="allBlur"  v-model="primaryDistribution"  type="number" placeholder="订单金额的百分比"/>-->
                <!--<text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor}">%</text>-->
                <!--</div>-->
                <!--</div>-->
                <!--<div class="betweenDiv">-->
                <!--<text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor,flex:0.6}">二级分销奖励</text>-->
                <!--<div class="inputDiv" >-->
                <!--<input :style="GLOBAL.inputText"   ref="sevInput" class="input" @focus="allFocus" @blur="allBlur"  v-model="SecDistribution"  type="number" placeholder="订单金额的百分比"/>-->
                <!--<text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor}">%</text>-->
                <!--</div>-->
                <!--</div>-->

                <!--</div>-->

                <!--<div class="scrollerCell">-->

                <!--<div class="betweenDiv">-->
                <!--<text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor,flex:0.6}">积分</text>-->
                <!--<div ref="integrationF" :class="[integration===false?'close':'open']"-->
                <!--style="justify-content: center;padding-left: 1px;"-->
                <!--@click="bill(3)">-->
                <!--<div ref="integrationS" :class="[integration===false?'isClose':'isOpen']"></div>-->
                <!--</div>-->
                <!--</div>-->
                <!--<div class="betweenDiv">-->
                <!--<text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor,flex:0.6}">购买赠送</text>-->
                <!--<div class="inputDiv" >-->
                <!--<input :style="GLOBAL.inputText"   ref="inputFive" class="input" @focus="allFocus" @blur="allBlur" v-model="integrationNumb"  type="number" placeholder="订单金额百分比"/>-->
                <!--<text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor}">%</text>-->
                <!--</div>-->
                <!--</div>-->
                <!--<div class="betweenDiv">-->
                <!--<text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor,flex:0.6}">积分价值</text>-->
                <!--<div class="inputDiv" >-->
                <!--<input :style="GLOBAL.inputText"   ref="inputSix" class="input" @focus="allFocus" @blur="allBlur" v-model="jzNumb"  type="number" placeholder="1积分价值"/>-->
                <!--<text :style="{'font-size': GLOBAL.bigFS, 'color': GLOBAL.dColor}">元</text>-->
                <!--</div>-->
                <!--</div>-->
                <!--</div>-->

            </div>

        </scroller>

        <wxc-mask height="970"
                  width="650"
                  border-radius="10"
                  mask-bg-color="#FFFFFF"
                  :has-animation="animation"
                  :show="choiceDate"
                  @wxcMaskSetHidden="wxcMaskSetHidden">
            <div class="content">
                <div class="checkList" @click="checkClick(item.checked,index)" v-for="(item,index) in list">
                    <text :style="{fontSize: GLOBAL.bigFS, color: GLOBAL.dColor}">{{item.title}}</text>
                    <image class="checkIcon" :src="item.checked?'https://image.aftdc.com/appBimg/ic_check_box_checked.png':'https://image.aftdc.com/appBimg/ic_check_box_normal.png'"></image>
                </div>
                <text :style="{fontSize: GLOBAL.smallFS, color:maskTips?'#ff4500':'#999'}" style="margin-left: 10px;margin-top:15px">至少选择一天或相邻几天，不可隔天选择</text>
                <div class="maskButton">
                    <wxc-button class="cancelButton" text="取消"  :btnStyle="smCancelButton" :textStyle="GLOBAL.cancelButtonText"
                                @wxcButtonClicked="wxcMaskSetHidden"></wxc-button>
                    <wxc-button class="sureButton" text="确定" :textStyle="GLOBAL.buttonText" :btnStyle="smDefaultButton"
                                @wxcButtonClicked="choiceDateSure"></wxc-button>
                </div>
                <!--<wxc-checkbox-list :list="list"-->
                <!--:config="config"-->
                <!--@wxcCheckBoxListChecked="wxcCheckBoxListChecked"></wxc-checkbox-list>-->
            </div>

        </wxc-mask>
        <wxc-mask height="970"
                  width="650"
                  border-radius="10"
                  mask-bg-color="#FFFFFF"
                  :has-animation="animation"
                  :show="choiceTime"
                  @wxcMaskSetHidden="wxcMaskSetHidden">
            <div class="content">
                <scroller style="flex: 1" show-scrollbar="false" >
                    <div class="checkList" @click="choiceTimeClick(index)" v-for="(item,index) in timeList">
                        <text :style="{fontSize: GLOBAL.bigFS, color: GLOBAL.dColor}">{{item}}</text>
                        <image class="checkIcon" :src="timeListIndex==index?'https://image.aftdc.com/appBimg/ic_check_box_checked.png':'https://image.aftdc.com/appBimg/ic_check_box_normal.png'"></image>
                    </div>
                </scroller>
                <div class="maskButton">
                    <wxc-button class="cancelButton" text="取消"  :btnStyle="smCancelButton" :textStyle="GLOBAL.cancelButtonText"
                                @wxcButtonClicked="wxcMaskSetHidden"></wxc-button>
                    <wxc-button class="sureButton" text="确定" :textStyle="GLOBAL.buttonText" :btnStyle="smDefaultButton"
                                @wxcButtonClicked="choiceTimeSure"></wxc-button>
                </div>
                <!--<wxc-checkbox-list :list="list"-->
                <!--:config="config"-->
                <!--@wxcCheckBoxListChecked="wxcCheckBoxListChecked"></wxc-checkbox-list>-->
            </div>
        </wxc-mask>
        <!--<div class="blank" :style="{left:blankLeft}" @click="blankClick"></div>-->
        <toast ref="toast"></toast>
    </div>
</template>

<script>
    import {WxcButton, WxcDialog, WxcIcon, WxcMinibar,WxcMask} from 'weex-ui'
    import Toast from './Toast.vue'
    const navigator = weex.requireModule('navigator');
    const event = weex.requireModule('event');
    const post = weex.requireModule('stream');
    const modal = weex.requireModule('modal');
    const animation = weex.requireModule('animation');
    const picker = weex.requireModule('picker')
    const items = ['外卖', '堂食', '到店自取']

    export default {
        components: {WxcButton, WxcDialog,WxcIcon, WxcMinibar,WxcMask,Toast},
        name: 'App',

        data() {
            return {
                restTimeBook: false,//休息时间支持预订
                index: -1,//picker默认选择第几个
                mainBusiness:'',//picker默认值
                touch:false,//用于获取焦点和失去焦点的兼容
                takeOutSwitch:false,//是否已开启外卖
                takeOutBookSwitch:false,//是否已开启外卖预订
                foodBookSwitch:false,//是否已开启堂食预订
                selfSwitch:false,//是否开启到店自取
                selfTakeOutBookSwitch:false,//是否开启到店自取预订
                grouponSwitch:false,//是否开启团购
                distributionSwitch:false,//是否已开启分销
                integration:false,//是否已开启积分
                invoice:false,//是否已开启发票

                collageNumb:'',//拼单人数
                collageCount:'',//拼单折扣
                // fullSubtraction:[],//拼单满减优惠{full:5,subtraction:3}
                distributionFee:'0',//配送费
                distance:'',//配送距离
                bookMoney:'0',//预订金额
                // primaryDistribution:'',//一级分销
                // SecDistribution:' ',//二级分销
                integrationNumb:'',//积分个数
                jzNumb:'',//积分价值
                deliveryFreeMoney:'0',//起送费
                timeIndex:'',
                timeToggle:'',
                inputFocus:true,
                blurPrevent:false,//阻止多次失去焦点的定时器
                aa:false,
                // blankLeft:'750px',
                choiceDate:false,//选择预订日期弹出层
                maskTips:false,//判断选择预订日期提示的颜色
                choiceDateMax:'',//保存的日期的最大值（0~7）
                choiceDateMin:'',//保存的日期的最小值（0~7）
                choiceDateToggle:'',
                foodChoiceDateMax:'',//堂食预订保存的日期的最大值（0~7）
                foodChoiceDateMin:'',//堂食预订保存的日期的最小值（0~7）
                list: [//预订日期范围
                    { title: '今天(第0天)'},
                    { title: '明天(第1天)' },
                    { title: '后天(第2天)' },
                    { title: '第3天'},
                    { title: '第4天'},
                    { title: '第5天'},
                    { title: '第6天'},
                    { title: '第7天'},

                ],
                checkedList:[],//选中的所有日期（保存时勿用此来做接口数据保存）
                choiceTime:false,//预订时间弹出层
                timeList:['30分钟','45分钟','1小时','1小时15分钟','1小时30分钟','1小时45分钟','2小时','2小时15分钟','2小时30分钟','2小时45分钟','3小时'],//预订时间服围
                timeListIndex:-1,//选中的预订时间
                remindTime:-1,//保存的预订时间
                foodRemindTime:-1,//堂食预订保存的预订时间
                orderStartDate:'',//堂食预订可预订开始日期
                orderEndDate:'',//堂食预订可预订结束日期
                orderStartTime:'',//堂食预订可预订开始时间
                orderEndTime:'',//堂食预订可预订结束时间
                choiceTimeToggle:'',
                smCancelButton:{
                    backgroundColor: '#fff',
                    width: '270',
                    height:'80',
                    borderColor: '#666',
                    borderWidth: '1px',
                    borderStyle: 'solid'
                },
                smDefaultButton:{
                    backgroundColor: '#53beb7',
                    width: '270',
                    height:'80',
                },
                token:'',
                imei:'',
                animation:false,
                choiceMealTime:'',//备餐时间
                selfDeliveryFreeMoney:'0',//到店自取最低价格
                selfDistance:'',//到店自取范围
                selfChoiceDateMin:'',//保存的日期的最大值（0~7）
                selfChoiceDateMax:'',//保存的日期的最小值（0~7）
                selfReminderTime:-1,
                mealTimeIndex:0,
                mealTime:[],//备餐时间
                visibility:'hidden',
            }
        },
        computed: {
            mainBusiness1 (){
                if (this.index < items.length) {
                    return items[this.index]
                }
                else{
                    return ''
                }

            }


        },
        created () {
            this.visibility='hidden';
            this.token = weex.config.token;
            this.imei = weex.config.imei;
            var param = this.GLOBAL.sign(this.token,this.imei);
            var that = this;
            for (var i = 1; i <= 12; i++) {
                var time = 5 * i + '分钟'
                that.mealTime.push(time);
            }
            post.fetch({
                method: 'POST',
                type: 'json',
                body: param,
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                url: 'https://www.aftdc.com/businessapp/Store/getStoreConfiguration',
            }, function (e) {
                if (e.data.res ===1) {
                    var shops = e.data.shops;
                    var shops_select = e.data.shops_select;
                    //主打
                    if (shops.featured == 0) { that.index=0;that.mainBusiness = '外卖'; }else if (shops.featured == 3) { that.index=1;that.mainBusiness = '堂食'; } else if (shops.featured == 4) { that.index=3;that.mainBusiness = '团购'; }else if (shops.featured == 5) { that.index=2;that.mainBusiness = '到店自取'; }
                    if (shops.pingdanNum) {that.collageNumb = shops.pingdanNum;}
                    // if (shops.fullSubtraction) {that.collageCount = shops.fullSubtraction;}
                    // if (shops.fullSubtraction.length > 0) {that.fullSubtraction = shops.fullSubtraction;}

                    if (shops.deliveryStartMoney) {that.distributionFee = shops.deliveryStartMoney;}
                    if (shops.range) {that.distance = shops.range;}
                    if (shops.deliveryFreeMoney) {that.deliveryFreeMoney = shops.deliveryFreeMoney;}
                    if (shops.bookingMoney) {that.bookMoney = shops.bookingMoney;}
                    // if (shops.recommand_A) {that.primaryDistribution = shops.recommand_A;}
                    // if (shops.recommand_B) {that.SecDistribution = shops.recommand_B;}
                    // if (shops.invoiceRemarks) {that.integrationNumb = shops.invoiceRemarks;}
                    // if (shops.invoiceRemarkstrD) {that.jzNumb = shops.invoiceRemarkstrD;}
                    //外卖预订
                    if (shops.choiceDateMin) {that.choiceDateMin = shops.choiceDateMin - 1;}
                    if (shops.choiceDateMax) {that.choiceDateMax = shops.choiceDateMax - 1;}
                    if (shops.reminderTime){
                        for(var i in that.timeList){
                            if(that.timeList[i]==shops.reminderTime){
                                that.remindTime=i
                                break
                            }
                        }

                    }

                    //堂食预订
                    if (shops.orderStartDate) {that.orderStartDate = shops.orderStartDate;}//预订开始日期
                    if (shops.orderEndDate) {that.orderEndDate = shops.orderEndDate;}//预订结束日期
                    // if (shops.orderStartTime) {that.orderStartTime = shops.orderStartTime;}//可预订开始时间
                    // if (shops.orderEndTime) {that.orderEndTime = shops.orderEndTime;}//可预订结束时间
                    if (shops.foodReminderTime || shops.foodReminderTime === 0){
                        for(var i in that.timeList){
                            if(that.timeList[i]==shops.foodReminderTime){
                                that.foodRemindTime=i
                                break
                            }
                        }
                    }//预订提示时间

                    //到店自取备餐时间
                    if (shops.choiceMealTime) {that.choiceMealTime = shops.choiceMealTime;}//到店自取备餐时间
                    if (shops.selfDeliveryFreeMoney) {that.selfDeliveryFreeMoney = shops.selfDeliveryFreeMoney;}
                    if (shops.selfDistance) {that.selfDistance = shops.selfDistance;}
                    //到店自取预订
                    if (shops.selfChoiceDateMin) {that.selfChoiceDateMin = shops.selfChoiceDateMin - 1;}
                    if (shops.selfChoiceDateMax) {that.selfChoiceDateMax = shops.selfChoiceDateMax - 1;}
                    if (shops.selfReminderTime){
                        for(var i in that.timeList){
                            if(that.timeList[i]==shops.selfReminderTime){
                                that.selfReminderTime=i
                                break
                            }
                        }

                    }

                    if (shops.bill) {that.billTwo(5)}
                    // if (shops_select.tg) {that.bill(6)}
                    if (shops_select.tsyd) {that.billTwo(1)}
                    if (shops_select.wm) {that.billTwo(0)}
                    if (shops_select.ddzq) {that.billTwo(2)}
                    if (shops.selfReserve) {that.billTwo(8)}
                    if (shops.reserve) {that.billTwo(4)}
                    // if (shops_select.fx) {that.bill(2)}
                    // if (shops_select.jf) {that.bill(3)}
                    if (shops_select.restTimeBook) {that.bill(7)}


                }
            });

            event.init();
            weex.requireModule('globalEvent').addEventListener("chooseTime",function(e){
                if (that.timeIndex == 1){
                    if(that.timeToggle==0){
                        that.orderStartDate=e.time
                    }else{
                        that.orderStartTime = e.time;
                    }

                } else{
                    if(that.timeToggle==0){
                        that.orderEndDate=e.time
                    }else{
                        that.orderEndTime = e.time;
                    }
                }
            });
        },
        mounted() {
            var that = this;
            that.visibility='visible';
            //switch按钮开始状态
            that.restTimeBook=!that.restTimeBook
            that.takeOutSwitch=!that.takeOutSwitch;
            that.foodBookSwitch=!that.foodBookSwitch;
            that.distributionSwitch=!that.distributionSwitch;
            // that.integration=!that.integration;
            that.invoice=!that.invoice;
            that.takeOutBookSwitch=!that.takeOutBookSwitch;
            that.selfTakeOutBookSwitch=!that.selfTakeOutBookSwitch;
            that.selfSwitch=!that.selfSwitch;
            // that.grouponSwitch=!that.grouponSwitch;
            that.billTwo(5);//用关联按钮的初始化
            that.billTwo(1);
            that.billTwo(0);
            that.billTwo(4);
            that.billTwo(2);
            that.billTwo(8);
            // that.bill(3);
            // that.bill(6);
            setTimeout(()=>{
                that.bill(7);
            },100)

        },
        methods: {
            pick () {
                var that=this;
                picker.pick({
                    index: this.index,
                    cancelTitleColor:'#999',
                    confirmTitleColor:'#53beb7',
                    items
                }, event => {
                    if (event.result === 'success') {
                        this.mainBusiness = items[event.data]
                        this.index = event.data;
                        if(that.mainBusiness=='外卖'&&that.takeOutSwitch==false){
                            that.bill(0);
                        }
                        else if(that.mainBusiness=='堂食'&&that.foodBookSwitch==false){
                            that.bill(1)
                        }
                        else if(that.mainBusiness=='到店自取'&&that.selfSwitch==false){
                            that.bill(2)
                        }
                        // else if(that.mainBusiness=='团购'&&that.grouponSwitch==false){
                        //     that.bill(6)
                        // }
                    }
                })
            },//picker选择
            //备餐时间选择
            mealTimePick() {
                console.log(12)
                picker.pick({
                    index: this.mealTimeIndex,
                    items: this.mealTime,
                    confirmTitle: '确认',
                    cancelTitle: '取消',

                }, event => {
                    if (event.result === 'success') {
                        this.choiceMealTime = this.mealTime[event.data]
                        this.mealTimeIndex = event.data
                    }
                })
            },
            //选择时间
            chooseTime(toggle,index){
                var that=this
                that.timeToggle=toggle
                that.timeIndex = index
                if(toggle==0){
                    event.chooseTime(true,true,true,false,false,false)
                }else{
                    event.chooseTime(false,false,false,true,true,false)
                }

            },
            // input的获取焦点和失去焦点
            touchmove(){
                this.touch=true;
            },
            touchend(){
                this.touch=false;
            },
            scrollMove(){
                if(this.touch){
                    this.blur()
                }
            },

            mainBusiness1(){

            },

            choiceTimeClick(index){
                var that=this;
                that.timeListIndex=index
            },
            choiceTimeShowClick(toggle){
                var that=this;
                if(toggle==0){
                    that.timeListIndex=that.remindTime;
                }else if(toggle==1){
                    that.timeListIndex=that.foodRemindTime;
                }else{
                    that.timeListIndex=that.selfReminderTime;
                }
                that.choiceTimeToggle=toggle
                that.choiceTime=true
            },
            choiceTimeSure(){
                var that=this
                if(that.choiceTimeToggle==0){
                    that.remindTime=that.timeListIndex;
                }else if(that.choiceTimeToggle==1){
                    that.foodRemindTime=that.timeListIndex;
                }else{
                    that.selfReminderTime=that.timeListIndex;
                }


                that.choiceTime=false
            },
            checkClick(checked,index){

                var that=this;
                that.maskTips=false;
                if(checked){
                    for(let i in that.checkedList){
                        if(that.checkedList[i]<index){
                            for(let j=index;j<that.list.length;j++){
                                that.$set(that.list[j],'checked',false)
                                that.checkedList=[];
                                for(let i in that.list){
                                    if(that.list[i].checked){
                                        that.checkedList.push(i)
                                    }
                                }
                            }
                            break
                        }else{
                            that.$set(that.list[index],'checked',false)
                            that.checkedList=[]
                            for(let i in that.list){
                                if(that.list[i].checked){
                                    that.checkedList.push(i)
                                }
                            }
                        }
                    }
                }else{
                    // that.$set(that.list[index],'checked',true)
                    that.checkedList.push(index);
                    var max=Math.max.apply(null,that.checkedList);
                    var min=Math.min.apply(null,that.checkedList);
                    for(let i=min;i<=max;i++){
                        that.$set(that.list[i],'checked',true)
                    }
                    that.checkedList=[];
                    for(let i in that.list){
                        if(that.list[i].checked){
                            that.checkedList.push(i)
                        }
                    }
                }
            },
            choiceDateShowClick(toggle){
                var that=this;
                that.checkedList=[];
                for(let i=0;i<that.list.length;i++){
                    that.$set(that.list[i],'checked',false)
                }
                if(toggle==0){
                    if(that.choiceDateMax!==''&&that.choiceDateMin!==''){

                        for(let i=that.choiceDateMin;i<=that.choiceDateMax;i++){
                            that.checkedList.push(i);
                            that.$set(that.list[i],'checked',true)
                        }
                    }
                }else{
                    if(that.selfChoiceDateMax!==''&&that.selfChoiceDateMin!==''){

                        for(let i=that.selfChoiceDateMin;i<=that.selfChoiceDateMax;i++){
                            that.checkedList.push(i);
                            that.$set(that.list[i],'checked',true)
                        }
                    }
                }
                that.choiceDateToggle=toggle
                that.choiceDate=true
            },
            choiceDateSure(){
                var that=this
                if(that.checkedList.length==0){
                    that.maskTips=true
                    return false
                }
                var max=Math.max.apply(null,that.checkedList);
                var min=Math.min.apply(null,that.checkedList);
                if(that.choiceDateToggle==0){
                    that.choiceDateMax=max;
                    that.choiceDateMin=min;
                }else{
                    that.selfChoiceDateMax=max;
                    that.selfChoiceDateMin=min;
                }

                that.choiceDate=false
            },
            iconClicked(index){
                var param=index
                var url='http://assets/merchantServiceDescription.js'
                event.toUrl({"url":url,"param":param})
            },
            bill: function (switchIndex) {

                var that = this;
                const toast = that.$refs.toast;

                if(switchIndex===0){
                    var testEl = this.$refs.takeOutF;
                    var testE2 = this.$refs.takeOutS;

                    if(that.takeOutSwitch==true){
                        if(that.mainBusiness!='外卖'){
                            var switchBl=that.takeOutSwitch;
                            that.takeOutSwitch=!that.takeOutSwitch;
                            if(!that.takeOutSwitch&&that.takeOutBookSwitch){
                                that.bill(4)
                            }
                        }
                        else{
                            toast.editContent('当前主打业务为外卖')
                        }
                    }
                    else{
                        that.takeOutSwitch=!that.takeOutSwitch;
                        if(!that.takeOutSwitch&&that.takeOutBookSwitch){
                            that.bill(4)
                        }
                    }
                }else if(switchIndex===1){
                    var testEl = this.$refs.foodBookF;
                    var testE2 = this.$refs.foodBookS;
                    if(that.foodBookSwitch==true){
                        if(that.mainBusiness!='堂食'){
                            var switchBl=that.foodBookSwitch;
                            that.foodBookSwitch=!that.foodBookSwitch;
                            // if(that.foodBookSwitch&&!that.invoice){
                            //     that.bill(5)
                            // }
                        }
                        else{
                            toast.editContent('当前主打业务为堂食')
                        }
                    }
                    else{
                        that.foodBookSwitch=!that.foodBookSwitch;
                        // if(that.foodBookSwitch&&!that.invoice){
                        //     that.bill(5)
                        // }
                    }
                    if(!that.foodBookSwitch&&that.restTimeBook){
                        that.bill(7)
                    }
                }else if(switchIndex===2){
                    var testEl = this.$refs.selftest1;
                    var testE2 = this.$refs.selftest2;
                    if(that.selfSwitch==true){
                        if(that.mainBusiness!='到店自取'){
                            var switchBl=that.selfSwitch;
                            that.selfSwitch=!that.selfSwitch;
                            if(!that.selfSwitch&&that.selfTakeOutBookSwitch){
                                that.bill(8)
                            }
                        }
                        else{
                            toast.editContent('当前主打业务为到店自取')
                        }
                    }
                    else{
                        var switchBl=that.selfSwitch;
                        that.selfSwitch=!that.selfSwitch;
                        if(!that.selfSwitch&&that.selfTakeOutBookSwitch){
                            that.bill(8)
                        }
                    }
                }else if(switchIndex===6){
                    var testEl = this.$refs.grouptext1;
                    var testE2 = this.$refs.grouptext2;
                    // if(that.grouponSwitch==true){
                    //     if(that.mainBusiness!='团购'){
                    //         var switchBl=that.grouponSwitch;
                    //         that.grouponSwitch=!that.grouponSwitch;
                    //     }
                    //     else{
                    //         toast.editContent('当前主打业务为团购')
                    //     }
                    //
                    // }
                    // else{
                    //     var switchBl=that.grouponSwitch;
                    //     that.grouponSwitch=!that.grouponSwitch;
                    // }
                }else if(switchIndex===3){
                    var testEl = this.$refs.integrationF;
                    var testE2 = this.$refs.integrationS;
                    var switchBl=that.integration;
                    that.integration=!that.integration
                }
                else if(switchIndex===4){
                    var testEl = this.$refs.takeOutBookF;
                    var testE2 = this.$refs.takeOutBookS;
                    var switchBl=that.takeOutBookSwitch;
                    that.takeOutBookSwitch=!that.takeOutBookSwitch;
                    if(!that.takeOutSwitch&&that.takeOutBookSwitch){
                        that.bill(0)
                    }
                }
                else if(switchIndex===5){
                    var testEl = this.$refs.invoiceF;
                    var testE2 = this.$refs.invoiceS;
                    // if(that.invoice==true){
                    //     if(that.mainBusiness!='堂食'){
                    //         var switchBl=that.invoice;
                    //         that.invoice=!that.invoice;
                    //         if(!that.invoice&&that.foodBookSwitch){
                    //             that.bill(1);
                    //         }
                    //     }
                    //     else{
                    //         toast.editContent('当前主打业务为堂食')
                    //     }
                    //
                    // }
                    // else{
                    var switchBl=that.invoice;
                    that.invoice=!that.invoice;
                    // if(!that.invoice&&that.foodBookSwitch){
                    //     that.bill(1);
                    // }
                    // }
                }
                else if(switchIndex===7){

                    var testEl = this.$refs.restTimeF;
                    var testE2 = this.$refs.restTimeS;
                    var switchBl = that.restTimeBook;
                    that.restTimeBook =! that.restTimeBook;
                    console.log(this.restTimeBook)
                }else if(switchIndex===8){

                    var testEl = this.$refs.selfTakeOutBookF;
                    var testE2 = this.$refs.selfTakeOutBookS;
                    var switchBl = that.selfTakeOutBookSwitch;
                    that.selfTakeOutBookSwitch =! that.selfTakeOutBookSwitch;
                    if(!that.selfSwitch&&that.selfTakeOutBookSwitch){
                        that.bill(2)
                    }
                }
                if (switchBl) {
                    var transform = 'translate(0px, 0px)';
                    animation.transition(testE2, {
                        styles: {
                            transform: transform,
                        },
                        duration: 500, //ms
                        timingFunction: 'ease',
                        delay: 0 //ms
                    });
                    animation.transition(testEl, {
                        styles: {
                            backgroundColor: '#e2e2e2',
                        },
                        duration: 500, //ms
                        timingFunction: 'ease',
                        delay: 0 //ms
                    })

                } else {
                    var transform = 'translate(52px, 0px)';
                    animation.transition(testE2, {
                        styles: {
                            transform: transform,
                        },
                        duration: 500, //ms
                        timingFunction: 'ease',
                        delay: 0 //ms
                    })
                    animation.transition(testEl, {
                        styles: {
                            backgroundColor: '#4ed465',
                        },
                        duration: 500, //ms
                        timingFunction: 'ease',
                        delay: 0 //ms
                    })
                }
            },
            billTwo:function(switchIndex){
                var that = this;
                if(switchIndex===5){
                    var testEl = this.$refs.invoiceF;
                    var testE2 = this.$refs.invoiceS;
                    var switchBl=that.invoice;
                    that.invoice=!that.invoice;
                }
                else if(switchIndex===0){
                    var testEl = this.$refs.takeOutF;
                    var testE2 = this.$refs.takeOutS;
                    var switchBl=that.takeOutSwitch;
                    that.takeOutSwitch=!that.takeOutSwitch;
                }
                else if(switchIndex===4){
                    var testEl = this.$refs.takeOutBookF;
                    var testE2 = this.$refs.takeOutBookS;
                    var switchBl=that.takeOutBookSwitch;
                    that.takeOutBookSwitch=!that.takeOutBookSwitch;
                }
                else if(switchIndex===1){
                    var testEl = this.$refs.foodBookF;
                    var testE2 = this.$refs.foodBookS;
                    var switchBl=that.foodBookSwitch;
                    that.foodBookSwitch=!that.foodBookSwitch
                }
                else if(switchIndex===2){
                    var testEl = this.$refs.selftest1;
                    var testE2 = this.$refs.selftest2;
                    var switchBl=that.selfSwitch;
                    that.selfSwitch=!that.selfSwitch;
                }
                else if(switchIndex===8){
                    var testEl = this.$refs.selfTakeOutBookF;
                    var testE2 = this.$refs.selfTakeOutBookS;
                    var switchBl=that.selfTakeOutBookSwitch;
                    that.selfTakeOutBookSwitch=!that.selfTakeOutBookSwitch
                }
                if (switchBl) {
                    var transform = 'translate(0px, 0px)';
                    animation.transition(testE2, {
                        styles: {
                            transform: transform,
                        },
                        duration: 500, //ms
                        timingFunction: 'ease',
                        delay: 0 //ms
                    });
                    animation.transition(testEl, {
                        styles: {
                            backgroundColor: '#e2e2e2',
                        },
                        duration: 500, //ms
                        timingFunction: 'ease',
                        delay: 0 //ms
                    })

                } else {
                    var transform = 'translate(52px, 0px)';
                    animation.transition(testE2, {
                        styles: {
                            transform: transform,
                        },
                        duration: 500, //ms
                        timingFunction: 'ease',
                        delay: 0 //ms
                    })
                    animation.transition(testEl, {
                        styles: {
                            backgroundColor: '#4ed465',
                        },
                        duration: 500, //ms
                        timingFunction: 'ease',
                        delay: 0 //ms
                    })
                }
            },//用于mounted一开始的兼容
            //键盘弹起后点击其他地方收起键盘
            allFocus(toggle){
                var that=this;
                that.inputFocus=false;
                if(that.blurPrevent){
                    that.aa=true;
                }
                else{
                    that.aa=false;
                }
                // that.aa=true;
                setTimeout(function () {
                    that.blurPrevent = true;
                },80)
                setTimeout(function () {
                    that.aa=false;
                },320)
                if(toggle==0){
                    that.$refs.inputOne.setTextFormatter({
                        formatRule: "/(\\.\\d{1})(\\S+)/",
                        formatReplace: "$1",
                        recoverRule: "/\\s+/g",
                        recoverReplace: ""
                    })
                }else if(toggle==1){
                    that.$refs.inputTwo.setTextFormatter({
                        formatRule: "/(\\.\\d{2})(\\S+)/",
                        formatReplace: "$1",
                        recoverRule: "/\\./g",
                        recoverReplace: ""
                    })
                }else if(toggle==2){
                    that.$refs.inputThree.setTextFormatter({
                        formatRule: "/(\\.\\d{1})(\\S+)/",
                        formatReplace: "$1",
                        recoverRule: "/\\s+/g",
                        recoverReplace: ""
                    })
                }else if(toggle==3){
                    that.$refs.inputFour.setTextFormatter({
                        formatRule: "/(\\.\\d{2})(\\S+)/",
                        formatReplace: "$1",
                        recoverRule: "/\\./g",
                        recoverReplace: ""
                    })
                }else if(toggle==4){
                    that.$refs.inputFive.setTextFormatter({
                        formatRule: "/(\\.\\d{1})(\\S+)/",
                        formatReplace: "$1",
                        recoverRule: "/\\s+/g",
                        recoverReplace: ""
                    })
                }else if(toggle==5){
                    that.$refs.inputSix.setTextFormatter({
                        formatRule: "/(\\.\\d{1})(\\S+)/",
                        formatReplace: "$1",
                        recoverRule: "/\\s+/g",
                        recoverReplace: ""
                    })
                }

            },
            allBlur(){
                var that=this;
                setTimeout(function () {
                    if(that.aa){
                        setTimeout(function () {
                            that.aa=false;
                        },40)
                    }
                    else{
                        that.inputFocus=true;
                        that.blurPrevent = false;
                    }
                }, 200)
            },
            blur(){
                this.$refs.inputOne.blur();
                this.$refs.inputTwo.blur();
                this.$refs.inputThree.blur();
                this.$refs.inputFour.blur();
                this.$refs.inputFive.blur();
                this.$refs.inputSix.blur();
                this.$refs.firInput.blur();
                // for(var i in this.fullSubtraction){
                //     this.$refs.secInput[i].blur();
                //     this.$refs.thrInput[i].blur();
                // }
            },
            backClick(){
                navigator.pop({animated: 'true'});
            },
            //键盘弹起后点击其他地方收起键盘
            save(){
                var that=this;
                const toast = that.$refs.toast;
                var featured = this.index
                var takeOutSwitch = that.takeOutSwitch;//是否已开启外卖
                var takeOutBookSwitch = that.takeOutBookSwitch;//是否已开启外卖预订
                var foodBookSwitch = that.foodBookSwitch;//是否已开启堂食预订
                // var distributionSwitch = that.distributionSwitch;//是否已开启分销
                // var integration = that.integration;//是否已开启积分
                var invoice = that.invoice;//是否已开启发票
                // var tg = that.grouponSwitch //团购
                var ddzq = that.selfSwitch //到店自取
                var ddzqyd = that.selfTakeOutBookSwitch //到店自取预订
                var shopsData = {};
                var shops_selectData = {};
                var choiceDate=[];//选择的日期，例：[2,3,4,5]
                var selfChoiceDate=[]
                var remindTime=that.timeList[that.remindTime];//提醒时间
                var foodChoiceDate=[];//堂食预订选择的日期，例：[2,3,4,5]
                var foodRemindTime=that.timeList[that.foodRemindTime];//堂食预订提醒时间
                // var fullSubtraction=that.fullSubtraction//拼单满减
                shopsData['storeConfig'] = 1;
                //主打业务
                if(that.index==-1){
                    toast.editContent('主打业务未选择');
                    return false
                }
                else{
                    if (featured == 0){shopsData['featured'] = 0;} else if(featured == 1){shopsData['featured'] = 3;}else if(featured == 2){shopsData['featured'] = 5;}else if(featured == 3){shopsData['featured'] = 4;}
                }

                //拼单
                // if (that.collageNumb) {
                //     if (that.collageNumb < 2) {
                //         toast.editContent('拼单不能少于两人');
                //         return false
                //     }
                //     // if (that.collageCount < 0 || that.collageCount > 10) {
                //     //     modal.toast({message:"折扣在0~10之间",duration:1});
                //     //     return false
                //     // }
                //     shopsData['pingdanNum']=that.collageNumb;
                //     // shopsData['pingdanZk']=that.collageCount;
                // } else {
                //     toast.editContent('请完善拼单选项');
                //     return false
                // }
                // for(let i in fullSubtraction){
                //     if(!fullSubtraction[i].full||!fullSubtraction[i].subtraction){
                //         toast.editContent('满减金额不能为空且需要大于0');
                //         return false
                //     }
                //
                //     if(Number(fullSubtraction[i].full)<Number(fullSubtraction[i].subtraction)){
                //         toast.editContent('满金额不能小于减金额');
                //         return false
                //     }
                //
                // }
                // shopsData.fullSubtraction=fullSubtraction;//上传的拼单满减优惠；格式[{full:30,subtraction:5}],无满减时为[]

                //暂时停止拼单业务，数据写死
                // shopsData.fullSubtraction=[]
                // shopsData['pingdanNum']=2;

                //0为关闭，1未开启
                if(takeOutSwitch){
                    takeOutSwitch = 1;
                    shopsData['isdelivery'] = 1;
                    if (that.distributionFee && that.distance && that.deliveryFreeMoney) {
                        shopsData['deliveryStartMoney']=that.distributionFee;
                        shopsData['range']=that.distance;
                        shopsData['deliveryFreeMoney']=that.deliveryFreeMoney;
                        shops_selectData['qsj'] = that.deliveryFreeMoney;
                        shops_selectData['psf'] = that.distributionFee;
                    } else {
                        toast.editContent('你已开启外卖，外卖选项不能为空');
                        return false
                    }
                }else{
                    takeOutSwitch = 0;
                    shopsData['isdelivery'] = 0;
                    shopsData['deliveryStartMoney'] = null;
                    shopsData['range'] = null;
                    shopsData['deliveryFreeMoney'] = null;
                    // shops_selectData['qsj'] = null;
                    // shops_selectData['psf'] = null;
                }
                //外卖预订
                if(takeOutBookSwitch){
                    takeOutBookSwitch = 1;
                    if (that.choiceDateMin!=='' && that.remindTime !== -1) {
                        for(let i=that.choiceDateMin;i<=that.choiceDateMax;i++){
                            choiceDate.push(i+1)//范围为1~8
                        }
                        shopsData['reserve'] = 1;
                        shopsData['scheduledDate'] = choiceDate;
                        shopsData['reminderTime'] = remindTime;
                    } else {
                        toast.editContent('你已开启外卖预订，外卖预订选项不能为空');
                        return false
                    }
                }else{
                    takeOutBookSwitch = 0;
                    shopsData['reserve'] = 0;
                    shopsData['scheduledDate'] = null;
                    shopsData['reminderTime'] = null;
                }

                //堂食预订
                if(foodBookSwitch){
                    foodBookSwitch = 1;
                    if (that.bookMoney&&that.orderStartDate&&that.orderEndDate && that.foodRemindTime !== -1) {//that.orderStartTime开始时间；that.orderEndTime结束时间
                        // for(let i=that.foodChoiceDateMin;i<=that.foodChoiceDateMax;i++){
                        //     foodChoiceDate.push(i+1)//范围为1~8
                        // }
                        shopsData.orderStartDate=that.orderStartDate//预订开始日期
                        shopsData.orderEndDate=that.orderEndDate//预订结束日期
                        // shopsData.orderStartTime=that.orderStartTime
                        // shopsData.orderEndTime=that.orderEndTime
                        if(that.restTimeBook){
                            shops_selectData.restTimeBook = 1
                        }else {
                            shops_selectData.restTimeBook = 0
                        }

                        // shopsData['scheduledDates'] = foodChoiceDate;
                        shopsData['reminderTimes'] = that.timeList[that.foodRemindTime];
                        shopsData['bookingMoney']=that.bookMoney;
                    } else {
                        toast.editContent('你已开启堂食预订，堂食预订选项不能为空');
                        return false
                    }
                }else{
                    foodBookSwitch = 0;
                    shops_selectData.restTimeBook = 0
                    shopsData.orderStartDate=that.orderStartDate?that.orderStartDate:null
                    shopsData.orderEndDate=that.orderEndDate?that.orderEndDate:null
                    // shopsData.orderStartTime=that.orderStartTime?that.orderStartTime:null
                    // shopsData.orderEndTime=that.orderEndTime?that.orderEndTime:null
                    // if (that.foodChoiceDateMin!==''){
                    //     for(let i=that.foodChoiceDateMin;i<=that.foodChoiceDateMax;i++){
                    //         foodChoiceDate.push(i+1)//范围为1~8
                    //     }
                    //     shopsData['scheduledDates'] = foodChoiceDate;
                    // } else {
                    //     shopsData['scheduledDates'] = null;
                    // }
                    shopsData['reminderTimes'] = foodRemindTime?foodRemindTime:null;
                    shopsData['bookingMoney'] = that.bookMoney?that.bookMoney:null;
                }
                // if(distributionSwitch){
                //     distributionSwitch = 1;
                //     if (that.primaryDistribution && that.SecDistribution) {
                //         shopsData['recommand_A']=that.primaryDistribution;
                //         shopsData['recommand_B']=that.SecDistribution;
                //     } else {
                //         modal.toast({message:"你已开启分销，分销选项不能为空",duration:1});
                //         return false
                //     }
                // }else{
                //     distributionSwitch = 0;
                //     shopsData['recommand_A']=null;
                //     shopsData['recommand_B']=null;
                // }
                // if(integration){
                //     integration = 1;
                //     shopsData['isInvoice'] = 1;
                //     if (that.integrationNumb && that.jzNumb) {
                //         if (that.jzNumb < 0 || that.jzNumb > 1) {
                //             toast.editContent('积分价值输入有误，只能输入0~1之间的数值');
                //             return false
                //         }
                //         shopsData['invoiceRemarks']=that.integrationNumb;
                //         shopsData['invoiceRemarkstrD'] = that.jzNumb;
                //     } else {
                //         toast.editContent('你已开启积分，积分选项不能为空');
                //         return false
                //     }
                // }else{
                //     integration = 0;
                //     shopsData['isInvoice'] = 0;
                //     shopsData['invoiceRemarks']=null;
                //     shopsData['invoiceRemarkstrD'] = null;
                // }
                if (invoice) {
                    shopsData['bill'] = 1;
                    shops_selectData['fp'] = 1;
                } else {
                    shopsData['bill'] = 0;
                    shops_selectData['fp'] = 0;
                }
                // if (tg) {
                //     shops_selectData['tg'] = 1;
                // } else {
                //     shops_selectData['tg'] = 0;
                // }
                //到店自取
                if (ddzq) {
                    if (that.choiceMealTime&&that.selfDistance&&that.selfDeliveryFreeMoney) {
                        shops_selectData['ddzq'] = 1;
                        shopsData['choiceMealTime']=that.choiceMealTime;//到店自取备餐时间
                        shopsData['selfDeliveryFreeMoney']=that.selfDeliveryFreeMoney;
                        shopsData['selfDistance']=that.selfDistance;
                    } else {
                        toast.editContent('你已开启到店自取，到店自取选项不能为空');
                        return false
                    }

                } else {
                    shops_selectData['ddzq'] = 0;
                    shopsData['choiceMealTime']=null;
                    shopsData['selfDeliveryFreeMoney']=null;
                    shopsData['selfDistance']=null;
                }
                //到店自取预订
                if(ddzqyd){
                    ddzqyd = 1;
                    if (that.selfChoiceDateMin!=='' && that.selfReminderTime !== -1) {
                        for(let i=that.selfChoiceDateMin;i<=that.selfChoiceDateMax;i++){
                            selfChoiceDate.push(i+1)//范围为1~8
                        }
                        shopsData['selfReserve'] = 1;
                        shopsData['selfScheduledDate'] = selfChoiceDate;
                        shopsData['selfReminderTime'] = that.timeList[that.selfReminderTime];
                    } else {
                        toast.editContent('你已开启到店自取预订，到店自取预订选项不能为空');
                        return false
                    }
                }else{
                    ddzqyd = 0;
                    shopsData['selfReserve'] = 0;
                    shopsData['selfScheduledDate'] = null;
                    shopsData['selfReminderTime'] = null;
                }

                // shops_selectData['ddzqyd'] = ddzqyd;
                shops_selectData['wm'] = takeOutSwitch;
                shops_selectData['tsyd'] = foodBookSwitch;
                // shops_selectData['fx'] = distributionSwitch;
                // shops_selectData['jf'] = integration;
                console.log(shopsData)
                shopsData = JSON.stringify(shopsData);
                shops_selectData = JSON.stringify(shops_selectData);
                var param = this.GLOBAL.sign(this.token,this.imei);
                param += '&shopsData=' + shopsData + '&shops_selectData=' + shops_selectData;
                console.log(param)
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: 'https://www.aftdc.com/businessapp/Store/setStoreConfiguration',
                }, function (res) {
                    if (res.data.res ===1) {
                        toast.editContent('保存成功');
                        event.save('storeConfig', 1);
                        var param = '';
                        var url='http://assets/index.js';
                        event.toUrl({ "url": url, "param": param });
                        navigator.pop();
                    } else {
                        toast.editContent('网络君开小差了');
                    }
                });
            },
            // addFullSubtraction(){
            //     var that=this
            //     var fullSubtraction={full:'',subtraction:''}
            //     that.fullSubtraction.push(fullSubtraction)
            // },
            // delFullSubtraction(index){
            //     var that=this
            //     that.fullSubtraction.splice(index,1)
            // },
            choiceDateHide(){
                var that=this
                that.choiceDate=false
            },
            wxcMaskSetHidden(){
                var that=this
                that.choiceDate=false
                that.choiceTime=false
            }
        }
    }
</script>

<style scoped>
    .wrapper {
        flex-direction: column;
        background-color: #f8f8f8;
    }
    .scroller {
        flex-direction: column;
        flex: 1;


    }
    .scrollerCell{
        flex-direction: column;
        margin-top: 20px;
        background-color: #fff;
    }
    .betweenDiv {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding-top: 20px;
        padding-left: 20px;
        padding-right: 20px;
        padding-bottom: 20px;
    }
    .inputDiv {
        flex-direction: row;
        align-items: center;
        flex: 1;
        justify-content: flex-end;
    }
    .input {
        text-align: right;
        flex: 1;
        margin-right: 10px;
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
        background-color: #e2e2e2;
    }

    .isOpen {
        width: 50px;
        height: 50px;
        border-radius: 26px;
        border-width: 1px;
        border-style: solid;
        border-color: #e2e2e2;
        background-color: #ffffff;

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
    .arrowRightImg{
        width: 20px;
        height: 20px;
    }
    .setButton{
        flex-direction: row;
        justify-content: space-around;
        background-color: #fff;
        border-top-width: 2px;
        border-top-style: solid;
        border-top-color: #f1f1f1;
        padding-top: 20px;
        padding-bottom: 20px;
        padding-left: 30px;
        padding-right: 30px;
        /*margin-top: 20px;*/

    }
    .cell {
        flex-direction: row;
        justify-content: space-between;

        padding-top: 15px;
        padding-bottom: 15px;
        padding-left: 20px;
        padding-right: 20px;
        align-items: center;
    }
    .cell_left {
        flex-direction: column;
        flex: 0.6;
    }
    .cellTitle {
        flex-direction: row;
        align-items: center;
    }
    .cellTitleIcon{
        width: 37px;
        height: 37px;
        margin-left: 20px;
    }
    .explainSize {
        color: #999;
        margin-top: 5px;
    }
    .cancelButton:active{
        background-color: #f1f1f1;
    }
    .saveButton:active{
        background-color: #57aba5;
    }
    .saveButton:enabled{
        background-color: #53beb7;
    }
    /*.blank{*/
    /*position: absolute;*/
    /*width: 750px;*/
    /*bottom: 0;*/
    /*top: 0;*/
    /*}*/
    .arrowRightIcon{
        width: 20px;
        height: 20px;
        margin-left: 10px;
    }
    .content{
        flex-direction: column;
        flex: 1;
    }
    .checkList{
        padding-top: 30px;
        padding-left: 30px;
        padding-right: 30px;
        padding-bottom: 30px;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: #f1f1f1;
    }

    .checkIcon{
        width: 40px;
        height: 40px;
    }
    .maskButton{
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        margin-top: 25px;
        margin-bottom: 15px;
    }
    .sureButton:active{
        background-color: #57aba5;
    }
    .sureButton:enabled{
        background-color: #53beb7;
    }
    .flewSize{
        flex: 1;
        text-align: center;
    }
    .inputText{
        padding-top: 20px;
        padding-bottom: 20px;
        padding-left:20px;
        padding-right:20px;
        color: #333;
        font-size:26px;
        border-width:1px;
        border-color:#53beb7;
        border-radius:8px;
        text-align: center;
    }
    .addIcon{
        width: 40px;
        height: 40px;
    }
    .delIcon{
        width: 35px;
        height: 35px;
    }

</style>