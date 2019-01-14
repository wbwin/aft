<template>
    <div class="wrapper" @viewappear="viewappear" @viewdisappear="viewdisappear">
        <!-- 导航栏 -->

        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    v-once>
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">{{source === 0 ? '选择收货地址' : '我的收货地址'}}</text>
            </wxc-minibar>
        </div>

        <!-- 地址列表 -->
        <list class="scroller"  show-scrollbar="false" >
            <!-- 可以配送 -->
            <cell class="distributionAddressList" v-if="addressList.length>0">
                <div class="addressItem row aiCenter"  v-for="(item,index) in addressList" @click="selectAddress(index)">
                    <div class="default jcCenter" v-if="source === 0">
                        <div class="checkedDefault">
                            <image class="checkedDefault" src="https://image.aftdc.com/appBimg/ic_check_box_checked.png" v-if="item.isDefault"></image>
                        </div>
                    </div>
                    <div class="addressInfo" >
                        <div class="itemAddress row aiCenter">
                            <!--<div class="ItemAddressIcon companyIcon aiCenter jcCenter" v-if="item.addressType=='公司'">-->
                            <!--<text class="companyText" :style="{fontSize:GLOBAL.smallFS}">公司</text>-->
                            <!--</div>-->
                            <!--<div class="ItemAddressIcon homeIcon aiCenter jcCenter"  v-if="item.addressType=='家'">-->
                            <!--<text class="homeText" :style="{fontSize:GLOBAL.smallFS}">家</text>-->
                            <!--</div>-->
                            <!--<div class="ItemAddressIcon schoolIcon aiCenter jcCenter"  v-if="item.addressType=='学校'">-->
                            <!--<text class="schoolText" :style="{fontSize:GLOBAL.smallFS}">学校</text>-->
                            <!--</div>-->
                            <text class="itemAddressText black"darkGray :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.address}}&nbsp;&nbsp;{{item.detailed}}</text>
                        </div>
                        <div class="row mt16">
                            <text class="lightGray userName" :style="{fontSize:GLOBAL.bigFS}">{{ item.userName }}</text>
                            <text class="lightGray" :style="{fontSize:GLOBAL.bigFS}">&nbsp;&nbsp;&nbsp;{{item.userSex==1?'先生':item.userSex==1?'女士':'保密'}}&nbsp;&nbsp;&nbsp;&nbsp;{{ item.userPhone }}</text>
                        </div>
                    </div>
                    <div class="edit aiCenter" @click="toAddReceivingAddress(1,index,1)">
                        <image class="editIcon" src="https://image.aftdc.com/appBimg/ic_edit.png"></image>
                    </div>
                </div>
            </cell >
            <!-- 超出配送范围 -->
            <cell class="eyondTheScope" v-if="eyondTheScope.length>0 && source === 0">
                <text class="eyondTheScopeText"  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">超出配送范围</text>
                <div class="addressItem row aiCenter" v-for="(item,index) in eyondTheScope"  @click="openMask(index)">
                    <div class="default jcCenter">
                    </div>
                    <div class="addressInfo">
                        <div>
                            <div class="itemAddress row aiCenter">
                                <!--<div class="ItemAddressIcon companyIcon aiCenter jcCenter" v-if="item.addressType=='公司'">-->
                                <!--<text class="companyText" :style="{fontSize:GLOBAL.smallFS}">公司</text>-->
                                <!--</div>-->
                                <!--<div class="ItemAddressIcon homeIcon aiCenter jcCenter"  v-if="item.addressType=='家'">-->
                                <!--<text class="homeText" :style="{fontSize:GLOBAL.smallFS}">家</text>-->
                                <!--</div>-->
                                <!--<div class="ItemAddressIcon schoolIcon aiCenter jcCenter"  v-if="item.addressType=='学校'">-->
                                <!--<text class="schoolText" :style="{fontSize:GLOBAL.smallFS}">学校</text>-->
                                <!--</div>-->
                                <text class="itemAddressText lightGray" :style="{fontSize:GLOBAL.bigFS}">{{item.address}}&nbsp;&nbsp;&nbsp;{{item.detailed}}</text>
                            </div>
                            <div class="row mt16">
                                <text class="lightGray userName" :style="{fontSize:GLOBAL.bigFS}">{{ item.userName }}</text>
                                <text class="lightGray" :style="{fontSize:GLOBAL.bigFS}">&nbsp;&nbsp;&nbsp;{{item.userSex==1?'先生':item.userSex==1?'女士':'保密'}}&nbsp;&nbsp;&nbsp;&nbsp;{{ item.userPhone }}</text>
                            </div>
                        </div>
                    </div>
                    <div class="edit aiCenter">

                    </div>
                </div>
            </cell>
        </list>

        <!-- 选择超出配送范围提示弹出层 -->
        <wxc-mask height="510"
                  width="584"
                  border-radius="5"
                  duration="200"
                  mask-bg-color="#FFFFFF"
                  :has-animation="hasAnimation"
                  :has-overlay="true"
                  :show-close="false"
                  :show="show"
                  :overlay-cfg="overlay"
                  @wxcMaskSetHidden="wxcMaskSetHidden">
            <div class="promptInfo aiCenter" @click.stop="preventBubbles">
                <image class="mapIcon" src="http://chuantu.biz/t6/337/1530500231x-1404817575.png"></image>
                <text class="promptInfoText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">该地址不在商家配送范围</text>
                <text class="prompt" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">亲，再确认下您的收获地址吧</text>
                <div class="cancelOrConfirm row">
                    <div class="btn aiCenter jcCenter cancel" @click="wxcMaskSetHidden">
                        <text :style="{fontSize:GLOBAL.bigFS,color:'#777'}">取消</text>
                    </div>
                    <div class="btn aiCenter jcCenter confirm" @click="toAddReceivingAddress(1,'',0)">
                        <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor}">确认位置</text>
                    </div>
                </div>
            </div>
        </wxc-mask>
        <div class="addInvoice aiCenter jcCenter" @click="toAddReceivingAddress(0)">
            <text class="addText" :style="{fontSize:GLOBAL.bigFS}">新建收获地址</text>
        </div>

        <noOrder class="noOrderTwo" img="https://image.aftdc.com/appBimg/icon_no_order.png" textOne="没有设置地址，去设置地址吧~" textTwo="" v-if="addressList.length==0&&eyondTheScope.length==0"></noOrder>

    </div>
