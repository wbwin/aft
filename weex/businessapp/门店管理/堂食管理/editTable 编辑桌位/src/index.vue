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
                <text :style="GLOBAL.headerCenter"  slot="middle">编辑座位</text>
                <text :style="GLOBAL.headerRight"  slot="right"></text>
            </wxc-minibar>
        </div>
        <div class="table_content">
            <div class="tableClassfly">
                <text class="defaultSize" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">桌位预定功能</text>
                <div ref="test2" :class="[startSwitch==false?'close':'open']"
                     style="justify-content: center;padding-left: 1px;"
                     @click="bill">
                    <div ref="test1" :class="[startSwitch==false?'isClose':'isOpen']"></div>
                </div>
            </div>
            <div class="closeBox" v-if="!isOn" ><text :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">已关闭桌位预定功能</text></div>
            <div class="closeBox" v-if="isOn&&table.length<=0" ><text :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">暂无桌位，去添加吧...</text></div>
            <list v-if="isOn">
                <cell>
                    <div class="allListCell">
                        <div class="listCell " v-for="(item,index) in table">
                            <div>
                                <text class="content_Size" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">桌位号码：{{item.deskNum}}</text>
                                <text class="content_Size" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">桌位名称：{{item.deskName}}</text>
                                <text class="content_Size" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">桌位类型：{{item.deskType}}</text>
                                <text class="content_Size" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">用餐人数：{{item.deskPersonNum}}人</text>
                            </div>
                            <div class="content_button">
                                <wxc-button text="删除" :btnStyle="cancelBtnStyle" :textStyle="textStyle" class="cancelButton"
                                            @wxcButtonClicked="del(index)"></wxc-button>
                                <wxc-button text="编辑" :btnStyle="btnStyle" :textStyle="textStyle" class="agreeButton"
                                            @wxcButtonClicked="goToUpTable(index)"></wxc-button>
                            </div>
                        </div>
                    </div>
                </cell>
            </list>
        </div>
        <div class="table_bottom">
            <wxc-button class="editButton" text="添加桌位" :textStyle="GLOBAL.cancelButtonText" :btn-style="GLOBAL.cancelButton"
                        @wxcButtonClicked="goToAdTable()"></wxc-button>
        </div>
        <toast ref="toast"></toast>
    </div>
