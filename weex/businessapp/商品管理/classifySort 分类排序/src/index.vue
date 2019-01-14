<template>
    <div>
        <wxc-minibar
                background-color="#53beb7"
                text-color="#fff"
                @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                @wxcMinibarRightButtonClicked="savecat"
                v-once>
            <image :style="GLOBAL.headerImg" slot="left"
                   src="https://image.aftdc.com/appBimg/icon_back_normal.png"></image>
            <text :style="GLOBAL.headerCenter" slot="middle">分类排序</text>
            <text :style="GLOBAL.headerRight" slot="right">保存</text>
        </wxc-minibar>
        <list class="scroller_content">
            <cell class="scroller_line" v-for="(item,index) in dataz" :class="[posi==false?'po':'']">
                <div style="flex: 1.5">
                    <div @click="delClick(index)">
                        <image class="img_default"
                               src="https://image.aftdc.com/appBimg/ic_list_item_delete.png"></image>
                    </div>
                </div>

                <div class="line_left">
                    <div class="foodsMsg">
                        <text  :style="{fontSize:GLOBAL.biggerFS,color:GLOBAL.dColor}">{{item.catName}}</text>
                        <text  :style="{fontSize:GLOBAL.bigFS,color:'#999'}" style="margin-top: 20px;">{{item.goodsNum}}个商品</text>
                    </div>
                </div>
                <div class="line_right">
                    <div>
                        <image class="img_default img_button_top" v-if="index!=0" @touchstart="touchTop(index)" @touchmove="touchmoveTop(index,'Top')"
                               @touchend="touchendTop(index)"
                               :src="item.touchTopImg==1?'https://image.aftdc.com/appBimg/ic_set_top_pressed.png':'https://image.aftdc.com/appBimg/ic_set_top_normal.png'"></image>
                    </div>
                    <div style="flex-direction: column;justify-content: space-between;">
                        <image class="img_default img_button" v-if="index!=0" style="margin-bottom: 10px"
                               @touchstart="touchUp(index)" @touchend="touchendUp(index)" @touchmove="touchmoveTop(index,'Up')"

                               :src="item.touchUpImg==1?'https://image.aftdc.com/appBimg/upArrow_fill.png':'https://image.aftdc.com/appBimg/upArrow.png'"></image>
                        <image class="img_default img_button" style="margin-top: 10px" v-if="index!=dataz.length-1"
                               @touchstart="touchDown(index)" @touchend="touchendDown(index)" @touchmove="touchmoveTop(index,'Down')"

                               :src="item.touchDownImg==1?'https://image.aftdc.com/appBimg/downArrow_fill.png':'https://image.aftdc.com/appBimg/downArrow.png'"></image>
                        <!--<image class="img_default img_button" @touchstart="touchMove(index)" @touchend="touchMove(index)"-->
                        <!--@longpress="LongPress($event)" @swipe="swipes($event)"-->
                        <!--:src="item.touchMoveImg==1?'https://image.aftdc.com/appBimg/ic_drag_pressed.png':'https://image.aftdc.com/appBimg/ic_drag_normal.png'"></image>-->
                    </div>
                </div>
            </cell>
        </list>
        <toast ref="toast"></toast>
    </div>
</template>

