<template>
  <div class="wrapper">

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
        <text :style="GLOBAL.headerCenter"  slot="middle">配送管理</text>
      </wxc-minibar>
    </div>

    <scroller class="manageContent">
      <div class="content">
        <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">是否开启配送</text>
        <div ref="test2" :class="[startSwitch==false?'close':'open']"
             style="justify-content: center;padding-left: 1px;"
             @click="bill">
          <div ref="test1" :class="[startSwitch==false?'isClose':'isOpen']"></div>
        </div>
      </div>
      <div v-if="isOn">
        <div class="content">
          <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">配送方式</text>
          <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">商家自配送</text>
        </div>
        <div class="content">
          <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">配送范围</text>
          <div class="content_input">
            <input type="number" v-model="range" class="input" :class="[errorCss?'errorCss':'']" placeholder="请输入配送范围" @focus="focus" @blur="blur" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}"/>
            <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">公里</text>
          </div>
        </div>
        <div class="content">
          <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">配送时间</text>
          <div class="content_input">
            <input type="number" class="input" v-model="deliveryCostTime"  :class="[errorCss?'errorCss':'']"  placeholder="请输入配送时间(10~120之内)" @focus="focus" @blur="blur" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}"/>
            <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">分钟</text>
          </div>
        </div>
        <div class="content">
          <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">配送费</text>
          <div class="content_input">
            <input type="number" class="input" v-model="deliveryStartMoney"  :class="[errorCss?'errorCss':'']"  placeholder="请输入配送费" @focus="focus" @blur="blur" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}"/>
            <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">元</text>
          </div>
        </div>
        <div class="content">
          <text class="input_main" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">起送价</text>
          <div class="content_input">
            <input type="number" v-model="deliveryFreeMoney" class="input"  :class="[errorCss?'errorCss':'']"  placeholder="请输入起送价" @focus="focus" @blur="blur" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}"/>
            <text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">元</text>
          </div>
        </div>
      </div>
    </scroller>


    <div class=" enterButton" v-if="btnShow">

      <wxc-button class="okButton" text="下一步" :textStyle="GLOBAL.buttonText" :btnStyle="GLOBAL.defaultButton"
                  @wxcButtonClicked="toEnterMessage"></wxc-button>
    </div>

    <!--<wxc-dialog title="提示"-->
                <!--content="尚未保存数据，是否保存？"-->
                <!--cancel-text="退出"-->
                <!--confirm-text="保存"-->
                <!--:show="backShow"-->
                <!--:single="false"-->
                <!--:show-no-prompt="false"-->
                <!--main-btn-color="#53beb7"-->
                <!--@wxcDialogCancelBtnClicked="backCancelBtnClicked"-->
                <!--@wxcDialogConfirmBtnClicked="backConfirmBtnClicked"-->
    <!--&gt;-->
    <!--</wxc-dialog>-->
    <toast ref="toast"></toast>
  </div>
</template>

<script>
    import {WxcButton,WxcDialog,WxcMinibar} from 'weex-ui'
    import Toast from './Toast.vue'
    const animation = weex.requireModule('animation')
    const picker = weex.requireModule('picker')
    const post = weex.requireModule('stream');
    const navigator = weex.requireModule('navigator');
