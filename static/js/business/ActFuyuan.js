window.onload = function () {
    var shopData = JSON.parse(localStorage.getItem('shopData'));
    if (!shopData) {
        location.href = "/business/Login/index.html";
    } else {
        var app = new Vue({
            el: '#desk',
            data: {
                fuyuan: '',
                shopId: '',
            },
            created: function () {
                console.log(shopData);
                var that = this
                axios({
                    method: "post",
                    url: "https://www.aftdc.com/Business/Canteen/ActFuyuan",
                    data: {token: shopData.token}
                }).then(function (res) {
                    console.log(res);
                    if (res.data.res == 1) {
                        that.fuyuan = res.data.data
                    } else if (res.data.res == -1) {
                        alert(res.data.reason)
                        localStorage.removeItem('shopData');
                        location.href = "/business/Login/index.html";
                    }
                })
            },

            methods: {
                daterClick: function (item) {
                    var id = item.id;

                    var shopId = $('input[name="shopId"]').val();
                    //        console.log(id);
                    //        console.log(shopId);
                    axios({
                        method: "post",
                        url: 'https://www.aftdc.com/Business/Canteen/delWaiter', // 删除 服务员
                        data: {
                            id: id,
                            shopId: shopId,
                            token: shopData.token
                        },
                    }).then(function (res) {
                        console.log(res);
                        if (res.data.res == 1) {
                            alert("删除成功!");
                            window.location.reload()
                        }
                        else if (res.data.res == -1) {
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href = "/business/Login/index.html";
                        }

                        else {
                            alert("删除失败!");
                            return false
                        }

                    })

                },
                ActxgClick: function (item) {
                    var id = item.id;
                    location.href = '/business/Canteen/Actxg.html?id=' + id;
                },
                ActAddFuyuanClick: function () {
                    location.href = '/business/Canteen/ActAddFuyuan.html';
                },
            }
        })
    }
}