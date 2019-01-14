<template>
    <div>
        <scroller style="flex: 1;width: 750px;">

            <div class="tabbar">
                <div class="tab active" :style="{ left: activeTab * 375 + 'px'}"></div>
                <div v-for="(tab, i) in tabs" :key="i" class="tab" @click="activeTab = i">
                    <text class="title" :style="{fontSize:GLOBAL.biggerFS,color:activeTab == i ?GLOBAL.tColor:GLOBAL.dColor}">{{tab.title}}</text>
                </div>
            </div>
            <div class="tab-panels" :style="{ left: activeTab * -750 + 'px'}">

                <div class="panel">
                    <div class="from">
                        <input class="input" :style="GLOBAL.inputText" type="number" placeholder="手机号" @input="phone" ref="phoneTast">
                        <div class="yzmBox">
                            <input class="yzmInput" :style="GLOBAL.inputText" type="number" placeholder="验证码" @input="yzm">
                            <button class="yzmBut" v-if="count==60" @click="getYzm">
                                <text class="getYzm" :style="{fontSize:GLOBAL.bigFS,color:'#fff'}">获取验证码</text>
                            </button>
                            <button class="countdown" v-else>
                                <text class="countdownYzm" :style="{fontSize:GLOBAL.bigFS,color:'#999'}">{{count}} s</text>
                            </button>
                        </div>
                        <div class="forget">
                            <text class="enter" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}" @click="enter">商家入驻</text>
                            <text class="forgetText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}" @click="forgetPw()">忘记密码？</text>
                        </div>
                        <button @click="login_phone()" class="loginBut">
                            <text class="login" :style="{fontSize:GLOBAL.bigFS,color:'#fff'}">登陆</text>
                        </button>
                    </div>
                </div>

                <div class="panel">
                    <div class="from">
                        <input class="input" :style="GLOBAL.inputText" type="text" placeholder="账号" @input="loginName" ref="passTast">
                        <input class="input" :style="GLOBAL.inputText" type="password" placeholder="密码" @input="pw" ref="passTastTwo">
                        <div class="forget">
                            <text class="enter" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}"  @click="enter">商家入驻</text>
                            <text class="forgetText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}" @click="forgetPw">忘记密码？</text>
                        </div>
                        <button @click="login_name()" class="loginBut">
                            <text class="login" :style="{fontSize:GLOBAL.bigFS,color:'#fff'}">登陆</text>
                        </button>
                    </div>
                </div>

            </div>
            <toast ref="toast"></toast>
        </scroller>

    </div>
</template>

