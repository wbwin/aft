window.onload = function () {
    var shopData = JSON.parse(localStorage.getItem('shopData'));
    if (!shopData) {
        location.href = "/business/Login/index.html";
    } else {


            var app = new Vue({
                el: '#desk',
                data: {
                    dataz: {},
                    datas: {},
                    pageNumb: 0, //总页数
                    pageCurent: 1, //当前页
                    pageEach: 4, //每一页显示数据条数
                },
                created: function () {
                    var that = this;

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
                            url: 'https://www.aftdc.com/business/Fans/fans_list',
                            data: {
                                page: page,
                                token: shopData.token
                            },
                        }).then(function (res) {
                            if (res.data.res == 1) {
                                that.datas = res.data.data;
                                that.dataz = res.data;
                                //初始化页数
                                var pageCount = Number(res.data.pageCount);
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

                    //**********
                    fanAClick: function (index) {
                        var that = this;
                        console.log(index);
                        var userId = that.datas[index].userId;
                        console.log(userId);
                        location.href = '/business/Fans/fenemsg.html?userId=' + userId;
                        // location.href = "{:U('Business/GoodsSa/fenemsg',array('id'=>$vo['userId']))}";
                    }
                }
            })
        }

}