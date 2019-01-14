<template>
    <div class="wrapper">
        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="backBtn"
                    @wxcMinibarRightButtonClicked="minibarRightButtonClick">
                <image class="flex1" :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>n
                <div class="flex8" slot="middle">
                    <div class="titles">
                        <div class="tab" v-for="(tab, i) in tabs" :key="i" :class="[i===activeTab?'tabActive':'']" @click="activeTab=i">
                            <text class="tabText" :class="[i===activeTab?'tabTextActive':'']">{{tab.title}}</text>
                        </div>
                    </div>
                </div>
                <text class="flex1" :style="GLOBAL.headerRight"  slot="right"></text>
            </wxc-minibar>
        </div>
        <slider class="size" infinite="false"  :index="activeTab" @change="sliderChange">
            <!--用户评价-->
            <div class="sliderRight">
                <div class="panelpanel">
                    <div class="options">
                        <div style="align-items: center">
                            <div class="replys" style="flex-direction: row">
                                <div @click="noGreply">
                                    <text :class="[isReply===0?'replyActive':'reply']">未回复差评({{weihuifuchapingCount<=99?weihuifuchapingCount:'99+'}})</text>
                                    <!--<text class="reply">未回复差评(99+)</text>-->
                                    <!--如果超过99变成99+-->
                                </div>
                                <div @click="noReply">
                                    <text :class="[isReply===1?'replyActive':'reply']">未回复({{weihuifuCount<=99?weihuifuCount:'99+'}})</text>
                                    <!--<text class="reply">未回复(99+)</text>-->
                                </div>
                                <div @click="allReply">
                                    <text :class="[isReply==2?'replyActive':'reply']">全部({{quanbuCount<=99?quanbuCount:'99+'}})</text>
                                    <!--<text class="reply">全部(99+)</text>-->
                                </div>
                            </div>
                        </div>
                        <div class="choiceType row aiCenter" v-if="isReply==2">
                            <div @click="goodRating">
                                <text :class="[isRating==0?'ratingActive':'rating']">好评({{haopingCount<=99?haopingCount:'99+'}})</text>
                            </div>
                            <div @click="assessment">
                                <text :class="[isRating==1?'ratingActive':'rating']">中评({{zhongpingCount<=99?zhongpingCount:'99+'}})</text>
                            </div>
                            <div @click="bad">
                                <text :class="[isRating==2?'ratingActive':'rating']">差评({{chapingCount<=99?chapingCount:'99+'}})</text>
                            </div>
                        </div>

                        <div class="choiceType row aiCenter" v-if="isReply==2">
                            <div>
                                <image class="check" v-if="isCheck==0"
                                       src="https://image.aftdc.com/appBimg/ic_check_box_normal.png"
                                       @click="Check(1)"></image>
                                <image class="check" v-else
                                       src="https://image.aftdc.com/appBimg/ic_check_box_checked.png"
                                       @click="Check(0)"></image>
                            </div>
                            <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">只看有内容的评论</text>
                        </div>
                    </div>

                    <slider class="size" infinite="false" :index="isReply" @change="childChange">
                        <div style="position: absolute;top: 0;left: 0;right: 0;bottom: 0">
                            <list class="comments" show-scrollbar="false">
                                <cell style="background-color: #fff" v-if="noGreplys.length>0">
                                    <!--未回复差评-->
                                    <div class="message" ref="noGreplysScoller"   v-for="(starNmu,i) in noGreplys">
                                        <div style="flex-direction: row;align-items: center;align-content:flex-end;justify-content: space-between">
                                            <text class="userName" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">{{starNmu.userName}}</text>
                                            <text class="createTime" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}" >{{starNmu.createTime}}</text>
                                        </div>
                                        <div class="results">
                                            <div style="flex-direction: row;align-items: center">
                                                <div style="flex-direction: row;margin-right: 10px;align-items:center ">
                                                    <text class="type">商家</text>
                                                    <div class="star">
                                                        <image class="starSize" src="https://image.aftdc.com/appBimg/icon_wuxing_nocolor.png"></image>
                                                        <div class="shopAvgImg" :style="{width:starNmu.avg*30+'px'}">
                                                            <image class="starSize"  src="https://image.aftdc.com/appBimg/icon_wuxing_color.png"></image>
                                                        </div>
                                                    </div>
                                                </div>
                                                <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}" v-if="starNmu.avg<=2">差评</text>
                                                <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}" v-if="starNmu.avg>2 && starNmu.avg<4">中评</text>
                                                <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}" v-if="starNmu.avg>=4">好评</text>
                                            </div>
                                            <div style="flex-direction: row;align-items: center">
                                                <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}" style="margin-right: 5px;">口味{{starNmu.tasteScore}}星</text>
                                                <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}" style="margin-right: 5px;">包装{{starNmu.warpScore}}星</text>
                                                <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">配送{{starNmu.timeScore}}星</text>
                                            </div>
                                        </div>
                                        <text class="user" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{starNmu.content}}</text>
                                        <!--<div style="flex-direction: row;align-items: center;padding-top:8px;padding-bottom:8px"-->
                                        <!--v-for="(item,index) in starNmu.goodslist" >-->
                                        <!--<image class="good" src="https://image.aftdc.com/appBimg/ic_good_food.png"></image>-->
                                        <!--<div style="height:30px;" >-->
                                        <!--<text :style="{fontSize:GLOBAL.defaultFS,color:'#999',height:'40px'}" style="width: 700px;">{{item.goodsName}}</text>-->
                                        <!--</div>-->
                                        <!--<div style="height:30px;" >-->
                                        <!--<text style="color: #999">，</text>-->
                                        <!--</div>-->
                                        <!--</div>-->


                                        <!--<div style="flex-direction: row;align-items: flex-start;padding-top:8px;padding-bottom:8px" v-if="starNmu.goodsListString">-->
                                        <!--<image class="good" src="https://image.aftdc.com/appBimg/ic_good_food.png"></image>-->
                                        <!--<text :style="{fontSize:GLOBAL.defaultFS,color:'#999',height:'40px'}" style="width: 700px;">{{starNmu.goodsListString}}</text>-->

                                        <!--</div>-->
                                        <div style="flex-direction: row;flex-wrap: wrap">
                                            <div v-for="(items,indexs) in starNmu.appraisesAnnex">
                                                <image class="goods" :src="'https://image.aftdc.com/'+items.img"></image>
                                                <!--评论图片-->
                                            </div>
                                        </div>

                                        <div class="response" v-for="(item,index) in starNmu.shopReply">
                                            <div style="background-color: rgba(160,160,160,0.1);border-radius: 10px">
                                                <div style="flex-direction: row;justify-content: space-between">
                                                    <text :style="{marginTop: '18px',marginLeft: '15px',color: '#999',fontSize: GLOBAL.defaultFS,lineHeight:'34px'}">商家回复:</text>
                                                    <text :style="{marginTop: '18px',marginRight: '15px',color: '#999',fontSize: GLOBAL.defaultFS,lineHeight:'34px'}">{{item.days}}天后</text>
                                                </div>
                                                <text :style="{marginTop: '10px',marginLeft: '15px',marginBottom: '20px',maxWidth: '600px',color: '#585858',fontSize: GLOBAL.bigFS,lineHeight:'34px',}">{{item.content}}</text>
                                            </div>
                                        </div>
                                        <div class="response">
                                            <div style="background-color: rgba(160,160,160,0.1);border-radius: 10px">
                                                <div style="flex-direction: row;justify-content: space-between">
                                                    <text :style="{marginTop: '18px',marginLeft: '15px',color: '#999',fontSize: GLOBAL.defaultFS,lineHeight:'34px'}">订单详情:</text>
                                                </div>
                                                <div class="shopLabel row aiCenter">
                                                    <text class="labelText" v-for="(labelItem,labelIndex) in starNmu.goodslist" :style="{fontSize:'24px',color:GLOBAL.dColor}" :key="labelIndex">{{labelItem.goodsName+'*'+labelItem.goodsNums}}{{labelIndex==starNmu.goodslist.length-1?'':'、'}}</text>
                                                </div>
                                            </div>
                                        </div>
                                        <div style="flex-direction: row;justify-content: space-between;margin-top: 10px;align-items: center">
                                            <div @click="reportClick(i)">
                                                <image class="report" src="https://image.aftdc.com/appBimg/ic_report_pl.png"></image>
                                            </div>
                                            <div v-if="starNmu.shopReply==''">
                                                <text class="huifu" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}" @click="relyClick(i)">回复</text>
                                            </div>
                                        </div>

                                    </div>

                                </cell>
                                <cell class="listCell"   v-else>
                                    <noOrder  img="https://image.aftdc.com/appBimg/icon_no_order.png" textOne="暂无未回复差评" textTwo=""></noOrder>
                                </cell>
                                <loading class="loading" @loading="onrefresh()" :display="loadinging ? 'show' : 'hide'">
                                    <text class="indicator-text">Loading ...</text>
                                    <loading-indicator class="indicator"></loading-indicator>
                                </loading>
                            </list>
                        </div>
                        <div style="position: absolute;top: 0;left: 0;right: 0;bottom: 0">

                            <list class="comments" show-scrollbar="false">

                                <cell style="background-color: #fff" v-if="noReplys.length>0">

                                    <!--未回复-->
                                    <div class="message" ref="noReplysScoller"  v-for="(starNmu,i) in noReplys">
                                        <div style="flex-direction: row;align-items: center;justify-content: space-between">
                                            <text class="userName" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">{{starNmu.userName}}</text>
                                            <text class="createTime"  :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{starNmu.createTime}}</text>
                                        </div>
                                        <div class="results">
                                            <div style="flex-direction: row;align-items: center">
                                                <div style="flex-direction: row;margin-right: 10px;align-items: center">
                                                    <text class="type">商家</text>
                                                    <div class="star">
                                                        <image class="starSize" src="https://image.aftdc.com/appBimg/icon_wuxing_nocolor.png"></image>
                                                        <div class="shopAvgImg" :style="{width:starNmu.avg*30+'px'}">
                                                            <image class="starSize"  src="https://image.aftdc.com/appBimg/icon_wuxing_color.png"></image>
                                                        </div>
                                                    </div>
                                                </div>
                                                <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}" v-if="starNmu.avg<=2">全部</text>
                                                <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}" v-if="starNmu.avg<=2">差评</text>
                                                <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}" v-if="starNmu.avg>2 && starNmu.avg<4">中评</text>
                                                <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}" v-if="starNmu.avg>=4">好评</text>
                                            </div>
                                            <div style="flex-direction: row;align-items: center">
                                                <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}" style="margin-right: 5px;">口味{{starNmu.tasteScore}}星</text>
                                                <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}" style="margin-right: 5px;">包装{{starNmu.warpScore}}星</text>
                                                <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">配送{{starNmu.timeScore}}星</text>
                                            </div>
                                        </div>
                                        <text class="user" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{starNmu.content}}</text>
                                        <!--<div style="flex-direction: row;align-items: center;padding-top:8px;padding-bottom:8px"-->
                                        <!--v-for="(item,index) in starNmu.goodslist">-->
                                        <!--<image class="good"-->
                                        <!--src="https://image.aftdc.com/appBimg/ic_good_food.png"></image>-->
                                        <!--<div style="height:30px;" >-->
                                        <!--<text :style="{fontSize:GLOBAL.defaultFS,color:'#999',height:'40px'}" style="width: 700px;">{{item.goodsName}}</text>-->
                                        <!--</div>-->
                                        <!--<div style="height:30px;" >-->
                                        <!--<text style="color: #999">，</text>-->
                                        <!--</div>-->
                                        <!--</div>-->


                                        <!--<div style="flex-direction: row;align-items: flex-start;padding-top:8px;padding-bottom:8px" v-if="starNmu.goodsListString">-->
                                        <!--<image class="good" src="https://image.aftdc.com/appBimg/ic_good_food.png"></image>-->
                                        <!--<text :style="{fontSize:GLOBAL.defaultFS,color:'#999'}" style="width: 700px;">{{starNmu.goodsListString}}</text>-->

                                        <!--</div>-->
                                        <div style="flex-direction: row;flex-wrap: wrap">
                                            <div v-for="(items,indexs) in starNmu.appraisesAnnex">
                                                <image class="goods" :src="'https://image.aftdc.com/'+items.img"></image>
                                                <!--评论图片-->
                                            </div>
                                        </div>

                                        <div class="response" v-for="(item,index) in starNmu.shopReply">
                                            <div style="background-color: rgba(160,160,160,0.1);border-radius: 10px">
                                                <div style="flex-direction: row;justify-content: space-between">
                                                    <text :style="{marginTop: '18px',marginLeft: '15px',color: '#999',fontSize: GLOBAL.defaultFS,lineHeight:'34px'}">商家回复:</text>
                                                    <text :style="{marginTop: '18px',marginRight: '15px',color: '#999',fontSize: GLOBAL.defaultFS,lineHeight:'34px'}">{{item.days}}天后</text>
                                                </div>
                                                <text :style="{marginTop: '10px',marginLeft: '15px',marginBottom: '20px',maxWidth: '600px',color: '#585858',fontSize: GLOBAL.bigFS,lineHeight:'34px',}">{{item.content}}</text>
                                            </div>
                                        </div>
                                        <div class="response">
                                            <div style="background-color: rgba(160,160,160,0.1);border-radius: 10px">
                                                <div style="flex-direction: row;justify-content: space-between">
                                                    <text :style="{marginTop: '18px',marginLeft: '15px',color: '#999',fontSize: GLOBAL.defaultFS,lineHeight:'34px'}">订单详情:</text>
                                                </div>
                                                <div class="shopLabel row aiCenter">
                                                    <text class="labelText" v-for="(labelItem,labelIndex) in starNmu.goodslist" :style="{fontSize:'24px',color:GLOBAL.dColor}" :key="labelIndex">{{labelItem.goodsName+'*'+labelItem.goodsNums}}{{labelIndex==starNmu.goodslist.length-1?'':'、'}}</text>
                                                </div>
                                            </div>
                                        </div>
                                        <div style="flex-direction: row;justify-content: space-between;margin-top: 10px;align-items: center">
                                            <div  @click="reportClick(i)">
                                                <image class="report" src="https://image.aftdc.com/appBimg/ic_report_pl.png"></image>
                                            </div>
                                            <div v-if="starNmu.shopReply==''">
                                                <text class="huifu" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}" @click="relyClick(i)">回复</text>
                                            </div>
                                        </div>
                                    </div>

                                </cell>
                                <cell class="listCell"  v-else>
                                    <noOrder  img="https://image.aftdc.com/appBimg/icon_no_order.png" textOne="暂无未回复评价" textTwo=""></noOrder>
                                </cell>
                                <loading class="loading" @loading="onrefresh()" :display="loadinging ? 'show' : 'hide'">
                                    <text class="indicator-text">Loading ...</text>
                                    <loading-indicator class="indicator"></loading-indicator>
                                </loading>
                            </list>
                        </div>
                        <div style="position: absolute;top: 0;left: 0;right: 0;bottom: 0">
                            <list class="comments" show-scrollbar="false">

                                <cell>



                                    <!--全部-->
                                    <div v-if="pinglun.length>0">
                                        <div class="message" ref="allScoller" v-for="(starNmu,i) in pinglun" >
                                            <div style="flex-direction: row;align-items: center;justify-content: space-between">
                                                <text class="userName" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">{{starNmu.userName}}</text>
                                                <text class="createTime"  :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{starNmu.createTime}}</text>
                                            </div>
                                            <div class="results">
                                                <div style="flex-direction: row;align-items: center">
                                                    <div style="flex-direction: row;margin-right: 10px;align-items: center">
                                                        <text class="type">商家</text>
                                                        <div class="star">
                                                            <image class="starSize" src="https://image.aftdc.com/appBimg/icon_wuxing_nocolor.png"></image>
                                                            <div class="shopAvgImg" :style="{width:starNmu.avg*30+'px'}">
                                                                <image class="starSize"  src="https://image.aftdc.com/appBimg/icon_wuxing_color.png"></image>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}" v-if="starNmu.avg<=2">差评</text>
                                                    <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}" v-if="starNmu.avg>2 && starNmu.avg<4">中评</text>
                                                    <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}" v-if="starNmu.avg>=4">好评</text>
                                                </div>
                                                <div style="flex-direction: row;align-items: center">
                                                    <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}" style="margin-right: 5px;">口味{{starNmu.tasteScore}}星</text>
                                                    <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}" style="margin-right: 5px;">包装{{starNmu.warpScore}}星</text>
                                                    <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">配送{{starNmu.timeScore}}星</text>
                                                </div>
                                            </div>
                                            <text class="user" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{starNmu.content}}</text>
                                            <!--<div style="flex-direction: row;align-items: center;padding-top:8px;padding-bottom:8px"-->
                                            <!--v-for="(item,index) in starNmu.goodslist">-->
                                            <!--<image class="good"-->
                                            <!--src="https://image.aftdc.com/appBimg/ic_good_food.png"></image>-->
                                            <!--<div style="height:30px;" >-->
                                            <!--<text :style="{fontSize:GLOBAL.defaultFS,color:'#999',height:'40px'}" style="width: 700px;">{{item.goodsName}}</text>-->
                                            <!--</div>-->
                                            <!--<div style="height:30px;" >-->
                                            <!--<text style="color: #999">，</text>-->
                                            <!--</div>-->
                                            <!--</div>-->


                                            <!--<div style="flex-direction: row;align-items: flex-start;padding-top:8px;padding-bottom:8px" v-if="starNmu.goodsListString">-->
                                            <!--<image class="good" src="https://image.aftdc.com/appBimg/ic_good_food.png"></image>-->
                                            <!--<text :style="{fontSize:GLOBAL.defaultFS,color:'#999',height:'40px'}" style="width: 700px;">{{starNmu.goodsListString}}</text>-->

                                            <!--</div>-->
                                            <div style="flex-direction: row;flex-wrap: wrap">
                                                <div v-for="(items,indexs) in starNmu.appraisesAnnex">
                                                    <image class="goods" :src="'https://image.aftdc.com/'+items.img"></image>
                                                    <!--评论图片-->
                                                </div>
                                            </div>

                                            <div class="response" v-for="(item,index) in starNmu.shopReply">
                                                <div style="background-color: rgba(241,241,241,0.5);border-radius: 10px">
                                                    <div style="flex-direction: row;justify-content: space-between">
                                                        <text :style="{marginTop: '18px',marginLeft: '15px',color: '#999',fontSize: GLOBAL.defaultFS,lineHeight:'34px'}">商家回复:</text>
                                                        <text :style="{marginTop: '18px',marginRight: '15px',color:'#999',fontSize: GLOBAL.defaultFS,lineHeight:'34px'}">{{item.days}}天后</text>
                                                    </div>
                                                    <text :style="{marginTop: '10px',marginLeft: '15px',marginBottom: '20px',maxWidth: '600px',color: '#585858',fontSize: GLOBAL.bigFS,lineHeight:'34px',}">{{item.content}}</text>
                                                </div>
                                            </div>
                                            <div class="response">
                                                <div style="background-color: rgba(160,160,160,0.1);border-radius: 10px">
                                                    <div style="flex-direction: row;justify-content: space-between">
                                                        <text :style="{marginTop: '18px',marginLeft: '15px',color: '#999',fontSize: GLOBAL.defaultFS,lineHeight:'34px'}">订单详情:</text>
                                                    </div>
                                                    <div class="shopLabel row aiCenter">
                                                        <text class="labelText" v-for="(labelItem,labelIndex) in starNmu.goodslist" :style="{fontSize:'24px',color:GLOBAL.dColor}" :key="labelIndex">{{labelItem.goodsName+'*'+labelItem.goodsNums}}{{labelIndex==starNmu.goodslist.length-1?'':'、'}}</text>
                                                    </div>
                                                </div>
                                            </div>
                                            <div style="flex-direction: row;justify-content: space-between;margin-top: 14px;align-items: center;">
                                                <div @click="reportClick(i)">
                                                    <image class="report" src="https://image.aftdc.com/appBimg/ic_report_pl.png"></image>
                                                </div>
                                                <div v-if="starNmu.shopReply==''">
                                                    <text class="huifu" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}" @click="relyClick(i)">回复</text>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="body-wxc" v-else>
                                        <image class="bodyImage" src="https://image.aftdc.com/appBimg/icon_no_order.png"></image>
                                        <text class="noOrder" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">暂无评论</text>
                                        <!--<text class="lookAround" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.tColor}">随便逛逛</text>-->
                                    </div>
                                    <!--提交回复内容-->
                                    <div v-if="relyOpen==true" class="masksub" @click="relyOpenClose">
                                        <div class="submit">
                                            <div class="row aiCenter">
                                                <div class="commentInputBg" @click.stop="preventBubbles">
                                                    <div class="grayBg"></div>
                                                    <input class="commentInput" type="text" placeholder="" ref="inputMessage"  v-model="relyText" >
                                                </div>
                                                <text class="fontSize36 releaseBtn " @click="subClick" >提交</text>
                                            </div>
                                        </div>
                                    </div>

                                </cell>

                                <loading class="loading" @loading="onrefresh()" :display="loadinging ? 'show' : 'hide'">
                                    <text class="indicator-text">Loading ...</text>
                                    <loading-indicator class="indicator"></loading-indicator>
                                </loading>
                            </list>
                        </div>
                    </slider>
                </div>
            </div>

            <!--评价统计-->
            <div class="sliderRight">
                <list >
                    <cell>
                        <div class="panel">
                            <div class="scoreDiv">

                                <div class="statistics">
                                    <div class="score">
                                        <text  :style="{fontSize:'70px',color:GLOBAL.dColor}">{{score.shopAvg}}</text>
                                        <div>
                                            <image class="picture" src="https://image.aftdc.com/appBimg/ic_equal.png"></image>
                                        </div>
                                    </div>
                                    <div style="flex-direction: row;align-items: center;margin-top: 25px;">
                                        <text class="praise" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">评价口碑</text>
                                        <text class="spell" :style="{fontSize:GLOBAL.biggerFS}" v-if="score.shopAvg<=2">差</text>
                                        <text class="spell" :style="{fontSize:GLOBAL.biggerFS}" v-if="score.shopAvg>2 && score.shopAvg<4">中</text>
                                        <text class="spell" :style="{fontSize:GLOBAL.biggerFS}" v-if="score.shopAvg>=4">好</text>
                                        <!--<div>-->
                                        <!--<image class="pictures" src="https://image.aftdc.com/appBimg/icon_help.png"></image>-->
                                        <!--</div>-->
                                    </div>
                                </div>
                                <div class="above">
                                    <div>
                                        <text class="Merchants" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">商家评分</text>
                                        <div style="flex-direction: row;margin-top: 5px;align-items: center">
                                            <text class="evaluation" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}" style="margin-left: 50px;">总评价数:{{allcount}}</text>
                                        </div>
                                    </div>
                                    <div style="margin-left: 50px;">
                                        <text v-if="score.shopAvg<=2" class="prompt" :style="{fontSize:'24px',color:GLOBAL.dColor}">提升空间巨大!</text>
                                        <text v-if="score.shopAvg>2 && score.shopAvg<4" class="prompt" :style="{fontSize:'24px',color:GLOBAL.dColor}">口碑还算可以！</text>
                                        <text v-if="score.shopAvg>=4" class="prompt" :style="{fontSize:'24px',color:GLOBAL.dColor}">口碑非常好</text>
                                        <text class="prompt" :style="{fontSize:'24px',color:GLOBAL.dColor}">商家评分只超过{{score.shopCount}}%同行，关注评价可改善口碑。</text>
                                    </div>
                                </div>
                                <div class="grade">
                                    <div style="align-items: center">
                                        <text class="normal" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">口味评分</text>
                                        <text  :style="{fontSize:GLOBAL.biggestFS,color:GLOBAL.dColor}" style="margin-top: 20px;">{{score.tasteScore}}</text>
                                    </div>
                                    <div style="align-items: center">
                                        <text class="normal" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">包装评分</text>
                                        <text  :style="{fontSize:GLOBAL.biggestFS,color:GLOBAL.dColor}" style="margin-top: 20px;">{{score.warpScore}}</text>
                                    </div>
                                    <div style="align-items: center">
                                        <text class="normal" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">配送评分</text>
                                        <div style="flex-direction: row;align-items: center;margin-top: 20px;">
                                            <text  :style="{fontSize:GLOBAL.biggestFS,color:GLOBAL.dColor}">{{score.timeScore}}</text>
                                            <div style="flex-direction: row;align-items: center;margin-top: 15px;">
                                                <image class="picturess"
                                                       src="https://image.aftdc.com/appBimg/ic_equal.png"></image>
                                                <text style="color: #666;font-size: 25px;margin-left:4px">{{dsm}}min</text>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <div class="statisticsDiv">


                                <div class="announcement">
                                    <div class="bad" style="flex-direction: row;">
                                        <div class="rails"></div>
                                        <text :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">中差评统计</text>
                                        <text class="annotation" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">(近30天一二统计,00:00更新)</text>
                                    </div>
                                    <div>
                                        <text class="remind" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">您的店铺在口味评分方面得到中评较多，请着重优化菜品口味，以提升店铺口碑</text>
                                    </div>
                                    <div style="flex-direction: row;align-items: center;justify-content: space-between;margin-top: 15px;">
                                        <div style="flex-direction: row;align-items: center">
                                            <text  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}" style="margin-right: 40px;font-size: 30px;">商家中差评</text>
                                            <wxc-progress :value=baded.shopbad
                                                          bar-color='#34d9eb'
                                                          :bar-height=20
                                                          :bar-radius=16
                                                          :bar-width=350></wxc-progress>
                                        </div>
                                        <div style="flex-direction: row;align-items: center">
                                            <text class="nomals"  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{baded.shopbad}}条</text>
                                            <!--<wxc-icon name="more" style="color: #666;font-size: 35px"></wxc-icon>-->
                                        </div>
                                    </div>
                                    <div style="flex-direction: row;align-items: center;justify-content: space-between;margin-top: 15px;">
                                        <div style="flex-direction: row;align-items: center">
                                            <text  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}" style="margin-right: 40px;font-size: 30px;color: #999">口味中差评</text>
                                            <wxc-progress :value=baded.tastebad
                                                          bar-color='#e772ff'
                                                          :bar-height=20
                                                          :bar-radius=16
                                                          :bar-width=350></wxc-progress>
                                        </div>
                                        <div style="flex-direction: row;align-items: center">
                                            <text class="nomals"  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{baded.tastebad}}条</text>
                                            <!--<wxc-icon name="more" style="color: #666;font-size: 35px"></wxc-icon>-->
                                        </div>
                                    </div>
                                    <div style="flex-direction: row;align-items: center;justify-content: space-between;margin-top: 15px;">
                                        <div style="flex-direction: row;align-items: center">
                                            <text  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}" style="margin-right: 40px;font-size: 30px;color: #999">包装中差评</text>
                                            <wxc-progress :value=baded.warpbad
                                                          bar-color='#fdbd71'
                                                          :bar-height=20
                                                          :bar-radius=16
                                                          :bar-width=350></wxc-progress>
                                        </div>
                                        <div style="flex-direction: row;align-items: center">
                                            <text class="nomals"  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{baded.warpbad}}条</text>
                                            <!--<wxc-icon name="more" style="color: #666;font-size: 35px"></wxc-icon>-->
                                        </div>
                                    </div>
                                </div>
                                <!--<div class="announcement">-->
                                <!--<div class="bad" style="flex-direction: row;">-->
                                <!--<div class="rails"></div>-->
                                <!--<text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">商品好评榜</text>-->
                                <!--<text class="annotation" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">(历史统计结果)</text>-->
                                <!--</div>-->
                                <!--<div style="align-items: center">-->
                                <!--<image class="zan" src="https://image.aftdc.com/appBimg/ic_liked.png"></image>-->
                                <!--</div>-->
                                <!--<div style="align-items: center">-->
                                <!--<text class="gl">被赞过的商品很少，得加油啦！</text>-->
                                <!--</div>-->
                                <!--</div>-->

                                <!--<div class="announcement borderT">-->
                                <!--<div class="bad" style="flex-direction: row;">-->
                                <!--<div class="rails"></div>-->
                                <!--<text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">商品差评榜</text>-->
                                <!--<text class="annotation" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">(历史统计结果)</text>-->
                                <!--</div>-->
                                <!--<div style="align-items: center">-->
                                <!--<image class="zan" src="https://image.aftdc.com/appBimg/ic_disliked.png"></image>-->
                                <!--</div>-->
                                <!--<div style="align-items: center">-->
                                <!--<text class="gl">被踩过的商品很少，请继续保持！</text>-->
                                <!--</div>-->
                                <!--</div>-->
                            </div>

                        </div>
                    </cell>
                </list>
            </div>


        </slider>
        <!--</div>-->
        <div v-if="isOn==true" class="tips" @click="isOn=!isOn">
            <div class="mask" @click.stop="maskClick">
                <div style="align-items: center">
                    <text class="titleTips" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">可举报的恶意评价类型</text>
                </div>
                <div style="flex-direction: row;margin-top: 50px;">
                    <text class="point">.</text>
                    <text class="wben" :style="{fontSize:GLOBAL.bigFS}">泄露不文明用语</text>
                </div>
                <div style="flex-direction: row;margin-top: 20px;">
                    <text class="point">.</text>
                    <text class="wben" :style="{fontSize:GLOBAL.bigFS}">以差评谋求不正当利益</text>
                </div>
                <div style="flex-direction: row;margin-top: 20px;">
                    <text class="point">.</text>
                    <text class="wben" :style="{fontSize:GLOBAL.bigFS}">敏感或违法信息</text>
                </div>
                <div style="flex-direction: row;margin-top: 20px;">
                    <text class="point">.</text>
                    <text class="wben" :style="{fontSize:GLOBAL.bigFS}">同行恶意评价</text>
                </div>
                <div style="flex-direction: row;margin-top: 20px;">
                    <text class="point">.</text>
                    <text class="wben" :style="{fontSize:GLOBAL.bigFS}">广告或垃圾信息</text>
                </div>
                <div style="margin-top: 50px;align-items: center">
                    <text class="import" :style="{fontSize:GLOBAL.bigFS}">只有以上类型的恶意评价可举报，如滥用举报，将影响您的商店排名</text>
                </div>
                <div class="btn">
                    <text class="cancel" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}" @click="cancelClick">取消</text>
                    <text class="continue" :style="{fontSize:GLOBAL.bigFS}" @click="goToReport">继续举报</text>
                </div>
            </div>
        </div>
        <toast ref="toast"></toast>
    </div>
