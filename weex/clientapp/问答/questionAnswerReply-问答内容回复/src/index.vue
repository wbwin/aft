<template>
    <div class="wrapper" @touchstart="press">
        <!-- 导航栏 -->

        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    @wxcMinibarRightButtonClicked="openBottomPopup"
                    v-once
            >
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">阿凡提问答</text>
                <image class="navigationRightIcon" slot="right" src="https://image.aftdc.com/appBimg/ic_more_head.png" ></image>
            </wxc-minibar>
        </div>

        <!-- 主体内容 -->
        <scroller class="scroller" show-scrollbar="false">
            <!-- 头部问题 -->
            <div class="problem">
                <text :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">{{ article.problem }}</text>
                <div class="problemBottom row">
                    <div class="answerBtn row aiCenter jcCenter" @click="popAnswerBox">
                        <image class="answerIcon" src="https://image.aftdc.com/appBimg/icon_leaveWord.png"></image>
                        <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">回答</text>
                    </div>
                    <div class="problemNumber row aiCenter jcCenter">
                        <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{ article.answerNumber }}个回答数</text>
                        <image class="problemNumberIcon" src="https://image.aftdc.com/appBimg/icon_arrow_black.png"></image>
                    </div>
                </div>
            </div>
            <!-- 回答者信息 -->
            <div class="respondent row aiCenter" ref="userName">
                <div class=" row aiCenter">
                    <div class="respondentPortrait">
                        <image class="respondentPortrait" :src="article.user.userHeadImg"></image>
                    </div>
                    <div class="respondentName">
                        <text class="respondentNameText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{ article.user.userName }}</text>
                        <text class="gray authentication" :style="{fontSize:GLOBAL.smallFS}">{{ article.user.authentication }}</text>
                    </div>
                </div>
                <div class="followBtn aiCenter jcCenter " :class="[follow?'followActiveBtn':'']" @click="followToggle()">
                    <text class="gray" v-if="follow" :style="{fontSize:GLOBAL.smallFS}">已关注</text>
                    <text class="white" v-else :style="{fontSize:GLOBAL.smallFS}">关注</text>
                </div>
            </div>
            <!-- 回答内容  -->
            <div class="answer">
                <div v-for="item in article.answerContent">
                    <text class="answerText" v-if="item.text !== ''" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{ item.text }}</text>
                    <image class="answerContentImg" :src="item.image" v-if="item.image !== ''"></image>
                </div>
                <text class="gray mt54" :style="{fontSize:GLOBAL.defaultFS}">创建于{{ article.time }}</text>
                <div class="answerBottom row ">
                    <div class="answerBottomBtn row aiCenter jcCenter" :class="[answerFabulous?'answerBottomActiveBtn':'']" @click="answerFabulousToggle">
                        <image class="fabulous" :src="answerFabulous == true ?'https://image.aftdc.com/images/zhan.png':'https://image.aftdc.com/images/nozhan.png'" ></image>
                        <text v-if="article.fabulousNumber < 1" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">赞</text>
                        <text   v-else :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{ article.fabulousNumber }}</text>
                    </div>
                    <div class="answerBottomBtn row a aiCenter jcCenter">
                        <image class="report" src="http://chuantu.biz/t6/338/1530695797x-1566688712.png"></image>
                        <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">举报</text>
                    </div>
                </div>
            </div>
            <!-- 灰色线条 -->
            <div class="grayLine"></div>
            <!-- 回答评论区 -->
            <div class="comment" ref="comment">
                <div class="commentTitle row">
                    <text class=" ml30" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">评论&nbsp;{{ commentData.length }}</text>
                    <text class=" mr30" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{ article.fabulousNumber }}&nbsp;赞</text>
                </div>
                <div class="commentContent" v-if="commentData.length >= 1">
                    <div class="commentItem" v-for="(item,index) in commentData" @click="toDetailsOfQuestionReview">
                        <div class="ItemHead row aiCenter">
                            <div class="itemHeadLeft row aiCenter">
                                <div class="userPortrait">
                                    <image class="userPortrait" :src="item.userHeadImg"></image>
                                </div>
                                <div class="userInfo">
                                    <text class="blue" :style="{fontSize:GLOBAL.bigFS}">{{ item.userName }}</text>
                                    <text class="authentication gray" :style="{fontSize:GLOBAL.defaultFS}">{{ item.authentication }}</text>
                                </div>
                            </div>
                            <div class="commentFabulous row aiCenter" @click="commentFabulousToggle(index)">
                                <image class="commentFabulousIcon" :src="item.fabulous == true ?'https://image.aftdc.com/images/zhan.png':'https://image.aftdc.com/images/nozhan.png'" ></image>
                                <text class="commentFabulousNumber" v-if="item.fabulousNumber < 1">赞</text>
                                <text class="commentFabulousNumber"  v-else :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{ item.fabulousNumber }}</text>
                            </div>
                        </div>
                        <text class="userComment" ref="textEl" :class="[item.height > 320?'userCommentLine6':'']" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{ item.commentContent }}</text>
                        <div class="itemBottom row">
                            <div class="row aiCenter">
                                <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{ item.time }}&nbsp;·&nbsp;</text>
                                <text v-if="item.replyNumber < 1" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">回复</text>
                                <div class="reply aiCenter jcCenter" v-else>
                                    <text :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">{{ item.replyNumber }} 回复</text>
                                </div>
                                <text class="commentDelet" v-if="item.userId == me.id" @click="openMask(index)" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">删除</text>
                            </div>
                            <text class="fullText blue" v-if="item.height > 320" :style="{fontSize:GLOBAL.defaultFS}">全文</text>

                        </div>
                    </div>
                </div>
                <div class="notComment aiCenter jcCenter" v-else>
                    <text class="gray" @click="showCommentBox" :style="{fontSize:GLOBAL.defaultFS}">暂无评论，点击抢沙发</text>
                </div>
            </div>
        </scroller>
        <!-- 页脚评论框 -->
        <div class="footer row aiCenter" @click.stop="preventBubbles">
            <div class="row aiCenter" v-if="comment">
                <div class="commentInputBg" >
                    <div class="grayBg"></div>
                    <input class="commentInput" type="text" placeholder="优质评论将会被优先展示" ref="inputMessage"  v-model="commentInput" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">
                </div>
                <text class="releaseBtn " :class="[commentInput.length >= 1?'themeColor':'']" @click="releaseComment" :style="{fontSize:GLOBAL.bigFS}">发布</text>
            </div>
            <div class="row aiCenter" v-else>
                <div class="writeComment row aiCenter" @click="showCommentBox">
                    <div class="writeCommentLeft row aiCenter">
                        <image class="writeCommentIcon" src="https://image.aftdc.com/appBimg/icon_leaveWord.png"></image>
                        <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">写评论...</text>
                    </div>
                    <image class="smilingFace" src="https://image.aftdc.com/appBimg/ic_smiling_face_black.png"></image>
                </div>
                <div class="commentBtn aiCenter jcCenter" @click="toComment">
                    <image class="commentIcon" src="https://image.aftdc.com/appBimg/icon_articleComment.png"></image>
                    <div class="commentNumber aiCenter jcCenter" v-if="commentData.length > 0">
                        <text class="commentNumberText white" >{{ commentData.length }}</text>
                    </div>
                </div>
                <div @click="answerFabulousToggle">
                    <image class="buttoFabulous" :src="answerFabulous == true ?'https://image.aftdc.com/images/zhan.png':'https://image.aftdc.com/images/nozhan.png'" ></image>
                </div>
                <image class="next" src="http://chuantu.biz/t6/338/1530752200x-1566688712.png"></image>
            </div>

        </div>
        <!-- 底部弹层 -->
        <wxc-popup popup-color="rgb(244, 244, 244)"
                   :show="isBottomShow"
                   @wxcPopupOverlayClicked="popupOverlayBottomClick"
                   pos="bottom"
                   :animation="ani"
                   height="624"
                   ref="wxcPopup">
            <div class="popup">
                <div class="popupTop row">
                    <div class="popupItem aiCenter">
                        <div class="popupItemIcon aiCenter jcCenter">
                            <image class="popupItemImgPyq" src="https://image.aftdc.com/appBimg/logo_weixin_friends.png"></image>
                        </div>
                        <text class="popupIteText" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">朋友圈</text>
                    </div>
                    <div class="popupItem aiCenter">
                        <div class="popupItemIcon aiCenter jcCenter">
                            <image class="popupItemImgWeixin" src="https://image.aftdc.com/appBimg/logo_weixin.png"></image>
                        </div>
                        <text class="popupIteText" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">微信好友</text>
                    </div>
                    <div class="popupItem aiCenter">
                        <div class="popupItemIcon aiCenter jcCenter">
                            <image class="popupItemImgQQ" src="https://image.aftdc.com/appBimg/logo_QQ.png"></image>
                        </div>
                        <text class="popupIteText" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">腾讯QQ</text>
                    </div>
                    <div class="popupItem aiCenter">
                        <div class="popupItemIcon aiCenter jcCenter">
                            <image class="popupItemImgKj" src="https://image.aftdc.com/appBimg/logo_QQ_zone.png"></image>
                        </div>
                        <text class="popupIteText" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">QQ空间</text>
                    </div>
                </div>
                <div class="popupButton row">
                    <div class="popupItem aiCenter mr54">
                        <div class="popupItemIcon aiCenter jcCenter">
                            <image class="headline" src="http://chuantu.biz/t6/338/1530754196x-1566688712.png"></image>
                        </div>
                        <text class="popupIteText" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">帮上头条</text>
                    </div>
                    <div class="popupItem aiCenter mr54">
                        <div class="popupItemIcon aiCenter jcCenter" @click="answerCollectionToggle">
                            <image class="collection" :src="answerCollection == true?'http://chuantu.biz/t6/339/1530847049x-1404755534.png':'http://chuantu.biz/t6/338/1530754577x-1566688712.png'" ></image>
                        </div>
                        <text class="popupIteText" v-if="answerCollection" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">取消收藏</text>
                        <text class="popupIteText" v-else :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">加入收藏</text>
                    </div>
                    <div class="popupItem aiCenter mr54">
                        <div class="popupItemIcon aiCenter jcCenter">
                            <image class="popupItemImgReport" src="https://image.aftdc.com/appBimg/ic_report.png"></image>
                        </div>
                        <text class="popupIteText" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">举报</text>
                    </div>

                    <div class="popupItem aiCenter" >
                        <div class="popupItemIcon aiCenter jcCenter">
                            <image class="popupItemImgPullBlack" src="http://chuantu.biz/t6/338/1530754950x-1566688712.png"></image>
                        </div>
                        <text class="popupIteText" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">复制链接</text>
                    </div>

                </div>

                <div class="popupClose aiCenter" @click="orderTrackingclose">
                    <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">取消</text>
                </div>
            </div>
        </wxc-popup>
        <!-- 回答框 -->
        <div class="answerBox" @click.stop="preventBubbles" ref="answerBox">
            <div class="answerBoxHead row aiCenter">
                <text class="fanswerBoxFont gray" @click="closeAnswerBox" :style="{fontSize:GLOBAL.bigFS}">取消</text>
                <text class="fanswerBoxFont blue" :style="{fontSize:GLOBAL.biggerFS}">图文</text>
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
                            <div class="closeAnswerImg">
                                <div class="closeAnswerImgA"></div>
                                <div class="closeAnswerImgB"></div>
                            </div>
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
        <!-- 评论删除提示框 -->
        <wxc-mask height="322"
                  width="566"
                  border-radius="10"
                  duration="100"
                  mask-bg-color="#FFFFFF"
                  :has-animation="hasAnimation"
                  :has-overlay="true"
                  :show-close="false"
                  :show="show"
                  :overlay-cfg="overlay"
                  @wxcMaskSetHidden="wxcMaskSetHidden">
            <div class="mask" @click.stop="preventBubbles">
                <text class="maskTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">提示</text>
                <text class="maskContent" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">确定删除此评论？</text>
                <div class="maskBtn row">
                    <text class="maskSure" @click="wxcMaskSetHidden" :style="{fontSize:GLOBAL.defaultFS}">取消</text>
                    <text @click="commentDelect" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}">确定</text>
                </div>
            </div>
        </wxc-mask>
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
        <!-- 点赞动画大图 -->
        <image class="bigZhan" ref="test" src="https://image.aftdc.com/images/zhan.png"></image>
    </div>
