import WxValidate from "../../../assets/plugins/wx-validate/WxValidate";
import requestP from "../../../utils/requsetP";
import user from "../../../utils/user";
import requestYT from "../../../api/requestYT";
import Emp from "../../../utils/Emp";
import Org from '../../../api/Org'
import House from '../../../api/House'
import api from "../../../utils/api"

var citys = require("../../../pages/public/city.js");
var util = require("../../../utils/util.js");
//引入腾讯地图SDK核心类
var QQMapWX = require("../../../assets/plugins/qqmap-wx-jssdk1.2/qqmap-wx-jssdk.js");

var qqmapsdk;
const App = getApp();
const date = new Date();

var list = [];
Page({
	data: {
		applyResult: "", //是否为快易贷
		showbiuld: "true",
		showdanyuan: "true",
		showfanghao: "true",
		falg: "",
		busiCardList: [],
		cardlist: [], //企业名片列表
		cardname: [], //企业名片名称列表，用于展示
		banner: "1000",

		managerTel: "",
		managerID: "",
		chkFlag: false,
		waitSubmit: [], //选择的房产
		gujia2: "", //上传用
		kedai2: "", //
		loginFlag: true, //授权提示控制
		canIUse: wx.canIUse("button.open-type.getUserInfo"),
		userInfo: {},
		pgflag: "pgflag",
		show1: false, //历史评估是否显示
		cityhidden: true,
		keyhidden: true,
		keyhidden1: true,
		keyhidden2: true,
		keyhidden3: true,
		legDisable: "",
		labelname: "",
		submit: true, //重复提交
		list1: [], //getmessagebyopeenid
		mianji: "",
		floor1: "",
		allfloor1: "",
		buildingname: [], //hu小区
		dizhi: [], //hu//地址
		gujia: [], //hu
		kedai: [], //hu
		shijian: [],
		shijian1: [],
		area: [], //mianji
		floor3: [], //楼层
		buildingname1: [], //楼栋
		allfloor3: [], //所有楼层
		housename: [],
		gujia2: [],
		kedai2: [],
		count: "",
		gujia: 0,
		kedai: 0,
		cityhidden: true,
		keyhidden: true,
		coverBgray: true,
		pingguRes: true,
		fangchuan: false,
		house: {
			idCard: "", //身份证
			name: "", //姓名
			cityID: "", //城市码
			housekey: "",
			location: "",
			village: "", //58接口选择值
			biuldiD: "",
			buildname: "",
			roomiD: "", //房号ID
			roomname: "", //房号名
		},
		cityName: "", //城市名
		buildname: "", //输入的小区名
		buildlist: [], //查出来的小区名称集合
		buildlist1: [], //查出来的楼栋
		buildlist2: [], //查出来的房号
		address: [], //地址  判断是否updata
		// floor3: [],
		ceshi: "南京市建邺区沙洲街道河西大街87号朗诗国际街区北园1幢101室",
		falg: "",
		checks: [
			{
				name: "001",
				value: "美国",
			},
			{
				name: "002",
				value: "中国",
				checked: "true",
			},
			{
				name: "003",
				value: "巴西",
			},
		],
		legalperson: [
			{
				name: "是",
				value: "0",
				checked: false,
			},
			{
				name: "否",
				value: "1",
				checked: false,
			},
		],
		applyType: [
			{
				name: "企业贷",
				value: "0",
				checked: true,
			},
			{
				name: "个人贷",
				value: "1",
				checked: false,
			},
		],
		positionTpye: [
			{
				name: "实际控制人",
				value: "4",
			},
			{
				name: "股东",
				value: "2",
			},
		],
		positionTpye: ["实际控制人", "股东"],
		agree_flag: true,
		apliman_flag: true,
		form: {
			orgID: "", //企业统一信用代码
			orgName: "", //q企业姓名
			province: "", //省
			city: "", //市
			name: "", //法人姓名
			tel: "", //法人手机
			idCard: "", //法人身份证
			address: "", //法人联系地址
			timeIndex: "0", //申请期限
			yongtuIndex: "0", //借款用途
			slider: "", //贷款额度
			provinceCode: "", //省码
			cityCode: "", //市码
			managerID: "", //客户经理号
			officeAdd: "", //企业经营地址
			applicantIdCard: "", //申请人身份证号
			applicantName: "", //申请人姓名
			applicantPosition: "",
			applicantTel: "",
			typeIndex: "0", //申请类型
		},
		trbsName: "", //客户经理姓名
		phone: "",
		times: ["10年", "9年", "8年", "7年", "6年", "5年", "4年", "3年", "2年", "1年", "9个月", "6个月", "3个月"],
		yongtu: ["经营周转", "购货", "其他经营用途"],
		edu: "000",
		flag: true,
		flag_0: true,
		flag_1: true,
		flag_2: true,
		flag_3: true,
		flag_4: true,
		flag_org_diy: true,
		flag_org_ocr: false,
		flag_self_diy: true,
		flag_self_ocr: false,
		disabled: "",
		code: "", //验证码
		iscode: null, //用于存放验证码接口里获取到的code
		codename: "获取验证码",
		region: ["江苏省", "南京市"], //暂时无用
		housees: [],
		provinceName: "", //省
		provinceNameID: "", //省ID
		cityName: "", //市
		cityNameID: "", //市ID
		multiIndex: ["", ""], //以下省市选择过度
		multiArray: [],
		objectMultiArray: [],
		org_cities: {},
		danbaoIndex: [0, 0], //以下担保选择过度
		danbaoArray: [
			["抵押", "保证", "信用", "其他"],
			["住宅抵押", "商铺抵押", "厂房抵押"],
		],
		danbaoMultiArray: [
			{
				regid: "1",
				regname: "抵押",
				regtype: "1",
				ageid: "0",
			},
			{
				regid: "2",
				regname: "保证",
				regtype: "1",
				ageid: "0",
			},
			{
				regid: "3",
				regname: "信用",
				regtype: "1",
				ageid: "0",
			},
			{
				regid: "4",
				regname: "其他",
				regtype: "1",
				ageid: "0",
			},
			{
				regid: "20010010",
				parid: "1",
				regname: "住宅抵押",
				regtype: "2",
				ageid: "0",
			},
			{
				regid: "20010020",
				parid: "1",
				regname: "商铺抵押",
				regtype: "2",
				ageid: "0",
			},
			{
				regid: "20010050",
				parid: "1",
				regname: "厂房抵押",
				regtype: "2",
				ageid: "0",
			},
			{
				regid: "10020",
				parid: "2",
				regname: "担保公司保证",
				regtype: "2",
				ageid: "0",
			},
			{
				regid: "10030",
				parid: "2",
				regname: "一般企事业保证",
				regtype: "2",
				ageid: "0",
			},
			{
				regid: "5",
				parid: "3",
				regname: "信用",
				regtype: "2",
				ageid: "0",
			},
			{
				regid: "10060",
				parid: "4",
				regname: "其他",
				regtype: "2",
				ageid: "0",
			},
		],
		ocrSelfsrc: "",
		component: App.components[2],
		camera_flag: true,
		takephoto: {
			noticeTxt: "", //渲染提示文字
			coverImg: "", //渲染遮罩层图片
			id: "", //
			tempImage: "", //存放拍照数据
		},
		pagescroll: ".page",
		src: "",
		showModalStatus: "false",
		day_time: date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日",
		preffixUrl: "",
		v: "0", //调用camera组件
		submit: true, //重复提交
		accessToken: "",
		types: ["个人贷", "企业贷"],
		recommendOpenId: "",
	},

	applyTypeRadioChange(e) {
		var that = this;
		let value = e.detail.value;
		let form = that.data.form;
		form.typeIndex = value;
		that.setData({
			form,
		});
	},

	legalRadioChange: function (e) {
		let that = this;
		let ind = e.detail.value;
		that.setData({
			model: ind,
		});

		that.getCustomerInfo().then(res => {
			//console.log("identityInfo", res);
			let idCard = res.ID_NUMBER;
			let name = res.NAME;
			if (ind == 0) {
				that.setData({
					labelname: "法人",
				});

				let _from = {
					idCard: idCard,
					name: name,
				};
				that.setData({
					form: Object.assign(that.data.form, _from),
					legDisable: "disabled",
					danbaoNameFir: "",
					danbaoNameSec: "",
					apliman_flag: true,
					agree_flag: false,
					flag_self_diy: false,
					flag_self_ocr: true,
				});

				wx.hideLoading();
			} else {
				that.setData({
					labelname: "申请人",
				});

				let _from = {
					applicantName: name,
					applicantIdCard: idCard,
					idCard: "",
					name: "",
				};
				that.setData({
					form: Object.assign(that.data.form, _from),
					legDisable: "",
					danbaoNameFir: "",
					danbaoNameSec: "",
					fangchuan: false,
					apliman_flag: false,
					flag_self_diy: true,
					agree_flag: true,
					flag_self_ocr: false,
				});
			}
		});
	},

	/**
	 * 获取个人实名认证信息
	 */
	getCustomerInfo() {
		var that = this;

		return user.getIdentityInfo().then(res => {
			this.setData({
				"form.idCard": res.ID_NUMBER,
				"form.name": res.NAME,
			});
			return res;
		});
	},

	onLoad(option) {
		var that = this;
		if (option.page) {
			that.showApplyInfo(option);
		}

		if (option.applyResult != undefined) {
			that.setData({
				//是否为快易贷
				applyResult: option.applyResult,
			});
		}
		var _am = option.ammount;
		if (_am == 500) {
			that.setData({
				banner: "500",
			});
		}
		that.apli();
		// 实例化地图API核心类
		qqmapsdk = new QQMapWX({
			key: "2RIBZ-UTLC2-AWQUY-C7I2T-3YKN5-AIF4D",
		});

		var item = wx.createSelectorQuery();
		item.select("#wrapCommon").boundingClientRect(); //里面需要绑定 view组件的id
		item.exec(function (res) {
			//res为绑定元素信息的数组
			let wrapCommon = res[0].bottom; //这样可以动态获取高度
			that.setData({
				wrapCommonBottom: wrapCommon,
			});
		});
		var that = this;
		// 实例化地图API核心类
		qqmapsdk = new QQMapWX({
			key: "2RIBZ-UTLC2-AWQUY-C7I2T-3YKN5-AIF4D",
		});
		//请求接口

		this.setData({
			preffixUrl: App.globalData.URL,
			objectMultiArray: citys.citys,
			multiArray: citys.multiArray,
			org_cities: citys.org_cities,
			navTop: App.globalData.statusBarTop,
			navHeight: App.globalData.statusBarHeight,
		});
		this.initValidate();
		wx.showToast({
			title: "加载中...",
			icon: "loading",
			duration: 20000,
		});
		wx.request({
			url: App.globalData.URL + "getuseCard",
			data: { userId: wx.getStorageSync("openid") },
			header: {
				"Content-Type": "application/x-www-form-urlencoded",
				key: Date.parse(new Date()).toString().substring(0, 6),
				sessionId: wx.getStorageSync("sessionid"),
				transNo: "XC008",
			},
			method: "POST",
			success(res) {
				var cardlist = res.data.stringData;
				var cardlist1 = JSON.parse(util.dect(cardlist));
				var taggs = "";
				//console.log(cardlist1);
				//console.log(cardlist1.length);
				var listname = [];
				if (cardlist1 != null && cardlist1 != undefined) {
					for (var i = 0; i < cardlist1.length; i++) {
						listname.push(cardlist1[i].ORG_NAME);
					}
				}
				if (cardlist1.length <= 0) {
				} else {
					that.setData({
						cardlist: cardlist1,
						cardname: listname,
						busiCardList: listname,
						falg1: "true",
					});
					//console.log(that.data.falg1);
				}
			},
		});
	},

	/**
	 * 回显信息
	 * 1.回显企业信息
	 * 2.我是法人
	 */

	showApplyInfo(o) {
		//console.log(o);
		var that = this;
		let applyInfo = JSON.parse(o.applyInfo);

		let { applyType, houseChoosed, applyBodyType, recommendOpenId, platformUserId } = applyInfo;
		applyType = houseChoosed.length > 0 ? "1" : "0";
		//企业经营地址
		that.setData({
			recommendOpenId,
			platformUserId,
		});

		if (applyType === "1") {

            House.getHouseInfoByUserID().then(res=>{
                var s = [];
                if (res.length>0) {
                    for (let i = 0; i < res.length; i++) {
                        for (let j = 0; j < houseChoosed.length; j++) {
                            //根据相同ID插
                            if (res[i].ADDRESS == houseChoosed[j].address && res[i].AREA == houseChoosed[j].area) {
                                s.push({
                                    buildingname: res[i].COMMUNITYNAME,
                                    houseid: res[i].ID,
                                    dizhi: res[i].ADDRESS,
                                    gujia: (res[i].SALEPRICE * 0.0001).toFixed(0),
                                    kedai: (res[i].SALEPRICE * 0.00007).toFixed(0),
                                    shijian: res[i].CREATE_DATE.substring(4, 6),
                                    shijian1: res[i].CREATE_DATE.substring(6, 8),
                                    area: res[i].AREA,
                                    // floor3: res[i].FLOORNUMBER,
                                    buildingname1: res[i].BUILDNAME,
                                    // allfloor3: res[i].TOTALFLOOR,
                                    louhao: res[i].DANYUANNAME,
                                    cenghao: res[i].FLOORNUMBER,
                                    fanghao: res[i].HOUSENAME,
                                    zonglouceng: res[i].TOTALFLOOR,
                                    mianji: res[i].AREA,
                                    gujia2: res[i].SALEPRICE, //估价具体金额//上传一般业务
                                    kedai2: (res[i].SALEPRICE * 0.7).toFixed(0), //上传一般业务
                                    checked: true,
                                });
                            }
                        }
                    }
                }
                wx.request({
                    url: App.globalData.URL + "getpricecount",
                    data: {
                        open_id: wx.getStorageSync("openid"),
                    },
                    header: {
                        "content-type": "application/x-www-form-urlencoded",
                        key: Date.parse(new Date()).toString().substring(0, 6),
                    },
                    success: res => {
                        //console.log(res.data);
                        this.setData({
                            count: res.data,
                            list1: s,
                        });
                    },
                });

                setTimeout(() => {
                    that.checkboxChange2();
                    wx.hideLoading();
                }, 500);
            })
			//房产抵押
		
		}
		//console.log(applyType);
		//担保方式
		if (applyType == "0") {
			var arrs = [];
			var regid = that.data.danbaoMultiArray[2].regid;
			var regname = that.data.danbaoMultiArray[2].regname;

			that.setData({
				danbaoNameFir: regname,
			});

			for (var i = 0; i < that.data.danbaoMultiArray.length; i++) {
				if (
					that.data.danbaoMultiArray[i].parid == that.data.danbaoMultiArray[2].regid &&
					that.data.danbaoMultiArray[i].regtype == 2
				) {
					arrs.push(that.data.danbaoMultiArray[i]);
				}
			}
			var regid = arrs[0].regid;
			var regname = arrs[0].regname;
			that.setData({
				danbaoCodeSec: regid,
				danbaoNameSec: regname,
			});

			that.setData({
				totalPrice: "",
				coverBgray: true,
				fangchuan: false,
				pgflag: "pgflag",
			});
		} else {
			var arrs = [];
			var regid = that.data.danbaoMultiArray[0].regid;
			var regname = that.data.danbaoMultiArray[0].regname;

			that.setData({
				danbaoNameFir: regname,
			});

			for (var i = 0; i < that.data.danbaoMultiArray.length; i++) {
				if (
					that.data.danbaoMultiArray[i].parid == that.data.danbaoMultiArray[0].regid &&
					that.data.danbaoMultiArray[i].regtype == 2
				) {
					arrs.push(that.data.danbaoMultiArray[i]);
				}
			}
			var regid = arrs[0].regid;
			var regname = arrs[0].regname;
			that.setData({
				danbaoCodeSec: regid,
				danbaoNameSec: regname,
			});
			that.setData({
				fangchuan: true,
			});
			// that.showPinggu();
		}
		//1.1 展示自动填写页面
		this.setData({
			flag_org_diy: false,
			flag_org_ocr: true,
		});
		let orgName = applyInfo.orgName;

		//回显借款主体 默认个人贷
		let _applyType = that.data.applyType;
		if (applyBodyType === "1") {
			//企业贷
			_applyType[0].checked = true;
			_applyType[1].checked = false;

			that.setData({
				"form.typeIndex": "0",
			});
		} else {
			that.setData({
				"form.typeIndex": "1",
			});
			//法人贷
			_applyType[1].checked = true;
			_applyType[0].checked = false;
		}
		//回显是否法人
		let _legalperson = that.data.legalperson;
		_legalperson[0].checked = true;
		that.setData({
			model: "0",
			legalperson: _legalperson,
		});

		//console.log(_applyType);
		that.setData({
			"form.slider": applyInfo.applyNum,
			"form.timeIndex": 10 - parseInt(applyInfo.applyTime) / 12 + "",
			"form.typeIndex": "0",
			applyType: _applyType,
		});

		user.getCustomerInfo().then(res => {
			that.setData({
				"form.applicantTel": res.TEL,
				phone: res.TEL,
			});
		});
		if (that.data.recommendOpenId) {
			user.getCustomerInfo(that.data.recommendOpenId).then(res => {
				that.setData({
					managerTel: res.TEL,
				});
			});
		}
		if (that.data.platformUserId != "") {
			that.getRecommendManagerInfo();
		}
		user
			.getIdentityInfo()
			.then(res => {
				//console.log(res);
				let idCard = res.ID_NUMBER;
				let name = res.NAME;
				that.setData({
					labelname: "法人",
				});

				let _from = {
					idCard: idCard,
					name: name,
				};
				that.setData({
					form: Object.assign(that.data.form, _from),
					legDisable: "disabled",

					apliman_flag: true,
					agree_flag: false,
					flag_self_diy: false,
					flag_self_ocr: true,
				});
			})
			.catch(err => {
				//console.log(err);
			});

            Org.getEnterpriseInfoByName(orgName).then(res=>{
                //console.log(res)
                that.setData({
                    'form.orgID': res.ORG_CODE,
                    'form.orgName': res.ORG_NAME,
                    	// "form.officeAdd": res.data[0].ORG_ADDRESS,
					"form.officeAdd": applyInfo.address,
        
                  })
        
                  let provinceID = res.ORG_CODE.substring(2, 4);
                  let cityID = res.ORG_CODE.substring(2, 6);
                  let province = that.data.org_cities[provinceID];
                  let city = that.data.org_cities[cityID];
                  that.setData({
                    "form.province": province,
                    "form.city": city,
                    'form.provinceCode': provinceID,
                    'form.cityCode': cityID,
                    "provinceName": province,
                    "cityName": city
                  })
               
              }).catch(err=>{
                  //console.log(err)
              })
},

	getRecommendManagerInfo() {
		var that = this;
		let managerID = "";
		Emp.getCardInfoByEmp(that.data.platformUserId)
			.then(res => {
				//console.log("platformUserId", res);
				if (res.TEXT4 === "1") {
					that.setData({
						managerID: that.data.platformUserId,
						trbsName: res.USERNAME,
                    });
                    return Promise.reject()
				} else if (res.TEXT4 === "2") {
					managerID = res.TEXT3;
					return Emp.getCardInfoByEmp(res.TEXT3);
				}else{
                    return Promise.reject()
                }
			})
			.then(res => {
				//console.log(res);
				that.setData({
					managerID: managerID,
					trbsName: res.USERNAME,
				});
			});
	},

	//返回
	beback: function () {
		//console.log("sss");

		this.setData({
			keyhidden: true,
			keyhidden1: true,
			keyhidden2: true,
			keyhidden3: true,
		});
		//console.log(this.data.keyhidden1);
	},
	onShow: function () {
		var that = this;
		//console.log("backData", this.data.backData);
		if (this.data.backData == 1) {
            House.getHouseInfoByUserID().then(res=>{

                let s = [];
                let oldList = that.data.list1
                let index = -1;
                let length = res.length
                if (length>0) {
                  let contain = true;
                  for (var i = 0; i < res.length; i++) {
                    for (var j = 0; j < oldList.length; j++) {
                      //根据相同ID插
                      if (res[i].ID == oldList[j].houseid) {
                        s.push({
                          buildingname: res[i].COMMUNITYNAME,
                          houseid: res[i].ID,
                          dizhi: res[i].ADDRESS,
                          gujia: (res[i].SALEPRICE * 0.0001).toFixed(0),
                          kedai: (res[i].SALEPRICE * 0.00007).toFixed(0),
                          shijian: res[i].CREATE_DATE.substring(4, 6),
                          shijian1: res[i].CREATE_DATE.substring(6, 8),
                          area: res[i].AREA,
                          // floor3: res[i].FLOORNUMBER,
                          buildingname1: res[i].BUILDNAME,
                          // allfloor3: res[i].TOTALFLOOR,
                          louhao: res[i].DANYUANNAME,
                          cenghao: res[i].FLOORNUMBER,
                          fanghao: res[i].HOUSENAME,
                          zonglouceng: res[i].TOTALFLOOR,
                          mianji: res[i].AREA,
                          gujia2: res[i].SALEPRICE, //估价具体金额//上传一般业务
                          kedai2: (res[i].SALEPRICE * 0.7).toFixed(0), //上传一般业务
                          cityId: res[i].CITY_ID,//返回时city_id
                          checked: oldList[j].checked
                        })
                        contain = true
                        break;
                      } else {
                        contain = false
                      }
                    }
                    if (!contain || (length == 1)) {
                      index = i
                      s.push({
                        buildingname: res[index].COMMUNITYNAME,
                        houseid: res[index].ID,
                        dizhi: res[index].ADDRESS,
                        gujia: (res[index].SALEPRICE * 0.0001).toFixed(0),
                        kedai: (res[index].SALEPRICE * 0.00007).toFixed(0),
                        shijian: res[index].CREATE_DATE.substring(4, 6),
                        shijian1: res[index].CREATE_DATE.substring(6, 8),
                        area: res[index].AREA,
                        // floor3: res[i].FLOORNUMBER,
                        buildingname1: res[index].BUILDNAME,
                        // allfloor3: res[index].TOTALFLOOR,
                        louhao: res[index].DANYUANNAME,
                        cenghao: res[index].FLOORNUMBER,
                        fanghao: res[index].HOUSENAME,
                        zonglouceng: res[index].TOTALFLOOR,
                        mianji: res[index].AREA,
                        gujia2: res[index].SALEPRICE, //估价具体金额//上传一般业务
                        kedai2: (res[index].SALEPRICE * 0.7).toFixed(0), //上传一般业务
                        cityId: res[index].CITY_ID,//返回时city_id
                        checked: true
                      })
                    }
                  }
                }
                wx.request({
                  url: App.globalData.URL + 'getpricecount',
                  data: {
                    open_id: wx.getStorageSync('openid'),
                  },
                  header: {
                    'content-type': 'application/x-www-form-urlencoded',
                    "key": (Date.parse(new Date())).toString().substring(0, 6),
                  },
                  success: res => {
                    //console.log(res.data)
                    this.setData({
                      count: res.data,
                      list1: s
                    })
                  }
                })
                //在套一层循环有checked属性的直接赋值 不存在ID的直接给true 因为是新添加的
                // that.setData({
                //   list1: s
                // })
        
                setTimeout(() => {
                  that.checkboxChange2();
                  wx.hideLoading();
                }, 500);
              })
        
          
        }
		// if()

		if (
			App.globalData.share_person != undefined &&
			App.globalData.share_person != null &&
			App.globalData.share_person != ""&&that.data.recommendOpenId==""
		) {
			user.getCustomerInfo(App.globalData.share_person).then(res => {
				if (res.ID_CARD != undefined) {
					this.setData({
						idcard: res.ID_CARD,
						nick_name: res.NICK_NAME,
						real_name: res.REAL_NAME,
                        managerTel: res.TEL?res.TEL:'',
                        managerID: res.USERID?res.USERID:"",
                        trbsName: res.REAL_NAME?res.REAL_NAME:'',
					});
				}
			});
		}

		wx.hideToast();
		if (wx.getStorageSync("openid") == null || wx.getStorageSync("openid") == "") {
			wx.login({
				success: res => {
					// 发送 res.code 到后台换取 openId, sessionKey, unionId
					util.openid(res.code, App.globalData.URL);
					setTimeout(function () {
						that.onLoad();
					}, 3000);
				},
			});
		} else {
			//判断数据库了里是否存在密钥
			wx.request({
				url: App.globalData.URL + "existkey",
				data: {
					sessionId: wx.getStorageSync("sessionid"),
				},
				method: "POST",
				header: {
					"Content-Type": "application/x-www-form-urlencoded",
					key: Date.parse(new Date()).toString().substring(0, 6),
				},
				success(res) {
					if (res.data == undefined || res.data != true) {
						wx.login({
							success: res => {
								// 发送 res.code 到后台换取 openId, sessionKey, unionId
								util.openid(res.code, App.globalData.URL);
							},
						});
					}
				},
				fail() {
					wx.showToast({
						title: "网络异常",
						icon: "none",
						duration: 2000,
					});
				},
			});
		}
	},
	showModal(error) {
		wx.showToast({
			title: error.msg,
			icon: "none",
			duration: 2000,
		});
	},
	showModal(error) {
		wx.showToast({
			title: error.msg,
			icon: "none",
			duration: 2000,
		});
	},

	//切换企业执照手动录入
	change_org() {
		this.setData({
			flag_org_diy: false,
			flag_org_ocr: true,
		});
	},
	//切换企业执照OCR
	change_org_ocr() {
		this.setData({
			flag_org_diy: true,
			flag_org_ocr: false,
		});
	},
	//切换法人手动录入
	change_self() {
		this.setData({
			flag_self_diy: false,
			flag_self_ocr: true,
		});
	},
	//切换法人OCR
	change_self_ocr() {
		this.setData({
			flag_self_diy: true,
			flag_self_ocr: false,
		});
	},
	// 遮罩层显示
	show: function () {
		var that = this;
		that.setData({
			showModalStatus: true,
		});

		if (that.data.form.typeIndex == "1" && that.data.labelname == "申请人") {
			wx.showActionSheet({
				itemList: ["《个人征信查询授权书》", "《个人综合信息查询授权委托书》"],
				itemColor: "#0066b3",
				success(res) {
					that.setData({
						pagescroll: ".page .noscroll",
					});
					if (res.tapIndex == 0) {
						that.setData({
							flag: false,
							flag_0: true,
							flag_1: false,
							flag_2: true,
							flag_3: true,
							flag_4: true,
						});
					} else if (res.tapIndex == 1) {
						that.setData({
							flag: false,
							flag_0: true,
							flag_1: true,
							flag_2: false,
							flag_3: true,
							flag_4: true,
						});
					}
				},
				fail(res) {
					////console.log(res.errMsg)
					that.setData({
						pagescroll: ".page",
					});
				},
			});
		} else {
			wx.showActionSheet({
				itemList: [
					"《个人征信查询授权书》",
					"《个人综合信息查询授权委托书》",
					"《企业征信查询授权书》",
					"《企业综合信息查询授权委托书》",
				],
				itemColor: "#0066b3",
				success(res) {
					that.setData({
						pagescroll: ".page .noscroll",
					});
					if (res.tapIndex == 0) {
						that.setData({
							flag: false,
							flag_0: true,
							flag_1: false,
							flag_2: true,
							flag_3: true,
							flag_4: true,
						});
					} else if (res.tapIndex == 1) {
						that.setData({
							flag: false,
							flag_0: true,
							flag_1: true,
							flag_2: false,
							flag_3: true,
							flag_4: true,
						});
					} else if (res.tapIndex == 2) {
						that.setData({
							flag: false,
							flag_0: true,
							flag_1: true,
							flag_2: true,
							flag_3: false,
							flag_4: true,
						});
					} else if (res.tapIndex == 3) {
						that.setData({
							flag: false,
							flag_0: true,
							flag_1: true,
							flag_2: true,
							flag_3: true,
							flag_4: false,
						});
					}
				},
				fail(res) {
					////console.log(res.errMsg)
					that.setData({
						pagescroll: ".page",
					});
				},
			});
		}
	},

	// 遮罩层隐藏
	conceal: function () {
		var that = this;
		that.setData({
			showModalStatus: true,
		});

		if (that.data.form.typeIndex == "1" && that.data.labelname == "申请人") {
			wx.showActionSheet({
				itemList: ["《个人征信查询授权书》", "《个人综合信息查询授权委托书》"],
				itemColor: "#0066b3",
				success(res) {
					that.setData({
						showModalStatus: true,
					});
					if (res.tapIndex == 0) {
						that.setData({
							flag: false,
							flag_0: true,
							flag_1: false,
							flag_2: true,
							flag_3: true,
							flag_4: true,
						});
					} else if (res.tapIndex == 1) {
						that.setData({
							flag: false,
							flag_0: true,
							flag_1: true,
							flag_2: false,
							flag_3: true,
							flag_4: true,
						});
					}
				},
				fail(res) {
					////console.log(res.errMsg)
					that.setData({
						pagescroll: ".page",
					});
				},
			});
			that.setData({
				flag: true,
				flag_0: true,
				flag_1: true,
				flag_2: true,
				flag_3: true,
				flag_4: true,
			});
		} else {
			wx.showActionSheet({
				itemList: [
					"《个人征信查询授权书》",
					"《个人综合信息查询授权委托书》",
					"《企业征信查询授权书》",
					"《企业综合信息查询授权委托书》",
				],
				itemColor: "#0066b3",
				success(res) {
					that.setData({
						showModalStatus: true,
					});
					if (res.tapIndex == 0) {
						that.setData({
							flag: false,
							flag_0: true,
							flag_1: false,
							flag_2: true,
							flag_3: true,
							flag_4: true,
						});
					} else if (res.tapIndex == 1) {
						that.setData({
							flag: false,
							flag_0: true,
							flag_1: true,
							flag_2: false,
							flag_3: true,
							flag_4: true,
						});
					} else if (res.tapIndex == 2) {
						that.setData({
							flag: false,
							flag_0: true,
							flag_1: true,
							flag_2: true,
							flag_3: false,
							flag_4: true,
						});
					} else if (res.tapIndex == 3) {
						that.setData({
							flag_0: true,
							flag_1: true,
							flag_2: true,
							flag_3: true,
							flag_4: false,
						});
					}
				},
				fail(res) {
					////console.log(res.errMsg)
					that.setData({
						pagescroll: ".page",
					});
				},
			});
			that.setData({
				flag: true,
				flag_0: true,
				flag_1: true,
				flag_2: true,
				flag_3: true,
				flag_4: true,
			});
		}
	},

	submitForm1(e) {
		//console.log(this.data.housees);
		if (wx.getStorageSync("openid") == null || wx.getStorageSync("openid") == "") {
			wx.showToast({
				title: "请重新打开小程序",
				icon: "loading",
				duration: 2000,
			});
			return;
		}
		var that = this;

		//form_id
		const fId = e.detail.formId;
		const params = e.detail.value;
		var times = "";

		if (that.data.model == "1" && that.data.form.typeIndex == "1") {
			//console.log("1");
			if (typeof that.data.form.applicantPosition === "undefined" || that.data.form.applicantPosition === "") {
				wx.showToast({
					title: "请选择借款人职务",
					icon: "none",

					duration: 1500,
					mask: false,
				});
				return;
			}
		}
		if (that.data.times[params.timeIndex].indexOf("年") != -1) {
			//包含年的期限
			times = (that.data.times[params.timeIndex].replace("年", "") * 12).toString();
			//console.log("期限" + times);
		} else {
			times = that.data.times[params.timeIndex].replace("个月", "");
		}

		//未勾选同意按钮
		if (this.data.checklist != "checked" && this.data.model == 0) {
			wx.showToast({
				title: "请勾选同意协议",
				icon: "none",
				duration: 2000,
			});
			return;
		}
		var applyResult = this.data.applyResult;

		// 传入表单数据，调用验证方法
		if (!this.WxValidate.checkForm(params)) {
			const error = this.WxValidate.errorList[0];
			this.showModal(error);
			return false;
		}
		if (this.data.submit) {
			wx.showLoading({
				title: "提交中...",
				mask: true,
			});
			//console.log(that.data.gujia);
			//console.log(that.data.kedai);
			//console.log(that.data.form.yongtuIndex);

			let str = JSON.stringify({
				string_credit_code: params.orgID, //统一社会信用代码
				string_enterprise_name: params.orgName, //企业名称
				string_province: that.data.form.provinceCode, //企业实体所在省
				string_city: that.data.form.cityCode, //企业实体所在市
				string_legal_name: params.name, //法人姓名
				string_id_card_no: params.idCard, //身份证号
				string_contact_address: params.address, //联系地址
				string_apply_amount: params.slider + "", //申请额度
				string_apply_term: times, //申请期限
				string_purpose: that.data.form.yongtuIndex, //贷款用途
				string_vouch_type: that.data.danbaoCodeSec, //提供担保方式
				string_mobile: params.tel, //法人手机号
				string_referrer_mobile: params.managerTel, //推荐人手机号
				string_manager_num: params.managerID, //客户经理工号
				string_estimate_the_amount: that.data.gujia, //估价金额
				string_amount_of_loanable: that.data.kedai, //可贷金额
				string_manage_user_name: that.data.trbsName, //客户经理姓名
				string_office_add: that.data.form.officeAdd, //企业经营地址
				string_json: JSON.stringify(that.data.housees),
				string_applicant_name: that.data.form.applicantName, //申请人姓名
				string_applicant_id_card: that.data.form.applicantIdCard, //申请人身份证号
				string_applicant_tel: params.applicantTel, //申请人电话
				string_sffr: that.data.model.toString(), //1代表非法人模式,0代表法人模式
				string_attr1: that.data.form.typeIndex.toString(),
			});
			//console.log(str);
			str = util.toCDB(
				str.replace(/\(/g, "-括号").replace(/\（/g, "-括号").replace(/\)/g, "括号-").replace(/\）/g, "括号-")
			);
			var data = util.enct(str) + util.digest(str);
			//console.log(util.digest(str));
			//console.log("applicantPosition", that.data.form.applicantPosition);

			let options = {
				url: "addGeneralApply.do",
				data: JSON.stringify({
					jkrzw: that.data.form.applicantPosition ? that.data.form.applicantPosition : "",
					data: str,
					code: this.data.code,
					phone: params.applicantTel,
					open_id: wx.getStorageSync("openid"),
					applyResult: this.data.applyResult, //是否为快易贷
				}),
			};
			requestYT(options)
				.then(res => {
					//console.log("/addGeneralApply", res);
					if (res.code === "1") {
						wx.navigateTo({
							url:
								"apply_result?data=" +
								res.stringData +
								"&orgName=" +
								params.orgName +
								"&orgID=" +
								params.orgID +
								"&name=" +
								params.name +
								"&officeAdd=" +
								that.data.form.cityCode +
								"&applicantTel=" +
								params.applicantTel,
						});
					} else {
						wx.showModal({
							title: "提示",
							content: res.msg,
							showCancel: false, //是否显示取消按钮
						});
					}
				})
				.catch(err => {
					wx.showToast({
						title: "网络异常",
						icon: "none",
						duration: 2000,
					});
					that.setData({
						submit: true,
					});
				});

			// wx.request({
			// 	url: App.globalData.URL + "addGeneralApply", // 仅为示例，并非真实的接口地址
			// 	data: {
			// 		jkrzw: that.data.form.applicantPosition ? that.data.form.applicantPosition : "",
			// 		data: data,
			// 		code: this.data.code,
			// 		phone: params.applicantTel,
			// 		open_id: wx.getStorageSync("openid"),
			// 		applyResult: this.data.applyResult, //是否为快易贷
			// 	},
			// 	method: "POST",
			// 	header: {
			// 		"Content-Type": "application/x-www-form-urlencoded",
			// 		key: Date.parse(new Date()).toString().substring(0, 6),
			// 		sessionId: wx.getStorageSync("sessionid"),
			// 		transNo: "XC015",
			// 	},
			// 	success(res) {
			// 		wx.hideLoading();
			// 		//console.log(res);

			// 		if (res.data != undefined && res.data.code != undefined && res.data.code != -1) {
			// 			var resultData = JSON.parse(res.data.stringData);
			// 			//成功后跳转
			// 			wx.navigateTo({
			// 				//url: '/pages/mine/mine_applicate?orderNo=' + res.data.stringData + '&type=10',
			// 				url:
			// 					"apply_result?data=" +
			// 					res.data.stringData +
			// 					"&orgName=" +
			// 					params.orgName +
			// 					"&orgID=" +
			// 					params.orgID +
			// 					"&name=" +
			// 					params.name +
			// 					"&officeAdd=" +
			// 					that.data.form.cityCode +
			// 					"&applicantTel=" +
			// 					params.applicantTel,
			// 			});
			// 		} else {
			// 			wx.hideToast();
			// 			wx.showModal({
			// 				title: "提示",
			// 				content: res.data.msg,
			// 				showCancel: false, //是否显示取消按钮
			// 				success: function (res) {},
			// 				fail: function (res) {}, //接口调用失败的回调函数
			// 				complete: function (res) {}, //接口调用结束的回调函数（调用成功、失败都会执行）
			// 			});
			// 		}
			// 	},
			// 	fail() {
			// 		wx.showToast({
			// 			title: "网络异常",
			// 			icon: "none",
			// 			duration: 2000,
			// 		});
			// 		that.setData({
			// 			submit: true,
			// 		});
			// 	},
			// });
		} else {
			wx.showToast({
				title: "您已提交过了",
				icon: "none",
				duration: 2000,
			});
		}
	},
	initValidate() {
		// 验证字段的规则
		const rules = {
			orgID: {
				required: true,
				orgID: true,
			},
			orgName: {
				required: true,
				orgName: true,
			},

			name: {
				required: true,
				name: true,
			},

			idCard: {
				required: true,
				idcard: true,
			},
			// address: {
			//   required: true,
			//   address: true,
			// },
			timeIndex: {
				required: true,
				timeIndex: true,
			},

			slider: {
				required: true,
				slider: true,
			},
			verycode: {
				required: true,
			},
			managerTel: {
				tel: true,
				minlength: 11,
				maxlength: 11,
			},
			managerID: {
				minlength: 8,
				maxlength: 8,
			},
		};

		// 验证字段的提示信息，若不传则调用默认的信息
		const messages = {
			name: {
				required: "请输入法人姓名",
				name: "法人姓名仅支持汉字（8位内）",
			},
			// tel: {
			//   required: "请输入法人代表手机号",
			//   tel: "请输入正确的法人代表手机号",
			// },
			idCard: {
				required: "请输入身份证号码",
				idcard: "请输入正确的身份证号码",
			},
			// address: {
			//   required: '请输入联系地址',
			// },
			orgID: {
				required: "请输入企业统一社会信用代码",
				orgID: "请输入正确的统一社会信用代码",
			},

			orgName: {
				required: "请输入企业名称",
				orgName: "企业名称只能包含汉字及全/半角括号",
			},
			slider: {
				required: "请输入申请金额",
				min: "申请金额不小于1万元",
				max: "申请金额不大于1000万元",
			},
			timeIndex: {
				required: "请选择申请期限",
			},
			verycode: {
				required: "请输入手机验证码",
			},
			managerTel: {
				tel: "请输入正确的推荐人手机号",
				minlength: "请输入11位推荐人手机号",
				maxlength: "请输入11位推荐人手机号",
			},
			managerID: {
				minlength: "请输入8位客户经理工号",
				maxlength: "请输入8位客户经理工号",
			},
		};

		// 创建实例对象
		this.WxValidate = new WxValidate(rules, messages);
	},
	//职务选择
	bindPositionChange(e) {
		const index = e.detail.value;
		this.setData({
			applicantPosition: index === "0" ? "实际控制人" : "股东",
			"form.applicantPosition": index === "0" ? "4" : "2",
		});
	},
	//期限选择
	bindTimeChange(e) {
		const value = e.detail.value;
		this.setData({
			"form.timeIndex": value,
		});
	},
	//用途选择
	bindYongtuChange(e) {
		const value = e.detail.value;
		this.setData({
			"form.yongtuIndex": value,
		});
	},

	//获取输入的手机号，以供发验证码
	getPhoneValue: function (e) {
		var _this = this;
		_this.setData({
			phone: e.detail.value,
		});
	},
	//获取输入的验证码
	getCodeValue: function (e) {
		this.setData({
			code: e.detail.value,
		});
	},

	//校验手机号、后台发送验证码至手机
	getCode: function () {
		var a = this.data.phone;
		var _this = this;
		//var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
		if (a == "") {
			wx.showToast({
				title: "手机号不能为空",
				icon: "none",
				duration: 1000,
			});
			setTimeout(function () {
				_this.setData(
					{
						codename: "获取验证码",
						disabled: false,
					},
					3000
				);
			});
			return false;
		} else if (a.length != 11) {
			wx.showToast({
				title: "请输入正确的手机号",
				icon: "none",
				duration: 1000,
			});
			setTimeout(function () {
				_this.setData(
					{
						codename: "获取验证码",
						disabled: false,
					},
					3000
				);
			});
			return false;
		} else if (a != null && a != "") {
			////console.log(this.data.phone)

			if (this.data.applyResult == "kyd") {
				var typeResult = 12;
			} else {
				var typeResult = 4;
            }
            
            api.sendCode(this.data.phone,typeResult).then(res=>{
                console.log(res)
                if (res.code === 1) {
                  var num = 60;
                  var timer = setInterval(function () {
                    num--;
                    if (num <= 0) {
                      clearInterval(timer);
                      _this.setData({
                        codename: '重新发送',
                        disabled: false
                      })
                    } else {
                      _this.setData({
                        codename: num + "s"
                      })
                    }
                  }, 1000)
                  wx.showToast({
                    title: res.msg,
                    icon: 'none',
                    duration: 2000
                  })
                } else {
                  wx.showToast({
                    title: res.msg,
                    icon: 'none',
                    duration: 2000
                  })
                  _this.setData({
                    disabled: false
                  })
                }
            }).catch(err=>{
              wx.showToast({
                  title: '发送失败',
                  icon: 'none',
                  duration: 1000
                })
                _this.setData({
                  disabled: false
                })
            })
      
		} else {
			wx.showToast({
				title: "请输入手机号",
				icon: "none",
				duration: 1000,
			});
		}
	},
	//点击获取验证码按钮，出发按钮事件
	getVerificationCode(e) {
		this.getCode();
		var _this = this;
		_this.setData({
			disabled: true,
		});
	},

	//调取拍照控件或选择图片方法控件
	creatPhoto(e) {
		//选取id号sfz--身份证，yyzz--营业执照
		const c = e.target.id;
		var that = this;
		//点击后调取拍照/选已有sheet
		wx.showActionSheet({
			itemList: ["立即拍照", "从手机相册选择"],
			success(res) {
				//身份证提示
				if (c == "sfz") {
					that.setData({
						takephoto: {
							coverImg: "img/camera_box.png",
							noticeTxt: "请将身份证人像面放入框内",
							id: "sfz_take",
						},
					});
				} else if (c == "yyzz") {
					//营业执照提示
					that.setData({
						takephoto: {
							coverImg: "img/camera_box_org.png",
							noticeTxt: "请将营业执照（竖版）放入框内",
							id: "yyzz_take",
						},
					});
				}
				var _ind = res.tapIndex;
				//拍照界面弹出方法0--立即拍照调取takephoto；1选取已有
				if (_ind == "0") {
					that.setData({
						camera_flag: false,
						v: "1",
					});
				} else if (_ind == "1") {
					const c = that.data.takephoto.id;
					wx.chooseImage({
						count: 1,
						sizeType: ["compressed"], //compressed压缩图，original原图
						sourceType: ["album"],
						success(res) {
							// tempFilePath可以作为 img标签的src属性显示图片
							var tempFilePaths = res.tempFilePaths;
							//压缩图片处理
							var size = res.tempFiles[0].size;
							wx.getImageInfo({
								src: tempFilePaths[0],
								success: function (res) {
									var ctx = wx.createCanvasContext("attendCanvasId");
									var ratio = 1;
									var canvasWidth = res.width;
									var canvasHeight = res.height;
									var quality = 1;
									while (canvasWidth > 700) {
										canvasWidth = Math.trunc(res.width / ratio);
										canvasHeight = Math.trunc(res.height / ratio);
										ratio += 0.1;
									}
									quality = (quality + ratio / 10).toFixed(1);
									//console.log(quality);
									if (quality > 1) {
										quality = 0.7;
									}
									that.setData({
										canvasWidth: canvasWidth,
										canvasHeight: canvasHeight,
									});
									ctx.drawImage(tempFilePaths[0], 0, 0, canvasWidth, canvasHeight);
									ctx.draw();
									setTimeout(function () {
										wx.canvasToTempFilePath({
											canvasId: "attendCanvasId",
											width: 0,
											height: 0,
											destWidth: canvasWidth,
											destHeight: canvasHeight,
											fileType: "jpg",
											quality: quality,
											success(res) {
												//这里是将图片上传到服务器中并识别
												//console.log(res.tempFilePath);
												////console.log(res)
												that.setData({
													"takephoto.tempImage": res.tempFilePath,
												});
												if (c == "sfz_take") {
													wx.showToast({
														title: "智能识别中...",
														icon: "loading",
														duration: 20000,
													});
													wx.uploadFile({
														url: App.globalData.URL + "upload", // 仅为示例，非真实的接口地址
														filePath: that.data.takephoto.tempImage,
														name: "file",
														formData: {
															option: "1",
														},
														header: {
															key: Date.parse(new Date()).toString().substring(0, 6),
															sessionId: wx.getStorageSync("sessionid"),
														},
														success: res => {
															wx.hideToast();
                                                            if(res.data){
                                                                const result = JSON.parse(res.data)
                                                                if(result.rE_LEGALITY==="IdPhoto"){
                                                                    that.setData({
                                                                        flag_self_diy: false,
                                                                        flag_self_ocr: true,
                                                                        'form.name': result.rE_CUST_NAME,
                                                                        'form.idCard': result.rE_CUST_ID,
                                                                        'form.address': result.rE_ADDRESS
                                                                      })
                                                                }else{
                                                                    wx.showToast({
                                                                        title: "请上传正常有效的身份证原件（不允许拍照身份证复印件，身份证二次拍照）",
                                                                        icon: 'none',
                                                                        mask: true,
                                                                        duration: 2000
                                                                      })
                                                                }
                                                              }else{
                                                                wx.showToast({
                                                                    title: res.errMsg,
                                                                    icon: 'none',
                                                                    mask: true,
                                                                    duration: 2000
                                                                  })
                                                              } 
														},
													});
												} else if (c == "yyzz_take") {
													wx.showToast({
														title: "智能识别中...",
														icon: "loading",
														duration: 20000,
													});
													wx.uploadFile({
														url: App.globalData.URL + "upload", // 仅为示例，非真实的接口地址
														filePath: that.data.takephoto.tempImage,
														name: "file",
														formData: {
															option: "2",
														},
														header: {
															key: Date.parse(new Date()).toString().substring(0, 6),
															sessionId: wx.getStorageSync("sessionid"),
														},
														success: res => {
															wx.hideToast();
															if (res.data != "") {
																var result = JSON.parse(res.data);
																var provinceID = result.rE_REGISTER_ID.substring(2, 4);
																var cityID = result.rE_REGISTER_ID.substring(2, 6);
																var province = that.data.org_cities[provinceID];
																var city = that.data.org_cities[cityID];
																that.setData({
																	flag_org_diy: false,
																	flag_org_ocr: true,
																	"form.orgID": result.rE_REGISTER_ID,
																	"form.orgName": result.rE_COMPANY_NAME,
																	"form.province": province,
																	"form.city": city,
																	"form.provinceCode": result.rE_REGISTER_ID.substring(2, 4),
																	"form.cityCode": result.rE_REGISTER_ID.substring(2, 6),
																	provinceName: province,
																	cityName: city,
																});
															} else {
																wx.showToast({
																	title: "您上传的图片太大啦，请您重新上传。",
																	icon: "none",
																	mask: true,
																	duration: 2000,
																});
															}
														},
													});
												}
											},
											fail(e) {
												wx.hideLoading();
												wx.showToast({
													title: "上传失败",
													icon: "success",
													duration: 2000,
												});
											},
										});
									}, 1000);
								},
							});
							//压缩结束
						},
						fail(res) {
							wx.showToast({
								title: "请拍照上传",
								icon: "none",
								duration: 1000,
							});
						},
					});
				}
			},
			fail(res) {},
		});
	},
	//拍照调取原生组件方法
	takePhoto(e) {
		var that = this;
		//选取id号sfz--身份证，yyzz--营业执照
		const c = e.target.id;
		const ctx = wx.createCameraContext();
		ctx.takePhoto({
			quality: "high",
			success: res => {
				var tempImg = res.tempImagePath;

				wx.getImageInfo({
					src: tempImg,
					success: function (res) {
						//console.log(res.path);
						var _w = res.width;
						var _h = res.height;
						var relW = 700;
						var relH = parseInt((relW * _h) / _w);
						////console.log(relH)
						that.setData({
							canvasHeight2: 0.75 * relH,
							canvasWidth2: relW,
						});
						var ctx = wx.createCanvasContext("attendCanvasId2");
						ctx.drawImage(res.path, 0, 0, relW, relH);
						ctx.draw();

						setTimeout(function () {
							wx.canvasToTempFilePath({
								canvasId: "attendCanvasId2",
								x: 0,
								y: 0.2 * relH,
								width: relW,
								height: 0.6 * relH,
								destWidth: 600, //最终图片大小
								destHeight: parseInt((360 * relH) / relW),
								fileType: "jpg",
								quality: 0.7,
								success(res) {
									//这里是将图片上传到服务器中并识别
									//console.log(res.tempFilePath);

									//传值并关闭拍照界面
									that.setData({
										"takephoto.tempImage": res.tempFilePath,
										camera_flag: true, //隐藏拍照界面
										v: "0",
									});
									//判断调用身份证还是营业执照
									if (c == "sfz_take") {
										wx.showToast({
											title: "智能识别中...",
											icon: "loading",
											duration: 20000,
										});
										wx.uploadFile({
											url: App.globalData.URL + "upload", // 仅为示例，非真实的接口地址
											filePath: that.data.takephoto.tempImage,
											name: "file",
											formData: {
												option: "1",
											},
											header: {
												key: Date.parse(new Date()).toString().substring(0, 6),
												sessionId: wx.getStorageSync("sessionid"),
											},
											success: res => {
												wx.hideToast();
                                                if(res.data){
                                                    const result = JSON.parse(res.data)
                                                    if(result.rE_LEGALITY==="IdPhoto"){
                                                        that.setData({
                                                            flag_self_diy: false,
                                                            flag_self_ocr: true,
                                                            'form.name': result.rE_CUST_NAME,
                                                            'form.idCard': result.rE_CUST_ID,
                                                            'form.address': result.rE_ADDRESS
                                                          })
                                                    }else{
                                                        wx.showToast({
                                                            title: "请上传正常有效的身份证原件（不允许拍照身份证复印件，身份证二次拍照）",
                                                            icon: 'none',
                                                            mask: true,
                                                            duration: 2000
                                                          })
                                                    }
                                                  }else{
                                                    wx.showToast({
                                                        title: res.errMsg,
                                                        icon: 'none',
                                                        mask: true,
                                                        duration: 2000
                                                      })
                                                  } 
											},
										});
									} else if (c == "yyzz_take") {
										wx.showToast({
											title: "智能识别中...",
											icon: "loading",
											duration: 20000,
										});
										wx.uploadFile({
											url: App.globalData.URL + "upload", // 仅为示例，非真实的接口地址
											filePath: that.data.takephoto.tempImage,
											name: "file",
											formData: {
												option: "2",
											},
											header: {
												key: Date.parse(new Date()).toString().substring(0, 6),
												sessionId: wx.getStorageSync("sessionid"),
											},
											success: res => {
												wx.hideToast();
												if (res.data != "") {
													var result = JSON.parse(res.data);
													var provinceID = result.rE_REGISTER_ID.substring(2, 4);
													var cityID = result.rE_REGISTER_ID.substring(2, 6);
													var province = that.data.org_cities[provinceID];
													var city = that.data.org_cities[cityID];
													that.setData({
														flag_org_diy: false,
														flag_org_ocr: true,
														"form.orgID": result.rE_REGISTER_ID,
														"form.orgName": result.rE_COMPANY_NAME,
														"form.province": province,
														"form.city": city,
														"form.provinceCode": result.rE_REGISTER_ID.substring(2, 4),
														"form.cityCode": result.rE_REGISTER_ID.substring(2, 6),
														provinceName: province,
														cityName: city,
													});
												} else {
													wx.showToast({
														title: "您上传的图片太大啦，请您重新上传。",
														icon: "none",
														mask: true,
														duration: 2000,
													});
												}
											},
										});
									}
								},
							});
						}, 1000);
					},
				});
			},
			fail: res => {
				////console.log(res)
			},
		});
	},

	//重拍按钮
	reTake() {
		this.setData({
			camera_flag: true,
		});
		wx.showToast({
			title: "您已取消拍照",
			icon: "none",
			duration: 2000,
		});
	},
	//确定按钮
	chose() {
		this.setData({
			flag_self_ocr: false,
			preview_flag: true,
			v: "0",
		});
	},
	error(e) {
		////console.log(e.detail)
	},
	//手写input绑定form值
	blur(e) {
		let idname = e.target.id;
		if (idname == "orgID") {
			this.setData({
				"form.orgID": e.detail.value,
			});
		} else if (idname == "orgName") {
			this.setData({
				"form.orgName": e.detail.value,
			});
		} else if (idname == "officeAdd") {
			this.setData({
				"form.officeAdd": e.detail.value,
			});
		} else if (idname == "slider") {
			if (e.detail.value > 1000 || e.detail.value < 1) {
				this.setData({
					"form.slider": "",
				});
				wx.showToast({
					title: "请输入1-1000内的整数",
					mask: true,
					icon: "none",
					duration: 2000,
				});
			} else {
				this.setData({
					"form.slider": e.detail.value,
				});
			}
		} else if (idname == "applicantTel") {
			//console.log("22222");
			this.setData({
				"form.applicantTel": e.detail.value,
			});
		} else if (idname == "province") {
			this.setData({
				"form.province": e.detail.value,
			});
		} else if (idname == "city") {
			this.setData({
				"form.city": e.detail.value,
			});
		} else if (idname == "idCard") {
			this.setData({
				"form.idCard": e.detail.value,
			});
		} else if (idname == "name") {
			this.setData({
				"form.name": e.detail.value,
			});
		} else if (idname == "tel") {
			this.setData({
				"form.tel": e.detail.value,
			});
		} else if (idname == "managerID") {
			var that = this;
			this.setData({
				"form.managerID": e.detail.value,
			});
			if (that.data.form.orgName == null || that.data.form.orgName == "") {
				wx.showToast({
					title: "填写企业名称后才能显示客户经理姓名",
					icon: "none",
					duration: 3000,
				});
				return;
			}
			////console.log(that.data.form.managerID);
			////console.log(that.data.form.orgName);
			wx.request({
				// 获取token
				url: App.globalData.URL + "general",
				data: {
					IrbsUserID: that.data.form.managerID,
					customer: that.data.form.orgName,
				},
				header: {
					"content-type": "application/json", // 默认值
					key: Date.parse(new Date()).toString().substring(0, 6),
				},
				success(res) {
					//console.log(res);
					that.setData({
						trbsName: res.data.manageUserName == undefined ? "" : res.data.manageUserName,
					});
				},
			});
		}
		////console.log(this.data)
	},
	//同意框选中
	checkedList: function (e) {
		if (e.detail.value[0] == "true") {
			//以选中
			this.setData({
				checklist: "checked",
			});
		} else {
			this.setData({
				//反之
				checklist: "",
			});
		}
	},

	blurCity: function (e) {
		var that = this;
		var provinceID = e.detail.value.substring(2, 4);
		var cityID = e.detail.value.substring(2, 6);
		var province = that.data.org_cities[provinceID];
		var city = that.data.org_cities[cityID];
		that.setData({
			"form.orgID": e.detail.value,
			"form.province": province,
			"form.city": city,
			"form.provinceCode": provinceID,
			"form.cityCode": cityID,
			provinceName: province,
			cityName: city,
		});
	},

	//地区选择
	bindMultiPickerChange: function (e) {
		var arrs = [];
		var that = this;
		var provinceNameID = that.data.objectMultiArray[e.detail.value[0]].regid;
		var provinceName = that.data.objectMultiArray[e.detail.value[0]].regname;
		that.setData({
			"form.provinceCode": provinceNameID,
			"form.province": provinceName,
			provinceName: provinceName,
		});

		for (var i = 0; i < that.data.objectMultiArray.length; i++) {
			if (
				that.data.objectMultiArray[i].parid == that.data.objectMultiArray[e.detail.value[0]].regid &&
				that.data.objectMultiArray[i].regtype == 2
			) {
				arrs.push(that.data.objectMultiArray[i]);
			}
		}
		////console.log(arrs[e.detail.value[1]].regid)//市区ID
		var cityNameID = arrs[e.detail.value[1]].regid;
		var cityName = arrs[e.detail.value[1]].regname;
		that.setData({
			"form.cityCode": cityNameID,
			"form.city": cityName,
			cityName: cityName,
		});
		that.setData({
			"multiIndex[0]": e.detail.value[0],
			"multiIndex[1]": e.detail.value[1],
		});
	},
	//地区选择
	bindMultiPickerColumnChange: function (e) {
		var that = this;
		switch (e.detail.column) {
			case 0:
				list = [];
				for (var i = 0; i < that.data.objectMultiArray.length; i++) {
					if (that.data.objectMultiArray[i].parid == that.data.objectMultiArray[e.detail.value].regid) {
						list.push(that.data.objectMultiArray[i].regname);
					}
				}
				that.setData({
					"multiArray[1]": list,
					"multiIndex[0]": e.detail.value,
					"multiIndex[1]": 0,
				});
		}
	},
	//担保选择
	bindDanbaoPickerChange: function (e) {
		//console.log(e);
		var arrs = [];
		var that = this;
		var regid = that.data.danbaoMultiArray[e.detail.value[0]].regid;
		var regname = that.data.danbaoMultiArray[e.detail.value[0]].regname;
		this.setData({
			housees: [],
		});
		that.setData({
			// 'form.provinceCode': provinceNameID,
			// 'form.province': provinceName,
			danbaoNameFir: regname,
		});

		for (var i = 0; i < that.data.danbaoMultiArray.length; i++) {
			if (
				that.data.danbaoMultiArray[i].parid == that.data.danbaoMultiArray[e.detail.value[0]].regid &&
				that.data.danbaoMultiArray[i].regtype == 2
			) {
				arrs.push(that.data.danbaoMultiArray[i]);
			}
		}
		////console.log(arrs[e.detail.value[1]].regid)//市区ID
		var regid = arrs[e.detail.value[1]].regid;
		var regname = arrs[e.detail.value[1]].regname;
		that.setData({
			danbaoCodeSec: regid,
			// 'form.city': cityName,
			danbaoNameSec: regname,
		});
		////console.log(that.data.danbaoCodeSec)
		that.setData({
			"danbaoIndex[0]": e.detail.value[0],
			"danbaoIndex[1]": e.detail.value[1],
		});
		//console.log(that.data.form.idCard);
		if (regid == 20010010) {
			if (that.data.form.idCard == undefined || that.data.form.idCard == "" || that.data.form.idCard == null) {
				wx.showToast({
					title: "请先填写法人信息",
					icon: "none",
					duration: 2000,
				});
				that.setData({
					danbaoNameFir: "",
					danbaoNameSec: "",
					fangchuan: false,
				});
			} else {
				that.setData({
					coverBgray: false,
					fangchuan: true,
					pgflag: "pgflag on",
				});
				that.showPinggu();
			}
		} else {
			//coverBgray
			that.setData({
				totalPrice: "",
				coverBgray: true,
				fangchuan: false,
				pgflag: "pgflag",
			});
			if (that.animation != undefined) {
				that.animation.scale(1).step();
				that.setData({
					animation: that.animation.export(),
				});
			}

			if (that.animationHouse != undefined) {
				that.animationHouse.bottom(that.data.bot).step();
				that.setData({
					animationHouse: that.animationHouse.export(),
				});
			}
		}

		////console.log(that.data.danbaoIndex)
	},
	bindDanbaoPickerColumnChange: function (e) {
		var that = this;
		switch (e.detail.column) {
			case 0:
				list = [];
				for (var i = 0; i < that.data.danbaoMultiArray.length; i++) {
					if (that.data.danbaoMultiArray[i].parid == that.data.danbaoMultiArray[e.detail.value].regid) {
						list.push(that.data.danbaoMultiArray[i].regname);
					}
				}
				//console.log(list);

				that.setData({
					"danbaoArray[1]": list,
					"danbaoIndex[0]": e.detail.value,
					"danbaoIndex[1]": 0,
				});
		}

		if (that.data.form.name == "") {
			wx.showToast({
				title: "请先填写法人信息",
				icon: "none",
				duration: 2000,
			});
			that.setData({
				danbaoNameFir: "",
				danbaoNameSec: "",
			});
		}
	},

	addHouse: function () {
		let that = this;
		wx.navigateTo({
			url: "/pages/house/house?type=pg",
		});
	},
	//确定评估结果
	subHouse: function () {
		let that = this;
		//console.log(that.data.waitSubmit);
		let ans = [];
		for (var i = 0; i < that.data.waitSubmit.length; i++) {
			ans.push({
				area1: that.data.waitSubmit[i].mianji,
				asses_price1: that.data.waitSubmit[i].gujia2,
				floor1: that.data.waitSubmit[i].cenghao,
				loan_sum1: that.data.waitSubmit[i].kedai2,
				room1: that.data.waitSubmit[i].fanghao,
				story1: that.data.waitSubmit[i].buildingname1,
				total_floor1: that.data.waitSubmit[i].zonglouceng,
				village1: that.data.waitSubmit[i].buildingname,
				village_add1: that.data.waitSubmit[i].dizhi,
			});
		}
		//console.log(ans);
		that.setData({
			coverBgray: true,
			pgflag: "pgflag",
			housees: ans, //that.data.waitSubmit
			//pingguRes: true,
		});
		that.animation.scale(1).step();
		that.setData({
			animation: that.animation.export(),
		});

		that.animationPinggu = wx.createAnimation({
			duration: 500,
			timingFunction: "ease-in-out",
		});
		that.animationPinggu.bottom("-100%").step();
		that.setData({
			animationPinggu: that.animationPinggu.export(),
		});
	},
	//关闭评估
	closePG: function () {
		let that = this;
		that.setData({
			coverBgray: true,
			pgflag: "pgflag",
		});

		that.animation.scale(1).step();
		that.setData({
			animation: that.animation.export(),
		});
		that.animationPinggu = wx.createAnimation({
			duration: 500,
			timingFunction: "ease-in-out",
		});
		that.animationPinggu.bottom("-100%").step();
		that.setData({
			animationPinggu: that.animationPinggu.export(),
		});
	},
	//
	showPinggu: function () {
		let that = this;
		that.setData({
			coverBgray: false,
			pingguRes: false,
			pgflag: "pgflag on",
		});
		that.animation = wx.createAnimation({
			duration: 500,
			timingFunction: "ease-in-out",
		});
		that.animation.scale(0.95).step();
		that.setData({
			animation: that.animation.export(),
		});

		that.animationPinggu = wx.createAnimation({
			duration: 500,
			timingFunction: "ease-in-out",
		});
		that.animationPinggu.bottom(0).step();
		that.setData({
			animationPinggu: that.animationPinggu.export(),
		});

		if (that.data.list1.length == 0) {
			wx.showLoading({
				title: "加载中...",
			});
            House.getHouseInfoByUserID().then(res=>{

                var s = [];
                if (res.length>0) {
                  for (var i = 0; i < res.length; i++) {
                    //console.log(res[i].BUILDINGNAME)
                    s.push({
                      buildingname: res[i].COMMUNITYNAME,
                      cityId: res[i].CITY_ID,
                      houseid: res[i].ID,
                      dizhi: res[i].ADDRESS,
                      gujia: (res[i].SALEPRICE * 0.0001).toFixed(0),
                      kedai: (res[i].SALEPRICE * 0.00007).toFixed(0),
                      shijian: res[i].CREATE_DATE.substring(4, 6),
                      shijian1: res[i].CREATE_DATE.substring(6, 8),
                      area: res[i].AREA,
                      floor3: res[i].FLOORNUMBER,
                      buildingname1: res[i].BUILDINGNAME,
                      allfloor3: res[i].TOTALFLOOR,
                      louhao: res[i].BUILDINGNAME,
                      cenghao: res[i].FLOORNUMBER,
                      fanghao: res[i].HOUSENAME,
                      zonglouceng: res[i].TOTALFLOOR,
                      mianji: res[i].AREA,
                      gujia2: res[i].SALEPRICE, //估价具体金额//上传一般业务
                      kedai2: (res[i].SALEPRICE * 0.7).toFixed(0), //上传一般业务
                    })
                  }
                }
                this.setData({
                  list1: s
                })
                wx.hideLoading();
            })
            
            wx.request({
				url: App.globalData.URL + "getpricecount",
				data: {
					open_id: wx.getStorageSync("openid"),
				},
				header: {
					"content-type": "application/x-www-form-urlencoded",
					key: Date.parse(new Date()).toString().substring(0, 6),
				},
				success: res => {
					//console.log(res.data);
					this.setData({
						count: res.data,
					});
				},
			});
		}
	},

	//选择评估结果
	checkboxChange: function (e) {
		// this.setData({
		//   housees: []
		// })
		//console.log(e);
		var that = this;

		var list = that.data.list1;
		var check = e.detail.value; //checkvalue值唯一编码
		var gujia = 0;
		var kedai = 0;
		// var floor3 = '';
		var buildingname1 = "";
		var allfloor3 = "";
		var buildingname = "";
		var dizhi = "";
		var gujia2 = 0;
		var kedai2 = 0;

		var _ind = [];
		for (var i = 0; i < list.length; i++) {
			let contain = false;
			// that.data.list1[i]['checked'] = 'false';
			for (var j = 0; j < check.length; j++) {
				// //console.log(list[i].houseid)
				if (list[i].houseid == check[j]) {
					_ind.push(i); //存储选中但但后期数组会边
					contain = true;
					break;
				} else {
					// list[i].checked = false
					contain = false;
				}
			}
			if (contain) {
				list[i].checked = true;
			} else {
				list[i].checked = false;
			}
		}
		that.setData({});

		//console.log(_ind + "ssssssss");
		var checkArr = [];
		//选中的
		for (var i = 0; i < _ind.length; i++) {
			checkArr.push(list[_ind[i]]);
		}
		//console.log(checkArr);
		that.setData({
			waitSubmit: checkArr,
		});

		if (check.length == 3) {
			wx.showToast({
				title: "最多可以抵押三套房产",
				icon: "none",
				mask: true,
				duration: 2000,
			});
			//未选的
			var ans = list.filter(n => !checkArr.includes(n));
		} else if (check.length > 3) {
			wx.showModal({
				title: "提示",
				content: "住宅抵押套数超限，请您重新选择",
				showCancel: false,
				success: function (res) {
					for (var i = 0; i < list.length; i++) {
						list[i].checked = false;
					}
					that.setData({
						list1: list,
						chkFlag: false,
						kedai: 0,
						gujia: 0,
					});
				},
			});
		}

		for (var i in check) {
			for (var j in list) {
				if (check[i] == list[j].houseid) {
					gujia += parseInt(list[j].gujia);
					kedai += parseInt(list[j].kedai);
					// floor3 = list[j].floor3;
					buildingname1 = list[j].buildingname1;
					// allfloor3 = list[j].allfloor3;
					buildingname = list[j].buildingname;
					dizhi = list[j].dizhi;
					gujia2 = list[j].gujia2;
					kedai2 = list[j].kedai2;
				}
			}
		}
		////console.log(this.data.housees)
		this.setData({
			// count1: check.length,
			gujia: gujia,
			kedai: kedai,
			// floor3: floor3,
			buildingname1: buildingname1,
			// allfloor3: allfloor3,
			buildingname: buildingname,
			dizhi: dizhi,
			gujia2: gujia2,
			kedai2: kedai2,
			list1: list,
		});
	},
	//选择评估结果
	checkboxChange2: function () {
		var that = this;
		var list = that.data.list1;
		// var check = e.detail.value; //checkvalue值唯一编码
		var gujia = 0;
		var kedai = 0;
		// var floor3 = '';
		var buildingname1 = "";
		var allfloor3 = "";
		var buildingname = "";
		var dizhi = "";
		var gujia2 = 0;
		var kedai2 = 0;

		var _ind = [];
		for (var i = 0; i < list.length; i++) {
			// that.data.list1[i]['checked'] = 'false';
			// //console.log(list[i].houseid)
			if (list[i].checked) {
				_ind.push(i); //存储选中但但后期数组会边
			}
		}

		var checkArr = [];
		//选中的
		for (var i = 0; i < _ind.length; i++) {
			checkArr.push(list[_ind[i]]);
		}
		//console.log(checkArr);
		that.setData({
			waitSubmit: checkArr,
		});

		if (checkArr.length == 3) {
			wx.showToast({
				title: "最多可以抵押三套房产",
				icon: "none",
				mask: true,
				duration: 2000,
			});
			//未选的
			var ans = list.filter(n => !checkArr.includes(n));
		} else if (checkArr.length > 3) {
			wx.showModal({
				title: "提示",
				content: "住宅抵押套数超限，请您重新选择",
				showCancel: false,
				success: function (res) {
					for (var i = 0; i < list.length; i++) {
						list[i].checked = false;
					}
					that.setData({
						list1: list,
						chkFlag: false,
						kedai: 0,
						gujia: 0,
					});
				},
			});
		}
		for (var i = 0; i < checkArr.length; i++) {
			//   //console.log('gujia',gujia)
			// //console.log('kedai',kedai)
			//   //console.log("gujia",checkArr[i].gujia)
			//   //console.log('kedai',checkArr[i].kedai)
			gujia += parseInt(checkArr[i].gujia);
			kedai += parseInt(checkArr[i].kedai);
			// floor3 = list[j].floor3;
			buildingname1 = checkArr[i].buildingname1;
			// allfloor3 = list[j].allfloor3;
			buildingname = checkArr[i].buildingname;
			dizhi = checkArr[i].dizhi;
			gujia2 = checkArr[i].gujia2;
			kedai2 = checkArr[i].kedai2;
		}
		//console.log(gujia, gujia);
		//console.log(kedai, kedai);

		this.setData({
			// count1: check.length,
			gujia: gujia,
			kedai: kedai,
			// floor3: floor3,
			buildingname1: buildingname1,
			// allfloor3: allfloor3,
			buildingname: buildingname,
			dizhi: dizhi,
			gujia2: gujia2,
			kedai2: kedai2,
		});
	},

	prePage() {
		wx.navigateBack();
	},
	indexpage: function () {
		wx.switchTab({
			url: "/pages/shop/index2",
		});
	},

	userInfo: function () {
		//console.log(App.globalData.userInfo);
		if (App.globalData.userInfo) {
			this.setData({
				userInfo: App.globalData.userInfo,
				hasUserInfo: true,
			});
		} else if (this.data.canIUse) {
			// 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
			// 所以此处加入 callback 以防止这种情况
			App.userInfoReadyCallback = res => {
				this.setData({
					userInfo: res.userInfo,
					hasUserInfo: true,
				});
			};
		} else {
			// 在没有 open-type=getUserInfo 版本的兼容处理

		}
	},
	//取消登录
	logincancel: function () {
		var that = this;
		// that.setData({
		// 	loginFlag: true,
		// });
		wx.navigateBack({
			delta: 1,
		});
		// wx.showLoading({
		//   title: '未授权登录',
		//   mask:true,
		//   duration:5000
		// })
		// wx.switchTab({
		// 	url: "/pages/shop/index2",
		// });
	},

	apli: function () {
		var that = this;
		// 查看是否授权
		user
			.getIdentityInfo()
			.then(res => {
			})
			.catch(err => {
				if (err === "unSelectIdcard") {
					wx.showModal({
						title: "提示",
						content: "请先进行身份证拍照认证",
						showCancel: true, //是否显示取消按钮
						success: function (res) {
							if (!res.confirm) {
								wx.navigateBack({
									delta: 1,
								});
							} else {
								wx.redirectTo({
									url: "/sub1/pages/auth/index?type=2&url=/sub3/pages/common/apli",
								});
							}
						},
					});
				}
			});
	},
	businesCard: function (e) {
		let that = this;
		that.setData({
			flag_org_diy: false,
			flag_org_ocr: true,
		});

		wx.showLoading({
			title: "数据加载中...",
			mask: true,
		});

		//wx.request 成功后执行
		wx.hideLoading();
	},
	pickBC: function (e) {
		let that = this;
		//console.log(that.data.busiCardList[e.detail.value] + "sddsad");
		that.setData({
			bcindex: e.detail.value,
        }),
        
        Org.getEnterpriseInfoByName(that.data.busiCardList[e.detail.value]).then(res=>{
            //console.log(res)
            that.setData({
                'form.orgID': res.ORG_CODE,
                'form.orgName': res.ORG_NAME,
                'form.officeAdd': res.ORG_ADDRESS,
              })
    
              let provinceID = res.ORG_CODE.substring(2, 4);
              let cityID = res.ORG_CODE.substring(2, 6);
              let province = that.data.org_cities[provinceID];
              let city = that.data.org_cities[cityID];
              that.setData({
                "form.province": province,
                "form.city": city,
                'form.provinceCode': provinceID,
                'form.cityCode': cityID,
                "provinceName": province,
                "cityName": city
              })
           
          }).catch(err=>{
              //console.log(err)
          })
},
});
