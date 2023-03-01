const app = getApp()
var encr = require('../../../utils/encrypt/encrypt'); //国密3段式加密
var aeskey = encr.key //随机数

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		cndUrl: app.globalData.CDNURL,
		type:'',
		large:false,
		miniature:false,
		individual:false,
		sum:"",
		sumOrder:"",
		calculate:''
	},

	large(){
		this.setData({
			type:'大中型企业',
			large:!this.data.large,
			miniature:false,
			individual:false,
		})
	},

	miniature(){
		this.setData({
			type:'小微型企业',
			miniature:!this.data.miniature,
			large:false,
			individual:false,
		})
	},

	individual(){
		this.setData({
			type:'个体工商户',
			individual:!this.data.individual,
			miniature:false,
			large:false,
		})
	},

	enterpriseScaleQuery(){
		if(this.data.type===''){
			wx.showToast({
				title: '请先确定您的企业类型',
				icon:'none'
			})
		}else{
			this.confirmSkip()
		}
	},

	confirm(){
		return new Promise((resolve, reject) => {
			let dataJson = JSON.stringify({
				"open_id": wx.getStorageSync('openid'),
				"type":this.data.type,
			})
			
			//3段加密
			var scalequery = encr.jiami(dataJson, aeskey) 

			wx.request({
				url: app.globalData.YTURL + 'sui/scaleQueryAdd.do',
				data: encr.gwRequest(scalequery),
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

	async confirmSkip(){
		let {cndUrl} = this.data;
		var aaa=getCurrentPages()
		var bbb=aaa.length-2
		var ccc=aaa[bbb]
		// console.log('历史记录==>',ccc.route);
		const queryAudio=wx.createInnerAudioContext()
		queryAudio.autoplay=false;
		// queryAudio.src='/assets/audio/queryAudio.mp3';
		queryAudio.src=`${cndUrl}/static/wechat/img/entsc/queryAudio.mp3`;
		queryAudio.play()
		this.confirm().then(a=>{
			this.setData({
				sum:JSON.parse(a.count).COUNT,
				sumOrder:JSON.parse(a.count).COUNT1,
			})
			if(ccc.route=== 'sub3/pages/entsc/homepage'){
				wx.redirectTo({
					url: '/sub3/pages/entsc/calculate?enterpriseScale='+this.data.type+'&sum='+this.data.sum+'&sumOrder='+this.data.sumOrder,
				})
			}else{
				wx.redirectTo({
					url: '/sub3/pages/entsc/discountQuery?enterpriseScale='+this.data.type+'&sum='+this.data.sum+'&sumOrder='+this.data.sumOrder,
				})
			}
		})
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.setData({
			calculate:options.calculate
		})
		var currentpage=getCurrentPages();
		var currentpagelength=currentpage.length;
		if(currentpagelength===2){
			wx.setNavigationBarTitle({
				title: '优惠估算'
			})
		}else{
			wx.setNavigationBarTitle({
				title: '政策查询'
			})
		}
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