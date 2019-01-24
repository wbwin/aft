window.onload = function(){
    var adminData = JSON.parse(localStorage.getItem('adminData'));
    if(!adminData){
        location.href="../Login/login.html";
    }else {
        var app = new Vue({
            el: "#app",
            data: {
                res: {},
                shopId: '',
                notTxt: '',
            },
            created: function () {
                var that = this;
                var shopId = window.localStorage.getItem("shopId");
                if (shopId) {
                    that.shopId = shopId;
                    axios({
                        method: "post",
                        url: "https://www.aftdc.com/aftdcAControl/Shops/seeShop",
                        data: {
                            shopId: shopId,
                            adminNum:adminData.adminNum,
                            token:adminData.token
                        }
                    }).then(function (res) {
                        if (res.data.res == 1) {
                            that.res = res.data.data;
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
                addShopMoney: function () {
                    var that = this;
                    var data = this.res
                    axios({
                        method: "post",
                        url: "https://www.aftdc.com/aftdcAControl/Shops/setShopMoney",
                        data: {
                            shopId: data.shopId,
                            money: data.applyMoney,
                            adminNum:adminData.adminNum,
                            token:adminData.token
                        }
                    }).then(function (res) {
                        if (res.data.res == 1) {
                            alert("已确认")
                            window.history.go(-1);
                        } else if(res.data.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('adminData');
                            location.href="../Login/login.html";
                        }else {
                            alert("设置失败")
                        }
                    })
                },
                //审核不通过
                notShop: function () {
                    var that = this;
                    if (confirm("确认审核不通过？")) {
                        var phone = that.res.phone;
                        axios({
                            method: "post",
                            url: "https://www.aftdc.com/aftdcAControl/Shops/shopNo",
                            data: {
                                shopId: that.shopId,
                                reason: notTxt,
                                mobile: phone,
                                adminNum:adminData.adminNum,
                                token:adminData.token
                            }
                        }).then(function (res) {
                            if (res.data.res == 1) {
                                alert("已确认")
                                window.history.go(-1);
                            }else if(res.data.res == -1){
                                alert(res.data.reason)
                                localStorage.removeItem('adminData');
                                location.href="../Login/login.html";
                            } else {
                                alert("设置失败")
                            }
                        })
                    }
                },
            }
        })
    }
}