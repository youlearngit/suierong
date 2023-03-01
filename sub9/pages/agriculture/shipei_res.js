// sub3/pages/bbx/shipei_res.js
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
    cndUrls:'https://wxapp.jsbchina.cn:7080/rhedt//',
    preUrl: app.globalData.URL,
    show1: true,
    show2: true,
    show3: true,
    cndUrl: app.globalData.CDNURL,
    tags: '',
    preUrl: app.globalData.URL,

    cndUrl: app.globalData.CDNURL,
    word: '',
    adcode: '',
    listNum: 0,
    LIST1: [],
    LIST2: [],
    LIST3: [],
    is_recommend: false,
    articles: [],

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
      policy_levels: {
        type: 'checkbox',
        event: 'set_filter_checkbox',
        title: '政策层级',
        items: {},
        value: []
      },
      policy_types: {
        type: 'checkbox',
        event: 'set_filter_checkbox',
        title: '政策类别',
        items: {},
        value: []
      },
    },

    date_picker: {
      show: false,
    },

    location: {},
    mkData: [],
    POLICY_LEVEL: '3000',
    INDUTRY_LABEL: '2001',
    POLICY_CATEGORY: '3000',
    REPORT_TYPE: '01',
    PRODUCT_LABEL: '02',
    talent_staffs: [],

  },

  phoneCall: function (e) {
    let {
      phone
    } = e.currentTarget.dataset;
    if (phone) {
      wx.makePhoneCall({
        phoneNumber: phone,
      })
    }
  },
  getPhone(e) {
    console.log(e.currentTarget.dataset.phone);
    wx.makePhoneCall({

      phoneNumber: e.currentTarget.dataset.phone,

      success: function () {

        console.log("拨打电话成功！")

      },

      fail: function () {

        console.log("拨打电话失败！")

      }

    })
  },
  // 跳转专员
  getMore() {
    // /sub8/pages/agriculture/staff_list?RCtype=1&location={{location_json}}
    wx.navigateTo({
      url: "/sub8/pages/agriculture/staff_list?RCtype=1&location=" + JSON.stringify(this.data.location)
    })
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

  onFilterEvent: function (e) {
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
      }
      break;
    case 'reset_filter': {
      this.setData({
        'filter.items': JSON.parse(JSON.stringify(this.data.filter_def)),
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
      articles
    } = this.data;
    for (let i in articles) {
      let article = articles[i];
      let filter = false; // false-显示 true-不显示
      for (let key in filters) {
        let value = filters[key].value;
        if (!value || value.length == 0) {
          continue;
        }
        switch (key) {
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
    this.setData({
      articles: articles,
    });
  },

  initMkData: async function () {
    let {
      location,
      mkData
    } = this.data;
    let res;
    mkData = [];

    location = await utils.getUserLocation();

    for (let page = 1; page < 3; page++) {
      res = await talent.getNetwork(page);
      if (res.LIST) {
        mkData = mkData.concat(res.LIST)
      }
      if (!res.NEXT_KEY) {
        break;
      }
    }
    for (let i in mkData) {
      mkData[i].ORG_FULL_NAME = mkData[i].ORG_FULL_NAME.replace(/股份有限公司/g, '');

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
    }
    mkData.sort(function (x, y) {
      return x.distance_km - y.distance_km;
    });
    this.setData({
      location,
      mkData
    });
  },

  searchRes: async function () {
    let {
      tags,
      word,
      adcode,
      is_recommend
    } = this.data;

    if (!tags && !word) {
      return;
    }

    wx.showToast({
      title: '加载中',
      icon: 'loading',
    });

    let arr = [];
    let articles = [];
    let articles_recommend = [];
    let talent_staffs = [];
    let res;

    if (tags) {
      let tag_arr = tags.split(',');
      let tag_arr_and = [];
      let tag_arr_or = [];
      let tag_arr_invalid = [];

      for (let i in tag_arr) {
        let _tag = tag_arr[i];
        if (['70'].indexOf(_tag.substr(0, 2)) > -1) { // 需求想法:70XX
          tag_arr_invalid.push(_tag);
          continue; // 不作为匹配条件
        }
        if (['3100', '3200', '3300', '3400'].indexOf(_tag) > -1) { // 3100:人才工程 3200:待遇落实 3300:企业发展 3400:公共服务
          tag_arr_invalid.push(_tag);
          continue; // 不作为匹配条件
        }
        if (['40', '50'].indexOf(_tag.substr(0, 2)) > -1) { // 学历:40XX 国籍:50XX
          tag_arr_and.push(_tag);
          continue;
        }
        if (['31', '32', '33', '34'].indexOf(_tag.substr(0, 2)) > -1) { // 政策类别:31XX,32XX,33XX,34XX
          tag_arr_and.push(_tag);
          continue;
        }
        tag_arr_or.push(_tag);
      }

      if (tag_arr_and.length > 0) {
        if (tag_arr_or.length > 0) {
          for (let i in tag_arr_or) {
            let _tags = tag_arr_and.join(',');
            _tags += `,${tag_arr_or[i]}`;
            res = await talent.slByLabel(_tags);
            if (res.LIST) {
              let _articles = res.LIST;
              for (let i in _articles) {
                _articles[i] = talent.policyDisplay(_articles[i]);
              }
              if (res.show == '0') {
                articles_recommend = articles_recommend.concat(_articles);
              } else {
                articles = articles.concat(_articles);
              }
            }
          }
        } else {
          res = await talent.slByLabel(tag_arr_and.join(','));
          if (res.LIST) {
            let _articles = res.LIST;
            for (let i in _articles) {
              _articles[i] = talent.policyDisplay(_articles[i]);
            }
            if (res.show == '0') {
              articles_recommend = articles_recommend.concat(_articles);
            } else {
              articles = articles.concat(_articles);
            }
          }
        }
      } else {
        if (tag_arr_or.length > 0) {
          res = await talent.slPolicyByLabel(tag_arr_or.join(','));
          if (res.LIST) {
            let _articles = res.LIST;
            for (let i in _articles) {
              _articles[i] = talent.policyDisplay(_articles[i]);
            }
            if (res.show == '0') {
              articles_recommend = articles_recommend.concat(_articles);
            } else {
              articles = articles.concat(_articles);
            }
          }
        }
      }

      // if (tag_arr_and.length>0) {
      // 	res = await talent.slByLabel(tag_arr_and.join(','));
      // 	if (res.LIST) {
      // 		let _articles = res.LIST;
      // 			for(let i in _articles) {
      // 				_articles[i] = talent.policyDisplay(_articles[i]);
      // 			}
      // 			articles = articles.concat(_articles);
      // 	}
      // }
      // if (tag_arr_or.length>0) {
      // 	res = await talent.slPolicyByLabel(tag_arr_or.join(','));
      // 	if (res.LIST) {
      // 		let _articles = res.LIST;
      // 			for(let i in _articles) {
      // 				_articles[i] = talent.policyDisplay(_articles[i]);
      // 			}
      // 			articles = articles.concat(_articles);
      // 	}
      // }
    }

    if (word) {
      res = await talent.selectPolicy(word);
      if (res.LIST) {
        let _articles = res.LIST;
        for (let i in _articles) {
          _articles[i] = talent.policyDisplay(_articles[i]);
        }
        if (res.show == '0') {
          articles_recommend = articles_recommend.concat(_articles);
        } else {
          articles = articles.concat(_articles);
        }
      }
    }

    // await this.initMkData();
    // let {mkData} = this.data;

    // if (adcode) {
    // 	res = await talent.selectStaff({ type:1, code:adcode })
    // 	if (!res.LIST) {
    // 		let adcode_city = adcode.substr(0,4)+'00';
    // 		res = await talent.selectStaff({ type:1, code:adcode_city })
    // 	}
    // 	if (!res.LIST) {
    // 		res = await talent.selectStaff({ type:5 })
    // 	}
    // 	if (res.LIST) {
    // 		talent_staffs = res.LIST;
    // 		talent_staffs = talent_staffs.filter(x=>x.AGENCYNO);
    // 		for (let i in talent_staffs) {
    // 			let mk =  mkData.find(x=>x.ORG_CODE==talent_staffs[i].AGENCYNO);
    // 			if (mk) {
    // 				talent_staffs[i].mk = mk;
    // 				talent_staffs[i].distance = mk.distance;
    // 				talent_staffs[i].distance_km = mk.distance_km;
    // 			} 
    // 		}
    // 		talent_staffs.sort(function(x,y){
    // 			return x.distance_km - y.distance_km;
    // 		});
    // 		talent_staffs = [
    // 			talent_staffs.find(x=>x.TYPE=='1'),
    // 			talent_staffs.find(x=>x.TYPE=='2')
    // 		];
    // 		talent_staffs = talent_staffs.filter(x=>x);
    // 	}
    // }

    if (articles.length == 0) {
      articles = articles_recommend;
      is_recommend = true;
    }

    articles = utils.repeatArrKey(articles, "ID");
    articles = talent.policyOrderby(articles, adcode);

    this.setData({
      is_recommend,
      articles: articles,
      adcode,
      talent_staffs,
    });
    wx.hideToast();
  },

  initFilter: function () {
    let {
      filter_def
    } = this.data;

    filter_def.policy_levels.items = utils.policyFields().policy_levels;
    filter_def.policy_types.items = utils.policyFields().policy_types;

    this.setData({
      filter_def
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options', options);
    utils.loadBBXChannelByOptions(options);

    let {
      tags,
      word,
      adcode,
      answers
    } = options;
    if (answers) {
      answers = JSON.parse(answers)
    }
    this.setData({
      tags,
      word,
      adcode,
      answers
    })

    // this.initFilter();
    this.searchRes();
    this.getStaffs()
    this.getList()
  },
  getMores() {
  //   getTypeList: [{
  //     name: '政策资讯',
  //     url: '/sub8/pages/agriculture/overview',
  //     tj: true
  //   },
  //   {
  //     name: '市场分析',
  //     url: '/sub8/pages/agriculture/marketAnalysis',
  //     tj: false
  //   },
  //   {
  //     name: '最新贷款政策',
  //     url: '/sub8/pages/agriculture/projectCooperation',
  //     tj: false
  //   },
  // ],
    let { show1, show2 ,show3 } = this.data
    if (show1 == 'false') {
      wx.navigateTo({
        url:'/sub8/pages/agriculture/overview'
      })
    } else if (show2 == 'false') {
      wx.navigateTo({
        url:  '/sub8/pages/agriculture/marketAnalysis',
      })
    } else if (show3 == 'false') {
      wx.navigateTo({
        url: '/sub8/pages/agriculture/projectCooperation',
      })
    }
  },
  getList() {
    console.log(this.data.answers);
    let that = this
    let list = []
    let listNum = this.data.listNum
    let INDUSTRY_LABEL = ''

    this.data.answers['industry'].forEach(element => {

    });
    let POLICY_CATEGORY = ''
    let PRODUCT_LABEL = ''
    let data = {
      POLICY_LEVEL: this.data.answers['policy'] ? this.data.answers['policy'] : '',
      INDUSTRY_LABEL: this.data.answers['industry'].toString() ? this.data.answers['industry'].toString() : '',
      POLICY_CATEGORY: this.data.answers['aspect'].toString() ? this.data.answers['aspect'].toString() : '',
      REPORT_TYPE: this.data.answers['analyse'] ? this.data.answers['analyse'] : '',
      PRODUCT_LABEL: this.data.answers['deal'].toString() ? this.data.answers['deal'].toString() : '',
    }
    console.log('data', data);
    talent.selectPolicy(data).then(res => {
      console.log(res);
      let {
        LIST1,
        LIST2,
        LIST3,
        show1,
        show2,
        show3,
      } = res
      if (LIST1) {
        // LIST1 = JSON.parse(LIST1)
        if (show1 == 'false') {
          listNum = (listNum + LIST1.length) <= 8  ? (listNum + LIST1.length) : 8
        } else {
          listNum = listNum + LIST1.length
        } 
        let add = []
        LIST1.forEach(item => {
            add = item.POLICY_CATEGORY.split(',')
            item.POLICY_CATEGORY = add[0]
          });

      }
      if (LIST2) {
        // LIST2 = JSON.parse(LIST2)
        listNum = listNum + LIST2.length

      }
      if (LIST3) {
        // LIST3 = JSON.parse(LIST3)
        if (show3 == 'false') {
          
          listNum = (listNum + LIST3.length) <= 8  ? (listNum + LIST3.length) : 8
        } else {

          listNum = listNum + LIST3.length
        }
        let add = []
        LIST3.forEach(item => {
            add = item.PRODUCT_LABEL.split(',')
            item.PRODUCT_LABEL = add[0]
            // if (item.length <= 8) {
              
            // }
          });

      }
      console.log(listNum);
      setTimeout(function () {
        that.setData({
          listNum: listNum,
          LIST1: LIST1,
          LIST2: LIST2,
          LIST3: LIST3,
          show1: show1,
          show2: show2,
          show3: show3,

        })
      }, 100)
      wx.hideToast();
    }).catch(err => {

    })
  },
  initMkData: async function () {
    let {
      location,
      mkData
    } = this.data;
    let res;
    mkData = [];

    location = await utils.getUserLocation();

    for (let page = 1; page < 3; page++) {
      res = await talent.getNetwork(page);
      if (res.LIST) {
        mkData = mkData.concat(res.LIST)
      }
      if (!res.NEXT_KEY) {
        break;
      }
    }
    for (let i in mkData) {
      mkData[i].ORG_FULL_NAME = mkData[i].ORG_FULL_NAME.replace(/股份有限公司/g, '');

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
    }
    mkData.sort(function (x, y) {
      return x.distance_km - y.distance_km;
    });
    this.setData({
      location,
      mkData
    });
  },
  getStaffs: async function () {
    await this.initMkData();
    let {
      location,
      mkData,
      talent_staffs,
      bbx_channel
    } = this.data;
    let res;
    console.log(location);
    talent_staffs = [];

    if (bbx_channel == '320282') {
      talent_staffs = await talent.tdycStaff();
    } else {
      let adcode = location.adcode;

      res = await talent.selectStaff({
        type: 1,
        PROVINCE: location.values[0],
        CITY: location.values[1],
        AREA: location.values[2]
      });
      talent_staffs = res.placeList

      let adcode_city = adcode.substr(0, 4) + '00';
      res = await talent.selectStaff({
        type: 1,
        PROVINCE: location.values[0],
        CITY: location.values[1],
        AREA: location.values[2]
      });
      talent_staffs = res.placeList


    }
    console.log('talent_staffs', talent_staffs);
    this.setData({
      talent_staffs: talent_staffs
    })
    return talent_staffs;
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