// pages/search/search.js
import utils from '../../utils';
import {custMatchInfoQuery} from '../../../api/url';

const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        history_list: [], // 历史记录表
        selected: 0,
        preffixUrl: utils.preffixUrl(),
        list: ['综合', '机构', '用户', '交易', '资讯'],
        // 搜索历史
        searchHistoryList: [{
            name: '江苏银行'
        }, {
            name: '债券信息'
        }, {
            name: '苏银金租'
        }, {
            name: '公众号'
        }],
        // 热门
        hotList: [],
        keywords:'',
        PUB_TYPE:'',
        searchHeight:'90vh'
    },
    getKeyworToSearch(e){
     console.log(e)
     let RSPTB1=e.currentTarget.dataset.keywords
     let replaceString = `<span style="color: blue">${this.data.keywords}</span>`
     RSPTB1 = RSPTB1.replace(replaceString, this.data.keywords)

    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({ 
      FUND_SUP_CUST:RSPTB1,
      selectBranch:[]
    })
    this.setData({
      keywords:e.currentTarget.dataset.keywords
    })
     wx.navigateBack({
      delta: -1,
    })
    },
    getkeywords(e){
    this.setData({
      keywords:e.detail.value,
      searchHeight:'auto'
    })
    this.getHotList()
    },
    
    goSearch(){
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({ 
      FUND_SUP_CUST:this.data.keywords,
      selectBranch:[]
    })
      wx.navigateBack({
       delta: -1,
     })
    },
    search:function(){
   if(!this.data.keywords){
     wx.showToast({
       title: '请输入关键字',
       icon:'none'
     })
     return
   }
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({ 
      FUND_SUP_CUST:this.data.keywords,
      selectBranch:[]
    })
      wx.navigateBack({
       delta: -1,
     })
    },
   
    // 删除
    onClearEvent: function (event) {
      let that=this
      wx.showModal({
        title: '提示',
        content: '确定删除历史记录？',
        success: res => {
          if (res.confirm) {
            that.clearAllHistory();
          }
        }
      });
    },
    // 清除历史记录
    clearAllHistory() {
      this.setData({
        history_list:[]
      })
      wx.clearStorageSync('SEARCHHISTORY');
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        /** 
         * 获取系统信息,系统宽高
         */
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    winWidth: res.windowWidth,
                    winHeight: res.windowHeight
                });
            }
        });
        this.data.PUB_TYPE=options.PUB_TYPE
    },

    getHotList() {
      var that= this;
      let data = {
          QUERY_TYPE:'5',
          CUST_NAME:this.data.keywords,
          PUB_TYPE:this.data.PUB_TYPE
        }
        console.log(data)
      custMatchInfoQuery(data).then(res => {
        console.log(res);
        let list=[]
        if(res.LIST){
          list = res.LIST; 
         
          list.map((item, index) => {
          if (this.data.keywords) {
          /**
           * 使用正则表达式进行全文匹配关键词
           * ig : 表示 全文查找 ,忽略大小写
           *  i : 忽略大小写
           *  g : 全文查找
           *
           * 使用字符串的replace方法进行替换
           * stringObject.replace('被替换的值',替换的值)
           */
          let replaceReg = new RegExp(this.data.keywords, 'ig')
          let replaceString = `<span style="color: blue">${this.data.keywords}</span>`
          list[index].RSPTB1 = item.RSPTB1.replace(replaceReg, replaceString)
        }
          })
        }
        that.setData({
          hotList:list
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
    // 初始化历史记录列表
    initHistory() {
      let _data = wx.getStorageSync('SEARCHHISTORY');
      if (_data) {
        this.setData({
          history_list:_data
        })
        
      }
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