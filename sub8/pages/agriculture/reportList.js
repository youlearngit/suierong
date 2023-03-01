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
    type:'',
    search_type: '',
    doc_date1: '',
    doc_date2: '',
    area: '',
    level: '',
    type: '',
    sub_type: '',
    APPLY_CITY: '',
    APPLY_COUNTY:'',
    tag: '',
    word: '',
    location: '',

    articles: [],
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
     
      // policy_levels: {
      //   type: 'checkbox',
      //   event: 'set_filter_checkbox',
      //   title: '报告类型',
      //   items: {
      //     "0": "日度报告",
      //     "1": "周度报告",
      //     "2": "供需形势",
          
      //   },
      //   value: []
      // },
      policy_type: {
        type: 'checkbox',
        event: 'set_filter_checkbox',
        title: '时间排序',
        text: '选择政策类别',
        items: {
          "0": "最新",
          "1": "发布最早",
        },
        value: []
      },
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
      
      }
      break;
    // case 'reset_filter': {
    //   let filter_items = this.data.filter.items;
    //   let all_filter_items = JSON.parse(JSON.stringify(this.data.filter_def));
    //   for (let i in filter_items) {
    //     filter_items[i] = all_filter_items[i];
    //   }
    //   this.setData({
    //     'filter.items': filter_items,
    //     'area_filter': '',
    //   });
    // }
    // break;
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
    console.log(
      filters
    );
    let {
      articles
    } = this.data;
    let {
      doc_date,
      policy_levels,
      policy_type,
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
      this.setData({
        REPORT_TYPE: level
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
  
    // console.log(article.filter);
    this.setData({
      articles: articles,
      doc_date1: doc_date.value[0],
      doc_date2: doc_date.value[1],
      sort_type : policy_type.value[0],
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
    console.log(doc_date1);
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    utils.loadBBXChannelByOptions(options);
    console.log(options);
    let {
      type
    } = options;
    // search_type: filter		doc_date1,doc_date2,area,level,type,location
    // search_type: word		word,location
    // search_type: sub_type	sub_type,tag,location

    this.setData({
     type:type
    });

    // this.initFilter();

    this.getList()
    // this.searchArticles();
  },
  getList() {
    this.setData({
      articles:[]
    })
    console.log(this.data.APPLY_COUNTY);
    let data = {
      REPORT_TYPE:this.data.type,
      START_TIME:this.data.doc_date1 ? this.data.doc_date1 : '',
      END_TIME:this.data.doc_date2 ? this.data.doc_date2 : '',
      keyWords:this.data.keywords,
      SORT_TYPE:this.data.sort_type,
      // IS_RECOMMEND:'1'
    }
    console.log(data);
    talent.getReportList(data).then(res => {
      console.log(res);
      if (!res.LIST) {
        console.log(1111);
        // wx.showToast({
        //   title: '暂无',
        //   icon: "none",
        //   mask: true,
        //   duration: 2000,
        // });
        this.setData({
          is_recommend: true,
          PAGE_SIZE: '100',
          // NEXT_KEY:JSON.stringify(this.data.NEXT_KEY),
          NEXT_KEY: '1',
          APPLY_PROVINCE: '',
          APPLY_CITY: '',
          APPLY_COUNTY: '',
          POLICY_CATEGORY: '',
          POLICY_LEVEL: '',
          doc_date1: '',
          doc_date2: '',
          keywords: ''
        })
        this.getList()
      } else {
    
        
        this.setData({
          articles: res.LIST,
          search_type: 'word',
          
          // NEXT_KEY:this.data.NEXT_KEY + 5
        })
      }

    })
  },
  getArticle(e) {
    console.log(e.currentTarget.dataset.id);
    wx.navigateTo({
      url: "./report?ID=" + e.currentTarget.dataset.id 
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