<template>
    <div class="body-wxc">
        <image class="bodyImage" :src="img"></image>
        <text class="noOrder" :style="{fontSize:GLOBAL.bigFS,color:GLOBAL.dColor}">{{textOne}}</text>
        <text class="proposal" :style="{fontSize:GLOBAL.defaultFS,color:'#999'}">{{textTwo}}</text>
        <!--<text class="lookAround" :style="{fontSize:GLOBAL.smallFS,color:GLOBAL.tColor}">随便逛逛</text>-->
    </div>
</template>

<style scoped>
    .lookAround{
        margin-top: 30px;
        width: 200px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border-style: solid;
        border-width: 2px;
        border-color: #53beb7;
        border-radius: 10px;
    }
    .proposal{
        margin-top: 20px;
    }
    .noOrder{
        margin-top: 30px;
    }
    .bodyImage{
        width: 200px;
        height: 200px;
    }
    .body-wxc{
        flex: 1;
        align-items: center;
        justify-content: center;
        background-color: #f8f8f8;
    }


</style>

<script>
    const animation = weex.requireModule('animation');
    export default {
        data: () => ({

        }),
        props:['img','textOne','textTwo'],
        methods: {},
    }
</script>