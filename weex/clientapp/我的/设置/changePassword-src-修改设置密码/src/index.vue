<template>


    <!--输入验证特殊字符未完善-->
    <div class="changePassword">
        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    v-once
            >
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">{{setPwd==0?'设置密码':'修改密码'}}</text>
                <text :style="GLOBAL.headerRight"  slot="right"></text>
            </wxc-minibar>
        </div>
        <scroller style="flex: 1;width: 750px;">
            <!--个人信息-->
            <div class="changePasswordDiv">
                <!--已设置密码时显示-->
                <div v-if="setPwd==1">
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}" >当前密码:</text>
                    <input type="password" class="changeInput" :class="[inputIndex==0?'changeInputTwo':'']" ref="firInput" @focus="allFocus(0)" @blur="allBlur" v-model="oldPwd">
                </div>
                <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}" >新密码:</text>
                <input type="password" class="changeInput" :class="[inputIndex==1?'changeInputTwo':'']" ref="secInput" @focus="allFocus(1)" @blur="newBlur" @input="newInput" v-model="newPwd">
                <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}" >确认新密码</text>
                <input type="password" class="changeInput" :class="[inputIndex==2?'changeInputTwo':'']" ref="thrInput" @focus="allFocus(2)" @blur="confirmBlur" @input="confirmInput" v-model="surePassword">
                <text class="details" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">密码长度8~32位,必须包含数字、字母、符号至少2中或以上元素</text>
                <!--<text class="confirm" :class="[inputTextOne.length>=8&&inputTextTwo.length>=8?'':'confirmTwo']">确定</text>-->

                <div class=" enterButton" :class="[isNewPw&&isConfirmPw?'':'confirmTwo']">
                    <wxc-button class="okButton" text="确定" :textStyle="GLOBAL.buttonText" :btnStyle="GLOBAL.defaultButton"
                                @wxcButtonClicked="confirmClick"></wxc-button>
                </div>

                <text class="setSuccessText" v-if="setPwd==0" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">设置成功后，下次可以直接使用您的手机号与该密码登录账户</text>
            </div>
        </scroller>
        <toast ref="toast"></toast>
    </div>

</template>

