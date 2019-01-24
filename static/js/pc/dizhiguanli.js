window.onload = function () {
    $.ajax({
        url: 'https://www.aftdc.com/pc/Index/wx_message',
        type:'post',
        async:false,
        data:{},
        success:function(res){
            if (res.res == 1) {
                var dataz = res.data.users
                var data = JSON.stringify(dataz);
                var storage = window.localStorage;
                storage.removeItem('admin')
                storage.setItem("admin", data);

            }
        }
    })
    var admin = JSON.parse(localStorage.getItem('admin'));
    if (!admin) {
        var test = window.location.href;
        var storage = window.localStorage;
        storage.removeItem('jumpUrl')
        storage.setItem("jumpUrl", test);
        console.log(test)
        location.href = "/pc/login.html";

    } else {
        var app = new Vue({
            el: '#app',
            data: {
                dataz: '',
                datazf: {},
                addrData: {},
                latitude: '',//纬度
                longitude: '',//经度
                userId: '',
                new: true,
                geographic:'',
                address:false,
            },
            created: function () {
                var that = this
                that.userId = admin.userId;
                that.geographic = window.localStorage.getItem("geographic");
                axios({
                    method: "post",
                    url: "/pc/Order/getAddress",
                    data: {
                        userId: that.userId,
                        shopId:'642'
                    }
                }).then(function (res) {
                    if (res.data.res == 1) {
                        that.dataz = res.data.data;
                        that.latitude = res.data.data.latitude;
                        that.longitude = res.data.data.longitude;
                    }
                    console.log(res)
                })

            },
            methods: {
                addressInput: function () {
                    var that = this;
                    that.address=false;
                    $(".city-scrollbar").show()
                    var keyword = that.datazf.address;
                    if (keyword.length > 0) {
                        $.ajax({
                            type: "get",
                            url: "https://apis.map.qq.com/ws/place/v1/suggestion/?keyword=" + keyword + "&key=AQMBZ-L4FCO-4VNWY-S5SGC-BNSG7-ALBIS&output=jsonp",
                            dataType: 'JSONP',
                            success: function (res) {
                                that.addrData = res.data

                            }
                        });
                    } else {
                        that.addrData = []
                    }
                },
                laytplAddress: function (item) {
                    var that = this
                    that.address=true,
                    that.datazf.address = item.title;
                    that.datazf.detailed = item.address;
                    that.latitude = item.location.lat;
                    that.longitude = item.location.lng;
                    $(".city-scrollbar").hide()
                },
                comin: function (event) {
                    $(event.currentTarget).css('border', '1px solid #1e89e0');
                    $(event.currentTarget).find('.xg').css('color', '#1e89e0');
                    $(event.currentTarget).find('.delete').css('color', '#1e89e0');
                },
                diout: function (event) {
                    $(event.currentTarget).css('border', '1px solid #ddd');
                    $(event.currentTarget).find('.xg').css('color', '#999');
                    $(event.currentTarget).find('.delete').css('color', '#999');
                },
                jinru: function () {
                    $('.add_price').css({"border": " 1px solid #1e89e0", "color": "#1e89e0"});
                },
                yichu: function () {
                    $('.add_price').css({"border": " 1px solid #ddd", "color": "#999"});
                },
                addin: function () {
                    $('#gengduo').css({"background": "#1e89e0", "color": "#fff"});
                },
                addout: function () {
                    $('#gengduo').css({"background": "#fff", "color": "#1e89e0"});
                },
                deletein: function () {
                    $('#guhuadelete').css({"background": "red", "color": "#fff"});
                },
                deleteout: function () {
                    $('#guhuadelete').css({"background": "#fff", "color": "red"});
                },
                gengduoClick: function () {
                    $('.thisguhua').show();
                    $('#gengduo').hide();
                    $('.biankuan').css('width', '300px');
                },
                guhuadeleteClick: function () {
                    $('.thisguhua').hide();
                    $('#gengduo').show();
                    $('.biankuan').css('width', '190px');
                },

                add_xgClick: function (item) {
                    var that = this
                    $('.open_yincang').show();

                    if (item) {
                        that.new = true;

                        $('.bianji').css('display', 'inline-block');
                        $('.tianadd').css('display', 'none');
                        that.datazf = item;
                        var datazf = that.datazf;
                        if (datazf.userSex == 1) {
                            $("input:radio[value='1']").attr("checked", true);
                            $("input:radio[value='1']").click();
                            console.log(1)
                        } else if (datazf.userSex == 2) {
                            console.log(2)

                            $("input:radio[value='2']").attr("checked", true);
                            $("input:radio[value='2']").click();
                        }
                    } else {
                        that.new = false;
                        console.log(that.new)
                        that.datazf = {
                            address: "",
                            addressId: '',
                            detailed: "",
                            userName: "",
                            userPhone: "",
                        }
                        that.latitude = '';
                        that.longitude = '';
                        $("input:radio[value='1']").attr("checked", false);
                        $("input:radio[value='2']").attr("checked", false);
                    }

                },
                baocunClick: function () {
                    var that = this
                    var userSex = $('input[name="1"]:checked').val();
                    if(that.address==false){
                        alert('请输入位置信息并在下拉框中选择！');
                        return false
                    }
                    if (that.new == true) {
                        var type = 1;
                    } else {
                        var type = 0;
                    }
                    if (!that.datazf.userName || !that.datazf.userPhone || !that.datazf.userPhone || !that.datazf.detailed || !that.datazf.address) {
                        alert('请填写完整！');
                        return false;
                    }
                    if (!userSex) {
                        alert('请选择性别昵称！');
                        return false;
                    }
                    if (!/^1[3|4|5|8]\d{9}$/.test(that.datazf.userPhone)) {
                        alert('请填写正确的手机号码！');
                        return false;
                    }

                    axios({
                        method: "post",
                        url: "/pc/Order/userAddress",
                        data: {
                            userPhone: that.datazf.userPhone,
                            latitude: that.latitude,
                            longitude: that.longitude,
                            userName: that.datazf.userName,
                            detailed: that.datazf.detailed,
                            address: that.datazf.address,
                            type: type,
                            aid: that.datazf.addressId,
                            userId: that.userId,
                            userSex: userSex,
                        }
                    }).then(function (res) {
                        if (res.data.res == 1) {
                            alert('操作成功！');
                            location.reload();
                        } else {
                            alert('操作失败！');
                        }
                    })
                },

                tui_outClick: function () {
                    $('.open_yincang').hide();
                },
                quxiaoClick: function () {
                    $('.open_yincang').hide();
                },
                deleteClick: function (event) {
                    $(event.currentTarget).parent().parent().parent().find('.dontyingy').show()

                },
                zhiquxiaoClick: function () {
                    $('.dontyingy').hide();
                },
                zhiqiedingClick: function (item) {
                    var that = this
                    var addressId = item.addressId;
                    axios({
                        method: "post",
                        url: "/pc/Order/delAddress",
                        data: {
                            addressId:addressId,
                        }
                    }).then(function (res) {
                        if (res.data.res == 1) {
                            alert('删除成功！');
                            location.reload();
                        }

                    })
                },
                addressclick:function () {
                    location.href = "/pc/home.html"
                },
            },
        })
    }
}