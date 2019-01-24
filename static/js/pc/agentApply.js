window.onload = function () {
    $.ajax({
        url: 'https://www.aftdc.com/pc/Index/wx_message',
        type: '#body',
        async: false,
        data: {},
        success: function (res) {
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
    var url = location.search;
    var phone = url.substr(1);
    phone = phone.replace('phone=', '');
    if (!admin) {
        var test = window.location.href;
        var storage = window.localStorage;
        storage.removeItem('jumpUrl')
        storage.setItem("jumpUrl", test);
        console.log(test)
        location.href = "/pc/login.html";
    } else if (phone==''){
        // location.href='/pc/agent.html'
    }else {
        var app = new Vue({
            el: '.agent',
            data: {
                fileFt: '',
                fileSd: '',
                phone: '',
                companyName: '',
                companyTime: '',
                companyAddress: '',
                name: '',
                idCard: '',
                province: provinceList,//所有地区
                city: '',//筛选后的城市
                county: '',//筛选后的县区
                placeIndex: {provinceIndex: '', cityIndex: '', countyIndex: ''},
                placeVal: '',//选择完城市后的内容
                toggle: 1,
            },
            created: function () {
                var that = this;
                that.phone = phone;

            },
            methods: {
                bodyClick: function () {
                    $('.place').hide()
                },
                stopClick: function (event) {
                    event.stopPropagation();
                },
                inputFocus: function (event) {
                    var e = event.target;
                    $(e).parent().parent().parent().addClass('is_error');
                    if ($(e).val() == '') {
                        $(e).parent().parent().find('.group-item_error').css({'display': 'block'})
                    }
                },
                inputBlur: function (event) {
                    var e = event.target;
                    if ($(e).val() != '') {
                        $(e).parent().parent().parent().removeClass('is_error');
                    }
                },
                inputInput: function (event) {
                    var e = event.target;
                    if ($(e).val() == '') {
                        $(e).parent().parent().find('.group-item_error').css({'display': 'block'})
                    } else {
                        $(e).parent().parent().find('.group-item_error').css({'display': 'none'})
                    }
                },
                buttonFtClick: function () {
                    $('#fileFt').click();
                },
                buttonSdClick: function () {
                    $('#fileSd').click();
                },
                fileChange: function (index, event) {
                    var that = this
                    if (index == 1) {
                        $('#ftImg').show();
                        var fil = event.target.files[0];
                        console.log(fil);
                        var reader = new FileReader();
                        reader.readAsDataURL(fil);
                        reader.onload = function () {
                            that.fileFt = reader.result;
                        }

                    }
                    if (index == 0) {
                        $('#sdImg').show();
                        var fil = event.target.files[0];
                        console.log(fil);
                        var reader = new FileReader();
                        reader.readAsDataURL(fil);
                        reader.onload = function () {
                            that.fileSd = reader.result;
                        }
                    }
                    var houzui = '.' + fil.name.split(".")[1];
                    console.log(that.phone)
                    axios({
                        method: "post",
                        url: "/pc/League/img_city",
                        data: {
                            type: index,
                            houzui: houzui,
                            phone: that.phone,
                            userId: admin.userId,
                        }
                    }).then(function (res) {
                        console.log(res)
                        var imgurl = res.data.oss.host + '/' + res.data.name;//图片的路径
                        var formData = new FormData();
                        formData.append("key", res.data.name);
                        formData.append("policy", res.data.oss.policy);
                        formData.append("OSSAccessKeyId", res.data.oss.accessid);
                        formData.append("success_action_status", '200');
                        formData.append("signature", res.data.oss.signature);
                        formData.append("file", fil);
                        axios({
                            method: "post",
                            url: res.data.oss.host,
                            data: formData,
                            processData: false,
                            contentType: false,
                        }).then(function (res) {
                            axios({
                                method: "post",
                                url: "/pc/League/oneself_upload",
                                data: {
                                    type: index,
                                    file: imgurl,
                                }
                            }).then(function (res) {
                                console.log(res)
                                if (index == 1) {
                                    if (res.data.res == 1) {
                                        that.companyName = res.data[2];
                                        that.companyTime = res.data[6];
                                        that.companyAddress = res.data[3];
                                    }
                                    if (res.data.res == 0) {
                                        alert('营业执照错误，请重新上传清晰的营业执照！')
                                        return false
                                    }
                                }
                                if (index == 0) {
                                    if (res.data.res == 1) {
                                        that.name = res.data[2];
                                        that.idCard = res.data[5];

                                    }
                                    if (res.data.res == 0) {
                                        alert('身份证错误，请重新上传清晰的身份证照片！')
                                        return false
                                    }
                                }

                            })
                        })
                    })
                },
                placeClick: function () {
                    var that = this
                    that.toggle = 1
                    $('.place').show()
                },

                provinceClick: function (index) {
                    var that = this;
                    that.placeIndex.provinceIndex = index
                    that.city = that.province[index].cityList;
                    that.toggle = 2;
                    $('#province').hide()
                    $('#city').show()

                },
                cityClick: function (index) {
                    var that = this;
                    that.placeIndex.cityIndex = index
                    that.county = that.province[that.placeIndex.provinceIndex].cityList[index].areaList;
                    that.toggle = 3
                    $('#city').hide()
                    $('#county').show()
                },
                countyClick: function (index, event) {
                    var that = this
                    var e = event.target;
                    that.placeIndex.countyIndex = index
                    that.placeVal = that.province[that.placeIndex.provinceIndex].name + '-' + that.city[that.placeIndex.cityIndex].name + '-' + that.county[index];
                    that.toggle = 1
                    $(e).parent().parent().parent().parent().parent().removeClass('is_error');
                    $('.place').hide()
                },
                submintClick: function () {
                    var that = this
                    var company = that.companyName;
                    var address = that.companyAddress;
                    var time = that.companyTime;
                    var scale = $('input[name=scale]').val();
                    var money = $('input[name=money]').val();
                    var operation = $('input[name=operation]').val();
                    var city = that.placeVal;
                    var cityScale = $('input[name=cityScale]').val();
                    var experience = $('input[name=experience]:checked').val();
                    var realize = $('input[name=realize]:checked').val();
                    var name = that.name;
                    var phone = that.phone;
                    var email = $('input[name=email]').val();
                    var identity = that.idCard;
                    var pattern_email = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
                    if (!company || !address || !time || !scale || !money || !operation || !city || !cityScale || !experience || !realize || !name || !phone || !email || !identity) {
                        alert('请把带有红色星号的信息填写完整！');
                        return false;
                    }
                    if (pattern_email.test(email) != true) {
                        alert('电子邮件格式错误!');
                        return false;
                    }
                    var arr = {
                        company: company,
                        address: address,
                        time: time,
                        scale: scale,
                        money: money,
                        operation: operation,
                        city: city,
                        cityScale: cityScale,
                        experience: experience,
                        realize: realize,
                        name: name,
                        phone: phone,
                        email: email,
                        identity: identity,
                    }
                    axios({
                        method: "post",
                        url: "/pc/League/insert_city",
                        data: {
                            arr: JSON.stringify(arr),
                            userId: admin.userId,
                        }
                    }).then(function (res) {
                        if (res.data.res == 1) {
                            alert('提交成功,点击跳转到首页！');
                            location.href = '/pc/index.html'
                        }
                    })
                },
            },
        })
    }
}