<script>
    import { WxcMask,WxcButton} from 'weex-ui';
    const animation = weex.requireModule('animation')
    const modal = weex.requireModule('modal')
    import {WxcMinibar, WxcPopup} from 'weex-ui';
    import Toast from './Toast.vue'
    const event = weex.requireModule('event');
    const dom = weex.requireModule('dom');
    const post = weex.requireModule('stream');
    const navigator = weex.requireModule('navigator');
    export default {

        components: {WxcMinibar, Toast, WxcPopup,WxcMask,WxcButton},
        data() {
            return{
                oldPwd:'',//当前密码
                newPwd:'',//新密码
                surePassword:'',//确认新密码
                inputIndex:-1,
                setPwd:1,//0为设置密码，1为修改密码

                isNewPw:false,
                isConfirmPw:false,

                token:'',
                imei:'',
            }
        },
        methods:{

            minibarLeftButtonClick(){
                navigator.pop({animated:'false'});
            },

            confirmClick(){
                var that=this;
                if(that.isNewPw&&that.isConfirmPw){
                    if(!that.oldPwd&&that.setPwd){
                        const toast = that.$refs.toast
                        toast.editContent('请输入当前密码');
                        return false;
                    }
                    if(that.newPwd!==that.surePassword){
                        const toast = that.$refs.toast
                        toast.editContent('新密码和确认密码不一致！');
                        return false;
                    }

                    var param = this.GLOBAL.sign(this.token,this.imei);

                    if(that.setPwd){//修改密码
                        param+='&newPwd='+that.newPwd+'&oldPwd='+that.oldPwd;
                        post.fetch({
                            method: 'POST',
                            type: 'json',
                            body: param,
                            headers: { "Content-Type": "application/x-www-form-urlencoded" },
                            url: 'https://www.aftdc.com/userapp/Mine/updatePwd',
                        }, function (res) {
                            if(res.data.res==1){
                                setTimeout(function () {
                                    navigator.pop({animated:'false'});
                                },1000)

                                const toast =that.$refs.toast;
                                toast.editContent(res.data.info);
                            }
                            else{
                                const toast =that.$refs.toast;
                                toast.editContent(res.data.info);
                            }
                        })
                    }
                    else{//设置密码
                        param+='&passWord='+that.newPwd;
                        post.fetch({
                            method: 'POST',
                            type: 'json',
                            body: param,
                            headers: { "Content-Type": "application/x-www-form-urlencoded" },
                            url: 'https://www.aftdc.com/userapp/Mine/setLoginPwd',
                        }, function (res) {
                            if(res.data.res==1){
                                setTimeout(function () {
                                    navigator.pop({animated:'false'});
                                },1000)

                                const toast =that.$refs.toast;
                                toast.editContent(res.data.info);
                            }
                            else{
                                const toast =that.$refs.toast;
                                toast.editContent(res.data.info);
                            }
                        })
                    }
                }



            },
            allFocus(index){
                var that=this
                that.blankLeft='0px';
                that.inputIndex=index
            },

            newBlur(){
                var that=this
                //6-18位 ，由数字、大写字母、小写字母、特殊字符
                var r = /^[0-9a-zA-Z`~!@#$^&*()=|{}':;',.<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]{8,32}$/;//特殊字符可以补充，与后续校验同步即可
                if(r.test(that.newPwd)){
                    var a = /[0-9]/.exec(that.newPwd)!=null ? 1:0;
                    var b = /[a-z]/.exec(that.newPwd)!=null ? 1:0;
                    var c = /[A-Z]/.exec(that.newPwd)!=null ? 1:0;
                    var d = /[`~!@#$^&*()=|{}':;',.<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]/.exec(that.newPwd)!=null ? 1:0;
                    if(a + b + c + d < 2){
                        that.newPwd='';
                        const toast = that.$refs.toast
                        toast.editContent('密码必须包含数字、字母、符号至少2中或以上元素！');
                        that.isNewPw=false;
                        return false;
                    }//至少2种//
                    that.isNewPw=true;
                }
            },

            newInput(){
                var that=this;
                //6-18位 ，由数字、大写字母、小写字母、特殊字符
                var r = /^[0-9a-zA-Z`~!@#$^&*()=|{}':;',.<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]{8,32}$/;//特殊字符可以补充，与后续校验同步即可
                if(r.test(that.newPwd)){
                    var a = /[0-9]/.exec(that.newPwd)!=null ? 1:0;
                    var b = /[a-z]/.exec(that.newPwd)!=null ? 1:0;
                    var c = /[A-Z]/.exec(that.newPwd)!=null ? 1:0;
                    var d = /[`~!@#$^&*()=|{}':;',.<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]/.exec(that.newPwd)!=null ? 1:0;
                    if(a + b + c + d < 2){
                        that.isNewPw=false;
                        return false;
                    }//至少2种//
                    that.isNewPw=true;
                }
            },
            confirmInput(){
                var that=this;
                //6-18位 ，由数字、大写字母、小写字母、特殊字符
                var r = /^[0-9a-zA-Z`~!@#$^&*()=|{}':;',.<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]{8,32}$/;//特殊字符可以补充，与后续校验同步即可
                if(r.test(that.surePassword)){
                    var a = /[0-9]/.exec(that.surePassword)!=null ? 1:0;
                    var b = /[a-z]/.exec(that.surePassword)!=null ? 1:0;
                    var c = /[A-Z]/.exec(that.surePassword)!=null ? 1:0;
                    var d = /[`~!@#$^&*()=|{}':;',.<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]/.exec(that.surePassword)!=null ? 1:0;
                    if(a + b + c + d < 2){
                        that.isConfirmPw=false;
                        return false;
                    }//至少2种//
                    that.isConfirmPw=true;
                }
            },

            confirmBlur(){
                var that=this
                //6-18位 ，由数字、大写字母、小写字母、特殊字符
                var r = /^[0-9a-zA-Z`~!@#$^&*()=|{}':;',.<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]{8,32}$/;//特殊字符可以补充，与后续校验同步即可
                if(r.test(that.surePassword)){
                    var a = /[0-9]/.exec(that.surePassword)!=null ? 1:0;
                    var b = /[a-z]/.exec(that.surePassword)!=null ? 1:0;
                    var c = /[A-Z]/.exec(that.surePassword)!=null ? 1:0;
                    var d = /[`~!@#$^&*()=|{}':;',.<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]/.exec(that.surePassword)!=null ? 1:0;
                    if(a + b + c + d < 2){
                        that.surePassword='';
                        const toast = that.$refs.toast
                        toast.editContent('密码必须包含数字、字母、符号至少2中或以上元素！');
                        that.isConfirmPw=false;
                        return false;
                    }//至少2种//
                    that.isConfirmPw=true;
                }
            },
        },
        created(){
            var that=this;
            var param = weex.config.param;
            param = JSON.parse(param);
            that.setPwd=param.setPwd;
        },
        mounted(){

        }
    }
</script>

<style scoped>
    .enterButton {
        flex-direction: row;
        justify-content: space-around;
        /*position: fixed;*/
        /*left: 0;            存在时固定在底部*/
        /*bottom: 0;*/
        /*right: 0;*/
        margin-top: 30px;
        padding-left: 30px;
        padding-right: 30px;
        opacity: 1;
    }

    .okButton{
        background-color: #53beb7;
    }
    .okButton:active {
        background-color: #53aba5;
    }
    .okButton:enabled {
        background-color: #53beb7;
    }
    .confirmTwo{
        opacity: 0.5;
    }
    .changeInputTwo{
        border-bottom-color: #53beb7;
    }
    .setSuccessText{
        margin-top: 20px;
        padding-left: 50px;
        padding-right: 50px;
    }
    .confirm{
        padding-top: 25px;
        padding-bottom: 25px;
        text-align: center;
        color: #fff;
        background-color: #53beb7;
        margin-top: 20px;
        opacity: 1;
    }
    .changeInput{
        padding-top: 10px;
        padding-bottom: 10px;
        margin-bottom: 20px;
        margin-top: 10px;
        height: 60px;
        border-bottom-width: 4px;
        border-bottom-style: solid;
        border-bottom-color: #ccc;
    }
    .changePasswordDiv{
        flex: 1;
        padding-top: 20px;
        padding-left: 20px;
        padding-right: 20px;
    }
    .changePassword{
        background-color: #f8f8f8;
    }
    .blank{
        position: absolute;
        width: 750px;
        bottom: 0;
        top: 0;
    }
</style>
