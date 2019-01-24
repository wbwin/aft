window.onload = function(){
    var adminData = JSON.parse(localStorage.getItem('adminData'));
    if(!adminData){
        location.href="../Login/login.html";
    }else {
        var app = new Vue({
            el: "#app",
            data: {
                listData: [],
                shopName: "",//查询的店铺名字
                orderNo: "",//查询的订单号
                orderStatus: "-1",//查询的状态

                operate: {},//弹出操作退款的数据
                togle: 0,

                pageNumb: 0,//总页数
                pageCurent: 1,//当前页
                pageEach: 10,//每页分几条数据

            },
            created: function () {
                window.localStorage.removeItem("order");
                this.pageFn(1)
            },
            methods: {

                //分页请求 查询数据
                pageFn: function (pageCurent) {
                    var that = this;
                    var page = (pageCurent - 1) * that.pageEach;
                    that.pageCurent = pageCurent;
                    var orderStatus = this.orderStatus == -1 ? '' : this.orderStatus

                    axios({
                        method: "POST",
                        url: "https://www.aftdc.com/aftdcAControl/orders/refund_list",
                        data: {
                            page: page,
                            shopName: that.shopName,
                            orderNo: that.orderNo,
                            orderStatus: orderStatus,
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
                nameSearch: function (name) {
                    this.shopName = name;
                    this.pageFn(1);
                },

                numbs: function (numb1, numb2) {
                    var n = (parseInt(numb1 * 100) + parseInt(numb2 * 100)) / 100;
                    n = n.toFixed(2);
                    return n
                },
                see: function (orderId) {
                    var order = {id: orderId, type: 2}
                    window.localStorage.setItem("order", JSON.stringify(order));
                    window.location.href = "orderSee.html"
                },

                operateFn: function (index) {
                    var operate = this.listData[index];
                    operate.operateIndex = index;//存储index
                    this.operate = operate;
                    this.togle = 1;
                },
                //确认退款
                addWord: function () {
                    var operate = this.operate;
                    var orderId = operate.orderId;
                    var that = this;
                    axios({
                        method: "post",
                        url: "https://www.aftdc.com/aftdcAControl/orders/refund",
                        data: {
                            orderId: orderId,
                            adminNum:adminData.adminNum,
                            token:adminData.token
                        }
                    }).then(function (res) {
                        if (res.data.res == 1) {
                            var index = operate.operateIndex;
                            that.listData[index].orderStatus = -4;
                            alert("退款成功")
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