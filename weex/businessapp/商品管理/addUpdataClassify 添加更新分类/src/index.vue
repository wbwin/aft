<template>
    <div class="wrapper">

        <wxc-minibar
                background-color="#53beb7"
                text-color="#fff"
                @wxcMinibarRightButtonClicked="saveClick"
                :use-default-return="false"
                @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                v-once>
            <image class="backImg"  slot="left"
                   src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
            <text :style="GLOBAL.headerCenter" slot="middle">{{classifyName == ''?'添加分类':'编辑分类'}}</text>
            <text :style="GLOBAL.headerCenter" slot="right">保存</text>
        </wxc-minibar>

        <div class="content_center" v-if="catId">
            <div class="classItem">
                <div class="title">
                    <text :style="{fontSize: GLOBAL.bigFS,color:GLOBAL.dColor}">分类名称</text>
                </div>
                <div class="inputBox">
                    <input :style="GLOBAL.inputText" v-model="classifyName" maxlength="20" type="text" placeholder="请输入分类名称（限20字以内）" ref="saveTast"/>
                </div>
            </div>
        </div>

        <scroller class="content_center" v-else>
            <div class="classItem" v-for="(item,index) in classArray">
                <div class="title">
                    <text :style="{fontSize: GLOBAL.bigFS,color:GLOBAL.dColor}">分类名称{{index+1}}</text>
                    <text style="color:#f00;font-size: 28px" @click="classDelClick(index)" v-if="classArray.length > 1">删除</text>
                </div>
                <div class="inputBox">
                    <input :style="GLOBAL.inputText" v-model="classArray[index]" maxlength="20" type="text"  placeholder="请输入分类名称（限20字以内）" ref="saveTast" @focus="focus(index)" @blur="blur(index)"/>
                </div>
            </div>
        </scroller>

        <div class="spec_bottom" v-if="theFocus===0&&!catId">
            <wxc-button class="button" text="+ 添加分类" :disabled="classArray.length>=50?true:false" :text-style="GLOBAL.buttonText" :btn-style="GLOBAL.defaultButton"
                        @wxcButtonClicked="wxcButtonClicked"></wxc-button>
        </div>
        <toast ref="toast"></toast>

        <wxc-mask height="280"
                  width="500"
                  border-radius="6"
                  duration="200"
                  mask-bg-color="#FFFFFF"
                  :has-animation="true"
                  :has-overlay="true"
                  :show-close="false"
                  :show="show"
                  @wxcMaskSetHidden="wxcMaskSetHidden">
            <div class="content" @click="">
                <text class="maskTitle" :style="{fontSize:'30px',color:GLOBAL.dColor}">确认退出编辑？</text>
                <div class="maskBtn">
                    <text class="maskBtnStyle maskBtnCancel" :style="{fontSize:GLOBAL.bigFS}" @click="wxcMaskSetHidden">取消</text>
                    <text class="maskBtnStyle maskBtnConfirm" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor}" @click="black">确认</text>
                </div>
            </div>
        </wxc-mask>
    </div>
</template>

<script>
    import {WxcMinibar,WxcButton,WxcMask} from 'weex-ui'
    import Toast from './Toast.vue'
    const modal = weex.requireModule('modal');
    const post = weex.requireModule('stream');
    const navigator = weex.requireModule('navigator');
    const event = weex.requireModule('event');
    var timer = null;
    export default {
        components: {WxcMinibar,WxcButton,Toast,WxcMask},
        data() {
            return {
                show: false,
                backImgToggle: 0,//头部返回图片判断
                classifyName: '',
                token: '',
                imei: '',
                classArray: [''],
                theFocus: 0
            }
        },
        created: function () {
            this.token = weex.config.token;
            this.imei = weex.config.imei;
            var catId = JSON.parse(weex.config.param).catId;
            if (catId) {
                this.catId = catId
            }else{
                this.catId = ''
            }
            this.classifyName = JSON.parse(weex.config.param).classifyName;
        },
        methods: {

            minibarLeftButtonClick(){
                this.show = true;
            },
            black(){
                navigator.pop({ animated: 'true' });
            },
            // 添加分类
            wxcButtonClicked(){
                if(this.classArray.length<50){
                    this.classArray.push('')
                }
            },
            // 删除分类
            classDelClick(index){
                this.classArray.splice(index,1)
            },
            // input框获取焦点时
            focus(index){
                clearTimeout(timer)
                this.theFocus = ++ index
            },
            // input框失去焦点时
            blur(index){
                clearTimeout(timer)
                timer = setTimeout(()=>{// 防止另一个input框失去焦点时会闪一下
                        this.theFocus = 0
                },10)
            },
            saveClick() {
                var that = this
                const toast = this.$refs.toast;
                var param = this.GLOBAL.sign(this.token, this.imei);
                if(this.catId){
                    this.$refs.saveTast.blur();
                    if(this.classifyName == ''){
                        toast.editContent('分类名称不能为空');
                        return false
                    }
                    param += '&catName=' + that.classifyName;
                    param += '&catId=' + that.catId;
                }else {
                    if(this.theFocus!==0){
                        this.$refs.saveTast[this.theFocus-1].blur();
                    }
                    for(var i=0,len=this.classArray.length;i<len;i++){
                        if(this.classArray[i] == ''){
                            toast.editContent('分类名称不能为空');
                            return false
                        }
                    }
                    param += '&catName=' + JSON.stringify(this.classArray)
                }
                post.fetch({
                    method: 'post',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/businessapp/Enrol/updatecats',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                }, function (res) {
                    if (res.data.res == 1) {
                        event.save('changeGoodsManage', 1);//标记商品管理改变
                        toast.editContent(res.data.info);
                        setTimeout(() => navigator.pop({animated: 'true'}), 2000);
                    } else {
                        toast.editContent(res.data.info);
                    }
                })
            },
            wxcMaskSetHidden(){
                this.show = false
            }
        }
    }
</script>

<style scoped>
    /*****************/
    .backImg{
        width: 40px;
        height: 40px;
    }

    .button:active {
        background-color: #57aba5;
    }
    .button:enabled{
        background-color: #53beb7;
    }


    .errorCss {
        placeholder-color: #ffb05d;
    }

    /***********************/
    .wrapper {
        flex-direction: column;
        background-color: #f8f8f8;
        position: relative;

    }

    .title {
        flex-direction: row;
        justify-content: space-between;
        margin-top: 30px;
        margin-left: 30px;
        padding-right: 30px;
    }
    .inputBox {
        padding-top: 20px;
        padding-bottom: 30px;
        padding-left: 30px;
        padding-right: 30px;
    }
    .content_center {
        flex-direction: column;
        position: absolute;
        top: 90px;
        left: 0;
        right: 0;
        bottom: 130px;
    }
    .classItem {
        background-color: #fff;
        margin-top: 30px;
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
    .content {
        flex: 1;
        justify-content: space-between;
        align-items: center;
    }
    .maskTitle {
        margin-top: 80px;
    }
    .maskBtn {
        width: 500px;
        height: 90px;
        flex-direction: row;
        border-top-width: 1px;
        border-top-style: solid;
        border-top-color: #eaeaea;
    }
    .maskBtnStyle {
        flex: 1;
        line-height: 90px;
        text-align: center;
    }
    .maskBtnCancel {
        color: #6c6c6c;
        border-right-width: 1px;
        border-right-style: solid;
        border-right-color: #eaeaea;

    }

</style>
