window.onload = function() {
    var shopData = JSON.parse(localStorage.getItem('shopData'));
    if (!shopData) {
        location.href = "/business/Login/index.html";
    } else {


        var app = new Vue({
            el: "#shop",
            data: {
                getGoods: [],
                langIndex: 0,
                kuiBut: {txt: ['新建商品'], selt: 0},

                foods: [], //所有商品
                foodSelt: 0,
                goodSelt: 0,

                //商品状态分类
                filters: [],
                filterSelt: 0,

                stockNum: 0,

                sumFood: [], //查询的菜，没分页前的数据
                //当前页面显示菜
                currentFood: [{
                    goodsId: "53",
                    goodsName: "黄焖排骨（大）+青菜+米饭",
                    goodsImg: "/tsg.png",
                    marketPrice: "30.00",
                    numb: 0,
                    shopPrice: "28.00",
                    zan: 0, //赞
                    sell: 0, //月售
                    size: [], //规格
                    stock: -1, //库存
                    flPrice: ''
                }, {
                    goodsId: "53",
                    goodsName: "黄焖排骨（大）+青菜+米饭",
                    goodsImg: "/tsg.png",
                    marketPrice: "30.00",
                    numb: 0,
                    shopPrice: "27.00",
                    zan: 0,
                    sell: 0,
                    state: 0, //状态 0 已下架

                    size: [ //规格  -1代表无限
                        {name: "小份", price: "18.00", stock: '-1'},
                        {name: "大份", price: "20.00", stock: '-1'}
                    ]
                },

                ],
                modalTogles: 0,
                sumSelect: false, //全选
                selectNumb: 0, //选择的个数
                tipsStyle: {
                    top: '172px',
                    left: '245px',
                },

                //更多操作
                operateData: {
                    child: ['批量上架', '批量下架', '批量删除'],
                    // more: ['批量改库存', '批量改餐盒价格', '批量改餐盒数量', '批量改可售时间', '批量改分类', '批量改设置规格'] },
                    more: ['批量改库存']
                },
                operateMore: false,
                tipsTogle: false, //更多操作提示框

                stockChoice: 0, //无限--0  还是 自定义--1

                limitTime: 0, //时间不限--0  还是 自定义--1
                weeks: [{name: '一', check: true}, {name: '二', check: true}, {name: '三', check: true}, {
                    name: '四',
                    check: true
                }, {name: '五', check: true}, {name: '六', check: true}, {name: '日', check: true}],
                timeData: [{state: '', end: ''}],
                keepTime: '',
                timeStyle: {top: 0, left: 0,},
                timeBox: {addsub: {h: 0, m: 0}, popName: '', popIndex: '', box: false,}, //弹出选择时间盒子的数据
                catId: 0,

                classifyFood: {data: ['超值双人套餐', '特色主打', '主菜类',], states: false, txt: ''}, //批量修改分类的菜系分类选择


                //单列多列
                column: true,

                //修改
                modify: {goodsName: -1, shopPrice: -1, stock: -1},
                modifyTxt: '',

                //规格弹出数据
                specData: [{name: "小小份", price: "100.00", stock: '-1'},],
                specStyle: {
                    top: '0',
                    left: '0',
                },
                specTogle: false,
                modalTogle: 0, //控制弹窗 现在12最大
                modalTxt: '', //控制弹窗

                //口味弹出框
                tasteData: '',

                pageNumb: 0, //总页数
                pageCurent: 1, //当前页
                p: 15, //几条数据一页


                errTips: {state: false, txt: '起始时间填写不正确，请确保起始时间小于结束时间'}, //控制错误弹窗


                //分类管理
                scrollNumb: [],
                scrollData: {start: {}, indexF: -1, index: -1},
                addLang: '',
                addClasTxt: [],

                clasData: [{
                    name: "菜单",
                    choice: [{
                        name: "超级双人餐"
                    }, {
                        name: "特色主打"
                    }, {
                        name: "主菜类"
                    }, {
                        name: "配菜类"
                    },]
                }, {
                    name: "eglish",
                    choice: [{
                        name: "one"
                    }, {
                        name: "two"
                    }, {
                        name: "muji"
                    },]
                }],
                clasName: [], //管理分类弹出框操作
            },
            created: function () {

                this.startFun()


            },

            methods: {
                startFun: function () {
                    var that = this;
                    var sumFood = []; //查询后的所有菜 还没分页
                    var foods = [];


                    //获取数据
                    axios({
                        method: "post",
                        url: 'https://www.aftdc.com/Business/Goods/getGoods',
                        async: false,
                        data: {
                            token:shopData.token,
                        },
                    }).then(function (res) {
                        if(res.data.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href="/business/Login/index.html";
                        }

                        that.getGoods = res.data.data
                        //   foods=res[0].dishes;
                        foods = JSON.parse(JSON.stringify(res.data.data[0].dishes));
                        var classifyTxt = [];
                        var len = Boolean(foods) ? foods.length : 0;

                        for (var i = 0; i < len; i++) {
                            var goods = foods[i].goods
                            if (Boolean(goods)) {
                                var numb = goods.length;
                                for (var j = 0; j < numb; j++) {
                                    var good = new Object(goods[j]);
                                    sumFood.push(good); //全部商品

                                }
                            }
                            classifyTxt.push(foods[i]['catName'])
                        }
                        ;
                        var classifyFood = that.classifyFood
                        classifyFood.data = classifyTxt
                        var obj = {catName: "全部商品", goods: sumFood};
                        foods.unshift(obj);
                        that.foods = foods;
                        that.sumFood = sumFood;

                        that.filtersFn(); //状态的分类
                        that.paging();
                    })

                },
                hide: function () {
                    this.modifyClose();
                    this.specTogle = false;
                },
                //切换语言
                langFn: function (index) {
                    var that = this
                    that.langIndex = index;
                    var res = that.getGoods
                    var sumFood = []; //查询后的所有菜 还没分页
                    var foods = [];

                    foods = JSON.parse(JSON.stringify(res.data.data[index].dishes));
                    var classifyTxt = [];
                    var len = Boolean(foods) ? foods.length : 0;

                    for (var i = 0; i < len; i++) {
                        var goods = foods[i].goods
                        if (Boolean(goods)) {
                            var numb = goods.length;
                            for (var j = 0; j < numb; j++) {
                                var good = new Object(goods[j]);
                                sumFood.push(good); //全部商品

                            }
                        }
                        classifyTxt.push(foods[i]['catName'])
                    }
                    ;
                    var classifyFood = that.classifyFood
                    classifyFood.data = classifyTxt
                    var obj = {catName: "全部商品", goods: sumFood};
                    foods.unshift(obj);
                    that.foods = foods;
                    that.sumFood = sumFood;

                    that.filtersFn(); //状态的分类
                    that.paging();
                },

                foodSelect: function (e) {

                    var currentFood = this.currentFood;
                    //var selectNumb = 0
                    var len = currentFood.length;
                    var sumSelect = true

                    for (var i = 0; i < len; i++) {
                        var selects = currentFood[i].selects
                        if (!selects) {
                            sumSelect = false;
                            break
                        }

                    }
                    ;

                    this.sumSelect = sumSelect;
                    /*this.selectNumb = selectNumb;
                     if(selectNumb > 0) {
                        this.tipsStyle = {
                            top: '172px',
                            left: '245px',
                        }
                    } */
                    this.selectFn()
                },
                delGoods: function (goodsId) {
                    var arr = [goodsId]
                    axios({
                        method: "post",
                        url: 'https://www.aftdc.com/Business/Goods/delGoods',
                        data: {
                            goodsIdArr: JSON.stringify(arr),
                            token:shopData.token,
                        },
                    }).then(function (res) {
                        if (res.data.res == 1) {
                            alert('删除成功')
                            location.reload()
                        }else if(res.data.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href="/business/Login/index.html";
                        }
                    })

                },
                danSale: function (goodsId, isSale) {
                    var arr = goodsId
                    var iS = isSale
                    if (iS == 0) {
                        iS = 1;
                    } else if (iS == 1 || iS == null) {
                        iS = 0;
                    }


                    axios({
                        method: "post",
                        url: 'https://www.aftdc.com/Business/Goods/saveSale',
                        data: {
                            goodsId: arr,
                            isSale: iS,
                            token:shopData.token,
                        },
                    }).then(function (res) {

                        if (res.data.res == 1) {
                            alert('操作成功!')
                            location.reload()
                        }else if(res.data.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href="/business/Login/index.html";
                        } else {
                            location.reload()
                        }
                    })

                },
                sumSelectFn: function () { //全选
                    var sumSelect = this.sumSelect;
                    var currentFood = this.currentFood;
                    var len = currentFood.length;
                    for (var i = 0; i < len; i++) {
                        currentFood[i].selects = sumSelect
                    }
                    ;

                    /* if(sumSelect) {
                        this.selectNumb = len;
                        this.tipsStyle = {
                            top: '172px',
                            left: '245px',
                        }
                    } else {
                        this.selectNumb = 0
                    } */

                    this.selectFn()
                },

                selectFn: function () {
                    var selectNumb = 0
                    var sumFood = this.sumFood;
                    var len = sumFood.length;
                    var goodsIdArr = []
                    for (var i = 0; i < len; i++) {
                        var selects = sumFood[i].selects;
                        if (selects) {
                            selectNumb++
                            goodsIdArr.push(sumFood[i]['goodsId'])
                        }
                    }
                    this.goodsIdArr = goodsIdArr

                    this.selectNumb = selectNumb;
                    if (selectNumb > 0) {
                        this.tipsStyle = {
                            top: '172px',
                            left: '245px',
                        }
                    }

                },


                //分类列表
                navClass: function (index) {
                    this.sumSelect = false //重置选择框
                    this.selectNumb = 0


                    this.foodSelt = index;
                    var sumFood = this.foods[index].goods;

                    if (!sumFood) {
                        sumFood = []

                    }
                    this.sumFood = sumFood;

                    this.filtersFn(); //状态的分类
                    this.paging(); //分页

                },


                //状态分类
                navState: function (index) {
                    this.sumSelect = false //重置选择框
                    this.selectNumb = 0

                    this.filterSelt = index;

                    var sumFood = this.filters[index].goods;
                    if (!sumFood) {
                        sumFood = []
                    }
                    this.sumFood = sumFood
                    this.paging();
                },

                filtersFn: function () {
                    var sumFood = this.sumFood
                    var len = sumFood.length
                    if (len == 0) {
                        this.filters = [
                            {catName: "全部商品", goods: []}, {catName: "售卖中", goods: []}, {
                                catName: "已下架",
                                goods: []
                            }, {catName: "已售罄", goods: []}, {catName: "无图片", goods: []},
                        ]
                        return false
                    }

                    //查询改分类列表下的分类数
                    var yes = []; //售卖中
                    var bot = []; //已下架
                    var not = []; //已售罄
                    var imgs = []; //无图片

                    for (var i = 0; i < len; i++) {
                        //按状态分类
                        var isSale = sumFood[i].isSale
                        var img = sumFood[i].goodsImg

                        if (isSale == 1) {
                            yes.push(sumFood[i])
                        } else if (isSale == 0) {
                            bot.push(sumFood[i])
                        }
                        if (!Boolean(img)) {
                            imgs.push(sumFood[i])
                        }
                    }
                    var filters = [
                        {catName: "全部商品", goods: sumFood}, {catName: "售卖中", goods: yes}, {
                            catName: "已下架",
                            goods: bot
                        }, {catName: "已售罄", goods: not}, {catName: "无图片", goods: imgs},
                    ]
                    this.filters = filters

                },

                //批量操作
                modalBox: function () {
                    this.timeBox.box = false
                },
                batchOver: function (event) {
                    var selectNumb = this.selectNumb
                    if (selectNumb > 0) {
                        return false
                    }
                    this.tipsTogle = true;
                    var target = event.target;
                    var w = $(target).innerHeight() + 12
                    var y = $(target).offset().top - w + 'px';
                    var x = $(target).offset().left + 'px';

                    this.tipsStyle = {
                        top: y,
                        left: x,
                    }
                },
                batchModal: function (txt, index) {
                    if (this.selectNumb == 0) {
                        return false
                    }
                    this.modalTogle = index;

                    if (index == 9) {
                        this.specData = [{}]
                    }


                    var val = txt.replace(/改/, '修改')
                    val = val.replace(/设置/, '')

                    this.modalTxt = val
                },
                //自定义时间
                timeFocus: function (name, index, event) {
                    var val = this.timeData[index][name];
                    var h, m
                    if (!val) {
                        var data = new Date();
                        h = data.getHours();
                        h = h > 9 ? h : '0' + h
                        m = data.getMinutes();
                        m = m > 9 ? m : '0' + m
                        var times = h + ':' + m
                        this.timeData[index][name] = times;

                    } else {
                        h = val.substring(0, val.indexOf(":"));
                        m = val.substring(val.indexOf(":") + 1);
                    }

                    var target = event.target;
                    var y = $(target).offset().top - 250 + 'px'; //250是 240弹出框的高度+ 10距离
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
                    }, 1300)
                },

                //批量选择分类
                classifyFn: function (txt) {
                    this.classifyFood['txt'] = txt;
                    this.classifyFood['states'] = false;
                },


                //修改 菜品字段
                modifyFn: function (name, index) {
                    this.modifyClose()
                    this.modify[name] = index;
                    this.modifyTxt = this.currentFood[index][name]
                    console.log(this.modifyTxt);
                },
                modifySure: function (name, index) {
                    console.log(this.modifyTxt.length)
                    if (this.modifyTxt.length > 0) {
                        this.currentFood[index][name] = this.modifyTxt;
                        this.modify[name] = -1;

                        var id = this.currentFood[index].goodsId; //id
                        var val = this.modifyTxt; //改变后的值
                        //改变的字段名字就是 name
                        axios({
                            method: "post",
                            url: 'https://www.aftdc.com/Business/Goods/editGoods',
                            data: {
                                goodsId: id,
                                val: val,
                                name: name,
                                token: shopData.token,
                            },
                        }).then(function (res) {
                            if (res.data.res == -1) {
                                alert(res.data.reason)
                                localStorage.removeItem('shopData');
                                location.href = "/business/Login/index.html";
                            }
                        })
                    }
                    // }else{
                    //     this.modifyClose();
                    // }

                },

                modifyClose: function () {
                    var modify = this.modify
                    for (var i in modify) {
                        modify[i] = -1;
                    }
                    this.modify = modify
                },


                //批量修改确定按钮
                batchSure: function () {
                    var index = this.modalTogle; //1-8的批量操作
                    if (index == 1) {
                        //确认上架
                        var url = "https://www.aftdc.com/Business/Goods/addSale"
                    } else if (index == 2) {
                        //确认下架
                        var url = "https://www.aftdc.com/Business/Goods/subSale"
                    } else if (index == 3) {
                        //确认删除
                        var url = "https://www.aftdc.com/Business/Goods/delGoods"
                    } else if (index == 4) {
                        //修改库存
                        var url = "https://www.aftdc.com/Business/Goods/updStocks"
                    } else if (index == 8) {
                        //修改库存
                        var url = "/index.php/Business/GoodsSa/updCats"
                    }

                    var goodsIdArr = this.goodsIdArr
                    var that = this
                    axios({
                        method: "post",
                        url: url,
                        data: {
                            goodsIdArr: JSON.stringify(goodsIdArr),
                            catName: that.classifyFood['txt'],
                            stockChoice: that.stockChoice,
                            stockNum: that.stockNum,
                            token:shopData.token,
                        },
                    }).then(function (res) {
                        if (res.data.res == 1) {
                            alert('操作成功')
                            location.reload();
                        }else if(res.data.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href="/business/Login/index.html";
                        }
                    })

                },


                //多规格弹出框
                specMore: function (event, index) {
                    this.specTogle = !this.specTogle
                    // if(!this.specTogle){
                    //  return
                    // }
                    var target = event.target;
                    var w = $(target).innerWidth() + 10
                    var y = $(target).offset().top + 16 + 'px';
                    var x = $(target).offset().left + w + 'px';
                    //设置弹出框位置
                    this.specStyle = {
                        top: y,
                        left: x,

                    };

                    var size = this.currentFood[index].size;
                    var taste = this.currentFood[index].taste;
                    if (size) {
                        var sizeLen = size.length;
                        var specData = [];
                        for (var i = 0; i < sizeLen; i++) {
                            var objs = new Object(size[i])
                            specData.push(objs)
                        }
                        this.specData = specData;
                    }
                    if (taste) {
                        var tasLen = taste.length;
                        var tasteData = [];
                        for (var i = 0; i < tasLen; i++) {
                            var objT = new Object(taste[i])
                            tasteData.push(objT)
                        }
                        this.tasteData = tasteData;
                    }
                    var goodsId = this.currentFood[index].goodsId;
                    this.goodsId = goodsId;


                },
                //规格数据加减
                addSpec: function () {
                    var obj = {name: '', price: '', guigeId: '', kucun: ''}
                    this.specData.push(obj)
                },
                subSpec: function (index) {
                    var that = this
                    var guigeId = this.specData[index]['guigeId'];
                    axios({
                        method: "post",
                        url: 'https://www.aftdc.com/Business/Goods/delSpec',
                        data: {
                            guigeId: guigeId,
                            token:shopData.token,
                        },
                    }).then(function (res) {
                        if(res.data.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href="/business/Login/index.html";
                        }
                        that.specData.splice(index, 1)
                    })

                },

                //口味加减
                addTaste: function () {
                    var obj = {name: ''}
                    this.tasteData.push(obj)
                },
                subTaste: function (index) {
                    var name = this.tasteData[index]['name'];
                    var that = this
                    axios({
                        method: "post",
                        url: 'https://www.aftdc.com/Business/Goods/delTaste',
                        data: {
                            name: name,
                            goodsId: that.goodsId,
                            token:shopData.token,
                        },
                    }).then(function (res) {
                        if(res.data.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href="/business/Login/index.html";
                        }
                        that.tasteData.splice(index, 1)
                    })


                },
                //---------------------------------------------  分页----------------------------------------------------------------
                paging: function () {
                    var that = this;
                    var p = that.p //一页分几条
                    var sumFood = that.sumFood
                    var len = sumFood.length;

                    if (len == 0) {
                        that.currentFood = [];
                        return false
                    }

                    if (len > p) {
                        var leave = len % p
                        var numb = (len - leave) / p //p条一页
                        var pages = leave > 0 ? numb + 1 : numb;

                        var objs = sumFood.slice(0, p);

                    } else {
                        var pages = 1;
                        var objs = sumFood
                    }
                    that.currentFood = objs;
                    that.pageNumb = pages //总页数

                    for (var i = 0; i < len; i++) {
                        sumFood[i].selects = false //插入选中 控制字段 selects--------------------------
                    }

                    that.sumFood = sumFood

                },
                //----分页跳转------pageCurent当前页
                pageClick: function (index) {
                    this.pageCurent = index;
                    this.pagingFn()
                },
                pageSub: function () {
                    if (this.pageCurent == 1) {
                        return false
                    }
                    this.pageCurent--
                    this.pagingFn()
                },
                pageAdd: function () {
                    if (this.pageCurent == this.pageNumb) {
                        return false
                    }
                    this.pageCurent++
                    this.pagingFn()
                },
                pagingFn: function () {
                    var numb = this.pageCurent
                    var p = this.p;
                    var start = (numb - 1) * p;
                    var end = numb * p;

                    var currentFood = this.sumFood.slice(start, end);
                    this.currentFood = currentFood;

                    var len = currentFood.length;
                    var sumSelect = true

                    for (var i = 0; i < len; i++) {
                        var selects = currentFood[i].selects
                        if (!selects) {
                            sumSelect = false;
                            break
                        }

                    }
                    ;

                    this.sumSelect = sumSelect;


                },

                //------------------------------------- -----------------------------------------------------------------------
                //插入字段
                insert: function () {
                    //插入选中 控制字段 selects
                    var currentFood = this.currentFood;
                    var len = currentFood.length
                    for (var i = 0; i < len; i++) {
                        currentFood[i].selects = false
                    }
                    this.currentFood = currentFood


                },
                saveSpec: function () {
                    var modalTogle = this.modalTogle
                    var specData = this.specData
                    var specArr = []
                    for (var i = 0; i < specData.length; i++) {
                        var arr = {
                            name: specData[i]['name'],
                            price: specData[i]['price'],
                            id: specData[i]['guigeId'],
                            kucun: specData[i]['kucun']
                        };
                        specArr.push(arr)
                    }
                    if (modalTogle == 9) {
                        var goodsId = JSON.stringify(this.goodsIdArr)
                        var url = '/index.php/Business/GoodsSa/updSpec'
                    } else {
                        var goodsId = this.goodsId;
                        var url = 'https://www.aftdc.com/Business/Goods/editSpec'
                    }
                    var that = this
                    axios({
                        method: "post",
                        url: url,
                        data: {
                            goodsId: goodsId,
                            specArr: JSON.stringify(specArr),
                            token:shopData.token,
                        },
                    }).then(function (res) {
                        if(res.data.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href="/business/Login/index.html";
                        }
                        that.modalTogle = 0
                        location.reload();
                    })

                },
                saveTaste: function () {
                    var tasteData = this.tasteData
                    var tasteArr = []
                    for (var i = 0; i < tasteData.length; i++) {

                        tasteArr.push(tasteData[i]['name'])
                    }
                    var that = this
                    axios({
                        method: "post",
                        url: 'https://www.aftdc.com/Business/Goods/editTaste',
                        data: {
                            goodsId: that.goodsId,
                            tasteArr: JSON.stringify(tasteArr),
                            token:shopData.token,
                        },
                    }).then(function (res) {
                        if(res.data.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href="/business/Login/index.html";
                        }
                        that.modalTogle = 0
                    })

                },
                goEdit: function (event, goodsId) {
                    location.href = '/business/Goods/edit.html?goodsId=' + goodsId
                },
                editClick: function () {
                    var that = this;


                    var data = [];

                    var dataCat = []
                    for (var i = 1; i < that.foods.length; i++) {
                        var dataId = {}
                        dataId.catName = that.foods[i].catName
                        dataId.catId = that.foods[i].catId
                        data.push(that.foods[i].catName)
                        dataCat.push(dataId)
                    }
                    data = JSON.stringify(data)
                    dataCat = JSON.stringify(dataCat)
                    window.localStorage.setItem("foodst", data); //存入缓存
                    window.localStorage.setItem("dataCat", dataCat); //存入缓存
                    location.href = '/business/Goods/edit.html';
                },

                //分类管理 ---*--------------------
                clasNameFn: function () {
                    this.modalTogle = 12;
                    var that = this
                    axios({
                        method: "post",
                        url: 'https://www.aftdc.com/Business/Goods/getShopCats',
                        data: {
                            token:shopData.token,
                        },
                    }).then(function (res) {
                        if(res.data.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href="/business/Login/index.html";
                        }

                        var clasData = res.data.data;
                        let len = clasData.length;
                        let clasName = [];
                        for (var i = 0; i < len; i++) {
                            var obj = clasData[i].choice;
                            var lenObj = obj.length;
                            let choice = [];
                            for (var j = 0; j < lenObj; j++) {
                                obj[j].catSort = 0 //增加排序字段
                                var objC = new Object(obj[j]);
                                choice.push(objC)
                            }
                            var name = clasData[i].name;
                            var catId = clasData[i].catId;

                            let items = {name: name, choice: choice, catId: catId};
                            clasName.push(new Object(items))
                        }
                        that.clasName = clasName
                    })


                },
                //删除
                closeClas: function (indexF, index) {
                    this.clasName[indexF].choice.splice(index, 1);
                },
                closeLang: function (indexF) {
                    this.clasName.splice(indexF, 1);
                },
                //添加
                addLangFn: function () {
                    var txt = this.addLang;
                    if (Boolean(txt) || txt.length > 0) {
                        var obj = {name: txt, choice: [], catId: 0}
                        this.clasName.push(obj);
                        this.addLang = ''; //添加成功重置为空
                    }

                },
                addClasFn: function (index) {
                    var txt = this.addClasTxt[index];
                    if (Boolean(txt) || txt.length > 0) {
                        var obj = {name: txt, catSort: 0, catId: 0};
                        this.clasName[index].choice.push(obj);
                        this.addClasTxt[index] = '';
                    }

                },

                //拖动
                startTd: function (event, indexF, index) {
                    var scrollData = {}
                    var clasName = this.clasName;
                    var items = clasName[indexF].choice[index];

                    scrollData = {start: items, indexF: indexF, index: index};
                    this.scrollData = scrollData;
                    this.countClas()
                },
                endTd: function (event) {
                    var scrollData = this.scrollData;
                    var spiF = scrollData.indexF;

                    var box = $(".scrollBox").scrollTop();
                    var y = document.body.scrollTop || document.documentElement.scrollTop;
                    var disX = event.clientY //鼠标距离浏览器顶部的距离
                    disX = disX + box + y

                    let scrollNumb = this.scrollNumb[spiF];
                    let len = scrollNumb.length
                    let itemNumb
                    for (var i = 0; i < len; i++) {
                        let itemf = scrollNumb[i]
                        if (disX <= itemf) {
                            itemNumb = i
                            break
                        }
                    }
                    ;

                    if (itemNumb >= 0) {

                        var choice = this.clasName[spiF].choice;

                        var spi = scrollData.index;

                        choice.splice(spi, 1)
                        choice.splice(itemNumb, 0, scrollData.start);

                        this.clasName[spiF].choice = choice;
                    }
                },
                setPrint: function (catId) {
                    this.modalTogles = 1
                    if (catId.indexOf("sum") >= 0) {
                        var index = parseInt(catId.substring(3));

                        var choice = this.clasName[index].choice

                        var len = choice.length;
                        var array = []
                        for (let i = 0; i < len; i++) {
                            array.push(choice[i].catId)
                        }
                        array = array.join(",")
                        catId = array
                    }

                    this.catId = catId
                    axios({
                        method: "post",
                        url: 'https://www.aftdc.com/Business/Goods/getPrintInfo',
                        data: {
                            catId: catId,
                            token:shopData.token,
                        },
                    }).then(function (res) {
                        if(res.data.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href="/business/Login/index.html";
                        }

                        //如果有分类的
                        if (res.data.data) {
                            $('input[name=printsNum]').val(res.data.data.printsNum)
                            $('input[name=printsKey]').val(res.data.data.printsKey)
                        }
                    })

                },
                setPrintChild: function (catId) {
                    this.modalTogles = 1
                    this.catId = catId
                    axios({
                        method: "post",
                        url: 'https://www.aftdc.com/Business/Goods/getPrintInfo',
                        data: {
                            catId: catId,
                            token:shopData.token,
                        },
                    }).then(function (res) {
                        if(res.data.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href="/business/Login/index.html";
                        }

                        //如果有分类的
                        if (res.data.data) {
                            $('input[name=printsNum]').val(res.data.data.printsNum)
                            $('input[name=printsKey]').val(res.data.data.printsKey)
                        }
                    })
                },

                printSure: function () {
                    var printsNum = $('input[name=printsNum]').val()
                    var printsKey = $('input[name=printsKey]').val()
                    var catId = this.catId
                    if (!printsNum && !printsKey) {
                        alert('请填写完整');
                        return false
                    }

                    var that = this
                    axios({
                        method: "post",
                        url: 'https://www.aftdc.com/Business/Goods/setPrintCat',
                        data: {
                            printsNum: printsNum,
                            printsKey: printsKey,
                            catId: catId,
                            token:shopData.token,
                        },
                    }).then(function (res) {
                        if(res.data.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href="/business/Login/index.html";
                        }
                        that.modalTogles = 0
                    })

                },
                //计算scrollItem原本距离可视区域的距离
                countClas: function () {

                    var scrollNumb = [];
                    var Hig = $(".scrollItem").eq(0).outerHeight();
                    var box = $(".scrollBox").scrollTop();


                    var numbs = Hig + box

                    $(".scrollFat").each(function () {
                        var item = []
                        $(this).children(".scrollItem").each(function (event) {
                            var numb = $(this).offset().top + numbs
                            item.push(numb)
                        })
                        scrollNumb.push(item)
                    })

                    this.scrollNumb = scrollNumb

                },
                clasSure: function () {
                    this.clasData = this.clasName;
                    var clasData = JSON.stringify(this.clasData)

                    clasData = JSON.parse(clasData)
                    var name = clasData[0]['choice'];
                    // var res = clasData[0]['choice'][0].name;
                    var obj = {};
                    var narr = new Array();
                    for (var p = 0; p < name.length; p++) {
                        for (var j in name[p]) {
                            if (obj[j] != undefined)
                                obj[j] += name[p][j];
                            else
                                obj[j] = name[p][j];
                        }
                    }
                    for (var p in obj) {
                        // narr.push(eval("({'"+p+"':'"+obj[p]+"'})"));
                        narr.push(obj[p]);
                    }
                    //alert(narr[0].key1);value2value5value8
                    var n = (narr[0].split(res)).length - 1;
                    // console.log(narr[0]);
                    // return false
                    for (var i = 0; i < clasData.length; i++) {
                        if (clasData[i]['choice'].length > 0) {
                            for (var k = 0; k < clasData[i]['choice'].length; k++) {
                                clasData[i]['choice'][k]['catSort'] = k
                                var res = clasData[i]['choice'][k].name;
                                var n = (narr[0].split(res)).length - 1;
                            }
                        }
                    }
                    if (n > 1) {
                        alert('有相同的分类')
                        return false
                    }
                    this.clasName = clasData

                    var that = this
                    axios({
                        method: "post",
                        url: 'https://www.aftdc.com/Business/Goods/saveShopCats',
                        data: {
                            clasData: JSON.stringify(clasData),
                            token:shopData.token,
                        },
                    }).then(function (res) {

                        if (res.data.res == 1) {
                            that.startFun()
                            that.modalTogle = 0;
                        }else if(res.data.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href="/business/Login/index.html";
                        }
                    })

                },
                searchIconClick: function () {
                    var that = this;
                    var sumFood = []; //查询后的所有菜 还没分页
                    var foods = [];
                    var name = $("#goods_name").val();
                    axios({
                        method: "post",
                        url: "https://www.aftdc.com/Business/Goods/getGoods",
                        data: {
                            name: name,
                            token:shopData.token,
                        },
                    }).then(function (res) {

                        // alert(name)
                        if (res.data.res == 1) {
                            that.getGoods = res.data.data
                            //   foods=res[0].dishes;
                            foods = JSON.parse(JSON.stringify(res.data.data[0].dishes));
                            var classifyTxt = [];
                            var len = Boolean(foods) ? foods.length : 0;

                            for (var i = 0; i < len; i++) {
                                var goods = foods[i].goods
                                if (Boolean(goods)) {
                                    var numb = goods.length;
                                    for (var j = 0; j < numb; j++) {
                                        var good = new Object(goods[j]);
                                        sumFood.push(good); //全部商品

                                    }
                                }
                                classifyTxt.push(foods[i]['catName'])
                            }
                            ;
                            var classifyFood = that.classifyFood
                            classifyFood.data = classifyTxt
                            var obj = {catName: "全部商品", goods: sumFood};
                            foods.unshift(obj);
                            that.foods = foods;
                            that.sumFood = sumFood;

                            that.filtersFn(); //状态的分类
                            that.paging();
                        }else if(res.data.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href="/business/Login/index.html";
                        }
                    })

                },

            },

        });

    }
}