
<template>
    <div class="colection">
        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    @wxcMinibarRightButtonClicked="minibarRightButtonClick(sliderIndex)"
            >
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">历史记录</text>
                <text v-if="sliderIndex==0" :style="{fontSize:'32px',color:isShopEdit?'#f85c5e':'#fff'}"  slot="right">{{isShopEdit?'取消':'编辑'}}</text>
                <text v-else :style="{fontSize:'32px',color:isArticelEdit?'#f85c5e':'#fff'}"  slot="right">{{isArticelEdit?'取消':'编辑'}}</text>

            </wxc-minibar>
        </div>
        <!--头部-->
        <div class="colectionBar row">
            <text class="shop" :class="[barIndex==0?'shopTwo':'']" :style="{fontSize:GLOBAL.bigFS,color:barIndex==0?GLOBAL.tColor:GLOBAL.dColor}" @click="barClick(0)">店铺</text>
            <text class="shop" :class="[barIndex==1?'shopTwo':'']" :style="{fontSize:GLOBAL.bigFS,color:barIndex==1?GLOBAL.tColor:GLOBAL.dColor}" @click="barClick(1)">文章</text>
        </div>

        <!--店铺和文章部分-->
        <slider class="scrollerBig" @change="change" :index="sliderIndex">

            <!--店铺-->
            <div class="listDiv">
                <list class="scroller">

                    <refresh class="refresh" @refresh="onrefreshShop" :display="refreshing? 'show' : 'hide'">
                        <image class="indicator" src="https://image.aftdc.com/appBimg/ic_loading_gif.gif"></image>
                    </refresh>

                    <cell>
                        <div class="shopDivAll" ref="shopDel">
                            <div class="shopDiv row" v-for="(item,index) in shopInfo" :key="index" @click="toShop(index)">

                                <!--左侧选择删除按钮-->
                                <image class="selectIcon" :src="shopInfoLngth[index].select?'https://image.aftdc.com/appBimg/ic_check_box_checked.png':'https://image.aftdc.com/appBimg/ic_check_box_normal.png'"></image>

                                <!--店铺内容-->
                                <div class="row">
                                    <image class="shopImg" :src="'https://image.aftdc.com/'+item.shopImg"></image>
                                    <div style="margin-left: 20px;flex: 1;">
                                        <div class="shopTop row">
                                            <text class="shopName" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.shopName}}</text>
                                            <text class="juli" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">{{item.distance}}</text>
                                        </div>
                                        <div class="shopCenter">
                                            <image class="starIcon" src="https://image.aftdc.com/appBimg/icon_wuxing_nocolor.png"></image>
                                            <div class="starDiv" :style="{width:item.shopAvg*30+'px'}">
                                                <image class="starIcon" src="https://image.aftdc.com/appBimg/icon_wuxing_color.png"></image>
                                            </div>
                                        </div>
                                        <div class="shopBotton row">
                                            <text class="give" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">起送&nbsp;￥{{item.deliveryFreeMoney}}&nbsp;&nbsp;配送&nbsp;￥{{item.deliveryStartMoney}}</text>
                                            <!--<text class="canCel" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.tColor}" @click="cancelClick(index)">取消收藏</text>-->
                                        </div>
                                    </div>
                                </div>

                                <!--选择删除点击白板-->
                                <div class="balnk" v-if="isShopEdit" @click="delShopSelect(index)"></div>

                            </div>
                        </div>
                    </cell>

                    <cell :style="{flex:1}">
                        <noOrder img="https://image.aftdc.com/appBimg/icon_no_order.png" textOne="暂无店铺" textTwo="" v-if="shopInfo.length<=0"></noOrder>
                    </cell>

                    <loading class="loading" @loading="onloadingShop" :display="loadinging ? 'show' : 'hide'">
                        <image class="indicator" src="https://image.aftdc.com/appBimg/ic_loading_gif.gif" v-if="!noMoreShop"></image>
                        <div class="moreRecentlyOrder" v-else>
                            <text class="moreRecentlyOrderText">没有更多了~</text>
                        </div>
                    </loading>

                </list>

                <div :style="{height:'100px'}" v-if="isShopEdit"></div>

                <!--店铺删除全选-->
                <div class="row allSelectDiv" ref="allShopSelect" v-if="shopInfo.length>0">
                    <div class="row allSelect" @click="allShopSelect">
                        <image class="allSelectIcon" :src="isShopAllSelect?'https://image.aftdc.com/appBimg/ic_check_box_checked.png':'https://image.aftdc.com/appBimg/ic_check_box_normal.png'"></image>
                        <text class="allSelectText">{{isShopAllSelect?'全不选':'全选'}}</text>
                    </div>
                    <text class="delText" @click="allShopDel">删除</text>
                </div>
            </div>

            <!--文章-->
            <div class="listDiv">
                <list class="scroller">

                    <refresh class="refresh" @refresh="onrefreshArticel" :display="refreshing? 'show' : 'hide'">
                        <image class="indicator" src="https://image.aftdc.com/appBimg/ic_loading_gif.gif"></image>
                    </refresh>

                    <cell>
                        <div class="articelAll" ref="articelDel">
                            <div class="contentStyle" :class="[index===4?'noBorder':'']" v-for="(item,index) in articleInfo" @click="toArticleContent(item.article_id)">

                                <div :style="{flexDirection:'row'}">
                                    <!--文章删除选择图标-->
                                    <image class="selectIcon" :src="articleLngth[index].select?'https://image.aftdc.com/appBimg/ic_check_box_checked.png':'https://image.aftdc.com/appBimg/ic_check_box_normal.png'"></image>

                                    <div v-if="item.cover_type!=1">
                                        <div class="row activeHeadInfo">
                                            <div class="row">
                                                <div class="ArticlePortrait"><image class="ArticlePortrait" :src="'https://image.aftdc.com/'+item.shopImg"></image></div>
                                                <text class="shopAnTimeSize" :style="{fontSize:GLOBAL.defaultFS,marginLeft:'10px'}">{{item.shopName}}</text>
                                            </div>
                                            <text class="shopAnTimeSize" :style="{fontSize:GLOBAL.smallFS}">{{item.city}} {{item.distance}}</text>
                                        </div>
                                        <text v-if="item.cover_type!=5" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">{{item.title}}</text>
                                        <div class="coverImgStyle" >
                                            <div class="threeImg" v-if="item.cover_type==3">
                                                <image class="threeImgSize" :src="'https://image.aftdc.com/'+item.cover_img[0]"></image>
                                                <image class="threeImgSize" :src="'https://image.aftdc.com/'+item.cover_img[1]"></image>
                                                <image class="threeImgSize" :src="'https://image.aftdc.com/'+item.cover_img[2]"></image>
                                            </div>
                                            <div class="bigImg" v-if="item.cover_type==2">
                                                <image class="bigImgSize" :src="'https://image.aftdc.com/'+item.cover_img[0]"></image>
                                            </div>
                                            <div class="videoImg" v-if="item.cover_type==5">
                                                <image class="bigImgSize" :src="'https://image.aftdc.com/'+item.cover_img[0]"></image>
                                                <div class="videoPlay">
                                                    <image class="videoPlayImg" src="https://image.aftdc.com/appBimg/icon_vadeoPlay.png"></image>
                                                </div>
                                                <text class="videoTitle">{{item.title}}</text>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-if="item.cover_type==1">
                                        <div class="row activeHeadInfo">
                                            <div class="row">
                                                <div class="ArticlePortrait"><image class="ArticlePortrait" :src="'https://image.aftdc.com/'+item.shopImg"></image></div>
                                                <text class="shopAnTimeSize toEllipsis" :style="{fontSize:GLOBAL.bigFS,marginLeft:'10px'}">{{item.shopName}}</text>
                                            </div>
                                            <text class="shopAnTimeSize" :style="{fontSize:GLOBAL.smallFS}">{{item.city}} {{item.distance}}</text>
                                        </div>
                                        <div class="smallImgContent">
                                            <text class="smallImgeText" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">123{{item.title}}</text>
                                            <image class="smallImgSize" :src="'https://image.aftdc.com/'+item.cover_img[0]"></image>
                                        </div>
                                    </div>
                                </div>
                                <div class="articleMessage">
                                    <text class="shopAnTimeSize" :style="{fontSize:GLOBAL.smallFS}">{{item.read_num}}{{item.cover_type===5?'播放':'阅读'}}  {{item.comment_num}}{{item.commentOrleaveWord==1?'评论':'留言'}}  {{item.praise_num}}点赞 {{item.timestamp}}</text>
                                </div>

                                <!--选择删除点击白板-->
                                <div class="balnk" v-if="isArticelEdit" @click="delArticelSelect(index)"></div>

                            </div>
                        </div>

                    </cell>

                    <cell :style="{flex:1}">
                        <noOrder class="noOrderTwo" img="https://image.aftdc.com/appBimg/icon_no_order.png" textOne="暂无文章" textTwo="" v-if="articleInfo.length<=0"></noOrder>
                    </cell>

                    <loading class="loading" @loading="onloadingArticel" :display="loadinging ? 'show' : 'hide'">
                        <image class="indicator" src="https://image.aftdc.com/appBimg/ic_loading_gif.gif" v-if="!noMoreArticel"></image>
                        <div class="moreRecentlyOrder" v-else>
                            <text class="moreRecentlyOrderText">没有更多了~</text>
                        </div>
                    </loading>

                </list>

                <div :style="{height:'100px'}" v-if="isArticelEdit"></div>

                <!--文章删除全选-->
                <div class="row allSelectDiv" ref="allArticelSelect" v-if="articleInfo.length>0">
                    <div class="row allSelect" @click="allArticelSelect">
                        <image class="allSelectIcon" :src="isArticelAllSelect?'https://image.aftdc.com/appBimg/ic_check_box_checked.png':'https://image.aftdc.com/appBimg/ic_check_box_normal.png'"></image>
                        <text class="allSelectText">{{isArticelAllSelect?'全不选':'全选'}}</text>
                    </div>
                    <text class="delText" @click="allArticelDel">删除</text>
                </div>
            </div>


        </slider>
        <toast ref="toast"></toast>

    </div>

    <!--</div>-->
