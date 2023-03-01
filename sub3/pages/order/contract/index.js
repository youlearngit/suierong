// pages/carLoans/order/contract/index.js
import requestYT from "../../../../api/requestYT";
import api from "../../../../utils/api";
const app = getApp(); 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    preffixUrl: "",
    userId: "",
    //倒计时
    dialogflag: true,
    backBtnName: 10,
    nbsp:'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;',
    contInfo:{},

    photo:'',
    batchId:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var params = JSON.parse(options.params)
    that.setData({
      contInfo: params,
      preffixUrl: app.globalData.CDNURL,
      userId: wx.getStorageSync('openid'),
    });
    this.readingCoundDown();
  },
  // 人脸识别
  async getBatchId(){
    var that = this;
    if(that.data.dialogflag == true){
      return ;
    }
    try {
      const res = await api.getImageAndBatchId(that.data.contInfo.cusName,that.data.contInfo.certCode);
      that.setData({
        photo:res.image,
        batchId:res.batchID
      })
      await that.uploadPhoto();
      }catch (error) {
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
  },
    //上传印象
    uploadPhoto(){
    wx.showLoading({
        title: '请稍候',
        mask: true,
      });
      var that = this;
      let options = {
        url: 'carloan/uploadPicToYxpy.do',
        data: JSON.stringify({
          certCode: that.data.contInfo.certCode,
          batchId: that.data.batchId,
        }),
      };
      requestYT(options).then((res)=>{
        if(res.msgCode == '0000'){
          that.nextPage();
        }else{
          wx.hideLoading();
          wx.showToast({
            title: '影像获取失败',
            icon: 'none',
            duration: 1000
          })
        }
      })
    },
    //签章调用
    nextPage(){
      wx.showLoading({
        title: '请稍候',
        mask: true,
      });
      var that = this;
      var type = 'b02';
      let options = {
        url: 'carloan/sign.do',
        data: {
          type: type.toLocaleUpperCase(),
          certCode:that.data.contInfo.certCode,
          applyName:that.data.contInfo.cusName,
          contNo: that.data.contInfo.contNo,//合同号
          base64:that.data.photo,
        }
      };
      requestYT(options).then((res) => {
        if (res.msgCode === '0000') {
          //签章保存成功,提交补录申请
          that.signContact();
        } else {
          wx.hideLoading()
          that.alertError('请重新提交合同签订，如多次未提交成功，联系您的客户经理');
        }
      }).catch(res=>{
        wx.hideLoading();
        that.alertError('请重新提交合同签订，如多次未提交成功，联系您的客户经理');
      });
    },
    //签订合同
    signContact(){
      var that = this;
      let options = {
        url: 'carloan/signContact.do',
        data: {
          signType: "1",
          contNo: that.data.contInfo.contNo,
          repayDay: that.data.contInfo.repayDay,
          repaymentAccount: that.data.contInfo.repayAccNo,
          guaranteeCertCode: that.data.contInfo.certCode,
          imageLotNumber: that.data.batchId,
        }
      };
      requestYT(options).then((res) => {
        if(res.msgCode === '0000'){
          that.toResultPage('1','');
        }else{
          that.toResultPage('0',res.msg);
        }
      }).catch((err)=>{
        that.toResultPage('0',"系统正在维护中，请稍后再试");
      });
    },
    //结果相应页面
    toResultPage(status,errorMsg){
      var str = '/sub3/pages/contract/carcontract/detail/resultPage?status='+status+'&type=b02'+'&contNo='+this.data.contInfo.contNo;
      if(status != '1'){
        str = str + '&errorMsg='+ errorMsg
      }
      wx.navigateTo({
        url: str,
      })
    },
    // 按钮倒计时10秒
    readingCoundDown() {
      let time = 10;
      this.setData({
        backBtnName: time,
      });
      let cutDown = setInterval(() => {
        time--;
        console.log(time);
        if (time < 1 ) {
          this.setData({
            dialogflag : false,
          });
          clearInterval(cutDown);
        }
        this.setData({
          backBtnName: time,
        });
      }, 1000);
  },

  //提示错误信息
  alertError(content){
    wx.showModal({
      title: '签订失败',
      content: content,
      showCancel: false,
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: (result) => {
        if (result.confirm) {
        }
      },
      fail: () => {},
      complete: () => {},
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