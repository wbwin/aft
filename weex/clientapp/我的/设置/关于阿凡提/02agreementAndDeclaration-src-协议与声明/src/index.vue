<template>
    <div class="wrapper" >
        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    v-once>
                <image :style="GLOBAL.headerImg" slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter" slot="middle">协议及声明</text>
            </wxc-minibar>
        </div>

        <div class="other">
            <div class="otherItem row aiCenter" @click="jump(index)" v-for="(item,index) in agreementAndDeclaration" :class="[agreementAndDeclaration.length-1 == index ?'zeroBorder':'']" >
                <text class="itemText" :style="{fontSize:GLOBAL.bigFS,color:'#666666'}">{{ item }}</text>
                <image class="itemIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
            </div>
        </div>
    </div>
</template>
<script>
    import {WxcMinibar} from 'weex-ui';
    const event=weex.requireModule('event');
    const navigator = weex.requireModule('navigator');
    export default {
        data() {
            return {
                agreementAndDeclaration:['阿凡提用户协议','隐私政策','商户服务协议','一键连Wi-Fi服务声明','餐饮安全管理办法','价格说明','法律声明']
            }
        },
        components: {WxcMinibar},
        methods: {

            minibarLeftButtonClick(){
                navigator.pop({animated:'false'});
            },
            jump(index){
                if(index==0){
                    let param=''
                    let url='http://assets/aftUserProtocol.js'
                    event.toUrl({"url":url,"param":param})
                }else if(index==1){
                    let param=''
                    let url='http://assets/privacyPolicy.js'
                    event.toUrl({"url":url,"param":param})
                }else if(index==2){
                    let param=''
                    let url='http://assets/merchantServiceAgreement.js'
                    event.toUrl({"url":url,"param":param})
                }else if(index==3){
                    let param=''
                    let url='http://assets/wifiServiceStatement.js'
                    event.toUrl({"url":url,"param":param})
                }else if(index==4){
                    let param=''
                    let url='http://assets/fooSafetyManage.js'
                    event.toUrl({"url":url,"param":param})
                }else if(index==5){
                    let param=''
                    let url='http://assets/priceDescription.js'
                    event.toUrl({"url":url,"param":param})
                }else if(index==6){
                    let param=''
                    let url='http://assets/legalDeclaration.js'
                    event.toUrl({"url":url,"param":param})
                }
            },
        },
        created(){
            event.init();
        },
    }
</script>

<style scoped>
    .wrapper {
        background-color: #f1f1f1;
    }
    .row {
        flex-direction: row;
    }
    .aiCenter {
        align-items: center;
    }
    .other {
        background-color: #fff;
        margin-top: 16px;
    }
    .otherItem {
        justify-content: space-between;
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #dadada;
        padding-top: 32px;
        padding-bottom: 32px;
        padding-left: 25px;
        padding-right: 25px;
    }
    .itemText {

    }
    .itemIcon {
        width: 22px;
        height: 22px;
    }
    .zeroBorder {
        border-bottom-width: 0px;
    }
</style>
