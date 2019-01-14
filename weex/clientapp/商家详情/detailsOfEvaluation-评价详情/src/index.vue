<template>
    <div class="wrapper">

        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    v-once
            >
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">评价详情</text>
            </wxc-minibar>
        </div>

        <list class="list"  show-scrollbar="false">
            <cell class="cell">
                <!--评价-->
                <div class="message" v-for="(item,index) in messageListOne" :key="index">
                    <div class="messageDiv">

                        <div class="messageImg">
                            <image class="messageImg" :src="item.personalImg"></image>
                        </div>
                        <div class="messageInfo">
                            <div class="messageInfoTitle">
                                <text class="messageInfoText" :style="{fontSize:GLOBAL.bigFS}">{{item.name}}</text>
                                <image class="messageInfoIcon" :src="'https://image.aftdc.com/images/v'+item.grade+'.png'"></image>
                                <text class="messageTime" :style="{fontSize:GLOBAL.smallFS}">{{item.time}}</text>
                            </div>
                            <div class="starTextDiv">
                                <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">打分</text>
                                <div class="starDiv">
                                    <image class="starIcon" src="https://image.aftdc.com/appBimg/icon_wuxing_nocolor.png"></image>
                                    <div class="starIconTwoDiv" :style="{width:item.star*30}">
                                        <image class="starIconTwo" src="https://image.aftdc.com/appBimg/icon_wuxing_color.png"></image>
                                    </div>
                                </div>
                                <text class="howMuch" :style="{fontSize:GLOBAL.defaultFS}">￥{{item.thisPrice}}/人</text>
                            </div>
                        </div>
                    </div>


                    <div style="margin-left: 110px;">

                        <text class="messageText" v-if="item.message!=''" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.message}}</text>
                        <div class="details" v-if="item.detailsText!=''">
                            <image class="detailsIcon" src="https://image.aftdc.com/appBimg/details_icon.png"></image>
                            <text class="detailsText" :style="{fontSize:GLOBAL.smallFS}">{{item.detailsText}}</text>
                        </div>
                        <div class="messageIconDiv">
                            <image class="messageIcon" v-for="(itemTwo,index3) in item.pictureList" :key="index3" :src="itemTwo.img" v-if="itemTwo.img!=''"></image>
                        </div>
                        <div class="shopName" @click="toShopDetails()">
                            <image class="shopNameImg" :src="item.recommendImg"></image>
                            <div class="shopNameDiv">
                                <div class="shopTitleDiv">
                                    <text class="shopTitle" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.recommendShopName}}</text>
                                    <text class="price" :style="{fontSize:GLOBAL.defaultFS}">￥{{item.recommendPrice}}/人</text>
                                </div>
                                <text class="foodName" :style="{fontSize:GLOBAL.smallFS}">{{item.recommendFoodName}}</text>
                            </div>
                        </div>

                    </div>


                    <div class="feedback">
                        <text class="browse" :style="{fontSize:GLOBAL.defaultFS}">浏览{{item.browse}}万</text>
                        <div class="feedbackZan" @click="animationClick(index)">
                            <image class="feedbackZanIcon" :src="item.zanIcon==true?'https://image.aftdc.com/images/zhan.png':'https://image.aftdc.com/images/nozhan.png'"></image>
                            <text class="feedbackZanNum" :style="{fontSize:GLOBAL.smallFS}"> {{item.zanNumber==0?'赞':item.zanNumber}}</text>
                        </div>
                        <div class="feedbackZan" @click="commentClick(index)">
                            <image class="feedbackZanIcon" src="https://image.aftdc.com/appBimg/leaveMessage_icon.png"></image>
                            <text class="feedbackZanNum" :style="{fontSize:GLOBAL.smallFS}"> {{item.commentList.length>0?item.commentList.length:'评论'}}</text>
                        </div>
                        <div class="report" @click="reportClick">
                            <image class="reportIcon" src="https://image.aftdc.com/appBimg/ellipsis_icon.png"></image>
                        </div>
                    </div>
                    <!--<div class="userZan">-->
                    <!--<image class="userZanIcon"></image>-->
                    <!--<image class="userIcon"></image>-->
                    <!--</div>-->

                    <div class="commentDiv">
                        <image class="commentIcon" src="https://image.aftdc.com/appBimg/comment_icon.png"></image>
                        <div class="commentGG">
                            <div class="commentDivTwo" @click="replyClick(indexFour)" v-for="(itemFour,indexFour) in item.commentList" :key="indexFour">
                                <div class="userImgDiv">
                                    <image class="userImg" @click.stop="" :src="itemFour.userImg"></image>
                                </div>
                                <div class="commentDivThree">
                                    <div class="comment">
                                        <div class="userNameDiv">
                                            <text class="userName"  @click.stop="" :style="{fontSize:GLOBAL.defaultFS}">{{itemFour.userName}}</text>
                                            <text class="commentTime" :style="{fontSize:GLOBAL.smallFS}">{{itemFour.commentTime}}</text>
                                        </div>
                                        <div class="commentText">
                                            <text v-if="itemFour.comment" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">回复</text>
                                            <text class="commentCenter" @click.stop="" v-if="itemFour.comment" :style="{fontSize:GLOBAL.defaultFS}">{{itemFour.commentUserName}}:</text>
                                            <text class="commentContent"  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{itemFour.userComment}}</text>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </cell>
        </list>

        <!--点赞动画star-->
        <image class="box" ref="test" src="https://image.aftdc.com/images/zan.png"></image>
        <!--点赞动画end-->

        <!--输入框star-->
        <!--输入框end-->

        <!--是否删除评论的提示框star-->
        <wxc-mask height="230"
                  width="620"
                  border-radius="10"
                  duration="200"
                  mask-bg-color="#FFFFFF"
                  :has-animation="true"
                  :has-overlay="true"
                  :show-close="false"
                  :show="delShow"
                  :overlay-can-close="true"
                  @wxcMaskSetHidden="wxcMaskSetHidden">
            <div class="deleteDiv">
                <text class="deleteText" @click="deleteClick">删除</text>
                <text class="deleteText" @click="cancelClick">取消</text>
            </div>
        </wxc-mask>
        <!--是否删除评论的提示框end-->

        <!--是否举报提示框star-->
        <wxc-mask height="230"
                  width="620"
                  border-radius="10"
                  duration="200"
                  mask-bg-color="#FFFFFF"
                  :has-animation="true"
                  :has-overlay="true"
                  :show-close="false"
                  :show="reportShow"
                  :overlay-can-close="true"
                  @wxcMaskSetHidden="wxcMaskSetHidden">
            <div class="deleteDiv">
                <text class="deleteText">举报评价</text>
                <text class="deleteText" @click="reportCancelClick">取消</text>
            </div>
        </wxc-mask>
        <!--是否举报提示框end-->

        <!--获取焦点时的白色遮罩层star-->
        <div class="blank" :style="{left:blankLeft}" @click="blankClick"></div>
        <!--获取焦点时的空白白色遮罩层end-->

        <!--输入框star-->
        <!--<div class="messageBoardTwo">-->
        <!--<input type="text" class="messageBoardInput" :placeholder="reply==''?'评论':'回复:'+reply" ref="inputMessage" v-model="messageText" @blur="blur" @focus="focus" @change="change">-->
        <!--<text class="messageBoardSend" @click="leavingClick">发送</text>-->
        <!--</div>-->

        <div class="messageBoardTwo row aiCenter">
            <div class="commentInputBg" >
                <div class="grayBg"></div>
                <input class="commentInput" type="text" :placeholder="reply==''?'评论':'回复:'+reply" ref="inputMessage" v-model="messageText" @blur="blur" @focus="focus" @change="change" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">
            </div>
            <text class="releaseBtn " :class="[messageText===''?'':'messageBoardSendTwo']" @click="leavingClick" :style="{fontSize:GLOBAL.bigFS}">发布</text>
        </div>
        <!--输入框end-->

        <!--成功删除评论的提示star-->
        <text class="deleteSuccess" v-if="delSuccess" :style="{fontSize:GLOBAL.defaultFS}">删除成功</text>
        <!--成功删除评论的提示end-->

        <!--点击发送按钮,但未输入内容的提示框start-->

        <wxc-mask height="320"
                  width="550"
                  border-radius="10"
                  duration="200"
                  mask-bg-color="#FFFFFF"
                  :has-animation="true"
                  :has-overlay="true"
                  :show-close="false"
                  :show="show"
                  @wxcMaskSetHidden="wxcMaskSetHidden">
            <div class="Prompt">
                <text :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">提示</text>
                <text class="textTwo" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">请输入内容</text>
                <text class="textThree" @click="textThreeClick" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}">确定</text>
            </div>
        </wxc-mask>

        <!--点击发送按钮,但未输入内容的提示框end-->
    </div>
