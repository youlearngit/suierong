// sub1/pages/product/introduce.js

const app = getApp();
import requestP from "../../../utils/requsetP";
import skip from "../../../utils/skip";
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		preview: true,
    desc: {},
    casecode:'',
		desc1: {
			title: "供应链云平台e融单",
			desc:
				"江苏银行供应链金融云平台e融单是指客户基于真实贸易背景和反向保理间接授信额度，在云平台上签发并承诺在特定日期付款的债权凭证，e融单业务是指e融单在云平台上的签发、签收、流转和基于e融单提供的融资服务。",
			img: "",
			advantage: "应收应付智能管理，可拆分转让，保障回款，全流程线上融资，秒级放款，价格普惠。",
			target: "制造、流通、建筑、电力等行业有固定账期的核心企业及其供应商。",
			stepstitle: "核心企业业务流程",
			steps2title: "供应商业务流程",
			steps: [
				"申请授信额度",
				"与江苏银行签署合作协议",
				"在江苏银行开立结算户并注册申请供应链金融云平台用户",
				"填写或批量上传应付账款信息，签发e融单",
				"到期前在结算户留存资金，自动划扣。",
			],
			steps2: [
				"联系核心企业客户经理，在江苏银行开户。",
				"注册申请供应链云平台用户，提供必要的注册资料。",
				"在云平台签收e融单",
				"持有e融单至到期、或转让给其他贸易伙伴、或向江苏银行申请融资。",
			],
			material: "",
		},
		desc2: {
			title: "供应链云平台代理付款产品",
			desc:
				"江苏银行供应链金融云平台代理付款业务，是指本行依据客户在云平台上登记的付款信息，在约定的日期，从客户结算账户中主动扣款并对外支付的服务。",
			img: "",
			advantage: "应付账款智能管理，自动划扣，随时撤销。",

			target: "所有有预约自动付款需求的核心企业。",
			stepstitle: "核心企业业务流程",
			steps2title: "供应商业务流程",
			steps: [
				"在江苏银行开立结算户并注册申请供应链金融云平台用户。",
				"与江苏银行签署合作协议。",
				"填写或批量上传预约账款信息。",
				"到期前在结算户留存资金，自动划扣。",
			],
			steps2: ["无需在江苏银行开户。", "到期收款。"],
			material: "",
		},

		desc3: {
			title: "“智盛”现金管理产品",
			desc:
				"江苏银行“智盛”现金管理是指依托现金管理平台，协助客户提高资金流动性、增加资金收益、降低财务成本，以本行结算账户为基础，将账户管理、收付款管理、投融资理财、风险管理、信息服务等进行有机组合的资金管理综合化、方案式服务。",
			img: "",
			advantage:
				"1.收付款便捷，实现成员单位收支两条线管理，协助集团统一运营管理资金；\n2.多级账簿分层管理和分项核算；\n3.为客户进行账户间资金流动性管理；\n4.资金池功能将参与账户的资金集中管理，实现资金共享使用。",
			target:
				"1.对各类资金与账户集中有管控需求的集团企业；\n2.财政、医疗、教育、招投标等政府机构类客户，可提供单一实体账户下分部门、分用途的多个内部虚拟账户分类核算服务；\n3.为产业链核心企业、电商平台的上下游客户、平台交易会员提供资金账户的开立和交易资金的划转等服务，以及融资款项监控、货款回笼及自动还款等增值服务。",
			stepstitle: "业务流程",
			steps2title: "",
			steps: [
				"子公司账户每日正常对外收支。",
				"各子公司账户每日余额自动归集至母公司账户。",
				"归集资金形成资金池，母公司可进行自主调配和投资理财。",
				"实现月末对各公司账户的对账管理。",
			],
			steps2: [],
			material: "",
		},
		desc4: {
			title: "“智盛”票据池产品",
			desc:
				"“智盛”票据池是江苏银行根据客户的要求，提供票据代保管、票据信息查询、查询查复、贴现、委托收款、以及以代保管票据部分或整体为质押办理流动资金贷款、开票等其他授信业务。",
			img: "",
			advantage:
				"1、用款灵活：线上自助借/还款、实时到帐、随借随还。\n2、期限灵活：期限最长12个月，充分满足企业用款需求。不跨月末的“短期贷”产品，成本更低。\n3、品种灵活：可开立银票，实现银票期限互换、纸/电票互换、承兑行互换等需求。支持办理流动资金贷款、开立保函、国内信用证等多种短期授信品种。\n4、质押灵活：实行总额管控，质押融资业务无需与质押票据一一对应。\n5、质押率高：质押率最高可达100%。\n6、回款收益高：托收回款资金可享受我行挂牌定期利率。\n7、不挑票：支持各商业银行承兑汇票入池管理。",
			target: "单一企业或者集团客户。",
			stepstitle: "业务流程",
			steps: [
				"对公单位提交《票据池业务申请书》、经办人的授权书等资料，与江苏银行签订《江苏银行票据池业务协议》后，即可申请办理票据池业务。",
			],
			steps2: [],
			material: "",
				},
		desc5: {
			title: "汇入汇款产品",
			desc:
				"汇入汇款是指汇款人通过其账户行或代理行，以我行为收款银行，将外汇款项汇至我行，由我行解付给客户的业务。",
			img: "",
			advantage:
				"电汇安全、快捷，能迅速收到款项，且费用较低。",
			target: "1.有进出口贸易、服务贸易、资本投资等真实交易背景的客户；\n2.资信良好，无不良记录，无涉嫌“洗钱”或其他违法活动。",
			stepstitle: "业务流程",
		  steps: [
				 "贸易双方签订以汇款结算的交易合同；",
				 "收到汇款指示，核对其真实性并落实头寸；",
				"通知收款人，根据外汇管理相关规定区别款项性质解付至客户账户。"
			],
			steps2: [],
			material: "",
			},
		desc6: {
			title: "汇出汇款产品",
			desc:
		  	"汇出汇款是我行接受客户（汇款人）的委托，把外汇款项通过我行的代理行，汇到汇款人指定的收款人所在银行账户的业务。",
			img: "",
			advantage:
				"GPI全球汇款服务，币种多元、渠道广泛、安全快捷，满足当日到账、费用透明以及汇款信息全程追踪等需求，为客户打造更优质的服务体验。",
			target: "1.有进出口贸易、服务贸易、资本投资等真实交易背景的客户；\n2.资信良好，无不良记录，无涉嫌“洗钱”或其他违法活动。",
			stepstitle: "业务流程",
			steps: [
				"双方签订交易合同，约定采用电汇方式结算；",
				"付款人向汇款行提交汇款材料，付款；",
				"汇款行根据汇款方申请发出汇款头寸电；",
				"收款行收到款项后解付给收款方。",
					],
			steps2: [],
			material: "",
		},
		desc7: {
			title: "出口跟单托收产品",
			desc:
		  	"我行受出口商委托，凭其提交的出口商业单据和金融票据通过国外代收行向进口商收取款项，包括付款交单（D/P）和承兑交单（D/A）的业务。",
			img: "",
			advantage:
				"1.费用低廉，帮助客户节约财务费用、控制成本；\n2.简便易行，与信用证方式相比，手续简单，易于操作；\n3.风险较小，进口商只有承兑或付款后才能提取货物，与赊销方式相比，出口商承担的风险较小。",
			target: "1.客户具备进出口经营权，有真实的出口贸易背景；\n2.资信良好，无不良记录，无涉嫌“洗钱”或其他违法活动；\n3.进出口双方相互了解，有较好的贸易可信度。",
			stepstitle: "业务流程",
			steps: [
				"出口商备货发运后，将单据提交我行办理托收；",
				"我行将托收单据寄至国外代收行进行收汇；",
				"国外代收行收到单据后提示给进口商；",
				"进口商到期通过代收行向我行付款，我行解付。",
					],
			steps2: [],
			material: "",
		},
		desc8: {
			title: "开立国际信用证产品",
			desc:
		  	"我行作为开证银行，根据进口商的要求和指示向出口商开立的有一定金额的、在一定期限内保证在收到出口商提交的符合信用证规定的单据后支付信用证项下款项的书面保证。",
			img: "",
			advantage:
				"1.银行提供信用，开证行承担第一性付款责任；\n2.借助开证行信用，帮助客户在贸易谈判中争取到有利的报价条件；\n3.客户可通过信用证条款有效约束出口商履行合同，保障交易安全；\n4.帮助客户减少资金占压，加快资金周转，从而提高资金使用效率，增加资金使用效益。",
			target: "1.客户具备进出口经营权，有真实的出口贸易背景；\n2.资信良好，无不良记录，无涉嫌“洗钱”或其他违法活动；\n3.对出口商资信不了解，或者贸易金额较大。",
			stepstitle: "业务流程",
			steps: [
				"进口商与出口商在合同中规定采用信用证支付方式；",
				"进口商向我行申请开证，并提供相关开证申请资料；",
				"我行对外开立信用证；",
				"国外通知行收到信用证后，向出口商转交信用证；",
				"出口商根据信用证条款发货并提交相关单据给国外交单行/议付行；",
				"交单行/议付行审核单据无误后，将单据寄开证行索汇或向出口商议付货款并将单据寄开证行索汇；",
				"开证行收到单据，在5个工作日内办理对外付款/承兑或拒付手续；",
				"进口商向开证行承兑/付款赎单。",
					],
			steps2: [],
			material: "",
		},
		desc9: {
			title: "出口商票融资产品",
			desc:
		  	"出口商票融资指出口商在O/A或D/A结算方式下向进口商赊销货物或服务，出口商按合同规定出运货物或提供服务后，将商业发票项下应收账款债权转让我行而获得的短期贸易融资。",
			img: "",
			advantage:
				"提前得到货款偿付，规避汇率风险，加快资金周转。",
			target: "1.客户具备进出口经营权，客户资信良好，无不良记录；\n2.基础交易背景真实，不涉及“洗钱”或其他不法活动，交易对手或对方银行不受国际组织制裁，符合我行业务合规审查要求；\n3.已有叙做出口商票融资所需的相关授信额度或保证金；\n4.出口商流动资金有限，发货后至收款前有资金周转开展业务的需求。",
			stepstitle: "业务流程",
			steps: [
				"客户提交《出口商票融资申请书》，出口合同、带有债权转让条款的正本商业发票等单据；",
				"我行与客户签订《出口商票融资合同》，并将出口商票融资款项打入客户账户；",
				"客户将单据寄送进口商，并告知我行收汇路径；",
				"我行收到国外进口商的货款后，直接扣收客户在我行的融资款项。",
					],
			steps2: [],
			material: "",
		},
		desc10: {
			title: "出口信保融资产品",
			desc:
		  	"出口信保融资指我行对已向中国出口信用保险公司投保出口信用保险的出口贸易，凭出口商提供的商业单据、投保凭证、赔款转让协议等，向出口商提供的资金融通业务。",
			img: "",
			advantage:
				"优化企业财务报表；提高企业信用等级，扩大融资规模；规避汇率风险，减少资金占压。",
			target: "1.对进口商资信不了解，或者进口商所在国家/地区风险等级较高；\n2.在中信保投保了出口信用险，保单已生效并保证履行保单项下的义务；\n3.有出口贸易融资需求。",
			stepstitle: "办理流程",
			steps: [
				"我行需与客户以及中信保签订《赔款转让协议》，将保险赔款权益转让给我行；",
				"客户提供《出口信用保险项下押汇申请书》、《信用限额审批单》、保险单合同以及保险单明细表、出口贸易项下的全套单据；",
				"我行与客户签订《出口信用保险项下押汇合同》，凭中信保核准并出具的《短期出口信用保险承保情况通知书》办理押汇手续；",
				"我行收到国外进口商的货款后，直接扣收客户在我行的融资款项。",
					],
			steps2: [],
			material: "",
		},
		desc11: {
			title: "进口押汇产品",
			desc:
		  	"进口押汇是指我行收到信用证、进口代收项下单据或汇款项下客户提供的相关单据后，应申请人的要求先行对外支付，从而向进口商提供的短期资金融通。",
			img: "",
			advantage:
				"减少资金占压，节约财务费用，帮助企业抢占市场先机。",
			target: "1.具备进出口经营权，客户资信良好，无不良记录；\n2.基础交易背景真实，不涉及“洗钱”或其他不法活动，交易对手或对方银行不受国际组织制裁，符合我行业务合规审查要求；\n3.有叙做进口押汇所需的相关授信额度或保证金；\n4.进口商流动资金有限。",
			stepstitle: "业务流程",
			steps: [
				"客户提出融资意愿，向我行询价；",
				"我行根据市场利率情况及客户情况等确定客户报价；",
				"客户接受报价，并向我行提交融资申请及相关材料；",
				"我行落实付款担保，审核融资材料；",
				"我行在付款当日发放融资并直接对外支付信用证、代收、汇款项下款项；",
				"融资到期时，进口商向我行归还融资款项及利息。",
					],
			steps2: [],
			material: "",
		},
		desc12: {
			title: "即期结售汇产品",
			desc:
		  	"即期结售汇业务是指我行为客户提供的人民币与可流通外币之间的即时买卖业务。",
			img: "",
			advantage:
				"办理便捷，多渠道线上线下即时成交，同时支持“挂单结售汇”交易，满足客户对于预期价格的需求，有效节约时间成本。",
			target: "1.有本外币买卖业务的客户，多数为经营进出口贸易的客户；\n2.资信良好，无不良记录，无涉嫌“洗钱”或其他违法活动。",
			stepstitle: "业务流程",
			steps: [
				"客户向我行提供结售汇业务所需的相应单据和有效凭证即可。",
					],
			steps2: [],
			material: "",
		},
		desc13: {
			title: "远期结售汇产品",
			desc:
		  	"远期结售汇业务是指客户与银行签订代客外汇衍生品业务总协议，约定未来结汇或售汇的外汇币种、金额、期限与汇率，到期时按照该协议约定的币种、金额、汇率办理的结售汇业务。",
			img: "",
			advantage:
				"规避汇率波动风险，提前锁定远期外汇价格，支持网银线上办理，并可通过银行融资类组合产品进一步丰富运用场景，达到资产保值增值。",
			target: "1.有进出口贸易、服务贸易、资本投资等真实结售汇交易背景的客户；\n2.资信良好，无不良记录，无涉嫌“洗钱”或其他违法活动。",
			stepstitle: "业务流程",
			steps: [
				"客户在我行开立相关账户；",
				"我行与客户签订《代客外汇衍生品业务总协议》，并做好客户适合度评估工作；",
				"客户填写《远期结售汇申请书》，提交有效凭证及/或商业单据；",
				"交易成交后，我行为客户办理资金清算工作；",
				"到期日我行与客户办理交割。",
					],
			steps2: [],
			material: "",
		},
		desc14: {
			title: "即期外汇买卖产品",
			desc:
		  	"即期外汇买卖业务是指我行为客户提供的可流通外币与外币之间的即时买卖业务。",
			img: "",
			advantage:
				"币种多元，办理便捷，满足客户贸易、资金使用需求，为有真实交易需求背景的客户提供多种外汇之间的灵活兑换。",
			target: "1.有两种以上外币买卖业务的客户，多数为有多种货币结算的进出口企业；\n2.资信良好，无不良记录，无涉嫌“洗钱”或其他违法活动。",
			stepstitle: "业务流程",
			steps: [
				"客户向我行提供外汇买卖业务所需的相应单据和有效凭证即可。",
					],
			steps2: [],
			material: "",
		},
		desc15: {
			title: "远期外汇买卖产品",
			desc:
		  	"远期外汇买卖业务是指客户与银行签订代客外汇衍生品业务总协议，约定未来买卖的外汇币种、金额、期限与汇率，到期时按该协议订明的币种、金额、汇率办理的外汇买卖业务。",
			img: "",
			advantage:
				"规避汇率波动风险，提前锁定远期外汇价格，可为客户提供多种外汇货币对自由组合，并可通过银行融资类组合产品进一步丰富运用场景。",
			target: "1.有两种以上外币买卖业务的客户，多数为有多种货币结算的进出口企业；\n2.资信良好，无不良记录，无涉嫌“洗钱”或其他违法活动。",
			stepstitle: "业务流程",
			steps: [
				"客户应在我行开立相关账户；",
				"我行与客户签订《远期外汇买卖汇协议》，并做好客户适合度评估工作；",
				"客户申请办理远期外汇买卖业务时，发起部门逐笔审核客户提交有效凭证及/或商业单据；",
				"交易成交后，由清算部门为客户办理资金清算工作；",
				"到期日我行前台业务发起部门与客户办理交割。",
					],
			steps2: [],
			material: "",
		},
			cndUrl:app.globalData.CDNURL,
  },
  developing_(){
    wx.navigateTo({
      url: '/sub7/pages/quotaquery/index',
    })
  },
  developing(){
      wx.showToast({
            title: '敬请期待',
            icon: 'none',
            image: '',
        });
    },
	spread() {
		var that = this;
		this.setData({
			preview: !this.data.preview,
        });
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		//console.log("code", options.code);
		//BO005 代理付款
		//BO003 现金管理
		//BM010 e融单
		//BO002 票据池
		//SK002 汇出汇款
		//ZZ001 出口商票融资
		//SK001 汇入汇款
		//YH002 远期结售汇
		this.setData({
      preffixUrl: app.globalData.URL,
      casecode:options.code
		});

		let productCode = options.code;
		switch (productCode) {
			case "BO003":
				this.setData({
					desc: this.data.desc3,
				});
				break;
			case "BO005":
				this.setData({
					desc: this.data.desc2,
				});
				break;
			case "BM010":
				this.setData({
					desc: this.data.desc1,
				});
				break;
			case "BO002":
				this.setData({
					desc: this.data.desc4,
				});
				break;
	  	case "DS001":
				this.setData({
					desc: this.data.desc5,
				});
				break;
			case "DS002"://从这往下，需要更改
				this.setData({
					desc: this.data.desc6,
				});
				break;
			case "DS003":
				this.setData({
					desc: this.data.desc7,
				});
				break;
			case "DS004":
				this.setData({
					desc: this.data.desc8,
				});
				break;
			case "DZ001":
				this.setData({
					desc: this.data.desc9,
				});
				break;
			case "DZ002":
				this.setData({
					desc: this.data.desc10,
				});
				break;
			case "DZ003":
				this.setData({
					desc: this.data.desc11,
				});
				break;
			case "DY001":
				this.setData({
					desc: this.data.desc12,
				});
				break;	
			case "DY002":
				this.setData({
					desc: this.data.desc13,
				});
				break;
			case "DY003":
				this.setData({
					desc: this.data.desc14,
				});
				break;
			case "DY004":
				this.setData({
					desc: this.data.desc15,
				});
				break;
			default:
				break;
		}
	},
	onShareAppMessage: function () {},
});
