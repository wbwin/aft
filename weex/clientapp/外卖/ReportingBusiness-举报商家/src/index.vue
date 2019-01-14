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
                <text :style="GLOBAL.headerCenter"  slot="middle">举报商家</text>
            </wxc-minibar>
        </div>

        <scroller class="scroller" show-scrollbar="false" >
            <div class="report_headers">
                <div class="report_div report_borderBottom">
                    <div class="report_type">
                        <text class="report_typeText" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">举报类型</text>
                        <div class="report_typePick" @click="pickReportTypeClick()">
                            <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{reportTypeData[reportTypeIndex]}}</text>
                            <image class="ic_arrow_down_gray" src="https://image.aftdc.com/appBimg/ic_arrow_down_gray.png"></image>
                        </div>
                    </div>
                    <text class="report_typeTip" v-if="reportTypeTipData[reportTypeIndex]" :style="{fontSize:GLOBAL.smallFS,color:'#fb5147'}">{{reportTypeTipData[reportTypeIndex]}}</text>
                </div>
                <div class="report_div">
                    <div class="aiCenter">
                        <text :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">联系电话</text>
                        <text :style="{fontSize:GLOBAL.smallFS,color:'#999'}">（手机号作为奖励唯一依据）</text>
                    </div>
                    <input class="input" maxlength="11" placeholder="仅阿凡提外卖工作人员可见" :style="GLOBAL.inputText" type="text" v-model="reportPhone" ref="ref_phone"/>
                </div>

            </div>
            <div class="report_content">
                <textarea class="report_textarea" maxlength="200"  placeholder="请详细描述举报内容，美团外卖将为您的信息保密···" v-model="reportContent" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}"></textarea>
                <div class="report_image">
                    <div class="report_localImg" v-for="(item,index) in reportImage" >
                        <image class="localImg" style="border-radius: 10px;" :src="item"></image>
                        <image src="https://image.aftdc.com/appBimg/icon_send_post_delete.png" class="delIcon" @click="delImgClick(index)"></image>
                    </div>

                    <image v-if="reportImage.length<3" src="https://image.aftdc.com/images/upload.png" class="localImg" @click="selectImg"></image>
                </div>
            </div>
            <div class="report_botton"  @click="reportBottonClick()">
                <text :style="{fontSize:GLOBAL.bigFS,color:'#fff'}">提交举报</text>
            </div>
        </scroller>
        <!--查看大图弹框-->
        <toast ref="toast"></toast>
    </div>


</template>

