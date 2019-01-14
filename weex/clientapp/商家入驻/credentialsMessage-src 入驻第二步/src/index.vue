<template>
    <div class="wrapper" @viewappear="viewappear" @viewdisappear="viewdisappear" @touchmove="touchmove" @touchend="touchend">
        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    v-once
            >
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">资质信息</text>
                <!--<text :style="GLOBAL.headerRight"  slot="right">帮助</text>-->
            </wxc-minibar>
        </div>
        <scroller class="scroller" @scroll="scrollMove">
            <div>
                <div class="listCellTitle">
                    <text :style="{fontSize:GLOBAL.biggerFS,color:'#999'}">法定代表人</text>
                </div>
            </div>
            <div>
                <div class="listCell">
                    <div class="listCellContent">
                        <div class="content_left">
                            <image class="redStar" src="https://image.aftdc.com/appBimg/redStar.png"></image>
                            <text  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">证件类型</text>
                        </div>
                        <div class="content_right" @click="pickIDCard">
                            <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{idCardValue}}</text>
                            <image class="moreImg"
                                   src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                        </div>
                    </div>
                    <div class="listCellContent" v-for="(item,index) in titleList" :key="index">
                        <div class="content_left">
                            <image class="redStar" src="https://image.aftdc.com/appBimg/redStar.png"></image>
                            <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.title}}</text>
                        </div>
                        <div class="content_right">
                            <image class="choiceImg" resize="cover" @click="openBottomPopup(index)" :src="img[index].localPart!=''?img[index].localPart:'https://image.aftdc.com/appBimg/icon_add_image.png'"></image>
                            <div class="imgExplain">
                                <text class="explainSize" :style="{fontSize:GLOBAL.bigFS,color:'#999'}">{{item.describe}}</text>
                                <text class="exampleSize" :style="{fontSize:GLOBAL.bigFS,color:'#53beb7'}" @click="exampleImgClick(index)">查看示例图片</text>
                            </div>
                        </div>
                    </div>
                    <div class="listCellContent">
                        <div class="content_left">
                            <image class="redStar" src="https://image.aftdc.com/appBimg/redStar.png"></image>
                            <text  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">真实姓名</text>
                        </div>
                        <div class="content_right">
                            <input class="input" :style="GLOBAL.inputText" type="text" v-model="idCard.name" placeholder="证件上的姓名" ref="toastOne"/>
                        </div>
                    </div>
                    <div class="listCellContent">
                        <div class="content_left">
                            <image class="redStar" src="https://image.aftdc.com/appBimg/redStar.png"></image>
                            <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">证件号码</text>
                        </div>
                        <div class="content_right">
                            <input class="input" :style="GLOBAL.inputText" type="number" v-model="idCard.number" placeholder="证件上的号码" ref="toastTwo"/>
                        </div>
                    </div>

                    <div class="listCellContent">
                        <div class="content_left">
                            <image class="redStar" src="https://image.aftdc.com/appBimg/redStar.png"></image>
                            <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">银行</text>
                        </div>
                        <div class="content_right" @click="pickBank">
                            <text class="restaurantValueSize" :style="{fontSize:GLOBAL.bigFS,color:bankIndex==-1?'#999':GLOBAL.dColor}">{{bankValue}}</text>
                            <image class="moreImg"
                                   src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                        </div>
                    </div>
                    <div class="listCellContent" v-if="bankIndex!=-1">
                        <div class="content_left">
                            <image class="redStar" src="https://image.aftdc.com/appBimg/redStar.png"></image>
                            <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">本人银行卡</text>
                        </div>
                        <div class="content_right">
                            <input class="input" :style="GLOBAL.inputText" type="number" ref="bankNumber" v-model="bank.number" @input="bankInput"
                                   placeholder="银行卡号"/>
                        </div>
                    </div>
                    <div class="listCellContent" v-if="bankIndex!=-1">
                        <div class="content_left"></div>
                        <div class="content_right">
                            <text  :style="{fontSize:GLOBAL.bigFS,color:checkBankNumber==1?GLOBAL.tColor:'#f00'}">{{checkBankNumber==0?'请输入与所选银行相对应的银行卡号':checkBankNumber==-1?'卡号错误':'卡号正确'}}</text>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div class="listCellTitle">
                    <text :style="{fontSize:GLOBAL.biggerFS,color:'#999'}">主体资质</text>
                    <text :style="{fontSize:GLOBAL.biggerFS,color:'#999'}"></text>
                </div>
            </div>
            <div>
                <div class="listCell">
                    <div class="listCellContent">
                        <div class="content_left">
                            <image class="redStar" src="https://image.aftdc.com/appBimg/redStar.png"></image>
                            <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">证件类型</text>
                        </div>
                        <!--<div class="content_right" @click="pickLicense">-->
                        <!--<text class="defaultSize">{{licenseValue}}</text>-->
                        <div class="content_right">
                            <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">营业执照</text>
                            <!--<image class="moreImg"-->
                            <!--src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>-->
                        </div>
                    </div>
                    <div class="listCellContent" v-for="(item,index) in titleList2" :key="index">
                        <div class="content_left">
                            <image class="redStar" src="https://image.aftdc.com/appBimg/redStar.png"></image>
                            <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.title}}</text>
                        </div>
                        <div class="content_right">
                            <image class="choiceImg" resize="cover" :src="img[4].localPart!=''?img[4].localPart:'https://image.aftdc.com/appBimg/icon_add_image.png'"
                                   @click="openBottomPopup(4)"></image>
                            <div class="imgExplain">
                                <text class="explainSize" :style="{fontSize:GLOBAL.bigFS,color:'#999'}">请注意证件照片上的文字能够清晰可见</text>
                                <text class="exampleSize" :style="{fontSize:GLOBAL.bigFS,color:'#53beb7'}" @click="exampleImgClick2()">查看示例图片</text>
                            </div>
                        </div>
                    </div>
                    <div class="listCellContent">
                        <div class="content_left">
                            <image class="redStar" src="https://image.aftdc.com/appBimg/redStar.png"></image>
                            <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">单位名称</text>
                        </div>
                        <div class="content_right">
                            <input class="input" :style="GLOBAL.inputText" type="text" v-model="businessImg.unitName" placeholder="证件上的单位名称" ref="toastThree"/>
                        </div>
                    </div>
                    <div class="listCellContent">
                        <div class="content_left">
                            <image class="redStar" src="https://image.aftdc.com/appBimg/redStar.png"></image>
                            <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">注册号</text>
                        </div>
                        <div class="content_right">
                            <input class="input" :style="GLOBAL.inputText" type="text" v-model="businessImg.registerNum"
                                   placeholder="证件上对应注册号" ref="toastFour"/>
                        </div>
                    </div>
                    <div class="listCellContent">
                        <div class="content_left">
                            <image class="redStar" src="https://image.aftdc.com/appBimg/redStar.png"></image>
                            <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">注册地址</text>
                        </div>
                        <div class="content_right">
                            <input class="input" :style="GLOBAL.inputText" type="text" v-model="businessImg.registerAddress"
                                   placeholder="证件上对应地址" ref="toastFive"/>
                        </div>
                    </div>
                    <div class="listCellContent">
                        <div class="content_left">
                            <image class="redStar" src="https://image.aftdc.com/appBimg/redStar.png"></image>
                            <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">法定代表人</text>
                        </div>
                        <div class="content_right">
                            <input class="input" :style="GLOBAL.inputText" type="text" v-model="businessImg.name" placeholder="证件上的营业者" ref="toastSix"/>
                        </div>
                    </div>
                    <div class="listCellContent">
                        <div class="content_left">
                            <image class="redStar" src="https://image.aftdc.com/appBimg/redStar.png"></image>
                            <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">有效期</text>
                        </div>
                        <div class="effective_big">
                            <div class="effective_big_left" @click="businessImg.data=0">
                                <image v-if="businessImg.data==0" class="contctSize contctMargin"
                                       src="https://image.aftdc.com/appBimg/radio_check.png"></image>
                                <image v-if="businessImg.data==1" class="contctSize contctMargin"
                                       src="https://image.aftdc.com/appBimg/radio.png"></image>
                                <text class="contctMargin" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">长期有效</text>
                            </div>
                            <div class="effective_big_right" @click="businessImg.data=1">
                                <image v-if="businessImg.data==1" class="contctSize contctMargin"
                                       src="https://image.aftdc.com/appBimg/radio_check.png"></image>
                                <image v-if="businessImg.data==0" class="contctSize contctMargin"
                                       src="https://image.aftdc.com/appBimg/radio.png"></image>
                                <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">固定日期</text>
                            </div>
                        </div>
                    </div>
                    <div class="listCellContent" v-if="businessImg.data==1">
                        <text class="padding_left" :style="{fontSize:GLOBAL.bigFS,color:businessImg.startTime=='开始时间'?'#999':GLOBAL.dColor}" @click="chooseTime(0,1)">{{businessImg.startTime}}</text>
                        <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">-</text>
                        <text class="padding_right" :style="{fontSize:GLOBAL.bigFS,color:businessImg.endTime=='结束时间'?'#999':GLOBAL.dColor}" @click="chooseTime(0,0)">{{businessImg.endTime}}</text>
                    </div>
                </div>
            </div>

            <div>
                <div class="listCellTitle">
                    <text :style="{fontSize:GLOBAL.biggerFS,color:'#999'}">行业资质</text>
                    <text :style="{fontSize:GLOBAL.biggerFS,color:'#999'}"></text>
                </div>
            </div>
            <div>
                <div class="listCell">
                    <div class="listCellContent">
                        <div class="content_left">
                            <image class="redStar" src="https://image.aftdc.com/appBimg/redStar.png"></image>
                            <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">证件类型</text>
                        </div>
                        <div class="content_right" @click="pickRestaurant">
                            <text class=" restaurantValueSize" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{restaurantValue}}</text>
                            <image class="moreImg"
                                   src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
                        </div>
                    </div>
                    <div class="listCellContent" v-for="(item,index) in titleList3" :key="index">
                        <div class="content_left">
                            <image class="redStar" src="https://image.aftdc.com/appBimg/redStar.png"></image>
                            <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.title}}</text>
                        </div>
                        <div class="content_right">
                            <image class="choiceImg" @click="openBottomPopup(5)"
                                   resize="cover" :src="img[5].localPart!=''?img[5].localPart:'https://image.aftdc.com/appBimg/icon_add_image.png'"></image>
                            <div class="imgExplain">
                                <text class="explainSize" :style="{fontSize:GLOBAL.bigFS,color:'#999'}">请注意证件照片上的文字能够清晰可见</text>
                                <text class="exampleSize" :style="{fontSize:GLOBAL.bigFS,color:'#53beb7'}" @click="exampleImgClick3(5)">查看示例图片</text>
                            </div>
                        </div>
                    </div>
                    <div class="listCellContent">
                        <div class="content_left">
                            <image class="redStar" src="https://image.aftdc.com/appBimg/redStar.png"></image>
                            <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">单位名称</text>
                        </div>
                        <div class="content_right">

                            <input class="input" :style="GLOBAL.inputText" type="text" v-model="permitImg.unitName" placeholder="证件上的单位名称" ref="toastSeven"/>
                        </div>
                    </div>
                    <div class="listCellContent">
                        <div class="content_left">
                            <image class="redStar" src="https://image.aftdc.com/appBimg/redStar.png"></image>
                            <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">许可证编号</text>
                        </div>
                        <div class="content_right">
                            <input class="input" :style="GLOBAL.inputText" type="text" v-model="permitImg.registerNum" placeholder="证件对应编号" ref="toastEight"/>
                        </div>
                    </div>
                    <div class="listCellContent">
                        <div class="content_left">
                            <image class="redStar" src="https://image.aftdc.com/appBimg/redStar.png"></image>
                            <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">许可证地址</text>
                        </div>
                        <div class="content_right">
                            <input class="input" :style="GLOBAL.inputText" type="text" v-model="permitImg.registerAddress" placeholder="证件上对应地址" ref="toastNight"/>
                        </div>
                    </div>
                    <div class="listCellContent">
                        <div class="content_left">
                            <image class="redStar" src="https://image.aftdc.com/appBimg/redStar.png"></image>
                            <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">法定代表人</text>
                        </div>
                        <div class="content_right">
                            <input class="input" :style="GLOBAL.inputText" type="text" v-model="permitImg.name" placeholder="证件上对应的法定代表人" ref="toastTen"/>
                        </div>
                    </div>
                    <div class="listCellContent">
                        <div class="content_left">
                            <image class="redStar" src="https://image.aftdc.com/appBimg/redStar.png"></image>
                            <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">法定代表人</text>
                        </div>
                        <div class="effective_big">
                            <div class="effective_big_left" @click="permitImg.data=0">
                                <image v-if="permitImg.data==0" class="contctSize contctMargin"
                                       src="https://image.aftdc.com/appBimg/radio_check.png"></image>
                                <image v-if="permitImg.data==1" class="contctSize contctMargin"
                                       src="https://image.aftdc.com/appBimg/radio.png"></image>
                                <text class="contctMargin" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">长期有效</text>
                            </div>
                            <div class="effective_big_right" @click="permitImg.data=1">
                                <image v-if="permitImg.data==1" class="contctSize contctMargin"
                                       src="https://image.aftdc.com/appBimg/radio_check.png"></image>
                                <image v-if="permitImg.data==0" class="contctSize contctMargin"
                                       src="https://image.aftdc.com/appBimg/radio.png"></image>
                                <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">固定日期</text>
                            </div>
                        </div>

                    </div>
                    <div class="listCellContent" v-if="permitImg.data==1">
                        <text class="padding_left" :style="{fontSize:GLOBAL.bigFS,color:permitImg.startTime=='开始时间'?'#999':GLOBAL.dColor}" @click="chooseTime(1,1)">{{permitImg.startTime}}</text>
                        <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">-</text>
                        <text class="padding_right" :style="{fontSize:GLOBAL.bigFS,color:permitImg.endTime=='结束时间'?'#999':GLOBAL.dColor}" @click="chooseTime(1,0)">{{permitImg.endTime}}</text>
                    </div>
                </div>
            </div>

            <div v-if="shopType==1">
                <div class="listCellTitle">
                    <text :style="{fontSize:GLOBAL.biggerFS,color:'#999'}">连锁店附加资质</text>
                    <text :style="{fontSize:GLOBAL.biggerFS,color:'#999'}"></text>
                </div>
            </div>
            <div v-if="shopType==1">
                <div class="listCell">
                    <div class="listCellContent">
                        <div class="content_left">
                            <image class="redStar" src="https://image.aftdc.com/appBimg/redStar.png"></image>
                            <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">证件类型</text>
                        </div>
                        <!--<div class="content_right" @click="pickLicense">-->
                        <!--<text class="defaultSize">{{licenseValue}}</text>-->
                        <div class="content_right">
                            <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">营业执照</text>
                            <!--<image class="moreImg"-->
                            <!--src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>-->
                        </div>
                    </div>
                    <div class="listCellContent"  :key="index">
                        <div class="content_left">
                            <image class="redStar" src="https://image.aftdc.com/appBimg/redStar.png"></image>
                            <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">营业执照1</text>
                        </div>
                        <div class="content_right">
                            <image class="choiceImg" resize="cover" :src="img[6].localPart!=''?img[6].localPart:'https://image.aftdc.com/appBimg/icon_add_image.png'"
                                   @click="openBottomPopup(6)"></image>
                            <div class="imgExplain">
                                <text class="explainSize" :style="{fontSize:GLOBAL.bigFS,color:'#999'}">请注意证件照片上的文字能够清晰可见</text>
                                <text class="exampleSize" :style="{fontSize:GLOBAL.bigFS,color:'#53beb7'}" @click="exampleImgClick(6)">查看示例图片</text>
                            </div>
                        </div>
                    </div>
                    <div class="listCellContent"  :key="index">
                        <div class="content_left">
                            <image class="redStar" src="https://image.aftdc.com/appBimg/redStar.png"></image>
                            <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">营业执照2</text>
                        </div>
                        <div class="content_right">
                            <image class="choiceImg" resize="cover" :src="img[7].localPart!=''?img[7].localPart:'https://image.aftdc.com/appBimg/icon_add_image.png'"
                                   @click="openBottomPopup(7)"></image>
                            <div class="imgExplain">
                                <text class="explainSize" :style="{fontSize:GLOBAL.bigFS,color:'#999'}">请注意证件照片上的文字能够清晰可见</text>
                                <text class="exampleSize" :style="{fontSize:GLOBAL.bigFS,color:'#53beb7'}" @click="exampleImgClick(7)">查看示例图片</text>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div>
                <div class="messageButton">
                    <wxc-button class="nextButton" text="下一步" :textStyle="GLOBAL.buttonText" :btnStyle="GLOBAL.defaultButton"
                                @wxcButtonClicked="toAgreeEnter()"></wxc-button>
                </div>
            </div>
        </scroller>
        <!--<div class="enterNext">-->
        <!--<text class="enterNext-button">下一步</text>-->
        <!--</div>-->
        <toast ref="toast"></toast>
        <!--弹出层-->
        <wxc-mask height="800"
                  width="650"
                  border-radius="15"
                  duration="200"
                  mask-bg-color="#FFFFFF"
                  :has-animation="hasAnimation"
                  :has-overlay="true"
                  :show-close="true"
                  :show="show"
                  @wxcMaskSetHidden="wxcMaskSetHidden">
            <div class="content">
                <image class="exampleImg" :src="'https://image.aftdc.com/'+exampleImg[exampleImgIndex].img"></image>
                <text class="exampleTextTitle" :style="{fontSize:GLOBAL.biggestFS,color:GLOBAL.dColor}">{{exampleImg[exampleImgIndex].title}}</text>
                <text class="exampleText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{exampleImg[exampleImgIndex].content}}</text>
            </div>
        </wxc-mask>

        <wxc-popup ref="wxcPopup"
                   popup-color="rgb(255, 255, 255)"
                   :show="isBottomShow"
                   @wxcPopupOverlayClicked="popupOverlayBottomClick"
                   pos="bottom"
                   height="820">

            <div class="demo-content">
                <div class="demo-contentTitle">
                    <text></text>
                    <text class="center" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">{{exampleImgB[exampleImgIndex].title}}</text>
                    <image class="closeImg" src="https://image.aftdc.com/appBimg/icon_close.png"
                           @click="isbuttomshow"></image>
                </div>
                <div class="demo-contentMain">
                    <image class="exampleImg"
                           :src="'https://image.aftdc.com/'+exampleImgB[exampleImgIndex].img"></image>
                    <div class="demo-contentMain-a">
                        <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">示例图</text>
                        <text class="demoSmallSize" :style="{fontSize:GLOBAL.defaultFS,color:'#ccc'}">证件照片上的文字能够清晰可见</text>
                    </div>
                    <div class="demo-contentMain-button">
                        <text class="demo-contentMain-button-text" style="text-align: center" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}" @click="chooseImg">上传照片</text>
                    </div>
                </div>
            </div>
        </wxc-popup>
        <examineBank ref="examineBank"></examineBank>
        <!--弹出层-->
    </div>
