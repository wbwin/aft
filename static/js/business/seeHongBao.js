window.onload = function () {
    var shopData = JSON.parse(localStorage.getItem('shopData'));
    if (!shopData) {
        location.href = "/business/Login/index.html";
    } else {
        var app = new Vue({
            el: '.dec',
            data: {
                HongBao: ''
            },
            created: function () {
                var that = this
                axios({
                    method: "post",
                    url: "https://www.aftdc.com/Business/Activity/HongBaoEdit",
                    data: {
                        history: 0,
                        token: shopData.token,
                    }
                }).then(function (res) {
                    if (res.data.res == -1) {
                        alert(res.data.reason)
                        localStorage.removeItem('shopData');
                        location.href = "/business/Login/index.html";

                    }

                    var require = res.data
                    if (require.res == 1) {
                        that.HongBao = require.data
                        // window.parent.location.href = "/Business/ShopSa/index#/Huo/Dong";
                        // top.location.reload();
                    }
                })
            },
            methods: {
                danhuyClick: function () { // 点击 列表返回
                    history.back(); // 返回 上一页

                },
                delClick: function (msg) {
                    var id = msg.id;
                    if (confirm('确定是否撤销该活动')) {
                        axios({
                            method: "post",
                            url: 'https://www.aftdc.com/Business/Activity/delHongBao',
                            data: {
                                id: id,
                                token: shopData.token,
                            },
                        }).then(function (res) {
                            if (res.data.res == -1) {
                                alert(res.data.reason)
                                localStorage.removeItem('shopData');
                                location.href = "/business/Login/index.html";
                            }

                            if (res.data.res == 1) {
                                alert('操作成功')
                                location.reload();
                            }

                        })
                    }
                },
                updateClick:function (msg) {
                    var id = msg.id;
                    location.href = '/business/Activity/HongBao.html?id='+id; //红包大派送
                },
                // annulNewCou: function ($event, couponId) {
                //     if (confirm('确定是否撤销该活动')) {
                //         axios({
                //             method: "post",
                //             url: 'https://www.aftdc.com/Business/Activity/delHongBao',
                //             data: {
                //                 couponId: couponId,
                //                 token: shopData.token,
                //             },
                //         }).then(function (res) {
                //             if (res.data.res == -1) {
                //                 alert(res.data.reason)
                //                 localStorage.removeItem('shopData');
                //                 location.href = "/business/Login/index.html";
                //             }
                //
                //             if (res.data.res == 1) {
                //                 alert('操作成功')
                //             }
                //
                //         })
                //     }
                // },
                save: function () {
                    var full = $('input[name=full]').val()
                    var minus = $('input[name=minus]').val()
                    axios({
                        method: "post",
                        url: 'https://www.aftdc.com/Business/Activity/editMj',
                        data: {
                            full: full,
                            minus: minus,
                            token: shopData.token,
                        },
                    }).then(function (res) {
                        if (res.data.res == -1) {
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href = "/business/Login/index.html";
                        }
                        if (res == 1) {
                            alert('保存成功')
                            location.href = '/index.php/Business/Activity/HuoDong'
                        }
                    })

                }

            }
        })
    }
}