<template>
    <div class="inspect">

        <!--头部-->
        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    v-once
            >
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">商家体检</text>
            </wxc-minibar>
        </div>
        <scroller class="scroller">


            <!--体检分数表-->
            <div class="inspectResult row">

                <div class="inspectResultLeft">
                    <text class="inspectResultDiv" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">最近7天的体检结果</text>
                    <div class="row" style="margin-top: 5px;">
                        <text :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">共体检了</text>
                        <text :style="{fontSize:GLOBAL.smallFS,color:'#FF8C00'}">8</text>
                        <text :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">项</text>
                    </div>
                    <div class="row" style="margin-top: 5px;">
                        <text :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">其中有</text>
                        <text :style="{fontSize:GLOBAL.smallFS,color:'#FF8C00'}">5</text>
                        <text :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">项存在问题</text>
                    </div>
                    <div class="row" style="margin-top: 5px;">
                        <text :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">建议立即优化</text>
                    </div>
                </div>

                <div class="inspectResultRight">
                    <div class="inspectResultGarden">
                        <image class="inspectResultIcon" src="http://www.aftdc.com/static/image/mobile/loading2.png"></image>
                        <image class="inspectResultIconTwo" src="http://www.aftdc.com/static/image/mobile/loading1.png"></image>
                        <div class="inspectFraction">
                            <text :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">75分</text>
                        </div>
                    </div>
                </div>

            </div>

            <!--更新时间-->
            <text class="upData" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">更新时间: 2018-01-10</text>

            <!--问题项-->

            <div class="panel">

                <div class="panelOne row">
                    <image class="panelIcon" src="https://www.aftdc.com/static/image/mobile/business.png"></image>
                    <text class="panelText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">问题项(5)</text>
                </div>
                <div class="panelOne row">
                    <image class="panelIcon" src="https://www.aftdc.com/static/image/mobile/business.png"></image>
                    <text class="panelText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">问题项(5)</text>
                    <div class="panelTextTwoDIv">
                        <text class="panelTextTwo" :style="{fontSize:GLOBAL.smallerFS}">服务能力</text>
                    </div>
                    <image class="moreIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                </div>
                <div class="panelOne row">
                    <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor,marginLeft:'30px'}">影响店铺口碑</text>
                </div>

            </div>

            <!--无问题项-->

            <div class="panelTwo">

                <div class="panelOne row">
                    <image class="panelIcon" src="https://www.aftdc.com/static/image/mobile/business.png"></image>
                    <text class="panelText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">无问题项(5)</text>
                </div>
                <div class="panelOne row">
                    <image class="panelIcon" src="https://www.aftdc.com/static/image/mobile/business.png"></image>
                    <text class="panelText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">顾客催单偏高</text>
                </div>

            </div>
            
        </scroller>



    </div>
</template>

<script>
    import {WxcPopup, WxcMask, WxcIcon, WxcMinibar, WxcPopover} from 'weex-ui';

    const modal = weex.requireModule('modal');
    const event = weex.requireModule('event');
    const post = weex.requireModule('stream');

    export default {
        components: {WxcPopup, WxcMask, WxcIcon, WxcMinibar, WxcPopover},
        data() {

            return {

            }
        },
        methods:{

            back(){
                history.back();
            },
            minibarLeftButtonClick(){},
        },
    }
</script>


<style scoped>
    .inspect{
        background-color: #f8f8f8;
    }
    .row {
        flex-direction: row;
        align-items: center;
    }
    .scroller{
        flex: 1;
        width: 750px;
    }

    .inspectResult{
        background-color: #fff;
        padding-top: 25px;
        padding-bottom: 25px;
        padding-left: 30px;
        padding-right: 30px;
    }
    .inspectResultLeft{
        flex: 1;
    }
    .inspectResultDiv{
        margin-top: 20px;
        padding-bottom: 20px;
    }
    .inspectResultRight{
        width: 180px;
        height: 180px;
        border-style: solid;
        border-width: 10px;
        border-color: #53beb7;
        border-radius: 100px;
        justify-content: center;
        align-items: center;
    }
    .inspectResultGarden{
        width: 140px;
        height: 140px;
        border-style: solid;
        border-width: 1px;
        border-color: #53beb7;
        border-radius: 100px;
        position: relative;
        overflow: hidden;
    }
    .inspectResultIcon{
        width: 300px;
        height: 300px;
        right: 0;
        top: 30px;
        position: absolute;

    }
    .inspectResultIconTwo{
        width: 500px;
        height: 500px;
        left: -220px;
        top: 20px;
        position: absolute;
    }

    .inspectFraction{
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        justify-content: center;
        align-items: center;
    }

    .upData{
        padding-top: 20px;
        padding-bottom: 20px;
        padding-left: 25px;
        padding-right: 25px;
    }

    .panel{
        padding-left: 30px;
        padding-right: 30px;
        padding-bottom: 25px;
        background-color: #fff;
    }
    .panelOne{
        margin-top: 25px;
    }
    .panelIcon{
        width: 20px;
        height: 20px;
    }
    .panelText{
        margin-left: 10px;
    }
    .panelTextTwo{
        margin-left: 20px;
        color: #FF8C00;
        border-style: solid;
        border-width: 1px;
        border-color: #FF8C00;
        text-align: center;
        height: 28px;
        line-height: 28px;
        width: 90px;
        border-radius: 3px;
    }
    .panelTextTwoDIv{
        flex: 1;
    }
    .moreIcon{
        width: 20px;
        height: 20px;
    }
    .panelTwo{
        padding-left: 30px;
        padding-right: 30px;
        padding-bottom: 25px;
        background-color: #fff;
        margin-top: 20px;
    }
</style>


