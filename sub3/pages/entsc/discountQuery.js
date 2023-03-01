const app = getApp();
const date = new Date();

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		cndUrl: app.globalData.CDNURL,
		type:'',
		a:'',
		b:'',
		c:'',
		d:'',
		e:'',
		f:'',
		g:'',
		h:'',
		i:'',
		j:'',
		k:'',
		l:'',
		m:'',
		n:'',
		o:'',
		account:false,
		remittance:false,
		electronic:false,
		payment:false,
		cart:false,
		bill:false,
	},

	account(){
		this.setData({
			account:!this.data.account
		})
	},

	remittance(){
		this.setData({
			remittance:!this.data.remittance
		})
	},

	electronic(){
		this.setData({
			electronic:!this.data.electronic
		})
	},

	payment(){
		this.setData({
			payment:!this.data.payment
		})
	},

	cart(){
		this.setData({
			cart:!this.data.cart
		})
	},

	bill(){
		this.setData({
			bill:!this.data.bill
		})
	},

	list1a(){
		if(this.data.a===1){
			this.setData({
				a:0
			})
		}else{
			this.setData({
				a:1
			})
		}
	},

	list1b(){
		if(this.data.b===1){
			this.setData({
				b:0
			})
		}else{
			this.setData({
				b:1
			})
		}
	},

	list2(){
		if(this.data.c===1){
			this.setData({
				c:0
			})
		}else{
			this.setData({
				c:1
			})
		}
	},

	list3a(){
		if(this.data.d===1){
			this.setData({
				d:0
			})
		}else{
			this.setData({
				d:1
			})
		}
	},

	list3b(){
		if(this.data.e===1){
			this.setData({
				e:0
			})
		}else{
			this.setData({
				e:1
			})
		}
	},

	list4a(){
		if(this.data.f===1){
			this.setData({
				f:0
			})
		}else{
			this.setData({
				f:1
			})
		}
	},

	list4b(){
		if(this.data.g===1){
			this.setData({
				g:0
			})
		}else{
			this.setData({
				g:1
			})
		}
	},

	list4c(){
		if(this.data.h===1){
			this.setData({
				h:0
			})
		}else{
			this.setData({
				h:1
			})
		}
	},

	list5a(){
		if(this.data.i===1){
			this.setData({
				i:0
			})
		}else{
			this.setData({
				i:1
			})
		}
	},

	list5b(){
		if(this.data.j===1){
			this.setData({
				j:0
			})
		}else{
			this.setData({
				j:1
			})
		}
	},

	list5c(){
		if(this.data.k===1){
			this.setData({
				k:0
			})
		}else{
			this.setData({
				k:1
			})
		}
	},

	list6a(){
		if(this.data.l===1){
			this.setData({
				l:0
			})
		}else{
			this.setData({
				l:1
			})
		}
	},

	list6b(){
		if(this.data.m===1){
			this.setData({
				m:0
			})
		}else{
			this.setData({
				m:1
			})
		}
	},

	list7a(){
		if(this.data.n===1){
			this.setData({
				n:0
			})
		}else{
			this.setData({
				n:1
			})
		}
	},

	list7b(){
		if(this.data.o===1){
			this.setData({
				o:0
			})
		}else{
			this.setData({
				o:1
			})
		}
	},

	return(){
		if(getCurrentPages().length>=10){
			wx.redirectTo({
				url: '/sub3/pages/entsc/homepage',
			})
		}else{
			wx.navigateTo({
				url: '/sub3/pages/entsc/homepage',
			})
		}
	},

	doCount(){
		let {cndUrl} = this.data;
		wx.setStorageSync('a', this.data.a);
		wx.setStorageSync('b', this.data.b);
		wx.setStorageSync('c', this.data.c);
		wx.setStorageSync('d', this.data.d);
		wx.setStorageSync('e', this.data.e);
		wx.setStorageSync('f', this.data.f);
		wx.setStorageSync('g', this.data.g);
		wx.setStorageSync('h', this.data.h);
		wx.setStorageSync('i', this.data.i);
		wx.setStorageSync('j', this.data.j);
		wx.setStorageSync('k', this.data.k);
		wx.setStorageSync('l', this.data.l);
		wx.setStorageSync('m', this.data.m);

		const queryAudio=wx.createInnerAudioContext()
		queryAudio.autoplay=false;
		// queryAudio.src='/assets/audio/queryAudio.mp3';
		queryAudio.src=`${cndUrl}/static/wechat/img/entsc/queryAudio.mp3`;

		if(this.data.type&&(this.data.a||this.data.b||this.data.c||this.data.d||this.data.e||this.data.f||this.data.g||this.data.h||this.data.i||this.data.j||this.data.k||this.data.l||this.data.m)){
			queryAudio.play();
			if(getCurrentPages().length>=10){
				wx.redirectTo({
					url: '/sub3/pages/entsc/calculate?enterpriseScale='+this.data.type+'&a='+this.data.a+'&b='+this.data.b+'&c='+this.data.c+'&d='+this.data.d+'&e='+this.data.e+'&f='+this.data.f+'&g='+this.data.g+'&h='+this.data.h+'&i='+this.data.i+'&j='+this.data.j+'&k='+this.data.k+'&l='+this.data.l+'&m='+this.data.m+'&n='+this.data.n+'&o='+this.data.o,
				})
			}else{
				wx.navigateTo({
					url: '/sub3/pages/entsc/calculate?enterpriseScale='+this.data.type+'&a='+this.data.a+'&b='+this.data.b+'&c='+this.data.c+'&d='+this.data.d+'&e='+this.data.e+'&f='+this.data.f+'&g='+this.data.g+'&h='+this.data.h+'&i='+this.data.i+'&j='+this.data.j+'&k='+this.data.k+'&l='+this.data.l+'&m='+this.data.m+'&n='+this.data.n+'&o='+this.data.o,
				})
			}
		}else if(this.data.type==undefined){
			wx.showToast({
				title: '请先确定您的企业类型',
				icon:'none'
			})
		}else{
			wx.showToast({
				title: '请先选择您要估算的项目',
				icon:'none'
			})
		}
	},

	queryEnterpriseScale(){
		if(getCurrentPages().length>=10){
			wx.redirectTo({
				url: '/sub3/pages/entsc/typeQuery',
			})
		}else{
			wx.navigateTo({
				url: '/sub3/pages/entsc/typeQuery',
			})
		}
	},

	selectEnterpriseScale(){
		if(getCurrentPages().length>=10){
			wx.redirectTo({
				url: '/sub3/pages/entsc/select?enterpriseScale='+this.data.type,
			})
		}else{
			wx.navigateTo({
				url: '/sub3/pages/entsc/select?enterpriseScale='+this.data.type,
			})
		}
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let {type,a,b,c,d,e,f,g,h,i,j,k,l,m,account,remittance,electronic,payment,cart,bill} = this.data;

		type = options.enterpriseScale;
		a = wx.getStorageSync('a');
		b = wx.getStorageSync('b');
		c = wx.getStorageSync('c');
		d = wx.getStorageSync('d');
		e = wx.getStorageSync('e');
		f = wx.getStorageSync('f');
		g = wx.getStorageSync('g');
		h = wx.getStorageSync('h');
		i = wx.getStorageSync('i');
		j = wx.getStorageSync('j');
		k = wx.getStorageSync('k');
		l = wx.getStorageSync('l');
		m = wx.getStorageSync('m');
		
		account = (l||m)?true:false; // 银行账户(account) l m
		remittance = (i||j||k)?true:false; // 人民币转账汇款(remittance) i j k
		electronic = (f||g||h)?true:false; // 电子银行(electronic) f g h
		payment = (c)?true:false; // 票据(payment) c
		cart = (d||e)?true:false; // 支付账户(cart) d e
		bill = (a||b)?true:false; // 银行卡刷卡(bill) a b

		this.setData({type,a,b,c,d,e,f,g,h,i,j,k,l,m,account,remittance,electronic,payment,cart,bill});
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