window.onload=function () {
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
        var  storage = window.localStorage;
        storage.removeItem('jumpUrl')
        storage.setItem("jumpUrl", test);
        console.log(test)
        location.href = "/pc/login.html";
    } else {
        var app = new Vue({
            el: '#app',
            data: {
                userId: '',
                dataz:{},
                geographic:'',
                pags:0,
            },
            created: function () {
                var that = this
                that.userId = admin.userId;
                that.geographic = window.localStorage.getItem("geographic");
                var url = location.search;
                var pags = url.substr(1);
                that.pags = pags.replace('pags=', '');
                console.log( that.pags)

            },
            methods:{
                addressclick:function () {
                    location.href = "/pc/home.html"
                },
                contactpage:function (index) {
                    var that=this
                    that.pags=index
                },
                joinClick:function (index) {

                    location.href='/pc/agent.html';
                },
                helpClick:function (index) {

                    location.href='/pc/server.html';
                },
            },
        })
    }
}