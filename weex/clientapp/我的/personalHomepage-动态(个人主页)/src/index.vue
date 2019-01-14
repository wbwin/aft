<template>
    <div class="wrapper" @viewappear="viewappear" @viewdisappear="viewdisappear">

        <!-- 导航栏 -->
        <div>
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    @wxcMinibarRightButtonClicked="minibarRightButtonClick"
            >
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter" class="headerCenter" slot="middle">{{userInfo.userName}}</text>
                <!--<image class="backImg" slot="right" @click="minibarRightButtonClick"-->
                <!--src="https://image.aftdc.com/appBimg/ic_more_head.png"></image>-->
            </wxc-minibar>
        </div>


        <!--主体内容-->
        <list class="page">

            <refresh class="refresh" @refresh="onrefreshOrder" :display="refreshing? 'show' : 'hide'">
                <image class="donkey" src="https://image.aftdc.com/appBimg/ic_loading_gif.gif"></image>
            </refresh>

            <cell>
                <div class="row all">
                    <image class="userImg" :src="userInfo.userPhoto"></image>
                    <div class="userAll">
                        <div class="fansAll row">
                            <div>
                                <text class="num" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor}">0</text>
                                <text class="fans" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">关注</text>
                            </div>
                            <div>
                                <text class="num" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor}">1</text>
                                <text class="fans" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">粉丝</text>
                            </div>
                            <div>
                                <text class="num" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor}">5</text>
                                <text class="fans" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">动态</text>
                            </div>
                        </div>
                        <text class="autograph" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}" @click="edit">{{userInfo.acticleMood?userInfo.acticleMood:'点击编辑个性签名,最多30字哦'}}</text>
                    </div>
                </div>
            </cell>

            <cell class="subjectCell">
                <div class="row subjectBar">
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">动态</text>
                    <text :style="{fontSize:GLOBAL.bigFS,color:isEdit?'#f85c5e':GLOBAL.dColor}" v-if="dynamic.length>0 && myArticel" @click="subjectEdit">{{isEdit?'取消':'编辑'}}</text>
                </div>
            </cell>

            <cell v-if="dynamic.length>0">
                <div class="subjectLeft"  ref="subject">
                    <div class="subjectAll" v-for="(item,index) in dynamic" :key="index">

                        <!--选择删除的图标-->
                        <image class="selectIcon" :src="dynamicLngth[index].select?'https://image.aftdc.com/appBimg/ic_check_box_checked.png':'https://image.aftdc.com/appBimg/ic_check_box_normal.png'"></image>

                        <div class="detailsAll">

                            <!--我的头像和名称-->
                            <div class="row orderName">
                                <image class="orderImg" :src="userInfo.userPhoto"></image>
                                <div>
                                    <text class="myName" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{userInfo.userName}}</text>
                                    <text class="isTime" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">{{item.createTime}}</text>
                                </div>
                            </div>

                            <!--转发了、收藏了、点赞了、评论了、留言了-->
                            <div class="row" :style="{marginTop:'10px'}">
                                <text class="forward" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.action==1?'转发了':item.action==2?'收藏了':item.action==3?'点赞了':item.action==4?'评论了':item.action==5?'留言了':item.action==6?'评价了':''}}</text>
                                <text class="operType" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.type==1?'文章':item.type==2?'评论':item.type==3?'留言':item.type==4?'商品':''}}</text>
                            </div>

                            <!--商品评分星级-->
                            <div class="row" :style="{marginTop:'5px'}" v-if="item.info.type==4">
                                <text class="score" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">打分</text>
                                <div class="start">
                                    <image class="noStart" src="https://image.aftdc.com/appBimg/icon_wuxing_nocolor.png"></image>
                                    <div class="startDiv" :style="{width:item.info.appraises.avg*30+'px'}">
                                        <image class="noStart" src="https://image.aftdc.com/appBimg/icon_wuxing_color.png"></image>
                                    </div>
                                </div>
                            </div>

                            <!--留言和评论-->
                            <div class="content" v-if="item.info.appraises">
                                <wxc-special-rich-text :config-list="allList[index].specialConfigList"></wxc-special-rich-text>
                            </div>
                            <!--<text class="content" v-if="item.info.appraises" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.info.author?'@'+item.info.author.authorName+': ':''}}{{item.info.appraises.content}}</text>-->

                            <!--商品评价标签-->
                            <div v-if="item.info.appraises">
                                <div class="row tips" v-if="item.info.appraises.tagStr">
                                    <image class="tipsIcon" src="https://image.aftdc.com/appBimg/details_icon.png"></image>
                                    <text :style="{fontSize:GLOBAL.smallFS,color:'#999'}">{{item.info.appraises.tagStr}}</text>
                                </div>
                            </div>

                            <!--文章内容-->
                            <div class="articelContent" v-if="item.info.article" @click="articleDetail(index)">

                                <div class="contentText">
                                    <wxc-special-rich-text :config-list="allTwoList[index].specialConfigList"></wxc-special-rich-text>
                                </div>
                                <image class="contentImg" :src="'https://image.aftdc.com/'+item.info.article.cover_img"></image>
                            </div>

                            <!--评价图片-->
                            <div class="evaluateDiv" v-if="item.action==6 && item.info.appraises.img">
                                <image class="evaluateImg" v-for="(itemI,index) in item.info.appraises.img" :src="'https://image.aftdc.com/'+itemI"></image>
                            </div>

                            <!--转发、评论、赞按钮-->
                            <div class="row forwardBtn">
                                <div class="row btn" v-if="item.type==4" @click="goShop(index)">
                                    <image class="goShopIcon" :src="'https://image.aftdc.com/'+item.info.appraises.shopImg"></image>
                                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor,marginLeft:'15px'}">进店</text>
                                </div>

                                <div class="row btn" v-else @click="articleShare(index)">
                                    <image class="leftIcon" src="https://image.aftdc.com/images/share.png"></image>
                                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor,marginLeft:'15px'}">{{item.share_num?item.share_num:'0'}}</text>
                                </div>
                                <div class="row btn" @click="articleDetail(index)">
                                    <image class="centerIcon" src="https://image.aftdc.com/appBimg/leaveMessage_icon.png"></image>
                                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor,marginLeft:'15px'}">{{item.comment_num?item.comment_num:'0'}}</text>
                                </div>
                                <div class="row btn" @click="zanClick(index)">
                                    <image class="rightIcon" :src="item.praise?'https://image.aftdc.com/images/zhan.png':'https://image.aftdc.com/images/nozhan.png'"></image>
                                    <text :style="{fontSize:item.praise_num?GLOBAL.bigFS:GLOBAL.smallFS,color:item.praise?GLOBAL.tColor:GLOBAL.dColor,marginLeft:'15px'}">{{item.praise_num?item.praise_num:'点赞'}}</text>
                                </div>
                            </div>

                        </div>

                        <!--点击编辑时,用于便捷选择的白板-->
                        <div class="blank" v-if="isEdit" @click="delSelect(index)"></div>

                    </div>
                </div>
            </cell>
            <cell v-else :style="{flex:1}">
                <noOrder class="noOrderTwo" img="https://image.aftdc.com/appBimg/icon_no_order.png" textOne="暂无动态，去逛逛吧~~" textTwo="" ></noOrder>
            </cell>

            <loading class="loading" @loading="onloadingOrder" :display="loadinging? 'show' : 'hide'">
                <image class="donkey" src="https://image.aftdc.com/appBimg/ic_loading_gif.gif" v-if="!noMore"></image>
                <div class="moreRecentlyOrder" v-else>
                    <text class="moreRecentlyOrderText">没有更多了~</text>
                </div>
            </loading>

        </list>

        <!--删除全选-->
        <div class="row allSelectDiv" ref="allDel" v-if="dynamic.length>0">
            <div class="row allSelect" @click="allSelect">
                <image class="allSelectIcon" :src="isAllSelect?'https://image.aftdc.com/appBimg/ic_check_box_checked.png':'https://image.aftdc.com/appBimg/ic_check_box_normal.png'"></image>
                <text class="allSelectText">{{isAllSelect?'全不选':'全选'}}</text>
            </div>
            <text class="delText" @click="allDel">删除</text>
        </div>


        <!--修改签名提示框-->
        <wxc-mask height="240"
                  width="600"
                  border-radius="10"
                  duration="200"
                  mask-bg-color="#FFFFFF"
                  :has-animation="true"
                  :has-overlay="true"
                  :show-close="false"
                  :show="autographShow"
                  @wxcMaskSetHidden="wxcMaskSetHidden"
                  @wxcOverlayBodyClicked="wxcOverlayBodyClicked">
            <div @click="">
                <text class="demoAutograph" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">编辑个性签名</text>
                <textarea rows="2" class="autographArea" placeholder="最多30字" ref="ref_textarea" maxlength="30" v-model="autograph" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}"></textarea>
                <text class="fontNum" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor}">{{autograph.length}}/30</text>
                <div class="row autographBtn">
                    <text class="autographCancel" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}" @click="autographCancel">取消</text>
                    <text class="autographCancel" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}" @click="autographConfirm">确认</text>
                </div>
            </div>
        </wxc-mask>


        <toast ref="toast"></toast>
        <share ref="share"></share>

        <!--气泡菜单-->
        <wxc-popover ref="wxc-popover"
                     :buttons="btns"
                     :position="popoverPosition"
                     :arrowPosition="popoverArrowPosition"
                     @wxcPopoverButtonClicked="popoverButtonClicked"></wxc-popover>
    </div>
