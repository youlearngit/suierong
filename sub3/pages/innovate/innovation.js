var app = getApp();
import utils from './utils';
import requestYT from '../../../api/requestYT';
import user from '../../../utils/user';
import api from '../../../utils/api';

export default class Innovation {

	/**
	 * 模糊查询企业
	 * @param {
	 * 		keyWord: 企业名称关键字
	 * }
	 * @return {
	 * 		entNamesList: [
	 * 			entNames: "南京地铁集团有限公司"
	 * 		]
	 * } 
	 */
	static async getQyName({keyWord}) {
		let options = {
			url: "jsyh/getQyName.do",
			data: {
				keyWord,
			},
		};
		let res = await requestYT(options);
		if (res.STATUS === '1') {
			return res;
		}
		return Promise.reject(new Error(res.result_msg));
	}

	/**
	 * 查询企业 ED0200
	 * @param {
	 * 		eg. 查询企业
	 * 			type: "1"
	 * 			openid
	 * 			companyName
	 * 		eg. 验证法人
	 * 			type: "5"
	 * 			companyName
	 * 			checkIdcard: 法人身份证号
	 * 			checkName: 法人姓名
	 * }
	 * @return {
	 * 		aBUITEM: 许可经营项目
	 * 		aNCHEYEAR: 最后年检年度
	 * 		cREDITCODE: 统一信用代码
	 * 		dOM: 住址 eg."南京市雨花台区软件大道106号2幢1202-1室"
	 * 		eNTNAME: 企业名称 eg."江苏谷科软件有限公司"
	 * 		eNTSTATUS: 经营状态 eg."在营（开业）"
	 * 		eNTTYPE: 企业类型 eg."有限责任公司(自然人投资或控股)"
	 * 		eSDATE: 成立日期 eg."2011-09-07"
	 * 		fRNAME: 法定代表人/负责人/执行事务合伙人 eg."罗剑宏"
	 * 		iNDUSTRYCOCODE: 国民经济行业代码 eg."651"
	 * 		mAINREGNO: 注册号（查询企业的） eg."320102000219043"
	 * 		oPFROM: 经营期限自 eg."2011-09-07"
	 * 		oPSCOPE: 经营（业务）范围
	 * 		oPTO: 经营期限至 eg."长期"
	 * 		oRGCODES: 组织机构代码 eg."580471246"
	 * 		rECCAP: 实收资本（万元） eg."1000.000000"
	 * 		rEGCAP: 注册资本（万元） eg."1000.000000"
	 * 		rEGCAPCUR: 注册资本币种 eg."人民币元"
	 * 		rEGNO: 注册号 eg."320102000219043"
	 * 		rEGORG: 登记机关 eg."南京市雨花台区市场监督管理局"
	 * 		rEGORGCODE: 注册地址行政编号 eg."320114"
	 * 		tEL: 联系人电话 eg."13655189394"
	 * }
	 */
	static async getBusInfo({openid,type="1",companyName,checkIdcard,checkName}) {
		let data = {};
		if (type=="1") {
			// companyName = companyName.replace(/\(/g,"（");
			// companyName = companyName.replace(/\)/g,"）");
			data = {
				openid,
				type,
				companyName,
			}
		}
		if (type=="5") {
			data = {
				type,
				companyName,
				checkIdcard,
				checkName,
			}
		}
		
		let options = {
			url: "sui/getBusInfo.do",
			data: data,
		};
		let res = await requestYT(options);
		if (res.STATUS === '1') {
			if (res.stringData) {
				res._stringData = JSON.parse(res.stringData);
			}
			return res;
		}
		return Promise.reject(new Error(res.result_msg));
	}

