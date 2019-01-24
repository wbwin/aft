window.onload = function() {
    var shopData = JSON.parse(localStorage.getItem('shopData'));
    if (!shopData) {
        location.href = "/business/Login/index.html";
    } else {
        var evaluate = new Vue({
            el: '#preOrder',
            data: {
                timeRadio: {choice: ['待处理', '已处理'], sele: '待处理'},
                radios: [
                    {val: '待处理'},
                    {val: '已处理'},

                ],
                //内容
                orderData: null,
                giveState: [
                    {name: '订单已送达', txt: '收'}, {name: '骑手已取餐'}, {name: '骑手已到店', txt: '店'}, {name: '骑手已接单', txt: '骑'},
                    {name: '商家发起配送'}, {name: '商家已接单', txt: '接'},
                ],

                evaluateData: {stars: 0, txt: '', id: 'id'}, //评价骑手
                shopId: 0,
                modalTogle: 0,
                jsonStr: '',
                pageNumb: 1, //总页数
                pageCurent: 1, //当前页
                pagelist: 2,//每一页显示数据条数
                orderData: {},
                arr: {},
            },

            created: function () {
                //初始化时查询时间

                var that = this
                var orderData = that.orderData;

                //获取数据
                axios({
                    method: "post",
                    url: 'https://www.aftdc.com/Business/Ordersa/getDamagOrder',
                    data: {
                        page: 0,
                        jsonStr: that.jsonStr,
                        token:shopData.token,
                    },
                    async: false,
                }).then(function (res) {
                    if(res.data.res == -1){
                        alert(res.data.reason)
                        localStorage.removeItem('shopData');
                        location.href="/business/Login/index.html";
                    }
                    orderData = res.data.orderData
                    if (orderData) {
                        //插入订单数据
                        var len = orderData.length;
                        for (var i = 0; i < len; i++) {
                            orderData[i].tipsTogle = 0;
                            orderData[i].open = true;
                        }
                        ;
                    }

                    that.orderData = orderData
                    that.shopId = res.data.shopId
                    //初始化页数
                    var pageCount = Number(res.data.pageCount);
                    var pageNumb = Math.ceil(pageCount / that.pagelist)
                    that.pageNumb = pageNumb
                })
                axios({
                    method: "post",
                    url: 'https://www.aftdc.com/Business/Ordersa/orderPre',
                    data: {
                        token:shopData.token,
                    }
                }).then(function (res) {


                    if (res.data.res == 1) {
                        that.arr = res.data.data;
                    }else if(res.data.res == -1){
                        alert(res.data.reason)
                        localStorage.removeItem('shopData');
                        location.href="/business/Login/index.html";
                    } else {
                        alert("出错啦！");
                    }

                })


            },


            methods: {
                //------------------------分页跳转------------------------------------
                pageClick: function (index) {
                    var that = this
                    var pageNumb = that.pageNumb

                    var page = index * that.pagelist - that.pagelist
                    axios({
                        methods: "post",
                        url: 'https://www.aftdc.com/Business/Ordersa/getDamagOrder',
                        data: {
                            page: page,
                            jsonStr: that.jsonStr,
                            token:shopData.token,
                        },
                        async: false,
                    }).then(function (res) {
                        if(res.data.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href="/business/Login/index.html";
                        }
                        orderData = res.data.orderData
                        if (orderData) {
                            //插入订单数据
                            var len = orderData.length;
                            for (var i = 0; i < len; i++) {
                                orderData[i].tipsTogle = 0;
                                orderData[i].open = true;
                            }
                            ;
                        }

                        that.orderData = orderData

                    })

                    this.pageCurent = index
                },
                pageSub: function () {
                    if (this.pageCurent == 1) {
                        return false
                    }
                    this.pageCurent--
                    var that = this
                    var pageNumb = that.pageNumb
                    var page = that.pageCurent * that.pagelist - that.pagelist
                    axios({
                        method: "post",
                        url: 'https://www.aftdc.com/Business/Ordersa/getDamagOrder',
                        data: {
                            page: page,
                            jsonStr: that.jsonStr,
                            token:shopData.token,
                        },
                        async: false,
                    }).then(function (res) {
                        if(res.data.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href="/business/Login/index.html";
                        }
                        orderData = res.data.orderData
                        if (orderData) {
                            //插入订单数据
                            var len = orderData.length;
                            for (var i = 0; i < len; i++) {
                                orderData[i].tipsTogle = 0;
                                orderData[i].open = true;
                            }
                            ;
                        }
                        that.orderData = orderData
                    })


                },
                pageAdd: function () {
                    if (this.pageCurent == this.pageNumb) {
                        return false
                    }
                    this.pageCurent++
                    var that = this
                    var pageNumb = that.pageNumb
                    var page = that.pageCurent * that.pagelist - that.pagelist
                    axios({
                        method: "post",
                        url: 'https://www.aftdc.com/Business/Ordersa/getDamagOrder',
                        data: {
                            page: page,
                            jsonStr: that.jsonStr,
                            token:shopData.token,
                        },
                        async: false,
                    }).then(function (res) {
                        if(res.data.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href="/business/Login/index.html";
                        }
                        orderData = res.data.orderData
                        if (orderData) {
                            //插入订单数据
                            var len = orderData.length;
                            for (var i = 0; i < len; i++) {
                                orderData[i].tipsTogle = 0;
                                orderData[i].open = true;
                            }
                            ;
                        }
                        that.orderData = orderData
                    })


                },
                changeRadio: function (e) {
                    var radios = this.radios;
                    var len = radios.length;
                    var seles = [];
                    var timesele = this.timeRadio['sele'];
                    this.jsonStr = timesele//单选框
                    var that = this
                    axios({
                        method: "post",
                        url: 'https://www.aftdc.com/Business/Ordersa/getDamagOrder',
                        data: {
                            page: 0,
                            jsonStr: that.jsonStr,
                            token:shopData.token,
                        },
                        async: false,
                    }).then(function (res) {
                        if(res.data.res == -1){
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href="/business/Login/index.html";
                        }
                        orderData = res.data.orderData
                        if (orderData) {
                            //插入订单数据
                            var len = orderData.length;
                            for (var i = 0; i < len; i++) {
                                orderData[i].tipsTogle = 0;
                                orderData[i].open = true;
                            }
                            ;
                        }

                        that.orderData = orderData

                        //初始化页数
                        var pageCount = Number(res.data.pageCount);
                        var pageNumb = Math.ceil(pageCount / that.pagelist)
                        that.pageNumb = pageNumb
                    })

                },


                //内容

                //评价骑手
                evaluateSure: function () {
                    var evaluateData = this.evaluateData;
                    var stars = evaluateData.stars; //星
                    var txt = evaluateData.txt; //文字
                    var id = evaluateData.id; //评价的是哪个骑手



                    //this.modalTogle=0
                },


                tipsTogleFn: function (index, numb) {
                    var data = this.orderData[index]
                    var n = data.tipsTogle
                    if (n == numb) {
                        data.tipsTogle = 0
                    } else {
                        data.tipsTogle = numb
                    }

                    this.$set(this.orderData, index, data);

                },
                goodsOpen: function (index) {
                    var data = this.orderData[index]
                    data.open = !data.open
                    this.$set(this.orderData, index, data);
                },

                //------------------------------------------------地图----------------------------------
                mapFn: function (index, i) {
                    this.modalTogle = index;

                    var lat = this.orderData[i].lat;
                    var lng = this.orderData[i].lng;
                    var taagLat = this.orderData[i].latitude;
                    var taagLng = this.orderData[i].longitude;

                    var obj = {
                        lat: lat,
                        lng: lng,
                        taagLat: taagLat,
                        taagLng: taagLng,
                    }

                    if (index == 1) {
                        this.mapShop(obj) //店家地图
                    } else if (index == 2) {
                        this.mapRider(obj) //骑手地图
                    }


                },


                //点击距离  查看地图    商家和顾客
                mapShop: function (obj) {
                    //店铺经纬度
                    var lat = obj.lat;
                    var lng = obj.lng;

                    center = new qq.maps.LatLng(lat, lng);
                    map = new qq.maps.Map(
                        document.getElementById("distance"), {
                            center: center,
                            zoom: 13,

                        }
                    );
                    //添加标注
                    marker = new qq.maps.Marker({
                        position: center,
                        map: map
                    });

                    //自定义标注图标
                    var anchor = new qq.maps.Point(0, 39),
                        size = new qq.maps.Size(45, 46),
                        origin = new qq.maps.Point(0, 0),
                        scaleSize = new qq.maps.Size(42, 46),
                        markerIcon = new qq.maps.MarkerImage(
                            "/Apps/Business/View/images/customer.png",
                            size,
                            origin,
                            anchor,
                            scaleSize
                        );

                    marker.setIcon(markerIcon);

                    marker = new qq.maps.Label({
                        position: center,
                        map: map,
                        content: '顾客所在位置'
                    });

                    //顾客位置
                    var taagLat = obj.taagLat;
                    var taagLng = obj.taagLng
                    taagCenter = new qq.maps.LatLng(taagLat, taagLng);
                    markers = new qq.maps.Marker({
                        position: taagCenter,
                        map: map
                    });

                    var anchorTaag = new qq.maps.Point(0, 39),
                        sizeTaag = new qq.maps.Size(45, 46),
                        originTaag = new qq.maps.Point(0, 0),
                        scaleSizeTaag = new qq.maps.Size(42, 46),
                        markerIconsTaag = new qq.maps.MarkerImage(
                            "/Apps/Business/View/images/user.png",
                            sizeTaag,
                            originTaag,
                            anchorTaag,
                            scaleSizeTaag
                        );

                    markers.setIcon(markerIconsTaag);
                    markers = new qq.maps.Label({
                        position: taagCenter,
                        map: map,
                        content: '商家所在位置'
                    });


                    //圆形区域覆盖物 radius 是圆形的半径，单位是“米
                    var cirle = new qq.maps.Circle({
                        center: center,
                        radius: 3000,
                        map: map,
                        strokeColor: "#06C1AE",
                    });
                },

                //点击距离  查看地图    骑手和顾客----------------------------------------------------------
                mapRider: function (obj) {
                    var map
                    var directionsService = new qq.maps.DrivingService({
                            complete: function (response) {
                                var start = response.detail.start,
                                    end = response.detail.end;

                                var anchor = new qq.maps.Point(6, 6),
                                    size = new qq.maps.Size(42, 56),
                                    scaleSizeTaag = new qq.maps.Size(42, 46),
                                    start_icon = new qq.maps.MarkerImage(
                                        '/Apps/Business/View/images/customer.png',
                                        size,
                                        new qq.maps.Point(0, 0),
                                        anchor,
                                        scaleSizeTaag
                                    ),
                                    sizes = new qq.maps.Size(42, 56),
                                    end_icon = new qq.maps.MarkerImage(
                                        '/Apps/Business/View/images/user.png',
                                        sizes,
                                        new qq.maps.Point(0, 0),
                                        anchor,
                                        scaleSizeTaag
                                    );
                                start_marker && start_marker.setMap(null);
                                end_marker && end_marker.setMap(null);
                                clearOverlay(route_lines);

                                start_marker = new qq.maps.Marker({
                                    icon: start_icon,
                                    position: start.latLng,
                                    map: map,
                                    zIndex: 1
                                });
                                end_marker = new qq.maps.Marker({
                                    icon: end_icon,
                                    position: end.latLng,
                                    map: map,
                                    zIndex: 1
                                });
                                directions_routes = response.detail.routes;
                                var routes_desc = [];
                                //所有可选路线方案
                                for (var i = 0; i < directions_routes.length; i++) {
                                    var route = directions_routes[i],
                                        legs = route;
                                    //调整地图窗口显示所有路线
                                    map.fitBounds(response.detail.bounds);
                                    //所有路程信息
                                    //for(var j = 0 ; j < legs.length; j++){
                                    var steps = legs.steps;
                                    route_steps = steps;
                                    polyline = new qq.maps.Polyline({
                                        path: route.path,
                                        strokeColor: '#3893F9',
                                        strokeWeight: 3,
                                        map: map
                                    })
                                    route_lines.push(polyline);


                                    //}
                                }

                            }
                        }),
                        directions_routes,
                        directions_placemarks = [],
                        directions_labels = [],
                        start_marker,
                        end_marker,
                        route_lines = [],
                        step_line,
                        route_steps = [];

                    var start_name = [obj.lat, obj.lng];
                    var end_name = [obj.taagLat, obj.taagLng];
                    var policy = '最少时间';
                    route_steps = [];

                    map = new qq.maps.Map(document.getElementById("riderBox"), {
                        // 地图的中心地理坐标。
                        center: new qq.maps.LatLng(obj.lat, obj.lng),
                        zoom: 15,
                    });

                    //      directionsService.setLocation("北京");
                    directionsService.setPolicy(qq.maps.DrivingPolicy[policy]);
                    directionsService.search(new qq.maps.LatLng(start_name[0], start_name[1]),
                        new qq.maps.LatLng(end_name[0], end_name[1]));

                    //清除地图上的marker
                    function clearOverlay(overlays) {
                        var overlay;
                        while (overlay = overlays.pop()) {
                            overlay.setMap(null);
                        }
                    }


                }


            },


        });
    }
}