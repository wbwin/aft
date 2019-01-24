window.onload = function(){
    var adminData = JSON.parse(localStorage.getItem('adminData'));
    if(!adminData){
        location.href="../Login/login.html";
    }else {
        var app = new Vue({
            el: "#app",
            data: {
                listData: [],
                userPhone: '',//查询的信息
                userEmail: '',
                userType: -1,//会员类型0为普通用户 1为商家账号
                login_name: '',
                statusTogle: -1,
                statusId: false,
                tipsClas: '',
                togle: 0,//弹出框
                info: {},//账号信息

                pageNumb: 0,//总页数
                pageCurent: 1,//当前页
                pageEach: 10,//每页分几条数据
            },
            created: function () {
                window.localStorage.removeItem("userId");
                this.pageFn(1)
            },
            methods: {
                count: function () {
                    this.statusTogle = -1;
                },

                //分页请求 查询数据
                pageFn: function (pageCurent) {
                    var that = this;
                    var page = (pageCurent - 1) * that.pageEach;
                    that.pageCurent = pageCurent;
                    var userType = that.userType == -1 ? '' : that.userType
                    axios({
                        method: "POST",
                        url: "https://www.aftdc.com/aftdcAControl/Member/member_list",
                        data: {
                            page: page,
                            userPhone: that.userPhone,
                            userEmail: that.userEmail,
                            // userType: userType,//会员类型 0为普通用户 1为商家账号
                            login_name: that.login_name,
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
                        }else{
                            that.listData = require.data;
                            that.pageNumb = Math.ceil(require.pageCount / require.pageEach)
                            that.pageEach = require.pageEach
                        }
                    })
                },

                statusTogleFn: function (id, type, index) {
                    var that = this;
                    axios({
                        method: "post",
                        url: "https://www.aftdc.com/aftdcAControl/Member/member_state",
                        data: {
                            userId: id,
                            userStatus: type,
                            adminNum:adminData.adminNum,
                            token:adminData.token
                        }
                    }).then(function (res) {
                        if (res.data.res == 1) {
                            that.listData[index].userStatus = type;
                        }else if(res.data.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('adminData');
                            location.href="../Login/login.html";
                        }
                    })
                },

                infoFn: function (index) {
                    var info = this.listData[index];
                    info.modifyPassword = '',
                        this.info = info;
                    this.togle = 1;
                },
                onfocus: function () {
                    var txt = this.info.modifyPassword;
                    if (txt > 0) {
                        this.tipsClas = "onFocus"
                    }

                },
                onblur: function () {
                    var txt = this.info.modifyPassword;
                    if (Boolean(txt)) {
                        if (txt.length > 6 && txt.length < 20) {
                            this.tipsClas = "onCorrect"
                        } else {
                            this.tipsClas = "onError"
                        }
                    } else {
                        this.tipsClas = ""
                    }
                },
                addWord: function () {
                    var that = this;
                    var info = this.info
                    if (!Boolean(info.modifyPassword)) {
                        return false
                    }
                    axios({
                        method: "post",
                        url: "https://www.aftdc.com/aftdcAControl/Member/account_alter",
                        data: {
                            business_id: info.business_id,
                            login_password: info.modifyPassword,
                            adminNum:adminData.adminNum,
                            token:adminData.token
                        }
                    }).then(function (res) {
                        that.togle = 0
                        if (res.data.res == 1) {
                            alert("修改成功");
                        }else if(res.data.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('adminData');
                            location.href="../Login/login.html";
                        }
                    })
                },
                edit: function (userId) {
                    window.localStorage.setItem("userId", userId);
                    window.location.href = "member_edit.html"
                },
            }
        })
    }
}