<template>
    <div class="wrapper" @viewappear="viewappear" @viewdisappear="viewdisappear">

        <!--头部-->
        <div>
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    v-once
            >
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">开具发票</text>
                <!--<text :style="GLOBAL.headerRight"  slot="right">帮助</text>-->
            </wxc-minibar>
        </div>

        <scroller :style="{flex:openHeight?null:1,height:openHeight?size.height+'px':null,width:'750px'}" ref="scrollerTast" @scroll="scrollMove">

            <div class="bigDiv">

                <text :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">开具发票</text>

                <div class="invoiceTypeDiv row">
                    <text :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">发票类型</text>
                    <text class="invoiceType" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{invoiceType}}</text>
                </div>

                <!--收件人信息-->
                <div class="addresseeDiv">
                    <div class="row" :style="{marginTop:index!=0?'10px':'0px'}" v-for="(item,index) in addresseeList" :key="index">
                        <text class="addDiv" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">{{item.name}}</text>
                        <input class="addInput" type="text" :placeholder="item.place" v-model="item.value" :style="GLOBAL.inputText" ref="toastOne" @focus="focus" @blur="blur">
                    </div>
                </div>

                <!--发票项目-->
                <div class="row projectDiv">
                    <text class="addDiv" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">发票项目</text>
                    <div class="proDiv">
                        <div class="proDivList" @click="pick">
                            <text class="proText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{serviceCharge}}</text>
                            <image class="proIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                        </div>
                    </div>
                </div>

                <div class="row projectDiv">
                    <text class="addDiv" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">发票抬头</text>
                    <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor,marginLeft:'25px'}">{{invoiceTitle}}</text>
                </div>

                <div class="row projectDiv">
                    <text class="addDiv" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">未开额度</text>
                    <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor,marginLeft:'25px'}">{{openerLimit-invoiceMoney}}</text>
                    <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor,marginLeft:'5px',color:'#53a9fd'}" @click="allMoneyClick">全部开具</text>
                </div>

                <div class="row projectDiv">
                    <text class="addDiv" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">开票金额</text>
                    <input class="addInputTwo" type="number" v-model="invoiceMoney" placeholder="请输入开票金额" :style="GLOBAL.inputText" ref="toastTwo" @focus="focus" @blur="blur" @input="moneyInput">
                </div>

                <div class="row projectDiv">
                    <text class="addDiv" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}"></text>
                    <text :style="{fontSize:GLOBAL.defaultFS,color:'#999',marginLeft:'25px'}">申请金额不得低于1000</text>
                </div>


                <div class="row">
                    <text class="qualifications" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">开票资质信息</text>
                    <div class="row" @click="addClick">
                        <image class="addIcon" src="https://image.aftdc.com/appBimg/add_icon.png"></image>
                        <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}">{{editOrAdd?'添加':'编辑'}}发票抬头</text>
                    </div>
                </div>


                <div class="addresseeDiv" v-if="haveData>0||haveDataTwo>0">

                    <div v-if="haveData>0">

                        <div style="margin-bottom: 20px;flex-direction: row">
                            <text class="infoText" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">抬头类型</text>
                            <text class="infoTextTwo" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}">单位</text>
                        </div>
                        <div style="margin-bottom: 20px;flex-direction: row">
                            <text class="infoText" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">抬头名称</text>
                            <text class="infoTextTwo" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{riseName}}</text>
                        </div>
                        <div style="margin-bottom: 20px;flex-direction: row" v-for="(item,index) in infoList" :key="index">
                            <text class="infoText" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">{{item.name}}</text>
                            <text class="infoTextTwo" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.text}}</text>
                        </div>

                    </div>



                    <div v-if="haveDataTwo>0">

                        <div style="margin-bottom: 20px;flex-direction: row">
                            <text class="infoText" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">抬头类型</text>
                            <text class="infoTextTwo" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}">个人</text>
                        </div>
                        <div style="margin-bottom: 20px;flex-direction: row">
                            <text class="infoText" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">抬头名称</text>
                            <text class="infoTextTwo" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{riseName}}</text>
                        </div>
                        <div style="margin-bottom: 20px;flex-direction: row" v-for="(item,index) in pertional" :key="index">
                            <text class="infoText" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">{{item.name}}</text>
                            <text class="infoTextTwo" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.text}}</text>
                        </div>

                    </div>

                </div>

            </div>


        </scroller>

        <div class=" enterButton">
            <wxc-button class="noButton" text="取消" :textStyle="GLOBAL.cancelButtonText" :btnStyle="GLOBAL.smCancelButton"
                        @wxcButtonClicked="cancel"></wxc-button>
            <wxc-button class="okButton" text="确认" :textStyle="GLOBAL.buttonText" :btnStyle="GLOBAL.smDefaultButton"
                        @wxcButtonClicked="confirm"></wxc-button>
        </div>

        <toast ref="toast"></toast>


    </div>
</template>

