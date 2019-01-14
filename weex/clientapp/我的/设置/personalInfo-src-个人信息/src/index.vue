<template>
    <div class="personalInfo" @viewappear="viewappear">
        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    v-once
            >
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">个人信息</text>
                <text :style="GLOBAL.headerRight"  slot="right"></text>
            </wxc-minibar>
        </div>
        <scroller style="flex: 1;width: 750px;">

            <!--个人信息-->
            <div class="personalInfoDiv">
                <div class="setDiv" @click="show=true">
                    <text class="setDivText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">头像</text>
                    <image class="headPortrait" :src="info.userPhoto"></image>
                    <image class="setDivIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                </div>
                <div class="setDiv" @click="modify">
                    <text class="setDivText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">昵称</text>
                    <text class="phone" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{info.userName}}</text>
                    <image class="setDivIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                </div>
                <div class="setDiv" @click="chooseTime">
                    <text class="setDivText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">生日</text>
                    <text class="noSet" :style="{fontSize:GLOBAL.defaultFS,color:!info.birthday?GLOBAL.tColor:GLOBAL.dColor}">{{!info.birthday?'未设置':info.birthday}}</text>
                    <image class="setDivIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                </div>
                <div class="setDiv" @click="address">
                    <text class="setDivText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">收货地址</text>
                    <text class="phone" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">修改/添加</text>
                    <image class="setDivIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                </div>
            </div>


        </scroller>

        <!--修改头像弹出框-->
        <wxc-mask height="220"
                  width="660"
                  border-radius="5"
                  duration="200"
                  mask-bg-color="#FFFFFF"
                  :has-animation="true"
                  :has-overlay="true"
                  :show-close="false"
                  :show="show"
                  @wxcMaskSetHidden="wxcMaskSetHidden">
            <div class="content">
                <div class="picOption">
                    <image class="photograph" src="https://image.aftdc.com/appBimg/icon_photograph.png"></image>
                    <text :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}" @click="selectPhoto">拍照</text>
                </div>
                <div class="picOption" style="border-top-width: 1px;border-top-style: solid;border-top-color: #dedede" @click="selectPhoto">
                    <image class="photograph" src="https://image.aftdc.com/appBimg/icon_choicePic.png"></image>
                    <text :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">从相册中选择</text>
                </div>
            </div>
        </wxc-mask>

        <!--修改用户名弹出层-->
        <wxc-mask height="330"
                  width="660"
                  border-radius="5"
                  duration="200"
                  mask-bg-color="#FFFFFF"
                  top="280"
                  :has-animation="true"
                  :has-overlay="true"
                  :show-close="false"
                  :show="modifyShow"
                  :overlay-can-close="false"
                  @wxcMaskSetHidden="wxcMaskSetHidden">
            <div class="modofi">
                <text class="name" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">用户名 : </text>
                <input type="text" class="input" v-model="userName" placeholder="请输入您的名称" ref="nameInput">
                <text :style="{fontSize:GLOBAL.defaultFS,color:'#999',marginTop:'20px'}">以中文或英文字母开头限4-16个字符,一个汉字为两个字符</text>
                <div class="row" :style="{marginTop:'20px'}">
                    <text class="cancel" :style="{fontSize:GLOBAL.bigFS,color:'#999'}" @click="cancel">取消</text>
                    <text class="confirm" :style="{fontSize:GLOBAL.bigFS,color:'#fff'}" @click="confirm()">确定</text>
                </div>

                <Toast ref="toastModal"></Toast>
            </div>
        </wxc-mask>
        <Toast ref="toast"></Toast>
    </div>

</template>

