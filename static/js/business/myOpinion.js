window.onload = function() {
    var shopData = JSON.parse(localStorage.getItem('shopData'));
    if (!shopData) {
        location.href = "/business/Login/index.html";
    } else {
        var app = new Vue({
            el: "#myOpinion",
            data: {
                opinion: [{
                    time: "2018-01-26 10:00:00",
                    clasIfy: "配送问题",
                    detailPro: "举报举报举报举举报举报举报举举报举报举报举举报举报举报举举报举报举报举举报举报举报举举报举报举报举举报举报举报举举报举报举报举举报举报举报举举报举报举报举举报举报举报举举报举报举报举举报举报举报举举报举报举报举",
                    reply: "暂无回复",
                },
                    {
                        time: "2018-01-26 10:00:00",
                        clasIfy: "配送问题",
                        detailPro: "举报举报举报举",
                        reply: "暂无回复",
                    }

                ]

            },
            created: function () {
            },
            methods: {},
        })
    }
}