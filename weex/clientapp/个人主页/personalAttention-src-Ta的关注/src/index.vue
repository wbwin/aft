<template>
    <div class="TAfollow">

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
                <text :style="GLOBAL.headerCenter"  slot="middle">TA的关注</text>
            </wxc-minibar>
        </div>

        <!--全部主题-->
        <scroller style="flex: 1;width: 750px;">
            <div class="follow row" v-for="(item,index) in themeList" @click="toPersonalHomePage" :key="index">
                <div class="followIconDiv">
                    <div style="border-radius: 50px">
                    <image class="followTcon" :src="item.image"></image>
                    </div>
                    <div style="border-radius: 20px;position:absolute;right: 16px;bottom: 16px;">
                    <image class="followSmallIcon" v-if="item.icon!=''" :src="item.icon"></image>
                    </div>
                </div>
                <div class="followContent">
                    <text class="followText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.name}}</text>
                    <text class="followDetails" :style="{fontSize:GLOBAL.smallFS}">{{item.details}}</text>
                </div>
                <text class="attention" @click="attentionClick(index)" :style="{fontSize:GLOBAL.smallFS,borderColor:item.attention?GLOBAL.tColor:'#f75959',backgroundColor:item.attention?GLOBAL.tColor:'#f75959'}">{{item.attention?'已关注':'关注'}}</text>
            </div>
            <text class="noMore" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">暂无更多内容</text>
        </scroller>
    </div>
</template>

<script>

    const navigator = weex.requireModule('navigator');
    const event = weex.requireModule('event');
    const modal = weex.requireModule('modal');
    const animation = weex.requireModule('animation');
    import {WxcIcon,WxcCity,WxcPopover,WxcPopup,WxcMask,WxcMinibar } from 'weex-ui'
    // import { RETURN_ICON, SCAN_ICON, QRCODE_ICON, QUESTION_ICON } from './type';
    // import sourceData from './data';城市外部文件调用，直接引入data.js更改
    const dom = weex.requireModule('dom')
    export default {
        components: {WxcIcon,WxcCity,WxcPopover,WxcPopup,WxcMask,WxcMinibar  },
        name: 'App',
        data() {
            return {
                themeList:[
                    {image:'https://image.aftdc.com/images/packageA/shopImg2.jpg',icon:'https://image.aftdc.com/images/daV.png',name:'环球网',details:'环球网官方账号',attention:false},
                    {image:'https://image.aftdc.com/images/packageA/shopImg2.jpg',icon:'https://image.aftdc.com/images/daV.png',name:'新华社',details:'环球网官方账号',attention:false},
                    {image:'https://image.aftdc.com/images/packageA/shopImg2.jpg',icon:'',name:'花千骨',details:'环球网官方账号',attention:false},
                    {image:'https://image.aftdc.com/images/packageA/shopImg2.jpg',icon:'https://image.aftdc.com/images/daV.png',name:'白子画',details:'环球网官方账号',attention:false},
                    {image:'https://image.aftdc.com/images/packageA/shopImg2.jpg',icon:'https://image.aftdc.com/images/daV.png',name:'东方彧卿',details:'环球网官方账号',attention:false},
                    {image:'https://image.aftdc.com/images/packageA/shopImg2.jpg',icon:'https://image.aftdc.com/images/daV.png',name:'糖宝',details:'环球网官方账号',attention:false},
                    {image:'https://image.aftdc.com/images/packageA/shopImg2.jpg',icon:'https://image.aftdc.com/images/daV.png',name:'杀阡陌',details:'环球网官方账号',attention:false},
                ],}
        },
        created() {

        },
        mounted () {
        },
        methods: {
            minibarLeftButtonClick(){},
            attentionClick(index){
                if(this.themeList[index].attention){
                    this.themeList[index].attention=false;
                }
                else{
                    this.themeList[index].attention=true;
                }
            },
            toPersonalHomePage(){
                var param='';
                var url='http://assets/personalHomePage.js';
                event.toUrl({"url":url,"param":param})
            },
        },
    }
</script>

<style scoped>
    .noMore{
        padding-top: 25px;
        padding-bottom: 25px;
        text-align: center;
    }
    .attention{
        color: #fff;
        width: 110px;
        height: 55px;
        text-align: center;
        line-height: 55px;
        border-style: solid;
        border-width: 2px;
        border-radius: 10px;
    }
    .followDetails{
        margin-top: 15px;
        color: #999;
    }
    .followContent{
        margin-left: 20px;
        flex: 1;
    }
    .followSmallIcon{

        width: 35px;
        height: 35px;

        border-radius: 20px;
    }
    .followTcon{
        width: 100px;
        height: 100px;
        border-radius: 50px;
    }
    .followIconDiv{
        width: 120px;
        height: 120px;
        border-radius: 70px;
        align-items: center;
        justify-content: center;
        /*background-color: greenyellow;*/
    }
    .follow{
        padding-top: 15px;
        padding-bottom: 15px;
        margin-left: 25px;
        margin-right: 25px;
        border-bottom-style: solid;
        border-bottom-width: 2px;
        border-bottom-color: #f8f8f8;
    }
    .minibar {
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: #f1f1f1;
    }
    .row{
        flex-direction: row;
        align-items: center;
    }
</style>