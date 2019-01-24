window.onload = function () {
    var shopData = JSON.parse(localStorage.getItem('shopData'));
    if (!shopData) {
        location.href = "/business/Login/index.html";
    } else {

                    var app = new Vue({
                        el: "#Sondere",
                        data: {
                            count: 0,
                            recommand: '',
                            distribution: false,//是否开启分销
                            recommand_A: '',
                            recommand_B: ''
                        },
                        created: function () {
                            var that = this
                            axios({
                                method: "post",
                                url: "https://www.aftdc.com/Business/Activity/distribuTion",
                                data: {token: shopData.token}
                            }).then(function (res) {
                                console.log(res);
                                var require = res.data
                                var fenxiao = $("#fenxiao")
                                if (require.res == 1) {
                                    that.recommand_A = require.data.recommand_A
                                    that.recommand_B = require.data.recommand_B
                                    if (that.recommand_A == 0 || that.recommand_A == 0 && that.recommand_B == 0) {
                                        that.distribution = false
                                        fenxiao.text('开启分销')
                                    }

                                    else if (res.data.res == -1) {
                                        alert(res.data.reason)
                                        localStorage.removeItem('shopData');
                                        location.href = "/business/Login/index.html";
                                    }

                                    else {
                                        that.distribution = true
                                        fenxiao.text('关闭分销')
                                    }
                                }
                            })
                        },
                        methods: {
                            fenxiaoClick: function () {
                                var fenxiao = $("#fenxiao")
                                // var on = document.createTextNode("分销")
                                if (this.distribution == true) {
                                    fenxiao.text('开启分销')
                                } else {
                                    fenxiao.text('关闭分销')
                                }
                                this.distribution = !this.distribution
                            },
                            SubmitClick: function () {
                                if ($("#recommand_A").val()) {
                                    var reg = /^[0-9\.]+$/;
                                    if (!reg.test($("#recommand_A").val())) {
                                        alert("请输入数字");
                                        return false;
                                    }
                                }
                                if ($("#recommand_B").val()) {
                                    var reg = /^[0-9\.]+$/;
                                    if (!reg.test($("#recommand_B").val())) {
                                        alert("请输入数字");
                                        return false;
                                    }
                                }
                                var recommand_A = $("input[name=recommand_A]").val() * 100
                                var recommand_B = $("input[name=recommand_B]").val() * 100
                                if (recommand_A < recommand_B) {
                                    alert("推客B的百分比不能高于推客A的百分比")
                                    return false;
                                }
                                if (this.distribution == false) {
                                    recommand_A = 0
                                    recommand_A = 0
                                }
                                axios({
                                    method: "post",
                                    url: "https://www.aftdc.com/Business/Activity/distribuTionEdit",
                                    data: {
                                        recommand_A: recommand_A,
                                        recommand_B: recommand_B,
                                        token: shopData.token
                                    }
                                }).then(function (res) {
                                    console.log("res");
                                    console.log(res);
                                    var require = res.data
                                    if (require.res == 1) {
                                        alert("保存成功")
                                        // window.parent.location.href="/index.php/Business/ShopSa/index#/Huo/Dong";
                                        top.location.reload();

                                    }

                                    else if (res.data.res == -1) {
                                        alert(res.data.reason)
                                        localStorage.removeItem('shopData');
                                        location.href = "/business/Login/index.html";
                                    }

                                })
                            }

                        }
                    })
                }

}