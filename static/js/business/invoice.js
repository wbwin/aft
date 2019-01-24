window.onload = function() {
    var shopData = JSON.parse(localStorage.getItem('shopData'));
    if (!shopData) {
        location.href = "/business/Login/index.html";
    } else {
        var app = new Vue({
            el: '#preOrder',
            data: {
                city: '',
                citys: [
                    {
                        id: 1,
                        label: '普通发票'
                    },
                    {
                        id: 2,
                        label: '增值税专用发票'
                    },
                    {
                        id: 3,
                        label: '不开具发票'
                    }
                ],
            },
            created: function () {
                var that = this;
                axios({
                    url: 'https://www.aftdc.com/business/Certification/complete_data',
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

                    that.city = res.data.paper;
                })
            },
            methods: {
                step: function () { //  【上一步】
                    location.href = './thedata.html';
                },
                showBranches: function (e) {
                    this.city = e;
                },
                next: function () { //  【保存订单并下一步】
                    var that = this;
                    var paper = that.city;
                    var start_time = Date.parse(new Date());
                    axios({
                        url: 'https://www.aftdc.com/business/Certification/prove_invoice',
                        method: 'post',
                        data: {
                            paper: paper,
                            start_time: start_time,
                            token:shopData.token,
                        }
                    }).then(function (res) {

                        if (res.data.res == 1) {
                            location.href = './payment.html';
                        }else if(res.data.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href="/business/Login/index.html";
                        } else {
                            alert(res.data.info)
                        }
                    })
                },
            },
        })
    }
}