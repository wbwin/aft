<template>
    <div class="wrapper">
        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="backClick()"
                    v-once>
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">{{selectType==-1?'添加桌位':'编辑桌位'}}</text>
                <text :style="GLOBAL.headerRight"  slot="right"></text>
            </wxc-minibar>
        </div>

        <div class="countent">
            <div>
                <div class="tableCentent">
                    <text class="titleSize" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">桌位号码：</text>
                    <input class="input" :style="GLOBAL.inputText" type="number" v-model="deskNum" placeholder="请输入桌位号码"/>
                </div>
                <div class="tableCentent">
                    <text class="titleSize" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">桌位名称：</text>
                    <input class="input" :style="GLOBAL.inputText" type="text" v-model="deskName" placeholder="请输入桌位名称"/>
                </div>
                <div class="tableCentent">
                    <text class="titleSize" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">桌位类型：</text>
                    <div class="content_right">
                        <div class="radio_content" @click="radioClick(1)">
                            <image class="imgDefault" v-if="deskType!==1"
                                   src="https://image.aftdc.com/appBimg/radio.png"></image>
                            <image class="imgDefault" v-else
                                   src="https://image.aftdc.com/appBimg/radio_check.png"></image>
                            <text class="radioNameSize" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">散台</text>
                        </div>
                        <div class="radio_content" @click="radioClick(2)">
                            <image class="imgDefault" v-if="deskType!==2"
                                   src="https://image.aftdc.com/appBimg/radio.png"></image>
                            <image class="imgDefault" v-else
                                   src="https://image.aftdc.com/appBimg/radio_check.png"></image>
                            <text class="radioNameSize" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">包厢</text>
                        </div>
                    </div>

                </div>
                <div class="tableCentent">
                    <text class="titleSize" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">用餐人数：</text>
                    <input class="input" :style="GLOBAL.inputText" type="number" v-model="deskPersonNum" placeholder="用餐人数(最多30人)"/>
                </div>
            </div>
            <div class="tableButton">
                <wxc-button class="maskCancelButton" text="取消" :textStyle="GLOBAL.cancelButtonText" :btn-style="GLOBAL.smCancelButton"
                            @wxcButtonClicked="backClick"></wxc-button>
                <wxc-button class="sureButton" text="确定" :textStyle="GLOBAL.buttonText" :btn-style="GLOBAL.smDefaultButton"
                            @wxcButtonClicked="ensure"></wxc-button>
            </div>
        </div>
        <toast ref="toast"></toast>
    </div>
</template>

