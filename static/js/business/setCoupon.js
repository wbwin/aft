window.onload = function() {
    var shopData = JSON.parse(localStorage.getItem('shopData'));
    if (!shopData) {
        location.href = "/business/Login/index.html";
    } else {
        var app = new Vue({
            el: '.dec',
            data: {
                jian: ''
            },
            created: function () {
                var that = this
                axios({
                    method: "post",
                    url: "https://www.aftdc.com/Business/Activity/HuoJian",
                    data: {
                        token:shopData.token,
                    }
                }).then(function (res) {
                    var require = res.data

                    if (require.res == 1) {
                        that.jian = require.data.shop.youhui
                        var full = that.jian.full
                        var min = that.jian.min
                    }else if(require.res == -1){
                        alert(res.data.reason)
                        localStorage.removeItem('shopData');
                        location.href="/business/Login/index.html";
                    }
                })
            },
            methods: {
                danhuyClick: function () { // 点击 列表返回
                    history.back(); // 返回 上一页

                },


                save: function () {

                },
                annulNewCou: function ($event, full, min) {
                    if (confirm('确定是否撤销该活动')) {
                        $.ajax({
                            method: 'post',
                            url: 'https://www.aftdc.com/Business/Activity/editMj',
                            data: {},
                            success: function (res) {
                                if (res == 1) {
                                    alert('操作成功')
                                    location.href = '/index.php/Business/Activity/HuoDong'
                                }
                            }
                        })
                    }
                },

            }
        })
    }
}