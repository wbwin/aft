window.onload = function () {
    var shopData = JSON.parse(localStorage.getItem('shopData'));
    if (!shopData) {
        location.href = "/business/Login/index.html";
    } else {
        var analyFeel = new Vue({
            el: ".analyFlow",
            data: {

                //problems->问题   affect->影响
                problem: [{
                    title: '顾客体验',
                    icon: 'giveIcon',
                    problems: '起送价偏高',
                    affect: '影响顾客下单积极性',
                    txt: '您店内最低起送价偏高，比 87.88 %的同城同品类商家高。起送价过高会直接增加顾客的凑单难度，导致顾客放弃购买。',
                    sugger: ' 起送价降低会刺激顾客下单，请结合店内实际运营情况设置合理起送价。',
                    but: '优化起送价',
                },
                    {
                        title: '服务能力',
                        icon: 'timeIcon',
                        problems: '起送价偏高',
                        affect: '影响顾客下单积极性',
                        txt: '您店内最低起送价偏高，比 87.88 %的同城同品类商家高。起送价过高会直接增加顾客的凑单难度，导致顾客放弃购买。',
                        sugger: ' 起送价降低会刺激顾客下单，请结合店内实际运营情况设置合理起送价。',
                        but: '优化起送价',
                    },
                    {
                        title: '营销推广',
                        icon: 'activIcon',
                        problems: '起送价偏高',
                        affect: '影响顾客下单积极性',
                        txt: '您店内最低起送价偏高，比 87.88 %的同城同品类商家高。起送价过高会直接增加顾客的凑单难度，导致顾客放弃购买。',
                        sugger: ' 起送价降低会刺激顾客下单，请结合店内实际运营情况设置合理起送价。',
                        but: '优化起送价',
                    },
                ],

                problemNot: [
                    {title: '顾客体验', icon: 'not-diffIcon', txt: '近7天收到顾客差评：0个', but: '继续完善',},
                    {title: '经营基础', icon: 'not-diffIcon', txt: '近7天收到顾客差评：0个', but: '查看催单情况',},
                    {title: '经营基础', icon: 'not-diffIcon', txt: '近7天收到顾客差评：0个'},
                    {title: '服务能力', icon: 'not-diffIcon', txt: '近7天收到顾客差评：0个', but: '查看催单情况',},
                    {title: '服务能力', icon: 'not-diffIcon', txt: '近7天收到顾客差评：0个', but: '查看催单情况',},
                ],

            },
            methods: {})
    }
}