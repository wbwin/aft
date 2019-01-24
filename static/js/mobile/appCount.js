var evaluate = new Vue({
    el: '#count',
    data: {
        than: {},//营业环比数据
        thandb: {},//营业环比数据对比值
        invalidNum: '',//无效订单几单
        invalidb: '',//无效订单几单对比前几天值
        diff: 7,//比前几日
        todayData:{},//今日有效数据
        type:1,//判断是否查询今日的标记
        dayNav: 7,
        time: {start: '', end: ''},
        times:'',
        reason: 0,
        shopId:0
    },
    created: function () {
        var shopId = this.shopId = this.getQueryString('shopId');
        var dat = {
            day: 7,
            shopId: shopId,
            type:1//判断是否查询今日的标记
        };
        var myDate = new Date();
        var ey = myDate.getFullYear();
        var em = myDate.getMonth() + 1;
        var ed = myDate.getDate();
        var end = ey + '-' + timeRet(em) + '-' + timeRet(ed);

        var endDate = myDate.setDate(myDate.getDate() - 7);
        endDate = new Date(endDate);
        var sy = endDate.getFullYear();
        var sm = endDate.getMonth() + 1;
        var sd = endDate.getDate();
        var start = sy + '-' + timeRet(sm) + '-' + timeRet(sd);


        this.time['start'] = start;
        this.time['end'] = end;

        function timeRet(t) {
            t = t > 9 ? t : '0' + t;
            return t
        }

        this.times = JSON.stringify(this.time);

        this.dateFn(dat);
    },
    methods: {
        dateFn: function (dat) {
            var that = this;
            $.ajax({
                url: 'https://www.aftdc.com/mobile/Manage/getappCount',
                data: dat,
                type: 'post',
                success: function (res) {
                    if (that.type) {
                        that.todayData = res.todayData;
                        that.type = 0;
                    }
                    var than = res.than;
                    than.means = pros(than.orderNum, than.needPay);//单均价

                    that.than = than;
                    that.invalidNum = res.invalid.orderNum;
                    that.reason = res.reason;
                    //对比
                    var than_ed = res.than_ed;

                    var subNum = parseInt(than.orderNum) - parseInt(than_ed.orderNum); //有效单对比
                    var proNum = pros(subNum, than.orderNum) * 100 + "%";

                    var subNeed = than.needPay - than_ed.needPay;//营业额对比
                    var proNeed = pros(subNeed, than.needPay) * 100 + "%";

                    var mean_ed = pros(than_ed.orderNum, than_ed.needPay);
                    var subMean = than.means - mean_ed; //单均价对比
                    var proMean = Math.round((pros(mean_ed, than.means) * 100) * 100) /100 + "%";

                    var thandb = {
                        subNum: subNum,
                        proNum: proNum,
                        subNeed: subNeed,
                        proNeed: proNeed,
                        subMean: subMean,
                        proMean: proMean,
                    };
                    that.thandb = new Object(thandb);
                    let subi = parseInt(res.invalid.orderNum) - parseInt(res.invalid_ed.orderNum);
                    let proi = pros(subi, res.invalid.needPay) * 100 + "%";
                    var invalidb = {subi: subi, proi: proi};
                    that.invalidb = new Object(invalidb);

                    function pros(up, down) {
                        //分母不能为0
                        let d = parseInt(down * 100) / 100;
                        d = d === 0 ? 1 : d;
                        let pro = Math.round((Math.abs(up) / d) * 100) / 100;
                        return pro
                    }

                    if (that.dayNav === 0) {
                        that.diff = res.diff
                    }
                },
            })
        },

        dayNavFn: function (index) {
            this.dayNav = index;
            if (index !== 0) {
                this.diff = index;
                var dat = {
                    day: index,
                    shopId: this.shopId,
                };
                this.dateFn(dat)
            } else {
                this.timeFn()
            }
        },

        timeFn: function () {
            var start = this.time['start'];
            var end = this.time['end'];
            if (Boolean(start) && Boolean(end)) {
                var dat = {
                    start: start,
                    end: end,
                    shopId: this.shopId,
                };
                this.dateFn(dat)
            }
        },
        //获取 URL 传过来的值
        getQueryString(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        },
        back(){
            history.back();
        }
    }
});