	/**
	 * 查询企业是否为中小企业
	 * 中小企业: type=2 && year=今年or上年
	 * @param {
	 * 		creditcode: 统一社会信用代码 (必输一个)
	 * 		epname: 企业名称 (必输一个)
	 * 		productNo: 产品编号 (120031)
	 * 		deptName: 部门名称 (小企业金融部)
	 * } 
	 * @return {
	 * 		kjqykInfo: [
	 * 			entid: 中数企业ID
	 * 			creditcode: 统一社会信用代码
	 * 			busnumber: 工商注册号
	 * 			epname: 企业名称
	 * 			type: 科技型企业类型 (1：高新技术企业；2：科技中小；3：专精特新企业；4：科技小巨人；5：瞪羚企业；6：独角兽企业；7：其他科技型企业；)
	 * 			leadproduct: 主导产品
	 * 			rzsort: 认证分类 (文字)
	 * 			rzlevel: 认证级别 (1：国家级；2：省级；3：市级；4：区（县）级；)
	 * 			year: 认证年份
	 * 			cercode: 证书编号
	 * 			batch: 批次 (文字)
	 * 			ggorg: 公告（认定）机构
	 * 			cxdate: 撤销日期 (YYYY--MM--DD)
	 * 			fbdate: 发布日期 (YYYY--MM--DD)
	 * 			yxstart: 有效期起 (YYYY--MM--DD)
	 * 			yxend: 有效期至 (YYYY--MM--DD)
	 * 			rdorg: 认定机构
	 * 			park: 所属园区
	 * 			publicsector: 上市板块
	 * 			publicdate: 上市日期
	 * 			stockname: 股票简称
	 * 			stockcode: 股票代码
	 * 			publicstate: 上市状态
	 * 			npublicsector: 拟上市板块
	 * 			companyname: 公司简称
	 * 			acceptdate: 受理日期
	 * 			trialstate: 审核状态
	 * 			pubilcupdate: 公示更新日期
	 * 			epregaddress: 企业注册地址
	 * 			identity: 省份
	 * 			city: 城市
	 * 			fentid: 所属集团母公司
	 * 			fcreditcode: 所属集团母公司的统一社会信用代码
	 * 			fbusnumber: 所属集团母公司的工商注册号
	 * 			insertDate: 入库时间
	 * 		]
	 * }
	 */
	static async ED0270({creditcode,epname,productNo="120031",deptName="小企业金融部"}) {
		let options = {
			url: "innovation/ED0270.do",
			data: {
				// creditcode,
				// epname,
				productNo,
				deptName,
			},
		};
		if (creditcode) {
			options.data.creditcode = creditcode;
		} else if (epname) {
			options.data.epname = epname;
		} else {
			return Promise.reject(new Error('creditcode or epname'));
		}
		let res = await requestYT(options);
		if (res.STATUS === '1') {
			return res;
		}
		return Promise.reject(new Error(res.result_msg));
	}

