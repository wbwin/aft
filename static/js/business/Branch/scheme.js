var app = new Vue({
    el: "#scheme",
    data: {
        title: ["门店信息", "资质信息", "合作方案"],
        serveData: ['顾客在线支付', '在线结算', '享受优质商家排名', '专享活动'],
        choice: 0, //配送选择 1为商家配送，2为阿凡提配送

        choiceTxt: [{
                name: '商家配送',
                per: '堂食、外卖每单收取3%服务费',
                shili: ['假设今日在线支付营业额4000元', '应收服务费4000*3.00%=120.00元']
            },
            {
                name: '阿凡提配送',
                per: '堂食每单收取3%服务费，外卖每单收取13%服务费',
                shili: ['假设今日堂食支付营业额4000元', '应收服务费4000*3.00%=120.00元',
                    '假设今日外卖支付营业额3000元', '应收服务费4000*13.00%=520.00元'
                ]
            }
        ],
        giveDate: {},
        togle: 0, //弹框选择的显示隐藏。

    },
    created: function() {


    },
    methods: {

        giveChange: function(index) {
            this.choice = index
        },
        priceDetail: function(index) {
            this.giveDate = this.choiceTxt[index];
            this.togle = 1;
        },
        closeModel: function() {
            this.togle = 0;
        },

        //提交
        submit: function() {
            var choice = this.choice;
            if (choice == '') {
                alert('请选择合作方案')
                return false;
            }
            var shopId = window.localStorage.getItem("shopId");
            axios({
                methods: "post",
                url: "/index.php/Business/Branch/distribution",
                data: {
                    choice: choice,
                    shopId: shopId
                },
            }).then(function(res) {
                // that.clasifyData= res;
                if (res.code == 1) {
                    alert(res.info)
                    window.parent.location.hash = "#/Branch/wait/1"
                    location.href = "/index.php/Business/Branch/wait";
                } else {
                    alert(res.info)
                    window.parent.location.hash = "#/Branch/wait/1"
                    location.href = "/index.php/Business/Branch/wait";
                }
            })
            
        },


    }

})