<script>
    import {WxcMinibar, WxcDialog,WxcButton} from 'weex-ui';
    import Toast from './Toast.vue'

    const modal = weex.requireModule('modal');
    const post = weex.requireModule('stream');
    const navigator = weex.requireModule('navigator');
    const event = weex.requireModule('event');
    export default {
        components: {WxcMinibar,WxcButton, WxcDialog, Toast},
        data() {
            return {
                allcheck: false,
                checkboxNum: [],//多选框选中下标
                posi: true,
                dataz: [],
                cat: [],
                token: '',
                imei: '',
                delCatId: ''
            }
        },
        created: function () {
            this.token = weex.config.token;
            this.imei = weex.config.imei;
            var that = this;
            var param = this.GLOBAL.sign(this.token, this.imei);
            post.fetch({
                method: "POST",
                type: 'json',
                body: param,
                url: 'https://www.aftdc.com/businessapp/Enrol/getShopCats',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
            }, function (res) {
                that.dataz = res.data.data[0].dishes;
            })
        },
        methods: {
            minibarLeftButtonClick(){

            },
            backClick() {
                navigator.pop({animated: 'true'});
            },
            touchTop(index) {
                this.$set(this.dataz[index], 'touchTopImg', 1)
            },
            touchUp(index) {
                this.$set(this.dataz[index], 'touchUpImg', 1)
            },
            touchDown(index) {
                this.$set(this.dataz[index], 'touchDownImg', 1)
            },


            touchmoveTop(index,type){
                this.$set(this.dataz[index], 'touch'+type+'Img', 0)
            },


            touchendTop(index) {
                this.$set(this.dataz[index], 'touchTopImg', 0)
                var datas = this.dataz[index]
                this.dataz.splice(index, 1);
                this.dataz.unshift(datas);
            },
            touchendUp(index) {
                this.$set(this.dataz[index], 'touchUpImg', 0)
                var datas = this.dataz
                var temp = datas[index - 1];
                datas[index - 1] = datas[index];
                datas[index] = temp
                this.dataz = datas;
            },
            touchendDown(index) {
                this.$set(this.dataz[index], 'touchDownImg', 0)
                var datas = this.dataz
                var temp = datas[index];
                datas[index] = datas[index + 1];
                datas[index + 1] = temp
                this.dataz = datas;
            },
            alltouchMove(index) {
                this.$set(this.dataz[index], 'touchTopImg', 0);
                this.$set(this.dataz[index], 'touchUpImg', 0);
                this.$set(this.dataz[index], 'touchDownImg', 0)
            },

            checkboxClick(index) {
                if (this.dataz[index]['checkbox'] == 1) {
                    this.$set(this.dataz[index], 'checkbox', 0)
                    for (var i = 0; i < this.checkboxNum.length; i++) {
                        if (this.checkboxNum[i] === index) {
                            this.checkboxNum.splice(i, 1);
                            break;
                        }
                    }
                } else {
                    this.$set(this.dataz[index], 'checkbox', 1)
                    this.checkboxNum.push(index)
                }
            },
            allcheckbox() {
                var that = this
                if (that.allcheck == false) {
                    that.allcheck = true
                    for (var i = 0; i < that.dataz.length; i++) {
                        that.$set(this.dataz[i], 'checkbox', 1)
                        that.checkboxNum.push(i)
                    }
                } else {
                    that.allcheck = false
                    for (var i = 0; i < that.dataz.length; i++) {
                        that.$set(this.dataz[i], 'checkbox', 0)
                    }
                    that.checkboxNum = [];
                }
            },
            delClick(index) {
                var that = this;
                if (this.dataz[index]['goodsNum'] > 0) {
                    const toast = that.$refs.toast;
                    toast.editContent('该分类有商品存在,不能删除');
                    return false;
                }
                var cat = that.cat;
                that.cat = cat.concat(that.dataz[index]);
                this.delCatId += this.dataz[index]['catId'] + ',';
                this.dataz.splice(index, 1);
            },
            savecat() {
                var dataz = this.dataz;
                for (var i in this.dataz) {
                    dataz[i]['catSort'] = i;
                    delete dataz[i]['catName'];
                    delete dataz[i]['distop'];
                    delete dataz[i]['type'];
                    delete dataz[i]['goodsNum'];
                    delete dataz[i]['touchTopImg'];
                    delete dataz[i]['touchUpImg'];
                    delete dataz[i]['touchDownImg'];
                }
                var delCatId = this.delCatId;
                var that = this;
                var param = this.GLOBAL.sign(this.token, this.imei);
                param += '&data=' + JSON.stringify(dataz);
                if (delCatId) {
                    param += '&delCatId=' + JSON.stringify(delCatId);
                }
                post.fetch({
                    method: "POST",
                    type: 'json',
                    body: param,
                    url: 'https://www.aftdc.com/businessapp/Goods/saveShopCats',
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                }, function (res) {
                    if (res.data.res == 1) {
                        event.save('changeGoodsManage', 1);//标记商品管理改变
                        const toast = that.$refs.toast;
                        toast.editContent('保存成功');
                        setTimeout(() => navigator.pop({animated: 'true'}), 2000);
                    } else {
                        const toast = that.$refs.toast;
                        toast.editContent('保存失败,请稍后再试');
                    }
                })
            }
        }
    }
</script>

<style scoped>

    .scroller_content {
        flex-direction: column;
        /*position: absolute;*/
        /*top: 90px;*/
        /*left: 0;*/
        /*right: 0;*/

    }

    /*.po{*/
    /*position: relative;*/
    /*}*/
    .scroller_line {
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        padding-top: 20px;
        padding-bottom: 20px;
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: #dedede;
        padding-left: 20px;
        padding-right: 20px;
    }

    .line_left {
        /*flex: 1;*/
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        flex: 10;
    }

    .line_right {
        /*flex: 1;*/
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        flex: 4;
    }

    .img_default {
        width: 38px;
        height: 38px;
    }

    .foodsMsg {
        flex-direction: column;
        justify-content: flex-start;

    }

    .img_button {
        width: 40px;
        height: 40px;
    }

    .img_button_top {
        width: 55px;
        height: 55px;
        margin-right: 30px;
    }

</style>
