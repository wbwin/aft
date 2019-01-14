<template>
    <div class="orderDetails">

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
                <text :style="GLOBAL.headerCenter"  slot="middle">取消预定</text>
            </wxc-minibar>
        </div>

        <scroller style="flex: 1;width: 750px;padding: 20px;">

            <div v-for="item in orderList">
                <text class="titleText" :style="{fontSize:GLOBAL.biggestFS ,color:GLOBAL.dColor}">订单待确认</text>
                <text class="rest" v-if="item.business==false" :style="{fontSize:GLOBAL.defaultFS ,color:GLOBAL.dColor}">商家正在休息中,营业后将优先处理您的订单</text>
                <div class="estimate row">
                    <text class="estimateOne" :style="{fontSize:GLOBAL.defaultFS ,color:GLOBAL.dColor}">预计{{item.noticeData}}</text>
                    <text class="estimateTwo" :style="{fontSize:GLOBAL.defaultFS ,color:GLOBAL.tColor}">{{item.noticeTime}}</text>
                    <text class="estimateOne" :style="{fontSize:GLOBAL.defaultFS ,color:GLOBAL.dColor}">左右短信告知预定结果</text>
                </div>

                <div class="shop row">
                    <div class="shopImg">
                        <image class="shopImg" :src="item.shopImg"></image>
                    </div>
                    <text class="shopName" :style="{fontSize:GLOBAL.bigFS ,color:GLOBAL.dColor}">{{item.shopName}}</text>
                    <image class="shopIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                </div>

                <div class="info row">
                    <text class="infoTitle" :style="{fontSize:GLOBAL.defaultFS}">时间人数:</text>
                    <text class="infoText" :style="{fontSize:GLOBAL.defaultFS ,color:GLOBAL.dColor}">{{item.people}}人,{{item.reserveTime}}</text>
                </div>
                <div class="info row">
                    <text class="infoTitle" :style="{fontSize:GLOBAL.defaultFS}">位置要求:</text>
                    <text class="infoText" v-if="item.hall==0" :style="{fontSize:GLOBAL.defaultFS ,color:GLOBAL.dColor}">大厅</text>
                    <text class="infoText" v-if="item.hall==1" :style="{fontSize:GLOBAL.defaultFS ,color:GLOBAL.dColor}">包间</text>
                </div>
                <div class="info row">
                    <text class="infoTitle" :style="{fontSize:GLOBAL.defaultFS}">联系方式:</text>
                    <text class="infoText" :style="{fontSize:GLOBAL.defaultFS ,color:GLOBAL.dColor}">{{item.contacts}} {{item.contactNumber}}</text>
                </div>
                <div class="info row">
                    <text class="infoTitle" :style="{fontSize:GLOBAL.defaultFS}">备注信息:</text>
                    <text class="infoText" :style="{fontSize:GLOBAL.defaultFS ,color:GLOBAL.dColor}">{{item.remarksInfo}}</text>
                </div>

                <div class="problem row">
                    <text class="problemLeft" :style="{fontSize:GLOBAL.bigFS ,color:GLOBAL.dColor}">遇到下列问题?</text>
                    <text class="problemRight" :style="{fontSize:GLOBAL.smallFS ,color:GLOBAL.tColor}">全部问题</text>
                </div>

                <div class="label row">
                    <text class="labelText" v-for="(itemTwo,index) in item.labelList" :key="index" @click="labelClick(index)" :style="{fontSize:GLOBAL.smallFS,color:'#999'}">{{itemTwo.label}}</text>
                </div>
            </div>

        </scroller>


        <div class=" enterButton">
            <wxc-button class="okButton" text="下一步" :textStyle="GLOBAL.cancelButtonText" :btnStyle="GLOBAL.cancelButton"
                        @wxcButtonClicked="cancelOrderClick"></wxc-button>
        </div>


        <!--弹出层-->
        <wxc-mask height="700"
                  width="702"
                  border-radius="15"
                  duration="200"
                  mask-bg-color="#FFFFFF"
                  :has-animation="true"
                  :has-overlay="true"
                  :show-close="false"
                  :show="reasonShow"
                  @wxcMaskSetHidden="wxcMaskSetHidden">

            <text class="reasonTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">请选择取消订座原因</text>
            <div class="reasonContent row" v-for="(item,index) in reasonList" :key="index" @click="resaonClick(index)">
                <image class="reasonContentIcon" :src="item.select?'https://image.aftdc.com/appBimg/radio_check.png':'https://image.aftdc.com/appBimg/radio.png'"></image>
                <text class="reasonContentText" :style="{fontSize:GLOBAL.defaultFS}">{{item.text}}</text>
            </div>
            <div class="btn row">
                <text class="confirm" @click="cancelClick" :style="{fontSize:GLOBAL.defaultFS,color:'#999',borderColor:'#999'}">放弃取消</text>
                <text class="confirm" :style="{fontSize:GLOBAL.defaultFS ,color:GLOBAL.tColor,borderColor:'#53beb7'}">确认取消</text>
            </div>
        </wxc-mask>
    </div>
