window.onload = function () {
    var shopData = JSON.parse(localStorage.getItem('shopData'));
    if (!shopData) {
        location.href = "/business/Login/index.html";
    } else {

                    var app = new Vue({
                        el: '.dec',
                        data: {
                            dataz: '',
                        },
                        created: function () {
                            var that = this;
                            var url = location.search;
                            var id = url.substr(1);
                            id = id.replace('id=', '')
                            axios({
                                method: "post",
                                url: 'https://www.aftdc.com/Business/Finance/Caition',
                                data: {
                                    id: id,
                                    token: shopData.token
                                },
                            }).then(function (res) {
                                console.log(res);
                                if (res.data.res == 1) {
                                    that.dataz = res.data.data
                                }
                                else if (res.data.res == -1) {
                                    alert(res.data.reason)
                                    localStorage.removeItem('shopData');
                                    location.href = "/business/Login/index.html";
                                }

                            })
                        },
                        methods: {
                            jin: function () {
                                $(".lvsekuang").show();
                            },
                            chu: function () {
                                $(".lvsekuang").hide();
                            },
                        }
                    })
                }

}