</template>
<script>
    import { WxcPopup,WxcMask,WxcMinibar } from 'weex-ui';
    const modal = weex.requireModule('modal')
    const animation = weex.requireModule('animation')
    const dom = weex.requireModule('dom')
    const event=weex.requireModule('event')
        export default {
        data() {
            return {
                draftShow:false,//退出保存草稿提示框
                follow: false,// 是否关注
                answerFabulous: false,// 是否点赞
                answerCollection: false,// 是否收藏这个回答
                comment: false, // 底部评论框是否弹起
                commentInput: '', // 监听评论框字符串
                answerTextarea: '', // 监听回答框字符串
                scrollerComment:false,//是否滚动到评论
                // 登陆者的信息
                me: {
                    id: 5,
                    meHeadImg: 'https://img2.woyaogexing.com/2018/06/25/e0b2d6d4e4d1f778!480x480.jpg',
                    meName: '洪荒少女',
                    authentication: '蓝叠星空南窑官方代言人'
                },
                // 回答数据
                article: {
                    user: {
                        userId: 1,
                        userName: '阿比达',
                        userHeadImg: 'http://www.shangol.cn/uploads/allimg/20180306/1P306041552U63.jpg',
                        authentication: '阿比达官方账号',
                        userFans: 210000,
                    },
                    answerContent: [
                        {
                            text: '最近几年，「国民」这个词是越来越流行，许多东西都会跟「国民」扯上关系：明星们被称为「国民偶像」，食品也可以被称为「国民食品」，还有「国民运动」等等…… 但其实「国民xx」这种说法可不是近期才有的。拿汽车来举例吧，',
                            image: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1531546671&di=188726dd070dd55b1b05d0d8cb5b6da5&imgtype=jpg&er=1&src=http%3A%2F%2Fwww.ccutu.com%2Fupload%2Fimages%2F2017-2%2F77370c68a0ffa93bb643bc92fd33258c.jpg'
                        },
                        {
                            text: '从 20 世纪初开始，「国民车」这个概念就这几款车的流行时间、外观等等都各不一样，但是作为各个国家的「国民车」，他们还是有不少共同点的：首先，他们的价格都非常实惠，当年德国普通工人只需要 10 个月的工资，即可买得起一辆甲壳虫；其次，他们的能耗都不算高，',
                            image: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1530951897544&di=9d80645ed5c289bb0188f788655cc224&imgtype=0&src=http%3A%2F%2Farticle.fd.zol-img.com.cn%2Ft_s501x2000%2Fg5%2FM00%2F07%2F02%2FChMkJ1fqFWuIRPRwAAdnhDkOzTIAAWZoAK2M6kAB2ec194.jpg'
                        },
                        {
                            text: '避免了「买得起车加不起油 」的尴尬；最后，他们的空间都不算小，可以满足一家人外出的需求。 那如果要在中国也找出一款「国民车」，有没有能满足以上三种条件的车型呢？戳开视频就知道：',
                            image: ''
                        }
                    ],
                    id: 10,
                    problem: '中国打造一款 [ 国民车 ]  ，都需要些什么条件？',
                    answerNumber: 12,
                    fabulousNumber: 88,
                    time: '2018.7.2'
                },
                // 评论数据
                commentData: [
                    {
                        userId: 1,
                        userHeadImg: 'https://img2.woyaogexing.com/2018/07/04/2ea0760046139080!400x400_big.jpg',
                        userName: '杰克',
                        authentication: '头条作者，优质作品专注人',
                        commentContent: '狄德罗等人的《百科全书》百科全书型的作品在人类历史上并不少见，但直到16世纪的西方，才开始出现“百科全书”这个名词。最早将“百科全书”用于书名的，古代的许多作家都曾经试图全面地记录人类的所有知识。',
                        fabulousNumber: 0,
                        time: '07-03 08:49',
                        replyNumber: 4,
                        height: 0,
                        fabulous: false
                    },
                    {
                        userId: 2,
                        userHeadImg: 'https://img2.woyaogexing.com/2018/07/03/826965c27ccedddb!400x400_big.jpg',
                        userName: '浅岛溺心',
                        authentication: '头条号作者，阿比达网官方账号',
                        commentContent: '在MINI成为英国国民车的时候，它还没有被宝马收购，因此其身上浓浓的英伦风情也一直保留至今，深深融进了血液里。因此其身上浓浓的英伦风情也一直保留至今，深深融进了血液里因此其深深融进了血试图全面地记录人类的所有知识。',
                        fabulousNumber: 8,
                        time: '07-02 09:36',
                        replyNumber: 5,
                        height: 0,
                        fabulous: false
                    },
                    {
                        userId: 3,
                        userHeadImg: 'https://img2.woyaogexing.com/2018/07/04/2ea0760046139080!400x400_big.jpg',
                        userName: '杰克',
                        authentication: '头条作者，优质作品专注人',
                        commentContent: '狄德罗等人的《百科全书》百科全书型的作品在人类历史上并不少见，但直到16世纪的西方，才开始出现“百科全书”这个名词。最早将“百科全书”用于书名的，古代的许多作家都曾经试图全面地记录人类的所有知识。但是，约翰·哈里斯才认为是第一个创立了现代意义上的百科全书。929年，随着第14版的问世。',
                        fabulousNumber: 3,
                        time: '07-03 08:49',
                        replyNumber: 0,
                        height: 0,
                        fabulous: false
                    },
                    {
                        userId: 4,
                        userHeadImg: 'https://img2.woyaogexing.com/2018/07/03/826965c27ccedddb!400x400_big.jpg',
                        userName: '浅岛溺心',
                        authentication: '头条号作者，阿比达网官方账号',
                        commentContent: '在MINI成为英国国民车的时候，它还没有被宝马收购，因此其身上浓浓的英伦风情也一直保留至今，深深融进了血液里。。',
                        fabulousNumber: 8,
                        time: '07-02 09:36',
                        replyNumber: 5,
                        height: 0,
                        fabulous: false
                    }
                ],
                // 回答框图片
                answerBoxImg: [
                    "https://img2.woyaogexing.com/2018/07/03/377a8e3aab6e9389!400x400_big.jpg",
                    "http://img3.duitang.com/uploads/item/201410/20/20141020063514_XMQrF.jpeg",
                    "https://img2.woyaogexing.com/2018/07/05/db62fe53f33b1ee7!480x480.jpg",
                    "https://img2.woyaogexing.com/2018/07/04/ebf6eba3b4794b3a96df0a61ed0e2993!400x400.jpeg",
                    "https://img2.woyaogexing.com/2018/07/04/529c90284209cf7c!400x400_big.jpg"
                ],
                //点赞动画
                rotateRight:{styles:
                        {

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
                // 评论删除弹出层
                show: false,
                overlayCanClose: true,
                isFalse: false,
                hasAnimation: true,
                overlay: {
                    duration: 150
                },
                delectCommentIndex: '',
                // 底部弹层
                isBottomShow: false,
                ani:{
                    timingFunction: 'ease'
                },
            }
        },
        components: { WxcPopup,WxcMask,WxcMinibar },
        methods: {

            minibarLeftButtonClick(){},
            // 底部弹层
            openBottomPopup () {
                this.isBottomShow = true;
                this.press()
            },
            orderTrackingclose () {
                this.$refs.wxcPopup.hide()
            },
            //非状态组件，需要在这里关闭
            popupOverlayBottomClick () {
                this.isBottomShow = false;
            },
            // 关注或取消关注回答者
            followToggle(){
                if(this.follow == false){
                    this.article.user.userFans ++
                }else {
                    this.article.user.userFans --
                }
                this.follow = !this.follow
            },
            // 点赞或取消点赞回答
            answerFabulousToggle(){
                if(this.answerFabulous == false){
                    this.article.fabulousNumber ++
                    this.zanAnimation()
                }else {
                    this.article.fabulousNumber --
                }
                this.answerFabulous = !this.answerFabulous
            },
            // 评论区点赞或取消点赞
            commentFabulousToggle(index){
                if(this.commentData[index].fabulous == false){
                    this.commentData[index].fabulousNumber ++
                    this.zanAnimation()
                }else {
                    this.commentData[index].fabulousNumber --
                }
                this.commentData[index].fabulous = !this.commentData[index].fabulous
            },
            // 赞动画
            zanAnimation(){
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
                });
            },
            // 收藏或者取消收藏回答
            answerCollectionToggle(){
                if(this.answerCollection == false){
                    modal.toast({
                        message: '收藏成功',
                        duration: 0.3
                    })
                }else {
                    modal.toast({
                        message: '取消收藏',
                        duration: 0.3
                    })
                }
                this.answerCollection = !this.answerCollection
            },
            // 弹出底部评论框input获取焦点
            showCommentBox(){
                this.comment = true
                let that = this
                setTimeout(function () {
                    that.$refs.inputMessage.focus()
                },100)
            },
            // 跳到评论部分
            toComment(){
                var that=this
                if(!that.scrollerComment){
                    that.scrollerComment=true
                dom.scrollToElement(this.$refs.comment, {})
                }else{
                   that.scrollerComment=false
                    dom.scrollToElement(this.$refs.userName, {})
                }

            },
            // 底层input失去焦点
            press(){
                if(this.comment){
                    this.$refs.inputMessage.blur()
                    let that = this
                    setTimeout(function () {
                        that.comment = false
                    },100)
                }
            },
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
                this.$refs.textareaMessage.blur();
                if(this.answerTextarea!=''){
                    this.draftShow=true;
                }
                else{
                    var answerBox = this.$refs.answerBox;
                    this.answerTextarea = ''
                    this.$refs.textareaMessage.blur()
                    animation.transition(answerBox, {
                        styles: {
                            transform: 'translateY(1600px)'
                        },
                        duration: 500, //ms
                        timingFunction: 'ease-in',
                        delay: 0 //ms
                    })
                }
            },
            // 阻止冒泡
            preventBubbles(){},
            // 回答框图片删除关闭
            closeAnswerImg(index){
                this.answerBoxImg.splice(index,1)
            },
            // 发布评论
            releaseComment(){
                if(this.commentInput.length >= 1){
                    let that = this
                    this.$refs.inputMessage.blur()
                    // this.commentTemplate.commentContent = this.commentInput
                    let data = new Date();
                    let commentTime = ('0' + (data.getMonth() + 1)).slice(-2)+'-'+('0' + data.getDate()).slice(-2)+' '+('0' + data.getHours()).slice(-2)+':'+('0' + data.getMinutes()).slice(-2);
                    this.commentData.unshift({
                        userId: this.me.id,
                        userHeadImg: this.me.meHeadImg,
                        userName: this.me.meName,
                        authentication: this.me.authentication,
                        commentContent: this.commentInput,
                        fabulousNumber: 0,
                        time: commentTime,
                        replyNumber: 0,
                        height: 0,
                        fabulous: false
                    })
                    setTimeout(() => {
                        dom.getComponentRect(this.$refs.textEl[0], option => {
                            if (option.result && option.size) {
                                this.commentData[0].height = option.size.height
                            }
                        })
                    }, 20)
                    setTimeout(function () {
                        that.comment = false
                        that.commentInput = ''
                    },100)
                    dom.scrollToElement(this.$refs.comment, {})

                }else{

                }
            },
            draftCancelClick(){
                this.draftShow=false;
            },
            draftconfirmClick(){
                this.draftShow=false;
                var answerBox = this.$refs.answerBox;
                this.$refs.textareaMessage.blur()
                animation.transition(answerBox, {
                    styles: {
                        transform: 'translateY(1600px)'
                    },
                    duration: 500, //ms
                    timingFunction: 'ease-in',
                    delay: 0 //ms
                })
            },

            // 评论me删除提示
            openMask (index) {
                this.show = true;
                this.hasAnimation = true;
                this.delectCommentIndex = index
            },
            wxcMaskSetHidden () {
                this.show = false;
                this.draftShow=false;
            },
            openNoAnimationMask (e) {
                this.show = true;
                this.hasAnimation = false;
            },
            // 删除me的评论
            commentDelect(){
                this.show = false;
                this.commentData.splice(this.delectCommentIndex,1)
            },
            // 发布答案
            releaseAnswer(){
                if(this.answerTextarea.length >= 1){

                }else{
                    modal.toast({
                        message: '没有内容不能发布',
                        duration: 0.3
                    })
                }
            },
            toDetailsOfQuestionReview(){
                var param=''
                var url='http://assets/detailsOfQuestionReview.js'
                event.toUrl({"url":url,"param":param})
            },
        },
        mounted () {
            setTimeout(() => {
                for(let i in this.commentData) {
                    dom.getComponentRect(this.$refs.textEl[i], option => {
                        if (option.result && option.size) {
                            this.commentData[i].height = option.size.height
                        }
                    })
                }
            }, 20)

        }
    }
