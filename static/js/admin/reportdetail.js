window.onload = function(){
    var adminData = JSON.parse(localStorage.getItem('adminData'));
    if(!adminData){
        location.href="../Login/login.html";
    }else {
        var app = new Vue({
            el: "#app",
            data: {
                mainContent: {},//主评论信息
                subReply: [],//子回复信息
                reportMan: [],//举报人信息
                imgData:[],
                imgToggle:0,
            },
            created: function () {
                var that = this;
                var pid = window.localStorage.getItem("pid");//缓存的评论id

                if (Boolean(pid) || parseInt(pid) == 0) {
                    axios({
                        method: "post",
                        url: "https://www.aftdc.com/aftdcAControl/Tag/reportdetail",
                        data: {
                            pid: pid,
                            adminNum:adminData.adminNum,
                            token:adminData.token
                        }
                    }).then(function (res) {
                        var require = res.data;
                        if (require.res == 1) {
                            that.mainContent = Boolean(require.mainContent) ? require.mainContent : {};
                            that.subReply = Boolean(require.subReply) ? require.subReply : [];
                            that.reportMan = Boolean(require.reportMan) ? require.reportMan : [];
                        }else if(res.data.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('adminData');
                            location.href="../Login/login.html";
                        }
                    })
                } else {
                    window.history.go(-1);
                }
            },
            methods: {
                //封号
                ban: function (userId, type) {
                    var that = this;
                    if (confirm("确认封掉该号？")) {

                        axios({
                            method: "post",
                            url: "https://www.aftdc.com/aftdcAControl/Tag/ban",
                            data: {
                                userId: userId,
                                type: type,
                                adminNum:adminData.adminNum,
                                token:adminData.token
                            },
                        }).then(function (res) {
                            if (res.data.res == 1) {
                                alert("操作成功")
                            }else if(res.data.res == -1){
                                alert(res.data.reason)
                                localStorage.removeItem('adminData');
                                location.href="../Login/login.html";
                            }
                        })
                    }
                },
                delComm: function (id, index) {
                    var that = this;
                    if (confirm('确定要删除该评论')) {
                        axios({
                            method: "post",
                            url: "https://www.aftdc.com/aftdcAControl/Tag/delCommtent",
                            data: {
                                id: id,
                                adminNum:adminData.adminNum,
                                token:adminData.token
                            }
                        }).then(function (res) {
                            if (res.data.res == 1) {
                                that.subReply.splice(index, 1)
                            }else if(res.data.res == -1){
                                alert(res.data.reason)
                                localStorage.removeItem('adminData');
                                location.href="../Login/login.html";
                            }
                        })
                    }
                },
                seeImg:function () {

                    var that=this;
                    $('.seeImgHide').show();
                    var imgData= that.mainContent.appraisesAnnex;
                    that.imgData=imgData.split(',')
                    console.log(that.imgData)
                },
                imgClose:function () {
                    $('.seeImgHide').hide();
                },
                prev:function () {
                    var that=this
                    that.imgToggle--;
                },
                next:function () {
                    var that=this
                    that.imgToggle++;
                },
            }
        })
    }
}