</template>
<script>
    import {WxcButton} from 'weex-ui';
    import {WxcDialog,WxcMinibar} from 'weex-ui';
    import Toast from './Toast.vue'
    const animation = weex.requireModule('animation')
    const post = weex.requireModule('stream');
    const navigator = weex.requireModule('navigator');
    const event = weex.requireModule('event');

    export default {
        // components: {WxcButton},
        components: { WxcButton,WxcDialog,Toast,WxcMinibar},
        data() {
            return {
                backImgToggle: 0,//头部返回图片判断
                toggle: 0,
                isOn: false,
                startSwitch:false,//switch一开始的状态
                table:[],//桌位数据
                btnStyle: {
                    backgroundColor: '#53beb7',
                    width: '150px',
                    height: '70px',
                    // borderColor: '#666',
                    // borderWidth: '1px',
                    // borderStyle: 'solid'
                },
                textStyle: {
                    fontSize: '28px',
                    color: '#fff'
                },
                cancelBtnStyle: {
                    backgroundColor: 'red',
                    width: '150px',
                    height: '70px',
                    // borderColor: '#666',
                    // borderWidth: '1px',
                    // borderStyle: 'solid'
                },
                tagButtonStyle:{
                    backgroundColor: '#fff',
                    width: '100',
                    height: '50px',
                    borderColor: '#53beb7',
                    borderWidth: '1px',
                    borderStyle: 'solid'
                },
                tagStyle:{
                    fontSize:'25px',
                    color: '#53beb7'
                },
                editBtnStyle:{
                    backgroundColor: '#fff',
                    width: '600px',
                    borderColor: '#000',
                    borderWidth: '1px',
                    borderStyle: 'solid'
                },
                editStyle:{
                    color:'#000'
                },
                token:'',
                imei:'',
                pageBack: false
            }
        },
        created(){
            var that = this;
            this.token = weex.config.token;
            this.imei = weex.config.imei;

            //获取token和sign
            var param = this.GLOBAL.sign(this.token,this.imei);

            post.fetch({
                method: 'post',
                type: 'json',
                url: 'https://www.aftdc.com/businessapp/Enrol/getDesk',
                body:param,
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
            },function(res){
                if (res.data.res == 1){
                    that.table = that.table.concat(res.data.data.desks)
                    if (res.data.tsyd == 1){
                        that.isOn=true;
                        that.startSwitch=true;//switch一开始的状态
                    }
                }
            })
        },
        methods: {
            minibarRightButtonClick(){

            },
            del(index){
                var that=this;
                var deskId = that.table[index]['id'];
                // console.log(deskId);
                // var deskNum = that.table[index]['deskNum'];
                that.table.splice(index, 1)

                //获取token和sign
                var param = this.GLOBAL.sign(this.token,this.imei);

                param+= '&deskId='+deskId;
                // param+= '&deskNum='+deskNum;
                post.fetch({
                    method: 'post',
                    type: 'json',
                    body:param,
                    url: 'https://www.aftdc.com/businessapp/Enrol/delDesk',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                },function(res){
                    if(res.data.res == 1){
                        const toast=that.$refs.toast
                        toast.editContent('删除成功...');
                    } else {
                        const toast=that.$refs.toast
                        toast.editContent('删除失败...');
                    }
                })
            },

            //返回上一页
            backClick() {
                navigator.pop({ animated: 'true' });
            },

            //跳转到编辑桌位页面
            goToUpTable(index){
                var that=this;
                var deskId = that.table[index]['id'];//得到要编辑的ID
                var deskNum = that.table[index]['deskNum'];//得到要编辑的Num
                var deskName = that.table[index]['deskName'];//得到要编辑的name
                var deskType = that.table[index]['deskType'];//得到要编辑的type
                if (deskType === "散台") {//判断deskType的值转换成数字
                    deskType = 1;
                } else {
                    deskType = 2;
                }
                var deskPersonNum = that.table[index]['deskPersonNum'];//得到要编辑的personnum
                var param = {'deskId':deskId,'deskNum':deskNum,'deskName':deskName,'deskType':deskType,'deskPersonNum':deskPersonNum,'deskindex': index};
                var url='http://assets/addUpdataTable.js';
                event.toUrl({ "url": url, "param": param });
            },
            //跳转到添加桌位页面
            goToAdTable(){
                var param = '';
                var url='http://assets/addUpdataTable.js';
                event.toUrl({ "url": url, "param": param });
            },

            classflyClick(index) {
                var that = this;
                that.toggle = index
            },
            bill: function () {
                var that = this
                if (that.isOn == false) {//点击开启
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
                    that.change(1)

                } else {//点击开启
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
                    that.change(0)
                }

            },
            change(e){
                //获取token和sign
                var param = this.GLOBAL.sign(this.token,this.imei);
                param+= 'deskId='+deskId;
                param+= 'tsyd='+e;
                post.fetch({
                    method: 'post',
                    type: 'json',
                    body:param,
                    url: 'https://www.aftdc.com/businessapp/Enrol/Deskchange',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                },function(res){
                    console.log(res)
                })
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
                        that.table[index]['id'] = param['id'];
                        that.table[index]['deskName'] = param['deskName'];
                        that.table[index]['deskNum'] = param['deskNum'];
                        that.table[index]['deskPersonNum'] = param['deskPersonNum'];
                        that.table[index]['deskType'] = param['deskType'];
                    } else {
                        var data = {};
                        data['id'] = param['id'];
                        data['deskName'] = param['deskName'];
                        data['deskNum'] = param['deskNum'];
                        data['deskPersonNum'] = param['deskPersonNum'];
                        data['deskType'] = param['deskType'];
                        that.table.push(data);
                    }
                    //删除保存的数据
                    event.delete('param');

                }
            },

        },
    }
