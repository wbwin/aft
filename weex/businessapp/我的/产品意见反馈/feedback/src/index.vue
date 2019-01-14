<template>
    <div class="wrapper" @viewappear="viewappear" @viewdisappear="viewdisappear" @touchmove="touchmove" @touchend="touchend">

        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    v-once
            >
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">产品意见反馈</text>
            </wxc-minibar>
        </div>
        <scroller :style="{width:'750px',flex:1,paddingBottom:!isHeight && !paddbottom?'130px':'0px'}" @scroll="scrollMove">
            <div>
                <div class="paddings row" style="justify-content: space-between" @click="goToMyFeedBack">
                    <text style="margin-top: 5px;" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">我的反馈</text>
                    <image class="paddingsIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                </div>
                <div class="paddings" style="margin-top: 20px;">
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">请选择反馈类型:</text>
                    <div style="flex-direction: row;justify-content: flex-start">
                        <!--<text :class="[flag==1?'checked':'unChecked']" @click="flag=1" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">配送问题</text>-->
                        <text :class="[flag==1?'checked':'unChecked']" @click="flag=1" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">投诉客服</text>
                        <text :class="[flag==2?'checked':'unChecked']" @click="flag=2" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">功能改善建议</text>
                        <text :class="[flag==3?'checked':'unChecked']" @click="flag=3" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">其他问题</text>
                    </div>
                </div>
                <div class="paddings" style="margin-top: 20px;">
                    <textarea placeholder="请详细描述问题" class="question" v-model="content" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}" ref="inputOne" @touchend="textTouchEnd" @focus="allFocus" @blur="allBlur"></textarea>
                    <image :src="imgSrc" style="width: 150px;height: 150px;margin-top: 25px;" @click="selectImg"></image>
                </div>
                <div class="paddings" style="flex-direction: row;margin-top: 20px;align-items: center ">
                    <text style="padding-top: 5px;padding-bottom: 5px;margin-right: 15px;" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">联系方式:</text>
                    <input class="input" type="number" placeholder="请留下您的手机号码，方便与您联系" v-model="userPhone" maxlength="11" :style="GLOBAL.inputText" ref="inputTwo" @focus="allFocus" @blur="allBlur"/>
                </div>

                <text class="tips" :style="{fontSize:GLOBAL.defaultFS}">反馈提交后，我们会在3个工作日内回复您</text>

            </div>

            <div class="row contact">
                <div class="phoneIconDiv" @click="phone(salesman)">
                    <image class="phoneIcon" src="https://image.aftdc.com/appBimg/ic_phone_blue.png"></image>
                </div>
                <div class="QQIconDiv">
                    <image class="QQIcon" src="https://image.aftdc.com/appBimg/logo_QQ.png"></image>
                </div>
            </div>
        </scroller>


        <!--底部按钮的全兼容写法start-->
        <div class=" enterButton" v-if="isHeight">

            <wxc-button class="okButton" text="提交" :textStyle="GLOBAL.buttonText" :btnStyle="GLOBAL.defaultButton"
                        @wxcButtonClicked="toEnterMessage"></wxc-button>
        </div>



        <div class="enteDiv" :style="{height:height}" v-if="!isHeight">

            <div class=" enterButtonTwo">

                <wxc-button class="okButton" text="提交" :textStyle="GLOBAL.buttonText" :btnStyle="GLOBAL.defaultButton"
                            @wxcButtonClicked="toEnterMessage"></wxc-button>
            </div>

        </div>
        <!--底部按钮的全兼容写法end-->


        <toast ref="toast"></toast>
    </div>

</template>