	/**
	 * @param {
	 * 		eg.
	 * 			RESOLVE_TYPE: "1"
	 * 			ECIF_CUST_NO: 客户号
	 * 		eg.
	 * 			RESOLVE_TYPE: "2"
	 * 			PARTY_NAME: 企业名 eg."南京汽车集团有限公司"
	 * 		eg.
	 * 			RESOLVE_TYPE: "3"
	 * 			CERT_TYPE: "23402"
	 * 			CERT_NO: 企业证件号码
	 * }
	 * @return {
	 * 		ACCT_LIC_NO: ""
	 * 		APP_CERT_NO: ""
	 * 		APP_CERT_NO_EXP_DATE: ""
	 * 		COMPANY_EXPD_DATE: ""
	 * 		COMPANY_NO: "MA1X028F8"
	 * 		CONTACT_MOBILE_NO: ""
	 * 		CONTACT_NAME: ""
	 * 		CONTACT_PHONE_NO: ""
	 * 		CRE_COMPANY_EXPD_DATE: ""
	 * 		CRE_COMPANY_NO: ""
	 * 		CUSTOMER_TYPE_CD: ""
	 * 		CUST_ENG_NAME: ""
	 * 		CUST_SHORT_NAME: ""
	 * 		ECIF_CUST_NO: 客户号 eg."2303783438"
	 * 		ENT_TUBE_NO: ""
	 * 		FINANCE_MASTER: ""
	 * 		FINANCE_TEL: ""
	 * 		FINANCIAL_TYPE: ""
	 * 		FORNG_LIC_ID: ""
	 * 		GIVN_GRANT_DATE: ""
	 * 		GOVN_CERT_NO: ""
	 * 		INDUSTRY_TYPE: ""
	 * 		LEGAL_CERT_NO: ""
	 * 		LEGAL_CERT_TYPE: ""
	 * 		LEGAL_NAME: ""
	 * 		LEGAL_PHONE_NO: ""
	 * 		LICE_APP_ADDR: "测试"
	 * 		LICE_APP_ORG: "测试"
	 * 		LOAN_CARD_NO: ""
	 * 		LOAN_CHCK_RSLT: ""
	 * 		LOAN_CHCK_YEAR: ""
	 * 		LOAN_FLAG: ""
	 * 		MSG: "交易成功"
	 * 		PARTY_NAME: "南京汽车集团有限公司"
	 * 		STATUS: "1"
	 * 		TAX_EXPD_DATE: ""
	 * 		TAX_NO: ""
	 * 		VAT_EXPD_DATE: ""
	 * 		VAT_NO: ""
	 * }
	 */
	static async selectCustomNo({RESOLVE_TYPE,CERT_TYPE,CERT_NO,EXT_SYSTEM_ID,ECIF_CUST_NO,PARTY_NAME}) {
		let data = {};
		if (RESOLVE_TYPE == "1") {
			data = {
				RESOLVE_TYPE,
				ECIF_CUST_NO,
			};
		}
		if (RESOLVE_TYPE == "2") {
			data = {
				RESOLVE_TYPE,
				PARTY_NAME,
			};
		}
		if (RESOLVE_TYPE == "3") {
			data = {
				RESOLVE_TYPE,
				CERT_TYPE,
				CERT_NO,
			};
		}
		if (RESOLVE_TYPE == "7") {
			data = {
				RESOLVE_TYPE,
				EXT_SYSTEM_ID,
			};
		}
		let options = {
			url: "beneficial/selectCustomNo.do",
			data: data,
		};
		let res = await requestYT(options);
		if (res.STATUS === '1') {
			return res;
		}
		return Promise.reject(new Error(res.result_msg));
	}

	/**
	 * @param {
	 * 		KEHHAO: 客户号 eg."1705701570" (beneficial/selectCustomNo ECIF_CUST_NO)
	 * 		QISHBS: 起始笔数 eg."0"
	 * 		CXUNBS: 查询笔数 eg."99"
	 * }
	 * @return {
	 * 		STATUS: "1"
	 * 		MSG: "交易成功"
	 * 		RET_CODE: "AAAAAAA"
	 * 		RET_MSG
	 * 		ERROR_CODE
	 * 		ERROR_MSG
	 * 		CHXJLH: 查询记录号 eg."30"
	 * 		KEHHAO: 客户号 eg."1705701570"
	 * 		KEHZWM: 客户中文名 eg."金云"
	 * 		F02081List: [
	 * 			{
	 * 				hUOBDH: 货币代号(01-人民币) eg."01"
	 * 				jILUZT: 记录状态(0-正常) eg."0"
	 * 				kEHUZH: 客户帐号 eg."6228760005003100021"
	 * 				kHZHLX: 客户帐号类型 eg."1"
	 * 				kYNGJE: 可用金额 eg."260.00"
	 * 				wJZHXZ: 外管局账户性质
	 * 				yNGYJG: 营业机构号(开户行核心机构号) eg."3100"
	 * 				zHANGH: 帐号 eg."31000161003687548"
	 * 				zHHUYE: 帐户余额 eg."260.00"
	 * 				zHNGJG: 帐务机构号 eg."3100"
	 * 				zHUZWM: 帐户中文名 eg."金云"
	 * 			}
	 * 		]
	 * }
	 */
	static async ED0208({KEHHAO,QISHBS,CXUNBS}) {
		let options = {
			url: "innovation/0208.do",
			data: {
				KEHHAO,
				QISHBS: QISHBS || "0",
				CXUNBS: CXUNBS || "99",
			},
		};
		let res = await requestYT(options);
		if (res.STATUS === '1') {
			if (res.F02081List) {
				res.F02081List = JSON.parse(res.F02081List);
			}
			return res;
		}
		return Promise.reject(new Error(res.result_msg));
	}

