<template>
    <div class="GoodsContent" @viewappear="viewappear" @viewdisappear="viewdisappear" :style="{visibility: visibility}">

        <wxc-minibar
                background-color="#53beb7"
                text-color="#fff"
                @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                @wxcMinibarRightButtonClicked="minibarRightButtonClick"
                v-once>
            <image :style="GLOBAL.headerImg"  slot="left"
                   src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
            <text :style="GLOBAL.headerCenter" slot="middle">商品管理</text>
        </wxc-minibar>

        <scroller show-scrollbar="false" class="content_left">
            <div id="didi-navigator" v-for="(item, index) in Von">
                <div class="content_nav" :class="[classflyIndex===index?'content_navColor':'']" @click="goto(index)">
                    <div :class="[classflyIndex===index?'fill':'']"></div>
                    <!--<div class="nav_border " :class="[classflyIndex===index?'nav_borderLeft':'']">-->
                    <div class="nav_border " >
                        <image src="https://image.aftdc.com/images/cut-icon.png" v-if="item.catName=='砍价'"
                               style="width: 30px;height: 30px;margin-right: 10px"></image>
                        <image src="https://image.aftdc.com/images/sec-icon.png" v-if="item.catName=='秒杀'"
                               style="width: 30px;height: 30px;margin-right: 10px"></image>
                        <image src="https://image.aftdc.com/images/reb-icon.png" v-if="item.catName=='折扣'"
                               style="width: 30px;height: 30px;margin-right: 10px"></image>
                        <image src="https://image.aftdc.com/images/hot-icon.png" v-if="item.catName=='热销'"
                               style="width: 30px;height: 30px;margin-right: 10px"></image>
                        <text class="dot" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}" :class="[classflyIndex===index?'textClassflyColor':'']">{{item.catName}}</text>
                    </div>
                </div>
            </div>
            <!--********接接口可删除*************-->
        </scroller>

        <div class="content_right">
            <scroller class="right_content" >
                <div class="row" ref="item" v-for="(name, index) in Von" :key="index" @appear="appear($event,index)"
                     @disappear="disappear($event,index)">
                    <text class="ClassflyTitle" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{name.catName}}</text>
                    <div v-for="food in name.distop" class="foodsDiv">
                        <div class="foodsMessage" style="position: relative;">
                            <image class="img_default" :src="'https://image.aftdc.com/'+food.goodsImg"></image>
                            <text class="stopSale"  v-if="food.isSale == 0">暂停售卖</text>
                            <div class="msg_right">
                                <text :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">{{food.goodsName}}</text>
                                <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}" v-if="food.goodsStock == -1">库存无限</text>
                                <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}" v-else>库存{{food.goodsStock}}</text>
                                <text :style="{fontSize:GLOBAL.defaultFS,color:'red'}">￥{{food.shopPrice}}</text>
                            </div>
                        </div>
                        <div class="right_button">
                            <text class="edit" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}" @click="toUrl(food.goodsId)">编辑</text>
                            <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}" v-if="food.isSale == 1" @click="next(food)" class="isSale" >下架</text>
                            <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}" @click="previous(food)" v-else class="isSale">上架</text>
                        </div>
                    </div>
                </div>
            </scroller>
        </div>

        <div class="overlay" :class="[addGoodsShow?'overlayMove':'']"  @click="addGoods"></div>
        <div class="addGoodsTab" ref="addGoodsTab" >
            <div class="agtItem bottomBorder" @click="addGoodsGoTo(0)">
                <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">批量添加</text>
            </div>
            <div class="agtItem" @click="addGoodsGoTo(1)">
                <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">添加商品</text>
            </div>
        </div>


        <div class="Goods_bottom">
            <div class="bottom_name" style="width: 200px" @click="classifyManage">
                <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}" >管理分类</text>
            </div>
            <div class="bottom_name" style="width: 275px" @click="foodSort">
                <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">排序&批量处理</text>
            </div>
            <div class="bottom_name" style="width: 275px" @click="addGoods">
                <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">+新建商品</text>
            </div>
        </div>

        <!--没有分类时引导添加分类-->
        <wxc-dialog title="提示"
                    content="当前无菜品分类，将前往添加"
                    :show="showdialog"
                    :single=true
                    main-btn-color="#53beb7"
                    @wxcDialogConfirmBtnClicked="classifyManage">
        </wxc-dialog>

        <toast ref="toast"></toast>
    </div>
