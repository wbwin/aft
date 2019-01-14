<template>
    <div class="wrapper">
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
                <text :style="GLOBAL.headerCenter"  slot="middle">充值中心</text>
            </wxc-minibar>
        </div>

        <scroller style="width: 750px;flex: 1;background-color: #fff">
            <div style="background-color: #fff">
                <div class="selectDiv row">
                    <text class="selectText" :style="{fontSize:GLOBAL.defaultFS,color:item.select?GLOBAL.tColor:'#999',borderColor:item.select?GLOBAL.tColor:'#dedede'}" v-for="(item,index) in selectLists" :key="index" @click="selectClick(index)">{{item.num}}</text>
                </div>
                <text class="rechargePrompt" v-if="chargeMoney>=100" :style="{fontSize:GLOBAL.defaultFS,color:'#cd5555'}">{{'已满 '+showMoney+' 元可在本店享受'+discount+'折优惠'}}</text>
                <input type="number" class="money" placeholder="充值金额" :style="GLOBAL.inputText" v-if="selectLists[8].select" ref="moneyTest" v-model="inputValur" @focus="focus" @blur="blur" @input="input">

                <div class="btn row">
                    <text class="btnText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">余额:{{balance}}</text>
                    <text class="btnText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">积分:{{integral}}</text>
                    <text class="btnText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">优惠:{{discount==''?'无折扣':discount+'折'}}</text>
                </div>
            </div>

            <!--按钮-->
        </scroller>
        <div v-if="Focus">
            <div class=" enterButton">
                <wxc-button class="noButton" text="返回" :textStyle="GLOBAL.cancelButtonText" :btnStyle="GLOBAL.smCancelButton"
                            @wxcButtonClicked="cancel"></wxc-button>
                <wxc-button class="okButton" text="确定" :textStyle="GLOBAL.buttonText" :btnStyle="GLOBAL.smDefaultButton"
                            @wxcButtonClicked="confirm"></wxc-button>
            </div>
        </div>

        <!--充值成功提示-->
        <wxc-mask height="270"
                  width="600"
                  border-radius="0"
                  duration="200"
                  mask-bg-color="#FFFFFF"
                  :has-animation="true"
                  :has-overlay="true"
                  :show-close="false"
                  :show="show"
                  @wxcMaskSetHidden="wxcMaskSetHidden">
            <text class="tips" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">提示</text>
            <text class="result" :style="{fontSize:GLOBAL.defaultFS}">{{success?'充值成功':'充值失败'}}</text>
            <text class="know" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}" @click="knowClick">确定</text>
        </wxc-mask>
    </div>
</template>


