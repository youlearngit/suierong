
const Wx = {

  chooseImage: (params) => {
    return new Promise((resolve, reject) => {
      wx.chooseImage({
        ...params,
        success: (res) => {
          resolve(res)
        },
        fail: (err) => {
          resolve(false)
        }
      })
    })
  },

  getImageInfo: (src) => {
    return new Promise((resolve, reject) => {
      wx.getImageInfo({
        src: src,
        success: (res) => {
          resolve(res)
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  },

  compressImage: (params) => {
    return new Promise((resolve, reject) => {
      wx.compressImage({
        ...params,
        success: (res) => {
          resolve(res)
        },
        fail: (err) => {
          resolve(false)
        }
      })
    })
  },

  uploadFile: (params) => {
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        ...params,
        success: (res) => {
          // {"Content-Type": "multipart/form-data",accept": "application/json"}
          // res.data = JSON.parse(res.data)
          resolve(res)
        },
        timeout: (err) => {
          reject(err)
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  },

  readFile: (filePath, encoding) => {
    return new Promise((resolve, reject) => {
      wx.getFileSystemManager().readFile({
        filePath: filePath,
        encoding: encoding,
        success: (res) => {
          resolve(res.data)
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  },

  startFacialRecognitionVerify: (name,idCardNumber) => {
    return new Promise((resolve, reject) => {
      wx.startFacialRecognitionVerify({
        name: name,
        idCardNumber: idCardNumber,
        checkAliveType: 2,
        success: (res) => {
          const {errCode, verifyResult, errMsg} = res
          if (errCode == 0) {
            resolve(verifyResult);
          } else {
            reject('人脸识别异常') // errMsg
          }
        },
        fail: (err) => {
          reject('人脸识别异常') // err.errMsg
        }
      })
    })
  },

  downloadFile: (url) => {
    return new Promise((resolve, reject) => {
      wx.downloadFile({
        url: url,
        success: (res) => {
          if (res.statusCode === 200) {
            resolve(res);
          } else {
            reject(res);
          }
        },
        fail: (err) => {
          reject(err);
        }
      })
    })
  },

  imageOnload: (image) => {
    return new Promise((resolve, reject) => {
      image.onload = (res) => {
        resolve(res);
      }
    });
  },

  canvasToTempFilePath: (canvas) => {
    return new Promise((resolve, reject) => {
      wx.canvasToTempFilePath({
        canvas: canvas,
        success: (res) => {
          resolve(res);
        },
        fail: (err) => {
          reject(err);
        }
      })
    });
  },

}

export {Wx}
