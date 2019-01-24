window.onload = function () {
    var shopData = JSON.parse(localStorage.getItem('shopData'));
    if (!shopData) {
        location.href = "/business/Login/index.html";
    } else {
        var app = new Vue({
            el: '#Huod',
            data: {

                dataz: {},

            },
            created: function () {
                var that = this;
                var url = location.search;
                var id = url.substr(1);
                id = id.replace('id=', '');

                axios({
                    method: "post",
                    url: 'https://www.aftdc.com/business/Membership/level_list',
                    data: {
                        token: shopData.token,
                    },
                }).then(function (res) {

                    if (res.data.res == 1) {
                        that.dataz = res.data.data[id];
                    } else if (res.data.res == -1) {
                        alert(res.data.reason)
                        localStorage.removeItem('shopData');
                        location.href = "/business/Login/index.html";
                    }else {
                        alert('出错了')
                    }
                })
            },
            methods: {
                BcunClick: function () {
                    var name = $('input[name=name]').val();
                    var zk = $('input[name=zk]').val();
                    var money = $('input[name=money]').val();
                    var id = $('input[name=id]').val();
                    if (!name || !zk || !money) {
                        alert('请填写完整')
                        return false
                    }
                    if (zk < 5 || zk > 10) {
                        alert('折扣范围为5~10折')
                        return false
                    }


                    axios({
                        method: "post",
                        url: 'https://www.aftdc.com/business/Membership/update_level',
                        data: {
                            id: id,
                            name: name,
                            zk: zk,
                            money: money,
                            token: shopData.token,
                        },
                    }).then(function (res) {

                        if(res.data.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href="/business/Login/index.html";
                        }

                       else if (res.data.res == -5) {
                            alert("没有数据！")
                            return false
                        }

                      else  if (res.data.res == -2) {
                            alert('数据不完整！')
                            return false
                        }

                       else if (res.data.res == -3) {
                            alert('数据未改变！')
                            return false
                        }
                      else  if (res.data.res == -4) {
                            alert('有非法字段！')
                            return false
                        }

                      else  if (res.data.res == 1) {
                            alert('更新成功！')
                            history.back();
                        } else {
                            alert('更新失败！')
                            return false
                        }

                    })

                }
            }
        })
    }
}