<script>
    import {WxcIcon, WxcButton,WxcMinibar,WxcMask } from 'weex-ui';
    const modal = weex.requireModule('modal');

    export default {
        components: {WxcIcon, WxcButton,WxcMinibar,WxcMask },
        data() {
            return {
                chargeMoney:'',//充值的额数
                showMoney:'',//满100可优惠的整数
                discount:'',//折扣
                selectFocus:0,//是否获取了焦点
                Focus:true,///确认和取消的显示隐藏
                show:false,
                balance:5,//余额
                integral:150,//积分
                inputValur:'',
                success:true,//是否充值成功
                selectLists:[
                    {num:100,select:false},
                    {num:200,select:false},
                    {num:300,select:false},
                    {num:500,select:false},
                    {num:800,select:false},
                    {num:1000,select:false},
                    {num:1500,select:false},
                    {num:2000,select:false},
                    {num:'自定义',select:false},
                ],
            }
        },
        methods: {
            knowClick(){
                this.show=false;
            },
            input(){
                this.chargeMoney=this.inputValur;
                if(this.chargeMoney>=2000){
                    this.discount=9
                    this.showMoney=2000;
                }
                else if(this.chargeMoney>=1500){
                    this.discount=9.1
                    this.showMoney=1500;
                }
                else if(this.chargeMoney>=1000){
                    this.discount=9.2
                    this.showMoney=1000;
                }
                else if(this.chargeMoney>=800){
                    this.discount=9.3
                    this.showMoney=800;
                }
                else if(this.chargeMoney>=500){
                    this.discount=9.4
                    this.showMoney=500;
                }
                else if(this.chargeMoney>=300){
                    this.discount=9.5
                    this.showMoney=300;
                }
                else if(this.chargeMoney>=200){
                    this.discount=9.6
                    this.showMoney=200;
                }
                else if(this.chargeMoney>=100){
                    this.discount=9.7
                    this.showMoney=100;
                }
                else{
                    this.discount='';
                }
            },//输入金额
            blur(){
                this.Focus=true;
            },
            focus(){
                this.Focus=false;
            },
            confirm(){
                for(var i=0;i<this.selectLists.length-1;i++){
                    if(this.selectLists[i].select!=false||this.inputValur!=''){
                        this.show=true;
                    }
                }
            },//点击确认
            cancel(){

            },//点击返回
            wxcMaskSetHidden(){
                this.show=false;
            },
            minibarLeftButtonClick(){},
            selectClick(index){
                var that=this;
                for(var i in that.selectLists){
                    that.selectLists[i].select=false;
                }
                this.selectLists[index].select=true;
                if(index==8){
                    setTimeout(function () {
                        that.chargeMoney='';
                        that.discount='';
                        that.$refs.moneyTest.focus();
                        that.selectFocus=1;
                    },100)
                }
                if(index<8&&that.selectFocus==1){
                    that.selectFocus=0;
                    that.$refs.moneyTest.blur();
                    setTimeout(function () {
                        that.blur();
                    },200)
                }
                if(index<8){
                    this.inputValur='';
                    this.chargeMoney=this.selectLists[index].num;
                    if(this.chargeMoney>=2000){
                        this.discount=9
                        this.showMoney=2000;
                    }
                    else if(this.chargeMoney>=1500){
                        this.discount=9.1
                        this.showMoney=1500;
                    }
                    else if(this.chargeMoney>=1000){
                        this.discount=9.2
                        this.showMoney=1000;
                    }
                    else if(this.chargeMoney>=800){
                        this.discount=9.3
                        this.showMoney=800;
                    }
                    else if(this.chargeMoney>=500){
                        this.discount=9.4
                        this.showMoney=500;
                    }
                    else if(this.chargeMoney>=300){
                        this.discount=9.5
                        this.showMoney=300;
                    }
                    else if(this.chargeMoney>=200){
                        this.discount=9.6
                        this.showMoney=200;
                    }
                    else if(this.chargeMoney>=100){
                        this.discount=9.7
                        this.showMoney=100;
                    }
                    else{
                        this.discount='';
                    }
                }
            },//点击选项时(100 200 300)
        },
        created(){
        },
    }
</script>


<style scoped>
    .know{
        text-align: center;
        height: 90px;
        line-height: 90px;
        border-top-style: solid;
        border-top-width: 1px;
        border-top-color: #dedede;
        margin-top: 30px;
    }
    .result{
        height: 69px;
        line-height: 69px;
        color: #999;
        text-align: center;
    }
    .tips{
        text-align: center;
        height: 69px;
        line-height: 69px;
        margin-top: 12px;
    }
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

    .noButton:active{
        background-color: #f8f8f8;
    }
    .okButton:active {
        background-color: #57aba5;
    }
    .btnText{
        width: 160px;
    }
    .btn{
        justify-content: space-between;
        margin-left: 25px;
        margin-right: 25px;
        margin-top: 40px;
        margin-bottom: 40px;
    }
    .money{
        text-align: center;
        margin-left: 25px;
        margin-right: 25px;
        margin-top: 25px;
    }
    .rechargePrompt{
        text-align: left;
        margin-top: 35px;
        margin-left: 25px;
        margin-right: 25px;
    }
    .selectText{
        color: #999;
        margin-right: 20px;
        width: 219px;
        padding-top: 20px;
        padding-bottom: 20px;
        border-style: solid;
        border-width: 2px;
        margin-top: 20px;
        text-align: center;
        border-radius: 10px;
    }
    .selectDiv{
        margin-top: 30px;
        padding-left: 25px;
        padding-right: 5px;
        flex-wrap: wrap;
    }
    .row{
        flex-direction: row;
        align-items: center;
    }
    .wrapper{
        background-color: #f8f8f8;
    }
</style>
