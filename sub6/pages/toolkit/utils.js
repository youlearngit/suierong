import api from '../../../utils/api';

var app = getApp();

var dateTransfer = function (fmt) {
	var o = {
		"M+": this.getMonth() + 1,
		"d+": this.getDate(),
		"h+": this.getHours(),
		"m+": this.getMinutes(),
		"s+": this.getSeconds(),
		"q+": Math.floor((this.getMonth() + 3) / 3),
		S: this.getMilliseconds(),
	};
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(
		RegExp.$1,
		(this.getFullYear() + "").substr(4 - RegExp.$1.length)
		);
	}
	for (var k in o) {
		if (new RegExp("(" + k + ")").test(fmt)) {
		fmt = fmt.replace(
			RegExp.$1,
			RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
		);
		}
	}
	return fmt;
}

Date.DateFormat = function (timeSpan, fmt, formatDateNullValue) {
	if (!timeSpan) {
		if (formatDateNullValue) {
		return formatDateNullValue;
		}
		return "null";
	}
	var date = new Date(timeSpan);
	return dateTransfer.call(date, fmt);
}

function getBBXChannel() {
	if (app.globalData.bbx_channel && app.globalData.bbx_channel.channel) {
		return app.globalData.bbx_channel;
	}
	this.setBBXChannel('');
	return app.globalData.bbx_channel;
}

function setBBXChannel(track_channel) {
	let bbx_channel = { // 通用版小程序 (默认)
		channel: '1000', // 渠道编号 (前端界面判断bbx_channel) (eg. 1000 | 320282 | 310000)
		name: '人才百宝箱', // 渠道名称 (后端接口调用) (eg. 人才百宝箱 | 宜兴人才百宝箱)
		tag_prefix: '', // 标签前缀 (暂未启用)
		track_name: '通用版小程序', // 渠道名 (记录渠道用)
		track_channel: '320000MIN', // 渠道编码 (记录渠道用)
		talent_channel: '2014', // 渠道值 (人才卡)
		sui_channel: '320000MIN', // 渠道号 (随e贷)
	};
	
	switch (track_channel) {
		case '320000MIN': { // 通用版小程序
			bbx_channel = {
				channel: '1000',
				name: '人才百宝箱',
				tag_prefix: '',
				track_name: '通用版小程序',
				track_channel: '320000MIN',
				talent_channel: '2014',
				sui_channel: '320000MIN',
			}
		}break;
		case '320000ACC': { // 江苏银行公众号
			bbx_channel = {
				channel: '1000',
				name: '人才百宝箱',
				tag_prefix: '',
				track_name: '江苏银行公众号',
				track_channel: '320000ACC',
				talent_channel: '2013',
				sui_channel: '320000ACC',
			}
		}break;
		case '320282MIN': { // 宜兴小程序
			bbx_channel = {
				channel: '320282',
				name: '宜兴人才百宝箱',
				tag_prefix: 'yx',
				track_name: '宜兴小程序',
				track_channel: '320282MIN',
				talent_channel: '2012',
				sui_channel: '320282MIN',
			}
		}break;
		case '320282ACC': { // 宜兴公众号
			bbx_channel = {
				channel: '320282',
				name: '宜兴人才百宝箱',
				tag_prefix: 'yx',
				track_name: '宜兴公众号',
				track_channel: '320282ACC',
				talent_channel: '2011',
				sui_channel: '320282ACC',
			}
		}break;
		case '320282':{ // 宜兴旧(公众号)
			bbx_channel = {
				channel: '320282',
				name: '宜兴人才百宝箱',
				tag_prefix: 'yx',
				track_name: '宜兴公众号',
				track_channel: '320282ACC',
				talent_channel: '2011',
				sui_channel: '320282ACC',
			}
		}break;
		case '330110MIN':{ // 才金直通车（人才）
			bbx_channel = {
				channel: '1000',
				name: '人才百宝箱',
				tag_prefix: '',
				track_name: '才金直通车（人才）',
				track_channel: '330110MIN',
				talent_channel: '2018',
				sui_channel: '330110MIN',
			}
		}break;
		case '321200MIN':{ // 泰爱才（人才）
			bbx_channel = {
				channel: '1000',
				name: '人才百宝箱',
				tag_prefix: '',
				track_name: '泰爱才（人才）',
				track_channel: '321200MIN',
				talent_channel: '2019',
				sui_channel: '321200MIN',
			}
		}break;
		case '3201ST':{ // 园融智慧（人才）
			bbx_channel = {
				channel: '1000',
				name: '人才百宝箱',
				tag_prefix: '',
				track_name: '园融智慧（人才）',
				track_channel: '3201ST',
				talent_channel: '2020',
				sui_channel: '3201ST',
			}
		}break;
		case '000000MES':{ // 短信营销（百宝箱）
			bbx_channel = {
				channel: '1000',
				name: '人才百宝箱',
				tag_prefix: '',
				track_name: '短信营销（百宝箱）',
				track_channel: '000000MES',
				talent_channel: '2021',
				sui_channel: '000000MES',
			}
		}break;
		case '310000MIN':{ // 海聚英才
			bbx_channel = {
				channel: '310000',
				name: '人才百宝箱',
				tag_prefix: '',
				track_name: '海聚英才',
				track_channel: '310000MIN',
				talent_channel: '2022',
				sui_channel: '310000MIN',
			}
		}break;
		case '310099MIN':{ // 海聚英才小程序（内部）
			bbx_channel = {
				channel: '310000',
				name: '人才百宝箱',
				tag_prefix: '',
				track_name: '海聚英才小程序（内部）',
				track_channel: '310099MIN',
				talent_channel: '2022',
				sui_channel: '310099MIN',
			}
		}break;
		case '320400MIN':{ // 我的常州（人才）
			bbx_channel = {
				channel: '1000',
				name: '人才百宝箱',
				tag_prefix: '',
				track_name: '我的常州（人才）',
				track_channel: '320400MIN',
				talent_channel: '2026',
				sui_channel: '320400MIN',
			}
		}break;
		default:{

		}break;
	}

	app.globalData.bbx_channel = bbx_channel;
	
	app.globalData.channelNo = bbx_channel.sui_channel; // 随e贷
}

