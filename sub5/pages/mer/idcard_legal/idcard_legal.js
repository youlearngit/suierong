const App = getApp();
const computedBehavior = require('miniprogram-computed').behavior;
import { Wx } from '../../../../utils/Wx';
import { Mer } from '../services/Mer';
import dayjs from 'dayjs';
import Dialog from '@vant/weapp/dialog/dialog';
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
    business_name: '',
    u_name: '',
    u_idcard: '',
    u_idcard_batch_id: '',
    u_idcard_edate: '',
    u_face: '',

    eid: '',
    legal_name: '',
    corp_name: '',
    corp_credit: '',
    pdfs_batch_id: [],
    appl_idcard: '',

    agreement_show: false,
    agreement_check: false,
    agreements: [
      {type:'1',read:false,name:'《授权书》'},
      {type:'2',read:false,name:'《江苏银行综合信息查询使用授权书》'}
    ],
    
  },

  behaviors: [computedBehavior],
  watch: {
    'front,back': async function (front,back) {
      if (!front || !back) {
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

        let res_upBatch = await Mer.updateCusInfoBatchid(batch_id, idcard.RE_CUST_ID);

        // let res_compare = await Mer.compareIdName(idcard.RE_CUST_NAME,idcard.RE_CUST_ID);

        let idcard_dates = idcard.RE_VALID_DATE.split('-').map(r=>{return r.replace(/\./g,'-')});
        
        this.setData({
          u_name: this.data.u_name || idcard.RE_CUST_NAME,
          u_idcard: this.data.u_idcard || idcard.RE_CUST_ID,
          u_idcard_batch_id: batch_id,
          u_idcard_edate: idcard_dates[1],
        });

        let res_face = await Wx.startFacialRecognitionVerify(idcard.RE_CUST_NAME,idcard.RE_CUST_ID);

        this.setData({
          u_face: res_face,
        })
        
        Toast.clear();
      } catch (err) {
        console.error(err);
        Toast.clear();
        Toast.fail(err)
        return;
      }
    },
  },

  async formSubmit() {
    Toast.loading({
      forbidClick: true,
      duration: 0,
    });
    try {
      let {eid,agreements,u_name,u_idcard,u_idcard_batch_id,u_idcard_edate,u_face,pdfs_batch_id,corp_name,corp_credit} = this.data;
      let openid = Mer.openid();
      let share_openid = Mer.tjropenid();

      if (!u_idcard_batch_id) {
        throw '请您上传身份证';
      }

      if (!u_face) {
        throw '请您进行人脸识别';
      }

      let res_compare = await Mer.compareIdName(u_name,u_idcard).catch(err=>{
        throw '身份信息验证失败，请输入正确的身份信息';
      })

      if (agreements.find(r=>{return !r.read})) {
        throw '请阅读协议';
      }

      let save = {
        eId: eid,
        openId: openid,
        fName: u_name,
        fCard: u_idcard,
        enterpriseName: corp_name,
        creditCode: corp_credit,
        imageABatchId: u_idcard_batch_id,
        imageBBatchId: u_idcard_batch_id,
        frCardEndDate: dayjs(u_idcard_edate).format('YYYYMMDD'),
        imageFaceBatchId: u_face,
        imagePdfBatchId: pdfs_batch_id.join(),
      }
      let res_save = await Mer.myrAddOrUpdate(save);

      let res_wd = await Mer.submitTowd(openid,share_openid,eid);
      if (res_wd.resultCode == '0000' || res_wd.resultCode == '2000') {
        Toast.clear();
        wx.navigateTo({
          url: '../finish/finish?type=1',
        })
      } else {
        throw res_wd.resultMsg;
      }
    } catch(err) {
      console.error(err);
      Toast.clear();
      Toast.fail(err);
    }
  },

  async goAgreement(e) {
    Toast.loading({
      forbidClick: true,
      duration: 0,
    });

    try{
      let {idx} = e.currentTarget.dataset;
      let {agreements,pdfs_batch_id} = this.data;
      let openid = Mer.openid();
      let type = agreements[idx].type;

      let {corp_name,corp_credit,u_name,u_idcard,appl_idcard} = this.data;
      let legal_name = u_name;
      let legal_idcard = u_idcard;

      let res_sign = await Mer.myrSign(openid,type,corp_name,corp_credit,legal_name,legal_idcard,appl_idcard);
      pdfs_batch_id[idx] = res_sign.BatchID;
      this.setData({pdfs_batch_id});
      
      Toast.clear();
      wx.navigateTo({
        url: '../agreement/agreement',
        events: {
          agreementReadEvent: (data) => {
            let {agreements} = this.data;
            agreements = agreements.map(r=>{
              if (r.type==data.type) {
                r.read = data.read;
              }
              return r;
            })
            this.setData({agreements});
          },
        },
        success: (res) => {
          res.eventChannel.emit('setPdfData', { 
            custName: corp_name,
            idCard: legal_idcard,
            sqrName: legal_name,
            type: type,
            creditCode: corp_credit,
          })
        }
      })
    } catch(err) {
      console.error(err);
      Toast.clear();
      Toast.fail(err);
    }

  },

  onChangeRadio(event) {
    this.setData({
      [event.currentTarget.dataset.event]: event.detail
    });
  },

  showAgreement(e) {
    this.setData({agreement_show:!this.data.agreement_show});
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

  async doFace() {
    try {
      let {u_name,u_idcard} = this.data;
      let res_face = await Wx.startFacialRecognitionVerify(u_name,u_idcard);
      this.setData({u_face:res_face});
    } catch(err) {
      console.error(err);
      Toast.fail(err);
    }
  },

  async checkAgreements() {
    let {front,back,u_idcard_batch_id,u_face,u_name,u_idcard} = this.data;
    if (!front || !back || !u_idcard_batch_id) {
      Toast.fail('请先上传证件照片');
      return;
    }
    if (!u_name || !u_idcard) {
      Toast.fail('请先录入姓名及身份证号');
      return;
    }
    if (!u_face) {
      Dialog.confirm({
        title: '提示',
        message: '请您进行人脸识别',
        confirmButtonText: '识别',
        
      }).then(() => {
        this.doFace();
      });
      return;
    }
    this.setData({
      agreement_show: true,
    });
  },

  async initData(options) {
    if (!options.eid) {
      return;
    }
    Toast.loading({
      forbidClick: true,
      duration: 0,
    });
    try {
      let eid = options.eid;
      let info = await Mer.selectMyrByEid(eid);
      this.setData({
        business_name: '出口贸e融',
        eid: info.E_ID,
        legal_name: info.FA_NAME,
        corp_name: info.ENTERPRISE_NAME,
        corp_credit: info.CREDIT_CODE,
        appl_idcard: info.APPLICANT_CARD,
      })
      Toast.clear();
    } catch(err) {
      Toast.clear();
      Toast.fail(err);
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.initData(options);
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