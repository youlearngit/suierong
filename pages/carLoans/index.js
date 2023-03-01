  // pages/carLoans/index.js 个人车贷入口
  import user from '../../utils/user';
  import requestYT from '../../api/requestYT';
  var app = getApp();
  Page({

      /**
       * 页面的初始数据®
       */
      data: {
          preffixUrl: '',
          isPass: false,
          cndUrl: app.globalData.CDNURL,
          CustomBar: app.globalData.CustomBar + 24,
          showRecentChat: false,
          contactInfo: {},
          showChatComponent: false,
          showBless: false,
          code: '',
          isValidCardDialog: false,
          type: '',

          //获取授权信息使用字段 start
          canSubmit: true,
          showTips: true,
          loginFlag: true,
          //获取授权信息使用字段 end
          prjId: '', //车商编号

    identityInfoFlag: false, //标记用户信息是否补录完毕
    faceFlag:false,//标记用户信息是否补录完毕
    telFlag:false, //标记用户手机好是否绑定
  },

      /**
       * 生命周期函数--监听页面加载
       */
      onLoad: function(options) {
          this.setData({
              preffixUrl: app.globalData.CDNURL,
          });
          this.setData({
              prjId: options.scene || '',
          });
          this.getUserInfo();
      },
      //用户授权登陆
      verifyUser(e) {
          if (this.data.showTips == false) {
              //如果没登陆
              this.getAmount();
          } else {
              //正常跳转功能页
              var urlFlag = e.currentTarget.dataset.urlFlag;
              if (urlFlag == 'apply') {
                  this.toApply();
              } else {
                  if (this.data.identityInfoFlag == false || this.data.faceFlag == false || this.data.telFlag == false) {
                      wx.showModal({
                          title: '提示',
                          content: '您的信息不完整，请补录信息！',
                          showCancel: true,
                          confirmText: '确定',
                          confirmColor: '#3CC51F',
                          success: (result) => {
                              if (result.confirm == true) {
                                  goUrl = '/pages/carLoans/orc';
                                  wx.navigateTo({
                                      url: goUrl,
                                  })
                              }
                          },
                          fail: () => {},
                          complete: () => {},
                      });
                  } else {
                      var goUrl = ''
                      if (urlFlag == 'order') {
                          goUrl = "/sub3/pages/order/index";
                      } else if (urlFlag == 'authorization') {
                          goUrl = '/sub3/pages/authorization/index';
                      } else if (urlFlag == 'contract') {
                          goUrl = '/sub3/pages/contract/carcontract/index';
                      }
                      wx.navigateTo({
                          url: goUrl,
                      })
                  }
              }
          }
      },
      //跳转申请
      toApply() {
          if (!this.data.prjId) {
              this.setData({
                  isValidCardDialog: true,
              });
          } else {
              this.searchCardInfo();
          }
      },
      //查询车商信息
      getCarChannelInfo: function() {
          wx.showLoading({
              title: '查询项目信息中，请稍等...',
              mask: true
          })
          let that = this;
          let options = {
              url: 'carloan/judgePass.do',
              data: {
                  prjId: that.data.prjId,
              }
          };
          requestYT(options).then((res) => {
              console.log('0029', options.data, res)
              if (res.STATUS === '1' && res.msgCode != '1111') {
                  let prj_base_list, sui_prd_id_list = '',
                      PRJ_NAME = '',
                      PRJ_POU_NAME = '',
                      loanList;
                  prj_base_list = res.PRJ_BASE_LIST ? JSON.parse(res.PRJ_BASE_LIST) : '';
                  sui_prd_id_list = res.sui_prd_id_list || '';
                  if (prj_base_list && prj_base_list.length) {
                      PRJ_NAME = prj_base_list[0].pRJ_NAME || '';
                      PRJ_POU_NAME = prj_base_list[0].pRJ_POU_NAME || '';
                  }
                  loanList = res.PRJ_CAR_LIST || res.PRJ_BUILDING_LIST;

                  //判断条件顺序：全部-all,一手车-1,二手车-2
                  that.setData({
                      isValidCardDialog: false,
                  });
                  wx.navigateTo({
                      url: `/sub3/pages/apply/index?prjId=${that.data.prjId}&contains=${sui_prd_id_list}&PRJ_NAME=${PRJ_NAME}&PRJ_POU_NAME=${PRJ_POU_NAME}&loanList=${loanList}`
                  })
              } else {
                  wx.hideLoading({
                      success: (res) => {
                          that.setData({
                              isPass: false,
                              isValidCardDialog: true
                          });
                      },
                  })
              }
          });
      },
      //获取微信用户信息是否有完成信息录入
      getUserInfo(e) {
          // 获取个人信息
          user.getCustomerInfo().then((r) => {
              this.setData({
                  telFlag: r.TEL ? true : false,
              });
          }).catch((err) => {});
          //证件拍照
          user.getIdentityInfo().then((res) => {
              if (Object.keys(res).length) {
                  this.setData({
                      identityInfoFlag: true,
                  });
              } else {
                  this.setData({
                      identityInfoFlag: false,
                  });
              }
          }).catch((err) => {});
          //获取面部识别校验
          user.getFaceVerify().then((res) => {
              //有面部识别
              this.setData({
                  faceFlag: true,
              });
          }).catch((err) => {});
      },
      //弹窗 start
      modal_click_Hidden: function() {
          this.setData({
              isValidCardDialog: true,
          })
      },

  popClose: function () {
    this.setData({
      isValidCardDialog: false,
    });
  },
  //弹窗 end

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setStorageSync('carPageIndex', getCurrentPages().length);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    if(this.data.identityInfoFlag == false || this.data.faceFlag == false || this.data.telFlag == false){
      this.getUserInfo();
    }
    if(this.data.type != '' && this.data.type != undefined){
      if(this.data.type == 'applyResult'){
        this.setData({
          type:''
        });
        wx.navigateTo({
          url: '/sub3/pages/order/index',
        })
      }
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},

      //获取授权
      getAmount() {
          var that = this;
          if (that.data.canSubmit) {
              that.setData({
                  canSubmit: false,
              });
              setTimeout(() => {
                  that.setData({
                      canSubmit: true,
                  });
              }, 3000);
              user.ifAuthUserInfo().then((res) => {
                  if (res) {
                      this.setData({
                          showTips: true,
                      });
                      // todo 先查询车贷渠道商入口是否正常可用，可以则申请授权
                  } else {
                      that.setData({
                          loginFlag: false,
                      });
                      return Promise.reject('未授权登陆');
                  }
              }).catch((err) => {});
          } else {}
      },
      //获取车商信息
      searchCardInfo() {
          let that = this;
          if (that.data.prjId) { //通过扫码进入
              that.getCarChannelInfo();
          } else { //通过小程序进入
              that.setData({
                  isValidCardDialog: true
              });
          }
      },
      //取消授权
      cancelLogin(event) {
          this.popClose();
      },
      //获取微信个人信息
      getAuthInfo(authRes) {
          if (authRes.detail.errMsg) {
              this.popClose();
          }
      },
      toDetail() {
          wx.navigateTo({
              url: '/sub3/pages/understanding/index?type=1'
          })
      },
      toDetails() {
          wx.navigateTo({
              url: '/sub3/pages/understanding/index'
          })
      },
      /**
       * 生命周期函数--监听页面卸载
       */
      onUnload: function() {

  },
})


