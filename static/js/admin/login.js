window.onload = function(){
    var app=new Vue({
        el:"#app",
        data:{
            loginName:'',
            loginPwd:'',
        },
        methods:{
            login:function(){
                if(this.loginName==''||this.loginPwd==''){
                    alert('请填写完整');
                    return;
                }
                var loginName=this.loginName
                var loginPwd=this.loginPwd
                axios({
                    method: "POST",
                    url: "https://www.aftdc.com/aftdcAControl/Login/Login",
                    data: {
                        loginName:loginName,
                        loginPwd:loginPwd,
                    },
                }).then(function (res) {
                    if(res.data.res==1){
                        localStorage.setItem('adminData',JSON.stringify(res.data.data))
                        location.href="../Index/index.html"
                    }else{
                        alert("登录失败")
                    }
                })
            },
        }
    })
}

