// pages/carLoans/contract/carcontract/index.js
import user from '../../../../utils/user';
import requestYT from '../../../../api/requestYT';
//import api from "../../../../utils/api";
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    preffixUrl:'',
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
    resultItems:[],
    userId: '',
    certNo:'',
    exitsList:0,//已签约列表长度
    nonexistentList:0,//未签约列表长度
  },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        wx.getSystemInfo({
            success: function(res) {
                that.setData({
                    winWidth: res.windowWidth,
                    winHeight: res.windowHeight
                });
            }
        });
    },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    user.getCustomerInfo().then((r) => {
      that.setData({
        certNo:r.ID_CARD,
        preffixUrl: app.globalData.CDNURL,
        userId: wx.getStorageSync('openid'),
      });
        //获取真实数据
    that.selectItem();
    });
    wx.showLoading({
      title: '请稍候',
      icon: 'none',
      mask: 'true',
    })
  },

    //获取真实数据
    selectItem: function() {
        let options = {
            url: 'carloan/getContactList.do',
            data: JSON.stringify({
                contType: '2',
                certCode: this.data.certNo,
                startNo: "1",
                queryNum: "100",
            }),
        };
        requestYT(options).then((res) => {
            if (res.STATUS === '1') {
                if (res.contactList != '') {
                    var list = JSON.parse(res.contactList);
                    console.log('合同列表', list)
                    if (list.length) {
                        list.forEach(item => {
                            if (item.guarContSigningStatus != '1') {
                                this.setData({
                                    nonexistentList: this.data.nonexistentList + 1 //未签约列表长度
                                });
                            } else {
                                this.setData({
                                    exitsList: this.data.exitsList + 1 //已签约列表长度
                                });
                            }
                        });

                        this.setData({
                            resultItems: list,
                        });
                    }
                }
            }
            wx.hideLoading();
        }).catch(err => {
            this.alertError('合同数据异常');
            wx.hideLoading();
        });
    },
    //  返回首页
    goHome: function() {
        wx.navigateBack({
            delta: 1,
        })
    },
    // tab切换逻辑
    swichNav: function(e) {
        var that = this;
        if (this.data.currentTab === e.target.dataset.current) {
            return false;
        } else {
            that.setData({
                currentTab: e.target.dataset.current
            })
        }
    },
    bindChange: function(e) {
        var that = this;
        that.setData({ currentTab: e.detail.current });
    },
    searchDetail: function(e) {
        var item = e.currentTarget.dataset.item
        var flag = item.guarContSigningStatus == '' ? false : true;
        wx.navigateTo({
            url: '/sub3/pages/contract/carcontract/detail/detail?guarContNo=' + item.guarContNo + '&contNo=' + item.contNo + '&flag=' + flag,
        })
    },
    //提示框
    alertError(content) {
        wx.showModal({
            title: '提示',
            content: content,
            showCancel: false,
            confirmText: '确定',
            confirmColor: '#3CC51F',
            success: (result) => {
                if (result.confirm) {}
            },
            fail: () => {},
            complete: () => {},
        });
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

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

  }
})