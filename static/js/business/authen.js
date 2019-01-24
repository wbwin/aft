window.onload = function () {
    var shopData = JSON.parse(localStorage.getItem('shopData'));
    if (!shopData) {
        location.href = "/business/Login/index.html";
    } else {

            var app = new Vue({
                el: '#doc',
                data: {
                    display: 'none',
                    CunTern: 'none',
                    type: '',//类型
                    license: '',//请输入工商执照注册号,
                    operator: '',//请输入经营者姓名
                    General: '',//一般经营范围
                    approved: '',//前置许可经营范围
                    account: '',//开户名称
                    bank: '',//开户银行
                    number_bank: '',//银行账号
                    Contact_name: '',//联系人姓名
                    phone: '',//联系人手机号码
                    landline: '',//联系人座机
                    Emailo: '',//联系人电子邮箱
                    transaction_id: '',//订单
                    state: '',//审核情况
                    money: '',//已付金额
                    Individual: '',//个体工商户营业执照
                    other: '',//其他证明材料
                    start_time: '',//开始时间
                    paper: '',//发票
                    put: '',//是否开通
                },
                created: function () {
                    var that = this;
                    axios({
                        url: 'https://www.aftdc.com/business/Certification/open_prove',
                        method: 'post',
                        data: {token: shopData.token},
                    }).then(function (res) {
                        that.put = res.data.info;
                    if(res.data.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href="/business/Login/index.html";
                        }

                    })
                },
                methods: {
                    //开通
                    opkaiClick: function () {
                        var that = this;
                        axios({
                            url: 'https://www.aftdc.com/business/Certification/open_prove',
                            method: 'post',
                            data: {token: shopData.token},
                        }).then(function (res) {
                            var all = res.data;
                            if (all.res == 1) {
                                that.display = '';
                            }else if(res.data.res == -1){
                                alert(res.data.reason)
                                localStorage.removeItem('shopData');
                                location.href="/business/Login/index.html";
                            }

                            else if (all.res == 2) {
                                alert(all.info);
                            } else {
                                alert(all.info);
                            }
                        })
                    },
                    //关闭
                    CuoinderClick: function () {
                        this.display = 'none';
                    },
                    //下一步
                    SenQinClick: function () {
                        location.href = "./Comder.html";
                    },
                    //查看订单
                    PeicheClick: function () {
                        var that = this;

                        axios({
                            url: 'https://www.aftdc.com/business/Certification/examine_order',
                            method: 'post',
                            data: {token: shopData.token},
                        }).then(function (res) {
                            if (res.data.res == 1) {
                                that.CunTern = '';
                                that.type = res.data.type;
                                that.license = res.data.license;
                                that.operator = res.data.operator;
                                that.General = res.data.General;
                                that.approved = res.data.approved;
                                that.account = res.data.account;
                                that.bank = res.data.bank;
                                that.number_bank = res.data.number_bank;
                                that.Contact_name = res.data.Contact_name;
                                that.phone = res.data.phone;
                                that.landline = res.data.landline;
                                that.transaction_id = res.data.transaction_id;
                                that.state = res.data.state;
                                that.money = res.data.money;
                                that.Individual = 'https://image.aftdc.com/' + res.data.Individual;
                                that.other = 'https://image.aftdc.com/' + res.data.other;
                                that.start_time = res.data.start_time;
                                that.paper = res.data.paper;
                                that.Emailo = res.data.Emailo;
                            }else if(res.data.res == -1){
                                alert(res.data.reason)
                                localStorage.removeItem('shopData');
                                location.href="/business/Login/index.html";
                            }

                            else {
                                alert(res.data.info)
                            }
                        })
                    },
                    //差掉订单信息
                    DetingClick: function () {
                        this.CunTern = 'none';
                    },
                },
            })
        }

}