<template>
  <div class="GoodsContent" :style="{visibility: visibility}" >

    <div class="minibar">
      <wxc-minibar
              background-color="#53beb7"
              text-color="#fff"
              @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
              @wxcMinibarRightButtonClicked="minibarRightButtonClick"
              v-once
      >
        <image :style="GLOBAL.headerImg"  slot="left"
               src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
        <text :style="GLOBAL.headerCenter"  slot="middle">团购商品选择</text>
        <text :style="GLOBAL.headerRight"  slot="right">保存</text>
      </wxc-minibar>
    </div>

    <scroller show-scrollbar="false" class="content_left">
      <div id="didi-navigator" v-for="(item, index) in Von">
        <div class="content_nav" :class="[classflyIndex===index?'content_navColor':'']" @click="goto(index)">
          <div class="nav_border" :class="[classflyIndex===index?'nav_borderLeft':'']">

            <image src="https://image.aftdc.com/images/cut-icon.png" v-if="item.catName=='砍价'"
                   style="width: 30px;height: 30px;margin-right: 10px"></image>
            <image src="https://image.aftdc.com/images/sec-icon.png" v-if="item.catName=='秒杀'"
                   style="width: 30px;height: 30px;margin-right: 10px"></image>
            <image src="https://image.aftdc.com/images/reb-icon.png" v-if="item.catName=='折扣'"
                   style="width: 30px;height: 30px;margin-right: 10px"></image>
            <image src="https://image.aftdc.com/images/hot-icon.png" v-if="item.catName=='热销'"
                   style="width: 30px;height: 30px;margin-right: 10px"></image>
            <text class="dot" :class="[classflyIndex===index?'textClassflyColor':'']" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.catName}}</text>
          </div>
        </div>
      </div>
      <!--********接接口可删除*************-->
    </scroller>

    <div class="content_right">
      <scroller class="right_content">
        <div class="row" ref="item" v-for="(name, index) in rows" :key="index">
          <text class="ClassflyTitle" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{name.catName}}</text>
          <div v-for="(food,i) in name.distop" class="foodsDiv" @click="wxcCheckBoxItemChecked(food,index,i)">
            <div class="foodsMessage" style="position: relative;">
              <image class="img_default" :src="'https://image.aftdc.com/'+food.goodsImg"></image>
              <text class="stopSale" v-if="food.isSale == 0" :style="{fontSize:GLOBAL.bigFS}">暂停售卖</text>
              <div class="msg_right">
                <text class="foodsName" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">{{food.goodsName}}</text>

                <text class="foodsStock" v-if="food.goodsStock == -1" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">库存无限</text>
                <text class="foodsStock" v-else :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">库存{{food.goodsStock}}</text>

                <div class="checkBoxDiv">
                  <text class="foodsPrice" :style="{fontSize:GLOBAL.bigFS}">￥{{food.shopPrice}}</text>
                  <!--<wxc-checkbox :has-bottom-border="false" :value="'a'+index+'b'+i" -->
                  <!--@wxcCheckBoxItemChecked="wxcCheckBoxItemChecked" :config="config"></wxc-checkbox>-->
                  <image class="img_default checkBoxImg"  :src="food.checkbox==0||!food.checkbox?'https://image.aftdc.com/appBimg/ic_check_box_normal.png':'https://image.aftdc.com/appBimg/ic_check_box_checked.png'"></image>
                </div>

              </div>
            </div>
            <!--<div class="right_button">-->
            <!--<wxc-button class="choiceButton" text="选择" :textStyle="choiceStyle"-->
            <!--:btnStyle="choiceBtnStyle"-->
            <!--@wxcButtonClicked=""></wxc-button>-->
            <!--</div>-->
          </div>
        </div>
      </scroller>
    </div>

    <toast ref="toast"></toast>
  </div>