<script>
    import {WxcMask, WxcIcon, WxcMinibar, WxcButton} from 'weex-ui';
    import Toast from './Toast.vue'
    const picker = weex.requireModule('picker')
    const dom = weex.requireModule('dom')
    const post = weex.requireModule('stream');
    const event = weex.requireModule('event');
    const navigator = weex.requireModule('navigator');
    const items = ['广告费', '技术服务费'];
    export default {
        components: {WxcMask, WxcIcon, WxcMinibar, WxcButton, Toast},
        data() {
            return {
                haveData:0,//开票资质信息(等于0时隐藏)
                haveDataTwo:0,
                openHeight:false,
                index: 0,
                size:{height:0},
                editOrAdd:true,//(true)编辑发票抬头   或  (false)添加发票抬头

                // 开具发票
                invoiceType:'增值税专用发票',//发票类型
                addresseeList:[
                    {name:'收件人',place:'请填写收件人',value:'何少青'},
                    {name:'联系电话',place:'请填写联系电话',value:'13610254074'},
                    {name:'邮寄地址',place:'请填写邮寄地址',value:'白云区石井镇石井街石沙路338号康力物流中心'},
                    {name:'邮政编码',place:'请填写邮政编码',value:'510430'},
                ],//收件人信息
                serviceCharge:'服务费',//发票项目
                invoiceTitle:'广州江华国际物流有限公司',//发票抬头
                openerLimit:500,//开具额度
                invoiceMoney:0,//开票金额

                // 开票资质信息
                riseName:'',//抬头名称
                infoList:[
                    // {name:'纳税人识别号',text:'91440101556680232'},
                    // {name:'抬头名称',text:''},
                    {name:'税号',text:''},
                    {name:'电话号码',text:''},
                    {name:'电子邮件',text:''},
                    {name:'单位地址',text:''},
                    {name:'开户银行',text:''},
                    {name:'银行账号',text:''},

                ],
                pertional:[
                    {name:'电话号码',text:''},
                    {name:'电子邮件',text:''},
                    {name:'邮寄地址',text:''},
                ],
                pageBack: false,
            }
        },
        created(){

        },
        methods: {
            viewdisappear(){
                let self=this;
                self.pageBack = true;
            },
            viewappear(){

                let self=this;
                if(!self.pageBack){ return; }
                self.pageBack = false;

                this.haveData=0;//开票资质信息(等于0时隐藏)
                this.haveDataTwo=0;
                if(event.find('typeOfHeadUp')){
                    this.editOrAdd=false;

                    var typeOfHeadUp = event.find('typeOfHeadUp');
                    typeOfHeadUp = JSON.parse(typeOfHeadUp);

                    //单位
                    this.riseName=typeOfHeadUp.invoiceName;//抬头名称
                    this.infoList[0].text=typeOfHeadUp.dutyParagraph;//税号
                    this.infoList[1].text=typeOfHeadUp.companyPhoneNumber;//电话号码
                    this.infoList[2].text=typeOfHeadUp.companyEMail;//电子邮件
                    this.infoList[3].text=typeOfHeadUp.companyAddress;//单位地址
                    this.infoList[4].text=typeOfHeadUp.depositBank;//开户行
                    this.infoList[5].text=typeOfHeadUp.bankAccount;//银行账号

                    //个人
                    this.pertional[0].text=typeOfHeadUp.phoneNumber;//电话号码
                    this.pertional[1].text=typeOfHeadUp.eMail;//电子邮件
                    this.pertional[2].text=typeOfHeadUp.address;//邮寄地址
                }


                for(var i in this.infoList){
                    if (this.infoList[i].text!=''){
                        this.haveData+=1;
                    }
                }

                for(var i in this.pertional){
                    if (this.pertional[i].text!=''){
                        this.haveDataTwo+=1;
                    }
                }



            },
            addClick(){

                var param = '';				//单个
                var url='http://assets/addInvoice.js';
                event.toUrl({ "url": url, "param": param });

            },


            pick () {
                picker.pick({
                    index: this.index,
                    items,
                    confirmTitleColor :'#53beb7',
                    cancelTitleColor:'#999',
                }, event => {
                    if (event.result === 'success') {
                        this.serviceCharge = items[event.data]
                        this.index = event.data
                    }
                })
            },
            scrollMove(){
                this.$refs.toastOne[0].blur();
                this.$refs.toastOne[1].blur();
                this.$refs.toastOne[2].blur();
                this.$refs.toastOne[3].blur();
                this.$refs.toastTwo.blur();
            },
            minibarLeftButtonClick(){},
            cancel(){
                // 清除原有的缓存
                if(event.find('typeOfHeadUp')){

                    event.delete('typeOfHeadUp');

                }
                navigator.pop({ animated: 'true' });

            },
            // confirm(event){
            //
            //
            //     console.log(this.size)
            // },
            focus(){
                var that=this;
                if(this.openHeight==false){
                    this.size.height-=110;
                }
                setTimeout(function () {
                    that.openHeight=true;
                },30)
            },
            blur(){

            },
            moneyInput(){
                if(this.invoiceMoney>this.openerLimit){
                    const toast=this.$refs.toast
                    toast.editContent('开票金额已超出');
                    this.invoiceMoney=this.openerLimit;
                }
            },
            allMoneyClick(){
                this.invoiceMoney=this.openerLimit;
            },
            confirm(){
                var that=this;

                var invoice={//开具发票

                    invoiceType:that.invoiceType,//发票类型
                    recipient:that.addresseeList[0].value,//收件人
                    contactNumber:that.addresseeList[1].value,//联系电话
                    mailingAddress:that.addresseeList[2].value,//邮寄地址
                    postalCode:that.addresseeList[3].value,//邮政编码
                    serviceCharge:that.serviceCharge,//发票项目
                    invoiceTitle:that.invoiceTitle,//发票抬头
                    openerLimit:that.openerLimit,//开具最大额度
                    invoiceMoney:that.invoiceMoney,//开票金额

                };

                var qualificationsUnit={//开票资质信息(单位)

                    riseName:that.riseName,//抬头名称
                    afterTax:that.infoList[0].text,//税后
                    phoneNumber:that.infoList[1].text,//电话号码
                    unitAddress:that.infoList[2].text,//单位地址
                    openingBank:that.infoList[3].text,//开户银行
                    bankAccount:that.infoList[4].text,//银行账号
                    address:that.infoList[5].text,//地址

                }

                var qualificationsPersonal={//开票资质信息(个人)

                    riseName:that.riseName,//抬头名称
                    phoneNumber:that.pertional[0].text,//电话号码
                    Email:that.pertional[1].text,//电子邮件
                    mailingAddress:that.pertional[2].text,//邮寄地址

                }



                if(that.addresseeList[0].value==''){
                    const toast=this.$refs.toast
                    toast.editContent('未填写收件人')
                }
                else if(that.addresseeList[1].value==''){
                    const toast=this.$refs.toast
                    toast.editContent('未填写联系电话')
                }
                else if(that.addresseeList[2].value==''){
                    const toast=this.$refs.toast
                    toast.editContent('未填写邮寄地址')
                }
                else if(that.addresseeList[3].value==''){
                    const toast=this.$refs.toast
                    toast.editContent('未填写邮政编码')
                }


                // 清除原有的缓存
                if(event.find('typeOfHeadUp')){

                    event.delete('typeOfHeadUp');

                }


            },
        },
        mounted(){
            var that=this;
            setTimeout(() => {
                dom.getComponentRect('viewport', option => {
                    if (option.result && option.size) {
                        that.$set(that.size,'height',option.size.height);
                    }
                })
                console.log(that.size)
            }, 150)
        },
    }
