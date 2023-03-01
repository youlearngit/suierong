var app = getApp();
import utils from '../utils';
import rcrz from '../rcrz';

Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		key: {
			type: String,
			value: '',
		},
		range: {
			type: Array,
			value: [],
		}
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

		bindchange(event) {
			let key = event.detail;
			this.setData({key});
			this.triggerEvent('bindchange', {}, {});
		},

	}
})
