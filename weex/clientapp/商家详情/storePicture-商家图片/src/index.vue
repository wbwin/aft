<template>
    <div class="wrapper">

        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    v-once
            >
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">商家图片</text>
            </wxc-minibar>
        </div>

        <div class="albumBar">
            <div class="whole" :class="[selected==0?'select':'']" @click="selectedClick(0)">
                <text class="barTextOne" :class="[selected==0?'selectTwo':'']" :style="{fontSize:GLOBAL.defaultFS,color:selected==0?GLOBAL.tColor:GLOBAL.dColor}">菜品</text>
                <text class="barTextOne" :class="[selected==0?'selectTwo':'']" :style="{fontSize:GLOBAL.defaultFS,color:selected==0?GLOBAL.tColor:GLOBAL.dColor}"> ({{imgListOne.length}})</text>
            </div>
            <div class="whole" :class="[selected==1?'select':'']" @click="selectedClick(1)">
                <text class="barTextOne" :class="[selected==1?'selectTwo':'']" :style="{fontSize:GLOBAL.defaultFS,color:selected==1?GLOBAL.tColor:GLOBAL.dColor}">环境</text>
                <text class="barTextOne" :class="[selected==1?'selectTwo':'']" :style="{fontSize:GLOBAL.defaultFS,color:selected==1?GLOBAL.tColor:GLOBAL.dColor}"> ({{imgListTwo.length}})</text>
            </div>
            <div class="whole" :class="[selected==2?'select':'']" @click="selectedClick(2)">
                <text class="barTextOne" :class="[selected==2?'selectTwo':'']" :style="{fontSize:GLOBAL.defaultFS,color:selected==2?GLOBAL.tColor:GLOBAL.dColor}">全部</text>
                <text class="barTextOne" :class="[selected==2?'selectTwo':'']" :style="{fontSize:GLOBAL.defaultFS,color:selected==2?GLOBAL.tColor:GLOBAL.dColor}"> ({{imgListThree.length}})</text>
            </div>
        </div>
        <slider class="slider" @change="change" :index="sliderIndex">
            <list  show-scrollbar="false">
                <cell>
                    <div class="content">
                        <image class="contentImg" :src="item.image" v-for="(item,index) in imgListOne" :key="index"></image>
                    </div>
                </cell>
            </list>
            <list  show-scrollbar="false">
                <cell>
                    <div class="content">
                        <image class="contentImg" :src="item.image" v-for="(item,index) in imgListTwo" :key="index"></image>
                    </div>
                </cell>
            </list>
            <list  show-scrollbar="false">
                <cell>
                    <div class="content">
                        <image class="contentImg" :src="item.image" v-for="(item,index) in imgListThree" :key="index"></image>
                    </div>
                </cell>
            </list>




        </slider>
    </div>
</template>

<script>
    import {WxcMinibar} from 'weex-ui';
    export default {
        components: {WxcMinibar},
        name: 'App',
        data () {
            return {
                selected:0,//菜单点击切换
                sliderIndex:0,
                imgListOne:[
                    {image:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                    {image:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                    {image:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                    {image:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                    {image:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                    {image:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                    {image:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                    {image:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                    {image:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                    {image:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                    {image:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                    {image:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                    {image:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                    {image:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                    {image:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                    {image:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                    {image:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                    {image:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                    {image:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                    {image:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                    {image:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                    {image:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                    {image:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                    {image:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                    {image:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                    {image:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                    {image:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                    {image:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                    {image:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                    {image:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                    {image:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                    {image:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                    {image:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                    {image:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                    {image:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                    {image:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                    {image:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                    {image:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                    {image:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                    {image:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                    {image:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                    {image:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                    {image:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                ],
                imgListTwo:[
                    {image:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                    {image:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                    {image:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                    {image:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                    {image:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                    {image:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                ],
                imgListThree:[
                    {image:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                    {image:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                    {image:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                    {image:'https://image.aftdc.com/images/packageA/shopImg2.jpg'},
                ],
            }
        },
        methods:{
            minibarLeftButtonClick(){},
            selectedClick(index){
                this.selected=index;
                this.sliderIndex=index;
            },
            change(e){
                this.selected=e.index;
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
    .backImg{
        width: 40px;
        height: 40px;
    }
    .scroller{
        flex: 1;
    }
    .slider{
        width: 750px;
        flex: 1;
    }
    .contentImg{
        width: 224px;
        height: 163px;
        margin-right: 19px;
        margin-top: 20px;
    }
    .content{
        padding-left: 19px;
        padding-right: 1px;
        flex-wrap: wrap;
        flex-direction: row;
        align-items: center;
        width: 750px;
    }
    .barTextOne{
        font-weight: bold;
    }
    .select{
        border-bottom-color: #53beb7;

    }
    .whole{
        flex-direction: row;
        align-items: center;
        justify-content: center;
        flex: 1;
        border-bottom-style: solid;
        border-bottom-width: 7px;
        border-bottom-color: #fff;
        padding-top: 20px;
        padding-bottom: 20px;

    }
    .albumBar{
        flex-direction: row;
        align-items: center;
        padding-left: 20px;
        padding-right: 20px;
    }
    .wrapper{

    }
</style>
