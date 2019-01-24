window.onload = function () {
    var shopData = JSON.parse(localStorage.getItem('shopData'));
    if (!shopData) {
        location.href = "/business/Login/index.html";
    } else {


            var app = new Vue({
                el: '.dec',
                data: {
                    dataz: '',
                    datazm: '',
                    pageNumb: 0, //总页数
                    pageCurent: 1, //当前页
                    pageEach: 4, //每一页显示数据条数
                    waimaiPageCount: 0,
                    id: '',


                },
                created: function () {
                    var that = this;
                    var url = location.search;
                    var id = url.substr(1);
                    id = id.replace('id=', '')
                    that.id = id;
                    axios({
                        method: "post",
                        url: 'https://www.aftdc.com/Business/Finance/CaiMingxi',
                        data: {
                            page: 0,
                            dataId: id,
                            token: shopData.token
                        },
                    }).then(function (res) {

                        console.log(res)
                        if (res.data.res == 1) {
                            that.dataz = res.data.data;
                            that.datazm = res.data.data.minxi[0];
                            var pageCount = Number(res.data.minxiPageCount);
                            var waimaiPageCount = Number(res.data.waimaiPageCount);
                            that.waimaiPageCount = waimaiPageCount;
                            var pageEach = Number(res.data.pageEach);
                            that.pageEach = res.data.pageEach;
                            var pageNumb = Math.ceil(pageCount / pageEach)
                            that.pageNumb = pageNumb
                        } else if (res.data.res == -1) {
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href = "/business/Login/index.html";
                        }

                    })
                },
                methods: {
                    //------------------------分页跳转------------------------------------
                    pageClick: function (index) {
                        var that = this
                        var pageNumb = that.pageNumb
                        console.log(index)
                        var page = index * that.pageEach - that.pageEach
                        axios({
                            method: "post",
                            url: 'https://www.aftdc.com/Business/Finance/CaiMingxi',
                            data: {
                                page: page,
                                dataId: that.id,
                                token: shopData.token
                            },
                        }).then(function (res) {
                            if (res.data.res == 1) {
                                that.dataz = res.data.data;
                                that.datazm = res.data.data.minxi[0];
                            } else if (res.data.res == -1) {
                                alert(res.data.reason)
                                localStorage.removeItem('shopData');
                                location.href = "/business/Login/index.html";
                            }

                        })

                        this.pageCurent = index
                    },
                    pageSub: function () {
                        if (this.pageCurent == 1) {
                            return false
                        }
                        this.pageCurent--
                        var that = this
                        var pageNumb = that.pageNumb
                        var page = that.pageCurent * that.pageEach - that.pageEach
                        axios({
                            method: "post",
                            url: 'https://www.aftdc.com/Business/Finance/CaiMingxi',
                            data: {
                                page: page,
                                dataId: that.id,
                                token: shopData.token
                            },
                        }).then(function (res) {
                            if (res.data.res == 1) {
                                that.dataz = res.data.data;
                                that.datazm = res.data.data.minxi[0];
                            } else if (res.data.res == -1) {
                                alert(res.data.reason)
                                localStorage.removeItem('shopData');
                                location.href = "/business/Login/index.html";
                            }


                        })

                    },
                    pageAdd: function () {
                        if (this.pageCurent == this.pageNumb) {
                            return false
                        }
                        this.pageCurent++
                        var that = this
                        var pageNumb = that.pageNumb
                        var page = that.pageCurent * that.pageEach - that.pageEach
                        axios({
                            method: "post",
                            url: 'https://www.aftdc.com/Business/Finance/CaiMingxi',
                            data: {
                                page: page,
                                dataId: that.id,
                                token: shopData.token
                            },
                        }).then(function (res) {
                            if (res.data.res == 1) {
                                that.dataz = res.data.data;
                                that.datazm = res.data.data.minxi[0];

                            } else if (res.data.res == -1) {
                                alert(res.data.reason)
                                localStorage.removeItem('shopData');
                                location.href = "/business/Login/index.html";
                            }

                        })

                    },
                    Eone: function () {
                        $(".sccJon").show();
                        $(".in_ing").show();
                    },
                    Uone: function () {
                        $(".sccJon").hide();
                        $(".in_ing").hide();
                    },
                    Etwo: function () {
                        $(".towJon").show();
                        $(".towJon_ing").show();
                    },
                    Utwo: function () {
                        $(".towJon").hide();
                        $(".towJon_ing").hide();
                    },
                    Ethe: function () {
                        $(".theJon").show();
                        $(".theJon_ing").show();
                    },
                    Uthe: function () {
                        $(".theJon").hide();
                        $(".theJon_ing").hide();
                    },
                    Efou: function () {
                        $(".fourJon").show();
                        $(".fourJon_ing").show();
                    },
                    Ufou: function () {
                        $(".fourJon").hide();
                        $(".fourJon_ing").hide();
                    },
                    Efive: function () {
                        $(".fiveJon").show();
                        $(".fiveJon_ing").show();
                    },
                    Ufive: function () {
                        $(".fiveJon").hide();
                        $(".fiveJon_ing").hide();
                    },
                    Esix: function () {
                        $(".sixJon").show();
                        $(".sixJon_ing").show();
                    },
                    Usix: function () {
                        $(".sixJon").hide();
                        $(".sixJon_ing").hide();
                    },
                    qit_bClick: function () { // 点击【其他类】
                        $(".qit_b").css({"background": "#06c1ae", "color": "#fff", "font-weight": "900"});
                        $(".din_a").css({"background": "#fafafa", "color": "#000", "font-weight": "100"});
                        $(".cwej_ewjk").hide();
                        $(".edcjo_pcd").show();
                    },
                    din_aClick: function () {
                        // 点击【订单类】
                        $(".qit_b").css({"background": "#fafafa", "color": "#000", "font-weight": "100"});
                        $(".din_a").css({"background": "#06c1ae", "color": "#fff", "font-weight": "900"});
                        $(".cwej_ewjk").show();
                        $(".edcjo_pcd").hide()
                    },
                    tan_waiClick: function () {
                        // 点击 外卖订单
                        var that = this;
                        $(".all_all").css('color', '#c5c6c7');
                        $(".tan_wai").css('color', '#06c1ae');
                        $(".tui_fan").css('color', '#c5c6c7');
                        $(".allT").hide();
                        $(".waimai").show();

                        var pageNumb = Math.ceil(that.waimaiPageCount / that.pageEach)
                        that.pageNumb = pageNumb
                    },
                    tui_fanClick: function () {
                        // 点击 退款方式
                        $(".all_all").css('color', '#c5c6c7');
                        $(".tan_wai").css('color', '#c5c6c7');
                        $(".tui_fan").css('color', '#06c1ae');

                    },
                    all_allClick: function () {
                        // 点击 退款方式
                        var that = this;
                        $(".all_all").css('color', '#06c1ae');
                        $(".tan_wai").css('color', '#c5c6c7');
                        $(".tui_fan").css('color', '#c5c6c7');
                        $(".allT").show();
                        $(".waimai").hide();
                        var pageNumb = Math.ceil(that.minxiPageCount / that.pageEach)
                        that.pageNumb = pageNumb

                    },
                    all_ontClick: function () {
                        // 点击【其他类】 【全部】
                        $(".all_ont").css('color', '#06c1ae');
                        $(".tsc_vwai").css('color', '#c5c6c7');
                        $(".tui_fdv").css('color', '#c5c6c7');
                        $(".tui_gtg").css('color', '#c5c6c7');
                        $(".tui_hyv").css('color', '#c5c6c7');
                        $(".tui_kin").css('color', '#c5c6c7');

                    },
                    tsc_vwaiClick: function () {
                        // 点击【其他类】 【众包费用】
                        $(".all_ont").css('color', '#c5c6c7');
                        $(".tsc_vwai").css('color', '#06c1ae');
                        $(".tui_fdv").css('color', '#c5c6c7');
                        $(".tui_gtg").css('color', '#c5c6c7');
                        $(".tui_hyv").css('color', '#c5c6c7');
                        $(".tui_kin").css('color', '#c5c6c7');
                    },
                    tui_fdvClick: function () {
                        // 点击【其他类】 【餐损赔付】
                        $(".all_ont").css('color', '#c5c6c7');
                        $(".tsc_vwai").css('color', '#c5c6c7');
                        $(".tui_fdv").css('color', '#06c1ae');
                        $(".tui_gtg").css('color', '#c5c6c7');
                        $(".tui_hyv").css('color', '#c5c6c7');
                        $(".tui_kin").css('color', '#c5c6c7');
                    },
                    tui_gtgClick: function () {
                        // 点击【其他类】 【服务费返还】
                        $(".all_ont").css('color', '#c5c6c7');
                        $(".tsc_vwai").css('color', '#c5c6c7');
                        $(".tui_fdv").css('color', '#c5c6c7');
                        $(".tui_gtg").css('color', '#06c1ae');
                        $(".tui_hyv").css('color', '#c5c6c7');
                        $(".tui_kin").css('color', '#c5c6c7');
                    },
                    tui_hyvClick: function () {
                        // 点击【其他类】 【部分订单退款】
                        $(".all_ont").css('color', '#c5c6c7');
                        $(".tsc_vwai").css('color', '#c5c6c7');
                        $(".tui_fdv").css('color', '#c5c6c7');
                        $(".tui_gtg").css('color', '#c5c6c7');
                        $(".tui_hyv").css('color', '#06c1ae');
                        $(".tui_kin").css('color', '#c5c6c7');
                    },
                    tui_kinClick: function () {
                        // 点击【其他类】 【部分退款冲抵】
                        $(".all_ont").css('color', '#c5c6c7');
                        $(".tsc_vwai").css('color', '#c5c6c7');
                        $(".tui_fdv").css('color', '#c5c6c7');
                        $(".tui_gtg").css('color', '#c5c6c7');
                        $(".tui_hyv").css('color', '#c5c6c7');
                        $(".tui_kin").css('color', '#06c1ae');
                    },
                    abiaoqianClick: function (item) {
                        var id = item.orderId
                        location.href = '/business/Finance/CaiXiang.html?id=' + id;
                    },
                }
            })
        }

}