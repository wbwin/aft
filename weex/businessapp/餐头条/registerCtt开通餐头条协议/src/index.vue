<template>
    <div class="wrapper">

        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
            >
                <image :style="GLOBAL.headerImg"  slot="left" src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">开通餐头条</text>
                <!--<text :style="GLOBAL.headerRight"  slot="right">完成</text>-->
            </wxc-minibar>
        </div>

        <div class="body">
            <div class="detail">
                <text class="tiele" :style="{fontSize:GLOBAL.biggestFS,color:GLOBAL.dColor}">餐头条协议</text>
                <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">
                    ................
                </text>
            </div>
            <div class="but">
                <wxc-button text="申请开通" :btnStyle="smDefaultButton"
                            @wxcButtonClicked="registerCtt"></wxc-button>
            </div>
        </div>

    </div>
</template>

<script>
    import {WxcMinibar,WxcButton} from 'weex-ui';
    // import Toast from './Toast.vue'
    const event = weex.requireModule('event');
    const post = weex.requireModule('stream');
    const navigator = weex.requireModule('navigator');
    export default {
        components: {WxcMinibar,WxcButton},
        data() {
            return {
                sliderIndex:0,
                musicType:1,
                music:[],
                musicChoice1:'',
                musicChoice2:'',
                musicChoice3:'',
                uploadBtnStyle:{
                    backgroundColor: '#53beb7',
                    width: '600',
                    borderColor: '#333',
                    borderWidth: '1px',
                    borderStyle: 'solid'
                },
                uploadStyle:{
                    color:'#fff'
                },
                sysMusic:[],
                shopMusic:[],
                pageBack: false,
                musicIndex:-1,
                timeout:'',
                smDefaultButton:{
                    backgroundColor: '#53beb7',
                },
                registerBut:true
            }
        },
        created() {
            this.token = weex.config.token;
            this.imei = weex.config.imei;
        },
        methods:{
            registerCtt(){
                if(!this.registerBut)
                    return false
                this.registerBut = false
                var param = this.GLOBAL.sign(this.token,this.imei);
                var that = this
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: 'https://www.aftdc.com/businessapp/Article/registerCtt',
                }, function (res) {
                    if (res.data.res == 1){
                        var url = 'http://assets/headLineArticle.js';
                        var param = '';
                        event.toUrl({url: url, param: param});
                        navigator.pop({ animated: 'false' });
                    } else {
                        that.registerBut = true
                    }
                })
            }
        },
    }
</script>

<style scoped>
    .wrapper {
        flex-direction: column;
    }

    .minibar {
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #f1f1f1;
    }

    .body{
    }

    .detail{
        margin-top: 30px;
    }

    .tiele{
        text-align: center;
        font-weight: bold;
    }
    .but{
        width: 750px;
        position: fixed;
        bottom: 10px;
        left: 0;
        align-items: center;
    }

</style>