</template>

<script>
    import {WxcMask, WxcMinibar, WxcPopup,WxcLightbox,WxcButton} from 'weex-ui';

    const animation = weex.requireModule('animation')
    const modal = weex.requireModule('modal')
    const dom = weex.requireModule('dom')
    export default {
        components: {WxcMask, WxcMinibar, WxcPopup,WxcLightbox,WxcButton},
        name: 'App',
        data() {
            return{
                reasonShow:false,
                orderList:[
                    {
                        business:false,noticeData:'07-07',noticeTime:'11:10',shopImg:'https://image.aftdc.com/images/packageA/shopImg2.jpg',shopName:'西乡里辣(嘉禾店)',people:5,reserveTime:'周六08/04 21:00',hall:0,
                        contacts:'王先生',contactNumber:'13610254074',remarksInfo:'不要辣',
                        labelList:[
                            {label:'催促商家接单',select:false},
                            {label:'商家停业',select:false},
                            {label:'预定信息查询',select:false},
                            {label:'投诉商家服务',select:false},
                            {label:'如何取消预定',select:false},
                            {label:'修改预定信息',select:false},
                        ],
                    },
                ],
                reasonList:[
                    {text:'不想订了',select:true},
                    {text:'行程有变/取消',select:false},
                    {text:'信息填写错误',select:false},
                    {text:'反馈太慢,不想等了',select:false},
                    {text:'通过其他方式预定',select:false},
                    {text:'其他',select:false},
                ],
            }
        },
        methods:{
            minibarLeftButtonClick(){},
            cancelClick(){
                this.reasonShow=false;
            },
            cancelOrderClick(){
                this.reasonShow=true;
            },
            wxcMaskSetHidden(){
                this.reasonShow=false;
            },
            resaonClick(index){
                for(var i in this.reasonList){
                    this.reasonList[i].select=false;
                };
                this.reasonList[index].select=true;
            },
        },
        created() {
        },
    }
</script>

<style scoped>
    /*编辑*/
    .enterButton {
        width: 750px;
        flex-direction: row;
        justify-content: space-around;
        /*position: fixed;*/
        /*left: 0;            存在时固定在底部*/
        /*bottom: 0;*/
        /*right: 0;*/
        border-top-width: 2px;
        border-top-style: solid;
        border-top-color: #f1f1f1;
        padding-top: 20px;
        padding-bottom: 20px;
        padding-left: 30px;
        padding-right: 30px;
    }

    .okButton:active {
        background-color: #f8f8f8;
    }
    .minibar {
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: #f1f1f1;
    }
    .confirm{
        height: 80px;
        line-height: 80px;
        width: 321px;
        margin-top: 20px;
        margin-left: 20px;
        text-align: center;
        border-style: solid;
        border-width: 2px;
        border-radius: 10px;
    }
    .reasonContentText{
        color: #999;
        margin-left: 20px;
        height: 80px;
        line-height: 80px;

    }
    .reasonContentIcon{
        width: 55px;
        height: 55px;
    }
    .reasonContent{
        border-bottom-style: solid;
        border-bottom-color: #f1f1f1;
        border-bottom-width: 2px;
        margin-left: 20px;
    }
    .reasonTitle{
        width: 702px;
        height: 80px;
        line-height: 80px;
        text-align: center;
        background-color: #f1f1f1;
    }
    .labelText{
        padding-top: 8px;
        padding-bottom: 8px;
        padding-left: 20px;
        padding-right: 20px;
        margin-right: 15px;
        margin-top: 20px;
        border-radius: 30px;
        border-style: solid;
        border-color: #e1e1e1;
        border-width: 2px;
    }
    .label{
        flex-wrap: wrap;
        margin-top:20px;
    }
    .problemRight{
    }
    .problemLeft{
        font-weight: 900;
        flex: 1;

    }
    .problem{
        margin-top: 50px;
    }
    .infoText{
        margin-left: 20px;
    }
    .infoTitle{
        color: #999;
    }
    .info{
        margin-top: 30px;
        margin-left: 80px;
    }
    .shopIcon{
        width: 20px;
        height: 20px;
        margin-left: 30px;
    }
    .shopImg{
        width: 40px;
        height: 40px;
        border-radius: 40px;
    }
    .shop{
        margin-top: 80px;
    }
    .shopName{
        font-weight: 900;
        margin-left: 20px;
        flex: 1;
    }
    .estimateOne{
    }
    .estimateTwo{
        padding-left: 5px;
        padding-right: 5px;
    }
    .estimate{
        margin-top: 20px;
    }
    .rest{
        margin-top: 40px;
    }
    .titleText{
        font-weight: 900;
        margin-top: 20px;
    }
    .orderDetails{
        position: relative;
        background-color: #f1f1f1;
    }

    /*默认*/
    .row{
        flex-direction: row;
        align-items: center;
    }
</style>