export default {
    components: {WxcButton,WxcDialog,Toast,WxcMinibar},
  data () {
    return {
        backImgToggle: 0,//头部返回图片判断
        backShow: false,
        btnShow:true,//下一步按钮的显示隐藏
        isOn: '',
        startSwitch: '',//switch一开始的状态；
        saveBtnStyle:{
            backgroundColor: '#53beb7',
            width: '600',
            borderColor: '#333',
            borderWidth: '1px',
            borderStyle: 'solid'
        },
        saveStyle:{
            color:'#fff'
      },
        errorCss:false,//未填写数据点保存改变input框样式,
        deliveryCostTime:'',
        deliveryFreeMoney:'',
        deliveryStartMoney:'',
        range:'',
        token:'',
        imei:''
    }
  },
    created() {

        this.token = weex.config.token
        this.imei = weex.config.imei
        var that = this;

        //获取token和sign
        var param = this.GLOBAL.sign(this.token,this.imei);

        post.fetch({
            method: 'post',
            type: 'json',
            body: param,
            url: 'https://www.aftdc.com/businessapp/Enrol/ps_bution',
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
        },function(res){
            if(res.data.data.isdelivery == 1){
                that.startSwitch = true;
                that.isOn = true;
            } else {
                that.startSwitch = false;
                that.isOn = false;
            }
            that.deliveryCostTime = res.data.data.deliveryCostTime;
            that.deliveryFreeMoney = res.data.data.deliveryFreeMoney;
            that.deliveryStartMoney = res.data.data.deliveryStartMoney;
            that.range = res.data.data.range/1000;
        })
    },
    methods:{
        focus(){
            this.btnShow=false;
        },
        blur(){
            this.btnShow=true;
        },
        toEnterMessage(){
            var that = this;
            var formData = '';
            var isdelivery = that.isOn;
            if (isdelivery){
                isdelivery = 1;
            } else {
                isdelivery = 0;
            }
            var deliveryCostTime = that.deliveryCostTime;
            var deliveryFreeMoney = that.deliveryFreeMoney;
            var deliveryStartMoney = that.deliveryStartMoney;
            if(!deliveryCostTime||!deliveryFreeMoney||!deliveryStartMoney||!that.range){
                const toast=that.$refs.toast
                toast.editContent('请填写完整');
                return false;
            }
            var range = that.range*1000;

            //获取token和sign
            var param = this.GLOBAL.sign(this.token,this.imei);

            param += '&&isdelivery='+isdelivery+'&&'+'deliveryCostTime='+deliveryCostTime+'&&'+'deliveryFreeMoney='+deliveryFreeMoney
                +'&&'+'deliveryStartMoney='+deliveryStartMoney+'&&'+'range='+range;
            console.log(param)
            post.fetch({
                method: 'post',
                type: 'json',
                body: param,
                url: 'https://www.aftdc.com/businessapp/Enrol/distribution',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
            },function(res){
                if(res.data.res === 1){
                    const toast=that.$refs.toast
                    toast.editContent(res.data.info);
                    setTimeout(()=>navigator.pop({ animated: 'true' }),2000);
                } else {
                    const toast=that.$refs.toast
                    toast.editContent(res.data.info);
                }
            })
        },
        bill: function () {
            var that = this
            if (that.isOn == false) {
                var testEl = this.$refs.test1;
                var testE2 = this.$refs.test2;
                if (that.startSwitch == true) {
                    var transform = 'translate(0px, 0px)';
                } else {
                    var transform = 'translate(52px, 0px)';
                }
                animation.transition(testEl, {
                    styles: {
                        transform: transform,
                    },
                    duration: 500, //ms
                    timingFunction: 'ease',
                    delay: 0 //ms
                })
                animation.transition(testE2, {
                    styles: {
                        backgroundColor: '#4ed465',
                    },
                    duration: 500, //ms
                    timingFunction: 'ease',
                    delay: 0 //ms
                })
                that.isOn = !that.isOn
                that.goodsStock = -1;
            } else {

                var testEl = this.$refs.test1;
                var testE2 = this.$refs.test2;
                if (that.startSwitch == true) {
                    var transform = 'translate(-52px, 0px)';
                } else {
                    var transform = 'translate(0px, 0px)';
                }
                animation.transition(testEl, {
                    styles: {
                        transform: transform,
                    },
                    duration: 500, //ms
                    timingFunction: 'ease',
                    delay: 0 //ms
                })
                animation.transition(testE2, {
                    styles: {
                        backgroundColor: '#e2e2e2',
                    },
                    duration: 500, //ms
                    timingFunction: 'ease',
                    delay: 0 //ms
                })
                that.isOn = !that.isOn
            }

        },
        //返回上一页
        minibarLeftButtonClick(){
            navigator.pop({ animated: 'true' });
        },
        // backCancelBtnClicked () {//点退出时
        //     //此处必须设置，组件为无状态组件，自己管理
        //     this.backShow = false;
        // },
        // backConfirmBtnClicked () {//点保存时时
        //     //此处必须设置，组件为无状态组件，自己管理
        //     this.backShow = false;
        // },
    }
}
</script>

<style scoped>
  .enterButton {
    flex-direction: row;
    justify-content: space-around;
    /*position: fixed;*/
    /*left: 0;            存在时固定在底部*/
    /*bottom: 0;*/
    /*right: 0;*/
    background-color: #fff;
    border-top-width: 2px;
    border-top-style: solid;
    border-top-color: #f1f1f1;
    padding-top: 20px;
    padding-bottom: 20px;
    padding-left: 30px;
    padding-right: 30px;
  }

  .okButton:active {
    background-color: #57aba5;
  }
  .minibar {
    border-bottom-width: 1px;
    border-bottom-style: solid;
    border-bottom-color: #f1f1f1;
  }
  .wrapper {
   flex-direction: column;
    background-color: #f8f8f8;
  }
  .manageContent{
    flex: 1;
    width: 750px;
  }
.content{
  background-color: #fff;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  padding-right: 20px;
  padding-bottom: 20px;
  padding-left: 20px;
  margin-top: 20px;
}
  .input_main{
    flex: 1;
  }
  .content_input{
    flex-direction: row;
    flex: 2.5;
    justify-content: flex-end;
    align-items: center;
  }
  .input{
    text-align: right;
    padding-top: 10px;
    padding-bottom: 5px;
    flex: 1;
    margin-right: 10px;
  }
  .open {
    width: 104px;
    height: 52px;
    border-radius: 52px;
    border-width: 1px;
    border-style: solid;
    border-color: white;
    background-color: #4ed465;

  }

  .close {
    width: 104px;
    height: 52px;
    border-radius: 52px;
    border-width: 1px;
    border-style: solid;
    border-color: #bbbbbb;

  }

  .isOpen {
    width: 50px;
    height: 50px;
    border-radius: 26px;
    border-width: 1px;
    border-style: solid;
    border-color: #e2e2e2;
    background-color: #ffffff;
    left: 52px;
  }

  .isClose {
    width: 50px;
    height: 50px;
    background-color: white;
    border-radius: 26px;
    border-width: 1px;
    border-style: solid;
    border-color: #e2e2e2;

  }
.errorCss{
  placeholder-color:red;
}
  /*****************/

  /***********************/
</style>