<script>
    import { WxcMask,WxcMinibar, WxcPopup} from 'weex-ui';
    import Toast from './Toast.vue'
    const modal = weex.requireModule('modal');
    const event = weex.requireModule('event');
    const dom = weex.requireModule('dom');
    const post = weex.requireModule('stream');
    const navigator = weex.requireModule('navigator');
    export default {

        components: {WxcMinibar, Toast, WxcPopup,WxcMask},
        data() {
            return{
                democfg:{
                    background:'#fff',
                    color:'#fff'
                },
                show:false,
                modifyShow:false,
                userName:'',
                name:'DPW909435213',
                birthday:'',
                token:'',
                imei:'',
                info:[],
                picture:[],
                pictureLocal:[],
            }
        },
        methods:{
            cancel(){//取消修改用户名
                var that=this;
                that.modifyShow=false;
            },//取消修改用户名

            confirm(){//确认修改用户名,验证用户名的正则还没写
                var that=this;

                //名字是否验证通过,方法来源于网络
                var ta=that.userName.split(""),str_l=0;
                var str_fa=Number(ta[0].charCodeAt());
                if((str_fa>=65&&str_fa<=90)||(str_fa>=97&&str_fa<=122)||(str_fa>255))
                {
                    for(var i=0;i<=ta.length-1;i++)
                    {
                        str_l++;
                        if(Number(ta[i].charCodeAt())>255){str_l++;}
                    }

                    if(str_l<4||str_l>16){
                        const toast =that.$refs.toastModal;
                        toast.editContent('名称格式错误');
                        return false;
                    }
                }
                else{
                    const toast =that.$refs.toastModal;
                    toast.editContent('名称格式错误');
                    return false;
                }


                that.modifyShow=false;
                if(that.userName!=that.info.userName && that.userName!='' && that.userName!=' '){

                    var param = this.GLOBAL.sign(this.token,this.imei);
                    param+='&userName='+that.userName
                    post.fetch({
                        method: 'POST',
                        type: 'json',
                        body: param,
                        url: 'https://www.aftdc.com/userapp/Mine/updateUserName',
                        headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    },function(res){
                        if(res.data.res==1){
                            that.info.userName=that.userName;
                            const toast =that.$refs.toast;
                            toast.editContent(res.data.info);
                        }
                        else{
                            const toast =that.$refs.toast;
                            toast.editContent(res.data.info);
                        }
                    });
                }
            },//确认修改用户名

            chooseTime(){//调用安卓选择时间
                event.chooseTime(true, true, true, false, false, false);
            },//调用安卓选择时间

            modify(){//修改昵称
                var that=this;
                that.modifyShow=true;
                that.userName=that.info.userName;
                setTimeout(function () {
                    that.$refs.nameInput.focus();
                },50)
            },//修改昵称

            viewappear(){//返回这个页面时触发

                var that=this;
                // if (!that.pageBack) { return; }
                // that.pageBack = false;
                //
                var imageList = event.find("imageList");
                var userPhoto=[];
                var userPhotoLocal=[];

                if(imageList){
                    imageList = JSON.parse(imageList);
                    // var imageList=that.pictureLocal;
                    for(var i in imageList){
                        var houzui = imageList[i].substring(imageList[i].lastIndexOf("."), imageList[i].length)
                        var articleImg = 'user/'+'44/'+'userPhoto/'+Date.parse(new Date())/1000+parseInt(Math.random()*10000+1)+ houzui;
                        userPhoto.push(articleImg);
                        userPhotoLocal.push(imageList[i]);
                    }
                    if(userPhoto.length>0){
                        var param = this.GLOBAL.sign(this.token,this.imei);
                        post.fetch({
                            method: 'POST',
                            type: 'json',
                            body: param,
                            url: 'https://www.aftdc.com/userapp/Order/uploadOss',
                            headers: {"Content-Type": "application/x-www-form-urlencoded"},
                        },function(res){
                            // var waterMarkStr = event.find('shopName');
                            var waterMarkStr = '';
                            for(var i in userPhotoLocal){
                                event.uploadImg(res.data.AccessKeyId,res.data.AccessKeySecret,res.data.SecurityToken,userPhoto[i],userPhotoLocal[i],waterMarkStr);
                            }
                        });


                    }
                    event.delete('imageList')

                    param+= '&userPhoto='+userPhoto[0];
                    post.fetch({
                        method: 'POST',
                        type: 'json',
                        body: param,
                        headers: { "Content-Type": "application/x-www-form-urlencoded" },
                        url: 'https://www.aftdc.com/userapp/Mine/updateUserPhoto',
                    }, function (res) {

                        if(res.data.res==1){
                            that.info.userPhoto=userPhotoLocal[0];
                            const toast =that.$refs.toast;
                            toast.editContent(res.data.info);

                        }
                        else{
                            const toast =that.$refs.toast;
                            toast.editContent(res.data.info);
                        }
                    })
                }
            },

            wxcMaskSetHidden(){
                this.show=false;
                this.modifyShow=false;
            },
            minibarLeftButtonClick(){
                navigator.pop({animated:'false'});
            },
            selectPhoto(){//拍照,从相册中选择
                var that=this;
                that.show=false;
                event.selectImg(1,'')
            },//拍照,从相册中选择

            address(){//修改添加地址
                var param=JSON.stringify({source:1});
                var url='http://assets/receivingAddress.js';
                event.toUrl({"url":url,"param":param});
            },//修改添加地址
        },


        created(){
            event.init();

            var that=this;
            var param = that.GLOBAL.sign(that.token,that.imei);
            post.fetch({
                method: 'post',
                type: 'json',
                body: param,
                url: 'https://www.aftdc.com/userapp/Mine/userPersonalInfo',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
            },function(res){
                if(res.data.res==1){
                    that.info=res.data.data[0];
                    console.log( that.info)
                }
                else{
                    const toast =that.$refs.toast;
                    toast.editContent(res.data.info);
                }
            });


            //调用安卓的时间选择
            weex.requireModule('globalEvent').addEventListener("chooseTime", function (e) {

                // 获取当前日期
                var isDate=new Date();
                var today=isDate.getFullYear()+'/'+(isDate.getMonth()+1)+'/'+isDate.getDate();

                //获取选择的日期
                var selectDate=e.time;
                selectDate=selectDate.replace(/-/g,'/');

                //比较当前日期和选择日期大小
                if(selectDate>today){
                    const toast=that.$refs.toast;
                    toast.editContent("时间选择错误");
                    return false;
                }
                else{
                    param+='&userBirthday='+e.time;
                    post.fetch({
                        method: 'post',
                        type: 'json',
                        body: param,
                        url: 'https://www.aftdc.com/userapp/Mine/updateUserBirthday',
                        headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    },function(res){
                        if(res.data.res==1){
                            that.info.birthday=e.time;
                            const toast =that.$refs.toast;
                            toast.editContent(res.data.info);
                        }
                        else{
                            const toast =that.$refs.toast;
                            toast.editContent(res.data.info);
                        }
                    });
                }

            });
        },
    }