function loadBBXChannelByOptions({channel}) {
	if (channel) {
		this.setBBXChannel(channel);
	}
}

function shareWithBBXChannel({imgPath, params, title, url}) {
	imgPath = imgPath || '';
	params = params || `&channel=${this.getBBXChannel().track_channel}`;
	title = title || this.getBBXChannel().name || '人才百宝箱';
	url = url || '';
	console.log('share',{imgPath, params, title, url})
	return api.shareApp(imgPath, params, title, url);
}

// 政策类别与标签的转换，临时用
function policyTypeToTag(channel='') {
	channel = channel || getBBXChannel().channel;

	let res = {
		"1100":"3100", //"人才工程"
		"1101":"3101", //"重点人才计划"
		"1102":"3102", //"省级人才计划"
		"1103":"3103", //"市级人才计划"
		"1104":"3104", //"区（县）级人才计划"

		"1200":"3200", //"待遇落实"
		"1201":"3201", //"住房安家"
		"1202":"3202", //"奖励补贴"
		"1203":"3203", //"子女入学"
		"1204":"3204", //"研发用房"

		"1300":"3300", //"企业发展"
		"1301":"3301", //"财税政策"
		"1302":"3302", //"租金减免"
		"1303":"3303", //"企业培育"
		"1304":"3304", //"金融支持"

		"1400":"3400", //"公共服务"
		"1401":"3401", //"行业动态"
		"1402":"3402", //"人才引进"
		"1403":"3403", //"研修培训"
		"1404":"3404", //"项目合作"

	}

	if (channel=='320282') { // 宜兴320282
		res = {
			"1100":"3100", //"人才计划"
			"1101":"3101", //"创新创业人才"
			"1102":"3102", //"高级管理人才"
			"1103":"3103", //"青年人才"
			"1104":"3104", //"教育人才"
			"1105":"3105", //"乡土人才"
			"1106":"3106", //"卫健人才"
			"1107":"3107", //"高技高职人才"
			"1108":"3108", //"其他人才计划"

			"1200":"3200", //"人才待遇"
			"1201":"3201", //"陶都英才卡"
			"1202":"3202", //"人才安居"
			"1203":"3203", //"薪酬奖励"
			"1204":"3204", //"人才积分"
			"1205":"3205", //"子女入学"
			"1206":"3206", //"其他人才待遇"

			"1300":"3300", //"人才引进"
			"1301":"3301", //"科技引才"
			"1302":"3302", //"市场招才"
			"1303":"3303", //"招才引智"
			"1304":"3304", //"其他人才引进"

			"1400":"3400", //"公共服务"
			"1401":"3401", //"人才驿站"
			"1402":"3402", //"高校人才"
			"1403":"3403", //"人才科创飞地"
			"1404":"3404", //"其他公共服务"
		}
	}

	return res;
}

