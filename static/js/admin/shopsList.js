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
                sumCheck: false,
                checkedData: [],//复选框数据
                checkNumb: -1,//当复选框数据等于这个长度为全选

                pageNumb: 0,//总页数
                pageCurent: 1,//当前页
                pageEach: 10,//每页分几条数据

            },
            created: function () {
                window.localStorage.removeItem("shopId");
                this.pageFn(1);
            },
            methods: {
                //分页请求 查询数据
                pageFn: function (pageCurent) {
                    var that = this;
                    var page = (pageCurent - 1) * that.pageEach;
                    that.pageCurent = pageCurent;

                    axios({
                        method: "POST",
                        url: "https://www.aftdc.com/aftdcAControl/Shops/index",
                        data: {
                            page: page,
                            shopName: that.shopName,
                            shopId: that.shopId,
                            adminNum:adminData.adminNum,
                            token:adminData.token
                        },
                    }).then(function (res) {
                        var require = res.data;
                        if (require.res == 1) {
                            that.listData = require.data;

                            that.pageNumb = Math.ceil(require.pageCount / require.pageEach)
                            that.pageEach = require.pageEach;
                            if (require.pageCount < require.pageEach) {
                                that.checkNumb = require.pageCount
                            } else {
                                that.checkNumb = require.pageEach
                            }
                        }else if(res.data.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('adminData');
                            location.href="../Login/login.html";
                        }else{
                            that.listData = require.data;

                            that.pageNumb = Math.ceil(require.pageCount / require.pageEach)
                            that.pageEach = require.pageEach;
                            if (require.pageCount < require.pageEach) {
                                that.checkNumb = require.pageCount
                            } else {
                                that.checkNumb = require.pageEach
                            }
                        }
                    })
                },
                checkU: function () {
                    var checkedData = this.checkedData;
                    if (checkedData.length == this.checkNumb) {
                        this.sumCheck = true;
                    } else {
                        this.sumCheck = false;
                    }
                },
                //全选
                checkSum: function () {
                    var sumCheck = this.sumCheck;
                    if (sumCheck) {
                        var arr = [];
                        var listData = this.listData;
                        listData.forEach(function (item) {
                            var id = item.shopId;
                            arr.push(id)
                        })
                        this.checkedData = arr
                    } else {
                        this.checkedData = [];
                    }
                },
                // 封铺和解封
                sealFn: function (type) {
                    var that = this
                    var checkedData = this.checkedData;
                    if (checkedData.length > 0) {
                        var shopIds = checkedData.join(",");
                        axios({
                            method: "post",
                            url: "https://www.aftdc.com/aftdcAControl/Shops/shopStatus",
                            data: {
                                shopIds: shopIds,
                                type: type,
                                adminNum:adminData.adminNum,
                                token:adminData.token
                            }
                        }).then(function (res) {
                            if (res.data.res == 1) {
                                var listData = that.listData
                                var tt = type == 0 ? 5 : 1
                                listData.forEach(function (item, index) {
                                    var id = item.shopId;
                                    for (let x of checkedData) {
                                        if (x == id) {
                                            that.listData[index].shopStatus = tt;
                                            break;
                                        }
                                    }
                                })
                                that.checkedData = [];//把复选框置空
                            }else if(res.data.res == -1){
                                alert(res.data.reason)
                                localStorage.removeItem('adminData');
                                location.href="../Login/login.html";
                            }
                        })
                    }
                },
                del: function (shopId, index) {
                    var that = this;
                    if (confirm("确认删除该店铺？")) {
                        axios({
                            method: "post",
                            url: "https://www.aftdc.com/aftdcAControl/Shops/shop_delete",
                            data: {
                                shopId: shopId,
                                adminNum:adminData.adminNum,
                                token:adminData.token
                            }

                        }).then(function (res) {
                            if (res.data.res == 1) {
                                that.listData.splice(index, 1);
                            }else if(res.data.res == -1){
                                alert(res.data.reason)
                                localStorage.removeItem('adminData');
                                location.href="../Login/login.html";
                            }
                        })
                    }
                },
                add: function (shopId, index) {
                    var that = this;
                    var prints = this.listData[index];

                    axios({
                        method: "post",
                        url: "https://www.aftdc.com/aftdcAControl/Shops/printsInfo",
                        data: {
                            shopId: shopId,
                            printsKey: prints.printsKey,
                            printsNum: prints.printsNum,
                            adminNum:adminData.adminNum,
                            token:adminData.token
                        }
                    }).then(function (res) {
                        if (res.data.res == 1) {
                            alert("设置成功")
                        }else if(res.data.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('adminData');
                            location.href="../Login/login.html";
                        } else {
                            alert("设置失败")
                        }
                    })
                },

                getShopDetails: function (shopId) {
                    window.localStorage.setItem("shopId", shopId);
                    window.location.href = "shopsDetail.html"
                },
                shopJump:function (item) {
                    window.open('https://www.aftdc.com/pc/shop.html?shopId='+item.shopId);
                },
            }
        })
    }
}