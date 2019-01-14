<template>
    <div class="promotionHome">
        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="backClick"
                    v-once
            >
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">门店推广</text>
                <text :style="GLOBAL.headerRight"  slot="right"></text>
            </wxc-minibar>
        </div>
        <slider style="width: 750px;flex: 1;" infinite="false"  :index="sliderIndex" @change="change">

            <!--第一个页面-->
            <scroller class="scroller">

                <!--头部背景色-->
                <div class="backgroundColor"></div>
                <div class="backgroundColorTwo"></div>

                <!--主体部分-->
                <div class="content" v-for="(item,index) in noticeHomeList" :key="index">
                    <div class="contentTop row" @click="toProductIntroduction">
                        <image class="YuanbaoIcon" :src="item.img"></image>
                        <div class="contentTopDiv">
                            <text class="contentTitle" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.title}}</text>
                            <text class="contentTextRed">未开通</text>
                        </div>
                        <text class="introductionText" :style="{color:GLOBAL.dColor}">产品介绍</text>
                        <image class="introductionIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                    </div>

                    <div class="contentCenter">
                        <text class="contentTextOne" :style="{fontSize:GLOBAL.biggerFS}">{{item.text}}</text>
                        <text class="contentTextTwo">{{item.details}}</text>
                    </div>
                    <div class="row">
                        <text style="flex: 1;"></text>
                        <text class="bottomBtn" :style="{fontSize:GLOBAL.defaultFS}">立即开通</text>
                    </div>
                </div>

                <!--浮动的头部部分-->
                <div class="top row">
                    <div class="topLeft">
                        <div class="topLeftOne row">
                            <text style="font-size: 60px;color: #fff;">0</text>
                            <image class="topLeftOneIcon" src="https://image.aftdc.com/appBimg/icon_arrow_white.png"></image>
                        </div>
                        <div class="topLeftTwo row">
                            <text style="font-size: 23px;color: #fff;opacity: 0.9">推广费余额 /元</text>
                            <image class="topLeftTwoIocn" src="https://image.aftdc.com/appBimg/helpWhite.png"></image>
                        </div>
                    </div>
                    <text class="topRight">充值</text>
                </div>
            </scroller>

            <!--第二个页面-->
            <scroller class="scroller">
                <div class="helpDiv row" style="margin-top: 20px;">
                    <text class="helpText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">意见反馈</text>
                    <image class="helpIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                </div>

                <!--点金推广常见问题-->

                <div class="helpDiv row" style="margin-top: 20px;" @click="helpClick()">
                    <text class="helpText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">点金推广常见问题</text>
                    <image class="helpIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png" ref="animationTast"></image>
                </div>
                <div class="commonProblemOne" v-if="openPromlem">

                    <div v-for="(item,index) in commonProblemList" :key="index">
                        <div class="commonProblemSmallTitleDiv row">
                            <div style="width: 50px;text-align: center">
                                <text :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.tColor}">Q:</text>
                            </div>
                            <text class="commonProblemSmallTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.title}}</text>
                        </div>
                        <div style="margin-top: 15px;flex-direction: row">
                            <div style="width: 50px;height: 20px;text-align: center;margin-top: 5px;">
                                <text class="dianIcon" :style="{fontSize:'50px',color:GLOBAL.dColor}"></text>
                            </div>
                            <text class="commonProblemDetails" :style="{fontSize:GLOBAL.defaultFS}">{{item.details}}</text>
                        </div>
                    </div>


                    <div>
                        <div class="commonProblemSmallTitleDiv row">
                            <div style="width: 50px;text-align: center">
                                <text :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.tColor}">Q:</text>
                            </div>
                            <text class="commonProblemSmallTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">如何提取推广账户中的余额</text>
                        </div>

                        <div style="margin-top: 15px;flex-direction: row">
                            <div style="width: 50px;height: 20px;text-align: center;margin-top: 5px;">
                                <text class="dianIcon" :style="{fontSize:'50px',color:GLOBAL.dColor}"></text>
                            </div>
                            <text class="commonProblemDetails" :style="{fontSize:GLOBAL.defaultFS}">商家可随时在商家中心自助申请提现步骤</text>
                        </div>

                        <div style="margin-top: 15px;flex-direction: row">
                            <div style="width: 50px;height: 20px;text-align: center;margin-top: 5px;">
                                <text class="dianIcon" :style="{fontSize:'50px',color:GLOBAL.dColor}">•</text>
                            </div>
                            <text class="commonProblemDetails" :style="{fontSize:GLOBAL.defaultFS}">商家在推广后台的出价和门店质量,都是影响排名的因素,并不是出价越高排名越高。当商家出价相同的情况下,综合质量分高的商家优先排序。影响商家综合质量的主要因子有门店的访问转化率、门店下单转化率、门店好评率、门店配送非异率等指标。</text>
                        </div>
                        <div style="margin-top: 15px;flex-direction: row">
                            <div style="width: 50px;height: 20px;text-align: center;margin-top: 5px;">
                                <text class="dianIcon" :style="{fontSize:'50px',color:GLOBAL.dColor}">•</text>
                            </div>
                            <text class="commonProblemDetails" :style="{fontSize:GLOBAL.defaultFS}">移动端商家后台:点击【门店推广】中的【推广费余额】版面,在页面的【消费记录】里面即可找到提现按钮,点击按钮系统将弹出提现申请弹窗</text>
                        </div>
                        <div style="margin-top: 15px;flex-direction: row">
                            <div style="width: 50px;height: 20px;text-align: center;margin-top: 5px;">
                                <text class="dianIcon" :style="{fontSize:'50px',color:GLOBAL.dColor}">•</text>
                            </div>
                            <text class="commonProblemDetails" :style="{fontSize:GLOBAL.defaultFS}">您可在弹窗中查看提现金额,填写联系方式,检查推广状态确认无误后,点击提交按钮即可</text>
                        </div>
                        <div style="margin-top: 15px;flex-direction: row">
                            <div style="width: 50px;height: 20px;text-align: center;margin-top: 5px;">
                                <text class="dianIcon" :style="{fontSize:'50px',color:GLOBAL.dColor}">•</text>
                            </div>
                            <text class="commonProblemDetails" :style="{fontSize:GLOBAL.defaultFS}">提交完毕,商家可通过提现详情查看进展备注:</text>
                        </div>
                        <div style="margin-top: 15px;flex-direction: row">
                            <div style="width: 50px;height: 20px;text-align: center;margin-top: 5px;">
                                <text class="dianIcon" :style="{fontSize:'50px',color:GLOBAL.dColor}">•</text>
                            </div>
                            <text class="commonProblemDetails" :style="{fontSize:GLOBAL.defaultFS}">申请退款前,先暂停推广服务,并保证美团外卖资金账户无欠款</text>
                        </div>
                        <div style="margin-top: 15px;flex-direction: row">
                            <div style="width: 50px;height: 20px;text-align: center;margin-top: 5px;">
                                <text class="dianIcon" :style="{fontSize:'50px',color:GLOBAL.dColor}">•</text>
                            </div>
                            <text class="commonProblemDetails" :style="{fontSize:GLOBAL.defaultFS}">提现功能仅支持账户全额提现</text>
                        </div>
                        <div style="margin-top: 15px;flex-direction: row">
                            <div style="width: 50px;height: 20px;text-align: center;margin-top: 5px;">
                                <text class="dianIcon" :style="{fontSize:'50px',color:GLOBAL.dColor}">•</text>
                            </div>
                            <text class="commonProblemDetails" :style="{fontSize:GLOBAL.defaultFS}">可提现金额不等于实际到账金额,实际到账金额以当天24时账户结算后金额为准</text>
                        </div>
                        <div style="margin-top: 15px;flex-direction: row">
                            <div style="width: 50px;height: 20px;text-align: center;margin-top: 5px;">
                                <text class="dianIcon" :style="{fontSize:'50px',color:GLOBAL.dColor}">•</text>
                            </div>
                            <text class="commonProblemDetails" :style="{fontSize:GLOBAL.defaultFS}">请提供常用手机号码,以便为您发送退款进展</text>
                        </div>
                        <div style="margin-top: 15px;flex-direction: row">
                            <div style="width: 50px;height: 20px;text-align: center;margin-top: 5px;">
                                <text class="dianIcon" :style="{fontSize:'50px',color:GLOBAL.dColor}">•</text>
                            </div>
                            <text class="commonProblemDetails" :style="{fontSize:GLOBAL.defaultFS}">我们将在两个工作日内处理提现申请,提现申请通过后,钱款将自动打入到合同账号中</text>
                        </div>
                        <div style="margin-top: 15px;flex-direction: row">
                            <div style="width: 50px;height: 20px;text-align: center;margin-top: 5px;">
                                <text class="dianIcon" :style="{fontSize:'50px',color:GLOBAL.dColor}">•</text>
                            </div>
                            <text class="commonProblemDetails" :style="{fontSize:GLOBAL.defaultFS}">账户提现成功后,账户所有优惠券自动作废</text>
                        </div>
                    </div>


                    <div>
                        <div class="commonProblemSmallTitleDiv row">
                            <div style="width: 50px;text-align: center">
                                <text :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.tColor}">Q:</text>
                            </div>
                            <text class="commonProblemSmallTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">什么是敏感词?</text>
                        </div>
                        <div style="margin-top: 15px;flex-direction: row">
                            <div style="width: 50px;height: 20px;text-align: center;margin-top: 5px;">
                                <text class="dianIcon" :style="{fontSize:'50px',color:GLOBAL.dColor}"></text>
                            </div>
                            <text class="commonProblemDetails" :style="{fontSize:GLOBAL.defaultFS}">根据国家政策法规,若门店名称和门店公告中出现以下宣传词:“国家级”、“最高级"、“最佳”、“特级”、“顶级”、“极品、“独家”、“首家”、“唯一”等,则不可参与推广</text>
                        </div>
                    </div>

                </div>




                <div class="helpDiv row" :style="{marginTop:openPromlem?'0px':'2px' }" @click="toProductIntroduction">
                    <text class="helpText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">产品介绍</text>
                    <image class="helpIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                </div>
                <div class="helpDiv row" style="margin-top: 2px;" @click="toProductIntroduction">
                    <text class="helpText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">操作引导</text>
                    <image class="helpIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                </div>
            </scroller>

            <!--第三个页面-->
            <!--<scroller style="background-color: #f8f8f8">-->
                <!--<div class="notice" v-for="(item,index) in noticeList" :key="index" @click="noticeClick(index)">-->

                    <!--<div class="noticeTop row">-->
                        <!--<div class="noticeTopLeft">-->
                            <!--<div class="noticeContent row">-->
                                <!--<text class="noticeTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.title}}</text>-->
                                <!--<text class="noticeTitleIcon" :style="{color:GLOBAL.tColor}">公告</text>-->
                            <!--</div>-->
                            <!--<text class="notiveText" :style="{fontSize:GLOBAL.defaultFS}">{{item.details}}</text>-->
                        <!--</div>-->

                        <!--<div class="noticeRedIcon" v-if="item.read==1"></div>-->

                        <!--<image class="helpIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>-->

                    <!--</div>-->

                    <!--<text class="buttomTime">发布于 {{item.time}}</text>-->
                <!--</div>-->
            <!--</scroller>-->
        </slider>


        <!--底部的导航栏-->
        <div class="bar row">
            <div class="barOne row barBorder" @click="barClick(0)">
                <image class="barOneIcon" :src="sliderIndex==0?'https://image.aftdc.com/appBimg/yuanSelect_icon.png':'https://image.aftdc.com/appBimg/yuan_icon.png'"></image>
                <text class="barOneText" :style="{fontSize:GLOBAL.defaultFS,color:sliderIndex==0?GLOBAL.tColor:GLOBAL.dColor}">推广首页</text>
            </div>
            <div class="barOne row barBorder" @click="barClick(1)">
                <image class="barOneIcon" :src="sliderIndex==1?'https://image.aftdc.com/appBimg/helpProblemSelect_icon.png':'https://image.aftdc.com/appBimg/helpProblem_icon.png'"></image>
                <text class="barOneText" :style="{fontSize:GLOBAL.defaultFS,color:sliderIndex==1?GLOBAL.tColor:GLOBAL.dColor}">帮助中心</text>
            </div>
            <!--<div class="barOne row" @click="barClick(2)">-->
                <!--<image class="barOneIcon" :src="sliderIndex==2?'https://image.aftdc.com/appBimg/noticeSlect_icon.png':'https://image.aftdc.com/appBimg/notice_icon.png'"></image>-->
                <!--<text class="barOneText" :style="{fontSize:GLOBAL.defaultFS,color:sliderIndex==2?GLOBAL.tColor:GLOBAL.dColor}">推广公告</text>-->
                <!--<div class="redIcon" v-if="allRead>=1"></div>-->
            <!--</div>-->
        </div>
    </div>
