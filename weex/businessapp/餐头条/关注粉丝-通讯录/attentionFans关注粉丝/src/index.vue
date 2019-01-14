<template>
    <div class="attentionFans">

        <!--头部-->
        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    @wxcMinibarRightButtonClicked="toListFriends"
            >
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>

                <div class="row"  slot="middle">
                    <text class="barAttention" :class="[sliderIndex==0?'barAttentionTwo':'']" :style="GLOBAL.headerCenter" @click="barAttentionClick(0)">关注</text>
                    <text class="batFans" :class="[sliderIndex==1?'barAttentionTwo':'']" :style="GLOBAL.headerCenter" @click="barAttentionClick(1)">粉丝</text>
                </div>


                <div slot="right" class="contacts">
                    <image class="contactsList" src="https://image.aftdc.com/appBimg/addContacts.png"></image>
                    <text class="contactsListText" :style="{fontSize:GLOBAL.smallerFS}">通讯录</text>
                </div>
            </wxc-minibar>
        </div>

        <slider class="slider" :index="sliderIndex" @change="change" infinite="false" >

            <!--关注-->
            <div class="QandADiv">

                <list class="attention">
                    <!--我的问答-->
                    <!--<cell class="QandA row">-->
                        <!--<div class="QandAIcon">-->
                            <!--<image class="QandAIcon" src="https://image.aftdc.com/appBimg/icon_operation_open_shop.png"></image>-->
                        <!--</div>-->
                        <!--<text class="QandAText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">我的问答</text>-->
                    <!--</cell>-->

                    <!--<cell>-->
                        <!--<div style="height: 20px;" ref="tostAttention"></div>-->
                    <!--</cell>-->

                    <!--我的关注列表-->
                    <cell>
                        <div class="fans row" v-for="(item,index) in attentiionList" :key="index" v-if="attentiionList!=''">
                            <div class="fansIcon">
                                <image class="fansIcon" :src="item.userPhoto"></image>
                            </div>
                            <div class="fansTextDiv">
                                <text class="fansTextOne" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.userName}}</text>
                                <text class="fansTextTwo" :style="{fontSize:GLOBAL.defaultFS}">{{item.acticleMood?item.acticleMood:'这家伙很懒,什么也没留下'}}</text>
                            </div>
                            <text class="attentionBtn" :style="{fontSize:GLOBAL.smallFS}" @click="cancelAttention(index)">取消关注</text>
                        </div>
                        <noOrder img="https://image.aftdc.com/appBimg/noData.png" textOne="你还没有关注哦" textTwo="" v-if="noAttentiion"></noOrder>
                        <text class="noMore" :style="{fontSize:GLOBAL.defaultFS}" v-else-if="noMoreAttentiion">没有了</text>
                    </cell>
                </list>

            </div>

            <!--粉丝-->
            <list class="scroller">

                <!--<cell>-->
                    <!--<div class="touristDiv row" v-if="tourist>0">-->
                        <!--<text class="tourist" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">有{{tourist}}位游客关注了你</text>-->
                        <!--<image class="touristIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>-->
                    <!--</div>-->
                <!--</cell>-->

                <!--<cell>-->
                    <!--<div style="height: 20px;" ref="tostFans"></div>-->
                <!--</cell>-->

                <cell>
                    <div class="fans row" :class="[index!=fansList.length-1?'fansTwo':'']" v-for="(item,index) in fansList" :key="index" v-if="fansList!=''">
                        <div class="fansIcon">
                            <image class="fansIcon" :src="item.userPhoto"></image>
                        </div>
                        <div class="fansTextDiv">
                            <text class="fansTextOne" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.userName}}</text>
                            <text class="fansTextTwo" :style="{fontSize:GLOBAL.defaultFS}">{{item.acticleMood?item.acticleMood:'这家伙很懒,什么也没留下'}}</text>
                        </div>
                        <text class="attentionBtn" :class="[item.attention?'attentionBtnTwo':'']" :style="{fontSize:GLOBAL.smallFS}" @click="attentionClick(index)">{{item.attention?'相互关注':'关注'}}</text>
                    </div>
                    <noOrder img="https://image.aftdc.com/appBimg/noData.png" textOne="你还没有粉丝哦" textTwo="" v-if="noFans"></noOrder>
                    <text class="noMore" :style="{fontSize:GLOBAL.defaultFS}" v-else-if="noMoreFans">没有了</text>
                </cell>

            </list>

        </slider>

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
                // tourist:3,//游客关注数量
                sliderIndex:0,
                attentiionList:[],//关注的数据
                fansList:[],//粉丝数据
                fansPage:0,
                attentiionPage:0,
                noMoreAttentiion:false,
                noMoreFans:false,
                noFans:false,
                noAttentiion:false
            }
        },

        created: function () {
            this.token = weex.config.token;
            this.imei = weex.config.imei;
            this.getAttentiion()
            this.getFans()
        },
        methods:{
            //获取粉丝列表
            getFans(){
                var param = this.GLOBAL.sign(this.token,this.imei);
                param += '&page='+this.fansPage
                var that = this
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    url: 'https://www.aftdc.com/businessapp/fans/shopfans_list',
                }, function (res) {
                    if (res.data.res == 1) {
                        if (res.data.data.length>0){
                            that.fansList = that.fansList.concat(res.data.data)
                            that.fansPage += res.data.data.length()
                        }else{
                            that.noMoreFans = true
                        }
                    }else
                        that.noFans = true
                })
            },
            //获取关注的列表
            getAttentiion(){
                var param = this.GLOBAL.sign(this.token,this.imei);
                param += '&page='+this.attentiionPage
                var that = this
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    url: 'https://www.aftdc.com/businessapp/fans/attentiion_list',
                }, function (res) {
                    if (res.data.res == 1) {
                        if (res.data.data.length>0){
                            that.attentiionList = that.attentiionList.concat(res.data.data)
                            that.attentiionPage += res.data.data.length()
                        }else{
                            that.noMoreAttentiion = true
                        }
                    }else
                        that.noAttentiion =false
                })
            },
            barAttentionClick(index){
                this.sliderIndex=index;
                if(index==0){
                    dom.scrollToElement(this.$refs.tostAttention)
                }
                else{
                    dom.scrollToElement(this.$refs.tostFans)
                }
            },
            minibarLeftButtonClick(){},
            attentionClick(index){
                if(this.fansList[index].attention){
                    this.fansList[index].attention=false;
                    this.$set(this.fansList, this.fansList)

                } else{
                    this.fansList[index].attention=true;
                    this.$set(this.fansList, this.fansList)

                }
            },
            cancelAttention(index){
                this.attentiionList.splice(index,1)
            },
            change(e){
                this.sliderIndex=e.index;
            },
            toListFriends(){
              var param='';
              var url='http://assets/listFriends.js';
              event.toUrl({"url":url,"param":param})
            },
        },
    }
