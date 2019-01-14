<template>
    <div class="evaluate" @viewappear="viewappear" @viewdisappear="viewdisappear">
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
                <text :style="GLOBAL.headerCenter"  slot="middle">评价</text>
            </wxc-minibar>
        </div>

        <!--解决input获取焦点的兼容-->
        <scroller show-scrollbar="false" class="scrollerFiexd" :style="{height:scroHeight}">
            <div class=" enterButton">
                <wxc-button class="okButton" text="提交" :textStyle="GLOBAL.buttonText" :btnStyle="GLOBAL.defaultButton"
                            @wxcButtonClicked="toEnterMessage"></wxc-button>
            </div>
        </scroller>


        <scroller show-scrollbar="false" class="scroller" :style="{bottom:padbottom?'0px':'130px'}" @scroll="scrollMove" @touchstart="touchstart" @touchend="touchend" >
            <!--对骑手的评价-->
            <!--<div class="evaluateTop">-->
            <!--<div class="topOne row">-->
            <!--<div class="topOneIcon">-->
            <!--<image class="topOneIcon" :src="evaluateList.riderIcon"></image>-->
            <!--</div>-->
            <!--<div class="topOneDiv">-->
            <!--<div class="topOneDivTop row">-->

            <!--<div class="shopIconDiv row">-->
            <!--<text class="riderName" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{evaluateList.riderName}}</text>-->
            <!--&lt;!&ndash;<text class="shopIcon" :style="{fontSize:GLOBAL.smallerFS,color:GLOBAL.tColor}">阿凡提专送</text>&ndash;&gt;-->
            <!--</div>-->

            <!--<text class="riderDtails" :style="{fontSize:GLOBAL.smallerFS,color:'#999'}">评价对骑手匿名</text>-->

            <!--</div>-->
            <!--<div class="topOneDivButton row">-->
            <!--<text class="serviceTime" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">{{evaluateList.time}}{{evaluateList.data}}&nbsp;&nbsp;左右送达</text>-->
            <!--<text class="timeInaccurate" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.tColor}" @click="timeInaccurateClick">{{time!==''?data + time:'时间不准'}}</text>-->
            <!--<image class="timeInaccurateIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>-->
            <!--</div>-->
            <!--</div>-->
            <!--</div>-->



            <!--</div>-->

            <!--中间部分内容-->
            <div class="evaluateTop">

                <!--店名-->
                <div class="topOne row">
                    <div class="topOneIcon">
                        <image class="topOneIcon" :src="'https://image.aftdc.com/'+shopImg"></image>
                    </div>
                    <text class="shopName" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{shopName}}</text>
                    <div class="row" @click="anonymousClick" :style="{paddingTop:'15px',paddingBottom:'15px'}">
                        <image class="anonymousIcon" :src="anonymous==1?'https://image.aftdc.com/appBimg/ic_check_box_checked.png':'https://image.aftdc.com/appBimg/ic_check_box_normal.png'"></image>
                        <text class="anonymousText" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">匿名评价</text>
                    </div>
                </div>


                <!--<div class="topTwo row">-->
                <!--<div class="dissatisfied row" @click="satisfiedClick(0)" :style="{backgroundColor:dissatisfied===0?'#53beb7':''}">-->
                <!--<image class="dissatisfiedIcon"  src="https://image.aftdc.com/appBimg/satisfied_icon.png"></image>-->
                <!--<text class="dissatisfiedText" :style="{fontSize:GLOBAL.defaultFS,color:dissatisfied===0?'#fff':GLOBAL.dColor}">不满意</text>-->
                <!--</div>-->
                <!--<div class="dissatisfied row" @click="satisfiedClick(1)" :style="{backgroundColor:dissatisfied===1?'#53beb7':''}">-->
                <!--<image class="satisfiedIcon" src="https://image.aftdc.com/appBimg/satisfiedColor_icon.png"></image>-->
                <!--<text class="dissatisfiedText" :style="{fontSize:GLOBAL.defaultFS,color:dissatisfied===1?'#fff':GLOBAL.dColor}">满意</text>-->
                <!--</div>-->
                <!--</div>-->

                <!--不满意标签-->
                <!--<div class="details row" :style="{height:dissatisfied===0?'':'0px'}">-->
                <!--<text class="detailsText" :style="{fontSize:GLOBAL.smallFS,color:item.select?GLOBAL.tColor:GLOBAL.dColor,borderColor:item.select?'#53beb7':'#e1e1e1'}" v-for="(item,index) in dissatisfiedList" :key="index" @click="dissatisfiedTwoClick(index)">{{item.text}}</text>-->
                <!--</div>-->


                <!--星星-->
                <text class="evaluateText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{goodsScore==1?'"非常不满意"':goodsScore==2?'"不满意"':goodsScore==3?'"满意"':goodsScore==4?'"非常满意"':goodsScore==5?'"极其满意"':'请选择星评'}}</text>
                <div class="starIconDiv">
                    <image class="starIcon" src="https://image.aftdc.com/appBimg/icon_wuxing_nocolor.png"></image>
                    <div class="starDiv">
                        <div class="starSmallDivOne">
                            <div class="starSmallDiv" :style="{width:goodsScore==0?'1px':goodsScore*60}">
                                <image class="starIcon" src="https://image.aftdc.com/appBimg/icon_wuxing_color.png"></image>
                            </div>
                            <div class="starClickDiv row">
                                <text :style="{width: '60px',height: '48px'}" @click="starClickDivClick(index)" v-for="index in 5" :key="index"></text>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flavor" :style="{height:goodsScore==0?'0px':''}">

                    <!--服务、配送、口味、包装-->
                    <div class="flavorOne row" v-for="(item,index) in scoreList" :key="index">
                        <div class="flavorOneDiv row">
                            <text class="flavorTextBig" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">{{item.name}}</text>
                            <text class="flavorTextSmall" :style="{fontSize:GLOBAL.smallerFS,color:GLOBAL.dColor}">(必选)</text>
                        </div>

                        <div class="flavorIconDiv row">
                            <image class="flavorIcon" src="https://image.aftdc.com/appBimg/dissatisfiedShallow_icon.png" v-for="indexI in 5" :key="indexI" :style="{marginRight:indexI<5?'25px':'0px'}"></image>
                            <div class="flavorIconDivSmall row" :style="{width:item.flavorStar==0?'1px':item.flavorStar*60+'px'}">
                                <image class="flavorIcon" :src="item.flavorStar>=2?'https://image.aftdc.com/appBimg/satisfiedColor_icon.png':'https://image.aftdc.com/appBimg/satisfied_icon.png'" v-for="indexI in 5" :key="indexI" :style="{marginRight:indexI<5?'25px':'0px'}"></image>
                            </div>
                            <div class="row" style="position: absolute;left: 0;top: 0;">
                                <text v-for="indexI in 5" :key="indexI" :style="{width:'60px',height:'40px'}" @click="flavorClick(index,indexI)"></text>
                            </div>
                        </div>
                        <text class="flavorText" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">{{item.flavorStar==1?'非常不满意':item.flavorStar==2?'不满意':item.flavorStar==3?'满意':item.flavorStar==4?'非常满意':item.flavorStar==5?'极其满意':''}}</text>
                    </div>

                </div>

                <!--满意标签-->
                <div class="details row">
                    <text class="detailsText" :style="{fontSize:GLOBAL.smallFS,color:item.select?GLOBAL.tColor:GLOBAL.dColor,borderColor:item.select?'#53beb7':'#e1e1e1'}" v-for="(item,index) in satisfiedList" :key="index" @click="dissatisfied(index)">{{item.text}}</text>
                </div>

                <!--评价输入框-->
                <div class="textareaDiv">
                    <textarea class="textarea" placeholder="亲,菜品口味如何,对包装服务等还满意吗?" ref="firInput"  @focus="allFocus" @blur="blur" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}" rows="4" maxlength="200"   v-model="content"></textarea>
                    <text class="inputSmall" :style="{fontSize:GLOBAL.smallFS}">{{content.length>0?content.length+'/200':'最多输入200个字'}}</text>
                </div>

                <!--上传图片-->
                <div class="imgList">
                    <div class="imgDiv" v-for="(item,index) in pictureLocal" :key="index">
                        <image class="img" :src="item"></image>
                        <text class="delIcon" @click="delClick(index)">-</text>
                    </div>
                </div>

                <div class="picture row" v-if="picture.length<9">
                    <div class="pictureDiv" @click="pictureClick">
                        <image class="pictureIcon" src="https://image.aftdc.com/appBimg/icon_add_photo.png"></image>
                    </div>
                    <div class="textDiv">
                        <text class="textDivOne" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">上传图片</text>
                        <text class="textDivTwo" :style="{fontSize:GLOBAL.smallerFS}">内容丰富的评价有机会成为优质评价哦</text>
                    </div>
                </div>

            </div>

        </scroller>
        <div class=" enterButton" v-if="!scroHeight">
            <wxc-button class="okButton" text="提交" :textStyle="GLOBAL.buttonText" :btnStyle="GLOBAL.defaultButton"
                        @wxcButtonClicked="toEnterMessage"></wxc-button>
        </div>


        <Toast ref="toast"></Toast>
        <!--时间不准-->
        <!--<wxc-popup popup-color="rgb(255,255,255)"-->
        <!--:show="timeShow"-->
        <!--@wxcPopupOverlayClicked="popupOverlayBottomClick"-->
        <!--pos="bottom"-->
        <!--ref="show"-->
        <!--height="650">-->
        <!--<div class="row">-->
        <!--<scroller style="flex: 1;height: 560px;background-color: #f1f1f1" show-scrollbar="false">-->
        <!--<text class="selectTimeText" :class="[item.select?'selectClass':'']" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}" ref="itemB"  v-for="(item,index) in timeList" :key="index" @click="timeOneClick(index)">{{item.time}}</text>-->
        <!--</scroller>-->
        <!--<scroller style="flex: 2;height: 560px" show-scrollbar="false">-->
        <!--<div class="selectTimeDiv" v-for="(item,index) in timeListTwo" :key="index" @click="timeTwoClick(index)" ref="itemC">-->
        <!--<text class="selectTimeTextTwo" :style="{fontSize:GLOBAL.defaultFS,color:item.timeTwoSelect?'#4d6f8e':GLOBAL.dColor}">{{item.time}}</text>-->
        <!--<image class="selectTimeIcon" src="https://image.aftdc.com/appBimg/icon_choiceTrue.png" v-if="item.timeTwoSelect"></image>-->
        <!--</div>-->
        <!--</scroller>-->
        <!--</div>-->
        <!--<text class="tablewareCancel" @click="tablewareCancelClickTwo" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">取消</text>-->
        <!--</wxc-popup>-->
    </div>
