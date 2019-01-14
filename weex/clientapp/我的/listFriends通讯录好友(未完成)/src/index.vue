<template>
    <div class="contacts">

        <!--头部-->
        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    v-once
            >
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">通讯录好友</text>
            </wxc-minibar>
        </div>

        <!--一键关注-->
        <div class="allAttention row" @click="toTopOne">
            <text class="allAttentionText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">通讯录好友</text>
            <text class="allAttentionBtnText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}" v-if="isAttention" @click="allAttentionClick">一键关注</text>
        </div>

        <list class="scroller">

            <!--关注列表-->
            <cell class="attention row" :class="[index!=0?'attentionTwo':'']" v-for="(item,index) in attentionList" :key="index" ref="tostOne">
                <div class="attentionIcon">
                    <image class="attentionIcon" :src="item.userPhoto"></image>
                </div>
                <text class="attentionName" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.userName}}</text>
                <text class="attentionBtn" :class="[item.attention?'attentionBtnTwo':'']" :style="{fontSize:GLOBAL.defaultFS}" @click="attentionClick(index)">{{item.attention?'已关注':'关注'}}</text>
            </cell>

            <!--由于cell标签不能用margin属性,所以这个充当margintop-->
            <cell>
                <div style="height: 20px;"></div>
            </cell>

            <!--邀请列表-->
            <header class="invitation" ref="tostTwo">
                <div class="invitationDivTwo" @click="toTopTwo">
                    <text class="invitationDivName" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{invitationList.length}}位通讯录好友可邀请</text>
                </div>
            </header>

            <cell style="background-color: #fff">
                <div class="invitationDiv row" v-for="(item,index) in invitationList" :key="index">
                    <text class="invitationDivName" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.userPhone}}</text>
                    <text class="invitationDivText" :style="{fontSize:GLOBAL.defaultFS}" @click="yaoqing(item.userPhone)">邀请</text>
                </div>
                <text class="noMore" :style="{fontSize:GLOBAL.defaultFS}" v-if="invitationList==''">您的通讯录还没有好友哦!</text>
            </cell>

        </list>
        <!--是否一键关注弹出层-->
        <wxc-mask height="220"
                  width="600"
                  border-radius="10"
                  duration="200"
                  mask-bg-color="#FFFFFF"
                  :has-animation="true"
                  :has-overlay="true"
                  :show-close="false"
                  :show="show"
                  @wxcMaskSetHidden="wxcMaskSetHidden">
            <div class="content">
                <text class="demoTitle" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">提示</text>
                <text class="contentTitle" :style="{fontSize:GLOBAL.bigFS,color:'#999'}">确定关注{{attentionList.length}}位通讯录好友</text>
                <div class="contentBtnDiv row">
                    <text class="contentBtnCancel" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}" @click="showCancel">取消</text>
                    <text class="contentBtnCancel" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}" @click="showConfirmClick">确定</text>
                </div>
            </div>
        </wxc-mask>

        <toast ref="toast"></toast>
    </div>
</template>

