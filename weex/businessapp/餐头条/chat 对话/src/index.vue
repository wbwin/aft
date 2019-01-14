<template>
    <div class="wrapper"  @viewappear="viewappear" @viewdisappear="viewdisappear">

        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    v-once
            >
                <image :style="GLOBAL.headerImg"  slot="left" src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">{{userName}}</text>
            </wxc-minibar>
        </div>

        <list class="chat-list">
            <refresh class="refresh" @refresh="onrefresh" :display="refreshing ? 'show' : 'hide'">
                <!--<text class="indicator-text">Refreshing ...</text>-->
                <!--<loading-indicator class="indicator"></loading-indicator>-->
                <image class="loadingImg" src="https://image.aftdc.com/appBimg/ic_loading_gif.gif"></image>
            </refresh>
            <cell style="height:40px"></cell>
            <cell class="chat-cell" v-for="(message, m) in chatMessages" :key="m">
                <div :class="['message', `message-${message.from}`]" >
                    <image class="chat-icon" resize="cover" v-if="message.from === 'bot'" :src="message.userPhoto"></image>

                    <div :class="['message-box-state',message.read===1?'bColor':'']" v-if="message.from === 'user'">
                        <text class="message-state"  :style="{color:GLOBAL.tColor}" v-if="message.read === 1">已读</text>
                        <text class="message-state-noread" :style="{color:GLOBAL.dColor}" v-else>送达</text>
                    </div>

                    <div :class="['message-box', `message-box-${message.from}`]" @longpress="copy(m)" ref="messages" v-if="message.content">
                        <text class="message-text" :style="{color:GLOBAL.dColor,fontSize:GLOBAL.defaultFS}">{{message.content}}</text>
                    </div>
                    <div class="message-box" ref="messages" v-else>
                        <image class="message-img" @load="resize(m,$event)" :style="{ width:message.width, height:message.height }"  :src="'https://image.aftdc.com/'+message.img"></image>
                    </div>
                </div>
                <div class="chat-spliter" v-if="message.reset"></div>
            </cell>
            <cell style="height:50px"></cell>
        </list>

        <div class="operations">
            <div class="input-bar">
                <input class="input" type="text" @focus="inputs" v-model="userInput" ref="input1" :style="{fontSize:GLOBAL.bigFS}"/>
                <div class="btn-send" @click="handleUserInput" v-if="userInput">
                    <text class="btn-send-text" :style="{fontSize:GLOBAL.defaultFS}">发送</text>
                </div>
                <div class="btn-seletc" @click="seletcBox" v-else>
                    <img class="addImg" src="https://image.aftdc.com/appBimg/add.png">
                </div>
            </div>
        </div>
        <div class="chooseSend" v-if="chooseSends">
            <div class="chooseSendBlock" v-for="(i,index) in chooseList" @click="chooseS(index)">
                <image class="chooseSendImg" :src="i.img"></image>
                <text class="chooseSendText" :style="{color:GLOBAL.bigFS}">{{i.text}}</text>
            </div>
        </div>
        <toast ref="toast"></toast>
    </div>
</template>

