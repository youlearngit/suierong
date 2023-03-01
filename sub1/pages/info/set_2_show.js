import WxValidate from '../../../assets/plugins/wx-validate/WxValidate';
import requestP from '../../../utils/requsetP';
import api from '../../../utils/api';
import user from '../../../utils/user';

var citys = require('../../../pages/public/city.js');
var util = require('../../../utils/util.js');
const app = getApp();
const date = new Date();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    idcard: {
      name: '', //姓名
      number: '', //证件号
      date: '', //证件有效期
      gender: '', //性别
      certificate_type: '', //证件类型
      legality: '', //合法性验证结果
      address: '', //地址
      race: '', //民族
      birthday: '', //生日
      issued_by: '', //签发机关
      number1: '',
    },
    preffixUrl: '',
    add: '',
    edit: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      preffixUrl: app.globalData.URL,
    });

    if (options.edit == 1) {
      that.setData({
        edit: false,
      });
    }
    wx.showLoading({
      title: '加载中...',
    });
    user.getIdentityInfo().then((res) => {
      var data = res;

      this.setData({
        idcard: {
          name: api.formateName(res.NAME),
          number: api.formateIdCard(res.ID_NUMBER),
          number2:res.ID_NUMBER,
          date: res.VALID_DATE,
          certificate_type: res.CERTIFICATE_TYPE, //证件类
          address: res.ADDRESS,
        },
        add: res.ADDRESS,
      });
    });
    wx.hideLoading();
  },

  deleteIdentity() {

    wx.showModal({
        content: '是否解除绑定身份信息',
        showCancel: true,
        cancelText:'取消',
        confirmText: '确定',
        success: (result) => {
            if(result.confirm){
                user.deleteIdentityInfo(this.data.idcard.number2)
                .then(() => {
                  wx.navigateBack();
                })
                .catch((err) => {
                  wx.showToast({
                    title: err.message || err,
                  });
                });
            }
        },
        fail: ()=>{},
        complete: ()=>{}
    });
   
  },
  
  back() {
    wx.navigateBack();
  },
  updateAddress() {
    var that = this;
    user
      .updateAddress(that.data.add)
      .then((res) => {
        wx.showToast({
          title: res,
          icon: 'none',
          duration: 1500,
          complete: function () {
            setTimeout(function () {
              wx.navigateBack({ delta: 2 });
            }, 1500);
          },
        });
      })
      .catch((err) => {
        wx.showToast({
          title: err || '网络异常',
          icon: 'none',
          duration: 2000,
        });
      });
  },

  getInput: function (e) {
    var that = this;
    that.setData({
      add: e.detail.value,
    });
  },
});
