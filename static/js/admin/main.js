window.onload = function(){
    var adminData = JSON.parse(localStorage.getItem('adminData'));
    if(!adminData){
        location.href="../Login/login.html";
    }else {
        var app = new Vue({
            el: "#app",
            data: {
                adminData: ''
            },
            created: function () {
                var that = this
                axios({
                    method:"post",
                    url:"https://www.aftdc.com/aftdcAControl/Config/main",
                    data:{
                        adminNum:adminData.adminNum,
                        token:adminData.token
                    }
                }).then(function(res){
                    if(res.data.res==1){
                        that.adminData=res.data.data
                    }else if(res.data.res == -1){
                        alert(res.data.reason)
                        localStorage.removeItem('adminData');
                        location.href="../Login/login.html";
                    }
                })
            }
        })
    }
}