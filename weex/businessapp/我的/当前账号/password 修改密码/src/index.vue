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
                <text :style="GLOBAL.headerCenter"  slot="middle">修改密码</text>
            </wxc-minibar>
        </div>

        <div class="list">
            <!--原始密码1-->
            <div class="nomal" style="margin-top: 20px;">
                <div style="flex-direction: row;align-items: center;justify-content: space-between">
                    <text class="password" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">原密码:</text>
                    <input class="input" type="password" placeholder="请输入原始密码" v-model="original_pwd" ref="input1" :style="GLOBAL.inputText"/>
                </div>
            </div>



            <div class="nomal" style="margin-top: 10px;">
                <div style="flex-direction: row;align-items: center;justify-content: space-between">
                    <text class="password" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">新密码:</text>
                    <input class="input" :type="pwdTypes" placeholder="8-16位,包含字母,数字,符号" v-model="new_pwd" ref="input2" :style="GLOBAL.inputText"/>
                </div>
            </div>
            <div class="nomal" style="margin-top: 10px;">
                <div style="flex-direction: row;align-items: center;justify-content: space-between">
                    <text class="password" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">确认密码:</text>
                    <input class="input" :type="pwdTypes" placeholder="确认新密码" v-model="new_pwds" ref="input3" :style="GLOBAL.inputText"/>
                </div>
            </div>

            <div class=" enterButton">

                <wxc-button class="okButton" text="完成" :textStyle="GLOBAL.buttonText" :btnStyle="GLOBAL.defaultButton"
                            @wxcButtonClicked="toEnterMessage"></wxc-button>
            </div>

            <div style="align-items: center;margin-top: 20px;">
                <text style="color: #999" :style="{fontSize:GLOBAL.bigFS}">请将修改后的密码告知所有使用者</text>
            </div>
        </div>
        <toast ref="toast"></toast>
    </div>
</template>

<script>
    import Toast from './Toast.vue';
    import {WxcMinibar, WxcButton} from 'weex-ui';
    const navigator = weex.requireModule('navigator');
    const event = weex.requireModule('event');
    const post = weex.requireModule('stream');
    const modal = weex.requireModule('modal'); const dom = weex.requireModule('dom');
    export default {
        components: {WxcMinibar, WxcButton,Toast},
        name: 'App',
        data() {
            return {
                backImgToggle: 0,//头部返回图片判断
                isOpen: 1,
                isOn: false,
                pwdType: "password",
                pwdTypes: "password",
                original_pwd:"",
                new_pwd:"",
                new_pwds:"",
                token:'',
                imei:''
            }
        },
        created:function () {
            this.token = weex.config.token;
            this.imei = weex.config.imei;
        },
        methods: {
            //返回上一页
            minibarLeftButtonClick:function () {
                navigator.pop({ animated: 'true' });
            },
            isOpens(index){
                this.isOpen=index
                // var that = this;
                // if (that.isOpen == false) {
                //     that.isOpen = true;
                //     // that.pwdType = "text";
                // } else {
                //     that.isOpen = false;
                //     // that.pwdType = "password";
                // }
            },
            isOns: function () {
                var that = this;
                if (that.isOn === false) {
                    that.isOn = true;
                    that.pwdTypes = "text";
                } else {
                    that.isOn = false;
                    that.pwdTypes = "password";
                }
            },
            toEnterMessage:function () {
                var that = this;
                //隐藏键盘
                that.$refs.input1.blur();
                that.$refs.input2.blur();
                that.$refs.input3.blur();

                const toast=that.$refs.toast
                if(!this.original_pwd)
                {
                    toast.editContent('请输入原密码');
                    return false;
                }
                if(this.new_pwd.length<7)
                {
                    toast.editContent('密码不能少于8位');
                    return false;
                }
                if(!this.new_pwd)
                {
                    toast.editContent('请输入新密码');
                    return false;
                }
                if(this.new_pwd!=this.new_pwds)
                {
                    toast.editContent('两次密码不一致');
                    return false;
                }

                var pwdReg = /^.*(?=.{8,30})(?=.*\d)(?=.*[A-z])(?=.*[!@#$%^&*?.,_+\(\)]).*$/;//8到16位数字与字母组合
                if(!pwdReg.test(this.new_pwd)){
                    toast.editContent('密码需要包含字母，数字，符号');
                    return false;
                }

                if(!pwdReg.test(this.original_pwd)){
                    toast.editContent('原密码格式错误');
                    return false;
                }
                
                //获取token和sign
                var param = this.GLOBAL.sign(this.token,this.imei);
                param+= '&original_pwd=' + that.original_pwd  //原密码
                param+= '&new_pwd=' + that.new_pwd  //新密码
                
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    url: 'https://www.aftdc.com/businessapp/Store/alter_password',
                }, function (res) {
                    if (res.data.res == 1) {
                        setTimeout(()=>navigator.pop({ animated: 'true' }),1500);
                    }
                    toast.editContent(res.data.info);
                })
            }
        }
    }
</script>

<style scoped>
    .enterButton {
        flex-direction: row;
        justify-content: space-around;
        margin-top: 30px;
        padding-top: 20px;
        padding-bottom: 20px;
        padding-left: 30px;
        padding-right: 30px;
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

    .list {
    }

    .nomal {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        background-color: #ffffff;
    }

    .password {
        width: 150px;
    }

    .input{
        width: 480px;
        margin-right: 20px;
    }

    .picture {
        margin-top: 6px;
        width: 60px;
        height: 30px;
    }
</style>
