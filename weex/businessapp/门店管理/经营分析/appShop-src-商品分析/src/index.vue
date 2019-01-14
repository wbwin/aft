<template>
    <div class="wrapper">

        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    v-once>
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">商品分析</text>
            </wxc-minibar>
        </div>

        <scroller show-scrollbar="false">
            <div class="navs row">
                <div class="choiceLeft row aiCenter jcCenter" @click="dateTogleFn()" >
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}" v-if="day==1">昨日</text>
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}" v-else>近{{day}}日</text>
                    <image class="downArrow" src="https://image.aftdc.com/appBimg/ic_expanded_down.jpg"></image>
                </div>
                <div class="choiceRight row" >
                    <div class="flex1 aiCenter jcCenter" @click="sortFn(1)">
                        <text :class="[sortChoice==1?'fontWeig':'']" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}" >销售额最高</text>
                    </div>
                    <div class="flex1 aiCenter jcCenter" @click="sortFn(2)">
                        <text :class="[sortChoice==2?'fontWeig':'']" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}" >销量最高</text>
                    </div>
                </div>
                <div class="choiceDate" v-if="dateTogle">
                    <div class="date jcCenter" @click="shopNavFn(1)"><text class="gray" :style="{fontSize:GLOBAL.bigFS}">昨日</text></div>
                    <div class="date jcCenter" @click="shopNavFn(7)"><text class="gray" :style="{fontSize:GLOBAL.bigFS}">近7日</text></div>
                    <div class="date jcCenter" @click="shopNavFn(30)"><text class="gray" :style="{fontSize:GLOBAL.bigFS}">近30日</text></div>
                </div>
            </div>
            <!-- 有内容 -->

            <div class="content" v-if="goods && goods.length>0">
                <div class="goodData row" v-for="(item,index) in goods">
                    <div class="padt" v-if="index<2">
                        <text class="numb" :class="[index===0?'numbOne':'numbTwo']" >{{index+1}}</text>
                    </div>
                    <div class="padt" v-else>
                        <text class="numb" :class="[index===2?'numbThree':'']">{{index+1}}</text>
                    </div>
                    <div class="commodity">
                        <text class="commodityName" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">{{item.name}}</text>
                        <div class="row">
                            <text class="commodityText"  :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">销售额 ￥{{item.price}}</text>
                            <text class="commodityText"  :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">占比{{item.priceScal}}</text>
                        </div>
                        <div class="row">
                            <text class="commodityText"  :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">销量 {{item.numb}}</text>
                            <text class="commodityText"  :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">占比{{item.numbScal}}</text>
                        </div>
                    </div>
                </div>
                <text class="moretxt" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">更多详情数据，请前往电脑版查看</text>
            </div>

            <!-- 无内容 -->
            <div class="notContent aiCenter" v-else>
                <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">未找到符合条件的商品</text>
            </div>

            <!-- 帮你选折扣菜 -->
            <div class="helpGoods row aiCenter">
                <image class="discount" src="https://www.aftdc.com/static/image/mobile/xzk.png"></image>
                <text :style="{fontSize:GLOBAL.bigFS,color:'#fff'}">帮你选折扣菜</text>
            </div>
        </scroller>
    </div>

</template>

