window.onload = function () {
    var shopData = JSON.parse(localStorage.getItem('shopData'));
    if (!shopData) {
        location.href = "/business/Login/index.html";
    } else {


            var app = new Vue({
                el: '.dec',
                data: {
                    dataz: {},
                    datazs: {},
                    datazu: {},
                },
                created: function () {
                    var that = this;
                    axios({
                        method: "post",
                        url: 'https://www.aftdc.com/Business/Finance/CaiConter',
                        data: {token: shopData.token},
                    }).then(function (res) {
                        console.log(res);
                        if (res.data.res == 1) {
                            that.dataz = res.data.data;
                            that.datazs = res.data.data.loimg;
                            that.datazu = res.data.data.users;
                        }else if(res.data.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href="/business/Login/index.html";
                        }

                        else {
                            alert('出错啦！')
                            return false;
                        }
                    })
                },
                methods: {
                    dweoihClick: function () {
                        $(".YinCanKu").show();
                    },
                    tixianClick: function () {
                        location.href = "/business/Finance/CaiTixian.html";
                    },
                    fwewehoiClick: function () {
                        window.parent.location.href = " https://www.aftdc.com/business/Index/index.html#/Cai/Yue";
                        top.location.reload();
                        // location.href = "/business/Finance/CaiYue.html";
                    },
                    CaiDuizhangClick: function () {
                        window.parent.location.href = " https://www.aftdc.com/business/Index/index.html#/Cai/Duizhang";
                        top.location.reload();
                        // location.href = "/business/Finance/CaiDuizhang.html";
                    },
                    CaiMingxiClick: function (item) {
                        var dataId = item.dataId;
                        location.href = "/business/Finance/CaiMingxi.html?id=" + dataId;
                    },
                    CaiMingxClick: function (item) {
                        var dataId = item.dataId;
                        location.href = "/business/Finance/CaiMingxi.html?id=" + dataId;
                    },
                    CaiYueClick: function () {
                        window.parent.location.href = " https://www.aftdc.com/business/Index/index.html#/Cai/Yue";
                        top.location.reload();
                        // location.href = "/business/Finance/CaiYue.html";
                    },
                    vcvekongClick: function () {
                        window.parent.location.href = " https://www.aftdc.com/business/Index/index.html#/Cai/Yue";
                        top.location.reload();
                        // location.href = "/business/Finance/CaiYue.html";
                    },
                    allTouSuoYouClick: function () {
                        history.back();
                    }

                }
            })
        }

}