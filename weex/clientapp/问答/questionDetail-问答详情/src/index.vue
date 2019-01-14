<template>
    <div class="questionAnswer">

        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    v-once
            >
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">阿凡提问答</text>
            </wxc-minibar>
        </div>

        <scroller class="scroller">

                <!--标题区块-->
                <div class="queAns">

                    <!--标题,描述,图片-->
                    <div class="title" v-for="item in titleList">
                        <text class="titleText" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">{{item.title}}</text>
                        <div class="describeDiv" @click="describeOpenClick">
                            <text class="describe" :class="[DescribeOpen?'':'describeTwo']" :style="{fontSize:GLOBAL.defaultFS}">描述:{{item.describe}}</text>
                        </div>
                        <div class="imgDiv">
                            <image class="imgDivPicture" :src="itemTwo.img" v-for="(itemTwo,index) in item.picture" :key="index" :class="[(index+1)%3 == 0?'mr0':'']"></image>
                        </div>
                        <text class="feedbackNumber" :style="{fontSize:GLOBAL.smallFS}">{{item.answer}}个回答 · {{item.collection}}人收藏</text>
                    </div>

                    <!--收藏问题,邀请回答-->
                    <div class="collectionInvitation">
                        <div class="collection">
                            <image class="collectionIcon" src="https://image.aftdc.com/appBimg/ic_collection_normal.png"></image>
                            <text class="collectionText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">收藏问题</text>
                        </div>
                        <div class="invitation">
                            <image class="invitationIcon" src="https://image.aftdc.com/appBimg/ic_fans.png"></image>
                            <text class="invitationText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">邀请回答</text>
                        </div>
                    </div>
                </div>

                <!--回复区块-->
                <div class="reply" v-for="(item,index) in replyList" @click="toQuestionAnswerReply()" :key="index">
                    <div class="replyTop">
                        <div class="replyIcon">
                            <image class="replyIcon" :src="item.img"></image>
                        </div>
                        <div class="replyUserDiv">
                            <text class="replyUserName" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.name}}</text>
                            <text class="replyUserLabel" :style="{fontSize:GLOBAL.smallFS}">{{item.lable}}</text>
                        </div>
                        <text @click="followClick(index)" :style="{fontSize:GLOBAL.defaultFS,color:item.follow?'#999':GLOBAL.tColor}">{{item.follow?'已关注':'关注'}}</text>
                    </div>
                    <text class="replyText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.text}}</text>
                    <text class="fullText" :style="{fontSize:GLOBAL.defaultFS}">全文</text>
                    <text class="relayRead" :style="{fontSize:GLOBAL.smallFS}">{{item.read}}阅读</text>
                    <div class="forwardCommentFabulous">
                        <div class="forward">
                            <image class="forwardIcon" src="https://image.aftdc.com/appBimg/ic_equal.png"></image>
                            <text class="commentText" :style="{fontSize:GLOBAL.defaultFS}">转发</text>
                        </div>
                        <div class="comment">
                            <image class="commentIcon" src="https://image.aftdc.com/appBimg/ic_contact.png"></image>
                            <text class="commentText" :style="{fontSize:GLOBAL.defaultFS}">评论</text>
                        </div>
                        <div class="zanNumber" @click="zanClick(index)">
                            <image class="zanIcon" :src="item.zan?'https://image.aftdc.com/images/zhan.png':'https://image.aftdc.com/images/nozhan.png'"></image>
                            <text class="zanText" :class="[item.zan?'zanTextTwo':'']" :style="{fontSize:GLOBAL.defaultFS}">{{item.zanNumber}}</text>
                        </div>
                    </div>
                </div>
        </scroller>

        <!--更多回答-->
        <div class="myAnswer">
            <div class="moreAnswer">
                <image class="moreAnswerIcon" src="https://image.aftdc.com/appBimg/icon_tab_management_normal.jpg"></image>
                <text class="moreAnswerText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">更多回答</text>
            </div>
            <text class="answerText" @click="popAnswerBox" :style="{fontSize:GLOBAL.bigFS}">回答</text>
        </div>
        <!--点赞动画的image-->
        <image class="bigZhan" ref="test" src="https://image.aftdc.com/images/zhan.png"></image>

        <!--点击回答弹出层-->
        <div class="answerBox" @click.stop="" ref="answerBox">
            <div class="answerBoxHead row aiCenter">
                <text class="fanswerBoxFont gray" @click="closeAnswerBox" :style="{fontSize:GLOBAL.bigFS}">取消</text>
                <text class="fanswerBoxFont blue" :style="{fontSize:GLOBAL.bigFS}">图文</text>
                <text class="fanswerBoxFont gray" :class="[answerTextarea.length >= 1?'themeColor':'']" @click="releaseAnswer" :style="{fontSize:GLOBAL.bigFS}">发布</text>
            </div>
            <scroller  show-scrollbar="false" >
                <textarea class="answerTextarea" name="answer" placeholder="分享你的真实观点和经验" rows="12" v-model="answerTextarea" ref="textareaMessage" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}"></textarea>
                <div class="answerAddImgBox">
                    <div class="answerAddImg row">
                        <div class="mrb12" v-for="(item,index) in answerBoxImg" :class="[(index+1)%3 == 0?'mr0':'']">
                            <image class="answerImg" :src="item"></image>
                            <div class="gradualChange"></div>
                            <div class="closeAnswerImgBg aiCenter jcCenter"  @click="closeAnswerImg(index)">
                                <image class="closeAnswerImg" src="http://chuantu.biz/t6/338/1530781439x-1404755534.png"></image>
                            </div>
                        </div>
                        <div class="addImg">
                            <div class="transverse"></div>
                            <div class="vertical"></div>
                        </div>
                    </div>
                </div>
            </scroller>
        </div>

        <!--确认退出并保存草稿-->
        <wxc-mask height="230"
                  width="600"
                  border-radius="15"
                  duration="200"
                  mask-bg-color="#FFFFFF"
                  :has-animation="true"
                  :has-overlay="true"
                  :show-close="false"
                  :show="draftShow"
                  @wxcMaskSetHidden="wxcMaskSetHidden">
            <div class="draftContent">
                <text class="draftContentText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor}">确认退出并保存草稿?</text>
                <div class="draftContentDiv">
                    <text style="flex: 1;"></text>
                    <text class="draftCancel gray" @click="draftCancelClick" :style="{fontSize:GLOBAL.defaultFS}">取消</text>
                    <text class="draftCancel" @click="draftconfirmClick" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}">确认</text>
                </div>
            </div>
        </wxc-mask>
    </div>
