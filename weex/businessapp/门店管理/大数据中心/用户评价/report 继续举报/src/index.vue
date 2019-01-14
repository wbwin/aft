<template>
    <div class="wrapper" @viewappear="viewappear" @viewdisappear="viewdisappear">
        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="backClick"
                    @wxcMinibarRightButtonClicked="minibarRightButtonClick"
                    v-once>
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">继续举报</text>
                <text :style="GLOBAL.headerRight"  slot="right"></text>
            </wxc-minibar>
        </div>
        <div class="scroller">
            <scroller class="scroller_content">
                <div class="title">
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">一条恶意评价仅有一次举报机会，每周最多举报三条评价，请勿滥用机会。详细描述问题并提供相关图片证据，可大大增加举报成功率</text>
                </div>

                <div class="type">
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">1、请选择恶意评价类型</text>
                    <div v-for="(items,index) in information" style="margin-top: 20px;">
                        <div style="flex-direction: row;align-items: center;" @click="select=index">
                            <div>
                                <image v-if="select!==index" class="picture"
                                       src="https://image.aftdc.com/appBimg/radio.png"></image>
                                <image v-if="select==index" class="picture"
                                       src="https://image.aftdc.com/appBimg/radio_check.png"></image>
                            </div>
                            <text class="rating" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}" style="align-items: center">{{items.type}}</text>
                        </div>
                    </div>
                </div>
                <div class="problem">
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">2、请详细描述问题</text>
                    <textarea class="msg" v-model="content" :placeholder="information[select].question" @focus="focus" @blur="blur"></textarea>
                </div>
                <div class="photo">
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">3、请上传证据图片</text>
                    <image class="pictures" :src="imgSrc" @click="selectImg"></image>
                </div>
                <div class="instructions">
                    <text :style="{fontSize:GLOBAL.bigFS,color:'#949494',textAlign:'center',paddingLeft:'30px',paddingRight:'30px'}">举报提交后，我们会在5个工作日内反馈处理结果</text>
                </div>
                <div class="fill"></div>
            </scroller>
            <!--<div class="btn">-->
            <!--<text  @click="save" style="color: #ffffff;font-size: 40px;text-align: center;line-height: 100;">提交举报</text>-->
            <!--</div>-->
        </div>
        <div class="tableButton" v-if="showBtn">
            <wxc-button text="确定"   :btnStyle="GLOBAL.defaultButton" :textStyle="GLOBAL.buttonText"
                        @wxcButtonClicked="save"></wxc-button>
        </div>
        <toast ref="toast"></toast>
    </div>
</template>

