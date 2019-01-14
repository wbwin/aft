<template>
  <div class="wrapper">
      <!--<div class="minibar">-->
          <wxc-minibar
                  background-color="#53beb7"
                  text-color="#fff"
                  @wxcMinibarLeftButtonClicked="backClick()"
                  @wxcMinibarRightButtonClicked="minibarRightButtonClick"
                  v-once>
              <image :style="GLOBAL.headerImg"  slot="left"
                     src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
              <text :style="GLOBAL.headerCenter"  slot="middle">堂食管理</text>
              <text :style="GLOBAL.headerRight"  slot="right"></text>
          </wxc-minibar>
      <!--</div>-->
    <div class="content">
      <image class="imgDefault" src="https://image.aftdc.com/appBimg/icon_table_manage.jpg" @click="goToTable()"></image>
      <image class="imgDefault" src="https://image.aftdc.com/appBimg/icon_waiter_manage.jpg" @click="goToWeiter()"></image>
    </div>
  </div>
</template>

<script>
    import {WxcMinibar} from 'weex-ui'
    const navigator = weex.requireModule('navigator');
    const event = weex.requireModule('event');

export default {

  data () {
    return {
        backImgToggle: 0,//头部返回图片判断
    }
  },
    components: {WxcMinibar},
  methods: {
      minibarRightButtonClick(){

      },
      backClick() {
          navigator.pop({ animated: 'true' });
      },
      goToTable() {
          var param = '';
          var url='http://assets/tableManage.js';
          event.toUrl({ "url": url, "param": param });
      },
      goToWeiter() {
          var param = '';
          var url='http://assets/waiterManage.js';
          event.toUrl({ "url": url, "param": param });
      }
  }
}
</script>

<style scoped>
  .wrapper {
    flex-direction: column;
    background-color: #f1f1f1;
    position: relative;

  }
.content{
  flex-direction: column;
  position: absolute;
  top: 90px;
  left: 0;
  right: 0;
  bottom: 0;
  padding-left: 20px;
  padding-right: 20px;
}
  .imgDefault{
    width: 700px;
    height: 550px;
    margin-top: 20px;
  }

</style>
