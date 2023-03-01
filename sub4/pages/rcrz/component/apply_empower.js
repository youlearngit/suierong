var app = getApp();
import utils from '../utils';
import rcrz from '../rcrz';

Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		checked: {
			type: String,
			value: '0',
		},
		btn: {
			type: Array,
			value: ['发送授权','授权信息']
		},
		open_type: {
			type: String,
			value: '', // share
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

		bindtap(event) {
			
			this.triggerEvent('bindtap', {}, {});
		},
		
	}
})
