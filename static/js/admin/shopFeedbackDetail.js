window.onload = function(){
    var adminData = JSON.parse(localStorage.getItem('adminData'));
    console.log(localStorage.getItem('feedbackDetail'))
    var shopFeedbackDetail = JSON.parse(localStorage.getItem('feedbackDetail'))
    localStorage.removeItem('feedbackDetail');
    if(!adminData){
        location.href="../Login/login.html";
    }else {
        var app = new Vue({
            el: "#app",
            data: {
                shopFeedbackDetail:'',
                reply:''
            },
            created: function () {
                this.shopFeedbackDetail = shopFeedbackDetail;
                if (typeof(shopFeedbackDetail.adminReply) === "string")
                    this.reply = shopFeedbackDetail.adminReply
            },
            methods: {
                replay:function(){
                    var that = this;
                    axios({
                        method: "post",
                        url: 'https://www.aftdc.com/aftdcAControl/Feedback/shopRepply',
                        data: {
                            feedbackId: that.shopFeedbackDetail.feedbackId,
                            business_id: that.shopFeedbackDetail.business_id,
                            reply:that.reply,
                            adminNum:adminData.adminNum,
                            token:adminData.token
                        }
                    }).then(function (res) {
                        if (res.data.res === 1) {
                            alert("回复成功" + res.data.info);
                            that.forwardNews(res.data.imei.imei);
                            location.href="./shopFeedback.html";
                        }else if(res.data.res === -1){
                            alert(res.data.reason);
                            localStorage.removeItem('adminData');
                            location.href="../Login/login.html";
                        } else if (res.data.res === 0) {
                            alert("回复失败" );
                        }
                    })
                },
            }
        })
    }
}