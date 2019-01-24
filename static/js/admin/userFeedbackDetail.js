window.onload = function(){
    var adminData = JSON.parse(localStorage.getItem('adminData'));
    console.log(localStorage.getItem('feedbackDetail'))
    var userFeedbackDetail = JSON.parse(localStorage.getItem('feedbackDetail'))
    localStorage.removeItem('feedbackDetail');
    if(!adminData){
        location.href="../Login/login.html";
    }else {
        var app = new Vue({
            el: "#app",
            data: {
                userFeedbackDetail:'',
                reply:''
            },
            created: function () {
                this.userFeedbackDetail = userFeedbackDetail
                if(typeof(userFeedbackDetail.replay)=='string')
                   this.reply =  userFeedbackDetail.replay
            },
            methods: {
                replay:function(){
                    var that = this;
                    console.log(this.reply)
                    axios({
                        method: "post",
                        url: 'https://www.aftdc.com/aftdcAControl/Feedback/userRepply',
                        data: {
                            feedbackId: that.userFeedbackDetail.id,
                            reply:that.reply,
                            adminNum:adminData.adminNum,
                            token:adminData.token
                        }
                    }).then(function (res) {
                        if (res.data.res == 1) {
                            alert("回复成功");
                            location.href="./userFeedback.html";
                        }else if(res.data.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('adminData');
                            location.href="../Login/login.html";
                        }
                    })
                }

                }
        })
    }
}