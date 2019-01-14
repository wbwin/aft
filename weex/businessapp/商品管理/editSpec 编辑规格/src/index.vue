<template>
    <div class="wrapper" @touchmove="touchmove" @touchend="touchend" :style="{visibility: visibility}">
        <wxc-minibar
                background-color="#53beb7"
                text-color="#fff"
                @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                @wxcMinibarRightButtonClicked="allSaveClick"
                v-once>
            <image :style="GLOBAL.headerImg"  slot="left"
                   src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
            <text :style="GLOBAL.headerCenter" slot="middle">编辑规格</text>
            <text :style="GLOBAL.headerRight" slot="right">保存</text>
        </wxc-minibar>
        <scroller class="scroller" @scroll="scrollMove">
            <div v-for="(item,index) in spec"  ref="scroller">
                <div class="listCell">
                    <div class="content_title">
                        <div class="goodsNameCss">
                            <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">规格{{index+1}}</text>
                        </div>
                        <div class="classifyCheck">
                            <text style="color:#f00;font-size: 28px" @click="specDelClick(index)">删除</text>
                        </div>
                    </div>
                    <div class="scroller_content">
                        <div class="goodsNameCss">
                            <image class="redStar" src="https://image.aftdc.com/appBimg/redStar.png"></image>
                            <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">规格名称</text>
                        </div>
                        <div class="inputCss">
                            <input v-model="item.guigeName"  :autofocus="index==0?true:false" :class="[errorCss?'errorCss':'']"
                                   :style="GLOBAL.inputText" style="text-align: right" maxlength="20" placeholder="请输入规格名称" ref="inputOne" @focus="allFocus()" @blur="allBlur()"/>
                        </div>
                    </div>
                    <div class="scroller_content">
                        <div class="goodsNameCss">
                            <image class="redStar" src="https://image.aftdc.com/appBimg/redStar.png"></image>
                            <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">价格</text>
                        </div>
                        <div class="inputCss">
                            <input type="number" v-model="item.price" :class="[errorCss?'errorCss':'']"
                                   :style="GLOBAL.inputText" style="text-align: right" placeholder="请填写价格" ref="inputTwo" @focus="allFocus(index,0)" @blur="allBlur()"/>
                        </div>
                    </div>
                    <div class="scroller_content">
                        <div class="goodsStockCss">
                            <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">库存无限</text>
                        </div>
                        <div class="classifyCheck">
                            <div ref="test2" :class="[allStock[index]!=-1?'close':'open']"
                                 style="justify-content: center;padding-left: 1px;"
                                 @click="bill(index)"  >
                                <div ref="test1" :class="[allStock[index]!=-1?'isClose':'isOpen']" ></div>
                            </div>
                            <!--<switch @change="swicthChange(index)" :checked="item.stock==-1?true:false"></switch>-->
                        </div>
                    </div>
                    <div class="scroller_content" v-if="item.stock!=-1">
                        <div class="goodsNameCss">
                            <image class="redStar" src="https://image.aftdc.com/appBimg/redStar.png"></image>
                            <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">库存数量</text>
                        </div>
                        <div class="inputCss">
                            <input type="number" v-model="item.stock" :class="[errorCss?'errorCss':'']"
                                   :style="GLOBAL.inputText" style="text-align: right" placeholder="请填写商品库存" ref="inputThree" @focus="allFocus(index,1)" @blur="allBlur()"/>
                        </div>
                    </div>
                </div>
            </div>
            <div class="fill"></div>
        </scroller>
        <div class="spec_bottom" v-if="inputFocus">
            <wxc-button class="btnActive" text="+ 添加规格" :disabled="spec.length==10?true:false" :text-style="GLOBAL.buttonText" :btn-style="GLOBAL.defaultButton"
                        @wxcButtonClicked="wxcButtonClicked"></wxc-button>
        </div>
        <toast ref="toast"></toast>
    </div>
</template>