</template>
<script>
    import {WxcButton,WxcMinibar} from 'weex-ui'
    import {WxcDialog} from 'weex-ui';
    import Toast from './Toast.vue'
    const event = weex.requireModule('event');
    const navigator = weex.requireModule('navigator');
    const animation = weex.requireModule('animation')
    const modal = weex.requireModule('modal')
    const dom = weex.requireModule('dom');
    export default {
        components: {WxcButton, WxcDialog, Toast, WxcMinibar},
        data() {
            return {
                openPromlem:false,//点金推广常见问题的打开和关闭
                allRead:0,
                sliderIndex:0,
                animation:'',
                noticeHomeList:[
                    {img:'https://image.aftdc.com/appBimg/yuanbao_icon.png',title:'点金推广',text:'快速帮您提升门店排名',details:'5个高排位可选,订单飙升的秘籍就在这里'},
                ],//推广首页
                noticeList:[
                    {title:'智能客服问答上线啦!',details:'流量监控记录看见了两节课立减了解了解立减咖喱辣椒立减累计进口流量监控记录看见了两节课立减了解了解立减咖喱辣椒立减累计进口流量监控记录看见了两节课立减了解了解立减咖喱辣椒立减累计进口流量监控记录看见了两节课立减了解了解立减咖喱辣椒立减累计进口 胸肌乐扣乐扣乐扣乐扣了了',time:'2018-04-01',read:1},
                    {title:'智能客服问答上线啦!',details:'流量监控记录看见了两节课立减了解了解立减咖喱辣椒立减累计进口 胸肌乐扣乐扣乐扣乐扣了了',time:'2018-04-01',read:1},
                    {title:'智能客服问答上线啦!',details:'流量监控记录看见了两节课立减了解了解立减咖喱辣椒立减累计进口 胸肌乐扣乐扣乐扣乐扣了了',time:'2018-04-01',read:1},
                    {title:'智能客服问答上线啦!',details:'流量监控记录看见了两节课立减了解了解立减咖喱辣椒立减累计进口 胸肌乐扣乐扣乐扣乐扣了了',time:'2018-04-01',read:1},
                    {title:'智能客服问答上线啦!',details:'流量监控记录看见了两节课立减了解了解立减咖喱辣椒立减累计进口 胸肌乐扣乐扣乐扣乐扣了了',time:'2018-04-01',read:1},
                    {title:'智能客服问答上线啦!',details:'流量监控记录看见了两节课立减了解了解立减咖喱辣椒立减累计进口 胸肌乐扣乐扣乐扣乐扣了了',time:'2018-04-01',read:1},
                ],//推广公告
                commonProblemList:[
                    {title:'什么是点金推广?',details:'点金推广是一款快速帮助商家提升门店排名的自助营销工具。'},
                    {title:'点金推广的排名位置有哪些?',details:'我们主要开放了外卖app及团购app外卖频道首页及美食页的第5、10、15、20、25名5个位置供商家展现(校园商家另有专属排名位)。'},
                    {title:'点金推广的排名展示逻辑是什么?',details:'当顾客打开ap时,凡能配送到用户所在地点的商家,若有参与点金推广,则按出价和门店质量进行综合排序,前5名依次占据推广位置。'},
                    {title:'影响排名的因素有哪些?',details:'商家在推广后台的出价和门店质量,都是影响排名的因素,并不是出价越高排名越高。当商家出价相同的情况下,综合质量分高的商家优先排序。影响商家综合质量的主要因子有门店的访问转化率、门店下单转化率、门店好评率、门店配送非异率等指标。'},
                    {title:'点金推广的排名展示的地域范围有多大?',details:'商家配送范围内均可参与推广。在商家配送范围内,用户app点餐的地理位置不同,周边竞争程度不同,推广位置的排序也可能不同。'},
                    {title:'如何查看是否成功争取到排名?',details:'若商家争取排名成功时,则商家在列表页的门店带有【广告】字样的角标,商家可定位在配送范围多个地点查看是否成功争取到排名。'},
                    {title:'点金推广如何计费?',details:'按用户点击门店进行计费,点击一次计费一次,同一个设备点击同一个门店,一定时间内,多次点击只计费1次,每个设备天最多计费3次。'},
                    {title:'参与推广后什么情况下会产生计费?',details:'只有商家争取排名成功时,用户通过【广告】角标点击进入门店才会产生计费,即使商家在开启推广,用户通过非广告标以外的任何途径点击进入门店均不会产生计费。'},
                    {title:'为什么有时候每次点击的扣费小于我的出价?',details:'点金推广的实际扣费c出价,折扣比例取决于商家的门店综合质量,综合质量越高,折扣比例越大。'},
                    {title:'如果有人恶意点击我的门店怎么办?',details:'方面,同一个设备点击门店,一定时间内多次点击只计费1次,一个设备一天最多计费3次;另一方面,当系统检测到有恶意点击时,会把恶意点击过滤掉。'},
                    {title:'点金推广的出价是什么?',details:'出价是商家为每一次点击所愿意支付的最高价格,在商家同等质量的情况下,出价越高越容易获得靠前的推广位置。'},
                    {title:'我的门店出价多少合适?',details:'商家可按系统推荐出价进行初步调价,然后ap定位在几个期望展示的区域,查看能否获得自己理想的排名位置,若不能,则适当上调出价直到争取到理想的排名位。'},
                    {title:'点金推广的预算是什么?',details:'预算是商家愿意为每日推广所付出的费用上限,当日推广费用消耗至预算时,则自动暂停,次日重新开启,不用担心余额花超'},
                    {title:'我的门店初期预算设置多少合适?',details:'对于新商家,我们建议初期可尝试设置50到100元的推广预算,若订单有明显增长,则建议适当调高预算直至订单增长到稳定。在商家排名稳定且余额充足的情况下,能获得多少流量,则预算起到决定性的作用!'},
                    {title:'我想暂停推广的时候该怎么办?',details:'在推广后台,一键关闭推广开关即可。当商家门店置休时,推广也会同步停止,直至门店恢复上线。'},
                    {title:'我该怎么衡量门店的推广效果呢?',details:'开启推广时,需实时关注门店通过推广获得的曝光增长数据,尤其是流量高峰期的曝光,若曝光比较少,可适当提高出价和预算来争取更多的曝光。商家可持续推广1周左右,在保持每日曝光充足的情况下,衡量推广周期内日均订单的涨幅是否符合预期。'},
                    {title:'我该怎么优化门店的推广效果呢?',details:'若门店曝光量很少,则建议适当提高出价和每日可用预算,来提升自己的竞争力,争取更多的曝光量,没曝光,谈何转化?若门店曝光量较好,但是访问数很低,则门店访问转化率出现问题,需要从满减活动力度、门店头图、起送价、配送费、周边同类商家分流等角度排查,用户如果不愿意点击进入门店,就更不会下单了!若门店曝光量及访问量较好,但是订单量很少,门店下单转化率出现问题,需要从菜品质量,折扣力度、用户评论等方面重点排查,争取用户在进入门店以后有下单的欲望'},
                ],//点金推广常见问题
            }
        },
        created: function () {
            for(var i in this.noticeList){
                this.allRead=this.allRead+this.noticeList[i].read;
            }
        },
        methods: {
            helpClick(index){


                if(this.openPromlem){
                    this.openPromlem=false;
                    var testEl = this.$refs.animationTast;
                    animation.transition(testEl, {
                        styles: {
                            transform:'rotate(0deg)',
                            transformOrigin: 'center center'
                        },
                        duration: 600, //ms
                        timingFunction: 'ease',
                        delay: 0 //ms
                    })
                }
                else{
                    this.openPromlem=true;
                    var testEl = this.$refs.animationTast;
                    animation.transition(testEl, {
                        styles: {
                            transform:'rotate(90deg)',
                            transformOrigin: 'center center'
                        },
                        duration: 600, //ms
                        timingFunction: 'ease',
                        delay: 0 //ms
                    })
                }

            },
            noticeClick(index){
                this.allRead=0;
                this.noticeList[index].read=0;
                for(var i in this.noticeList){
                    this.allRead=this.allRead+this.noticeList[i].read;
                }
            },
            barClick(index){
                this.sliderIndex=index;
            },
            change(e){
                this.sliderIndex=e.index;
            },
            toProductIntroduction(){
              var param=''
              var url='http://assets/productIntroduction.js'
              event.toUrl({"url":url,"param":param})
            },
        },
    }
