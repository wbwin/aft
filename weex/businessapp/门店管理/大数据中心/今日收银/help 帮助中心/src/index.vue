<template>
    <div class="wrap">
        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    :use-default-return="defaultReturn"
                    @wxcMinibarLeftButtonClicked="backClick"
                    @wxcMinibarRightButtonClicked="minibarRightButtonClick">
                <image class="flex1" :style="GLOBAL.headerImg" slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text class="flex1 headerCenter" :style="GLOBAL.headerCenter" slot="middle">{{headerTitle}}</text>
                <text class="flex1" :style="GLOBAL.headerRight" slot="right"></text>
            </wxc-minibar>
        </div>
        <!-- 包裹 -->
        <div class="bigBox" :style="{left: move * -750 + 'px'}">
            <!-- 第一个页面（友情提醒） -->
            <scroller class="scroller">
                <div class="category">
                    <text :style="{fontSize:GLOBAL.bigFS,color:'#999'}">常见问题</text>
                </div>
                <div class="problem click" v-for="(item,index) in commonProblemText" @click="commonProblem(index)">
                    <div style="flex-direction: row;align-items: center">
                        <image class="picture" src="https://image.aftdc.com/appBimg/icon_problem_question.jpg"
                               v-if="index == 0"></image>
                        <image class="picture" src="https://image.aftdc.com/appBimg/icon_problem_user.jpg"
                               v-else-if="index == 1"></image>
                        <image class="picture" src="https://image.aftdc.com/appBimg/icon_problem_evaluation.jpg"
                               v-else-if="index == 2"></image>
                        <image class="picture" src="https://image.aftdc.com/appBimg/icon_problem_bill.jpg"
                               v-else></image>
                        <text class="question" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{ item }}</text>
                    </div>
                    <wxc-icon name="more" :style="{color:'#a8a8a8',fontSize:'44px'}"></wxc-icon>
                </div>
                <div class="category">
                    <text :style="{fontSize:GLOBAL.bigFS,color:'#999'}">更多问题分类</text>
                </div>
                <div class="case">
                    <div class="caseItem click jcCenter" @click="commonProblem(index+4)" v-for="(item,index) in problemClassText">
                        <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.title}}</text>
                        <text class="wTis">{{item.content}}</text>
                    </div>
                    <div class="caseItemFill jcCenter" v-if="problemClassText.length%2!==0"></div>
                </div>

                <div class="category">
                    <text :style="{fontSize:GLOBAL.bigFS,color:'#999'}">没找到相关问题？</text>
                </div>
                <div class="problemItem" style="padding-left: 50px;padding-right: 50px;">
                    <div class="main">
                        <div class="double row pt12">
                            <div class="btnStyleDouble btn row aiCenter jcCenter" @click="wxcButtonClicked('dialing')">
                                <image class="phoneIcon"
                                       src="https://image.aftdc.com/appBimg/ic_phone_black.png"></image>
                                <text class="btnTextDouble">拨打电话</text>
                            </div>
                        </div>
                    </div>
                </div>
                <!--<div class="feedback click" @click="feedback">-->
                    <!--<text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">意见反馈</text>-->
                    <!--<div class="feedbackRight">-->
                        <!--<text class="feedbackRightText">让我们更好</text>-->
                        <!--<wxc-icon name="more" :style="{color:'#a8a8a8',fontSize:'44px'}"></wxc-icon>-->
                    <!--</div>-->
                <!--</div>-->
            </scroller>
            <!-- 第二个页面 （解决问题） -->
            <scroller class="scroller">
                <div class="problemItem" v-for="(item,index) in problemData[page].content">
                    <div class="head">
                        <text class="headText" :style="{fontSize:GLOBAL.bigFS}">{{item.title}}</text>
                    </div>
                    <div class="main" :class="[!item.paragraph && !item.intervalParagraph?'pt12':'']">
                        <text class="contentText" :style="{fontSize:GLOBAL.defaultFS}">{{item.aSection}}</text>
                        <text class="contentText" :style="{fontSize:GLOBAL.defaultFS}" v-for="p in item.paragraph">{{p}}</text>
                    </div>
                </div>
            </scroller>
        </div>
    </div>
