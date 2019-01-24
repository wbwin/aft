window.onload = function() {
    var shopData = JSON.parse(localStorage.getItem('shopData'));
    if (!shopData) {
        location.href = "/business/Login/index.html";
    } else {
        var app = new Vue({
            el: '.Huod',
            data: {
                group: '',
                shopName: ''
            },
            created: function (res) {
                var that = this
                axios({
                    method: "post",
                    url: "https://www.aftdc.com/Business/Activity/Huogroup",
                    data: {
                        token:shopData.token,
                    }
                }).then(function (res) {
                    var require = res.data
                    if (require.res == 1) {
                        that.group = require.data.gro
                        that.shopName = require.data.shop.shopName

                    }else if(require.res == -1){
                        alert(res.data.reason)
                        localStorage.removeItem('shopData');
                        location.href="/business/Login/index.html";
                    }
                })
            },

            methods: {
                parentIframeClick: function () {
                    layer.open({
                        type: 2,
                        title: '添加团购活动',
                        maxmin: true,
                        shadeClose: false,
                        //      area : ['830px' , '620px'],
                        area: ['730px', '620px'],
                        // shade: [1, '#06c1ae'], // 透明度  颜色
                        content: 'Tuansz.html'
                    });
                },
                delTuanClick: function ($event, groupId) {
                    var that = this
                    axios({
                        method: "post",
                        url: "https://www.aftdc.com/Business/Activity/delTuan",
                        data: {
                            groupId: groupId,
                            token:shopData.token,
                        }
                    }).then(function (res) {
                        if(res.data.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href="/business/Login/index.html";
                        }
                        alert("撤销成功")
                        location.reload();
                    })
                }
            }
        })
    }
}