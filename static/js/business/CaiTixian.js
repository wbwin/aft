window.onload = function () {
    var shopData = JSON.parse(localStorage.getItem('shopData'));
    if (!shopData) {
        location.href = "/business/Login/index.html";
    } else {

                    var app = new Vue({
                        el: '.dec',
                        data: {
                            dataz: {},
                        },
                        created: function () {
                            var that = this;
                            axios({
                                method: "post",
                                url: 'https://www.aftdc.com/Business/Finance/CaiTixian',
                                data: {token: shopData.token},
                            }).then(function (res) {
                                console.log(res);
                                if (res.data.res == 1) {
                                    that.dataz = res.data.data;
                                } else if (res.data.res == -1) {
                                    alert(res.data.reason)
                                    localStorage.removeItem('shopData');
                                    location.href = "/business/Login/index.html";
                                }

                                else {
                                    alert('出错啦！')
                                }
                            })
                        },
                        methods: {
                            TIxianClick: function () {
                                var money = $('input[name=money]').val();
                                var userId = $('input[name=id]').val();
                                var parterrn = /^[^.].*/; //
                                if (money < 10) {
                                    alert('最少提现10元')
                                    return false;
                                }
                                if (!parterrn.test(money)) {
                                    alert('禁止不科学操作')
                                    return false;
                                }
                                if (!money) {
                                    alert('请填写完整！')
                                    return false;
                                }
                                if (!/^[0-9]*$/.test(money)) {
                                    alert('请输入正确的金额')
                                    return false;
                                }
                                axios({
                                    method: "post",
                                    url: 'https://www.aftdc.com/Business/Finance/Txiancl',
                                    data: {
                                        money: money,
                                        userId: userId,
                                        token: shopData.token
                                    },
                                }).then(function (res) {
                                    console.log(res)
                                    // return false;
                                    if (res.data.res == 1) {
                                        alert('提现申请成功，1-3个工作日内到账！');
                                        location.reload()
                                    } else if (res.data.res == -1) {
                                        alert(res.data.reason)
                                        localStorage.removeItem('shopData');
                                        location.href = "/business/Login/index.html";
                                    }

                                    else {
                                        alert('超过可提现金额！');
                                        return false;
                                    }
                                })

                            }
                        }
                    })
                }

}