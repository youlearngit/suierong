// sub3/pages/reservedAccChg/progress.js
var app = getApp();
var that;

import user from '../../../utils/user';
import org from '../../../api/Org'
var encr = require('../../../utils/encrypt/encrypt'); //国密3段式加密
var aeskey = encr.key //随机数

Page({

  /**
   * 页面的初始数据
   */
  data: {
    preffixUrl: app.globalData.CDNURL,
    page: 0,
    info: [],
    height: wx.getSystemInfoSync().windowHeight - 15,
    isEnd: false,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.getData()
  },
  getData() {
    return new Promise((resolve, reject) => {
      if (that.data.isEnd) {
        wx.showToast({
          title: '暂无更多数据',
          icon: 'none'
        })
        return;
      }
      wx.showLoading({
        title: '查询中',
        mask: true
      })

      user
        .getCustomerInfo()
        .then(res => {
          this.setData({
            int_id: res.INT_ID ? res.INT_ID : ""
          })
          let int_id = res.INT_ID ? res.INT_ID : "";
          this.getList()
          // let dataJson = JSON.stringify({
          //   intId: int_id + '',
          //   startNo: (this.data.page == 0 ? '0' : (this.data.page + '0'))
          // })
          // console.log(dataJson);
          // let custnameTwo = encr.jiami(dataJson, aeskey) //3段加密
          // wx.request({
          //   url: app.globalData.YTURL + 'judge/wxpubseachProcess.do',
          //   data: encr.gwRequest(custnameTwo),
          //   method: 'POST',
          //   success(res) {
          //     console.log(res);
          //     wx.hideLoading({
          //       success: (res) => {},
          //     })
          //     if (res.data.head.H_STATUS != '1') {
          //       wx.showToast({
          //         title: res.data.head.H_MSG,
          //         icon: 'none'
          //       })
          //       reject({
          //         err: 0
          //       });
          //       return;
          //     }
          //     let json = encr.aesDecrypt(res.data.body, aeskey) //解密返回的报文
          //     console.log(json);
          //     if (json.msgCode != '0000') {
          //       wx.showToast({
          //         title: json.msg,
          //         icon: 'none'
          //       })
          //       return;
          //     }
          //     let ent = that.data.info
          //     if (json.list015 === '[]') {
          //       that.setData({
          //         isEnd: true
          //       })
          //       return;
          //     }
          //     let data = JSON.parse(json.list015)
          //     console.log(data);
          //     if (data.length < 10 && !that.data.isEnd) {
          //       let count = that.data.page;
          //       count++;
          //       that.setData({
          //         page: count
          //       })
          //       ent = ent.concat(data)
          //     }

          //     if (data.length == 10) {
          //       let count = that.data.page;
          //       count++;
          //       that.setData({
          //         page: count
          //       })
          //       ent = ent.concat(data)
          //     } else {
          //       that.setData({
          //         isEnd: true
          //       })
          //     }
          //     wx.showToast({
          //       title: '查询成功',
          //     })

          //     that.setData({
          //       info: ent,

          //     })
          //   },
          //   fail(err) {}
          // })
        })
        .catch(err => {});

    })
  },
  getList() {
    let ent = that.data.info
    let dataJson = JSON.stringify({
      intId: JSON.stringify(this.data.int_id),
      startNo: '0'
    })
    console.log(dataJson);
    let custnameTwo = encr.jiami(dataJson, aeskey) //3段加密
    wx.request({
      url: app.globalData.YTURL + 'judge/wxpubseachProcess.do',
      data: encr.gwRequest(custnameTwo),
      method: 'POST',
      success(res) {
        wx.hideLoading({
          success: (res) => {},
        })
        if (res.data.head.H_STATUS != '1') {
          wx.showToast({
            title: res.data.head.H_MSG,
            icon: 'none'
          })

          return;
        }
        let json = encr.aesDecrypt(res.data.body, aeskey) //解密返回的报文
        let data = JSON.parse(json.list015)
        // 
        console.log(json);
        console.log(data);
        if (json.msgCode != '0000') {
          wx.showToast({
            title: json.msg,
            icon: 'none'
          })
          that.setData({
            info: data,

          })
          return;
        }

        if (json.list015 === '[]') {
          that.setData({
            isEnd: true,
            info: [],
          })
    
        }

        if (data.length < 10 && !that.data.isEnd) {
          let count = that.data.page;
          count++;
          that.setData({
            page: count
          })
          ent = ent.concat(data)
        }

        if (data.length == 10) {
          let count = that.data.page;
          count++;
          that.setData({
            page: count
          })
          ent = ent.concat(data)
        } else {
          that.setData({
            isEnd: true
          })
        }
        wx.showToast({
          title: '查询成功',
        })
        ent = data
        console.log(ent);
        that.setData({
          info: ent,

        })
      },
      fail(err) {}
    })
  },
  getdelete(e) {
    console.log(e.currentTarget.dataset.type.yyh);
    let that = this
    wx.showModal({
      title: '提示',
      content: '确认删除？',
      success: function (res) {
        //弹窗后执行，可以省略
        if (res.confirm) {
            console.log(that.data.int_id);
            let data = {
              INT_ID: JSON.stringify(that.data.int_id),
              YYH:e.currentTarget.dataset.type.yyh
            }
            org.wxPubDel(data).then(res => {
              console.log(res);
              wx.showToast({
                title: '删除成功',
              })
              that.getList()
            })
        } else if (res.cancel) {
          console.log('取消')
        }

      }
    })


  },
  nav(e) {

    let index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: './company?e015=' + JSON.stringify(that.data.info[index]),
    })
    // url="./company?p1={{item.shxydm}}&p2={{item.zh}}&p3={{item.wdh}}&remark21={{item.remark21}}&remark22={{item.remark22}}&remark23={{item.remark23}}&remark24={{item.remark24}}"
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