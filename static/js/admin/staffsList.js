window.onload = function(){
    var adminData = JSON.parse(localStorage.getItem('adminData'));
    if(!adminData){
        location.href="../Login/login.html";
    }else {
        var app = new Vue({
            el: "#app",
            data: {
                listData: [],
                loginName: '',
                staffName: '',
                stateTogle: -1,

                pageNumb: 0,//总页数
                pageCurent: 1,//当前页
                pageEach: 10,//每页分几条数据
            },
            created: function () {
                this.pageFn(1);
            },
            methods: {
                content: function () {
                    this.stateTogle = -1;
                },
                //分页请求 查询数据
                pageFn: function (pageCurent) {
                    var that = this;
                    var page = (pageCurent - 1) * that.pageEach;
                    that.pageCurent = pageCurent;
                    axios({
                        method: "POST",
                        url: "https://www.aftdc.com/aftdcAControl/Role/staffs",
                        data: {
                            page: page,
                            loginName: that.loginName,
                            staffName: that.staffName,
                            adminNum:adminData.adminNum,
                            token:adminData.token
                        },
                    }).then(function (res) {
                        console.log(res)
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

                editStatus: function (id, type, index) {
                    var that = this;
                    axios({
                        method: "post",
                        url: "https://www.aftdc.com/aftdcAControl/Role/editStatus",
                        data: {
                            staffId: id,
                            staffStatus: type,
                            adminNum:adminData.adminNum,
                            token:adminData.token
                        }
                    }).then(function (res) {
                        if (res.data.res == 1) {
                            that.listData[index].staffStatus = type;
                        }else if(res.data.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('adminData');
                            location.href="../Login/login.html";
                        }
                    })
                },

                del: function (id, index) {
                    var that = this
                    if (confirm("确认删除该职员？")) {
                        axios({
                            method: "post",
                            url: 'https://www.aftdc.com/aftdcAControl/Role/staffs_del',
                            data: {
                                staffId: id,
                                adminNum:adminData.adminNum,
                                token:adminData.token
                            }
                        }).then(function (res) {
                            if (res.data.res == 1) {
                                that.listData.splice(index, 1)
                            }else if(res.data.res == -1){
                                alert(res.data.reason)
                                localStorage.removeItem('adminData');
                                location.href="../Login/login.html";
                            }
                        })
                    }
                },
                edit: function (staffId) {
                    window.localStorage.removeItem("staffId", staffId);
                    if (Boolean(staffId)) {
                        window.localStorage.setItem("staffId", staffId);
                    }
                    window.location.href = "staffIdEdit.html"
                },
            }
        })
    }
}