function policyFields(channel='') {
	channel = channel || getBBXChannel().channel;
	
	let policy_levels = { // 政策层级
		"1":"国家级",
		"2":"省级",
		"3":"市级",
		"4":"区县级",
	};
	let object_types = { // 对象类型
		"1":"个人",
		"2":"企业",
		"3":"个人及企业",
	};
	let is_effects = { // 是否有效
		"1":"现行有效",
		"0":"已失效",
	};
	let policy_types = { // 政策类别
		"1100":"人才工程",
		"1200":"待遇落实",
		"1300":"企业发展",
		"1400":"公共服务",
	};
	let two_policy_types = { // 政策子类别
		"1100":{
			"1101":"重点人才计划",
			"1102":"省级人才计划",
			"1103":"市级人才计划",
			"1104":"区（县）级人才计划",
		},
		"1200":{
			"1201":"住房安家",
			"1202":"奖励补贴",
			"1203":"子女入学",
			"1204":"研发用房",
		},
		"1300":{
			"1301":"财税政策",
			"1302":"租金减免",
			"1303":"企业培育",
			"1304":"金融支持",
		},
		"1400":{
			"1401":"行业动态",
			"1402":"人才引进",
			"1403":"研修培训",
			"1404":"项目合作",
		},
	};
	let area_provinces = { // 适用地区_省
		"000000":"全国",
		"110000":"北京",
		"120000":"天津",
		"130000":"河北省",
		"140000":"山西省",
		"150000":"内蒙古自治区",
		"210000":"辽宁省",
		"220000":"吉林省",
		"230000":"黑龙江省",
		"310000":"上海",
		"320000":"江苏省",
		"330000":"浙江省",
		"340000":"安徽省",
		"350000":"福建省",
		"360000":"江西省",
		"370000":"山东省",
		"410000":"河南省",
		"420000":"湖北省",
		"430000":"湖南省",
		"440000":"广东省",
		"450000":"广西壮族自治区",
		"460000":"海南省",
		"500000":"重庆",
		"510000":"四川省",
		"520000":"贵州省",
		"530000":"云南省",
		"540000":"西藏自治区",
		"610000":"陕西省",
		"620000":"甘肃省",
		"630000":"青海省",
		"640000":"宁夏回族自治区",
		"650000":"新疆维吾尔自治区",
		"710000":"台湾省",
		"810000":"香港特别行政区",
		"820000":"澳门特别行政区"
	};
	/* 政策标签(备份)
	let policy_labels = { // 政策标签 
		// 个人标签 10XX + 身份 11XX
		"1001":"科技奖励获得者",
		"1002":"国务院特殊津贴获得者",
		"1003":"市级以上人才计划",
		"1004":"博士后",
		"1005":"院士",
		"1006":"省双创计划",
		"1007":"省333培育工程",
		// "1008":"高新技术企业",
		// "1009":"科技中小企业",
		// "1010":"民营科技企业",
		// "1011":"“卡脖子”技术",
		"1012":"科技镇长团",
		// "1013":"企业高管",
		"1014":"省科技企业家",
		"1015":"高级专家",
		// "1101":"创业者",
		// "1102":"受薪人士",
		// "1103":"应届毕业生",
		// "1105":"海外人才",

		// 企业标签 20XX
		"2001":"“卡脖子”项目承接单位",
		"2002":"高新技术企业",
		"2003":"科技中小企业",
		"2004":"民营科技企业",
		"2005":"科创板上市（拟上市）企业",

		// 政策类别 31XX,32XX,33XX,34XX
		"3100":"人才工程", //
		"3101":"重点人才计划",
		"3102":"省级人才计划",
		"3103":"市级人才计划",
		"3104":"区（县）级人才计划",

		"3200":"待遇落实", //
		"3201":"住房安家",
		"3202":"奖励补贴",
		"3203":"子女入学",
		"3204":"研发用房",

		"3300":"企业发展", //
		"3301":"财税政策",
		"3302":"租金减免",
		"3303":"企业培育",
		"3304":"金融支持",

		"3400":"公共服务", //
		"3401":"行业动态",
		"3402":"人才引进",
		"3403":"研修培训",
		"3404":"项目合作",

		// 学历 40XX
		"4005":"博士",
		"4006":"硕士",
		"4007":"本科",
		"4008":"大专",
		"4009":"其他",

		// 国籍 50XX
		"5001":"中国",
		"5002":"外籍",
	
		// 行业 60XX
		"6011":"新一代信息技术产业",
		"6012":"高端软件和信息服务业",
		"6013":"生物技术和新医药产业",
		"6014":"新材料产业",
		"6015":"高端装备制造产业",
		"6016":"节能环保产业",
		"6017":"新能源和能源互联网产业",
		"6018":"新能源汽车产业",
		"6019":"空天海洋装备产业数字创意产业",
		"6020":"其他",

		// 需求想法 70XX
		"7001":"自主创业",
		"7002":"寻找工作",
		"7003":"了解政策",

		// 职称 80XX
		// "8001":"正高级",
		// "8002":"副高级",
		// "8003":"中级职称",
		// "8006":"初级职称及以下",
	};
	*/
	let policy_labels_identity = { // identity 身份
		// 身份 11XX x=>1100<x&x<1200
		"1101":"创业者",
		"1102":"受薪人士",
		"1103":"应届毕业生",
		"1105":"海外人才",
	};
	let policy_labels_want = { // want 需求想法
		// 需求想法 70XX x=>7000<x&x<7100
		"7001":"自主创业",
		"7002":"寻找工作",
		"7003":"了解政策",
	};
	let policy_labels_rank = { // rank 职称
		// 职称 80XX x=>8000<x&x<8100
		"8001":"正高级",
		"8002":"副高级",
		"8003":"中级职称",
		"8006":"初级职称及以下",
	};
	let policy_labels_cate = { // cate 类别
		// 政策类别 31XX,32XX,33XX,34XX x=>3000<x&x<4000&(x%100==0)
		"3100":"人才工程",

		"3200":"待遇落实",

		"3300":"企业发展",

		"3400":"公共服务",

	};
	let policy_labels_subcate = { // subcate 子类别
		// 政策类别 31XX,32XX,33XX,34XX x=>3100<x&x<3200
		"3101":"重点人才计划",
		"3102":"省级人才计划",
		"3103":"市级人才计划",
		"3104":"区（县）级人才计划",

		"3201":"住房安家",
		"3202":"奖励补贴",
		"3203":"子女入学",
		"3204":"研发用房",

		"3301":"财税政策",
		"3302":"租金减免",
		"3303":"企业培育",
		"3304":"金融支持",

		"3401":"行业动态",
		"3402":"人才引进",
		"3403":"研修培训",
		"3404":"项目合作",

	};
	let policy_labels_education = { // education 学历
		// 学历 40XX x=>4000<x&x<4100
		"4005":"博士",
		"4006":"硕士",
		"4007":"本科",
		"4008":"大专",
		"4009":"其他",
	};
	let policy_labels_nationality = { // nationality 国籍
		// 国籍 50XX x=>5000<x&x<5100
		"5001":"中国",
		"5002":"外籍",
	};
	let policy_labels_trade = { // trade 行业
		// 行业 60XX x=>6000<x&x<6100
		"6011":"新一代信息技术产业",
		"6012":"高端软件和信息服务业",
		"6013":"生物技术和新医药产业",
		"6014":"新材料产业",
		"6015":"高端装备制造产业",
		"6016":"节能环保产业",
		"6017":"新能源和能源互联网产业",
		"6018":"新能源汽车产业",
		"6019":"空天海洋装备产业数字创意产业",
		"6020":"其他",
	};
	let policy_labels_owntags = { // owntags 个人标签
		// 个人标签 10XX x=>1000<x&x<1100
		"1001":"科技奖励获得者",
		"1002":"国务院特殊津贴获得者",
		"1003":"市级以上人才计划",
		"1004":"博士后",
		"1005":"院士",
		"1006":"省双创计划",
		"1007":"省333培育工程",
		// "1008":"高新技术企业",
		// "1009":"科技中小企业",
		// "1010":"民营科技企业",
		// "1011":"“卡脖子”技术",
		"1012":"科技镇长团",
		// "1013":"企业高管",
		"1014":"省科技企业家",
		"1015":"高级专家",
	};
	let policy_labels_tags = { // tags 企业标签
		// 企业标签 20XX x=>2000<x&x<2100
		"2001":"“卡脖子”项目承接单位",
		"2002":"高新技术企业",
		"2003":"科技中小企业",
		"2004":"民营科技企业",
		"2005":"科创板上市（拟上市）企业",
	};

	if (channel=='320282') { // 宜兴320282
		policy_types = { // 政策类别
			"1100":"人才计划",
			"1200":"人才待遇",
			"1300":"人才引进",
			"1400":"公共服务",
		};
		two_policy_types = { // 政策子类别
			"1100":{
				"1101":"创新创业人才",
				"1102":"高级管理人才",
				"1103":"青年人才",
				"1104":"教育人才",
				"1105":"乡土人才",
				"1106":"卫健人才",
				"1107":"高技高职人才",
				"1108":"其他人才计划",
			},
			"1200":{
				"1201":"陶都英才卡",
				"1202":"人才安居",
				"1203":"薪酬奖励",
				"1204":"人才积分",
				"1205":"子女入学",
				"1206":"其他人才待遇",
			},
			"1300":{
				"1301":"科技引才",
				"1302":"市场招才",
				"1303":"招才引智",
				"1304":"其他人才引进",
			},
			"1400":{
				"1401":"人才驿站",
				"1402":"高校人才",
				"1403":"人才科创飞地",
				"1404":"其他公共服务",
			},
		};
		policy_labels_cate = { // cate 类别
			// 政策类别 31XX,32XX,33XX,34XX x=>3000<x&x<4000&(x%100==0)
			"3100":"人才计划",
	
			"3200":"人才待遇",
	
			"3300":"人才引进",
	
			"3400":"公共服务",

		};
		policy_labels_subcate = { // subcate 子类别
			// 政策类别 31XX,32XX,33XX,34XX x=>3100<x&x<3200
			"3101":"创新创业人才",
			"3102":"高级管理人才",
			"3103":"青年人才",
			"3104":"教育人才",
			"3105":"乡土人才",
			"3106":"卫健人才",
			"3107":"高技高职人才",
			"3108":"其他人才计划",

			"3201":"陶都英才卡",
			"3202":"人才安居",
			"3203":"薪酬奖励",
			"3204":"人才积分",
			"3205":"子女入学",
			"3206":"其他人才待遇",

			"3301":"科技引才",
			"3302":"市场招才",
			"3303":"招才引智",
			"3304":"其他人才引进",

			"3401":"人才驿站",
			"3402":"高校人才",
			"3403":"人才科创飞地",
			"3404":"其他公共服务",
	
		};
	}
	
	let res = {
		policy_levels,
		object_types,
		is_effects,
		policy_types,
		two_policy_types,
		area_provinces,
		policy_labels : { 
			...policy_labels_identity, 
			...policy_labels_want, 
			...policy_labels_rank, 
			...policy_labels_cate, 
			...policy_labels_subcate, 
			...policy_labels_education, 
			...policy_labels_nationality, 
			...policy_labels_trade, 
			...policy_labels_owntags, 
			...policy_labels_tags 
		},
		policy_labels_identity, 
		policy_labels_want, 
		policy_labels_rank, 
		policy_labels_cate, 
		policy_labels_subcate, 
		policy_labels_education, 
		policy_labels_nationality, 
		policy_labels_trade, 
		policy_labels_owntags, 
		policy_labels_tags 
	}

	return res;
}

