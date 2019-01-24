window.onload = function(){
    var adminData = JSON.parse(localStorage.getItem('adminData'));
    if(!adminData){
        location.href="../Login/login.html";
    }else {
        var app = new Vue({
            el: "#app",
            data: {
                cuisineData: [],
                name: "",
                istogle: -1,

                togle: 0,//弹出框
                addId: false,//添加子分类的主分类id
                addIndex: -1,//添加子分类的主分类索引
                modalTxt: '',

                pageSum: 0,//总数目
                pageNumb: 0,//总页数
                pageCurent: 1,//当前页
                pageEach: 10,//每页分几条数据

            },
            created: function () {
                this.pageFn(1)
            },
            methods: {
                overall: function () {
                    this.istogle = false
                },
                //查询数据
                pageFn: function (pageCurent) {
                    var that = this;
                    var page = (pageCurent - 1) * that.pageEach;
                    that.pageCurent = pageCurent;
                    var name = that.name
                    axios({
                        url: "https://www.aftdc.com/aftdcAControl/Goods/cuisine",
                        method: "post",
                        data: {
                            page: page,
                            name: name,
                            adminNum:adminData.adminNum,
                            token:adminData.token
                        }
                    }).then(function (res) {
                        var require = res.data;
                        if(res.data.res==1){
                            that.cuisineData = require.data;
                            that.pageNumb = Math.ceil(require.pageCount / require.pageEach)
                            that.pageEach = require.pageEach;
                            that.pageSum = require.pageCount
                        }else if(res.data.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('adminData');
                            location.href="../Login/login.html";
                        }else{
                            that.cuisineData = require.data;
                            that.pageNumb = Math.ceil(require.pageCount / require.pageEach)
                            that.pageEach = require.pageEach;
                            that.pageSum = require.pageCount
                        }

                    })
                },
                toggleFn: function (index, cindex) {
                    this.istogle = "a" + index + 'b' + cindex
                },

                loadChildTree: function () {
                },


                //选择显示隐藏
                toggleIsShow: function (isShow, id) {
                    var that = this;
                    axios({
                        method: "post",
                        url: "https://www.aftdc.com/aftdcAControl/Goods/editiCuShow",
                        data: {
                            id: id,
                            isShow: isShow,
                            adminNum:adminData.adminNum,
                            token:adminData.token
                        }
                    }).then(function (res) {
                        if (res.data.res == 1) {
                            var istogle = that.istogle;
                            var a = istogle.substring(istogle.indexOf('a') + 1, istogle.indexOf('b'));
                            var b = istogle.substring(istogle.indexOf('b') + 1);
                            if (isNaN(Number(b))) {
                                that.cuisineData[a].isShow = isShow;
                                var child = that.cuisineData[a].child;
                                child.forEach(function (item) {
                                    item.isShow = isShow;
                                });
                                that.cuisineData[a].child = child;
                            } else {
                                that.cuisineData[a].child[b].isShow = isShow;
                            }
                        }else if(res.data.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('adminData');
                            location.href="../Login/login.html";
                        }
                        that.istogle = false
                    })
                },
                modalFn: function (modal, id, index) {
                    this.togle = modal
                    if (modal == 2) {
                        this.addId = id;
                        this.addIndex = index;
                    }

                },
                //添加主分类
                addWord: function () {
                    var that = this
                    var name = that.modalTxt;
                    axios({
                        method: "post",
                        url: "https://www.aftdc.com/aftdcAControl/Goods/addCat",
                        data: {
                            name: name,
                            adminNum:adminData.adminNum,
                            token:adminData.token
                        }
                    }).then(function (res) {
                        var require = res.data;
                        if (require.res == 1) {
                            var data = require.data;
                            data.forEach(function (item) {
                                item.child = [];
                                item.isShow = 1;
                                that.cuisineData.push(item)
                            })
                        }else if(res.data.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('adminData');
                            location.href="../Login/login.html";
                        }
                        that.togle = false;
                    })
                },
                //添加次分类
                addSon: function () {
                    var that = this;
                    var id = this.addId;
                    var name = that.modalTxt;
                    axios({
                        method: "post",
                        url: "https://www.aftdc.com/aftdcAControl/Goods/addSons",
                        data: {
                            name: name,
                            parentId: id,
                            adminNum:adminData.adminNum,
                            token:adminData.token
                        }
                    }).then(function (res) {
                        var require = res.data;
                        if (require.res == 1) {
                            var data = require.data;
                            var index = that.addIndex
                            data.forEach(function (item) {
                                item.isShow = 1;
                                that.cuisineData[index].child.push(item)
                            })
                        }else if(res.data.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('adminData');
                            location.href="../Login/login.html";
                        }
                        that.togle = false;
                    })
                },


                del: function (id, index) {
                    var that = this;
                    if (confirm("确认删除分类")) {
                        axios({
                            method: "post",
                            url: "https://www.aftdc.com/aftdcAControl/Goods/delCus",
                            data: {
                                id: id,
                                adminNum:adminData.adminNum,
                                token:adminData.token
                            }
                        }).then(function (res) {
                            if (res.data.res == 1) {
                                var a = parseInt(index.substring(index.indexOf('a') + 1, index.indexOf('b')));
                                var b = index.substring(index.indexOf('b') + 1);
                                if (isNaN(Number(b))) {
                                    //删除的是主分类
                                    that.cuisineData.splice(a, 1)

                                } else {
                                    b = parseInt(b);
                                    that.cuisineData[a].child.splice(b, 1)
                                }
                            }else if(res.data.res == -1){
                                alert(res.data.reason)
                                localStorage.removeItem('adminData');
                                location.href="../Login/login.html";
                            }
                        })
                    }


                },
                //控制子分类显示隐藏
                childStartFn: function (index) {
                    var state = this.cuisineData[index].childStart
                    state = Boolean(state) ? false : true;
                    this.$set(this.cuisineData[index], 'childStart', state);
                }
            }
        })
    }
}