// sub9/pages/agriculture/ArticleList.js
var app = getApp();
import utils from './utils';
import talent from './talent';
import api from '../../../utils/api';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cndUrl: app.globalData.CDNURL,
    keywords: '',
    CATEGORY: '',
    is_recommend:false,
    preffixUrl: utils.preffixUrl(),
    TYPE:'',
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
      // areas: {
      //   type: 'picker_multi',
      //   title: '地区',
      //   text: '选择地区',
      //   items: {
      //     '320000': [ // 江苏省
      //       {
      //         id: '',
      //         text: '不限地区'
      //       },
      //       {
      //         id: '320100',
      //         text: '南京市'
      //       },
      //       {
      //         id: '320200',
      //         text: '无锡市'
      //       },
      //       // {id:'320282',text:'宜兴市'}, // 无网点 不展示
      //       // {id:'320281',text:'江阴市'}, // 无网点 不展示
      //       {
      //         id: '320300',
      //         text: '徐州市'
      //       },
      //       {
      //         id: '320400',
      //         text: '常州市'
      //       },
      //       {
      //         id: '320500',
      //         text: '苏州市'
      //       },
      //       {
      //         id: '320600',
      //         text: '南通市'
      //       },
      //       {
      //         id: '320700',
      //         text: '连云港市'
      //       },
      //       {
      //         id: '320800',
      //         text: '淮安市'
      //       },
      //       {
      //         id: '320900',
      //         text: '盐城市'
      //       },
      //       {
      //         id: '321000',
      //         text: '扬州市'
      //       },
      //       {
      //         id: '321100',
      //         text: '镇江市'
      //       },
      //       {
      //         id: '321200',
      //         text: '泰州市'
      //       },
      //       {
      //         id: '321300',
      //         text: '宿迁市'
      //       },
      //     ],
      //     '440000': [ // 广东省
      //       {
      //         id: '',
      //         text: '不限地区'
      //       },
      //       {
      //         id: '440300',
      //         text: '深圳市'
      //       },
      //     ],
      //     '330000': [ // 浙江省
      //       {
      //         id: '',
      //         text: '不限地区'
      //       },
      //       {
      //         id: '330100',
      //         text: '杭州市'
      //       },
      //     ],
      //     '310100': [ // 上海市
      //       {
      //         id: '',
      //         text: '不限地区'
      //       },
      //     ],
      //     '110100': [ // 北京市
      //       {
      //         id: '',
      //         text: '不限地区'
      //       },
      //     ],
      //   },
      //   value: {
      //     value: [],
      //     code: [],
      //     indexs: [0, 0, 0],
      //     ranges: [
      //       [{
      //           id: '',
      //           text: '不限地区'
      //         },
      //         {
      //           id: '000000',
      //           text: '全国'
      //         },
      //         {
      //           id: '320000',
      //           text: '江苏省'
      //         },
      //         {
      //           id: '110100',
      //           text: '北京'
      //         },
      //         {
      //           id: '310100',
      //           text: '上海'
      //         },
      //         {
      //           id: '440000',
      //           text: '广东省'
      //         },
      //         {
      //           id: '330000',
      //           text: '浙江省'
      //         }
      //       ],
      //       [{
      //         id: '',
      //         text: '不限地区'
      //       }, ],
      //       [{
      //         id: '',
      //         text: '不限地区'
      //       }, ],
      //     ]
      //   }
      // },
      policy_levels: {
        type: 'checkbox',
        event: 'set_filter_checkboxs',
        title: '项目合作',
        items: {
          "0": "重大项目",
          "1": "招商项目",

        },
        value: []
      },
      policy_level: {
        type: 'checkbox',
        event: 'set_filter_checkbox',
        title: '项目类型',
        items: {
          0: "稳产保供",
          1: "要害工程",
          2: "绿色发展",
          3: "产业融合",
          4: "种植业",
          5: "养殖业",
          6: "农产品加工业",
          7: "休闲观光业",
          8: "农业服务业",
        },
        value: []
      },

    },
    LIST3: [{
        name: '开发开发',
        cordname: '开发开发开发开发开发开发开发开发',
        url: '/static/wechat/img/zssn/xmgxhzbg.png',
        type: '1'
      },
      {
        name: '开发开发',
        cordname: '开发开发开发开发开发开发开发开发',
        url: '/static/wechat/img/zssn/xmgxhzbg.png',
        type: '1'
      },
    ],
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
  getList() {
    this.setData({
      is_recommend:false
    })
    let data = {
      CATEGORY: this.data.CATEGORY ? this.data.CATEGORY : '',
      TYPE:this.data.TYPE,
      SELECT:this.data.keywords ? this.data.keywords : ''
    }
    console.log(data);
    talent.project(data).then(res => {
      console.log(res);
      let {LIST,msg} = res
      LIST = JSON.parse(LIST)
      console.log(LIST);
      if (msg == '查询条件为空,返回推荐数据' || msg == '无查询结果,返回推荐数据' || msg == '无查询结果,返回查询列表的推荐数据') {
        this.setData({
          is_recommend:true
        })
      }
      this.setData({
        LIST3:LIST
      })
    })
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
      let itemList = {
        0: "稳产保供",
        1: "要害工程",
        2: "绿色发展",
        3: "产业融合",
        4: "种植业",
        5: "养殖业",
        6: "农产品加工业",
        7: "休闲观光业",
        8: "农业服务业",
      }
      let TYPE = []
      let items = this.data.filter.items[key];
      console.log(items);
      let find = items.value.indexOf(val);
      console.log(find);
      if (find > -1) {
        items.value.splice(find, 1);
      } else {
        items.value.push(val);
      }
      // TYPE.push(itemList[val])
      items.value.forEach(item => {
        TYPE.push(itemList[item])
      });
      console.log(TYPE.toString());
      this.setData({
        ['filter.items.' + key]: items,
        TYPE:TYPE.toString()
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
          3: "产业融合",
          4: "乡村建设"
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
      console.log(this.data.filter.show);
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
    // if (areas) {
    //   console.log(areas.value);

    //   if (areas.value[2]) {
    //     area = areas.value.value[2]
    //   } else if (areas.value[1]) {
    //     area = areas.value.value[1]
    //   } else if (areas.value[0]) {
    //     area = areas.value.value[0]
    //   }
    //   // if (areas.type == 'picker_region') {
    //   //   area = areas.value.value[0] || '';
    //   // }

    //   // if (areas.type == 'tree_select') {
    //   //   area = areas.value.value || '';
    //   // }

    //   // if (areas.type == 'picker_multi') {
    //   //   area = areas.value.code[2] || areas.value.code[1] || areas.value.code[0] || '';
    //   // }

    // }
    // console.log('areas.value', areas.value);
    this.setData({
      // typeList: articles,
      // doc_date1: doc_date.value[0] || '',
      // doc_date2: doc_date.value[1] || '',
      is_recommend: false,
    });
    this.getList()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options);
    let {articleType,type,keywords} = options
    if (keywords == 'undefined') {
      keywords = ''
    }
    this.setData({
      CATEGORY: articleType ? articleType : '',
      TYPE:type ? type : '',
      keywords:keywords ? keywords : ''
    })
    console.log(this.data.CATEGORY);
    this.getList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})