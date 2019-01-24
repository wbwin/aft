window.onload = function(){
    var shopData = JSON.parse(localStorage.getItem('shopData'));
    if(!shopData){
        location.href="/business/Login/index.html";
    }else {
        var app = new Vue({
            el: '#eait',
            data: {
                state: false,
                id: '',
            },
            created: function () {
                var that = this;
            },
            methods: {
                getType: function (obj) {
                    $('.deskType').text(obj.target.innerText)
                },

                editDesk: function () {

                    var that = this;
                    var state = that.state;
                    var id = that.id;
                    var deskNum = $('input[name=deskNum]').val()
                    var deskName = $('input[name=deskName]').val()
                    var deskPersonNum = $('input[name=deskPersonNum]').val()
                    var deskType = $('.deskType').text();
                    if (deskType == '请选择类型') {
                        alert('请选择类型')
                        return false
                    }
                    if (!deskPersonNum || !deskName || !deskNum) {
                        alert('请填写完整');
                        return false
                    }
                    var url = '/Business/Canteen/editDesk'; //新增
                    var data = {
                        id: id,
                        deskNum: deskNum,
                        deskName: deskName,
                        deskPersonNum: deskPersonNum,
                        deskType: deskType,
                        token:shopData.token
                    }
                    //state 全局变量，页面加载有缓存就是编辑座位
                    if (that.state == true) {
                        url = "/Business/Canteen/changeDesk"; //编辑
                        data.id = id
                    }
                    axios({
                        method: "post",
                        url: url,
                        data: data,
                    }).then(function (res) {
                        if (state == true) {
                            if (res.data.res == 1) {
                                alert('修改成功！')
                                location.href = './ActDesk.html'
                            }else if(res.data.res == -1){
                                alert(res.data.reason)
                                localStorage.removeItem('shopData');
                                location.href="/business/Login/index.html";
                            }  else {
                                alert('修改失败！')
                            }
                        }else {
                            if (res.data.res == 'success') {
                                alert('添加成功！')
                                location.href = './ActDesk.html'
                            } else {
                                alert('添加失败！')
                            }
                        }
                    })
                }

            },
            mounted: function () {

                var that = this;
                var desk = window.localStorage.getItem("desk");
                var id = that.id;
                if (Boolean(desk)) {
                    desk = JSON.parse(desk)
                    window.localStorage.removeItem("desk");
                    $('input[name=deskNum]').val(desk.deskNum)
                    $('input[name=deskName]').val(desk.deskName)
                    $('input[name=deskPersonNum]').val(desk.deskPersonNum)
                    $('.deskType').text(desk.deskType);
                    that.state = true;
                    that.id = desk.id
                }

                var dd = new DropDown($('#dd'));
                $(document).click(function () {
                    // all dropdowns
                    $('.wrapper-dropdown-2').removeClass('active');
                });

                function DropDown(el) {
                    this.dd = el;
                    var obj = this;

                    obj.dd.on('click', function (event) {
                        $(this).toggleClass('active');
                        event.stopPropagation();
                    });
                }
            }
        })
    }
}