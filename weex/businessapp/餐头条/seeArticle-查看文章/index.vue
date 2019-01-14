<template>
    <!--<web style="width: 750px;height: fit-content" src="https://www.aftdc.com/mobile/article/articleDetail.html?id=480"></web>-->

    <div class="wrapper">
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
                </div>
                <text :style="GLOBAL.headerCenter"  slot="middle">预览</text>
                <text :style="GLOBAL.headerRight"  slot="right">操作</text>
            </wxc-minibar>
        </div>

        <!--<web v-if="video" ref="firWebview" class="video" src="https://www.aftdc.com/mobile/public/video.html"-->
        <!--@pagestart="" @pagefinish="onPageFinish" @error="" @receivedtitle=""></web>-->

        <scroller class="scroller" :style="{backgroundColor:articleTemplate[ctTypei].atList[cti].themeColor}">
            <!--<scroller class="scroller" >-->
            <!--<image class="articleTemplate" :src="articleTemplate[ctTypei].atList[cti].imgUrl"></image>-->
            <image class="bgImg"  :src="articleTemplate[ctTypei].atList[cti].imgUrl"></image>

            <div class="content">
                <!--<div class="articleTitle" v-if="!video">-->
                    <text class="articleTitleSize" :style="{color:articleTemplate[ctTypei].atList[cti].fontColor}">{{articleTitle}}</text>
                <!--</div>-->
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
                <!--音乐播放-->
                <div v-if="music">
                    <image class="musicImg" ref="musicImg" :style="{top:video?'610px':'180px'}" src="https://image.aftdc.com/appBimg/icon_music_check.png"  @click.stop="musicPlay" v-if="!play"></image>
                    <image class="musicImg" ref="musicImg" :style="{ transform: 'rotate(' + musicRotate + 'deg)',top:video?'610px':'180px'}" src="https://image.aftdc.com/appBimg/icon_music_check.png"  @click.stop="musicPlay" v-else></image>
                </div>
                <div class="article_content" v-for="(item,index) in article">
                    <video class="video" auto-play="true" v-if="video!=''" :src="video"></video>
                    <!--<web v-if="item.video!=''" ref="firWebview" class="video" src="https://www.aftdc.com/mobile/public/video.html"-->
                         <!--@pagestart="" @pagefinish="onPageFinish" @error="" @receivedtitle=""></web>-->
                    <!--//字上图下-->
                    <div v-if="imageFontRadio==0">
                        <div style="overflow: hidden"  v-if="item.content!=''">
                            <text class="textareaClon" :style="{color:articleTemplate[ctTypei].atList[cti].fontColor}">{{item.content}}</text>
                        </div>
                        <div class="imgDiv" v-if="item.localPart!=''">
                            <!--//articleType为1或2时显示-->
                            <image v-if="item.video==''&&item.localPart!=''" class="imgDefault" @load="resize(index,$event)" :style="{width: item.width,height: item.height}" :src="item.localPart"></image>
                        </div>
                    </div>
                    <div v-else>
                        <div class="imgDiv" v-if="item.localPart!=''">
                            <!--//articleType为1或2时显示-->
                            <image v-if="item.video==''&&item.localPart!=''" class="imgDefault" @load="resize(index,$event)" :style="{width: item.width,height: item.height}" :src="item.localPart"></image>
                        </div>
                        <div style="overflow: hidden" v-if="item.content!=''">
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

        <wxc-popover ref="wxc-popover"
                     :buttons="btns"
                     :position="popoverPosition"
                     :arrowPosition="popoverArrowPosition"
                     @wxcPopoverButtonClicked="popoverButtonClicked"></wxc-popover>

        <!--是否确认删除文章提示框-->
        <wxc-mask height="240"
                  width="600"
                  border-radius="10"
                  duration="200"
                  mask-bg-color="#FFFFFF"
                  :has-animation="true"
                  :has-overlay="true"
                  :show-close="false"
                  :show="confirmShow"
                  @wxcMaskSetHidden="wxcMaskSetHidden">
            <div class="dianDelDiv" @click="">
                <text class="dianDelTips" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">提示</text>
                <text class="dianDelDetails" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">是否删除该文章</text>
                <div class="dianDelBtn row aiCenter">
                    <text style="flex: 1;"></text>
                    <text class="dianDelBtnCancel" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}" @click="dianDelBtnCancelClick">否</text>
                    <text class="dianDelBtnCancel" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}" @click="dianDelBtnConfirmClick()">是</text>
                </div>
            </div>
        </wxc-mask>

        <toast ref="toast"></toast>
        <share ref="share"></share>
    </div>

