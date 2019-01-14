<template>
    <div class="logonRecord">
        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    v-once
            >
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">最近登陆记录</text>
                <text :style="GLOBAL.headerRight"  slot="right"></text>
            </wxc-minibar>
        </div>
        <text class="text" :style="{fontSize:GLOBAL.bigFS}">查看最近登录过的手机或浏览器,如果发现可疑登录,请立即修改/设置登录密码。</text>
        <list class="list">
            <cell>
                <div class="content" v-for="(item,index) in loginHistory" :key="index">
                    <text class="contentTextOen" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.model}}  {{item.from}}</text>
                    <text class="contentTextTwo" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">{{item.time}}</text>
                </div>
            </cell>

            <loading class="loading" @loading="onloadingOrder" :display="loadinging ? 'show' : 'hide'">
                <image class="indicator" src="https://image.aftdc.com/appBimg/ic_loading_gif.gif" v-if="!noMore"></image>
                <div class="moreRecentlyOrder" v-if="noMore">
                    <text class="moreRecentlyOrderText">没有更多了~</text>
                </div>
            </loading>
        </list>
    </div>
</template>

<script>
    import { WxcMask} from 'weex-ui';
    import {WxcMinibar, WxcPopup} from 'weex-ui';
    import Toast from './Toast.vue';
    const navigator = weex.requireModule('navigator');
    const post = weex.requireModule('stream');
    export default {

        components: {WxcMinibar, Toast, WxcPopup,WxcMask},
        data() {
            return{
                noMore:false,
                loadinging:false,

                token:'',
                imei:'',
                loginHistory:[],
            }
        },
        methods:{
            minibarLeftButtonClick(){
                navigator.pop({ animated: 'true' });
            },

            getData(){
                var that=this;
                var param = that.GLOBAL.sign(that.token,that.imei);
                param+='&page=0';
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: 'https://www.aftdc.com/userapp/Mine/loginHistory',
                }, function (res) {
                    if(res.data.res==1){
                        that.loginHistory=res.data.data.loginHistory;
                        if(res.data.data.loginHistory.length<20){
                            that.noMore=true;
                        }
                    }
                    else{
                        that.noMore=true;
                        const toast =that.$refs.toast;
                        toast.editContent(res.data.info);
                    }
                })
            },

            onloadingOrder(){//上拉加载

                var that=this;

                that.loadinging=true;
                var page = that.loginHistory.length;
                var param = that.GLOBAL.sign(that.token,that.imei);
                param+='&page='+page;

                post.fetch({
                    method: 'post',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/userapp/Mine/loginHistory',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                },function(res){
                    that.loadinging=false;
                    if(res.data.res==1){
                        that.loginHistory=that.loginHistory.concat(res.data.data.loginHistory);
                    }
                    else{

                        that.noMore=true;
                        const toast =that.$refs.toast;
                        toast.editContent(res.data.info);
                    }
                });
            },//上拉加载
        },
        created(){
            var that=this;
            that.getData();
        },
    }
</script>

<style scoped>
    /*没有更多了start*/
    .moreRecentlyOrder{
        align-items: center;
        justify-content: center;
        height: 60px;
    }

    .moreRecentlyOrderText{
        font-size: 28px;
        color:#999;
    }
    /*没有更多了end*/
    .indicator {
        margin-top: 16px;
        height: 100px;
        width: 100px;
        color: #53beb7;
        margin-bottom: 16px;

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
    .list{
        width: 750px;
        flex: 1;
    }
    /*默认样式*/
    .contentTextTwo{
        margin-top: 5px;
    }
    .content{
        background-color: #fff;
        padding-top: 20px;
        padding-left: 20px;
        padding-right: 20px;
        padding-bottom: 20px;
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: #dedede;
    }
    .text{
        padding-top: 20px;
        padding-left: 20px;
        padding-right: 20px;
        padding-bottom: 20px;
        width: 750px;
        color: #999;
    }
    .logonRecord{
        background-color: #f8f8f8;
    }
    .row{
        flex-direction: row;
        align-items: center;
    }
</style>
