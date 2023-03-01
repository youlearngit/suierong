const App = getApp();
import User from '../../../../utils/user';
import Emp from '../../../../utils/Emp';
import { Mer } from '../services/Mer';
import dayjs from 'dayjs';
import Dialog from '@vant/weapp/dialog/dialog';
import Toast from '@vant/weapp/toast/toast';
import * as mock from '../mock/mock';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cdnMer: App.globalData.CDNURL + '/static/wechat/img/mer/',
    cdn: App.globalData.CDNURL,

    title: '推荐有礼', // 推荐有礼 权益兑换

    openid: '',
    name: '',
    avatar: '',

    total_share: 0,
    total_share_suc: 0,
    total_share_fail: 0,
    score_total: 0,
    score_surplus: 0,
    detail_list: [],

    syd_score :0,
    syd_list: [],
    syd_goods: [],
    
    daytypes: [
      {name:'本月'},
      {name:'本季'},
      {name:'本年'},
      {name:'选择日期'},
    ],
    daytype_name: '',

    show_daytype: false,
    show_tip: false,
    show_rule: false,
    show_detail: false,
    
    show_calendar: false,
    calendar_range: [dayjs('2020-01-01').valueOf(), dayjs().valueOf()],

  },

  onoff(e) {
    let {event} = e.currentTarget.dataset
    this.setData({[event]:!this.data[event]});
  },

  async sydData(sdate,edate) {
    let openid = this.data.openid;
    let page = 1;
    let limit = 10;

    let res_total = await Mer.getMyrAward(openid,sdate,edate);
    this.setData({
      total_share: res_total.shareTotal,
      total_share_suc: res_total.shareSuccessTotal,
      total_share_fail: res_total.shareFailTotal,
      score_total: res_total.awardTotal, // 累计获得
      score_surplus: res_total.awardSurplus, // 可提取
    })

    let res_detail = await Mer.getShareInfoDetail(openid,sdate,edate);
    if (res_detail.STATUS=='1' && res_detail.LIST) {
      let detail_list = res_detail.LIST;
      this.setData({detail_list});
    }

    let res_syd = await Mer.getSydDealInfo(openid,sdate,edate,1,99);
    this.setData({
      syd_score: res_syd.availablepoints || 0,
      syd_list: res_syd.acctrans || [],
    });

    let {cdnMer} = this.data;
    let syd_goods = [
      {id:'',src:`${cdnMer}/goods_icon_qqyy.png`,price:1641},
      {id:'',src:`${cdnMer}/goods_icon_iqi.png`,price:1900},
      {id:'',src:`${cdnMer}/goods_icon_zgsy.png`,price:10700},
      {id:'',src:`${cdnMer}/goods_icon_jd.png`,price:10500},
    ];
    this.setData({syd_goods})

  },

  async onSelectGoods(e) {
    let {good} = e.currentTarget.dataset;
    if (!good.id) {
      this.setData({show_tip:true})
    }
  },

  async onSelectDaytype(e) {
    let {name} = e.detail;
    let sdate,edate;

    this.setData({daytype_name:name});

    switch (name) {
      case '本月': {
        sdate = dayjs().startOf('month').format('YYYYMMDD');
        edate = dayjs().endOf('month').format('YYYYMMDD');
      } break;
      case '本季': {
        let m = dayjs().month()
        sdate = dayjs().month(parseInt(m/3)*3).startOf('month').format('YYYYMMDD');
        edate = dayjs().month(parseInt(m/3)*3+2).endOf('month').format('YYYYMMDD');
      } break;
      case '本年': {
        sdate = dayjs().startOf('year').format('YYYYMMDD');
        edate = dayjs().endOf('year').format('YYYYMMDD');
      } break;
      case '选择日期': {
        this.setData({show_calendar:true});
      }
      default: break;
    }

    if (sdate && edate) {
      await this.sydData(sdate,edate)
      return;
    }

  },

  async confirmCalendar(e) {
    Toast.loading({
      forbidClick: true,
      duration: 0,
    });
    this.setData({show_calendar:false});
    let dates = e.detail;
    let title_dates = dates.map(r=>{return dayjs(r).format('YYYY.MM.DD')});
    this.setData({daytype_name:`${title_dates[0]}-${title_dates[1]}`});
    let syd_dates = dates.map(r=>{return dayjs(r).format('YYYYMMDD')});
    await this.sydData(syd_dates[0],syd_dates[1]);
    Toast.clear();
  },

  async goSyd(e) {
    wx.navigateTo({
      url: './recommend?title=权益兑换',
    })
  },

  async initData(options) {
    Toast.loading({
      forbidClick: true,
      duration: 0,
    });

    try {
      if (options.title) {
        this.setData({title:options.title})
      }
      wx.setNavigationBarTitle({
        title: this.data.title,
      })

      let openid = Mer.openid();
      this.setData({openid});

      let res_user = await User.getCustomerInfo(openid);
      this.setData({
        name: res_user.NICK_NAME || res_user.REAL_NAME,
        avatar: res_user.PHOTO,
      });


      await this.onSelectDaytype({detail:this.data.daytypes[0]});

      Toast.clear();

      if (this.data.title=='推荐有礼') {
        let res_conf = await Mer.getAwardConf()
        if (res_conf.surplusQuota<=0) {
          await Dialog.alert({
            message: '本轮活动已结束，更多精彩敬请期待！',
          });
        }
      }

    } catch(err) {
      console.error(err);
      Toast.clear();
      Toast.fail(err);
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.initData(options);
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