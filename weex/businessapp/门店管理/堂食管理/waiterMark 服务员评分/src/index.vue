<template>
  <div class="wrapper">
      <div class="minibar">
          <wxc-minibar
                  background-color="#53beb7"
                  text-color="#fff"
                  @wxcMinibarLeftButtonClicked="backClick()"
                  @wxcMinibarRightButtonClicked="minibarRightButtonClick"
                  v-once>
              <image :style="GLOBAL.headerImg"  slot="left"
                     src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
              <text :style="GLOBAL.headerCenter"  slot="middle">服务员评分</text>
              <text :style="GLOBAL.headerRight"  slot="right"></text>
          </wxc-minibar>
      </div>

    <div class="countent">
        <div class="message_top">
            <div class="btn title_left" @click="toDesc" >
                <text  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor}" >评分最高</text>
            </div>
            <div class="btn title_right" @click="toAsc">
                <text  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor}" >评分最低</text>
            </div>

        </div>

      <!--*****有数据时******-->
      <list v-if="waiter.length > 0">
      <cell v-for="(item, index) in waiter">
      <div class="listCell">
      <div class="list_content_left">
      <text class="nameSize" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">姓名：{{item.waiterName}}</text>
        <text class="numbSize" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">编号：{{item.waiterNum}}</text>
      </div>
      <div class="list_content_right">
        <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">服务评分：</text >
        <text  class="defaultSize redSize" :style="{fontSize:GLOBAL.biggerFS}">{{item.goods}}</text>

      </div>
      </div>
      </cell>



      </list>
      <!--*****有数据时******-->
      <!--*****无数据时******-->
      <div class="waiter_not" v-if="waiter.length === 0">
        <image class="img_not" src="https://image.aftdc.com/appBimg/icon_no_order.png"></image>
        <text :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">暂无服务员</text>
      </div>
      <!--*****无数据时******-->
    </div>
    <toast ref="toast"></toast>
  </div>
</template>

<script>
    import {WxcButton,WxcDialog,WxcMinibar} from 'weex-ui'
    import Toast from './Toast.vue'
    const navigator = weex.requireModule('navigator');
    const event = weex.requireModule('event');
export default {
    components: {WxcButton,WxcDialog,Toast,WxcMinibar},
  data () {
    return {
        backImgToggle: 0,//头部返回图片判断
        backShow:false,
        waiter:[]
    }
  },
    created:function () {
        this.token = weex.config.token;
        this.imei = weex.config.imei;
        var that = this;

        var waiter=JSON.parse(weex.config.param).waiter;
        that.waiter = waiter;
        this.toDesc();
    },
    methods:{
        minibarRightButtonClick(){

        },
        //返回上一页
        backClick(){
            navigator.pop({ animated: 'true' });
        },

        //升序排列
        toAsc:function () {
            var that = this;
            var waiter = that.waiter;
            function compare(val1,val2){
                val1 = val1['goods'];
                val2 = val2['goods'];
                return val1-val2;
            }
            waiter = waiter.sort(compare);
            that.waiter =waiter;
        },
        //降序排列
        toDesc:function () {
            var that = this;
            var waiter = that.waiter;
            function compare(val1,val2){
                val1 = val1['goods'];
                val2 = val2['goods'];
                return val2-val1;
            }
            waiter = waiter.sort(compare);
            that.waiter =waiter;
        }
    }
}
</script>

<style scoped>
    .message_top {
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding-left: 30px;
        padding-right: 30px;
        padding-top: 20px;
        padding-bottom: 20px;
        border-bottom-width: 4px;
        border-bottom-style: solid;
        border-bottom-color: #f1f1f1;

    }
    .title_left {
        flex: 1;
        padding-top: 20px;
        padding-bottom: 20px;
        border-left-width: 2px;
        border-left-style: solid;
        border-left-color: #53beb7;
        border-top-width: 2px;
        border-top-style: solid;
        border-top-color: #53beb7;
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #53beb7;
        align-items: center;
        justify-content: center;
        border-collapse: collapse;
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;

    }

    .title_right {
        flex: 1;
        align-items: center;
        justify-content: center;
        padding-top: 20px;
        padding-bottom: 20px;
        border-width: 2px;
        border-style: solid;
        border-color: #53beb7;
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
        border-collapse: collapse;
    }
    .btn:active {
        background-color: #d5f9f4;
        color: #fff;
    }


    .wrapper {
   flex-direction: column;
  }
  .countent{
    position: absolute;
    top: 90px;
    left: 0;
    right: 0;
    bottom: 0;
    flex-direction: column;
  }

  .waiter_not {
    position: absolute;
    top: 90px;
    left: 0;
    right: 0;
    bottom: 108px;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    /*margin-top: 400px;*/
  }
  .img_not{
    width: 200px;
    height: 200px;
    margin-bottom: 20px;
  }
  .listCell {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-left: 10px;
    margin-right: 15px;
    margin-top: 20px;
    margin-bottom: 20px;
    border-width: 2px;
    border-style: solid;
    border-color: #dedede;
    border-radius: 15px;
    padding-left: 50px;
    padding-right: 40px;
    padding-top: 20px;
    padding-bottom: 30px;
    background-color: #fff;

  }
  .list_content_left{
    flex-direction: column;
  }
  .list_content_right{
    flex-direction: row;
    align-items: center;
    margin-right: 20px;
  }
  .redSize{
    color: red;
  }
  .nameSize{
    margin-bottom: 10px;
  }
  .numbSize{
    margin-top: 10px;
  }

</style>