</template>

<script>
    import { WxcPopup,WxcMask,WxcIcon,WxcMinibar,WxcPopover,WxcSpecialRichText} from 'weex-ui';
    import Toast from './Toast.vue';
    import Share from './Share.vue';
    import noOrder from './noOrder.vue';
    const animation = weex.requireModule('animation')
    const modal = weex.requireModule('modal');
    const event = weex.requireModule('event');
    const post = weex.requireModule('stream');
    const dom = weex.requireModule('dom');
    const GLOBAL = require('@/Global.vue');

    export default {
        components: { WxcPopup,WxcMask,WxcIcon,WxcMinibar,WxcPopover,Toast,Share,WxcSpecialRichText,noOrder},
        data() {
            return {
                isEdit:false,
                noMore:false,
                autographShow:false,
                refreshing:false,
                loadinging:false,
                isAllSelect:false,


                dynamicLngth:[],
                autograph:'',

                // 气泡菜单
                btns:[
                    {
                        icon: 'https://image.aftdc.com/images/share.png',
                        text:'分享名片',
                        key:'key-scan',//key的内容可以传到事件里面
                    },
                ],
                popoverPosition:{x:-11,y:60},
                popoverArrowPosition:{pos:'top',x:-11},

                // 富文本
                allList:[],
                allTwoList:[],
                myArticel:false,//判断是进入自己的个人首页还是别人的
                userId:'',//从APP获取的用户自己的id


                userInfo:[],
                countNum:[],
                dynamic:[],

                token: '',
                imei: '',
                id:'',
            }
        },

        created: function () {
            var that = this;
            event.init();
            that.token = weex.config.token;
            that.imei = weex.config.imei;
            that.userId = weex.config.userId;
            var param  = weex.config.param;
            that.id=JSON.parse(param).id;

            that.getData(0);

            if(!that.userId){//判断id是否存在(是否登录),未登录时进入的就是别人的个人动态主页、判断获取APP的userId是否和传过来id相同,相同为进入自己的个人动态主页,不相同为别人的
                that.myArticel=false;
            }
            else{
                that.id==that.userId?that.myArticel=true:that.myArticel=false;
            }
        },
        methods: {


            minibarRightButtonClick () {
                var that=this;
                that.$refs['wxc-popover'].wxcPopoverShow();
            },

            popoverButtonClicked(obj){//气泡菜单里面分享
                var that=this
                const share=that.$refs.share

                var index=obj.index//点击气泡层按钮的index
                if(index==0){
                    var that=this;
                    var wxappPart = '';					                                                                //小程序路径
                    var webUrl = 'https://www.aftdc.com/mobile/article/articleDetail.html?id=' + that.userInfo.userId;	//网页链接
                    var title = that.userInfo.userName;					                                        //分享标题
                    var shareImg = that.userInfo.userPhoto;                             //分享缩略图片
                    var description = that.userInfo.acticleMood.slice(0,20);					                            //分享描述
                    var scene = 1;
                    const share = that.$refs.share;
                    share.show(true,true,true,false,false,false,true,false,wxappPart,webUrl,title,shareImg,description,scene);
                }
            },

            articleShare(index) {//分享
                var that=this;
                var param=index;
                if(event.find('myIndex')){
                    event.delete('myIndex');
                    event.save('myIndex',param);
                }
                else{
                    event.save('myIndex',param);
                }

                var wxappPart = '';					                                                                //小程序路径
                var webUrl = 'https://www.aftdc.com/mobile/article/articleDetail.html?id=' + that.dynamic[index].info.article.id;	//网页链接
                var title = that.dynamic[index].info.article.title;					                                        //分享标题
                var shareImg = 'https://image.aftdc.com/' + that.dynamic[index].info.article.cover_img;                             //分享缩略图片
                var description = '';			                            //分享描述
                var scene = 2;
                const share = that.$refs.share;
                share.show(true,true,true,false,false,false,true,false,wxappPart,webUrl,title,shareImg,description,scene);
            },

            goShop(index){//进店

                var that=this;
                var orderType='';
                var shopType='';
                if(that.dynamic[index].info.appraises.featured==0) {//主打业务 0 外卖 3堂食预订 5到店自取
                    orderType=0;
                    shopType=1;
                }
                else if(that.dynamic[index].info.appraises.featured==3){
                    orderType=3;
                    shopType=5;
                }
                else if(that.dynamic[index].info.appraises.featured==5){
                    orderType=5;
                    shopType=2;
                }

                var shopId=that.dynamic[index].info.appraises.shopId;

                var url='http://assets/businessOrder.js';
                var param={shopId:shopId,orderType:orderType,shopType:shopType};
                event.toUrl({url:url,param:JSON.stringify(param)});
            },

            goComment(index){//跳转评论详情页
                var that=this;
                var id=that.dynamic[index].id;
                var url='http://assets/commentDetails.js';
                var param=id;
                event.toUrl({url:url,param:param});
            },

            articleDetail(index){//跳转文章详情
                var that=this;
                var id=that.dynamic[index].info.article.id;
                var url='http://assets/articleContent.js';
                var param=id;
                event.toUrl({url:url,param:param});
            },

            zanClick(index){//点赞与取消点赞
                var that=this;
                var param = that.GLOBAL.sign(that.token,that.imei);
                var id = that.dynamic[index].info.article.id;
                var url = that.dynamic[index].praise==0?'https://www.aftdc.com/userapp/Article/praiseArticle':'https://www.aftdc.com/userapp/Article/cancelPraiseArticle';
                param+='&id='+id;
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    url: url,
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                }, function (res) {
                    if (res.data.res == 1){

                        for(let i in that.dynamic){
                            if( that.dynamic[i].info.article.id == id){
                                if(that.dynamic[i].praise==0){
                                    that.dynamic[i].praise=1;
                                    that.dynamic[i].praise_num+=1;
                                }
                                else{
                                    that.dynamic[i].praise=0;
                                    that.dynamic[i].praise_num-=1;
                                }
                            }
                        }
                        const toast =that.$refs.toast;
                        toast.editContent(res.data.info);
                    }
                    else{
                        const toast =that.$refs.toast;
                        toast.editContent(res.data.info);
                    }
                })
            },

            subjectEdit(){//编辑
                var that=this;
                var testEl = this.$refs.subject;
                var testE2 = this.$refs.allDel;
                if(!that.isEdit){
                    that.isEdit=true;
                    animation.transition(testEl, {
                        styles: {
                            transform: 'translate(60px, 0px)',
                        },
                        duration: 300, //ms
                        timingFunction: 'ease',
                        delay: 0 //ms
                    })
                    animation.transition(testE2, {
                        styles: {
                            transform: 'translate(0px, -100px)',
                        },
                        duration: 300, //ms
                        timingFunction: 'ease',
                        delay: 0 //ms
                    })
                }
                else{
                    that.isEdit=false;
                    animation.transition(testEl, {
                        styles: {
                            transform: 'translate(0px, 0px)',
                        },
                        duration: 300, //ms
                        timingFunction: 'ease',
                        delay: 0 //ms
                    })
                    animation.transition(testE2, {
                        styles: {
                            transform: 'translate(0px, 0px)',
                        },
                        duration: 300, //ms
                        timingFunction: 'ease',
                        delay: 0 //ms
                    },function () {
                        for(var i in that.dynamicLngth){
                            that.dynamicLngth[i].select=false;
                        }
                    })
                }
            },

            autographConfirm(){//确认更改签名
                var that=this;
                that.autographShow=false;
                that.$refs.ref_textarea.blur();
                var param = this.GLOBAL.sign(that.token,that.imei);
                param+='&acticleMood='+that.autograph;
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/userapp/Mine/updateSignature',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                }, function (res) {
                    if (res.data.res == 1) {
                        that.userInfo.acticleMood=that.autograph;
                        const toast =that.$refs.toast;
                        toast.editContent(res.data.info);
                    }
                    else{
                        const toast =that.$refs.toast;
                        toast.editContent(res.data.info);
                    }
                })
            },

            autographCancel(){//取消更改签名
                var that=this;
                that.$refs.ref_textarea.blur();
                that.autographShow=false;
            },
            wxcOverlayBodyClicked(){
                var that=this;
                that.$refs.ref_textarea.blur();
            },


            edit(){//点击签名打开编辑
                var that=this;
                that.autographShow=true;
                if(!that.autograph){
                    that.autograph=that.userInfo.acticleMood;
                }
            },

            wxcMaskSetHidden(){
                var that=this;
                that.autographShow=false;
            },

            onloadingOrder:GLOBAL.throttle(function(){//上拉加载
                var that=this;
                that.loadinging=true;
                var page = that.dynamic.length;
                var param = that.GLOBAL.sign(that.token,that.imei);
                param+='&page='+page;

                post.fetch({
                    method: 'post',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/userapp/Mine/userHomepage',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                },function(res){
                    if(res.data.res==1){

                        var dynamic=res.data.data.dynamic;
                        that.dynamic=that.dynamic.concat(dynamic);

                        for(var i in res.data.data.dynamic){
                            that.dynamicLngth.push({select:false});
                            that.isFor(dynamic,i);
                        }

                        //重置全选按钮
                        that.isAllSelect=false;

                        const toast =that.$refs.toast;
                        toast.editContent(res.data.info);
                    }
                    else{
                        const toast =that.$refs.toast;
                        toast.editContent(res.data.info);
                        that.noMore=true;
                    }
                    that.loadinging=false;

                });
            }),//上拉加载

            onrefreshOrder:GLOBAL.throttle(function () {//下拉刷新

                var that=this;
                that.refreshing = true;
                if(that.isEdit){
                    that.subjectEdit();
                }
                that.isAllSelect=false;
                that.getData(1);

            }),//下拉刷新

            getData(index){//获取数据
                var that=this;
                var param = that.GLOBAL.sign(that.token,that.imei);
                param+='&page=0'+'&id='+that.id;
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/userapp/Mine/userHomepage',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                }, function (res) {
                    if (res.data.res == 1) {
                        var userInfo=res.data.data.userInfo;
                        var countNum=res.data.data.countNum;
                        var dynamic=res.data.data.dynamic;

                        that.userInfo=userInfo;
                        that.countNum=countNum;
                        that.dynamic=dynamic;

                        if(dynamic.length<20) that.noMore=true;

                        that.dynamicLngth=[];
                        that.allList=[];
                        for(let i in dynamic){

                            that.dynamicLngth.push({select:false});
                            that.isFor(dynamic,i);
                        }
                    }
                    else{
                        if(index==1){
                            const toast =that.$refs.toast;
                            toast.editContent(res.data.info);
                        }
                    }
                    setTimeout(function () {
                        that.refreshing=false;
                    },50)
                })
            },//获取数据

            isFor(dynamic,i){
                // 添加富文本数据1
                var that=this;
                if(dynamic[i].info.author && dynamic[i].info.appraises){
                    that.allList.push({
                        specialConfigList:[
                            {
                                type: 'tag',
                                value: '@'+dynamic[i].info.author.authorName,
                                style: {
                                    fontSize: 28,
                                    color: '#53beb7',
                                    borderWidth:'0'
                                }
                            },
                            {
                                type: 'text',
                                value: dynamic[i].info.appraises.content,
                                theme: 'black',
                                style: {
                                    fontSize: 28,
                                    color:'#666',
                                    lines:100
                                }

                            }
                        ],
                    })
                }
                else if(!dynamic[i].info.author && dynamic[i].info.appraises){
                    that.allList.push({
                        specialConfigList:[
                            {
                                type: 'text',
                                value: dynamic[i].info.appraises.content,
                                theme: 'black',
                                style: {
                                    fontSize: 28,
                                    color:'#666',
                                    lines:100
                                }
                            }
                        ]
                    });
                }
                else{
                    that.allList.push({
                        specialConfigList:[]
                    });
                }

                // 添加富文本数据2
                if(dynamic[i].info.author && dynamic[i].info.article){
                    that.allTwoList.push({
                        specialConfigList:[
                            {
                                type: 'tag',
                                value: '@'+dynamic[i].info.author.authorName,
                                style: {
                                    fontSize: 28,
                                    color: '#53beb7',
                                    borderWidth:'0'
                                }
                            },
                            {
                                type: 'text',
                                value: dynamic[i].info.article.title,
                                theme: 'black',
                                style: {
                                    fontSize: 28,
                                    color:'#666',
                                    lines:100
                                }

                            }
                        ],
                    })
                }
                else if(!dynamic[i].info.author && dynamic[i].info.article){
                    that.allTwoList.push({
                        specialConfigList:[
                            {
                                type: 'text',
                                value: dynamic[i].info.article.title,
                                theme: 'black',
                                style: {
                                    fontSize: 28,
                                    color:'#666',
                                    lines:100
                                }
                            }
                        ]
                    });
                }
                else{
                    that.allTwoList.push({
                        specialConfigList:[]
                    });
                }
            },

            delSelect(index){//删除选择
                var that=this;
                if(that.dynamicLngth[index].select){
                    that.dynamicLngth[index].select=false;

                    let num=0;
                    for (var i in that.dynamicLngth) {
                        if(!that.dynamicLngth[i].select){
                            num+=1;
                        }
                    }
                    if(num==that.dynamicLngth.length){
                        that.isAllSelect=false;
                    }
                }
                else{
                    that.dynamicLngth[index].select=true;

                    let num = 0;
                    for (var i in that.dynamicLngth) {
                        if(that.dynamicLngth[i].select){
                            num+=1;
                        }
                    }
                    if(num==that.dynamicLngth.length){
                        that.isAllSelect=true;
                    }
                }
            },

            allSelect(){//删除全选/全不选
                var that=this;
                if(that.isAllSelect){//isAllSelect为true代表已经全选
                    for(var i in that.dynamicLngth){
                        that.dynamicLngth[i].select=false;
                    }
                    that.isAllSelect=false;

                }
                else{
                    for(var i in that.dynamicLngth){
                        that.dynamicLngth[i].select=true;
                    }
                    that.isAllSelect=true;
                }
            },

            allDel(){//执行删除
                var that=this;
                let num=0;
                var delArr= [];
                for(var i in that.dynamicLngth){
                    if(that.dynamicLngth[i].select){
                        delArr.push({id:that.dynamic[i].id,action:that.dynamic[i].action,type:that.dynamic[i].type,infoId:that.dynamic[i].infoId})
                        num+=1;
                    }
                }
                if(num==0){
                    const toast =that.$refs.toast;
                    toast.editContent('未选择删除项');
                    return false;
                }


                var param = this.GLOBAL.sign(that.token,that.imei);
                param+='&delArr='+JSON.stringify(delArr);
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/userapp/Mine/delDynamic',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                }, function (res) {
                    if (res.data.res == 1) {

                        const toast =that.$refs.toast;
                        toast.editContent(res.data.info);

                        // 删除dynamicLngth被删除的数据
                        for(var i=that.dynamicLngth.length-1;i>-1;i--){
                            if(that.dynamicLngth[i].select){
                                that.dynamic.splice(i,1)
                            }
                        }

                        //定时器,防止删除dynamic数据时,dynamicLngth已经被清空
                        setTimeout(function () {
                            //清空dynamicLngth中保存dynamicLngth删除选择的数据
                            that.dynamicLngth=[];
                            //从新给dynamicLngth赋值
                            for(var i in that.dynamic){
                                that.dynamicLngth.push({select:false})
                            }
                        },20)

                        //收起删除按钮
                        that.subjectEdit();
                    }
                    else{
                        const toast =that.$refs.toast;
                        toast.editContent(res.data.info);
                    }
                })

            },


            scrollToNext: function() {
                dom.scrollToElement(this.$refs.footer)
            },
            //非状态组件，需要在这里关闭
            popupOverlayBottomClick () {
                this.isBottomShow = false;
            },
            minibarLeftButtonClick() {
            },
            //监听页面返回
            viewdisappear() {
                let that = this;
                that.pageBack = true;
            },
            viewappear() {
                var that = this;
                if (!that.pageBack) { return; }
                that.pageBack = false;
                that.onrefreshOrder();



                if (event.find("articleData")) {
                    event.delete("articleData");
                }

                if (event.find("content")) {
                    var param = that.GLOBAL.sign(that.token,that.imei);
                    var content = JSON.parse(event.find("content"));
                    that.shopInfo.acticleMood = content.content
                    param +='&acticleMood='+content.content
                    post.fetch({
                        method: 'POST',
                        type: 'json',
                        body: param,
                        headers: {"Content-Type": "application/x-www-form-urlencoded"},
                        url: 'https://www.aftdc.com/businessapp/Article/editMood',
                    }, function (res) {
                        if (res.data.res == 1) {
                        }
                    })
                    event.delete("content");
                }


                // 转发添加转发数
                if(event.find('myIndex')){
                    var index = event.find('myIndex');
                    var id = that.dynamic[index].info.article.id;
                    param+='&id='+id+'&content='+'';
                    post.fetch({
                        method: 'POST',
                        type: 'json',
                        body: param,
                        url: 'https://www.aftdc.com/userapp/Article/forwardArticle',
                        headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    }, function (res) {

                        if (res.data.res == 1) {

                            for(let i=0;i<that.dynamic.length;i++){//当分享数为null时,变成0,也可以由后台修改
                                if(!that.dynamic[i].share_num){
                                    that.$set(that.dynamic[i],'share_num',0)
                                }
                                if(that.dynamic[i].info.article.id==id){
                                    that.$set(that.dynamic[i],'share_num',that.dynamic[i].share_num+1)
                                }
                            }
                        }
                    })
                    event.delete('myIndex');
                }
            },
        }
    }
