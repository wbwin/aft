<template>
    <div class="ContactcustomerService">

        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    v-once
            >
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">问题详情</text>
            </wxc-minibar>
        </div>

        <scroller style="flex: 1;width: 750px;" show-scrollbar="false">
        <div class="top row">
            <text class="topIcon">?</text>
            <text class="topText" :style="{fontSize:GLOBAL.defaultFS}">菜品少送</text>
        </div>

            <div style="padding-left: 20px;padding-right: 20px;">
                <div class="content">
                    <text class="contentText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">如果菜品没有按照您下单的数量送达,您可以联系商家进行补送.或者点击下方的【申请退款】,将少送的菜品金额操作退款.如您的订单已经完成超过24小时,则不现实下方的【申请退款】,请您点击下方的【联系客服】,联系客服为您处理。</text>

                    <image class="picture" src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1530965277025&di=d69c547b4e289a1560ab59049a388c3a&imgtype=0&src=http%3A%2F%2Fv1.qzone.cc%2Fpic%2F201612%2F23%2F10%2F32%2F585c8cad43ba2848.jpg%2521600x600.jpg"></image>
                    <image class="picture" src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1530965277025&di=d69c547b4e289a1560ab59049a388c3a&imgtype=0&src=http%3A%2F%2Fv1.qzone.cc%2Fpic%2F201612%2F23%2F10%2F32%2F585c8cad43ba2848.jpg%2521600x600.jpg"></image>
                    <image class="picture" src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1530965277025&di=d69c547b4e289a1560ab59049a388c3a&imgtype=0&src=http%3A%2F%2Fv1.qzone.cc%2Fpic%2F201612%2F23%2F10%2F32%2F585c8cad43ba2848.jpg%2521600x600.jpg"></image>
                    <div class="contentDiv row">
                        <text style="flex: 1;"></text>
                        <image class="zanIcon" :src="zan===0?'https://image.aftdc.com/images/zhan.png':zan===1?'https://image.aftdc.com/images/nozhan.png':'https://image.aftdc.com/images/nozhan.png'" @click="zanClick(0)"></image>
                        <text class="zanText" :style="{fontSize:GLOBAL.defaultFS}">有用</text>
                        <image class="noZanIcon" :src="zan===1?'https://image.aftdc.com/images/zhan.png':zan===0?'https://image.aftdc.com/images/nozhan.png':'https://image.aftdc.com/images/nozhan.png'" @click="zanClick(1)"></image>
                        <text class="zanText" :style="{fontSize:GLOBAL.defaultFS}">没用</text>
                    </div>
                </div>
            </div>
        </scroller>


        <div class=" enterButton">
            <wxc-button class="okButton" text="电话客服":textStyle="GLOBAL.cancelButtonText" :btnStyle="GLOBAL.smCancelButton"
                        @wxcButtonClicked="toEnterMessage"></wxc-button>
            <wxc-button class="onButton" text="知道了" :textStyle="GLOBAL.buttonText" :btnStyle="GLOBAL.smDefaultButton"
                        @wxcButtonClicked="toEnterMessage"></wxc-button>
        </div>


    </div>
</template>

<script>
    import {WxcMask, WxcMinibar, WxcPopup,WxcLightbox,WxcButton} from 'weex-ui';

    const animation = weex.requireModule('animation')
    const modal = weex.requireModule('modal')
    const dom = weex.requireModule('dom')
    export default {
        components: {WxcMask, WxcMinibar, WxcPopup,WxcLightbox,WxcButton},
        name: 'App',
        data() {
            return{
                zan:'',
            }
        },
        methods:{
            minibarLeftButtonClick(){},
            zanClick(index){
                this.zan=index;
            }
        },
        created() {
        },
    }
</script>

<style scoped>
    .enterButton {
        width: 750px;
        flex-direction: row;
        justify-content: space-around;
        /*position: fixed;*/
        /*left: 0;            存在时固定在底部*/
        /*bottom: 0;*/
        /*right: 0;*/
        background-color: #fff;
        border-top-width: 2px;
        border-top-style: solid;
        border-top-color: #f1f1f1;
        padding-top: 20px;
        padding-bottom: 20px;
        padding-left: 30px;
        padding-right: 30px;
    }

    .okButton:active {
        background-color: #f8f8f8;
    }
    .onButton:active{
        background-color: #53aba5;
    }
    .minibar {
        /*border-bottom-width: 2px;*/
        /*border-bottom-style: solid;*/
        /*border-bottom-color: #a1a1a1;*/
    }
    /*编辑*/
    .picture{
        width: 670px;
        height: 400px;
        margin-top: 20px;
    }
    .zanText{
        color: #999;
        margin-left: 10px;
    }
    .noZanIcon{
        width: 40px;
        height: 40px;
        transform: rotate(180deg);
        margin-left: 30px;
    }
    .zanIcon{
        width: 40px;
        height: 40px;
    }
    .contentDiv{
        margin-top: 50px;
    }
    .contentText{
        flex: 1;
        line-height: 50px;
    }
    .content{
        background-color: #fff;
        margin-top: 20px;
        padding-left: 20px;
        padding-right: 20px;
        padding-top: 50px;
        padding-bottom: 50px;
        border-radius: 15px;
        margin-bottom: 20px;
    }
    .topText{
        color: #ffffff;
        margin-left: 10px;
    }
    .topIcon{
        color: #53beb7;
        font-size: 32px;
        width: 45px;
        height: 45px;
        line-height: 45px;
        text-align: center;
        border-radius: 25px;
        background-color: #fff;
    }
    .top{
        margin-top: 20px;
        background-color: #53beb7;
        padding-left: 20px;
        border-radius: 15px;
        margin-left: 20px;
        margin-right: 20px;
        padding-top: 20px;
        padding-bottom: 20px;
        flex-direction: row;
        align-items: center;
    }
    .ContactcustomerService{
        background-color: #f1f1f1;
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
