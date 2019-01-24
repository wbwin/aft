window.onload = function(){
    var adminData = JSON.parse(localStorage.getItem('adminData'));
    if(!adminData){
        location.href="../Login/login.html";
    }else {
        var app = new Vue({
            el: "#app",
            data: {
                listData: [],
                targetType: -1,//会员类型
                moneyType: -1,//流水类型
                dataSrc: -1,//流水来源

                pageNumb: 0,//总页数
                pageCurent: 1,//当前页
                pageEach: 10,//每页分几条数据

            },
            created: function () {
                this.pageFn(1)
            },
            methods: {
                //分页请求 查询数据
                pageFn: function (pageCurent) {
                    var that = this;
                    var page = (pageCurent - 1) * that.pageEach;
                    that.pageCurent = pageCurent;

                    var targetType = this.targetType == -1 ? '' : this.targetType;
                    var moneyType = this.moneyType == -1 ? '' : this.moneyType;
                    var dataSrc = this.dataSrc == -1 ? '' : this.dataSrc;
                    var startDate = document.getElementById("startDate").value;
                    var endDate = document.getElementById("endDate").value;

                    axios({
                        method: "POST",
                        url: "https://www.aftdc.com/aftdcAControl/Finance/purse_list",
                        data: {
                            page: page,
                            targetType: targetType,
                            moneyType: moneyType,
                            dataSrc: dataSrc,
                            startDate: startDate,
                            endDate: endDate,
                            adminNum:adminData.adminNum,
                            token:adminData.token
                        },
                    }).then(function (res) {
                        console.log(res)
                        var require = res.data;
                        if (require.res == 1) {
                            that.listData = require.data;
                            that.pageNumb = Math.ceil(require.pageCount / require.pageEach)
                            that.pageEach = require.pageEach
                        }else if(res.data.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('adminData');
                            location.href="../Login/login.html";
                        }else{
                            that.listData = require.data;
                            that.pageNumb = Math.ceil(require.pageCount / require.pageEach)
                            that.pageEach = require.pageEach
                        }

                    })
                },
            }
        })
    }
}