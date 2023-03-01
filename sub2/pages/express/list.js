
const app = getApp();
var encr = require("../../utils/encrypt.js"); //国密3段式加密
var aeskey = encr.key; //随机数
//var url = 'http://66.2.41.46:8090/wxgatewaysit/';//电脑测试
//var url = "https://wxapptest.jsbchina.cn:9629/wxgatewaysit/"; //手机测试
//var url = 'https://wxapptest.jsbchina.cn:9629/wxgatewayuat/'; //手机验证环境
var url = "https://appservice.jsbchina.cn/wxgatewayuat/"; //手机生产环境
Page({
	/**
	 * 页面的初始数据
	 */
  data: {
    main: "", //跳不跳转到main
    //地址集合
    addressList: [],
    //详细下标集合
    addressIndex: [],
    custname: "",
  },

	/**
	 * 生命周期函数--监听页面加载
	 */
  onLoad: function (options) {
    //console.log();
    if (options.custname != undefined) {
      var custname = JSON.parse(options.custname);
      //console.log(custname);
      var that = this;
      that.setData({
        custname: custname,
        addressList:""
      });
      var dataJson = JSON.stringify({ custname: custname });
      var custnameTwo = encr.jiami(dataJson, aeskey); //3段加密
      wx.showLoading({
        title: "加载中...",
      });
      wx.request({
        //地址列表
        url: url + "express/senderInfoQuery.do",
        data: encr.gwRequest(custnameTwo),
        method: "POST",
        header: {
          "content-type": "application/json", // 默认值x
        },
        success: function (res) {
          var jsonData = encr.aesDecrypt(res.data.body, aeskey); //解密返回的报文
          if (jsonData.LIST != undefined) {
            that.setData({
              addressList: jsonData.LIST,
            });
            wx.hideLoading();
          }
          wx.hideLoading();
        },
      });
    }else{
      that.setData({
        addressList: "",
      });
    }
  },

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
  onReady: function () { },
  //点击到传值到main界面
  tiqu: function (e) {
    let index = e.currentTarget.dataset.gid; //下标
    // var addressList = JSON.stringify(this.data.addressList[index]);
    var addressList = this.data.addressList[index];

    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2]; // 上一页
    // 调用上一个页面的setData 方法，将数据存储
    prevPage.setData({
      addressList,
    });
    wx.navigateBack({
      delta: 1,
    });

  },

  //到编辑界面

  tianjia: function (e) {
    let index = e.currentTarget.dataset.gid;
    if (index != undefined) {
      //到修改
      var model = JSON.stringify(this.data.addressList[index]);
      wx.navigateTo({
        url: "/sub2/pages/express/edit?list=" + model,
      });
    } else {
      //到新增
      var custname = JSON.stringify(this.data.custname);
      //console.log("到新增界面"+custname)
      wx.navigateTo({
        url: "/sub2/pages/express/edit?custname=" + custname,
      });
    }
  },

  editAddress(e) {
    wx.navigateTo({
      url: "/sub2/pages/express/edit",
    });
  },
	/**
	 * 生命周期函数--监听页面显示
	 */
  onShow: function () {
    var that = this;
    //如果 isBack 为 true，就返回上一页
    if (that.data.isBack) {
      wx.navigateBack();
    }

    let custname = that.data.custname;
    var dataJson = JSON.stringify({ custname: custname });
    var custnameTwo = encr.jiami(dataJson, aeskey); //3段加密
    wx.showLoading({
      title: "加载中...",
    });
    wx.request({
      //地址列表
      url: url + "express/senderInfoQuery.do",
      data: encr.gwRequest(custnameTwo),
      method: "POST",
      header: {
        "content-type": "application/json", // 默认值x
      },
      success: function (res) {
        var jsonData = encr.aesDecrypt(res.data.body, aeskey); //解密返回的报文
        if (jsonData.LIST != undefined) {
          that.setData({
            addressList: jsonData.LIST,
          });
          wx.hideLoading();
        }
        wx.hideLoading();
      },
    });
  },
  //删除地址
  deleteAddress: function (e) {
    const index = e.currentTarget.dataset.gid;
    let list = this.data.addressList;
    let serial = list[index].SERIAL;
    let custname = list[index].CUST_NAME;
    var dataJson = JSON.stringify({
      custname: custname,
      serial: serial,
    });
    var custnameTwo = encr.jiami(dataJson, aeskey); //3段加密
    wx.showModal({
      title: "提示",
      content: "是否删除？",
      success: res => {
        if (res.confirm) {
          //console.log("用户点击确定");
          list.splice(index, 1); // 删除列表里这个
          wx.request({
            //删除地址
            url: url + "express/senderInfoDel.do",
            data: encr.gwRequest(custnameTwo),
            method: "POST",
            header: {
              "content-type": "application/json", // 默认值x
            },
            success: function (res) {
              var jsonData = encr.aesDecrypt(res.data.body, aeskey); //解密返回的报文
              res.data.body = jsonData;
              if (res.data.body.LIST != undefined) {
                that.setData({
                  addressList: res.data.body.LIST,
                });
                //console.log(that.data.addressList);
              }
            },
          });
          this.setData({
            addressList: list,
          });
        }
      },
    });
  },
	/**
	 * 生命周期函数--监听页面隐藏
	 */
  onHide: function () { },


	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
  onPullDownRefresh: function () { },

	/**
	 * 页面上拉触底事件的处理函数
	 */
  onReachBottom: function () { },

	/**
	 * 用户点击右上角分享
	 */
  onShareAppMessage: function () { },
});