</template>

<script>
    import { WxcMask,WxcMinibar,WxcButton,WxcPopup} from 'weex-ui';
    const clipborad = weex.requireModule('clipboard')
    const post = weex.requireModule('stream');
    const animation = weex.requireModule('animation');
    const modal = weex.requireModule('modal');
    const event = weex.requireModule('event');
    const dom = weex.requireModule('dom');
    const GLOBAL = require('@/Global.vue');
    const navigator = weex.requireModule('navigator')
    import Toast from './Toast.vue';
    export default {
        components: { WxcMask,WxcMinibar,WxcButton,WxcPopup,Toast},
        name: 'App',
        data () {
            return {
                scroHeight:0,
                isTouchStart:false,
                padbottom:false,
                timeShow:false,
                briding:'',
                bridingTwo:0,
                data:'',//日期
                time:'',//时间

                // timeList:[
                //     //                  默认↓         默认↓
                //     {time:'7月22日',select:false,change:false},
                //     {time:'今天',select:false,change:false},
                // ],//时间列表
                //
                // timeListTwo:[
                //     //                  默认
                //     {time:'12:00',timeTwoSelect:false},
                //     {time:'13:00',timeTwoSelect:false},
                //     {time:'14:00',timeTwoSelect:false},
                //     {time:'15:00',timeTwoSelect:false},
                //     {time:'16:00',timeTwoSelect:false},
                //     {time:'17:00',timeTwoSelect:false},
                //     {time:'18:00',timeTwoSelect:false},
                // ],//时间列表2

                // evaluateList:{
                //     riderIcon:'https://image.aftdc.com/appBimg/ic_app_logo.jpg',
                //     riderName:'东方彧卿',
                //     time:'今天',
                //     data:'00:15',
                //     flavorStar:'',
                //     packingStar:'',
                // },

                satisfiedList:[
                    {text:'准时送达',select:false},
                    {text:'商品完整',select:false},
                    {text:'配送快',select:false},
                    {text:'送货快',select:false},
                    {text:'整洁卫生',select:false},
                    {text:'骑手服务好',select:false},
                ],
                packingList:[
                    {image:'https://image.aftdc.com/appBimg/satisfied_icon.png'},
                    {image:'https://image.aftdc.com/appBimg/satisfied_icon.png'},
                    {image:'https://image.aftdc.com/appBimg/satisfied_icon.png'},
                    {image:'https://image.aftdc.com/appBimg/satisfied_icon.png'},
                    {image:'https://image.aftdc.com/appBimg/satisfied_icon.png'},
                ],


                goodsScore:0,//星评数量
                anonymous:1,//匿名评价
                content:'',
                orderId:'',
                shopId:'',
                orderType:'',
                tk:'',
                shopImg:'',
                shopName:'',
                // pictureLocal:['1.png','23.png','3.png','4.png','5.png','6.png',],
                // picture:['1.png','23.png','3.png','4.png','5.png','6.png',],
                pictureLocal:[],
                picture:[],
                token:'',
                imei:'',


                scoreList:[
                    {name:'服务',flavorStar:0,},
                    {name:'口味',flavorStar:0,},
                ],

                pageBack: true,
            }
        },
        methods:{

            //监听页面返回
            viewdisappear() {
                this.pageBack = true;
            },

            viewappear(){

                var that=this;
                // if (!that.pageBack) { return; }
                // that.pageBack = false;
                //
                var imageList = event.find("imageList");

                if(imageList){
                    imageList = JSON.parse(imageList);
                    // var imageList=that.pictureLocal;
                    for(var i in imageList){
                        var houzui = imageList[i].substring(imageList[i].lastIndexOf("."), imageList[i].length)
                        var articleImg = 'user/'+'43/'+'goods_appraise/'+Date.parse(new Date())/1000+parseInt(Math.random()*10000+1)+ houzui;
                        that.picture.push(articleImg);
                        that.pictureLocal.push(imageList[i]);
                    }
                    event.delete('imageList')
                }
            },

            delClick(index){
                var that=this;
                that.pictureLocal.splice(index,1);
                that.picture.splice(index,1);
            },

            pictureClick(){
                var imgNum = this.pictureLocal.length;

                event.selectImg(9-imgNum,'')
            },//添加图片




            popupOverlayBottomClick(){
                this.timeShow=false;
            },
            // packingClick(index){
            //     this.evaluateList.packingStar=index+1;
            // },
            flavorClick(index,indexI){
                var that=this;
                that.scoreList[index].flavorStar=indexI
            },

            starClickDivClick(index){
                var that=this;
                that.goodsScore=index;
            },

            anonymousClick(){
                var that=this;
                if(that.anonymous==1){
                    that.anonymous=0
                }
                else{
                    that.anonymous=1
                }
            },


            dissatisfied(index){
                var that=this;
                if(that.satisfiedList[index].select){
                    that.satisfiedList[index].select=false;
                }
                else{
                    this.satisfiedList[index].select=true;
                }

            },

            toEnterMessage:GLOBAL.throttle(function () {

                var that=this;
                if(!that.goodsScore){
                    const toast =that.$refs.toast;
                    toast.editContent('请选择星评');
                    return false;
                }
                for(var i in that.scoreList){
                    if(that.scoreList[i].flavorStar==0){
                        const toast =that.$refs.toast;
                        toast.editContent('当前有必选项未填');
                        return false;
                    }
                }

                // 服务
                var serviceScore=that.scoreList[0].flavorStar;

                // 配送
                var taste=that.scoreList[1].flavorStar;

                // 口味、包装
                if(that.orderType==0){
                    var timeScore=that.scoreList[2].flavorStar;
                    var wrap=that.scoreList[3].flavorStar;
                }
                else{
                    var timeScore=0;
                    var wrap=0;
                }

                // 标签选择
                var tagStr='';
                for(var i in that.satisfiedList){
                    if(that.satisfiedList[i].select){
                        tagStr+=that.satisfiedList[i].text+(i==that.satisfiedList.length-1?'':',')
                    }
                }

                var param = this.GLOBAL.sign(this.token,this.imei);


                if(that.picture.length>0){
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
                        for(var i in that.pictureLocal){
                            event.uploadImg(res.data.AccessKeyId,res.data.AccessKeySecret,res.data.SecurityToken,that.picture[i],that.pictureLocal[i],waterMarkStr);
                        }
                    });
                }



                param+='&orderId='+that.orderId + '&shopId='+that.shopId + '&orderType='+that.orderType + '&goodsScore='+that.goodsScore +
                    '&anonymous='+that.anonymous + '&content='+that.content + '&serviceScore='+serviceScore+ '&taste='+taste + '&timeScore='+timeScore +
                    '&wrap='+wrap + '&goodsScore='+that.goodsScore  + '&imgArr='+JSON.stringify(that.picture);

                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: 'https://www.aftdc.com/userapp/Order/addGoodsAppraises',
                }, function (res) {

                    if(res.data.res==1){

                        setTimeout(function () {
                            navigator.pop({animated:'false'});
                        },1000)

                        const toast =that.$refs.toast;
                        toast.editContent(res.data.info);

                    }
                    else{
                        const toast =that.$refs.toast;
                        toast.editContent(res.data.info);
                    }
                })
            }),
            minibarLeftButtonClick(){
                navigator.pop({animated:'false'});
            },

            satisfiedClick(index){
                var that=this;
                if(that.dissatisfied!=index){
                    for(var i in that.satisfiedList){
                        that.satisfiedList[i].select=false;
                    }
                    for(var i in that.dissatisfiedList){
                        that.dissatisfiedList[i].select=false;
                    }

                }
                that.dissatisfied=index;
            },

            allFocus(){
                var that=this;
                that.padbottom=true;
                setTimeout(() => {
                    dom.getComponentRect('viewport', option => {
                        if (option.result && option.size) {
                            that.scroHeight = option.size.height-90;
                        }
                    })
                    console.log(that.scroHeight)
                }, 30)
            },
            blur(){
                var that=this;
                that.padbottom=false;
            },

            scrollMove(){
                var that=this;
                if(that.isTouchStart){
                    that.$refs.firInput.blur();
                }

            },
            touchstart(){
                var that=this;
                that.isTouchStart=true;
            },
            touchend(){
                var that=this;
                that.isTouchStart=false;
            },
        },
        mounted(){
            this.timeList[0].select=true;
            this.briding=0;
        },
        created(){

            event.init();
            var that=this;
            var paramI = weex.config.param;
            paramI = JSON.parse(paramI);
            that.orderId=paramI.orderId;
            that.shopId=paramI.shopId;
            that.orderType=paramI.orderType;
            that.shopImg=paramI.shopImg;
            that.shopName=paramI.shopName;
            that.token = weex.config.token;
            that.imei = weex.config.imei;

            // 判断如果是代金券，则只有服务和口味
            if(that.orderType==0){

                that.scoreList=[
                    {name:'服务',flavorStar:0,},
                    {name:'口味',flavorStar:0,},
                    {name:'配送',flavorStar:0,},
                    {name:'包装',flavorStar:0,},
                ];

            }
        },
    }
