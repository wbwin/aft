window.onload = function () {
    var app = new Vue({
        el: '.article',
        data:{
            text:'',
        },

        created(){
        },

        method:{

        },

        mounted(){

            var that=this;
            window.addEventListener('message', event => {

                that.text=event.data.message;

                // 清除二维码
                $("#qrcode").empty();


                jQuery('#qrcode').qrcode({
                    render:"canvas",
                    text:that.text,
                    width:'160',
                    height:'160',
                });
            })

        }
    })
}