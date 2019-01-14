Page({

	data: {
		rids:[]
	},

	onReady: function () {

	},
	solve:function(){
		this.setData({
			issolve:'issolve',
			nosolve:''
		})
	},
	nosolve: function () {
		this.setData({
			issolve: '',
			nosolve: 'nosolve'
		})
	},
	choosed:function(e){
		var rid = e.currentTarget.dataset.rid
		var rids = this.data.rids
		var num = 0
		for (var i in rids){
			if (rids[i]!=''){
				num += 1
			}
		}
		if (num<2){
			rids[rid] = rid
			this.setData({
				rid: rids
			})
		}
	}
})