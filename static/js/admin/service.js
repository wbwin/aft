window.onload = function(){
    var adminData = JSON.parse(localStorage.getItem('adminData'));
    if(!adminData){
        location.href="../Login/login.html";
    }else {
        var app = new Vue({
            el: "#app",
            data: {
                listData: [],
                stateTogle: -1,
                temp:[],
                pageNumb: 0,//总页数
                pageCurent: 1,//当前页
                pageEach: 2,//每页分几条数据
                id:[],
                ptkfName:'',
                checkboxModel:[]
            },
            created: function () {
                this.pageFn(1);
            },
            methods: {
                content: function () {
                    this.stateTogle = -1;
                },
                //分页请求 查询数据
                pageFn: function (pageCurent) {
                    var that = this;
                    var page = (pageCurent - 1) * that.pageEach;
                    that.pageCurent = pageCurent;
                    axios({
                        method: "POST",
                        url: "https://www.aftdc.com/aftdcAControl/Service/serviceList",
                        data: {
                            page: page,
                            ptkfName: that.ptkfName,
                            adminNum:adminData.adminNum,
                            token:adminData.token
                        },
                    }).then(function (res) {
                        var require = res.data;
                        that.listData = []
                        that.pageNumb = Math.ceil(require.pageCount / require.pageEach)
                        that.pageEach = require.pageEach
                        if (require.res == 1) {
                            that.listData = require.data;


                        } else if (res.data.res == -1) {
                            alert(res.data.reason)
                            localStorage.removeItem('adminData');
                            location.href = "../Login/login.html";
                        }
                    })
                },

                ids:function(id,index)
                {
                    this.checkboxModel.push(id);
                },
                del: function (id, index) {
                    this.id = this.checkboxModel
                    console.log(this.id)
                    var id = JSON.stringify(this.id)
                    this.id = []
                    var that = this
                    console.log(that.checkboxModel.length)
                    if (confirm("确认删除该客服人员？")) {
                        axios({
                            method: "post",
                            url: 'https://www.aftdc.com/aftdcAControl/service/serviceDel',
                            data: {
                                ptkfId: id,
                                adminNum: adminData.adminNum,
                                token: adminData.token
                            }
                        }).then(function (res) {
                            if (res.data.res == 1) {

                                if(that.checkboxModel.length>=2)
                                    location.reload();
                                that.listData.splice(index, 1)
                            } else if (res.data.res == -1) {
                                alert(res.data.reason)
                                localStorage.removeItem('adminData');
                                location.href = "../Login/login.html";
                            }
                        })
                    }
                },
                choiceAll: function ()
                {
                    var _this = this;
                    if (!event.currentTarget.checked) {//实现反选
                        _this.checkboxModel = [];
                    }else{//实现全选
                        _this.checkboxModel = [];
                        _this.listData.forEach(function(item) {
                            _this.checkboxModel.push(item.ptkfId);
                        });
                    }

                },
                edit: function (ptkfId, index) {
                    location.href = "./edit.html?ptkfId="+ptkfId;
                },
            }
        })
    }
}