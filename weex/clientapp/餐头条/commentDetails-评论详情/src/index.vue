<template>
    <div class="reply"  @touchstart="blurClick">

        <wxc-minibar
                background-color="#53beb7"
                text-color="#fff"
                @wxcMinibarLeftButtonClicked="minibarLeftButtonClick">
            <image :style="GLOBAL.headerImg"  slot="left"
                   src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
            <text :style="GLOBAL.headerCenter"  slot="middle">{{comment.reply_num > 0 ? comment.reply_num + '条回复' : '暂无回复'}}</text>
        </wxc-minibar>

        <scroller class="scroller" show-scrollbar="false">
            <div class="mySelected line">
                <div class="row aiCenter jcSb" @click="toPersonalHomePage(comment.userId,comment.aId)">
                    <div class="row aiCenter">
                        <div style="border-radius: 40px">
                            <image class="mySelectedIcon" :src="comment.userPhoto"></image>
                        </div>
                        <text class="userName" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor}">{{comment.userName}}</text>
                    </div>
                    <div class="row aiCenter" @click="commentFabulous(comment,0)">
                        <image class="zhanIcon" :src="'https://image.aftdc.com/images/'+(comment.isPraise==1?'zhan.png':'nozhan.png')"></image>
                        <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{comment.praise_num==0?'赞':comment.praise_num}}</text>
                    </div>
                </div>
                <div class="center">
                    <text class="centerText" :style="{fontSize:'30px',color:GLOBAL.dColor}">{{comment.content}}</text>
                </div>
                <div class="buttom aiCenter">
                    <text :style="{fontSize:'22px',color:GLOBAL.dColor}">{{comment.timestamp}}</text>
                    <text :style="{fontSize:'22px',color:GLOBAL.dColor}">&nbsp;·&nbsp;</text>
                    <text class="report" :style="{fontSize:'22px',color:GLOBAL.dColor}" @click="delMaskShow(-1)" v-if="comment.userId === userId">删除</text>
                    <text class="report" :style="{fontSize:'22px',color:GLOBAL.dColor}" @click="showReport" v-else>举报</text>
                </div>
            </div>
            <div ref="comment">
                <text class="allText" :style="{fontSize:'30px',color:GLOBAL.dColor}" v-if="reply.length > 0">全部评论</text>
                <text class="preemptionText" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}" v-else>抢先评论</text>
            </div>

            <div class="mySelected" v-for="(item,index) in reply"  :key="" @click="leavingClick(index)">
                <div class="row aiCenter jcSb" @click="toPersonalHomePage(item.userId,item.aId)">
                    <div class="row aiCenter">
                        <div style="border-radius: 40px">
                            <image class="mySelectedIcon" :src="item.userPhoto"></image>
                        </div>
                        <text class="userName" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor}">{{item.userName}}</text>
                    </div>
                    <div class="row aiCenter" @click="commentFabulous(item,1)">
                        <image class="zhanIcon" :src="'https://image.aftdc.com/images/'+(item.isPraise==1?'zhan.png':'nozhan.png')"></image>
                        <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.praise_num==0?'赞':item.praise_num}}</text>
                    </div>
                </div>
                <div class="center">
                    <text class="centerText" :style="{fontSize:'30px',color:GLOBAL.dColor}">{{item.content}}</text>
                    <div v-if="item.replyInfo && item.replyInfo!==''">
                        <text class="userNameClick" @click="toPersonalHomePage(item.replyInfo.userId,item.replyInfo.aId)">@{{item.replyInfo.userName}}</text>
                        <wxc-special-rich-text :config-list="richText[index].specialConfigList"></wxc-special-rich-text>
                    </div>
                </div>
                <div class="buttom aiCenter">
                    <text :style="{fontSize:'22px',color:GLOBAL.dColor}">{{item.timestamp}}</text>
                    <text :style="{fontSize:'22px',color:GLOBAL.dColor}">&nbsp;·&nbsp;</text>
                    <text class="report" :style="{fontSize:'22px',color:GLOBAL.dColor}">回复</text>
                    <text class="delectPl" :style="{fontSize:'22px',color:GLOBAL.dColor}" @click="delMaskShow(index)" v-if="item.userId === userId">删除</text>
                </div>
            </div>
            <div class="row aiCenter" v-if="commentNothing && reply.length > 19">
                <div class="nothingLine"></div>
                <text class="commentNothing" :style="{fontSize:GLOBAL.bigFS}">没有更多了</text>
                <div class="nothingLine"></div>
            </div>
            <loading class="loading" @loading="loadmore" :display="loadinging ? 'show' : 'hide'" v-if="reply.length > 19 && !commentNothing">
                <text :style="{fontSize:GLOBAL.bigFS,color: '#888888',lineHeight:'132px'}" >加载中...</text>
            </loading>
        </scroller>

        <!--底部评论框-->
        <div style="position: fixed;bottom: 0;left: 0;right: 0" @click.stop="">
            <div class="messageBoard" v-if="!inputBoard">
                <div class="leavingMessageDiv row aiCenter" @click="leavingClick(-1)">
                    <image class="leavingMessageIcon" src="https://image.aftdc.com/appBimg/icon_leaveWord.png"></image>
                    <text class="leavingMessage" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">回复</text>
                </div>
            </div>
            <div class="messageBoardTwo row aiCenter" v-if="inputBoard">
                <div class="commentInputBg" >
                    <div class="grayBg"></div>
                    <input class="commentInput" type="text" placeholder="请认真评论" ref="inputMessage" maxlength="200" v-model="messageText"  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">
                </div>
                <text class="releaseBtn " :class="[messageText!==''?'releaseColor':'']" @click="sendClick" :style="{fontSize:GLOBAL.biggerFS}">发布</text>
            </div>
        </div>

        <!--删除弹出层-->
        <wxc-mask height="260"
                  width="550"
                  border-radius="5"
                  duration="200"
                  mask-bg-color="#FFFFFF"
                  :has-animation="true"
                  :has-overlay="true"
                  :show-close="false"
                  :show="delShow"
                  @wxcMaskSetHidden="delMaskHidden">
            <div class="delBox" @click.stop="preventBubbles" >
                <div class="delText aiCenter jcCenter" >
                    <text class="delTips" :style="{fontSize:GLOBAL.bigFS}">确认删除此评论？</text>
                </div>
                <div class="delBtn row">
                    <text class="flex1 delCancel" :style="{fontSize:GLOBAL.bigFS}" @click="delMaskHidden">取消</text>
                    <text class="flex1" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor}" @click="deleteComment">确认</text>
                </div>
            </div>
        </wxc-mask>


        <!--举报弹层-->
        <wxc-popup popup-color="rgb(255, 255, 255)"
                   :show="isBottomShow"
                   @wxcPopupOverlayClicked="popupOverlayBottomClick"
                   pos="bottom"
                   ref="wxcPopup"
                   height="670">
            <div class="demo-content">
                <text class="completeBtn" :style="{color:GLOBAL.dColor}" @click="reportArticle(1)">完成</text>
                <div class="reportOption row jcSb aiCenter"  @click="otherChecked">
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">我有话要说</text>
                    <image class="arrowIcon" src="https://image.aftdc.com/appBimg/ic_expanded_down.jpg" ></image>
                </div>
                <div class="reportOption row jcSb aiCenter" v-for="(item,index) in reportOption" @click="reportChecked(index)">
                    <text :style="{fontSize:GLOBAL.bigFS,color:item.check?'#b5b5b5':GLOBAL.dColor}">{{item.check?'已举报 ':''}}{{item.text}}</text>
                    <text class="reportRight" v-if="item.check">撤销</text>
                </div>
                <div class="reportTitle aiCenter jcCenter">
                    <text class="reportTitleText" :style="{color:GLOBAL.dColor}">举报</text>
                </div>
            </div>
        </wxc-popup>
        <wxc-popup popup-color="rgb(255, 255, 255)"
                   :show="reportTextarea"
                   @wxcPopupOverlayClicked="popupReportTextareaClick"
                   pos="bottom"
                   ref="reportTextarea"
                   height="370">
            <div class="textareaBox">
                <div class="tbHeader row aiCenter">
                    <div class="row aiCenter tbFlex1">
                        <image class="arrowIcon tran90" src="https://image.aftdc.com/appBimg/ic_expanded_down.jpg"></image>
                        <text :style="{fontSize:'30px',color:GLOBAL.dColor}" @click="returnReport">返回</text>
                    </div>
                    <text class="tbTitle tbFlex1" :style="{color:GLOBAL.dColor}">我要吐槽</text>
                    <text class="tbFlex1"></text>
                </div>
                <div class="tbMain">
                    <textarea class="textarea" name="" ref="textarea" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}" placeholder="请具体说明问题，我们将尽快处理" maxlength="200" v-model="textareaText" cols="30" rows="3"></textarea>
                </div>
                <div class="tbfooter aiCenter">
                    <text class="tbBtn"  :style="{fontSize:GLOBAL.bigFS,backgroundColor:textareaText.length > 0?GLOBAL.tColor:'#d3d3d3'}" @click="reportArticle(0)">完成</text>
                </div>
            </div>
        </wxc-popup>
        <!--点赞动画图片-->
        <image class="bigZhan" ref="test" src="https://image.aftdc.com/images/zan.png"></image>
        <!--信息提示-->
        <toast ref="toast"></toast>
    </div>
