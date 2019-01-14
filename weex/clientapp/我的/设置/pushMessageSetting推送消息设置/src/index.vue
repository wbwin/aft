<template>
    <div class="pushMessageSetting">

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
                <text :style="GLOBAL.headerCenter"  slot="middle">推送消息设置</text>
            </wxc-minibar>
        </div>

        <div class="contentBig">
            <!--1-->
            <div class="content row" v-for="(item,index) in oneList" :key="index">
                <div class="contentLeft">
                    <text class="contentText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.text}}</text>
                    <text class="contentDetails" :style="{fontSize:GLOBAL.smallFS}">{{item.textTwo}}</text>
                </div>

                <!--按钮-->
                <div @click="one(index)" ref="testOne1" :style="{backgroundColor:oneList[index].backgroundColorTwo}" :class="[item.switch==false?'close':'open']">
                    <div ref="testOne2" :class="[item.switch==false?'isClose':'isOpen']"></div>
                </div>
            </div>
        </div>

        <div class="contentBig">
            <!--2-->
            <div class="content row" v-for="(item,index) in twoList" :key="index">
                <div class="contentLeft">
                    <text class="contentText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.text}}</text>
                </div>

                <!--按钮-->
                <div @click="two(index)" ref="testTwo1" :style="{backgroundColor:twoList[index].backgroundColorTwo}" :class="[item.switch==false?'close':'open']">
                    <div ref="testTwo2" :class="[item.switch==false?'isClose':'isOpen']"></div>
                </div>
            </div>
        </div>


        <div class="contentBig">

            <!--6-->
            <div class="contentTwo row" v-for="(item,index) in threeList" :key="index">
                <div class="contentLeft row">
                    <text class="contentText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.text}}</text>
                    <text class="contentDetails" :style="{fontSize:GLOBAL.smallFS,marginLeft:'10px'}" v-if="item.textTwo!=''">{{item.textTwo}}</text>
                </div>

                <!--按钮-->
                <div @click="three(index)" ref="testThree1" :style="{backgroundColor:threeList[index].backgroundColorTwo}" :class="[item.switch==false?'close':'open']"
                     style="justify-content: center;padding-left: 1px;">
                    <div ref="testThree2" :class="[item.switch?'isClose':'isOpen']"></div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import {WxcMinibar, WxcButton} from 'weex-ui';
    const modal = weex.requireModule('modal');
    const animation = weex.requireModule('animation');
    const dom = weex.requireModule('dom')
    export default {
        components: {WxcMinibar,WxcButton},
        name: 'App',
        data() {
            return {
                // prevent:true,//阻止多次点击绿色按钮

                oneList:[
                    {text:'接受消息设置',textTwo:'关闭后你将无法及时收到和处理你的消息',switch:true,backgroundColorTwo:'',prevent:true,briding:'',type:1,},
                ],//接受消息设置

                twoList:[
                    {text:'声音',switch:true,backgroundColorTwo:'',prevent:true,briding:'',type:2,},
                    {text:'震动',switch:false,backgroundColorTwo:'',prevent:true,briding:'',type:2,},
                ],//声音,震动

                threeList:[
                    {text:'回复我的',textTwo:'',switch:false,backgroundColorTwo:'',prevent:true,briding:'',type:3,},
                    {text:'私信',textTwo:'',switch:true,backgroundColorTwo:'',prevent:true,briding:'',type:3,},
                    {text:'关注',textTwo:'',switch:true,backgroundColorTwo:'',prevent:true,briding:'',type:3,},
                    {text:'留言选入',textTwo:'',switch:true,backgroundColorTwo:'',prevent:true,briding:'',type:3,},
                    {text:'互动消息',textTwo:'(点赞/关注/收藏/转发)',switch:false,backgroundColorTwo:'',prevent:true,briding:'',type:3,},
                    {text:'系统通知',textTwo:'',switch:false,backgroundColorTwo:'',prevent:true,briding:'',type:3,},
                ],//回复我的,私信,互动消息,系统通知
            }
        },
        methods: {
            minibarLeftButtonClick(){},

            // 动画
            moveOpen(testEl,testE2,transform,typ,bri){
                var that=this;
                animation.transition(testEl, {
                    styles: {
                        backgroundColor: '#4ed465',
                    },
                    duration: 500, //ms
                    timingFunction: 'ease',
                    delay: 0 //ms
                })
                animation.transition(testE2, {
                    styles: {
                        transform: transform,
                    },
                    duration: 500, //ms
                    timingFunction: 'ease',
                    delay: 0 //ms
                },function () {
                    if(typ==1){
                        that.oneList[bri].prevent=true;
                    }
                    if(typ==2){
                        that.twoList[bri].prevent=true;
                    }
                    if(typ==3){
                        that.threeList[bri].prevent=true;
                    }
                })
            },
            moveClose(testEl,testE2,transform,typ,bri){
                var that=this;
                animation.transition(testEl, {
                    styles: {
                        backgroundColor: '#e2e2e2',
                    },
                    duration: 500, //ms
                    timingFunction: 'ease',
                    delay: 0 //ms
                })
                animation.transition(testE2, {
                    styles: {
                        transform: transform,
                    },
                    duration: 500, //ms
                    timingFunction: 'ease',
                    delay: 0 //ms
                },function () {
                    if(typ==1){
                        that.oneList[bri].prevent=true;
                    }
                    if(typ==2){
                        that.twoList[bri].prevent=true;
                    }
                    if(typ==3){
                        that.threeList[bri].prevent=true;
                    }
                })
            },
            one(index) {
                var that = this;
                that.oneList[index].briding=index;
                var bri=that.oneList[index].briding;
                var typ=that.oneList[index].type;
                if(that.oneList[index].prevent){
                    that.oneList[index].prevent=false;
                    if (that.oneList[index].switch) {

                        // 解决兼容star
                        setTimeout(function () {
                            that.oneList[index].backgroundColorTwo='#e2e2e2'
                        },450)
                        // 解决兼容end

                        var testEl = this.$refs.testOne1[index];
                        var testE2 = this.$refs.testOne2[index];
                        var transform = 'translate(0px, 0px)';

                        this.moveClose(testEl,testE2,transform,typ,bri);

                        that.oneList[index].switch=false;

                        // 接受消息设置关闭时,下面的开关全部关闭
                        for(let i in that.twoList){
                            if(that.twoList[i].switch){
                                that.two(i);
                            }
                        }
                        for(let i in that.threeList){
                            if(that.threeList[i].switch){
                                that.three(i);
                            }
                        }

                    } else {

                        // 解决兼容star
                        setTimeout(function () {
                            that.oneList[index].backgroundColorTwo='#4ed465'
                        },450)
                        //解决兼容end

                        var testEl = this.$refs.testOne1[index];
                        var testE2 = this.$refs.testOne2[index];
                        var transform = 'translate(52px, 0px)';

                        this.moveOpen(testEl,testE2,transform,typ,bri);

                        that.oneList[index].switch=true;
                    }
                }
            },

            two(index) {
                var that = this;
                that.twoList[index].briding=index;
                var bri=that.twoList[index].briding;
                var typ=this.twoList[index].type;
                if(that.twoList[index].prevent){
                    that.twoList[index].prevent=false
                    if (that.twoList[index].switch) {

                        // 解决兼容star
                        setTimeout(function () {
                            that.twoList[index].backgroundColorTwo='#e2e2e2'
                        },450)
                        // 解决兼容end

                        var testEl = this.$refs.testTwo1[index];
                        var testE2 = this.$refs.testTwo2[index];
                        var transform = 'translate(0px, 0px)';

                        this.moveClose(testEl,testE2,transform,typ,bri);

                        that.twoList[index].switch=false;
                    } else {

                        // 解决兼容star
                        setTimeout(function () {
                            that.twoList[index].backgroundColorTwo='#4ed465'
                        },450)
                        //解决兼容end

                        var testEl = this.$refs.testTwo1[index];
                        var testE2 = this.$refs.testTwo2[index];
                        var transform = 'translate(52px, 0px)';

                        this.moveOpen(testEl,testE2,transform,typ,bri);

                        that.twoList[index].switch=true;

                        //开启时,检测接受消息设置是否开启
                        if(!that.oneList[0].switch){
                            that.one(0);
                        }
                    }
                }
            },

            three(index) {
                var that = this;
                that.threeList[index].briding=index;
                var bri=that.threeList[index].briding;
                var typ=this.threeList[index].type;
                if(that.threeList[index].prevent){

                    that.threeList[index].prevent=false;
                    if (that.threeList[index].switch) {

                        // 解决兼容star
                        setTimeout(function () {
                            that.threeList[index].backgroundColorTwo='#e2e2e2'
                        },450)
                        // 解决兼容end

                        var testEl = this.$refs.testThree1[index];
                        var testE2 = this.$refs.testThree2[index];
                        var transform = 'translate(0px, 0px)';

                        this.moveClose(testEl,testE2,transform,typ,bri)
                        that.threeList[index].switch=false;
                    } else {

                        // 解决兼容star
                        setTimeout(function () {
                            that.threeList[index].backgroundColorTwo='#4ed465'
                        },450)
                        //解决兼容end

                        var testEl = this.$refs.testThree1[index];
                        var testE2 = this.$refs.testThree2[index];
                        var transform = 'translate(52px, 0px)';

                        this.moveOpen(testEl,testE2,transform,typ,bri)
                        that.threeList[index].switch=true;

                        //开启时,检测接受消息设置是否开启
                        if(!that.oneList[0].switch){
                            that.one(0);
                        }
                    }
                }
            },
        },
        mounted () {
            for(var i in this.oneList){
                this.oneList[i].switch=!this.oneList[i].switch;
                this.one(i);
            };

            for(var i in this.twoList){
                this.twoList[i].switch=!this.twoList[i].switch;
                this.two(i);
            };
            for(var i in this.threeList){
                this.threeList[i].switch=!this.threeList[i].switch;
                this.three(i);
            };
        },
    }
