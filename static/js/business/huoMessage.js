window.onload = function() {
    var shopData = JSON.parse(localStorage.getItem('shopData'));
    if (!shopData) {
        location.href = "/business/Login/index.html";
    } else {
        var app = new Vue({
            el: '.dec',
            data: {},
            created: function () {

                var Cou = location.href

                newCou = Cou.split('?')[1].split("=")[1]

            },
            methods: {
                danhuyClick: function () {  // 点击 列表返回
                    history.back();  // 返回 上一页
                },
                annulNewCou: function () {
                    if (confirm('确定是否撤销该活动')) {
                        axios({
                            method: "post",
                            url: 'https://www.aftdc.com/Business/Activity/NewCou',
                            data: {
                                newCou: 0,
                                token:shopData.token,
                            },
                        }).then(function (res) {
                            if (res.data.res == 1) {
                                alert('操作成功')
                                window.parent.location.href = "https://aftdc.com/index.php/Business/ShopSa/index#/Huo/Dong";
                                top.location.reload();
                            }else if(res.data.res == -1){
                                alert(res.data.reason)
                                localStorage.removeItem('shopData');
                                location.href="/business/Login/index.html";
                            }
                        })

                    }
                }
            }
        })
    }
}