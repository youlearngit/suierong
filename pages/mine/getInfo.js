import api from '../../utils/api';
import user from '../../utils/user';
import requestYT from '../../api/requestYT';
import { gwRequest } from '../../utils/encrypt/encrypt';
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cndUrl: app.globalData.testUrl,
    avatar: `${app.globalData.CDNURL}/static/wechat/img/no_avator.png`,
    nickName: '',
    beforePage: '',
    hasAvatar: false,
  },
  onChooseAvatar(e){
    console.log(e,'e')
    let avatarUrl = e.detail.avatarUrl
    if(avatarUrl){
      this.setData({ 
        avatar : avatarUrl,
        hasAvatar : true
      })
    }
  },
  getNickname(nickName){
    this.setData({ nickName : nickName.detail.value })
    console.log(this.data.nickName.trim())
  },
  async addUser(e){
    console.log(e,'e')
    if(this.data.avatar == `${app.globalData.CDNURL}/static/wechat/img/no_avator.png` || e.detail.value.nickName ==''){
      wx.showToast({
        title: '头像昵称不能为空!',
        icon: 'none'
      });
      return;
    }
    wx.showLoading({
      title: '登录中',
      mask: true
  });
    var that = this;
    var userInfo = {
      avatarUrl: this.data.avatar,
      nickName: e.detail.value.nickName,
      country: '',
      province: '',
      city: '',
      gender: 0,
      language: "zh_CN"
    }

    try {
    if (wx.getStorageSync('openid') != null) {
          wx.getFileSystemManager().readFile({
            filePath: userInfo.avatarUrl,
            encoding: 'base64',
            success: (file) => {
              console.log(file,'file')
              that.getBase64(file.data).then((res)=>{
                console.log(res,'base64')
                var str=''
                if(res.imgFilePathRel.indexOf('static/')!=-1){
                    str=res.imgFilePathRel.substr(res.imgFilePathRel.indexOf('/static/'));
                            userInfo.avatarUrl = that.data.cndUrl+str

                            console.log(userInfo)
                            wx.setStorageSync('userInfo', JSON.parse(JSON.stringify(userInfo)))
                            app.globalData.userInfo = JSON.parse(JSON.stringify(userInfo));
                            user.addWXUserInfo(userInfo).then(() => {
                              wx.hideLoading();
                                wx.showToast({
                                  title: '登录成功',
                                  icon: 'success',
                                  mask: true,
                                  duration: 2000,
                                  success: ()=>{
                                    console.log(that.data.beforePage,'登录成功')
                                    wx.navigateBack({
                                      delta: 0,
                                      success: ()=>{
                                        // that.data.beforePage.onLoad()
                                      }
                                    });
                                  }
                                });
                            }).catch((error) => {
                              wx.hideLoading({
                                success: (res) => {},
                              });
                                console.log('err', error);
                                wx.showToast({
                                  title: error,
                                  icon: 'none'
                                });
                            });
                            return;
         
                }
              }).catch(err=>{
                wx.hideLoading({
                  success: (res) => {},
                });
                wx.showToast({
                  title: err,
                  icon: 'none'
                });
              });
            },
            fail: (res)=>{
              console.log(res,'err')
            }
          });
    }
    } catch (error) {
        console.log(error,'error')
    }
  },

  // 获取base64路径
  async getBase64(imgStr) {
    let options = {
      url: 'recruit/baseLogin.do',
      data: JSON.stringify({
        openId: wx.getStorageSync('openid'),
        imgStr,
        fileName:'loginImg',
        ifFtp: '1'
      }),
    };
    const res = await requestYT(options);
    console.log(options.url,res)
    if (res.STATUS === '1') {
      return res;
    } else {
      return Promise.reject(res.MSG);
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const pages = getCurrentPages();
    if(pages.length >= 2){
      let prevpage = pages[pages.length - 2]
      console.log(prevpage.route,'页面栈');
      this.setData({ beforePage : prevpage.route })
    }
    let beforePage = getCurrentPages().shift() 
    console.log(beforePage,'beforePage')
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})