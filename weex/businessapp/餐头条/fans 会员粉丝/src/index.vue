<template>
    <div @viewappear="viewappear" @viewdisappear="viewdisappear">

        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    v-once
            >
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">粉丝</text>
                <!--<text :style="GLOBAL.headerRight"  slot="right">下一步</text>-->
            </wxc-minibar>
        </div>

        <slider class="tab-panels" infinite="false" :index="activeTab" @change="change">
            <!--最近联系-->
            <scroller class="content" offset-accuracy="10" @scroll="scrollHandler">
                <div  v-for="(item,index) in zuijinlianxi">
                    <div class="carrier" style="flex-direction: row;" @click="chat(index)"  @touchstart="ontouchstart(item.userId,index)" @touchend="ontouchend">
                        <div>
                            <image class="portrait" :src="item.userPhoto"></image>
                        </div>
                        <div>
                            <div class="titles">
                                <text class="label" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">{{item.userName}}</text>
                                <text class="time" :style="{fontSize:GLOBAL.bigFS}">{{item.timestamp}}</text>
                            </div>
                            <div style="margin-top: 5px;margin-left: 20px;">
                                <text class="last" :style="{fontSize:GLOBAL.bigFS}">{{item.content}}</text>
                                <div class="noread" v-if="item.noreadNum!=0"><text class="noreadNum">{{item.noreadNum}}</text></div>
                            </div>
                        </div>
                    </div>
                </div>
            </scroller>
            <!--商家会员-->
            <!--<list class="content">-->
            <!--<cell v-for="(item,index) in shangjiahuiyuan">-->
            <!--<div class="carrier" style="flex-direction: row;align-items: center;" @click="userInfo(index)">-->
            <!--<div>-->
            <!--<image class="portrait" :src="item.userPhoto"></image>-->
            <!--</div>-->
            <!--<div>-->
            <!--<div class="titles" style="flex-direction: row;justify-content: space-between">-->
            <!--<text class="label">{{item.userName}}</text>-->
            <!--</div>-->
            <!--</div>-->
            <!--</div>-->
            <!--</cell>-->
            <!--<loading class="loading" @loading="loadMore(1)"  :display="loadinging">-->
            <!--<text class="noArticleText">加载中</text>-->
            <!--</loading>-->
            <!--</list>-->
            <!--粉丝-->
            <list class="content">
                <cell v-for="(item,index) in fensi">
                    <div class="carrier" style="flex-direction: row;align-items: center;" @click="userInfo(index)">
                        <div>
                            <image class="portrait" :src="item.userPhoto"></image>
                        </div>
                        <div>
                            <div class="titles" style="flex-direction: row;justify-content: space-between">
                                <text class="label" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">{{item.userName}}</text>
                            </div>
                        </div>
                    </div>
                </cell>
                <loading class="loading" @loading="loadMore(2)" :display="loadingings">
                    <text class="noArticleText" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">加载中</text>
                </loading>
            </list>
        </slider>
        <div class="tabbar">
            <!--<div class="tab active" :style="{ left: activeTab * 250 + 'px'}"></div>-->
            <div v-for="(tab, i) in tabs" :key="i" class="tab" @click="activeTab = i">
                <image class="icon" :src="activeTab == i ? tab.iconActive:tab.icon"></image>
                <text :class="[activeTab == i ? 'titleActive':'title']">{{tab.title}}</text>
            </div>
        </div>

        <!-- 评论删除提示框 -->
        <wxc-mask height="322"
                  width="566"
                  border-radius="0"
                  duration="100"
                  mask-bg-color="#FFFFFF"
                  :has-animation="hasAnimation"
                  :has-overlay="true"
                  :show-close="false"
                  :show="show"
                  :overlay-cfg="overlay"
                  @wxcMaskSetHidden="wxcMaskSetHidden">
            <div class="mask" @click.stop="">
                <text class="maskTitle">提示</text>
                <text class="maskContent">确定删除此最近联系消息？</text>
                <div class="maskBtn row">
                    <text class="maskSure" @click="wxcMaskSetHidden">取消</text>
                    <text class="maskCancel" @click="commentDelect">确定</text>
                </div>
            </div>
        </wxc-mask>
        <toast ref="toast"></toast>
    </div>
</template>

