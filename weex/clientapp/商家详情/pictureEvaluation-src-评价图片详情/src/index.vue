<template>
    <div class="wrapper">
        <!-- header -->
        <div class="header row" ref="header">
            <div class="close">
                <image class="closeIcon" src="https://image.aftdc.com/appBimg/icon_back_normal.png" :class="[!show?'closeMove':'']" @click="close"></image>
            </div>
            <div class="imgNumber aiCenter">
                <text class="white imgNumberIndex ">{{ imgIndex }}/{{ posters.length }}</text>
            </div>
            <div class="null"></div>
        </div>
        <!--slider轮播图-->
        <slider class="size" infinite="false" @change="imgChange">
            <div class="" v-for="src in posters" @click="toggle">
                <image class="size" resize="cover" :src="src"></image>
            </div>
        </slider>
        <!-- footer -->
        <div class="footer"></div>
        <div class="grayBg" ref="footer" ></div>
        <div class="footerContent" :class="[!show?'grayBgMove':'']" @click="close" ref="footerContent">
            <div class="row">
                <image class="starsGray startSize" src="https://image.aftdc.com/appBimg/icon_wuxing_nocolor.png" ></image>
                <div class="starsOrangeWidth" :style="{width:score*30+'px'}">
                    <image class=" startSize" src="https://image.aftdc.com/appBimg/icon_wuxing_color.png"></image>
                </div>
            </div>
            <text class="comment fontSize30 white">{{ comment }}</text>
            <div class="footerBtn aiCenter">
                <div class="footerBtnLeft row">
                    <div class="fabulous row aiCenter mr24" @click="clickLove">
                        <image class="loveIcon" :src="good?'https://image.aftdc.com/images/gz.png':'https://image.aftdc.com/appBimg/ic_love_gray.png'" ></image>
                        <text class="white fontSize24">{{fabulous!==0?'  '+fabulous:' 赞'}}</text>
                    </div>
                    <div class="fabulous row aiCenter" @click="appendComment">
                        <image class="commentIcon" src="https://image.aftdc.com/appBimg/ic_contact.png"></image>
                        <text class="white fontSize24">{{commentNumber!==0?'&nbsp;&nbsp;'+commentNumber:'&nbsp;评论'}}</text>
                    </div>
                </div>
                <image class="downloadIcon" src="https://image.aftdc.com/appBimg/ic_download_gray.png" @click="download"></image>
            </div>
        </div>
    </div>
</template>

<script>
    const animation = weex.requireModule('animation')
    const modal = weex.requireModule('modal')
    let timer = null
    export default {
        data () {
            return {
                show: true,
                imgIndex: 1,
                posters: [
                    'https://gw.alicdn.com/tfs/TB1MqHJkVuWBuNjSszbXXcS7FXa-1080-1574.jpg',
                    'https://gw.alicdn.com/tfs/TB1u1gjkY1YBuNjSszhXXcUsFXa-1080-1518.jpg',
                    'https://gw.alicdn.com/tfs/TB1TKvQk79WBuNjSspeXXaz5VXa-900-1312.jpg',
                    'https://gw.alicdn.com/tfs/TB1nDsrkYSYBuNjSspfXXcZCpXa-1080-1575.jpg'
                ],
                good: false,
                score: 4,
                comment: '路过，刚好中午，就来试试。总体来说还行吧。位置在鸦岗公交旁边儿，挺好的。店里面人不多，地面干净，桌子整洁。',
                fabulous: 5,
                commentNumber: 2
            }
        },

        methods:{
            // 点击图片显示隐藏
            toggle () {
                var headerEl = this.$refs.header;
                var footerEl = this.$refs.footer;
                var footerContentEl = this.$refs.footerContent;
                if(this.show){
                    // header隐藏
                    animation.transition(headerEl, {
                        styles: {
                            opacity: 0
                        },
                        duration: 500, //ms
                        timingFunction: 'ease',
                        delay: 0 //ms
                    })
                    // footer隐藏
                    animation.transition(footerEl, {
                        styles: {
                            opacity: 0
                        },
                        duration: 500, //ms
                        timingFunction: 'ease',
                        delay: 0 //ms
                    })
                    // footerContent隐藏
                    animation.transition(footerContentEl, {
                        styles: {
                            opacity: 0
                        },
                        duration: 500, //ms
                        timingFunction: 'ease',
                        delay: 0 //ms
                    })
                    var _this = this
                    clearTimeout(timer)
                    timer = setTimeout(()=>{
                        this.show = false
                    },500)

                }else {
                    // header隐藏
                    animation.transition(headerEl, {
                        styles: {
                            opacity: 1
                        },
                        duration: 500, //ms
                        timingFunction: 'ease',
                        delay: 0 //ms
                    })
                    // footer显示
                    animation.transition(footerEl, {
                        styles: {
                            // backgroundColor: "rgba(255,21,21,0.9)"
                            opacity: 0.9
                        },
                        duration: 500, //ms
                        timingFunction: 'ease',
                        delay: 0 //ms
                    })
                    // footerContent显示
                    animation.transition(footerContentEl, {
                        styles: {
                            opacity: 0.9
                        },
                        duration: 500, //ms
                        timingFunction: 'ease',
                        delay: 0 //ms
                    })
                    this.show = true
                }

            },
            close(){
                console.log("关闭图片")
            },
            // 监听当前显示图片的索引
            imgChange(e){
                this.imgIndex = ++e.index
            },
            // 点爱心（赞）
            clickLove(){
                if(this.good){
                    this.fabulous--
                }else{
                    this.fabulous++
                }
                this.good = !this.good


            },
            //点击底部评论按钮
            appendComment(){
                console.log("跳转评论")
            },
            // 将图片保存到本地
            download(){
                modal.toast({
                    message: '图片保存成功',
                    duration: 0.3
                })
            }
        }
    }
