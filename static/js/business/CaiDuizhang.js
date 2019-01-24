window.onload = function () {
    var shopData = JSON.parse(localStorage.getItem('shopData'));
    if (!shopData) {
        location.href = "/business/Login/index.html";
    } else {

        var app = new Vue({
            el: '.dec',
            data: {
                zhang: '',
                item: '',
                pageNumb: 0, //总页数
                pageCurent: 1, //当前页
                pageEach: 6, //每一页显示数据条数
                not_revenuepageCount: 0,
                revenuePageCount: 0,
                start:'',
                end:'',
            },
            created: function () {
                var that = this
                that.pageFn(1);
            },
            methods: {
                //------------------------分页跳转------------------------------------
                pageFn: function (pageCurent) {

                    var that = this;
                    var page = (pageCurent - 1) * that.pageEach;
                    that.pageCurent = pageCurent;
                    axios({
                        method: "post",
                        url: 'https://www.aftdc.com/Business/Finance/CaiDuizhang',
                        data: {
                            page: page,
                            frister: that.start,
                            nexter: that.end,
                            token: shopData.token

                        },
                    }).then(function (res) {

                        if (res.data.res == 1) {
                            that.zhang = res.data.data

                            that.revenuePageCount = Number(res.data.revenuePageCount);
                            var not_revenuepageCount = Number(res.data.not_revenuePageCount);
                            that.not_revenuepageCount = not_revenuepageCount;
                            var pageCount = that.revenuePageCount
                            var pageEach = Number(res.data.pageEach); //每一页显示数据条数
                            that.pageEach = res.data.pageEach;
                            var pageNumb = Math.ceil(pageCount / pageEach)  //总页数
                            that.pageNumb = pageNumb
                            var pageCurent = that.pageCurent
                        } else if (res.data.res == -1) {
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href = "/business/Login/index.html";
                        }

                    })


                },

                weijieClick: function () { //  点击【未结算账单】
                    var that = this;
                    $("#zheshijiesuan").hide();
                    $("#zheshiweijiesuan").show();
                    $("#yijie").css({"background": "#fafafa", "color": "#000"});
                    $("#weijie").css({"background": "#06c1ae", "color": "#fff"});
                    var pageNumb = Math.ceil(that.not_revenuepageCount / that.pageEach)
                    that.pageNumb = pageNumb

                },
                yijieClick: function () {
                    //  点击【已结算账单】
                    var that = this
                    $("#zheshijiesuan").show();
                    $("#zheshiweijiesuan").hide();
                    $("#weijie").css({"background": "#fafafa", "color": "#000"});
                    $("#yijie").css({"background": "#06c1ae", "color": "#fff"});
                    var pageNumb = Math.ceil(that.revenuePageCount / that.pageEach)
                    that.pageNumb = pageNumb
                },
                chaxunClick: function () {
                    var that = this;
                    // 点击  【查询】  [按照时间的限制来查询]
                    var Actin = $('input[name="frister"]').val(); // 获取 【开始时间】
                    var Nexter = $('input[name="nexter"]').val(); // 获取 【结束时间】
                    /** 根据SESSION ID 去 查询   【 SESSION ID  还未获取】**/
                    that.start=Actin,
                        that.end=Nexter,

                    axios({
                        method: "post",
                        url: 'https://www.aftdc.com/Business/Finance/CaiDuizhang', //  请求后台的路径
                        data: {
                            page: 0,
                            frister: Actin,
                            nexter: Nexter,
                            token: shopData.token
                        },
                    }).then(function (res) {

                        that.zhang = res.data.data
                        that.revenuePageCount = Number(res.data.revenuePageCount);
                        var not_revenuepageCount = Number(res.data.not_revenuePageCount);
                        that.not_revenuepageCount = not_revenuepageCount;
                        var pageCount = that.revenuePageCount
                        var pageEach = Number(res.data.pageEach); //每一页显示数据条数
                        that.pageEach = res.data.pageEach;
                        var pageNumb = Math.ceil(pageCount / pageEach)  //总页数
                        that.pageNumb = pageNumb
                        var pageCurent = that.pageCurent
                        if (res.data.res == -1) {
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href = "/business/Login/index.html";
                        }

                    })

                },

                quanbuClick: function () { // 点击  【查询】  [按照时间的限制来查询]
                    var that=this
                    // var Actin = $('input[name="actin"]').val(); // 获取 【开始时间】
                    // var Nexter = $('input[name="tover"]').val(); // 获取 【结束时间】
                    // /** 根据SESSION ID 去 查询   【 SESSION ID  还未获取】**/
                    that.start='',
                    that.end='',

                    axios({
                        method: "post",
                        url: 'https://www.aftdc.com/Business/Finance/CaiDuizhang', //  请求后台的路径
                        data: {
                            page: 0,
                            frister: that.start,
                            nexter: that.end,
                            token: shopData.token
                        },
                    }).then(function (res) {
                        that.zhang = res.data.data
                        that.revenuePageCount = Number(res.data.revenuePageCount);
                        var not_revenuepageCount = Number(res.data.not_revenuePageCount);
                        that.not_revenuepageCount = not_revenuepageCount;
                        var pageCount = that.revenuePageCount
                        var pageEach = Number(res.data.pageEach); //每一页显示数据条数
                        that.pageEach = res.data.pageEach;
                        var pageNumb = Math.ceil(pageCount / pageEach)  //总页数
                        that.pageNumb = pageNumb
                        var pageCurent = that.pageCurent
                        if (res.data.res == -1) {
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href = "/business/Login/index.html";
                        }

                    })



                },
                casui_anClick: function (msg) {
                    var id = msg.dataId

                    location.href = '/business/Finance/CaiMingxi.html?id=' + id;
                    // "{:U('Business/Finance/CaiMingxi','id='.$v['dataId'])}"
                },
            },
            mounted: function () {
                var myDate = new Date();

                var year = myDate.getFullYear(); //年
                var month = myDate.getMonth() + 1; // 月
                var day = myDate.getDate(); // 日期

                month = month > 9 ? month : '0' + month // 三目判断
                day = day > 9 ? day : '0' + day // 三目判断

                var time = year + '-' + month + '-' + day
                $("#nexter").val(time)


                var now = new Date;
                var dd = now.setDate(now.getDate() - 50) // 减去50天


                var y = now.getFullYear(); //年
                var m = now.getMonth() + 1; // 月
                var d = now.getDate(); // 日期
                var times = y + '-' + m + '-' + d


                $("#frister").val(times)
                $("#frister").dateSelect();
                $("#nexter").dateSelect();
            }
        })
    }
}