</script>

<style scoped>
    .wrapper {
        flex-direction: column;
        background-color: #f8f8f8;
        position: relative;
    }
    .table_content{
        flex-direction: column;
        position: absolute;
        top: 90px;
        left: 0;
        right: 0;
        bottom: 108px;
    }
    .tableClassfly {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        background-color: #fff;
        padding-top: 20px;
        padding-bottom: 20px;
        padding-left: 40px;
        padding-right: 40px;
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #000;

    }

    .defaultSize {
        font-size: 35px;
        color: #333;
    }

    .classflyLeft {
        flex: 1;
    }

    .classflyRight {
        flex: 1;
    }

    .scattered {
        text-align: center;
        padding-top: 20px;
        padding-bottom: 20px;
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #fff;
        border-top-width: 2px;
        border-top-style: solid;
        border-top-color: #fff;

        color:#53beb7;

    }

    .balcony {

        text-align: center;
        padding-top: 20px;
        padding-bottom: 20px;
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #fff;
        border-left-width: 2px;
        border-left-style: solid;
        border-left-color: #fff;
        border-top-width: 2px;
        border-top-style: solid;
        border-top-color: #fff;
        color:#53beb7;
    }

    .scroller {
        flex-direction: row;
        flex-wrap: wrap;

        width: 750px;
    }

    .allListCell {
        flex-direction: row;
        flex-wrap: wrap;

        width: 750px;
    }

    .listCell {
        position: relative;
        margin-top: 20px;
        margin-left: 20px;
        /*margin-right: 10px;*/

        border-width: 2px;
        border-style: solid;
        border-color: #f8f8f8;
        /*border-collapse: collapse;*/
        border-radius: 10px;
        background-color: #fff;
        flex-direction: column;


        justify-content: space-between;
        width: 345px;
        padding-top: 20px;


    }

    .content_Size {
        font-size: 30px;
        color: #999;
        margin-left: 10px;
        margin-bottom: 20px;
        padding-right: 10px;
        /*flex: 1;*/
    }

    .time {
        flex-direction: row;
        align-items: center;

    }

    .timeSize {
        font-size: 30px;
        color: #999;
        flex: 1;
        text-align: center;
        padding-right: 10px;
    }

    .content_button {
        margin-top: 10px;
        margin-bottom: 20px;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
    }

    .agreeButton:active {
        background-color: #57aba5;
    }

    .cancelButton:active {
        background-color: #cc0000;
    }
    .tag{
        position: absolute;
        top: 10px;
        right: 10px;
    }
    .table_bottom{

        flex-direction: row;
        justify-content: space-around;
        position: fixed;
        left: 0;
        bottom: 0;
        right: 0;
        background-color: #fff;
        padding-top: 20px;
        padding-bottom: 20px;
        padding-left: 30px;
        padding-right: 30px;
        border-top-width: 2px;
        border-top-style: solid;
        border-top-color: #f8f8f8;

    }
    .editButton:active{
        background-color: #f1f1f1;
    }
    .activeColor {
        background-color:#53beb7 ;
        color: #fff;
    }

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

    .back {
        margin-left: 40px;
        flex: 1;
    }

    .backImg {
        width: 40px;
        height: 40px;
    }

    .appName {
        flex: 1;
    }

    .appNameCss {
        text-align: center;
        font-size: 40px;
        color: #fff;
    }

    .allSave {
        flex: 1;
        margin-right: 40px;

    }

    .allSaveCss {
        font-size: 35px;
        color: #fff;
        text-align: right;
    }

    .allSaveCss:active {
        color: #666;
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
    .closeBox{
        flex: 1;
        justify-content: center;
        align-items: center;
    }
</style>
