var app = getApp();
import utils from '../utils';
import rcrz from '../rcrz';

Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		label: {
			type: String,
			value: '',
		},
		placeholder: {
			type: String,
			value: '',
		},

		idx: {
			type: String,
			value: '0',
		},
		key: {
			type: String,
			value: '',
		},
		value: {
			type: String,
			value: '',
		},
		region_value: {
			type: Array,
			value: [],
		},

		disabled: {
			type: Boolean,
			value: false,
		},

		mode: {
			type: String,
			value: 'selector', // selector, multiSelector, date, region
		},
		
		range: {
			type: Array,
			value: [],
		},
		range_key: {
			type: String,
			value: '',
		},

		fields: {
			type: String,
			value: 'day', // year, day
		},
		start: {
			type: String,
			value: '',
		},
		end: {
			type: String,
			value: '',
		},

	},

	/**
	 * 组件的初始数据
	 */
	data: {
		preffixUrl: utils.preffixUrl(),

	},

	attached: function() {
		let {mode,idx,key,value,region_value,range,range_key} = this.data;
		if (mode == 'region') {
			if (region_value) {
				value = region_value.join('');
				this.setData({value});
			}
		} else {
			if (key && range) {
				let item = range.find((e)=>e.key==key);
				if (item) {
					value = item[range_key];
					this.setData({value});
				}
			}
		}
	},
	
	detached: function() {
		  
	},

	/**
	 * 组件的方法列表
	 */
	methods: {

		bindchange(e) {
			let {mode} = this.data;
			switch (mode) {
				case 'selector': {
					let idx = e.detail.value;
					let {key, value} = this.properties.range[idx];
					this.setData({idx, key, value});
				} break;
				case 'multiSelector': {
					let idx = e.detail.value[0];
					let {key, value} = this.properties.range[0][idx];
					this.setData({idx, key, value});
				} break;
				case 'date': {
					let {value} = e.detail;
					this.setData({value});
				} break;
				case 'region': {
					let {code,postcode,value} = e.detail;
					this.setData({
						value: value.join(""),
					})
				} break;
			}

			this.triggerEvent('bindchange', e, {});
		}

	}
})