</template>
<script>
    import {WxcMinibar, WxcDialog,WxcButton} from 'weex-ui';
    import Toast from './Toast.vue'
    const post = weex.requireModule('stream');
    const modal = weex.requireModule('modal');
    const dom = weex.requireModule('dom');
    const event = weex.requireModule('event');
    const animation = weex.requireModule('animation')
    export default {
        components: { WxcButton,WxcDialog,WxcMinibar,Toast},
        data() {
            const Von = []
            return {
                addGoodsShow: false,
                height:'',
                Von:[],
                classflyIndex: 0,
                token:'',
                imei:'',
                pageBack:false,
                visibility:'hidden',
                showdialog:false
            }
        },
        created:function(){
            this.visibility='hidden';
            this.token = weex.config.token;
            this.imei = weex.config.imei;
            this.height = weex.config.env.deviceHeight;
            this.refresh();
        },
        mounted(){
            var that=this
            this.visibility='visible';
        },
        methods:{
            minibarLeftButtonClick(){

            },
            minibarRightButtonClick(){

            },
            refresh(){
                var that = this;
                var param = this.GLOBAL.sign(this.token,this.imei);
                post.fetch({
                    method:'POST',
                    type:'json',
                    body:param,
                    url:'https://www.aftdc.com/businessapp/Enrol/cat_goods',
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                },function(res){
                    that.Von = res.data[0].dishes;
                    if (!that.Von)
                        that.showdialog = true
                    else
                        that.showdialog = false
                    event.save('changeGoodsManage',0);
                })
            },
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
            goto (index) {
                console.log(index)
                dom.scrollToElement(this.$refs.item[index], {})
                console.log(this.$refs.item[index])
                this.classflyIndex = index
            },
            //上架
            previous(e){
                var that = this;
                var goodsId = e.goodsId;
                var isSale = e.isSale;
                if(isSale!=1 && isSale!=0){
                    const toast=that.$refs.toast
                    toast.editContent('该商品已参加活动');
                    return false
                }
                var param = this.GLOBAL.sign(this.token,this.imei);
                param += '&goodsId='+goodsId+'&'+'isSale=1';
                post.fetch({
                    method:"POST",
                    url:'https://www.aftdc.com/businessapp/Enrol/saveSale',
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body:param,
                    type:'json',
                },function(res){
                    if (res.data.res == 1){
                        const toast=that.$refs.toast
                        toast.editContent('上架成功');
                        var Von = that.Von;
                        for (var i = 0; i<Von.length;i++){
                            if(Von[i]['distop']){
                                for(var p = 0; p<Von[i]['distop'].length;p++){
                                    if(Von[i]['distop'][p]['goodsId'] == res.data.goodsId){
                                        Von[i]['distop'][p]['isSale'] = 1;
                                    }
                                }
                            }
                        }
                        that.Von = Von
                    } else {
                        const toast=that.$refs.toast
                        toast.editContent('错误');
                    }
                })
            },
            //下架
            next(e){
                var that = this;
                var goodsId = e.goodsId;
                var isSale = e.isSale;
                if(isSale!=1 && isSale!=0){
                    console.log('这个只是商品活动，请点击商品商家')
                    return false
                }
                var param = this.GLOBAL.sign(this.token,this.imei);
                param += '&goodsId='+goodsId+'&'+'isSale=0';
                post.fetch({
                    method:"POST",
                    url:'https://www.aftdc.com/businessapp/Enrol/saveSale',
                    body:param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    type:'json',
                },function(res){
                    if (res.data.res == 1){
                        var Von = that.Von;
                        for (var i = 0; i<Von.length;i++){
                            if(Von[i]['distop']){
                                for(var p = 0; p<Von[i]['distop'].length;p++){
                                    if(Von[i]['distop'][p]['goodsId'] == res.data.goodsId){
                                        Von[i]['distop'][p]['isSale'] = 0;
                                    }
                                }
                            }
                        }
                        that.Von = Von
                    } else {
                        const toast=that.$refs.toast
                        toast.editContent('错误');
                    }
                })
            },

            toUrl(goodsId){
                var param = {
                    goodsId: goodsId
                };
                var url='http://assets/addUpdataGoods.js';
                event.toUrl({ "url": url, "param": param });
            },
            addGoods(){
                var addGoodsTab = this.$refs.addGoodsTab;
                var direction = 200
                if(this.addGoodsShow === false){
                    direction = -190
                }
                animation.transition(addGoodsTab, {
                    styles: {
                        transform: 'translateY('+direction+'px)'
                    },
                    duration: 250, //ms
                    timingFunction: 'ease',
                    delay: 0 //ms
                })
                this.addGoodsShow = !this.addGoodsShow
            },
            addGoodsGoTo(i){
                if(i===1){
                    var param = '';
                    var url='http://assets/addUpdataGoods.js';
                    event.toUrl({ "url": url, "param": param });
                }else{
                    event.selectImg(99,'http://assets/addsGoods.js')
                }
                this.addGoods()
            },
            classifyManage(){
                var param = '';
                var url='http://assets/classifyManage.js';
                event.toUrl({ "url": url, "param": param });
            },
            classifySort(){
                var param = '';
                var url='http://assets/classifySort.js';
                event.toUrl({ "url": url, "param": param });
            },
            foodSort(){
                var von = this.Von;
                var catId = von[this.classflyIndex].catId;
                var param = {
                    catId:catId,
                    goodsArr:von[this.classflyIndex]['distop']
                };
                var url='http://assets/foodSortHandle.js';
                event.toUrl({ "url": url, "param": JSON.stringify(param)});
            },
            //监听页面返回
            viewdisappear(){
                let self=this;
                self.pageBack = true;
            },
            viewappear(){
                let self=this;
                if(!self.pageBack){ return; }
                self.pageBack = false;
                //如果有改动,更新
                if (event.find('changeGoodsManage')==1){
                    this.refresh();
                    event.delete('changeGoodsManage');
                }
            }
        },
    }
