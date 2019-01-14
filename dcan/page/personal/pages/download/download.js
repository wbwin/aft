Page({

  data: {
	  down:false,
	  progress:0
  },

  onReady: function () {
		var system = wx.getStorageSync('system')
		if (system == 'ios') {
			this.setData({
				url:'https://image.aftdc.com/settle/798/1522139373562517wcsq.png'
			})
		}else{
			this.setData({
				url: 'https://image.aftdc.com/settle/798/1522139373376729uzkb.png'
			})
		}
  },
  download:function(){
	  var url = this.data.url
	  this.setData({
		  down: true
	  })
	  const downloadTask=wx.downloadFile({
		  url: url, 
		  success: function (res) {
			  if (res.statusCode === 200) {
				  console.log(res)
			  }
		  }
	  })
	  var that = this
	  downloadTask.onProgressUpdate((res) => {
		  that.setData({
			  progress: res.progress
		  })
	  })
  },

})