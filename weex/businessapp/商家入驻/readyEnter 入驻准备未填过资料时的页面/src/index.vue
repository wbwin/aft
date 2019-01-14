<template>
    <div class="wrapper">
        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    v-once
            >
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">入驻准备</text>
                <!--<text :style="GLOBAL.headerRight"  slot="right">帮助</text>-->
            </wxc-minibar>
        </div>
        <list class="scroller">
            <cell>
                <div class="cellTop">
                    <text  :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">申请开店前，请准备一下资料</text>
                </div>
            </cell>
            <cell v-for="(item,index) in enterData">
                <div class="readyContent">
                    <image class="imgDefault" :src="'https://image.aftdc.com/'+item.img"></image>
                    <div class="dataMessage">
                        <text :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">{{item.dataTitle}}</text>
                        <text  :style="{fontSize:GLOBAL.defaultFS,color:'#999',width:'470px',marginTop:'5px'}">{{item.dataExplain}}</text>
                    </div>
                </div>
            </cell>
        </list>
        <div class=" enterButton">

            <wxc-button class="okButton" text="准备好了,申请开店" :textStyle="GLOBAL.buttonText" :btnStyle="GLOBAL.defaultButton"
                        @wxcButtonClicked="toEnterMessage"></wxc-button>
        </div>
    </div>
</template>

<script>
    import {WxcMinibar, WxcButton} from 'weex-ui';

    const event = weex.requireModule('event');
    export default {
        components: {WxcMinibar, WxcButton},
        data() {
            return {
                enterData:
                    [
                        {
                            img: 'images/packageA/shopImg2.jpg',
                            dataTitle: '门脸照片',
                            dataExplain: '需拍出完整门匾、门框（建议正对门店2米处拍摄）'
                        },
                        {img: 'images/packageA/shopImg1.jpg', dataTitle: '店内照片', dataExplain: '需真实反映用餐环境（收银台、用餐桌椅）'},
                        {img: 'images/packageA/logo.png', dataTitle: '商户LOGO', dataExplain: '需体现您店铺的特色，可吸引更多的用户进店点餐'},
                        {
                            img: 'images/packageA/papers1.jpg',
                            dataTitle: '身份证照片',
                            dataExplain: '1)需清晰展示人物五官和身份证文字信息；2)不可自拍，不可只拍身份证'
                        },
                        {
                            img: 'images/packageA/setTyps.jpg',
                            dataTitle: '营业执照',
                            dataExplain: '1)需文字清晰、边框完整、露出国徽:2)拍复印件需加盖印章,可用有效特许证代替'
                        },
                        {
                            img: 'images/packageA/setAllow.jpg',
                            dataTitle: '行业许可证',
                            dataExplain: '1)需文字清晰、边框完整:2)可用食品流通许可证等其它有效证件代替'
                        },
                    ],
                okBtnStyle: {
                    backgroundColor: '#53beb7',
                    width: '600',
                    borderColor: '#428a85',
                    borderWidth: '1px',
                    borderStyle: 'solid'
                },
                okStyle: {
                    color: '#fff'
                },
            }
        },
        created(){
            this.phone = JSON.parse(weex.config.param).phone;
            this.token = JSON.parse(weex.config.param).token;
        },
        methods: {

            minibarLeftButtonClick() {

            },
            toEnterMessage() {
                var param = {
                    phone:this.phone,
                    token:this.token
                };
                var url = 'http://assets/enterMessage.js'
                event.toUrl({"url": url, "param": param})
            }
        }
    }
</script>

<style scoped>
    .wrapper {
        flex-direction: column;
    }

    .minibar {
        /*border-bottom-width: 2px;*/
        /*border-bottom-style: solid;*/
        /*border-bottom-color: #a1a1a1;*/
    }

    .backImg {
        width: 40px;
        height: 40px;
    }

    .scroller {
        position: absolute;
        top: 93px;
        left: 0;
        right: 0;
        bottom: 108px;

    }

    .cellTop {
        margin-top: 30px;
        margin-bottom: 60px;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }

    .readyContent {

        padding-bottom: 40px;
        margin-bottom: 40px;
        margin-left: 20px;
        margin-right: 20px;
        flex-direction: row;
        align-items: center;
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #f1f1f1;
    }

    .imgDefault {
        width: 220px;
        height: 160px;
    }

    .dataMessage {
        flex-direction: column;
        justify-content: center;
        padding-left: 20px;
    }

    .dataExplain {
        margin-top: 30px;
        width: 470px;
    }

    .enterButton {
        flex-direction: row;
        justify-content: space-around;
        position: fixed;
        left: 0;
        bottom: 0;
        right: 0;
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
        background-color: #57aba5;
    }
    .okButton:enabled {
        background-color: #53BEB7;
    }
</style>
