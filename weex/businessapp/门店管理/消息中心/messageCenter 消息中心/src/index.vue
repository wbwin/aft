<template>
    <div>
        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    v-once
            >
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">消息中心</text>
                <!--<text :style="GLOBAL.headerRight"  slot="right">帮助</text>-->
            </wxc-minibar>
        </div>
        <!--<div class="scroller_content">-->

            <div class="message_top">
                <div class="title_left" @click="toggle=0" :class="[toggle===0?'active':'']">
                    <text  :style="{fontSize:GLOBAL.bigFS,color:toggle===0?'#fff':GLOBAL.tColor,textAlign:'center'}" >个人消息</text>
                </div>
                <div class="title_center" @click="toggle=1" :class="[toggle===1?'active':'']">
                    <text  :style="{fontSize:GLOBAL.bigFS,color:toggle===1?'#fff':GLOBAL.tColor,textAlign:'center'}" >业务消息</text>
                </div>
                <div class="title_right" @click="toggle=2" :class="[toggle===2?'active':'']">
                    <text :style="{fontSize:GLOBAL.bigFS,color:toggle===2?'#fff':GLOBAL.tColor,textAlign:'center'}" >系统消息</text>
                </div>
            </div>
            <!--*********个人消息*******-->
            <slider class="slider" infinite="false" :index="toggle" @change="change">
            <scroller class="inform" >
                <div v-if="selfMessage">
                <div class="inform_content" v-for="(item,index) in selfMessage">
                    <div class="content_title">
                        <text :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">通知</text>
                    </div>
                    <div class="content_content">
                        <text class="content_text" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.content}}</text>
                    </div>
                    <div class="content_time">
                        <text  :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">{{item.createTime}}</text>
                    </div>
                </div>
                </div>
                <div class="message_not" v-else>
                    <image class="img_default" src="https://image.aftdc.com/appBimg/icon_no_order.png"></image>
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">暂无消息</text>
                </div>
                <loading class="loading" @loading="onloading" :display="loadinging ? 'show' : 'hide'">
                    <text class="indicator-text">Loading ...</text>
                    <loading-indicator class="indicator"></loading-indicator>
                </loading>
            </scroller>
            <!--*********个人消息*******-->
            <!--*********业务消息*******-->
            <scroller class="inform" >
                <div v-if="businessMessage.length>0">
                    <div class="inform_content" v-for="(item,index) in businessMessage">
                        <div class="content_title">
                            <text :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">通知</text>
                        </div>
                        <div class="content_content">
                            <text class=" content_text" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.title}}</text>
                        </div>
                        <div class="content_time">
                            <text  :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">{{item.createTime}}</text>
                        </div>
                    </div>
                </div>
                <div class="message_not" v-else>
                    <image class="img_default" src="https://image.aftdc.com/appBimg/icon_no_order.png"></image>
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">暂无消息</text>
                </div>
                <loading class="loading" @loading="onloading" :display="loadinging ? 'show' : 'hide'">
                    <text class="indicator-text">Loading ...</text>
                    <loading-indicator class="indicator"></loading-indicator>
                </loading>
            </scroller>
            <!--*********业务消息*******-->
            <!--*********系统消息*******-->
            <scroller class="inform" >
                <div v-if="systemMessage.length>0">
                    <div class="inform_content" v-for="(item,index) in systemMessage">
                        <div class="content_title">
                            <text :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">通知</text>
                        </div>
                        <div class="content_content">
                            <text class=" content_text" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.content}}</text>
                        </div>
                        <div class="content_time">
                            <text  :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">{{item.createTime}}</text>
                        </div>
                    </div>
                </div>
                <div class="message_not" v-else>
                    <image class="img_default" src="https://image.aftdc.com/appBimg/icon_no_order.png"></image>
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">暂无消息</text>
                </div>
                <loading class="loading" @loading="onloading" :display="loadinging ? 'show' : 'hide'">
                    <text class="indicator-text">Loading ...</text>
                    <loading-indicator class="indicator"></loading-indicator>
                </loading>
            </scroller>
            </slider>

            <!--*********系统消息*******-->
        <!--</div>-->
    </div>
</template>

