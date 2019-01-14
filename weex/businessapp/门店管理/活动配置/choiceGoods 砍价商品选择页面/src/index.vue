<template>
    <div class="GoodsContent" :style="{visibility: visibility}">

        <!--头部-->
        <wxc-minibar
                background-color="#53beb7"
                text-color="#fff"
                @wxcMinibarLeftButtonClicked="backClick"
                v-once
        >
            <image :style="GLOBAL.headerImg"  slot="left"
                   src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
            <text :style="GLOBAL.headerCenter"  slot="middle">商品选择</text>
        </wxc-minibar>

        <!--左列表-->
        <scroller show-scrollbar="false" class="content_left">
            <div id="didi-navigator" v-for="(item, index) in Von">
                <div class="content_nav" :class="[classflyIndex===index?'content_navColor':'']"  @click="goto(index)">
                    <div class="nav_border" :class="[classflyIndex===index?'nav_borderLeft':'']">

                        <image src="https://image.aftdc.com/images/cut-icon.png" v-if="item.catName=='砍价'"
                               style="width: 30px;height: 30px;margin-right: 10px"></image>
                        <image src="https://image.aftdc.com/images/sec-icon.png" v-if="item.catName=='秒杀'"
                               style="width: 30px;height: 30px;margin-right: 10px"></image>
                        <image src="https://image.aftdc.com/images/reb-icon.png" v-if="item.catName=='折扣'"
                               style="width: 30px;height: 30px;margin-right: 10px"></image>
                        <image src="https://image.aftdc.com/images/hot-icon.png" v-if="item.catName=='热销'"
                               style="width: 30px;height: 30px;margin-right: 10px"></image>
                        <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}" class="dot" :class="[classflyIndex===index?'textClassflyColor':'']">{{item.catName}}</text>
                    </div>
                </div>
            </div>
            <!--********接接口可删除*************-->
        </scroller>

        <!--右列表-->
        <div class="content_right">
            <scroller class="right_content">
                <div class="row" ref="item" v-for="(name, index) in rows"  :key="index" @appear="appear($event,index)"
                     @disappear="disappear($event,index)">
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}" class="ClassflyTitle">{{name.catName}}</text>
                    <div v-for="(food, index2) in name.distop" class="foodsDiv">
                        <div class="foodsMessage" style="position: relative;">
                            <image class="img_default" :src="'https://image.aftdc.com/'+food.goodsImg"></image>
                            <text class="stopSale" v-if="food.isSale == 0" :style="{fontSize:GLOBAL.bigFS}">暂停售卖</text>
                            <div class="msg_right">
                                <text :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}" class="foodsName">{{food.goodsName}}</text>
                                <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}" class="foodsStock" v-if="food.goodsStock == -1">库存无限</text>
                                <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}" class="foodsStock" v-else>库存{{food.goodsStock}}</text>
                                <div style="flex-direction: row;align-items: center">
                                    <text :style="{fontSize:GLOBAL.bigFS,color:'red',flex:1}" class="foodsPrice">￥{{food.shopPrice}}</text>
                                    <div class="right_button">
                                        <wxc-button class="choiceButton" text="选择" :textStyle="choiceStyle"
                                                    :btnStyle="choiceBtnStyle"
                                                    @wxcButtonClicked="selectOk(index,index2)"></wxc-button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </scroller>
        </div>

        <toast ref="toast"></toast>
    </div>
