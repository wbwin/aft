<template>
    <div class="wrapper" >
        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="backClick"
                    @wxcMinibarRightButtonClicked="minibarRightButtonClick"
                    v-once>
                <image :style="GLOBAL.headerImg" slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter" slot="middle">价格说明</text>
                <text :style="GLOBAL.headerRight" slot="right"></text>
            </wxc-minibar>
        </div>
        <scroller show-scrollbar="true">
        <div class="content">
            <text class="headerText dcolor bold" :style="{fontSize:GLOBAL.biggerFS}">价格说明</text>
            <div class="mt36" >
                <text class="lineHeight46 dcolor" :style="{fontSize:GLOBAL.biggerFS}" v-for="item in priceDescription">{{item}}</text>
            </div>
        </div>
        </scroller>
    </div>
</template>
<script>
    import {WxcMinibar} from 'weex-ui'
    export default {
        data() {
            return {
                priceDescription: [
                    '1、团购价：团购价为商品/服务的销售价，是您最终决定是否购买商品/服务的依据。',
                    '2、外卖价：外卖价为外卖商品/服务的销售价，是您最终决定是否购买外卖商品/服务的依据。',
                    '3、划线价/门店价/门市价：商品/服务展示的划横线的价格/门店价/门市价为参考价，该价格可能是品牌专柜标价、商品吊牌价或由品牌供应商提供的正品零售价（如厂商指导价、建议零售价等）或该商品/服务在阿凡提平台上曾经展示过的销售价或商品/服务的实体门店指导价、实体门店展示销售价等；由于地区、时间的差异性和市场行情波动，品牌专柜标价、商品吊牌价、实体门店指导价、实体门店展示销售价等可能会与您购物/消费时展示的不一致，该价格仅供您参考。',
                    '4、折扣：如无特殊说明，折扣指商户在原价、或划线价/门店价/门市价（如品牌专柜标价、商品吊牌价、厂商指导价、厂商建议零售价、实体门店指导价、实体门店展示销售价等）等某一价格基础上计算出的优惠比例或优惠金额；如有疑问，您可在购买前联系商户/阿凡提客服进行咨询。\n'
                ]
            }
        },
        components: {WxcMinibar},
        methods: {
            backClick(){

            },
            minibarRightButtonClick(){

            }
        }
    }
</script>

<style scoped>
    .wrapper {
        background-color: white;
    }
    .content {
        padding-top: 50px;
        padding-bottom: 100px;
        padding-left: 30px;
        padding-right: 24px;
    }
    .headerText {
        text-align: center;
    }
    .mt36 {
        margin-top: 36px;
    }
    .lineHeight46 {
        line-height: 46px;
    }
    .dcolor {
        color: #373737;
    }
    .bold {
        font-weight: bold;
    }
</style>
