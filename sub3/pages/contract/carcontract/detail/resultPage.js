// pages/carLoans/order/InformationPage/resultPage.js
import requestYT from '../../../../../api/requestYT';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    preffixUrl: app.globalData.CDNURL,
    status:'',
    contNo:'',
    type:'',
    errorMsg:'',
    backPageSize:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      preffixUrl: app.globalData.CDNURL,
      status: options.status,
      contNo: options.contNo,
      type: options.type, //合同类型
      errorMsg: options.status == "1"? '': options.errorMsg,
      backPageSize: getCurrentPages().length  - (wx.getStorageSync('carPageIndex')+1)
    });
  },
  toContsPage(){
    if(this.data.status == '0'){
      wx.navigateBack({
        delta: this.data.backPageSize,
      });
    }else{
      this.readContract();
    }
  },
  //阅读合同
  readContract(){
    var that = this;
    wx.showLoading({
      title: '请稍候',
      mask: 'true'
    })
    var type = '';
    if(this.data.type == 'b02'){//主合同
      type = 'b02';
    }else{//担保合同
      type = 'b04';
    }
    let options = {
      url: 'carloan/viewSignContact.do',
      data: {
        type: type.toLocaleUpperCase(),
        serialNo: this.data.contNo,//合同号
      }
    };
    requestYT(options).then((res) => {
      if (res.STATUS === '1') {
        that.setData({
          imgData: res.pdfPath.replace(/[\r\n]/g, ""),
        });
        var fs = wx.getFileSystemManager();
        fs.writeFile({
                  filePath: wx.env.USER_DATA_PATH + "/" + '查看合同.pdf',
                  data: wx.base64ToArrayBuffer(res.pdfPath.replace(/[\r\n]/g, "")),
                  success:res =>{
                    wx.openDocument({
                      filePath: wx.env.USER_DATA_PATH + "/" + '查看合同.pdf',
                      success: function (res) {
                        wx.hideLoading();
                      }, fail(err) {
                       wx.hideLoading({
                         title:'合同获取异常',
                         success: (res) => {},
                       })
                      }
                    })
                  }
                })
      } else {
        wx.hideLoading()
        wx.showToast({
          title: res.errorMsg,
          icon: 'none',
        });
      }
    }).catch(res=>{
      wx.hideLoading();
      wx.showToast({
        title: '合同查询失败',
        icon: 'none',
      });
    });

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