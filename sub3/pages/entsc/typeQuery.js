const app = getApp();
var encr = require('../../../utils/encrypt/encrypt'); //国密3段式加密
var aeskey = encr.key //随机数
var that=this

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		cndUrl: app.globalData.CDNURL,
		categoryIndex:'',
		incomeIndex:'',
		employeesIndex:'',
		assetIndex:'',
		enterpriseScale:'',
		enterpriseScaleIndividual:false,
		enterpriseScaleNotIndividual:false,
		enterpriseScaleIndividualChecked:'enterpriseScaleCheck',
		enterpriseScaleNotIndividualChecked:'enterpriseScaleCheck',
		enterpriseShowFirst:true,
		enterpriseShowSecond:false,
		categoryList: ['A农、林、牧、渔业', '*工业', 'E建筑业', 'F51批发业','F52零售业','*交通运输业','*仓储业','G60邮政业','H61住宿业','H62餐饮业','*信息传输业','I65软件和信息技术服务业','K701房地产开发经营','K702物业管理','L租赁和商务服务业','*其他未列明行业'],
		incomeList:['0——50','50——100','100——200','200——300','300——500','500——1000','1000——2000','2000——3000','3000——5000','5000——6000','6000——10000','10000——20000','20000——30000','30000——40000','40000——60000','60000——80000','80000——100000','100000——200000','200000——'],
		employeesList:['0——5','5——10','10——20','20——50','50——100','100——200','200——300','300——1000','1000——2000','2000——'],
		assetList:['0——100','100——300','300——2000','2000——5000','5000——10000','10000——80000','80000——120000','120000——'],
		show_income:true,
		show_population:true,
		show_assets:true,
		industry_category:'',
		business_income:'',
		industry_population:'',
		total_assets:'',
		business_income_start:'',
		business_income_end:'',
		industry_population_start:'',
		industry_population_end:'',
		total_assets_start:'',
		total_assets_end:'',
		sum:"",
		sumOrder:"",
	},

	bindPickerChangeCategory: function(e) {
		this.setData({
			enterpriseShowFirst:false,
			enterpriseShowSecond:true,
			categoryIndex: e.detail.value,
			industry_category: this.data.categoryList[e.detail.value],
		})
		// console.log('行业类别==>', this.data.industry_category);
		//A农、林、牧、渔业
		if(this.data.industry_category===this.data.categoryList[0]){
			this.setData({
				show_income:true,
				show_population:false,
				show_assets:false,
			})
		}
		//工业 （B采矿业，C制造业，D电力、热力、燃气及水生产和供应业；)
		if(this.data.industry_category===this.data.categoryList[1]){
			this.setData({
				show_income:true,
				show_population:true,
				show_assets:false,
			})
		}
		//E建筑业
		if(this.data.industry_category===this.data.categoryList[2]){
			this.setData({
				show_income:true,
				show_assets:true,
				show_population:false,
			})
		}
		//F51批发业
		if(this.data.industry_category===this.data.categoryList[3]){
			this.setData({
				show_income:true,
				show_population:true,
				show_assets:false,
			})
		}
		//F52零售业
		if(this.data.industry_category===this.data.categoryList[4]){
			this.setData({
				show_income:true,
				show_population:true,
				show_assets:false,
			})
		}
		//交通运输业
		if(this.data.industry_category===this.data.categoryList[5]){
			this.setData({
				show_income:true,
				show_population:true,
				show_assets:false,
			})
		}
		//仓储业
		if(this.data.industry_category===this.data.categoryList[6]){
			this.setData({
				show_income:true,
				show_population:true,
				show_assets:false,
			})
		}
		//G60邮政业
		if(this.data.industry_category===this.data.categoryList[7]){
			this.setData({
				show_income:true,
				show_population:true,
				show_assets:false,
			})
		}
		//H61住宿业
		if(this.data.industry_category===this.data.categoryList[8]){
			this.setData({
				show_income:true,
				show_population:true,
				show_assets:false,
			})
		}
		//H62餐饮业
		if(this.data.industry_category===this.data.categoryList[9]){
			this.setData({
				show_income:true,
				show_population:true,
				show_assets:false,
			})
		}
		//信息传输业
		if(this.data.industry_category===this.data.categoryList[10]){
			this.setData({
				show_income:true,
				show_population:true,
				show_assets:false,
			})
		}
		//I65软件和信息技术服务业
		if(this.data.industry_category===this.data.categoryList[11]){
			this.setData({
				show_income:true,
				show_population:true,
				show_assets:false,
			})
		}
		//K701房地产开发经营
		if(this.data.industry_category===this.data.categoryList[12]){
			this.setData({
				show_income:true,
				show_population:false,
				show_assets:true,
			})
		}
		//K702物业管理
		if(this.data.industry_category===this.data.categoryList[13]){
			this.setData({
				show_income:true,
				show_population:true,
				show_assets:false,
			})
		}
		//L租赁和商务服务业
		if(this.data.industry_category===this.data.categoryList[14]){
			this.setData({
				show_population:true,
				show_assets:true,
				show_income:false,
			})
		}
		//其他未列明行业
		if(this.data.industry_category===this.data.categoryList[15]){
			this.setData({
				show_population:true,
				show_income:false,
				show_assets:false,
			})
		}
	},

	bindPickerChangeIncome(e){
		this.setData({
			incomeIndex: e.detail.value,
			business_income: this.data.incomeList[e.detail.value],
		})
		// console.log('营业收入==>', this.data.business_income);
		this.setData({
			business_income_start: this.data.business_income.split('——')[0],
			business_income_end: this.data.business_income.split('——')[1]-1,
		})
	},

	bindPickerChangeEmployee(e){
		this.setData({
			employeesIndex: e.detail.value,
			industry_population: this.data.employeesList[e.detail.value],
		})
		// console.log('从业人员==>', this.data.industry_population);
		this.setData({
			industry_population_start: this.data.industry_population.split('——')[0],
			industry_population_end: this.data.industry_population.split('——')[1]-1,
		})
	},

	bindPickerChangeAsset(e){
		this.setData({
			assetIndex: e.detail.value,
			total_assets: this.data.assetList[e.detail.value],
		})
		// console.log('资产规模==>', this.data.total_assets);
		this.setData({
			total_assets_start: this.data.total_assets.split('——')[0],
			total_assets_end: this.data.total_assets.split('——')[1]-1,
		})
	},

	bindSpanA(event) {
		let enterpriseScale = this.data.enterpriseScale=='个体工商户'?'个体工商户':'';
		wx.navigateTo({
			url: '/sub3/pages/entsc/discountQuery?enterpriseScale='+enterpriseScale,
		})
	},

	bindSpanB(event) {
		let enterpriseScale = this.data.enterpriseScale=='个体工商户'?'个体工商户':'';
		let a = wx.getStorageSync('a');
		let b = wx.getStorageSync('b');
		let c = wx.getStorageSync('c');
		let d = wx.getStorageSync('d');
		let e = wx.getStorageSync('e');
		let f = wx.getStorageSync('f');
		let g = wx.getStorageSync('g');
		let h = wx.getStorageSync('h');
		let i = wx.getStorageSync('i');
		let j = wx.getStorageSync('j');
		let k = wx.getStorageSync('k');
		let l = wx.getStorageSync('l');
		let m = wx.getStorageSync('m');
		let n = wx.getStorageSync('n');
		let o = wx.getStorageSync('o');
		wx.navigateTo({
			// url: '/sub3/pages/entsc/calculate?enterpriseScale='+enterpriseScale,
			url: `/sub3/pages/entsc/calculate?enterpriseScale=${enterpriseScale}&a=${a}&b=${b}&c=${c}&d=${d}&e=${e}&f=${f}&g=${g}&h=${h}&i=${i}&j=${j}&k=${k}&l=${l}&m=${m}&n=${n}&o=${o}`,
		})
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {

	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},
	// 选择个体商户
	enterpriseScaleIndividualCheck(){
		if(this.data.enterpriseScaleIndividualChecked=='enterpriseScaleCheck'){
			this.setData({
				enterpriseScaleIndividual:true,
				enterpriseScaleNotIndividual:false,
				enterpriseScaleIndividualChecked:'enterpriseScaleChecked',
				enterpriseScaleNotIndividualChecked:'enterpriseScaleCheck',
			})
			}else{
			this.setData({
				enterpriseScaleIndividual:false,
				enterpriseScaleNotIndividual:false,
				enterpriseScaleIndividualChecked:'enterpriseScaleCheck',
				enterpriseScaleNotIndividualChecked:'enterpriseScaleCheck',
			})
		}
		this.enterpriseScaleQuery()
	},

	// 选择非个体商户
	enterpriseScaleNotIndividualCheck(){
		this.setData({
			enterpriseScale:'非个体工商户',
		})
		if(this.data.enterpriseScaleNotIndividualChecked=='enterpriseScaleCheck'){
			this.setData({
				enterpriseScaleIndividual:false,
				enterpriseScaleNotIndividual:true,
				enterpriseScaleIndividualChecked:'enterpriseScaleCheck',
				enterpriseScaleNotIndividualChecked:'enterpriseScaleChecked',
			})
			}else{
			this.setData({
				enterpriseScaleIndividual:false,
				enterpriseScaleNotIndividual:false,
				enterpriseScaleIndividualChecked:'enterpriseScaleCheck',
				enterpriseScaleNotIndividualChecked:'enterpriseScaleCheck',
			})
		}
		this.enterpriseScaleQuery()
	},

	// 立即查询
	enterpriseScaleQuery(){
		// 选择个体工商户
		if(this.data.enterpriseScaleIndividual==true){
			this.setData({
				enterpriseScale:'个体工商户',
			})
			this.confirmSkip()
		}
		//选择非个体工商户
		if(this.data.enterpriseScaleNotIndividual==true){
			this.selectindividual()
		}
	},

	//选择为非个体工商
	selectindividual(){
		this.setData({
			enterpriseShowFirst:false,
			enterpriseShowSecond:true,
		})
		//A农、林、牧、渔业
		if(this.data.industry_category===this.data.categoryList[0]){
			if(this.data.business_income_start>=500){
				this.setData({
					enterpriseScale:'大中型企业',
				})
			}else if(this.data.business_income_end<500){
				this.setData({
					enterpriseScale:'小微型企业',
				})
			}
			if(this.data.business_income_start){
				this.confirmSkip()
			}
		}
		//工业 （B采矿业，C制造业，D电力、热力、燃气及水生产和供应业；)
		if(this.data.industry_category===this.data.categoryList[1]){
			if(this.data.industry_population_start>=300&&this.data.industry_population_end<1000&&this.data.business_income_start>=2000&&this.data.business_income_end<40000||this.data.industry_population_start>=1000||this.data.business_income_start>=40000){
				this.setData({
					enterpriseScale:'大中型企业',
				})
			}else{
				this.setData({
					enterpriseScale:'小微型企业',
				})
			}
			if(this.data.industry_population_start&&this.data.business_income_start){
				this.confirmSkip()
			}
		}
		//E建筑业
		if(this.data.industry_category===this.data.categoryList[2]){
			if(this.data.business_income_start>=6000&&this.data.business_income_end<80000&&this.data.total_assets_start>=5000&&this.data.total_assets_end<80000||this.data.business_income_start>=80000||this.data.total_assets_start>=80000){
				this.setData({
					enterpriseScale:'大中型企业',
				})
			}else{
				this.setData({
					enterpriseScale:'小微型企业',
				})
			}
			if(this.data.business_income_start&&this.data.total_assets_start){
				this.confirmSkip()
			}
		}
		//F51批发业
		if(this.data.industry_category===this.data.categoryList[3]){
			if(this.data.industry_population_start>=20&&this.data.industry_population_end<200&&this.data.business_income_start>=5000&&this.data.business_income_end<40000||this.data.industry_population_start>=200||this.data.business_income_start>=40000){
				this.setData({
					enterpriseScale:'大中型企业',
				})
			}else{
				this.setData({
					enterpriseScale:'小微型企业',
				})
			}
			if(this.data.industry_population_start&&this.data.business_income_start){
				this.confirmSkip()
			}
		}
		//F52零售业
		if(this.data.industry_category===this.data.categoryList[4]){
			if(this.data.industry_population_start>=50&&this.data.industry_population_end<300&&this.data.business_income_start>=500&&this.data.business_income_end<20000||this.data.industry_population_start>=300||this.data.business_income_start>=20000){
				this.setData({
					enterpriseScale:'大中型企业',
				})
			}else{
				this.setData({
					enterpriseScale:'小微型企业',
				})
			}
			if(this.data.industry_population_start&&this.data.business_income_start){
				this.confirmSkip()
			}
		}
		//交通运输业
		if(this.data.industry_category===this.data.categoryList[5]){
			if(this.data.industry_population_start>=300&&this.data.industry_population_end<1000&&this.data.business_income_start>=3000&&this.data.business_income_end<30000||this.data.industry_population_start>=1000||this.data.business_income_start>=30000){
				this.setData({
					enterpriseScale:'大中型企业',
				})
			}else{
				this.setData({
					enterpriseScale:'小微型企业',
				})
			}
			if(this.data.industry_population_start&&this.data.business_income_start){
				this.confirmSkip()
			}
		}
		//仓储业
		if(this.data.industry_category===this.data.categoryList[6]){
			if(this.data.industry_population_start>=100&&this.data.industry_population_end<200&&this.data.business_income_start>=1000&&this.data.business_income_end<30000||this.data.industry_population_start>=200||this.data.business_income_start>=30000){
				this.setData({
					enterpriseScale:'大中型企业',
				})
			}else{
				this.setData({
					enterpriseScale:'小微型企业',
				})
			}
			if(this.data.industry_population_start&&this.data.business_income_start){
				this.confirmSkip()
			}
		}
		//G60邮政业
		if(this.data.industry_category===this.data.categoryList[7]){
			if(this.data.industry_population_start>=300&&this.data.industry_population_end<1000&&this.data.business_income_start>=2000&&this.data.business_income_end<30000||this.data.industry_population_start>=1000||this.data.business_income_start>=30000){
				this.setData({
					enterpriseScale:'大中型企业',
				})
			}else{
				this.setData({
					enterpriseScale:'小微型企业',
				})
			}
			if(this.data.industry_population_start&&this.data.business_income_start){
				this.confirmSkip()
			}
		}
		//H61住宿业
		if(this.data.industry_category===this.data.categoryList[8]){
			if(this.data.industry_population_start>=100&&this.data.industry_population_end<300&&this.data.business_income_start>=2000&&this.data.business_income_end<10000||this.data.industry_population_start>=300||this.data.business_income_start>=10000){
				this.setData({
					enterpriseScale:'大中型企业',
				})
			}else{
				this.setData({
					enterpriseScale:'小微型企业',
				})
			}
			if(this.data.industry_population_start&&this.data.business_income_start){
				this.confirmSkip()
			}
		}
		//H62餐饮业
		if(this.data.industry_category===this.data.categoryList[9]){
			if(this.data.industry_population_start>=100&&this.data.industry_population_end<300&&this.data.business_income_start>=2000&&this.data.business_income_end<10000||this.data.industry_population_start>=300||this.data.business_income_start>=10000){
				this.setData({
					enterpriseScale:'大中型企业',
				})
			}else{
				this.setData({
					enterpriseScale:'小微型企业',
				})
			}
			if(this.data.industry_population_start&&this.data.business_income_start){
				this.confirmSkip()
			}
		}
		//信息传输业
		if(this.data.industry_category===this.data.categoryList[10]){
			if(this.data.industry_population_start>=100&&this.data.industry_population_end<2000&&this.data.business_income_start>=1000&&this.data.business_income_end<100000||this.data.industry_population_start>=2000||this.data.business_income_start>=100000){
				this.setData({
					enterpriseScale:'大中型企业',
				})
			}else{
				this.setData({
					enterpriseScale:'小微型企业',
				})
			}
			if(this.data.industry_population_start&&this.data.business_income_start){
				this.confirmSkip()
			}
		}
		//I65软件和信息技术服务业
		if(this.data.industry_category===this.data.categoryList[11]){
			if(this.data.industry_population_start>=100&&this.data.industry_population_end<300&&this.data.business_income_start>=1000&&this.data.business_income_end<10000||this.data.industry_population_start>=300||this.data.business_income_start>=10000){
				this.setData({
					enterpriseScale:'大中型企业',
				})
			}else{
				this.setData({
					enterpriseScale:'小微型企业',
				})
			}
			if(this.data.industry_population_start&&this.data.business_income_start){
				this.confirmSkip()
			}
		}
		//K701房地产开发经营
		if(this.data.industry_category===this.data.categoryList[12]){
			if(this.data.industry_population_start>=1000&&this.data.industry_population_end<200000&&this.data.total_assets_start>=5000&&this.data.total_assets_end<10000||this.data.industry_population_start>=200000||this.data.total_assets_start>=10000){
				this.setData({
					enterpriseScale:'大中型企业',
				})
			}else{
				this.setData({
					enterpriseScale:'小微型企业',
				})
			}
			if(this.data.industry_population_start&&this.data.total_assets_start){
				this.confirmSkip()
			}
		}
		//K702物业管理
		if(this.data.industry_category===this.data.categoryList[13]){
			if(this.data.industry_population_start>=300&&this.data.industry_population_end<1000&&this.data.business_income_start>=1000&&this.data.business_income_end<5000||this.data.industry_population_start>=1000||this.data.business_income_start>=5000){
				this.setData({
					enterpriseScale:'大中型企业',
				})
			}else{
				this.setData({
					enterpriseScale:'小微型企业',
				})
			}
			if(this.data.industry_population_start&&this.data.business_income_start){
				this.confirmSkip()
			}
		}
		//L租赁和商务服务业
		if(this.data.industry_category===this.data.categoryList[14]){
			if(this.data.industry_population_start>=100&&this.data.industry_population_end<300&&this.data.total_assets_start>=8000&&this.data.total_assets_end<120000||this.data.industry_population_start>=300||this.data.total_assets_start>=120000){
				this.setData({
					enterpriseScale:'大中型企业',
				})
			}else{
				this.setData({
					enterpriseScale:'小微型企业',
				})
			}
			if(this.data.industry_population_start&&this.data.total_assets_start){
				this.confirmSkip()
			}
		}
		//其他未列明行业
		if(this.data.industry_category===this.data.categoryList[15]){
			if(this.data.industry_population_start>=100){
				this.setData({
					enterpriseScale:'大中型企业',
				})
			}else{
				this.setData({
					enterpriseScale:'小微型企业',
				})
			}
			if(this.data.industry_population_start){
				this.confirmSkip()
			}
		}
		// console.log('企业类型==>',this.data.enterpriseScale);
	},

	confirm(){
		return new Promise((resolve, reject) => {
			let dataJson = JSON.stringify({
				"open_id": wx.getStorageSync('openid'),
				"industry_category": this.data.industry_category,
				"business_income": this.data.business_income,
				"industry_population": this.data.industry_population,
				"total_assets": this.data.total_assets,
				"type":this.data.enterpriseScale,
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
			if(getCurrentPages().length>=10){
				wx.redirectTo({
					url: '/sub3/pages/entsc/queryResult?enterpriseScale='+this.data.enterpriseScale+'&sum='+this.data.sum+'&sumOrder='+this.data.sumOrder,
				})
			}else{
				wx.navigateTo({
					url: '/sub3/pages/entsc/queryResult?enterpriseScale='+this.data.enterpriseScale+'&sum='+this.data.sum+'&sumOrder='+this.data.sumOrder,
				})
			}
		})
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