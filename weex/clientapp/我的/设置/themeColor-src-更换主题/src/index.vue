<template>
    <div class="theme" @viewappear="viewappear">

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
                <text :style="GLOBAL.headerCenter"  slot="middle">更换主题</text>
            </wxc-minibar>
        </div>

        <!--全部主题-->
        <scroller style="flex: 1;width: 750px;">
            <text class="themeTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">全部主题</text>
            <div class="themeDiv">
                <div class="themeDivSmall" v-for="(item,index) in themeList" :key="index" @click="themeListIndexClick(index)">
                    <div class="themeColor" :style="{backgroundColor:item.backgroundColor}">
                        <text class="detailsText" :style="{fontSize:GLOBAL.smallFS}" v-if="item.details!=''">{{item.details}}</text>
                        <text class="selectText" v-if="themeListIndex==index">✓</text>
                    </div>
                    <text class="themeText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.name}}</text>
                    <text class="themeDetails" :style="{fontSize:GLOBAL.smallFS}">{{item.samllName}}</text>
                </div>
            </div>
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
                themeList: [{ backgroundColor: '#53beb7', details: '', name: '默认', samllName: '' },
                    { backgroundColor: '#ff0000', details: '', name: '赤', samllName: '' },
                    { backgroundColor: '#ff7f00', details: '', name: '橙', samllName: '' },
                    { backgroundColor: '#dada00', details: '', name: '黄', samllName: '' },
                    { backgroundColor: '#2f9833', details: '', name: '绿', samllName: '' },
                    { backgroundColor: '#0000ff', details: '', name: '蓝', samllName: '' },
                    { backgroundColor: '#8b00ff', details: '', name: '紫', samllName: '' }],
                themeListIndex:0,

            }
        },
        created() {

        },
        mounted () {},
        methods: {
            themeListIndexClick(index){
                var that=this;
                that.themeListIndex=index
                var param = that.themeList[index].backgroundColor
                event.exitChangeColor(param);
                event.save('themeColor',param);
                navigator.pop({ animated: 'true' });
            },
            minibarLeftButtonClick(){
                navigator.pop({ animated: 'true' });
            },
            viewappear(){
                var that=this;
                if(event.find('themeColor')){
                    var themeColor=event.find('themeColor')
                    if(themeColor==1){
                        that.themeListIndex=0;
                    }else{
                        for(var i in that.themeList){
                            if(that.themeList[i].backgroundColor==themeColor){
                                that.themeListIndex=i;
                                return false
                            }

                        }
                    }

                }
                // if(event.find('currentCity')){
                //
                //     that.currentCity = event.find('currentCity');
                //     event.delete('currentCity');
                // }
            },
        },
    }
</script>

<style scoped>
    .minibar {
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: #f1f1f1;
    }
    .themeDetails{
        color: #999;
        margin-top: 10px;
    }
    .themeText{
        margin-top: 15px;
    }
    .selectText{
        position: absolute;
        left: 8px;
        top: 8px;
        background-color: #53beb7;
        border-style: solid;
        border-width: 2px;
        border-color: #fff;
        color: #fff;
        border-radius: 30px;
        width: 50px;
        height: 50px;
        line-height: 50px;
        text-align: center;
    }
    .detailsText{
        width: 80px;
        height: 30px;
        text-align: center;
        line-height: 30px;
        color: #fff;
        background-color: #fe364f;
        border-style: solid;
        border-width: 2px;
        border-color: #fff;
        border-radius: 30px;
        position: absolute;
        right: 20px;
        bottom: 20px;
    }
    .themeColor{
        width: 218px;
        height: 300px;
        position: relative;
    }
    .themeDivSmall{
        margin-right: 20px;
        margin-bottom: 30px;
    }
    .themeDiv{
        flex-direction: row;
        align-items: center;
        flex-wrap: wrap;
        padding-left: 25px;


    }
    .themeTitle{
        padding-left: 25px;
        padding-top: 35px;
        padding-bottom: 30px;
        font-weight: bold;
    }
</style>