</template>

<script>
    import { WxcMask,WxcPopup,WxcPopover,WxcMinibar } from 'weex-ui';
    import  Toast from './Toast.vue';
    import noOrder from './noOrder.vue';
    const event=weex.requireModule('event');
    const post = weex.requireModule('stream');
    const navigator = weex.requireModule('navigator');
    const GLOBAL = require('@/Global.vue');
    const animation = weex.requireModule('animation');
    const modal = weex.requireModule('modal');
    export default {
        components: { WxcMask,WxcPopup,WxcPopover,Toast,WxcMinibar,noOrder },
        name: 'App',
        data() {
            return {
                barIndex:0,
                sliderIndex:0,
                refreshing:false,
                loadinging:false,
                noMoreShop:false,
                noMoreArticel:false,
                shopInfoLngth:[],
                articleLngth:[],
                isShopEdit:false,
                isArticelEdit:false,

                isShopAllSelect:false,
                isArticelAllSelect:false,

                shopInfo:[],
                articleInfo:[],

                token:'',
                imei:'',
            }
        },
        created(){
            var that=this;
            that.token = weex.config.token;
            that.imei = weex.config.imei;
            that.latitude = weex.config.latitude;
            that.longitude = weex.config.longitude;
            that.getShop(0);
            that.getArticel(0);
        },
        methods: {
            getShop(index){//获取店铺数据
                var that=this;
                that.refreshing=true;
                var param= that.GLOBAL.sign(that.token,that.imei);
                param+= '&page=0' +'&latitude='+that.latitude +'&longitude='+that.longitude;

                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: 'https://www.aftdc.com/userapp/Mine/getShopHistory',
                }, function (res) {
                    if(res.data.res==1){
                        var shopInfo=res.data.data.shopInfo;
                        that.shopInfo=shopInfo;

                        that.shopInfoLngth=[];
                        //获取数据时,向shopInfoLngth添加数据
                        for(var i in shopInfo){
                            that.shopInfoLngth.push({select:false})
                        }
                        if(shopInfo.length<20){
                            that.noMoreShop=true;
                        }
                    }
                    else{
                        that.noMoreShop=true;
                        if(index==1){
                            const toast =that.$refs.toast;
                            toast.editContent(res.data.info);
                        }
                    }
                    that.refreshing=false;
                });
            },

            onrefreshShop:GLOBAL.throttle(function () {//店铺下拉刷新
                var that=this;
                that.getShop(1);

                if(that.isShopEdit){
                    that.minibarRightButtonClick(0);
                }
            }),

            onloadingShop:GLOBAL.throttle(function () {//店铺上拉加载
                var that=this;
                that.loadinging=true;
                var page=that.shopInfo.length;
                var param= that.GLOBAL.sign(that.token,that.imei);
                param+= '&page='+page +'&latitude='+that.latitude +'&longitude='+that.longitude;

                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: 'https://www.aftdc.com/userapp/Mine/getShopHistory',
                }, function (res) {
                    if(res.data.res==1){
                        var shopInfo=res.data.data.shopInfo;
                        that.shopInfo=that.shopInfo.concat(shopInfo);

                        //更新用于删除选择功能的shopInfoLngth
                        for(var i in shopInfo){
                            that.shopInfoLngth.push({select:false})
                        }
                    }
                    else{
                        const toast =that.$refs.toast;
                        toast.editContent(res.data.info);
                        that.noMoreShop=true;
                    }
                    that.loadinging=false;
                });
            }),

            getArticel(index){//获取文章数据
                var that=this;
                var param= that.GLOBAL.sign(that.token,that.imei);
                param+= '&page=0' +'&latitude='+that.latitude +'&longitude='+that.longitude;
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: 'https://www.aftdc.com/userapp/Mine/getArticleHistory',
                }, function (res) {
                    if(res.data.res==1){
                        var articleInfo=res.data.data.articleInfo;
                        that.articleInfo=articleInfo;

                        if(articleInfo.length<20){
                            that.noMoreArticel=true;
                        }

                        that.articleLngth=[];
                        for(var i in articleInfo){
                            that.articleLngth.push({select:false})
                        }
                    }
                    else{
                        that.noMoreArticel=true;
                        if(index==1){
                            const toast =that.$refs.toast;
                            toast.editContent(res.data.info);
                        }
                    }
                    that.refreshing=false;
                });
            },

            onrefreshArticel:GLOBAL.throttle(function () {//文章下拉刷新
                var that=this;
                that.refreshing=true;
                that.getArticel(1);
            }),

            onloadingArticel:GLOBAL.throttle(function () {//文章上拉加载
                var that=this;
                that.loadinging=true;
                var page=that.articleInfo.length;
                var param= that.GLOBAL.sign(that.token,that.imei);
                param+='&page='+page +'&latitude='+that.latitude +'&longitude='+that.longitude;

                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: 'https://www.aftdc.com/userapp/Mine/getArticleHistory',
                }, function (res) {
                    if(res.data.res==1){
                        var articleInfo=res.data.data.articleInfo;
                        that.articleInfo=that.articleInfo.concat(articleInfo);


                        //更新用于删除选择功能的shopInfoLngth
                        for(var i in articleInfo){
                            that.articleLngth.push({select:false})
                        }
                    }
                    else{
                        const toast =that.$refs.toast;
                        toast.editContent(res.data.info);
                        that.noMoreArticel=true;
                    }
                    that.loadinging=false;
                });
            }),


            toArticleContent:GLOBAL.throttle(function (id) {
                var param=id;
                var url='http://assets/articleContent.js';
                event.toUrl({ "url": url, "param": param });
            }),

            barClick(index){
                var that=this;
                if(that.sliderIndex!=index){
                    that.sliderIndex=index;
                    that.barIndex=index;

                    if(index==1&&that.isShopEdit) that.minibarRightButtonClick(0);
                    if(index==0&&that.isArticelEdit) that.minibarRightButtonClick(1);
                }
            },
            change(e){
                var that=this;
                that.sliderIndex=e.index;
                that.barIndex=e.index;
            },

            minibarLeftButtonClick() {
                navigator.pop({animated: 'false'});
            },

            minibarRightButtonClick(index) {
                var that = this;
                var isEdit='';
                if (index == 0) {//店铺
                    var testEl = that.$refs.shopDel;
                    var testE2 = that.$refs.allShopSelect;
                    isEdit=that.isShopEdit;

                }
                else{//文章
                    var testEl = that.$refs.articelDel;
                    var testE2 = that.$refs.allArticelSelect;
                    isEdit=that.isArticelEdit;
                }
                if (!isEdit) {
                    if(index==0) that.isShopEdit=true;
                    else that.isArticelEdit = true;

                    animation.transition(testEl, {
                        styles: {
                            transform: 'translate(60px, 0px)',
                        },
                        duration: 200, //ms
                        timingFunction: 'ease',
                        delay: 0 //ms
                    })
                    animation.transition(testE2, {
                        styles: {
                            transform: 'translate(0px, -100px)',
                        },
                        duration: 200, //ms
                        timingFunction: 'ease',
                        delay: 0 //ms
                    })
                }
                else {
                    if(index==0) that.isShopEdit=false;
                    else that.isArticelEdit=false;

                    animation.transition(testEl, {
                        styles: {
                            transform: 'translate(0px, 0px)',
                        },
                        duration: 200, //ms
                        timingFunction: 'ease',
                        delay: 0 //ms
                    })
                    animation.transition(testE2, {
                        styles: {
                            transform: 'translate(0px, 0px)',
                        },
                        duration: 200, //ms
                        timingFunction: 'ease',
                        delay: 0 //ms
                    })

                    // 点击关闭编辑时,把选择的项去除,和恢复全选按钮的原状态
                    for (var i in that.shopInfoLngth) {
                        that.shopInfoLngth[i].select = false;
                    }
                    that.isShopAllSelect = false;

                    for (var i in that.articleLngth) {
                        that.articleLngth[i].select = false;
                    }
                    that.isArticelAllSelect = false;
                }
            },

            delShopSelect(index){//店铺删除选择
                var that=this;
                if(that.shopInfoLngth[index].select){
                    that.shopInfoLngth[index].select=false;
                    var num=0;
                    for(var i in that.shopInfoLngth){
                        if(!that.shopInfoLngth[i].select){
                            num+=1;
                        }
                    }
                    if(num==that.shopInfoLngth.length){
                        that.isShopAllSelect=false;
                    }

                }
                else{
                    that.shopInfoLngth[index].select=true;
                    var num=0;
                    for(var i in that.shopInfoLngth){
                        if(that.shopInfoLngth[i].select){
                            num+=1;
                        }
                    }
                    if(num==that.shopInfoLngth.length){
                        that.isShopAllSelect=true;
                    }
                }
            },

            delArticelSelect(index){//文章删除选择
                var that=this;
                if(that.articleLngth[index].select){

                    that.articleLngth[index].select=false;

                    var num=0;
                    for(var i in that.articleLngth){
                        if(!that.articleLngth[i].select){
                            num+=1;
                        }
                    }
                    if(num==that.articleLngth.length){
                        that.isArticelAllSelect=false;
                    }
                }
                else{
                    that.articleLngth[index].select=true;
                    var num=0;
                    for(var i in that.articleLngth){
                        if(that.articleLngth[i].select){
                            num+=1;
                        }
                    }
                    if(num==that.articleLngth.length){
                        that.isArticelAllSelect=true;
                    }
                }
            },

            allShopSelect(){//店铺删除的全选,全不选
                var that=this;
                if(that.isShopAllSelect){
                    for(var i in that.shopInfoLngth){
                        that.shopInfoLngth[i].select=false;
                    }
                    that.isShopAllSelect=false;
                }
                else{
                    for(var i in that.shopInfoLngth){
                        that.shopInfoLngth[i].select=true;
                    }
                    that.isShopAllSelect=true;
                }
            },

            allArticelSelect(){//文章删除的全选,全不选
                var that=this;
                if(that.isArticelAllSelect){
                    for(var i in that.articleLngth){
                        that.articleLngth[i].select=false;
                    }
                    that.isArticelAllSelect=false;
                }
                else{
                    for(var i in that.articleLngth){
                        that.articleLngth[i].select=true;
                    }
                    that.isArticelAllSelect=true;
                }
            },

            allShopDel:GLOBAL.throttle(function () {//店铺执行删除
                var that=this;
                let num=0;
                var id= [];
                for(var i in that.shopInfoLngth){
                    if(that.shopInfoLngth[i].select){
                        id.push(that.shopInfo[i].id)
                        num+=1;
                    }
                }
                if(num==0){
                    const toast =that.$refs.toast;
                    toast.editContent('未选择删除项');
                    return false;
                }

                // modal.toast({
                //     message:JSON.stringify(delArr)
                // })

                var param = this.GLOBAL.sign(that.token,that.imei);
                param+='&id='+JSON.stringify(id);
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/userapp/Mine/delShopHistory',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                }, function (res) {
                    if (res.data.res == 1) {

                        const toast =that.$refs.toast;
                        toast.editContent(res.data.info);

                        // 删除dynamicLngth被删除的数据
                        for(var i=that.shopInfoLngth.length-1;i>-1;i--){
                            if(that.shopInfoLngth[i].select){
                                that.shopInfo.splice(i,1)
                            }
                        }

                        //定时器,防止删除dynamic数据时,dynamicLngth已经被清空
                        setTimeout(function () {
                            //清空dynamicLngth中保存dynamicLngth删除选择的数据
                            that.shopInfoLngth=[];
                            //从新给dynamicLngth赋值
                            for(var i in that.shopInfo){
                                that.shopInfoLngth.push({select:false})
                            }
                        },20)

                        //收起删除按钮
                        that.minibarRightButtonClick(0);
                    }
                    else{
                        const toast =that.$refs.toast;
                        toast.editContent(res.data.info);
                    }
                })
            }),

            allArticelDel:GLOBAL.throttle(function () {//文章执行删除
                var that=this;
                var num=0;
                var id= [];
                for(let i in that.articleLngth){
                    if(that.articleLngth[i].select){
                        id.push(that.articleInfo[i].id)
                        num+=1;
                    }
                }
                if(num==0){
                    const toast =that.$refs.toast;
                    toast.editContent('未选择删除项');
                    return false;
                }


                var param = this.GLOBAL.sign(that.token,that.imei);
                param+='&id='+JSON.stringify(id);
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/userapp/Mine/delArticleHistory',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                }, function (res) {
                    if (res.data.res == 1) {

                        const toast =that.$refs.toast;
                        toast.editContent(res.data.info);

                        // 删除dynamicLngth被删除的数据
                        for(var i=that.articleLngth.length-1;i>-1;i--){
                            if(that.articleLngth[i].select===true){
                                that.articleInfo.splice(i,1)
                            }
                        }

                        //定时器,防止删除dynamic数据时,dynamicLngth已经被清空
                        setTimeout(function () {
                            //清空dynamicLngth中保存dynamicLngth删除选择的数据
                            that.articleLngth=[];
                            //从新给dynamicLngth赋值
                            for(var i in that.articleInfo){
                                that.articleLngth.push({select:false})
                            }
                        },20)

                        //收起删除按钮
                        that.minibarRightButtonClick(1);
                    }
                    else{
                        const toast =that.$refs.toast;
                        toast.editContent(res.data.info);
                    }
                })
            }),

            toShop:GLOBAL.throttle(function (index) {

                var that=this;
                var orderType='';
                var shopType='';
                if(that.shopInfo[index].featured==0) {//主打业务 0 外卖 3堂食预订 5到店自取
                    orderType=0;
                    shopType=1;
                }
                else if(that.shopInfo[index].featured==3){
                    orderType=3;
                    shopType=5;
                }
                else if(that.shopInfo[index].featured==5){
                    orderType=5;
                    shopType=2;
                }

                var shopId=that.shopInfo[index].shopId;

                var url='http://assets/businessOrder.js';
                var param={shopId:shopId,orderType:orderType,shopType:shopType};
                event.toUrl({url:url,param:JSON.stringify(param)});
            }),

            toArticleContent:GLOBAL.throttle(function () {
                var param='';
                var url='http://assets/articleContent.js';
                event.toUrl({"url":url,"param":param})
            }),
        }
    }