	/**
	 * @param {
	 * 		ORGCODE: eg."3100"
	 * }
	 * @return {
	 * 		STATUS: "1"
	 * 		MSG: "交易成功"
	 * 		ORGNAME: eg."江苏银行营业部"
	 * }
	 */
	static async selectOrgname({ORGCODE}) {
		let options = {
			url: "innovation/selectOrgname.do",
			data: {
				ORGCODE,
			},
		};
		let res = await requestYT(options);
		if (res.STATUS === '1') {
			return res;
		}
		return Promise.reject(new Error(res.result_msg));
	}

	/**
	 * 流程暂存
	 * @param {
	 * 		OPENID
	 * 		IDString: 有则更新 无则新增
	 * 		USCI: 统一社会信用代码
	 * 		REMARK1: 暂存节点数据
	 * 		BATCHID: 影像id (授权书id)
	 * 		REGISTRATION_STATUS: 注册状态  0-未注册 1-已注册
	 * 		CXQSLZT: 创新券申领状态 0-未申领 1-当年已申领
	 * 		CXQSLED: 创新券额度（当年）
	 * 		CXQSYED: 创新券剩余额度（当年）
	 * 		USERNAME: 创新券系统用户名
	 * 		DWMC: 单位名称
	 * 		PHONE: 手机
	 * 		FRZJHM: 证件号码
	 * 		STATUS: 订单状态 0-未审批 1-已审批 审批失败 2-审批通过 3-审核中 4-申领中
	 * } 
	 * @return {
	 * 		MSG: "交易成功"
	 * 		STATUS: "1"
	 * 		IDID: "3a913b40-1955-42d7-a6cc-7e8a38513034"
	 * }
	 */
	static async createOrder({OPENID,IDString,USCI,DWMC,REMARK1,REMARK2,BATCHID,STATUS}) {
		let options = {
			url: "innovation/createOrder.do",
			data: {
				OPENID,
				// IDString,
				USCI,
				DWMC,
				REMARK1,
				REMARK2,
				// BATCHID,
				STATUS,
				_REMARK1: JSON.parse(REMARK1),
			},
		};
		if (IDString) { options.data.IDString = IDString }
		if (BATCHID) { options.data.BATCHID = BATCHID }
		let res = await requestYT(options);
		if (res.STATUS === '1') {
			return res;
		}
		return Promise.reject(new Error(res.result_msg));
	}

	/**
	 * 创新券删除订单
	 * @param {
	 * 		IDID
	 * }
	 * @return {
	 * 
	 * }
	 */
	static async deleteOrder({IDID}) {
		let options = {
			url: "innovation/deleteOrder.do",
			data: {
				IDID,
			},
		};
		let res = await requestYT(options);
		if (res.STATUS === '1') {
			return res;
		}
		return Promise.reject(new Error(res.result_msg));
	}

	/**
	 * 流程暂存查询
	 * @param {OPENID}
	 * @return {
	 * 		show: 是否有流程暂存 0-无 1-有
	 * 		LIST: [
	 * 			OPENID
	 * 			USCI: 统一社会信用代码
	 * 			REGISTRATION_STATUS: 注册状态  0-未注册 1-已注册
	 * 			CXQSLZT: 创新券申领状态 0-未申领 1-当年已申领
	 * 			CXQSLED: 创新券额度（当年）
	 * 			CXQSYED: 创新券剩余额度（当年）
	 * 			USERNAME: 创新券系统用户名
	 * 			DWMC: 单位名称
	 * 			PHONE: 手机
	 * 			FRZJHM: 证件号码
	 * 			STATUS: 订单状态 0-未审批 1-已审批 审批失败 2-审批通过
	 * 			BATCHID: 影像id
	 * 			ENTERPRISENAME: 公司名称
	 * 			RESULTCODE: 审批结果
	 * 			FAILREASON: 失败原因
	 * 			VALIDYEAR: 有效年份
	 * 			QUOTA: 剩余额度
	 * 			ID
	 * 			REMARK1: 暂存节点数据
	 * 		]
	 * } 
	 */
	static async selectOrder({OPENID}) {
		let options = {
			url: "innovation/selectOrder.do",
			data: {
				OPENID,
			},
		};
		let res = await requestYT(options);
		if (res.STATUS === '1') {
			if (res.LIST) {
				for (let i in res.LIST) {
					if (res.LIST[i].REMARK1) {
						res.LIST[i]._REMARK1 = JSON.parse(res.LIST[i].REMARK1);
					}
				}
			}
			return res;
		}
		return Promise.reject(new Error(res.result_msg));
	}