</template>

<script>
    import noOrder from './noOrder.vue';
    import { WxcMinibar,WxcMask } from 'weex-ui';
    const GLOBAL = require('@/Global.vue');
    const modal = weex.requireModule('modal');
    const event=weex.requireModule('event');
    const navigator = weex.requireModule('navigator');
    const post = weex.requireModule('stream');
    export default {
        data () {
            return {
                noIndex: 0,//保存点击不可选地址下标
                source: 0,//表示从哪进来，0为下单页，1为个人信息页
                // 选择超出配送范围提示弹出层
                show: false,
                overlayCanClose: true,
                isFalse: false,
                hasAnimation: true,
                overlay: {
                    duration: 200
                },
                // 可配送地址数据
                addressList: [],
                // 不可配送地址数据
                eyondTheScope: [],
                //通用
                userId:0,
                token:'',
                imei:'',
                userPhone:'',
            }
        },
        components: {WxcMinibar,WxcMask,noOrder},
        created(){
            var that=this

            that.token = weex.config.token;
            that.imei = weex.config.imei;
            that.userId = weex.config.userId;
            var param=JSON.parse(weex.config.param)
            that.source = param.source;
            if(param.shopId){
                that.shopId=param.shopId
                that.longitude=param.longitude
                that.latitude=param.latitude
            }
            that.getAddress()
        },


        methods:{
            //获取收货地址
            getAddress(){
                var that=this
                var param=that.GLOBAL.sign(that.token,that.imei)
                if(that.source==0){
                    param+= '&shopId=' + that.shopId +'&&longitude=' + that.longitude +'&&latitude=' + that.latitude;
                }


                var url = 'https://www.aftdc.com/userapp/Index/getAddress'
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    url: url,
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                }, function (res) {
                    if(res.data.res==1){
                        if(that.source === 0) {
                            var address=res.data.data
                            var addressList=[]
                            var eyondTheScope=[]
                            if(event.find('address')){
                                var oldAddress=JSON.parse(event.find('address'))
                            }
                            for(var i in address){
                                if(address[i].beyond){
                                    eyondTheScope.push(address[i])
                                }else{
                                    addressList.push(address[i])
                                    if(event.find('address')&&oldAddress.addressId==address[i].addressId){
                                        address[i].isDefault=true
                                    }
                                }

                            }
                            that.addressList=addressList
                            that.eyondTheScope=eyondTheScope
                        }else {
                            that.addressList=res.data.data
                        }
                    }
                })
            },
            // 导航栏事件
            // 新增地址

            // 选择地址事件
            selectAddress(index){
                if(this.source === 0) {
                    var that=this
                    for(let i in this.addressList){
                        this.addressList[i].isDefault = false
                    }
                    this.addressList[index].isDefault = true
                    if(event.find('orderPageAddress')){
                        event.delete('orderPageAddress')
                    }
                    event.save('orderPageAddress',JSON.stringify(that.addressList[index]))
                    navigator.pop({ animated: 'true' });
                }
            },
            // 选择超出配送范围提示弹出层
            openMask(index){
                this.show = true;
                this.hasAnimation = true
                this.noIndex = index
            },
            wxcMaskSetHidden(){
                this.show = false;
            },
            openNoAnimationMask(e){
                this.show = true;
                this.hasAnimation = false;
            },
            // 阻止事件冒泡
            preventBubbles(){},
            minibarLeftButtonClick(){

            },
            toAddReceivingAddress:GLOBAL.throttle(function(type,index,optional){
                if(type === 0) {
                    var param = ''
                }else {
                    if(optional === 0) {
                        var param = JSON.stringify(this.eyondTheScope[this.noIndex])
                    } else {
                        var param = JSON.stringify(this.addressList[index])
                    }
                }
                var url='http://assets/addReceivingAddress.js'
                event.toUrl({"url":url,"param":param})
            }),
            viewappear(){
                var that=this
                if (!that.pageBack) { return; }
                that.pageBack = false;
                that.getAddress()
            },
            viewdisappear(){
                var that=this
                that.pageBack = true;
            }
        }
    }
