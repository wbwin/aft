//**分页**
// pageNumb:0,//总页数
// pageCurent:1,//当前页
	var pages=Vue.extend({
			template: `<div class="text-center" v-if="pageNumb>1">
									<ul class="paginations many-pagination">
										<li class="disabled" :class="[pageCurent==1?'disabledN':'disabledY']" @click="pageSub">
											<a>«</a>
										</li>

										 <li :class="{'active':pageCurent==index+1}" v-if=" showText(index+1)" v-for="(item,index) in pageNumb" @click="pageClick(index+1)">
                                            <a>{{showText(index+1)}}</a>
                                        </li>

										<li class="disabled" :class="[pageCurent==pageNumb?'disabledN':'disabledY']" @click="pageAdd">
											<a>»</a>
										</li>
									</ul>
									  <div>第<input type="text" id="goto" class="goto">/{{pageNumb}}页 <input type="button" style="width: 30px;" value="go" @click="pageGo()"></div>
								</div>`,
			  props: ['pageNumb','pageCurent'],
			data(){
				return {
					pageNumb:0,
					pageCurent:1,
				}
			},
			methods:{

		pageClick:function(index){
			this.pageCurent=index;
           this.$emit('pagefather',index)
		},
		pageSub:function(){
			if(this.pageCurent==1){
				return false
			}
			var index= this.pageCurent
			index=index-1
			this.pageClick(index)
		},
		pageAdd:function(){
			if(this.pageCurent==this.pageNumb){
				return false
			}
			var index= this.pageCurent
			index=index+1
			this.pageClick(index)
		},
                pageGo: function () {
                    var goNum = document.getElementById('goto').value;
                    this.pageCurent = Number(goNum)
                    var index= this.pageCurent
                    this.pageClick(index)
                },
                showText: function (index) {
                    var that = this

                    if (that.pageCurent < 5 && index < 10) {

                        return index
                    } else if (that.pageCurent >= 5 && index <= that.pageCurent + 4 && index >= that.pageCurent - 4 && that.pageCurent <= that.pageNumb - 4) {

                        return index
                    } else if (that.pageCurent > that.pageNumb - 5 && index > that.pageNumb - 9) {


                        return index
                    } else {
                        return false;
                    }

                },

	}
		});

Vue.component('pages',pages);