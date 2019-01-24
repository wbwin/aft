window.onload = function(){
    var adminData = JSON.parse(localStorage.getItem('adminData'));
    if(!adminData){
        location.href="../Login/login.html";
    }else {
        var app = new Vue({
        el: "#app",
        data: {
            id: '',
            replyData: [],
        },
        created: function () {
            var goods = window.localStorage.getItem("goods");
            if (Boolean(goods)) {
                var data = JSON.parse(goods);
                this.id = data.id;
                var that = this
                axios({
                    method: "post",
                    url: "https://www.aftdc.com/aftdcAControl/Goods/seePl",
                    data: {
                        id: data.id,
                        adminNum:adminData.adminNum,
                        token:adminData.token
                    },
                }).then(function (res) {
                    var require = res.data
                    if (require.res == 1) {
                        that.replyData = require.data;
                    }else if(require.res == -1){
                        alert(res.data.reason)
                        localStorage.removeItem('adminData');
                        location.href="../Login/login.html";
                    }else if(require.res==0){
                        alert('暂无用户或商家回复！')
                        return false
                    }

                })
            } else {
                window.history.go(-1);
            }
        },
        methods: {
            del: function (id, index) {
                var that = this
                if (confirm("确认删除该回复")) {
                    axios({
                        url: "https://www.aftdc.com/aftdcAControl/Goods/delCommtent",
                        method: "post",
                        data: {
                            id: id,
                            adminNum:adminData.adminNum,
                            token:adminData.token
                        },
                    }).then(function (res) {
                        if (res.data.res == 1) {
                            that.replyData.splice(index, 1)
                        }else if(res.data.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('adminData');
                            location.href="../Login/login.html";
                        }
                    })
                }

            }
        }
    })
    }
}