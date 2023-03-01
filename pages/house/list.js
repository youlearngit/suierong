var util = require('../../utils/util.js');
var qqmapsdk;
const app = getApp();
import House from '../../api/House'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    buildingname:[],
    dizhi:[],
    gujia:[],
    shijian:[],
    shijian1:[],
    list1:[],
    kedai:[],
    area:[],
    floor3:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      preffixUrl: app.globalData.URL,
    })

    House.getHouseInfoByUserID().then(res=>{
        let s = [];
        if (res.length>0) {
          for (let i = 0; i < res.length; i++) {
            //console.log(res[i].BUILDINGNAME)
            s.push({
              buildingname: res[i].COMMUNITYNAME,
              dizhi: res[i].ADDRESS,
              gujia: (res[i].SALEPRICE * 0.0001).toFixed(0),
              kedai: (res[i].SALEPRICE*0.00007).toFixed(0),
              shijian: res[i].CREATE_DATE.substring(4,6),
              shijian1: res[i].CREATE_DATE.substring(6,8), 
              area:res[i].AREA,
              floor3: res[i].FLOORNUMBER
            })
          }
        }
        this.setData({
          list1:s
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