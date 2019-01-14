<template>
    <div class="wrap">
        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="backClick"
                    @wxcMinibarRightButtonClicked="minibarRightButtonClick"
                    v-once>
                <image class="flex1" :style="GLOBAL.headerImg" slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text class="flex1 taCenter" :style="GLOBAL.headerCenter" slot="middle">{{problemData[page].headerTitle}}</text>
                <text class="flex1" :style="GLOBAL.headerRight" slot="right"></text>
            </wxc-minibar>
        </div>
        <scroller>
            <div class="problemItem" v-for="(item,index) in problemData[page].content">
                <div class="head">
                    <text class="headText" :style="{fontSize:GLOBAL.bigFS}">{{item.title}}</text>
                </div>
                <div class="main" :class="[!item.paragraph && !item.intervalParagraph?'pt12':'']">
                    <div class="content" :class="[item.btnType?'mb28':'']" v-if="item.paragraph || item.intervalParagraph">
                        <text class="contentText" :style="{fontSize:GLOBAL.defaultFS}" v-for="p in item.paragraph">{{p}}</text>
                        <text class="contentText" :style="{fontSize:GLOBAL.defaultFS}"  v-for="(p,i) in item.intervalParagraph" :class="[i+1!==item.intervalParagraph.length?'mb14':'']">{{p}}</text>
                    </div>
                    <!--<div class="btnBox">-->
                        <wxc-button class="btn" :text="item.btnText" :btnStyle="btnStyle" :textStyle="textStyle"
                                    @wxcButtonClicked="wxcButtonClicked(index)" v-if="item.btnType=='btnA'"></wxc-button>
                        <div class="btnStyleDouble btn row aiCenter jcCenter" style="width: 690px" @click="wxcButtonClicked(index)"  v-if="item.btnType=='btnB'">
                            <image class="customerServiceIcon" src="https://image.aftdc.com/appBimg/ic_customer_service_gray.png"></image>
                            <text class="btnTextDouble">在线客服</text>
                        </div>
                        <div class="double row"  v-if="item.btnType=='btnC'">
                            <div class="btnStyleDouble btn row aiCenter jcCenter" @click="wxcButtonClicked('onlineService')">
                                <image class="customerServiceIcon" src="https://image.aftdc.com/appBimg/ic_customer_service_gray.png"></image>
                                <text class="btnTextDouble">在线客服</text>
                            </div>
                            <div class="btnStyleDouble btn row aiCenter jcCenter" @click="wxcButtonClicked('dialing')">
                                <image class="phoneIcon" src="https://image.aftdc.com/appBimg/ic_phone_black.png"></image>
                                <text class="btnTextDouble">拨打电话</text>
                            </div>
                        </div>
                    <!--</div>-->
                </div>
            </div>
        </scroller>
    </div>
