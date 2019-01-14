<template>
    <div class="wrapper">

        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
            >
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">打印机设置</text>
            </wxc-minibar>
        </div>
        <scroller>
            <div class="list">
                <text class="normal" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor}">打印机号码</text>
                <input type="number" class="import" placeholder ='请输入打印机号码'   :value="printsNum" @input="printsNums" :style="GLOBAL.inputText">
                <text class="normal" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor}">打印机秘钥</text>
                <input type="text" class="import" placeholder ='请输入打印机秘钥'  autofocus="true"  :value="printsKey"  @input="printsKeys" :style="GLOBAL.inputText">

                <!--按钮-->
            </div>
            <div class=" enterButton">
                <wxc-button class="okButton" text="保存" :textStyle="GLOBAL.buttonText" :btnStyle="GLOBAL.defaultButton"
                            @wxcButtonClicked="toEnterMessage"></wxc-button>
            </div>
        </scroller>
    </div>
</template>

<script>
    import {WxcMinibar,WxcButton} from 'weex-ui';
    const navigator = weex.requireModule('navigator')
    const event = weex.requireModule('event')
    const post = weex.requireModule('stream');
    const modal = weex.requireModule('modal');
    export default {
        components: {WxcMinibar,WxcButton},
        name: 'App',
        data() {
            return {
                backImgToggle: 0,//头部返回图片判断
                printsKey:'',
                printsNum:'',
                token:'',
                imei:''

            }
        },
        created:function(){
            this.token = weex.config.token;
            this.imei = weex.config.imei;
            var that=this;

            //获取token和sign
            var param = this.GLOBAL.sign(this.token,this.imei);

            post.fetch({
                method: 'POST',
                type: 'json',
                body: param,
                url: 'https://www.aftdc.com/businessapp/Store/getPrint',
            }, function(e){
                console.log(e);
                console.log(e.data);
                if(e.data.res===-2)
                    event.openURL('weex://go/scan') //跳到登陆页面
                else{
                    that.printsKey = e.data.arr.printsKey;
                    that.printsNum = e.data.arr.printsNum
                }

            })

        },
        methods: {
            toEnterMessage: function () {
                var that = this;

                //获取token和sign
                var param = this.GLOBAL.sign(this.token,this.imei);

                param+='&printsKey='+this.printsKey;
                param+='&printsNum='+this.printsNum;
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: 'https://www.aftdc.com/businessapp/Store/setPrint',
                }, function (e) {

                    if (e.data.res === -2) {
                        event.openURL('weex://go/scan') //跳到登陆页面
                    }
                    else {
                        if(e.data.res===1) {
                            modal.toast({
                                message:"操作成功"
                            })
                            setTimeout(()=>navigator.pop({ animated: 'true' }),2000);
                        }
                        if(e.data.res===-1) {
                            modal.toast({
                                message:"请正确配置打印机号码和秘钥"
                            })
                        }
                    }

                })
            },
            printsNums:function(event)
            {
                this.printsNum = event.value
            },
            printsKeys:function(event)
            {
                this.printsKey = event.value
            },
            //返回上一页
            minibarLeftButtonClick:function () {
                navigator.pop({ animated: 'true' });
            }

        }
    }
</script>

<style scoped>
    .minibar {
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: #f1f1f1;
    }

    .enterButton {
        flex-direction: row;
        justify-content: space-around;
        /*position: fixed;*/
        /*left: 0;            存在时固定在底部*/
        /*bottom: 0;*/
        /*right: 0;*/
        background-color: #fff;
        border-top-width: 2px;
        border-top-style: solid;
        border-top-color: #f1f1f1;
        padding-top: 20px;
        padding-bottom: 20px;
        padding-left: 30px;
        padding-right: 30px;
    }

    .okButton:active {
        background-color: #57aba5;
    }
    .okButton:enabled {
        background-color: #53beb7;
    }
    .wrapper {
        background-color: #f8f8f8;
    }


    .list {
        padding-left: 60px;
        padding-right: 60px;
        background-color: #fff;
    }

    .normal{
        margin-top: 20px;
        margin-bottom: 20px;
    }
    .import{
        height: 70px;
        border-width: 1px;
        border-style: solid;
        border-color: #e2e2e2;
        margin-bottom: 40px;
        border-radius: 5px;
    }

</style>
