<template>
    <div class="reserveDetails">
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
                <text :style="GLOBAL.headerCenter"  slot="middle">预定详情</text>
            </wxc-minibar>
        </div>
        <scroller style="flex: 1;width: 750px;">


            <!--预定信息-->
            <div class="reserve row" @click="toCancelReserve" v-for="(item,index) in reserveList" :key="index">
                <image class="reserveImg radius" :src="item.img"></image>
                <div class="reserveContent">
                    <div class="reserveContentTitle row">
                        <text class="titleText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.name}}</text>
                        <text class="state" v-if="item.state==0" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.tColor}">待确认</text>
                        <text class="state" v-if="item.state==1" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.tColor}">已预订</text>
                        <text class="state" v-if="item.state==2" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.tColor}">已完成</text>
                        <text class="state" v-if="item.state==3" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.tColor}">已取消</text>
                    </div>
                    <text class="reserveContentTime" :style="{fontSize:GLOBAL.smallFS}">时间:{{item.time}}</text>
                    <div class="reserveContentPeopel row">
                        <text class="reserveContentNum" :style="{fontSize:GLOBAL.smallFS}">人数 {{item.number}} 人</text>
                        <text class="reserveContentHall" v-if="item.hall==0" :style="{fontSize:GLOBAL.smallFS}">大厅</text>
                        <text class="reserveContentHall" v-if="item.hall==1" :style="{fontSize:GLOBAL.smallFS}">包间</text>
                    </div>
                </div>
            </div>

        </scroller>
    </div>
</template>

<script>
    import {WxcMask, WxcMinibar, WxcPopup,WxcLightbox} from 'weex-ui';

    const animation = weex.requireModule('animation')
    const modal = weex.requireModule('modal')
    const dom = weex.requireModule('dom')
    const event=weex.requireModule('event')
    export default {
        components: {WxcMask, WxcMinibar, WxcPopup,WxcLightbox},
        name: 'App',
        data() {
            return{
                reserveList:[
                    {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg',name:'广州堡德仕',state:0,time:'2018-09-06',number:2,hall:0},
                    {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg',name:'广州堡德仕',state:1,time:'2018-09-06',number:2,hall:1},
                    {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg',name:'广州堡德仕',state:2,time:'2018-09-06',number:2,hall:1},
                    {img:'https://image.aftdc.com/images/packageA/shopImg2.jpg',name:'广州堡德仕',state:1,time:'2018-09-06',number:2,hall:1},
                ],//预定信息
            }
        },
        methods:{
            minibarLeftButtonClick(){},
            toCancelReserve(){
                var param='';
                var url='http://assets/cancelReserve.js'
                event.toUrl({"url":url,"param":param})
            },
        },
        created() {
        },
    }
</script>

<style scoped>
    /*默认*/
    .minibar {
        /*border-bottom-width: 1px;*/
        /*border-bottom-style: solid;*/
        /*border-bottom-color: #f1f1f1;*/
    }
    .row{
        flex-direction: row;
        align-items: center;
    }
    .radius{
        border-radius: 15px;
    }
    /*编辑*/

    /*预定信息*/
    .reserveContentHall{
        color: #999;
        border-left-style: solid;
        border-left-width: 2px;
        border-left-color: #e1e1e1;
        margin-left: 10px;
        padding-left: 10px;
    }
    .reserveContentNum{
        color: #999;
    }
    .reserveContentPeopel{
        margin-top: 25px;
    }
    .reserveContentTime{
        color: #999;
        margin-top: 25px;
    }
    .state{
    }
    .titleText{
        font-weight: bold;
        flex: 1;
    }
    .reserveContentTitle{
    }
    .reserveContent{
        margin-left: 20px;
        flex: 1;
    }
    .reserveImg{
        width: 150px;
        height: 150px;
    }
    .reserve{
        padding-left: 20px;
        padding-right: 20px;
        padding-top: 20px;
        padding-bottom: 20px;
        background-color: #fff;
        margin-top: 30px;
    }
    .reserveDetails{
        background-color: #f1f1f1;
    }
    /*预定信息*/
</style>
