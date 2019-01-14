<template>
    <div @viewappear="viewappear" @viewdisappear="viewdisappear">
        <wxc-minibar
                background-color="#53beb7"
                text-color="#fff"
                @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                v-once>
            <image :style="GLOBAL.headerImg"  slot="left"
                   src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
            <text :style="GLOBAL.headerCenter" slot="middle">分类管理</text>
        </wxc-minibar>

        <list class="scroller_content">
            <cell class="scroller_line" v-for="(item,index) in list">
                <div class="foods_classify">
                    <text :style="{fontSize: GLOBAL.biggerFS,color:GLOBAL.dColor}">{{item.catName}}</text>
                    <text :style="{fontSize: GLOBAL.defaultFS,color:'#666'}">{{item.goodsNum}}个商品</text>
                </div>
                <div class="scroller_button">
                    <text class="updata" :style="{fontSize:GLOBAL.bigFS}" @click="addUpdataClassify(item.catId,item.catName)">编辑</text>
                    <!--<text class="create" :style="{fontSize:GLOBAL.bigFS}" @click="addGoods">新建商品</text>-->
                    <text class="required" :class="[item.required==1?'btnActive':'default']" :style="{fontSize:GLOBAL.bigFS}" @click="addClassRequired(index)">必选</text>
                </div>
            </cell>
        </list>

        <div class="waiterButton">
            <wxc-button class="btnActive" text="排序&批量处理" :btnStyle="btnLeftStyle" :textStyle="textStyle"
                        @wxcButtonClicked="classifySort" :class="[goodsId?'delectBtnActive':'btnActive']"></wxc-button>
            <wxc-button class="btnActive" text="+新建分类" :btnStyle="btnLeftStyle" :textStyle="textStyle"
                        @wxcButtonClicked="addUpdataClassify" ></wxc-button>
        </div>
        <toast ref="toast"></toast>
    </div>
</template>

<script>
    import Toast from './Toast.vue'
    import {WxcMinibar,WxcButton} from 'weex-ui';
    const modal = weex.requireModule('modal');
    const post = weex.requireModule('stream');
    const event = weex.requireModule('event');
    export default {
        components: { WxcMinibar,Toast,WxcButton},
        data() {
            return {
                list:[],
                backImgToggle:0,
                token:'',
                imei:'',
                btnLeftStyle:{//左边按钮样式
                    backgroundColor: '#53beb7',
                    width: '300',
                },
                btnRightStyle:{//右边按钮样式
                    backgroundColor: '#53beb7',
                    width: '300',
                },
                textStyle: {//按钮文本样式
                    color: '#fff',
                    fontSize: '28px'
                },
            }
        },
        created:function(){
            this.token = weex.config.token
            this.imei = weex.config.imei
            this.refresh()
        },
        methods:{
            refresh(){
                var that = this
                var param = this.GLOBAL.sign(this.token,this.imei);
                post.fetch({
                    method:'POST',
                    type:'json',
                    body:param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url:'https://www.aftdc.com/businessapp/Enrol/getShopCats',
                },function(res){
                    if (res.data.res == 1){
                        that.list = res.data.data[0].dishes;
                    }
                })
            },
            minibarLeftButtonClick(){

            },
            backClick(){
                navigator.pop({ animated: 'true' });
            },
            classifySort(){
                var param='';
                var url = 'http://assets/classifySort.js';
                event.toUrl({url:url,param:param});
            },
            addUpdataClassify(catId,classifyName){
                if (classifyName)
                    var param={ catId:catId,classifyName:classifyName };
                else
                    var param='';

                var url = 'http://assets/addUpdataClassify.js';
                event.toUrl({url:url,param:param});
            },
            addGoods(){
                var param = '';
                var url='http://assets/addUpdataGoods.js';
                event.toUrl({ "url": url, "param": param });
            },
            //监听页面返回
            viewdisappear(){
                let self=this;
                self.pageBack = true;
            },
            viewappear(){
                let self=this;
                if(!self.pageBack){ return; }
                self.pageBack = false;
                //如果有改动,更新
                if (event.find('changeGoodsManage')==1){
                    this.refresh()
                }
            },
            //设置分类必选
            addClassRequired(index){
                var that = this
                const toast = this.$refs.toast;
                var catId = this.list[index].catId
                var required = this.list[index].required==0?'1':'0'
                var param = this.GLOBAL.sign(this.token,this.imei);
                param += '&catId=' + catId
                param += '&required=' + required
                post.fetch({
                    method:'POST',
                    type:'json',
                    body:param,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    url:'https://www.aftdc.com/businessapp/Enrol/required',
                },function(res){
                    if (res.data.res == 1){
                        if(required == 1){
                            for(var i=0,len=that.list.length;i<len;i++){
                                if(i!==index){
                                    that.$set(that.list[i],'required', 0);
                                }
                            }
                        }
                        that.$set(that.list[index],'required', required);
                        that.list[index].required = required
                    }
                    toast.editContent(res.data.info);
                })
            }
        }
    }