</script>

<style scoped>

    /*删除全选*/
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




    /*白板*/
    .balnk{
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
    }



    /*文章*/
    .articelAll{
        width: 810px;
        margin-left: -60px;
    }
    .contentStyle {
        padding-left: 20px;
        padding-right: 20px;
        background-color: #fff;
        margin-bottom: 20px;
    }
    .activeHeadInfo {
        width: 710px;
        justify-content: space-between;
        padding-top: 20px;
        padding-bottom: 20px;
    }
    .ArticlePortrait {
        width: 45px;
        height: 45px;
        border-radius: 30px;
    }
    .shopAnTimeSize {
        color: #999;
        margin-right: 10px;
    }
    .coverImgStyle {
        margin-top: 15px;
        margin-bottom: 15px;
    }
    .threeImg{
        width: 710px;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
    .threeImgSize{
        width: 220px;
        height: 165px;
        border-radius: 3px;
    }
    .bigImg{
        flex-direction: row;
    }
    .bigImgSize{
        width: 710px;
        height:415px;
        border-radius: 5px;
    }
    .videoTitle{
        position: absolute;
        left: 10px;
        top: 10px;
        right: 10px;
        line-height: 40px;
        color: #fff;
    }
    .videoImg{
        flex-direction: row;
        position: relative;
    }
    .videoPlay{
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        justify-content: center;
        align-items: center;
        background-color: rgba(0,0,0,0.3);
    }
    .videoPlayImg{
        width: 100px;
        height: 100px;
    }
    .smallImgContent{
        flex-direction: row;
        justify-content: space-between;
        /*align-items: center;*/
        margin-bottom: 15px;
    }
    .smallImgeText{
        width: 450px;
        lines:3,
    }
    .smallImgSize{
        width: 220px;
        height: 165px;
        border-radius: 5px;
    }
    .toEllipsis {
        max-width: 400px;
        lines:1;
        text-overflow: ellipsis;
    }
    .articleMessage {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding-top: 20px;
        padding-bottom: 20px;
        margin-left: 60px;
    }
    .closeIcon{
        color: #d1d1d1;
        width: 35px;
        height: 25px;
        line-height: 25px;
        border-radius: 5px;
        text-align: center;
        border-style: solid;
        border-width: 1px;
        border-color: #d1d1d1;
        margin-left: 20px;
    }




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
    .indicator {
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
        height: 80px;
    }
    .moreRecentlyOrderText{
        font-size: 28px;
        color:#999;
    }




    .give{
        flex: 1;
    }
    .articleBotton{
        margin-top: 45px;
    }
    .shopBotton{
        margin-top: 15px;
    }
    .starDiv{
        overflow: hidden;
        position: absolute;
        left: 0;
        top: 0;
    }
    .starIcon{
        width: 150px;
        height: 24px;
    }
    .shopCenter{
        position: relative;
        width: 150px;
        height: 24px;
        margin-top: 10px;
    }
    .shopName{
        font-weight: bold;
        flex: 1;
    }
    .shopImg{
        width: 130px;
        height: 130px;
        border-radius: 10px;
    }
    .selectIcon{
        width: 40px;
        height: 40px;
        margin-right: 20px;
        margin-top: 25px;
    }
    .shopDiv{
        padding-top: 20px;
        padding-bottom: 20px;
        padding-left: 20px;
        padding-right: 20px;
        background-color: #fff;
        margin-bottom: 20px;
        position: relative;
    }
    .shopDivAll{
        position: relative;
        width: 810px;
        margin-left: -60px;

    }
    .scrollerBig{
        position: absolute;
        top: 200px;
        bottom: 0;
        width: 750px;
    }
    .scroller{
        flex: 1;
    }
    .listDiv{
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        width: 750px;
    }
    .shopTwo{
        border-bottom-color: #53beb7;
    }
    .shop{
        flex: 1;
        line-height: 86px;
        text-align: center;
        border-bottom-style: solid;
        border-bottom-width: 4px;
        border-bottom-color: #fff;

    }
    .colectionBar{
        height: 90px;
        background-color: #fff;
    }
    .colection{
        background-color: #f8f8f8;
    }
    .row{
        flex-direction: row;
        align-items: center;
    }
</style>