</template>

<script>

    import { WxcMask,WxcMinibar } from 'weex-ui';
    const animation = weex.requireModule('animation')
    const modal = weex.requireModule('modal')
    const event = weex.requireModule('event')
    export default {
        components: { WxcMask,WxcMinibar },
        name: 'App',
        data () {
            return {
                show:false,
                messageText:'',//用户输入的内容
                bridging:0,//发送按钮和每个评价的桥接
                reply:'',//获取回复的用户名
                delSuccess:false,//删除成功提示
                myevaluateUser:'千寻',//myevaluateUser用于区分的自己和别人ID
                blankLeft:-750,//白色遮罩层默认在屏幕外边
                delShow:false,//弹出框(是否显示删除评论)
                reportShow:false,//弹出框(是否举报评论)

                messageListOne:[
                    {
                        personalImg:'https://image.aftdc.com/images/packageA/shopImg2.jpg',name:'千与千寻',star:5,thisPrice:20,message:'不错,很喜欢这家的汉堡,实惠又好吃,重点是配送的小姐姐很好看,又会说话不错,很喜欢这家的汉堡,实惠又好吃,重点是配送的小姐姐很好看,又会说话>_<',
                        detailsText:'服务差,味道差,分量少,肉类一般,环境差',grade:6,time:'2018-09-06',recommendImg:'https://image.aftdc.com/images/packageA/shopImg2.jpg',recommendShopName:'华莱士(鸦岗店)',recommendFoodName:'石井 汉堡',recommendPrice:15,
                        browse:4,zanNumber:0,zanIcon:false,messageHide:false,del:false,report:false,
                        pictureList:
                            [
                                {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                            ],
                        commentList:
                            [
                                {userImg:'https://image.aftdc.com/images/packageA/shopImg2.jpg',userName:'千寻',userComment:'阿斯蒂芬撒旦法第三方撒旦法撒旦法撒旦法阿斯蒂芬撒旦法撒旦法撒旦法撒旦法萨达阿发撒旦法撒旦法士大夫撒旦法萨达法法',commentTime:'3月31日',comment:false},
                                {userImg:'https://image.aftdc.com/images/packageA/shopImg2.jpg',userName:'是大法官',userComment:'难吃',commentTime:'3月31日',comment:false},
                                {userImg:'https://image.aftdc.com/images/packageA/shopImg2.jpg',userName:'阿古斯',userComment:'难吃',commentTime:'3月31日',comment:false},
                            ],
                    },
                ],

                //动画内容star
                rotateRight:{styles: {

                        transform: 'rotate(10deg) scale(2.3, 2.3)',

                    },
                    duration: 40,
                    timingFunction: 'linear',
                    delay: 0
                },
                rotateRecover:{
                    styles: {

                        transform: 'rotate(0deg) scale(2.3, 2.3)',

                    },
                    duration: 40, //ms
                    timingFunction: 'linear',
                    delay: 0 //ms
                },
                rotateLeft:{
                    styles: {

                        transform: 'rotate(-10deg) scale(2.3, 2.3)',

                    },
                    duration: 40, //ms
                    timingFunction: 'linear',
                    delay: 0 //ms
                },
                //动画内容end

            }
        },
        methods:{

            minibarLeftButtonClick(){},
            change(event){
                this.messageText=event.value;
            },//重点,如果
            blur(){
                this.blank=false;
                this.blankLeft=-750;
                if(this.messageText==''){
                    this.reply='';
                }
            },//输入框的失去焦点

            focus(){
                this.blankLeft=0;
            },

            blankClick(){
                var that=this;
                that.blankLeft=-750;
                that.$refs.inputMessage.blur()

            },

            wxcMaskSetHidden(){
                this.show=false;
                this.delShow=false;
                this.reportShow=false;
            },//组件的默认事件

            textThreeClick(){
                this.show=false;
            },//弹出层组件的点击关闭

            //删除评论的点击取消star
            cancelClick(){
                this.delShow=false;
            },
            //删除评论的点击取消end


            //发送评论的点击发送和未输入内容的提示star
            leavingClick(event){
                var that=this;
                if(that.messageText==''){
                    that.$refs.inputMessage.blur()
                    that.blankLeft=-750;
                    that.show=true;
                }
                else{
                    if(that.reply==''){
                        that.messageListOne[0].commentList.push({userImg:'https://image.aftdc.com/images/packageA/shopImg2.jpg',userName:'千寻',userComment:that.messageText,commentTime:'3月31日',comment:false,})
                    }
                    else{
                        that.messageListOne[0].commentList.push({userImg:'https://image.aftdc.com/images/packageA/shopImg2.jpg',userName:'千寻',userComment:that.messageText,commentTime:'3月03日',commentUserName:that.reply,comment:true} )
                        that.reply='';
                    }
                    that.$refs.inputMessage.blur();
                    that.blankLeft=-750;
                    that.messageText='';
                    modal.toast({
                        message:that.messageText,
                        duration: 0.3,
                    });
                }
            },
            //发送评论的点击发送和未输入内容的提示end
            //点击评论的内容判断是回复别人的内容还是删除自己评论的内容star
            replyClick(indexFour){
                var that=this;
                that.bridging=indexFour;
                if(that.messageListOne[0].commentList[indexFour].userName==that.myevaluateUser){
                    that.delShow=true;
                }
                else{
                    that.reply=that.messageListOne[0].commentList[indexFour].userName;//用replay获取我要回复的用户名
                    setTimeout(function () {
                        that.$refs.inputMessage.focus();
                        that.blankLeft=0;
                    },300)
                }
            },
            //点击评论的内容判断是回复别人的内容还是删除自己评论的内容end

            //当点击评论的内容是自己写的时候,有个弹出框,点击里面的删除会删除该评论star
            deleteClick(){
                var that=this;
                that.messageListOne[0].commentList.splice(that.bridging,1);
                that.delShow=false;
                that.delSuccess=true;
                setTimeout(function () {
                    that.delSuccess=false;
                },1200)
            },
            //当点击评论的内容是自己写的时候,有个弹出框,end

            //点击评论图标弹出输入框,自动获取焦点star
            commentClick(index){
                var that=this;
                that.reply='';
                that.blankLeft=0,
                    setTimeout(function () {
                        that.$refs.inputMessage.focus();
                    },300)
            },
            //点击评论图标弹出输入框,自动获取焦点end

            reportClick(){
                this.reportShow=true;
            },
            reportCancelClick(){
                this.reportShow=false;
            },

            //
            animationClick(index) {
                var that=this;

                if(that.messageListOne[index].zanIcon==false){
                    that.messageListOne[index].zanIcon=true;
                    that.messageListOne[index].zanNumber+=1;

                    var testEl = that.$refs.test;
                    animation.transition(testEl, {
                        styles: {
                            opacity: 1,
                            transform: 'scale(2.3)',

                        },
                        duration: 400, //ms
                        timingFunction: 'linear',
                        delay: 0 //ms
                    },function () {
                        animation.transition(testEl, that.rotateRight,function () {
                            animation.transition(testEl,that.rotateRecover,function () {
                                animation.transition(testEl, that.rotateLeft,function () {
                                    animation.transition(testEl, that.rotateRight,function () {
                                        animation.transition(testEl,that.rotateRecover,function () {
                                            animation.transition(testEl, that.rotateLeft,function () {
                                                animation.transition(testEl, {
                                                    styles: {
                                                        opacity: 0,
                                                        transform: 'scale(1, 1)',

                                                    },
                                                    duration: 240, //ms
                                                    timingFunction: 'linear',
                                                    delay: 0 //ms
                                                },function () {
                                                    that.toastFive=false;
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    });

                }
                else{
                    that.messageListOne[index].zanIcon=false;
                    that.messageListOne[index].zanNumber-=1;
                }

            },
            toShopDetails(){
                var param='';
                var url='http://assets/shopDetails.js';
                event.toUrl({"url":url,"param":param})
            },

        },
    }
</script>

<style scoped>
    .textThree{
        text-align: right;
    }
    .textTwo{
        padding-top: 40px;
        padding-bottom: 70px;
    }
    .Prompt{
        padding-top: 40px;
        padding-left: 40px;
        padding-right: 60px;
        padding-bottom: 40px;
    }
    .messageBoardTwo{
        position: fixed;
        bottom: 0;
        width: 750px;
        border-style: solid;
        border-color: #f8f8f8;
        border-width: 2px;
        background-color: #fff;
    }
    .messageBoardSendTwo{
        color:#53beb7;
    }
    .releaseBtn {
        padding-left: 28px;
        padding-right: 28px;
        padding-top: 20px;
        padding-bottom: 20px;
        font-weight: bold;
        color: #999;
    }
    .commentInput {
        width: 546px;
        height: 94px;
        padding-top: 20px;
        padding-bottom: 22px;/*94 65*/
        margin-left: 20px;
        placeholder-color:#999;
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
    .commentInputBg {
        width: 586px;
        margin-left: 30px;
        /*border-bottom-width: 2px;*/
        /*border-bottom-style: solid;*/
        /*border-bottom-color: #edeeee;*/
    }
    .aiCenter {
        align-items: center;
    }
    .row {
        flex-direction: row;
    }
    .minibar {
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: #f1f1f1;
    }
    .blank{
        position: fixed;
        width: 750px;
        top: 0;
        bottom: 0;
        left: -750px;
    }
    .commentCenter{
        color: #4d6f8e;
    }
    .commentText{
        flex-direction: row;
        align-items: center;
        margin-top: 5px;
        padding-bottom: 20px;
    }
    .commentTime{
        color: #999;
        flex: 1;
        text-align: right;
    }
    .userNameDiv{
        flex-direction: row;
        align-items: center;
        flex: 1;
    }
    .commentDivTwo{
        flex-direction: row;
        flex: 1;
        padding-top: 20px;
        /*padding-bottom: 20px;*/
    }
    .commentDivTwo:active{
        background-color: #f1f1f1;
    }

    .commentGG{
        flex: 1;
    }
    .userImgDiv{
        width: 70px;
        height: 70px;
        border-radius: 35px;
        margin-left: 10px;
        /*margin-top: 25px;*/
    }
    .userImg{
        width: 70px;
        height: 70px;
        border-radius: 35px;
    }
    .foodName{
        color: #999;
        margin-top: 20px;
    }
    .price{
        color: #999;
    }
    .shopTitle{
        flex: 1;
    }
    .shopNameDiv{
        margin-left: 20px;
        flex: 1;
    }
    .shopTitleDiv{
        flex-direction: row;
        align-items: center;
    }
    .shopNameImg{
        width: 110px;
        height: 110px;
    }
    .shopName{
        flex-direction: row;
        align-items: center;
        flex: 1;
        padding-top: 15px;
        padding-left: 15px;
        padding-bottom: 15px;
        padding-right: 15px;
        background-color: #f5f5f5;
        margin-top: 25px;
    }
    .detailsText{
        color: #999;
        flex: 1;
        margin-left: 10px;
    }
    .details{
        padding-top: 30px;
        padding-bottom: 10px;
        flex-direction: row;
        align-items: center;
    }
    .detailsIcon{
        width: 30px;
        height: 30px;
    }
    .commentIcon{
        width: 30px;
        height: 30px;
        margin-top: 35px;
        margin-right: 10px;
    }
    .commentDiv{
        margin-bottom: 15px;
        flex-direction: row;
        border-top-style: solid;
        border-top-width: 2px;
        border-top-color: #f1f1f1;

    }
    .cell{
        width: 750px;
    }
    .list{
        width: 750px;
        flex: 1;
        margin-bottom: 94px;
    }
    .deleteSuccess{
        position: fixed;
        bottom: 300px;
        padding-top: 10px;
        padding-bottom: 10px;
        margin-left: 300px;
        width: 150px;
        color: #fff;
        text-align: center;
        background-color: rgba(0,0,0,0.7);
    }
    .deleteText{
        line-height: 115px;
        padding-left: 40px;
    }
    .deleteDiv{
    }
    .textOne{
        font-size: 40px;
        color: #333;
    }
    /*.messageBoardTwo{*/
    /*border-style: solid;*/
    /*border-width: 2px;*/
    /*border-color: #e1e1e1;*/
    /*background-color: #f8f8f8;*/
    /*flex-direction: row;*/
    /*align-items: center;*/
    /*position: fixed;*/
    /*bottom: 0;*/
    /*}*/
    .box {
        width: 160px;
        height: 160px;
        opacity: 0;
        position: absolute;
        top: 500px;
        left: 300px;
        transform: scale(1)
    }
    .commentContent{
        padding-top: 5px;
        padding-bottom: 5px;
        flex: 1;
    }
    .userName{
        color: #4d6f8e;
        /*flex: 1;*/
    }
    .userName:active{
        background-color: #dedede;
    }
    .commentDivThree{
        flex: 1;
        border-bottom-style: solid;
        border-bottom-width: 2px;
        border-bottom-color: #f1f1f1;
    }
    .comment{
        margin-left: 20px;
        /*margin-bottom: 20px;*/
        /*margin-top: 20px;*/
        flex: 1;
    }
    .feedbackZanNum{
        color: #999;
        margin-left: 5px;
    }
    .feedbackZanIcon{
        width: 35px;
        height: 35px;
    }
    .reportIcon{
        width: 35px;
        height: 35px;
    }
    .report{
        width: 80px;
        padding-top: 10px;
        padding-bottom: 10px;
        margin-left: 20px;
        border-radius: 30px;
        border-style: solid;
        border-width: 1px;
        border-color:#ccc;
        flex-direction: row;
        justify-content: center;

    }
    .feedbackZan{
        padding-top: 10px;
        padding-bottom: 10px;
        width: 150px;
        margin-left: 20px;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        border-style: solid;
        border-width: 1px;
        border-color:#ccc;
        border-radius: 30px;
    }
    .feedbackZan:active{
        background-color: #e1e1e1;
    }
    .report:active{
        background-color: #e1e1e1;
    }
    .browse{
        color: #999;
        flex: 1;
    }
    .feedback{
        flex-direction: row;
        align-items: center;
        padding-top: 30px;
        padding-bottom: 30px;
        margin-left: 130px;
    }
    .messageIcon{
        width: 170px;
        height: 170px;
        margin-top: 10px;
        margin-right: 10px;
    }
    .messageIconDiv{
        flex-wrap: wrap;
        flex-direction: row;
        align-items: center;
        max-width: 600px;
    }
    .messageText{
        flex: 1;

    }
    .messageTime{
        color: #999;
        flex: 1;
        text-align: right;
    }
    .starIconTwo{
        width: 150px;
        height: 24px;
    }
    .starIconTwoDiv{
        position: absolute;
        overflow: hidden;
        left: 0px;
        top: 0;
        width: 0px;
        height: 24px;
    }
    .starIcon{
        width: 150px;
        height: 24px;
    }
    .starDiv{
        position: relative;
        width: 150px;
        height: 24px;
        margin-left: 15px;
    }
    .starTextDiv{
        flex-direction: row;
        align-items: center;
        margin-top: 10px;
    }
    .howMuch{
        color:#999;
        margin-left: 10px;
    }
    .messageInfoIcon{
        width: 40px;
        height: 40px;
        margin-left: 10px;
    }
    .messageInfoText{
        color:#4d6f8e;
    }
    .messageInfoTitle{
        flex-direction: row;
        align-items: center;
    }
    .messageInfo{
        flex: 1;
        margin-left: 20px;
    }

    .messageImg{
        width: 90px;
        height: 90px;
        border-radius: 45px;
    }
    .messageDiv{
        flex-direction: row;
        align-items: center;
    }
    .message{
        padding-top:30px;
        padding-left: 30px;
        padding-right: 30px;
    }
    .wrapper{

    }
</style>
