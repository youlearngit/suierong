var urls = {
	//开放银行
	openBank: "https://open.jsbchina.cn/dist/index.html#/home?",
	//信用卡申请图片长按跳转串串盈首页
	ccy: "https://card.jsbchina.cn/page/index.html#page/101/01/P10101.html",
	//信用卡申请快速还款
	fastRepay:
		"https://prize.jsbchina.cn/beanpacket/commonOut/forward.do?terminal=h5.ccy&flag=local&functionPoint=creditPayment",
	//信用卡申请我要办卡
	fastCard: "https://card.jsbchina.cn/page/index.html?from=singlemessage#page/101/03/P10103.html",
	//信用卡申请ETC
	//   etc: 'https://csh.jsbchina.cn/carlive/etc/etcMain.do?appid=w9w9w9w9w9w9w9w9w9w9w9w9w9w9w9w9',
	etc:
		// "https://cshtestipv6.jsbchina.cn/carlive/etc/etcMain.do?appid=w9w9w9w9w9w9w9w9w9w9w9w9w9w9w9w9&quot&channelNumber=SER&param=",
		"https://csh.jsbchina.cn/carlive/etc/etcMain.do?appid=w9w9w9w9w9w9w9w9w9w9w9w9w9w9w9w9&quot&channelNumber=SER&param=",
	//首页e融支付
	ePay: "https://pay.jsbchina.cn/epcs/eMerchant/toApplication.htm",
	// ePay: 'https://epaytest.jsbchina.cn:9999/epcs/eMerchant/toApplication.htm',
	//跨境微服务 -> 跨境E点通
	zmydt: "https://vbank.jsbchina.cn/wxcm/international/internatOutput/clientConfirm.do",
	//自贸云 -> 自贸E点通
	zmyPlatformYdt: "https://vbank.jsbchina.cn/wxcm/international/internatOutput/clientConfirm.do",
	//首页 我要办卡
	handleCard: "https://card.jsbchina.cn/page/index.html?from=singlemessage#page/101/03/P10103.html",
	//首页合伙人
	partnerUrl: "https://mybank.jsbchina.cn/pweb/wapJsBank/index.html?page=WapLogin&TerminalType=wx&pageid=6",

	//自贸云 自贸e查询-> 结售汇牌价查询
	zmySearchJshpj: "https://prize.jsbchina.cn/beanpacket/InternationalOutput/queryExchangeRateInquiry.do",
	// zmySearchJshpj: 'https://weixintestb.jsbchina.cn/redpacket/InternationalOutput/queryExchangeRateInquiry.do',

	//自贸云 自贸e查询-> 汇入汇款查询
	zmySearchHrhk: "https://prize.jsbchina.cn/beanpacket/InternationalOutput/intime.do",
	// zmySearchHrhk: 'https://weixintestb.jsbchina.cn/redpacket/InternationalOutput/intime.do',

	//自贸云 自贸e查询-> 汇出汇款查询
	zmySearchHchk: "https://prize.jsbchina.cn/beanpacket/InternationalOutput/outtime.do",
	// zmySearchHchk: 'https://weixintestb.jsbchina.cn/redpacket/InternationalOutput/outtime.do',

	//自贸云 自贸e查询-> 账户信息查询
	zmySearchZhxx: "https://prize.jsbchina.cn/beanpacket/InternationalOutput/query.do",
	// zmySearchZhxx: 'https://weixintestb.jsbchina.cn/redpacket/InternationalOutput/query.do',

	//自贸云 自贸e查询-> 进出口业务查询
	zmySearchJckyw: "https://prize.jsbchina.cn/beanpacket/InternationalOutput/toImportAndExport.do",
	// zmySearchJckyw: 'https://weixintestb.jsbchina.cn/redpacket/InternationalOutput/toImportAndExport.do'

	//直销银行
	wapJsBank:
		"https://mybank.jsbchina.cn/pweb/wapJsBank/index.html?page=WapProductList&TerminalType=wx&channelType=jsyhwx",
};

export default urls;
