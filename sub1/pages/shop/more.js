// sub1/pages/product/index.js

const app = getApp();
import requestP from "../../../utils/requsetP";
import skip from "../../../utils/skip";
import api from "../../../utils/api";
//const log = require('../../../log.js');
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		// 产品底图
		TabCur: 0,
		products: [], //所有产品
		showProducts: false, //先加载 在展示
		CustomBar: app.globalData.StatusBar,
		tpyeArray: [
			"热门推荐", //m
			"贷款融资", //m
			"资金结算", //o
			"国际结算", //s
			"贸易融资", //z
			"资金交易", //y
			"综合服务", //p
			"个人金融", //r
            "绿色金融",
		],
		cndUrl: app.globalData.CDNURL,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		//console.log(JSON.stringify(options));
		this.setData({
			preffixUrl: app.globalData.URL,
			currentPage: getCurrentPages().length,
			TabCur: options.id ? parseInt(options.id) : 0,
		});

		this.getProducts();
	},

	/**
	 * 跳转产品页
	 * @param {} e
	 */
	skip(e) {
		if(e.currentTarget.dataset.name == '小微贷'){
			wx.navigateTo({
				url: '../../../pages/xiaowei/index',
			})
		}else if(e.currentTarget.dataset.name == '苏科贷'){
			wx.navigateTo({
				url: '../../../pages/suke/index',
			})
		}else if(e.currentTarget.dataset.name == '首e贷'){
			wx.navigateTo({
				url: '../sui/index3',
			})
		}
		else{
		skip.skipProduct(e.currentTarget.dataset.code);
		}
	},

	/**
	 * 选择类别
	 * @param {*} e
	 */
	tabSelect(e) {
		this.setData({
			TabCur: e.currentTarget.dataset.id,
		});
	},

	/**
	 * 获取产品信息
	 */
	getProducts() {
		var that = this;
		if (wx.getStorageSync("products") != "") {
			that.setData({
				products: wx.getStorageSync("products"),
				productAll: wx.getStorageSync("productAll"),
				showProducts: true,
			});
			return Promise.resolve();
		}

		return api
			.getProducts()
			.then(res => {
				let productAll = res.sort((a, b) => a.SEQUENCE - b.SEQUENCE);
                let products = [
                    [],
                    [],
                    [],
                    [],
                    [],
                    [],
                    [],
                    [],
                    [],
                ];
				//let hotProducts = [ "AM001", "FM001", "DS002", "DZ003", "DY003"];   /*热门推荐*/
				products[0].push({"CODE":"AM001","STATUS":"1","ACTION":"1","SUMMARY":"让您的融资不再难","UPDATE_DATE":"20200421","SEQUENCE":"1","DEPT":"A","TYPE":"M","NAME":"经营随e贷","REGION":"1"});
				products[0].push({"CODE":"FM001","STATUS":"1","ACTION":"1","SUMMARY":"让您的融资不再难","UPDATE_DATE":"20200703","SEQUENCE":"1","DEPT":"F","TYPE":"M","NAME":"消费随e贷","REGION":"1"});
				products[0].push({"CODE":"DS002","STATUS":"1","ACTION":"2","SUMMARY":"资金动向 全球跟踪","UPDATE_DATE":"20210908","SEQUENCE":"1","DEPT":"D","TYPE":"S","NAME":"汇出汇款","REGION":"1"});
				products[0].push({"CODE":"DZ003","STATUS":"1","ACTION":"2","SUMMARY":"资金融通 抢占先机","UPDATE_DATE":"20210908","SEQUENCE":"1","DEPT":"D","TYPE":"Z","NAME":"进口押汇","REGION":"1"});
				products[0].push({"CODE":"DY001","STATUS":"1","ACTION":"2","SUMMARY":"自主操作 高效便捷","UPDATE_DATE":"20210908","SEQUENCE":"1","DEPT":"D","TYPE":"Y","NAME":"即期结售汇","REGION":"1"});
				for (let i = 0; i < productAll.length; i++) {
					if (productAll[i].SUMMARY != "" && res[i].SUMMARY) {
						productAll[i].SUMMARY = productAll[i].SUMMARY.replace(/_/g, " ");
					}
					//products dont show
					if (productAll[i].STATUS === "0") {
						continue;
					}
					//add top products
					/*if (hotProducts.indexOf(productAll[i].CODE) > -1) {
						products[0].push(productAll[i]);
					}*/
					switch (productAll[i].TYPE) {//表示具体产品所属哪一类
						case "S":
							if (productAll[i].CODE == 'DS001'||productAll[i].CODE == 'DS002') {
                                products[3].unshift(productAll[i]);
                                break;
                              }
							products[3].push(productAll[i]);
							break;
						case "Z":
							products[4].push(productAll[i]);
							break;
						case "Y":
							products[5].push(productAll[i]);
							break;
						case "M":
							if (productAll[i].CODE == 'AM002'||productAll[i].CODE == 'AM004'||productAll[i].CODE == 'AM005'||productAll[i].CODE == 'AM009'||productAll[i].CODE == 'AM010'||productAll[i].CODE == 'BO002') {
								break;
							}
                            if (productAll[i].CODE == 'HM001' || productAll[i].CODE == 'HM002') {
                                products[8].push(productAll[i]);
                                break;
                            }
                            products[1].push(productAll[i]);
                            if (productAll[i].CODE == 'IM002') {
                                products[1].push({ "CODE": "BO002", "STATUS": "1", "ACTION": "2", "SUMMARY": "专业的票据管家", "UPDATE_DATE": "20200421", "SEQUENCE": "28", "DEPT": "B", "TYPE": "M", "NAME": "票据池", "REGION": "1" });
                            }
                            break;
                        case "O":
                            products[2].push(productAll[i]);
                            break;
                        case "P":
                            if (productAll[i].CODE == 'FO001') {
                                products[6].unshift(productAll[i]);
                                break;
                              }
							products[6].push(productAll[i]);
							break;
						case "R":
							if(productAll[i].CODE=='FR001'){break;}
							products[7].push(productAll[i]);
							break;
						default:
							break;
					}
					
				}
				that.setData({
					productAll,
					products,
					showProducts: true,
				});
				wx.setStorageSync("products", products);
				wx.setStorageSync("productAll", productAll);
			})
			.catch(err => {
				//console.log(err);
			});
	},
});
