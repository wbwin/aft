<template>
    <div class="wrapper">
        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    v-once>
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">营业环比分析</text>
            </wxc-minibar>
        </div>

        <div class="xunTver row">
            <div class="lenr flex1 aiCenter jcCenter" :class="[dayNav===1?'activeBorder':'']" @click="dayNavFn(1)">
                <text class="dColor" :class="[dayNav===1?'active':'']" :style="{fontSize:GLOBAL.bigFS}">昨日</text>
            </div>
            <div class="lenr flex1 aiCenter jcCenter" :class="[dayNav===7?'activeBorder':'']" @click="dayNavFn(7)">
                <text class="dColor" :class="[dayNav===7?'active':'']" :style="{fontSize:GLOBAL.bigFS}">近7天</text>
            </div>
            <div class="lenr flex1 aiCenter jcCenter" :class="[dayNav===30?'activeBorder':'']" @click="dayNavFn(30)">
                <text class="dColor" :class="[dayNav===30?'active':'']" :style="{fontSize:GLOBAL.bigFS}">近30天</text>
            </div>
            <div class="lenr flex1 aiCenter jcCenter" :class="[dayNav===0?'activeBorder':'']" @click="dayNavFn(0)">
                <text class="dColor" :class="[dayNav===0?'active':'']" :style="{fontSize:GLOBAL.bigFS}">自定义</text>
            </div>
        </div>

        <!--<div class="date row aiCenter jcCenter" v-if="dayNav==0">-->
        <!--<input class="txt" type="date" :style="{fontSize:GLOBAL.bigFS}" v-model="time.start">-->
        <!--<text class="tst" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">至</text>-->
        <!--<input class="txt" type="date" :style="{fontSize:GLOBAL.bigFS}" v-model="time.end">-->
        <!--</div>-->
        <div class="XiHunped row aiCenter jcCenter" v-if="dayNav==0">

            <text class="XiHunpedTextOne" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}" @click="chooseTime(1)">{{time.start}}</text>
            <text class="XiHunpedzhi" :style="{fontSize:GLOBAL.bigFS,color:'#999'}">至</text>
            <text class="XiHunpedTextOne" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}" @click="chooseTime(0)">{{time.end}}</text>

        </div>
        <div class="panel">
            <div class="panelHeading row aiCenter ">
                <div class="panelHeadingIcon"></div>
                <text class="black" :style="{fontSize:GLOBAL.biggerFS}">营业详细数据</text>
            </div>
            <div class="turnoverInfo">
                <div class="turnoverTop">
                    <div class="row aiCenter">
                        <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">营业额</text>
                        <text class="news">新</text>
                        <text class="querter">?</text>
                    </div>
                    <div class="dataText row">
                        <text class="black" :style="{fontSize:GLOBAL.bigFS}" >￥ </text>
                        <text class="black number">{{than.needPay}}</text>
                        <!--<div @click="moreDataFn()">-->
                        <!--<image class="arrowIcon" :class="[moreData?'upArrow':'downArrow']" src="https://image.aftdc.com/appBimg/ic_expanded_down.jpg" @click="moreDataFn()"></image>-->
                        <!--</div>-->
                    </div>
                    <div class="dataTextSmall row">
                        <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">比较{{diff}}日 </text>
                        <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}" v-if="thandb.subNeed==0">&#45;&#45;持平</text>
                        <text class="black" :class="[thandb.subNeed>0?'faUp':'faDown']" :style="{fontSize:GLOBAL.bigFS}" v-else>{{thandb.subNeed>0?'↑':'↓'}}{{thandb.proNeed}}</text>
                    </div>
                    <!--<div class="NeiCang" v-if="moreData">-->
                    <!--<div class="otherInfo row">-->
                    <!--<text class="lenName" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">菜品原价：</text>-->
                    <!--<text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">￥{{than.totalMoney}}</text>-->
                    <!--</div>-->
                    <!--<div class="otherInfo row">-->
                    <!--<text class="lenName" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">餐盒费：</text>-->
                    <!--<text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">￥{{than.boxFee}}</text>-->
                    <!--</div>-->
                    <!--<div class="otherInfo row">-->
                    <!--<text class="lenName" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">配送收入：</text>-->
                    <!--<text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">￥{{than.deliverMoney}}</text>-->
                    <!--</div>-->
                    <!--</div>-->
                </div>
                <div class="row">
                    <div class="flex1 line">
                        <div class="row aiCenter">
                            <text class="gray" :style="{fontSize:GLOBAL.bigFS}">有效订单 </text>
                            <text class="querter">?</text>
                        </div>
                        <div class="dataTextSmall row">
                            <text class="black numberSmall" >{{than.orderNum}}</text>
                            <text class="black words" :style="{fontSize:GLOBAL.bigFS}">单</text>
                        </div>
                        <div class="dataTextSmall row">
                            <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">比较{{diff}}日 </text>
                            <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}" v-if="thandb.subNum==0">&#45;&#45;持平</text>
                            <text class="black" :class="[thandb.subNum>0?'faUp':'faDown']" :style="{fontSize:GLOBAL.bigFS}" v-else>{{thandb.subNum>0?'↑':'↓'}}{{thandb.proNum}}</text>
                        </div>
                    </div>
                    <div class="flex1">
                        <div class="row aiCenter">
                            <text class="gray" :style="{fontSize:GLOBAL.bigFS}">单均价 </text>
                            <text class="querter">?</text>
                        </div>
                        <div class="dataTextSmall row">
                            <text class="black words" :style="{fontSize:GLOBAL.bigFS}">￥</text>
                            <text class="black numberSmall" >{{than.means}}</text>
                        </div>
                        <div class="dataTextSmall row">
                            <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">比较{{diff}}日 </text>
                            <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}" v-if="thandb.subMean==0">&#45;&#45;持平</text>
                            <text class="black" :class="[thandb.subMean>0?'faUp':'faDown']" :style="{fontSize:GLOBAL.bigFS}" v-else>{{thandb.subMean>0?'↑':'↓'}}{{thandb.proMean}}</text>
                        </div>
                    </div>
                </div>
            </div>

            <div class="boyytui row aiCenter">
                <div class="yinayn row flex1">
                    <text class="gray" :style="{fontSize:GLOBAL.bigFS}">订单收入 </text>
                    <text class="querter">?</text>
                </div>
                <text class="flex1 taCenter" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">￥{{than.needPay}}</text>
                <div class="flex1 row jcFe">
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">比较{{diff}}日 </text>
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}" v-if="thandb.subPlan==0">&#45;&#45;持平</text>
                    <text class="black" :class="[thandb.subPlan>0?'faUp':'faDown']" :style="{fontSize:GLOBAL.bigFS}" v-else>{{thandb.subPlan>0?'↑':'↓'}}{{thandb.proPlan}}</text>
                </div>

            </div>
        </div>

    </div>

