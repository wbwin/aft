<template>
    <div class="myWallet">

        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    v-once
            >
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">我的钱包</text>
            </wxc-minibar>
        </div>

        <scroller class="scroller" show-scrollbar="false">
            <div class="listDiv row" @click="toMembershipCard()">
                <image class="listIcon" src="https://image.aftdc.com/images/hyk.png"></image>
                <text class="listText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">会员卡</text>
                <image class="icon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
            </div>
            <div class="listDiv row" @click="toRedEnvelopes()">
                <image class="listIcon" src="https://image.aftdc.com/images/hb.png"></image>
                <text class="listText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">红包</text>
                <image class="icon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
            </div>
            <!--<div class="listDiv row" @click="toVoucher()">-->
            <!--<image class="listIcon" src="https://image.aftdc.com/images/yhq.png"></image>-->
            <!--<text class="listText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">优惠券</text>-->
            <!--<image class="icon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>-->
            <!--</div>-->
        </scroller>


    </div>
</template>

<script>
    import { WxcMinibar,WxcButton} from 'weex-ui';
    const event = weex.requireModule('event');
    const navigator = weex.requireModule('navigator');
    export default {
        components: { WxcMinibar,WxcButton},
        name: 'App',
        data() {
            return {}
        },
        methods: {
            minibarLeftButtonClick(){
                navigator.pop({animated:'false'});
            },
            toMembershipCard(){
                var param='';
                var url='http://assets/membershipCard.js'
                event.toUrl({"url":url,"param":param})
            },
            toRedEnvelopes(){
                var param='';
                var url='http://assets/redEnvelopes.js'
                event.toUrl({"url":url,"param":param})
            },
            // toVoucher(){
            //     var param='';
            //     var url='http://assets/voucher.js'
            //     event.toUrl({"url":url,"param":param})
            // },
        },
    }
</script>

<style scoped>
    .scroller{
        width: 750px;
        flex: 1;
    }
    .icon{
        width: 20px;
        height: 20px;
    }
    .listText{
        margin-left: 20px;
        flex: 1;
    }
    .listIcon{
        width: 70px;
        height: 70px;

    }
    .listDiv{
        padding-top: 25px;
        padding-bottom: 25px;
        padding-left: 30px;
        padding-right: 30px;
        border-bottom-style: solid;
        border-bottom-width: 2px;
        border-bottom-color: #f1f1f1;
    }
    .row{
        flex-direction: row;
        align-items: center;
    }
    .minibar {
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: #f1f1f1;
    }
</style>
