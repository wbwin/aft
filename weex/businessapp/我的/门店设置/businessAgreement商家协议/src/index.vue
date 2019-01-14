<template>
    <div class="agreement">

        <!--头部-->
        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    v-once
            >
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">商家协议</text>
            </wxc-minibar>
        </div>


        <text class="textBar" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">阿凡提外卖商家协议</text>
        <scroller class="scroller">

            <div class="row">
                <text class="icon"></text>
                <text class="titleText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">【公告】“商家刷单行为”定义及处理措施</text>
            </div>
            <div class="details">
                <text class="detailsText" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">【特别提示】本协议关乎您的切身利益，在点击”同意”按钮前，请务必认真阅读并充分理解本协议，特别是免除或限制责任、法律适用、争议解决等条款（此类条款将以粗体下划线标识）。如您对本协议的内容有任何疑问，请立即停止点击“同意”或向阿凡提外卖城市相关人员（定义详见“相关定义”中有关“城市相关人员”的解释）咨询。</text>
            </div>

            <div class="row">
                <text class="icon"></text>
                <text class="titleText" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">详细内容</text>
                <text class="titleTextSmall" :style="{fontSize:GLOBAL.smallerFS}">(详细内容请点击对应章节查看)</text>
            </div>
            <div class="details">

                <!--一、相关定义-->
                <div class="row detailsUl" @click="detailsClick(0)">
                    <text :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">一、相关定义</text>
                    <image class="detailsUlIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                </div>

                <!--二、“商家刷单行为”的认定-->
                <div class="row detailsUl">
                    <text :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">二、“商家刷单行为”的认定</text>
                </div>
                <div style="padding-left: 40px;">
                    <div class="row detailsUl">
                        <text :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}" @click="detailsClick(1)">1、认定主体</text>
                        <image class="detailsUlIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                    </div>
                    <div class="row detailsUl">
                        <text :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}" @click="detailsClick(2)">2、认定规则</text>
                        <image class="detailsUlIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                    </div>
                </div>

                <!--三、“商家刷单行为”的处理-->
                <div class="row detailsUl">
                    <text :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}">二、“商家刷单行为”的处理</text>
                </div>
                <div style="padding-left: 40px;">
                    <div class="row detailsUl">
                        <text :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}" @click="detailsClick(3)">1、商品质量安全规范</text>
                        <image class="detailsUlIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                    </div>
                    <div class="row detailsUl">
                        <text :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}" @click="detailsClick(4)">2、商户诚信经营管理规范</text>
                        <image class="detailsUlIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                    </div>
                    <div class="row detailsUl">
                        <text :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}" @click="detailsClick(5)">3、商户服务态度管理规范</text>
                        <image class="detailsUlIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                    </div>
                </div>


                <!--四、“商家刷单行为”的处理-->
                <div class="row detailsUl">
                    <text :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}" @click="detailsClick(6)">四、“商家刷单行为”的处理</text>
                    <image class="detailsUlIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                </div>

                <!--五、申诉机制-->
                <div class="row detailsUl">
                    <text :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}" @click="detailsClick(7)">五、申诉机制</text>
                    <image class="detailsUlIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                </div>

                <!--六、附则-->
                <div class="row detailsUl">
                    <text :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}" @click="detailsClick(8)">六、附则</text>
                    <image class="detailsUlIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                </div>

                <!--附则：食品安全承诺书-->
                <div class="row detailsUl">
                    <text :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.dColor}" @click="detailsClick(9)">附则：食品安全承诺书</text>
                    <image class="detailsUlIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                </div>

            </div>

        </scroller>

        <!--弹出层-->
        <div class="layer" :style="{left:layerLeft,opacity:layerOpacity}">
            <div class="layerDiv">
                <text class="layerTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{layerAll[layerSelect].title}}</text>
                <scroller style="flex: 1;width: 600px;max-height: 779px">
                    <text class="layerDetails" v-for="(item,index) in layerAll[layerSelect].layerDetails" :key="index" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">{{item.text}}</text>
                </scroller>
                <text class="layerBtn" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor}" @click="closeLayer">我已阅读</text>
            </div>
        </div>

    </div>
</template>

