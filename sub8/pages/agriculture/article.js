// sub3/pages/bbx/article.js
var app = getApp();
import utils from './utils';
import talent from './talent';
var util = require("../../../utils/util.js");
import api from '../../../utils/api';

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		preffixUrl: utils.preffixUrl(),
    cndUrl: app.globalData.CDNURL,
		bbx_channel: '',

		article: {},
		staffs: [],
		
	},

	getStaffs: async function(code) {
		let {bbx_channel} = this.data;
		let res;
		let list = [];
		
		if (bbx_channel=='320282') {
			list = await talent.tdycStaff();
		} else {
			let codes = [];
			if (!code) {
				let location = await utils.getUserLocation();
				codes = location.codes;
				codes = codes.reverse();
			} else if (code == '000000') {
				codes = [110000, 310000, 320000, 330000, 440000]; // 库中所有省
			} else {
				if (code.substr(2)=='0000') {
					codes = [code];
				} else if (code.substr(4)=='00') {
					codes = [code, code.substr(0,2)+'0000'];
				} else {
					codes = [code, code.substr(0,4)+'00', code.substr(0,2)+'0000'];
				}
			}
			for (let i in codes) {
				res = await talent.selectStaff({ type:2, code:codes[i] });
				list = list.concat(res.LIST || []);
			}
			list = list.filter(x=>x.TYPE=='2');
			list = list.splice(0,1);
		}
		
		return list;
	},
  formatPic: function (pic) {
    if (!pic) return pic
    if (pic.indexOf('<img') < 0) {
      pic = pic.replace(/<p([\s\w"=\/\.:;]+)((?:(style="[^"]+")))/ig, '<p')
        .replace(/<p([\s\w"=\/\.:;]+)((?:(class="[^"]+")))/ig, '<p')
        .replace(/<p>/ig, '<p class="text_class">')
        .replace(/\s{2,}/ig, ' ')
        .replace(/<span([\s\w"-=\/\.:;]+)((?:(style="[^"]+")))/ig, '<span$1')
        .replace(/<table([\s\w"=\/\.:;]+)((?:(style="[^"]+")))/ig, '<table')
        .replace(/<td([\s\w"-=\/\.:;]+)((?:(style="[^"]+")))/ig, '<td$1')
        .replace(/<table/gi, '<table border="1"  style="border-collapse:collapse;border-top: 1px solid ; border-left: 1px solid ; width: 100%;"')
        .replace(/<th/gi, '<th style="border-right: 1px solid ; border-bottom: 1px solid ;"')
        .replace(/<td/gi, '<td style="border-right: 1px solid ; border-bottom: 1px solid ;"')
    } else  {
      pic = pic.replace(/<p([\s\w"=\/\.:;]+)((?:(style="[^"]+")))/ig, '<p')
        .replace(/<p([\s\w"=\/\.:;]+)((?:(class="[^"]+")))/ig, '<p')
        .replace(/<table([\s\w"=\/\.:;]+)((?:(style="[^"]+")))/ig, '<table')
        .replace(/<td([\s\w"-=\/\.:;]+)((?:(style="[^"]+")))/ig, '<td$1')
        // .replace(/<table/gi, '<table border="1"  style="border-top: 1px solid;border-left: 1px solid;border-right: 1px solid; width: 100%;"')
        .replace(/<table/gi, '<table border="1"  style="border-collapse:collapse;border-top: 1px solid ; border-left: 1px solid ; width: 100%;"')
        .replace(/<th/gi, '<th style="border-right: 1px solid ; border-bottom: 1px solid ;"')
        .replace(/<td/gi, '<td style="border-right: 1px solid ; border-bottom: 1px solid ;"')


        // .replace(/<p>/ig, '<p class="p_class">')
        // .replace(/<img([\s\w"-=\/\.:;]+)((?:(height="[^"]+")))/ig, '<img$1')
        // .replace(/<img([\s\w"-=\/\.:;]+)((?:(width="[^"]+")))/ig, '<img$1')
        .replace(/<img([\s\w"-=\/\.:;]+)((?:(style="[^"]+")))/ig, '<img$1')
        .replace(/<img([\s\w"-=\/\.:;]+)((?:(word_img="[^"]+")))/ig, '<img$1')
        .replace(/<img([\s\w"-=\/\.:;]+)((?:(hspace="[^"]+")))/ig, '<img$1')
        .replace(/<img([\s\w"-=\/\.:;]+)((?:(background="[^"]+")))/ig, '<img$1')
        .replace(/<img([\s\w"-=\/\.:;]+)((?:(alt="[^"]+")))/ig, '<img$1')
        // .replace(/<span([\s\w"-=\/\.:;]+)((?:(margin-top="[^"]+")))/ig, '<span$1')
        // .replace(/<span([\s\w"-=\/\.:;]+)((?:(margin-left="[^"]+")))/ig, '<span$1')
        .replace(/<span([\s\w"-=\/\.:;]+)((?:(style="[^"]+")))/ig, '<span$1')
        .replace(/<span([\s\w"-=\/\.:;]+)((?:(alt="[^"]+")))/ig, '<span$1')
        .replace(/<span/gi, '<span style="margin: 0 auto;" ')
        .replace(/<img/gi, '<img width=95% style="width: 355px !importan;margin-top: 16px auto;height:150px !importan;display:block;margin: 0 auto;"')
        .replace(/\s{2,}/ig, '')
    }
    return pic
  },
	getData: async function(ID) {
		if (!ID) {
			return;
		}

		let {article,staffs,bbx_channel} = this.data;
		let res;

		wx.showLoading({
		  	title: '加载中',
		})

		bbx_channel = utils.getBBXChannel().channel;
		this.setData({ bbx_channel });
		console.log(
      ID
    );
    let data = {
      id:ID
    }
    res = await talent.getPolicy(data);
    console.log(res);
		if (res) {
      if (this.data.POLICY_CATEGORY) {
        res.POLICY_CATEGORY = this.data.POLICY_CATEGORY
      } else {
        res.POLICY_CATEGORY = res.POLICY_CATEGORY.split(',')[0]
      }
      if (res.SUPPORT_OBJECT) {
        res.SUPPORT_OBJECT = this.formatPic(res.SUPPORT_OBJECT)
      }
      if (res.POLICY_CONTENT) {
        res.POLICY_CONTENT = this.formatPic(res.POLICY_CONTENT)
      }
      if (res.POLICY_BASIS) {
        res.POLICY_BASIS = this.formatPic(res.POLICY_BASIS)
      }
      if (res.INDUSTRY_LABEL) {
        res.INDUSTRY_LABEL = res.INDUSTRY_LABEL.split(',')
        console.log( res.INDUSTRY_LABEL);
      }
      
			article = res;
		}
    console.log(article);
		this.setData({ article });

		wx.hideLoading();

		staffs = await this.getStaffs(article.AREA);
		this.setData({ staffs });
		
	},

	phoneCall: function(e) {
		let {phone} = e.currentTarget.dataset;
		if (phone) {
			wx.makePhoneCall({
				phoneNumber: phone,
			})
		}
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		utils.loadBBXChannelByOptions(options);

		let {ID,POLICY_CATEGORY} = options;
    this.getData(ID);
    
    this.setData({
      POLICY_CATEGORY:POLICY_CATEGORY
    })
	},

	downloadPdf: async function () {
		let that = this;
		let {article} = this.data;

		if (!article.PDF_PATH) {
			return;
		}

		wx.showLoading({
            title: '下载中',
            mask: true,
		});

		let res = await talent.readPdf(article.PDF_PATH);
		let pdf = res.PDF;
		
		let filePath = wx.env.USER_DATA_PATH + '/' + article.POLICY_NAME + '.pdf';
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
          showMenu:true,
					success: function(res) {
            console.log(res);
					},
					fail: function(err) {
            console.log(err);
						wx.showToast({
							title: '查看失败'+err,
							icon: 'none'
						});
					},
				})
			},
			fail: err => {
        console.log(err);
				wx.hideLoading();
				wx.showToast({
					title: '下载失败',
					icon: 'none'
				});
			}
		})

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
		let {article} = this.data;
		return utils.shareWithBBXChannel({
			params: `&channel=${utils.getBBXChannel().track_channel}&ID=${article.ID}`,
		});
	}

})