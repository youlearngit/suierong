// sub3/pages/bbx/overview.js
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
    location: {},
    location_json: '',

    bbx_channel: '',

    articles: [{}, {}, {}],

    types: {},
    sub_types: {},
    type_to_tag: {},

    types_onoff: {},
    indexImage: 0,
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

      // areas: { type:'picker_region', title:'地区', text:'选择地区', value:{value:[],code:[]} },
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
      // areas : { type:'tree_select', event:'set_filter_tree_select', title:'地区', text:'选择地区', items:[
      // 	{index:'000000',text:'全国',children:[
      // 		{id:'000000',text:'全国'},
      // 		{id:'',text:'不限地区'},
      // 	]},
      // 	{index:'320000',text:'江苏省',children:[
      // 		{id:'320000',text:'江苏省'},
      // 		{id:'320100',text:'南京市'},
      // 		{id:'320200',text:'无锡市'},
      // 		{id:'320282',text:'宜兴市'},
      // 		{id:'320281',text:'江阴市'},
      // 		{id:'320300',text:'徐州市'},
      // 		{id:'320400',text:'常州市'},
      // 		{id:'320500',text:'苏州市'},
      // 		{id:'320600',text:'南通市'},
      // 		{id:'320700',text:'连云港市'},
      // 		{id:'320800',text:'淮安市'},
      // 		{id:'320900',text:'盐城市'},
      // 		{id:'321000',text:'扬州市'},
      // 		{id:'321100',text:'镇江市'},
      // 		{id:'321200',text:'泰州市'},
      // 		{id:'321300',text:'宿迁市'},
      // 	]},
      // 	{index:'440000',text:'广东省',children:[
      // 		{id:'440000',text:'广东省'},
      // 		{id:'440300',text:'深圳市'},
      // 	]},
      // 	{index:'330000',text:'浙江省',children:[
      // 		{id:'330000',text:'浙江省'},
      // 		{id:'330100',text:'杭州市'},
      // 	]},
      // 	{index:'310100',text:'上海市',children:[
      // 		{id:'310100',text:'上海市'},
      // 	]},
      // 	{index:'110100',text:'北京市',children:[
      // 		{id:'110100',text:'北京市'},
      // 	]},
      // ], value:[] },

      // policy_levels : { type:'radio', event:'set_filter_radio', title:'政策层级', items:{}, value:'' },
      policy_levels: {
        type: 'checkbox',
        event: 'set_filter_checkbox',
        title: '政策层级',
        items: {},
        value: []
      },
      // policy_types : { type:'radio', event:'set_filter_radio', title:'政策类别', items:{}, value:'' },
      // policy_types : { type:'checkbox', event:'set_filter_checkbox', title:'政策类别', items:{}, value:[] },
      policy_type: {
        type: 'picker_multis',
        event: 'set_filter_checkbox',
        title: '政策类别',
        text: '选择政策类别',
        items: {
          '320300': '徐州市'
        },
        value: {
          value: [],
          code: [],
          indexs: [0, 0, 0],
          ranges: [
            [{
                id: '3000',
                text: '国家级政策'
              },
              {
                id: '3001',
                text: '省级政策'
              },
              {
                id: '3002',
                text: '市级政策'
              },
              {
                id: '3003',
                text: '区县级政策'
              },
              {
                id: '3004',
                text: '贷款政策'
              },
              {
                id: '3005',
                text: '担保政策'
              },
              {
                id: '3006',
                text: '保险政策'
              },
              {
                id: '3007',
                text: '农机补贴'
              },
              {
                id: '3008',
                text: '其他补贴'
              }
            ],
           
          ]
        }
      },
    },

    date_picker: {
      show: false,
    },

    tree_select: {
      show: false,
    },

  },
  getList() {
    console.log(this.data.POLICY_CATEGORY);
    let data = {
      PAGE_SIZE: '100',
      // NEXT_KEY:JSON.stringify(this.data.NEXT_KEY),
      NEXT_KEY: '1',
      POLICY_CATEGORY: this.data.POLICY_CATEGORY,
      keywords: this.data.keywords
    }
    console.log(data);
    talent.getPolicyList(data).then(res => {
      console.log(res);
      if (!res.LIST) {
        wx.showToast({
          title: '暂无',
          icon: "none",
          mask: true,
          duration: 2000,
        });
      } else {
        let list = []
        res.LIST.forEach(item => {
          item.POLICY_CATEGORY = this.data.POLICY_CATEGORY
          if (item.IS_RECOMMEND == '1') {
            list.push(item)
          }
        });
        this.setData({
          articles: list,
          search_type: 'word',
          // NEXT_KEY:this.data.NEXT_KEY + 5
        })
      }

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
    console.log(ranges);
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
      'filter.items.policy_type.value.code': code,
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

  onRegionCancel: function (e) {
    let {
      type
    } = e.currentTarget.dataset;
    this.setData({
      ['filter.items.' + type + '.value']: {
        value: [],
        code: []
      },
    });
  },

  onRegionChange: function (e) {
    let {
      type
    } = e.currentTarget.dataset;
    let {
      detail
    } = e;
    this.setData({
      ['filter.items.' + type + '.value']: detail,
    });
  },

  onTreeSelectEvent: function (e) {
    let {
      filter_def,
      tree_select
    } = this.data;

    switch (e.target.dataset.event) {
      case 'set_filter_tree_select': {
        let {
          key
        } = e.target.dataset;
        let items = filter_def[key].items;
        this.setData({
          'tree_select.show': true,
          'tree_select.type': key,
          'tree_select.items': items,
        });
      }
      break;
    default: {
      let {
        type
      } = e;
      if (type == 'click-nav') {
        let {
          index
        } = e.detail;

        this.setData({
          'tree_select.mainActiveIndex': index,
        });
      } else if (type == 'click-item') {
        let {
          id
        } = e.detail;
        let {
          type
        } = tree_select;

        let index = tree_select.mainActiveIndex || 0;
        let items = filter_def[type].items[index].children;
        let item = items.find((e) => e.id == id);

        this.setData({
          'tree_select.activeId': id,
          ['filter.items.' + type + '.value']: item,
          'tree_select.show': false,
        });
      } else {
        this.setData({
          'tree_select.show': !this.data.tree_select.show
        });
      }
    }
    break;
    }
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
      this.setData({
        'date_picker.show': !this.data.date_picker.show
      });
    }
    break;
    }
  },

  onFilterEvent: async function (e) {
    console.log(e);
    let {
      location,
      bbx_channel
    } = this.data;
    switch (e.target.dataset.event) {
      case 'get_filter': {
        this.setData({
          'filter.show': true,
          'filter.event': 'set_filter',
          'filter.reset_event': 'reset_filter',
        });
        console.log('this.data.filter',this.data.filter);
        if (!this.data.filter.items) {
          let filter_items = JSON.parse(JSON.stringify(this.data.filter_def));

      

          this.setData({
            'filter.items': filter_items,
          });

          if (filter_items.areas) {

            if (filter_items.areas.type == 'picker_region') {
              location = await utils.getUserLocation();
              this.setData({
                'filter.items.areas.value': {
                  code: [location.adcode.substr(0, 2) + '0000', location.adcode.substr(0, 4) + '00', location.adcode],
                  value: [location.province, location.city, location.district],
                },
              })
            }
            console.log(filter_items.areas.type);
            if (filter_items.areas.type == 'tree_select') {
              location = await utils.getUserLocation();
              let {
                adcode
              } = location;
              let areas = this.data.filter_def.areas.items;
              let find_province = areas.find(x => x.index == (adcode.substr(0, 2) + '0000'));
              if (find_province) {
                let find_city = find_province.children.find(x => x.id == adcode);
                if (!find_city) {
                  find_city = find_province.children.find(x => x.id == (adcode.substr(0, 4) + '00'));
                }
                if (!find_city) {
                  find_city = find_province.children.find(x => x.id == (adcode.substr(0, 2) + '0000'));
                }
                if (find_city) {
                  this.setData({
                    'filter.items.areas.value': find_city,
                  })
                }
              }
            }

            if (filter_items.areas.type == 'picker_multi') {
              location = await utils.getUserLocation();
              let {
                adcode
              } = location;
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
      });
    }
    break;
    case 'set_filter_radio': {
      let {
        key,
        val
      } = e.target.dataset;
      let items = this.data.filter.items[key];
      if (items.value == val) {
        items.value = '';
      } else {
        items.value = val;
      }
      this.setData({
        ['filter.items.' + key]: items
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
      console.log(items);
      this.setData({
        ['filter.items.' + key]: items,
        POLICY_LEVEL: val
      });
      console.log(this.data.filter.items);
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

  filter: function (filters) {

    let {
      type_to_tag,
      location_json
    } = this.data;
    let {
      doc_date,
      policy_levels,
      policy_type,
      areas
    } = filters;
    let doc_date1 = '',
      doc_date2 = '',
      area = '',
      level = '',
      type = '',
      tag = '';
    if (doc_date) {
      doc_date1 = doc_date.value[0] || '';
      doc_date2 = doc_date.value[1] || '';
      
    }
    if (policy_levels) {
      console.log(policy_levels.value);
      if (typeof (policy_levels.value) == 'object') {
        level = [];
        for (let i in policy_levels.value) {
          level.push(policy_levels.value[i])
        }
        level = level.join(',');
      } else {
        level = policy_levels.value || '';
      }
    }
    // if (policy_types) {
    //   if (typeof (policy_types.value) == 'object') {
    //     type = [];
    //     tag = [];
    //     for (let i in policy_types.value) {
    //       let _type = policy_types.value[i];
    //       type.push(_type);
    //       tag.push(type_to_tag[_type]);
    //     }
    //     type = type.join(',');
    //     tag = tag.join(',');
    //   } else {
    //     type = policy_types.value || '';
    //     tag = type_to_tag[type] || '';
    //   }
    // }
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
    let url = `/sub8/pages/agriculture/articles?search_type=filter&doc_date1=${doc_date1}&doc_date2=${doc_date2}&area=${area}&POLICY_LEVEL=${level}&sub_type=${policy_type.value.code}&tag=${tag}&location=${location_json}&APPLY_CITY=${areas.value.value[1] ? areas.value.value[1] : ''}&APPLY_PROVINCE=${areas.value.value[0] ? areas.value.value[0] : ''}&APPLY_COUNTY=${areas.value.value[2] ? areas.value.value[2] : ''}`;
    wx.navigateTo({
      url: url
    });
  },
  get(){
  
    this.setData({
      'policy_type.value.code':'',
      'areas.value.value[0]':'',
      'areas.value.value[1]':'',
      'areas.value.value[2]':'',
    })
  },
  onTypeEvent: function (e) {
    switch (e.target.dataset.event) {
      case 'onoff': {
        let {
          index
        } = e.target.dataset;
        this.setData({
          ['types_onoff.' + index]: this.data.types_onoff[index] == undefined ? true : !this.data.types_onoff[index],
        });
      }
      break;
    default: {

    }
    break;
    }
  },

  searchArticles: function () {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
    });

    let articles = [];
    // talent.selectPolicy('testtest').then(res=>{
    // 	if (res.LIST) {
    // 		articles = res.LIST;
    // 		for(let i in articles) {
    // 			articles[i] = talent.policyDisplay(articles[i]);
    // 		}
    // 	}
    // }).catch(err=>{

    // }).finally(res=>{
    // 	this.setData({
    // 		articles: articles,
    // 	});	
    // 	wx.hideToast();
    // })
  },

  async initData(options) {
    utils.loadBBXChannelByOptions(options);

    let location_json = options.location || "";
    let location = {};
    if (location_json) {
      location = location_json ? JSON.parse(location_json) : {};
    } else {
      location = await utils.getUserLocation();
      location_json = JSON.stringify(location);
    }

    let {
      types,
      sub_types,
      type_to_tag,
      filter_def,
      bbx_channel
    } = this.data;

    bbx_channel = utils.getBBXChannel().channel;

    types = utils.policyFields().policy_types;
    console.log('types', types);
    sub_types = utils.policyFields().two_policy_types;
    console.log('sub_types', sub_types);
    type_to_tag = utils.policyTypeToTag();

    filter_def.policy_levels.items = utils.policyFields().policy_levels;
    filter_def.policy_type.items = utils.policyFields().policy_type;

    this.setData({
      location,
      location_json,
      types,
      sub_types,
      type_to_tag,
      filter_def,
      bbx_channel
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initData(options);
    this.getList()
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
    // this.getList()
    talent.tracking(4);
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