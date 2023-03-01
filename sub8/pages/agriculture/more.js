// sub8/pages/agriculture/more.js
const app = getApp();
import user from '../../../utils/user';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cdUrl:'',
    currentPage:'',
    cndUrl: app.globalData.CDNURL,
    cndUrls:'https://wxapp.jsbchina.cn:7080/rhedt//',
    tpyeArray: [
			"融资服务", //m
			"账户服务", //m
			"天天理财", //o
      "商户服务", //s
      "消费金融", //s
      "增值服务", //s
		
    ],
    TabCur: 0,
		products: [
      [
        {
          ACTION: "1",
          CODE: "snd",
          DEPT: "A",
          NAME: "苏农贷",
          REGION: "1",
          SEQUENCE: "1",
          STATUS: "1",
          SUMMARY: "让您的融资不再难",
          url:'/sub1/pages/xnd/index',
          TYPE: "M",
          UPDATE_DATE: "20200421",
        },
        {
          ACTION: "1",
          CODE: "hjd",
          DEPT: "A",
          NAME: "农业担保贷款",
          REGION: "1",
          url:'/pages/nong/index',
          SEQUENCE: "1",
          STATUS: "1",
          SUMMARY: "让您的融资不再难",
          TYPE: "M",
          UPDATE_DATE: "20200421",
        },
        {
          ACTION: "1",
          CODE: "nhjyd",
          DEPT: "A",
          NAME: "农户经营贷",
          REGION: "1",
          url:'/sub1/pages/sui/index',
          SEQUENCE: "1",
          STATUS: "1",
          SUMMARY: "让您的融资不再难",
          TYPE: "M",
          UPDATE_DATE: "20200421",
        },
        {
          ACTION: "1",
          CODE: "cclld",
          DEPT: "A",
          NAME: "仓储冷链贷",
          url:'/sub1/pages/warehousing/index',
          REGION: "1",
          SEQUENCE: "1",
          STATUS: "1",
          SUMMARY: "让您的融资不再难",
          TYPE: "M",
          UPDATE_DATE: "20200421",
        },
        {
          ACTION: "1",
          CODE: "hayhygfpd",
          DEPT: "A",
          NAME: "淮安分行阳光扶贫贷",
          url:'/pages/sunshine/index',
          REGION: "1",
          SEQUENCE: "1",
          STATUS: "1",
          SUMMARY: "让您的融资不再难",
          TYPE: "M",
          UPDATE_DATE: "20200421",
        },
        
          {
            ACTION: "1",
            CODE: "ztclogo",
            DEPT: "A",
            NAME: "信贷直通车",
            url: '/pages/sunshine/index',
            REGION: "1",
            SEQUENCE: "1",
            STATUS: "1",
            SUMMARY: "让您的融资不再难",
            TYPE: "M",
            UPDATE_DATE: "20200421",
          },
      ],
      [
        {
          ACTION: "1",
          CODE: "dgkhcx",
          DEPT: "A",
          NAME: "对公账户查询",
          url:'/sub1/pages/h5/index',
          REGION: "1",
          SEQUENCE: "1",
          STATUS: "1",
          SUMMARY: "让您的融资不再难",
          TYPE: "M",
          UPDATE_DATE: "20200421",
        },
        {
          ACTION: "1",
          CODE: "dgkhyy",
          DEPT: "A",
          NAME: "对公预约开户",
          url:'/pages/kaihu1/kaihu1',
          REGION: "1",
          SEQUENCE: "1",
          STATUS: "1",
          SUMMARY: "让您的融资不再难",
          TYPE: "M",
          UPDATE_DATE: "20200421",
        },
        {
          ACTION: "1",
          CODE: "khyhcx",
          DEPT: "A",
          NAME: "开户资料查询",
          url:'/sub1/pages/account/index',
          REGION: "1",
          SEQUENCE: "1",
          STATUS: "1",
          SUMMARY: "让您的融资不再难",
          TYPE: "M",
          UPDATE_DATE: "20200421",
        },
        {
          ACTION: "1",
          CODE: "grsjyh",
          DEPT: "A",
          NAME: "个人手机银行",
          url:'/sub2/pages/qyBankRegister/index',
          REGION: "1",
          SEQUENCE: "1",
          STATUS: "1",
          SUMMARY: "让您的融资不再难",
          TYPE: "M",
          UPDATE_DATE: "20200421",
        },
        {
          ACTION: "1",
          CODE: "qysjyh",
          DEPT: "A",
          NAME: "企业手机银行",
          url:'/sub1/pages/register/index',
          REGION: "1",
          SEQUENCE: "1",
          STATUS: "1",
          SUMMARY: "让您的融资不再难",
          TYPE: "M",
          UPDATE_DATE: "20200421",
        },
      ],
      [
        {
          ACTION: "1",
          CODE: "ttlclogo",
          DEPT: "A",
          NAME: "天天理财",
          url:'/pages/showWeb/showWeb',
          REGION: "1",
          SEQUENCE: "1",
          STATUS: "1",
          SUMMARY: "让您的融资不再难",
          TYPE: "M",
          UPDATE_DATE: "20200421",
        },
      ],
      [
        {
          ACTION: "1",
          CODE: "erzf",
          DEPT: "A",
          NAME: "e融支付",
          url:'/pages/showWeb/showWeb',
          REGION: "1",
          SEQUENCE: "1",
          STATUS: "1",
          SUMMARY: "让您的融资不再难",
          TYPE: "M",
          UPDATE_DATE: "20200421",
        },
      ],
      [{
        ACTION: "1",
        CODE: "xyk",
        DEPT: "A",
        NAME: "信用卡",
        REGION: "1",
        url:'/sub2/pages/reditCard/reditCard',
        SEQUENCE: "1",
        STATUS: "1",
        SUMMARY: "让您的融资不再难",
        TYPE: "M",
        UPDATE_DATE: "20200421",
      },{
        ACTION: "1",
        CODE: "xfsed",
        DEPT: "A",
        NAME: "消费随e贷",
        REGION: "1",
        url:'/sub1/pages/consumer/index',
        SEQUENCE: "1",
        STATUS: "1",
        SUMMARY: "让您的融资不再难",
        TYPE: "M",
        UPDATE_DATE: "20200421",
      },],
      [ {
        NAME:'网点查询',
        url:'/sub2/pages/map/index',
        CODE:'wdcx'
      },
      {
        NAME:'房产评估',
        url:'/pages/house/house',
        CODE:'fcgj'
      },
      {
        NAME:'房贷计算器',
        url:'/pages/showWeb/showWeb?skipUrl=https://csh.jsbchina.cn/eHomeLife/calculator/monthLimitCalculator.do',
        CODE:'grsjyh'
      },
      {
        NAME: '农村产权交易',
        url: '/sub8/pages/agriculture/propertyRight',
        CODE: 'nccqjy'
      },
    ]
      
    ], //所有产品
		showProducts: false, //先加载 在展示
		CustomBar: app.globalData.StatusBar,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(getCurrentPages().length);
    this.setData({
      currentPage: getCurrentPages().length,
      showProducts: true,
      TabCur:options.type
      // currentPage: getCurrentPages().length,
    })
  },
  // 'https://direct.jsbchina.cn/direct/page/index.html#page/100/14/01/P1001401.html?TerminalType=h5
  skip(e) {
    console.log(e.currentTarget);
    if ( e.currentTarget.dataset.name == 'e融支付') {
      var that = this;
      var url = 'https://pay.jsbchina.cn/epcs/eMerchant/toApplication.htm' + "?openId=" + wx.getStorageSync('openid') + "&regChannelNo=2"
      
      wx.navigateTo({
        url: "/pages/showWeb/showWeb?skipUrl=" + encodeURIComponent(url),
      });
    
    } else if (e.currentTarget.dataset.name == '天天理财') {
      var that = this;
      var url = 'https://direct.jsbchina.cn/direct/page/index.html#page/100/14/01/P1001401.html?TerminalType=h5'
      
      wx.navigateTo({
        url: "/pages/showWeb/showWeb?skipUrl=" + encodeURIComponent(url),
      });
    } else if (e.currentTarget.dataset.name == '信贷直通车') {
      let skipUrl = `https://xnzb.org.cn/xdztc/src/ztc/login.html`;
        console.log(skipUrl);
        wx.navigateTo({
          url: '/pages/showWeb/showWeb?skipUrl=' + encodeURIComponent(skipUrl),
        });
    } else {
      wx.navigateTo({
        url:e.currentTarget.dataset.url
      })
    }
    
  },
  tabSelect(e) {
		this.setData({
			TabCur: e.currentTarget.dataset.id,
		});
	},
  onClickLeft() {
    wx.showToast({ title: '点击返回', icon: 'none' });
  },
  onClickRight() {
    wx.showToast({ title: '点击按钮', icon: 'none' });
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
  onShareAppMessage() {
    return{
      title:'掌上三农',
      path:'sub8/pages/agriculture/more'

    }
  }
})