</template>


<script>
    import {WxcProgress,WxcMinibar} from 'weex-ui';
    import {WxcIcon} from 'weex-ui';
    import Toast from './Toast.vue';
    import  noOrder from './noOrder.vue';
    const dom = weex.requireModule('dom');
    const event = weex.requireModule('event');
    const post = weex.requireModule('stream');
    const navigator = weex.requireModule('navigator');
    export default {
        components: {WxcProgress, WxcIcon, Toast,WxcMinibar,noOrder},
        data() {
            return {
                backImgToggle: 0,//头部返回图片判断
                activeTab: 0,
                tabs: [{
                    title: '用户评价'
                }, {
                    title: '评价统计'
                }],
                isReply: 2,
                isRating: 0,
                isCheck: 0,
                stars: '',
                staring: '',
                startsArr: [],
                jsonStr: ['null', '好评', 'null'],
                loadinging: false,
                chapingCount: 0,
                haopingCount: 0,
                quanbuCount: 0,
                weihuifuCount: 0,
                weihuifuchapingCount: 0,
                zhongpingCount: 0,
                pinglun: [],
                page: 0,
                weihuifu: 0,
                weihuifucha: 0,
                noGreplys: [],
                noReplys: [],
                score: [],
                baded: [],
                dsm: "45",
                relyText:'',
                relyIndex:-1,
                allcount: 0,
                freshType: 1,
                isOn: false,
                token:'',
                imei:'',
                relyOpen:false //回复开关
            }
        },
        computed: {
            panels() {
                return this.tabs.map(tab => ({content: tab.title}))
            }
        },
        created: function () {
            this.token = weex.config.token;
            this.imei = weex.config.imei;
            var that = this;
            //获取token和sign
            var param = this.GLOBAL.sign(this.token,this.imei);
            param += '&page=0';
            param += '&jsonStr=' + JSON.stringify(that.jsonStr);
            post.fetch({
                method: 'POST',
                type: 'json',
                body: param,
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                url: 'https://www.aftdc.com/businessapp/Goodsappraises/getGoodsAppraises',
            }, function (e) {
                if (e.data.res === -2) {
                    //跳到登陆页面
                    navigator.push({
                        url: "https://image.aftdc.com/images/shop/",
                        animated: 'true'
                    })
                }
                else {
                    var shopbad = 0;
                    var tastebad = 0;
                    var warpbad = 0;
                    var shopAvg = 0;
                    var shopCount = 0;
                    var warpScore = 0;
                    var tasteScore = 0;
                    var timeScore = 0;

                    if (e.data.data.pingfen) {
                        if (e.data.data.pingfen.bad_review) that.chapingCount = e.data.data.pingfen.bad_review;
                        if (e.data.data.pingfen.praise) that.haopingCount = e.data.data.pingfen.praise;
                        if (e.data.data.pingfen.total_singular) that.quanbuCount = e.data.data.pingfen.total_singular;
                        if (e.data.data.pingfen.unanswered) that.weihuifuCount = e.data.data.pingfen.unanswered;
                        if (e.data.data.pingfen.bad_unanswered) that.weihuifuchapingCount = e.data.data.pingfen.bad_unanswered;
                        if (e.data.data.pingfen.average) that.zhongpingCount = e.data.data.pingfen.average;

                        if (e.data.data.pingfen.shop_bad_review) shopbad = e.data.data.pingfen.shop_bad_review;
                        if (e.data.data.pingfen.taste_bad_review) tastebad = e.data.data.pingfen.taste_bad_review;
                        if (e.data.data.pingfen.packaging_bad_review) warpbad = e.data.data.pingfen.packaging_bad_review;

                        if (e.data.data.pingfen.shopAvg) shopAvg = e.data.data.pingfen.shopAvg;
                        if (e.data.data.pingfen.total_singular) shopCount = e.data.data.pingfen.total_singular;
                        if (e.data.data.pingfen.warpAvg) warpScore = e.data.data.pingfen.warpAvg;
                        if (e.data.data.pingfen.tasteAvg) tasteScore = e.data.data.pingfen.tasteAvg;
                        if (e.data.data.pingfen.timeAvg) timeScore = e.data.data.pingfen.timeAvg;

                        if (e.data.data.pingfen.total_singular) that.allcount = e.data.data.pingfen.total_singular;
                    }

                    var bad = {
                        shopbad: shopbad,
                        tastebad: tastebad,
                        warpbad: warpbad,
                    };

                    var score = {
                        shopAvg: shopAvg,
                        shopCount: shopCount,
                        warpScore: warpScore,
                        tasteScore: tasteScore,
                        timeScore: timeScore,
                    };
                    that.score = score;
                    that.baded = bad;
                    if (e.data.dsm) that.dsm = e.data.dsm;
                    if (e.data.data.pinglun) that.pinglun = e.data.data.pinglun;
                    var goodsListString=''
                    for(var i in that.pinglun){
                        for(var j in that.pinglun[i].goodslist){
                            goodsListString+=that.pinglun[i].goodslist[j].goodsName+(j==that.pinglun[i].goodslist.length-1?'':';')
                        }
                        that.pinglun[i].goodsListString=goodsListString
                    }
                    that.page += e.data.pageCount;
                    if (e.data.pageCount < 10) {
                        that.freshType = 0;
                    }
                }
            });
            // that.noGreply();
            // that.noReply();
            //移除未读信息
            that.removeUnread();
        },
        methods: {
            //移除未读信息
            removeUnread() {
                var param = this.GLOBAL.sign(this.token,this.imei);
                param += '&type=' + 7;
                param += '&page=' + 0;
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: 'https://www.aftdc.com/businessapp/Store/getMessageDetails',
                }, function (e) {

                });
            },

            minibarRightButtonClick() {},
            //回复框失去焦点和隐藏
            relyOpenClose(){
                this.$refs.inputMessage.blur()
                this.relyOpen=false
            },
            //返回上一页
            backBtn: function () {
                navigator.pop({ animated: 'true' });
            },
            // 用户评价与评价统计切换
            sliderChange(e){
                var that=this
                that.activeTab = e.index

            },
            childChange(e){
                var that=this
                that.isReply=e.index
                if(e.index==0){
                    that.noGreply()
                }else if(e.index==1){
                    that.noReply()
                }else{
                    that.allReply()
                }
            },
            //跳转到继续举报页面
            goToReport: function () {
                var that = this;
                var relyIndex = that.relyIndex;
                var isReply = that.isReply;
                if (relyIndex !== -1) {
                    if (isReply === 0) {
                        var pid = that.noGreplys[relyIndex]['id'];
                    } else if (isReply === 1) {
                        var pid = that.noReplys[relyIndex]['id'];
                    } else if (isReply === 2) {
                        var pid = that.pinglun[relyIndex]['id'];
                    }
                } else {
                    const toast=that.$refs.toast;
                    toast.editContent('出错了');
                    return false;
                }
                var param = {'pid': pid};
                var url='http://assets/report.js';
                event.toUrl({ "url": url, "param": param });
            },

            noGreply: function () {
                var that = this;
                that.freshType = 1;
                if (that.freshType) {
                    this.page = 0;
                    this.isReply = 0;
                    var temp = ['未回复', '差评', 'null'];
                    temp = JSON.stringify(temp);
                    //获取token和sign
                    var param = this.GLOBAL.sign(this.token,this.imei);
                    param += '&page=0';
                    param += '&jsonStr=' + temp;
                    post.fetch({
                        method: 'POST',
                        type: 'json',
                        body: param,
                        headers: {"Content-Type": "application/x-www-form-urlencoded"},
                        url: 'https://www.aftdc.com/businessapp/Goodsappraises/Getappraises_page',
                    }, function (e) {
                        if (e.data.res === -2) {
                            //跳到登陆页面
                            navigator.push({
                                url: "https://image.aftdc.com/images/shop/",
                                animated: 'true'
                            })
                        }
                        else {
                            that.noGreplys = e.data.data.pinglun;
                            var goodsListString=''
                            for(var i in that.noGreplys){
                                for(var j in that.noGreplys[i].goodslist){
                                    goodsListString+=that.noGreplys[i].goodslist[j].goodsName+(j==that.noGreplys[i].goodslist.length-1?'':';')
                                }
                                that.noGreplys[i].goodsListString=goodsListString
                            }
                            that.page = e.data.pageCount;
                            if (e.data.pageCount < 10) {
                                that.freshType = 0;
                            }
                            if(that.noGreplys.length>0){
                                dom.scrollToElement(that.$refs.noGreplysScoller[0],{})
                            }
                        }
                    })
                }
            },
            noReply: function () {
                var that = this;
                that.freshType = 1;
                if (that.freshType) {
                    this.isReply = 1;
                    this.page = 0;
                    var temp = ['未回复', 'null', 'null'];
                    temp = JSON.stringify(temp);
                    //获取token和sign
                    var param = this.GLOBAL.sign(this.token,this.imei);
                    param += '&page=0';
                    param += '&jsonStr=' + temp;
                    post.fetch({
                        method: 'POST',
                        type: 'json',
                        body: param,
                        headers: {"Content-Type": "application/x-www-form-urlencoded"},
                        url: 'https://www.aftdc.com/businessapp/Goodsappraises/Getappraises_page',
                    }, function (e) {
                        if (e.data.res === -2) {
                            //跳到登陆页面
                            navigator.push({
                                url: "https://image.aftdc.com/images/shop/",
                                animated: 'true'
                            })
                        }
                        else {
                            that.noReplys = e.data.data.pinglun;
                            var goodsListString=''
                            for(var i in that.noReplys){
                                for(var j in that.noReplys[i].goodslist){
                                    goodsListString+=that.noReplys[i].goodslist[j].goodsName+(j==that.noReplys[i].goodslist.length-1?'':';')
                                }
                                that.noReplys[i].goodsListString=goodsListString
                            }
                            that.page += e.data.pageCount;
                            if (e.data.pageCount < 10) {
                                that.freshType = 0;
                            }
                            if(that.noReplys.length>0){
                                dom.scrollToElement(that.$refs.noReplysScoller[0],{})
                            }
                        }
                    })
                }
            },
            allReply: function () {
                var that = this;
                that.freshType = 1;
                if (that.freshType) {
                    this.page = 0;
                    this.isReply = 2;
                    if (that.isCheck === 1)
                        that.jsonStr[2] = '有内容';
                    else {
                        that.jsonStr[2] = 'null';
                    }
                    that.jsonStr[0] = 'null';
                    var temp = JSON.stringify(that.jsonStr);
                    //获取token和sign
                    var param = this.GLOBAL.sign(this.token,this.imei);
                    param += '&page=0';
                    param += '&jsonStr=' + temp;
                    post.fetch({
                        method: 'POST',
                        type: 'json',
                        body: param,
                        headers: {"Content-Type": "application/x-www-form-urlencoded"},
                        url: 'https://www.aftdc.com/businessapp/Goodsappraises/Getappraises_page',
                    }, function (e) {
                        if (e.data.res === -2) {
                            //跳到登陆页面
                            navigator.push({
                                url: "https://image.aftdc.com/images/shop/",
                                animated: 'true'
                            })
                        }
                        else {
                            that.pinglun = e.data.data.pinglun;
                            var goodsListString=''
                            for(var i in that.pinglun){
                                for(var j in that.pinglun[i].goodslist){
                                    goodsListString+=that.pinglun[i].goodslist[j].goodsName+(j==that.pinglun[i].goodslist.length-1?'':';')
                                }
                                that.pinglun[i].goodsListString=goodsListString
                            }
                            that.page += e.data.pageCount;
                            if (e.data.pageCount < 10) {
                                that.freshType = 0;
                            }
                            if(that.pinglun.length>0){
                                dom.scrollToElement(that.$refs.allScoller[0],{})
                            }
                        }
                    })
                }
            },
            goodRating: function () {
                var that = this;
                that.freshType = 1;
                if (that.freshType) {
                    this.page = 0;
                    this.isRating = 0;
                    this.holdPage = 0;
                    that.jsonStr[1] = '好评';
                    if (that.isCheck === 1)
                        that.jsonStr[2] = '有内容';
                    else {
                        that.jsonStr[2] = 'null';
                    }
                    //获取token和sign
                    var param = this.GLOBAL.sign(this.token,this.imei);
                    param += '&page=0';
                    param += '&jsonStr=' + JSON.stringify(that.jsonStr);
                    post.fetch({
                        method: 'POST',
                        type: 'json',
                        body: param,
                        headers: {"Content-Type": "application/x-www-form-urlencoded"},
                        url: 'https://www.aftdc.com/businessapp/Goodsappraises/Getappraises_page',
                    }, function (e) {
                        if (e.data.res === -2) {
                            //跳到登陆页面
                            navigator.push({
                                url: "https://image.aftdc.com/images/shop/",
                                animated: 'true'
                            })
                        }
                        else {
                            that.pinglun = e.data.data.pinglun;
                            var goodsListString=''
                            for(var i in that.pinglun){
                                for(var j in that.pinglun[i].goodslist){
                                    goodsListString+=that.pinglun[i].goodslist[j].goodsName+(j==that.pinglun[i].goodslist.length-1?'':';')
                                }
                                that.pinglun[i].goodsListString=goodsListString
                            }
                            that.page += e.data.pageCount;
                            if (e.data.pageCount < 10) {
                                that.freshType = 0;
                            }
                            if(that.pinglun.length>0){
                                dom.scrollToElement(that.$refs.allScoller[0],{})
                            }
                        }
                    })
                }
            },
            assessment: function () {
                var that = this;
                that.freshType = 1;
                if (that.freshType) {
                    this.page = 0;
                    this.isRating = 1;
                    this.holdPage = 0;
                    that.jsonStr[1] = '中评';
                    if (that.isCheck === 1)
                        that.jsonStr[2] = '有内容';
                    else {
                        that.jsonStr[2] = 'null';
                    }
                    //获取token和sign
                    var param = this.GLOBAL.sign(this.token,this.imei);
                    param += '&page=0';
                    param += '&jsonStr=' + JSON.stringify(that.jsonStr)
                    post.fetch({
                        method: 'POST',
                        type: 'json',
                        body: param,
                        headers: {"Content-Type": "application/x-www-form-urlencoded"},
                        url: 'https://www.aftdc.com/businessapp/Goodsappraises/Getappraises_page',
                    }, function (e) {
                        if (e.data.res === -2) {
                            //跳到登陆页面
                            navigator.push({
                                url: "https://image.aftdc.com/images/shop/",
                                animated: 'true'
                            })
                        }
                        else {
                            that.pinglun = e.data.data.pinglun;
                            var goodsListString=''
                            for(var i in that.pinglun){
                                for(var j in that.pinglun[i].goodslist){
                                    goodsListString+=that.pinglun[i].goodslist[j].goodsName+(j==that.pinglun[i].goodslist.length-1?'':';')
                                }
                                that.pinglun[i].goodsListString=goodsListString
                            }
                            that.page = e.data.pageCount;
                            if (e.data.pageCount < 10) {
                                that.freshType = 0;
                            }
                            if(that.pinglun.length>0){
                                dom.scrollToElement(that.$refs.allScoller[0],{})
                            }
                        }
                    })
                }
            },
            bad: function () {
                var that = this;
                that.freshType = 1;
                if (that.freshType) {
                    this.isRating = 2;
                    this.page = 0;
                    this.holdPage = 0;
                    that.jsonStr[1] = '差评';
                    if (that.isCheck === 1)
                        that.jsonStr[2] = '有内容';
                    else {
                        that.jsonStr[2] = 'null';
                    }
                    //获取token和sign
                    var param = this.GLOBAL.sign(this.token,this.imei);
                    param += '&page=0';
                    param += '&jsonStr=' + JSON.stringify(that.jsonStr);
                    post.fetch({
                        method: 'POST',
                        type: 'json',
                        body: param,
                        headers: {"Content-Type": "application/x-www-form-urlencoded"},
                        url: 'https://www.aftdc.com/businessapp/Goodsappraises/Getappraises_page',
                    }, function (e) {
                        if (e.data.res === -2) {
                            //跳到登陆页面
                            navigator.push({
                                url: "https://image.aftdc.com/images/shop/",
                                animated: 'true'
                            })
                        }
                        else {
                            that.pinglun = e.data.data.pinglun;
                            var goodsListString=''
                            for(var i in that.pinglun){
                                for(var j in that.pinglun[i].goodslist){
                                    goodsListString+=that.pinglun[i].goodslist[j].goodsName+(j==that.pinglun[i].goodslist.length-1?'':';')
                                }
                                that.pinglun[i].goodsListString=goodsListString
                            }
                            that.page += e.data.pageCount;
                            if (e.data.pageCount < 10) {
                                that.freshType = 0;
                            }
                            if(that.pinglun.length>0){
                                dom.scrollToElement(that.$refs.allScoller[0],{})
                            }
                        }
                    })
                }
            },
            Check: function (isc) {
                this.isCheck = isc;
                this.allReply();
            },
            onrefresh: function () {
                var that = this;
                that.loadinging = true;
                setTimeout(() => {
                    if (that.freshType) {
                        var json = ['null', 'null', 'null'];
                        if (that.isReply === 0) {
                            json = [];
                            json[0] = '未回复';
                            json[1] = '差评';
                        }
                        if (that.isReply === 1) {
                            json = [];
                            json[0] = '未回复';
                        }
                        if (that.isReply === 2) {
                            json = [];
                            if (that.isRating === 0) {
                                json[1] = '好评'
                            }
                            if (that.isRating === 1) {
                                json[1] = '中评'
                            }
                            if (that.isRating === 2) {
                                json[1] = '差评'
                            }
                            if (that.isCheck === 1) {
                                json[2] = '有内容'
                            }
                            if (that.isCheck === 0) {
                                json[2] = 'null'
                            }
                        }
                        //获取token和sign
                        var param = this.GLOBAL.sign(this.token,this.imei);
                        param += '&page=' + this.page;
                        param += '&jsonStr=' + JSON.stringify(json);
                        post.fetch({
                            method: 'POST',
                            type: 'json',
                            body: param,
                            headers: {"Content-Type": "application/x-www-form-urlencoded"},
                            url: 'https://www.aftdc.com/businessapp/Goodsappraises/Getappraises_page',
                        }, function (e) {
                            if (e.data.res === -2) {
                                //跳到登陆页面
                                navigator.push({
                                    url: "https://image.aftdc.com/images/shop/",
                                    animated: 'true'
                                })
                            }
                            else {
                                if (that.isReply === 0) {
                                    that.noGreplys = that.noGreplys.concat(e.data.data.pinglun)
                                    var goodsListString=''
                                    for(var i in that.noGreplys){
                                        for(var j in that.noGreplys[i].goodslist){
                                            goodsListString+=that.noGreplys[i].goodslist[j].goodsName+(j==that.noGreplys[i].goodslist.length-1?'':';')
                                        }
                                        that.noGreplys[i].goodsListString=goodsListString
                                    }
                                }
                                if (that.isReply === 1) {
                                    that.noReplys = that.noReplys.concat(e.data.data.pinglun)
                                    var goodsListString=''
                                    for(var i in that.noReplys){
                                        for(var j in that.noReplys[i].goodslist){
                                            goodsListString+=that.noReplys[i].goodslist[j].goodsName+(j==that.noReplys[i].goodslist.length-1?'':';')
                                        }
                                        that.noReplys[i].goodsListString=goodsListString
                                    }
                                }
                                if (that.isReply === 2) {
                                    that.pinglun = that.pinglun.concat(e.data.data.pinglun)
                                    var goodsListString=''
                                    for(var i in that.pinglun){
                                        for(var j in that.pinglun[i].goodslist){
                                            goodsListString+=that.pinglun[i].goodslist[j].goodsName+(j==that.pinglun[i].goodslist.length-1?'':';')
                                        }
                                        that.pinglun[i].goodsListString=goodsListString
                                    }
                                }
                                that.page += e.data.pageCount;
                                if (e.data.pageCount < 10) {
                                    that.freshType = 0;
                                }
                            }
                        })
                    } else {
                        const toast=that.$refs.toast;
                        toast.editContent('亲，没有更多了哦');
                    }
                    that.loadinging = false
                }, 2000);
            },
            maskClick: function () {
            },
            cancelClick: function () {
                this.isOn = false
            },
            relyClick:function (index) {
                this.relyOpen=!this.relyOpen;
                var that = this;
                that.relyIndex = index;
                setTimeout(function () {
                    that.$refs.inputMessage.focus()
                },10)
            },
            reportClick:function (index) {
                var that = this;
                that.isOn=!that.isOn;
                that.relyIndex = index;
            },
            //提交回复
            subClick:function () {
                var that = this;
                var pid = 0;
                var userId = 0;
                var avg = 0;
                var relyText = that.relyText;
                var relyIndex = that.relyIndex;
                var isReply = that.isReply;
                //获取token和sign
                var param = this.GLOBAL.sign(this.token,this.imei);

                if (relyText === '' || relyText === null) {
                    const toast=that.$refs.toast;
                    toast.editContent('评论内容为空');
                    return false;
                }
                if (relyIndex !== -1) {
                    if (isReply === 0) {
                        pid = that.noGreplys[relyIndex]['id'];
                        userId = that.noGreplys[relyIndex]['userId'];
                        avg = that.noGreplys[relyIndex]['avg'];
                    } else if (isReply === 1) {
                        pid = that.noReplys[relyIndex]['id'];
                        userId = that.noReplys[relyIndex]['userId'];
                        avg = that.noReplys[relyIndex]['avg'];
                    } else if (isReply === 2) {
                        pid = that.pinglun[relyIndex]['id'];
                        userId = that.pinglun[relyIndex]['userId'];
                        avg = that.pinglun[relyIndex]['avg'];
                    }
                    param += '&pid=' + pid;
                    param += '&userId=' + userId;
                    param += '&avg=' + avg;
                } else {
                    const toast=that.$refs.toast;
                    toast.editContent('出错了');
                    return false;
                }
                param += '&relyText=' + relyText;
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    url: 'https://www.aftdc.com/businessapp/Goodsappraises/relyText',
                }, function (e) {
                    if (e.data.res === -2) {
                        //跳到登陆页面
                        navigator.push({
                            url: "https://image.aftdc.com/images/shop/",
                            animated: 'true'
                        })
                    }
                    else if (e.data.res === 1){
                        that.$refs.inputMessage.blur();
                        that.relyOpen = !that.relyOpen;
                        const toast=that.$refs.toast;
                        toast.editContent('回复成功');

                        var shopReply = {};
                        shopReply['days'] = e.data.days;
                        shopReply['content'] = relyText;
                        if (isReply === 0) {
                            that.noGreplys[relyIndex]['shopReply'].unshift(shopReply);
                            that.weihuifuchapingCount = parseInt(that.weihuifuchapingCount) - 1;
                            that.weihuifuCount = parseInt(that.weihuifuCount) - 1;
                        } else if (isReply === 1) {
                            that.noReplys[relyIndex]['shopReply'].unshift(shopReply);
                            if (that.noReplys[relyIndex]['avg'] <= 2) {
                                that.weihuifuchapingCount = parseInt(that.weihuifuchapingCount) - 1;
                                that.weihuifuCount = parseInt(that.weihuifuCount) - 1;
                            } else that.weihuifuCount = parseInt(that.weihuifuCount) - 1;
                        } else if (isReply === 2) {
                            that.pinglun[relyIndex]['shopReply'].unshift(shopReply);
                            if (!that.pinglun[relyIndex]['shopReply']) {
                                if (that.pinglun[relyIndex]['avg'] <= 2){
                                    that.weihuifuchapingCount = parseInt(that.weihuifuchapingCount) - 1;
                                    that.weihuifuCount = parseInt(that.weihuifuCount) - 1;
                                } else that.weihuifuCount = parseInt(that.weihuifuCount) - 1;
                            }
                        }
                        that.relyText = ''
                    } else {
                        that.relyOpen = !that.relyOpen;
                        const toast=that.$refs.toast;
                        toast.editContent('出错了');
                    }
                })
            },
        },
    }
