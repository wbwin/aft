<template>
    <div class="wrapper" @viewappear="viewappear" @viewdisappear="viewdisappear" @touchend="touchend" @touchmove="touchmove">
        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    v-once
            >
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">店铺信息</text>
                <!--<text :style="GLOBAL.headerRight"  slot="right">帮助</text>-->
            </wxc-minibar>
        </div>
        <scroller class="scroller" offset-accuracy="10px" @scroll="scrollMove">
            <div>
                <div class="listCellTitle">
                    <text class="titleSize" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">基本信息</text>
                </div>
            </div>
            <div>
                <div class="listCell">
                    <div class="listCellContent">
                        <div class="content_left">
                            <image class="redStar" src="https://image.aftdc.com/appBimg/redStar.png"></image>
                            <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">门店名称</text>
                        </div>
                        <div class="content_right">
                            <input class="input" :style="GLOBAL.inputText" type="text" v-model="shopName" placeholder="请与门脸上名称一致" maxlength="20" ref="scrollOne"/>
                        </div>
                    </div>
                    <div class="listCellContent">
                        <div class="content_left">
                            <image class="redStar" src="https://image.aftdc.com/appBimg/redStar.png"></image>
                            <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">门店电话</text>
                        </div>
                        <div class="content_right">
                            <input class="input" :style="GLOBAL.inputText" type="number"  v-model="stores_phone" placeholder="请填写门店电话" ref="scrollTwo"/>
                        </div>
                    </div>
                    <div class="listCellContent">
                        <div class="content_left">
                            <image class="redStar" src="https://image.aftdc.com/appBimg/redStar.png"></image>
                            <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">联系人姓名</text>
                        </div>
                        <div class="content_right">
                            <input class="input" :style="GLOBAL.inputText" type="text"  v-model="userName" placeholder="请填写联系人姓名" ref="scrollThree"/>
                        </div>
                    </div>
                    <div class="listCellContent">
                        <div class="content_left">
                            <image class="redStar" src="https://image.aftdc.com/appBimg/redStar.png"></image>
                            <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">联系人电话</text>
                        </div>
                        <div class="content_right">
                            <text  :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{phone}}</text>
                        </div>
                    </div>
                    <div class="listCellContent">
                        <div class="content_left">
                            <image class="redStar" src="https://image.aftdc.com/appBimg/redStar.png"></image>
                            <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">邮箱</text>
                        </div>
                        <div class="content_right">
                            <input class="input" :style="GLOBAL.inputText" type="email"  v-model="email" placeholder="请填写邮箱" ref="scrollFour"/>
                        </div>
                    </div>

                    <!--门店分类-->
                    <div class="listCellContent">
                        <div class="content_left">
                            <image class="redStar" src="https://image.aftdc.com/appBimg/redStar.png"></image>
                            <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">门店分类</text>
                        </div>
                        <div class="content_right content_right_choice" @click="toClassificationOfcuisine">
                            <text :style="{fontSize:GLOBAL.defaultFS,color:'#999'}" v-if="!shopSaleClassfly">点击选择</text>
                            <text  :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}" v-if="shopSaleClassfly">{{shopSaleClassfly}}</text>
                            <image class="moreImg" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                        </div>
                    </div>

                    <!--门店类型-->
                    <div class="listCellContent">
                        <div class="content_left">
                            <image class="redStar" src="https://image.aftdc.com/appBimg/redStar.png"></image>
                            <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">门店类型</text>
                        </div>
                        <div class="content_right content_right_choice" @click="shopTypeClick">
                            <text :style="{fontSize:GLOBAL.defaultFS,color:'#999'}" v-if="!shopType">点击选择</text>
                            <text  :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}" v-if="shopType">{{shopType}}</text>
                            <image class="moreImg" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                        </div>
                    </div>
                    <div class="listCellContent" v-for="(item,index) in serviceTime">
                        <div class="content_left">
                            <image class="redStar" v-if="index==0" src="https://image.aftdc.com/appBimg/redStar.png"></image>
                            <text v-if="index==0" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">营业时间</text>
                        </div>
                        <div class="content_right content_right_choice">
                            <text class="textAlign flewSize" :style="{fontSize:GLOBAL.bigFS,color:item.serviceStartTime!=''?GLOBAL.dColor:'#999'}"  @click="chooseTime(index,1)">{{item.serviceStartTime!=''?item.serviceStartTime:'开始营业时间'}}</text>
                            <text  :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}"> — </text>
                            <text class="textAlign flewSize" :style="{fontSize:GLOBAL.bigFS,color:item.serviceEndTime!=''?GLOBAL.dColor:'#999'}"  @click="chooseTime(index,0)">{{item.serviceEndTime!=''?item.serviceEndTime:'结束营业时间'}}</text>
                            <image class="deleteTimeIcon"  src="https://image.aftdc.com/appBimg/ic_list_item_delete.png" @click="deleteServiceTime(index)" v-if="index!=0"></image>
                            <text style="width: 35px" v-if="index==0"></text>
                        </div>
                    </div>
                    <div class="listCellContent addTimeContent" v-if="serviceTime.length<3">
                        <div class="content_left">
                        </div>
                        <div class="content_right addTime_right">
                            <image class="addTimeIcon"  src="https://image.aftdc.com/appBimg/add_icon.png" @click="addServiceTime" ></image>
                            <text style="width: 35px" v-if="index==0"></text>
                        </div>
                    </div>
                    <div class="listCellContent">
                        <div class="content_left">
                            <image class="redStar" src="https://image.aftdc.com/appBimg/redStar.png"></image>
                            <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">门店地址</text>
                        </div>
                        <div class="content_right content_right_choice" @click="provinceClick()">
                            <text  :style="{fontSize:GLOBAL.defaultFS,color:provinceValue!=''?GLOBAL.dColor:'#999'}">{{provinceValue!=''?provinceValue:'省-市-区/县'}}</text>
                            <image class="moreImg"
                                   src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                        </div>
                    </div>
                    <div class="listCellContent">
                        <div class="content_left">

                        </div>
                        <div class="content_right">
                            <input class="input" :style="GLOBAL.inputText" type="text"  v-model="detailAddress" placeholder="请填写营业执照地址" ref="scrollFive"/>
                        </div>
                    </div>
                    <div class="listCellContent">
                        <div class="content_left">

                        </div>
                        <div class="content_right content_right_choice" @click="openMap">
                            <text  :style="{fontSize:GLOBAL.defaultFS,color:LonLag==0?'#999':GLOBAL.dColor}">{{LonLag==0?'标记地图位置':'已标记地图位置'}}</text>
                            <image class="moreImg" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div class="listCellTitle">
                    <text class="titleSize" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">门店照片</text>
                </div>
            </div>
            <div>
                <div class="listCell">
                    <div class="listCellContent">
                        <div class="content_left">
                            <image class="redStar" src="https://image.aftdc.com/appBimg/redStar.png"></image>
                            <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">门脸照</text>
                        </div>
                        <div class="content_right">
                            <image class="choiceImg" v-if="img[0].localPart" :src="img[0].localPart" resize="cover" @click="chooseImg(0)"></image>
                            <image class="choiceImg" v-else src="https://image.aftdc.com/appBimg/icon_add_image.png" @click="chooseImg(0)"></image>
                            <div class="imgExplain">
                                <text class="explainSize" :style="{fontSize:GLOBAL.bigFS,color:'#999'}">一张真实美观的门脸照可以提升店铺形象</text>
                                <text class="exampleSize" :style="{fontSize:GLOBAL.bigFS,color:'#53beb7'}" @click="exampleImgClick(0)">查看示例图片</text>
                            </div>
                        </div>
                    </div>
                    <div class="listCellContent">
                        <div class="content_left">
                            <image class="redStar" src="https://image.aftdc.com/appBimg/redStar.png"></image>
                            <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">店内照</text>
                        </div>
                        <div class="content_right">
                            <image class="choiceImg" v-if="img[1].localPart" :src="img[1].localPart" resize="cover" @click="chooseImg(1)"></image>
                            <image class="choiceImg" v-else src="https://image.aftdc.com/appBimg/icon_add_image.png" @click="chooseImg(1)"></image>
                            <div class="imgExplain">
                                <text class="explainSize" :style="{fontSize:GLOBAL.bigFS,color:'#999'}">简洁干净的店内照片可以让用户放心点单</text>
                                <text class="exampleSize" :style="{fontSize:GLOBAL.bigFS,color:'#53beb7'}" @click="exampleImgClick(1)">查看示例图片</text>
                            </div>
                        </div>
                    </div>
                    <div class="listCellContent">
                        <div class="content_left">
                            <image class="redStar" src="https://image.aftdc.com/appBimg/redStar.png"></image>
                            <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">门店LOGO</text>
                        </div>
                        <div class="content_right">
                            <image class="choiceImg" v-if="img[2].localPart" :src="img[2].localPart" resize="cover" @click="chooseImg(2)"></image>
                            <image class="choiceImg" v-else src="https://image.aftdc.com/appBimg/icon_add_image.png" @click="chooseImg(2)"></image>
                            <div class="imgExplain">
                                <text class="explainSize" :style="{fontSize:GLOBAL.bigFS,color:'#999'}">上传与店铺配的ogo,能提升店铺的概率(支持PGPEG、PNG格式,大小不超过500k)</text>
                                <text class="exampleSize" :style="{fontSize:GLOBAL.bigFS,color:'#53beb7'}" @click="exampleImgClick(2)">查看示例图片</text>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class=" messageButton">
                <wxc-button class="nextButton" text="下一步" :btnStyle="GLOBAL.defaultButton" :textStyle="GLOBAL.buttonText"
                            @wxcButtonClicked="toCredentialsMessage()"></wxc-button>
            </div>
        </scroller>

        <wxc-mask height="800"
                  width="650"
                  border-radius="15"
                  duration="200"
                  mask-bg-color="#FFFFFF"
                  :has-animation="hasAnimation"
                  :has-overlay="true"
                  :show-close="true"
                  :show="show"
                  @wxcMaskSetHidden="wxcMaskSetHidden">
            <div class="content">
                <image class="exampleImg" :src="'https://image.aftdc.com/'+exampleImg[exampleImgIndex].img"></image>
                <text class="exampleTextTitle" :style="{fontSize:GLOBAL.biggestFS,color:GLOBAL.dColor}">{{exampleImg[exampleImgIndex].title}}</text>
                <text class="exampleText" :style="{fontSize:GLOBAL.bigFS,color:'#999'}">{{exampleImg[exampleImgIndex].content}}</text>

            </div>
        </wxc-mask>
        <toast ref="toast"></toast>
    </div>
