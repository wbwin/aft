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
                orderNo: "",
                orderStatus: "-9999",

                pageNumb: 0,//总页数
                pageCurent: 1,//当前页
                pageEach: 10,//每页分几条数据

            },
            created: function () {
                window.localStorage.removeItem("order");
                this.pageFn(1);

            },
            methods: {
                //分页请求 查询数据
                pageFn: function (pageCurent) {
                    var that = this;
                    var page = (pageCurent - 1) * that.pageEach;
                    that.pageCurent = pageCurent;
                    var orderStatus = that.orderStatus
                    if (orderStatus == -9999) {
                        orderStatus = ""
                    }
                    axios({
                        method: "POST",
                        url: "https://www.aftdc.com/aftdcAControl/orders/order_list",
                        data: {
                            shopName: that.shopName,
                            orderNo: that.orderNo,
                            orderStatus: orderStatus,
                            page: page,
                            adminNum:adminData.adminNum,
                            token:adminData.token
                        },
                    }).then(function (res) {

                        var require = res.data;
                        if (require.res == 1) {
                            that.listData = require.data;
                            that.pageNumb =  Math.ceil(require.pageCount / require.pageEach)
                            that.pageEach = require.pageEach
                        } else if(res.data.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('adminData');
                            location.href="../Login/login.html";
                        }else {
                            that.listData = [];
                            that.pageNumb =  Math.ceil(require.pageCount / require.pageEach)
                            that.pageEach = require.pageEach
                        }
                    })
                },

                numbs: function (numb1, numb2) {
                    var n = (parseInt(numb1 * 100) + parseInt(numb2 * 100)) / 100;
                    n = n.toFixed(2);
                    return n
                },

                see: function (orderId) {
                    var order = {id: orderId, type: 1}
                    window.localStorage.setItem("order", JSON.stringify(order));
                    window.location.href = "orderSee.html"
                },
                nameSearch: function (name) {
                    this.shopName = name;
                    this.pageFn(1);
                },

            }
        })
    }
}