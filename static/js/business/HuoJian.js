window.onload = function () {
    var shopData = JSON.parse(localStorage.getItem('shopData'));
    if (!shopData) {
        location.href = "/business/Login/index.html";
    } else {
        var app = new Vue({
            el: "#reduce",
            data: {

                focuNub: 0,
                isOpen: '',
                csfull: '',
                csminus: '',
                dataz: {},
                // time: {start: '', end: '', name: ''},
            },
            created: function () {
                var myDate = new Date();
                var year = myDate.getFullYear()
                var month = myDate.getMonth() + 1;
                var day = myDate.getDate();
                month = month > 9 ? month : '0' + month;
                day = day > 9 ? day : '0' + day;
                var start = year + '-' + month + '-' + day
                console.log(start)
                $(".zuotext").attr("min", start);
                $(".csdevwe").attr("min", start);
                //
                // var days = myDate.setDate(myDate.getDate() + 7)
                // var dayss = new Date(days)
                // var yeare = dayss.getFullYear()
                // var monthe = dayss.getMonth() + 1;
                // var daye = dayss.getDate();
                // monthe = monthe > 9 ? monthe : '0' + monthe;
                // daye = daye > 9 ? daye : '0' + daye;
                //
                // var end = yeare + '-' + monthe + '-' + daye
                //
                // this.$set(this.time, 'start', start);
                // this.$set(this.time, 'end', end);
                var that = this;

                axios({
                    method: "post",
                    url: "https://www.aftdc.com/Business/Activity/Mj",
                    data: {
                        token: shopData.token,
                    }
                }).then(function (res) {
                    console.log(res);
                    if (res.data.res == 1) {
                        that.dataz = res.data.data;
                    } else if (res.data.res == -1) {
                        alert(res.data.reason)
                        localStorage.removeItem('shopData');
                        location.href = "/business/Login/index.html";
                    } else {
                        alert('获取数据出错！')
                        return false
                    }
                })
                // var show = $(".container")
                // var jian = location.href
                // var fullName = jian.split("?")[1].split("&")[0].split("=")[1]
                // var minusName = jian.split("?")[1].split("&")[1].split("=")[1]
                // var myDate = new Date();
                // var year = myDate.getFullYear();   //年
                // var month = myDate.getMonth() + 1;  // 月
                // var day = myDate.getDate();  // 日期
                // var full = fullName;//满 格式-->20,12 逗号隔开
                // var minus = minusName//减 5,2
                // this.csfull = fullName
                // this.csminus = minusName
                // if (full == 0 && minus == 0) {
                //     this.isOpen = false
                //     $(".btn").text('开启满减优惠')
                // } else {
                //     this.isOpen = true
                //     $(".btn").text('关闭满减优惠')
                // }
                // if (Boolean(full) && Boolean(minus)) {
                //     full = full.replace(/，/g, ',').split(",");
                //     minus = minus.replace(/，/g, ',').split(",");
                //     var reduceData = [];
                //     for (var i = 0; i < full.length; i++) {
                //         var obj = {m: full[i], j: minus[i]};
                //         reduceData.push(new Object(obj));
                //     }
                //     this.reduceData = reduceData
                // }
                //
                // $(document).keydown(function (event) {  // 点击 回车键 保存
                //     var keynum = event.keyCode;  //  获取回车键的 代码
                //     if (keynum == '13') {          // 判断 enter 键的码 是否 13
                //         $(".baocunz").click();
                //
                //     }
                // });
                //
                // month = month > 9 ? month : '0' + month; // 三目判断
                // day = day > 9 ? day : '0' + day;   // 三目判断
                //
                // var time = year + '-' + month + '-' + day;
                // $("#tdata").val(time)

            },

            methods: {
                isOpenClick: function () {
                    var btn = $(".btn")
                    if (this.isOpen == true) {
                        btn.text('开启满减优惠')
                    } else {
                        btn.text('关闭满减优惠')
                    }
                    this.isOpen = !this.isOpen
                },
                mjAdd: function (index) {
                    var that = this
                    var dataz = that.dataz;
                    if (dataz.length >= 3) {
                        alert("满减最多设置三个，请重新调整");
                        return false
                    }
                    var obj = {
                        endTime: "",
                        full: '',
                        id: '',
                        minus: '',
                        shopId: '',
                        startTime: "",
                        timestamp: '',
                    };
                    that.dataz.push(new Object(obj));

                },
                mjSub: function (item, index) {
                    var that = this;
                    var id = item.id

                    if (id == '') {
                        console.log(that.dataz)
                        that.dataz.splice(index, 1)
                        console.log(that.dataz)
                    }
                    else {
                        if (confirm('确定取消满' + item.full + '减' + item.minus + '的优惠？')) {
                            axios({
                                method: "post",
                                url: 'https://www.aftdc.com/Business/Activity/delMJ',// 去后台请求
                                data: {
                                    id: id,
                                    token: shopData.token,
                                },
                            }).then(function (res) {
                                if (res.data.res == 1) {
                                    location.reload()
                                } else if (res.data.res == -1) {
                                    alert(res.data.reason)
                                    localStorage.removeItem('shopData');
                                    location.href = "/business/Login/index.html";
                                } else {
                                    alert('删除失败！')
                                }
                            })
                        }
                    }
                },

                tonesFoucs: function (index) {
                    this.focuNub = index;
                    $(".tones").css('border', '1px solid #06c1ae');
                },
                ttwosFoucs: function (index) {
                    this.focuNub = index;
                    $(".ttwos").css('border', '1px solid #06c1ae');

                },
                tonesBlur: function () {
                    $(".tones").css('border', '1px solid #bababa');

                },
                ttwosBlur: function () {
                    $(".ttwos").css('border', '1px solid #bababa');
                },
                // change: function (obj, data) {
                //     console.log(1)
                //     var index = $(obj).attr("data-index")
                //     var that = this;
                //     // var obj = event.target
                //     // console.log($('#zuotext0').text())
                //     // console.log($('#zuotext0').val())
                //     if (data == false) {
                //         that.dataz[index].startTime = $(obj).val();
                //     } else {
                //         console.log(2);
                //         that.dataz[index].endTime = $(obj).val();
                //     }
                //
                // },
                submit: function () {
                    var Check = $("input[type='checkbox']").is(':checked');  //  获取选框 是否选中
                    if (!Check) {
                        alert('请阅读并同意商家自营销协议');
                        return false
                    }
                    // var show = $(".container")
                    //
                    // if (show.css('display') == 'block') {
                    //
                    //
                    //
                    //     var reduceData = this.reduceData;
                    //     var len = reduceData.length;
                    //     var full = '';
                    //     var minus = '';
                    //     for (let i = 0; i < len; i++) {
                    //         var m = parseInt(reduceData[i].m * 100) / 100;
                    //         var j = parseInt(reduceData[i].j * 100) / 100;
                    //         if (!Boolean(m) || !Boolean(j)) {
                    //             //没有写的跳过该次循环
                    //             continue
                    //         }
                    //         if (j > m) {
                    //             alert('减金额不可大于满金额，请重新调整');
                    //             return false
                    //         }
                    //         full = full + ',' + m;
                    //         minus = minus + ',' + j
                    //
                    //     }
                    //     full = full.replace(/(^\,*)|(\,*$)/g, "");
                    //     minus = minus.replace(/(^\,*)|(\,*$)/g, "");
                    //
                    //     if (!Boolean(full) || full.length < 1) {
                    //         alert("至少设置一个满减")
                    //         return false
                    //     }
                    // } else {
                    //     full = 0
                    //     minus = 0
                    //     window.parent.location.href = "https://aftdc.com/index.php/Business/ShopSa/index#/Huo/Dong";
                    //     top.location.reload();
                    // }
                    // //判斷和初始值是否相同
                    // if (full == this.csfull && minus == this.csminus) {
                    //     //返回上一頁
                    //     alert('保存成功');
                    //     window.parent.location.href = "https://aftdc.com/index.php/Business/ShopSa/index#/Huo/Dong";
                    //     top.location.reload();
                    // } else {

                    //Tones满 Ttwos减

                    var that = this
                    var dataz = that.dataz
                    for (var i = 0; i < that.dataz.length; i++) {

                        var date = new Date(dataz[i].startTime)
                        var dateE = new Date(dataz[i].endTime)
                        var dateSt = date.getTime();
                        var dateEt = dateE.getTime();

                        if (dateSt >= dateEt) {
                            alert('开始时间不能大于结束时间！');
                            return false;
                        }

                        if (!dataz[i].full || !dataz[i].minus || !dataz[i].startTime || !dataz[i].endTime) {
                            alert('请填写完整！');
                            return false;
                        }


                    }

                    axios({
                        method: "post",
                        url: 'https://www.aftdc.com/Business/Activity/editMj',// 去后台请求
                        data: {
                            clasData: JSON.stringify(dataz),
                            token: shopData.token,
                        },
                    }).then(function (res) {
                        console.log(res)
                        if (res.data.res == 1) {
                            alert('保存成功！');
                            location.reload();
                        } else if (res.data.res == -1) {
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href = "/business/Login/index.html";
                        } else if (res.data.res == 0) {
                            alert('活动重复！');
                            return false
                        } else {
                            alert('保存失败！')
                            return false;
                        }

                        // if (res.data.res == 3) {
                        //     alert('满减最多设置三个，请重新调整')
                        //     return false
                        // }
                        // else if (res.data.res == 5) {
                        //     alert('减金额不可大于满金额，请重新调整')
                        //     return false
                        // }
                        // else if (res.data.res == 6) {
                        //     alert('减金额不可大于满金额，请重新调整')
                        //     return false
                        // }
                        // else if (res.data.res == 7) {
                        //     alert('减金额不可大于满金额，请重新调整')
                        //     return false
                        // }
                        // else if (res.data.res == 0) {
                        //     alert('保存失败');
                        // }
                        // else if (res.data.res == 1) {
                        //     alert('保存成功');
                        //     window.parent.location.href = "https://aftdc.com/index.php/Business/ShopSa/index#/Huo/Dong";
                        //     top.location.reload();
                        // }
                        //
                    })
                    // }
                    that.dataz = dataz;

                },
                ConeylerClick: function () {// 点击 商家自营销协议 影藏框弹出
                    $(".allUender").show();
                },
                dckAwsClick: function () {
                    $(".allUender").hide();
                },
                lastzuo: function () {
                    $(".thedSan").show();
                },
                lastyou: function () {
                    $(".thedSan").hide();
                },


            },
            updated: function () {
                var that = this
                // $('#date').dateSelect();
                // /*DOM更新了*/
                // console.log(that.dataz.length)
                // for (var i = 0; i < that.dataz.length; i++) {
                //
                //     var e = '#zuotext' + i;
                //     var a = '#csdevwe' + i;
                //
                //     $(e).dateSelect();
                //     $(a).dateSelect();
                //
                //
                //
                // }


            },
            filters: {
                Number: function (value) {
                    if (!value) return ''
                    value = value.replace(/[^0-9,]/g, '')
                    return value
                },
            },


        })

        // for (var i = 0; i < app.dataz.length; i++) {

        // var e = '#zuotext'+i;
        // var a = '#csdevwe'+i;


        // }
    }
}