</script>

<style scoped>
    .wrapper {
        flex-direction: column;
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
    .mt16 {
        margin-top: 16px;
    }
    .darkGray{
        color: #999;
    }
    .lightGray {
        color: #b2b2b2;
    }

    .userName {
        max-width: 260px;
        text-overflow: ellipsis;
        lines: 1;
    }
    /* 配送地址列表 */
    .scroller {
        position: fixed;
        top: 90px;
        left: 0;
        right: 0;
        bottom: 100px;
        padding-left: 34px;
    }
    /* 可以配送 */
    .distributionAddressList {

    }
    .addressItem {
        flex: 1;
        height: 136px;
    }
    .default {
        flex: 1;
        height: 135px;
    }
    .addressInfo {
        height: 136px;
        justify-content: center;
        flex: 9.5;
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #f5f5f5;
    }
    .edit {
        flex-direction: row-reverse;
        flex: 1.5;
        height: 135px;
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #f5f5f5;
    }
    .checkedDefault {
        width: 36px;
        height: 36px;
        border-radius: 20px;
    }
    .ItemAddressIcon {
        width: 68px;
        height: 34px;
        margin-right: 10px;
    }
    .companyIcon {
        background-color: #e3eefd;
    }
    .companyText {
        color: #3a87f3;
    }
    .homeIcon{
        background-color: #fff3d8;
    }
    .homeText {
        color: #ffb511;
    }
    .schoolIcon{
        background-color: #edf9e5;
    }
    .schoolText {
        color: #8cd75b;
    }
    .itemAddressText {
        max-width: 550px;
        text-overflow: ellipsis;
        lines: 1;
    }
    .editIcon {
        width: 30px;
        height: 30px;
        margin-right: 34px;
    }
    /* 超出配送范围 */
    .eyondTheScope {
    }
    .eyondTheScopeText {
        margin-top: 54px;
        margin-left: 60px;
    }
    /* 超出配送范围提示弹出层 */
    .promptInfo {
        flex: 1;
    }
    .mapIcon {
        width: 230px;
        height: 230px;
        margin-top: 24px;
        margin-bottom: 24px;
    }
    .promptInfoText {
        font-weight: bold;
        margin-bottom: 24px;
    }
    .cancelOrConfirm {
        width: 584px;
        position: absolute;
        bottom: 0;
        border-top-width: 2px;
        border-top-style: solid;
        border-top-color: #f2f2f2;
    }
    .btn {
        flex: 1;
        height: 94px;
    }
    .cancel {
        border-right-width: 1px;
        border-right-style: solid;
        border-right-color: #f2f2f2;
    }
    .confirm {
        border-left-width: 1px;
        border-left-style: solid;
        border-left-color: #f2f2f2;
    }
    .addInvoice {
        width: 750px;
        height: 100px;
        background-color: #53beb7;
        position: fixed;
        left: 0;
        bottom: 0;
    }
    .addText {
        color: white;
    }
</style>

