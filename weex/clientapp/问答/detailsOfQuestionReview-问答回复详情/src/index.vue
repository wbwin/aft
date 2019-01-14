<template>
    <div class="reply">
        <!--顶部bar-->

        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    v-once
            >
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">{{commentList.length}}条回复</text>
            </wxc-minibar>
        </div>


        <scroller class="scroller">
                <!--评论标题-->
                <div class="content" v-for="item in commentBigList">

                    <div class="contentLeft">
                        <div class="contentTopIcon">
                            <image class="contentTopIcon" :src="item.img"></image>
                        </div>
                    </div>

                    <div class="contentRight">
                        <div class="contentTop">
                            <text class="contentTopUser" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor}">{{item.name}}</text>
                            <text class="contentTopLabel" :style="{fontSize:GLOBAL.smallFS}">{{item.label}}</text>
                            <text class="follow" @click="followClick" :style="{fontSize:GLOBAL.defaultFS,color:item.follow?'#999':GLOBAL.tColor}">{{item.follow?'已关注':'关注'}}</text>
                        </div>
                        <text class="contentText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.text}}</text>
                        <div class="dataReport">
                            <text class="data" :style="{fontSize:GLOBAL.defaultFS}">{{item.time}}</text>
                            <text style="padding-left: 20px;padding-right: 20px;">·</text>
                            <text class="report" :style="{fontSize:GLOBAL.defaultFS}">举报</text>
                        </div>
                        <div class="zaned">
                            <div class="zanIconDiv" v-for="(itemTwo,index) in item.zanedIconList" :key="index" v-if="index<3">
                                <image class="zanIcon" :src="itemTwo.img"></image>
                            </div>
                            <div class="zanedDiv">
                                <text class="zanedText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.zanNumber==0?'没人赞过':item.zanNumber+'人赞过'}}</text>
                                <image class="zhanedsmallIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                            </div>
                            <div class="zanedNumber" @click="zanClick">
                                <image class="zanedNumberIcon" :src="item.zan?'https://image.aftdc.com/images/zhan.png':'https://image.aftdc.com/images/nozhan.png'"></image>
                                <text class="zanedNumberText" :style="{fontSize:GLOBAL.defaultFS}">{{item.zanNumber==0?'赞':item.zanNumber}}</text>
                            </div>

                        </div>
                    </div>
                </div>

                <!--全部评论-->
                <div class="comment" ref="inputTest">
                    <text class="commentText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}" >全部评论</text>
                    <div v-for="(item,index) in commentList" :key="index" style="margin-top: 30px; flex-direction: row" >

                        <div class="commentLeft">
                            <div class="contentTopIcon">
                                <image class="contentTopIcon" :src="item.img"></image>
                            </div>
                        </div>

                        <div class="contentRight">
                            <div class="commentTop">
                                <div class="commentLabelDiv">
                                    <text class="contentTopUser" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor}">{{item.name}}</text>
                                    <text class="commentLabel" :style="{fontSize:GLOBAL.smallFS}">{{item.label}}</text>
                                </div>
                                <div class="zanedNumber" @click="commentZanClick(index)">
                                    <image class="zanedNumberIcon" :src="item.zan?'https://image.aftdc.com/images/zhan.png':'https://image.aftdc.com/images/nozhan.png'"></image>
                                    <text class="zanedNumberText" :style="{fontSize:GLOBAL.defaultFS}">{{item.zanNumber}}</text>
                                </div>
                            </div>
                            <div style="flex-direction: row;margin-top: 25px;">
                                <text class="huiufu" v-if="item.judge==1" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}">回复</text>
                                <text class="name2" v-if="item.judge==1" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.name2}}: </text>
                                <text class="commentTextTwo" @click="reportClick(index)" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.text}}</text>
                            </div>
                            <div class="dataReport">
                                <text class="data" :style="{fontSize:GLOBAL.defaultFS}">06-20 23:01</text>
                                <text style="padding-left: 20px;padding-right: 20px;" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">·</text>
                                <text class="report" @click="reportClick(index)" :style="{fontSize:GLOBAL.defaultFS}">回复</text>
                                <text class="delete" v-if="item.name==myId" @click="reportDelClick(index)" :style="{fontSize:GLOBAL.defaultFS}">删除</text>
                            </div>
                        </div>
                    </div>

                </div>
        </scroller>

        <!--底部的回复按钮-->
        <div class="buttomReoprt">
            <div class="buttomReoprtTextDiv" @click="hidebuttomReoprt" v-if="buttomReoprt">
                <image class="buttomReoprtIcon" src="https://image.aftdc.com/appBimg/icon_leaveWord.png"></image>
                <text class="buttomReoprtText" :style="{fontSize:GLOBAL.defaultFS}">回复</text>
            </div>
            <image class="buttomReoprtZan" :src="commentBigList[0].zan?'https://image.aftdc.com/images/zhan.png':'https://image.aftdc.com/images/nozhan.png'" @click="zanClick"></image>
            <image class="buttomReoprtShare" src="https://image.aftdc.com/images/share.png"></image>
        </div>

        <!--弹出的input输入框-->
        <!--<div class="messageBoardTwo" v-if="messageBoard">-->
        <!--<input type="text" class="messageBoardInput" placeholder="优质评论将会被优先展示" ref="inputMessage" v-model="messageText" @blur="blur" @focus="focus" @change="change">-->
        <!--<text class="messageBoardSend" :class="[messageText===''?'':'messageBoardSendTwo']" @click="leavingClick">发布</text>-->
        <!--</div>-->


        <div class="messageBoardTwo row aiCenter" v-if="messageBoard">
            <div class="commentInputBg" >
                <div class="grayBg"></div>
                <input class="commentInput" type="text" placeholder="优质评论将会被优先展示" ref="inputMessage" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}"  v-model="messageText" @blur="blur" @focus="focus" @change="change">
            </div>
            <text class="releaseBtn " :class="[messageText===''?'':'messageBoardSendTwo']" @click="leavingClick" :style="{fontSize:GLOBAL.bigFS}">发布</text>
        </div>

        <!--input获取焦点时的白色遮罩层-->
        <div class="blank" :style="{left:blankLeft+'px'}" @touchstart="blankClick"></div>

        <!--是否确定删除评论弹出框-->
        <wxc-mask height="330"
                  width="550"
                  border-radius="0"
                  duration="200"
                  mask-bg-color="#FFFFFF"
                  :has-animation="true"
                  :has-overlay="true"
                  :show-close="false"
                  :show="reoprtDelShow"
                  @wxcMaskSetHidden="wxcMaskSetHidden">
            <div class="reoprtDel">
                <text class="reoprtDelTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">提示</text>
                <text class="reoprtDelText" :style="{fontSize:GLOBAL.defaultFS}">确认删除此评论</text>
                <div class="confirmCancel">
                    <text style="flex: 1;"></text>
                    <text class="cancel" :style="{fontSize:GLOBAL.defaultFS}">取消</text>
                    <text class="confirm" @click="confirmClick" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}">确定</text>
                </div>
            </div>
        </wxc-mask>

        <!--点赞按钮star-->
        <image class="box" ref="test" src="https://image.aftdc.com/images/zan.png"></image>
        <!--点赞按钮end-->
    </div>
