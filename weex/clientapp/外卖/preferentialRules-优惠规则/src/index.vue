<template>
    <div class="preferentialRules">

        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    v-once
            >
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">阿凡提点餐活动规则</text>
            </wxc-minibar>
        </div>

        <scroller style="width: 750px;flex: 1;">
            <!--<text class="ruleTitle">阿凡提点餐活动规则</text>-->

            <div v-for="(item,index) in ruleList" :key="index">
                <text class="coupon" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.title}}</text>
                <div class="couponDiv" v-for="(itemTwo,indexTwo) in item.smallTitle" :key="indexTwo" @click="openClick(index,indexTwo)">
                    <div class="couponTop">
                        <text class="couponTopText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{itemTwo.text}}</text>
                        <image class="couponTopIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png" ref="test"></image>
                    </div>
                    <div class="details" v-if="itemTwo.open">
                        <text class="condition" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">{{itemTwo.textTwo}}</text>
                        <text class="condition" v-for="(itemThree,indexThree) in itemTwo.list" :key="indexThree" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">&nbsp;&nbsp;&nbsp;&nbsp;{{itemThree.text}}</text>
                    </div>
                </div>
            </div>
        </scroller>
    </div>
</template>

<script>
    import {WxcMask, WxcMinibar,WxcPopup } from 'weex-ui';

    const animation = weex.requireModule('animation')
    const modal = weex.requireModule('modal')
    const dom = weex.requireModule('dom')
    export default {
        components: {WxcMask, WxcMinibar,WxcPopup },
        name: 'App',
        data() {
            return {
                ruleList:[
                    {
                        title:'优惠券',smallTitle:[
                            {
                                text:'1.为什么不能使用优惠券？',textTwo:'使用优惠券需要同时满足一下条件:',open:false,num:0,list:[
                                    {text:'(1) 商品价+餐盒费超过10元才可使用支付优惠券'},
                                    {text:'(2) 仅限在线支付使用，且收餐人手机号，领优惠券时输入的手机号和账号中的手机号为统一的手机号'},
                                    {text:'(3) 优惠券有品类及金额的限制，需要在对应品类下且满足限制金额后才可使用。'},
                                    {text:'(4) 每个订单只能使用一张优惠券，且每天最多使用两次优惠券'},
                                ],
                            },
                            {
                                text:'2.下单时为什么不能使用首单优惠券？',textTwo:'首单优惠券需同时满足一下条件才可使用，且首单优惠券不与其他的优惠(首减，满减，满赠，套餐赠，折扣菜)同享:',open:false,num:1,list:[
                                    {text:'(1) 新用户(设备，手机号，阿凡提点餐账号均未在阿凡提点餐下过单)首次下单'},
                                    {text:'(2) 仅限在线支付使用，且收餐人手机号，领优惠券时输入的手机号和账号中的手机号为统一的手机号'},
                                    {text:'(3) 商品价+餐盒费超过10元'},
                                ],
                            },
                        ],
                    },

                    {
                        title:'新用户立减活动',smallTitle:[
                            {
                                text:'1.为什么没有享受新用户立减优惠？',textTwo:'享受新用户立减优惠需满足一下条件:',open:false,num:2,list:[
                                    {text:'(1) 下单的商家有新用户立减活动。(商家列表中带有首字标识的商家)'},
                                    {text:'(2) 您的手机，手机号，阿凡提点餐账号都是第一次在阿凡提点餐外卖下单。（设备，手机号，阿凡提点餐账号任意一个在阿凡提点餐下过单均不可享受新用户立减优惠）'},
                                ],
                            },
                            {
                                text:'2.收购订单取消后，还能享受新用户立减优惠吗？',textTwo:'取消订单后，需要等待退款成功后才能恢复新用户下单立减资格；如果商家不确认退款您可以电话联系商家或客服。',open:false,num:3,list:[

                                ],
                            },
                        ],
                    },

                    {
                        title:'满减活动',smallTitle:[
                            {
                                text:'1.为什么没有享受满减优惠？',textTwo:'享受满减优惠需同时满足一下条件，且满减优惠与首单立减优惠，首单优惠券，折扣菜等活动不能共享:',open:false,num:4,list:[
                                    {text:'(1) 下单的商家有满减活动。（商家列表页中带有减字的标识商家）'},
                                    {text:'(2) 菜品价格加餐盒费要满足满减金额限制（如商家有满24-12的优惠，菜品价格加餐盒费需大于等于24才可以减12元)'},
                                    {text:'(3) 每个用户每天只能享受两单优惠'},
                                ],
                            },
                        ],
                    },

                    {
                        title:'其他优惠问题',smallTitle:[
                            {
                                text:'1.为什么添加的菜品变成了原价？',textTwo:'特价套餐每个订单只可享受2份，超过两份的菜品会按原价计算。',open:false,num:5,list:[

                                ],
                            },
                            {
                                text:'2.为什么提示当日优惠已经用完，且不能再享受优惠了？',textTwo:'在阿凡提点餐App下单，同一设备，手机号，账号每天仅能享受两单优惠，超过两单后则不能在享受优惠。PC端，手机网页端能参加优惠活动。',open:false,num:6,list:[

                                ],
                            },
                            {
                                text:'3.为什么没有获取商家代金券？',textTwo:'获取商家代金券同时满足一下条件:',open:false,num:7,list:[
                                    {text:'(1) 下单的商家有满减反商家的代金券的活动。（商家列表页中带有返字标识的商家）'},
                                    {text:'(2) 实际支付金额满足返劵要求。（如满50返5元商家代金券，需要实际支付金额满50后才可以获取5元商家代金券）'},
                                ],
                            },
                            {
                                text:'4.为什么到店取餐享受的活动和列表显示的不一致？',textTwo:'到店取餐业务只能享受非阿凡提点餐补贴活动，阿凡提点餐补贴的活动只能在阿凡提点餐配送订单享受哦。',open:false,num:8,list:[

                                ],
                            },
                        ],
                    },

                ],
            }
        },
        methods:{
            minibarLeftButtonClick(){},
            openClick(index,indexTwo){
                if(this.ruleList[index].smallTitle[indexTwo].open){
                    this.ruleList[index].smallTitle[indexTwo].open=false;
                    this.moveTwo(this.ruleList[index].smallTitle[indexTwo].num)
                }
                else{
                    this.ruleList[index].smallTitle[indexTwo].open=true;
                    this.moveOne(this.ruleList[index].smallTitle[indexTwo].num);
                }
            },
            moveOne(index) {
                var testEl = this.$refs.test[index];
                animation.transition(testEl, {
                    styles: {
                        transform: 'rotate(90deg)',
                        transformOrigin: 'center center'
                    },
                    duration: 500, //ms
                    timingFunction: 'ease',
                    delay: 0 //ms
                })
            },
            moveTwo(index) {
                var testEl = this.$refs.test[index];
                animation.transition(testEl, {
                    styles: {
                        transform: 'rotate(0deg)',
                        transformOrigin: 'center center'
                    },
                    duration: 500, //ms
                    timingFunction: 'ease',
                    delay: 0 //ms
                })
            },
        },
        created(){
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
    .condition{
    }
    .details{
        padding-top: 30px;
        padding-bottom: 30px;
        padding-left: 30px;
        padding-right: 30px;
        border-top-style: solid;
        border-top-width: 2px;
        border-top-color: #eeefef;
    }
    .couponTopIcon{
        width: 20px;
        height: 20px;
    }
    .couponTopText{
        flex: 1;
    }
    .couponTopTwo{
        flex-direction: row;
        align-items: center;
        padding-top: 30px;
        padding-bottom: 30px;
        border-top-style: solid;
        border-top-width: 2px;
        border-top-color: #eeefef;
    }
    .couponTop{
        flex-direction: row;
        align-items: center;
        padding-top: 30px;
        padding-bottom: 30px;
    }
    .couponDiv{
        padding-left: 20px;
        padding-right: 20px;
        background-color: #fff;
    }
    .coupon{
        padding-left: 25px;
        padding-top: 25px;
        padding-bottom: 25px;
        background-color: #eeefef;
    }
    .ruleTitle{
        text-align: center;
        padding-top: 30px;
        padding-bottom: 30px;
        font-size: 30px;
        color: #333;
        background-color: #fff;
    }
    .preferentialRules{
        background-color: #f9f9f9;
    }
</style>