	/**
	 * 流程暂存 获取
	 * @param {IDString}
	 */
	static async selectByUsci({IDString}) {
		let options = {
			url: "innovation/selectByUsci.do",
			data: {
				IDString,
			},
		};
		let res = await requestYT(options);
		if (res.STATUS === '1') {
			if (res.REMARK1) {
				res._REMARK1 = JSON.parse(res.REMARK1);
			}
			return res;
		}
		return Promise.reject(new Error(res.result_msg));
	}
	
	/**
	 * 短信通知
	 * @param {phone}
	 * @return {
	 * 		code: 1
	 * 		msg: "发送成功"
	 * }
	 */
	static async sendMsg({phone}) {
		let options = {
			url: "innovation/sendMsg.do",
			data: {
				phone
			}
		};
		let res = await requestYT(options);
		if (res.STATUS === '1' && res.resultVo) {
			return JSON.parse(res.resultVo);
		}
		return Promise.reject(new Error(res.result_msg));
	}

	/**
	 * 签章
	 * @param {
	 * 		USCI: 统一社会信用代码
	 * 		DWMC: 企业名称
	 * 		frIdCard: 法人身份证号
	 * 		SQDATE: 授权日期
	 * 		photo1path: 身份证正面
	 * 		photo2path: 身份证反面
	 * }
	 * @return {
	 * 		STATUS: "1"
	 * 		MSG: "交易成功"
	 * 		PDF: base64文件
	 * 		TRAN_STATUS: "COMPLETE"
	 * 		pdfPath: "/home/app/data/innovation/9ee3d3c3-699d-4e2a-8de1-a3a4a8d131eb.pdf"
	 * 		BatchID
	 * }
	 */
	static async empowerSignature({USCI,DWMC,sqname,frIdCard,SQDATE="now",photo1path="1",photo2path="1"}) {
		let options = {
			url: "innovation/empowerSignature.do",
			data: {
				USCI,
				DWMC,
				sqname,
				frIdCard,
				SQDATE: SQDATE=="now" ? Date.DateFormat(new Date(),'yyyy年MM月dd日') : SQDATE,
				photo1path,
				photo2path,
			},
		};
		let res = await requestYT(options);
		if (res.STATUS === '1') {
			return res;
		}
		return Promise.reject(new Error(res.result_msg));
	}

	/**
	 * 创新券查询联动部门
	 * @param {AREA}
	 * @return {
	 * 		LIST: [
	 * 			CODE: "60850"
	 * 			AREA: "320100"
	 * 			DEPT: "南京市科学技术局"
	 * 		]
	 * } 
	 */
	static async selectLinkage({AREA}) {
		let options = {
			url: "innovation/selectLinkage.do",
			data: {
				AREA
			}
		};
		let res = await requestYT(options);
		if (res.STATUS === '1') {
			return res;
		}
		return Promise.reject(new Error(res.result_msg));
	}

	/**
	 * 创新券查询孵化器
	 * @param {AREA}
	 * @return {
	 * 		LIST: [
	 * 			CODE: "1"
	 * 			AREA: "320100"
	 * 			COUVEUSE: "江苏软件园科技企业孵化器"
	 * 		]
	 * } 
	 */
	static async selectCouveuse({AREA}) {
		let options = {
			url: "innovation/selectCouveuse.do",
			data: {
				AREA
			}
		};
		let res = await requestYT(options);
		if (res.STATUS === '1') {
			return res;
		}
		return Promise.reject(new Error(res.result_msg));
	}

