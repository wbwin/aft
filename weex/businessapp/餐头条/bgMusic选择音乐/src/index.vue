<template>
    <div class="wrapper" @viewappear="viewappear" @viewdisappear="viewdisappear">

        <!--头部-->
        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    @wxcMinibarRightButtonClicked="minibarRightButtonClick"
            >
                <image :style="GLOBAL.headerImg"  slot="left" src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <div class="middle" slot="middle">
                    <text :class="[sliderIndex==0?'chooseMiddle':'middleText']" @click="localMusic(0)">音乐库</text>
                    <text :class="[sliderIndex==1?'chooseMiddle':'middleText']" @click="localMusic(1)">  本地  </text>
                </div>
                <text :style="GLOBAL.headerRight"  slot="right">完成</text>
            </wxc-minibar>
        </div>

        <slider class="scroll" :index="sliderIndex" @change="sliderChange" infinite="false">

            <!--音乐库页面-->
            <div class="scroller">
                <list class="listCell">
                    <cell class="musicSys" v-for="(item,index) in sysMusic">
                        <div style="margin-left: 0;background-color: #eff3f6;padding-top: 15px;padding-bottom: 15px;padding-left: 15px;flex-direction: column;justify-content: center;">
                            <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.catName}}</text>
                            <text class="musicAuthor" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.music.length}}首</text>
                        </div>
                        <div class="musicList">
                            <div class="musicContent"  v-for="(i,ind) in item.music" @click="musicClick(index,ind,1)">
                                <div class="musicContent_left">
                                    <image class="imgDefault" src="https://image.aftdc.com/appBimg/icon_musicImg.png"></image>
                                    <div class="musicMessage">
                                        <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{i.musicName}}</text>
                                        <text class="musicAuthor" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{i.musicAuthor}}</text>
                                    </div>
                                </div>
                                <div class="musicChoice" v-if="musicChoice1===index&&musicChoice3===ind">
                                    <image class="choiceTrue"  src="https://image.aftdc.com/appBimg/icon_choiceTrue.png"></image>
                                </div>
                            </div>
                        </div>
                    </cell>
                </list>
            </div>

            <!--本地乐库页面-->
            <div class="scroller" v-if="shopMusic.length === 0">
                <scroller class="listCell" style="justify-content: center;align-items: center;text-align: center;flex: 1;">
                    <image class="imgDefault unFindMusicImg" src="https://image.aftdc.com/appBimg/icon_unFindMusic.png"></image>
                    <text class="unFindMusicText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">你还没有上传过音乐</text>
                </scroller>
                <div class=" musicButton">
                    <wxc-button class="uploadButton" text="+ 上传音乐" :textStyle="GLOBAL.buttonText" :btnStyle="GLOBAL.defaultButton"
                                @wxcButtonClicked="upMusic"></wxc-button>
                </div>
            </div>
            <div class="scroller" v-else>
                <scroller class="listCell">
                    <div class="musicContent" v-for="(item,index) in shopMusic" @click="musicClick(index,-1,2)">
                        <div class="musicContent_left">
                            <image class="imgDefault" src="https://image.aftdc.com/appBimg/icon_musicImg.png"></image>
                            <div class="musicMessage">
                                <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.musicName}}</text>
                                <text class="musicAuthor" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.musicAuthor}}</text>
                            </div>
                        </div>
                        <div class="musicChoice" v-if="musicChoice2===index">
                            <image class="choiceTrue"  src="https://image.aftdc.com/appBimg/icon_choiceTrue.png"></image>
                        </div>
                    </div>
                </scroller>
                <div class=" musicButton">
                    <wxc-button class="uploadButton" text="+ 上传音乐" :textStyle="GLOBAL.buttonText" :btnStyle="GLOBAL.defaultButton"
                                @wxcButtonClicked="upMusic"></wxc-button>
                </div>
            </div>

        </slider>

        <!--<toast ref="toast"></toast>-->
    </div>
</template>

