const app = getApp();
import { getSalaryCode } from '../../api/salary';
import User from '../../utils/user';
var myPerformance = require("../../utils/performance.js");
Page({
	data: {
        cndUrl:app.globalData.CDNURL,

    },

	onLoad: function (options) {
		myPerformance.reportBegin(2018,'shop_scheme');
		this.setData({
			preffixUrl: app.globalData.URL,
			isEmployee:app.globalData.empNo&&true
		});
		myPerformance.reportEnd(2018,'shop_scheme');
	},
	async getCode() {
		wx.showLoading({
		  title: '跳转中',
		  mask: true,
		});
	
		try {
		  const userInfo = await User.getCustomerInfo();
		  console.log(userInfo);
	
		  if (!userInfo.TEL) {
			wx.navigateTo({
			  url: '/sub1/pages/auth/index',
			});
			return;
		  }
	
		  const res = await getSalaryCode(userInfo.TEL);
		  console.log(res);
		  let skipUrl = '';
		  if (res.flag === '1') {
			 skipUrl = `https://qygj.jsbchina.cn/mxcp/index.html#/Home?CODE=${res.data}&CHNL_TYPE=wxmp`;
			// skipUrl = `https://qygj-test.jsbchina.cn/mxcp/index.html#/HrMain?CODE=${res.data}&CHNL_TYPE=wxmp`;
			console.log(skipUrl);
			wx.navigateTo({
			  url: '/pages/showWeb/showWeb?skipUrl=' + encodeURIComponent(skipUrl),
			});
		  } else {
			wx.showModal({
			  title: '提示',
			  content: '暂无权限，是否前往注册页面',
			  showCancel: true,
			  cancelText: '取消',
			  cancelColor: '#000000',
			  confirmText: '确定',
			  success: (result) => {
				if (result.confirm) {
				   skipUrl = 'https://qygj.jsbchina.cn/mxcp/index.html#/register';
				//    skipUrl = 'https://qygj-test.jsbchina.cn/mxcp/index.html#/register';
				  wx.navigateTo({
					url: '/pages/showWeb/showWeb?skipUrl=' + encodeURIComponent(skipUrl),
				  });
				}
			  },
			  fail: () => {},
			  complete: () => {},
			});
		  }
		} catch (error) {
		} finally {
		  wx.hideLoading();
		}
	  },
	nothing() {
		wx.showToast({
			title: "敬请期待",
			icon: "none",
			duration: 2000,
		});
	},

    toKingSley(){
        wx.navigateTo({
          url: '/sub2/pages/kingsley/index',
        })  
        },
	/**
	 * 跳转自贸解决方案
	 */
	toTrade() {
		wx.navigateTo({
			url: "/sub1/pages/trade/platform",
		});
	},

	toCross() {
		wx.navigateTo({
			url: "/sub2/pages/crossBorderE/platform",
		});
	},

	onShareAppMessage: function () {},
});
