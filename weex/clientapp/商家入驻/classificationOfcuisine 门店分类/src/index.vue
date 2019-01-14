<template>
    <div class="wrapper">
        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    v-once
            >
                <image :style="GLOBAL.headerImg" slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter" slot="middle">选择门店分类</text>
                <!--<text :style="GLOBAL.headerRight"  slot="right">帮助</text>-->
            </wxc-minibar>
        </div>
        <div>
            <text class="select" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">请必选一个主营分类，选填一个次营分类</text>
        </div>
        <div style="flex-direction: row">
            <text :class="[selectActive==0?'main':'mains']" :style="{fontSize:GLOBAL.bigFS,color:selectActive==0?GLOBAL.tColor:GLOBAL.dColor}" @click="mainClick">主营分类</text>
            <text :class="[selectActive==1?'camp':'camps']" :style="{fontSize:GLOBAL.bigFS,color:selectActive==1?GLOBAL.tColor:GLOBAL.dColor}" @click="campClick">次营分类</text>
        </div>
        <slider class="slider" infinite="false" :index="selectActive" @change="change">
            <list class="list">
                <cell>
                    <div v-for="(item,index) in cuisine" style="align-items: center">
                        <text class="special" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.name}}</text>
                        <div style="align-items: center">
                            <div style="flex-direction: row;width: 660px;flex-wrap: wrap; ">
                                <div v-for="(items,foodIndex) in item.child" style="margin: 10px;"
                                     @click="specialClick(items)">
                                    <text class="cuisune" :style="{fontSize:GLOBAL.defaultFS}" :class="[selectActive==0&&mainSpecial.id==items.id?'cuisunes':selectActive==0&&campSpecial.id==items.id?'cuisuned':selectActive==1&&mainSpecial.id==items.id?'cuisuned':selectActive==1&&campSpecial.id==items.id?'cuisunes':'']">{{items.name}}</text>
                                </div>
                            </div>
                        </div>
                    </div>
                </cell>
            </list>
            <list class="list">
                <cell>
                    <div v-for="(item,index) in cuisine">
                        <text class="special" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{item.name}}</text>
                        <div style="align-items: center">
                            <div style="flex-direction: row;width: 660px;flex-wrap: wrap; ">
                                <div v-for="(items,foodIndex) in item.child" style="margin: 10px;"
                                     @click="specialClick(items)">
                                    <text class="cuisune" :style="{fontSize:GLOBAL.defaultFS}" :class="[selectActive==0&&mainSpecial.id==items.id?'cuisunes':selectActive==0&&campSpecial.id==items.id?'cuisuned':selectActive==1&&mainSpecial.id==items.id?'cuisuned':selectActive==1&&campSpecial.id==items.id?'cuisunes':'']">{{items.name}}</text>
                                </div>
                            </div>
                        </div>
                    </div>
                </cell>
            </list>
        </slider>
        <div class=" classflyButton">

            <wxc-button class="sureButton" text="确定" :textStyle="GLOBAL.buttonText" :btnStyle="GLOBAL.defaultButton"
                        @wxcButtonClicked="sureClick()"></wxc-button>
        </div>
        <toast ref="toast"></toast>
    </div>
</template>

