// sub1/pages/account/index.js
var app = getApp();
var that;
Page({
	/**
	 * Page initial data A D B C EFG
	 */
	data: {
		cdnUrl: app.globalData.URL,
		arr: [1, 2, 3],
		arr2: ["基本户", "一般存款账户", "临时存款账户（注册验资）", "临时存款账户（其他）", "专用存款账户"],
		selectedItems: {},
		stateListJB: [{
			item3: 0,
			item4: 0,
			item5: 1,
			item6: 0,
			item7: 1,
		}, {
			item3: 0,
			item4: 0,
			item5: 0,
			item6: 0,
			item7: 1,
		}, {
			item3: 0,
			item4: 0,
			item5: 1,
			item6: 0,
			item7: 0,
		}, {
			item3: 0,
			item4: 0,
			item5: 0,
			item6: 0,
			item7: 0,
		}, {
			item3: 0,
			item4: 1,
			item5: 1,
			item6: 0,
			item7: 1,
		},
		 {
			item3: 0,
			item4: 1,
			item5: 0,
			item6: 0,
			item7: 1,
		}, {
			item3: 1,
			item4: 0,
			item5: 0,
			item6: 0,
			item7: 1,
		}, 
		{
			item3: 1,
			item4: 0,
			item5: 1,
			item6: 0,
			item7: 1,
		},{
			item3: 0,
			item4: 1,
			item5: 1,
			item6: 0,
			item7: 0,
		},
		{
			item3: 0,
			item4: 1,
			item5: 0,
			item6: 0,
			item7: 0,
		},
		{
			item3: 1,
			item4: 0,
			item5: 0,
			item6: 0,
			item7: 0,
		}, 
		{
			item3: 1,
			item4: 0,
			item5: 1,
			item6: 0,
			item7: 0,
		},{
			item3: 1,
			item4: 1,
			item5: 1,
			item6: 0,
			item7: 1,
		}, {
			item3: 1,
			item4: 1,
			item5: 0,
			item6: 0,
			item7: 1,
		}, {
			item3: 1,
			item4: 1,
			item5: 1,
			item6: 0,
			item7: 0,
		}, {
			item3: 1,
			item4: 1,
			item5: 0,
			item6: 0,
			item7: 0,
		}, ],
		stateListYB: [{
			item3: 0,
			item4: 0,
			item5: 1,
			item6: 0,
			item7: 1,
		}, {
			item3: 0,
			item4: 0,
			item5: 0,
			item6: 0,
			item7: 1,
		}, {
			item3: 0,
			item4: 0,
			item5: 1,
			item6: 0,
			item7: 0,
		}, {
			item3: 0,
			item4: 0,
			item5: 0,
			item6: 0,
			item7: 0,
		}, {
			item3: 0,
			item4: 1,
			item5: 1,
			item6: 0,
			item7: 1,
		},
		{
			item3: 0,
			item4: 1,
			item5: 0,
			item6: 0,
			item7: 1,
		}, {
			item3: 1,
			item4: 0,
			item5: 0,
			item6: 0,
			item7: 1,
		}, 
		{
			item3: 1,
			item4: 0,
			item5: 1,
			item6: 0,
			item7: 1,
		},{
			item3: 0,
			item4: 1,
			item5: 1,
			item6: 0,
			item7: 0,
		},
		{
			item3: 0,
			item4: 1,
			item5: 0,
			item6: 0,
			item7: 0,
		}, {
			item3: 1,
			item4: 0,
			item5: 0,
			item6: 0,
			item7: 0,
		},
		{
			item3: 1,
			item4: 0,
			item5: 1,
			item6: 0,
			item7: 0,
		}, {
			item3: 1,
			item4: 1,
			item5: 1,
			item6: 0,
			item7: 1,
		}, {
			item3: 1,
			item4: 1,
			item5: 0,
			item6: 0,
			item7: 1,
		}, {
			item3: 1,
			item4: 1,
			item5: 1,
			item6: 0,
			item7: 0,
		}, {
			item3: 1,
			item4: 1,
			item5: 0,
			item6: 0,
			item7: 0,
		}],
		stateListLS: [{
			item3: 0,
			item4: 0,
			item5: 1,
			item6: 0,
			item7: 1,
		}, {
			item3: 0,
			item4: 0,
			item5: 0,
			item6: 0,
			item7: 1,
		}, {
			item3: 0,
			item4: 0,
			item5: 1,
			item6: 0,
			item7: 0,
		}, {
			item3: 0,
			item4: 0,
			item5: 0,
			item6: 0,
			item7: 0,
		}, {
			item3: 0,
			item4: 1,
			item5: 1,
			item6: 0,
			item7: 1,
		}, {
			item3: 0,
			item4: 1,
			item5: 0,
			item6: 0,
			item7: 1,
		},
		 {
			item3: 1,
			item4: 0,
			item5: 0,
			item6: 0,
			item7: 1,
		},
		{
			item3: 1,
			item4: 0,
			item5: 1,
			item6: 0,
			item7: 1,
		}, {
			item3: 0,
			item4: 1,
			item5: 1,
			item6: 0,
			item7: 0,
		}, 
		{
			item3: 0,
			item4: 1,
			item5: 0,
			item6: 0,
			item7: 0,
		},{
			item3: 1,
			item4: 0,
			item5: 0,
			item6: 0,
			item7: 0,
		},
		{
			item3: 1,
			item4: 0,
			item5: 1,
			item6: 0,
			item7: 0,
		}, {
			item3: 1,
			item4: 1,
			item5: 1,
			item6: 0,
			item7: 1,
		}, {
			item3: 1,
			item4: 1,
			item5: 0,
			item6: 0,
			item7: 1,
		}, {
			item3: 1,
			item4: 1,
			item5: 1,
			item6: 0,
			item7: 0,
		}, {
			item3: 1,
			item4: 1,
			item5: 0,
			item6: 0,
			item7: 0,
		}],
		stateListQT: [{
			item3: 0,
			item4: 0,
			item5: 1,
			item6: 0,
			item7: 1,
		}, {
			item3: 0,
			item4: 0,
			item5: 0,
			item6: 0,
			item7: 1,
		}, {
			item3: 0,
			item4: 0,
			item5: 1,
			item6: 0,
			item7: 0,
		}, {
			item3: 0,
			item4: 0,
			item5: 0,
			item6: 0,
			item7: 0,
		}, {
			item3: 0,
			item4: 1,
			item5: 1,
			item6: 0,
			item7: 1,
		}, 
		{
			item3: 0,
			item4: 1,
			item5: 0,
			item6: 0,
			item7: 1,
		},{
			item3: 1,
			item4: 0,
			item5: 0,
			item6: 0,
			item7: 1,
		}, 
		{
			item3: 1,
			item4: 0,
			item5: 1,
			item6: 0,
			item7: 1,
		},{
			item3: 0,
			item4: 1,
			item5: 1,
			item6: 0,
			item7: 0,
		}, 
		{
			item3: 0,
			item4: 1,
			item5: 0,
			item6: 0,
			item7: 0,
		},{
			item3: 1,
			item4: 0,
			item5: 0,
			item6: 0,
			item7: 0,
		}, 
		{
			item3: 1,
			item4: 0,
			item5: 1,
			item6: 0,
			item7: 0,
		},{
			item3: 1,
			item4: 1,
			item5: 1,
			item6: 0,
			item7: 1,
		}, {
			item3: 1,
			item4: 1,
			item5: 0,
			item6: 0,
			item7: 1,
		}, {
			item3: 1,
			item4: 1,
			item5: 1,
			item6: 0,
			item7: 0,
		}, {
			item3: 1,
			item4: 1,
			item5: 0,
			item6: 0,
			item7: 0,
		}],
		stateListZY: [{
			item3: 0,
			item4: 0,
			item5: 1,
			item6: 0,
			item7: 1,
		}, {
			item3: 0,
			item4: 0,
			item5: 0,
			item6: 0,
			item7: 1,
		}, {
			item3: 0,
			item4: 0,
			item5: 1,
			item6: 0,
			item7: 0,
		}, {
			item3: 0,
			item4: 0,
			item5: 0,
			item6: 0,
			item7: 0,
		}, {
			item3: 0,
			item4: 1,
			item5: 1,
			item6: 0,
			item7: 1,
		},
		{
			item3: 0,
			item4: 1,
			item5: 0,
			item6: 0,
			item7: 1,
		},
		{
			item3: 1,
			item4: 0,
			item5: 0,
			item6: 0,
			item7: 1,
		},
		{
			item3: 1,
			item4: 0,
			item5: 1,
			item6: 0,
			item7: 1,
		}, {
			item3: 0,
			item4: 1,
			item5: 1,
			item6: 0,
			item7: 0,
		}, 
		{
			item3: 0,
			item4: 1,
			item5: 0,
			item6: 0,
			item7: 0,
		},{
			item3: 1,
			item4: 0,
			item5: 0,
			item6: 0,
			item7: 0,
		}, 
		{
			item3: 1,
			item4: 0,
			item5: 1,
			item6: 0,
			item7: 0,
		},{
			item3: 1,
			item4: 1,
			item5: 1,
			item6: 0,
			item7: 1,
		}, {
			item3: 1,
			item4: 1,
			item5: 0,
			item6: 0,
			item7: 1,
		}, {
			item3: 1,
			item4: 1,
			item5: 1,
			item6: 0,
			item7: 0,
		}, {
			item3: 1,
			item4: 1,
			item5: 0,
			item6: 0,
			item7: 0,
		}, {
			item3: 0,
			item4: 0,
			item5: 1,
			item6: 1,
			item7: 1,
		}, {
			item3: 0,
			item4: 0,
			item5: 0,
			item6: 1,
			item7: 1,
		}, {
			item3: 0,
			item4: 0,
			item5: 1,
			item6: 1,
			item7: 0,
		}, {
			item3: 0,
			item4: 0,
			item5: 0,
			item6: 1,
			item7: 0,
		}, {
			item3: 0,
			item4: 1,
			item5: 1,
			item6: 1,
			item7: 1,
		}, 
		{
			item3: 0,
			item4: 1,
			item5: 0,
			item6: 1,
			item7: 1,
		},{
			item3: 1,
			item4: 0,
			item5: 0,
			item6: 1,
			item7: 1,
		}, 
		{
			item3: 1,
			item4: 0,
			item5: 1,
			item6: 1,
			item7: 1,
		},{
			item3: 0,
			item4: 1,
			item5: 1,
			item6: 1,
			item7: 0,
		}, 
		{
			item3: 0,
			item4: 1,
			item5: 0,
			item6: 1,
			item7: 0,
		},{
			item3: 1,
			item4: 0,
			item5: 0,
			item6: 1,
			item7: 0,
		},
		{
			item3: 1,
			item4: 0,
			item5: 1,
			item6: 1,
			item7: 0,
		}, {
			item3: 1,
			item4: 1,
			item5: 1,
			item6: 1,
			item7: 1,
		}, {
			item3: 1,
			item4: 1,
			item5: 0,
			item6: 1,
			item7: 1,
		}, {
			item3: 1,
			item4: 1,
			item5: 1,
			item6: 1,
			item7: 0,
		}, {
			item3: 1,
			item4: 1,
			item5: 0,
			item6: 1,
			item7: 0,
		}],
	},

	/**
	 * Lifecycle function--Called when page load
	 */
	onLoad: function (options) {
		that = this;
		this.setData({
			selectedItems: JSON.parse(options.data),
		});
		let accountList = {}
		for (let index = 1; index < 29; index++) {
			let item = 'k' + index
			accountList[item] = 0
		}
		let demandList = {}
		for (let index = 1; index < 11; index++) {
			let item = 'd' + index
			demandList[item] = 0
		}
		that.setData({
			accountList,
			demandList
		})
		Object.prototype.equal = function (obj) {
			var props1 = Object.getOwnPropertyNames(this);
			var props2 = Object.getOwnPropertyNames(obj);
			if (props1.length != props2.length) {
				return false;
			}
			for (var i = 0, max = props1.length; i < max; i++) {
				var propName = props1[i];
				if (this[propName] !== obj[propName]) {
					return false;
				}
			}
			return true;
		}

		let items = JSON.parse(options.data)
		delete items.item1
		delete items.item2
		this.setData({
			filiterItems: items,
		});
		if (that.data.selectedItems.item2 == '0') {
			let index = that.data.stateListJB.findIndex((item, index) => {
				return item.equal(items);
			})
			switch (index) {
				case 0:
					that.setData({
						'accountList.k1': 1,
						'accountList.k2': 1,
						'accountList.k3': 1,
						'accountList.k4': 1,
						'accountList.k5': 1,
						'accountList.k6': 1,
						'accountList.k7': 1,
						'accountList.k8': 1,
						'accountList.k10': 1,
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
						'demandList.d4': 1
					})
					break;
				case 1:
					that.setData({
						'accountList.k1': 1,
						'accountList.k2': 1,
						'accountList.k3': 1,
						'accountList.k4': 1,
						'accountList.k5': 1,
						'accountList.k6': 1,
						'accountList.k7': 1,
						'accountList.k8': 1,
						'accountList.k10': 1,
						'accountList.k11': 1,
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
						'demandList.d4': 1
					})
					break;
				case 2:
					that.setData({
						'accountList.k1': 1,
						'accountList.k2': 1,
						'accountList.k3': 1,
						'accountList.k4': 1,
						'accountList.k5': 1,
						'accountList.k6': 1,
						'accountList.k7': 1,
						'accountList.k8': 1,
						'accountList.k10': 1,
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
						'accountList.k23': 1,
						'demandList.d4': 1,
						'demandList.d6': 1,
						'demandList.d7': 1,
						'demandList.d8': 1
					})
					break;
				case 3:
					that.setData({
						'accountList.k1': 1,
						'accountList.k2': 1,
						'accountList.k3': 1,
						'accountList.k4': 1,
						'accountList.k5': 1,
						'accountList.k6': 1,
						'accountList.k7': 1,
						'accountList.k8': 1,
						'accountList.k10': 1,
						'accountList.k11': 1,
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
						'accountList.k23': 1,
						'demandList.d4': 1,
						'demandList.d6': 1,
						'demandList.d7': 1,
						'demandList.d8': 1
					})
					break;
				case 4:
					that.setData({
						'accountList.k1': 1,
						'accountList.k2': 1,
						'accountList.k3': 1,
						'accountList.k4': 1,
						'accountList.k5': 1,
						'accountList.k6': 1,
						'accountList.k7': 1,
						'accountList.k8': 1,
						'accountList.k10': 1,
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
						'accountList.k20': 1,
						'accountList.k21': 1,
						'demandList.d2': 1,
						'demandList.d4': 1
					})
					break;
				case 5:
						that.setData({
							'accountList.k1': 1,
							'accountList.k2': 1,
							'accountList.k3': 1,
							'accountList.k4': 1,
							'accountList.k5': 1,
							'accountList.k6': 1,
							'accountList.k7': 1,
							'accountList.k8': 1,
							'accountList.k10': 1,
							'accountList.k11': 1,
							'accountList.k12': 1,
							'accountList.k13': 1,
							'accountList.k14': 1,
							'accountList.k15': 1,
							'accountList.k16': 1,
							'accountList.k17': 1,
							'accountList.k20': 1,
							'accountList.k21': 1,
							'demandList.d2': 1,
							'demandList.d4': 1
						})
						break;
				case 6:
					that.setData({
						'accountList.k1': 1,
						'accountList.k2': 1,
						'accountList.k3': 1,
						'accountList.k4': 1,
						'accountList.k5': 1,
						'accountList.k6': 1,
						'accountList.k7': 1,
						'accountList.k8': 1,
						'accountList.k10': 1,
						'accountList.k11': 1,
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
						'accountList.k20': 1,
						'accountList.k21': 1,
						'demandList.d2': 1,
						'demandList.d4': 1
					})
					break;
					case 7:
						that.setData({
							'accountList.k1': 1,
							'accountList.k2': 1,
							'accountList.k3': 1,
							'accountList.k4': 1,
							'accountList.k5': 1,
							'accountList.k6': 1,
							'accountList.k7': 1,
							'accountList.k8': 1,
							'accountList.k10': 1,
							'accountList.k12': 1,
							'accountList.k13': 1,
							'accountList.k14': 1,
							'accountList.k15': 1,
							'accountList.k16': 1,
							'accountList.k17': 1,
							'accountList.k20': 1,
							'accountList.k21': 1,
							'demandList.d2': 1,
							'demandList.d4': 1
						})
						break;
				case 8:
					that.setData({
						'accountList.k1': 1,
						'accountList.k2': 1,
						'accountList.k3': 1,
						'accountList.k4': 1,
						'accountList.k5': 1,
						'accountList.k6': 1,
						'accountList.k7': 1,
						'accountList.k8': 1,
						'accountList.k10': 1,
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
						'accountList.k20': 1,
						'accountList.k21': 1,
						'accountList.k23': 1,
						'demandList.d2': 1,
						'demandList.d4': 1,
						'demandList.d6': 1,
						'demandList.d7': 1,
						'demandList.d8': 1
					})
					break;
					case 9:
						that.setData({
							'accountList.k1': 1,
							'accountList.k2': 1,
							'accountList.k3': 1,
							'accountList.k4': 1,
							'accountList.k5': 1,
							'accountList.k6': 1,
							'accountList.k7': 1,
							'accountList.k8': 1,
							'accountList.k10': 1,
							'accountList.k11': 1,
							'accountList.k12': 1,
							'accountList.k13': 1,
							'accountList.k14': 1,
							'accountList.k15': 1,
							'accountList.k16': 1,
							'accountList.k17': 1,
							'accountList.k20': 1,
							'accountList.k21': 1,
							'accountList.k23': 1,
							'demandList.d2': 1,
							'demandList.d4': 1,
							'demandList.d6': 1,
							'demandList.d7': 1,
							'demandList.d8': 1
						})
						break;
				case 10:
					that.setData({
						'accountList.k1': 1,
						'accountList.k2': 1,
						'accountList.k3': 1,
						'accountList.k4': 1,
						'accountList.k5': 1,
						'accountList.k6': 1,
						'accountList.k7': 1,
						'accountList.k8': 1,
						'accountList.k10': 1,
						'accountList.k11': 1,
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
						'accountList.k20': 1,
						'accountList.k21': 1,
						'accountList.k23': 1,
						'demandList.d2': 1,
						'demandList.d4': 1,
						'demandList.d6': 1,
						'demandList.d7': 1,
						'demandList.d8': 1
					})
					break;
					case 11:
						that.setData({
							'accountList.k1': 1,
							'accountList.k2': 1,
							'accountList.k3': 1,
							'accountList.k4': 1,
							'accountList.k5': 1,
							'accountList.k6': 1,
							'accountList.k7': 1,
							'accountList.k8': 1,
							'accountList.k10': 1,
							'accountList.k12': 1,
							'accountList.k13': 1,
							'accountList.k14': 1,
							'accountList.k15': 1,
							'accountList.k16': 1,
							'accountList.k17': 1,
							'accountList.k20': 1,
							'accountList.k21': 1,
							'accountList.k23': 1,
							'demandList.d2': 1,
							'demandList.d4': 1,
							'demandList.d6': 1,
							'demandList.d7': 1,
							'demandList.d8': 1
						})
						break;
				case 12:
					that.setData({
						'accountList.k1': 1,
						'accountList.k2': 1,
						'accountList.k3': 1,
						'accountList.k4': 1,
						'accountList.k5': 1,
						'accountList.k6': 1,
						'accountList.k7': 1,
						'accountList.k8': 1,
						'accountList.k10': 1,
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
						'accountList.k22': 1,
						'demandList.d1': 1,
						'demandList.d4': 1,
						'demandList.d5': 1
					})
					break;
				case 13:
					that.setData({
						'accountList.k1': 1,
						'accountList.k2': 1,
						'accountList.k3': 1,
						'accountList.k4': 1,
						'accountList.k5': 1,
						'accountList.k6': 1,
						'accountList.k7': 1,
						'accountList.k8': 1,
						'accountList.k10': 1,
						'accountList.k11': 1,
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
						'accountList.k22': 1,
						'demandList.d1': 1,
						'demandList.d4': 1,
						'demandList.d5': 1
					})
					break;

				case 14:
					that.setData({
						'accountList.k1': 1,
						'accountList.k2': 1,
						'accountList.k3': 1,
						'accountList.k4': 1,
						'accountList.k5': 1,
						'accountList.k6': 1,
						'accountList.k7': 1,
						'accountList.k8': 1,
						'accountList.k10': 1,
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
						'accountList.k22': 1,
						'demandList.d1': 1,
						'demandList.d4': 1,
						'demandList.d5': 1,
						'demandList.d6': 1,
						'demandList.d7': 1,
						'demandList.d8': 1
					})
					break;
				case 15:
					that.setData({
						'accountList.k1': 1,
						'accountList.k2': 1,
						'accountList.k3': 1,
						'accountList.k4': 1,
						'accountList.k5': 1,
						'accountList.k6': 1,
						'accountList.k7': 1,
						'accountList.k8': 1,
						'accountList.k10': 1,
						'accountList.k11': 1,
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
						'accountList.k22': 1,
						'demandList.d1': 1,
						'demandList.d4': 1,
						'demandList.d5': 1,
						'demandList.d6': 1,
						'demandList.d7': 1,
						'demandList.d8': 1
					})
					break;
				default:
					wx.showToast({
						title: '没有符合的类型',
						icon:'none',duration:5000
					})
					break;
			}

		} else if (that.data.selectedItems.item2 == '1') {
			let index = that.data.stateListYB.findIndex((item, index) => {
				return item.equal(items);
			})
			switch (index) {
				case 0:
					that.setData({
						'accountList.k8': 1,
						'accountList.k9': 1,
						'accountList.k10': 1,
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
					})
					break;
				case 1:
					that.setData({
						'accountList.k8': 1,
						'accountList.k9': 1,
						'accountList.k10': 1,
						'accountList.k11': 1,
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1
					})
					break;
				case 2:
					that.setData({
						'accountList.k1': 1,
						'accountList.k2': 1,
						'accountList.k3': 1,
						'accountList.k4': 1,
						'accountList.k5': 1,
						'accountList.k6': 1,
						'accountList.k7': 1,
						'accountList.k8': 1,
						'accountList.k9': 1,
						'accountList.k10': 1,
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
						'accountList.k23': 1,
						'demandList.d6': 1,
						'demandList.d7': 1,
						'demandList.d8': 1
					})
					break;
				case 3:
					that.setData({
						'accountList.k1': 1,
						'accountList.k2': 1,
						'accountList.k3': 1,
						'accountList.k4': 1,
						'accountList.k5': 1,
						'accountList.k6': 1,
						'accountList.k7': 1,
						'accountList.k8': 1,
						'accountList.k9': 1,
						'accountList.k10': 1,
						'accountList.k11': 1,
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
						'accountList.k23': 1,
						'demandList.d6': 1,
						'demandList.d7': 1,
						'demandList.d8': 1
					})
					break;
				case 4:
					that.setData({
						'accountList.k1': 1,
						'accountList.k2': 1,
						'accountList.k3': 1,
						'accountList.k4': 1,
						'accountList.k5': 1,
						'accountList.k6': 1,
						'accountList.k7': 1,
						'accountList.k8': 1,
						'accountList.k9': 1,
						'accountList.k10': 1,
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
						'accountList.k20': 1,
						'accountList.k21': 1,
						'demandList.d2': 1
					})
					break;
					case 5:
						that.setData({
							'accountList.k1': 1,
							'accountList.k2': 1,
							'accountList.k3': 1,
							'accountList.k4': 1,
							'accountList.k5': 1,
							'accountList.k6': 1,
							'accountList.k7': 1,
							'accountList.k8': 1,
							'accountList.k9': 1,
							'accountList.k10': 1,
							'accountList.k11': 1,
							'accountList.k12': 1,
							'accountList.k13': 1,
							'accountList.k14': 1,
							'accountList.k15': 1,
							'accountList.k16': 1,
							'accountList.k17': 1,
							'accountList.k20': 1,
							'accountList.k21': 1,
							'demandList.d2': 1
						})
						break;
				case 6:
					that.setData({
						'accountList.k1': 1,
						'accountList.k2': 1,
						'accountList.k3': 1,
						'accountList.k4': 1,
						'accountList.k5': 1,
						'accountList.k6': 1,
						'accountList.k7': 1,
						'accountList.k8': 1,
						'accountList.k9': 1,
						'accountList.k10': 1,
						'accountList.k11': 1,
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
						'accountList.k20': 1,
						'accountList.k21': 1,
						'demandList.d2': 1
					})
					break;
					case 7:
					that.setData({
						'accountList.k1': 1,
						'accountList.k2': 1,
						'accountList.k3': 1,
						'accountList.k4': 1,
						'accountList.k5': 1,
						'accountList.k6': 1,
						'accountList.k7': 1,
						'accountList.k8': 1,
						'accountList.k9': 1,
						'accountList.k10': 1,
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
						'accountList.k20': 1,
						'accountList.k21': 1,
						'demandList.d2': 1
					})
					break;
				case 8:
					that.setData({
						'accountList.k1': 1,
						'accountList.k2': 1,
						'accountList.k3': 1,
						'accountList.k4': 1,
						'accountList.k5': 1,
						'accountList.k6': 1,
						'accountList.k7': 1,
						'accountList.k8': 1,
						'accountList.k9': 1,
						'accountList.k10': 1,
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
						'accountList.k20': 1,
						'accountList.k21': 1,
						'accountList.k23': 1,
						'demandList.d2': 1,
						'demandList.d6': 1,
						'demandList.d7': 1,
						'demandList.d8': 1
					})
					break;
					case 9:
					that.setData({
						'accountList.k1': 1,
						'accountList.k2': 1,
						'accountList.k3': 1,
						'accountList.k4': 1,
						'accountList.k5': 1,
						'accountList.k6': 1,
						'accountList.k7': 1,
						'accountList.k8': 1,
						'accountList.k9': 1,
						'accountList.k10': 1,
						'accountList.k11': 1,
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
						'accountList.k20': 1,
						'accountList.k21': 1,
						'accountList.k23': 1,
						'demandList.d2': 1,
						'demandList.d6': 1,
						'demandList.d7': 1,
						'demandList.d8': 1

					})
					break;
				case 10:
					that.setData({
						'accountList.k1': 1,
						'accountList.k2': 1,
						'accountList.k3': 1,
						'accountList.k4': 1,
						'accountList.k5': 1,
						'accountList.k6': 1,
						'accountList.k7': 1,
						'accountList.k8': 1,
						'accountList.k9': 1,
						'accountList.k10': 1,
						'accountList.k11': 1,
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
						'accountList.k20': 1,
						'accountList.k21': 1,
						'accountList.k23': 1,
						'demandList.d2': 1,
						'demandList.d6': 1,
						'demandList.d7': 1,
						'demandList.d8': 1
					})
					break;
					case 11:
						that.setData({
							'accountList.k1': 1,
							'accountList.k2': 1,
							'accountList.k3': 1,
							'accountList.k4': 1,
							'accountList.k5': 1,
							'accountList.k6': 1,
							'accountList.k7': 1,
							'accountList.k8': 1,
							'accountList.k9': 1,
							'accountList.k10': 1,
							'accountList.k12': 1,
							'accountList.k13': 1,
							'accountList.k14': 1,
							'accountList.k15': 1,
							'accountList.k16': 1,
							'accountList.k17': 1,
							'accountList.k20': 1,
							'accountList.k21': 1,
							'accountList.k23': 1,
							'demandList.d2': 1,
							'demandList.d6': 1,
							'demandList.d7': 1,
							'demandList.d8': 1
						})
						break;
				case 12:
					that.setData({
						'accountList.k1': 1,
						'accountList.k2': 1,
						'accountList.k3': 1,
						'accountList.k4': 1,
						'accountList.k5': 1,
						'accountList.k6': 1,
						'accountList.k7': 1,
						'accountList.k8': 1,
						'accountList.k9': 1,
						'accountList.k10': 1,
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
						'accountList.k22': 1,
						'demandList.d1': 1,
						'demandList.d4': 1,
						'demandList.d5': 1
					})
					break;
				case 13:
					that.setData({
						'accountList.k1': 1,
						'accountList.k2': 1,
						'accountList.k3': 1,
						'accountList.k4': 1,
						'accountList.k5': 1,
						'accountList.k6': 1,
						'accountList.k7': 1,
						'accountList.k8': 1,
						'accountList.k9': 1,
						'accountList.k10': 1,
						'accountList.k11': 1,
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
						'accountList.k22': 1,
						'demandList.d1': 1,
						'demandList.d4': 1,
						'demandList.d5': 1
					})
					break;

				case 14:
					that.setData({
						'accountList.k1': 1,
						'accountList.k2': 1,
						'accountList.k3': 1,
						'accountList.k4': 1,
						'accountList.k5': 1,
						'accountList.k6': 1,
						'accountList.k7': 1,
						'accountList.k8': 1,
						'accountList.k9': 1,
						'accountList.k10': 1,
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
						'accountList.k22': 1,
						'demandList.d1': 1,
						'demandList.d4': 1,
						'demandList.d5': 1,
						'demandList.d6': 1,
						'demandList.d7': 1,
						'demandList.d8': 1
					})
					break;
				case 15:
					that.setData({
						'accountList.k1': 1,
						'accountList.k2': 1,
						'accountList.k3': 1,
						'accountList.k4': 1,
						'accountList.k5': 1,
						'accountList.k6': 1,
						'accountList.k7': 1,
						'accountList.k8': 1,
						'accountList.k9': 1,
						'accountList.k10': 1,
						'accountList.k11': 1,
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
						'accountList.k22': 1,
						'demandList.d1': 1,
						'demandList.d4': 1,
						'demandList.d5': 1,
						'demandList.d6': 1,
						'demandList.d7': 1,
						'demandList.d8': 1
					})
					break;
				default:
					wx.showToast({
						title: '没有符合的类型',
						icon:'none',duration:5000
                    })

					break;
			}

		} else if (that.data.selectedItems.item2 == '2') {
			let index = that.data.stateListLS.findIndex((item, index) => {
				return item.equal(items);
			})
			switch (index) {
				case 0:
					that.setData({
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
						'accountList.k18': 1
					})
					break;
				case 1:
					that.setData({

						'accountList.k11': 1,
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
						'accountList.k18': 1
					})
					break;
				case 2:
					that.setData({
						'accountList.k1': 1,
						'accountList.k2': 1,
						'accountList.k3': 1,
						'accountList.k4': 1,
						'accountList.k5': 1,
						'accountList.k6': 1,
						'accountList.k7': 1,
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
						'accountList.k18': 1,
						'accountList.k23': 1,
						'demandList.d6': 1,
						'demandList.d7': 1,
						'demandList.d8': 1
					})
					break;
				case 3:
					that.setData({
						'accountList.k1': 1,
						'accountList.k2': 1,
						'accountList.k3': 1,
						'accountList.k4': 1,
						'accountList.k5': 1,
						'accountList.k6': 1,
						'accountList.k7': 1,
						'accountList.k11': 1,
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
						'accountList.k18': 1,
						'accountList.k23': 1,
						'demandList.d6': 1,
						'demandList.d7': 1,
						'demandList.d8': 1
					})
					break;
				case 4:
					that.setData({
						'accountList.k1': 1,
						'accountList.k2': 1,
						'accountList.k3': 1,
						'accountList.k4': 1,
						'accountList.k5': 1,
						'accountList.k6': 1,
						'accountList.k7': 1,
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
						'accountList.k18': 1,
						'accountList.k20': 1,
						'accountList.k21': 1,
						'demandList.d2': 1
					})
					break;
					case 5:
						that.setData({
							'accountList.k1': 1,
							'accountList.k2': 1,
							'accountList.k3': 1,
							'accountList.k4': 1,
							'accountList.k5': 1,
							'accountList.k6': 1,
							'accountList.k7': 1,
							'accountList.k11': 1,
							'accountList.k12': 1,
							'accountList.k13': 1,
							'accountList.k14': 1,
							'accountList.k15': 1,
							'accountList.k16': 1,
							'accountList.k17': 1,
							'accountList.k18': 1,
							'accountList.k20': 1,
							'accountList.k21': 1,
							'demandList.d2': 1
						})
						break;
				case 6:
					that.setData({
						'accountList.k1': 1,
						'accountList.k2': 1,
						'accountList.k3': 1,
						'accountList.k4': 1,
						'accountList.k5': 1,
						'accountList.k6': 1,
						'accountList.k7': 1,

						'accountList.k11': 1,
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
						'accountList.k18': 1,

						'accountList.k20': 1,
						'accountList.k21': 1,
						'demandList.d2': 1
					})
					break;
					case 7:
					that.setData({
						'accountList.k1': 1,
						'accountList.k2': 1,
						'accountList.k3': 1,
						'accountList.k4': 1,
						'accountList.k5': 1,
						'accountList.k6': 1,
						'accountList.k7': 1,

						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
						'accountList.k18': 1,

						'accountList.k20': 1,
						'accountList.k21': 1,
						'demandList.d2': 1
					})
					break;	
				case 8:
					that.setData({
						'accountList.k1': 1,
						'accountList.k2': 1,
						'accountList.k3': 1,
						'accountList.k4': 1,
						'accountList.k5': 1,
						'accountList.k6': 1,
						'accountList.k7': 1,

						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
						'accountList.k18': 1,
						'accountList.k20': 1,
						'accountList.k21': 1,
						'accountList.k23': 1,
						'demandList.d2': 1,
						'demandList.d6': 1,
						'demandList.d7': 1,
						'demandList.d8': 1
					})
					break;
					case 9:
					that.setData({
						'accountList.k1': 1,
						'accountList.k2': 1,
						'accountList.k3': 1,
						'accountList.k4': 1,
						'accountList.k5': 1,
						'accountList.k6': 1,
						'accountList.k7': 1,
						'accountList.k11': 1,

						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
						'accountList.k18': 1,
						'accountList.k20': 1,
						'accountList.k21': 1,
						'accountList.k23': 1,
						'demandList.d2': 1,
						'demandList.d6': 1,
						'demandList.d7': 1,
						'demandList.d8': 1
					})
					break;
				case 10:
					that.setData({
						'accountList.k1': 1,
						'accountList.k2': 1,
						'accountList.k3': 1,
						'accountList.k4': 1,
						'accountList.k5': 1,
						'accountList.k6': 1,
						'accountList.k7': 1,
						'accountList.k11': 1,
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
						'accountList.k18': 1,
						'accountList.k20': 1,
						'accountList.k21': 1,
						'accountList.k23': 1,
						'demandList.d2': 1,
						'demandList.d6': 1,
						'demandList.d7': 1,
						'demandList.d8': 1
					})
					break;
					case 11:
						that.setData({
							'accountList.k1': 1,
							'accountList.k2': 1,
							'accountList.k3': 1,
							'accountList.k4': 1,
							'accountList.k5': 1,
							'accountList.k6': 1,
							'accountList.k7': 1,
							'accountList.k12': 1,
							'accountList.k13': 1,
							'accountList.k14': 1,
							'accountList.k15': 1,
							'accountList.k16': 1,
							'accountList.k17': 1,
							'accountList.k18': 1,
							'accountList.k20': 1,
							'accountList.k21': 1,
							'accountList.k23': 1,
							'demandList.d2': 1,
							'demandList.d6': 1,
							'demandList.d7': 1,
							'demandList.d8': 1
						})
						break;
				case 12:
					that.setData({
						'accountList.k1': 1,
						'accountList.k2': 1,
						'accountList.k3': 1,
						'accountList.k4': 1,
						'accountList.k5': 1,
						'accountList.k6': 1,
						'accountList.k7': 1,
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
						'accountList.k18': 1,
						'accountList.k22': 1,
						'demandList.d1': 1,
						'demandList.d4': 1,
						'demandList.d5': 1
					})
					break;
				case 13:
					that.setData({
						'accountList.k1': 1,
						'accountList.k2': 1,
						'accountList.k3': 1,
						'accountList.k4': 1,
						'accountList.k5': 1,
						'accountList.k6': 1,
						'accountList.k7': 1,
						'accountList.k11': 1,
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
						'accountList.k18': 1,
						'accountList.k22': 1,
						'demandList.d1': 1,
						'demandList.d4': 1,
						'demandList.d5': 1
					})
					break;

				case 14:
					that.setData({
						'accountList.k1': 1,
						'accountList.k2': 1,
						'accountList.k3': 1,
						'accountList.k4': 1,
						'accountList.k5': 1,
						'accountList.k6': 1,
						'accountList.k7': 1,
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
						'accountList.k18': 1,
						'accountList.k22': 1,
						'demandList.d1': 1,
						'demandList.d4': 1,
						'demandList.d5': 1,
						'demandList.d6': 1,
						'demandList.d7': 1,
						'demandList.d8': 1
					})
					break;
				case 15:
					that.setData({
						'accountList.k1': 1,
						'accountList.k2': 1,
						'accountList.k3': 1,
						'accountList.k4': 1,
						'accountList.k5': 1,
						'accountList.k6': 1,
						'accountList.k7': 1,
						'accountList.k11': 1,
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
						'accountList.k18': 1,
						'accountList.k22': 1,
						'demandList.d1': 1,
						'demandList.d4': 1,
						'demandList.d5': 1,
						'demandList.d6': 1,
						'demandList.d7': 1,
						'demandList.d8': 1
					})
					break;
				default:
					wx.showToast({
						title: '没有符合的类型',
						icon:'none',duration:5000
					})
					break;
			}
		} else if (that.data.selectedItems.item2 == '3') {
			let index = that.data.stateListQT.findIndex((item, index) => {
				return item.equal(items);
			})
			switch (index) {
				case 0:
					that.setData({
						'accountList.k8': 1,
						'accountList.k9': 1,
						'accountList.k10': 1,
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
						'accountList.k29': 1
					})
					break;
				case 1:
					that.setData({
						'accountList.k8': 1,
						'accountList.k9': 1,
						'accountList.k10': 1,
						'accountList.k11': 1,
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
						'accountList.k29': 1
					})
					break;
				case 2:
					that.setData({
						'accountList.k1': 1,
						'accountList.k2': 1,
						'accountList.k3': 1,
						'accountList.k4': 1,
						'accountList.k5': 1,
						'accountList.k6': 1,
						'accountList.k7': 1,

						'accountList.k8': 1,
						'accountList.k9': 1,
						'accountList.k10': 1,
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
						'accountList.k23': 1,
						'demandList.d6': 1,
						'demandList.d7': 1,
						'demandList.d8': 1
					})
					break;
				case 3:
					that.setData({
						'accountList.k1': 1,
						'accountList.k2': 1,
						'accountList.k3': 1,
						'accountList.k4': 1,
						'accountList.k5': 1,
						'accountList.k6': 1,
						'accountList.k7': 1,
						'accountList.k8': 1,
						'accountList.k9': 1,
						'accountList.k10': 1,
						'accountList.k11': 1,
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
						'accountList.k23': 1,
						'demandList.d6': 1,
						'demandList.d7': 1,
						'demandList.d8': 1
					})
					break;
				case 4:
					that.setData({
						'accountList.k1': 1,
						'accountList.k2': 1,
						'accountList.k3': 1,
						'accountList.k4': 1,
						'accountList.k5': 1,
						'accountList.k6': 1,
						'accountList.k7': 1,
						'accountList.k8': 1,
						'accountList.k9': 1,
						'accountList.k10': 1,
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
						'accountList.k20': 1,
						'accountList.k21': 1,
						'demandList.d2': 1
					})
					break;
					case 5:
						that.setData({
							'accountList.k1': 1,
							'accountList.k2': 1,
							'accountList.k3': 1,
							'accountList.k4': 1,
							'accountList.k5': 1,
							'accountList.k6': 1,
							'accountList.k7': 1,
							'accountList.k8': 1,
							'accountList.k9': 1,
							'accountList.k10': 1,
							'accountList.k11': 1,
							'accountList.k12': 1,
							'accountList.k13': 1,
							'accountList.k14': 1,
							'accountList.k15': 1,
							'accountList.k16': 1,
							'accountList.k17': 1,
							'accountList.k20': 1,
							'accountList.k21': 1,
							'demandList.d2': 1
						})
						break;
				case 6:
					that.setData({
						'accountList.k1': 1,
						'accountList.k2': 1,
						'accountList.k3': 1,
						'accountList.k4': 1,
						'accountList.k5': 1,
						'accountList.k6': 1,
						'accountList.k7': 1,
						'accountList.k8': 1,
						'accountList.k9': 1,
						'accountList.k10': 1,
						'accountList.k11': 1,
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
						'accountList.k20': 1,
						'accountList.k21': 1,
						'demandList.d2': 1
					})
					break;
					case 7:
						that.setData({
							'accountList.k1': 1,
							'accountList.k2': 1,
							'accountList.k3': 1,
							'accountList.k4': 1,
							'accountList.k5': 1,
							'accountList.k6': 1,
							'accountList.k7': 1,
							'accountList.k8': 1,
							'accountList.k9': 1,
							'accountList.k10': 1,
							'accountList.k12': 1,
							'accountList.k13': 1,
							'accountList.k14': 1,
							'accountList.k15': 1,
							'accountList.k16': 1,
							'accountList.k17': 1,
							'accountList.k20': 1,
							'accountList.k21': 1,
							'demandList.d2': 1
						})
						break;
				case 8:
					that.setData({
						'accountList.k1': 1,
						'accountList.k2': 1,
						'accountList.k3': 1,
						'accountList.k4': 1,
						'accountList.k5': 1,
						'accountList.k6': 1,
						'accountList.k7': 1,
						'accountList.k8': 1,
						'accountList.k9': 1,
						'accountList.k10': 1,
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
						'accountList.k20': 1,
						'accountList.k21': 1,
						'accountList.k23': 1,
						'demandList.d2': 1,
						'demandList.d6': 1,
						'demandList.d7': 1,
						'demandList.d8': 1
					})
					break;
					case 9:
					that.setData({
						'accountList.k1': 1,
						'accountList.k2': 1,
						'accountList.k3': 1,
						'accountList.k4': 1,
						'accountList.k5': 1,
						'accountList.k6': 1,
						'accountList.k7': 1,
						'accountList.k8': 1,
						'accountList.k9': 1,
						'accountList.k10': 1,
						'accountList.k11': 1,
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
						'accountList.k20': 1,
						'accountList.k21': 1,
						'accountList.k23': 1,
						'demandList.d2': 1,
						'demandList.d6': 1,
						'demandList.d7': 1,
						'demandList.d8': 1
					})
					break;
				case 10:
					that.setData({
						'accountList.k1': 1,
						'accountList.k2': 1,
						'accountList.k3': 1,
						'accountList.k4': 1,
						'accountList.k5': 1,
						'accountList.k6': 1,
						'accountList.k7': 1,
						'accountList.k8': 1,
						'accountList.k9': 1,
						'accountList.k10': 1,
						'accountList.k11': 1,
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
						'accountList.k20': 1,
						'accountList.k21': 1,
						'accountList.k23': 1,
						'demandList.d2': 1,
						'demandList.d6': 1,
						'demandList.d7': 1,
						'demandList.d8': 1
					})
					break;
					case 11:
						that.setData({
							'accountList.k1': 1,
							'accountList.k2': 1,
							'accountList.k3': 1,
							'accountList.k4': 1,
							'accountList.k5': 1,
							'accountList.k6': 1,
							'accountList.k7': 1,
							'accountList.k8': 1,
							'accountList.k9': 1,
							'accountList.k10': 1,
							'accountList.k12': 1,
							'accountList.k13': 1,
							'accountList.k14': 1,
							'accountList.k15': 1,
							'accountList.k16': 1,
							'accountList.k17': 1,
							'accountList.k20': 1,
							'accountList.k21': 1,
							'accountList.k23': 1,
							'demandList.d2': 1,
							'demandList.d6': 1,
							'demandList.d7': 1,
							'demandList.d8': 1
						})
						break;
				case 12:
					that.setData({
						'accountList.k1': 1,
						'accountList.k2': 1,
						'accountList.k3': 1,
						'accountList.k4': 1,
						'accountList.k5': 1,
						'accountList.k6': 1,
						'accountList.k7': 1,
						'accountList.k8': 1,
						'accountList.k9': 1,
						'accountList.k10': 1,
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
						'accountList.k22': 1,
						'demandList.d1': 1,
						'demandList.d4': 1,
						'demandList.d5': 1
					})
					break;
				case 13:
					that.setData({
						'accountList.k1': 1,
						'accountList.k2': 1,
						'accountList.k3': 1,
						'accountList.k4': 1,
						'accountList.k5': 1,
						'accountList.k6': 1,
						'accountList.k7': 1,
						'accountList.k8': 1,
						'accountList.k9': 1,
						'accountList.k10': 1,
						'accountList.k11': 1,
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
						'accountList.k22': 1,
						'demandList.d1': 1,
						'demandList.d4': 1,
						'demandList.d5': 1
					})
					break;

				case 14:
					that.setData({
						'accountList.k1': 1,
						'accountList.k2': 1,
						'accountList.k3': 1,
						'accountList.k4': 1,
						'accountList.k5': 1,
						'accountList.k6': 1,
						'accountList.k7': 1,
						'accountList.k8': 1,
						'accountList.k9': 1,
						'accountList.k10': 1,
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
						'accountList.k22': 1,
						'demandList.d1': 1,
						'demandList.d4': 1,
						'demandList.d5': 1,
						'demandList.d6': 1,
						'demandList.d7': 1,
						'demandList.d8': 1
					})
					break;
				case 15:
					that.setData({
						'accountList.k1': 1,
						'accountList.k2': 1,
						'accountList.k3': 1,
						'accountList.k4': 1,
						'accountList.k5': 1,
						'accountList.k6': 1,
						'accountList.k7': 1,
						'accountList.k8': 1,
						'accountList.k9': 1,
						'accountList.k10': 1,
						'accountList.k11': 1,
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
						'accountList.k22': 1,
						'demandList.d1': 1,
						'demandList.d4': 1,
						'demandList.d5': 1,
						'demandList.d6': 1,
						'demandList.d7': 1,
						'demandList.d8': 1
					})
					break;
				default:
					wx.showToast({
						title: '没有符合的类型',
						icon:'none',duration:5000
					})

					break;
			}
		} else {
			let index = that.data.stateListZY.findIndex((item, index) => {
				return item.equal(items);
			})
			switch (index) {
				case 0:
					that.setData({
						'accountList.k8': 1,
						'accountList.k9': 1,
						'accountList.k10': 1,
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1
					})
					break;
				case 1:
					that.setData({
						'accountList.k8': 1,
						'accountList.k9': 1,
						'accountList.k10': 1,
						'accountList.k11': 1,
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1
					})
					break;
				case 2:
					that.setData({
						'accountList.k1': 1,
						'accountList.k2': 1,
						'accountList.k3': 1,
						'accountList.k4': 1,
						'accountList.k5': 1,
						'accountList.k6': 1,
						'accountList.k7': 1,
						'accountList.k8': 1,
						'accountList.k9': 1,
						'accountList.k10': 1,
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
						'accountList.k23': 1,
						'demandList.d6': 1,
						'demandList.d7': 1,
						'demandList.d8': 1
					})
					break;
				case 3:
					that.setData({
						'accountList.k1': 1,
						'accountList.k2': 1,
						'accountList.k3': 1,
						'accountList.k4': 1,
						'accountList.k5': 1,
						'accountList.k6': 1,
						'accountList.k7': 1,
						'accountList.k8': 1,
						'accountList.k9': 1,
						'accountList.k10': 1,
						'accountList.k11': 1,
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
						'accountList.k23': 1,
						'demandList.d6': 1,
						'demandList.d7': 1,
						'demandList.d8': 1
					})
					break;
				case 4:
					that.setData({
						'accountList.k1': 1,
						'accountList.k2': 1,
						'accountList.k3': 1,
						'accountList.k4': 1,
						'accountList.k5': 1,
						'accountList.k6': 1,
						'accountList.k7': 1,
						'accountList.k8': 1,
						'accountList.k9': 1,
						'accountList.k10': 1,
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
						'accountList.k20': 1,
						'accountList.k21': 1,
						'demandList.d2': 1
					})
					break;
					case 5:
					that.setData({
						'accountList.k1': 1,
						'accountList.k2': 1,
						'accountList.k3': 1,
						'accountList.k4': 1,
						'accountList.k5': 1,
						'accountList.k6': 1,
						'accountList.k7': 1,
						'accountList.k8': 1,
						'accountList.k9': 1,
						'accountList.k10': 1,
						'accountList.k11': 1,
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
						'accountList.k20': 1,
						'accountList.k21': 1,
						'demandList.d2': 1
					})
					break;
				case 6:
					that.setData({
						'accountList.k1': 1,
						'accountList.k2': 1,
						'accountList.k3': 1,
						'accountList.k4': 1,
						'accountList.k5': 1,
						'accountList.k6': 1,
						'accountList.k7': 1,
						'accountList.k8': 1,
						'accountList.k9': 1,
						'accountList.k10': 1,
						'accountList.k11': 1,
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
						'accountList.k20': 1,
						'accountList.k21': 1,
						'demandList.d2': 1
					})
					break;
					case 7:
					that.setData({
						'accountList.k1': 1,
						'accountList.k2': 1,
						'accountList.k3': 1,
						'accountList.k4': 1,
						'accountList.k5': 1,
						'accountList.k6': 1,
						'accountList.k7': 1,
						'accountList.k8': 1,
						'accountList.k9': 1,
						'accountList.k10': 1,
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
						'accountList.k20': 1,
						'accountList.k21': 1,
						'demandList.d2': 1
					})
					break;
				case 8:
					that.setData({
						'accountList.k1': 1,
						'accountList.k2': 1,
						'accountList.k3': 1,
						'accountList.k4': 1,
						'accountList.k5': 1,
						'accountList.k6': 1,
						'accountList.k7': 1,
						'accountList.k8': 1,
						'accountList.k9': 1,
						'accountList.k10': 1,
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
						'accountList.k20': 1,
						'accountList.k21': 1,
						'accountList.k23': 1,
						'demandList.d2': 1,
						'demandList.d6': 1,
						'demandList.d7': 1,
						'demandList.d8': 1
					})
					break;
					case 9:
						that.setData({
							'accountList.k1': 1,
							'accountList.k2': 1,
							'accountList.k3': 1,
							'accountList.k4': 1,
							'accountList.k5': 1,
							'accountList.k6': 1,
							'accountList.k7': 1,
							'accountList.k8': 1,
							'accountList.k9': 1,
							'accountList.k10': 1,
							'accountList.k11': 1,
							'accountList.k12': 1,
							'accountList.k13': 1,
							'accountList.k14': 1,
							'accountList.k15': 1,
							'accountList.k16': 1,
							'accountList.k17': 1,
							'accountList.k20': 1,
							'accountList.k21': 1,
							'accountList.k23': 1,
							'demandList.d2': 1,
							'demandList.d6': 1,
							'demandList.d7': 1,
							'demandList.d8': 1
						})
						break;
				case 10:
					that.setData({
						'accountList.k1': 1,
						'accountList.k2': 1,
						'accountList.k3': 1,
						'accountList.k4': 1,
						'accountList.k5': 1,
						'accountList.k6': 1,
						'accountList.k7': 1,
						'accountList.k8': 1,
						'accountList.k9': 1,
						'accountList.k10': 1,
						'accountList.k11': 1,
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
						'accountList.k20': 1,
						'accountList.k21': 1,
						'accountList.k23': 1,
						'demandList.d2': 1,
						'demandList.d6': 1,
						'demandList.d7': 1,
						'demandList.d8': 1
					})
					break;
					case 11:
						that.setData({
							'accountList.k1': 1,
							'accountList.k2': 1,
							'accountList.k3': 1,
							'accountList.k4': 1,
							'accountList.k5': 1,
							'accountList.k6': 1,
							'accountList.k7': 1,
							'accountList.k8': 1,
							'accountList.k9': 1,
							'accountList.k10': 1,
							'accountList.k12': 1,
							'accountList.k13': 1,
							'accountList.k14': 1,
							'accountList.k15': 1,
							'accountList.k16': 1,
							'accountList.k17': 1,
							'accountList.k20': 1,
							'accountList.k21': 1,
							'accountList.k23': 1,
							'demandList.d2': 1,
							'demandList.d6': 1,
							'demandList.d7': 1,
							'demandList.d8': 1
						})
						break;
				case 12:
					that.setData({
						'accountList.k1': 1,
						'accountList.k2': 1,
						'accountList.k3': 1,
						'accountList.k4': 1,
						'accountList.k5': 1,
						'accountList.k6': 1,
						'accountList.k7': 1,
						'accountList.k8': 1,
						'accountList.k9': 1,
						'accountList.k10': 1,
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
						'accountList.k22': 1,
						'demandList.d1': 1,
						'demandList.d4': 1,
						'demandList.d5': 1
					})
					break;
				case 13:
					that.setData({
						'accountList.k1': 1,
						'accountList.k2': 1,
						'accountList.k3': 1,
						'accountList.k4': 1,
						'accountList.k5': 1,
						'accountList.k6': 1,
						'accountList.k7': 1,
						'accountList.k8': 1,
						'accountList.k9': 1,
						'accountList.k10': 1,
						'accountList.k11': 1,
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
						'accountList.k22': 1,
						'demandList.d1': 1,
						'demandList.d4': 1,
						'demandList.d5': 1
					})
					break;

				case 14:
					that.setData({
						'accountList.k1': 1,
						'accountList.k2': 1,
						'accountList.k3': 1,
						'accountList.k4': 1,
						'accountList.k5': 1,
						'accountList.k6': 1,
						'accountList.k7': 1,
						'accountList.k8': 1,
						'accountList.k9': 1,
						'accountList.k10': 1,
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
						'accountList.k22': 1,
						'demandList.d1': 1,
						'demandList.d4': 1,
						'demandList.d5': 1,
						'demandList.d6': 1,
						'demandList.d7': 1,
						'demandList.d8': 1
					})
					break;
				case 15:
					that.setData({
						'accountList.k1': 1,
						'accountList.k2': 1,
						'accountList.k3': 1,
						'accountList.k4': 1,
						'accountList.k5': 1,
						'accountList.k6': 1,
						'accountList.k7': 1,
						'accountList.k8': 1,
						'accountList.k9': 1,
						'accountList.k10': 1,
						'accountList.k11': 1,
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
						'accountList.k22': 1,
						'demandList.d1': 1,
						'demandList.d4': 1,
						'demandList.d5': 1,
						'demandList.d6': 1,
						'demandList.d7': 1,
						'demandList.d8': 1
					})
					break;
				case 16:
					that.setData({
						'accountList.k1': 1,
						'accountList.k2': 1,
						'accountList.k3': 1,
						'accountList.k4': 1,
						'accountList.k5': 1,
						'accountList.k6': 1,
						'accountList.k7': 1,
						'accountList.k8': 1,
						'accountList.k9': 1,
						'accountList.k10': 1,
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
						'accountList.k28': 1
					})
					break;
				case 17:
					that.setData({
						'accountList.k1': 1,
						'accountList.k2': 1,
						'accountList.k3': 1,
						'accountList.k4': 1,
						'accountList.k5': 1,
						'accountList.k6': 1,
						'accountList.k7': 1,
						'accountList.k8': 1,
						'accountList.k9': 1,
						'accountList.k10': 1,
						'accountList.k11': 1,
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
						'accountList.k28': 1
					})
					break;
				case 18:
					that.setData({
						'accountList.k1': 1,
						'accountList.k2': 1,
						'accountList.k3': 1,
						'accountList.k4': 1,
						'accountList.k5': 1,
						'accountList.k6': 1,
						'accountList.k7': 1,
						'accountList.k8': 1,
						'accountList.k9': 1,
						'accountList.k10': 1,
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
						'accountList.k23': 1,
						'accountList.k28': 1,
						'demandList.d6': 1,
						'demandList.d7': 1,
						'demandList.d8': 1
					})
					break;
				case 19:
					that.setData({
						'accountList.k1': 1,
						'accountList.k2': 1,
						'accountList.k3': 1,
						'accountList.k4': 1,
						'accountList.k5': 1,
						'accountList.k6': 1,
						'accountList.k7': 1,
						'accountList.k8': 1,
						'accountList.k9': 1,
						'accountList.k10': 1,
						'accountList.k11': 1,
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
						'accountList.k23': 1,
						'accountList.k28': 1,
						'demandList.d6': 1,
						'demandList.d7': 1,
						'demandList.d8': 1
					})
					break;
				case 20:
					that.setData({
						'accountList.k1': 1,
						'accountList.k2': 1,
						'accountList.k3': 1,
						'accountList.k4': 1,
						'accountList.k5': 1,
						'accountList.k6': 1,
						'accountList.k7': 1,
						'accountList.k8': 1,
						'accountList.k9': 1,
						'accountList.k10': 1,
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
						'accountList.k20': 1,
						'accountList.k21': 1,
						'accountList.k28': 1,
						'demandList.d2': 1
					})
					break;
					case 21:
						that.setData({
							'accountList.k1': 1,
							'accountList.k2': 1,
							'accountList.k3': 1,
							'accountList.k4': 1,
							'accountList.k5': 1,
							'accountList.k6': 1,
							'accountList.k7': 1,
							'accountList.k8': 1,
							'accountList.k9': 1,
							'accountList.k10': 1,
							'accountList.k11': 1,
							'accountList.k12': 1,
							'accountList.k13': 1,
							'accountList.k14': 1,
							'accountList.k15': 1,
							'accountList.k16': 1,
							'accountList.k17': 1,
							'accountList.k20': 1,
							'accountList.k21': 1,
							'accountList.k28': 1,
							'demandList.d2': 1
						})
						break;
				case 22:
					that.setData({
						'accountList.k1': 1,
						'accountList.k2': 1,
						'accountList.k3': 1,
						'accountList.k4': 1,
						'accountList.k5': 1,
						'accountList.k6': 1,
						'accountList.k7': 1,
						'accountList.k8': 1,
						'accountList.k9': 1,
						'accountList.k10': 1,
						'accountList.k11': 1,
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
						'accountList.k20': 1,
						'accountList.k21': 1,
						'accountList.k28': 1,
						'demandList.d2': 1
					})
					break;
					case 23:
						that.setData({
							'accountList.k1': 1,
							'accountList.k2': 1,
							'accountList.k3': 1,
							'accountList.k4': 1,
							'accountList.k5': 1,
							'accountList.k6': 1,
							'accountList.k7': 1,
							'accountList.k8': 1,
							'accountList.k9': 1,
							'accountList.k10': 1,
							'accountList.k12': 1,
							'accountList.k13': 1,
							'accountList.k14': 1,
							'accountList.k15': 1,
							'accountList.k16': 1,
							'accountList.k17': 1,
							'accountList.k20': 1,
							'accountList.k21': 1,
							'accountList.k28': 1,
							'demandList.d2': 1
						})
						break;
				case 24:
					that.setData({
						'accountList.k1': 1,
						'accountList.k2': 1,
						'accountList.k3': 1,
						'accountList.k4': 1,
						'accountList.k5': 1,
						'accountList.k6': 1,
						'accountList.k7': 1,
						'accountList.k8': 1,
						'accountList.k9': 1,
						'accountList.k10': 1,
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
						'accountList.k20': 1,
						'accountList.k21': 1,
						'accountList.k23': 1,
						'accountList.k28': 1,
						'demandList.d2': 1,
						'demandList.d6': 1,
						'demandList.d7': 1,
						'demandList.d8': 1,

					})
					break;
					case 25:
					that.setData({
						'accountList.k1': 1,
						'accountList.k2': 1,
						'accountList.k3': 1,
						'accountList.k4': 1,
						'accountList.k5': 1,
						'accountList.k6': 1,
						'accountList.k7': 1,
						'accountList.k8': 1,
						'accountList.k9': 1,
						'accountList.k10': 1,
						'accountList.k11': 1,
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
						'accountList.k20': 1,
						'accountList.k21': 1,
						'accountList.k23': 1,
						'accountList.k28': 1,
						'demandList.d2': 1,
						'demandList.d6': 1,
						'demandList.d7': 1,
						'demandList.d8': 1,

					})
					break;
				case 26:
					that.setData({
						'accountList.k1': 1,
						'accountList.k2': 1,
						'accountList.k3': 1,
						'accountList.k4': 1,
						'accountList.k5': 1,
						'accountList.k6': 1,
						'accountList.k7': 1,
						'accountList.k8': 1,
						'accountList.k9': 1,
						'accountList.k10': 1,
						'accountList.k11': 1,
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
						'accountList.k20': 1,
						'accountList.k21': 1,
						'accountList.k23': 1,
						'accountList.k28': 1,
						'demandList.d2': 1,
						'demandList.d6': 1,
						'demandList.d7': 1,
						'demandList.d8': 1,

					})
					break;
					case 27:
					that.setData({
						'accountList.k1': 1,
						'accountList.k2': 1,
						'accountList.k3': 1,
						'accountList.k4': 1,
						'accountList.k5': 1,
						'accountList.k6': 1,
						'accountList.k7': 1,
						'accountList.k8': 1,
						'accountList.k9': 1,
						'accountList.k10': 1,
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
						'accountList.k20': 1,
						'accountList.k21': 1,
						'accountList.k23': 1,
						'accountList.k28': 1,
						'demandList.d2': 1,
						'demandList.d6': 1,
						'demandList.d7': 1,
						'demandList.d8': 1,

					})
					break;
				case 28:
					that.setData({
						'accountList.k1': 1,
						'accountList.k2': 1,
						'accountList.k3': 1,
						'accountList.k4': 1,
						'accountList.k5': 1,
						'accountList.k6': 1,
						'accountList.k7': 1,
						'accountList.k8': 1,
						'accountList.k9': 1,
						'accountList.k10': 1,
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
						'accountList.k22': 1,
						'accountList.k28': 1,
						'demandList.d1': 1,
						'demandList.d4': 1,
						'demandList.d5': 1
					})
					break;
				case 29:
					that.setData({
						'accountList.k1': 1,
						'accountList.k2': 1,
						'accountList.k3': 1,
						'accountList.k4': 1,
						'accountList.k5': 1,
						'accountList.k6': 1,
						'accountList.k7': 1,
						'accountList.k8': 1,
						'accountList.k9': 1,
						'accountList.k10': 1,
						'accountList.k11': 1,
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
						'accountList.k22': 1,
						'accountList.k28': 1,
						'demandList.d1': 1,
						'demandList.d4': 1,
						'demandList.d5': 1
					})
					break;
				case 30:
					that.setData({
						'accountList.k1': 1,
						'accountList.k2': 1,
						'accountList.k3': 1,
						'accountList.k4': 1,
						'accountList.k5': 1,
						'accountList.k6': 1,
						'accountList.k7': 1,
						'accountList.k8': 1,
						'accountList.k9': 1,
						'accountList.k10': 1,
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
						'accountList.k22': 1,
						'accountList.k28': 1,
						'demandList.d1': 1,
						'demandList.d4': 1,
						'demandList.d5': 1,
						'demandList.d6': 1,
						'demandList.d7': 1,
						'demandList.d8': 1
					})
					break;
				case 31:
					that.setData({
						'accountList.k1': 1,
						'accountList.k2': 1,
						'accountList.k3': 1,
						'accountList.k4': 1,
						'accountList.k5': 1,
						'accountList.k6': 1,
						'accountList.k7': 1,
						'accountList.k8': 1,
						'accountList.k9': 1,
						'accountList.k10': 1,
						'accountList.k11': 1,
						'accountList.k12': 1,
						'accountList.k13': 1,
						'accountList.k14': 1,
						'accountList.k15': 1,
						'accountList.k16': 1,
						'accountList.k17': 1,
						'accountList.k22': 1,
						'accountList.k28': 1,
						'demandList.d1': 1,
						'demandList.d4': 1,
						'demandList.d5': 1,
						'demandList.d6': 1,
						'demandList.d7': 1,
						'demandList.d8': 1
					})
					break;

				default:
					wx.showToast({
						title: '没有符合的类型',
						icon:'none',duration:5000
					})
					break;
			}
		}

	},

	/**
	 * Lifecycle function--Called when page is initially rendered
	 */
	onReady: function () {},

	choose(e) {
		console.log(e);
	},


});