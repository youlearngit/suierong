import WxValidate from "../../../assets/plugins/wx-validate/WxValidate";
var encr = require("../../utils/encrypt.js"); //国密3段式加密
var aeskey = encr.key; //随机数
//var url = 'http://66.2.41.46:8090/wxgatewaysit/';//电脑测试
//var url = "https://wxapptest.jsbchina.cn:9629/wxgatewaysit/"; //手机测试
//var url = 'https://wxapptest.jsbchina.cn:9629/wxgatewayuat/'; //手机验证环境
var url = "https://appservice.jsbchina.cn/wxgatewayuat/"; //手机生产环境

import user from "../../../utils/user";

const App = getApp();
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		isMouren: "0",
		isXinZeng: "",
		multiIndex: [0, 0, 0], //以下省市选择过度
		multiArray: [],
		//distractInfo: [],// 某个市的区信息
		region: [],
		customItem: "",
		custname: "",
		name: "",
		phone: "",
		address: "",
		idcard: "", //身份证号
		province: "", //省市区
		city: "",
		county: "",
		xuhao: "", //根据这个编辑接口
		isChecked3: false, //为没选中默认
		nickname: "", //昵称
	},

	/* bindMultiPickerChange: function (e) {
    var that = this;
    let multiArray = that.data.multiArray
    let adcode = that.data.distractInfo[e.detail.value[2]].adcode
    let cityName = multiArray[0][e.detail.value[0]] + multiArray[1][e.detail.value[1]] + multiArray[2][e.detail.value[2]]
    //console.log('cityName',cityName)
    that.setData({
      cityName:cityName
    })
  },
  //地区选择
  bindMultiPickerColumnChange: function (e) {
    var column2 = [];
    var that = this;
    var data = {
      multiArray: that.data.multiArray,
      multiIndex: that.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        column2 = []
        let citys = []
        for (var i = 0; i < that.data.objectMultiArray.length; i++) {
          if (that.data.objectMultiArray[i].parid == that.data.objectMultiArray[e.detail.value].regid) {
            column2.push(that.data.objectMultiArray[i].regname);
            citys.push(that.data.objectMultiArray[i])
          }
        }
        that.setData({
          citys
        })
        let adcode = citys[0].regid + "00"
        that.getDistarct(adcode)
        that.setData({
          "multiArray[1]": column2,
        })
        break;
      case 1:
        let code = that.data.citys[e.detail.value].regid + "00"
        that.getDistarct(code)
    }
  },

  getDistarct(code) {
    var that = this
    //console.log('code',code)

    wx.request({
      url: 'https://restapi.amap.com/v3/config/district?keywords=' + code + '&subdistrict=1&key=b529c026d0d07d0f0a18ee75a9c6ebee',
      method: "get",
      success(res) {
        //console.log(res)
        let districts = res.data.districts[0].districts
        let column3 = []
        for (let i = 0; i < districts.length; i++) {
          column3.push(districts[i].name)
        }
        that.setData({
          "multiArray[2]": column3,
          distractInfo: districts
        })
      },
      fail(err) {
        //console.log("获取地区异常",err)
        wx.showToast({
          title: '网络异常，请稍后重试',
          icon: 'none',
          mask: true,
          duration: 2000
        })
      }
    })
  }, */

	bindRegionChange: function (e) {
		//console.log("picker发送选择改变，携带值为", e.detail.value);
		this.setData({
			region: e.detail.value,
			province: e.detail.value[0],
			city: e.detail.value[1],
			county: e.detail.value[2],
		});
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.initValidate(); //验证
		if (options.list != undefined) {
			var list = JSON.parse(options.list);
			if (list.CUST_NAME != undefined) {
				this.setData({
					name: list.REAL_NAME,
					phone: list.TEL,
					address: list.ADDRESS,
					idcard: list.ID_CARD,
					region: list.PROVINCE + list.CITY + list.COUNTY,
					xuhao: list.SERIAL,
					custname: list.CUST_NAME,
					isMouren: list.IS_DEFAULT,
					province: list.PROVINCE,
					city: list.CITY,
					county: list.COUNTY,
				});
				if (list.IS_DEFAULT == "1") {
					this.setData({
						isChecked3: true,
					});
				}
			}
		}
		if (options.custname != undefined) {
			var custname = JSON.parse(options.custname);
			//console.log("成功" + custname);
			this.setData({
				isXinZeng: "1",
				custname: custname,
			});
		}
		user.getCustomerInfo().then(res => {
			this.setData({
				nickname: res.NICK_NAME ? res.NICK_NAME : "",
			});
		});
	},
	changeSwitch3: function (e) {
		if (this.data.isMouren == 1) {
			//默认值 选择
			this.setData({
				isMouren: "0",
			});
		} else {
			this.setData({
				//设置为默认
				isMouren: "1",
			});
		}
	},
	initValidate() {
		// 验证字段的规则
		const rules = {
			name: {
				required: true,
				name: true,
			},
			tel: {
				required: true,
				tel: true,
			},
			idCard: {
				required: true,
				idcard: true,
			},
			address: {
				required: true,
				address: true,
			},
		};

		// 验证字段的提示信息，若不传则调用默认的信息
		const messages = {
			name: {
				required: "请输入寄件人姓名",
				name: "姓名仅支持汉字（8位内）",
			},
			tel: {
				required: "请输入联系电话",
				tel: "请输入正确的联系电话",
			},
			idCard: {
				required: "请输入身份证号码",
				idcard: "请输入正确的身份证号码",
			},
			address: {
				required: "请输入地址",
			},
		};

		// 创建实例对象
		this.WxValidate = new WxValidate(rules, messages);
	},
	showModal(error) {
		wx.showToast({
			title: error.msg,
			icon: "none",
			duration: 2000,
		});
	},
	//保存提交
	submitForm(e) {
		const params = e.detail.value;
		if (!this.WxValidate.checkForm(params)) {
			const error = this.WxValidate.errorList[0];
			this.showModal(error);
			return false;
		}
		if (this.data.region.length == 0) {
			wx.showToast({
				title: "请输入所在地区",
				icon: "none",
				duration: 2000,
			});
			return;
		}
		var that = this;
		var dataJson = JSON.stringify({
			openId: wx.getStorageSync("openid"),
			nickname: that.data.nickname,
			province: that.data.province,
			city: that.data.city,
			county: that.data.county,
			address: e.detail.value.address,
			realname: e.detail.value.name,
			custname: that.data.custname,
			tel: e.detail.value.tel,
			idcard: e.detail.value.idCard,
			isdefault: that.data.isMouren,
			remark1: "1",
			remark2: "1",
			remark3: "1",
			remark4: "1",
			remark5: "1",
		}); //要加密的参数
		var custname = encr.jiami(dataJson, aeskey); //3段加密

		if (that.data.isXinZeng == "1") {
			wx.showLoading({
				title: "保存中...",
			});
			wx.request({
				//新增数据
				url: url + "express/senderInfoIns.do",
				data: encr.gwRequest(custname),
				method: "POST",
				header: {
					"content-type": "application/json", // 默认值x
				},
				success: function (res) {
					var jsonData = encr.aesDecrypt(res.data.body, aeskey); //解密返回的报文
					res.data.body = jsonData;
					wx.hideLoading();
					if (res.data.body.MSG == "交易成功") {
						var custname = JSON.stringify(that.data.custname); //公司名称

						// wx.navigateTo({
						// 	url: "list?custname=" + custname,
						// });
						wx.navigateBack({
							delta: 1,
						});
					} else {
						wx.showToast({
							title: "新增失败",
							icon: "none",
							duration: 2000,
						});
					}
				},
			});
		} else {
			var dataJsonBian = JSON.stringify({
				openId: wx.getStorageSync("openid"),
				nickname: that.data.nickname,
				province: that.data.province,
				city: that.data.city,
				county: that.data.county,
				address: e.detail.value.address,
				realname: e.detail.value.name,
				custname: that.data.custname,
				tel: e.detail.value.tel,
				idcard: e.detail.value.idCard,
				isdefault: that.data.isMouren,
				serial: that.data.xuhao,
			}); //要加密的参数
			var custnameBian = encr.jiami(dataJsonBian, aeskey); //3段加密
			wx.showLoading({
				title: "保存中...",
			});
			wx.request({
				//编辑数据
				url: url + "express/senderInfoUpd.do",
				data: encr.gwRequest(custnameBian),
				method: "POST",
				header: {
					"content-type": "application/json", // 默认值x
				},
				success: function (res) {
					wx.hideLoading();
					var custname = JSON.stringify(that.data.custname); //公司名称
					wx.navigateBack({
						delta: 1,
					});
					// wx.navigateTo({
					// 	url: "list?custname=" + custname,
					// });
				},
			});
		}
	},
	//手写input绑定form值
	blur(e) {
		let idname = e.target.id;
		if (idname == "name") {
			this.setData({
				name: e.detail.value,
			});
		} else if (idname == "phone") {
			this.setData({
				phone: e.detail.value,
			});
		} else if (idname == "idcard") {
			this.setData({
				idcard: e.detail.value,
			});
		} else if (idname == "address") {
			this.setData({
				address: e.detail.value,
			});
		}
	},
	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {},
});