</template>
<script>
    import {WxcCheckbox, WxcCheckboxList,WxcDialog,WxcButton,WxcMinibar} from 'weex-ui'
    import Toast from './Toast.vue'

    const post = weex.requireModule('stream');
    var modal = weex.requireModule('modal');
    const dom = weex.requireModule('dom');
    const navigator = weex.requireModule('navigator');
    const event = weex.requireModule('event');

    export default {
        components: {WxcButton, WxcDialog, Toast,WxcCheckbox, WxcCheckboxList,WxcMinibar},
        data() {
            const rows = []
            return {
                visibility:'hidden',
                height: '',
                Von: [],
                rows:[],
                backImgToggle: 0,//头部返回图片判断
                backShow: false,
                choiceBtnStyle: {
                    backgroundColor: '#53beb7',
                    width: '400',
                    borderColor: '#028279',
                    borderWidth: '2px',
                    borderStyle: 'solid',
                    height: '75',
                },
                choiceStyle: {
                    color: '#fff'
                },
                classflyIndex: 0,

                checkboxNum: [],//多选框选中下标
                token:'',
                imei:''

            }
        },
        created: function () {
            this.visibility='hidden';
            var that = this;
            that.height = this.$getConfig().env.deviceHeight;
            console.log(that.height)

            this.token = weex.config.token;
            this.imei = weex.config.imei;
            // this.token = '$2y$10$gIpAzzmR795L02ZZpuuTwOB/50Go7PDeiV8LpI3upwwXPJStvHYNC';
            // this.imei = '2a089adbf0e49549b048f86d25c622a67218db87';
            var param = this.GLOBAL.sign(this.token,this.imei);

            post.fetch({
                method: 'POST',
                type: 'json',
                body: param,
                url: 'https://www.aftdc.com/businessapp/Enrol/cat_goods',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
            }, function (res) {
                console.log(res)
                var arr=res.data[0].dishes
                for(var i=arr.length-1;i>=0;i--){
                    for(var j=arr[i].distop.length-1;j>=0;j--){
                        if(arr[i].distop[j].guige!="[]"||arr[i].distop[j].guigeAttr!="[]"){
                            arr[i].distop.splice(j,1)
                        }
                    }
                    if(arr[i].distop.length==0){
                        arr.splice(i,1)
                    }


                }

                var localShop = event.find('localShop');//获取团购活动页的商品选择数据
                if(localShop){
                    localShop=JSON.parse(localShop);
                    for(var a=0;a<localShop.length;a++){
                        for(var b=0;b<arr.length;b++){
                            for(var c=0;c<arr[b].distop.length;c++){
                                if(arr[b].distop[c].goodsId==localShop[a].goodsId){

                                    that.$set(arr[b].distop[c], 'checkbox', 1)
                                    that.$set(arr[b].distop[c], 'num', localShop[a].num)

                                }
                            }
                        }
                    }
                    that.checkboxNum=localShop;
                    //删除团购活动页面保存的数据
                    event.delete('localShop');

                }

                that.Von = arr
                that.rows = arr
            })
        },
        mounted(){
            var that=this
            that.visibility='visible';
        },
        methods: {

            //选好商品返回团购活动页面
            minibarRightButtonClick() {
                var that = this;

                //获取已选团购商品
                var param = JSON.stringify(that.checkboxNum);
                // console.log(param);

                event.save('checkboxList', param);
                // setTimeout(()=>navigator.pop({ animated: 'true' }),2000);
                navigator.pop({ animated: 'true' });
            },

            //返回上一页
            minibarLeftButtonClick() {
                navigator.pop({ animated: 'true' });
            },
            // backCancelBtnClicked() {//点退出时
            //     //此处必须设置，组件为无状态组件，自己管理
            //     this.backShow = false;
            // },
            // backConfirmBtnClicked() {//点保存时时
            //     //此处必须设置，组件为无状态组件，自己管理
            //     this.backShow = false;
            // },
            goto(index) {
                console.log(index)
                dom.scrollToElement(this.$refs.item[index], {})
                console.log(this.$refs.item[index])
                this.classflyIndex = index
            },
            //上架
            previous(e) {
                var that = this;
                var goodsId = e.goodsId;
                var isSale = e.isSale;
                if (isSale != 1 && isSale != 0) {
                    const toast = that.$refs.toast
                    toast.editContent('这个只是商品活动，请点击商品实体...');
                    return false
                }
                var formData = 'goodsId=' + goodsId + '&&' + 'isSale=1';
                post.fetch({
                    method: "POST",
                    url: 'https://www.aftdc.com/businessapp/Enrol/saveSale',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    body: formData,
                    type: 'json',
                }, function (res) {
                    if (res.data.res == 1) {
                        const toast = that.$refs.toast
                        toast.editContent('成功...');
                        var rows = that.rows;
                        for (var i = 0; i < rows.length; i++) {
                            if (rows[i]['distop']) {
                                for (var p = 0; p < rows[i]['distop'].length; p++) {
                                    if (rows[i]['distop'][p]['goodsId'] == res.data.goodsId) {
                                        rows[i]['distop'][p]['isSale'] = 1;
                                    }
                                }
                            }
                        }
                        that.rows = rows
                    } else {
                        const toast = that.$refs.toast
                        toast.editContent('错误...');
                    }
                })
            },
            //下架
            next(e) {
                var that = this;
                var goodsId = e.goodsId;
                var isSale = e.isSale;
                if (isSale != 1 && isSale != 0) {
                    console.log('这个只是商品活动，请点击商品商家')
                    return false
                }
                var formData = 'goodsId=' + goodsId + '&&' + 'isSale=0';
                post.fetch({
                    method: "POST",
                    url: 'https://www.aftdc.com/businessapp/Enrol/saveSale',
                    body: formData,
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    type: 'json',
                }, function (res) {
                    if (res.data.res == 1) {
                        var rows = that.rows;
                        for (var i = 0; i < rows.length; i++) {
                            if (rows[i]['distop']) {
                                for (var p = 0; p < rows[i]['distop'].length; p++) {
                                    if (rows[i]['distop'][p]['goodsId'] == res.data.goodsId) {
                                        rows[i]['distop'][p]['isSale'] = 0;
                                    }
                                }
                            }
                        }
                        that.rows = rows
                    } else {
                        const toast = that.$refs.toast
                        toast.editContent('错误...');
                    }
                })
            },
            wxcCheckBoxItemChecked(food,index,i) {
                var that=this
                var mark = 'a'+index+'b'+i
                if (food.distop == 0||!food.checkbox) {
                    that.$set(food, 'checkbox', 1)

                    //保存已选好的商品数据
                    var params = {};
                    params['id'] = mark;
                    params['goodsId'] = that.rows[index]['distop'][i]['goodsId'];//得到 goodsId
                    params['goodsName'] = that.rows[index]['distop'][i]['goodsName'];//得到 goodsName
                    params['goodsStock'] = that.rows[index]['distop'][i]['goodsStock'];//得到 goodsStock
                    params['shopPrice'] = that.rows[index]['distop'][i]['shopPrice'];//得到 shopPrice
                    params['goodsImg'] = that.rows[index]['distop'][i]['goodsImg'];//得到 goodsImg
                    params['attr'] = that.rows[index]['distop'][i]['attr'];//得到 attr
                    params['boxFee'] = that.rows[index]['distop'][i]['boxFee'];//得到 boxFee
                    params['marketPrice'] = that.rows[index]['distop'][i]['marketPrice'];//得到 marketPrice
                    params['num'] = 1;//得到 num
                    params['checkbox'] = that.rows[index]['distop'][i]['checkbox'];//得到 num

                    that.checkboxNum.push(params);

                } else {

                    that.$set(food, 'checkbox', 0)
                    for (var i = 0; i < this.checkboxNum.length; i++) {
                        if (this.checkboxNum[i]['id'] === mark) {
                            this.checkboxNum.splice(i, 1);
                            break;
                        }
                    }
                }
                // console.log(this.checkboxNum);
            },
        },
    }
