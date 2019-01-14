<template>
    <div class="wrapper" @viewappear="viewappear" @viewdisappear="viewdisappear" >
        <!-- 导航栏 -->

        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    @wxcMinibarRightButtonClicked="delMaskShow"
                    v-once>
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">{{edit ? '编辑收货地址' : '新增收货地址'}}</text>
                <text :style="{fontSize:'30px',color:'#fff'}" slot="right" v-if="edit">删除</text>
            </wxc-minibar>
        </div>

        <div class="infoFilling">
            <div class="infoItem row aiCenter">
                <text class="infoType" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">联系人:</text>
                <input class="input" type="text" placeholder="请填写收货人的姓名" maxlength="10" v-model="newAddressInfo.userName" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">
            </div>
            <div class="infoItem row aiCenter jcCenter">
                <div class="sex row aiCenter" @click="sexChecked(1)">
                    <div class="sexCheckedImgBox">
                        <div class="sexCheckedImg" v-if="newAddressInfo.userSex==1">
                            <image class="sexCheckedImg" src="https://image.aftdc.com/appBimg/ic_check_box_checked.png" ></image>
                        </div>
                        <div class="sexCheckedIcon" v-else></div>
                    </div>
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">先生</text>
                </div>
                <div class="sex row aiCenter" @click="sexChecked(2)">
                    <div class="sexCheckedImgBox">
                        <div class="sexCheckedImg" v-if="newAddressInfo.userSex==2">
                            <image class="sexCheckedImg" src="https://image.aftdc.com/appBimg/ic_check_box_checked.png" ></image>
                        </div>
                        <div class="sexCheckedIcon" v-else></div>
                    </div>
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">女士</text>
                </div>
            </div>
            <div class="infoItem row aiCenter">
                <text class="infoType" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">手机号:</text>
                <input class="input" type="number" placeholder="请填写你的手机号码" v-model="newAddressInfo.userPhone" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">
            </div>
            <div class="infoItem row aiCenter jcSb" @click="selectAddress">
                <div class=" row aiCenter">
                    <text class="infoType" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">收货地址:</text>
                    <image class="addressIcon" src="https://image.aftdc.com/appBimg/ic_address.png"></image>
                    <text class="gray" v-if="newAddressInfo.address == ''" :style="{fontSize:GLOBAL.bigFS}">点击选择</text>
                    <text class="address" v-else :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{ newAddressInfo.address }}</text>
                </div>
                <image class="arrowIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
            </div>
            <div class="infoItem row aiCenter">
                <text class="infoType" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">门牌号:</text>
                <input class="input" type="text" placeholder="例:16号楼427室" maxlength="50" v-model="newAddressInfo.detailed" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">
            </div>
            <!--<div class="infoItem row aiCenter">-->
            <!--<text class="infoType" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">设为常用地址:</text>-->
            <!--<div class="addressType aiCenter jcCenter" :class="[addressType=='home'?'addressTypeChecked':'']" @click="addressTypeChecked('home')">-->
            <!--<text :style="{fontSize:GLOBAL.defaultFS,color:addressType=='home'?GLOBAL.tColor:'#999'}">家</text>-->
            <!--</div>-->
            <!--<div class="addressType aiCenter jcCenter" :class="[addressType=='company'?'addressTypeChecked':'']" @click="addressTypeChecked('company')">-->
            <!--<text :style="{fontSize:GLOBAL.defaultFS,color:addressType=='company'?GLOBAL.tColor:'#999'}">公司</text>-->
            <!--</div>-->
            <!--<div class="addressType aiCenter jcCenter" :class="[addressType=='school'?'addressTypeChecked':'']" @click="addressTypeChecked('school')">-->
            <!--<text :style="{fontSize:GLOBAL.defaultFS,color:addressType=='school'?GLOBAL.tColor:'#999'}">学校</text>-->
            <!--</div>-->
            <!--</div>-->

            <div class=" enterButton">
                <wxc-button class="okButton" text="保存地址" :textStyle="GLOBAL.buttonText" :btnStyle="GLOBAL.defaultButton"
                            @wxcButtonClicked="openMask"></wxc-button>
            </div>
        </div>

        <!-- 提示弹出层 -->
        <wxc-mask height="300"
                  width="550"
                  border-radius="5"
                  duration="200"
                  mask-bg-color="#FFFFFF"
                  :has-animation="true"
                  :has-overlay="true"
                  :show-close="false"
                  :show="show"
                  @wxcMaskSetHidden="wxcMaskSetHidden">
            <div class="Prompt" @click.stop="preventBubbles" >
                <text style="font-size:36px;color:#333">提示</text>
                <text class="textTwo" :style="{fontSize:GLOBAL.biggerFS,color:'#757575'}">{{promptMessage}}</text>
                <text class="textThree" @click="wxcMaskSetHidden" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.tColor}">确定</text>
            </div>
        </wxc-mask>

        <!--删除弹出层-->
        <wxc-mask height="260"
                  width="550"
                  border-radius="5"
                  duration="200"
                  mask-bg-color="#FFFFFF"
                  :has-animation="true"
                  :has-overlay="true"
                  :show-close="false"
                  :show="delShow"
                  @wxcMaskSetHidden="delMaskHidden">
            <div class="delBox" @click.stop="preventBubbles" >
                <div class="delText aiCenter jcCenter" >
                    <text class="delTips" :style="{fontSize:GLOBAL.bigFS}">地址删除后无法恢复</text>
                    <text class="delTips" :style="{fontSize:GLOBAL.bigFS}">是否删除地址?</text>
                </div>
                <div class="delBtn row">
                    <text class="flex1 delCancel" :style="{fontSize:GLOBAL.bigFS}" @click="delMaskHidden">取消</text>
                    <text class="flex1" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor}" @click="delAddress">删除</text>
                </div>
            </div>
        </wxc-mask>

        <toast ref="toast"></toast>

    </div>
