<template>
    <div class="wrapper" @viewappear="viewappear" @viewdisappear="viewdisappear">

        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    v-once
            >
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">添加抬头</text>
            </wxc-minibar>
        </div>

        <!--头部-->
        <scroller show-scrollbar="false" :style="{flex:height==0?1:null,height:height==0?null:height+'px'}">
            <div class="header">
                <div class="info-item">
                    <text class="font" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">抬头类型</text>
                    <div class="tab" @click="toggle('company')"><text class="font company" :class="[show==true?'isActive':'']" :style="{fontSize:GLOBAL.defaultFS,color:show==true?GLOBAL.tColor:'#999'}">单位</text></div>
                    <div class="tab" @click="toggle('personal')"><text class="font personal" :class="[show==false?'isActive':'']" :style="{fontSize:GLOBAL.defaultFS,color:show==false?GLOBAL.tColor:'#999'}">个人</text></div>
                </div>
                <div class="info-item">
                    <text class="font" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">抬头名称</text>
                    <input class="input" type="text" value="" placeholder="请输入准确的抬头名称"  v-model="invoiceName" :style="GLOBAL.inputText" ref="inputOne">
                </div>
            </div>
            <!--主体内容-->
            <div class="container" :class="[show==true?' ':'toggle']">
                <!--单位抬头信息-->
                <div class="pages">
                    <div class="content">
                        <div class="info-item">
                            <text class="font" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">公司税号</text>
                            <input class="input" type="number" value="" placeholder="请输入税号或社会信用代码(必填)" @input="dutyParagraphInput" v-model="dutyParagraph" :style="GLOBAL.inputText" ref="inputTwo">
                        </div>
                        <text class="dutyParagraph" v-if="dutyParagraphDetails">税号应为15、17、18或20位，仅支持数字或大写字母</text>
                        <div class="info-item">
                            <text class="font" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">电话号码</text>
                            <input class="input" type="number" placeholder="请输入单位电话号码" v-model="companyPhoneNumber" :style="GLOBAL.inputText" ref="inputThree">
                        </div>
                        <div class="info-item">
                            <text class="font" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">电子邮件</text>
                            <input class="input" type="email" placeholder="提供邮箱地址以接收发票" v-model="companyEMail" :style="GLOBAL.inputText" ref="inputFour">
                        </div>
                        <div class="info-item">
                            <text class="font" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">单位地址</text>
                            <input class="input" type="text" placeholder="请输入单位地址" v-model="companyAddress" :style="GLOBAL.inputText" ref="inputFive">
                        </div>
                        <div class="info-item">
                            <text class="font" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">开户银行</text>
                            <input class="input" type="text" placeholder="请输入单位开户银行" v-model="depositBank" :style="GLOBAL.inputText" ref="inputSix">
                        </div>
                        <div class="info-item">
                            <text class="font" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">银行账号</text>
                            <!--<input class="input" type="text" placeholder="请输入单位银行账号" v-model:value="bankAccount">-->
                            <input class="input" type="number" placeholder="请输入单位银行账号" v-model="bankAccount" :style="GLOBAL.inputText" ref="inputSeven">
                        </div>
                    </div>
                    <!--&lt;!&ndash;页脚按钮&ndash;&gt;-->
                    <!--<div class="footer">-->

                        <!--<div class="enterButton">-->
                            <!--<wxc-button class="noButton" text="取消" :textStyle="GLOBAL.cancelButtonText" :btnStyle="GLOBAL.smCancelButton"-->
                                        <!--@wxcButtonClicked="cancelClick()"></wxc-button>-->
                        <!--</div>-->
                        <!--<div class="enterButton">-->
                            <!--<wxc-button class="okButton" type="blue" text="保存" :textStyle="GLOBAL.buttonText" :btnStyle="GLOBAL.smDefaultButton"-->
                                        <!--@wxcButtonClicked="wxcButtonClicked"></wxc-button>-->
                        <!--</div>-->

                    <!--</div>-->
                </div>
                <!--个人抬头信息-->
                <div class="pages">
                    <div class="content">
                        <div class="info-item">
                            <text class="font" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">电话号码</text>
                            <input class="input" type="number" placeholder="您常用的手机号" v-model="phoneNumber" :style="GLOBAL.inputText" ref="inputEight">
                        </div>
                        <div class="info-item">
                            <text class="font" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">电子邮件</text>
                            <input class="input" type="email" placeholder="提供邮箱地址以接收发票" v-model="eMail" :style="GLOBAL.inputText" ref="inputNight">
                        </div>
                        <div class="info-item">
                            <text class="font" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">邮寄地址</text>
                            <input class="input" type="text" placeholder="输入邮寄地址以接收纸质发票" v-model="address" :style="GLOBAL.inputText" ref="inputTen">
                        </div>
                    </div>
                </div>
            </div>
        </scroller>

        <!--页脚按钮-->
        <div class="footer">
            <div class=" enterButton">
                <wxc-button class="noButton" text="取消" :textStyle="GLOBAL.cancelButtonText" :btnStyle="GLOBAL.smCancelButton"
                            @wxcButtonClicked="cancelClick()"></wxc-button>
            </div>
            <div class=" enterButton">
                <wxc-button class="okButton" type="blueB" text="保存" :textStyle="GLOBAL.buttonText" :btnStyle="GLOBAL.smDefaultButton"
                            @wxcButtonClicked="wxcButtonClicked"></wxc-button>
            </div>
        </div>
        <!--提示框-->
        <div ref="test" class="warning-bg " @click="close" :class="[warningBox==true?'move':'']">
            <div></div>
        </div>
        <div class="warning-bgb" @click="close" :class="[warningBox==true?'move':'']">
            <div  class="warning" @click.stop="preventBubbles" >
                <div>
                    <text class="warning-title" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">提示</text>
                    <text class="warning-info" :style="{fontSize:GLOBAL.defaultFS}">{{promptMessage}}</text>
                    <div class="warning-btn">
                        <text class="determine" @click="close" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.tColor}">确定</text>
                    </div>
                </div>
            </div>
        </div>

    </div>