</template>

<script>
    import {WxcMinibar} from 'weex-ui';
    var stream = weex.requireModule('stream');
    const event = weex.requireModule('event');

    export default {
        components: {WxcMinibar},
        data() {
            return {
                than:{},//营业环比数据
                thandb:{
                    subNeed: 7,
                    subNum:7,
                    subMean: 7

                },//营业环比数据对比值
                invalidNum:'',//无效订单几单
                invalidb:'',//无效订单几单对比前几天值
                diff:7,//比前几日
                dayNav:7,
                time: { start: '', end: ''},
                moreData:false,
                timeIndex:'',
                token:'',
                imei:'',
            }
        },
        created() {
            var that=this;

            var day = JSON.parse(weex.config.param).day;
            that.time = JSON.parse(weex.config.param).time;
            event.init();
            that.token = weex.config.token;
            that.imei = weex.config.imei;
            that.dayNav=day;
            that.dayNavFn(day);

            weex.requireModule('globalEvent').addEventListener('chooseTime', function (e) {

                if (that.timeIndex == 1) {
                    that.$set(that.time, 'start', e.time)
                } else {
                    that.$set(that.time, 'end', e.time)
                }
                that.timeFn();
            })
        },

        methods: {
            chooseTime(timeIndex) {
                var that = this;
                that.timeIndex = timeIndex;
                event.chooseTime(true, true, true, false, false, false)

            },

            minibarLeftButtonClick() {

            },

            dayNavFn(index){
                this.dayNav=index;
                if(index!=0){
                    this.diff=index;
                    var param = 'day=' + index + '&' + this.GLOBAL.sign(this.token,this.imei)
                    this.dateFn(param)
                }else{
                    this.timeFn();
                }
            },
            timeFn() {
                var start = this.time['start'];
                var end = this.time['end'];
                if(Boolean(start)&&Boolean(end)){
                    var param = 'start=' + start + '&' +'end=' + end + '&'+this.GLOBAL.sign(this.token,this.imei)

                    this.dateFn(param)
                }
            },
            dateFn(param){
                var that=this;
                stream.fetch({
                    method: 'POST',
                    url: 'https://www.aftdc.com/businessapp/Manage/getappCount',
                    body: param,
                    type: 'json',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"}
                },function(res){

                    var than=res.data.than;
                    than.means=pros(than.needPay,than.orderNum);//单均价

                    that.than=than;
                    that.invalidNum=res.data.invalid.orderNum;
                    //对比
                    var than_ed=res.data.than_ed;

                    let subNum=parseInt(than.orderNum)-parseInt(than_ed.orderNum); //有效单对比
                    let proNum=pros(subNum,than_ed.orderNum)*100+"%";

                    let subNeed=than.needPay-than_ed.needPay;//营业额对比
                    let proNeed=pros(subNeed,than_ed.needPay)*100+"%";


                    let mean_ed=pros(than_ed.needPay,than_ed.orderNum);
                    let subMean=than.means-mean_ed; //单均价对比
                    let proMean=pros(subMean,mean_ed)*100+"%";

                    let subPlan=than.needPay-than_ed.needPay;//订单收入对比
                    let proPlan=pros(subPlan,than_ed.needPay)*100+"%";

                    var thandb={
                        subNum:subNum,
                        proNum:proNum,
                        subNeed:subNeed,
                        proNeed:proNeed,
                        subMean:subMean,
                        proMean:proMean,
                        subPlan:subPlan,
                        proPlan:proPlan,
                    };

                    that.thandb=new Object(thandb);

                    function pros(up,down){
                        //分母不能为0
                        let d=parseInt(down*100)/100;
                        d=d===0?1:d;
                        let pro = Math.round(Math.abs(up)/d*100)/100;
                        return pro
                    }

                    if(that.dayNav===0){
                        that.diff=res.data.diff
                    }
                })
            },
            moreDataFn(){
                this.moreData=!this.moreData;
            },
            //获取 URL 传过来的值
            getQueryString(name) {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
                var r = window.location.search.substr(1).match(reg);
                if (r != null) return unescape(r[2]);
                return null;
            },

        }
    }



