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
                <text :style="GLOBAL.headerCenter"  slot="middle">音量</text>
            </wxc-minibar>
        </div>

        <div class="list">
        <div class="shock">
            <text class="shockTop" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">震动</text>
            <div class="shockBottom" style="flex-direction: row;justify-content: space-between;align-items: center">
                <text style="color: #999" :style="{fontSize:GLOBAL.defaultFS}">新消息震动</text>
                <div ref="test2" :class="[isOpens ? 'open':'close']"
                     style="justify-content: center;padding-left: 1px;" @click="bill">
                    <div ref="test1" :class="[isOpens ? 'isOpen':'isClose']"></div>
                </div>
            </div>
        </div>
        <div class="shock">
            <text class="shockTop" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">音量</text>
            <div class="shockBottom" style="flex-direction: row;justify-content: space-between;align-items: center">
                <text style="color: #999" :style="{fontSize:GLOBAL.defaultFS}">新消息音量</text>
                <wxc-slider-bar v-bind="sliderBarCfg"></wxc-slider-bar>
            </div>
        </div>
        </div>
    </div>
</template>

<script>
    import {WxcSliderBar,WxcMinibar} from 'weex-ui';
    const navigator = weex.requireModule('navigator');
    const animation = weex.requireModule('animation')
    const modal = weex.requireModule('modal')
    export default {
        name: 'App',
        components: {WxcSliderBar,WxcMinibar},
        data() {
            return {
                backImgToggle: 0,//头部返回图片判断
                isOpens: true,
                isOn: '',
                sliderBarCfg:{
                    length: 400,
                    range: false,
                    minDiff:10,
                    min: 0,
                    max: 100,
                    value:0,
                    defaultValue: 0,
                    validColor:'#7ecc4e',
                    disabled: false
                }
            }
        },
        created: function () {
            this.isOn = 1       //返回来的值，
        },
        methods: {
            bill: function () {
                var that = this
                var testEl = this.$refs.test1;
                var testE2 = this.$refs.test2;
                if (that.isOpens == false) {
                    if (that.isOn == 0) {
                        that.shopInfos = true
                        that.isOn = 1
                        animation.transition(testEl, {
                            styles: {
                                transform: 'translate(52px, 0px)',
                            },
                            duration: 800, //ms
                            timingFunction: 'ease',
                            delay: 0 //ms
                        })
                        animation.transition(testE2, {
                            styles: {
                                backgroundColor: '#4ed465',
                            },
                            duration: 800, //ms
                            timingFunction: 'ease',
                            delay: 0 //ms
                        })
                    }
                    else {
                        that.isOn = 0
                        var testEl = this.$refs.test1;
                        var testE2 = this.$refs.test2;
                        animation.transition(testEl, {
                            styles: {
                                transform: 'translate(0px, 0px)',
                            },
                            duration: 800, //ms
                            timingFunction: 'ease',
                            delay: 0 //ms
                        })
                        animation.transition(testE2, {
                            styles: {
                                backgroundColor: '#e2e2e2',
                            },
                            duration: 800, //ms
                            timingFunction: 'ease',
                            delay: 0 //ms
                        })
                    }
                } else {
                    if (that.isOn == 1) {
                        that.isOn = 0
                        animation.transition(testEl, {
                            styles: {
                                transform: 'translate(-52px, 0px)',
                            },
                            duration: 800, //ms
                            timingFunction: 'ease',
                            delay: 0 //ms
                        })
                        animation.transition(testE2, {
                            styles: {
                                backgroundColor: '#e2e2e2',
                            },
                            duration: 800, //ms
                            timingFunction: 'ease',
                            delay: 0 //ms
                        })
                    }
                    else {
                        that.isOn = 1
                        animation.transition(testEl, {
                            styles: {
                                transform: 'translate(2px, 0px)',
                            },
                            duration: 800, //ms
                            timingFunction: 'ease',
                            delay: 0 //ms
                        })
                        animation.transition(testE2, {
                            styles: {
                                backgroundColor: '#4ed465',
                            },
                            duration: 800, //ms
                            timingFunction: 'ease',
                            delay: 0 //ms
                        })
                    }
                }
            },
            //返回上一页
            minibarLeftButtonClick:function () {
                navigator.pop({ animated: 'true' });
            }
        }
    }
</script>

<style scoped>
    .minibar {
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: #f1f1f1;
    }
    .wrapper {
        background-color: #f8f8f8;
    }

    .header {
        flex-direction: row;
        height: 90px;
        background-color: #53beb7;
        align-items: center;
        justify-content: space-between;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
    }

    .list {
        position: absolute;
        top: 90px;
        right: 0;
        left: 0;
        bottom: 0;
    }

    .backclick {
        margin-left: 40px;
        flex: 1;
    }

    .backImg {
        width: 40px;
        height: 40px;
    }

    .appName {
        flex: 1;
    }

    .appNameCss {
        font-size: 40px;
        color: #fff;
    }

    .allSave {
        flex: 1;
        margin-right: 40px;
    }

    .shock {
        background-color: #ffffff;
        margin-top: 20px;
        padding-left: 20px;
        padding-right: 20px;
    }

    .shockTop {
        border-bottom-width: 3px;
        border-bottom-color: #e2e2e2;
        border-bottom-style: solid;
        padding-top: 20px;
        padding-bottom: 20px;
    }

    .shockBottom {
        padding-top: 20px;
        padding-bottom: 20px;
        flex-direction: row;
    }

    .open {
        width: 104px;
        height: 52px;
        border-radius: 52px;
        border-width: 1px;
        border-style: solid;
        border-color: white;
        background-color: #4ed465;
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
        margin-left: 52px;
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


</style>
