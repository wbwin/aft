<template>
    <div class="wrapper">
        <!--<div class="minibar">-->
        <!--<wxc-minibar-->
        <!--background-color="#53beb7"-->
        <!--text-color="#fff"-->
        <!--@wxcMinibarLeftButtonClicked="minibarLeftButtonClick"-->

        <!--&gt;-->
        <!--<image class="backImg" slot="left"-->
        <!--src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>-->
        <!--<text style="font-size: 40px;color: #fff" slot="middle">投票设置</text>-->

        <!--</wxc-minibar>-->
        <!--</div>-->

        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    v-once
            >
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">投票设置</text>
            </wxc-minibar>
        </div>

        <scroller class="scroller">
            <div class="describe" v-if="!inArticle">
                <div class="voteDescribeEspecially">
                    <text class="voteDescribeTitle voteDescribeTitleSize" :style="{fontSize:GLOBAL.bigFS}">文章标题</text>
                    <input class="voteDescribeInput" v-model="articleTitle" type="text" placeholder="输入文章标题" :style="GLOBAL.inputText" @focus="focus" @blur="blur">
                </div>
            </div>

            <div class="describe">
                <div class="voteDescribe">
                    <text class="voteDescribeTitle voteDescribeTitleSize" :style="{fontSize:GLOBAL.bigFS}">投票描述</text>
                    <input class="voteDescribeInput" v-model="voteTopic" type="text" placeholder="输入投票主题"  :style="GLOBAL.inputText" @focus="focus" @blur="blur">
                </div>

                <div class="voteDescribe" v-for="(item,index) in inputList" :key="index">

                    <div class="iconDiv">
                        <div class="iconDiv" @click="close(index)" v-if="index>=2">
                            <image class="iconTwo" src="https://image.aftdc.com/appBimg/icon_close.png"></image>
                        </div>
                    </div>

                    <input class="voteDescribeInputTwo" type="text"  v-model="item.value" :placeholder="'选项'+(index+1)" :style="GLOBAL.inputText" @focus="focus" @blur="blur">

                </div>

                <div class="voteDescribeEspecially" @click="addOne">
                    <text class="addOption" :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.tColor}">+ 添加选项</text>
                </div>
            </div>

            <div class="describe voteType">
                <!--<div class="voteDescribe">-->
                    <!--<text class="voteDescribeTitle voteDescribeTitleSize" :style="{fontSize:GLOBAL.bigFS}">截止时间</text>-->
                    <!--<div class="time">-->
                        <!--&lt;!&ndash;或无截止时间&ndash;&gt;-->
                        <!--<text class="timeOne" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">2018-06-09</text>-->
                        <!--<text  :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">00:00</text>-->
                    <!--</div>-->
                <!--</div>-->

                <div class="voteDescribeEspecially">
                    <text class="voteDescribeTitle  voteDescribeTitleSize" :style="{fontSize:GLOBAL.bigFS}">投票类型</text>
                    <div class="time" @click="selectClick">
                        <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{selectValue}}</text>
                    </div>
                </div>
            </div>
        </scroller>
        <div class=" voteButton" v-if="btn">

            <wxc-button class="nextButton" text="下一步" :textStyle="GLOBAL.buttonText" :btnStyle="GLOBAL.defaultButton"
                        @wxcButtonClicked="nextClick()"></wxc-button>
        </div>
        <toast ref="toast"></toast>
    </div>
</template>

