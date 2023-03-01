// pages/carLoans/authorization/index.js
import requestYT from '../../../api/requestYT';
import user from '../../../utils/user';
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        preffixUrl: '',
        winWidth: 0,
        winHeight: 0,
        currentTab: 0,
        resultData: {},
        resultItems: [],
        incompleteList: [],
        completeList: [],
        userId: '',
        prjId: '',

  exitsList:0,//已签约列表长度
  nonexistentList:0,//未签约列表长度


  scrollTop: 0,//返回顶部
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      prjId: options.prjId,
      preffixUrl: app.globalData.CDNURL,
      userId: wx.getStorageSync('openid'),
    });
    wx.getSystemInfo( {
        success: function( res ) {
            that.setData( {
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
    wx.showLoading({
      title: '请稍候',
      icon: 'none',
      mask:true
    })
    user.getCustomerInfo().then((r) => {
      //获取真实数据
      this.selectItem(r.ID_CARD);
    });
  },

    //获取真实数据
    selectItem: function(certCode) {
        let options = {
            url: 'carloan/searchBusiRelAuthor.do',
            data: JSON.stringify({
                //32032319770318182X
                //320321198909137025
                certCode,
                startNo: "1",
                queryNum: "100",
            }),
        };
        requestYT(options).then((res) => {
            if (res.STATUS == '1') {
                let result = JSON.parse(res.carLoancontactPerson);
                let resultItem = result.contactPersonList;
                if (resultItem.length) {
                    resultItem = resultItem.sort((el1, el2) =>
                        Date.parse(el2.applyDate) - Date.parse(el1.applyDate)
                    );
                    let incompleteList = resultItem.filter(k =>{
                        if(k.prdName === '个人一手汽车消费贷款' || k.prdName === '个人二手汽车消费贷款'){
                            return  k.isAuthorisee == 0
                        }else{
                            return  k.isAuthorisee == 0 || k.isSignCommit == 0
                        }
                    });
                    let arr1 = JSON.parse(JSON.stringify(resultItem)).filter(k => k.isAuthorisee == 1);
                    let arr2 = JSON.parse(JSON.stringify(resultItem)).filter(k => k.isSignCommit == 1);
                    arr1.forEach(e => {
                        e.statusName = '已授权'
                    })
                    arr2.forEach(e => {
                        e.statusName = '已签署'
                    })
                    let completeList = [...arr1, ...arr2];
                    console.log('未授权', incompleteList)
                    console.log('已授权', completeList)
                    this.setData({
                        completeList,
                        incompleteList,
                    });
                }
            } else {
                //无数据
            }
            wx.hideLoading();
        }).catch(err => {
            console.log(err)
            this.alertError('授权数据异常');
            wx.hideLoading();
        });;

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
        let item = e.currentTarget.dataset.item;
        let name = e.currentTarget.dataset.name;
        if (name) {
            let flag = name === '已授权' ? '1' : '2';
            wx.navigateTo({
                url: `/sub3/pages/authorization/detail?item=${JSON.stringify(item)}&flag=${flag}`,
            })
        } else {
            wx.navigateTo({
                url: '/sub3/pages/authorization/detail?item=' + JSON.stringify(item),
            })
        }
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
  onUnload: function () {},

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