// sub3/pages/bbx/articles.js
var app = getApp();
import utils from './utils';
import talent from './talent';
import api from '../../../utils/api';

Page({

    /**
     * 页面的初始数据
     */                   
    data: {
        preffixUrl: utils.preffixUrl(),
        cndUrl: app.globalData.CDNURL,
        keywords: '',
        search: '',
        typeList: '2',
        search_type: '',
        doc_date1: '',
        doc_date2: '',
        PRODUCT_LABEL: '',
        PROJJCT_LABEL: '',
        area: '',
        level: '',
        type: '2',
        sub_type: '',
        APPLY_CITY: '',
        APPLY_COUNTY: '',
        tag: '2',
        word: '',
        location: '',

        productList: [{
                name: '开发开发',
                cordname: '开发开发开发开发开发开发开发开发',
                url: '/static/wechat/img/zssn/xmgxhzbg.png'
            },
            {
                name: '开发开发开开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发开发发开发开发开发开发开发',
                cordname: '开发开发开发开发开发开发开发开发',
                url: '/static/wechat/img/zssn/xmgxhzbg.png'
            },
        ],
        articleList: [
          {
            name:'重大项目',
            url:'/static/wechat/img/zssn/zssnzdxm.png',
            articleType:'0',
            list:[
              {
                name:'稳产保供',
                type:'0'
              },
              {
                name:'要害工程',
                type:'1'
              },
              {
                name:'绿色发展',
                type:'2'
              },
              {
                name:'产业融合',
                type:'3'
              },
              {
                name:'乡村建设',
                type:'4'
              },
            ]
          },
          {
            name:'招商产业',
            articleType:'1',
            url:'/static/wechat/img/zssn/zssnzsxm.png',
            list:[
              {
                name:'种植业',
                type:'0'
              },
              {
                name:'养殖业',
                type:'1'
              },
              {
                name:'农产品加工业',
                type:'2'
              },
              {
                name:'休闲观光业',
                type:'3'
              },
              {
                name:'农业服务业',
                type:'4'
              },
            ]
          },

        ],
        is_recommend: false,

        area_filter: '',
        filter: {
            show: false,
        },
        filter_def: {
            doc_date: {
                type: 'daterange',
                event: 'set_filter_daterange',
                title: '发布日期',
                text: '选择日期',
                value: []
            },
            areas: {
                type: 'picker_multi',
                title: '地区',
                text: '选择地区',
                items: {
                    '320000': [ // 江苏省
                        {
                            id: '',
                            text: '不限地区'
                        },
                        {
                            id: '320100',
                            text: '南京市'
                        },
                        {
                            id: '320200',
                            text: '无锡市'
                        },
                        // {id:'320282',text:'宜兴市'}, // 无网点 不展示
                        // {id:'320281',text:'江阴市'}, // 无网点 不展示
                        {
                            id: '320300',
                            text: '徐州市'
                        },
                        {
                            id: '320400',
                            text: '常州市'
                        },
                        {
                            id: '320500',
                            text: '苏州市'
                        },
                        {
                            id: '320600',
                            text: '南通市'
                        },
                        {
                            id: '320700',
                            text: '连云港市'
                        },
                        {
                            id: '320800',
                            text: '淮安市'
                        },
                        {
                            id: '320900',
                            text: '盐城市'
                        },
                        {
                            id: '321000',
                            text: '扬州市'
                        },
                        {
                            id: '321100',
                            text: '镇江市'
                        },
                        {
                            id: '321200',
                            text: '泰州市'
                        },
                        {
                            id: '321300',
                            text: '宿迁市'
                        },
                    ],
                    '440000': [ // 广东省
                        {
                            id: '',
                            text: '不限地区'
                        },
                        {
                            id: '440300',
                            text: '深圳市'
                        },
                    ],
                    '330000': [ // 浙江省
                        {
                            id: '',
                            text: '不限地区'
                        },
                        {
                            id: '330100',
                            text: '杭州市'
                        },
                    ],
                    '310100': [ // 上海市
                        {
                            id: '',
                            text: '不限地区'
                        },
                    ],
                    '110100': [ // 北京市
                        {
                            id: '',
                            text: '不限地区'
                        },
                    ],
                },
                value: {
                    value: [],
                    code: [],
                    indexs: [0, 0, 0],
                    ranges: [
                        [{
                                id: '',
                                text: '不限地区'
                            },
                            {
                                id: '000000',
                                text: '全国'
                            },
                            {
                                id: '320000',
                                text: '江苏省'
                            },
                            {
                                id: '110100',
                                text: '北京'
                            },
                            {
                                id: '310100',
                                text: '上海'
                            },
                            {
                                id: '440000',
                                text: '广东省'
                            },
                            {
                                id: '330000',
                                text: '浙江省'
                            }
                        ],
                        [{
                            id: '',
                            text: '不限地区'
                        }, ],
                        [{
                            id: '',
                            text: '不限地区'
                        }, ],
                    ]
                }
            },
            policy_levels: {
                type: 'checkbox',
                event: 'set_filter_checkbox',
                title: '产品（服务）类型',
                items: {
                    "01": "粮油",
                    "02": "果蔬鲜花",
                    "03": "肉禽蛋品",
                    "04": "海鲜水产",
                    "05": "休闲零食",
                    "06": "乳品酒水",
                    "07": "速冻食品",
                    "08": "农业服务",
                    "09": "其他",

                },
                value: []
            },
            policy_level: {
                type: 'checkbox',
                event: 'set_filter_checkbox',
                title: '项目类型',
                items: {
                    "01": "产业园",
                    "02": "重点项目",
                    "03": "其他",

                },
                value: []
            },
            // policy_type: {
            //   type: 'picker_multis',
            //   event: 'set_filter_checkbox',
            //   title: '政策类别',
            //   text: '选择政策类别',
            //   items: {
            //     '320300': '徐州市'
            //   },
            //   value: {
            //     value: [],
            //     code: [],
            //     indexs: [0, 0, 0],
            //     ranges: [
            //       [{
            //           id: '3000',
            //           text: '国家级政策'
            //         },
            //         {
            //           id: '3001',
            //           text: '省级政策'
            //         },
            //         {
            //           id: '3002',
            //           text: '市级政策'
            //         },
            //         {
            //           id: '3003',
            //           text: '区县级政策'
            //         },
            //         {
            //           id: '3004',
            //           text: '贷款政策'
            //         },
            //         {
            //           id: '3005',
            //           text: '担保政策'
            //         },
            //         {
            //           id: '3006',
            //           text: '保险政策'
            //         },
            //         {
            //           id: '3007',
            //           text: '农机补贴'
            //         },
            //         {
            //           id: '3008',
            //           text: '其他补贴'
            //         }
            //       ],

            //     ]
            //   }
            // },
            // policy_types : { type:'checkbox', event:'set_filter_checkbox', title:'政策类别', items:{}, value:[] },
        },
        page: 1,
        NEXT_KEY: 10,

        date_picker: {
            show: false,
        },

    },
    onMultiPickerChanges(e) {
        console.log(e);
        let {
            filter
        } = this.data;
        let {
            indexs,
            ranges,
            value,
            code
        } = filter.items.policy_type.value;
        indexs = e.detail.value;
        console.log(ranges);
        value = [
            ranges[0][indexs[0]].text || "",

        ];
        code = [
            ranges[0][indexs[0]].id || "",

        ];
        this.setData({
            'filter.items.policy_type.value.value': value,
            'POLICY_CATEGORY': code[0],
            indexs,
        })
    },
    onMultiPickerChange: function (e) {
        let {
            filter
        } = this.data;
        let {
            indexs,
            ranges,
            value,
            code
        } = filter.items.areas.value;
        indexs = e.detail.value;

        value = [
            ranges[0][indexs[0]].text || "",
            ranges[1][indexs[1]].text || "",
            ranges[2][indexs[2]].text || "",
        ];
        value = value.map(x => {
            return x == '不限地区' ? '' : x
        })
        code = [
            ranges[0][indexs[0]].id || "",
            ranges[1][indexs[1]].id || "",
            ranges[2][indexs[2]].id || "",
        ];

        this.setData({
            'filter.items.areas.value.value': value,
            'filter.items.areas.value.code': code,
            indexs,
        })
    },

    onMultiPickerColumnChange: async function (e) {
        let {
            column,
            value
        } = e.detail;
        let {
            filter
        } = this.data;
        let {
            items
        } = filter.items.areas;
        let {
            indexs,
            ranges
        } = filter.items.areas.value;

        indexs[column] = value;

        if (column == 0) { // 省
            if (items[ranges[0][value].id]) {
                ranges[1] = items[ranges[0][value].id];
            } else {
                ranges[1] = [{
                    id: '',
                    text: '不限地区'
                }, ]
            }
            ranges[2] = [{
                id: '',
                text: '不限地区'
            }, ];
        }
        if (column == 1) { // 市
            ranges[2] = [{
                id: '',
                text: '不限地区'
            }, ];
            let citys = await utils.getCityList();
            if (ranges[1][value].id) { // 320100
                let districts = citys[2].filter(x => x.id.substr(0, 4) == ranges[1][value].id.substr(0, 4));
                ranges[2] = ranges[2].concat(districts.map(x => {
                    return {
                        id: x.id,
                        text: x.fullname
                    }
                }));
            }
        }
        if (column == 2) { // 区

        }

        this.setData({
            'filter.items.areas.value.ranges': ranges,
            indexs,
        });
    },

    onDatePickerEvent: function (e) {
        switch (e.target.dataset.event) {
            case 'set_filter_daterange': {
                let {
                    key,
                    idx
                } = e.target.dataset;
                this.data.date_picker.callback = (value) => {
                    this.setData({
                        ['filter.items.' + key + '.value.' + idx]: value
                    });
                }
                this.setData({
                    'date_picker.show': true,
                });
            }
            break;
        default: {
            let {
                type,
                detail
            } = e;
            if (this.data.date_picker.callback) {
                if (type == 'confirm') {
                    this.data.date_picker.callback(Date.DateFormat(new Date(detail), 'yyyy-MM-dd'));
                    this.data.date_picker.callback = false;
                }
                if (type == 'cancel') {
                    this.data.date_picker.callback('');
                    this.data.date_picker.callback = false;
                }
            }
            console.log(this.data.date_picker);
            this.setData({
                'date_picker.show': !this.data.date_picker.show
            });
        }
        break;
        }
    },

    onFilterEvent: async function (e) {
        console.log(e);
        switch (e.target.dataset.event) {
            case 'get_filter': {
                this.setData({
                    'filter.show': true,
                    'filter.event': 'set_filter',
                    'filter.reset_event': 'reset_filter',
                });
                if (!this.data.filter.items) {
                    this.setData({
                        'filter.items': JSON.parse(JSON.stringify(this.data.filter_def)),
                    });
                }
                let {
                    area_filter
                } = this.data;
                if (area_filter) {
                    let adcode = area_filter;
                    let {
                        areas
                    } = this.data.filter_def;
                    let {
                        items
                    } = areas;
                    let {
                        ranges
                    } = areas.value;
                    let find_province, find_city, find_district;
                    let indexs = [0, 0, 0];
                    for (let i in ranges[0]) {
                        if (ranges[0][i].id == adcode.substr(0, 2) + '0000') {
                            find_province = ranges[0][i];
                            indexs[0] = i;
                        }
                    }
                    if (find_province) {
                        ranges[1] = items[find_province.id];
                        for (let i in ranges[1]) {
                            if (ranges[1][i].id == adcode.substr(0, 4) + '00') {
                                find_city = ranges[1][i];
                                indexs[1] = i;
                            }
                        }
                    }
                    if (find_city) {
                        ranges[2] = [{
                            id: '',
                            text: '不限地区'
                        }, ];
                        let citys = await utils.getCityList();
                        let districts = citys[2].filter(x => x.id.substr(0, 4) == find_city.id.substr(0, 4));
                        ranges[2] = ranges[2].concat(districts.map(x => {
                            return {
                                id: x.id,
                                text: x.fullname
                            }
                        }));
                        for (let i in ranges[2]) {
                            if (ranges[2][i].id == adcode) {
                                find_district = ranges[2][i];
                                indexs[2] = i;
                            }
                        }
                    }

                    let value = [
                        find_province ? find_province.text : "",
                        find_city ? find_city.text : "",
                        find_district ? find_district.text : "",
                    ];
                    let code = [
                        find_province ? find_province.id : "",
                        find_city ? find_city.id : "",
                        find_district ? find_district.id : "",
                    ];

                    this.setData({
                        'filter.items.areas.value.ranges': ranges,
                        'filter.items.areas.value.value': value,
                        'filter.items.areas.value.code': code,
                        'filter.items.areas.value.indexs': indexs,
                    })
                }
            }
            break;
        case 'reset_filter': {
            let filter_items = this.data.filter.items;
            let all_filter_items = JSON.parse(JSON.stringify(this.data.filter_def));
            for (let i in filter_items) {
                filter_items[i] = all_filter_items[i];
            }
            this.setData({
                'filter.items': filter_items,
                'area_filter': '',
            });
        }
        break;
        case 'set_filter_checkbox': {
            let {
                key,
                val
            } = e.target.dataset;
          
            let items = this.data.filter.items[key];
            let find = items.value.indexOf(val);
            if (find > -1) {
                items.value.splice(find, 1);
            } else {
                items.value.push(val);
            }
            this.setData({
                ['filter.items.' + key]: items
            });
        }
        break;
        case 'set_filter_checkboxs': {
          let {
            key,
            val
          } = e.target.dataset;
          let items = this.data.filter.items[key];
          console.log(items);
          let find = items.value.indexOf(val);
          console.log(find);
          items.value = val;
          let add = this.data.filter.items['policy_level']
          console.log(this.data.filter.items.policy_level);
          if (val == 0) {
            add = {
              0: "稳产保供",
              1: "要害工程",
              2: "绿色发展",
              3: "产业融合"
            }
          } else {
            add = {
              4: "种植业",
              5: "养殖业",
              6: "农产品加工业",
              7: "休闲观光业",
              8: "农业服务业",
            }
          }
          this.setData({
            ['filter.items.' + key]: items,
            'filter.items.policy_level.items':add,
            CATEGORY:val
          });
        }
        break;
        case 'set_filter': {
            this.filter(this.data.filter.items);
            this.setData({
                'filter.show': false,
            });
        }
        break;
        default: {
            this.setData({
                'filter.show': !this.data.filter.show
            });
        }
        break;
        }
    },
    onChange(event) {
        console.log(event);
        if (event.detail.index == 0) {
            this.setData({
                typeList: '2',

            })
            this.getList()
        } else {
            this.setData({
                typeList: '1',

            })
        }
        
    },
    filter: function (filters) {
        console.log(
            filters
        );
        let {
            articles
        } = this.data;
        let {
            doc_date,
            policy_levels,
            policy_level,
            areas
        } = this.data.filter.items;
        console.log('this.data.filter', this.data.filter);
        if (policy_levels) {
            let level = [];
            console.log(policy_levels.value);
            if (typeof (policy_levels.value) == 'object') {
                for (let i in policy_levels.value) {
                    level.push(policy_levels.value[i])
                }
                level = level.join(',');
            } else {
                level = policy_levels.value || '';
            }
            console.log('level', level);
            this.setData({
                PRODUCT_LABEL: level
            })
        }
        if (policy_level) {
            let level = [];
            console.log(policy_level.value);
            if (typeof (policy_level.value) == 'object') {
                for (let i in policy_level.value) {
                    level.push(policy_level.value[i])
                }
                level = level.join(',');
            } else {
                level = policy_level.value || '';
            }
            console.log('level', level);
            this.setData({
                PROJJCT_LABEL: level
            })
        }
        for (let i in articles) {
            let article = articles[i];
            let filter = false; // false-显示 true-不显示
            for (let key in filters) {
                let value = filters[key].value;
                if (!value || value.length == 0) {
                    continue;
                }
                switch (key) {
                    case 'areas': {
                        if (article.AREA == '') {

                        } else {
                            if (value.code && value.code.length > 0 && value.code.indexOf(article.AREA) == -1) {
                                filter = true;
                            }
                        }
                    }
                    break;
                case 'doc_date': {
                    if (article.DOCDATE == '') {

                    } else {
                        if (value[0]) {
                            if (new Date(article.DOCDATE).getTime() < new Date(value[0]).getTime()) {
                                filter = true;
                            }
                        }
                        if (value[1]) {
                            if (new Date(value[1]).getTime() < new Date(article.DOCDATE).getTime()) {
                                filter = true;
                            }
                        }
                    }
                }
                break;
                case 'policy_levels': {
                    if (article.POLICYLEVEL == '') {

                    } else if (value.indexOf(article.POLICYLEVEL) == -1) {
                        filter = true;
                    }
                }
                break;
                case 'policy_types': {
                    if (article.POLICYTYPE == '') {

                    } else if (value.indexOf(article.POLICYTYPE) == -1) {
                        filter = true;
                    }
                }
                break;
                default: {

                }
                break;
                }
            }
            article.filter = filter;
            articles[i] = article;
        }
        if (areas) {
            console.log(areas.value);

            if (areas.value[2]) {
                area = areas.value.value[2]
            } else if (areas.value[1]) {
                area = areas.value.value[1]
            } else if (areas.value[0]) {
                area = areas.value.value[0]
            }
            // if (areas.type == 'picker_region') {
            //   area = areas.value.value[0] || '';
            // }

            // if (areas.type == 'tree_select') {
            //   area = areas.value.value || '';
            // }

            // if (areas.type == 'picker_multi') {
            //   area = areas.value.code[2] || areas.value.code[1] || areas.value.code[0] || '';
            // }

        }
        console.log('areas.value', areas.value);
        this.setData({
            // typeList: articles,
            doc_date1: doc_date.value[0] || '',
            doc_date2: doc_date.value[1] || '',
            APPLY_PROVINCE: areas.value.value[0] || '',
            APPLY_CITY: areas.value.value[1] || '',
            APPLY_COUNTY: areas.value.value[2] || '',
            is_recommend: false,
        });
        this.getList()
    },

    searchArticles: async function () {
        let {
            search_type,
            doc_date1,
            doc_date2,
            area,
            level,
            type,
            sub_type,
            tag,
            word,
            location
        } = this.data;

        wx.showToast({
            title: '搜索中',
            icon: 'loading',
        });

        if (!location.adcode) {
            location = await utils.getUserLocation();
        }

        let is_recommend = false;
        let articles = [];
        let articles_recommend = [];

        let res;
        if (search_type == 'word' || search_type == 'sub_type') {
            console.log('到');
            if (word || sub_type) {
                let data = {
                    PAGE_SIZE: this.data.page,
                    NEXT_KEY: this.data,
                    key,
                    POLICY_CATEGORY: this.data.POLICY_CATEGORY,
                }
                res = await talent.getPolicyList(data);
                console.log(res);
                if (res.show == 0) {
                    articles_recommend = articles_recommend.concat(res.LIST || []);
                } else {
                    articles = articles.concat(res.LIST || []);
                }
            }
        } else if (search_type == 'filter') {
            if (doc_date1 || doc_date2 || area || level || type || word) {
                let types = type.split(',');
                for (let i in types) {
                    res = await talent.slByArea(doc_date1, doc_date2, area, level, types[i], word);
                    if (res.show == 0) {
                        articles_recommend = articles_recommend.concat(res.LIST || []);
                    } else {
                        articles = articles.concat(res.LIST || []);
                    }
                }
            }
        }
        if (tag) {
            res = await talent.slPolicyByLabel(tag)
            if (res.show == 0) {
                articles_recommend = articles_recommend.concat(res.LIST || []);
            } else {
                articles = articles.concat(res.LIST || []);
            }
        }
        if (articles.length == 0) {
            is_recommend = true;
            articles = articles.concat(articles_recommend);
        }
        if (articles.length > 0) {
            articles = utils.repeatArrKey(articles, "ID");
            for (let i in articles) {
                articles[i] = talent.policyDisplay(articles[i]);
            }
            articles = talent.policyOrderby(articles, '');
        }

        let search = '';
        if (search_type == 'word' || search_type == 'sub_type') {
            if (word) {
                search = word;
            } else if (sub_type) {
                for (let t in utils.policyFields().two_policy_types) {
                    for (let tt in utils.policyFields().two_policy_types[t]) {
                        if (tt == sub_type) {
                            search = utils.policyFields().two_policy_types[t][tt];
                            break;
                        }
                    }
                }
            } else if (type) {
                let types = type.split(',');
                search = utils.policyFields().policy_types[types[0]];
            } else if (tag) {
                let tags = tag.split(',');
                search = utils.policyFields().policy_labels[tags[0]];
            } else {
                search = '符合条件';
            }
        } else if (search_type == 'filter') {
            search = '符合条件';
        }

        if (location.adcode) {
            articles = talent.policyOrderby(articles, location.adcode);
        }

        this.setData({
            type: type || '',
            sub_type: sub_type || '',
            word: '',
            search: search,
            articles: articles,
            is_recommend: is_recommend,
        });
        wx.hideToast();
    },

    onSearchEvent: function (e) {
        let {
            search_type,
            sub_type
        } = this.data;
        if (search_type == 'filter') {
            this.setData({
                search_type: 'word',
                sub_type: '',
            });
        }
        this.getList();
    },
    onSearchEvents() {
      wx.navigateTo({
        url: '/sub9/pages/agriculture/ArticleList?keywords=' + this.data.keywords
    });
    },
    initFilter: function () {
        let {
            filter_def
        } = this.data;

        if (filter_def.policy_levels) {
            filter_def.policy_levels.items = utils.policyFields().policy_levels;
        }
        if (filter_def.policy_types) {
            filter_def.policy_types.items = utils.policyFields().policy_types;
        }

        this.setData({
            filter_def
        });

        // let {search_type,doc_date1,doc_date2,area,level,type,sub_type,tag,word,filter_def} = this.data;
        // if (search_type == 'filter') {
        // 	if (level) {
        // 		delete filter_def.policy_levels;
        // 		this.setData({filter_def});
        // 	}
        // } else if (search_type == 'sub_type') {
        // 	if (sub_type) {
        // 		delete filter_def.policy_types;
        // 		this.setData({filter_def});
        // 	}
        // }
    },
    getArticleList(e) {
      console.log(e);
      let {
        articleType,
        type
      } = e.currentTarget.dataset;
      console.log(articleType);
      wx.navigateTo({
        url: '/sub9/pages/agriculture/ArticleList?articleType=' + e.currentTarget.dataset.articletype + '&type=' + type,
      })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
       utils.loadBBXChannelByOptions(options);
        console.log(options);
        let {
            search_type,
            doc_date1,
            doc_date2,
            area,
            level,
            type,
            APPLY_CITY,
            APPLY_PROVINCE,
            sub_type,
            tag,
            word,
            location,
            keywords,
            POLICY_LEVEL,
            APPLY_COUNTY,
            typeList,
            POLICY_CATEGORY
        } = options;
        
        this.setData({
            keywords: keywords || '',
            search_type: search_type || '',
            doc_date1: doc_date1 || '',
            doc_date2: doc_date2 || '',
            area: area || '',
            APPLY_CITY: APPLY_CITY || '',
            APPLY_PROVINCE: APPLY_PROVINCE || '',
            APPLY_COUNTY: APPLY_COUNTY || '',
            area_filter: area || '',
            level: level || '',
            type: type || '',
            POLICY_CATEGORY: sub_type || '',
            POLICY_LEVEL: POLICY_LEVEL ? POLICY_LEVEL : '',
            tag: tag || '',
            word: word || '',
            active: typeList || '0' ,
            typeList:typeList || '2',
            location: location ? JSON.parse(location) : {},
        });

        // this.initFilter();
        if (typeList != '1') {
          this.getList()
        }
        // this.searchArticles();
    },
    getList() {
        this.setData({
            articles: []
        })
        console.log(this.data.APPLY_COUNTY);
        let data = {
            type: this.data.typeList,
            // NEXT_KEY:JSON.stringify(this.data.NEXT_KEY),
            name: this.data.keywords,
            statrTime: this.data.doc_date1,
            endTime: this.data.doc_date2,
            PROVINCE_NAME: this.data.APPLY_PROVINCE,
            CITY_NAME: this.data.APPLY_CITY,
            COUNTY_NAME: this.data.APPLY_COUNTY,
            productLabel: this.data.PRODUCT_LABEL,
            projectLabel: this.data.PROJJCT_LABEL
        }
        console.log(data);
        talent.projectList(data).then(res => {
            console.log(res);
            if (!res.entityList && !this.data.is_recommend) {
                
                this.setData({
                    is_recommend: true,
                    typeList: '3',
                    ifRecom: '1',
                    // NEXT_KEY:JSON.stringify(this.data.NEXT_KEY),
                    name: '',
                    statrTime: '',
                    endTime: '',
                    PROVINCE_NAME: '',
                    CITY_NAME: '',
                    COUNTY_NAME: '',
                    keywords: '',
                    PRODUCT_LABEL: '',
                    PROJJCT_LABEL: ''
                })
                this.getList()
            } else {
                // if (this.data.POLICY_CATEGORY) {
                //   res.LIST.forEach(item => {
                //     item.POLICY_CATEGORY = this.data.POLICY_CATEGORY
                //   });
                // } else {
                //   let add = []
                //   res.LIST.forEach(item => {
                //     add = item.POLICY_CATEGORY.split(',')
                //     item.POLICY_CATEGORY = add[0]
                //   });
                // }
                this.setData({
                    articles: res.entityList,
                    search_type: 'word',

                    // NEXT_KEY:this.data.NEXT_KEY + 5
                })
            }

        })
    },
    getProductDetails(e) {
        wx.navigateTo({
            url: "./productDetails?ID=" + e.currentTarget.dataset.id
        })
    },
    getArticle(e) {
        console.log(e.currentTarget.dataset.id);
        wx.navigateTo({
            url: "./article?ID=" + e.currentTarget.dataset.id + "&POLICY_CATEGORY=" + this.data.POLICY_CATEGORY
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
        return utils.shareWithBBXChannel({});
    }
})