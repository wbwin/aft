window.onload = function(){
    var adminData = JSON.parse(localStorage.getItem('adminData'));
    if(!adminData){
        location.href="../Login/login.html";
    }else {
        var app = new Vue({
            el: "#app",
            data: {
                roleData: [],
                roleId: 0,
                roleName: '',//角色名称
                tips: {txt: '', clas: 'onFocus'},

            },
            created: function () {
                var that = this
                var roleId = window.localStorage.getItem("roleId");
                if (!Boolean(roleId)) {
                    roleId = 0
                }
                this.roleId = roleId;
                axios({
                    method: "post",
                    url: "https://www.aftdc.com/aftdcAControl/Role/role_author",
                    data: {
                        roleId: roleId,
                        adminNum:adminData.adminNum,
                        token:adminData.token
                    }
                }).then(function (res) {
                    if (res.data.res == 1) {
                        that.roleData = res.data.data;
                        if (Boolean(res.data.roleInfo)) that.roleName = res.data.roleInfo.roleName;
                    }else if(res.data.res == -1){
                        alert(res.data.reason)
                        localStorage.removeItem('adminData');
                        location.href="../Login/login.html";
                    }
                })
            },
            methods: {
                onfocus: function () {
                    this.tips = {txt: '角色名称至少要输入一个字符', clas: 'onFocus'}
                },
                onblur: function () {
                    var txt = this.roleName;
                    if (Boolean(txt) && txt.length > 0 && txt.length < 26) {
                        this.tips = {txt: '输入正确', clas: 'onCorrect'}
                    } else {
                        this.tips = {txt: '您输入的长度不正确,请确认', clas: 'onError'}
                    }
                },

                checkModel1: function (index1) {
                    var roleData = this.roleData;
                    var have = roleData[index1].have;
                    var child = roleData[index1].child
                    if (Boolean(child)) {
                        child.forEach(function (item) {
                            item.have = have;
                            if (Boolean(item.child)) {
                                item.child.forEach(function (x) {
                                    x.have = have;
                                })
                            }
                        })
                    }
                    this.roleData = roleData;
                },
                checkModel2: function (index1, index2) {

                    var child = this.roleData[index1].child
                    var have = child[index2].have
                    var small = child[index2].child
                    if (Boolean(small)) {
                        small.forEach(function (item) {
                            item.have = have;
                        })
                    }
                    this.roleData[index1].child = child;
                },
                keepFn: function () {
                    var that = this;
                    var roleData = this.roleData;
                    var grant = [];
                    roleData.forEach(function (rol) {
                        var rha = rol.have;
                        if (rha) grant.push(rol.id);
                        var child = rol.child
                        if (Boolean(child)) {
                            child.forEach(function (item) {
                                var cha = item.have;
                                if (cha) grant.push(item.id);
                                if (Boolean(item.child)) {
                                    item.child.forEach(function (x) {
                                        var sha = x.have;
                                        if (sha) {
                                            grant.push(x.id);
                                        }
                                    })
                                }
                            })
                        }
                    })
                    grant = grant.join(",")
                    var roleName = that.roleName;
                    if (!Boolean(roleName)) {
                        document.documentElement.scrollTop = 0;
                        return false
                    }
                    axios({
                        method: "post",
                        url: "https://www.aftdc.com/aftdcAControl/Role/save_author",
                        data: {
                            grant: grant,
                            roleId: that.roleId,
                            roleName: that.roleName,
                            adminNum:adminData.adminNum,
                            token:adminData.token
                        }
                    }).then(function (res) {
                        if (res.data.res) {
                            alert("修改成功")
                            window.history.go(-1)
                        }else if(res.data.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('adminData');
                            location.href="../Login/login.html";
                        }
                    })
                }
            }
        })
    }
}