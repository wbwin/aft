window.onload = function(){
    var adminData = JSON.parse(localStorage.getItem('adminData'));
    if(!adminData){
        location.href="../Login/login.html";
    }else {
        var app = new Vue({
            el: "#app",
            data: {
                staffs: {},
                roleList: [
                    {roleId: 1, roleName: "商品管理员"},
                    {roleId: 2, roleName: "门店管理员"},
                    {roleId: 3, roleName: "系统管理员"},
                    {roleId: 4, roleName: "客服"},
                ],
                keepName: '',//修改信息的情况下，保存原有的名字

                tipsPwd: '',//密码
                tipsName: '',//账号
                tipsSta: '',//名字
                tipsSelect: '',//选择角色
                txtName: '会员账号应该为5-16字母、数字或下划线',
            },
            created: function () {
                var that = this;
                var staffId = window.localStorage.getItem("staffId");
                if (Boolean(staffId)) {
                    axios({
                        method: "post",
                        url: "https://www.aftdc.com/aftdcAControl/Role/staffs_toEdit",
                        data: {
                            staffId: staffId,
                            adminNum:adminData.adminNum,
                            token:adminData.token
                        }
                    }).then(function (res) {
                        if (res.data.res == 1) {
                            that.keepName = res.data.data.loginName;
                            that.staffs = res.data.data;
                        }
                    })
                } else {
                    that.staffs.staffRoleId = -1;
                    that.staffs.workStatus = 1;
                    that.staffs.staffStatus = 1;
                    // that.staffs.staffPhoto="/static/image/admin/staff.png"
                }
            },
            methods: {
                focusPwd: function (name, txt) {
                    this[name] = 'onFocus'
                },
                blurPwd: function (name, txt) {
                    var min = name == 'tipsSta' ? 0 : 4
                    var max = name == 'tipsName' ? 17 : 21
                    if (Boolean(txt) && txt.length > min && txt.length < max) {
                        // this[name]='onCorrect'
                        this[name] = ''
                        if (name == 'tipsName') {
                            this.judgeName();
                        }
                    } else {
                        this[name] = 'onError'
                    }
                },

                judgeName: function () {
                    var that = this
                    var staffs = this.staffs;
                    var name = staffs.loginName;
                    if (staffs.staffId) {
                        if (that.keepName == name) {
                            return false
                        }
                    }
                    axios({
                        method: "post",
                        url: "https://www.aftdc.com/aftdcAControl/Role/isExist",
                        data: {
                            loginName: name,
                            adminNum:adminData.adminNum,
                            token:adminData.token
                        }
                    }).then(function (res) {
                        if (res.data.res == 0) {
                            that.tipsName = 'onError';
                            that.txtName = '该账号已存在。';
                        }
                    })

                },
                keepFn: function () {
                    var that = this;
                    var staffs = this.staffs;
                    if (staffs.staffRoleId == -1) {
                        that.tipsSelect = 'onError'
                        return false
                    }
                    this.blurPwd('tipsName', staffs.loginName)
                    this.blurPwd('tipsPwd', staffs.loginPwd)
                    this.blurPwd('tipsSta', staffs.staffName)
                    if (Boolean(that.tipsName) || Boolean(that.loginPwd) || Boolean(that.staffName)) {
                        return false
                    }
                    staffs.staffId = Boolean(staffs.staffId) ? staffs.staffId : 0,
                        axios({
                            method: "post",
                            url: "https://www.aftdc.com/aftdcAControl/Role/staffs_edit",
                            data: {
                                staffId: staffs.staffId,
                                loginName: staffs.loginName,
                                staffName: staffs.staffName,
                                staffRoleId: staffs.staffRoleId,
                                workStatus: staffs.workStatus,
                                staffStatus: staffs.staffStatus,
                                staffNo: staffs.staffNo,
                                loginPwd: staffs.loginPwd,
                                adminNum:adminData.adminNum,
                                token:adminData.token
                            }
                        }).then(function (res) {
                            if (res.data.res == 1) {
                                alert("操作成功");
                                window.history.go(-1)
                            }else if(res.data.res == -1){
                                alert(res.data.reason)
                                localStorage.removeItem('adminData');
                                location.href="../Login/login.html";
                            }
                        })
                },
            }
        })
    }
}