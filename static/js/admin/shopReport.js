window.onload = function(){
    var adminData = JSON.parse(localStorage.getItem('adminData'));
    if(!adminData){
        location.href="../Login/login.html";
    }else {
        var app = new Vue({
            el: "#app",
            data: {
                shopData: [],
                pageNumb: 0,//总页数
                pageCurent: 1,//当前页
                pageEach: 10,//每页分几条数据
                imgData:[],
                imgToggle:0,
            },
            created: function () {
                this.pageFn(1)
            },
            methods: {
                //分页请求 查询数据
                pageFn: function (pageCurent) {
                    var that = this;
                    var page = (pageCurent - 1) * that.pageEach;
                    that.pageCurent = pageCurent;
                    axios({
                        method: "POST",
                        url: 'https://www.aftdc.com/aftdcAControl/Tag/shopReport',
                        data: {
                            page: page,
                            adminNum:adminData.adminNum,
                            token:adminData.token
                        },
                    }).then(function (res) {
                        console.log(res)
                        var require = res.data;
                        if (require.res == 1) {
                            that.shopData = require.data;
                            that.pageNumb = Math.ceil(require.pageCount / require.pageEach)
                            that.pageEach = require.pageEach
                        }else if(res.data.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('adminData');
                            location.href="../Login/login.html";
                        }
                    })
                },

                del: function (id, index) {
                    var that = this;
                    if (confirm("确认删除该举报记录？")) {
                        axios({
                            method: "post",
                            url: "https://www.aftdc.com/aftdcAControl/Tag/delShopPl",
                            data: {
                                id: id,
                                adminNum:adminData.adminNum,
                                token:adminData.token
                            }
                        }).then(function (res) {
                            if (res.data.res == 1) {
                                that.shopData.splice(index, 1);
                            }else if(res.data.res == -1){
                                alert(res.data.reason)
                                localStorage.removeItem('adminData');
                                location.href="../Login/login.html";
                            }
                        })
                    }
                },

                ban: function (userId) {
                    var that = this;
                    if (confirm("确认封掉该号？")) {
                        axios({
                            method: "post",
                            url: "https://www.aftdc.com/aftdcAControl/Tag/ban",
                            data: {
                                type: 1,
                                userId: userId,
                                adminNum:adminData.adminNum,
                                token:adminData.token
                            }
                        }).then(function (res) {
                            if (res.data.res == 1) {
                                alert("操作成功")
                            }else if(res.data.res == -1){
                                alert(res.data.reason)
                                localStorage.removeItem('adminData');
                                location.href="../Login/login.html";
                            }
                        })
                    }
                },
                banShop: function (shopId) {
                    var that = this;
                    if (confirm("确认封掉该店铺？")) {
                        axios({
                            method: "post",
                            url: "https://www.aftdc.com/aftdcAControl/Tag/banShop",
                            data: {
                                shopId: shopId,
                                adminNum:adminData.adminNum,
                                token:adminData.token
                            }
                        }).then(function (res) {
                            if (res.data.res == 1) {
                                alert("操作成功")
                            }else if(res.data.res == -1){
                                alert(res.data.reason)
                                localStorage.removeItem('adminData');
                                location.href="../Login/login.html";
                            }
                        })
                    }
                },
                banShopForever: function (shopId) {
                    var that = this;
                    if (confirm("确认永久封掉该店铺？")) {
                        axios({
                            method: "post",
                            url: "https://www.aftdc.com/aftdcAControl/Tag/banShopForver",
                            data: {
                                shopId: shopId,
                                adminNum:adminData.adminNum,
                                token:adminData.token
                            }
                        }).then(function (res) {
                            if (res.data.res == 1) {
                                alert("操作成功")
                            }else if(res.data.res == -1){
                                alert(res.data.reason)
                                localStorage.removeItem('adminData');
                                location.href="../Login/login.html";
                            }
                        })
                    }
                },
                seeImg:function (item) {

                    var that=this;
                    $('.seeImgHide').show();
                    that.imgData=item.Img;
                },
                imgClose:function () {
                    $('.seeImgHide').hide();
                },
                prev:function () {
                    var that=this
                    that.imgToggle--;
                },
                next:function () {
                    var that=this
                    that.imgToggle++;
                },
            }
        })
    }
}