</script>

<style scoped>
    /*修改用户名弹出层start*/
    .modofi{
        padding-left: 20px;
        padding-right: 20px;
    }
    .name{
        padding-top: 20px;
    }
    .input{
        border-bottom-style: solid;
        border-bottom-width: 3px;
        border-bottom-color: #53beb7;
        line-height: 50px;
        margin-right: 20px;
        font-size: 30px;
        color: #666;
        margin-top: 30px;
    }
    /*修改用户名弹出层end*/


    /*弹出层样式*/
    .noSet{
        margin-right: 30px;
    }
    .setDivIcon{
        width: 20px;
        height: 20px;
    }
    .phone{
        margin-right: 30px;
    }
    .setDivText{
        flex: 1;
    }
    .setDiv{
        background-color: #fff;
        margin-bottom: 2px;
        flex-direction: row;
        align-items: center;
        padding-top: 30px;
        padding-bottom: 30px;
        padding-left: 20px;
        padding-right: 20px;
    }
    .setDiv:active{
        background-color: #f1f1f1;
    }
    .personalInfoDiv{
        margin-top: 20px;
    }
    .personalInfo{
        background-color: #f8f8f8;
    }
    .headPortrait{
        width: 85px;
        height: 85px;
        margin-right: 30px;
    }
    .content{
        flex-direction: column;

    }
    .picOption{
        flex-direction: row;
        padding-top: 30px;
        padding-left: 30px;
        padding-bottom: 30px;
        align-items: center;
    }
    .photograph{
        width: 50px;
        height: 50px;
        margin-right: 20px;
    }
    .picOption:active{
        background-color: #f1f1f1;
    }
    .row{
        flex-direction: row;
        align-items: center;
    }
    .cancel{
        flex: 1;
        text-align: center;
        padding-top: 20px;
        padding-bottom: 20px;
        background-color: #f8f8f8;
        margin-right: 10px;
        border-radius: 10px;
    }
    .cancel:active{
        background-color: #f1f1f1;
    }
    .confirm{
        flex: 1;
        text-align: center;
        padding-top: 20px;
        padding-bottom: 20px;
        background-color: #53beb7;
        margin-left: 10px;
        border-radius: 10px;
    }
    .confirm:active{
        background-color: #53aba5;
    }
</style>
