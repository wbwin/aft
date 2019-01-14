<template>
    <div @touchend="alltouchend">

        <!--头部-->
        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    @wxcMinibarRightButtonClicked="save"
                    v-once>
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">商品排序删除</text>
                <text :style="GLOBAL.headerCenter" slot="right">保存</text>
            </wxc-minibar>
        </div>

        <list class="scroller_content">
            <cell class="scroller_line" v-for="(item,index) in dataz" :class="[posi==false?'po':'']">

                <!--<div>-->
                <!--<wxc-checkbox :has-bottom-border="false" :value="index" :checked="item.checkbox==1?true:false"-->
                <!--@wxcCheckBoxItemChecked="wxcCheckBoxItemChecked" :config="config"></wxc-checkbox>-->
                <!--</div>-->



                <div class="line_left">
                    <div class="line_leftImg" @click="wxcCheckBoxItemChecked(index)">
                        <image class="line_leftIcon" :src="item.checkbox==1?'https://image.aftdc.com/appBimg/ic_check_box_checked.png':'https://image.aftdc.com/appBimg/ic_check_box_normal.png'"></image>
                    </div>
                    <div style="position: relative;">
                        <image class="img_default foodsImg" :src="'https://image.aftdc.com/'+item.goodsImg"></image>
                        <text class="stopSale" v-if="item.isSale==0" :style="{fontSize:GLOBAL.smallFS}">暂停售卖
                        </text>
                    </div>
                    <div class="foodsMsg">

                        <text class="foodName" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">{{item.goodsName}}</text>

                        <text class="foodStock" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">库存{{item.goodsStock==-1?'无限':item.goodsStock}}</text>
                        <text class="foodPrice" :style="{fontSize:GLOBAL.defaultFS}">￥{{item.marketPrice}}</text>
                    </div>
                </div>
                <div class="line_right">
                    <div>
                        <image class="img_button_top" v-if="index!=0" @touchstart="touchTop(index)"
                               @touchend="touchendTop(index)"
                               :src="item.touchTopImg==1?'https://image.aftdc.com/appBimg/ic_set_top_pressed.png':'https://image.aftdc.com/appBimg/ic_set_top_normal.png'"></image>
                    </div>
                    <div style="flex-direction: column;justify-content: space-between;">
                        <image class="img_button" v-if="index!=0" style="margin-bottom: 25px"
                               @touchstart="touchUp(index)" @touchend="touchendUp(index)"

                               :src="item.touchUpImg==1?'https://image.aftdc.com/appBimg/upArrow_fill.png':'https://image.aftdc.com/appBimg/upArrow.png'"></image>
                        <image class="img_button" style="margin-top: 25px" v-if="index!=dataz.length-1"
                               @touchstart="touchDown(index)" @touchend="touchendDown(index)"

                               :src="item.touchDownImg==1?'https://image.aftdc.com/appBimg/downArrow_fill.png':'https://image.aftdc.com/appBimg/downArrow.png'"></image>
                        <!--<image class="img_default img_button" @touchstart="touchMove(index)" @touchend="touchMove(index)"-->
                        <!--@longpress="LongPress($event)" @swipe="swipes($event)"-->
                        <!--:src="item.touchMoveImg==1?'https://image.aftdc.com/appBimg/ic_drag_pressed.png':'https://image.aftdc.com/appBimg/ic_drag_normal.png'"></image>-->

                    </div>

                </div>

            </cell>
        </list>
        <div class="sortHandle_bottom">


            <div class=" all" @click="allcheckbox()">
                <image class="line_leftIcon" :src="allcheck==true||checkboxNum.length==dataz.length?'https://image.aftdc.com/appBimg/ic_check_box_checked.png':'https://image.aftdc.com/appBimg/ic_check_box_normal.png'"></image>
                <text class="allSize" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">全部</text>
            </div>
            <div class="bottom_name" @click="delClick()">
                <text class="delSize" :style="{fontSize:GLOBAL.defaultFS}">删除</text>
            </div>
            <div class="bottom_name" @click="grounding()">
                <text class="updownSize" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">上架</text>
            </div>
            <div class="bottom_name" @click="undercarriage()">
                <text class="updownSize" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">下架</text>
            </div>

        </div>
        <toast ref="toast"></toast>
    </div>
