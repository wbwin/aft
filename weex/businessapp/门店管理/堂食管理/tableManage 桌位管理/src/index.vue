<template>
    <div class="wrapper">
        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="backClick()"
                    @wxcMinibarRightButtonClicked="minibarRightButtonClick"
                    v-once>
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">座位管理</text>
                <text :style="GLOBAL.headerRight"  slot="right"></text>
            </wxc-minibar>
        </div>
        <div class="table_content">
            <div class="tableClassfly">
                <div class="classflyLeft" @click="Scattered()">
                    <text class="scattered" :style="{fontSize:GLOBAL.biggerFS}" :class="[toggle==1?'activeColor':'']">散台</text>
                </div>
                <div class="classflyRight" @click="Unknown()">
                    <text class="unknow" :style="{fontSize:GLOBAL.biggerFS}" :class="[toggle==0?'activeColor':'']">未知</text>
                </div>
                <div class="classflyRight" @click="boxx()">
                    <text class="balcony" :style="{fontSize:GLOBAL.biggerFS}" :class="[toggle==2?'activeColor':'']">包厢</text>
                </div>
            </div>
            <list>
                <cell>
                    <div class="allListCell" v-if="toggle==1">
                        <div class="listCell " v-for="(item, index) in Sca">
                            <div>
                                <text class="content_Size"  :style="{fontSize:GLOBAL.bigFS}">桌位号码：{{item.deskNum}}</text>
                                <text class="content_Size"  :style="{fontSize:GLOBAL.bigFS}">桌位名称：{{item.deskName}}</text>
                                <text class="content_Size"  :style="{fontSize:GLOBAL.bigFS}">桌位类型：散台</text>
                                <text class="content_Size"  :style="{fontSize:GLOBAL.bigFS}">预定价格：{{item.money}}</text>
                                <text class="content_Size"  :style="{fontSize:GLOBAL.bigFS}">姓名：{{item.userName}}</text>
                                <text class="content_Size"  :style="{fontSize:GLOBAL.bigFS}">电话：{{item.userPhone}}</text>
                                <text class="content_Size"  :style="{fontSize:GLOBAL.bigFS}">备注：{{item.remark}}</text>
                                <div class="time">
                                    <text class="content_Size" :style="{fontSize:GLOBAL.bigFS}" style="padding-right: 0">预定到店:</text>
                                    <text class="timeSize" :style="{fontSize:GLOBAL.bigFS}">{{item.createTime}}</text>
                                </div>
                            </div>
                            <div class="content_button">
                                <!--<wxc-button text="同意" :btnStyle="btnStyle" :textStyle="textStyle" class="agreeButton"-->
                                            <!--@wxcButtonClicked=""></wxc-button>-->
                                <wxc-button text="清台" :btnStyle="cancelBtnStyle" :textStyle="GLOBAL.buttonText"
                                            class=""
                                            @wxcButtonClicked="Dynasty(item.orderId,item.type)"></wxc-button>
                            </div>
                            <div class="tag">
                                <wxc-button text="未知" :btnStyle="tagButtonStyle" :textStyle="tagStyle"
                                ></wxc-button>
                            </div>
                        </div>
                    </div>
                    <div v-if="toggle==0" class="allListCell">
                        <div class="listCell " v-for="(item, index) in can">
                            <div>
                                <text class="content_Size" :style="{fontSize:GLOBAL.bigFS}">桌位号码：未知</text>
                                <text class="content_Size" :style="{fontSize:GLOBAL.bigFS}">桌位名称：未知</text>
                                <text class="content_Size" :style="{fontSize:GLOBAL.bigFS}" v-if="item.baojian == 0">桌位类型：散台</text>
                                <text class="content_Size" :style="{fontSize:GLOBAL.bigFS}" v-else-if="item.baojian == 1">桌位类型：包间</text>
                                <text class="content_Size" :style="{fontSize:GLOBAL.bigFS}" v-else>桌位类型：散台/包间</text>
                                <text class="content_Size" :style="{fontSize:GLOBAL.bigFS}">预定价格：{{item.money}}</text>
                                <text class="content_Size" :style="{fontSize:GLOBAL.bigFS}">姓名：{{item.userName}}</text>
                                <text class="content_Size" :style="{fontSize:GLOBAL.bigFS}">电话：{{item.userPhone}}</text>
                                <text class="content_Size" :style="{fontSize:GLOBAL.bigFS}">备注：{{item.remark}}</text>
                                <div class="time">
                                    <text class="content_Size" :style="{fontSize:GLOBAL.bigFS}" style="padding-right: 0">预定到店:</text>
                                    <text class=" timeSize" :style="{fontSize:GLOBAL.bigFS}">{{item.createTime}}</text>
                                </div>
                            </div>
                            <div class="content_button">
                                <wxc-button text="同意" :btnStyle="btnStyle" :textStyle="GLOBAL.buttonText" class="agreeButton"
                                            @wxcButtonClicked="agree(item.orderId,item.type)"></wxc-button>
                                <wxc-button text="取消" :btnStyle="cancelBtnStyle" :textStyle="GLOBAL.buttonText"
                                            class="cancelButton"
                                            @wxcButtonClicked="settle(item.orderId,item.type)"></wxc-button>
                            </div>
                            <div class="tag">
                                <wxc-button text="未知" :btnStyle="tagButtonStyle" :textStyle="tagStyle"
                                ></wxc-button>
                            </div>
                        </div>
                    </div>
                    <div v-if="toggle==2" class="allListCell">
                        <div class="listCell " v-for="(item, index) in box">
                            <div>
                                <text class="content_Size"  :style="{fontSize:GLOBAL.bigFS}">桌位号码：{{item.deskId}}</text>
                                <text class="content_Size"  :style="{fontSize:GLOBAL.bigFS}">桌位名称：{{item.deskName}}</text>
                                <text class="content_Size"  :style="{fontSize:GLOBAL.bigFS}">桌位类型：包厢</text>
                                <text class="content_Size"  :style="{fontSize:GLOBAL.bigFS}">预定价格：{{item.money}}</text>
                                <text class="content_Size"  :style="{fontSize:GLOBAL.bigFS}">姓名：{{item.userName}}</text>
                                <text class="content_Size"  :style="{fontSize:GLOBAL.bigFS}">电话：{{item.userPhone}}</text>
                                <text class="content_Size"  :style="{fontSize:GLOBAL.bigFS}">备注：{{item.remark}}</text>
                                <div class="time">
                                    <text class="content_Size"  :style="{fontSize:GLOBAL.bigFS}" style="padding-right: 0">预定到店:</text>
                                    <text class="timeSize"  :style="{fontSize:GLOBAL.bigFS}">{{item.createTime}}</text>
                                </div>
                            </div>
                            <div class="content_button">
                                <!--<wxc-button text="同意" :btnStyle="btnStyle" :textStyle="textStyle" class="agreeButton"-->
                                            <!--@wxcButtonClicked="a"></wxc-button>-->
                                <wxc-button text="清台" :btnStyle="cancelBtnStyle" :textStyle="GLOBAL.buttonText"
                                            class=""
                                            @wxcButtonClicked="Dynasty(item.orderId,item.type)"></wxc-button>
                            </div>
                            <div class="tag">
                                <wxc-button text="未知" :btnStyle="tagButtonStyle" :textStyle="tagStyle"
                                ></wxc-button>
                            </div>
                        </div>
                    </div>
                </cell>
                <loading class="loading" @loading="onloading" :display="loadinging ? 'show' : 'hide'">
                    <text class="indicator-text">Loading ...</text>
                    <loading-indicator class="indicator"></loading-indicator>
                </loading>
            </list>
        </div>
        <div class="table_bottom">

            <wxc-button @wxcButtonClicked="goToEdit()" class="editButton" text="编辑桌位" :textStyle="GLOBAL.cancelButtonText" :btn-style="GLOBAL.cancelButton"></wxc-button>


        </div>
        <wxc-mask height="800"
                  width="600"

                  border-radius="10"
                  duration="300"
                  mask-bg-color="#fff"
                  :show="show"
                  :has-animation="hasAnimation"
                  :overlay-can-close="overlaycanclose"
                  @wxcMaskSetHidden="wxcMaskSetHidden"
        >

            <div class="mask_content">
                <div class="mask_title">
                    <text :style="{fontSize:GLOBAL.biggestFS,color:GLOBAL.dColor}">请选择座位</text>
                </div>
                <list style="height: 550px">
                    <cell v-for="(item,index) in seat">
                        <div class="mask_listCell" @click="maskRadioClick(index)">
                            <div class="mask_listCell_left">
                                <text class="mask_contentSize" :style="{fontSize:GLOBAL.bigFS}">桌位号：{{item.deskNum}}</text>
                                <text class="mask_contentSize" :style="{fontSize:GLOBAL.bigFS}">桌位类型：{{item.deskType}}</text>
                                <text class="mask_contentSize" :style="{fontSize:GLOBAL.bigFS}">桌位人数：{{item.deskPersonNum}}人</text>
                            </div>
                            <div class="mask_radio">
                                <image class="imgDefault" v-if="maskRadio!=index" src="https://image.aftdc.com/appBimg/ic_check_box_normal.png"></image>
                                <image class="imgDefault" v-if="maskRadio==index" src="https://image.aftdc.com/appBimg/ic_check_box_checked.png"></image>
                            </div>
                        </div>
                    </cell>

                </list>
            </div>
            <div class="mask_button">
                <wxc-button class="maskCancelButton" text="取消" :textStyle="GLOBAL.cancelButtonText" :btn-style="maskCancelBtnStyle"
                            @wxcButtonClicked="maskCancelClick"></wxc-button>
                <wxc-button class="sureButton" text="确定" :textStyle="GLOBAL.buttonText" :btn-style="sureBtnStyle"
                            @wxcButtonClicked="sureButton"></wxc-button>
            </div>
        </wxc-mask>
        <toast ref="toast"></toast>
    </div>