</script>

<style scoped>

    .wrapper {
        position: relative;
        flex-direction: column;
        background-color: #efefef;
    }
    .minibar {
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: #f1f1f1;
    }
    .dColor {
        color: #666;
    }
    .black {
        color: #525252;
    }
    .flex1 {
        flex: 1;
    }
    .gray {
        color: #9c9c9c;
    }
    .row {
        flex-direction: row;
    }
    .aiCenter {
        align-items: center;
    }
    .jcCenter {
        justify-content: center;
    }
    .jcFe {
        justify-content: flex-end;
    }
    .taCenter {
        text-align: center;
    }
    .xunTver{
        height: 90px;
        background-color: #fff;
        padding-top: 6px;
    }
    .lenr{
        border-bottom-width: 8px;
        border-bottom-style: solid;
        border-bottom-color: #fff;
    }
    .active{
        color: #53beb7;
    }
    .activeBorder {
        border-bottom-color: #53beb7;
    }
    .panelHeading {
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #efefef;
        padding-top: 26px;
        padding-bottom: 26px;
    }
    .panelHeadingIcon {
        width: 8px;
        height: 30px;
        background-color: #53beb7;
        margin-right: 22px;
    }
    .panel {
        background-color: #fff;
        margin-top: 20px;
    }

    .turnoverInfo {
        padding-top: 40px;
        padding-bottom: 40px;
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #efefef;
    }
    .numberSmall {
        font-size: 40px;
        line-height: 32px;
        font-weight: bold;
    }
    .dataTextSmall {
        height: 48px;
        align-items: flex-end;
    }
    .words {
        line-height: 30px;
    }
    .line {
        border-right-width: 2px;
        border-right-style: dashed;
        border-right-color: #ebebeb;
        margin-right: 28px;
        margin-left: 26px;
    }
    .querter{
        width: 30px;
        height: 30px;
        line-height: 30px;
        background-color: #C0C0C0;
        font-size: 24px;
        text-align: center;
        border-radius: 50px;
        cursor: pointer;
        color: #fff;
        margin-left: 10px;
    }
    .boyytui{
        padding-left: 26px;
        padding-right: 26px;
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #efefef;
        margin-bottom: 90px;
    }
    .yinayn{
        padding-top: 26px;
        padding-bottom: 26px;
    }
    .sonDer{
        padding-top: 36px;
        padding-bottom: 70px;
    }
    .faDown {
        color: #0bdf38;
    }
    .faUp{
        color: #f10717;
    }
    .date {
        border-top-width: 2px;
        border-top-style: solid;
        border-top-color: #efefef;
        background-color: #fff;
        padding-top: 30px;
        padding-bottom: 30px;
    }
    .txt{
        width: 270px;
        height: 64px;
        border-width: 1px;
        border-style: solid;
        border-color: #d5d5d5;
        text-align: center;
    }
    .tst{
        margin-left: 40px;
        margin-right: 40px;
    }
    .news{
        font-size: 24px;
        border-width: 1px;
        border-style: solid;
        border-color: #ff0000;
        padding-top: 1px;
        padding-bottom: 1px;
        padding-left: 1px;
        padding-right: 1px;
        line-height: 26px;
        color: #ff0000;
        align-items: center;
        border-radius: 3px;
        margin-left: 8px;
    }
    .dataText {
        height: 56px;
        align-items: flex-end;
    }
    .number {
        font-size: 50px;
        line-height: 40px;
        font-weight: bold;
    }
    .turnoverTop {
        padding-left: 26px;
        margin-bottom: 46px;
    }
    .arrowIcon {
        width: 28px;
        height: 28px;
        margin-left: 8px;
        margin-right: 16px;
        margin-bottom: 6px;
        margin-top: 6px;
    }
    .otherInfo {
        height: 48px;
        align-items: flex-end;
    }
    .lenName {
        width: 180px;
        text-align: right;

    }
    .upArrow {
        transform: rotate(180deg);
    }
    .downArrow {
        transform: rotate(0deg);
    }

    .XiHunpedzhi {
        margin-left: 15px;
        margin-right: 15px;
    }

    .XiHunpedTextOne {
        width: 230px;
        height: 70px;
        text-align: center;
        line-height: 70px;
        border-style: solid;
        border-width: 1px;
        border-color: #dedede;
    }

    .XiHunped {
        padding-bottom: 20px;
        padding-top: 20px;
        justify-content: center;
        background-color: #fff;
    }
</style>
