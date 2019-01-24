window.onload = function(){
    var adminData = JSON.parse(localStorage.getItem('adminData'));
    if(!adminData){
        location.href="../Login/login.html";
    }else {
        var app = new Vue({
            el: "#app",
            data: {
                res: {},
            },
            created: function () {
                var that = this;
                var order = window.localStorage.getItem("order");
                if (Boolean(order)) {
                    order = JSON.parse(order);
                    var orderId = order.id;
                    var type = order.type;
                    if (type == 1) {
                        //订单列表查看详情
                        var url = "https://www.aftdc.com/aftdcAControl/orders/order_message"
                    } else if (type == 2) {
                        var url = "https://www.aftdc.com/aftdcAControl/orders/refund_message"
                    }

                    axios({
                        url: url,
                        method: "post",
                        data: {
                            orderId: orderId,
                            adminNum:adminData.adminNum,
                            token:adminData.token
                        }
                    }).then(function (res) {
                        if (res != -1 || res != 0) {
                            that.res = res.data;
                        }else if(res.data.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('adminData');
                            location.href="../Login/login.html";
                        }
                    })
                } else {
                    window.history.go(-1)
                }
            },
            methods: {
                numbs: function (numb1, numb2) {
                    var n = (parseInt(numb1 * 100) + parseInt(numb2 * 100)) / 100;
                    n = n.toFixed(2);
                    return n
                }
            }
        })
    }
}