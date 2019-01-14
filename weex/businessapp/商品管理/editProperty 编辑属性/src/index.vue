<template>
    <div class="wrapper">
        <wxc-minibar
                background-color="#53beb7"
                text-color="#fff"
                @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                @wxcMinibarRightButtonClicked="allSaveClick"
                v-once>
            <image :style="GLOBAL.headerImg"  slot="left"
                   src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
            <text :style="GLOBAL.headerCenter" slot="middle">编辑属性</text>
            <text :style="GLOBAL.headerRight" slot="right">保存</text>
        </wxc-minibar>

        <list class="scroller">
            <cell v-for="(item,index) in attrs">
                <div class="listCell">
                    <div class="content_title">
                        <div class="goodsNameCss">
                            <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">属性{{index+1}}</text>
                        </div>
                        <div class="classifyCheck">
                            <text style="color:#f00;font-size: 28px" @click="propertyDelClick(index)">删除</text>
                        </div>
                    </div>
                    <div class="scroller_content">
                        <div class="goodsNameCss">
                            <image class="redStar" src="https://image.aftdc.com/appBimg/redStar.png"></image>
                            <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">属性名称</text>
                        </div>
                        <div class="inputCss">
                            <input class="inputText" type="text" ref="inputA" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}" max-length="10" placeholder="例如:热度、辣度" v-model="attrs[index].attrName" @focus="focus(1,index)" @blur="blur(1,index)" @change="change">
                            <!--<text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}" style="text-align: right" :class="[item.attrName!=''?'propertyNameColor':errorCss?'errorCss':'']" @click="showMaskClick(index)">{{item.attrName!=''?item.attrName:'请选择属性名称'}}</text>-->
                        </div>
                    </div>
                    <div class="scroller_content">
                        <div class="goodsNameCss">
                            <image class="redStar" src="https://image.aftdc.com/appBimg/redStar.png"></image>
                            <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">属性标签</text>
                        </div>
                        <div class="inputCss tagCss aiCenter">
                            <input class="inputText" type="text" ref="inputB" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}" max-length="10" placeholder="例如:变态辣、微辣、麻辣" v-model="attrs[index].labelName" @focus="focus(2,index)" @blur="blur(2,index)">
                            <div class="addLabelBox" @click="addLabelText(index)">
                                <div class="addLabel" :class="[attrs[index].labelName.length>0?'addBorder':'']">
                                    <div class="addLabelA" :class="[attrs[index].labelName.length>0?'addBg':'']"></div>
                                    <div class="addLabelB" :class="[attrs[index].labelName.length>0?'addBg':'']"></div>
                                </div>
                            </div>
                            <!--<text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}" @click="showTagMaskClick(index)" v-if="item.attrContent.length==0" :class="[errorCss?'errorCss':'']">请选择属性标签</text>-->
                            <!--<div v-if="item.attrContent.length>0" style="flex-direction: row;justify-content: flex-end" >-->
                            <!--<text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}" @click="showTagMaskClick(index)" v-for="(i,j) in item.attrContent">{{j!=0?','+i:i}}</text>-->
                            <!--</div>-->
                        </div>
                    </div>
                    <div class="attributeButton row aiCenter" :class="[attrs[index].attrContent.length===0?'h112':'']">
                        <div class="label row aiCenter jcCenter" v-for="(value,i) in attrs[index].attrContent" @click="delLabel(i,index)">
                            <text class="labelText">{{value}}</text>
                            <div class="labelClose">
                                <div class="labelCloseA"></div>
                                <div class="labelCloseB"></div>
                            </div>
                        </div>
                    </div>
                </div>

            </cell>
        </list>


        <div class="spec_bottom" v-if="input===0">
            <wxc-button class="button" text="+ 添加属性" :disabled="attrs.length>=2?true:false" :text-style="GLOBAL.buttonText" :btn-style="GLOBAL.defaultButton"
                        @wxcButtonClicked="wxcButtonClicked"></wxc-button>
        </div>
        <div class="selectLabel row" v-if="input===1">
            <div class="buttomLabel row aiCenter jcCenter" v-for="(item,index) in provideLabel" @click="addAttributeName(index)" :class="[attrs[inputIndex].attrName===item?'activeLabel':'']">
                <text class="buttomLabelText"  :class="[attrs[inputIndex].attrName===item?'activeLabelText':'']">{{item}}</text>
            </div>
        </div>
        <div class="selectLabel row" v-if="input===2 && attrs[inputIndex].attributeIndex!==''">
            <div class="buttomLabel row aiCenter jcCenter" v-for="(item,index) in selectLabel[attrs[inputIndex].attributeIndex].labelName" @click="addLabelName(index)" >
                <text class="buttomLabelText" >{{item}}</text>
            </div>
        </div>

        <toast ref="toast"></toast>
    </div>

