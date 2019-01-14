<template>
    <div class="wrapper" @viewappear="viewappear" @viewdisappear="viewdisappear">



        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    @wxcMinibarRightButtonClicked="minibarRightButtonClick"
                    :use-default-return="false"
                    v-once
            >
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">批量添加商品</text>
                <text :style="GLOBAL.headerRight"  slot="right">保存</text>
            </wxc-minibar>
        </div>

        <scroller class="scroller">

            <div class="addArticle" v-if="food" v-for="(item,index) in food" ref="addArticleCell">
                <!--<image class="icon_addArticle" src="https://image.aftdc.com/appBimg/icon_addArticle.png"-->
                <!--@click="addClick(index)" ref='addArticle'></image>-->
                <div class="addArticleCell">
                    <!--<div class="imgAText">-->
                    <div class="addImg" @click="changeImg(index)">
                        <image class="imgDefault contentImg" v-if="item.goodsImg==''"
                               src="https://image.aftdc.com/appBimg/icon_default.gif"></image>
                        <image class="imgDefault contentImg" resize="cover" v-else :src="item.goodsImg"></image>
                        <text class="addImgText">修改图片</text>
                        <text class="buttonBox" style="width: 150px;margin-top:10px" @click="pick(index)" :style="{color:classify[index]==''?error?'#f00':'#999':'#333'}" >{{!classify[index]?'分类':classify[index]}}</text>
                        <text  class="signaButtonBox" :class="[item.specialty==1?'signaButtonBoxTrue':'']" @click="signatureClick(index)" style="width: 150px;margin-top: 10px">招牌</text>

                        <!--<text :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor}">元</text>-->

                    </div>
                    <div class="fontText">
                        <div style="flex-direction: row;align-items: center;justify-content: space-between">
                            <input class="contentTextarea" :style="GLOBAL.inputText"   maxlength="20" :class="[error&&item.goodsName===''?'red':'gray']"  v-model="item.goodsName"  placeholder="商品名称(限20字以内)"/>
                            <div class="articCellButton">

                                <wxc-icon name="close" :icon-style="iconStyle" @wxcIconClicked="delArtice(index)"></wxc-icon>
                            </div>
                        </div>
                        <div class="fontTextDiv">
                            <div class="inputBox">
                                <input :style="GLOBAL.inputText" :class="[error&&item.shopPrice===''?'red':'gray']" class="smallInput" type="number" style="width: 165px"  v-model="item.shopPrice" placeholder="价格(元)"/>
                            </div>
                            <div class="inputBox">
                                <input :style="GLOBAL.inputText" :class="[error&&item.boxFee===''?'red':'gray']" class="smallInput" type="number" style="width: 165px"  v-model="item.boxFee" placeholder="餐盒费(元)"/>
                            </div>
                            <div class="inputBox">
                                <input :style="GLOBAL.inputText" :class="[error&&item.goodsUnit===''?'red':'gray']" class="smallInput" type="text" style="width: 165px"  v-model="item.goodsUnit" placeholder="单位(份)"/>
                            </div>
                        </div>

                        <div class="fontTextDiv">
                            <div class="inputBox"  style="flex: 1;margin-right: 10px">
                                <input :style="GLOBAL.inputText" class="smallInput gray" type="number" style="flex: 1"  v-model="item.buyMininum" placeholder="最少购买量(默认1)"/>
                            </div>
                            <div class="inputBox" style="flex: 1;margin-left: 10px" @click="toSelectClass(index)">
                                <text class="buttonBox" style="flex: 1"  :style="{color:item.brandLabel==''?error?'#f00':'#999':'#333'}">{{item.brandLabel==''?'商品标签':item.brandLabel}}</text>
                            </div>

                        </div>
                        <div class="fontTextDiv">
                            <textarea class="foodDetail" v-model="item.goodsDesc"  rows="2" maxlength="30"  placeholder="商品描述(最多输入30个字符)" :style="{fontSize:GLOBAL.defaultFS,color:GLOBAL.dColor,placeholderColor:'#999'}"></textarea>


                        </div>
                    </div>

                </div>
            </div>
            <!--<div class="addArticle">-->
            <!--<image class="icon_addArticle" src="https://image.aftdc.com/appBimg/icon_addArticle.png"-->
            <!--@click="addClick()" ref='addArticle'></image>-->
            <!--</div>-->
        </scroller>
        <toast ref="toast"></toast>

        <!--退出提示框-->
        <wxc-mask height="230"
                  width="600"
                  border-radius="10"
                  duration="200"
                  mask-bg-color="#FFFFFF"
                  :has-animation="hasAnimation"
                  :has-overlay="true"
                  :show="backShow"
                  @wxcMaskSetHidden="wxcMaskSetHidden">
            <div class="contentBack">
                <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">是否退出编辑</text>
                <div class="row">
                    <text style="flex: 1"></text>
                    <text class="cancelText" :style="{fontSize:GLOBAL.bigFS,color:'#999'}" @click="backClick(1)">否</text>
                    <text class="cancelText" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.tColor}" @click="backClick(2)">是</text>
                </div>
            </div>
        </wxc-mask>
    </div>
