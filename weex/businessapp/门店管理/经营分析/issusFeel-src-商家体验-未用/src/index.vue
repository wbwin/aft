<template>
    <div class="wrapper">

        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    v-once>
                <image :style="GLOBAL.headerImg"  slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter"  slot="middle">商家体检</text>
            </wxc-minibar>
        </div>

        <div class="panelbox">
            <div class="bbSolid jcCenter">
                <text class="bold" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">情况分析</text>
            </div>
            <div class="boxPad">
                <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">近7天，您的店内共有1例催单，日均催单率为20%，比95.06%的同城商家高</text>
            </div>
        </div>
        <div class="panelbox">
            <div class="bbSolid jcCenter">
                <text class="bold" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">优化建议</text>
            </div>
            <div class="boxPad">
                <text :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">1.合理划分配送范围和评估好餐厅的能力，提高配送效力；2.如存在延迟，提前告知顾客并进行协商补救</text>
            </div>
        </div>
        <div class="aiCenter">
            <text class="gray" :style="{fontSize:GLOBAL.bigFS}">如需查看详细数据，请前往电脑端进行查询</text>
        </div>


    </div>

</template>

<script>
    import {WxcMinibar} from 'weex-ui';
    var stream = weex.requireModule('stream');

    export default {
        components: {WxcMinibar},
        data() {
            return {

            }
        },
        created(){

        },
        methods: {

            minibarLeftButtonClick() {

            }

        }
    }



</script>

<style scoped>

    .wrapper {
        position: relative;
        flex-direction: column;
        background-color: #efefef;
    }
    .minibar {
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: #f1f1f1;
    }
    .bold {
        font-weight: bold;
    }
    .aiCenter {
        align-items: center;
    }
    .jcCenter {
        justify-content: center;
    }
    .panelbox{
        background-color: #fff;
        margin-bottom: 20px;
    }
    .boxPad{
        padding-left: 24px;
        padding-right: 24px;
        padding-top: 26px;
        padding-bottom: 26px;
    }
    .bbSolid {
        height: 90px;
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #e0e0e0;
        padding-left: 24px;
    }
    .gray {
        color: #a0a0a0;
    }



</style>
