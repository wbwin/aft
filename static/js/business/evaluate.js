window.onload = function () {
    var shopData = JSON.parse(localStorage.getItem('shopData'));
    if (!shopData) {
        location.href = "/business/Login/index.html";
    } else {


                var evaluate = new Vue({
                    el: '.evaluate',
                    data: {
                        radios: [
                            {val: '评价管理', choice: ['全部', '未回复', '已回复'], sele: '全部'},
                            {val: '满意程度', choice: ['全部', '好评', '中评', '差评'], sele: '全部'},
                            {val: '有无内容', choice: ['全部', '有内容'], sele: '全部'},
                        ],
                        time: {start: '', end: '', name: ''},
                        pageNumb: 0, //总页数
                        pageCurent: 1, //当前页
                        pageEach: 10, //每一页显示数据条数
                        pinglun: [{
                            // content: "王企鹅群翁",
                            // createTime: "2017-07-24",
                            // goodslist: [{ goodsName: "炒饭" }],
                            // id: "50",
                            // serviceScore: "4",
                            // userId: "81",
                            // userName: "黄守亲大大大大大大大",
                            // userPhoto: "https://www.aftdc.com/Upload/headImg/81/2017-08-03/598294626fe7f.png",
                            // wContent: "你很棒棒哦",
                            // scoreList:[
                            //     {name:'商家',numb:5},
                            //     {name:'口味',numb:2},
                            //     {name:'包装',numb:1},
                            //     {name:'配送',numb:5},

                            // ],

                        }, {
                            // content: "王企鹅群翁",
                            // createTime: "2017-07-24",
                            // goodslist: [{ goodsName: "炒饭" }],
                            // id: "50",
                            // serviceScore: "4",
                            // userId: "81",
                            // userName: "黄守亲大大大大大大大",
                            // userPhoto: "https://www.aftdc.com/Upload/headImg/81/2017-08-03/598294626fe7f.png",
                            // wContent: "你很棒棒哦",
                            // scoreList:[
                            //     {name:'商家',numb:2},
                            //     {name:'口味',numb:2},
                            //     {name:'包装',numb:1},
                            //     {name:'配送',numb:5},

                            // ],
                        },

                        ],

                        reportData: ['同行恶意评价', '以差评谋求不正当得利', '存在不文明用语', '广告或垃圾信息', '敏感或违法信息', '泄露隐私'],

                        //-----------------------------------------精准推销-------------------------------------------------------------------------
                        couponHtml: [
                            {
                                name: '优惠券名称',
                                len: 30,
                                width: '278px',
                                err: false,
                                place: '1-30位汉字、字母、数字或下划线',
                                val: 'J-coffee静咖啡屋优惠券'
                            },
                            {
                                name: '优惠金额',
                                len: 3,
                                width: '278px',
                                err: false,
                                place: '1-30位汉字、字母、数字或下划线',
                                val: '3',
                                bot: '元'
                            },
                            {
                                name: '使用门槛',
                                len: 5,
                                width: '248px',
                                err: false,
                                place: '1-30位汉字、字母、数字或下划线',
                                val: '47',
                                top: '满',
                                bot: '元可用'
                            },
                            {
                                name: '优惠券有效期',
                                len: 2,
                                width: '192px',
                                err: false,
                                place: '1-30位汉字、字母、数字或下划线',
                                val: '30',
                                top: '发券之日起',
                                bot: '天可用'
                            },

                        ],
                        couponData: {check: false, disabled: true},

                        modalTogle: 0, //控制弹出框
                        arr: [],
                        jsonStr: '',
                        pinglunScoreList: '',
                    },
                    created: function () {
                        //初始化时间查询时间
                        var myDate = new Date();
                        var year = myDate.getFullYear()
                        var month = myDate.getMonth() + 1;
                        var day = myDate.getDate();
                        month = month > 9 ? month : '0' + month
                        this.time['start'] = year + '-' + month + '-' + '01'
                        this.time['end'] = year + '-' + month + '-' + day
                        this.start = this.time['start']
                        this.end = this.time['end']
                        var that = this


                        that.pageFn(1);


                    },

                    methods: {
                        changeRadio: function (e) {
                            var radios = this.radios
                            var len = radios.length
                            var seles = [];
                            for (var i = 0; i < len; i++) {
                                var val = radios[i].sele
                                seles.push(val)
                            }

                            var jsonStr = JSON.stringify(seles)
                            var that = this
                            that.jsonStr = jsonStr
                            axios({
                                method: "post",
                                url: 'https://www.aftdc.com/Business/GoodsAppraises/getGoodsAppraises',
                                type: 'post',
                                async: false,
                                data: {
                                    page: 0,
                                    start: that.start,
                                    end: that.end,
                                    jsonStr: that.jsonStr,
                                    token: shopData.token
                                },
                            }).then(function (res) {

                                if (res.data.res == -1) {
                                    alert(res.data.reason)
                                    localStorage.removeItem('shopData');
                                    location.href = "/business/Login/index.html";
                                }

                                that.arr = res.data.data
                                var pinglun = res.data.data.pinglun
                                // that.pinglunScoreList = res.data.data.pinglun.scoreList
                                for (var i = 0; i < pinglun.length; i++) {
                                    var scoreList = [
                                        {name: '商家', numb: Number(pinglun[i]['avg'])},
                                        {name: '口味', numb: Number(pinglun[i]['tasteScore'])},
                                        {name: '包装', numb: Number(pinglun[i]['warpScore'])},
                                        {name: '配送', numb: Number(pinglun[i]['timeScore'])},

                                    ];
                                    pinglun[i]['scoreList'] = scoreList
                                    if (pinglun[i]['goodslist'] != null) {
                                        for (var k = 0; k < pinglun[i]['goodslist'].length; k++) {
                                            pinglun[i]['goodsName'] = pinglun[i]['goodslist'][k]['goodsName'] + ','
                                        }
                                    }
                                }
                                that.pinglun = pinglun
                                var pageCount = Number(res.data.pageCount);
                                var pageEach = Number(res.data.pageEach);
                                that.pageEach = res.data.pageEach;
                                var pageNumb = Math.ceil(pageCount / pageEach)
                                that.pageNumb = pageNumb

                                that.insert()
                            })

                        },

                        timeFn: function () {
                            var start = this.time['start'];
                            var end = this.time['end'];
                            var that = this
                            that.start = start
                            that.end = end
                            axios({
                                method: "post",
                                url: 'https://www.aftdc.com/Business/GoodsAppraises/getGoodsAppraises',
                                data: {
                                    page: 0,
                                    start: that.start,
                                    end: that.end,
                                    token: shopData.token
                                },
                            }).then(function (res) {

                                if(res.data.res == -1)
                                {
                                    alert(res.data.reason)
                                    localStorage.removeItem('shopData');
                                    location.href = "/business/Login/index.html";
                                }

                                that.arr = res.data.data
                                var pinglun = res.data.data.pinglun
                                // that.pinglunScoreList = res.data.data.pinglun.scoreList
                                for (var i = 0; i < pinglun.length; i++) {
                                    var scoreList = [
                                        {name: '商家', numb: Number(pinglun[i]['avg'])},
                                        {name: '口味', numb: Number(pinglun[i]['tasteScore'])},
                                        {name: '包装', numb: Number(pinglun[i]['warpScore'])},
                                        {name: '配送', numb: Number(pinglun[i]['timeScore'])},

                                    ];
                                    pinglun[i]['scoreList'] = scoreList
                                    if (pinglun[i]['goodslist'] != null) {
                                        for (var k = 0; k < pinglun[i]['goodslist'].length; k++) {
                                            pinglun[i]['goodsName'] = pinglun[i]['goodslist'][k]['goodsName'] + ','
                                        }
                                    }
                                }
                                that.pinglun = pinglun
                                var pageCount = Number(res.data.pageCount);
                                var pageEach = Number(res.data.pageEach);
                                that.pageEach = res.data.pageEach;
                                var pageNumb = Math.ceil(pageCount / pageEach)
                                that.pageNumb = pageNumb

                                that.insert()
                            })
                        },
                        //发放优惠券 弹出框
                        //检测
                        couponFn: function () {
                            var couponHtml = this.couponHtml;
                            var len = couponHtml.length;
                            var disabled = false //禁用点击框
                            for (var i = 0; i < len; i++) {
                                var val = couponHtml[i].val
                                if (!Boolean(val) || val.length <= 0) {
                                    couponHtml[i]['err'] = true;
                                    disabled = true
                                } else {
                                    couponHtml[i]['err'] = false;
                                }
                            }
                            this.$set(this.couponHtml, '', couponHtml);
                            if (!disabled) {
                                var couponData = this.couponData;
                                disabled = !couponData.check;
                            }
                            this.couponData['disabled'] = disabled
                        },
                        //发放
                        grant: function () {
                            var couponHtml = this.couponHtml;
                            var len = couponHtml.length;

                            var data = [];
                            for (var i = 0; i < len; i++) {
                                var val = couponHtml[i].val;
                                data
                            }

                        },


                        scoreMore: function (index) {
                            var pl = this.pinglun[index];
                            pl['mores'] = 10
                            this.$set(this.pinglun, index, pl);

                        },
                        writeTogle: function (index) {
                            var pl = this.pinglun[index];
                            pl['writePl'] = !pl['writePl'];
                            pl['writeTxt'] = ''

                            this.$set(this.pinglun, index, pl);
                        },
                        //回复评论
                        replyFn: function (index) {
                            var val = this.pinglun[index]['writeTxt'];
                            var id = this.pinglun[index]['id'];
                            var shopId=localStorage.getItem('wbshopId');
                            console.log(shopId)
                            var that = this
                            axios({
                                method: "post",
                                url: 'https://www.aftdc.com/Business/GoodsAppraises/comments',
                                data: {
                                    content: val,
                                    id: id,
                                    shopId:shopId,
                                    token: shopData.token
                                },
                            }).then(function (res) {

                                if (res.data.res == 1) {
                                    alert('回复成功')
                                    that.pinglun[index]['shopReply'] = [{content: val}]

                                    that.writeTogle(index)
                                } else if (res.data.res == -1) {
                                    alert(res.data.reason)
                                    localStorage.removeItem('shopData');
                                    location.href = "/business/Login/index.html";
                                }

                            })


                        },
                        // //发券
                        // grantTicketFn:function(index){
                        //  this.modalTogle=1;
                        //  var pinglun=this.pinglun;

                        //  var id=pinglun[index].id;
                        //  var userId=pinglun[index].userId;
                        // },

                        //举报
                        reportFn: function (index) {

                            this.modalTogle = 2;
                            var appId = this.pinglun[index]['id']
                            this.appId = appId
                            $('#goto').attr('href', '/business/Goodsappraises/sendeval.html?appId=' + appId)
                        },
                        // gotoClick:function(){
                        //     location.href='/business/evaluate/sendeval.html'
                        // },


                        //在评论中插入相关字段-->评论显示隐藏 更多评价
                        insert: function () {
                            var pinglun = this.pinglun;
                            var len = this.pinglun.length
                            for (var i = 0; i < len; i++) {
                                pinglun[i]['mores'] = 1;
                                pinglun[i].writePl = false;
                                pinglun[i].writeTxt = '';
                            }
                            this.$set(this.pinglun, '', pinglun)
                            //this.pinglun=pinglun
                        },
                        //------------------------分页跳转------------------------------------
                        pageFn: function (pageCurent) {

                            var that = this;
                            var page = (pageCurent - 1) * that.pageEach;
                            that.pageCurent = pageCurent;
                            axios({
                                method: "post",
                                url: 'https://www.aftdc.com/Business/GoodsAppraises/getGoodsAppraises',

                                data: {
                                    page: page,
                                    start: that.start,
                                    end: that.end,
                                    jsonStr: that.jsonStr,
                                    token: shopData.token
                                },
                            }).then(function (res) {
                                that.arr = res.data.data
                                var pinglun = res.data.data.pinglun
                                if (res.data.res == -1) {
                                    alert(res.data.reason)
                                    localStorage.removeItem('shopData');
                                    location.href = "/business/Login/index.html";
                                }


                                for (var i = 0; i < pinglun.length; i++) {
                                    var scoreList = [
                                        {name: '商家', numb: Number(pinglun[i]['avg'])},
                                        {name: '口味', numb: Number(pinglun[i]['tasteScore'])},
                                        {name: '包装', numb: Number(pinglun[i]['warpScore'])},
                                        {name: '配送', numb: Number(pinglun[i]['timeScore'])},

                                    ];
                                    pinglun[i]['scoreList'] = scoreList
                                    if (pinglun[i]['goodslist'] != null) {
                                        for (var k = 0; k < pinglun[i]['goodslist'].length; k++) {
                                            pinglun[i]['goodsName'] = pinglun[i]['goodslist'][k]['goodsName'] + ','
                                        }
                                    }
                                }
                                that.pinglun = pinglun
                                // that.pinglunScoreList = that.pinglun[0].scoreList[0].numb

                                // that.pinglunScoreList=that.pinglun[0].scoreList[0].numb
                                var pageCount = Number(res.data.pageCount);
                                var pageEach = Number(res.data.pageEach);
                                that.pageEach = res.data.pageEach;
                                var pageNumb = Math.ceil(pageCount / pageEach)
                                that.pageNumb = pageNumb

                                that.insert()

                            })


                        },

                        //**********
                        usexiqiClick: function () {
                            location.href = '/business/Goodsappraises/usexiqi.html'
                        },

                    },
                    mounted: function () {


                    },
                    updated: function () {
                        $("#date").dateSelect(evaluate);
                        $("#dateN").dateSelect(evaluate);
                    }


                });

            }

}