</script>

<style scoped>
  .minibar {
    border-bottom-width: 1px;
    border-bottom-style: solid;
    border-bottom-color: #f1f1f1;
  }


  .content_navColor {
    background-color: #fff;
  }

  .textClassflyColor {
    color: #53beb7;
  }

  .ClassflyTitle {
    padding-top: 10px;
    padding-bottom: 10px;
    text-align: left;
    padding-left: 20px;
    background-color: #f1f1f1;
    color: #333;
    /*margin-top: 10px;*/
    margin-bottom: 10px;
  }

  .foodsDiv {
    /*margin-top: 20px;*/
    /*margin-bottom: 20px;*/
    padding-left: 35px;
    padding-right: 35px;
    padding-top: 35px;
    padding-bottom: 35px;
    border-bottom-width: 2px;
    border-bottom-style: solid;
    border-bottom-color: #f1f1f1;
  }
  .foodsDiv:active{
    background-color: #f8f8f8;
  }

  .GoodsContent {
    flex-direction: row;
    justify-content: flex-start;
  }

  .content_left {
    width: 200px;
    flex-direction: column;
    background-color: #fff;
    border-top-width: 2px;
    border-top-style: solid;
    border-top-color: #f1f1f1;
    background-color: #f8f8f8;
    /*height: 1210px;*/
    position: absolute;
    top: 90px;
    left: 0;
    bottom: 0;

  }

  .content_nav {
    /*padding-top: 30px;*/
    /*flex-direction: row;*/
    /*padding-bottom: 30px;*/
    background-color: #f8f8f8;
    border-width: 1px;
    border-style: solid;
    border-color: #f1f1f1;
    border-top-width: 0;
    border-left-width: 0;
    min-width: 0;
    flex-direction: row;
    align-items: center;
  }

  .content_nav:active {
    background-color: #53beb7;
  }
  .content_right {
    width: 550px;
    flex-direction: column;
    background-color: #e8e8e8;
    position: absolute;
    top: 90px;
    right: 0;
    /*left: 200px;*/
    bottom: 0;
    border-left-width: 2px;
    border-left-style: solid;
    border-left-color: #f1f1f1;
    border-top-width: 2px;
    border-top-style: solid;
    border-top-color: #f1f1f1;
  }

  .nav_border {
    /*padding-left: 20px;*/
    /*padding-right: 20px;*/
    flex: 1;
    min-width: 0;
    flex-direction: row;
    align-items: center;
    margin-top: 35px;
    margin-bottom: 35px;
    /*justify-content: center;*/
    padding-left: 30px;

    padding-right: 20px;
    border-left-width:0;
    border-left-style: solid;
    border-left-color: #fff;
  }

  .nav_borderLeft {
    border-left-width: 15px;
    border-left-style: solid;
    border-left-color: #53beb7;
  }

  .dot {
    width: 150px;
    flex-direction: row;
    align-items: center;

    /*padding-top: 40px;*/
    /*padding-bottom: 40px;*/
    /*white-space: nowrap;*/
    /*overflow: hidden;*/
    /*width: 160px;*/
    /*word-break: break-all;*/
    /*text-overflow: ellipsis;*/

  }

  .foodsMessage {
    flex-direction: row;
  }

  .right_content {
    flex-direction: column;
    /*padding-top: 35px;*/
    /*padding-left: 35px;*/
    /*padding-right: 35px;*/
    /*padding-bottom: 35px;*/
    border-bottom-width: 2px;
    border-bottom-style: solid;
    border-bottom-color: #e8e8e8;
    background-color: #fff;

  }

  .msg_right {
    flex-direction: column;
    padding-left: 35px;
    flex: 1;
  }

  .img_default {
    width: 120px;
    height: 120px;
  }

  .foodsName {
    width: 300px;
  }

  .foodsStock {
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .foodsPrice {
    color: red;
  }
  .stopSale{
    color: white;
    width: 120px;
    height: 120px;
    position:absolute;
    background-color: rgba(100, 100, 100, 0.6);
    left:0;
    /*right:0;*/
    top: 0;
    bottom:0;
    text-align: center;
    line-height: 120px;
  }
  .checkBoxDiv{
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    flex: 1;
  }
  .checkBoxImg{
    width: 45px;
    height: 45px;
  }
  /*****************/
  .header {
    flex-direction: row;
    height: 90px;
    background-color: #53beb7;
    align-items: center;
    justify-content: space-between;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
  }
  /***********************/
</style>
