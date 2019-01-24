window.onload = function () {
    var shopData = JSON.parse(localStorage.getItem('shopData'));
    if (!shopData) {
        location.href = "/business/Login/index.html";
    } else {

                    var app = new Vue({
                        el: '.Funppt',
                        data: {

                            datas: {},
                            dataz: {},
                            phone: '',
                            pageNumb: 0, //总页数
                            pageCurent: 1, //当前页
                            pageEach: 10, //每一页显示数据条数
                        },
                        created: function () {

                            var that = this;

                            var url = location.search;
                            var phone = url.substr(1);
                            phone = phone.replace('userPhone=', '');
                            that.phone = phone;
                            console.log(phone);
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
                                    url: 'https://www.aftdc.com/business/Membership/annals_order',
                                    data: {
                                        page: page,
                                        userPhone: that.phone,
                                        token: shopData.token
                                    },
                                }).then(function (res) {
                                    if (res.data.res == -1) {
                                        alert('该用户没有订单')
                                        history.back();
                                    } else if (res.data.res == -1) {
                                        alert(res.data.reason)
                                        localStorage.removeItem('shopData');
                                        location.href = "/business/Login/index.html";
                                    }

                                    else {
                                        that.datas = res.data;
                                        that.dataz = res.data.data;
                                        //初始化页数
                                        var pageCount = Number(res.data.pageCount);
                                        var pageEach = Number(res.data.pageEach);
                                        that.pageEach = res.data.pageEach;
                                        var pageNumb = Math.ceil(pageCount / pageEach)
                                        that.pageNumb = pageNumb

                                    }
                                })

                            },

                            //**********

                        }
                    })
                }

}