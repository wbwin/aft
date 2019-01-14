<template>
    <div class="wrapper">
        <!-- 导航栏 -->

        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    v-once
            >
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">帮助中心</text>
            </wxc-minibar>
        </div>

        <div class="header row aiCenter">
            <div class="headerLeft">
                <image class="headImg" src="https://image.aftdc.com/images/maolv.png"></image>
            </div>
            <div class="headerMiddle">
                <text class="white headerMiddleTitle" :style="{fontSize:GLOBAL.bigFS}">Hi,我是客服小毛驴</text>
                <text class="white infoText" :style="{fontSize:GLOBAL.defaultFS}">选择你遇到的问题，可以为您提供快捷的服务哦！</text>
            </div>
            <div class="headerRight">
                <image class="clockImg" src="https://image.aftdc.com/images/tixin.png"></image>
            </div>
        </div>
        <scroller class="scroller" show-scrollbar="false">
            <!-- 问题 -->
            <div class="content aiCenter">
                <slider class="slider" infinite="false" @change="sliderIndexChange">
                    <div class="box aiCenter " v-for="(item,index) in problems" :key="index">
                        <div class="sliderContent" >
                            <div class="problemTitle jcCenter">
                                <text class="gray" :style="{fontSize:GLOBAL.defaultFS,fontWeight:'bold'}">{{ item.title }}</text>
                            </div>
                            <div class="problemItem row aiCenter" v-for="(itemI,indexI) in item.problem" :class="[indexI==0?'w580':'']" @click="toDetailsOfBusinessProblems(index,indexI,itemI.id)">
                                <text class="gray" :style="{fontSize:GLOBAL.defaultFS}">{{itemI.text}}</text>
                                <image class="arrowIcon " src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png" :class="[indexI==0?'mr40':'']"></image>
                            </div>
                        </div>
                    </div>
                </slider>
                <div class="index row">
                    <div class="showIndex" :class="[sliderIndex == 0?'showIndexActive':'']"></div>
                    <div class="showIndex" :class="[sliderIndex == 1?'showIndexActive':'']"></div>
                    <div class="showIndex" :class="[sliderIndex == 2?'showIndexActive':'']"></div>
                </div>
            </div>
            <!-- 联系客服 -->
            <!--<div class="aiCenter">-->
            <!--<div class="footer">-->
            <!--<text class="footerTitle gray" :style="{fontSize:GLOBAL.defaultFS}">自助服务</text>-->
            <!--<div class="footerBtn row">-->
            <!--<div class="footerBtnItem aiCenter ml120">-->
            <!--<image class="footerBtnItemIcon" src="https://image.aftdc.com/images/xzkf.png"></image>-->
            <!--<text class="gray" :style="{fontSize:GLOBAL.smallFS,marginTop:'10px'}">在线客服</text>-->
            <!--</div>-->
            <!--<div class="footerBtnItem aiCenter mr120">-->
            <!--<image class="footerBtnItemIcon" src="https://image.aftdc.com/images/lxsj.png"></image>-->
            <!--<text class="gray" :style="{fontSize:GLOBAL.smallFS,marginTop:'10px'}">联系商家</text>-->
            <!--</div>-->
            <!--</div>-->
            <!--</div>-->
            <!--</div>-->
        </scroller>
    </div>
</template>

