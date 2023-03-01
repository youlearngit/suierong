// sub3/pages/bbx/staff_list.js
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
		preUrl: app.globalData.URL,
		cndUrl: app.globalData.CDNURL,

		bbx_channel: '',

		location: {},
		location_json: '',
		locData: { name: "获取位置中..." },
		mkData: [],
		mkDataIdx: 0,

		select: 0,
		list: [],
    RCtype:'',
		search_location: {codes:[]},

		search_areas : [
			// {index:'000000',text:'全国',children:[
			// 	{id:'000000',text:'全国'},
			// 	{id:'',text:'不限地区'},
			// ]},
			{index:'320000',text:'江苏省',children:[
				{id:'320000',text:'江苏省'},
				{id:'320100',text:'南京市'},
				{id:'320200',text:'无锡市'},
				{id:'320282',text:'宜兴市'},
				{id:'320281',text:'江阴市'},
				{id:'320300',text:'徐州市'},
				{id:'320400',text:'常州市'},
				{id:'320500',text:'苏州市'},
				{id:'320600',text:'南通市'},
				{id:'320700',text:'连云港市'},
				{id:'320800',text:'淮安市'},
				{id:'320900',text:'盐城市'},
				{id:'321000',text:'扬州市'},
				{id:'321100',text:'镇江市'},
				{id:'321200',text:'泰州市'},
				{id:'321300',text:'宿迁市'},
			]},
			{index:'440000',text:'广东省',children:[
				{id:'440000',text:'广东省'},
				{id:'440300',text:'深圳市'},
			]},
			{index:'330000',text:'浙江省',children:[
				{id:'330000',text:'浙江省'},
				{id:'330100',text:'杭州市'},
			]},
			{index:'310100',text:'上海市',children:[
				{id:'310100',text:'上海市'},
			]},
			{index:'110100',text:'北京市',children:[
				{id:'110100',text:'北京市'},
			]},
		],

		tree_select: { show: false },

		popup_region: { show: false, columns: [] },

	},

	onRegionChange: async function (e) {
		let {detail} = e;
		let {code,value} = detail;
		let search_location = {
			adcode: code[2],
			province: value[0], 
			city: value[1], 
			district: value[2], 
			codes: code,
			values: value,
		}
		this.setData({search_location});

		this.staffByLocation();
	},

	onTreeSelectEvent: async function (e) {
		let {search_areas,tree_select,search_location} = this.data;
		
		switch (e.currentTarget.dataset.event) {
			case 'set_filter_tree_select':{
				this.setData({
					'tree_select.show' : true,
					'tree_select.items' : search_areas,
				});
			}break;
			default:{
				let {type} = e;
				if (type == 'click-nav') {
					let {index} = e.detail;

					this.setData({
						'tree_select.mainActiveIndex' : index,
					});
				} else if (type == 'click-item') {
					let {id} = e.detail;

					let index = tree_select.mainActiveIndex || 0;
					let items = search_areas[index].children;
					let item = items.find((e)=>e.id==id);

					search_location = await utils.getLocationByAdcode(item.id);

					this.setData({
						'tree_select.activeId' : id,
						'tree_select.show' : false,
						search_location,
					});

					this.staffByLocation();
					
				} else {
					this.setData({'tree_select.show' : !this.data.tree_select.show});
				}
			}break;
		}
	},

	onPopupRegionConfirm(e) {
		let region = e.detail.value;
		let {search_location} = this.data;
		
		search_location = {
			adcode: region[2].adcode,
			province: region[0].name,
			city: region[1].name,
			district: region[2].name,
			codes: [ region[0].adcode, region[1].adcode, region[2].adcode ],
			values: [ region[0].name, region[1].name, region[2].name ],
		}

		this.setData({
			'popup_region.show' : false,
			search_location,
		});

		this.staffByLocation();
	},

	onPopupRegionChange: function (e) {
		let { picker, value, index } = e.detail;
		switch (index) {
			case 0:
				picker.setColumnValues(1, value[0].districts);
				picker.setColumnValues(2, value[0].districts[0].districts);
				break;
			case 1:
				let city = value[0].districts.find((e) => e.adcode === value[1].adcode);
				picker.setColumnValues(2, city.districts);
				break;
			default:
				break;
		}
	},

	onPopupRegionEvent: async function (e) {
		let {popup_region,search_location} = this.data;
		switch (e.currentTarget.dataset.event) {
			case 'set_filter_popup_region':{				
				if (!popup_region.columns || popup_region.columns.length==0) {
					let columns = await utils.getRegionCode2();
					this.setData({
						'popup_region.columns' : columns,
					})
				}
				this.setData({
					'popup_region.show' : true,
				});
			}break;
			default:{
				this.setData({'popup_region.show' : !this.data.popup_region.show});
			}break;
		}
	},

	staffByLocation: async function(e) {
		let {list,search_location} = this.data;
		wx.showLoading({
			title: "加载中",
		});
		list = [];
		let res = { LIST:false };
		if (!res.LIST && search_location.codes[2]) {
			res = await talent.selectStaff({ type:1, code:search_location.codes[2] }); // 区专员
		}
		if (!res.LIST && search_location.codes[1]) {
			res = await talent.selectStaff({ type:1, code:search_location.codes[1] }); // 市专员
		}
		if (!res.LIST && search_location.codes[0]) {
			res = await talent.selectStaff({ type:1, code:search_location.codes[0] }); // 省专员
		}
		list = res.LIST || [];
		if (list.length>0) {
			list = utils.repeatArrKey(list,"ID");
			list = list.filter(x=>x.TYPE=='1');
			list = this.listDisplay(list);
		}
		wx.hideLoading();
		this.setData({list});
	},

	phoneCall: function(e) {
		let {phone} = e.currentTarget.dataset;
		if (phone) {
			wx.makePhoneCall({
				phoneNumber: phone,
			})
		}
	},

	bindinput: function(e) {
		let {value} = e.detail;
		if (value) {
			this.staffSearch(value);
		}
	},

	selectTap: async function(e) {
		let {select} = this.data;
		select = e.currentTarget.dataset.id;
		this.setData({ select });
		if (select==2) { return; }
		await this.staffList(select);
	},

	staffSearch: async function(key) {
		let {list,bbx_channel} = this.data;
		let res;

		if (bbx_channel=='320282') {
			list = await talent.tdycStaff();
			if (list.length>0) {
				list.sort(function(x,y){
					return y.TYPE - x.TYPE;
				});
			}
		} else if (bbx_channel=='310000') {
			list = await talent.hjycStaff();
			if (list.length>0) {
				list.sort(function(x,y){
					return y.TYPE - x.TYPE;
				});
			}
		} else {
			res = await talent.slByName(key);
			list = res.LIST || [];
			if (list.length == 0) {
				wx.showToast({
					title: "查找失败，暂无对应专员",
					icon: "none",
				});
			}
		}

		list = this.listDisplay(list);
		this.setData({list});
	},

	staffList: async function(select) {
		let {list,locData,location,bbx_channel} = this.data;	

		wx.showLoading({
			title: "加载中",
		});
		list = [];
		let res;
		let add;

		if (bbx_channel=='320282') {
			list = await talent.tdycStaff();

			if (list.length>0) {
				list.sort(function(x,y){
					return y.TYPE - x.TYPE;
				});
			}
		} else if (bbx_channel=='310000') {
			list = await talent.hjycStaff();
			if (list.length>0) {
				list.sort(function(x,y){
					return y.TYPE - x.TYPE;
				});
			}
		} else {
			if (select == 0) { // 推荐
        // 顺序: 支行专员 > 区专员 > 市专员 > 总行专员
        console.log( {type:1, code:location.codes[2] ,});
        res = await talent.selectStaff({ type:1, code:locData.ORG_CODE, adcode_type:'3' }); // 支行专员
        
        add = await talent.selectStaff({ type:2, code:locData.ORG_CODE, adcode_type:'3' }); // 支行专员
       
				if (!res.LIST) {
					res = await talent.selectStaff({ type:1, code:location.codes[2] }); // 区专员
          
          console.log('add2',add);
        }
        if (!add.LIST) {
          console.log({type:2, code:location.codes[2], adcode_type:'1'});
          add = await talent.selectStaff({ type:2, code:location.codes[2], adcode_type:'1' }); // 区专员
        }
        // if (!add.LIST) {
        //   console.log({type:2, code:location.codes[1], adcode_type:'2'});
        //   add = await talent.selectStaff({ type:2, code:location.codes[1], adcode_type:'1' }); // 区专员
        // }
        
				if (!res.LIST) {
          res = await talent.selectStaff({ type:1, code:location.codes[1] }); // 市专员
          console.log(res);
        }
        
				if (!res.LIST) {
					// res = await talent.selectStaff({ type:5 }); // 总行专员
        }
        if (res.LIST) {
          
          list.push(res.LIST[0])
        }
        if (add.LIST) {
          list.push(add.LIST[0])
            console.log(add.LIST);
        }
        list = list || [];
        this.setData({list});
			}
			if (select == 1) { // 全部
				// 顺序: 支行专员, 区专员, 市专员, 总行专员, 省专员, 其余省
				res = await talent.selectStaff({ type:1, code:locData.ORG_CODE, adcode_type:'3' }); // 支行专员
				list = list.concat(res.LIST || []);

				res = await talent.selectStaff({ type:1, code:location.codes[2] }); // 区专员
				list = list.concat(res.LIST || []);

				res = await talent.selectStaff({ type:1, code:location.codes[1] }); // 市专员
				list = list.concat(res.LIST || []);

				res = await talent.selectStaff({ type:5 }); // 总行专员
				list = list.concat(res.LIST || []);

				// res = await talent.selectStaff({ type:1, code:location.codes[0] }); // 省专员
				// list = list.concat(res.LIST || []);

				let provinces = [110000, 310000, 320000, 330000, 440000]; // 其余省
				provinces = provinces.filter(x=>x!=location.codes[0]);
				for (let i in provinces) {
					res = await talent.selectStaff({ type:1, code:provinces[i] });
					list = list.concat(res.LIST || []);
				}

			}
			if (list.length>0) {
				// list = utils.repeatArrKey(list,"ID");
				// list = list.filter(x=>x.TYPE=='1');
				// if (select == 0) { // 推荐 只取最近一个
				// 	list = list.splice(0,1);
				// }
      }
      console.log('list3',list);
		}
		
		if (list.length>0) {
			list = this.listDisplay(list);
		}
    console.log('list2',list);
		wx.hideLoading();
		this.setData({list});
	},

	listDisplay: function(list) {
		let {mkData} = this.data;

		for (let i in list) {
			list[i].distance_km = 0;
			if (list[i].AGENCYNO) {
				let mk = mkData.find(x=>x.ORG_CODE==list[i].AGENCYNO);
				if (mk) {
					list[i].mk = mk;
					list[i].distance = mk.distance;
					list[i].distance_km = mk.distance_km;
				}
			}
		}

		list.sort(function(x,y){
			return x.distance_km - y.distance_km;
		});

		return list;
	},

	onMkPicker: function(e) {
		let {mkDataIdx,locData,mkData,select} = this.data;
		locData = mkData[mkDataIdx];
		this.setData({locData});
		this.staffList(select);
	},

	initData: async function(options) {
		let {location,location_json,locData,mkData,bbx_channel} = this.data;

		bbx_channel = utils.getBBXChannel().channel;

		// location_json = options.location;
		// location = location_json?JSON.parse(location_json):{};
		// if (!location.adcode) {
			location = await utils.getUserLocation();
			location_json = JSON.stringify(location);
		// }

		for (let page=1;page<3;page++) {
			let res = await talent.getNetwork(page);
			if (res.LIST) {
				mkData = mkData.concat(res.LIST)
			}
			if (!res.NEXT_KEY) {
				break;
			}
		}
		for (let i in mkData) {
			mkData[i].ORG_FULL_NAME = mkData[i].ORG_FULL_NAME.replace(/股份有限公司/g,'');
			if (['江苏银行股份有限公司','江苏银行'].indexOf(mkData[i].ORG_FULL_NAME)>-1) {
				continue;
			}

			if (!mkData[i].LOCATION_LONG_NAVI || !mkData[i].LOCATION_LAT_NAVI) {
				continue;
			}
			mkData[i].distance_km = util.getDistance(
				location.latitude,
				location.longitude,
				mkData[i].LOCATION_LAT_NAVI,
				mkData[i].LOCATION_LONG_NAVI
			);
			mkData[i].distance = util.calcDistance(
				location.longitude,
				location.latitude,
				mkData[i].LOCATION_LONG_NAVI,
				mkData[i].LOCATION_LAT_NAVI
			);
			if (mkData[i].distance_km < 1) {
				mkData[i].distance = parseInt(mkData[i].distance_km*1000) + 'm';
			}
		}
		mkData.sort(function(x,y){
			return x.distance_km - y.distance_km;
		});
		locData = mkData.find(x=>x.distance_km);

		this.setData({location, location_json, mkData, locData, bbx_channel})

		let {select} = this.data;
		this.staffList(select);
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		utils.loadBBXChannelByOptions(options);
		if (options.RCtype) {
      this.setData({
        RCtype :options.RCtype
      })
    }
		this.initData(options);
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
		return utils.shareWithBBXChannel({});
	}
})