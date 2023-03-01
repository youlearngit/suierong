// sub3/pages/bbx/shipei2.js
var app = getApp();
import utils from './utils';
import talent from './talent';
import util from '../../../utils/util';
import api from '../../../utils/api';

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		preffixUrl: utils.preffixUrl(),

		bbx_channel: '',

		time_now: Date.DateFormat(new Date(),'yyyy年MM月dd日 hh:mm'),

		questions_ways: [ // 问题路线定义
			// "identity",
			"want",
			{
				"7001": ["education","nationality","trade","owntags","tags"],
				"7002": ["education","nationality","trade","owntags"],
				"7003": ["cate","cateword","subcate","owntags"],
			},
		],
		questions_way: [], // 问题路线
		questions_def: { // 问题定义
			"identity": {title:"您目前的身份是？",type:"radio",items:{}},
			"want": {title:"您想？",type:"radio",items:{}},
			"rank": {title:"您拥有的职称？",type:"radio",items:{}},
			"cate": {title:"您想了解哪方面的政策？",type:"radio",items:{}},
			"cateword": {title:"试试输入您感兴趣的关键字",type:"input",itmes:{}},
			"subcate": {title:"您具体想了解哪些方面？",type:"radio",items:{}},
			// "age": {title:"您的年龄范围？",type:"radio",items:utils.questionFields().ages},
			"birthday": {title:"您的出生日期？",type:"datepicker",items:{}},
			"education": {title:"您的学历是？",type:"radio",items:{}},
			"nationality": {title:"您的国籍？",type:"radio",items:{}},
			"trade": {title:"您所从事的行业？",type:"radio",items:{}},
			"years": {title:"您在该领域的工作年限？",type:"radio",items:utils.questionFields().yearss},
			"edunumber": {title:"您的团队研究生以上学历人数？",type:"radio",items:utils.questionFields().edunumbers},
			"owntags": {title:"选择适合您的标签？",type:"checkbox",items:{}},
			"tags": {title:"选择适合您企业的标签？",type:"checkbox",items:{}},
		},
		answers: {
			"identity": "",
			"want": "",
			"rank": "",
			"cate": "",
			"cateword": "",
			"subcate": "",
			"age": "",
			"birthday": "",
			"education": "",
			"nationality": "",
			"trade": "",
			"years": "",
			"edunumber": "",
			"owntags": [],
			"tags": [],
		},

		scroll_into: "",
		records: [],

		popup: {
			show: false,
		},
		date_picker: {
			show: false,
		},
		input_event: '',
		location: {},

	},

	onDatePickerEvent: function (e) {
		let {event} = e.currentTarget.dataset;
		let {questions_def,answers} = this.data;
		switch (event) {
			case 'birthday':{
				this.data.date_picker.callback = (value)=>{
					this.setData({
						['answers.'+event] : value
					});
					this.next(event);
				}
				this.setData({
					'date_picker.show' : true,
					'date_picker.min_date' : new Date((new Date().getFullYear()-80),1,1).getTime(),
					'date_picker.max_date' : new Date(new Date().getFullYear(),1,1).getTime(),
				});
			}break;
			default:{
				let {type,detail} = e;
				if (type=='confirm') {
					this.data.date_picker.callback(Date.DateFormat(new Date(detail),'yyyy-MM-dd'));
					this.data.date_picker.callback = false;
				}
				if (type=='cancel') {
					this.data.date_picker.callback('');
					this.data.date_picker.callback = false;
				}
				this.setData({'date_picker.show' : !this.data.date_picker.show});
			}break;
		}
	},

	onPopupEvent: function (e) {
		let {event,action,item} = e.currentTarget.dataset;
		let {questions_def,answers} = this.data;
		if (event) {
			if (action == 'get') {
				this.setData({
					'popup.show' : true,
					'popup.title' : questions_def[event].title,
					'popup.items' : questions_def[event].items,
					'popup.items_keys' : Object.keys(questions_def[event].items),
					'popup.value' : answers[event],
					'popup.event' : event,
				});
			} else if (action == 'set_item') {
				let items = answers[event];
				let find = items.indexOf(item);
				if (find>-1) {
					items.splice(find,1);
				} else {
					items.push(item);
				}
				if (item=='-1') {
					items = ['-1'];
					answers[event] = items;
				} else {
					let f = items.indexOf('-1')
					if (f>-1) {
						items.splice(f,1)
					}
				}
				this.setData({
					'popup.value' : items,
				});
			} else if (action == 'set_items') {
				this.setData({
					'popup.show' : false,
					['answers.'+event] : this.data.popup.value,
				});
				this.next(event);
			}
		} else {
			this.setData({'popup.show' : !this.data.popup.show});
		}
	},

	radio_check: function(e) {
		let {question,answer} = e.target.dataset;
		this.setData({
			['answers.'+question] : answer,
		});
		this.next(question);
	},

	next: function(event) {
		let that = this;
		let questions_def = this.data.questions_def;
		let questions_ways = this.data.questions_ways;
		let questions_way = this.data.questions_way;
		let answers = this.data.answers;
		let records = this.data.records;

		let step = questions_way.indexOf(event) + 1;
		let pre_way = questions_way[step-1];
		let pre_way_val = answers[pre_way];
		let next = questions_ways[step];

		if (typeof(next)=='undefined' && event==questions_way[questions_way.length-1]) {
			this.finish();
			return;
		}

		if (['owntags','tags'].indexOf(pre_way)!=-1) {
			// 前一个问题是非必答项，跳过前一个答案是否为空的检测
		} else if (pre_way && (!pre_way_val || pre_way_val.length==0)) {
			return;
		}

		if (step >= questions_way.length) {
			if (typeof(next)=='object') {
				for (let i in next[pre_way_val]) {
					questions_way.push(next[pre_way_val][i]);
				}
			} else if (typeof(next)=='undefined') {
				this.finish();
				return;
			} else {
				questions_way.push(next);
			}
		}
		let next_question = questions_way[step];

		if (questions_def[next_question].type=='input') {
			this.setData({input_event:next_question});
		}

		if (next_question=='years' || next_question=='rank') {
			if (answers.identity=='1103') { //1103-应届毕业生
				questions_way.splice(questions_way.indexOf(next_question),1);
				next_question = questions_way[step];
			}
		}
		if (next_question=='subcate') {
			if (answers.cateword) {
				questions_way.splice(questions_way.indexOf(next_question),1);
				next_question = questions_way[step];
			}
		}

		if (event=='cate') {
			if (answers.cate=='0000') {
				if (next_question!='cateword') {
					questions_way.splice(step,0,'cateword')
					next_question = 'cateword';
				}
			} else {
				if (next_question=='cateword') {
					questions_way.splice(questions_way.indexOf(next_question),1);
					next_question = questions_way[step];
				}
		
				let cateInt = parseInt(answers.cate);
				questions_def.subcate.items = this.filterTags(x => cateInt<x & x<(cateInt+100) );
				this.setData({questions_def});
			}
		}

		if (typeof(next)=='object' || event=='cate' || event=='identity') {
			records = records.filter(function(x){
				return questions_way.indexOf(x.question_type)<step && x.type!='finish';
			});
			for (let i in questions_way) {
				if (i>questions_way.indexOf(event)) {
					if (questions_def[questions_way[i]].type=='checkbox') {
						answers[questions_way[i]] = [];
					} else {
						answers[questions_way[i]] = "";
					}
				}
			}

			if (typeof(next)=='object') {
				questions_way = questions_way.slice(0,step);
				for (let i in next[pre_way_val]) {
					questions_way.push(next[pre_way_val][i]);
				}
			}

			next_question = questions_way[step];
			this.setData({
				answers : answers,
			});
		}
		
		if (typeof(answers[next_question])=='object') {
			if (answers[next_question].length>0) {
				return;
			}
		} else if (answers[next_question]) {
			return;
		}

		let has = records.find(x=>x.question_type==next_question);
		if (!has) {
			let record_id = 'record-'+records.length;
			records.push({
				id : record_id,
				type : 'question',
				question_type : next_question, 
				question : questions_def[next_question]
			});
			this.setData({
				records : records,
				questions_way : questions_way,
			});
			setTimeout(function(){
				that.setData({
					scroll_into : 'record-into', //record_id
				})
			},100)
		}

		if (['owntags','tags'].indexOf(next_question)!=-1) {
			this.onPopupEvent({
				currentTarget: {
					dataset: {
						event: next_question,
						action: 'get'
					}
				}
			})
		}
	},

	finishGo: function(e) {
		let that = this;
		let {records,questions_def,questions_way,answers,location} = this.data;

		wx.showToast({
			title: '适配中',
			icon: 'loading',
			mask: true,
		});

		let noteChoose = {
			QA:{},
			DATA:{
				records,
				answers,
				questions_way,
				tags: [],
				location: location || ''
			}
		};

		let noteChooseQA = {};
		for (let i in questions_way) {
			let step = questions_way[i];
			let question = {
				text : questions_def[step].title,
			}
			let answer = {
				value : answers[step],
			}
			if (typeof(answers[step])=='object') {
				answer.text = answers[step].map(function(x){return questions_def[step].items[x]}).join(",");
			} else {
				if (questions_def[step].items) {
					answer.text = questions_def[step].items[answers[step]];
				} else {
					answer.text = answers[step];
				}
			}

			noteChooseQA[step] = {question,answer};
		}
		noteChoose.QA = noteChooseQA;

		let noteChooseTags = [];
		for (let i in questions_way) {
			let step = questions_way[i];
			if (['age','birthday','years','edunumber','cateword'].indexOf(step)>-1) {
				// no use tags
			} else {
				if (typeof(answers[step])=='object') {
					for(let n in answers[step]) {
						noteChooseTags.push(answers[step][n]);
					}
				} else {
					noteChooseTags.push(answers[step])
				}
			}
		}
		noteChooseTags = noteChooseTags.filter(x=>x>0);
		noteChoose.DATA.tags = noteChooseTags;

		let noteChooseJsonStr = JSON.stringify(noteChoose);

		talent.noteChoose(noteChooseJsonStr).then(res=>{

		}).catch(err=>{
			
		}).finally(res=>{
			let word = answers.cateword || '';
			let url = '/sub3/pages/bbx/shipei_res?'+'tags='+noteChooseTags.join(',')+'&word='+word+'&adcode='+location.adcode;

			wx.hideToast();
			wx.navigateTo({
			  url: url,
			})
		});
	},

	finish: function(e) {
		let that = this;
		let {records} = this.data;

		let has = records.find(x=>x.type=='finish');
		if (!has) {
			let record_id = 'record-'+records.length;
			records.push({
				id : record_id,
				type : 'finish',
			});

			this.setData({
				records : records,
			});
			setTimeout(function(){
				that.setData({
					scroll_into : 'record-into', //record_id
				})
			},100)
		}

	},

	onInputEvent: function(e) {
		let that = this;
		let {word,records,input_event} = this.data;

		if (!word) {
			return;
		}

		if (input_event) {
			this.setData({
				['answers.'+input_event] : word
			})
			this.setData({
				word : '',
				input_event : '',
			});
			this.next(input_event);
			return;
		}

		let record_id = 'record-'+records.length;
		records.push({
			id : record_id,
			type : 'chat',
			from : 'own',
			text : word
		});
		this.setData({
			word : '',
			records : records,
		});
		setTimeout(function(){
			that.setData({
				scroll_into : 'record-into', //record_id
			})
		},100)

		wx.showToast({
			title: '适配中',
			icon: 'loading',
		});
		let articles = [];
		talent.selectPolicy(word).then(res=>{
			if (res.LIST) {
				articles = res.LIST;
				for(let i in articles) {
					articles[i] = talent.policyDisplay(articles[i]);
				}
			}
		}).catch(err=>{
			
		}).finally(res=>{
			let record_id = 'record-'+records.length;
			records.push({
				id : record_id,
				type : 'chat',
				from : 'other',
				text_type : 'articles',
				text : articles,
			});
			this.setData({
				records : records,
			});
			setTimeout(function(){
				that.setData({
					scroll_into : 'record-into', //record_id
				})
			},100)
			wx.hideToast();
		});
	},

	loadModi: function() {
		let that = this;
		let records = this.data.records;
		let questions_def = this.data.questions_def;
		let questions_way = this.data.questions_way;
		let answers = this.data.answers;

		talent.noteSelect().then(res=>{
			if (!res.LIST[0]) {
				return;
			}
			let json = JSON.parse(res.LIST[0].REMARK1).DATA;
			answers = json.answers;
			questions_way = json.questions_way;
			records = json.records;

			this.setData({
				records : records,
				questions_way : questions_way,
				answers : answers,
			});
			setTimeout(function(){
				that.setData({
					scroll_into : 'record-into', //records[records.length-1].id
				})
			},100)
		})
	},

	filterTags: function(func){
		let items = {};
		let tags = Object.keys(utils.policyFields().policy_labels).filter(func);
		for (let i in tags) {
			let tag = tags[i];
			items[tag] = utils.policyFields().policy_labels[tag];
		}
		return items;
	},

	setTagsItems: function() {
		let {questions_def} = this.data;

		questions_def.identity.items = utils.policyFields().policy_labels_identity; // identity 身份
		questions_def.want.items = utils.policyFields().policy_labels_want; // want 需求想法
		questions_def.rank.items = utils.policyFields().policy_labels_rank; // rank 职称
		questions_def.cate.items = utils.policyFields().policy_labels_cate; // cate 类别
		questions_def.subcate.items = utils.policyFields().policy_labels_subcate; // subcate 子类别
		questions_def.education.items = utils.policyFields().policy_labels_education; // education 学历
		questions_def.nationality.items = utils.policyFields().policy_labels_nationality; // nationality 国籍
		questions_def.trade.items = utils.policyFields().policy_labels_trade; // trade 行业
		questions_def.owntags.items = utils.policyFields().policy_labels_owntags; // owntags 个人标签
		questions_def.owntags.items[-1] = '以上都不涉及';
		questions_def.tags.items = utils.policyFields().policy_labels_tags; // tags 企业标签
		questions_def.tags.items[-1] = '以上都不涉及';

		this.setData({questions_def})
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		utils.loadBBXChannelByOptions(options);
		
		let {action,location} = options;
		location = location?JSON.parse(location):{};
		this.setData({location})

		if (!location.adcode) {
			utils.getUserLocation().then(res=>{
				this.setData({location:res});
			})
		}

		this.setData({ bbx_channel:utils.getBBXChannel().channel });
		
		this.setTagsItems();

		if (action == 'modi') {
			this.loadModi();
		} else {
			this.next();
		}

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
		talent.tracking(2);
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