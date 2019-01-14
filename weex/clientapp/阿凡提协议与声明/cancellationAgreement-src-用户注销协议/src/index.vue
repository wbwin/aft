<template>
    <div class="myCardDetails">
        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="backClick"
                    v-once
            >
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">用户注销协议</text>
                <text :style="GLOBAL.headerRight"  slot="right"></text>
            </wxc-minibar>
        </div>
        <scroller style="flex: 1;width: 750px;">
            <div style="padding-left: 40px;padding-right: 40px;">
                <text class="title" :style="{color:GLOBAL.dColor}">用户注销协议</text>
                <text class="details" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;在您注销您的账户之前,请充分阅读、理解并同意下列事项:</text>
                <text class="details" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;在此善意地提醒您,您注销阿凡提账户的行为,将导致我们终止对您提供本服务,也会给您的售后维权带来诸多不便。注销成功后,我们将删除您的个人信息,使其保持不可被检索、访问的状态,或对其进行匿名化处理。您知晓并理解,根据相关法律规定相关交易记录须在阿凡提保存1年甚至更长的时间。</text>

                <div class="content" v-for="item in contentList">
                    <text class="details" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}" v-for="itemTwo in item.text">{{itemTwo.text}}</text>
                </div>
                <div style="height: 30px;"></div>
            </div>
        </scroller>
    </div>
</template>

<script>
    import { WxcMask,WxcButton,WxcMinibar, WxcPopup} from 'weex-ui';
    export default {

        components: {WxcMinibar, WxcPopup,WxcMask,WxcButton},
        data() {
            return{
                contentList:[
                    {
                        text: [
                            {text: '1.如果您仍执意注销账户,您的账户需同时满足以下条件'},
                            {text: '(1) 账户在阿凡提系统中无资产、无欠款'},
                            {text: '(2) 账户内无未完成的订单、已提供服务但未支付的订单服务'},
                            {text: '(3 )账户无任何纠纷,包括投诉举报或被投诉举报;'},
                            {text: '(4) 账户为正常使用中的账户且无任何账户被限制的记录;'},
                            {text: '(5) 账户对应的阿凡提支付账户已注销,且已妥善处理了阿凡提支付账户下的所有问题;'},
                        ],
                    },
                    {
                        text: [
                            {text: '2.在阿凡提账户注销期间,如果您的阿凡提账户涉及争议纠纷,包括但不限于投诉、举报、诉讼、仲裁、国家有权机关调查等,阿凡提有权自行终止本阿凡提账户的注销而无需另行得到您的同意。'},
                        ],
                    },
                    {
                        text: [
                            {text: '3.请您在提交注销申请前,务必解绑其他相关账户,具体可与我们的客服联系'},
                        ],
                    },
                    {
                        text: [
                            {text: '4.阿凡提账户一旦被注销将不可恢复,请您在操作之前自行备份账户相关的所有信息和数据。注销阿凡提账户,您将无法再使用本阿凡提账户,也将无法找回您阿凡提账户中及与账户相关的任何内容或信息(即使您使用相同的手机号码再次注册并使用阿凡提),包括但不限于:'},
                            {text: '(1) 您将无法登录、使用阿凡提账户'},
                            {text: '(2) 阿凡提账户的个人资料和历史信息(包括但不限于用户名、昵称、头像、预定/团购记录等)都将无法找回'},
                            {text: '(3) 您通过阿凡提账号进行登录的阿凡提旗下各APP(包括但不限于大众点评、阿凡提外卖、阿凡提打车、猫眼、小象生鲜等)所有记录将无法找回。您将无法再登录、使用前述服务,您曾获得的优惠券、积分、及其他卡券等视为您自行放弃,将无法继续使用。您理解并同意,阿凡提无法协助您重新恢复前述服务。'},
                        ],
                    },
                    {
                        text:[
                            {text:'5.注销本阿凡提账户并不代表本阿凡提账户注销前的账户行为和相关责任得到豁免或减轻。'},
                        ],
                    },
                ],
            }
        },
        methods:{

        },
    }
</script>

<style scoped>
    .content{
        margin-top: 30px;
    }
    .details{
        line-height: 55px;
    }
    .title{
        font-size: 60px;
        text-align: center;
        margin-top: 80px;
        margin-bottom: 30px;
        /*font-weight: bold;*/
    }
    /*默认样式*/
    .row{
        flex-direction: row;
        align-items: center;
    }
</style>
