const App = getApp();
import { Wx } from '../../../../utils/Wx';
import { Mer } from '../services/Mer';
import user from '../../../../utils/user';
import dayjs from 'dayjs'
import Toast from '@vant/weapp/toast/toast';
import * as mock from '../mock/mock';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cdnMer: App.globalData.CDNURL + '/static/wechat/img/mer/',
    
    license: '',

    reurl: '',

  },

  async chooseImage(e) {
    let res_choose = await Wx.chooseImage({
      count: 1,
      sizeType: [ 'compressed'],
      sourceType: ['album', 'camera'],
    })
    if (!res_choose.tempFilePaths) {
      return;
    }
    let license_tmp = res_choose.tempFilePaths[0];
    this.setData({license:license_tmp});
  },

  async submit() {
    let {license} = this.data;
    if (!license) {
      Toast.fail('请先上传营业执照照片');
      return;
    }
    Toast.loading({
      message: '正在识别',
      forbidClick: true,
      duration: 0,
    });
    try {
      let user_info = await user.getCustomerInfo();

      let license_data = await Mer.uploadCard(license,{option:'2',type:1}).catch().catch(err=>{
        return Promise.reject('上传营业执照图片过大，请重新选择');
      })

      let license_path = await Mer.upYx(license_data);

      let batch_id = await Mer.addBizLicenseOcr(license_path,user_info.ID_CARD||user_info.INT_ID);
      
      let license_info = await Mer.ocrBusinessLicense(batch_id);

      let company_info = await Mer.getBusInfo(license_info.RE_COMPANY_NAME);

      if (company_info.eNTNAME != license_info.RE_COMPANY_NAME)  {
        return Promise.reject('获取营业执照信息异常，请重新再试');
      }

      let emit_data = {
        name: license_info.RE_COMPANY_NAME,
        credit: license_info.RE_REGISTER_ID,
        code: company_info.oRGCODES,
        legal_name: license_info.RE_LEGAL_REPRESENTATIVE,
        date: license_info.RE_FOUNDATION_DATE.replace(/年|月/g,'-').replace(/日/g,' ').replace(/(^\s*)|(\s*$)/g, ''),
        region: '',
        addr: license_info.RE_ADDRESS,
        batch_id: batch_id,
        type: company_info.eNTTYPE,
      }

      if (this.data.reurl) {
        wx.redirectTo({
          url: `${this.data.reurl}?license=${JSON.stringify(emit_data)}`,
        })
      } else {
        const eventChannel = this.getOpenerEventChannel()
        eventChannel.emit('licenseEvent', emit_data);
        wx.navigateBack({
          success: (res) => {
            Toast.clear();
            Toast.success('成功');
          }
        });
      }

    } catch (err) {
      console.error(err)
      Toast.fail(err)
      return;
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (options.reurl) {
      this.setData({reurl:options.reurl});
    }
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