</template>

<script>

    import {WxcDialog, WxcButton, WxcIcon, WxcMask, WxcMinibar} from 'weex-ui';
    import Toast from './Toast.vue';
    import {WxcPopover} from 'weex-ui';
    const post = weex.requireModule('stream');
    const modal = weex.requireModule('modal');
    const animation = weex.requireModule('animation');
    const event = weex.requireModule('event');
    const navigator = weex.requireModule('navigator');
    const picker = weex.requireModule('picker');
    export default {
        components: {WxcButton, WxcDialog, Toast, WxcPopover, WxcIcon, WxcMask, WxcMinibar},
        data() {
            return {
                backImgToggle: 0,//头部返回图片判断
                backShow: false,
                iconStyle: {
                    fontSize: '35px',
                },
                top: 0,
                textStyle: {
                    color: '#fff'
                },

                indexNum:0,//保存,选择分类时的

                food: [],//文章个数，，默认一个且为空
                classify:[],//分类名称,每添加一个商品都要push一个’‘
                index: [],//分类下标默认第一个为0，每添加一个商品都要push一个0
                cats:[],
                // addButton:true,//控制是否还可以添加文章，当article长度为9时不能，当articleType=3且article长度为1时不能
                pageBack: false,
                ok:1,
                boxLength:'',//还能加入的招牌菜品个数
                error:false,//未填写完整时控制样式
                token:'',
                imei:'',
                oneClassIndex:0,
                twoClassIndex:0,
                threeClassIndex:0,
                uploadNum:0,
                clickSave:false
            }
        },
        created() {
            var that=this
            that.token = weex.config.token;
            that.imei = weex.config.imei;

            event.init();
            weex.requireModule('globalEvent').addEventListener("upLoadFile",function(e){
                if (e.upLoad == 1){
                    that.updata(e)
                }
            });

            //获取商品分类，商品标签，招牌个数
            var param = this.GLOBAL.sign(that.token,that.imei);
            post.fetch({
                method: 'post',
                type: 'json',
                body: param,
                url: 'https://www.aftdc.com/businessapp/Enrol/goodsInfo',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
            },function(res){
                if (res.data.res == 1){
                    that.cats= res.data.cats;
                    event.save('classify',JSON.stringify(res.data.classify));
                    that.boxLength=15-res.data.specialtyNum;
                }
            })

            var imageList = event.find('imageList');
            if (imageList) {
                var food = this.food
                imageList = JSON.parse(imageList);
                for (var i = 0;i< imageList.length;i++){
                    var obj = {goodsImg: '', goodsName: '',shopPrice:'',boxFee:'',goodsUnit:'份',goodsDesc:'',buyMininum:'',specialty:0,labelId:'',brandLabel:'',shopCatId2:''}
                    obj.goodsImg = imageList[i].imagePath
                    food.push(obj)
                    that.classify.push('')
                    that.index.push(0)
                }
                that.food=food
                event.delete('imageList')
            }
        },
        methods: {
            showTips() {
                var that = this;
                that.show = true;
            },
            wxcSureButtonClicked() {
                var that = this
                that.show = false
            },
            wxcMaskSetHidden() {
                var that = this
                that.backShow = false
            },

            backClick(index){
                if(index===1){
                    this.backShow=false;
                }
                else{
                    this.backShow=false;
                    navigator.pop({ animated: 'true' });
                }
            },
            delArtice(index) {
                var that = this;
                modal.confirm({
                    message: '确定删除该商品',
                    okTitle: '确定',
                    cancelTitle: '取消'
                }, result => {
                    if (result == '确定') {
                        var obj = that.$refs.addArticleCell[index]
                        animation.transition(obj, {
                            styles: {
                                transform: 'translate(750px,0px)',
                            },
                            duration: 300, //ms
                            timingFunction: 'ease',
                            delay: 0 //ms
                        }, function () {
                            var obj = that.$refs.addArticleCell[index]
                            animation.transition(obj, {
                                styles: {
                                    transform: 'translate(0px,0px)',
                                },
                                duration: 0, //ms
                                timingFunction: 'ease',
                                delay: 0 //ms
                            },function () {

                            })
                            that.food.splice(index, 1)
                        })
                    }
                })
            },
            minibarRightButtonClick() {
                if (this.clickSave)
                    return false;

                var food = this.food
                var that = this;

                for(var i = 0;i< food.length;i++){
                    if(!food[i].goodsName||!food[i].shopPrice||!food[i].boxFee||!food[i].goodsUnit){
                        const toast = that.$refs.toast;
                        toast.editContent('请填写完整');
                        that.error=true
                        return false
                    }
                    if(!food[i].shopCatId2){
                        const toast = that.$refs.toast;
                        toast.editContent('未选择分类');
                        that.error=true
                        return false
                    }
                    if(!food[i].brandLabel){
                        const toast = that.$refs.toast;
                        toast.editContent('未选择商品标签');
                        that.error=true
                        return false
                    }


                    // 给最少购买量赋值
                    if(!food[i].buyMininum){
                        this.food[i].buyMininum=1
                    }
                }

                var param = this.GLOBAL.sign(this.token,this.imei);
                event.showLoading();
                post.fetch({
                    method: 'post',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/businessapp/Goods/uploadOss',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                },function(res){
                    var waterMarkStr = '阿凡提点餐@'+event.find('shopName');
                    for (var i in food) {
                        var houzui = food[i].goodsImg.substring(food[i].goodsImg.lastIndexOf("."), food[i].goodsImg.length); //后缀
                        var foodImg = 'shops/'+event.find('shopId')+'/goodsImg/'+Date.parse(new Date())/1000+parseInt(Math.random()*10000+1)+ houzui;
                        food[i].foodImg = foodImg;
                        event.uploadImg(res.data.AccessKeyId,res.data.AccessKeySecret,res.data.SecurityToken,foodImg,food[i].goodsImg,waterMarkStr);
                    }
                });
            },
            //判断是否全部上传完毕
            updata(data){
                this.uploadNum ++;
                if (this.uploadNum == this.food.length){
                    var food = this.food
                    for (var i in food){
                        food[i].goodsImg = food[i].foodImg
                        delete food[i].foodImg
                    }

                    var param = this.GLOBAL.sign(this.token,this.imei);
                    param += '&goodsData='+JSON.stringify(food)
                    console.log(param)
                    var that = this
                    post.fetch({
                        method: 'post',
                        type: 'json',
                        body: param,
                        url: 'https://www.aftdc.com/businessapp/Enrol/addGoods',
                        headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    },function(res){event.hidLoading();
                        const toast = that.$refs.toast;
                        if (res.data.res == 1){
                            toast.editContent('已上传完毕');
                            event.save('changeGoodsManage',1);//标记商品管理改变
                            setTimeout(()=>navigator.pop({ animated: 'true' }),2000);
                        } else {
                            that.clickSave = false
                            toast.editContent(res.data.info);
                        }
                    });
                }
            },
            minibarLeftButtonClick() {
                var that=this;
                that.backShow=true;
            },
            changeImg(index){
                this.articleIndex = index;
                event.chooseImg(4,3);
            },
            //监听页面返回
            viewdisappear() {
                let self = this;
                self.pageBack = true;
            },
            viewappear() {
                var that=this
                if (!that.pageBack) { return; }
                that.pageBack = false;
                if(event.find("goodsLabel")){
                    var goodsLabel=JSON.parse(event.find("goodsLabel"))
                    var boxIndex=goodsLabel.boxIndex
                    that.food[boxIndex].brandLabel=goodsLabel.brandLabel
                    that.food[boxIndex].labelId=goodsLabel.id
                    that.oneClassIndex=goodsLabel.oneClassIndex
                    that.twoClassIndex=goodsLabel.twoClassIndex
                    that.threeClassIndex=goodsLabel.threeClassIndex
                    event.delete("goodsLabel");
                }

                // if (event.find("localImg")) {
                //     var index=this.articleIndex;
                //     var localPart = event.find("localImg");
                //     var articleImg = 'shops/'+event.find('shopId')+'/articleImg/'+Date.parse(new Date())+'.jpg';
                //     this.food[index].localPart = localPart;
                //     this.food[index].articleImg = articleImg;
                //     this.uploadImg(articleImg,localPart);
                //     event.delete("localImg");
                // }
            },
            //上传图片
            uploadImg(articleImg,localPart){
                var that = this;
                var param = this.GLOBAL.sign(this.token,this.imei);
                post.fetch({
                    method: 'post',
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/businessapp/Goods/uploadOss',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                },function(res){
                    var waterMarkStr = event.find('shopName');
                    event.uploadImg(res.data.AccessKeyId,res.data.AccessKeySecret,res.data.SecurityToken,articleImg,localPart,waterMarkStr);
                })
            },

            signatureClick(index){
                var that=this
                var specialtyCount=0

                if(that.food[index].specialty==0){
                    for(var i in that.food){
                        if(that.food.specialty==1){
                            specialtyCount++
                        }
                    }
                    if(Number(specialtyCount)>=Number(that.boxLength)){
                        const toast = that.$refs.toast;
                        toast.editContent('商店招牌菜品已达上限');
                        return false
                    }
                    that.food[index].specialty=1
                }else{
                    that.food[index].specialty=0
                }

            },
            pick(index) {
                var that=this;
                var cats = this.cats;
                var catName = [];
                var catId = [];
                for (var i = 0;i<cats.length;i++){
                    catName.push(cats[i]['catName'])
                    catId.push(cats[i]['catId'])
                }
                if(!that.classify[index]){
                    that.index[index]=that.indexNum
                }
                picker.pick({
                    index: that.index[index],//判断如果该选项的分类已经选择过,那么将不给予智能选择
                    items: catName,
                    confirmTitle:'确认',
                    cancelTitle:'取消',
                }, event => {
                    if (event.result === 'success') {
                        that.$set(that.classify,index,catName[event.data])
                        that.food[index].shopCatId2 = catId[event.data];
                        that.index[index] = event.data;
                        that.indexNum = event.data;
                        // modal.toast({
                        //     message:that.classify
                        // })
                        // for(var i=0;i++; i<that.index.length){
                        //     if(!that.classify[i]){
                        //         that.$set(that.index,i,2)
                        //     }
                        // }
                        // setTimeout(function () {
                        // },150)

                    }
                })
            },
            toSelectClass(index){
                var that=this
                var param={boxIndex:index,oneClassIndex:that.oneClassIndex,twoClassIndex:that.twoClassIndex,threeClassIndex:that.threeClassIndex}
                param=JSON.stringify(param)
                var url='http://assets/selectClass.js'
                event.toUrl({"url":url,"param":param})
            }
        },
    }
