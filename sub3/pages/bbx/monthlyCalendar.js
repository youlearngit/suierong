import utils from './utils';
import Talent from "./talent";
import log from '../../../log';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    click: true, // 点击月份的状态
    preffixUrl: utils.preffixUrl(),
    cndUrl: app.globalData.CDNURL,
    activeId: 0,
    todayMonth: 10,
    todayclick: -1, //选中
    isflag: true, //展开和收起的状态
    monthList: [], //存放月份数组
    monthImg: [{
      id: 1,
      imgBottom: 'blueitem_img.png'
    }, {
      id: 2,
      imgBottom: 'greenitem_img.png'
    }],
    // 月份数组
    arrdate: [{
        id: 1,
        img: 'january.png', //默认状态
        imgToday: 'january_today.png', //当月状态
        imgClick: 'januarys.png' //选中状态
      }, {
        id: 2,
        img: 'february.png',
        imgToday: 'february_today.png',
        imgClick: 'februarys.png'
      }, {
        id: 3,
        img: 'march.png',
        imgToday: 'march_today.png',
        imgClick: 'marchs.png'
      },
      {
        id: 4,
        img: 'april.png',
        imgToday: 'april_today.png',
        imgClick: 'aprils.png'

      }, {
        id: 5,
        img: 'may.png',
        imgToday: 'may_today.png',
        imgClick: 'mays.png'
      }, {
        id: 6,
        img: 'june.png',
        imgToday: 'june_today.png',
        imgClick: 'junes.png'
      }, {
        id: 7,
        img: 'july.png',
        imgToday: 'july_today.png',
        imgClick: 'julys.png'
      }, {
        id: 8,
        img: 'august.png',
        imgToday: 'august_today.png',
        imgClick: 'augusts.png'
      }, {
        id: 9,
        img: 'september.png',
        imgToday: 'september_today.png',
        imgClick: 'septembers.png'
      }, {
        id: 10,
        img: 'october.png',
        imgToday: 'october_today.png',
        imgClick: 'octobers.png'
      }, {
        id: 11,
        img: 'november.png',
        imgToday: 'november_today.png',
        imgClick: 'novembers.png'

      }, {
        id: 12,
        img: 'december.png',
        imgToday: 'december_today.png',
        imgClick: 'decembers.png'
      }
    ],

    newList: [], //空数组 下边接收月份数组使用
    nowyear:new Date().getFullYear(),//当前年
    yearsToNow:[],
    yearIndex:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    // 获取当前月份 因是从0开始计算 所以需要+1
    var date = new Date().getMonth() + 1;
    console.log(date)
    this.setData({
      todayMonth: date
    });
    this.funcway();
    this.getYearsToNow();
    this.changeEvent(date,this.data.yearsToNow[this.data.yearIndex]);
    console.log(this.data.nowyear)
  },
  getYearsToNow() {
    //获取到从哪一年开始
    let smallYears = 2022;
    //获取当前时间
    let date = new Date;
    let nowYears = date.getFullYear();
    let Years = nowYears - smallYears;
    let arrYear = [];
    for (let i = 0; i <= Years; i++) {
      arrYear.push(`${nowYears--}`);
    }
    this.setData({
      yearsToNow:arrYear
    })
  },
  choose(e) {
    this.setData({
      yearIndex: parseInt(e.detail.value, 10),
    });
    this.changeEvent(this.data.todayMonth,this.data.yearsToNow[this.data.yearIndex]);
  },
  // 展开和收起月历
  toggleClick() {
    this.setData({
      isflag: !this.data.isflag //状态取反
    })
    this.funcway();
  },
  // 月份
  funcway() {
    var that = this;
    var nowArr, object = []
    if (that.data.todayMonth == 1 || that.data.todayMonth == 2 || that.data.todayMonth == 3) {
      nowArr = [1, 2, 3];
    }
    if (that.data.todayMonth == 4 || that.data.todayMonth == 5 || that.data.todayMonth == 6) {
      nowArr = [4, 5, 6];
      nowArr.forEach(item => {
        that.data.arrdate.forEach((item1) => {
          if (item == item1.id) {
            object.push(item1)
          }
        })
      })
    }
    if (that.data.todayMonth == 7 || that.data.todayMonth == 8 || that.data.todayMonth == 9) {
      nowArr = [7, 8, 9];
      nowArr.forEach(item => {
        that.data.arrdate.forEach((item1) => {
          if (item == item1.id) {
            object.push(item1)
          }
        })
      })
    }
    if (that.data.todayMonth == 10 || that.data.todayMonth == 11 || that.data.todayMonth == 12) {
      nowArr = [10, 11, 12];
      nowArr.forEach(item => {
        that.data.arrdate.forEach((item1) => {
          if (item == item1.id) {
            object.push(item1)
          }
        })
      })
    }
    // 判断展开和收起
    if (that.data.isflag) {
      console.log(1111)
      that.setData({
        newList: object
      })
    } else {
      console.log(222)
      that.setData({
        newList: that.data.arrdate
      })
    }
  },

  async changeEvent(e) {
    console.log(typeof (e));
    let addMonth = null
    if (typeof (e) === "number") {
      addMonth = e
    } else {
      addMonth = e.currentTarget.dataset.id
    }
    let {
      todayMonth
    } = this.data
    if (addMonth === todayMonth && this.data.nowyear==this.data.yearsToNow[this.data.yearIndex]) {
      // console.log('0000');
      this.setData({
        todayclick: -1,
        // click: true,
      })
    } else {
      this.setData({
        todayclick: addMonth,
        // click: false
      })
    }
    try {
      let res = await Talent.monthSearch(addMonth + '月',this.data.yearsToNow[this.data.yearIndex])
      let {
        monthList
      } = this.data

      //  monthList=res.entityList//存放政策/活动数组
      //   console.log(monthList);
      console.log(res)
      this.setData({
        monthList: res.entityList || []
      })
      console.log(res.entityList);

    } catch (err) {

    }

    //   // 除当前月 点击其他月份下边显示敬请期待
    // if (addMonth == 7 || addMonth == 8) {
    //   this.setData({
    //     click: true,
    //   })
    // } else {
    //   this.setData({
    //     click: false
    //   })
    // }
  },

  // 一
  jumpDetail:function(e) {
    wx.navigateTo({
      url: '../bbx/monthlyCalendar_list?id=' + e.currentTarget.dataset.value.ID,
    })
  },
  // // 二
  // jumpPageTwo() {
  //   wx.navigateTo({
  //     url: '../bbx/monthlyCalendar_listTwo',
  //   })
  // },
  // // 三
  // jumpPageThree() {
  //   wx.navigateTo({
  //     url: '../bbx/monthlyCalendar_listThree',
  //   })
  // },
  // // 四
  // jumpPageFour() {
  //   wx.navigateTo({
  //     url: '../bbx/monthlyCalendar_listFour',
  //   })
  // },
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