</script>

<style scoped>
    .flex1 {
        flex: 1;
    }
    .flex8 {
        flex: 8;
    }
    .titles {
        /*flex: 8;*/
        align-items: center;
        justify-content: center;
        border-width: 1px;
        border-style: solid;
        border-color: #fff;
        border-radius: 6px;
        box-sizing: border-box;
        flex-direction: row;
    }
    .tab {
        width: 195px;
        height: 60px;
        align-items: center;
        justify-content: center;
    }
    .tabText {
        font-size: 28px;
        color: #fff;
    }
    .tabActive {
        background-color: #fff;
    }
    .tabTextActive {
        color: #787878;
    }

    .size {
        /*position: absolute;*/
        position: relative;
        flex: 1;
    }
    .sliderRight {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
    }
    .panelpanel {
        flex: 1;
    }







    .loading {
        width: 750px;
        display: -ms-flex;
        display: -webkit-flex;
        display: flex;
        -ms-flex-align: center;
        -webkit-align-items: center;
        -webkit-box-align: center;
        align-items: center;
        /*position: fixed;*/
    }
    .indicator-text {
        color: #888888;
        font-size: 30px;
        text-align: center;
    }
    .indicator {
        margin-top: 16px;
        height: 40px;
        width: 40px;
        color: blue;
    }
    .wrapper {
        background-color: #f8f8f8;
    }
    .panel {
        width: 750px;
    }
    .scoreDiv{
        background-color: #fff;
    }
    .statisticsDiv{
        background-color: #fff;
        margin-top: 20px;
    }

    .options {
        padding-left: 20px;
        padding-right: 20px;
        /*border-bottom-width: 1px;*/
        /*border-bottom-style: solid;*/
        /*border-bottom-color: #999;*/
        padding-bottom: 20px;
        background-color: #ffffff;
    }
    .replys {
        margin-top: 20px;
        border-color: #54bcb6;
        border-width: 1px;
        border-style: solid;
        border-radius: 10px;
    }

    .reply {
        font-size: 28px;
        width: 230px;
        height: 70px;
        border-color: #54bcb6;
        border-width: 1px;
        border-style: solid;
        text-align: center;
        line-height: 70px;
        color: #54bcb6;
    }

    .replyActive {
        font-size: 28px;
        width: 230px;
        height: 70px;
        border-color: #54bcb6;
        border-width: 1px;
        border-style: solid;
        text-align: center;
        line-height: 70px;
        background-color: #54bcb6;
        color: #ffffff;
    }

    .ratings {
        margin-top: 20px;
        margin-left: 10px;
    }
    .choiceType{
        padding-top: 20px;
        padding-left: 30px;
        /*padding-bottom: 20px;*/
        background-color: #fff;
    }
    .row{
        flex-direction: row;
    }
    .rating {
        width: 130px;
        height: 40px;
        border-width: 1px;
        border-style: solid;
        border-color: #999;
        border-radius: 20px;
        text-align: center;
        line-height: 40px;
        margin-right: 15px;
        font-size: 24px;
        color: #999;
    }

    .ratingActive {
        width: 130px;
        height: 40px;
        border-width: 1px;
        border-style: solid;
        border-color: #f0a65d;
        border-radius: 20px;
        text-align: center;
        line-height: 40px;
        margin-right: 15px;
        font-size: 24px;
        color: #f0a65d;
    }

    .check {
        width: 35px;
        height: 35px;
        margin-right: 20px;
    }
    .comments {
        position: absolute;
        top: 20px;
        bottom: 0;
        left: 0;
        right: 0;
    }

    .message {
        background-color: #fff;
        padding-left: 20px;
        padding-right: 20px;
        padding-bottom: 20px;
        padding-top: 20px;
        border-bottom-style: solid;
        border-bottom-color: rgba(235, 239, 242, 0.51);
        border-bottom-width: 20px;
        /*margin-top: 20px;*/
    }

    .results {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-top: 15px;
    }

    .type {
        font-size: 24px;
        color: #666;
        padding: 5px;
        background-color: rgba(141, 141, 141, 0.1);

    }

    .userName {
        margin-right: 25px;
        max-width: 430px;
        margin-top: 5px;
    }


    .starS {
        width: 40px;
        height: 40px;
    }

    .starH {
        width: 35px;
        height: 35px;
    }

    .good {
        margin-right: 10px;
        width: 30px;
        height: 30px;
    }

    .user {
        margin-top: 15px;
        margin-bottom: 15px;
    }

    .goods {
        margin-left: 10px;
        margin-bottom: 10px;
        width: 160px;
        height: 160px;
    }

    .response {
        padding-bottom: 10px;
        border-bottom-style: solid;
        border-bottom-width: 1px;
        border-bottom-color: rgba(153, 153, 153, 0.2);
    }

    .shopLabel{
        flex-wrap: wrap;
        max-width: 710px;
        padding-left: 20px;
        padding-right: 20px;
        /*margin-top: 18px;*/
        /*margin-bottom: 30px;*/
        margin-top: 8px;
        margin-bottom: 16px;
    }
    .labelText{
        line-height: 35px;
        margin-right: 10px;
    }
    .report {
        width: 50px;
        height: 50px;
    }

    .huifu {
        width: 100px;
        height: 46px;
        border-width: 2px;
        border-style: solid;
        border-color: #53beb7;
        border-radius: 6px;
        text-align: center;
        line-height: 42px;
    }

    .noDetailsText{
        width: 750px;
        text-align: center;
        color: #999;
    }

    .statistics {
        flex-direction: row;
        justify-items: center;
        padding-top: 30px;
        padding-left: 75px;
        background-color: #ffffff;
    }

    .above {
        padding-top: 20px;
        flex-direction: row;
        padding-bottom: 10px;
        border-bottom-width: 1px;
        border-bottom-color: rgba(153, 153, 153, 0.51);
        border-bottom-style: solid;
        background-color: #ffffff;
    }

    .score {
        flex-direction: row;
        align-items: center;
    }

    .picture {
        width: 20px;
        height: 20px;
        margin-top: 40px;
        margin-left: 10px;
    }

    .pictures {
        width: 30px;
        height: 30px;
        margin-top: 5px;
        margin-left: 10px;
    }

    .num {
        font-size: 70px;
        color: #666;
    }

    .praise {
        margin-left: 60px;
        /*padding: 5px;*/
        padding-top: 4px;
        padding-bottom: 4px;
        padding-left: 8px;
        padding-right: 8px;

        background-color: rgba(225, 225, 225, 0.46);
    }

    .spell {
        margin-left: 20px;
        color: #e28d47;
    }

    .Merchants {
        color: #333;
        font-size: 30px;
        margin-left: 70px;
    }

    .evaluation {
        font-size: 30px;
        color: #999;
    }

    .prompt {
        width: 480px;
    }

    .grade {
        background-color: #ffffff;
        flex-direction: row;
        justify-content: space-between;
        padding-left: 40px;
        padding-right: 40px;
        padding-top: 20px;
        padding-bottom: 15px;
        /*border-bottom-width: 1px;*/
        /*border-bottom-style: solid;*/
        /*border-bottom-color: rgba(153, 153, 153, 0.51);*/
    }

    .normal {
        color: #999;
    }
    .picturess {
        width: 20px;
        height: 20px;
        margin-left: 10px;
    }

    .announcement {

        background-color: #ffffff;
        padding-bottom: 20px;
        padding-left: 20px;
        padding-right: 20px;
    }

    .rail {
        height: 12px;
        background-color: rgba(153, 153, 153, 0.2);
    }

    .bad {
        margin-top: 20px;
        align-items: center;
    }
    .rails {
        width: 7px;
        height: 35px;
        background-color: #53beb5;
        margin-right: 15px;
    }

    .annotation {
        margin-left: 20px;
    }

    .remind {
        margin-top: 20px;
    }

    .nomals {
        color: #999;
    }

    .zan {
        margin-top: 60px;
        width: 120px;
        height: 120px;
    }

    .gl {
        text-align: center;
        margin-top: 40px;
        margin-bottom: 20px;
        line-height: 50px;
        width: 380px;
        font-size: 36px;
        color: #a5a5a5;
    }

    .borderT {
        border-top-color: #b6b6b6;
        border-top-width: 1px;
        border-top-style: solid;
    }

    .tips {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        overflow: hidden;
        outline: 0;
        -webkit-overflow-scrolling: touch;
        background-color: rgb(0, 0, 0);
        filter: alpha(opacity=60);
        background-color: rgba(0, 0, 0, 0.6);
        z-index: 9999;
        align-items: center;
        justify-content: center;

    }

    .mask {
        width: 600px;
        height: 750px;
        background-color: #ffffff;
        border-radius: 15px;
    }

    .point {
        align-items: center;
        margin-left: 50px;
        margin-right: 20px;
        color: #999;
    }

    .titleTips {
        padding-top: 40px;
    }

    .wben {
        color: #999;
    }

    .btn {
        position: absolute;
        bottom: 0;
        flex-direction: row;
        border-top-width: 1px;
        border-top-style: solid;
        border-top-color: #d1d1d1;
    }

    .import {
        width: 500px;
        justify-content: center;
        color: red;
        background-color: rgba(153, 153, 153, 0.25);
        padding: 20px;
        border-radius: 10px;
        text-align: center;
    }

    .cancel {
        width: 300px;
        height: 100px;
        line-height: 100;
        color: #333;
        text-align: center;
        border-right-width: 1px;
        border-right-style: solid;
        border-right-color: #d1d1d1;
    }

    .cancel:active {
        background-color: #f1f1f1;
    }

    .continue {
        width: 300px;
        height: 100px;
        line-height: 100px;
        color: #3fb421;
        text-align: center;
        /*border-width: 1px;*/
        /*border-color: #999;*/
    }

    .continue:active {
        background-color: #f1f1f1;
    }
    .masksub{
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        overflow: hidden;
        outline: 0;
        -webkit-overflow-scrolling: touch;
        background-color: rgb(0, 0, 0);
        filter: alpha(opacity=60);
        background-color: rgba(0, 0, 0, 0.6);
        z-index: 9999;
        align-items: center;
        justify-content: flex-end;
    }
    .submit{
        flex-direction: row;
        /*position: fixed;*/
        width: 750px;
        border-width: 1px;
        border-color: #999;
        background-color: #ffffff;

    }

    .resay{
        width: 510px;
        height: 80px;
        border-width: 1px;
        margin: 20px;
        /*border-width: 1px;*/
        /*background-color: yellow;*/
        border-color: #ffffff;
        lines:2;
        align-items: center;
    }

    .sub{
        width: 200px;
        height: 120px;
        border-left-width: 1px;
        border-left-color: #999;
        text-align: center;
        line-height: 120;
        font-size: 35px;
        /*background-color: #00B4FF;*/
        color: #333;
    }
    .sub:active{
        background-color: #ebebeb;
    }
    .star{
        position: relative;
        /*margin-right: 10px;*/
        margin-left: 10px;
    }
    .starSize{
        width: 150px;
        height: 25px;

    }

    .shopAvgImg {
        position: absolute;
        left: 0;
        top:0;
        /*width: 15px;*/
        height: 25px;
        overflow: hidden;
    }
    .createTime {

        /*margin-right: 25px;*/
        margin-top: 5px;
    }

    /* 回复框样式 */
    .commentInputBg {
        width: 586px;
        margin-left: 30px;
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #edeeee;
    }
    .grayBg {
        width: 586px;
        height: 64px;
        position: absolute;
        top: 15px;
        left: 0;
        border-width: 1px;
        border-style: solid;
        border-color: #edeeee;
        border-radius: 50px;
        background-color: #f4f5f6;
    }
    .commentInput {
        width: 546px;
        height: 94px;    /*94 65*/
        margin-left: 20px;

    }
    .releaseBtn {
        margin-left: 28px;
        font-weight: bold;
        color: #a6a6a6;
    }
    .row {
        flex-direction: row;
    }
    .aiCenter {
        align-items: center;
    }
    .fontSize36 {
        font-size: 36px;
    }
    .listCell{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }
    .lookAround{
        margin-top: 30px;
        width: 200px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border-style: solid;
        border-width: 2px;
        border-color: #53beb7;
        border-radius: 10px;
    }
    .proposal{
        margin-top: 20px;
    }
    .noOrder{
        margin-top: 30px;
    }
    .bodyImage{
        width: 200px;
        height: 200px;
    }
    .body-wxc{
        flex: 1;
        margin-top: 250px;
        align-items: center;
        justify-content: center;
        /*background-color: #f8f8f8;*/
    }
</style>