<script>
    import Toast from './Toast.vue';
    const modal = weex.requireModule('modal');
    const post = weex.requireModule('stream');
    const navigator = weex.requireModule('navigator');
    const event = weex.requireModule('event');
    export default {
        components:{Toast},
        data() {
            return {
                isShow: true,
                activeTab: 0,
                count: 60,
                getOnce: true,
                loginOnce: true,
                tabs: [{
                    title: '手机验证码登陆'
                }, {
                    title: '账号密码登陆'
                }],
                name: '',
                pwd: '',
                Phone: '',
                Yzm: ''
            }
        },
        created() {

        },
        methods: {
            login_name() {
                this.$refs.passTast.blur();
                this.$refs.passTastTwo.blur();
                var that = this;
                var name = that.name;
                var password = that.pwd;
                if (!name || !password) {
                    const toast= that.$refs.toast;
                    toast.editContent('填写完整')
                    return false
                }

                if (that.loginOnce) {
                    that.loginOnce = false
                } else {
                    return false
                }
                if (event.find('imei')) {
                    var formData = 'name=' + name + '&&' + 'password=' + password + '&&' + 'imei=' + event.find('imei');
                    event.showLoading();post.fetch({
                        method: 'post',
                        type: 'json',
                        body: formData,
                        url: 'https://www.aftdc.com/businessapp/Login/login_number',
                        headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    }, function (res) {event.hidLoading();
                        that.loginOnce = true

                        if (res.data.res == 1) {
                            event.registerPush();
                            event.save('businessToken', res.data.token);
                            event.save('shopId', res.data.shopId);
                            event.save('shopName', res.data.shopName);
                            event.save('storeConfig', res.data.storeConfig);
                            event.save('shopImg', res.data.shopImg);
                            event.save('acticleAccount', res.data.acticleAccount);
                            if (res.data.storeConfig == 0)
                                var url = 'http://assets/storeConfiguration.js';
                            else
                                var url = 'http://assets/index.js';

                            var param = '';
                            event.toUrl({url: url, param: param});
                            navigator.pop({animated: 'false'});
                        } else {
                            modal.toast({'message': res.data.info, 'duration': 1});
                        }
                    })
                }
            },
            enter() {
                var url = 'http://assets/entry.js';
                var param = '';
                event.toUrl({url: url, param: param});
            },
            forgetPw() {
                var url = 'http://assets/forgetPw.js';
                var param = '';
                event.toUrl({url: url, param: param});
            },
            login_phone() {
                var that = this;
                var phone = that.Phone;
                var code = that.Yzm;
                if (!phone || !code) {
                    const toast= that.$refs.toast;
                    toast.editContent('填写完整')
                    return false
                }

                if (that.loginOnce) {
                    that.loginOnce = false
                } else {
                    return false
                }
                if (event.find('imei')) {
                    var formData = 'phone=' + phone + '&&' + 'code=' + code + '&&' + 'imei=' + event.find('imei');
                    event.showLoading();post.fetch({
                        method: 'post',
                        type: 'json',
                        body: formData,
                        url: 'https://www.aftdc.com/businessapp/Login/login_phone',
                        headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    }, function (res) {event.hidLoading();
                        that.loginOnce = true

                        if (res.data.res == 1) {
                            event.registerPush();
                            event.save('businessToken', res.data.token);
                            event.save('shopId', res.data.shopId);
                            event.save('shopName', res.data.shopName);
                            event.save('storeConfig', res.data.storeConfig);
                            event.save('shopImg', res.data.shopImg);
                            event.save('acticleAccount', res.data.acticleAccount);
                            if (res.data.storeConfig == 0)
                                var url = 'http://assets/storeConfiguration.js';
                            else
                                var url = 'http://assets/index.js';

                            var param = '';
                            event.toUrl({url: url, param: param});
                            navigator.pop({animated: 'false'});
                        } else {
                            modal.toast({'message': res.data.info, 'duration': 1});
                        }
                    })
                }
            },

            loginName(event) {
                var that = this;
                that.name = event.value;
            },
            pw(event) {
                var that = this;
                that.pwd = event.value;
            },
            phone(event) {
                var that = this;
                that.Phone = event.value;
            },
            yzm(event) {
                var that = this;
                that.Yzm = event.value;
            },
            getYzm() {
                this.$refs.phoneTast.blur();
                if (this.getOnce) {
                    //防止多少次点击
                    this.getOnce = false;
                    var that = this;
                    var phone = that.Phone;
                    var parttern = /^1[3|4|5|7|8][0-9]\d{8}$/;
                    if (!parttern.test(phone)) {
                        const toast= that.$refs.toast;
                        toast.editContent('手机号码错误')
                        this.getOnce = true;
                        return false
                    }
                    var formData = 'phone=' + phone;

                    this.cd = setInterval(() => that.countdown(), 1000);
                    event.showLoading();post.fetch({
                        method: 'post',
                        type: 'json',
                        body: formData,
                        url: 'https://www.aftdc.com/businessapp/Login/yzm',
                        headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    }, function (res) {event.hidLoading();
                        that.loginOnce = true
                        if (res.data.res != 1) {
                            modal.toast({message: res.data.info, duration: 2});
                        }
                    })
                }
            },
            //倒计时
            countdown() {
                if (this.count > 0) {
                    this.count--;
                } else {
                    clearInterval(this.cd);
                    this.count = 60;
                    this.getOnce = true;
                }
            }
        }
    }
</script>

<style scoped>
    .tabbar {
        flex-direction: row;
        background-color: #fff;
    }

    .tab {
        height: 100px;
        width: 375px;
        justify-content: center;
        align-items: center;
    }

    .active {
        position: absolute;
        left: 0;
        bottom: 0;
        height: 4px;
        background-color: #53beb7;
        transition: left 0.2s ease-in-out;
    }

    .icon {
        width: 45px;
        height: 45px;
    }

    .title {
        margin-top: 10px;
    }

    .chooseTitle {
        color: #53beb7;
    }

    .tab-panels {
        position: relative;
        width: 1500px;
        flex: 1;
        flex-direction: row;
        align-items: stretch;
        transition: left 0.3s ease-in-out;
    }

    .panel {
        background-color: #f8f8f8;
        width: 750px;
        align-items: center;
    }

    .input {
        width: 650px;
        margin-top: 40px;
        height: 80px;
        line-height: 80px;
    }

    .forget {
        margin-top: 20px;
        padding-top: 20px;
        padding-bottom: 20px;
        width: 650px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .enter {
        text-align: left;
    }

    .forgetText {
        text-align: right;
    }

    .loginBut {
        background-color: #53beb7;
        margin-top: 20px;
        padding-top: 25px;
        padding-bottom: 25px;
        border-radius: 12px;
    }

    .login {
        width: 650px;
        text-align: center;
    }

    .yzmBox {
        width: 650px;
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .yzmInput {
        flex: 3;
        margin-top: 40px;
        height: 80px;
        line-height: 80px;
    }

    .yzmBut {
        margin-left: 15px;
        flex: 2;
        background-color: #53beb7;
        margin-top: 40px;
        font-size: 40px;
        border-radius: 12px;
        height: 80px;
        line-height: 80px;
    }

    .countdown {
        margin-left: 15px;
        flex: 2;
        background-color: #dedede;
        margin-top: 40px;
        font-size: 40px;
        border-radius: 12px;
        height: 80px;
    }

    .countdownYzm {
        text-align: center;
        line-height: 80px;
    }

    .getYzm {
        text-align: center;
        line-height: 80px;
    }

    .loading {
        width: 750px;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: #999;
        opacity: 0.5;
    }

    .loadingBack {
        width: 750px;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .loadingImg {
        width: 150px;
        height: 110px;
    }
</style>
