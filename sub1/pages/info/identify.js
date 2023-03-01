var util = require("../../../utils/util.js");
import user from "../../../utils/user";
import log from "../../../log.js";
import api from '../../../utils/api';

const app = getApp();

Page({
    /**
     * 页面的初始数据
     */
    data: {
        verifyResult: "", //认证返回值
        apply: [],
        preffixUrl: "",
        showNon1: "",
        showNon2: "",
        showNon3: "",
        userInfo: {},
        identity: {}, //身份信息
        hasUserInfo: false,
        canIUse: wx.canIUse("button.open-type.getUserInfo"),
        url: "",
        type: "",
        page: "", //随额贷首页跳转,
        facialType: "",
        status: '',
    },

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		//console.log("传递的参数", options);
		var that = this;
		that.setData({
			page: options.page,
		});

        that.setData({
            preffixUrl: app.globalData.URL,
            url: options.url == undefined || options.url == null ? "" : options.url,
            type: options.type == undefined ? "" : options.type,
            status: options.status || '',
        });
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        var that = this;
        wx.showLoading({
            title: "加载中...",
        });
        that.init();
    },
    init() {
        let that = this;
        // 个人信息
        user.getCustomerInfo().then(r => {
                let customerInfo = {};
                customerInfo.REAL_NAME = r.REAL_NAME ? r.REAL_NAME : "";
                customerInfo.ID_CARD = r.ID_CARD ? r.ID_CARD : "";
                customerInfo.TEL = r.TEL ? r.TEL : "";
                if (!r.TEL) {
                    wx.showModal({
                        title: '',
                        content: '请先录入手机号',
                        showCancel: false,
                        confirmText: '确定',
                        success: (result) => {
                            if(result.confirm){
                                wx.redirectTo({
                                    url:'/sub1/pages/auth/index'
                                })
                            }
                        },
                        fail: ()=>{},
                        complete: ()=>{}
                    });
                }else{
                    that.setData({
                        showNon1: r.REAL_NAME ? true : false,
                        customerInfo: customerInfo,
                        customerInfo2: JSON.stringify(customerInfo),
                    });
                }
				
			})
			.catch(err => {
				//console.log(err);
			});

        //人脸识别
        user.getFaceVerify().then(res => {
                that.setData({
                    showNon3: true,
                });
                wx.hideLoading();
            })
            .catch(err => {
                console.log("info:getFaceVerify", err);
                wx.hideLoading();
                that.setData({
					showNon3: false,
				});
				if ("faceUnVerified" === err) {
					that.setData({
						facialType: "bank",
					});
				}
			});

		//证件拍照
		user.getIdentityInfo().then(res => {
			var shengfe = res;
			console.log('shengfe',shengfe)
			// that.setData({
			// 	identity: shengfe,
			// 	showNon2: true,
			// });
			if(shengfe.ATTR3 != '' && shengfe.ATTR3 != undefined && shengfe.ATTR3 != null){
				that.setData({
					identity: shengfe,
					showNon2: true,
				});
			}else{
				that.setData({
					identity: shengfe,
					showNon2: false,
				});
			}
			if (that.data.page == "sui") {
				//console.log("sui");
				wx.redirectTo({
					url: "/sub1/pages/sui/apply",
				});
			}
            if (that.data.page === "auth") {
				//console.log("sui");
                   wx.navigateBack({
                       delta: 1
                   });
			}
		}).catch(err=>{
            that.setData({
				showNon2: false,
			});
        });
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
		////console.log(app.globalData.userInfo)

	},
	set_1: function () {
		wx.navigateTo({
			url: "set_1?url=" + this.data.url + "&type=" + this.data.type,
		});
	},
	set_2: function () {
		var that = this;
		//console.log("url=" + this.data.url + "&type=" + this.data.type);
		//url  set_2?url=/pages/shui/apli&type=3
		if (!user.ifAuthUserInfo()) {
			wx.showToast({
				title: "请您先授权登录",
				icon: "none",
				duration: 2000,
			});
		} else if (!this.data.showNon1) {
			wx.showToast({
				title: "请您先录入个人信息",
				icon: "none",
				duration: 2000,
			});
		} else if (!this.data.showNon3) {
			wx.showToast({
				title: "请您先完成人脸识别",
				icon: "none",
				duration: 2000,
			});
		} else {
			wx.navigateTo({
				url:
					"set_2?url=" +
					this.data.url +
					"&type=" +
					this.data.type +
					"&name=" +
					that.data.customerInfo.REAL_NAME +
					"&idcard=" +
					that.data.customerInfo.ID_CARD,
			});
		}
	},
	async set_3 () {
		if (!this.data.showNon1) {
			wx.showToast({
				title: "请您先录入个人信息",
				icon: "none",
				duration: 2000,
			});
		} else {
			var that = this;

			// if (that.data.facialType === "bank") {
			// 	wx.navigateTo({
			// 		url: "/sub1/pages/info/set_3",
			// 	});
			// 	return;
			// }
			log.setFilterMsg(that.data.customerInfo.REAL_NAME);
      await api.getImageBatchId(that.data.customerInfo.REAL_NAME,that.data.customerInfo.ID_CARD);
      that.setData({	showNon3: true	});
// 			wx.checkIsSupportFacialRecognition({
// 				success() {
// 					wx.startFacialRecognitionVerifyAndUploadVideo({
// 						name: that.data.customerInfo.REAL_NAME, //身份证名称
// 						idCardNumber: that.data.customerInfo.ID_CARD , //身份证号码
// 						checkAliveType: 2,
// 						success: function (res) {
// 							console.log("人脸success", res);
// 						},
// 						fail: function (err) {
// 							console.log("人脸fail", err);
// 						},
// 						complete: res => {
// 							console.log("complete", res);
// 							log.info("人脸识别结果" + JSON.stringify(res));
// 							// if (res.errCode === 90100) {
//                             //     return;
//               // }
// 							 api.getWeChatFaceResult(res.verifyResult).then(ress=>{		
//                 	user.addFaceInfo("0", res.errCode+res.errMsg).then(res => {
// 								that.setData({
// 									showNon3: true,
// 								});
// 							});
// 							                  }).catch(err=>{
// 								that.setData({
// 									facialType:"bank"
// 							})
// user.addFaceInfo("1", res.errCode+res.errMsg).then(res => {});
// 							                  })
// 							return;
// 							if (res.errCode === 0) {
// 								user.addFaceInfo("0", res.errCode+res.errMsg).then(res => {
// 									that.setData({
// 										showNon3: true,
// 									});
// 								});
// 							} else {
//                                 console.log("msg", res.errCode+res.errMsg);
//                                 that.setData({
//                                     facialType:"bank"
//                                 })
// 								user.addFaceInfo("1", res.errCode+res.errMsg).then(res => {});
// 							}
// 						},
// 					});
// 				},
// 				fail(res) {
//                     log.info("人脸识别结果" + JSON.stringify(res));
//                     user.addFaceInfo("1", "设备不支持人脸").then(res => {});
//                     that.setData({
//                         facialType:"bank"
//                     })
//                     console.log(res);
// 					wx.showToast({
// 						title: "您的微信版本暂不支持人脸识别，请您先升级。",
// 						icon: "none",
//                     });
//                     // wx.navigateTo({
// 					// 	url: "sub1/pages/info/set_3",
// 					// });
// 				},
//       });
      
		}
	},

	identifyDetail: function () {
		wx.navigateTo({
			url: "set_2_show",
		});
	},
});