function questionFields() {
	return {
		ages: { // 年龄
			"1":"30",
			"2":"30-35",
			"3":"35-40",
			"4":"40-45",
			"5":"45-55",
			"6":"55以上",
		},
		yearss: { // 年限
			"1":"1-3",
			"2":"3-5",
			"3":"5-10",
			"4":"10以上",
		},
		edunumbers: { // 学历人数
			"1":"1-3",
			"2":"3-5",
			"3":"5-10",
			"4":"10以上",
		},
		tipss: { // tips
			// "1":"2021年政策推荐",
			// "2":"江苏省政策",
			// "3":"南京市最新政策",
		},
	}

}

function preffixUrl() {
	// @199: /home/rhedt-interface-1_1_1-PROD_war.ear/rhedt-interface-1.1.1-DEV.war/WEB-INF/classes/static/wechat/img/bbx 
	// @199: /home/rhedt-interface-1_1_0-PROD_war.ear/rhedt-interface-1.1.1-DEV.war/WEB-INF/classes/static/wechat/img/bbx
	return app.globalData.CDNURL +'/static/wechat/img/gjx/';
}

function searchArrVal(arr,text) {
	let text_arr = text.split(',');
	let find_arr = [];
	for(let i in text_arr) {
		for (let k in arr) {
			if (text_arr[i] == arr[k]) {
				find_arr.push(k);
				break;
			}
		}
	}
	if (find_arr) {
		return find_arr.join(',');
	}
	return "";
}

