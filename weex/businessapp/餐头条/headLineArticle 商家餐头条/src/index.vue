<template>
    <div class="wrapper" @viewappear="viewappear" @viewdisappear="viewdisappear"@click="bubbleHide">
        <!-- 导航栏 -->
        <div>
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    @wxcMinibarRightButtonClicked="minibarRightButtonClick"
            >
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter" class="headerCenter"   slot="middle">{{ shopInfo.shopName }}</text>
                <image class="backImg" slot="right"
                       src="https://image.aftdc.com/appBimg/ic_photograph.png"></image>
            </wxc-minibar>
        </div>
        <list  class="page" v-bind:style="{padding:padding}" offset-accuracy="30" @scroll="onscroll">
            <refresh class="refresh" @refresh="refresh" :display="refreshing ? 'show' : 'hide'">
                <loading-indicator class="indicator"></loading-indicator>
            </refresh>

            <cell class="header" @click="bubbleHide">
                <!-- header个人信息 -->
                <div class="headerBottom">

                    <div class="personalInfo">
                        <!--<text class="personalName" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">{{ shopInfo.shopName }}</text>-->
                        <div style="flex-direction: row;padding-bottom: 20px;padding-top: 20px;">
                            <div class="userImgBox">
                                <image class="userImg"
                                       :src="'https://image.aftdc.com/'+shopInfo.shopImg"></image>
                            </div>
                            <div style="flex: 3;padding-right: 20px;padding-left: 20px;flex-direction: column;justify-content: space-between">

                                <div class="row aiCenter personalInfoText" style="justify-content: space-between;">
                                    <div class="" @click="attentionFans">
                                        <text class="numText" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.tColor}">{{ shopInfo.attentionNum }}</text>
                                        <text class="gray mt10 attentionText" :style="{fontSize:GLOBAL.defaultFS}">&nbsp;关注</text>
                                    </div>
                                    <div class="m24" @click="attentionFans">
                                        <text class="numText" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.tColor}">{{ shopInfo.fansNum }}</text>
                                        <text class="gray mt10 attentionText" :style="{fontSize:GLOBAL.defaultFS}">&nbsp;粉丝</text>
                                    </div>
                                    <div class="">
                                        <text class="numText" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.tColor}">{{ shopInfo.dongTai }}</text>
                                        <text class="gray mt10 attentionText" :style="{fontSize:GLOBAL.defaultFS}">&nbsp;动态</text>
                                    </div>
                                </div>

                                <div class="row aiCenter" style="margin-top: 10px;justify-content: space-between;margin-left: 25px">
                                    <!--<text class="apply" :style="{fontSize:GLOBAL.bigFS}" @click="applyClick">申请认证</text>-->
                                    <!--<text class="buttom" :style="{fontSize:GLOBAL.bigFS}" @click="invitationClick">邀请</text>-->
                                    <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">餐头条ID : {{shopInfo.acticleAccount}}</text>
                                </div>
                            </div>
                            <!--<div style="flex: 2.5">-->
                            <!---->
                            <!--</div>-->
                        </div>


                        <!--<div class="row aiCenter" v-if="shopInfo.certification==1">-->
                        <!--<div class="authenticationIcon">-->
                        <!--<image class="authenticationIcon" src="https://image.aftdc.com/images/daV.png"></image>-->
                        <!--</div>-->
                        <!--<text class="personalInfoText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">认证: {{shopInfo.shopName}}官方餐头条号</text>-->
                        <!--</div>-->

                        <div class="row" @click="editMood">
                            <div class="authenticationIcon" style="border-radius: 0;margin-top: 10px">
                                <image class="authenticationIcon" style="border-radius: 0;" src="https://image.aftdc.com/appBimg/icon_leaveWord.png"></image>
                            </div>
                            <text class="personalInfoText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}" style="width: 80px">签名 : </text>
                            <text class="personalInfoText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}" style="width: 580px">{{ shopInfo.acticleMood }}</text>
                        </div>

                    </div>
                </div>
            </cell>
            <cell class="stickyHeader"  ref="footer">
                <!--全部文章,视频,回收站导航栏-->
                <div class="toggle row" @click="bubbleHide">
                    <div class="toggleBtn " :class="[sliderIndex == 0?'toggleBtnActive':'toggleBtnActiveWhite']"
                         @click="toggle(0)">
                        <text :style="{fontSize:GLOBAL.biggerFS,color:sliderIndex==0?GLOBAL.tColor:GLOBAL.dColor}">全部文章</text>
                    </div>
                    <div class="toggleBtn" :class="[sliderIndex == 1?'toggleBtnActive':'toggleBtnActiveWhite']"
                         @click="toggle(1)">
                        <text :style="{fontSize:GLOBAL.biggerFS,color:sliderIndex==1?GLOBAL.tColor:GLOBAL.dColor}">视频</text>
                    </div>
                    <!--<div class="toggleBtn" :class="[sliderIndex == 2?'toggleBtnActive':'toggleBtnActiveWhite']"-->
                    <!--@click="toggle(2)">-->
                    <!--<text :style="{fontSize:GLOBAL.biggerFS,color:sliderIndex==2?GLOBAL.tColor:GLOBAL.dColor}">视频</text>-->
                    <!--</div>-->
                    <div class="toggleBtn" :class="[sliderIndex == 2?'toggleBtnActive':'toggleBtnActiveWhite']"
                         @click="toggle(2)">
                        <text  :style="{fontSize:GLOBAL.biggerFS,color:sliderIndex==2?GLOBAL.tColor:GLOBAL.dColor}">回收站</text>
                    </div>
                </div>

            </cell>
            <cell class="cell">
                <!--文章与视频内容区-->
                <slider class="slider" infinite="false"  :index="sliderIndex" keep-index="true" @change="sliderCharge"  :style="{minHeight: minHeight-184+'px'}">

                    <!-- 文章内容 -->
                    <div class="piece" @click="bubbleHide" :style="{height:sliderIndex===1||sliderIndex===2?minHeight-184+'px':''}">
                        <div class="headLineContent" v-for="(item,index) in article">
                            <div class="contentStyle" >
                                <div v-if="item.cover_type!=1">
                                    <text :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">{{item.title}}</text>
                                    <div class="coverImgStyle">
                                        <div class="threeImg" v-if="item.cover_type==3&&item.cover_img" @click="previewClick(item.id)">
                                            <image resize="cover"  class="threeImgSize"
                                                   :src="'https://image.aftdc.com/'+item.cover_img[0]"></image>
                                            <image resize="cover"  class="threeImgSize"
                                                   :src="'https://image.aftdc.com/'+item.cover_img[1]"></image>
                                            <image resize="cover"  class="threeImgSize"
                                                   :src="'https://image.aftdc.com/'+item.cover_img[2]"></image>
                                        </div>
                                        <div class="bigImg" v-if="item.cover_type==2">
                                            <image resize="cover"  v-if="item.cover_img" class="bigImgSize" :src="'https://image.aftdc.com/'+item.cover_img[0]" @click="previewClick(item.id)"></image>
                                        </div>
                                        <div class="videoImg" v-if="item.cover_type==5">
                                            <image resize="cover"  v-if="item.cover_img" class="bigImgSize" :src="'https://image.aftdc.com/'+item.cover_img[0]"></image>
                                            <div class="videoPlay"></div>
                                            <image class="videoPlayImg"
                                                   src="https://image.aftdc.com/appBimg/icon_vadeoPlay.png"></image>
                                        </div>
                                    </div>
                                </div>
                                <div class="smallImgContent" v-if="item.cover_type==1" @click="previewClick(item.id)">
                                    <text class="smallImgeText" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">{{item.title}}</text>
                                    <image resize="cover"  v-if="item.cover_img" class="smallImgSize" :src="'https://image.aftdc.com/'+item.cover_img[0]"></image>
                                </div>
                                <div class="articleMessage row aiCenter">
                                    <div class="shopAnTime">
                                        <!--<text class="shopAnTimeSize" :style="{fontSize:GLOBAL.defaultFS}">{{shopInfo.shopName}}</text>-->
                                        <text class="shopAnTimeSize" :style="{fontSize:GLOBAL.defaultFS}">{{item.read_num}}阅读</text>
                                        <text class="shopAnTimeSize" v-if="item.is_video" :style="{fontSize:GLOBAL.defaultFS}">{{item.read_num}}播放</text>
                                        <text class="shopAnTimeSize" :style="{fontSize:GLOBAL.defaultFS}">{{item.comment_num}}{{item.commentOrleaveWord==1?'评论':'留言'}}</text>
                                        <text class="shopAnTimeSize" :style="{fontSize:GLOBAL.defaultFS}">{{item.praise_num}}点赞</text>
                                        <text class="shopAnTimeSize" :style="{fontSize:GLOBAL.defaultFS}">{{item.timestamp}}</text>
                                        <text class="settop" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}" v-if="item.open==0">草稿</text>
                                        <text class="settop" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}" v-else-if="item.open==2">不公开</text>
                                        <text class="settop" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}" v-else-if="item.isCheck==0">审核中</text>
                                        <text class="settop" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}" @click="auditReasonsShowClick(item.checkResult)" v-else-if="item.isCheck==1&&item.checkResult">审核失败</text>
                                        <text class="settop" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}" v-else-if="item.top>0">置顶</text>
                                        <!--当接口的数据 article 里面加上settop 等于0 或1,用v-if判断上面的text组件,当settop为0时显示,为1时隐藏-->
                                    </div>
                                    <div class="dianIconDiv" @click.stop="" @click="dianIconClick(index,item.id)">
                                        <image class="dianIcon" src="https://image.aftdc.com/appBimg/ellipsis_icon.png"></image>
                                    </div>

                                </div>
                            </div>

                            <!--气泡菜单-->
                            <div class="dianBigDiv" ref="dianTast">
                                <div class="jiaoDiv"></div>
                                <div class="dianIconFlex row aiCenter">
                                    <text class="dianIconFlexText borBtn"  :style="{fontSize:GLOBAL.defaultFS}" @click="" v-if="item.isCheck==1&&item.open==1&&item.isShow==1">分享</text>
                                    <text class="dianIconFlexText borBtn"  :style="{fontSize:GLOBAL.defaultFS,flex:item.top==0?1:1.6}" @click="settopClick(index)" v-if="item.open==1&&item.isShow==1">{{item.top==0?'置顶':'取消置顶'}}</text>

                                    <!--当接口的数据 article 里面加上settop 等于0 或1,用v-if判断上面的text组件,当settop为0时显示,为1时隐藏,js事件还没有写,需要您补充-->
                                    <text class="dianIconFlexText borBtn"  :style="{fontSize:GLOBAL.defaultFS,}" @click="editClick(index)">编辑</text>
                                    <!--<text class="dianIconFlexText borBtn"  :style="{fontSize:GLOBAL.defaultFS,}">预览</text>-->
                                    <text class="dianIconFlexText"  :style="{fontSize:GLOBAL.defaultFS,color:'red'}" @click="delClick(index,1)">删除</text>
                                </div>

                                <div class="jiaoDivTwo"></div>
                            </div>
                        </div>
                    </div>

                    <!-- 视频 -->
                    <div class="aiCenter w750" @click="bubbleHide" :style="{height:sliderIndex===0||sliderIndex===2?minHeight-184+'px':''}">
                        <div class="headLineContent" v-for="(item,index) in video">
                            <div class="contentStyle" >
                                <div class="coverImgStyle">
                                    <div class="videoImg" @click="previewClick(item.id)">
                                        <image resize="cover" v-if="item.cover_img" class="bigImgSize" :src="'https://image.aftdc.com/'+item.cover_img[0]"></image>
                                        <div class="videoPlay"></div>
                                        <image class="videoPlayImg"
                                               src="https://image.aftdc.com/appBimg/icon_vadeoPlay.png"></image>
                                        <div class="titleSize">
                                            <text class="titleText" >{{item.title}}</text>
                                        </div>
                                    </div>
                                </div>
                                <div class="articleMessage row aiCenter">
                                    <div class="shopAnTime">
                                        <text class="shopAnTimeSize" :style="{fontSize:GLOBAL.defaultFS}">{{item.read_num}}播放</text>
                                        <text class="shopAnTimeSize" :style="{fontSize:GLOBAL.defaultFS}">{{item.comment_num}}{{item.commentOrleaveWord==1?'评论':'留言'}}</text>
                                        <text class="shopAnTimeSize" :style="{fontSize:GLOBAL.defaultFS}">{{item.praise_num}}点赞</text>
                                        <text class="shopAnTimeSize" :style="{fontSize:GLOBAL.defaultFS}">{{item.timestamp}}</text>
                                        <text class="settop" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}" v-if="item.open==0">草稿</text>
                                        <text class="settop" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}" v-else-if="item.open==2">不公开</text>
                                        <text class="settop" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}" v-else-if="item.isCheck==0">审核中</text>
                                        <text class="settop" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}" @click="auditReasonsShowClick(item.checkResult)" v-else-if="item.isCheck==1&&item.checkResult">审核失败</text>
                                        <text class="settop" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}" v-else-if="item.top>0">置顶</text>
                                        <!--当接口的数据 article 里面加上settop 等于0 或1,用v-if判断上面的text组件,当settop为0时显示,为1时隐藏-->
                                    </div>
                                    <div class="dianIconDiv" @click.stop="" @click="videoDianIconClick(index,item.id)">
                                        <image class="dianIcon" src="https://image.aftdc.com/appBimg/ellipsis_icon.png"></image>
                                    </div>
                                </div>
                            </div>

                            <!--气泡菜单-->
                            <div class="dianBigDiv" ref="videoDianTast">
                                <div class="jiaoDiv"></div>
                                <div class="dianIconFlex row aiCenter">
                                    <text class="dianIconFlexText borBtn"  :style="{fontSize:GLOBAL.defaultFS}" @click="" v-if="item.isCheck==1&&item.open==1&&item.isShow==1">分享</text>
                                    <text class="dianIconFlexText borBtn"  :style="{fontSize:GLOBAL.defaultFS,flex:item.top==0?1:1.6}" @click="settopClick(index)" v-if="item.open==1&&item.isShow==1">{{item.top==0?'置顶':'取消置顶'}}</text>

                                    <!--当接口的数据 article 里面加上settop 等于0 或1,用v-if判断上面的text组件,当settop为0时显示,为1时隐藏,js事件还没有写,需要您补充-->
                                    <text class="dianIconFlexText borBtn"  :style="{fontSize:GLOBAL.defaultFS,}" @click="editClick(index)">编辑</text>
                                    <!--<text class="dianIconFlexText borBtn"  :style="{fontSize:GLOBAL.defaultFS,}">预览</text>-->
                                    <text class="dianIconFlexText"  :style="{fontSize:GLOBAL.defaultFS,color:'red'}" @click="delClick(index,2)">删除</text>
                                </div>

                                <div class="jiaoDivTwo"></div>
                            </div>
                        </div>
                    </div>

                    <!--回收站-->
                    <div class="aiCenter w750" @click="bubbleHide" :style="{height:sliderIndex===0||sliderIndex===1?minHeight-184+'px':''}">
                        <!--回收站文章-->
                        <div class="headLineContent" v-for="(item,index) in recycled">
                            <div class="contentStyle"  @click="previewClick(item.id)">
                                <div v-if="item.cover_type!=1">
                                    <text class="smallImgeText" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}"  v-if="item.cover_type!=5">{{item.title}}</text>
                                    <div class="coverImgStyle">
                                        <div class="threeImg" v-if="item.cover_type==3&&item.cover_img">
                                            <image resize="cover"  class="threeImgSize"
                                                   :src="'https://image.aftdc.com/'+item.cover_img[0]"></image>
                                            <image resize="cover"  class="threeImgSize"
                                                   :src="'https://image.aftdc.com/'+item.cover_img[1]"></image>
                                            <image resize="cover"  class="threeImgSize"
                                                   :src="'https://image.aftdc.com/'+item.cover_img[2]"></image>
                                        </div>
                                        <div class="bigImg" v-if="item.cover_type==2&&item.cover_img">
                                            <image resize="cover"  class="bigImgSize"
                                                   :src="'https://image.aftdc.com/'+item.cover_img[0]"></image>
                                        </div>
                                        <div class="videoImg" v-if="item.cover_type==5">
                                            <image resize="cover"  class="bigImgSize" v-if="item.cover_img"
                                                   :src="'https://image.aftdc.com/'+item.cover_img[0]"></image>
                                            <div class="videoPlay"></div>
                                            <image class="videoPlayImg"
                                                   src="https://image.aftdc.com/appBimg/icon_vadeoPlay.png"></image>
                                            <div class="titleSize">
                                                <text class="titleText" >{{item.title}}</text>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="smallImgContent" v-if="item.cover_type==1">
                                    <text class="smallImgeText" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">{{item.title}}</text>
                                    <image resize="cover"  v-if="item.cover_img" class="smallImgSize" :src="'https://image.aftdc.com/'+item.cover_img[0]"></image>
                                </div>
                                <div class="articleMessage row aiCenter">
                                    <div class="shopAnTime">
                                        <!--<text class="shopAnTimeSize" :style="{fontSize:GLOBAL.defaultFS}">{{shopInfo.shopName}}</text>-->
                                        <text class="shopAnTimeSize" :style="{fontSize:GLOBAL.defaultFS}">{{item.read_num}}{{item.is_video===1?'播放':'阅读'}}</text>
                                        <text class="shopAnTimeSize" :style="{fontSize:GLOBAL.defaultFS}">{{item.comment_num}}{{item.commentOrleaveWord==1?'评论':'留言'}}</text>
                                        <text class="shopAnTimeSize" :style="{fontSize:GLOBAL.defaultFS}">{{item.praise_num}}点赞</text>
                                        <text class="shopAnTimeSize" :style="{fontSize:GLOBAL.defaultFS}">{{item.timestamp}}</text>
                                        <text class="settop" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}" v-if="item.open==0">草稿</text>
                                        <text class="settop" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}" v-else-if="item.open==2">不公开</text>
                                        <text class="settop" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}" v-else-if="item.isCheck==0">审核中</text>
                                        <text class="settop" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}" @click="auditReasonsShowClick(item.checkResult)" v-else-if="item.isCheck==1&&item.checkResult">审核失败</text>
                                        <text class="settop" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}" v-else-if="item.top>0">置顶</text>
                                        <!--当接口的数据 article 里面加上settop 等于0 或1,用v-if判断上面的text组件,当settop为0时显示,为1时隐藏-->
                                    </div>
                                    <div class="dianIconDiv" v-if="item.is_video" @click.stop="" @click="VrecoveryDianIconClick(index,item.id)">
                                        <image class="dianIcon" src="https://image.aftdc.com/appBimg/ellipsis_icon.png"></image>
                                    </div>
                                    <div class="dianIconDiv" v-else @click.stop="" @click="ArecoveryDianIconClick(index,item.id)">
                                        <image class="dianIcon" src="https://image.aftdc.com/appBimg/ellipsis_icon.png"></image>
                                    </div>

                                </div>
                            </div>

                            <!--气泡菜单-->

                            <div class="dianBigDiv" ref="ArecoverydianTast">
                                <div class="jiaoDiv"></div>
                                <div class="dianIconFlexTwo row aiCenter">
                                    <text class="dianIconFlexTwoText borBtn"  :style="{fontSize:GLOBAL.defaultFS,}" @click="editClick(index)">编辑</text>
                                    <text class="dianIconFlexTwoText borBtn"  :style="{fontSize:GLOBAL.defaultFS,}" @click="recoveryClick(index,item.id)" v-if="item.open!=0&&!item.checkResult">恢复</text>
                                    <text class="dianIconFlexTwoText borBtn"  :style="{fontSize:GLOBAL.defaultFS,color:'red'}" @click="delClick(index,3)">彻底删除</text>
                                </div>

                                <div class="jiaoDivTwo"></div>
                            </div>
                        </div>
                    </div>


                </slider>
            </cell>
            <loading class="loading" @loading="loadmore" :display="loadinging ? 'show' : 'hide'">
                <text class="indicator-text">{{loadText}}</text>
            </loading>
        </list>

        <!--是否确认置顶提示框-->
        <wxc-mask height="240"
                  width="600"
                  border-radius="10"
                  duration="200"
                  mask-bg-color="#FFFFFF"
                  :has-animation="true"
                  :has-overlay="true"
                  :show-close="false"
                  :show="settopShow"
                  @wxcMaskSetHidden="wxcMaskSetHidden">
            <div class="dianDelDiv" @click="">
                <text class="dianDelTips" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">提示</text>
                <text class="dianDelDetails" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{articleOrVideo==0?topYes==0?'是否置顶该文章':'是否取消置顶该文章':videoTopYes==0?'是否置顶该视频':'是否取消置顶该视频'}}</text>
                <div class="dianDelBtn row aiCenter">
                    <text style="flex: 1;"></text>
                    <text class="dianDelBtnCancel" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}" @click="settopCancelClick">否</text>
                    <text class="dianDelBtnCancel" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}"  @click="settopConfirmClick()">是</text>
                </div>
            </div>
        </wxc-mask>

        <!--是否确认删除文章提示框-->
        <wxc-mask height="240"
                  width="600"
                  border-radius="10"
                  duration="200"
                  mask-bg-color="#FFFFFF"
                  :has-animation="true"
                  :has-overlay="true"
                  :show-close="false"
                  :show="confirmShow"
                  @wxcMaskSetHidden="wxcMaskSetHidden">
            <div class="dianDelDiv" @click="">
                <text class="dianDelTips" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">提示</text>
                <text class="dianDelDetails" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{articleOrVideo==0?'是否删除该文章':articleOrVideo==1?'是否删除该视频':articleOrVideo==2?'是否彻底删除该文章':articleOrVideo==3?'是否彻底删除该视频':''}}</text>
                <div class="dianDelBtn row aiCenter">
                    <text style="flex: 1;"></text>
                    <text class="dianDelBtnCancel" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}" @click="dianDelBtnCancelClick">否</text>
                    <text class="dianDelBtnCancel" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}" @click="dianDelBtnConfirmClick()">是</text>
                </div>
            </div>
        </wxc-mask>
        <!--审核失败原因提示框-->
        <wxc-mask height="300"
                  width="600"
                  border-radius="10"
                  duration="200"
                  mask-bg-color="#FFFFFF"
                  :has-animation="true"
                  :has-overlay="true"
                  :show-close="false"
                  :show="auditReasonsShow"
                  @wxcMaskSetHidden="wxcMaskSetHidden">
            <div class="auditReasons" @click="">
                <text class="auditReasonsTitle" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">审核失败原因</text>
                <text class="auditReasonsDetails" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{checkResult}}</text>
                <text class="auditReasonsSureButton" @click="auditReasonsSureButtonClick" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor}">确定</text>
            </div>
        </wxc-mask>

        <wxc-popover ref="wxc-popover"
                     :buttons="btns"
                     :position="popoverPosition"
                     :arrowPosition="popoverArrowPosition"
                     @wxcPopoverButtonClicked="popoverButtonClicked"></wxc-popover>
        <toast ref="toast"></toast>
        <!--<share ref="share"></share>-->
        <div class="bigBox" ref="box"></div>
    </div>