<script>

    import {WxcMinibar,WxcButton} from 'weex-ui';
    import Toast from './Toast.vue'
    const modal = weex.requireModule('modal');
    const animation = weex.requireModule('animation');
    const navigator = weex.requireModule('navigator');
    const dom = weex.requireModule('dom');
    const event = weex.requireModule('event');
    export default {
        components: { WxcMinibar,WxcButton,Toast},
        data() {
            return {
                focu: false,
                backImgToggle: 0,//头部返回图片判断
                errorCss: false,//判断保存时出错的样式
                backShow:false,//返回箭头时的弹出框
                spec: [], //一开始无规格时默认为两个规格；
                allStock:[],//用于一开始判断switch是开还是关闭状态，除在created改变外，其他地方不可改变
                touch:false,//用于获取焦点和失去焦点的兼容
                inputFocus:true,
                blurPrevent:false,//阻止多次失去焦点的定时器
                blurPreventSec:false,
                visibility:'hidden',
            }
        },
        created(){
            var that=this
            this.visibility='hidden';
            var thisGoodsInfo = event.find('thisGoodsInfo');
            if (thisGoodsInfo) {
                var spec = JSON.parse(thisGoodsInfo).guige;
                if (spec) {
                    this.spec = JSON.parse(JSON.parse(thisGoodsInfo).guige);
                    if (this.spec.length == 0) {
                        this.spec = [{ guigeName: '', price: '', stock: '' }, { guigeName: '', price: '', stock: '' }];
                    }
                    for (var i = 0; i < this.spec.length; i++) {
                        this.allStock.push(that.spec[i].stock);
                    }
                }else{
                    this.spec = [{ guigeName: '', price: '', stock: '' }, { guigeName: '', price: '', stock: '' }];
                }
            }
        },
        mounted(){
            var that=this
            this.visibility='visible';
        },
        methods: {
            minibarLeftButtonClick(){

            },
            // input的获取焦点和失去焦点
            touchmove(){
                this.touch=true;
            },
            touchend(){
                this.touch=false;
            },
            scrollMove(){
                if(this.touch){
                    this.blur()
                }
            },
            //键盘弹起后点击其他地方收起键盘
            allFocus(index,toggle){
                var that=this;
                that.inputFocus=false;
                if(that.blurPrevent){
                    that.blurPreventSec=true;
                }
                else{
                    that.blurPreventSec=false;
                }
                // that.aa=true;
                setTimeout(function () {
                    that.blurPrevent = true;
                },80)
                setTimeout(function () {
                    that.blurPreventSec=false;
                },320)

                if(toggle==0){
                    that.$refs.inputTwo[index].setTextFormatter({
                        formatRule: "/(\\.\\d{2})(\\S+)/",
                        formatReplace: "$1",
                        recoverRule: "/\\s+/g",
                        recoverReplace: ""
                    })
                }else if(toggle==1){
                    that.$refs.inputThree[index].setTextFormatter({
                        formatRule: "/(\\.\\d{2})(\\S+)/",
                        formatReplace: "$1",
                        recoverRule: "/\\./g",
                        recoverReplace: ""
                    })
                }
            },
            allBlur(){
                var that=this;
                setTimeout(function () {
                    if(that.blurPreventSec){
                        setTimeout(function () {
                            that.blurPreventSec=false;
                        },40)
                    }
                    else{
                        that.inputFocus=true;
                        that.blurPrevent = false;
                    }
                }, 200)
            },
            blur(){
                var that=this
                var count=0;
                for(var i=0;i<that.spec.length;i++){
                    that.$refs.inputOne[i].blur()
                    that.$refs.inputTwo[i].blur()
                    if(that.spec[i].stock!=-1){
                        that.$refs.inputThree[i-count].blur()
                    }else{
                        count++
                    }

                }
            },



            specDelClick: function specDelClick(index) {
                var that = this;
                this.blur()
                that.spec.splice(index, 1);

            },
            wxcButtonClicked: function wxcButtonClicked() {
                var that = this;
                if (that.spec.length < 10) {

                    var newSpec = { guigeName: '', price: '', stock: '' };
                    that.spec.push(newSpec);
                    setTimeout(function () {
                        dom.scrollToElement(that.$refs.scroller[that.spec.length - 1], {});
                    }, 100);
                }
            },
            allSaveClick() {
                var that=this
                var spec = this.spec;
                this.blur()
                if(spec.length<2){
                    const toast=that.$refs.toast
                    toast.editContent('至少需要添加两种规格');
                    return false
                }
                for (var i = 0; i < this.spec.length; i++) {
                    if (!spec[i].guigeName || !spec[i].price || !spec[i].stock) {
                        this.errorCss = true;
                        const toast=that.$refs.toast
                        toast.editContent('请填写完整');
                        return false
                    }
                }
                var thisGoodsInfo = event.find('thisGoodsInfo');
                thisGoodsInfo = JSON.parse(thisGoodsInfo)
                thisGoodsInfo.guige = JSON.stringify(spec);
                event.save('thisGoodsInfo', JSON.stringify(thisGoodsInfo));
                navigator.pop({
                    animated: 'true'
                });
                //注意：保存时如果spec的长度为小于2时spec为空保存
            },
            backClick: function backClick() {
                this.backShow = true;
            },
            bill: function bill(index) {
                var that = this;
                if (that.spec[index].stock != -1) {

                    var testEl = that.$refs.test1[index];
                    var testE2 = that.$refs.test2[index];
                    if (that.allStock[index] == -1) {
                        var transform = 'translate(0px, 0px)';
                    } else {
                        var transform = 'translate(52px, 0px)';
                    }
                    animation.transition(testEl, {
                        styles: {
                            transform: transform
                        },
                        duration: 500, //ms
                        timingFunction: 'ease',
                        delay: 0 //ms
                    });
                    animation.transition(testE2, {
                        styles: {
                            backgroundColor: '#4ed465'
                        },
                        duration: 500, //ms
                        timingFunction: 'ease',
                        delay: 0 //ms
                    });

                    that.spec[index].stock = -1;
                } else {
                    var testEl = this.$refs.test1[index];
                    var testE2 = this.$refs.test2[index];
                    if (that.allStock[index] == -1) {
                        var transform = 'translate(-52px, 0px)';
                    } else {
                        var transform = 'translate(0px, 0px)';
                    }
                    animation.transition(testEl, {
                        styles: {
                            transform: transform
                        },
                        duration: 500, //ms
                        timingFunction: 'ease',
                        delay: 0 //ms
                    });
                    animation.transition(testE2, {
                        styles: {
                            backgroundColor: '#e2e2e2'
                        },
                        duration: 500, //ms
                        timingFunction: 'ease',
                        delay: 0 //ms
                    });
                    that.spec[index].stock = '';
                }
            }
        }
    }
