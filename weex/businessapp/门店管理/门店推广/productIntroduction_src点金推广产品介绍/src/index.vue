<template>
    <div class="productIntroduction">
        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    v-once
            >
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">产品介绍与引导</text>
                <image class="backImg" slot="right"
                       src="https://image.aftdc.com/appBimg/icon_add.png"></image>
            </wxc-minibar>
        </div>
        <scroller style="flex: 1;width: 750px;">
            <image class="bigIma" src="https://image.aftdc.com/appBimg/djtg.png"></image>
        </scroller>
        <div class="button" v-if="is_open === false">
            <div class="buttonTop row">
                <image class="buttonIcon" :src="agree?'https://image.aftdc.com/appBimg/ic_check_box_checked.png':'https://image.aftdc.com/appBimg/ic_check_box_normal.png'" @click="agreeClick"></image>
                <div class="row">
                    <text class="bttonText" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">同意</text>
                    <text class="bttonTextTwo" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.tColor}" @click="btnClick">《阿凡提点餐技术服务框架合同》</text>
                </div>
            </div>

            <div class=" enterButton">
                <wxc-button  :class="[agree?'okButton':'noButton']" text="免费开通" :textStyle="GLOBAL.buttonText" :btnStyle="GLOBAL.defaultButton"
                             @wxcButtonClicked="toEnterMessage"></wxc-button>
            </div>

        </div>

        <!--弹出层-->
        <wxc-mask height="1050"
                  width="680"
                  border-radius="20"
                  duration="200"
                  mask-bg-color="#FFFFFF"
                  :has-animation="true"
                  :has-overlay="true"
                  :show-close="false"
                  :show="show"
                  @wxcMaskSetHidden="wxcMaskSetHidden">
            <div class="content">
                <scroller style="width: 640px;height: 980px;" show-scrollbar="false">
                    <text class="bigTitle" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">阿凡提点餐技术服务框架合同</text>
                    <text class="time" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">本协议与2017呢喃10月17日发布</text>
                    <text class="titleDtails" v-for="item in smallList" :style="{color:GLOBAL.dColor}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{item.text}}</text>

                    <div class="titleDiv" v-for="(item,index) in contentList" :key="index">
                        <text class="titleText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.title}}</text>
                        <text class="titleDtails" v-for="itemTwo in item.text" :style="{color:GLOBAL.dColor}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{itemTwo.textOne}}</text>
                    </div>

                    <text style="height: 20px;"></text>

                </scroller>
                <text class="confirm" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.tColor}" @click="fonfirmClick">确定</text>
            </div>
        </wxc-mask>
        <toast ref="toast"></toast>
    </div>
