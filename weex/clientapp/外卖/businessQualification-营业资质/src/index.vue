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
                <text :style="GLOBAL.headerCenter"  slot="middle">营业资质</text>
            </wxc-minibar>
        </div>

        <scroller class="scroller" show-scrollbar="false" >
            <nav>
                <text class="qualification_nav" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">商家资质信息公示</text>
            </nav>
            <main>
                <div class="qualification_main">
                    <image class="qualification_img" @click="onEnlargeImageClick(0)" :src="'https://image.aftdc.com/'+qualificationImg.unitImg"></image>
                    <image class="qualification_img" @click="onEnlargeImageClick(1)" :src="'https://image.aftdc.com/'+qualificationImg.allowImg"></image>
                </div>
            </main>
        </scroller>
        <!--查看大图弹框-->
        <wxc-popup popup-color="#000"
                   :show="enlargeImageShow"
                   @wxcPopupOverlayClicked="hide"
                   ref="wxcPopup_enlargeImage"
                   pos="right"
                   width="750">
            <div class="popupBox" >
                <slider class="enlargeImageSlider"  auto-play="false" :index="firstShowImg" >
                    <div class="enlargeImageListDiv" @click="hideEnlargeImage" :style="{height:viewportHeight+'px'}" v-for="(item, index) in enlargeImageList" >
                        <image :style="{width:item.width,height:item.height}" @load="resize(index,$event)"   :src="'https://image.aftdc.com/'+item.img"></image>
                    </div>
                    <indicator class="indicator"></indicator>
                </slider>
            </div>
        </wxc-popup>
    </div>


</template>

<script>
    import {WxcMask, WxcMinibar,WxcPopup } from 'weex-ui';
    const post = weex.requireModule('stream');
    const animation = weex.requireModule('animation')
    const modal = weex.requireModule('modal')
    const dom = weex.requireModule('dom')
    const event=weex.requireModule('event')
    const GLOBAL = require('@/Global.vue');
    const navigator = weex.requireModule('navigator');
    export default {
        components: {WxcMask, WxcMinibar,WxcPopup},
        name: 'App',
        data() {
            return {
                shopId:'',
                qualificationImg:'',
                //查看大图
                viewportHeight:'',//屏幕高度
                enlargeImageShow:false,
                firstShowImg:0,//打开的图片下标
                enlargeImageList:[],
            }
        },
        created(){
            var that=this
            that.shopId=weex.config.param
            var param='&shopId='+that.shopId
            post.fetch({
                method: 'POST',
                type: 'json',
                body: param,
                url: 'https://www.aftdc.com/userapp/Index/getAptitudes',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
            },function (res) {
                if(res.data.res==1){
                    that.qualificationImg=res.data.data

                }
            })
        },
        mounted(){
            var that=this
            setTimeout(function () {
                dom.getComponentRect('viewport', option => {
                    that.viewportHeight=option.size.height
                    console.log(that.viewportHeight)
                })

            },0)
        },
        methods: {
            minibarLeftButtonClick(){},
            //重置图片大小
            resize (i,event) {
                var that=this
                if (event.success) {
                    var ratio = event.size.naturalHeight / event.size.naturalWidth
                    var width = 750
                    var height = width * ratio
                    that.$set(that.enlargeImageList[i],'width',width + 'px')
                    that.$set(that.enlargeImageList[i],'height',height + 'px')
                }
            },
            onEnlargeImageClick(toggle){
                var that=this
                that.firstShowImg=toggle
                that.enlargeImageList=[{img:that.qualificationImg.unitImg,width:'750px',height:'500'},{img:that.qualificationImg.allowImg,width:'750px',height:'500'}]
                that.enlargeImageShow=true
            },
            //隐藏弹出框
            hideEnlargeImage(){
                var that=this
                that.$refs.wxcPopup_enlargeImage.hide()
            },
            //非状态组件，需要在这里关闭
            hide(){
                this.enlargeImageShow = false;
            },
        },

    }
</script>

<style scoped>
    .scroller{
        flex: 1;
        flex-direction: column;
        background-color: #f1f1f1;
    }
    .aiCenter{
        flex-direction: row;
        align-items: center;
    }
    .qualification_nav{
        padding-top: 20px;
        padding-bottom: 20px;
        padding-left: 20px;
    }
    .qualification_main{
        flex-direction: row;
        justify-content: space-around;
        padding-top: 30px;
        padding-bottom: 30px;
        padding-left: 20px;
        padding-right: 20px;
        background-color: #fff;
    }
    .qualification_img{
        width: 300px;
        height: 300px;
    }

    /*查看大图*/
    .popupBox{
        width: 750px;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex: 1;
    }
    .enlargeImageSlider {
        width: 750px;
        flex: 1;
        justify-content: center;
        align-items: center;

    }
    .enlargeImageListDiv{
        justify-content: center;
        align-items: center;
        width: 750px;
    }
    .indicator {
        height: 80px;
        item-color: #dedede;
        item-selected-color: #53beb7;
        item-size: 15px;
        position: absolute;
        bottom:30px;
        left: 0px;
        width: 750px;
        justify-content: center;
        align-items: center;
    }
</style>
