import MYURLS from '../../utils/urls';
var app = getApp();
Page({
  data: {
    banners: [],
    cardRights: [],
    hotAct: [],
    fastCardSkipUrl: MYURLS.Urls.fastCard,
    etcUrl: MYURLS.Urls.etc,
    preffixUrl: '',
    cdnUrl:app.globalData.CDNURL
  },

  onLoad() {
    this.setData({
      preffixUrl: "https://wxapp.jsbchina.cn:7080/creditAuth/",
    });
    this.loadList();
  },

  //跳转到h5
  skipWeb(e) {
    let skipurl = e.currentTarget.dataset.skipurl;
    wx.navigateTo({
      url: '../showWeb/showWeb?skipUrl=' + encodeURIComponent(skipurl),
    });
  },

  //跳转到图片
  skipPic(e) {
    let skipurl = e.currentTarget.dataset.skipurl;
    wx.navigateTo({
      url: '../showImg/showImg?skipUrl=' + encodeURIComponent(skipurl),
    });
  },

  cc() {
    wx.showModal({
      showCancel: false,
      title: '提示',
      content: '敬请期待...',
      success: function(res) {},
    });
  },

  //页面数据加载
  loadList() {
    var that = this;
    this.getList('getBannerList', 'banners');
    this.getList('getHotActList', 'hotAct');
    this.getList('getRightList', 'cardRights');
  },

  //通用方法,获取数据并赋值
  getList(url, dataName) {
    var that = this;
    wx.request({
      url: 'https://wxapp.jsbchina.cn:7080/alipay/' + url,
      method: 'GET',
      dataType: 'json',
      success: resp => {
        //console.log(resp.data);
        that.setData({
          [dataName]: resp.data,
        });
      },
      fail: err => {
        //console.log('error', err);
      },
    });
  },
  onShareAppMessage: res => {
    if (res.from === 'button') {
      // //console.log("来自页面内转发按钮");
      // //console.log(res.target);
    } else {
      // //console.log("来自右上角转发菜单")
    }
    return {
      title: '信用卡申请',
      path: '/sub2/pages/reditCard/reditCard',
      imageUrl: '',
      success: res => {
        // //console.log("转发成功", res);
      },
      fail: res => {
        // //console.log("转发失败", res);
      },
    };
  },
});
