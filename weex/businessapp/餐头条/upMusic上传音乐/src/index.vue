<template>
    <div class="wrapper">

        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    @wxcMinibarRightButtonClicked="minibarRightButtonClick"
                    v-once
            >
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">本地音乐</text>
                <text :style="GLOBAL.headerRight"  slot="right">上传</text>
            </wxc-minibar>
        </div>

        <div class="unFindMusic" v-if="music.length<=0">
            <image class="imgDefault unFindMusicImg" src="https://image.aftdc.com/appBimg/icon_unFindMusic.png"></image>
            <text class="unFindMusicText" :style="{fontSize:GLOBAL.bigFS}">没有本地音乐</text>
        </div>
        <list class="scroller" v-if="music.length>0">
            <cell class="listCell" v-for="(item,index) in music" @click="musicClick(index)">
                <div class="musicContent">
                    <div class="musicContent_left">
                        <image class="imgDefault" src="https://image.aftdc.com/appBimg/icon_musicImg.png"></image>
                        <div class="musicMessage">
                            <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.musicName}}</text>
                            <text class="musicAuthor" :style="{fontSize:GLOBAL.defaultFS}">{{item.musicAuthor}}</text>
                        </div>
                    </div>
                    <div class="musicChoice" v-if="musicChoice===index">
                        <image class="choiceTrue"  src="https://image.aftdc.com/appBimg/icon_choiceTrue.png"></image>
                    </div>
                </div>
            </cell>
        </list>
        <toast ref="toast"></toast>
        <loadings ref="loadings"></loadings>
    </div>
</template>

<script>
    import {WxcMinibar, WxcPopup,WxcButton} from 'weex-ui';
    import Toast from './Toast.vue'
    import Loadings from './Loading.vue'
    const event = weex.requireModule('event');
    const post = weex.requireModule('stream');
    const navigator = weex.requireModule('navigator');
    export default {
        components: {WxcMinibar, Toast, Loadings, WxcPopup,WxcButton},
        data() {
            return {
                music:[],
                musicChoice:'',
                uploadBtnStyle:{
                    backgroundColor: '#53beb7',
                    width: '600',
                    borderColor: '#333',
                    borderWidth: '1px',
                    borderStyle: 'solid'
                },
                uploadStyle:{
                    color:'#fff'
                }
            }
        },
        created() {
            this.token = weex.config.token;
            this.imei = weex.config.imei;
            var that = this;
            event.init();
            event.initMusic();
            that.music = JSON.parse(event.getMusicData())
            weex.requireModule('globalEvent').addEventListener("upLoadFile",function(e){
                if (e.upLoad == 1)
                    that.upLoadSecceed()
            });
            this.music = JSON.parse(event.getMusicData())
        },
        methods:{
            musicClick(index){
                var that=this;
                if(that.musicChoice===index){
                    that.musicChoice='';
                    event.stopMusic()
                }else{
                    that.musicChoice=index;
                    var musicPart = this.music[index].musicPath;
                    console.log("1111111"+musicPart)
                    event.playNextMusic(musicPart);
                }
            },
            minibarRightButtonClick(){
                if (this.musicChoice!=='') {
                    var music = this.music[this.musicChoice];
                    // var musicName  = music.musicPath
                    // musicName = musicName.substring(musicName.lastIndexOf("/") + 1, musicName.length);
                    var musicName  = music.musicName + music.musicPath.substring(music.musicPath.lastIndexOf("."), music.musicPath.length);

                    var musicPart = 'music/shops/'+event.find('shopId')+'/'+ musicName;
                    this.musicPart = musicPart;
                    this.uploadImg(musicPart,music.musicPath)
                    const loadings = this.$refs.loadings;
                    loadings.showLoading('上传中');
                }else {
                    navigator.pop({ animated: 'true' });
                }
            },
            minibarLeftButtonClick(){
                event.finishMusic();
                navigator.pop({ animated: 'true' });
            },
            upLoadSecceed(){
                var music = this.music[this.musicChoice];
                music.musicPath = this.musicPart
                console.log(music)
                this.upData(music)
            },
            //更新数据表
            upData(music){
                var that = this;
                var param = this.GLOBAL.sign(this.token,this.imei);
                param += '&music='+ JSON.stringify(music);
                post.fetch({
                    method: 'post',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/businessapp/Article/addShopMusic',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                },function(res){
                    if (res.data.res==1){
                        const loadings = that.$refs.loadings;
                        loadings.hidLoading();
                        const toast = that.$refs.toast;
                        toast.editContent('上传成功');
                        event.save('upMusic',JSON.stringify(music));
                        event.finishMusic();
                        weex.requireModule('globalEvent').removeEventListener("upLoadFile");
                        setTimeout(()=>navigator.pop({ animated: 'true' }),2000);
                    } else {
                        const toast = that.$refs.toast;
                        toast.editContent('网络出错,请稍后再试');
                    }
                })
            },
            //上传音乐
            uploadImg(music,localPart){
                var that = this;
                var param = this.GLOBAL.sign(this.token,this.imei);
                post.fetch({
                    method: 'post',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/businessapp/Goods/uploadOss',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                },function(res){
                    var waterMarkStr = '';
                    event.uploadImg(res.data.AccessKeyId,res.data.AccessKeySecret,res.data.SecurityToken,music,localPart,waterMarkStr);
                })
            },
        },
    }
</script>

<style scoped>
    .wrapper {
        flex-direction: column;
        background-color: #f1f1f1;
    }

    .scroller {
        position: absolute;
        top: 91px;
        left: 0;
        right: 0;
        bottom: 0;
        flex-direction: column;

    }
    .unFindMusic{
        position: absolute;
        top: 91px;
        left: 0;
        right: 0;
        bottom: 0;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .listCell {
        background-color: #fff;
    }

    .musicContent {
        margin-left: 20px;
        margin-right: 20px;
        padding-top: 25px;
        padding-bottom: 25px;
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #f1f1f1;
        justify-content: space-between;
        align-items: center;
        flex-direction: row;

    }

    .musicContent_left {
        flex-direction: row;
        align-items: center;
    }

    .imgDefault {
        width: 70px;
        height: 80px;
    }

    .musicMessage {
        margin-left: 20px;
        flex-direction: column;
        justify-content: center;

    }

    .musicAuthor {
        margin-top: 5px;
        color: #999;
    }

    .musicChoice {
        flex-direction: row;

    }

    .choiceTrue {
        width: 50px;
        height: 50px;
    }
    .musicButton{
        flex-direction: row;
        justify-content: space-around;
        position: fixed;
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
    .unFindMusicImg{
        width: 200px;
        height: 200px;
    }
    .unFindMusicText{
        color: #a1a1a1;
    }
</style>