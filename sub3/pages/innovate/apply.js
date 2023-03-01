// sub3/pages/innovate/apply.js
var app = getApp();
import utils from './utils';
import innovation from './innovation';
import user from '../../../utils/user';
import api from '../../../utils/api';
import WxValidate from '../../../assets/plugins/wx-validate/WxValidate';
var util = require("../../../utils/util.js");

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		preffixUrl: utils.preffixUrl(),
		mine: {},

		orders: false,
		
		picker_array: { },
		
		search_ents: [],

		popup_agreement: {show:false}, // 法人模式 授权框
		popup_agreement_send: {show:false}, // 非法人模式 授权框
		popup_howuse: {show:false}, // 如何使用

		canvas_share: {}, // 分享图片

		location: {}, // 用户定位
		bankList: [], // 网点数据
		bankLoc: {}, // 最近网点
		
		nodes_def: {
			step_all: ["identity","enterprise","empower","tax","apply","finish"], // 所有步骤
			step: "", // 当前步骤
			created: "", // 创建时间
			updated: "", // 最后更新时间
			mode: "", // 模式 fr-法人模式 nofr-非法人模式
			identity: {
				phone: "", // 手机号
				zjhm: "", // 证件号码
				face: "", // 人脸识别
				real_name: "", // 真实姓名
			},
			enterprise: {
				cust_no: "", // 客户号
				dwmc: "", // 单位名称
				usci: "", // 统一社会信用代码
				zcdz: "", // 注册地址
				email: "", // 邮箱
				frxm: "", // 法人姓名
				gsyyzt: "", // 工商营业状态
				zcclsj: "", // 注册成立时间
				zcdz_sheng_bm: "", // 注册地址省编码
				zcdz_sheng_nm: "", // 注册地址省
				zcdz_shi_bm: "", // 注册地址市编码
				zcdz_shi_nm: "", // 注册地址市
				zcdz_qu_bm: "", // 注册地址区编码
				zcdz_qu_nm: "", // 注册地址区
				txdz_sheng_bm: "", // 通讯地址省编码
				txdz_sheng_nm: "", // 通讯地址省
				txdz_shi_bm: "", // 通讯地址市编码
				txdz_shi_nm: "", // 通讯地址市
				txdz_qu_bm: "", // 通讯地址区编码
				txdz_qu_nm: "", // 通讯地址区
				txdz: "", // 通讯地址
				lxr: "", // 联系人姓名
				lxrphone: "", // 联系人手机
				lxrtel: "", // 联系人电话
				lxremail: "", // 联系人邮箱
			},
			empower: {
				res: "",
				pdf_path: "", // 授权书path
				batch_id: "", // 授权书batchID
				agree: false, // 同意协议
			},
			tax: {
				res: "",
				nszt: "", // 纳税状态
			},
			apply: {
				// 企业补充信息
				sshy: "", sshy_idx: "", // 所属行业
				ygrs: "", // 员工人数
				sfzsjysgxq: "", sfzsjysgxq_idx: "", // 是否高新区
				gxqmc: "", gxqmc_idx: "", // 高新区
				kjqyfhq: "", kjqyfhq_idx: "", // 科技企业孵化器
				txdz: "", // 通讯地址
				postalcode: "", // 邮政编码

				// 账户信息
				khhmc: "", // 开户行名称
				zhmc: "", // 账户名称
				yhzh: "", // 银行账户

				// 创新券服务信息
				ssjsly: "", ssjsly_idx: "", // 主营产品所属技术领域
				cxqnsyfx: "", cxqnsyfx_idx: "", // 创新券拟使用方向
				ldbm: "", ldbm_idx: "", // 联动部门
			},
		},
		nodes: {},

	},

	inputTapEvent(e) {
		let {event,value} = e.currentTarget.dataset;
		let {search_ents,nodes,mine} = this.data;

		switch(event) {
			case "enterprise_dwmc":{
				if (!nodes.enterprise) { nodes.enterprise = {} }
				nodes.enterprise.dwmc = value || "";
				this.nodesWithEnterprise(nodes).then(res_nodes=>{
					nodes = res_nodes;
					search_ents = [];
					this.setData({search_ents,nodes});
					this.nodeDisplay(true);
					if (nodes.enterprise && nodes.enterprise.zcdz_qu_bm) {
						this.pickerInit(); // 根据企业所在城市区码 初始化选择项
					}
				})
			}break;
			default:{}break;
		}

	},

	inputEvent(e) {
		let {value} = e.detail;
		let {event} = e.currentTarget.dataset;
		let {search_ents} = this.data;
		
		switch(event) {
			case "enterprise_dwmc":{
				if (value && value.length>=4) {
					innovation.getQyName({keyWord:value}).then(res=>{
						if (res.entNamesList && res.entNamesList.length>0) {
							search_ents = res.entNamesList.map(x=>{return {name:x.entNames}});
						} else {
							search_ents = [];
						}
						this.setData({search_ents})
					}).catch(err=>{
						this.showModal(err)
					})
				} else {
					search_ents = [];
					this.setData({search_ents})
				}
			}break;
			default:{}break;
		}

	},

	popupEvent(e) {
		let {event,action} = e.currentTarget.dataset;

		switch(event) {
			case "popup_agreement_send":{
				this.canvasShareInit();
			}break;
			default:{}break;
		}

		switch(action) {
			default:{
				this.setData({ [event+'.show']: !this.data[event].show });
			}break;
		}
		
	},

	onChangeCKB(e) {
		let {event} = e.currentTarget.dataset;
		let {nodes} = this.data;

		switch(event) {
			case "empower_agree": {
				if (nodes.step == "empower") {
					this.setData({ [event]:e.detail });
				}
			}break;
			default: {
				this.setData({ [event]:e.detail });
			}break;
		}		
	},

	pdfReadUrl(e) {
		let {pdf} = e.currentTarget.dataset;
		let {preffixUrl} = this.data;
		
		if (!pdf) { return; }

		wx.showLoading({
            title: '加载中',
            mask: true,
		});
		wx.downloadFile({
			url: `${preffixUrl}/${pdf}.pdf`,
			success: res => {
				wx.openDocument({
					filePath: res.tempFilePath,
					fileType: 'pdf',
					success: res => {
						wx.hideLoading();
					},
					fail: err => {
						wx.showToast({
							title: '查看失败'+err,
							icon: 'none'
						});
					},
				})
			},
			fail: err => {
				wx.showToast({
					title: '加载失败'+err,
					icon: 'none'
				});
			}
		});

	},

	pdfReadBase64(base64,name="") {
		name = name || Date.DateFormat(new Date(),'yyyyMMddhhmmss');
		let filePath = wx.env.USER_DATA_PATH + '/' + name + '.pdf';
		let fileData = base64;
		wx.showLoading({
            title: '加载中',
            mask: true,
		});
		wx.getFileSystemManager().writeFile({
			filePath: filePath,
			data: fileData,
			encoding: 'base64',
			success: res => {
				wx.showToast({
					title: '下载成功'+filePath,
					icon: 'none',
					duration: 1500
				});
				
				wx.openDocument({
					filePath: filePath,
					fileType: 'pdf',
					success: (res)=>{
					},
					fail: (err)=>{
						wx.showToast({
							title: '查看失败'+err,
							icon: 'none'
						});
					},
					complete: (res)=>{
						wx.hideLoading();
					}
				})
			},
			fail: err => {
				wx.hideLoading();
				wx.showToast({
					title: '下载失败',
					icon: 'none'
				});
			}
		})
	},

	async pdfReadPath(path) {
		wx.showLoading({
            title: '打开中',
            mask: true,
		});
		let res = await innovation.readPdf({POLICYPDF:path});
		wx.hideLoading();
		this.pdfReadBase64(res.PDF);
	},

	authIndex(e) {
		wx.showModal({
			title: '提示',
			content: '请您先录入个人信息',
			showCancel: false,
			success: function(res) {
				if (res.confirm) {
					wx.navigateTo({
						url: '/sub1/pages/auth/index',
					})
				} else {
					wx.navigateBack({
						// delta: 1,
					})
				}
			}
		});
	},

	async faceRecogLoad(e) {
		let {mine} = this.data;
		let res;

		if (app.innovate_face_info) {
			return "suc";
		}
		
		if (!mine.OPEN_ID) {
			this.authIndex();
			return ""; // OPEN_ID fail
		}
		try {
			res = await user.getFaceVerify(mine.OPEN_ID);
			// 已人脸识别
			/*
			res:
				CHECK_ALIVE_TYPE: "2"
				ERRCODE: "0"
				ERRMSG: "0startFacialRecognitionVerifyAndUploadVideo:ok"
				OPEN_ID: "xxxxxx"
				VERIFY_DATE: "20211022"
				VERIFY_TIME: "172809"
			*/
			return "suc";
		} catch (err) {
			// 未人脸识别
			return ""; // err
		}
	},

	async faceRecog(e) {
		let {mine} = this.data;

		if (!mine.REAL_NAME || !mine.ID_CARD) {
			this.authIndex();
			return;
		}
		wx.checkIsSupportFacialRecognition({
			success() {
				wx.startFacialRecognitionVerifyAndUploadVideo({
					name: mine.REAL_NAME,
					idCardNumber: mine.ID_CARD,
					checkAliveType: 2,
					success: function (res) { },
					fail: function (err) { },
					complete: res => {
						/*
						res:
							errCode: 0
							errMsg: "startFacialRecognitionVerifyAndUploadVideo:ok"
							verifyResult: "xxxxxx"
						*/
						if (res.errCode === 0) { // 识别成功
							app.innovate_face_info = res;
							user.addFaceInfo("0", res.errCode+res.errMsg).then(res=>{ });
						} else { // 识别失败
							app.innovate_face_info = false;
							user.addFaceInfo("1", res.errCode+res.errMsg).then(res=>{ });
						}
					},
				});
			},
			fail(err) {
				// 开发者工具暂时不支持此 API 调试，请使用真机进行开发
				// 识别失败
				wx.showToast({
					title: "您的微信版本暂不支持人脸识别，请您先升级。",
					icon: "none",
				});
				app.innovate_face_info = false;
				user.addFaceInfo("1", "设备不支持人脸").then(res=>{ });
			},
		});
	},

	async mineLoad(e) {
		let {mine} = this.data;
		mine = await innovation.getMine();
		// ID_CARD INT_ID NICK_NAME OPEN_ID REAL_NAME TEL
		if (!mine.ID_CARD || !mine.TEL) {
			this.authIndex();
		}
		this.setData({mine});
	},

	showModal(content,suc=()=>{}) {
		wx.hideLoading();
		if(typeof(content)=="object") {
			content = content.currentTarget.dataset.content;
		}
		wx.showModal({
			title: "提示",
			content: content,
			showCancel: false,
			success: suc,
		});
	},

	async bankListInit(e) {
		let {bankList,location,bankLoc} = this.data;
		location = await utils.getUserLocation();
		if (bankList.length==0) {
			for (let page=1;page<3;page++) {
				let res = await innovation.getNetwork(page);
				if (res.LIST) {
					bankList = bankList.concat(res.LIST)
				}
				if (!res.NEXT_KEY) {
					break;
				}
			}
			for (let i in bankList) {
				bankList[i].ORG_FULL_NAME = bankList[i].ORG_FULL_NAME.replace(/股份有限公司/g,'');
				if (['江苏银行股份有限公司','江苏银行'].indexOf(bankList[i].ORG_FULL_NAME)>-1) {
					continue;
				}
	
				if (!bankList[i].LOCATION_LONG_NAVI || !bankList[i].LOCATION_LAT_NAVI) {
					continue;
				}
				bankList[i].distance_km = util.getDistance(
					location.latitude,
					location.longitude,
					bankList[i].LOCATION_LAT_NAVI,
					bankList[i].LOCATION_LONG_NAVI
				);
				bankList[i].distance = util.calcDistance(
					location.longitude,
					location.latitude,
					bankList[i].LOCATION_LONG_NAVI,
					bankList[i].LOCATION_LAT_NAVI
				);
				if (bankList[i].distance_km < 1) {
					bankList[i].distance = parseInt(bankList[i].distance_km*1000) + 'm';
				}
			}
			bankList.sort(function(x,y){
				return x.distance_km - y.distance_km;
			});
		}
		bankLoc = bankList.find(x=>x.distance_km);
		this.setData({bankList,location,bankLoc});
	},

	async nodesWithApply(nodes) {
		let res;
		wx.showLoading({
			title: '加载中',
			mask: true,
		})

		if (!nodes.apply) { nodes.apply = {} }

		if (!nodes.apply.khhmc) { // 补全可能有的银行账号数据
			let bkCard = false;
			if (nodes.enterprise.cust_no) {
				res = await innovation.ED0208({KEHHAO:nodes.enterprise.cust_no});
				if (res.F02081List) {
					bkCard = res.F02081List.find(x=>x.jILUZT=="0");
				}
			}
			if (bkCard) {
				res = await innovation.selectOrgname({ORGCODE:bkCard.yNGYJG});
				nodes.apply.khhmc = res.ORGNAME || ""; // 开户行名称
				nodes.apply.zhmc = bkCard.zHUZWM || ""; // 账户名称
				nodes.apply.yhzh = bkCard.zHANGH || ""; // 银行账户
			} else {
				await this.bankListInit();
				let {bankList,location,bankLoc} = this.data;
				this.showModal(`尊敬的客户，您的企业还不是江苏银行开户企业，您可就近网点进行开户（${bankLoc.ORG_FULL_NAME}，${bankLoc.ORG_ADDRESS})，或者输入其他银行账号。`);
			}
		}

		wx.hideLoading();
		return nodes;
	},

	async nodesWithEnterprise(nodes) {
		let {mine} = this.data;
		let res;
		if (!nodes.enterprise || !nodes.enterprise.dwmc) { return nodes; }

		wx.showLoading({
			title: '加载中',
			mask: true,
		})

		let res_ent = await innovation.getBusInfo({ openid:mine.OPEN_ID, companyName:nodes.enterprise.dwmc });
		res_ent = res_ent._stringData || {};
		if (!res_ent.cREDITCODE || !res_ent.rEGORGCODE) {
			wx.hideLoading();
			this.showModal("企业信息获取失败");
			return nodes;
		}
		if (res_ent.rEGORGCODE.substr(0,4) == "3212") {
			wx.hideLoading();
			this.showModal("泰州市暂不支持领取科技创新券");
			return nodes;
		}

		nodes.enterprise.usci = res_ent.cREDITCODE || "";
		nodes.enterprise.dwmc = res_ent.eNTNAME || "";
		nodes.enterprise.zcclsj = res_ent.eSDATE || "";
		nodes.enterprise.gsyyzt = res_ent.eNTSTATUS || ""; // 工商营业状态

		// 联系人（暂用申请人'当前登录用户'代替）
		nodes.enterprise.lxr = mine.REAL_NAME || ""; // 联系人姓名
		nodes.enterprise.lxrphone = mine.TEL || ""; // 联系人手机
		nodes.enterprise.lxrtel = mine.TEL || ""; // 联系人电话
		nodes.enterprise.lxremail = ""; // 联系人邮箱

		// 模式 法人or非法人
		nodes.mode = "fr";
		try {
			res = await innovation.getBusInfo({
				type: "5",
				companyName: nodes.enterprise.dwmc,
				checkIdcard: mine.ID_CARD,
				checkName: mine.REAL_NAME,
			})
			if (res.check_result == "0") { // 非法人
				nodes.mode = "nofr";
			}
		} catch (err) { // 非法人
			nodes.mode = "nofr";
		}

		// 法人
		if (nodes.mode == "fr") { // 法人模式
			nodes.enterprise.frxm = res_ent.fRNAME || ""; // 法定代表人姓名
			nodes.enterprise.frphone = mine.TEL || ""; // 法定代表人手机号
			nodes.enterprise.frzjlx = "居民身份证"; // 证件类型(码值暂写中文)
			nodes.enterprise.frzjhm = mine.ID_CARD || ""; // 证件号码
		} else { // 非法人模式
			nodes.enterprise.frxm = res_ent.fRNAME || "";
			nodes.enterprise.frphone = "";
			nodes.enterprise.frzjlx = "";
			nodes.enterprise.frzjhm = "";
		}

		let res_adr = await utils.getLocationByAdcode(res_ent.rEGORGCODE);
		if (res_ent.rEGORGCODE == "320103") { // 白下区(已撤销区特殊处理)
			res_adr = {
				adcode: "320103",
				city: "南京市",
				codes: ["320000", "320100", "320103"],
				district: "白下区",
				latitude: "32.05838",
				longitude: "118.79647",
				province: "江苏省",
				values: ["江苏省", "南京市", "白下区"],
			}
		}

		// 注册地址
		nodes.enterprise.zcdz = res_ent.dOM || ""; // 注册地址
		nodes.enterprise.zcdz_sheng_bm = res_adr.codes[0] || ""; // 注册地址省编码
		nodes.enterprise.zcdz_sheng_nm = res_adr.values[0] || ""; // 注册地址省
		nodes.enterprise.zcdz_shi_bm = res_adr.codes[1] || res_adr.codes[0] || ""; // 注册地址市编码
		nodes.enterprise.zcdz_shi_nm = res_adr.values[1] || res_adr.values[0] || ""; // 注册地址市
		nodes.enterprise.zcdz_qu_bm = res_adr.codes[2] || res_adr.codes[1] || res_adr.codes[0] || ""; // 注册地址区编码
		nodes.enterprise.zcdz_qu_nm = res_adr.values[2] || res_adr.values[1] || res_adr.values[0] || ""; // 注册地址区

		// 通讯地址（暂用注册地址代替）
		nodes.enterprise.txdz = nodes.enterprise.zcdz; // 通讯地址
		nodes.enterprise.txdz_sheng_bm = nodes.enterprise.zcdz_sheng_bm; // 通讯地址省编码
		nodes.enterprise.txdz_sheng_nm = nodes.enterprise.zcdz_sheng_nm; // 通讯地址省
		nodes.enterprise.txdz_shi_bm = nodes.enterprise.zcdz_shi_bm; // 通讯地址市编码
		nodes.enterprise.txdz_shi_nm = nodes.enterprise.zcdz_shi_nm; // 通讯地址市
		nodes.enterprise.txdz_qu_bm = nodes.enterprise.zcdz_qu_bm; // 通讯地址区编码
		nodes.enterprise.txdz_qu_nm = nodes.enterprise.zcdz_qu_nm; // 通讯地址区

		if (!nodes.apply) { nodes.apply = {} }
		nodes.apply.txdz = nodes.enterprise.txdz;

		// 企业客户号
		nodes.enterprise.cust_no = "";
		try {
			let res_cust = await innovation.selectCustomNo({RESOLVE_TYPE:"2",PARTY_NAME:res_ent.eNTNAME});
			nodes.enterprise.cust_no = res_cust.ECIF_CUST_NO || "";
		} catch(err) {
			// 不能识别该客户
			nodes.enterprise.cust_no = "";
		}

		wx.hideLoading();
		return nodes;
	},

	nodeDisplay(refresh=false) { // 返显数据model:value处理
		let {nodes_def,nodes} = this.data;
		let node_data = {};
		for (let k of nodes_def.step_all) {
			if (nodes[k]) {
				for (let kk in nodes_def[k]) {
					node_data[`${k}_${kk}`] = nodes[k][kk];
				}
			}
		}		
		for (let k in node_data) {
			if (!this.data[k] || refresh) {
				this.setData({ [k]:node_data[k] });
			}
		}
	},

	async stepLoad(e) {
		let {nodes_def,nodes,mine,orders} = this.data;
		let that = this;
		let res;
		
		if (!nodes.step_all) {  // 所有步骤
			nodes.step_all = nodes_def.step_all;
		}
		if (!nodes.step) { // 当前步骤
			nodes.step = nodes_def.step_all[0];
		}
		if (!nodes.created) { // 创建时间
			nodes.created = Date.parse(new Date()) / 1000;
		}
		if (!nodes.identity) { nodes.identity = {} }
		if (!nodes.identity.phone) { nodes.identity.phone = mine.TEL || "" }
		if (!nodes.identity.zjhm) { nodes.identity.zjhm = mine.ID_CARD || "" }
		if (!nodes.identity.face) { nodes.identity.face = await that.faceRecogLoad() }
		if (!nodes.identity.real_name) { nodes.identity.real_name = mine.REAL_NAME || "" }
		
		that.setData({ nodes });
		that.nodeDisplay();
		that.pickerInit();
		
		let nodes_id = nodes.id;
		if (nodes_id) {
			res = await innovation.selectByUsci({IDString:nodes_id})
			nodes = JSON.parse(res.REMARK1);
			nodes.id = nodes_id;

			if (nodes.step == "apply") {
				nodes = await this.nodesWithApply(nodes);
			}

			that.setData({ nodes });		
			that.nodeDisplay();
			that.pickerInit();
		} else {
			if (orders === false) {
				res = await innovation.selectOrder({OPENID:mine.OPEN_ID})
				orders = res.LIST || [];
				if (orders.length>0) {
					// orders = orders.filter(x=>x.STATUS=="0"&&x._REMARK1.created&&x._REMARK1.mode); // 旧数据结构有缺失，2022-02-25投产日线上旧数据已清
					orders = orders.filter(x=>x.STATUS=="0");
				}
				that.setData({ orders });
				if (orders.length>0) { // 加载最近一次暂存数据
					wx.showModal({
						title: "提示",
						content: "是否继续最近的一条申领记录",
						success: (res)=>{
							if (res.confirm) {
								nodes = JSON.parse(orders[0].REMARK1);
								nodes.id = orders[0].IDID;
							} else {
								innovation.deleteOrder({IDID:orders[0].IDID});
							}
						},
						complete: async (res)=>{
							if (nodes.step == "apply") {
								nodes = await this.nodesWithApply(nodes);
							}

							that.setData({ nodes });
							that.nodeDisplay();
							that.pickerInit();
						}
					});
				}
			}
		}

	},
	
	async stepNext(e) {
		let {nodes_def,nodes,picker_array,mine} = this.data;
		let date_now = new Date();
		let res,find;

		wx.showLoading({
			title: '提交中',
			mask: true,
		})
		
		let step_num = nodes_def.step_all.indexOf(nodes.step);
		if (step_num >= nodes_def.step_all.length-1 || step_num == -1) {
			this.showModal("申领已结束或步骤异常");
			return; 
		}

		if (!nodes[nodes.step]) { nodes[nodes.step] = {} }

		for (let k in nodes_def[nodes.step]) {
			nodes[nodes.step][k] = this.data[`${nodes.step}_${k}`] || nodes[nodes.step][k] || "";
			if (k.substr(-4)=="_idx") { // picker处理
				let {id,name} = picker_array[`${nodes.step}_${k.substr(0,k.length-4)}`][nodes[nodes.step][k]] || {id:"",name:""};
				nodes[nodes.step][`${k.substr(0,k.length-4)}`] = id
				nodes[nodes.step][`${k.substr(0,k.length-4)}_name`] = name;
			}
		}

		// 表单验证
		if (nodes.step == "identity") { // 身份认证
			this.WxValidate = new WxValidate({
				phone: { required:true, tel:true, },
				zjhm: { required:true, idcard:true, }
			}, {
				phone: { required:"请输入手机号", },
				zjhm: { required:"请输入身份证号", }
			});
			if (!this.WxValidate.checkForm(nodes.identity)) {
				this.showModal(this.WxValidate.errorList[0].msg);
				return;
			}
			if (nodes.identity.face != "suc") {
				this.showModal("身份认证需要人脸识别");
				return;
			}
		}
		if (nodes.step == "enterprise") { // 企业基本信息
			this.WxValidate = new WxValidate({
				dwmc: { required:true, orgName:true, },
				usci: { required:true, orgID:true, },
				zcdz: { required:true, },
				email: { required:true, email:true, },
			}, {
				dwmc: { required:"请输入企业名称", },
				usci: { required:"请输入统一社会信用代码", },
				zcdz: { required:"请输入注册地址", },
				email: { required:"请输入邮箱", },
			});
			if (!this.WxValidate.checkForm(nodes.enterprise)) {
				this.showModal(this.WxValidate.errorList[0].msg);
				return;
			}
			
			// eg. 91320114580471246H 江苏谷科软件有限公司
			res = await innovation.ED0270({creditcode:nodes.enterprise.usci, epname:nodes.enterprise.dwmc})
			if (res.kjqykInfo) {
				// 判断科技中小
				find = res.kjqykInfo.find( x=> (x.type=="2" || x.rzsort.indexOf("科技型中小")!=-1) && (x.year==date_now.getFullYear() || x.year==date_now.getFullYear()-1) );
				if (find) {
					
				} else {
					this.showModal("抱歉，您暂不符合科技创新券的申领条件");
					return;
				}
			} else {
				this.showModal("抱歉，您暂不符合科技创新券的申领条件");
				return;
			}

		}
		if (nodes.step == "empower") { // 签署征信与综合授权书
			if (!nodes.empower.res) {
				this.showModal("签署征信与综合授权书 您需要法人授权");
				return;
			}
			if (nodes.empower.agree != true) {
				this.showModal("您需要阅读并同意相关协议");
				return;
			}
		}
		if (nodes.step == "tax") { // 企业纳税数据查询授权
			if (!nodes.tax.res) {
				this.showModal("企业纳税数据查询授权 需要等待验证");
				return;
			}

			// 查询创新券的申领情况
			res = await innovation.queryOrder({usci:nodes.enterprise.usci});
			if (res.cxqslzt == "0" || !res.cxqslzt) {

			} else {
				this.showModal("该企业今年已申请过江苏省科技创新券");
				return;
			}
		}
		if (nodes.step == "apply") { // 创新券申领信息
			this.WxValidate = new WxValidate({
				sshy: { required:true, },
				ygrs: { required:true, digits:true },
				sfzsjysgxq: { required:true, },
				gxqmc: { required:nodes.apply.sfzsjysgxq=="1"?true:false, },
				txdz: { required:true, },
				postalcode: { required:true, },
				khhmc: { required:true, },
				zhmc: { required:true, },
				yhzh: { required:true, },
				ssjsly: { required:true, },
				cxqnsyfx: { required:true, },
				ldbm: { required:true, },
			}, {
				sshy: { required:"请选择所属行业", },
				ygrs: { required:"请输入员工人数", digits:"请输入有效的员工人数" },
				sfzsjysgxq: { required:"请选择是否在省级以上高新区", },
				gxqmc: { required:"请选择高新区", },
				txdz: { required:"请输入通讯地址", },
				postalcode: { required:"请输入邮政编码", },
				khhmc: { required:"请输入开户行名称", },
				zhmc: { required:"请输入账户名称", },
				yhzh: { required:"请输入银行账户", },
				ssjsly: { required:"请选择主营产品所属技术领域", },
				cxqnsyfx: { required:"请选择创新券拟使用方向", },
				ldbm: { required:"请选择联动部门", },
			});
			if (!this.WxValidate.checkForm(nodes.apply)) {
				this.showModal(this.WxValidate.errorList[0].msg);
				return;
			}
		}

		// 表单验证通过
		nodes.step = nodes_def.step_all[step_num + 1];

		let order_json = "";
		if (nodes.step == "finish") {
			// 提交创新券申领的参数
			let order_params = {
				parameter: "jsbchina_cxqsl",
				usci: nodes.enterprise.usci || "", // 统一社会信用代码
				dwmc: nodes.enterprise.dwmc || "", // 单位名称
				zcdz_sheng_bm: nodes.enterprise.zcdz_sheng_bm || "", // 注册地址省编码
				zcdz_sheng_nm: nodes.enterprise.zcdz_sheng_nm || "", // 注册地址省
				zcdz_shi_bm: nodes.enterprise.zcdz_shi_bm || "", // 注册地址市编码
				zcdz_shi_nm: nodes.enterprise.zcdz_shi_nm || "", // 注册地址市
				zcdz_qu_bm: nodes.enterprise.zcdz_qu_bm || "", // 注册地址区编码
				zcdz_qu_nm: nodes.enterprise.zcdz_qu_nm || "", // 注册地址区
				zcdz: nodes.enterprise.zcdz || "", // 详细地址
				email: nodes.enterprise.email || "", // 邮箱
				phone: nodes.identity.phone || "", // 手机号
				zcclsj: nodes.enterprise.zcclsj || "", // 注册成立时间
				sshy: nodes.apply.sshy || "", // 所属行业编码
				sshy_name: nodes.apply.sshy_name || "", // 所属行业
				ygrs: nodes.apply.ygrs || "", // 员工人数
				sfzsjysgxq: nodes.apply.sfzsjysgxq || "", // 是否在省级以上高新区
				gxqmc_nm: nodes.apply.gxqmc_name || "", // 高新区名称
				gxqmc_bm: nodes.apply.gxqmc || "", // 高新区编码
				sfzsjyskjqyfhq: nodes.apply.kjqyfhq ? "1" : "2", // 是否在省级以上科技企业孵化器 1-是 2-否
				kjqyfhq_nm: nodes.apply.kjqyfhq_name || "", // 科技企业孵化器
				kjqyfhq_bm: nodes.apply.kjqyfhq || "", // 科技企业孵化器编码
				lxr: nodes.enterprise.lxr || "", // 联系人姓名
				lxrphone: nodes.enterprise.lxrphone || "", // 联系人手机
				lxrtel: nodes.enterprise.lxrtel || "", // 联系人电话
				lxremail: nodes.enterprise.lxremail || nodes.enterprise.email ||"", // 联系人邮箱
				txdz_sheng_bm: nodes.enterprise.txdz_sheng_bm || "", // 通讯地址省编码
				txdz_sheng_nm: nodes.enterprise.txdz_sheng_nm || "", // 通讯地址省
				txdz_shi_bm: nodes.enterprise.txdz_shi_bm || "", // 通讯地址市编码
				txdz_shi_nm: nodes.enterprise.txdz_shi_nm || "", // 通讯地址市
				txdz_qu_bm: nodes.enterprise.txdz_qu_bm || "", // 通讯地址区编码
				txdz_qu_nm: nodes.enterprise.txdz_qu_nm || "", // 通讯地址区
				txdz: nodes.enterprise.txdz || "", // 通讯地址
				postalcode: nodes.apply.postalcode || "", // 邮政编码
				frxm: nodes.enterprise.frxm || "", // 法定代表人姓名
				frphone: nodes.enterprise.frphone || "", // 法定代表人手机号
				frzjlx: nodes.enterprise.frzjlx || "", // 证件类型
				frzjhm: nodes.enterprise.frzjhm || "", // 证件号码
				khhmc: nodes.apply.khhmc || "", // 开户行名称
				zhmc: nodes.apply.zhmc || "", // 账户名称
				yhzh: nodes.apply.yhzh || "", // 银行账户
				nsrsbh: "", // 纳税人识别号 eg.91320192MA1P4L7A79 91320114580471246H
				nszt: "", // 纳税状态 eg.正常
				gsyyzt: nodes.enterprise.gsyyzt || "", // 工商营业状态
				ldbm_bm: nodes.apply.ldbm || "", // 联动部门 编码
				ldbm_nm: nodes.apply.ldbm_name || "", // 联动部门
				ssjsly: nodes.apply.ssjsly || "", // 主营产品所属技术领域 编码
				ssjsly_name: nodes.apply.ssjsly_name || "", // 主营产品所属技术领域
				cxqnsyfx: nodes.apply.cxqnsyfx || "", // 创新券拟使用方向 编码
				ascription: "jsbchina", // 归属单位
			}
			order_json = JSON.stringify(order_params);
			// res = await innovation.referOrder(order_params); // 改用后端轮询提交（前端暂不提交）
		}
		
		// 暂存每步骤
		nodes.updated = Date.parse(new Date()) / 1000;
		res = await innovation.createOrder({
			OPENID: mine.OPEN_ID, 
			IDString: nodes.id || "", 
			USCI: nodes.enterprise ? (nodes.enterprise.usci || "") : "", 
			DWMC: nodes.enterprise ? (nodes.enterprise.dwmc || "") : "", 
			REMARK1: JSON.stringify(nodes), 
			REMARK2: order_json || "",
			BATCHID: nodes.empower ? (nodes.empower.batch_id || "") : "",
			STATUS: nodes.step == "finish" ? "4" : "0",
		})
		if (res.IDID) {
			nodes.id = res.IDID;
		}

		this.setData({nodes});
		this.nodeDisplay(true);
		
		wx.hideLoading();

		if (nodes.step == "finish") {
			this.showModal("申领提交成功",()=>{
				// wx.navigateBack()
				wx.navigateTo({
					url: '/sub3/pages/innovate/result',
				})
			})
		}
		if (nodes.step == "apply") {
			nodes = await this.nodesWithApply(nodes);
			this.setData({nodes});
			this.nodeDisplay(true);
		}
	},

	stepCancel(e) {
		wx.navigateBack({});
	},

	async dataLoad(e) {
		await this.mineLoad();
		await this.stepLoad();
		await this.taxInit();
		await this.pickerInit();
	},

	async empowerPdfRead(e) {
		let {nodes,mine} = this.data;
		let res;
		wx.showLoading({
            title: "打开中",
            mask: true,
		});
		if (!nodes.empower) { nodes.empower = {} }
		if (!nodes.empower.pdf_path) {
			if (nodes.mode != "fr") {
				wx.hideLoading();
				this.showModal("非法人打开失败");
				return;
			}
			res = await innovation.empowerSignature({
				USCI: nodes.enterprise.usci, 
				DWMC: nodes.enterprise.dwmc,
				sqname: nodes.enterprise.dwmc,
				frIdCard: mine.ID_CARD || nodes.identity.zjhm,
			});
			nodes.empower.pdf_path = res.pdfPath;
			nodes.empower.batch_id = res.BatchID;
		}
		this.setData({nodes});
		wx.hideLoading();
		this.pdfReadPath(nodes.empower.pdf_path);
	},

	async empowerFR(e) {
		let {nodes,popup_agreement,mine} = this.data;
		let res;
		if (nodes.empower && nodes.empower.res == "suc") {
			return;
		}
		wx.showLoading({
            title: '授权中',
            mask: true,
		});
		if (!nodes.empower) { nodes.empower = {} }
		if (!nodes.empower.pdf_path) {
			if (nodes.mode != "fr") {
				wx.hideLoading();
				this.showModal("非法人打开失败");
				return;
			}
			res = await innovation.empowerSignature({
				USCI: nodes.enterprise.usci, 
				DWMC: nodes.enterprise.dwmc,
				sqname: nodes.enterprise.dwmc,
				frIdCard: mine.ID_CARD || nodes.identity.zjhm,
			});
			nodes.empower.pdf_path = res.pdfPath;
			nodes.empower.batch_id = res.BatchID;
		}
		nodes.empower.res = "suc";
		popup_agreement.show = false;
		wx.hideLoading()
		this.setData({ nodes, popup_agreement });
		this.nodeDisplay(true);
	},

	async taxSuc(e) {
		let {nodes} = this.data;
		if (!nodes.tax) { nodes.tax = {} }
		nodes.tax.res = "suc";
		this.setData({nodes});
		this.stepNext();
	},

	async taxInit(e) {
		let {mine} = this.data;
		let that = this;
		
		app.innovate_tax_notify_need = true;
		app.innovate_tax_callback = async (res)=>{ // 税务验证成功回调
			app.innovate_tax_notify_need = false;
			await that.taxSuc(res);
			wx.navigateBack({});
		}
		app.innovate_tax_notify_callback = async (res)=>{ // 税务页后台通知
			if (!app.innovate_tax_notify_need) { return }
			if (mine.TEL) { await innovation.sendMsg({phone:mine.TEL}) }
			app.innovate_tax_notify_need = false;
		}
	},

	async pickerInit(e) {
		let {picker_array,nodes} = this.data;
		let area = nodes.enterprise ? (nodes.enterprise.zcdz_qu_bm || "") : "";
		Object.assign(picker_array, await innovation.pickerArr(area));
		this.setData({picker_array});
	},

	async canvasShareInit(e) {
		let {preffixUrl,canvas_share,nodes} = this.data;
		let that = this;

		let promise_imgs = [];
		let promise_arr = [];

		promise_arr.push(
			new Promise(function (resolve, reject) {
				wx.getImageInfo({
					src: preffixUrl + 'empower_share_bg.png',
					success: (res)=>{
						promise_imgs.push(res);
						resolve(res);
					},
					fail: (err)=>{
						reject(err);
					},
				});
			})
		);

		await Promise.all(promise_arr);
		
		let ctx = wx.createCanvasContext('canvas_share');
		canvas_share = {
			width: promise_imgs[0].width,
			height: promise_imgs[0].height,
		}
		this.setData({canvas_share});

		ctx.drawImage(promise_imgs[0].path, 0, 0, canvas_share.width, canvas_share.height);
		ctx.save();

		ctx.setTextAlign('left');
		ctx.setFillStyle('#FFFFFF');

		ctx.setFontSize(38);
		ctx.fillText(nodes.identity.real_name, 30, 74);
		ctx.save();

		ctx.setFontSize(28)
		ctx.fillText("正在办理“创新券”", 30, 114);
		ctx.save();

		ctx.setFontSize(26)
		ctx.fillText("(申请需由您授权确认)", 30, 160);
		ctx.save();

		ctx.draw(false, function() {
			setTimeout(() => {
				wx.canvasToTempFilePath({
					canvasId: 'canvas_share',
					x: 0,
					y: 0,
					width: canvas_share.width,
					height: canvas_share.height,
					destWidth: canvas_share.width,
					destHeight: canvas_share.height,
					quality: 1,
					success: (res) => {
						canvas_share.tempFilePath = res.tempFilePath;
						that.setData({canvas_share});
					},
					fail: (err) => { },
				});
			}, 100);
		});	

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

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		this.dataLoad();
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
		this.dataLoad().then(res=>{
			wx.stopPullDownRefresh();
		})
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
		let {popup_agreement_send,nodes,preffixUrl,canvas_share} = this.data;

		if (popup_agreement_send.show) { // 分享给法人授权页
			popup_agreement_send.show = false;
			this.setData({popup_agreement_send});

			let img = canvas_share.tempFilePath || `${preffixUrl}empower_share_bg.png`;
			let params = `&id=${nodes.id}`;
			let title = "创新券";
			let url = "sub3/pages/innovate/empower";
			return api.shareApp(img, params, title, url);
		}

	}

})