</template>

<script>

    import {WxcMinibar,WxcMask, WxcButton, WxcCheckbox, WxcCheckboxList} from 'weex-ui'
    import Toast from './Toast.vue'
    const modal = weex.requireModule('modal');
    const event = weex.requireModule('event');
    var navigator = weex.requireModule('navigator');
    const animation = weex.requireModule('animation');
    var timer = null;
    export default {
        components: {WxcMinibar,WxcButton, Toast, WxcMask, WxcCheckbox, WxcCheckboxList},

        data() {
            return {

                attrs: [//属性填写保存的值
                    {
                        attributeIndex: '',//属性名对应selectLabel的索引,可以不需要缓存
                        attrName: '',//属性名input框文本
                        labelName: '',//标签名input框文本,可以不需要缓存
                        attrContent: [],//标签组
                    }
                ],
                input: 0,//input框是否获取到焦点
                inputIndex: 0,//某个属性input框
                provideLabel: ['温度','冷热','辣度','口味','甜度','糖度','加料'],
                selectLabel: [
                    {
                        attrName: '温度',
                        labelName: ['热','温热','常温','去冰','少冰','冰','多冰']
                    },
                    {
                        attrName: '冷热',
                        labelName: ['热','温热','常温','去冰','少冰','冰','多冰']
                    },
                    {
                        attrName: '辣度',
                        labelName: ['特辣','麻辣','中辣','微辣','微微辣','不辣']
                    },
                    {
                        attrName: '口味',
                        labelName: ['特辣','麻辣','中辣','微辣','微微辣','不辣']
                    },
                    {
                        attrName: '甜度',
                        labelName: ['无糖','少糖','半糖','多糖','全糖']
                    },
                    {
                        attrName: '糖度',
                        labelName: ['无糖','少糖','半糖','多糖','全糖']
                    },
                    {
                        attrName: '加料',
                        labelName: ['珍珠','椰果','波霸','红豆','无']
                    }
                ],




                //backImgToggle: 0,//头部返回图片判断
                // isOn: true,//为true时库存为无限
                // startSwitch: true,//switch一开始的状态；为true时库存为无限
                // goodsStock: '',//库存
                // price: '',//
                // hasAnimation: false,
                // overlaycanclose: true,
                // top: 200,

                //errorCss: false,//判断保存时出错的样式
                //attrs: [{attrName: '', attrContent: []}],//进来默认一个属性

                //show: false,
                //TagShow: false,
                // config: {
                //     unCheckedIcon: 'https://image.aftdc.com/appBimg/ic_check_box_normal.png',
                //     checkedIcon: 'https://image.aftdc.com/appBimg/ic_check_box_checked.png',
                //     checkedColor: '#53beb7'
                // },
                // propertyName: ['味道', '温度'],//默认属性选择

                //propertyNameIndex: '',//属性名称选择框默认index
                //propertyTag: [[{name: '特辣'}, {name: '麻辣'}, {name: '中辣'}, {name: '微辣'}, {name: '不辣'}], [{name: '热'}, {name: '温'}, {name: '冷'}, {name: '冰'}]],
                //attrsTag: [],//标签选择框未点确定之前的数据
                //showMaskIndex: '',//点击属性名称保存的attrs的index

            }
        },
        created() {
            var thisGoodsInfo = event.find('thisGoodsInfo');
            if (JSON.parse(thisGoodsInfo).guigeAttr) {
                this.attrs = JSON.parse(JSON.parse(thisGoodsInfo).guigeAttr);
            }
        },
        methods: {
            //input框获取焦点
            focus(num,index){
                this.input = num
                this.inputIndex = index
            },
            //input框失去焦点
            blur(num,index){
                var i = this.input
                var that = this
                setTimeout(function(){//防止点另一个input框(添加属性)按钮由于失去焦点闪一下
                    if(that.input == i && that.inputIndex == index){
                        that.input = 0
                    }
                },10)
            },
            //监听input框值的更改
            change(){
                for(var i=0,len=this.provideLabel.length;i<len;i++ ){
                    if(this.provideLabel[i] === this.attrs[this.inputIndex].attrName){
                        this.attrs[this.inputIndex].attributeIndex = i
                        break
                    }else{
                        this.attrs[this.inputIndex].attributeIndex = ''
                    }
                }
            },
            //从input框添加标签
            addLabelText(index){
                if(this.attrs[index].labelName.length > 0 ){
                    if(this.attrs[index].attrContent.length < 10){
                        this.$refs.inputB[index].blur()
                        this.attrs[index].attrContent.push(this.attrs[index].labelName)
                        this.attrs[index].labelName = ''
                    }else{
                        const toast = this.$refs.toast
                        toast.editContent('属性标签最多10个');
                    }
                }

            },
            //删除属性标签
            delLabel(i,index){
                this.attrs[index].attrContent.splice(i,1)
            },
            //从底部选择添加属性名称
            addAttributeName(index){
                this.attrs[this.inputIndex].attrName = this.provideLabel[index]
            },
            //从底部选择添加属性标签
            addLabelName(index){
                if(this.attrs[this.inputIndex].attrContent.length < 10){
                    this.attrs[this.inputIndex].attrContent.push(this.selectLabel[this.attrs[this.inputIndex].attributeIndex].labelName[index])
                }else {
                    const toast = this.$refs.toast
                    toast.editContent('属性标签最多10个');
                }
            },
            // 添加属性
            wxcButtonClicked() {
                //var that = this;
                // if(that.attrs.length<that.propertyName.length){
                //     var newAttrs = {attrName: '', attrContent: []};
                //     that.attrs.push(newAttrs);
                if(this.attrs.length<2){
                    this.attrs.push({
                        attributeIndex: '',
                        attrName: '',
                        labelName: '',
                        attrContent: [],
                    })
                }
                // }
            },
            //删除属性
            propertyDelClick(index) {
                var that = this
                if(this.input === 0){
                    if(this.attrs.length>1){
                        this.$refs.inputA[0].focus()
                    }
                    this.attrs.splice(index,1)
                }
            },
            //返回
            minibarLeftButtonClick(){

            },
            //保存
            allSaveClick() {
                var attrs = this.attrs
                // for (var i = 0; i < attrs.length; i++) {
                //     if (!attrs[i].attrName || attrs[i].attrContent.length<0) {
                //         this.errorCss = true;
                //         const toast = this.$refs.toast
                //         toast.editContent('还有选项未选择，请点击选择...');
                //         return false
                //     }
                // }
                for(var i=0,len=this.attrs.length;i<len;i++){
                    if(this.attrs[i].attrName==''|| this.attrs[i].attrContent.length<1){
                        const toast = this.$refs.toast
                        toast.editContent('还有选项未填写，请点击填写...');
                        break
                    }else{
                        var thisGoodsInfo = event.find('thisGoodsInfo');
                        thisGoodsInfo = JSON.parse(thisGoodsInfo);
                        thisGoodsInfo.guigeAttr = JSON.stringify(attrs);
                        event.save('thisGoodsInfo', JSON.stringify(thisGoodsInfo));
                        navigator.pop({
                            animated: 'true'
                        });
                        //注意：保存时如果spec的长度为小于2时spec为空保存
                    }
                }

            },
            // backClick() {
            //     navigator.pop({ animated: 'true' });
            // },

            // propertyNameClick(index) {
            //     var that = this
            //     that.propertyNameIndex = index
            // },
            // showMaskClick(index) {
            //     var that = this;
            //     that.show = true
            //     that.showMaskIndex = index
            //     that.errorCss = false;
            //     for (var i = 0; i < that.propertyName.length; i++) {
            //         if (that.attrs[index].attrName == that.propertyName[i]) {
            //             that.propertyNameIndex = i;
            //         }
            //     }
            // },
            // maskCancelClick() {
            //     var that = this;
            //     that.show = false
            //     that.TagShow = false
            //     that.propertyNameIndex = ''
            //     that.showMaskIndex = ''
            // },
            // maskSureClick() {
            //     var that = this
            //     if (that.propertyNameIndex === '') {
            //         const toast = this.$refs.toast
            //         toast.editContent('还未选择选项');
            //     } else {
            //       if(that.attrs[that.showMaskIndex].attrName != that.propertyName[that.propertyNameIndex]) {
            //           var count=0
            //           for(var i=0;i<that.attrs.length;i++){
            //               if(that.propertyName[that.propertyNameIndex]== that.attrs[i].attrName){
            //                   count=1;
            //                   break
            //               }
            //           }
            //           if(count==1){
            //               const toast = this.$refs.toast
            //               toast.editContent('已有相同的属性名称，请选择其他属性名称');
            //           }else{
            //               that.attrs[that.showMaskIndex].attrName = that.propertyName[that.propertyNameIndex];
            //               that.attrs[that.showMaskIndex].attrContent = [];
            //           }
            //         }
            //         that.propertyNameIndex = '';
            //         that.showMaskIndex = ''
            //     }
            //     that.show = false
            // },
            // wxcMaskSetHidden() {
            //     var that = this
            //     that.show = false
            //     that.TagShow = false
            //     that.propertyNameIndex = ''
            //     that.showMaskIndex = ''
            //     that.attrsTag = []
            // },
            // showTagMaskClick(index) {
            //     var that = this;
            //     that.TagShow = true
            //     that.showMaskIndex = index
            //     that.errorCss = false;
            //     for (var i = 0; i < that.propertyName.length; i++) {
            //         if (that.attrs[index].attrName == that.propertyName[i]) {
            //             that.propertyNameIndex = i;
            //         }
            //     }
            //
            //     for (var i = 0; i < that.propertyTag[that.propertyNameIndex].length; i++) {
            //         if(that.attrs[that.showMaskIndex].attrContent.length<1){
            //             that.propertyTag[that.propertyNameIndex][i].checked = 0;
            //         }else{
            //             for (var j = 0; j < that.attrs[that.showMaskIndex].attrContent.length; j++) {
            //                 if (that.propertyTag[that.propertyNameIndex][i].name == that.attrs[that.showMaskIndex].attrContent[j]) {
            //                     that.propertyTag[that.propertyNameIndex][i].checked = 1;
            //                     break
            //                 } else {
            //                     that.propertyTag[that.propertyNameIndex][i].checked = 0;
            //                 }
            //             }
            //         }
            //     }
            // },
            // maskTagSureClick() {
            //     var that = this
            //     that.TagShow = false
            //     var propertyTag = that.propertyTag[that.propertyNameIndex]
            //     that.attrs[that.showMaskIndex].attrContent=[]
            //     for (var i = 0; i < propertyTag.length; i++) {
            //         if (propertyTag[i].checked == 1) {
            //             that.attrs[that.showMaskIndex].attrContent.push(propertyTag[i].name)
            //         }else{
            //
            //         }
            //     }
            //
            // },
            // wxcCheckBoxItemChecked(item, index) {
            //     var that = this
            //
            //     if (item.checked == 1) {
            //         item.checked = 0
            //
            //     } else {
            //         item.checked = 1
            //     }
            // }
        }
    }