</template>

<script>
    const picker = weex.requireModule('picker');
    import ExamineBank from './examineBank.vue';
    import toast from './Toast.vue';
    import {WxcMinibar, WxcButton, WxcIcon, WxcMask, WxcPopup} from 'weex-ui';

    const event = weex.requireModule('event');
    const post = weex.requireModule('stream');
    const modal = weex.requireModule('modal');
    export default {
        components: {WxcMinibar, WxcButton, WxcIcon, WxcMask, WxcPopup, ExamineBank,toast},
        data() {
            return {
                touch:false,//判断是否按照屏幕
                idCard: {name: '', number: ''},//身份证图片上传后的数据
                bank: {name: '', number: ''},//银行卡图片上传后的数据
                businessImg: {
                    unitName: '',
                    registerNum: '',
                    registerAddress: '',
                    name: '',
                    data: 1,
                    startTime: '开始时间',
                    endTime: '结束时间'
                },//data用于判断单选框，0为固长期有效，1为固定日期 //营业执照图片上传后的数据
                permitImg: {
                    unitName: '',
                    registerNum: '',
                    registerAddress: '',
                    name: '',
                    data: 1,
                    startTime: '开始时间',
                    endTime: '结束时间'
                },//data用于判断单选框，0为固长期有效，1为固定日期 //许可证图片上传后的数据
                term: false,
                sized: 'sized',
                bankIndex:-1,
                bankValue:'请选择',
                checkBankNumber:0,//检查银行卡号后返回的提示
                idCardIndex: 0,
                idCardValue: '身份证',
                licenseIndex: 0,
                licenseValue: '营业执照',
                restaurantIndex: 0,
                restaurantValue: '餐饮服务许可证',
                titleList: [{title: '正面照', describe: '请注意证件照片上的文字能够清晰可见',},
                    {title: '反面照', describe: '请注意证件照片上的文字能够清晰可见',},
                    {title: '手持正面照', describe: '请注意证件照片上的文字能够清晰可见',},
                    {title: '银行卡', describe: '请注意银行卡照片上的文字能够清晰可见',}
                ],
                titleList2: [{title: '证件照片'},],
                titleList3: [{title: '证件照片'},],
                iconStyle: {
                    color: "#666",
                    fontSize: '35px'
                },
                nextBtnStyle: {
                    backgroundColor: '#53beb7',
                    width: '600',
                    borderColor: '#428a85',
                    borderWidth: '1px',
                    borderStyle: 'solid'
                },
                nextStyle: {
                    color: '#fff'
                },
                show: false,
                hasAnimation: true,
                exampleImg: [
                    {
                        img: 'images/packageA/papers1.jpg',
                        title: '正面照示例图',
                        content: '证件照片上的文字需要能够清晰可见'
                    },
                    {
                        img: 'images/packageA/papers2.jpg',
                        title: '反面照示例图',
                        content: '证件照片上的文字需要能够清晰可见'
                    },
                    {
                        img: 'images/packageA/papers3.jpg',
                        title: '手持正面照示例图',
                        content: '证件照片上的文字需要能够清晰可见'
                    },
                    {
                        img: 'images/packageA/bank.jpg',
                        title: '银行卡示例图',
                        content: '银行卡照片上的文字能够清晰可见'
                    },
                    {
                        img: 'images/packageA/setTyps.jpg',
                        title: '证件照片示例图',
                        content: '证件照片上的文字需要能够清晰可见'
                    },
                    {
                        img: 'images/packageA/setAllow.jpg',
                        title: '证件照片示例图',
                        content: '证件照片上的文字需要能够清晰可见'
                    },
                    {
                        img: 'images/packageA/setTyps.jpg',
                        title: '证件照片示例图',
                        content: '证件照片上的文字需要能够清晰可见'
                    },
                    {
                        img: 'images/packageA/setTyps.jpg',
                        title: '证件照片示例图',
                        content: '证件照片上的文字需要能够清晰可见'
                    },
                ],
                exampleImgB: [
                    {
                        title: '上传正面照',
                        img: 'images/packageA/papers1.jpg',
                    },
                    {
                        title: '上传反面照',
                        img: 'images/packageA/papers2.jpg',
                    },
                    {
                        title: '上传手持正面照',
                        img: 'images/packageA/papers3.jpg',
                    },
                    {
                        title: '上传银行卡',
                        img: 'images/packageA/bank.jpg',
                    },
                    {
                        title: '上传证件照片',
                        img: 'images/packageA/setTyps.jpg',
                    },
                    {
                        title: '上传证件照片',
                        img: 'images/packageA/setAllow.jpg',
                    },
                    {
                        title: '上传证件照片',
                        img: 'images/packageA/setTyps.jpg',
                    },
                    {
                        title: '上传证件照片',
                        img: 'images/packageA/setTyps.jpg',
                    },
                ],
                itemsBank:[],//接口返回的银行
                itemsIDCard: ['身份证', '港澳居民内地居住证', '台胞证', '护照'],
                itemsLicense: ['营业执照', '灵活就业(营业)辅导证/意见', '事业单位法人证书', '民办非企业单位登记证书', '社会团体法人登记证书'],
                itemsRestaurant: ['餐饮服务许可证', '食品经营许可证', '食品流通许可证', '食品摊贩临时经营公示卡', '全国工业产品生产许可证', '小徽餐饮分级证/登记凭证', '食品生产加工作坊准许证', '食品小作坊生产许可证',
                    '食品小作坊登记证', '食品小作坊核准证', '小作坊、小餐饮登记证|小摊点备案凭证', '食品摊贩备案证明', '小作坊卫生许可证', '食品摊贩登记卡', '食品经营实名备案证', '小餐饮经营许可证'],

                exampleImgIndex: 0,
                overlayCanClose: true,
                isFalse: false,
                isBottomShow: false,
                height: 400,
                timeIndex: 0,//1为开始时间，0为结束时间 的下标
                choiceMain: 0,//0为营业执照类的时间，1为许可证类的时间
                pageBack:false,
                img:[{
                    img:'',localPart:''
                },{
                    img:'',localPart:''
                },{
                    img:'',localPart:''
                },{
                    img:'',localPart:''
                },{
                    img:'',localPart:''
                },{
                    img:'',localPart:''
                }],
                phone:'',
                token:'',
                shopType:'',//店铺类型 2为单店 1为连锁店
            }
        },
        created() {

            this.phone = JSON.parse(weex.config.param).phone;
            this.token = JSON.parse(weex.config.param).token;
            this.shopType = JSON.parse(weex.config.param).shopType;
            if(this.shopType==1){
                for(var i=0;i<2;i++) {
                    this.img.push({img: '', localPart: ''})
                }
            }
            var param = 'phone='+this.phone+'&token='+this.token;
            var that = this
            post.fetch({
                method: 'post',
                type: 'json',
                body: param,
                url: 'https://www.aftdc.com/businessapp/Enter/getBank',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
            }, function (res) {
                if (res.data.res == 1) {
                    that.bankList = res.data.data;
                    // that.bankIndex=4
                    for(let i in that.bankList){
                        that.itemsBank.push(that.bankList[i].bankName)
                    }
                }
            });

            //获取缓存
            var img = event.find('enter_img_'+this.phone);
            if (img) {
                this.img = JSON.parse(img);
                this.businessImg = JSON.parse(event.find('enter_businessImg_'+this.phone)) ;
                this.permitImg = JSON.parse(event.find('enter_permitImg_'+this.phone));
                this.idCard = JSON.parse(event.find('enter_idCard_'+this.phone));
                this.bank = JSON.parse(event.find('enter_bank_'+this.phone));
                this.bankIndex = Number(event.find('enter_bankIndex_'+this.phone));
                this.restaurantIndex=Number(event.find('enter_restaurantIndex_'+this.phone));
                this.restaurantValue = event.find('enter_restaurantValue_'+this.phone);
                this.idCardValue = event.find('enter_idCardValue_'+this.phone);
                this.bankValue = event.find('enter_bankValue_'+this.phone);

                this.checkBankNumber = 1
            }

            event.init();
            weex.requireModule('globalEvent').addEventListener('chooseTime', function (e) {
                if (that.choiceMain == 0) {
                    if (that.timeIndex == 1) {
                        that.$set(that.businessImg, 'startTime', e.time)
                    } else {
                        that.$set(that.businessImg, 'endTime', e.time)
                    }
                } else {
                    if (that.timeIndex == 1) {
                        that.$set(that.permitImg, 'startTime', e.time)
                    } else {
                        that.$set(that.permitImg, 'endTime', e.time)
                    }
                }
            })
        },
        mounted: function() {
            // var that=this
            // setTimeout(function () {
            //     that.$refs.bankNumber.setTextFormatter({
            //         formatRule: "/(\\d{4})(?!$)/g",
            //         formatReplace: "$1 ",
            //         recoverRule: "/\\s+/g",
            //         recoverReplace: ""
            //     })
            // },0)
        },
        methods: {
            touchmove(){
                this.touch=true;
            },
            touchend(){
                this.touch=false;
            },
            scrollMove(){
                if(this.touch){
                    this.blur();
                }
            },
            blur(){
                // for(var i=0;i<10;i++){
                //     this.$refs.toastOne[i].blur();
                // }
                this.$refs.toastOne.blur();
                this.$refs.toastTwo.blur();
                this.$refs.toastThree.blur();
                this.$refs.toastFour.blur();
                this.$refs.toastFive.blur();
                this.$refs.toastSix.blur();
                this.$refs.toastSeven.blur();
                this.$refs.toastEight.blur();
                this.$refs.toastNight.blur();
                this.$refs.toastTen.blur();
            },
            // input失去焦点


            chooseTime(choiceMain, timeIndex) {
                var that = this
                that.choiceMain = choiceMain
                that.timeIndex = timeIndex;
                event.chooseTime(true, true, true, false, false, false)

            },
            chooseImg(){
                if (this.exampleImgIndex === 2){
                    event.chooseImg(5,8)
                }else if(this.exampleImgIndex ===5){
                    event.chooseImg(0,0)
                }else if(this.exampleImgIndex <=3){
                    event.chooseImg(8,5)
                }else{
                    event.chooseImg(5,7)
                }
                this.$refs.wxcPopup.hide();
            },
            bankInput(event) {
                var that = this
                var number = event.value
                number = number.toString()
                if (number.length >= 19) {
                    number=number.replace(/ /g,'')
                    var bankDetail = that.$refs.examineBank.getbankNameAndCardNo(that.bankValue,number)
                    if (bankDetail == 'error') {
                        that.checkBankNumber=-1
                    } else {
                        that.checkBankNumber=1
                    }
                } else if (number.length == 0) {
                    that.checkBankNumber=0
                } else {
                    that.checkBankNumber=-1;//等于-1时提示输入正确银行卡号
                }
            },
            isbuttomshow() {
                this.$refs.wxcPopup.hide();
            },
            openBottomPopup(index) {
                var that=this;
                this.blur();
                this.exampleImgIndex = index;
                setTimeout(function () {
                    that.isBottomShow = true;
                },100)
            },
            //非状态组件，需要在这里关闭
            popupOverlayBottomClick() {
                this.isBottomShow = false;
            },
            pickIDCard() {
                picker.pick({
                    index: this.idCardIndex,
                    items: this.itemsIDCard,
                    confirmTitle: '确认',
                    cancelTitle: '取消',
                    confirmTitleColor: '#53beb7',
                    cancelTitleColor: '#999',

                }, event => {
                    if (event.result === 'success') {

                        this.idCardValue = this.itemsIDCard[event.data]
                        this.idCardIndex = event.data
                    }
                })
            },
            pickBank(){
                var that=this
                picker.pick({
                    index: this.bankIndex,
                    items: this.itemsBank,
                    confirmTitle: '确认',
                    cancelTitle: '取消',
                    confirmTitleColor: '#53beb7',
                    cancelTitleColor: '#999',
                }, event => {
                    if (event.result === 'success') {
                        this.bankValue = this.itemsBank[event.data]
                        this.bankIndex = event.data
                        setTimeout(function () {
                            that.$refs.bankNumber.setTextFormatter({
                                formatRule: "/(\\d{4})(?!$)/g",
                                formatReplace: "$1 ",
                                recoverRule: "/\\s+/g",
                                recoverReplace: ""
                            })
                        },0)
                    }
                })
            },
            pickLicense() {
                picker.pick({
                    index: this.licenseIndex,
                    items: this.itemsLicense,
                    confirmTitle: '确认',
                    cancelTitle: '取消',
                    confirmTitleColor: '#53beb7',
                    cancelTitleColor: '#999',
                }, event => {
                    if (event.result === 'success') {
                        this.licenseValue = this.itemsLicense[event.data]
                        this.licenseIndex = event.data
                    }
                })
            },
            pickRestaurant() {
                picker.pick({
                    index: this.restaurantIndex,
                    items: this.itemsRestaurant,
                    confirmTitle: '确认',
                    cancelTitle: '取消',
                    confirmTitleColor: '#53beb7',
                    cancelTitleColor: '#999',
                }, event => {
                    if (event.result === 'success') {
                        this.restaurantValue = this.itemsRestaurant[event.data]
                        this.restaurantIndex = event.data
                    }
                })
            },
            minibarLeftButtonClick() {

            },

            wxcMaskSetHidden() {
                var that = this;
                that.show = false
            },

            exampleImgClick2() {
                this.blur();
                var that = this;
                that.exampleImgIndex = 4;
                that.show = true;
            },
            exampleImgClick3(index) {
                this.blur();
                var that = this;
                that.exampleImgIndex = index;
                that.show = true;
            },
            openMask(e) {
                this.show = true;
                this.hasAnimation = true;
            },
            wxcMaskSetHidden() {
                this.show = false;
            },
            openNoAnimationMask(e) {
                this.show = true;
                this.hasAnimation = false;
            },

            exampleImgClick(index) {
                this.blur();
                var that = this;
                that.exampleImgIndex = index;
                that.show = true;
            },
            toAgreeEnter() {
                const toast=this.$refs.toast;

                if(!this.idCard.name||!this.idCard.number||!this.bank.number||this.bankValue == '请选择'||this.checkBankNumber==-1||!this.businessImg.name||!this.businessImg.unitName||!this.businessImg.registerAddress||!this.businessImg.registerNum||!this.permitImg.name||!this.permitImg.unitName||!this.permitImg.registerAddress||!this.permitImg.registerNum){
                    toast.editContent('未填写完整');
                    return false;
                }
                for (var i=0; i<this.img.length; i++){
                    if (this.img[i].img == ''){
                        toast.editContent('图片未上传完整');
                        return false;
                    }
                }
                var param = 'token='+this.token+'&phone='+this.phone
                param += '&idCardValue='+this.idCardValue+'&bankUserName='+this.idCard.name+'&IdentityNo='+this.idCard.number+'&bankNo='+this.bank.number+
                    '&bankName='+this.bankValue+'&bankId='+this.bankList[this.bankIndex].id+'&businessLicense='+JSON.stringify(this.businessImg)+
                    '&otherLicense='+JSON.stringify(this.permitImg)+'&otherLicenseName='+this.restaurantValue+'&img='+JSON.stringify(this.img);

                console.log(param);
                event.save('enter_img_'+this.phone,JSON.stringify(this.img));//缓存
                event.save('enter_businessImg_'+this.phone,JSON.stringify(this.businessImg));//缓存
                event.save('enter_permitImg_'+this.phone,JSON.stringify(this.permitImg));//缓存
                event.save('enter_idCard_'+this.phone,JSON.stringify(this.idCard));//缓存
                event.save('enter_bank_'+this.phone,JSON.stringify(this.bank));//缓存
                event.save('enter_bankIndex_'+this.phone,this.bankIndex);//缓存
                event.save('enter_restaurantIndex_'+this.phone,this.restaurantIndex);//缓存
                event.save('enter_restaurantValue_'+this.phone,this.restaurantValue);//缓存
                event.save('enter_idCardValue_'+this.phone,this.idCardValue);//缓存
                event.save('enter_bankValue_'+this.phone,this.bankValue);//缓存

                var that = this;
                post.fetch({
                    method: 'post',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/businessapp/Enter/enter_secondStep',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                }, function (res) {
                    if (res.data.res == 1) {
                        var param = {
                            phone:that.phone,
                            token:that.token
                        };
                        var url='http://assets/agreeEnter.js';
                        event.toUrl({"url":url,"param":JSON.stringify(param)})
                    }else{
                        toast.editContent(res.data.info);
                    }
                });
            },

            //监听页面返回
            viewdisappear() {
                this.pageBack = true;
            },
            viewappear() {
                if (!this.pageBack) { return; }
                this.pageBack = false;
                if (event.find("localImg")) {//图片
                    var index = this.exampleImgIndex;
                    var localPart = event.find("localImg");
                    var img = 'enter/'+Date.parse(new Date())+'0'+Math.round(Math.random()*1000000)+'.jpg';
                    this.img[index].localPart = localPart;
                    this.img[index].img = img;
                    this.uploadImg(img,localPart);
                    event.delete("localImg");
                }
            },
            //上传图片
            uploadImg(articleImg,localPart){
                var that = this;
                var param = 'phone=' + this.phone + '&token=' + this.token;
                post.fetch({
                    method: 'post',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/businessapp/Enter/uploadOss',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                },function(res){
                    var waterMarkStr = '';
                    event.uploadImg(res.data.AccessKeyId,res.data.AccessKeySecret,res.data.SecurityToken,articleImg,localPart,waterMarkStr);
                })
            },
        }
    }