</script>

<style>



    /*下拉刷新*/
    .refresh {
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
    .donkey {
        margin-top: 16px;
        height: 100px;
        width: 100px;
        color: #53beb7;
        margin-bottom: 16px;

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
    .moreRecentlyOrder{
        align-items: center;
        justify-content: center;
        height: 60px;
    }

    .moreRecentlyOrderText{
        font-size: 28px;
        color:#999;
    }



    /*主体部分start*/
    .subjectLeft{
        margin-left: -60px;
        width: 810px;
    }
    .subjectAll{
        position: relative;
        padding-top: 20px;
        padding-right: 20px;
        flex-direction: row;
        margin-bottom: 20px;
        background-color: #fff;
    }
    .blank{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }
    .selectIcon{
        width: 40px;
        height: 40px;
        margin-left: 20px;
        margin-right: 20px;
        margin-top: 35px;
    }
    .orderName{

    }
    .orderImg{
        width: 80px;
        height: 80px;
        border-radius: 50px;
        margin-right: 20px;
    }
    .myName{
        font-weight: bold;
    }
    .isTime{
        margin-top: 10px;
    }
    .forward{
        line-height: 40px;
    }
    .operType{
        margin-left: 10px;
    }
    .blue{
        color: skyblue;
    }
    .content{
        width: 710px;

    }
    .score{
        margin-right: 20px;
    }
    .start{
        width: 150px;
        height: 24px;
        position: relative;
    }
    .noStart{
        width: 150px;
        height: 24px;
    }
    .startDiv{
        position: absolute;
        left: 0;
        top: 0;
        height: 24px;
    }
    .tips{
        margin-top: 15px;
        margin-right: 10px;
    }
    .tipsIcon{
        width: 35px;
        height: 35px;
    }
    .articelContent{
        flex-direction: row;
        border-radius: 10px;
        margin-top: 20px;
        border-style: solid;
        border-width: 1px;
        border-color: #dedede;
        width: 710px;
        /*background-color: skyblue;*/
    }
    .contentText{
        margin-left: 20px;
        margin-top: 20px;
        margin-right: 20px;
        margin-bottom: 20px;
        width: 470px;
    }
    .contentImg{
        width: 180px;
        height: 180px;
        margin-top: 20px;
        margin-right: 20px;
        border-radius: 5px;
        margin-bottom: 20px;
    }
    .forwardBtn{
        width: 750px;
    }
    .btn{
        flex: 1;
        height: 80px;
        align-items: center;
        justify-content: center;
    }
    .goShopIcon{
        width: 40px;
        height: 40px;
        border-radius: 40px;
    }
    .leftIcon{
        width: 35px;
        height: 35px;
        opacity: 0.6;
    }
    .centerIcon{
        width: 40px;
        height: 40px;
    }
    .rightIcon{
        width: 40px;
        height: 40px;
    }
    .evaluateDiv{
        flex-direction: row;
        align-items: center;
        flex-wrap: wrap;
        width: 732px;
        padding-left: 1px;
        padding-right: 1px;
        margin-top: 15px;
    }
    .evaluateImg{
        width: 161px;
        height: 161px;
        margin-right: 20px;
        border-radius: 5px;
    }
    .allSelect{
        flex: 1;
        position: relative;
        border-right-style: solid;
        border-right-width: 4px;
        border-right-color: #dedede;
    }
    .allSelectIcon{
        position: absolute;
        width: 40px;
        height: 40px;
        top: 22px;
        left: 40px;

    }
    .allSelectText{
        text-align: center;
        line-height: 80px;
        flex: 1;
    }
    .allSelectDiv{
        height: 100px;
        padding-top: 10px;
        padding-bottom: 10px;
        margin-bottom: -100px;
        background-color: #fff;
        border-top-style: solid;
        border-top-width: 1px;
        border-top-color: #dedede;
    }
    .delText{
        text-align: center;
        line-height: 80px;
        flex: 1;
    }
    /*主体部分end*/





    /*主体部分导航start*/
    .subjectBar{
        padding-top: 20px;
        padding-bottom: 20px;
        padding-left: 30px;
        padding-right: 30px;
        justify-content: space-between;
        border-top-style: solid;
        border-top-width: 2px;
        border-top-color: #dedede;
        border-bottom-style: solid;
        border-bottom-width: 2px;
        border-bottom-color: #dedede;
        background-color: #fff;
    }
    .subjectCell{
        /*position: sticky;*/
    }
    /*主体部分导航end*/





    /*编辑个性签名弹出层start*/
    .autographCancel{
        width: 120px;
        text-align: center;
        line-height: 61px;
    }
    .autographBtn{
        height: 61px;
        justify-content: flex-end;
    }
    .fontNum{
        margin-right: 30px;
        text-align: right;
        margin-top: 10px;
    }
    .autographArea{
        margin-left: 20px;
        margin-right: 20px;
        margin-top: 20px;
        border-bottom-style: solid;
        border-bottom-width: 2px;
        border-bottom-color: #dedede;
    }
    .demoAutograph{
        padding-top: 20px;
        padding-left: 20px;
    }
    /*编辑个性签名弹出层end*/




    /*头部用户信息start*/
    .autograph{
        margin-top: 20px;
        flex: 1;
    }
    .autographInput{
        margin-top: 20px;
        flex: 1;
        padding-top: 10px;
        padding-bottom: 10px;
        lines:2;
    }
    .fans{
        width: 58px;
        text-align: center;
        margin-top: 20px;
    }
    .num{
        width: 58px;
        text-align: center;
        font-weight: bold;
    }
    .fansAll{
        justify-content: space-between;
    }
    .userAll{
        margin-left: 50px;
        margin-right: 50px;
        flex: 1;
    }
    .userImg{
        width: 150px;
        height: 150px;
        border-radius: 100px;
        margin-left: 30px;
    }
    .all{
        padding-top: 20px;
        padding-bottom: 40px;
        background-color: #fff;
    }
    /*头部用户信息end*/


    .bigBox {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        opacity: 0;
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
    .cell {
        width: 750px;

    }
    .page {
        width: 750px;
        flex: 1;
    }
    .refresh {
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
    .indicator {
        margin-top: 10px;
        height: 40px;
        width: 40px;
        color: blue;
    }


    .wrapper {
        flex-direction: column;
        background-color: #f8f8f8;
    }
    /* 公共样式 */
    .row {
        flex-direction: row;
    }
    .aiCenter {
        align-items: center;
    }
    /* 导航栏 */
    .backImg {
        width: 40px;
        height: 40px;
    }
    .headerCenter{
        text-align:center;
        width:400px;
        lines:1;
        overflow: hidden;
        white-space:nowrap;
        text-overflow:ellipsis
    }
    /*上拉加载*/
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
    .indicator-text {
        color: #666;
        font-size: 28px;
        text-align: center;
        margin-top: 30px;
        margin-bottom: 30px;
    }
    .indicator {
        margin-top: 16px;
        height: 40px;
        width: 40px;
        color: blue;
    }


    /*审核失败原因提示框*/
    .auditReasons{
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        flex: 1;
    }
    .auditReasonsDetails{
        padding-left: 20px;
        padding-right: 20px;
        line-height: 40px;
    }
    .auditReasonsTitle{
        padding-top: 25px;
        font-weight: bold;

    }
    .auditReasonsSureButton{
        /*width: 400px;*/
        /*text-align: center;*/
        /*padding-top: 20px;*/
        /*padding-bottom: 20px;*/
        /*background-color: #53beb7;*/
        /*border-radius: 8px;*/
        /*margin-bottom: 25px;*/
        width: 600px;
        text-align: center;
        padding-top: 20px;
        padding-bottom: 20px;
        border-top-width: 1px;
        border-top-style: solid;
        border-top-color: #dedede;
    }
    .auditReasonsSureButton:active{
        background-color: #f8f8f8;
    }
    .videoblackBg{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #666;
        opacity: 0.3;
    }
    .row{
        flex-direction: row;
        align-items: center;
    }
</style>


