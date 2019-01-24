window.onload = function(){
    var adminData = JSON.parse(localStorage.getItem('adminData'));
    if(!adminData){
        location.href="../Login/login.html";
    }else {
        //时间
        $('#queryDate').daterangepicker({format: 'YYYY-MM-DD', separator: ' -- '});
        var newdiv = document.createElement("div");
        // var newtext=document.createTextNode("A new div");
        // newdiv.appendChild(newtext) ;
        document.body.appendChild(newdiv)
        var app = new Vue({
            el: "#app",
            data: {
                listData: [],
                shopName: "",
                time: "",

                pageNumb: 0,//总页数
                pageCurent: 1,//当前页
                pageEach: 10,//每页分几条数据

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
                this.time = start + "  -- " + end
                // --
                this.pageFn(1);
                window.localStorage.removeItem("goodsId");
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

                    var time = this.time;
                    time = time.replace(/\s/g, "");
                    var timeArr = time.split("--");//去除空格
                    var startDate = timeArr[0];
                    var endDate = timeArr[1];

                    axios({
                        method: "POST",
                        url: "https://www.aftdc.com/aftdcAControl/Statistics/goods_list",
                        data: {
                            page: page,
                            shopName: that.shopName,
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
                goodsSee: function (id) {
                    window.localStorage.setItem("goodsId", id);
                    window.location.href = "forbid.html"
                }

            }
        })
    }
}