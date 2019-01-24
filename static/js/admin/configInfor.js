window.onload = function () {
    var adminData = JSON.parse(localStorage.getItem('adminData'));
    if (!adminData) {
        location.href = "../Login/login.html";
    } else {
        var app = new Vue({
            el: "#app",
            data: {
                navs: 0,
                configData: [],
                resetData: []
            },
            created: function () {
                var that = this;
                axios({
                    method: "post",
                    url: "https://www.aftdc.com/aftdcAControl/Config/toMallConfig",
                    data: {
                        adminNum: adminData.adminNum,
                        token: adminData.token
                    },
                }).then(function (res) {
                    var require = res.data;
                    if (require.res == 1) {
                        var data = require.data;
                        var configData = new Array();
                        configData[0] = new Array();
                        configData[1] = new Array()
                        for (var item of data[0]) {
                            if (item.fieldName == '热搜索词') {
                                configData[0].push(item);
                                break
                            }
                        }
                        for (var item of data[3]) {
                            if (item.fieldName == '最少提现金额' || item.fieldName == '积分与金钱兑换比例') {
                                configData[1].push(item);
                            }
                        }
                        that.configData = configData
                        that.resetData = configData;
                    } else if (res.data.res == -1) {
                        alert(res.data.reason)
                        localStorage.removeItem('adminData');
                        location.href = "../Login/login.html";
                    }
                })
            },
            methods: {
                save: function () {
                    // var navs=this.navs;
                    var configData = this.configData;
                    console.log(this.configData)
                    var data = {
                        adminNum: adminData.adminNum,
                        token: adminData.token
                    };
                    /*
                      需要把所有字段都提交上去、
                      提交名字为对象的fieldCode，值为对象的fieldValue
                    */
                    configData.forEach(function (item) {
                        item.forEach(function (x) {
                            data[x.fieldCode] = x.fieldValue
                        })
                    })

                    axios({
                        method: "post",
                        url: "https://www.aftdc.com/aftdcAControl/Config/saveMallConfig",
                        data: data
                    }).then(function (res) {
                        if (res.data.res == 1) {
                            alert("设置成功")
                        } else if (res.data.res == -1) {
                            alert(res.data.reason)
                            localStorage.removeItem('adminData');
                            location.href = "../Login/login.html";
                        } else {
                            alert("设置失败")
                        }
                    })
                },

            }
        })
    }
}