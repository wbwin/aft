window.onload = function () {
    var shopData = JSON.parse(localStorage.getItem('shopData'));
    if (!shopData) {
        location.href = "/business/Login/index.html";
    } else {
        var app = new Vue({
            el: '#wrapper',
            data: {
                navData: [
                    {name: '商家首页', img: 'fa-sy.png', img1: 'fa-sy1.png', src: 'home.html', hash: '#/home'},
                    {
                        name: '订单管理',
                        img: 'fa-dd.png',
                        img1: 'fa-dd1.png',
                        src: 'javascript:void(0) ',
                        item: [{name: '预订单', src: '../Ordersa/orderPre.html', hash: '#/order/Pre'},
                            {name: '催单', src: '../Ordersa/orderReminder.html', hash: '#/order/Reminder'},
                            {name: '退单', src: '../Ordersa/orderRefund.html', hash: '#/order/Refund'},
                            {name: '历史订单', src: '../Ordersa/orderHistory.html', hash: '#/order/History'},
                            // {name: '餐损赔付', src: '../Ordersa/orderDamag.html', hash: '#/order/Damag'},
                        ]
                    },
                    {
                        name: '堂食管理',
                        img: 'fa-ts.png',
                        img1: 'fa-ts1.png',
                        src: 'javascript:void(0) ',
                        item: [
                            {name: '堂食订单', src: '../Canteen/deskPre.html', hash: '#/Act/book'},
                            {name: '桌位管理', src: '../Canteen/ActDesk.html', hash: '#/Act/ADesk'},
                            {name: '服务员管理', src: '../Canteen/ActFuyuan.html', hash: '#/Act/Fuyuan'},
                        ]
                    },

                    {
                        name: '商品管理',
                        img: 'fa-sp.png',
                        img1: 'fa-sp1.png',
                        src: '../Goods/shop.html',
                        hash: '#/shop'
                    },
                    {
                        name: '售后管理',
                        img: 'fa-sh.png',
                        img1: 'fa-sh1.png',
                        item: [
                            {name: '用户评价', src: '../Goodsappraises/evaluate.html', hash: '#/evaluate'},
                        ]
                    },
                    {
                        name: '财务管理',
                        img: 'fa-cw.png',
                        img1: 'fa-cw1.png',
                        item: [{name: '对账首页', src: '../Finance/CaiConter.html', hash: '#/Cai/Conter'},
                            {name: '账单对账', src: '../Finance/CaiDuizhang.html', hash: '#/Cai/Duizhang'},
                            {name: '账户管理', src: '../Finance/CaiYue.html', hash: '#/Cai/Yue'}
                        ]
                    },
                    {
                        name: '文章管理',
                        img: 'fa-cw.png',
                        img1: 'fa-cw1.png',
                        item: [{name: '管理文章', src: '../Article/article.html', hash: '#/Art/article'}
                        ]
                    },

                    {
                        name: '经营分析',
                        img: 'fa-fx.png',
                        img1: 'fa-fx1.png',
                        item: [{name: '营业统计', src: '../Analy/analyCount.html', hash: '#/analy/Count'},
                            {name: '流量分析', src: '../Analy/analyFlow.html', hash: '#/analy/Flow'},
                            {name: '顾客分析', src: '../Analy/analyGuest.html', hash: '#/analy/Guest'},
                            // { name: '商家体验', src: '/index.php/Business/Analy/analyFeel', hash: '#/analy/Feel' },
                            {name: '商品分析', src: '../Analy/analyShop.html', hash: '#/analy/Shop'},
                            {name: '报表下载', src: '../Analy/analyDown.html', hash: '#/analy/Down'}
                        ]
                    },
                    {
                        name: '营销活动',
                        img: 'fa-yx.png',
                        img1: 'fa-yx1.png',
                        item: [
                            {name: '店铺活动', src: '../Activity/HuoDong.html', hash: '#/Huo/Dong'},
                            {name: '分销活动', src: '../Activity/distribuTion.html', hash: '#/distribu/Tion'},

                        ]

                    },
                    {
                        name: '导入图片',
                        img: 'xj.png',
                        img1: 'xj1.png',
                        src: '../Picture/picture.html',
                        hash: '#/picture'
                    },
                    {
                        name: '店铺设置',
                        img: 'fa-sz.png',
                        img1: 'fa-sz1.png',
                        item: [{name: '账号设置', src: '../Store/ActNum.html', hash: '#/Act/Num'},
                            {name: '门店管理', src: '../Store/ActDoor.html', hash: '#/Act/Door'},
                            {name: '消息中心', src: '../Store/ActMesg.html', hash: '#/Act/Mesg'},
                            // { name: '门店装修', src: '/index.php/Business/Act/ActEdit', hash: '#/Act/Edit' },

                        ]
                    },
                    {
                        name: '商家会员',
                        img: 'rt.png',
                        img1: 'rt1.png',
                        // src: '/index.php/Business/Setshop/member',
                        // hash: '#/member'
                        item: [
                            {name: '查看会员列表', src: '../Membership/member.html', hash: '#/member'},
                            {name: '设置会员等级', src: '../Membership/shopVip.html', hash: '#/shopVip'},
                        ]
                    },
                    {
                        name: '粉丝关注',
                        img: 'hx.png',
                        img1: 'hx1.png',
                        src: '../Fans/fensi.html',
                        hash: '#/fensi'
                    },
                    // {
                    //     name: '分店管理',
                    //     img: 'fa-sz.png',
                    //     img1: 'fa-sz1.png',
                    //     item: [{name: '分店列表', src: '../Branch/AnnexShop.html', hash: '#/Annex/AnnexShop'},
                    //         {name: '添加分店', src: '../Branch/add.html', hash: '#/Annex/add'},
                    //         {src: '../Branch/AnnexPower.html', hash: '#/Annex/power/0'},
                    //         {src: '../Branch/registration.html', hash: '#/Annex/add/1'},
                    //
                    //         {src: '../Branch/openmage.html', hash: '#/Branch/open/1'},
                    //         {src: '../Branch/settInfo.html', hash: '#/Branch/sett/1'},
                    //         {src: '../Branch/aptitude.html', hash: '#/Branch/apti/1'},
                    //         {src: '../Branch/scheme.html', hash: '#/Branch/scheme/1'},
                    //         {src: '../Branch/wait.html', hash: '#/Branch/wait/1'},
                    //         //没有name的，导航就不会存在，这是导航再点进去的二级页面
                    //     ]
                    // },

                    {
                        name: '商家认证',
                        img: 'rzh.png',
                        img1: 'rzh1.png',
                        src: '../Certification/authen.html',
                        // src: '/index.php/Business/Authention/Comder',
                        hash: '#/authen',
                    },
                    {
                        name: '意见反馈',
                        img: 'opinion.png',
                        img1: 'opinion1.png',
                        src: '../Opinion/opinion.html',
                        hash: '#/opinion',
                    },
                    {
                        name: '在线客服',
                        img: 'fa-sz.png',
                        img1: 'fa-sz1.png',
                        item: [{name: '对接用户', src: '../Kufu/user.html', hash: '#/Kufu/user'},
                            {name: '对接平台', src: '../Kufu/pt.html', hash: '#/Kufu/pt'},
                            //没有name的，导航就不会存在，这是导航再点进去的二级页面
                        ]
                    },
                ],
                navs: 0,
                itemShow: false,
                navItems: false,
                navState: false,
                navMouse: false,
                pageSrc: 'home.html', //iframe的路径
                togle: 0,
                timer: null,
                shopAtive: '',
                shop: {},
                user: {},
                timer: null,
            },
            created: function () {

                var that = this;
                axios({
                    method: "post",
                    url: 'https://www.aftdc.com/Business/Index/index',
                    data: {
                        token: shopData.token,
                    },
                }).then(function (res) {

                    if (res.data.res == 1) {
                        that.shop = res.data.data.Shop
                        that.shopAtive = res.data.data.Shop.shopAtive
                        var names = res.data.data.Shop.shopName
                        var shopId = res.data.data.user.shopId

                        sessionStorage.setItem("namess", names);
                        localStorage.setItem('wbshopId', shopId)


                    } else if (res.data.res == -1) {
                        alert(res.data.reason)
                        localStorage.removeItem('shopData');
                        location.href = "/business/Login/index.html";
                    } else {
                        alert('出错啦')
                    }
                })
                var _self = this
                /*this.navTest()*/
                var hash = location.hash;

                if (Boolean(hash)) {
                    var navData = this.navData;


                    var len = navData.length;
                    for (var i = 0; i < len; i++) {
                        var item = navData[i].item
                        if (item) {
                            for (var j = 0; j < item.length; j++) {
                                var lj = item[j].hash
                                if (hash == lj) {
                                    _self.itemShow = i;
                                    _self.navs = i;
                                    //是导航再点进去的页面
                                    var has = hash.split("/");
                                    if (has.length > 3) {
                                        _self.navItems = has[3];
                                    } else {
                                        _self.navItems = j;
                                    }

                                    _self.pageSrc = navData[i].item[j].src;
                                    break
                                }
                            }

                        } else { //没有子元素

                            var lj = _self.navData[i].hash
                            if (hash == lj) {
                                _self.navs = i;
                                _self.itemShow = false;
                                _self.pageSrc = _self.navData[i].src
                                break
                            }
                        }
                    }
                } else {
                    _self.pageSrc = "home.html"
                }
                ;

                window.onpopstate = function () {
                    var jsons = window.history.length;


                    var hash = location.hash;
                    if (Boolean(hash)) {

                        var navData = _self.navData;

                        var len = navData.length;
                        for (var i = 0; i < len; i++) {
                            var item = navData[i].item
                            if (item) {
                                for (var j = 0; j < item.length; j++) {
                                    var lj = item[j].hash
                                    if (hash == lj) {
                                        _self.itemShow = i;
                                        _self.navs = i;
                                        _self.navItems = j;
                                        //					_self.pageSrc = navData[i].item[j].src;
                                        break
                                    }
                                }

                            } else { //没有子元素
                                var lj = _self.navData[i].hash
                                if (hash == lj) {

                                    _self.navs = i;
                                    _self.itemShow = false;
                                    //					_self.pageSrc = _self.navData[i].src
                                    break
                                }
                            }
                        }
                    } else {
                        _self.pageSrc = _self.navData[0].src;
                        _self.navs = 0;
                        _self.itemShow = false;
                        _self.navItems = false;
                    }
                    ;

                }

            },
            methods: {
                allFn: function () {
                    this.togle = false;
                },
                navWidth: function () {
                    this.navState = !this.navState
                    this.navMouse = !this.navMouse
                },

                navMouseFn: function () {
                    var navMouse = this.navMouse;
                    if (navMouse) {
                        this.navState = !this.navState
                    }

                },


                navChoice: function (index) {
                    var item = this.navData[index].item
                    if (item) {
                        var numb = this.itemShow
                        this.itemShow = parseInt(index) == numb ? false : parseInt(index);
                    } else {

                        this.navs = parseInt(index);
                        this.itemShow = false;
                        this.pageSrc = this.navData[index].src

                    }

                },
                navItemChoice: function (index) {

                    this.navs = this.itemShow;
                    this.navItems = index;
                    this.pageSrc = this.navData[this.navs].item[index].src;
                    var urls = this.navData[this.navs].item[index].src


                },
                /*ndMouseover: function() {


                    var timer = this.timer
                    clearTimeout(timer);
                    $("#touding").css({ "background": "#fff" });
                    $("#text").css({ "color": "#06c1ae" });
                    $("#Defkjw").css({ "display": "block" });


                    // 关闭定时器


                },
                ndMouseout: function() {
                    var timer = this.timer
                    timer = setTimeout(function() {
                        $("#touding").css({ "background": "#06c1ae" });
                        $("#text").css({ "color": "#fff" });
                        $("#Defkjw").css({ "display": "none" });

                    }, 800);
                },*/
                passWordClick: function () {
                    window.parent.location.href = "https://www.aftdc.com/business/Index/index.html#/Act/Num";
                    top.location.reload();
                    // location.href='/business/Store/ActNum.html'
                    if (app.itemShow == 8 && app.navItems == 0) {

                        $('#iframe').contents().find(".this_kiai").show();
                        $('#iframe').contents().find(".this_ini").hide();
                    } else {
                        window.localStorage.setItem("revise", "1")
                        app.itemShow = 8;
                        app.navItemChoice(0);
                    }

                },
                phoneClick: function () {
                    window.parent.location.href = "https://www.aftdc.com/business/Index/index.html#/Act/Num";
                    top.location.reload();
                    // $('#iframe').attr('src', '/business/Store/ActNum.html');
                    if (app.itemShow == 8 && app.navItems == 0) {

                        $('#iframe').contents().find(".this_ini").show();
                        $('#iframe').contents().find(".this_kiai").hide();
                    } else {
                        window.localStorage.setItem("revise", "11")
                        app.itemShow = 8;
                        app.navItemChoice(0);
                    }
                },
                btnClick: function () {
                    var number = $(".form-control").val();
                    if (number == '') {
                        alert('请输入手机号或订单号！')
                        return false;
                    } else {
                        sessionStorage.setItem("phoneOrder", number);
                        window.parent.location.href = "https://www.aftdc.com/business/Index/index.html#/order/History";
                        top.location.reload();
                    }
                    // var dd='/business/Ordersa/orderHistory.html?phone='+number
                    // $('#iframe').attr('src',dd);
                    // window.parent.location.href='https://www.aftdc.com/business/Ordersa/orderHistory.html?phone='+number;
                    // alert(number)
                    // axios({
                    //     method: "post",
                    //     url: "https://www.aftdc.com/Business/Ordersa/history", //接口未修改
                    //     data: {
                    //         phone: number
                    //     }
                    // }).then(function (res /*原来为data*/) {
                    //     console.log(res);
                    //
                    //         var test = window.location.href;
                    //         var lianjie = "https://www.aftdc.com/business/Index/index.html#/order/History";
                    //         if (test == lianjie) {
                    //             top.location.reload();
                    //         } else {
                    //             window.parent.location.href = "https://www.aftdc.com/business/Index/index.html#/order/History";
                    //             top.location.reload();
                    //             // window.location.href="http://aftdc.com/index.php/Business/ShopSa/index#/order/History";
                    //         }
                    // })

                },
                kqClick: function () {
                    var shopAtive = 1;
                    // alert(number)
                    axios({
                        method: "post",
                        url: "https://www.aftdc.com/Business/Index/shopAtive", //接口未修改
                        data: {
                            shopAtive: shopAtive,
                            token: shopData.token,
                        }
                    }).then(function (res) {
                        if (res.data.res == 1) {
                            location.reload()
                        } else if (res.data.res == -1) {
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href = "/business/Login/index.html";
                        } else {
                            alert('出错了')
                        }
                    })
                },
                ActMesgClick: function () {
                    window.parent.location.href = "https://www.aftdc.com/business/Index/index.html#/Act/Mesg";
                    top.location.reload();

                },
                tzClick: function () {
                    var shopAtive = 0;
                    // alert(number)
                    axios({
                        method: "post",
                        url: "https://www.aftdc.com/Business/Index/shopAtive", //接口未修改
                        data: {
                            shopAtive: shopAtive,
                            token: shopData.token,
                        }
                    }).then(function (res) {

                        if (res.data.res == 1) {
                            location.reload()
                        } else if (res.data.res == -1) {
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href = "/business/Login/index.html";
                        } else {
                            alert('出错了')
                        }
                    })

                },
                xxClick: function () {
                    alert('店铺正在休息中，如需开启营业请重新设置营业时间！')
                },
                loginoutClick: function () {
                    location.href = '/business/Login/index.html';
                },
                mdMouseover: function () {
                    var that = this
                    clearTimeout(that.timer); // 关闭定时器
                    $('#touding').css("background", '#fff');
                    $('#text').css("color", '#06c1ae');
                    $('#Defkjw').css("display", 'block');

                },
                mdMouseout: function () {
                    var that = this
                    var timer = that.timer
                    timer = setTimeout(function () {
                        $('#touding').css("background", '#06c1ae');
                        $('#text').css("color", '#fff');
                        $('#Defkjw').css("display", 'none');

                    }, 800);
                    that.timer = timer;
                },

                //分店检测权限
                /*navTest:function(){
                var that=this
                axios({
                    method:"post"
                    url:"https://www.aftdc.com/index.php/Business/Index/author",
                    data:'',
                }).then(function (res) {
                    if(res.type=="not_main"){
                       var all=res.author_list_all;
                        var lena=all.length;
                        var navData=that.navData;

                       var lenn=navData.length;
                        for(var i=0;i<lenn;i++){
                             var name_n=navData[i].name
                            for(let j=0;j<lena;j++){
                                var name_a=all[j].name;
                                if(name_n==name_a){
                                    if(all[j].have){
                                        var child=list_all[i].children;
                                        if(Boolean(child)){
                                            let chiL=child.length;
                                            var item=navData[i].item
                                            if(item){
                                             for(var z=0;z<chiL;z++){
                                                var namec=child.name;
                                                for(var k=0;k<item;k++){
                                                    if(namec==item.name){
                                                        if(!child[i].have){
                                                            navData[i].item.splice(k,1)
                                                        }
                                                    }
                                                }
                                             }
                                            }

                                        }

                                    }else{
                                         navData.splice(i,1);
                                         i--
                                         lenn=lenn-1

                                    }
                                    break
                                }
                            }
                        }

                       that.navData=navData



           //             for(let i=0;i<lena;i++){
                             // var name=list_all[i].name;
                             // var have=list_all[i].have;
                             // if(!have){
                             // 	var obj={name:name,have:have};
                             //     all.push(new Object(obj));
                             // }else{
                             // 	var child=list_all[i].children;
                             // 	if(child){
                             // 		var clen=child.length;
                             // 		for(let j=0;j<clen;j++){
                             // 			var name_c=child[j].name;
                             // 			var have_c=child[j].have;
                             // 			var chobj={name:name_c,have:have_c};
                             // 			all.push(new Object(chobj));
                             // 		}
                             // 	}
                             // }

           //             }


                      }
                })


            }*/
            },
            mounted: function () {
                // var oDiv1 = document.getElementById('nameser');
                // var oDiv2 = document.getElementById('Defkjw');
                // var oDiv3 = document.getElementById('touding');
                // var oDiv4 = document.getElementById('text');
                //
                // var timer = null;
                // oDiv2.onmouseover = oDiv1.onmouseover = function () {
                //     clearTimeout(timer); // 关闭定时器
                //
                //     oDiv3.style.background = '#fff';
                //     oDiv4.style.color = '#06c1ae';
                //
                //     oDiv2.style.display = 'block';
                // }
                // oDiv2.onmouseout = oDiv1.onmouseout = function () {
                //     timer = setTimeout(function () {
                //
                //         oDiv3.style.background = '#06c1ae';
                //         oDiv4.style.color = '#fff';
                //
                //         oDiv2.style.display = 'none';
                //     }, 800);
                // }
            },
        });
    }
}

//
//		window.onpopstate = function() {
//			var hash = location.hash
//			var index = hash.substring(hash.indexOf('n') + 1)
//			index = index==0||Boolean(index) ? index : 'err'
//			var nanIndex = isNaN(index)
//			if(!nanIndex) { //点击的是外层li
//				var has = _self.navData[index].hash;
//				_self.navChoice(index);
//				if(Boolean(has)) {
//					_self.nextHash = hash;
//					location.hash = has;
//					_self.nextIndex=index;
//				} else {
//					if(Boolean(_self.nextHash)){
//						location.hash = _self.nextHash;
//					}else{
//
//					}
//				}
//			}else if(index!='err'){
//				console.log("123")
//			}
//
//		}