<script>
    import {WxcButton, WxcDialog, WxcIcon, WxcMinibar,WxcMask} from 'weex-ui'
    import Toast from './Toast.vue'
    const navigator = weex.requireModule('navigator');
    const event = weex.requireModule('event');
    const post = weex.requireModule('stream');
    const modal = weex.requireModule('modal');
    const animation = weex.requireModule('animation');

    export default {
        components: {WxcButton, WxcDialog,WxcIcon, WxcMinibar,WxcMask,Toast},
        name: 'App',

        data() {
            return {
                layerLeft:'-750px',
                layerOpacity:0,
                layerSelect:0,

                layerAll:[

                    {
                        title:'一、相关定义',
                        layerDetails:[
                            {text:'1 、商家刷单行为：商家以获取非法所得、冲高销量、优势排名为目的，自身通过各种方式或怂恿他人以假乱真，通过阿凡提点餐平台或平台链接下单，以获取阿凡提点餐给消费者的各种优惠的行为。一切商家刷单行为均损害了阿凡提点餐利益，被视为作弊行为（含堂食下单，或店外下单后，到店用餐）。'},
                            {text:'2 、刷单收益金：商家通过刷单行为获得的，每一份阿凡提点餐订单对应的阿凡提点餐提供给外卖用户的补贴款或其它优惠对应的金额总和。'},
                            {text:'3 、代收外卖款项：在外卖用户选择在线支付的情形下，由阿凡提点餐实际经营者代甲方收取的外卖用户通过阿凡提点餐向甲方支付的，其确认或由系统默认收货的外卖商品／服务所对应的款项。该款项由阿凡提点餐实际经营者代收后转付至乙方，由乙方扣除相应服务费后（如有）支付给甲方。'},
                            {text:' 4 、城市相关人员：商家所在城市的城市经理或阿凡提点餐业务员（责任 BD ）。'},
                        ],
                    },

                    {
                        title:'2.1认定主体',
                        layerDetails:[
                            {text:'认定主体:商家刷单行为有阿凡提点餐根据以下规则进行判定。'}
                        ],
                    },

                    {
                        title:'2.2认定主体',
                        layerDetails:[
                            {text:'认定规则：商家行为包括但不仅限于下述行为中的任意一个或多个情形时，即认定为刷单。'},
                            {text:'(1)虚假交易，即通过阿凡提点餐下单，但商家接单后无真实配送，没有形成真实交易的订单。'},
                            {text:'(2)商家本人或商家委托其朋友、家人给自己所经营的店下单(该订单含美团补贴款)。'},
                            {text:'(3)商家店内在职服务人员、配送员，给自己的店下订单(该订单含美团补贴款)。'},
                            {text:'(4)商家与专职刷单人员合作，赚取美团补贴款。'},
                            {text:'(5)堂食：即用户在商家店内通过阿凡提点餐平台下单或通过阿凡提点餐平台下单后到店内用餐，同时此订单享有优惠（该订单含美团补贴款）。堂食订单定义为刷单。'},
                            {text:'(6)商家委托第三方（代理、中间人、中间商等）下单（该订单含美团补贴款），并非点餐用户直接下单。'},
                            {text:'(7)发现有用户存在严重虚假购买嫌疑的行为（如堂食用户下单），不及时制止也不及时向阿凡提点餐客服或城市相关人员反馈的行为。'},
                        ],
                    },

                    {
                        title:'3.1资质提交和审核',
                        layerDetails:[
                            {text:'第十条 商户须保证页面展示的商品质量合乎行业相关标准和规范，避免出现以下情况的发生：'},
                            {text:'（一）食品安全事件：是指因消费者食用由商户经营销售的商品（食品）导致消费者发生疾患并采取住院治疗（含以上）的方式进行就医的重大食品安全事件和一般食品安全事件；'},
                            {text:'（二）食材安全问题：是指消费者购得的商户经营销售的商品（食品）食材出现变质、发霉、构成明显安全隐患的情形；'},
                            {text:'（三）食品有异物：是指消费者购得的商户生产、销售的食品中存在明显异物的情形；'},
                            {text:'（四）其他潜在食品安全事件：是指除上述食品安全问题外，商户经营销售的商品（食品）被检测出含有国家法律法规规章等效力性规定所禁止或限制使用的危害人体健康和安全的成分（如三聚氰胺），或者经媒体曝光商户所经营销售的食品存在前述情形。'},
                            {text:'第十一 条凡是出现上述商品质量安全问题的商户，商户须首先确保全权负责解决由此而产生的所有问题，并承担用户的全部损失包括但不限于损失索赔、经济补偿、精神损失等，其次商户必须下线整改，整改完毕经阿凡提点餐相关核查符合要求的，方可上线。'},
                        ],
                    },

                    {
                        title:'3.2商户诚信经营管理规范',
                        layerDetails:[
                            {text:'第十二条 阿凡提点餐一直秉承“客户第一”的价值观，携手合作商户共同为用户提供良好的消费体验，同时营造公平公正公开的商户合作环境，为此阿凡提点餐自始至终鼓励和要求商户诚信经营，严格履行相应的义务。合作商户不允许出现包括但不限于以下不诚信经营行为：'},
                            {text:'（一）虚构订单（如下简称“刷单” )'},
                            {text:'虚构订单是指商户工作人员自身亲或商户工作人员委托／唆使／暗示他人进行的，不以真实外卖消费为目的而购买外卖商品／服务，以套取不正当利益的行为。'},
                            {text:'刷单行为包括但不限于：'},
                            {text:'1.自行或唆使／雇佣／指使他人在阿凡提点餐页面虚假购买／虚假接单，以提升页面订单成交量或据此套取阿凡提点餐优惠活动补贴经费的行为；'},
                            {text:'2.引导／暗示堂食用户下外卖单从而享受优惠活动，以吸引堂食用户并套取优惠活动补贴经费的行为；'},
                            {text:'3.友现有用户存在严重虚假购买嫌疑的情形(如堂食用户下单)，不及时制止也不及时向阿凡提点餐客服或业务经理反馈的行为。'},
                            {text:'4.其他以任何方式或形式刻意规避阿凡提点餐上述规定及及监管措施的行为。'},
                            {text:'（二）价格欺诈（如下简称“原价虚高” )'},
                            {text:'原价虚高，是指商户在阿凡提点餐平台页面展示的价格高于其他同类型网站页面展示价格或店内经营商品的实际价格，或其他通过欺诈手段操纵或虚构价格以达到欺诈消费者与阿凡提点餐平台目的的行为。原价虚高包括但不限于以下几种行为：'},
                            {text:'(1) 直接在店内的商品单价的基础上抬高价格；'},
                            {text:'(2) 将餐盒费、包装费、配送费等非商品价格直接或间接加价至商品单价以抬高价格；'},
                            {text:'(3) 以参与优惠活动的名义先提升价格再参与优惠活动的行为；'},
                            {text:'(4) 其他任何页面价格高于店内实际经营价格的行为。'},
                            {text:'（三）未按平台要求处理客诉问题'},
                            {text:'未按平台要求处理客诉问题是指用户在实际消费的过程中因商品质量问题，服务态度不满意等原因e而向阿凡提点餐提起的反馈、检举后，商户接到用户的反馈和投诉，应第一时间积极配合阿凡提点餐协求处理方案进行处理的行为。未按平台要求处理客诉问题行为包括但不限于以下行；'},
                            {text:'(1) 延迟配送，是指自商家接单时刻起超过60分钟尚未送餐至用户的行为'},
                            {text:'(2) 接单不配送，是指商家在用户下单后接单，但因各种原因不配送且也不主动联系用户取消订单的，或接单后长时间（大于10分钟）才取消订单但不联系用户说明情况的行为；'},
                            {text:'(3) 拒不退款，是指采用在线支付的用户在取消订单后发起的退款或其他因核实为正当理由发起的退款，商家拒不退款的行为；'},
                            {text:'(4) 拒不赔付，是指参与超时赔付的商户，在超时配送后应按约定给予用户赔付的却拒不履行的行为，或其他客诉问题经沟通同意由商家对用户赔偿却不如约赔付的行为；'},
                            {text:'(5) 其他客诉问题但商户拒不配合处理的行为。'},
                            {text:'（四）侵犯知识产权'},
                            {text:'侵犯知识产权，是指未经授权或允许私自采用他人注册商标、品牌logo、图片等行为。'},
                            {text:'(5) 盗用他人账号'},
                            {text:'盗用他人账号是指商户盗用其他合作商户或消费者阿凡提点餐登陆账户，涉嫌侵犯他人财产权的行为。'},
                            {text:'(6) 发布违禁信息'},
                            {text:'发布违禁信息是指商户发布国家法律法规规定的违禁商品／服务信息，或食药监局等有权机关明令要求下架、不得销售的商品／服务信息。'},
                            {text:'(7) 商业贿赂'},
                            {text:'商业贿赂是指商户向阿凡提点餐工作人员及／或其关联人士提供财物、消费、款待或商业机会等，以谋取不正当利益的行为。'},
                            {text:'第十三条 阿凡提点餐严厉打击各种违规行为，包括但限于本办法中所提及的相关违规行为，一经发现合作商户存在影响平台健康运营秩序，损害消费者和其他合作商户利益的违规行为，阿凡提点餐将依据本办法第四章之规定进行处理。'},
                        ],
                    },

                    {
                        title:'3.3商户服务态度管理规范',
                        layerDetails:[
                            {text:'第十四条阿凡提点餐合作商户应和阿凡提点餐一起将最好的产品、最优良的服务送到消费者手中，在用户服务的过程中不得出现恶意骚扰和辱骂客户的行为。'},
                            {text:'(一) 恶意骚扰'},
                            {text:'恶意骚扰的行为是指商户采取包括但不限于威胁人身安全、干扰正常工作或生活秩序等各类恶劣手段骚扰他人（包括消费者、阿凡提点餐工作人员或其他合作商户），妨害他人合法权益的行为。'},
                            {text:'(二) 辱骂客户'},
                            {text:'辱骂客户的行为是指阿凡提点餐合作商户的工作人员（前台、送餐员等）在为用户提供服务的过程中，出现辱骂、诅咒客户的行为。'},
                        ],
                    },

                    {
                        title:'4.1“商家刷单行为”的处理',
                        layerDetails:[
                            {text:'商家存在刷单行为的，应向阿凡提点餐归还刷单收益金。'},
                            {text:'2 、商家行为首次被认定为刷单行为之日起，阿凡提点餐有权停止代收外卖款项的支付并禁止商家提现（以下简称冻结）直至阿凡提点餐收回商家全部刷单收益金为止；阿凡提点餐有权直接从冻结代收外卖款项中扣除相应刷单收益金；如冻结代收外卖款项不足以抵扣刷单收益金，阿凡提点餐有权继续向商家追偿。'},
                            {text:'若商家对阿凡提点餐执行扣款的行为有任何异议，可于扣款之日起 7 个工作日内联系城市相关人员提出申诉，逾期阿凡提点餐有权不再处理任何与扣款相关的申诉问题；阿凡提点餐将于接受城市申诉之日起 30 个工作日之内向城市相关人员反馈最终处理结果'},
                            {text:'3 、商家刷单收益金清算后，如该商家被认定为首次刷单，商家须签署 《 诚信经营承诺书 》 ，并约定如果再次发生刷单行为后须向阿凡提点餐支付的保证金金额（保证金金额视商家刷单严重性而定，不得低于 2000 元），经阿凡提点餐审核通过后，双方可按照已经签订的 《 服务合同 》 继续履行合同内容。'},
                            {text:'4 、如商家的刷单行为被阿凡提点餐认定为二次及以上的，阿凡提点餐有权直接对商家进行关店处理，并按照 《 诚信经营承诺书 》 约定将商家在阿凡提点餐网站关店 1 个月至 1 年不等（视商家刷单严重性而定）。关店发生之日起满两周的，若商家希望提前解除上述限制，需联系城市相关人员，并按照 《 诚信经营承诺书 》 约定的金额支付保证金。上述限制解除后，若商家再次出现刷单行为，阿凡提点餐有权对商家支付的保证金予以全额扣除；若其后未出现刷单行为，双方合作结束后的第 3 个工作日，阿凡提点餐将如数无息返还保证金。'},
                        ],
                    },

                    {
                        title:'五、申诉机制',
                        layerDetails:[
                            {text:'第十六条 违规行为认定'},
                            {text:'商户涉嫌实施本办法第三章规定之违规行为的，阿凡提点餐有权根据实际情况对商户采取临时处理措施（例如，暂停发布与涉嫌违规行为有关的商户外卖信息；暂停与商户的款项结算等）。如阿凡提点餐确认该商户违规的，则届时阿凡提点餐将根据商户的违规情况将临时处理措施转为按照本办法规定给予其相应违规处理；如商户无违规行为的，则届时阿凡提点餐将终止临时处理措施的执行'},
                            {text:'第十七条 申诉机制'},
                            {text:'1.商户如对阿凡提点餐作出的违规处理决定有异议的，可通过向阿凡提点餐业务负责人反馈，由其向阿凡提点餐提出申诉，并根据阿凡提点餐要求提交真实、合法的相关证明资料。'},
                            {text:'2.阿凡提点餐总部负责审核商户提出的申诉请求，如异议成立的，阿凡提点餐即时停止针对该商户的违规处理措施；如异议不成立的，不影响阿凡提点餐对该商户违规处理措施的执行。'},
                            {text:'3.阿凡提点餐业务负责人负责将申诉审核结果反馈商户。'},
                        ],
                    },

                    {
                        title:'六、附则',
                        layerDetails:[
                            {text:'第十八条本办法于 2014 年 11 月 28 日发布，与发布届满七日后生效，所有合作商户应认真阅读，并依据执行。'},
                            {text:'第十九条阿凡提点餐可根据实际情况随时调整本办法的内容，并通过阿凡提点餐网页向商户进行公示和发布。'},
                            {text:'第二十条本办法未尽事宜，参照阿凡提点餐规则进行处理。阿凡提点餐拥有对本办法的最终解释权。'},
                        ],
                    },

                    {
                        title:'附则：食品安全承诺书',
                        layerDetails:[
                            {text:'为了认真贯彻执行 《 食品安全法 》 ，在确保食品产和流通安全为前提，更好地服务餐厅和用户，本经营者郑重承诺：'},
                            {text:'一、严格遵守 《 中华人民共和国食品安全法 》 及其实施条例、 《 餐饮服务许可管理办法 》 、 《 餐饮服务食品安全监督管理办法 》 等相关法律法规，严格执行餐饮服务行业规范，牢固树立安全第一，诚信经营的观念。'},
                            {text:'二、保证遵守七个“不采购”，一个“不使用”，两个“不经营”。'},
                            {text:'（一）七个“不采购”：'},
                            {text:'1.不采购使用非定点屠宰单位供应、未经检疫合格的猪肉，以及病死或者死因不明的禽畜肉及其制品；'},
                            {text:'2.不采购使用无合法来源的米、面、食用油和酱油等调味品；'},
                            {text:'3.不采购使用非食用盐或有毒有害物质加工食品；'},
                            {text:'4.不采购使用无卫生许可证的食品添加剂，不超范围、不超剂量滥用食品添加剂；'},
                            {text:'5.不采购使用腐烂、变质或感官性状异常的食品及其原料，以及河豚鱼、野蘑菇等含有毒有害物质的动植物；'},
                            {text:'6.不采购使用无合法证照的生产经营者的食品及食品用产品；'},
                            {text:'7.不采购使用无食品名称、生产单位、生产单位、生产地址、生产日期和保质期，以及包装不完整或超过保质期的预包装食品。'},
                            {text:'（二）一个“不使用” :'},
                            {text:'不使用未经有效消毒的餐用具。'},
                            {text:'（三）两个“不经营” :'},
                            {text:'1 ．不经营 《 中华人民共和国食品安全法 》 及其他食品相关法律法规禁止生产经营的其它食品。'},
                            {text:'2 ．不经营 《 营业执照 》 范围以外的其他食品。'},
                            {text:'三、保证严格按照国家食品安全相关法律法规的要求，配备与生产经营的食品品种、数量相适应的食品原料处理和食品加工、包装、贮存等场地且符合下列要求：'},
                            {text:'（一）经营场所与有毒、有害场所以及其他污染源保持规定距离；'},
                            {text:'（二）经营场所与个人生活空间分开；'},
                            {text:'（三）经营场所保持内部环境整洁；'},
                            {text:'四、保证严格按照国家食品安全相关法律法规的要求，配备与生产经营的食品品种、数量相适应的消毒、更衣、盥洗、采光、照明、通风、防腐、防尘、防蝇、防鼠、防虫、洗涤以及处理废水、存放垃圾和废弃物的设备或者设施，营造良好的餐饮卫生服务环境，切实保障消费者身体健康和生命安全。'},
                            {text:'五、保证严格按照国家食品安全相关法律法规的要求，在生产加工过程中，使用符合国家有关规定和相关标准之原材料和食品添加剂等，且符合下列要求：'},
                            {text:'（一）原辅料质量要求：'},
                            {text:'1.保证符合国家有关规定和相关标准的要求，不使用过期的、失效的、变质的、污秽不洁的、回收的、受污染的原材料或非食品用原辅料生产食品；'},
                            {text:'2.保证采取必要检验和准入措施确保采购的原辅料符合要求；'},
                            {text:'3.列入食品生产许可证管理的，保证使用获证产品。'},
                            {text:'（二）原辅料贮存要求：'},
                            {text:'1.根据国家相关规定和标准之贮存要求采取措施确保原辅料的质量安全；'},
                            {text:'2.保证盛装容器保持清洁，并保持食品操作间及餐具、厨具和灶具清洁卫生；'},
                            {text:'3.保证采用先进先出原则对库存合理周转。'},
                            {text:'（三）原辅料在使用前，保证先经过检查，确保原料干净卫生，适合加工要求。'},
                            {text:'（四）保证使用天平或其他称等称量工具对食品添加剂进行称量，并保证食品添加剂的使用符合 GB276O 及相应的标准和有关规定。'},
                            {text:'（五）食品生产用水保证符合 GB5749 的要求；与食品接触的冰或水蒸气等应采用生活饮用水制成'},
                            {text:'（六）保证采取有效措施使用原辅料、半成品与成尼有效分离，并确保与食品接触的设备、工具等表面清洁，防止交叉污染。'},
                            {text:'（七）保证按照确定的生产工艺程序进行食品生左，应采取有效控制食品热处理时间和温度的措施。'},
                            {text:'（八）保证生产加工过程中，符合国家食品安全其他相关法律法规和有关标准的要求。六、保证建立健全从业人员的健康管理制度。保证本商户内所有人员每年进行必要的健康检查，取得健康证明后从事食品经营活动，不雇佣无健康合格证明人员从事接触食品的工作。定期组织从业人员食品安全知识培训，发现有妨碍食品安全病症的，立即脱离工作岗位。'},
                            {text:'七、保证建立健全食品进货查检记录制度。采购食品时查验供货者的许可证、营业执照和食品合格的证明文件，并如实记录食品的名称、规格、数量、生产批号、保质期、供货者名称及联系方式、进货日期等内容，保存期限不少于两年。'},
                            {text:'八、对于自检或行政部门公布的不合格食品，立即采取下架封存、停止销售等措施，作好相关的记录和通知相关生产经营者和消费者，并协助做好不合格食品的召回工作。'},
                            {text:'九、保证严格遵守国家食品安全其他本承诺书未列明的所有相关法律法规以及有关标准规定。'},
                            {text:'十、本商户如售卖不符合食品安全标准的食品，承诺赔偿消费者和阿凡提点餐损失，并承担相应的法律责任。'},
                        ],
                    },
                ],

            }
        },
        created (){},
        mounted() {},
        methods:{
            minibarLeftButtonClick(){},
            detailsClick(index){
                this.layerLeft='0px';
                this.layerOpacity=1;
                this.layerSelect=index;
            },
            closeLayer(){
                this.layerLeft='-750px';
                this.layerOpacity=0;
            },
        },
    }
