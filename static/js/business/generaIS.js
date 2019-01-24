window.onload = function () {
    var shopData = JSON.parse(localStorage.getItem('shopData'));
    if (!shopData) {
        location.href = "/business/Login/index.html";
    } else {


            var app = new Vue({
                el: "#dec",
                data: {
                    genera: ''
                },
                created: function () {
                    var that = this
                    axios({
                        method: "post",
                        url: "https://www.aftdc.com/Business/Activity/generaIS",
                        data: {
                            history: 0,
                            token: shopData.token
                        }
                    }).then(function (res) {
                        console.log(res);
                        if (res.data.res == 1) {
                            that.genera = res.data.data
                        } else if (res.data.res == -1) {
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href = "/business/Login/index.html";
                        }

                    })
                },
                methods:
                    {
                        danhuyClick: function () {// 点击 列表返回
                            history.back(); // 返回 上一页
                        }
                        ,
                        annulNewCou: function (event, groupId) {
                            if (confirm('确定是否撤销该活动')) {
                                axios({
                                    method: "post",
                                    url: 'https://www.aftdc.com/Business/Activity/generadel',
                                    data: {
                                        groupId: groupId,
                                        token: shopData.token
                                    },
                                }).then(function (res) {
                                    console.log(res);
                                    if (res.data.res == 1) {
                                        alert('操作成功')
                                        window.parent.location.href = "https://aftdc.com/index.php/Business/ShopSa/index#/Huo/Dong";
                                        top.location.reload();
                                    } else if (res.data.res == -1) {
                                        alert(res.data.reason)
                                        localStorage.removeItem('shopData');
                                        location.href = "/business/Login/index.html";
                                    }

                                })

                            }
                        }
                    }
            })
        }

}