</script>

<style scoped>
    .dianIcon{
        line-height: 20px;
        text-align: center;
        margin-bottom: 20px;

    }
    .commonProblem{
        background-color: #f8f8f8;
    }
    .commonProblemDetails{
        color: #999;
        flex: 1;

    }
    .commonProblemSmallTitle{
    }
    .commonProblemTitleText{

    }
    .commonProblemSmallTitleDiv{
        margin-top: 50px;
    }
    .commonProblemIcon{
        width: 20px;
        height: 20px;

    }
    .commonProblemTitleText{
        font-weight: bold;
    }
    .commonProblemTitleDiv{
        justify-content: space-between;
    }
    .commonProblemOne{
        background-color: #fff;
        padding-bottom: 25px;
        padding-left: 30px;
        padding-right: 30px;
    }
    .noticeRedIcon{
        width: 15px;
        height: 15px;
        background-color: #fb5c58;
        border-radius: 10px;
    }
    .buttomTime{
        font-size: 23px;
        color: #999;
        padding-top: 8px;
        padding-bottom: 8px;
    }
    .notiveText{
        margin-top: 15px;
        width: 620px;
        lines:2;
        text-overflow: ellipsis;
        color: #999;
    }
    .noticeTitleIcon{
        font-size: 18px;
        border-radius: 5px;
        border-style: solid;
        border-width: 2px;
        border-color: #53beb7;
        padding-top: 3px;
        padding-bottom: 3px;
        padding-left: 4px;
        padding-right: 4px;
        margin-left: 20px;
    }
    .noticeTitle{

    }
    .noticeTopLeft{
        width: 620px;
    }
    .noticeTop{

        position: relative;
        justify-content: space-between;
        padding-top: 30px;
        padding-bottom: 20px;
        border-bottom-style: dashed;
        border-bottom-width: 2px;
        border-bottom-color: #e1e1e1;
    }
    .notice{
        width: 750px;
        padding-left: 30px;
        padding-right: 30px;
        background-color: #fff;
        margin-bottom: 15px;
    }
    .barBorder{
        border-right-style: solid;
        border-right-color: #e1e1e1;
        border-right-width: 2px;
    }
    .redIcon{
        width: 15px;
        height: 15px;
        border-radius: 10px;
        background-color: #fb5c58;
        position: absolute;
        left: 75px;
        top: 25px;
    }
    .helpIcon{
        width: 20px;
        height: 20px;
    }
    .helpDiv{
        width: 750px;
        background-color: #fff;
        padding-top: 20px;
        padding-bottom: 20px;
        padding-left: 30px;
        padding-right: 30px;
    }
    .helpText{
        flex: 1;
        font-weight: bold;
    }
    .barOneText{
        margin-left: 10px;
    }

    .barOneIcon{
        width: 35px;
        height: 35px;
    }
    .barOne{
        padding-top: 25px;
        padding-bottom: 25px;
        padding-left: 30px;
        padding-right: 30px;
        justify-content: center;
        flex: 1;
        position: relative;
    }
    .bar{
        border-top-style: solid;
        border-top-color: #e1e1e1;
        border-top-width: 2px;
    }
    .topRight{
        padding-left: 35px;
        padding-right: 35px;
        padding-top: 12px;
        padding-bottom: 12px;
        color: #53beb7;
        background-color: #fff;
        opacity: 0.4;
        margin-right: 20px;
        border-radius: 4px;
        font-size: 23px;
    }
    .topLeftTwoIocn{
        width: 30px;
        height: 30px;
        margin-left: 20px;
    }
    .topLeftOneIcon{
        width: 20px;
        height: 20px;
        margin-left: 20px;
    }
    .topLeftOne{
    }
    .topLeft{
        margin-left: 20px;
        margin-right: 20px;
        flex: 1;
    }
    .top{
        width: 700px;
        position: absolute;
        border-radius: 10px;
        left: 25px;
        top: 25px;
        right: 25px;
        height: 230px;
        background-image: linear-gradient(to bottom, #11b6be, #1362be);
    }
    .bottomBtn:active{
        background-color: #53aba5;
    }
    .bottomBtn{
        padding-top: 13px;
        padding-bottom: 13px;
        padding-left: 20px;
        padding-right: 20px;
        margin-top: 20px;
        color: #fff;
        background-color: #53beb7;
        border-radius: 5px;
    }
    .scroller{
        flex: 1;
        width: 750px;
        background-color: #f8f8f8;
    }
    .contentTextTwo{
        color: #fb5c58;
        font-size: 23px;
        background-color: #fff;
        margin-top: 10px;
        border-radius: 5px;
        padding-top: 3px;
        padding-bottom: 3px;
        padding-left: 3px;
width: 420px;
    }
    .contentTextOne{
        color: #fff;
    }
    .contentCenter{
        padding-top: 40px;
        padding-left: 30px;
        padding-right: 30px;
        padding-bottom: 40px;
        background-image: linear-gradient(to bottom,#fb5c58, #f27e67);
        margin-top: 20px;
    }
    .introductionText{
        font-size: 20px;
    }
    .introductionIcon{
        width: 15px;
        height: 15px;
        margin-left: 10px;
    }
    .contentTitle{
        font-weight: bold;
    }
    .contentTextRed{
        font-size: 20px;
        color: #fb5c58;
        margin-top: 10px;
    }
    .contentTopDiv{
        margin-left: 20px;
        flex: 1;
    }
    .YuanbaoIcon{
        width: 70px;
        height: 70px;
    }
    .contentTop{
    }
    .content{
        width: 750px;
        padding-top: 20px;
        padding-left: 20px;
        padding-right: 20px;
        padding-bottom: 20px;
        background-color: #fff;
        margin-bottom: 20px;
    }
    .backgroundColorTwo{
        height: 75px;
        width: 750px;
        background-color:#fff;
    }
    .backgroundColor{
        width: 750px;
        background-color: #53beb7;
        height: 180px;
    }
    /*默认样式*/
    .row{
        flex-direction: row;
        align-items: center;
    }
</style>
