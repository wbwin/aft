window.onload = function() {
    var shopData = JSON.parse(localStorage.getItem('shopData'));
    if (!shopData) {
        location.href = "/business/Login/index.html";
    } else {
        var app = new Vue({
            el: '.dec',
            data: {
                Coupon: ''
            },
            created: function () {
                var that = this
                axios({
                    method: "post",
                    url: "https://www.aftdc.com/Business/Activity/seeCoupon",
                    data: {
                        history: 0,
                        token:shopData.token,

                    }
                }).then(function (res) {
                    if(res.data.res == -1){
                        alert(res.data.reason)
                        localStorage.removeItem('shopData');
                        location.href="/business/Login/index.html";
                    }

                    var require = res.data
                    if (require.res == 1) {
                        that.Coupon = require.data

                    }
                })
            },
            methods: {
                danhuyClick: function () { // 点击 列表返回
                    history.back(); // 返回 上一页

                },
                annulNewCou: function ($event, couponId) {
                    if (confirm('确定是否撤销该活动')) {
                        axios({
                            method: "post",
                            url: 'https://www.aftdc.com/Business/Activity/del',
                            data: {
                                couponId: couponId,
                                token:shopData.token,
                            },
                        }).then(function (res) {
                            if(res.data.res == -1){
                                alert(res.data.reason)
                                localStorage.removeItem('shopData');
                                location.href="/business/Login/index.html";
                            }

                            if (res.data.res == 1) {
                                alert('操作成功')
                                window.parent.location.href = "https://aftdc.com/index.php/Business/ShopSa/index#/Huo/Dong";
                                top.location.reload();
                            }

                        })
                    }
                },
                save: function () {
                    var full = $('input[name=full]').val()
                    var minus = $('input[name=minus]').val()
                    axios({
                        method: "post",
                        url: 'https://www.aftdc.com/Business/Activity/editMj',
                        data: {
                            full: full,
                            minus: minus,
                            token:shopData.token,
                        },
                    }).then(function (res) {
                        if(res.data.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href="/business/Login/index.html";
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