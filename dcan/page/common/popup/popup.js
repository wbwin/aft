Component({
  properties: {
    // 属性值可以在组件使用时指定
    show: {
      type: Boolean,
      value: false //是否显示
    },
    title: {
      type: Boolean,
      value: true //是否显示标题
    },
    cancelBtn: {
      type: Boolean,
      value: true //是否显示取消按钮
    } ,
    width: {
      type: Number,
      value: 560 //面板的宽度
    },
    height: {
      type: Number,
      value: 250 //面板的高度
    },
    borderRadius: {
      type: Number,
      value: 0 //弹出的 border-radius
    },
    textDirection: {
      type: String,
      value: 'center' //内容文本方向
    },
    titleWeight: {
      type: String,
      value: 'bold' //标题字体粗细
    },
    contentTop: {
      type: String,
      value: 30 //content内容顶部距离
    },
    contentBottom: {
      type: String,
      value: 30 //content内容底部距离
    },
    titleText: {
      type: String,
      value: '标题' //内容标题
    },
    tips: {
      type: String,
      value: '提示内容' //提示内容
    },
    cancelText: {
      type: String,
      value: '取消' //取消按钮文本
    },
    confirmText: {
      type: String,
      value: '确定' //确定按钮文本
    },
  },
  data: {
    // 组件内部数据
  },
  methods: {
    // 自定义方法
    quitCollage() {
      this.triggerEvent('confirm')
    },
    closePopup() {
      this.triggerEvent('cancel')
    },
    preventBubbles() {
      
    }
  }
})