function repeatArrKey(arr,key) {
	let res = [];
	let has_key = [];
	for(let i in arr) {
		if (has_key.indexOf(arr[i][key])==-1) {
			has_key.push(arr[i][key]);
			res.push(arr[i]);
		}
	}
	return res;
}

function textToHtml(text) {
	return text.replace(/\r\n/g,"<br>").replace(/\n/g,"<br>").replace(/？/g," ").split("<br>")
	// console.log("<CLOB>".split("<br>"));
	// console.log([ '<CLOB>' ]==='<CLOB>');
}

function scopeUserLocation() {
	return new Promise(function(resolve,reject){
		wx.getSetting({
			success: (res) => {
				if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] == false) {
					wx.showModal({
						title: '请求授权当前位置',
						content: '需要获取您的地理位置，请确认授权',
						success: function (res) {
							if (res.cancel) {
								wx.showToast({
									title: '拒绝授权',
									icon: 'none',
									duration: 1000,
								});
								return reject('拒绝授权');
							} else if (res.confirm) {
								wx.openSetting({
									success: function (dataAu) {
										if (dataAu.authSetting['scope.userLocation'] == true) {
											wx.showToast({
												title: '授权成功',
												icon: 'success',
												duration: 1000,
											});
											return resolve();
										} else {
											wx.showToast({
												title: '授权失败',
												icon: 'none',
												duration: 1000,
											});
											return reject('授权失败');
										}
									},
								});
							}
						},
					});
				} else if (res.authSetting['scope.userLocation'] == undefined) {
					return resolve();
				} else {
					return resolve();
				}
			},
		});
	});
}

