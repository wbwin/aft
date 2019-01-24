window.onload = function(){
    var adminData = JSON.parse(localStorage.getItem('adminData'));
    if(!adminData){
        location.href="../Login/login.html";
    }else {
        var app = new Vue({
            el: "#app",
            data: {
                listData: [],

                orderNo: "",//查询编号
                isFinish: -1,//查询状态

                togle: 0,
                countData: {},

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
                    var isFinish = this.isFinish == -1 ? '' : this.isFinish
                    axios({
                        method: "POST",
                        url: "https://www.aftdc.com/aftdcAControl/orders/denominate_list",
                        data: {
                            page: page,
                            orderNo: that.orderNo,
                            orderStatus: isFinish,
                            adminNum:adminData.adminNum,
                            token:adminData.token
                        },
                    }).then(function (res) {

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
                        }
                    })
                },
                //相乘的计算
                rideFn: function (numb1, numb2) {
                    var n = (numb1 * numb2).toFixed(2);
                    return n
                },

                countFn: function (index) {
                    var countData = this.listData[index];
                    countData.countIndex = index;
                    this.countData = countData;
                    this.togle = 1;
                },

                addWord: function () {
                    var that = this;
                    var orderId = this.countData.orderId
                    axios({
                        url: "https://www.aftdc.com/aftdcAControl/orders/denominate",
                        method: "post",
                        data: {
                            orderId: orderId,
                            adminNum:adminData.adminNum,
                            token:adminData.token
                        }
                    }).then(function (res) {
                        if (res.data.res == 1) {
                            var index = that.countData.countIndex;
                            that.listData[index].orderStatus = 4;
                            alert("结算成功")
                        }else if(res.data.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('adminData');
                            location.href="../Login/login.html";
                        }
                        that.togle = 0;
                    })
                },
            }
        })
    }
}