<script>
    import {WxcMinibar, WxcButton,} from 'weex-ui';
    import Toast from './Toast.vue'

    const event = weex.requireModule('event');
    const post = weex.requireModule('stream');
    const navigator = weex.requireModule('navigator');
    var modal = weex.requireModule('modal')
    export default {
        components: {WxcMinibar, WxcButton, Toast},
        data() {
            return {
                backImgToggle: 0,//头部返回图片判断
                selectActive: 0,//默认主营
                mainSpecial: '',//选择主营时选择的菜系的数据
                campSpecial: '',//选择次营时选择的菜系的数据
                sureBtnStyle: {
                    backgroundColor: '#53beb7',
                    width: '600',
                    borderColor: '#428a85',
                    borderWidth: '1px',
                    borderStyle: 'solid'
                },
                sureStyle: {
                    color: '#fff'
                },
                cuisine: []
            }
        },
        created() {
            // this.phone = JSON.parse(weex.config.param).phone;
            // this.token = JSON.parse(weex.config.param).token;
            var that = this;
            var param = 'phone=' + this.phone + '&token=' + this.token;
            post.fetch({
                method: 'post',
                type: 'json',
                body: param,
                url: 'https://www.aftdc.com/businessapp/Enter/sysCuisine',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
            }, function (res) {
                that.cuisine = res.data
            });
            var that = this
            var classiflyCation = JSON.parse(weex.config.param).classiflyCation
            if (classiflyCation) {
                that.mainSpecial = classiflyCation[0]
                if (classiflyCation[1]) {
                    that.campSpecial = classiflyCation[1]
                }
            }
        },
        methods: {
            minibarLeftButtonClick() {

            },
            mainClick: function () {  //主营
                var that = this
                this.selectActive = 0
            },
            campClick: function () {  //次营
                var that = this
                this.selectActive = 1
            },
            specialClick: function (items) {
                var that = this
                if (that.selectActive == 0) {//主营
                    if (that.campSpecial == items) {
                        return false
                    } else {
                        that.mainSpecial = JSON.parse(JSON.stringify(items));
                    }
                }
                if (that.selectActive == 1) {//次营
                    if (that.mainSpecial == items) {
                        return false
                    } else {
                        that.campSpecial = JSON.parse(JSON.stringify(items));
                    }
                }
            },
            change: function (event) {
                // console.log(event.index);
                this.selectActive = event.index;
            },
            sureClick() {
                var that = this
                const toast = that.$refs.toast;
                if (!that.mainSpecial) {
                    toast.editContent('必须选择一个主营分类')
                    return false;
                }
                var arr = [];
                arr.push(that.mainSpecial)
                if (that.campSpecial) {
                    arr.push(that.campSpecial)
                }

                var param = JSON.stringify(arr)
                event.save('classiflyCation', param);
                navigator.pop({animated: 'true'});
            }
        }
    }
</script>
<style scoped>
    /*****************/
    .wrapper {
        background-color: #f8f8f8;
    }

    .minibar {
    }

    .backImg {
        width: 40px;
        height: 40px;
    }

    .list {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 750px;
    }

    .select {
        padding-left: 20px;
        padding-right: 20px;
        padding-top: 35px;
        padding-bottom: 35px;
        background-color: rgba(153, 153, 153, 0.1);
    }

    .main {
        width: 375px;
        text-align: center;
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #53beb7;
        padding-top: 20px;
        padding-bottom: 20px;
    }

    .mains {
        width: 375px;
        text-align: center;
        padding-top: 20px;
        padding-bottom: 20px;
    }

    .camp {
        width: 375px;
        text-align: center;
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #53beb7;
        padding-top: 20px;
        padding-bottom: 20px;
    }

    .camps {
        width: 375px;
        text-align: center;
        padding-top: 20px;
        padding-bottom: 20px;
    }

    .special {
        padding-top: 20px;
        padding-left: 20px;
        padding-right: 20px;
        padding-bottom: 20px;
        width: 750px;

    }

    .cuisune {
        width: 199px;
        text-align: center;
        padding-top: 20px;
        padding-bottom: 20px;
        border-radius: 50px;
        border-width: 1px;
        border-style: solid;
        border-color: #999;
        color: #999;
    }

    .cuisunes {

        color: #fff;
        background-color: #53beb7;
    }

    .cuisuned {

        color: #fff;
        background-color: #c2c2c2;
    }

    .classflyButton {
        flex-direction: row;
        justify-content: space-around;
        background-color: #fff;
        border-top-width: 1px;
        border-top-style: solid;
        border-top-color: #dedede;
        padding-top: 20px;
        padding-bottom: 20px;
        padding-left: 30px;
        padding-right: 30px;
    }

    .sureButton:active {
        background-color: #57aba5;
    }

    .slider {
        width: 750px;
        flex: 1;
        background-color: #ffffff;
        transition: left 0.2s ease-in-out;
    }
</style>

