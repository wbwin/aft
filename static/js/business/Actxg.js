window.onload = function () {
    var shopData = JSON.parse(localStorage.getItem('shopData'));
    if (!shopData) {
        location.href = "/business/Login/index.html";
    } else {
        var app = new Vue({
            el: '#eait',
            data: {
                dataz: '',
            },
            created: function () {
                var that = this
                var url = location.search;
                var id = url.substr(1);
                id = id.replace('id=', '');
                axios({
                    method: "post",
                    url: "https://www.aftdc.com/Business/Canteen/Actxg",
                    data: {
                        id: id,
                        token: shopData.token
                    }
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
                        alert('出错啦！');
                        return false;
                    }
                })
            },
            methods: {
                activeClick: function () {
                    var id = $('input[name="id"]').val();
                    var shopId = $('input[name="shopId"]').val();
                    var waiterName = $('input[name="waiterName"]').val(); //获取 姓名
                    var waiterNum = $('input[name="waiterNum"]').val(); // 获取 编号

                    if (!Boolean(waiterName)) { // 判断 姓名 是否为空
                        alert("请填写服务员名称", "err")
                        return false
                    }
                    var pattern = /^[\u4E00-\u9FA5]{2,20}$/;
                    if (!pattern.test(waiterName)) {
                        alert("格式错误", "err")
                        return false
                    }

                    if (!Boolean(waiterNum)) { // 判断 编号 是否为空
                        alert("请填写编号", "err")
                        return false
                    }
                    var pattern = /^[0-9]{1,20}$/;
                    if (!pattern.test(waiterNum)) {
                        alert("请输入正确的编号", "err")
                        return false
                    }
                    console.log(id);
                    console.log(shopId);
                    console.log(waiterName);
                    console.log(waiterNum);
                    axios({
                        method: "post",
                        url: 'https://www.aftdc.com/Business/Canteen/addWaiter', // 编辑 服务员的接口
                        data: {
                            id: id,
                            shopId: shopId,
                            waiterName: waiterName,
                            waiterNum: waiterNum,
                            token: shopData.token
                        },
                    }).then(function (res) {
                        console.log(res);

                        if (res.data.res == 1) {
                            alert('修改成功!!!')
                            location.href = "/business/Canteen/ActFuyuan.html";
                        }
                        else if (res.data.res == -1) {
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href = "/business/Login/index.html";
                        }

                        else if (res.data.res == 2) {
                            alert("服务员编号已存在!!!");
                            window.location.reload();
                        }
                        else if (res.data.res == 0) {
                            alert("信息未修改,无需保存");
                            window.location.reload();
                        }
                    })

                },
                ActFuyuanClick: function () {
                    history.back();
                }
            }
        })
    }
}