</script>

<style scoped>
    .contentDetails{
        color: #999;
    }
    .contentBig{
        background-color: #fff;
        padding-left: 30px;
        padding-right: 30px;
        margin-top: 25px;
    }
    .contentTwo{
        border-top-style: solid;
        border-top-width: 2px;
        border-top-color: #f1f1f1;
        justify-content: space-between;
        padding-top: 20px;
        padding-bottom: 20px;
    }
    .content{
        justify-content: space-between;
        padding-top: 20px;
        padding-bottom: 20px;
    }
    .pushMessageSetting{
        background-color: #f8f8f8;
    }
    .open {
        width: 104px;
        height: 52px;
        border-radius: 52px;
        border-width: 1px;
        border-style: solid;
        border-color: white;

    }

    .close {
        width: 104px;
        height: 52px;
        border-radius: 52px;
        border-width: 1px;
        border-style: solid;
        border-color: #bbbbbb;

    }

    .isOpen {
        width: 50px;
        height: 50px;
        border-radius: 26px;
        border-width: 1px;
        border-style: solid;
        border-color: #e2e2e2;
        background-color: #ffffff;
    }

    .isClose {
        width: 50px;
        height: 50px;
        background-color: white;
        border-radius: 26px;
        border-width: 1px;
        border-style: solid;
        border-color: #e2e2e2;

    }
    .row{
        flex-direction: row;
        align-items: center;
    }
</style>