</template>

<script>
    import {WxcMask, WxcMinibar, WxcPopup,WxcSpecialRichText} from 'weex-ui';
    const GLOBAL = require('@/Global.vue');
    import Toast from './Toast.vue'
    const animation = weex.requireModule('animation')
    const navigator = weex.requireModule('navigator');
    const dom = weex.requireModule('dom')
    const post = weex.requireModule('stream');
    const event = weex.requireModule('event');
    export default {
        components: {WxcMask, WxcMinibar, WxcPopup,Toast,WxcSpecialRichText},
        name: 'App',
        data() {
            return{

                aId: 0,
                id: 0,
                userId: 0,
                token: '',
                imei: '',
                userName: '',
                userPhoto: '',

                commentNothing: false, //没有更回复
                loadinging: false, //上拉加载
                replyIndex: 0, // -1为评论 其他为回复
                commentIndex: 0, // 点击回复或评论的下标 -1为评论 其他为回复
                delShow: false, // 评论或删除弹出层
                inputBoard:false,//请留言的点击隐藏显示
                messageText:'',//;留言内容
                reply: [],
                comment: {},
                textareaText: '', //吐槽输入框文本
                reportTextarea: false, //吐槽弹层
                isBottomShow: false, //举报弹层
                reportOption: [ //举报选项
                    {text:'恶意攻击谩骂',check: false},
                    {text:'营销广告',check: false},
                    {text:'违法信息',check: false},
                    {text:'淫秽色情',check: false}
                ],
                rotateRight:{ //点赞动画
                    styles: {
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
                richText: []
            }
        },
        created(){
            this.token = weex.config.token;
            this.imei = weex.config.imei;
            this.userId = weex.config.userId
            this.id= JSON.parse(weex.config.param).articleId
            this.userName=weex.config.userName
            this.userPhoto = weex.config.userPhoto;
            this.aId = event.find('acticleAccount');

            // this.aId = 10000021
            // this.id = 767
            // this.userId = 46
            // this.token = 'fefs'
            // this.imei = 'fefse'
            // this.userName = '【仵夜の風】'
            // this.userPhoto ='http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTIGad4UtSm2Jjk8Z9lfdfmRZs22n2PFYr19a2iaYofpMtpqPISLNyTvfEDBuicXB6iaWLmnK0icibhZeCw/132'

            this.getZP(0)
        },
        methods:{

            loadmore() { //上拉加载
                this.loadinging = true
                setTimeout(() => {
                    this.loadinging = false
                }, 2000)
                this.getZP(this.reply.length)
            },

            delMaskShow(index) { //显示删除评论弹层
                this.delShow = true
                this.commentIndex = index
            },
            delMaskHidden() { //隐藏删除评论弹层
                this.delShow = false
            },
            deleteComment:GLOBAL.throttle(function() { //删除评论或回复
                var that = this
                const toast=that.$refs.toast;
                var url = null
                var param = that.GLOBAL.sign(this.token,this.imei);
                if(that.commentIndex === -1) {
                    param += '&id=' + that.comment.id
                    url = 'https://www.aftdc.com/userapp/Article/deleteComment'
                }else {
                    param += '&id=' + that.reply[that.commentIndex].id
                    url = 'https://www.aftdc.com/userapp/Article/delZP'
                }
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: url,
                }, function (res) {
                    that.delShow = false
                    if(res.data.res === 1) {
                        if(that.commentIndex === -1) {
                            setTimeout(()=>navigator.pop({ animated: 'true' }),1000);
                        }else {
                            that.reply.splice(that.commentIndex,1)
                            that.richText.splice(that.commentIndex,1)
                        }
                        that.comment.reply_num--
                    }else if(res.data.res === -2) {
                        that.toLogin()
                    }
                    toast.editContent(res.data.info);
                });
            }),
            getZP(page) { //获取全部回复
                var that = this
                var param = 'id=' + that.id
                param += '&userId=' + that.userId
                param += '&page=' + page
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: 'https://www.aftdc.com/userapp/Article/getZP',
                }, function (res) {
                    if(res.data.res === 1) {
                        var zpInfo = res.data.data.zpInfo
                        if(page === 0) {
                            that.comment = res.data.data.appraiseInfo
                            that.reply = zpInfo
                        }else {
                            that.reply = that.reply.concat(zpInfo)
                        }
                        for(var i in zpInfo) { //添加富文本
                            if(zpInfo[i].replyInfo !== '') {
                                that.addRichText(zpInfo[i].replyInfo.userName,zpInfo[i].replyInfo.content,0)
                            }else {
                                that.addRichText('','',0)
                            }
                        }
                        if(zpInfo.length !== 20) {
                            that.commentNothing = true
                        }
                    }else if (res.data.res === 0) {
                        that.commentNothing = true
                    }
                })
            },
            addRichText(userName,content,type){ // 添加富文本数据
                var that=this;
                if(type === 0) {
                    that.richText.push({
                        specialConfigList:[
                            {
                                type: 'tag',
                                value: '@'+userName,
                                style: {
                                    fontSize: 30,
                                    color: '#53beb7',
                                    borderWidth:'0'
                                }
                            },
                            {
                                type: 'text',
                                value: content,
                                theme: 'black',
                                style: {
                                    fontSize: 30,
                                    color:'#666',
                                    lines:100,
                                }
                            }
                        ],
                    })
                }else {
                    that.richText.unshift({
                        specialConfigList:[
                            {
                                type: 'tag',
                                value: '@'+userName,
                                style: {
                                    fontSize: 30,
                                    color: '#53beb7',
                                    borderWidth:'0'
                                }
                            },
                            {
                                type: 'text',
                                value: content,
                                theme: 'black',
                                style: {
                                    fontSize: 30,
                                    color:'#666',
                                    lines:100,
                                }
                            }
                        ],
                    })
                }
            },
            blurClick:GLOBAL.throttle(function() {
                var that=this
                if(that.inputBoard) {
                    that.$refs.inputMessage.blur()//点击其他时键盘失去焦点
                    setTimeout(function () {
                        that.inputBoard=false;
                    },100)
                }
            }),
            sendClick:GLOBAL.throttle(function() { //发布回复与评论回复
                var that = this
                var height = 0
                that.$refs.inputMessage.blur()
                that.inputBoard = false;
                const toast = that.$refs.toast;
                var url = null

                var param = that.GLOBAL.sign(this.token,this.imei);
                param += '&articleId=' + that.comment.article_id
                param += '&content=' + that.messageText
                param += '&appraisesId=' + that.comment.id

                if(that.replyIndex === -1) {
                    url = 'https://www.aftdc.com/userapp/Article/zhuiping'
                }else {
                    url = 'https://www.aftdc.com/userapp/Article/reply'
                    param += '&replyId=' + that.reply[that.replyIndex].id
                    var replyInfo = {aId:that.reply[that.replyIndex].aId,userName:that.reply[that.replyIndex].userName,content:that.reply[that.replyIndex].content,userId:that.reply[that.replyIndex].userId}
                    param += '&replyInfo=' + JSON.stringify(replyInfo)
                }
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: url,
                }, function (res) {
                    that.messageText = ''
                    if(res.data.res === 1) {
                        res.data.data.userId = that.userId
                        res.data.data.userName = that.userName
                        res.data.data.userPhoto = that.userPhoto;
                        res.data.data.aId = that.aId
                        if(that.replyIndex !== -1) {
                            res.data.data.aId = that.reply[that.replyIndex].aId
                            res.data.data.replyInfo = replyInfo
                            that.addRichText(replyInfo.userName,replyInfo.content,1)
                        }else {
                            that.addRichText('','',1)
                        }
                        that.reply.unshift(res.data.data)
                        that.comment.reply_num++
                    }else if(res.data.res === -2) {
                        that.toLogin()
                    }
                    toast.editContent(res.data.info);
                });
                setTimeout(()=>{
                    dom.scrollToElement(that.$refs.comment, {})
                },200)
            }),
            leavingClick(index){
                var that=this;
                that.replyIndex = index
                setTimeout(function () {
                    that.$refs.inputMessage.focus();
                },200)
                that.inputBoard=true;
            },

            reportArticle:GLOBAL.throttle(function(btn) { //举报文章
                var that = this
                const toast=that.$refs.toast;
                if(btn===1) {
                    that.popupOverlayBottomClick()
                }else {
                    that.popupReportTextareaClick()
                }
                var reason = []
                for(var i = that.reportOption.length - 1; i >= 0; i--) {
                    if(that.reportOption[i].check) {
                        reason.push(that.reportOption[i].text)
                    }
                }
                if(that.textareaText.length > 0) {
                    reason.push(that.textareaText)
                }
                if(reason.length > 0) {
                    var param = that.GLOBAL.sign(that.token,that.imei);
                    param += '&id=' + that.comment.id
                    param += '&reason=' + JSON.stringify(reason)
                    post.fetch({
                        method: 'POST',
                        type: 'json',
                        body: param,
                        headers: { "Content-Type": "application/x-www-form-urlencoded" },
                        url: 'https://www.aftdc.com/userapp/Article/reportComment',
                    }, function (res) {
                        if(res.data.res === 1) {
                            for(var i in that.reportOption) {
                                that.reportOption[i].check = false
                            }
                            that.textareaText = ''
                        }else if(res.data.res === -2) {
                            that.toLogin()
                        }
                        toast.editContent(res.data.info);
                    });
                }
            }),
            returnReport() { //返回按钮
                this.popupReportTextareaClick ()
                setTimeout(()=>{ this.isBottomShow = true },200)
            },
            popupReportTextareaClick () { //关闭吐槽弹层
                this.$refs.reportTextarea.hide();
                this.$refs.textarea.blur()
                setTimeout(()=>{ this.reportTextarea = false },400)
            },
            otherChecked(index) { //我有话要说
                this.$refs.wxcPopup.hide();
                setTimeout(()=>{ this.isBottomShow = false },400)
                setTimeout(()=>{
                    this.reportTextarea = true;
                    setTimeout(()=>{ this.$refs.textarea.focus() },200)
                },100)
            },
            reportChecked(index) { //选中举报选项
                this.reportOption[index].check = !this.reportOption[index].check
            },
            showReport() {
                this.isBottomShow = true
            },
            popupOverlayBottomClick () { //关闭举报弹层
                this.$refs.wxcPopup.hide();
                setTimeout(()=>{ this.isBottomShow = false; },400)
            },


            commentFabulous:GLOBAL.throttle(function(item,type){ //点赞评论
                var that = this
                const toast=that.$refs.toast;
                var id = item.id
                var url = null
                if(type === 0) {
                    if(item.isPraise === 1) {
                        url = 'https://www.aftdc.com/userapp/Article/cancelPraiseComment' //取消点赞评论
                    }else {
                        url = 'https://www.aftdc.com/userapp/Article/praiseComment' //点赞评论
                    }
                }else {
                    if(item.isPraise === 1) {
                        url = 'https://www.aftdc.com/userapp/Article/cancelPraiseZP' //取消点赞回复
                    }else {
                        url = 'https://www.aftdc.com/userapp/Article/praiseZP' //点赞回复
                    }
                }

                var param = that.GLOBAL.sign(this.token,this.imei);
                param += '&id=' + id
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: url,
                }, function (res) {
                    if(res.data.res === 1) {
                        if(item.isPraise === 1) {
                            item.isPraise = 0
                            item.praise_num--
                        }else {
                            that.zanAnimation()
                            item.isPraise = 1
                            item.praise_num++
                        }
                    }else if(res.data.res === -2) {
                        that.toLogin()
                    }
                });
            }),
            toPersonalHomePage:GLOBAL.throttle(function(userId,aId){ //跳转到用户个人主页
                var param = JSON.stringify({id:userId,acticleAccount:aId});
                var url='http://assets/personalHomepage.js';
                event.toUrl({"url":url,"param":param})
            }),
            zanAnimation(){ //点赞动画
                var that=this
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
                })
            },
            toLogin(){ //跳转到登录页面
                var param='';
                var url='http://assets/login.js';
                event.toUrl({"url":url,"param":param})
            },
            minibarLeftButtonClick() { //返回上一页

            }


        }
    }
