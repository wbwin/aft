window.onload = function() {
    var shopData = JSON.parse(localStorage.getItem('shopData'));
    if (!shopData) {
        location.href = "/business/Login/index.html";
    } else {
        var app = new Vue({
            el: "#Huod",
            data: {
                goodsData: [], //所有菜
                goodsSet: [], //选择的菜
                totalPrice: '',
                imgBox: [],
                imgFile: [], // 全局变量 图片路径
            },

            created: function () {
                var lihtml = '';
                var goodsData = [];
                var that = this
                axios({
                    method: "post",
                    url: 'https://www.aftdc.com/Business/Activity/Tuan',
                    data: {
                        token:shopData.token,
                    },
                }).then(function (res) {
                    if(res.data.res == -1){
                        alert(res.data.reason)
                        localStorage.removeItem('shopData');
                        location.href="/business/Login/index.html";
                    }
                    var data = res.data.data.food
                    var fleng = data.length
                    for (var i = 0; i < fleng; i++) {
                        var child = data[i].child
                        if (child && child.length > 0) {
                            var cleng = child.length;
                            for (var j = 0; j < cleng; j++) {
                                child[j].num = 1
                                goodsData.push(child[j])
                            }
                        }
                    }

                    that.goodsData = goodsData;
                })
            },
            methods: {
                goodsSelect: function (index) {
                    var goodsData = this.goodsData;
                    var goodsSet = this.goodsSet;
                    var obj = new Object(goodsData[index])
                    var state = goodsSet.indexOf(obj);
                    var totalPrice = this.totalPrice;
                    if (state < 0) {
                        goodsSet.push(obj);
                        if (!Boolean(totalPrice)) {
                            totalPrice = 0
                        }
                        totalPrice = parseInt(totalPrice * 100) / 100 + parseInt(obj.shopPrice * 100) / 100
                        totalPrice = totalPrice.toFixed(2)
                    }
                    this.totalPrice = totalPrice
                    this.goodsSet = goodsSet;
                },
                add: function ($event, goodsId) {
                    var leng = this.goodsData.length
                    var that = this
                    for (var z = 0; z < leng; z++) {
                        if (this.goodsData[z].goodsId == goodsId) {
                            that.goodsData[z].num++
                            this.totalPrice = parseInt(this.totalPrice * 100) / 100 + parseInt(that.goodsData[z].shopPrice * 100) / 100
                        }
                    }
                },
                dec: function ($event, goodsId) {
                    var leng = this.goodsData.length
                    var that = this
                    for (var z = 0; z < leng; z++) {
                        if (this.goodsData[z].goodsId == goodsId) {
                            if (this.goodsData[z].num <= 1) {
                                alert("数量不可以少于0")
                                return false;
                            }
                            that.goodsData[z].num--
                            this.totalPrice = parseInt(this.totalPrice * 100) / 100 - parseInt(that.goodsData[z].shopPrice * 100) / 100
                        }
                    }
                },
                closeGoods: function (index, goodsId) {
                    var leng = this.goodsData.length
                    var that = this
                    for (var z = 0; z < leng; z++) {
                        if (this.goodsData[z].goodsId == goodsId) {
                            this.totalPrice = parseInt(this.totalPrice * 100) / 100 - parseInt(that.goodsData[z].shopPrice * that.goodsData[z].num * 100) / 100
                            this.goodsSet.splice(index, 1)
                            that.goodsData[z].num = 1
                        }
                    }
                },
                tooltipsClick: function () {
                    $(".SiondUin").show();
                },
                DinDerClick: function () {
                    $(".SiondUin").hide();
                },
                goods: function () {
                    $(".goods").slideToggle();
                },
                xcsDikClick: function () { // 点击 【+】
                    $("#inpfile").click();

                },
                getImg: function () { // 当 上传文件发生改变时
                    var imgBox = this.imgBox;
                    var imgFile = this.imgFile;
                    var fileList = $("#inpfile")[0].files; //获取地址

                    if (($("#inpfile")[0].files.size) >= (2 * 1024 * 1024)) {

                        alert("请上传小于2M的图片");
                        return false;
                    }
                    imgFile.push(fileList)

                    var imgUrl = window.URL.createObjectURL($("#inpfile")[0].files[0]); // 图片 转换路径
                    imgBox.push(imgUrl);
                    var imgHtml = ''
                    var len = imgBox.length; // 定义一个变量
                    if (len > 1) { // 判断 大于3张 时候 删除第一张
                        imgBox.splice(0, 1) // 判断 大于1张 时候 删除第一张
                    }
                    for (var i = 0; i < imgBox.length; i++) {
                        var val = " <img class='imge' style='margin-right: 14px' src=" + imgBox[i] + " height='70' width='70'>"
                        imgHtml = imgHtml + val
                    }
                    $("#numberimgert").html(imgBox.length); //  获取图片的长度  把 长度的值 传入 上传图片的个数
                    $('.imhon').html(imgHtml); // 把图传入 class 为  imhon 的DIV 中
                },
                TyesClick: function () {
                    var imgBox = this.imgBox;
                    var Lzhi = $("input[name=startTime]").val(); // 活动日期 【左】
                    var Rzhi = $("input[name=endTime]").val(); // 活动日期 【右】
                    var groupName = $('input[name=groupName]').val(); //团购名称
                    var shopPrice = $('input[name=shopPrice]').val(); //商品原价
                    var marketPrice = $('input[name=marketPrice]').val(); //团购总价
                    var groupDes = $('textarea[name=groupDes]').val(); //活动描述
                    var Umage = imgBox;
                    var cewko = $("#zuoend").is(':checked'); //  已阅读并同意
                    var goodsSet = app.goodsSet //选择的团购菜品
                    var date = new Date(Lzhi);
                    var dateE = new Date(Rzhi);
                    var dateSt = date.getTime();//开始时间时间戳
                    var dateEt = dateE.getTime();//结束时间时间戳

                    if (dateSt >=dateEt) {
                        alert('开始时间不能大于结束时间！');
                        return false;
                    }
                    if (goodsSet.length < 2) {
                        alert('选择菜品需要两个以上')
                        return false;
                    }
                    if (groupName.length > 10) {
                        alert('团购名称不能大于10个字')
                        return false;
                    }
                    if (this.imgFile.length == "") {
                        alert('请上传图片')
                        return false;
                    }
                    if (!Lzhi || !Rzhi || !shopPrice || !marketPrice || !groupDes || goodsSet.length == 0 || !groupName) {
                        alert('请填写完整')
                        return false;
                    }
                    if (!cewko) {
                        alert('请阅读商家自营销协议')
                        return false;
                    }
                    goodsSet = JSON.stringify(goodsSet);
                    axios({
                        method: "post",
                        url: 'https://www.aftdc.com/Business/Activity/argainTuan',
                        data: {
                            groupName: groupName,
                            startTime: Lzhi,
                            endTime: Rzhi,
                            shopPrice: shopPrice,
                            marketPrice: marketPrice,
                            groupDes: groupDes,
                            goodsSet: goodsSet,//[{"goodsId":456,"num":10},{"goodsId":486,"num":9}]
                            token:shopData.token,
                        },
                    }).then(function (res) {
                        if(res.data.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href="/business/Login/index.html";
                        }
                        if (res.data.isDisable == 1) {
                            alert('含有非法字段')
                            return false;
                        }
                        if (res.data.res == -3) {
                            alert('团购总价"不能大于"团购原价')
                            return false;
                        }
                        if (res.data.res == 3) {
                            alert('已存在同标题的团购活动')
                            return false
                        }
                        if (res.data.res == 1) {

                            this.imgFile = $("#inpfile")[0].files;
                            var imgFile = this.imgFile
                            var houzui = imgFile[0].name.split(".")[1]
                            var groupId = res.data.groupId

                            var file = imgFile[0]

                            axios({
                                method: "post",
                                url: "https://www.aftdc.com/Business/Activity/frameUpload1",
                                data: {
                                    houzui: houzui,
                                    token:shopData.token,
                                },
                            }).then(function (res) {
                                if(res.data.res == -1){
                                    alert(res.data.reason)
                                    localStorage.removeItem('shopData');
                                    location.href="/business/Login/index.html";
                                }
                                var imgurl = res.data.imgName//图片的路径
                                // console.log(imgurl);
                                var formData = new FormData();
                                formData.append("key", res.data.dir + '/' + res.data.imgName);
                                formData.append("policy", res.data.policy);
                                formData.append("OSSAccessKeyId", res.data.accessid);
                                formData.append("success_action_status", '200');
                                formData.append("signature", res.data.signature);
                                formData.append("file", file);
                                formData.append("token", shopData.token);
                                axios({
                                    method: "post",
                                    url: res.data.host,
                                    data: formData,
                                    processData: false,
                                    contentType: false,
                                }).then(function (res) {
                                    axios({
                                        method: "post",
                                        url: "https://www.aftdc.com/Business/Activity/frameUpload2",
                                        data: {
                                            imgName: imgurl,
                                            groupId: groupId,
                                            token:shopData.token,
                                        }
                                    }).then(function (res) {
                                        if(res.data.res == -1){
                                            alert(res.data.reason)
                                            localStorage.removeItem('shopData');
                                            location.href="/business/Login/index.html";
                                        }

                                    })
                                })
                            })
                            // if(Umage.length>0)
                            //   {

                            //     for (var i = 0; i < imgFile.length; i++) {
                            //         //上传图片
                            //         var Umage = imgBox; //  获取  所有的 图片
                            //         var formData = new FormData();
                            //         formData.append("file", imgFile[i]);
                            //         formData.append("groupId", res.data.groupId);
                            //     var houzui = imgFile
                            //     console.log(imgFile);
                            //     axios({
                            //             method: "post",
                            //             url: 'https://www.aftdc.com/Business/Activity/frameUpload1',
                            //             data: formData,
                            //             // 告诉jQuery不要去处理发送的数据
                            //             processData: false,
                            //             // 告诉jQuery不要去设置Content-Type请求头
                            //             contentType: false,
                            //         }).then(function (data) {
                            //             if (data = 1) {
                            //                 alert('活动添加成功！')
                            //                 window.location.reload()
                            //             } else {
                            //                 alert('添加活动失败！')
                            //                 return false
                            //             }
                            //         })
                            //     }
                            //
                            //     // }
                            // } else {
                            //     alert('活动添加失败...')
                            //     return false
                        }

                    })
                }
            },
            mounted: function () {
                $("#zuotext").dateSelect();
                $("#csdevwe").dateSelect();
            }
        })
    }
}