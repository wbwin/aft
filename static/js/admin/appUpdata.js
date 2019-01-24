window.onload = function(){
    var adminData = JSON.parse(localStorage.getItem('adminData'));
    if(!adminData){
        location.href="../Login/login.html";
    }else {
        var app = new Vue({
            el: "#app",
            data: {
                appData: [],
                name: "",
                istogle: -1,
                togle: 0,//弹出框
                addId: false,//添加子分类的主分类id
                modalTxt: '',
                detailTxt:'',
                pageSum: 0,//总数目
                pageNumb: 0,//总页数
                pageCurent: 1,//当前页
                pageEach: 10,//每页分几条数据
                apptype:'',//1为客户端 2为商家
            },
            created: function () {
                this.apptype = location.search.split('=')[1]
                this.pageFn(1)
            },
            methods: {
                overall: function () {
                    this.istogle = false
                },
                //查询数据
                pageFn: function (pageCurent) {
                    var apptype = this.apptype
                    var that = this;
                    var page = (pageCurent - 1) * that.pageEach;
                    that.pageCurent = pageCurent;
                    var name = that.name
                    axios({
                        url: "https://www.aftdc.com/aftdcAControl/Appupdata/dataList",
                        method: "post",
                        data: {
                            page: page,
                            name: name,
                            apptype:apptype,
                            adminNum:adminData.adminNum,
                            token:adminData.token
                        }
                    }).then(function (res) {
                        var require = res.data;
                        if(res.data.res==1){
                            that.appData = require.data;
                            that.pageNumb = Math.ceil(require.pageCount / require.pageEach)
                            that.pageEach = require.pageEach;
                            that.pageSum = require.pageCount
                        }else if(res.data.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('adminData');
                            location.href="../Login/login.html";
                        }else{
                            that.appData = require.data;
                            that.pageNumb = Math.ceil(require.pageCount / require.pageEach)
                            that.pageEach = require.pageEach;
                            that.pageSum = require.pageCount
                        }

                    })
                },

                modalFn: function (modal, id, index) {
                    this.togle = modal
                    if (modal == 2) {
                        this.addId = id;
                        this.editIndex = index
                        this.modalTxt = this.appData[index].version
                        this.detailTxt = this.appData[index].details.join(';')
                    }
                },
                //添加app更新
                addUpdata: function () {
                    var that = this
                    var version = that.modalTxt;
                    var details = that.detailTxt;
                    var apptype = this.apptype
                    axios({
                        method: "post",
                        url: "https://www.aftdc.com/aftdcAControl/Appupdata/addUpdata",
                        data: {
                            version: version,
                            details:details,
                            apptype:apptype,
                            adminNum:adminData.adminNum,
                            token:adminData.token
                        }
                    }).then(function (res) {
                        var require = res.data;
                        if (require.res == 1) {
                            that.appData.push(require.data)
                        }else if(res.data.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('adminData');
                            location.href="../Login/login.html";
                        }
                        that.togle = false;
                    })
                },
                //编辑
                editUpdata: function () {
                    var that = this;
                    var version = that.modalTxt;
                    var details = that.detailTxt;
                    var apptype = this.apptype
                    var id = this.addId
                    axios({
                        method: "post",
                        url: "https://www.aftdc.com/aftdcAControl/Appupdata/editUpdata",
                        data: {
                            id:id,
                            version:version,
                            details:details,
                            apptype:apptype,
                            adminNum:adminData.adminNum,
                            token:adminData.token
                        }
                    }).then(function (res) {
                        var require = res.data;
                        if (require.res == 1) {
                            that.appData[that.editIndex].version = version
                            that.appData[that.editIndex].details = details.split(';')
                        }else if(res.data.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('adminData');
                            location.href="../Login/login.html";
                        }
                        that.togle = false;
                    })
                },

                del: function (id,index) {
                    var that = this;
                    if (confirm("确认删除")) {
                        axios({
                            method: "post",
                            url: "https://www.aftdc.com/aftdcAControl/Appupdata/del",
                            data: {
                                id: id,
                                adminNum:adminData.adminNum,
                                token:adminData.token
                            }
                        }).then(function (res) {
                            if (res.data.res == 1) {
                                that.appData.splice(index, 1)
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