</template>

<script>
    import { WxcPopup,WxcMask,WxcIcon,WxcMinibar,WxcPopover} from 'weex-ui';
    import Toast from './Toast.vue';
    // import Share from './Share.vue';
    const animation = weex.requireModule('animation');
    const event = weex.requireModule('event');
    const post = weex.requireModule('stream');
    const dom = weex.requireModule('dom');
    const modal = weex.requireModule('modal')

    export default {
        data() {
            return {
                minHeight: 0,//给slider高度一个最小值
                once: false,//执行一次给minHeight赋值

                loadText:'加载中',
                topYes:0,//是否是已置顶的文章
                settopShow:false,//置顶提示框
                confirmShow:false,//确认删除文章提示框
                briding:'',//点击....获取该index
                bridingTwo:0,
                loadinging:false,
                videoText:true,//用于显示视频区在滚动时标题的显示隐藏


                videoBriding:'',//点击视频。。。时的index
                ArecoveryBriding:'',//点击回收站文章.....时的index
                // VrecoveryBriding:'',//点击回收站视频.....时的index
                videoTopYes:0,//是否是已置顶的视频

                articleOrVideo:'',//0为点击文章的。。。;1为点击视频的。。。

                auditReasonsShow:false,//审核失败原因提示框
                // 模板数据
                padding: 0,
                showHeader: true,

                // 底部弹层
                isBottomShow: false,
                ani:{
                    timingFunction: 'ease'
                },
                // 拉黑弹出层
                show: false,
                overlayCanClose: true,
                isFalse: false,
                hasAnimation: true,
                overlay: {
                    duration: 150
                },
                // slider索引值
                sliderIndex: 0,

                sliderIndexTwo:0,
                // 关注与拉黑
                follow: false,
                pullBlack: false,
                video: [],
                article: [],
                recycled:[],
                shopInfo: {
                    acticleMood: "",
                    attentionNum: 0,
                    dongTai:0,
                    certification: 1,
                    fansNum: 0,
                    shopImg: "",
                    shopName: ""
                },
                btns:[
                    { icon: 'https://image.aftdc.com/appBimg/icon_articlePicture.png', text:'发图文        ' },
                    { icon: 'https://image.aftdc.com/appBimg/icon_articleVideo.png', text:'拍小视频    ' },
                    { icon: 'https://image.aftdc.com/appBimg/uploadVideo.png', text:'上传视频' },
                    { icon: 'https://image.aftdc.com/appBimg/icon_vote.png', text:'投票', },
                ],
                popoverPosition:{x:-16,y:50},
                popoverArrowPosition:{pos:'top',x:-14},
                allArticle:false,
                allVideo:false,
                allRecycled:false,
                pageA:0,
                pageV:0,
                pageR:0,
                pageBack: false,
                refreshing:false,
                checkResult:'',
                token: '',
                imei: '',
                index: 0,
                type: 0,
            }
        },
        components: { WxcPopup,WxcMask,WxcIcon,WxcMinibar,WxcPopover,Toast},

        created: function () {
            this.token = weex.config.token;
            this.imei = weex.config.imei;
            this.refresh()

            var that = this
            event.init();
        },
        methods: {
            // completelyDelClick(index){
            //
            // },
            // videoScrollTop(){
            //     dom.scrollToElement(this.$refs.videoTast)
            // },
            // appear(){
            //     this.videoText=false;
            // },
            // disappear(){
            //     this.videoText=true;
            // },
            //刷新数据
            refresh(){
                this.allArticle=false;
                this.allVideo=false;
                this.allRecycled=false;
                // this.allRecovery=false
                this.loadText = '加载中'

                this.refreshing = true
                var param = this.GLOBAL.sign(this.token,this.imei);
                var that = this
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    url: 'https://www.aftdc.com/businessapp/Article/shopArticle',
                }, function (res) {
                    if (res.data.res == 1) {
                        that.refreshing = false
                        that.video = res.data.video;
                        that.article = res.data.article;
                        that.recycled=res.data.recycled;//获取回收站数据
                        that.shopInfo = res.data.shopInfo

                        if (res.data.video){
                            that.pageV = res.data.video.length;
                        } else {
                            that.allVideo = true
                        }
                        if (res.data.article){
                            that.pageA = res.data.article.length;
                        } else {
                            that.allArticle = true
                        }
                        if (res.data.recycled){
                            that.pageR = res.data.recycled.length;
                        } else {
                            that.allRecycled = true
                        }
                    }
                })
            },
            /*上拉加载*/
            loadmore () {
                var that = this;
                var param = that.GLOBAL.sign(that.token,that.imei);
                that.loadinging = true;

                if (that.sliderIndex == 0 ) {
                    if (!that.allArticle) {
                        this.loadText = '加载中';
                        param +='&page='+that.pageA+'&moreType=1';
                        post.fetch({
                            method: 'POST',
                            type: 'json',
                            body: param,
                            headers: {"Content-Type": "application/x-www-form-urlencoded"},
                            url: 'https://www.aftdc.com/businessapp/Article/moreShopArticle',
                        }, function (res) {
                            that.loadinging = false
                            if (res.data.res == 1) {
                                console.log(res)
                                that.article = that.article.concat(res.data.data)
                                that.pageA = that.pageA + res.data.data.length
                            } else {
                                that.allArticle=true
                            }
                        })
                    }else{
                        setTimeout(()=>{this.loadinging = false}, 1000);
                        this.allArticle=true
                        this.loadText = '我是有底线的'
                    }
                }

                if (that.sliderIndex == 1) {
                    if (!that.allVideo) {
                        this.loadText = '加载中';
                        param +='&page='+that.pageV+'&moreType=2';
                        post.fetch({
                            method: 'POST',
                            type: 'json',
                            body: param,
                            headers: {"Content-Type": "application/x-www-form-urlencoded"},
                            url: 'https://www.aftdc.com/businessapp/Article/moreShopArticle',
                        }, function (res) {
                            that.loadinging = false
                            if (res.data.res == 1) {
                                that.video = that.video.concat(res.data.data)
                                that.pageV = that.pageV + res.data.data.length
                            } else {
                                that.allVideo= true
                            }
                        })
                    }else{
                        setTimeout(()=>{this.loadinging = false}, 1000);
                        this.allVideo=true
                        this.loadText = '我是有底线的'
                    }
                }

                if (that.sliderIndex == 2) {
                    if (!that.allVideo) {
                        this.loadText = '加载中';
                        param +='&page='+that.pageV+'&moreType=3';
                        post.fetch({
                            method: 'POST',
                            type: 'json',
                            body: param,
                            headers: {"Content-Type": "application/x-www-form-urlencoded"},
                            url: 'https://www.aftdc.com/businessapp/Article/moreShopArticle',
                        }, function (res) {
                            that.loadinging = false
                            if (res.data.res == 1) {
                                that.video = that.video.concat(res.data.data)
                                that.pageV = that.pageV + res.data.data.length
                            } else {
                                that.allVideo= true
                            }
                        })
                    }else{
                        setTimeout(()=>{this.loadinging = false}, 1000);
                        this.allVideo=true
                        this.loadText = '我是有底线的'
                    }
                }
            },

            applyClick(){

            },
            // invitationClick(){
            //     const share = this.$refs.share;
            //     share.show('邀请',true,false,false,false,true,false,'/page/homePage/pages/shopdetail/shopdetail?shopId='+event.find('shopId'),'',this.shopInfo.shopName,'https://image.aftdc.com/'+this.shopInfo.shopImg);
            //     //1:标题,空默认为分享，2:微信，3:朋友圈，4:QQ，5:空间，6:通讯录，7:更多 2-7至少设置一个为false
            //     //8:小程序链接，9:网页链接，10:分享出去的标题，11:图片
            // },

            settopCancelClick(){
                this.settopShow=false;
                this.briding=''
                this.videoBriding='';
            },//取消置顶置顶
            settopConfirmClick(){
                var that = this
                this.settopShow=false;

                if((that.topYes==0&&that.articleOrVideo==0)||(that.videoTopYes==0&&that.articleOrVideo==1)){//文章且置顶
                    var param = this.GLOBAL.sign(this.token,this.imei);
                    param +='&id='+this.articleId

                    post.fetch({
                        method: 'POST',
                        type: 'json',
                        body: param,
                        headers: {"Content-Type": "application/x-www-form-urlencoded"},
                        url: 'https://www.aftdc.com/businessapp/Article/topArticle',
                    }, function (res) {
                        if (res.data.res == 1) {
                            that.refresh()
                            that.briding='';
                        };
                    })
                }else{//文章且取消置顶
                    that.settopConfirmClickTwo()
                }

            },//置顶的确认按钮
            settopConfirmClickTwo(){
                this.settopShow=false;
                var param = this.GLOBAL.sign(this.token,this.imei);
                param +='&id='+this.articleId
                var that = this

                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    url: 'https://www.aftdc.com/businessapp/Article/cancelTop',
                }, function (res) {
                    if (res.data.res == 1) {
                        that.refresh()
                        that.briding='';
                    };
                })
            },//取消置顶的确认按钮

            dianDelBtnCancelClick(){
                this.confirmShow=false;
                this.briding='';
                this.videoBriding='';
                this.ArecoveryBriding='';
            },//取消删除文章

            dianDelBtnConfirmClick(){
                var that = this;
                var index = that.index;
                var type = that.type;
                var id = 0;
                var param = this.GLOBAL.sign(this.token,this.imei);
                const toast=that.$refs.toast;
                this.confirmShow=false;

                if(type===1||type==2){

                    if (type === 1) id = that.article[index]['id'];//全部文章
                    else id = that.video[index]['id'];//视频

                    param += '&id=' + id;
                    post.fetch({
                        method: 'POST',
                        type: 'json',
                        body: param,
                        headers: {"Content-Type": "application/x-www-form-urlencoded"},
                        url: 'https://www.aftdc.com/businessapp/Article/deleteArticle',
                    }, function (res) {
                        if (res.data.res == 1) {
                            toast.editContent('删除成功');
                            that.refresh()
                        } else {
                            toast.editContent('删除失败，请稍后再试');
                        }
                    })

                }
                else if(type==3){

                    id = that.recycled[index]['id'];

                    param += '&id=' + id;
                    post.fetch({
                        method: 'POST',
                        type: 'json',
                        body: param,
                        headers: {"Content-Type": "application/x-www-form-urlencoded"},
                        url: 'https://www.aftdc.com/businessapp/Article/confirmDelArticle',
                    }, function (res) {
                        if (res.data.res == 1) {
                            toast.editContent('删除成功');
                            that.refresh()
                        } else {
                            toast.editContent('删除失败，请稍后再试');
                        }
                    })

                }
            },//删除文章(回收站的彻底删除事件还没写)

            auditReasonsShowClick(checkResult){
                this.auditReasonsShow=true
                this.checkResult = checkResult
            },
            wxcMaskSetHidden(){
                this.confirmShow=false;
                this.settopShow=false;
                this.auditReasonsShow=false
            },
            auditReasonsSureButtonClick(){
                var that=this
                that.auditReasonsShow=false
            },
            // 气泡菜单动画
            moveShow(index) {
                var testEl = this.$refs.dianTast[index];
                animation.transition(testEl, {
                    styles: {
                        transform: 'scale(1)',
                        opacity:1,
                        transformOrigin: '700 80%'
                    },
                    duration: 300, //ms
                    timingFunction: 'ease',
                    delay: 0 //ms
                })
            },
            ArecoveryMoveShow(index){
                if (index!=='') {
                    var testEl = this.$refs.ArecoverydianTast[index];
                    animation.transition(testEl, {
                        styles: {
                            transform: 'scale(1)',
                            opacity:1,
                            transformOrigin: '700 80%'
                        },
                        duration: 300, //ms
                        timingFunction: 'ease',
                        delay: 0 //ms
                    })
                }
            },
            moveHide() {
                var testEl = this.$refs.dianTast[this.briding];
                animation.transition(testEl, {
                    styles: {
                        transform: 'scale(0.001)',
                        opacity:0.1,
                        transformOrigin: '700 80%'
                    },
                    duration: 300, //ms
                    timingFunction: 'ease',
                    delay: 0 //ms
                })
            },
            ArecoveryMoveHide(index) {
                var testEl = this.$refs.ArecoverydianTast[this.ArecoveryBriding];
                animation.transition(testEl, {
                    styles: {
                        transform: 'scale(0.001)',
                        opacity:0.1,
                        transformOrigin: '700 80%'
                    },
                    duration: 300, //ms
                    timingFunction: 'ease',
                    delay: 0 //ms
                })
            },
            // 气泡菜单动画
            videoMoveHide() {
                var testEl = this.$refs.videoDianTast[this.videoBriding];
                animation.transition(testEl, {
                    styles: {
                        transform: 'scale(0.001)',
                        opacity:0.1,
                        transformOrigin: '220 300'
                    },
                    duration: 300, //ms
                    timingFunction: 'ease',
                    delay: 0 //ms
                })
            },
            videoMoveShow(index) {
                var testEl = this.$refs.videoDianTast[index];
                animation.transition(testEl, {
                    styles: {
                        transform: 'scale(1)',
                        opacity:1,
                        transformOrigin: '220 300'
                    },
                    duration: 300, //ms
                    timingFunction: 'ease',
                    delay: 0 //ms
                })
            },
            delClick(index,type){
                this.index = index;
                this.type = type;
                if(type == 1)
                {
                    this.moveHide();
                }
                else if(type==2)
                {
                    this.videoMoveHide();
                }
                else if(type==3)
                {
                    this.ArecoveryMoveHide();
                }
                // else if(type==4)
                // {
                //     this.VrecoveryMoveHide();
                // }

                this.confirmShow=true;
            },//气泡菜单的删除

            recoveryClick(index,id){
                this.bubbleHide();
                var that = this;
                var param = this.GLOBAL.sign(this.token,this.imei);
                const toast=that.$refs.toast;
                id = that.recycled[index]['id'];

                param += '&id=' + id;
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    url: 'https://www.aftdc.com/businessapp/Article/restoreArticle',
                }, function (res) {
                    if (res.data.res == 1) {
                        toast.editContent('恢复成功');
                        that.refresh()
                    } else {
                        toast.editContent('恢复失败，请稍后再试');
                    }
                })
            },//恢复

            onscroll(){
                if(this.once===false){
                    dom.getComponentRect(this.$refs.box, option => {
                        if (option.result && option.size) {
                            this.minHeight = Math.ceil(option.size.height)
                        }
                    })
                    this.once = true
                    return false;
                }
                this.bubbleHide();
                // this.scrollToNext()
                //只执行一次minHeight赋值
            },//滚动条滚动时

            scrollTop(index){
                if(index==0){
                    if(this.sliderIndexTwo==0){
                        this.scrollToNext()
                    }
                    this.sliderIndexTwo=0;
                }
                if(index==1){
                    if(this.sliderIndexTwo==1){
                        this.scrollToNext()
                    }
                    this.sliderIndexTwo=1;
                }
                if(index==2){
                    if(this.sliderIndexTwo==2){
                        this.scrollToNext()
                    }
                    this.sliderIndexTwo=2;
                }
            },

            bubbleHide(){
                this.moveHide();
                this.briding='';
                this.ArecoveryMoveHide();
                this.ArecoveryBriding='';
                this.videoMoveHide();
                this.videoBriding='';
                // this.VrecoveryMoveHide();
                // this.VrecoveryBriding='';
            },//整个大div的点击

            settopClick(index){
                var that=this;
                if(that.articleOrVideo==0){//为文章时topYes的值
                    if(this.article[index].top==0){
                        that.topYes=0;
                    }
                    else{
                        that.topYes=1;
                    }
                }else if(that.articleOrVideo==1){//为视频时videoTopYes的值
                    if(that.video[index].top==0){
                        that.videoTopYes=0;
                    } else{
                        that.videoTopYes=1;
                    }
                }
                this.moveHide();
                this.videoMoveHide();
                this.settopShow=true;
                // this.article[index].settop=1;//当settop等于1时,置顶
            },//置顶的点击
            editClick(){
                var that=this
                var param = {
                    articleId : this.articleId
                }
                var url = 'http://assets/headLine.js'
                event.toUrl({url:url,param:JSON.stringify(param)});
                that.bubbleHide();
            },//气泡菜单的编辑
            previewClick(id){
                this.articleId = id
                var that=this
                that.bubbleHide();
                var param = {
                    articleId: this.articleId
                }
                var url = 'http://assets/seeArticle.js'
                event.toUrl({url: url, param: JSON.stringify(param)});
            },//点击图片的预览

            videoPreview(){

            },//点击视频的预览

            dianIconClick(index,articleId){
                this.bridingTwo=index;
                this.articleId = articleId
                this.moveHide();
                this.articleOrVideo=0
                if(index!==this.briding){
                    this.moveShow(index);
                    this.briding=index;
                } else{
                    this.briding='';
                }
            },//...图标

            ArecoveryDianIconClick(index,articleId){
                this.articleId = articleId;
                this.articleOrVideo=2
                this.ArecoveryMoveHide(index);
                if(index!==this.ArecoveryBriding){
                    this.ArecoveryMoveShow(index);
                    this.ArecoveryBriding=index;
                } else{
                    this.ArecoveryBriding='';
                }
            },//回收站...文章图标

            VrecoveryDianIconClick(index,articleId){
                this.articleId = articleId;
                this.articleOrVideo=3
                this.ArecoveryMoveHide(index);
                if(index!==this.ArecoveryBriding){
                    this.ArecoveryMoveShow(index);
                    this.ArecoveryBriding=index;
                } else{
                    this.ArecoveryBriding='';
                }
            },//回收站...视频图标

            videoDianIconClick(index,articleId){
                var that=this
                that.videoMoveHide()
                this.articleId = articleId
                this.articleOrVideo=1
                if(index!==that.videoBriding){
                    that.videoMoveShow(index);
                    that.videoBriding=index;
                } else{
                    that.videoBriding='';
                }
            },
            scrollToNext: function() {
                dom.scrollToElement(this.$refs.footer)
            },
            // 监听slider显示第几页
            sliderCharge(e){
                this.sliderIndex = e.index
            },
            sliderChargeTwo(e){
                this.sliderIndexTwo = e.index
            },
            // 文章与视频的切换
            toggle(type){
                this.sliderIndex = type

                // this.scrollToNext()
            },
            // 底部弹层
            openBottomPopup () {
                this.isBottomShow = true;
            },
            orderTrackingclose () {
                this.$refs.wxcPopup.hide()
            },
            //非状态组件，需要在这里关闭
            popupOverlayBottomClick () {
                this.isBottomShow = false;
            },
            // 拉黑弹出层
            openMask (e) {
                this.isBottomShow = false
                this.show = true;
                this.hasAnimation = true;
            },
            openNoAnimationMask (e) {
                this.show = true;
                this.hasAnimation = false;
            },
            minibarLeftButtonClick() {
                navigator.pop()
            },
            minibarRightButtonClick () {
                // this.$refs['wxc-popover'].wxcPopoverShow();
                // this.bubbleHide();
                var url = 'http://assets/headLine.js'
                event.toUrl({url:url,param:''});
            },
            popoverButtonClicked (obj) {
                if(obj.index==0){//发图文
                    var url = 'http://assets/headLine.js'
                    event.toUrl({url:url,param:''});
                }
                else if(obj.index==1){//拍小视频
                    // event.chooseVideo()
                }
                else if(obj.index==2){//上传视频
                    event.chooseVideo()
                }
                else if(obj.index==3){//投票
                    // var url = 'http://assets/voteSetting.js'
                    var url = 'http://assets/headLine.js'
                    event.toUrl({url:url,param:''});
                }
            },
            // 阻止拉黑弹出层冒泡事件
            bubble(){},
            //编辑文章心情
            editMood(){
                event.editText(0,this.shopInfo.acticleMood,55,'不能超过55字');
            },
            //查看粉丝
            attentionFans(){
                var url = 'http://assets/attentionFans.js'
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
                this.refresh();
                if (event.find("articleData")) {
                    event.delete("articleData");
                }
                if (event.find("content")) {
                    var content = JSON.parse(event.find("content"));
                    this.shopInfo.acticleMood = content.content
                    var param = this.GLOBAL.sign(this.token,this.imei);
                    param +='&acticleMood='+content.content
                    var that = this
                    post.fetch({
                        method: 'POST',
                        type: 'json',
                        body: param,
                        headers: {"Content-Type": "application/x-www-form-urlencoded"},
                        url: 'https://www.aftdc.com/businessapp/Article/editMood',
                    }, function (res) {
                        if (res.data.res == 1) {
                        }
                    })
                    event.delete("content");
                }
            },
        }
    }
