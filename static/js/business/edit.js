window.onload = function () {
    var shopData = JSON.parse(localStorage.getItem('shopData'));
    if (!shopData) {
        location.href = "/business/Login/index.html";
    } else {


        var eait = new Vue({
            el: "#eait",
            data: {
                goods: {
                    classify: '',
                    name: '',
                    img: '',
                    spec: [{
                        id: '',
                        price: '',
                        stock: '',
                        boxPrice: '',
                        boxNumb: '',
                        guigeName: '',
                    }],
                    feature: {sign: true, set: false}, //特色  sign->招牌  set->套餐
                    attrs: [
                        // {name:'味道'}
                    ],
                    unit: '份',
                    min: '',
                    time: '自定义时间',
                    shopPrice: '',
                    // describe: "酿皮是流行于中国西北地区的一种传统特色美食，绵软润滑、酸辣可口、爽口开胃，本店的酿皮原材料均来自宁夏回族自治区，纯手工制作，蒸出来的酿皮子爽滑劲道，配上鲜香酸辣的酱汁，搭配面筋、豆芽、胡萝卜丝、黄瓜丝一起凉拌，吃起来凉爽利口，喷香解暑，拯救你没食欲的胃。"
                    describe: '',
                },

                // classData: { togle: false, sele: ['超值双人套餐', '特色主打', '主菜类', '主食类'], keeps: [], active: '', search: '' },
                classData: {togle: false, sele: ['暂无分类'], keeps: [], active: '', search: ''},
                featureNumb: '', //套餐适用人数
                //属性提示框
                attrTips: {
                    togle: false,
                    choice: [
                        {name: '特辣', active: false},
                        {name: '麻辣', active: false},
                        {name: '中辣', active: false},
                        {name: '微辣', active: false},
                        {name: '不辣', active: false},
                    ],
                    styles: {top: 0, left: 0},
                    index: -1,
                },
                attrInput: [''],

                weeks: [{name: '一', check: true}, {name: '二', check: true}, {name: '三', check: true}, {
                    name: '四',
                    check: true
                }, {name: '五', check: true}, {name: '六', check: true}, {name: '日', check: true}],
                timeData: [{state: '', end: ''}],
                keepTime: '',
                timeStyle: {top: 0, left: 0,},
                timeBox: {addsub: {h: 0, m: 0}, popName: '', popIndex: '', box: false,}, //弹出选择时间盒子的数据


                errTips: {state: false, txt: '起始时间填写不正确，请确保起始时间小于结束时间'}, //控制错误弹窗
                hoverTips: {state: false, txt: '提示一下咯', styles: {top: 0, left: 0}}, //控制鼠标经过样式

                tipsTxt: ['最小的购买量', '这就是提示信息la'],
                file: '', //保存图片资源信息

                imgData: [], //素材图片选择框
                showImgData: [], //显示的图片
                //分页
                pageNumb: 0, //总页数
                pageCurent: 1, //当前页
                page: 10, //每页分几条数据

                imgMode: 1, //选择上传方式

                togleImg: 0, //上传图片显示隐藏
                stockRadio: 1, //库存选择
                goodsId: '',
                dataz: '',
                state: false,
                cats: '',
                imgFile: '',
                bb: '',
                imgChange: '0'//判断图片是否更改


            },
            created: function () {

                var that = this;
                var foodst = window.localStorage.getItem("foodst");
                var dataCat = window.localStorage.getItem("dataCat");
                console.log(foodst);
                console.log(dataCat);
                if (foodst != null) {
                    foodst = JSON.parse(foodst);
                    dataCat = JSON.parse(dataCat);
                    window.localStorage.removeItem("foodst");
                    window.localStorage.removeItem("dataCat");
                    that.state = true;


                    that.cats = dataCat;
                    console.log(that.cats);
                    console.log(foodst);

                    that.goods.spec = []
                    that.goods.img = ''
                    var classData = that.classData
                    classData.sele = foodst;


                    classData['keeps'] = foodst; //保存的全部分类
                    that.classData = classData
                }
                var url = location.search;
                var goodsId = url.substr(1);
                goodsId = goodsId.replace('goodsId=', '')
                that.goodsId = goodsId


                if (that.state == false) {

                    axios({
                        method: "post",
                        url: 'https://www.aftdc.com/Business/Goods/getGoodsInfo',
                        data: {
                            goodsId: goodsId,
                            token: shopData.token
                        },
                    }).then(function (res) {
                        if (res.data.res == -1) {
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href = "/business/Login/index.html";
                        }
                        console.log(res);
                        var goods = that.goods
                        that.dataz = res.data.data
                        that.cats = res.data.data.cats
                        console.log(that.cats)
                        goods.classify = res.data.data.classify;
                        console.log(goods.classify);
                        that.catId = res.data.data.catId;
                        goods.name = res.data.data.goodsName

                        if (res.data.data.goodsImg) {
                            goods.img = '/' + res.data.data.goodsImg
                        } else {
                            goods.img = ''
                        }

                        goods.unit = res.data.data.goodsUnit
                        goods.describe = res.data.data.goodsDesc
                        if (res.data.data.spec) {
                            goods.spec = res.data.data.spec
                        } else {
                            goods.spec = []
                        }


                        if (res.data.data.taste.attrName) {
                            // goods.attrs[0].name=res.taste.attrName
                            var taste = []
                            for (var i = 0; i < res.data.data.taste.taste.length; i++) {
                                taste.push(res.data.data.taste.taste[i]['name'])
                            }
                            console.log('ta', taste)
                            //  goods.attrs[0].choice=taste
                            var atAr = [{name: res.data.data.taste.attrName, choice: taste}]
                            goods.attrs = atAr
                        }
                        goods.boxFee = res.data.data.boxFee;
                        goods.goodsStock = res.data.data.goodsStock;
                        that.goods = goods

                        var catArr = []
                        for (var i = 0; i < res.data.data.cats.length; i++) {
                            catArr.push(res.data.data.cats[i].catName)
                        }
                        var classData = that.classData
                        classData.sele = catArr;

                        var len = catArr.length;
                        var txt = res.data.data.classify
                        for (var i = 0; i < len; i++) {
                            var query = catArr[i].indexOf(txt);
                            if (query >= 0) {
                                classData['active'] = catArr[i];
                                break
                            }
                        }
                        classData['keeps'] = catArr; //保存的全部分类
                        that.classData = classData

                        if (goods.goodsStock == -1) {
                            that.stockRadio = -1
                        }
                    })
                }
                axios({
                    method: "post",
                    url: 'https://www.aftdc.com/Business/Goods/material',
                    data: {
                        token: shopData.token
                    },
                }).then(function (res) {
                    console.log(res);
                    if (res.data.res == 1) {
                        that.imgData = res.data.data;
                        var page = that.page;
                        that.pageNumb = Math.ceil(res.data.data.length / page); //总页数
                        console.log(that.pageNumb)
                        that.pageClick(1)
                    } else if (res.data.res == -1) {
                        alert(res.data.reason)
                        localStorage.removeItem('shopData');
                        location.href = "/business/Login/index.html";
                    }
                })


            },
            methods: {
                togleFn: function (index) {
                    if (index == 0) {
                        this.togleImg = 0;
                    } else if (index == this.togleImg) {
                        this.togleImg = 0;
                    } else {
                        this.togleImg = index;
                    }

                },
                saveGoods: function () {
                    var that = this
                    var file = that.file; //图片
                    var fileType = typeof(file);
                    var fileImg = $('.imgClass').attr('src');
                    console.log(fileImg)
                    var goods = that.goods;
                    var goodsId = $('input[name=goodsId]').val();
                    var shopPrice = $('input[name=shopPrice]').val(); //价格
                    // var marketPrice=$('input[name=marketPrice]').val();//原价
                    var name = $('input[name=name]').val(); //名称
                    //  var zhenze = /^([0-9][0-9]*)+(.[0-9]{1,2})?$/;

                    var numb = /^[0-9]+([.]{1}[0-9]+){0,1}$/;

                    var distribution = $('input[name=distribution]').val(); //餐盒费
                    var goodsStock = $('input[name=goodsStock]').val(); //库存
                    var Stock = $("input[type='radio']:checked").val(); //无限库存
                    var goodsUnit = $('input[name=goodsUnit]').val(); //单位
                    var spec = goods.spec;
                    var attrs=goods.attrs;

                    if (Stock == -1) {//库存选择无限时
                        goodsStock = -1;
                        var lenspe = spec.length;
                        for (let i = 0; i < lenspe; i++) {
                            spec[i].stock = -1
                        }
                    } else {
                        if (spec != '') {
                            var lenspe = spec.length;
                            goodsStock = 0;
                            for (var i = 0; i < lenspe; i++) {
                                goodsStock = Number(goodsStock) + Number(spec[i].stock)
                            }
                        }
                    }
                    //有规格时
                    if (spec != '') {
                        var lenspe = spec.length;
                        for (var i = 0; i < lenspe; i++) {
                            if (!spec[i].guigeName || !spec[i].price || !spec[i].stock) {
                                alert('请把规格填写完整！');
                                return false
                                break
                            }
                            if(!numb.test(spec[i].price)||!numb.test(spec[i].stock)){
                                alert('请输入正确的格式！');
                                return false
                                break
                            }
                        }
                    }
                    //有商品属性时
                    console.log(attrs)
                   if(attrs!=''){
                        if(!attrs[0].name||!attrs[0].choice){

                            alert('请把商品属性填写完整！');
                            return false
                        }

                   }
                    for(var j=0;j<spec.length-1;j++){
                        //两两比较，如果前一个比后一个大，则交换位置。
                        console.log(12)
                        for(var i=0;i<spec.length-1-j;i++){

                            if(Number(spec[i].price)>Number(spec[i+1].price)){

                                var temp = spec[i];
                                spec[i] = spec[i+1];
                                spec[i+1] = temp;
                            }
                        }
                    }
                    var goodsArr = {
                        catId: that.catId,
                        goodsName: goods.name,
                        spec: spec,
                        attrs: goods.attrs,
                        goodsDesc: goods.describe
                    }

                    if (shopPrice == '') {
                        alert('请填写商品价格')
                        return false
                    }

                    if (goodsId) {
                        if (!goods.name) {
                            alert('请填写完整')
                            return false
                        }
                        if (!fileImg) {
                            alert('请上传图片');
                            return false;
                        }
                    } else {
                        if (!goods.name || !shopPrice || !goodsStock || !distribution || !goodsUnit) {
                            alert('请填写完整')
                            return false
                        }
                        //       if (!zhenze.test(shopPrice) || !zhenze.test(distribution) && !zhenze.test(goodsStock)) {
                        // 	alert('请输入正确的格式');
                        // 	return false;
                        // }
                        // if (!/^[^.|0].*/.test(shopPrice) || !/^[^.].*/.test(distribution) && !/^[^.|0].*/.test(goodsStock)) {
                        // 	alert('请输入正确的格式');
                        // 	return false;
                        // }
                        if (!numb.test(shopPrice) || !numb.test(distribution) && !numb.test(goodsStock)) {
                            alert('请输入正确的格式');
                            return false;
                        }

                        if (file == '') {
                            alert('请上传图片');
                            return false;
                        }
                    }
                    var fileList = that.file; //获取地址
                    var img = ''
                    if (Boolean(fileList) && fileType == 'string') {
                        img = fileList;
                    } else if (that.file) {
                        if (((that.file.size).toFixed(2)) >= (2 * 1024 * 1024)) {
                            alert("请上传小于2M的图片");
                            return false;
                        }
                        var formData = new FormData();
                        formData.append("file", file);
                        formData.append("goodsId", goodsId);
                    }
                    if (that.imgChange == 1) { //如果有更换图片的时候
                        axios({
                            method: "post",
                            url: "https://www.aftdc.com/Business/Goods/catchHtml",
                            data: {
                                keyword: name,
                                token: shopData.token
                            }
                        }).then(function (res) {
                            console.log(res);
                            if (res.data.res == 1) {
                                // if (that.imgChange == 0) {
                                //     alert('数据已修改，图片未修改！');
                                //     top.location.reload();
                                // } else {
                                var calorie = res.data.data.calorie[0];
                                var file = that.file;
                                var houzui = file.name.split(".")[1]
                                axios({
                                    method: "post",
                                    url: 'https://www.aftdc.com/Business/Goods/get_upload1',
                                    data: {
                                        houzui: houzui,
                                        token: shopData.token
                                    },

                                }).then(function (res) {
                                    console.log(res);

                                    if (res.data.res == -1) {
                                        alert(res.data.reason)
                                        localStorage.removeItem('shopData');
                                        location.href = "/business/Login/index.html";
                                    }

                                    var imgurl = res.data.dir + '/' + res.data.imgName//图片的路径
                                    // console.log(imgurl);
                                    var formData = new FormData();
                                    formData.append("key", res.data.dir + '/' + res.data.imgName);
                                    formData.append("policy", res.data.policy);
                                    formData.append("OSSAccessKeyId", res.data.accessid);
                                    formData.append("success_action_status", '200');
                                    formData.append("signature", res.data.signature);
                                    formData.append("file", file);

                                    console.log(file);
                                    axios({
                                        method: "post",
                                        url: res.data.host,
                                        data: formData,
                                        processData: false,
                                        contentType: false,
                                        token: shopData.token
                                    }).then(function (res) {
                                        console.log(imgurl);

                                        if (res.data.res == -1) {
                                            alert(res.data.reason)
                                            localStorage.removeItem('shopData');
                                            location.href = "/business/Login/index.html";
                                        }

                                        axios({
                                            method: "post",
                                            url: "https://www.aftdc.com/Business/Goods/saveGoods",
                                            data: {
                                                goodsArr: JSON.stringify(goodsArr),
                                                goodsId: goodsId,
                                                price: shopPrice,
                                                distribution: distribution,
                                                marketPrice: shopPrice,
                                                goodsStock: goodsStock,
                                                Stock: Stock,
                                                goodsUnit: goodsUnit,
                                                calorie: calorie,
                                                img: imgurl,
                                                token: shopData.token
                                            },
                                        }).then(function (res) {
                                            console.log(res);
                                            if (res.data.res == 1) {
                                                alert('保存成功！');
                                                top.location.reload();
                                            } else if (res.data.res == 0) {
                                                alert('商品已存在！')
                                                return false
                                            }
                                            else if (res.data.res == -1) {
                                                alert(res.data.reason)
                                                localStorage.removeItem('shopData');
                                                location.href = "/business/Login/index.html";
                                            }

                                        })
                                    })
                                })
                            }
                            else if (res.data.res == -1) {
                                alert(res.data.reason)
                                localStorage.removeItem('shopData');
                                location.href = "/business/Login/index.html";
                            }

                            else {
                                alert('请输入正确的商品名称！')
                                return false;
                            }
                            // }
                        })
                    } else {
                        axios({
                            method: "post",
                            url: "https://www.aftdc.com/Business/Goods/catchHtml",
                            data: {
                                token: shopData.token,
                                keyword: name,
                            }
                        }).then(function (res) {
                            console.log(res);


                            if (res.data.res == 1) {
                                // if (that.imgChange == 0) {
                                //     alert('数据已修改，图片未修改！');
                                //     top.location.reload();
                                // } else {
                                var calorie = res.data.data.calorie[0];
                                var imgClass = $('.imgClass').attr('src');
                                var imgurl = imgClass.replace('https://image.aftdc.com//', '');
                                console.log(imgurl);
                                axios({
                                    method: "post",
                                    url: "https://www.aftdc.com/Business/Goods/saveGoods",
                                    data: {
                                        goodsArr: JSON.stringify(goodsArr),
                                        goodsId: goodsId,
                                        price: shopPrice,
                                        distribution: distribution,
                                        marketPrice: shopPrice,
                                        goodsStock: goodsStock,
                                        Stock: Stock,
                                        goodsUnit: goodsUnit,
                                        calorie: calorie,
                                        img: imgurl,
                                        token: shopData.token
                                    },
                                }).then(function (res) {
                                    console.log(res);
                                    if (res.data.res == 1) {
                                        alert('保存成功！');
                                        top.location.reload();
                                    } else if (res.data.res == 0) {
                                        alert('商品已存在！')
                                        return false
                                    }
                                    else if (res.data.res == -1) {
                                        alert(res.data.reason)
                                        localStorage.removeItem('shopData');
                                        location.href = "/business/Login/index.html";
                                    }


                                })
                            }
                            if (res.data.res == -1) {
                                alert(res.data.reason)
                                localStorage.removeItem('shopData');
                                location.href = "/business/Login/index.html";
                            }
                            else {
                                alert('请输入正确的商品名称！')
                                return false;
                            }
                            // }
                        })
                    }
                    // axios({
                    //     method: "post",
                    //     url: 'https://www.aftdc.com/Business/Goods/saveGoods',
                    //     data: {
                    //         goodsArr: JSON.stringify(goodsArr),
                    //         goodsId: goodsId,
                    //         shopPrice: shopPrice,
                    //         distribution: distribution,
                    //         marketPrice: shopPrice,
                    //         goodsStock: goodsStock,
                    //         Stock: Stock,
                    //         goodsUnit: goodsUnit,
                    //
                    //         // img: img, //选择的是素材图片
                    //     },
                    // }).then(function (res) {
                    //     // if (res.data.isDisable == 1) {
                    //     //     alert('含有非法字段')
                    //     //     return false;
                    //     // }
                    //     // if (res.data.code == 0) {
                    //     //     alert('已有此商品')
                    //     //     return false;
                    //     // }
                    //     if (res.data.res == 1) {
                    //
                    //         // axios({
                    //         //     method: "post",
                    //         //     url: "https://www.aftdc.com/Business/Goods/catchHtml",
                    //         //     data: {
                    //         //
                    //         //         keyword: name,
                    //         //     }
                    //         // }).then(function (res) {
                    //         //     console.log(res);
                    //         //     if (res.data.res == 1) {
                    //         //         if (that.imgChange == 0) {
                    //         //             alert('数据已修改，图片未修改！');
                    //         //             top.location.reload();
                    //         //         } else {
                    //         //             var calorie = res.data.data.calorie[0];
                    //         //             var file = that.file;
                    //         //             var houzui = file.name.split(".")[1]
                    //         //             axios({
                    //         //                 method: "post",
                    //         //                 url: 'https://www.aftdc.com/Business/Goods/get_upload1',
                    //         //                 data: {
                    //         //                     houzui: houzui
                    //         //                 },
                    //         //
                    //         //             }).then(function (res) {
                    //         //                 console.log(res);
                    //         //
                    //         //
                    //         //                 var imgurl = res.data.imgName//图片的路径
                    //         //                 // console.log(imgurl);
                    //         //                 var formData = new FormData();
                    //         //                 formData.append("key", res.data.dir + '/' + res.data.imgName);
                    //         //                 formData.append("policy", res.data.policy);
                    //         //                 formData.append("OSSAccessKeyId", res.data.accessid);
                    //         //                 formData.append("success_action_status", '200');
                    //         //                 formData.append("signature", res.data.signature);
                    //         //                 formData.append("file", file);
                    //         //
                    //         //                 console.log(file);
                    //         //                 axios({
                    //         //                     method: "post",
                    //         //                     url: res.data.host,
                    //         //                     data: formData,
                    //         //                     processData: false,
                    //         //                     contentType: false,
                    //         //
                    //         //                 }).then(function (res) {
                    //         //                     console.log(imgurl);
                    //         //                     axios({
                    //         //                         method: "post",
                    //         //                         url: "https://www.aftdc.com/Business/Goods/get_upload2",
                    //         //                         data: {
                    //         //                             calorie: calorie,
                    //         //                             goodsImg: imgurl,
                    //         //                             goodsId: goodsId,
                    //         //                         }
                    //         //                     }).then(function (res) {
                    //         //                         console.log(res);
                    //         //                         if (res.data.res == 1) {
                    //         //                             alert('修改成功！');
                    //         //                             top.location.reload();
                    //         //                         }
                    //         //                     })
                    //         //                 })
                    //         //             })
                    //         //         }
                    //         //     }
                    //         // })
                    //
                    //         // that.imgFile = that.goods.img;//含data:image/png;base64,的base64码
                    //         // var file=that.file;
                    //         // var houzui = file.name.split(".")[1]
                    //         // var imgHeader='data:image/'+houzui+';base64,'
                    //         //
                    //         // var imgFile=that.imgFile.replace(imgHeader,'');//base64码
                    //         //
                    //         //
                    //         //
                    //         // //access_token 需从后端获取，测试先写死
                    //         //
                    //         // var access_token = '24.51b4d1ad18b4941489cfb662069700b7.2592000.1525337313.282335-10371173';
                    //         //
                    //         // var url = 'https://aip.baidubce.com/rest/2.0/image-classify/v2/dish?access_token='+access_token
                    //         // var formData = new FormData();
                    //         // //把图片转成base64，测试先写死
                    //         // var imgBase64=imgFile
                    //         // formData.append("image",imgBase64);
                    //         // axios({
                    //         //     method: "post",
                    //         //     url: url,
                    //         //     data: formData,
                    //         //     changeOrigin: true,
                    //         //     // dataType: 'jsonp',
                    //         //     contentType: 'application/x-www-form-urlencoded'
                    //         // }).then(function(res){
                    //         //     // console.log(res.data)
                    //         //     // that.bb=res.data;
                    //         //     // console.log(that.bb);
                    //         // })
                    //
                    //         // that.imgFile = $("#imgId").src;
                    //         // var imgFile=that.imgFile
                    //         // var base64 = that.getBase64Image(imgFile);
                    //
                    //         // axios({
                    //         //     method: "post",
                    //         //     url: "https://aip.baidubce.com/rest/2.0/image-classify/v2/dish",
                    //         //     data: {
                    //         //         image:"",
                    //         //         filter_threshold:0.95,
                    //         //     }
                    //         // }).then(function (res) {
                    //         //    console.log(res);
                    //         // })
                    //         // console.log(that.imgFile);
                    //         // if (!Boolean(img) && file.length != 0) {
                    //         //     formData.append("goodsId", res);
                    //         //     axios({
                    //         //         method: "post",
                    //         //         url: 'https://www.aftdc.com/Business/Goods/get_upload',
                    //         //         data: formData,
                    //         //         // 告诉jQuery不要去处理发送的数据
                    //         //         processData: false,
                    //         //         // 告诉jQuery不要去设置Content-Type请求头
                    //         //         contentType: false,
                    //         //     }).then(function(responseStr) {
                    //         //     	console.log(responseStr)
                    //         //     	if (responseStr.error == true) {
                    //         //                 // alert(responseStr.info)
                    //         //                 alert("上传商品成功")
                    //         //                 window.location.reload();
                    //         //                 // window.parent.location.href="http://aftdc.com/index.php/Business/ShopSa/index#/shop";
                    //         //                 // top.location.reload();
                    //         //             } else {
                    //         //                 alert('图片保存失败')
                    //         //                 return false;
                    //         //             }
                    //         //     })
                    //         //
                    //         // } else if (Boolean(img)) {
                    //         //     alert("上传商品成功")
                    //         //     window.location.reload();
                    //         //     // window.parent.location.href="http://aftdc.com/index.php/Business/ShopSa/index#/shop";
                    //         //     // top.location.reload();
                    //         // } else {
                    //         //     alert('未修改图片其他已修改')
                    //         //     window.location.reload();
                    //         //     // window.parent.location.href="http://aftdc.com/index.php/Business/ShopSa/index#/shop";
                    //         //     // top.location.reload();
                    //         // }
                    //     }
                    // })

                },
                hide: function () {
                    this.classData.togle = false; //菜品分类
                    this.timeBox.box = false; //时间弹出框
                    this.attrTips.togle = false; //商品属性弹出框
                },

                classifySeleFn: function (index) {
                    this.goods.classify = this.classData['sele'][index];
                    var cats = this.cats
                    console.log(cats);
                    for (var i = 0; i < cats.length; i++) {
                        if (this.goods.classify == cats[i]['catName']) {
                            this.catId = cats[i]['catId'];
                        }
                    }
                    console.log(this.catId)
                    this.classData['active'] = this.classData['sele'][index];
                    this.classData['togle'] = false;
                },

                //查询分类
                searchFn: function () {
                    var txt = this.classData['search'];
                    var datas = this.classData.keeps;
                    if (txt.length > 0) {
                        var sele = []
                        var len = datas.length;
                        for (var i = 0; i < len; i++) {
                            var query = datas[i].indexOf(txt);
                            if (query >= 0) {

                                sele.push(datas[i])
                            }
                        }
                        this.classData.sele = sele
                    } else {
                        this.classData.sele = datas
                    }
                },
                //图片
                imgDelete: function () {
                    var that = this
                    that.goods.img = ''
                    that.file == ''
                },
                upImg: function (event) {
                    var that = this
                    var target = event.target
                    var fil = target.files[0];
                    that.goods.img = 1;
                    console.log(fil);
                    that.file = fil //保存图片资源
                    console.log(fil);
                    var reader = new FileReader();//转换成base64
                    reader.readAsDataURL(fil);

                    reader.onload = function () {

                        $('.imgClass').attr('src', reader.result);

                    };

                    that.togleImg = 0;
                    that.imgChange = 1;
                },
                imgChange: function (index) {
                    var showImgData = this.showImgData;
                    this.file = showImgData[index] //保存图片资源
                    this.goods.img = showImgData[index];
                    this.togleImg = 0;
                },

                // 添加规格
                specAdd: function (one) {

                    if (one == 1) {
                        // var obj = { id: '',guigeName:'', price: '', stock: '', boxPrice: '', boxNumb: '' };
                        var obj = {id: '', guigeName: '', price: '', stock: ''};
                        // var obj1 = { id: '',guigeName:'', price: '', stock: ''};
                        this.goods['spec'].push(obj);
                        // this.goods['spec'].push(obj1);
                    } else {
                        // var obj = { id: '',guigeName:'', price: '', stock: '', boxPrice: '', boxNumb: '' };
                        var obj = {id: '', guigeName: '', price: '', stock: ''};
                        var obj1 = {id: '', guigeName: '', price: '', stock: ''};
                        this.goods['spec'].push(obj);
                        this.goods['spec'].push(obj1);

                    }
                },
                specDelete: function (index) {
                    var that = this
                    if (that.goods['spec'].length <= 2) {
                        that.goods['spec'] = []
                    }
                    that.goods['spec'].splice(index, 1);
                },

                //特色
                featureFn: function (txt) {
                    this.goods['feature'][txt] = !this.goods['feature'][txt]
                },

                //商品属性
                attrFocus: function (event, index) {
                    //设置显示位置
                    var target = event.target;
                    var that = $(target).parent('label');
                    var w = $(that).innerWidth() / 3
                    var x = $(that).offset().left + w + 'px';
                    var y = $(that).offset().top + 40 + 'px';

                    var attrTips = this.attrTips
                    attrTips.togle = true;
                    attrTips.styles = {
                        top: y,
                        left: x,
                    };

                    //设置提示框已有样式
                    var attrs = this.goods.attrs[index].choice;
                    var len1 = attrs.length;
                    var choice = attrTips.choice;
                    var len2 = choice.length;
                    for (var j = 0; j < len2; j++) {
                        var name = choice[j].name
                        choice[j].active = false
                        for (var i = 0; i < len1; i++) {
                            var txt = attrs[i];
                            if (txt == name) {
                                choice[j].active = true;
                            }
                        }
                    }
                    ;
                    attrTips.choice = choice;
                    attrTips.index = index;
                    this.attrTips = attrTips
                },

                attrFn: function (index) {
                    var choice = this.attrTips.choice[index]
                    var active = choice.active;
                    if (!active) {
                        this.attrTips.choice[index].active = true;
                        var txt = choice.name;
                        var i = this.attrTips.index
                        //生成味道
                        // var obj={ name: '味道'}
                        // var obj={ name: '味道', choice: [],inputs:'' }
                        // this.goods.attrs.push(obj)
                        this.goods.attrs[i].name = '味道';
                        this.goods.attrs[i].choice.push(txt);
                    }
                },

                attrEnter: function (index) {
                    //var txt = this.attrInput[index];
                    var txt = this.goods.attrs[index].inputs
                    var attrs = this.goods.attrs[index].choice;
                    var len = attrs.length;
                    var adopt = true
                    for (var i = 0; i < len; i++) {
                        if (attrs[i] == txt) {
                            adopt = false;
                            break
                        }
                    }
                    if (adopt) {
                        this.goods.attrs[index].choice.push(txt);
                    }
                    this.goods.attrs[index].inputs = ''
                    //this.attrInput[index] = '';

                    this.attrSet(txt, 1) //设置提示框样式
                },
                ChoiceDetail: function (index, numb) {
                    var txt = this.goods.attrs[index].choice[numb]
                    this.goods.attrs[index].choice.splice(numb, 1);
                    this.attrSet(txt, 0)
                },

                attrSet: function (txt, state) {
                    //1为加
                    var val = state == 1 ? true : false;

                    var choice = this.attrTips.choice;
                    var len = choice.length;

                    for (var j = 0; j < len; j++) {
                        var name = choice[j].name
                        if (txt == name) {
                            choice[j].active = val;
                        }
                    }
                    ;

                    this.attrTips.choice = choice
                },

                attrDetele: function (index) {
                    this.goods.attrs.splice(index, 1);

                },
                attrAdd: function () {
                    var obj = {name: '', choice: [], inputs: ''}
                    this.goods.attrs.push(obj)
                },

                //时间 ----------------------------------

                timeFocus: function (name, index, event) {
                    var val = this.timeData[index][name];
                    var h, m
                    if (!val) {
                        h = '00'
                        m = '00'
                        var times = h + ':' + m
                        this.timeData[index][name] = times;

                    } else {
                        h = val.substring(0, val.indexOf(":"));
                        m = val.substring(val.indexOf(":") + 1);
                    }

                    var target = event.target;
                    var y = $(target).offset().top - 270 + 'px'; //250是 260弹出框的高度+ 10距离
                    var x = $(target).offset().left + 'px';

                    this.timeStyle = {top: y, left: x};
                    this.keepTime = this.timeData[index][name]

                    this.timeBox = {addsub: {h: h, m: m}, popName: name, popIndex: index, box: 1};

                },


                timeBlur: function (name, index) {
                    var val = this.timeData[index][name];
                    var adopt = false

                    var h = val.substring(0, val.indexOf(":"));

                    adopt = h.length == 2 ? true : false;

                    if (adopt)
                        adopt = !isNaN(Number(h));

                    //如果小时的格式正确 判断分钟
                    if (adopt) {
                        var m = val.substring(val.indexOf(":") + 1);
                        adopt = m.length == 2 ? true : false;
                        if (adopt)
                            adopt = !isNaN(Number(m));

                    }
                    if (!adopt) {
                        this.timeData[index][name] = this.keepTime
                    }
                },

                //加减时间段
                addTime: function () {
                    var timeData = this.timeData;
                    var len = timeData.length
                    for (var i = 0; i < len; i++) {
                        var state = timeData[i].state;
                        var stateH = state.split(":").join("");
                        var end = timeData[i].end;
                        var endH = end.split(":").join("");

                        var how = Boolean(parseInt(endH) < parseInt(stateH))

                        if (!Boolean(stateH) || !Boolean(endH) || how) {
                            this.errTipsFn();
                            return false
                        }
                    }


                    var obj = {state: '', end: ''};
                    this.timeData.push(obj);


                },
                deleteTime: function (index) {
                    this.timeData.splice(index, 1)
                },


                changeTime: function (txt, numb) {
                    var hmWhy = txt.indexOf('h');
                    var max = hmWhy < 0 ? 59 : 23

                    var timeBox = this.timeBox
                    var hm = parseInt(timeBox['addsub'][txt]);

                    if (numb == 0) {
                        hm--
                        if (hm < 0) {
                            hm = max
                        }
                    } else {
                        hm++
                        if (hm > max) {
                            hm = 0
                        }
                    }
                    ;
                    hm = hm > 9 ? hm : '0' + hm;
                    var name = timeBox.popName;
                    this.timeBox['addsub'][txt] = hm;

                    this.setTime(txt, hm); //设置时间


                },
                obtainHM: function (txt, numb) {
                    numb = numb > 9 ? numb : '0' + numb;
                    this.timeBox['addsub'][txt] = numb;
                    this.timeBox['box'] = false;
                    this.setTime(txt, numb);
                },
                setTime: function (txt, hm) {
                    var timeBox = this.timeBox;
                    var name = timeBox.popName;
                    var index = timeBox.popIndex;
                    var val = this.timeData[index][name];
                    var hmWhy = txt.indexOf('h');
                    if (hmWhy < 0) {
                        var h = val.substring(0, val.indexOf(":"));
                        var times = h + ':' + hm;
                    } else {
                        var m = val.substring(val.indexOf(":") + 1);
                        var times = hm + ':' + m;
                    }
                    this.timeData[index][name] = times;
                },

                //错误提示框
                errTipsFn: function () {
                    var that = this
                    that.errTips['state'] = true
                    var errTime = setInterval(function () {
                        that.errTips['state'] = false;
                        clearInterval(errTime)
                    }, 1500)
                },
                //鼠标经过提示框
                hoverTipsFn: function (event, index) {
                    var target = event.target;
                    var w = $(target).innerWidth()
                    var x = $(target).offset().left + w + 10 + 'px';
                    var y = $(target).offset().top + 6 + 'px';
                    this.hoverTips['state'] = true
                    this.hoverTips['txt'] = this.tipsTxt[index]
                    this.hoverTips['styles'] = {top: y, left: x}

                },
                hoverHide: function () {
                    this.hoverTips['state'] = false
                },

                //------------------------分页跳转------------------------------------
                pageClick: function (index) {
                    this.pageCurent = index;
                    var page = this.page; //每页分几条数据
                    var imgData = this.imgData;
                    var len = imgData.length;
                    var end = (index * page) > len ? len : index * page
                    this.showImgData = imgData.slice((index - 1) * page, end)
                },
                pageSub: function () {
                    if (this.pageCurent == 1) {
                        return false
                    }
                    var index = this.pageCurent
                    index = index - 1
                    this.pageClick(index)
                },
                pageAdd: function () {
                    if (this.pageCurent == this.pageNumb) {
                        return false
                    }
                    var index = this.pageCurent
                    index = index + 1
                    this.pageClick(index)
                },
                sameClick: function () {
                    $('.same').siblings().attr("checked", false);

                    $('.same').attr("checked", true);

                    if ($('.same').attr("class").indexOf('others') >= 0) {

                        $('.same').siblings('.txt').show();
                    } else {

                        $(".others").siblings('.txt').hide();
                    }
                },

                // getBase64Image:function (img) {
                //     var canvas = document.createElement("canvas");
                //     canvas.width = img.width;
                //     canvas.height = img.height;
                //     var ctx = canvas.getContext("2d");
                //     ctx.drawImage(img, 0, 0, img.width, img.height);
                //     var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
                //     var dataURL = canvas.toDataURL("image/" + ext);
                //     return dataURL;
                // }
                //

            },
            watch: {
                'classData.togle': function (val, oldVal) {
                    // console.log(val,oldVal)  val改变后的值，oldVal原来的值
                    if (!val) {
                        this.classData['search'] = "";
                        this.classData.sele = this.classData.keeps;
                    }
                }
            },
            mounted: function () {

            }

        })
    }


}