<script>
    const picker = weex.requireModule('picker');
    const event = weex.requireModule('event');
    const navigator = weex.requireModule('navigator');
    import { WxcMinibar,WxcButton} from 'weex-ui';
    import Toast from './Toast.vue';
    export default {
        components: {Toast,WxcMinibar,WxcButton},
        name: 'App',
        data () {
            return {
                btn:true,
                inputList:[
                    {value:'',},
                    {value:'',},
                    {value:'',},
                ],
                hideOne:true,
                selectValue:'单选(默认)',
                selectIndex:0,
                items:['单选(默认)','多选,无限制',],
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
                articleTitle:'',
                voteTopic:'',
                inArticle:false
            }
        },
        created() {
            var param = JSON.parse(weex.config.param);
            if (param&&param.inArticle == '1'){//文章尾部的投票
                this.inArticle = true
                console.log(weex.config.param)
            }
            if (param&&param.vote){
                this.inputList = param.vote.inputList
                this.articleTitle = param.vote.articleTitle
                this.voteTopic = param.vote.voteTopic
                var selectIndex = param.vote.type
                if(selectIndex==1){
                    this.selectIndex=0
                }else if(selectIndex==0){
                    this.selectIndex=1
                }else{
                    this.selectIndex=selectIndex
                }
                this.selectValue = this.items[this.selectIndex]
            }
        },
        methods:{
            focus(){
                this.btn=false;
            },
            blur(){
                this.btn=true;
            },
            close(index){
                var that=this
                that.inputList.splice(index,1);

                if(this.selectIndex==this.inputList.length){
                    this.selectIndex=this.inputList.length-1;
                    this.selectValue=this.items[this.inputList.length-1];
                }

            },
            addOne(){
                var value={value:''}
                this.inputList.push(value)
            },
            selectClick(){
                const toast=this.$refs.toast;
                for(var i in this.inputList){
                    if(this.inputList[i].value=='') {
                        toast.editContent('您有未填写的选项,请填写')
                        return false;
                    }
                };
                this.items=['单选(默认)','多选,无限制',]
                for(var i=0;i<this.inputList.length-2;i++){
                    this.items.push('多选,最多选'+ (2+i)+'个')
                }



                picker.pick({
                    index: this.selectIndex,
                    items:this.items,
                    confirmTitle:'确认',
                    cancelTitle:'取消',
                    confirmTitleColor:'#53beb7',
                    cancelTitleColor:'#999'
                }, event => {
                    if (event.result === 'success') {
                        this.selectValue = this.items[event.data]
                        this.selectIndex = event.data
                    }
                });
            },
            minibarLeftButtonClick(){

            },
            nextClick(){
                var that=this
                const toast=that.$refs.toast;
                var inputList=that.inputList;
                var articleTitle=that.articleTitle
                var voteTopic=that.voteTopic
                var selectIndex=''
                if(that.selectIndex==1){
                    selectIndex=0
                }else if(that.selectIndex==0){
                    selectIndex=1
                }else{
                    selectIndex=that.selectIndex
                }
                var type=selectIndex

                for(var i in inputList){
                    if(inputList[i].value==='') {
                        toast.editContent('您有未填写的选项,请填写')
                        return false;
                    }
                };
                if(articleTitle===''&&!this.inArticle){
                    toast.editContent('文章标题未填写,请填写')
                    return false;
                }
                if(voteTopic===''){
                    toast.editContent('投票主题未填写,请填写')
                    return false;
                }
                //type为1是单选，0是多选无限制，2是多选2个。。。以此类推
                var data={inputList:inputList,articleTitle:articleTitle,voteTopic:voteTopic,type:type}
                var param=JSON.stringify(data)
                event.save('vote',param);
                if (this.inArticle){
                    navigator.pop();
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

    .minibar {
        /*border-bottom-width: 2px;*/
        /*border-bottom-style: solid;*/
        /*border-bottom-color: #a1a1a1;*/
    }

    .backImg {
        width: 40px;
        height: 40px;
    }

    .describe{
        margin-left: 20px;
        margin-top: 20px;
        margin-bottom: 20px;
        margin-right: 20px;
        padding-left: 30px;
        padding-right: 30px;
        background-color: #fff;
        border-radius: 20px;
    }
    .voteType{
        padding-top: 15px;
        padding-bottom: 15px;
    }
    .voteDescribe{
        flex-direction: row;
        align-items: center;
        border-bottom-style: solid;
        border-bottom-width: 1px;
        border-bottom-color: #ccc;
        justify-content: center;
        padding-top: 20px;
        padding-bottom: 20px;
    }
    .vote{
    }
    .voteDescribeEspecially{
        flex-direction: row;
        align-items: center;
        justify-content: center;
        padding-top: 20px;
        padding-bottom: 20px;
    }
    .voteDescribeTitle {
        flex: 1;
    }
    .voteDescribeTitleSize{
        color: #ccc;
    }
    .voteDescribeInput{
        flex: 2.8;
        padding-top:10px;
        padding-bottom: 8px;
    }
    .imgSize{
        width: 50px;
        height: 50px;
    }
    .iconDiv{
        width: 158px;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }
    .icon{
        width: 45px;
        height: 45px;
    }
    .iconTwoSide{
        justify-content: center;
        align-items: center;
        height: 50px;
        width: 50px;
        text-align: right;
    }
    .iconTwo{
        width: 20px;
        height: 20px;
        color: #ccc;
    }
    .voteDescribeInputTwo{
        padding-top: 10px;
        padding-bottom: 8px;
        padding-right: 20px;
        flex: 1;
    }
    .addOption{
        flex: 1;
        text-align: center;
        align-items: center;
    }
    .time{
        flex-direction: row;
        align-items: center;
        flex: 2.4;
    }
    .timeSmallSize{
    }
    .timeOne{
        margin-right: 15px;
    }
    .voteButton{
        flex-direction: row;
        justify-content: space-around;
        background-color: #fff;
        border-top-width: 2px;
        border-top-style: solid;
        border-top-color: #f1f1f1;
        padding-top: 20px;
        padding-bottom: 20px;
        padding-left: 30px;
        padding-right: 30px;
    }
    .nextButton:active {
        background-color: #57aba5;
    }
    .scroller {
        flex: 1;
        width: 750px;
    }
</style>