</script>

<style scoped>
    .wrapper {
        flex-direction: column;
        background-color: #eff3f6;
    }

    .listCell {
        background-color: #fff;
        margin-bottom: 20px;
        flex-direction: column;
    }
    .scroller {
        flex-direction: column;
        position: absolute;
        top: 90px;
        left: 0;
        right: 0;
        bottom: 0;
    }
    .fill {
        width: 750px;
        height: 128px;
    }
    .scroller_content {
        flex-direction: row;
        align-items: center;
        justify-content: space-around;
        padding-top: 30px;
        padding-left: 20px;
        padding-right: 20px;
        padding-bottom: 30px;
        background-color: #fff;
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: #f8f8f8;

    }
    .content_title{
        flex-direction: row;
        align-items: center;
        justify-content: space-around;
        background-color: #fff;
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: #f8f8f8;
        padding-top: 30px;
        padding-left: 30px;
        padding-bottom: 10px;
        padding-right: 30px;
    }
    .goodsNameCss {
        flex: 0.5;
        flex-direction: row;
        align-items: center;

    }

    .redStar {
        width: 12px;
        height: 12px;
        margin-right: 10px;
    }


    .inputCss {
        flex: 1.5;
        /*align-items: center;*/
    }

    .goodsStockCss {
        flex-direction: column;
        margin-left: 20px;
    }

    .classifyCheck {
        flex: 1.5;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
    }
    .spec_bottom{
        flex-direction: row;
        justify-content: space-around;
        position: fixed;
        left: 0;
        bottom: 0;
        right: 0;
        background-color: #fff;
        padding-top: 20px;
        padding-bottom: 20px;
        padding-left: 30px;
        padding-right: 30px;
        border-width: 2px;
        border-style: solid;
        border-color: #f8f8f8;
    }
    .btnActive:active {
        background-color: #57aba5;
    }
    .btnActive:enabled {
        background-color: #57beb7;
    }
    .open {
        width: 104px;
        height: 52px;
        border-radius: 52px;
        border-width: 1px;
        border-style: solid;
        border-color: white;
        background-color: #4ed465;

    }

    .close {
        width: 104px;
        height: 52px;
        border-radius: 52px;
        border-width: 1px;
        border-style: solid;
        border-color: #bbbbbb;

    }

    .isOpen {
        width: 50px;
        height: 50px;
        border-radius: 26px;
        border-width: 1px;
        border-style: solid;
        border-color: #e2e2e2;
        background-color: #ffffff;
        left: 52px;
    }

    .isClose {
        width: 50px;
        height: 50px;
        background-color: white;
        border-radius: 26px;
        border-width: 1px;
        border-style: solid;
        border-color: #e2e2e2;

    }
    /*****************/

    .errorCss{
        placeholder-color: #ffb05d;
    }
    /***********************/

</style>
