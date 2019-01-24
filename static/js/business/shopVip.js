window.onload = function() {
    var shopData = JSON.parse(localStorage.getItem('shopData'));
    if (!shopData) {
        location.href = "/business/Login/index.html";
    } else {
        var app = new Vue({
            el: '.Huod',
            data: {
                dataz: {
                    pageNumb: 0, //总页数
                    pageCurent: 1, //当前页
                    pageEach: 10, //每一页显示数据条数
                },
            },
            created: function () {
                var that = this;
                that.pageFn(1);
            },
            methods: {
                //------------------------分页跳转------------------------------------
                pageFn: function (pageCurent) {

                    var that = this;
                    var page = (pageCurent - 1) * that.pageEach;
                    that.pageCurent = pageCurent;
                    axios({
                        method: "post",
                        url: 'https://www.aftdc.com/business/Membership/level_list',
                        data: {
                            page: page,
                            userPhone: that.phone,
                            token: shopData.token
                        },
                    }).then(function (res) {
                        if(res.data.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href="/business/Login/index.html";
                        }else if (res.data.res == 1) {
                            that.dataz = res.data.data;

                            //初始化页数
                            var pageCount = Number(res.data.pageCount);
                            var pageEach = Number(res.data.pageEach);
                            that.pageEach = res.data.pageEach;
                            var pageNumb = Math.ceil(pageCount / pageEach)
                            that.pageNumb = pageNumb

                        } else {
                            alert('该店铺没有设置会员等级')
                        }



                    })

                },

                //**********

                VIPClick: function () { // 点击 【添加会员等级】  弹出框 出现
                    $(".Sindere").show();

                },
                SuncuoClick: function () { // 点击错号【关闭弹出框】
                    $(".Sindere").hide();

                },
                SaveterClick: function () { // 设置会员等级 【 保存   】
                    var inpterb = $('input[name=name]').val(); // 会员等级
                    var junten = $('input[name=zk]').val(); // 受挫折
                    var shujine = $('input[name=money]').val(); // 值金额
                    if (junten < 5 || junten > 10) {
                        alert('折扣范围为5~10折')
                        return false
                    }
                    axios({
                        method: "post",
                        url: "https://www.aftdc.com/business/Membership/insert_level", // 请求路径 待后台【写】
                        data: {
                            name: inpterb,
                            zk: junten,
                            money: shujine,
                            token:shopData.token,
                        },
                        dataType: 'json',
                    }).then(function (res) {

                        if(res.data.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href="/business/Login/index.html";
                        }
                      else  if (res.data.res == -3) {
                            alert('含有非法字段！')
                            return false;
                        }
                     else   if (res.data.res == -5) {
                            alert('没有数据！')
                            return false;
                        }
                      else  if (res.data.res == -2) {
                            alert('数据不完整！')
                            return false;
                        }
                      else  if (res.data.res == 0) {
                            alert('添加失败')
                            return false;
                        }
                       else if (res.data.res == 1) {
                            alert('添加成功')
                            top.location.reload();
                        }
                    })


                },
                bjClick: function (index) {//编辑
                    var that = this;

                    location.href = '/business/Membership/upVip.html?id=' + index;
                    /*{:U('Business/Setshop/upVip','id='.$vo['id'])}*/
                },
                scClick: function (item) {//删除
                    var id = item.id;
                    axios({
                        method: "post",
                        url: 'https://www.aftdc.com/business/Membership/delete_level',
                        data: {
                            id: id,
                            token:shopData.token,
                        },
                    }).then(function (res) {
                        if (res.data.res == 1) {
                            alert('删除成功！');
                            location.reload();
                        }else  if(res.data.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href="/business/Login/index.html";
                        } else {
                            alert('删除失败！');
                            return false;
                        }
                    })
                },

            }
        })
    }
}