	/**
	 * 创新券查询高新区
	 * @param {AREA} 
	 * @return {
	 * 		LIST: [
	 * 			GX: "南京国家高新技术产业开发区"
	 * 			CODE: "1"
	 * 			AREA: "320100"
	 * 		]
	 * }
	 */
	static async selectGx({AREA}) {
		let options = {
			url: "innovation/selectGx.do",
			data: {
				AREA
			}
		};
		let res = await requestYT(options);
		if (res.STATUS === '1') {
			return res;
		}
		return Promise.reject(new Error(res.result_msg));
	}

	/**
	 * 读取服务器文件
	 * @param {
	 * 		POLICYPDF: 文件服务器路径
	 * }
	 * @return {
	 * 		STATUS: "1"
	 * 		MSG: "交易成功"
	 * 		PDF: base64文件
	 * }
	 */
	static async readPdf({POLICYPDF}) {
		let options = {
			url: "/talent/readPdf.do",
			data: {
				// POLICYPDF: "/home/app/data/innovation/"+filename,
				POLICYPDF,
			},
			ifEncrypt: false,
		};
		let res = await requestYT(options);
		return res;
	}

	/**
	 * 创新券提交
	 * @param {
	 * 		parameter: "jsbchina_cxqsl"
	 * 		usci: 统一社会信用代码
	 * 		dwmc: 单位名称
	 * 		zcdz_sheng_bm: 注册地址省编码
	 * 		zcdz_sheng_nm: 注册地址省
	 * 		zcdz_shi_bm: 注册地址市编码
	 * 		zcdz_shi_nm: 注册地址市
	 * 		zcdz_qu_bm: 注册地址区编码
	 * 		zcdz_qu_nm: 注册地址区
	 * 		zcdz: 详细地址
	 * 		email: 邮箱
	 * 		phone: 手机号
	 * 		zcclsj: 注册成立时间
	 * 		sshy: 所属行业编码
	 * 		ygrs: 员工人数
	 * 		sfzsjysgxq: 是否在省级以上高新区
	 * 		gxqmc_nm: 高新区名称
	 * 		gxqmc_bm: 高新区编码
	 * 		sfzsjyskjqyfhq: 是否在省级以上科技企业孵化器
	 * 		kjqyfhq_nm: 科技企业孵化器
	 * 		kjqyfhq_bm: 科技企业孵化器编码
	 * 		lxr: 联系人姓名
	 * 		lxrphone: 联系人手机
	 * 		lxrtel: 联系人电话
	 * 		lxremail: 联系人邮箱
	 * 		txdz_sheng_bm: 通讯地址省编码
	 * 		txdz_sheng_nm: 通讯地址省
	 * 		txdz_shi_bm: 通讯地址市编码
	 * 		txdz_shi_nm: 通讯地址市
	 * 		txdz_qu_bm: 通讯地址区编码
	 * 		txdz_qu_nm: 通讯地址区
	 * 		txdz: 通讯地址
	 * 		postalcode: 邮政编码
	 * 		frxm: 法定代表人姓名
	 * 		frphone: 法定代表人手机号
	 * 		frzjlx: 证件类型
	 * 		frzjhm: 证件号码
	 * 		khhmc: 开户行名称
	 * 		zhmc: 账户名称
	 * 		yhzh: 银行账户
	 * 		nsrsbh: 纳税人识别号
	 * 		gsyyzt: 工商营业状态
	 * 		nszt: 纳税状态
	 * 		ldbm_bm: 联动部门 编码
	 * 		ldbm_nm: 联动部门
	 * 		ssjsly: 主营产品所属技术领域 编码
	 * 		cxqnsyfx: 创新券拟使用方向 编码
	 * 		ascription: 归属单位
	 * }
	 * @return {
	 * 		code: 
	 * 		msg: 
	 * 		username: 
	 * 		csmm: 
	 * } 
	 */
	static async referOrder({
		parameter="jsbchina_cxqsl",
		usci, // 统一社会信用代码
		dwmc, // 单位名称
		zcdz_sheng_bm, // 注册地址省编码
		zcdz_sheng_nm, // 注册地址省
		zcdz_shi_bm, // 注册地址市编码
		zcdz_shi_nm, // 注册地址市
		zcdz_qu_bm, // 注册地址区编码
		zcdz_qu_nm, // 注册地址区
		zcdz, // 详细地址
		email, // 邮箱
		phone, // 手机号
		zcclsj, // 注册成立时间
		sshy, // 所属行业编码
		ygrs, // 员工人数
		sfzsjysgxq, // 是否在省级以上高新区
		gxqmc_nm, // 高新区名称
		gxqmc_bm, // 高新区编码
		sfzsjyskjqyfhq, // 是否在省级以上科技企业孵化器
		kjqyfhq_nm, // 科技企业孵化器
		kjqyfhq_bm, // 科技企业孵化器编码
		lxr, // 联系人姓名
		lxrphone, // 联系人手机
		lxrtel, // 联系人电话
		lxremail, // 联系人邮箱
		txdz_sheng_bm, // 通讯地址省编码
		txdz_sheng_nm, // 通讯地址省
		txdz_shi_bm, // 通讯地址市编码
		txdz_shi_nm, // 通讯地址市
		txdz_qu_bm, // 通讯地址区编码
		txdz_qu_nm, // 通讯地址区
		txdz, // 通讯地址
		postalcode, // 邮政编码
		frxm, // 法定代表人姓名
		frphone, // 法定代表人手机号
		frzjlx, // 证件类型
		frzjhm, // 证件号码
		khhmc, // 开户行名称
		zhmc, // 账户名称
		yhzh, // 银行账户
		nsrsbh, // 纳税人识别号
		gsyyzt, // 工商营业状态
		nszt, // 纳税状态
		ldbm_bm, // 联动部门 编码
		ldbm_nm, // 联动部门
		ssjsly, // 主营产品所属技术领域 编码
		cxqnsyfx, // 创新券拟使用方向 编码
		ascription="jsbchina", // 归属单位
	}) {
		let options = {
			url: "innovation/referOrder.do",
			data: arguments[0]
		};
		let res = await requestYT(options);
		if (res.STATUS === '1') {
			return res;
		}
		return Promise.reject(new Error(res.result_msg));
	}

