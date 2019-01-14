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
                    <!--<text class="invoiceType" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{invoiceType}}</text>-->
                    <div class="proDiv">
                        <div class="proDivList" @click="picks">
                            <text class="proText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{invoiceType}}</text>
                            <image class="proIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                        </div>
                    </div>
                </div>

                <!--收件人信息-->
                <!--<div class="addresseeDiv">-->
                    <!--<div class="row" :style="{marginTop:index!=0?'10px':'0px'}" v-for="(item,index) in addresseeList" :key="index">-->
                        <!--<text class="addDiv" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">{{item.name}}</text>-->
                        <!--<input class="addInput" type="text" :placeholder="item.place" v-model="item.value" :style="GLOBAL.inputText" ref="toastOne" @focus="focus" @blur="blur">-->
                    <!--</div>-->
                <!--</div>-->

                <!--发票项目-->
                <div class="row projectDiv">
                    <text class="addDiv" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">发票项目</text>
                    <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor,marginLeft:'25px'}">{{serviceCharge}}</text>
                    <!--<div class="proDiv">-->
                        <!--<div class="proDivList" @click="pick">-->
                            <!--<text class="proText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{serviceCharge}}</text>-->
                            <!--<image class="proIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>-->
                        <!--</div>-->
                    <!--</div>-->
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
                    <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor,marginLeft:'25px'}">{{invoiceMoney}}</text>
                    <!--<input class="addInputTwo" type="number" v-model="invoiceMoney" placeholder="请输入开票金额" :style="GLOBAL.inputText" ref="toastTwo" @focus="focus" @blur="blur" @input="moneyInput">-->
                </div>

                <!--<div class="row projectDiv">-->
                    <!--<text class="addDiv" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}"></text>-->
                    <!--<text :style="{fontSize:GLOBAL.defaultFS,color:'#999',marginLeft:'25px'}">申请金额不得低于1000</text>-->
                <!--</div>-->


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
    const items = ['广告费', '技术服务费/年'];
    const invoiceItems = ['增值税电子普通发票', '增值税专用发票'];
    export default {
        components: {WxcMask, WxcIcon, WxcMinibar, WxcButton, Toast},
        data() {
            return {
                haveData:0,//开票资质信息(等于0时隐藏)
                haveDataTwo:0,
                openHeight:false,
                index: 1,
                invoiceIndex: 0,
                size:{height:0},
                editOrAdd:true,//(true)编辑发票抬头   或  (false)添加发票抬头

                // 开具发票
                invoiceType:'增值税电子普通发票',//发票类型
                // addresseeList:[
                //     {name:'收件人',place:'请填写收件人',value:''},
                //     {name:'联系电话',place:'请填写联系电话',value:''},
                //     {name:'邮寄地址',place:'请填写邮寄地址',value:''},
                //     // {name:'邮政编码',place:'请填写邮政编码',value:'510430'},
                // ],//收件人信息
                serviceCharge:'技术服务费/年',//发票项目
                invoiceTitle:'',//发票抬头
                openerLimit:0,//开具额度
                invoiceMoney:0,//开票金额

                // 开票资质信息
                riseName:'',//抬头名称
                infoList:[

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
                firstConfirm:true
            }
        },
        created(){
            this.token = weex.config.token;
            this.imei = weex.config.imei;

            this.getInvoice()
            // this.invoiceHistory()
        },
        mounted(){
            var that=this;
            setTimeout(() => {
                dom.getComponentRect('viewport', option => {
                    if (option.result && option.size) {
                        that.$set(that.size,'height',option.size.height);
                    }
                })
            }, 150)
        },
        methods: {
            getInvoice(){
                var param = this.GLOBAL.sign(this.token,this.imei);
                var that = this;
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: 'https://www.aftdc.com/businessapp/Recovery/getInvoice',
                }, function (res) {
                    if(res.data.res === 1) {
                        var invoice = res.data.data
                        that.editOrAdd = false
                        that.invoiceId = invoice.id
                        if (invoice.type == '单位') {
                            that.invoiceTitle = invoice.trueName;
                            that.riseName=invoice.trueName;//抬头名称
                            that.infoList[0].text=invoice.dutyNum;//税号
                            that.infoList[1].text=invoice.comTel;//电话号码
                            that.infoList[2].text=invoice.email;//电子邮件
                            that.infoList[3].text=invoice.comAddress;//单位地址
                            that.infoList[4].text=invoice.bank;//开户行
                            that.infoList[5].text=invoice.bankNo;//银行账号

                            that.haveData = 1
                            that.haveDataTwo = 0
                        }else{
                            that.invoiceTitle = invoice.trueName;
                            that.riseName=invoice.trueName;//抬头名称
                            that.pertional[0].text=invoice.phone;//电话号码
                            that.pertional[1].text=invoice.email;//电子邮件
                            that.pertional[2].text=invoice.address;//邮寄地址

                            that.haveData = 0
                            that.haveDataTwo = 1
                        }
                    }
                });
            },
            invoiceHistory(){
                var param = this.GLOBAL.sign(this.token,this.imei);
                var that = this;
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: 'https://www.aftdc.com/businessapp/Recovery/invoiceHistory',
                }, function (res) {
                    if(res.data.res === 1) {
                        if (res.data.receiveInfo) {
                            var receiveInfo = res.data.receiveInfo
                            that.addresseeList[0].value = receiveInfo.name
                            that.addresseeList[1].value = receiveInfo.phone
                            that.addresseeList[2].value = receiveInfo.address
                        }
                        that.surplus = res.data.surplus
                        if (that.index == 0) {
                            that.openerLimit = res.data.surplus.surplusRechargeMoney
                        } else{
                            that.openerLimit = res.data.surplus.surplusEnterMoney
                            if (that.openerLimit>=1000){
                                that.invoiceMoney = 0
                            }
                        }
                    }
                });
            },
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

                this.getInvoice()

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
                var param = {
                    needBack:1
                };				//单个
                var url='http://assets/addInvoice.js';
                event.toUrl({ "url": url, "param": JSON.stringify(param) });
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

                        var surplus = this.surplus
                        if (this.index == 0) {
                            this.openerLimit = surplus.surplusRechargeMoney
                        } else{
                            this.openerLimit = surplus.surplusEnterMoney
                        }
                        this.invoiceMoney = 0
                    }
                })
            },

            picks () {
                picker.pick({
                    index: this.invoiceIndex,
                    items:invoiceItems,
                    confirmTitleColor :'#53beb7',
                    cancelTitleColor:'#999',
                }, event => {
                    if (event.result === 'success') {
                        this.invoiceType = invoiceItems[event.data]
                        this.invoiceIndex = event.data
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
                var surplus = this.surplus
                if (this.index == 0) {
                    this.invoiceMoney = surplus.surplusRechargeMoney
                } else{
                    this.invoiceMoney = surplus.surplusEnterMoney
                }
            },
            confirm(){
                if (!this.firstConfirm)
                    return false;
                this.firstConfirm = false

                var that=this;
                const toast=that.$refs.toast

                var invoice={//开具发票
                    // name:that.addresseeList[0].value,//收件人
                    // phone:that.addresseeList[1].value,//联系电话
                    // address:that.addresseeList[2].value,//邮寄地址
                    type:that.index,//发票项目
                    money:that.invoiceMoney,//开票金额
                    invoiceId:that.invoiceId,//开票金额
                };

                // if(that.addresseeList[0].value==''){
                //     toast.editContent('未填写收件人')
                //     return false
                // }
                // if(that.addresseeList[1].value==''){
                //     toast.editContent('未填写联系电话')
                //     return false
                // }
                // if(that.addresseeList[2].value==''){
                //     toast.editContent('未填写邮寄地址')
                //     return false
                // }
                if (invoice.money<=0){
                    toast.editContent('开票金额必须大于0')
                    return false
                }
                if (!(/^((\+?86)|(\(\+86\)))?1[34578]\d{9}$/.test(invoice.phone))) {
                    toast.editContent("请正确填写手机号");
                    return false
                }
                if (this.invoiceIndex == 1&&(this.infoList[2].text==''||this.infoList[4].text==''||this.infoList[5].text=='')) {
                    toast.editContent('电子邮件,开户银行,银行账号为必填信息')
                    return false
                }

                var param = this.GLOBAL.sign(this.token,this.imei);
                param += '&invoice='+JSON.stringify(invoice);
                var that = this;
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: 'https://www.aftdc.com/businessapp/Recovery/applyInvoice',
                }, function (res) {
                    if(res.data.res === 1) {
                        toast.editContent('申请成功')
                        setTimeout(()=>navigator.pop({ animated: 'true' }),1500);
                    }else {
                        that.firstConfirm = true
                        toast.editContent(res.data.info)
                    }
                });
            },
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
        /*padding-bottom: 35px;*/
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
