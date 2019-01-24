window.onload = function () {
    var shopData = JSON.parse(localStorage.getItem('shopData'));
    if (!shopData) {
        location.href = "/business/Login/index.html";
    } else {



            var app = new Vue({
                el: "#singleImg",
                data: {

                    topImg: [
                        {
                            name: '曝光',
                            peoples: '90',
                            peopleState: -4,
                            numbs: '{topImg.Visibility}',
                            numbState: 4,
                            clas: 'exposure'
                        },
                        {name: '访问', peoples: '90', peopleState: -4, numbs: '358', numbState: 4, clas: 'visit'},
                        {name: '下单', peoples: '90', peopleState: -4, numbs: '358', numbState: 4, clas: 'order'},
                    ],
                    navNumb: 1,
                    days: 1,
                    flow: ''
                },
                created: function () {
                    var that = this
                    axios({
                        method: "post",
                        url: "https://www.aftdc.com/Business/Analy/analyFlow",
                        data: {
                            token: shopData.token
                        }
                    }).then(function (res) {
                        var require = res.data
                        if (require.res == 1) {
                            that.flow = require.data

                        }
                        else if (res.data.res == -1) {
                            alert(res.data.reason)
                            localStorage.removeItem('shopData');
                            location.href = "/business/Login/index.html";
                        }

                    })
                },
                methods: {
                    flowNavFn: function (index, day) {
                        var that = this
                        that.navNumb = index;
                        that.$nextTick(function () {
                            if (index != 1) {
                                that.charts()
                            }
                        });

                        that.days = day
                    },
                    //把数字转为正数
                    abs: function (index) {
                        var i = parseInt(index);
                        i = Math.abs(i);
                        return i
                    },


                    charts: function () {
                        $("#container").empty()
                        var filterNames = [];
                        var before = [
                            {month: '09.20', value: 7.0, type: '曝光人数'},
                            {month: '09.21', value: 6.9, type: '曝光人数'},
                            {month: '09.22', value: 9.5, type: '曝光人数'},
                            {month: '09.23', value: 14.5, type: '曝光人数'},
                            {month: '09.24', value: 18.2, type: '曝光人数'},

                            {month: '09.20', value: 21.5, type: '曝光次数'},
                            {month: '09.21', value: 21.5, type: '曝光次数'},
                            {month: '09.22', value: 25.2, type: '曝光次数'},
                            {month: '09.23', value: 26.5, type: '曝光次数'},
                            {month: '09.24', value: 23.3, type: '曝光次数'},
                            {month: '09.25', value: 18.3, type: '曝光次数'},
                            {month: '09.26', value: 13.9, type: '曝光次数'},
                            {month: '09.27', value: 9.6, type: '曝光次数'},

                            {month: '09.20', value: 25.5, type: '访问人数'},
                            {month: '09.21', value: 24.5, type: '访问人数'},
                            {month: '09.22', value: 24.2, type: '访问人数'},
                            {month: '09.23', value: 26.5, type: '访问人数'},
                            {month: '09.24', value: 28.3, type: '访问人数'},
                            {month: '09.25', value: 28.3, type: '访问人数'},
                            {month: '09.26', value: 19.9, type: '访问人数'},
                            {month: '09.27', value: 9.6, type: '访问人数'},

                            {month: '09.20', value: 7.0, type: '下单人数'},
                            {month: '09.21', value: 6.9, type: '下单人数'},
                            {month: '09.22', value: 9.5, type: '下单人数'},
                            {month: '09.23', value: 14.5, type: '下单人数'},
                            {month: '09.24', value: 18.2, type: '下单人数'},

                            {month: '09.20', value: 21.5, type: '下单数量'},
                            {month: '09.21', value: 11.5, type: '下单数量'},
                            {month: '09.22', value: 25.2, type: '下单数量'},
                            {month: '09.23', value: 16.5, type: '下单数量'},
                            {month: '09.24', value: 23.3, type: '下单数量'},
                            {month: '09.25', value: 18.3, type: '下单数量'},
                            {month: '09.26', value: 10.9, type: '下单数量'},
                            {month: '09.27', value: 1.6, type: '下单数量'},

                            {month: '09.20', value: 15.5, type: '访问转化率'},
                            {month: '09.21', value: 14.5, type: '访问转化率'},
                            {month: '09.22', value: 14.2, type: '访问转化率'},
                            {month: '09.23', value: 16.5, type: '访问转化率'},
                            {month: '09.24', value: 18.3, type: '访问转化率'},
                            {month: '09.25', value: 18.3, type: '访问转化率'},
                            {month: '09.26', value: 19.9, type: '访问转化率'},
                            {month: '09.27', value: 1.6, type: '访问转化率'},

                            {month: '09.20', value: 20.5, type: '下单转化率'},
                            {month: '09.21', value: 25.5, type: '下单转化率'},
                            {month: '09.22', value: 22.2, type: '下单转化率'},
                            {month: '09.23', value: 20.5, type: '下单转化率'},
                            {month: '09.24', value: 10.3, type: '下单转化率'},
                            {month: '09.25', value: 20.3, type: '下单转化率'},
                            {month: '09.26', value: 10.9, type: '下单转化率'},
                            {month: '09.27', value: 19.6, type: '下单转化率'},
                        ];

                        var data = []
                        var beforeLen = before.length;
                        //转成数字格式
                        for (var i = 0; i < beforeLen; i++) {
                            before[i].value = parseInt(before[i].value * 100) / 100;
                            data[i] = before[i]
                        }


                        var Util = G2.Util;
                        var Stat = G2.Stat;
                        var Frame = G2.Frame;
                        var chart = new G2.Chart({
                            id: 'container',
                            forceFit: true,
                            height: 450
                        });
                        chart.source(data, {
                            'month': {
                                formatter: function (val) {
                                    return val;
                                },
                                range: [0, 1]
                            },
                        });

                        //坐标轴配置
                        chart.axis('month', {
                            title: null, // 不展示 xDim 对应坐标轴的标题
                            tickLine: {
                                lineWidth: 0,
                            },
                            grid: {
                                line: {
                                    stroke: '#d9d9d9',
                                    lineWidth: 1,
                                    lineDash: 1
                                }
                            }
                        });
                        chart.axis('value', {
                            title: null, // 不展示 xDim 对应坐标轴的标题
                            tickLine: {
                                lineWidth: 0,
                            },
                            grid: {
                                line: {
                                    stroke: '#d9d9d9',
                                    lineWidth: 1,
                                    lineDash: 1
                                }
                            }
                        });

                        chart.legend(false); // 关掉自带图例
                        chart.area().position('month*value').color('type').shape('smooth').opacity(0.2);
                        chart.line().position('month*value').color('type').size(4).shape('smooth');
                        chart.point().position('month*value').color('type').size(7).shape('circle');
                        chart.render();

                        var geom = chart.getGeoms()[0]; // 获取所有的图形
                        var items = geom.getData(); // 获取图形对应的数据

                        var stash = {};
                        $('.checkbox,.showtxt').empty()
                        for (var i = 0, l = items.length; i < l; i++) {
                            var item = items[i];
                            var itemData = item._origin;
                            var color = item.color;
                            var name = itemData[0].type;

                            var value = itemData[0].value;


                            var trHtml = '<label class="label-checkbox items" data-name="' + name + '">' +
                                '<span class="customs"></span>' + name +
                                '</label>'

                            var dom = $(trHtml).appendTo('.checkbox');
                            //只显示两个图例
                            if (i < 2) {
                                stash[name] = {
                                    dotDom: dom.find('.dot'),
                                    dotcheck: dom.find('.customs'),
                                    item: item,
                                    color: color,
                                    name: name,
                                    isChecked: true
                                }
                                filterNames.push(name);
                                stash[name].dotDom.css('background', stash[name].color);
                                stash[name].dotcheck.addClass('active');
                                var txt = '<span class="oblong" style="background:' + color + ';"></span>' + name
                                $(".showtxt").append(txt)
                            } else {
                                stash[name] = {
                                    dotDom: dom.find('.dot'),
                                    dotcheck: dom.find('.customs'),
                                    item: item,
                                    color: color,
                                    name: name,
                                    isChecked: false
                                }
                                stash[name].dotDom.css('background', '#999');

                            }
                        }
                        stars()

                        function stars() {
                            chart.filter('type', filterNames)
                            chart.repaint();
                        }

                        $(".items").click(function () {
                            var name = $(this).data('name');
                            filter(name);
                        });

                        function filter(name) {
                            var obj = stash[name];
                            // var filterNames = [];
                            var len = filterNames.length

                            obj.isChecked = obj.isChecked ? false : true;

                            if (obj.isChecked) {
                                filterNames.push(obj.name);
                            } else {
                                if (len <= 1) {
                                    obj.isChecked = true
                                    return false
                                }
                                var name = obj.name
                                for (var i = 0; i < filterNames.length; i++) {
                                    var txt = filterNames[i]
                                    if (txt == name) {
                                        filterNames.splice(i, 1)
                                    }
                                }
                            }
                            if (filterNames.length > 2) {
                                var txt = filterNames[0]
                                var objs = stash[txt]
                                objs.isChecked = false
                                filterNames.splice(0, 1);
                            }
                            Util.each(stash, function (v) {
                                v.isChecked = false;
                                v.dotDom.css('background', '#999');
                                v.dotcheck.removeClass('active')
                            });

                            $(".showtxt").empty();

                            for (var i = 0; i < filterNames.length; i++) {
                                var txt = filterNames[i]
                                var objs = stash[txt]
                                objs.dotDom.css('background', objs.color);
                                objs.dotcheck.addClass('active');
                                objs.isChecked = true;
                                var txt = '<span class="oblong" style="background:' + objs.color + ';"></span>' + filterNames[i]
                                $(".showtxt").append(txt)
                            }

                            chart.filter('type', filterNames)
                            chart.repaint(); //重绘
                        }

                    },
                    overShowww: function () {
                        var showDiv = document.getElementById('showDivvv');
                        showDiv.style.left = event.clientX;
                        showDiv.style.top = event.clientY;
                        showDiv.style.display = 'block';
                        showDiv.innerHTML = '这是您的店铺曝光总量';
                    },
                    outHideee: function () {
                        var showDiv = document.getElementById('showDivvv');
                        showDiv.style.display = 'none';
                        showDiv.innerHTML = '';
                    },
                    overShoww: function () {
                        var showDiv = document.getElementById('showDivv');
                        showDiv.style.left = event.clientX;
                        showDiv.style.top = event.clientY;
                        showDiv.style.display = 'block';
                        showDiv.innerHTML = '这是您的店铺被用户浏览的总量';
                    },
                    outHidee: function () {
                        var showDiv = document.getElementById('showDivv');
                        showDiv.style.display = 'none';
                        showDiv.innerHTML = '';
                    },
                    overShow: function () {
                        var showDiv = document.getElementById('showDiv');
                        showDiv.style.left = event.clientX;
                        showDiv.style.top = event.clientY;
                        showDiv.style.display = 'block';
                        showDiv.innerHTML = '这是您的店铺销售总量';
                    },
                    outHide: function () {
                        var showDiv = document.getElementById('showDiv');
                        showDiv.style.display = 'none';
                        showDiv.innerHTML = '';
                    }
                },


            })
        }

}