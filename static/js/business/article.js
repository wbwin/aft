window.onload = function() {
    var shopData = JSON.parse(localStorage.getItem('shopData'));
    if (!shopData) {
        location.href = "/business/Login/index.html";
    } else {
        var app = new Vue({
            el: '.Huod',
            data: {
                datas: {},
                dataz: {},
                pageNumb: 0, //总页数
                pageCurent: 1, //当前页
                pageEach: 5, //每一页显示数据条数
                display:'none',//地址
                img:'',
            },
            created: function () {
                var that = this;
                axios({
                    method: "post",
                    url: "https://www.aftdc.com/business/Article/select",
                    data: {
                        token: shopData.token
                    }
                }).then(function (res) {
                    console.log(res)
                    if(res.data.res==1){
                        that.dataz=res.data.data;
                    }

                })
            },
            methods: {

                //------------------------分页跳转------------------------------------
                pageClick: function (index) {
                    var that = this
                    var pageNumb = that.pageNumb

                    var page = index * that.pageEach - that.pageEach
                    if (index > 0 && index < pageNumb + 1) {
                        that.pageCurent = index
                    }
                    axios({
                        method: "post",
                        url: 'https://www.aftdc.com/business/Membership/Membership_list',
                        data: {
                            page: page,
                            token: shopData.token,

                        },
                    }).then(function (res) {
                        if (res.data.res == 1) {
                            that.datas = res.data;
                            that.dataz = res.data.data;

                        } else if (res.data.res == -1) {
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href = "/business/Login/index.html";
                        } else {
                            alert('出错啦')
                        }
                    })

                    this.pageCurent = index
                },
                pageSub: function (index) {
                    if (this.pageCurent == 1) {
                        return false
                    }
                    this.pageCurent--
                    var that = this
                    var pageNumb = that.pageNumb
                    var page = that.pageCurent * that.pageEach - that.pageEach
                    if (index > 0 && index < pageNumb + 1) {
                        that.pageCurent = index
                    }

                    axios({
                        method: "post",
                        url: 'https://www.aftdc.com/business/Membership/Membership_list',
                        data: {
                            page: page,
                            token: shopData.token,

                        },
                    }).then(function (res) {
                        if (res.data.res == 1) {
                            that.datas = res.data;
                            that.dataz = res.data.data;

                        } else if (res.data.res == -1) {
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href = "/business/Login/index.html";
                        } else {
                            alert('出错啦')
                        }
                    })

                },
                pageAdd: function (index) {
                    if (this.pageCurent == this.pageNumb) {
                        return false
                    }
                    this.pageCurent++
                    var that = this
                    var pageNumb = that.pageNumb
                    var page = that.pageCurent * that.pageEach - that.pageEach
                    if (index > 0 && index < pageNumb + 1) {
                        that.pageCurent = index
                    }
                    axios({
                        method: "post",
                        url: 'https://www.aftdc.com/business/Membership/Membership_list',
                        data: {
                            page: page,
                            token: shopData.token,

                        },
                    }).then(function (res) {
                        if (res.data.res == 1) {
                            that.datas = res.data;
                            that.dataz = res.data.data;

                        } else if (res.data.res == -1) {
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href = "/business/Login/index.html";
                        } else {
                            alert('出错啦')
                        }
                    })

                },
                pageGo: function () {
                    var that = this
                    var goNum = $(".goto").val()
                    that.pageCurent = Number(goNum)
                    var page = goNum * that.pageEach - that.pageEach
                    axios({
                        method: "post",
                        url: 'https://www.aftdc.com/business/Membership/Membership_list',
                        data: {
                            page: page,
                            token: shopData.token,
                        },
                    }).then(function (res) {
                        if (res.data.res == 1) {
                            that.datas = res.data;
                            that.dataz = res.data.data;

                        } else if (res.data.res == -1) {
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href = "/business/Login/index.html";
                        } else {
                            alert('出错啦')
                        }
                    })
                },
                showText: function (index) {
                    var that = this

                    if (that.pageCurent < 5 && index < 10) {

                        return index
                    } else if (that.pageCurent >= 5 && index <= that.pageCurent + 4 && index >= that.pageCurent - 4 && that.pageCurent <= that.pageNumb - 4) {

                        return index
                    } else if (that.pageCurent > that.pageNumb - 5 && index > that.pageNumb - 9) {


                        return index
                    } else {
                        return false;
                    }

                },
                //**********
                btn1Click: function () {
                    var oDiv = document.getElementById('div1');
                    var aCh = oDiv.getElementsByTagName('input');
                    for (var i = 0; i < aCh.length; i++) {
                        aCh[i].checked = true;
                    }
                },
                btn2Click: function () {
                    var oDiv = document.getElementById('div1');
                    var aCh = oDiv.getElementsByTagName('input');
                    for (var i = 0; i < aCh.length; i++) {
                        aCh[i].checked = false;
                    }
                },
                btn3Click: function () {
                    var oDiv = document.getElementById('div1');
                    var aCh = oDiv.getElementsByTagName('input');
                    for (var i = 0; i < aCh.length; i++) {
                        if (aCh[i].checked == false) {
                            aCh[i].checked = true;
                        } else {
                            aCh[i].checked = false;
                        }
                    }
                },
                allINteClick: function () {

                    if ($('input[name="allINte"]').is(':checked')) {
                        $("#btn1").click();
                    } else {
                        $("#btn2").click();
                    }
                },

            }
        })
    }
}