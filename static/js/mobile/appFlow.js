/*
 * 获取访问流量
 * Author：DJKK
 * Version：1.0
 * Date：2018-07-12
 */
let app = new Vue({
    el: '#flow',
    data: {
        exposure:{},//曝光量
        orders:{},//订单量
        pageviews:{},//浏览量
        pageviewsRate:'',//访问转化率
        ordersRate:'',//下单转化率
        shopId:0
    },
    created: function () {
        let shopId = this.shopId = this.getQueryString('shopId');
        let data = {shopId:shopId};
        this.getData(data);
    },
    methods: {
        getData: function (data) {
            let that = this;
            $.ajax({
                url: 'https://www.aftdc.com/mobile/Manage/getFlowHappening',
                data: data,
                type: 'post',
                success: function (res) {
                    let exposure = that.exposure = res.exposure;
                    let orders = that.orders = res.orders;
                    let pageviews = that.pageviews = res.pageviews;
                    that.pageviewsRate = pros((parseInt(pageviews.appNum) + parseInt(pageviews.appletsNum)), (parseInt(exposure.appExposure) + parseInt(exposure.visibility))) * 100 + "%";
                    that.ordersRate = pros((parseInt(orders.appletsNum) + parseInt(orders.appNum)), (parseInt(pageviews.appNum) + parseInt(pageviews.appletsNum))) * 100 + "%";
                    function pros(up, down) {
                        //分母不能为0
                        let d = parseInt(down * 100) / 100;
                        d = d === 0 ? 1 : d;
                        return (Math.round(Math.abs(up) / d * 100) / 100);
                    }
                },
            })
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