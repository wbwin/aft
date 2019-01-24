window.onload = function() {
    var app = new Vue({
        el: '.preOrder',
        data: {
            display:'none',
        },
        methods: {
            XinSonClick: function() {
                var Onefu = $('input[name="Fruit"]').is(':checked'); // 复选框 一个 选中
                //console.log(Onefu);
                if (Onefu == false) {
                    alert('请选择服务协议!!!');
                } else {
                    location.href = './thedata.html';
                }
            },
            XouferClick: function() {
                // 点击【×】 关闭弹出框
                this.display='none';
            },
            QuxaClick: function() { // 点击【取消】 关闭弹出框
                this.display='none';

            }
        }
    })
}