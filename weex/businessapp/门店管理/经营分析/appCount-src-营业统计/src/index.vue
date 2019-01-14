<template>
    <div class="manage">

        <!-- 头部 -->
        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    v-once
            >
                <image :style="GLOBAL.headerImg" slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter" slot="middle">营业统计</text>
            </wxc-minibar>
        </div>

        <scroller class="scroller">

            <!--今日实时数据-->
            <div class="topnBunBig">

                <!--<div class="topnBun" :href="'coun   tToday.html?shopId='+ shopId">-->
                <div class="topnBun row" @click="toCountToday">
                    <text class="shiSiIcon"></text>
                    <text class="lvLin" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">今日实时数据</text>
                    <text :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">详情</text>
                    <image class="shisiImg" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                </div>

                <div class="TwouDer row">

                    <div class="bin">
                        <div class="DerNser row">
                            <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">营业额</text>
                            <text class="xin" :style="{fontSize:GLOBAL.smallFS}">新</text>
                            <text class="number" :style="{fontSize:GLOBAL.defaultFS}">?</text>
                        </div>
                        <div class="DerNonc row">
                            <text :style="{fontSize:GLOBAL.smallFS,color:'#999'}">￥</text>
                            <text class="DerNoncMoney" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{todayData.needPay}}</text>
                        </div>
                    </div>

                    <div class="binTwo">
                        <div class="DerNser row">
                            <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">有效订单</text>
                            <text class="number" :style="{fontSize:GLOBAL.defaultFS}">?</text>
                        </div>
                        <div class="DerNonc row">
                            <text class="DerNoncMoney" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{todayData.orderNum}}</text>
                            <text :style="{fontSize:GLOBAL.smallFS,color:'#999',marginLeft:'5px'}">单</text>
                        </div>
                    </div>

                </div>
            </div>

            <!--今日实时数据选择-->
            <div class="QieHuanBig">

                <div class="QieHuan row">
                    <text class="Kin" :class="[dayNav==1?'kinActive':'']" @click="dayNavFn(1)":style="{fontSize:GLOBAL.bigFS}">昨日</text>
                    <text class="Kin" :class="[dayNav==7?'kinActive':'']" @click="dayNavFn(7)":style="{fontSize:GLOBAL.bigFS}">近7天</text>
                    <text class="Kin" :class="[dayNav==30?'kinActive':'']" @click="dayNavFn(30)":style="{fontSize:GLOBAL.bigFS}">近30天</text>
                    <text class="Kin" :class="[dayNav==0?'kinActive':'']" @click="dayNavFn(0)":style="{fontSize:GLOBAL.bigFS}">自定义</text>
                </div>

                <div class="XiHunped row" v-if="dayNav==0">

                    <text class="XiHunpedTextOne" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{time.start}}</text>
                    <text class="XiHunpedzhi" :style="{fontSize:GLOBAL.bigFS,color:'#999'}">至</text>
                    <text class="XiHunpedTextOne" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{time.end}}</text>

                </div>
                <!--<div class="XiHunped" v-show="dayNav==0">-->
                <!--<input id="date" class="Time kai" v-model="time.start" type="text" name="start" value=""-->
                <!--readonly="readonly"/>-->
                <!--<span class="CenTen">至</span>-->
                <!--<input id="dateEnd" class="Time Wan" v-model="time.end" type="text" name="end" value=""-->
                <!--readonly="readonly"/>-->
                <!--</div>-->


            </div>

            <!--营业环比分析-->
            <div class="QieHuanBig">

                <!--<a class="Necter" :href="'countThan.html?dayNav='+dayNav+'&time='+times+'&shopId='+shopId">-->
                <div class="topnBun row" @click="toCountThan">
                    <text class="shiSiIcon"></text>
                    <text class="lvLin" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">营业环比分析</text>
                    <text :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">详情</text>
                    <image class="shisiImg" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                </div>


                <div class="bin binAnalysis">

                    <div class="DerNser row">
                        <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">营业额</text>
                        <text class="xin" :style="{fontSize:GLOBAL.smallFS}">新</text>
                        <text class="number" :style="{fontSize:GLOBAL.defaultFS}">?</text>
                    </div>

                    <div class="DerNonc row">
                        <text :style="{fontSize:GLOBAL.smallFS,color:'#999'}">￥</text>
                        <text class="DerNoncMoney" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{than.needPay}}</text>
                    </div>

                    <div class="row">
                        <text class="DerNoncBottom" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">比前{{diff}}日</text>
                        <text class="DerNoncBottom" v-if="thandb.subNeed==0">--持平</text>
                        <text class="DerNoncBottom" v-else>{{thandb.proNeed}}</text>
                    </div>

                </div>

                <div class="HinSer row">

                    <div class="HinSerLeft">
                        <div class="row">
                            <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">有效订单</text>
                            <text class="number" :style="{fontSize:GLOBAL.defaultFS}">?</text>
                        </div>
                        <text class="HinSerText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{than.orderNum}}单</text>
                        <div class="row" style="margin-top: 10px;">
                            <text class="DerNoncBottom" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">比前{{diff}}日</text>
                            <text class="DerNoncBottom" v-if="thandb.subNeed==0" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">--持平</text>
                            <text class="DerNoncBottom" v-else :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{thandb.proNum}}</text>
                        </div>
                    </div>

                    <div class="HinSerRight">
                        <div class="row">
                            <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">单均价</text>
                            <text class="number" :style="{fontSize:GLOBAL.defaultFS}">?</text>
                        </div>
                        <text class="HinSerText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">￥{{than.means}}</text>
                        <div class="row" style="margin-top: 10px;">
                            <text class="DerNoncBottom" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">比前{{diff}}日</text>
                            <text class="DerNoncBottom" v-if="thandb.subMean==0" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">--持平</text>
                            <text class="DerNoncBottom" v-else :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{thandb.proMean}}</text>
                        </div>
                    </div>

                </div>

            </div>

            <!--无效订单分析-->
            <div class="invalid">

                <!--<a class="FoodBun" :href="'countNot.html?dayNav='+dayNav+'&time='+times+'&shopId='+shopId">-->
                <div class="topnBun row" @click="toCountNot">
                    <text class="shiSiIcon"></text>
                    <text class="lvLin" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">无效订单分析</text>
                    <text :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">详情</text>
                    <image class="shisiImg" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                </div>
                <div class="HinSer row">

                    <div class="HinSerLeft">
                        <div class="row">
                            <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">无效订单</text>
                            <text class="number" :style="{fontSize:GLOBAL.defaultFS}">?</text>
                        </div>
                        <text class="HinSerText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{invalidNum}}单</text>
                        <div class="row" style="margin-top: 10px;">
                            <text class="DerNoncBottom" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">比前{{diff}}日</text>
                            <text class="DerNoncBottom" v-if="invalidb.subi==0" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">--持平</text>
                            <text class="DerNoncBottom" v-else :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{invalidb.proi}}</text>
                        </div>
                    </div>

                    <div class="HinSerRight">
                        <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">商家原因: {{reason}}单</text>
                    </div>
                </div>
            </div>
        </scroller>
    </div>
