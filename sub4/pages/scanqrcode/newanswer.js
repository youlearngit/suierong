// pages/mine/set_1_show.js
const app = getApp();
import utils from './utils';
import requestP from '../../../utils/requsetP';
import user from '../../../utils/user';
import {checkMobile,checkLogin,getAnswerAward} from '../../../api/mer';
import api from '../../../utils/api';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    preffixUrl: utils.preffixUrl(),
    // preffixUrl: '',
    form: {
      tel: '',//手机号
      idCard: '',
      name: '',
    },
    fandou:'',//反豆
    newfen:'',//分数
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
    });
    var that = this;
    // that.setData({
    //   preffixUrl: app.globalData.URL,
    // });
    user
      .getCustomerInfo()
      .then((res) => {
        var customer = res;
        if (customer.TEL) {
          that.setData({
            form: {
              tel: customer.TEL,
            },
          });
        }
        wx.hideLoading();
      })
  },
  getPhoneNumber3(e) {
    // var that = this;
    wx.showLoading({
      title: '获取中...',
    });
    api
      .getPhoneNumber(e)
      .catch((err) => {
         //点击允许后跳转答题
          console.log(this.data.form.tel);//手机号码
          console.log(err.msg);//网络错误:500
          console.log(err.message);
            //判断是否是外汇管家
            let dataInfo = {
              mobile:this.data.form.tel,//手机号码判断是否是0时打开、
              // mobile:'51492801'//这个是接口手机号，判断是不是1打开，测试数据
              // mobile:'18862236710'//这个是接口手机号，判断是不是1打开，测试数据
            }
            checkMobile(dataInfo).then(item => {
           if(err.message == '您点击了拒绝授权,无法获取该服务'){
               wx.showToast({
                 title: '您点击了拒绝授权,无法获取该服务',
                 icon: 'none'
               })
               return
           }
              if(item.avtiveFlag == 0){//判断是否是外汇管家
                wx.showModal({
                  title: '提示',
                  content: '感谢您的参与，本次活动仅限江苏银行外汇管家客户参与哦！',
                  success: function (res) {
                    if (res.confirm) { //这里是点击了确定以后
                      console.log('用户点击确定')
                    } else { //这里是点击了取消以后
                      console.log('用户点击取消')
                    }
                  }
                })
           
             }else if(item.avtiveFlag == 1){ //判断是否是外汇管家
               // 判断是否第二次登录
            
                    let datamito = {
                        OPEN_ID:wx.getStorageSync('openid')//微信id
                    }
                  console.log(datamito);
                  checkLogin(datamito).then(item => {
                      if(item.flag == 0){//第一次进入页面
                        wx.navigateTo({//跳转答题页面
                            url: '/sub4/pages/scanqrcode/topic?tel='+this.data.form.tel,//将手机号码传到答题页面中
                        })
                      }
                      console.log(item.STATUS);
                       if(item.flag == 1){//第二次进入页面跳转分数页
                        let datijieg = {
                            openId:wx.getStorageSync('openid')//微信id
                        }
                        getAnswerAward(datijieg).then(item => {

                            console.log(item.AWARD_NUMBER,item.SCORE);
                            this.setData({
                                fandou:item.AWARD_NUMBER,
                                newfen:item.SCORE//分数
                            })
                            console.log(item.SCORE);
                               console.log(datijieg);
                               console.log(item);
                               wx.navigateTo({
                                url: './grade?fandou='+ this.data.fandou + '&gtvh='+item.SCORE,//把正确分数传过去
                                // url: './grade?fandou='+this.data.fandou+'&'+item.SCORE,//将手机号码传到分数页面中
                              })
                       })

                        
                      
                      }
                        console.log(datamito);
                        console.log(item);
                  })

                
              }
              console.log(dataInfo);
              console.log(item);
              })
        
      });

    wx.hideLoading();
  },


  cancle(){//取消授权进入首页
    wx.switchTab({//首页tabbar页面
      url: '/pages/shop/index2',
    })
  }
});