<script>
    import {WxcMinibar, WxcButton} from 'weex-ui';
    const modal = weex.requireModule('modal')
    const post = weex.requireModule('stream');
    const navigator = weex.requireModule('navigator');
    export default {
        components: {WxcMinibar, WxcButton},
        data() {
            return {
                backImgToggle: 0,//头部返回图片判断
                toggle: 0,
                selfMessage: [],
                businessMessage: [],
                systemMessage: [],
                page:0,
                selfpage:'',
                businesspage:'',
                syspage:'',
                loadinging: false,
                num:'',
                self:'',
                token:'',
                imei:''
            }
        },
        created:function(){
            this.token = weex.config.token;
            this.imei = weex.config.imei;
            var that = this;
            var page = that.page;

            //获取token和sign
            var param = this.GLOBAL.sign(this.token,this.imei);

            param+= '&page='+page;
            post.fetch({
                method:'post',
                type:'json',
                body:param,
                url:'https://www.aftdc.com/businessapp/Enrol/rootmessage',
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
            },function(res){
                if(res.data.res === 1){
                    that.self = res.data.self;
                    that.selfMessage = that.selfMessage.concat(res.data.selfMessage);
                    // that.selfpage = res.data.selfMessage.length;
                    that.businessMessage = that.businessMessage.concat(res.data.businessMessage);
                    that.businesspage = res.data.businessMessage.length;
                    that.systemMessage = that.systemMessage.concat(res.data.systemMessage);
                    that.syspage = res.data.systemMessage.length;
                }
            })

        },
        methods: {
            onloading (event) {
                var that = this;
                var toggle = that.toggle;
                if(toggle === 0){
                    var page = that.self
                } else if (toggle === 1){
                    var page = that.businesspage
                } else if (toggle === 2){
                    var page = that.syspage
                }
                modal.toast({ message: 'Loading', duration: 1 });
                // if (that.num == toggle){
                //     modal.toast({ message: '已经是全部了', duration: 1 })
                //     return false
                // }

                //获取token和sign
                var param = this.GLOBAL.sign(this.token,this.imei);

                param+='&&page='+page+'&&'+'type='+toggle;
                post.fetch({
                    method:'post',
                    type:'json',
                    body:param,
                    url:'https://www.aftdc.com/businessapp/Enrol/pagemessage',
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                },function(res){
                    if (res.data.res === 1){
                        that.loadinging = true;
                            setTimeout(() => {
                                that.loadinging = false
                        }, 2000);
                        if(toggle === 0){
                            that.selfMessage = that.selfMessage.concat(res.data.data);
                            that.selfpage = res.data.data.length+that.selfpage;
                            that.self = res.data.self
                        } else if (toggle === 1){
                            that.businessMessage = that.businessMessage.concat(res.data.data);
                            that.businesspage = res.data.data.length+that.businesspage;
                        } else if (toggle === 2){
                            that.systemMessage = that.systemMessage.concat(res.data.data);
                            that.syspage = res.data.data.length+that.syspage;
                        }
                    } else {
                        that.num = toggle;
                    }
                })
            },
            //返回上一页
            backClick:function() {
                navigator.pop({ animated: 'true' });
            },
            change: function (event) {
                // console.log(event.index);
                this.toggle = event.index;
            },
        }
    }
</script>

<style scoped>
    .scroller_content {
       flex: 1;
    }

    .message_top {
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding-left: 30px;
        padding-right: 30px;
        padding-top: 20px;
        padding-bottom: 20px;
        border-bottom-width: 4px;
        border-bottom-style: solid;
        border-bottom-color: #f1f1f1;

    }

    /*****************/


    /***********************/


    .title_left {
        flex: 1;
        padding-top: 10px;
        padding-bottom: 10px;
        border-width: 2px;
        border-style: solid;
        border-color: #53beb7;

        border-collapse: collapse;
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;

    }

    .title_center {
        flex: 1;
        padding-top: 10px;
        padding-bottom: 10px;
        border-top-width: 2px;
        border-top-style: solid;
        border-top-color: #53beb7;
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #53beb7;
        border-collapse: collapse;

    }

    .title_right {
        flex: 1;
        padding-top: 10px;
        padding-bottom: 10px;
        border-width: 2px;
        border-style: solid;
        border-color: #53beb7;
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
        border-collapse: collapse;
    }

    .title_text {
        text-align: center;
        color: #53beb7;
    }

    .active {
        background-color: #53beb7;
        color: #fff;
    }

    .inform {
        flex-direction: column;
        position: absolute;
        top:0;
        bottom: 0;
        width: 750px;
    }

    .inform_content {
        flex-direction: column;
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #f1f1f1;
    }

    .content_title {
        margin-top: 30px;
        margin-left: 20px;
    }

    .content_content {
        margin-top: 30px;
        margin-left: 40px;

    }

    .content_text {
        width: 680px;
    }

    .content_time {
        margin-top: 30px;
        margin-left: 20px;
        margin-bottom: 30px;
    }



    .message_not {
        justify-content: center;
        align-items: center;
        flex-direction: column;
        margin-top: 310px;
    }

    .img_default {
        width: 200px;
        height: 200px;
        margin-bottom: 20px;
    }
    .slider {
        position: relative;
        width: 750px;
        flex: 1;
        background-color: #ffffff;
        transition: left 0.2s ease-in-out;
    }
    .loading {
        width: 750px;
        display: -ms-flex;
        display: -webkit-flex;
        display: flex;
        -ms-flex-align: center;
        -webkit-align-items: center;
        -webkit-box-align: center;
        align-items: center;
        position: fixed;
    }
    .indicator-text {
        text-align: center;
    }
    .indicator {
        margin-top: 16px;
        height: 40px;
        width: 40px;
        color: blue;
    }
</style>
