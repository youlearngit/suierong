// sub3/pages/addAuthorizer/index.js
var app = getApp();
var that;
var encr = require('../../../utils/encrypt/encrypt');
var aeskey = encr.key; //随机数
Page({
  /**
   * 页面的初始数据
   */
  data: {
    authorizerType_array: [
      '法人代表配偶',
      '企业股东',
      '其他',
      '实际控制人',
      '实际控制人配偶',
      '企业股东配偶',
      '第三方抵押人',
    ],
    orderNo: '',
    resvFld5: {},
    authorizerTypeList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.setData({
      preffixUrl: app.globalData.JSBURL,
      orderNo: options.orderNo,
      resvFld1: options.resvFld1,
    });

    //console.log(options)
    if (options.resvFld1 === '1') {
      this.setData({
        authorizerTypeList: [
          {
            name: '高管/自然人股东/实际控制人',
            value: '2',
          },
          {
            name: '个人连带责任保证人/抵押人/质押人',
            value: '3',
          },
          {
            name: '授信相关自然人',
            value: '7',
          },
        ],
      });
    } else {
      this.setData({
        authorizerTypeList: [
          {
            name: '担保人',
            value: '03',
          },
          {
            name: '实体企业法定代表人/高管/股东',
            value: '05',
          },
          {
            name: '授信相关自然人',
            value: '07',
          },
        ],
      });
    }
  },

  pickAuthorizerType(e) {
    //console.log(e);
    //console.log(this.data.authorizerTypeList[e.detail.value]);
    this.setData({
      resvFld5: this.data.authorizerTypeList[e.detail.value],
    });
  },

  pickChange(e) {
    that.setData({
      authorizerType: e.detail.value,
    });
  },

  submitForm(e) {
    let params = e.detail.value;
    if (params.authorizerCard.length != 18 || !/^[0-9a-zA-Z]*$/g.test(params.authorizerCard)) {
      wx.showToast({
        title: '请填写合法的身份证号',
        icon: 'none',
      });
      return;
    }

    if (params.authorizerType === '' || params.authorizerName === '' || params.authorizerCard === '') {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none',
      });
      return;
    }

    if (/[^\u4E00-\u9FA5]/g.test(params.authorizerName)) {
      wx.showToast({
        title: '请输入授权人中文姓名',
        icon: 'none',
      });
      return;
    }

    let dataJson = JSON.stringify({
      authorizerType: (parseInt(that.data.authorizerType) + 1).toString(),
      authorizerName: params.authorizerName,
      authorizerCard: params.authorizerCard,
      orderNo: that.data.orderNo,
      // orderNo: "YB20201016005168",
      resvFld5: this.data.resvFld5.value,
    });
    console.log(dataJson);
    let custnameTwo = encr.jiami(dataJson, aeskey); //3段加密
    wx.request({
      url: app.globalData.YTURL + 'addAuthorizer.do',
      method: 'POST',
      data: encr.gwRequest(custnameTwo),
      success(res) {
        //console.log("添加授权人结果1", res);

        if (res.data.head.H_STATUS === '1') {
          let _data = encr.aesDecrypt(res.data.body, aeskey);
          //console.log("添加授权人结果2", _data);
          if (_data.resultCode === '0000') {
            wx.showModal({
              title: '提示',
              content: _data.resultMsg,
              showCancel: false,
              confirmText: '确定',
              success: (result) => {
                if (result.confirm) {
                  wx.navigateBack({
                    delta: 1,
                  });
                }
              },
            });
          } else {
            wx.showModal({
              title: '提示',
              content: _data.resultMsg,
              showCancel: false,
              confirmText: '确定',
              success: (result) => {
                if (result.confirm) {
                }
              },
            });
          }
        } else {
          wx.showToast({
            title: res.data.head.H_MSG || res.data.body.MSG,
            icon: 'none',
            duration: 3000,
          });
        }
      },
    });
  },
});
