<template>
    <div class="wrapper">
        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="backClick()"
                    @wxcMinibarRightButtonClicked="minibarRightButtonClick"
                    v-once>
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">{{ waiterId==-1?'添加服务员':'编辑服务员' }}</text>
                <text :style="GLOBAL.headerRight"  slot="right"></text>
            </wxc-minibar>
        </div>
        <div class="waiterContent">
            <div>
                <!--<div class="content_title">-->
                <!--<text class="defaultSize titleSize">添加</text>-->
                <!--</div>-->
                <div class="content">
                    <text class="contentSize" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">姓名：</text>
                    <input type="text" class="input" :style="GLOBAL.inputText" v-model="waiterName" placeholder="请输入服务员姓名"/>
                </div>
                <div class="content">
                    <text class="contentSize" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">编号：</text>
                    <input type="number" class="input" :style="GLOBAL.inputText" v-model="waiterNum" placeholder="请输入服务员编号"/>
                </div>
            </div>
            <div class="waiterButton">
                <wxc-button class="cancelButton" text="取消"  :btnStyle="GLOBAL.smCancelButton" :textStyle="GLOBAL.cancelButtonText"
                            @wxcButtonClicked="backClick"></wxc-button>
                <wxc-button class="sureButton" text="确定" :btnStyle="GLOBAL.smDefaultButton" :textStyle="GLOBAL.buttonText"
                            @wxcButtonClicked="BtnClicked"></wxc-button>
            </div>
        </div>

        <toast ref="toast"></toast>
    </div>

</template>

<script>
    import {WxcButton,WxcDialog,WxcMinibar} from 'weex-ui'
    import Toast from './Toast.vue'
    const picker = weex.requireModule('picker')
    const animation = weex.requireModule('animation')
    const post = weex.requireModule('stream');
    const navigator = weex.requireModule('navigator');
    const event = weex.requireModule('event');
    export default {
        components: {WxcButton,WxcDialog,Toast,WxcMinibar},
        data () {
            return {
                backImgToggle: 0,//头部返回图片判断
                sureBtnStyle:{
                    backgroundColor: '#53beb7',
                    width: '300',
                    borderColor: '#333',
                    borderWidth: '1px',
                    borderStyle: 'solid'
                },
                cancelBtnStyle:{
                    backgroundColor: 'red',
                    width: '300',
                    borderColor: '#333',
                    borderWidth: '1px',
                    borderStyle: 'solid'

                },
                textStyle: {
                    color: '#fff',
                },
                waiterName:'',
                waiterNum:'',
                waiterIndex: 0,
                id: '',
                token:'',
                imei:'',
                waiterId: 0
            }
        },
        created:function(){
            this.token = weex.config.token;
            this.imei = weex.config.imei;
            var that = this;

            var waiterId=JSON.parse(weex.config.param).waiterId;
            this.waiterId = waiterId;
            if(waiterId !== -1){//waiterId等于-1为添加桌位操作，不等于-1为编辑操作
                var waiterNum=JSON.parse(weex.config.param).waiterNum;
                var waiterName=JSON.parse(weex.config.param).waiterName;
                var waiterIndex=JSON.parse(weex.config.param).waiterIndex;
                that.waiterName = waiterName;//服务员名字
                that.waiterNum = waiterNum;//服务员编号
                that.waiterIndex = waiterIndex;
                that.id = waiterId;//服务员Id
            }
        },
        methods:{
            minibarRightButtonClick(){

            },
            //返回上一页
            backClick(){
                navigator.pop({ animated: 'true' });
            },
            BtnClicked () {//点保存时时
                var that = this;

                var waiterName = that.waiterName;
                var waiterNum = that.waiterNum;
                var id = that.id;
                if(!waiterName || !waiterName){
                    const toast=that.$refs.toast
                    toast.editContent('填写完整...');
                }

                //获取token和sign
                var param = this.GLOBAL.sign(this.token,this.imei);

                param += '&&waiterName='+waiterName+'&&'+'waiterNum='+waiterNum+'&&'+'id='+id;
                post.fetch({
                    method: 'post',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/businessapp/Enrol/addWaiter',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                },function(res){
                    if(res.data.res === 1){
                        const toast=that.$refs.toast;
                        toast.editContent('成功...');

                        var param = {};
                        param['waiterName'] = waiterName;
                        param['waiterNum'] = waiterNum;

                        if (res.data.waiterId) {
                            param['id'] = res.data.waiterId;
                        } else {
                            param['index'] = that.waiterIndex;
                            param['id'] = id;
                        }

                        event.save('param', param);
                        setTimeout(()=>navigator.pop({ animated: 'true' }),2000);

                    } else if (res.data.res === 0){
                        const toast=that.$refs.toast;
                        toast.editContent('服务员编号已存在');
                    } else {
                        const toast=that.$refs.toast;
                        toast.editContent('出错了...');
                    }
                })
            },
        }
    }
</script>

<style scoped>
    .wrapper {
        flex-direction: column;
    }
    .content_title{
        justify-content: center;
        align-items: center;
    }
    .defaultSize {
        font-size: 35px;
        color: #333;

    }
    .titleSize{
        font-size: 50px;
    }
    .waiterContent{
        position: absolute;
        top: 90px;
        right: 0;
        left: 0;
        bottom: 0;
        flex-direction: column;
        justify-content: space-between;
        background-color: #f8f8f8;
    }
    .content{
        flex-direction: row;
        align-items: center;
        justify-content: center;
        padding-left: 30px;
        padding-right: 50px;
        margin-top: 40px;
    }
    .input {
        placeholder-color: #999;
        text-align: center;
        flex: 2;
    }
    .input:active{
        placeholder-color: #666;
    }
    .contentSize{
        flex: 1;
        text-align: center;
    }
    .waiterButton{
        flex-direction: row;
        justify-content: space-around;
        padding-top: 20px;
        padding-bottom: 20px;
        padding-left: 30px;
        padding-right: 30px;
        border-top-width: 2px;
        border-top-style: solid;
        border-top-color: #f8f8f8;
    }
    .cancelButton:active{
        background-color: #f1f1f1;
    }
    .sureButton:active{
        background-color: #57aba5;
    }

    /***********************/
</style>
