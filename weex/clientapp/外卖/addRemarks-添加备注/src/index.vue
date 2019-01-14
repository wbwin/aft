<template>
    <div class="wrapper" @viewappear="viewappear" @viewdisappear="viewdisappear">
        <!-- 导航栏 -->

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
                <text :style="GLOBAL.headerCenter"  slot="middle">添加备注</text>
                <text :style="GLOBAL.headerRight"  slot="right">完成</text>
            </wxc-minibar>
        </div>

        <!-- 备注 -->
        <div class="remarksInfo">
            <div class="content">
                <textarea class="textarea" name="remarksContent" id="" rows="3"  maxlength="50" placeholder="请输入口味、偏好等要求，不支持额外代购其他物品哦~" v-model="remarksContent" @keyup.enter="onkeyup" @input="input" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}"></textarea>
                <text class="darkGrey numberWords" :style="{fontSize:GLOBAL.defaultFS}">{{ remarksContent.length }}/50</text>
            </div>
            <text class="lightGray" :style="{fontSize:GLOBAL.defaultFS}">快捷标签</text>
            <div class="label row">
                <div class="labelBtn aiCenter jcCenter" v-for="(item,index) in labels" :class="[item.checked?'activeBtn':'']" @click="selectLabel(index)">
                    <text :style="{fontSize:GLOBAL.smallFS,color:item.checked?GLOBAL.tColor:'#999'}">{{ item.labelName }}</text>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    const modal = weex.requireModule('modal');
    const navigator=weex.requireModule('navigator')
    const event=weex.requireModule('event')
    import {WxcMinibar} from 'weex-ui';
    export default {
        components: {WxcMinibar},
        data () {
            return {
                remarksContent:"",
                // 快捷标签列表
                labels: [
                    {
                        labelName: '不吃辣',
                        checked: false
                    },
                    {
                        labelName: '少放辣',
                        checked: false
                    },{
                        labelName: '多放辣',
                        checked: false
                    },
                    {
                        labelName: '不吃辣',
                        checked: false
                    },
                    {
                        labelName: '不吃香菜',
                        checked: false
                    },
                    {
                        labelName: '不吃葱',
                        checked: false
                    }
                ],
                pageBack:false,
            }
        },

        methods:{
            // 选择快捷标签
            selectLabel(index){
                // 判断是否文本框是为空，是，标签前面就不加空格，不是就加空格
                if(this.remarksContent == ''){
                    this.remarksContent += this.labels[index].labelName
                    this.labels[index].checked = true
                }else{
                    // 添加标签后文本框的字数不能大于50
                    if(this.remarksContent.length + this.labels[index].labelName.length + 1 <= 50){
                        this.labels[index].checked = true
                        this.remarksContent = this.remarksContent + ' ' +this.labels[index].labelName
                    }else{
                        modal.toast({
                            message: '最多50字哦~',
                            duration: 0.3
                        })
                    }
                }
            },
            // 监听是否到达50个字符
            input(){
                if(this.remarksContent.length == 50){
                    modal.toast({
                        message: '最多50字哦~',
                        duration: 0.3
                    })
                }

            },
            minibarLeftButtonClick(){

            },
            minibarRightButtonClick(){
                var that=this
                var remarks=that.remarksContent
                var param=remarks
                event.delete('remarks')
                event.save('remarks',param)
                navigator.pop({animated:'true'});
            },
            viewappear(){
                var that=this
                // if (!that.pageBack) { return; }
                // that.pageBack = false;
                if(event.find('remarks')){
                    that.remarksContent=event.find('remarks')
                }
            },
            viewdisappear(){
                var that=this
                // that.pageBack = true;
            },
        }
    }
</script>

<style scoped>
    .minibar {
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: #f1f1f1;
    }
    .wrapper {
        flex-direction: column;
    }
    .minibar {
        /*border-bottom-width: 2px;*/
        /*border-bottom-style: solid;*/
        /*border-bottom-color: #f1f1f1;*/
    }
    .backImg {
        width: 40px;
        height: 40px;
    }
    /* 公共样式 */
    .row {
        flex-direction: row;
    }
    .aiCenter {
        align-items: center;
    }
    .jcCenter {
        justify-content: center;
    }
    .darkGrey {
        color: #999;
    }
    .lightGray {
        color: #999;
    }
    /* 导航栏 */
    /* 文本区域 */
    .remarksInfo {
        padding-top: 33px;
        padding-left: 33px;
        padding-right: 33px;
    }
    .content {
        height: 238px;
        border-width: 2px;
        border-style: solid;
        border-color: #cecece;
        padding-left: 20px;
        padding-right: 20px;
        padding-top: 20px;
        padding-bottom: 20px;
        margin-bottom: 50px;
        background-color: #fafafa;
    }
    .textarea {
        background-color: #fafafa;
        height: 160px;
        placeholder-color:#999;
    }
    .numberWords {
        position: absolute;
        right: 20px;
        bottom: 20px;
    }
    /* 快捷标签 */

    .label {
        margin-top: 32px;
        flex-wrap: wrap;
    }
    .labelBtn {
        border-width: 2px;
        border-style: solid;
        border-color: #d5d5d5;
        padding-top: 14px;
        padding-bottom: 14px;
        padding-left: 20px;
        padding-right: 20px;
        border-radius: 4px;
        margin-right: 20px;
        margin-bottom: 20px;
    }
    .activeBtn {
        border-width: 2px;
        border-style: solid;
        border-color: #53beb7;
        background-color: #d4fff4;
    }
</style>