</template>

<script>
    import {WxcButton, WxcMask,WxcRadio,WxcMinibar} from 'weex-ui'
    import {WxcDialog} from 'weex-ui';
    import Toast from './Toast.vue'

    const modal = weex.requireModule('modal');
    const animation = weex.requireModule('animation')
    const storage = weex.requireModule('storage')
    const navigator = weex.requireModule('navigator');
    const post = weex.requireModule('stream');
    const event = weex.requireModule('event');
    export default {
        components: {WxcButton, WxcDialog, Toast, WxcMask,WxcRadio,WxcMinibar},
        data() {
            return {
                maskRadio:999,//已选择座位的下标（index）
                backImgToggle: 0,//头部返回图片判断
                toggle: 0,
                show: false,
                hasAnimation: true,
                overlaycanclose: false,
                btnStyle: {
                    backgroundColor: '#53beb7',
                    width: '150px',
                    height: '70px',
                    borderColor: '#666',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                },
                textStyle: {
                    color: '#fff'
                },
                cancelBtnStyle: {
                    backgroundColor: 'red',
                    width: '150px',
                    height: '70px',
                    borderColor: '#666',
                    borderWidth: '1px',
                    borderStyle: 'solid'
                },
                tagButtonStyle: {
                    backgroundColor: '#fff',
                    width: '100',
                    height: '50px',
                    borderColor: '#53beb7',
                    borderWidth: '1px',
                    borderStyle: 'solid'
                },
                tagStyle: {
                    fontSize: '25px',
                    color: '#53beb7'
                },
                editBtnStyle: {
                    backgroundColor: '#fff',
                    width: '600px',
                    borderColor: '#000',
                    borderWidth: '1px',
                    borderStyle: 'solid'
                },

                editStyle: {
                    color: '#000'
                },
                sureBtnStyle: {
                    backgroundColor: '#53beb7',
                    width: '270'
                },
                maskCancelBtnStyle:{
                    backgroundColor: '#fff',
                    width: '270',
                    borderColor: '#666',
                    borderWidth: '1px',
                    borderStyle: 'solid'
                },
                maskCancelStyle:{
                    color: '#000'
                },
                can: [ ],//未知
                page: 0,//未知个数
                Sca: [],//散台
                Scapage: 0,//散台个数
                box: [],//包厢
                boxpage: 0,//包厢个数
                seat:[],//商家位子
                orderId:'',
                type:'',
                token:'',
                imei:'',
                loadinging:''
            }
        },
        created: function () {
            this.token = weex.config.token;
            this.imei = weex.config.imei;
            var that = this;
            that.canteen();
        },
        methods: {
            minibarRightButtonClick(){

            },
            onloading (event) {
                 var that = this;
                that.loadinging = true;
                var toggle = that.toggle;
                if(toggle === 0){
                    that.canteen();
                } else if(toggle === 1){
                    that.scattered();
                } else if(toggle === 2){
                    that.Box();
                }
                setTimeout(() => {
                    that.loadinging = false
                }, 1000)


            },
            //返回上一页
            backClick() {
                navigator.pop({ animated: 'true' });
            },

            //跳转到编辑桌位页面
            goToEdit(){
                var param = '';
                var url='http://assets/editTable.js';
                event.toUrl({ "url": url, "param": param });
            },

            //消除
            settle(orderId,type){

                //获取token和sign
                var param = this.GLOBAL.sign(this.token,this.imei);

                param+= 'orderId=' + orderId+'&&'+'type='+type;
                post.fetch({
                    method: 'post',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/businessapp/Enrol/settle',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                }, function (res) {
                    if (res.data.res == 1) {
                        for(var i = 0;i<that.can.length;i++){
                            if (that.can[i]['orderId'] == orderId){
                                that.can.splice(i,1)
                            }
                        }
                    } else {
                        const toast=that.$refs.toast
                        toast.editContent('失败...');
                    }
                })
            },
            //清台
            Dynasty(orderId,type){

                //获取token和sign
                var param = this.GLOBAL.sign(this.token,this.imei);
                var that = this;

                param+= '&orderId=' + orderId+'&&'+'type='+type;
                post.fetch({
                    method: 'post',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/businessapp/Enrol/clearDesk',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                }, function (res) {
                    if (res.data.res === 1) {
                        if (that.toggle === 1){
                            for(var i = 0;i<that.Sca.length;i++){
                                if (that.Sca[i]['orderId'] === orderId){
                                    that.Sca.splice(i,1)
                                }
                            }
                        } else if (that.toggle === 2){
                            for(var i = 0;i<that.box.length;i++){
                                if (that.box[i]['orderId'] === orderId){
                                    that.box.splice(i,1)
                                }
                            }
                        }
                    } else {
                        const toast=that.$refs.toast;
                        toast.editContent('失败...');
                    }
                })
            },
            //确定选择
            sureButton(){
                var that = this;
                that.show=false
                var maskRadio = that.maskRadio;
                if (maskRadio == 999){
                    const toast=that.$refs.toast
                    toast.editContent('请选择位子...');
                    return false;
                }
                var deskType = that.seat[maskRadio]['deskType']
                if(deskType == '散台'){
                    deskType = 1;
                } else if(deskType == '包厢'){
                    deskType = 2;
                } else {
                    const toast=that.$refs.toast
                    toast.editContent('未知位子...');
                    return false;
                }
                var deskNum = that.seat[maskRadio]['deskNum'];
                var orderId = that.orderId
                var type = that.type

                //获取token和sign
                var param = this.GLOBAL.sign(this.token,this.imei);

                param+= 'deskType=' + deskType+'&&'+'deskId='+deskNum+'&&'+'orderNo='+orderId+'&&'+'type='+type;
                post.fetch({
                    method: 'post',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/businessapp/Enrol/canteenArrange',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                }, function (res) {
                    if (res.data.res == 1) {
                        for(var i = 0;i<that.can.length;i++){
                            if (that.can[i]['orderId'] == orderId){
                                that.can.splice(i,1)
                            }
                        }
                    } else {
                        const toast=that.$refs.toast
                        toast.editContent('失败...');
                    }
                })
            },
            //同意
            agree(orderId,type) {
                var that=this
                that.show=true
                that.orderId = orderId
                that.type = type
                that.maskRadio=999
            },
            //散
            Scattered() {
                var that = this;
                var Sca = that.Sca;
                that.toggle = 1;
                if (Sca.length > 0) {
                    return false;
                }
                that.Scapage = 0;
                that.scattered();
            },
            ////散
            scattered() {
                var that = this;
                var page = that.Scapage;

                //获取token和sign
                var param = this.GLOBAL.sign(this.token,this.imei);

                param+= '&page=' + page;
                post.fetch({
                    method: 'post',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/businessapp/Enrol/single',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                }, function (res) {
                    if (res.data.res === 1) {
                        that.Sca = that.Sca.concat(res.data.data);
                        that.Scapage = that.Scapage + res.data.data.length
                    }
                })
            },
            //未
            Unknown() {
                var that = this;
                that.toggle = 0;
                var can = that.can;
                if (can.length > 0) {
                    return false;
                }
                that.page = 0;
                that.canteen();

            },
            //包
            boxx() {
                var that = this;
                that.toggle = 2;
                var box = that.box;
                if (box.length > 0) {
                    return false;
                }
                that.boxpage = 0;
                that.Box();
            },
            Box() {
                var that = this;
                var page = that.boxpage;
                // var timestamp = Date.parse(new Date()) / 1000;
                // var sign = 'im=' + this.imei + '&token=' +this.token + '&timestamp=' + timestamp;
                // var sign = this.GLOBAL.md5(sign);
                // sign = sign.toUpperCase()

                // var formData = '';
                // formData+='timestamp='+timestamp;
                // formData+='&token='+this.token;
                // formData+='&sign='+sign;

                //获取token和sign
                var param = this.GLOBAL.sign(this.token,this.imei);

                param+= '&page=' + page;
                post.fetch({
                    method: 'post',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/businessapp/Enrol/cabin',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                }, function (res) {
                    if (res.data.res == 1) {
                        that.box = that.box.concat(res.data.data)
                        that.boxpage = that.boxpage + res.data.data.length
                    }
                })
            },
            //未知
            canteen() {
                // var that = this;
                // var page = that.page;
                //
                // //获取token和sign
                // var param = this.GLOBAL.sign(this.token,this.imei);
                //
                // param+= '&page=' + page;
                // post.fetch({
                //     method: 'post',
                //     type: 'json',
                //     body: param,
                //     url: 'https://www.aftdc.com/businessapp/Enrol/canteen',
                //     headers: {"Content-Type": "application/x-www-form-urlencoded"},
                // }, function (res) {
                //     if (res.data.res == 1) {
                //         that.seat = res.data.canteenSit
                //         that.can = that.can.concat(res.data.data)
                //         that.page = that.page + res.data.data.length
                //     }
                // })
            },
            classflyClick(index) {
                var that = this
                that.toggle = index
            },
            maskRadioClick(index){
                var that=this
                that.maskRadio=index
            },
            wxcMaskSetHidden(){
                that.show=false
            },
            maskCancelClick(){
                var that=this
                that.show=false
            },
        }
    }
