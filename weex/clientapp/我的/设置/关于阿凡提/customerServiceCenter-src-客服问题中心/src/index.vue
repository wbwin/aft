<template>
    <div class="wrap">
        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="backClick"
                    @wxcMinibarRightButtonClicked="minibarRightButtonClick"
                    v-once>
                <image :style="GLOBAL.headerImg" slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter" slot="middle">客服中心</text>
                <text :style="GLOBAL.headerRight" slot="right"></text>
            </wxc-minibar>
        </div>
        <scroller>
            <div class="category">
                <text :style="{fontSize:GLOBAL.bigFS,color:'#999'}">常见问题</text>
            </div>
            <div class="problem click" v-for="(item,index) in commonProblemText" @click="toProblemSolvingPage(index)">
                <div style="flex-direction: row;align-items: center">
                    <image class="picture" src="https://image.aftdc.com/appBimg/icon_problem_bill.jpg"
                           v-if="index == 0"></image>
                    <image class="picture" src="https://image.aftdc.com/appBimg/icon_problem_evaluation.jpg"
                           v-else-if="index == 1"></image>
                    <image class="picture" src="https://image.aftdc.com/appBimg/icon_problem_user.jpg"
                           v-else-if="index == 2"></image>
                    <image class="picture" src="https://image.aftdc.com/appBimg/icon_problem_question.jpg"
                           v-else></image>
                    <text class="question" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{ item }}</text>
                </div>
                <wxc-icon name="more" :style="{color:'#a8a8a8',fontSize:'44px'}"></wxc-icon>
            </div>
            <div class="category">
                <text :style="{fontSize:GLOBAL.bigFS,color:'#999'}">更多问题分类</text>
            </div>
            <div class="case">
                <div class="caseItem click jcCenter" @click="toProblemSolvingPage(index+4)" v-for="(item,index) in problemClassText">
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.title}}</text>
                    <text class="wTis" :style="{fontSize:GLOBAL.smallFS,color:'#999'}">{{item.content}}</text>
                </div>
                <div class="caseItemFill jcCenter" v-if="problemClassText.length%2!==0"></div>
            </div>

            <div class="feedback click" @click="toFeedBack">
                <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">意见反馈</text>
                <div class="feedbackRight">
                    <text class="feedbackRightText" :style="{fontSize:GLOBAL.smallFS}">让我们更好</text>
                    <wxc-icon name="more" :style="{color:'#a8a8a8',fontSize:'44px'}"></wxc-icon>
                </div>
            </div>
        </scroller>
    </div>
</template>
<script>
    import {WxcIcon,WxcMinibar} from 'weex-ui'
    const navigator = weex.requireModule('navigator');
const event=weex.requireModule('event')
    export default {
        name: 'App',
        data() {
            return {
                commonProblemText: [
                    '用户退款，怎么处理？',
                    '账户（登录、密码）',
                    '评价相关（评价、积分）',
                    '解换绑（手机号、银行卡解换绑）'
                ],
                problemClassText: [
                    {title:'外卖',content:'退款到账'},
                    {title:'到点餐饮（非外卖）',content:'退款到账、美团劵密码'},
                    {title:'您是商家',content:'商家问题点这里'}
                ]
            }
        },
        components: {WxcIcon,WxcMinibar},
        methods: {
            minibarRightButtonClick(){

            },
            //返回上一页
            backClick(){
                navigator.pop({ animated: 'true' });
            },
            toProblemSolvingPage(index){//问题页面跳转
                var param=index
                var url='http://assets/problemSolvingPage.js'
                event.toUrl({"url":url,"param":param})
            },
            toFeedBack(){
                var param=''
                var url='http://assets/feedBack.js'
                event.toUrl({"url":url,"param":param})
            }

        }
    }
</script>

<style scoped>
    .wrap {
        background-color: #f0f0f0;
    }
    .jcCenter {
        justify-content: center;
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
        color: #a6a6a6;
        margin-right: 20px;
    }
    .click:active {
        background-color: #f8f8f8;
    }
</style>
