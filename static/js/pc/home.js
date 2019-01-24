window.onload = function () {

    var app = new Vue({
        el: '#app',
        data: {
            lat: '',
            lng: '',
            title: [],
            lati: [],
            long: [],
            mapcity: '',
            addrData: [],
            loginName: '',
        },

        created: function () {
            var that = this

            var admin = window.localStorage.getItem('admin');
            var admin = JSON.parse(admin);
            if (admin) {
                that.loginName = admin.loginName
            }

            $.ajax({
                type: "get",
                url: "https://apis.map.qq.com/ws/location/v1/ip?&key=CLWBZ-O7HKP-GFHDX-VYRP7-D57KK-EOFRX&output=jsonp",
                dataType: 'JSONP',
                success: function (res) {
                    that.lat = res.result.location.lat
                    that.lng = res.result.location.lng
                    that.dp()
                }
            });
        },
        methods: {
            mr: function () {
                // 单选
                var that = this
                var singleSelect1 = $('#single-select-1').citySelect({
                    dataJson: cityData,
                    multiSelect: false,
                    shorthand: true,
                    search: true,
                    onInit: function () {
                        console.log(this)
                    },
                    onTabsAfter: function (target) {
                        console.log(target)
                    },
                    onCallerAfter: function (target, values) {
                        //					console.log(JSON.stringify(values))
                        console.log(values)
                        var val = values.name
                        $(".mapcity-current").text(val)
                        that.cityChoice()

                    }
                });
                // 单选设置城市
                singleSelect1.setCityVal(mapcity);

            },
            dp: function () {
                var that = this
                var locations = this.lat + "," + this.lng
                var data = {location: locations, key: "CLWBZ-O7HKP-GFHDX-VYRP7-D57KK-EOFRX", get_poi: 0}
                var url = "https://apis.map.qq.com/ws/geocoder/v1/?";
                data.output = "jsonp";
                $.ajax({
                    type: "get",
                    dataType: 'jsonp',
                    data: data,
                    jsonp: "callback",
                    jsonpCallback: "QQmap",
                    url: url,
                    success: function (json) {
                        var addrCit = json.result.address_component.city;
                        mapcity = addrCit
                        that.mr()
                        addrCit = addrCit.substring(0, addrCit.indexOf("市"))
                        $(".caiCity").text(addrCit)
                        $(".mapcity-current").text(addrCit)
                    },
                    error: function (err) {
                        alert("err")
                    }

                })

            },
            cityChoice: function (event) {
                event.cancelBubble = true;
                var mapcitySelect = $(".mapcity-select")
                mapcitySelect.toggle()
                $(".city-scrollbar").hide()
            },
            //隐藏city
            hidCityBox: function () {
                $(".mapcity-select").hide();
            },
            cits: function (obj) {
                $(".city-scrollbar").show()
                those = this
                var that = obj
                var valcity = $(".mapcity-current").text()  //地方
                var searchInput = $(".searchInput")
                var keyword = searchInput.val()
                if (keyword.length > 0) {
                    $.ajax({
                        type: "get",
                        url: "https://apis.map.qq.com/ws/place/v1/suggestion/?region=" + valcity + "&keyword=" + keyword + "&key=AQMBZ-L4FCO-4VNWY-S5SGC-BNSG7-ALBIS&output=jsonp",
                        dataType: 'JSONP',
                        success: function (res) {
                            those.addrData = res.data
                            those.long = []
                            those.title = []
                            those.lati = []
                            if (those.addrData != '') {
                                for (var i = 0; i < those.addrData.length; i++) {
                                    var titles = res.data[i].title
                                    var longs = res.data[i].location.lng
                                    var latis = res.data[i].location.lat
                                    those.long = those.long.concat(longs)
                                    those.lati = those.lati.concat(latis)
                                    those.title = those.title.concat(titles)
                                }
                            } else {
                                return false
                            }

                        }
                    });
                } else {
                    those.addrData = []
                }

            },
            checkUser: function () {
                var valTxt = $(".searchInput").val()
                if (valTxt.length > 0) {

                } else {
                    return false
                }
            },
            cai: function () {
                var txt = $(".caiCity").text()
                $(".mapcity-current").text(txt)
            },
            sub: function () {
                this.checkUser()
            },
            checkUser: function () {
                var valTxt = $(".searchInput").val()
                if (valTxt.length > 0) {

                } else {
                    return false
                }
            },
            cai: function () {
                var txt = $(".caiCity").text()
                $(".mapcity-current").text(txt)
            },
            laytplAddress: function (index) {
                //点击 li 后
                var latitude = this.lati[index]
                var longitude = this.long[index]
                var titles = this.title[index]
                location.href = '/pc/index.html'
                window.localStorage.setItem('geographic', titles)
                window.localStorage.setItem('latitude', latitude)
                window.localStorage.setItem('longitude', longitude)
            },
            userNameClick: function () {
                location.href = '/pc/onlyconter.html'
            },
            userLoginClick:function () {
                var test = window.location.href;
                var storage = window.localStorage;
                storage.removeItem('jumpUrl')
                storage.setItem("jumpUrl", test);

                location.href = "/pc/login.html";
            },
        }
    })
}
