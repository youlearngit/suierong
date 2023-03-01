const log = require('../../../log.js');
var app = getApp();
import api, { exchangeBeans } from '../../../utils/api';
import util, { formatTimeWithSymbol } from '../../../utils/util';
import User from '../../../utils/user';
import { getRecommendApplyList, getRecommendApplyDetailList, findBeans } from '../../../api/Recommend';
Page({
  data: {
    cndUrl: app.globalData.CDNURL,
    preffixUrl: app.globalData.URL,
    posterImgs: '',
    cardCur: 0,
    showPoster: false,
    showBeanBox: false,
    showTips: false,
    showCalendar: false,
    showCalendarBox: false,
    customerInfo: {},
    submit: false, // 提取成功
    beansNum: '',
    getBeanDesc1: '',
    getBeanDesc2: '',
    minDate: new Date(2020, 1, 1).getTime(),
    defaultDate: [new Date().getTime(), new Date().getTime() + 24 * 3600 * 1000],
    mineShareList: [],
    recShareList: [],
    totalShareList: [],
    startDate: '',
    endDate: '',
    calendarTitle: '本月',
    recTotalNum: 0,
    qrcodeUrl: '',
    canSearch: true,
  },

  bindscrolltolower(e) {
    console.log(e.currentTarget.dataset);
    let { sharetype, index, selected, startDate, endDate } = e.currentTarget.dataset;
    if (sharetype === '33') {
      if (!this.data.canSearch) {
        return;
      }
      this.setData({
        canSearch: false,
      });
      let { recTotalNum, recCurrentPage, recPageSize, recShareList } = this.data;

      if (recShareList.length < recTotalNum) {
        console.log('k13');
      } else {
        console.log('k23');
        return;
      }
      console.log('33');
      wx.showLoading({
        title: '加载中',
        mask: true,
      });

      getRecommendApplyList('3', '5', recPageSize, recCurrentPage + 1, this.data.startDate, this.data.endDate)
        //   getRecommendApplyList('3', '5', 5, 0, this.data.startDate, this.data.endDate)
        .then((res) => {
          console.log('list3add', res);
          let recShareListNew = res.value;
          recShareListNew.forEach((e) => {
            // e.selected = '-1';
            // e.showDetail = false;
            recShareList.push(e);
          });

          this.setData({
            recShareList,
            recCurrentPage: recCurrentPage + 1,
            canSearch: true,
          });
          wx.hideLoading();
        })
        .catch((err) => {
          this.setData({
            canSearch: true,
          });
          console.log(err);
        });
    } else {
      const shareListName = sharetype === '2' || sharetype === '4' ? 'mineShareList' : 'recShareList';
      let shareList = this.data[shareListName];
      let shareDetailInfo = shareList[index];

      if (shareDetailInfo['totalNum' + selected] > shareDetailInfo['detailList' + selected].length) {
        console.log('k1');
      } else {
        console.log('k2');
        return;
      }
      wx.showLoading({
        title: '加载中',
        mask: true,
      });

      getRecommendApplyDetailList(
        wx.getStorageSync('openid'),
        sharetype,
        selected,
        shareDetailInfo['pageSize' + selected],
        shareDetailInfo['currentpage' + selected] + 1,
        shareDetailInfo.OPEN_ID || '',
        startDate,
        endDate,
      )
        .then((res) => {
          console.log('scrollowshowDetail', res);
          res.value.forEach((e) => {
            e.CREATE_DATE = e.CREATE_DATE ? e.CREATE_DATE.replace(/^(\d{4})(\d{2})(\d{2})$/, '$1-$2-$3') : '';
            e.APPLY_DATE = e.APPLY_DATE ? e.APPLY_DATE.replace(/^(\d{4})(\d{2})(\d{2})$/, '$1-$2-$3') : '';
            switch (e.SHOW_STATE) {
              case '3':
                e.SHOW_STATE = '待确认';
                break;
              case '4':
                e.SHOW_STATE = '审批未通过';
                break;
              case '5':
                e.SHOW_STATE = '额度已确认';
              case '7':
                e.SHOW_STATE = '审批通过';
                break;
              default:
                break;
            }
            shareDetailInfo['detailList' + selected].push(e);
          });
          shareDetailInfo['currentpage' + selected] += 1;
          shareList[index] = shareDetailInfo;

          this.setData({
            [shareListName]: shareList,
          });
          wx.hideLoading();
        })
        .catch((res) => {
          console.log('scrollowshowDetail', res);
        });
    }
    return;
  },

  async showDetail(e) {
    //初始化详细列表
    console.log(e.currentTarget.dataset);
    let {
      sharetype, // 1 总计  本人营销  3推荐  4飞航院
      selected, // 1分享 2申请 3审批通过 4签约
      index, // 数据所在位置
    } = e.currentTarget.dataset;

    const shareListName = sharetype === '2' || sharetype === '4' ? 'mineShareList' : 'recShareList';
    let shareList = this.data[shareListName];

    let shareDetailInfo = shareList[index];

    let name = ['', 'SHARECOUNT', 'ALLCOUNT', 'APVCOUNT', 'SIGNCOUNT'];

    if (shareDetailInfo[name[selected]] && shareDetailInfo[name[selected]] != '0') {
    } else {
      console.log('没数据不显示');
      return;
    }

    console.log('shareDetailInfo', shareDetailInfo);

    if (shareDetailInfo['detailList' + selected]) {
      console.log('有数据');
      shareDetailInfo.selected = selected;
      shareDetailInfo.showDetail = true;
      shareList[index] = shareDetailInfo;
      this.setData({
        [shareListName]: shareList,
      });
      return;
    }

    wx.showLoading({
      title: '加载中',
      mask: true,
    });

    let { startDate, endDate } = this.data;

    try {
      const detailList = await getRecommendApplyDetailList(
        wx.getStorageSync('openid'),
        sharetype,
        selected,
        5,
        0,
        shareDetailInfo.OPEN_ID || '',
        startDate,
        endDate,
      );
      detailList.value.forEach((e) => {
        e.CREATE_DATE = e.CREATE_DATE ? e.CREATE_DATE.replace(/^(\d{4})(\d{2})(\d{2})$/, '$1-$2-$3') : '';
        e.APPLY_DATE = e.APPLY_DATE ? e.APPLY_DATE.replace(/^(\d{4})(\d{2})(\d{2})$/, '$1-$2-$3') : '';
        switch (e.SHOW_STATE) {
          case '3':
            e.SHOW_STATE = '待确认';
            break;
          case '4':
            e.SHOW_STATE = '审批未通过';
            break;
          case '5':
            e.SHOW_STATE = '额度已确认';
          case '7':
            e.SHOW_STATE = '审批通过';
            break;
          default:
            break;
        }
      });
      console.log('detailList', detailList);
      shareDetailInfo['currentpage' + selected] = 0;
      shareDetailInfo['pageSize' + selected] = 5;
      shareDetailInfo['totalNum' + selected] = detailList.totalNum;
      shareDetailInfo.selected = selected;
      shareDetailInfo.showDetail = true;
      shareDetailInfo['detailList' + selected] = detailList.value;
      shareList[index] = shareDetailInfo;
      this.setData({
        [shareListName]: shareList,
      });
      wx.hideLoading();
    } catch (error) {
      wx.hideLoading();
      console.log(error);
    }
  },

  onLoad: function (options) {
    console.log('解析', options);
    console.log(options.customerInfo.length);
    let customerInfo = JSON.parse(decodeURIComponent(options.customerInfo));
    this.setData({
      customerInfo,
      //   showCalendarBox: true,
    });
    if (!customerInfo.USERID) {
      api.generateMiniCode('sub3/pages/recommend/bind').then((res) => {
        if (res) {
          this.setData({
            qrcodeUrl: res,
          });
        } else {
        }
      });
    }

    if (customerInfo.REAL_NAME) {
      findBeans();
    }
    //   customerInfo.USERID = '';

    console.timeEnd('记载解析时间');

    this.setData({
      startDate: formatTimeWithSymbol(new Date(), '').substring(0, 6) + '01',
      endDate: formatTimeWithSymbol(new Date(), '').substring(0, 6) + '31',
    });
    this.initData(options);
  },

  onShow() {
    this.setData({
      showCalendarBox: true,
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

  async reloadData() {
    try {
      wx.showLoading({
        title: '加载中',
        mask: true,
      });
      await this.initData();
      console.log('------------');
      wx.hideLoading();
    } catch (error) {
      console.log('reloadDataerror:', error);
      wx.hideLoading();
    }
  },

  async initData() {
    try {
      if (this.data.customerInfo.USERID) {
        const recShareInfo = getRecommendApplyList('3', '5', '5', '0', this.data.startDate, this.data.endDate)
          .then((res) => {
            console.log('list3', res);
            let recTotalNum = res.totalNum;
            let recShareList = res.value;
            // let recTotalNum = 10;
            // let recShareList = [];
            let recCurrentPage = 0;
            let recPageSize = 5;
            recShareList.forEach((e) => {
              e.selected = '-1';
              e.showDetail = false;
              // e.SHARECOUNT = '1';
              // e.ALLCOUNT = '2';
              // e.APVCOUNT = '3';
              // e.SIGNCOUNT = '4';
              // e.TOTALNUM = '5';
            });

            // for (let index = 0; index < 5; index++) {
            //   recShareList.push(recShareList[0]);
            // }
            this.setData({ recShareList, recTotalNum, recCurrentPage, recPageSize });
          })
          .catch((err) => {
            console.log(err);
          });

        const totalShareInfo = getRecommendApplyList('1', '5', '5', '0', this.data.startDate, this.data.endDate)
          .then((res) => {
            console.log('list1', res);
            let totalShareList = res.value;
            this.setData({
              totalShareList,
            });
          })
          .catch((err) => {
            console.log(err);
          });

        const mineShareInfo = getRecommendApplyList('2', '5', '5', '0', this.data.startDate, this.data.endDate)
          .then((res) => {
            console.log('list2', res);
            let mineShareList = res.value;
            mineShareList.forEach((e) => {
              e.selected = '-1';
              e.showDetail = false;
              // e.SHARECOUNT = '11';
              // e.ALLCOUNT = '22';
              // e.APVCOUNT = '33';
              // e.SIGNCOUNT = '44';
              // e.TOTALNUM = '500';
            });
            this.setData({ mineShareList });
          })
          .catch((err) => {
            console.log(err);
          });

        await Promise.all([totalShareInfo, mineShareInfo, recShareInfo]);
      } else {
        getRecommendApplyList('4', '5', '5', '0', this.data.startDate, this.data.endDate)
          .then((res) => {
            console.log('list4', res);
            let mineShareList = res.value;
            mineShareList.forEach((e) => {
              e.selected = '-1';
              e.showDetail = false;
              //   e.SHARECOUNT = '11';
              //   e.ALLCOUNT = '22';
              //   e.APVCOUNT = '33';
              //   e.SIGNCOUNT = '44';
              //   e.TOTALNUM = '500';
            });
            this.setData({ mineShareList });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    } catch (error) {
      console.log('error', error.message);
    }
  },

  onShareAppMessage() {
    console.log(app.globalData.int_id)
    let imageUrl = this.data.preffixUrl + '/static/wechat/img/rec/rec_poster.png';
    let path = 'sub3/pages/recommend/bind?scene=' + app.globalData.int_id + 'a' + util.formatTime(new Date());
    console.log(path);
    return {
      path,
      imageUrl,
      success(res) {},
      fail(err) {},
    };
  },

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

        this.reloadData();
      },
      fail: () => {},
      complete: () => {},
    });
  },

  showPoster() {
    if (!this.data.customerInfo.ID_CARD) {
      wx.showModal({
        title: '提示',
        content: '请先进行身份认证',
        showCancel: false,
        confirmText: '确定',
        success: (result) => {
          if (result.confirm) {
            wx.redirectTo({
              url: '/sub1/pages/auth/index',
            });
          }
        },
      });
      return;
    }
    this.setData({
      showPoster: true,
    });
    api.getSystemInfo2(660, 882, 1.3).then((res) => {
      this.setData({
        posterBoxHeight: res.posterBoxHeight,
        posterBoxWidth: res.posterBoxWidth,
        unit: res.unit,
        screenWidth: res.systemInfo.screenWidth,
      });
    });
  },
  showTips() {
    this.setData({
      showTips: true,
    });
  },

  onClose() {
    this.setData({
      showPoster: false,
      showBeanBox: false,
      showTips: false,
      showCalendar: false,
    });

    setTimeout(() => {
      this.setData({ submit: false });
    }, 510);
  },

  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current,
    });
  },

  showPopup() {
    this.setData({ show: true });
  },

  closePopUp() {
    this.setData({
      showPosterBox: false,
    });
  },

  generateCardPoster() {
    var that = this;
    wx.showLoading({
      title: '生成中',
      mask: true,
    });
    if (this.data.posterImgs) {
      // saveImage
      api
        .saveImage(this.data.posterImgs)
        .then((res) => {
          that.setData({
            showPoster: false,
          });
        })
        .catch((err) => {
          console.error(err);
        });
      return;
    }

    const width = this.data.posterBoxWidth;
    const height = this.data.posterBoxHeight;
    const unit = this.data.unit;

    let img1 = '';
    let img2 = '';

    let promise1 = new Promise(function (resolve, reject) {
      wx.getImageInfo({
        src: that.data.cndUrl + '/static/wechat/img/rec/rec_poster.png',
        success: function (res) {
          img1 = res.path;
          resolve();
        },
        fail: function (res) {
          reject(res);
        },
      });
    });

    let promise2 = new Promise(function (resolve, reject) {
      if (that.data.qrcodeUrl != '') {
        img2 = that.data.qrcodeUrl;
        resolve();
      } else {
        api.generateMiniCode('sub3/pages/recommend/bind').then((res) => {
          if (res) {
            img2 = res;
            that.setData({
              qrcodeUrl: img2,
            });
            resolve();
          } else {
            reject();
          }
        });
      }
    });

    Promise.all([promise1, promise2])
      .then(() => {
        let context = wx.createCanvasContext('mycanvas');

        context.drawImage(img1, 0, 0, width, height); //背景绘制
        context.drawImage(img2, 193 * unit, 249 * unit, 276 * unit, 276 * unit); //小程序码

        context.draw(false, function () {
          setTimeout(() => {
            wx.canvasToTempFilePath({
              canvasId: 'mycanvas',
              x: 0,
              y: 0,
              width: width,
              height: height,
              destWidth: width,
              destHeight: height,
              quality: 1,
              success: (a) => {
                wx.hideLoading();

                that.setData({
                  posterImgs: a.tempFilePath,
                });
                api
                  .saveImage(a.tempFilePath)
                  .then(() => {
                    that.setData({
                      showPoster: false,
                    });
                  })
                  .catch((err) => {
                    console.error(err);
                  });
              },
              fail: (err) => {
                wx.hideLoading();
              },
            });
          }, 200);
        });
      })
      .catch((err) => {
        wx.hideLoading();
      });
  },

  showBeanBox() {
    console.log(1);
    User.getFaceVerify()
      .then((res) => {
        console.log(1);
        this.setData({ showBeanBox: true });
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

  numInput(e) {
    console.log(e);

    let beansNum =
      e.detail.value > this.data.customerInfo.RMNG_BEAN ? this.data.customerInfo.RMNG_BEAN : e.detail.value;
    this.setData({
      beansNum: ~~beansNum,
    });
  },

  getBeans() {
    var that = this;

    if (that.data.beansNum == '' || that.data.beansNum == '0') {
      wx.showToast({
        title: '请输入要提取的豆子数量',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: true,
      });
    } else {
      wx.showLoading({
        title: '提取中',
        mask: true,
      });

      exchangeBeans(that.data.beansNum.toString())
        .then((res) => {
          if (res.code == 1) {
            let customerInfo = that.data.customerInfo;
            customerInfo.RMNG_BEAN = customerInfo.RMNG_BEAN - that.data.beansNum;
            that.setData({
              submit: true,
              getBeanDesc1: '苏银豆积分提取成功',
              getBeanDesc2: customerInfo.RMNG_BEAN,
              customerInfo,
            });
            wx.hideLoading();
          } else {
            wx.hideLoading();
            that.setData({
              submit: true,
              getBeanDesc1: res.msg,
              getBeanDesc2: that.data.customerInfo.RMNG_BEAN,
            });
          }
          that.setData({
            beansNum: '',
          });
        })
        .catch((err) => {
          setTimeout(() => {
            wx.hideLoading();
            that.setData({
              submit: true,
              getBeanDesc1: err.msg,
              getBeanDesc2: that.data.customerInfo.RMNG_BEAN,
              beansNum: '',
            });
          }, 2000);
        });
    }
  },
});
