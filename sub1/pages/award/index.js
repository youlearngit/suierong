// sub1/pages/award/index.js
import requestP from "../../../utils/requsetP";
import requestYT from "../../../api/requestYT";

import user from "../../../utils/user";
import util from "../../../utils/util";
import Order from "../../../api/Order";

var app = getApp();
Page({
	/**
	 * Page initial data
	 */
	data: {
		show: false,
		showBeanBox: false,
		submit: false,
		customerInfo: {},
		empNo: "",
		shareMineList: [],
		shareEmpList: [],
		otherShareList: [],
		shareList: [],
		totalNum1: 0,
		totalNum2: 0,
		totalNum3: 0,
		totalNum4: 0,

		currentPage1: 0,
		currentPage2: 0,
		currentPage3: 0,
		currentPage4: 0,

		loading1: true,
		loading2: true,
		loading3: true,
		loading4: true,

		searching1: false,
		searching2: false,
		searching3: false,
		searching4: false,
		beansNum: "",
		defaultAvatar: app.globalData.URL + "/static/wechat/img/no_avator.png",
		preffixUrl: app.globalData.URL,
		active: "0",
		hasIDInfo: true,
		type: "", //1从活动页进入
		cndUrl: app.globalData.CDNURL,
	},

	onLoad: function (options) {
		wx.showModal({
			title: "提示",
			content: "本轮经营随e贷转介申请活动奖励已发完，新的活动敬请期待...",
			showCancel: false,
			confirmText: "确定",
		});

		var that = this;
		//1.查询本事是否员工

		that.setData({
			empNo: app.globalData.empNo,
			type: options.type ? options.type : "",
		});

		if (that.data.type == "1") {
			if (that.data.empNo != "") {
				that.setData({
					active: "3",
				});
			} else {
				that.setData({
					active: "2",
				});
			}
		} else {
			that.setData({
				active: 0,
			});
		}

		user
			.getCustomerInfo()
			.then(res => {
				//1.获取豆子数量
				res.RMNG_BEAN = res.RMNG_BEAN ? res.RMNG_BEAN : 0;
				res.AMT_BEAN = res.AMT_BEAN ? res.AMT_BEAN : 0;
				that.setData({
					customerInfo: res,
				});
				//2.判断是否一级
				if (typeof res.REAL_NAME != "undefined") {
					//2.1查询是否为未分发的豆子
					that.findBeans();
				} else {
					//3 未一级认证
					return Promise.reject("unCustomerInfo");
				}

				if (that.data.type == "1") {
					return that.getShareList(that.data.empNo).then(res => {
						if (res) {
							let totalNum = res.totalNum;
							if (res.totalNum != "0") {
								that.readLists2(res.value).then(res => {
									//
									that.setData({
										loading4: false,
										totalNum4: totalNum,
										shareList: res,
									});
								});
							} else {
								that.setData({
									loading4: false,
									totalNum4: totalNum,
									shareList: res.value,
								});
							}
							return Promise.reject("分享列表展示完毕");
						}
					});
				} else {
					return that.getMineShareList(that.data.empNo);
				}
			})
			.then(res => {
				let totalNum = res.totalNum;
				if (res.totalNum != "0") {
					that.readLists(res.value).then(res => {
						that.setData({
							loading1: false,
							totalNum1: totalNum,
							shareMineList: res,
						});
					});
				} else {
					that.setData({
						loading1: false,
						totalNum1: totalNum,
						shareMineList: res.value,
					});
				}
			})
			.catch(err => {
				if (err === "unCustomerInfo") {
					that.setData({
						hasIDInfo: false,
						active: "2",
					});

					that.getShareList(that.data.empNo).then(res => {
						if (res) {
							let totalNum = res.totalNum;
							if (res.totalNum != "0") {
								that.readLists2(res.value).then(res => {
									that.setData({
										loading4: false,
										totalNum4: totalNum,
										shareList: res,
									});
								});
							} else {
								that.setData({
									loading4: false,
									totalNum4: totalNum,
									shareList: res.value,
								});
							}
						}
					});
				} else if (err === "noAwardLists1") {
				}
			});
	},

	onClickDisabled() {
		wx.showToast({
			title: `请先完善个人信息`,
			icon: "none",
		});
	},

	showMore(e) {
		var that = this;
		let type = e.currentTarget.dataset.type;

		if (type == 1) {
			that.setData({
				currentPage1: that.data.currentPage1 + 1,
				searching1: true,
			});
			that.getMineShareList(that.data.empNo).then(res => {
				if (res) {
					that.readLists(res.value).then(res => {
						if (that.data.currentPage1 != 0) {
							res[0].detail = true;
							res[0].height = "0rpx";
						}
						let shareMineList = that.data.shareMineList;
						res.forEach(e => {
							shareMineList.push(e);
						});
						that.setData({
							shareMineList,
							searching1: false,
						});
					});
				}
			});
		} else if (type == 2) {
			that.setData({
				currentPage2: that.data.currentPage2 + 1,
				searching2: true,
			});
			that.getShareEmpList(that.data.empNo).then(res => {
				if (res) {
					that.readLists(res.value).then(res => {
						if (that.data.currentPage2 != 0) {
							res[0].detail = true;
							res[0].height = "0rpx";
						}
						let shareEmpList = that.data.shareEmpList;
						res.forEach(e => {
							shareEmpList.push(e);
						});
						that.setData({
							shareEmpList,
							searching2: false,
						});
					});
				}
			});
		} else if (type == 3) {
			that.setData({
				currentPage3: that.data.currentPage3 + 1,
				searching3: true,
			});
			that.getOtherShareList(that.data.empNo).then(res => {
				if (res) {
					that.readLists(res.value).then(res => {
						if (that.data.currentPage3 != 0) {
							res[0].detail = true;
							res[0].height = "0rpx";
						}
						let otherShareList = that.data.otherShareList;
						res.forEach(e => {
							otherShareList.push(e);
						});
						that.setData({
							otherShareList,
							searching3: false,
						});
					});
				}
			});
		} else if (type == 4) {
			that.setData({
				currentPage4: that.data.currentPage4 + 1,
				searching4: true,
			});
			that.getShareList(that.data.empNo).then(res => {
				if (res) {
					that.readLists2(res.value).then(res => {
						let shareList = that.data.shareList;
						res.forEach(e => {
							shareList.push(e);
						});
						that.setData({
							shareList,
							searching4: false,
						});
					});
				}
			});
		}
	},

	readLists(list) {
		var that = this;
		var data = "";
		return new Promise(function (resolve, reject) {
			list.forEach((e, index) => {
				if (index == "0") {
					e.detail = false;
					e.height = "200rpx";
				} else {
					e.detail = true;
					e.height = "0rpx";
				}
				e.PHOTO = e.PHOTO ? e.PHOTO.replace(/[\r\n]/g, "") : that.data.defaultAvatar;
				let d1 = e.CREATE_DATE;
				let t1 = e.CREATE_TIME ? e.CREATE_TIME : "000000";
                e.APPLY_TYPE_NAME = e.APPLY_TYPE == "14" ? "经营随e贷" : "消费随e贷";
				data = new Date(
					d1.substring(0, 4),
					d1.substring(4, 6) - 1,
					d1.substring(6, 8),
					t1.substring(0, 2),
					t1.substring(2, 4),
					t1.substring(4, 6)
				);
				e.APPLYTIME = that.beautify_time(data.getTime());
				e.CREATE_DATE = d1.substring(0, 4) + "." + d1.substring(4, 6) + "." + d1.substring(6, 8);
				e.UPDATETIME2 = e.UPDATETIME ? that.beautify_time(new Date(e.UPDATETIME.replace(/-/g, "/")).getTime()) : "";
				e.UPDATETIME3 = e.UPDATETIME ? util.formatTime3(new Date(e.UPDATETIME.replace(/-/g, "/"))) : "";

				if (e.SHOW_STATE) {
					switch (e.SHOW_STATE) {
						case "1":
							e.STATUS = "待客户测额";
							break;
						case "2":
							e.STATUS = "测额中";
							break;
						case "3":
							e.STATUS = "待客户确认额度";
							break;
						default:
							break;
					}
				}
				if (e.SHOW_STATE == "4" && e.REWARD_CONTENT_EMP) {
					e.STATUS3 = "不通过";
				}
				if (e.REWARD_CONTENT_EMP && e.SHOW_STATE != "4") {
					e.STATUS3 = "通过";
				}
				if (e.SHOW_STATE == "4" && e.REWARD_CONTENT_REC) {
					e.STATUS4 = "不通过";
				}
				if (e.REWARD_CONTENT_REC && e.SHOW_STATE != "4") {
					e.STATUS4 = "通过";
				}
				if (e.REFUSE_RESAON_EMP && e.REFUSE_RESAON_EMP.indexOf("重复奖励") > -1) {
					e.STATUS3 = "重复申请不奖励";
				}
				if (e.REFUSE_RESAON_EMP && e.REFUSE_RESAON_EMP.indexOf("上限") > -1) {
					e.STATUS3 = "奖励上限";
				}
				if (e.REFUSE_RESAON_EMP && e.REFUSE_RESAON_EMP.indexOf("奖励值为0") > -1) {
					e.STATUS3 = "不符合奖励规则";
				}
				if (e.REFUSE_RESAON_REC && e.REFUSE_RESAON_REC.indexOf("重复奖励") > -1) {
					e.STATUS4 = "重复申请不奖励";
				}
				if (e.REFUSE_RESAON_REC && e.REFUSE_RESAON_REC.indexOf("上限") > -1) {
					e.STATUS4 = "奖励上限";
				}
				if (e.REFUSE_RESAON_REC && e.REFUSE_RESAON_REC.indexOf("奖励值为0") > -1) {
					e.STATUS4 = "不符合奖励规则";
				}

				if (e.CUSTOMER_TYPE == "1") {
					e.STATUS3 = "老客户不奖励";
					e.STATUS4 = "老客户不奖励";
				}

				if (e.REWARD_STATUS == "2") {
					e.STATUS3 = "推荐人未实名";
					e.STATUS4 = "推荐人未实名";
				}

				if (e.REFUSE_RESAON_REC == "总行员工奖励现金") {
					e.REWARD_CONTENT_REC = "0";
				}

				if (e.REFUSE_RESAON_EMP == "总行员工奖励现金") {
					e.REWARD_CONTENT_EMP = "0";
                }
                
                if (e.APPLY_TYPE == "17") {
                    e.APPLY_TYPE_NAME = "手机银行注册"
                    e.STATUS3 = "通过";
                    e.STATUS4 = "通过";
                    e.STATUS = "通过";
                }
			});
			resolve(list);
		});
	},

	readLists2(list) {
		var that = this;
		var data = "";
		return new Promise(function (resolve, reject) {
			list.forEach((e, index) => {
				if (index == "0") {
					e.detail = false;
					e.height = "200rpx";
				} else {
					e.detail = true;
					e.height = "0rpx";
				}

				if (e.REFUSE_RESAON_REC == "总行员工奖励现金") {
					e.REWARD_CONTENT_REC = "0";
				}

				if (e.REFUSE_RESAON_EMP == "总行员工奖励现金") {
					e.REWARD_CONTENT_EMP = "0";
				}

				e.CLICK_PHOTO =
					e.CLICK_PHOTO && e.CLICK_PHOTO != "0" ? e.CLICK_PHOTO.replace(/[\r\n]/g, "") : that.data.defaultAvatar;
				e.APPLY_TYPE_NAME = "";
				if (e.SHARE_WEBSITE == "sub1/pages/consumer/index") {
					e.APPLY_TYPE_NAME = "消费随e贷";
				} else if (e.SHARE_WEBSITE == "sub1/pages/sui/index" || e.SHARE_WEBSITE == "sub1/pages/share/index") {
					e.APPLY_TYPE_NAME = "经营随e贷";
				}else if (e.SHARE_WEBSITE == "sub2/pages/qyBankRegister/index") {
                    e.APPLY_TYPE_NAME = "手机银行注册";
                } else {
					e.APPLY_TYPE_NAME = "随e融";
                }
				let d1 = e.CLICK_TIME;
				data = new Date(
					d1.substring(0, 4),
					d1.substring(4, 6) - 1,
					d1.substring(6, 8),
					d1.substring(8, 10),
					d1.substring(10, 12),
					d1.substring(12, 14)
				);

				e.APPLYTIME = that.beautify_time(data.getTime());
				e.CREATE_DATE = d1.substring(0, 4) + "." + d1.substring(4, 6) + "." + d1.substring(6, 8);
			});
			resolve(list);
		});
	},

	findBeans() {
		let options = {
			url: "share/shuadouzi.do",
			data: JSON.stringify({
				openid: wx.getStorageSync("openid"),
			}),
		};
		return requestYT(options).then(res => {
			console.log("share/shuadouzi.do", res);
		});

		return requestP({
			url: app.globalData.URL + "shuadouzi",
			data: {
				openid: wx.getStorageSync("openid"),
			},
			header: {
				"content-type": "application/json",
				key: Date.parse(new Date()).toString().substring(0, 6),
			},
		}).then(res => {
			if (res.code == "1") {
				return true;
			} else {
				return Promise.reject("/shuadouzi failed" + wx.getStorageSync("openid"));
			}
		});
	},

	copyOrderNo(e) {
		wx.setClipboardData({
			data: e.currentTarget.dataset.orderno,
			success: function (res) {
				wx.showToast({
					title: "订单号复制成功",
					icon: "none",
					duration: 1500,
					mask: false,
				});
			},
		});
	},

	beautify_time(timestamp) {
		var mistiming = Math.round(new Date() / 1000) - timestamp / 1000;
		var postfix = mistiming > 0 ? "前" : "后";
		mistiming = Math.abs(mistiming);
		var arrr = ["天", "小时", "分钟", "秒"];
		var arrn = [86400, 3600, 60, 1];
		for (var i = 0; i < arrr.length; i++) {
			var inm = Math.floor(mistiming / arrn[i]);
			if (inm != 0) {
				if (i == 0 && inm > 6) {
					return "";
				} else {
					return inm + arrr[i] + postfix;
				}
			}
		}
	},

	showPopup() {
		this.setData({ show: true });
	},

	onClose() {
		this.setData({ show: false });
	},

	switchTab(e) {
		var that = this;

		let index = e.detail.index;
		let totalNum = "";
		if (index == "0") {
			if (that.data.loading1) {
				that.getMineShareList(that.data.empNo).then(res => {
					totalNum = res.totalNum;
					if (res) {
						if (res.totalNum != "0") {
							that.readLists(res.value).then(res => {
								that.setData({
									loading1: false,
									totalNum1: totalNum,
									shareMineList: res,
								});
							});
						} else {
							that.setData({
								loading1: false,
								totalNum1: totalNum,
								shareMineList: res.value,
							});
						}
					}
				});
			}
		} else if (index == "1") {
			if (that.data.loading2) {
				that.getShareEmpList(that.data.empNo).then(res => {
					totalNum = res.totalNum;
					if (res) {
						if (res.totalNum != "0") {
							that.readLists(res.value).then(res => {
								that.setData({
									loading2: false,
									totalNum2: totalNum,
									shareEmpList: res,
								});
							});
						} else {
							that.setData({
								loading2: false,
								totalNum2: totalNum,
								shareEmpList: res.value,
							});
						}
					}
				});
			}
		} else if (index == "2") {
			if (that.data.empNo != "") {
				if (that.data.loading3) {
					that.getOtherShareList(that.data.empNo).then(res => {
						if (res) {
							totalNum = res.totalNum;
							if (res.totalNum != "0") {
								that.readLists(res.value).then(res => {
									that.setData({
										loading3: false,
										totalNum3: totalNum,
										otherShareList: res,
									});
								});
							} else {
								that.setData({
									loading3: false,
									totalNum3: totalNum,
									otherShareList: res.value,
								});
							}
						}
					});
				}
			} else {
				if (that.data.loading4) {
					that.getShareList(that.data.empNo).then(res => {
						if (res) {
							totalNum = res.totalNum;
							if (res.totalNum != "0") {
								that.readLists2(res.value).then(res => {
									that.setData({
										loading4: false,
										totalNum4: totalNum,
										shareList: res,
									});
								});
							} else {
								that.setData({
									loading4: false,
									totalNum4: totalNum,
									shareList: res.value,
								});
							}
						}
					});
				}
			}
		} else if (index == "3") {
			if (that.data.loading4) {
				that.getShareList(that.data.empNo).then(res => {
					if (res) {
						totalNum = res.totalNum;
						if (res.totalNum != "0") {
							that.readLists2(res.value).then(res => {
								that.setData({
									loading4: false,
									totalNum4: totalNum,
									shareList: res,
								});
							});
						} else {
							that.setData({
								loading4: false,
								totalNum4: totalNum,
								shareList: res.value,
							});
						}
					}
				});
			}
		}
	},

	showBeanBox() {
		var that = this;

		user
			.getFaceVerify()
			.then(res => {
				this.setData({ showBeanBox: true });
			})
			.catch(err => {
				if (err == "faceUnVerified") {
					wx.showModal({
						title: "",
						content: "请先完成人脸识别",
						showCancel: true,
						cancelText: "取消",
						cancelColor: "#000000",
						confirmText: "确定",
						success: result => {
							if (result.confirm) {
								wx.navigateTo({
									url: "/sub1/pages/info/identify",
								});
							}
						},
						fail: () => {},
						complete: () => {},
					});
				}
			});
	},

	closeBeanBox() {
		this.setData({ showBeanBox: false });
		setTimeout(() => {
			this.setData({ submit: false });
		}, 510);
	},

	/**
	 * Lifecycle function--Called when page show
	 */
	onShow: function () {},

	toMy() {
		var that = this;
		let data = {
			amtBeans: that.data.customerInfo.AMT_BEAN ? that.data.customerInfo.AMT_BEAN : 0,
			rmngBeans: that.data.customerInfo.RMNG_BEAN ? that.data.customerInfo.RMNG_BEAN : 0,
			shareApply: that.data.shareMineList.length ? that.data.shareMineList.length : 0,
		};
		wx.navigateTo({
			url: "my?data=" + JSON.stringify(data),
		});
	},

	showResult(e) {
		if (e.currentTarget.dataset.reason) {
			wx.showToast({
				title: e.currentTarget.dataset.reason,
				icon: "none",
				image: "",
				duration: 1500,
				mask: false,
			});
		}
	},

	showDetail(e) {
		var that = this;
		let index = e.currentTarget.dataset.index;
		let listName = e.currentTarget.dataset.list;
		let list = that.data[listName];
		list[index].detail = !list[index].detail;
		list[index].height = list[index].height == "0rpx" ? "200rpx" : "0rpx";
		that.setData({
			[listName]: list,
		});
	},

	getBeans() {
		var that = this;

		if (that.data.beansNum == "" || that.data.beansNum == "0") {
			wx.showToast({
				title: "请输入要提取的豆子数量",
				icon: "none",
				image: "",
				duration: 1500,
				mask: true,
			});
		} else {
			wx.showLoading({
				title: "提取中",
				mask: true,
			});

			that
				.exchangeBeans()
				.then(res => {
					if (res.code == 1) {
						let customerInfo = that.data.customerInfo;
						customerInfo.RMNG_BEAN = customerInfo.RMNG_BEAN - that.data.beansNum;
						that.setData({
							submit: true,
							getBeanDesc1: "苏银豆积分提取成功",
							getBeanDesc2: customerInfo.RMNG_BEAN,
							customerInfo,
						});
						wx.hideLoading();
					} else {
						wx.hideLoading();
						that.setData({
							submit: true,
							getBeanDesc1: res.msg,
							getBeanDesc2: that.data.customerInfo.RMNG_BEAN,
						});
					}
					that.setData({
						beansNum: "",
					});
				})
				.catch(err => {
					setTimeout(() => {
						wx.hideLoading();
						that.setData({
							submit: true,
							getBeanDesc1: err.msg,
							getBeanDesc2: that.data.customerInfo.RMNG_BEAN,
							beansNum: "",
						});
					}, 2000);
				});
		}
	},

	/**
	 * exchange my beans
	 */
	exchangeBeans() {
		var that = this;

		let options = {
			url: "jsyh/sydtq.do",
			data: JSON.stringify({
                openid: wx.getStorageSync("openid"),
				num: that.data.beansNum.toString(),
			}),
		};
		return requestYT(options).then(res => {
			console.log(res);
			if (res.STATUS === "1" && res.flag) {
				console.log("jsyh/sydtq.do", res);
				return JSON.parse(res.flag);
				let _res = JSON.parse(res.resultVo);
			} else {
				return Promise.reject(res.MSG);
			}
		});
	},

	numInput(e) {
		var that = this;
		let beansNum =
			e.detail.value > that.data.customerInfo.RMNG_BEAN ? that.data.customerInfo.RMNG_BEAN : e.detail.value;
		that.setData({
			beansNum: ~~beansNum,
		});
	},

	getMineShareList() {
		return Order.getShareRecord(this.data.currentPage1 + "", "5", "list1");
	},

	getShareEmpList() {
		return Order.getShareRecord(this.data.currentPage2 + "", "5", "list2");
	},

	getOtherShareList() {
		return Order.getShareRecord(this.data.currentPage3 + "", "5", "list3");
	},
	getShareList() {
		return Order.getShareRecord(this.data.currentPage4 + "", "5", "share");
	},
});