<script>
    import {WxcProgress,WxcMinibar,WxcButton} from 'weex-ui'
    import {WxcIcon} from 'weex-ui'
    import Toast from './Toast.vue'

    const animation = weex.requireModule('animation')
    const event = weex.requireModule('event')
    const post = weex.requireModule('stream');
    const navigator = weex.requireModule('navigator')
    export default {
        components: {WxcProgress, WxcIcon, Toast,WxcMinibar,WxcButton},
        name: 'App',
        data() {
            return {
                information: [{type: '泄露隐私', question: '如评价内容中涉及商家人员的个人隐私信息，如姓名、电话号码等，可举报为泄露隐私'},
                    {type: '存在不文明用语', question: '请描述不文明用语详情'},
                    {type: '以差评谋求不正当利益', question: '请提供双方聊天记录截图，证明评价者以中差评要挟为前提，利用中差评谋取额外钱财或其它不正当利益'},
                    {type: '敏感或违法信息', question: '请描述敏感或违法信息详情'},
                    {type: '同行恶意评价', question: '请提供同行店铺名称、订餐电话等信息以便工作人员核实，如为前员工报复，请提供雇佣关系的证明材料'},
                    {type: '广告或垃圾信息', question: '请描述广告或垃圾信息详情'}],
                select: 0,
                backImgToggle: 0,//头部返回图片判断
                content:'',
                pid:1,
                imgSrc:'https://image.aftdc.com/appBimg/icon_add_photo.png',
                pageBack: false,
                reportImg:'',
                token:"",
                imei:'',
                showBtn:true
            }
        },
        created:function () {
            this.token = weex.config.token;
            this.imei = weex.config.imei;
            var that = this;
            var pid=JSON.parse(weex.config.param).pid;
            that.pid = pid;
        },
        methods: {
            minibarRightButtonClick(){

            },
            focus(){
                this.showBtn = false
            },
            blur(){
                this.showBtn = true
            },
            save: function () {
                if(!this.content)
                {
                    const toast = this.$refs.toast;
                    toast.editContent('请填写详细描述');
                    return false;
                }

                var that = this;

                //获取token和sign
                var param = this.GLOBAL.sign(this.token,this.imei);

                param+= '&reason=' + this.information[this.select].type;
                param+= '&content=' + this.content;
                param+= '&pid=' + this.pid;
                param+= '&reportImg=' + this.reportImg;
                /*获取上传的图片对象*/

                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    url: 'https://www.aftdc.com/businessapp/Goodsappraises/report'
                }, function (e) {
                    if (e.data.res === -2) {
                        //跳到登陆页面
                        navigator.push({
                            url: "https://image.aftdc.com/images/shop/",
                            animated: 'true'
                        })
                    }
                    else {
                        if(e.data.res === 1){
                            const toast = that.$refs.toast;
                            toast.editContent('举报成功');
                            setTimeout(()=>navigator.pop({ animated: 'true' }),2000);
                        } else {
                            const toast = that.$refs.toast;
                            toast.editContent('举报失败');
                        }
                    }

                })
            },
            //返回上一页
            backClick:function() {
                navigator.pop({ animated: 'true' });
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
                    var reportImg = 'shops/'+event.find('shopId')+'/reportImg/'+Date.parse(new Date())+'.jpg';
                    self.reportImg = reportImg;
                    // this.article[index].localPart = localPart;
                    // this.article[index].articleImg = articleImg;
                    self.uploadImg(reportImg,localPart);
                    event.delete("localImg");
                }
            },
            //上传图片
            uploadImg(reportImg,localPart){
                var param = this.GLOBAL.sign(this.token,this.imei);
                post.fetch({
                    method: 'post',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/businessapp/Goods/uploadOss',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                },function(res){
                    var waterMarkStr = '';
                    event.uploadImg(res.data.AccessKeyId,res.data.AccessKeySecret,res.data.SecurityToken,reportImg,localPart,waterMarkStr);
                })
            },
        },
    }

</script>

<style scoped>
    .wrapper {
        flex-direction: column;
    }

    .scroller {
        position: absolute;
        top: 90px;
        left: 0;
        right: 0;
        bottom: 0;
    }

    .scroller_content {
        position: relative;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }




    .title {
        padding: 20px;
        background-color: rgba(252, 238, 33, 0.11);
    }

    .type {
        background-color: #ffffff;
        margin-top: 20px;
        padding: 20px;
        padding-left: 40px;
    }

    .picture {
        width: 50px;
        height: 50px;
    }

    .pictures {
        margin-top: 20px;
        width: 150px;
        height: 150px;
    }

    .rating {
        margin-left: 20px;
    }

    .problem {
        padding: 20px;
        background-color: #ffffff;
        margin-top: 20px;
        padding-left: 40px;
    }

    .msg {
        border-width: 1px;
        border-color: #999;
        width: 670px;
        height: 235px;
        padding: 20px;
        border-radius: 10px;
        margin-top: 20px;
        lines:6;
        font-size: 26px;
    }

    .photo {
        margin-top: 20px;
        padding: 20px;
        background-color: #ffffff;
        padding-left: 40px;
        padding-top: 40px;
    }

    .instructions {
        padding: 40px;
    }
    .fill {
        width: 750px;
        height: 128px;
    }
    .tableButton {
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        padding-top: 20px;
        padding-bottom: 20px;
        border-top-width: 2px;
        border-top-style: solid;
        border-top-color: #f1f1f1;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: #fff;
    }
</style>
