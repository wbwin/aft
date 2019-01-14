<template>
    <div class="personalInfo" @viewappear="viewappear">
        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    @wxcMinibarRightButtonClicked="toListFriends"
            >
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <div class="row" slot="middle">
                    <text class="barBtn" :class="[!barIndex?'':'noSelect']" :style="{fontSize:GLOBAL.bigFS}" @click="follow(0)">关注</text>
                    <text class="jiange"></text>
                    <text class="barBtn" :class="[barIndex?'':'noSelect']" :style="{fontSize:GLOBAL.bigFS}" @click="follow(1)">粉丝</text>
                </div>
                <div slot="right" class="contacts">
                    <image class="contactsList" src="https://image.aftdc.com/appBimg/addContacts.png"></image>
                    <text class="contactsListText" :style="{fontSize:GLOBAL.smallerFS}">通讯录</text>
                </div>
            </wxc-minibar>
        </div>
        <slider class="slider" @change="change" :index="sliderIndex">

            <list class="list">
                <cell>
                    <div class="row all" v-for="(item,index) in attentionInfo" :key="index" @click="goPersonalPage(index)">
                        <image class="userImg" :src="'https://image.aftdc.com/'+item.img"></image>
                        <div class="userDetail">
                            <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.name}}</text>
                            <text :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">粉丝数: {{item.fansNum}}</text>
                        </div>
                        <text :class="[item.attention?'isFollow':'follow']" :style="{fontSize:GLOBAL.defaultFS}" @click="attentionClick(index)">{{item.attention==1?'已关注':item.attention==2?'互相关注':''}}</text>
                    </div>
                </cell>

                <loading class="loading" @loading="onloadingFollow" :display="loadinging ? 'show' : 'hide'">
                    <image class="indicator" src="https://image.aftdc.com/appBimg/ic_loading_gif.gif" v-if="!noMore"></image>
                    <div class="moreRecentlyOrder" v-if="noMore">
                        <text class="moreRecentlyOrderText">没有更多了~</text>
                    </div>
                </loading>
            </list>

            <list class="list">
                <cell>
                    <div class="row all" v-for="(item,index) in fansInfo" :key="index" @click="goFanPage(index)">
                        <image class="userImg" :src="item.img"></image>
                        <div class="userDetail">
                            <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.name}}</text>
                            <text :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">粉丝数: {{item.fansNum}}</text>
                        </div>
                        <text :class="[item.attention?'isFollow':'follow']" :style="{fontSize:GLOBAL.defaultFS}" @click="fansClick(index)">{{item.attention==0?'关注':'互相关注'}}</text>
                    </div>
                </cell>

                <loading class="loading" @loading="onloadingFans" :display="loadinging ? 'show' : 'hide'">
                    <image class="indicator" src="https://image.aftdc.com/appBimg/ic_loading_gif.gif" v-if="!noMoreFans"></image>
                    <div class="moreRecentlyOrder" v-if="noMoreFans">
                        <text class="moreRecentlyOrderText">没有更多了~</text>
                    </div>
                </loading>
            </list>
        </slider>

        <!--关注弹层-->
        <wxc-mask height="220"
                  width="600"
                  border-radius="15"
                  duration="200"
                  mask-bg-color="#FFFFFF"
                  :has-animation="true"
                  :has-overlay="true"
                  :show-close="false"
                  :show="attentionShow"
                  @wxcMaskSetHidden="wxcMaskSetHidden">
            <div class="content">
                <text class="attentionTip" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">提示</text>
                <text class="attentionTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">是否取消关注</text>
                <div class="row attentionBtn">
                    <text class="attentionYes" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}" @click="attentionNo">否</text>
                    <text class="attentionYes" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}" @click="attentionYes">是</text>
                </div>
            </div>
        </wxc-mask>

        <!--粉丝弹层-->
        <wxc-mask height="220"
                  width="600"
                  border-radius="15"
                  duration="200"
                  mask-bg-color="#FFFFFF"
                  :has-animation="true"
                  :has-overlay="true"
                  :show-close="false"
                  :show="fansShow"
                  @wxcMaskSetHidden="wxcMaskSetHidden">
            <div class="content">
                <text class="attentionTip" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">提示</text>
                <text class="attentionTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">是否取消关注</text>
                <div class="row attentionBtn">
                    <text class="attentionYes" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}" @click="attentionNo">否</text>
                    <text class="attentionYes" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}" @click="fansYes">是</text>
                </div>
            </div>
        </wxc-mask>

        <Toast ref="toast"></Toast>
    </div>

