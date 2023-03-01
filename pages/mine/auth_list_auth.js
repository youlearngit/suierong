var util = require("../../utils/util.js");
const app = getApp();
import user from "../../utils/user";
import Order from "../../api/Order";
var myPerformance = require("../../utils/performance.js");
import requestYT from '../../api/requestYT';

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		preffixUrl: "",
		showNon: false,
		userInfo: {},
		hasUserInfo: false,
		canIUse: wx.canIUse("button.open-type.getUserInfo"),
		apply_amount: "", //金额
		enterprise_name: "", //名称
		vouch_type: "", //抵押方式
		purpose: "", //用途
		order_state: "", //订单编号
		apply_term: "", //贷款时长,
		pageTips: "上拉加载更多未授权指令",
		list1: [],
		pageList: [],
		page: 1,
		pageSize: 10,
		applicateName: "",
		applicantIdCard: "",
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		myPerformance.reportBegin(2014,'mine_auth_list_auth');
		this.setData({
			preffixUrl: app.globalData.URL,
		});
		myPerformance.reportEnd(2014,'mine_auth_list_auth');
		var that = this;
		that.apli();
		// wx.showLoading({
		//   title: '加载中...',
		// })
		that.userInfo();
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		if (wx.getStorageSync("openid") == null || wx.getStorageSync("openid") == "") {
			wx.login({
				success: res => {
					// 发送 res.code 到后台换取 openId, sessionKey, unionId
					util.openid(res.code, app.globalData.URL);
				},
			});
		} else {
			//判断数据库了里是否存在密钥
			wx.request({
				url: app.globalData.URL + "existkey",
				data: {
					sessionId: wx.getStorageSync("sessionid"),
				},
				method: "POST",
				header: {
					"Content-Type": "application/x-www-form-urlencoded",
					key: Date.parse(new Date()).toString().substring(0, 6),
				},
				success(res) {
					if (res.data == undefined || res.data != true) {
						wx.login({
							success: res => {
								// 发送 res.code 到后台换取 openId, sessionKey, unionId
								util.openid(res.code, app.globalData.URL);
							},
						});
					}
				},
				fail() {
					wx.showToast({
						title: "网络异常",
						icon: "none",
						duration: 2000,
					});
				},
			});
		}
	},

	userInfo: function () {

  },
  
	onReachBottom: function () {
		this.setData({
			page: this.data.page + 1,
		});
		if (this.data.pageTips == "已无更多未授权指令") {
			return;
		}
		wx.showLoading({
			title: "加载中...",
		});
		wx.showNavigationBarLoading();
		var arr = this.data.pageList;
		var that = this;
		var psize = this.data.pageSize;
		var page = this.data.page;
		for (var i = (page - 1) * psize; i < page * psize; i++) {
			if (that.data.list1[i] != undefined && that.data.list1[i] != null) {
				arr.push(that.data.list1[i]);
			} else {
				that.setData({
					pageTips: "已无更多未授权指令",
				});
				break;
			}
		}
		wx.hideLoading();
		this.setData({
			pageList: arr,
		});
		wx.hideNavigationBarLoading();
	},

	getDetailInfo(e) {
    let data = e.currentTarget.dataset.data;

    if (data.eId) {
      wx.navigateTo({
        url: `/sub5/pages/mer/idcard_legal/idcard_legal?eid=${data.eId}`,
      })
      return;
    }

		wx.navigateTo({
			url: `auth_det1?orderNo=${data.orderNo}&applicantIdcard1=${this.data.applicantIdCard}&socialCreditCode=${data.socialCreditCode}&&name=${this.data.applicateName}&prowId=${data.prowId}&authorizeStatus=${data.authorizeStatus}&enterprise_name=${data.companyName}&apply_amount=${data.applyAmount}&authorizerType=${data.authorizerType}&specialProductCode=${data.specialProductCode}&resvFld2=${data.resvFld2}`,
			success: result => {},
			fail: () => {},
			complete: () => {},
		});
  },
  
	async list() {
    try {
      let res_idcard = await user.getIdentityInfo();
      this.setData({
        applicantIdCard: res_idcard.ID_NUMBER,
        applicateName: res_idcard.NAME,
      });

      let res_cust = await user.getCustomerInfo();

      let res = [];
      try {
        let res1 = await Order.getOrderInfoByIdCard(res_idcard.ID_NUMBER, "0", "");
        res = res.concat(res1)
      } catch(err) {

      }

      let res2 = await this.myrGetAuthorizationInfo(res_cust.TEL,0)
      res = res.concat(res2)

      let arrs = [];
      if (res.length > 0) {
        for (var i = 0; i < res.length; i++) {
          if (res[i].eId) {
            arrs.push({
              companyName: res[i].companyName,
              orderNo: res[i].orderNo,
              authorizeExpiration: '', // auth_list_auth没用到
              authorizeStatus: res[i].authorizeStatus,
              socialCreditCode: res[i].socialCreditCode,
              prowId: '', // auth_det1没用到
              applyAmount: res[i].applyAmount,
              authorizerType: res[i].authorizerType,
              specialProductCode: '', // auth_det1为空也可
              resvFld2: '',

              eId: res[i].eId,
              authorizerName: res[i].authorizerName,
              authorizerCard: res[i].authorizerCard,
              authorizerCardType: res[i].authorizerCardType,
              authorizerMobile: res[i].authorizerMobile,
              authorizeTime: res[i].authorizeTime,
              showState: res[i].showState,
              attr3: res[i].attr3,
              applyDate: res[i].applyDate,
              requestSeqNo: res[i].requestSeqNo,
              applyType: res[i].applyType,
              queryResult: res[i].queryResult,
              taxNo: res[i].taxNo,
            })
          } else {
            arrs.push({
              companyName: res[i].companyName,
              orderNo: res[i].orderNo,
              authorizeExpiration: res[i].authorizeExpiration,
              authorizeStatus: res[i].authorizeStatus,
              socialCreditCode: res[i].socialCreditCode,
              prowId: res[i].prowId,
              applyAmount: res[i].applyAmount,
              authorizerType: res[i].authorizerType,
              specialProductCode : res[i].specialProductCode,
              resvFld2: res[i].resvFld2,
            });
          }
        }
        this.setData({
          list1: arrs,
        });
        this.setData({
          pageList: this.data.list1,
          pageTips: this.data.list1.length < this.data.pageSize ? "已无更多未授权指令" : "上拉加载更多未授权指令",
        });
        wx.hideLoading();
      } else {
        wx.hideLoading();
        this.setData({
          pageTips: "暂无未授权指令",
        });
      }
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
      // 停止下拉动作
      wx.stopPullDownRefresh();
    } catch (err) {
      wx.hideLoading();
      // wx.showToast({
      //   title: err,
      //   icon: 'none',
      // });
      this.setData({
        list1: false,
        pageList: false,
        pageTips: "已无更多未授权指令",
      });
    }
  },
  
	apli: function () {
		var that = this;
		//证件拍照

		user.getIdentityInfo().then(res => {
      wx.showToast({
        title: "加载中...",
        icon: "loading",
        duration: 2000,
      });
      that.list();
    }).catch(err => {
      if (err === "unSelectIdcard") {
        wx.showModal({
          title: "提示",
          content: "请先进行身份证拍照认证",
          showCancel: true, //是否显示取消按钮
          success: function (res) {
            if (!res.confirm) {
              wx.navigateBack({});
            } else {
              wx.redirectTo({
                url: "/sub1/pages/auth/index?type=2&url=/pages/mine/auth_list_auth",
              });
            }
          },
          fail: function (res) {}, //接口调用失败的回调函数
          complete: function (res) {}, //接口调用结束的回调函数（调用成功、失败都会执行）
        });
      }
    });

    user.getCustomerInfo().then(res=>{
      if (!res.TEL) {
        wx.showModal({
          title: "提示",
          content: "请先进行手机号认证",
          showCancel: true,
          success: function (res) {
            if (res.confirm) {
              wx.redirectTo({
                url: "/sub1/pages/auth/index?type=2&url=/pages/mine/auth_list_auth",
              });
            } else {
              wx.navigateBack({});
            }
          },
        });
      }
    })

  },

  async myrGetAuthorizationInfo(faPhone,authorizationStatus) {
    let options = {
      url: 'myr/getAuthorizationInfo.do',
      data: {
        faPhone: faPhone,
        authorizationStatus: authorizationStatus+'',
      }
    };
    let res = await requestYT(options);
    return JSON.parse(res.list);
  },
  
});
