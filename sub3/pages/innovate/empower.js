// sub3/pages/innovate/empower.js
var app = getApp();
import utils from './utils';
import innovation from './innovation';

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		preffixUrl: utils.preffixUrl(),
		mine: {},
		nodes_id: "",
		nodes: {},

	},

	showModal(content,suc=()=>{}) {
		wx.hideLoading();
		if(typeof(content)=="object") {
			content = content.currentTarget.dataset.content;
		}
		wx.showModal({
			title: "提示",
			content: content,
			showCancel: false,
			success: suc,
		});
	},

	async empowerFR(e) {
		let {nodes,mine} = this.data;
		let res;
		if (nodes.empower && nodes.empower.res == "suc") {
			return this.showModal("您已授权成功");
		}
		wx.showLoading({
            title: '授权中',
            mask: true,
		});

		if (!nodes.enterprise) { nodes.enterprise = {} }
		nodes.enterprise.frxm = mine.REAL_NAME || "";
		nodes.enterprise.frphone = mine.TEL || "";
		nodes.enterprise.frzjlx = "居民身份证";
		nodes.enterprise.frzjhm = mine.ID_CARD || "";

		if (!nodes.empower) { nodes.empower = {} }
		if (!nodes.empower.pdf_path) {
			nodes = await this.nodesPdf(nodes);
		}
		nodes.empower.res = "suc";

		wx.hideLoading()
		this.setData({ nodes });

		await this.nodesSave();
		
		wx.navigateTo({
			url: '/sub3/pages/innovate/empower_res',
		})
	},

	async readPdf(e) {
		let {nodes} = this.data;
		let res;

		wx.showLoading({
            title: '打开中',
            mask: true,
		});

		if (!nodes.empower) { nodes.empower = {} }
		if (!nodes.empower.pdf_path) {
			nodes = await this.nodesPdf(nodes);
		}

		res = await innovation.readPdf({POLICYPDF:nodes.empower.pdf_path});
		let pdf = res.PDF;
		
		let filePath = wx.env.USER_DATA_PATH + "/" + "企业信息采集和查询授权书" + ".pdf";
		let fileData = pdf;

		if (!fileData) {
			wx.hideLoading();
			wx.showToast({
				title: '下载异常',
				icon: 'none'
			});
			return;
		}

		wx.getFileSystemManager().writeFile({
			filePath: filePath,
			data: fileData,
			encoding: 'base64',
			success: res => {
				wx.hideLoading();
				wx.showToast({
					title: '下载成功'+filePath,
					icon: 'none',
					duration: 1500
				});
				
				wx.openDocument({
					filePath: filePath,
					fileType: 'pdf',
					success: function(res) {
					},
					fail: function(err) {
						wx.showToast({
							title: '查看失败'+err,
							icon: 'none'
						});
					},
				})
			},
			fail: err => {
				wx.hideLoading();
				wx.showToast({
					title: '下载失败',
					icon: 'none'
				});
			}
		})

		// wx.navigateTo({
		// 	url: '/sub3/pages/innovate/read',
		// })

	},

	async nodesPdf(nodes) {
		let {mine} = this.data;
		let res;
		if (!nodes.empower) { nodes.empower = {} }
		if (!nodes.empower.pdf_path) {
			if (!nodes.enterprise) { nodes.enterprise = {} }
			if (mine.REAL_NAME != nodes.enterprise.frxm) {
				this.showModal("非法人打开失败");
				return nodes;
			}
			res = await innovation.empowerSignature({
				USCI: nodes.enterprise.usci, 
				DWMC: nodes.enterprise.dwmc,
				sqname: nodes.enterprise.dwmc,
				frIdCard: mine.ID_CARD || nodes.enterprise.frzjhm,
			});
			nodes.empower.pdf_path = res.pdfPath;
			nodes.empower.batch_id = res.BatchID;
		}
		return nodes;
	},

	async nodesSave(e) {
		let {nodes,mine} = this.data;
		let res;

		nodes.updated = Date.parse(new Date()) / 1000;
		res = await innovation.createOrder({
			OPENID: mine.OPEN_ID, 
			IDString: nodes.id || "", 
			USCI: nodes.enterprise ? (nodes.enterprise.usci || "") : "", 
			DWMC: nodes.enterprise ? (nodes.enterprise.dwmc || "") : "", 
			REMARK1: JSON.stringify(nodes), 
			REMARK2: "",
			BATCHID: nodes.empower ? (nodes.empower.batch_id || "") : "",
			STATUS: "0",
		})
		if (res.IDID) {
			nodes.id = res.IDID;
		}
		this.setData({nodes})
	},

	async nodesLoad(e) {
		let {mine,nodes,nodes_id} = this.data;
		let res;
		if (!nodes_id) {
			return this.showModal("无效的申领");
		}
		res = await innovation.selectByUsci({IDString:nodes_id})
		nodes = JSON.parse(res.REMARK1);
		if (!nodes) {
			return this.showModal("无效的申领数据");
		}
		if (!nodes.mode || nodes.mode!="nofr") { // fr-法人模式 nofr-非法人模式
			return this.showModal("无效的申领模式");
		}
		try {
			res = await innovation.getBusInfo({
				type: "5",
				companyName: nodes.enterprise.dwmc,
				checkIdcard: mine.ID_CARD,
				checkName: mine.REAL_NAME,
			})
			if (res.check_result == "0") {
				return this.showModal("您不是该企业的法人");
			}
		} catch (err) {
			return this.showModal("您不是该企业的法人");
		}
		if (nodes.empower && nodes.empower.res == "suc") {
			this.showModal("您已授权成功");
		}

		nodes.created_text = nodes.created ? Date.DateFormat(new Date(nodes.created*1000),'yyyy.MM.dd') : '';
		this.setData({nodes});
	},

	authIndex(e) {
		wx.showModal({
			title: '提示',
			content: '请您先录入个人信息',
			showCancel: false,
			success: function(res) {
				if (res.confirm) {
					wx.navigateTo({
						url: '/sub1/pages/auth/index',
					})
				} else {
					wx.navigateBack({
						// delta: 1,
					})
				}
			}
		});
	},

	async mineLoad(e) {
		let {mine} = this.data;
		mine = await innovation.getMine();
		// ID_CARD INT_ID NICK_NAME OPEN_ID REAL_NAME TEL
		if (!mine.REAL_NAME) {
			this.authIndex();
		}
		this.setData({mine});
	},

	async dataLoad(e) {
		await this.mineLoad();
		await this.nodesLoad();
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let {id} = options; // id: 暂存id
		let {nodes_id} = this.data;
		
		if (!id) {
			this.showModal("无效的授权");
			return;
		}

		nodes_id = id;
		this.setData({nodes_id});
		this.dataLoad();
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})