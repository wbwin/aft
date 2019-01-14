<template>
    <div class="wrapper">
        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="backClick"
                    v-once
            >
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">留言</text>
                <!--<text :style="GLOBAL.headerRight"  slot="right">帮助</text>-->
            </wxc-minibar>
        </div>
        <list class="scroller" offset-accuracy="10" @scroll="scrollHandler">
            <cell class="masks" v-for="(item,index) in liuyanData" @touchstart="ontouchstart(item.id,index)" @touchend="ontouchend(item.operateId)">
                <div>
                    <image class="touxiang" :src="item.userPhoto"></image>
                </div>
                <div class="right">
                    <div style="flex-direction: row;justify-content: space-between;align-items: center;width: 550px;">
                        <div>
                            <text class="userName" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.tColor}">{{item.userName}}</text>
                        </div>
                        <div>
                            <text :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">{{item.time}}</text>
                        </div>
                    </div>
                    <div>
                        <text class="action" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.content}}</text>
                        <text class="action" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">《{{item.title}}》</text>
                    </div>
                </div>
            </cell>
            <loading class="loading" @loading="onloading" :display="loadinging ? 'show' : 'hide'">
                <text class="indicator-text" :style="{fontSize:GLOBAL.bigFS,color:'#999'}">加载中</text>
            </loading>
        </list>

        <!-- 评论删除提示框 -->
        <wxc-mask height="322"
                  width="566"
                  border-radius="0"
                  duration="100"
                  mask-bg-color="#FFFFFF"
                  :has-animation="hasAnimation"
                  :has-overlay="true"
                  :show-close="false"
                  :show="show"
                  :overlay-cfg="overlay"
                  @wxcMaskSetHidden="wxcMaskSetHidden">
            <div class="mask" @click.stop="">
                <text class="maskTitle">提示</text>
                <text class="maskContent">确定删除此留言消息？</text>
                <div class="maskBtn row">
                    <text class="maskSure" @click="wxcMaskSetHidden">取消</text>
                    <text class="maskCancel" @click="commentDelect">确定</text>
                </div>
            </div>
        </wxc-mask>
        <toast ref="toast"></toast>

    </div>
</template>

