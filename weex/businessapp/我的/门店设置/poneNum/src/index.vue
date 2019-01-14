<template>
    <div class="wrapper">

        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    v-once
            >
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">门店设置</text>
            </wxc-minibar>
        </div>

        <div class="list">
            <div style="align-items: center">
                <input class="input" type="number" maxlength="11" v-model="phone" @input="phone_check()" :style="GLOBAL.inputText"/>
            </div>
            <div style="align-items: center">
                <text class="tips" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">一个账号只能绑定1个号码</text>
            </div>
        </div>

        <!--保存按钮-->
        <div class=" enterButton" style="padding-top: 30px;">

            <wxc-button class="okButton" text="保存" :textStyle="GLOBAL.buttonText" :btnStyle="GLOBAL.defaultButton"
                        @wxcButtonClicked="toEnterMessage"></wxc-button>
        </div>

        <!--返回按钮-->
        <div class=" enterButton">

            <wxc-button class="okButtonTwo" text="返回" :textStyle="GLOBAL.cancelButtonText" :btnStyle="GLOBAL.cancelButton"
                        @wxcButtonClicked="toEnterMessageBack"></wxc-button>
        </div>
    </div>
</template>

<script>
    import {WxcMinibar, WxcButton} from 'weex-ui';
    const navigator = weex.requireModule('navigator')
    const event = weex.requireModule('event')
    const post = weex.requireModule('stream');
    const modal = weex.requireModule('modal')
    export default {
        components: {WxcMinibar, WxcButton},
        name: 'App',
        data() {
            return {
                backImgToggle: 0,//头部返回图片判断
                phone:'',
                origin_phone:'',
                token:'',
                imei:''
            }
        },
        created: function () {
            this.token = weex.config.token
            this.imei = weex.config.imei
            var that = this

            //获取token和sign
            var param = this.GLOBAL.sign(this.token,this.imei);

            /*获取上传的图片对象*/
            post.fetch({
                method: 'POST',
                type: 'json',
                body: param,
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                url: 'https://www.aftdc.com/businessapp/Store/getPhone',
            }, function (e) {
                if (e.data.res == -2)
                {
                    //跳到登陆页面
                    navigator.push({
                        url: "https://image.aftdc.com/images/shop/",
                        animated: 'true'
                    })
                }
                else {
                    if(e.data.res===1) {
                        that.phone = e.data.phone;
                        that.origin_phone = e.data.phone
                    }
                    else
                    {
                        modal.toast({
                            message: '出错了'
                        })
                    }
                }
            })
        },
        methods: {
            toEnterMessageBack(){
                navigator.pop({ animated: 'true' });
            },
            toEnterMessage: function () {

                if (!this.phone) {
                    modal.toast({
                        message: '请输入手机号码'
                    })
                    return false;
                }

                var pwdReg = /^[1][3,4,5,7,8][0-9]{9}$/;//8到16位数字与字母组合
                if (!pwdReg.test(this.phone)) {
                    modal.toast({
                        message: '手机号码格式错误'
                    })
                    return false;
                }


                var that = this;

                //获取token和sign
                var param = this.GLOBAL.sign(this.token,this.imei);

                param += '&original_phone=' + that.origin_phone  //原密码
                param += '&new_Phone=' + that.phone  //原密码
                /*获取上传的图片对象*/
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    url: 'https://www.aftdc.com/businessapp/Store/alter_phone',
                }, function (e) {
                    if (e.data.res === -2)
                    {
                        //跳到登陆页面
                        navigator.push({
                            url: "https://image.aftdc.com/images/shop/",
                            animated: 'true'
                        })
                    } else if (e.data.res === 1) {
                        modal.toast({
                            message: "修改成功"
                        });

                        var data = {'type':'phone','phone':that.phone};
                        event.save('data',data);
                        setTimeout(()=>navigator.pop({ animated: 'true' }),2000);
                    }
                    else {
                        modal.toast({
                            message: e.data.info
                        })
                    }
                })
            },
            phone_check: function () {
                var pwdReg = /^[0-9]+$/;//8到16位数字与字母组合
                if (!pwdReg.test(this.phone)) {
                    this.phone=this.phone.match(/^[0-9]+/);
                }
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

    .header {
        flex-direction: row;
        height: 90px;
        background-color: #53beb7;
        align-items: center;
        justify-content: space-between;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
    }

    .list {
        background-color: #fff;
        padding-bottom: 30px;
    }

    .backclick {
        margin-left: 40px;
        flex: 1;
    }

    .backImg {
        width: 40px;
        height: 40px;
    }

    .appName {
        flex: 1;
    }

    .appNameCss {
        font-size: 40px;
        color: #fff;
    }

    .allSave {
        flex: 1;
        margin-right: 40px;

    }

    .input {
        width: 600px;
        margin-top: 30px;
        text-align: center;
    }
    .tips{
        margin-top: 40px;
    }
    .ok{
        padding-top: 20px;
        padding-bottom: 20px;
        padding-left: 300px;
        padding-right: 300px;
        color: #ffffff;
        background-color: #53beb7;
        margin-top: 60px;
        border-radius: 10px;
        font-size: 35px;
        border-style: solid;
        border-color: #999;
        border-width: 1px;
    }
    .back{
        padding-top: 20px;
        padding-bottom: 20px;
        padding-left: 300px;
        padding-right: 300px;
        color: #333;
        background-color: #fff;
        margin-top: 40px;
        border-radius: 10px;
        font-size: 35px;
        border-style: solid;
        border-color: #999;
        border-width: 1px;
    }
</style>
