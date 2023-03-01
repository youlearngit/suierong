var app = getApp();
import utils from './utils';
import requestYT from '../../../api/requestYT';
import user from '../../../utils/user';
import api from '../../../utils/api';

export default class Talent {

	static policyDisplay(policy) {
		// NAME				政策名称
		// SYMBOL			发文文号
		// DOCDATE			发文时间
		// EFFECTTIME		生效时间
		// LOSEEFFECTTIME	失效时间

		policy.AREA_text = policy.AREANAME || policy.AREA; // 适用地区
		policy.ISEFFECT_text = utils.policyFields().is_effects[policy.ISEFFECT]; // 是否有效
		policy.OBJECTTYPE_text = utils.policyFields().object_types[policy.OBJECTTYPE]; // 对象类型
		policy.POLICYLEVEL_text = utils.policyFields().policy_levels[policy.POLICYLEVEL]; // 政策层级
		policy.POLICYTYPE_text = utils.policyFields().policy_types[policy.POLICYTYPE]; // 政策类别
		policy.TWOPOLICYTYPE_text = utils.policyFields().two_policy_types[policy.POLICYTYPE][policy.TWOPOLICYTYPE]; // 政策子类别

		policy.SUPPORTOBJECT_html = utils.textToHtml(policy.SUPPORTOBJECT); // 支持政策（支持对象）
		policy.POLICYCONTENT_html = utils.textToHtml(policy.POLICYCONTENT); // 支持对象（政策内容）
		policy.APPLYPROCESS_html = utils.textToHtml(policy.APPLYPROCESS); // 申请流程
		policy.OTHERDEMAND_html = utils.textToHtml(policy.OTHERDEMAND); // 其他要求
		policy.MANAGEDEPT_html = utils.textToHtml(policy.MANAGEDEPT); // 政策依据（主管部门）
		policy.CONSULTWAY_html = utils.textToHtml(policy.CONSULTWAY); // 咨询方式

		// 政策标签
		policy.POLICYLABEL_text = policy.POLICYLABEL.split(',').map(function(x){return utils.policyFields().policy_labels[x]}).join('，');

		return policy;
	}

	static policyOrderby(policys,area) {
		let data = policys;

		data.sort(function(x,y){
			return x.NAME.localeCompare(y.NAME);
		})
		
		for (let i in data) {
			data[i]._orderby = data.length - parseInt(i);
			if (area) {
				// 320102 320100 320000
				if (data[i].AREA==area) {
					data[i]._orderby += 1000
				} else if (data[i].AREA.substr(0,4)==area.substr(0,4)) {
					data[i]._orderby += 900
				} else if (data[i].AREA.substr(0,2)==area.substr(0,2)) {
					data[i]._orderby += 800
				}
			}
		}

		data.sort(function(x,y){
			return y._orderby - x._orderby;
		})

		return data;
	
	}

	static async getNetwork(page,limit) {
		let options = {
			url: 'jsyh/getNetwork.do',
			data: JSON.stringify({
				PAGE_SIZE: limit?limit+"":"300",
				NEXT_KEY: page?page+"":"1",
				week: new Date().getDay() + ''
			}),
		};
		let res = await requestYT(options);
		// res.NEXT_KEY:2 res.PAGE_NUM:300 res.TOTAL_NUM:566
		// res.LIST[0]: 
		// CITY: "320100000000"
		// C_AM: "8:30-12:00"
		// C_PM: "14:00-17:00"
		// ID: "304"
		// LOCATION_LAT_NAVI: "32.0554449"
		// LOCATION_LONG_NAVI: "118.78470211"
		// ORG_ADDRESS: "南京市中山路338号"
		// ORG_CODE: "3111"
		// ORG_FULL_NAME: "江苏银行股份有限公司南京鼓楼支行"
		// ORG_SHORT_NAME: "南京鼓楼支行"
		// P_AM: "8:30-12:00"
		// P_PM: "12:00-17:00"
		// TELE_COMPANY: "025-58588499"
		// TELE_PERSONAL: "025-58588498"
		if (res.STATUS === '1') {
			return res;
		}
		return Promise.reject(new Error(res.result_msg));
	}

