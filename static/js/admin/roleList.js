window.onload = function(){
    var adminData = JSON.parse(localStorage.getItem('adminData'));
    if(!adminData){
        location.href="../Login/login.html";
    }else {
        var app = new Vue({
            el: "#app",
            data: {
                listData: [],

                pageNumb: 0,//总页数
                pageCurent: 1,//当前页
                pageEach: 10,//每页分几条数据
            },
            created: function () {
                window.localStorage.removeItem("roleId");
                this.pageFn(1);
            },
            methods: {
                //分页请求 查询数据
                pageFn: function (pageCurent) {
                    var that = this;
                    var page = (pageCurent - 1) * that.pageEach;
                    that.pageCurent = pageCurent;

                    axios({
                        method: "POST",
                        url: "https://www.aftdc.com/aftdcAControl/Role/index",
                        data: {
                            page: page,
                            adminNum:adminData.adminNum,
                            token:adminData.token
                        },
                    }).then(function (res) {
                        var require = res.data;
                        if (require.res == 1) {
                            that.listData = require.data;
                            that.pageNumb = Math.ceil(require.pageCount / require.pageEach)
                            that.pageEach = require.pageEach
                        }else if(res.data.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('adminData');
                            location.href="../Login/login.html";
                        }
                    })
                },

                del: function (id, index) {
                    var that = this;
                    if (confirm("确认删除？")) {
                        axios({
                            method: "post",
                            url: "https://www.aftdc.com/aftdcAControl/Role/del",
                            data: {
                                roleId: id,
                                adminNum:adminData.adminNum,
                                token:adminData.token
                            }
                        }).then(function (res) {
                            if (res.data.res == 1) {
                                that.listData.splice(index, 1);
                            }else if(res.data.res == -1){
                                alert(res.data.reason)
                                localStorage.removeItem('adminData');
                                location.href="../Login/login.html";
                            }
                        })
                    }
                },
                operate: function (roleId) {
                    window.localStorage.removeItem("roleId");
                    if (roleId) {
                        window.localStorage.setItem("roleId", roleId);
                    }
                    window.location.href = "roleEdit.html"
                }
            }
        })
    }
}