</script>

<style scoped>
    .tablewareCancel{
        padding-top: 25px;
        padding-bottom: 25px;
        width: 750px;
        border-top-style: solid;
        border-top-width: 2px;
        border-top-color: #f1f1f1;
        text-align: center;
    }
    .selectTimeIcon{
        width: 40px;
        height: 40px;
        margin-right: 20px;
    }
    .selectTimeDiv{
        flex-direction: row;
        align-items: center;
        width: 500px;
    }
    .selectTimeTextTwo{
        flex: 1;
        padding-left: 30px;
        padding-top: 30px;
        padding-bottom: 30px;
        font-size: 30px;
        color: #666;
    }
    .selectTimeText{
        width: 250px;
        text-align: center;
        padding-top: 30px;
        padding-bottom: 30px;
        background-color: #f1f1f1;
    }
    .selectClassTwo{
        color: #4d6f8e;
    }
    .selectClass{
        background-color: #fff;
    }
    .flavorIconDivSmall{
        position: absolute;
        left: 0;
        top: 0;
        overflow: hidden;
        background-color: #fff;
    }
    .flavorIconDiv{
        position: relative;
    }
    .flavorIcon{
        width: 40px;
        height: 40px;
    }
    .flavorOneDiv{
        width: 130px;
    }
    .flavorText{
        width: 130px;
        text-align: left;
    }
    .flavorOne{
        justify-content: space-between;
        margin-top: 20px;
        margin-bottom: 20px;
    }
    .flavor{
    }
    .starClickDiv{
        position: absolute;
        left: 0;
        top: 0;
    }
    .detailsText{
        width: 199px;
        margin-left: 10px;
        margin-right: 10px;
        height: 60px;
        line-height: 60px;
        text-align: center;
        border-style: solid;
        border-width: 1px;
        margin-bottom: 15px;
        border-radius: 3px;
    }
    .details{
        flex-wrap: wrap;
        overflow: hidden;
    }
    .minibar {
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: #f1f1f1;
    }
    .enterButton {
        position: absolute;
        bottom: 0;
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
    .okButton:enabled {
        background-color: #53beb7;
    }
    .zanText{
        margin-left: 5px;
    }
    .zanIconOne{
        width: 32px;
        height: 32px;
    }
    .zanIconTwo{
        width: 32px;
        height: 32px;
        transform:rotate(180deg);
    }
    .zanDiv{
        border-style: solid;
        border-width: 1px;
        height: 40px;
        width: 90px;
        justify-content: center;
        border-radius: 30px;
    }
    .fabulousText{
        flex: 1;
    }
    .fabulous{
        padding-top: 30px;
        padding-bottom: 30px;
    }
    .textDivTwo{
        margin-top: 10px;
        color: #999;
    }
    .textDiv{
        margin-left: 20px;
    }
    .pictureIcon{
        width: 60px;
        height: 60px;
    }
    .pictureDiv{
        padding-top: 30px;
        padding-bottom: 30px;
        padding-left: 30px;
        padding-right: 30px;
        border-style: solid;
        border-width: 1px;
        border-color: #e1e1e1;
        border-radius: 5px;
    }
    .picture{
        padding-bottom: 20px;
        border-bottom-style: solid;
        border-bottom-width: 1px;
        border-bottom-color: #f8f8f8;
    }
    .img{
        width: 146px;
        height: 146px;
        border-radius: 5px;
    }
    .imgDiv{
        width: 165px;
        height: 165px;
        padding-right: 20px;
        padding-top: 20px;
        border-radius: 5px;
        position: relative;
    }
    .delIcon{
        width: 40px;
        height: 40px;
        background-color: #fd4f4b;
        color: #fff;
        line-height: 30px;
        text-align: center;
        padding-right: 2px;
        position: absolute;
        top: 10px;
        right: 10px;
        border-radius: 20px;
        font-size: 80px;
    }
    .imgList{
        flex-direction: row;
        flex-wrap: wrap;
        padding-bottom: 20px;
    }
    .textareaDiv{
        position: relative;
    }
    .inputSmall{
        position: absolute;
        right: 20px;
        bottom: 20px;
        color: #999;
    }
    .textarea{
        height: 200px;
        padding-top: 20px;
        padding-left: 20px;
        padding-right: 20px;
        padding-bottom: 20px;
        background-color: #f8f8f8;
        border-radius: 10px;
    }
    .evaluateText{
        text-align: center;
        padding-top: 35px;
    }
    .starIconDiv{
        position: relative;
        align-items: center;
        justify-content: center;
        height: 110px;
        flex: 1;
    }
    .starSmallDivOne{
        width: 300px;
        height: 48px;
        position: relative;
    }
    .starSmallDiv{
        height: 48px;
        overflow: hidden;
    }
    .starDiv{
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        justify-content: center;
        align-items: center;
    }
    .starIcon{
        width: 300px;
        height: 48px;
    }
    .anonymousText{
        margin-left: 5px;
    }
    .anonymousIcon{
        width: 25px;
        height: 25px;
    }
    .shopName{
        flex: 1;
        margin-left: 20px;
    }
    .dissatisfiedText{
        margin-left: 10px;

    }
    .satisfiedIcon{
        width: 28px;
        height: 28px;
    }
    .dissatisfiedIcon{
        width: 25px;
        height: 25px;
    }
    .dissatisfied{
        padding-top: 15px;
        padding-bottom: 15px;
        width: 200px;
        justify-content: center;
        border-style: solid;
        border-width: 1px;
        border-color: #e1e1e1;
        border-radius: 50px;
    }
    .topTwo{
        padding-top: 30px;
        padding-bottom: 30px;
        padding-left: 110px;
        padding-right: 110px;
        justify-content: space-between;
    }
    .timeInaccurateIcon{
        margin-left: 10px;
        width: 20px;
        height: 20px;
    }
    .timeInaccurate{
    }
    .serviceTime{
        flex: 1;
    }
    .topOneDivButton{
        margin-left: 20px;
        margin-top: 20px;
        flex: 1;
    }
    .shopIconDiv{
        margin-left: 20px;
    }
    .shopIcon{
        margin-left: 20px;
        padding-left: 2px;
        padding-right: 2px;
        border-radius: 3px;
        border-style: solid;
        border-width: 1px;
        border-color: #53beb7;
    }
    .topOneDiv{
        flex: 1;
    }
    .topOneDivTop{
        justify-content: space-between;
    }
    .topOneIcon{
        width: 73px;
        height: 73px;
        border-radius: 40px;
    }
    .topOne{
        border-bottom-style: solid;
        border-bottom-width: 2px;
        border-bottom-color: #f8f8f8;
        padding-top: 20px;
        padding-bottom: 20px;
        flex: 1;
    }
    .evaluateTop{
        margin-left: 20px;
        margin-right: 20px;
        padding-left: 25px;
        padding-right: 25px;
        background-color: #fff;
        margin-top: 20px;
    }
    .evaluate{
        background-color: #f8f8f8;
    }
    .scroller{
        flex: 1;
        width: 750px;
        position: absolute;
        top: 90px;
        opacity: 1;
    }
    .scrollerFiexd{
        width: 750px;
        position: relative;
    }
    .row{
        flex-direction: row;
        align-items: center;
    }
</style>