</script>

<style scoped>
    .enterButton {
        width: 750px;
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
    .noButton:active{
        background-color: #f8f8f8;
    }
    .proIcon{
        position: absolute;
        width: 15px;
        height: 15px;
        right: 15px;
        top: 22px;
        transform: rotate(90deg);
    }
    .proText{
        text-align: center;
        flex: 1;
    }
    .proDivList{
        width: 505px;
        padding-top: 13px;
        padding-bottom: 13px;
        position: relative;

    }
    .proDiv{
        width: 505px;
        margin-left: 25px;
        border-style: solid;
        border-width: 2px;
        border-color: #dedede;
    }
    .projectDiv{
        margin-top: 25px;
        padding-left: 20px;
    }
    .addInput{
        margin-left: 25px;
        margin-right: 25px;
        width: 505px;
        background-color: #f1f1f1;
    }
    .addInputTwo{
        margin-left: 25px;
        margin-right: 25px;
        width: 505px;
        flex: 1;
    }
    .addDiv{
        width: 110px;
        text-align: right;
    }
    .qualifications{
        margin-top: 35px;
        margin-bottom: 35px;
        padding-left: 15px;
        flex: 1;
    }
    .addIcon{
        width: 32px;
        height: 32px;
    }
    .addresseeDiv{
        background-color: #f8f8f8;
        padding-top: 20px;
        padding-left: 20px;
        padding-bottom: 20px;
        margin-bottom: 25px;
    }
    .infoText{
        width: 160px;
        text-align: right;
    }
    .infoTextTwo{
        margin-left: 25px;
        width: 470px;
    }
    .invoiceType{
        margin-left: 30px;
    }
    .invoiceTypeDiv{
        padding-top: 35px;
        padding-bottom: 35px;
        padding-left: 20px;
    }
    .bigDiv{
        padding-top: 25px;
        padding-left: 30px;
        padding-right: 30px;
    }
    .scrollerTwo{
        flex: 1;
        /*height: auto;*/
        width: 750px;
        /*height: 20000px;*/
    }
    .wrapper {

    }
    .row{
        flex-direction: row;
        align-items: center;
    }
</style>
