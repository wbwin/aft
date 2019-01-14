<template>
    <div class="wrapper" :style="{visibility: visibility}">

        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    @wxcMinibarRightButtonClicked="toEnterMessage"
                    v-once
            >
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">公告</text>
                <text :style="GLOBAL.headerRight"  slot="right">保存</text>
            </wxc-minibar>
        </div>

        <div class="list">
            <div style="align-items: center">
                <textarea class="input" rows="6" maxlength="55" placeholder="介绍一下你的店铺吧，55字以内就可以哦" v-model="notice" :style="{fontSize:GLOBAL.bigFS}"></textarea>
            </div>

            <!--确认按钮-->
            <!--<div class=" enterButton" style="padding-top: 30px;">-->

                <!--<wxc-button class="okButton" text="确定" :textStyle="GLOBAL.buttonText" :btnStyle="GLOBAL.defaultButton"-->
                            <!--@wxcButtonClicked="toEnterMessage"></wxc-button>-->
            <!--</div>-->

            <!--&lt;!&ndash;取消按钮&ndash;&gt;-->
            <!--<div class=" enterButton">-->

                <!--<wxc-button class="okButtonTwo" text="返回" :textStyle="GLOBAL.cancelButtonText" :btnStyle="GLOBAL.cancelButton"-->
                            <!--@wxcButtonClicked="toEnterMessageCancel"></wxc-button>-->
            <!--</div>-->

        </div>
    </div>
</template>

<script>
    import {WxcMinibar, WxcButton} from 'weex-ui';
    const navigator = weex.requireModule('navigator');
    const event = weex.requireModule('event');
    const post = weex.requireModule('stream');
    const modal = weex.requireModule('modal');
    export default {
        components: {WxcMinibar, WxcButton},
        name: 'App',
        data() {
            return {
                backImgToggle: 0,//头部返回图片判断
                notice:'',
                token:'',
                imei:'',
                visibility:'hidden',
            }
        },
        created: function () {
            this.visibility='hidden';
            this.token = weex.config.token;
            this.imei = weex.config.imei;
            var that = this;

            //获取token和sign
            var param = this.GLOBAL.sign(this.token,this.imei);
            /*获取上传的图片对象*/
            post.fetch({
                method: 'POST',
                type: 'json',
                body: param,
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                url: 'https://www.aftdc.com/businessapp/Store/getNotice',
            }, function (e) {
                //跳到登陆页面
                if (e.data.res === -2)
                {
                    that.GLOBAL.toLogin()
                }
                else {
                    if(e.data.res===1) {
                        that.notice = e.data.notice
                    }
                    else
                    {
                        if(!e.data.res) {
                            modal.toast({
                                message: '出错了'
                            })
                        }
                    }
                }
            })
        },
        mounted(){
            var that=this
            that.visibility='visible';
        },
        methods: {
            toEnterMessageCancel(){
                navigator.pop({ animated: 'true' });
            },
            toEnterMessage: function () {
                var that = this;

                //获取token和sign
                var param = this.GLOBAL.sign(this.token,this.imei);

                param+= '&notice=' + that.notice;  //原密码
                /*获取上传的图片对象*/
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    url: 'https://www.aftdc.com/businessapp/Store/alter_notice',
                }, function (e) {
                    if (e.data.res === -2) {
                        //跳到登陆页面
                        that.GLOBAL.toLogin()
                    }
                    else {
                        if(e.data.res===1) {
                            modal.toast({
                                message: "修改成功"
                            });
                            var data = {'type': 'notice','notice': that.notice};
                            event.save('data',data);
                            setTimeout(()=>navigator.pop({ animated: 'true' }),2000);
                        }
                        else{
                            modal.toast({
                                message: "修改失败"
                            })
                        }
                    }
                })
            },
            //返回上一页
            minibarLeftButtonClick:function () {
                navigator.pop({ animated: 'true' });
            }
        }
    }

</script>

<style scoped>
    .enterButton {
        flex-direction: row;
        justify-content: space-around;
        /*position: fixed;*/
        /*left: 0;            存在时固定在底部*/
        /*bottom: 0;*/
        /*right: 0;*/
        margin-top: 30px;
        padding-left: 30px;
        padding-right: 30px;
    }

    .okButtonTwo:active{
        background-color: #f1f1f1;
    }

    .okButton:active {
        background-color: #57aba5;
    }
    .minibar {
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: #f1f1f1;
    }
    .wrapper {
        background-color: #f8f8f8;
    }
    .input {
        width: 670px;
        height: 260px;
        margin-top: 20px;
        padding-top: 15px;
        padding-left: 15px;
        padding-right: 15px;
        color: #999;
        border-width: 2px;
        border-style: solid;
        border-color: #53beb7;
    }
</style>