</template>

<script>
    import {WxcMinibar, WxcButton, WxcIcon, WxcMask, WxcPopup} from 'weex-ui';
    import Toast from './Toast.vue'
    const event = weex.requireModule('event');
    const modal = weex.requireModule('modal');
    const post = weex.requireModule('stream');
    const picker = weex.requireModule('picker');
    const items = ['单店', '连锁店']
    export default {
        name: 'App',
        components: {WxcMinibar, WxcButton, WxcIcon, WxcMask, WxcPopup,Toast},
        data() {
            return {
                iconStyle: {
                    color: "#666",
                    fontSize: '35px',

                },
                nextBtnStyle: {
                    backgroundColor: '#53beb7',
                    width: '600',
                    borderColor: '#428a85',
                    borderWidth: '1px',
                    borderStyle: 'solid'
                },
                show: false,
                hasAnimation: true,
                exampleImg: [
                    {
                        img: 'images/packageA/shopImg2.jpg',
                        title: '门脸照示例图',
                        content: '门脸照需拍出完整牌匾,门框,需在餐厅开门营业状况下完成拍摄（建议正对门店2米处拍摄）'
                    },
                    {img: 'images/packageA/shopImg1.jpg', title: '店内照', content: '需正式反映用餐环境(收银台、用餐桌椅)'},
                    {img: 'images/packageA/logo.png', title: '店内LOGO', content: '需体现您店铺的特色，可吸引更多的用户进店点餐'}
                ],
                exampleImgIndex: 0,
                index: 0,//门店类型默认选择第一个
                provinceValue: '',//门店地址
                shopSaleClassfly:'',//门店分类例子，未选时为
                shopType:'',//门店类型,未选时
                serviceTime:[
                    {serviceStartTime:'',serviceEndTime:''}
                ],
                timeListIndex:'',
                timeIndex:'',
                phone:'',//联系人电话例子，由上个页面获取，不可更改
                shopName:'',//门店名称
                stores_phone:'',//门店电话
                userName:'',//联系人姓名
                email:'',//邮箱
                detailAddress:'',//门店营业执照地址
                LonLag:0,//门店地图位置
                pageBack:false,
                img:[{
                    img:'',localPart:''
                },{
                    img:'',localPart:''
                },{
                    img:'',localPart:''
                }
                ],
                scrollerNum:false,
            }
        },
        created(){

            this.phone = JSON.parse(weex.config.param).phone;
            this.token = JSON.parse(weex.config.param).token;
            var that = this
            event.init();
            weex.requireModule('globalEvent').addEventListener("chooseCity",function(e){
                that.provinceValue = e.city
            });
            weex.requireModule('globalEvent').addEventListener("chooseTime",function(e){
                if(that.timeIndex==1){
                    const toast=that.$refs.toast;
                    var start=e.time;

                    for(var i in that.serviceTime){
                        if(i<that.timeListIndex){
                            if(start<=that.serviceTime[i].serviceStartTime||start<=that.serviceTime[i].serviceEndTime){
                                toast.editContent('当前设置时间与其他时间冲突')
                                return false;
                            }
                        }
                        if(i==that.timeListIndex){
                            if(that.serviceTime[i].serviceEndTime&&start>=that.serviceTime[i].serviceEndTime){
                                toast.editContent('开始时间需要小于结束时间')
                                return false;
                            }
                        }
                    }
                    that.$set(that.serviceTime[that.timeListIndex],'serviceStartTime',e.time)

                }else if(that.timeIndex==0){
                    const toast=that.$refs.toast;
                    var end=e.time
                    for(var i in that.serviceTime){
                        if(i==that.timeListIndex){
                            if(that.serviceTime[i].serviceStartTime&&end<=that.serviceTime[i].serviceStartTime){
                                toast.editContent('结束时间需要大于开始时间')
                                return false;
                            }
                        }
                        if(i>that.timeListIndex){
                            if((that.serviceTime[i].serviceStartTime&&end>=that.serviceTime[i].serviceStartTime)||(that.serviceTime[i].serviceEndTime&&end>=that.serviceTime[i].serviceEndTime)){
                                toast.editContent('当前设置时间与其他时间冲突')
                                return false;
                            }
                        }
                    }
                    that.$set(that.serviceTime[that.timeListIndex],'serviceEndTime',e.time)

                }
            });
        },
        methods: {
            deleteServiceTime(index){
                var that=this
                that.serviceTime.splice(index,1)
            },
            addServiceTime(){
                var that=this
                var obj={serviceStartTime:'',serviceEndTime:''}
                if(that.serviceTime.length<3){
                    that.serviceTime.push(obj)
                }
            },
            // 列表滚动事件
            touchend(){
                this.scrollerNum=false;
            },

            touchmove(){
                this.scrollerNum=true;
            },
            scrollMove(){
                var that=this;
                if(this.scrollerNum){
                    that.$refs.scrollOne.blur();
                    that.$refs.scrollTwo.blur();
                    that.$refs.scrollThree.blur();
                    that.$refs.scrollFour.blur();
                    that.$refs.scrollFive.blur();

                }
            },


            //选择区域
            provinceClick() {
                event.chooseCity()
            },
            //选择时间
            chooseTime(index,timeIndex){
                var that=this
                const toast=that.$refs.toast;
                this.timeIndex = timeIndex;
                this.timeListIndex=index;
                for(var i in that.serviceTime) {
                    if (timeIndex == 1 && i < index) {
                        if (!that.serviceTime[i].serviceStartTime || !that.serviceTime[i].serviceStartTime) {
                            toast.editContent('请先设置上一个时间段')
                            return false;
                        }
                    }
                    if(timeIndex == 0&&i==index) {
                        if (!that.serviceTime[i].serviceStartTime) {
                            toast.editContent('请先选择开始时间')
                            return false;
                        }
                    }
                }
                event.chooseTime(false, false, false, true, true, false);
            },
            chooseImg(index){
                if (index == 2){
                    event.chooseImg(1,1)
                }else{
                    event.chooseImg(9,5)
                }
                this.imgIndex = index
            },
            openMap(){
                event.openWebMap()
            },
            minibarLeftButtonClick() {

            },

            wxcMaskSetHidden() {
                var that = this;
                that.show = false
            },
            exampleImgClick(index) {
                var that = this
                that.exampleImgIndex = index
                that.show = true
            },
            //非状态组件，需要在这里关闭
            popupOverlayBottomClick() {
                this.isBottomShow = false;
            },
            toCredentialsMessage(){
                var that = this;
                var shopType=that.shopType//门店类型
                const toast=that.$refs.toast;
                if(!that.shopName||!that.stores_phone||!that.userName||!that.detailAddress||!that.LonLag||!that.provinceValue||!that.shopSaleClassflyId||!that.shopType){
                    toast.editContent('未填写完整!');
                    return false;
                }
                for(var i in that.serviceTime){
                    if(!that.serviceTime[i].serviceStartTime||!that.serviceTime[i].serviceEndTime){
                        toast.editContent('请选择营业时间!');
                        return false;
                    }
                }


                //验证邮箱
                let str = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
                if (!str.test(this.email)) {
                    toast.editContent('邮箱格式错误!');
                    return false;
                }


                for (var i=0; i<this.img.length; i++){
                    if (this.img[i].img == ''){
                        toast.editContent('图片未上传完整!');
                        return false;
                    }
                }
                if(shopType=='单店'){
                    shopType=2
                }else if(shopType=='连锁店'){
                    shopType=1
                }

                var param = 'shopName='+this.shopName+'&stores_phone='+this.stores_phone+'&phone='+this.phone+'&userName='+this.userName+'&shopType='+shopType+'&detailAddress='+this.detailAddress+'&provinceValue='+this.provinceValue+'&serviceTime='+JSON.stringify(this.serviceTime)+'&shopSaleClassflyId='+this.shopSaleClassflyId+'&img='+JSON.stringify(this.img)+'&LonLag='+this.LonLag+'&shopAddress='+this.shopAddress+'&token=' + this.token+'&email='+this.email;
                post.fetch({
                    method: 'post',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/businessapp/Enter/enter_firstStep',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                }, function (res) {
                    if (res.data.res == 1) {
                        var param = {
                            phone:that.phone,
                            token:that.token,
                            shopType:shopType
                        };
                        var url='http://assets/credentialsMessage.js'
                        event.toUrl({"url":url,"param":JSON.stringify(param)})
                    }else{
                        toast.editContent(res.data.info);
                    }
                });
            },
            toClassificationOfcuisine(){
                var param=JSON.stringify(this.shopSaleClassfly);
                var url='http://assets/classificationOfcuisine.js';
                event.toUrl({"url":url,"param":param})
            },
            shopTypeClick(){
                picker.pick({
                    index: this.index,
                    cancelTitleColor:'#999',
                    confirmTitleColor:'#53beb7',
                    items
                }, event => {
                    if (event.result === 'success') {
                        this.shopType = items[event.data]
                        this.index = event.data
                    }
                })
            },
            //监听页面返回
            viewdisappear() {
                this.pageBack = true;
            },
            viewappear() {
                if (!this.pageBack) { return; }
                this.pageBack = false;
                if (event.find("classiflyCation")) {//分类
                    var classiflyCation = JSON.parse(event.find('classiflyCation'));
                    console.log(event.find('classiflyCation'))
                    if (classiflyCation.length ==2){
                        this.shopSaleClassfly = "主营:"+classiflyCation[0]['name']+"/次营:" +classiflyCation[1]['name']
                        this.shopSaleClassflyId = classiflyCation[0]['id']+','+classiflyCation[1]['id']
                    } else {
                        this.shopSaleClassfly = "主营:"+classiflyCation[0]['name']
                        this.shopSaleClassflyId = classiflyCation[0]['id']
                    }
                    event.delete("classiflyCation");
                    return false;
                }
                if (event.find("localImg")) {//图片
                    var index=this.imgIndex;
                    var localPart = event.find("localImg");
                    var img = 'enter/'+Date.parse(new Date())+'0'+Math.round(Math.random()*1000000)+'.jpg';
                    this.img[index].localPart = localPart;
                    this.img[index].img = img;
                    this.uploadImg(img,localPart);
                    event.delete("localImg");
                    return false;
                }
                if (event.find("address")) {
                    var data = JSON.parse(event.find("address"))
                    this.shopAddress = data.shopAddress
                    this.LonLag = data.latlng
                    event.delete("address");
                }
            },
            //上传图片
            uploadImg(articleImg,localPart){
                var that = this;
                var param = 'phone=' + this.phone + '&token=' + this.token;
                post.fetch({
                    method: 'post',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/businessapp/Enter/uploadOss',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                },function(res){
                    var waterMarkStr = '';
                    event.uploadImg(res.data.AccessKeyId,res.data.AccessKeySecret,res.data.SecurityToken,articleImg,localPart,waterMarkStr);
                })
            },
        },

        computed: {
            shopType () {
                if (this.index < items.length) {
                    return items[this.index]
                }
                return ''
            }
        },
    }
