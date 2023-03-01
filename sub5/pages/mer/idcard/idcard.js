const App = getApp();
import { Wx } from '../../../../utils/Wx';
import { Mer } from '../services/Mer';
import dayjs from 'dayjs'
import Toast from '@vant/weapp/toast/toast';
import * as mock from '../mock/mock';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cdnMer: App.globalData.CDNURL + '/static/wechat/img/mer/',

    front: '',
    back: '',

    appl_name: '',
    appl_idcard: '',
    appl_idcard_batch_id: '',
    corp_name: '',
    corp_code: '',
    
    reurl: '',

  },

  async chooseImage(e) {
    let {type} = e.currentTarget.dataset;
    let res_choose = await Wx.chooseImage({
      count: 1,
      sizeType: [ 'original'],
      sourceType: ['album', 'camera'],
    })
    let tmpPath = res_choose.tempFilePaths[0];
    let res_compress = await Wx.compressImage({
      src: tmpPath,
      compressedWidth: 600,
    });
    this.setData({[type]:res_compress.tempFilePath});
  },

  async submit() {
    let {front,back} = this.data;
    if (!front || !back) {
      Toast.fail('请先上传证件照片');
      return;
    }
    Toast.loading({
      message: '正在识别',
      forbidClick: true,
      duration: 0,
    });

    try {
      let front_data = await Mer.uploadCard(front,{option:'1'}).catch(err=>{
        return Promise.reject('上传证件正面过大，请重新选择');
      })
      let back_data = await Mer.uploadCard(back,{option:'2',type:1}).catch(err=>{
        return Promise.reject('上传证件反面过大，请重新选择');
      })

      let idcard = await Mer.ocrRecognition(front_data,back_data);
      idcard.RE_VALID_DATE = idcard.RE_VALID_DATE.replace(/长期/g,'9999.12.31');

      let front_path = await Mer.upYx(front_data);
      let back_path = await Mer.upYx(back_data);
      
      let batch_id = await Mer.addIdCardtoYxpt(front_path,back_path,idcard.RE_CUST_ID);
      this.setData({appl_idcard_batch_id:batch_id});

      let res_upBatch = await Mer.updateCusInfoBatchid(batch_id, idcard.RE_CUST_ID);

      // let res_compare = await Mer.compareIdName(idcard.RE_CUST_NAME,idcard.RE_CUST_ID);

      let res_face = await Wx.startFacialRecognitionVerify(idcard.RE_CUST_NAME,idcard.RE_CUST_ID);

      let emit_data = {
        name: idcard.RE_CUST_NAME,
        addr: idcard.RE_ADDRESS,
        idcard: idcard.RE_CUST_ID,
        batch_id: batch_id,
        face: res_face,
        gender: idcard.RE_GENDER,
        issued: idcard.RE_ISSUED_BY,
        race: idcard.RE_RACE,
        birthday: idcard.RE_BIRTHDAY.replace(/\./g,'-'),
        valid_dates: idcard.RE_VALID_DATE.split('-').map(r=>{return r.replace(/\./g,'-')}),
      }
      
      if (this.data.reurl) {
        wx.redirectTo({
          url: `${this.data.reurl}?idcard=${JSON.stringify(emit_data)}`,
        })
      } else {
        const eventChannel = this.getOpenerEventChannel();
        eventChannel.emit('idcardEvent', emit_data);
        wx.navigateBack({
          success: (res) => {
            Toast.clear();
            Toast.success('成功');
          }
        });
      }
      
    } catch (err) {
      console.error(err);
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