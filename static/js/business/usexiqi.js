window.onload = function() {
    var shopData = JSON.parse(localStorage.getItem('shopData'));
    if (!shopData) {
        location.href = "/business/Login/index.html";
    } else {

        var app = new Vue({
            el: '.dec',
            data: {
                dataz: '',
                dataza: '',
            },
            boforeCreate: function () {

            },
            created: function () {
                var that = this;
                axios({
                    method: "post",
                    url: 'https://www.aftdc.com/Business/Goodsappraises/usexiqi',
                    data: {
                        token:shopData.token,
                    },
                }).then(function (res) {

                    if (res.data.res == 1) {
                        that.dataz = res.data.data;
                        that.dataza = res.data.data.arr;


                    }else if(res.data.res == -1){
                        alert(res.data.reason)
                        localStorage.removeItem('shopData');
                        location.href="/business/Login/index.html";
                    }
                })


            },
            methods: {
                chu: function () {
                    $(".ruxians").show();
                    $(".eije").show();
                },
                yin: function () {
                    $(".ruxians").hide();
                    $(".eije").hide();
                },

            },
            beforeMount: function () {

            },
            mounted: function () {

            },
            updated: function () {


                let Progress = function (init) {
                    this.init(init)
                };
                Progress.prototype = {
                    init: function (init) {

                        this.el = init.el; //元素ID

                        let cvsElement = document.getElementById(this.el); //获取元素
                        let ctx = cvsElement.getContext("2d"), //获取画笔
                            width = cvsElement.width, //元素宽度
                            height = cvsElement.height, //元素高度
                            degActive = 0, //动态线条
                            timer = null; //定时器

                        //停止时的角度
                        init.deg > 0 && init.deg <= 100 ?
                            this.deg = init.deg : this.deg = 100;

                        //线宽
                        init.lineWidth !== undefined ?
                            this.lineWidth = init.lineWidth : this.lineWidth = 20;

                        //判断宽高较小者
                        this.wh = width > height ? height : width;

                        //设置圆的半径，默认为宽高较小者
                        init.circleRadius > 0 && init.circleRadius <= this.wh / 2 - this.lineWidth / 2 ?
                            this.circleRadius = init.circleRadius : this.circleRadius = this.wh / 2 - this.lineWidth / 2;

                        //绘制线的背景颜色
                        init.lineBgColor !== undefined ?
                            this.lineBgColor = init.lineBgColor : this.lineBgColor = '#ccc';

                        //绘制线的颜色
                        init.lineColor !== undefined ?
                            this.lineColor = init.lineColor : this.lineColor = '#009ee5';

                        //绘制文字颜色
                        init.textColor !== undefined ?
                            this.textColor = init.textColor : this.textColor = '#009ee5';

                        //绘制文字大小
                        init.fontSize !== undefined ?
                            this.fontSize = init.fontSize : this.fontSize = parseInt(this.circleRadius / 2);

                        //执行时间
                        this.timer = init.timer;

                        //清除锯齿
                        if (window.devicePixelRatio) {
                            cvsElement.style.width = width + "px";
                            cvsElement.style.height = height + "px";
                            cvsElement.height = height * window.devicePixelRatio;
                            cvsElement.width = width * window.devicePixelRatio;
                            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
                        }

                        //设置线宽
                        ctx.lineWidth = this.lineWidth;

                        //启动定时器
                        timer = setInterval(function () {
                            ctx.clearRect(0, 0, width, height); //清除画布
                            ctx.beginPath(); //开始绘制底圆
                            ctx.arc(width / 2, height / 2, this.circleRadius, 1, 8);
                            ctx.strokeStyle = this.lineBgColor;
                            ctx.stroke();
                            ctx.beginPath(); //开始绘制动态圆
                            ctx.arc(width / 2, height / 2, this.circleRadius, -Math.PI / 2, degActive * Math.PI / 180 - Math.PI / 2);
                            ctx.strokeStyle = this.lineColor;
                            ctx.stroke();
                            let txt = (parseInt(degActive * 100 / 360) + "%"); //获取百分比
                            ctx.font = this.fontSize + "px SimHei";
                            let w = ctx.measureText(txt).width; //获取文本宽度
                            let h = this.fontSize / 2;
                            ctx.fillStyle = this.textColor;
                            ctx.fillText(txt, width / 2 - w / 2, height / 2 + h / 2);
                            if (degActive >= this.deg / 100 * 360) { //停止定时器
                                clearInterval(timer);
                                timer = null;
                            }
                            degActive++;
                        }.bind(this), this.timer);
                    }
                };

                var p1 = new Progress({
                    el: 'my_html', //canvas元素id
                    deg: "23", //绘制角度
                    timer: 10, //绘制时间
                    lineWidth: 20, //线宽
                    lineBgColor: '#e2e2e2', //底圆颜色
                    lineColor: '#77dc22', //动态圆颜色
                    textColor: '#000', //文本颜色
                    fontSize: 50, //字体大小
                    circleRadius: 100 //圆半径
                });
            }
        })

    }
}


    