<script>
    import {WxcMinibar,WxcButton} from 'weex-ui';
    const navigator = weex.requireModule('navigator');
    const event = weex.requireModule('event');
    const post = weex.requireModule('stream');
    const modal = weex.requireModule('modal');
    const dom = weex.requireModule('dom');
    import Toast from './Toast.vue';
    export default {
        components: {WxcMinibar,WxcButton,Toast},
        name: 'App',
        data() {
            return {
                backImgToggle: 0,//头部返回图片判断
                flag: 1,
                content:'',
                feedbackType:'',
                userPhone:'',
                opinionImg:'',
                imgSrc:'https://image.aftdc.com/appBimg/icon_add_photo.png',
                pageBack: false,
                token:'',
                imei:'',


                height:'0px',//viewport的高度
                isHeight:true,//限定只在第一次获取焦点的时候获取高度
                paddbottom:false,//解决兼容(有position属性的底部按钮出现时,会遮挡scroller底部,用它结合focus和blur来控制Scroller的marginbottom)
                salesman:'',//业务经理电话


            }
        },
        created:function () {
            this.token = weex.config.token;
            this.imei = weex.config.imei;
            this.salesman= weex.config.param ;
        },
        methods: {
            //返回上一页
            minibarLeftButtonClick:function () {
                navigator.pop({ animated: 'true' });
            },
            toEnterMessage: function () {
                var that = this;

                //获取token和sign
                var param = this.GLOBAL.sign(this.token,this.imei);

                if (that.flag === 1)
                    that.feedbackType = '投诉客服';
                if (that.flag === 2)
                    that.feedbackType = '功能改善建议';
                if (that.flag === 3)
                    that.feedbackType = '其他问题';


                if (!that.content) {
                    const toast = this.$refs.toast;
                    toast.editContent('请填写描述问题');
                    return false
                }
                if (!that.userPhone) {
                    const toast = this.$refs.toast;
                    toast.editContent('请填写联系号码');
                    return false
                }

                param+= '&content=' + that.content;
                param+= '&feedbackType=' + that.feedbackType;
                param+= '&userPhone=' + that.userPhone;
                param+= '&opinionImg=' + that.opinionImg;
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: 'https://www.aftdc.com/businessapp/Feedback/feedback',
                }, function (e) {
                    if (e.data.res === -2){
                        //跳到登陆页面
                        navigator.push({
                            url: "https://image.aftdc.com/images/shop/",
                            animated: 'true'
                        })
                    } else if (e.data.res === 1) {
                        const toast = this.$refs.toast;
                        toast.editContent('e.data.info');
                        setTimeout(()=>navigator.pop({ animated: 'true' }),2000);
                    } else {
                        const toast = this.$refs.toast;
                        toast.editContent('e.data.info');
                    }
                })

            },
            //跳转到我的反馈页面
            goToMyFeedBack:function () {
                var param = '';
                var url='http://assets/myFeedBack.js';
                event.toUrl({ "url": url, "param": param });
            },
            //选择图片
            selectImg:function () {
                event.chooseImg(9,16);
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
                    self.imgSrc = localPart;
                    var opinionImg = 'shops/'+event.find('shopId')+'/opinionImg/'+Date.parse(new Date())+'.jpg';
                    self.opinionImg = opinionImg;
                    // this.article[index].localPart = localPart;
                    // this.article[index].articleImg = articleImg;
                    self.uploadImg(opinionImg,localPart);
                    event.delete("localImg");
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


            phone(phone){
                event.phone(phone);
            },

            allFocus(){
                var that=this;
                if(that.isHeight){
                    setTimeout(() => {
                        dom.getComponentRect('viewport', option => {
                            if (option.result && option.size) {
                                that.height = option.size.height;
                            }
                        })
                    }, 20)
                    that.isHeight=false;
                }
                that.paddbottom=true;
            },
            allBlur(){
                this.paddbottom=false;
            },

            blur(){
                this.$refs.inputOne.blur();
                this.$refs.inputTwo.blur();
            },
            touchmove(){
                var that=this;
                that.scroll=true;
            },
            touchend(){
                var that=this;
                that.scroll=false;
            },
            scrollMove(){
                var that=this;
                if(that.scroll){
                    that.blur();
                }
            },
            textTouchEnd(){
                this.$refs.inputOne.focus();
            },
        },
        mounted () {
            // var that=this;
            // setTimeout(() => {
            //     dom.getComponentRect('viewport', option => {
            //         if (option.result && option.size) {
            //             that.$set(that.size,'height',option.size.height)
            //         }
            //     })
            // }, 150)
        }
    }
</script>

<style scoped>
    .enterButton {
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
    .enterButtonTwo{
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
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
    }
    .enteDiv{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
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
        background-color: #f8f8f8;
    }



    .paddingsIcon{
        width: 20px;
        height: 20px;
    }
    .paddings {
        padding-top: 25px;
        padding-bottom: 25px;
        padding-left: 20px;
        padding-right: 20px;
        background-color: #ffffff;
    }

    .checked {
        padding-top: 20px;
        padding-bottom: 20px;
        padding-left: 20px;
        padding-right: 20px;
        border-color: #53beb7;
        color: #53beb7;
        border-width: 1px;
        border-top: solid;
        border-radius: 5px;
        margin-top: 25px;
        margin-right: 20px;
    }

    .unChecked {
        padding-top: 20px;
        padding-bottom: 20px;
        padding-left: 20px;
        padding-right: 20px;
        border-color: #c4c4c4;
        border-width: 1px;
        border-top: solid;
        border-radius: 5px;
        margin-top: 25px;
        margin-right: 20px;
    }

    .question {
        height: 250px;
        border-color: #53beb7;
        border-width: 1px;
        border-style: solid;
        border-radius: 15px;
        padding-left: 15px;
        padding-top: 15px;
        lines:5;
        padding-right: 15px;
    }

    .input {
        width: 520px;
        /*margin-top: 5px;*/
        margin-left: 12px;
        /*padding-top: 10px;*/
        /*padding-bottom: 10px;*/
        /*border-width: 1px;*/
        /*border-style: solid;*/
        /*border-radius: 15px;*/
        /*border-color: #41B883;*/
        placeholder-color: #999;
    }

    .tips {
        text-align: center;
        padding-top: 25px;
        padding-bottom: 20px;
        color: #999;
    }
    .phoneIconDiv{
        width: 110px;
        height: 110px;
        border-radius: 65px;
        border-style: solid;
        border-width: 2px;
        border-color: #dedede;
        align-items: center;
        justify-content: center;
        margin-right: 150px;
    }
    .phoneIcon{
        width: 50px;
        height: 50px;
    }
    .QQIconDiv{
        width: 110px;
        height: 110px;
        border-radius: 65px;
        border-style: solid;
        border-width: 2px;
        border-color: #dedede;
        align-items: center;
        justify-content: center;
    }
    .QQIcon{
        width: 52px;
        height: 60px;
    }
    .contact{
        margin-top: 30px;
        margin-bottom: 30px;
        justify-content: center;
    }
    .row{
        flex-direction: row;
        align-items: center;
    }
</style>