function getUserLocation(type='gcj02',cache=true) {
	return new Promise(function(resolve,reject){
		if (cache) {
			let loc = app.globalData.bbx_getUserLocation;
			if (loc) {
				if (loc._invalid && loc._invalid>Date.parse(new Date())) {
					return resolve(loc);
				}
			}
		}
		scopeUserLocation().then(res=>{
			getLocation(type).then(res=>{
				let {latitude,longitude} = res;
				reverseGeocoder(latitude,longitude).then(res=>{
					res._invalid = Date.parse(new Date())+5*60*1000;
					app.globalData.bbx_getUserLocation = res;
					return resolve(res);
				})
			})
		})
	})

// 	let res = await scopeUserLocation();
// 	res = await getLocation(type);
// 	let {latitude,longitude} = res;
// 	res = await reverseGeocoder(latitude,longitude);
// // latitude: 32.05838, longitude: 118.79647, province: "江苏省", city: "南京市", district: "玄武区", adcode: "320102", codes: [], values: []
// 	return res;
}

function getLocation(type='gcj02') {
	return new Promise(function(resolve,reject){
		wx.getLocation({
			type: type, //gcj02 wgs84
			success: function (res) {
				// let latitude = res.latitude;
				// let longitude = res.longitude;
				return resolve(res);
			},
			fail: function (err) {
				return reject(err)
			},
		});
	});
}

