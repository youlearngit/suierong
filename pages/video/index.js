import api from '../../utils/api';
const util = require('../../utils/util');
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    preffixUrl: app.globalData.URL,
    cndUrl: app.globalData.CDNURL,
    videosceshi: [
      {
        // 用于区分实例绑定
        id: 1,
        // 视频地址
        src: `${getApp().globalData.CDNURL}static/wechat/img/sui/whgj_ckstcxjhk.mp4`,
        name: '外汇管家—出口商贴查询及还款',
        // 视频实例
        myVideo: '',
        // 是否隐藏视频
        videoHidden: true
      },
      {
        id: 2,
        src: `${getApp().globalData.CDNURL}static/wechat/img/sui/whgj_ckstrzsq.mp4`,
        name: '外汇管家—出口商贴融资申请',
        myVideo: '',
        videoHidden: true
      },
      {
        id: 3,
        src: `${getApp().globalData.CDNURL}static/wechat/img/sui/whgj_yqjshjg.mp4`,
        name: '外汇管家—远期结售汇交割',
        myVideo: '',
        videoHidden: true
      },
      {
        id: 4,
        src: `${getApp().globalData.CDNURL}static/wechat/img/sui/whgj_yqjshqy.mp4`,
        name: '外汇管家—远期结售汇签约',
        myVideo: '',
        videoHidden: true
      },
      {
        id: 5,
        src: `${getApp().globalData.CDNURL}static/wechat/img/sui/whgj_ysfklwbbzj.mp4`,
        name: '外汇管家—一分钟开立外币保证金',
        myVideo: '',
        videoHidden: true
      },
      {
        id: 6,
        src: `${getApp().globalData.CDNURL}static/wechat/img/sui/salary.mp4`,
        name: '薪税管家-查看电子工资条',
        myVideo: '',
        videoHidden: true
      }
    ],
    videos: [
      {
        id: 27,
        src: `${getApp().globalData.CDNURL}/static/wechat/img/sui/gyljrypt_rdkd.m4v`,
        bg: `${getApp().globalData.CDNURL}/static/wechat/img/sui/gyljrypt_rdkd.png`,
        name: '供应链金融云平台-e融单开单',
        desc: '此视频主要介绍e融单开单流程，方便客户熟悉参考。该视频主要包括：（1）e融单开单经办。（2）e融单开单复核。',
        playProcess: 0,
        process: 0,
        myVideo: '',
        videoHidden: true
      },
      {
        id: 26,
        src: `${getApp().globalData.CDNURL}/static/wechat/img/sui/gyljrypt_rdrz.m4v`,
        bg: `${getApp().globalData.CDNURL}/static/wechat/img/sui/gyljrypt_rdrz.png`,
        name: '供应链金融云平台-e融单融资',
        desc: '此视频主要介绍e融单签收融资流程，方便客户熟悉参考。该视频主要包括：（1）e融单签收。（2）e融单融资。',
        playProcess: 0,
        process: 0,
        myVideo: '',
        videoHidden: true
      },
      {
        id: 25,
        src: `${getApp().globalData.CDNURL}/static/wechat/img/sui/xsgj_gzksjycx.mp4`,
        bg: `${getApp().globalData.CDNURL}/static/wechat/img/sui/xsgj_gzksjycx.png`,
        name: '薪税管家-工资卡号收集与查询',
        desc: '薪税管家是我行推出的助力企业内部人、薪、事管理的数字化平台。该视频主要介绍工资卡号收集与查询。',
        playProcess: 0,
        process: 0,
        myVideo: '',
        videoHidden: true
      },
      {
        id: 24,
        src: `${getApp().globalData.CDNURL}/static/wechat/img/sui/whgj_gjlscx.mp4`,
        bg: `${getApp().globalData.CDNURL}/static/wechat/img/sui/whgj_gjlscx.png`,
        name: '财资管家-资金归集-归集流水查询',
        desc: '财资金管家起源于现金管理平台，是我行为机构、集团等大中型客户打造的一站式财资管理平台。该视频主要介绍资金归集流水查询功能。',
        playProcess: 0,
        process: 0,
        myVideo: '',
        videoHidden: true
      },
      {
        id: 23,
        src: `${getApp().globalData.CDNURL}/static/wechat/img/sui/whgj_gjlxcx.mp4`,
        bg: `${getApp().globalData.CDNURL}/static/wechat/img/sui/whgj_gjlxcx.png`,
        name: '财资管家-资金归集-归集利息查询',
        desc: '财资金管家起源于现金管理平台，是我行为机构、集团等大中型客户打造的一站式财资管理平台。该视频主要介绍集团账客户面向成员单位资金归集时自行设定利率，后续如何进行归集利息查询。',
        playProcess: 0,
        process: 0,
        myVideo: '',
        videoHidden: true
      },
      {
        id: 22,
        src: `${getApp().globalData.CDNURL}/static/wechat/img/sui/czgj_zjgj_sgqk.mp4`,
        bg: `${getApp().globalData.CDNURL}/static/wechat/img/sui/czgj_zjgj_sgqk.png`,
        name: '财资管家-资金归集-手工请款',
        desc: '财资金管家起源于现金管理平台，是我行为机构、集团等大中型客户打造的一站式财资管理平台。该视频主要介绍子公司成员单位向上级单位手工请款功能。',
        playProcess: 0,
        process: 0,
        myVideo: '',
        videoHidden: true
      },
      {
        id: 21,
        src: `${getApp().globalData.CDNURL}/static/wechat/img/sui/czgj_zjgj_zjshxb.mp4`,
        bg: `${getApp().globalData.CDNURL}/static/wechat/img/sui/czgj_zjgj_zjshxb.png`,
        name: '财资管家-资金归集-资金上划下拨',
        desc: '财资金管家起源于现金管理平台，是我行为机构、集团等大中型客户打造的一站式财资管理平台。该视频主要介绍资金归集上划下拨功能，包含母公司企业操作员登录操作向下级成员单位账户手工归集和划转资金，以及复核审批流程。',
        playProcess: 0,
        process: 0,
        myVideo: '',
        videoHidden: true
      },
      {
        id: 19,
        src: `${getApp().globalData.CDNURL}/static/wechat/img/sui/maoerong.mp4`,
        bg: `${getApp().globalData.CDNURL}/static/wechat/img/sui/maoerong.png`,
        name: '出口贸e融申请',
        desc: '该视频主要介绍出口型小微企业线上贸易融资业务申请流程，包括信息录入、税务授权、外管区块链平台授权、征信查询授权和业务提交等操作。',
        playProcess: 0,
        process: 0,
        myVideo: '',
        videoHidden: true
      },
      {
        id: 20,
        src: `${getApp().globalData.CDNURL}/static/wechat/img/sui/whgj_czgj_sfkgl_pldk.mp4`,
        bg: `${getApp().globalData.CDNURL}/static/wechat/img/sui/whgj_czgj_sfkgl_pldk.png`,
        name: '财资管家-收付款管理-批量代扣',
        desc: '财资金管家起源于现金管理平台，是我行为机构、集团等大中型客户打造的一站式财资管理平台。批量代扣目前支持电费、水费和燃气费的代扣。该视频主要介绍了批量代扣的录入流程。',
        playProcess: 0,
        process: 0,
        myVideo: '',
        videoHidden: true
      },
      {
        id: 17,
        src: `${getApp().globalData.CDNURL}/static/wechat/img/sui/whgj_ckstrzsq.mp4`,
        bg: `${getApp().globalData.CDNURL}/static/wechat/img/sui/whgj_ckstrzsq.png`,
        name: '外汇管家—出口商贴融资申请',
        desc: '我行外汇管家借助金融科技手段，依托自贸区平台，能够为企业提供“全方位、全线上、全流程”的跨境金融服务。该视频主要介绍跨境贸e池的出口商贴融资申请流程。',
        playProcess: 0,
        process: 0,
        myVideo: '',
        videoHidden: true
      },
      {
        id: 18,
        src: `${getApp().globalData.CDNURL}/static/wechat/img/sui/whgj_ckstcxjhk.mp4`,
        bg: `${getApp().globalData.CDNURL}/static/wechat/img/sui/whgj_ckstcxjhk.png`,
        name: '外汇管家—出口商贴查询及还款',
        desc: '我行外汇管家借助金融科技手段，依托自贸区平台，能够为企业提供“全方位、全线上、全流程”的跨境金融服务。该视频主要介绍跨境贸e池的出口商贴融资查询和还款流程。',
        playProcess: 0,
        process: 0,
        myVideo: '',
        videoHidden: true
      },
      {
        // 用于区分实例绑定
        id: 1,
        // 视频地址
        src: `${getApp().globalData.CDNURL}/static/wechat/img/sui/qywysqms.mp4`,
        bg: `${getApp().globalData.CDNURL}/static/wechat/img/sui/qywysqms.png`,
        name: '企业网银授权模式',
        desc: '授权模式定义了企业网银重要的企业授权流程，支持通用和客户自定义。视频主要介绍设置过程中可能遇到的常见问题和解决方式。',
        playProcess: 0,
        process: 0,
        // 视频实例
        myVideo: '',
        // 是否隐藏视频
        videoHidden: true
      },
      {
        id: 2,
        src: `${getApp().globalData.CDNURL}/static/wechat/img/sui/qywypzldyzt1.mp4`,
        bg: `${getApp().globalData.CDNURL}/static/wechat/img/sui/qywypzldyzt1.png`,
        name: '企业网银凭证类打印专题（一）',
        desc: '此专题主要是介绍常用凭证的具体菜单和流程，方便客户熟悉和下载。该视频主要包括的凭证下载流程（1）结构性存款购买协议、产品说明、（2）单位保证金账户开户、销户回执。',
        playProcess: 0,
        process: 0,
        myVideo: '',
        videoHidden: true
      },
      {
        id: 3,
        src: `${getApp().globalData.CDNURL}/static/wechat/img/sui/qywypzldyzt2.mp4`,
        bg: `${getApp().globalData.CDNURL}/static/wechat/img/sui/qywypzldyzt2.png`,
        name: '企业网银凭证类打印专题（二）',
        desc: '此专题主要是介绍常用凭证的具体菜单和流程，方便客户熟悉和下载。该视频主要包括的凭证下载流程（1）直通式放款合同、借据、（2）票据池银企对账历史明细。',
        playProcess: 0,
        process: 0,
        myVideo: '',
        videoHidden: true
      },
      {
        id: 4,
        src: `${getApp().globalData.CDNURL}/static/wechat/img/sui/qywydwz.mp4`,
        bg: `${getApp().globalData.CDNURL}/static/wechat/img/sui/qywydwz.png`,
        name: '企业网银对外转账',
        desc: '对外转账是企业网银最日常高频的交易之一，支持实时、预约通过人行支付系统向他行快捷转账。视频主要介绍了（1）常用付款用途维护（2）联行号查询收款行（3）对外转账主体流程三个部分，方便客户更顺利完成交易。',
        playProcess: 0,
        process: 0,
        myVideo: '',
        videoHidden: true
      },
      {
        id: 5,
        src: `${getApp().globalData.CDNURL}/static/wechat/img/sui/EDGE.mp4`,
        bg: `${getApp().globalData.CDNURL}/static/wechat/img/sui/EDGE.png`,
        name: '企业网银EDGE浏览器调整',
        desc: '企业网银EDGE浏览器调整：为适应windows系统升级和客户使用习惯，此视频介绍了EDGE浏览器以IE模式加载网页的方法。调整为IE模式后，EDGE浏览器也可以顺畅使用企业网银和我行其他网站。',
        playProcess: 0,
        process: 0,
        myVideo: '',
        videoHidden: true
      },
      {
        id: 6,
        src: `${getApp().globalData.CDNURL}/static/wechat/img/sui/qywyztsfk.mp4`,
        bg: `${getApp().globalData.CDNURL}/static/wechat/img/sui/qywyztsfk.png`,
        name: '企业网银直通式放款',
        desc: '直通式放款重点打造短期流动资金贷款全流程线上化。此视频介绍了客户经理为客户申请额度后，客户在线提交贷款申请的流程，方便客户参考。贷款信息涉及后续放款审核，建议和客户经理确认内容后填写。',
        playProcess: 0,
        process: 0,
        myVideo: '',
        videoHidden: true
      },
      {
        id: 7,
        src: `${getApp().globalData.CDNURL}/static/wechat/img/sui/czgj_sfkgl_plzz.mp4`,
        bg: `${getApp().globalData.CDNURL}/static/wechat/img/sui/czgj_sfkgl_plzz.png`,
        name: '财资管家-收付款管理-批量转账',
        desc: '财资金管家起源于现金管理平台，是我行为机构、集团等大中型客户打造的一站式财资管理平台。批量转账是企业财资中一次性可进行多笔转账的交易。该视频主要介绍了批量转账模板的下载，以及模板的填写规范及后续的批量转账流程。',
        playProcess: 0,
        process: 0,
        myVideo: '',
        videoHidden: true
      },
      {
        id: 8,
        src: `${getApp().globalData.CDNURL}/static/wechat/img/sui/czgj-sfkgl-dbzz.mp4`,
        bg: `${getApp().globalData.CDNURL}/static/wechat/img/sui/czgj-sfkgl-dbzz.png`,
        name: '财资管家-收付款管理-单笔转账',
        desc: '财资金管家起源于现金管理平台，是我行为机构、集团等大中型客户打造的一站式财资管理平台。单笔转账是企业财资最日常高频的交易之一，支持实时、预约两种模式。该视频主要介绍了单笔转账的基本操作流程。',
        playProcess: 0,
        process: 0,
        myVideo: '',
        videoHidden: true
      },
      {
        id: 9,
        src: `${getApp().globalData.CDNURL}/static/wechat/img/sui/czgj-sfkgl-pldf.mp4`,
        bg: `${getApp().globalData.CDNURL}/static/wechat/img/sui/czgj-sfkgl-pldf.png`,
        name: '财资管家-收付款管理-批量代发',
        desc: '财资金管家起源于现金管理平台，是我行为机构、集团等大中型客户打造的一站式财资管理平台。批量代发是企业财资中可以用于代发工资和费用报销的交易。该视频主要介绍了批量代发模板的下载，以及模板的填写规范及后续的批量代发流程。',
        playProcess: 0,
        process: 0,
        myVideo: '',
        videoHidden: true
      },
      {
        id: 10,
        src: `${getApp().globalData.CDNURL}/static/wechat/img/sui/shortVideo.mp4`,
        bg: `${getApp().globalData.CDNURL}/static/wechat/img/sui/shortVideo.png`,
        name: '薪税管家-查看电子工资条',
        desc: '薪税管家是我行推出的助力企业内部人、薪、事管理的数字化平台。该视频主要介绍员工如何在移动端查看电子工资单。',
        playProcess: 0,
        process: 0,
        myVideo: '',
        videoHidden: true
      },
      {
        id: 11,
        src: `${getApp().globalData.CDNURL}/static/wechat/img/sui/whgj_yqjshqy.mp4`,
        bg: `${getApp().globalData.CDNURL}/static/wechat/img/sui/whgj_yqjshqy.png`,
        name: '外汇管家—远期结售汇签约',
        desc: '我行外汇管家借助金融科技手段，依托自贸区平台，能够为企业提供“全方位、全线上、全流程”的跨境金融服务。该视频主要介绍远期结售汇线上签约流程，该流程支持授信和保证金两种模式。',
        playProcess: 0,
        process: 0,
        myVideo: '',
        videoHidden: true
      },
      {
        id: 12,
        src: `${getApp().globalData.CDNURL}/static/wechat/img/sui/whgj_yqjshjg.mp4`,
        bg: `${getApp().globalData.CDNURL}/static/wechat/img/sui/whgj_yqjshjg.png`,
        name: '外汇管家—远期结售汇交割',
        desc: '我行外汇管家借助金融科技手段，依托自贸区平台，能够为企业提供“全方位、全线上、全流程”的跨境金融服务。该视频主要介绍远期结售汇线上交割流程。',
        playProcess: 0,
        process: 0,
        myVideo: '',
        videoHidden: true
      },
      {
        id: 13,
        src: `${getApp().globalData.CDNURL}/static/wechat/img/sui/whgj_pjcpdj.mp4`,
        bg: `${getApp().globalData.CDNURL}/static/wechat/img/sui/pjcpdj.png`,
        name: '企业网银新一代票据出票登记',
        desc: '新一代票据体系升级后，企业网银支持在线开立新票和老票。此视频介绍了票据信息单笔录入和之后出票登记的全流程，方便客户操作。',
        playProcess: 0,
        process: 0,
        myVideo: '',
        videoHidden: true
      },
      {
        id: 14,
        src: `${getApp().globalData.CDNURL}/static/wechat/img/sui/whgj_pjkpdj.mp4`,
        bg: `${getApp().globalData.CDNURL}/static/wechat/img/sui/pjkpdj.png`,
        name: '企业网银新一代票据开票合同查询',
        desc: '企业网银支持线上签订银承开票合同。此视频介绍了线上开票交易后，客户后续可以查询所有签订的开票合同，并下载合同和明细详情。',
        playProcess: 0,
        process: 0,
        myVideo: '',
        videoHidden: true
      },
      {
        id: 15,
        src: `${getApp().globalData.CDNURL}/static/wechat/img/sui/whgj_jysed.mp4`,
        bg: `${getApp().globalData.CDNURL}/static/wechat/img/sui/jysed.png`,
        name: '经营随e贷申请',
        desc: '该视频主要介绍小微随e贷业务申请流程，包括业务入口、信息录入、税务授权、业务提交等操作。',
        playProcess: 0,
        process: 0,
        myVideo: '',
        videoHidden: true
      },
      {
        id: 16,
        src: `${getApp().globalData.CDNURL}/static/wechat/img/sui/whgj_xsyhk.mp4`,
        bg: `${getApp().globalData.CDNURL}/static/wechat/img/sui/sxyhk.png`,
        name: '小微线上用还款',
        desc: '该视频主要介绍小微业务线上用还款功能，包括用款信息录入、借款协议阅读、支付方式选择、还款信息录入等操作。',
        playProcess: 0,
        process: 0,
        myVideo: '',
        videoHidden: true
      }
    ],
    videos1: [
      {
        id: 27,
        src: `${getApp().globalData.CDNURL}/static/wechat/img/sui/gyljrypt_rdkd.m4v`,
        bg: `${getApp().globalData.CDNURL}/static/wechat/img/sui/gyljrypt_rdkd.png`,
        name: '供应链金融云平台-e融单开单',
        desc: '此视频主要介绍e融单开单流程，方便客户熟悉参考。该视频主要包括：（1）e融单开单经办。（2）e融单开单复核。',
        playProcess: 0,
        process: 0,
        myVideo: '',
        videoHidden: true
      },
      {
        id: 26,
        src: `${getApp().globalData.CDNURL}/static/wechat/img/sui/gyljrypt_rdrz.m4v`,
        bg: `${getApp().globalData.CDNURL}/static/wechat/img/sui/gyljrypt_rdrz.png`,
        name: '供应链金融云平台-e融单融资',
        desc: '此视频主要介绍e融单签收融资流程，方便客户熟悉参考。该视频主要包括：（1）e融单签收。（2）e融单融资。',
        playProcess: 0,
        process: 0,
        myVideo: '',
        videoHidden: true
      },
      {
        id: 25,
        src: `${getApp().globalData.CDNURL}/static/wechat/img/sui/xsgj_gzksjycx.mp4`,
        bg: `${getApp().globalData.CDNURL}/static/wechat/img/sui/xsgj_gzksjycx.png`,
        name: '薪税管家-工资卡号收集与查询',
        desc: '薪税管家是我行推出的助力企业内部人、薪、事管理的数字化平台。该视频主要介绍工资卡号收集与查询。',
        playProcess: 0,
        process: 0,
        myVideo: '',
        videoHidden: true
      },
      {
        id: 24,
        src: `${getApp().globalData.CDNURL}/static/wechat/img/sui/whgj_gjlscx.mp4`,
        bg: `${getApp().globalData.CDNURL}/static/wechat/img/sui/whgj_gjlscx.png`,
        name: '财资管家-资金归集-归集流水查询',
        desc: '财资金管家起源于现金管理平台，是我行为机构、集团等大中型客户打造的一站式财资管理平台。该视频主要介绍资金归集流水查询功能。',
        playProcess: 0,
        process: 0,
        myVideo: '',
        videoHidden: true
      },
      {
        id: 23,
        src: `${getApp().globalData.CDNURL}/static/wechat/img/sui/whgj_gjlxcx.mp4`,
        bg: `${getApp().globalData.CDNURL}/static/wechat/img/sui/whgj_gjlxcx.png`,
        name: '财资管家-资金归集-归集利息查询',
        desc: '财资金管家起源于现金管理平台，是我行为机构、集团等大中型客户打造的一站式财资管理平台。该视频主要介绍集团账客户面向成员单位资金归集时自行设定利率，后续如何进行归集利息查询。',
        playProcess: 0,
        process: 0,
        myVideo: '',
        videoHidden: true
      },
      {
        id: 22,
        src: `${getApp().globalData.CDNURL}/static/wechat/img/sui/czgj_zjgj_sgqk.mp4`,
        bg: `${getApp().globalData.CDNURL}/static/wechat/img/sui/czgj_zjgj_sgqk.png`,
        name: '财资管家-资金归集-手工请款',
        desc: '财资金管家起源于现金管理平台，是我行为机构、集团等大中型客户打造的一站式财资管理平台。该视频主要介绍子公司成员单位向上级单位手工请款功能。',
        playProcess: 0,
        process: 0,
        myVideo: '',
        videoHidden: true
      },
      {
        id: 21,
        src: `${getApp().globalData.CDNURL}/static/wechat/img/sui/czgj_zjgj_zjshxb.mp4`,
        bg: `${getApp().globalData.CDNURL}/static/wechat/img/sui/czgj_zjgj_zjshxb.png`,
        name: '财资管家-资金归集-资金上划下拨',
        desc: '财资金管家起源于现金管理平台，是我行为机构、集团等大中型客户打造的一站式财资管理平台。该视频主要介绍资金归集上划下拨功能，包含母公司企业操作员登录操作向下级成员单位账户手工归集和划转资金，以及复核审批流程。',
        playProcess: 0,
        process: 0,
        myVideo: '',
        videoHidden: true
      },
      {
        id: 19,
        src: `${getApp().globalData.CDNURL}/static/wechat/img/sui/maoerong.mp4`,
        bg: `${getApp().globalData.CDNURL}/static/wechat/img/sui/maoerong.png`,
        name: '出口贸e融申请',
        desc: '该视频主要介绍出口型小微企业线上贸易融资业务申请流程，包括信息录入、税务授权、外管区块链平台授权、征信查询授权和业务提交等操作。',
        playProcess: 0,
        process: 0,
        myVideo: '',
        videoHidden: true
      },
      {
        id: 20,
        src: `${getApp().globalData.CDNURL}/static/wechat/img/sui/whgj_czgj_sfkgl_pldk.mp4`,
        bg: `${getApp().globalData.CDNURL}/static/wechat/img/sui/whgj_czgj_sfkgl_pldk.png`,
        name: '财资管家-收付款管理-批量代扣',
        desc: '财资金管家起源于现金管理平台，是我行为机构、集团等大中型客户打造的一站式财资管理平台。批量代扣目前支持电费、水费和燃气费的代扣。该视频主要介绍了批量代扣的录入流程。',
        playProcess: 0,
        process: 0,
        myVideo: '',
        videoHidden: true
      },
      {
        id: 17,
        src: `${getApp().globalData.CDNURL}/static/wechat/img/sui/whgj_ckstrzsq.mp4`,
        bg: `${getApp().globalData.CDNURL}/static/wechat/img/sui/whgj_ckstrzsq.png`,
        name: '外汇管家—出口商贴融资申请',
        desc: '我行外汇管家借助金融科技手段，依托自贸区平台，能够为企业提供“全方位、全线上、全流程”的跨境金融服务。该视频主要介绍跨境贸e池的出口商贴融资申请流程。',
        playProcess: 0,
        process: 0,
        myVideo: '',
        videoHidden: true
      },
      {
        id: 18,
        src: `${getApp().globalData.CDNURL}/static/wechat/img/sui/whgj_ckstcxjhk.mp4`,
        bg: `${getApp().globalData.CDNURL}/static/wechat/img/sui/whgj_ckstcxjhk.png`,
        name: '外汇管家—出口商贴查询及还款',
        desc: '我行外汇管家借助金融科技手段，依托自贸区平台，能够为企业提供“全方位、全线上、全流程”的跨境金融服务。该视频主要介绍跨境贸e池的出口商贴融资查询和还款流程。',
        playProcess: 0,
        process: 0,
        myVideo: '',
        videoHidden: true
      },
      {
        // 用于区分实例绑定
        id: 1,
        // 视频地址
        src: `${getApp().globalData.CDNURL}/static/wechat/img/sui/qywysqms.mp4`,
        bg: `${getApp().globalData.CDNURL}/static/wechat/img/sui/qywysqms.png`,
        name: '企业网银授权模式',
        desc: '授权模式定义了企业网银重要的企业授权流程，支持通用和客户自定义。视频主要介绍设置过程中可能遇到的常见问题和解决方式。',
        playProcess: 0,
        process: 0,
        // 视频实例
        myVideo: '',
        // 是否隐藏视频
        videoHidden: true
      },
      {
        id: 2,
        src: `${getApp().globalData.CDNURL}/static/wechat/img/sui/qywypzldyzt1.mp4`,
        bg: `${getApp().globalData.CDNURL}/static/wechat/img/sui/qywypzldyzt1.png`,
        name: '企业网银凭证类打印专题（一）',
        desc: '此专题主要是介绍常用凭证的具体菜单和流程，方便客户熟悉和下载。该视频主要包括的凭证下载流程（1）结构性存款购买协议、产品说明、（2）单位保证金账户开户、销户回执。',
        playProcess: 0,
        process: 0,
        myVideo: '',
        videoHidden: true
      },
      {
        id: 3,
        src: `${getApp().globalData.CDNURL}/static/wechat/img/sui/qywypzldyzt2.mp4`,
        bg: `${getApp().globalData.CDNURL}/static/wechat/img/sui/qywypzldyzt2.png`,
        name: '企业网银凭证类打印专题（二）',
        desc: '此专题主要是介绍常用凭证的具体菜单和流程，方便客户熟悉和下载。该视频主要包括的凭证下载流程（1）直通式放款合同、借据、（2）票据池银企对账历史明细。',
        playProcess: 0,
        process: 0,
        myVideo: '',
        videoHidden: true
      },
      {
        id: 4,
        src: `${getApp().globalData.CDNURL}/static/wechat/img/sui/qywydwz.mp4`,
        bg: `${getApp().globalData.CDNURL}/static/wechat/img/sui/qywydwz.png`,
        name: '企业网银对外转账',
        desc: '对外转账是企业网银最日常高频的交易之一，支持实时、预约通过人行支付系统向他行快捷转账。视频主要介绍了（1）常用付款用途维护（2）联行号查询收款行（3）对外转账主体流程三个部分，方便客户更顺利完成交易。',
        playProcess: 0,
        process: 0,
        myVideo: '',
        videoHidden: true
      },
      {
        id: 5,
        src: `${getApp().globalData.CDNURL}/static/wechat/img/sui/EDGE.mp4`,
        bg: `${getApp().globalData.CDNURL}/static/wechat/img/sui/EDGE.png`,
        name: '企业网银EDGE浏览器调整',
        desc: '企业网银EDGE浏览器调整：为适应windows系统升级和客户使用习惯，此视频介绍了EDGE浏览器以IE模式加载网页的方法。调整为IE模式后，EDGE浏览器也可以顺畅使用企业网银和我行其他网站。',
        playProcess: 0,
        process: 0,
        myVideo: '',
        videoHidden: true
      },
      {
        id: 6,
        src: `${getApp().globalData.CDNURL}/static/wechat/img/sui/qywyztsfk.mp4`,
        bg: `${getApp().globalData.CDNURL}/static/wechat/img/sui/qywyztsfk.png`,
        name: '企业网银直通式放款',
        desc: '直通式放款重点打造短期流动资金贷款全流程线上化。此视频介绍了客户经理为客户申请额度后，客户在线提交贷款申请的流程，方便客户参考。贷款信息涉及后续放款审核，建议和客户经理确认内容后填写。',
        playProcess: 0,
        process: 0,
        myVideo: '',
        videoHidden: true
      },
      {
        id: 7,
        src: `${getApp().globalData.CDNURL}/static/wechat/img/sui/czgj_sfkgl_plzz.mp4`,
        bg: `${getApp().globalData.CDNURL}/static/wechat/img/sui/czgj_sfkgl_plzz.png`,
        name: '财资管家-收付款管理-批量转账',
        desc: '财资金管家起源于现金管理平台，是我行为机构、集团等大中型客户打造的一站式财资管理平台。批量转账是企业财资中一次性可进行多笔转账的交易。该视频主要介绍了批量转账模板的下载，以及模板的填写规范及后续的批量转账流程。',
        playProcess: 0,
        process: 0,
        myVideo: '',
        videoHidden: true
      },
      {
        id: 8,
        src: `${getApp().globalData.CDNURL}/static/wechat/img/sui/czgj-sfkgl-dbzz.mp4`,
        bg: `${getApp().globalData.CDNURL}/static/wechat/img/sui/czgj-sfkgl-dbzz.png`,
        name: '财资管家-收付款管理-单笔转账',
        desc: '财资金管家起源于现金管理平台，是我行为机构、集团等大中型客户打造的一站式财资管理平台。单笔转账是企业财资最日常高频的交易之一，支持实时、预约两种模式。该视频主要介绍了单笔转账的基本操作流程。',
        playProcess: 0,
        process: 0,
        myVideo: '',
        videoHidden: true
      },
      {
        id: 9,
        src: `${getApp().globalData.CDNURL}/static/wechat/img/sui/czgj-sfkgl-pldf.mp4`,
        bg: `${getApp().globalData.CDNURL}/static/wechat/img/sui/czgj-sfkgl-pldf.png`,
        name: '财资管家-收付款管理-批量代发',
        desc: '财资金管家起源于现金管理平台，是我行为机构、集团等大中型客户打造的一站式财资管理平台。批量代发是企业财资中可以用于代发工资和费用报销的交易。该视频主要介绍了批量代发模板的下载，以及模板的填写规范及后续的批量代发流程。',
        playProcess: 0,
        process: 0,
        myVideo: '',
        videoHidden: true
      },
      {
        id: 10,
        src: `${getApp().globalData.CDNURL}/static/wechat/img/sui/shortVideo.mp4`,
        bg: `${getApp().globalData.CDNURL}/static/wechat/img/sui/shortVideo.png`,
        name: '薪税管家-查看电子工资条',
        desc: '薪税管家是我行推出的助力企业内部人、薪、事管理的数字化平台。该视频主要介绍员工如何在移动端查看电子工资单。',
        playProcess: 0,
        process: 0,
        myVideo: '',
        videoHidden: true
      },
      {
        id: 11,
        src: `${getApp().globalData.CDNURL}/static/wechat/img/sui/whgj_yqjshqy.mp4`,
        bg: `${getApp().globalData.CDNURL}/static/wechat/img/sui/whgj_yqjshqy.png`,
        name: '外汇管家—远期结售汇签约',
        desc: '我行外汇管家借助金融科技手段，依托自贸区平台，能够为企业提供“全方位、全线上、全流程”的跨境金融服务。该视频主要介绍远期结售汇线上签约流程，该流程支持授信和保证金两种模式。',
        playProcess: 0,
        process: 0,
        myVideo: '',
        videoHidden: true
      },
      {
        id: 12,
        src: `${getApp().globalData.CDNURL}/static/wechat/img/sui/whgj_yqjshjg.mp4`,
        bg: `${getApp().globalData.CDNURL}/static/wechat/img/sui/whgj_yqjshjg.png`,
        name: '外汇管家—远期结售汇交割',
        desc: '我行外汇管家借助金融科技手段，依托自贸区平台，能够为企业提供“全方位、全线上、全流程”的跨境金融服务。该视频主要介绍远期结售汇线上交割流程。',
        playProcess: 0,
        process: 0,
        myVideo: '',
        videoHidden: true
      },
      {
        id: 13,
        src: `${getApp().globalData.CDNURL}/static/wechat/img/sui/whgj_pjcpdj.mp4`,
        bg: `${getApp().globalData.CDNURL}/static/wechat/img/sui/pjcpdj.png`,
        name: '企业网银新一代票据出票登记',
        desc: '新一代票据体系升级后，企业网银支持在线开立新票和老票。此视频介绍了票据信息单笔录入和之后出票登记的全流程，方便客户操作。',
        playProcess: 0,
        process: 0,
        myVideo: '',
        videoHidden: true
      },
      {
        id: 14,
        src: `${getApp().globalData.CDNURL}/static/wechat/img/sui/whgj_pjkpdj.mp4`,
        bg: `${getApp().globalData.CDNURL}/static/wechat/img/sui/pjkpdj.png`,
        name: '企业网银新一代票据开票合同查询',
        desc: '企业网银支持线上签订银承开票合同。此视频介绍了线上开票交易后，客户后续可以查询所有签订的开票合同，并下载合同和明细详情。',
        playProcess: 0,
        process: 0,
        myVideo: '',
        videoHidden: true
      },
      {
        id: 15,
        src: `${getApp().globalData.CDNURL}/static/wechat/img/sui/whgj_jysed.mp4`,
        bg: `${getApp().globalData.CDNURL}/static/wechat/img/sui/jysed.png`,
        name: '经营随e贷申请',
        desc: '该视频主要介绍小微随e贷业务申请流程，包括业务入口、信息录入、税务授权、业务提交等操作。',
        playProcess: 0,
        process: 0,
        myVideo: '',
        videoHidden: true
      },
      {
        id: 16,
        src: `${getApp().globalData.CDNURL}/static/wechat/img/sui/whgj_xsyhk.mp4`,
        bg: `${getApp().globalData.CDNURL}/static/wechat/img/sui/sxyhk.png`,
        name: '小微线上用还款',
        desc: '该视频主要介绍小微业务线上用还款功能，包括用款信息录入、借款协议阅读、支付方式选择、还款信息录入等操作。',
        playProcess: 0,
        process: 0,
        myVideo: '',
        videoHidden: true
      },
      {
        id: 17,
        src: `${getApp().globalData.CDNURL}/static/wechat/img/sui/whgj_ckstrzsq.mp4`,
        bg: `${getApp().globalData.CDNURL}/static/wechat/img/sui/whgj_ckstrzsq.png`,
        name: '外汇管家—出口商贴融资申请',
        desc: '我行外汇管家借助金融科技手段，依托自贸区平台，能够为企业提供“全方位、全线上、全流程”的跨境金融服务。该视频主要介绍跨境贸e池的出口商贴融资申请流程。',
        playProcess: 0,
        process: 0,
        myVideo: '',
        videoHidden: true
      },
      {
        id: 18,
        src: `${getApp().globalData.CDNURL}/static/wechat/img/sui/whgj_ckstcxjhk.mp4`,
        bg: `${getApp().globalData.CDNURL}/static/wechat/img/sui/whgj_ckstcxjhk.png`,
        name: '外汇管家—出口商贴查询及还款',
        desc: '我行外汇管家借助金融科技手段，依托自贸区平台，能够为企业提供“全方位、全线上、全流程”的跨境金融服务。该视频主要介绍跨境贸e池的出口商贴融资查询和还款流程。',
        playProcess: 0,
        process: 0,
        myVideo: '',
        videoHidden: true
      }
    ],
    fromShare: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      navTop: app.globalData.statusBarTop,
      navHeight: app.globalData.statusBarHeight,
    });
    console.log(options,'options')
    if(options.share_date){
      this.setData({fromShare:true})
    }else{
      this.setData({fromShare:false})
    }
  },
  prePage() {
    wx.switchTab({
      url: '/pages/shop/index2',
    })
  },
  toPlay(e){
    var that = this
    var n = e.currentTarget.dataset.id;
    console.log(n,'n')
    var num = '';
    for(let j = 0;j<this.data.videos1.length;j++){
      if(that.data.videos1[j].id == n){
        num = j;
        console.log(num,'num');
      }
    }
    wx.navigateTo({
      url: `/pages/video/play/index?src=${that.data.videos1[num].src}&name=${that.data.videos1[num].name}&id=${that.data.videos1[num].id}&desc=${that.data.videos1[num].desc}&playProcess=${that.data.videos1[num].playProcess}`
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getProcess();
  },
  getProcess: function(){
    var that = this;
    api.getProcess().then((res) => {
      if(res.STATUS == '1' && res.LIST){
        for(let i = 0;i<res.LIST.length;i++){
          for(let j = 0;j<that.data.videos.length;j++){
            if(that.data.videos[j].id == res.LIST[i].videoId){
              that.data.videos[j].playProcess = res.LIST[i].playProcess;
              that.data.videos[j].process = parseInt((res.LIST[i].playProcess / res.LIST[i].totalTime)*100);
              console.log((res.LIST[i].playProcess / res.LIST[i].totalTime)*100,'111')
              that.setData({ videos1 : that.data.videos })
              console.log(that.data.videos1)

            }
          }
        }
      }
    }).catch(err=>{
      wx.showToast({
        title: '历史进度获取失败' || err,
        icon: 'none'
      })
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let pages = getCurrentPages(); //获取加载的页面
    let currentPage = pages[pages.length - 1]; //获取当前页面的对象
    let url = currentPage.route;//当前页面url
    let share_id = wx.getStorageSync('openid');
    var path = 'pages/video/index' + "?open_id=" + share_id + "&share_date=" + util.formatTime(new Date());
    return {
      path: path,
    }
  },
})