</template>

<script>
    import Toast from './Toast.vue';
    import {WxcMask,WxcMinibar,WxcButton} from 'weex-ui';
    const post = weex.requireModule('stream');
    const GLOBAL = require('@/Global.vue');
    const event = weex.requireModule('event');
    const navigator = weex.requireModule('navigator');
    export default {
        data () {
            return {
                delShow: false,//删除弹出层
                edit: false,
                //addressType: "home", //home company school
                // 保存用户添加地址信息
                newAddressInfo: {
                    addressId: "",
                    userName: "",
                    userSex: 1,
                    userPhone: "",
                    address: "",
                    detailed: "",
                    // addressType: "",
                    longitude: "",
                    latitude: "",
                    pageBack:false,
                },
                // 提示信息
                promptMessage: "",
                // 提示弹出层
                show: false,
                overlayCanClose: true,
                isFalse: false,
                hasAnimation: true,
                overlay: {
                    duration: 200
                }
            }
        },
        components: { WxcMask,WxcMinibar,WxcButton,Toast },
        created() {
            var that=this
            this.token = weex.config.token;
            this.imei = weex.config.imei
            // this.token = 'fesffefe';
            // this.imei = 'fesfsefsef';
            var param = weex.config.param
            if(param) {
                this.edit = true
                this.newAddressInfo = JSON.parse(param)
            }
            event.init();
        },
        methods: {
            minibarLeftButtonClick(){},
            delMaskHidden() {
                this.delShow = false
            },
            delAddress() {
                var that = this
                const toast=this.$refs.toast;
                var param=that.GLOBAL.sign(that.token,that.imei)
                param += '&addressId=' + that.newAddressInfo.addressId
                console.log(param)
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/userapp/Mine/delUserAddress',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                }, function (res) {
                    that.delShow = false
                    if(res.data.res === 1) {
                        setTimeout(() => navigator.pop({animated: 'true'}), 1000);
                    }else if (res.data.res === -2) {
                        that.toLogin()
                    }
                    toast.editContent(res.data.info);
                })
            },

            delMaskShow() {
                this.delShow = true
            },
            // 选择性别
            sexChecked(value){
                this.newAddressInfo.userSex = value
            },
            // 选择收获地址
            selectAddress(){
                event.openWebMap();
            },
            // 选择地址类型
            addressTypeChecked(type){
                this.addressType = type
            },
            // 提示弹出层
            openMask:GLOBAL.throttle(function(e) {
                var that = this
                const toast=this.$refs.toast;
                if (!(/^((\+?86)|(\(\+86\)))?1[34578]\d{9}$/.test(this.newAddressInfo.userPhone))) {
                    that.promptMessage = '请正确填写手机号'
                    that.show = true;
                    that.hasAnimation = true;
                    return false;
                }else if(that.newAddressInfo.address == ''){
                    that.promptMessage = '请选择收货地址'
                    that.show = true;
                    that.hasAnimation = true;
                    return false;
                }else{
                    var param=that.GLOBAL.sign(that.token,that.imei)
                    param += '&data=' + JSON.stringify(that.newAddressInfo)
                    post.fetch({
                        method: 'POST',
                        type: 'json',
                        body: param,
                        url: 'https://www.aftdc.com/userapp/Mine/editOrAddUserAddress',
                        headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    }, function (res) {
                        if(res.data.res === 1) {
                            setTimeout(() => navigator.pop({animated: 'true'}), 2000);
                        }else if (res.data.res === -2) {
                            that.toLogin()
                        }
                        toast.editContent(res.data.info);
                    })

                }
            }),
            wxcMaskSetHidden () {
                this.show = false;
            },
            openNoAnimationMask (e) {
                this.show = true;
                this.hasAnimation = false;
            },
            toLogin(){
                var that=this
                var param='';
                var url='http://assets/login.js';
                event.toUrl({"url":url,"param":param})
            },
            // 组织冒泡
            preventBubbles(){},
            viewappear(){
                var that=this
                if (!that.pageBack) { return; }
                that.pageBack = false;


                if (event.find('address')) {
                    var address = JSON.parse(event.find('address'));
                    that.$set(that.newAddressInfo,'latitude',address.latlng.split(",")[0])
                    that.$set(that.newAddressInfo,'longitude',address.latlng.split(",")[1])
                    that.$set(that.newAddressInfo,'address',address.address)
                    var detailed=address.shopAddress.replace(/null/g, '')
                    that.$set(that.newAddressInfo,'detailed',detailed)
                    event.delete('address');
                }

            },
            viewdisappear() {
                this.pageBack = true;
            },
        }
    }