</template>

<script>
    import { WxcMask,WxcMinibar, WxcPopup} from 'weex-ui';
    import Toast from './Toast.vue'
    const modal = weex.requireModule('modal');
    const event = weex.requireModule('event');
    const dom = weex.requireModule('dom');
    const post = weex.requireModule('stream');
    const navigator = weex.requireModule('navigator');
    const GLOBAL = require('@/Global.vue');
    export default {

        components: {WxcMinibar, Toast, WxcPopup,WxcMask},
        data() {
            return{
                barIndex:0,
                sliderIndex:0,
                loadinging:false,
                refreshing:false,
                noMore:false,
                noMoreFans:false,

                attentionShow:false,
                attentionIndex:'',

                fansShow:false,
                fansIndex:'',

                attentionInfo:[],
                fansInfo:[],

                token:'',
                imei:'',

                fansOrAttention:0
            }
        },
        created(){
            var that=this;
            that.token = weex.config.token;
            that.imei = weex.config.imei;
            var param  = weex.config.param;
            that.barIndex=JSON.parse(param).isWho;
            that.sliderIndex=JSON.parse(param).isWho;

            that.getAttentionData(0);
            that.getFansData(0);
        },
        methods:{
            wxcMaskSetHidden(){
                var that=this;
                that.attentionShow=false;
                that.fansShow=false;
            },

            follow(index){
                var that=this;
                if(that.barIndex!=index){
                    that.barIndex=index;
                    that.sliderIndex=index;
                }

            },//关注与粉丝点击切换


            toListFriends(){//通讯录
                var param='';
                var url='http://assets/listFriends.js';
                event.toUrl({"url":url,"param":param})
            },//通讯录

            change(e){
                var that=this;
                that.barIndex=e.index;
                that.sliderIndex=e.index;
            },//slider滑动

            viewappear(){//返回这个页面时触发

                var that=this;
                // if (!that.pageBack) { return; }
                // that.pageBack = false;
                //
            },

            minibarLeftButtonClick(){
                navigator.pop({animated:'false'});
            },

            // 关注--------------------------------------------------------------------------------------------------------------------------------------------------

            getAttentionData(index){//获取关注数据
                var that=this;
                var param = that.GLOBAL.sign(that.token,that.imei);
                param+='&page=0'
                post.fetch({
                    method: 'post',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/userapp/Mine/getUserAttentionList',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                },function(res){
                    if(res.data.res==1){
                        that.apage+=res.data.data.attentionInfo.length
                        that.attentionInfo=res.data.data.attentionInfo;
                        if(res.data.data.attentionInfo.length<20) that.noMore=true;
                    }
                    else{
                        that.noMore=true;
                        if(index==1){
                            const toast =that.$refs.toast;
                            toast.editContent(res.data.info);
                        }
                    }
                    that.refreshing=false;
                });
            },//获取关注数据

            onloadingFollow:GLOBAL.throttle(function () {//关注上拉加载
                var that=this;
                that.loadinging=true;
                var page = that.attentionInfo.length;
                var param = that.GLOBAL.sign(that.token,that.imei);
                param+='&page='+page;

                post.fetch({
                    method: 'post',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/userapp/Mine/getUserAttentionList',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                },function(res){
                    if(res.data.res==1){
                        if (res.data.data.attentionInfo.length)
                            that.attentionInfo=that.attentionInfo.concat(res.data.data.attentionInfo);
                    }
                    else{
                        const toast =that.$refs.toast;
                        toast.editContent(res.data.info);
                        that.noMore=true;
                    }
                    that.loadinging=false;
                });
            }),//关注上拉加载

            attentionClick(index){//关注的取消关注
                var that=this;
                that.attentionIndex=index;
                that.fansIndex='';
                that.attentionShow=true;
            },//关注的取消关注

            attentionNo(){
                var that=this;
                that.attentionShow=false;
                that.fansShow=false;
            },

            attentionYes(){//关注页的确认取消关注
                var that=this;
                var index=that.attentionIndex;
                that.attentionShow=false;
                var param = that.GLOBAL.sign(that.token,that.imei);
                param+='&oaId='+that.attentionInfo[index].acticleAccount;

                post.fetch({
                    method: 'post',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/userapp/Mine/cancelAttentUser',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                },function(res){
                    if(res.data.res==1){
                        that.attentionInfo.splice(index,1);
                        const toast =that.$refs.toast;
                        toast.editContent(res.data.info);
                    }
                    else{
                        const toast =that.$refs.toast;
                        toast.editContent(res.data.info);
                    }
                });

            },
            goPersonalPage(index){//关注页跳转个人动态主页//商家主页
                var that=this;
                if(that.attentionInfo[index].userId){
                    var param=that.attentionInfo[index].userId;
                    var url='http://assets/personalHomepage.js';
                    event.toUrl({url:url,param:param});
                }
                else if(that.attentionInfo[index].shopId){
                    var param=JSON.stringify({aId:that.attentionInfo[index].acticleAccount});
                    var url='http://assets/headLineArticle.js';
                    event.toUrl({url:url,param:param});
                }
            },




            // 粉丝--------------------------------------------------------------------------------------------------------------------------------------------------

            getFansData(index){//获取粉丝数据
                var that=this;
                var param = that.GLOBAL.sign(that.token,that.imei);
                param+='&page=0'+'&simple=0';
                post.fetch({
                    method: 'post',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/userapp/Mine/getUserFansList',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                },function(res){
                    if(res.data.res==1){
                        that.fansInfo=res.data.data.fansInfo;
                        if(res.data.data.fansInfo.length<20) that.noMoreFans=true;
                    }
                    else{
                        that.noMoreFans=true;
                        if(index==1){
                            const toast =that.$refs.toast;
                            toast.editContent(res.data.info);
                        }
                    }
                    that.refreshing=false;
                });
            },//获取粉丝数据

            onloadingFans:GLOBAL.throttle(function () {//粉丝上拉加载
                var that=this;
                that.loadinging=true;
                var page = that.fansInfo.length;
                var param = that.GLOBAL.sign(that.token,that.imei);
                param+='&page='+page +'&simple=0';

                post.fetch({
                    method: 'post',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/userapp/Mine/getUserFansList',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                },function(res){
                    if(res.data.res==1){
                        that.fansInfo=that.fansInfo.concat(res.data.data.fansInfo);
                    }
                    else{
                        const toast =that.$refs.toast;
                        toast.editContent(res.data.info);
                        that.noMoreFans=true;
                    }
                    that.loadinging=false;
                });
            }),//粉丝上拉加载

            fansClick(index){//粉丝的关注
                var that=this;
                if(that.fansInfo[index].attention){//attention为1时关注,为2时取消关注
                    that.fansShow=true;
                    that.fansIndex=index;
                    that.attentionIndex='';
                }
                else{
                    var param = that.GLOBAL.sign(that.token,that.imei);
                    param+='&oaId='+that.fansInfo[index].acticleAccount;

                    post.fetch({
                        method: 'post',
                        type: 'json',
                        body: param,
                        url: 'https://www.aftdc.com/userapp/Mine/attentUser',
                        headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    },function(res){
                        if(res.data.res==1){
                            that.fansInfo[index].attention=2;
                            const toast =that.$refs.toast;
                            toast.editContent(res.data.info);
                        }
                        else{
                            const toast =that.$refs.toast;
                            toast.editContent(res.data.info);
                        }
                    });
                }
            },//粉丝的关注

            fansYes(){//对粉丝确认取消关注
                var that=this;
                var index=that.fansIndex;
                var param = that.GLOBAL.sign(that.token,that.imei);

                that.fansShow=false;
                param+='&oaId='+that.fansInfo[index].acticleAccount;

                post.fetch({
                    method: 'post',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/userapp/Mine/cancelAttentUser',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                },function(res){
                    if(res.data.res==1){
                        that.fansInfo[index].attention=0;
                        const toast =that.$refs.toast;
                        toast.editContent(res.data.info);
                    }
                    else{
                        const toast =that.$refs.toast;
                        toast.editContent(res.data.info);
                    }
                });
            },

            goFanPage(index){//粉丝跳转到用户个人主页/商家主页
                var that=this;
                if(that.fansInfo[index].userId){
                    var param=that.fansInfo[index].userId;
                    var url='http://assets/personalHomepage.js';
                    event.toUrl({url:url,param:param});
                }
                else if(that.fansInfo[index].shopId){
                    var param=JSON.stringify({aId:that.fansInfo[index].acticleAccount});
                    var url='http://assets/headLineArticle.js';
                    event.toUrl({url:url,param:param});
                }
            },
        },
    }
