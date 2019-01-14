<template>
    <div @viewappear="viewappear" @viewdisappear="viewdisappear">
        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    v-once
            >
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">私信</text>
            </wxc-minibar>
        </div>

        <div class="tab-panels">
            <!--最近联系-->
            <scroller class="content" offset-accuracy="10" @scroll="scrollHandler">
                <div  v-for="(item,index) in zuijinlianxi">
                    <div class="carrier" @click="chat(index)"  @touchstart="ontouchstart(item.aId,index)" @touchend="ontouchend">
                        <div>
                            <image class="portrait" :src="item.userPhoto"></image>
                        </div>
                        <div>
                            <div class="titles">
                                <text class="label" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">{{item.userName}}</text>
                                <text class="time" :style="{fontSize:GLOBAL.bigFS}">{{item.timestamp}}</text>
                            </div>
                            <div style="margin-top: 5px;margin-left: 20px;">
                                <text class="last" :style="{fontSize:GLOBAL.bigFS}">{{item.content}}</text>
                                <div class="noread" v-if="item.noreadNum!=0"><text class="noreadNum">{{item.noreadNum}}</text></div>
                            </div>
                        </div>
                    </div>
                </div>
            </scroller>
        </div>

        <!-- 评论删除提示框 -->
        <wxc-mask height="322"
                  width="566"
                  border-radius="0"
                  duration="100"
                  mask-bg-color="#FFFFFF"
                  :has-animation="true"
                  :has-overlay="true"
                  :show-close="false"
                  :show="show"
                  :overlay-can-close="false"
                  @wxcMaskSetHidden="wxcMaskSetHidden">
            <div class="mask" @click.stop="">
                <text class="maskTitle">提示</text>
                <text class="maskContent">确定删除此最近联系消息?</text>
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
    import { WxcMinibar,WxcMask} from 'weex-ui';
    import Toast from './Toast.vue';
    const event = weex.requireModule('event');
    const post = weex.requireModule('stream');
    const navigator = weex.requireModule('navigator');
    var timer = null;
    export default {
        components: {WxcMinibar,Toast,WxcMask},
        data() {
            return {
                type: 8,
                barIndex:0,
                longPress: false,//是否正在长按
                zuijinlianxi:[],//最近联系列表

                // 评论删除弹出层
                show: false,
                delId: '',
                delIndex: '',
                token:'',
                imei:'',
            }
        },
        created: function () {
            this.token = weex.config.token;
            this.imei = weex.config.imei;

            this.contact();
            var that = this;
            event.init();
            weex.requireModule('globalEvent').addEventListener("newChat",function(e){
                that.upDataChat(e)
            });
        },
        methods: {

            minibarLeftButtonClick:function(){
                navigator.pop({ animated: 'true' });
            },

            contact:function(){
                var that = this
                var param = this.GLOBAL.sign(this.token,this.imei);
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    url: 'https://www.aftdc.com/businessapp/Membership/contact',
                }, function (res) {
                    if (res.data.res == 1) {
                        that.zuijinlianxi = that.zuijinlianxi.concat(res.data.data)
                        console.log(JSON.stringify(that.zuijinlianxi));
                        console.log(event.find(event.find('acticleAccount')+'ChatData'));
                    }
                })
            },

            chat:function (index) {
                if(this.longPress === false) {
                    this.zuijinlianxi[index].noreadNum = 0;
                    var aId = this.zuijinlianxi[index].aId;
                    var userName = this.zuijinlianxi[index].userName;
                    var userPhoto = this.zuijinlianxi[index].userPhoto;
                    var param = {aId: aId, userName: userName, userPhoto: userPhoto};
                    var url = 'http://assets/chat.js';
                    event.toUrl({url: url, param: JSON.stringify(param)});
                }
            },

            //监听页面返回
            viewdisappear() {
                let self = this;
                self.pageBack = true;
            },
            viewappear() {
                let self = this;
                if (!self.pageBack) { return; }
                self.pageBack = false;
                this.reView();
                event.init();
            },

            //更新商家对该用户的聊天记录
            upDataChat(e){
                var chatData = JSON.parse(e.data);
                chatData.from = 'bot';
                chatData.read = 0;

                var date = new Date();
                var timestamp = chatData.timestamp;
                date.setTime(timestamp * 1000);
                chatData.timestamp = date.getMonth()+1 +"月" + date.getDate()+"日";

                var zj = this.zuijinlianxi;
                console.log(JSON.stringify(zj))
                if (zj) {
                    var mark = 0;
                    for (var i = 0; i<zj.length; i++){
                        if (zj[i].aId == chatData.aId){
                            console.log(zj[i].noreadNum)
                            mark = 1;
                            chatData.noreadNum = zj[i].noreadNum+1;
                            zj.splice(i,1);
                            zj.unshift(chatData);
                            this.zuijinlianxi = zj;
                            this.$set(this.zuijinlianxi,zj);
                            break;
                        }
                    }
                    if (mark == 0){
                        chatData.noreadNum = 1;
                        zj.unshift(chatData);
                        this.zuijinlianxi = zj;
                        this.$set(this.zuijinlianxi,zj);
                    }
                }else{
                    this.zuijinlianxi = [];
                    chatData.noreadNum = 1;
                    this.zuijinlianxi.push(chatData);
                    this.$set(this.zuijinlianxi,0,chatData);
                }
            },

            //更新显示
            reView(newData){
                var shopChatData = event.find(event.find('acticleAccount')+'ChatData');
                if (shopChatData) {
                    shopChatData = JSON.parse(shopChatData);
                    if (newData) {
                        for (var i=0; i<newData.length; i++){
                            for (var s in shopChatData){
                                if (newData[i]['name'] == s){
                                    for (var y=0; y<shopChatData[s]['data'].length;y++){
                                        if (shopChatData[s]['data'][y].read == 0 && shopChatData[s]['data'][y].from=='bot'){
                                            shopChatData[s]['data'].slice(y,1)
                                        }
                                    }
                                    shopChatData[s]['data'].concat(newData[i]['data']);
                                    shopChatData[s]['data'].sort(function (a,b) {
                                        return a.timestamp - b.timestamp
                                    })
                                    newData.splice(i,1);
                                }
                            }
                        }
                        if (newData){
                            for (var i=0;i<newData.length;i++) {
                                shopChatData[newData[i]['name']]={}
                                shopChatData[newData[i]['name']]['data'] = newData[i]['data']
                                shopChatData[newData[i]['name']]['userName'] = newData[i]['data'][0]['userName']
                                shopChatData[newData[i]['name']]['aId'] = newData[i]['data'][0]['aId']
                                shopChatData[newData[i]['name']]['userPhoto'] = newData[i]['data'][0]['userPhoto']
                                shopChatData[newData[i]['name']]['data'].sort(function (a,b) {
                                    return a.timestamp - b.timestamp
                                })
                            }
                        }
                    }
                }else{
                    var shopChatData = {};
                    if (newData){
                        for (var i=0;i<newData.length;i++) {
                            shopChatData[newData[i]['name']]={}
                            shopChatData[newData[i]['name']]['data'] = newData[i]['data']
                            shopChatData[newData[i]['name']]['userName'] = newData[i]['data'][0]['userName']
                            shopChatData[newData[i]['name']]['aId'] = newData[i]['data'][0]['aId']
                            shopChatData[newData[i]['name']]['userPhoto'] = newData[i]['data'][0]['userPhoto']
                            shopChatData[newData[i]['name']]['data'].sort(function (a,b) {
                                return a.timestamp - b.timestamp
                            })
                        }
                    }
                }
                event.save(event.find('acticleAccount')+'ChatData',JSON.stringify(shopChatData));

                var zuijinlianxi = [];
                var index = 0;
                var date = new Date();

                if (shopChatData!=={}){
                    for (var i in shopChatData) {
                        var userChatData = shopChatData[i]['data'];
                        zuijinlianxi[index] = userChatData[userChatData.length - 1];

                        zuijinlianxi[index].userName = shopChatData[i]['userName'];
                        zuijinlianxi[index].userPhoto = shopChatData[i]['userPhoto'];
                        zuijinlianxi[index].aId = shopChatData[i]['aId'];
                        zuijinlianxi[index].noreadNum = 0;
                        for (var s=0;s<userChatData.length;s++){
                            if (userChatData[s].read == 0 && userChatData[s].from == 'bot'){
                                zuijinlianxi[index].noreadNum +=1
                            }
                        }
                        index++;
                    }
                    zuijinlianxi.sort(function (a,b) {
                        return b.timestamp - a.timestamp
                    });
                    for (var i=0; i<zuijinlianxi.length;i++){
                        var timestamp = zuijinlianxi[i].timestamp;
                        date.setTime(timestamp * 1000);
                        zuijinlianxi[i].timestamp = date.getMonth()+1 +"月" + date.getDate()+"日"
                    }
                }
                console.log(JSON.stringify(zuijinlianxi))
                this.zuijinlianxi = zuijinlianxi
            },
            //长按删除
            ontouchstart(id,index){
                clearTimeout(timer)
                var that = this
                timer = setTimeout(function(){
                    that.show = true
                    that.delId = id
                    that.delIndex = index
                    that.longPress = true
                },600)
            },
            //长按删除
            ontouchend(){
                clearTimeout(timer)
                var that = this
                setTimeout(function(){
                    that.longPress = false
                },10)
            },
            //防止上下滚动弹出删除层
            scrollHandler(){
                clearTimeout(timer)
            },
            //取消删除弹出层
            wxcMaskSetHidden () {
                this.show = false;
            },
            //确认删除最近联系消息
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
                }, function (e) {
                    if(e.data.res === 1) {
                        that.zuijinlianxi.splice(that.delIndex,1)
                        toast.editContent(e.data.info);
                    } else {
                        toast.editContent(e.data.info);
                    }
                });
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
    .tabbar {
        display: flex;
        flex-direction: row;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        border-top-width: 1px;
        border-top-color: #d9d9d9;
        background-color: #fafafa;
        height: 120px;
    }

    .tab {
        height: 120px;
        flex: 1;
        justify-content: center;
        align-items: center;
    }

    .active {
        position: absolute;
        top: 0;
        left: 0;
        background-color: #53beb7;
        transition: left 0.2s ease-in-out;
    }

    .icon {
        width: 45px;
        height: 45px;
    }

    .title {
        font-size: 28px;
        color: #999;
        margin-top: 10px;
    }

    .titleActive {
        font-size: 28px;
        color: #53beb7;
        margin-top: 10px;
    }

    .tab-panels{
        width: 750px;
        position: absolute;
        top: 90px;
        bottom: 0;
        background-color: #F5F5F5;
    }

    .portrait {
        width: 90px;
        height: 90px;
        border-radius: 50px;
    }

    .content {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 750px;
        background-color: #ffffff;
    }

    .carrier {
        width: 750px;
        padding-top: 20px;
        padding-left: 20px;
        padding-right: 20px;
        padding-bottom: 20px;
        border-bottom-width: 1px;
        border-bottom-color: rgba(204, 204, 204, 0.5);
        border-bottom-style: solid;
        flex-direction: row;
    }

    .carrier:active {
        background-color: #F8F8F8;
        /*background-color: rgba(153, 153, 153, 0.51);*/
    }

    .titles {
        height: 50px;
        padding-left: 20px;
        flex-direction: row;
        align-items: center;
    }

    .label {
        width: 500px;
        lines: 1;
    }

    .time {
        text-align: right;
        color: #999;
    }

    .last {
        width: 580px;
        lines: 1;
        color: #999;
    }
    .noread{
        position: absolute;
        right: 0;
        bottom: 0;
        height: 30px;
        width: 30px;
        border-radius: 15px;
        background-color: #FF0000;
    }

    .noreadNum{
        color: #fff;
        font-size: 20px;
        text-align: center;
        line-height: 30px;
    }

    .minibar {

    }
    /*****************/

    .backImg {
        width: 40px;
        height: 40px;
    }

    .loading{
        width: 750px;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: #fff;
        z-index: 998;
    }

    .noArticleText{
        text-align: center;
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

    .row{
        flex-direction: row;
        align-items: center;
    }
</style>
