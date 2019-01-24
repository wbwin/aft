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
                goodsName: '',
                sumCheck: false,
                checkData: [],//复选框数据
                checkNumb: -1,//当复选框数据等于这个长度为全选

                pageNumb: 0,//总页数
                pageCurent: 1,//当前页
                pageEach: 10,//每页分几条数据
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
                        url: "https://www.aftdc.com/aftdcacontrol/Goods/index",
                        data: {
                            page: page,
                            shopName: that.shopName,
                            goodsName: that.goodsName,
                            adminNum:adminData.adminNum,
                            token:adminData.token
                        },
                    }).then(function (res) {
                        var require = res.data;
                        if (require.res == 1) {
                            that.listData = require.data;
                            that.pageNumb = Math.ceil(require.pageCount / require.pageEach)
                            that.pageEach = require.pageEach
                            if (require.pageCount < require.pageEach) {
                                that.checkNumb = require.pageCount
                            } else {
                                that.checkNumb = require.pageEach
                            }
                            that.checkU();
                        }else if(res.data.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('adminData');
                            location.href="../Login/login.html";
                        }else{
                            that.listData = require.data;
                            that.pageNumb = Math.ceil(require.pageCount / require.pageEach)
                            that.pageEach = require.pageEach
                            if (require.pageCount < require.pageEach) {
                                that.checkNumb = require.pageCount
                            } else {
                                that.checkNumb = require.pageEach
                            }
                            that.checkU();
                        }
                    })
                },
                checkU: function () {
                    // this.sumCheck=true;
                    var checkData = this.checkData;
                    var listData = this.listData;
                    var arr = [];
                    for (let item of listData) {
                        var id = item.goodsId;
                        for (let x of checkData) {
                            if (x == id) {
                                arr.push(x)
                            }
                        }
                    }
                    if (arr.length != this.checkNumb) {
                        this.sumCheck = false;
                    } else {
                        this.sumCheck = true;
                    }


                },
                //全选
                checkSum: function () {
                    var sumCheck = this.sumCheck;
                    var arr = [];
                    var listData = this.listData;
                    listData.forEach(function (item) {
                        var id = item.goodsId;
                        arr.push(id)
                    })
                    var checkData = this.checkData;

                    arr.forEach(function (af) {
                        checkData.forEach(function (x, index) {
                            if (x == af) {
                                checkData.splice(index, 1)
                            }
                        })
                    })
                    if (sumCheck) {
                        checkData = checkData.concat(arr)
                    }
                    this.checkData = checkData
                },


                batchChangeStatus: function (type) {
                    var checkData = this.checkData;
                    var data = {
                        adminNum:adminData.adminNum,
                        token:adminData.token
                    };
                    data.goodsId = checkData.join(",")
                    data.goodsStatus = type;
                    this.changeUrl(data)
                },
                changeStatus: function (id, type) {
                    var data = {
                        adminNum:adminData.adminNum,
                        token:adminData.token
                    };
                    data.goodsId = id
                    data.goodsStatus = type;
                    this.changeUrl(data)
                },

                changeUrl: function (data) {
                    var that = this;
                    axios({
                        method: "post",
                        url: "https://www.aftdc.com/aftdcacontrol/Goods/ban",
                        data: data,
                    }).then(function (res) {
                        if (res.data.res == 1) {
                            var listData = that.listData;
                            data.goodsId = String(data.goodsId)
                            if (data.goodsId.indexOf(",") >= 0) {
                                var idArray = data.goodsId.split(",");
                            } else {
                                var idArray = new Array;
                                idArray[1] = data.goodsId;
                            }
                            listData.forEach(function (list, index) {
                                var listId = list.goodsId
                                for (let x of idArray) {
                                    if (listId == x) {
                                        listData[index].goodsStatus = data.goodsStatus;
                                        break
                                    }
                                }
                            })
                            that.listData = listData;
                        }else if(res.data.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('adminData');
                            location.href="../Login/login.html";
                        }
                    })
                },
                shopJump:function (item) {
                    window.open('https://www.aftdc.com/pc/shop.html?shopId='+item.shopId)
                },
            }
        })
    }
}