	static async getShareIntid({openid}) {
		let options = {
			url: 'talent/intid.do',
			data: {
				openId: openid, //被分享人
			},
		};
		let res = await requestYT(options);
		
		if (res.STATUS === '1') {
			return res;
		}
		return Promise.reject(new Error(res.result_msg));
	}
  static async searchById(data) {
		let options = {
			url: 'policyMon/searchById.do',
			data: data,
		};
		let res = await requestYT(options);
		
		if (res.STATUS === '1') {
			return res;
		}
		return Promise.reject(new Error(res.result_msg));
	}
	static async record({openid,path,location,time,phone,idcard,talent_level,share_intid}) {
		let options = {
			url: 'talent/record.do',
			data: {
				OPENID: openid,
				ACCESS_PATH: path, // 访问路径
				ACCESS_TIME: time, // 访问时间
				LOCATION: location,
				REMARK1: phone || '', // 手机号
				REMARK2: utils.getBBXChannel().track_name, // 渠道号
				REMARK3: idcard || '', // 身份证号
				REMARK4: talent_level || '', // 人才等级
				REMARK5: share_intid || '', // 分享人intid
			},
		};
		let res = await requestYT(options);
		
		if (res.STATUS === '1') {
			return res;
		}
		return Promise.reject(new Error(res.result_msg));
	}

	static async hjycStaff() {
		let res = await this.selectStaff({type:6});
		let staffs = res.LIST || [];
		if (staffs.length>0) {
			for (let i in staffs) {
				staffs[i].TYPE = staffs[i].ID.split('_')[0]; // 特殊处理: ID=`${TYPE}_${ID}`
			}
		}
		return staffs;
	}

	static async tdycStaff() {
		let res = await this.selectStaff({type:4});
		let staffs = res.LIST || [];
		if (staffs.length>0) {
			for (let i in staffs) {
				staffs[i].TYPE = staffs[i].ID.split('_')[0]; // 特殊处理: ID=`${TYPE}_${ID}`
			}
		}
		return staffs;
		
		/* 前端写死方案
		// return [{
		// 	AGENCYNO: "2921",
		// 	AREA: "320282",
		// 	CITY: "320200",
		// 	HEAD: "",
		// 	ID: "45",
		// 	JOB: "普惠金融部经理",
		// 	LABEL1: "科技金融",
		// 	LABEL2: "人才金融",
		// 	LABEL3: "普惠金融",
		// 	PROVINCE: "320000",
		// 	RESUME: "江苏银行支持人才创新创业",
		// 	STAFFNAME: "钱海涛",
		// 	TEL: "18352590101",
		// 	TYPE: "1",
		// 	WORKUNIT: "江苏银行无锡宜兴支行",
		// },{
		// 	AGENCYNO: "2921",
		// 	AREA: "320282",
		// 	CITY: "320200",
		// 	HEAD: "",
		// 	ID: "4555",
		// 	JOB: "",
		// 	LABEL1: "人才政策",
		// 	LABEL2: "人才计划",
		// 	LABEL3: "人才服务",
		// 	PROVINCE: "320000",
		// 	RESUME: "提供人才政策资讯、政策解读等各类服务。",
		// 	STAFFNAME: "李科长",
		// 	TEL: "18352590101",
		// 	TYPE: "2",
		// 	WORKUNIT: "宜兴市人才办",
		// }]
		*/
	}

	static async selectStaff({type,code,adcode_type}) {	
		// code: adcode(adcode_type:1|2|4) 机构号(adcode_type:3)
		// type: 1,2-金融服务专员&政策服务专员 3-创业导师 4-特殊(宜兴-陶都英才) 5-总行专员 6-特殊(上海-海聚英才)
		// adcode_type: 1-区xxxxxx 2-市xxxx00 3-支行机构 4-省xx0000
		type = type+'';
		let data = { type };
		if (code) {
			code = code+'';
			data.code = code;
		}
		if (!adcode_type && code) { 
			adcode_type = '1'
			if (code.substr(4)=='00') {
				adcode_type = '2';
			}
			if (code.substr(2)=='0000') {
				adcode_type = '4';
			}
		}
		if (adcode_type) {
			data.adcode_type = adcode_type;
		}

		let options = {
			url: 'talent/selectStaff.do',
			data: data,
		};
		let res = await requestYT(options);
		
		if (res.STATUS === '1') {
			return res;
		}
		return Promise.reject(new Error(res.result_msg));
  }
  	// 政策月历查询接口
	static async monthSearch(MONTH) {
		let options = {
			url: 'policyMon/search.do',
			data: {
				MONTH, //月份
				// RANK, //级别
				// AREA, //所属区域
				// CLASSIFICATION, //类别
				// EVENTNAME, //政策/活动名称
				// EVENTTIME, //申报电话
				// REPORT, //申报对象 
				// SUPPORTPOLICY, //支持政策
				// ACTIVITYCONTENT,//活动内容
				// ENDTIME,//截至时间
				// DECLARATIONADDRESS,//申报地址
				// CONSULTINGDEP,//咨询部门
				// CONSULTINGPHONE,//咨询电话
				// ACTIVITYLINK,//活动链接
				// // IDS,
			},
			// ifEncrypt:false
		};
		let res = await requestYT(options);
		if (res.STATUS === '1') {
			return res;
		}
		return Promise.reject(new Error(res.result_msg));
	}