</script>

<style scoped>
    .wrapper {
        flex-direction: column;
        background-color: #f8f8f8;
        position: relative;
    }

    .mask_content {
        flex-direction: column;
        justify-content: center;
    }

    .mask_title {
        align-items: center;
        flex-direction: row;
        justify-content: center;
        padding-top: 20px;
        padding-bottom: 20px;
    }

    .mask_listCell{
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        border-width: 2px;
        border-style: solid;
        border-color: #53beb7;
        margin-left: 20px;
        margin-right: 20px;
        margin-bottom: 20px;
        border-radius: 10px;
        padding-left: 20px;
        padding-right: 20px;
        padding-top: 20px;
        padding-bottom: 20px;
    }
    .mask_listCell:active{
        background-color: #f1f1f1;
    }

    .mask_listCell_left{
        flex-direction: column;
    }
    .mask_contentSize{
        color: #666;
    }
    .imgDefault{
        width: 50px;
        height: 50px;
    }
    .mask_button{
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
    }
    .sureButton {
        margin-top: 30px;

    }
    .sureButton:active {
        background-color: #57aba5;
    }
    .maskCancelButton{
        margin-top: 30px;
    }
    .maskCancelButton:active{
        background-color: #f1f1f1;
    }
    .table_content {
        flex-direction: column;
        position: absolute;
        top: 90px;
        left: 0;
        right: 0;
        bottom: 108px;
    }

    .tableClassfly {
        flex-direction: row;
        align-items: center;
        justify-content: space-around;
        background-color: #fff;

    }



    .classflyLeft {
        flex: 1;
    }

    .classflyRight {
        flex: 1;
    }

    .scattered {
        text-align: center;
        padding-top: 20px;
        padding-bottom: 20px;
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #fff;
        border-top-width: 2px;
        border-top-style: solid;
        border-top-color: #fff;

        color: #53beb7;

    }

    .balcony {

        text-align: center;
        padding-top: 20px;
        padding-bottom: 20px;
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #fff;
        border-left-width: 2px;
        border-left-style: solid;
        border-left-color: #fff;
        border-top-width: 2px;
        border-top-style: solid;
        border-top-color: #fff;
        color: #53beb7;
    }

    .unknow {
        text-align: center;
        padding-top: 20px;
        padding-bottom: 20px;
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #fff;
        border-left-width: 2px;
        border-left-style: solid;
        border-left-color: #fff;
        border-top-width: 2px;
        border-top-style: solid;
        border-top-color: #fff;
        color: #53beb7;
    }

    .scroller {
        flex-direction: row;
        flex-wrap: wrap;

        width: 750px;
    }

    .allListCell {
        flex-direction: row;
        flex-wrap: wrap;

        width: 750px;
    }

    .listCell {
        position: relative;
        margin-top: 20px;
        margin-left: 20px;
        /*margin-right: 10px;*/

        border-width: 2px;
        border-style: solid;
        border-color: #f8f8f8;
        /*border-collapse: collapse;*/
        border-radius: 10px;
        background-color: #fff;
        flex-direction: column;

        justify-content: space-between;
        width: 345px;
        padding-top: 10px;

    }

    .content_Size {

        color: #999;
        margin-left: 10px;
        margin-bottom: 10px;
        padding-right: 10px;
        /*flex: 1;*/
    }

    .time {
        flex-direction: row;
        align-items: center;

    }

    .timeSize {
        color: #999;
        flex: 1;
        text-align: center;
        padding-right: 10px;
    }

    .content_button {
        margin-top: 10px;
        margin-bottom: 10px;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
    }

    .agreeButton:active {
        background-color: #57aba5;
    }

    .cancelButton:active {
        background-color: #cc0000;
    }

    .tag {
        position: absolute;
        top: 10px;
        right: 10px;
    }

    .table_bottom {

        flex-direction: row;
        justify-content: space-around;
        position: fixed;
        left: 0;
        bottom: 0;
        right: 0;
        background-color: #fff;
        padding-top: 20px;
        padding-bottom: 20px;
        padding-left: 30px;
        padding-right: 30px;
        border-top-width: 2px;
        border-top-style: solid;
        border-top-color: #f8f8f8;

    }

    .editButton:active {
        background-color: #f1f1f1;
    }

    .activeColor {
        background-color: #53beb7;
        color: #fff;
    }


</style>
