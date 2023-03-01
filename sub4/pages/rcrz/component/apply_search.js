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
		value: {
			type: String,
			value: '',
		},
		scrolls: {
			type: Array,
			value: [],
		},

	},

	/**
	 * 组件的初始数据
	 */
	data: {
		preffixUrl: utils.preffixUrl(),

	},

	/**
	 * 组件的方法列表
	 */
	methods: {

		bindinput(e) {
			let {detail} = e;
			this.triggerEvent('bindinput', {}, {});
		},

		bindtap(e) {
			let {item} = e.currentTarget.dataset;
			let {value,scrolls} = this.data;
			value = item.value;
			scrolls = [];
			this.setData({value,scrolls});
			this.triggerEvent('bindtap', {}, {});
		},

	}
})
