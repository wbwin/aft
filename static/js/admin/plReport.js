window.onload = function(){
    var adminData = JSON.parse(localStorage.getItem('adminData'));
    if(!adminData){
        location.href="../Login/login.html";
    }else {
        var app = new Vue({
            el: "#app",
            data: {
                reportData: [],
                pageSum: 0,
                pageNumb: 0,//总页数
                pageCurent: 1,//当前页
                pageEach: 10,//每页分几条数据
                imgData:[],
                imgToggle:0,
            },
            created: function () {
                window.localStorage.removeItem("pid");//缓存起评论id
                this.pageFn(1)
            },
            methods: {
                pageFn: function (pageCurent) {
                    var that = this;
                    var page = (pageCurent - 1) * that.pageEach;
                    that.pageCurent = pageCurent;
                    axios({
                        url: "https://www.aftdc.com/aftdcAControl/Tag/plReport",
                        method: "post",
                        data: {
                            page: page,
                            adminNum:adminData.adminNum,
                            token:adminData.token
                        }
                    }).then(function (res) {
                        var require = res.data;
                        if (res.data.res == 1) {
                            that.reportData = require.data;
                            that.pageNumb = Math.ceil(require.pageCount / require.pageEach)
                            that.pageEach = require.pageEach;
                            that.pageSum = require.pageCount
                        }else if(res.data.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('adminData');
                            location.href="../Login/login.html";
                        }
                    })
                },

                del: function (id, index) {
                    if (confirm('确定要删除该被举报的评论')) {
                        var that = this;
                        axios({
                            method: "post",
                            url: "https://www.aftdc.com/aftdcAControl/Tag/delPl",
                            data: {
                                id: id,
                                adminNum:adminData.adminNum,
                                token:adminData.token
                            }
                        }).then(function (res) {
                            if (res.data.res == 1) {
                                that.reportData.splice(index, 1)
                            }else if(res.data.res == -1){
                                alert(res.data.reason)
                                localStorage.removeItem('adminData');
                                location.href="../Login/login.html";
                            }
                        })
                    }
                },
                reportdetail: function (pid) {
                    window.localStorage.setItem("pid", pid);//缓存起评论id
                    window.location.href = "reportdetail.html";
                },
                seeImg:function (item) {

                    var that=this;
                    $('.seeImgHide').show();
                    var img = [];
                    img.push(item.img);
                    that.imgData=img;
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