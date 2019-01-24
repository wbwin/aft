window.onload = function() {
    var shopData = JSON.parse(localStorage.getItem('shopData'));
    if (!shopData) {
        location.href = "/business/Login/index.html";
    } else {
        var app = new Vue({
            el: '#Huod',
            data: {},
            methods: {
                BcunClick: function () {
                    var name = $('input[name=name]').val();
                    var zk = $('input[name=zk]').val();
                    var money = $('input[name=money]').val();
                    if (!name || !zk || !money) {
                        alert('请填写完整')
                        return false
                    }

                    axios({
                        methods: "post",
                        url: '/index.php/Business/Setshop/setVips',
                        data: {
                            name: name,
                            zk: zk,
                            money: money,
                            token:shopData.token,
                        },
                    }).then(function (res) {
                        if(res.data.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href="/business/Login/index.html";
                        }
                      else  if (res.data.res == -5) {
                            alert('添加失败,折扣不能大于10！')
                            return false
                        }

                       else if (res.data.res == -2) {
                            alert('添加失败,折扣不能小于5！')
                            return false
                        }

                      else  if (res.data.res == 1) {
                            alert('添加成功！')
                            window.location.reload()
                        } else {
                            alert('添加失败！')
                            return false
                        }

                    })

                },
            }
        })
    }
}