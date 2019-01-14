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
                <text :style="GLOBAL.headerCenter"  slot="middle">无效订单分析</text>
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

        <!---->
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
                <text class="black" :style="{fontSize:GLOBAL.biggerFS}">无效订单分析</text>
            </div>

            <div class="turnoverInfo row">
                <div class="flex1 line">
                    <div class="row aiCenter">
                        <text class="gray" :style="{fontSize:GLOBAL.bigFS}">无效订单 </text>
                        <text class="querter">?</text>
                    </div>
                    <div class="dataTextSmall row">
                        <text class="black numberSmall" >{{invalidNum}}</text>
                        <text class="black words" :style="{fontSize:GLOBAL.defaultFS}">单</text>
                    </div>
                </div>
                <div class="flex1">
                    <div class="row aiCenter">
                        <text class="gray" :style="{fontSize:GLOBAL.bigFS}">比前{{diff}}日 </text>
                    </div>
                    <div class="dataTextSmall row">
                        <text :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}" v-if="invalidb.subi===0">&#45;&#45;持平</text>
                        <text class="black" :class="[invalidb.subi>0?'faUp':'faDown']" :style="{fontSize:GLOBAL.biggerFS}" v-else>{{invalidb.subi>0?'↑':'↓'}}{{invalidb.proi}}</text>
                    </div>
                </div>
            </div>

            <div class="boyytui">
                <div class="yinayn">
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">商家原因：{{reason}}单</text>
                </div>

                <div class="sonDer aiCenter" v-if="reason==0">
                    <text  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">没发现无效订单,继续保持哦!!!</text>
                </div>

            </div>
        </div>


    </div>

</template>

<script>
    import {WxcMinibar} from 'weex-ui';
    var post = weex.requireModule('stream');
    const event = weex.requireModule('event');
    export default {
        components: {WxcMinibar},
        data() {
            return {
                invalidNum:'',//无效订单几单
                invalidb:'',//无效订单几单对比前几天值
                diff:7,//比前几日
                dayNav:7,
                time: { start: '', end: ''},
                reason:0,
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
                var that = this
                that.timeIndex = timeIndex;
                event.chooseTime(true, true, true, false, false, false)

            },
            minibarLeftButtonClick() {

            },

            dayNavFn(index){
                this.dayNav=index;
                if(index!==0){
                    this.diff=index;
                    var param = 'day=' + index + '&' + this.GLOBAL.sign(this.token,this.imei);
                    this.dateFn(param)
                }else{
                    this.timeFn()
                }
            },
            timeFn() {
                var start = this.time['start'];
                var end = this.time['end'];
                if(Boolean(start)&&Boolean(end)){
                    var param = 'start=' + start + '&' + 'end=' + end + '&' + this.GLOBAL.sign(this.token,this.imei)
                    this.dateFn(param)
                }
            },
            dateFn(param){
                var that=this;
                post.fetch({
                    method: 'POST',
                    url:'https://www.aftdc.com/businessapp/Manage/getappCount',
                    body:param,
                    type:'json',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                },function(res){
                    that.invalidNum=res.data.invalid.orderNum;
                    that.reason=res.data.reason;
                    let subi=parseInt(res.data.invalid.orderNum)-parseInt(res.data.invalid_ed.orderNum);
                    let proi=that.pros(subi,res.data.invalid_ed.orderNum)*100+"%";
                    var invalidb={subi:subi,proi:proi};
                    that.invalidb=new Object(invalidb);

                    if(that.dayNav===0){
                        that.diff=res.data.diff
                    }
                })
            },
            pros(up,down){
                //分母不能为0
                let d=parseInt(down*100)/100
                d=d===0?1:d;
                let pro=Math.round(Math.abs(up)/d*100)/100;
                return pro
            },
        }
    }



</script>

<style scoped>

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
        height: 54px;
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


    .ZuiAWaiKin{
        /* min-height: 2rem; */
        background: #fff;
        padding: 0 0 1px 0;
    }








    .XunDer{
        min-height: 1rem;
        background: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        border-top: 1px solid #efefef;
    }







    .Mistake{
        height: 0.9rem;
        line-height: 0.9rem;
        background: #fff;
        border-bottom: 1px solid #efefef;
        padding: 0 0.25rem;
        font-size: 0.2rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 0.17rem 0 0 0;
    }

    .Vinder{
        font-size: 0.3rem;
        font-weight: 600;
        display: flex;
        align-items: center;
    }

    .lvLin{
        display: block;
        width: 0.09rem;
        height: 0.35rem;
        background: #09c1a9;
        margin-right: 0.2rem;
    }

    .Loinver{
        font-size: 0.35rem;
        color: #bababa;
    }


    .Iunter{
        min-height: 1.7rem;
        background: #fff;
        padding: 0.1rem 0.2rem 0.1rem 0.2rem;
        border-bottom: 1px solid #efefef;
    }





    .FouruDer {
        height: 1.5rem;
        background: #fff;
        display: flex;
        align-items: center;
    }




    .Gin {
        width: 100%;
        height: 1.2rem;
    }
    .Gzuo {
        /* background: pink; */
        /* border-right: 1px solid #bababa;*/
    }
    .Gyou {
        /* background: red; */
        border-left: 1px solid #efefef;
    }


    .hInNser {
        height: 0.5rem;
        line-height: 0.65rem;
        font-size: 0.225rem;
        color: #666;
        display: flex;
        align-items: center;
    }




    .NubPonc {
        height: 0.55rem;
        line-height: 0.55rem;
        font-weight: 500;
        display: flex;
        align-items: center;
    }


    .NubPonc .Liv {
        font-size: 0.4rem;
        font-weight: 500;
    }




    /*.jianTou {
        margin: 0 5px 0 5px;
        font-size: 0.275rem;
    }*/
    /*
    .wenxzi {
        color: red;
    }
    .wenxzired{
        color:#0bdf38;
    }
    */

    .VieTser {
        height: 0.5rem;
        line-height: 0.65rem;
        /* background: green; */
        font-size: 0.225rem;
        color: #666;
        display: flex;
        align-items: center;
        padding: 0 0 0 0.25rem;
    }
    .Houter,.BifIter {
        width: 0.275rem;
        height: 0.275rem;
        background: #C0C0C0;
        font-size: 0.2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50px;
        cursor: pointer;
        margin: 0 0 0 0.2rem;
        color: #fff;
    }


    .CunNonc {
        height: 0.55rem;
        line-height: 0.55rem;
        font-size: 0.28rem;
        padding: 0 0 0 0.2rem;
        display: flex;
        align-items: center;
        color: #a0a0a0;
    }


    .CunNonc .Fin {
        font-size: 0.4rem;
        font-weight: 500;
    }








    .jianTou {
        margin: 0 5px 0 5px;
        font-size: 0.275rem;
    }


    .XiHunpedzhi {
        margin-left: 15px;
        margin-right: 15px;
    }

    .XiHunpedTextOne {
        width: 250px;
        height: 70px;
        text-align: center;
        line-height: 70px;
        border-style: solid;
        border-width: 1px;
        border-color: #dedede;
    }

    .XiHunped {
        padding-bottom: 20px;
        justify-content: center;
        background-color: #fff;
    }






</style>