</script>


<style>
    .touristIcon{
        width: 20px;
        height: 20px;
    }
    .tourist{
        flex: 1;
    }
    .touristDiv{
        padding-top: 30px;
        padding-bottom: 30px;
        padding-left: 25px;
        padding-right: 25px;
        background-color: #fff;
    }
    .contacts{
        align-items: center;
        justify-content: center;
    }
    .contactsListText{
        color: #fff;
    }
    .contactsList{
        width: 35px;
        height: 35px;
    }
    .scroller{
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background-color: #f8f8f8;
    }
    .attentionBtn{
        width: 110px;
        height: 50px;
        color: #fff;
        border-radius: 8px;
        background-color: #f85959;
        text-align: center;
        line-height: 50px;
        margin-left: 20px;
        border-style: solid;
        border-width: 1px;
        border-color: #f85959;
    }
    .attentionBtnTwo{
        color: #fff;
        background-color: #53beb7;
        border-color: #53beb7;
    }
    .fansTextOne{
        flex: 1;
        lines:1;
        text-overflow: ellipsis;
    }
    .fansTextTwo{
        color: #999;
        margin-top: 10px;
        flex: 1;
        lines:1;
        text-overflow: ellipsis;
    }
    .fansTextDiv{
        margin-left: 20px;
        flex: 1;
    }
    .fansIcon{
        width: 80px;
        height: 80px;
        border-radius: 50px;
    }
    .fans{
        padding-top: 25px;
        padding-bottom: 25px;
        padding-left: 25px;
        padding-right: 25px;
        background-color: #fff;
    }
    .fansTwo{
        border-bottom-style: solid;
        border-bottom-color: #f1f1f1;
        border-bottom-width: 2px;
    }
    .noMore{
        color: #999;
        padding-top: 30px;
        padding-bottom: 30px;
        text-align: center;
    }
    .attentionTextTwo{
        color: #999;
        margin-top: 10px;
    }
    .attentionTextDiv{
        margin-left: 20px;
    }
    .attentionIconV{
        position: absolute;
        bottom: 3px;
        right: 3px;
        width: 35px;
        height: 35px;
        border-radius: 20px;
    }
    .attentionIcon{
        width: 100px;
        height: 100px;
        border-radius: 50px;
    }
    .attentionIconDiv{
        width: 100px;
        height: 100px;
        /*background-color: greenyellow;*/
        position: relative;
        justify-content: center;
        align-items: center;
    }
    .attentionCell{
        background-color: #fff;
    }
    .attentionDiv{
        padding-top: 20px;
        padding-bottom: 20px;
        padding-left: 25px;
        padding-right: 25px;
        border-bottom-style: solid;
        border-bottom-color: #dedede;
        border-bottom-width: 1px;
    }
    .attention{
        flex: 1;
        width: 750px;
    }
    .QandAText{
        margin-left: 20px;
    }
    .QandAIcon{
        width: 100px;
        height: 100px;
        border-radius: 50px;
    }
    .QandA{
        padding-top: 25px;
        padding-left: 25px;
        padding-bottom: 25px;
        background-color: #ffffff;
    }
    .QandADiv{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }
    .slider{
        flex: 1;
        width: 750px;
        position: relative;
    }
    .batFans{
        height: 89px;
        line-height: 89px;
        border-bottom-style: solid;
        border-bottom-color: #53beb7;
        border-bottom-width: 4px;
        padding-left: 20px;
        padding-right: 20px;
    }
    .barAttention{
        height: 89px;
        line-height: 89px;
        border-bottom-style: solid;
        border-bottom-color: #53beb7;
        border-bottom-width: 4px;
        padding-left: 20px;
        padding-right: 20px;
    }
    .barAttentionTwo{
        border-bottom-color: #fff;
    }
    .attentionFans{
        background-color: #f8f8f8;
    }
    .row{
        flex-direction: row;
        align-items: center;
    }

</style>