</template>
<script>
    import {WxcMinibar,WxcButton} from 'weex-ui'
    const navigator = weex.requireModule('navigator');

    export default {
        name: 'App',
        data() {
            return {
                page: 0,//0-6代表七个页面
                btnStyle: {
                    width: '690px',
                    backgroundColor:'#fff',
                    borderWidth:'1px',
                    borderStyle:'solid',
                    borderColor:'#666'
                },
                textStyle: {
                    color:'#666',
                    fontSize: '30px'
                },

                problemData: [
                    {
                        headerTitle: '退款到账（到账时间、方向）',
                        content: [
                            {
                                title: '支付宝无法使用/没有支付宝选项',
                                paragraph: [
                                    '每个用户看到的支付方式，是根据用户支付习惯进行的综合排序，并优化使用率高的支付方式。',
                                    '基于推荐的付款方式，用户可以自助选择任一方式（微信，美团支付等）进行支付。',
                                    '另外，美团点评将持续优化推荐的精准度，为用户提供便捷的支付方式。'
                                ]
                            },
                            {
                                title: '退款到账时间',
                                paragraph: [
                                    '退款会退回您的原支付账户，时间为1-7个工作日，请耐心等待。',
                                    '温馨提示：部分银行发送退款短信/通知是不稳定的，会造成款项已退回，但您没收到短信/通知等情况。建议您及时关注原支付方的交易明细，查看款项是否退回。'
                                ]
                            },
                            {
                                title: '如何申请退款',
                                paragraph: [
                                    '点击需要退款的订单-申请退款即可。',
                                    '如没有"申请退款"的按钮，表示此订单不符合退款规则，或无法自行退款。',
                                    '如遇到此情况，请您判断订单类型（例如：酒店、外卖等），点击左上方"返回"-选择所需模块-点击最下在线客服，即可找到相应客服处理您的问题。'
                                ]
                            },
                            {
                                title: '美团闪付是什么',
                                paragraph: [
                                    '美团闪付是帮您开通一个和银行账户相关的电子账户，可以像银行卡一样使用。',
                                    '点击：我的-我的钱包-美团闪付-开通美团闪付-添加到wallet,即可开通。',
                                    '使用闪付付款，支付金额单笔不能超过1000元，日累计不能超过5000元。'
                                ]
                            },
                            {
                                title: '美团闪付被冻结',
                                paragraph: [
                                    '目前闪付解绑银行卡后账户会自动冻结。',
                                    '但是您不必担心，您只需要重新开通闪付功能就可以再次支付了。'
                                ]
                            }
                        ]
                    },
                    {
                        headerTitle: '账户（登录、密码）',
                        content: [
                            {
                                title: '手机号解换绑',
                                intervalParagraph: [
                                    '解绑：手机号解绑后，将无法进行购买，建议您不要解绑，如果从此不再使用此账户，请您选择弃用。请放心，美团是不会泄露您的任何私人信息。',
                                    '换绑：请点击下方"换绑手机号"按钮，按照提示操作即可。如换绑过程中遇到问题，请致电10100000'
                                ],
                                btnText: '换绑手机号',
                                btnType: 'btnA'
                            },
                            {
                                title: '银行卡解换绑',
                                paragraph: [
                                    '绑定：我的-我的钱包-银行卡-添加银行卡-绑定。',
                                    '解绑：我的-我的钱包-银行卡-添加已绑定卡-解绑。',
                                    '如解绑过程中遇到问题，请致电10100000'
                                ]
                            },
                            {
                                title: '支付宝无法使用/没有支付宝选项',
                                paragraph: [
                                    '每个用户看到的支付方式，是根据用户支付习惯进行的综合排序，并优化推荐使用率高的支付方式。',
                                    '基于推荐的付款方式，用户可以自助选择任一方式（微信，美团支付等）进行支付。',
                                    '另外，美团点评将持续优化推荐的精准度，为用户提供便捷的支付方式。'
                                ]
                            },
                            {
                                title: '没有找到相关问题？',
                                btnType: 'btnB'
                            }
                        ]
                    },
                    {
                        headerTitle: '评价相关（评价、积分）',
                        content: [
                            {
                                title: '评价后没有积分',
                                intervalParagraph: [
                                    '订单在消费15天之内评价才可获得积分。',
                                    '并非每个评价都可获得积分，外卖、猫眼订单暂时没有积分。'
                                ]
                            },
                            {
                                title: '认真评价',
                                intervalParagraph: [
                                    '认真评价规则：100字+3张图片是认真评价的基本门槛，达标的评价也会被赋予质量分，质量分是根据文字数量+图片数量+发布时间等计算出来的。会取当天得分排序靠前的90%做为认真评价。',
                                    '认真评价后如果设置为匿名，会取消认真评价，收回认真评价所赠积分'
                                ]
                            },
                            {
                                title: '评价没有展示的原因',
                                intervalParagraph: [
                                    '①违反公共道德和我国法律法规的内容无法展示。',
                                    '②图文并非本人原创，如抄袭他人评价和盗图等行为。',
                                    '③不真实消费评价，如商家故意刷评价等。',
                                    '④灌水信息，如凑字乱打，上传无关图片等。',
                                    '⑤恶意评价。'
                                ]
                            },
                            {
                                title: '支付宝无法使用/没有支付宝选项',
                                paragraph: [
                                    '每个用户看到的支付方式，是根据用户支付习惯进行的综合排序，并优化推荐使用率高的支付方式。',
                                    '基于推荐的付款方式，用户可以自助选择任一方式（微信，美团支付等）进行支付。',
                                    '另外，美团点评将持续优化推荐的精准度，为用户提供便捷的支付方式。'

                                ]
                            },
                            {
                                title: '没有找到相关问题？',
                                btnType: 'btnB'
                            }
                        ]
                    },
                    {
                        headerTitle: '解换绑（手机号、银行卡解换绑）',
                        content: [
                            {
                                title: '手机号解换绑',
                                intervalParagraph: [
                                    '解绑：手机号解绑后，将无法进行购买，建议您不要解绑，如果从此不再使用此账户，请您选择弃用。请放心，美团是不会泄露您的任何私人信息。',
                                    '换绑：请点击下方"换绑手机号"按钮，按钮提示操作即可。如换绑过程中遇到问题，请致电10100000'
                                ],
                                btnText: '换绑手机号',
                                btnType: 'btnA'
                            },
                            {
                                title: '银行卡解换绑',
                                paragraph: [
                                    '绑定：我的-我的钱包-银行卡-添加银行卡-绑定。',
                                    '解绑：我的-我的钱包-银行卡-添加已绑定卡-解绑。',
                                    '如解绑过程中遇到问题，请致电10100000'
                                ]
                            },
                            {
                                title: '支付宝无法使/没有支付宝选项',
                                paragraph: [
                                    '每个用户看到的支付方式，是根据用户支付习惯进行的综合排序，并优化推荐使用率高的支付方式。',
                                    '基于推荐的付款方式，用户可以自助选择任一方式（微信，美团支付等）进行支付。',
                                    '另外，美团点评将持续优化推荐的精准度，为用户提供便捷的支付方式。'
                                ]
                            },
                            {
                                title: '没有找到相关问题？',
                                btnType: 'btnB'
                            }
                        ]
                    },
                    {
                        headerTitle: '外卖',
                        content: [
                            {
                                title: '为什么我的红包不能使用？',
                                paragraph: [
                                    '在"提交订单"页面，您点击"抵用券"即可查看不可使用的原因。'
                                ]
                            },
                            {
                                title: '我定的外卖什么时候能送到啊?',
                                paragraph: [
                                    '您的订单会在预定送达时间前后15分钟内送达您手中，请您耐心等待。'
                                ]
                            },
                            {
                                title: '未手餐，订单显示已经送达，是什么原因？',
                                paragraph: [
                                    '可能您的餐品骑手已经送到楼下，您可拨打订单状态页显示的骑手电话，咨询当前的具体配送位置。'
                                ]
                            },
                            {
                                title: '我要退款？',
                                intervalParagraph: [
                                    '商家未接单之前您可直接取消订单',
                                    '如果商家已接单或骑手正在配送中，请您优先联系商家协商能否退款。',
                                    '如协商一致，请点击下方"我的外卖订单"按钮，进入订单后，点击"申请退款",待商家同意后即可退款成功。',
                                    '款项将退回至您的原支付方，1-7个工作日到账，请您注意查收。'
                                ],
                                btnText: '我的外卖订单',
                                btnType: 'btnA'
                            },
                            {
                                title: '外卖订单退款了，怎么还没到账？',
                                intervalParagraph: [
                                    '退款会在1-7个工作日退还至您的原支付方，请耐心等待。',
                                    '若超时未到账，请点击下方"我的外卖订单"按钮，选择具体订单，进入后点击"退款进度"查看退款详情即可。'
                                ],
                                btnText: '我的外卖订单',
                                btnType: 'btnA'
                            },
                            {
                                title: '为什么有些用户可以使用支付宝，有些用户却不能？',
                                paragraph: [
                                    '每个用户看到的支付方式，是根据用户支付习惯进行的综合排序，并优化推荐使用率高的支付方式。',
                                    '基于推荐的付款方式，用户可以自助选择任一方式（微信，美团支付等）进行支付。',
                                    '另外，美团点评将持续优化推荐的精准度，为用户提供便捷的支付方式。'
                                ]
                            },
                            {
                                title: '配送超时了，如何催单?',
                                paragraph: [
                                    '您可点击订单详情页中的"催单"按钮，或点击订单详情页显示的商家或骑手电话图标，致电催单。'
                                ]
                            },
                            {
                                title: '活动折扣值计算说明',
                                paragraph: [
                                    '折扣值=优惠价/门市价。折扣显示存在四舍五入后约值情况。'
                                ]
                            },
                            {
                                title: '没有找到相关问题',
                                btnType: 'btnC'
                            }
                        ]
                    },
                    {
                        headerTitle: '到店餐饮（非外卖）',
                        content: [
                            {
                                title: '如何申请退款',
                                paragraph:[
                                    '点击下方"查看待使用订单"按钮，点击您需要退款的订单，进入后选择"申请退款"即可。退款会在1-7个工作日原路退回到您的支付账户（第三方优惠码退款到原支付为3-10个工作日）'
                                ],
                                btnText: '待使用订单',
                                btnType: 'btnA'
                            },
                            {
                                title: '美食订单退款后，怎么还没到账？',
                                paragraph: [
                                    '退款会在1-7个工作日原路退回到您的支付账户。',
                                    '您可点击下面："退款/售后"按钮，选择已经退款的订单，再点选"查看退款详情"，即可查询退款进度；若退款中，建议您耐心等待；',
                                    '若退款已完成，建议您可在原支付账户中查询账单详情。'
                                ],
                                btnText: '退款/售后',
                                btnType: 'btnA'
                            },
                            {
                                title: '退款失败/提现失败/收到失败短信怎么办？',
                                paragraph: [
                                    '请点击下方"退款/售后"，找到退款失败订单，点击"查看退款详情"，重新申请退款到指定账户。'
                                ],
                                btnText: '退款/售后',
                                btnType: 'btnA'
                            },
                            {
                                title: '没有找到相关问题？',
                                btnType: 'btnB'
                            }
                        ]
                    },
                    {
                        headerTitle: '您是商家',
                        content: [
                            {
                                title: '怎么入驻美团？',
                                paragraph: [
                                    '您好，如您要合作，请点击下方"我要合作"按钮，选择您要合作的业务，按照提示操作即可。'
                                ],
                                btnText: '我要合作',
                                btnType: 'btnA'
                            },
                            {
                                title: '餐饮商家问题',
                                paragraph: [
                                    '餐饮非外卖商家问题咨询，您可以点击"餐饮商家客服"，联系客服解答您的问题'
                                ],
                                btnText: '餐饮商家客服',
                                btnType: 'btnA'
                            },
                            {
                                title: '外卖商家问题',
                                paragraph: [
                                    '外卖商家问题咨询，您可点击"外卖商家客服"按钮联系客服为您解答'
                                ],
                                btnText: '外卖商家客服',
                                btnType: 'btnA'
                            },
                            {
                                title: '非餐饮商家问题',
                                paragraph: [
                                    '休闲娱乐，丽人，KTV,教育培训，结婚，亲子，家装等商家问题，您可以点击"到综商家客服"按钮，联系客服为您解答'
                                ],
                                btnText: '到综商家客服',
                                btnType: 'btnA'
                            },
                            {
                                title: '酒店商家问题',
                                paragraph: [
                                    '酒店商家问题咨询，您可点击【酒店商家客服】按钮，联系客服为您解决。'
                                ],
                                btnText: '酒店商家客服',
                                btnType: 'btnA'
                            },
                            {
                                title: '旅游商家问题',
                                paragraph: [
                                    '旅游商家需要您联系电话 4006601065 进行咨询。'
                                ]
                            },
                            {
                                title: '餐饮平台廉正举报',
                                paragraph: [
                                    '餐饮商家举报美团员工收受贿赂，吃拿卡要问题，请发发送邮件至 jubao.canyin@aftdc.com'
                                ]
                            }
                        ]
                    }
                ]
            }
        },
        components: {WxcMinibar,WxcButton},
        created(){
            var that=this
            if(weex.config.param){
                var index  = weex.config.param;
                that.page=index
            }


        },
        methods: {
            minibarRightButtonClick(){

            },
            //返回上一页
            backClick(){
                navigator.pop({ animated: 'true' });
            },
            wxcButtonClicked(index){
                let page = this.page
                if((page==1&&index==3)||(page==2&&index==4)||(page==3&&index==3)||index=='onlineService'||(page==5&&index==3)||(page==6&&index==1)|(page==6&&index==2)|(page==6&&index==3)|(page==6&&index==4)){ //跳转到在线客服
                    console.log('在线客服')
                }else if((page==1&&index==0)||(page==3&&index==0)){ //跳转到换绑手机号
                    console.log('换绑手机号')
                }else if((page==4&&index==3)||(page==4&&index==4)){ //跳转到我的外面订单
                    console.log('我的外卖订单')
                }else if((page==5&&index==1)||(page==5&&index==2)){ //跳转到退款/售后
                    console.log('退款/售后')
                }else if(index=='dialing'){ //跳转调用安卓拨号功能
                    console.log('拨打电话')
                }else if(page==5&&index==0){ //跳转到代用订单
                    console.log('代用订单')
                }else if(page==6&&index==0){ //跳转到我要合作
                    console.log('我要合作')
                }
            }
        }

    }