</script>

<style scoped>
    .minibar {
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: #f1f1f1;
    }
    .wrapper {
        flex-direction: column;
        background-color: #eff3f6;
    }



    .scroller {
        position: absolute;
        top: 90px;
        left: 0;
        right: 0;
        bottom: 0;
    }


    .changeCoverImg {
        flex-direction: row;
        align-items: center;
        justify-content: center;
        position: absolute;
        right: 0;
        bottom: 50px;
        background-color: rgba(0, 0, 0, 0.5);
        padding-left: 25px;
        padding-right: 20px;
        padding-top: 10px;
        padding-bottom: 10px;
        border-top-left-radius: 50px;
        border-bottom-left-radius: 50px;
    }

    .changeCoverImg:active {
        background-color: rgba(186, 186, 186, 0.5);
    }

    .icon_pictureImg {
        width: 35px;
        height: 35px;
    }

    .coverImgText {
        color: #fff;
        margin-left: 15px;
        font-size: 26px;
    }

    .addArticle {
        flex-direction: column;
        align-items: center;
        position: relative;
        margin-top: 20px;
        /*margin-bottom: 20px;*/
        /*height: 300px;*/
        /*background-color: #666;*/
        transform: scale(1);
    }

    .icon_addArticle {
        width: 65px;
        height: 65px;

    }

    .bubbleMenu {
        position: absolute;
        width: 390px;
        height: 150px;
        /*background-color: #999;*/
        top: 65px;
        flex-direction: column;
        align-items: center;
        left: 180px;
        overflow: hidden;
        transform: scale(1);
    }

    .triangle {
        width: 20px;
        height: 20px;
        background-color: #fff;
        transform: rotate(45deg);
        margin-top: 10px;
    }

    .bubbleMenuContent {
        /*width: 200px;*/
        /*height: 75px;*/
        background-color: #fff;
        border-radius: 20px;
        position: absolute;
        top: 20px;
        left: 5px;
        flex-direction: row;
        justify-content: space-around;
        padding-top: 15px;
        padding-bottom: 15px;
        padding-left: 25px;
        padding-right: 25px;

    }

    .menuContent {
        flex-direction: column;
        justify-content: center;
        padding-left: 10px;
        padding-right: 10px;
        padding-top: 10px;
        padding-bottom: 10px;
        margin-left: 20px;
        margin-right: 20px;
        border-radius: 10px;
    }

    .menuContent:active {
        background-color: #a1a1a1;
    }

    .imgDefault {
        width: 50px;
        height: 50px;
    }

    .menuContentText {
        font-size: 26px;
    }

    .addArticleCell {
        width: 750px;
        flex-direction: row;
        /*justify-content: space-between;*/
        padding-top: 30px;
        padding-right: 20px;
        padding-bottom: 30px;
        padding-left: 20px;
        background-color: #ffffff;
        margin-top: 15px;

    }

    .imgAText {
        flex-direction: row;
    }

    .addImg {
        flex-direction: column;
        justify-content: center;
        position: relative;
    }

    .contentImg {
        width: 150px;
        height: 125px;
    }

    .videoPlay {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        height: 125px;
        width: 150px;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-color: rgba(102, 102, 102, 0.3);
    }

    .videoPlayImg {
        width: 110px;
        height: 110px;
    }

    .addImgText {
        padding-top: 5px;
        padding-bottom: 5px;
        width: 150px;
        text-align: center;
        font-size: 22px;
        background-color: #adbbbb;
        color: #fff;
        /*height: 43px;*/
        /*flex: 5;*/
    }

    .fontText {
        flex: 15;
        padding-left: 20px;
        flex-direction: column;

    }
    .fontTextDiv{
        flex-direction: row;
        align-items: center;
        margin-top: 10px;
        justify-content: space-between;
    }
    .foodDetail{
        flex: 1;
        padding-top: 20px;
        padding-left: 20px;
        padding-right: 20px;
        padding-bottom: 20px;
        border-width: 1px;
        border-style: solid;
        border-color: #53beb7;
        border-radius: 10px;

    }
    .inputBox{
        flex-direction: row;
        align-items: center;
        /*margin-right: 10px;*/
    }
    .buttonBox{
        padding-top: 20px;
        padding-bottom: 20px;
        font-size: 26px;
        color: #999;
        border-width: 1px;
        border-style: solid;
        border-color: #53beb7;
        border-radius: 10px;
        text-align: center;
        flex-direction: row;
        text-overflow: ellipsis;
        lines:1;
        padding-left: 10px;
        padding-right: 10px;
    }
    .signaButtonBox{
        padding-top: 20px;
        padding-bottom: 20px;
        font-size: 26px;
        color: #999;
        border-width: 1px;
        border-style: solid;
        border-color: #53beb7;
        border-radius: 10px;
        text-align: center;
    }
    .signaButtonBoxTrue{
        background-color: #53beb7;
        color: #fff;
    }
    .smallInput{
        /*width: 150px;*/
        text-align: center;
        /*margin-right: 10px;*/
    }
    .red{
        placeholder-color:#f00
    }
    .gray{
        placeholder-color:#999
    }
    .articCellButton {
        margin-left: 15px;
        flex: 1;
    }





    .content {
        background-color: #fff;
        border-radius: 10px;
        padding-top: 30px;
        padding-right: 30px;
        padding-bottom: 30px;
        padding-left: 30px;
    }

    .mask_content {
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        margin-top: 20px;
        margin-bottom: 20px;
    }

    .mask_contentText {
        width: 540px;
        color: #666;
    }

    .maskTitle{
        height: 100px;
        line-height: 100px;
        text-align: center;
        background-color: #fff;
    }

    .maskTitleSize {
    }

    .sureButton {
        margin-top: 30px;
    }

    .sureButton:active {
        background-color: #57aba5;
    }
    .contentTextarea{
        /*padding-top: 5px;*/
        /*padding-right: 5px;*/
        /*padding-bottom: 5px;*/
        /*padding-left: 5px;*/
        width: 490px;
        /*height: 170px;*/
    }
    .row{
        flex-direction: row;
        align-items: center;
    }
    .cancelText{
        padding-left: 30px;
        padding-right: 30px;
        padding-top: 20px;
        padding-bottom: 30px;
    }
    .contentBack{
        height: 230px;
        width: 600px;
        padding-left: 30px;
        padding-top: 60px;
        padding-right: 20px;
        justify-content: space-between;
    }

    /*****************/

    .backImg {
        width: 40px;
        height: 40px;
    }

    /***********************/
</style>
