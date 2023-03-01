// sub2/pages/bindCardSms/index.js
const app = getApp();
var that;
var encr = require('../../utils/encrypt.js'); //国密3段式加密
var aeskey = encr.key //随机数
import api from "../../../utils/api";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    bind_tail: '',
    idCardS: '',
    openid: '',
    sessionid: '',
    enc_bankelem: '',
    cardType: '',
    cardNum: '',
    show: true,
    tip: '',
    trueName:'',
    bottomHeight: '24px;',
    checkResult:[], //已阅读、同意集
   },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;   
    wx.getSystemInfo({
      success(res) {
        const rpx = 152 / 750 * res.windowWidth;

        let height = that.data.list.length * rpx

        if ((res.windowHeight - height - 288) < 0) {
          that.setData({
            show: true
          })
        } else {
          that.setData({
            show: false
          })
        }

        if (res.system.includes("iOS")) {
          that.setData({
            tip: 'font-family: PingFangSC-Medium;'
          })
        } else {
          that.setData({
            tip: 'font-weight: 400;text-stroke: 0.02em;-webkit-text-stroke: 0.02em;'
          })
        }

        let modelmes = res.model;
        if (modelmes.search('iPhone X') != -1 || modelmes.search('iPhone 11') != -1 || modelmes.search('iPhone 12') != -1) {
          that.setData({
            bottomHeight: '58px;'
          })
        } else {
          that.setData({
            bottomHeight: '24px;'
          })
        }

      }
    })
    this.setData({
      preffixUrl: app.globalData.URL
    })
    if (options.sessionid) {
      that.setData({
        bind_tail: options.bind_tail,
        openid: options.openid,
        sessionid: options.sessionid,
        enc_bankelem: options.enc_bankelem
      })
      if (wx.getStorageSync("openid") == "") {
        api.getSessionInfo().then(() => {
          if (options.openid != wx.getStorageSync('openid')) {
            wx.showModal({
              title: '提示',
              content: '系统繁忙，请稍后再试',
              showCancel: false,
              success(res) {
                if (res.confirm) {}
              }
            })
            return;
          }
          that.getData()
        });
      } else {
        if (options.openid != wx.getStorageSync('openid')) {
          wx.showModal({
            title: '提示',
            content: '系统繁忙，请稍后再试',
            showCancel: false,
            success(res) {
              if (res.confirm) {}
            }
          })
          return;
        }
        that.getData()
      }
    } else {
      wx.redirectTo({
        url: './error'
      })
    }
  },
  onChange(event) {
    this.setData({
      checkResult: event.detail,
    });
  },
  open() {
    wx.downloadFile({
      url: app.globalData.CDNURL + "/static/wechat/img/zm/protocol_new.docx",
      filePath: wx.env.USER_DATA_PATH + '/ .docx', 
      success: function (res) {
        if(res.statusCode==200){
          const filePath = res.filePath || res.tempFilePath
          wx.openDocument({
            filePath: filePath,
            fileType:'doc',
            showMenu:true,
            success: function (res) {}
          })
          return;
        }
        wx.showToast({
          title: '系统繁忙，请稍后再试',
          icon:'none'
        })
      }
    })
  },
  getData() {
    wx.showLoading({
      title: '查询中', //提示的内容,
      mask: true //显示透明蒙层，防止触摸穿透,
    });
   

    let promise2 = new Promise(function (resolve, reject) {
      let dataJson = JSON.stringify({
        bind_tail: that.data.bind_tail,
        ID_TYPE: 'I',
        CURR_CD: '156',
        cert_no: that.data.enc_bankelem,
        FIRSTROW: '0',
        LASTROW: '4'
      })
      let custnameTwo = encr.jiami(dataJson, aeskey)
      wx.request({
        url: app.globalData.YTURL + 'jsyh/getDh007.do',
        data: encr.gwRequest(custnameTwo),
        method: 'POST',
        header: {
          'content-type': 'application/json',
        },
        success(res) {
          if (res.data.head.H_STATUS === "1") {
            let jsonData = encr.aesDecrypt(res.data.body, aeskey) //解密返回的报文
            that.setData({
              trueName:jsonData.TRUE_NAME
            })
            if(jsonData.old==undefined||jsonData.old==''){
              resolve([])
              return;
            }
            let data = JSON.parse(jsonData.old)

            if (data.ACCOUNTS != undefined) {
              data.ACCOUNTS.forEach((item, index) => {
                item.CARD_NOSub = item.CARD_NO.substring(item.CARD_NO.length - 4, item.CARD_NO.length)
              });
              resolve(data.ACCOUNTS)
              return;
            }
            resolve([])
          } else {
            resolve([])

            // reject({ msg: res.data.head.H_MSG });
          }
        }
      })
    });

    let promise3 = new Promise(function (resolve, reject) {
      let dataJson = JSON.stringify({
        bind_tail: that.data.bind_tail,
        ZHJNZL: '1',
        SYPINFLG: '0',
        QISHBS: '1',
        CXUNBS: '100',
        cert_no: that.data.enc_bankelem
      })
      let custnameTwo = encr.jiami(dataJson, aeskey)
      wx.request({
        url: app.globalData.YTURL + 'jsyh/query5883.do',
        data: encr.gwRequest(custnameTwo),
        method: 'POST',
        header: {
          'content-type': 'application/json',
        },
        success(res) {
          if (res.data.head.H_STATUS === "1") {
            let jsonData = encr.aesDecrypt(res.data.body, aeskey) //解密返回的报文
            that.setData({
                trueName:jsonData.TRUE_NAME
              })
            if (jsonData.entNamesList1 != undefined) {
              jsonData.entNamesList1.forEach((item, index) => {
                item.CARD_NOSub = item.CARD_NO.substring(item.CARD_NO.length - 4, item.CARD_NO.length)
              });
              resolve(jsonData.entNamesList1)
              return;
            }
            resolve([])
          } else {
            resolve([])

            // reject({ msg: res.data.head.H_MSG });
          }
        }
      })
    });

    Promise.all([promise2, promise3])
      .then((data) => {
        wx.hideLoading()

        let list = [];
        if (data[0].length != 0) {
          list = list.concat(data[0])
        }
        if (data[1].length != 0) {
          list = list.concat(data[1])
        }
       
        list.sort(function (a, b) {
          return b.khrq < a.khrq ? -1 : 1;
        })

        if (list.length == 0) {
          wx.redirectTo({
            url: './error'
          })
        }
        that.setData({
          list
        })
      })
      .catch(err => {
        wx.hideLoading()
      
      });
  },
  getwxSign() {
    wx.showLoading({
      title: '添加中', //提示的内容,
      mask: true //显示透明蒙层，防止触摸穿透,
    });
    return new Promise(function (resolve, reject) {

      let dataJson = JSON.stringify({
        sessionid: that.data.sessionid,
        package: that.data.cardType === '储蓄卡' ? 'JSB_DEBIT' : 'JSB_CREDIT'
      })
      let custnameTwo = encr.jiami(dataJson, aeskey)
      wx.request({
        url: app.globalData.YTURL + 'jsyh/getwxSign.do',
        data: encr.gwRequest(custnameTwo),
        method: 'POST',
        header: {
          'content-type': 'application/json',
        },
        success(res) {
          wx.hideLoading()
          if (res.data.head.H_STATUS === "1") {
            let data = encr.aesDecrypt(res.data.body, aeskey) //解密返回的报文
            wx.phoneBindCardVerifySms({
              timestamp: data.timestamp,
              noncestr: data.nonceStr,
              package: 'bank_type='+data.package,
              signtype: 'sha1',
              paysign: data.sign,
              sessionid: that.data.sessionid,
              appid: data.appid,
              complete(res) {
                if (res.errMsg == 'phoneBindCardVerifySms:ok') {
                  console.log('短信验证成功')
                }
              }
            })
            resolve()
          } else {
            reject()
            wx.hideLoading()
            wx.showToast({
              title: res.data.head.H_MSG,
              icon: 'none',
              duration: 5000
            })
          }
        }
      })
    })

  },
