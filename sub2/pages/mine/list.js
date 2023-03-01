// pages/mine/list.js
const app = getApp();
var that;
var encr = require('../../utils/encrypt.js'); //国密3段式加密
var aeskey = encr.key //随机数
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    paidui: [],
    yuyue: [],
    dizhi: [],
    page:1,
    num:10,
    allList:[],
    maxList: [],
    more:true,
    hisList: [],
    history: [],
    sta: '',
    bus: '',
    ban: '',
    line_id: '',
    list: [], //所哦数据
    y: [],
    l: [],
    leixing: [],
    dz: [],
    shijian: [],
    zhuangtai: [],
    leixing1: [],
    dz1: [],
    shijian1: [],
    shijian2: [],
    zhuangtai1: [],
    yuyueid1: [],
    customer_zt: [],
    zjhm: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    this.setData({
      preffixUrl: app.globalData.JSB
    })
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    that.getData();


  },
  getData(){
    this.getMax().then((res) => {
      setTimeout(a => {
        wx.hideLoading({
          success: (res) => {},
        })
      }, 1500)

      if (res.ID_CARD == "") {
        wx.showModal({
          title: '提示',
          content: '请先实名认证',
          success(res) {
            if (res.confirm) {
              wx.redirectTo({
                url: '/sub1/pages/auth/index',
              })

            } else if (res.cancel) {
              wx.navigateBack({
                delta: 1,
              })
            }
          }
        })

        return;
      }
      this.setData({
        zjhm: res.ID_CARD
      })

      let dataJson = JSON.stringify({
        zjhm: res.ID_CARD,
         remark1:that.data.page,
         remark2:that.data.num
      });
      var custnameTwo = encr.jiami(dataJson, aeskey) //3段加密
      wx.request({
        url: app.globalData.YTURL + 'jsyh/queryMaxmoney.do',
        data: encr.gwRequest(custnameTwo),
        method: 'POST',
        header: {
          'content-type': 'application/json', // 默认值
        },
        success(res) {
            var jsonData = encr.aesDecrypt(res.data.body, aeskey) //解密返回的报文
            //console.log('解密queryMaxmoney返回的报文==')
            //console.log(jsonData)
            let list = jsonData.LOOPS;
            let all = that.data.allList;
            all =all.concat(list);
            // let curList = that.data.maxList;
            // let hisList = that.data.hisList
            // list.forEach((item, index) => {
            //   if (item.sjzt == 0 || item.sjzt == 3) {
            //     curList.push(item)
            //   } else {
            //     hisList.push(item)
            //   }
            // })
            // maxList: curList,
            //   hisList: hisList,
            if(list.length<10){
              that.setData({
                more:false
              })
            }else{
              that.setData({
                more:true
              })
            }

            that.setData({
              allList:all,
              param: JSON.stringify(all),
            })
          
        },
        fail(err) {}
      })
    }).catch((err) => {
      wx.hideLoading({
        success: (res) => {},
      })
    })
  },
  pagger(){
    let page = that.data.page
     if(that.data.more){
       page++;
       that.setData({
         page:page
       })
       that.getData();

     }else{
       wx.showToast({
         title: '暂无数据',
         icon:'none'
       })
     }
     //请求数据

  }
,  //大额取款
  getMax() {
    return new Promise((resolve, reject) => {
      //大额贷款
      let dataJson = JSON.stringify({
        openId: wx.getStorageSync('openid'),
      });
      //console.log(dataJson)
      var custnameTwo = encr.jiami(dataJson, aeskey) //3段加密
      wx.request({
        url: app.globalData.YTURL + 'jsyh/getCustomer.do',
        data: encr.gwRequest(custnameTwo),
        method: 'POST',
        header: {
          'content-type': 'application/json', // 默认值
        },
        success(res) {

          if (res.data.head.H_STATUS == 1) {
            var jsonData = encr.aesDecrypt(res.data.body, aeskey) //解密返回的报文
            //console.log('解密getCustomer返回的报文==')
            //console.log(jsonData)
            resolve(jsonData)
          }

        },
        fail(err) {
          reject()
        }
      })
    })
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
    if (that.data.zjhm == '') {
      return;
    }
    if(wx.getStorageSync('isRefresh')){
      wx.showLoading({
        title: '数据更新中',
      })
      that.setData({
        page:1,
        maxList:[],
        hisList:[],
        allList:[]
      })
      that.getData();
      setTimeout(res=>{
        wx.hideLoading({
          success: (res) => {},
        })
      },1000)
      wx.removeStorageSync('isRefresh')    }
   
   

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


})