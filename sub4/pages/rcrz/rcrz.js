var app = getApp();
import utils from './utils';
import requestYT from '../../../api/requestYT';
import user from '../../../utils/user';
import api from '../../../utils/api';

export default class Rcrz {

	static async getMine() {

		let mine = utils.getGlobalData('mine') || {};
		let res;

		if (!mine.INT_ID) {
			try {
				res = await user.getCustomerInfo();
			} catch (err) {
				wx.showModal({
					title: '提示',
					content: '请您先授权登录',
					showCancel: false,
					success: function (res) {
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
				return mine;
			}
			mine = res;
			utils.setGlobalData('mine', mine);
		}

		return mine;
	}

	/**
	 * jsyh/queryRencai.do
	 * *getTalentPlans
	 */
	static async queryRencai({
		rcjhmc,
		rcdj
	}) {
		let options = {
			url: "jsyh/queryRencai.do",
			data: JSON.stringify({
				rcjhmc,
				rcdj
			})
		};
		let res = await requestYT(options);
		if (res.STATUS === '1' && res.result) {
			return JSON.parse(res.result);
		}
		return Promise.reject(new Error('暂无人才相关数据'));
	}

	/**
	 * jsyh/queryRencaiMsg.do
	 * *Order.getTalentApply
	 */
	static async queryRencaiMsg({
		openid,
		cert_no
	}) {
		let options = {
			url: 'jsyh/queryRencaiMsg.do',
			data: JSON.stringify({
				openid,
				cert_no,
			}),
		};
		let res = await requestYT(options);
		if (res.STATUS === '1') {
			return res.flag;
		}
		return Promise.reject(new Error(res.result_msg));
	}

	/**
	 * jsyh/addRencai.do
	 * *user.addTalentInfo
	 */
	static async addRencai({
		ORDER_NUMBER, // 认证订单编号 ''

		// 申请人
		OPEN_ID, // 申请人openid
		APPLY_NAME, // 申请人名 mine.REAL_NAME
		APPLY_CERT_NO, // 申请人证件号码 mine.ID_CARD
		PHONE_NO, // 申请人联系方式 mine.TEL

		IS_SELF_FLAG, // 是否本人申请 '是'/'否'

		// 人才
		CERT_TYPE, // 证件类型 1-身份证 (REQTB2)
		CERT_NO, // 证件号码
		PERSON_NAME, // 人才姓名
		CUST_PHONE_NO, // 人才联系号码
		CUST_EDU, // 学历码
		CUST_OCC, // 职业码
		CUST_CADR, // 工作地区码 统一码.substring(2, 8)
		CUST_INC, // 年收入(税前 万元)
		COMPANY_NAME, // 工作单位名称
		CREDIT_CODE, // 统一信用机构代码
		TAL_REL_TYPE, // 与企业关系码

		// 影像
		NODE_INFO, // BatchId 人才身份证件
		NODE_INFO_SP, // BatchId 人才资质证明材料

		// 人才计划
		STO_FLAG, // 是否在省人才库内 1-是 0-否
		INC_FLAG, // 是否列入政府人才计划 1-是 0-否
		SUPPORT_LEVEL, // 列入政府人才计划时 人才等级数 否则为'5'
		LEVELNAME, // 列入政府人才计划时 人才等级名称 否则为''
		RATE_AREA, // 列入政府人才计划时 人才评定地区码 否则为''
		AREANAME, // 列入政府人才计划时 人才评定地区名 否则为''
		PLAN_NAME, // 列入政府人才计划时 人才计划名称 否则为''
		RATE_YEAR, // 列入政府人才计划时 人才评定年份 否则为''

	}) {
		let data = arguments[0];
		let options = {
			url: 'jsyh/addRencai.do',
			data: JSON.stringify(data),
		};
		let res = await requestYT(options);
		if (res.STATUS === '1' && res.result_code === '0000') {
			return Promise.resolve(res);
		}
		return Promise.reject(new Error(res.result_msg));
	}

	/**
	 * 人才认证数据暂存
	 * rcrz/saveRcrzData.do
	 */
	static async saveRcrzData({
		openId,
		batchId,
		requestData
	}) {
		let options = {
			url: 'rcrz/saveRcrzData.do',
			data: {
				openId,
				batchId,
				requestData,
			},
		};
		let res = await requestYT(options);
		if (res.STATUS === '1') {
			return Promise.resolve(res);
		}
		return Promise.reject(new Error(res.msg));
	}

	/**
	 * 查询人才认证暂存数据
	 * rcrz/selectRcrzData.do
	 */
	static async selectRcrzData({
		openId
	}) {
		let options = {
			url: 'rcrz/selectRcrzData.do',
			data: {
				openId,
			},
		};
		let res = await requestYT(options);
		if (res.STATUS === '1') {
			return Promise.resolve(res);
		}
		return Promise.reject(new Error(res.msg));
	}

	/**
	 * 反显图片
	 * rcrz/showPic.do
	 */
	static async showPic({
		openId
	}) {
		let options = {
			url: 'rcrz/showPic.do',
			data: {
				openId,
			},
		};
		let res = await requestYT(options);
		if (res.STATUS === '1') {
			return Promise.resolve(res);
		}
		return Promise.reject(new Error(res.msg));
	}

	/**
	 * rcrz/wordToPdfAndSign.do
	 */
	static async wordToPdfAndSign({
		openId,
		custName,
		idCard,
		sqrName,
		year,
		month,
		day
	}) {
		let now = new Date();
		let options = {
			url: 'rcrz/wordToPdfAndSign.do',
			data: {
				openId,
				custName, // 客户名称
				idCard, // 客户证件号码
				sqrName, // 授权人名称
				year: `${year || now.getFullYear()}`,
				month: `${month || now.getMonth()+1}`,
				day: `${day || now.getDate()}`,
			},
		};
		let res = await requestYT(options);
		if (res.STATUS === '1') {
			return Promise.resolve(res);
		}
		return Promise.reject(new Error(res.msg));
	}

	/**
	 * rcrz/selectAll.do
	 */
	static async selectAll() {
		let options = {
			url: 'rcrz/selectAll.do',
			data: {},
		};
		let res = await requestYT(options);
		if (res.STATUS === '1') {
			return Promise.resolve(res);
		}
		return Promise.reject(new Error(res.msg));
	}

	/**
	 * rcrz/selectByPlanName.do
	 */
	static async selectByPlanName({
		planName
	}) {
		let options = {
			url: 'rcrz/selectByPlanName.do',
			data: {
				planName,
			},
		};
		let res = await requestYT(options);
		if (res.STATUS === '1') {
			return Promise.resolve(res);
		}
		return Promise.reject(new Error(res.msg));
	}

	/**
	 * rcrz/selectAllByPlanName.do
	 */
	static async selectAllByPlanName({
		planName
	}) {
		let options = {
			url: 'jsyh/fuzzyQueryPlanName.do',
			data: {
				planName,
			},
		};
		let res = await requestYT(options);
		if (res.STATUS === '1') {
			return Promise.resolve(res);
		}
		return Promise.reject(new Error(res.msg));
	}

	/**
	 * 学信网学历信息查询
	 * edu/selectEducation.do
	 */
	static async educationSearch({idcard,name}) {
		let options = {
			url: 'xuexin/educationSearch.do',
			data: {
				idcard, // 证件号码
				name, // 姓名
			},
		};
		console.log(idcard,name);
		let res = await requestYT(options);
		console.log(res);
		if (res.STATUS === '1') {
			return Promise.resolve(res);
		}
		return Promise.reject(new Error(res.msg));
	}
	/**
	 * 银税互动税务信息
	 * banktax/interactTaxInfo.do
	 */
	static async interactTaxInfo({
		applyName,
		applyCard
	}) {
		let options = {
			url: 'banktax/interactTaxInfo.do',
			data: {
				applyName, // 申请人姓名
				applyCard, // 申请人证件号码
			},
		};
		let res = await requestYT(options);
		if (res.STATUS === '1') {
			return Promise.resolve(res);
		}
		return Promise.reject(new Error(res.msg));
	}

	/**
	 * jsyh/getQyName.do
	 * *Org.getEnterpriseList
	 */
	static async getQyName({
		keyWord
	}) {
		let options = {
			url: 'jsyh/getQyName.do',
			data: JSON.stringify({
				keyWord,
			}),
		};
		let res = await requestYT(options);
		if (res.STATUS === '1') {
			return res;
		}
		return Promise.reject(new Error('未查询到相关企业'));
	}

	/**
	 * jsyh/test.do
	 */
	static async imgBase64toJPG({
		imgStr
	}) {
		let options = {
			url: 'jsyh/test.do',
			data: JSON.stringify({
				imgStr,
			}),
			ifEncrypt: false,
		};
		let res = await requestYT(options);
		if (res.STATUS === '1' && res.imgFilePath) {
			return res.imgFilePath;
		} else {
			return Promise.reject(new Error('图片转化失败，请稍后重试'));
		}
	}

	/**
	 * rhedt/uploadCard
	 */
	static async imgUpload({
		filePath
	}) {
		return new Promise((resolve, reject) => {
			wx.uploadFile({
				url: app.globalData.URL + 'uploadCard',
				filePath,
				name: 'file',
				formData: {
					option: '2',
					type: 1,
				},
				success(res) {
					if (res.statusCode === 413) {
						reject(new Error('上传图片过大，请重新选择'));
						return;
					}
					if (res.statusCode !== 200) {
						reject(new Error('图片上传失败，请稍后重试'));
						return;
					}
					resolve(res.data);
				},
			});
		});
	}

	/**
	 * jsyh/toYxpt.do
	 */
	static async toYxpt({
		imgpathlist,
		idCard
	}) {
		let options = {
			url: 'jsyh/toYxpt.do',
			data: JSON.stringify({
				imgpathlist,
				imgname: '11',
				EcmCatalogCode: 'SYS021_BIZ01_110',
				imggs: 'jpg',
				imgbq: '相关证书',
				batch: 'SYS021_8229_',
				EcmBusiType: 'SYS021_BIZ01',
				RE_CUST_ID: idCard,
			}),
		};
		let res = await requestYT(options);
		if (res.STATUS === '1' && res.code === '1') {
			return res.BatchID;
		} else {
			return Promise.reject(new Error(res.msg || '上传影像系统失败，请稍后重试'));
		}
	}

	/**
	 * sui/getuseCard.do
	 * *Org.getLocalEnterpriseList 
	 * type: 14
	 */
	static async getuseCard({
		openid,
		type
	}) {
		let options = {
			url: 'sui/getuseCard.do',
			data: JSON.stringify({
				userId: openid,
				type: type || '',
			}),
		};
		let res = await requestYT(options);
		if (res.STATUS === '1' && res.result_code === '1') {
			return JSON.parse(res.result_msg);
		}
		return Promise.reject(new Error('未查询到相关企业'));
	}

	/**
	 * sui/getBusInfo.do
	 * *Org.getEnterpriseInfo
	 * type: 1-企业名称 2-统一码
	 * return {
	 * 		aBUITEM: "项目投资、投资管理..."
	 * 		aNCHEYEAR: "2017"
	 * 		cREDITCODE: "91320111MA1X028F8B"
	 * 		dOM: "北京市顺义区牛山地区牛山环岛西侧500米"
	 * 		eNTNAME: "南京汽车集团有限公司"
	 * 		eNTSTATUS: "在营（开业）"
	 * 		eNTTYPE: "有限责任公司(自然人投资或控股)"
	 * 		eSDATE: "1998-11-27"
	 * 		fRNAME: "徐敏达"
	 * 		iNDUSTRYCOCODE: "7212"
	 * 		oPFROM: "1998-11-27"
	 * 		oPSCOPE: "项目投资、投资管理..."
	 * 		oPTO: "长期"
	 * 		oRGCODES: "700058529"
	 * 		rECCAP: "5000.000000"
	 * 		rEGCAP: "5000.000000"
	 * 		rEGCAPCUR: "人民币元"
	 * 		rEGNO: "110113007265079"
	 * 		rEGORG: "北京市工商行政管理局顺义分局"
	 * 		rEGORGCODE: "110113"
	 * 		tEL: "60411166"
	 * }
	 */
	static async getBusInfo({
		openid,
		type,
		companyName
	}) {
		let options = {
			url: 'sui/getBusInfo.do',
			data: JSON.stringify(Object.assign({
				intid: '',
				openid: '',
				type: '',
				companyName: '',
				companyCode: '',
				checkIdcard: '',
				checkName: '',
			}, {
				openid,
				type,
				companyName
			})),
		};
		let res = await requestYT(options);
		if (res.STATUS === '1' && res.result_code === '1') {
			return JSON.parse(res.stringData);
		}
		return Promise.reject(new Error(res.result_msg));
	}

	/**
	 * sui/sui99602.do
	 * *user.verifyIdentity
	 */
	static async verifyIdentity({
		name,
		idcard
	}) {
		let options = {
			url: 'sui/sui99602.do',
			data: JSON.stringify({
				name,
				idcard,
			}),
		};
		let res = await requestYT(options);
		if (res.STATUS === '1' && res.result_code === '0') {
			return Promise.resolve(res);
		}
		return Promise.reject(new Error('信息校验失败'));
	}

}