</script>

<style scoped>
    .wrap {
        background-color: #f0f0f0;
    }
    .row {
        flex-direction: row;
    }
    .jcCenter {
        justify-content: center;
    }
    .aiCenter {
        align-items: center;
    }
    .taCenter {
        text-align: center;
    }
    .problemItem {
        background-color: #fff;
        border-top-width: 1px;
        border-top-style: solid;
        border-top-color: #dddddd;
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: #dddddd;
        padding-left: 30px;
        padding-right: 30px;
        padding-bottom: 40px;
        margin-bottom: 40px;
    }
    .head {
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #e5e5e5;
        padding-top: 28px;
        padding-bottom: 28px;
        line-height: 46px;
    }
    .headText {
        color: #535353;
        font-weight: bold;

    }
    .main {
        margin-top: 28px;
    }
    .content {
        /*padding-top: 36px;*/
        /*padding-bottom: 40x;*/
    }
    .contentText {
        color: #7c7c7c;
        line-height: 42px;
        /*margin-top: 36px;*/
    }
    .btnBox {
        padding-top: 28px;
    }
    .btn {

    }
    .btn:active {
        background-color: #f1f1f1;
    }
    .double {
        justify-content: space-between;
    }
    .btnStyleDouble {
        width: 335px;
        height: 88px;
        backgroundCoor :#fff;
        borderWidth: 1px;
        borderStyle: solid;
        borderColor: #666;
        border-radius: 12px;
    }
    .btnTextDouble {
        font-size: 30px;
        color: #666;
    }
    .phoneIcon {
        width: 40px;
        height: 40px;
        margin-right: 30px;
        opacity: 0.7;
    }
    .customerServiceIcon {
        width: 46px;
        height: 43px;
        margin-right: 24px;
    }
    .mb14 {
        margin-bottom: 14px;
    }
    .mb28 {
        margin-bottom: 28px;
    }
    .pt12 {
        padding-top: 12px;
    }
    .flex1 {
        flex: 1;
        lines: 1;
        text-overflow: ellipsis;
    }
</style>
