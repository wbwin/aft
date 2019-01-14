<template>
    <div class="contacts">

        <!--头部-->
        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    v-once
            >
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">通讯录好友</text>
            </wxc-minibar>
        </div>

        <!--一键关注-->
        <div class="allAttention row" @click="toTopOne">
            <text class="allAttentionText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{isAttention?'已关注全部通讯录好友':'一键关注1位通讯录好友'}}</text>
            <text class="allAttentionBtnText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}" v-if="isAttention==false" @click="allAttentionClick">全部关注</text>
        </div>

        <list class="scroller">

            <!--关注列表-->
            <cell class="attention row" :class="[index!=0?'attentionTwo':'']" v-for="(item,index) in attentionList" :key="index" ref="tostOne">
                <div class="attentionIcon">
                    <image class="attentionIcon" :src="item.image"></image>
                </div>
                <text class="attentionName" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.details}}</text>
                <text class="attentionBtn" :class="[item.attention?'attentionBtnTwo':'']" :style="{fontSize:GLOBAL.defaultFS}" @click="attentionClick(index)">{{item.attention?'已关注':'关注'}}</text>
            </cell>

            <!--由于cell标签不能用margin属性,所以这个充当margintop-->
            <cell>
                <div style="height: 20px;"></div>
            </cell>


            <!--邀请列表-->
            <header class="invitation" ref="tostTwo">
                <div class="invitationDivTwo" @click="toTopTwo">
                    <text class="invitationDivName" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{invitationList.length}}位通讯录好友可邀请</text>
                </div>
            </header>

            <cell style="background-color: #fff">
                <div class="invitationDiv row" v-for="(item,index) in invitationList" :key="index">
                    <text class="invitationDivName" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.name}}</text>
                    <text class="invitationDivText" :style="{fontSize:GLOBAL.defaultFS}">邀请</text>
                </div>
                <text class="noMore" :style="{fontSize:GLOBAL.defaultFS}" v-if="invitationList!=''">暂无更多~</text>
                <text class="noMore" :style="{fontSize:GLOBAL.defaultFS}" v-if="invitationList==''">您的通讯录还没有好友哦!</text>
            </cell>


        </list>
        <!--是否一键关注弹出层-->
        <wxc-mask height="200"
                  width="600"
                  border-radius="10"
                  duration="200"
                  mask-bg-color="#FFFFFF"
                  :has-animation="true"
                  :has-overlay="true"
                  :show-close="false"
                  :show="show"
                  @wxcMaskSetHidden="wxcMaskSetHidden">
            <div class="content">
                <text class="contentTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">确定关注{{attentionList.length}}位通讯录好友</text>
                <div class="contentBtnDiv row">
                    <text style="flex: 1;"></text>
                    <text class="contentBtnCancel" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}" @click="showCancel">取消</text>
                    <text class="contentBtnCancel" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}" @click="showConfirmClick">确定</text>
                </div>
            </div>
        </wxc-mask>
    </div>
</template>

