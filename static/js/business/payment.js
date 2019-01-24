window.onload = function() {
    var shopData = JSON.parse(localStorage.getItem('shopData'));
    if (!shopData) {
        location.href = "/business/Login/index.html";
    } else {
        var app = new Vue({
            el: '.preOrder',
            data: {
                code: '',//支付码
                i: 0,//超过20次退出页面
            },
            created: function () {
                var that = this;
                axios({
                    url: 'https://www.aftdc.com/business/Certification/give_page',
                    method: 'post',
                    data: {
                        token:shopData.token,
                    },
                }).then(function (res) {
                    if(res.data.res == -1){
                        alert(res.data.reason)
                        localStorage.removeItem('shopData');
                        location.href="/business/Login/index.html";
                    }
                    that.code = res.data.wxcode;
                    that.cece();//轮询1
                })
            },
            methods: {
                step: function () { //  【上一步】
                    location.href = './invoice.html';
                },
                poll: function () {
                    var that = this;
                    var i = that.i;
                    that.i++
                    if (i > 10) {
                        location.href = './authen.html';
                    }
                    axios({
                        url: 'https://www.aftdc.com/business/Certification/query_payment',
                        method: 'post',
                        data: {
                            token:shopData.token,
                        },
                    }).then(function (res) {
                        var all = res.data;
                        if(all.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href="/business/Login/index.html";
                        }

                        if (all.res == 1) {
                            alert(all.info)
                            location.href = './authen.html';
                        }
                    })
                },
                cece: function (e) {
                    var that = this;
                    setInterval(function () {
                        that.poll();
                    }, 3000)
                },
            }
        })
    }
}