</script>

<style scoped>

    .overlay {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        transform: translateX(750px);
    }
    .overlayMove {
        transform: translateX(0);
    }

    .addGoodsTab {
        width: 275px;
        border-width: 1px;
        border-style: solid;
        border-color: #e1e1e1;
        position: fixed;
        right: 0;
        bottom: -100px;
        background-color: #fff;
    }
    .agtItem {
        height: 90px;
        align-items: center;
        justify-content: center;
    }
    .bottomBorder {
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: #e1e1e1;
    }





    .fill {
        width: 15px;
        height: 30px;
        background-color: #53beb7;
    }
    .scroller {
        width: 700px;
        height: 700px;
        border-width: 3px;
        border-style: solid;
        border-color: rgb(162, 217, 192);
        margin-top: 100px;
        margin-left: 25px;
    }
    .Goods_bottom {
        flex-direction: row;
        justify-content: space-around;
        position: fixed;
        left: 0;
        bottom: 0;
        align-items: center;
        background-color: #fff;
    }

    .bottom_name {
        height: 90px;
        align-items: center;
        justify-content: center;
        padding-top: 30px;
        padding-bottom: 30px;
        border-width: 1px;
        border-style: solid;
        border-color: #e1e1e1;
        border-collapse: collapse;

    }
    .content_navColor {
        background-color: #fff;
    }

    .textClassflyColor {
        color: #53beb7;
    }

    .ClassflyTitle {
        padding-top: 15px;
        padding-bottom: 15px;
        text-align: left;
        padding-left: 20px;
        background-color: #eff3f6;
        color: #666;
    }
    .foodsDiv{
        /*margin-top: 20px;*/
        /*margin-bottom: 20px;*/
        padding-left: 20px;
        padding-right: 20px;
        padding-top: 20px;
        padding-bottom: 20px;
        border-top-width: 1px;
        border-top-style: solid;
        border-top-color: #eff3f6;
    }
    .bottom_name:active {
        background-color: #eff3f6;
    }

    .GoodsContent {
        flex-direction: row;
        justify-content: flex-start;
    }

    .content_left {
        width: 200px;
        flex-direction: column;
        position: absolute;
        background-color: #eff3f6;
        top: 90px;
        left: 0;
        bottom: 90px;

    }


    .content_nav {
        background-color: #eff3f6;
        border-width: 1px;
        border-style: solid;
        border-color: #f1f1f1;
        border-top-width: 0;
        border-left-width: 0;
        min-width: 0;
        flex-direction: row;
        align-items: center;
    }


    .content_right {
        width: 550px;
        flex-direction: column;
        background-color: #e8e8e8;
        position: absolute;
        top: 90px;
        right: 0;
        bottom: 95px;
        border-left-width: 2px;
        border-left-style: solid;
        border-left-color: #f1f1f1;
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
    }
    .foodsMessage {
        flex-direction: row;
    }

    .right_content {
        flex-direction: column;
        background-color: #fff;
    }

    .msg_right {
        flex-direction: column;
        padding-left: 35px;
    }

    .img_default {
        width: 100px;
        height: 100px;
    }
    .right_button {
        flex-direction: row;
        justify-content: space-between;
        margin-top: 20px;
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

    }
    .active {
        border-left-width: 15px;
        border-left-style: solid;
        border-left-color: #53beb7;
    }
    .stopSale{
        font-size: 24px;
        color: white;
        width: 100px;
        height: 100px;
        position:absolute;
        background-color: rgba(100, 100, 100, 0.6);
        left:0;
        right:0;
        top: 0;
        bottom:0;
        text-align: center;
        line-height: 100px;
    }
</style>