</template>
<script>
    import {WxcButton,WxcMinibar} from 'weex-ui'
    import {WxcDialog} from 'weex-ui';
    import Toast from './Toast.vue'
    const event = weex.requireModule('event');
    const navigator = weex.requireModule('navigator');

    const post = weex.requireModule('stream');
    var modal = weex.requireModule('modal');
    const dom = weex.requireModule('dom');
    export default {
        components: {WxcButton, WxcDialog, Toast, WxcMinibar},
        data() {
            const rows = []
            return {
                visibility:'hidden',
                height: '',
                Von: [],
                rows,
                backImgToggle: 0,//头部返回图片判断
                backShow: false,
                choiceBtnStyle: {
                    backgroundColor: '#53beb7',
                    width: '100px',
                    height:'45px',
                    lineHeight:'45px',
                    borderColor: '#53aba5',
                    borderWidth: '2px',
                    borderStyle: 'solid',
                },
                choiceStyle: {
                    fontSize: '22px',
                    color: '#fff'
                },
                classflyIndex: 0,
                token:'',
                imei:''
            }
        },
        created: function () {
            this.visibility='hidden';
            this.token = weex.config.token;
            this.imei = weex.config.imei;
            var that = this;
            that.height = this.$getConfig().env.deviceHeight;
            // //获取token和sign
            var param = this.GLOBAL.sign(this.token,this.imei);
            post.fetch({
                method: 'POST',
                type: 'json',
                body: param,
                url: 'https://www.aftdc.com/businessapp/Enrol/cat_goods',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
            }, function (res) {
                var arr=res.data[0].dishes
                for(var i=arr.length-1;i>=0;i--){
                    for(var j=arr[i].distop.length-1;j>=0;j--){
                        if(arr[i].distop[j].guige!="[]"){
                            arr[i].distop.splice(j,1)
                        }
                    }
                    if(arr[i].distop.length==0){
                        arr.splice(i,1)
                    }


                }
                that.Von = arr
                that.rows = arr
            })
        },
        mounted(){
            var that=this
            that.visibility='visible';
        },
        methods: {
            appear(event, index) {
                var that = this
                if (event.direction == 'down') {
                    // that.classflyIndex = index
                }
            },
            disappear(event, index) {
                var that = this
                if (event.direction == 'up') {
                    // that.classflyIndex = index + 1
                }
            },

            //选好商品返回砍价活动页面
            selectOk(index,index2) {
                var that = this;
                var param = {};
                param['goodsName'] = that.rows[index]['distop'][index2]['goodsName']; // 得到 goodsName
                param['shopPrice'] = that.rows[index]['distop'][index2]['shopPrice']; // 得到 goodsPricce
                param['goodsId'] = that.rows[index]['distop'][index2]['goodsId']; // 得到goodsId
                param['goodsImg'] = that.rows[index]['distop'][index2]['goodsImg']; // 得到 goodsImg
                param['attr'] = that.rows[index]['distop'][index2]['attr']; // 得到 attr
                param['guigeAttr'] = that.rows[index]['distop'][index2]['guigeAttr']; // 得到 guigeAttr
                param['boxFee'] = that.rows[index]['distop'][index2]['boxFee']; // 得到 boxFee
                param['goodsStock'] = that.rows[index]['distop'][index2]['goodsStock']; // 得到 goodsStock
                param['marketPrice'] = that.rows[index]['distop'][index2]['marketPrice']; // 得到marketPrice

                //保存数据
                event.save('param', param);
                navigator.pop({ animated: 'true' });
            },

            //返回上一页
            backClick() {
                navigator.pop({ animated: 'true' });
            },

            goto(index) {
                console.log(index)
                var that=this
                dom.scrollToElement(that.$refs.item[index], {})
                console.log(that.$refs.item[index])
                that.classflyIndex = index
                // this.classflyIndex = index
                // var Von = this.Von;
                // console.log(Von)
                // dom.scrollToElement(Von[index],{})
            },
            //上架
            previous(e) {
                var that = this;
                var goodsId = e.goodsId;
                var isSale = e.isSale;
                if (isSale != 1 && isSale != 0) {
                    const toast = that.$refs.toast
                    toast.editContent('这个只是商品活动，请点击商品实体...');
                    return false
                }
                var formData = 'goodsId=' + goodsId + '&&' + 'isSale=1';
                post.fetch({
                    method: "POST",
                    url: 'https://www.aftdc.com/businessapp/Enrol/saveSale',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    body: formData,
                    type: 'json',
                }, function (res) {
                    if (res.data.res == 1) {
                        const toast = that.$refs.toast
                        toast.editContent('成功...');
                        var rows = that.rows;
                        for (var i = 0; i < rows.length; i++) {
                            if (rows[i]['distop']) {
                                for (var p = 0; p < rows[i]['distop'].length; p++) {
                                    if (rows[i]['distop'][p]['goodsId'] == res.data.goodsId) {
                                        rows[i]['distop'][p]['isSale'] = 1;
                                    }
                                }
                            }
                        }
                        that.rows = rows
                    } else {
                        const toast = that.$refs.toast
                        toast.editContent('错误...');
                    }
                })
            },
            //下架
            next(e) {
                var that = this;
                var goodsId = e.goodsId;
                var isSale = e.isSale;
                if (isSale != 1 && isSale != 0) {
                    console.log('这个只是商品活动，请点击商品商家')
                    return false
                }
                var formData = 'goodsId=' + goodsId + '&&' + 'isSale=0';
                post.fetch({
                    method: "POST",
                    url: 'https://www.aftdc.com/businessapp/Enrol/saveSale',
                    body: formData,
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    type: 'json',
                }, function (res) {
                    if (res.data.res == 1) {
                        var rows = that.rows;
                        for (var i = 0; i < rows.length; i++) {
                            if (rows[i]['distop']) {
                                for (var p = 0; p < rows[i]['distop'].length; p++) {
                                    if (rows[i]['distop'][p]['goodsId'] == res.data.goodsId) {
                                        rows[i]['distop'][p]['isSale'] = 0;
                                    }
                                }
                            }
                        }
                        that.rows = rows
                    } else {
                        const toast = that.$refs.toast
                        toast.editContent('错误...');
                    }
                })
            },
        },
    }
</script>

