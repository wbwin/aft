<template>
    <div class="wrapper" >
        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="backClick"
                    @wxcMinibarRightButtonClicked="minibarRightButtonClick"
                    v-once>
                <image :style="GLOBAL.headerImg" slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter" slot="middle">法律声明</text>
                <text :style="GLOBAL.headerRight" slot="right"></text>
            </wxc-minibar>
        </div>
        <scroller show-scrollbar="true">
        <div class="content">
            <text class="headerText dcolor bold" :style="{fontSize:GLOBAL.biggerFS}">法律声明</text>
            <text class="lineHeight46 dcolor mt24" :style="{fontSize:GLOBAL.biggerFS}" v-for="item in preface">{{item}}</text>

            <div v-for="item in legalDeclarationText">
                <text class="headerText dcolor bold  mt24" :style="{fontSize:GLOBAL.biggerFS}">{{item.title}}</text>
                <div v-for="list in item.content">
                    <text class="lineHeight46 dcolor bold mt24" :style="{fontSize:GLOBAL.biggerFS}" v-if="list.subtitle">{{list.subtitle}}</text>
                    <text class="lineHeight46 dcolor mt24" :style="{fontSize:GLOBAL.biggerFS}" v-for="p in list.paragraph">{{p}}</text>
                </div>
            </div>
        </div>
        </scroller>
    </div>
</template>
<script>
    import {WxcMinibar} from 'weex-ui'
    export default {
        data() {
            return {
                preface:[
                    '     阿凡提网提醒您：在您使用阿凡提网的各项服务前，请您务必仔细阅读并透彻理解本声明。如果您使用阿凡提网，您的使用行为将被视为对本声明全部内容的认可。',
                    '阿凡提网转载作品出于传递更多信息之目的，任何单位或个人认为阿凡提网网页内容可能涉嫌侵犯其合法权益，应该及时向阿凡提网提出书面权利通知，并提供身份证明、权属证明、具体链接（URL）及详细侵权情况证明。阿凡提网在收到上述法律文件后，将会依法尽快处理。'
                ],
                legalDeclarationText: [
                    {
                        title: '知识产权声明',
                        content: [
                            {
                                subtitle: '一、阿凡提网知识产权',
                                paragraph: [
                                    '阿凡提网平台所有的产品、技术与所有程序均属于阿凡提网知识产权，为北京三快科技有限公司及其允可的关联公司所有和使用。阿凡提网公司独立拥有或与相关内容提供者共同拥有阿凡提网站内相关内容（包括但不限于文字、图片、音频、视频资料及页面设计、编排、软件等）的版权和/或其他相关知识产权。“aftdc”、“阿凡提”、“阿凡提网”、阿凡提及aftdc组合图标、标识以及本公司依法申请注册并具有商标专用权的商标均为注册商标，受中国法律保护。',
                                    '除非中国法律另有规定，未经阿凡提网公司书面许可，对于阿凡提网公司拥有版权和/或其他知识产权的任何内容，任何人不得擅自（包括但不限于：以非法的方式复制、传播、展示、镜像、上载、下载）使用。否则，阿凡提网公司将依法追究法律责任。'
                                ]
                            },
                            {
                                subtitle: '二、团购用户知识产权',
                                paragraph: [
                                    '任何用户接受《阿凡提网用户协议》，即表明该用户主动将其在阿凡提网发表的任何形式的信息的著作财产权，包括并不限于：复制权、发行权、出租权、展览权、表演权、放映权、广播权、信息网络传播权、摄制权、改编权、翻译权、汇编权以及应当由著作权人享有的其他可转让权利无偿独家转让给阿凡提网的运营商所有，同时表明该用户许可阿凡提网有权利就任何主体侵权而单独提起诉讼，并获得全部赔偿。 本协议已经构成《著作权法》第二十五条所规定的书面协议，其效力及于用户在阿凡提网发布的任何受著作权法保护的作品内容，无论该内容形成于本协议签订前还是本协议签订后。',
                                    '用户同意并明确了解上述条款，不将已发表于阿凡提网的信息，以任何形式发布或授权其它网站（及媒体）使用。同时，用户保证己方在阿凡提网上发布的一切图文信息资料均具有完全知识产权和合法权利，不侵犯任何人人身或财产等一切合法权利。',
                                    '为了保证评价的真实性与合法性，如果发现用户上传的图片中含有侵权内容，包括且不限于侵犯他人人身或财产权利，或带有其他网站的logo、图标等标识信息，阿凡提网保留删除站内各类不符合规定评价而不通知用户的权利。'
                                ]
                            },
                            {
                                subtitle: '三、使用许可',
                                paragraph: [
                                    '未经北京三快科技有限公司的明确书面许可，任何单位或个人不得以任何方式，以任何文字作全部和局部复制、转载、引用和链接。否则北京三快科技有限公司将追究其法律责任。'
                                ]
                            }
                        ]
                    },
                    {
                        title: '作弊检测',
                        content: [
                            {
                                paragraph: [
                                    '若阿凡提网通过技术检测、人工抽检等手段有合理理由怀疑用户资料信息为错误、不实、失效或不完整，本网站有权暂停或终止用户的账号，并拒绝现在或将来使用本站网站网络服务的全部或部分，同时保留追索用户不当得利返还的权利。'
                                ]
                            }
                        ]
                    },
                ]

            }
        },
        components: {WxcMinibar},
        methods: {
            backClick(){

            },
            minibarRightButtonClick(){

            }
        }
    }
</script>

<style scoped>
    .wrapper {
        background-color: white;
    }
    .content {
        padding-top: 50px;
        padding-bottom: 80px;
        padding-left: 30px;
        padding-right: 24px;
    }
    .headerText {
        text-align: center;
    }
    .mt24 {
        margin-top: 24px;
    }
    .lineHeight46 {
        line-height: 46px;
    }
    .dcolor {
        color: #373737;
    }
    .bold {
        font-weight: bold;
    }
</style>
