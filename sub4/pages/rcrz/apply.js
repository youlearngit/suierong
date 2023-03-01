var app = getApp();
import utils from './utils';
import rcrz from './rcrz';
import user from '../../../utils/user';
import api from '../../../utils/api';
import WxValidate from '../../../assets/plugins/wx-validate/WxValidate';
// import requestYT from '../../../api/requestYT';
// const YTURL = 'http://66.2.41.46:8090/wxgatewaysit/';      //测试
// const YTURL = 'https://appservice.jsbchina.cn/wxgatewayuat/';     //生产


Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		preffixUrl: utils.preffixUrl(),
		mine: {},
		now_year: new Date().getFullYear(),

		options: {}, // 入口传参

		canvas_share: {}, // 分享图片

		pdfs: [],

        rangs_number: [
            '零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十',
        ],
        range_radios: [{
                key: "0",
                value: "否"
            },
            {
                key: "1",
                value: "是"
            },
        ],
        range_occs: [ // 职业
            {
                key: "01",
                value: "企业高管"
            },
            {
                key: "02",
                value: "公务员"
            },
            {
                key: "03",
                value: "高级技术人员"
            },
            {
                key: "04",
                value: "高级教授"
            },
            {
                key: "05",
                value: "一般员工"
            },
            {
                key: "06",
                value: "其他"
            },
        ],
        range_cert_types: [ // 证件类型
            {
                key: "021",
                value: "身份证"
            },
        ],
        range_tal_rel_types: [ // 与企业关系码
            {
                key: "01",
                value: "法定代表人"
            },
            {
                key: "02",
                value: "股东"
            },
            {
                key: "03",
                value: "实际控制人"
            },
            {
                key: "04",
                value: "其他"
            },
        ],
        range_plans: [], // 人才计划
        range_support_levels: [ // 人才等级数
            {
                key: "1",
                value: "国家级"
            },
            {
                key: "2",
                value: "省级"
            },
            {
                key: "3",
                value: "市级"
            },
            {
                key: "4",
                value: "区县级"
            },
            {
                key: "5",
                value: "无"
            }
            // 5-无
        ],
        range_rate_areas: { // 人才评定地区 by 人才等级国省市区
            "1": [ // 国家级
                {
                    key: "15",
                    value: "国家"
                },
            ],
            "2": [ // 省级
                {
                    key: "14",
                    value: "江苏省"
                },
                {
                    key: "20",
                    value: "浙江省"
                },
                {
                    key: "21",
                    value: "广东省"
                },
            ],
            "3": [ // 市级
                {
                    key: "16",
                    value: "北京市"
                },
                {
                    key: "17",
                    value: "上海市"
                },
                {
                    key: "1",
                    value: "南京市"
                },
                {
                    key: "2",
                    value: "无锡市"
                },
                {
                    key: "3",
                    value: "徐州市"
                },
                {
                    key: "4",
                    value: "常州市"
                },
                {
                    key: "5",
                    value: "苏州市"
                },
                {
                    key: "6",
                    value: "南通市"
                },
                {
                    key: "7",
                    value: "连云港市"
                },
                {
                    key: "8",
                    value: "淮安市"
                },
                {
                    key: "9",
                    value: "盐城市"
                },
                {
                    key: "10",
                    value: "扬州市"
                },
                {
                    key: "11",
                    value: "镇江市"
                },
                {
                    key: "12",
                    value: "泰州市"
                },
                {
                    key: "13",
                    value: "宿迁市"
                },
                {
                    key: "18",
                    value: "杭州市"
                },
                {
                    key: "19",
                    value: "深圳市"
                },
            ],
            "4": [ // 区县级
                {
                    key: "16",
                    value: "北京市"
                },
                {
                    key: "17",
                    value: "上海市"
                },
                {
                    key: "1",
                    value: "南京市"
                },
                {
                    key: "2",
                    value: "无锡市"
                },
                {
                    key: "3",
                    value: "徐州市"
                },
                {
                    key: "4",
                    value: "常州市"
                },
                {
                    key: "5",
                    value: "苏州市"
                },
                {
                    key: "6",
                    value: "南通市"
                },
                {
                    key: "7",
                    value: "连云港市"
                },
                {
                    key: "8",
                    value: "淮安市"
                },
                {
                    key: "9",
                    value: "盐城市"
                },
                {
                    key: "10",
                    value: "扬州市"
                },
                {
                    key: "11",
                    value: "镇江市"
                },
                {
                    key: "12",
                    value: "泰州市"
                },
                {
                    key: "13",
                    value: "宿迁市"
                },
                {
                    key: "18",
                    value: "杭州市"
                },
                {
                    key: "19",
                    value: "深圳市"
                },
            ]
        },

		edus: { // 筋斗云码值表
			'博士研究生': '01',
			'硕士研究生': '02',
			'研究生班': '02',
			'第二学士学位': '03',
			'第二本科': '03',
			'本科': '03',
			'高升本': '03',
			'专升本': '03',
			'夜大电大函大普通班': '03',
			'第二专科': '04',
			'专科': '04',
			'专科(高职)': '04',
			'大学': '05',
			'其他形式': '05',
		},

		// 1.实名认证
		node_auth: '', // 个人信息
		node_face: '', // 人脸识别
		node_id_card: '', // 证件拍照

        // 2.是否本人申请
        node_is_self_flag: '0', // 是否本人申请 1-是 0-否
        node_person_name: '', // 人才姓名
        node_cert_type: '021', // 证件类型 1-身份证
        node_cert_no: '', // 证件号码
        node_cust_phone_no: '', // 联系号码
        node_cust_occ: '', // 职业码
        node_tal_rel_type: '', // 与企业关系码
        node_company_name: '', // 工作单位名称
        node_credit_code: '', // 统一信用机构代码
        node_cust_cadr: '', // 工作地区码
        node_cust_cadr_info: {}, // 工作地区

		// 3.是否列入政府人才计划
		node_inc_flag: '0', // 是否列入政府人才计划 1-是 0-否

		// 4.人才计划信息录入
		node_support_level: '5', // 人才等级数 5-无
		node_levelname: '', // 人才等级名
		node_rate_area: '', // 人才评定地区码
		node_areaname: '', // 人才评定地区名
		node_rate_year: '', // 人才评定年份
		node_plan_name: '', // 人才计划名称

		// 5.影像资料录入
		node_batchs: [], // 影像资料集
		node_batchs_id: '', // 影像资料集BatchId

		// 6.客户授权
		node_empower: '0', // 是否已授权 1-是 0-否

		node_cust_edu: '', // 学历码
		node_cust_inc: '', // 年收入(税前 万元)
		node_sto_flag: '0', // 是否在省人才库内 1-是 0-否

		node_step: 1, // 第几步 1~6
		node_steps: [1], // 步骤步数数组

	},


	tapAuth(e) {
		let {
			node_auth
		} = this.data;
		if (node_auth == 'suc') {
			return
		}
		this.authIndex();
	},

	tapFace(e) {
		let {
			node_face
		} = this.data;
		if (node_face == 'suc') {
			return
		}
		this.faceRecog();
	},

	tapIdCard(e) {
		let {
			node_auth,
			node_face,
			node_id_card
		} = this.data;
		if (node_id_card == 'suc') {
			return
		}
		if (!node_auth) {
			wx.showToast({
				title: "请您先录入个人信息",
				icon: "none",
			});
			return;
		}
		if (!node_face) {
			wx.showToast({
				title: "请您先完成人脸识别",
				icon: "none",
			});
		}
		wx.navigateTo({
			url: '/sub1/pages/info/set_2',
		});
	},

	pdfRead(e) {
		let {
			base64
		} = e.currentTarget.dataset;
		utils.pdfReadBase64(base64);
	},

	async tapEmpower(e) {
		let {
			node_is_self_flag,
			mine,
			pdfs
		} = this.data;
		let res;

		wx.showLoading({
			mask: true,
		});

		try {
			if (node_is_self_flag == '1') { // 本人申请 本人授权
				res = await rcrz.wordToPdfAndSign({
					openId: mine.OPEN_ID,
					custName: mine.REAL_NAME,
					idCard: mine.ID_CARD,
					sqrName: mine.REAL_NAME,
				})
				pdfs = [];
				pdfs.push({
					title: '综合信息查询使用授权书',
					base64: res.pdf,
				});
				this.setData({
					pdfs,
					show_empower: true
				});
			} else { // 非本人申请 发送授权

			}
		} catch (err) {
			wx.hideLoading();
			wx.showModal({
				title: '提示',
				content: err.message || err,
				showCancel: false,
				confirmText: '确定',
			});
		}

		wx.hideLoading();
	},

	empowerSelf(e) {
		let {
			node_empower
		} = this.data;
		if (node_empower != '1') {
			node_empower = '1';
			this.setData({
				node_empower
			});
			this.dataSave();
		}
		this.setData({
			show_empower: false
		})
	},

	async canvasShareInit(e) {
		let {
			preffixUrl,
			canvas_share,
			mine
		} = this.data;
		let that = this;

		let promise_imgs = [];
		let promise_arr = [];

		promise_arr.push(
			new Promise(function (resolve, reject) {
				wx.getImageInfo({
					src: preffixUrl + 'apply_empower_share_bg.png',
					success: (res) => {
						promise_imgs.push(res);
						resolve(res);
					},
					fail: (err) => {
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
		this.setData({
			canvas_share
		});

		ctx.drawImage(promise_imgs[0].path, 0, 0, canvas_share.width, canvas_share.height);
		ctx.save();

		ctx.setTextAlign('left');
		ctx.setFillStyle('#FFFFFF');

		ctx.setFontSize(38);
		ctx.fillText(mine.REAL_NAME, 30, 74);
		ctx.save();

		ctx.setFontSize(28)
		ctx.fillText("正在办理“人才认证”", 30, 114);
		ctx.save();

		ctx.setFontSize(26)
		ctx.fillText("(申请需由您授权确认)", 30, 160);
		ctx.save();

		ctx.draw(false, function () {
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
						that.setData({
							canvas_share
						});
					},
					fail: (err) => {},
				});
			}, 100);
		});

	},

	showClose(e) {
		let {
			event
		} = e.currentTarget.dataset;
		this.setData({
			[event]: !this.data[event]
		});
	},

	batchAdd(e) {
		let that = this;
		let {
			node_batchs
		} = this.data;
		wx.chooseImage({
			count: 10,
			sizeType: ['original', 'compressed'],
			sourceType: ['album', 'camera'],
			success: function (res) {
				res.tempFilePaths.forEach(x => {
					node_batchs.push({
						path: x,
						base64: '',
					})
				});
				that.setData({
					node_batchs
				});
			},
		});
	},

	batchDel(e) {
		let {
			index
		} = e.currentTarget.dataset;
		let {
			node_batchs
		} = this.data;
		node_batchs.splice(index, 1);
		this.setData({
			node_batchs
		});
	},

	async batchUpload(e) {
		let {
			mine,
			node_batchs,
			node_batchs_id
		} = this.data;
		wx.showLoading({
			title: '正在上传',
			mask: true,
		});
		try {
			let imgpathlist = []
			for (let i in node_batchs) {
				let {
					path,
					base64
				} = node_batchs[i];
				if (!base64) {
					base64 = await rcrz.imgUpload({
						filePath: path
					});
					node_batchs[i].base64 = base64.replace(/[\r\n]/g, '');
				}
				let jpg = await rcrz.imgBase64toJPG({
					imgStr: base64
				});
				imgpathlist.push(jpg);
			}
			imgpathlist = imgpathlist.map(x => {
				return {
					imgpath: x
				}
			});
			node_batchs_id = await rcrz.toYxpt({
				imgpathlist,
				idCard: mine.ID_CARD,
			})
			this.setData({
				node_batchs,
				node_batchs_id
			});
			wx.hideLoading();
			wx.showModal({
				title: '',
				content: '上传成功',
				showCancel: false,
				confirmText: '确定',
				success: (result) => {
					if (result.confirm) {
						this.setData({
							show_camera_batch: false
						});
						this.dataSave();
					}
				},
			});
		} catch (err) {
			wx.hideLoading();
			wx.showModal({
				title: '提示',
				content: err.message || err,
				showCancel: false,
				confirmText: '确定',
			});
		}
	},

	cameraBatch(e) {
		this.setData({
			show_camera_batch: true
		})
	},

	changeIsSelf(e) {
		let {
			mine,
			node_is_self_flag,
			node_person_name,
			node_cert_no,
			node_cust_phone_no
		} = this.data;
		if (node_is_self_flag == '1') {
			node_person_name = mine.REAL_NAME;
			node_cert_no = mine.ID_CARD;
			node_cust_phone_no = mine.TEL;
		} else {
			node_person_name = '';
			node_cert_no = '';
			node_cust_phone_no = '';
		}
		this.setData({
			node_person_name,
			node_cert_no,
			node_cust_phone_no
		})
	},

	pickerWorkStation(e) {
		let {
			code,
			postcode,
			value
		} = e.detail.detail;
		let {
			node_cust_cadr,
			node_cust_cadr_info
		} = this.data;
		node_cust_cadr_info = {
			code,
			postcode,
			value
		};
		node_cust_cadr = code[code.length - 1];
		this.setData({
			node_cust_cadr,
			node_cust_cadr_info
		});
	},

	pickerSupportLevel(e) {
		let {
			node_support_level,
			node_rate_area,
			node_areaname
		} = this.data;
		if (node_rate_area) {
			node_rate_area = '';
			node_areaname = '';
			this.setData({
				node_rate_area,
				node_areaname
			});
		}
	},
	//模糊查询所有人才计划名称
	async searchPlans(e) {
		let {
			node_plan_name,
			range_plans
		} = this.data;
		try {
			var res = await rcrz.selectAllByPlanName({
				planName: node_plan_name
			});
			range_plans = res.planNameList.map((x, idx) => {
				return {
					key: idx,
					value: x.planName
				}
			});
			this.setData({
				range_plans
			})
		} catch (err) {}
	},
	pickerPlan(e) {
		let {
			node_plan_name,
			range_support_levels,
			range_rate_areas
		} = this.data;
		if (!node_plan_name) {
			return
		}
		try {
			rcrz.selectByPlanName({
				planName: node_plan_name
			}).then(res => {
				let talentInfo = JSON.parse(res.talentInfo);
				/*
				CATG_CODE: "A001"
				MAJOR_CATG: "B"
				PLAN_NAME: "江苏省乡土人才“三带”名人"
				RATE_AREA_REG: "14"
				RISK_TAK: "1"
				SUB_CATG: "A2"
				SUPPORT_LEVEL: "2"
				TRA_ETD: "2021/10/29"
				TRA_FLG: "1"
				TRA_STD: "2021/9/19"

				CATG_CODE: "B001"
				MAJOR_CATG: "C"
				PLAN_NAME: "太湖人才计划"
				RATE_AREA: "14"
				RATE_AREA_CITY: "2"
				RATE_AREA_REG: "14"
				RISK_TAK: "1"
				SUB_CATG: "A2"
				SUPPORT_LEVEL: "3"
				TRA_ETD: "2021/10/29"
				TRA_FLG: "1"
				TRA_STD: "2021/9/17"
				 */
				let range_rate_areas_all = [];
				for (let level in range_rate_areas) {
					for (let i in range_rate_areas[level]) {
						range_rate_areas_all.push(range_rate_areas[level][i]);
					}
				}
				let node_rate_area = talentInfo.RATE_AREA_CITY || talentInfo.RATE_AREA_REG || talentInfo.RATE_AREA || '';
				this.setData({
					node_support_level: talentInfo.SUPPORT_LEVEL || '5',
					node_levelname: range_support_levels.find(x => x.key == talentInfo.SUPPORT_LEVEL).value || '',
					node_rate_area: node_rate_area,
					node_areaname: range_rate_areas_all.find(x => x.key == node_rate_area).value || '',
					// node_rate_year: talentInfo.TRA_STD.split('/')[0] || '', // 评定年份不跟着人才计划走 让客户选择
				})
			})
		} catch (err) {

		}
	},

	searchCompany(e) {
		let {
			node_company_name
		} = this.data;
		if (node_company_name.length >= 4 && /^[\u4E00-\u9FA5-（）()]{4,50}$/.test(node_company_name)) {
			rcrz.getQyName({
				keyWord: node_company_name
			}).then(res => {
				if (res.entNamesList) {
					this.setData({
						companys: res.entNamesList.map(x => {
							return {
								value: x.entNames
							}
						})
					});
				}
			})
		}
	},

	chooseCompany(e) {
		let {
			node_company_name,
			node_credit_code,
			mine
		} = this.data;
		rcrz.getBusInfo({
			openid: mine.OPEN_ID,
			type: '1', // 1-企业名称 2-统一码
			companyName: node_company_name
		}).then(res => {
			let {
				eNTNAME,
				cREDITCODE,
				eNTSTATUS
			} = res;

			if (!eNTNAME || !cREDITCODE) {
				wx.showToast({
					title: '企业信息异常，请手动录入',
					icon: 'none',
				});
				return;
			}

			const STATUS = ['存续', '在营', '开业'];
			if (STATUS.findIndex((e) => eNTSTATUS.indexOf(e) > -1) === -1) {
				wx.showToast({
					title: '经营状态不正常',
					icon: 'none',
				});
				return;
			}

			let province = cREDITCODE.substring(2, 4);
			if (['32', '11', '31', '44', '33'].indexOf(province) < 0) {
				wx.showToast({
					title: '暂不支持该地区企业申请业务',
					icon: 'none',
				});
				return;
			}

			node_credit_code = cREDITCODE;

			this.setData({
				node_credit_code
			});
		})
	},

	authIndex(e) {
		wx.showModal({
			title: '提示',
			content: '请您先录入个人信息',
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
	},

	async faceRecogLoad(e) {
		let {
			mine
		} = this.data;
		let res;

		if (app.rcrz_face_info) {
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
		let {
			mine
		} = this.data;

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
					success: function (res) {},
					fail: function (err) {},
					complete: res => {
						/*
						res:
							errCode: 0
							errMsg: "startFacialRecognitionVerifyAndUploadVideo:ok"
							verifyResult: "xxxxxx"
						*/
						if (res.errCode === 0) { // 识别成功
							app.rcrz_face_info = res;
							user.addFaceInfo("0", res.errCode + res.errMsg).then(res => {});
						} else { // 识别失败
							app.rcrz_face_info = false;
							user.addFaceInfo("1", res.errCode + res.errMsg).then(res => {});
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
				app.rcrz_face_info = false;
				user.addFaceInfo("1", "设备不支持人脸").then(res => {});
			},
		});
	},

	async idCardRecogLoad(e) {
		let res, info;
		try {
			info = await user.getIdentityInfo();
			res = 'suc';
		} catch (err) {
			res = '';
		}
		return res;
	},

	async dataSave(e) {
		let {
			mine,
			node_batchs_id
		} = this.data;
		let nodes_wx = {};
		Object.keys(this.data).forEach((k) => {
			if (k.substr(0, 5) == 'node_') {
				nodes_wx[k] = this.data[k];
			}
		})
		nodes_wx.updated = Date.parse(new Date()) / 1000;
		nodes_wx.node_batchs = []; // 图片太大 获取暂存时 通过batchid重新获取base64
		await rcrz.saveRcrzData({
			openId: mine.OPEN_ID,
			batchId: node_batchs_id || '',
			requestData: JSON.stringify(nodes_wx),
		})
	},

	async stepNext(e) {
		let {
			mine,
			options,
			// 1.实名认证
			node_auth, // 个人信息
			node_face, // 人脸识别
			node_id_card, // 证件拍照
			// 2.是否本人申请
			node_is_self_flag, // 是否本人申请 1-是 0-否
			node_person_name, // 人才姓名
			node_cert_type, // 证件类型 1-身份证
			node_cert_no, // 证件号码
			node_cust_phone_no, // 联系号码
			node_cust_occ, // 职业码
			node_tal_rel_type, // 与企业关系码
			node_company_name, // 工作单位名称
			node_credit_code, // 统一信用机构代码
			node_cust_cadr, // 工作地区码
			node_cust_cadr_info, // 工作地区
			// 3.是否列入政府人才计划
			node_inc_flag, // 是否列入政府人才计划 1-是 0-否
			// 4.人才计划信息录入
			node_support_level, // 人才等级数 5-无
			node_levelname, // 人才等级名
			node_rate_area, // 人才评定地区码
			node_areaname, // 人才评定地区名
			node_rate_year, // 人才评定年份
			node_plan_name, // 人才计划名称
			// 5.影像资料录入
			node_batchs, // 影像资料集
			node_batchs_id, // 影像资料集BatchId
			// 6.客户授权
			node_empower, // 是否已授权 1-是 0-否

			node_cust_edu, // 学历码
			node_cust_inc, // 年收入(税前 万元)
			node_sto_flag, // 是否在省人才库内 1-是 0-否

			node_step, // 第几步 1~6
			node_steps, // 步骤步数数组
		} = this.data;
		let res;

		/* 各步骤的参数验证 */
		if (node_step == 1) { // 1.实名认证
			let {
				node_auth,
				node_face,
				node_id_card
			} = this.data;
			if (node_auth != "suc") {
				wx.showToast({
					title: "请您完善个人信息",
					icon: "none"
				});
				return;
			}
			if (node_face != "suc") {
				wx.showToast({ title:"请您完善人脸识别", icon:"none" });
				return;
			}
			if (node_id_card != "suc") {
				wx.showToast({ title:"请您完善证件拍照", icon:"none" });
				return;
			}
		} else if (node_step == 2) { // 2.是否本人申请
			this.WxValidate = new WxValidate({
				node_person_name: {
					required: true,
				},
				node_cert_no: {
					required: true,
					idcard: true,
				},
				node_cust_phone_no: {
					required: true,
					tel: true,
				},
				node_company_name: { required:true, },
				node_credit_code: { required:true, orgID:true, },
			}, {
				node_person_name: {
					required: "请输入人才姓名",
				},
				node_cert_no: {
					required: "请输入证件号码",
				},
				node_cust_phone_no: {
					required: "请输入联系号码",
				},
				node_company_name: { required:"请输入工作单位名称", },
				node_credit_code: { required:"请输入统一码", },
			});
			if (!this.WxValidate.checkForm(this.data)) {
				wx.showToast({
					title: this.WxValidate.errorList[0].msg,
					icon: "none"
				});
				return;
			}
			let {node_cust_occ,node_tal_rel_type,node_cust_cadr} = this.data;
			if (!node_cust_occ) {
				wx.showToast({ title:"请您选择职业", icon:"none" });
				return;
			}
			if (!node_tal_rel_type) {
				wx.showToast({ title:"请您选择与企业关系", icon:"none" });
				return;
			}
			if (!node_cust_cadr) {
				wx.showToast({ title:"请您选择工作地区", icon:"none" });
				return;
			}
		} else if (node_step == 3) { // 3.是否列入政府人才计划


        } else if (node_step == 4 && node_inc_flag == '1') { // 4.人才计划信息录入
            this.WxValidate = new WxValidate({
                node_plan_name: {
                    required: true,
                },
            }, {
                node_plan_name: {
                    required: "请输入人才计划名称",
                },
            });
            if (!this.WxValidate.checkForm(this.data)) {
                wx.showToast({
                    title: this.WxValidate.errorList[0].msg,
                    icon: "none"
                });
                return;
            }
            let { node_support_level, node_rate_area, node_rate_year } = this.data;
            // || node_support_level == '5'
            if (!node_support_level) {
                wx.showToast({ title: "请您选择人才等级", icon: "none" });
                return;
            }
            if (!node_rate_area) {
                wx.showToast({ title: "请您选择人才评定地区", icon: "none" });
                return;
            }
            if (!node_rate_year) {
                wx.showToast({ title: "请您选择人才评定年份", icon: "none" });
                return;
            }
        } else if (node_step == 5) { // 5.影像资料录入
            let { node_batchs_id } = this.data;
            if (!node_batchs_id) {
                wx.showToast({ title: "请您上传影像资料", icon: "none" });
                return;
            }
        } else if (node_step == 6) { // 6.客户授权
            let {
                node_empower
            } = this.data;
            if (node_empower != '1') {
                wx.showToast({
                    title: "请您先完成授权",
                    icon: "none"
                });
                return;
            }

		}

        /* 各步骤的跳转 */
        switch (node_step) {
            case 1:
                { // 1.实名认证
                    node_step++;
                }
                break;
            case 2:
                { // 2.是否本人申请
                    node_step++;
                }
                break;
            case 3:
                { // 3.是否列入政府人才计划
                    let {
                        node_inc_flag
                    } = this.data;
                    // if (node_inc_flag == '1') {
                    //     node_step++;
                    // } else {
                    //     node_step += 2;
                    // }
                    node_step++;
                }
                break;
            case 4:
                { // 4.人才计划信息录入
                    node_step++;
                }
                break;
            case 5:
                { // 5.影像资料录入
                    node_step++;
                }
                break;
            case 6:
                { // 6.客户授权
                    node_step++;
                }
                break;
            default:
                {}
                break;
        }
        if (node_steps[node_steps.length - 1] != node_step) {
            node_steps.push(node_step);
        }
        this.setData({
            node_step,
            node_steps
        });

		/* 暂存 */
		await this.dataSave();

		/* 授权分享 */
		if (node_step == 6) {
			await this.canvasShareInit();
		}

		/* 提交 */
		if (node_step == 7) {
			wx.showLoading({
				title: '正在提交',
				mask: true,
			});

			// 是否在省人才库内 （来自某入口带参数 若带参数进入则为1 否则为0）
			node_sto_flag = '0';
			if (options.talentInfo && options.talentInfo.talentplanname) {
				node_sto_flag = '1';
			}

			// 学历
			try {
				let {
					edus
				} = this.data;
				res = await rcrz.educationSearch({
					idcard: node_cert_no,
					name: node_person_name
				});
				// console.log(res);
				console.log(res, node_cert_no, node_person_name);
				node_cust_edu = edus[res.cc] || '05';
			} catch (err) {
				node_cust_edu = '05'  
			}
			// 年收入
			try {
				res = await rcrz.interactTaxInfo({
					applyName: node_person_name,
					applyCard: node_cert_no
				});
				node_cust_inc = res.j12ysrje || '0'
			} catch (err) {
				node_cust_inc = '0'
			}

			this.setData({
				node_sto_flag,
				node_cust_edu,
				node_cust_inc
			})
			await this.dataSave();

			// 重复提交
			res = await rcrz.queryRencaiMsg({
				openid: mine.OPEN_ID,
				cert_no: node_cert_no
			});
			if (res == '0') {
				wx.hideLoading();
				wx.showToast({
					title: "已有待认证信息，无需重复提交",
					icon: "none"
				});
				return;
			}

			try {
				let rencai = {
					ORDER_NUMBER: '', // 认证订单编号 ''

					// 申请人
					OPEN_ID: mine.OPEN_ID, // 申请人openid
					APPLY_NAME: mine.REAL_NAME, // 申请人名 mine.REAL_NAME
					APPLY_CERT_NO: mine.ID_CARD, // 申请人证件号码 mine.ID_CARD
					PHONE_NO: mine.TEL, // 申请人联系方式 mine.TEL

					IS_SELF_FLAG: node_is_self_flag == '1' ? '是' : '否', // 是否本人申请 '是'/'否'

                    // 人才
                    REQTB2: node_cert_type, // 证件类型 1-身份证 (REQTB2)
                    CERT_NO: node_cert_no, // 证件号码
                    PERSON_NAME: node_person_name, // 人才姓名
                    CUST_PHONE_NO: node_cust_phone_no, // 人才联系号码
                    CUST_EDU: node_cust_edu, // 学历码
                    CUST_OCC: node_cust_occ, // 职业码
                    CUST_CADR: node_cust_cadr, // 工作地区码 统一码.substring(2, 8)
                    CUST_INC: JSON.stringify(Number(node_cust_inc)), // 年收入(税前 万元)
                    COMPANY_NAME: node_company_name, // 工作单位名称
                    CREDIT_CODE: node_credit_code, // 统一信用机构代码
                    TAL_REL_TYPE: node_tal_rel_type, // 与企业关系码

					// 影像
					NODE_INFO: node_batchs_id, // BatchId 人才身份证件
					NODE_INFO_SP: node_batchs_id, // BatchId 人才资质证明材料

					// 人才计划
					STO_FLAG: node_sto_flag, // 是否在省人才库内 1-是 0-否
					INC_FLAG: node_inc_flag, // 是否列入政府人才计划 1-是 0-否
					SUPPORT_LEVEL: node_support_level, // 列入政府人才计划时 人才等级数 否则为'5'
					LEVELNAME: node_levelname, // 列入政府人才计划时 人才等级名称 否则为''
					RATE_AREA: node_rate_area, // 列入政府人才计划时 人才评定地区码 否则为''
					AREANAME: node_areaname, // 列入政府人才计划时 人才评定地区名 否则为''
					PLAN_NAME: node_plan_name, // 列入政府人才计划时 人才计划名称 否则为''
					RATE_YEAR: node_rate_year, // 列入政府人才计划时 人才评定年份 否则为''

				}
				if (rencai.INC_FLAG != '1') { // 未列入政府人才计划
					rencai.SUPPORT_LEVEL = '';
					rencai.LEVELNAME = '';
					rencai.RATE_AREA = '';
					rencai.AREANAME = '';
					rencai.PLAN_NAME = '';
					rencai.RATE_YEAR = '';
				}
				await rcrz.addRencai(rencai);

				wx.hideLoading();
				wx.showModal({
					title: '',
					content: '提交成功',
					showCancel: false,
					confirmText: '确定',
					success: (result) => {
						if (result.confirm) {
							wx.navigateBack();
						}
					},
				});

			} catch (err) {
				wx.hideLoading();
				wx.showModal({
					title: '提示',
					content: err.message || err,
					showCancel: false,
					confirmText: '确定',
				});
				return;
			}
		}
	},

	async stepLoad(e) {
		/* 固定获取当前用户信息 */
		let {
			mine
		} = this.data;
		mine = await rcrz.getMine();
		this.setData({
			mine
		});
		let res;

		/* 选项初始化 */
		let {
			range_plans
		} = this.data;
		try {
			res = await rcrz.selectAll();
			if (res.planNameList) {
				range_plans = JSON.parse(res.planNameList).map((x, idx) => {
					return {
						key: idx,
						value: x.PLAN_NAME
					}
				});
			}
			this.setData({
				range_plans
			})
		} catch (err) {

		}

		/* 选择是否加载后端暂存的数据 */
		let nodes_save = {};
		try {
			res = await rcrz.selectRcrzData({
				openId: mine.OPEN_ID
			});
			nodes_save = JSON.parse(JSON.parse(res.data));
			if (nodes_save.node_batchs_id) {
				res = await rcrz.showPic({
					openId: mine.OPEN_ID
				});
				nodes_save.node_batchs = JSON.parse(res.picList).map(x => {
					return {
						base64: x.replace(/[\r\n]/g, '')
					}
				});
			}
		} catch (err) {
			nodes_save = {};
		}

		let nodes_save_filter = {};
		Object.keys(nodes_save).forEach((k) => {
			if (k.substr(0, 5) == 'node_') {
				nodes_save_filter[k] = nodes_save[k];
			}
		})

		// 初始第一步的判断
		let node1_load = async () => {
			let {
				node_step
			} = this.data;
			if (!node_step) {
				node_step = 1
			}
			if (node_step == 1) {
				let {
					node_auth,
					node_face,
					node_id_card
				} = this.data;
				node_auth = mine.REAL_NAME && mine.ID_CARD ? 'suc' : '';
				node_face = await this.faceRecogLoad();
				node_id_card = await this.idCardRecogLoad();
				this.setData({
					node_auth,
					node_face,
					node_id_card
				});
			}
		}

		if (Object.keys(nodes_save_filter).length) {
			wx.showModal({
				title: "提示",
				content: "是否继续最近的一条认证记录",
				success: (res) => {
					if (res.confirm) {
						let nodes_wx = {};
						Object.keys(this.data).forEach((k) => {
							if (k.substr(0, 5) == 'node_') {
								nodes_wx[k] = this.data[k];
							}
						})
						Object.assign(nodes_wx, nodes_save_filter);
						this.setData(nodes_wx);
					} else {

					}
				},
				complete: async (res) => {
					await node1_load();
				}
			});
		} else {
			await node1_load();
		}

	},

	stepCancel(e) {
		wx.navigateBack({});
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
			this.setData({
				options
			});
		this.stepLoad();

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
		let {
			node_step,
			node_is_self_flag,
			mine,
			canvas_share,
			preffixUrl
		} = this.data;
		if (node_step == 6 && node_is_self_flag != 1) {
			let img = canvas_share.tempFilePath || `${preffixUrl}apply_empower_share_bg.png`;
			let params = `&apply_openid=${mine.OPEN_ID}`;
			let title = "人才认证";
			let url = "sub4/pages/rcrz/empower";
			return api.shareApp(img, params, title, url);
		}
	}

})