<script>
    import {WxcMinibar, WxcButton,WxcMask} from 'weex-ui';
    import Toast from './Toast.vue';
    const navigator = weex.requireModule('navigator');
    const event = weex.requireModule('event');
    const post = weex.requireModule('stream');
    var timer = null;
    export default {
        components: {WxcMinibar, WxcButton,Toast,WxcMask},
        data() {
            return {
                backImgToggle: 0,//头部返回图片判断
                liuyanData: [],
                loadinging: false,
                loadingingType: 1,
                page: 0,
                type: 4,
                token:'',
                imei:'',
                // 评论删除弹出层
                show: false,
                overlayCanClose: true,
                isFalse: false,
                hasAnimation: true,
                overlay: {
                    duration: 100
                },
                delId: '',
                delIndex: ''
            }
        },
        created:function() {
            this.token = weex.config.token;
            this.imei = weex.config.imei;
            var param = this.GLOBAL.sign(this.token,this.imei);
            var that = this;
            var type = that.type;
            var page = that.page;
            param += '&type=' + type;
            param += '&page=' + page;
            console.log(param)
            post.fetch({
                method: 'POST',
                type: 'json',
                body: param,
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                url: 'https://www.aftdc.com/businessapp/Store/getMessageDetails',
            }, function (res) {
                if(res.data.res === 1) {
                    var liuyanData = res.data.data;
                    that.page += res.data.page;
                    if (liuyanData.length !== 10) {
                        that.loadingingType = 0;
                    }
                    that.liuyanData = that.liuyanData.concat(liuyanData);
                } else if(res.data.res === 0) {
                    that.loadingingType = 0;
                }
            });
        },
        methods:{
            //返回上一页
            backClick:function(){
                navigator.pop({ animated: 'true' });
            },
            //下拉刷新
            onloading (event) {
                clearTimeout(timer)//防止上拉刷新弹出删除层
                var that = this;
                const toast = that.$refs.toast
                that.loadinging = true;
                setTimeout(() => {
                    if (that.loadingingType) {
                        var page = that.page;
                        var type = that.type;

                        var param = this.GLOBAL.sign(this.token,this.imei);
                        param += '&page=' + page;
                        param += '&type=' + type;

                        post.fetch({
                            method: 'POST',
                            type: 'json',
                            body: param,
                            headers: { "Content-Type": "application/x-www-form-urlencoded" },
                            url: 'https://www.aftdc.com/businessapp/Store/getMessageDetails',
                        }, function (res) {
                            if(res.data.res === 1) {
                                var liuyanData = res.data.data;
                                that.page += res.data.page;
                                if (liuyanData.length !== 10) {
                                    that.loadingingType = 0;
                                }
                                that.liuyanData = that.liuyanData.concat(liuyanData);
                            } else if(res.data.res === 0) {
                                that.loadingingType = 0;
                            }
                        });
                    } else {
                        toast.editContent("亲，没有更多了哦");
                    }
                    that.loadinging = false
                }, 1900);
            },
            //长按删除
            ontouchstart(id,index){
                clearTimeout(timer)
                var that = this
                timer = setTimeout(function(){
                    that.show = true
                    that.delId = id
                    that.delIndex = index
                },1000)
            },
            //长按删除
            ontouchend(operateId){
                var that=this
                clearTimeout(timer)
                if(!that.show){
                    var param={operateId:operateId}
                    var url='http://assets/detailsOfNotification.js'
                    event.toUrl({"url":url,"param":JSON.stringify(param)})
                }

            },
            //防止上下滚动弹出删除层
            scrollHandler(){
                clearTimeout(timer)
            },
            //取消删除弹出层
            wxcMaskSetHidden () {
                this.show = false;
            },
            //确认删除留言消息
            commentDelect(){
                this.show = false;
                const toast = this.$refs.toast
                var param = this.GLOBAL.sign(this.token,this.imei);
                param += '&type=' + this.type;
                param += '&id=' + this.delId;
                var that = this;
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded"},
                    url: 'https://www.aftdc.com/businessapp/Store/delMessage',
                }, function (res) {
                    if(res.data.res === 1) {
                        that.liuyanData.splice(that.delIndex,1)
                        toast.editContent(res.data.info);
                    } else {
                        toast.editContent(res.data.info);
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .scroller {
        padding-left: 20px;
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
        background-color: #fff;
    }
    .indicator-text {
        color: #888888;
        font-size: 30px;
        text-align: center;
    }
    .indicator {
        margin-top: 16px;
        height: 40px;
        width: 40px;
        color: blue;
    }
    .wrapper {
        flex-direction: column;
    }



    /***********************/

    .masks:active {
        background-color: #f8f8f8;
    }

    .masks {
        flex-direction: row;
        align-items: center;
        padding-top: 20px;
        padding-bottom: 20px;
        border-bottom-color: rgba(153, 153, 153, 0.2);
        border-bottom-style:solid ;
        border-bottom-width: 1px;
    }

    .touxiang {
        width: 120px;
        height: 120px;
        border-radius: 60px;
    }

    .userName {
        width: 380px;
        lines:1;
        text-overflow: ellipsis;
        padding-left: 20px;
    }

    .right {
        width: 590px;
        /*border-bottom-color: rgba(153, 153, 153, 0.2);*/
        /*border-bottom-style: solid;*/
        /*border-bottom-width: 1px;;*/
        margin-left: 20px;
        padding-bottom: 20px;
        padding-top: 20px;
    }

    .action {
        padding-left: 20px;
        padding-top: 10px;
        width: 380px;
        lines:1;
        text-overflow: ellipsis;
    }

    .dateTime {
        font-size: 30px;
        color: #999;
    }
    /* 删除评论提示层 */
    .mask {
        flex: 1;
        position: relative;
        padding-top: 46px;
        /*padding-left: 50px;*/
    }
    .maskTitle {
        font-size: 36px;
        color: #181818;
        margin-left: 50px;
    }
    .maskContent {
        width: 440px;
        color: #898989;
        padding-top: 40px;
        font-size: 32px;
        margin-left: 50px;
    }
    .maskBtn {
        width: 566px;
        height: 90px;
        position: absolute;
        /*right: 40px;*/
        /*bottom: 38px;*/
        bottom: 0px;
        flex-direction: row;
    }
    .maskSure {
        text-align: center;
        line-height: 90px;
        flex: 1;
        color: #757575;
        /*margin-right: 56px;*/
        font-size: 32px;
        border-top-width: 1px;
        border-top-style: solid;
        border-top-color: #e7e7e7;
    }
    .maskCancel {
        text-align: center;
        line-height: 90px;
        flex: 1;
        color: #53beb7;
        font-size: 32px;
        border-top-width: 1px;
        border-top-style: solid;
        border-top-color: #e7e7e7;
        border-left-width: 1px;
        border-left-style: solid;
        border-left-color: #e7e7e7;
    }

</style>