<script>
    import {WxcMinibar} from 'weex-ui';
    var post = weex.requireModule('stream');
    const event = weex.requireModule('event');

    export default {
        components: {WxcMinibar},
        data() {
            return {
                day:7,
                dateTogle:false,
                sortChoice:0,
                goods:[],//菜的数据
                token:'',
                imei:'',
            }
        },
        created: function() {
            var that=this;
            event.init();
            that.token = weex.config.token;
            that.imei = weex.config.imei;
        },
        mounted: function() {
            this.dateFn(7);//默认拿七天的数据
        },
        methods: {
            minibarLeftButtonClick() {

            },
            shopNavFn(index) {
                this.day = index;
                this.dateTogle = false
                this.dateFn(index);
            },
            //通过选择时间加载对应的数据
            dateFn(day) {
                var that = this;
                var param = 'day=' + day + '&' + this.GLOBAL.sign(this.token,this.imei);
                post.fetch({
                    method:'POST',
                    url: 'https://www.aftdc.com/businessapp/Manage/getGoodsAnaly',
                    body: param,
                    type: 'json',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"}
                },function (res) {
                    if (res) {
                        that.goods = res.data.data
                    }
                    else {
                        that.goods = []
                    }
                })
            },
            //排序
            sortFn(index) {
                this.sortChoice = index;
                var goods = this.goods;
                if (goods && goods.length > 0) {
                    var name = index == 1 ? 'price' : 'numb',//1为销售额排序，2为销量
                        //由高到底
                        goods = goods.sort(function (a, b) {
                            return parseInt(b[name] * 100) / 100 - parseInt(a[name] * 100) / 100
                        });
                    this.goods = goods
                }
            },
            dateTogleFn:function(){
                this.dateTogle=!this.dateTogle
            },
            back() {
                history.back();
            }
        }
    }



</script>

<style scoped>

    .wrapper {
        position: relative;
        flex-direction: column;
    }
    .minibar {
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: #f1f1f1;
    }
    .gray {
        color: #7c7c7c;
    }

    .flex1 {
        flex: 1;
    }
    .row {
        flex-direction: row;
    }
    .aiCenter {
        align-items: center;
    }
    .jcCenter {
        justify-content: center;
    }


    .navs{
        height: 90px;
        border-bottom-width: 18px;
        border-bottom-style: solid;
        border-bottom-color: #efefef;
    }
    .choiceLeft {
        width: 188px;
        border-right-width: 3px;
        border-right-style: solid;
        border-right-color: #efefef;
    }
    .choiceRight {
        width: 562px;
    }
    .downArrow {
        width: 20px;
        height: 20px;
        margin-left: 15px;
    }
    .fontWeig {
        font-weight: bold;
    }
    .discount {
        width: 58px;
        height: 58px;
        margin-right: 7px;
    }
    .choiceDate{
        position: fixed;
        top: 90px;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0,0,0,0.5);
        color: #a0a0a0;
    }
    .date {
        background-color: #fff;
        height: 80px;
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #efefef;
        padding-left: 20px;
    }
    .content {
        padding-left: 24px;
    }
    .goodData{
        height: 170px;
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #efefef;
    }
    .numb{
        width: 36px;
        height: 36px;
        border-radius: 50px;
        line-height: 36px;
        color: #fff;
        text-align: center;
        background-color: #95acbc;
        font-size: 24px;
    }
    .padt{
        width: 58px;
        padding-top: 30px;
    }
    .commodity {
        padding-top: 24px;
    }
    .commodityName {
        margin-bottom: 5px;
        font-weight: bold;
    }
    .commodityText {
        width: 265px;
        line-height: 38px;
    }
    .numbOne{
        background-color: #ff5a5a;
    }
    .numbTwo{
        background-color:rgb(255, 117, 1);
    }
    .numbThree{
        background-color: rgb(255, 193, 0);
    }
    /*更多详情*/
    .moretxt{
        text-align: center;
        padding-top: 20px;
        padding-bottom: 20px;
    }
    /*帮你选折扣菜*/
    .helpGoods{
        background-color: #20dbcf;
        border-bottom-left-radius: 50px;
        border-top-left-radius: 50px;
        position: fixed;
        bottom: 50px;
        right: 0;
        padding-top: 10px;
        padding-left: 10px;
        padding-right: 10px;
        padding-bottom: 10px;
    }
    .helpGoods img{
        width: 0.5rem;
        height: 0.5rem;
        display: inline-block;
        vertical-align: middle;
    }
    /*无内容*/
    .notContent {
        padding-top: 80px;
        padding-bottom: 100px;
    }


</style>