	static async search(data) {
		let options = {
			url: 'treasure/search.do',
			data:data
		};
		let res = await requestYT(options);
		
		if (res.STATUS === '1') {
			return res;
		}
		return Promise.reject(new Error(res.result_msg));
	}
	static async slByName(name) {
		let options = {
			url: 'talent/slByName.do',
			data: {
				STAFFNAME: name,
			},
		};
		let res = await requestYT(options);
		
		if (res.STATUS === '1') {
			return res;
		}
		return Promise.reject(new Error(res.result_msg));
	}

	static async slByArea(date1,date2,area,policy_level,policy_type,word) {
		let options = {
			url: 'talent/slByArea.do',
			data: {
				DOCDATESTART: date1 || '', //2021-01-01
				DOCDATEEND: date2 || '', //2021-12-31
				AREA: area || '', //320100
				POLICYLEVEL: policy_level || '', //3
				POLICYTYPE: policy_type || '', //1100
				word: word || '', //金山
				ROLEID: utils.getBBXChannel().name, // 渠道
			}
		};
		let res = await requestYT(options);

		if (res.STATUS === '1') {
			return res;
		}
		return Promise.reject(new Error(res.result_msg));
	}

	static async slPolicyByTerm(date1,date2,area,policy_level,policy_type,word) {
		let options = {
			url: 'talent/slPolicyByTerm.do',
			data: {
				DOCDATESTART: date1 || '', //2021-01-01
				DOCDATEEND: date2 || '', //2021-12-31
				AREA: area || '', //320100
				POLICYLEVEL: policy_level || '', //3
				POLICYTYPE: policy_type || '', //1100
				word: word || '', //金山
				ROLEID: utils.getBBXChannel().name, // 渠道
			}
		};
		let res = await requestYT(options);

		if (res.STATUS === '1') {
			return res;
		}
		return Promise.reject(new Error(res.result_msg));
	}

	static async slByLabel(tags) {
		let options = {
			url: 'talent/slByLabel.do',
			data: {
				POLICYLABEL: tags,
				ROLEID: utils.getBBXChannel().name, // 渠道
			}
		};
		let res = await requestYT(options);

		if (res.STATUS === '1') {
			return res;
		}
		return Promise.reject(new Error(res.result_msg));
	}

	static async slPolicyByLabel(tags) {
		let options = {
			url: 'talent/slPolicyByLabel.do',
			data: {
				POLICYLABEL: tags,
				ROLEID: utils.getBBXChannel().name, // 渠道
			}
		};
		let res = await requestYT(options);

		if (res.STATUS === '1') {
			return res;
		}
		return Promise.reject(new Error(res.result_msg));
	}

	static async readPdf(POLICYPDF) {
		let options = {
			url: 'talent/readPdf.do',
			data: {
				POLICYPDF
			},
			ifEncrypt: false,
		};
		let res = await requestYT(options);
		if (res.STATUS === '1') {
			return res;
		}
		return Promise.reject(new Error(res.result_msg));
	}

	static async selectDetail(IDString) {
		let options = {
			url: 'talent/selectDetail.do',
			data: {
				IDString
			}
		};
		let res = await requestYT(options);
		if (res.STATUS === '1') {
			return res;
		}
		return Promise.reject(new Error(res.result_msg));
	}

	// 政策月历查询接口
	static async monthSearch(MONTH,YEAR) {
		let options = {
			url: 'policyMon/search.do',
			data: {
        MONTH, //月份
        YEAR //年份
				// RANK, //级别
				// AREA, //所属区域
				// CLASSIFICATION, //类别
				// EVENTNAME, //政策/活动名称
				// EVENTTIME, //申报电话
				// REPORT, //申报对象 
				// SUPPORTPOLICY, //支持政策
				// ACTIVITYCONTENT,//活动内容
				// ENDTIME,//截至时间
				// DECLARATIONADDRESS,//申报地址
				// CONSULTINGDEP,//咨询部门
				// CONSULTINGPHONE,//咨询电话
				// ACTIVITYLINK,//活动链接
				// // IDS,
			},
			// ifEncrypt:false
		};
		let res = await requestYT(options);
		if (res.STATUS === '1') {
			return res;
		}
		return Promise.reject(new Error(res.result_msg));
	}

	static async selectPolicy(word) {
		let options = {
			url: 'talent/selectPolicy.do',
			data: {
				word,
				ROLEID: utils.getBBXChannel().name, // 渠道
			}
		};
		let res = await requestYT(options);
		if (res.STATUS === '1') {
			return res;
		}
		return Promise.reject(new Error(res.result_msg));
	}

	static async slPolicyByType(sub_type,word) {
		let options = {
			url: 'talent/slPolicyByType.do',
			data: {
				TWOPOLICYTYPE: sub_type,
				word,
				ROLEID: utils.getBBXChannel().name, // 渠道
			}
		};
		let res = await requestYT(options);

		if (res.STATUS === '1') {
			return res;
		}
		return Promise.reject(new Error(res.result_msg));
	}

