window.onload = function(){
    var adminData = JSON.parse(localStorage.getItem('adminData'));
    if(!adminData){
        location.href="../Login/login.html";
    }else {
        var app = new Vue({
            el: "#app",
            data: {
                shopInfo: {},
            },
            created: function () {
                var that = this;
                var shopId = window.localStorage.getItem("shopId");
                if (Boolean(shopId)) {
                    axios({
                        method: "post",
                        url: "https://www.aftdc.com/aftdcAControl/Shops/getShopDetails",
                        data: {
                            shopId: shopId,
                            adminNum:adminData.adminNum,
                            token:adminData.token
                        }
                    }).then(function (res) {
                        if (res.data.res == 1) {
                            that.shopInfo = res.data.data;
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
            methods: {}
        })
    }
}