</template>
<script>
    import {WxcButton,WxcMinibar,WxcMask } from 'weex-ui'
    import {WxcDialog} from 'weex-ui';
    import Toast from './Toast.vue'
    const event = weex.requireModule('event');
    const navigator = weex.requireModule('navigator');
    const post = weex.requireModule('stream');
    export default {
        components: {WxcButton, WxcDialog, Toast, WxcMinibar,WxcMask },
        data() {
            return {
                agree:true,
                show:false,
                is_open:false,
                contentList:[
                    {title:'一、 门店技术服务内容',
                        text:[
                            {textOne:'阿凡提点餐向您提供技术服务，您应就使用平台提供的技术服务，向阿凡提点餐支付技术服务费。'},
                            {textOne:'1.1 技术服务功能'},
                            {textOne:'1.1.1 技术服务指，为使您的商品/服务可在您指定时间、位置面向特定消费人群进行展示，阿凡提点餐通过门店运用的数据分析、信息优化、智能匹配、反馈优化等各种算法和技术手段。阿凡提点餐提供的技术服务功能包括但不限于：\n'},
                            {textOne:'（1）大数据分析功能，阿凡提点餐在门店系统，针对您的信息提供各类维度的数据分析及报表；'},
                            {textOne:'（2）信息优化分析功能，门店系统可根据商家营业水平、结合商圈等信息情况为您提供指导建议，供您决策时参考；'},
                            {textOne:'（3）智能匹配功能，阿凡提点餐根据地理位置、消费者偏好等不同维度，智能地将您的信息向匹配度较高的消费者进行匹配；'},
                            {textOne:'（4）反馈优化功能，通过消费者偏好等数据分析和模型化定制功能，针对您信息进行计算机优化；'},
                            {textOne:'（5）其他技术服务功能。'},
                            {textOne:'1.1.2 你可自行选择使用以下一项或多项技术服务内容：（包括但不限于以下内容，以您后台点击使用为准）'},
                            {textOne:'（1）“点金”技术服务：黄金位置免费展示，非推广位展现，采用“免费展示，点击付费”的方式，您可以通过参与技术服务排序活动，获得展示机会，此时不产生费用，您的信息在技术服务特定位置展示且被阿凡提点餐用户点击后，向阿凡提点餐支付的技术服务费。'},
                            {textOne:'（2）“揽客宝”技术服务：采用“展示并触达用户付费”方式，通过参与技术服务排序活动，获得特定位置展示机会，在该位置展示您店铺的优惠券并发放给用户后，向阿凡提点餐支付的技术服务费。'},
                            {textOne:'（3）其他技术服务，具体以线上门店产品为准。'},
                        ]
                    },
                    {title:'二、合同有效期',
                        text:[
                            {textOne:'2.1 自您点击本协议之时开始生效；'},
                            {textOne:'2.2 本协议约定的期限届满或约定的其他终止情形发生时,本协议终止。'},
                        ]
                    },
                    {title:'三、门店技术服务收费规则',
                        text:[
                            {textOne:'3.1 费用类型：根据技术服务收费。'},
                            {textOne:'3.2 付款方式：采用后付费方式，您要确保您的技术服务账户中有足够的余额可供门店系统计费扣款；在您选择使用其中一个或多个技术服务内容产生实际技术服务费时，门店系统会自动计算您的应付金额，并定期进行结算扣费。当您的技术服务账户余额不足时，阿凡提点餐有权对您的内容操作下线，且您仍需支付在上个技术服务周期内未实际支付成功的技术服务费用。'},
                            {textOne:'3.3 技术服务账户：区别于订单款账户、配送费账户、保证金账户以外的独立账户。'},
                            {textOne:'3.4 费用确认：若您对阿凡提点餐扣除的费用有异议的，您有权在该技术服务提供之日起3个工作日内书面通知阿凡提点餐，否则视为您已经认可上述费用。阿凡提点餐在收到您书面通知之日起三个工作日内对该异议情况予以核查，若确属阿凡提点餐原因导致的数据统计错误的，阿凡提点餐将重新核算。'},
                            {textOne:'3.5 如您需要阿凡提点餐提供发票，可向阿凡提点餐提出申请后，阿凡提点餐交付您与已消费金额相应的增值税专用发票，发票内容为（技术服务费）。'},
                        ]
                    },
                    {title:'四、双方权利义务',
                        text:[
                            {textOne:'4.1 您应保证为一家依据中国法律合法成立并有效存续的法人或其它商事主体，能够独立承担法律责任，并具有履行本协议所需的一切权利及能力；同时您应当提供盖章的资质证明复印件，如涉及特殊行业需要特定的资质或许可文件等的，您也应予以提供前述资料，包括但不限于您的营业执照、行政许可文件、商品/服务说明、信息文案所需资料（包含图片、说明、门店 、商家介绍）等。对于医疗、药品、特殊医学用途配方食品、医疗器械、农药、兽药、保健食品等法律、行政法规规定须经审查机关审查的，您还应事先向阿凡提点餐提交审查证明文件。您因资质或提供的信息问题而致使本协议无法正常履行的，由此产生的一切结果由您负责；您还需赔偿阿凡提点餐因此遭受的全部损失。'},
                            {textOne:'4.2 您理解国家法律法规以及部门规章制度等对网络信息发布有严格的管理规定，阿凡提点餐有权依照该等规定，对您的相关资质证明文件以及您通过阿凡提点餐技术服务发布的信息的用语、设计、内容、形式等进行审查。阿凡提点餐为您及发布的技术服务的审查不代表阿凡提点餐对您提供的全部信息合法性的确认。因信息内容及形式产生的一切纠纷由您自行解决并由您承担全部责任。'},
                            {textOne:'4.3 您保证通过阿凡提点餐技术服务所提供的相关信息的内容均是真实的、准确的、合法的和正当的、如果阿凡提点餐在审查中发现您提供的信息中包含任何违反法律法规或侵犯第三方合法权益的内容、或违反阿凡提点餐产品政策、或阿凡提点餐被有关政府部门要求屏蔽该网站或删除这些信息，阿凡提点餐有权拒绝继续提供技术服务，直至您纠正违约行为。同时阿凡提点餐有权以书面通知的方式（包括电子邮件或向商家后台系统发送信息的方式）立即终止本协议。本协议自阿凡提点餐发出书面终止通知之日起终止。如因此引起任何针对阿凡提点餐或阿凡提点餐关联公司的纠纷、诉讼或索赔，应由您负责为阿凡提点餐或阿凡提点餐关联公司解释。如阿凡提点餐或阿凡提点餐关联公司因此遭受任何损失（包括但不限于支付罚款、给付赔偿金或律师费等），您承担全部责任并负责全额赔偿。'},
                            {textOne:'4.4 如因您未能提供阿凡提点餐履行服务所需的资质证明文件或您发布的信息内容不真实、不准确、不合法和不正当等，造成阿凡提点餐技术服务提供迟延或不能提供，相应损失由您自行承担。'},
                        ]
                    },
                    {title:'五、保密及知识产权条款',
                        text:[
                            {textOne:'5.1 任何一方对于因签署或履行本协议而了解或接触到的对方的商业秘密及其他机密资料和信息均应保守秘密；非经对方书面同意，任何一方不得向第三方泄露、给予或转让该等保密信息。'},
                            {textOne:'5.2 任何一方均对本协议的内容及所了解的对方所有资料和信息负有保密义务，但为履行本协议或一方业务需要可将保密信息披露给：'},
                            {textOne:'5.2.1 接受方内部有必要了解保密信息的雇员或其关联公司的雇员；'},
                            {textOne:'5.2.2 已和接受方签订保密条款或保密协议的合作伙伴，包括律师事务所（律师）、会计师事务所（会计师）、审计事务所（审计师）、评估事务所（评估师）等；'},
                            {textOne:'5.2.3 一方依据有关法律法规要求而向相关部门披露的，包括政府部门、司法部门、证券交易所或其他监管机构。'},
                            {textOne:'5.3 除本协议规定之工作所需外，未经对方事先同意，不得擅自使用、复制对方的商标、标志、商业信息、技术及其他资料。'},
                            {textOne:'5.4 本协议有效期内及终止后，本保密条款仍具有法律效力。'},
                        ]
                    },
                    {title:'六、违约责任',
                        text:[
                            {textOne:'6.1 如您违反诚信原则，或违反本协议的任一条款或阿凡提点餐门店系统上的任何规则，或您违反其在本协议的履行中做出的任何承诺和保证，或您提供的资质、证照等信息不属实，则阿凡提点餐及其关联方有权停止向您提供技术服务支持。'},
                            {textOne:'6.2 因阿凡提点餐未能按照合同约定履行义务，且在您要求的期限内拒绝纠正或纠正后仍不符合本协议约定的，应承担因此给您造成的损失。'},
                            {textOne:'6.3 此外，您与阿凡提点餐就本协议执行过程中的违约行为，双方按法律和本协议约定承担相应违约责任。'},
                        ]
                    },
                    {title:'七、合同解除与终止',
                        text:[
                            {textOne:'7.1 本协议期限届满或本协议约定的其他终止情形发生时，本协议自然终止。除合同另有约定外，本协议履行过程中，一方经书面通知对方且经双方协商一致后，可解除本协议。'},
                            {textOne:'7.2 本协议终止或解除后：阿凡提点餐有权停止对您在阿凡提点餐平台上已发布的信息提供技术服务，且有权拒绝提供相关信息。'},
                        ]
                    },
                    {title:'八、免责条款',
                        text:[
                            {textOne:'8.1 因战争、自然灾害、政府行为、互联网系统故障、互联网通讯提供商故障等不可抗力因素或第三方原因导致阿凡提点餐不能履行本协议项下义务，阿凡提点餐无须承担责任。'},
                            {textOne:'8.2 您同意，因下述两种特殊情形导致阿凡提点餐不能按时提供技术服务的，不视为阿凡提点餐违约：'},
                            {textOne:'8.2.1 您理解，基于市场整体利益考虑及经营需要，阿凡提点餐可能不定期对服务内容、版面布局、页面设计等有关方面进行调整，如因上述调整而影响您技术服务的(包括发布位置和/或发布期间等)，您将给予充分的谅解，阿凡提点餐则应该尽可能将上述影响减少到最低程度。'},
                            {textOne:'8.2.2 您理解，为了技术服务正常运行，阿凡提点餐需要定期或不定期地进行停机维护，如因此类情况而造成您技术服务不能按计划享受，您将予以谅解，阿凡提点餐则有义务尽力避免服务中断或将中断时间限制在最短时间内。'},
                        ]
                    },
                    {title:'九、法律适用及争议解决条款',
                        text:[
                            {textOne:'9.1 本协议的成立、有效性、解释、履行、签署、修订和终止以及争议的解决均应适用中华人民共和国法律，如无相关法律规定的,则应参照行业惯例。'},
                            {textOne:'9.2 因本协议引起的或与本协议有关的任何争议，双方应协商解决。协商不成的，任何一方均可将争议提交至原告所在地有管辖权的人民法院。'},
                        ]
                    },
                    {title:'十、附则',
                        text:[
                            {textOne:'10.1 基于阿凡提点餐整体运营需要，在事先向您发出通知后，您同意阿凡提点餐向其关联公司部分或全部转让本协议项下的权利与义务。本协议对双方各自的继承人和允许的受让人有约束力。'},
                            {textOne:'10.2 阿凡提点餐有权以修改、更新等方式不定时调整本协议和相关规则的内容，相关内容将公布于门店系统或以其他方式通知您。除非您书面通知阿凡提点餐不愿接受调整后的内容并终止合作，否则调整后的内容将于公布之日起或通知另行指定的日期开始生效。'},
                            {textOne:'10.3 本协议是对原服务合同的补充。如本协议与原服务合同冲突的，针对技术服务涉及权利义务以本协议为准；本协议未予以约定的，则遵照原服务合同的约定履行。'},
                            {textOne:'10.4 本协议具有可分割性，本协议任何条款无效不影响其他条款的效力，其他条款仍然有效。  '},
                        ]
                    },
                ],
                smallList:[
                    {text:'鉴于您与阿凡提点餐已签署《阿凡提点餐服务合同》（以下简称“原合同”）。本协议将作为原合同的重要组成部分，一旦您在门店系统中勾选本协议并点击“申请开通”按钮，即表示您已接受了以下所述的条款和条件，同意受本协议约束。如果您对本协议条款的部分或全部不予接受或有异议的，请不要勾选本协议或点击“申请开通”。 本协议内容同时包括阿凡提点餐网上订餐平台门店技术服务（以下简称“技术服务”）项目可能不断发布或更新的相关协议、业务规则等内容。上述内容一经正式发布，即为本协议不可分割的组成部分。'},
                    {text:'本协议项下的您为通过阿凡提点餐（包括但不限于阿凡提点餐运营或管理的网络服务平台）开展相关经营活动的商家。'},
                    {text:'请您务必审慎阅读、充分理解各条款内容，特别是免除或者限制责任的条款。限制、免责条款可能以黑体加粗形式提示您注意'},
                    {text:'根据《中华人民共和国合同法》及相关法律、法规的规定,甲乙双方在互惠互利、合作共赢的基础上,经充分友好协商达成如下合同,以兹共同遵守。'},
                ],
                token:'',
                imei:'',
            }
        },
        created: function () {
            //判断是否已开通
            if (weex.config.param) this.is_open =JSON.parse(weex.config.param).is_open;
            this.token = weex.config.token;
            this.imei = weex.config.imei;
        },
        methods: {
            //返回上一页
            minibarLeftButtonClick() {
                navigator.pop({animated:'true'})
            },
            btnClick(){
                this.show=true
            },
            fonfirmClick(){
                this.show=false;
            },
            wxcMaskSetHidden(){
                this.show=false;
            },
            toEnterMessage(){
                const toast=this.$refs.toast;
                //开通推广
                var param = this.GLOBAL.sign(this.token,this.imei);
                var that = this;
                post.fetch({
                    method: 'POST',
                    type: 'json',
                    body: param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url: 'https://www.aftdc.com/businessapp/Promotion/startPromotion',
                }, function (e) {
                    if (e.data.res === -2) {
                        that.toLogin();
                    } else if (e.data.res ===1){
                        if (e.data.msg) toast.editContent(e.data.msg);
                        param = '';
                        var url='http://assets/promotionHome.js';
                        event.toUrl({ "url": url, "param": param });
                    } else {
                        if (e.data.msg) toast.editContent(e.data.msg);
                        else toast.editContent('抱歉，网络出错了，请稍后重试');
                        return false;
                    }
                });
            },
            agreeClick(){
                if(this.agree){
                    this.agree=false;
                }
                else{
                    this.agree=true;
                }
            },
            //跳转登录
            toLogin(){
                event.delete("businessToken");
                event.delete("shopId");
                event.delete("shopName");
                const toast=this.$refs.toast;
                toast.editContent('退出成功！');
                var url='http://assets/login.js';
                var param='';
                event.toUrl({url:url,param:param});
                navigator.pop({ animated: 'false' });
            },
        },
    }