</template>
<script>
    import {WxcIcon,WxcMinibar} from 'weex-ui'
    const navigator = weex.requireModule('navigator');
    const event = weex.requireModule('event');

    export default {
        name: 'App',
        data() {
            return {
                page: 0,
                move: 0,
                headerTitle: '友情提醒',
                defaultReturn:false,
                commonProblemText: [
                    '用户退款,怎么处理？',
                    '联系不到用户,怎么办？',
                    '怎么回复评价？遇到差评怎么办？',
                    '账单不对？提现多久才能到账？'
                ],
                problemClassText: [
                    {title:'门店管理',content:'修改门店信息、营业状态'},
                    {title:'财务结算问题',content:'结款查询、对账、提现'},
                    {title:'产品相关',content:'打印机'},
                    {title:'商家后台',content:'后台各项功能如何使用'},
                    {title:'投诉及建议',content:'投诉、建议'},
                    {title:'账号问题',content:'忘记密码'},
                    {title:'订单问题',content:'退单、评价'},
                    {title:'廉政举报',content:'阿凡提点餐员工举报'}
                ],
                problemData: [
                    {
                        headerTitle: '用户退款,怎么处理？',
                        content: [
                            {
                                title: '用户要退款,怎么处理',
                                aSection: '申请退款：用户有可能是因为买多了、情况有变等原因申请退款。当用户申请退款后,您会接到退单提示。这时候,您可根据具体情况选择"同意退款"或者"拒绝退款"。'
                            }
                        ]
                    },
                    {
                        headerTitle: '联系不到用户,怎么办',
                        content: [
                            {
                                title: '联系不到用户,怎么办',
                                aSection: '部分用户可能由于信号不好、或铃声过小等原因未及时接听您或骑手的电话;建议您做如下处理:给用户发送短信,请用户主动联系您,或间隔几分钟再给用户致电,主动跟用户,确认二次配送的时间。'
                            }
                        ]
                    },
                    {
                        headerTitle: '怎么回复评价?遇到差评怎么办?',
                        content: [
                            {
                                title: '怎么回复评价?遇到差评怎么办?',
                                aSection: '进入“我的”-“消息通知”-“商品评价”,选择“回复”;目前暂无修改或删除功能。建议您主动回复用户,积极沟通说明情况,以挽回用户,同时,也使其他用户看到您处理及时,提升好感。'
                            }
                        ]
                    },
                    {
                        headerTitle: '账单不对?提现多久能到账?',
                        content: [
                            {
                                title: '账单不对?提现多久能到账?',
                                aSection: '结算金额与您的记录不符时,建议您查看结款账期是否正确,然后核对明细,找出差在哪几单,核实差的订单是什么情况,并联系平台客服;提现后一股1-3个工作日到账,遇周未及节假日,到账时间顺延,可能导致“未到帐”,如您不属于此类情况,请反馈平台客服'
                            }
                        ]
                    },
                    {
                        headerTitle: '门店管理',
                        content: [
                            {
                                title: '怎么修改配送范围,起送价,配送费?',
                                aSection: '可在"门店管理"-"订单设置"进行设置;'
                            },
                            {
                                title: '怎么设置优惠活动',
                                aSection: '可在"门店管理"-"活动配置"进行设置;'
                            }
                        ]
                    },
                    {
                        headerTitle: '财务结算问题',
                        content: [
                            {
                                title: '结款钱不对,怎么办',
                                aSection: '结算金额与您的记录不符时,建议您查看结款账期是否正确,然后核对明细,找出差在哪几单,核实差的订单是什么情况,并联系平台客服'
                            },
                            {
                                title: '提现没到账怎么办?',
                                aSection: '请先核银行卡号是否正确,如卡号正确,提现后一般1-3个工作日到账,遇周末及节假日,到账时间顺延,可能导致“未到帐”,如您不属于此类情况,请反馈平台客服'
                            },
                            {
                                title: '怎么对账？',
                                aSection: '可在"门店管理"-"今日收银"进行对账'
                            },
                            {
                                title: '怎么修改结款银行卡账号?',
                                aSection: '为保障您的资金安全,需联系平台客服修改'
                            }
                        ]
                    },
                    {
                        headerTitle: '产品相关',
                        content: [
                            {
                                title: '如何设置打印机?',
                                aSection: '购买易连云打印机后查看机身底下的参数，将打印机号码和秘钥填入“我的”-“打印设置”，插上网线,开机。打票机将在1分钟之后正常打印'
                            },
                            {
                                title: '打印机不出票,怎么办?',
                                paragraph: [
                                    '1.检查网络是否能正常上网',
                                    '2.检查打票机有无打印纸',
                                    '3.如以上无问题,关机,重启'
                                ]
                            }
                        ]
                    },
                    {
                        headerTitle: '商家后台',
                        content: [
                            {
                                title: '如何提现？',
                                aSection: '可在“门店管理”-“今日收银”进行操作'
                            },
                            {
                                title: '怎么修改菜品?',
                                aSection: '可在"门店管理”-"商品管理"进行设置'
                            },
                            {
                                title: '店铺二维码在哪儿看?',
                                aSection: '可在"我的"-"右上角二维码"点击查看并保存'
                            }
                        ]
                    },
                    {
                        headerTitle: '投诉及建议',
                        content: [
                            {
                                title: '我要提建议',
                                aSection: '请将您的意见与建议写在“我的”-“意见反馈”中'
                            }
                            // ,
                            // {
                            //     title: '我要投诉业务经理',
                            //     aSection: '请将具体事例写在“我的”-“意见反馈”中'
                            // }
                        ]
                    },
                    {
                        headerTitle: '账号问题',
                        content: [
                            {
                                title: '忘记密码了,怎么办',
                                aSection: '您可通过“手机号快捷登陆”方式登陆,或在登录页面选择“忘记密码”重置密码'
                            }
                        ]
                    },
                    {
                        headerTitle: '订单问题',
                        content: [
                            {
                                title: '用户要退款,怎么处理?',
                                aSection: '申请退款:用户有可能是因为买多了、情况有变等原因申请退款,当用户申请退款后,您会接到退单提示。这时候,您可根据具体情况选 择“同意退款”或者“拒绝退款”'
                            },
                            {
                                title: '已接单了,能取消么?',
                                aSection: '如您无法出餐或已完成,需要取消,请先联系用户说明情况,与用户达成一致后,可根据订单状态做如下操作:1、餐品制作或配送中:需用户在客户端点击“取消退款”,您在后台“同意退款”;2、订单已完成:可通过微信,支付宝等方式线下给用户发红包,如用户不同意此方式,请联系平台客服处理'
                            },
                            {
                                title: '评价可以删除么?',
                                aSection: '目前无修改或删除功能,建议您主动回复用户,积极沟通说明情况,以挽回用户,同时,也使其他用户看到您处理及时,提升好感。'
                            }
                        ]
                    },
                    {
                        headerTitle: '廉政举报',
                        content: [
                            {
                                title: '受理问题范围?',
                                aSection: '仅受理阿凡提员工索贿受贿、私自开店、私自线下收费、弄虚作假等廉政舞弊问题的举报,您的反馈将由阿凡提总部直接受理,我们会对您的身份信息及举报内容严格保密。'
                            },
                            {
                                title: '反馈问题需注意事项?',
                                aSection: '描述举报内容时,应力求详尽,对违规违纪行为发生的时间,地点,主要证据,涉及人员等内容里表述明确,有证据的欢迎以照片,录音的形式一并提交给我们,请确保举报内容属实,如恶意虚假举报,公司将酌情对举报人予以处罚。'
                            },
                            {
                                title: '员工廉政舞弊问题还有没有其他的反馈途径?',
                                paragraph: [
                                    '1.发送举报邮件至 4000488817@b.qq.com',
                                    '2.加QQ235858201进行留言'
                                ]
                            },
                            {
                                title: '多长时间能得到反馈?',
                                aSection: '我们会对您反馈的信息进行判定,如果判断您反馈的信息有价值,我们会在三个工作日内和您取得联系。'
                            }
                        ]
                    }
                ]
            }
        },
        components: {WxcIcon,WxcMinibar},
        methods: {
            minibarRightButtonClick(){

            },
            //返回上一页
            backClick(){
                if (this.move === 1) {
                    this.move = 0
                    this.headerTitle = '友情提醒'
                }else
                    navigator.pop({ animated: 'true' });
            },
            commonProblem(index){//问题页面跳转
                this.move = 1
                this.page = index
                this.headerTitle = this.problemData[index].headerTitle

            },
            feedback(){

            },
            wxcButtonClicked(type){
                if(type=='dialing'){
                    event.phone(4008677791);
                }else{
                    this.move = 0
                    this.headerTitle = '友情提醒'
                }
            }
        }
    }