	static async noteSelect() {
		let {openid} = await this.getMine();
		let options = {
			url: 'talent/noteSelect.do',
			data: {
				OPENID: openid,
			}
		};
		let res = await requestYT(options);

		if (res.STATUS === '1') {
			return res;
		}
		return Promise.reject(new Error(res.result_msg));
	}

	static async noteChoose(QA) {
		let {openid} = await this.getMine();
		let options = {
			url: 'talent/noteChoose.do',
			data: {
				OPENID: openid,
				REMARK1: QA,
			}
		};
		let res = await requestYT(options);

		if (res.STATUS === '1') {
			return res;
		}
		return Promise.reject(new Error(res.result_msg));
	}

	static async rsaTalent({tel,idcard}) {
		let options = {
			url: 'talent/rsaTalent.do',
			data: {
				tel,
				idcard,
			}
		};
		let res = await requestYT(options);

		if (res.STATUS === '1') {
			return res;
		}
		return Promise.reject(new Error(res.result_msg));
	}

	static async phoneDecrypt(e) {
		let res,phone;
		try {
			res = await api.decryptData(e.detail.encryptedData, e.detail.iv);
			phone = res.phoneNumber;
		} catch(err) {
			
		}
		if (phone) {
			app.globalData.bbx_customer_phone = phone;
		}
		return phone;
	}

	static async getMine() {
		let openid = app.globalData.bbx_customer_openid || wx.getStorageSync('openid') || '';
		let phone = app.globalData.bbx_customer_phone || '';
		let idcard = app.globalData.bbx_customer_idcard || '';
		let intid = app.globalData.bbx_customer_intid || '';

		let res;

		if (!openid || !phone || !intid) {
			try {
				res = await user.getCustomerInfo();
			} catch(err) {
				wx.showModal({
					title: '提示',
					content: '请您先授权登录',
					showCancel: false,
					success: function(res) {
						if (res.confirm) {
							wx.navigateTo({
								// url: '/sub1/pages/auth/index',
								url: '/pages/mine/mine',
							})
						} else {
							wx.navigateBack({
								// delta: 1,
							})
						}
					}
				});
				return {openid, phone, idcard, intid};
			}
			openid = res.OPEN_ID || '';
			phone = res.TEL || '';
			idcard = res.ID_CARD || '';
			intid = res.INT_ID || '';
			app.globalData.bbx_customer_openid = openid;
			app.globalData.bbx_customer_phone = phone;
			app.globalData.bbx_customer_idcard = idcard;
			app.globalData.bbx_customer_intid = intid;
		}
		
		return { openid, phone, idcard, intid };
	}

	/**
	 * 
	 * @param {*} pathid 
	 * @param {*} extraData 
	 * 	{
	 * 		phone: '',
	 * 		idcard: '',
	 * 		talent_level: '',
	 * 		share_intid: '',
	 * 	}
	 */
	static async tracking(pathid,extraData={}) {
		let {openid,phone,idcard} = await this.getMine();
		let talent_level = '';
		
		if (!openid) {
			return;
		}
		
		let paths = {
			1: '进入百宝箱',
			2: '使用政策匹配',
			3: '使用便捷搜索',
			4: '使用政策资讯',
			5: '使用人才认证',

			6: '使用金融服务工具-人才信用卡',
			7: '使用金融服务工具-人才专享理财',
			8: '使用金融服务工具-人才消费贷',
			9: '使用金融服务工具-人才经营贷',
			10: '使用金融服务工具-人才投',
			11: '使用金融服务工具-人才租',

			12: '使用增值服务工具-房贷计算器',
			13: '使用增值服务工具-房产评估',
			14: '使用增值服务工具-创业咨询',
			15: '使用增值服务工具-结汇购汇',
			16: '使用增值服务工具-附近网点',

		}
		if (!paths[pathid]) {
			return;
		}

		let path = `${pathid} ${paths[pathid]}`;
		let time = Date.DateFormat(new Date(),'yyyy-MM-dd hh:mm:ss');

		let pages = getCurrentPages();
		let page = pages[pages.length-1];
		let route = page.route; // sub3/pages/bbx/home

		utils.getUserLocation().then(res=>{
			let location = res;

			phone = extraData.phone || phone;
			idcard = extraData.idcard || idcard;
			talent_level = extraData.talent_level || talent_level;

			if (!phone) {
				return;
			}

			let share_intid = extraData.share_intid || '';

			this.record({
				openid, 
				path, 
				location: location.values.join(' '), 
				time,
				phone,
				idcard,
				talent_level,
				share_intid,
			})
		});
	}

}