</script>

<style scoped>
    .confirm{
        text-align: center;
        line-height: 70px;
        border-top-style: solid;
        border-top-width: 2px;
        border-top-color: #f8f8f8;
    }
    .time{
        margin-top: 20px;
        text-align: right;
    }
    .bigTitle{
        font-weight: bold;
        text-align: center;
        margin-top: 40px;
    }
    .titleDtails{
        font-size: 23px;
        margin-top: 20px;
        line-height: 35px;

    }
    .titleText{
        font-weight: bold;
    }
    .titleDiv{
        margin-top: 20px;
    }
    .content{
        padding-left: 15px;
        padding-right: 15px;
    }
    .noButton{
        background-color: #ccc;
    }
    .noButton:active{
        background-color: #ccc;
    }
    .bttonText{
        margin-left: 10px;
    }
    .bttonTextTwo{
        margin-left: 10px;
        text-decoration: underline;
    }
    .buttonIcon{
        width: 30px;
        height: 30px;
    }
    .buttonTop{
        width: 750px;
        justify-content: center;
    }
    .button{
        width: 750px;
        padding-top: 20px;
        padding-left: 20px;
        padding-right: 250px;
        padding-bottom: 20px;
    }
    .enterButton {
        width: 710px;
        margin-top: 20px;
        flex-direction: row;
        justify-content: space-around;
        /*position: fixed;*/
        /*left: 0;            存在时固定在底部*/
        /*bottom: 0;*/
        /*right: 0;*/
    }

    .okButton:active {
        background-color: #57aba5;
    }
    .okButton{
        background-color: #53beb7;
    }
    .bigIma{
        width: 750px;
        height: 1744px;
    }
    /*默认样式*/
    .row{
        flex-direction: row;
        align-items: center;
    }
</style>
