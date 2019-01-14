<template>
    <div class="wrapper" >
        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    @wxcMinibarRightButtonClicked="minibarRightButtonClick"
                    v-once>
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">选择商品标签</text>
                <text :style="GLOBAL.headerRight"  slot="right">保存</text>
            </wxc-minibar>
        </div>

        <div class="wholeClass row">
            <scroller class="scroller" show-scrollbar="false">
                <div class="oneClassItem row aiCenter" v-for="(item,index) in allClass" @click="classSelect(1,index)">
                    <div class="block" :class="[oneClassIndex===index?'activeBlock':'']"></div>
                    <text class="classText" :class="[oneClassIndex===index?'activeClassText':'']" :style="{fontSize:GLOBAL.defaultFS}">{{item.name}}</text>
                </div>
            </scroller>
            <scroller class="scroller"  show-scrollbar="false">
                <div class="oneClassItem row aiCenter" v-for="(item,index) in allClass[oneClassIndex].child" @click="classSelect(2,index)">
                    <div class="block" :class="[twoClassIndex===index?'activeBlock':'']"></div>
                    <text class="classText" :class="[twoClassIndex===index?'activeClassText':'']" :style="{fontSize:GLOBAL.defaultFS}">{{item.name}}</text>
                </div>
            </scroller>
            <scroller class="scroller"  show-scrollbar="false">
                <div v-if="allClass[oneClassIndex].child && allClass[oneClassIndex].child[twoClassIndex]">
                    <div class="oneClassItem row aiCenter" v-for="(item,index) in allClass[oneClassIndex].child[twoClassIndex].child"  @click="classSelect(3,index)">
                        <div class="block" :class="[threeClassIndex===index?'activeBlock':'']"></div>
                        <text class="classText" :class="[threeClassIndex===index?'activeClassText':'']" :style="{fontSize:GLOBAL.defaultFS}">{{item.name}}</text>
                    </div>
                </div>
            </scroller>
        </div>

    </div>

</template>

<script>
    import {WxcMinibar} from 'weex-ui';
    import Toast from './Toast.vue'
    const post = weex.requireModule('stream');
    const event = weex.requireModule('event');
    const navigator = weex.requireModule('navigator');
    const modal = weex.requireModule('modal');
    export default {
        components: {WxcMinibar, Toast},
        data() {
            return {
                oneClassIndex: 0,
                twoClassIndex: 0,
                threeClassIndex: 0,
                allClass: [],

                other: [

                ],
                boxIndex:'',

            }
        },
        created(){
            this.allClass = JSON.parse(event.find('classify'));
        },
        mounted(){
            var that=this
            var param  = weex.config.param ;
            if(param){

                that.boxIndex=JSON.parse(param).boxIndex
                that.oneClassIndex=JSON.parse(param).oneClassIndex
                that.twoClassIndex=JSON.parse(param).twoClassIndex
                that.threeClassIndex=JSON.parse(param).threeClassIndex


            }
        },
        methods: {
            minibarLeftButtonClick(){

            },
            //保存
            minibarRightButtonClick(){

                var brandLabel = this.allClass[this.oneClassIndex].name
                var id=this.allClass[this.oneClassIndex].id
                if(typeof(this.allClass[this.oneClassIndex].child[this.twoClassIndex])!=='undefined'){
                    brandLabel += ('-'+this.allClass[this.oneClassIndex].child[this.twoClassIndex].name)
                    id=this.allClass[this.oneClassIndex].child[this.twoClassIndex].id
                }
                if(typeof(this.allClass[this.oneClassIndex].child[this.twoClassIndex])!=='undefined'&&typeof(this.allClass[this.oneClassIndex].child[this.twoClassIndex].child[this.threeClassIndex])!=='undefined'){
                    brandLabel += ('-'+this.allClass[this.oneClassIndex].child[this.twoClassIndex].child[this.threeClassIndex].name)
                    id=this.allClass[this.oneClassIndex].child[this.twoClassIndex].child[this.threeClassIndex].id
                }
                var param = {id:id,brandLabel:brandLabel,boxIndex:this.boxIndex,oneClassIndex:this.oneClassIndex,twoClassIndex:this.twoClassIndex,threeClassIndex:this.threeClassIndex}
                param=JSON.stringify(param)

                event.save('goodsLabel',param);
                navigator.pop({ animated: 'true' });
                console.log(alreadyChosen)


            },
            classSelect(level,index){
                if(level === 1){
                    this.oneClassIndex = index
                    this.twoClassIndex = 0
                    this.threeClassIndex = 0
                }else if(level === 2){
                    this.twoClassIndex = index
                    this.threeClassIndex = 0
                }else if(level === 3){
                    this.threeClassIndex = index
                }
            }
        }
    }
</script>

<style scoped>

    .wrapper {
        flex-direction: column;
    }

    .minibar {
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: #f1f1f1;
    }
    .aiCenter {
        align-items: center;
    }
    .row {
        flex-direction: row;
    }
    .wholeClass {
        flex: 1;
    }
    .scroller {
        flex: 1;
        border-right-width: 1px;
        border-right-style: solid;
        border-right-color: #f1f1f1;
    }
    .oneClassItem {
        padding-top: 38px;
        padding-bottom: 38px;
    }
    .block {
        width: 6px;
        height: 36px;
        background-color: #fff;
    }
    .classText {
        width: 220px;
        color: #666;
        line-height: 36px;
        padding-left: 18px;
    }
    .activeBlock {
        background-color: #53beb7;
    }
    .activeClassText {
        color: #53beb7;
    }



</style>
