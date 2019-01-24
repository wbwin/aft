window.onload = function(){
    var adminData = JSON.parse(localStorage.getItem('adminData'));
    if(!adminData){
        location.href="../Login/login.html";
    }else{
        var app = new Vue({
            el: '#wrapper',
            data: {
                navData: [
                    {
                        name: '首页',
                        src:'main.html',
                        hash: '#/main'
                    },
                    {
                        name: '商品管理',
                        item: [
                            { name: '商品列表', src: '../Goods/goodsList.html', hash: '#/goodsList' },
                            { name: '商品评价', src: '../Goods/goodsAppraise.html', hash: '#/goodsAppraise' },
                            { name: '评价禁用', src: '../Goods/goodsBan.html', hash: '#/goodsBan' },
                            { name: '菜系分类', src: '../Goods/goodsCuisine.html', hash: '#/goodsCuisine' },
                        ]
                    },
                    {
                        name: '标签/举报',
                        item: [{ name: '评论标签', src: '../Tag/tags.html', hash: '#/tags' },
                            { name: '评论举报', src: '../Tag/plReport.html', hash: '#/plReport' },
                            { name: '商家举报', src: '../Tag/shopReport.html', hash: '#/shopReport' },
                        ]
                    },
                    {
                        name: '推广管理',
                        item: [{ name: '推广消息', src: '../Push/pushlist.html', hash: '#/pushlist' },
                        ]
                    },
                    {
                        name: '订单管理',
                        item: [{ name: '订单列表', src: '../Orders/orderList.html', hash: '#/orderList' },
                            { name: '退款列表', src: '../Orders/refundList.html', hash: '#/refundList' },
                            { name: '订单结算', src: '../Orders/countList.html', hash: '#/CountList' },
                        ]
                    },
                    {
                        name: '报表统计',
                        item: [{ name: '商品销售统计', src: '../Statistics/goodsCount.html', hash: '#/goodsCount' },
                            { name: '店铺销售统计', src: '../Statistics/shopCount.html', hash: '#/shopCount' },
                        ]
                    },
                    {
                        name: '资金管理',
                        item: [{ name: '提现管理', src: '../Finance/cashList.html', hash: '#/cashList' },
                            { name: '资金流水', src: '../Finance/purseList.html', hash: '#/purseList' },
                        ]
                    },
                    {
                        name: '店铺管理',
                        item: [{ name: '店铺列表', src: '../Shops/shopsList.html', hash: '#/shopsList' },
                            { name: '店铺审核', src: '../Shops/shopsPedding.html', hash: '#/shopsPedding' },
                            { name: '店铺认证', src: '../Shops/shopsAuthen.html', hash: '#/shopAuthen' },
                            { name: '店铺退款', src: '../Shops/shopsRefund.html', hash: '#/shopsRefund' },
                        ]
                    },
                    {
                        name: '城市合伙人管理',
                        item: [{ name: '合伙人列表', src: '../Partner/partnerList.html', hash: '#/partnerList' },
                        ]
                    },
                    {
                        name: '会员管理',
                        item: [{ name: '会员列表', src: '../Member/memberList.html', hash: '#/memberList' },
                        ]
                    },
                    {
                        name: '系统管理',
                        item: [{ name: '角色管理', src: '../Role/roleList.html', hash: '#/roleList' },
                            { name: '登录日志', src: '../Role/loginsList.html', hash: '#/loginsList' },
                        ]
                    },
                    {
                        name: '商城设置',
                        item: [{ name: '商城信息', src: '../Config/configInfor.html', hash: '#/configInfor' },
                        ]
                    },
                    {
                        name: '意见反馈',
                        item: [{ name: '用户反馈', src: '../Feedback/userFeedback.html', hash: '#/userFeedback' },
                            { name: '商家反馈', src: '../Feedback/shopFeedback.html', hash: '#/shopFeedback' }
                        ]
                    },
                    {
                        name: '客服管理',
                        item: [{ name: '客服列表', src: '../Service/list.html', hash: '#/serviceList'},
                            { name: '添加客服', src: '../Service/add.html', hash: '#/serviceAdd'}]
                    },
                    {
                        name: 'APP管理',
                        item: [{ name: '客户端APP更新', src: '../Appupdata/updataDetail.html?apptype=1', hash: '#/updataDetail'},
                            { name: '商家APP更新', src: '../Appupdata/updataDetail.html?apptype=2', hash: '#/updataDetails'}
                        ]
                    }
                ],
                navs: 0,
                itemShow: false,
                navItems: false,
                navState:false,
                navMouse:false,
                pageSrc: 'main.html', //iframe的路径
                togle:0,
            },
            created: function() {
                var _self = this
                var hash = location.hash;
                if(Boolean(hash)) {
                    var navData = this.navData;
                    var len = navData.length;
                    for(var i = 0; i < len; i++) {
                        var item = navData[i].item
                        if(item) {
                            for(var j=0;j<item.length;j++){
                                var lj=item[j].hash
                                if(hash==lj){
                                    _self.itemShow = i;
                                    _self.navs = i;
                                    //是导航再点进去的页面
                                    var has=hash.split("/");
                                    if(has.length>3){
                                        _self.navItems = has[3];
                                    }else{
                                        _self.navItems = j;
                                    }
                                    _self.pageSrc = navData[i].item[j].src;
                                    break
                                }
                            }
                        } else {//没有子元素
                            var lj=_self.navData[i].hash
                            if(hash==lj){
                                _self.navs = i;
                                _self.itemShow = false;
                                _self.pageSrc = _self.navData[i].src
                                break
                            }
                        }
                    }
                } else {
                    _self.pageSrc = "main.html"
                };
                //历史事件，返回键
                window.onpopstate=function(){
                    var jsons=window.history.length;

                    var hash = location.hash;
                    if(Boolean(hash)) {

                        var navData = _self.navData;

                        var len = navData.length;
                        for(var i = 0; i < len; i++) {
                            var item = navData[i].item
                            if(item) {
                                for(var j=0;j<item.length;j++){
                                    var lj=item[j].hash
                                    if(hash==lj){
                                        _self.itemShow = i;
                                        _self.navs = i;
                                        _self.navItems = j;
//					_self.pageSrc = navData[i].item[j].src;
                                        break
                                    }
                                }

                            } else {//没有子元素
                                var lj=_self.navData[i].hash
                                if(hash==lj){
                                    _self.navs = i;
                                    _self.itemShow = false;
//					_self.pageSrc = _self.navData[i].src
                                    break
                                }
                            }
                        }
                    } else {
                        _self.pageSrc = _self.navData[0].src;
                        _self.navs=0;
                        _self.itemShow= false;
                        _self.navItems= false;
                    };
                }
            },
            methods: {
                allFn:function(){
                    this.togle=false;
                },

                navWidth:function(){
                    this.navState=!this.navState
                    this.navMouse=!this.navMouse
                },

                navMouseFn:function(){
                    var navMouse=this.navMouse;
                    if(navMouse){
                        this.navState=!this.navState
                    }
                },

                navChoice: function(index) {
                    var item = this.navData[index].item
                    if(item) {
                        var numb=this.itemShow
                        this.itemShow = parseInt(index)==numb?false : parseInt(index);
                    } else {
                        this.navs = parseInt(index);
                        this.itemShow = false;
                        this.pageSrc = this.navData[index].src
                    }
                },
                navItemChoice: function(index) {
                    this.navs = this.itemShow;
                    this.navItems = index;
                    this.pageSrc = this.navData[this.navs].item[index].src;
                    var urls =this.navData[this.navs].item[index].src
                },
                cleanCache:function(){

                },
                loginOut:function(){
                    axios({
                        method: "post",
                        url: "https://www.aftdc.com/aftdcAControl/Login/logout",
                        data: {
                            adminNum:adminData.adminNum,
                            token:adminData.token
                        },
                    }).then(function (res) {
                        if (res.data.res == 1) {
                            localStorage.removeItem('adminData');
                            location.href="../Login/login.html";
                        }
                    })
                },
            },
        });
    }
}
