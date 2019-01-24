window.onload = function() {
    var shopData = JSON.parse(localStorage.getItem('shopData'));
    if (!shopData) {
        location.href = "/business/Login/index.html";
    } else {

        var shopBatch = new Vue({
            el: '#shopBatch',
            data: {
                navs: 1,

                imgTogle: false,
                imgURL: '',
                //matching:['按商品名称匹配','按UPC/EAN/条形码匹配','按SKU码货号匹配'],
                matching: ['按商品名称匹配'],
                shopState: ['请选择', '售卖中', '暂停售卖'],
                //修改
                modify: [{
                    data: {
                        className: '',
                        shop: '',
                        rule: '',
                        price: '',
                        stock: '',
                        state: '请选择',
                        weight: '',
                        boxPrice: '',
                        boxNumb: '',
                        describe: '',
                        img: ''
                    },
                    match: 1
                },],
                modifyIndex: -1,
                batchTogle: false,
                //删除
                deletes: [{className: '', shop: '', rule: '', match: 1}],

                errTips: {state: false, txt: '最少保留一条规则'}, //控制错误弹窗
            },
            methods: {
                getPhoto: function () {
                    var file = document.getElementById("file");
                    var fileList = file.files; //获取地址
                    var imgUrl = window.URL.createObjectURL(file.files[0]);
                    this.imgURL = imgUrl
                },
                //使用预览图片
                useImg: function () {
                    var i = this.modifyIndex;
                    this.modify[i].data.img = this.imgURL;
                    this.imgTogle = false
                },


                //删除修改规则
                deleteModify: function (index, name) {
                    var len = this[name].length
                    if (len <= 1) {
                        this.errTipsFn()
                        return false
                    }

                    this[name].splice(index, 1)
                },

                //添加一条规则
                oneAdd: function (numb) {
                    if (numb == 1) {
                        var obj = {
                            data: {
                                className: '',
                                shop: '',
                                rule: '',
                                price: '',
                                stock: '',
                                state: '请选择',
                                weight: '',
                                boxPrice: '',
                                boxNumb: '',
                                describe: '',
                                img: ''
                            },
                            match: 1
                        };
                        this.modify.push(obj)
                    } else if (numb == 2) { //添加删除的规则
                        var obj = {className: '', shop: '', rule: '', match: 1};
                        this.deletes.push(obj)
                    }

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

                //开始修改
                modifyFn: function () {
                    var modify = this.modify;
                    var arr = [];
                    var len = modify.length
                    for (var i = 0; i < len; i++) {
                        var obj = new Object(modify[i].data)
                        arr.push(obj)

                    }
                    const data = JSON.parse(JSON.stringify(arr))
                    /*     className:'分类名称'     shop:'商品名称'     rule:'规则',
                          price:'价格'            stock:'库存'          state:'状态',
                          weight:'重量'           boxPrice:'餐盒价格' boxNumb:'餐盒数量',
                          describe:'描述'     img:'图片'
                          * */
                },

                //开始删除
                deletesFn: function () {
                    var deletes = this.deletes
                    /*     className:'分类名称'     shop:'商品名称'     rule:'规则',*/
                    var arr = [];
                    for (var i = 0; i < deletes.length; i++) {
                        var obj = new Object(deletes[i])
                        arr.push(obj)
                    }
                    //  const data = JSON.parse(JSON.stringify(arr))
                    //console.log(data)
                }

            }
        })
    }
}