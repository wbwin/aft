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
                <text :style="GLOBAL.headerCenter" slot="middle">一键连Wi-Fi服务声明</text>
                <text :style="GLOBAL.headerRight" slot="right"></text>
            </wxc-minibar>
        </div>
        <scroller show-scrollbar="true">
        <div class="content">
            <text class="headerText dcolor bold" :style="{fontSize:GLOBAL.biggerFS}">阿凡提一键连Wi-Fi服务声明</text>
            <div class="mt40" v-for="item in wifiServiceStatementText">
                <text class="lineHeight46 dcolor mt24 bold" :style="{fontSize:GLOBAL.biggerFS}" >{{item.title}}</text>
                <text class="lineHeight46 dcolor mt24" :style="{fontSize:GLOBAL.biggerFS}" v-for="p in item.paragraph">{{p}}</text>
            </div>
            <text class="companyName black" :style="{fontSize:GLOBAL.biggerFS}">阿凡提公司</text>
        </div>
        </scroller>
    </div>
</template>
<script>
    import {WxcMinibar} from 'weex-ui'
    export default {
        data() {
            return {
                wifiServiceStatementText: [
                    {
                        paragraph: [
                            '为使用阿凡提一键连WiFi分享功能（以下简称“本功能”）及服务，您应当阅读并遵守《一键连WIFI服务声明》（以下简称“本声明”）。您一旦使用本功能，即表示您理解、同意并遵守本声明。'
                        ]
                    },
                    {
                        title: '一、 一键连WiFi分享功能的服务',
                        paragraph: [
                            '1    WiFi分享功能仅为用户提供上传空间服务，供用户分享公共WiFi信息，本功能仅系帮助用户连接网络的工具，阿凡提向用户提供的包括但不限于移动终端上的WiFi辅助连接、公共WiFi分享等功能及服务（以下简称“本服务”）',
                            '2    为了增进用户体验、完善服务内容，阿凡提将不断努力开发新的服务，并为您不时提供功能更新。阿凡提有权不经向您通知而对功能进行更新，或者对部分功能进行改变或限制。'
                        ]
                    },
                    {
                        title: '二、 用户须知',
                        paragraph: [
                            '1   您理解并同意：为了向您提供有效的服务，本功能会利用您移动通讯终端的处理器和带宽等资源。本功能使用过程中可能产生数据流量的费用，您需自行向运营商承担相关费用。',
                            '2   您理解并同意：本功可能会让第三方知晓用户的信息，例如：用户进行网络分享时,其他用户可能会知晓您的网络运营商等。',
                            '3   您充分了解并同意，您必须为自己使用本服务时的一切超出本声明的行为或由其他不可抗拒因素引起的异常自行承担责任。您应对本服务的内容自行加以判断，并须自行承担如下来自阿凡提不可掌控的风险内容，包括但不限于：',
                            '3.1由于不可抗拒因素可能引起的个人信息丢失、泄漏等风险；',
                            '3.2 您在使用本功能访问第三方APP等产品时，因此所可能导致的风险，均由您自行承担；',
                            '3.3由于无线网络信号不稳定、带宽不足等原因，所引起的风险。',
                            '4   您使用本功能不得利用本服务从事以下行为，包括但不限于：',
                            '4.1 发布、传送、传播、储存违反国家法律、危害国家安全统一、社会稳定、公序良俗、社会公德以及侮辱、诽谤、淫秽、暴力的内容；',
                            '4.2 发布、传送、传播、储存侵害他人名誉权、肖像权、知识产权、商业秘密等合法权利的内容；',
                            '4.3 虚构事实、隐瞒真相以误导、欺骗他人；',
                            '4.4 发布、传送、传播广告信息及垃圾信息；',
                            '4.5 从事其他违反法律法规、政策及公序良俗、社会公德等的行为。',
                            '5   您理解并同意，本功能同大多数互联网功能一样，可能会受多种因素影响（包括但不限于用户原因、网络服务质量、社会环境等）；也可能会受各种安全问题的侵扰（包括但不限于他人非法利用用户资料，进行现实中的骚扰；用户下载安装的其他软件或访问的其他网站中可能含有病毒、木马程序或其他恶意程序，威胁您的移动终端设备和数据的安全，继而影响本功能的正常使用等）。因此，您应加强信息安全及个人信息的保护意识，注意账户和密码保护，以免遭受损失。'
                        ]
                    },
                    {
                        title: '三、法律责任和免责声明',
                        paragraph: [
                            '1   您充分了解并同意，本服务仅为用户提供上传空间服务，供用户分享公共WiFi热点信息，阿凡提对用户传输内容仅作安全加密保存，除此之外不做任何其他修改或编辑，也不对用户上传的数据内容的适用性、合法性等提供审查及担保服务。阿凡提并不提供任何WiFi及Internet上网服务。您进行公共WiFi信息分享或进行相关WiFi信息提交时，应当保证分享、提交的信息系真实、准确、有效、安全，且您有权对相关信息进行分享、提交，您的分享、提交行为不会造成其他用户对公共WiFi的误认，亦不会侵犯他人的合法权益。若由于您的分享、提交行为造成的问题和/或纠纷，均由您负责解决由此引发纠纷并承担全部的法律责任和经济赔偿责任，阿凡提就此不承担任何责任。为了提升良好的用户体验，阿凡提将竭力提升WiFi辅助连接的效果，但由于技术条件等原因限制，阿凡提并不能就此提供完全保证。本功能识别出的WiFi信息仅供用户参考，阿凡提不对WiFi的真实性、准确性、有效性、安全性等承担任何法律责任。任何单位或个人认为WiFi信息识别有误的，请您直接通知阿凡提，并提供相应证明材料，我们将依法进行处理。',
                            '2   本功能的一切著作权、商标权、专利权、商业秘密等知识产权，以及与本功能相关的所有信息内容（包括但不限于文字、图片、音频、视频、图表、界面设计、版面框架、有关数据或电子文档等）均受中华人民共和国法律法规和相应的国际条约保护，阿凡提享有上述知识产权，但相关权利人依照法律规定应享有的权利除外。',
                            '3   未经阿凡提事先书面同意，您不得对本功能及服务进行对本功能进行反向工程、反向汇编、反向编译，或者以其他方式尝试发现本功能的源代码，不得破坏其完整性（包括程序代码、数据等）。',
                            '4   您充分了解并同意，您必须为自己使用本功能及服务下的一切行为负责。阿凡提不对您使用本功能及服务所产生的结果的安全性、正确性、及时性、完整性、实用性等作出任何保证，您应对您使用本功能及服务中的内容或所产生的结果自行加以判断，并承担因使用内容而引起的所有风险。阿凡提无法且不会对因前述风险而导致的任何损失或损害承担责任。'
                        ]
                    },
                    {
                        title: '四、用户违约责任',
                        paragraph: [
                            '1   您理解并同意，阿凡提有权依据合理判断对于违反有关法律法规或本声明的行为进行处罚，对违法违规的用户采取适当的法律行动，包括但不限于停止提供服务、限制使用、法律追究、取消账户，并依据相关法律法规保存有关信息向有关部门报告等，用户应独自承担由此产生的一切法律责任。',
                            '2   您理解并同意，您违反本声明，导致或产生的任何第三方主张的任何索赔、要求或损失，包括合理的律师费，均由您独自承担由此而产生的一切法律责任。阿凡提因此遭受损失的，您也应当一并赔偿。'
                        ]
                    },
                    {
                        title: '其他',
                        paragraph: [
                            '1   本声明被视为《阿凡提网用户协议》及《法律声明》的补充协议，是其不可分割的组成部分，与其构成统一整体。本声明与上述内容存在冲突的，以本声明为准；本声明未提及的，以《阿凡提网用户协议》为准。',
                            '2   本声明内容同时包括阿凡提可能不断发布的关于本服务的相关协议、业务规则等内容。上述内容一经正式发布，即为本声明不可分割的组成部分，您同样应当遵守。',
                            '3   您的使用本功能即视为您已阅读并同意受本声明的条款。阿凡提有权在必要时修改本声明条款。您可以在本功能的最新版本中查阅相关条款内容。本声明条款变更后，如果您继续使用本功能，即视为您已接受修改后的条款。如果您不接受修改后的条款，应立即停止使用本功能。'
                        ]
                    }
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
        padding-bottom: 220px;
        padding-left: 30px;
        padding-right: 24px;
    }
    .headerText {
        text-align: center;
    }
    .mt24 {
        margin-top: 24px;
    }
    .mt40 {
        margin-top: 40px;
    }
    .lineHeight46 {
        line-height: 46px;
    }
    .black {
        color: #000;
    }
    .dcolor {
        color: #373737;
    }
    .bold {
        font-weight: bold;
    }
    .companyName {
        margin-top: 80px;
    }
</style>