</script>

<style scoped>
    /*取消关注弹层start*/
    .attentionTip{
        padding-left: 20px;
        padding-top: 20px;
        line-height: 40px;
    }
    .attentionTitle{
        width: 600px;
        margin-left: 20px;
        line-height: 60px;
        margin-top: 20px;
    }
    .attentionBtn{
        height: 80px;
        justify-content: flex-end;
    }
    .attentionYes{
        width: 110px;
        line-height: 80px;
        text-align: center;
    }
    /*取消关注弹层end*/




    /*关注上拉加载start*/
    .moreRecentlyOrder{
        align-items: center;
        justify-content: center;
        height: 60px;
    }

    .moreRecentlyOrderText{
        font-size: 28px;
        color:#999;
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
    .indicator {
        margin-top: 16px;
        height: 100px;
        width: 100px;
        color: #53beb7;
        margin-bottom: 16px;

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
    /*关注上拉加载end*/



    /*关注主体内容start*/
    .isFollow{
        width: 120px;
        height: 60px;
        line-height: 60px;
        border-radius: 10px;
        text-align: center;
        color: #999;
        background-color: #fff;
        border-style: solid;
        border-width: 2px;
        border-color: #dedede;
    }
    .follow{
        width: 120px;
        height: 60px;
        line-height: 60px;
        border-radius: 10px;
        text-align: center;
        color: #fff;
        background-color: #f85c5e;
        border-style: solid;
        border-width: 2px;
        border-color: #f85c5e;
    }
    .userDetail{
        flex: 1;
        height: 80px;
        margin-left: 20px;
        justify-content: space-between;
    }
    .userImg{
        width: 100px;
        height: 100px;
        border-radius: 50px;
    }
    .all{
        background-color: #fff;
        padding-top: 30px;
        padding-bottom: 30px;
        padding-left: 30px;
        padding-right: 30px;
        margin-bottom: 20px;
    }
    .list{
        width: 750px;
        padding-top: 20px;
        height: inherit;
    }
    .slider{
        position: absolute;
        top: 90px;
        bottom: 0;
        width: 750px;
    }
    /*关注主体内容end*/





    /*bar导航start*/
    .barImg{
        width: 40px;
        height: 40px;
    }
    .jiange{
        width: 20px;
    }
    .barBtn{
        height: 70px;
        line-height: 70px;
        text-align: center;
        width: 150px;
        background-color: #fff;
        color: #53beb7;
        border-radius: 10px;
        opacity: 1;
    }
    .noSelect{
        opacity: 0.5;
    }
    .contacts{
        align-items: center;
        justify-content: center;
    }
    .contactsListText{
        color: #fff;
    }
    .contactsList{
        width: 35px;
        height: 35px;
    }
    /*bar导航end*/




    .personalInfo{
        background-color: #f8f8f8;
    }
    .row{
        flex-direction: row;
        align-items: center;
    }
</style>