</template>

<script>

    import {WxcCheckbox, WxcCheckboxList,WxcMinibar} from 'weex-ui';
    import Toast from './toast.vue';

    const modal = weex.requireModule('modal');
    const navigator = weex.requireModule('navigator');
    const post = weex.requireModule('stream');
    const event = weex.requireModule('event');
    export default {
        components: {WxcCheckbox, WxcCheckboxList,Toast,WxcMinibar},
        data() {
            return {
                // checkboxClick: true,//控制多选框按钮图片效果
                // topImg:true,//控制置顶按钮图片效果
                // moveImg:true,//控制移动框按钮图片效果
                allcheck: false,
                checkboxNum:[],//多选框选中下标
                posi: true,
                dataz: [],
                // {'checkbox':0,'isSale':0,'goodsStock':0,'marketPrice':0,'goodsId':0,'goodName':0,},

                checkedList: '',
                is_change: 0,//是否有改动
                token:'',
                imei:''
            }
        },
        created: function () {
            this.token = weex.config.token;
            this.imei = weex.config.imei;
            this.dataz = JSON.parse(weex.config.param).goodsArr;

            // var that = this;
            // var timestamp = Date.parse(new Date()) / 1000;
            // var sign = 'im=' + that.imei + '&token=' + that.token + '&timestamp=' + timestamp
            // // var sign = this.GLOBAL.md5(sign);
            // sign = sign.toUpperCase()
            // var catId = 99;
            // var shopId = 642;
            // var formData = 'catId=' + catId + '&&' + 'shopId=' + shopId
            // post.fetch({
            //     method: 'post',
            //     type: 'json',
            //     body: formData,
            //     url: 'https://www.aftdc.com/businessapp/Enrol/getgoods',
            //     headers: {"Content-Type": "application/x-www-form-urlencoded"},
            // }, function (res) {
            //     that.dataz = res.data.data
            // })
        },
        methods: {
            minibarLeftButtonClick(){
                if (this.is_change) event.save('changeGoodsManage', 1);//标记商品管理改变
                navigator.pop({ animated: 'true' });
            },

            //保存排序
            save() {
                var param = this.GLOBAL.sign(this.token,this.imei);
                var that = this;
                const toast = that.$refs.toast;

                var dataz = that.dataz;
                for (var i in dataz) {
                    dataz[i]['goodsSort'] = dataz.length - (i + 1);
                }

                param += '&goodsArr=' + JSON.stringify(dataz);
                post.fetch({
                    method: 'post',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/businessapp/Goods/goodsPx',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                }, function (res) {
                    if (res.data.res == 1) {
                        toast.editContent('保存成功');
                        event.save('changeGoodsManage', 1);//标记商品管理改变
                        setTimeout(() => navigator.pop({animated: 'true'}), 2000);
                    } else toast.editContent('保存失败,请稍后再试');
                })
            },

            alltouchend(){
                for(var i in this.dataz){
                    this.$set(this.dataz[i], 'touchTopImg', 0);
                    this.$set(this.dataz[i], 'touchUpImg', 0);
                    this.$set(this.dataz[i], 'touchDownImg', 0)
                }
            },
            touchTop(index) {
                this.$set(this.dataz[index], 'touchTopImg', 1)
            },
            touchUp(index) {
                this.checkboxNum=[];
                for(var i in this.dataz){
                    this.dataz[i].checkbox=0;
                }
                this.$set(this.dataz[index], 'touchUpImg', 1)
            },
            touchDown(index) {
                this.checkboxNum=[];
                for(var i in this.dataz){
                    this.dataz[i].checkbox=0;
                }
                this.$set(this.dataz[index], 'touchDownImg', 1)
            },

            touchendTop(index) {
                this.checkboxNum=[];
                for(var i in this.dataz){
                    this.dataz[i].checkbox=0;
                }
                var datas = this.dataz[index];
                this.dataz.splice(index, 1);
                this.dataz.unshift(datas);
            },
            touchendUp(index) {
                var datas = this.dataz;
                var temp = datas[index - 1];
                datas[index - 1] = datas[index];
                datas[index] = temp;
                this.dataz = datas;
            },
            touchendDown(index) {
                var datas = this.dataz;
                var temp = datas[index];
                datas[index] = datas[index + 1];
                datas[index + 1] = temp;
                this.dataz = datas;
            },
            alltouchMove(index) {
                this.$set(this.dataz[index], 'touchTopImg', 0);
                this.$set(this.dataz[index], 'touchUpImg', 0);
                this.$set(this.dataz[index], 'touchDownImg', 0)
            },
            wxcCheckBoxItemChecked(index) {
                this.allcheck=false;
                if (this.dataz[index].checkbox==1) {
                    this.$set(this.dataz[index], 'checkbox', 0);
                    for (var i = 0; i < this.checkboxNum.length; i++) {
                        if (this.checkboxNum[i] === index) {
                            this.checkboxNum.splice(i, 1);
                            break;
                        }
                    }
                } else {
                    this.$set(this.dataz[index], 'checkbox', 1);
                    this.checkboxNum.push(index)
                }
            },
            allchecks(e) {
                var that = this;
                if (e.checked == false) {
                    that.allcheck = false;
                    for (var i = 0; i < that.dataz.length; i++) {
                        that.$set(this.dataz[i], 'checkbox', 0)

                    }
                    that.checkboxNum = [];
                } else {
                    that.allcheck = true;
                    for (var i = 0; i < that.dataz.length; i++) {
                        that.$set(this.dataz[i], 'checkbox', 1);
                        that.checkboxNum.push(i)
                    }
                }
            },
            // touchMove(index) {
            //     if (this.dataz[index]['touchMoveImg'] == 1) {
            //
            //         this.$set(this.dataz[index], 'touchMoveImg', 0)
            //     } else {
            //
            //
            //         this.$set(this.dataz[index], 'touchMoveImg', 1)
            //     }
            // },
            checkboxClick(index) {
                if (this.dataz[index]['checkbox'] == 1) {

                    this.$set(this.dataz[index], 'checkbox', 0);
                    for (var i = 0; i < this.checkboxNum.length; i++) {
                        if (this.checkboxNum[i] === index) {
                            this.checkboxNum.splice(i, 1);
                            break;
                        }
                    }
                } else {
                    this.$set(this.dataz[index], 'checkbox', 1);
                    this.checkboxNum.push(index)
                }
            },
            allcheckbox() {
                var that = this;
                if (that.allcheck === false) {
                    that.allcheck = true;
                    that.checkboxNum=[];//松演添加
                    for (var i = 0; i < that.dataz.length; i++) {
                        that.$set(this.dataz[i], 'checkbox', 1);
                        that.checkboxNum.push(i)
                    }

                } else {
                    that.allcheck = false;
                    for (var i = 0; i < that.dataz.length; i++) {
                        that.$set(this.dataz[i], 'checkbox', 0)
                    }
                    that.checkboxNum = [];
                }
            },
            delClick: function () {
                var that = this;
                if (that.checkboxNum.length <= 0) {
                    const toast=that.$refs.toast;
                    toast.editContent('暂无选用商品')
                } else {
                    modal.confirm({
                        message: '确认删除选中的商品？',
                        okTitle: '确认',
                        cancelTitle: '取消'
                    }, result => {
                        if (result == '确认') {
                            var checkboxNum = that.checkboxNum;
                            var dataz = that.dataz;
                            var goodsId = '';
                            for (var i = 0; i < dataz.length; i++) {
                                for (var p = 0; p < checkboxNum.length; p++) {
                                    if (i == checkboxNum[p]) {
                                        goodsId += dataz[i]['goodsId'] + ',';
                                    }
                                }
                            }
                            goodsId = goodsId.substr(0, goodsId.length - 1);
                            that.del_Goods(goodsId);
                        } else if (result == '取消') {
                            return false
                        }
                    })
                }
            },
            del_Goods:function(goodsId) {
                var param = this.GLOBAL.sign(this.token,this.imei);
                var that = this;
                const toast=that.$refs.toast;
                param += '&goodsId=' + goodsId;
                post.fetch({
                    method: 'post',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/businessapp/Enrol/delGoods',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                }, function (res) {
                    if (res.data.res == 1) {
                        var dataz = that.dataz;
                        for (var i = that.checkboxNum.length-1; i >=0; i--) {
                            dataz.splice(that.checkboxNum[i], 1);
                        }
                        that.checkboxNum=[];
                        that.dataz = dataz;
                        that.allcheck = false;
                        that.is_change = 1;
                        toast.editContent('删除成功！');
                    } else toast.editContent('删除失败，请稍后再试');
                })
            },
            grounding() {
                var that = this;
                var checkboxNum = that.checkboxNum;
                if (checkboxNum.length <= 0) {
                    const toast=that.$refs.toast;
                    toast.editContent('暂无选用商品')
                } else {
                    var dataz = that.dataz;
                    var goodsId = '';
                    var list = [];
                    for (var i = 0; i < dataz.length; i++) {
                        for (var p = 0; p < checkboxNum.length; p++) {
                            if (i == checkboxNum[p]) {
                                // dataz[i]['checkbox'] = 0;
                                if (dataz[i]['isSale'] == 1) {
                                    that.checkboxNum = [];
                                    that.allcheck = false;
                                    for (var i = 0; i < dataz.length; i++) {
                                        that.$set(dataz[i], 'checkbox', 0)
                                    }
                                    that.dataz = dataz;

                                    const toast=that.$refs.toast;
                                    toast.editContent('已有上架商品');
                                    return false
                                }
                                goodsId += dataz[i]['goodsId'] + ',';
                                list.push(dataz[i]['goodsId'])
                            }
                        }
                    }
                    that.checkboxNum = [];
                    goodsId = goodsId.substr(0, goodsId.length - 1);
                    that.board(goodsId, list)
                }
            },
            //上架
            board(goodsId, list) {
                var param = this.GLOBAL.sign(this.token,this.imei);
                var that = this;
                param += '&goodsId=' + goodsId + '&' + 'isSale=1';
                post.fetch({
                    method: 'post',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/businessapp/Enrol/boardGoods',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                }, function (res) {
                    if (res.data.res == 1) {
                        var dataz = that.dataz;
                        for (var i = 0; i < dataz.length; i++) {
                            for (var p = 0; p < list.length; p++) {
                                if (dataz[i]['goodsId'] == list[p]) {
                                    dataz[i]['isSale'] = 1;
                                    dataz[i]['checkbox']=0
                                }
                            }
                        }
                        that.checkboxNum = [];
                        that.allcheck = false;
                        that.dataz = dataz;
                        that.is_change = 1;
                    }
                })
            },
            undercarriage() {
                var that = this;
                var checkboxNum = that.checkboxNum;
                if (checkboxNum.length <= 0) {
                    const toast=that.$refs.toast;
                    toast.editContent('暂无选用商品')
                } else {
                    var dataz = that.dataz;
                    var goodsId = '';
                    var list = [];
                    for (var i = 0; i < dataz.length; i++) {
                        for (var p = 0; p < checkboxNum.length; p++) {
                            if (i == checkboxNum[p]) {
                                // dataz[i]['checkbox'] = 0;
                                if (dataz[i]['isSale'] == 0) {
                                    that.checkboxNum = [];
                                    that.allcheck = false;
                                    for (var i = 0; i < dataz.length; i++) {
                                        that.$set(dataz[i], 'checkbox', 0)
                                    }
                                    that.dataz = dataz;

                                    const toast=that.$refs.toast;
                                    toast.editContent('已有下架商品');
                                    return false
                                }
                                goodsId += dataz[i]['goodsId'] + ',';
                                list.push(dataz[i]['goodsId'])
                            }
                        }
                    }
                    that.allcheck = false;
                    that.checkboxNum = [];
                    goodsId = goodsId.substr(0, goodsId.length - 1);
                    that.next(goodsId, list);
                }
            },
            //下架
            next(goodsId, list) {
                var param = this.GLOBAL.sign(this.token,this.imei);
                var that = this;
                param += '&goodsId=' + goodsId + '&&' + 'isSale=0';
                post.fetch({
                    method: 'post',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/businessapp/Enrol/boardGoods',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                }, function (res) {
                    if (res.data.res == 1) {
                        var dataz = that.dataz;
                        for (var i = 0; i < dataz.length; i++) {
                            for (var p = 0; p < list.length; p++) {
                                if (dataz[i]['goodsId'] == list[p]) {
                                    dataz[i]['isSale'] = 0;
                                    dataz[i]['checkbox']=0
                                }
                            }
                        }
                        that.checkboxNum = [];
                        that.allcheck = false;
                        that.dataz = dataz;
                        that.is_change = 1;
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .scroller_content {
        flex-direction: column;
        flex: 1;
        width: 750px;
    }

    .po {
        position: relative;
    }

    .scroller_line {
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        padding-top: 40px;
        padding-bottom: 40px;
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #f8f8f8;
        /*padding-left: 20px;*/
        padding-right: 20px;
        /*transition-property:backgroundColor;*/
        /*transition-duration: 0.3s;*/
        /*transition-delay: 0s;*/
        /*transition-timing-function:ease-in-out;*/

    }

    .line_left {
        /*flex: 1;*/
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        flex: 10;
    }
    .line_leftIcon{
        width: 36px;
        height: 36px;
        margin-left: 20px;
        margin-right: 20px;
    }
    .line_leftImg{
        width: 56px;
        height: 56px;
        justify-content: center;
        align-items: center;
    }

    .line_right {
        /*flex: 1;*/
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        flex: 4;
    }

    .checkbox {

        border-width: 4px;
        border-style: solid;
        border-color: #666;
        width: 38px;
        height: 38px;
    }

    .img_default {
        width: 38px;
        height: 38px;
    }

    .foodsImg {
        width: 100px;
        height: 100px;
        margin-right: 20px;
        /*background-color: #53beb7;*/
    }
    .stopSale{
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

    .foodsMsg {
        flex-direction: column;
        justify-content: flex-start;

    }

    .defaultSize {
        font-size: 35px;
        color: #333;
    }

    .foodName {
        /*margin-top: 10px;*/
        width: 300px;
        /*padding-right: 15px;*/

    }

    .foodStock {
        margin-top: 10px;
    }

    .foodPrice {
        margin-top: 10px;
        color: red;
    }

    .img_button {
        width: 35px;
        height: 35px;
    }

    .img_button_top {
        width: 55px;
        height: 55px;
        margin-right: 30px;
    }

    .sortHandle_bottom {
        flex-direction: row;
        justify-content: space-around;
        background-color: #fff;
    }

    .all {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        height: 100px;
        border-width: 2px;
        border-style: solid;
        border-color: #e1e1e1;
        border-collapse: collapse;
        flex: 1.1;
        padding-right: 10px;
    }

    .bottom_name {
        flex: 1;
        height: 100px;
        align-items: center;
        justify-content: center;
        border-width: 2px;
        border-style: solid;
        border-color: #e1e1e1;
        border-collapse: collapse;
    }

    /*.allcheckbox {*/

    /*border-width: 4px;*/
    /*border-style: solid;*/
    /*border-color: #666;*/

    /*width: 38px;*/
    /*height: 38px;*/
    /*}*/

    .allSize {
        margin-right: 20px;
    }

    .delSize {
        text-align: center;
        color: red;
    }

    .updownSize {
        text-align: center;
    }

    .bottom_name:active {
        background-color: #f1f1f1;
    }


</style>
