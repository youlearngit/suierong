import requestYT from '../../api/requestYT';
import user from '../../utils/user';
import api from '../../utils/api';
import log from '../../log';
import Order from '../../api/Order';

const app = getApp();
let date = new Date();
Page({
  data: {
    preffixUrl: app.globalData.URL,
    xieyiShow: '', //判断是哪个贷款
    jieName: '', //借款人姓名（申请人姓名）
    flag: true,
    flag_0: true,
    flag_1: true,
    flag_2: true,
    flag_3: true,
    flag_4: true,
    flag_wdone: true, //网贷微贷
    flag_wdtwo: true,
    flag_wdthird: true,
    flag_wdfourth: true,
    document0: true,
    document1: true,
    document2: true,
    document3: true,
    document4: true,
    document5: true,
    document6: true,
    document7: true,
    coverAuth: false,
    orderNo: '', //订单号
    enterprise_name1: '',
    apply_amount1: '',
    apply_term: '', //申请期限
    vouch_type: '', //住宅抵押
    purpose: '', //借款用途
    applicantName: '', //姓名
    applicantIdcard: '', //身份证号
    applicantIdcard2: '',
    authorizeExpiration: '', //授权有效期
    authorizerType: '', //授权人类型
    num: 0,
    sum: 1,
    name: '', //授权人姓名
    prowId: '',
    applicantIdcards: '',
    socialCreditCode: '',
    day_time: date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日',
    farenName: '', //授权人姓名
    checklist: '',
    authorType: '', //1法人 2其它
    loanType: '',
    applyType: '',
    authorTypeName: '', //授权人类型
    autorStatus: '', //授权状态
    tel: '', //授权人手机号
    doc_self: false,
    doc_borrower: false,
    doc_checkbox1: false,
    doc_checkbox2: false,
    doc_checkbox3: false,
    isApplyer: false, //随e贷 是否和借款人是同一人
    enterpriseInfo: {},
    expirationTime: date.getFullYear() + 1 + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日',
    expirationTime2: {
      year: date.getFullYear() + 3,
      mounth: date.getMonth() + 1,
      day: date.getDate(),
    },
    sedID: '',
    channelID: '',
    hasImageBatchId: false,
    depositBankName: '', //开户行
    backBtnName: '',
    authCode: '',
    specialProductCode: '',
    resvFld2: '', //授权人类型
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options', options);
    //console.log(options.orderNo);
    //console.log(options.name);
    //console.log(options.socialCreditCode);
    var that = this;
    let newDate = new Date();
    newDate.setFullYear(new Date().getFullYear() + 1);
    newDate.setTime(new Date().getTime() + 1000 * 3600 * 24 * 1);
    var xieyiShow = options.orderNo.substring(0, 2); //判断是哪个贷款
    that.setData({
      xieyiShow: xieyiShow,
      orderNo: options.orderNo,
      name: options.name,
      socialCreditCode: options.socialCreditCode,
      enterprise_name1: options.enterprise_name,
      apply_amount1: options.apply_amount,
      specialProductCode: options.specialProductCode,
      resvFld2: options.resvFld2
    });

    //查询借款人
    if (xieyiShow == 'WD' || xieyiShow == 'YB') {
      Order.getBorrowerName(that.data.orderNo).then((res) => {
        console.log('借款人信息', res);
        that.setData({
          jieName: res.contactsName,
        });
      });
    }
  },

  onShow() {
    if (wx.getStorageSync('openid') === '') {
      api.getSessionInfo().then(() => {
        this.apli();
      });
    } else {
      this.apli();
    }
  },

  /**
   * 授权人是否是申请人
   */
  ifApplyer() {
    var that = this;
    let applicantIdcards = that.data.applicantIdcards;
    let applyerIdCards = that.data.jk.applyCard;
    that.setData({
      isApplyer: applicantIdcards == applyerIdCards ? true : false,
    });
  },

  async actionsBeforeSubmit() {
    try {
        console.log('name---'+this.data.name);
        console.log('ID_CARD---'+this.data.authorInfo.ID_CARD);
        console.log(this.data);
        await api.getImageBatchId(this.data.authorInfo.REAL_NAME, this.data.authorInfo.ID_CARD);
        this.setData({
          batchID: 'success',
        });
        this.submit();

    } catch (error) {
      console.log('123', error);
      wx.showModal({
        title: '提示',
        content: error.message || error,
        showCancel: false,
        confirmText: '确定',
        success: (result) => {
          if (result.confirm) {
          }
        },
      });
    }

    //申请人为法人时 是否上传影像
  },
  async submit1() {
    var that = this;
    user.getFaceVerify().then(res=>{

      console.log(res);

      if(res.BATCH_ID){
        console.log('2222222222');
        this.submit();
      }else{
        wx.showModal({
          title: '提示',
          content: '请先进行人脸识别',
          showCancel: true, //是否显示取消按钮
          success: function (res) {
            if (!res.confirm) {
              return;
            }
            console.log('1111111111')
            that.actionsBeforeSubmit();

          },
          fail: function (res) { }, //接口调用失败的回调函数
          complete: function (res) { }, //接口调用结束的回调函数（调用成功、失败都会执行）
        })
      }
      
  }).catch(err=>{
      if(err==="faceUnVerified"){
          wx.showModal({
              title: '提示',
              content: '请先进行人脸识别',
              showCancel: true, //是否显示取消按钮
              success: function (res) {
                if (!res.confirm) {
                  return;
                }
                wx.navigateTo({
                  url: '/sub1/pages/info/identify?type=3&url=/pages/hwd/index',
                })
              },
              fail: function (res) { }, //接口调用失败的回调函数
              complete: function (res) { }, //接口调用结束的回调函数（调用成功、失败都会执行）
            })
          }
          wx.hideLoading();
  })
  },
  async submit() {
    var that = this;

    

    if (that.data.checklist != 'checked') {
      wx.showToast({
        title: '请勾选已阅读并同意相关协议',
        icon: 'none',
        duration: 2000,
      });
      return;
    }

    wx.showLoading({
      title: '授权中...',
    });

    if (that.data.xieyiShow == 'SJ') {
      try {
        that.ifApplyer();
        let { authorType, loanType } = that.data;
        let str = '';
        if (authorType === '0') {
          switch (loanType) {
            case '10':
              str = '01';
              break;
            case '11':
              str = '00';
              break;
            case '20':
              str = '00';
              break;
            case '21':
              str = '12';
              break;
            case '22':
              str = '12';
              break;
            default:
              break;
          }
        } else if (authorType === '2') {
          str = that.data.isApplyer ? '22' : '40';
        } else if (authorType === '4') {
          str = loanType === '22' ? '22' : '40';
        } else {
          str = '40';
        }

        if (authorType == '2') {
          authorType = '1';
        }
        if (authorType == '4') {
          authorType = '3';
        }
        // 如果是v担保
        // if (applyType === '3') {
        //   str = `${authorType === '0' || authorType === '1' ? authorType : '2'}${applyType}`;
        // }
        //console.log(str);
        let data = JSON.stringify({
          orderNo: that.data.orderNo,
          company_Name: that.data.enterprise_name1,
          company_No: that.data.socialCreditCode,
          authorizer_Name: that.data.authorInfo.REAL_NAME,
          apply_Card_Type: '021',
          apply_Id_Card: that.data.authorInfo.ID_CARD,
          apply_Group: that.data.enterprise_name1,
          clientele_Name: that.data.authorInfo.REAL_NAME,
          clientele_Id_Card: that.data.authorInfo.ID_CARD,
          farName: that.data.legalInfo.legalName,
          borrower: that.data.jieName,
          apply_Type: authorType === '0' && loanType === '22' ? '1221' : str + loanType,
          repsendObj: authorType,
          remake1: '',
          remake2: '',
          remake3: '',
          remake4: '',
          remake5: '',
          authCode: that.data.authCode,
          loginPhone: that.data.tel,
        });
        //console.log(JSON.parse(data));
        if (that.data.enterpriseInfo.city === '3204' && that.data.channelID === '') {
          await Order.authorization3204(that.data.sedID, that.data.orderNo);
        }
        if (!that.data.hasImageBatchId) {
          await api.getImageBatchId(that.data.authorInfo.REAL_NAME, that.data.authorInfo.ID_CARD);
          this.setData({
            hasImageBatchId: true,
          });
        }
        await Order.suiAuth(data)
          .then((res) => {
            wx.hideLoading();
            wx.showToast({
              title: '授权成功！',
              icon: 'success',
              mask: true,
              duration: 2000,
            });
            setTimeout(function () {
              wx.switchTab({
                url: '/pages/mine/mine',
              });
            }, 2000);
          })
          .catch((err) => {
            wx.hideLoading();
            // wx.showToast({
            //   title: err ? err : '授权失败',
            //   icon: 'none',
            //   mask: true,
            //   duration: 2000,
            // });

            wx.showModal({
              title: '授权失败',
              content: err ? err : '授权失败',
              showCancel: false, //是否显示取消按钮
              success: function (res) {
                //console.log(res);
                if (!res.confirm) {
                  // wx.navigateBack({});
                } else {
                  // wx.navigateBack({});
                  // wx.redirectTo({
                  //   url: "/sub1/pages/auth/index?type=2&url=/pages/mine/auth_list_auth",
                  // });
                }
              },
              fail: function (res) {}, //接口调用失败的回调函数
              complete: function (res) {}, //接口调用结束的回调函数（调用成功、失败都会执行）
            });
          });
        return;
      } catch (error) {
        wx.hideLoading();
        //log.setFilterMsg('1678' + that.data.orderNo);
        //log.info(error);
        // wx.showToast({
        //   title: error.message || error,
        //   icon: 'none',
        //   image: '',
        //   duration: 1500,
        //   mask: false,
        // });

        wx.showModal({
          title: '授权失败',
          content: error.message || error,
          showCancel: false, //是否显示取消按钮
          success: function (res) {
            //console.log(res);
            if (!res.confirm) {
              // wx.navigateBack({});
            } else {
              // wx.navigateBack({});
              // wx.redirectTo({
              //   url: "/sub1/pages/auth/index?type=2&url=/pages/mine/auth_list_auth",
              // });
            }
          },
          fail: function (res) {}, //接口调用失败的回调函数
          complete: function (res) {}, //接口调用结束的回调函数（调用成功、失败都会执行）
        });
      }
    } else {
      let options = {
        url: 'authorizations.do',
        data: JSON.stringify({
          enterpriseName: that.data.enterprise_name1,
          orderNo: that.data.orderNo,
          idName: that.data.authorInfo.REAL_NAME,
          idCardNo: that.data.authorInfo.ID_CARD,
          openID: wx.getStorageSync('openid'),
          socialCreditCode: that.data.socialCreditCode,
          mobile: that.data.tel,
          type: that.data.authorType == '0' ? '0' : '1',
          loanType: that.data.loanType,
          sqrxm: that.data.jieName,
        }),
      };
      //   return;

      requestYT(options).then((res) => {
        if (res.STATUS === '1') {
          if (res.resultCode === '0000') {
            wx.showToast({
              title: '授权成功！',
              icon: 'success',
              mask: true,
              duration: 2000,
            });
            setTimeout(function () {
              wx.switchTab({
                url: '/pages/mine/mine',
              });
            }, 2000);
          } else {
            wx.showToast({
              title: res.resultMsg,
              icon: 'none',
              mask: true,
              duration: 2000,
            });
          }
        }
      });
    }
  },
  // 遮罩层显示
  showagree: function () {
    var that = this;
    that.setData({
      showModalStatus: true,
    });

    if (that.data.xieyiShow === 'SJ') {
      //如果是随e贷申请
      that.ifApplyer();

      let {
        loanType, //借款主体类型
        authorType, //授权人类型
        applyType, //0信用贷 1抵押贷 2人工 3担保
      } = that.data;

      var arr = [];
      arr[0] = {
        10: '101',
        11: applyType === '0' || applyType === '3' ? '102' : '101',
        12: '101',
        20: '103',
        21: '104',
        22: '104',
      };
      arr[2] = {
        10: '109',
        11: '109',
        12: applyType === '0' ? '107' : '106',
        20: '110',
        21: that.data.isApplyer ? '105' : '110',
        22: '110',
      };

      arr[4] = {
        10: '109',
        11: '109',
        20: '110',
        21: '110',
        22: '108',
      };

      arr[1] = {
        20: '110',
        21: '110',
        22: '110',
        10: '109',
        11: '109',
        12: '109',
        13: '109',
      };
      arr[3] = {
        20: '110',
        21: '110',
        22: '110',
        10: '109',
        11: '109',
        12: '109',
        13: '109',
      };
      arr[5] = {
        20: '110',
        21: '110',
        22: '110',
        10: '109',
        11: '109',
        12: '109',
        13: '109',
      };
      arr[6] = {
        20: '110',
        21: '110',
        22: '110',
        10: '109',
        11: '109',
        12: '109',
        13: '109',
      };
      arr[7] = {
        20: '110',
        21: '110',
        22: '110',
        10: '109',
        11: '109',
        12: '109',
        13: '109',
      };

      let docList = {
        101: {
          doc_self: false,
          doc_borrower: false,
          doc_checkbox1: false,
          doc_checkbox2: false,
          doc_checkbox3: true,
          doc_checkbox5: false,
        },
        102: {
          doc_self: false,
          doc_borrower: false,
          doc_checkbox1: true,
          doc_checkbox2: false,
          doc_checkbox3: false,
          doc_checkbox5: true,
        },
        103: {
          doc_self: true,
          doc_borrower: true,
          doc_checkbox1: true,
          doc_checkbox2: false,
          doc_checkbox3: false,
          doc_checkbox5: true,
        },
        105: {
          doc_self: true,
          doc_borrower: false,
          doc_checkbox1: true,
          doc_checkbox2: false,
          doc_checkbox3: false,
          doc_checkbox5: true,
        },

        104: {
          doc_self: false,
          doc_borrower: true,
          doc_checkbox1: false,
          doc_checkbox2: false,
          doc_checkbox3: true,
          doc_checkbox5: false,
        },

        106: {
          doc_self: false,
          doc_borrower: false,
          doc_checkbox1: false,
          doc_checkbox2: false,
          doc_checkbox3: true,
          doc_checkbox5: false,
        },
        107: {
          doc_self: false,
          doc_borrower: false,
          doc_checkbox1: true,
          doc_checkbox2: false,
          doc_checkbox3: false,
          doc_checkbox5: true,
        },
        108: {
          doc_self: true,
          doc_borrower: false,
          doc_checkbox1: true,
          doc_checkbox2: false,
          doc_checkbox3: false,
          doc_checkbox5: true,
        },
        109: {
          doc_self: false,
          doc_borrower: false,
          doc_checkbox1: false,
          doc_checkbox2: true,
          doc_checkbox3: false,
          doc_checkbox5: false,
        },
        110: {
          doc_self: false,
          doc_borrower: true,
          doc_checkbox1: false,
          doc_checkbox2: true,
          doc_checkbox3: false,
          doc_checkbox5: false,
        },
      };

      //获取模板号
      let config = arr[authorType][loanType];
      that.setData({
        config,
      });
      //加载配置
      for (let key in docList[config]) {
        this.setData({
          [key]: docList[config][key],
        });
      }
      //法人授权至少4张模板
      let documentList =
        that.data.authorType == 0
          ? [
              '《个人征信查询授权书》',
              '《个人综合信息查询授权委托书》',
              '《企业征信查询授权书》',
              '《企业综合信息查询授权委托书》',
            ]
          : ['《个人征信查询授权书》', '《个人综合信息查询授权委托书》'];
      let documentIndex = 0;
      let showDoc = ['101', '102', '106', '107'];
      if (showDoc.indexOf(config) > -1) {
        documentList.unshift('《“随e贷”贷款业务申请书》');
        documentIndex = -1;
      }
      if (that.data.authorType == 0 && that.data.enterpriseInfo.city === '3204' && that.data.channelID === '') {
        documentList.push('《企业信用报告查询授权书》&《企业信息采集授权书》');
      }
      if (that.data.applyType === '3') {
        documentList.push('《苏州征信授权书》');
      }
      console.log('documentList', documentList);
      wx.showActionSheet({
        itemList: documentList,
        itemColor: '#0066b3',
        success(res) {
          console.log(res);
          that.setData({
            pagescroll: '.page .noscroll',
          });

          console.log(documentList[res.tapIndex]);
          if (documentList[res.tapIndex] === '《苏州征信授权书》') {
            that.setData({
              document7: false,
            });
          } else {
            that.setData({
              ['document' + (res.tapIndex + documentIndex + 1)]: false,
            });
          }
          that.readingCoundDown();
        },
        fail(res) {
          console.log('fail', res);
          that.setData({
            pagescroll: '.page',
          });
        },
      });
      return;
    } else {
      if (that.data.authorType == 0) {
        wx.showActionSheet({
          itemList: [
            '《个人征信查询授权书》',
            '《个人综合信息查询授权委托书》',
            '《企业征信查询授权书》',
            '《企业综合信息查询授权委托书》',
          ],
          itemColor: '#0066b3',
          success(res) {
            that.setData({
              pagescroll: '.page .noscroll',
            });
            if (res.tapIndex == 0) {
              if (that.data.xieyiShow == 'WD' || (that.data.xieyiShow == 'YB' && that.data.loanType == '1')) {
                //console.log(0);
                that.setData({
                  flag_0: true,
                  flag_wdone: false, //微贷的
                  flag_wdtwo: true,
                  flag_wdthird: true,
                  flag_wdfourth: true,
                  flag_1: true,
                  flag_2: true,
                  flag_3: true,
                  flag_4: true,
                });
              } else {
                //console.log(1);
                that.setData({
                  flag_0: true,
                  flag_wdone: true, //微贷的
                  flag_wdtwo: true,
                  flag_wdthird: true,
                  flag_wdfourth: true,
                  flag_1: false,
                  flag_2: true,
                  flag_3: true,
                  flag_4: true,
                });
              }
            } else if (res.tapIndex == 1) {
              if (that.data.xieyiShow == 'WD' || (that.data.xieyiShow == 'YB' && that.data.loanType == '1')) {
                that.setData({
                  // flag: false,
                  flag_0: true,
                  flag_wdone: true, //微贷的
                  flag_wdtwo: false,
                  flag_wdthird: true,
                  flag_wdfourth: true,
                  flag_1: true,
                  flag_2: true,
                  flag_3: true,
                  flag_4: true,
                });
              } else {
                that.setData({
                  flag_0: true,
                  flag_wdone: true, //微贷的
                  flag_wdtwo: true,
                  flag_wdthird: true,
                  flag_wdfourth: true,
                  flag_0: true,
                  flag_1: true,
                  flag_2: false,
                  flag_3: true,
                  flag_4: true,
                });
              }
            } else if (res.tapIndex == 2) {
              if (that.data.xieyiShow == 'WD' || (that.data.xieyiShow == 'YB' && that.data.loanType == '1')) {
                that.setData({
                  // flag: false,
                  flag_0: true,
                  flag_wdone: true, //微贷的
                  flag_wdtwo: true,
                  flag_wdthird: false,
                  flag_wdfourth: true,
                  flag_1: true,
                  flag_2: true,
                  flag_3: true,
                  flag_4: true,
                });
              } else {
                that.setData({
                  flag_wdone: true, //微贷的
                  flag_wdtwo: true,
                  flag_wdthird: true,
                  flag_wdfourth: true,
                  // flag: false,
                  flag_0: true,
                  flag_1: true,
                  flag_2: true,
                  flag_3: false,
                  flag_4: true,
                });
              }
            } else if (res.tapIndex == 3) {
              if (that.data.xieyiShow == 'WD') {
                that.setData({
                  // flag: false,
                  flag_0: true,
                  flag_wdone: true, //微贷的
                  flag_wdtwo: true,
                  flag_wdthird: true,
                  flag_wdfourth: false,
                  flag_1: true,
                  flag_2: true,
                  flag_3: true,
                  flag_4: true,
                });
              } else {
                that.setData({
                  flag_wdone: true, //微贷的
                  flag_wdtwo: true,
                  flag_wdthird: true,
                  flag_wdfourth: true,
                  flag_0: false,
                  flag_1: true,
                  flag_2: true,
                  flag_3: true,
                  flag_4: false,
                });
              }
            }
          },
          fail(res) {
            ////console.log(res.errMsg)
            that.setData({
              pagescroll: '.page',
            });
          },
        });
      } else {
        wx.showActionSheet({
          itemList: ['《个人征信查询授权书》', '《个人综合信息查询授权委托书》'],
          itemColor: '#0066b3',
          success(res) {
            that.setData({
              pagescroll: '.page .noscroll',
            });
            if (res.tapIndex == 0) {
              if (that.data.xieyiShow == 'WD' || (that.data.xieyiShow == 'YB' && that.data.loanType == '1')) {
                that.setData({
                  flag_0: true,
                  flag_wdone: false,
                  flag_wdtwo: true,
                  flag_wdthird: true,
                  flag_wdfourth: true,
                  flag_1: true,
                  flag_2: true,
                  flag_3: true,
                  flag_4: true,
                });
              } else {
                that.setData({
                  flag_0: true,
                  flag_wdone: true,
                  flag_wdtwo: true,
                  flag_wdthird: true,
                  flag_wdfourth: true,
                  flag_1: false,
                  flag_2: true,
                  flag_3: true,
                  flag_4: true,
                });
              }
            } else if (res.tapIndex == 1) {
              if (that.data.xieyiShow == 'WD' || (that.data.xieyiShow == 'YB' && that.data.loanType == '1')) {
                that.setData({
                  // flag: false,
                  flag_0: true,
                  flag_wdone: true, //微贷的
                  flag_wdtwo: false,
                  flag_wdthird: true,
                  flag_wdfourth: true,
                  flag_1: true,
                  flag_2: true,
                  flag_3: true,
                  flag_4: true,
                });
              } else {
                that.setData({
                  flag_0: true,
                  flag_wdone: true, //微贷的
                  flag_wdtwo: true,
                  flag_wdthird: true,
                  flag_wdfourth: true,
                  flag_0: true,
                  flag_1: true,
                  flag_2: false,
                  flag_3: true,
                  flag_4: true,
                });
              }
            }
          },
          fail(res) {
            that.setData({
              pagescroll: '.page',
            });
          },
        });
      }
    }
  },

  // 遮罩层隐藏
  conceal: function () {
    var that = this;
    that.setData({
      showModalStatus: true,
    });

    if (that.data.xieyiShow === 'SJ') {
      if (this.data.backBtnName !== 0) {
        return;
      }
      let documentList =
        that.data.authorType == 0
          ? [
              '《个人征信查询授权书》',
              '《个人综合信息查询授权委托书》',
              '《企业征信查询授权书》',
              '《企业综合信息查询授权委托书》',
            ]
          : ['《个人征信查询授权书》', '《个人综合信息查询授权委托书》'];
      let documentIndex = 0;

      let showDoc = ['101', '102', '106', '107'];
      if (showDoc.indexOf(that.data.config) > -1) {
        documentList.unshift('《“随e贷”贷款业务申请书》');
        documentIndex = -1;
      }
      if (that.data.authorType == 0 && that.data.enterpriseInfo.city === '3204' && that.data.channelID === '') {
        // documentList.push('《企业信用报告查询授权书》', '《企业信息采集授权书》');
        documentList.push('《企业信用报告查询授权书》&《企业信息采集授权书》');
      }
      if (that.data.applyType === '3') {
        // 和基础趋避 改变documentIndex
        documentList.push('《苏州征信授权书》');
      }
      console.log('documentList', documentList);
      console.log('documentIndex', documentIndex);
      wx.showActionSheet({
        itemList: documentList,
        itemColor: '#0066b3',
        success(res) {
          that.setData({
            pagescroll: '.page .noscroll',
          });
          console.log(documentList[res.tapIndex]);
          if (documentList[res.tapIndex] === '《苏州征信授权书》') {
            that.setData({
              document7: false,
            });
          } else {
            that.setData({
              ['document' + (res.tapIndex + documentIndex + 1)]: false,
            });
          }
          that.readingCoundDown();
        },
        fail(res) {
          that.setData({
            pagescroll: '.page',
          });
        },
      });

      that.setData({
        document0: true,
        document1: true,
        document2: true,
        document3: true,
        document4: true,
        document5: true,
        document6: true,
        document7: true,
      });
      return;
    }

    if (that.data.authorType == 0) {
      wx.showActionSheet({
        itemList: [
          '《个人征信查询授权书》',
          '《个人综合信息查询授权委托书》',
          '《企业征信查询授权书》',
          '《企业综合信息查询授权委托书》',
        ],
        itemColor: '#0066b3',
        success(res) {
          that.setData({
            pagescroll: '.page .noscroll',
          });
          if (res.tapIndex == 0) {
            if (that.data.xieyiShow == 'WD' || (that.data.xieyiShow == 'YB' && that.data.loanType == '1')) {
              //console.log(0);
              that.setData({
                flag_0: true,
                flag_wdone: false, //微贷的
                flag_wdtwo: true,
                flag_wdthird: true,
                flag_wdfourth: true,
                flag_1: true,
                flag_2: true,
                flag_3: true,
                flag_4: true,
              });
            } else {
              //console.log(1);
              that.setData({
                flag_0: true,
                flag_wdone: true, //微贷的
                flag_wdtwo: true,
                flag_wdthird: true,
                flag_wdfourth: true,
                flag_1: false,
                flag_2: true,
                flag_3: true,
                flag_4: true,
              });
            }
          } else if (res.tapIndex == 1) {
            if (that.data.xieyiShow == 'WD' || (that.data.xieyiShow == 'YB' && that.data.loanType == '1')) {
              that.setData({
                // flag: false,
                flag_0: true,
                flag_wdone: true, //微贷的
                flag_wdtwo: false,
                flag_wdthird: true,
                flag_wdfourth: true,
                flag_1: true,
                flag_2: true,
                flag_3: true,
                flag_4: true,
              });
            } else {
              that.setData({
                flag_0: true,
                flag_wdone: true, //微贷的
                flag_wdtwo: true,
                flag_wdthird: true,
                flag_wdfourth: true,
                flag_0: true,
                flag_1: true,
                flag_2: false,
                flag_3: true,
                flag_4: true,
              });
            }
          } else if (res.tapIndex == 2) {
            if (that.data.xieyiShow == 'WD' || (that.data.xieyiShow == 'YB' && that.data.loanType == '1')) {
              that.setData({
                // flag: false,
                flag_0: true,
                flag_wdone: true, //微贷的
                flag_wdtwo: true,
                flag_wdthird: false,
                flag_wdfourth: true,
                flag_1: true,
                flag_2: true,
                flag_3: true,
                flag_4: true,
              });
            } else {
              that.setData({
                flag_wdone: true, //微贷的
                flag_wdtwo: true,
                flag_wdthird: true,
                flag_wdfourth: true,
                // flag: false,
                flag_0: true,
                flag_1: true,
                flag_2: true,
                flag_3: false,
                flag_4: true,
              });
            }
          } else if (res.tapIndex == 3) {
            if (that.data.xieyiShow == 'WD') {
              that.setData({
                // flag: false,
                flag_0: true,
                flag_wdone: true, //微贷的
                flag_wdtwo: true,
                flag_wdthird: true,
                flag_wdfourth: false,
                flag_1: true,
                flag_2: true,
                flag_3: true,
                flag_4: true,
              });
            } else {
              that.setData({
                flag_wdone: true, //微贷的
                flag_wdtwo: true,
                flag_wdthird: true,
                flag_wdfourth: true,
                flag_0: false,
                flag_1: true,
                flag_2: true,
                flag_3: true,
                flag_4: false,
              });
            }
          }
        },
        fail(res) {
          ////console.log(res.errMsg)
          that.setData({
            pagescroll: '.page',
          });
        },
      });
    } else {
      wx.showActionSheet({
        itemList: ['《个人征信查询授权书》', '《个人综合信息查询授权委托书》'],
        itemColor: '#0066b3',
        success(res) {
          that.setData({
            pagescroll: '.page .noscroll',
          });
          if (res.tapIndex == 0) {
            if (that.data.xieyiShow == 'WD' || (that.data.xieyiShow == 'YB' && that.data.loanType == '1')) {
              that.setData({
                flag_0: true,
                flag_wdone: false, //微贷的
                flag_wdtwo: true,
                flag_wdthird: true,
                flag_wdfourth: true,
                flag_1: true,
                flag_2: true,
                flag_3: true,
                flag_4: true,
              });
            } else {
              that.setData({
                flag_0: true,
                flag_wdone: true, //微贷的
                flag_wdtwo: true,
                flag_wdthird: true,
                flag_wdfourth: true,
                flag_1: false,
                flag_2: true,
                flag_3: true,
                flag_4: true,
              });
            }
          } else if (res.tapIndex == 1) {
            if (that.data.xieyiShow == 'WD' || (that.data.xieyiShow == 'YB' && that.data.loanType == '1')) {
              that.setData({
                // flag: false,
                flag_0: true,
                flag_wdone: true, //微贷的
                flag_wdtwo: false,
                flag_wdthird: true,
                flag_wdfourth: true,
                flag_1: true,
                flag_2: true,
                flag_3: true,
                flag_4: true,
              });
            } else {
              that.setData({
                flag_0: true,
                flag_wdone: true, //微贷的
                flag_wdtwo: true,
                flag_wdthird: true,
                flag_wdfourth: true,
                flag_0: true,
                flag_1: true,
                flag_2: false,
                flag_3: true,
                flag_4: true,
              });
            }
          }
        },
        fail(res) {
          that.setData({
            pagescroll: '.page',
          });
        },
      });
    }

    that.setData({
      flag: true,
      flag_wdone: true,
      flag_wdtwo: true,
      flag_wdthird: true,
      flag_wdfourth: true,
      flag_0: true,
      flag_1: true,
      flag_2: true,
      flag_3: true,
      flag_4: true,
    });
  },
  checkedList: function (e) {
    this.setData({
      checklist: e.detail.value[0] == 'true' ? 'checked' : '',
    });
  },
  back: function () {
    wx.switchTab({
      url: 'mine',
    });
  },
  apli: function () {
    var that = this;
    //证件拍照

    user
      .getIdentityInfo()
      .then((res) => {
        wx.showLoading({
          title: '加载中',
          mask: true,
        });

        user.getFaceVerify().then((res) => {
          that.setData({
            hasImageBatchId: res.BATCH_ID && true,
          });
        });


        //证件拍照
		user.getIdentityInfo().then(res => {
			var shengfe = res;
			console.log('shengfe',shengfe)
			 that.setData({
			 	identity: shengfe,
			 	showNon2: true,
       });
      console.log('shengfe',shengfe)
			 if(shengfe.ATTR3 != '' && shengfe.ATTR3 != undefined && shengfe.ATTR3 != null){
				
			 }else{
			 	wx.showModal({
           title: '提示',
           content: '请先完成身份认证',
           showCancel: false,
           confirmText: '确定',
           success: (result) => {
             if (result.confirm) {
               wx.redirectTo({
                 url: '/sub1/pages/auth/index',
               });
             }
           },
           fail: () => {},
           complete: () => {},
         });
			 }
			
            
		}).catch(err=>{
            
    });
        user
          .getCustomerInfo()
          .then((res) => {
            var customer = res;
            if (customer.REAL_NAME != null && customer.ID_CARD != null) {
              that.setData({
                applicantName: customer.REAL_NAME,
                farenName: customer.REAL_NAME,
                applicantIdcards: customer.ID_CARD,
                applicantIdcard2: customer.ID_CARD.substring(0, 4) + '****' + customer.ID_CARD.substring(14, 18),
                tel: customer.TEL ? customer.TEL : '',
                authorInfo: customer,
              });
              if (
                that.data.applicantIdcards == that.data.authorInfo.ID_CARD &&
                that.data.applicantName == that.data.authorInfo.REAL_NAME
              ) {
                that.setData({
                  coverAuth: true,
                });
                let arr = [];
                Order.getOrderInfoByOrderNo(that.data.orderNo)
                  .then((res) => {
                    that.setData({
                      // enterprise_name: res.ENTERPRISE_NAME,
                      // apply_amount: res.APPLY_AMOUNT,
                      apply_term: res.APPLY_TERM,
                      vouch_type: res.VOUCH_TYPE,
                      purpose: res.PURPOSE,
                      loanType: res.ATTR1 ? res.ATTR1 : '',
                    });
                  })
                  .catch((err) => {
                    // console.log(err);
                  });

                arr[0] = Order.getOrderInfoByOrderNoWithinWD(that.data.orderNo).then((res) => {
                  //console.log(res);
                  var autors = res;
                  for (let i in autors) {
                    if (
                      that.data.applicantName == autors[i].authorizerName &&
                      that.data.applicantIdcards == autors[i].authorizerCard
                    ) {
                      console.log(autors[i].authorizerName + autors[i].authorizerCard);
                      var a = autors[i].authorizerType;
                      const businessType = autors[i].resvFld1;
                      var aName = '';
                      let authCode = '';
                      switch (a) {
                        case '0':
                          aName = '法定代表人';
                          authCode = businessType === '1' ? '1' : '05';
                          break;
                        case '1':
                          aName = '法人配偶';
                          authCode = businessType === '1' ? '7' : '07';
                          break;
                        case '2':
                          aName = '企业股东';
                          authCode = businessType === '1' ? '2' : '05';
                          break;
                        case '3':
                          aName = '其他';
                          authCode = businessType === '1' ? '7' : '07';
                          break;
                        case '4':
                          aName = '实际控制人';
                          authCode = businessType === '1' ? '2' : '05';
                          break;
                        case '5':
                          aName = '实际控制人配偶';
                          authCode = businessType === '1' ? '7' : '07';
                          break;
                        case '6':
                          aName = '企业股东配偶';
                          authCode = businessType === '1' ? '7' : '07';
                          break;
                        case '7':
                          aName = '第三方抵押人';
                          authCode = businessType === '1' ? '3' : '07';
                          break;
                      }
                      that.setData({
                        authorType: a,
                        authorTypeName: aName,
                        autorStatus: autors[i].authorizeStatus,
                        authCode: autors[i].resvFld2 || authCode,
                      });
                      console.log('OK1');
                      return;
                    }
                  }
                });
                arr[1] = new Promise((resolve, reject) => {
                  if (that.data.xieyiShow == 'SJ') {
                    Order.getNodeInfoByOrderNo(that.data.orderNo).then((res) => {
                      console.log('cc', res);
                      that.setData({
                        sedID: res.SED_ID,
                        jieName: res.pInfo.jk.applyName,
                        loanType: res.form.node5.loanType,
                        legalInfo: res.pInfo.fr,
                        applyType: res.form.node3.applyType,
                        applyerType: res.form.node2.applyerType,
                        apply_amount1: res.form.node3.applyNum,
                        enterpriseInfo: res.form.node2.enterpriseInfo,
                        enterprise_name1: res.form.node2.enterpriseInfo.ORG_NAME,
                        socialCreditCode: res.form.node2.enterpriseInfo.ORG_CODE,
                        depositBankName: res.form.node2.depositBankName, //开户行
                        jk: res.pInfo.jk,
                        channelID: res.CHANNEL_ID || '',
                      });
                      resolve('订单信息查询成功');
                      console.log('OK2');
                    });
                  } else {
                    resolve();
                  }
                });

                Promise.all(arr)
                  .then((err) => {
                    wx.hideLoading();
                    console.log('ok3');
                  })
                  .catch((err) => {
                    wx.hideLoading();
                    wx.showModal({
                      title: '提示',
                      content: err,
                      showCancel: false,
                      confirmText: '确定',
                      success: (result) => {
                        wx.navigateBack({
                          delta: 1,
                        });
                      },
                    });
                  });
              } else {
                wx.showToast({
                  title: '您不是授权人，无权访问。',
                  icon: 'none',
                  mask: true,
                  duration: 2000,
                });
                setTimeout(function () {
                  wx.switchTab({
                    url: '/pages/shop/index2',
                  });
                }, 2000);
              }
            } else {
              wx.showModal({
                title: '提示',
                content: '请先完成身份认证',
                showCancel: false,
                confirmText: '确定',
                success: (result) => {
                  if (result.confirm) {
                    wx.redirectTo({
                      url: '/sub1/pages/auth/index',
                    });
                  }
                },
                fail: () => {},
                complete: () => {},
              });
            }
          })
          .catch((err) => {
            console.log('cc', err);
          });
      })
      .catch((err) => {
        if (err === 'unSelectIdcard') {
          wx.showModal({
            title: '提示',
            content: '请先进行身份证拍照认证',
            showCancel: true, //是否显示取消按钮
            success: function (res) {
              if (!res.confirm) {
                wx.switchTab({
                  url: '/pages/shop/index2',
                });
              } else {
                wx.navigateTo({
                  url: '/sub1/pages/info/identify?page=auth',
                });
              }
            },
          });
        }
      });
  },

  readingCoundDown() {
    let time = 5;
    this.setData({
      backBtnName: time,
    });
    let cutDown = setInterval(() => {
      time--;
      console.log(time);
      if (time < 1) {
        clearInterval(cutDown);
      }
      this.setData({
        backBtnName: time,
      });
    }, 1000);
  },
});
