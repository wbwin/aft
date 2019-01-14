<template>
  <div class="wrapper">
      <div class="minibar">
          <wxc-minibar
                  background-color="#53beb7"
                  text-color="#fff"
                  @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                  v-once
          >
              <image :style="GLOBAL.headerImg"  slot="left"
                     src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
              <text :style="GLOBAL.headerCenter"  slot="middle">合伙人信息</text>
              <!--<text :style="GLOBAL.headerRight"  slot="right">帮助</text>-->
          </wxc-minibar>
      </div>
    <list class="scroller">

      <cell>
        <div class="listCell">
            <div class="listCellTitle">
                <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">公司信息</text>
            </div>
          <div class="listCellContent">
            <div class="content_left">
              <image class="redStar" src="https://image.aftdc.com/appBimg/redStar.png"></image>
              <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">营业执照</text>
            </div>
            <div class="content_right">
              <image class="choiceImg" src="https://image.aftdc.com/appBimg/icon_add_image.png"></image>
              <div class="imgExplain">
                <text class="explainSize" :style="{fontSize:GLOBAL.bigFS,color:'#999'}">请注意证件照片上的文字能够清晰可见</text>
                <text class="exampleSize" :style="{fontSize:GLOBAL.bigFS,color:'#53beb7'}" @click="exampleImgClick(0)">查看示例图片</text>
              </div>
            </div>
          </div>
          <div class="listCellContent">
            <div class="content_left">
              <image class="redStar" src="https://image.aftdc.com/appBimg/redStar.png"></image>
              <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">公司名称</text>
            </div>
            <div class="content_right">
                <input class="input" :style="GLOBAL.inputText" type="text" v-model="companyName" placeholder="您的公司名称"/>
            </div>
          </div>
          <div class="listCellContent">
            <div class="content_left">
              <image class="redStar" src="https://image.aftdc.com/appBimg/redStar.png"></image>
              <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">公司地址</text>
            </div>
            <div class="content_right">
                <input class="input" :style="GLOBAL.inputText" type="text" v-model="companyaddress" placeholder="您的公司地址"/>
            </div>
          </div>
          <div class="listCellContent">
            <div class="content_left ">
              <image class="redStar" src="https://image.aftdc.com/appBimg/redStar.png"></image>
              <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">成立时间</text>
            </div>
              <div class="content_right_spacial ">
                  <text class="textAlign" :style="{fontSize:GLOBAL.bigFS,color:startTime!=''?GLOBAL.dColor:'#999'}"  @click="chooseTime(1)">{{startTime!=''?startTime:'开始时间'}}</text>
                  <text  :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">—</text>
                  <text class="textAlign" :style="{fontSize:GLOBAL.bigFS,color:endTime!=''?GLOBAL.dColor:'#999'}"  @click="chooseTime(2)">{{endTime!=''?endTime:'结束时间'}}</text>
              </div>
          </div>
          <div class="listCellContent">
            <div class="content_left">
                <image class="redStar" src="https://image.aftdc.com/appBimg/redStar.png"></image>
                <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">公司规模(人)</text>
            </div>
            <div class="content_right">
                <input class="input" :style="GLOBAL.inputText" type="number" placeholder="您所在公司的详细地址"  />
            </div>
          </div>
          <div class="listCellContent">
              <div class="content_left">
                  <image class="redStar" src="https://image.aftdc.com/appBimg/redStar.png"></image>
                  <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">可投入资金</text>
              </div>
              <div class="content_right">
                  <input class="input" :style="GLOBAL.inputText" type="number" placeholder="请输入您所需要投入的资金"  />
              </div>
          </div>
          <div class="listCellContent">
              <div class="content_left">
                  <image class="redStar" src="https://image.aftdc.com/appBimg/redStar.png"></image>
                  <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">公司主营业务</text>
              </div>
              <div class="content_right">
                  <input class="input" :style="GLOBAL.inputText" type="text" placeholder="请输入您所在公司的主营业务"  />
              </div>
          </div>

            <div class="listCellTitle">
                <text class="titleSize">个人信息</text>
            </div>
            <div class="listCellContent">
                <div class="content_left">
                    <image class="redStar" src="https://image.aftdc.com/appBimg/redStar.png"></image>
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">身份证</text>
                </div>
                <div class="content_right">
                    <image class="choiceImg" src="https://image.aftdc.com/appBimg/icon_add_image.png"></image>
                    <div class="imgExplain">
                        <text class="explainSize" :style="{fontSize:GLOBAL.bigFS,color:'#999'}">一张真实的身份证正面</text>
                        <text class="exampleSize" :style="{fontSize:GLOBAL.bigFS,color:'#53beb7'}" @click="exampleImgClick(1)">查看示例图片</text>
                    </div>
                </div>
            </div>
            <div class="listCellContent">
                <div class="content_left">
                    <image class="redStar" src="https://image.aftdc.com/appBimg/redStar.png"></image>
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">姓名</text>
                </div>
                <div class="content_right">
                    <input class="input" :style="GLOBAL.inputText" type="text" v-model="yourName" placeholder="您的名字"/>
                </div>
            </div>
            <div class="listCellContent">
                <div class="content_left">
                    <image class="redStar" src="https://image.aftdc.com/appBimg/redStar.png"></image>
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">电话号码</text>
                </div>
                <div class="content_right">
                    <input class="input" :style="GLOBAL.inputText" type="number" v-model="yourNumber" placeholder="您的电话号码"/>
                </div>
            </div>
            <div class="listCellContent">
                <div class="content_left">
                    <image class="redStar" src="https://image.aftdc.com/appBimg/redStar.png"></image>
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">身份证</text>
                </div>
                <div class="content_right">
                    <input class="input" :style="GLOBAL.inputText" type="number" v-model="yourIDCard" placeholder="您的身份证号码"/>
                </div>
            </div>
            <div class="listCellContent">
                <div class="content_left">
                    <image class="redStar" src="https://image.aftdc.com/appBimg/redStar.png"></image>
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">电子邮件</text>
                </div>
                <div class="content_right">
                    <input class="input" :style="GLOBAL.inputText" type="email" placeholder="输入您的电子邮件"  />
                </div>
            </div>
            <div class="listCellTitle">
                <text class="titleSize">代理信息</text>
            </div>
          <div class="listCellContent">
              <div class="content_left">
                  <image class="redStar" src="https://image.aftdc.com/appBimg/redStar.png"></image>
                  <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">代理城市</text>
              </div>
              <div class="content_right">
                  <text class="inputText" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">请选择</text>
                  <image class="inputIcon" src="https://image.aftdc.com/appBimg/icon_arrow_right_gray.png"></image>
              </div>
          </div>
          <div class="listCellContent">
              <div class="content_left">
                  <image class="redStar" src="https://image.aftdc.com/appBimg/redStar.png"></image>
                  <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor,flex:1}">代理城市餐饮规模</text>
              </div>
              <div class="content_right">
                  <input class="input" :style="GLOBAL.inputText" type="number" placeholder="单位(家)"  />
              </div>
          </div>
            <div class="listCellContent">
                <div class="content_left">
                    <image class="redStar" src="https://image.aftdc.com/appBimg/redStar.png"></image>
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor,flex:1}" @click="showToastA">是否有相关行业经验</text>
                </div>
                <div class="effective_big">
                    <div class="effective_big_left" @click="contctChange(0)">
                        <image class="contctSize contctMargin" :src="audio==0?'https://image.aftdc.com/appBimg/radio_check.png':'https://image.aftdc.com/appBimg/radio.png'"></image>
                        <text class="contctSize2 contctMargin">是</text>
                    </div>
                    <div class="effective_big_right" @click="contctChange(1)">
                        <image class="contctSize contctMargin" :src="audio==1?'https://image.aftdc.com/appBimg/radio_check.png':'https://image.aftdc.com/appBimg/radio.png'"></image>
                        <text class="contctSize2 ">否</text>
                    </div>
                </div>
            </div>
            <div class="listCellContent">
                <div class="content_left">
                    <image class="redStar" src="https://image.aftdc.com/appBimg/redStar.png"></image>
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor,flex:1}">是否了解当地餐饮市场</text>
                </div>
                <div class="effective_big">
                    <div class="effective_big_left" @click="contctChangeTwo(0)">
                        <image class="contctSize contctMargin" :src="audioTwo==0?'https://image.aftdc.com/appBimg/radio_check.png':'https://image.aftdc.com/appBimg/radio.png'"></image>
                        <text class="contctSize2 contctMargin">是</text>
                    </div>
                    <div class="effective_big_right" @click="contctChangeTwo(1)">
                        <image class="contctSize contctMargin" :src="audioTwo==1?'https://image.aftdc.com/appBimg/radio_check.png':'https://image.aftdc.com/appBimg/radio.png'"></image>
                        <text class="contctSize2 ">否</text>
                    </div>
                </div>
            </div>
            <div class="listCellContent">
                <div class="content_left">
                    <image class="redStar" src="https://image.aftdc.com/appBimg/redStar.png"></image>
                    <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor,flex:1}">相关市场资源</text>
                </div>
                <div class="content_right">
                    <input class="input" :style="GLOBAL.inputText" type="text" placeholder="请输入相关的市场资源" />
                </div>
            </div>

    </div>
      </cell>
    </list>
      <div class=" enterButton">

          <wxc-button class="nextButton"  text="提交" :textStyle="nextStyle" :btnStyle="nextBtnStyle"
                      @wxcButtonClicked="nextClick()"></wxc-button>
      </div>
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
          <text class="exampleText" :style="{fontSize:GLOBAL.bigFS,color:'#999'}">{{exampleImg[exampleImgIndex].content}}</text>
      </div>
  </wxc-mask>


  <!--弹出层-->
  </div>
