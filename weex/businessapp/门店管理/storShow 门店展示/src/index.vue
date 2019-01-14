<template>
    <div class="wrapper"  @viewappear="viewappear" @viewdisappear="viewdisappear">
        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    v-once
            >
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">门店展示</text>
            </wxc-minibar>
        </div>

        <list class="scroller">
            <cell>
                <div class="listCell">
                    <div class="cellTitle">
                        <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">商家环境</text>
                        <image class="cellTitleIcon" src="https://image.aftdc.com/appBimg/icon_help_exhibition.jpg" @click="iconClicked"></image>
                    </div>
                    <div class="ambientImg">
                        <div class="joggleImg" v-for="(item,index) in img">
                            <image class="imgDefault" :src="item.id ? 'https://image.aftdc.com/'+ item.ImgUrl : item.localPart"></image>
                            <image class="delImg" @click="delImg(index)"
                                   src="https://image.aftdc.com/appBimg/icon_send_post_delete.png"></image>
                        </div>
                        <div class="joggleImg">
                            <image class="imgDefault" @click="addImg" src="https://image.aftdc.com/appBimg/icon_add_image.png"></image>
                        </div>
                    </div>
                </div>
            </cell>
        </list>

        <div class=" enterButton">

            <wxc-button class="okButton" text="保存" :textStyle="GLOBAL.buttonText" :btnStyle="GLOBAL.defaultButton"
                        @wxcButtonClicked="toEnterMessage"></wxc-button>
        </div>
        <wxc-mask height="370"
                  width="600"
                  :top="top"
                  border-radius="10"
                  duration="0"
                  mask-bg-color="#fff"
                  :show="show"
                  :has-animation="hasAnimation"
                  :overlay-can-close="overlaycanclose"
                  @wxcMaskSetHidden="wxcMaskSetHidden"
        >
            <div class="content">
                <div class="mask_content" >
                    <text class="mask_contentText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">1.图片的宽高比例为9:4</text>
                </div>
                <div class="mask_content" >
                    <text class="mask_contentText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">2.图片的大小最大为2M</text>
                </div>
                <div class="mask_content" >
                    <text class="mask_contentText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">3.最多上传20张图片</text>
                </div>

                <!--规则弹出层按钮-->
                <div class=" enterButtonSmall">

                    <wxc-button class="okButtonSmall" text="确定" :textStyle="GLOBAL.buttonText" :btnStyle="GLOBAL.smDefaultButton"
                                @wxcButtonClicked="toEnterMessageTwo"></wxc-button>
                </div>

            </div>
        </wxc-mask>
        <toast ref="toast"></toast>
    </div>
</template>

<script>
    import {WxcIcon, WxcButton, WxcMask,WxcMinibar} from 'weex-ui'
    import Toast from './Toast.vue'
    const post = weex.requireModule('stream');
    const navigator = weex.requireModule('navigator');
    const event = weex.requireModule('event');
    export default {
        components: {WxcIcon, WxcButton, WxcMask,Toast,WxcMinibar},
        data() {
            return {
                backImgToggle: 0,//头部返回图片判断
                img: [],
                video: '',
                storVideo: '',
                btnStyle: {
                    backgroundColor: '#53beb7',
                    width: '600px',
                    borderColor: '#666',
                    borderWidth: '1px',
                    borderStyle: 'solid'

                },
                textStyle: {
                    color: '#fff'
                },
                sureBtnStyle: {
                    backgroundColor: '#53beb7',
                    width: '540',
                    borderColor: '#666',
                    borderWidth: '1px',
                    borderStyle: 'solid'
                },
                show: false,
                hasAnimation: true,
                overlaycanclose: true,
                top: 0,
                pageBack: false,

                imgId:'',//删除的图片Id
                upLoad: [],//上传的图片
                delimgPart: '',//删除图片的路径
                token:'',
                imei:''
            }
        },
        created:function(){
            this.token = weex.config.token;
            this.imei = weex.config.imei;
            var that = this;
            //获取token和sign
            var param = this.GLOBAL.sign(this.token,this.imei);

            post.fetch({
                method: 'post',
                type: 'json',
                body:param,
                url: 'https://www.aftdc.com/businessapp/Enrol/store_shop',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
            },function(res){
                that.img = res.data.lunbo;
                that.video = res.data.shops.video;
                that.storVideo = res.data.shops.zhibo;
            })
        },
        methods: {
            toEnterMessage() {
                const toast=this.$refs.toast;
                if (this.img.length>20){
                    toast.editContent('最多上传20张图片');
                    return false;
                }
                var that = this;
                var video = that.video;
                var zhibo = that.storVideo;
                var imgId = that.imgId;
                var upLoad = that.upLoad;
                var delimgPart = that.delimgPart;
                //获取token和sign
                var param = this.GLOBAL.sign(this.token,this.imei);

                param += '&&video='+video+'&&'+'imgId='+imgId+'&&'+'zhibo='+zhibo + '&&upLoad=' + JSON.stringify(upLoad) + '&&delimgPart=' + delimgPart;
                post.fetch({
                    method: 'post',
                    type: 'json',
                    body:param,
                    url: 'https://www.aftdc.com/businessapp/Enrol/alter_join',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                },function(res){
                    if(res.data.res == 1){
                        that.imgId = '';
                        toast.editContent(res.data.info);
                        setTimeout(()=>navigator.pop({ animated: 'true' }),1500);
                    } else if (res.data.res == 0) toast.editContent(res.data.info);
                    else toast.editContent('网络出错了，请稍后再试');
                })
            },

            //添加图片
            addImg: function() {
                event.chooseImg(9,4);
            },
            //监听页面返回
            viewdisappear() {
                let self = this;
                self.pageBack = true;
            },
            viewappear() {
                let self = this;
                if (!self.pageBack) { return; }
                self.pageBack = false;
                if (event.find("localImg")) {
                    // var index=this.articleIndex;
                    var localPart = event.find("localImg");
                    var opinionImg = 'shops/'+event.find('shopId')+'/envImg/'+Date.parse(new Date())+'.jpg';
                    self.uploadImg(opinionImg,localPart);
                    event.delete("localImg");
                    var one_img = {'ImgUrl': opinionImg, 'localPart': localPart};
                    self.img.push(one_img);
                    //上传成功的图片
                    this.upLoad.push(one_img);
                }
            },
            //上传图片
            uploadImg(opinionImg,localPart){
                var param = this.GLOBAL.sign(this.token,this.imei);
                post.fetch({
                    method: 'post',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/businessapp/Goods/uploadOss',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                },function(res){
                    var waterMarkStr = '';
                    event.uploadImg(res.data.AccessKeyId,res.data.AccessKeySecret,res.data.SecurityToken,opinionImg,localPart,waterMarkStr);
                })
            },

            toEnterMessageTwo() {
                var that=this;
                that.show = false
            },
            wxcMaskSetHidden() {
                var that=this;
                that.show = false
            },
            iconClicked() {
                var that=this;
                that.show=true


            },
            delImg(index){
                var that=this;
                //要删除的图片Id
                if (that.img[index]['id']) that.imgId += that.img[index]['id']+',';
                //要删除图片的路径
                if (that.img[index]['ImgUrl']) that.delimgPart += that.img[index]['ImgUrl']+',';
                //本地删除
                that.img.splice(index,1)
            },
            //返回上一页
            minibarLeftButtonClick() {
                navigator.pop({ animated: 'true' });
            },
        }
    }