</script>

<style>
    .bigBox {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        opacity: 0;
    }

    .dianDelBtnCancel{
        /*padding-top: 5px;*/
        padding-bottom: 25px;
        padding-left: 40px;
        padding-right: 40px;
    }
    .dianDelBtn{
    }
    .dianDelDetails{
        padding-left: 30px;
        padding-right: 30px;
    }
    .dianDelTips{
        padding-top: 25px;
        /*padding-bottom: 5px;*/
        padding-left: 30px;
    }
    .dianDelDiv{
        flex: 1;
        justify-content: space-between;
    }
    .cell {
        width: 750px;

    }
    .page {
        background-color: #fff;
    }
    .refresh {
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
    .indicator {
        margin-top: 10px;
        height: 40px;
        width: 40px;
        color: blue;
    }
    .stickyHeader {
        position: sticky;
        min-height: 94px;
        background-color: #f8f8f8;
    }


    .wrapper {

    }
    /* 公共样式 */
    .black {
        color: #2b2b2b;
    }
    .white {
        color: #fff;
    }
    .gray {
        color: #b9b9b9;
    }
    .blue {
        color: #43689b;
    }
    .row {
        flex-direction: row;
    }
    .aiCenter {
        align-items: center;
    }
    .mr24 {
        margin-right: 24px;
    }
    .w750 {
        width: 750px;
    }
    .mt10{
        margin-top: 10px;
    }
    /* 导航栏 */
    .backImg {
        width: 40px;
        height: 40px;
    }

    /* header个人信息 */
    .header {
        position: relative;
    }
    .banner {
        width: 750px;
        height: 120px;
        background-color: #53beb7;
    }
    .headerCenter{
        text-align:center;
        width:400px;
        lines:1;
        overflow: hidden;
        white-space:nowrap;
        text-overflow:ellipsis
    }
    .headerBottom {
        width: 750px;
        background-color: #fff;
        padding-bottom: 10px;
    }
    .userImgBox {
        flex: 1;
    }
    .userImg {
        width: 150px;
        height: 150px;
        border-radius: 75px;
    }
    .follow {
        height: 90px;
        align-items: flex-end;
        justify-content: flex-end;
    }
    .followBtn {
        width: 150px;
        height: 60px;
        margin-right: 30px;
        background-color: #53beb7;
        border-radius: 8px;
    }
    .personalInfo {
        padding-left: 30px;
        padding-right: 30px;
    }
    .personalName {
        font-weight: 600;
        width: 690px;
        text-align: center;
        padding-top: 20px;
        padding-bottom: 10px;
    }
    .authenticationIcon {
        width: 28px;
        height: 28px;
        margin-right: 10px;
        border-radius: 20px;
    }
    .personalInfoText {
        padding-top: 8px;
        padding-bottom: 8px;
    }
    .numText{
        font-weight: 400;
        width: 100px;
        text-align: center;
    }
    .attentionText{
        width: 100px;
        text-align: center;
    }
    .apply{
        color: #fff;
        width: 200px;
        text-align: center;
        padding-top: 10px;
        padding-bottom: 10px;
        background-color: #53beb7;
        border-radius: 5px;
        border-style: solid;
        border-width: 2px;
        border-color: #53beb7;
    }
    .apply:active{
        background-color: #58aba5;
    }
    .buttom{
        color: #666;
        width: 200px;
        text-align: center;
        padding-top: 10px;
        padding-bottom: 10px;
        background-color: #fff;
        border-radius: 5px;
        border-style: solid;
        border-width: 2px;
        border-color: #dedede;
    }
    .buttom:active{
        background-color: #f8f8f8;
    }
    /* 文章与视频切换按钮 */
    .toggle {
        width: 750px;
        background-color: #fff;
        border-top-width: 2px;
        border-top-style: solid;
        border-top-color: #ededed;
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #ededed;
        padding-left: 30px;
    }
    .toggleTwo{
        width: 750px;
        padding-left: 130px;
        padding-right: 130px;
        padding-top: 10px;
        padding-bottom: 10px;
        background-color: #fff;
        border-bottom-style: solid;
        border-bottom-width: 10px;
        border-bottom-color: #f8f8f8;
        border-top-style: solid;
        border-top-width: 10px;
        border-top-color: #f8f8f8;
    }
    .toggleBtn {
        padding-top: 28px;
        padding-bottom: 28px;
        margin-right: 64px;
    }
    .toggleBtnActive {
        border-bottom-width: 4px;
        border-bottom-style: solid;
        border-bottom-color: #53beb7;
    }
    .toggleBtnTextActive {
        color:  #53beb7;
    }
    .toggleBtnActiveWhite {
        border-bottom-width: 4px;
        border-bottom-style: solid;
        border-bottom-color: #fff;
    }
    /* 文章与视频 */
    .slider {
        width: 750px;
        flex-direction: row;
        /*flex: 1;*/
    }
    .sliderScroller {
        width: 750px;
        flex: 1;
    }
    .videoArea {
        width: 746px;
        flex-wrap: wrap;
    }
    .videoText{
        padding-bottom: 15px;
        padding-top: 15px;
        flex: 1;
        text-align: center;
        border-style: solid;
        border-width: 2px;
        border-color: #53beb7;
    }
    .videoTextTwo{
        padding-left: 35px;
        padding-top: 20px;
        padding-bottom: 20px;
        margin-bottom: 20px;
        background-color: #f8f8f8;
    }
    .videoTextThree{
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        padding-left: 35px;
        padding-top: 20px;
        padding-bottom: 20px;
        margin-bottom: 20px;
        background-color: #f8f8f8;
    }
    /* 视频样式 */
    .video {
        width: 247px;
        height: 330px;
        background-color: #50514d;
        margin-right: 2px;
        margin-bottom: 2px;
    }
    .videoCover {
        width: 248px;
        height: 330px;
    }
    .mr0 {
        margin-right: 0;
    }
    .fabulous {
        height: 30px;
        position: absolute;
        left: 23px;
        bottom: 23px;
    }
    .fabulousIcon {
        width: 30px;
        height: 30px;
    }
    .fabulousNumber {
        padding-left: 10px;
        padding-top: 3px;
    }
    .videoDianIcon{

        position: absolute;
        right: 23px;
        bottom: 18px;
    }
    .videoDianIconImg{
        width: 35px;
        height: 35px;
    }
    .noPass{
        position: absolute;
        width: 120px;
        height: 65px;
        right: 10px;
        top: 10px;
    }
    .noPassText{
        text-align: right;
        color: #fff;
    }

    /* 文章样式 */
    .piece {

        background-color: #ffffff;
        width: 750px;
        position: relative;
        /*padding: 30px;*/
    }
    .headLineContent {
        flex-direction: column;
        padding-top: 30px;
        position: relative;
    }
    .contentStyle {
        flex-direction: column;
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #f1f1f1;
        margin-left: 30px;
        margin-right: 30px;
    }
    .articleMessage {
        padding-top: 20px;
        padding-bottom:20px;
        width: 690px;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
    .shopAnTime {
        flex-direction: row;
        align-items: center;
    }
    .jiaoDivTwo{
        width: 28px;
        height: 28px;
        position: absolute;
        bottom: 60px;
        right: 50px;
        background-color: #fff;
        transform: rotate(45deg);
    }
    .jiaoDiv{
        width: 30px;
        height: 30px;
        position: absolute;
        bottom: 60px;
        right: 50px;
        background-color: #fff;
        transform: rotate(45deg);
        border-style: solid;
        border-width: 1px;
        border-color: #999;
    }
    .dianIconFlexText{
        height: 45px;
        flex: 1;
        line-height: 45px;
        text-align: center;
        color: #999;
    }
    .dianIconFlexTwoText{
        height: 45px;
        flex: 1;
        padding-left: 20px;
        padding-right: 20px;
        line-height: 45px;
        text-align: center;
        color: #999;
    }
    .borBtn{
        border-right-style: solid;
        border-right-width: 1px;
        border-right-color: #dedede;
    }
    .dianIconFlex{
        position: absolute;
        right: 40px;
        bottom: 70px;
        width: 500px;
        height: 90px;
        background-color: #fff;
        border-radius: 10px;
        border-style: solid;
        border-width: 1px;
        border-color: #999;
    }
    .dianIconFlexTwo{
        position: absolute;
        right: 40px;
        bottom: 70px;
        width: auto;
        height: 90px;
        background-color: #fff;
        border-radius: 10px;
        border-style: solid;
        border-width: 1px;
        border-color: #999;
    }
    .dianBigDiv{
        position: absolute;
        height: 200px;
        width: 750px;
        bottom: 0;
        right: 0;
        transform: scale(0.001);
        opacity: 0.1;
    }
    .dianIconDiv{
        width: 75px;
        height: 55px;
        justify-content: center;
        align-items: center;
    }
    .dianIcon{
        width: 35px;
        height: 35px;
    }
    .settop{
        padding-left: 20px;
        padding-right: 20px;
    }
    .shopAnTimeSize {
        color: #999;
        margin-right: 10px;
    }
    .coverImgStyle {
        margin-top: 15px;
    }
    .articlePlace {
        flex-direction: row;
        align-items: center;
    }
    .placeSize {
        font-size: 25px;
        color: #999;
    }
    .threeImg{
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
    .threeImgSize{
        width: 220px;
        height: 165px;
    }
    .bigImg{
        position: relative;
        width: 690px;
    }
    .bigImgSize{
        width: 690px;
        height:400px ;
    }
    .titleSize{
        position: absolute;
        top: 0;
        left: 0;
        width: 690px;
        padding-left: 30px;
        padding-right: 30px;
        padding-top: 20px;
    }
    .titleText{
        line-height: 40px;
        flex: 1;
        font-size: 36px;
        color: #fff;
    }
    .videoImgSize{
        position: absolute;
        width: 200px;
        height: 120px;
        left: 300px;
        top: 200px;
    }
    .videoImg{
        flex-direction: row;
        position: relative;
        width: 690px;
        height:400px ;
    }
    .videoPlay{
        position: absolute;
        top: 0;
        left: 0;
        /*bottom: 0;*/
        right: 0;
        height: 150px;
        /*height: 518px;*/
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-image: -webkit-linear-gradient(top, rgba(0,0,0,0.5) 0, rgba(0,0,0,0) 100%);
        background-image: linear-gradient(to bottom, rgba(0,0,0,0.5) 0, rgba(0,0,0,0) 100%);
        /*background-color: rgba(50,50,50,0.5);*/
    }
    .videoPlayImg{
        position: absolute;
        top: 150px;
        left: 295px;
        width: 100px;
        height: 100px;
    }
    .smallImgContent{
        flex-direction: row;
        justify-content: space-between;
    }
    .smallImgeText{
        width: 450px;
        lines:3,
    }
    .smallImgSize{
        width: 220px;
        height: 165px;
    }
    /*上拉加载*/
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
        color: #666;
        font-size: 28px;
        text-align: center;
        margin-top: 30px;
        margin-bottom: 30px;
    }
    .indicator {
        margin-top: 16px;
        height: 40px;
        width: 40px;
        color: blue;
    }

    .videoJiaoDivTwo{
        width: 20px;
        height: 20px;
        position: absolute;
        bottom: 40px;
        right:30px;
        background-color: #fff;
        transform: rotate(45deg);
    }
    .videoJiaoDiv{
        width: 22px;
        height: 22px;
        position: absolute;
        bottom: 40px;
        right:30px;
        background-color: #fff;
        transform: rotate(45deg);
        border-style: solid;
        border-width: 1px;
        border-color: #999;
    }
    .videoDianIconFlexText{
        height: 75px;
        flex: 1;
        line-height: 75px;
        padding-left: 20px;
        padding-right: 20px;
        text-align: center;
        color: #999;
    }
    .videoBorBtn{
        border-bottom-style: solid;
        border-bottom-width: 1px;
        border-bottom-color: #dedede;
    }
    .videoDianIconFlex{
        position: absolute;
        right: 10px;
        bottom: 50px;


        width: 165px;
        justify-content: center;
        align-items: center;
        background-color: #fff;
        border-radius: 10px;
        border-style: solid;
        border-width: 1px;
        border-color: #999;
    }
    .videoDianBigDiv{
        position: absolute;
        width: 248px;
        height: 330px;
        bottom: 0;
        right: 0px;
        transform: scale(0.001);
        opacity: 0.1;
    }

    /*审核失败原因提示框*/
    .auditReasons{
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        flex: 1;
    }
    .auditReasonsDetails{
        padding-left: 20px;
        padding-right: 20px;
        line-height: 40px;
    }
    .auditReasonsTitle{
        padding-top: 25px;
        font-weight: bold;

    }
    .auditReasonsSureButton{
        /*width: 400px;*/
        /*text-align: center;*/
        /*padding-top: 20px;*/
        /*padding-bottom: 20px;*/
        /*background-color: #53beb7;*/
        /*border-radius: 8px;*/
        /*margin-bottom: 25px;*/
        width: 600px;
        text-align: center;
        padding-top: 20px;
        padding-bottom: 20px;
        border-top-width: 1px;
        border-top-style: solid;
        border-top-color: #dedede;
    }
    .auditReasonsSureButton:active{
        background-color: #f8f8f8;
    }
    .videoblackBg{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #666;
        opacity: 0.3;
    }
</style>