</script>

<style scoped>

    .wrapper {
        flex-direction: column;
        background-color: #000;
    }
    /* 公共样式 */
    .row {
        flex-direction: row;
    }
    .aiCenter {
        align-items: center;
    }
    .mr24 {
        margin-right: 24px;
    }
    .fontSize24 {
        fontSize: 24px;
    }
    .fontSize26 {
        font-size: 26px;
    }
    .fontSize30 {
        font-size: 28px;
        lines: 2;
        text-overflow: ellipsis;
    }
    .white {
        color: #fff;
    }
    .white {
        color: #fff;
    }
    /* header */
    .header {
        flex: 1;
        width: 750px;
        /*justify-content: space-between;*/
    }
    .size {
        flex: 10;
        width: 750px;
        height: 1000px;
    }
    .footer {
        flex: 1.5;
        width: 750px;
    }
    .close {
        flex: 1;
    }
    .closeIcon {
        width: 34px;
        height: 34px;
        margin-top: 24px;
        margin-left: 30px;
    }
    .imgNumber {
        flex: 1;
    }
    .imgNumberIndex {
        font-size: 36px;
        margin-top: 16px;
    }
    .null {
        flex: 1;
    }
    .closeMove {
        position: absolute;
        top: -50px;
    }
    /* footer */
    .grayBg {
        position: fixed;
        width: 750px;
        height: 246px;
        left: 0;
        bottom: 0;
        background-color: #000;
    }
    .footerContent {

        width: 750px;
        height: 246px;
        padding-top: 20px;
        padding-bottom: 20px;
        padding-left: 24px;
        padding-right: 24px;
        position: fixed;
        left: 0;
        bottom: 0;
    }
    .grayBgMove {
        bottom: -246px;
    }
    .startSize {
        width: 150px;
        height: 25px;
    }
    .starsGray {
        margin-right: 10px;
    }
    .starsOrangeWidth {
        overflow: hidden;
        position: absolute;
        top: 0px;
        left: 0px;
    }
    .comment {
        margin-top: 14px;
    }
    .footerBtn {
        flex-direction: row;
        justify-content: space-between;
        margin-top: 28px;
    }
    .fabulous {
        width: 124px;
        height: 50px;
        border-width: 1px;
        border-style: solid;
        border-color: #919191;
        align-items: center;
        justify-content: center;
        border-radius: 50px;
    }
    .loveIcon {
        width: 40px;
        height: 38px;
    }
    .commentIcon {
        width: 37px;
        height: 37px;
    }
    .downloadIcon {
        width: 38px;
        height: 34px;
        margin-right: 8px;
    }
</style>