</template>

<script>
    import {WxcMask, WxcMinibar, WxcPopup} from 'weex-ui';

    const animation = weex.requireModule('animation')
    const modal = weex.requireModule('modal')
    const dom = weex.requireModule('dom')
    const event=weex.requireModule('event')
    export default {
        components: {WxcMask, WxcMinibar, WxcPopup},
        name: 'App',
        data() {
            return {
                DescribeOpen:false,
                screenHeight:'',
                answerInputText:'',
                answerTextarea: '', // 监听回答框字符串
                titleList:[
                    {
                        title:'刚应届毕业,这两天被社会打击了,大家有哪些经验可以传授给我?',describe:'林子大了什么鸟都有,刚应届毕业出来找工作.这两天的经理真可谓时丰富多彩(你们懂的).想问问大哥大姐有什么好建议,塔斯给die',
                        picture:[
                            {img:'https://image.aftdc.com/appBimg/ic_app_logo.jpg'},
                            {img:'https://image.aftdc.com/appBimg/ic_app_logo.jpg'},
                            {img:'https://image.aftdc.com/appBimg/ic_app_logo.jpg'},
                            {img:'https://image.aftdc.com/appBimg/ic_app_logo.jpg'},
                            ],
                        answer:10,collection:2,
                    },
                ],//提问
                replyList:[
                    {img:'https://image.aftdc.com/appBimg/ic_app_logo.jpg',name:'老谢,老余麻瓜吧',lable:'',follow:false,read:12,zan:false,zanNumber:2,text:'对方是否是否撒旦法撒旦法阿斯蒂芬第三方撒旦法第三方士大夫撒旦法撒旦法撒旦法撒旦法萨达发顺丰对方是否是否撒旦法撒旦法阿斯蒂芬第三方撒旦法第三方士大夫撒旦法撒旦法撒旦法撒旦法萨达发顺丰对方是否是否撒旦法撒旦法阿斯蒂芬第三方撒旦法第三方士大夫撒旦法撒旦法撒旦法撒旦法萨达发顺丰对方是否是否撒旦法撒旦法阿斯蒂芬第三方撒旦法第三方士大夫撒旦法撒旦法撒旦法撒旦法萨达发顺丰对方是否是否撒旦法撒旦',},
                    {img:'https://image.aftdc.com/appBimg/ic_app_logo.jpg',name:'老谢,老余麻瓜吧',lable:'娱乐问答达人',follow:false,read:12,zan:false,zanNumber:2000,text:'对方是否是否撒旦法撒旦法阿斯蒂芬第三方撒旦法第三方士大夫撒旦法撒旦法撒旦法撒旦法萨达发顺丰对方是否是否撒旦法撒旦法阿斯蒂芬第三方撒旦法第三方士大夫撒旦法撒旦法撒旦法撒旦法萨达发顺丰对方是否是否撒旦法撒旦法阿斯蒂芬第三方撒旦法第三方士大夫撒旦法撒旦法撒旦法撒旦法萨达发顺丰对方是否是否撒旦法撒旦法阿斯蒂芬第三方撒旦法第三方士大夫撒旦法撒旦法撒旦法撒旦法萨达发顺丰对方是否是否撒旦法撒旦法阿斯蒂芬第三方撒旦法第三方士大夫撒旦法撒旦法撒旦法撒旦法萨达发顺丰',},
                    {img:'https://image.aftdc.com/appBimg/ic_app_logo.jpg',name:'老谢,老余麻瓜吧',lable:'娱乐问答达人',follow:false,read:12,zan:false,zanNumber:20,text:'对方是否是否撒旦法撒旦法阿斯蒂芬第三方撒旦法第三方士大夫撒旦法撒旦法撒旦法撒旦法萨达发顺丰对方是否是否撒旦法撒旦法阿斯蒂芬第三方撒旦法第三方士大夫撒旦法撒旦法撒旦法撒旦法萨达发顺丰对方是否是否撒旦法撒旦法阿斯蒂芬第三方撒旦法第三方士大夫撒旦法撒旦法撒旦法撒旦法萨达发顺丰对方是否是否撒旦法撒旦法阿斯蒂芬第三方撒旦法第三方士大夫撒旦法撒旦法撒旦法撒旦法萨达发顺丰对方是否是否撒旦法撒旦法阿斯蒂芬第三方撒旦法第三方士大夫撒旦法撒旦法撒旦法撒旦法萨达发顺丰',},
                    {img:'https://image.aftdc.com/appBimg/ic_app_logo.jpg',name:'老谢,老余麻瓜吧',lable:'娱乐问答达人',follow:false,read:12,zan:false,zanNumber:60,text:'对方是否是否撒旦法撒旦法阿斯蒂芬第三方撒旦法第三方士大夫撒旦法撒旦法撒旦法撒旦法萨达发顺丰对方是否是否撒旦法撒旦法阿斯蒂芬第三方撒旦法第三方士大夫撒旦法撒旦法撒旦法撒旦法萨达发顺丰对方是否是否撒旦法撒旦法阿斯蒂芬第三方撒旦法第三方士大夫撒旦法撒旦法撒旦法撒旦法萨达发顺丰对方是否是否撒旦法撒旦法阿斯蒂芬第三方撒旦法第三方士大夫撒旦法撒旦法撒旦法撒旦法萨达发顺丰对方是否是否撒旦法撒旦法阿斯蒂芬第三方撒旦法第三方士大夫撒旦法撒旦法撒旦法撒旦法萨达发顺丰',},
                    {img:'https://image.aftdc.com/appBimg/ic_app_logo.jpg',name:'老谢,老余麻瓜吧',lable:'娱乐问答达人',follow:false,read:12,zan:false,zanNumber:666,text:'对方是否是否撒旦法撒旦法阿斯蒂芬第三方撒旦法第三方士大夫撒旦法撒旦法撒旦法撒旦法萨达发顺丰对方是否是否撒旦法撒旦法阿斯蒂芬第三方撒旦法第三方士大夫撒旦法撒旦法撒旦法撒旦法萨达发顺丰对方是否是否撒旦法撒旦法阿斯蒂芬第三方撒旦法第三方士大夫撒旦法撒旦法撒旦法撒旦法萨达发顺丰对方是否是否撒旦法撒旦法阿斯蒂芬第三方撒旦法第三方士大夫撒旦法撒旦法撒旦法撒旦法萨达发顺丰对方是否是否撒旦法撒旦法阿斯蒂芬第三方撒旦法第三方士大夫撒旦法撒旦法撒旦法撒旦法萨达发顺丰',},
                ],//回答
                draftShow:false,

                // 回答框图片
                answerBoxImg: [
                    "https://img2.woyaogexing.com/2018/07/03/377a8e3aab6e9389!400x400_big.jpg",
                    "http://img3.duitang.com/uploads/item/201410/20/20141020063514_XMQrF.jpeg",
                    "https://img2.woyaogexing.com/2018/07/05/db62fe53f33b1ee7!480x480.jpg",
                    "https://img2.woyaogexing.com/2018/07/04/ebf6eba3b4794b3a96df0a61ed0e2993!400x400.jpeg",
                    "https://img2.woyaogexing.com/2018/07/04/529c90284209cf7c!400x400_big.jpg"
                ],
                //点赞动画
                rotateRight:{styles: {

                        transform: 'rotate(10deg) scale(2.3, 2.3)',

                    },
                    duration: 30,
                    timingFunction: 'linear',
                    delay: 0
                },
                rotateLeft:{
                    styles: {

                        transform: 'rotate(-10deg) scale(2.3, 2.3)',

                    },
                    duration: 30, //ms
                    timingFunction: 'linear',
                    delay: 0 //ms
                },
            }
        },
        created() {
            this.screenHeight=this.$getConfig().env.deviceHeight
            console.log(this.screenHeight)
        },
        methods: {
            minibarLeftButtonClick(){},
            draftconfirmClick(){
                this.draftShow=false;
                var answerBox = this.$refs.answerBox;
                animation.transition(answerBox, {
                    styles: {
                        transform: 'translateY(1600px)'
                    },
                    duration: 500, //ms
                    timingFunction: 'ease-in',
                    delay: 0 //ms
                })
            },
            draftCancelClick(){
                this.draftShow=false;
            },
            demoCancelClick(){
                if(this.answerInputText==''){
                    this.$refs.textarea.blur();
                    this.move2();
                }
                else{
                    this.$refs.textarea.blur();
                    this.draftShow=true;
                }
            },
            wxcMaskSetHidden(){
                this.draftShow=false;
            },
            zanClick(index){
                var that=this;
                if(this.replyList[index].zan){
                    this.replyList[index].zan=false;
                    this.replyList[index].zanNumber-=1;
                }
                else{
                    this.replyList[index].zan=true;
                    this.replyList[index].zanNumber+=1;

                    // 点赞动画
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
                            animation.transition(testEl, that.rotateLeft,function () {
                                animation.transition(testEl, that.rotateRight,function () {
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
                    });

                }
            },//点赞
            followClick(index){
                if(this.replyList[index].follow){
                    this.replyList[index].follow=false;
                }
                else{
                    this.replyList[index].follow=true;
                }
            },//关注
            describeOpenClick(){
                this.DescribeOpen=true;
            },//展开描述

            move() {
                var testEl = this.$refs.anim;
                animation.transition(testEl, {
                    styles: {
                        color: '#fff',
                        transform: 'translate(-750px,0px)',
                    },
                    duration: 400, //ms
                    timingFunction: 'linear',
                    delay: 0 //ms
                })
            },//右侧弹出层动画
            move2() {
                var testEl = this.$refs.anim;
                animation.transition(testEl, {
                    styles: {
                        color: '#fff',
                        transform: 'translate(750px,0px)',
                    },
                    duration: 400, //ms
                    timingFunction: 'linear',
                    delay: 0 //ms
                })
            },//右侧弹出层动画
            // 弹出回答框
            popAnswerBox(){
                var answerBox = this.$refs.answerBox;
                animation.transition(answerBox, {
                    styles: {
                        transform: 'translateY(0)'
                    },
                    duration: 500, //ms
                    timingFunction: 'ease-in',
                    delay: 0 //ms
                })
            },
            // 关闭回答框
            closeAnswerBox(){
                if(this.answerTextarea!=''){
                    this.draftShow=true;
                }
                else{
                    var answerBox = this.$refs.answerBox;
                    animation.transition(answerBox, {
                        styles: {
                            transform: 'translateY(1600px)'
                        },
                        duration: 500, //ms
                        timingFunction: 'ease-in',
                        delay: 0 //ms
                    })
                }
                this.$refs.textareaMessage.blur();
            },
            // 回答框图片删除关闭
            closeAnswerImg(index){
                this.answerBoxImg.splice(index,1)
            },
            toQuestionAnswerReply(){
                var param='';
                var url='http://assets/questionAnswerReply.js';
                event.toUrl({"url":url,"param":param})
            },
        },

    }
</script>

<style scoped>
    /*默认*/
    .minibar {
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: #f1f1f1;
    }
    .backImg {
        width: 40px;
        height: 40px;
    }
    .mr0 {
        margin-right: 0;
    }

    /*普通*/
    .black {
        color: #181818;
    }
    .white {
        color: #fff;
    }
    .gray {
        color: #999;
    }
    .blue {
        color: #4f71a1;
    }
    .red {
        color: #f85959;
    }
    .lightBlue {
        color: #0b7dd9;
    }
    .themeColor {
        color: #53beb7;
    }
    .row {
        flex-direction: row;
    }
    .jcCenter {
        justify-content: center;
    }
    .aiCenter {
        align-items: center;
    }
    .draftCancel{
        padding: 30px;
        margin-top: 40px;
    }
    .draftContentDiv{
        flex-direction: row;
        align-items: center;
    }
    .draftContentText{
        margin-left: 40px;
        margin-top: 40px;
    }
    .answerText{
        height: 90px;
        line-height: 90px;
        padding-left: 80px;
        padding-right: 80px;
        color: #fff;
        background-color: #53beb7;
    }
    .moreAnswerText{
        margin-left: 10px;
    }
    .moreAnswerIcon{
        width: 35px;
        height: 35px;
        margin-left: 30px;
    }
    .moreAnswer{
        height: 90px;
        flex-direction: row;
        align-items: center;
        flex: 1;
    }
    .myAnswer{
        flex-direction: row;
        align-items: center;
        border-top-style: solid;
        border-top-width: 2px;
        border-top-color: #f1f1f1;
        width: 750px;
        background-color: #fff;
    }
    .bigZhan{
        width: 160px;
        height: 160px;
        opacity: 0;
        position: absolute;
        top: 500px;
        left: 300px;
    }
    .zanTextTwo{
        color: #53beb7;
    }
    .zanText{
        color: #999;
        margin-left: 10px;
    }
    .zanIcon{
        width: 40px;
        height: 40px;
    }
    .zanNumber{
        flex-direction: row;
        align-items: center;
        flex: 1;
        justify-content: flex-end;
    }
    .commentText{
        margin-left: 10px;
        color: #999;
    }
    .commentIcon{
        width: 40px;
        height: 40px;
    }
    .comment{
        flex-direction: row;
        align-items: center;
    }
    .forwardIcon{
        width: 30px;
        height: 30px;
    }
    .forward{
        flex-direction: row;
        align-items: center;
        flex: 1;
    }
    .forwardCommentFabulous{
        margin-top: 20px;
        padding-left: 80px;
        padding-right: 80px;
        flex-direction: row;
        align-items: center;
    }
    .relayRead{
        color: #999;
        margin-top: 10px;
        margin-left: 80px;
    }
    .fullText{
        color: #488ff3;
        margin-top: 10px;
        margin-left: 80px;
    }
    .replyText{
        margin-top: 20px;
        margin-left: 80px;
        lines:6;
        text-overflow: ellipsis;
    }
    .replyUserLabel{
        color: #999;
        margin-top: 10px;
    }
    .replyUserName{
        font-weight: bold;
    }
    .replyUserDiv{
        margin-left: 20px;
        flex: 1;
    }
    .replyIcon{
        width: 60px;
        height:60px;
        border-radius: 100px;
    }
    .replyTop{
        flex-direction: row;
        align-items: center;
    }
    .reply{
        margin-top: 10px;
        padding-top: 30px;
        padding-left: 30px;
        padding-right: 30px;
        padding-bottom: 30px;
        background-color: #fff;
        width: 750px;
    }
    .scroller{
        width: 750px;
        flex: 1;
        background-color: #f1f1f1;
    }
    .queAns{
        background-color: #fff;
        width: 750px;
    }
    .invitationText{
        margin-left: 10px;
    }
    .collectionText{
        margin-left: 5px;
    }
    .invitationIcon{
        width: 32px;
        height: 32px;
    }
    .collectionIcon{
        width: 40px;
        height: 40px;
    }
    .invitation{
        width: 375px;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }
    .collection{
        width: 375px;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        border-right-style: solid;
        border-right-width: 2px;
        border-right-color: #f1f1f1;
    }
    .collectionInvitation{
        flex-direction: row;
        align-items: center;
        padding-top: 20px;
        padding-bottom: 20px;
    }
    .feedbackNumber{
        color: #999;
        margin-top: 20px;
    }
    .imgDivPicture{
        width: 222px;/*固定*/
        height: 222px;
        margin-right: 11px;
        margin-top: 11px;

    }
    .imgDiv{
        flex-direction: row;
        align-items: center;
        flex-wrap: wrap;
        margin-top: 20px;
    }
    .describeOpen{
        font-size: 32px;
        color: #488ff3;
    }
    .describeTwo{
        lines:1;
        text-overflow: ellipsis;
    }
    .describe{
        color: #999;
        width: 690px;
    }
    .describeDiv{
        flex-direction: row;
        align-items: center;
        margin-top: 20px;
    }
    .titleText{
        font-weight: bold;
        width: 690px;
    }
    .title{
        padding-top: 30px;
        padding-left: 30px;
        padding-right: 30px;
        padding-bottom: 30px;
        border-bottom-style: solid;
        border-bottom-color: #f1f1f1;
        border-bottom-width: 2px;
    }
    .questionAnswer{
        background-color: #f1f1f1;
    }
    /* 回答框 */
    .answerBox {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #fff;
        padding-top: 42px;
        padding-left: 28px;
        padding-right: 28px;
        transform: translateY(1600px);
    }
    .answerBoxHead {
        justify-content: space-between;
        padding-bottom: 40px;
    }
    .fanswerBoxFont {
        font-weight: 500;
    }
    .answerTextarea {
        margin-left: 3px;
        margin-right: 3px;
        margin-bottom: 50px;
    }
    .answerAddImgBox {
        padding-bottom: 40px;
    }
    .answerAddImg {
        flex-wrap: wrap;
    }
    .answerImg {
        width: 223px;
        height: 223px;
    }
    .mrb12 {
        margin-right: 12px;
        margin-bottom: 12px;
    }
    .mr0 {
        margin-right: 0;
    }
    .addImg {
        width: 223px;
        height: 223px;
        background-color: #f4f5f6;
    }
    .transverse {
        position: absolute;
        width: 77px;
        height: 5px;
        background-color: #d8d8d8;
        top: 109px;
        left: 74px;
    }
    .vertical {
        width: 5px;
        height: 76px;
        background-color: #d8d8d8;
        top: 74px;
        left: 109px;
    }
    .gradualChange {
        height: 100px;
        width: 223px;
        position: absolute;
        top: 0;
        left: 0;
        background-image: linear-gradient(to bottom,rgba(171,171,171,0.8),rgba(171,171,171,0));

    }
    .closeAnswerImgBg {
        position: absolute;
        /*right: 12px;*/
        /*top: 12px;*/
        right: 0;
        top: 0;
        width: 42px;
        height: 42px;
    }
    .closeAnswerImg {
        width: 18px;
        height: 18px;

    }
</style>
