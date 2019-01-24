window.onload = function () {
    var shopData = JSON.parse(localStorage.getItem('shopData'));
    if (!shopData) {
        location.href = "/business/Login/index.html";
    } else {


                var app = new Vue({
                    el: '.dec',
                    data: {
                        manage: '',
                        manageMy: '',
                        pageNumb: 0, //总页数
                        pageCurent: 1, //当前页
                        pageEach: 10, //每一页显示数据条数
                        // cash_drawsPageCount: '',
                        // jintianPageCount: '',
                        // qitianPageCount: '',
                        // sorPageCount: '',
                        // yigeyuePageCount: '',
                        // zhufuPageCount: '',
                        // pageCount: '',
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
                                url: "https://www.aftdc.com/Business/Finance/CaiYue",
                                data: {
                                    page: page,
                                    token: shopData.token
                                },
                            }).then(function (res) {
                                if (res.data.res == 1) {
                                    that.manage = res.data.data
                                    that.manageMy = res.data.data.money;
                                    var pageCount = Number(res.data.pageCount.cash_drawsPageCount);
                                    var pageEach = Number(res.data.pageEach);
                                    that.pageEach = res.data.pageEach;
                                    var pageNumb = Math.ceil(pageCount / pageEach)
                                    that.pageNumb = pageNumb

                                }

                                else if (res.data.res == -1) {
                                    alert(res.data.reason)
                                    localStorage.removeItem('shopData');
                                    location.href = "/business/Login/index.html";
                                }
                                else {
                                    alert('出错啦')
                                }
                            })


                        },

                        //**********
                        cewkjcoClick: function () {
                            var that = this
                            var onetime = $('input[name=adate]').val();
                            var twotime = $('input[name=bdata]').val();
                            console.log(onetime);
                            axios({
                                method: "post",
                                url: 'https://www.aftdc.com/Business/Finance/CaiYue',
                                data: {
                                    page: 0,
                                    adate: onetime,
                                    bdata: twotime,
                                    token: shopData.token
                                },
                            }).then(function (res) {
                                if (res.data.res == 1) {
                                    that.manage = res.data.data
                                    that.manageMy = res.data.data.money;
                                    var pageCount = Number(res.data.pageCount.cash_drawsPageCount);
                                    var pageEach = Number(res.data.pageEach);
                                    that.pageEach = res.data.pageEach;
                                    var pageNumb = Math.ceil(pageCount / pageEach)
                                    that.pageNumb = pageNumb
                                }
                                else if (res.data.res == -1) {
                                    alert(res.data.reason)
                                    localStorage.removeItem('shopData');
                                    location.href = "/business/Login/index.html";
                                }

                                else {
                                    alert('出错啦')
                                }
                            })


                        },
                        jinjruClick: function () {
                            // 点击【收入】
                            $("#qun").css({"background": "#fff", "color": "#2bb8aa"});
                            $("#jinjru").css({"background": "#2bb8aa", "color": "#fff"});
                            $("#zhufu").css({"background": "#fff", "color": "#2bb8aa"});

                            $("#timeonee").css({"background": "#fff", "color": "#2bb8aa"});
                            $("#timwtwo").css({"background": "#fff", "color": "#2bb8aa"});
                            $("#timethree").css({"background": "#fff", "color": "#2bb8aa"});

                            $(".xuanzexin").show();
                            $(".keyitiquyue").hide();
                            $("#shouru").show();
                            $(".zhufu").hide();
                            $("#zhufuf").hide();
                            $("#qitian").hide();
                            $(".keybaozhengjinyue").hide();
                            $(".keytuiguangyue").hide();
                            $("#yigeyue").hide();
                            $("#jinrian").hide();
                            var that = this
                            axios({
                                method: "post",
                                url: "https://www.aftdc.com/Business/Finance/CaiYue",
                                data: {
                                    page: 0,
                                    token: shopData.token
                                }
                            }).then(function (res) {
                                console.log(res);

                                if (res.data.res == 1) {
                                    that.manage = res.data.data
                                    that.manageMy = res.data.data.money;
                                    //初始化页数
                                    var pageCount = Number(res.data.pageCount.sorPageCount);
                                    var pageEach = Number(res.data.pageEach);
                                    that.pageEach = res.data.pageEach;
                                    var pageNumb = Math.ceil(pageCount / pageEach)
                                    that.pageNumb = pageNumb
                                }
                                else if (res.data.res == -1) {
                                    alert(res.data.reason)
                                    localStorage.removeItem('shopData');
                                    location.href = "/business/Login/index.html";
                                }

                            })
                        },
                        zhufuClick: function () { // 点击【支出】
                            $("#qun").css({"background": "#fff", "color": "#2bb8aa"});
                            $("#jinjru").css({"background": "#fff", "color": "#2bb8aa"});
                            $("#zhufu").css({"background": "#2bb8aa", "color": "#fff"});
                            $("#timeonee").css({"background": "#fff", "color": "#2bb8aa"});
                            $("#timwtwo").css({"background": "#fff", "color": "#2bb8aa"});
                            $("#timethree").css({"background": "#fff", "color": "#2bb8aa"});

                            $(".xuanzexin").show();
                            $(".keyitiquyue").hide();
                            $(".zhufu").show();
                            $("#shouru").hide();
                            $("#qitian").hide();
                            $("#yigeyue").hide();
                            $(".keybaozhengjinyue").hide();
                            $(".keytuiguangyue").hide();
                            $("#jinrian").hide();
                            var that = this
                            axios({
                                method: "post",
                                url: "https://www.aftdc.com/Business/Finance/CaiYue",
                                data: {
                                    page: 0,
                                    token: shopData.token
                                }
                            }).then(function (res) {
                                console.log(res);

                                if (res.data.res == 1) {
                                    that.manage = res.data.data
                                    that.manageMy = res.data.data.money;
                                    //初始化页数
                                    var pageCount = Number(res.data.pageCount.zhufuPageCount);
                                    var pageEach = Number(res.data.pageEach);
                                    that.pageEach = res.data.pageEach;
                                    var pageNumb = Math.ceil(pageCount / pageEach)
                                    that.pageNumb = pageNumb
                                }
                                else if (res.data.res == -1) {
                                    alert(res.data.reason)
                                    localStorage.removeItem('shopData');
                                    location.href = "/business/Login/index.html";
                                }

                            })

                        },
                        qunClick: function () {
                            // 点击【全部】
                            $("#timeonee").css({"background": "#fff", "color": "#2bb8aa"});
                            $("#qun").css({"background": "#2bb8aa", "color": "#fff"});
                            $("#jinjru").css({"background": "#fff", "color": "#2bb8aa"});
                            $("#zhufu").css({"background": "#fff", "color": "#2bb8aa"});
                            location.reload()
                        },
                        timwtwoClick: function () { // 点击【最近7天】
                            $("#timeonee").css({"background": "#fff", "color": "#2bb8aa"});
                            $("#timwtwo").css({"background": "#2bb8aa", "color": "#fff"});
                            $("#timethree").css({"background": "#fff", "color": "#2bb8aa"});
                            $("#jinjru").css({"background": "#fff", "color": "#2bb8aa"});
                            $("#zhufu").css({"background": "#fff", "color": "#2bb8aa"});
                            $("#qun").css({"background": "#fff", "color": "#2bb8aa"});
                            $(".xuanzexin").show();
                            $(".keyitiquyue").hide();
                            $("#qitian").show();
                            $("#yigeyue").hide();
                            $("#zhufuf").hide();
                            $("#jinrian").hide();
                            $("#shouru").hide();
                            $(".keybaozhengjinyue").hide();
                            $(".keytuiguangyue").hide();
                            var that = this
                            axios({
                                method: "post",
                                url: "https://www.aftdc.com/Business/Finance/CaiYue",
                                data: {
                                    page: 0,
                                    token: shopData.token
                                }
                            }).then(function (res) {
                                console.log(res);

                                if (res.data.res == 1) {
                                    that.manage = res.data.data
                                    that.manageMy = res.data.data.money;
                                    //初始化页数
                                    var pageCount = Number(res.data.pageCount.qitianPageCount);
                                    var pageEach = Number(res.data.pageEach);
                                    that.pageEach = res.data.pageEach;
                                    var pageNumb = Math.ceil(pageCount / pageEach)
                                    that.pageNumb = pageNumb
                                }
                                else if (res.data.res == -1) {
                                    alert(res.data.reason)
                                    localStorage.removeItem('shopData');
                                    location.href = "/business/Login/index.html";
                                }

                            })

                        },
                        timethreeClick: function () {
                            // 点击【最近30天】
                            $("#timeonee").css({"background": "#fff", "color": "#2bb8aa"});
                            $("#timwtwo").css({"background": "#fff", "color": "#2bb8aa"});
                            $("#timethree").css({"background": "#2bb8aa", "color": "#fff"});
                            $("#jinjru").css({"background": "#fff", "color": "#2bb8aa"});
                            $("#zhufu").css({"background": "#fff", "color": "#2bb8aa"});
                            $("#qun").css({"background": "#fff", "color": "#2bb8aa"});
                            $(".xuanzexin").show();
                            $(".keyitiquyue").hide();
                            $("#yigeyue").show();
                            $("#jinrian").hide();
                            $("#zhufuf").hide();
                            $("#qitian").hide();
                            $("#shouru").hide();
                            $(".keybaozhengjinyue").hide();
                            $(".keytuiguangyue").hide();
                            var that = this
                            axios({
                                method: "post",
                                url: "https://www.aftdc.com/Business/Finance/CaiYue",
                                data: {
                                    page: 0,
                                    token: shopData.token
                                }
                            }).then(function (res) {
                                console.log(res);

                                if (res.data.res == 1) {
                                    that.manage = res.data.data
                                    that.manageMy = res.data.data.money;
                                    //初始化页数
                                    var pageCount = Number(res.data.pageCount.yigeyuePageCount);
                                    var pageEach = Number(res.data.pageEach);
                                    that.pageEach = res.data.pageEach;
                                    var pageNumb = Math.ceil(pageCount / pageEach)
                                    that.pageNumb = pageNumb
                                }
                                else if (res.data.res == -1) {
                                    alert(res.data.reason)
                                    localStorage.removeItem('shopData');
                                    location.href = "/business/Login/index.html";
                                }

                            })
                        },
                        timeoneeClick: function () {
                            // 点击【今天】
                            $("#timeonee").css({"background": "#2bb8aa", "color": "#fff"});
                            $("#timwtwo").css({"background": "#fff", "color": "#2bb8aa"});
                            $("#timethree").css({"background": "#fff", "color": "#2bb8aa"});
                            $("#jinjru").css({"background": "#fff", "color": "#2bb8aa"});
                            $("#zhufu").css({"background": "#fff", "color": "#2bb8aa"});
                            $("#qun").css({"background": "#fff", "color": "#2bb8aa"});
                            $(".xuanzexin").show();
                            $(".keyitiquyue").hide();
                            $("#jinrian").show();
                            $("#qitian").hide();
                            $("#yigeyue").hide();
                            $("#shouru").hide();
                            $("#zhufuf").hide();
                            $(".keybaozhengjinyue").hide();
                            $(".keytuiguangyue").hide();
                            var that = this
                            axios({
                                method: "post",
                                url: "https://www.aftdc.com/Business/Finance/CaiYue",
                                data: {
                                    page: 0,
                                    token: shopData.token
                                }
                            }).then(function (res) {
                                console.log(res);
                                if (res.data.res == 1) {
                                    that.manage = res.data.data
                                    that.manageMy = res.data.data.money;
                                    //初始化页数
                                    var pageCount = Number(res.data.pageCount.jintianPageCount);
                                    var pageEach = Number(res.data.pageEach);
                                    that.pageEach = res.data.pageEach;
                                    var pageNumb = Math.ceil(pageCount / pageEach)
                                    that.pageNumb = pageNumb
                                }
                                else if (res.data.res == -1) {
                                    alert(res.data.reason)
                                    localStorage.removeItem('shopData');
                                    location.href = "/business/Login/index.html";
                                }

                            })
                        },
                        timezidingClick: function () {

                            if ($(".zidingyishi").css("display") == "none") {
                                $(".zidingyishi").css('display', 'block');
                                $("#timeziding").css({"background": "#2bb8aa", "color": "#fff"});
                                var myDate = new Date();

                                var year = myDate.getFullYear(); //年
                                var month = myDate.getMonth() + 1; // 月
                                var day = myDate.getDate(); // 日期

                                month = month > 9 ? month : '0' + month // 三目判断
                                day = day > 9 ? day : '0' + day // 三目判断

                                var time = year + '-' + month + '-' + day

                                $("#bdata").val(time)

                                var now = new Date;
                                var dd = now.setDate(now.getDate() - 50) // 减去50天


                                var y = now.getFullYear(); //年
                                var m = now.getMonth() + 1; // 月
                                var d = now.getDate(); // 日期
                                var times = y + '-' + m + '-' + d


                                $("#adate").val(times)
                                $("#adate").dateSelect();
                                $("#bdata").dateSelect();
                            } else {
                                $(".zidingyishi").css('display', 'none');
                                $("#timeziding").css({"background": "#fff", "color": "#2bb8aa"});
                            }
                        },
                        thetwoClick: function () {
                            // 点击【可提取余额】
                            $("#theone").css({"background": "#bababa", "color": "#000"});
                            $("#thetwo").css({"background": "#2bb8aa", "color": "#fff"});
                            $("#thethree").css({"background": "#bababa", "color": "#000"});
                            $("#thefour").css({"background": "#bababa", "color": "#000"});

                            $(".xuanzexin").show();
                            $(".keyitiquyue").show();
                            $(".keypeisongyue").hide();
                            $(".keybaozhengjinyue").hide();
                            $(".keytuiguangyue").hide();
                            $(".keyitiquyuee").hide();
                        },
                        thethreeClick: function () {
                            // 点击【可提取余额】
                            $("#theone").css({"background": "#bababa", "color": "#000"});
                            $("#thetwo").css({"background": "#bababa", "color": "#000"});
                            $("#thethree").css({"background": "#2bb8aa", "color": "#fff"});
                            $("#thefour").css({"background": "#bababa", "color": "#000"});

                            $(".xuanzexin").hide();
                            $(".keyitiquyue").hide();
                            $(".keypeisongyue").hide();
                            $(".keybaozhengjinyue").show();
                            $(".keytuiguangyue").hide();
                        },
                        thefourClick: function () {
                            // 点击【可提取余额】
                            $("#theone").css({"background": "#bababa", "color": "#000"});
                            $("#thetwo").css({"background": "#bababa", "color": "#000"});
                            $("#thethree").css({"background": "#bababa", "color": "#000"});
                            $("#thefour").css({"background": "#2bb8aa", "color": "#fff"});

                            $(".xuanzexin").show();
                            $(".keyitiquyue").hide();
                            $(".keypeisongyue").hide();
                            $(".keybaozhengjinyue").hide();
                            $(".keytuiguangyue").show();
                        },
                        theoneClick: function () {
                            // 点击【可提取余额】
                            $("#theone").css({"background": "#2bb8aa", "color": "#fff"});
                            $("#thetwo").css({"background": "#bababa", "color": "#000"});
                            $("#thethree").css({"background": "#bababa", "color": "#000"});
                            $("#thefour").css({"background": "#bababa", "color": "#000"});

                            $(".xuanzexin").show();
                            $(".keyitiquyue").show();
                            $(".keypeisongyue").hide();
                            $(".keybaozhengjinyue").hide();
                            $(".keytuiguangyue").hide();
                        },
                        Cone: function () {
                            $("#scs").show();
                            $(".dcnho").show();
                        },
                        Yone: function () {
                            $("#scs").hide();
                            $(".dcnho").hide();
                        },
                        Ctwo: function () {
                            $("#scxssNcs").show();
                            $(".dcnsho").show();
                        },
                        Ytwo: function () {
                            $("#scxssNcs").hide();
                            $(".dcnsho").hide();
                        },
                        Cthree: function () {
                            $("#svsNcs").show();
                            $(".dcnscdho").show();
                        },
                        Ythree: function () {
                            $("#svsNcs").hide();
                            $(".dcnscdho").hide();
                        },
                        Cfour: function () {
                            $("#gtsNcs").show();
                            $(".dcfdso").show();
                        },
                        Yfour: function () {
                            $("#gtsNcs").hide();
                            $(".dcfdso").hide();
                        },
                        Cfive: function () {
                            $("#lster").show();
                            $(".lster").show();
                        },
                        Yfive: function () {
                            $("#lster").hide();
                            $(".lster").hide();
                        },
                        onetixianClick: function () {
                            location.href = '/business/Finance/CaiTixian.html';
                        },
                        rem_SevensClick: function (msg, index) {
                            var id = msg.moneyId
                            console.log(msg.moneyId);
                            console.log(index);
                            location.href = '/business/Finance/Caition.html?id=' + id;
                        },
                    },
                    mounted: function () {


                    }
                })
            }

}