window.onload = function(){
    var adminData = JSON.parse(localStorage.getItem('adminData'));
    if(!adminData){
        location.href="../Login/login.html";
    }else {
        var app = new Vue({
            el: "#app",
            data: {
                banData: [],
                word: '',//查询文字
                banTxt: '',
                togle: 0,//弹出框

                pageSum: 0,//总数目
                pageNumb: 0,//总页数
                pageCurent: 1,//当前页
                pageEach: 10,//每页分几条数据
            },
            // components:{
            //      pages:pages
            //    },
            created: function () {
                this.pageFn(1)
            },
            methods: {
                pageFn: function (pageCurent) {
                    var that = this;
                    var page = (pageCurent - 1) * that.pageEach;
                    that.pageCurent = pageCurent;
                    var word = that.word
                    axios({
                        url: "https://www.aftdc.com/aftdcAControl/Goods/disableword",
                        method: "post",
                        data: {
                            page: page,
                            word: word,
                            adminNum:adminData.adminNum,
                            token:adminData.token
                        }
                    }).then(function (res) {
                        var require = res.data;
                        if(res.data.res==1){
                            that.banData = require.data;
                            that.pageNumb = Math.ceil(require.pageCount / require.pageEach)
                            that.pageEach = require.pageEach;
                            that.pageSum = require.pageCount
                        }else if(res.data.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('adminData');
                            location.href="../Login/login.html";
                        }else{
                            that.banData = require.data;
                            that.pageNumb = Math.ceil(require.pageCount / require.pageEach)
                            that.pageEach = require.pageEach;
                            that.pageSum = require.pageCount
                        }
                    })
                },


                //删除
                del: function (id, index) {
                    var that = this;
                    if (confirm("确认删除该禁用评论")) {
                        axios({
                            url: "https://www.aftdc.com/aftdcAControl/Goods/delDisableWord",
                            data: {
                                id: id,
                                adminNum:adminData.adminNum,
                                token:adminData.token
                            },
                            method: "post",
                        }).then(function (res) {
                            if (res.data.res == 1) {
                                that.banData.splice(index, 1)
                            }else if(res.data.res == -1){
                                alert(res.data.reason)
                                localStorage.removeItem('adminData');
                                location.href="../Login/login.html";
                            }
                        })
                    }

                },
                //添加禁用词
                banShow: function () {
                    this.togle = 1;
                    this.banTxt = '';
                },
                addWord: function () {
                    var banTxt = this.banTxt;
                    var that = this;
                    axios({
                        method: "post",
                        url: "https://www.aftdc.com/aftdcAControl/Goods/addwords",
                        data: {
                            word: banTxt,
                            adminNum:adminData.adminNum,
                            token:adminData.token
                        }
                    }).then(function (res) {
                        if (res.data.res == 1) {
                            that.pageFn(that.pageCurent);
                            that.togle = 0;
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