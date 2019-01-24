
window.onload = function(){
    var shopData = JSON.parse(localStorage.getItem('shopData'));
    if (!shopData) {
        location.href = "/business/Login/index.html";
    } else {
    var app = new Vue({
        el:'app',
        data:{
          list:[],
            checkbox:[]
        },
        created:function(){
            var that = this
            axios({
                method:'post',
                url:'https://www.aftdc.com/Business/Kufu/userList',
                data:{
                    token: shopData.token
                }
            }).then(function(res){
                that.list = res.data.data
            })
        },
        methods:{
            choiceAll:function(){
                var that = this;
                for(var i=0;i<that.list.length;i++)
                 {
                    that.checkbox[i] = that.list[i].userId;
                 }
            }
        }

    })
}