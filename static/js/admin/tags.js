window.onload = function(){
    var adminData = JSON.parse(localStorage.getItem('adminData'));
    if(!adminData){
        location.href="../Login/login.html";
    }else {
        var app = new Vue({
            el: "#app",
            data: {
                tagsData: [],
            },
            created: function () {
                var that = this;
                axios({
                    method: "post",
                    url: "https://www.aftdc.com/aftdcAControl/Tag/tags",
                    data: {
                        adminNum:adminData.adminNum,
                        token:adminData.token
                    },
                }).then(function (res) {
                    var require = res.data;
                    if (require.res == 1) {
                        that.tagsData = require.data;
                    }else if(res.data.res == -1){
                        alert(res.data.reason)
                        localStorage.removeItem('adminData');
                        location.href="../Login/login.html";
                    }
                })
            },
            methods: {
                // 填写标签名称
                updName: function (index) {
                    var that = this
                    var datas = that.tagsData[index];
                    axios({
                        method: "post",
                        url: "https://www.aftdc.com/aftdcAControl/Tag/updName",
                        data: {
                            name: datas.name,
                            id: datas.id,
                            adminNum:adminData.adminNum,
                            token:adminData.token
                        },
                    }).then(function (res) {
                        if(res.data.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('adminData');
                            location.href="../Login/login.html";
                        }
                    })
                },
                // 填写标签关键词
                updKeyword: function (id,keyword) {
                    var that = this
                    var id = id
                    axios({
                        method: "post",
                        url: "https://www.aftdc.com/aftdcAControl/Tag/updKeyword",
                        data: {
                            keyword: keyword,
                            id: id,
                            adminNum:adminData.adminNum,
                            token:adminData.token
                        },
                    }).then(function (res) {
                        if(res.data.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('adminData');
                            location.href="../Login/login.html";
                        }
                    })
                },
                //删除
                del: function (index, id) {
                    var that = this
                    if (confirm("确认删除该标签？")) {
                        axios({
                            method: "post",
                            url: "https://www.aftdc.com/aftdcAControl/Tag/delTags",
                            data: {
                                id: id
                            }
                        }).then(function (res) {
                            if (res.data.res == 1) {
                                that.tagsData.splice(index, 1)
                            }else if(res.data.res == -1){
                                alert(res.data.reason)
                                localStorage.removeItem('adminData');
                                location.href="../Login/login.html";
                            }
                        })
                    }
                },

                add: function () {
                    var that = this;
                    axios({
                        method: "post",
                        url: "https://www.aftdc.com/aftdcAControl/Tag/addTags",
                        data: {},
                    }).then(function (res) {
                        if (res.data.res == 1) {
                            var data = res.data.data;
                            data.name = "";
                            data.keyword = "";
                            that.tagsData.push(data);
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