<script>
    import { WxcMinibar} from 'weex-ui';
    import Toast from './Toast.vue';
    const dom = weex.requireModule('dom');
    const event = weex.requireModule('event');
    const post = weex.requireModule('stream');
    const navigator = weex.requireModule('navigator');
    const clipboard = weex.requireModule('clipboard');
    export default {
        components: {WxcMinibar,Toast},
        data () {
            return {
                chooseList:[
                    {
                        img:'https://image.aftdc.com/appBimg/chooseImg.png',
                        text:'图片'
                    },
                    {
                        img:'',
                        text:''
                    },
                    {
                        img:'',
                        text:''
                    },
                    {
                        img:'',
                        text:''
                    }
                ],
                chooseSends:false,
                userInput: '',
                chatMessages: [],
                page:8,
                pageBack:false,
                refreshing:false,
                userName:''
            }
        },
        created () {
            var that = this;
            event.init();
            weex.requireModule('globalEvent').addEventListener("upLoadFile",function(e){
                if (e.upLoad == 1)
                    that.upLoadSecceed(e)
            });
            weex.requireModule('globalEvent').addEventListener("newChat",function(e){
                that.addNewchat(e)
            });

            this.token = weex.config.token;
            this.imei = weex.config.imei;
            this.aId = JSON.parse(weex.config.param).aId;
            this.userName = JSON.parse(weex.config.param).userName;
            this.userPhoto = JSON.parse(weex.config.param).userPhoto;

            var chatData = event.find(event.find('acticleAccount')+'ChatData');
            if (chatData) {
                var chatDatas = JSON.parse(chatData)['bot'+this.aId]['data'];
                 // console.log(JSON.stringify(chatDatas))
                var mark = 0
                for (var i = 0;i<chatDatas.length; i++) {
                    if (chatDatas[i].read == 0&&chatDatas[i].from == 'bot') {
                    //    网络请求标记为已读
                        chatDatas[i].read = 1
                        mark++;
                    }
                }
                if (mark>0){
                    this.isRead(this.aId)
                    var shopChatData = JSON.parse(chatData)
                    shopChatData['bot'+this.aId]['data'] = chatDatas;
                    var param = JSON.stringify(shopChatData);
                    event.save(event.find('acticleAccount')+'ChatData',param);
                }

                if (chatDatas) {
                    this.chatMessages = chatDatas.slice(-this.page);
                    this.imgReturn();
                    this.page = this.page + 8
                    setTimeout(() => {
                        this.scrollToBottom()
                    }, 500);
                }
            }
        },
        methods: {
            onrefresh:function() {
                this.refreshing = true
                setTimeout(() => {
                    this.refreshing = false
                }, 500);
                var chatData = event.find(event.find('acticleAccount')+'ChatData');
                if (chatData) {
                    var chatDatas = JSON.parse(chatData)['bot'+this.aId]['data'];
                    if (chatDatas) {
                        this.chatMessages = chatDatas.slice(-this.page);
                        this.page = this.page + 8
                    }
                }
            },
            minibarLeftButtonClick(){},
            //图片大小
            imgReturn(){
                var chatMessages = this.chatMessages
                if (chatMessages) {
                    for (var i in chatMessages) {
                        if (!chatMessages[i].width) {
                            chatMessages[i].width = '400px'
                            chatMessages[i].height = '400px'
                        }
                    }
                    this.chatMessages = chatMessages
                }
            },
            //重置图片大小
            resize (i,event) {
                if (event.success) {
                    var ratio = event.size.naturalHeight / event.size.naturalWidth
                    var width = 400
                    var height = width * ratio
                    this.$set(this.chatMessages[i],'width',width + 'px')
                    this.$set(this.chatMessages[i],'height',height + 'px')
                }
            },
            //标记为已读
            isRead(aId){
                var param = this.GLOBAL.sign(this.token,this.imei);
                param += '&aId='+ aId;
                var that = this;
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/businessapp/Membership/isRead',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                }, function (e) {
                    if (e.data.res == 1)
                        console.log("updatasecceed")
                    else
                        console.log("Failure")
                });
            },
            inputs(){
                this.chooseSends = false
                this.scrollToBottom()
            },
            //获取用户输入，点击发送后清空输入框
            handleUserInput () {
                if (this.userInput) {
                    var chatData = {
                        aId:this.aId,
                        content:this.userInput,
                        img:''
                    }
                    this.userInput = ''
                    this.sendUserMessage(chatData);
                }
            },
            //滑动到底部
            scrollToBottom () {
                if (!this.$refs.messages) {
                    return
                }
                const lastMessage = this.$refs.messages[this.$refs.messages.length - 1]
                setTimeout(() => {
                    dom.scrollToElement(lastMessage, {
                        offset: 0,
                        animated: true
                    })
                }, 0)
            },
            //发送
            sendUserMessage (chatData) {
                if (chatData) {

                    var param = this.GLOBAL.sign(this.token,this.imei);
                    param += '&chatData='+ JSON.stringify(chatData);
                    console.log(param)
                    var that = this;
                    post.fetch({
                        method: 'POST',
                        type: 'json',
                        body: param,
                        url: 'https://www.aftdc.com/businessapp/Membership/sendChat',
                        headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    }, function (res) {
                        if (res.data.res ===1){
                            chatData.from = 'user';
                            chatData.timestamp = Date.parse(new Date()) / 1000;
                            chatData.read = 0;
                            chatData.width = '400px';
                            chatData.height = '400px';
                            that.chatMessages.push(chatData);
                            that.upDataChat(that.chatMessages);
                        } else {
                            const toast = that.$refs.toast;
                            toast.editContent(res.data.info);
                        }
                    });
                }
            },
            copy: function (index) {
                var message = this.chatMessages[index].content
                const toast = this.$refs.toast;
                try {
                    clipboard.setString(message);
                    toast.editContent('已复制');
                } catch (e) {
                    toast.editContent('复制失败');
                }
            },
            seletcBox:function () {
                this.chooseSends=!this.chooseSends
                this.$refs['input1'].blur();
            },
            chooseS:function (index) {
                if (index===0){
                    event.chooseImg(0,0);
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
                if (event.find("localImg")) {
                    var localPart = event.find("localImg");
                    var houzui = localPart.substring(localPart.lastIndexOf("."), localPart.length)
                    var articleImg = 'shops/'+event.find('shopId')+'/chatImg/'+Date.parse(new Date())+ houzui;

                    this.uploadImg(articleImg,localPart);
                    event.delete("localImg");
                }
            },
            //上传图片
            uploadImg(articleImg,localPart){
                var param = this.GLOBAL.sign(this.token,this.imei);
                post.fetch({
                    method: 'post',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/businessapp/Goods/uploadOss',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                },function(res){
                    var waterMarkStr = '';
                    event.uploadImg(res.data.AccessKeyId,res.data.AccessKeySecret,res.data.SecurityToken,articleImg,localPart,waterMarkStr);
                })
            },
            //图片上传成功更新数据
            upLoadSecceed(e){
                var chatData = {
                    aId:this.aId,
                    content:'',
                    img:e.imageName,
                }
                this.sendUserMessage(chatData);
            },
            addNewchat(e){
                var chatData = JSON.parse(e.data);
                chatData.from = 'bot';
                chatData.read = 1;
                chatData.width = '400px';
                chatData.height = '400px';
                this.chatMessages.push(chatData);

                this.upDataChat(this.chatMessages)
            },
            //更新商家对该用户的聊天记录
            upDataChat(upData){
                var shopChatData = event.find(event.find('acticleAccount')+'ChatData');
                if (!shopChatData){
                    var shopChatData = "{}";
                }
                shopChatData = JSON.parse(shopChatData);
                if (!shopChatData['bot'+this.aId]) {
                    shopChatData['bot'+this.aId] = {}
                }
                shopChatData['bot'+this.aId]['data'] = upData;
                shopChatData['bot'+this.aId]['userName'] = this.userName;
                shopChatData['bot'+this.aId]['aId'] = this.aId;
                shopChatData['bot'+this.aId]['userPhoto'] = this.userPhoto;
                var param = JSON.stringify(shopChatData);
                event.save(event.find('acticleAccount')+'ChatData',param);
                setTimeout(() => {
                    this.scrollToBottom()
                }, 500);
            }
        }
    }
