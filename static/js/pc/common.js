Vue.component('comheader',{
    template: '<div class="indexTop"><div class="topbar minWidth"><div><a href="/pc/index.html" class="iconLogo"><img src="/static/image/pc/a.png"/><span style="color:#fff">阿凡提</span></a><a class="topItem topItemsy topItemyes" href="/pc/index.html">首页</a><a class="topItem" href="/pc/threemont.html">我的订单</a><a class="topItem" href="/pc/toJoin.html" target="_blank">加盟合作</a></div><div class="topNav"><a class="topNav-link" href=\'/pc/server.html\' style=\'color:#ffffff\'><img class="Topimg"  src="/static/image/pc/topNav1.png"/><span>服务中心</span></a><a href="https://www.aftdc.com/pc/rule.html" style=\'color:#ffffff\' target="_blank" class="topNav-link">规则中心</a><div class="topNav-link" @mouseover="TopimgOver()" @mouseout="TopimgOut()"><img class="Topimg" src="/static/image/pc/topNav2.png"/><span>手机应用</span><div class="imgBox"><span>扫一扫, 手机订餐更方便</span><img src="/static/image/pc/ewm.jpg"/></div></div><div class="topNav-sign"><img  v-if=\'admin==null\' class="Topimg" src="/static/image/pc/topNav3.png"/><span  v-if=\'admin==null\'><a href=\'javascript:0;\' target=\'_blank\' @click=\'loginClick()\' style=\'color:#fff\' >登录</a>/注册</span><span v-if=\'admin!=null\'>{{admin.loginName}}</span><div class="more" v-if=\'admin!=null\'><span class="jt">›</span><div class="user-more"><div class="point"></div><a href="/pc/onlyconter.html"><img src="/static/image/pc/user-more1.png"/><span>个人中心</span></a><a href="/pc/wodeshoucang.html"><img src="/static/image/pc/user-more2.png"/><span>我的收藏</span></a><a href="/pc/dizhiguanli.html"><img src="/static/image/pc/user-more3.png"/><span>我的地址</span></a><a href="/pc/safeconter.html"><img src="/static/image/pc/user-more4.png"/><span>安全设置</span></a><a href=\'javascript:0;\' v-on:click=\'loginoutClick()\'><img src="/static/image/pc/user-more5.png"/><span>退出登录</span></a></div></div></div><div class="clear"></div></div></div></div>',
    data: function () {
        return {
            a: 1,
            admin:{},
        }
    },
    created:function () {
        var that=this;
        var admin=window.localStorage.getItem('admin');
       that.admin=JSON.parse(admin);
        console.log(admin);
    },
    methods:{
        loginClick:function () {//登录
            var test = window.location.href;
            var  storage = window.localStorage;
            storage.setItem("jumpUrl", test);
            window.open("https://www.aftdc.com/pc/login.html");
        },
        loginoutClick:function () {//退出登录
            var  storage = window.localStorage;
            storage.removeItem('admin')
            location.reload();
        },
        TopimgOver:function () {
          $('.imgBox').show();
        },
        TopimgOut:function () {
            $('.imgBox').hide();
        },
    }
});

Vue.component('comfooter',{
    template: '<div class="footer"><div class="footer-container minWidth"><div class="footer-link"><div class="footer-link-son"><h3 class="footer-link-title">用户帮助</h3><a class="footer-link-item" href="/pc/server.html" target="_blank">服务中心</a></div><div class="footer-link-son"><h3 class="footer-link-title">商务合作</h3><a class="footer-link-item" href="/business/Enrol/registered.html" target="_blank">我要开店</a><a class="footer-link-item">加盟指南</a><a class="footer-link-item" href="/pc/agent.html" target="_blank">城市代理</a></div><div class="footer-link-son"><h3 class="footer-link-title">关于我们</h3><a class="footer-link-item"  href="/pc/contact.html" target="_blank">阿凡提介绍</a><a class="footer-link-item" href="/pc/agent.html">加入我们</a><a class="footer-link-item" @click="aftClick()">联系我们</a><a class="footer-link-item" href="/pc/rule.html">规则中心</a></div></div><div class="footer-contect"><div class="footer-contect-item">24小时服务热线</div><div class="footer-contect-item">意见反馈 : gdaft@aft.com</div><div class="footer-contect-item"><span>关注我们 :</span><div class="follow-wx"><div class="follow-wxImg"></div><div class="follow-wxTps"><img src="/static/image/pc/ewm.jpg"/><p>微信号:aaaa</p><p>阿凡提智慧点餐</p></div></div><a class="follow-wb"></a></div></div><div class="footer-mobile"><a><img class="footer-mobile-icon" src="/static/image/pc/ewm.jpg"/></a><div class="footer-mobile-content"><h3>下载手机版</h3><p>扫一扫,手机订餐更方便</p></div></div><div class="footer-copyright"><h5 class="aller">所有方:广东阿凡提电子商务有限公司</h5><p><a style="color: #999;" href="http://www.miitbeian.gov.cn/">粤ICP备16100736号</a></p></div><div class="footer-police" style="display: none"><a><img src="/static/image/pc/ban.png"/></a></div></div></div>',
    data: function () {
        return {
            a: 1
        }
    },
    methods:{
        aftClick:function(){
            location.href='/pc/contact.html?pags=1'
        }
    },
});