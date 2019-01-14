<template>
    <div class="wrapper" @viewappear="viewappear" @viewdisappear="viewdisappear" @touchmove="touchmove" @touchend="touchend" :style="{visibility: visibility}">
        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="backClick"
                    @wxcMinibarRightButtonClicked="allSaveClick"
                    v-once>
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">{{goodsId?'编辑商品':'添加商品'}}</text>
                <text :style="GLOBAL.headerRight"  slot="right">保存</text>
            </wxc-minibar>
        </div>
        <list class="scroller" @scroll="scrollMove">
            <cell>
                <div class="listCell">
                    <div class="scroller_content">
                        <div class="goodsNameCss">
                            <image class="redStar" src="https://image.aftdc.com/appBimg/redStar.png"></image>
                            <text :style="{fontSize: GLOBAL.defaultFS,color:GLOBAL.dColor}">商品名称</text>
                        </div>
                        <div class="inputCss">
                            <input class="input" :style="GLOBAL.inputText" type="text" v-model="goodsName" ref="inputOne" @focus="allFocus()" @blur="allBlur()" :class="[errorCss?'errorCss':'']" placeholder="限20字以内"/>
                        </div>
                    </div>
                    <div class="scroller_content" @click="pick()">
                        <div class="goodsNameCss">
                            <image class="redStar" src="https://image.aftdc.com/appBimg/redStar.png"></image>
                            <text :style="{fontSize: GLOBAL.defaultFS,color:GLOBAL.dColor}">商品分类</text>
                        </div>
                        <div class="classifyCheck">
                            <text class="classify" :style="{fontSize: GLOBAL.defaultFS,color:classify=='请选择'?errorCss?'#ff9490':'#999':GLOBAL.dColor}">{{classify}}</text>
                            <image class="arrowImg"
                                   src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                        </div>
                    </div>
                    <div class="scroller_content" @click="changeImg()">
                        <div class="updataImg">
                            <text :style="{fontSize: GLOBAL.defaultFS,color:GLOBAL.dColor}">上传图片</text>
                            <text class="desc" >图片需要小于2M</text>
                        </div>
                        <div class="classifyCheck">
                            <image class="addImg" :src="!goodsImg&&!localImg?'https://image.aftdc.com/appBimg/icon_add_image.png':localImg==''?'https://image.aftdc.com/'+goodsImg:localImg"></image>
                        </div>
                    </div>
                </div>
            </cell>

            <!--商品标签-->
            <cell>
                <div class="listCell">
                    <div class="row labelDiv" >
                        <image class="labelIcon" src="https://image.aftdc.com/appBimg/ic_report.png"></image>
                        <text class="labelText" :style="{fontSize: GLOBAL.defaultFS}">准确选择商品标签有助于提升您的搜索与推荐曝光</text>
                    </div>
                    <div class="scroller_content" style="border-bottom-color: #fff" @click="toSelectClass">
                        <div class="goodsNameCss">
                            <image class="redStar" src="https://image.aftdc.com/appBimg/redStar.png"></image>
                            <text :style="{fontSize: GLOBAL.defaultFS,color:GLOBAL.dColor}">商品标签</text>
                        </div>
                        <div class="classifyCheck">
                            <text class="classify" :style="{fontSize: GLOBAL.defaultFS,color:brandLabel?GLOBAL.dColor:errorCss?'#ff9490':'#999'}">{{brandLabel?brandLabel:'请选择'}}</text>
                            <image class="arrowImg"
                                   src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                        </div>
                    </div>
                    <!--<input class="labelInput" type="text" placeholder="如商品主料、配料、菜系等" :style="{fontSize: GLOBAL.smallFS,color:GLOBAL.tColor}" disabled="true">-->

                </div>
            </cell>
            <cell>

                <!--*************有规格*************-->
                <div class="listCell" >
                    <div v-if="spec==''">
                        <!--*************无规格*************-->
                        <div class="scroller_content">
                            <div class="goodsNameCss">
                                <image class="redStar" src="https://image.aftdc.com/appBimg/redStar.png"></image>
                                <text :style="{fontSize: GLOBAL.defaultFS,color:GLOBAL.dColor}">价格</text>
                            </div>
                            <div class="inputCss">
                                <input class="input" :style="GLOBAL.inputText" type="number" v-model="price" ref="inputTwo" @focus="allFocus(0)" @blur="allBlur()" :class="[errorCss?'errorCss':'']" placeholder="请填写价格"/>
                            </div>
                        </div>
                        <div class="scroller_content">
                            <div class="goodsStockCss">

                                <text :style="{fontSize: GLOBAL.defaultFS,color:GLOBAL.dColor}">库存无限</text>
                            </div>
                            <div class="classifyCheck">
                                <div ref="test2" :class="[startSwitch==false?'close':'open']"
                                     style="justify-content: center;padding-left: 1px;"
                                     @click="bill">
                                    <div ref="test1" :class="[startSwitch==false?'isClose':'isOpen']"></div>
                                </div>
                            </div>
                        </div>
                        <div class="scroller_content" v-if="isOn==false">
                            <div class="goodsNameCss">
                                <image class="redStar" src="https://image.aftdc.com/appBimg/redStar.png"></image>
                                <text :style="{fontSize: GLOBAL.defaultFS,color:GLOBAL.dColor}">库存数量</text>
                            </div>
                            <div class="inputCss">
                                <input class="input" :style="GLOBAL.inputText" type="number" v-model="goodsStock" ref="inputThree" @focus="allFocus(1)" @blur="allBlur()" :class="[errorCss?'errorCss':'']" placeholder="请填写商品库存"/>
                            </div>
                        </div>
                        <div class="scroller_content">
                            <div class="goodsNameCss">

                            </div>
                            <div class="spec" @click="editGuiGe">
                                <image class="specImg"
                                       src="https://image.aftdc.com/appBimg/icon_add_small_blue.png"></image>
                                <text :style="{fontSize: GLOBAL.defaultFS,color:GLOBAL.tColor}">多规格（多种规格设置）</text>
                            </div>
                        </div>
                        <!--*************无规格*************-->

                    </div>

                    <div v-if="spec!=''" class="scroller_content">
                        <div class="property">
                            <text :style="{fontSize: GLOBAL.defaultFS,color:GLOBAL.dColor}">商品规格</text>
                        </div>
                        <div class="classifyCheck" @click="editGuiGe">
                            <image class="propertyImg"
                                   src="https://image.aftdc.com/appBimg/icon_amend_small_blue.png"></image>
                            <text :style="{fontSize: GLOBAL.defaultFS,color:GLOBAL.tColor}">编辑规格</text>
                        </div>
                    </div>
                    <div v-if="spec!=''" class="allSpecDiv" v-for="(item,index) in spec">
                        <div class="specFor">
                            <div class="specTitle">
                                <text class="specSize" :style="{fontSize: GLOBAL.bigFS,color:GLOBAL.dColor}">规格{{index+1}}</text>
                            </div>
                            <div class="classifyCheck">
                                <text :style="{fontSize: GLOBAL.defaultFS,color:'red'}" @click="specDelClick(index)">删除</text>
                            </div>
                        </div>
                        <div class="specName">
                            <text :style="{fontSize: GLOBAL.bigFS,color:'#999'}">规格名称：{{item.guigeName}}</text>
                        </div>
                        <div class="specPriceNum">
                            <div class="flexOne" >
                                <text :style="{fontSize: GLOBAL.bigFS,color:'#999'}">价格:{{item.price}}</text>
                            </div>
                            <div class="flexOne" >
                                <text :style="{fontSize: GLOBAL.bigFS,color:'#999'}">库存数量：{{item.stock==-1?'无限':item.stock}}</text>
                            </div>
                        </div>
                    </div>

                </div>
                <!--*************有规格*************-->
            </cell>
            <cell>
                <div class="listCell">
                    <div class="scroller_content">
                        <div class="property">
                            <text :style="{fontSize: GLOBAL.defaultFS,color:GLOBAL.dColor}">商品属性</text>
                        </div>
                        <div class="classifyCheck" @click="editAttrs()">
                            <image class="propertyImg"
                                   src="https://image.aftdc.com/appBimg/icon_amend_small_blue.png"></image>
                            <text :style="{fontSize: GLOBAL.defaultFS,color:GLOBAL.tColor}">编辑属性</text>
                        </div>
                    </div>
                    <!--*************有属性*************-->
                    <div v-if="taste!=''">
                        <div class="allSpecDiv" v-for="(item,index) in taste">
                            <div class="specFor">
                                <div class="specTitle">
                                    <text class="specSize" :style="{fontSize: GLOBAL.bigFS,color:GLOBAL.dColor}">属性{{index+1}}</text>
                                </div>
                                <div class="classifyCheck">
                                    <text :style="{fontSize: GLOBAL.defaultFS,color:'red'}" @click="propertyDelClick()">删除</text>
                                </div>
                            </div>
                            <div class="specName">
                                <text :style="{fontSize: GLOBAL.bigFS,color:'#999'}">属性名称：{{ item.attrName}}</text>
                            </div>

                            <div class="specName tasteName">
                                <text :style="{fontSize: GLOBAL.bigFS,color:'#999'}">属性标签：</text>
                                <text :style="{fontSize: GLOBAL.bigFS,color:'#999'}" v-for="(t,index) in item.attrContent">{{index>0?t:t+','}}</text>
                            </div>
                        </div>
                    </div>
                    <!--*************有属性*************-->
                    <div class="scroller_content">
                        <div class="goodsNameCss">
                            <image class="redStar" src="https://image.aftdc.com/appBimg/redStar.png"></image>
                            <text :style="{fontSize: GLOBAL.defaultFS,color:GLOBAL.dColor}">餐盒价格</text>
                        </div>
                        <div class="inputCss">
                            <input class="input" :style="GLOBAL.inputText" v-model="boxFee" :class="[errorCss?'errorCss':'']" ref="inputFour" @focus="allFocus(2)" @blur="allBlur()" type="number" placeholder="请填写餐盒价格"/>
                        </div>
                    </div>
                </div>
            </cell>
            <cell>
                <div class="listCell">

                    <div class="scroller_content">
                        <image class="redStar" src="https://image.aftdc.com/appBimg/redStar.png"></image>
                        <div style="flex: 1;">
                            <text :style="{fontSize: GLOBAL.defaultFS,color:GLOBAL.dColor}">商品特色</text>
                            <text :style="{fontSize: GLOBAL.smallerFS,color:GLOBAL.dColor,marginTop:'5px'}">每个门店最多可设置15个招牌商品</text>
                        </div>
                        <text class="signText" :class="[specialty==1?'signTextTwo':'']" :style="{fontSize: GLOBAL.smallFS}" @click="signatureClick">招牌</text>
                    </div>

                    <div class="scroller_content">
                        <div class="goodsNameCss">
                            <image class="redStar" src="https://image.aftdc.com/appBimg/redStar.png"></image>
                            <text :style="{fontSize: GLOBAL.defaultFS,color:GLOBAL.dColor}">商品单位</text>
                        </div>
                        <div class="inputCss">
                            <input class="input" :style="GLOBAL.inputText" type="text" v-model='goodsUnit' :class="[errorCss?'errorCss':'']" ref="inputFive" @focus="allFocus(3)" @blur="allBlur()" placeholder="例如份，个"/>
                        </div>
                    </div>

                    <div class="scroller_content">
                        <div class="goodsNameCss">
                            <image class="redStar" src="https://image.aftdc.com/appBimg/redStar.png"></image>
                            <text :style="{fontSize: GLOBAL.defaultFS,color:GLOBAL.dColor}">最少购买量</text>
                        </div>
                        <div class="inputCss">
                            <input class="input" :style="GLOBAL.inputText" type="number" v-model='buyMininum' :class="[errorCss?'errorCss':'']" ref="inputSix" @focus="allFocus(4)" @blur="allBlur()" placeholder="请填写数量"/>
                        </div>
                    </div>

                </div>

            </cell>
            <cell>

                <div class="listCell" style="margin-bottom: 0">
                    <div class="scroller_content content_bottom">

                        <div class="row">
                            <image class="redStar" src="https://image.aftdc.com/appBimg/redStar.png"></image>
                            <text :style="{fontSize: GLOBAL.defaultFS,color:GLOBAL.dColor}">商品描述</text>
                        </div>

                        <div class="textareaDiv">
                            <textarea class="textarea" rows="2" v-model="goodsDesc" maxlength="30" placeholder="介绍一下你的产品吧，30字以内就可以哦"  ref="inputSeven" @focus="allFocus()" @blur="allBlur()" :style="{fontSize: GLOBAL.bigFS,color:GLOBAL.dColor}"></textarea>
                        </div>

                    </div>
                </div>
            </cell>

        </list>
        <div class="waiterButton" v-if="inputFocus">
            <!--<div class="bottom_name">-->
            <!--<text class="defaultSize delSize" v-if="goodsId" @click="allDelClick()">删除</text>-->
            <!--<text class="defaultSize delSize" style="color: #333;" v-else @click="extend()">保存并继续新建</text>-->
            <!--</div>-->
            <!--<div class="bottom_name">-->
            <!--<text class="defaultSize updownSize" v-if="goodsId" @click="isSaleClick()">{{isSale==1?'下架':'上架'}}</text>-->
            <!--<text class="defaultSize updownSize" v-else @click="goodbye()">保存并返回</text>-->
            <!--</div>-->
            <wxc-button class="" ref="btnLeftEl" :text="btnLeftText"  :btnStyle="btnLeftStyle" :textStyle="textStyle"
                        @wxcButtonClicked="btnLeft" :class="[goodsId?'delectBtnActive':'btnActive']"></wxc-button>
            <wxc-button class="btnActive" :text="btnRightText" :btnStyle="btnRightStyle" :textStyle="textStyle"
                        @wxcButtonClicked="btnRight" ></wxc-button>
        </div>


        <wxc-dialog title="提示"
                    content="确定是否删除该商品？"
                    :show="show"
                    :single="false"
                    :show-no-prompt="false"
                    main-btn-color="#53beb7"
                    @wxcDialogCancelBtnClicked="wxcDialogCancelBtnClicked"
                    @wxcDialogConfirmBtnClicked="wxcDialogConfirmBtnClicked"
                    @wxcDialogNoPromptClicked="wxcDialogNoPromptClicked">
        </wxc-dialog>

        <toast ref="toast"></toast>

    </div>