<script>
    import { WxcMinibar,WxcMask} from 'weex-ui';
    import Toast from './Toast.vue';
    const event = weex.requireModule('event');
    const post = weex.requireModule('stream');
    const navigator = weex.requireModule('navigator');
    var timer = null;
    export default {
        components: {WxcMinibar,Toast,WxcMask},
        data() {
            return {
                type: 8,
                activeTab: 0,
                tabs: [{
                    title: '最近联系',
                    icon: 'https://image.aftdc.com/appBimg/ic_contact.png',
                    iconActive: 'https://image.aftdc.com/appBimg/ic_contact_green.png'
                },
                    //     {
                    //     title: '商家会员',
                    //     icon: 'https://image.aftdc.com/appBimg/ic_members.png',
                    //     iconActive: 'https://image.aftdc.com/appBimg/ic_members_green.png'
                    // },
                    {
                        title: '粉丝',
                        icon: 'https://image.aftdc.com/appBimg/ic_fans.png',
                        iconActive: 'https://image.aftdc.com/appBimg/ic_fans_green.png'
                    }],
                zuijinlianxi:[],
                shangjiahuiyuan:[],
                fensi:[],
                shangjiahuiyuanPage:0,
                zuijinlianxiPage:0,
                fensiPage:0,
                switchs:[0,0,0],
                token:'',
                imei:'',
                loadinging:'hide',
                loadingings:'hide',
                pageBack:false,
                // 评论删除弹出层
                show: false,
                overlayCanClose: true,
                isFalse: false,
                hasAnimation: true,
                overlay: {
                    duration: 100
                },
                delId: '',
                delIndex: '',
                longPress: false//是否正在长按
            }
        },
        created: function () {
            // var s =[{"data":[{"userId":13,"content":"推","img":null,"timestamp":"1530242298","role":2,"read":0,"userName":"【仵夜の風】","userPhoto":"https:\/\/wx.qlogo.cn\/mmopen\/vi_32\/Q0j4TwGTfTJnxrtTlaDFW2s4dnicRkGXRwPBpiaDrgw28icF8s1qfkCRArWTkV03VpaCpVzOOCnPhrnmnGEHmDia3Q\/132","from":"bot"}],"name":"bot13"},{"data":[{"userId":22,"content":"大撒大撒大撒的","img":null,"timestamp":"1525329762","role":2,"read":0,"userName":"黄梓翀","userPhoto":"https:\/\/wx.qlogo.cn\/mmopen\/vi_32\/Q0j4TwGTfTJrXzp40cuBgZgPf1LVbm12OwMoqP7eNecktvOlSIUJ98LTTTOCjdANFcBDLTxuzcT2cAOgMMVeOA\/0","from":"bot"},{"userId":22,"content":null,"img":"KuFuTalkImg\/1525244076177732gibp.png","timestamp":"1525244077","role":2,"read":0,"userName":"黄梓翀","userPhoto":"https:\/\/wx.qlogo.cn\/mmopen\/vi_32\/Q0j4TwGTfTJrXzp40cuBgZgPf1LVbm12OwMoqP7eNecktvOlSIUJ98LTTTOCjdANFcBDLTxuzcT2cAOgMMVeOA\/0","from":"bot"},{"userId":22,"content":"e","img":null,"timestamp":"1525243868","role":2,"read":0,"userName":"黄梓翀","userPhoto":"https:\/\/wx.qlogo.cn\/mmopen\/vi_32\/Q0j4TwGTfTJrXzp40cuBgZgPf1LVbm12OwMoqP7eNecktvOlSIUJ98LTTTOCjdANFcBDLTxuzcT2cAOgMMVeOA\/0","from":"bot"},{"userId":22,"content":"d","img":null,"timestamp":"1525243866","role":2,"read":0,"userName":"黄梓翀","userPhoto":"https:\/\/wx.qlogo.cn\/mmopen\/vi_32\/Q0j4TwGTfTJrXzp40cuBgZgPf1LVbm12OwMoqP7eNecktvOlSIUJ98LTTTOCjdANFcBDLTxuzcT2cAOgMMVeOA\/0","from":"bot"},{"userId":22,"content":"c","img":null,"timestamp":"1525243863","role":2,"read":0,"userName":"黄梓翀","userPhoto":"https:\/\/wx.qlogo.cn\/mmopen\/vi_32\/Q0j4TwGTfTJrXzp40cuBgZgPf1LVbm12OwMoqP7eNecktvOlSIUJ98LTTTOCjdANFcBDLTxuzcT2cAOgMMVeOA\/0","from":"bot"},{"userId":22,"content":"b","img":null,"timestamp":"1525243819","role":2,"read":0,"userName":"黄梓翀","userPhoto":"https:\/\/wx.qlogo.cn\/mmopen\/vi_32\/Q0j4TwGTfTJrXzp40cuBgZgPf1LVbm12OwMoqP7eNecktvOlSIUJ98LTTTOCjdANFcBDLTxuzcT2cAOgMMVeOA\/0","from":"bot"},{"userId":22,"content":"a","img":null,"timestamp":"1525243815","role":2,"read":0,"userName":"黄梓翀","userPhoto":"https:\/\/wx.qlogo.cn\/mmopen\/vi_32\/Q0j4TwGTfTJrXzp40cuBgZgPf1LVbm12OwMoqP7eNecktvOlSIUJ98LTTTOCjdANFcBDLTxuzcT2cAOgMMVeOA\/0","from":"bot"},{"userId":22,"content":"rsgtsg","img":null,"timestamp":"1525231966","role":2,"read":0,"userName":"黄梓翀","userPhoto":"https:\/\/wx.qlogo.cn\/mmopen\/vi_32\/Q0j4TwGTfTJrXzp40cuBgZgPf1LVbm12OwMoqP7eNecktvOlSIUJ98LTTTOCjdANFcBDLTxuzcT2cAOgMMVeOA\/0","from":"bot"},{"userId":22,"content":"小小小小打断点","img":null,"timestamp":"1525228539","role":2,"read":0,"userName":"黄梓翀","userPhoto":"https:\/\/wx.qlogo.cn\/mmopen\/vi_32\/Q0j4TwGTfTJrXzp40cuBgZgPf1LVbm12OwMoqP7eNecktvOlSIUJ98LTTTOCjdANFcBDLTxuzcT2cAOgMMVeOA\/0","from":"bot"},{"userId":22,"content":"小小小小","img":null,"timestamp":"1525228461","role":2,"read":0,"userName":"黄梓翀","userPhoto":"https:\/\/wx.qlogo.cn\/mmopen\/vi_32\/Q0j4TwGTfTJrXzp40cuBgZgPf1LVbm12OwMoqP7eNecktvOlSIUJ98LTTTOCjdANFcBDLTxuzcT2cAOgMMVeOA\/0","from":"bot"},{"userId":22,"content":"大大大大大大","img":null,"timestamp":"1525228453","role":2,"read":0,"userName":"黄梓翀","userPhoto":"https:\/\/wx.qlogo.cn\/mmopen\/vi_32\/Q0j4TwGTfTJrXzp40cuBgZgPf1LVbm12OwMoqP7eNecktvOlSIUJ98LTTTOCjdANFcBDLTxuzcT2cAOgMMVeOA\/0","from":"bot"},{"userId":22,"content":"阿达","img":null,"timestamp":"1525224817","role":2,"read":0,"userName":"黄梓翀","userPhoto":"https:\/\/wx.qlogo.cn\/mmopen\/vi_32\/Q0j4TwGTfTJrXzp40cuBgZgPf1LVbm12OwMoqP7eNecktvOlSIUJ98LTTTOCjdANFcBDLTxuzcT2cAOgMMVeOA\/0","from":"bot"},{"userId":22,"content":"法法","img":null,"timestamp":"1525224612","role":2,"read":0,"userName":"黄梓翀","userPhoto":"https:\/\/wx.qlogo.cn\/mmopen\/vi_32\/Q0j4TwGTfTJrXzp40cuBgZgPf1LVbm12OwMoqP7eNecktvOlSIUJ98LTTTOCjdANFcBDLTxuzcT2cAOgMMVeOA\/0","from":"bot"},{"userId":22,"content":"rgesgggggggggggggggg","img":null,"timestamp":"1524908847","role":2,"read":0,"userName":"黄梓翀","userPhoto":"https:\/\/wx.qlogo.cn\/mmopen\/vi_32\/Q0j4TwGTfTJrXzp40cuBgZgPf1LVbm12OwMoqP7eNecktvOlSIUJ98LTTTOCjdANFcBDLTxuzcT2cAOgMMVeOA\/0","from":"bot"},{"userId":22,"content":"hfuisohauoghoui","img":null,"timestamp":"1524908674","role":2,"read":0,"userName":"黄梓翀","userPhoto":"https:\/\/wx.qlogo.cn\/mmopen\/vi_32\/Q0j4TwGTfTJrXzp40cuBgZgPf1LVbm12OwMoqP7eNecktvOlSIUJ98LTTTOCjdANFcBDLTxuzcT2cAOgMMVeOA\/0","from":"bot"}],"name":"bot22"},{"data":[{"userId":1330018,"content":"还回家","img":null,"timestamp":"1530242325","role":2,"read":0,"userName":"坚伟","userPhoto":"https:\/\/wx.qlogo.cn\/mmopen\/vi_32\/aX8ZtgxwBEAhH7UktC40XuNgsF4fpGnk9VKyrZhRFDBq71uaPE1QxBLblSa0l8FaLAQXvlBpEdUzU0qxbqHeSA\/132","from":"bot"}],"name":"bot1330018"}]
            // this.reView(s)
            // return false;
            var that = this
            event.init();
            weex.requireModule('globalEvent').addEventListener("newChat",function(e){
                that.upDataChat(e)
            });

            this.token = weex.config.token
            this.imei = weex.config.imei

            var param = this.GLOBAL.sign(this.token,this.imei);

            post.fetch({
                method: 'POST',
                type: 'json',
                body: param,
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                url: 'https://www.aftdc.com/businessapp/Membership/contact',
            }, function (e) {
                if (e.data.res == -2) {
                    //跳到登陆页面
                    that.GLOBAL.toLogin()
                } else {
                    if (e.data.res == 1) {
                        that.reView(e.data.data)
                        that.switchs[0] = 1;
                    } else {
                        that.reView()
                    }
                }
            })
        },
        computed: {
            panels() {
                return this.tabs.map(tab => ({content: tab.title}))
            }
        },
        methods: {
            minibarLeftButtonClick:function(){

            },
            change: function (event) {
                this.activeTab = event.index;
                if (this.activeTab == 0)
                    this.contact()
                if (this.activeTab == 1)
                    this.fan()
                //     this.membership()
                // if (this.activeTab == 2)
                //     this.fan()
            },

            contact:function(){
                if(this.switchs[0]==1)
                    return false
                var that = this
                var param = this.GLOBAL.sign(this.token,this.imei);
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    url: 'https://www.aftdc.com/businessapp/Membership/contact',
                }, function (e) {
                    if (e.data.res == -2) {
                        //跳到登陆页面
                        that.GLOBAL.toLogin()
                    } else {
                        if (e.data.res == 1) {
                            if(this.activeTab==0) {
                                that.zuijinlianxiPage += e.data.data.length
                                that.zuijinlianxi = that.zuijinlianxi.concat(e.data.data)
                                that.switchs[0] = 1;
                            }
                        }
                    }
                })
            },

            membership:function(){
                if(this.switchs[1]==1)
                    return false
                var that = this
                var param = this.GLOBAL.sign(this.token,this.imei);
                param+='&page='+ this.shangjiahuiyuanPage;
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    url: 'https://www.aftdc.com/businessapp/Membership/membership_list',
                }, function (e) {
                    if (e.data.res == -2) {
                        //跳到登陆页面
                        that.GLOBAL.toLogin()
                    } else {
                        if (e.data.res == 1) {
                            that.shangjiahuiyuanPage+=e.data.data.length;
                            that.shangjiahuiyuan = that.shangjiahuiyuan.concat(e.data.data);
                            that.switchs[1] = 1;
                        }
                    }
                })
            },

            fan:function(){
                if(this.switchs[2]==1)
                    return false;
                var that = this;
                var param = this.GLOBAL.sign(this.token,this.imei);
                param+='&page='+ this.fensiPage;
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    url: 'https://www.aftdc.com/businessapp/Membership/fans',
                }, function (e) {
                    if (e.data.res == -2) {
                        //跳到登陆页面
                        that.GLOBAL.toLogin()
                    }
                    else {
                        if (e.data.res == 1) {
                            that.fensiPage+=e.data.data.length;
                            that.fensi = that.fensi.concat(e.data.data);
                            that.switchs[2] = 1;
                        }
                    }
                })
            },

            loadMore:function(index){
                const toast = this.$refs.toast;
                if (index==1){
                    var noType = this.noMember;
                    var page = this.shangjiahuiyuanPage;
                    var toUrl = 'Membership/membership_list';
                }else{
                    var noType = this.nofans;
                    var page = this.fensiPage;
                    var toUrl = 'Membership/fans';
                }

                var that = this;

                if (index==1){
                    that.loadinging = 'show'
                }else{
                    that.loadingings = 'show'
                }

                var param = this.GLOBAL.sign(this.token,this.imei);
                param+='&page='+ page;
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    url: 'https://www.aftdc.com/businessapp/'+toUrl,
                }, function (e) {
                    if (e.data.res == -2) {
                        //跳到登陆页面
                        that.GLOBAL.toLogin()
                    }else if(e.data.res == 0){
                        if (index==1){
                            that.loadinging = 'hide'
                        }else{
                            that.loadingings = 'hide'
                        }
                        toast.editContent('没有更多了');
                    }else {
                        if (index==1){
                            that.loadinging = 'hide';
                            that.shangjiahuiyuanPage += e.data.data.length;
                            that.shangjiahuiyuan = that.shangjiahuiyuan.concat(e.data.data);
                        }else{
                            that.loadingings = 'hide';
                            that.fensiPage+=e.data.data.length;
                            that.fensi = that.fensi.concat(e.data.data);
                        }
                    }
                })
            },

            chat:function (index) {
                if(this.longPress === false) {
                    this.zuijinlianxi[index].noreadNum = 0;
                    var userId = this.zuijinlianxi[index].userId;
                    var userName = this.zuijinlianxi[index].userName;
                    var userPhoto = this.zuijinlianxi[index].userPhoto;
                    var param = {userId: userId, userName: userName, userPhoto: userPhoto};
                    var url = 'http://assets/chat.js';
                    event.toUrl({url: url, param: JSON.stringify(param)});
                }
            },

            userInfo:function(index){
                var userId = this.fensi[index].userId
                var param = {userId:userId};
                var url = 'http://assets/userArticle.js';
                event.toUrl({url:url,param:JSON.stringify(param)});
            },

            //监听页面返回
            viewdisappear() {
                let self = this;
                self.pageBack = true;
            },
            viewappear() {
                let self = this;
                if (!self.pageBack) { return; }
                self.pageBack = false;
                this.reView();
                event.init();
                // weex.requireModule('globalEvent').addEventListener("newChat",function(e){
                //     self.upDataChat(e)
                // });
            },

            //更新商家对该用户的聊天记录
            upDataChat(e){
                var chatData = JSON.parse(e.data);
                chatData.from = 'bot';
                chatData.read = 0;

                var date = new Date();
                var timestamp = chatData.timestamp;
                date.setTime(timestamp * 1000);
                chatData.timestamp = date.getMonth()+1 +"月" + date.getDate()+"日";

                var zj = this.zuijinlianxi;
                console.log(JSON.stringify(zj))
                if (zj) {
                    var mark = 0;
                    for (var i = 0; i<zj.length; i++){
                        if (zj[i].userId == chatData.userId){
                            console.log(zj[i].noreadNum)
                            mark = 1;
                            chatData.noreadNum = zj[i].noreadNum+1;
                            zj.splice(i,1);
                            zj.unshift(chatData);
                            this.zuijinlianxi = zj;
                            this.$set(this.zuijinlianxi,zj);
                            break;
                        }
                    }
                    if (mark == 0){
                        chatData.noreadNum = 1;
                        zj.unshift(chatData);
                        this.zuijinlianxi = zj;
                        this.$set(this.zuijinlianxi,zj);
                    }
                }else{
                    this.zuijinlianxi = [];
                    chatData.noreadNum = 1;
                    this.zuijinlianxi.push(chatData);
                    this.$set(this.zuijinlianxi,0,chatData);
                }
            },

            //更新显示
            reView(newData){
                var shopChatData = event.find('shop'+event.find('shopId')+'ChatData');
                // var shopChatData = {
                //     "bot13":{
                //         "data":[{"userId":13,"content":"推","img":null,"timestamp":"1530242298","role":2,"read":0,"userName":"【仵夜の風】","userPhoto":"https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJnxrtTlaDFW2s4dnicRkGXRwPBpiaDrgw28icF8s1qfkCRArWTkV03VpaCpVzOOCnPhrnmnGEHmDia3Q/132","from":"bot"}],
                //         "userId":13,
                //         "userName":"【仵夜の風】",
                //         "userPhoto":"https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJnxrtTlaDFW2s4dnicRkGXRwPBpiaDrgw28icF8s1qfkCRArWTkV03VpaCpVzOOCnPhrnmnGEHmDia3Q/132"
                //     }
                // }
                if (shopChatData) {
                    shopChatData = JSON.parse(shopChatData);
                    if (newData) {
                        for (var i=0; i<newData.length; i++){
                            for (var s in shopChatData){
                                if (newData[i]['name'] == s){
                                    for (var y=0; y<shopChatData[s]['data'].length;y++){
                                        if (shopChatData[s]['data'][y].read == 0 && shopChatData[s]['data'][y].from=='bot'){
                                            shopChatData[s]['data'].slice(y,1)
                                        }
                                    }
                                    shopChatData[s]['data'].concat(newData[i]['data']);
                                    shopChatData[s]['data'].sort(function (a,b) {
                                        return a.timestamp - b.timestamp
                                    })
                                    newData.splice(i,1);
                                }
                            }
                        }
                        if (newData){
                            for (var i=0;i<newData.length;i++) {
                                shopChatData[newData[i]['name']]={}
                                shopChatData[newData[i]['name']]['data'] = newData[i]['data']
                                shopChatData[newData[i]['name']]['userName'] = newData[i]['data'][0]['userName']
                                shopChatData[newData[i]['name']]['userId'] = newData[i]['data'][0]['userId']
                                shopChatData[newData[i]['name']]['userPhoto'] = newData[i]['data'][0]['userPhoto']
                                shopChatData[newData[i]['name']]['data'].sort(function (a,b) {
                                    return a.timestamp - b.timestamp
                                })
                            }
                        }
                    }
                    event.save('shop'+event.find('shopId')+'ChatData',JSON.stringify(shopChatData));
                }else{
                    var shopChatData = {};
                    if (newData){
                        for (var i=0;i<newData.length;i++) {
                            shopChatData[newData[i]['name']]={}
                            shopChatData[newData[i]['name']]['data'] = newData[i]['data']
                            shopChatData[newData[i]['name']]['userName'] = newData[i]['data'][0]['userName']
                            shopChatData[newData[i]['name']]['userId'] = newData[i]['data'][0]['userId']
                            shopChatData[newData[i]['name']]['userPhoto'] = newData[i]['data'][0]['userPhoto']
                            shopChatData[newData[i]['name']]['data'].sort(function (a,b) {
                                return a.timestamp - b.timestamp
                            })
                        }
                    }
                    event.save('shop'+event.find('shopId')+'ChatData',JSON.stringify(shopChatData));
                }

                var zuijinlianxi = [];
                var index = 0;
                var date = new Date();

                if (shopChatData!=={}){
                    for (var i in shopChatData) {
                        var userChatData = shopChatData[i]['data'];
                        zuijinlianxi[index] = userChatData[userChatData.length - 1];

                        zuijinlianxi[index].userName = shopChatData[i]['userName'];
                        zuijinlianxi[index].userPhoto = shopChatData[i]['userPhoto'];
                        zuijinlianxi[index].userId = shopChatData[i]['userId'];
                        zuijinlianxi[index].noreadNum = 0;
                        for (var s=0;s<userChatData.length;s++){
                            if (userChatData[s].read == 0 && userChatData[s].from == 'bot'){
                                zuijinlianxi[index].noreadNum +=1
                            }
                        }
                        index++;
                    }
                    zuijinlianxi.sort(function (a,b) {
                        return b.timestamp - a.timestamp
                    });
                    for (var i=0; i<zuijinlianxi.length;i++){
                        var timestamp = zuijinlianxi[i].timestamp;
                        date.setTime(timestamp * 1000);
                        zuijinlianxi[i].timestamp = date.getMonth()+1 +"月" + date.getDate()+"日"
                    }
                }
                console.log(JSON.stringify(zuijinlianxi))
                this.zuijinlianxi = zuijinlianxi
            },
            //长按删除
            ontouchstart(id,index){
                clearTimeout(timer)
                var that = this
                timer = setTimeout(function(){
                    that.show = true
                    that.delId = id
                    that.delIndex = index
                    that.longPress = true
                },1000)
            },
            //长按删除
            ontouchend(){
                clearTimeout(timer)
                var that = this
                setTimeout(function(){
                    that.longPress = false
                },10)
            },
            //防止上下滚动弹出删除层
            scrollHandler(){
                clearTimeout(timer)
            },
            //取消删除弹出层
            wxcMaskSetHidden () {
                this.show = false;
            },
            //确认删除最近联系消息
            commentDelect(){
                this.show = false;
                const toast = this.$refs.toast
                var param = this.GLOBAL.sign(this.token,this.imei);
                param += '&type=' + this.type;
                param += '&id=' + this.delId;
                var that = this;
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded"},
                    url: 'https://www.aftdc.com/businessapp/Store/delMessage',
                }, function (e) {
                    if(e.data.res === 1) {
                        that.zuijinlianxi.splice(that.delIndex,1)
                        toast.editContent(e.data.info);
                    } else {
                        toast.editContent(e.data.info);
                    }
                });
            }
        }
    }
