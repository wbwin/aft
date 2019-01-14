<template>
    <div class="wrapper" @viewappear="viewappear" @viewdisappear="viewdisappear">
        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    @wxcMinibarRightButtonClicked="minibarRightButtonClick"
                    v-once>
                <div class="row aiCenter" slot="left">
                    <image :style="GLOBAL.headerImg"
                           src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                    <text :style="GLOBAL.headerRight">&nbsp;编辑</text>
                </div>
                <text :style="GLOBAL.headerCenter"  slot="middle">预览</text>
                <text :style="GLOBAL.headerRight"  slot="right">完成</text>
            </wxc-minibar>
        </div>

        <!--<video class="video" auto-play="true" v-if="video" :src="video"></video>-->

        <scroller class="scroller" :style="{backgroundColor:articleTemplate[ctTypei].atList[cti].themeColor}">

            <image class="bgImg"  :src="articleTemplate[ctTypei].atList[cti].imgUrl"></image>

            <div class="content">
                <div class="articleTitle">
                    <text class="articleTitleSize" :style="{color:articleTemplate[ctTypei].atList[cti].fontColor}">{{articleTitle}}</text>
                </div>
                <div class="article_time">
                    <div class="roundBorder">
                        <image class="shopImg" :src="'https://image.aftdc.com/'+shopImg"></image>
                        <!--<image class="shopImg" src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1535436796&di=fded9403345f58081a5d299de7939153&imgtype=jpg&er=1&src=http%3A%2F%2Fwww.qqzhi.com%2Fuploadpic%2F2014-09-22%2F050008885.jpg"></image>-->
                    </div>
                    <div class="roundBorder cerificationPosition" v-if="certification">
                        <image class="cerification" src='https://image.aftdc.com/images/daV.png'></image>
                    </div>
                    <div class="marginLeft">
                        <text :style="{fontSize:GLOBAL.bigFS,color:articleTemplate[ctTypei].atList[cti].fontColorUname,fontWeight:'bold'}">{{shopName}}</text>
                        <text class="dataSize" :style="{fontSize:GLOBAL.defaultFS,color:articleTemplate[ctTypei].atList[cti].fontColorTime}">{{today}}</text>
                        <!--<text class="readingSize" :style="{fontSize:GLOBAL.defaultFS,color:articleTemplate[ctTypei].atList[cti].fontColorTime}">阅读1</text>-->
                    </div>
                </div>
                <!--<div class="article_music" @click="musicPlay" v-if="music">-->
                    <!--<image class="musicIcon"  :src="play?'https://image.aftdc.com/appBimg/icon_stopMusic.png':'https://image.aftdc.com/appBimg/icon_playMusic.png'"></image>-->
                    <!--<text class="musicTextSize" :style="{fontSize:GLOBAL.defaultFS}">{{music.musicName}}</text>-->
                    <!--<text class="musicTextSize" :style="{fontSize:GLOBAL.defaultFS}">|</text>-->
                    <!--<text class="musicTextSize" :style="{fontSize:GLOBAL.defaultFS}">{{music.musicAuthor}}</text>-->
                <!--</div>-->

                <!--<web v-if="video" ref="firWebview" class="video" src="https://www.aftdc.com/mobile/public/video.html"-->
                     <!--@pagestart="" @pagefinish="onPageFinish" @error="" @receivedtitle=""></web>-->
                <!--<video class="video" auto-play="true" v-if="video" :src="video"></video>-->
                <!--音乐播放-->
                <div v-if="music">
                    <image class="musicImg" ref="musicImg" :style="{top:video?'650px':'180px'}" src="https://image.aftdc.com/appBimg/icon_music_check.png"  @click.stop="musicPlay" v-if="!play"></image>
                    <image class="musicImg" ref="musicImg" :style="{ transform: 'rotate(' + musicRotate + 'deg)',top:video?'650px':'180px'}" src="https://image.aftdc.com/appBimg/icon_music_check.png"  @click.stop="musicPlay" v-else></image>
                </div>
                <div>
                    <div class="article_content" v-for="(item,index) in article" v-if="imageFontRadio==0">
                        <!--//字上图下-->
                        <div style="overflow: hidden" v-if="item.content!=''">
                            <text class="textareaClon" :style="{color:articleTemplate[ctTypei].atList[cti].fontColor}">{{item.content}}</text>
                        </div>
                        <div class="imgDiv" v-if="item.localPart!=''">
                            <!--//articleType为1或2时显示-->
                            <video class="video" auto-play="true" v-if="item.video!=''" :src="video"></video>
                            <image class="imgDefault" v-if="item.video==''&&item.localPart!=''" @load="resize(index,$event)" :style="{width: item.width,height: item.height}" :src="item.localPart"></image>
                        </div>
                    </div>
                    <div class="article_content" v-for="(item,index) in article" v-if="imageFontRadio==1">
                        <!--//字下图上-->
                        <div class="imgDiv" v-if="item.localPart!=''">
                            <!--//articleType为1或2时显示-->
                            <video class="video" auto-play="true" v-if="item.video!=''" :src="video"></video>
                            <image class="imgDefault" v-if="item.video==''&&item.localPart!=''" @load="resize(index,$event)" :style="{width: item.width,height: item.height}" :src="item.localPart"></image>
                        </div>
                        <div style="overflow: hidden"  v-if="item.content!=''">
                            <text class="textareaClon" :style="{color:articleTemplate[ctTypei].atList[cti].fontColor}">{{item.content}}</text>
                        </div>
                    </div>
                </div>
                <!--投票-->
                <div class="vote" v-if="vote!=''">
                    <div class="voteTop">
                        <text class="voteTitle" :style="{color:GLOBAL.dColor,color:articleTemplate[ctTypei].atList[cti].fontColor}">{{vote.voteTopic}}</text>
                        <div class="row">
                            <!--<text class="subTitle">截止时间：{{vote.time}}&nbsp;00:00</text>-->
                            <text class="subTitle" v-if="vote.type<2">{{vote.type===1?'(单选)':'(多选)'}}</text>
                            <text class="subTitle" v-else>(最多可选{{vote.type}}项)</text>
                        </div>
                        <div class="option row"  v-for="(item,index) in vote.inputList" :class="[index===vote.inputList.length-1?'optionNoBorder':'']" @click="voteClick(item,index)">
                            <div class="optionIcon aiCenter jcCenter">
                                <div class="optionIconInside" :class="[item.checked?'optionIconChecked':'']"></div>
                            </div>
                            <text class="optionText" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor,color:articleTemplate[ctTypei].atList[cti].fontColor}" >{{item.value}}</text>
                        </div>
                    </div>
                    <div class="voteBottom aiCenter jcCenter">
                        <text :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor,color:articleTemplate[ctTypei].atList[cti].fontColor}" >完成发布后投票</text>
                    </div>
                </div>
            </div>
        </scroller>

        <div class="previewBottom" v-if="!inputFocus">
            <div class="bottomCell" @click="bottomCellClick(0)">
                <div class="iconImg templateIcon">
                    <div class="jcSp">
                        <div class="blockIcon"></div>
                        <div class="blockIcon"></div>
                    </div>
                    <div class="jcSp">
                        <div class="blockIcon"></div>
                        <div class="blockIcon"></div>
                    </div>
                </div>
                <text class="bottomTextSize darkGrey"  :style="{fontSize:GLOBAL.defaultFS}">模板</text>
            </div>
            <div class="bottomCell" @click="bottomCellClick(1)">
                <image class="iconImg" src="https://image.aftdc.com/appBimg/article-music.png"></image>
                <text class="bottomTextSize darkGrey"  :style="{fontSize:GLOBAL.defaultFS}">背景音乐</text>
            </div>
            <div class="bottomCell" @click="bottomCellClick(2)">
                <image class="iconImg" :src="imageFontRadio==0?'https://image.aftdc.com/appBimg/article-chart-down.png':'https://image.aftdc.com/appBimg/article-chart-up.png'"></image>
                <text class="bottomTextSize darkGrey" :style="{fontSize:GLOBAL.defaultFS}">{{imageFontRadio==0?'字上图下':'字下图上'}}</text>
            </div>
            <div class="bottomCell" @click="bottomCellClick(5)">
                <image class="seeing" src="https://image.aftdc.com/appBimg/ic_visible.png" v-if="openChecked===0"></image>
                <image class="seeing" src="https://image.aftdc.com/appBimg/ic_no_visible.png" v-else-if="openChecked===1"></image>
                <image class="iconImg" src="https://image.aftdc.com/appBimg/article-private.png" v-else></image>
                <text class="bottomTextSize darkGrey" :style="{fontSize:GLOBAL.defaultFS}" v-if="openChecked===0">公开</text>
                <text class="bottomTextSize darkGrey" :style="{fontSize:GLOBAL.defaultFS}" v-else-if="openChecked===1">不公开</text>
                <text class="bottomTextSize darkGrey" :style="{fontSize:GLOBAL.defaultFS}" v-else>私密</text>
            </div>
            <!--<div class="bottomCell" @click="bottomCellClick(3)">-->
                <!--<image class="iconImg"-->
                       <!--:src="commentOrleaveWord==1?'https://image.aftdc.com/appBimg/icon_comment_check.png':'https://image.aftdc.com/appBimg/icon_comment.png'"></image>-->
                <!--<text class="bottomTextSize " :class="[commentOrleaveWord==1?'checkText':'']" :style="{fontSize:GLOBAL.defaultFS}">允许评论</text>-->
            <!--</div>-->
            <div class="bottomCell" @click="bottomCellClick(4)">
                <image class="iconImg" :src="commentOrleaveWord==1?'https://image.aftdc.com/appBimg/icon_leaveWord.png':'https://image.aftdc.com/appBimg/icon_comment.png'"></image>
                <text class="bottomTextSize darkGrey" :style="{fontSize:GLOBAL.defaultFS}">{{commentOrleaveWord==1?'允许评论':'允许留言'}}</text>
            </div>
            

        </div>
        <toast ref="toast"></toast>
        <!--文章模板-->
        <div class="articleTemplateBox" ref="articleTemplateBox">
            <div class="demo-content">
                <div>
                    <scroller class="tabScroller" scroll-direction="horizontal" show-scrollbar="false">
                        <!--<div class="tabHeadLine" :style="{left:atTypeindex*134+'px'}"></div>-->
                        <div class="tabHeadContent" v-for="(item,index) in articleTemplateType" >
                            <text class="tabHeadText" ref="testEl" :style="{fontSize:GLOBAL.biggerFS}" :class="[atTypeindex===index?'atTypeActive':'']" @click="atTypeSelect(index)">{{item}}</text>
                        </div>
                    </scroller>
                    <scroller class="atScroller" scroll-direction="horizontal" show-scrollbar="false">
                        <div class="row"  ref="atType" v-for="(value,i) in articleTemplate" @appear="appear($event,i)" @disappear="disappear($event,i)">
                            <div class="articleTemplateItem" v-for="(item,index) in value.atList" :class="[ctTypei===i&&cti===index?'atiActive':'']"  @click="atSelect(i,index)">
                                <div class="atborder" ref="atEl">
                                    <image class="atImg"  :src="item.smallImgUrl"></image>
                                    <div class="atNameBg" :style="{backgroundColor:item.nameBg}">
                                        <text :style="{fontSize:'24px',color:'#4d4d4d'}">{{item.name}}</text>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="fill"></div>
                    </scroller>
                </div>
                <div class="popupButton" @click="cancelPopupClick(0)">
                    <text :style="{fontSize:GLOBAL.biggerFS}">确定</text>
                </div>
            </div>
        </div>
        <!--字上图下-->
        <wxc-popup ref="wxcPopup"
                   popup-color="#fff"
                   :show="isBottomShow"
                   @wxcPopupOverlayClicked="popupOverlayBottomClick(0)"
                   pos="bottom"
                   height="360">
            <div class="demo-content">
                <div class="openItem row aiCenter"  @click="imageFontRadioClick(1)">
                    <div class="openItemLeft row aiCenter">
                        <image class="popupImg" src="https://image.aftdc.com/appBimg/article-chart-up.png"></image>
                        <div class="openItemText">
                            <text :style="{fontSize:GLOBAL.biggerFS}">字下图上</text>
                            <text :style="{fontSize:GLOBAL.defaultFS,color:'#999999'}"></text>
                        </div>
                    </div>
                    <image class="openItemChecked" src="https://image.aftdc.com/appBimg/ic_check_box_checked.png"  v-if="imageFontRadio===1"></image>
                </div>
                <div class="openItem row aiCenter" @click="imageFontRadioClick(0)">
                    <div class="openItemLeft row aiCenter">
                        <image class="popupImg" src="https://image.aftdc.com/appBimg/article-chart-down.png"></image>
                        <div class="openItemText">
                            <text :style="{fontSize:GLOBAL.biggerFS}">字上图下</text>
                            <text :style="{fontSize:GLOBAL.defaultFS,color:'#999999'}"></text>
                        </div>
                    </div>
                    <image class="openItemChecked" src="https://image.aftdc.com/appBimg/ic_check_box_checked.png" v-if="imageFontRadio===0"></image>
                </div>

                <div class="popupButton borderGray" @click="cancelPopupClick(1)">
                    <text :style="{fontSize:GLOBAL.biggerFS}">取消</text>
                </div>
            </div>
        </wxc-popup>
        <!--公开-->
        <wxc-popup ref="wxcPopupOpen"
                   popup-color="#fff"
                   :show="isBottomShowOpen"
                   @wxcPopupOverlayClicked="popupOverlayBottomClick(1)"
                   pos="bottom"
                   height="490">
            <div class="demo-content">
               <div>
                   <div class="openItem row aiCenter" @click="openClick(0)">
                       <div class="openItemLeft row aiCenter">
                           <image class="visibleIcon" src="https://image.aftdc.com/appBimg/ic_visible.png"></image>
                           <div class="openItemText">
                               <text :style="{fontSize:GLOBAL.biggerFS}">公开</text>
                               <text :style="{fontSize:GLOBAL.defaultFS,color:'#999999'}">所有人可见</text>
                           </div>
                       </div>
                       <image class="openItemChecked" src="https://image.aftdc.com/appBimg/ic_check_box_checked.png" v-if="openChecked===0"></image>
                   </div>
                   <div class="openItem row aiCenter"  @click="openClick(1)">
                       <div class="openItemLeft row aiCenter">
                           <image class="visibleIcon" src="https://image.aftdc.com/appBimg/ic_no_visible.png"></image>
                           <div class="openItemText">
                               <text :style="{fontSize:GLOBAL.biggerFS}">不公开</text>
                               <text :style="{fontSize:GLOBAL.defaultFS,color:'#999999'}">仅粉丝可见</text>
                           </div>
                       </div>
                       <image class="openItemChecked" src="https://image.aftdc.com/appBimg/ic_check_box_checked.png"  v-if="openChecked===1"></image>
                   </div>
                   <div class="openItem row aiCenter"  @click="openClick(2)">
                       <div class="row aiCenter">
                           <image class="meVisibleIcon" src="https://image.aftdc.com/appBimg/article-private.png"></image>
                           <div class="openItemText">
                               <text :style="{fontSize:GLOBAL.biggerFS}">私密</text>
                               <text :style="{fontSize:GLOBAL.defaultFS,color:'#999999'}">仅自己可见</text>
                           </div>
                       </div>
                       <image class="openItemChecked" src="https://image.aftdc.com/appBimg/ic_check_box_checked.png"  v-if="openChecked===2"></image>
                   </div>
               </div>
                <div class="popupButton borderGray" @click="cancelPopupClick(2)">
                    <text :style="{fontSize:GLOBAL.biggerFS}">取消</text>
                </div>
            </div>
        </wxc-popup>
        <!--允许留言-->
        <wxc-popup ref="wxcPopupLam"
                   popup-color="#fff"
                   :show="isBottomShowLam"
                   @wxcPopupOverlayClicked="popupOverlayBottomClick(2)"
                   pos="bottom"
                   height="360">
            <div class="demo-content">
                <div class="openItem row aiCenter"  @click="leavingAMessage(0)">
                    <div class="openItemLeft row aiCenter">
                        <image class="popupImg" src="https://image.aftdc.com/appBimg/icon_comment.png"></image>
                        <div class="openItemText">
                            <text :style="{fontSize:GLOBAL.biggerFS}">允许评论</text>
                            <text :style="{fontSize:GLOBAL.defaultFS,color:'#999999'}"></text>
                        </div>
                    </div>
                    <image class="openItemChecked" src="https://image.aftdc.com/appBimg/ic_check_box_checked.png"  v-if="commentOrleaveWord==1"></image>
                </div>
                <div class="openItem row aiCenter" @click="leavingAMessage(1)">
                    <div class="openItemLeft row aiCenter">
                        <image class="popupImg" src="https://image.aftdc.com/appBimg/icon_leaveWord.png"></image>
                        <div class="openItemText">
                            <text :style="{fontSize:GLOBAL.biggerFS}">允许留言</text>
                            <text :style="{fontSize:GLOBAL.defaultFS,color:'#999999'}"></text>
                        </div>
                    </div>
                    <image class="openItemChecked" src="https://image.aftdc.com/appBimg/ic_check_box_checked.png" v-if="commentOrleaveWord==2"></image>
                </div>
                <div class="popupButton borderGray" @click="cancelPopupClick(3)">
                    <text :style="{fontSize:GLOBAL.biggerFS}">取消</text>
                </div>
            </div>
        </wxc-popup>

        <toast ref="toast"></toast>
    </div>