async function getLocationByAdcode(adcode) {
	let adcodex={},location={},citys;

	citys = await getCityList();
	for (let i in citys) {
		for (let n in citys[i]) {
			let r = citys[i][n];
			adcodex[r.id] = {
				code: r.id,
				value: r.fullname,
				latitude: r.location.lat,
				longitude: r.location.lng,
			}
		}
	}
	
	location = {
		adcode: adcode,
		province: '',
		city: '',
		district: '',
		codes: [],
		values: [],
	}

	for (let i=0; i<3; i++) {
		let _code;
		if (i==0) { _code=adcode.substr(0,2)+'0000'; }
		if (i==1) { _code=adcode.substr(0,4)+'00'; }
		if (i==2) { _code=adcode; }
		
		if (!adcodex[_code]) { continue; }

		if (i==0) { location.province = adcodex[_code].value; }
		if (i==1) { location.city = adcodex[_code].value; }
		if (i==2) { location.district = adcodex[_code].value; }

		location.codes.push(adcodex[_code].code);
		location.values.push(adcodex[_code].value);
		location.latitude = adcodex[_code].latitude;
		location.longitude = adcodex[_code].longitude;

		if (_code==adcode) { break; } 
	}
	
	return location;
}

async function getRegionCode2(regionCode) {
	let arr = []; 

	let adCodeList = await api.getDistarct('100000', '3');
	let provinceCode,cityCode,provice

	if (regionCode) {
		provinceCode = regionCode.substring(0, 2);

		let getCityCode = function (cityID) {
			switch (cityID) {
			  case '3305':
			  case '3306':
			  case '3300':
				cityID = '3301';
				break;
			  case '4400':
				cityID = '4403';
				break;
			  case /^310/.test(cityID):
				cityID = '3101';
				break;
			  case /^110/.test(cityID):
				cityID = '1101';
				break;
			  default:
				break;
			}
			return cityID;
		}
		cityCode = getCityCode(regionCode.substring(0, 4));
		provice = adCodeList.districts[0].districts.find((e) => e.adcode === `${provinceCode}0000`);
	}

	if (!provice) {
		let proviceList = ['11', '32', '44', '33', '31'];
		provice = adCodeList.districts[0].districts.filter((e) => proviceList.includes(e.adcode.substring(0, 2)));

		provice.forEach((e) => {
			let adcode = e.adcode;
			if (adcode === '440000' || adcode === '330000') {
				e.districts = e.districts.filter((e) => e.adcode === '330100' || e.adcode === '440300');
			}
		});

		arr.push({
			values: provice,
		});

		arr.push({
			values: provice[0].districts,
		});

		arr.push({
			values: provice[0].districts[0].districts,
		});

	} else {
		arr.push({
			values: [provice],
		});
		let city = provice.districts.find((e) => e.adcode === `${cityCode}00`);
		if (!city) {
			arr.push({
				values: provice.districts,
			});
			arr.push({
				values: provice.districts[0].districts,
			});
			return arr;
		}
		arr.push({
			values: [city],
		});
		arr.push({
			values: city.districts,
		});
	}

	return arr;
}