</script>

<style scoped>
    .userNameClick {
        font-size: 30px;
        color: rgba(255,255,255,1);
        position: absolute;
    }

    .scroller {
        padding-bottom: 98px;
    }
    .allText {
        margin-left: 30px;
        margin-top: 34px;
        margin-bottom: 8px;
    }
    .preemptionText {
        margin-left: 112px;
        margin-top: 20px;
    }
    .line {
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: #eaeaea;
    }
    .releaseBtn {
        padding-left: 28px;
        padding-right: 20px;
        padding-top: 20px;
        padding-bottom: 20px;
        font-weight: bold;
        color: #999;
    }
    .releaseColor{
        color: #53beb7;
    }
    .commentInput {
        width: 546px;
        height: 94px;
        padding-top: 20px;
        padding-bottom: 22px;
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
    }
    .leavingMessage{
        margin-left:15px;
    }
    .leavingMessageIcon{
        width: 27px;
        height: 27px;
    }
    .leavingMessageDiv{
        flex-direction: row;
        align-items: center;
        background-color: #f1f1f1;
        height: 64px;
        padding-left: 30px;
        margin-right: 25px;
        border-radius: 30px;
        width: 690px;
    }
    .messageBoardTwo{
        background-color: #fff;
        width: 750px;
        height: 100px;
        align-items: center;
        border-top-style: solid;
        border-top-width: 2px;
        border-top-color: #f1f1f1;
    }
    .messageBoard{
        height: 100px;
        padding-left: 30px;
        padding-right: 30px;
        border-top-style: solid;
        border-top-width: 2px;
        border-top-color: #f1f1f1;
        flex-direction: row;
        align-items: center;
        background-color: #fff;
    }

    .row {
        flex-direction: row;
    }
    .aiCenter {
        align-items: center;
    }
    .jcCenter {
        justify-content: center;
    }
    .jcSb {
        justify-content: space-between;
    }
    .mySelected{
        padding-top: 30px;
        padding-bottom: 30px;
        padding-left: 30px;
        padding-right: 30px;
    }
    .mySelected:active {
        background-color: #f0f0f0;
    }
    .mySelectedIcon{
        border-radius: 40px;
        width: 60px;
        height: 60px;
    }
    .userName{
        margin-left: 20px;
        max-width: 300px;
        lines: 1;
        text-overflow: ellipsis;
    }
    .zhanIcon{
        width: 35px;
        height: 35px;
        margin-right: 5px;
    }
    .centerText{
        font-size: 30px;
        flex: 1;
        width: 580px;
        line-height: 46px;
    }
    .buttom{
        margin-left: 82px;
        margin-top: 10px;
        flex-direction: row;
    }
    .center{
        margin-left: 82px;
    }
    .textareaBox {
        flex: 1;
        background-color: #f8f8f8;
        padding-left: 24px;
        padding-right: 24px;
    }
    .tbHeader {
        padding-left: 40px;
        padding-right: 40px;
        height: 120px;
    }
    .tbTitle {
        text-align: center;
        font-size: 30px;
        font-weight: bold;
    }
    .tbFlex1 {
        flex: 1;
    }
    .tbMain {
        height: 160px;
        background-color: #fff;
        border-width: 1px;
        border-style: solid;
        border-color: #d4d4d4;
        border-radius: 10px;
    }
    .textarea {
        height: 160px;
        padding-left: 20px;
        padding-right: 20px;
        padding-top: 20px;
        padding-bottom: 20px;
    }
    .tbfooter {
        height: 90px;
        flex-direction: row-reverse;
    }
    .tbBtn {
        width: 116px;
        height: 54px;
        color: #fff;
        line-height: 54px;
        text-align: center;
        border-radius: 10px;
    }
    .delectPl {
        margin-left: 8px;
        padding-bottom: 6px;
        padding-top: 6px;
        padding-right: 12px;
        padding-left: 12px;
    }


    .demo-content {
        flex: 1;
        flex-direction: column-reverse;
    }
    .completeBtn {
        font-size: 30px;
        height: 96px;
        line-height: 90px;
        text-align: center;
        border-top-width: 2;
        border-top-style: solid;
        border-top-color: #f1f1f1;
    }
    .reportOption {
        height: 90px;
        border-top-width: 2;
        border-top-style: solid;
        border-top-color: #f1f1f1;
        margin-left: 66px;
        margin-right: 66px;
    }
    .reportRight {
        color: #4aaaa3;
        font-size: 28px;
    }
    .arrowIcon {
        width: 22px;
        height: 22px;
        transform: rotate(-90deg);
        opacity: 0.5;
    }
    .tran90 {
        transform: rotate(90deg);
    }
    .reportTitle {
        flex: 1;
    }
    .reportTitleText {
        font-size: 30px;
        font-weight: bold;
    }
    .report {
        padding-bottom: 6px;
        padding-top: 6px;
        padding-right: 10px;
    }
    .bigZhan{
        width: 160px;
        height: 160px;
        opacity: 0;
        position: absolute;
        top: 500px;
        left: 300px;
    }
    .delBox {
        justify-content: space-between;
    }
    .delText {
        height: 166px;
    }
    .delBtn {
        height: 94px;
        border-top-width: 2px;
        border-top-style: solid;
        border-top-color: #f0f0f0;
    }
    .flex1 {
        line-height: 94px;
        text-align: center;
        flex: 1;
    }
    .delTips {
        color: #555;
        font-size: 28px;
        line-height: 40px;
    }
    .delCancel {
        color: #444;
        border-right-width: 2px;
        border-right-style: solid;
        border-right-color: #f0f0f0;
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
        background-color: #fff;
    }
    .commentNothing {
        color: #999;
        text-align: center;
        margin-top: 14px;
        margin-bottom: 14px;
        margin-left: 20px;
        margin-right: 20px;
    }
    .nothingLine {
        flex: 1;
        border-bottom-style: solid;
        border-bottom-width: 1px;
        border-bottom-color: #ccc;
    }
</style>