</template>

<script>
    const modal = weex.requireModule('modal')
    const picker = weex.requireModule('picker')

    import {WxcMinibar, WxcButton, WxcIcon, WxcMask, WxcPopup} from 'weex-ui';

    export default {
        components: {WxcMinibar, WxcButton, WxcIcon, WxcMask, WxcPopup},
        data() {
            return {
                companyName:'',//公司名称
                companyaddress:'',//公司地址
                yourName:'',//姓名
                yourNumber:'',//电话号码
                yourIDCard:'',//身份证
                startTime:'',//开始时间
                endTime:'',//结束时间
                audio:0,
                audioTwo:0,
                term:false,
                sized:'sized',
                idCardIndex:0,
                idCardValue:'身份证',
                licenseIndex:0,
                licenseValue:'营业执照',
                restaurantIndex:0,
                restaurantValue:'餐饮服务许可证',
                titleList:[
                    {
                      title:'身份证',
                        describe:'一张真实的身份证正面',

                    },
                    {
                      title:'营业执照',
                        describe:'请注意证件照片上的文字能够清晰可见',

                    },
                ],
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
                        img: 'appBimg/ic_app_logo.jpg',
                        title: '营业执照示例图',
                        content: '证件照片上的文字需要能够清晰辨认'
                    },
                    {
                        img: 'appBimg/ic_app_logo.jpg',
                        title: '身份证示例图',
                        content: '证件照片上的文字需要能够清晰辨认'
                    },
                ],
                exampleImgIndex: 0,


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
                timeIndex:'',
            }
        },
        created(){
            var that=this
            event.init();
            weex.requireModule('globalEvent').addEventListener("chooseTime",function(e){
                if (that.timeIndex == 1){
                    that.startTime = e.time;
                } else{
                    that.endTime = e.time;
                }
            });
        },
        methods: {
            showToastA (event) {
                modal.toast({
                    message: '你个大傻逼',
                    duration: 0.7
                })
            },
            chooseTime(index){
                this.timeIndex = index
                event.chooseTime(false,false,false,true,true,false)
            },
            contctChange(index){
                this.audio=index;
            },
            contctChangeTwo(index){
                this.audioTwo=index;
            },
            wxcMaskSetHidden() {
                var that = this;
                that.show = false
            },
            exampleImgClick(index) {
                this.exampleImgIndex = index
                this.show = true
            },
            nextClick(){
                var that=this
                const toast=that.$refs.toast;
                if(!that.shopName||!that.shopPhone||!that.name||!that.address||!that.shopPlace||!that.provinceValue||!that.shopSaleClassfly||!that.shopHours){
                    toast.editContent('标有红色星星的是必填项哦!')
                    return false;
                }

            },
        },

    }