<script>

    const modal = weex.requireModule('modal');
    const event=weex.requireModule('event');
    import { WxcMinibar} from 'weex-ui';
    export default {
        components:{WxcMinibar},
        data () {
            return {
                sliderIndex: 0,
                problems: [
                    {
                        title: "你可能遇到以下的问题1",
                        problem: [
                            {text:"菜品太少",id:0},
                            {text:"菜品送错",id:1},
                            {text:"我想申请退款",id:2},
                            {text:"菜品问题导致身体不适",id:3},
                            {text:"我要补开发票",id:4},
                            {text:"餐未到却显示已送达",id:5},
                        ]
                    },
                    {
                        title: "你可能遇到以下的问题2",
                        problem: [
                            {text:"菜品质量问题",id:6},
                            {text:"菜品没有餐具",id:7},
                            {text:"如何修改评价",id:8},
                            {text:"如何删除评价",id:9},
                            {text:"菜品量太少",id:10},
                            {text:"联系不到商家",id:11},
                        ]
                    },
                    {
                        title: "你可能遇到以下的问题3",
                        problem: [
                            {text:"菜品送错了",id:12},
                            {text:"如何评价",id:13},
                        ]
                    }
                ]
            }
        },

        methods: {
            minibarLeftButtonClick(){
                navigator.pop({animated:'false'});
            },
            sliderIndexChange(e){
                this.sliderIndex = e.index
            },
            toDetailsOfBusinessProblems(index,indexI,id){
                var that=this;

                var param=JSON.stringify({
                    title:that.problems[index].problem[indexI].text,
                    id:id,
                });

                var url='http://assets/detailsOfBusinessProblems.js'
                event.toUrl({"url":url,"param":param})
            }

        },
        created(){
            event.init();
        },
    }
</script>

<style scoped>
    .wrapper {
        flex-direction: column;
        /*padding-bottom: 38px;*/
    }
    .minibar {
        /*border-bottom-width: 2px;*/
        /*border-bottom-style: solid;*/
        /*border-bottom-color: #a1a1a1;*/
    }
    .backImg{
        width: 40px;
        height: 40px;
    }
    /* 公共样式 */
    .row {
        flex-direction: row;
    }
    .aiCenter {
        align-items: center;
    }
    .jcCenter {
        justify-content: center;
    }
    .white {
        color: #fff;
    }
    .gray {
        color: #999;
    }
    /* 头部 */
    .header {

        background-color: #53beb7;
        justify-content: space-between;
        padding-top: 20px;
        padding-bottom: 20px;
    }
    .headerLeft {
        width: 80px;
        height: 80px;
        border-radius: 40px;
        margin-left: 22px;
    }
    .headImg {
        width: 80px;
        height: 80px;
        border-radius: 40px;

    }
    .headerMiddle {
        width: 520px;
    }
    .headerMiddleTitle {
        line-height: 50px;
    }
    .infoText {
        line-height: 50px;
    }
    .headerRight {
        width: 50px;
        height: 50px;
        margin-right: 22px;
    }
    .clockImg {
        width: 50px;
        height: 50px;

    }
    /* 中间部分 */
    .content {
        margin-top: 18px;
    }
    .slider {
        width: 750px;
        height: 640px;
    }
    .box {
        width: 750px;
    }
    .sliderContent {
        width: 640px;
        padding-left: 30px;
        border-width: 2px;
        border-style: solid;
        border-color: #e3e3e3;
    }
    .problemTitle {
        width: 540px;
        height: 90px;
    }
    .problemItem {
        width: 540px;
        height: 90px;
        border-top-width: 2px;
        border-top-style: solid;
        border-top-color: #e3e3e3;
        justify-content: space-between;
    }
    .arrowIcon {
        width: 20px;
        height: 20px;
    }
    .w580 {
        width: 580px;
    }
    .mr40 {
        margin-right: 40px;
    }
    .index {
        margin-top: 18px;
        margin-bottom: 18px;
    }
    .showIndex {
        width: 17px;
        height: 17px;
        background-color: #999;
        border-radius: 10px;
        margin-left: 8px;
        margin-right: 8px;
    }
    .showIndexActive {
        background-color: #666;
    }
    /* 页脚部分 */
    .footer {
        width: 640px;
        border-width: 2px;
        border-style: solid;
        border-color: #e3e3e3;
        padding-top: 20px;
        padding-bottom: 32px;
        margin-bottom: 38px;
    }
    .footerTitle {
        margin-left: 25px;
    }
    .footerBtn {
        justify-content: space-between;
        margin-top: 26px;
    }
    .footerBtnItem {
        width: 120px;
    }
    .footerBtnItemIcon {
        width: 70px;
        height: 70px;
    }
    .mr120 {
        margin-right: 120px;
    }
    .ml120 {
        margin-left: 120px;
    }
    .scroller{

    }

</style>

