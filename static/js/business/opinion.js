window.onload = function() {


    var app = new Vue({
        el: "#opinion",
        data: {
            clasData: ["配送问题", "投诉业务经理", "功能改善建议", "其他问题"],
            clasIndex: -1,
            clasIfy: '',
            detailPro: '',
            phone: '',
            imgData: [], //提交图片的数据
            disabled:false,

        },
        created: function() {},
        methods: {
            clasChoice: function(index) {
                var txt = this.clasData[index]
                this.clasIndex = index;
                this.clasIfy = txt;
            },
            //详细问题
            bindTextAreaBlur: function(e) {
                var val = e.detail.value
                this.setData({
                    detailPro: val
                })
            },
            //上传图片
            uploadImg: function(event) {
                var that = this
                var target = event.target
                var tempFilePaths = target.files;
                var imgData = this.imgData;

                //这不能用concat合并，tempFilePaths的格式为object
                var lentemp = tempFilePaths.length
                for (var i = 0; i < lentemp; i++) {
                    imgData.push(tempFilePaths[i])
                }
                var len = imgData.length
                if (len > 9) {
                    imgData.splice(0, len - 9)
                }
                this.imgData = imgData;
            },
            imgReturn: function(datas) {
                var url = window.URL.createObjectURL(datas);
                return url
            },
            //删除图片
            closeImg: function(index) {
                var imgData = this.imgData;
                imgData.splice(index, 1);
                this.imgData = imgData
            },
            //手机号
            phoneBlur: function(e) {

                var val = e.detail.value;
                this.setData({
                    phone: val,
                })
            },

            myOpinionClick:function () {
                location.href='/business/Opinion/myOpinion.html';
            },

            submitBut: function(e) {
                var that = this;
                that.disabled = true;
                var clasIfy = this.clasIfy; //反馈类型
                var detailPro = this.detailPro //详细描述
                var phone = this.phone; //手机号码
                var imgData = this.imgData; //图片

                if (!Boolean(clasIfy)) {
                    alert("请选择反馈类型");
                    return false;
                }
                if (!Boolean(detailPro)) {
                    alert("请填写详细描述");
                    return false;
                }
                if (!Boolean(phone)) {
                    alert("请输入号码");
                    return false;
                }
                if (!(/^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9])|(17[0-9]))\d{8}$/.test(phone))) {
                    alert("号码不正确");
                    return false;
                }
                var suffi = [];
                if (imgData.length<1){
                    alert("至少一张照片");
                    return false;
                }
                for (var i = 0;i<imgData.length;i++){
                    console.log(imgData[i].name)
                    var filename = imgData[i].name;//门脸
                    var index1 = filename.lastIndexOf(".");
                    var index2 = filename.length;
                    suffi[i] = filename.substring(index1, index2);//后缀名
                }
                var suffix = JSON.stringify(suffi)

                axios({
                    url:'https://www.aftdc.com/business/Feedback/feedback',
                    method:'post',
                    data:{
                        feedbackType:clasIfy,
                        content:detailPro,
                        userPhone:phone,
                    }
                }).then(function(res){
                    var feedbackId = res.data.feedbackId;
                    var cover_i = JSON.stringify(cover_name)
                    if(res.data.res == 1){
                        axios({
                            url:'https://www.aftdc.com/business/Feedback/suffix',
                            method:'post',
                            data:{
                                suffix:suffix,
                            }
                        }).then(function(res){
                            var img = "";
                            var b = 0;
                            for(var i = 0;i<imgData.length;i++){
                                img += res.data.url[i]+'.';
                                var formData = new FormData();
                                formData.append("key",res.data.url[i]);
                                formData.append("policy",res.data.oss.policy);
                                formData.append("OSSAccessKeyId",res.data.oss.accessid);
                                formData.append("success_action_status",'200');
                                formData.append("signature",res.data.oss.signature);
                                formData.append("file",imgData[i]);
                                axios({
                                    method: "post",
                                    url: res.data.oss.host,
                                    data: formData,
                                    processData: false,
                                    contentType: false,
                                }).then(function(res){
                                    var url = img.substr(0,img.length-1);
                                    if (res.status == 200){
                                        b++
                                        if (b == imgData.length){
                                            axios({
                                                url:'https://www.aftdc.com/business/Feedback/feedbacks_img',
                                                method:'post',
                                                data:{
                                                    img:url,
                                                    feedbackId:feedbackId,
                                                }
                                            }).then(function(res){
                                                if (res.data.res == 1){
                                                    alert(res.data.info)
                                                    top.location.reload()
                                                } else {
                                                    alert(res.data.info)
                                                    that.disabled = false;
                                                }
                                            })
                                        }
                                    } else {
                                        alert('oss上传失败')
                                        that.disabled = false;
                                    }
                                })
                            }
                        })
                    } else {
                        alert(res.data.info)
                        that.disabled = false;
                    }
                })
            },

        },



    })

}