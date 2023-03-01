var util = require("../../utils/util.js");
import user from "../../utils/user";
import Order from "../../api/Order";
import requestYT from '../../api/requestYT';

var app = getApp();
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
		pageTips: "上拉加载更多",
		list1: [],
		pageList: [],
		page: 1,
    pageSize: 10,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.setData({
			preffixUrl: app.globalData.CDNURL,
		});
		var that = this;
		//that.apli();
		wx.showLoading({
			title: "加载中...",
		});
		that.userInfo();
		that.list();
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

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {},
	
	userInfo: function () {

	},

  onReachBottom: function () {
		this.setData({
			page: this.data.page + 1,
		});
		if (this.data.pageTips == "已无更多数据") {
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
					pageTips: "已无更多数据",
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
  
	async list() {
    try {
      let res_cust = await user.getCustomerInfo();
      if (!res_cust.ID_CARD) {
        return;
      }
      this.setData({
        applicantIdCard: res_cust.ID_CARD,
      }); 

      let res = [];
      try {
        let res1 = await Order.getOrderInfoByIdCard(res_cust.ID_CARD, "1", "168")
        res = res.concat(res1)
      } catch(err) {
          
      }

      let res2 = await this.myrGetAuthorizationInfo(res_cust.TEL,1)
      res = res.concat(res2)

      let arrs = []
      if (res.length > 0) {
        for (let i = 0; i < res.length; i++) {
          let row = {}
          if (res[i].eId) {
            row = {
              companyName: res[i].companyName,
              orderNo: res[i].orderNo,
              authorizeExpiration: '', // auth_list_authed没用到
              authorizeStatus: res[i].authorizeStatus,
              socialCreditCode: res[i].socialCreditCode,
              prowId: '', // auth_det1 auth_det_auth 都没用到
              applyAmount: res[i].applyAmount,
              authorizeTime: res[i].authorizeTime,

              eId: res[i].eId,
              authorizerName: res[i].authorizerName,
              authorizerCard: res[i].authorizerCard,
              authorizerCardType: res[i].authorizerCardType,
              authorizerMobile: res[i].authorizerMobile,
              showState: res[i].showState,
              attr3: res[i].attr3,
              applyDate: res[i].applyDate,
              requestSeqNo: res[i].requestSeqNo,
              applyType: res[i].applyType,
              queryResult: res[i].queryResult,
              taxNo: res[i].taxNo,
            }
            if (row.applyAmount) {
              if (row.applyType == 21) {
                row.applyAmount = Number(row.applyAmount) / 10000
              }
              row.applyAmount = row.applyAmount + ''
              if(row.applyAmount.indexOf('.')!='-1'){
                row.applyAmount = row.applyAmount.substring(0,row.applyAmount.indexOf('.'))
              }
            }
          } else {
            row = {
              companyName: res[i].companyName,
              orderNo: res[i].orderNo,
              authorizeExpiration: res[i].authorizeExpiration,
              authorizeStatus: res[i].authorizeStatus,
              socialCreditCode: res[i].socialCreditCode,
              prowId: res[i].prowId,
              applyAmount: res[i].applyAmount,
              authorizeTime: res[i].authorizeTime,
            }
          }
          arrs.push(row)
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
          pageTips: "暂无授权",
        });
      }
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
      // 停止下拉动作
      wx.stopPullDownRefresh();
    } catch(err) {
      wx.hideLoading();
      // wx.showToast({
      //   title: err,
      //   icon: 'none',
      // });
      this.setData({
        list1: false,
        pageList: false,
        pageTips: "已无更多数据",
      });
    }
  },
  
	apli: function () {
		var that = this;

		user.getIdentityInfo().then(res => {

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
                url: "/sub1/pages/auth/index?type=2&url=/pages/mine/auth_list_authed",
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
                url: "/sub1/pages/auth/index?type=2&url=/pages/mine/auth_list_authed",
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

  async confirm(e) {
    wx.showLoading({
      title: '请等待',
      mask: true,
      duration: 60000,
    });
    let {item} = e.currentTarget.dataset;

    let data = {
      orderNo: item.orderNo,
      applyDate: item.applyDate,
      applyAmount: JSON.stringify(item.applyAmount * 10000),
      applyStatus: '3',
      queryResult: item.queryResult,
      orgId: item.requestSeqNo,
      txnNo: item.taxNo,
    }
    let res_sign = await Order.myrAddOrUpdata(data)

    if (res_sign.msgCode == '0000') {
      wx.hideLoading();
      wx.showModal({
        title: '提示',
        content: '确认额度成功',
        showCancel: false,
        confirmText: '确定',
        success: async (result) => {
          if (result.confirm) {
            this.list();
          }
        },
      });
    } else {
      wx.hideLoading();
      if(res_sign.msg=='订单状态更新失败:在我行已存在贸易融订单'){
        wx.showModal({
            title: '提示',
            content: `在我行已存在贸e融订单`,
            showCancel: true,
            confirmText: '确定',
          });
      }else{
        wx.showModal({
          title: '提示',
          content: `确认额度失败`,
          showCancel: true,
          confirmText: '确定',
        });
      }
    }
  },

});