</script>

<style scoped>
    .row {
        flex-direction: row;
    }
    .aiCenter {
        align-items: center;
    }
    .jcCenter {
        justify-content: center;
    }
    .h112 {
        height: 112px;
    }
    .attributeButton {
        flex-wrap: wrap;
        justify-content: flex-end;
        padding-left: 30px;
        padding-right: 30px;
        padding-top: 20px;
        padding-bottom: 30px;
    }
    .label {
        background-color: #53beb7;
        border-radius: 8px;
        padding-left: 12px;
        padding-right: 12px;
        padding-top: 14px;
        padding-bottom: 14px;
        margin-left: 10px;
        margin-top: 10px;
    }
    .labelText {
        font-size: 24px;
        line-height: 24px;
        color: #fff;
    }
    .labelClose {
        width: 10px;
        height: 10px;
        margin-left: 8px;
    }
    .labelCloseA {
        width: 2px;
        height: 14px;
        background-color: #fff;
        position: absolute;
        top: -2px;
        left: 4px;
        transform: rotate(45deg);
    }
    .labelCloseB {
        width: 14px;
        height: 2px;
        background-color: #fff;
        position: absolute;
        top: 4px;
        left: -2px;
        transform: rotate(45deg);
    }
    .inputText {
        width: 400px;
        height: 50px;
        text-align: right;
    }
    .selectLabel {
        background-color: #fff;
        width: 750px;
        padding-top: 13px;
        padding-bottom: 13px;
        padding-left: 14px;
        padding-right: 14px;
        position: fixed;
        bottom: 0;
    }
    .buttomLabel {
        padding-top: 15px;
        padding-bottom: 15px;
        padding-left: 18px;
        padding-right: 18px;
        border-width: 2px;
        border-style: solid;
        border-color: #53beb7;
        margin-right: 16px;
        border-radius: 8px;

    }
    .buttomLabelText {
        font-size: 24px;
        line-height: 24px;
        color: #53beb7;
    }
    .activeLabel {
        border-color: #dbdbdb;
        background-color: #f2f2f2;
    }
    .activeLabelText {
        color: #666;
    }
    .addLabelBox {
        padding-top: 10px;
        padding-bottom: 10px;
        padding-left: 10px;
    }
    .addLabel {
        width: 30px;
        height: 30px;
        border-width: 2px;
        border-style: solid;
        border-color: #c0c0c0;
        border-radius: 15px;
    }
    .addLabelA {
        width: 2px;
        height: 16px;
        background-color: #c0c0c0;
        position: absolute;
        top: 5px;
        left: 12px;
    }
    .addLabelB {
        width: 16px;
        height: 2px;
        background-color: #c0c0c0;
        position: absolute;
        top: 12px;
        left: 5px;
    }
    .addBorder {
        border-color: #53beb7;
    }
    .addBg {
        background-color: #53beb7;
    }









    .backImg{
        width: 40px;
        height: 40px;
    }

    .wrapper {
        flex-direction: column;
        background-color: #eff3f6;
        position: relative;
    }

    .content {
        flex-direction: column;
        justify-content: center;
        background-color: #fff;
        border-radius: 10px;

    }

    .mask_title {
        flex-direction: row;
        justify-content: center;
        align-items: center;
        height: 125px;
        line-height: 125px;

    }

    .mask_content {
        flex-direction: column;
        /*align-items: center;*/
    }

    .mask_contentSize {
        flex: 1;
        font-size: 30px;
        color: #666;
        height: 80px;
        line-height: 80px;
        text-align: center;

    }

    .mask_contentBg {
        background-color: #53beb7;
        color: #fff;
    }
    .mask_contentBgs {
        color: #666;
    }

    .mask_button {
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        padding-top: 40px;

    }

    .cancelSize {
        flex: 1;
        text-align: center;
        height: 100px;
        line-height: 100px;
        border-top-width: 1px;
        border-top-style: solid;
        border-top-color: #999;
        border-bottom-left-radius: 10px;
        font-size: 28px;
        color: #666;
    }

    .cancelSize:active {
        background-color: #f1f1f1;
    }

    .sureSize:active {
        background-color: #f1f1f1;
    }

    .sureSize {
        flex: 1;
        text-align: center;
        height: 100px;
        line-height: 100px;
        border-top-width: 1px;
        border-top-style: solid;
        border-top-color: #999;
        border-left-width: 1px;
        border-left-style: solid;
        border-left-color: #999;
        border-bottom-right-radius: 10px;
        color: #53beb7;
        font-size: 28px;
    }

    .listCell {
        background-color: #fff;
        margin-top: 30px;
        flex-direction: column;
    }

    .scroller {
        flex-direction: column;
        position: absolute;
        top: 90px;
        left: 0;
        right: 0;
        bottom: 108px;
    }

    .scroller_content {
        height: 96px;
        flex-direction: row;
        align-items: center;
        justify-content: space-around;
        /*padding-top: 22px;*/
        /*padding-bottom: 22px;*/
        margin-left: 30px;
        padding-right: 30px;
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #f5f5f5;
    }

    .content_title {
        flex-direction: row;
        align-items: center;
        justify-content: space-around;
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #f0f0f0;
        padding-top: 14px;
        padding-left: 30px;
        padding-bottom: 14px;
        padding-right: 30px;
    }

    .goodsNameCss {
        /*flex: 0.5;*/
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
        align-items: flex-end;
    }

    .input {
        font-size: 35px;
        padding-top: 10px;
        padding-bottom: 10px;
        color: #333;
        text-align: right;
        placeholder-color: #999;

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

    .spec_bottom {
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
        border-top-width: 2px;
        border-top-style: solid;
        border-top-color: #f8f8f8;
    }
    .tagCss {
        flex-direction: row;
        justify-content: flex-end;
    }

    /***********************/

</style>
