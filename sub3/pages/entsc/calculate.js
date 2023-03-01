const app = getApp();
var encr = require('../../../utils/encrypt/encrypt'); //国密3段式加密
var aeskey = encr.key //随机数

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		cndUrl: app.globalData.CDNURL,
		number:0,
		accounta:'',
		accountb:'',
		remittancea:'',
		remittanceb:'',
		remittancec:'',
		remittanced:'',
		electronica:'',
		electronicb:'',
		electronicc:'',
		electronicd:'',
		paymenta:'',
		paymentb:'',
		carta:'',
		cartb:'',
		billa:'',
		billb:'',
		billc:'',
		billd:'',
		bille:'',
		billf:'',

		result_start:0,
		result_end:0,
		showInput:true,
		enterpriseScale:'',
		a:0,
		b:0,
		c:0,
		d:0,
		e:0,
		f:0,
		g:0,
		h:0,
		i:0,
		j:0,
		k:0,
		l:0,
		m:0,
		n:0,
		o:0,
		count:'',
		countOrder:'',
		showList:true
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		var aaa=getCurrentPages()
		var bbb=aaa.length-2
		var ccc=aaa[bbb]
		if(ccc.route==='sub3/pages/entsc/discountQuery'){
			this.setData({
				showList:false
			})
		}
		if(options.a=='1'){
			this.setData({
				a:options.a,
			})
		}else{
			this.setData({
				a:0
			})
		}
		if(options.b=='1'){
			this.setData({
				b:options.b,
			})
		}else{
			this.setData({
				b:0
			})
		}
		if(options.c=='1'){
			this.setData({
				c:options.c,
			})
		}else{
			this.setData({
				c:0
			})
		}
		if(options.d=='1'){
			this.setData({
				d:options.d,
			})
		}else{
			this.setData({
				d:0
			})
		}
		if(options.e=='1'){
			this.setData({
				e:options.e,
			})
		}else{
			this.setData({
				e:0
			})
		}
		if(options.f=='1'){
			this.setData({
				f:options.f,
			})
		}else{
			this.setData({
				f:0
			})
		}
		if(options.g=='1'){
			this.setData({
				g:options.g,
			})
		}else{
			this.setData({
				g:0
			})
		}
		if(options.h=='1'){
			this.setData({
				h:options.h,
			})
		}else{
			this.setData({
				h:0
			})
		}
		if(options.i=='1'){
			this.setData({
				i:options.i,
			})
		}else{
			this.setData({
				i:0
			})
		}
		if(options.j=='1'){
			this.setData({
				j:options.j,
			})
		}else{
			this.setData({
				j:0
			})
		}
		if(options.k=='1'){
			this.setData({
				k:options.k,
			})
		}else{
			this.setData({
				k:0
			})
		}
		if(options.l=='1'){
			this.setData({
				l:options.l,
			})
		}else{
			this.setData({
				l:0
			})
		}
		if(options.m=='1'){
			this.setData({
				m:options.m,
			})
		}else{
			this.setData({
				m:0
			})
		}
		if(options.n=='1'){
			this.setData({
				n:options.n,
			})
		}else{
			this.setData({
				n:0
			})
		}
		if(options.o=='1'){
			this.setData({
				o:options.o,
			})
		}else{
			this.setData({
				o:0
			})
		}
		this.setData({
			enterpriseScale:options.enterpriseScale,
		})
		var num=Number(this.data.a)+Number(this.data.b)+Number(this.data.c)+Number(this.data.d)+Number(this.data.e)+Number(this.data.f)+Number(this.data.g)+Number(this.data.h)+Number(this.data.i)+Number(this.data.j)+Number(this.data.k)+Number(this.data.l)+Number(this.data.m)+Number(this.data.n)+Number(this.data.o)
		this.setData({
			number: num
		})
		if(this.data.enterpriseScale==='大中型企业'){
			this.setData({
				showInput:false
			})
		}
	},

	backToSelect(){
		// var currentpage=getCurrentPages();
		// var currentpagelength=currentpage.length;
		// if(currentpagelength===3){
		// 	wx.navigateTo({
		// 		url: '/sub3/pages/entsc/discountQuery?enterpriseScale='+this.data.enterpriseScale,
		// 	})
		// }else if(currentpagelength>=10){
			wx.redirectTo({
				url: '/sub3/pages/entsc/discountQuery?enterpriseScale='+this.data.enterpriseScale,
			})
		// }
	},

	//银行账户
	bindAccountA(e){
		if(e.detail.value>0&&e.detail.value%1===0){
			this.setData({
				accounta:e.detail.value
			})
		}else{
			wx.showToast({
				title: '请输入正整数户数',
				icon:'none'
			})
			this.setData({
				accounta:''
			})
		}
	},

	bindAccountB(e){
		if(e.detail.value>0&&e.detail.value%1===0){
			this.setData({
				accountb:e.detail.value
			})
		}else{
			wx.showToast({
				title: '请输入正整数户数',
				icon:'none'
			})
			this.setData({
				accountb:''
			})
		}
	},

	//人民币转账汇款
	bindRemittanceA(e){
		if(e.detail.value>0&&e.detail.value%1===0){
			this.setData({
				remittancea:e.detail.value
			})
		}else{
			wx.showToast({
				title: '请输入正整数笔数',
				icon:'none'
			})
			this.setData({
				remittancea:''
			})
		}
	},

	bindRemittanceB(e){
		if(e.detail.value>0&&e.detail.value%1===0){
			this.setData({
				remittanceb:e.detail.value
			})
		}else{
			wx.showToast({
				title: '请输入正整数笔数',
				icon:'none'
			})
			this.setData({
				remittanceb:''
			})
		}
	},

	bindRemittanceC(e){
		if(e.detail.value>0&&e.detail.value%1===0){
			this.setData({
				remittancec:e.detail.value
			})
		}else{
			wx.showToast({
				title: '请输入正整数笔数',
				icon:'none'
			})
			this.setData({
				remittancec:''
			})
		}
	},

	bindRemittanceD(e){
		if(e.detail.value>0&&e.detail.value%1===0){
			this.setData({
				remittanced:e.detail.value
			})
		}else{
			wx.showToast({
				title: '请输入正整数笔数',
				icon:'none'
			})
			this.setData({
				remittanced:''
			})
		}
	},

	// 电子银行
	bindElectronicA(e){
		if(e.detail.value>0&&e.detail.value%1===0){
			this.setData({
				electronica:e.detail.value
			})
		}else{
			wx.showToast({
				title: '请输入正整数个数',
				icon:'none'
			})
			this.setData({
				electronica:''
			})
		}
	},

	bindElectronicB(e){
		if(e.detail.value>0&&e.detail.value%1===0){
			this.setData({
				electronicb:e.detail.value
			})
		}else{
			wx.showToast({
				title: '请输入正整数个数',
				icon:'none'
			})
			this.setData({
				electronicb:''
			})
		}
	},

	bindElectronicC(e){
		if(e.detail.value>0&&e.detail.value%1===0){
			this.setData({
				electronicc:e.detail.value
			})
		}else{
			wx.showToast({
				title: '请输入正整数个数',
				icon:'none'
			})
			this.setData({
				electronicc:''
			})
		}
	},

	bindElectronicD(e){
		if(e.detail.value>0&&e.detail.value%1===0){
			this.setData({
				electronicd:e.detail.value
			})
		}else{
			wx.showToast({
				title: '请输入正整数个数',
				icon:'none'
			})
			this.setData({
				electronicd:''
			})
		}
	},

	// 支付账户
	bindPaymentA(e){
		if(e.detail.value>0){
			this.setData({
				paymenta:e.detail.value
			})
		}else{
			wx.showToast({
				title: '请输入正数',
				icon:'none'
			})
			this.setData({
				paymenta:''
			})
		}
	},

	bindPaymentB(e){
		if(e.detail.value>0){
			this.setData({
				paymentb:e.detail.value
			})
		}else{
			wx.showToast({
				title: '请输入正数',
				icon:'none'
			})
			this.setData({
				paymentb:''
			})
		}
	},

	bindCartA(e){
		if(e.detail.value>0){
			this.setData({
				carta:e.detail.value
			})
		}else{
			wx.showToast({
				title: '请输入正数',
				icon:'none'
			})
			this.setData({
				carta:''
			})
		}
	},

	bindCartB(e){
		if(e.detail.value>0){
			this.setData({
				cartb:e.detail.value
			})
		}else{
			wx.showToast({
				title: '请输入正数',
				icon:'none'
			})
			this.setData({
				cartb:''
			})
		}
	},

	// 票据
	bindBillA(e){
		if(e.detail.value>0&&e.detail.value%1===0){
			this.setData({
				billa:e.detail.value
			})
		}else{
			wx.showToast({
				title: '请输入正整数笔数',
				icon:'none'
			})
			this.setData({
				billa:''
			})
		}
	},

	bindBillB(e){
		if(e.detail.value>0&&e.detail.value%1===0){
			this.setData({
				billb:e.detail.value
			})
		}else{
			wx.showToast({
				title: '请输入正整数笔数',
				icon:'none'
			})
			this.setData({
				billb:''
			})
		}
	},

	bindBillC(e){
		if(e.detail.value>0&&e.detail.value%1===0){
			this.setData({
				billc:e.detail.value
			})
		}else{
			wx.showToast({
				title: '请输入正整数笔数',
				icon:'none'
			})
			this.setData({
				billc:''
			})
		}
	},

	bindBillD(e){
		if(e.detail.value>0&&e.detail.value%1===0){
			this.setData({
				billd:e.detail.value
			})
		}else{
			wx.showToast({
				title: '请输入正整数笔数',
				icon:'none'
			})
			this.setData({
				billd:''
			})
		}
	},

	bindBillE(e){
		if(e.detail.value>0&&e.detail.value%1===0){
			this.setData({
				bille:e.detail.value
			})
		}else{
			wx.showToast({
				title: '请输入正整数笔数',
				icon:'none'
			})
			this.setData({
				bille:''
			})
		}
	},

	bindBillF(e){
		if(e.detail.value>0&&e.detail.value%1===0){
			this.setData({
				billf:e.detail.value
			})
		}else{
			wx.showToast({
				title: '请输入正整数笔数',
				icon:'none'
			})
			this.setData({
				billf:''
			})
		}
	},

	queryConfirm(){
		this.setData({
			result_start:this.data.accounta*60+this.data.accountb*50+this.data.remittancea*0.5+this.data.remittanceb*1+this.data.remittancec*5+this.data.remittanced*10+this.data.electronica*10+this.data.electronicb*50+this.data.electronicc*52+this.data.electronicd*2+this.data.paymenta*0.0002+this.data.paymentb*0.001+this.data.carta*0.00036+this.data.cartb*0.000792+this.data.billa*0.4+this.data.billb*5+this.data.billc*1.48+this.data.billd*5+this.data.bille*1.48+this.data.billf*5,

			result_end:this.data.accounta*600+this.data.accountb*150+this.data.remittancea*0.5+this.data.remittanceb*1+this.data.remittancec*5+this.data.remittanced*10+this.data.electronica*1200+this.data.electronicb*200+this.data.electronicc*292+this.data.electronicd*92+this.data.paymenta*0.00055+this.data.paymentb*0.001+this.data.carta*0.00054+this.data.cartb*0.001188+this.data.billa*0.4+this.data.billb*5+this.data.billc*1.48+this.data.billd*5+this.data.bille*1.48+this.data.billf*5,
		})
		if(this.data.accounta||this.data.accountb||this.data.remittancea||this.data.remittanceb||this.data.remittancec||this.data.remittanced||this.data.electronica||this.data.electronicb||this.data.electronicc||this.data.electronicd||this.data.paymenta||this.data.paymentb||this.data.carta||this.data.cartb||this.data.billa||this.data.billb||this.data.billc||this.data.billd||this.data.bille||this.data.billf){
			this.querySkip()
		}
	},

	query(){
		return new Promise((resolve, reject) => {
			let dataJson = JSON.stringify({
				"open_id": '',
				"type":this.data.enterpriseScale,
			})
			//3段加密
			var pricequery = encr.jiami(dataJson, aeskey) 

			wx.request({
				url: app.globalData.YTURL + 'sui/scaleQueryAdd.do',
				data: encr.gwRequest(pricequery),
				method: 'POST',
				success(res) {
					//解密返回的报文
					var json = encr.aesDecrypt(res.data.body, aeskey)
					if (json.result_code === '0000') {
						resolve(json)
					} else {
						reject()
					}
				}
				
			})
		})
	},

	async querySkip(){
		this.query().then(a=>{
			this.setData({
				count:JSON.parse(a.count).COUNT,
				countOrder:JSON.parse(a.count).COUNT1,
			})
			if(getCurrentPages().length>=10){
				wx.redirectTo({
					url: '/sub3/pages/entsc/result?result_start='+this.data.result_start+'&result_end='+this.data.result_end+'&enterpriseScale='+this.data.enterpriseScale+'&count='+this.data.count+'&countOrder='+this.data.countOrder,
				})
			}else{
				wx.navigateTo({
					url: '/sub3/pages/entsc/result?result_start='+this.data.result_start+'&result_end='+this.data.result_end+'&enterpriseScale='+this.data.enterpriseScale+'&count='+this.data.count+'&countOrder='+this.data.countOrder,
				})
			}

		})
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}

})