</script>
<style scoped>
    .delTips {
        color: #555;
        font-size: 28px;
        line-height: 40px;
    }
    .delBox {
        justify-content: space-between;
    }
    .delText {
        height: 166px;
    }
    .delBtn {
        height: 94px;
        border-top-width: 2px;
        border-top-style: solid;
        border-top-color: #f0f0f0;
    }
    .flex1 {
        line-height: 94px;
        text-align: center;
        flex: 1;
    }
    .delCancel {
        color: #444;
        border-right-width: 2px;
        border-right-style: solid;
        border-right-color: #f0f0f0;
    }

    .textThree{
        text-align: right;
    }
    .textTwo{
        padding-top: 40px;
        padding-bottom: 70px;
    }
    .Prompt{
        padding-top: 40px;
        padding-left: 40px;
        padding-right: 60px;
        padding-bottom: 40px;
    }
    .enterButton {
        flex-direction: row;
        justify-content: space-around;
        /*position: fixed;*/
        /*left: 0;            存在时固定在底部*/
        /*bottom: 0;*/
        /*right: 0;*/
        background-color: #fff;
        /*border-top-width: 2px;*/
        /*border-top-style: solid;*/
        /*border-top-color: #f1f1f1;*/
        padding-top: 20px;
        padding-bottom: 20px;
        padding-left: 30px;
        padding-right: 30px;
    }
    .address {
        max-width: 400px;
        lines: 1;
        text-overflow: ellipsis;
    }
    .okButton:active {
        background-color: #57aba5;
    }
    .okButton:enabled{
        background-color: #53beb7;
    }
    .wrapper {
        flex-direction: column;
        background-color: #efefef;
    }
    .minibar {
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: #f1f1f1;
    }
    /* 公共样式 */
    .row {
        flex-direction: row;
    }
    .aiCenter {
        align-items: center;
    }
    .jcCenter {
        justify-content: center;
    }
    .gray {
        color: #999999;
    }
    /* 导航栏 */
    /* 信息填写 */
    .infoFilling {
        /*margin-top: 80px;*/
        width: 750px;
        padding-left: 33px;
        padding-right: 33px;
        flex-direction: column;
        background-color: #fff;
    }
    .infoItem {
        /*align-items: center;*/
        height: 96px;
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #e4e4e4;
    }
    .input {
        margin-left: 80px;
        width: 500px;
        height: 94px;
        placeholder-color:#999;
    }
    .infoType {
        line-height: 94px;
    }
    .sex {
        padding-left: 30px;
        padding-right: 30px;
    }
    .sexCheckedImgBox {
        width: 36px;
        height: 36px;
        margin-right: 16px;
    }
    .sexCheckedImg {
        width: 36px;
        height: 36px;
        border-radius: 20px;

    }
    .sexCheckedIcon {
        width: 36px;
        height: 36px;
        border-radius: 50px;
        border-width: 3px;
        border-style: solid;
        border-color: #c3c3c3;
        margin-right: 16px;
    }
    .jcSb {
        justify-content: space-between;
    }
    .addressIcon {
        width: 30px;
        height: 35px;
        margin-left: 50px;
        margin-right: 16px;
    }
    .arrowIcon {
        width: 20px;
        height: 20px;
    }
    .addressType {
        width: 95px;
        height: 48px;
        border-width: 2px;
        border-style: solid;
        border-color: #bbbbbb;
        border-radius: 6px;
        margin-left: 30px;
    }
    .addressTypeChecked {
        border-width: 2px;
        border-style: solid;
        border-color: #53beb7;
        background-color: #d7f9ef;
    }
    /* 提示弹出层 */
</style>