<style scoped>

    .scroller {
        width: 700px;
        height: 700px;
        border-width: 3px;
        border-style: solid;
        border-color: rgb(162, 217, 192);
        margin-top: 100px;
        margin-left: 25px;
    }

    .content_navColor {
        background-color: #fff;
    }

    .textClassflyColor {
        color: #53beb7;
    }

    .ClassflyTitle {
        padding-top: 10px;
        padding-bottom: 10px;
        text-align: left;
        padding-left: 20px;
        background-color: #f1f1f1;
        color: #333;
        /*margin-top: 10px;*/
        margin-bottom: 10px;
    }

    .foodsDiv {
        /*margin-top: 20px;*/
        /*margin-bottom: 20px;*/
        padding-left: 35px;
        padding-right: 35px;
        padding-top: 35px;
        padding-bottom: 35px;
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #f1f1f1;
    }

    .GoodsContent {
        flex-direction: row;
        justify-content: flex-start;
    }

    .content_left {
        width: 200px;
        flex-direction: column;
        background-color: #fff;
        border-top-width: 2px;
        border-top-style: solid;
        border-top-color: #f1f1f1;
        /*height: 1210px;*/
        background-color: #f8f8f8;
        position: absolute;
        top: 90px;
        left: 0;
        bottom: 0;

    }
    .content_nav {
        background-color: #f8f8f8;
        border-width: 1px;
        border-style: solid;
        border-color: #f1f1f1;
        border-top-width: 0;
        border-left-width: 0;
        min-width: 0;
        flex-direction: row;
        align-items: center;
    }

    .content_nav:active {
        background-color: #53beb7;
    }

    .navActive {
        background-color: #fff;
    }

    .navActive:active {
        background-color: #fff;
    }

    .content_right {
        width: 550px;
        flex-direction: column;
        background-color: #e8e8e8;
        position: absolute;
        top: 90px;
        right: 0;
        /*left: 200px;*/
        bottom: 0;
        border-left-width: 2px;
        border-left-style: solid;
        border-left-color: #f1f1f1;
        border-top-width: 2px;
        border-top-style: solid;
        border-top-color: #f1f1f1;
    }

    .nav_border {
        /*padding-left: 20px;*/
        /*padding-right: 20px;*/
        flex: 1;
        min-width: 0;
        flex-direction: row;
        align-items: center;
        margin-top: 35px;
        margin-bottom: 35px;
        /*justify-content: center;*/
        padding-left: 30px;

        padding-right: 20px;
        border-left-width:0;
        border-left-style: solid;
        border-left-color: #fff;
    }

    .nav_borderLeft {
        border-left-width: 15px;
        border-left-style: solid;
        border-left-color: #53beb7;
    }

    .dot {
        width: 150px;
        flex-direction: row;
        align-items: center;

        /*padding-top: 40px;*/
        /*padding-bottom: 40px;*/
        /*white-space: nowrap;*/
        /*overflow: hidden;*/
        /*width: 160px;*/
        /*word-break: break-all;*/
        /*text-overflow: ellipsis;*/

    }

    .foodsMessage {
        flex-direction: row;
    }

    .right_content {
        flex-direction: column;
        /*padding-top: 35px;*/
        /*padding-left: 35px;*/
        /*padding-right: 35px;*/
        /*padding-bottom: 35px;*/
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #e8e8e8;
        background-color: #fff;

    }

    .msg_right {
        flex: 1;
        flex-direction: column;
        padding-left: 35px;
    }

    .img_default {
        width: 120px;
        height: 120px;
    }

    .foodsName {
        width: 300px;
    }

    .foodsStock {
        margin-top: 10px;
        margin-bottom: 10px;
    }

    .right_button {
        flex-direction: row;
        justify-content: center;
    }

    .choiceButton:active {
        background-color: #57aba5;
    }
    .choiceButton:enabled {
        background-color: #53beb7;
    }

    .edit {
        padding-top: 15px;
        padding-bottom: 15px;
        padding-left: 70px;
        padding-right: 70px;
        border-width: 2px;
        border-style: solid;
        border-color: #53beb7;
        border-radius: 10px;
        color: #53beb7;
    }

    .edit:active {
        background-color: #53beb7;
    }

    .isSale {
        padding-top: 15px;
        padding-bottom: 15px;
        padding-left: 70px;
        padding-right: 70px;
        border-width: 2px;
        border-style: solid;
        border-color: #53beb7;
        border-radius: 10px;
        color: #53beb7;

    }

    .isSale:active {
        background-color: #53beb7;
    }

    .active {
        border-left-width: 15px;
        border-left-style: solid;
        border-left-color: #53beb7;
    }

    .stopSale{
        color: white;
        width: 120px;
        height: 120px;
        position:absolute;
        background-color: rgba(100, 100, 100, 0.6);
        left:0;
        right:0;
        top: 0;
        bottom:0;
        text-align: center;
        line-height: 120px;
    }

    /*****************/
    .header {
        flex-direction: row;
        height: 90px;
        background-color: #53beb7;
        align-items: center;
        justify-content: space-between;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
    }

    .back {
        margin-left: 40px;
        flex: 1;
    }

    .backImg {
        width: 40px;
        height: 40px;
    }

    .appName {
        flex: 1;
    }

    .appNameCss {
        font-size: 40px;
        color: #fff;
        text-align: center;
    }

    .allSave {
        flex: 1;
        margin-right: 40px;

    }

    .allSaveCss {
        font-size: 35px;
        color: #fff;
        text-align: right;
    }

    .allSaveCss:active {
        color: #666;
    }

    /***********************/
</style>