</script>

<style scoped>
    .agreement{
        background-color: #f8f8f8;
        position: relative;
    }
    .row{
        flex-direction: row;
        align-items: center;
    }

    .textBar{
        padding-top: 25px;
        padding-left: 25px;
        padding-bottom: 25px;
        font-weight: bold;
    }
    .scroller{
        flex: 1;
        width: 750px;
        padding-left: 50px;
        padding-right: 25px;
    }
    .icon{
        width: 4px;
        height: 30px;
        background-color: #53beb7;
    }
    .titleText{
        margin-left: 15px;
        font-weight: bold;
    }
    .titleTextSmall{
        margin-left: 15px;
        color: #999;
    }
    .details{
        padding-left: 20px;
        padding-bottom: 15px;
    }
    .detailsUl{
        margin-top: 15px;
    }
    .detailsUlIcon{
        margin-left: 10px;
        width: 20px;
        height: 20px;
    }
    .detailsText{
        width: 639px;
        margin-top: 15px;
    }

    .layer{
        position: absolute;
        top: 0;
        bottom: 0;
        width: 750px;
        background-color: rgba(0,0,0,0.6);
        align-items: center;
        justify-content: center;

        transition-property: opacity;
        transition-duration: 0.5s;
        transition-delay: 0s;
        transition-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1.0);
    }
    .layerDiv{
        width: 600px;
        max-height: 1000px;
        background-color: #fff;
        border-radius: 10px;
    }
    .layerTitle{
        height: 100px;
        line-height: 100px;
        text-align: center;
    }
    .layerDetails{
        padding-left: 20px;
        padding-right: 20px;
        line-height: 35px;
    }
    .layerBtn{
        height: 80px;
        line-height: 80px;
        text-align: center;
        border-top-style: solid;
        border-top-width: 2px;
        border-top-color: #dedede;
        margin-top: 40px;
    }
</style>