	/**
	 * 创新券查询外部订单
	 * @param {
	 * 		usci
	 * 		ascription: "jsbchina"
	 * 		parameter: "jsbchina_getuserdata"
	 * } 
	 * @return {
	 * 		MSG: "交易成功"
	 * 		STATUS: "1"
	 * 		Usci: ""
	 * 		registration_status: "1"
	 * 		cxqslzt: 创新券申领状态 0-未申领 1-当年审核通过 2-当年退回修改 3-当年审核不通过
	 * 		cxqsled: "100000"
	 * 		cxqsyed: "100000"
	 * 		username: "江苏学正"
	 * 		cxqslnf: "2021"
	 * 		show: 
	 * 		code: "1000"
	 * 		msg: 
	 * }
	 */
	static async queryOrder({usci,ascription="jsbchina",parameter="jsbchina_getuserdata"}) {
		let options = {
			url: "innovation/queryOrder.do",
			data: {
				usci,
				ascription,
				parameter
			}
		};
		let res = await requestYT(options);
		if (res.STATUS === '1') {
			return res;
		}
		return Promise.reject(new Error(res.result_msg));
	}

	static taxUrl(openid,cityCode) {
		return new Promise((resolve, reject) => {
			let url = app.globalData.URL + "tax";
			let data = {
				proCode: cityCode.substr(0,2)+'0000',
				cityCode: cityCode,
				id: openid || wx.getStorageSync("openid"),
			}
			wx.request({
				url: url,
				data: data,
				success: (res)=>{
					if (res.data) {
						return resolve(res.data);
					} else {
						return reject(false);
					}
				},
				fail: (err)=>{
					return reject(false);
				},
				complete: (res)=>{
					let route = '/';
					let pages = getCurrentPages();
					if (pages.length>0) {
						let page = pages[pages.length-1];
						route = page.route;
					}
					console.log({route,url,params:data,res});
				}
			});
		})
	}

