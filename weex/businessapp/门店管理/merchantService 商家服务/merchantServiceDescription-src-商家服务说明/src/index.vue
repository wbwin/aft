<template>
    <div class="wrapper">

        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    @wxcMinibarRightButtonClicked="backConfirmBtnClicked"
                    v-once
            >
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">商家服务说明</text>
                <!--<text :style="GLOBAL.headerRight"  slot="right">保存</text>-->
            </wxc-minibar>
        </div>

        <list class="scroller">

            <cell>
                <div class="listExplain">
                    <div class="explain_title">
                        <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{name[index]}}说明</text>
                    </div>
                    <div class="explain_content">
                        <div class="content_inline">
                            <div class="content_img">
                                <image class="imgDefault"
                                       src="https://image.aftdc.com/appBimg/ic_pick_first.png"></image>
                            </div>
                            <div class="explain_font">
                                <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">接单</text>
                                <text class="explainSize" :style="{fontSize:GLOBAL.defaultFS}">自取订单的卡片和小票有特殊标记</text>
                            </div>
                        </div>
                        <div class="content_inline">
                            <div class="content_img">
                                <image class="imgDefault"
                                       src="https://image.aftdc.com/appBimg/ic_arrow_bottom.png"></image>
                            </div>

                        </div>
                        <div class="content_inline">
                            <div class="content_img">
                                <image class="imgDefault"
                                       src="https://image.aftdc.com/appBimg/ic_pick_second.png"></image>
                            </div>
                            <div class="explain_font">
                                <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">用餐</text>
                                <text class="explainSize" :style="{fontSize:GLOBAL.defaultFS}">根据用户到店时间提前备餐</text>
                            </div>
                        </div>
                        <div class="content_inline">
                            <div class="content_img">
                                <image class="imgDefault"
                                       src="https://image.aftdc.com/appBimg/ic_arrow_bottom.png"></image>
                            </div>

                        </div>
                        <div class="content_inline">
                            <div class="content_img">
                                <image class="imgDefault"
                                       src="https://image.aftdc.com/appBimg/ic_pick_third.png"></image>
                            </div>
                            <div class="explain_font">
                                <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">分开配置</text>
                                <text class="explainSize" :style="{fontSize:GLOBAL.defaultFS}">自取订单和配送订单分开放置方便区分</text>
                            </div>
                        </div>
                        <div class="content_inline">
                            <div class="content_img">
                                <image class="imgDefault"
                                       src="https://image.aftdc.com/appBimg/ic_arrow_bottom.png"></image>
                            </div>

                        </div>
                        <div class="content_inline">
                            <div class="content_img">
                                <image class="imgDefault"
                                       src="https://image.aftdc.com/appBimg/ic_pick_fourth.png"></image>
                            </div>
                            <div class="explain_font">
                                <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">核实手机</text>
                                <text :style="{fontSize:GLOBAL.defaultFS}">核对顾客手机号后将餐交给顾客</text>
                            </div>
                        </div>


                    </div>

                </div>
            </cell>
            <cell>
                <div class="listExplain">
                    <div class="explain_title">
                        <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">自取订单卡片和小票说明</text>
                    </div>
                    <div class="imgSlider">
                        <slider class="slider size" >
                            <div v-for="src in posters">
                                <image class="size" :src="src"></image>
                            </div>
                            <indicator class="indicator"></indicator>
                        </slider>
                        <div class="prompt"> <text class="explainSize" :style="{fontSize:GLOBAL.defaultFS}">滑动查看订单和小票的说明</text></div>
                    </div>
                </div>

            </cell>
        </list>
        <!--<wxc-dialog title="提示"-->
        <!--content="尚未保存数据，是否保存？"-->
        <!--cancel-text="退出"-->
        <!--confirm-text="保存"-->
        <!--:show="backShow"-->
        <!--:single="false"-->
        <!--:show-no-prompt="false"-->
        <!--main-btn-color="#53beb7"-->
        <!--@wxcDialogCancelBtnClicked="backClick"-->
        <!--@wxcDialogConfirmBtnClicked="backConfirmBtnClicked"-->
        <!--&gt;-->
        <!--</wxc-dialog>-->
        <toast ref="toast"></toast>
    </div>
</template>