<script>
    import Toast from './Toast.vue';
    import {WxcMask, WxcMinibar,WxcPopup } from 'weex-ui';
    const post = weex.requireModule('stream');
    const animation = weex.requireModule('animation')
    const modal = weex.requireModule('modal')
    const dom = weex.requireModule('dom')
    const event=weex.requireModule('event')
    const GLOBAL = require('@/Global.vue');
    const navigator = weex.requireModule('navigator');
    const picker = weex.requireModule('picker')
    export default {
        components: {WxcMask, WxcMinibar,WxcPopup,Toast},
        name: 'App',
        data() {
            return {
                shopId:'',
                qualificationImg:'',
                //查看大图
                viewportHeight:'',//屏幕高度
                enlargeImageShow:false,
                firstShowImg:0,//打开的图片下标
                enlargeImageList:[],
                reportPhone:'',
                reportContent:'',
                reportTypeData:['请选择','餐厅刷单','外卖价格高于店内价格','商家资质问题','其他'],
                reportTypeIndex:0,
                reportTypeTipData:['','*餐厅教唆、怂恿、联合周围商家或用户，制造虚假销量，骗取活动补贴','*餐厅外卖菜品价格高于店内实际价格，骗取外卖补贴优惠','*商家缺少相关资质证书，商家名称与证书上的名称不符等','*其他您认为影响了市场秩序公正的行为'],
                reportImage:[],
                reportImageToUp:[],
                pageBack:false,
            }
        },
        created(){
            var that=this
            event.init();
            that.shopId=weex.config.param
        },
        mounted(){
            var that=this
            setTimeout(function () {
                that.$refs.ref_phone.setTextFormatter({
                    formatRule: "/(\\.\\d{2})(\\S+)/",
                    formatReplace: "$1",
                    recoverRule: "/\\./g",
                    recoverReplace: ""
                })
            },0)
        },
        methods: {
            pickReportTypeClick(){
                var that=this
                picker.pick({
                    index:that.reportTypeIndex,
                    items:that.reportTypeData,
                    confirmTitleColor:'#53beb7',
                    cancelTitleColor:'#666',
                },event => {
                    if (event.result === 'success') {
                        that.reportTypeIndex = event.data
                    }
                })
            },
            //选择图片
            selectImg:function () {
                var that=this;
                var imgNum = that.reportImage.length;
                event.selectImg(3-imgNum,'')
            },
            delImgClick(index){
                var that=this;
                that.reportImage.splice(index,1)
                that.reportImageToUp.splice(index,1)
            },
            reportBottonClick(){
                var that = this;
                const toast = that.$refs.toast;
                //获取token和sign


                if (!that.reportTypeIndex) {

                    toast.editContent('请选择举报类型');
                    return false
                }
                if (!that.reportPhone) {
                    toast.editContent('请填写联系号码');
                    return false
                }

                if (!(/^((\+?86)|(\(\+86\)))?1[34578]\d{9}$/.test(that.reportPhone))) {
                    toast.editContent('请填写正确号码');
                    return false;
                }
                if (!that.reportContent) {
                    toast.editContent('请填写举报内容');
                    return false
                }





                if(that.reportImageToUp.length>0){
                    // event.showLoading();
                    post.fetch({
                        method: 'POST',
                        type: 'json',
                        body: param,
                        url: 'https://www.aftdc.com/userapp/Order/uploadOss',
                        headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    },function(res){
                        // var waterMarkStr = event.find('shopName');
                        var waterMarkStr = '';
                        for(var i in that.reportImage){
                            event.uploadImg(res.data.AccessKeyId,res.data.AccessKeySecret,res.data.SecurityToken,that.reportImageToUp[i],that.reportImage[i],waterMarkStr);
                        }
                    });
                }
                var param = that.GLOBAL.sign(that.token,that.imei);
                param+= '&replyType=' + that.reportTypeIndex+'&content=' + that.reportContent+'&phone=' + that.reportPhone+'&shopId=' + that.shopId+'&img=' + JSON.stringify(that.reportImageToUp);
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: 'https://www.aftdc.com/userapp/Index/reportShop',
                }, function (res) {
                    if (res.data.res ==1){
                        setTimeout(()=>navigator.pop({ animated: 'true' }),1000);
                    }
                    const toast = that.$refs.toast;
                    toast.editContent(res.data.info);
                })
            },
            minibarLeftButtonClick(){},
            //监听页面返回
            viewdisappear() {
                let self = this;
                self.pageBack = true;
            },
            viewappear() {
                var that = this;
                if (!that.pageBack) { return; }
                that.pageBack = false;

                var imageList = event.find("imageList");
                if(imageList){
                    imageList = JSON.parse(imageList);
                    // var imageList=that.pictureLocal;
                    for(var i in imageList){
                        var houzui = imageList[i].substring(imageList[i].lastIndexOf("."), imageList[i].length)
                        var reportImg = 'shops/'+that.shops+'/'+'coverImg/'+Date.parse(new Date())/1000+parseInt(Math.random()*10000+1)+ houzui;
                        that.reportImageToUp.push(reportImg);
                        that.reportImage.push(imageList[i]);
                    }
                    event.delete('imageList')
                }
            },
        },

    }
</script>

<style scoped>
    .scroller{
        flex: 1;
        flex-direction: column;
        background-color: #f1f1f1;
    }
    .aiCenter{
        flex-direction: row;
        align-items: center;
    }
    .report_headers{
        margin-top: 30px;
        padding-left: 30px;
        padding-right: 30px;
        border-top-width: 1px;
        border-top-style: solid;
        border-top-color: #dedede;
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: #dedede;
        background-color: #fff;
    }
    .report_div{
        padding-top: 20px;
        padding-bottom: 20px;
    }
    .report_borderBottom{
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: #dedede;
    }
    .report_type{
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
    .report_typeText{
        flex: 1;
    }
    .report_typePick{
        flex: 2;
        padding-left: 20px;
        padding-right: 20px;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding-top: 10px;
        padding-bottom: 10px;
        border-width: 1px;
        border-style: solid;
        border-color: #dedede;
    }
    .ic_arrow_down_gray{
        width: 35px;
        height: 35px;
    }
    .report_typeTip{
        flex: 1;
        margin-top: 20px;
    }
    .input{
        flex: 1;
        margin-top: 20px;
    }
    .report_content{
        margin-top: 30px;
        padding-left: 30px;
        padding-right: 30px;
        padding-top: 20px;
        padding-bottom: 20px;
        border-top-width: 1px;
        border-top-style: solid;
        border-top-color: #dedede;
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: #dedede;
        background-color: #fff;
    }
    .report_textarea{
        flex: 1;
        height: 250px;
        lines:5;
    }
    .report_image{
        margin-top: 20px;
        flex: 1;
        flex-direction: row;
        flex-wrap: wrap;
    }
    .report_localImg{
        position: relative;
        width: 150px;
        height: 150px;
        margin-right: 20px;
    }
    .localImg{
        width: 150px;
        height: 150px;
    }
    .delIcon{
        width: 40px;
        height: 40px;
        position: absolute;
        top: 5px;
        right: 5px;
    }
    .report_botton {
        padding-top: 25px;
        padding-bottom: 25px;
        align-items: center;
        width: 690px;
        background-color: #53beb7;
        margin-left: 30px;
        margin-top:30px;
        border-radius: 10px
    }
    .report_botton:active{
        background-color: #53aba5;
    }

</style>