<script>
    // import {WxcRadio, WxcButton} from 'weex-ui'
    // import {WxcSliderBar} from 'weex-ui';
    import {WxcButton, WxcMask,WxcRadio,WxcMinibar} from 'weex-ui'
    import {WxcDialog,WxcSliderBar} from 'weex-ui';
    import BindingX from 'weex-bindingx';
    import Toast from './Toast.vue'
    const navigator = weex.requireModule('navigator');
    const post = weex.requireModule('stream');
    const event = weex.requireModule('event');

    export default {
        // components: {WxcRadio, WxcSliderBar, BindingX, WxcButton},
        components: {WxcButton, WxcDialog, Toast, WxcMask,WxcRadio,BindingX,WxcSliderBar,WxcMinibar},
        data() {
            return {
                backImgToggle: 0,//头部返回图片判断
                radio: 0,//0为散台，1为包厢
                sliderBarCfg: {
                    length: 400,
                    range: false,
                    min: 0,
                    max: 100,
                    value: 50,
                    defaultValue: 50,
                    disabled: false
                },

                deskName:'',
                deskNum:'',
                deskPersonNum:'',
                deskType:'',
                id:'',
                deskindex: '',
                selectType: '',
                token:'',
                imei:''

            }
        },
        created() {
            this.token = weex.config.token;
            this.imei = weex.config.imei;
            var that = this;
            that.selectType = -1;
            if(weex.config.param) {
                that.selectType =JSON.parse(weex.config.param).deskId;
                var deskNum =JSON.parse(weex.config.param).deskNum;
                var deskName=JSON.parse(weex.config.param).deskName;
                var deskType=JSON.parse(weex.config.param).deskType;
                var deskPersonNum=JSON.parse(weex.config.param).deskPersonNum;
                var index = JSON.parse(weex.config.param).deskindex;
                that.deskindex = index;
                that.deskName = deskName;//桌位名称
                that.deskNum = deskNum;//桌位号码
                that.deskPersonNum = deskPersonNum;//桌位人数
                that.deskType = deskType;//桌位类型1散2包
                that.id = that.selectType;//桌位ID
            }
        },
        methods: {
            //确定
            ensure(){
                var that = this;
                var deskName = that.deskName;//桌位名称
                var deskNum = that.deskNum;//桌位号码
                var deskPersonNum = that.deskPersonNum;//桌位人数
                var deskType = that.deskType;//桌位类型1散2包
                var selectType = that.selectType;

                if (!deskName) {
                    const toast=that.$refs.toast;
                    toast.editContent('桌位名称不能为空');
                    return false;
                }
                if (!deskNum) {
                    const toast=that.$refs.toast;
                    toast.editContent('桌位号码不能为空');
                    return false;
                }
                if (!deskPersonNum) {
                    const toast=that.$refs.toast;
                    toast.editContent('用餐人数不能为空');
                    return false;
                }
                if (!deskType) {
                    const toast=that.$refs.toast;
                    toast.editContent('桌位类型不能为空');
                    return false;
                } else {
                    if (deskType === 1) {
                        deskType = '散台';
                    } else if (deskType === 2) {
                        deskType = '包厢';
                    }
                }
                //获取token和sign
                var param = this.GLOBAL.sign(this.token,this.imei);
                if (selectType === -1){
                    var url = 'https://www.aftdc.com/businessapp/Enrol/editDesk';
                    param += '&&deskName=' + deskName+'&&'+'deskNum='+deskNum+'&&'+'deskPersonNum='
                        +deskPersonNum+'&&'+'deskType='+deskType;
                } else {
                    var id = that.id;//桌位ID
                    var url = 'https://www.aftdc.com/businessapp/Enrol/changeDesk';
                    param += '&&deskName=' + deskName+'&&'+'deskNum='+deskNum+'&&'+'deskPersonNum='
                        +deskPersonNum+'&&'+'deskType='+deskType+'&&'+'id='+id;
                }
                post.fetch({
                    method: 'post',
                    type: 'json',
                    body: param,
                    url: url,
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                }, function (res) {
                    if(res.data.res === 1){
                        const toast=that.$refs.toast;
                        toast.editContent('成功');
                        var param = {};
                        param['deskName'] = deskName;
                        param['deskNum'] = deskNum;
                        param['deskType'] = deskType;
                        param['deskPersonNum'] = deskPersonNum;
                        if (selectType !== -1) {
                            // var id = that.id;//桌位ID
                            var index = that.deskindex;
                            param['index'] = index;
                            param['id'] = id;
                        } else if (selectType === -1) {
                            param['id'] = res.data.deskId;
                        }
                        //保存数据
                        event.save('param', param);
                        setTimeout(()=>navigator.pop({ animated: 'true' }),2000);

                    } else if (res.data.res === 0){
                        const toast=that.$refs.toast;
                        toast.editContent('座位号已存在');
                    } else {
                        const toast=that.$refs.toast;
                        toast.editContent('网络出错了');
                    }
                })
            },
            //选择类型
            radioClick(index) {
                var that = this;
                that.deskType = index
            },
            //返回上一页
            backClick() {
                navigator.pop({ animated: 'true' });
            },
        },
    }
</script>

<style scoped>
    .wrapper {
        flex-direction: column;

        background-color: #fff;
        position: relative;
    }

    .countent {
        position: absolute;
        top: 90px;
        left: 0;
        right: 0;
        bottom: 0;
        flex-direction: column;
        justify-content: space-between;
    }

    .tableCentent {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding-left: 30px;
        padding-right: 30px;
        margin-top: 40px;
    }

    .titleSize {
        flex: 1;
    }

    .input {
        text-align: center;
        flex: 1.5;
    }
    .input:active{
        placeholder-color: #666;
    }
    .content_right {
        flex: 1.5;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
    }

    .imgDefault {
        width: 50px;
        height: 50px;
    }

    .radio_content {
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }

    .radioNameSize {
        margin-left: 10px;
    }

    .tableButton {
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        padding-top: 20px;
        padding-bottom: 20px;
        border-top-width: 2px;
        border-top-style: solid;
        border-top-color: #f8f8f8;



    }

    .sureButton:active {
        background-color: #57aba5;
    }

    .maskCancelButton:active {
        background-color: #f1f1f1;
    }

    /***********************/
</style>