</template>

<script>
    import {WxcMinibar, WxcPopup} from 'weex-ui';
    import Toast from './Toast.vue'
    const event = weex.requireModule('event');
    const post = weex.requireModule('stream');
    const navigator = weex.requireModule('navigator');
    const dom=weex.requireModule('dom');
    const animation = weex.requireModule('animation')
    const modal=weex.requireModule('modal');
    const webview = weex.requireModule('webview');
    let open = true // 模板定时器
    let voteClickIndex = null;//投票变量
    let timer = null;//音乐动画定时器
    export default {
        components: {WxcMinibar, Toast, WxcPopup},
        data() {
            return {
                openChecked: 0, //公开选择
                //投票
                vote: '',
                // backImgToggle: 0,//头部返回图片判断
                readingVolume: 0,
                articleTitle: '',
                article: [],
                today: '2018.10.2',
                imgStyle: [],
                commentOrleaveWord:1,
                imageFontRadio: 1,
                play:false,
                music:'',//默认为‘’
                video:'',
                musicRotate: 0,
                articleType:2,//1为图片，2为文字，3为视频
                pageBack:false,
                first : true,
                isBottomShow: false, //字上图下与字下图上底部弹出层
                isBottomShowOpen: false, //公开底部弹出层
                isBottomShowLam: false, //允许留言底部弹出层
                height:[],
                // 商家头部信息
                shopImg: '',
                shopName: '',
                certification: true,

                inputFocus:false,
                blurPrevent:true,//阻止多次失去焦点的定时器
                blankLeft:'750px',

                atTypeindex: 0, //tab模板类型索引
                articleTemplateType: ['经典','单色','赏花','摄影','四季','美食','校园','运动'],
                ctTypei: 0,// 模板类型索引
                cti: 0,// 模版选中索引
                // 模板样式
                articleTemplate: [
                    {
                        typeName: '经典',
                        atList: [
                            {
                                name: '标准',
                                imgUrl: '',
                                smallImgUrl: 'https://image.aftdc.com/articleTemplate/normal/normal.jpg',
                                themeColor: '#fff',
                                fontColor: '#666',
                                fontColorUname: '#53beb7',
                                fontColorTime: '#999',
                                nameBg: '#d5eaff'
                            }
                        ]
                    },
                    {
                        typeName: '单色',
                        atList: [
                            {
                                name: '红',
                                imgUrl: '',
                                smallImgUrl: 'https://image.aftdc.com/articleTemplate/color/red.jpg',
                                themeColor: '#f08a8a',
                                fontColor: '#fff',
                                fontColorUname: '#dedede',
                                fontColorTime: '#dedede',
                                nameBg: '#d5eaff'
                            },
                            {
                                name: '橙',
                                imgUrl: '',
                                smallImgUrl: 'https://image.aftdc.com/articleTemplate/color/orange.jpg',
                                themeColor: '#ffc458',
                                fontColor: '#555',
                                fontColorUname: '#666',
                                fontColorTime: '#666',
                                nameBg: '#d5eaff'
                            },
                            {
                                name: '黄',
                                imgUrl: '',
                                smallImgUrl: 'https://image.aftdc.com/articleTemplate/color/yellow.jpg',
                                themeColor: '#ffff89',
                                fontColor: '#555',
                                fontColorUname: '#666',
                                fontColorTime: '#666',
                                nameBg: '#d5eaff'
                            },
                            {
                                name: '绿',
                                imgUrl: '',
                                smallImgUrl: 'https://image.aftdc.com/articleTemplate/color/green.jpg',
                                themeColor: '#a9fea9',
                                fontColor: '#555',
                                fontColorUname: '#666',
                                fontColorTime: '#666',
                                nameBg: '#d5eaff'
                            },
                            {
                                name: '青',
                                imgUrl: '',
                                smallImgUrl: 'https://image.aftdc.com/articleTemplate/color/cyan.jpg',
                                themeColor: '#54a8fe',
                                fontColor: '#fff',
                                fontColorUname: '#dedede',
                                fontColorTime: '#dedede',
                                nameBg: '#d5eaff'
                            },
                            {
                                name: '蓝',
                                imgUrl: '',
                                smallImgUrl: 'https://image.aftdc.com/articleTemplate/color/blue.jpg',
                                themeColor: '#8787ff',
                                fontColor: '#fff',
                                fontColorUname: '#dedede',
                                fontColorTime: '#dedede',
                                nameBg: '#d5eaff'
                            },
                            {
                                name: '紫',
                                imgUrl: '',
                                smallImgUrl: 'https://image.aftdc.com/articleTemplate/color/violet.jpg',
                                themeColor: '#d5a3ff',
                                fontColor: '#fff',
                                fontColorUname: '#dedede',
                                fontColorTime: '#dedede',
                                nameBg: '#d5eaff'
                            }
                        ]
                    },
                    {
                        typeName: '赏花',
                        atList: [
                            {
                                name: '玫瑰花',
                                imgUrl: 'https://image.aftdc.com/articleTemplate/flower/meiguihua.jpg',
                                smallImgUrl: 'https://image.aftdc.com/articleTemplate/flower/meiguihua.jpg',
                                themeColor: '#fff8ed',
                                fontColorUname: '#666',
                                fontColor: '#666',
                                fontColorTime: '#00a1c3',
                                nameBg: '#fff8ed'
                            },
                            {
                                name: '蓝色花朵',
                                imgUrl: 'https://image.aftdc.com/articleTemplate/flower/lansehuaduo.jpg',
                                smallImgUrl: 'https://image.aftdc.com/articleTemplate/flower/lansehuaduo.jpg',
                                themeColor: '#fdfdfd',
                                fontColorUname: '#666',
                                fontColor: '#666',
                                fontColorTime: '#00a1c3',
                                nameBg: '#fdfdfd'
                            },
                            {
                                name: '白玫瑰',
                                imgUrl: 'https://image.aftdc.com/articleTemplate/flower/baimeigui.jpg',
                                smallImgUrl: 'https://image.aftdc.com/articleTemplate/flower/baimeigui.jpg',
                                themeColor: '#e1dfdf',
                                fontColorUname: '#666',
                                fontColor: '#333',
                                fontColorTime: '#00a1c3',
                                nameBg: '#e1dfdf'
                            },
                            {
                                name: '鸟语花香',
                                imgUrl: 'https://image.aftdc.com/articleTemplate/flower/niaoyuhuaxian.jpg',
                                smallImgUrl: 'https://image.aftdc.com/articleTemplate/flower/niaoyuhuaxian.jpg',
                                themeColor: '#fff',
                                fontColorUname: '#666',
                                fontColor: '#333',
                                fontColorTime: '#00a1c3',
                                nameBg: '#fff'
                            }
                        ]
                    },
                    {
                        typeName: '摄影',
                        atList: [
                            {
                                name: '海天',
                                imgUrl: 'https://image.aftdc.com/articleTemplate/takePhoto/haitan.jpg',
                                smallImgUrl: 'https://image.aftdc.com/articleTemplate/takePhoto/haitan.jpg',
                                themeColor: '#cee8ef',
                                fontColorUname: '#666',
                                fontColor: '#663741',
                                fontColorTime: '#918100',
                                nameBg: '#cee8ef'
                            },
                            {
                                name: '云海',
                                imgUrl: 'https://image.aftdc.com/articleTemplate/takePhoto/yunhai.jpg',
                                smallImgUrl: 'https://image.aftdc.com/articleTemplate/takePhoto/yunhai.jpg',
                                themeColor: '#edeeef',
                                fontColorUname: '#666',
                                fontColor: '#663741',
                                fontColorTime: '#918100',
                                nameBg: '#edeeef'
                            },
                            {
                                name: '高速',
                                imgUrl: 'https://image.aftdc.com/articleTemplate/takePhoto/gaosu.jpg',
                                smallImgUrl: 'https://image.aftdc.com/articleTemplate/takePhoto/gaosu.jpg',
                                themeColor: '#b6b9c1',
                                fontColorUname: '#333',
                                fontColor: '#663741',
                                fontColorTime: '#918100',
                                nameBg: '#b6b9c1'
                            },
                            {
                                name: '夜空',
                                imgUrl: 'https://image.aftdc.com/articleTemplate/takePhoto/yekong.jpg',
                                smallImgUrl: 'https://image.aftdc.com/articleTemplate/takePhoto/yekong.jpg',
                                themeColor: '#897072',
                                fontColorUname: '#009cbe',
                                fontColor: '#fff',
                                fontColorTime: '#bcbcbc',
                                nameBg: '#897072'
                            }
                        ]
                    },
                    {
                        typeName: '四季',
                        atList: [
                            {
                                name: '春',
                                imgUrl: 'https://image.aftdc.com/articleTemplate/season/cun.jpg',
                                smallImgUrl: 'https://image.aftdc.com/articleTemplate/season/cun.jpg',
                                themeColor: '#fcf0f4',
                                fontColorUname: '#53beb7',
                                fontColor: '#444',
                                fontColorTime: '#918100',
                                nameBg: '#fcf0f4'
                            },
                            {
                                name: '春1',
                                imgUrl: 'https://image.aftdc.com/articleTemplate/season/cun1.jpg',
                                smallImgUrl: 'https://image.aftdc.com/articleTemplate/season/cun1.jpg',
                                themeColor: '#fff5f8',
                                fontColorUname: '#53beb7',
                                fontColor: '#666',
                                fontColorTime: '#918100',
                                nameBg: '#fff5f8'
                            },
                            {
                                name: '春2',
                                imgUrl: 'https://image.aftdc.com/articleTemplate/season/cun2.jpg',
                                smallImgUrl: 'https://image.aftdc.com/articleTemplate/season/cun2.jpg',
                                themeColor: '#e8eeea',
                                fontColorUname: '#53beb7',
                                fontColor: '#666',
                                fontColorTime: '#918100',
                                nameBg: '#e8eeea'
                            },
                            {
                                name: '春3',
                                imgUrl: 'https://image.aftdc.com/articleTemplate/season/cun3.jpg',
                                smallImgUrl: 'https://image.aftdc.com/articleTemplate/season/cun3.jpg',
                                themeColor: '#edf6fd',
                                fontColorUname: '#53beb7',
                                fontColor: '#666',
                                fontColorTime: '#918100',
                                nameBg: '#edf6fd'
                            },
                            {
                                name: '夏',
                                imgUrl: 'https://image.aftdc.com/articleTemplate/season/xia.jpg',
                                smallImgUrl: 'https://image.aftdc.com/articleTemplate/season/xia.jpg',
                                themeColor: '#edf5dd',
                                fontColorUname: '#53beb7',
                                fontColor: '#333',
                                fontColorTime: '#918100',
                                nameBg: '#edf5dd'
                            },
                            {
                                name: '夏1',
                                imgUrl: 'https://image.aftdc.com/articleTemplate/season/xia1.jpg',
                                smallImgUrl: 'https://image.aftdc.com/articleTemplate/season/xia1.jpg',
                                themeColor: '#eaf5ee',
                                fontColorUname: '#53beb7',
                                fontColor: '#666',
                                fontColorTime: '#918100',
                                nameBg: '#eaf5ee'
                            },
                            {
                                name: '夏2',
                                imgUrl: 'https://image.aftdc.com/articleTemplate/season/xia2.jpg',
                                smallImgUrl: 'https://image.aftdc.com/articleTemplate/season/xia2.jpg',
                                themeColor: '#daceb1',
                                fontColorUname: '#53beb7',
                                fontColor: '#333',
                                fontColorTime: '#918100',
                                nameBg: '#daceb1'
                            },
                            {
                                name: '夏3',
                                imgUrl: 'https://image.aftdc.com/articleTemplate/season/xia3.jpg',
                                smallImgUrl: 'https://image.aftdc.com/articleTemplate/season/xia3.jpg',
                                themeColor: '#8dd6e7',
                                fontColorUname: '#53beb7',
                                fontColor: '#333',
                                fontColorTime: '#918100',
                                nameBg: '#8dd6e7'
                            },
                            {
                                name: '秋',
                                imgUrl: 'https://image.aftdc.com/articleTemplate/season/qiu.jpg',
                                smallImgUrl: 'https://image.aftdc.com/articleTemplate/season/qiu.jpg',
                                themeColor: '#f7f0dc',
                                fontColorUname: '#53beb7',
                                fontColor: '#666',
                                fontColorTime: '#918100',
                                nameBg: '#f7f0dc'
                            },
                            {
                                name: '秋1',
                                imgUrl: 'https://image.aftdc.com/articleTemplate/season/qiu1.jpg',
                                smallImgUrl: 'https://image.aftdc.com/articleTemplate/season/qiu1.jpg',
                                themeColor: '#f9db61',
                                fontColorUname: '#53beb7',
                                fontColor: '#333',
                                fontColorTime: '#918100',
                                nameBg: '#f9db61'
                            },
                            {
                                name: '秋2',
                                imgUrl: 'https://image.aftdc.com/articleTemplate/season/qiu2.jpg',
                                smallImgUrl: 'https://image.aftdc.com/articleTemplate/season/qiu2.jpg',
                                themeColor: '#f9f1c8',
                                fontColorUname: '#53beb7',
                                fontColor: '#333',
                                fontColorTime: '#918100',
                                nameBg: '#fbf9ef'
                            },
                            {
                                name: '秋3',
                                imgUrl: 'https://image.aftdc.com/articleTemplate/season/qiu3.jpg',
                                smallImgUrl: 'https://image.aftdc.com/articleTemplate/season/qiu3.jpg',
                                themeColor: '#f8f8f2',
                                fontColorUname: '#53beb7',
                                fontColor: '#333',
                                fontColorTime: '#918100',
                                nameBg: '#f8f8f2'
                            },
                            {
                                name: '冬',
                                imgUrl: 'https://image.aftdc.com/articleTemplate/season/dong.jpg',
                                smallImgUrl: 'https://image.aftdc.com/articleTemplate/season/dong.jpg',
                                themeColor: '#8babcc',
                                fontColorUname: '#53beb7',
                                fontColor: '#333',
                                fontColorTime: '#918100',
                                nameBg: '#8babcc'
                            },
                            {
                                name: '冬1',
                                imgUrl: 'https://image.aftdc.com/articleTemplate/season/dong1.jpg',
                                smallImgUrl: 'https://image.aftdc.com/articleTemplate/season/dong1.jpg',
                                themeColor: '#d6dce4',
                                fontColorUname: '#53beb7',
                                fontColor: '#333',
                                fontColorTime: '#918100',
                                nameBg: '#d6dce4'
                            },
                            {
                                name: '冬2',
                                imgUrl: 'https://image.aftdc.com/articleTemplate/season/dong2.jpg',
                                smallImgUrl: 'https://image.aftdc.com/articleTemplate/season/dong2.jpg',
                                themeColor: '#cee5e9',
                                fontColorUname: '#53beb7',
                                fontColor: '#333',
                                fontColorTime: '#918100',
                                nameBg: '#cee5e9'
                            },
                            {
                                name: '冬3',
                                imgUrl: 'https://image.aftdc.com/articleTemplate/season/dong3.jpg',
                                smallImgUrl: 'https://image.aftdc.com/articleTemplate/season/dong3.jpg',
                                themeColor: '#f7f7fa',
                                fontColorUname: '#53beb7',
                                fontColor: '#333',
                                fontColorTime: '#918100',
                                nameBg: '#f7f7fa'
                            },
                        ]
                    },
                    {
                        typeName: '美食',
                        atList: [
                            {
                                name: '美味',
                                imgUrl: 'https://image.aftdc.com/articleTemplate/food/meat.jpg',
                                smallImgUrl: 'https://image.aftdc.com/articleTemplate/food/meat.jpg',
                                themeColor: '#191919',
                                fontColorUname: '#fff',
                                fontColor: '#fff',
                                fontColorTime: '#918100',
                                nameBg: '#cee8ef'
                            },
                            {
                                name: '面',
                                imgUrl: 'https://image.aftdc.com/articleTemplate/food/mian.jpg',
                                smallImgUrl: 'https://image.aftdc.com/articleTemplate/food/mian.jpg',
                                themeColor: '#e6dece',
                                fontColorUname: '#009cbe',
                                fontColor: '#444',
                                fontColorTime: '#918100',
                                nameBg: '#edeeef'
                            },
                            {
                                name: '水稻',
                                imgUrl: 'https://image.aftdc.com/articleTemplate/food/rice.jpg',
                                smallImgUrl: 'https://image.aftdc.com/articleTemplate/food/rice.jpg',
                                themeColor: '#eee9e5',
                                fontColorUname: '#009cbe',
                                fontColor: '#444',
                                fontColorTime: '#918100',
                                nameBg: '#b6b9c1'
                            },
                            {
                                name: '早餐',
                                imgUrl: 'https://image.aftdc.com/articleTemplate/food/egg.jpg',
                                smallImgUrl: 'https://image.aftdc.com/articleTemplate/food/egg.jpg',
                                themeColor: '#f0f2f8',
                                fontColorUname: '#009cbe',
                                fontColor: '#666',
                                fontColorTime: '#bcbcbc',
                                nameBg: '#897072'
                            },
                            {
                                name: '刀叉',
                                imgUrl: 'https://image.aftdc.com/articleTemplate/food/nice.jpg',
                                smallImgUrl: 'https://image.aftdc.com/articleTemplate/food/nice.jpg',
                                themeColor: '#334963',
                                fontColorUname: '#fff',
                                fontColor: '#dedede',
                                fontColorTime: '#fff',
                                nameBg: '#edeeef'
                            },
                            {
                                name: '奶茶',
                                imgUrl: 'https://image.aftdc.com/articleTemplate/food/cofe.jpg',
                                smallImgUrl: 'https://image.aftdc.com/articleTemplate/food/cofe.jpg',
                                themeColor: '#f2f2f1',
                                fontColorUname: '#009cbe',
                                fontColor: '#444',
                                fontColorTime: '#918100',
                                nameBg: '#b6b9c1'
                            }
                        ]
                    },
                    {
                        typeName: '校园',
                        atList: [
                            {
                                name: '黑板',
                                imgUrl: 'https://image.aftdc.com/articleTemplate/school/heibang.jpg',
                                smallImgUrl: 'https://image.aftdc.com/articleTemplate/school/heibang.jpg',
                                themeColor: '#252429',
                                fontColorUname: '#b5f0f1',
                                fontColor: '#fff',
                                fontColorTime: '#bcbcbc',
                                nameBg: '#c0c4cd'
                            },
                            {
                                name: '绿板',
                                imgUrl: 'https://image.aftdc.com/articleTemplate/school/lvbang.jpg',
                                smallImgUrl: 'https://image.aftdc.com/articleTemplate/school/lvbang.jpg',
                                themeColor: '#0e554d',
                                fontColorUname: '#b5f0f1',
                                fontColor: '#fff',
                                fontColorTime: '#bcbcbc',
                                nameBg: '#c0c4cd'
                            },
                            {
                                name: '书',
                                imgUrl: 'https://image.aftdc.com/articleTemplate/school/shu.jpg',
                                smallImgUrl: 'https://image.aftdc.com/articleTemplate/school/shu.jpg',
                                themeColor: '#c9c8c2',
                                fontColorUname: '#53beb7',
                                fontColor: '#444',
                                fontColorTime: '#bcbcbc',
                                nameBg: '#c0c4cd'
                            },
                            {
                                name: '一页知秋',
                                imgUrl: 'https://image.aftdc.com/articleTemplate/school/yiyezhiqiu.jpg',
                                smallImgUrl: 'https://image.aftdc.com/articleTemplate/school/yiyezhiqiu.jpg',
                                themeColor: '#e3e1df',
                                fontColorUname: '#53beb7',
                                fontColor: '#444',
                                fontColorTime: '#bcbcbc',
                                nameBg: '#c0c4cd'
                            },
                        ]
                    },
                    {
                        typeName: '运动',
                        atList: [
                            {
                                name: '跑步',
                                imgUrl: 'https://image.aftdc.com/articleTemplate/sport/paopu.jpg',
                                smallImgUrl: 'https://image.aftdc.com/articleTemplate/sport/paopu.jpg',
                                themeColor: '#0e0e0e',
                                fontColorUname: '#b5f0f1',
                                fontColor: '#fff',
                                fontColorTime: '#bcbcbc',
                                nameBg: '#cccdbf'
                            },
                            {
                                name: '羽毛球',
                                imgUrl: 'https://image.aftdc.com/articleTemplate/sport/yumaoqiu.jpg',
                                smallImgUrl: 'https://image.aftdc.com/articleTemplate/sport/yumaoqiu.jpg',
                                themeColor: '#fcfdfb',
                                fontColorUname: '#6967be',
                                fontColor: '#555266',
                                fontColorTime: '#918100',
                                nameBg: '#f4f4f4'
                            },
                            {
                                name: '舞动',
                                imgUrl: 'https://image.aftdc.com/articleTemplate/sport/wudong.jpg',
                                smallImgUrl: 'https://image.aftdc.com/articleTemplate/sport/wudong.jpg',
                                themeColor: '#fcfdf8',
                                fontColorUname: '#6967be',
                                fontColor: '#555266',
                                fontColorTime: '#918100',
                                nameBg: '#f4f4f4'
                            },
                            {
                                name: '足球',
                                imgUrl: 'https://image.aftdc.com/articleTemplate/sport/zuqiu.jpg',
                                smallImgUrl: 'https://image.aftdc.com/articleTemplate/sport/zuqiu.jpg',
                                themeColor: '#f1f5fb',
                                fontColorUname: '#6967be',
                                fontColor: '#555266',
                                fontColorTime: '#918100',
                                nameBg: '#f4f4f4'
                            },
                        ]
                    }
                ],
                imgNum:0,
                imgNums:0
            }
        },
        created() {
            event.init();
            event.initMusic();
            this.token = weex.config.token;
            this.imei = weex.config.imei;
            this.shopName = event.find('shopName');
            this.shopImg = event.find('shopImg');

            // this.shopName = '好来收到付阿萨德';
            // this.shopImg = 'shops/642/articleImg/1532433728000.jpg';
            // var articleData ={
            //     "title":"可口可乐使美好的事情更加美好 轻轻一举，带来光明。",
            //     "article":[
            //         {
            //             "localPart":"https://image.aftdc.com/shops/1020451/chatImg/1536324568000.jpg",
            //             // "localPart":"",
            //             "articleImg":"shops/1020451/chatImg/11536324568000.jpg",
            //             "content":"1886年，可口可乐在美国乔治亚州亚特兰大市诞生，自此便与社会发展相互交融，激发创新灵感。现在，它每天为全球的人们带来怡神畅快的美妙感受。"
            //         },
            //         {
            //             "localPart":"https://image.aftdc.com/shops/1020451/chatImg/1536324203000.jpg",
            //             "articleImg":"shops/1020451/chatImg/1536324203000.jpg",
            //             "content":"目前，全球每天有17亿人次的消费者在畅饮可口可乐公司的产品，大约每秒钟售出19,400瓶饮料，在2016年10月，可口可乐公司排2016年全球100大最有价值品牌第三名 [1]  ；可口可乐为中国消费者提供超过15个品牌50多种饮料选择，其系列产品在华的每天享用量达到1.5亿杯， [2]  可口可乐自1979年重返中国市场至2014年底，已累计投资超过90亿美元，目前在华建有43家工厂，系统员工约45,000人，其中99%为本地员工， [3]  可口可乐及其装瓶厂在中国长期以来不遗余力地支持教育及公益事业，推广环境保护以及帮助当地社区的发展，捐资总额超过2.7亿元人民币，另外，可口可乐亦是唯一一个全方位赞助在中国举办的特奥会、奥运会、残奥会、世博会、大运会及青奥会的企业。1885年，美国佐治亚州的<Dr.John.Stith.Pemberton>（约翰·彭伯顿），发明了深色的糖浆称为彭伯顿法国酒可乐（Pemberton's French Wine Coka）1885年政府发出禁酒令，因此彭伯顿发明无酒精的Pemberton's French Wine Coka。1886年5月8日他想发明一种饮料，一种让很多需要补充营养的人喜欢喝的饮料。那天，他正在搅拌做好了的饮料，发现它具有提神、镇静的作用以及减轻头痛，他将这种液体加入了糖浆和水，然后加上冰块，他尝了尝，味道好极了，不过在倒第二杯时，助手一不小心加入了苏打水（二氧化碳+水）这回味道更好了，合伙人罗宾逊（Frank M.Robinson）从糖浆的两种成分，激发出命名的灵感，这两种成分就是古柯（Coca）的叶子和可拉（Kola）的果实，罗宾逊为了整齐划一，将Kola的K改C，然后在两个词中间加一横，于是Coca-Cola便诞生了，第一份可口可乐售价为五美分。"
            //         }
            //     ],
            //     "cover_type":4,
            //     "cover_img":['https://image.aftdc.com/enter/15344076160000454353.jpg']
            // }
            // for (var i in articleData.article) {
            //     articleData.article[i].width = '700px'
            //     articleData.article[i].height = '525px'
            // }
            // this.articleTitle = articleData.title;
            // this.article = articleData.article;
            // this.music = {"id":5,"musicName":"Beyond The Memory","author":"July","musicPath":"music/sys/1/July - Beyond The Memory.mp3","parentId":1}
            // this.video = ''
            // this.videoCover = 'https://image.aftdc.com/enter/15344076160000454353.jpg'

            var that = this;
            var now = new Date();
            var today = now.getFullYear() + "." + ((now.getMonth() + 1) < 10 ? "0" : "") + (now.getMonth() + 1) + "." + (now.getDate() < 10 ? "0" : "") + now.getDate();
            that.today = today;

            weex.requireModule('globalEvent').addEventListener("upLoadFile",function(e){
                if (e.upLoad == 1){
                    that.updata(e)
                }
            });
        },

        mounted(){
            var articleData = JSON.parse(event.find('articleData'));
            console.log(event.find('articleData'));
            for (var i in articleData.article) {
                articleData.article[i].width = '700px'
                articleData.article[i].height = '525px'
            }
            this.articleTitle = articleData.title;
            this.article = articleData.article;

            if (articleData.vote) {
                var vote = articleData.vote;
                for (var i = 0; i < vote.inputList.length; i++) {
                    vote.inputList[i].checked = false;
                }
                this.vote = vote;
            }

            if (articleData.music) {
                this.music = articleData.music;
            }

            if (articleData.videos) {
                this.video = articleData.videos.videos;
                this.videoCover = articleData.videos.videoCovers;
                this.videos = articleData.videos;
            }

            if (articleData.template) {
                var smallImgUrl = articleData.template.smallImgUrl
                for (var i in this.articleTemplate) {
                    for (var s in this.articleTemplate[i].atList){
                        if (this.articleTemplate[i].atList[s].smallImgUrl == smallImgUrl){
                            this.ctTypei=i
                            this.cti=s
                            break;
                        }
                    }
                }
            }

            if (articleData.imageFontRadio){
                this.imageFontRadio = articleData.imageFontRadio
            }

            if (articleData.open){
                this.openChecked = articleData.open - 1
            }

            if (articleData.commentOrleaveWord){
                this.commentOrleaveWord = articleData.commentOrleaveWord
            }
        },

        methods: {
            //重置图片大小
            resize (i,event) {
                if (event.success) {
                    var ratio = event.size.naturalHeight / event.size.naturalWidth
                    var width = 700
                    var height = width * ratio
                    this.$set(this.article[i],'width',width + 'px')
                    this.$set(this.article[i],'height',height + 'px')
                }
            },
            // 投票
            voteClick(item,index){
                if(this.vote.type === 1){   // 单选
                    for(let i=0,len=this.vote.inputList.length;i<len;i++){
                        this.vote.inputList[i].checked = false
                    }
                    if(voteClickIndex!==index){
                        item.checked = true
                        // this.vote.inputList[index].checked = true
                        voteClickIndex = index
                    }else {
                        voteClickIndex = null
                    }
                }else if(this.vote.type === 0) {    // 多选,无限制
                    item.checked = !item.checked

                }else {    // 多选,可选n项
                    if(voteClickIndex < this.vote.type||item.checked===true){
                        if(item.checked !== true){
                            voteClickIndex++
                        }else{
                            voteClickIndex--
                        }
                        item.checked = !item.checked
                    }
                }
            },
            // 允许留言选择
            leavingAMessage(i){
                if(i===0){
                    this.commentOrleaveWord=1
                }else if(i===1) {
                    this.commentOrleaveWord=2
                }
                this.$refs.wxcPopupLam.hide();
            },
            // 公开选择
            openClick(i) {
                this.openChecked = i
                this.$refs.wxcPopupOpen.hide();
            },
            // 选择文章模板类型
            atTypeSelect(index){
                open = false
                this.atTypeindex=index
                dom.scrollToElement(this.$refs.atType[index], {})
                if (index < 2 ){
                    var testEl = this.$refs.testEl[0];
                    dom.scrollToElement(testEl)
                }else {
                    var testEl = this.$refs.testEl[index-2];
                    dom.scrollToElement(testEl)
                }
                setTimeout(()=>{
                    open = true
                },300)
            },
            // 文章模板在屏幕上可见时触发
            appear(event,i) {
                var that = this
                if(open == true){
                    if (event.direction == 'left') { // Android为left,iOS为right
                        that.atTypeindex = i
                        console.log('down'+'-'+i)
                        if (i < 2 ){
                            var testEl = this.$refs.testEl[0];
                            dom.scrollToElement(testEl)
                        }else {
                            var testEl = this.$refs.testEl[i-2];
                            dom.scrollToElement(testEl)
                        }
                    }
                }
            },
            // 文章模板在屏幕上不可见时触发
            disappear(event,i) {
                var that = this
                if(open == true) {
                    if (event.direction == 'right') { // Android为right,iOS为left
                        that.atTypeindex = i + 1
                        console.log('up' + '-' + i)
                        if (i < 2) {
                            var testEl = this.$refs.testEl[0];
                            dom.scrollToElement(testEl)
                        } else {
                            var testEl = this.$refs.testEl[i - 1];
                            dom.scrollToElement(testEl)
                        }
                    }
                }
            },
            // 选择文章模板
            atSelect(i,index){
                let number = index
                for(let ii=0;ii<i;ii++){
                    for(let j=0,leng=this.articleTemplate[ii].atList.length;j<leng;j++){
                        number++
                    }
                }
                var atEl = this.$refs.atEl[number];
                animation.transition(atEl, {
                    styles: {
                        transform: 'scale(0.9,0.9)'
                    },
                    duration: 100, //ms
                    timingFunction: 'ease'
                },()=>{
                    animation.transition(atEl, {
                        styles: {
                            transform: 'scale(1,1)'
                        },
                        duration: 100, //ms
                        timingFunction: 'ease'
                    })
                })
                setTimeout(()=>{
                    this.ctTypei=i
                    this.cti=index
                },200)
            },
            minibarRightButtonClick() {
                if (this.first) {
                    this.first = false
                    var imageFontRadio = this.imageFontRadio;
                    var articleData = JSON.parse(event.find('articleData'));
                    articleData.imageFontRadio = imageFontRadio;
                    articleData.commentOrleaveWord = this.commentOrleaveWord;
                    articleData.music = this.music;
                    articleData.vote = this.vote;
                    articleData.open = this.openChecked;
                    articleData.template = this.articleTemplate[this.ctTypei].atList[this.cti];

                    this.articleData = articleData
                    var upLoad = []
                    var cover_img_local = articleData.cover_img_local
                    for (var i in cover_img_local) {
                        if (cover_img_local[i].localImg.substr(0, 5) != 'https'){
                            var obj = {
                                url:cover_img_local[i].cover_img,
                                loacl:cover_img_local[i].localImg
                            }
                            upLoad.push(obj)
                        }
                    }
                    var article = articleData.article
                    for (var s in article) {
                        if (article[s].localPart!=''&&article[s].localPart.substr(0, 5) != 'https'){
                            var obj = {
                                url:article[s].articleImg,
                                loacl:article[s].localPart
                            }
                            upLoad.push(obj)
                        }
                    }
                    var videos = articleData.videos
                    if (videos.videos!=''&&videos.videos.substr(0, 5) != 'https'&&!article[s].video) {
                        var obj = {
                            url:videos.video,
                            loacl:videos.videos
                        }
                        upLoad.push(obj)
                        var obj1 = {
                            url:videos.videoCover,
                            loacl:videos.videoCovers
                        }
                        upLoad.push(obj1)
                    }
                    this.imgNums = upLoad.length

                    if (upLoad.length>0){
                        var param = this.GLOBAL.sign(this.token,this.imei);
                        event.showLoading();post.fetch({
                            method: 'post',
                            type: 'json',
                            body: param,
                            url: 'https://www.aftdc.com/businessapp/Goods/uploadOss',
                            headers: {"Content-Type": "application/x-www-form-urlencoded"},
                        },function(res){
                            // var waterMarkStr = event.find('shopName');
                            var waterMarkStr = '';
                            for (var i in upLoad) {
                                event.uploadImg(res.data.AccessKeyId,res.data.AccessKeySecret,res.data.SecurityToken,upLoad[i].url,upLoad[i].loacl,waterMarkStr);
                            }
                        });
                    } else{
                        event.showLoading();
                        this.saveArticle()
                    }
                }
            },
            //播放音乐
            musicPlay(){
                if (this.play) {
                    this.play = false;
                    event.pauseMusic()

                    //播放音乐动画关闭效果
                    this.musicRotate -= 360
                    clearInterval(timer)
                }else {
                    this.play = true;
                    var musicPart = this.music.musicPath;
                    event.playMusic('https://image.aftdc.com/'+musicPart)

                    //播放音乐动画开启效果
                    this.musicRotate += 360
                    timer = setInterval(()=>{
                        this.musicRotate += 60
                    },1000)
                }
            },
            bottomCellClick(i) {
                if(i === 0){
                    let articleTemplateBox = this.$refs.articleTemplateBox;
                    animation.transition(articleTemplateBox, {
                        styles: {
                            // top: '500',
                            transform: 'translateY(-378px)'
                        },
                        duration: 500, //ms
                        timingFunction: 'ease'
                    })
                }else if (i === 1) {
                    this.play = false
                    event.finishMusic()
                    var url = 'http://assets/bgMusic.js';
                    event.toUrl({url:url,param:''});
                } else if (i === 2) {
                    this.isBottomShow = true;
                } else if (i === 4) {
                    if(this.openChecked!==2){
                        this.isBottomShowLam=true
                    }
                } else if (i === 5) {
                    this.isBottomShowOpen = true
                }
            },
            //非状态组件，需要在这里关闭
            popupOverlayBottomClick(i) {
                if(i===0){
                    this.isBottomShow = false;
                }else if(i===1){
                    this.isBottomShowOpen = false;
                }else if(i===2){
                    this.isBottomShowLam = false;
                }
            },
            imageFontRadioClick(index) {
                var that = this;
                that.imageFontRadio = index;
                that.$refs.wxcPopup.hide();
            },
            cancelPopupClick(i) {
                if(i===0){
                    let articleTemplateBox = this.$refs.articleTemplateBox;
                    animation.transition(articleTemplateBox, {
                        styles: {
                            transform: 'translateY(0)'
                        },
                        duration: 400, //ms
                        timingFunction: 'ease'
                    })
                }else if(i===1) {
                    this.$refs.wxcPopup.hide();
                }else if(i===2) {
                    this.$refs.wxcPopupOpen.hide();
                }else if(i===3) {
                    this.$refs.wxcPopupLam.hide();
                }
            },
            minibarLeftButtonClick(){
                event.finishMusic()
            },
            //监听页面返回
            viewdisappear() {
                this.play = false;
                let self = this;
                self.pageBack = true;
            },
            viewappear() {
                let self = this;
                if (!self.pageBack) { return; }
                self.pageBack = false;
                event.init();
                event.initMusic();
                if (event.find("chooseMusic")) {
                    this.music = JSON.parse(event.find("chooseMusic"));
                    event.delete("chooseMusic");
                }
            },
            updata(){
                this.imgNum++;
                if (this.imgNums == this.imgNum) {
                    this.saveArticle()
                }
            },
            //上传
            saveArticle(){
                var that = this;
                event.finishMusic();
                var param = this.GLOBAL.sign(this.token,this.imei);
                param += '&articleData='+ JSON.stringify(this.articleData);
                console.log(param);
                post.fetch({
                    method: 'post',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/businessapp/Article/saveArticle',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                },function(res){event.hidLoading();
                    const toast = that.$refs.toast;
                    if (res.data.res==1){
                        event.deleteVideo();
                        toast.editContent('上传成功，等待审核');
                        var index = that.video?2:3;
                        setTimeout(()=>event.backToIndex(index),1000);
                    }else {
                        this.first = true
                        toast.editContent('网络出错，请稍后再试');
                    }
                })
            },
            onPageFinish(){
                var that = this
                webview.postMessage(that.$refs.firWebview, {message: {url:that.video,poster:that.videoCover}});
            },
        }
    }
