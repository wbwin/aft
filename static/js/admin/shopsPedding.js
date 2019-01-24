window.onload = function(){
    var adminData = JSON.parse(localStorage.getItem('adminData'));
    if(!adminData){
        location.href="../Login/login.html";
    }else {
        var app = new Vue({
            el: "#app",
            data: {
                listData: [],
                shopName: '',
                shopId: '',
                shopStatus: -999,

                pageNumb: 0,//总页数
                pageCurent: 1,//当前页
                pageEach: 10,//每页分几条数据

            },
            created: function () {
                window.localStorage.removeItem("shopId");
                this.pageFn(1)
            },
            methods: {
                //分页请求 查询数据
                pageFn: function (pageCurent) {
                    var that = this;
                    var page = (pageCurent - 1) * that.pageEach;
                    that.pageCurent = pageCurent;
                    var shopStatus = this.shopStatus == -999 ? '' : this.shopStatus
                    axios({
                        method: "POST",
                        url: "https://www.aftdc.com/aftdcAControl/Shops/PeddingShops",
                        data: {
                            page: page,
                            shopName: that.shopName,
                            shopId: that.shopId,
                            shopStatus: shopStatus,
                            adminNum:adminData.adminNum,
                            token:adminData.token
                        },
                    }).then(function (res) {
                        console.log(res)
                        var require = res.data;
                        if (require.res == 1) {
                            that.listData = require.data;
                            that.pageNumb = Math.ceil(require.pageCount / require.pageEach)
                            that.pageEach = require.pageEach
                        }else if(res.data.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('adminData');
                            location.href="../Login/login.html";
                        } else {
                            that.listData = [];
                            that.pageNumb = Math.ceil(require.pageCount / require.pageEach)
                            that.pageEach = require.pageEach
                        }
                    })
                },

                del: function (shopId, index) {
                    var that = this;
                    if (confirm("确认删除该店铺?")) {
                        axios({
                            method: "post",
                            url: "https://www.aftdc.com/aftdcAControl/Shops/delApplyShop",
                            data: {
                                shopId: shopId,
                                adminNum:adminData.adminNum,
                                token:adminData.token
                            }

                        }).then(function (res) {
                            if (res.data.res == 1) {
                                that.listData.splice(index, 1)
                            }else if(res.data.res == -1){
                                alert(res.data.reason)
                                localStorage.removeItem('adminData');
                                location.href="../Login/login.html";
                            }
                        })
                    }
                },

                see: function (shopId) {
                    window.localStorage.setItem("shopId", shopId);
                    window.location.href = "seeShop.html"
                }
            }
        })
    }
}