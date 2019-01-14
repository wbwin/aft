<template>
    <div class="wrapper" :style="{visibility: visibility}">
        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="backClick"
                    @wxcMinibarRightButtonClicked="minibarRightButtonClick"
                    v-once>
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">提现</text>
                <text :style="GLOBAL.headerRight"  slot="right"></text>
            </wxc-minibar>
        </div>
        <div class="list">
            <div style="align-items: center;margin-top: 40px;">
                <div class="card">
                    <div style="flex-direction: row;">
                        <image src="https://image.aftdc.com/appBimg/icon_bank.png"
                               style="width: 100px;height: 100px;"></image>
                        <text class="account">**** **** **** {{kH}}</text>
                    </div>
                    <text class="userName">{{userName}}</text>
                </div>
            </div>

            <div class="remaining">
                <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">提现金额</text>
                <text class="ye" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">(当前余额￥{{canDraw}})</text>
            </div>
            <div class="box" style="margin-top: 40px;">
                <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">￥</text>
                <input class="input" :style="{fontSize:'26px',color:'#333'}" type="number" ref="inputOne" placeholder="请输入提现金额" v-model="money"/>
            </div>
            <div class="box" style="margin-top: 30px;">
                <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">￥</text>
                <input class="input" :style="{fontSize:'26px',color:'#333'}" type="password" placeholder="请输入登录密码" v-model="password" />
            </div>
            <div class="btnBox">
                <wxc-button class="sureBox" text="确定提现" :btnStyle="defaultButton" :textStyle="buttonText"
                            @wxcButtonClicked="draw"></wxc-button>
                <wxc-button class="cancleBox" text="取消"   :btnStyle="cancelButton" :textStyle="cancelButtonText"
                            @wxcButtonClicked="backClick"></wxc-button>
            </div>
        </div>

    </div>
</template>

<script>
    import { WxcMinibar,WxcButton } from 'weex-ui'
    const navigator = weex.requireModule('navigator')
    const event = weex.requireModule('event')
    const post = weex.requireModule('stream');
    const modal = weex.requireModule('modal')
    export default {
        name: 'App',
        data() {
            return {
                defaultButton: {
                    backgroundColor:'#53beb7', width:'690px'
                },
                cancelButton: {
                    backgroundColor:'#fff', width:'690px',borderWidth:'1px',borderStyle:'solid',borderColor:'#666'
                },
                cancelButtonText: {
                    fontSize:'28px',color:'#666'
                },
                buttonText: {
                    fontSize:'28px',color:'#fff'
                },
                backImgToggle: 0,//头部返回图片判断
                kH:"", //银行卡号
                money:"", //提现金额
                password:"",//输入密码
                canDraw:"", //可以提现的金额
                userName:"", //卡号名字,
                token:'',
                imei:'',
                visibility:'hidden',
                preventRepeatedClicks:false,//阻止重复点击
            }
        },
        components: {WxcMinibar,WxcButton},
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
                url: 'https://www.aftdc.com/businessapp/Finance/CaiTixian',
            }, function (e) {
                if (e.data.res === -2) {
                    //跳到登陆页面
                    navigator.push({
                        url: "https://image.aftdc.com/images/shop/",
                        animated: 'true'
                    })
                }
                else {
                    if(e.data.res)
                    {
                        that.kH = e.data.data.kH;
                        that.canDraw = e.data.data.user.userMoney;
                        that.userName = e.data.data.user.userName;
                        // if (e.data.data.user.secret === 0) {
                        //     modal.toast({
                        //         message:"亲，你还没有设置提现密码哦"
                        //     })
                        // }
                    }
                    else
                    {
                        modal.toast({
                            message: '网络异常'
                        });
                        return false
                    }

                }

            })

        },
        mounted(){
            var that=this
            that.visibility='visible';
            that.$refs.inputOne.setTextFormatter({
                formatRule: "/(\\.\\d{2})(\\S+)/",
                formatReplace: "$1",
                recoverRule: "/\\s+/g",
                recoverReplace: ""
            })
        },
        methods:{
            minibarRightButtonClick(){

            },
            draw:function(){
                var that = this;
                //获取token和sign
                var param = this.GLOBAL.sign(this.token,this.imei);

                param+= '&password='+ that.password;
                param+= '&money='+ that.money;
                /*获取上传的图片对象*/
                var pwdReg = /^\d+(\.\d+)?$/;
                if(!pwdReg.test(this.money)){
                    modal.toast({
                        message: '金额格式错误'
                    });
                    return false
                }
                if(that.preventRepeatedClicks){
                    return false
                }
                that.preventRepeatedClicks=true
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    url: 'https://www.aftdc.com/businessapp/Finance/Txiancl',
                }, function (e) {
                    if (e.data.res === -2) {
                        //跳到登陆页面
                        navigator.push({
                            url: "https://image.aftdc.com/images/shop/",
                            animated: 'true'
                        })
                    }
                    else {
                        if(e.data.res===1)
                        {
                            modal.toast({
                                message: '提交提现申请成功'
                            });
                            setTimeout(()=>navigator.pop({ animated: 'true' }),1500);
                            return false
                        }
                        else if(e.data.res===0)
                        {
                            modal.toast({
                                message: '金额超出可提现数'
                            });
                            return false
                        }
                        else if(e.data.res===-1)
                        {
                            modal.toast({
                                message: '密码错误'
                            });
                            return false
                        }
                        else
                        {
                            modal.toast({
                                message: '网络异常'
                            });
                            return false
                        }

                    }
                    that.preventRepeatedClicks=false
                })
            },

            // money_check:function(){
            // this.money = this.money.match(/^[0-9.]+/);
            // },
            //返回上一页
            backClick:function () {
                navigator.pop({ animated: 'true' });
            },
        }
    }
</script>

<style scoped>
    .wrapper {
        background-color: #f8f8f8;
    }

    /*****************/
    .list {
        position: absolute;
        top: 89px;
        left: 0;
        right: 0;
        bottom: 0;
    }



    .card {
        flex-direction: row;
        justify-content: space-between;
        width: 690px;
        height: 250px;
        align-items: center;
        padding-left: 40px;
        padding-right: 40px;
        background-image: linear-gradient(to right, #2bd3be, #87f2fc);
        border-radius: 10px;
    }

    .account {
        padding-top: 60px;
        padding-left: 40px;
        font-size: 30px;
        color: #ffffff;
    }

    .userName {
        color: #ffffff;
        font-size: 30px;
    }

    .remaining {
        flex-direction: row;
        margin-top: 40px;
        padding-left: 30px;
    }



    .ye {
        margin-left: 30px;
    }

    .box {
        margin-left: 30px;
        margin-right: 30px;
        padding: 15px;
        align-items: center;
        flex-direction: row;
        border-style: solid;
        border-color: #999;
        border-width: 1px;
        border-radius: 10px;
    }

    .input {
        width: 450px;
        margin-left: 10px;
        padding-top: 10px;
        padding-bottom: 10px;
        padding-left: 20px;
        background-color: #f8f8f8;
    }

    .sureBox {
        margin-top: 70px;

    }
    .sureBox:active {
        background-color: #57aba5;
    }
    .sureBox:enabled {
        background-color: #53beb7;
    }
    .cancleBox{
        margin-top: 20px;
    }
    .cancleBox:active {
        background-color: #f1f1f1;
    }
    .cancleBox:enabled {
        background-color: #fff;
    }
    .btnBox {
        align-items: center;
    }
</style>
