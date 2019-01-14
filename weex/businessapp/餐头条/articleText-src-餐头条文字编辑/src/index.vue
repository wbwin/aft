<template>
    <div class="wrapper">
        <div class="minibar">
            <wxc-minibar
                    background-color="#53beb7"
                    text-color="#fff"
                    @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                    @wxcMinibarRightButtonClicked="minibarRightButtonClick"
                    v-once
            >
                <image :style="GLOBAL.headerImg" slot="left"
                       src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
                <text :style="GLOBAL.headerCenter" slot="middle">编辑文字</text>
                <text :style="GLOBAL.headerRight" slot="right">完成</text>
            </wxc-minibar>
        </div>


        <list class="textareaDiv">
            <textarea class="textarea" rows="100" :max-length="maxNum" @input="textareaInput" v-model="content.content"
                      :placeholder="'不能超过'+maxNum+'字'"></textarea>
        </list>

        <toast ref="toast"></toast>
    </div>

</template>

<script>
    import {WxcMinibar} from 'weex-ui';
    import Toast from './Toast.vue';

    const modal = weex.requireModule('modal');
    const event = weex.requireModule('event');
    const navigator = weex.requireModule('navigator');
    export default {
        components: {Toast, WxcMinibar},
        data() {
            return {
                content: '',
                maxNum:2000
            }
        },
        created() {
            // var that = this
            // var param = JSON.parse(weex.config.param);
            // that.content = param;
            // if (param.maxNum){
            //     this.maxNum = param.maxNum
            // }
        },
        methods: {
            minibarRightButtonClick() {
                var that = this
                var param = JSON.stringify(that.content)
                event.save('content', param);
                navigator.pop({animated: 'true'});
            },
            minibarLeftButtonClick() {

            },
            textareaInput(e) {
                var that = this
                if (that.text.length >= this.maxNum) {
                    var toast = that.$refs.toast
                    toast.editContent('已达到最大字数限制');
                }

            },
        },
    }
</script>

<style scoped>
    .wrapper {
        flex-direction: column;
    }

    .textarea {

        width: 750px;
        padding-top: 30px;
        padding-left: 30px;
        padding-right: 30px;
        padding-bottom: 30px;
        flex: 1;

    }

    .textareaDiv {
        flex: 1;
        padding-bottom: 50px;
    }

    .backImg {
        width: 40px;
        height: 40px;
    }


</style>