</script>

<style scoped>
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
    .wrapper {

    }
    .minibar {
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: #f1f1f1;
    }
    .backImg {
        width: 40px;
        height: 40px;
    }
    .scroller {
        /*margin-top: 80px;*/
    }
    /* 公共样式 */
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
    .mt54 {
        margin-top: 54px;
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
    /* 导航栏 */
    .navigationBar {
        width: 750px;
        height: 80px;
        background-color: #53beb7;
        position: fixed;
        top: 0;
        left: 0;
    }
    .navigationLeft {
        flex: 1;
    }
    .navigationLeftIcon {
        margin-left: 30px;
        width: 40px;
        height: 40px;
    }
    .navigationMiddle {
        flex: 1;
    }
    .navigationRight {
        flex-direction: row-reverse;
        width: 50px;
        flex: 1;
    }
    .navigationRightIcon {
        width: 50px;
        height: 50px;
        /*margin-left: 30px;*/
        /*margin-right: 30px;*/
    }

    /* 头部问题 */
    .problem {
        margin-top: 34px;
        padding-bottom: 34px;
        margin-left: 30px;
        margin-right: 30px;
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #f6f5f5;
    }
    .problemBottom {
        margin-top: 32px;
    }
    .answerBtn {
        margin-right: 60px;
    }
    .answerIcon {
        width: 30px;
        height: 30px;
        margin-right: 12px;
    }
    .problemNumber {

    }
    .problemNumberIcon {
        width: 22px;
        height: 30px;
        margin-left: 4px;
    }
    /* 回答者头部信息 */
    .respondent {
        justify-content: space-between;
        padding-top: 40px;
        padding-left: 30px;
        padding-right: 30px;
    }
    .respondentPortrait {
        width: 78px;
        height: 78px;
        border-radius: 50px;
    }
    .respondentName {
        margin-left: 16px;
    }
    .respondentNameText {
        font-weight: 600;
        line-height: 30px;
        margin-bottom: 4px;
    }
    .followBtn {
        width: 110px;
        height: 54px;
        background-color: #53beb7;
        border-radius: 10px;
    }
    .followActiveBtn {
        background-color: #fff;
        border-width: 1px;
        border-style: solid;
        border-color: #cfcfcf;
    }
    .followActiveText {
        color: #aaaaaa;
    }
    /* 答复内容 */
    .answer {
        padding-left: 30px;
        padding-right: 30px;
        padding-top: 66px;
    }
    .answerText {
        line-height: 45px;
    }
    .answerContentImg {
        width: 690px;
        height: 340px;
        margin-top: 30px;
        margin-bottom: 30px;
    }
    .answerBottom {
        justify-content: space-between;
        padding-top: 54px;
        padding-bottom: 36px;
        padding-left: 100px;
        padding-right: 100px;
    }
    .answerBottomBtn {
        width: 168px;
        height: 72px;
        border-width: 2px;
        border-style: solid;
        border-color: #d6d6d6;
        border-radius: 50px;
    }
    .answerBottomActiveBtn {
        border-width: 2px;
        border-style: solid;
        border-color: #53beb7;
    }
    /*.answerBottomActiveText {*/
        /*color: #f85959;*/
    /*}*/
    .fabulous {
        width: 32px;
        height: 35px;
        margin-right: 10px;
    }
    .answerBottomText {
        font-size: 26px;
    }
    .report {
        width: 32px;
        height: 32px;
        margin-right: 10px;
    }
    /* 灰色直线 */
    .grayLine {
        widht: 750px;
        height: 18px;
        background-color: #f4f5f6;
    }
    /* 评论区内容 */
    .comment {
        padding-bottom: 110px;
    }
    .commentTitle {
        justify-content: space-between;
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #e8e8e8;
        padding-top: 30px;
        padding-bottom: 30px;
    }
    .ml30 {
        margin-left: 30px;
    }
    .mr30 {
        margin-right: 30px;
    }
    .commentContent {
        /*padding-left: 30px;*/
        /*padding-right: 30px;*/
    }
    .commentItem {
        padding-top: 26px;
        padding-bottom: 16px;
        padding-left: 30px;
        padding-right: 30px;
    }
    .ItemHead {
        justify-content: space-between;
    }
    .userPortrait {
        width: 76px;
        height: 76px;
        border-radius: 50px;
    }
    .userInfo {
        margin-left: 18px;
    }
    .authentication {
        max-width: 460px;
        lines: 1;
        text-overflow: ellipsis;
    }
    .commentFabulous {
        margin-right: 3px;
    }
    .commentFabulousIcon {
        width: 33px;
        height: 33px;
        margin-right: 10px;
    }
    .commentFabulousNumber {
        margin-top: 4px;
    }
    .userComment {
        line-height: 52px;      /* 最大H312 */
        padding-top: 4px;
        padding-left: 94px;
        padding-right: 8px;
        /*lines: 6;*/
        /*text-overflow: ellipsis;*/
    }
    .userCommentLine6 {
        lines: 6;
        text-overflow: ellipsis;
    }
    .itemBottom {
        height: 48px;
        padding-left: 94px;
        justify-content: space-between;
        margin-top: 8px;
    }
    .fullText {
        margin-right: 8px;
    }
    .reply {
        width: 110px;
        height: 48px;
        background-color: #f0f0f0;
        border-radius: 50px;
    }
    .notComment {
        padding-top: 150px;
        padding-bottom: 600px;
    }
    .commentDelet {
        color: #5f5f5f;
        margin-left: 40px;
    }
    .commentDelet:active {
        color: #999;
    }

    /* 页脚 */
    .footer {
        height: 94px;
        width: 750px;
        border-width: 2px;
        border-style: solid;
        border-color: #e5e5e5;
        background-color: #fff;
        position: fixed;
        left: 0;
        bottom: 0;
    }
    .writeComment {
        width: 368px;
        height: 64px;
        background-color: #f4f5f6;
        border-width: 2px;
        border-style: solid;
        border-color: #ededed;
        margin-left: 32px;
        justify-content: space-between;
        border-radius: 50px;
    }
    .writeCommentIcon {
        width: 27px;
        height: 30px;
        margin-right: 14px;
        margin-left: 32px;
    }
    .smilingFace {
        width: 41px;
        height: 41px;
        margin-right: 12px;
    }
    .commentBtn {
        height: 58px;
        width: 64px;
        margin-left: 48px;
        margin-right: 48px;
    }
    .commentIcon {
        height: 42px;
        width: 42px;
    }
    .commentNumber {
        position: absolute;
        top: 0;
        right: 0;
        width: 22px;
        height: 20px;
        background-color: #f85656;
        border-radius: 20px;
    }
    .commentNumberText {
        font-size: 18px;
    }
    .buttoFabulous {
        width: 50px;
        height: 50px;
        margin-right: 62px;
    }
    .next {
        width: 47px;
        height: 42px;
    }
    .commentInputBg {
        width: 586px;
        margin-left: 30px;
        /*border-bottom-width: 2px;*/
        /*border-bottom-style: solid;*/
        /*border-bottom-color: #edeeee;*/
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
        height: 94px;
        padding-top: 20px;
        padding-bottom: 22px;/*94 65*/
        margin-left: 20px;

    }
    .releaseBtn {
        padding-left: 28px;
        padding-right: 28px;
        padding-top: 20px;
        padding-bottom: 20px;
        font-weight: bold;
        color: #999;
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
    .closeAnswerImgA {
        width: 2px;
        height: 32px;
        background-color: #fff;
        position: absolute;
        left: 8px;
        top: -7px;
        transform: rotate(45deg);
    }
    .closeAnswerImgB {
        width: 32px;
        height: 2px;
        background-color: #fff;
        position: absolute;
        left: -7px;
        top: 8px;
        transform: rotate(45deg);
    }




    /* 底部弹出层 */
    .popup {
        flex: 1;
        position: relative;
    }
    .popupTop {
        padding-top: 50px;
        padding-bottom: 44px;
        margin-left: 46px;
        margin-right: 46px;
        justify-content: space-between;
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #eaeaea;
    }
    .popupItem {
        /*margin-right: 46px;*/
    }
    .popupItemIcon {
        width: 125px;
        height: 125px;
        background-color: #fff;
        border-radius: 100px;
    }
    .popupItemImgPyq {
        width: 64px;
        height: 64px;
    }
    .popupItemImgWeixin {
        width: 67px;
        height: 54px;
    }
    .popupItemImgQQ {
        width: 57px;
        height: 67px;
    }
    .popupItemImgKj {
        width: 64px;
        height: 64px;
    }
    .popupItemImgReport {
        width: 52px;
        height: 54px;
    }
    .popupItemImgPullBlack {
        width: 47px;
        height: 52px;
    }
    .popupIteText {
        padding-top: 18px;
    }
    .popupButton {
        padding-top: 34px;
        margin-left: 46px;
    }
    .mr54 {
        margin-right: 54px;
    }
    .popupClose {
        width: 750px;
        background-color: #f7f7f7;
        padding-top: 30px;
        padding-bottom: 30px;
        border-top-width: 2px;
        border-top-style: solid;
        border-top-color: #eaeaea;
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #eaeaea;
        position: absolute;
        bottom: 0;
    }
    .headline {
        width: 68px;
        height: 58px;
    }
    .collection {
        width: 55px;
        height: 54px;
    }
    /* 删除评论提示层 */
    .mask {
        flex: 1;
        position: relative;
        padding-top: 46px;
        padding-left: 50px;
    }
    .maskContent {
        width: 440px;
        color: #898989;
        padding-top: 40px;
        font-size: 32px;
    }
    .maskBtn {
        position: absolute;
        right: 40px;
        bottom: 38px;
    }
    .maskSure {
        color: #999;
        margin-right: 56px;
    }
    /* 点赞动画图片样式 */
    .bigZhan{
        width: 160px;
        height: 160px;
        opacity: 0;
        position: absolute;
        top: 500px;
        left: 300px;
    }

</style>
