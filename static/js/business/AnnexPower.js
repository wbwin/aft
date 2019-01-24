window.onload = function () {
    var shopData = JSON.parse(localStorage.getItem('shopData'));
    if (!shopData) {
        location.href = "/business/Login/index.html";
    } else {

            var app = new Vue({
                el: "#AnnexPower",
                data: {
                    branchId: '', //分店id

                    author_list_all: [{children: ''}], //权限表里面的所有权限
                },
                created: function () {
                    var branchId = $("input[name='branchId']").val();
                    this.branchId = branchId;
                    var that = this
                    axios({
                        methods: "post",
                        url: '/index.php/Business/Index/author',
                        data: {
                            shopId: branchId,
                            token: shopData.token
                        },
                    }).then(function (res) {
                        // res.author_list,该分店商家用户拥有的权限列表，false代表拥有全部权限
                        console.log(res)
                        that.author_list_all = res.author_list_all

                        if (res.data.res == -1) {
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href = "/business/Login/index.html";
                        }

                    })

                },
                methods: {
                    parentChange: function (index) {
                        var all = this.author_list_all;
                        var child = all[index].children;
                        var parHave = !all[index].have;
                        all[index].have = parHave
                        if (Boolean(child)) {
                            var len = child.length;
                            for (let i = 0; i < len; i++) {
                                child[i].have = parHave
                            }
                            all[index].children = child;
                        }

                        this.author_list_all = all
                    },
                    childChange: function (index, xdex) {
                        var all = this.author_list_all

                        all[index].children[xdex].have = !all[index].children[xdex].have;
                        var child = all[index].children
                        var len = child.length;
                        var ch = true
                        for (let i = 0; i < len; i++) {
                            if (!child[i].have) {
                                ch = false;
                                break
                            }
                        }
                        all[index].have = ch
                        this.author_list_all = all;
                    },
                    sureBut: function () {
                        var all = this.author_list_all;
                        var array = [];
                        var lenAll = all.length;
                        for (let i = 0; i < lenAll; i++) {
                            var ph = all[i].have
                            if (ph) {
                                array.push(all[i].id)
                            }
                            var child = all[i].children;
                            if (Boolean(child)) {
                                var lenChi = child.length;
                                for (let j = 0; j < lenChi; j++) {
                                    var ch = child[j].have;
                                    if (ch) {
                                        array.push(child[j].id)
                                    }
                                }
                            }


                        }
                        ;
                        var author_ids = array.join(",");
                        var branchId = this.branchId
                        axios({
                            methods: "post",
                            url: "/index.php/Business/Index/authorArrange",
                            data: {
                                shopId: branchId,
                                author_ids: author_ids,
                                token: shopData.token
                            },
                        }).then(function (res) {
                            if (res == 1) {
                                alert("成功");
                                window.history.go(-1); //返回上一页
                            }
                            else if (res.data.res == -1) {
                                alert(res.data.reason)
                                localStorage.removeItem('shopData');
                                location.href = "/business/Login/index.html";
                            }

                            else {
                                alert("失败")
                            }
                        })

                    }
                }
            })
        }

}