	static taxRes(openid,orgCode) {
		return new Promise((resolve, reject) => {
			let url = app.globalData.URL + "gettaxresult2";
			let data = {
				data: orgCode,
				openid: openid || wx.getStorageSync("openid"),
			}
			wx.request({
				url: url,
				data: data,
				success: (res)=>{
					if (res.data) {
						return resolve(res.data);
					} else {
						return reject(false);
					}
				},
				fail: (err)=>{
					return reject(false);
				},
				complete: (res)=>{
					let route = '/';
					let pages = getCurrentPages();
					if (pages.length>0) {
						let page = pages[pages.length-1];
						route = page.route;
					}
					console.log({route,url,params:data,res});
				}
			});
		});
	}

	static async getMine() {
		let mine = app.globalData.innovate_mine || {};
		let res;

		if (!mine.INT_ID) {
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
			app.globalData.innovate_mine = mine;
		}
		
		return mine;
	}

	static async pickerArr(area) {
		let arr = {};
		let res;

		// 所属行业
		arr.apply_sshy = [{ id:"A",name:"农、林、牧、渔业" },{ id: "B",name: "采矿业" },{ id: "C",name: "制造业" },{ id: "D",name: "电力、热力、燃气及水生产和供应业" },{ id: "E",name: "建筑业" },{ id: "F",name: "批发和零售业" },{ id: "G",name: "交通运输、仓储和邮政业" },{ id: "H",name: "住宿和餐饮业" },{ id: "I",name: "信息传输、软件和信息技术服务业" },{ id: "J",name: "金融业" },{ id: "K",name: "房地产业" },{ id: "L",name: "租赁和商务服务业" },{ id: "M",name: "科学研究和技术服务业" },{ id: "N",name: "水利、环境和公共设施管理业" },{ id: "O",name: "居民服务、修理和其他服务业" },{ id: "P",name: "教育" },{ id: "Q",name: "卫生和社会工作" },{ id: "R",name: "文化、体育和娱乐业" },{ id: "S",name: "公共管理、社会保障和社会组织" },{ id: "T",name: "国际组织" }];

		// 所属技术领域
		arr.apply_ssjsly = [{ id:"1",name:"电子信息" },{ id:"2",name:"生物与新医药" },{ id:"3",name:"航空航天" },{ id:"4",name:"新能源与节能" },{ id:"5",name:"资源与环境" },{ id:"6",name:"新材料" },{ id:"7",name:"先进制造与自动化" },{ id:"8",name:"高技术服务" },{ id:"9",name:"其他" }];

		// 使用方向
		arr.apply_cxqnsyfx = [{ id:"5",name:"委托分析、测试服务" },{ id:"6",name:"委托实验、验证服务" },{ id:"7",name:"机时共享服务" },{ id:"9",name:"结构、含量等检测" },{ id:"10",name:"技术指标测试" },{ id:"11",name:"性能测试" },{ id:"13",name:"标准全文传递" },{ id:"14",name:"标准系统定制" },{ id:"16",name:"集成电路封装测试" },{ id:"28",name:"软件测评" },];

		// 是否在省级以上高新区
		arr.apply_sfzsjysgxq = [{ id:"1",name:"是" },{ id:"2",name:"否" }]

		arr.apply_gxqmc = [];
		arr.apply_kjqyfhq = [];
		arr.apply_ldbm = [];
		if (area) {
			let city_code = area.substr(0,4)+"00"; // 数据细分暂到市
			res = await this.selectGx({AREA:city_code});
			if (res.LIST) {
				arr.apply_gxqmc = res.LIST.map(function(x){return { id:x.CODE,name:x.GX }});
			}
			res = await this.selectCouveuse({AREA:city_code});
			if (res.LIST) {
				arr.apply_kjqyfhq = res.LIST.map(function(x){return { id:x.CODE,name:x.COUVEUSE }});
			}
			res = await this.selectLinkage({AREA:city_code});
			if (res.LIST) {
				arr.apply_ldbm = res.LIST.map(function(x){return { id:x.CODE,name:x.DEPT }});
			}
		}

		return arr;
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

}