</script>

<style scoped>
    .wrap {
        background-color: #f0f0f0;
    }
    .headerCenter {
        text-align: center;
        lines: 1;
        text-overflow: ellipsis;
    }
    .jcCenter {
        justify-content: center;
    }
    .row {
        flex-direction: row;
    }
    .aiCenter {
        align-items: center;
    }
    .flex1 {
        flex: 1;
    }
    .bigBox {
        width: 1500px;
        flex-direction: row;
        flex: 1;
        transition: left 0.2s ease-in-out;
        /*transform: translateX(-750px);*/
    }
    .scroller {
        width: 750px;
    }
    .problem {
        position: relative;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }
    .category {
        padding: 20px;
        padding-left: 20px;
        border-bottom-style: solid;
        border-bottom-color: #dddddd;
        border-bottom-width: 1px;
    }

    .picture {
        width: 50px;
        height: 50px;
    }
    .problem {
        background-color: #fff;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        border-bottom-style: solid;
        border-bottom-color: #dddddd;
        border-bottom-width: 1px;
    }
    .question {
        margin-left: 20px;
    }
    .case {
        background-color: #fff;
        width: 750px;
        flex-direction: row;
        flex-wrap: wrap;
        border-bottom-width: 1px;
        border-bottom-color: #dddddd;
        border-bottom-style: solid;
    }
    .caseItem {
        width: 375px;
        height: 164px;
        border-right-width: 1px;
        border-right-style: solid;
        border-right-color: #dddddd;
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: #dddddd;
        padding-left: 50px;
    }
    .caseItemFill {
        width: 375px;
        height: 164px;
        border-right-width: 1px;
        border-right-style: solid;
        border-right-color: #dddddd;
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: #dddddd;
        padding-left: 50px;
    }
    .wTis {
        width: 320px;
        margin-top: 16px;
        line-height: 30px;
        font-size: 24px;
        color: #999;
    }
    .feedback {
        height: 90px;
        background-color: #fff;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding-left: 32px;
        padding-right: 20px;
        border-top-style: solid;
        border-top-color: #dddddd;
        border-top-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: #dddddd;
        border-bottom-width: 1px;
        margin-top: 40px;
    }
    .feedbackRight {
        flex-direction: row;
        align-items: center;
    }
    .feedbackRightText {
        font-size: 24px;
        color: #a6a6a6;
        margin-right: 20px;
    }
    .click:active {
        background-color: #f8f8f8;
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
    .contentText {
        color: #7c7c7c;
        line-height: 42px;
    }
    .btn:active {
        background-color: #f1f1f1;
    }
    .double {
        justify-content: space-between;
    }
    .btnStyleDouble {
        width: 650px;
        height: 88px;
        border-width: 1px;
        border-style: solid;
        border-color: #666;
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
    .pt12 {
        padding-top: 12px;
    }
</style>
