var products = [
  // 存款
  {
    id: 'AN001',
    name: '电e盈',
    type: '存款理财',
    skipType: '1', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    desc1: [
      '电e盈”是江苏电力、国网电商联合江苏银行为广大用电企业提供的一款“只能收益+理财收益”的智能化交费方案，线上操作、方便快捷。',
    ],
    desc2: [
      '轻松办理：企业注册、签约、交费均在线操作，10分钟完成办理。',
      '安心理财：本金保障、收益稳健、预期年化收益2.0%，随时支取交电费。',
      '智能交费：根据电力部门指令自动缴费，省时省心。',
    ],
  },
  {
    id: 'BN001',
    name: '单位定期存款',
    type: '存款理财',
    skipType: '1', // 1-介绍页面  //2-小程序内页面  //3-h5
    desc1: [
      '单位定期存款是存款人将合法拥有的在一段时间内闲置的资金，按约定的存期和中国人民银行公布的定期存款利率存入银行，存款到期后支付本息。',
    ],
    desc2: [
      '尚未开立结算账户的客户，须填写开户申请书并提供相应的开户资料，预留印鉴。已开立结算账户的客户，只须预留印鉴，不再提供开户资料。',
    ],
  },
  {
    id: 'BN002',
    name: '单位活期存款',
    type: '存款理财',
    skipType: '1', // 1-介绍页面  //2-小程序内页面  //3-h5
    desc1: [
      '单位活期存款是存款人将合法拥有的暂时闲置的资金存入银行，不约定存款期限，依照中国人民银行公布的活期存款利率按季计取利息，存款人可以随时办理存取款。',
    ],
    desc2: [
      '开户申请书；按照中国人民银行有关规定，开立相应账户所需的证明文件；单位预留印鉴；法定代表人或单位负责人的身份证件；授权他人办理的，还应出具法定代表人或单位负责人的授权书，以及被授权人的身份证件。',
    ],
  },
  {
    id: 'BN003',
    name: '单位通知存款',
    type: '存款理财',
    skipType: '1', // 1-介绍页面  //2-小程序内页面  //3-h5
    desc1: [
      '单位通知存款是指存款人在存入款项时不约定存期，支取时须提前通知银行，约定支取存款日期和金额方能支取款项的存款。',
    ],
    desc2: ['相关开户资料等。'],
  },
  {
    id: 'BN004',
    name: '单位协定存款',
    skipType: '1', // 1-介绍页面  //2-小程序内页面  //3-h5
    type: '存款理财',
    desc1: [
      '单位协定存款是指可以开立结算账户的法人及其他组织与本行以协议方式，约定结算账户的基本留存额度，对结算账户中超过该额度的部分按中国人民银行规定的协定存款利率进行单独计息的一种存款方式。',
    ],
    desc2: [
      '开户申请书；按照中国人民银行有关规定，开立相应账户所需的证明文件；单位预留印鉴；法定代表人或单位负责人的身份证件；授权他人办理的，还应出具法定代表人或单位负责人的授权书，以及被授权人的身份证件。',
    ],
  },
  {
    id: '',
    name: '单位协议存款',
    skipType: '1', // 1-介绍页面  //2-小程序内页面  //3-h5
    type: '存款理财',
    desc1: [
      '协议存款是中国人民银行准许商业银行法人对保险公司、邮政储汇局和其它社会保险机构法人办理的一种可由双方协商确定利率水平的存款品种。该存款根据存款机构具有不同的最低存款和存款期限，其他存款要素可通过双方协商确定。',
    ],
    desc2: [
      '1、开户时，填写江苏银行开户申请书一式两份，提交人民银行颁发的金融许可证、开户许可证、工商局颁发的营业执照和盖有开户单位印章、法人代表章或授权代理人印章的印鉴卡片；',
      '2、销户时，向江苏银行会计柜台或清算中心提出销户申请，填制销户申请书一式两份，办理销户手续，并与开户行核对帐务，将尚未使用的空白支票及重要凭证缴还开户行。',
    ],
  },

  // 结算
  {
    id: 'BO001',
    name: '单位人民币结算卡',
    skipType: '1', // 1-介绍页面  //2-小程序内页面  //3-h5
    type: '资金结算',
    desc1: [
      '单位人民币结算卡，指由本行面向单位客户发行的，以卡片为介质，凭密码为客户办理相关联账户支付结算的工具，具有转账汇兑、现金存取、信息查询等功能',
    ],
    desc2: [
      '1.《江苏银行单位人民币结算卡使用协议》、《江苏银行单位人民币结算卡业务授权委托书》、《江苏银行单位人民币结算卡业务申请表》；',
      '2. 法定代表人或单位负责人、持卡人身份证件原件及复印件；',
      '3. 发卡机构认为有必要出具的其他证明文件。',
    ],
  },
  {
    id: 'BO002',
    type: '资金结算',
    skipType: '2', // 1-介绍页面  //2-小程序内页面  //3-h5
    name: '票据池',
    desc1: [
      '“票据池”是票据池是江苏银行根据客户的要求，提供票据代保管、票据信息查询、查询查复、贴现、委托收款、以及以代保管票据部分或整体为质押办理流动资金贷款、开票等其他授信业务。',
    ],
    desc2: [
      '客户申请办理票据池业务需提供以下资料：',
      '1.《江苏银行票据池业务申请表》；',
      '2.《江苏银行票据池业务专员授权通知书》与有权经办人身份证；',
    ],
    page: '/sub1/pages/shop/introduce?code=BO002',
  },
  {
    id: 'BP001',
    type: '综合服务',
    skipType: '1', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    name: '企业网银',
    desc1: [
      '企业网上银行是由在江苏银行开立结算账户的客户申请，并经开户行审核同意，双方签订有关协议后，客户通过互联网将企业网银客户端系统与江苏银行的主机相连接，完成客户在银行指定账户的查询、款项收付等业务。',
    ],
    desc2: [
      '(1）需签署的资料：《江苏银行单位对公账户申请表》、《江苏银行股份有限公司电子银行企业客户服务协议》、《江苏银行网上银行业务授权委托书》；',
      '(2）客户需提供的资料：企业营业执照、组织机构代码证、税务登记证、开户许可证、信用代码证原件、客户公章、预留银行印签；企业法人代表身份证件原件，授权人和被授权人身份证件（复印件）。',
    ],
  },
  {
    id: 'BP002',
    type: '综合服务',
    skipType: '2', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    name: '企业手机银行',
    desc1: [
      '江苏银行企业手机银行是通过无线网络和移动电话向客户提供的自助式银行服务，主要包含资产报表、负债报表、收支报表、办公报表、对外付款、账户管理、开户预约、跨境汇款、银企对账、考勤打卡、出差申请、请假申请、费用报销、办公审批等对公移动金融和OA办公服务。',
    ],
    desc2: [
      '客户办理企业手机银行签约，必须提供以下资料：',
      '(1）授权经办人的有效身份证件原件；',
      '(2）填写《单位银行结算账户综合服务申请表》，并加盖企业公章及银行预留印鉴，非法定代表人办理需填写申请表中授权委托信息；',
      '(3）签订《江苏银行股份有限公司电子银行企业客户服务协议》。',
      '(4）申请增加或维护的企业手机银行操作员、人事管理员有效身份证件原件。',
    ],
    page: '/sub1/pages/register/index',
  },
  {
    id: 'BP003', // 创新券 BP003
    type: '创新券',
    skipType: '2', // 1-介绍页面 //2-小程序内页面 //3-h5 //0 尽情期待
    name: '创新券',
    page: '/sub3/pages/innovate/home',
    },
  {
    id: 'BO003',
    type: '资金结算',
    skipType: '2', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    name: '现金管理',
    desc1: [
      '现金管理业务是指本行各级机构依托现金管理平台，以集团客户、系统性客户、关联客户等为对象、以协助客户提高资金流动性、增加资金收益、降低财务成本为核心目的，以本行结算账户为基础，以多种产品组合为内容，将账户管理、收付款管理、投融资理财、风险管理、信息服务等进行有机组合，为客户提供的资金管理综合化、方案式服务。',
    ],
    desc2: ['在我行已开户客户仅需相关材料盖章即可。'],
    page: '/sub1/pages/shop/introduce?code=BO003',
  },

  {
    id: 'BO004',
    name: '银行承兑汇票',
    skipType: '0', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    type: '资金结算',
    desc1: [
      '银行承兑汇票业务是指江苏银行作为付款人，根据出票人的申请，承诺在汇票到期日对收款人或持票人无条件支付汇票金额的票据行为。',
    ],
    desc2: [
      '1.江苏银行授信业务要求的基础信贷资料；',
      '2.江苏银行授信业务要求的基础信贷资料；',
      '3.我行规定签发承兑汇票的最低保证金存款证明材料。',
    ],
  },
  {
    id: 'CO001',
    type: '资金结算',
    skipType: '2', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    name: '对公预约开户',
    page: '/pages/kaihu1/kaihu1',
  },
  {
    id: 'CO002', // 综合签约 CO002 暂不上线 后端数据库需返回数据
    type: '资金结算',
    skipType: '3',
    name: '综合签约',
    //h5: 'https://wxapptest.jsbchina.cn:9629/account/A08List?id=${id}', // 测试
    h5: 'https://openservice.jsbchina.cn/account/A08List?id=${id}', // 生产
    type: '',
    page: '',
  },
  {
    id: 'CO003',
    type: '资金结算',
    skipType: '2', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    name: '微信预约账户信息变更',
    desc1: [
      '预约变更,自动填单',
    ],
        page: '/sub4/pages/reservedAccChg/index',
  },
  {
    id: 'DO001',
    type: '资金结算',
    skipType: '2', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    name: '跨境e点通',
    page: '/sub2/pages/cloud/businessCloud',
  },
  {
    id: 'EO001',
    type: '资金结算',
    skipType: '3', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    name: 'e融支付',
    method: '123',
  },
  {
    id: 'FP001',
    type: '综合服务',
    skipType: '1', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    name: '手机银行',
    desc1: [
      '江苏银行手机银行是江苏银行顺应移动市场发展变化，为客户量身定制的移动金融随身银行。秉承以用户体验为核心的理念，我行手机银行提供了丰富的移动金融服务，打造多元化的移动增值服务，为客户提供全面贴心的服务。',
      '江苏银行手机银行分为大众版和专业版，适用于安卓系统和IOS系统。目前，手机银行包含金融服务和金融助手两大版块。',
      '金融服务：涵盖账户管理、转账汇款、投资理财、生活缴费、手机取现等功能，满足客户全面的日常金融需求。',
      '金融助手：金融资讯、网点及优惠商户查询、手机充值、电影票、飞机票、手机证券等移动增值服务应有尽有。',
    ],
    desc2: [
      '大众版手机银行',
      ' 用户直接下载我行手机银行客户端，自行注册后便可开通大众版手机银行。为保证用户的资金安全，大众版手机银行仅为客户提供账户查询、网点查询等查询类服务。',
      ' 专业版手机银行',
      '1.手机银行签约',
      ' (1)   携带本人有效身份证件、账户原件到营业网点，填表申请开通专业版手机银行。用户登录专业版手机银行后，便可享受更全面的功能体验，畅享移动银行服务。',
      '(2)   登录专业版网上银行，在“客户服务”->“签约中心”->“手机银行”中，用户可进行手机银行签约，包括大众版升级专业版、开通专业版、注销手机银行等操作。',
    ],
  },

  //国际结算
  {
    id: 'DS001',
    type: '国际结算',
    skipType: '2', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    name: '汇入汇款',
    page: '/sub1/pages/shop/introduce?code=DS001',//是否需要更改
  },
  {
    id: 'DS002',
    name: '汇出汇款',
    skipType: '2', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    type: '国际结算',
    page: '/sub1/pages/shop/introduce?code=DS002',
  },
  {
    id: 'DS003',
    name: '出口跟单托收',
    skipType: '2', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    type: '国际结算',
    page: '/sub1/pages/shop/introduce?code=DS003',
  },
  {
    id: 'DS004',
    name: '开立国际信用证',
    skipType: '2', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    type: '国际结算',
    page: '/sub1/pages/shop/introduce?code=DS004',
  },
  //贸易融资
  {
    id: 'DS005',
    name: '自贸区账户开户',
    skipType: '2', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    type: '国际结算',
    page: '/sub3/pages/ftAccountOpen/home',
  },
  //贸易融资
  // {
  //   id: 'DS006',
  //   name: '出口贸e融 ',
  //   skipType: '2', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
  //   type: '国际结算',
  //   page: '/sub5/pages/index',
  // },
  //贸易融资
  {
    id: 'DZ001',
    name: '出口商票融资',
    skipType: '2', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    type: '贸易融资',
    page: '/sub1/pages/shop/introduce?code=DZ001',
  },
  {
    id: 'DZ002',
    name: '出口信保融资',
    skipType: '2', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    type: '贸易融资',
    page: '/sub1/pages/shop/introduce?code=DZ002',
  },
  {
    id: 'DZ003',
    name: '进口押汇',
    skipType: '2', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    type: '贸易融资',
    page: '/sub1/pages/shop/introduce?code=DZ003',
  },
  {
    id: 'DZ006',
    name: '出口贸e融 ',
    skipType: '2', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    type: '贸易融资',
    page: '/sub5/pages/index?code=DZ006',
  },
  //资金交易
  {
    id: 'DY001',
    name: '即期结售汇',
    skipType: '2', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    type: '资金交易',
    page: '/sub1/pages/shop/introduce?code=DY001',
  },
  {
    id: 'DY002',
    name: '远期结售汇',
    skipType: '2', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    type: '资金交易',
    page: '/sub1/pages/shop/introduce?code=DY002',
  },
  {
    id: 'DY003',
    name: '即期外汇买卖',
    skipType: '2', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    type: '资金交易',
    page: '/sub1/pages/shop/introduce?code=DY003',
  },
  {
    id: 'DY004',
    name: '远期外汇买卖',
    skipType: '2', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    type: '资金交易',
    page: '/sub1/pages/shop/introduce?code=DY004',
  },
  // 贷款
  {
    id: 'AM001',
    name: '随e贷（经营贷）',
    skipType: '2', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    type: '',
    page: '/sub1/pages/sui/index',
  },
  {
    id: 'AM002',
    name: '税e融',
    type: '',
    skipType: '0', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    page: '/pages/shui/index',
  },
  {
    id: 'FM002',
    name: '个人汽车消费贷',
    skipType: '2', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    type: '',
    page: '/pages/carLoans/index',
  },
  {
    id: 'AM003',
    name: '电e融',
    skipType: '2', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    type: '',
    page: '/pages/dian/dian',
  },
  {
    id: 'AM004',
    name: '人才e贷',
    skipType: '0', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    type: '',
    page: '/pages/personnel/index',
  },
  {
    id: 'AM005',
    name: '快e贷',
    skipType: '0', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    type: '',
    page: '/pages/ked/index',
  },
  {
    id: 'AM006',
    name: '惠捷贷',
    skipType: '2', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    type: '',
    page: '/pages/nong/index',
  },
  {
    id: 'AM007',
    name: '人才贷',
    skipType: '2', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    type: '',
    page: '/pages/rencai/index',
  },
  {
    id: 'AM008',
    name: '高企贷',
    skipType: '2', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    type: '',
    page: '/sub3/pages/hightech/index',
  },
  {
    id: 'AM009',
    name: '快易贷',
    skipType: '0', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    type: '',
    page: '/pages/kyd/index',
  },
  {
    id: 'AM010',
    name: '申请线上化',
    skipType: '0', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    type: '',
    page: '/sub3/pages/common/index',
  },
  {
    id: 'AM011',
    name: '杭州微e融',
    skipType: '2', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    type: '',
    page: '/sub3/pages/hwd/index',
  },
  {
    id: 'AM028',
    name: '微e融2.0',
    skipType: '2', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    type: '',
    page: '/sub1/pages/sui2/index',
  },
  {
    id: 'AM012',
    name: '淮安阳光扶贫贷',
    skipType: '2', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    type: '',
    page: '/pages/sunshine/index',
  },
  {
    id: 'AM013',
    name: '南京科创贷',
    skipType: '2', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    type: '',
    page: '/pages/fhts/nj',
  },
  {
    id: 'AM014',
    name: '无锡锡科贷',
    type: '',
    skipType: '2', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待

    page: '/pages/fhts/wx',
  },
  {
    id: 'AM015',
    name: '南通通科贷',
    skipType: '2', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    type: '',
    page: '/pages/fhts/nt',
  },
  {
    id: 'AM016',
    name: '常州退税贷',
    skipType: '2', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    type: '',
    page: '/pages/fhts/cz',
  },
  {
    id: 'AM017',
    name: '镇江镇财贷',
    skipType: '2', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    type: '',
    page: '/pages/fhts/zj',
  },
  {
    id: 'AM018',
    name: '宿迁科补贷',
    skipType: '2', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    type: '',
    page: '/pages/fhts/sq',
  },
  {
    id: 'AM019',
    name: '泰州泰信保',
    skipType: '2', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    type: '',
    page: '/pages/fhts/tz',
  },

  {
    id: 'AM031',
    name: '创新积分贷',
    skipType: '2', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    type: '',
    page: '/sub3/pages/bbx/innovate/index',
  },

  {
    id: 'AM020',
    name: '苏农贷',
    skipType: '2', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    type: '',
    page: '/sub1/pages/xnd/index',
  },
  {
    id: 'AM022',
    name: '徐数贷',
    skipType: '2', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    type: '',
    page: '/sub1/pages/xsd/index',
  },
  {
    id: 'AM023',
    name: '北京创e贷',
    skipType: '2', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    type: '',
    page: '/sub1/pages/sui/index?productCode=A',
  },
  {
    id: 'AM029',
    name: '苏银村镇随e贷',
    skipType: '2', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    type: '',
    page: '/sub1/pages/sui/indexCz?channel2=cz',
  },
  {
    id: 'AM030',
    name: '享借',
    skipType: '3', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    type: '',
    h5: 'https://app.jsbchina.cn/file/upload/app/imagesLinks/20220607192624472.html', //
  },
  {
    id: 'HP001',
    name: '线上征信',
    skipType: '2', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    type: '',
    page: '/sub2/pages/creditInfo/index',
  },

  {
    id: 'AM024',
    name: '宿易贷',
    skipType: '2', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    type: '',
    page: '/pages/fhts/sq2',
  },
  {
    id: 'BM001',
    name: '固定资产贷款',
    type: '贷款产品',
    skipType: '1', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    desc1: [
      '固定资产贷款，是指贷款人向企（事）业法人或国家规定可以作为借款人的其他组织发放的，用于借款人固定资产投资的本外币贷款。 ',
    ],
    desc2: [
      '1.江苏银行授信业务要求的基础信贷资料；',
      '2.国家对拟投资项目有投资主体资格和经营资质要求的，符合其要求；',
      '3.项目和产品符合国家产业、土地、环保、资源、城市规划政策以及其他相关政策和江苏银行信贷政策；',
      '4.资本金来源明确且符合国家和江苏银行有关规定比例；',
      '5.项目资料',
      '（1）实行审批制的项目需提供：',
      '①项目建议书或可行性研究报告；',
      '②项目建议书或可行性研究报告批复文件；',
      '③城市规划、国土资源管理、环境保护部门分别出具的关于城市规划、项目用地、环境影响评价文件的明确意见和有关法律法规规定应提交的其他文件；',
      '④企业自筹和其他建设资金筹措方案（原件或复印件）及其资金来源已落实的证明材料；',
    ],
  },
  {
    id: 'BM002',
    type: '贷款产品',
    skipType: '1', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    name: '流动资金贷款',
    desc1: [
      '流动资金贷款指江苏银行向企（事）业法人或国家规定可以作为借款人的其他组织发放的用于借款人日常生产经营周转的本外币贷款。',
    ],
    desc2: [
      '１.法人营业执照或营业执照(副本及影印件)；',
      '２.组织机构代码证书(副本及影印件)；',
      '３.法定代表人或负责人身份证明；',
      '４.贷款卡（证）(原件及影印件)；',
      '５.财政部门核准或会计(审计)事务所审计的近三个年度财务报告和审计报告及最近的报表，成立不足三年的企业，提交自成立以来的年度和近期报表，对于小企业，可视具体情况适度放宽财务报告（表）的审计要求；',
      '６.税务部门年检合格的税务登记证明；',
      '７.公司章程或企业组织文件（原件及影印件）；',
      '８.企业董事会成员和主要负责人、财务负责人名单和签字样本等；',
      '９.信贷业务由授权委托人办理的，需提供企业法定代表人授权委托书（原件）；',
      '10.借款人为有限责任公司、股份有限公司、合资合作企业或承包经营企业，要求提供依照公司章程或组织文件规定的权限，由有权机构（人）出具的同意申请信贷业务的决议、文件或具有同等法律效力的文件或证明；',
      '11.担保人相关资料；',
      '12.申请一般流动资金贷款的，借款人需提供贸易合同、协议、定单、意向书等业务材料；',
      '13.江苏银行要求提供的其他材料。',
      ,
    ],
  },
  {
    id: 'BM003',
    skipType: '1', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    type: '贷款产品',
    name: '经营性物业抵押贷款',
    desc1: [
      '经营性物业抵押贷款是指我行向法人发放的，以其拥有的经营性物业作为贷款抵押物，并以该物业的租金收入为主、以借款人的其他经营收入为辅进行还本付息的贷款。',
      '经营性物业是指已竣工验收并正式投入商业性（泛指经营性，下同）营运，经营管理比较规范、经营利润较为稳定、现金流较为充裕、综合收益较好的商业营业用房、办公用房、工业用标准厂房及综合用房等不动产，包括商场、店铺、商品交易市场、写字楼、星级宾馆酒店、综合商业设施及位于工业园区且整体对外出租的厂房等物业形式。',
    ],
    desc2: [
      '1.江苏银行授信业务要求的基础信贷资料；',
      '2.经营性物业竣工验收合格的证明材料，合法有效的权属证明文件；',
      '3.经营性物业对外出租的有关协议、合同。',
    ],
  },

  {
    id: 'BM004',
    name: '对公客户委托贷款',
    skipType: '1', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    type: '贷款贷款',
    desc1: [
      '指由委托人提供资金，我行作为受托人（即贷款人）根据委托人确定的贷款对象（即借款人）、用途、金额、期限、利率等代为发放、监督使用并协助收回的贷款。',
    ],
    desc2: [
      '填写完整的《对公客户委托贷款申请书》，并按照《对公客户委托贷款申报材料清单》的要求提供客户基础资料、上年度及最近一期财务报表、董事会决议或具有同等法律效力的授权书等申报材料。',
    ],
  },
  {
    id: 'BM005',
    skipType: '1', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    type: '贷款产品',
    name: '应收账款质押授信业务',
    desc1: [
      '应收账款质押授信业务是指贷款申请人在正常生产经营过程中，以其具有真实交易背景且无争议的、江苏银行认可的应收账款作质押担保，向江苏银行申请授信的业务。目前，江苏银行办理交易类应收账款质押授信业务、公路收费权质押授信业务、其他收费权质押授信业务等三类。',
    ],
    desc2: [
      '交易类应收账款质押授信业务',
      '1.江苏银行授信业务要求的基础信贷资料；',
      '2.交易双方以往的交易合同、销售回款凭证等资料；',
      '3.表明应收账款贸易背景的经济合同、相关发票、发货证明等。',
      '公路收费权质押授信业务',
      '1.有权审批部门关于该项目建设的相关批复；',
      '2.省级政府关于同意该项目收费的批文；',
      '3.申请人所属交通主管部门或相关权益人同意以该公路收费权出质的相关文件。',
      '其他收费权质押授信业务',
      '1.相关行政管理部门批复的收费权的证明文件；',
      ,
    ],
  },
  {
    id: 'BM006',
    name: '保函',
    skipType: '1', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    type: '贷款产品',
    desc1: [
      '“票据池”是指依据客户的要求，为客户提供票据代保管、票据信息查询、贴现、委托收款、以及以代保管票据部分或整体为质押办理流动资金贷款、开票等其他授信业务。',
    ],
    desc2: [
      '1.营业执照、法人代码证、税务登记证、公司章程、验资报告、贷款卡号、法定代表人证明文件及个人身份证明；',
      '2.保函涉及的有关合同、协议、标书及其他能够证明真实、合法交易背景的有关资料；',
      '3.保函涉及的事项按照规定须事先获得有关部门批准或核准的，须提供有关部门的批准或核准文件；',
      '4.申请人经会计（审计）师事务所审计的前三年度财务报表和当期财务报表（能够提供100%保证金及本行存单质押的应至少提交当期财务报表）；',
      '5.需提供反担保的，反担保人应参照对保函申请人的规定提供有关资料；',
      '6.按规定需要被担保客户提交的有关授权文件；',
      '7.我行要求的其他资料。',
    ],
  },
  {
    id: 'BM007',
    skipType: '1', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    type: '贷款产品',
    name: '国内信用证',
    desc1: [
      '国内信用证是适用于国内贸易的一种支付结算方式，是江苏银行依照买方的申请向卖方开出的有一定金额、在一定期限内凭信用证规定的单据支付款项的书面承诺。',
    ],
    desc2: ['1.江苏银行授信业务要求的基础信贷资料；', '2.买方与卖方业务合作的基本情况、购销合同和相关协议等。'],
  },
  {
    id: 'BM008',
    skipType: '1', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    type: '贷款产品',
    name: '国内保理业务',
    desc1: [
      '国内保理业务是江苏银行针对客户的应收账款所提供的一种综合性金融服务。在国内保理业务中，江苏银行受让客户的应收账款，并对受让的应收账款提供保理服务。服务的项目包括：应收账款管理、保理预付款和信用风险担保等。目前，江苏银行开办的国内保理业务主要包括有追索权保理业务、无追索权保理业务、信用保险保理业务及第三方担保保理业务等四种类型。',
    ],
    desc2: [
      '1.江苏银行授信业务要求的基础信贷资料；',
      '2.与特定买方签订的商务合同（如年度购销协议），近两年销售及收款明细，以及交易中所使用的各种文件、单据（如发票、货运及质检单据等）样式；',
      '3.通过国际或国内质量认证的证明材料。',
    ],
  },
  {
    id: 'IM002',
    skipType: '2', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    name: '票据贴现',
    type: '贷款产品',
    page: '/sub2/pages/billDisCount/poster',
  },
  {
    id: 'IM001',
    skipType: '2', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    name: '标准化票据',
    type: '贷款产品',
    page: '/sub2/pages/tender/index',
  },
  {
    id: '',
    type: '贷款产品',
    skipType: '0', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    name: '银行承兑汇票贴现',
    desc1: [
      '银行承兑汇票贴现是指收款人或持票人为了取得资金，将未到期的银行承兑汇票向江苏银行申请贴现，江苏银行按票面计收一定利息后将余款支付给贴现申请人的一种融资行为。',
    ],
    desc2: [
      '1.江苏银行授信业务要求的基础信贷资料；',
      '2.买方与卖方业务合作的基本情况、购销合同和相关协议等；',
      '3.具有真实贸易背景的发票或收据。',
    ],
  },

  {
    id: '',
    skipType: '1', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    name: '保兑仓',
    type: '贷款产品',
    desc1: [
      '保兑仓业务指经销商（承兑申请人/流动资金贷款申请人，简称买方）持江苏银行认可的、与供货商（简称卖方）签定的购销合同，由本行控制货权，由卖方提供货物监管并对授信敞口部分提供无条件债权回购的特定融资服务模式。授信品种可以为银行承兑汇票或者短期流动资金贷款。',
    ],
    desc2: [
      '1.客户基础资料，包括营业执照、公司章程、开户许可证、财务报表、法定代表人身份证明；',
      '2.授信业务申请书；',
      '3.买方与卖方业务合作的基本情况，买方销售情况及产品的性能价格、技术含量、供需状况、市场预测等资料；',
      '4.卖方授予买方（地区）经销权证书原件（如有）；',
      '5.申请保兑仓业务涉及的购销合同和相关协议；',
      '6.买方销售卖方同类产品的上年度及近期统计报表；',
      '7.本行要求的其他材料。',
    ],
  },
  {
    id: '',
    skipType: '1', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    name: '厂商银',
    type: '贷款产品',
    desc1: [
      '厂商银业务是指江苏银行基于经销商（买方）与其上游供货商（卖方）签订的购销合同，应借款人申请向其签发银行承兑汇票用于向供货商支付货款，供货商将借款人所购货物发至江苏银行指定仓储单位，且质押给江苏银行并由江苏银行控制货权的融资模式。',
    ],
    desc2: [
      '1.江苏银行授信业务要求的基础信贷资料；',
      '2.买方与卖方业务合作的基本情况，买方销售情况及产品的性能价格、技术含量、供需状况、市场预测等资料；',
      '3.申请厂商银业务涉及的购销合同和相关协议；',
      '4.买方向卖方购买的拟质押货物及同类型产品的上年度及近期统计报表；',
      '5.由股东会或董事会出具的同意货物质押的决议；',
      '6.货物符合国家有关标准和规范并获得了相关证明其质量、等级的证明文件或专门检验证书；',
      '7.附回购条件的厂商银业务，卖方除了需提供基础资料外，还应提供有权机构的授权书或同意承担债权回购责任的相关决议等资料。',
    ],
  },
  {
    id: '',
    skipType: '1', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    name: '商业承兑汇票贴现',
    type: '贷款产品',
    desc1: [
      '商业承兑汇票贴现业务是指收款人或持票人为了取得资金，将未到期的商业承兑汇票向江苏银行申请贴现，江苏银行按票面计收一定利息后将余款支付给贴现申请人的一种融资行为。',
    ],
    desc2: ['无'],
  },

  //综合服务
  {
    skipType: '2', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    id: 'AP001',
    name: '房产评估',
    type: '',
    page: '/pages/house/house',
  },
  {
    id: 'CP001',
    skipType: '2', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    name: '网点查询',
    type: '',
    page: '/sub2/pages/map/index',
  },
  {
    id: 'CP002',
    skipType: '2', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    name: '对公账户查询',
    type: '',
    page: '/sub1/pages/h5/index',
  },
  {
    skipType: '2', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    id: 'GP001',
    name: '创业家卡',
    type: '',
    page: '/sub1/pages/cyj/index',
  },
  {
    skipType: '2', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    id: 'GP002',
    name: '创业家卡',
    type: '',
    page: '/sub1/pages/talent/index',
  },
  //个人金融
  {
    skipType: '3', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    id: 'GR001',
    name: 'ETC',
    type: '',
    page: '',
  },
  {
    id: 'GR002',
    skipType: '2', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    name: '信用卡',
    type: '',
    page: '/sub2/pages/reditCard/reditCard',
  },
  {
    id: 'AM021',
    skipType: '2', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    name: '苏州征信贷款',
    type: '',
    page: '/sub1/pages/sz/index',
  },
  {
    id: 'ER001',
    skipType: '3', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    name: '直销银行',
    h5: 'https://mybank.jsbchina.cn/pweb/wapJsBank/index.html?page=WapProductList&TerminalType=wx&channelType=jsyhwx',
    type: '',
    page: '',
  },
  {
    id: 'FM001',
    skipType: '2', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    name: '消费随e贷款',
    type: '',
    page: '/sub1/pages/consumer/index',
  },
  {
    id: 'ER002',
    skipType: '3', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    name: '理财超市',
    h5: 'https://direct.jsbchina.cn/direct/page/index.html#page/100/14/01/P1001401.html?TerminalType=h5',
    type: '',
    page: '',
  },
  {
    id: 'BM010',
    skipType: '2', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    name: 'e融e单',
    type: '',
    page: '/sub1/pages/shop/introduce?code=BM010',
  },
  {
    id: 'BO005',
    skipType: '2', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    name: '代理付款',
    type: '',
    // page: '/sub1/pages/shop/introduce?code=BO005',
    page: '/sub7/pages/login/login',
  },
  {
    id: 'FR001',
    skipType: '2', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    name: '精选好基',
    type: '',
    page: '/sub1/pages/fund/index',
  },
  {
    id: 'CP003',
    skipType: '2', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    name: '开户资料查询',
    type: '',
    page: '/sub1/pages/account/index',
  },
  {
    id: 'FO001',
    skipType: '2', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
    name: '手机用户',
    type: '',
    page: '/sub2/pages/qyBankRegister/index',
  },
    //新增光伏贷
    {
        id: 'HM001',
        skipType: '2', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
        name: '光伏贷',
        type: '',
        page: '/sub2/pages/photovoltaicLoan/index',
    },
    //新增绿色信用试算
    {
        id: 'HM002',
        skipType: '2', // 1-介绍页面  //2-小程序内页面  //3-h5  //0 尽情期待
        name: '绿色信用试算',
        type: '',
        page: '/sub2/pages/greenCredit/index',
    },
];

export default products;