</script>

<style scoped>
    /*音乐播放*/
    .musicImg {
        background-color: #fff;
        border-radius: 37.5px;
        position: fixed;
        width: 75px;
        height: 75px;
        right: 44px;
        transition: transform 6s linear;
    }

    .video {
        /*margin-top: 20px;*/
        /*width: 690px;*/
        width: 700px;
        height: 450px;
        background-color: #000;
    }


    .wrapper {
        flex-direction: column;
    }

    .minibar {
    }
    .darkGrey {
        color: #333333;
    }
    .aiCenter {
        align-items: center;
    }
    .jcCenter {
        justify-content: center;
    }
    .bgImg {
        width: 750px;
        height: 750px;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }
    .seeing {
        width: 46px;
        height: 33px;
        margin-top: 7px;
        margin-bottom: 6px;
    }
    .content {
        padding-top: 30px;
        padding-left: 30px;
        padding-right: 30px;
        padding-bottom: 30px;
    }


    .articleTitle {
        flex-direction: row;
        align-items: center;
    }

    .articleTitleSize {
        width: 690px;
        font-size: 38px;
        font-weight: bold;
        line-height: 55px;
    }

    .article_time {
        flex-direction: row;
        align-items: center;
        margin-top: 10px;
        margin-bottom: 10px;
    }
    .roundBorder {
        border-radius: 50px;
    }
    .shopImg {
        width: 100px;
        height: 100px;
        border-radius: 50px;

    }
    .cerificationPosition {
        position: absolute;
        left: 70px;
        top: 70px;
    }
    .cerification {
        width: 30px;
        height: 30px;
        border-radius: 50px;
    }

    .marginLeft {
        margin-left: 25px;
    }
    .dataSize {
        color: #999;
        margin-top: 10px;
    }
    .aftSize {
        color: #53beb7;
    }

    .readingSize {
        margin-left: 20px;
        color: #999;
    }

    .article_content {
        /*margin-top: 40px;*/
    }

    .previewContent {
        margin-top: 40px;
        color: #666666;
        /*border-width: 1px;*/
        /*border-style: solid;*/
        /*border-color: #53beb7;*/
        /*background-color: #fff;*/
        padding-top: 20px;
        padding-right: 20px;
        padding-left: 20px;
        padding-bottom: 20px;
        line-height: 50px;
        box-sizing: border-box;
    }
    .klContent{
        position: absolute;
        top: 0;
        left: 0;
        margin-top: 40px;
        font-size: 32px;
        color: #666666;
        padding-top: 20px;
        padding-right: 20px;
        padding-left: 20px;
        padding-bottom: 20px;
        /*line-height: 50px;*/
        opacity: 0;
    }
    .imgDefault {
        /*width: 750px;*/
        /*height: 500px;*/
    }

    .imgDiv {
        width: 690px;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        margin-top: 30px;
    }

    .previewBottom {
        /*position: fixed;*/
        /*left: 0;*/
        /*right: 0;*/
        /*bottom: 0;*/
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        background-color: #fff;

        border-top-width: 1px;
        border-top-style: solid;
        border-top-color: #a8a8a8;
    }

    .bottomCell {
        flex-direction: column;
        align-items: center;
        flex: 1;
        padding-top: 10px;
        padding-bottom: 10px;
    }

    .bottomCell:active {
        background-color: #f1f1f1; /*#a1a1a1*/
    }

    .iconImg {
        width: 45px;
        height: 45px;
    }
    .visibleIcon {
        width: 50px;
        height: 36px;
        margin-top: 7px;
        margin-bottom: 7px;
    }

    .bottomTextSize {
        margin-top: 10px;
    }

    .scroller {
        flex: 1;
    }
    .demo-content {
        flex: 1;
        flex-direction: column;
        justify-content: space-between;
    }

    .popupImg {
        width: 50px;
        height: 50px;
    }
    .popupButton {
        height: 90px;
        flex-direction: row;
        justify-content: center;
        align-items: center;

    }
    .borderGray {
        height: 100px;
        border-top-width: 10px;
        border-top-style: solid;
        border-top-color: #f1f2f6;
    }
    .popupButton:active {
        background-color: #f1f1f1; /*#a8a8a8*/
    }
    .opacity {
        background-color: rgba(255,255,255,0);
    }
    .article_music {
        flex-direction: row;
        align-items: center;
        padding-top: 20px;
        padding-left: 20px;
        padding-bottom: 20px;
        background-color: #eff3f6;
        margin-top: 30px;
        border-radius: 10px;
        opacity: 0.7;
    }
    .musicIcon{
        width: 40px;
        height: 40px;
        margin-right: 15px;
    }
    .musicTextSize{
        color: #555;
        align-items: center;
        flex-direction: row;
        justify-content: center;
    }
    .musicShow{
        color: #53beb7;
    }
    .textareaClon{
        margin-top: 30px;
        font-size: 32px;
        line-height: 48px;
        color: #666666;
        padding-top: 10px;
        padding-bottom: 10px;
    }
    /* 文章模板 */
    .articleTemplateBox {
        position: fixed;
        bottom: -378px;
        width: 750px;
        height: 378px;
        background-color: #fff;
    }
    .articleTemplate {
        position: absolute;
        top: 0;
        left: 0;
        width: 750px;
        height: 550px;
    }
    .templateIcon {
        flex-direction: row;
        justify-content: space-between;
    }
    .jcSp {
        padding-top: 2px;
        padding-left: 2px;
        padding-right: 2px;
        padding-bottom: 2px;
        justify-content: space-between;
    }
    .blockIcon {
        width: 19px;
        height: 19px;
        border-width: 3px;
        border-style: solid;
        border-color: #303030;
        border-radius: 4px;
    }
    .tabScroller{
        border-top-width: 2px;
        border-top-style: solid;
        border-top-color: #ededed;
        flex-direction: row;
        height: 90px;
        width: 750px;

    }
    .atScroller {
        flex-direction: row;
        width: 750px;
        height: 198px;
    }
    .tabHeadContent {
        flex-direction: row;
        height: 90px;
        align-items: center;
    }
    .tabHeadText {
        width: 134px;
        height: 90px;
        text-align: center;
        line-height: 90px;
    }
    .atTypeActive {
        color: #53beb7
    }
    .tabHeadLine {
        width:64px;
        height: 5px;
        position: absolute;
        left: 0;
        background-color: #53beb7;
        transform: translateX(35px);
        transition: left 0.2s ease-in-out;
    }
    .atborder {
        width: 146px;
        height: 188px;
        border-width: 1px;
        border-style: solid;
        border-color: #e2e2e2;
    }
    .articleTemplateItem {
        width: 154px;
        height: 196px;
        border-width: 4px;
        border-style: solid;
        border-color: #fff;
        margin-left: 17px;
    }
    .atiActive {
        border-color: #53beb7;
        background-color: #53beb7;
    }
    .atImg {
        width: 144px;
        height: 148px;
    }
    .atNameBg {
        width: 144px;
        height: 39px;
        align-items: center;
        justify-content: center;
    }
    .row {
        flex-direction: row;
    }
    .fill {
        width: 17px;
    }

    /* 公开 */
    .openItem {
        width: 750px;
        height: 130px;
        justify-content: space-between;
        padding-left: 32px;
        padding-right: 40px;
        border-top-width: 1px;
        border-top-style: solid;
        border-top-color: #edecf0;
    }
    .openItemText {
        margin-left: 30px;
    }
    .meVisibleIcon {
        width: 50px;
        height: 50px;
    }
    .openItemChecked {
        width: 40px;
        height: 40px;
        border-radius: 20px;
    }
    /* 投票 */
    .vote {
        margin-top: 80px;
        border-width: 2px;
        border-style: solid;
        border-color: #dbdbe1;
        border-radius: 15px;
        padding-top: 30px;

    }
    .voteTitle {
        width: 630px;
        font-size: 38px;
        line-height: 52px;
    }
    .subTitle {
        font-size: 24px;
        color: #949494;
        margin-top: 26px;

    }
    .option {
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #dbdbe1;
        padding-top: 30px;
        padding-bottom: 30px;
    }
    .optionNoBorder {
        border-bottom-width: 0;
    }
    .optionText {
        line-height: 50px;
        width: 570px;
    }
    .optionIcon {
        width: 34px;
        height: 34px;
        border-width: 2px;
        border-style: solid;
        border-color: #dedee4;
        border-radius: 20px;
        margin-top: 8px;
        margin-right: 20px;
    }
    .optionIconInside {
        width: 20px;
        height: 20px;
        background-color: #000;
        border-radius: 20px;
    }
    .optionIconChecked {
        background-color: #53beb7;
    }
    .voteTop {
        padding-left: 30px;
    }
    .voteBottom {
        height: 90px;
        border-top-width: 2px;
        border-top-style: solid;
        border-top-color: #dbdbe1;
    }

</style>