</script>

<style scoped>
    .wrapper {
        flex-direction: column;
        background-color: #f8f8f8;
    }
    .backImg {
        width: 40px;
        height: 40px;
    }
    .inputTextTwo{
        color: #333;
    }
    .inputText{
        padding-top: 10px;
        padding-bottom: 10px;
        flex: 1;
    }
    .scroller{
        margin-bottom: 128px;
    }
    .enterButton {
        flex-direction: row;
        justify-content: space-around;
        position: fixed;
        left: 0;
        bottom: 0;
        right: 0;
        background-color: #fff;
        border-top-width: 2px;
        border-top-style: solid;
        border-top-color: #f1f1f1;
        padding-top: 20px;
        padding-bottom: 20px;
    }
    .nextButton:active {
        background-color: #57aba5;
    }
    .titleSize {
        font-size: 30px;
        color: #999;
    }
    .listCellTitle {
        padding-top: 20px;
        padding-bottom: 20px;
        padding-left: 30px;
        padding-right: 30px;
        flex-direction: row;
        background-color: #f1f1f1;
    }
    .content{
        border-radius: 10px;
    }
    .content_right_spacial{
        flex: 2.4;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;

    }
    .dataFirst{
        flex: 1.5;
        font-size: 30px;
        color: #999;
    }
    .dataCenter{
        text-align: center;
        font-size: 32px;
    }
    .dataLast{
        flex: 1.5;
        font-size: 30px;
        text-align: right;
        color: #999;
        margin-right:120px;
    }
    .contctSize2{
        font-size: 28px;
    }
    .contctMargin{
        margin-right: 10px;
    }
    .contctSize{
        width: 60px;
        height: 60px;
    }
.effective_big{
    flex: 2.4;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}
    .effective_big_left{
        flex-direction: row;
        align-items: center;
        padding-right: 20px;
    }
.effective_big_right{
    padding-left: 20px;
    flex-direction: row;
    align-items: center;
}
.exampleImg{
    width: 650px;
    height: 450px;
    border-radius: 10px;
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
.defaultSize {
    flex: 1;
    margin-right: 15px;
  font-size: 32px;
  color: #333;
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
  align-items: center;
}
.input {
    align-items: center;
    placeholder-color: #999;
    flex: 1;
}
.inputIcon{
    width: 25px;
    height: 25px;
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
  .enterNext{
    background-color: #f8f8f8;
    padding-top: 10px;
    padding-bottom: 10px;
    padding-left: 30px;
    padding-right: 30px;
  }
  .enterNext-button{
    border-radius: 40px;
    padding-top: 20px;
    padding-bottom: 20px;
    text-align: center;
    background-color: #57aba5;
    color: #fff;
    font-size: 35px;
  }
    .nextButton:active{
        background-color: #57aba5;
    }
    .textAlign{
text-align: center;
        flex: 1;
    }
</style>