</script>

<style scoped>
    .waiterButton{
        flex-direction: row;
        justify-content: space-around;
        padding-top: 20px;
        padding-bottom: 20px;
        padding-left: 30px;
        padding-right: 30px;
        position: fixed;
        bottom: 0px;
        left: 0;
        right: 0;
        background-color: #fff;
        border-top-width: 2px;
        border-top-style: solid;
        border-top-color: #f8f8f8;
    }
    .btnActive:active {
        background-color: #57aba5;
    }
    .btnActive:enabled{
        background-color: #53beb7;
    }
    .scroller_content {
        flex-direction: column;
        position: absolute;
        top: 90px;
        left: 0;
        right: 0;
        bottom: 110px;
    }
    .scroller_line {
        flex-direction: row;
        align-items: center;
        justify-content: space-around;
        padding-top: 40px;
        padding-bottom: 40px;
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #f8f8f8;
        /*transition-property:backgroundColor;*/
        /*transition-duration: 0.3s;*/
        /*transition-delay: 0s;*/
        /*transition-timing-function:ease-in-out;*/
    }
    .scroller_line:active{
        background-color: #f8f8f8;
    }

    .foods_classify {
        flex-direction: column;
        flex: 1;
        padding-left: 30px;
        padding-right: 10px;
    }

    .scroller_button{
        flex: 1.5;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .updata{
        flex: 4;
        text-align: center;
        border-width: 2px;
        border-style: solid;
        border-color: #53beb7;
        color:#53beb7;
        background-color: #fff;
        border-radius: 10px;
        padding-top: 20px;
        padding-left: 12px;
        padding-bottom: 20px;
        padding-right: 12px;
        margin-right: 20px;
    }
    .create{
        flex: 6;
        text-align: center;
        border-width: 2px;
        border-style: solid;
        border-color: #53beb7;
        margin-right: 14px;
        margin-left: 14px;
        color:#53beb7;
        border-radius: 10px;
        padding-top: 20px;
        padding-left: 12px;
        padding-bottom: 20px;
        padding-right: 12px;
    }
    .required {
        flex: 4;
        text-align: center;
        border-width: 2px;
        border-style: solid;
        border-color: #53beb7;
        border-radius: 10px;
        padding-top: 20px;
        padding-left: 12px;
        padding-bottom: 20px;
        padding-right: 12px;
        margin-right: 20px;
    }
    .default {
        color:#53beb7;
        background-color:#fff;
    }
    .btnActive {
        color: #fff;
        background-color:#53beb7;
    }
    .updata:active{
        background-color:#f1f1f1;
    }
    .updata:enabled{
        color: #53beb7;
    }
    .create:active{
        background-color:#f1f1f1;
    }
    .create:enabled{
        color: #53beb7;
    }
</style>