</template>

<script>
    import {WxcPopup, WxcMask, WxcIcon, WxcMinibar, WxcPopover} from 'weex-ui';

    const event = weex.requireModule('event');
    const post = weex.requireModule('stream');
    const navigator = weex.requireModule('navigator');

    export default {
        components: {WxcPopup, WxcMask, WxcIcon, WxcMinibar, WxcPopover},
        data() {

            return {

                than: {},//营业环比数据
                thandb: {},//营业环比数据对比值
                invalidNum: '',//无效订单几单
                invalidb: '',//无效订单几单对比前几天值
                diff: 7,//比前几日
                todayData: {},//今日有效数据
                type: 1,//判断是否查询今日的标记
                dayNav: 7,
                time: {start: '', end: ''},
                times: '',
                reason: 0,
                token:'',
                imei:'',
            }
        },

        created: function () {
            var that=this;
            event.init();
            that.token = weex.config.token;
            that.imei = weex.config.imei;
            var dat = this.GLOBAL.sign(this.token,this.imei) + '&' + 'day=7'+ '&' + 'type=1';

            this.dateFn(dat);
            var myDate = new Date();
            var ey = myDate.getFullYear();
            var em = myDate.getMonth() + 1;
            var ed = myDate.getDate();
            var end = ey + '-' + that.timeRet(em) + '-' + that.timeRet(ed);

            var endDate = myDate.setDate(myDate.getDate() - 7);
            endDate = new Date(endDate);
            var sy = endDate.getFullYear();
            var sm = endDate.getMonth() + 1;
            var sd = endDate.getDate();
            var start = sy + '-' + that.timeRet(sm) + '-' + that.timeRet(sd);

            that.time['start'] = start;
            that.time['end'] = end;
            that.times = JSON.stringify(this.time);
        },

        methods: {
            //返回上一页
            minibarLeftButtonClick() {
                navigator.pop({ animated: 'true' });
            },

            timeRet(t){
                t = t > 9 ? t : '0' + t;
                return t
            },
            dateFn: function (dat) {
                var that = this;
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: dat,
                    url: 'https://www.aftdc.com/businessapp/Manage/getappCount',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                }, function (res) {
                    if (that.type) {
                        that.todayData = res.data.todayData;
                        that.type = 0;
                    }
                    var than = res.data.than;
                    than.means = that.pros(than.needPay, than.orderNum);//单均价

                    that.than = than;
                    that.invalidNum = res.data.invalid.orderNum;
                    that.reason = res.data.reason;
                    //对比
                    var than_ed = res.data.than_ed;

                    var subNum = parseInt(than.orderNum) - parseInt(than_ed.orderNum); //有效单对比
                    var proNum = that.pros(subNum, than_ed.orderNum) * 100 + "%";

                    var subNeed = than.needPay - than_ed.needPay;//营业额对比
                    var proNeed = that.pros(subNeed, than_ed.needPay) * 100 + "%";

                    var mean_ed = that.pros(than_ed.needPay,than_ed.orderNum);
                    var subMean = than.means - mean_ed; //单均价对比
                    var proMean = that.pros(subMean, mean_ed) * 100 + "%";

                    var thandb = {
                        subNum: subNum,
                        proNum: proNum,
                        subNeed: subNeed,
                        proNeed: proNeed,
                        subMean: subMean,
                        proMean: proMean,
                    };
                    that.thandb = new Object(thandb);
                    let subi = parseInt(res.data.invalid.orderNum) - parseInt(res.data.invalid_ed.orderNum);
                    let proi = that.pros(subi, res.data.invalid_ed.orderNum) * 100 + "%";
                    var invalidb = {subi: subi, proi: proi};
                    that.invalidb = new Object(invalidb);

                    if (that.dayNav === 0) {
                        that.diff = res.data.diff
                    }
                })
            },
            pros(up, down){
                //分母不能为0
                let d = parseInt(down * 100) / 100;
                d = d === 0 ? 1 : d;
                let pro = Math.round((Math.abs(up) / d) * 100) / 100;
                return pro
            },
            dayNavFn: function (index) {
                this.dayNav = index;
                if (index !== 0) {
                    this.diff = index;
                    var dat =this.GLOBAL.sign(this.token,this.imei) + '&' + 'day='+index

                    this.dateFn(dat)

                } else {
                    this.timeFn()
                }
            },

            timeFn: function () {
                var start = this.time['start'];
                var end = this.time['end'];
                if (Boolean(start) && Boolean(end)) {
                    var dat = this.GLOBAL.sign(this.token,this.imei) + '&' + 'start='+start + '&' + 'end='+end

                    this.dateFn(dat)
                }
            },

            //跳转
            toCountToday(){
                var param='';
                var url='https://assets/countToday.js';
                event.toUrl({"url":url,"param":param})
            },
            toCountThan(){
                var that=this;
                var param={day:that.dayNav,time:that.time};
                param=JSON.stringify(param);
                var url='https://assets/countThan.js';
                event.toUrl({"url":url,"param":param})
            },
            toCountNot(){
                var that=this;
                var param={day:that.dayNav,time:that.time};
                param=JSON.stringify(param);
                var url='https://assets/countNot.js';
                event.toUrl({"url":url,"param":param})
            }
            // //获取 URL 传过来的值
            // getQueryString(name) {
            //     var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            //     var r = window.location.search.substr(1).match(reg);
            //     if (r != null) return unescape(r[2]);
            //     return null;
            // },
            // back(){
            //     history.back();
            // }
        }
    }
