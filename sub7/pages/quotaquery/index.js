// sub1/pages/quotaquery/index.js

import { bankIdQuery,cerditLimitQuery } from '../../../api/suierong';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cndUrl: app.globalData.CDNURL,
    name:'',
    bank:'',
    account:'',
    status:1,
    creditBalance:'0',
    bankName:'江苏银行股份有限公司',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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
   * 客户名称
   */
  onReadskhmc(e){
    console.log(e);
    var that = this;
    var value = e.detail.value;
    that.setData({
      name:value
    })
  },
  /**
   * 银行名称
   */
  onReadsyhmc(e){
    console.log(e);
    var that = this;
    var value = e.detail.value;
    that.setData({
      bank:value
    })
  },
  /**
   * 银行行号
   */
  onReadsyhhh(e){
    console.log(e);
    var that = this;
    var value = e.detail.value;
    that.setData({
      account:value
    })
  },
/**
   * 额度查询
   */
  search(){
    var that= this;
    var bank = that.data.bank;
    if(!bank){
      wx.showToast({
        title: '请输入银行名称',
        icon:'none'
      })
      return;
    }
    // if(!account){
    //   wx.showToast({
    //     title: '请输入银行行号',
    //     icon:'none'
    //   })
    //   return;
    // }
      var that= this;
      console.log(11222);
      // console.log(salary);
      let data = {
        bankNm:bank
      }
      bankIdQuery(data).then(res => {
        console.log(res);
        console.log(res, 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
        if(res.RESULT_CODE == '0000'){
          that.setData({
            account:res.bankNo
          })
           that.cerditLimitQuery(res);
        }else if(res.RESULT_CODE == '1111'){

          wx.showModal({
            title: '提示',
            content: res.RESULT_MSG,
            showCancel:false,
            confirmColor:'#3D66E9'
          })
          // wx.showToast({
          //   title: res.RESULT_MSG,
          //   icon:'none',
          //   mask:true
          // })
        }
        // console.log(JSON.parse(res.loopListString));
      })
  },
  cerditLimitQuery(value){
    console.log(value,'11111111')
    var that = this;
    var name = that.data.name;
    var bank = that.data.bank;
    if(!name){
      wx.showToast({
        title: '请输入客户名称',
        icon:'none'
      })
      return;
    }
    if(!bank){
      wx.showToast({
        title: '请输入银行名称',
        icon:'none'
      })
      return;
    }
    var data = {
      custNm:name, 
      bankNo:value.bankNo,
      bankNm:value.bankNm
    };
    cerditLimitQuery(data).then(res => {
      console.log(res,'222222');
      var  creditBalance = 0.00;
      if(res.RESULT_CODE == '0000'){

        if(res.creditType == 3){
          wx.showToast({
            title: '查询成功',
            duration:1500,
            success:function(){
              setTimeout(function(){
                that.setData({
                  status:3
                })
              },1500)
            }
          })

        }else{

          wx.showToast({
            title: '查询成功',
            duration:1500,
            success:function(){
              setTimeout(function(){
                that.setData({
                  creditBalance:res.creditBalance,
                  bankName:value.bankNm,
                  status:2
                })
              },1500)
            }
          })
        }
        
      }else if(res.RESULT_CODE == '1111' ){
        console.log(66666666);
        wx.showModal({
          title: '提示',
          content: res.RESULT_MSG,
          showCancel:false,
          confirmColor:'#3D66E9'
        })
        // wx.showToast({
        //   title: res.RESULT_MSG,
        //   icon:'none'
        // })
      }


    })
  },
  back(){
    this.setData({
      name:'',
      bank:'',
      account:'',
      status:1
    })
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