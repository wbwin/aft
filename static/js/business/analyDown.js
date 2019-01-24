window.onload = function () {
    var shopData = JSON.parse(localStorage.getItem('shopData'));
    if (!shopData) {
        location.href = "/business/Login/index.html";
    } else {
        var evaluate = new Vue({
            el: '#analyDown',
            data: {
                surfaceData: ['订单编号', '下单时间', '店铺名称', '店铺id', '店铺所在城市', '订单支付类型', '订单状态', '订单总金额', '菜品信息', '配送费', '是否催单', '订单完成时间', '订单取消原因（仅取消订单）',],

                time: {start: '', end: '', name: ''}, //时间
                start:'',
                end:'',
                href:'',

                timeCheck: [
                    {txt: '每天发送上一天全部店铺报表', check: false},
                    {txt: '每周发送上一周全部店铺报表', check: false},
                ],
                checkId: [],
                token:'',
            },
            created:function () {
                var that=this
                that.token= shopData.token;
            },

            methods: {
                downBut: function () {
                    var that=this
                    // that.start = $('input[name=date]').val()
                    // that.end =  $('input[name=dateN]').val()
                    // that.href='https://www.aftdc.com/Business/Analy/expUser?date='+that.start+'&dateN='+that.end;

                },

                check: function () {
                    var timeCheck = this.timeCheck;
                    if ($("#tian").prop("checked")) {
                        var checkId = 1
                    } else if ($("#zhou").prop("checked")) {
                        var checkId = 2
                    } else if ($("#tian").prop("checked") && $("#zhou").prop("checked")) {
                        var checkId = 3
                    } else {
                        var checkId = 0;
                    }

                    // var checkId = this.checkId;
                    // $('input[name=checkBox]:checked').each(function() {
                    //     checkId.push($(this).val())
                    // });
                    console.log($("#tian").prop("checked"))

                    var excelemail = $("#excelemail").val();
                    if (excelemail == '') {
                        alert("请输入邮箱");
                        return;
                    }
                    var pattern_email = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
                    if (pattern_email.test(excelemail) != true) {
                        alert("邮箱格式有误！");
                        return;
                    }
                    if (checkId == 0) {
                        alert("设置失败！必须选择一个选项。");
                    } else {


                        axios({
                            method: "post",
                            url: "https://www.aftdc.com/Business/Analy/Excelemail",
                            data: {
                                excelemail: excelemail,
                                checkId: checkId,
                                token: shopData.token
                            },
                        }).then(function (res) {
                            console.log(res);
                            if (res.data.res == 1) {
                                alert("设置成功！");
                                location.reload();
                            }
                            else if (res.data.res == -1) {
                                alert(res.data.reason)
                                localStorage.removeItem('shopData');
                                location.href = "/business/Login/index.html";
                            }

                            else {
                                alert("设置失败！必须选择一个选项。");
                                //alert(data);
                            }
                        })
                    }
                }

            },
            mounted: function () {
                $("#date").dateSelect();
                $("#dateN").dateSelect();

            }
        })
    }
}