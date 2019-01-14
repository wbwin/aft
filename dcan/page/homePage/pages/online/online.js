Page({

	data: {
		phone: 'phone',
		know: 'know',
		userful: 'zanfood.png',
		Unuserful: 'zanfood.png',
		index: 8,
		content: [{ title: '菜品少送', content: '如果菜品没有按照您下单的数量送达，您可以联系商家进行补送。如不能解决，联系客服为您处理。' },

		{ title: '菜品送错了', content: '小毛驴建议您先联系商家，和商家沟通是否可以重新为您配送菜品，如果问题没有解决，请您点击左下角的【电话客服】，将有客服为您处理。' },

      { title: '我想申请退款', content: '您可以点击订单详情下方的【申请退款】进行退款，或者点击订单详情下方的【联系商家】和商家进行沟通。如您的订单已经完成超过24小时，则不显示下方的【申请退款】，请您点击下方的【电话客服】，联系客服为您处理。' },

		{ title: '菜品问题导致身体不适', content: '非常抱歉给您带来不好的用餐体验，小毛驴十分关注用户的食品安全问题，如果菜品质量有问题，请您点击左下角的【电话客服】，将有客服为您处理。' },

		{ title: '我要补开发票', content: '餐品发票是由商家开具的，建议您直接联系商家索要发票。' },

		{ title: '餐未到却显示已送达', content: '非常抱歉给您带来不好的消费体验,小毛驴建议您可以先联系商家，询问具体原因，如果问题没有解决，请您点击左下角的【电话客服】，将有客服替您进行沟通' },

		{ title: '菜品质量问题', content: '非常抱歉给您带来不好的用餐体验，小毛驴十分关注用户的食品安全问题，如果菜品质量有问题，建议您优先点击下方的【联系商家】和商家进行协商解决，如果问题没有解决，请您点击左下角的【电话客服】，将有客服为您处理。' },

		{ title: '菜品没有餐具', content: '非常抱歉给您带来不好的用餐体验，小毛驴建议您可以先联系商家，沟通是否可以重新为您配送餐具，如果问题没有解决，请您点击左下角的【电话客服】，将有客服替您进行沟通' },

		{ title: '如果修改评价', content: '暂不支持修改评价，可追加评价', img: 'https://image.aftdc.com/images/packageA/shopImg1.jpg' },

		{ title: '如何删除评价', content: '暂不支持删除评价', img: 'https://image.aftdc.com/images/packageA/shopImg1.jpg' },

      { title: '菜品量太少', content: '非常抱歉给您带来不好的体验，如果菜品量太少，小毛驴建议您可以先联系商家，并上传菜品的完整照片，如果问题没有解决，请您点击左下角的【电话客服】，将有客服替您进行沟通' },

		{ title: '联系不到商家', content: '您可以点击下方的【联系商家】，电话联系商家。在用餐高峰商家可能忙于制作菜品无法及时接听电话，建议您拨打电话后耐心等待商家接听' },

    { title: '菜品送错了', content: '非常抱歉给您带来不好的体验，小毛驴建议您可以先联系商家，并上传菜品的完整照片，如果问题没有解决，请您点击左下角的【电话客服】，将有客服替您进行沟通'},
		
		{ title: '如何评价', content: '您好，在阿凡提点餐客户端下单并进入我的订单页面点击“确认收货”后，可在待评价处进行评价', img: 'https://image.aftdc.com/images/packageA/shopImg1.jpg' }
		]
	},

	onLoad: function (options) {
		this.setData({ index: options.id })
	},

	clickgood: function () {
		this.setData({ userful: 'zhan.png', Unuserful: 'zanfood.png' })
	},
	clicknogood: function () {
		this.setData({ Unuserful: 'zhan.png', userful: 'zanfood.png' })
	},

	clickPhone: function () {
		wx.makePhoneCall({
			phoneNumber: '4008677791',
			success: function (res) {

			}
		})
	},

	clickKnow: function () {
		wx.navigateBack()
	},

	lianxiqishou: function () {
		wx.makePhoneCall({
			phoneNumber: '4008677791',
			success: function (res) {

			}
		})
	}
})