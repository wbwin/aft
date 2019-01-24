window.onload = function () {
    var shopData = JSON.parse(localStorage.getItem('shopData'));
    if (!shopData) {
        location.href = "/business/Login/index.html";
    } else {
        var evaluate = new Vue({
            el: "#desk",
            data: {
                deskArr: [],
                newAddTogle: false, //1新增弹出框,2查看

                date: '', //时间
                timeData: [],
                start: "09:00",
                end: "22:00",
                sexIndex: 0, //1为男，2为女

                pageNumb: 0, //总页数
                pageCurent: 1, //当前页
                pagelist: 10, //每一页显示数据条数

                togle: 0, //1为日期,2为选择小时分钟

                deskIndex: false, //新增座位，存储桌位号
                //新增座位的信息
                addData: {
                    userPhone: '',
                    userName: '',
                    sex: "",
                    deskId: "",
                    remark: "",
                    reachTime: "",
                    baojian: "",
                    nums: '',

                },
                modalTogle: 0, //提示框
                modalTxt: '提示信息', //提示信息
                modalIndex: -1, //操作索引


            },
            created: function () {
                var that = this
                axios({
                    method: "post",
                    url: "/Business/Canteen/getDesk",
                    data: {token: shopData.token},
                }).then(function (res) {
                    console.log(res);
                    that.deskArr = res.data.data.desks;
                    that.start = res.data.data.shop.serviceStartTime
                    that.end = res.data.data.shop.serviceEndTime
                    if (res.data.res == -1) {
                        alert(res.data.reason)
                        localStorage.removeItem('shopData');
                        location.href = "/business/Login/index.html";
                    }else if(res.data.res == -1){
                        alert(res.data.reason)
                        localStorage.removeItem('shopData');
                        location.href="/business/Login/index.html";
                    }

//             //初始化页数
//             var pageCount = Number(res.data.data.desks.length);
// console.log(pageCount);
//             var pageNumb = Math.ceil(pageCount / that.pagelist)
//             that.pageNumb = pageNumb

                })


                // $.ajax({
                //     url:'/index.php/Business/Act/getDesk',
                //     data:{
                //         page:0,
                //         pagelist:that.pagelist
                //     },
                //     type:'post',
                //     success:function(res)
                //     {
                //         if(res){
                //             that.deskArr=res.deskArr
                //             var pageCount=res.count;
                //             var pageNumb=Math.ceil(pageCount/that.pagelist)
                //             that.pageNumb=pageNumb
                //         }
                //     }
                // })
            },
            methods: {
                delDesk: function (id) {
                    axios({
                        method: "post",
                        url: '/Business/Canteen/delDesk',
                        data: {
                            id: id,
                            token:shopData.token
                        },
                    }).then(function (res) {
                        if (res.res == 'success') {
                            alert('删除成功')
                            location.reload()
                        }else if(res.data.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href="/business/Login/index.html";
                        }
                        else {
                            alert('删除失败')
                        }
                    })

                },
                down: function (id) {
                    var url = '/Business/Canteen/downloadCodeImg'
                    var form = $("<form method='post'></form>");
                    form.attr({"action": url});

                    var input = $("<input type='hidden'>");
                    input.attr({"name": "id"});
                    input.val(id);

                    form.append(input);

                    form.submit();
                },

                timeFn: function () {
                    this.togle = 2;
                    var date = this.date + " 00:00:00"
                    date = date.replace(/-/g, '/');
                    var myDate = new Date();
                    var newDataY = myDate.getFullYear(),
                        newDataO = myDate.getMonth() + 1,
                        newDataD = myDate.getDate();


                    var dat2 = newDataY + "/" + newDataO + "/" + newDataD + " 00:00:00";

                    dat2 = new Date(dat2);
                    var dat = new Date(date);
                    var diff = dat2 - dat;
                    if (diff >= 0) {
                        var newDataH = myDate.getHours(),
                            newDataM = myDate.getMinutes();
                        var sd = newDataH + ":" + newDataM
                        this.timeDataFn(sd);

                    } else {
                        this.timeDataFn();
                    }


                },
                timeDataFn: function (start) {
                    var that = this;
                    if (!Boolean(start)) {
                        start = that.start;
                    }
                    var end = that.end
                    var myDate = new Date();
                    var newDataY = myDate.getFullYear(),
                        newDataO = myDate.getMonth() + 1,
                        newDataD = myDate.getDate();

                    var h = parseInt(start.split(":")[0]);
                    var m = parseInt(start.split(":")[1]);
                    m = m > 30 || m == 0 ? "00" : "30"
                    start = h + ":" + m
                    console.log(start)
                    console.log(end)
                    var dats = newDataY + "/" + newDataO + "/" + newDataD + " " + start + ":00";
                    var daten = newDataY + "/" + newDataO + "/" + newDataD + " " + end + ":00";
                    dats = new Date(dats)
                    daten = new Date(daten)

                    var minutes = 0
                    var arrays = [];

                    for (var i = 0; i < 50; i++) {
                        minutes = 30 * i
                        var interTimes = minutes * 60 * 1000;
                        interTimes = parseInt(interTimes);
                        var data = new Date(Date.parse(dats) + interTimes);
                        // var daten = new Date(Date.parse(daten) + interTimes);

                        console.log(data);
                        console.log(daten);
                        var diff = data - daten;
                        console.log(diff);
                        if (diff > 0) {
                            break
                        }
                        var minute = data.getMinutes()
                        var hour = data.getHours()
    console.log(hour);
                        var tim = (hour > 9 ? hour : '0' + hour) + ":" + (minute > 9 ? minute : '0' + minute);
                        arrays.push(tim)
                    }
                    this.timeData = arrays;

                },
                changeTime: function (index) {
                    var time = this.timeData[index];
                    this.date = this.date + " " + time;
                    this.togle = 0;
                    console.log(this.date);
                },

                //弹出框的操作
                modalFn: function (index, show) {
                    var that = this
                    that.modalIndex = index; //操作索引
                    that.modalTogle = show; //提示框
                    var state = that.deskArr[index].yuDing;

                    switch (show) {
                        case 1:
                            if (state == -1) {
                                that.modalTxt = '确认删除该桌位？' //提示信息
                            } else {
                                that.modalTxt = '该座位已有预订单，确认删除该桌位？' //提示信息
                            }

                            break;
                        case 2:
                            that.modalTxt = '确认清除该桌位信息？' //提示信息
                            break;
                    }


                },
                modalSure: function () {
                    var that = this
                    var index = that.modalIndex;
                    var show = that.modalTogle;


                    switch (show) {
                        case 1:
                            that.closeDesk(index); //删除座位
                            break;
                        case 2:
                            that.clearDesk(index); //清台


                            break;
                    }
                    this.modalTogle = false; //提示框
                },

                // 删除桌位
                closeDesk: function (index) {
                    var that = this
                    var deskNum = that.deskArr[index].deskNum;

                    axios({
                        method: "post",
                        url: "/Business/Canteen/deleteDesk",
                        data: {
                            deskId: deskNum,
                            token: shopData.token
                        },
                    }).then(function (res) {

                        if (res.data.res == 1) {
                            that.deskArr.splice(index, 1)
                            alert("删除成功")
                            location.reload();
                        }else if(res.data.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href="/business/Login/index.html";
                        }
                        else {
                            alert('出错啦!')
                            return false;
                        }
                    })

                },
                //清台
                clearDesk: function (index) {
                    var deskNum = this.deskArr[index].deskNum;
                    var that = this;
                    axios({
                        method: "post",
                        url: "/Business/Canteen/clearDesk",
                        data: {
                            deskNum: deskNum,
                            token: shopData.token
                        },
                    }).then(function (res) {
                        if (res.data.res == 1) {
                            that.deskArr[index].yuDing = -1;
                            alert("清台成功")
                            location.reload();
                        }else if(res.data.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href="/business/Login/index.html";
                        }
                    })

                },


                //弹出新增桌位
                addShow: function (num) {
                    this.deskIndex = num;
                    this.addData = {
                        userPhone: '',
                        userName: '',
                        sex: "",
                        deskId: "",
                        remark: "",
                        reachTime: "",
                        baojian: "",
                        nums: '',
                    };
                    this.newAddTogle = 1;
                },

                //确定新增桌位
                addDesk: function () {
                    var that = this;
                    var addData = this.addData
                    var index = this.deskIndex;
                    var deskArr = this.deskArr;
                    var deskType = deskArr[index].deskType;
                    addData.deskId = deskArr[index].deskNum; //座位号
                    addData.baojian = deskType
                    var date = this.date;
console.log(date.length );
                    if (date.length < 11) {
                        alert("请选择正确时间")
                        return false
                    }
                    addData.reachTime = this.date;

                    for (var i in addData) {
                        if (!Boolean(addData[i]) && i != "remark") {
                            alert("请填写完善")
                            return false
                        }
                    }
                    addData.baojian = addData.baojian == "散台" ? 0 : 1;
                    var phone = addData.userPhone
                    if (!(/^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9])|(17[0-9]))\d{8}$/.test(phone))) {
                        alert("手机号不正确")
                        return false
                    }
                    axios({
                        method: "post",
                        url: "https://www.aftdc.com/Business/Canteen/canteenAddOrder",
                        data: addData,token: shopData.token
                    }).then(function (res) {
                        console.log(res);
                        if (Boolean(res)) {
                            that.newAddTogle = false;

                            that.deskArr[index].yuDing = res.YuDing;

                            that.addData = {
                                userPhone: '',
                                userName: '',
                                sex: "",
                                deskId: "",
                                remark: "",
                                reachTime: "",
                                baojian: "",
                                nums: '',
                            };
                            alert("添加成功")
                            location.reload();
                        }else if(res.data.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href="/business/Login/index.html";
                        }
                    })


                },
                //查看桌位
                seeDesk: function (index) {

                    var deskArr = this.deskArr;
                    var yuDing = deskArr[index].yuDing
                    console.log(deskArr);
                    if (yuDing != -1 && Boolean(yuDing)) {
                        this.newAddTogle = 2;
                        this.addData = deskArr[index].yuDing;
                        this.date = deskArr[index].yuDing.reachTime;

                    }
                },
                //编辑桌位
                editFn: function (index) {
                    var desk = this.deskArr[index];
                    var data = {};
                    data.deskName = desk.deskName;
                    data.deskPersonNum = desk.deskPersonNum;
                    data.deskNum = desk.deskNum;
                    data.deskType = desk.deskType; //类型
                    data.id = desk.id; //类型
                    data = JSON.stringify(data)
                    window.localStorage.setItem("desk", data); //存入缓存
                    location.href = '/business/Canteen//ActAddDesk.html';
                    console.log(data)
                },


                //------------------------分页跳转------------------------------------
                pageClick: function (index) {
                    var that = this
                    var pageNumb = that.pageNumb
                    console.log(index)
                    var page = index * that.pagelist - that.pagelist
                    axios({
                        method: "post",
                        url: '/Business/Canteen/getDesk',
                        data: {
                            page: page,
                            pagelist: that.pagelist,
                            token: shopData.token
                        },
                    }).then(function (res) {
                        if (res.data.res == 1) {
                            that.deskArr = res.data.data.desks;
                            that.start = res.data.data.shop.serviceStartTime
                            that.end = res.data.data.shop.serviceEndTime
                        }else if(res.data.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href="/business/Login/index.html";
                        }
                    })

                    this.pageCurent = index
                },
                pageSub: function () {
                    if (this.pageCurent == 1) {
                        return false
                    }
                    this.pageCurent--
                    var that = this
                    var pageNumb = that.pageNumb
                    var page = that.pageCurent * that.pagelist - that.pagelist
                    axios({
                        method: "post",
                        url: '/Business/Canteen/getDesk',
                        data: {
                            page: page,
                            pagelist: that.pagelist,
                            token: shopData.token
                        },
                    }).then(function (res) {
                        if (res.data.res == 1) {
                            that.deskArr = res.data.data.desks;
                            that.start = res.data.data.shop.serviceStartTime
                            that.end = res.data.data.shop.serviceEndTime
                        }else if(res.data.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href="/business/Login/index.html";
                        }
                    })


                },
                pageAdd: function () {
                    if (this.pageCurent == this.pageNumb) {
                        return false
                    }
                    this.pageCurent++
                    var that = this
                    var pageNumb = that.pageNumb
                    var page = that.pageCurent * that.pagelist - that.pagelist
                    axios({
                        method: "post",
                        url: '/Business/Canteen/getDesk',
                        data: {
                            page: page,
                            pagelist: that.pagelist,
                            token: shopData.token
                        },

                    }).then(function (res) {
                        if (res.data.res == 1) {
                            that.deskArr = res.data.data.desks;
                            that.start = res.data.data.shop.serviceStartTime
                            that.end = res.data.data.shop.serviceEndTime
                        }else if(res.data.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href="/business/Login/index.html";
                        }

                    })


                },
            },
            updated: function () {
                $("#date").dateSelect(evaluate);
            }
        })
    }
}

