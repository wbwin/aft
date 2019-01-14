<template>
    <div class="securityCenter">
        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    v-once
            >
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">安全中心</text>
                <text :style="GLOBAL.headerRight"  slot="right"></text>
            </wxc-minibar>
        </div>
        <!--<div class="top row">-->
        <!--<text style="flex: 1;color: #999;" :style="{fontSize:GLOBAL.defaultFS}">账户安全</text>-->
        <!--<text style="margin-right: 10px;color: #999;" :style="{fontSize:GLOBAL.defaultFS}">风险等级</text>-->
        <!--<text class="garden" :style="{fontSize:GLOBAL.defaultFS}">中</text>-->
        <!--</div>-->

        <div class="personalInfo">
            <div class="setDiv" @click="toLogonRecord">
                <text class="setDivText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">最近登录记录</text>
                <image class="setDivIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
            </div>
            <div class="setDiv" @click="toContactCustomerService">
                <text class="setDivText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">账号相关答疑</text>
                <image class="setDivIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
            </div>
            <div class="setDiv" @click="toCancellation">
                <text class="setDivText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">注销账号</text>
                <text class="phone" :style="{fontSize:GLOBAL.smallFS}">注销后无法恢复,请谨慎操作</text>
                <image class="setDivIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
            </div>
        </div>

    </div>
</template>

<script>
    import { WxcMask} from 'weex-ui';
    import {WxcMinibar, WxcPopup} from 'weex-ui';
    import Toast from './Toast.vue'
    const event=weex.requireModule('event')
    const navigator = weex.requireModule('navigator');
    export default {

        components: {WxcMinibar, Toast, WxcPopup,WxcMask},
        data() {
            return{

            }
        },
        methods:{

            minibarLeftButtonClick(){
                navigator.pop({ animated: 'true' });
            },

            toLogonRecord(){
                var param=''
                var url='http://assets/logonRecord.js'
                event.toUrl({"url":url,"param":param})
            },
            toContactCustomerService(){
                var param=''
                var url='http://assets/contactCustomerService.js'
                event.toUrl({"url":url,"param":param})
            },
            toCancellation(){
                var param=''
                var url='http://assets/cancellation.js'
                event.toUrl({"url":url,"param":param})
            },
        },
    }
</script>

<style scoped>
    .top{
        padding-top: 40px;
        padding-bottom: 20px;
        padding-left: 20px;
        padding-right: 20px;
    }
    .garden{
        color: orangered;
    }
    .phone{
        margin-right: 30px;
        color: #999;
    }
    .setDivIcon{
        width: 20px;
        height: 20px;
    }
    .setDivText{
        flex: 1;
    }
    .setDiv{
        background-color: #fff;
        margin-bottom: 2px;
        flex-direction: row;
        align-items: center;
        padding-top: 30px;
        padding-bottom: 30px;
        padding-left: 20px;
        padding-right: 20px;
    }
    .personalInfo{
    }
    .securityCenter{
        background-color: #f8f8f8;
    }
    /*默认样式*/
    .row{
        flex-direction: row;
        align-items: center;
    }
</style>
