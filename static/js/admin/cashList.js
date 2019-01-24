window.onload = function(){
    var adminData = JSON.parse(localStorage.getItem('adminData'));
    if(!adminData){
        location.href="../Login/login.html";
    }else {
        var app = new Vue({
            el: "#app",
            data: {
                listData: [],
                cashSatus: -1,
                pageNumb: 0,//总页数
                pageCurent: 1,//当前页
                pageEach: 10,//每页分几条数据
                startDate:'',
                endDate:'',
                countData:[],
                togle:0,
            },
            created: function () {
                var myDate = new Date();
                var eY = myDate.getFullYear();
                var eM = myDate.getMonth() + 1;
                var eD = myDate.getDate();

                var sDate = new Date(myDate.setDate(myDate.getDate() - 30));
                var sY = sDate.getFullYear();
                var sM = sDate.getMonth() + 1;
                var sD = sDate.getDate();
                var dateFn = this.dateFn

                var start = sY + "-" + dateFn(sM) + "-" + dateFn(sD)
                var end = eY + "-" + dateFn(eM) + "-" + dateFn(eD)
                this.startDate = start
                this.endDate = end
                $('input[name=startDate]').val(start)
                document.getElementById("startDate").value=start;
                document.getElementById("endDate").value=end
                this.pageFn(1)
            },
            methods: {
                dateFn: function (txt) {
                    var n = txt > 9 ? txt : '0' + txt;
                    return n
                },
                //分页请求 查询数据
                pageFn: function (pageCurent) {
                    var that = this;
                    var page = (pageCurent - 1) * that.pageEach;
                    that.pageCurent = pageCurent;
                    var cashSatus = this.cashSatus == -1 ? '' : this.cashSatus;
                    console.log(document.getElementById("startDate").value)
                    var startDate = document.getElementById("startDate").value;
                    var endDate = document.getElementById("endDate").value;

                    axios({
                        method: "POST",
                        url: "https://www.aftdc.com/aftdcAControl/Finance/cash_list",
                        data: {
                            page: page,
                            cashSatus: cashSatus,//0待处理1已处理
                            startDate: startDate,
                            endDate: endDate,
                            adminNum:adminData.adminNum,
                            token:adminData.token
                        },
                    }).then(function (res) {
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
                countFn: function (index) {
                    var countData = this.listData[index];
                    countData.countIndex = index;
                    this.countData = countData;
                    this.togle = 1;
                },
                addWord:function () {
                    var that=this
                    axios({
                        method: "post",
                        url: "/aftdcacontrol/Finance/withdraw",
                        data: {
                            adminNum:adminData.adminNum,
                            cashId:that.countData.cashId,
                            token:adminData.token
                        }
                    }).then(function (res) {
                        if(res.data.res==1){
                            alert('处理成功！')
                            location.reload();
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