function getCityList() {
	return new Promise(function(resolve,reject){
		if (app.globalData.bbx_citys) {
			return resolve(app.globalData.bbx_citys);
		}
		let QQMapWX = require('../../../assets/plugins/qqmap-wx-jssdk1.2/qqmap-wx-jssdk.js');
		let qqmapsdk = new QQMapWX({
			key: '2RIBZ-UTLC2-AWQUY-C7I2T-3YKN5-AIF4D',
		});
		qqmapsdk.getCityList({
			success: function(res) {
				app.globalData.bbx_citys = res.result;
				return resolve(res.result);
			},
			fail: function(error) {
				return reject(err);
			},
			complete: function(res) {
				
			}
		});
	});
}

function getDistrictByCityId(city_id) {
	return new Promise(function(resolve,reject){
		let QQMapWX = require('../../../assets/plugins/qqmap-wx-jssdk1.2/qqmap-wx-jssdk.js');
		let qqmapsdk = new QQMapWX({
			key: '2RIBZ-UTLC2-AWQUY-C7I2T-3YKN5-AIF4D',
		});
		qqmapsdk.getDistrictByCityId({
			id: city_id,
			success: function(res) {
				return resolve(res);
			},
			fail: function(error) {
				return reject(err);
			},
			complete: function(res) {
				
			}
		});
	});
}

function reverseGeocoder(latitude,longitude) {
	return new Promise(function(resolve,reject){
		let QQMapWX = require('../../../assets/plugins/qqmap-wx-jssdk1.2/qqmap-wx-jssdk.js');
		let qqmapsdk = new QQMapWX({
			key: '2RIBZ-UTLC2-AWQUY-C7I2T-3YKN5-AIF4D',
		});
		qqmapsdk.reverseGeocoder({
			location: {
				latitude: latitude,
				longitude: longitude,
			},
			success: function (res) {
				let province = res.result.ad_info.province;
				let city = res.result.ad_info.city;
				let district = res.result.ad_info.district;
				let adcode = res.result.ad_info.adcode;
				return resolve({
					latitude: latitude,
					longitude: longitude,
					province: province,
					city: city,
					district: district,
					adcode: adcode,
					codes: [adcode.substr(0,2)+'0000', adcode.substr(0,4)+'00', adcode],
					values: [province, city, district],
				});
			},
			fail: function (err) {
				return reject(err);
			},
			complete: function (res) {
				
			},
		});
	});
}

module.exports = {
	preffixUrl : preffixUrl,
	policyFields : policyFields,
	questionFields : questionFields,
	searchArrVal : searchArrVal,
	repeatArrKey : repeatArrKey,
	textToHtml : textToHtml,
	scopeUserLocation : scopeUserLocation,
	getUserLocation : getUserLocation,
	getLocation : getLocation,
	getLocationByAdcode : getLocationByAdcode,
	getCityList : getCityList,
	getDistrictByCityId : getDistrictByCityId,
	getRegionCode2 : getRegionCode2,
	reverseGeocoder : reverseGeocoder,
	policyTypeToTag : policyTypeToTag,
	setBBXChannel : setBBXChannel,
	getBBXChannel : getBBXChannel,
	loadBBXChannelByOptions : loadBBXChannelByOptions,
	shareWithBBXChannel : shareWithBBXChannel,

}