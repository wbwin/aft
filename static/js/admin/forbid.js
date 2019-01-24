window.onload = function(){
    var adminData = JSON.parse(localStorage.getItem('adminData'));
    if(!adminData){
        location.href="../Login/login.html";
    }else {
        var app = new Vue({
            el: "#app",
            data: {
                goods: false,
            },
            beforeCreate: function () {
                var that = this
                var goodsId = window.localStorage.getItem("goodsId");
                if (Boolean(goodsId)) {
                    axios({
                        method: "post",
                        url: "https://www.aftdc.com/aftdcAControl/Statistics/goods_message",
                        data: {
                            goodsId: goodsId,
                            adminNum:adminData.adminNum,
                            token:adminData.token
                        }
                    }).then(function (res) {
                        var require = res.data
                        if (require.res == 1) {
                            that.goods = require
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
                //禁售
                changeStatus: function (id, status) {
                    var that = this;
                    axios({
                        method: "post",
                        url: "https://www.aftdc.com/aftdcAControl/Statistics/goods_state",
                        data: {
                            goodsId: id,
                            goodsStatus: status,
                            adminNum:adminData.adminNum,
                            token:adminData.token
                        }
                    }).then(function (res) {
                        if (res.data.res == 1) {
                            that.goods.goodsStatus = status
                        }
                    })
                }
            }
        })
    }
}