</script>


<style scoped>
    /*营业环比分析star*/
    .HinSerText{
        margin-top: 10px;
    }
    .HinSerRight{
        padding-left: 25px;
        flex: 1;
    }
    .HinSerLeft{
        padding-left: 25px;
        border-right-style: solid;
        border-right-width: 2px;
        border-right-color: #dedede;
        flex: 1;
    }
    .HinSer{
        padding-top: 25px;
        padding-bottom: 25px;
        background-color: #fff;
    }

    /*营业环比分析end*/

    /*今日实时数据star*/
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
        padding-top: 20px;
        padding-bottom: 20px;
        justify-content: center;
        background-color: #fff;
    }

    .kinActive {
        border-bottom-color: #53beb7;
        color: #53beb7;
    }

    .Kin {
        padding-top: 30px;
        padding-bottom: 30px;
        flex: 1;
        text-align: center;
        color: #999;
        border-bottom-style: solid;
        border-bottom-width: 10px;
        border-bottom-color: #fff;
    }

    .QieHuan {
        padding-left: 25px;
        padding-right: 25px;
        border-bottom-style: solid;
        border-bottom-width: 2px;
        border-bottom-color: #dedede;
    }

    .QieHuanBig {
        background-color: #fff;
        margin-top: 20px;
    }

    .DerNoncMoney {
        font-weight: bold;

    }
    .DerNoncBottom{
    }

    .DerNonc {
        margin-top: 5px;
    }

    .number {
        width: 30px;
        height: 30px;
        border-radius: 40px;
        background-color: #C0C0C0;
        color: #fff;
        line-height: 30px;
        text-align: center;
        margin-left: 20px;
    }

    .xin {
        padding-top: 1px;
        padding-bottom: 1px;
        padding-left: 2px;
        padding-right: 2px;
        margin-left: 20px;
        border-radius: 5px;
        color: #ff0000;
        border-style: solid;
        border-width: 1px;
        border-color: #ff0000;

    }

    .binTwo {
        flex: 1;
        padding-left: 25px;
    }

    .bin {
        flex: 1;
        border-right-style: solid;
        border-right-width: 2px;
        border-right-color: #dedede;
        padding-left: 25px;
    }
    .binAnalysis{
        padding-top: 20px;
        padding-bottom: 20px;
        background-color: #fff;
    }

    .TwouDer {
        padding-top: 25px;
        padding-bottom: 25px;
        background-color: #fff;
    }

    .shisiImg {
        width: 20px;
        height: 20px;
        margin-left: 5px;
    }

    .lvLin {
        font-weight: 600;
        flex: 1;
        margin-left: 20px;
    }

    .shiSiIcon {
        width: 8px;
        height: 29px;
        background-color: #53beb7;
    }

    .topnBun {
        padding-top: 30px;
        padding-bottom: 30px;
        padding-left: 25px;
        padding-right: 25px;
        background-color: #fff;
        justify-content: space-between;
        border-bottom-style: solid;
        border-bottom-width: 2px;
        border-bottom-color: #e0e0e0;
    }

    .shiSi {
        align-items: center;
    }

    /*今日实时数据end*/

    .scroller{
        flex: 1;
        width: 750px;
    }
    .manage {
        background-color: #efefef;
    }

    .row {
        flex-direction: row;
        align-items: center;
    }
</style>


