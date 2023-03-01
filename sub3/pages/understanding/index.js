// pages/carLoans/understanding/index.js
import requestYT from "../../../api/requestYT";
const app = getApp(); 
Page({

    /**
     * 页面的初始数据
     */
    data: {
        preffixUrl: "",
        bgurl: '',
        userId: "",
        winWidth: 0,
        winHeight: 0,
        currentTab: 0,
        selected: [true, false, false, false, false, false, false, false], // // 这里表示列表项是否展开，默认初始时此数组的元素全为fasle，表示都没展开
        active: 0, // 当前展开的项的index值
        listDatas: [{
                list_name: '对借款人有什么要求？',
                list_content: '（1）持有二代身份证，年龄加贷款期限不超过60岁\n（2）具有稳定的合法收入来源\n（3）个人信用良好\n（4）所购车辆需办理抵押\n（5）本行规定的其他条件'
            },

      {
        list_name: '贷款金额和期限如何确定？',
        list_content: '&nbsp;&nbsp;&nbsp;&nbsp;您购买二手车申请本行贷款的，贷款金额最高不超过购车总价的70%，贷款期限最长3年，具体金额和期限以本行最终审批意见为准。',
      },

      {
        list_name: '提交贷款申请为什么没通过？',
        list_content: '&nbsp;&nbsp;&nbsp;&nbsp;您提交贷款申请未通过的原因包括但不限于不符合本行准入条件、资信条件、职业条件等。',
      },

      {
        list_name: '业务办理过程中如何知晓我的贷款办理进度？',
        list_content: '&nbsp;&nbsp;&nbsp;&nbsp;您可点击江苏银行随e融小程序个人汽车消费贷款首页“订单详情”，随时查看您本笔贷款的办理进度；也可联系您的专属客户经理，随时了解本笔贷款的办理进度。',
      },

            {
                list_name: '贷款发放后如何查看我的还款计划？',
                list_content: '&nbsp;&nbsp;&nbsp;&nbsp;您可登陆江苏银行手机银行APP，通过“借钱-我的贷款-借款记录-未结清-还款计划”查看还款计划。',
            },
            {
                list_name: '贷款发放后如何查看我的还款历史？',
                list_content: '&nbsp;&nbsp;&nbsp;&nbsp;您可登陆江苏银行手机银行APP，通过“借钱-我的贷款-借款记录-未结清-还款历史”查看还款历史。',
            },
            {
                list_name: '贷款发放后如何提前还款？',
                list_content: '&nbsp;&nbsp;&nbsp;&nbsp;您可登录江苏银行手机银行，通过“借钱-我的贷款-借款记录-未结清-提前还款”申请提前还款，如系统提示您不符合线上提前还款条件，您可联系客户经理线下办理。',
            },
            {
                list_name: '贷款结清后如何申请结清证明？',
                list_content: '&nbsp;&nbsp;&nbsp;&nbsp;您可登陆江苏银行手机银行APP，通过“借钱-我的贷款-借款记录-已结清-结清记录发送”申请将结清证明发送至指定邮箱。',
            }
        ],
        listDataset: [{
                list_name: '对借款人有什么要求？',
                list_content: '（1）具有完全民事行为能力的自然人，有合法有效的身份证明；\n（2）有稳定的经济收入，信誉良好，有偿还贷款本息的能力；\n（3）有合法有效的购房合同以及本行要求的其他证明文件；\n（4）所购房屋建设和销售有合法的证明文件；\n（5）有符合本行规定的自筹资金或首付款；\n（6）有本行认可的资产进行抵（质）押或提供我行认可的其他担保方式进行担保；\n（7）本行规定的其他条件。'
            },

            {
                list_name: '贷款金额和期限如何确定？',
                list_content: '&nbsp;&nbsp;&nbsp;&nbsp;个人住房贷款贷款金额最高不超过房屋总价款的80%，具体金额和期限以本行最终审批意见为准。您可登陆江苏银行手机银行APP，通过“借钱-安家金融-政策查询”查看各地区房产政策。',
            },

            {
                list_name: '提交贷款申请为什么没通过？',
                list_content: '&nbsp;&nbsp;&nbsp;&nbsp;您提交贷款申请未通过的原因包括但不限于不符合本行准入条件、资信条件、职业条件等。',
            },

            {
                list_name: '业务办理过程中如何知晓我的贷款办理进度？',
                list_content: '&nbsp;&nbsp;&nbsp;&nbsp;您可点击江苏银行随e融小程序e按揭首页“订单详情”，随时查看您本笔贷款的办理进度；也可联系您的专属客户经理，随时了解本笔贷款的办理进度。',
            },

            {
                list_name: '贷款发放后如何查看我的还款计划？',
                list_content: '&nbsp;&nbsp;&nbsp;&nbsp;您可登陆江苏银行手机银行APP，通过“借钱-我的贷款-借款记录-未结清-还款计划”查看还款计划。',
            },
            {
                list_name: '贷款发放后如何查看我的还款历史？',
                list_content: '&nbsp;&nbsp;&nbsp;&nbsp;您可登陆江苏银行手机银行APP，通过“借钱-我的贷款-借款记录-未结清-还款历史”查看还款历史。',
            },
            {
                list_name: '贷款发放后如何提前还款？',
                list_content: '&nbsp;&nbsp;&nbsp;&nbsp;您可登陆江苏银行手机银行APP，通过“借钱-我的贷款-借款记录-未结清-预约还款”申请提前还款。我行受理您的预约还款申请后，会在约定还款日扣收提前还款本息。扣款成功后，您可通过手机银行还款历史查看还款结果。',
            },
            {
                list_name: '贷款结清后如何申请结清证明？',
                list_content: '&nbsp;&nbsp;&nbsp;&nbsp;您可登陆江苏银行手机银行APP，通过“借钱-我的贷款-借款记录-已结清-结清记录发送”申请将结清证明发送至指定邮箱。',
            }
        ],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        that.setData({
            preffixUrl: app.globalData.CDNURL,
            bgurl: options.type ? `${app.globalData.CDNURL}/static/wechat/img/carloans/know_card_background.png` : `${app.globalData.CDNURL}/static/wechat/img/carloans/car-home-1239.png`,
            userId: wx.getStorageSync('openid'),
            type: options.type ? true : false,
        });
        wx.getSystemInfo({
            success: function(res) {
                that.setData({
                    winWidth: res.windowWidth,
                    winHeight: res.windowHeight
                });
            }
        });
        wx.setNavigationBarTitle({
            title: options.type ? '汽车贷款介绍' : '住房贷款介绍'
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
        var transno = e.currentTarget.dataset.gid
        wx.navigateTo({
            url: '/sub3/pages/contract/carcontract/detail/' + (this.data.currentTab == 0 ? 'detail-waiting' : 'detail-existing') + "?transno=" + transno,
        })
    },

  onListClick(event) {
    let index = event.currentTarget.dataset.index;
    let active = this.data.active;

    this.setData({
      [`selected[${index}]`]: !this.data.selected[`${index}`],
      active: index,
    });

    // 如果点击的不是当前展开的项，则关闭当前展开的项
    // 这里就实现了点击一项，隐藏另一项
    if (active !== null && active !== index) {
      this.setData({
        [`selected[${active}]`]: false,
      });
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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