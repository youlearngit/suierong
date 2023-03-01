var app = getApp();
import { formatTimeWithSymbol } from '../../utils/util';
import User from '../../utils/user';
import Order from '../../api/Order';
Page({
  data: {
    cndUrl: app.globalData.CDNURL,
    customerInfo: {},
    showTips: false,
    showBeanBox: false,
    showmore: false,
    showCalendarBox: false,
    showCalendar: false,
    startDate: '',
    endDate: '',
    calendarTitle: '本月',
    minDate: new Date(2020, 1, 1).getTime(),
    defaultDate: [new Date().getTime(), new Date().getTime() + 24 * 3600 * 1000],
    submit: false, // 提取成功
    show1: false,
    beansNum: '',
    getBeanDesc1: '',
    getBeanDesc2: '',
    list: []
  },
  onShow() {
    this.setData({
      showCalendarBox: true
    });
  },
  onLoad: async function (options) {
    console.log('解析', options);
    console.log(options.customerInfo.length);
    let customerInfo = JSON.parse(decodeURIComponent(options.customerInfo));
    console.log(customerInfo)
    this.setData({
      customerInfo
    });

    this.setData({
      startDate: formatTimeWithSymbol(new Date(), '').substring(0, 6) + '01',
      endDate: formatTimeWithSymbol(new Date(), '').substring(0, 6) + '31',
    });
    console.log(this.data.startDate, this.data.endDate)
    this.reloadData();
  },
  // 贸e融用户获取苏银豆信息
  async getMyrAward(startDate, endDate) {
    await Order.getMyrAward(startDate, endDate).then(res => {
      console.log(res)
      if (res.STATUS == '1') {
        this.setData({
          awardTotal: res.awardTotal, //累计获得苏银豆
          awardSurplus: res.awardSurplus, //可提取的苏银豆
          shareTotal: res.shareTotal, //分享总次数
          shareSuccessTotal: res.shareSuccessTotal, //分享申请成功次数
          shareFailTotal: res.shareFailTotal, //分享申请失败次数
        })
      }
    })
  },
  // 贸e融苏银豆奖励详细
  async getShareInfoDetail(startDate, endDate) {
    var that = this;
    await Order.getShareInfoDetail(startDate, endDate).then(res => {
      console.log('查看明细：', res)
      if (res.STATUS == '1') {
        if (res.LIST) {
          that.setData({
            list: res.LIST
          })
        }
      }
    })
  },
  //弹出规则
  showTips() {
    this.setData({
      showTips: true,
    });
  },
  // 查看明细
  watchmore() {
    this.setData({
      showmore: true
    })
  },
  //关闭弹出框
  onClose() {
    this.setData({
      showmore: false,
      showBeanBox: false,
      showTips: false,
      showCalendar: false,
    });
    if (this.data.showBeanBox == false) {
      this.setData({
        beansNum: ''
      })
    }
    setTimeout(() => {
      this.setData({
        submit: false
      });
    }, 510);
  },
  //点击本月
  showCalendar() {
    var that = this;
    const date = new Date();
    let startDate = '',
      endDate = '';
    wx.showActionSheet({
      itemList: ['本月', '本季', '本年', '选择日期'],
      itemColor: '#000000',
      success: (result) => {
        console.log(result);
        switch (result.tapIndex) {
          case 0:
            that.setData({
              startDate: formatTimeWithSymbol(new Date(), '').substring(0, 6) + '01',
              endDate: formatTimeWithSymbol(new Date(), '').substring(0, 6) + '31',
              calendarTitle: '本月',
            });
            break;
          case 1:
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            console.log(month);
            switch (month) {
              case 1:
              case 2:
              case 3:
                startDate = year + '0101';
                endDate = year + '0331';
                break;
              case 4:
              case 5:
              case 6:
                startDate = year + '0401';
                endDate = year + '0631';
                break;
              case 7:
              case 8:
              case 9:
                startDate = year + '0701';
                endDate = year + '0931';
                break;
              case 10:
              case 11:
              case 12:
                startDate = year + '1001';
                endDate = year + '1231';
                break;
              default:
                break;
            }
            that.setData({
              startDate,
              endDate,
              calendarTitle: '本季',
            });
            break;
          case 2:
            startDate = date.getFullYear() + '0101';
            endDate = date.getFullYear() + '1231';
            that.setData({
              startDate,
              endDate,
              calendarTitle: '本年',
            });
            break;
          case 3:
            that.setData({
              showCalendar: true,
            });
            return;
            break;
          default:
            break;
        }
        console.log(that.data.startDate, that.data.endDate)
        that.reloadData();
      },
      fail: () => {},
      complete: () => {},
    });
  },
  async confirmDate(e) {
    console.log(e);
    let startDate = formatTimeWithSymbol(e.detail[0], '');
    let endDate = formatTimeWithSymbol(e.detail[1], '');
    console.log(startDate, endDate);
    this.setData({
      startDate,
      endDate,
      calendarTitle: formatTimeWithSymbol(e.detail[0], '.') + '-' + formatTimeWithSymbol(e.detail[1], '.'),
      showCalendar: false,
    });
    this.reloadData();
  },
  //加载
  async reloadData() {
    try {
      wx.showLoading({
        title: '加载中',
        mask: true,
      });
      console.log('------------');
      await this.getMyrAward(this.data.startDate, this.data.endDate);
      await this.getShareInfoDetail(this.data.startDate, this.data.endDate);
      wx.hideLoading();
    } catch (error) {
      console.log('reloadDataerror:', error);
      wx.hideLoading();
    }
  },
  //提取苏银豆是否人脸
  showBeanBox() {
    if (this.data.awardTotal == 0) {
      wx.showToast({
        title: '当前未获得苏银豆，不可提取',
        icon: 'none'
      })
      return;
    }
    // this.setData({
    //   showBeanBox: true
    // });
    var openid = wx.getStorageSync('openid');
    // var openid='odypO5cMZL5UoFVBm2-PkwOqkA-U';
    User.getFaceVerify(openid).then((res) => {
        console.log(res)
        console.log(1);
        this.setData({
          showBeanBox: true
        });
      })
      .catch((err) => {
        console.log(err);
        if (err == 'faceUnVerified') {
          wx.showModal({
            title: '',
            content: '请先完成人脸识别',
            showCancel: true,
            cancelText: '取消',
            cancelColor: '#000000',
            confirmText: '确定',
            success: (result) => {
              if (result.confirm) {
                wx.navigateTo({
                  url: '/sub1/pages/info/identify',
                });
              }
            },
            fail: () => {},
            complete: () => {},
          });
        }
      });
  },
  //输入框绑定
  numInput(e) {
    console.log(e);
    let beansNum = this.jy(e.detail.value.trim());
    this.setData({
      beansNum: beansNum,
    });
    console.log(beansNum)
    console.log(this.data.beansNum)
  },
  // 验证输入金额
  jy(val) {
    let num = val.toString(); //先转换成字符串类型
    num = num.replace(/[^\d]/g, ""); //清除“数字”以外的字符
    return num;
  },
  //点击确认走提取苏银豆接口
  getBeans() {
    var that = this;
    if (that.data.beansNum == '' || that.data.beansNum == '0') {
      wx.showToast({
        title: '请输入要提取的豆子数量',
        icon: 'none',
        duration: 1500,
        mask: true
      });
    } else if (that.data.beansNum > that.data.awardTotal) {
      wx.showToast({
        title: '苏银豆数量不足',
        icon: 'none',
        duration: 1500,
        mask: true
      });
    } else {
      wx.showLoading({
        title: '提取中',
        mask: true,
      });

      Order.extractAward(that.data.beansNum.toString()).then((res) => {
        console.log(res)
        if (res.resCode == 1) {
          console.log('步骤一')
          let awardTotal = that.data.awardTotal;
          awardTotal = awardTotal - that.data.beansNum;
          that.setData({
            submit: true,
            getBeanDesc1: '苏银豆积分提取成功',
            getBeanDesc2: awardTotal,
            show1: true
          });
          this.reloadData();
        } else {
          console.log('步骤二')
          wx.hideLoading();
          that.setData({
            submit: true,
            getBeanDesc1: res.resMsg,
            getBeanDesc2: that.data.awardTotal,
            show1: false
          });
        }
        that.setData({
          beansNum: '',
        });
      })
      // .catch((err) => {
      //   console.log('步骤三')
      //   setTimeout(() => {
      //     wx.hideLoading();
      //     that.setData({
      //       submit: true,
      //       getBeanDesc1: err.resMsg,
      //       getBeanDesc2: that.data.awardTotal,
      //       beansNum: '',
      //     });
      //   }, 2000);
      // });
    }
  },
});
