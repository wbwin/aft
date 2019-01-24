window.onload = function() {

        var app = new Vue({
            el: "#dec",
            data: {
                phone: '',
                enter: '',
                again: '',
                myhandle: '',
            },
            created: function () {
                var phone = sessionStorage.getItem("phone");

                if (!phone) {
                    alert('缺少重要数据');
                    return false
                }
                var that = this;
                that.phone = phone;
                var that = this;
                $(document).keyup(function (e) {//捕获文档对象的按键弹起事件
                    if (e.keyCode == 13) {//按键信息对象以参数的形式传递进来了
                        //此处编写用户敲回车后的代码
                        that.password()
                    }
                });
            },
            //生命周期+
            // beforeDestroy: function(){
            //    bus.$off('get', this.myhandle);
            // },
            methods: {
                myhandle: function (val) {
                    console.log(val, '这是从上个页面传递过来的参数')
                },
                //保存密码
                password: function () {
                    var that = this;
                    var enter = that.enter;
                    var again = that.again;

                    var phone = that.phone;
                    if (!again) {
                        alert('请输入密码')
                        return false
                    }
                    if (enter != again) {
                        alert('密码不相等')
                        return false
                    }
                    axios({
                        url: 'https://www.aftdc.com/business/Recovery/alter_password',
                        method: 'post',
                        data: {
                            phone: phone,
                            login_password: again,

                        },
                    }).then(function (res) {

                        if (res.data.res == 1) {
                            alert(res.data.info)
                            location.href = "https://www.aftdc.com/business/Login/index.html";
                        } else {
                            alert(res.data.info)
                        }
                    })
                }
            },
        })

}