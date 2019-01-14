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

        <scroller class="scroller" show-scrollbar="false">
            <div class="top row">
                <text class="topIcon">?</text>
                <text class="topText" :style="{fontSize:GLOBAL.defaultFS}">{{title}}</text>
            </div>

            <div style="padding-left: 20px;padding-right: 20px;">
                <div class="content">
                    <text class="contentText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{content[id].text}}</text>

                    <image class="picture" :src="content[id].image" v-if="content[id].image"></image>
                </div>
            </div>
        </scroller>


        <div class=" enterButton">
            <wxc-button class="okButton" text="电话客服":textStyle="GLOBAL.cancelButtonText" :btnStyle="GLOBAL.smCancelButton"
                        @wxcButtonClicked="callKF(4008677791)"></wxc-button>
            <wxc-button class="onButton" text="知道了" :textStyle="GLOBAL.buttonText" :btnStyle="GLOBAL.smDefaultButton"
                        @wxcButtonClicked="minibarLeftButtonClick"></wxc-button>
        </div>


    </div>
</template>

<script>
    import {WxcMask, WxcMinibar, WxcPopup,WxcLightbox,WxcButton} from 'weex-ui';
    const animation = weex.requireModule('animation');
    const modal = weex.requireModule('modal');
    const dom = weex.requireModule('dom');
    const navigator = weex.requireModule('navigator');
    const event = weex.requireModule('event');
    export default {
        components: {WxcMask, WxcMinibar, WxcPopup,WxcLightbox,WxcButton},
        name: 'App',
        data() {
            return{
                title:'',
                id:'',
                content:[
                    {text:'如果菜品没有按照您下单的数量送达，您可以联系商家进行补送。如不能解决，联系客服为您处理。',image:''},
                    {text:'小毛驴建议您先联系商家，和商家沟通是否可以重新为您配送菜品，如果问题没有解决，请您点击左下角的【电话客服】，将有客服为您处理。',image:''},
                    {text:'您可以点击订单详情下方的【申请退款】进行退款，或者点击订单详情下方的【联系商家】和商家进行沟通。如您的订单已经完成超过24小时，则不显示下方的【申请退款】，请您点击下方的【电话客服】，联系客服为您处理。',image:''},
                    {text:'非常抱歉给您带来不好的用餐体验，小毛驴十分关注用户的食品安全问题，如果菜品质量有问题，请您点击左下角的【电话客服】，将有客服为您处理。',image:''},
                    {text:'餐品发票是由商家开具的，建议您直接联系商家索要发票。',image:''},
                    {text:'非常抱歉给您带来不好的消费体验,小毛驴建议您可以先联系商家，询问具体原因，如果问题没有解决，请您点击左下角的【电话客服】，将有客服替您进行沟通',image:''},
                    {text:'非常抱歉给您带来不好的用餐体验，小毛驴十分关注用户的食品安全问题，如果菜品质量有问题，建议您优先点击下方的【联系商家】和商家进行协商解决，如果问题没有解决，请您点击左下角的【电话客服】，将有客服为您处理。',image:''},
                    {text:'非常抱歉给您带来不好的用餐体验，小毛驴建议您可以先联系商家，沟通是否可以重新为您配送餐具，如果问题没有解决，请您点击左下角的【电话客服】，将有客服替您进行沟通',image:''},
                    {text:'暂不支持修改评价，可追加评价',image:''},
                    {text:'暂不支持删除评价',image:''},
                    {text:'非常抱歉给您带来不好的体验，如果菜品量太少，小毛驴建议您可以先联系商家，并上传菜品的完整照片，如果问题没有解决，请您点击左下角的【电话客服】，将有客服替您进行沟通',image:''},
                    {text:'您可以点击下方的【联系商家】，电话联系商家。在用餐高峰商家可能忙于制作菜品无法及时接听电话，建议您拨打电话后耐心等待商家接听',image:''},
                    {text:'非常抱歉给您带来不好的体验，小毛驴建议您可以先联系商家，并上传菜品的完整照片，如果问题没有解决，请您点击左下角的【电话客服】，将有客服替您进行沟通',image:''},
                    {text:'您好，在阿凡提点餐客户端下单并进入我的订单页面点击“确认收货”后，可在待评价处进行评价',image:''},

                ],
            }
        },
        methods:{
            minibarLeftButtonClick(){
                navigator.pop({animated:'false'});
            },
            callKF(phone){
                event.phone(phone)
            },
        },
        created() {
            event.init();
            var that=this;
            var param = weex.config.param;
            param = JSON.parse(param);
            that.title=param.title;
            that.id=param.id;
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
    .scroller{
        width: 750px;
        flex: 1;
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
