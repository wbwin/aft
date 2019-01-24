window.onload = function () {

    var app = new Vue({
        el: '.content',
        data: {
            data: [
                {
                    name1: "阿凡提规则",
                    item1: [{name2: "商户协议", item2: ["饿了么网上订餐平台服务协议"]}, {
                        name2: "用户协议",
                        item2: ["饿了么用户服务协议", "蜂鸟众包用户协议"]
                    }, {
                        name2: "平台公告",
                        item2: ["网络订餐第三方平台落实食品安全主体责任联合公开承诺书", "饿了么商品品类管理规范", "饿了么商品信息发布规则", "饿了么平台保护品牌规则", "饿了么关于禁止烟草类商品售卖通知", "饿了么关于平台酒类经营要求通知（上海）", "饿了么投诉举报处理制度", "饿了么商家名称命名规范", "饿了么商家违规行为管理办法", "饿了么食品安全自查制度"]
                    }, {name2: "售后规则", item2: ["饿了么食品品质问题投诉处理规则"]}]
                },
                {
                    name1: "餐饮中心规则",
                    item1: [{name2: "基础规则", item2: ["饿了么商品品类管理规范", "饿了么平台保护品牌规则"]}, {
                        name2: "商户准入规则",
                        item2: ["饿了么开店申请标准及流程", "餐饮证照办理流程", "饿了么星巴克咖啡代购入驻规则"]
                    }, {name2: "商户管理规则", item2: ["饿了么商品信息发布规则"]}, {
                        name2: "店铺运营管理规则",
                        item2: ["饿了么商家名称命名规范", "饿了么商家违规行为管理办法", "饿了么发生食品安全事故的餐厅恢复有效规则", "饿了么食品安全自查制度"]
                    }, {name2: "配送规则", item2: ["物流准时达协议plus", "饿了么骑手资质要求", "饿了么装备清洗消毒制度", "饿了么骑手着装规范及个人卫生要求"]}]
                },
                {
                    name1: "非餐中心规则",
                    item1: [{name2: "基础规则"}, {name2: "平台项目商户入驻规则"}, {name2: "平台项目商户运营管理规则"}, {name2: "自营项目供应商准入审核规则"}, {name2: "自营项目供应商运营管理规则"}, {name2: "联营便利店管理规则"}, {
                        name2: "商品管理规则",
                        item2: ["饿了么商品信息发布规则", "保健卫生类商品标准", "果蔬类商品标准", "家居类商品标准", "酒类商品标准", "美容护理类商品标准", "母婴用品类商品标准", "生鲜食品类商品标准", "商品发布及售后标准"]
                    }, {name2: "物流仓储服务规则", item2: ["饿了么Now项目不良品处置规则"]}]
                },
                {
                    name1: "政府信息公示",
                    item1: [{
                        name2: "法规",
                        item2: ["中华人民共和国食品安全法", "餐饮服务食品采购索证索票管理规定(国食药监食[2011]178号 )", "食品经营许可管理办法（国家食品药品监督管理总局令第17号）", "中华人民共和国广告法", "上海市食品安全条例"]
                    }, {name2: "标准"}, {
                        name2: "公告",
                        item2: ["全国各省市地标亮点及许可证查询网址汇总", "全国各地三小政策及证照汇总", "上海市食品药品监督管理局关于公布生产经营者违法行为的公告", "广州市食品药品监督管理局关于公布生产经营者违法行为的公告", "深圳市市场监督管理局关于公布生产经营者违法行为的公告", "问题商品/企业名单（食品药品监管总局公示）"]
                    }]
                },
                ],
            mark: 'i0j0z0',

        },
        created: function () {


        },
        methods: {
            contentp: function (event) {
                var that = event.target
                var th = this
// var len=$(that).parents('ul').length
                $(that).parent("li").siblings("li").find("ul").hide()
                $(that).parent("li").siblings("li").find("a").removeClass('content-item-active')
                $(that).parent().find("ul").first().show();
                var t = $(that).hasClass('content-item-active')
                if (t) {
                    $(that).removeClass('content-item-active')
                    $(that).parent().find("ul").hide();
                } else {
                    $(that).addClass('content-item-active')
                }


                //
                // $(that).next("ul").toggle()
                // var t = $(that).hasClass('content-item-active')
                // if (t) {
                //     $(that).removeClass('content-item-active')
                // } else {
                //     $(that).addClass('content-item-active')
                // }
                //
                //
                var mark = $(that).attr("data-index")
                if (Boolean(mark)) {
                    // var i = mark.substring(mark.indexOf("i") + 1, mark.indexOf("j"))
                    // var j = mark.substring(mark.indexOf("j") + 1, mark.indexOf("z"))
                    // var z = mark.substring(mark.indexOf("z") + 1)
                    th.mark = mark;

                    console.log(th.mark)
                }
            },

        },
    })

}
//
// $(function(){
// 	laytpl_ul()
//
// })


//
// function laytpl_ul(){
// 	var lis=document.getElementById("lis").innerHTML;
// laytpl(lis).render(data, function(html) {
// 		$('.uls').html(html);
// 	});
// 	$(".content-p a").on("click",contentp)
// }


