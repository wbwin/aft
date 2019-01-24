window.onload = function () {
    var shopData = JSON.parse(localStorage.getItem('shopData'));
    if (!shopData) {
        location.href = "/business/Login/index.html";
    } else {

        var app = new Vue({
            el: '#body',
            data: {
                dataz: {},
                userPhoto: {},
                time: '',
                shopId: '',
                id: '',
            },
            created: function () {
                var that = this;
                var url = location.search;
                var userId = url.substr(1);
                userId = userId.replace('userId=', '');
                axios({
                    method: "post",
                    url: 'https://www.aftdc.com/business/Fans/fans_message',
                    data: {
                        userId: userId,
                        token: shopData.token
                    },
                }).then(function (res) {
                    if (res.data.res == -1) {
                        alert(res.data.reason)
                        localStorage.removeItem('shopData');
                        location.href = "/business/Login/index.html";
                    }
                    var dataz = res.data.data.msg;
                    that.userPhoto = res.data.data.userPhoto;
                    for (var i = 0; i < dataz.length; i++) {
                        var timestamp = res.data.data.msg[i].timestamp;
                        var time = that.timeStamp2String(timestamp);
                        dataz[i].time = time;
                    }
                    that.dataz = dataz
                })
            },
            methods: {
                timeStamp2String: function (time) {
                    var datetime = new Date();
                    datetime.setTime(time);
                    var year = datetime.getFullYear();
                    var month = datetime.getMonth() + 1;
                    var date = datetime.getDate();
                    var hour = datetime.getHours();
                    var minute = datetime.getMinutes();
                    var second = datetime.getSeconds();

                    return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
                },
                cinHaoClick: function () {
                    // 点击 【错号】消失 隐藏框
                    $(".Onkaungt").hide();
                },
                quxiaoClick: function () { // 点击 【取消】消失 隐藏框
                    $(".Onkaungt").hide();

                },
                hiuucinClick: function (item) {
                    var that = this;
                    $(".Onkaungt").show();
                    that.id = item.id
                },
                quedinClick: function () {
                    var that = this;
                    var id = that.id; // 获取要【回复】的ID
                    var shopId = $('input[name="shopId"]').val();
                    var replay = $(".wenban").val(); // 点击回复消息中的内容
                    axios({
                        method: "post",
                        url: 'https://www.aftdc.com/business/Fans/replay', //  、请求回复消息的路径
                        data: {
                            id: id, // 【 还未获取到00000000000000000  [还没循环]】
                            shopId: shopId,
                            replay: replay,
                            token: shopData.token
                        },
                    }).then(function (res) {
                        if (res.data.res = 1) {
                            alert('回复成功！')
                            window.location.reload()

                        }
                        else if (res.data.res == -1) {
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href = "/business/Login/index.html";
                        }

                        else {
                            alert('回复失败！')
                            return false
                        }
                    })
                },
                ReuHaoClick: function () { // 点击  【错号关闭】
                    $(".SanKuan").hide();
                },
                AunClick: function () { // 点击  【取消】
                    $(".SanKuan").hide();
                },
                ZoneClick: function (item) { // [灰色] 置顶   [添加 置顶]

                    var state = 1;
                    var id = item.id;
                    var shopId = $('input[name=shopId]').val();
                    console.log(id);
                    axios({
                        method: "post",
                        url: 'https://www.aftdc.com/business/Fans/leavewordState',
                        data: {
                            state: state,
                            id: id,
                            shopId: shopId,
                            token: shopData.token
                        },
                    }).then(function (res) {
                        console.log(res)
                        if (res.data.res = 1) {
                            window.location.reload()
                        }
                        else if (res.data.res == -1) {
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href = "/business/Login/index.html";
                        }

                        else {
                            alert('置顶失败')
                            return false
                        }
                    })
                },
                ZtwoClick: function (item) { // [蓝色] 置顶   [取消 置顶]
                    var state = 0;
                    var id = item.id;
                    var shopId = $('input[name=shopId]').val();
                    console.log(id);
                    axios({
                        method: "post",
                        url: 'https://www.aftdc.com/business/Fans/leavewordState',
                        data: {
                            state: state,
                            id: id,
                            shopId: shopId,
                            token: shopData.token
                        }
                    }).then(function (res) {
                        console.log(res)
                        if (res.data.res = 1) {
                            window.location.reload()
                        }
                        else if (res.data.res == -1) {
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href = "/business/Login/index.html";
                        }else {
                            alert('取消置顶失败')
                            return false
                        }
                    })
                },
                StwoClick: function (item) { // 点击黄色【星星】
                    var state = 0;
                    var id = item.id;
                    var shopId = $('input[name=shopId]').val();
                    console.log(id);
                    axios({
                        method: "post",
                        url: 'https://www.aftdc.com/business/Fans/leavewordState',
                        data: {state: state, id: id, shopId: shopId, token: shopData.token},
                    }).then(function (res) {
                        if (res.data.res = 1) {
                            window.location.reload()
                        }
                        else if (res.data.res == -1) {
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href = "/business/Login/index.html";
                        }
                        else {
                            alert('取消精选失败')
                            return false
                        }
                    })
                },
                deleteClick: function (item) {
                    // 删除 的详情内容
                    $(".SanKuan").show(); // 弹框弹出
                    $(".NongDer").text("是否确定要删除?");
                    var state = 3;
                    var id = item.id; // 获取要删除的ID
                    var shopId = $('input[name=shopId]').val();
                    console.log(id);
                    $(".Cun").click(function () { // 点击确定
                        axios({
                            method: "post",
                            url: 'https://www.aftdc.com/business/Fans/leavewordState',
                            data: {
                                id: id,
                                state: state,
                                shopId: shopId,
                                token: shopData.token
                            },
                        }).then(function (res) {
                            if (res.data.res = 1) {
                                window.location.reload()
                            }
                            else if (res.data.res == -1) {
                                alert(res.data.reason)
                                localStorage.removeItem('shopData');
                                location.href = "/business/Login/index.html";
                            }

                            else {
                                alert('删除失败！')
                                return false
                            }
                            ;
                        })

                        $(".SanKuan").hide(); // 点击完成之后 影藏弹框
                    });
                },
                backClick: function () {
                    history.back();
                },
                SoneClick: function (item) {
                    // 点击灰色【星星】
                    var state = 2;
                    var id = item.id;
                    var shopId = $('input[name=shopId]').val();
                    console.log(id);
                    axios({
                        method: "post",
                        url: 'https://www.aftdc.com/business/Fans/leavewordState',
                        data: {state: state, id: id, shopId: shopId, token: shopData.token},
                    }).then(function (res) {
                        if (res.data.res = 1) {
                            window.location.reload()
                        }
                        else if (res.data.res == -1) {
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href = "/business/Login/index.html";
                        }

                        else {
                            alert('精选设置失败')
                            return false
                        }
                    })
                },
            }
        })
    }
}