</script>

<style scoped>


    .minibar {
        /*border-bottom-width: 2px;*/
        /*border-bottom-style: solid;*/
        /*border-bottom-color: #f1f1f1;*/
    }

    .backImg {
        width: 40px;
        height: 40px;
    }

    .padding_right {
        padding-right: 100px;
    }

    .padding_left {
        padding-left: 100px;
    }



    .contctMargin {
        margin-right: 10px;
    }

    .contctSize {
        width: 50px;
        height: 50px;
        margin-bottom: 5px;
    }

    .demo-contentTitle {
        flex-direction: row;
        justify-content: space-between;
        padding-top: 25px;
        padding-bottom: 25px;
        padding-left: 50px;
        padding-right: 50px;
        border-bottom-style: solid;
        border-bottom-width: 1px;
        border-bottom-color: #ccc;
        align-items: center;
    }

    .demoSize {
        text-align: center;
    }

    .center {
        text-align: center;
    }

    .right {
        text-align: right;
    }

    .demo-contentMain {
        padding-top: 15px;
        padding-left: 50px;
        padding-right: 50px;
        justify-content: center;
    }

    .demo-contentMain-a {
        align-items: center;
        flex-direction: row;
        padding-top: 50px;
        padding-bottom: 50px;
    }

    .demoSmallSize {
        padding-left: 20px;
    }

    .demo-contentMain-button {
        padding-left: 60px;
        padding-right: 60px;
    }

    .demo-contentMain-button-text:active {
        background-color: #f1f1f1;
    }

    .demo-contentMain-button-text {
        border-width: 2px;
        border-style: solid;
        border-color: #999;
        border-radius: 45px;
        padding-top: 25px;
        padding-bottom: 25px;
    }

    .effective_big {
        flex: 2.4;
        flex-direction: row;
        align-items: center;
    }

    .effective_big_right {
        flex-direction: row;
        align-items: center;
    }

    .effective_big_left {
        flex-direction: row;
        align-items: center;
    }

    .exampleImg {
        width: 650px;
        height: 450px;
        border-radius: 15px;
    }

    .wrapper {
        flex-direction: column;
        background-color: #f8f8f8;
    }

    .listCellTitle {
        padding-top: 20px;
        padding-bottom: 20px;
        padding-left: 30px;
        padding-right: 30px;
        justify-content: space-between;
        flex-direction: row;
    }

    .exampleTextTitle {
        margin-top: 60px;
        text-align: center;
        font-weight: 500;

        font-weight: bold;
    }

    .exampleText {
        margin-top: 40px;
        margin-left: 25px;
        margin-right: 25px;
        line-height: 50px;

    }

    .listCell {
        flex-direction: column;
        background-color: #fff;

    }

    .listCellContent {
        padding-top: 30px;
        padding-bottom: 30px;
        margin-left: 30px;
        margin-right: 30px;
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #f1f1f1;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }

    .content_left {
        flex: 1;
        flex-direction: row;
        align-items: center;
    }

    .redStar {
        width: 12px;
        height: 12px;
        margin-right: 10px;
    }

    .content_right {
        flex: 2.4;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    .input {
        align-items: center;
        placeholder-color: #999;
        flex: 1;
    }

    .choiceImg {
        width: 175px;
        height: 175px;
    }

    .imgExplain {
        flex-direction: column;
        justify-content: center;
        margin-left: 20px;
    }

    .explainSize {
        width: 290px;
        margin-bottom: 15px;
    }

    .exampleSize {
        margin-top: 15px;
    }

    .moreImg {
        width: 20px;
        height: 20px;
    }

    .enterNext {
        background-color: #f8f8f8;
        padding-top: 10px;
        padding-bottom: 10px;
        padding-left: 150px;
        padding-right: 150px;
    }

    .enterNext-button {
        border-radius: 40px;
        padding-top: 20px;
        padding-bottom: 20px;
        text-align: center;
        background-color: #57aba5;
        color: #fff;
        font-size: 35px;
    }

    .messageButton {
        flex-direction: row;
        justify-content: space-around;
        width: 750px;
        background-color: #fff;
        padding-top: 20px;
        padding-bottom: 20px;
        padding-left: 30px;
        padding-right: 30px;
    }

    .scroller {
        position: absolute;
        top: 93px;
        left: 0;
        right: 0;
        bottom: 0;
    }

    .restaurantValueSize {
        width: 450px;
    }



    .closeImg {
        width: 25px;
        height: 25px;
        align-items: center;
    }

    .nextButton:active{
        background-color: #57aba5;
    }
    .nextButton:enabled{
        background-color: #53BEB7;
    }
    .bankNumberTips{

    }

</style>