<script>
    import { WxcPopup,WxcMask,WxcIcon,WxcMinibar,WxcPopover} from 'weex-ui';
    const animation = weex.requireModule('animation');
    const modal = weex.requireModule('modal');
    const event = weex.requireModule('event');
    const post = weex.requireModule('stream');
    const dom = weex.requireModule('dom');
    import noOrder from './noOrder.vue';

    export default {
        components: { WxcPopup,WxcMask,WxcIcon,WxcMinibar,WxcPopover,noOrder},
        data() {

            return {
                isAttention:false,//全部关注
                show:false,//显示弹出框
                attentionList:[
                    {image:'https://image.aftdc.com/images/packageA/shopImg2.jpg',type:'手机用户',details:'手机用户13610254074(千寻)',attention:false},
                    {image:'https://image.aftdc.com/images/packageA/shopImg2.jpg',type:'手机用户',details:'手机用户13610254074(千寻)',attention:false},
                    {image:'https://image.aftdc.com/images/packageA/shopImg2.jpg',type:'手机用户',details:'手机用户13610254074(千寻)',attention:false},
                    {image:'https://image.aftdc.com/images/packageA/shopImg2.jpg',type:'手机用户',details:'手机用户13610254074(千寻)',attention:false},
                    {image:'https://image.aftdc.com/images/packageA/shopImg2.jpg',type:'手机用户',details:'手机用户13610254074(千寻)',attention:false},
                    {image:'https://image.aftdc.com/images/packageA/shopImg2.jpg',type:'手机用户',details:'手机用户13610254074(千寻)',attention:false},

                ],//可关注的列表
                invitationList:[
                    {name:'千寻1'},
                    {name:'千寻2'},
                    {name:'千寻3'},
                    {name:'千寻'},
                    {name:'千寻'},
                    {name:'千寻'},
                    {name:'千寻'},
                    {name:'千寻'},
                    {name:'千寻'},
                    {name:'千寻'},
                    {name:'千寻'},
                    {name:'千寻'},
                    {name:'千寻'},
                    {name:'千寻'},
                    {name:'千寻'},
                    {name:'千寻'},
                    {name:'千寻'},
                ],//邀请列表
            }
        },

        created: function () {},
        methods:{
            toTopTwo(){
                dom.scrollToElement(this.$refs.tostTwo);
            },
            toTopOne(){
                dom.scrollToElement(this.$refs.tostOne[0]);
                // dom.scrollToElement(this.$refs.tostOne);
            },
            showConfirmClick(){
                for(var i in this.attentionList){
                    this.attentionList[i].attention=true;
                    this.isAttention=true;
                }
                this.show=false;
            },//弹出层的确定按钮
            showCancel(){
                this.show=false;
            },//弹出层的取消按钮
            allAttentionClick(){
                this.show=true;
            },//全部关注
            attentionClick(index){
                var num=0;
                if( this.attentionList[index].attention){
                    this.attentionList[index].attention=false;
                }
                else{
                    this.attentionList[index].attention=true;
                }
                for(var i in this.attentionList){
                    if(this.attentionList[i].attention==false){
                        num++
                    }
                }
                if(num>0){
                    this.isAttention=false
                }
                else{
                    this.isAttention=true;
                }
            },
            minibarLeftButtonClick(){},
            wxcMaskSetHidden(){
                this.show=false;
            }
        },
    }
</script>


<style>
    .contentBtnCancel{
        padding-top: 30px;
        padding-bottom: 30px;
        padding-left: 30px;
        padding-right: 30px;

    }
    .contentBtnDiv{

    }
    .contentTitle{
        padding-left: 40px;
        padding-top: 40px;
    }
    .content{
        justify-content: space-between;
        flex: 1;
    }
    .noMore{
        text-align: center;
        padding-top: 25px;
        padding-bottom: 25px;
        color: #999;
    }
    .invitationDivText{
        color: #f75859;
        padding-left: 25px;
        padding-right: 25px;
        padding-top: 30px;
        padding-bottom: 30px;
    }
    .invitationDivName{
        padding-top: 30px;
        padding-bottom: 30px;
        flex: 1;
    }
    .invitationDiv{
        padding-left: 25px;
        border-bottom-style: solid;
        border-bottom-width: 2px;
        border-bottom-color: #f1f1f1;
    }
    .invitationDivTwo{
        padding-left: 25px;
        border-bottom-style: solid;
        border-bottom-width: 2px;
        border-bottom-color: #f1f1f1;
        background-color: #fff;
    }
    .invitation{
        background-color: #fff;
    }
    .attentionBtnTwo{
        background-color: #53beb7;
        border-color: #53beb7;
    }
    .attentionBtn{
        width: 130px;
        padding-top: 15px;
        padding-bottom: 15px;
        background-color: #f75859;
        border-radius: 10px;
        color: #fff;
        text-align: center;
        border-style: solid;
        border-width: 1px;
        border-color: #f75859;
    }
    .attentionName{
        margin-left: 20px;
        flex: 1;
        lines:1;
        text-overflow: ellipsis;
    }
    .attentionIcon{
        width: 110px;
        height: 110px;
        border-radius: 60px;
    }
    .attentionTwo{
        border-top-style: solid;
        border-top-width: 2px;
        border-top-color: #f1f1f1;
    }
    .attention{
        padding-top: 40px;
        padding-bottom: 40px;
        padding-left: 30px;
        padding-right: 30px;
        background-color: #fff;
    }
    .allention{
        position: sticky;
    }
    .allAttention{
        justify-content: space-between;
        padding-left: 30px;
        padding-top: 30px;
        padding-bottom: 30px;
        padding-right: 30px;
        background-color: #fff;
        border-bottom-style: solid;
        border-bottom-width: 2px;
        border-bottom-color: #f1f1f1;
    }
    .scroller{
        flex: 1;
        width: 750px;
    }
    .contacts{
        background-color: #f8f8f8;
    }
    .row{
        flex-direction: row;
        align-items: center;
    }

</style>


