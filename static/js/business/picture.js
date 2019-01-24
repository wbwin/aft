window.onload = function() {
    var shopData = JSON.parse(localStorage.getItem('shopData'));
    if (!shopData) {
        location.href = "/business/Login/index.html";
    } else {
        var app = new Vue({
            el: '.Sindre',
            data: {
                fruits: [],
                files: [],
                // foo: [{imgId: 1}],
                arr: [],
                dataz: '',
                fileUrl: [],
                pageNumb: 0, //总页数
                pageCurent: 1, //当前页
                pageEach: 2, //每一页显示数据条数
            },
            created: function () {
                var that = this
                that.pageFn(1);
            },
            methods: {
                //------------------------分页跳转------------------------------------
                pageFn: function (pageCurent) {

                    var that = this;
                    var page = (pageCurent - 1) * that.pageEach;
                    that.pageCurent = pageCurent;
                    axios({
                        method: "post",
                        url: "https://www.aftdc.com/business/Pictures/view",
                        data: {
                            page: page,
                            token:shopData.token,

                        },
                    }).then(function (res) {
                        if(res.data.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href="/business/Login/index.html";
                        }

                        that.dataz = res.data.data;
                        //初始化页数
                        var pageCount = Number(res.data.pageCount);
                        var pageEach = Number(res.data.pageEach);
                        that.pageEach = res.data.pageEach;
                        var pageNumb = Math.ceil(pageCount / that.pageEach)
                        that.pageNumb = pageNumb
                    })

                },

                //**********
                closeFnend: function (that, id) {

                    var that = this
                    var fruits = that.fruits;
                    var index = fruits.indexOf(id)

                    if (index >= 0) {
                        fruits.splice(index, 1)
                    } else {
                        fruits.push(id);
                    }

                    //        if($(that).siblings("div").hasClass("cdei")) {
                    //
                    //            $(that).siblings("div").removeClass('cdei');
                    //        }else{
                    //            $(that).siblings("div").addClass('cdei');
                    //
                    //        }
                },
                imgtogleClick: function (e) {
                    var target = e.currentTarget;

                    if ($(target).children("div").hasClass("cdei")) {
                        $(target).children("div").removeClass('cdei');
                    } else {
                        $(target).children("div").addClass('cdei');
                    }
                },
                Clicksend: function () {
                    var that = this;
                    var fruits = that.fruits;
                    if (fruits == '') {
                        alert('选择至少一张图片')
                        return false;
                    }
                    if (confirm('确定是否删除' + fruits.length + '张图片')) {
                        // console.log(fruits)
                        // return false;
                        var imgId = fruits.join(",");

                        axios({
                            method: "post",
                            url: "https://www.aftdc.com/business/Pictures/delete_img",
                            data: {
                                imgId: imgId,
                                token:shopData.token,
                            }
                        }).then(function (res) {
                            if (res.data.res == 1) {
                                alert('删除成功');
                                location.reload();
                            }else if(res.data.res == -1){
                                alert(res.data.reason)
                                localStorage.removeItem('shopData');
                                location.href="/business/Login/index.html";
                            } else {
                                alert('删除失败');
                            }
                        })

                    }
                },
                Clicks: function () {
                    $("#doc").click();
                },

                //下面用于多图片上传预览功能
                setImagePreviews: function (event) {
                    var that = this
                    $('.imgtogle').hide();
                    $('.text-center').hide();
                    var files = that.files;
                    var docObj = document.getElementById("doc");
                    // var dd = document.getElementById("dd");
                    // dd.innerHTML = "";
                    var fileList = docObj.files;
                    var len = fileList.length;
                    if (len > 9) {
                        alert('一次最多选择9张图片保存，已为您选择前9张图片')
                        len = 9
                    }
                    for (var i = 0; i < len; i++) {
                        files[i] = docObj.files[i];

                        var fil = files[i];

                        var reader = new FileReader();
                        reader.readAsDataURL(fil);
                        that.reader(reader);


                        // dd.innerHTML += "<div style='float:left;position: relative;' > <img id='img" + i + "' /> <span class=\"close1\" @click=\"closeFn(i)\" style=\"display: inline;\">X</span> </div>";
                        // var imgObjPreview = document.getElementById("img" + i);
                        // if (docObj.files && docObj.files[i]) {
                        //     //火狐下，直接设img属性
                        //     imgObjPreview.style.display = 'block';
                        //     imgObjPreview.style.width = '150px';
                        //     imgObjPreview.style.height = '150px';
                        //     imgObjPreview.style.border = '1px solid #000';
                        //     imgObjPreview.style.padding = '10px';
                        //     imgObjPreview.style.margin = '0 10px 10px 0';
                        //     //imgObjPreview.src = docObj.files[0].getAsDataURL();
                        //     //火狐7以上版本不能用上面的getAsDataURL()方式获取，需要一下方式
                        //     imgObjPreview.src = window.URL.createObjectURL(docObj.files[i]);
                        // } else {
                        //     //IE下，使用滤镜
                        //     docObj.select();
                        //     var imgSrc = document.selection.createRange().text;
                        //     alert(imgSrc)
                        //     var localImagId = document.getElementById("img" + i);
                        //     //必须设置初始大小
                        //     localImagId.style.width = "150px";
                        //     localImagId.style.height = "180px";
                        //     //图片异常的捕捉，防止用户修改后缀来伪造图片
                        //     try {
                        //         localImagId.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";
                        //         localImagId.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = imgSrc;
                        //     } catch (e) {
                        //         alert("您上传的图片格式不正确，请重新选择!");
                        //         return false;
                        //     }
                        //     imgObjPreview.style.display = 'none';
                        //     document.selection.empty();
                        // }
                    }
                },
                reader: function (reader) {
                    var that = this
                    reader.onload = function () {
                        var url = reader.result;
                        that.fileUrl.push(url)


                    }
                },
                closeFn: function (index) {
// console.log(e.target.parent())
                    var fileUrl = this.fileUrl

                    fileUrl = fileUrl.splice(index, 1);
                    // this.$set(this.fileUrl, '', fileUrl);
                    var files = this.files;

                    files = files.splice(index, 1);
                    // this.$set(this.file, '', files);
                },
                save: function () {
                    var that = this
                    var files = this.files;
                    if (confirm('确定是否保存图片')) {
                        if (files == '') {
                            alert('请上传至少一张')
                            return false;
                        }
                        var formData = new FormData();
                        for (var i = 0; i < files.length; i++) {
                            formData.append("file[]", files[i]); //图片路径
                        }

                        for (var i = 0; i < files.length; i++) {
                            var houzui = files[i].name.split(".")[1];
                            var file = files[i];

                            that.axiosFn(file, houzui)
                        }

                        alert('保存成功')


                    }
                },
                axiosFn: function (file, houzui) {
                    axios({
                        method: "post",
                        url: "https://www.aftdc.com/business/Pictures/upload1",
                        data: {
                            houzui: houzui,
                            token:shopData.token,
                        },
                    }).then(function (res) {
                        if(res.data.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href="/business/Login/index.html";
                        }

                        var imgurl = res.data.imgName;//图片的路径
                        var formData = new FormData();
                        formData.append("key", res.data.dir + '/' + res.data.imgName);
                        formData.append("policy", res.data.policy);
                        formData.append("OSSAccessKeyId", res.data.accessid);
                        formData.append("success_action_status", '200');
                        formData.append("signature", res.data.signature);
                        formData.append("file", file);
                        formData.append("token", shopData.token);

                        axios({
                            method: "post",
                            url: res.data.host,
                            data: formData,
                            processData: false,
                            contentType: false,
                        }).then(function (res) {
                            if(res.data.res == -1){
                                alert(res.data.reason)
                                localStorage.removeItem('shopData');
                                location.href="/business/Login/index.html";
                            }


                            axios({
                                method: "post",
                                url: "https://www.aftdc.com/business/Pictures/upload2",
                                data: {
                                    imgName: imgurl,
                                    token:shopData.token,
                                }
                            }).then(function (res) {


                                if (res.data.res == 1) {

                                    window.location.reload();

                                }else if(res.data.res == -1){
                                    alert(res.data.reason)
                                    localStorage.removeItem('shopData');
                                    location.href="/business/Login/index.html";
                                } else {
                                    alert('保存失败！');
                                    return false;
                                }

                            })
                        })
                    })
                },

            },
        })
    }
}