</template>

<script>
    import { WxcButton } from 'weex-ui'
    import {WxcDialog, WxcMinibar} from 'weex-ui';
    import Toast from './Toast.vue';
    const modal = weex.requireModule('modal');
    const picker = weex.requireModule('picker');
    const animation = weex.requireModule('animation');
    const post = weex.requireModule('stream');
    const event = weex.requireModule('event');
    const navigator = weex.requireModule('navigator');
    export default {
        components: { WxcButton,WxcDialog,Toast,WxcMinibar},
        data() {
            return {


                btnLeftStyle:{//左边按钮样式
                    backgroundColor: '#53beb7',
                    width: '300',
                },
                btnRightStyle:{//右边按钮样式
                    backgroundColor: '#53beb7',
                    width: '300',
                },
                textStyle: {//按钮文本样式
                    color: '#fff',
                    fontSize: '28px'
                },
                btnLeftText: '保存并新建',//左边按钮文本
                btnRightText: '保存并返回',//右边按钮文本


                cats: [],//从接口获取的所有分类
                show: false,
                isSale: '',
                index: 0,//分类下标默认第一个为0
                classify:'请选择',//分类名称
                isOn: true,//为true时库存为无限
                startSwitch: true,//switch一开始的状态；为true时库存为无限
                errorCss: false,//判断保存时出错的样式
                goodsName: '',//商品名字
                boxFee: 0,//餐盒费
                price: '',//
                goodsUnit: '份',//商品单位
                goodsStock: -1,//库存
                goodsImg:'',
                goodsDesc:'',
                catId:'',
                shopPrice:'',
                goodsId:'',
                guigedel:'',
                end:0,
                dataz: {
                },
                spec: [], //暂时认为无规格时spec:[]
                taste: {},//暂时认为无规格时taste:''
                pageBack:false,
                localImg:'',
                brandLabel:'',
                labeId:'',
                oneClassIndex:0,
                twoClassIndex:0,
                threeClassIndex:0,
                specialty:0,// 招牌
                boxLength:'',//还能加入的招牌菜品个数
                buyMininum:1,

                touch:false,//用于获取焦点和失去焦点的兼容
                inputFocus:true,
                blurPrevent:false,//阻止多次失去焦点的定时器
                blurPreventSec:false,
                visibility:'hidden',
            }
        },
        created() {
            this.visibility='hidden';
            this.token = weex.config.token;
            this.imei = weex.config.imei;

            var that = this;
            var param = this.GLOBAL.sign(this.token,this.imei);
            var that = this;

            //获取商品分类，商品标签，招牌个数
            post.fetch({
                method: 'post',
                type: 'json',
                body: param,
                url: 'https://www.aftdc.com/businessapp/Enrol/goodsInfo',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
            },function(res){
                if (res.data.res == 1){
                    event.save('classify',JSON.stringify(res.data.classify));
                    that.boxLength=15-res.data.specialtyNum;
                }
            })

            if (weex.config.param) {
                var goodsId =JSON.parse(weex.config.param).goodsId;
            }else{
                var goodsId = ''
            }
            //判断按钮样式和文本的初始值
            if(goodsId !== ''){
                this.btnLeftText = '删除'
                this.btnLeftStyle.backgroundColor = '#FF4500'
                if(this.isSale==1){
                    this.btnRightText = '上架'
                }else {
                    this.btnRightText = '下架'
                }
            }

            if (goodsId){
                that.goodsId = goodsId;
                param += '&goodsId='+goodsId;
                post.fetch({
                    method: 'post',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/businessapp/Enrol/getGoodsInfo',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                },function(res){
                    event.save('thisGoodsInfo',JSON.stringify(res.data.data));
                    that.goodsName = res.data.data.goodsName;
                    that.classify= res.data.data.classify;
                    that.goodsImg= res.data.data.goodsImg;
                    that.spec= JSON.parse(res.data.data.guige);
                    that.taste= JSON.parse(res.data.data.guigeAttr);
                    that.boxFee= res.data.data.boxFee;
                    that.goodsUnit= res.data.data.goodsUnit;
                    that.goodsDesc= res.data.data.goodsDesc;
                    that.goodsLeast=res.data.data.goodsLeast;
                    that.isSale= res.data.data.isSale;
                    that.goodsStock= res.data.data.goodsStock;
                    that.catId= res.data.data.catId;
                    that.price= res.data.data.shopPrice;
                    that.cats= res.data.data.cats;
                    that.goodsId = res.data.data.goodsId;
                    that.brandLabel= res.data.data.brandLabel;
                    that.labeId = res.data.data.labeId;
                    that.specialty = res.data.data.specialty;
                    that.boxLength=15-res.data.data.specialtyNum;
                    that.buyMininum = res.data.data.buyMininum;

                    if(res.data.data.goodsStock == -1){
                        that.startSwitch = true;//switch一开始的状态；为true时库存为无限
                        that.isOn = true
                    } else {
                        that.startSwitch = false;//switch一开始的状态；为true时库存为无限
                        that.isOn = false
                    }
                })
            }else {
                event.save('thisGoodsInfo','{}');

                post.fetch({
                    method: 'post',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/businessapp/Enrol/getcats',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                },function(res){
                    if (res.data.res == 1)
                        that.cats= res.data.cats;
                })
            }

        },
        mounted(){
            var that=this
            that.visibility='visible';
        },
        methods: {
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
            allFocus(toggle){
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
                    that.$refs.inputTwo.setTextFormatter({
                        formatRule: "/(\\.\\d{2})(\\S+)/",
                        formatReplace: "$1",
                        recoverRule: "/\\s+/g",
                        recoverReplace: ""
                    })
                }else if(toggle==1){
                    that.$refs.inputThree.setTextFormatter({
                        formatRule: "/(\\.\\d{2})(\\S+)/",
                        formatReplace: "$1",
                        recoverRule: "/\\./g",
                        recoverReplace: ""
                    })
                }else if(toggle==2){
                    that.$refs.inputFour.setTextFormatter({
                        formatRule: "/(\\.\\d{1})(\\S+)/",
                        formatReplace: "$1",
                        recoverRule: "/\\s+/g",
                        recoverReplace: ""
                    })
                }else if(toggle==3){
                    that.$refs.inputFive.setTextFormatter({
                        formatRule: "/(\\.\\d{2})(\\S+)/",
                        formatReplace: "$1",
                        recoverRule: "/\\W/g",//recoverRule: "/[^\u4e00-\u9fa5]/g",匹配非中文
                        recoverReplace: ""
                    })
                }else if(toggle==4){
                    that.$refs.inputSix.setTextFormatter({
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

                that.$refs.inputOne.blur()
                if(that.spec==''){
                    that.$refs.inputTwo.blur()
                }
                if(that.spec==''&&!that.isOn){
                    that.$refs.inputThree.blur()
                }
                that.$refs.inputFour.blur()
                that.$refs.inputFive.blur()
                that.$refs.inputSix.blur()
                that.$refs.inputSeven.blur()

            },

            btnLeft(){
                if(this.goodsId !== '' ){
                    this.allDelClick()
                }else{
                    this.extends()
                }
            },
            btnRight(){
                if(this.goodsId !== '' ){
                    this.isSaleClick()
                }else{
                    this.saveGoods()
                }
            },

            pick() {
                var cats = this.cats;
                var catName = [];
                var catId = [];
                for (var i = 0;i<cats.length;i++){
                    catName.push(cats[i]['catName'])
                    catId.push(cats[i]['catId'])
                }
                picker.pick({
                    index: this.index,
                    items: catName,
                    confirmTitle:'确认',
                    cancelTitle:'取消',
                }, event => {
                    if (event.result === 'success') {
                        this.classify = catName[event.data];
                        this.catId = catId[event.data];
                        this.index = event.data
                    }
                })
            },
            specDelClick(index) {
                var that = this;
                console.log(that.spec[index]);
                that.guigedel += that.spec[index]['id']+',';
                console.log(that.guigedel);
                that.spec.splice(index, 1)
            },
            propertyDelClick() {
                var that = this
                that.taste = ''
            },
            allDelClick() {
                this.show = true;
            },
            wxcDialogCancelBtnClicked() {//点击取消后的事件
                //此处必须设置，组件为无状态组件，自己管理
                this.show = false;
            },
            wxcDialogConfirmBtnClicked() {//点击确认后的事件
                //此处必须设置，组件为无状态组件，自己管理
                this.show = false;
                var that = this;
                var param = this.GLOBAL.sign(this.token,this.imei);
                var goodsId = that.goodsId;
                param += '&goodsId='+goodsId+'&&'+'isSale=2';
                post.fetch({
                    method: 'post',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/businessapp/Enrol/saveSale',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                },function(res){
                    if (res.data.res == 1){
                        event.save('changeGoodsManage',1);//标记商品管理改变
                        const toast=that.$refs.toast
                        toast.editContent('删除成功');
                        setTimeout(()=>navigator.pop({ animated: 'true' }),1000);
                    }
                })
            },
            wxcDialogNoPromptClicked(e) {
                //此处必须设置，组件为无状态组件，自己管理
                this.isChecked = e.isChecked;
            },
            isSaleClick() {
                var that = this
                var param = this.GLOBAL.sign(this.token,this.imei);
                if (that.isSale == 1) {
                    var isSale = 0
                    var word = '下架成功'
                    this.btnRightText = '上架'
                }else {
                    var isSale = 1
                    var word = '上架成功'
                    this.btnRightText = '下架'
                }

                var goodsId = that.goodsId;
                param += '&goodsId='+goodsId+'&&'+'isSale='+isSale;
                post.fetch({
                    method: 'post',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/businessapp/Enrol/saveSale',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                },function(res){
                    if(res.data.res == 1){
                        that.isSale=isSale
                        const toast=that.$refs.toast
                        toast.editContent(word);
                    }
                })
            },
            //保存并继续
            extends(){
                this.end = 1;
                this.allSaveClick();
            },
            //保存
            saveGoods(){
                this.end = 2;
                this.allSaveClick();
            },
            //修改
            allSaveClick() {
                var that = this
                this.blur()
                var param = this.GLOBAL.sign(this.token,this.imei);
                if (!that.goodsName || that.boxFee==='' || !that.goodsUnit|| !that.buyMininum) {
                    that.errorCss=true;
                    const toast=that.$refs.toast
                    toast.editContent('请上传图片并将数据填写完整');
                    return false
                }

                if (that.classify=='请选择') {
                    that.errorCss=true;
                    const toast=that.$refs.toast
                    toast.editContent('未选择商品分类');
                    return false
                }
                if (!that.brandLabel) {
                    that.errorCss=true;
                    const toast=that.$refs.toast
                    toast.editContent('未选择商品标签');
                    return false
                }
                if (!that.price && that.spec.length == 0) {
                    that.errorCss=true;
                    const toast=that.$refs.toast
                    toast.editContent('请上传图片并将数据填写完整');
                    return false
                }
                if (!that.goodsStock && that.spec.length == 0 && that.isOn == false) {
                    that.errorCss=true;
                    const toast=that.$refs.toast
                    toast.editContent('请上传图片并将数据填写完整');
                    return false
                }
                var taste = that.taste;
                if(taste == '' || taste == undefined){
                    taste = [];
                }
                var goodsArr = {
                    catId: that.catId,
                    goodsName: that.goodsName,
                    spec: that.spec,
                    attrs: taste,
                    goodsDesc: that.goodsDesc,
                    goodsLeast:that.goodsLeast,
                }
                goodsArr = JSON.stringify(goodsArr);
                var price = that.price;
                var distribution = that.boxFee;
                var goodsStock = that.goodsStock;
                var Stock = that.goodsStock;
                var goodsUnit = that.goodsUnit;
                var goodsId = that.goodsId;
                var guigedel = that.guigedel;
                var brandLabel = that.brandLabel;
                var labeId = that.labeId;
                var specialty = that.specialty;
                var buyMininum = that.buyMininum;
                if (this.imgurl){var imgurl = this.imgurl;this.uploadImg();} else {var imgurl = that.goodsImg;} //如果有编辑图片，就上传

                param += '&goodsArr='+goodsArr+'&'+'price='+price+'&'+'distribution='+distribution+'&'+'goodsStock='+goodsStock+'&'+'Stock='+Stock+'&'+'goodsImg='+imgurl
                    +'&'+'goodsUnit='+goodsUnit+'&'+'goodsId='+goodsId+'&'+'guigedel='+guigedel
                    +'&'+'brandLabel='+brandLabel+'&'+'labeId='+labeId+'&'+'specialty='+specialty+'&'+'buyMininum='+buyMininum
                console.log(param);
                post.fetch({
                    method: 'post',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/businessapp/Enrol/saveGoods',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                },function(res){
                    if(res.data.res == 1){
                        event.save('changeGoodsManage',1);//标记商品管理改变
                        if (that.end == 1){
                            // that.replace();
                        } else {
                            event.delete('thisGoodsInfo');
                            setTimeout(()=>navigator.pop({ animated: 'true' }),2000);
                        }
                        that.errorCss=true;
                        const toast=that.$refs.toast
                        toast.editContent('保存成功');
                    }else {
                        that.errorCss=true;
                        const toast=that.$refs.toast
                        toast.editContent('保存失败,'+res.data.info);
                    }
                });
            },
            //上传图片
            uploadImg(){
                var that = this;
                var param = this.GLOBAL.sign(this.token,this.imei);
                post.fetch({
                    method: 'post',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/businessapp/Goods/uploadOss',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                },function(res){
                    var waterMarkStr = event.find('shopName');
                    event.uploadImg(res.data.AccessKeyId,res.data.AccessKeySecret,res.data.SecurityToken,that.imgurl,that.localImg,waterMarkStr);
                })
            },
            //重置
            // replace(){
            //     this.show= false
            //     this.isSale= ''
            //     this.index= 0
            //     this.classify='请选择'
            //     this.isOn= ''
            //     this.startSwitch= ''
            //     this.errorCss= false
            //     this.goodsName= ''
            //     this.boxFee= ''
            //     this.price= ''
            //     this.goodsUnit= ''
            //     this.goodsStock= ''
            //     this.goodsImg=''
            //     this.goodsDesc=''
            //     this.catId=''
            //     this.shopPrice=''
            //     this.goodsId=''
            //     this.guigedel=''
            //     this.end=0
            //     this.dataz= {}
            //     this.spec= []
            //     this.taste= {}
            //     this.pageBack=false
            //     this.localImg=''
            //     this.imgurl = ''
            // },
            bill: function () {
                var that = this
                if (that.isOn == false) {

                    var testEl = this.$refs.test1;
                    var testE2 = this.$refs.test2;
                    if (that.startSwitch == true) {
                        var transform = 'translate(0px, 0px)';
                    } else {
                        var transform = 'translate(52px, 0px)';
                    }
                    animation.transition(testEl, {
                        styles: {
                            transform: transform,
                        },
                        duration: 500, //ms
                        timingFunction: 'ease',
                        delay: 0 //ms
                    })
                    animation.transition(testE2, {
                        styles: {
                            backgroundColor: '#4ed465',
                        },
                        duration: 500, //ms
                        timingFunction: 'ease',
                        delay: 0 //ms
                    })
                    that.isOn = !that.isOn
                    that.goodsStock=-1;
                } else {

                    var testEl = this.$refs.test1;
                    var testE2 = this.$refs.test2;
                    if (that.startSwitch == true) {
                        var transform = 'translate(-52px, 0px)';
                    } else {
                        var transform = 'translate(0px, 0px)';
                    }
                    animation.transition(testEl, {
                        styles: {
                            transform: transform,
                        },
                        duration: 500, //ms
                        timingFunction: 'ease',
                        delay: 0 //ms
                    })
                    animation.transition(testE2, {
                        styles: {
                            backgroundColor: '#e2e2e2',
                        },
                        duration: 500, //ms
                        timingFunction: 'ease',
                        delay: 0 //ms
                    })
                    that.isOn = !that.isOn
                    if(that.goodsStock<0){
                        that.goodsStock='';
                    }

                }

            },
            backClick(){
                navigator.pop({ animated: 'true' });
            },
            editGuiGe(){
                var param = {
                    goodsId:this.goodsId
                };
                var obj = { "url": 'http://assets/editSpec.js', "param":param};
                event.toUrl(obj)
            },
            editAttrs(){
                var param = {
                    goodsId:this.goodsId
                };
                var obj = { "url": 'http://assets/editProperty.js', "param":param};
                event.toUrl(obj)
            },
            toSelectClass(){
                var that=this
                var param={boxIndex:'2',oneClassIndex:that.oneClassIndex,twoClassIndex:that.twoClassIndex,threeClassIndex:that.threeClassIndex}
                param=JSON.stringify(param)

                var url='http://assets/selectClass.js'
                event.toUrl({"url":url,"param":param})
            },
            signatureClick(){
                var that=this
                var specialtyCount=0

                if(that.specialty==0){

                    if(Number(that.boxLength)==0){
                        const toast = that.$refs.toast;
                        toast.editContent('商店招牌菜品已达上限');
                        return false
                    }
                    that.specialty=1
                }else{
                    that.specialty=0
                }

            },
            changeImg(){
                event.chooseImg(1,1);
            },
            //监听页面返回
            viewdisappear(){
                let self=this;
                self.pageBack = true;
            },
            viewappear(){
                var that=this
                if (!this.pageBack) { return; }
                this.pageBack = false;
                if (event.find("localImg")) {
                    var houzui = event.find("localImg").split("."); //后缀
                    this.localImg = event.find("localImg");
                    this.imgurl = 'shops/'+event.find('shopId')+'/goodsImg/'+Date.parse(new Date())+'.'+ houzui[1];
                    event.delete("localImg");
                }
                //更新规格和属性
                if (event.find('thisGoodsInfo')&&event.find('thisGoodsInfo')!='{}') {
                    var thisGoodsInfo = event.find('thisGoodsInfo');

                    if (JSON.parse(thisGoodsInfo).guige) {
                        var spec= JSON.parse(JSON.parse(thisGoodsInfo).guige);
                        this.spec = spec
                    }

                    if (JSON.parse(thisGoodsInfo).guigeAttr) {
                        var taste= JSON.parse(JSON.parse(thisGoodsInfo).guigeAttr);
                        this.taste = taste
                    }
                }
                if(event.find("goodsLabel")){
                    console.log('log----'+event.find("goodsLabel"))
                    var goodsLabel=JSON.parse(event.find("goodsLabel"))
                    // var boxIndex=goodsLabel.boxIndex
                    that.brandLabel=goodsLabel.brandLabel
                    that.labeId=goodsLabel.id
                    that.oneClassIndex=goodsLabel.oneClassIndex
                    that.twoClassIndex=goodsLabel.twoClassIndex
                    that.threeClassIndex=goodsLabel.threeClassIndex
                    event.delete("goodsLabel");
                }
            }
        }
    }
</script>

<style scoped>
    .btnActive:active {
        background-color: #57aba5;
    }
    .btnActive:enabled {
        background-color: #53beb7;
    }
    .delectBtnActive:active {
        background-color: #e64500;
    }
    .delectBtnActive:enabled {
        background-color: #ff0000;
    }


    .wrapper {
        flex-direction: column;
        background-color: #f8f8f8;
    }

    /*****************/

    /***********************/
    .listCell {
        background-color: #fff;
        margin-bottom: 20px;
        flex-direction: column;
        /*justify-content: flex-start;*/
    }

    .scroller {
        flex-direction: column;
        /*position: absolute;*/
        /*top: 90px;*/
        /*left: 0;*/
        /*right: 0;*/
        /*bottom: 0px;*/
        flex: 1;
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

    .signText{
        padding-top: 15px;
        padding-bottom: 15px;
        padding-left: 35px;
        padding-right: 35px;
        background-color: #f8f8f8;
        color: #999;
        border-radius: 10px;
        border-style: solid;
        border-width: 2px;
        border-color: #dedede;
    }
    .signTextTwo{
        background-color: #53beb7;
        border-color: #fff;
        color: #fff;

    }
    .content_bottom {
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
    }

    .input {
        text-align: right;
        color: #333;
        /*fontSize:'24px';*/
        /*borderWidth:'1px';*/
        /*borderColor:'#53beb7';*/
        /*borderRadius:'8px';*/
        padding-top: 20px;
        padding-bottom: 20px;
        padding-left: 20px;
        padding-right: 20px;

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

    .classifyCheck {
        flex: 1.5;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
    }

    .classify {

        text-align: right;
        margin-right: 10px;
    }

    .arrowImg {
        width: 20px;
        height: 15px;
        color: #666;
    }

    .updataImg {
        flex-direction: column;
        margin-left: 20px;
    }

    .addImg {
        width: 100px;
        height: 100px;
    }

    .desc {
        font-size: 24px;
        color: #999;
        margin-top: 10px;
    }

    .goodsStockCss {
        flex-direction: column;
        margin-left: 20px;
    }

    .specImg {
        width: 40px;
        height: 40px;
    }

    .spec {
        flex-direction: row;
        align-items: center;
    }

    .property {
        flex-direction: column;
        margin-left: 20px;
    }

    .propertyImg {
        width: 40px;
        height: 40px;
        margin-right: 10px;
    }
    .textareaDiv{
        flex-direction: row;
        flex: 1;
        /*justify-content: flex-start;*/
    }
    .textarea {
        width: 700px;
        margin-top: 20px;
        /*height: 350px;*/
        padding-top: 20px;
        padding-left: 20px;
        padding-right: 20px;
        padding-bottom: 20px;
        placeholder-color: #999;
        flex: 1;
        border-style: solid;
        border-width: 2px;
        border-color: #53beb7;
        border-radius: 10px;
    }

    .describe {
        margin-left: 20px;
    }


    .bottom_name {
        flex: 1;
    }

    .delSize {
        text-align: center;
        border-width: 2px;
        border-style: solid;
        border-color: #e1e1e1;
        font-size: 40px;
        color: red;
        /*border-radius: 10px;*/
        padding-top: 20px;
        padding-left: 20px;
        padding-bottom: 20px;
        padding-right: 20px;
        background-color: #fff;
        border-collapse: collapse;
    }

    .delSize:active {
        background-color: #f1f1f1;
    }

    .updownSize {
        text-align: center;
        border-width: 2px;
        border-style: solid;
        border-color: #e1e1e1;
        font-size: 40px;
        color: #fff;
        /*border-radius: 10px;*/
        padding-top: 20px;
        padding-left: 20px;
        padding-bottom: 20px;
        padding-right: 20px;
        background-color: #53beb7;
        border-collapse: collapse;

    }

    .updownSize:active {
        background-color: #f1f1f1;
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


    .specTitle {

        flex: 1.2;
        justify-content: center;

    }

    .specSize {
        border-left-width: 3px;
        border-left-style: solid;
        border-left-color: #53beb7;
        padding-left: 10px;
        color: #666;

        margin-left: 25px;
        height: 35px;
        line-height: 35px;
    }


    .specName {
        margin-left: 60px;
        margin-bottom: 20px;

    }


    .specFor {
        flex-direction: row;
        align-items: center;
        justify-content: space-around;
        padding-top: 20px;
        padding-left: 20px;
        padding-right: 20px;
        padding-bottom: 30px;
        background-color: #fff;

    }

    .specPriceNum {
        flex-direction: row;
        align-items: center;
        justify-content: space-around;

        padding-left: 60px;
        padding-right: 20px;
        padding-bottom: 30px;
        background-color: #fff;

    }

    .allSpecDiv {
        flex-direction: column;
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: #f8f8f8;
    }

    .tasteName {
        flex-direction: row;
        justify-content: flex-start;
        align-items: flex-start;
    }
    .errorCss{
        placeholder-color: #ff9490;
        font-weight: 200;

    }
    .waiterButton{
        flex-direction: row;
        justify-content: space-around;
        padding-top: 20px;
        padding-bottom: 20px;
        padding-left: 30px;
        padding-right: 30px;

    }
    .flexOne {
        flex: 1;
    }
    .labelIcon{
        width: 25px;
        height: 25px;
        margin-left: 20px;
    }
    .labelText{
        padding-top: 15px;
        padding-bottom: 15px;
        margin-left: 15px;
        color: #eaa65f;
    }
    .labelDiv{
        background-color: #fff0e0;
    }
    .labelInput{
        flex: 1;
        padding-bottom: 20px;
        margin-left: 20px;
    }
    .row{
        flex-direction: row;
        align-items: center;
    }
</style>