</script>

<style scoped>


    .wrapper {
        flex-direction: column;
        background-color: #f8f8f8;
    }

    .minibar {
        /*border-bottom-width: 2px;*/
        /*border-bottom-style: solid;*/
        /*border-bottom-color: #a1a1a1;*/
    }

    .backImg {
        width: 40px;
        height: 40px;
    }

    .listCellTitle {
        padding-top: 30px;
        padding-bottom: 30px;
        padding-left: 30px;
        padding-right: 30px;
    }

    .titleSize {
        color: #999;
    }

    .listCell {
        flex-direction: column;
        background-color: #fff;

    }

    .listCellContent {
        padding-top: 30px;
        padding-bottom: 30px;
        margin-left: 30px;
        margin-right: 30px;
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #f1f1f1;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
    .addTimeContent{
        padding-top: 20px;
        padding-bottom: 20px;
    }

    .content_left {
        flex: 1;
        flex-direction: row;
        align-items: center;
    }

    .redStar {
        width: 12px;
        height: 12px;
        margin-right: 10px;
    }

    .content_right {
        flex: 2.4;
        flex-direction: row;
        align-items: center;
    }
    .addTime_right{
        justify-content: center;
    }

    .input {
        align-items: center;
        placeholder-color: #999;
        flex: 1;
    }
    .textAlign{
        text-align: center;
    }
    .flewSize{
        flex: 1;
    }
    .addTimeIcon{
        width: 45px;
        height: 45px;
    }
    .deleteTimeIcon{
        width:35px;
        height:35px;
    }

    .content_right_choice {
        justify-content: flex-end;
    }

    .choiceImg {
        width: 175px;
        height: 175px;
    }

    .imgExplain {
        flex-direction: column;
        justify-content: center;
        margin-left: 20px;
    }

    .explainSize {
        width: 290px;
        margin-bottom: 15px;
    }

    .exampleSize {
        margin-top: 15px;
    }

    .messageButton {
        flex-direction: row;
        justify-content: space-around;
        width: 750px;
        background-color: #fff;
        padding-top: 20px;
        padding-bottom: 20px;
        padding-left: 30px;
        padding-right: 30px;
    }

    .scroller {
        flex: 1;
    }

    .moreImg {
        width: 20px;
        height: 20px;
        margin-left: 10px;
    }

    .content {
        flex-direction: column;
    }

    .exampleImg {
        width: 650px;
        height: 450px;
        border-top-left-radius: 15px;
        border-top-right-radius: 15px;
    }

    .exampleTextTitle {
        margin-top: 60px;
        text-align: center;
        font-weight: 500;
    }

    .exampleText {
        margin-top: 40px;
        margin-left: 25px;
        margin-right: 25px;
        line-height: 50px;

    }
    .nextButton:active{
        background-color: #57aba5;
    }
    .nextButton:enabled{
        background-color: #53beb7;
    }
</style>