<script>
    const animation = weex.requireModule('animation')
    const modal = weex.requireModule('modal');
    const picker = weex.requireModule('picker')
    import {WxcIcon,WxcDialog,WxcMinibar} from 'weex-ui'
    import Toast from './Toast.vue'
    const post = weex.requireModule('stream');
    const navigator = weex.requireModule('navigator');
    export default {
        components: {WxcIcon,Toast,WxcDialog,WxcMinibar},
        data() {
            return {
                backImgToggle: 0,//头部返回图片判断
                backShow: false,
                isOn: '',
                startSwitch: '',//switch一开始的状态；
                choiceTime: '',//
                time: [],
                index: 0,
                iconStyle: {
                    fontSize: '35px'
                },
                posters:['https://image.aftdc.com/appBimg/ic_pickup_bill_first.jpg',
                    'https://image.aftdc.com/appBimg/ic_pickup_bill_second.jpg'],
                token:'',
                imei:'',
                name:['外卖业务','免费配送业务','到店自取业务','堂食预订业务','团购业务','夜宵业务',],
                index:'',
            }
        },
        created() {
            var that = this
            this.token = weex.config.token
            this.imei = weex.config.imei
            that.index  = weex.config.param

            for (var i = 1; i <= 6; i++) {
                var time = 5 * i + '分钟'
                that.time.push(time);
            }

            //获取token和sign
            var param = this.GLOBAL.sign(this.token,this.imei);

            post.fetch({
                method: 'post',
                type: 'json',
                body: param,
                url: 'https://www.aftdc.com/businessapp/Enrol/self_store',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
            },function(res){
                if(res.data.ddzq == 1){
                    that.startSwitch = true;
                    that.isOn = true;
                } else {
                    that.startSwitch = false;
                    that.isOn = false;
                }
                that.choiceTime = res.data.mealTime;
            })
        },
        methods: {

            //返回上一页
            minibarLeftButtonClick(){
                navigator.pop({ animated: 'true' });
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
        justify-content: center;
        align-items: center;
    }

    .scroller {
        background-color: #f8f8f8;
        flex: 1;
        width: 750px;

    }

    .listCell {
        flex-direction: column;
        margin-bottom: 20px;
        background-color: #fff;
    }

    .cell {
        flex-direction: row;
        justify-content: space-between;
        padding-top: 15px;
        padding-bottom: 15px;
        padding-left: 20px;
        padding-right: 20px;
        align-items: center;
    }

    .cell_left {
        flex-direction: column;
    }

    .explainSize {
        color: #999;
        margin-top: 5px;
    }

    .open {
        width: 104px;
        height: 52px;
        border-radius: 52px;
        border-width: 1px;
        border-style: solid;
        border-color: white;
        background-color: #4ed465;

    }

    .close {
        width: 104px;
        height: 52px;
        border-radius: 52px;
        border-width: 1px;
        border-style: solid;
        border-color: #bbbbbb;

    }

    .isOpen {
        width: 50px;
        height: 50px;
        border-radius: 26px;
        border-width: 1px;
        border-style: solid;
        border-color: #e2e2e2;
        background-color: #ffffff;
        left: 52px;
    }

    .isClose {
        width: 50px;
        height: 50px;
        background-color: white;
        border-radius: 26px;
        border-width: 1px;
        border-style: solid;
        border-color: #e2e2e2;

    }

    .choiceCell:active {
        background-color: #f1f1f1;
    }

    .cell_right {
        flex-direction: row;
        align-items: center;
    }

    .choiceTimeSize {
        color: #999;
    }

    .listExplain {
        flex-direction: column;
        background-color: #fff;
        margin-bottom: 20px;
    }

    .explain_title {
        flex-direction: row;
        align-items: center;
        padding-left: 20px;
        padding-top: 20px;
        padding-bottom: 20px;
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #f8f8f8;
    }

    .explain_content {
        flex-direction: column;
        /*align-items: center;*/
        padding-top: 30px;
        padding-bottom: 30px;
    }

    .content_inline {
        flex-direction: row;
        align-items: center;
    }

    .content_img {
        padding-left: 20px;
        padding-right: 20px;
    }

    .imgDefault {
        width: 60px;
        height: 60px;
    }

    .explain_font {
        flex-direction: column;
        padding-left: 20px;
        border-left-width: 1px;
        border-left-style: solid;
        border-left-color: #f1f1f1;
    }
    .imgSlider{
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding-top: 30px;
        padding-bottom: 30px;
    }
    .slider {
        position: relative;
    }
    .indicator {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 20px;
        height: 60px;
        /*background-color: rgba(0, 0, 0, 0.3);*/
        itemSize:25px;
        itemColor: #DDDDDD;
        itemSelectedColor: rgb(0, 180, 255);
    }
    .size{
        width: 700px;
        height: 1000px;
    }
    .prompt{
        flex-direction: row;
        justify-content: center;
        align-items: center;
        margin-top: 20px;
    }
    /***********************/
</style>