<script>
    import {WxcMinibar, WxcPopup,WxcButton} from 'weex-ui';
    // import Toast from './Toast.vue'
    const event = weex.requireModule('event');
    const post = weex.requireModule('stream');
    const navigator = weex.requireModule('navigator');
    export default {
        components: {WxcMinibar, WxcPopup,WxcButton},
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
                timeout:''
            }
        },
        created() {
            this.token = weex.config.token;
            this.imei = weex.config.imei;
            event.init();
            event.initMusic();
            this.getMusic();
        },
        methods:{
            getMusic(){
                var that = this
                var param = this.GLOBAL.sign(this.token,this.imei);
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/businessapp/Article/getMusic',
                }, function (e) {
                    if (e.data.res == 1){
                        that.sysMusic = e.data.sysMusic
                        that.shopMusic = e.data.shopMusic
                    }
                })
            },
            musicClick(index,ind,type){
                if (type==1){
                    if(this.musicChoice1===index&&this.musicChoice3===ind){
                        this.musicChoice1='';
                        this.musicChoice3='';
                        event.stopMusic()
                    }else{
                        this.musicChoice3=ind;
                        this.musicChoice2='';
                        this.musicChoice1=index;
                        this.musicType=type;
                        var musicPart = this.sysMusic[index].music[ind].musicPath;
                        clearTimeout(this.timeout)
                        this.timeout = setTimeout(()=>event.playNextMusic('https://image.aftdc.com/'+musicPart),500);
                    }
                } else {
                    if(this.musicChoice2===index){
                        this.musicChoice2='';
                        event.stopMusic()
                    }else{
                        this.musicChoice1='';
                        this.musicChoice3='';
                        this.musicChoice2=index;
                        this.musicType=type;
                        var musicPart = this.shopMusic[index].musicPath;
                        clearTimeout(this.timeout)
                        this.timeout = setTimeout(()=>event.playNextMusic('https://image.aftdc.com/'+musicPart),500);
                    }
                }
            },
            move(index){
                var sysMusic = this.sysMusic
                if (sysMusic[index].click === true){
                    sysMusic[index].height = '0px'
                    sysMusic[index].click = false
                    this.sysMusic = sysMusic
                    this.musicIndex = -1
                    this.$set(this.sysMusic,sysMusic);
                    return false
                }
                if (this.musicIndex == index){
                    sysMusic[index].height = '0px'
                    sysMusic[index].click = false
                }else{
                    for (var i in sysMusic) {
                        sysMusic[i].height = '0px'
                        sysMusic[i].click = false
                    }
                    sysMusic[index].click = true
                    sysMusic[index].height = 110*this.sysMusic[index].music.length+'px'
                }
                this.sysMusic = sysMusic
                this.$set(this.sysMusic,sysMusic);
                this.musicIndex = index
            },
            minibarRightButtonClick(){
                if ((this.musicChoice1!==''&&this.musicChoice3!=='')||this.musicChoice2!=='') {
                    if (this.musicType == 1 )
                        var music = this.sysMusic[this.musicChoice1].music[this.musicChoice3];
                    else
                        var music = this.shopMusic[this.musicChoice2];

                    event.save('chooseMusic',JSON.stringify(music))
                }
                event.finishMusic();
                navigator.pop({ animated: 'true' });
            },
            minibarLeftButtonClick(){
                event.finishMusic();
                navigator.pop({ animated: 'true' });
            },
            localMusic(index){
                this.sliderIndex=index;
                console.log(this.sliderIndex)
            },
            sliderChange(e){
                this.sliderIndex=e.index;
            },
            upMusic(){
                event.stopMusic()
                var url = 'http://assets/upMusic.js';
                event.toUrl({url:url,param:''});
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
                if (event.find("upMusic")) {
                    this.getMusic();
                    event.delete("upMusic");
                }
            },
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

    .scroll{
        flex: 1;
        width: 750px;
        /*flex-direction: row;*/
    }

    .scrollBlock{
        /*width: 750px;*/
        /*flex: 1;*/
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        transition: left 0.2s ease-in-out;
    }

    .scroller {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
    }
    .unFindMusic{
        justify-content: center;
        align-items: center;
    }
    .listCell {
        background-color: #fff;
        flex: 1;
        width: 750px;
        flex-direction: column;
        justify-content: flex-start;
    }

    .musicSys{
        padding-left: 20px;
        padding-right: 20px;
        padding-top: 20px;
        padding-bottom: 20px;
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: #f1f1f1;
        flex-direction: column;
        width: 750px;
    }
    .musicContent {
        padding-left: 20px;
        padding-right: 20px;
        padding-top: 20px;
        padding-bottom: 20px;
        border-top-width: 2px;
        border-top-style: solid;
        border-top-color: #f1f1f1;
        justify-content: space-between;
        align-items: center;
        flex-direction: row;
        width: 750px;
    }

    .musicList{
        margin-top: 20px;
    }

    .musicContent_left {
        flex-direction: row;
        align-items: center;
    }

    .imgDefault {
        width: 60px;
        height: 70px;
    }

    .musicMessage {
        margin-left: 20px;
        flex-direction: column;
        justify-content: center;
    }

    .borderBottom{
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #f1f1f1;
    }

    .musicAuthor {
        margin-top: 5px;
    }

    .musicChoice {
        margin-right: 20px;
    }

    .choiceTrue {
        width: 50px;
        height: 50px;
    }
    .musicButton{
        flex-direction: row;
        justify-content: space-around;
        position: absolute;
        left: 0;
        bottom: 0;
        right: 0;
        background-color: #fff;
        border-top-width: 2px;
        border-top-style: solid;
        border-top-color: #f1f1f1;
        padding-top: 20px;
        padding-bottom: 20px;
        padding-left: 30px;
        padding-right: 30px;
    }
    .uploadButton:active{
        background-color: #57aba5;
    }
    .backImg{
        width: 40px;
        height: 40px;
    }
    .middle{
        display: flex;
        flex-direction: row;
        border-width: 1px;
        border-style: solid;
        border-color: #57aba5;
        border-radius: 10px;
    }
    .middleText{
        flex: 1;
        font-size: 32px;
        color: #fff;
        text-align: center;
        padding-top: 15px;
        padding-bottom: 15px;
        width: 138px;
        background-color: #57aba5;
    }
    .chooseMiddle{
        flex: 1;
        font-size: 32px;
        text-align: center;
        padding-top: 15px;
        padding-bottom: 15px;
        width: 138px;
        color: #57aba5;
        background-color: #fff;
    }
    .unFindMusicImg{
        width: 200px;
        height: 200px;
    }
</style>
