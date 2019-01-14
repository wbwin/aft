<template>
    <div class="numberProtection">

        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    v-once
            >
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">号码保护</text>
            </wxc-minibar>
        </div>

        <scroller style="flex: 1;width: 750px;">
            <div style="flex: 1;padding-left: 30px;padding-right: 30px;">
                <text class="introduce" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">服务介绍</text>
                <text class="content" :style="{fontSize:GLOBAL.defaultFS}">对骑手、商家隐藏您的真实手机号，保护您的隐私。</text>
                <image class="img" src="http://chuantu.biz/t6/339/1530948541x-1404775497.png"></image>
                <text class="explain" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">使用说明</text>
                <div class="contentDiv">
                    <text class="contentDivIcon"></text>
                    <text class="contentDivText" :style="{fontSize:GLOBAL.defaultFS}">号码保护服务不会向您额外收费,费用由美团外卖承担.</text>
                </div>
                <div class="contentDiv ">
                    <text class="contentDivIcon"></text>
                    <text class="contentDivText" :style="{fontSize:GLOBAL.defaultFS}">当号码保护提供商的服务提供商出现服务故障时,您的真实手机号将展示给商家和骑手,以确保商家和骑手能为您送餐</text>
                </div>
            </div>
        </scroller>
    </div>
</template>

<script>
    import {WxcMask, WxcMinibar, WxcPopup,WxcLightbox} from 'weex-ui';

    const animation = weex.requireModule('animation')
    const modal = weex.requireModule('modal')
    const dom = weex.requireModule('dom')
    export default {
        components: {WxcMask, WxcMinibar, WxcPopup,WxcLightbox},
        name: 'App',
        data() {
            return{}
        },
        methods:{
            minibarLeftButtonClick(){},
        },
        created() {
        },
    }
</script>

<style scoped>
    .minibar {
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: #f1f1f1;
    }
    .backImg {
        width: 40px;
        height: 40px;
    }
    /*编辑*/
    .contentDivText{
        color: #999;
        margin-left: 20px;
        flex: 1;
    }
    .contentDivIcon{
        width: 10px;
        height: 10px;
        border-radius: 5px;
        border-style: solid;
        border-width: 2px;
        border-color: #53beb7;
        margin-top: 10px;
    }
    .contentDiv{
        flex-direction: row;
        margin-top: 70px;
    }
    .introduce{
        font-weight: bold;
        margin-top: 40px;
    }
    .content{
        color: #999;
        margin-top: 70px;
    }
    .img{
        width: 670px;
        height: 256px;
        margin-top: 70px;
    }
    .explain{
        margin-top: 70px;
        font-weight: bold;
    }


    /*默认*/
    .row{
        flex-direction: row;
        align-items: center;
    }
    .radius{
        border-radius: 15px;
    }
</style>