</template>

<script>
    import {WxcMask, WxcMinibar, WxcPopup} from 'weex-ui';

    const animation = weex.requireModule('animation')
    const modal = weex.requireModule('modal')
    const dom = weex.requireModule('dom')
    export default {
        components: {WxcMask, WxcMinibar, WxcPopup},
        name: 'App',
        data() {
            return{
                buttomReoprt:true,//底部回复按钮的显示隐藏
                messageBoard:false,//输入框的显示隐藏
                reoprtDelShow:false,//确认是否删除弹出框的显示隐藏
                messageText:'',//与input框的数据绑定
                blankLeft:750,//灰色遮罩层的left
                judge:'',//判断时评论还是回复
                briding:'',//获取评论的index
                myId:'千寻',//用户id
                commentBigList:[
                    {
                        img:'https://image.aftdc.com/images/packageA/shopImg2.jpg',name:'白娘子',label:'問答小达人',follow:false,text:'哈哈闪电发货就是这么快',time:'06-20 23:01',zan:false,zanNumber:90,
                        zanedIconList:[
                            {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                            {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                            {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                        ],
                    },
                ],//总体内容


                commentList:[
                    {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg',name:'花伊人',label:'问答小丸子',text:'哈哈,来打我呀,傻逼',data:'06-20 23:01',zan:false,zanNumber:9},
                    {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg',name:'悟空',label:'问答幸运儿',text:'哈哈,来打我呀,傻逼',data:'06-20 23:01',zan:false,zanNumber:9},
                    {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg',name:'李会计',label:'问答小丸子',text:'哈哈,来打我呀,傻逼',data:'06-20 23:01',zan:false,zanNumber:9},
                    {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg',name:'李会计',label:'问答小丸子',text:'哈哈,来打我呀,傻逼',data:'06-20 23:01',zan:false,zanNumber:9},
                    {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg',name:'李会计',label:'问答小丸子',text:'哈哈,来打我呀,傻逼',data:'06-20 23:01',zan:false,zanNumber:9},
                    {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg',name:'李会计',label:'问答小丸子',text:'哈哈,来打我呀,傻逼',data:'06-20 23:01',zan:false,zanNumber:9},
                    {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg',name:'李会计',label:'问答小丸子',text:'哈哈,来打我呀,傻逼',data:'06-20 23:01',zan:false,zanNumber:9},
                    {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg',name:'李会计',label:'问答小丸子',text:'哈哈,来打我呀,傻逼',data:'06-20 23:01',zan:false,zanNumber:9},
                    {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg',name:'李会计',label:'问答小丸子',text:'哈哈,来打我呀,傻逼',data:'06-20 23:01',zan:false,zanNumber:9},
                    {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg',name:'李会计',label:'问答小丸子',text:'哈哈,来打我呀,傻逼',data:'06-20 23:01',zan:false,zanNumber:9},
                    {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg',name:'李会计',label:'问答小丸子',text:'哈哈,来打我呀,傻逼',data:'06-20 23:01',zan:false,zanNumber:9},
                    {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg',name:'李会计',label:'问答小丸子',text:'哈哈,来打我呀,傻逼',data:'06-20 23:01',zan:false,zanNumber:9},
                    {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg',name:'李会计',label:'问答小丸子',text:'哈哈,来打我呀,傻逼',data:'06-20 23:01',zan:false,zanNumber:9},
                    {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg',name:'李会计',label:'问答小丸子',text:'哈哈,来打我呀,傻逼',data:'06-20 23:01',zan:false,zanNumber:9},
                    {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg',name:'李会计',label:'问答小丸子',text:'哈哈,来打我呀,傻逼',data:'06-20 23:01',zan:false,zanNumber:9},
                    {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg',name:'李会计',label:'问答小丸子',text:'哈哈,来打我呀,傻逼',data:'06-20 23:01',zan:false,zanNumber:9},
                    {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg',name:'李会计',label:'问答小丸子',text:'哈哈,来打我呀,傻逼',data:'06-20 23:01',zan:false,zanNumber:9},
                    {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg',name:'李会计',label:'问答小丸子',text:'哈哈,来打我呀,傻逼',data:'06-20 23:01',zan:false,zanNumber:9},
                    {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg',name:'李会计',label:'问答小丸子',text:'哈哈,来打我呀,傻逼',data:'06-20 23:01',zan:false,zanNumber:9},
                ],//评论的内容

                //动画内容star
                animationOne:{styles: {

                        transform: 'rotate(10deg) scale(2.3, 2.3)',

                    },
                    duration: 30,
                    timingFunction: 'linear',
                    delay: 0
                },
                animationThree:{
                    styles: {

                        transform: 'rotate(-10deg) scale(2.3, 2.3)',

                    },
                    duration: 30, //ms
                    timingFunction: 'linear',
                    delay: 0 //ms
                },
                //动画内容end
            }
        },
        methods:{
            minibarLeftButtonClick(){},
            wxcMaskSetHidden(){
                this.reoprtDelShow=false;
            },
            blur(){
                this.messageBoard=false;
                this.buttomReoprt=true;
                this.blankLeft=750;
            },
            focus(){
                this.blankLeft=0;
            },
            confirmClick(){
                this.reoprtDelShow=false;
                this.commentList.splice(this.briding,1)
            },
            reportDelClick(index){
                this.reoprtDelShow=true;
                this.briding=index;
            },
            leavingClick(){
                if(this.messageText!=''){
                    this.$refs.inputMessage.blur();
                    if(this.judge==1){
                        this.commentList.unshift({img:'https://image.aftdc.com/images/packageA/shopImg2.jpg',name:this.myId,label:'問答小達人',text:this.messageText,data:'06-20 23:01',zan:false,zanNumber:0,judge:1,name2:this.commentList[this.briding].name})
                        this.messageText='';
                    }
                    else{
                        this.commentList.unshift({img:'https://image.aftdc.com/images/packageA/shopImg2.jpg',name:this.myId,label:'',text:this.messageText,data:'06-20 23:01',zan:false,zanNumber:0});
                        this.messageText='';
                    }
                    dom.scrollToElement(this.$refs.inputTest)
                }
            },
            reportClick(index){
                var that=this;

                if(this.commentList[index].name!=this.myId)
                {
                    that.buttomReoprt=false;
                    that.messageBoard=true;
                    setTimeout(function () {
                        that.$refs.inputMessage.focus();
                    },200);
                    that.judge=1;
                    that.briding=index;
                }
            },//文字点击

            blankClick(){
                this.$refs.inputMessage.blur();
            },
            hidebuttomReoprt(){
                var that=this;
                that.buttomReoprt=false;
                that.messageBoard=true;
                setTimeout(function () {
                    that.$refs.inputMessage.focus();
                },200);
                that.judge=2;
            },//回复面板点击.

            commentZanClick(index){
                if(this.commentList[index].zan){
                    this.commentList[index].zan=false;
                    this.commentList[index].zanNumber-=1;
                }
                else{
                    this.animation();
                    this.commentList[index].zan=true;
                    this.commentList[index].zanNumber+=1;
                }
            },
            zanClick(index){
                if(this.commentBigList[0].zan){
                    this.commentBigList[0].zan=false;
                    this.commentBigList[0].zanNumber-=1;
                }
                else{
                    this.animation();
                    this.commentBigList[0].zan=true;
                    this.commentBigList[0].zanNumber+=1;
                }

            },
            followClick(){
                if(this.commentBigList[0].follow){
                    this.commentBigList[0].follow=false;
                }
                else{
                    this.commentBigList[0].follow=true;
                }
            },
            animation(){
                var that=this;
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
                    animation.transition(testEl, that.animationOne,function () {
                        animation.transition(testEl, that.animationThree,function () {
                            animation.transition(testEl, that.animationOne,function () {
                                animation.transition(testEl, that.animationThree,function () {
                                    animation.transition(testEl, {
                                        styles: {
                                            opacity: 0,
                                            transform: 'scale(1, 1)',
                                        },
                                        duration: 240, //ms
                                        timingFunction: 'linear',
                                        delay: 0 //ms
                                    })
                                })
                            })
                        })
                    })
                })
            }
        },
        created() {
        },
    }
</script>

<style scoped>
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
    .contentRight{
        margin-left: 20px;
        width: 590px;
    }
    .commentLabel{
        color: #999;
    }
    .commentLabelDiv{
        flex: 1;
    }
    .contentTopLabel{
        margin-left: 10px;
        padding-left: 10px;
        color: #999;
        flex: 1;
        border-left-style: solid;
        border-left-width: 2px;
        border-left-color: #f1f1f1;
    }
    .commentTextTwo{
        width: 370px;
    }
    .box {
        width: 160px;
        height: 160px;
        opacity: 0;
        position: absolute;
        top: 500px;
        left: 300px;
        transform: scale(1)
    }
    .confirm{
        margin-left: 40px;
    }
    .cancel{
        color: #999;
    }
    .confirmCancel{
        flex-direction: row;
        align-items: center;
        margin-top: 100px;
    }
    .reoprtDelText{
        color: #999;
        margin-top: 40px;
    }
    .reoprtDelTitle{
    }
    .reoprtDel{
        padding: 40px;
    }
    .name2{
    }
    .delete{
        color: #999;
    }
    .huiufu{
    }
    .blank{
        position: absolute;
        top: 0;
        bottom: 0;
        width: 750px;
        background-color: rgba(0,0,0,0.4);
    }
    .messageBoardTwo{
        position: fixed;
        bottom: 0;
        background-color: #fff;
        width: 750px;
    }
    .messageBoardSendTwo{
        color: #53beb7;
    }
    .buttomReoprtShare{
        width: 40px;
        height: 40px;
        margin-left: 50px;
    }
    .buttomReoprtZan{
        width: 45px;
        height: 45px;
        margin-left: 50px;
    }
    .buttomReoprtText{
        color: #999;
        margin-left:15px;
    }
    .buttomReoprtIcon{
        width: 30px;
        height: 30px;
        margin-left: 30px;
    }
    .buttomReoprtTextDiv{
        flex-direction: row;
        align-items: center;
        width: 500px;
        height: 60px;
        background-color: #f1f1f1;
        border-radius: 30px;
    }
    .buttomReoprt{
        padding-top: 15px;
        padding-bottom: 15px;
        padding-left: 30px;
        padding-right: 30px;
        border-top-style: solid;
        border-top-width: 2px;
        border-top-color: #f1f1f1;
        flex-direction: row;
        align-items: center;
    }
    .comment{
        padding: 30px;
    }
    .commentTop{
        flex-direction: row;
        margin-top: 10px;
    }
    .commentText{
    }
    .zanedNumberText{
        color: #999;
    }
    .zanedNumberIcon{
        width: 35px;
        height: 35px;
    }
    .zanedNumber{
        flex-direction: row;
        align-items: center;
    }
    .zhanedsmallIcon{
        width: 15px;
        height: 15px;
        margin-left: 5px;
    }
    .zanedText{
    }
    .zanedDiv{
        flex: 1;
        flex-direction: row;
        align-items: center;
    }
    .zanIcon{
        width: 60px;
        height: 60px;
        border-radius: 50px;
    }
    .zanIconDiv{
        width: 60px;
        height: 60px;
        margin-right: 10px;
        border-radius: 50px;
    }
    .zaned{
        flex-direction: row;
        align-items: center;
        margin-top: 10px;
    }
    .report{
        flex: 1;
        color: #999;
    }
    .data{
        color: #999;
    }
    .dataReport{
        flex-direction: row;
        align-items: center;
        margin-top: 10px;
    }
    .contentText{
        width: 590px;
        line-height: 50px;
        margin-top: 25px;
    }
    .follow{
    }
    .contentTopUser{
    }
    .contentTopIcon{
        width: 70px;
        height: 70px;
        border-radius: 40px;
    }
    .scroller{
        width: 750px;
        flex: 1;
    }
    .contentTop{
        flex-direction: row;
        align-items: center;
        margin-top: 10px;
    }
    .content{
        padding: 30px;
        border-bottom-style: solid;
        border-bottom-width: 2px;
        border-bottom-color: #f1f1f1;
        flex-direction: row;
    }
</style>