<script>
    import Toast from './Toast.vue';
    import { WxcPopup,WxcMask,WxcIcon,WxcMinibar,WxcPopover} from 'weex-ui';
    const event = weex.requireModule('event');
    const post = weex.requireModule('stream');
    const dom = weex.requireModule('dom');
    import noOrder from './noOrder.vue';
    const navigator = weex.requireModule('navigator');

    export default {
        components: { WxcPopup,WxcMask,WxcIcon,WxcMinibar,WxcPopover,noOrder,Toast},
        data() {
            return {
                isAttention:false,//全部关注
                show:false,//显示弹出框
                attentionList:[],//可关注的列表
                invitationList:[],//邀请列表
                token:'',
                imei:'',
            }
        },

        created: function () {
            this.token = weex.config.token;
            this.imei = weex.config.imei;
            var that=this;
            event.init();
            weex.requireModule('globalEvent').addEventListener("filePermissions",function(e){
                if (e.filePermissions == 1)
                    that.checkFriendIsOpen();
                else
                    navigator.pop({ animated: 'true' });
            });
            this.checkFriendIsOpen()
        },
        methods:{
            checkFriendIsOpen(){
                var that = this;
                var param = that.GLOBAL.sign(that.token,that.imei);
                param+='&phoneNumber='+event.getContact();
                post.fetch({
                    method: 'post',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/userapp/Mine/checkFriendIsOpen',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                },function(res){
                    if(res.data.res==1){
                        that.attentionList = res.data.data.openUserInfo;
                        that.invitationList = res.data.data.notOpenUserInfo;
                        for(var i in that.attentionList){
                            if (attentionList[i].attention==0){
                                that.isAttention=true;break;
                            }
                        }
                    } else{
                        const toast =that.$refs.toast;
                        toast.editContent(res.data.info);
                    }
                });
            },
            toTopTwo(){
                dom.scrollToElement(this.$refs.tostTwo);
            },
            toTopOne(){
                dom.scrollToElement(this.$refs.tostOne[0]);
            },
            //一键关注
            showConfirmClick(){
                var aid = [];
                var data = this.attentionList;
                for (var i in data) {
                    aid.push(data[i]['acticleAccount'])
                }
                var that = this;
                var param = that.GLOBAL.sign(that.token,that.imei);
                param+='&acticleAccount='+JSON.stringify(aid);
                post.fetch({
                    method: 'post',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/userapp/Mine/attentAllUser',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                },function(res){
                    if(res.data.res==1){
                        for(var i in that.attentionList){
                            that.attentionList[i].attention=1;
                        }
                        that.isAttention=false;
                    }
                    const toast =that.$refs.toast;
                    toast.editContent(res.data.info);
                    that.show=false;
                });
            },//弹出层的确定按钮
            showCancel(){
                this.show=false;
            },//弹出层的取消按钮
            allAttentionClick(){
                this.show=true;
            },
            //关注单个
            attentionClick(index){
                if( this.attentionList[index].attention){
                    this.attentionList[index].attention=0;
                    //取消关注
                    var url = 'https://www.aftdc.com/userapp/Mine/cancelAttentUser'
                }else{
                    this.attentionList[index].attention=1;
                    //关注
                    var url = 'https://www.aftdc.com/userapp/Mine/attentUser'
                }
                var that = this;
                var param = that.GLOBAL.sign(that.token,that.imei);
                param+='&oaId='+this.attentionList[index]['acticleAccount'];
                post.fetch({
                    method: 'post',
                    type: 'json',
                    body: param,
                    url: url,
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                },function(res){
                    if(res.data.res==1){
                        var num = 0;
                        for(var i in that.attentionList){
                            if (that.attentionList[i].attention==0){
                                num++;
                            }
                        }
                        if (num>0) that.isAttention=true;
                        else that.isAttention=false;
                    }
                    const toast =that.$refs.toast;
                    toast.editContent(res.data.info);
                });
            },
            minibarLeftButtonClick(){
                navigator.pop({animated:'false'});
            },
            wxcMaskSetHidden(){
                this.show=false;
            },
            yaoqing(phone){
                var msg = '快来和我一起来玩阿凡提点餐APP，看美食图文视频。下载->t.cn/EAwZ6kQ，我的餐头条号'+event.find('acticleAccount')+'。';
                event.sendMsg(msg,phone);
            }
        },
    }
</script>


<style>
    .contentBtnCancel{
        height: 70px;
        line-height: 70px;
        width: 120px;
        text-align: center;

    }
    .contentBtnDiv{
        height: 70px;
        justify-content: flex-end;
    }
    .demoTitle{
        height: 70px;
        padding-left: 20px;
        line-height: 70px;
    }
    .contentTitle{
        height: 80px;
        line-height: 80px;
        padding-left: 20px;
    }
    .content{
        justify-content: space-between;
        flex: 1;
    }
    .noMore{
        text-align: center;
        padding-top: 25px;
        padding-bottom: 25px;
        color: #999;
    }
    .invitationDivText{
        color: #f75859;
        padding-left: 25px;
        padding-right: 25px;
        padding-top: 30px;
        padding-bottom: 30px;
    }
    .invitationDivName{
        padding-top: 30px;
        padding-bottom: 30px;
        flex: 1;
    }
    .invitationDiv{
        padding-left: 25px;
        border-bottom-style: solid;
        border-bottom-width: 2px;
        border-bottom-color: #f1f1f1;
    }
    .invitationDivTwo{
        padding-left: 25px;
        border-bottom-style: solid;
        border-bottom-width: 2px;
        border-bottom-color: #f1f1f1;
        background-color: #fff;
    }
    .invitation{
        background-color: #fff;
    }
    .attentionBtnTwo{
        background-color: #53beb7;
        border-color: #53beb7;
    }
    .attentionBtn{
        width: 130px;
        padding-top: 15px;
        padding-bottom: 15px;
        background-color: #f75859;
        border-radius: 10px;
        color: #fff;
        text-align: center;
        border-style: solid;
        border-width: 1px;
        border-color: #f75859;
    }
    .attentionName{
        margin-left: 20px;
        flex: 1;
        lines:1;
        text-overflow: ellipsis;
    }
    .attentionIcon{
        width: 110px;
        height: 110px;
        border-radius: 60px;
    }
    .attentionTwo{
        border-top-style: solid;
        border-top-width: 2px;
        border-top-color: #f1f1f1;
    }
    .attention{
        padding-top: 40px;
        padding-bottom: 40px;
        padding-left: 30px;
        padding-right: 30px;
        background-color: #fff;
    }
    .allention{
        position: sticky;
    }
    .allAttention{
        justify-content: space-between;
        padding-left: 30px;
        padding-top: 30px;
        padding-bottom: 30px;
        padding-right: 30px;
        background-color: #fff;
        border-bottom-style: solid;
        border-bottom-width: 2px;
        border-bottom-color: #f1f1f1;
    }
    .scroller{
        flex: 1;
        width: 750px;
    }
    .contacts{
        background-color: #f8f8f8;
    }
    .row{
        flex-direction: row;
        align-items: center;
    }

</style>


