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
                userId: '',
                dataOr: '',
                dataUi: {},
                hongbao: {},
                jifen: {},
                datas: '',//浏览历史数据
                geographic: '',

            },
            created: function () {
                var that = this

                that.userId = admin.userId;
                that.geographic = window.localStorage.getItem("geographic");
                axios({
                    method: "post",
                    url: "/pc/Order/onlyconter",
                    data: {
                        userId: that.userId,
                    }
                }).then(function (res) {
                    console.log(res)
                    if (res.data.res == 1) {
                        that.dataOr = res.data.data.orderList;
                        for(var i=0;i<that.dataOr.length;i++){
                            var timestamp = Date.parse(new Date())/1000;
                            var createTime=new Date(res.data.data.orderList[i].createTime)
                            createTime=createTime.getTime()/1000
                            if( that.dataOr[i].orderStatus=='等待付款'&&timestamp-createTime>900){
                                that.dataOr[i].orderStatus='已取消'
                            }
                        }
                    }
                    that.dataUi = res.data.data.userinfo;
                    console.log(that.dataUi)
                    that.hongbao = res.data.data.userinfo.hongbao.instigate;

                    that.jifen = res.data.data.userinfo.jifen
                    axios({//浏览历史
                        method: "post",
                        url: "/pc/Order/getHistory",
                        data: {
                            userId: that.userId,

                        }
                    }).then(function (res) {
                        console.log(res)
                        if (res.data.res == 1) {
                            that.datas = res.data.data;

                        }

                    })

                })

            },
            methods: {
                comin: function () {
                    $('.fudong').show();
                },
                conout: function () {
                    $('.fudong').hide();
                },
                dingdanxiangqinClick: function (item) {
                    location.href = '/pc/dingdanxiangqin.html?orderId=' + item.orderId;
                },
                shopImgClick: function (item) {
                    location.href = '/pc/shop.html?shopId=' + item.shopId;
                },
                addressclick: function () {
                    location.href = "/pc/home.html"
                },
                you_mszjClick: function () {
                    var that = this
                    location.href = '/pc/shop.html?shopId=' + that.datas.shopId;

                },

            },
            updated:function () {
                var that=this
                if(that.jifen.length>2){


                var liHeight = $('#ulContent li').height();
                var elHeight=$('#ulContent_er li').height();
                $('#ulContent').lSlide({nTop:liHeight});
                $('#ulContent_er').lSlide({nTop:elHeight});
                }
            }
        })
    }
}