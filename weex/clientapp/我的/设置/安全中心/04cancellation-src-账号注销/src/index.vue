<template>
    <div class="Cancellation">
        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    v-once
            >
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">账号注销</text>
                <text :style="GLOBAL.headerRight"  slot="right"></text>
            </wxc-minibar>
        </div>
        <scroller style="flex: 1;width: 750px;">

            <!--警告图标-->
            <div class="iconDiv row">
                <text class="iconText">!</text>
            </div>

            <text class="textCancellation" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">将136****0745所绑定的账号注销</text>
            <text class="attentionText" :style="{fontSize:GLOBAL.defaultFS}">注意,注销账号后一下信息将被请空且无法找回</text>

            <!--主体部分-->
            <div class="content">
                <div class="contentDiv row" v-for="item in contentList">
                    <text class="blackIcon"></text>
                    <text class="contentText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.text}}</text>
                </div>
                <text class="btnText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">请确保所有交易已完结且无纠纷,账户删除后的历史交易可能产生的资金退回权益等将视作自动放弃</text>
            </div>

            <div class=" enterButton">
                <wxc-button class="okButton" text="下一步" :textStyle="GLOBAL.buttonText" :btnStyle="GLOBAL.defaultButton"
                            @wxcButtonClicked="toEnterMessage"></wxc-button>
            </div>

            <div class="agreeDiv row">
                <text class="agree" :style="{fontSize:GLOBAL.smallFS}">点击【下一步】即代表你已同意</text>
                <text class="agreeTwo" @click="toCancellationAgreement" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.tColor}">《用户注销协议》</text>
            </div>

        </scroller>
    </div>
</template>

<script>
    import { WxcMask,WxcButton,WxcMinibar, WxcPopup} from 'weex-ui';
    const event=weex.requireModule('event');
    const navigator = weex.requireModule('navigator');
    export default {

        components: {WxcMinibar, WxcPopup,WxcMask,WxcButton},
        data() {
            return{
                contentList:[
                    {text:'身份、账户信息、会员及权益信息'},
                    {text:'和阿凡提关联的点评账号'},
                    {text:'银行卡的快捷支付(含卡通)服务'},
                    {text:'交易记录'},
                    {text:'个人隐私'},
                ],
            }
        },
        methods:{
            minibarLeftButtonClick(){
                navigator.pop({animated:'false'});
            },

            toCancellationAgreement(){
                var param=''
                var url='http://assets/cancellationAgreement.js'
                event.toUrl({"url":url,"param":param})
            },

            toEnterMessage(){
                var param=''
                var url='http://assets/accountCancellation.js'
                event.toUrl({"url":url,"param":param})
            },
        },
    }
</script>

<style scoped>
    .agreeTwo{
        font-weight: bold;
        text-decoration: underline;
    }
    .agree{
        color: #999;
    }
    .agreeDiv{
        margin-top: 30px;
        margin-bottom: 30px;
        justify-content: center;
    }
    .enterButton {
        flex-direction: row;
        justify-content: space-around;
        /*position: fixed;*/
        /*left: 0;            存在时固定在底部*/
        /*bottom: 0;*/
        /*right: 0;*/
        margin-top: 50px;
        padding-left: 30px;
        padding-right: 30px;
    }

    .okButton:active {
        background-color: #57aba5;
    }
    .okButton:enabled {
        background-color: #53beb7;
    }
    .btnText{
        flex: 1;
        line-height: 40px;
        padding-top: 40px;
        margin-top: 20px;
        border-top-style: solid;
        border-top-width: 2px;
        border-top-color: #e1e1e1;
    }
    .contentDiv{
        margin-bottom: 20px;
    }
    .contentText{
        margin-left: 20px;
    }
    .blackIcon{
        width:7px;
        height: 7px;
        border-radius: 5px;
        background-color: #666;
    }
    .content{
        padding-top: 40px;
        padding-left: 40px;
        padding-right: 40px;
        padding-bottom: 40px;
        background-color: #fff;
        margin-top: 30px;
        margin-left: 25px;
        margin-right: 25px;
    }
    .attentionText{
        color: #999;
        text-align: center;
        margin-top: 20px;
    }
    .textCancellation{
        font-weight: bold;
        text-align: center;
        margin-top: 40px;
    }
    .iconText{
        width: 100px;
        height: 100px;
        border-radius: 50px;
        color: #fff;
        font-size: 70px;
        text-align: center;
        line-height: 100px;
        background-color: orangered;
    }
    .iconDiv{
        justify-content: center;
        margin-top: 40px;
    }
    .Cancellation{
        background-color: #f8f8f8;
    }

    /*默认样式*/
    .row{
        flex-direction: row;
        align-items: center;
    }
</style>
