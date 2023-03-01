import requestYT from '../../../api/requestYT';
import { gwRequest } from '../../../utils/encrypt/encrypt.js';
const app = getApp();

Page({
  data: {
    preffixUrl: app.globalData.CDNURL,
    imgList: [],
    idCardFrontImage: '',
    idCardBackImage: '',
    canSubmit: false,
    isSelf: false,
    idCard: '',
  },

  async onLoad(options) {
    this.setData({
      isSelf: options.isSelf === 'true',
      idCard: options.idCard,
      imgList: JSON.parse(options.imgList) || [],
      idCardFrontImage: options.idCardFrontImage || '',
      idCardBackImage: options.idCardBackImage || '',
    });
    this.canSubmit();
  },

  async getImageBatchID() {
    try {
      wx.showLoading({
        title: '正在上传',
        mask: true,
      });

      let idCardBatchId = '',
        talentBatchId = '';
      let { imgList, idCardFrontImage, idCardBackImage } = this.data;
      let uploadTalentImage = this.uploadImage(imgList);
      talentBatchId = await uploadTalentImage;
      if (!this.data.isSelf) {
        let uploadIdCard = this.uploadImage([idCardFrontImage, idCardBackImage]);
        idCardBatchId = await uploadIdCard;
      }
      wx.hideLoading();
      wx.showModal({
        title: '',
        content: '上传成功',
        showCancel: false,
        confirmText: '确定',
        success: (result) => {
          if (result.confirm) {
            const pages = getCurrentPages();
            const prevPage = pages[pages.length - 2];
            prevPage.setData({
              idCardBatchId,
              talentBatchId,
              imgList,
              idCardFrontImage,
              idCardBackImage,
            });

            wx.navigateBack({
              delta: 1,
            });
          }
        },
      });
    } catch (error) {
      wx.hideLoading();
      wx.showModal({
        title: '提示',
        content: error.message || error,
        showCancel: false,
        confirmText: '确定',
      });
    }
  },

  async uploadImage(imageList) {
    console.log('imageListfefore', imageList);
    imageList = await this.convertImg(imageList);
    console.log('imageListafter', imageList);
    imageList = imageList.map((e) => {
      return {
        imgpath: e,
      };
    });
    console.log(imageList);

    let options = {
      url: 'jsyh/toYxpt.do',
      data: JSON.stringify({
        imgpathlist: imageList,
        imgname: '11',
        EcmCatalogCode: 'SYS021_BIZ01_110',
        imggs: 'jpg',
        imgbq: '相关证书',
        batch: 'SYS021_8229_',
        EcmBusiType: 'SYS021_BIZ01',
        RE_CUST_ID: this.data.idCard,
      }),
    };
    const res = await requestYT(options);
    if (res.STATUS === '1' && res.code === '1') {
      return res.BatchID;
    } else {
      return Promise.reject(new Error(res.msg || '上传影像系统失败，请稍后重试'));
    }
  },

  // 先上传在test.do

  async convertImg(imgList) {
    let that = this;
    const promiseList = imgList.map(that.transfromIamge);
    // console.log(promiseList);
    // let imgUpLoadList = [];
    // imgList.forEach(async (img) => {
    //   let cc = that.upload(img);
    //   let jpg = await cc;
    //   //   let base64 = await that.upload(img);
    //   //   let jpg = await that.imageBase64toJPG(base64);
    //   imgUpLoadList.push({
    //     imgpath: jpg,
    //   });
    //   if (imgUpLoadList.length == imgList.length) {
    //     return imgUpLoadList;
    //   }
    // });

    // for (const img of imgList) {
    //   console.log(img);

    //   let cc = that.upload(img);

    //   let jpg = await cc;
    //   //   let base64 = await that.upload(img);
    //   //   let jpg = await that.imageBase64toJPG(base64);
    //   imgUpLoadList.push({
    //     imgpath: jpg,
    //   });
    // }
    // console.log('imgUpLoadList', imgUpLoadList);

    let imgUpLoadList = await Promise.all(promiseList);
    console.log(imgUpLoadList);
    return imgUpLoadList;
    //这个是有执行顺序的
    // try {
    //   for (let promise of promiseList) {
    //     let jpg = await promise;
    //     console.log('jpg', jpg);
    //     imgUpLoadList.push({
    //       imgpath: jpg,
    //     });
    //   }
    //   for (let i=0;i<promiseList.length;i++ ) {
    //     let jpg = await promiseList[i];
    //     console.log('jpg', jpg);
    //     imgUpLoadList.push({
    //       imgpath: jpg,
    //     });
    //   }
    // } catch (error) {
    //   console.log(error);
    // }

    // promiseList.forEach(async (e) => {
    //   let cc = e;
    //   let jpg = await cc;
    //   console.log('jpg', jpg);
    //   imgUpLoadList.push({
    //     imgpath: jpg,
    //   });
    // });

    // return imgUpLoadList;

    // all has uploaded and finish task

    // 先小后大有问题 异常没捕捉到

    // 要等所有 await 结束  不管是await返回时异常还是成功
  },

  upload(filePath) {
    let that = this;
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: app.globalData.URL + 'uploadCard',
        filePath,
        name: 'file',
        formData: {
          option: '2',
          type: 1,
        },
        success(res) {
          console.log(res);
          if (res.statusCode === 413) {
            reject(new Error('上传图片过大，请重新选择'));
            return;
          }
          if (res.statusCode !== 200) {
            reject(new Error('图片上传失败，请稍后重试'));
            return;
          }

          resolve(res.data);

          //   that
          //     .imageBase64toJPG(res.data)
          //     .then((res) => {
          //       resolve(res);
          //     })
          //     .catch((error) => {
          //       reject(error);
          //     });
        },
      });
    });
  },

  async transfromIamge(img) {
    console.log(img);
    let base64 = await this.upload(img);
    let jpg = await this.imageBase64toJPG(base64);
    return jpg;
  },

  async imageBase64toJPG(imgStr) {
    let options = {
      url: 'jsyh/test.do',
      data: JSON.stringify({
        imgStr,
      }),
      ifEncrypt: false,
    };
    const res = await requestYT(options);
    console.log(options.url, res);
    if (res.STATUS === '1' && res.imgFilePath) {
      return res.imgFilePath;
    } else {
      return Promise.reject(new Error('图片转化失败，请稍后重试'));
    }
  },

  convertImg2(imgList) {
    const that = this;
    return new Promise((resolve, reject) => {
      let imgUpLoadList = [];
      imgList.forEach((item) => {
        wx.uploadFile({
          url: app.globalData.URL + 'uploadCard',
          filePath: item,
          name: 'file',
          formData: {
            option: '2',
            type: 1,
          },
          success: (res) => {
            if (res.statusCode != 200) {
              reject('上传图片过大，请重新选择');
              return;
            }
            wx.request({
              url: app.globalData.YTURL + 'jsyh/test.do',
              data: gwRequest({
                imgStr: res.data,
              }),
              method: 'POST',
              header: {
                'content-type': 'application/json',
              },
              success: function (res) {
                if (res.data.body != undefined && Object.getOwnPropertyNames(res.data.body) != 0) {
                  var jsonData = res.data.body;
                  imgUpLoadList.push({
                    imgpath: jsonData.imgFilePath,
                  });
                  if (imgUpLoadList.length == imgList.length) {
                    resolve(imgUpLoadList);
                  }
                } else {
                  reject();
                }
              },
            });
          },
        });
      });
    });
  },

  getImage(e) {
    const that = this;
    let type = e.currentTarget.dataset.type;
    wx.chooseImage({
      count: 10,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        that.addImage(type, res.tempFilePaths);
      },
    });
  },

  addImage(type, files) {
    if (type === 'talent') {
      let { imgList } = this.data;
      imgList.push.apply(imgList, files);
      this.setData({
        imgList,
      });
    }

    if (type === 'front') {
      this.setData({
        idCardFrontImage: files[0],
      });
    }

    if (type === 'back') {
      this.setData({
        idCardBackImage: files[0],
      });
    }

    this.canSubmit();
  },

  deleteImg(e) {
    let { imgList } = this.data;
    imgList.splice(e.currentTarget.dataset.index, 1);
    this.setData({
      imgList,
    });
    this.canSubmit();
  },

  previewImg(e) {
    let { index } = e.currentTarget.dataset;
    let { imgList } = this.data;
    wx.previewImage({
      current: imgList[index],
      urls: imgList,
    });
  },

  canSubmit() {
    let { isSelf, imgList, canSubmit } = this.data;
    if (isSelf) {
      canSubmit = imgList.length > 0;
    } else {
      let { idCardFrontImage, idCardBackImage } = this.data;
      canSubmit = imgList.length > 0 && idCardFrontImage && idCardBackImage;
    }
    this.setData({
      canSubmit,
    });
  },
});
