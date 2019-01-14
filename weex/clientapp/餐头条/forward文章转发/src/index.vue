<template>
    <div class="wrapper">
        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    @wxcMinibarRightButtonClicked="minibarRightButtonClick"
                    v-once>
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">转发</text>
                <text :style="GLOBAL.headerRight" slot="right" >完成</text>
            </wxc-minibar>
        </div>
        <scroller class="scroller" show-scrollbar="false">
            <div>
                <text class="textarea" :style="{fontSize:'30px',color:GLOBAL.dColor}">{{text}}</text>
                <textarea class="textarea position" ref="textarea" cols="30" rows="20" v-model="text" maxlength="200" :style="{fontSize:'30px',color:GLOBAL.dColor}" placeholder="说说你的看法" name="" id=""></textarea>
            </div>
            <div class="content">
                <image class="img" :src="'https://image.aftdc.com/'+shopImg"></image>
                <text class="title" :style="{fontSize:'30px',color:GLOBAL.dColor}">{{title}}</text>
            </div>
        </scroller>
        <toast ref="toast"></toast>
    </div>
</template>

<script>
    import Toast from './Toast.vue';
    import { WxcMinibar} from 'weex-ui';
    const GLOBAL = require('@/Global.vue');
    const event = weex.requireModule('event');
    const post = weex.requireModule('stream');
    const navigator = weex.requireModule('navigator');

    export default {
        name: 'App',
        components: { WxcMinibar,Toast},
        data() {
            return {
                token:'',
                imei: '',
                articleId: 0,
                shopImg: '',
                title: '',
                text: '',

            }
        },
        created() {
            this.token = weex.config.token;
            this.imei = weex.config.imei;
            var param = JSON.parse(weex.config.param)
            this.articleId = param.articleId
            this.shopImg = param.shopImg
            this.title = param.title


        },
        mounted () {
            this.$refs.textarea.focus()
        },
        methods: {
            minibarLeftButtonClick() {

            },
            minibarRightButtonClick:GLOBAL.throttle(function() {
                var that = this
                const toast = that.$refs.toast;
                var param = that.GLOBAL.sign(that.token,that.imei);
                param += '&id=' + that.articleId
                param += '&content=' + that.text
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: 'https://www.aftdc.com/userapp/Article/forwardArticle',
                }, function (res) {
                    if(res.data.res === 1) {
                        setTimeout(()=>navigator.pop({ animated: 'true' }),1000);
                    }
                    toast.editContent(res.data.info);
                })
            })
        }
    }
</script>

<style scoped>
    .img {
        width: 140px;
        height: 140px;
        margin-left: 5px;
        margin-top: 5px;
    }
    .position {
        width: 690px;
        position: absolute;
        top: 0;
        left: 0;
        background-color: #fff;
    }
    .textarea {
        margin-left: 30px;
        margin-right: 30px;
        margin-top: 30px;
        margin-bottom: 30px;
        min-height: 152px;
    }
    .content {
        flex-direction: row;
        width: 690px;
        height: 150px;
        background-color: #f4f5f7;
        margin-left: 30px;
    }
    .title {
        width: 500px;
        lines: 2;
        text-overflow: ellipsis;
        margin-left: 30px;
        line-height: 38px;
        padding-top: 37px;
    }
</style>