</template>

<script>
    import {WxcMinibar, WxcPopup,WxcPopover,WxcMask} from 'weex-ui';
    import Toast from './Toast.vue'
    import Share from './Share.vue'
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
        components: {WxcMinibar, Toast,Share, WxcPopup,WxcPopover,WxcMask},
        data() {
            return {
                btns:[
                    { icon: 'https://image.aftdc.com/appBimg/icon_shares.png', text:'分享 ' },
                    { icon: 'https://image.aftdc.com/appBimg/icon_edit.png', text:'编辑 ' },
                    { icon: 'https://image.aftdc.com/appBimg/icon_delete_red.png', text:'删除 ' }
                ],
                popoverPosition:{x:-16,y:50},
                popoverArrowPosition:{pos:'top',x:-14},
                confirmShow:false,
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
                imageFontRadio: 0,
                play:false,
                music:'',//默认为‘’
                video:'',
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
                musicRotate:0,
                inputFocus:false,
                blurPrevent:true,//阻止多次失去焦点的定时器
                blankLeft:'750px',

                atTypeindex: 0, //tab模板类型索引
                articleTemplateType: ['经典','赏花','摄影','四季','校园','运动'],
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
            }
        },
        created() {
            event.init();
            event.initMusic();
            this.shopName = event.find('shopName');
            this.shopImg = event.find('shopImg');
            this.token = weex.config.token;
            this.imei = weex.config.imei;
            var param = weex.config.param;
            if (param) {
                this.articleId = JSON.parse(param).articleId;
            }

            // var that = this
            // var articles = {"res":1,"data":{"id":150287,"business_id":1031056,"key_word":"","title":"咪咪","content":[{"articleImg":"shops\/1020451\/articleImg\/15374290044314.png","content":""},{"articleImg":"","content":"xp咩how手默默"},{"articleImg":"shops\/1020451\/articleImg\/15374290045164.png","content":""}],"timestamp":1537429057,"cover_type":2,"cover_img":["shops\/1020451\/videoImg\/1537429014000.jpg"],"praise_num":0,"comment_num":0,"read_num":0,"music":{"musicAuthor":"张一益","musicPath":"music\/sys\/1\/张一益 - Spring.mp3","id":14,"musicName":"Spring","parentId":1},"catId":202,"catName":"奶茶饮品","invert_picture":"","shareImg":"shops\/1020451\/articleShareImg\/625106229405150287.jpeg","shopId":1020451,"shopName":"芦蜜欧—茶饮•炸鸡•汉堡","shopImg":"enter\/15343807390000318921.jpg","video":"shops\/1020451\/video\/1537429014000.mp4","address":null,"is_img":1,"is_video":1,"commentOrleaveWord":1,"imageFontRadio":0,"isShow":1,"isCheck":1,"checkResult":null,"vote":null,"voteNum":0,"open":1,"template":{"name":"春3","imgUrl":"https:\/\/image.aftdc.com\/articleTemplate\/season\/cun3.jpg","smallImgUrl":"https:\/\/image.aftdc.com\/articleTemplate\/season\/cun3.jpg","themeColor":"#edf6fd","fontColorUname":"#53beb7","fontColor":"#666","fontColorTime":"#918100","nameBg":"#edf6fd"},"top":0,"editTime":"1537429079"}}
            // var res = {
            //     data:articles
            // }
            // var article = res.data.data.content
            // if (res.data.data.content!=[]){
            //     for (var i in article) {
            //         if (article[i].articleImg!='') {
            //             article[i].localPart = 'https://image.aftdc.com/'+article[i].articleImg
            //         }else{
            //             article[i].localPart = ''
            //         }
            //     }
            // }
            // var articleData = {}
            // articleData.template = res.data.data.template
            // articleData.music = res.data.data.music
            // articleData.title = res.data.data.title
            // articleData.article = article
            // articleData.video = res.data.data.video
            // for (var i in articleData.article) {
            //     articleData.article[i].width = '700px'
            //     articleData.article[i].height = '525px'
            // }
            // articleData.vote = res.data.data.vote
            //
            // that.articleTitle = articleData.title;
            // that.article = articleData.article;
            //
            // if (articleData.vote) {
            //     var vote = articleData.vote;
            //     for (var i = 0; i < vote.inputList.length; i++) {
            //         vote.inputList[i].checked = false;
            //     }
            //     that.vote = vote;
            // }
            //
            // if (articleData.music) {
            //     that.music = articleData.music;
            // }
            //
            // if (articleData.video) {
            //     that.video = 'https://image.aftdc.com/'+articleData.video
            //     that.videoCover = articleData.cover_img?'https://image.aftdc.com/'+articleData.cover_img[0]:''
            // }
            //
            //
            // if (articleData.template) {
            //     var smallImgUrl = articleData.template.smallImgUrl
            //     for (var i in that.articleTemplate) {
            //         for (var s in that.articleTemplate[i].atList){
            //             if (that.articleTemplate[i].atList[s].smallImgUrl == smallImgUrl){
            //                 that.ctTypei=i
            //                 that.cti=s
            //                 break;
            //             }
            //         }
            //     }
            // }

            var that = this;
            var now = new Date();
            var today = now.getFullYear() + "." + ((now.getMonth() + 1) < 10 ? "0" : "") + (now.getMonth() + 1) + "." + (now.getDate() < 10 ? "0" : "") + now.getDate();
            that.today = today;
        },

        mounted(){
            if (this.articleId) {
                var articleId = this.articleId;
                var param = this.GLOBAL.sign(this.token,this.imei);
                param += '&articleId='+ articleId;
                var that = this
                post.fetch({
                    method: 'post',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/businessapp/Article/articleDetail',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                },function(res){
                    if (res.data.res==1){
                        var article = res.data.data.content
                        if (res.data.data.content!=[]){
                            for (var i in article) {
                                if (article[i].articleImg!='') {
                                    article[i].localPart = 'https://image.aftdc.com/'+article[i].articleImg
                                }else{
                                    article[i].localPart = ''
                                }
                            }
                        }
                        that.isCheck = res.data.data.isCheck
                        that.open = res.data.data.open
                        that.isShow = res.data.data.isShow
                        that.imageFontRadio = res.data.data.imageFontRadio
                        
                        var articleData = {}
                        articleData.template = res.data.data.template
                        articleData.music = res.data.data.music
                        articleData.title = res.data.data.title
                        articleData.article = article
                        articleData.video = res.data.data.video
                        articleData.cover_img = res.data.data.cover_img
                        for (var i in articleData.article) {
                            articleData.article[i].width = '700px'
                            articleData.article[i].height = '525px'
                        }
                        articleData.vote = res.data.data.vote

                        that.articleTitle = articleData.title;
                        that.article = articleData.article;
                        that.shareImg = articleData.cover_img?'https://image.aftdc.com/'+articleData.cover_img[0]:''

                        if (articleData.vote) {
                            var vote = articleData.vote;
                            for (var i = 0; i < vote.inputList.length; i++) {
                                vote.inputList[i].checked = false;
                            }
                            that.vote = vote;
                        }

                        if (articleData.music) {
                            that.music = articleData.music;
                        }

                        if (articleData.video) {
                            that.video = 'https://image.aftdc.com/'+articleData.video
                            that.videoCover = articleData.cover_img?'https://image.aftdc.com/'+articleData.cover_img[0]:''
                        }

                        if (articleData.template) {
                            var smallImgUrl = articleData.template.smallImgUrl
                            for (var i in that.articleTemplate) {
                                for (var s in that.articleTemplate[i].atList){
                                    if (that.articleTemplate[i].atList[s].smallImgUrl == smallImgUrl){
                                        that.ctTypei=i
                                        that.cti=s
                                        break;
                                    }
                                }
                            }
                        }
                    }
                })
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

            popoverButtonClicked (obj) {
                if(obj.index==0){//分享
                    const toast=this.$refs.toast;
                    if (this.open===3) {
                        toast.editContent('文章状态为私密，不可分享');
                        return false
                    }
                    if (this.isCheck===0) {
                        toast.editContent('文章未通过审核');
                        return false
                    }
                    if (this.isShow===0||this.isShow===-1) {
                        toast.editContent('文章未发布');
                        return false
                    }
                    const share = this.$refs.share;
                    share.show('',true,true,true,true,false,true,'/page/direct/pages/article/article?article_id='+this.articleId,'',this.articleTitle,this.shareImg);
                    //1:标题,空默认为分享，2:微信，3:朋友圈，4:QQ，5:空间，6:通讯录，7:更多 2-7至少设置一个为false
                    //8:小程序链接，9:网页链接，10:分享出去的标题，11:图片
                }
                else if(obj.index==1){//编辑
                    var param = {
                        articleId : this.articleId
                    }
                    var url = 'http://assets/headLine.js'
                    event.toUrl({url:url,param:JSON.stringify(param)});
                    event.finishMusic()
                }
                else if(obj.index==2){//删除
                    this.confirmShow=true
                }
            },
            minibarRightButtonClick () {
                this.$refs['wxc-popover'].wxcPopoverShow();
            },
            minibarLeftButtonClick(){},
            wxcMaskSetHidden(){
                this.confirmShow=false;
            },
            //取消删除文章
            dianDelBtnCancelClick(){
                this.confirmShow=false;
            },
            //删除文章(回收站的彻底删除事件还没写)
            dianDelBtnConfirmClick(){
                this.confirmShow=false;
                var that = this;
                var param = this.GLOBAL.sign(this.token,this.imei);
                const toast=that.$refs.toast;
                param += '&id=' + this.articleId;
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    url: 'https://www.aftdc.com/businessapp/Article/deleteArticle',
                }, function (res) {
                    if (res.data.res == 1) {
                        toast.editContent('删除成功');
                        setTimeout(()=>navigator.pop({ animated: 'true' }),1500);
                        event.finishMusic()
                    } else {
                        toast.editContent('删除失败，请稍后再试');
                    }
                })
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
            //播放音乐
            musicPlay(){
                if (this.play) {
                    this.playOrStop(1)
                    this.play = false;
                    event.pauseMusic()

                    //播放音乐动画关闭效果
                    this.musicRotate -= 360
                    clearInterval(timer)
                }else {
                    this.playOrStop(0)
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
            playOrStop(action){
                if (this.video){
                    var that = this
                    var videoUrl = []
                    for(var i in this.article) {
                        if(this.article[i].video !== '') {
                            videoUrl.push(this.article[i].video)
                        }
                    }
                    for(var j in videoUrl) {
                        webview.postMessage(that.$refs.firWebview[j], {message: {action:action}});
                    }
                    // webview.postMessage(that.$refs.firWebview, {message: {action:action}});
                }
            },
            onPageFinish(){
                var that = this
                var videoUrl = []
                for(var i in this.article) {
                    if(this.article[i].video !== '') {
                        videoUrl.push(this.article[i].video)
                    }
                }
                for(var j in videoUrl) {
                    webview.postMessage(that.$refs.firWebview[j], {message: {action:1,url:that.video,poster:that.videoCover,title:that.articleTitle}});
                }
                // webview.postMessage(that.$refs.firWebview, {message: {action:1,url:that.video,poster:that.videoCover,title:that.articleTitle}});
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

    .jarvis {
        position: absolute;
        top: 90px;
        left: 0;
        right: 0;
        bottom: 0;
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

    .wrapper {
        flex-direction: column;
    }

    .minibar {

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
        background-color: #a1a1a1;
    }

    .iconImg {
        width: 50px;
        height: 50px;
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
        background-color: #a8a8a8;
    }
    .grayLine {
        width: 750px;
        height: 14px;
        background-color: #f8f8f8;
        transform: translateX(-30px);
    }
    .opacity {
        background-color: rgba(255,255,255,0);
    }

    .video {
        /*margin-top: 20px;*/
        /*width: 690px;*/
        width: 700px;
        height: 450px;
        background-color: #000;
        margin-top: 20px;
        margin-bottom: 20px;
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
        width: 750px;
        height: 378px;
        background-color: #fff;
        position: fixed;
        bottom: -378px;

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
        flex-wrap: wrap;
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
        width: 20px;
        height: 20px;
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

    .dianDelBtnCancel{
        /*padding-top: 5px;*/
        padding-bottom: 25px;
        padding-left: 40px;
        padding-right: 40px;
    }
    .dianDelBtn{
    }
    .dianDelDetails{
        padding-left: 30px;
        padding-right: 30px;
    }
    .dianDelTips{
        padding-top: 25px;
        /*padding-bottom: 5px;*/
        padding-left: 30px;
    }
    .dianDelDiv{
        flex: 1;
        justify-content: space-between;
    }

</style>
