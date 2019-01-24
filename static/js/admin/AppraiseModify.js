window.onload = function(){
    var adminData = JSON.parse(localStorage.getItem('adminData'));
    if(!adminData){
        location.href="../Login/login.html";
    }else {
        var app = new Vue({
            el: "#app",
            data: {
                goods: {},//数据
                hints: ['', '很不满意', '不满意', '一般', '满意', '非常满意'],
            },
            created: function () {
                var goods = window.localStorage.getItem("goods");
                if (Boolean(goods)) {
                    var data = JSON.parse(goods);
                    //鼠标经过的星星数
                    data.goodsHover = data.goodsScore;
                    data.timeHover = data.timeScore;
                    data.serviceHover = data.serviceScore;
                    this.goods = data;
                } else {
                    window.history.go(-1);
                }


            },
            methods: {
                mouseover: function (name, index) {
                    this.goods[name] = index + 1
                },
                mouseout: function (name) {
                    var names = name.substring(0, name.indexOf('Hover'));
                    names = names + "Score",
                        this.goods[name] = this.goods[names]
                },
                //点击星星
                changeStars: function (name, index) {
                    this.goods[name] = index + 1
                },

                keeps: function () {
                    var data = {
                        adminNum:adminData.adminNum,
                        token:adminData.token
                    }
                    var goods = this.goods
                    data.id = goods.id
                    data.goodsScore = goods.goodsScore
                    data.serviceScore = goods.serviceScore
                    data.timeScore = goods.timeScore
                    data.content = goods.content
                    data.isShow = goods.isShow;

                    axios({
                        method: "POST",
                        url: 'https://www.aftdc.com/aftdcAControl/Goods/AppraisesEdit',
                        data: data,
                    }).then(function (res) {
                        if (res.data.res == 1) {
                            alert("成功");
                            window.history.go(-1);
                        }else if(res.data.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('adminData');
                            location.href="../Login/login.html";
                        }
                    })
                },
                close: function () {
                    window.history.go(-1);
                }
            }
        })
    }
}