</template>

<script>
    import {WxcButton,WxcMinibar} from 'weex-ui';
    const animation = weex.requireModule('animation');
    const modal = weex.requireModule('modal');
    const navigator = weex.requireModule('navigator');
    const event = weex.requireModule('event');
    const dom = weex.requireModule('dom');

    export default {
        name: 'App',
        data() {
            return {
                height:0,//获取屏幕高度
                show: true,
                warningBox: false,
                dutyParagraphDetails:false,//税号红色文字提示

                // 表单的value值

                invoiceName:'',//抬头名称
                // 单位value值
                dutyParagraph:'',//税号
                companyPhoneNumber:'',//电话号码
                companyEMail:'',//电子邮件
                companyAddress:'',//单位地址
                depositBank:'',//开户行
                bankAccount: '',//银行账号
                // 个人value值
                phoneNumber: '',//电话号码
                eMail: '',//电子邮件
                address: '',//邮寄地址


                //提示信息
                promptMessage: "",
                // 按钮样式
                btnKeep: {
                    borderWidth: "1px",
                    borderStyle: "solid",
                    borderColor: "#3da49e",
                    marginTop: "38px",
                    backgroundColor: "#53BEB7",
                    width: "676px",
                    height: "94px"
                },
                btnCancel: {
                    borderWidth: "1px",
                    borderStyle: "solid",
                    borderColor: "#E4E4E4",
                    marginTop:"22px",
                    marginBottom:"38px",
                    backgroundColor: "#fff",
                    width: "676px",
                    height: "94px"
                },
                // 文字的样式
                fontCancel: {
                    color: 'black'
                },
            }
        },
        // 注册按钮组件
        components: {WxcButton,WxcMinibar},
        methods: {
            viewdisappear(){
                let self=this;
                self.pageBack = true;
            },
            viewappear(){

                let self=this;
                if(!self.pageBack){ return; }
                self.pageBack = false;




            },
            // 样式切换与表单清空
            toggle(type){

                this.$refs.inputOne.blur();
                this.$refs.inputTwo.blur();
                this.$refs.inputThree.blur();
                this.$refs.inputFour.blur();
                this.$refs.inputFive.blur();
                this.$refs.inputSix.blur();
                this.$refs.inputSeven.blur();
                this.$refs.inputEight.blur();
                this.$refs.inputNight.blur();
                this.$refs.inputTen.blur();

                if(type == 'company'){
                    this.show = true
                    this.phoneNumber = ''
                    this.eMail = ''
                    this.address = ''

                }else {
                    this.show = false
                    this.dutyParagraph = ''
                    this.companyPhoneNumber = ''
                    this.companyEMail = ''
                    this.companyAddress = ''
                    this.depositBank = ''
                    this.bankAccount = ''
                }
            },
            // 关闭提示框
            close(){
                this.warningBox = false;
                var testEl = this.$refs.test;
                animation.transition(testEl, {
                    styles: {
                        opacity: "0"
                    },
                    duration: 10, //ms
                    timingFunction: 'linear',
                    delay: 0 //ms

                })
                if(this.promptMessage=='保存成功'){

                    // 储存成功后返回上一页
                    navigator.pop({ animated: 'true' });
                }
                this.promptMessage = '';
            },
            // 阻止冒泡空方法
            preventBubbles(){

            },

            dutyParagraphInput(){

                if (!(/^[A-Z0-9]{15}$|^[A-Z0-9]{17}$|^[A-Z0-9]{18}$|^[A-Z0-9]{20}$/.test(this.dutyParagraph))) {
                    this.dutyParagraphDetails = true;
                }
                else{
                    this.dutyParagraphDetails = false;
                }

            },
            // 点击按钮执行的函数
            wxcButtonClicked() {


                // if(event.type == "blue" || event.type == "blueB"){
                    this.warningBox = true
                    // 动画效果
                    var testEl = this.$refs.test;
                    animation.transition(testEl, {
                        styles: {
                            opacity: '1'
                        },
                        duration: 200, //ms
                        timingFunction: 'linear',
                        delay: 10 //ms

                    })
                    // 表单信息验证
                    if(this.show){
                        if (!(/^[A-Z0-9]{15}$|^[A-Z0-9]{17}$|^[A-Z0-9]{18}$|^[A-Z0-9]{20}$/.test(this.dutyParagraph))) {
                            this.promptMessage = '请正确填写税号'
                            return false;
                        }else if (!(/^(0\d{2,3}-?)?\d{7,8}$/.test(this.companyPhoneNumber))) {
                            this.promptMessage = '请正确填写单位电话'
                            return false;
                        }else if (!(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(this.companyEMail
                        ))){
                            this.promptMessage = '请正确填写邮箱'
                            return false;
                        }else if (!(/^(\d{16}|\d{19})$/.test(this.bankAccount))) {
                            this.promptMessage = '请正确填写银行账号'
                            return false
                        }
                    }else if(this.show==false){
                        if (!(/^((\+?86)|(\(\+86\)))?1[34578]\d{9}$/.test(this.phoneNumber))) {
                            this.promptMessage = '请正确填写手机号'
                            return false;
                        }else if (!(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(this.eMail
                        ))){
                            this.promptMessage = '请正确填写邮箱'
                            return false;
                        }
                    }
                    if(this.invoiceName == ''){
                        this.promptMessage = '抬头名称不能为空'
                    }
                    else {
                        this.promptMessage = '保存成功';

                        // 清除原有的缓存
                        if(event.find('typeOfHeadUp')){

                            event.delete('typeOfHeadUp');

                        }

                        // 保存成功后储存缓存
                        var param = JSON.stringify({invoiceName:this.invoiceName,dutyParagraph:this.dutyParagraph,companyPhoneNumber:this.companyPhoneNumber,
                            companyEMail:this.companyEMail,companyAddress:this.companyAddress,depositBank:this.depositBank,bankAccount:this.bankAccount,
                            phoneNumber:this.phoneNumber,eMail:this.eMail,address:this.address,});
                        // 保存新的缓存
                        event.save('typeOfHeadUp',param);


                    }

                // }

            },
            minibarLeftButtonClick(){

            },
            cancelClick(){
                navigator.pop({ animated: 'true' });
            },

        },
        created(){
            if(event.find('typeOfHeadUp')){

                var typeOfHeadUp = event.find('typeOfHeadUp');
                typeOfHeadUp = JSON.parse(typeOfHeadUp);

                this.invoiceName=typeOfHeadUp.invoiceName;
                this.dutyParagraph=typeOfHeadUp.dutyParagraph;
                this.companyPhoneNumber=typeOfHeadUp.companyPhoneNumber;
                this.companyEMail=typeOfHeadUp.companyEMail;
                this.companyAddress=typeOfHeadUp.companyAddress;
                this.depositBank=typeOfHeadUp.depositBank;
                this.bankAccount=typeOfHeadUp.bankAccount;

                this.phoneNumber=typeOfHeadUp.phoneNumber;
                this.eMail=typeOfHeadUp.eMail;
                this.address=typeOfHeadUp.address;


                // 判断缓存的是单位页还是个人页
                if(this.phoneNumber!=''||this.eMail!=''||this.address!=''){

                    this.show = false
                    this.dutyParagraph = ''
                    this.companyPhoneNumber = ''
                    this.companyEMail = ''
                    this.companyAddress = ''
                    this.depositBank = ''
                    this.bankAccount = ''

                }
                else{

                    this.show = true
                    this.phoneNumber = ''
                    this.eMail = ''
                    this.address = ''
                }
            }
        },
        mounted(){
            var that=this;
            setTimeout(() => {
                dom.getComponentRect('viewport', option => {
                    if (option.result && option.size) {
                        that.height = option.size.height;
                        that.height-=239;
                    }
                })
            }, 150)
        },
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
        margin-top: 30px;
        padding-left: 20px;
        padding-right: 20px;
    }
    .noButton:active{
        background-color: #f8f8f8;
    }

    .okButton:active {
        background-color: #57aba5;
    }
    .wrapper {
        background-color: #f8f8f8;
    }
    .minibar {
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: #f1f1f1;
    }
    .backImg {
        width: 40px;
        height: 40px;
    }
    /* 字体与按钮*/
    .font {
        /*line-height: 110px;*/
    }
    .input {
        margin-left: 40px;
        flex: 1;
    }
    /* 头部 */
    .header {
        width: 750px;
        align-items: center;
        background-color: #fff;
    }
    .tab {
        padding-left: 106px;
        padding-right: 106px;
        text-align: center;
    }
    .info-item {
        width: 690px;
        flex-direction: row;
        align-items: center;
        padding-top: 20px;
        padding-bottom: 20px;
    }
    .dutyParagraph{
        width: 750px;
        text-align: right;
        color:orangered;
        font-size: 22px;
        padding-right: 30px;
    }
    .company {
        margin-left: 36px;
    }

    /* 头部样式切换 */
    .isActive {
        font-weight: bold;
        color: #52beb7;
    }
    /* 主体内容 */
    .container {
        width: 1500px;
        position: relative;
        flex-direction: row;
        left: 0px;
    }
    .pages {
        align-items: center;
    }
    .content {
        width: 750px;
        background-color: #fff;
        margin-top: 20px;
        align-items: center;
    }
    /* 页面切换 */
    .toggle {
        left: -750px;
    }
    /* 页脚按钮 */
    .footer{
        flex-direction: row;
        align-items: center;
        justify-content: space-around;
        padding-bottom: 30px;
    }
    /* 提示框 */
    .warning-bg {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 750px;
        right: -750px;
        background-color: rgba(0,0,0,0.5);
        opacity: 0;
        z-index: 9;
        align-items: center;
        justify-content: center;
    }
    .warning-bgb {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 750px;
        right: -750px;
        z-index: 99;
        align-items: center;
        justify-content: center;
    }
    .warning {
        padding-top: 60px;
        padding-bottom: 30px;
        padding-left: 60px;
        padding-right: 30px;
        background-color: #fff;
        border-radius: 5px;
    }
    .warning-title {
    }
    .warning-info {
        height: 120px;
        line-height: 120px;
        color: #999;
    }
    .warning-btn {
        align-items: center;
        flex-direction: row-reverse;
    }
    .determine {
        padding-top: 10px;
        padding-bottom: 10px;
        padding-left: 30px;
        padding-right: 30px;
        margin-left: 370px;
    }
    .determine:active {
        background-color: #dfdfdf;

    }
    .btnKeep:active{
        background-color: #57aba5;
    }
    .btnCancel:active{
        background-color: #f1f1f1;
    }
    /* 提示框移动 */
    .move {
        left: 0;
        right: 0;
    }

</style>


