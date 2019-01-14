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
                <text :style="GLOBAL.headerCenter"  slot="middle">用户评价</text>
            </wxc-minibar>
        </div>

        <div class="albumBar">
            <div class="whole" :class="[sliderIndex==0?'select':'']" @click="selectedClick(0)">
                <text class="barTextOne" :style="{fontSize:GLOBAL.bigFS,color:sliderIndex==0?'#53beb7':GLOBAL.dColor}">全部</text>
                <text class="barTextOne" :style="{fontSize:GLOBAL.bigFS,color:sliderIndex==0?'#53beb7':GLOBAL.dColor}">({{messageAll[0].messageList.length}})</text>
            </div>
            <div class="whole" :class="[sliderIndex==1?'select':'']" @click="selectedClick(1)">
                <text class="barTextOne" :style="{fontSize:GLOBAL.bigFS,color:sliderIndex==1?'#53beb7':GLOBAL.dColor}">晒图</text>
                <text class="barTextOne" :style="{fontSize:GLOBAL.bigFS,color:sliderIndex==1?'#53beb7':GLOBAL.dColor}">({{messageAll[1].messageList.length}})</text>
            </div>
            <div class="whole" :class="[sliderIndex==2?'select':'']" @click="selectedClick(2)">
                <text class="barTextOne" :style="{fontSize:GLOBAL.bigFS,color:sliderIndex==2?'#53beb7':GLOBAL.dColor}">低分</text>
                <text class="barTextOne" :style="{fontSize:GLOBAL.bigFS,color:sliderIndex==2?'#53beb7':GLOBAL.dColor}">({{messageAll[2].messageList.length}})</text>
            </div>
            <div class="whole" :class="[sliderIndex==3?'select':'']" @click="selectedClick(3)">
                <text class="barTextOne" :style="{fontSize:GLOBAL.bigFS,color:sliderIndex==3?'#53beb7':GLOBAL.dColor}">最新</text>
                <text class="barTextOne" :style="{fontSize:GLOBAL.bigFS,color:sliderIndex==3?'#53beb7':GLOBAL.dColor}">({{messageAll[3].messageList.length}})</text>
            </div>
        </div>
        <slider class="slider" @change="change" :index="sliderIndex" infinite="false">
            <scroller class="list"  show-scrollbar="false">
                <div class="cell">

                    <!--标签star-->
                    <div class="lable">
                        <div class="labelContent">
                            <text class="lableText" :class="[item.lableClass?'lableTextClick':'']" v-for="(item,index) in lableList" :key="index" v-if="index<9||bottoIconClick" @click="lableClick(index)" :style="{fontSize:GLOBAL.defaultFS}">{{item.text}}{{item.number}}</text>
                        </div>
                        <div class="lableIcon" v-if="lableList.length>9" @click="lableIconClick">
                            <image class="Icon" :src="bottoIconClick==true?'https://image.aftdc.com/appBimg/ic_expanded_up.jpg':'https://image.aftdc.com/appBimg/ic_expanded_down.jpg'"></image>
                        </div>
                    </div>
                    <!--标签end-->

                    <!--全部-->
                    <div class="message" @click="toDetailsOfEvaluation()" v-for="(item,index) in messageAll[0].messageList" :key="index">
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
                                    <text class="starText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">打分</text>
                                    <div class="starDiv">
                                        <image class="starIcon" src="https://image.aftdc.com/appBimg/icon_wuxing_nocolor.png"></image>
                                        <div class="starIconTwoDiv" :style="{width:item.star*30}">
                                            <image class="starIconTwo" src="https://image.aftdc.com/appBimg/icon_wuxing_color.png"></image>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style="margin-left: 110px;">

                            <text class="messageText" v-if="item.message!=''" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.message}}</text>
                            <div class="details" v-if="item.detailsText!=''">
                                <image class="detailsIcon" src="https://image.aftdc.com/appBimg/details_icon.png"></image>
                                <text class="detailsText" :style="{fontSize:GLOBAL.smallFS}">{{item.detailsText}}</text>
                            </div>
                            <div class="messageIconDiv">
                                <image class="messageIcon" v-for="(itemTwo,index3) in item.pictureList" :key="index3" :src="itemTwo.img" v-if="itemTwo.img!=''"></image>
                            </div>
                            <div class="feedback">
                                <text class="browse" :style="{fontSize:GLOBAL.smallFS}">浏览{{item.browse}}万</text>
                                <div class="feedbackZan" @click="animationClick(index)">
                                    <image class="feedbackZanIcon" :src="item.zanIcon==true?'https://image.aftdc.com/images/zhan.png':'https://image.aftdc.com/images/nozhan.png'"></image>
                                    <text class="feedbackZanNum" :style="{fontSize:GLOBAL.smallFS}"> {{item.zanNumber==0?'赞':item.zanNumber}}</text>
                                </div>
                                <div class="feedbackZan" @click="commentClick(index)">
                                    <image class="feedbackZanIcon" src="https://image.aftdc.com/appBimg/leaveMessage_icon.png"></image>
                                    <text class="feedbackZanNum" :style="{fontSize:GLOBAL.smallFS}"> {{item.evaluate.length>0?item.evaluate.length:'评论'}}</text>
                                </div>
                            </div>
                            <div class="commentDiv" v-if="item.evaluate!=''">
                                <image class="commentIcon" src="https://image.aftdc.com/appBimg/comment_icon.png"></image>
                                <div>
                                    <div class="comment" @click="replyClick(index,index2)" v-for="(itemTwo,index2) in item.evaluate" :key="index2" v-if="index2<3||item.takeup">
                                        <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}">{{itemTwo.evaluateUser}}</text>
                                        <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{itemTwo.evaluateUserOther?'回复':''}}</text>
                                        <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}">{{itemTwo.evaluateUserOther?itemTwo.evaluateUserOther:''}}</text>
                                        <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">:</text>
                                        <text class="commentContent" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}"> {{itemTwo.evaluateText}}</text>
                                    </div>
                                    <text class="takeUp" v-if="item.evaluate.length>3" @click="takeupClick(index)" :style="{fontSize:GLOBAL.defaultFS}">{{item.takeup==0?'查看全部'+item.evaluate.length+'条评论':'收起'}}</text>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </scroller>
            <scroller class="list"  show-scrollbar="false">

                <!--晒图-->
                <div class="message" @click="toDetailsOfEvaluation()" v-for="(item,index) in messageAll[1].messageList" :key="index" v-if="messageAll[1].messageList!=''">
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
                                <text class="starText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">打分</text>
                                <div class="starDiv">
                                    <image class="starIcon" src="https://image.aftdc.com/appBimg/icon_wuxing_nocolor.png"></image>
                                    <div class="starIconTwoDiv" :style="{width:item.star*30}">
                                        <image class="starIconTwo" src="https://image.aftdc.com/appBimg/icon_wuxing_color.png"></image>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style="margin-left: 110px;">
                        <text class="messageText" v-if="item.message!=''" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.message}}</text>
                        <div class="details" v-if="item.detailsText!=''">
                            <image class="detailsIcon" src="https://image.aftdc.com/appBimg/details_icon.png"></image>
                            <text class="detailsText" :style="{fontSize:GLOBAL.smallFS}">{{item.detailsText}}</text>
                        </div>
                        <div class="messageIconDiv">
                            <image class="messageIcon" v-for="(itemTwo,index3) in item.pictureList" :key="index3" :src="itemTwo.img" v-if="itemTwo.img!=''"></image>
                        </div>
                        <div class="feedback">
                            <text class="browse" :style="{fontSize:GLOBAL.smallFS}">浏览{{item.browse}}万</text>
                            <div class="feedbackZan" @click="animationClick(index)">
                                <image class="feedbackZanIcon" :src="item.zanIcon==true?'https://image.aftdc.com/images/zhan.png':'https://image.aftdc.com/images/nozhan.png'"></image>
                                <text class="feedbackZanNum" :style="{fontSize:GLOBAL.smallFS}"> {{item.zanNumber==0?'赞':item.zanNumber}}</text>
                            </div>
                            <div class="feedbackZan" @click="commentClick(index)">
                                <image class="feedbackZanIcon" src="https://image.aftdc.com/appBimg/leaveMessage_icon.png"></image>
                                <text class="feedbackZanNum" :style="{fontSize:GLOBAL.smallFS}"> {{item.evaluate.length>0?item.evaluate.length:'评论'}}</text>
                            </div>
                        </div>
                        <div class="commentDiv" v-if="item.evaluate!=''">
                            <image class="commentIcon" src="https://image.aftdc.com/appBimg/comment_icon.png"></image>
                            <div>
                                <div class="comment" @click="replyClick(index,index2)" v-for="(itemTwo,index2) in item.evaluate" :key="index2" v-if="index2<3||item.takeup">
                                    <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}">{{itemTwo.evaluateUser}}</text>
                                    <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{itemTwo.evaluateUserOther?'回复':''}}</text>
                                    <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}">{{itemTwo.evaluateUserOther?itemTwo.evaluateUserOther:''}}</text>
                                    <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">:</text>
                                    <text class="commentContent" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}"> {{itemTwo.evaluateText}}</text>
                                </div>
                                <text class="takeUp" v-if="item.evaluate.length>3" @click="takeupClick(index)" :style="{fontSize:GLOBAL.defaultFS}">{{item.takeup==0?'查看全部'+item.evaluate.length+'条评论':'收起'}}</text>
                            </div>
                        </div>
                    </div>

                </div>

                <noOrder img="https://image.aftdc.com/appBimg/icon_no_order.png" textOne="暂无晒图评价" textTwo="" v-if="messageAll[1].messageList==''"></noOrder>
            </scroller>
            <scroller class="list"  show-scrollbar="false">

                <!--低分-->
                <div class="message" @click="toDetailsOfEvaluation()" v-for="(item,index) in messageAll[2].messageList" :key="index" v-if="messageAll[2].messageList!=''">
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
                                <text class="starText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">打分</text>
                                <div class="starDiv">
                                    <image class="starIcon" src="https://image.aftdc.com/appBimg/icon_wuxing_nocolor.png"></image>
                                    <div class="starIconTwoDiv" :style="{width:item.star*30}">
                                        <image class="starIconTwo" src="https://image.aftdc.com/appBimg/icon_wuxing_color.png"></image>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style="margin-left: 110px;">
                        <text class="messageText" v-if="item.message!=''" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.message}}</text>
                        <div class="details" v-if="item.detailsText!=''">
                            <image class="detailsIcon" src="https://image.aftdc.com/appBimg/details_icon.png"></image>
                            <text class="detailsText" :style="{fontSize:GLOBAL.smallFS}">{{item.detailsText}}</text>
                        </div>
                        <div class="messageIconDiv">
                            <image class="messageIcon" v-for="(itemTwo,index3) in item.pictureList" :key="index3" :src="itemTwo.img" v-if="itemTwo.img!=''"></image>
                        </div>
                        <div class="feedback">
                            <text class="browse" :style="{fontSize:GLOBAL.smallFS}">浏览{{item.browse}}万</text>
                            <div class="feedbackZan" @click="animationClick(index)">
                                <image class="feedbackZanIcon" :src="item.zanIcon==true?'https://image.aftdc.com/images/zhan.png':'https://image.aftdc.com/images/nozhan.png'"></image>
                                <text class="feedbackZanNum" :style="{fontSize:GLOBAL.smallFS}"> {{item.zanNumber==0?'赞':item.zanNumber}}</text>
                            </div>
                            <div class="feedbackZan" @click="commentClick(index)">
                                <image class="feedbackZanIcon" src="https://image.aftdc.com/appBimg/leaveMessage_icon.png"></image>
                                <text class="feedbackZanNum" :style="{fontSize:GLOBAL.smallFS}"> {{item.evaluate.length>0?item.evaluate.length:'评论'}}</text>
                            </div>
                        </div>
                        <div class="commentDiv" v-if="item.evaluate!=''">
                            <image class="commentIcon" src="https://image.aftdc.com/appBimg/comment_icon.png"></image>
                            <div>
                                <div class="comment" @click="replyClick(index,index2)" v-for="(itemTwo,index2) in item.evaluate" :key="index2" v-if="index2<3||item.takeup">
                                    <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}">{{itemTwo.evaluateUser}}</text>
                                    <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{itemTwo.evaluateUserOther?'回复':''}}</text>
                                    <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}">{{itemTwo.evaluateUserOther?itemTwo.evaluateUserOther:''}}</text>
                                    <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">:</text>
                                    <text class="commentContent" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}"> {{itemTwo.evaluateText}}</text>
                                </div>
                                <text class="takeUp" v-if="item.evaluate.length>3" @click="takeupClick(index)" :style="{fontSize:GLOBAL.defaultFS}">{{item.takeup==0?'查看全部'+item.evaluate.length+'条评论':'收起'}}</text>
                            </div>
                        </div>
                    </div>

                </div>
                <noOrder img="https://image.aftdc.com/appBimg/icon_no_order.png" textOne="暂无低分评价" textTwo="" v-if="messageAll[2].messageList==''"></noOrder>


            </scroller>
            <scroller class="list"  show-scrollbar="false">

                <!--最新-->
                <div class="message" @click="toDetailsOfEvaluation()" v-for="(item,index) in messageAll[3].messageList" :key="index" v-if="messageAll[3].messageList!=''">
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
                                <text class="starText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">打分</text>
                                <div class="starDiv">
                                    <image class="starIcon" src="https://image.aftdc.com/appBimg/icon_wuxing_nocolor.png"></image>
                                    <div class="starIconTwoDiv" :style="{width:item.star*30}">
                                        <image class="starIconTwo" src="https://image.aftdc.com/appBimg/icon_wuxing_color.png"></image>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style="margin-left: 110px;">
                        <text class="messageText" v-if="item.message!=''" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.message}}</text>
                        <div class="details" v-if="item.detailsText!=''">
                            <image class="detailsIcon" src="https://image.aftdc.com/appBimg/details_icon.png"></image>
                            <text class="detailsText" :style="{fontSize:GLOBAL.smallFS}">{{item.detailsText}}</text>
                        </div>
                        <div class="messageIconDiv">
                            <image class="messageIcon" v-for="(itemTwo,index3) in item.pictureList" :key="index3" :src="itemTwo.img" v-if="itemTwo.img!=''"></image>
                        </div>
                        <div class="feedback">
                            <text class="browse" :style="{fontSize:GLOBAL.smallFS}">浏览{{item.browse}}万</text>
                            <div class="feedbackZan" @click="animationClick(index)">
                                <image class="feedbackZanIcon" :src="item.zanIcon==true?'https://image.aftdc.com/images/zhan.png':'https://image.aftdc.com/images/nozhan.png'"></image>
                                <text class="feedbackZanNum" :style="{fontSize:GLOBAL.smallFS}"> {{item.zanNumber==0?'赞':item.zanNumber}}</text>
                            </div>
                            <div class="feedbackZan" @click="commentClick(index)">
                                <image class="feedbackZanIcon" src="https://image.aftdc.com/appBimg/leaveMessage_icon.png"></image>
                                <text class="feedbackZanNum" :style="{fontSize:GLOBAL.smallFS}"> {{item.evaluate.length>0?item.evaluate.length:'评论'}}</text>
                            </div>
                        </div>
                        <div class="commentDiv" v-if="item.evaluate!=''">
                            <image class="commentIcon" src="https://image.aftdc.com/appBimg/comment_icon.png"></image>
                            <div>
                                <div class="comment" @click="replyClick(index,index2)" v-for="(itemTwo,index2) in item.evaluate" :key="index2" v-if="index2<3||item.takeup">
                                    <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}">{{itemTwo.evaluateUser}}</text>
                                    <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{itemTwo.evaluateUserOther?'回复':''}}</text>
                                    <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}">{{itemTwo.evaluateUserOther?itemTwo.evaluateUserOther:''}}</text>
                                    <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">:</text>
                                    <text class="commentContent" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}"> {{itemTwo.evaluateText}}</text>
                                </div>
                                <text class="takeUp" v-if="item.evaluate.length>3" @click="takeupClick(index)" :style="{fontSize:GLOBAL.defaultFS}">{{item.takeup==0?'查看全部'+item.evaluate.length+'条评论':'收起'}}</text>
                            </div>
                        </div>
                    </div>

                </div>
                <noOrder img="https://image.aftdc.com/appBimg/icon_no_order.png" textOne="暂无最新评价" textTwo="" v-if="messageAll[3].messageList==''"></noOrder>

            </scroller>
        </slider>

        <!--点赞按钮star-->
        <image class="box" ref="test" src="https://image.aftdc.com/images/zan.png"></image>
        <!--点赞按钮end-->


        <!--输入框star-->
        <div class="messageBoardTwo row aiCenter" v-if="messageBoard">
            <div class="commentInputBg" >
                <div class="grayBg"></div>
                <input class="commentInput" type="text"  :placeholder="reply==''?'评论':'回复:'+reply" ref="inputMessage" v-model="messageText" @blur="blur">
            </div>
            <text class="releaseBtn " :class="[messageText===''?'':'releaseBtnTwo']" @click="leavingClick" :style="{fontSize:GLOBAL.bigFS}">发布</text>
        </div>
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


        <!--input框获取焦点时的白色遮罩层star-->
        <div class="blank" :style="{right:blankLeft}" @click="blankClick"></div>
        <!--input框获取焦点时的白色遮罩层end-->


        <!--成功删除评论的提示star-->
        <text class="deleteSuccess" v-if="delSuccess" :style="{fontSize:GLOABL.smallFS}">删除成功</text>
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
    import noOrder from './noOrder.vue';
    export default {
        components: { WxcMask,WxcMinibar,noOrder },
        name: 'App',
        data () {
            return {
                sliderIndex:0,//菜单点击切换
                bottoIconClick:false,//向下图标的点击切换
                show:false,//点击发送按钮未输入内容时的提示框
                messageText:'',//用户输入的内容
                bridging:0,//发送按钮和每个评价的桥接
                bridgingTwo:0,//发送按钮和每条评论(回复)内容的桥接
                reply:'',//获取回复的用户名
                messageBoard:false,//留言输入框的显隐藏
                delShow:false,//是否删除自己的的留言或者评论
                delSuccess:false,//删除成功提示
                myevaluateUser:'千寻',//myevaluateUser用于区分的自己和别人ID
                blankLeft:-750,//input框获取焦点时的白色遮罩层位置
                lableList:[
                    {text:'服务热情',number:14,lableClass:false,},
                    {text:'环境优雅',number:14,lableClass:false,},
                    {text:'味道赞',number:14,lableClass:false,},
                    {text:'性价比高',number:14,lableClass:false,},
                    {text:'服务热情',number:14,lableClass:false,},
                    {text:'环境优雅',number:14,lableClass:false,},
                    {text:'味道赞',number:14,lableClass:false,},
                    {text:'服务热情',number:14,lableClass:false,},
                    {text:'环境优雅',number:14,lableClass:false,},
                    {text:'味道赞',number:14,lableClass:false,},


                ],//标签内容

                messageAll:[
                    {
                        messageList:[
                            {
                                personalImg:'https://image.aftdc.com/images/packageA/shopImg2.jpg',name:'千与千寻',star:5,message:'不错,很喜欢这家的汉堡,实惠又好吃,重点是配送的小姐姐很好看,又会说话不错,很喜欢这家的汉堡,实惠又好吃,重点是配送的小姐姐很好看,又会说话>_<',
                                grade:6,time:'2018-09-06',browse:4,zanNumber:0,zanIcon:false,takeup:false,messageHide:false,detailsText:'服务差,味道差,分量少,肉类一般,环境差',messageBoard:false,delShow:false,
                                pictureList:
                                    [
                                        // {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        // {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        // {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        // {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        // {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        // {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                    ],
                                evaluate:
                                    [
                                        {evaluateUser:'傻逼',evaluateText:'真的有这么 好吗?',},
                                        {evaluateUser:'傻逼',evaluateText:'真的有这么 好吗?',},
                                    ],
                            },
                            {
                                personalImg:'https://image.aftdc.com/images/packageA/shopImg2.jpg',name:'千与千寻',star:5,message:'不错,很喜欢这家的汉堡,实惠又好吃,重点是配送的小姐姐很好看,又会说话不错,很喜欢这家的汉堡,实惠又好吃,重点是配送的小姐姐很好看,又会说话>_<',
                                grade:6,time:'2018-09-06',browse:4,zanNumber:0,zanIcon:false,commentContentLength:false,takeup:0,messageHide:false,detailsText:'',
                                pictureList:
                                    [
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                    ],
                                evaluate:
                                    [
                                    ],
                            },
                        ],//全部

                    },
                    {
                        messageList:[
                            {
                                personalImg:'https://image.aftdc.com/images/packageA/shopImg2.jpg',name:'千与千寻',star:5,message:'不错,很喜欢这家的汉堡,实惠又好吃,重点是配送的小姐姐很好看,又会说话不错,很喜欢这家的汉堡,实惠又好吃,重点是配送的小姐姐很好看,又会说话>_<',
                                grade:6,time:'2018-09-06',browse:4,zanNumber:0,zanIcon:false,commentContentLength:false,takeup:0,messageHide:false,detailsText:'服务差,味道差,分量少,肉类一般,环境差',
                                pictureList:
                                    [
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                    ],
                                evaluate:
                                    [
                                        {evaluateUser:'傻逼',evaluateText:'真的有这么 好吗?',},
                                        {evaluateUser:'傻逼',evaluateText:'真的有这么 好吗?',},
                                        {evaluateUser:'傻逼',evaluateText:'真的有这么 好吗?',},
                                        {evaluateUser:'傻逼',evaluateText:'真的有这么 好吗?',},
                                        {evaluateUser:'傻逼',evaluateText:'真的有这么 好吗?',},
                                        {evaluateUser:'傻逼',evaluateText:'真的有这么 好吗?',},
                                    ],
                            },
                            {
                                personalImg:'https://image.aftdc.com/images/packageA/shopImg2.jpg',name:'千与千寻',star:5,message:'不错,很喜欢这家的汉堡,实惠又好吃,重点是配送的小姐姐很好看,又会说话不错,很喜欢这家的汉堡,实惠又好吃,重点是配送的小姐姐很好看,又会说话>_<',
                                grade:6,time:'2018-09-06',browse:4,zanNumber:0,zanIcon:false,commentContentLength:false,takeup:0,messageHide:false,detailsText:'',
                                pictureList:
                                    [
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                    ],
                                evaluate:
                                    [
                                    ],
                            },
                            {
                                personalImg:'https://image.aftdc.com/images/packageA/shopImg2.jpg',name:'千与千寻',star:5,message:'不错,很喜欢这家的汉堡,实惠又好吃,重点是配送的小姐姐很好看,又会说话不错,很喜欢这家的汉堡,实惠又好吃,重点是配送的小姐姐很好看,又会说话>_<',
                                grade:6,time:'2018-09-06',browse:4,zanNumber:0,zanIcon:false,commentContentLength:false,takeup:0,messageHide:false,detailsText:'服务差,味道差,分量少,肉类一般,环境差',
                                pictureList:
                                    [
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                    ],
                                evaluate:
                                    [
                                        {evaluateUser:'傻逼',evaluateText:'真的有这么 好吗?',},
                                        {evaluateUser:'傻逼',evaluateText:'真的有这么 好吗?',},
                                        {evaluateUser:'傻逼',evaluateText:'真的有这么 好吗?',},
                                        {evaluateUser:'傻逼',evaluateText:'真的有这么 好吗?',},
                                        {evaluateUser:'傻逼',evaluateText:'真的有这么 好吗?',},
                                        {evaluateUser:'傻逼',evaluateText:'真的有这么 好吗?',},
                                        {evaluateUser:'傻逼',evaluateText:'真的有这么 好吗?',},
                                        {evaluateUser:'傻逼',evaluateText:'真的有这么 好吗?',},
                                    ],
                            },
                            {
                                personalImg:'https://image.aftdc.com/images/packageA/shopImg2.jpg',name:'千与千寻',star:5,message:'不错,很喜欢这家的汉堡,实惠又好吃,重点是配送的小姐姐很好看,又会说话不错,很喜欢这家的汉堡,实惠又好吃,重点是配送的小姐姐很好看,又会说话>_<',
                                grade:6,time:'2018-09-06',browse:4,zanNumber:0,zanIcon:false,commentContentLength:false,takeup:0,messageHide:false,detailsText:'服务差,味道差,分量少,肉类一般,环境差',
                                pictureList:
                                    [
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                    ],
                                evaluate:
                                    [
                                        {evaluateUser:'傻逼',evaluateText:'真的有这么 好吗?',},
                                        {evaluateUser:'傻逼',evaluateText:'真的有这么 好吗?',},
                                        {evaluateUser:'傻逼',evaluateText:'真的有这么 好吗?',},
                                        {evaluateUser:'傻逼',evaluateText:'真的有这么 好吗?',},
                                        {evaluateUser:'傻逼',evaluateText:'真的有这么 好吗?',},
                                        {evaluateUser:'傻逼',evaluateText:'真的有这么 好吗?',},
                                        {evaluateUser:'傻逼',evaluateText:'真的有这么 好吗?',},
                                    ],
                            },
                            {
                                personalImg:'https://image.aftdc.com/images/packageA/shopImg2.jpg',name:'千与千寻',star:5,message:'不错,很喜欢这家的汉堡,实惠又好吃,重点是配送的小姐姐很好看,又会说话不错,很喜欢这家的汉堡,实惠又好吃,重点是配送的小姐姐很好看,又会说话>_<',
                                grade:6,time:'2018-09-06',browse:4,zanNumber:0,zanIcon:false,commentContentLength:false,takeup:0,messageHide:false,detailsText:'服务差,味道差,分量少,肉类一般,环境差',
                                pictureList:
                                    [
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                    ],
                                evaluate:
                                    [
                                        {evaluateUser:'傻逼',evaluateText:'真的有这么 好吗?',},
                                        {evaluateUser:'傻逼',evaluateText:'真的有这么 好吗?',},
                                        {evaluateUser:'傻逼',evaluateText:'真的有这么 好吗?',},
                                        {evaluateUser:'傻逼',evaluateText:'真的有这么 好吗?',},
                                        {evaluateUser:'傻逼',evaluateText:'真的有这么 好吗?',},
                                        {evaluateUser:'傻逼',evaluateText:'真的有这么 好吗?',},
                                        {evaluateUser:'傻逼',evaluateText:'真的有这么 好吗?',},
                                    ],
                            },
                        ],//晒图
                    },
                    {
                        messageList:[
                            {
                                personalImg:'https://image.aftdc.com/images/packageA/shopImg2.jpg',name:'千与千寻',star:5,message:'不错,很喜欢这家的汉堡,实惠又好吃,重点是配送的小姐姐很好看,又会说话不错,很喜欢这家的汉堡,实惠又好吃,重点是配送的小姐姐很好看,又会说话>_<',
                                grade:6,time:'2018-09-06',browse:4,zanNumber:0,zanIcon:false,commentContentLength:false,takeup:0,messageHide:false,detailsText:'服务差,味道差,分量少,肉类一般,环境差',messageBoard:false,delShow:false,
                                pictureList:
                                    [
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                    ],
                                evaluate:
                                    [
                                        {evaluateUser:'傻逼',evaluateText:'真的有这么 好吗?',},
                                        {evaluateUser:'傻逼',evaluateText:'真的有这么 好吗?',},
                                    ],
                            },
                            {
                                personalImg:'https://image.aftdc.com/images/packageA/shopImg2.jpg',name:'千与千寻',star:5,message:'不错,很喜欢这家的汉堡,实惠又好吃,重点是配送的小姐姐很好看,又会说话不错,很喜欢这家的汉堡,实惠又好吃,重点是配送的小姐姐很好看,又会说话>_<',
                                grade:6,time:'2018-09-06',browse:4,zanNumber:0,zanIcon:false,commentContentLength:false,takeup:0,messageHide:false,detailsText:'',
                                pictureList:
                                    [
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                    ],
                                evaluate:
                                    [
                                    ],
                            },
                            {
                                personalImg:'https://image.aftdc.com/images/packageA/shopImg2.jpg',name:'千与千寻',star:5,message:'不错,很喜欢这家的汉堡,实惠又好吃,重点是配送的小姐姐很好看,又会说话不错,很喜欢这家的汉堡,实惠又好吃,重点是配送的小姐姐很好看,又会说话>_<',
                                grade:6,time:'2018-09-06',browse:4,zanNumber:0,zanIcon:false,commentContentLength:false,takeup:0,messageHide:false,detailsText:'服务差,味道差,分量少,肉类一般,环境差',
                                pictureList:
                                    [
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                    ],
                                evaluate:
                                    [
                                        {evaluateUser:'傻逼',evaluateText:'真的有这么 好吗?',},
                                        {evaluateUser:'傻逼',evaluateText:'真的有这么 好吗?',},
                                        {evaluateUser:'傻逼',evaluateText:'真的有这么 好吗?',},
                                        {evaluateUser:'傻逼',evaluateText:'真的有这么 好吗?',},
                                        {evaluateUser:'傻逼',evaluateText:'真的有这么 好吗?',},
                                        {evaluateUser:'傻逼',evaluateText:'真的有这么 好吗?',},
                                        {evaluateUser:'傻逼',evaluateText:'真的有这么 好吗?',},
                                        {evaluateUser:'傻逼',evaluateText:'真的有这么 好吗?',},
                                    ],
                            },
                            {
                                personalImg:'https://image.aftdc.com/images/packageA/shopImg2.jpg',name:'千与千寻',star:5,message:'不错,很喜欢这家的汉堡,实惠又好吃,重点是配送的小姐姐很好看,又会说话不错,很喜欢这家的汉堡,实惠又好吃,重点是配送的小姐姐很好看,又会说话>_<',
                                grade:6,time:'2018-09-06',browse:4,zanNumber:0,zanIcon:false,commentContentLength:false,takeup:0,messageHide:false,detailsText:'服务差,味道差,分量少,肉类一般,环境差',
                                pictureList:
                                    [
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                    ],
                                evaluate:
                                    [
                                        {evaluateUser:'傻逼',evaluateText:'真的有这么 好吗?',},
                                        {evaluateUser:'傻逼',evaluateText:'真的有这么 好吗?',},
                                    ],
                            },
                            {
                                personalImg:'https://image.aftdc.com/images/packageA/shopImg2.jpg',name:'千与千寻',star:5,message:'不错,很喜欢这家的汉堡,实惠又好吃,重点是配送的小姐姐很好看,又会说话不错,很喜欢这家的汉堡,实惠又好吃,重点是配送的小姐姐很好看,又会说话>_<',
                                grade:6,time:'2018-09-06',browse:4,zanNumber:0,zanIcon:false,commentContentLength:false,takeup:0,messageHide:false,detailsText:'服务差,味道差,分量少,肉类一般,环境差',
                                pictureList:
                                    [
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                    ],
                                evaluate:
                                    [
                                        {evaluateUser:'傻逼',evaluateText:'真的有这么 好吗?',},
                                        {evaluateUser:'傻逼',evaluateText:'真的有这么 好吗?',},
                                    ],
                            },
                        ],//低分
                    },
                    {
                        messageList:[
                            {
                                personalImg:'https://image.aftdc.com/images/packageA/shopImg2.jpg',name:'千与千寻',star:5,message:'不错,很喜欢这家的汉堡,实惠又好吃,重点是配送的小姐姐很好看,又会说话不错,很喜欢这家的汉堡,实惠又好吃,重点是配送的小姐姐很好看,又会说话>_<',
                                grade:6,time:'2018-09-06',browse:4,zanNumber:0,zanIcon:false,commentContentLength:false,takeup:0,messageHide:false,detailsText:'服务差,味道差,分量少,肉类一般,环境差',messageBoard:false,delShow:false,
                                pictureList:
                                    [
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                    ],
                                evaluate:
                                    [
                                        {evaluateUser:'傻逼',evaluateText:'真的有这么 好吗?',},
                                        {evaluateUser:'傻逼',evaluateText:'真的有这么 好吗?',},
                                    ],
                            },
                            {
                                personalImg:'https://image.aftdc.com/images/packageA/shopImg2.jpg',name:'千与千寻',star:5,message:'不错,很喜欢这家的汉堡,实惠又好吃,重点是配送的小姐姐很好看,又会说话不错,很喜欢这家的汉堡,实惠又好吃,重点是配送的小姐姐很好看,又会说话>_<',
                                grade:6,time:'2018-09-06',browse:4,zanNumber:0,zanIcon:false,commentContentLength:false,takeup:0,messageHide:false,detailsText:'',
                                pictureList:
                                    [
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                    ],
                                evaluate:
                                    [
                                    ],
                            },
                            {
                                personalImg:'https://image.aftdc.com/images/packageA/shopImg2.jpg',name:'千与千寻',star:5,message:'不错,很喜欢这家的汉堡,实惠又好吃,重点是配送的小姐姐很好看,又会说话不错,很喜欢这家的汉堡,实惠又好吃,重点是配送的小姐姐很好看,又会说话>_<',
                                grade:6,time:'2018-09-06',browse:4,zanNumber:0,zanIcon:false,commentContentLength:false,takeup:0,messageHide:false,detailsText:'服务差,味道差,分量少,肉类一般,环境差',
                                pictureList:
                                    [
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                    ],
                                evaluate:
                                    [
                                        {evaluateUser:'傻逼',evaluateText:'真的有这么 好吗?',},
                                        {evaluateUser:'傻逼',evaluateText:'真的有这么 好吗?',},
                                        {evaluateUser:'傻逼',evaluateText:'真的有这么 好吗?',},
                                        {evaluateUser:'傻逼',evaluateText:'真的有这么 好吗?',},
                                        {evaluateUser:'傻逼',evaluateText:'真的有这么 好吗?',},
                                        {evaluateUser:'傻逼',evaluateText:'真的有这么 好吗?',},
                                        {evaluateUser:'傻逼',evaluateText:'真的有这么 好吗?',},
                                        {evaluateUser:'傻逼',evaluateText:'真的有这么 好吗?',},
                                    ],
                            },
                            {
                                personalImg:'https://image.aftdc.com/images/packageA/shopImg2.jpg',name:'千与千寻',star:5,message:'不错,很喜欢这家的汉堡,实惠又好吃,重点是配送的小姐姐很好看,又会说话不错,很喜欢这家的汉堡,实惠又好吃,重点是配送的小姐姐很好看,又会说话>_<',
                                grade:6,time:'2018-09-06',browse:4,zanNumber:0,zanIcon:false,commentContentLength:false,takeup:0,messageHide:false,detailsText:'服务差,味道差,分量少,肉类一般,环境差',
                                pictureList:
                                    [
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                    ],
                                evaluate:
                                    [
                                        {evaluateUser:'傻逼',evaluateText:'真的有这么 好吗?',},
                                        {evaluateUser:'傻逼',evaluateText:'真的有这么 好吗?',},
                                    ],
                            },
                            {
                                personalImg:'https://image.aftdc.com/images/packageA/shopImg2.jpg',name:'千与千寻',star:5,message:'不错,很喜欢这家的汉堡,实惠又好吃,重点是配送的小姐姐很好看,又会说话不错,很喜欢这家的汉堡,实惠又好吃,重点是配送的小姐姐很好看,又会说话>_<',
                                grade:6,time:'2018-09-06',browse:4,zanNumber:0,zanIcon:false,commentContentLength:false,takeup:0,messageHide:false,detailsText:'服务差,味道差,分量少,肉类一般,环境差',
                                pictureList:
                                    [
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                        {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                                    ],
                                evaluate:
                                    [
                                        {evaluateUser:'傻逼',evaluateText:'真的有这么 好吗?',},
                                        {evaluateUser:'傻逼',evaluateText:'真的有这么 好吗?',},
                                    ],
                            },
                        ],//最新
                    },
                ],//所有评价的内容

                //动画内容star

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
                //动画内容end

            }
        },
        methods:{
            minibarLeftButtonClick(){},

            //头部导航菜单的点击切换star
            selectedClick(index){
                this.sliderIndex=index;
            },
            change(e){
                this.sliderIndex=e.index;
            },
            //头部导航菜单的点击切换end

            lableIconClick(){
                if (this.bottoIconClick==false){
                    this.bottoIconClick=true;
                }
                else{
                    this.bottoIconClick=false;
                }
            },//导航标签的点击展开收起

            lableClick(index){
                for(var i in this.lableList){
                    this.lableList[i].lableClass=false;
                }
                this.lableList[index].lableClass=true;
            },//导航标签的点击选择

            blur(){
                this.messageBoard=false;
                this.bridging=0;
                this.blankLeft=-750;
            },//输入框的失去焦点

            blankClick(){
                var that=this;
                that.$refs.inputMessage.blur();
                that.blankLeft=-750;

            },

            wxcMaskSetHidden(){
                this.show=false;
                this.delShow=false;

            },//组件的默认事件

            textThreeClick(){
                this.show=false;
            },//弹出层组件的点击关闭


            cancelClick(){
                var that=this;
                that.delShow=false;
            },//删除评论的点击取消



            leavingClick(){
                var that=this;
                var messageAllIndex=that.messageAll[that.sliderIndex].messageList;//把下面重复的东西定义成变量
                if(that.messageText!==''){
                    that.messageBoard=false;
                    if(that.reply==''){
                        messageAllIndex[that.bridging].evaluate.push({evaluateUser:'千寻',evaluateText:that.messageText,},)
                    }
                    else{
                        messageAllIndex[that.bridging].evaluate.push({evaluateUser:'千寻',evaluateUserOther:that.reply,evaluateText:that.messageText,},)
                    }
                    that.$refs.inputMessage.blur();
                    that.blankLeft=-750;
                    messageAllIndex[that.bridging].takeup=1;
                    messageAllIndex[that.bridging].commentContentLength=1;
                    that.messageText='';
                }
                else{
                    that.$refs.inputMessage.blur()
                    that.blankLeft=-750;
                    that.messageBoard=false;
                    that.show=true;
                }
            }, //发送评论的点击发送和未输入内容的提示


            replyClick(index,index2){
                var that=this;
                var messageAllIndex=that.messageAll[that.sliderIndex].messageList;//把下面重复的东西定义成变量
                if(messageAllIndex[index].evaluate[index2].evaluateUser===that.myevaluateUser){
                    that.delShow=true;
                }
                else{
                    that.messageBoard=true;
                    that.reply=messageAllIndex[index].evaluate[index2].evaluateUser;
                    setTimeout(function () {
                        that.$refs.inputMessage.focus();
                        that.blankLeft=0;
                    },300)
                }
                that.bridging=index;//给后面点击留言的精确定位
                that.bridgingTwo=index2;
            }, //点击评论的内容判断是回复别人的内容还是删除自己评论的内容


            deleteClick(){
                var that=this;
                var messageAllIndex=that.messageAll[that.sliderIndex].messageList;//把下面重复的东西定义成变量
                messageAllIndex[that.bridging].evaluate.splice(that.bridgingTwo,1);
                that.delShow=false;
                that.delSuccess=true;
                setTimeout(function () {
                    that.delSuccess=false;
                },1200)
            }, //当点击评论的内容是自己写的时候,有个删除的弹出框



            takeupClick(index){
                var that=this;
                var messageAllIndex=that.messageAll[that.sliderIndex].messageList;//把下面重复的东西定义成变量
                if (messageAllIndex[index].takeup==true){
                    messageAllIndex[index].takeup=false;
                }
                else{
                    messageAllIndex[index].takeup=true;
                }
            },//当评论的内容多于三条时,默认收起,点击展开


            commentClick(index){
                var that=this;
                    that.reply='';
                    that.bridging=index;       //获取点中哪一个评价的index
                    that.messageBoard=true;
                    setTimeout(function () {
                        that.$refs.inputMessage.focus();
                        that.blankLeft=0;
                    },400)
            }, //点击评论图标弹出输入框,自动获取焦点


            //
            animationClick(index) {
                var that=this;
                var messageAllIndex=that.messageAll[that.sliderIndex].messageList;//把下面重复的东西定义成变量
                if(messageAllIndex[index].zanIcon==false){//用sliderIndex去判断选中哪一个(全部,晒图,低分,最新)
                    messageAllIndex[index].zanIcon=true
                    messageAllIndex[index].zanNumber+=1;

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
                else{
                    messageAllIndex[index].zanIcon=false;
                    messageAllIndex[index].zanNumber-=1;
                }

            },//点赞的动画
            toDetailsOfEvaluation(){
                var param='';
                var url='http://assets/detailsOfEvaluation.js'
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
    .releaseBtnTwo{
        color: #53beb7;
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
        background-color: rgba(0,0,0,0.5);

    }
    .lableTextClick{
        color: #53beb7;
        border-color: #53beb7;
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
        margin-top: 10px;
        margin-right: 10px;
    }
    .commentDiv{
        margin-bottom: 15px;
        flex-direction: row;
        border-top-style: solid;
        border-top-width: 2px;
        border-top-color: #f1f1f1;
        padding-top: 7px;

    }
    .cell{
        width: 750px;
    }
    .list{
        position: absolute;
        top: 0;
        bottom: 0;
        width: 750px;
    }
    .takeUp{
        color: #4d6f8e;
        margin-top: 15px;
        margin-bottom: 15px;
        flex: 1;
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
        width: 650px;
        background-color: #fff;
        border-radius: 10px;
    }
    .messageBoardTwo{
        position: fixed;
        bottom: 0;
        background-color: #fff;
        width: 750px;
        border-style: solid;
        border-width: 2px;
        border-color: #f8f8f8;
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
    .commentContent{
        flex: 1;
    }
    .comment{
        flex-direction: row;
        align-items: center;
        padding-top: 7px;
        padding-bottom: 7px;
        width: 520px;
    }
    .comment:active{
        background-color: #f1f1f1;
    }
    .feedbackZanNum{
        color: #999;
    }
    .feedbackZanIcon{
        width: 32px;
        height: 32px;
    }
    .feedbackZan{
        width: 150px;
        padding-top: 8px;
        padding-bottom: 8px;
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
    .browse{
        color: #999;
        flex: 1;
    }
    .feedback{
        flex-direction: row;
        align-items: center;
        padding-top: 30px;
        padding-bottom: 30px;
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
        lines:5;
        text-overflow: ellipsis;

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
    .starText{
        color: #999;
    }
    .messageInfoIcon{
        width: 30px;
        height: 30px;
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
        border-radius: 70px;
    }
    .messageDiv{
        flex-direction: row;
        align-items: center;
    }
    .message{
        border-bottom-style: solid;
        border-bottom-color: #f1f1f1;
        border-bottom-width: 2px;
        padding-top: 40px;
        padding-left: 30px;
        padding-right: 30px;
    }
    .lableIcon{
        flex-direction: row;
        justify-content: center;
        padding-top: 30px;
        /*padding-bottom: 30px;*/
    }
    .Icon{
        width: 28px;
        height: 25px;
    }
    .lableText{
        padding-top: 10px;
        padding-bottom: 10px;
        padding-left: 25px;
        padding-right: 25px;
        border-style: solid;
        border-width: 1px;
        border-color: #e1e1e1;
        margin-right: 20px;
        margin-top: 20px;
        border-radius: 40px;
        color: #999;
    }
    .lableText:active{
        background-color: #f8f8f8;
    }
    .labelContent{
        flex-direction: row;
        align-items: center;
        flex-wrap: wrap;
        overflow: hidden;
    }
    .lable{
        padding-top: 10px;
        padding-left: 30px;
        padding-right: 30px;
        padding-bottom: 30px;
        border-bottom-style: solid;
        border-bottom-width: 1px;
        border-bottom-color: #e1e1e1;
    }

    .slider{
        width: 750px;
        flex: 1;
        position: relative;
        border-top-style: solid;
        border-top-color: #f1f1f1;
        border-top-width: 2px;

    }
    .barTextOne{
        font-weight: bold;
    }
    .whole{
        flex-direction: row;
        align-items: center;
        justify-content: center;
        flex: 1;
        border-bottom-style: solid;
        border-bottom-width: 7px;
        border-bottom-color: #fff;
        padding-top: 30px;
        padding-bottom: 30px;

    }
    .albumBar{
        flex-direction: row;
        align-items: center;
    }
    .wrapper{
        position: relative;
    }
</style>