</script>

<style scoped>
    .enterButton{
        flex-direction: row;
        justify-content: space-around;
        /*position: fixed;*/
        /*left: 0;            存在时固定在底部*/
        /*bottom: 0;*/
        /*right: 0;*/
        background-color: #fff;
        border-top-width: 2px;
        border-top-style: solid;
        border-top-color: #f1f1f1;
        padding-top: 20px;
        padding-bottom: 20px;
        padding-left: 30px;
        padding-right: 30px;
    }
    .enterButtonSmall{
        flex-direction: row;
        justify-content: space-around;
        /*position: fixed;*/
        /*left: 0;            存在时固定在底部*/
        /*bottom: 0;*/
        /*right: 0;*/
        background-color: #fff;
        border-top-width: 2px;
        border-top-style: solid;
        border-top-color: #f1f1f1;
        padding-top: 20px;
        padding-bottom: 20px;
        padding-left: 30px;
        padding-right: 30px;
    }

    .okButton:active {
        background-color: #57aba5;
    }
    .minibar {
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: #f1f1f1;
    }
    .wrapper {
        flex-direction: column;
        background-color: #f8f8f8;
        position: relative;
    }

    .scroller {
        background-color: #fff;
    }

    .listCell {
        background-color: #f8f8f8;
        /*margin-bottom: 5px;*/
        flex-direction: column;
        /*padding-top: 10px;*/
        /*padding-bottom: 10px;*/
    }

    .cellTitleIcon{
        width: 40px;
        height: 40px;
    }

    .cellTitle {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding-top: 20px;
        padding-right: 40px;
        padding-left: 20px;
        padding-bottom: 20px;
        margin-bottom: 5px;
        background-color: #fff;
    }

    .ambientImg {
        background-color: #fff;
        flex-direction: row;
        flex-wrap: wrap;
        padding-left: 10px;
        /*padding-right: 20px;*/
        /*padding-top: 10px;*/
        padding-bottom: 20px;
    }

    .joggleImg {
        margin-top: 30px;
        margin-right: 30px;
        margin-left: 30px;
        position: relative;
    }

    .imgDefault {
        width: 300px;
        height: 133px;

    }

    .delImg {
        width: 35px;
        height: 35px;
        position: absolute;
        top: 5px;
        right: 5px;

    }

    .content {
        background-color: #fff;
        border-radius: 10px;
        padding-top: 30px;
        padding-right: 30px;
        padding-bottom: 30px;
        padding-left: 30px;
    }

    .mask_content {
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        margin-top: 20px;
        margin-bottom: 20px;
    }

    .mask_contentText {
        width: 540px;
    }

    .sureButton {
        margin-top: 30px;
    }
    .sureButton:active{
        background-color: #57aba5;
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

    .back {
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
        text-align: center;
        font-size: 40px;
        color: #fff;
    }

    .allSave {
        flex: 1;
        margin-right: 40px;

    }
    /***********************/
</style>