</script>

<style scoped>
    .minibar {

    }
    .backImg {
        width: 40px;
        height: 40px;
    }
    .wrapper {
        justify-content: space-between;
    }
    .chat-list {
        flex: 1;
        background-color: #F3F3F3;
    }
    .chat-spliter {
        height: 1px;
        margin: 80px;
        background-color: #CCC;
    }
    .message {
        flex-direction: row;
        align-items: flex-start;
    }
    .message-bot {
        justify-content: flex-start;
    }
    .message-user {
        justify-content: flex-end;
    }
    .chat-icon {
        width: 80px;
        height: 80px;
        margin-top: 18px;
        margin-left: 15px;
        background-color: #DDD;
    }
    .message-box {
        width: auto;
        /* width: 600px; */
        margin-top: 15px;
        margin-bottom: 15px;
        padding-top: 22px;
        padding-bottom: 22px;
        padding-left: 25px;
        padding-right: 25px;
        border-radius: 12px;
        border-color: #DDD;
        border-width: 1px;
    }
    .message-box-state {
        width: auto;
        /* width: 600px; */
        margin-top: 15px;
        margin-bottom: 15px;
        padding-top: 5px;
        padding-bottom: 5px;
        padding-left: 15px;
        padding-right: 15px;
        border-radius: 12px;
        border-color: #DDD;
        border-width: 1px;
        margin-right: 15px;
    }
    .bColor{
        border-color: #53beb7;
    }
    .message-state{
        font-size: 22px;
    }
    .message-state-noread{
        font-size: 22px;
    }
    .message-box-bot {
        margin-left: 15px;
        background-color: #FFF;
    }
    .message-box-bot:active {
        background-color: #EEE;
    }
    .message-box-user {
        margin-right: 15px;
        background-color: #99E152;
    }
    .message-box-user:active {
        background-color: #71CA2D;
    }
    .message-text {
        max-width: 510px;
        color: #454545;
    }
    .message-img{
        width: 400px;
        height: 300px;
    }
    .operations {
        flex: 0;
        border-top-width: 1px;
        border-top-style: solid;
        border-top-color: #E0E0E0;
        justify-content: flex-end;
        background-color: #F5F5F5;
    }
    .chooseSend {
        flex: 0;
        border-top-width: 1px;
        border-top-style: solid;
        border-top-color: #E0E0E0;
        justify-content: flex-end;
        background-color: #fff;
        padding-top: 30px;
        align-items: center;
        flex-direction: row;
    }
    .chooseSendBlock{
        flex: 1;
        margin-bottom: 30px;
        justify-content: center;
        align-items: center;
    }
    .chooseSendImg{
        width: 110px;
        height: 110px;
    }
    .chooseSendText{
        text-align: center;
    }
    .chat-options {
        flex-direction: row;
        align-items: center;
        height: 100px;
        padding-left: 10px;
        padding-right: 10px;
    }
    .btn-option {
        /* width: auto; */
        height: 75px;
        justify-content: center;
        border-width: 1px;
        border-color: #C5C5C5;
        background-color: #FFFFFF;
        border-radius: 10px;
        padding-left: 25px;
        padding-right: 25px;
        margin-left: 8px;
        margin-right: 8px;
    }
    .btn-option:active {
        background-color: #EEEEEE;
    }
    .btn-option-text {
        color: #808080;
        font-size: 34px;
    }
    .input-bar {
        height: 100px;
        border-top-width: 2px;
        border-top-color: #DDD;
        background-color: #FFFFFF;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .input {
        width: 580px;
        height: 70px;
        margin-left: 30px;
        padding-left: 10px;
        color: #606060;
        background-color: #FFFFFF;
        border-bottom-width: 1px;
        border-bottom-color: #606060;
        border-bottom-style: solid;
    }

    .btn-send {
        margin-right: 20px;
        width: 100px;
        height: 60px;
        border-radius: 10px;
        justify-content: center;
        background-color: #1aac19;
    }
    .btn-send:active {
        background-color: #E0E0E0;
    }
    .btn-send-text {
        text-align: center;
        color: #fff;
        line-height: 60px;
    }
    .btn-seletc{
        width: 140px;
        justify-content: center;
        align-items: center;
    }
    .addImg{
        width: 60px;
        height: 60px;
    }
    /*下拉刷新*/
    .refresh {
        width: 750px;
        display: -ms-flex;
        display: -webkit-flex;
        display: flex;
        -ms-flex-align: center;
        -webkit-align-items: center;
        -webkit-box-align: center;
        align-items: center;
    }
    .loadingImg{
        width: 90px;
        height: 66px;
    }
</style>