</script>

<style scoped>

    .minibar {
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: #f1f1f1;
    }
    .tabbar {
        display: flex;
        flex-direction: row;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        border-top-width: 1px;
        border-top-color: #d9d9d9;
        background-color: #fafafa;
        height: 120px;
    }

    .tab {
        height: 120px;
        flex: 1;
        justify-content: center;
        align-items: center;
    }

    .active {
        position: absolute;
        top: 0;
        left: 0;
        background-color: #53beb7;
        transition: left 0.2s ease-in-out;
    }

    .icon {
        width: 45px;
        height: 45px;
    }

    .title {
        font-size: 28px;
        color: #999;
        margin-top: 10px;
    }

    .titleActive {
        font-size: 28px;
        color: #53beb7;
        margin-top: 10px;
    }

    .tab-panels {
        width: 750px;
        position: absolute;
        top: 90px;
        bottom: 120px;
        background-color: #F5F5F5;
    }

    .portrait {
        width: 90px;
        height: 90px;
        border-radius: 50px;
    }

    .content {
        width: 750px;
        background-color: #ffffff;
    }

    .carrier {
        width: 750px;
        padding-top: 20px;
        padding-left: 20px;
        padding-right: 20px;
        padding-bottom: 20px;
        border-bottom-width: 1px;
        border-bottom-color: rgba(204, 204, 204, 0.5);
        border-bottom-style: solid;
    }

    .carrier:active {
        background-color: #F8F8F8;
        /*background-color: rgba(153, 153, 153, 0.51);*/
    }

    .titles {
        height: 50px;
        padding-left: 20px;
        flex-direction: row;
        align-items: center;
    }

    .label {
        width: 500px;
        lines: 1;
    }

    .time {
        text-align: right;
        color: #999;
    }

    .last {
        width: 580px;
        lines: 1;
        color: #999;
    }
    .noread{
        position: absolute;
        right: 0;
        bottom: 0;
        height: 30px;
        width: 30px;
        border-radius: 15px;
        background-color: #FF0000;
    }

    .noreadNum{
        color: #fff;
        font-size: 20px;
        text-align: center;
        line-height: 30px;
    }

    .minibar {

    }
    /*****************/

    .backImg {
        width: 40px;
        height: 40px;
    }

    .loading{
        width: 750px;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: #fff;
        z-index: 998;
    }

    .noArticleText{
        text-align: center;
    }
    /* 删除评论提示层 */
    .mask {
        flex: 1;
        position: relative;
        padding-top: 46px;
        /*padding-left: 50px;*/
    }
    .maskTitle {
        font-size: 36px;
        color: #181818;
        margin-left: 50px;
    }
    .maskContent {
        width: 440px;
        color: #898989;
        padding-top: 40px;
        font-size: 32px;
        margin-left: 50px;
    }
    .maskBtn {
        width: 566px;
        height: 90px;
        position: absolute;
        /*right: 40px;*/
        /*bottom: 38px;*/
        bottom: 0px;
        flex-direction: row;
    }
    .maskSure {
        text-align: center;
        line-height: 90px;
        flex: 1;
        color: #757575;
        /*margin-right: 56px;*/
        font-size: 32px;
        border-top-width: 1px;
        border-top-style: solid;
        border-top-color: #e7e7e7;
    }
    .maskCancel {
        text-align: center;
        line-height: 90px;
        flex: 1;
        color: #53beb7;
        font-size: 32px;
        border-top-width: 1px;
        border-top-style: solid;
        border-top-color: #e7e7e7;
        border-left-width: 1px;
        border-left-style: solid;
        border-left-color: #e7e7e7;
    }

</style>