onShow(){
  wx.hideHomeButton()
},
  queryBankPhone() {

    return new Promise(function (resolve, reject) {
      let dataJson = JSON.stringify({
        RESOLVE_TYPE: '3',
        EXT_ARR_ID: that.data.cardNum,
        FIRST_NO: '1',
        RESULT_SIZE: '30'
      })
      let custnameTwo = encr.jiami(dataJson, aeskey)
      wx.request({
        url: app.globalData.YTURL + 'jsyh/queryBankPhone.do',
        data: encr.gwRequest(custnameTwo),
        method: 'POST',
        header: {
          'content-type': 'application/json',
        },
        success(res) {
          if (res.data.head.H_STATUS === "1") {
            let data = encr.aesDecrypt(res.data.body, aeskey) //解密返回的报文
            resolve(data.NEW_PHONE)

          } else {
            reject()
            wx.showToast({
              title: res.data.head.H_MSG,
              icon: 'none',
              duration: 5000
            })
          }
        }
      })

    })

  },
  query5810() {


    return new Promise(function (resolve, reject) {
      let dataJson = JSON.stringify({
        SYPINFLG: '0',
        KAHAOO: that.data.cardNum,
        CHAXFS: '1',
        PINFLG: '0',
        OPTION: '1',
        NATION: '1'
      })
      let custnameTwo = encr.jiami(dataJson, aeskey)
      wx.request({
        url: app.globalData.YTURL + 'jsyh/query5810.do',
        data: encr.gwRequest(custnameTwo),
        method: 'POST',
        header: {
          'content-type': 'application/json',
        },
        success(res) {
          if (res.data.head.H_STATUS === "1") {
            let data = encr.aesDecrypt(res.data.body, aeskey) //解密返回的报文
            resolve(data.SHOJHM)

          } else {
            reject()
            wx.showToast({
              title: res.data.head.H_MSG,
              icon: 'none',
              duration: 5000
            })
          }
        }
      })

    })

  },
  queryDH008() {


    return new Promise(function (resolve, reject) {
      let dataJson = JSON.stringify({
        CARD_NO: that.data.cardNum,
        OPT: '0'
      })
      let custnameTwo = encr.jiami(dataJson, aeskey)
      wx.request({
        url: app.globalData.YTURL + 'jsyh/queryDH008.do',
        data: encr.gwRequest(custnameTwo),
        method: 'POST',
        header: {
          'content-type': 'application/json',
        },
        success(res) {
          if (res.data.head.H_STATUS === "1") {
            let data = encr.aesDecrypt(res.data.body, aeskey) //解密返回的报文
            resolve(data.MOBILE_NO)

          } else {
            reject()
            wx.showToast({
              title: res.data.head.H_MSG,
              icon: 'none',
              duration: 5000
            })
          }
        }
      })

    })

  },
  bindEPCC0101(MobNo) {


    return new Promise(function (resolve, reject) {
      let dataJson = JSON.stringify({
        SgnAcctIssrId: 'C1086832000010',
        SgnAcctTp: that.data.cardType === '储蓄卡' ? '00' : '01', //00借记 、01 信用卡
        SgnAcctId: that.data.cardNum, //卡号
        SgnAcctNm: that.data.idName,
        IDTp: "01",
        IDNo: that.data.idCard,
        MobNo: MobNo,
        InstgId: "Z2004944000010",
        TrxCtgy: "0207",
        ClbckUrl: "bind_scene=NO_CARD_BIND&sessionid=" + that.data.sessionid

      })
      let custnameTwo = encr.jiami(dataJson, aeskey)
      wx.request({
        url: app.globalData.YTURL + 'jsyh/bindEPCC0101.do',
        data: encr.gwRequest(custnameTwo),
        method: 'POST',
        header: {
          'content-type': 'application/json',
        },
        success(res) {
          if (res.data.head.H_STATUS === "1") {
            let data = encr.aesDecrypt(res.data.body, aeskey) //解密返回的报文
            resolve()

          } else {
            reject()
            wx.showToast({
              title: res.data.head.H_MSG,
              icon: 'none',
              duration: 5000
            })
          }
        }
      })

    })

  },
  bindCard(e) {
    if(that.data.checkResult.indexOf('a') < 0){
      wx.showModal({
        title: '提示',
        content: "请先阅读相关协议",
        showCancel: false,
        confirmText: '确定',
      });
      return;
    }
    if(that.data.checkResult.length!=2){
      wx.showModal({
        title: '提示',
        content: "请您先阅读并勾选本人声明",
        showCancel: false,
        confirmText: '确定',
      });
      return;
    }
    if (that.data.openid != wx.getStorageSync('openid')) {
      wx.showModal({
        title: '提示',
        content: '系统繁忙，请稍后再试',
        showCancel: false,
        success(res) {
          if (res.confirm) {}
        }
      })
      return;
    }
    let  index = parseInt(e.currentTarget.dataset.id)

    //美团信用卡 、储蓄卡、信用卡
    that.setData({
      cardType: that.data.list[index].flag,
      cardNum: that.data.list[index].CARD_NO,
      idName: that.data.trueName,
    })
    if (that.data.list[index].flag != '储蓄卡') {
      that.setData({
        idCard: that.data.list[index].ID_NO
      })
    } else {
      that.setData({
        idCard: that.data.idCardS
      })
    }
    switch (that.data.list[index].flag) {
      case '美团信用卡':
        that.queryDH008().then(res => {
          that.bindEPCC0101(res).then(a => {
            that.getwxSign()
          })
        })
        break;
      case '储蓄卡':
        that.queryBankPhone().then(res => {
          that.bindEPCC0101(res).then(a => {
            that.getwxSign()
          })
        })
        break;
      case '信用卡':
        that.query5810().then(res => {
          that.bindEPCC0101(res).then(a => {
            that.getwxSign()
          })
        })
        break;
      default:
        break;
    }
  },
 

})