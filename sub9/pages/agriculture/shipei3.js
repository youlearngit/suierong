// sub3/pages/bbx/shipei3.js
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
    preUrl: app.globalData.URL,
    cndUrls:'https://wxapp.jsbchina.cn:7080/rhedt//',
    words: '',
    cndUrl: app.globalData.CDNURL,
    searchListTrue: false,
    searchList: [],
    listNum: 0,
    LIST1: [],
    LIST2: [],
    LIST3: [],
    show1: true,

    bbx_channel: '',
    wordTrue: false,
    time_now: Date.DateFormat(new Date(), 'yyyy年MM月dd日 hh:mm'),
    getTypeList: [{
        name: '政策资讯',
        url: '/sub8/pages/agriculture/overview',
        tj: true
      },
      {
        name: '市场分析',
        url: '/sub8/pages/agriculture/marketAnalysis',
        tj: false
      },
      {
        name: '最新贷款政策',
        url: '/sub8/pages/agriculture/projectCooperation',
        tj: false
      },
    ],
    overTrue:false,
    questions_ways: [ // 问题路线定义
      // "identity",
      "want",
      {
        "7001": ["education", "nationality", "trade", "owntags", "tags"],
        "7002": ["education", "nationality", "trade", "owntags"],
        "7003": ["cate", "subcate", "owntags"],
      },
    ],
    questions_way: [], // 问题路线
    questions_def: { // 问题定义
      "identity": {
        title: "您目前的身份是？",
        type: "radio",
        items: {}
      },
      "want": {
        title: "请问您想？",
        type: "radio",
        items: {}
      },
      "rank": {
        title: "您拥有的职称？",
        type: "radio",
        items: {}
      },
      "cate": {
        title: "您想查看哪类商机？",
        type: "radio",
        items: {}
      },
      "cateword": {
        title: "试试输入您感兴趣的关键字？",
        type: "input",
        itmes: {}
      },
      "subcate": {
        title: "您想查看哪些产品信息？",
        type: "radio",
        items: {}
      },
      // "age": {title:"您的年龄范围？",type:"radio",items:utils.questionFields().ages},
      "birthday": {
        title: "您的出生日期？",
        type: "datepicker",
        items: {}
      },
      "education": {
        title: "您想了解什么层级的政策？",
        type: "radio",
        items: {}
      },
      "nationality": {
        title: "您想了解什么行业政策？",
        type: "radio",
        items: {}
      },
      "trade": {
        title: "您具体想了解哪一方面？",
        type: "radio",
        items: {}
      },
      "years": {
        title: "您在该领域的工作年限？",
        type: "radio",
        items: utils.questionFields().yearss
      },
      "edunumber": {
        title: "您的团队研究生以上学历人数？",
        type: "radio",
        items: utils.questionFields().edunumbers
      },
      "owntags": {
        title: "选择适合您的标签？",
        type: "checkbox",
        items: {}
      },
      "tags": {
        title: "选择适合您企业的标签？",
        type: "checkbox",
        items: {}
      },
    },
    toView:'',
    selectAn: [],
    firstSelect: [],
    questions_sn: {
      "want": {
        title: "请问您想？",
        questionName: 'want',
        type: "radio",
        radioTrue: false,
        items: [{
            name: "查询政策",
            type: '01',
            trueOrfalse: false
          },
          {
            name: "了解市场",
            type: '02',
            trueOrfalse: false
          },
          {
            name: "寻找商机",
            type: '03',
            trueOrfalse: false
          },
        ]
      },
      "businessOpportunity": {
        title: "您想查看哪类商机？",
        questionName: 'businessOpportunity',
        type: "radio",
        radioTrue: false,
        items: [{
            name: "农产品交易",
            type: '0',
            trueOrfalse: false
          },
          {
            name: "热门项目",
            type: '1',
            trueOrfalse: false
          },
          // {
          //   name: "招商引资",
          //   type: '2',
          //   trueOrfalse: false
          // },
        ]
      },
      "policy": {
        title: "您想了解什么层级的政策？",
        questionName: 'policy',
        type: "radio",
        radioTrue: false,
        items: [{
            name: "国家级政策",
            type: '0',
            trueOrfalse: false
          },
          {
            name: "省级政策",
            type: '1',
            trueOrfalse: false
          },
          {
            name: "市级政策",
            type: '2',
            trueOrfalse: false
          },
          {
            name: "区（县）级政策",
            type: '3',
            trueOrfalse: false
          },
        ],
      },
      "bazaar": {
        title: "您想了解哪一方面？",
        questionName: 'bazaar',
        type: "radio",
        radioTrue: false,
        items: [{
            name: "市场指数",
            type: '01',
            trueOrfalse: false
          },
          {
            name: "产品价格",
            type: '02',
            trueOrfalse: false
          },
          {
            name: "市场分析",
            type: '03',
            trueOrfalse: false
          },

        ],
      },
      "analyse": {
        title: "您想查看哪类分析报告？",
        questionName: 'analyse',
        type: "radio",
        radioTrue: false,
        items: [{
            name: "日度报告",
            type: '0',
            trueOrfalse: false
          },
          {
            name: "周度报告",
            type: '1',
            trueOrfalse: false
          },
          {
            name: "供需形势",
            type: '2',
            trueOrfalse: false
          },

        ],
      },
      "HotItem": {
        title: "您想查看哪类热门项目？",
        questionName: 'HotItem',
        type: "radio",
        radioTrue: false,
        items: [{
            name: "重大项目",
            type: '0',
            trueOrfalse: false
          },
          {
            name: "招商产业",
            type: '1',
            trueOrfalse: false
          },
         

        ],
      },
      "price": {
        title: "您想查询哪类产品市场价格？",
        questionName: 'price',
        type: "radio",
        radioTrue: false,
        items: [{
            name: "粮食",
            type: '粮食',
            trueOrfalse: false
          },
          {
            name: "棉花",
            type: '棉花',
            trueOrfalse: false
          },
          {
            name: "油料",
            type: '油料',
            trueOrfalse: false
          },
          {
            name: "食糖",
            type: '食糖',
            trueOrfalse: false
          },
          {
            name: "蔬菜",
            type: '蔬菜',
            trueOrfalse: false
          },
          {
            name: "水果",
            type: '水果',
            trueOrfalse: false
          },
          {
            name: "畜禽",
            type: '畜禽',
            trueOrfalse: false
          },
          {
            name: "水产品",
            type: '水产品',
            trueOrfalse: false
          },

        ],
      },
      "cereal": {
        title: "您想查询哪项产品市场价格？",
        questionName: 'cereal',
        type: "radio",
        radioTrue: false,
        items: [{
            name: "稻谷",
            type: '稻谷',
            trueOrfalse: false
          },
          {
            name: "小麦",
            type: '小麦',
            trueOrfalse: false
          },
          {
            name: "玉米",
            type: '玉米',
            trueOrfalse: false
          },
          {
            name: "玉米棒",
            type: '玉米棒',
            trueOrfalse: false
          },
          {
            name: "大豆",
            type: '大豆',
            trueOrfalse: false
          },
          {
            name: "马铃薯",
            type: '马铃薯',
            trueOrfalse: false
          },
        ],
      },
      "vegetable": {
        title: "您想查询哪项产品市场价格？",
        questionName: 'vegetable',
        type: "radio",
        radioTrue: false,
        items: [{
            name: "大白菜",
            type: '大白菜',
            trueOrfalse: false
          },
          {
            name: "黄瓜",
            type: '黄瓜',
            trueOrfalse: false
          },
          {
            name: "光皮黄瓜",
            type: '光皮黄瓜',
            trueOrfalse: false
          },
          {
            name: "大蒜",
            type: '大蒜',
            trueOrfalse: false
          }
        ],
      },
      "cotton": {
        // '棉纱', '棉壳', '棉短绒', '绵粕', '棉油'
        title: "您想查询哪项产品市场价格？",
        questionName: 'cotton',
        type: "radio",
        radioTrue: false,
        items: [{
            name: "棉纱",
            type: '棉纱',
            trueOrfalse: false
          },
          {
            name: "棉壳",
            type: '棉壳',
            trueOrfalse: false
          },
          {
            name: "棉短绒",
            type: '棉短绒',
            trueOrfalse: false
          },
          {
            name: "绵粕",
            type: '绵粕',
            trueOrfalse: false
          },
          {
            name: "棉油",
            type: '棉油',
            trueOrfalse: false
          }
        ],
      },
      "livestock": {
        title: "您想查询哪项产品市场价格？",
        questionName: 'livestock',
        type: "radio",
        radioTrue: false,
        items: [{
            name: "猪",
            type: '猪',
            trueOrfalse: false
          },
          {
            name: "牛",
            type: '牛',
            trueOrfalse: false
          },
          {
            name: "羊",
            type: '羊',
            trueOrfalse: false
          },
          {
            name: "禽类",
            type: '禽类',
            trueOrfalse: false
          },
          {
            name: "禽蛋",
            type: '禽蛋',
            trueOrfalse: false
          }
        ],
      },
      "aquaticProducts": {
        title: "您想查询哪项产品市场价格？",
        questionName: 'aquaticProducts',
        type: "radio",
        radioTrue: false,
        items: [{
            name: "淡水产品",
            type: '淡水产品',
            trueOrfalse: false
          },
          {
            name: "海水产品",
            type: '海水产品',
            trueOrfalse: false
          },

        ],
      },
      "industry": {
        title: "您想了解什么行业的政策？",
        questionName: 'industry',
        type: "index",
        radioTrue: false,
        items: [{
            name: "种植业",
            type: '2000',
            trueOrfalse: false
          },
          {
            name: "畜牧业",
            type: '2001',
            trueOrfalse: false
          },
          {
            name: "农资制造业",
            type: '2004',
            trueOrfalse: false
          },
          
          
          {
            name: "农副产品加工业",
            type: '2003',
            trueOrfalse: false
          },
          {
            name: "农副产品批发零售业",
            type: '2006',
            trueOrfalse: false
          },
          {
            name: "林业",
            type: '2008',
            trueOrfalse: false
          },
          
          {
            name: "渔业",
            type: '2002',
            trueOrfalse: false
          },
          {
            name: "其他",
            type: '2007',
            trueOrfalse: false
          },
          {
            name: "农用设备制造业",
            type: '2005',
            trueOrfalse: false
          },
        ],
      },
      "deal": {
        title: "您想查看哪类产品信息？",
        questionName: 'deal',
        type: "index",
        radioTrue: false,
        items: [{
            name: "粮油",
            type: '01',
            trueOrfalse: false
          },
          {
            name: "果蔬鲜花",
            type: '02',
            trueOrfalse: false
          },
          {
            name: "肉禽蛋品",
            type: '03',
            trueOrfalse: false
          },
          {
            name: "海鲜水产",
            type: '04',
            trueOrfalse: false
          },
          {
            name: "休闲零食",
            type: '05',
            trueOrfalse: false
          },
          {
            name: "乳品酒水",
            type: '06',
            trueOrfalse: false
          },
          {
            name: "速冻食品",
            type: '07',
            trueOrfalse: false
          },
          {
            name: "其他",
            type: '09',
            trueOrfalse: false
          },

        ],
      },
      "majorProject": {
        title: "您想查看哪类重大项目？",
        questionName: 'majorProject',
        type: "radio",
        radioTrue: false,
        items: [{
            name: "稳产保供",
            type: '稳产保供',
            trueOrfalse: false
          },
          {
            name: "要害工程",
            type: '要害工程',
            trueOrfalse: false
          },
          {
            name: "绿色发展",
            type: '绿色发展',
            trueOrfalse: false
          },
          {
            name: "产业融合",
            type: '产业融合',
            trueOrfalse: false
          },
          {
            name: "乡村建设",
            type: '乡村建设',
            trueOrfalse: false
          }
        ],
      },
      "InvestmentIndustry": {
        title: "您想查看哪类招商产业？",
        questionName: 'InvestmentIndustry',
        type: "radio",
        radioTrue: false,
        items: [{
            name: "种植业",
            type: '种植业',
            trueOrfalse: false
          },
          {
            name: "养殖业",
            type: '养殖业',
            trueOrfalse: false
          },
          {
            name: "农产品加工业",
            type: '农产品加工业',
            trueOrfalse: false
          },
          {
            name: "休闲观光业",
            type: '休闲观光业',
            trueOrfalse: false
          },
          {
            name: "农业服务业",
            type: '农业服务业',
            trueOrfalse: false
          }
        ],
      },
      "aspect": {
        title: "您具体想了解哪一方面？",
        questionName: 'aspect',
        type: "radio",
        radioTrue: false,
        items: [{
            name: "贷款政策",
            type: '3004',
            trueOrfalse: false
          },
          {
            name: "担保政策",
            type: '3005',
            trueOrfalse: false
          },
          {
            name: "保险政策",
            type: '3006',
            trueOrfalse: false
          },
          {
            name: "农机补贴",
            type: '3007',
            trueOrfalse: false
          },
          {
            name: "其他",
            type: '3008',
            trueOrfalse: false
          }
        ],
      },
      "pig": {
        // '猪肉', '生猪', '仔猪', '母猪'
        title: "您具体想了解哪一方面？",
        questionName: 'pig',
        type: "radio",
        radioTrue: false,
        items: [{
            name: "猪肉",
            type: '猪肉',
            trueOrfalse: false
          },
          {
            name: "生猪",
            type: '生猪',
            trueOrfalse: false
          },
          {
            name: "仔猪",
            type: '仔猪',
            trueOrfalse: false
          },
          {
            name: "母猪",
            type: '母猪',
            trueOrfalse: false
          },
          
        ],
      },
      "cow": {
        // '猪肉', '生猪', '仔猪', '母猪'
        title: "您具体想了解哪一方面？",
        questionName: 'cow',
        type: "radio",
        radioTrue: false,
        items: [{
            name: "黄牛",
            type: '黄牛',
            trueOrfalse: false
          },
          {
            name: "牦牛",
            type: '牦牛',
            trueOrfalse: false
          },
          {
            name: "水牛",
            type: '水牛',
            trueOrfalse: false
          },
          
          
        ],
      },
      "sheep": {
        // '猪肉', '生猪', '仔猪', '母猪'
        title: "您具体想了解哪一方面？",
        questionName: 'sheep',
        type: "radio",
        radioTrue: false,
        items: [{
            name: "山羊",
            type: '山羊',
            trueOrfalse: false
          },
          {
            name: "绵羊",
            type: '绵羊',
            trueOrfalse: false
          },
        
          
        ],
      },
      "poultry": {
        // '猪肉', '生猪', '仔猪', '母猪'
        title: "您具体想了解哪一方面？",
        questionName: 'poultry',
        type: "radio",
        radioTrue: false,
        items: [{
            name: "活鸡",
            type: '活鸡',
            trueOrfalse: false
          },
          {
            name: "活鸭",
            type: '活鸭',
            trueOrfalse: false
          },
          {
            name: "活鹅",
            type: '活鹅',
            trueOrfalse: false
          },
        
          
        ],
      },
      "egg": {
        // '猪肉', '生猪', '仔猪', '母猪'
        title: "您具体想了解哪一方面？",
        questionName: 'egg',
        type: "radio",
        radioTrue: false,
        items: [{
            name: "鸡蛋",
            type: '鸡蛋',
            trueOrfalse: false
          },
          {
            name: "鸭蛋",
            type: '鸭蛋',
            trueOrfalse: false
          },
          {
            name: "活鹅",
            type: '活鹅',
            trueOrfalse: false
          },
        
          
        ],
      },
      "fresh": {
        // '猪肉', '生猪', '仔猪', '母猪'
        title: "您具体想了解哪一方面？",
        questionName: 'fresh',
        type: "radio",
        radioTrue: false,
        items: [{
            name: "草鱼",
            type: '草鱼',
            trueOrfalse: false
          },
          {
            name: "鲢鱼",
            type: '鲢鱼',
            trueOrfalse: false
          },
          {
            name: "鳙鱼",
            type: '鳙鱼',
            trueOrfalse: false
          },
          {
            name: "鲤鱼",
            type: '鲤鱼',
            trueOrfalse: false
          },
          {
            name: "鲫鱼",
            type: '鲫鱼',
            trueOrfalse: false
          },
        ],
      },
      "seawater": {
        // '猪肉', '生猪', '仔猪', '母猪'
        title: "您具体想了解哪一方面？",
        questionName: 'seawater',
        type: "radio",
        radioTrue: false,
        items: [{
            name: "带鱼",
            type: '带鱼',
            trueOrfalse: false
          },
          
        ],
      },
    },
    answers: {
      "identity": "",
      "industry": [],
      "aspect": [],
      "deal": [],
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
    selectQuestion: [],
    scroll_into: "",
    records: [],

    popup: {
      show: false,
      items: {}
    },
    date_picker: {
      show: false,
    },
    input_event: '',
    location: {},

    location: {},
    mkData: [],
    talent_staffs: [],

  },

  onDatePickerEvent: function (e) {
    let {
      event
    } = e.currentTarget.dataset;
    let {
      questions_def,
      answers
    } = this.data;
    switch (event) {
      case 'birthday': {
        this.data.date_picker.callback = (value) => {
          this.setData({
            ['answers.' + event]: value
          });
          this.next(event);
        }
        this.setData({
          'date_picker.show': true,
          'date_picker.min_date': new Date((new Date().getFullYear() - 80), 1, 1).getTime(),
          'date_picker.max_date': new Date(new Date().getFullYear(), 1, 1).getTime(),
        });
      }
      break;
    default: {
      let {
        type,
        detail
      } = e;
      if (type == 'confirm') {
        this.data.date_picker.callback(Date.DateFormat(new Date(detail), 'yyyy-MM-dd'));
        this.data.date_picker.callback = false;
      }
      if (type == 'cancel') {
        this.data.date_picker.callback('');
        this.data.date_picker.callback = false;
      }
      this.setData({
        'date_picker.show': !this.data.date_picker.show
      });
    }
    break;
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
  onPopupEvent: function (e) {
    console.log(this.data.questions_sn);
    let {
      event,
      action,
      index,
      title,
      questionName
    } = e.currentTarget.dataset;
    let {
      questions_def,
      answers,
      records,
      popup
    } = this.data;
    if (event == 1) {
      let trueNum = 0
      popup.items.items[index].trueOrfalse = !popup.items.items[index].trueOrfalse
      // popup.items.radioTrue = 
      for (let i = 0; i < popup.items.items.length; i++) {
        if (popup.items.items[i].trueOrfalse == true) {
          trueNum = trueNum + 1
        }

      }
      console.log(trueNum);
      if (trueNum > 0) {
        popup.items.radioTrue = true
      } else {
        popup.items.radioTrue = false
      }
      console.log('popup', popup);
      this.setData({
        popup: popup,
      })
      console.log(this.data.questions_sn);
    } else {
      let arr = []
      let a = []
      records.forEach(item => {
        if (item.title == title) {
          console.log(popup.items.items);
          for (let i = 0; i < popup.items.items.length; i++) {
            console.log(popup.items.items[i].trueOrfalse);
            if (popup.items.items[i].trueOrfalse) {
              arr.push(popup.items.items[i])
              a.push(popup.items.items[i].type)
            }
            item.radioTrue = true
          }
         console.log(popup);
          if (arr.length == 0) {
            // questionName
            records.length = records.length - 1
            return
          } else {
            item.itemss = arr
            this.next(item.questionName)
            answers[item.questionName] = a
          }
        }

      });

      // this.setData({
      //   records:records
      // })
      this.setData({
        'popup.show': false,
        records: records,
        answers: answers
      })
    }

  },
  getTypeUrl(e) {
    console.log(e.currentTarget.dataset.url);
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },
  radio_check: function (e) {
    console.log(e);
    let {
      question,
      answer,
      check,
      type,
      index
    } = e.target.dataset;
    let {
      records,
      selectAn,
      answers
    } = this.data

    if (type == 'radio') {
      console.log(check);

      for (let i = 0; i < records[check].items.length; i++) {
        if (records[check].items[i].type == answer) {
          //当前点击的位置为true即选中
          records[check].items[i].trueOrfalse = !records[check].items[i].trueOrfalse;
          records[check].radioTrue = !records[check].radioTrue
        } else {
          //其他的位置为false
          records[check].items[i].trueOrfalse = false;
        }

      }
      if (records[check].items[index].trueOrfalse) {
        records[check].radioTrue = true
        answers[question] = answer
      } else {
        records[check].radioTrue = false
        answers[question] = ""
      }
      console.log('records', records);
    } else {
      records[check].items[index].trueOrfalse = !records[check].items[index].trueOrfalse

      let j = 0
      for (let i = 0; i < records[check].items.length; i++) {
        if (records[check].items[i].trueOrfalse == true) {
          j = j + 1
        }
      }
      if (j == 0) {
        records[check].radioTrue = false
        answers[question] = []
      } else {
        records[check].radioTrue = true
        answers[question].push(answer)
      }

    }
    console.log(answers);
    this.setData({
      answers: answers,
      records: records,
      selectAn: selectAn,

    });
  },

  radio_confirm: function (e) {
    console.log('w', e.target.dataset);
    let {
      question
    } = e.target.dataset;
    let {
      answers,
      firstSelect,
      records
    } = this.data;

    if (answers[question] && answers[question].length > 0) {
      this.next(question);
    }
    this.setData({
      newQuestion: e.target.dataset
    })


  },
  radio_confirms: function (e) {
    console.log('w', e.target.dataset);
    let {
      question,
      index,
      type
    } = e.target.dataset;
    let {
      answers,
      firstSelect,
      records,
      questions_sn,
      newQuestion
    } = this.data;
    this.setData({
      overTrue: false
    })
    //  let newSet = new Set(answers)
    //  newSet.delete(newQuestion)
    //  let newArr = []
    records.splice(index + 1, records.length - index + 1)
    // let removedArr = answers.filter((x) => x !== newQuestion);
    console.log(records);
    // if (answers[question] && answers[question].length > 0) {
    //   this.next(question);
    // }
    this.setData({
      records: records
    })
    if (type == 'index') {
      // this.next(question)
      questions_sn[question].radioTrue = false
      questions_sn[question].items.forEach(element => {
        element.trueOrfalse = false
      });
      records[question] = questions_sn[question]
      console.log(questions_sn[question]);
      this.setData({
        'popup.show': true,
        'popup.items': questions_sn[question],
        records: records
      })
    }



  },
  // 跳转市场分析
  getMarketAnalysis(e, a,b) {
    if (!b) {
      b=''
    }
    wx.navigateTo({
      url: '/sub8/pages/agriculture/marketAnalysis?product=' + e + '&types=' + a + '&query=' + b,
    })
  },
  next: function (event) {
    console.log('event', event);
    let {
      questions_sn
    } = this.data
    let that = this;
    let answers = this.data.answers;
    let records = this.data.records;
    let talent_staffs = this.data.talent_staffs
    if (event == 'want') {
      if (answers['want'] == '01') {
        questions_sn["policy"].radioTrue = false
        questions_sn["policy"].items.forEach(item => {
          item.trueOrfalse = false
        });
        records.push(questions_sn["policy"])
        answers['analyse'] = ''
        answers['policy'] = ''
        answers['aspect'] = []
        answers['industry'] = []
        answers['deal'] = []
        this.getScrollTop('want','policy')
      } else if (answers['want'] == '02') {
        questions_sn["bazaar"].radioTrue = false
        questions_sn["bazaar"].items.forEach(item => {
          item.trueOrfalse = false
        });
        records.push(questions_sn["bazaar"])
        answers['analyse'] = ''
        answers['policy'] = ''
        answers['aspect'] = []
        answers['industry'] = []
        answers['deal'] = []
        this.getScrollTop()
      } else if (answers['want'] == '03') {
        questions_sn["businessOpportunity"].radioTrue = false
        questions_sn["businessOpportunity"].items.forEach(item => {
          item.trueOrfalse = false
        });
        records.push(questions_sn["businessOpportunity"])
        this.getScrollTop()
        answers['analyse'] = ''
        answers['policy'] = ''
        answers['aspect'] = []
        answers['industry'] = []
        answers['deal'] = []
      }
    } else if (event == 'aspect') {
      questions_sn["industry"].radioTrue = false
        questions_sn["industry"].items.forEach(item => {
          item.trueOrfalse = false
        });
      records.push(questions_sn["industry"])
      this.setData({
        'popup.show': true,
        'popup.items': questions_sn["industry"]
      })
      this.getScrollTop()
      console.log(this.data.popup);
    } else if (event == 'industry') {


      talent_staffs = this.getStaffs()
      this.getList()
      this.setData({
        overTrue: true,
        talent_staffs: talent_staffs
      })
      this.getScrollTop()
    } else if (event == 'policy') {
      questions_sn["aspect"].radioTrue = false
        questions_sn["aspect"].items.forEach(item => {
          item.trueOrfalse = false
        });
      records.push(questions_sn["aspect"])
      this.getScrollTop()
    } else if (event == 'bazaar') {
      if (answers[event] == '01') {
        //   talent_staffs =  this.getStaffs()
        // this.setData({
        //   overTrue: true,
        //   talent_staffs:talent_staffs
        // })
        wx.navigateTo({
          url: '/sub8/pages/agriculture/marketAnalysis',
        })
      } else if (answers[event] == '02') {
        questions_sn["price"].radioTrue = false
        questions_sn["price"].items.forEach(item => {
          item.trueOrfalse = false
        });
        records.push(questions_sn["price"])
        this.getScrollTop()
      } else if (answers[event] == '03') {
        questions_sn["analyse"].radioTrue = false
        questions_sn["analyse"].items.forEach(item => {
          item.trueOrfalse = false
        });
        records.push(questions_sn["analyse"])
        this.getScrollTop()
      }
    } else if (event == 'price') {
      if (answers[event] == '粮食') {
        questions_sn["cereal"].radioTrue = false
        questions_sn["cereal"].items.forEach(item => {
          item.trueOrfalse = false
        });
        records.push(questions_sn["cereal"])
        this.getScrollTop()
      } else if (answers[event] == '棉花') {
        questions_sn["cotton"].radioTrue = false
        questions_sn["cotton"].items.forEach(item => {
          item.trueOrfalse = false
        });
        records.push(questions_sn["cotton"])
        this.getScrollTop()
      } else if (answers[event] == '油料') {
        this.getMarketAnalysis('油料', '花生')
        this.getScrollTop()
      } else if (answers[event] == '食糖') {
        this.getMarketAnalysis('食糖', '甘蔗')
        this.getScrollTop()
      } else if (answers[event] == '油料' || answers[event] == '水果' || answers[event] == '食糖') {
        this.getMarketAnalysis(answers[event], '')
        
        // talent_staffs =  this.getStaffs()
        // this.setData({
        //   overTrue: true,
        //   talent_staffs:talent_staffs
        // })
      } else if (answers[event] == '蔬菜') {
        questions_sn["vegetable"].radioTrue = false
        questions_sn["vegetable"].items.forEach(item => {
          item.trueOrfalse = false
        });
        records.push(questions_sn["vegetable"])
        this.getScrollTop()
      } else if (answers[event] == '畜禽') {
        questions_sn["livestock"].radioTrue = false
        questions_sn["livestock"].items.forEach(item => {
          item.trueOrfalse = false
        });
        records.push(questions_sn["livestock"])
        this.getScrollTop()
      } else if (answers[event] == '水产品') {
        questions_sn["aquaticProducts"].radioTrue = false
        questions_sn["aquaticProducts"].items.forEach(item => {
          item.trueOrfalse = false
        });
        records.push(questions_sn["aquaticProducts"])
        this.getScrollTop()
      }
    } else if (event == 'cereal') {
      talent_staffs = this.getStaffs()
      this.getMarketAnalysis('粮食', answers[event])
      this.getScrollTop()
    } else if (event == 'vegetable') {
      talent_staffs = this.getStaffs()
      this.getMarketAnalysis('蔬菜', answers[event])
      this.getScrollTop()
      // wx.navigateTo({
      //   url: './marketAnalysis',
      // })
    } else if (event == 'livestock') {
      if (answers[event] == '猪') {
        questions_sn["pig"].radioTrue = false
        questions_sn["pig"].items.forEach(item => {
          item.trueOrfalse = false
        });
        records.push(questions_sn["pig"])
        this.getScrollTop()
      } else if (answers[event] == '牛') {
        questions_sn["cow"].radioTrue = false
        questions_sn["cow"].items.forEach(item => {
          item.trueOrfalse = false
        });
        records.push(questions_sn["cow"])
        this.getScrollTop()
      } else if (answers[event] == '羊') {
        questions_sn["sheep"].radioTrue = false
        questions_sn["sheep"].items.forEach(item => {
          item.trueOrfalse = false
        });
        records.push(questions_sn["sheep"])
        this.getScrollTop()
      } else if (answers[event] == '禽类') {
        questions_sn["poultry"].radioTrue = false
        questions_sn["poultry"].items.forEach(item => {
          item.trueOrfalse = false
        });
        records.push(questions_sn["poultry"])
        this.getScrollTop()
      } else if (answers[event] == '禽蛋') {
        questions_sn["egg"].radioTrue = false
        questions_sn["egg"].items.forEach(item => {
          item.trueOrfalse = false
        });
        records.push(questions_sn["egg"])
        this.getScrollTop()
      } else {
        talent_staffs = this.getStaffs()
        this.getMarketAnalysis('畜禽', answers[event])
        this.getScrollTop()

      }
      // wx.navigateTo({
      //   url: './marketAnalysis',
      // })
    } else if (event == 'aquaticProducts') {
      if (answers[event] == '淡水产品') {
        questions_sn["fresh"].radioTrue = false
        questions_sn["fresh"].items.forEach(item => {
          item.trueOrfalse = false
        });
        records.push(questions_sn["fresh"])
        this.getScrollTop()
      } else if (answers[event] == '海水产品') {
        questions_sn["seawater"].radioTrue = false
        questions_sn["seawater"].items.forEach(item => {
          item.trueOrfalse = false
        });
        records.push(questions_sn["seawater"])
        this.getScrollTop()
      }
      // talent_staffs = this.getStaffs()
      // this.getMarketAnalysis('水产品', answers[event])
      // this.getScrollTop()
      // wx.navigateTo({
      //   url: './marketAnalysis',
      // })
    } else if (event == 'fresh') {
      talent_staffs = this.getStaffs()
      this.getMarketAnalysis('水产品','淡水产品', answers[event])
      this.getScrollTop()
      // wx.navigateTo({
      //   url: './marketAnalysis',
      // })
    } else if (event == 'seawater') {
      talent_staffs = this.getStaffs()
      this.getMarketAnalysis('水产品','海水产品', answers[event])
      this.getScrollTop()
      // wx.navigateTo({
      //   url: './marketAnalysis',
      // })
    } else if (event == 'pig') {
      talent_staffs = this.getStaffs()
      this.getMarketAnalysis('畜禽','猪', answers[event])
      this.getScrollTop()
      // wx.navigateTo({
      //   url: './marketAnalysis',
      // })
    } else if (event == 'pig') {
      talent_staffs = this.getStaffs()
      this.getMarketAnalysis('畜禽','猪', answers[event])
      this.getScrollTop()
      // wx.navigateTo({
      //   url: './marketAnalysis',
      // })
    } else if (event == 'cow') {
      talent_staffs = this.getStaffs()
      this.getMarketAnalysis('畜禽','牛', answers[event])
      this.getScrollTop()
      // wx.navigateTo({
      //   url: './marketAnalysis',
      // })
    } else if (event == 'sheep') {
      talent_staffs = this.getStaffs()
      this.getMarketAnalysis('畜禽','羊', answers[event])
      this.getScrollTop()
      // wx.navigateTo({
      //   url: './marketAnalysis',
      // })
    } else if (event == 'poultry') {
      talent_staffs = this.getStaffs()
      this.getMarketAnalysis('畜禽','禽类', answers[event])
      this.getScrollTop()
      // wx.navigateTo({
      //   url: './marketAnalysis',
      // })
    } else if (event == 'egg') {
      talent_staffs = this.getStaffs()
      this.getMarketAnalysis('畜禽','禽蛋', answers[event])
      this.getScrollTop()
      // wx.navigateTo({
      //   url: './marketAnalysis',
      // })
    } else if (event == 'cotton') {
      talent_staffs = this.getStaffs()
      this.getMarketAnalysis('棉花', answers[event])
      this.getScrollTop()
      // wx.navigateTo({
      //   url: './marketAnalysis',
      // })
    } else if (event == 'majorProject') {
      wx.navigateTo({
        url: '/sub9/pages/agriculture/ArticleList?articleType=0'  + '&type=' + answers[event],
      })
    } else if (event == 'InvestmentIndustry') {
      wx.navigateTo({
        url: '/sub9/pages/agriculture/ArticleList?articleType=1'  + '&type=' + answers[event],
      })
    }
    
    else if (event == 'HotItem') {
      if (answers[event] == 0) {
        questions_sn["majorProject"].radioTrue = false
        questions_sn["majorProject"].items.forEach(item => {
          item.trueOrfalse = false
        });
      records.push(questions_sn["majorProject"])
      this.getScrollTop()
      console.log(this.data.popup);
      } else if (answers[event] == 1) {
        questions_sn["InvestmentIndustry"].radioTrue = false
        questions_sn["InvestmentIndustry"].items.forEach(item => {
          item.trueOrfalse = false
        });
      records.push(questions_sn["InvestmentIndustry"])
      this.getScrollTop()
      }
   
    } else if (event == 'analyse') {
      talent_staffs = this.getStaffs()
      this.getList()
      
      this.setData({
        overTrue: true,
        talent_staffs: talent_staffs
      })
      this.getScrollTop()
      // wx.navigateTo({
      //   url: './marketAnalysis',
      // })
    } else if (event == 'businessOpportunity') {
      if (answers[event] == 0) {
        questions_sn["deal"].radioTrue = false
        questions_sn["deal"].items.forEach(item => {
          item.trueOrfalse = false
        });
      records.push(questions_sn["deal"])
      this.setData({
        'popup.show': true,
        'popup.items': questions_sn["deal"]
      })
      this.getScrollTop()
      } else if (answers[event] == 1) {
        questions_sn["HotItem"].radioTrue = false
        questions_sn["HotItem"].items.forEach(item => {
          item.trueOrfalse = false
        });
      records.push(questions_sn["HotItem"])
      // this.setData({
      //   'popup.show': true,
      //   'popup.items': questions_sn["industry"]
      // })
      this.getScrollTop()
      console.log(this.data.popup);
      }
      
    } else if (event == 'deal') {
      talent_staffs = this.getStaffs()
      this.getList()
      console.log(talent_staffs);
      this.setData({
        overTrue: true,
        talent_staffs: talent_staffs
      })
      this.getScrollTop()
    }

    console.log(questions_sn);
    that.setData({
      records: records,
      talent_staffs: talent_staffs
    })
    
    wx.pageScrollTo({//pageScrollTo将页面滚动到指定位置scrollTop是属性
      scrollTop: 350
    })
    console.log(records);

  },
  getScrollTop(a,event) {
    console.log('#' + event);
    let that = this
    let name = event
    setTimeout(function () {
      that.setData({
        toView: 'record-into', //records[records.length-1].id
      })
    }, 100)
    // this.setData({
    //   toView:name
    // })
  },
  finishGo: function (e) {
    let that = this;
    let {
      records,
      questions_def,
      questions_way,
      answers,
      location
    } = this.data;

    wx.showToast({
      title: '适配中',
      icon: 'loading',
      mask: true,
    });

    let noteChoose = {
      QA: {},
      DATA: {
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
        text: questions_def[step].title,
      }
      let answer = {
        value: answers[step],
      }
      if (typeof (answers[step]) == 'object') {
        answer.text = answers[step].map(function (x) {
          return questions_def[step].items[x]
        }).join(",");
      } else {
        if (questions_def[step].items) {
          answer.text = questions_def[step].items[answers[step]];
        } else {
          answer.text = answers[step];
        }
      }

      noteChooseQA[step] = {
        question,
        answer
      };
    }
    noteChoose.QA = noteChooseQA;

    let noteChooseTags = [];
    for (let i in questions_way) {
      let step = questions_way[i];
      if (['age', 'birthday', 'years', 'edunumber', 'cateword'].indexOf(step) > -1) {
        // no use tags
      } else {
        if (typeof (answers[step]) == 'object') {
          for (let n in answers[step]) {
            noteChooseTags.push(answers[step][n]);
          }
        } else {
          noteChooseTags.push(answers[step])
        }
      }
    }
    noteChooseTags = noteChooseTags.filter(x => x > 0);
    noteChoose.DATA.tags = noteChooseTags;

    let noteChooseJsonStr = JSON.stringify(noteChoose);

    talent.noteChoose(noteChooseJsonStr).then(res => {

    }).catch(err => {

    }).finally(res => {
      // let word = answers.cateword || '';
      let answers = JSON.stringify(this.data.answers)
      let url = '/sub9/pages/agriculture/shipei_res?' + 'answers=' + answers + '&location=' + location;

      wx.hideToast();
      wx.navigateTo({
        url: url,
      })
    });
  },

  finish: async function (e) {
    let that = this;
    let {
      records,
      talent_staffs
    } = this.data;

    wx.showLoading({
      title: '适配中',
      mask: true,
    });

    talent_staffs = await this.getStaffs();
    this.setData({
      talent_staffs
    });

    let has = records.find(x => x.type == 'finish');
    if (!has) {
      let record_id = 'record-' + records.length;
      records.push({
        id: record_id,
        type: 'finish',
      });

      this.setData({
        records: records,
      });
      setTimeout(function () {
        that.setData({
          scroll_into: 'record-into', //record_id
        })
      }, 100)
    }

    wx.hideLoading();

  },

  onInputEvent: function (e) {
    console.log(e);
    let that = this;
    let {
      word,
      records,
      input_event,
      words
    } = this.data;
    this.setData({
      wordTrue: false
    });
    if (!word) {
      return;
    }

    if (input_event) {
      this.setData({
        ['answers.' + input_event]: word
      })
      this.setData({
        // word: '',
        input_event: '',
      });
      this.next(input_event);
      return;
    }

    // let record_id = 'record-' + records.length;
    // records.push({
    //   id: record_id,
    //   type: 'chat',
    //   from: 'own',
    //   text: word
    // });
    if (word) {
      wx.showToast({
        title: '适配中',
        icon: 'loading',
      });
      let articles = [];
      let data = {
        SELECT: word,
      }
      let list = []
      let listNum = this.data.listNum
      talent.selectPolicy(data).then(res => {
        console.log(res);
        let {
          LIST4,
          LIST5,
          LIST6
        } = res
        if (LIST4) {
          LIST4 = JSON.parse(LIST4)
          listNum = listNum + LIST4.length
          LIST4.forEach(item => {
            list.push(item)
          });
        }
        if (LIST5) {
          LIST5 = JSON.parse(LIST5)
          listNum = listNum + LIST5.length
          LIST5.forEach(item => {
            list.push(item)
          });
        }
        if (LIST6) {
          LIST6 = JSON.parse(LIST6)
          listNum = listNum + LIST6.length
          LIST6.forEach(item => {
            list.push(item)
          });
        }
        console.log(LIST6);
        console.log(LIST4);
        console.log(LIST5);
        console.log(list);
        setTimeout(function () {
          that.setData({
            searchList: list,
            listNum: listNum,
            searchListTrue: true,
            words: word,
            wordTrue: true

          })
        }, 100)
        wx.hideToast();
      }).catch(err => {

      })
      // this.setData({

      // });
    } else {
      this.setData({
        wordTrue: false
      });
    }
    this.setData({});
    this.getScrollTop()

    setTimeout(function () {
      that.setData({
        scroll_into: 'record-into', //record_id
      })
    }, 100)


  },

  loadModi: async function () {
    let that = this;
    let {
      records,
      questions_def,
      questions_way,
      answers,
      talent_staffs
    } = this.data;

    wx.showLoading({
      title: '加载中',
      mask: true,
    })

    talent_staffs = await this.getStaffs();
    this.setData({
      talent_staffs
    });

    talent.noteSelect().then(res => {
      if (!res.LIST[0]) {
        return;
      }
      let json = JSON.parse(res.LIST[0].REMARK1).DATA;
      answers = json.answers;
      questions_way = json.questions_way;
      records = json.records;

      this.setData({
        records: records,
        questions_way: questions_way,
        answers: answers,
      });
      setTimeout(function () {
        that.setData({
          scroll_into: 'record-into', //records[records.length-1].id
        })
      }, 100)

      wx.hideLoading();
    })

  },

  filterTags: function (func) {
    let items = {};
    let tags = Object.keys(utils.policyFields().policy_labels).filter(func);
    for (let i in tags) {
      let tag = tags[i];
      items[tag] = utils.policyFields().policy_labels[tag];
    }
    return items;
  },

  setTagsItems: function () {
    let {
      questions_def
    } = this.data;

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

    this.setData({
      questions_def
    })
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

    let adcode = location.adcode;
    console.log('location', location);
    res = await talent.selectStaff({
      type: 1,
      PROVINCE: location.values[0],
      CITY: location.values[1],
      AREA: location.values[2]
    });
    talent_staffs = res.placeList

    // let adcode_city = adcode.substr(0, 4) + '00';
    // res = await talent.selectStaff({
    //   type: 1,
    //   PROVINCE:location.values[0],
    //   CITY:location.values[1],
    //   AREA:location.values[2]
    // });
    // talent_staffs = res.placeList
    console.log('talent_staffs', talent_staffs);
    this.setData({
      talent_staffs: talent_staffs
    })
    return talent_staffs;
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
  getList() {
    console.log(this.data.answers);
    let that = this
    let listNum = that.data.listNum
    console.log(that.data.answers['industry']);
    let data = {
      POLICY_LEVEL: that.data.answers['policy'] ? that.data.answers['policy'] : '',
      INDUSTRY_LABEL: that.data.answers['industry'].toString() ? that.data.answers['industry'].toString() : '',
      POLICY_CATEGORY: that.data.answers['aspect'].toString() ? that.data.answers['aspect'].toString() : '',
      REPORT_TYPE: that.data.answers['analyse'] ? that.data.answers['analyse'] : '',
      PRODUCT_LABEL: that.data.answers['deal'].toString() ? that.data.answers['deal'].toString() : '',
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
      if (!LIST1 && !LIST2 && !LIST3) {
        this.getList()
        return
      }
      if (LIST1) {
        // LIST1 = JSON.parse(LIST1)
        listNum = listNum + LIST1.length
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
        listNum = listNum + LIST3.length

      }
      console.log(listNum);
      if (show1 == 'false' || show2 == 'false' || show3 == 'false') {
        show1 = false
      }
      that.setData({
        // listNum: listNum,
        LIST1: LIST1,
        LIST2: LIST2,
        LIST3: LIST3,
        show1: show1,


      })
      console.log(this.data.show1);
      wx.hideToast();
    }).catch(err => {

    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    utils.loadBBXChannelByOptions(options);

    let {
      action,
      location
    } = options;
    location = location ? JSON.parse(location) : {};
    this.setData({
      location
    })

    if (!location.adcode) {
      utils.getUserLocation().then(res => {
        this.setData({
          location: res
        });
      })
    }

    this.setData({
      bbx_channel: utils.getBBXChannel().channel
    });

    this.setTagsItems();
    let records = []
    records.push(this.data.questions_sn["want"])
    this.setData({
      records: records,
      "answers.want": this.data.questions_sn["want"]

    })
    // if (action == 'modi') {
    // 	this.loadModi();
    // } else {
    // 	this.next();
    // }

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