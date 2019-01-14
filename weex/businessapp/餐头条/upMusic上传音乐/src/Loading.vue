<template>
    <div>
        <div class="loading" v-if="show"></div>
        <div class="loadingBack" v-if="show">
            <image class="loadingImg" src="https://image.aftdc.com/appBimg/ic_loading_gif.gif"></image>
            <text class="loadingText">{{loadingText}}</text>
        </div>
    </div>
</template>

<script>
    export default {

        data: () => ({
            show: false,
            loadingText:''
        }),

        methods: {
            showLoading(str){
                this.show = true
                this.loadingText = str
            },
            hidLoading(){
                this.show = false
            }
        }
    }
</script>

<style scoped>
    .loading{
        width: 750px;
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: #fff;
        z-index: 998;
    }
    .loadingBack{
        width: 750px;
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 999;
    }
    .loadingImg{
        width: 160px;
        height: 110px;
    }
    .loadingText{
        font-size: 30px;
        color: #333;
    }
</style>