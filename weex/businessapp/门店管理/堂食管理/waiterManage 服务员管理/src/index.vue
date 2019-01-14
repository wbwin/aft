<template>
    <div class="wrapper" @viewappear="viewappear" @viewdisappear="viewdisappear">
        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="backClick()"
                    @wxcMinibarRightButtonClicked="minibarRightButtonClick"
                    v-once>
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">服务员管理</text>
                <text :style="GLOBAL.headerRight"  slot="right"></text>
            </wxc-minibar>
        </div>
        <!--*****有数据时******-->
        <list class="scroller" v-if="waiter.length>0">
            <cell>
                <div class="listCell" v-for="(item,index) in waiter">
                    <div class="content">
                        <text :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">姓名：{{item.waiterName}}</text>
                        <wxc-button class="editButton" text="编辑"  :btnStyle="editBtnStyle" :textStyle="GLOBAL.buttonText"
                                    @wxcButtonClicked="goToUpWeiter(index)"></wxc-button>

                    </div>
                    <div class="content">
                        <text :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">编号：{{item.waiterNum}}</text>
                        <wxc-button class="delButton" text="删除" :btnStyle="delBtnStyle" :textStyle="GLOBAL.buttonText"
                                    @wxcButtonClicked="delClick(item.id,index)"></wxc-button>
                    </div>
                </div>
            </cell>
        </list>
        <!--*****有数据时******-->
        <!--*****无数据时******-->
        <div class="waiter_not" v-if="waiter.length==0">
            <image class="img_not" src="https://image.aftdc.com/appBimg/icon_no_order.png"></image>
            <text :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">暂无服务员</text>
        </div>
        <!--*****无数据时******-->
        <div class=" waiterButton">
            <wxc-button class="markButton" text="服务员评分" type="white" :btnStyle="GLOBAL.smCancelButton" :textStyle="GLOBAL.cancelButtonText"
                        @wxcButtonClicked="goToWtMark()"></wxc-button>
            <wxc-button class="addButton" text="添加服务员" :btnStyle="GLOBAL.smDefaultButton" :textStyle="GLOBAL.buttonText"
                        @wxcButtonClicked="goToAdWeiter()"></wxc-button>
        </div>
        <wxc-dialog title="提示"
                    content="确认删除？"
                    :show="delShow"
                    :single="false"
                    :show-no-prompt="false"
                    main-btn-color="#53beb7"
                    @wxcDialogCancelBtnClicked="wxcDialogCancelBtnClicked"
                    @wxcDialogConfirmBtnClicked="wxcDialogConfirmBtnClicked"
                    @wxcDialogNoPromptClicked="wxcDialogNoPromptClicked">
        </wxc-dialog>
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
    const picker = weex.requireModule('picker')
    const animation = weex.requireModule('animation')
    const post = weex.requireModule('stream');
    const navigator = weex.requireModule('navigator');
    const event = weex.requireModule('event');
    export default {
        components: {WxcButton,WxcDialog,Toast,WxcMinibar},
        data() {
            return {
                backImgToggle: 0,//头部返回图片判断
                delShow:false,
                backShow:false,
                editBtnStyle: {
                    backgroundColor: '#53beb7',
                    width: '230',
                },
                delBtnStyle: {
                    backgroundColor: '#ff3333',
                    width: '230',
                },

                markBtnStyle:{
                    width: '300',
                },
                addBtnStyle:{
                    backgroundColor: '#53beb7',
                    width: '300',
                    borderColor: '#333',
                    borderWidth: '1px',
                    borderStyle: 'solid'
                },

                waiter:[],
                token:'',
                imei:'',
                pageBack: false

            }
        },
        created:function(){
            this.token = weex.config.token;
            this.imei = weex.config.imei;

            var that = this;

            //获取token和sign
            var param = this.GLOBAL.sign(this.token,this.imei);

            post.fetch({
                url:'https://www.aftdc.com/businessapp/Enrol/ActFuyuan',
                method: 'post',
                type: 'json',
                body: param,
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
            },function(res){
                if(res.data.res == 1){
                    that.waiter = res.data.data;
                }
            })
        },
        methods:{
            minibarRightButtonClick(){

            },
            wxcDialogConfirmBtnClicked() {
                //确定删除
                var that = this;
                that.delShow = false;
                var id = that.id;

                //获取token和sign
                var param = this.GLOBAL.sign(this.token,this.imei);

                param+= '&id='+id;
                post.fetch({
                    url:'https://www.aftdc.com/businessapp/Enrol/delWaiter',
                    method: 'post',
                    type: 'json',
                    body: param,
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                },function(res){
                    if(res.data.res === 1){
                        for (var i = 0;i<that.waiter.length;i++){
                            if(that.waiter[i]['id'] === id){
                                that.waiter.splice(i,1);
                            }
                        }
                        const toast=that.$refs.toast;
                        toast.editContent('成功');
                    } else {
                        const toast=that.$refs.toast;
                        toast.editContent('失败');
                    }
                })
            },
            //跳转到服务员评分页面
            goToWtMark() {
                var that = this;
                var waiter = that.waiter;
                var param = {'waiter': waiter};
                var url='http://assets/waiterMark.js';
                event.toUrl({ "url": url, "param": param });
            },

            //跳转到编辑服务员页面
            goToUpWeiter(index) {
                var that=this;
                var waiterId = that.waiter[index]['id'];//得到要编辑waiterId
                var waiterNum = that.waiter[index]['waiterNum'];//得到要编辑waiterNum
                var waiterName = that.waiter[index]['waiterName'];//得到要编辑waiterName
                var param = {'waiterId':waiterId,'waiterNum':waiterNum,'waiterName':waiterName, 'waiterIndex': index};
                var url='http://assets/addUpdataWaiter.js';
                event.toUrl({ "url": url, "param": param });
            },

            //跳转到添加服务员页面
            goToAdWeiter(){
                var waiterId = -1;
                var param = {'waiterId':waiterId};
                var url='http://assets/addUpdataWaiter.js';
                event.toUrl({ "url": url, "param": param });
            },

            wxcDialogNoPromptClicked() {
                this.delShow = false;
            },
            wxcDialogCancelBtnClicked() {
                //取消删除
                this.delShow = false;
            },
            //返回上一页
            backClick() {
                navigator.pop({ animated: 'true' });
            },
            backCancelBtnClicked () {//点退出时
                //此处必须设置，组件为无状态组件，自己管理
                this.backShow = false;
            },
            backConfirmBtnClicked () {//点保存时时
                //此处必须设置，组件为无状态组件，自己管理
                this.backShow = false;
            },
            delClick(id, index){
                this.id = id;
                this.delShow = true;
            },

            //监听选择商品页面返回
            viewdisappear(){
                let self=this;
                self.pageBack = true;
            },
            viewappear(){
                let self=this;
                if(!self.pageBack){ return; }
                self.pageBack = false;
                var param = event.find('param');//获取保存的数据
                if(param) {
                    param = JSON.parse(param);
                    var that = this;
                    var index = param['index'];
                    if (index || index === 0) {
                        that.waiter[index]['id'] = param['id'];
                        that.waiter[index]['waiterName'] = param['waiterName'];
                        that.waiter[index]['waiterNum'] = param['waiterNum'];
                    } else {
                        var data = {};
                        data['id'] = param['id'];
                        data['waiterName'] = param['waiterName'];
                        data['waiterNum'] = param['waiterNum'];
                        that.waiter.push(data);
                    }
                    //删除保存的数据
                    event.delete('param');
                }
            },
        }
    }
</script>

<style scoped>
    .wrapper {
        flex-direction: column;
        background-color: #fff;
    }
    .scroller{
        flex-direction: column;
        position: absolute;
        top: 90px;
        left: 0;
        right: 0;
        bottom: 128px;
        background-color: #f8f8f8;

    }
    .listCell {
        flex-direction: column;
        /*justify-content: space-between;*/
        /*align-items: center;*/
        margin-left: 10px;
        margin-right: 15px;
        margin-top: 10px;
        margin-bottom: 10px;
        border-width: 2px;
        border-style: solid;
        border-color: #c1c1c1;
        border-radius: 15px;
        padding-left: 50px;
        padding-right: 40px;
        padding-top: 20px;
        padding-bottom: 30px;
        background-color: #fff;

    }

    .content {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-top: 10px;


    }



    .waiterButton{
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
        padding-left: 30px;
        padding-right: 30px;

    }
    .editButton:active{
        background-color: #57aba5;
    }
    .addButton:active{
        background-color: #57aba5;
    }
    .delButton:active{
        background-color: red;
    }
    .markButton:active{
        background-color: #f8f8f8;
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
    }
    .img_not{
        width: 200px;
        height: 200px;
        margin-bottom: 20px;
    }

</style>
