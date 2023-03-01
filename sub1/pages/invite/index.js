const { default: Org } = require('../../../api/Org');
import Toast from '../../static/vant-weapp/toast/toast';
import {
  addInviteInfo,
  accpetInvitation
} from './api.js';
import { shareApp} from '../../../utils/api';
import User from '../../../utils/user';
const app = getApp();

Page({
  data: {
    testUrl: 'https://wxapptest.jsbchina.cn/rhedt/',
    // 单选
    buttons: [{
      id: 0,
      name: '公私联动'
    }, {
      id: 1,
      name: '全员推荐'
    }],
    mybgyc: false, //  控制背景的显示隐藏
    mybuht: true, //  控制背景的显示隐藏
    addincard: true, //控制企业名称显示
    idcart: '', //选中的全员推荐或公私联动
    youidcart: '',
    cndUrl: app.globalData.CDNURL,
    showRelationshipPicker: false,
    hasEnterPrise: false,
    showBaseEnter: false,
    showMsg: false,
    showBaseEnter: false,
    flag: true,
    relationshipList: ['法定代表人', '实际控制人', '法定代表人配偶', '实际控制人配偶', '财务负责人', '股东', '员工'],
    msgList: [
      {
        bg: 'bg_msg_success.png',
        icon: 'icon_msg_success.png',
        msg1: '感谢您的参与！',
        msg2: '我们将尽快通知理财经理联系您，开启您在江苏银行的财富之旅。',
        confirm_button_text: '完成',
        status: '0',
      },
      {
        bg: 'bg_msg_error.png',
        icon: 'icon_msg_error.png',
        msg1: '您好，',
        msg2: '该用户不是企业的法定代表人',
        confirm_button_text: '我知道了',
        status: '1',
      },

      {
        bg: 'bg_msg_error.png',
        icon: 'icon_msg_error.png',
        msg1: '您好，',
        msg2: '请先完成实名认证，您可点击下方按钮前往实名认证页面。',
        confirm_button_text: '实名认证',
        status: '2',
      },
      {
        bg: 'bg_msg_error.png',
        icon: 'icon_msg_error.png',
        msg1: '您好，',
        msg2: '请邀请函本人进行确认',
        confirm_button_text: '完成',
        status: '3',
      },
      {
        bg: 'bg_msg_error.png',
        icon: 'icon_msg_error.png',
        msg1: '您好，',
        msg2: '请邀请函本人进行确认',
        confirm_button_text: '确认',
        status: '99',
      },
    ],
    msg: {},
    enterpriseInfo: {},
    customerInfo: {},
    inviteId: '',
    relationship: '',
    inviteeName: '',
    type: 'add',
  },
  radioButtonTap: function (e) { //新增点击时公私联动或者全员推荐
    console.log(e)
    let idcart = e.currentTarget.dataset.id
    console.log(idcart)

    this.setData({
      idcart
    })
    console.log(this.data.idcart);
    if (idcart == 0) {
      this.setData({
        addincard: true,
        hasEnterPrise: false,
        mybgyc: false, //  控制背景的显示隐藏
        mybuht: true,
      })
    }
    if (idcart == 1) {
      this.setData({
        addincard: false,
        hasEnterPrise: false,
        mybgyc: true, //  控制背景的显示隐藏
        mybuht: false,
      })
    }
    for (let i = 0; i < this.data.buttons.length; i++) {
      if (this.data.buttons[i].id == idcart) {
        //当前点击的位置为true即选中
        this.data.buttons[i].checked = true;
      } else {
        //其他的位置为false
        this.data.buttons[i].checked = false;
      }
    }
    this.setData({
      buttons: this.data.buttons
    })
  },
  onLoad: async function (options) { //分享点击进入
    this.data.buttons[0].checked = true;
    this.setData({
      buttons: this.data.buttons,
    }) //默认选中0
    console.log("options", options); //undefined
    if (options.inviteeName != undefined) {
      console.log(options.inviteeName);
      console.log(options);
      this.setData({
        type: 'confirm', //进入邀请函
        inviteeName: options.inviteeName,
        youidcart: options.idcart, //传进去的公私联动或全员0-1
        inviteId: options.inviteId
      });
      // console.log(this.setData.idcart);
    }
    if (options.id) {
      this.setData({
        type: 'confirm',
        inviteId: options.id,
        inviteeName: options.name,
      });
    }
  },

    onShow: async function(options) {
        if (this.data.inviteId && this.data.type === 'confirm') {
            Toast.loading({
                message: '加载中...',
                forbidClick: true,
                loadingType: 'spinner',
            });
            try {
                if (wx.getStorageSync('openid') === '') {
                    await api.getSessionInfo();
                }
                // const customerInfo = await User.getIdentityInfo();
                // this.setData({
                //     customerInfo,
                // });
                // if (this.data.customerInfo.NAME !== this.data.inviteeName) {
                //     this.setData({
                //         showMsg: true,
                //         msg: this.data.msgList.find((e) => e.status === '3'),
                //     });
                //     return;
                // }
                const customerInfo = await User.getCustomerInfo();
                this.setData({
                    customerInfo,
                });
                if (this.data.customerInfo.REAL_NAME !== this.data.inviteeName) {
                    this.setData({
                        showMsg: true,
                        msg: this.data.msgList.find((e) => e.status === '3'),
                    });
                    return;
                }
            } catch (error) {
                if (error === 'unCustomerInfo') {
                    if (!this.data.customerInfo.REAL_NAME) {
                        this.setData({
                            showMsg: true,
                            msg: this.data.msgList.find((e) => e.status === '2'),
                        });
                        return;
                    }
                }
                console.log(error);
            } finally {
                Toast.clear();
            }
        }
    },

  showImg() {
    wx.navigateTo({
      url: '/sub2/pages/showImg/showImg?skipUrl=' + this.data.cndUrl + '/static/wechat/img/invite/img_desc.jpg',
    });
  },

  pickRelationship: function (e) {
    if (!this.data.inviteeName) {
      Toast('请先输入客户姓名');
      return;
    }
    this.setData({
      showRelationshipPicker: true,
    });
  },

  onConfirm(e) {
    this.setData({
      relationship: e.detail.value,
      showRelationshipPicker: false,
    });
  },

  showBaseEnter(e) {
    console.log(e);
    if (e.detail.value.length == '') {
      Org.getLocalEnterpriseList(null, '14').then((res) => {
        this.setData({
          enterpriseCardInfo: res,
          enterpriseAdded: res,
          showBaseEnter: true,
        });
      });
    } else {
      this.setData({
        showBaseEnter: true,
      });
    }
  },

  searchEnter(e) {
    console.log(e);
    this.setData({
      'enterpriseInfo.cREDITCODE': '',
    });
    let companyName = e.detail.value;
    if (companyName.length >= 4 && /^[\u4E00-\u9FA5-（）()]{4,50}$/.test(companyName)) {
      Org.getEnterpriseList(companyName)
        .then((enterpriseCardInfo) => {
          this.setData({
            enterpriseCardInfo,
            showBaseEnter: true,
          });
        })
        .catch(() => {
          this.setData({
            showBaseEnter: false,
          });
        });
    }
  },

  async chooseEnter(e) {
    var that = this;

    Toast.loading({
      message: '加载中...',
      forbidClick: true,
      loadingType: 'spinner',
    });
    let companyName = e.currentTarget.dataset.orgname;
    console.log(companyName);
    try {
      const res = await Org.getEnterpriseInfo({
        type: '1',
        companyName,
      });

      console.log('授权人身份校验结果', res);

      if (!(res.enterpriseInfo.eNTNAME && res.enterpriseInfo.cREDITCODE)) {
        Toast('企业信息异常');
      }

      that.setData({
        hasEnterPrise: true,
        enterpriseInfo: res.enterpriseInfo,
      });
    } catch (err) {
      console.log(err);
    } finally {
      that.setData({
        showBaseEnter: false,
      });
      Toast.clear();
    }
  },

    onClose(e) {
        let { status } = e.currentTarget.dataset;
      
        if (status === '0' || status === '3') {
            wx.switchTab({
                url: '/pages/shop/index2',
            });
        }
        if (status === '2') {
            wx.navigateTo({
                url: '/sub1/pages/auth/index?status=1',
            });
        }
        this.setData({
            showMsg: false,
        });
    },

  addInvitation: async function () {
    if (!this.data.inviteeName) {
      Toast('请先输入客户姓名');
      return;
    }

    if (this.data.idcart == 1) {
      return
    }
    if (this.data.enterpriseInfo.eNTNAME) {
      if (!this.data.enterpriseInfo.cREDITCODE) {
        Toast('请先选择企业');
        return;
      }

      if (!this.data.relationship) {
        Toast('请选择客户与企业关系');
        return;
      }

      if (this.data.relationship === '法定代表人' && this.data.enterpriseInfo.fRNAME !== this.data.inviteeName) {
        this.setData({
          showMsg: true,
          msg: this.data.msgList.find((e) => e.status === '1'),
        });
        return;
      }
    } else {
      Toast('请先选择企业');
      return;
    }

    Toast.loading('保存中');

    try {
      const inviteId = await addInviteInfo({
        share_openid: wx.getStorageSync('openid'),
        name: this.data.inviteeName,
        company_name: this.data.enterpriseInfo.eNTNAME,
        company_code: this.data.enterpriseInfo.cREDITCODE,
        relation: this.data.relationship,
        reserve1: JSON.stringify(0),
      });
      console.log(inviteId);
      this.setData({
        inviteId,
      });
      return inviteId;
    } catch (error) {
      Toast.fail(error.message || error);
    } finally {
      Toast.clear();
    }
    return;
  },
  acceptInvitation: async function () {

    if (this.data.youidcart == 1) {
        try {
            const res = await accpetInvitation({
              id: this.data.inviteId,
              openid: wx.getStorageSync('openid'),
            });
            console.log(res);
            this.setData({
              showMsg: true,
              msg: this.data.msgList.find((e) => e.status === '0'),
            });
          } catch (error) {
              console.log(error);
            // Toast.fail(error.message || error);
            const msg = this.data.msgList.find((e) => e.status === '99');
            if(error.message == '姓名不一样'){
                msg.msg2 = '请邀请函本人进行确认' || error;
            }else{
                msg.msg2 = error.message || error;
            }
            console.log(msg);
            this.setData({
              showMsg: true,
              msg,
            });
          } finally {
            Toast.clear();
          }
          return
    }else{
         Toast.loading({
      message: '加载中...',
      forbidClick: true,
      loadingType: 'spinner',
    });

    try {
      const res = await accpetInvitation({
        id: this.data.inviteId,
        openid: wx.getStorageSync('openid'),
      });
      this.setData({
        showMsg: true,
        msg: this.data.msgList.find((e) => e.status === '0'),
      });
    } catch (error) {
      Toast.fail(error.message || error);
      const msg = this.data.msgList.find((e) => e.status === '99');
      msg.msg2 = error.message || error;
      this.setData({
        showMsg: true,
        msg,
      });
    } finally {
      Toast.clear();
    }
    }
   


  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: async function () {
    const res = await this.addInvitation();
    console.log(res);
    if (res) {
      const params = `&id=${this.data.inviteId}&name=${this.data.inviteeName}&idcart=${this.data.idcart}`;
      console.log(params);
      return shareApp('', params);
    }
    console.log("res", res); //undefined
    if (this.data.idcart == 1) {
      if (!this.data.inviteeName) { //判断输入
        Toast('请先输入客户姓名');
        // return;
      }
      if (this.data.inviteeName) {
        console.log("addInviteInfo", addInviteInfo);
        const inviteId = await addInviteInfo({
          share_openid: wx.getStorageSync('openid'), //微信openid
          // share_openid: 'odypO5S2BBDb-Cfqc0mLQDSMpCto',//微信openid
          name: this.data.inviteeName,
          reserve1: JSON.stringify(this.data.idcart),
        });
        this.setData({
          inviteId,
        });
        console.log("inviteId", inviteId);
        console.log("inviteId2", this.data.inviteId);
        return {
          title: '邀请您体验江苏银行财富之旅',
          path: "/sub1/pages/invite/index?inviteeName=" + this.data.inviteeName + '&idcart=' + this.data.idcart + '&inviteId=' + this.data.inviteId, //跳转到邀请函
          imageUrl: '',
          success: function (res) {
            console.log(res, 111);
            if (res.errMsg == 'shareAppMessage:ok') {
              console.log("成功", res)
            }
          },
          fail: function (res) {
            console.log("失败", res)
          }
        }
      }
    }
  },
});
